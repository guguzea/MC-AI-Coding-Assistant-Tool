#!/usr/bin/env node
/**
 * npm postinstall —— 可选的 data 资产provisioning。
 *
 * 契约（**最重要的一条**）：**本脚本永远不因 data 下载失败而让 `npm install` 失败**。
 * data 是「可选增强」，不是安装前提；挂在 postinstall 上失败会让用户卡在一个删不掉的
 * 半安装状态（npm 会把包标记为 installed，但用户拿不到任何 data，且重试成本极高）。
 * 因此所有失败路径都走 warn + exit 0。
 *
 * 触发方式：`npm install mc-ai-coding-assistant-tool --data`
 *   npm 会把未知 flag 归一化成环境变量 `npm_config_data=true` 给 lifecycle 脚本。
 *   不传 `--data` ⇒ 该变量 undefined ⇒ 本脚本只打印提示、**不联网**、exit 0。
 *
 * 环境变量
 *   npm_config_data          由 `npm install <pkg> --data` 注入（"true" / "1" 视为「要」）
 *   npm_config_withdata      某些 npm 版本把 `--with-data` 归一化到这里，一并认
 *   MC_SKILL_SKIP_DATA_DOWNLOAD=1   显式跳过（优先级最高，在判定 --data 之前）
 *   MC_SKILL_SKIP_DOWNLOAD=1         同上；本仓库 CI / release workflow 的 job 级 env 设的就是它
 *   MC_SKILL_UPDATE_REPO             覆盖仓库（默认 guguzea/MC-AI-Coding-Assistant-Tool，与 src/update/github.ts 一致）
 *   MC_SKILL_GITHUB_TOKEN            可选，提高 API 限额（与 src/update/github.ts 一致）
 *   MC_SKILL_GITHUB_API_BASE         可选，API 镜像（与 src/update/http.ts:82 一致；只改 API 主机，不改资产主机）
 *   MC_SKILL_DATA_DOWNLOAD_TIMEOUT_MS  下载超时，默认 600000（与 src/update/download.ts 一致）
 *   HTTPS_PROXY / HTTP_PROXY / ALL_PROXY   仅 curl 回退路径使用（与 src/update/http.ts:104 一致）
 *   MC_SKILL_DATA_DRYRUN=1
 *     ⚠️ **仅供开发/测试自检使用，不是给用户用的开关。**
 *     它只打印「将要下载什么 / 解压到哪里 / 校验和从哪来」，不发起资产下载、不落盘。
 *     存在的唯一理由：data 资产 400–700 MB，本机 GitHub 网络常常不通，无法靠真跑验收分支走向。
 *     任何面向用户的文档都不应提及它。
 *
 * 为什么自带实现而不 import `../dist/update/*.js`：
 *   postinstall 是**引导脚本**，跑在构建产物之前。本仓库自己的 `npm ci` 就在 `npm run build`
 *   之前（release workflow:66-71），此时 `dist/` 可能根本不存在；而且 dist 的模块图会连带
 *   `utils/actionable.js` → `update/semver.js`，一旦那边重构就会把 npm install 弄挂。
 *   引导脚本必须自包含且**永不抛**。下面几处是刻意与 src 保持同形的镜像，改动请同步：
 *     · host 白名单        → src/update/hosts.ts（精确集合，无后缀通配）
 *     · API base 重写      → src/update/http.ts:81 rewriteGithubApiUrl
 *     · Windows TLS 回退   → src/update/http.ts:294（curl.exe --ssl-no-revoke）
 *     · 重定向终址复核      → src/update/http.ts:206 / :254（起址白名单不算数，终址也要）
 *     · 资产挑选正则        → src/update/github.ts:338 pickDataAssets
 *     · releases 列表校验   → src/update/github.ts:215 / :228（畸形 200 体不得当成「仓库没有 Release」）
 *     · 429/404/403 处理    → src/update/github.ts:76 / :183
 *   若 dist/update/hosts.js 已存在，本脚本会拿它做一次白名单漂移自检（漂移只 warn，不 fail）。
 */

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, unlinkSync } from "node:fs";
import { open } from "node:fs/promises";
import { dirname, join, resolve as resolvePath, sep } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { createInflateRaw } from "node:zlib";

const LOG = "[mc-ai-coding-assistant-tool]";
/** <pkg>/ 根（dist/、package.json 的同级） */
const PKG_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
/** 解压目标：<pkg>/data/ —— 与 Release zip 里的 data/ 内容一一对应 */
const DATA_DIR = join(PKG_ROOT, "data");

