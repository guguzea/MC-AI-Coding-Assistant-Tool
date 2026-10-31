#!/usr/bin/env node
/**
 * provision-fabric-latest.mjs
 *
 * 抓 Fabric 官方文档的 **latest 面**（仓库根 `develop/` + `reference/latest/`）并按
 * `data/fabric_<ver>/` 的既有形状落盘。
 *
 * 为什么需要这个脚本（2026-10-31 实测）：
 *   - 上游 `docs.fabricmc.net` 的「最新版」永远在**无版本前缀**路径（`/develop/...`），
 *     版本目录 `versions/<v>/` 只在某一版**不再是 latest** 时才建；
 *   - 所以 `fetch-fabric-docs.js` 的 `versions/<v>/` 口径**结构性地永远落后一代**：
 *     26.2 正文已在 `/develop/` 上线（页面标题 "… 26.2"），而 `versions/26.2` 至今 404；
 *   - 本脚本按 commit sha **pin** 住 latest 面（不跟 main HEAD，避免 latest 漂到下一代后
 *     静默把别的版本写成 26.2），产出与 `fetch-fabric-docs.js` 同形的 raw，
 *     后续照常跑 `process-fabric-docs.js --version <ver>`。
 *
 * 上游清单的两条通道（同一份判据，只换取清单的传输）：
 *   A. `--from-clone=<dir>`：本地已有 `git clone --filter=blob:none --no-checkout` 的仓库，
 *      直接 `git ls-tree -r -l`（离线、不耗 GitHub API 配额）。**推荐**：本机 api.github.com
 *      走 schannel 需 `--ssl-no-revoke`，且匿名配额 60/h。
 *   B. 不给 --from-clone：走 GitHub trees API（会遇限流；403 时脚本失败，不落假清单）。
 *
 * 落盘形状（与既有档一致；reference 保留上游相对路径，供 transclude 展开用）：
 *   data/fabric_<ver>/fabric-docs/<ver>/raw/<slug>.md
 *   data/fabric_<ver>/reference/latest/...          ← 页面里 `@/reference/latest/...` 的目标
 *   data/fabric_<ver>/reference.provenance.json
 *   data/fabric_<ver>/meta.json
 *   data/fabric_<ver>/fabric-docs/<ver>/upstream-tree.json
 *
 * 用法：
 *   node scripts/provision-fabric-latest.mjs --version=26.2 --sha=<40位sha> --from-clone=<dir>          # 干跑
 *   node scripts/provision-fabric-latest.mjs --version=26.2 --sha=<sha> --from-clone=<dir> --write      # 真抓
 *   # sha 取法：git ls-remote https://github.com/FabricMC/fabric-docs refs/heads/main
 *
 * 判据：
 *   - 页面集必须来自 GitHub trees（`source=github_trees`，`truncated=false`），
 *     与 `assert-upstream-chapters.mjs` 的 fabric 腿同口径；
 *   - 逐文件 sha256 与 bytes 写进 meta / provenance，可复核；
 *   - 任一文件三次重试仍失败 ⇒ 退出码 1，不写「完整」假象。
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { resolveDataRoot } from "./_lib/data-root.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseCli(argv) {
  const kv = new Map();
  const flags = new Set();
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith("--")) continue;
    const eq = tok.indexOf("=");
    if (eq >= 0) kv.set(tok.slice(2, eq), tok.slice(eq + 1));
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) {
      kv.set(tok.slice(2), argv[i + 1]);
      i++;
    } else flags.add(tok.slice(2));
  }
  return { kv, flags };
}

const { kv, flags } = parseCli(process.argv.slice(2));
const VERSION = kv.get("version");
const SHA = kv.get("sha");
const FROM_CLONE = kv.get("from-clone");
const WRITE = flags.has("write");
const CONCURRENCY = Math.max(1, Math.min(8, Number(kv.get("concurrency") ?? 6) || 6));
const DATA = resolveDataRoot();

if (!VERSION || !/^\d/.test(VERSION)) {
  console.error("[provision-fabric-latest] 缺少 --version=<MC版本>（如 26.2）。");
  process.exit(2);
}
if (!SHA || !/^[0-9a-f]{40}$/.test(SHA)) {
  console.error("[provision-fabric-latest] 缺少 --sha=<40 位 commit sha>（禁止跟 main HEAD）。");
  process.exit(2);
}

const REPO_SLUG = "FabricMC/fabric-docs";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_SLUG}/${SHA}`;

/** reference/ 下只镜像文本类；png/ogg 是文档站渲染资产，transclude 不需要。 */
const REF_TEXT_EXT = /\.(java|json|gradle|xml|classtweaker|mcfunction|properties|kts|toml|ya?ml|md|txt)$/i;

