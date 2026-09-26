#!/usr/bin/env node
/**
 * fetch-fabric-docs.js
 *
 * 从 FabricMC/fabric-docs GitHub 仓库抓取 .md 源文件。
 *
 * 数据源（按优先级；必须能归属到 --version，禁止现行站冒充旧档）：
 *   1. GitHub Raw 版本化树 versions/<ver>/<gitPath>（source=github_raw_versioned）
 *      官方 versions/ 有树：1.20.4 / 1.21.1 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 / 26.1.2（无 1.21.5）；
 *      其它档以 --dry-run 的 probeSource= 为准，无命中保持空 L0
 *   2. 明确指定的归档分支（--branch≠main；source=github_archive）。
 *      实测 2026-09-07：`api.github.com/repos/FabricMC/fabric-docs/branches` 只返回 **1 条 = main**，
 *      `versions/<v>` 是 main 上的**路径前缀**不是分支 —— 所以没有可猜的归档分支，
 *      未显式 --branch 时只走通道 1（旧版 ARCHIVE_BRANCHES 四条猜测 32/32 全部 404，已删）。
 * 禁止成功页：github_raw（main 根路径）、未加版本前缀的 VitePress 现行站。
 * 无 versions/ 的旧档应失败并删除已有污染 raw；search 走 wiki（现行站警告）或 DOC_NOT_FOUND。
 *
 * 输出：data/fabric_<version>/fabric-docs/<version>/raw/<slug>.md
 * 每个文件顶部元数据含 来源 / 版本 / GitHub 路径 / 抓取源 / 抓取时间 / SHA256。
 * 抓取源仅 github_raw_versioned|github_archive。
 *
 * 用法：
 *   node scripts/fetch-fabric-docs.js --version 1.21.4 [--force] [--dry-run]
 *   node scripts/fetch-fabric-docs.js --version=26.1.2
 *   node scripts/fetch-fabric-docs.js --version=1.20.1 --branch=main   # --branch 仅在你确认该分支存在时才给
 *   # （docs 仓上游只有 main 一个分支；`archive/*`、`*.x-archive`、`versions/*` 都不是分支，是 404）
 *
 * CLI 参数解析（统一方式，同时支持两种风格）：
 *   --version 1.21.1     等价于   --version=1.21.1
 *   --branch main        等价于   --branch=main
 *   --force              强制重新抓取
 *   --dry-run            仅预览：打印 URL，并对最多 3 页探测 versions/ 树（不写盘）
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname, resolve } from "path";
import { tmpdir } from "os";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

// win32 上 Node fetch 对 raw.githubusercontent.com / api.github.com 必失败
// （UNABLE_TO_VERIFY_LEAF_SIGNATURE）→ 取件一律走仓内 curl 优先漏斗。
import { downloadWithFallback } from "../../scripts/_lib/fetch-with-ua.mjs";
import { resolveDataRoot } from "./_lib/data-root.js";
import { upstreamDevelopPaths } from "./_lib/upstream-inventory.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
// 从 mcp-server/scripts/ 向上 2 层到 MC_skill 根目录
const MC_SKILL_ROOT = resolve(__dirname, "..", "..");
// NP-6（2026-09-17）：数据根统一走 _lib/data-root.js（--data-root > MC_SKILL_DATA > <repo>/data）
const DATA_ROOT = resolveDataRoot();
const TEMPLATES_PATH = join(DATA_ROOT, "porting", "official-templates.json");

// ── CLI 参数解析（支持空格 / 等号两种风格） ────────────────────────────────────

function parseCli(argv) {
  const out = {
    flags: new Set(),
    kv: new Map(),
    list: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith("--")) continue;
    const eq = tok.indexOf("=");
    if (eq >= 0) {
      const key = tok.slice(2, eq);
      const val = tok.slice(eq + 1);
      if (key) out.kv.set(key, val);
      out.list.push({ key, val, form: "equals" });
    } else {
      const key = tok.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        out.kv.set(key, next);
        out.list.push({ key, val: next, form: "space" });
        i++;
      } else {
        out.flags.add(key);
        out.list.push({ key, val: true, form: "flag" });
      }
    }
  }
  return out;
}

const CLI = parseCli(process.argv.slice(2));

// 必填参数
const VERSION = CLI.kv.get("version");
if (!VERSION) {
  console.error("[fetch-fabric-docs] 缺少 --version 参数。");
  console.error("用法：node scripts/fetch-fabric-docs.js --version 1.21.4 [--force] [--dry-run]");
  process.exit(2);
}

// 可选参数
const BRANCH = CLI.kv.get("branch") ?? "main";
const FORCE = CLI.flags.has("force");
const DRY_RUN = CLI.flags.has("dry-run");
/** 只刷新上游清单快照（一次 trees 调用），不抓任何页面 —— 给 assert-upstream-chapters 接新档用。 */
const INVENTORY_ONLY = CLI.flags.has("inventory-only");