const REPO = (process.env.MC_SKILL_UPDATE_REPO || "guguzea/MC-AI-Coding-Assistant-Tool").trim();

/** 与 src/update/hosts.ts:19 的 ALLOWED_GITHUB_HOSTS 同形（精确集合，无后缀通配）。 */
const ALLOWED_GITHUB_HOSTS = new Set([
  "api.github.com",
  "github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
]);

/** 与 src/update/zip-path-guard.ts 的 WINDOWS_RESERVED 同形。 */
const WINDOWS_RESERVED = new Set([
  "CON", "PRN", "AUX", "NUL",
  ...Array.from({ length: 9 }, (_, i) => `COM${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `LPT${i + 1}`),
]);

function info(msg) {
  process.stdout.write(`${LOG} ${msg}\n`);
}

function warn(msg) {
  process.stderr.write(`${LOG} WARN: ${msg}\n`);
}

function fatal(msg) {
  process.stderr.write(`${LOG} ERROR: ${msg}\n`);
}

function isTruthyFlag(raw) {
  if (raw === undefined || raw === null) return false;
  const v = String(raw).trim().toLowerCase();
  // 空串按「没传」处理：fail-safe —— 绝不因为一个空值就去拉 700 MB。
  if (v === "" || v === "false" || v === "0" || v === "no" || v === "off") return false;
  return true;
}

function truthyEnv(name) {
  return isTruthyFlag(process.env[name]);
}

function dataRequested() {
  return isTruthyFlag(process.env.npm_config_data) || isTruthyFlag(process.env.npm_config_withdata);
}

function skipRequested() {
  return truthyEnv("MC_SKILL_SKIP_DATA_DOWNLOAD") || truthyEnv("MC_SKILL_SKIP_DOWNLOAD");
}

/** 仅供开发自检，见文件头注释。 */
function dryRun() {
  return truthyEnv("MC_SKILL_DATA_DRYRUN");
}

function apiTimeoutMs() {
  const n = Number(process.env.MC_SKILL_GITHUB_TIMEOUT_MS ?? 25000);
  return Number.isFinite(n) && n > 0 ? n : 25000;
}

function downloadTimeoutMs() {
  const n = Number(process.env.MC_SKILL_DATA_DOWNLOAD_TIMEOUT_MS ?? 600000);
  return Number.isFinite(n) && n > 0 ? n : 600000;
}

function proxyUrl() {
  const proxy =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy;
  return proxy?.trim() || undefined;
}

/** https + 精确 host 集合（与 src/update/hosts.ts:30 isAllowedGithubHost 同形，含镜像 host 例外）。 */
function isAllowedGithubUrl(urlStr) {
  let u;
  try {
    u = new URL(urlStr);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  const h = u.hostname.toLowerCase();
  if (ALLOWED_GITHUB_HOSTS.has(h)) return true;
  const envBase = process.env.MC_SKILL_GITHUB_API_BASE;
  if (envBase) {
    try {
      return new URL(envBase).hostname.toLowerCase() === h;
    } catch {
      return false;
    }
  }
  return false;
}

/** 与 src/update/http.ts:81 同形：只重写 API 主机，资产主机不动。 */
function rewriteGithubApiUrl(url) {
  const base = (process.env.MC_SKILL_GITHUB_API_BASE || "https://api.github.com").replace(/\/$/, "");
  if (url.startsWith("https://api.github.com")) return base + url.slice("https://api.github.com".length);
  return url;
}

function collectErrorText(err) {
  const e = err || {};
  const cause =
    e.cause instanceof Error
      ? `${e.cause.message}${e.cause.code ? ` [${e.cause.code}]` : ""}`
      : e.cause
        ? String(e.cause)
        : "";
  return [e.name, e.message, e.code, cause].filter(Boolean).join(" | ");
}

function isTlsCertError(err) {
  return /UNABLE_TO_VERIFY|CERT_|SELF_SIGNED|unable to verify the first certificate|unable to get local issuer|UNABLE_TO_GET_ISSUER/i.test(
    collectErrorText(err),
  );
}

/** 与 src/update/http.ts:94 同形，用于失败时给用户指路。 */
function networkNextSteps() {
  return [
    "浏览器能打开 github.com 不代表 Node 能访问 api.github.com（证书库不同；系统代理也不会自动给 Node）",
    "Windows：本脚本会在 TLS 证书失败时自动改用 curl.exe --ssl-no-revoke",
    "若使用 Clash/V2Ray：设置 HTTPS_PROXY=http://127.0.0.1:<端口>",
    "可选：MC_SKILL_GITHUB_TOKEN；MC_SKILL_GITHUB_API_BASE 指向可用镜像；NODE_EXTRA_CA_CERTS 指向公司根证书",
    "手动兜底：从 GitHub Release 下载 mc-skill-data-full-<tag>.zip 并解压到 <pkg>/data/",
  ];
}

function apiHeaders() {
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "MC-AI-Coding-Assistant-Tool-installer",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = (process.env.MC_SKILL_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "").trim();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function encodeRepoPath(repo) {
  return repo
    .split("/")
    .filter(Boolean)
    .map((p) => encodeURIComponent(p))
    .join("/");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function humanBytes(n) {
  if (!Number.isFinite(n) || n < 0) return "?";
  const units = ["B", "KB", "MB", "GB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${i === 0 ? v : v.toFixed(1)}${units[i]}`;
}

/* ─────────────────────────── Release 解析 ─────────────────────────── */

/**
 * 取 releases/latest（含预发布，与 src/update/github.ts:291 resolveRelease(channel:"latest") 同形：
 * 它走列表接口而不是 /releases/latest，因为后者会排除 prerelease）。
 */
async function resolveLatestRelease() {
  const url = rewriteGithubApiUrl(`https://api.github.com/repos/${encodeRepoPath(REPO)}/releases?per_page=10&page=1`);
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), apiTimeoutMs());
  let res;
  try {
    res = await fetch(url, { headers: apiHeaders(), signal: ac.signal, redirect: "follow" });
  } catch (err) {
    clearTimeout(timer);
    throw new Error(`无法连接 GitHub API: ${collectErrorText(err)} @ ${url}\n  可尝试：\n    - ${networkNextSteps().join("\n    - ")}`);
  }
  clearTimeout(timer);

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after") || "60");
    throw new Error(`GitHub API 限速 (429)，约 ${retryAfter}s 后可重试；也可设置 MC_SKILL_GITHUB_TOKEN`);
  }
  if (res.status === 404) {
    throw new Error(`GitHub API HTTP 404：仓库 ${REPO} 或其 Release 不存在`);
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error(`GitHub API HTTP ${res.status}（鉴权/权限）：检查 MC_SKILL_GITHUB_TOKEN / GITHUB_TOKEN`);
  }
  if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);

  const batch = await res.json();
  // 200 的对象体（代理/镜像改写）此前与「空数组」同走 break，会被静默当成「仓库没有 Release」。
  if (!Array.isArray(batch)) {
    throw new Error("GitHub releases 响应不是数组（代理/镜像可能改写了 JSON 结构；检查 MC_SKILL_GITHUB_API_BASE）");
  }
  // 消费者会解引用 .assets / .tag_name，畸形元素必须在这里被剔除。
  const valid = batch.filter(
    (r) => r && typeof r === "object" && typeof r.tag_name === "string" && Array.isArray(r.assets),
  );
  if (batch.length > 0 && valid.length === 0) {
    throw new Error("GitHub releases 列表元素无法解析（缺少 tag_name 或 assets）——不要把它当成「仓库没有 Release」");
  }
  const release = valid.find((r) => !r.draft);
  if (!release) throw new Error(`仓库 ${REPO} 还没有已发布的 GitHub Release`);
  return release;
}