const PACK_ROOT = join(DATA, `fabric_${VERSION}`);
const DOCS_ROOT = join(PACK_ROOT, "fabric-docs", VERSION);
const RAW_DIR = join(DOCS_ROOT, "raw");
const REF_ROOT = join(PACK_ROOT, "reference", "latest");

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

/** 本机 schannel 默认查吊销会 `CRYPT_E_NO_REVOCATION_CHECK`；`--ssl-no-revoke` 是仓库既有约定。 */
function curlGet(url, dest, timeoutMs = 60_000) {
  mkdirSync(dirname(dest), { recursive: true });
  const r = spawnSync(
    "curl.exe",
    ["-sS", "--ssl-no-revoke", "-f", "-L", "--max-time", String(Math.ceil(timeoutMs / 1000)), "-o", dest, url],
    { encoding: "utf8" },
  );
  return r.status === 0;
}

function curlJson(url, timeoutMs = 240_000) {
  const dest = join(tmpdir(), `mc-skill-fabric-tree-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
  try {
    if (!curlGet(url, dest, timeoutMs)) throw new Error(`HTTP 失败：${url}`);
    return JSON.parse(readFileSync(dest, "utf8"));
  } finally {
    try {
      unlinkSync(dest);
    } catch {
      /* ignore */
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 单文件下载 + 重试。注意 `curlGet` 失败时返回 false 而**不抛异常**，所以不能套
 * `retry(() => curlGet(...))`（那会把 false 当成成功直接返回）—— 必须在这里显式重试。
 */
async function curlGetRetry(url, dest, times = 3) {
  for (let i = 1; i <= times; i++) {
    if (curlGet(url, dest)) return true;
    if (i < times) await sleep(600 * i);
  }
  return false;
}

async function retry(fn, times = 3, waitMs = 1200) {
  let last;
  for (let i = 1; i <= times; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < times) await new Promise((r) => setTimeout(r, waitMs * i));
    }
  }
  throw last;
}

async function mapPool(items, worker, concurrency = CONCURRENCY) {
  const out = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return out;
}

/**
 * `git ls-tree -r <sha>`：mode type sha<TAB>path。返回 [{path,blobSha,size}]。
 * 刻意**不加 `-l`**：blobless clone 下 `-l` 要 blob 大小 ⇒ 触发 promisor fetch（实测 502），
 * 而 size 我们在下载后自己算，本来也不需要。
 */
function gitLsTree(cloneDir, sha, paths) {
  const r = spawnSync("git", ["-C", cloneDir, "ls-tree", "-r", sha, "--", ...paths], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(`git ls-tree 失败：${r.stderr?.trim() || r.error?.message || r.status}`);
  const out = [];
  for (const line of r.stdout.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const meta = line.slice(0, tab).trim().split(/\s+/);
    const path = line.slice(tab + 1).trim();
    if (meta.length < 3 || meta[1] !== "blob") continue;
    out.push({ path, blobSha: meta[2], size: 0 });
  }
  return out;
}

function gitRootTreeSha(cloneDir, sha) {
  const r = spawnSync("git", ["-C", cloneDir, "rev-parse", `${sha}^{tree}`], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

/** 与 `_lib/upstream-inventory.mjs::upstreamDevelopPaths` 同口径（latest 面无版本前缀）。 */
function pickDevelopPages(blobs) {
  return blobs
    .map((b) => b.path)
    .filter((p) => p.startsWith("develop/") && p.endsWith(".md") && !/(^|\/)(players|translated)\//.test(p))
    .sort();
}

/**
 * reference 镜像清单：`reference/latest/**`（页面主引用面）+ **档根 `reference/build.gradle`**。
 * 后者被 `<<< @/reference/build.gradle` 直接引用（26.1.2 档也有 `data/fabric_1.21.2/...` 同形件，
 * 见 `develop_data-generation_setup.md` / `develop_loom_index.md`）；漏抓会让 G3 判「镜像 blob 不在盘上」。
 */
function pickReferenceFiles(blobs) {
  return blobs
    .filter((b) => (b.path.startsWith("reference/latest/") && REF_TEXT_EXT.test(b.path)) || b.path === "reference/build.gradle")
    .sort((a, b) => a.path.localeCompare(b.path));
}

function extractTitle(content, fallback) {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fm) {
    const m = fm[1].match(/^title:\s*(.+)$/m);
    if (m) {
      let t = m[1].trim();
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) t = t.slice(1, -1);
      if (t) return t;
    }
  }
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].replace(/\{#.*\}$/, "").trim();
  return fallback;
}

function writeRaw(gitPath, content, finalUrl, fetchedAt, digest) {
  const filename = gitPath.replace(/\//g, "_").replace(/\.md$/, "") + ".md";
  const filepath = join(RAW_DIR, filename);
  mkdirSync(dirname(filepath), { recursive: true });
  const title = extractTitle(content, gitPath.replace(/\.md$/, "").replace(/\//g, " "));
  const body = [
    `# ${title}`,
    "",
    `> 来源：${finalUrl}`,
    `> 版本：${VERSION}`,
    `> GitHub 路径：${gitPath}`,
    `> 抓取源：github_latest_pinned`,
    `> 抓取时间：${fetchedAt}`,
    `> SHA256：${digest}`,
    `> 分支：main@${SHA}`,
    "",
    content,
  ].join("\n");
  writeFileSync(filepath, body, "utf8");
  return { filename, bytes: Buffer.byteLength(body, "utf8") };
}

async function main() {
  console.log(`[provision-fabric-latest] version=${VERSION} sha=${SHA}`);
  console.log(`[provision-fabric-latest] packRoot=${PACK_ROOT}`);
  console.log(`[provision-fabric-latest] mode=${WRITE ? "write" : "dry-run"} concurrency=${CONCURRENCY}`);

  let blobs;
  let treeSha = null;
  let truncated = false;
  let inventoryChannel;

  if (FROM_CLONE) {
    const dir = resolve(FROM_CLONE);
    if (!existsSync(join(dir, ".git"))) throw new Error(`--from-clone 不是 git 仓库：${dir}`);
    console.log(`[provision-fabric-latest] 清单通道：git ls-tree @ ${dir}`);
    // 注意：pathspec 必须显式列出根级 `reference/build.gradle`（`-r` 只展开目录，不含同级的单个文件）
    // public/.github 只为 `<<< @/public/...`、`<<< @/.github/workflows/build.yaml` 这类页面引用服务（按需取，不全量）
    blobs = gitLsTree(dir, SHA, ["develop", "reference/latest", "reference/build.gradle", "public", ".github"]);
    treeSha = gitRootTreeSha(dir, SHA);
    inventoryChannel = "git_ls_tree";
  } else {
    console.log("[provision-fabric-latest] 清单通道：GitHub trees API（匿名 60/h，可能 403）");
    const snap = await retry(() => curlJson(`https://api.github.com/repos/${REPO_SLUG}/git/trees/${SHA}?recursive=1`));
    if (!Array.isArray(snap.tree)) throw new Error("trees 载荷无 tree 数组");
    truncated = snap.truncated === true;
    if (truncated) throw new Error("trees truncated=true：清单不完整，禁止落盘（会做出缺页假象）");
    blobs = snap.tree
      .filter((t) => t.type === "blob")
      .map((t) => ({ path: t.path, blobSha: t.sha, size: t.size ?? 0 }));
    treeSha = snap.sha ?? null;
    inventoryChannel = "github_trees_api";
  }

  const pages = pickDevelopPages(blobs);
  const refs = pickReferenceFiles(blobs);
  const fetchedAt = new Date().toISOString();
  console.log(`[provision-fabric-latest] 上游清单：develop ${pages.length} 页 · reference/latest ${refs.length} 文件`);

  if (!WRITE) {
    console.log(`[dry-run] 将写 ${RAW_DIR}`);
    pages.slice(0, 8).forEach((p) => console.log(`  ${p}`));
    if (pages.length > 8) console.log(`  … 共 ${pages.length}`);
    console.log(`[dry-run] 将写 ${REF_ROOT}（${refs.length} 文件）`);
    console.log(`[dry-run] tree sha=${treeSha ?? "?"} truncated=${truncated}`);
    return;
  }

  // 增量：同一 commit 且 raw 已在盘 ⇒ 复用，不重下（网络抖动时只补缺件）
  const prevPages = new Map();
  try {
    const j = JSON.parse(readFileSync(join(PACK_ROOT, "meta.json"), "utf8"));
    for (const p of j?.meta?.docs?.pages ?? []) prevPages.set(p.gitPath, p);
  } catch {
    /* 首跑无旧 meta */
  }
  let prevRef = {};
  try {
    prevRef = JSON.parse(readFileSync(join(PACK_ROOT, "reference.provenance.json"), "utf8"))?.files ?? {};
  } catch {
    /* 首跑无旧 provenance */
  }

  const failures = [];
  const pageMeta = [];
  let done = 0;

  await mapPool(pages, async (gitPath) => {
    const url = `${RAW_BASE}/${gitPath}`;
    const rawName = gitPath.replace(/\//g, "_").replace(/\.md$/, "") + ".md";
    const prev = prevPages.get(gitPath);
    if (prev && prev.commitSha === SHA && existsSync(join(RAW_DIR, rawName))) {
      pageMeta.push(prev);
      done++;
      return;
    }
    const tmp = join(tmpdir(), `mc-skill-page-${process.pid}-${Math.random().toString(16).slice(2)}.md`);
    try {
      const ok = await curlGetRetry(url, tmp);
      if (!ok) {
        failures.push({ path: gitPath, kind: "page" });
        return;
      }
      const content = readFileSync(tmp, "utf8");
      const digest = sha256(content);
      const { filename, bytes } = writeRaw(gitPath, content, url, fetchedAt, digest);
      pageMeta.push({
        id: gitPath.replace(/\.md$/, "").replace(/\//g, "-"),
        gitPath,
        filename,
        source: "github_latest_pinned",
        url,
        branch: "main",
        commitSha: SHA,
        fetchedAt,
        sha256: digest,
        bytes,
      });
      done++;
      if (done % 25 === 0) console.log(`  … ${done}/${pages.length} 页`);
    } catch {
      failures.push({ path: gitPath, kind: "page" });
    } finally {
      try {
        unlinkSync(tmp);
      } catch {
        /* ignore */
      }
    }
  });

  // `<<< @/public/...`、`<<< @/.github/...` 这类根级引用：只取页面真实点名过的目标（对齐 26.1.2 档的 1+1 取件，不全量 public）
  const extraTargets = new Set();
  const ANGLE_RE = /^ *<<< *(\S+)/gm;
  const CODE_RE = /@\[code[^\]]*\]\(([^)]+)\)/g;
  const stripSpec = (raw) =>
    String(raw)
      .trim()
      // `@/public/...` 去 `@` 后还剩前导 `/`，不去掉会让 startsWith("public/") 永远 false
      .replace(/^@?\/*/, "")
      .replace(/\{[^}]*\}$/, "")
      .replace(/\[[^\]]*\]$/, "")
      .replace(/#.*$/, "");
  for (const m of pageMeta) {
    let text = "";
    try {
      text = readFileSync(join(RAW_DIR, m.filename), "utf8");
    } catch {
      continue;
    }
    for (const hit of text.matchAll(ANGLE_RE)) extraTargets.add(stripSpec(hit[1]));
    for (const hit of text.matchAll(CODE_RE)) extraTargets.add(stripSpec(hit[1]));
  }
  const extras = [...extraTargets].filter((p) => p.startsWith("public/") || p.startsWith(".github/")).sort();

  const extraFiles = {};
  await mapPool(extras, async (relPath) => {
    const blob = blobs.find((b) => b.path === relPath);
    if (!blob) {
      failures.push({ path: relPath, kind: "extra-missing-upstream" });
      return;
    }
    const dest = join(PACK_ROOT, relPath);
    const prev = prevRef[relPath];
    if (prev && prev.blobSha === blob.blobSha && existsSync(dest)) {
      extraFiles[relPath] = prev;
      return;
    }
    const ok = await curlGetRetry(`${RAW_BASE}/${relPath}`, dest);
    if (!ok) {
      failures.push({ path: relPath, kind: "extra" });
      return;
    }
    const buf = readFileSync(dest);
    extraFiles[relPath] = { blobSha: blob.blobSha, sha256: sha256(buf), bytes: buf.length };
  });
  console.log(`[provision-fabric-latest] 根级引用取件 ${Object.keys(extraFiles).length}/${extras.length}（${extras.join(", ") || "无"}）`);

  const refFiles = {};
  await mapPool(refs, async (f) => {
    // `reference/latest/**` → <packRoot>/reference/latest/**；档根 `reference/build.gradle` → <packRoot>/reference/build.gradle
    const isRootFile = f.path === "reference/build.gradle";
    const dest = isRootFile ? join(PACK_ROOT, "reference", "build.gradle") : join(REF_ROOT, f.path.slice("reference/latest/".length));
    const url = `${RAW_BASE}/${f.path}`;
    const prev = prevRef[f.path];
    if (prev && prev.blobSha === f.blobSha && existsSync(dest)) {
      refFiles[f.path] = prev;
      return;
    }
    try {
      const ok = await curlGetRetry(url, dest);
      if (!ok) {
        failures.push({ path: f.path, kind: "reference" });
        return;
      }
      const buf = readFileSync(dest);
      refFiles[f.path] = { blobSha: f.blobSha, sha256: sha256(buf), bytes: buf.length };
    } catch {
      failures.push({ path: f.path, kind: "reference" });
    }
  });
  console.log(`[provision-fabric-latest] reference 落地 ${Object.keys(refFiles).length}/${refs.length}`);

  pageMeta.sort((a, b) => a.gitPath.localeCompare(b.gitPath));

  mkdirSync(DOCS_ROOT, { recursive: true });
  writeFileSync(
    join(DOCS_ROOT, "upstream-tree.json"),
    JSON.stringify(
      {
        platform: "fabric",
        version: VERSION,
        source: "github_trees",
        inventoryChannel,
        layout: "latest-unprefixed",
        repo: REPO_SLUG,
        branch: "main",
        commitSha: SHA,
        treeSha,
        truncated,
        discoveredAt: fetchedAt,
        pageCount: pages.length,
        pages,
        referencePrefix: "reference/latest",
        referenceFileCount: refs.length,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  writeFileSync(
    join(PACK_ROOT, "reference.provenance.json"),
    JSON.stringify(
      {
        sourceRepo: REPO_SLUG,
        branch: "main",
        commitSha: SHA,
        fetchedAt,
        integrity: "git blob SHA-1 取自上游 tree；sha256 为本地防漂移",
        expandSpec: "markdown-it-vuepress-code-snippet-enhanced@dfb9fa25527b2f772d50ca37ae526484c890b8ae",
        version: VERSION,
        layout: "latest-unprefixed",
        files: { ...refFiles, ...extraFiles },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  writeFileSync(
    join(PACK_ROOT, "meta.json"),
    JSON.stringify(
      {
        meta: {
          lastUpdatedAt: fetchedAt.slice(0, 10),
          platform: "fabric",
          mcVersion: VERSION,
          fetchedAt,
          layout: "latest-unprefixed",
          docs: {
            sourceRepo: REPO_SLUG,
            branch: "main",
            sourceTreeSha: SHA,
            sourceTreeTruncated: truncated,
            inventoryChannel,
            acceptedSources: ["github_latest_pinned"],
            pages: pageMeta,
            failures,
          },
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  console.log(
    `[provision-fabric-latest] 页 ${pageMeta.length}/${pages.length} · reference ${Object.keys(refFiles).length}/${refs.length} · 失败 ${failures.length}`,
  );
  if (failures.length) {
    console.error("[provision-fabric-latest] 有失败项，退出码 1（不要把它当成完整档）");
    process.exitCode = 1;
  } else {
    console.log(`[provision-fabric-latest] 完成。下一步：node scripts/process-fabric-docs.js --version=${VERSION}`);
  }
}

main().catch((e) => {
  console.error(`[provision-fabric-latest] FATAL: ${e.message}`);
  process.exit(1);
});