const FABRIC_DIR = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION, "raw");
const META_PATH = join(DATA_ROOT, `fabric_${VERSION}`, "meta.json");
// 本次上游清单（GitHub trees 过滤后），main() 末尾写进 upstream-tree.json 给门当期望值
let _upstreamDevelopPaths = [];

// Fabric Docs GitHub 仓库元信息
const FABRIC_GH = {
  owner: "FabricMC",
  repo: "fabric-docs",
  branch: BRANCH,
  baseRawUrl: `https://raw.githubusercontent.com/${"FabricMC"}/fabric-docs`,
  baseVitepressUrl: "https://docs.fabricmc.net",
};

// 归档分支：不留猜测清单。实测 2026-09-07 branches API 只有 main，
// 旧的 `${VERSION}.x-archive` / `versions/${VERSION}` / `archive/${VERSION}` / `archive/${VERSION}.x`
// 四条全是 404（8 档 meta.json 共 32 条，逐条对过分支列表 = 0 命中）。
// 需要真正的归档时显式传 --branch=<已证存在的分支>。

// ── 工具函数 ──────────────────────────────────────────────────────────────────

function sha256(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readMeta() {
  if (existsSync(META_PATH)) {
    return JSON.parse(readFileSync(META_PATH, "utf8"));
  }
  return { meta: {} };
}

function writeMeta(meta) {
  writeFileSync(META_PATH, JSON.stringify(meta, null, 2), "utf8");
}

function gitPathToFetchId(gitPath) {
  return gitPath.replace(/\.md$/, "").replace(/\//g, "-");
}

let _mainTreePaths = null;
// 上游修订钉：trees API 返回的根 tree sha（同 sha ⇒ 同内容）。只记 `branch: main` 的话，
// 「本仓与上游逐档相等」就是一次性结论 —— 上游在 main 上继续增删页后，无人能发现（2026-09-21 缺页普查）。
// 取不到时保持 null 并照写：那是「本次没有修订钉」的留痕，不是「上游没有变更」。
let _mainTreeSha = null;
let _mainTreeTruncated = false;

async function listMainTreePaths() {
  if (_mainTreePaths) return _mainTreePaths;
  const url = `https://api.github.com/repos/${FABRIC_GH.owner}/${FABRIC_GH.repo}/git/trees/${BRANCH}?recursive=1`;
  const dest = join(tmpdir(), `mc-skill-fabric-tree-${process.pid}-${Date.now()}.json`);
  // 这份 recursive trees 响应实测 2.7–3.2MB，本机整段下载耗时可达 ~118s（curl 实测）：
  // 旧值 30s 会把「慢」当成「没有」，静默产出 0 页清单 —— 上游清单探测超时必须按实测留量。
  const TREE_TIMEOUT_MS = 240_000;
  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (attempt > 1) await new Promise((r) => setTimeout(r, 2000 * attempt));
    try {
      const res = await downloadWithFallback({
        url,
        dest,
        timeoutMs: TREE_TIMEOUT_MS,
        minBytes: 1,
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) {
        console.warn(`[fetch-fabric-docs] GitHub tree HTTP ${res.status ?? 0}（第 ${attempt}/${attempts} 次）`);
        continue;
      }
      const data = JSON.parse(readFileSync(dest, "utf8"));
      _mainTreeSha = data.sha ?? null;
      _mainTreeTruncated = data.truncated === true;
      if (_mainTreeTruncated) {
        console.warn("[fetch-fabric-docs] trees 响应 truncated=true ⇒ 这份清单不完整，禁止据此断言「无缺页」");
      }
      if (!_mainTreeSha) console.warn("[fetch-fabric-docs] trees 响应没有 sha 字段，本次不写修订钉（meta.docs.sourceTreeSha=null）");
      _mainTreePaths = (data.tree ?? []).filter((t) => t.type === "blob").map((t) => t.path);
      return _mainTreePaths;
    } catch (e) {
      console.warn(`[fetch-fabric-docs] GitHub tree 失败（第 ${attempt}/${attempts} 次）：${e.message}`);
    } finally {
      try {
        unlinkSync(dest);
      } catch {
        // 漏斗失败时已自行删掉 dest
      }
    }
  }
  console.warn(`[fetch-fabric-docs] trees 三次都没拿到 ⇒ 本次没有上游清单，仅用 toFetch`);
  _mainTreePaths = [];
  return _mainTreePaths;
}

// 上游清单快照：assert-upstream-chapters 的「期望」只能来自这里，不能来自本仓产物。
// truncated / 取不到清单时**照写**（pageCount 可能为 0 + truncated 标记），
// 由门去判「这份清单能不能用来断言无缺页」——抓取器不替门下结论。
function writeUpstreamSnapshot() {
  const versionDir = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION);
  ensureDir(versionDir);
  const snapPath = join(versionDir, "upstream-tree.json");
  const probeFailed = _mainTreeSha === null;
  if (probeFailed) {
    // 探针失败不是「上游没有这页」：拿不到清单就绝不覆盖已有快照（否则一次限流
    // 会把「上游确实没有文档树」写成假事实，门会据此放行 0 页档案）。
    let prior = null;
    try { prior = JSON.parse(readFileSync(snapPath, "utf8")); } catch { prior = null; }
    if (prior && prior.treeSha) {
      console.warn(`[fetch-fabric-docs] trees 探针失败，保留既有快照（treeSha=${prior.treeSha.slice(0, 12)}…），本次不写`);
      return { versionDir, pageCount: prior.pageCount ?? 0, keptPrior: true };
    }
  }
  writeFileSync(
    snapPath,
    JSON.stringify({
      platform: "fabric",
      version: VERSION,
      // 探针失败时换一个门不认的来源名 ⇒ 门必红，而不是把 0 页当成「上游确实没有」
      source: probeFailed ? "github_trees_probe_failed" : "github_trees",
      repo: `${FABRIC_GH.owner}/${FABRIC_GH.repo}`,
      branch: BRANCH,
      treeSha: _mainTreeSha,
      truncated: _mainTreeTruncated,
      discoveredAt: new Date().toISOString(),
      pageCount: _upstreamDevelopPaths.length,
      pages: _upstreamDevelopPaths,
    }, null, 2) + "\n",
    "utf8",
  );
  return { versionDir, pageCount: _upstreamDevelopPaths.length };
}

async function loadUrlList() {
  const templates = JSON.parse(readFileSync(TEMPLATES_PATH, "utf8"));
  const toFetch = (templates.toFetch ?? []).filter((e) => e.gitPath);
  const tree = await listMainTreePaths();
  _upstreamDevelopPaths = upstreamDevelopPaths(tree, VERSION);
  const byPath = new Map();
  for (const e of toFetch) byPath.set(e.gitPath, { ...e });
  for (const gitPath of _upstreamDevelopPaths) {
    if (byPath.has(gitPath)) continue;
    byPath.set(gitPath, {
      id: gitPathToFetchId(gitPath),
      gitPath,
      url: `${FABRIC_GH.baseVitepressUrl}/${gitPath.replace(/\.md$/, "").replace(/\/index$/, "")}`,
      priority: "🟢",
    });
  }
  return [...byPath.values()];
}

/**
 * 只接受能归属到 --version 的源。禁止 main 根路径 / 现行 VitePress 冒充该档。
 * 返回 { content, url, source, fetchedAt, sha256, branch }。
 */
async function fetchPage(entry, branch = FABRIC_GH.branch) {
  const { gitPath, url: vitepressUrl } = entry;
  const tried = [];

  // 0. Versioned tree: versions/<ver>/<gitPath>（main 或指定 branch 上都先试）
  if (VERSION) {
    const versionedPath = `versions/${VERSION}/${gitPath}`;
    const versionedUrl = `${FABRIC_GH.baseRawUrl}/${branch}/${versionedPath}`;
    tried.push(versionedUrl);
    const vr = await tryRaw(versionedUrl);
    if (vr) {
      return {
        ...vr,
        source: "github_raw_versioned",
        url: versionedUrl,
        branch,
        gitPathUsed: versionedPath,
      };
    }
  }

  // 1. 显式 --branch≠main：该分支上的未前缀路径视为归档命中
  if (branch !== "main") {
    const githubRawUrl = `${FABRIC_GH.baseRawUrl}/${branch}/${gitPath}`;
    tried.push(githubRawUrl);
    const r = await tryRaw(githubRawUrl);
    if (r) {
      return {
        ...r,
        source: "github_archive",
        url: githubRawUrl,
        branch,
      };
    }
  }

  // 2. 未加版本前缀的现行 VitePress 站不可采信，只记进 tried 备查
  //    （原「已知归档分支」腿已删：docs 仓上游只有 main，见文件头实测记录）
  if (vitepressUrl) {
    tried.push(`vitepress-skipped-unversioned:${vitepressUrl}`);
  }

  return { content: null, url: vitepressUrl, source: "failed", tried, branch };
}

async function tryRaw(url) {
  const dest = join(tmpdir(), `mc-skill-fabric-docs-${process.pid}-${Date.now()}.md`);
  try {
    const res = await downloadWithFallback({ url, dest, timeoutMs: 20000, minBytes: 1 });
    if (!res.ok) return null;
    const text = readFileSync(dest, "utf8");
    // GitHub Raw 返回 Markdown（含 frontmatter 时以 --- 开头）
    if (text.includes("# ") || text.startsWith("---")) {
      const fetchedAt = new Date().toISOString();
      return { content: text, sha256: sha256(text), fetchedAt };
    }
    return null;
  } catch {
    // 网络/超时错误：继续 fallback
    return null;
  } finally {
    try {
      unlinkSync(dest);
    } catch {
      // 漏斗失败时已自行删掉 dest
    }
  }
}

/**
 * 从 Markdown 正文（含 YAML frontmatter）提取可读标题。
 * 优先 frontmatter title:，其次正文首个 H1，最后 fallback 到 slug id。
 */
function extractDocTitle(content, fallbackId) {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fm) {
    const titleLine = fm[1].match(/^title:\s*(.+)$/m);
    if (titleLine) {
      let t = titleLine[1].trim();
      // 去掉包裹引号
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        t = t.slice(1, -1);
      }
      if (t) return t;
    }
  }
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].replace(/\{#.*\}$/, "").trim();
  return fallbackId.replace(/-/g, " ");
}

/**
 * 写入 raw 文件，顶部加上元数据行。
 * 元数据行格式与 audit 脚本的正则兼容：RAW_VERSION_RX = />\s*版本：\s*(\S+)/
 */
function writeRawFile(entry, content, source, fetchedAt, sha, finalUrl, branch) {
  const { id, gitPath } = entry;
  const filename = gitPath.replace(/\//g, "_").replace(/\.md$/, "") + ".md";
  const filepath = join(FABRIC_DIR, filename);

  ensureDir(dirname(filepath));

  const title = extractDocTitle(content, id);

  const lines = [
    `# ${title}`,
    "",
    `> 来源：${finalUrl}`,
    `> 版本：${VERSION}`,
    `> GitHub 路径：${gitPath}`,
    `> 抓取源：${source}`,
    `> 抓取时间：${fetchedAt}`,
    `> SHA256：${sha}`,
    `> 分支：${branch}`,
    "",
    content,
  ];

  writeFileSync(filepath, lines.join("\n"), "utf8");
  return { filename, filepath };
}

/**
 * 缓存的 raw 页是否需要重抓。三条判据：
 *   1) 抓取源是已知会串版本的 github_raw / vitepress；
 *   2) 头部压根没有 `> 抓取源：` 行 —— 说明它不是本写入者产出的文件；
 *   3) 正文含控制字节 / U+FFFD —— 盘损或二进制覆盖的签名（2026-09-13 实测：
 *      fabric_1.21.10 的 develop_networking.md 整页 11,062 B 里 35/36 行是二进制，
 *      旧判据只看抓取源，对这种文件完全瞎掉，普通重抓会「已存在」跳过它）。
 */
function isPollutedCachedRaw(filepath) {
  if (!existsSync(filepath)) return false;
  const text = readFileSync(filepath, "utf8");
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]/.test(text)) return true;
  const head = text.slice(0, 600);
  const src = head.match(/> 抓取源：(\S+)/);
  if (!src) return true;
  const source = src[1];
  if (source === "github_raw" || source === "vitepress") return true;
  return false;
}