/** 与 src/update/github.ts:338 pickDataAssets 的挑选口径同形。 */
function pickAssets(release) {
  const assets = release.assets || [];
  const zip =
    assets.find((a) => /^mc-skill-data-full-.*\.zip$/i.test(a.name || "")) ||
    assets.find((a) => /^data\.zip$/i.test(a.name || ""));
  if (!zip) {
    const names = assets.map((a) => a.name).filter(Boolean);
    throw new Error(
      `Release ${release.tag_name} 里没有 data 资产（期望 mc-skill-data-full-<tag>.zip）。实际资产：${names.join(", ") || "<无>"}`,
    );
  }
  const sums = assets.find((a) => /^SHA256SUMS/i.test(a.name || ""));
  // GitHub Release API 的 asset.digest，形如 sha256:<64hex>（src/update/github.ts:332）
  const dm = String(zip.digest || "").trim().match(/^sha256:([a-fA-F0-9]{64})$/i);
  return { zip, sums, digestSha256: dm ? dm[1].toLowerCase() : undefined };
}

/** 从 `SHA256SUMS-<tag>.txt` 里按 basename 取对应项（workflow 里 sha256sum 产出的就是裸文件名）。 */
async function sha256FromSums(sumsAsset) {
  if (!sumsAsset?.browser_download_url) return undefined;
  if (!isAllowedGithubUrl(sumsAsset.browser_download_url)) return undefined;
  const res = await fetch(rewriteGithubApiUrl(sumsAsset.browser_download_url), {
    headers: { "User-Agent": "MC-AI-Coding-Assistant-Tool-installer" },
    redirect: "follow",
  });
  if (!res.ok) return undefined;
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const target = sumsAsset.name.replace(/^SHA256SUMS/i, "").replace(/\.txt$/i, "");
  for (const raw of lines) {
    // `<64hex>  <name>`（sha256sum 双空格）或 `<64hex> *<name>`（二进制模式）
    const m = raw.match(/^([a-fA-F0-9]{64})\s+\*?(.+?)\s*$/);
    if (!m) continue;
    const name = m[2].replace(/^\.\//, "");
    if (name === target || name.replace(/^.*\//, "") === target) return m[1].toLowerCase();
  }
  return undefined;
}

/* ─────────────────────────── 下载 ─────────────────────────── */

/**
 * curl.exe 回退（仅 Windows + Node TLS 证书失败时；对照 src/update/http.ts:211 curlGetToFile）。
 * 关键：**跟随重定向后必须复核终址**，只校验起址等于把「白名单外的终点」放进信任区。
 */
function curlDownload(url, destPath) {
  const args = [
    "-sS", "-L", "--ssl-no-revoke",
    "--max-time", String(Math.max(5, Math.ceil(downloadTimeoutMs() / 1000))),
    "--progress-bar",
    "-o", destPath,
    "-w", "%{http_code} %{url_effective}",
  ];
  const proxy = proxyUrl();
  if (proxy) args.push("-x", proxy);
  args.push(url);
  const r = spawnSync("curl.exe", args, { encoding: "utf8", windowsHide: true, timeout: downloadTimeoutMs() + 15000 });
  const out = (r.stdout || "").trim();
  const sp = out.indexOf(" ");
  const status = Number(sp === -1 ? out : out.slice(0, sp)) || 0;
  const effective = sp === -1 ? "" : out.slice(sp + 1).trim();
  if (!effective) throw new Error(`curl 未回报终址（url_effective 为空），拒绝该下载${r.stderr ? `: ${r.stderr.trim()}` : ""}`);
  if (!isAllowedGithubUrl(effective)) throw new Error(`拒绝重定向到未白名单主机: ${effective}`);
  if (status < 200 || status >= 300) throw new Error(`curl HTTP ${status}`);
  if (!existsSync(destPath)) throw new Error("curl 未产出文件");
}

/**
 * 流式下载 + 进度 + 边下边算 sha256。写 `.part`，成功后才改名（对齐「不留下半个文件」的约定）。
 */
async function downloadZip(url, destPath) {
  if (!isAllowedGithubUrl(url)) throw new Error(`拒绝下载非白名单主机: ${url}`);

  let lastErr = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const partPath = `${destPath}.part`;
    try {
      if (existsSync(partPath)) unlinkSync(partPath);
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), downloadTimeoutMs());
      let res;
      try {
        res = await fetch(url, {
          signal: ac.signal,
          headers: { "User-Agent": "MC-AI-Coding-Assistant-Tool-installer" },
          redirect: "follow",
        });
        // redirect:"follow" 已由 undici 跟完跳板，res.url 即终址；必须复检后才许落盘。
        const landed = res.url || url;
        if (!isAllowedGithubUrl(landed)) throw new Error(`重定向后跳出白名单: ${landed}`);
        if (res.status === 404 || res.status === 403) throw new Error(`HTTP ${res.status}（不重试）`);
        if (res.status === 429) {
          const retryAfter = Number(res.headers.get("retry-after") || "5");
          if (attempt < 3) {
            await sleep(Math.min(Math.max(retryAfter, 1) * 1000, 60000));
            continue;
          }
          throw new Error("HTTP 429 限速（已重试）");
        }
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const total = Number(res.headers.get("content-length") || 0);
        const hash = createHash("sha256");
        let received = 0;
        let lastPrint = 0;
        const meter = new Transform({
          transform(chunk, _enc, cb) {
            received += chunk.length;
            hash.update(chunk);
            const now = Date.now();
            // 400–700 MB 必须有进度；每 400ms 一帧，且只在有变化时打印。
            if (now - lastPrint > 400) {
              lastPrint = now;
              const pct = total > 0 ? ` (${((received / total) * 100).toFixed(1)}%)` : "";
              process.stdout.write(`${LOG} 下载中 ${humanBytes(received)}${total ? `/${humanBytes(total)}` : ""}${pct}\r`);
            }
            cb(null, chunk);
          },
        });
        await pipeline(Readable.fromWeb(res.body), meter, createWriteStream(partPath));
        process.stdout.write(`${LOG} 下载完成 ${humanBytes(received)}          \n`);
        const { size } = statSync(partPath);
        if (total > 0 && size !== total) throw new Error(`下载不完整：期望 ${total} 字节，实得 ${size} 字节`);
        renameSync(partPath, destPath);
        return hash.digest("hex");
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      lastErr = collectErrorText(err);
      try {
        if (existsSync(partPath)) unlinkSync(partPath);
      } catch {
        /* ignore */
      }
      // Windows TLS 证书失败 → curl.exe --ssl-no-revoke（公司网关根证书只在系统库里）
      if (attempt === 1 && process.platform === "win32" && isTlsCertError(err)) {
        info("Node fetch 撞上 TLS 证书错误，改用 curl.exe 重试…");
        try {
          curlDownload(url, destPath);
          return sha256File(destPath);
        } catch (curlErr) {
          lastErr = `Node TLS 失败且 curl 回退失败: ${collectErrorText(curlErr)}`;
        }
      }
      if (attempt < 3) await sleep(1000 * 2 ** (attempt - 1));
    }
  }
  throw new Error(`data 下载失败（重试 3 次）: ${lastErr}\n  可尝试：\n    - ${networkNextSteps().join("\n    - ")}`);
}

function sha256File(path) {
  return new Promise((resolvePromise, rejectPromise) => {
    const hash = createHash("sha256");
    const rs = createReadStream(path);
    rs.on("data", (c) => hash.update(c));
    rs.on("error", rejectPromise);
    rs.on("end", () => resolvePromise(hash.digest("hex")));
  });
}

/* ─────────────────────────── ZIP 解压（纯 Node，无新依赖） ─────────────────────────── */

function isWindowsReservedName(name) {
  for (const part of name.replace(/\\/g, "/").split("/")) {
    if (!part) continue;
    const stem = part.replace(/[.\s]+$/, "").toUpperCase();
    if (!stem) continue;
    if (WINDOWS_RESERVED.has(stem)) return true;
    if (WINDOWS_RESERVED.has(stem.replace(/\.[^.]+$/, ""))) return true;
  }
  return false;
}

/** 与 src/utils/zip-path-guard.ts:30 isUnsafeZipEntry 同形（fail-closed）。 */
function isUnsafeZipEntry(name) {
  const n = name.replace(/\\/g, "/");
  if (!n || n === ".") return true;
  if (n.startsWith("/")) return true;
  if (/^[a-zA-Z]:/.test(n)) return true;
  if (n.split("/").some((p) => p === "..")) return true;
  if (isWindowsReservedName(n)) return true;
  return false;
}

/** ZIP 通用位标记 bit11 = 文件名是 UTF-8。 */
function decodeEntryName(buf, flags) {
  if (flags & 0x800) return buf.toString("utf8");
  // Info-ZIP 在 Linux 上打包非 ASCII 名时会置 bit11；没置位时按 utf8 解，若往返不等则退回 latin1。
  const asUtf8 = buf.toString("utf8");
  return Buffer.compare(Buffer.from(asUtf8, "utf8"), buf) === 0 ? asUtf8 : buf.toString("latin1");
}

function readZip64Extra(extra, need) {
  // zip64 扩展字段：只包含「溢出为 0xFFFF/0xFFFFFFFF 的那几个」，顺序固定为
  // uncompressedSize, compressedSize, localHeaderOffset, diskStart。
  let off = 0;
  while (off + 4 <= extra.length) {
    const id = extra.readUInt16LE(off);
    const size = extra.readUInt16LE(off + 2);
    const body = extra.subarray(off + 4, off + 4 + size);
    if (id === 0x0001) {
      const out = [];
      let p = 0;
      for (let i = 0; i < need && p + 8 <= body.length; i++) {
        out.push(Number(body.readBigUInt64LE(p)));
        p += 8;
      }
      return out;
    }
    off += 4 + size;
  }
  return [];
}

async function readTail(filePath, len) {
  const fh = await open(filePath, "r");
  try {
    const { size } = await fh.stat();
    const want = Math.min(len, size);
    const buf = Buffer.alloc(want);
    await fh.read(buf, 0, want, size - want);
    return buf;
  } finally {
    await fh.close();
  }
}

async function readRange(filePath, start, len) {
  const fh = await open(filePath, "r");
  try {
    const buf = Buffer.alloc(len);
    await fh.read(buf, 0, len, start);
    return buf;
  } finally {
    await fh.close();
  }
}

/** 定位中央目录：EOCD → （需要时）ZIP64 EOCD。 */
async function locateCentralDirectory(filePath) {
  const tail = await readTail(filePath, 65557 + 22);
  let eocd = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (tail[i] === 0x50 && tail[i + 1] === 0x4b && tail[i + 2] === 0x05 && tail[i + 3] === 0x06) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("无法解析 ZIP EOCD（文件不是有效 zip，或下载被截断）");

  let count = tail.readUInt16LE(eocd + 10);
  let cdOffset = tail.readUInt32LE(eocd + 16);
  // zip64：计数/偏移被写成哨兵值时，改读 ZIP64 EOCD。
  if (count === 0xffff || cdOffset === 0xffffffff) {
    const loc = eocd - 20;
    if (loc < 0 || tail.readUInt32LE(loc) !== 0x07064b50) {
      throw new Error("ZIP 声明为 zip64 但缺少 ZIP64 EOCD locator");
    }
    const z64 = Number(tail.readBigUInt64LE(loc + 8));
    const head = await readRange(filePath, z64, 56);
    if (head.readUInt32LE(0) !== 0x06064b50) throw new Error("ZIP64 EOCD 签名不符");
    count = Number(head.readBigUInt64LE(32));
    cdOffset = Number(head.readBigUInt64LE(48));
  }
  const { size } = statSync(filePath);
  if (cdOffset < 0 || cdOffset > size) throw new Error(`中央目录偏移越界（zip 可能已损坏）`);
  return { count, cdOffset };
}

/** 流式解析中央目录，逐条 yield {name, method, compSize, localOffset}（内存有界）。 */
async function* readCentralDirectory(filePath, cdOffset, expected) {
  const { size } = statSync(filePath);
  const end = Math.min(size, cdOffset + 64 * 1024 * 1024);
  const stream = createReadStream(filePath, { start: cdOffset, end: end - 1 });
  let buf = Buffer.alloc(0);
  let seen = 0;
  for await (const chunk of stream) {
    buf = buf.length ? Buffer.concat([buf, chunk]) : chunk;
    for (;;) {
      if (buf.length < 46) break;
      if (buf.readUInt32LE(0) !== 0x02014b50) {
        throw new Error(`中央目录在第 ${seen}/${expected} 条中断（签名不符：截断或伪造）`);
      }
      const flags = buf.readUInt16LE(8);
      const method = buf.readUInt16LE(10);
      let compSize = buf.readUInt32LE(20);
      const nameLen = buf.readUInt16LE(28);
      const extraLen = buf.readUInt16LE(30);
      const commentLen = buf.readUInt16LE(32);
      let localOffset = buf.readUInt32LE(42);
      const total = 46 + nameLen + extraLen + commentLen;
      if (buf.length < total) break;
      const name = decodeEntryName(buf.subarray(46, 46 + nameLen), flags);
      const extra = buf.subarray(46 + nameLen, 46 + nameLen + extraLen);
      if (compSize === 0xffffffff || localOffset === 0xffffffff) {
        const z = readZip64Extra(extra, 2);
        if (compSize === 0xffffffff && z.length >= 1) compSize = z[0];
        if (localOffset === 0xffffffff && z.length >= 2) localOffset = z[1];
      }
      buf = buf.subarray(total);
      seen++;
      yield { name, method, compSize, localOffset };
    }
  }
  if (buf.length) throw new Error("中央目录尾部有残留字节（zip 可能已损坏）");
}

/**
 * 解压到 destDir。
 * 布局归一化与 src/update/zip.ts:95 normalizeZipLayout 同形：剥掉 `./`；若全部条目共享唯一
 * 顶层 `data/`，再剥一层（Release 里 `cd staging-data && zip -r ... .` 的产物形态不保证前缀）。
 */
async function extractZip(zipPath, destDir) {
  const { count, cdOffset } = await locateCentralDirectory(zipPath);
  const entries = [];
  for await (const e of readCentralDirectory(zipPath, cdOffset, count)) {
    const normalized = e.name.replace(/\\/g, "/").replace(/^\.\//, "");
    if (!normalized || normalized.endsWith("/")) continue; // 目录条目：靠落盘时 mkdir 补
    if (isUnsafeZipEntry(normalized)) throw new Error(`拒绝不安全的 zip 条目（zip-slip / 绝对路径 / Windows 保留名）: ${normalized}`);
    entries.push({ ...e, name: normalized });
  }
  if (!entries.length) throw new Error("zip 内没有任何文件条目");

  const tops = new Set(entries.map((e) => e.name.split("/")[0]));
  if (tops.size === 1 && tops.has("data")) {
    for (const e of entries) e.name = e.name.replace(/^data\//, "");
  } else if (tops.has("data")) {
    throw new Error(`zip 布局歧义：同时存在顶层 data/ 与其它目录（${[...tops].slice(0, 6).join(", ")}…）`);
  }

  mkdirSync(destDir, { recursive: true });
  let files = 0;
  let bytes = 0;
  for (const e of entries) {
    const outPath = join(destDir, e.name);
    // 双保险：即便守卫漏了，也保证落盘路径仍在 destDir 内。
    if (resolvePath(outPath) !== resolvePath(destDir) && !resolvePath(outPath).startsWith(resolvePath(destDir) + sep)) {
      throw new Error(`拒绝越出目标目录的条目: ${e.name}`);
    }
    // 本地文件头里的 name/extra 长度可能与中央目录不同（数据描述符场景），必须读本地头。
    const lfh = await readRange(zipPath, e.localOffset, 30);
    if (lfh.readUInt32LE(0) !== 0x04034b50) throw new Error(`本地文件头签名不符: ${e.name}`);
    const lNameLen = lfh.readUInt16LE(26);
    const lExtraLen = lfh.readUInt16LE(28);
    const dataStart = e.localOffset + 30 + lNameLen + lExtraLen;
    const dataEnd = dataStart + e.compSize - 1;

    mkdirSync(dirname(outPath), { recursive: true });
    const src = createReadStream(zipPath, { start: dataStart, end: e.compSize > 0 ? dataEnd : dataStart });
    if (e.method === 0) {
      await pipeline(src, createWriteStream(outPath));
    } else if (e.method === 8) {
      // ZIP 用的是**裸 deflate**（无 zlib 头），所以是 createInflateRaw 而不是 createGunzip。
      await pipeline(src, createInflateRaw(), createWriteStream(outPath));
    } else {
      throw new Error(`不支持的压缩方法 ${e.method}（仅支持 store=0 / deflate=8）: ${e.name}`);
    }
    files++;
    bytes += statSync(outPath).size;
    if (files % 200 === 0) info(`解压中… ${files}/${entries.length} 个文件（${humanBytes(bytes)}）`);
  }
  info(`解压完成：${files} 个文件 / ${humanBytes(bytes)}`);
  return { files, bytes };
}

/* ─────────────────────────── 主流程 ─────────────────────────── */

function printNoDataHint() {
  info("未安装 data 资产 —— 这是默认行为：npm 包只发代码，data 走 GitHub Release 分发。");
  info("需要 data（本地文档检索 / 核实表 / MDK pin 表等）时，二选一：");
  info("  1) 重新安装并带上 --data：npm install mc-ai-coding-assistant-tool --data");
  info(`  2) 从 GitHub Release 下载 mc-skill-data-full-<tag>.zip，解压后把其中的 data/ 放到 ${DATA_DIR}`);
  info(`     然后设置 MC_SKILL_DATA=${DATA_DIR}`);
  info("  详见 README.md 与 server.json 的 dataDistribution 说明。");
}

/** dist 已存在时对 host 白名单做一次漂移自检：漂移只 warn，绝不 fail（引导脚本不得因此弄挂安装）。 */
async function assertHostAllowlistNotDrifted() {
  const built = join(PKG_ROOT, "dist", "update", "hosts.js");
  if (!existsSync(built)) return;
  try {
    const mod = await import(`file://${built.replace(/\\/g, "/")}`);
    const remote = new Set(mod.ALLOWED_GITHUB_HOSTS || []);
    const drift = [...remote].filter((h) => !ALLOWED_GITHUB_HOSTS.has(h)).concat([...ALLOWED_GITHUB_HOSTS].filter((h) => !remote.has(h)));
    if (drift.length) {
      warn(`host 白名单与 dist/update/hosts.js 不一致（差异：${drift.join(", ")}）。请同步 scripts/postinstall.mjs 与 src/update/hosts.ts。`);
    }
  } catch {
    /* 自检失败不影响安装 */
  }
}

async function dataDirLooksPopulated() {
  try {
    return readdirSync(DATA_DIR).length > 0;
  } catch {
    return false;
  }
}

async function main() {
  // 1) 显式跳过优先于一切（在判定 --data 之前，这样 CI / release 链连提示都不打）
  if (skipRequested()) {
    info("检测到 MC_SKILL_SKIP_DATA_DOWNLOAD / MC_SKILL_SKIP_DOWNLOAD，跳过 data 下载。");
    return;
  }

  // 2) 没传 --data ⇒ 打印提示 + 立即退出，**不联网**
  if (!dataRequested()) {
    printNoDataHint();
    return;
  }

  info("检测到 --data，开始准备 data 资产。");

  if (await dataDirLooksPopulated()) {
    info(`${DATA_DIR} 已存在且非空，跳过下载（如需强制重下，请先删除该目录）。`);
    return;
  }

  await assertHostAllowlistNotDrifted();

  // 3) 解析 Release + 资产
  const release = await resolveLatestRelease();
  const { zip, sums, digestSha256 } = pickAssets(release);
  info(`Release ${release.tag_name} · 资产 ${zip.name}（${humanBytes(zip.size || 0)}）`);

  // 校验和来源：GitHub asset digest 优先，其次 SHA256SUMS-<tag>.txt；都没有 ⇒ 保留文件但明确告知未校验。
  let expectedSha = digestSha256;
  let shaSource = expectedSha ? "GitHub asset digest" : undefined;
  if (!expectedSha && sums) {
    try {
      expectedSha = await sha256FromSums(sums);
      if (expectedSha) shaSource = `${sums.name}`;
    } catch (err) {
      warn(`读取 ${sums.name} 失败（${collectErrorText(err)}）——将不做校验和比对`);
    }
  }

  // 4) dryrun：只打印计划，不下载（见文件头「仅供开发自检」声明）
  if (dryRun()) {
    info("MC_SKILL_DATA_DRYRUN=1（开发自检开关）：以下为计划动作，本次不下载、不落盘。");
    info(`  GET ${rewriteGithubApiUrl(`https://api.github.com/repos/${encodeRepoPath(REPO)}/releases?per_page=10&page=1`)}`);
    info(`  下载 ${zip.browser_download_url}`);
    info(`    └ ${humanBytes(zip.size || 0)}，白名单=${isAllowedGithubUrl(zip.browser_download_url) ? "OK" : "拒绝"}`);
    info(`  校验和来源: ${shaSource || "<无> —— 将下载后不做校验和比对，并明确打印未校验>"}`);
    info(`  临时文件: ${join(PKG_ROOT, ".mc-skill-data-download", `${zip.name}.part`)}`);
    info(`  解压目标: ${DATA_DIR}`);
    return;
  }

  // 5) 下载 → 校验 → 解压 → 原子替换
  const workDir = join(PKG_ROOT, ".mc-skill-data-download");
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(workDir, { recursive: true });
  const zipPath = join(workDir, zip.name);

  const actualSha = await downloadZip(zip.browser_download_url, zipPath);

  if (expectedSha) {
    if (actualSha !== expectedSha) {
      rmSync(workDir, { recursive: true, force: true });
      throw new Error(
        `sha256 校验失败：期望 ${expectedSha}（${shaSource}），实得 ${actualSha}。已删除下载文件，未写入 ${DATA_DIR}`,
      );
    }
    info(`sha256 校验通过（${shaSource}）: ${actualSha}`);
  } else {
    warn(`未找到校验和（无 asset digest 也无 SHA256SUMS 资产）——${zip.name} **未经 sha256 校验**就已落盘`);
  }

  // 先解到暂存目录，再整体改名 ⇒ 中途失败不会在 DATA_DIR 留半份数据。
  const stagingDir = `${DATA_DIR}.staging-${release.tag_name}`;
  rmSync(stagingDir, { recursive: true, force: true });
  try {
    await extractZip(zipPath, stagingDir);
    rmSync(DATA_DIR, { recursive: true, force: true });
    renameSync(stagingDir, DATA_DIR);
  } catch (err) {
    rmSync(stagingDir, { recursive: true, force: true });
    throw err;
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }

  info(`data 资产就绪：${DATA_DIR}`);
  info(`请在 MCP 客户端配置里设置 MC_SKILL_DATA=${DATA_DIR}`);
  info("校验：node <pkg>/dist/cli.js --version 之后运行 diagnose_data_paths 查看各平台数据目录状态。");
}

try {
  await main();
} catch (err) {
  // 契约：data 是可选增强。这里绝不 process.exit(1)。
  fatal(`data 资产准备失败：${collectErrorText(err)}`);
  fatal("安装本身**未受影响** —— npm 包（代码）已完整装好，data 只是没到位。后续可选做法：");
  fatal(`  - 重新执行：npm install mc-ai-coding-assistant-tool --data`);
  fatal(`  - 或手动下载 Release 资产 mc-skill-data-full-<tag>.zip，解压到 ${DATA_DIR}`);
  fatal(`  - 并设置 MC_SKILL_DATA=${DATA_DIR}`);
}
process.exit(0);