function deleteLocalDoc(filename) {
  const rawPath = join(FABRIC_DIR, filename);
  const processedPath = join(DATA_ROOT, `fabric_${VERSION}`, "fabric-docs", VERSION, "processed", filename);
  for (const p of [rawPath, processedPath]) {
    if (existsSync(p)) unlinkSync(p);
  }
}

// ── 主逻辑 ──────────────────────────────────────────────────────────────────────

async function main() {
  ensureDir(FABRIC_DIR);
  const urls = await loadUrlList();
  const meta = readMeta();
  const now = new Date().toISOString().split("T")[0];

  if (INVENTORY_ONLY) {
    if (DRY_RUN) {
      console.log(`[fetch-fabric-docs] --inventory-only --dry-run：上游 develop 清单 ${_upstreamDevelopPaths.length} 页，不写盘`);
      return;
    }
    const { pageCount } = writeUpstreamSnapshot();
    console.log(`[fetch-fabric-docs] --inventory-only：上游清单快照 ${pageCount} 页（treeSha=${_mainTreeSha ?? "null"}），未抓取任何页面`);
    if (_mainTreeSha === null) {
      console.error("FAILED: trees 探针没拿到清单（限流 / 网络），本次快照不可信 ⇒ 退出码非 0，请重跑");
      process.exitCode = 1;
    }
    return;
  }

  console.log(`[fetch-fabric-docs] 版本: ${VERSION}`);
  console.log(`[fetch-fabric-docs] 分支: ${BRANCH}`);
  console.log(`[fetch-fabric-docs] 目标目录: ${FABRIC_DIR}`);
  console.log(`[fetch-fabric-docs] GitHub 仓库: ${FABRIC_GH.owner}/${FABRIC_GH.repo} @ ${FABRIC_GH.branch}`);
  console.log(`[fetch-fabric-docs] 待抓取: ${urls.length} 个页面 (--force=${FORCE}, --dry-run=${DRY_RUN})`);
  console.log("");

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];
  const provenanceLog = [];
  // W4-8（2026-09-20）：本地语料的删除/保留必须留痕 —— failures.json 的 removedRaw/keptRaw
  // 此前 7 个档带键但全仓无写入者（读方只 existsSync），现在由本脚本写出。
  const removedRaw = [];
  const keptRaw = [];

  for (const entry of urls) {
    const { id, gitPath } = entry;
    const filename = gitPath.replace(/\//g, "_").replace(/\.md$/, "") + ".md";
    const localPath = join(FABRIC_DIR, filename);
    const githubRawUrl = `${FABRIC_GH.baseRawUrl}/${BRANCH}/${gitPath}`;

    if (DRY_RUN) {
      const exists = existsSync(localPath) ? " [已缓存]" : " [需抓取]";
      console.log(`[DRY] ${entry.priority ?? "🟢"} ${id}${exists}`);
      console.log(`       → versions/${VERSION}/${gitPath}`);
      console.log(`       → ${githubRawUrl}`);
      continue;
    }

    process.stdout.write(`[${entry.priority ?? "🟢"}] ${id} ... `);

    // 污染缓存（未版本化 main / 现行 vitepress）即使无 --force 也作废
    if (!FORCE && existsSync(localPath) && !isPollutedCachedRaw(localPath)) {
      console.log(`⏭️  已缓存（使用 --force 强制重新抓取）`);
      skipped++;
      continue;
    }

    try {
      const result = await fetchPage(entry, BRANCH);

      if (!result.content) {
        // W4-8（2026-09-20）：取件失败 ≠ 上游没有这页。旧实现无条件 deleteLocalDoc，
        // 一次网络抖动就会把已核的 raw + processed 双删。默认**保留**本地语料、只记账；
        // 仅当本地确实是「污染缓存」（未版本化 main / 现行 VitePress / 盘损）时才删除。
        const polluted = existsSync(localPath) && isPollutedCachedRaw(localPath);
        if (polluted) {
          console.log(`⚠️  无版本化/归档源且本地为污染缓存 ⇒ 删除本地副本（不保留）`);
          deleteLocalDoc(filename);
          removedRaw.push(filename);
        } else {
          console.log(`⚠️  无版本化/归档源 ⇒ 保留本地已核语料，仅记账（不删除）`);
          if (existsSync(localPath)) keptRaw.push(filename);
        }
        // gitPath 必须来自 official-templates.json toFetch.gitPath（或版本树发现的同一路径），禁止手写旧路径。
        failures.push({ id, gitPath, tried: result.tried ?? [] });
        failed++;
        continue;
      }

      const { filename: fname, filepath } = writeRawFile(
        entry,
        result.content,
        result.source,
        result.fetchedAt,
        result.sha256,
        result.url,
        result.branch,
      );

      provenanceLog.push({
        id,
        gitPath,
        filename: fname,
        source: result.source,
        url: result.url,
        branch: result.branch,
        fetchedAt: result.fetchedAt,
        sha256: result.sha256,
        bytes: result.content.length,
      });

      success++;
      console.log(`✓ [${result.source}@${result.branch}] (${result.content.length} chars, sha256=${result.sha256.slice(0, 12)}…)`);
    } catch (err) {
      // 取不到 ≠ 上游没有这页：网络抖动 / 限流 / TLS 失败都会走到这里，
      // 以前顺手 deleteLocalDoc 会把已有 raw + processed 一起删掉（2026-09-13 实测：
      // 一次 --version 跑因 6 页取回失败直接删了盘上文件）。失败只记账，不动语料。
      console.log(`✗ ${err.message}`);
      failures.push({ id, gitPath, error: err.message });
      failed++;
    }
  }

  if (DRY_RUN) {
    const probeLimit = Math.min(3, urls.length);
    let versioned = 0;
    let archive = 0;
    let failedProbe = 0;
    for (let i = 0; i < probeLimit; i++) {
      const entry = urls[i];
      const result = await fetchPage(entry, BRANCH);
      const src = result.source ?? "failed";
      console.log(`[PROBE] ${entry.id} source=${src}${result.url ? ` ${result.url}` : ""}`);
      if (src === "github_raw_versioned") versioned++;
      else if (src === "github_archive") archive++;
      else failedProbe++;
    }
    const hit = versioned > 0 ? "github_raw_versioned" : archive > 0 ? "github_archive" : "none";
    console.log(
      `[fetch-fabric-docs] dry-run probeSource=${hit} versioned=${versioned} archive=${archive} failed=${failedProbe}`,
    );
    if (hit === "none") {
      console.log(`[fetch-fabric-docs] 无 versions/ 与归档命中，保持空 L0，不要 --force`);
    } else {
      console.log(`[fetch-fabric-docs] 可 --force 抓取`);
    }
    return;
  }

  // 记录元数据（含全失败：旧档空树也要留下 failures[]）
  if (!DRY_RUN) {
    meta.meta = meta.meta ?? {};
    meta.meta.lastUpdatedAt = now;
    meta.meta.platform = "fabric";
    meta.meta.mcVersion = VERSION;
    meta.meta.fetchedAt = new Date().toISOString();
    // D-6（2026-09-25）：pages 此前整写 = 本轮 provenanceLog。增量跑的 skipped 页不进 log，
    // 于是每次抓取把台账削成「本次新抓的那几页」——1.21.10 实测盘上 79 页、台账只剩 1 条。
    // 现按 filename 合并：既有条目保留（其 fetchedAt/sha256 记录的是真实落盘时刻），
    // 本轮 provenanceLog 覆盖同名项；输出按 filename 排序，与盘面重算回填脚本同一确定性顺序。
    const prevPages = Array.isArray(meta.meta.docs?.pages) ? meta.meta.docs.pages : [];
    const pagesByFilename = new Map();
    for (const pg of prevPages) if (pg && pg.filename) pagesByFilename.set(pg.filename, pg);
    for (const pg of provenanceLog) if (pg && pg.filename) pagesByFilename.set(pg.filename, pg);
    meta.meta.docs = {
      sourceRepo: `${FABRIC_GH.owner}/${FABRIC_GH.repo}`,
      branch: BRANCH,
      // 修订钉：下次比对上游时先看这两个字段，再看页数（只有 branch 等于没有钉）。
      sourceTreeSha: _mainTreeSha,
      sourceTreeTruncated: _mainTreeTruncated,
      acceptedSources: ["github_raw_versioned", "github_archive"],
      pages: [...pagesByFilename.values()].sort((a, b) =>
        String(a.filename).localeCompare(String(b.filename)),
      ),
      failures,
    };
    writeMeta(meta);
    const { versionDir } = writeUpstreamSnapshot();
    writeFileSync(
      join(versionDir, "failures.json"),
      JSON.stringify({ version: VERSION, failures, removedRaw, keptRaw }, null, 2),
      "utf8",
    );
  }

  console.log(`\n完成：${success} 成功，${skipped} 跳过，${failed} 失败`);
  if (!DRY_RUN) {
    console.log(`运行 process-fabric-docs.js 处理抓取结果（无成功页时写空索引）。`);
  }
  if (failed > 0) {
    console.log(`\n失败列表：`);
    for (const f of failures) {
      console.log(`  - ${f.id}${f.gitPath ? ` (${f.gitPath})` : ""}: ${f.error ?? "全部来源失败"}`);
    }
  }
}

main().catch((err) => {
  console.error("[fetch-fabric-docs] 致命错误:", err);
  process.exit(1);
});