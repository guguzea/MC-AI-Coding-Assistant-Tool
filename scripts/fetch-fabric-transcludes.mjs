/**
 * Wave 7.1（D-2=B）：fabric-docs `@[code …](@/reference/**)` transclude 真展开的**取件端**。
 *
 * 为什么需要它：`data/fabric_<v>/fabric-docs/<v>/{raw,processed}/**.md` 里 3344 处
 * `@[code transcludeWith=…](@/reference/…)` 占位从来没被展开，`get_fabric_doc_full`
 * 于是把「官方页有的示例代码」整段吐成空块，用户以为本版没写。上游 docs.fabricmc.net 用
 * `markdown-it-vuepress-code-snippet-enhanced`（fabric-docs 钉的 fork commit
 * dfb9fa25527b2f772d50ca37ae526484c890b8ae）在渲染期展开，正文不落盘 —— 所以离线侧必须
 * 自己把 `reference/**` 取下来，展开才有原料。运行时展开在
 * `mcp-server/src/docs-platform/fabric/transclude.ts`，本脚本只负责**取件 + 出处表**。
 *
 * 三条实测通道纪律（写死在这里，别再有人用 HEAD 或 Node fetch 判「github 不可达」）：
 *  1. 建表只用一次 `GET api.github.com/repos/FabricMC/fabric-docs/git/trees/main?recursive=1`
 *     → 全仓路径 + blob sha 白名单（默认读 temp/fabric-docs-main-tree.json，先建表再取件，不猜路径）。
 *  2. 取件走 raw，失败退到 jsDelivr；两条腿都是 `curl.exe --ssl-no-revoke` GET。
 *     Node `fetch` 对 raw 域必 `TLS_VERIFY_FAILED`，HEAD 会 502 而同一 URL GET 200 —— 都禁止。
 *  3. 每个落盘文件都用 git blob SHA-1（`blob <len>\0` + 内容）对账白名单里的 blob sha，
 *     不一致就拒绝写盘。sha256 只是本地防漂移，blob sha 才是「内容与上游该 commit 逐字节相同」的证据。
 *
 * 用法：
 *   node scripts/fetch-fabric-transcludes.mjs --plan            只勘察（离线，目标表 + 缺口）
 *   node scripts/fetch-fabric-transcludes.mjs                   DRYRUN：取件到 temp，打印将写盘清单
 *   node scripts/fetch-fabric-transcludes.mjs --write           真写 data/fabric_<v>/<上游路径> + provenance
 *   可选 --tree=<path> --cache-dir=<path> --batch=<n> --parallel=<n>
 *
 * 写盘一律经 scripts/_lib/write-guard.mjs（默认 DRYRUN）。别名表是本脚本的唯一真源，
 * 会原样写进每档 reference.provenance.json 的 `aliases`，供运行时与 gate 共用 ——
 * 语料正文保持上游逐字节原样，不改写任何 .md。
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { curlBatchDownload, curlDownload } from "./_lib/fetch-with-ua.mjs";
import { emit, logDryRunBanner, scratchMkdirAll, scratchRemove, scratchWriteText, wantWrite } from "./_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, def) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
};

const SOURCE_REPO = "FabricMC/fabric-docs";
const BRANCH = "main";
const VERSIONS = ["1.20.4", "1.21.1", "1.21.4", "1.21.8", "1.21.10", "1.21.11"];
const TREE_FILE = opt("tree", join(ROOT, "temp", "fabric-docs-main-tree.json"));
const CACHE_DIR = opt("cache-dir", join(ROOT, "temp", "_w71_reference_cache"));
/** 批量参数：实测（2026-09-07）jsDelivr 单进程 -Z 拉 8 件 1.06 s，逐个 1.3–2 s；raw 有 15 s 级长尾。 */
const BATCH = Number(opt("batch", "40"));
const PARALLEL = Number(opt("parallel", "8"));
const PLAN_ONLY = flag("plan");
const WRITE = wantWrite(argv);

/**
 * 别名表：语料写的目标在上游 main 不存在，但白名单核对证明它只是路径漂移。
 * 逐条给出**核对依据**（候选来自 git/trees 白名单，内容来自 raw GET），
 * 无依据的一律不许进表 —— 表里的每条都必须能在 gate 的 evidence 里查到。
 */
const ALIASES = {
  "@/reference/1.20.4/src/main/java/com/example/docs/mixin/potion/PotionBrewingInvoker.java": {
    realPath: "reference/1.20.4/src/main/java/com/example/docs/mixin/potion/BrewingRecipeRegistryInvoker.java",
    reason: "上游该目录只有 BrewingRecipeRegistryInvoker.java（PotionBrewingInvoker 从未存在）；候选内含语料要的 :::1 区段",
    evidence: "tree blob 同目录命中=1（BrewingRecipeRegistryInvoker.java）；raw GET 200 内含 `// :::1` ×2",
  },
  "@/reference/1.21.1/src/main/generated/data/example-mod/advancement/example-mod/get_dirt.json": {
    realPath: "reference/1.21.1/src/main/generated/data/minecraft/advancement/example-mod/get_dirt.json",
    reason: "1.21.1 的 datagen 产物落在 data/minecraft/advancement/<ns>/<name>.json，语料写作 data/example-mod/advancement/example-mod/ 是旧命名",
    evidence: "tree blob 同 stem 命中含 1.21.1 该路径；1.21.10/1.21.11/26.1.2 已改 data/example-mod/advancement/<name>.json",
  },
  "@/reference/1.21.11/src/main/java/com/example/docs/menu/ModMenuType.java": {
    realPath: "reference/1.21.11/src/main/java/com/example/docs/menu/ModMenuTypes.java",
    reason: "上游文件名为复数 ModMenuTypes.java；单数形式在同目录不存在",
    evidence: "tree blob 同目录命中=4（ExampleModMenuType / ModMenuTypes / DirtChestMenu / UpgradingMenu），其中 ModMenuTypes.java 含语料要的 :::registerMenu 区段",
  },
  "@/.github/workflows/build.yml": {
    realPath: ".github/workflows/build.yaml",
    reason: "上游工作流文件扩展名为 .yaml；语料正文（prose）写作 build.yml，取件须指 .yaml",
    evidence: "tree blob .github/workflows/ = build.yaml, format.yaml, l10n-pull.yaml, l10n-push.yaml（无 build.yml）",
  },
};

const MARKER_RE = /@\[code([^\]]*)\]\(([^)]*)\)/g;
const FENCE_RE = /^ *(```|~~~)/;
const BIN_RE = /\.(sqlite|db|gz|zip|jar)$/i;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (!BIN_RE.test(name)) out.push(p);
  }
  return out;
}

/**
 * 只收「上游会展开」的标记行。缩进门按上游语义算：snippet 规则判的是
 * `state.sCount - state.blkIndent >= 4`（temp/_w71_plugin.js:163），即**相对**所属块的缩进，
 * 所以列表续行（绝对 4 空格、相对 2）上游照样展开。实测 3344 处：缩进 0 = 3316、2 = 18、4 = 10
 * （10 处全在 develop_items_custom-tools.md 的 `- ###` 列表项内），围栏内 0 处、含 tab 0 处。
 * 因此这里收「行首只有空格」的全部标记，围栏内的字面文本仍排除。
 */
function collectMarkers() {
  const sites = [];
  for (const v of VERSIONS) {
    const base = join(ROOT, "data", `fabric_${v}`, "fabric-docs", v);
    for (const f of walk(base)) {
      const text = readFileSync(f, "utf8");
      let fence = false;
      const lines = text.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (FENCE_RE.test(line)) { fence = !fence; continue; }
        if (fence) continue;
        if (!/^ *@\[code/.test(line)) continue;
        MARKER_RE.lastIndex = 0;
        let m;
        while ((m = MARKER_RE.exec(line))) {
          sites.push({ version: v, file: relative(ROOT, f).split(sep).join("/"), line: i + 1, attrs: m[1].trim(), target: m[2].trim() });
        }
      }
    }
  }
  return sites;
}

function upstreamPathOf(target) {
  const aliased = ALIASES[target];
  if (aliased) return { path: aliased.realPath, alias: aliased };
  const stripped = target.replace(/^@/, "").replace(/^\//, "");
  return { path: stripped, alias: null };
}

function gitBlobSha(buf) {
  const h = createHash("sha1");
  h.update(`blob ${buf.length}\u0000`);
  h.update(buf);
  return h.digest("hex");
}

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

/** jsDelivr 不需要逐段 encodeURIComponent（实测 200 且路径原样），批量腿用它。 */
function jsdelivrUrl(relPath) {
  return `https://cdn.jsdelivr.net/gh/${SOURCE_REPO}@${BRANCH}/${relPath}`;
}

/** 逐个腿的通道顺序：jsDelivr 稳定 1.3–2 s；raw 实测有 15 s 级超时长尾，故只做兜底。 */
function channelUrls(relPath) {
  const enc = relPath.split("/").map(encodeURIComponent).join("/");
  return [
    { name: "jsdelivr", url: jsdelivrUrl(relPath) },
    { name: "raw", url: `https://raw.githubusercontent.com/${SOURCE_REPO}/${BRANCH}/${enc}` },
  ];
}

function fetchOne(relPath) {
  const attempts = [];
  scratchMkdirAll(CACHE_DIR);
  const dest = join(CACHE_DIR, relPath.replace(/[\\/]/g, "__"));
  for (const ch of channelUrls(relPath)) {
    const r = curlDownload({ url: ch.url, dest, timeoutMs: 45_000, minBytes: 0 });
    attempts.push({ channel: ch.name, ok: r.ok, status: r.status || 0, failureClass: r.failureClass || null, bytes: r.bytes || 0 });
    if (r.ok) {
      const buf = readFileSync(dest);
      scratchRemove(dest);
      return { ok: true, buf, via: ch.name, attempts };
    }
  }
  scratchRemove(dest);
  return { ok: false, via: null, attempts };
}

/* ── 主流程 ───────────────────────────────────────────────────────────── */

const sites = collectMarkers();
if (!sites.length) {
  console.error(`扫到 0 处 @[code 标记 —— 这不是「无需展开」，是路径算错或语料缺失。ROOT=${ROOT}`);
  process.exit(2);
}
const tree = existsSync(TREE_FILE) ? JSON.parse(readFileSync(TREE_FILE, "utf8")) : null;
const commitSha = tree ? tree.sha : null;
const blobs = tree ? new Map(tree.tree.filter((t) => t.type === "blob").map((t) => [t.path, t])) : new Map();

const uniq = new Map();
for (const s of sites) {
  const { path, alias } = upstreamPathOf(s.target);
  const key = `${s.target}\u0000${s.attrs}`;
  if (!uniq.has(key)) {
    uniq.set(key, { target: s.target, attrs: s.attrs, upstreamPath: path, alias, versions: new Set(), occurrences: 0, sites: [] });
  }
  const e = uniq.get(key);
  e.versions.add(s.version);
  e.occurrences++;
  if (e.sites.length < 3) e.sites.push(`${s.file}:${s.line}`);
}

const perVersion = {};
for (const v of VERSIONS) perVersion[v] = sites.filter((s) => s.version === v).length;
console.log(`标记处数=${sites.length} · 唯一(目标+属性)=${uniq.size} · 唯一目标=${new Set(sites.map((s) => s.target)).size} · 逐版=${JSON.stringify(perVersion)}`);

const notInTree = [];
for (const e of uniq.values()) {
  if (!blobs.has(e.upstreamPath)) notInTree.push(e);
}
console.log(`白名单核对：${uniq.size - notInTree.length}/${uniq.size} 目标能在 main 树里解析；别名改写 ${Object.keys(ALIASES).length} 条`);
for (const e of notInTree) console.log(`  ✗ 树里没有: ${e.target} → ${e.upstreamPath}（${e.occurrences} 处，样本 ${e.sites[0]}）`);

if (PLAN_ONLY) {
  console.log("\n--plan：只勘察，不取件不写盘。");
  process.exit(notInTree.length ? 1 : 0);
}
if (!tree) {
  console.error(`缺建表文件 ${relative(ROOT, TREE_FILE)}；先跑 git/trees/main?recursive=1 建表（不猜路径）。`);
  process.exit(2);
}

/* 取件：按上游路径去重（同一文件被多篇/多档引用只抓一次） */
const notInTreeSet = new Set(notInTree);
const needed = new Map();
for (const e of uniq.values()) {
  if (notInTreeSet.has(e)) continue;
  if (!needed.has(e.upstreamPath)) needed.set(e.upstreamPath, []);
  needed.get(e.upstreamPath).push(e);
}
const cacheDirForBlob = join(CACHE_DIR, "blobs");
scratchMkdirAll(cacheDirForBlob);
const destOf = (relPath) => join(cacheDirForBlob, relPath.replace(/[\\/]/g, "__"));
/** 批量 URL 不逐段转义，所以带特殊字符的路径只许走逐个腿（实测本仓 0 条，仍留闸）。 */
const batchSafe = (relPath) => relPath === relPath.split("/").map(encodeURIComponent).join("/");

const fetched = new Map();
const failed = [];
let badCache = 0;

/** 逐字节对账上游 tree 条目：一致才入账，返回是否收下。 */
function accept(relPath, buf, via) {
  const want = blobs.get(relPath).sha;
  if (gitBlobSha(buf) !== want) return false;
  fetched.set(relPath, { bytes: buf.length, blobSha: want, sha256: sha256(buf), via, content: buf.toString("utf8") });
  return true;
}

/* ① 缓存复用 */
const pending = [];
for (const relPath of needed.keys()) {
  const local = destOf(relPath);
  if (!existsSync(local)) {
    pending.push(relPath);
    continue;
  }
  const buf = readFileSync(local);
  if (accept(relPath, buf, "cache")) continue;
  badCache++;
  scratchRemove(local);
  pending.push(relPath);
}
console.log(`缓存复用：命中 ${fetched.size} · 坏件重取 ${badCache} · 待取 ${pending.length}`);

/* ② jsDelivr 批量腿（单进程 -Z 并行） */
const retry = [];
let done = 0;
for (let i = 0; i < pending.length; i += BATCH) {
  const chunk = pending.slice(i, i + BATCH).filter(batchSafe);
  const skipped = pending.slice(i, i + BATCH).length - chunk.length;
  for (const p of pending.slice(i, i + BATCH)) if (!batchSafe(p)) retry.push({ path: p, note: "路径含特殊字符，跳过批量腿" });
  const items = chunk.map((p) => ({ path: p, dest: destOf(p), url: jsdelivrUrl(p) }));
  const r = curlBatchDownload({ items, timeoutMs: 60_000, parallelMax: PARALLEL });
  for (const it of items) {
    if (!existsSync(it.dest)) {
      retry.push({ path: it.path, note: `批量腿未取到（curl exit ${r.curlExit}）` });
      continue;
    }
    const buf = readFileSync(it.dest);
    if (accept(it.path, buf, "jsdelivr-batch")) continue;
    scratchRemove(it.dest);
    retry.push({ path: it.path, note: "批量腿 blob sha 不符" });
  }
  done += chunk.length + skipped;
  console.log(`  批量腿 ${Math.min(done, pending.length)}/${pending.length} · 累计入账 ${fetched.size} · 待逐个重试 ${retry.length}`);
}

/* ③ 逐个腿（jsDelivr → raw 轮转，各带 --retry 3） */
for (const item of retry) {
  const r = fetchOne(item.path);
  if (!r.ok) {
    failed.push({ relPath: item.path, attempts: r.attempts, note: item.note });
    continue;
  }
  // 存原始 Buffer：scratchWriteText 对 Buffer 不改编码，下次跑「缓存复用」腿才能仍对上 blob sha。
  if (accept(item.path, r.buf, `${r.via}-solo`)) scratchWriteText(destOf(item.path), r.buf);
  else failed.push({ relPath: item.path, attempts: [{ channel: r.via, ok: true, status: 200, bytes: r.buf.length }], note: "逐个腿 blob sha 仍不符" });
}

console.log(`取件：需要 ${needed.size} 个上游文件 · 入账 ${fetched.size} · 失败 ${failed.length} · 缓存坏件 ${badCache}（blob sha 一律对账 ${BRANCH} 树条目）`);
for (const f of failed.slice(0, 10)) {
  console.log(`  ✗ ${f.relPath}${f.note ? ` [${f.note}]` : ""} :: ${f.attempts.map((a) => `${a.channel}=${a.status || a.failureClass}`).join(" ")}`);
}

const unresolved = [...notInTree, ...failed.map((f) => ({ target: f.relPath, occurrences: 1 }))];
if (unresolved.length) {
  console.error(`\n仍有 ${unresolved.length} 个目标取不到/对不上 —— 不写盘（宁可整档缺缓存，也不要半成品 provenance）。`);
  process.exit(1);
}

/* 落盘：每档按「档根 = 上游仓库根」镜像上游路径 + reference.provenance.json */
let wroteFiles = 0;
let wroteProvenance = 0;
let plannedFiles = 0;
let plannedProvenance = 0;
for (const v of VERSIONS) {
  const paths = new Set();
  for (const [relPath, entries] of needed) if (entries.some((e) => e.versions.has(v))) paths.add(relPath);
  if (!paths.size) continue;
  for (const relPath of paths) {
    const rec = fetched.get(relPath);
    /** 档根扮演上游 `process.cwd()`：上游解析是 `fullpath.replace(/^@/, cwd)`，所以本地镜像 =
     *  `data/fabric_<v>/<上游相对路径>`（`reference/1.20.4/src/...` 与 `.github/workflows/...` 同规则），
     *  运行时按同一公式回推，不需要第二张路径表。 */
    const target = join(ROOT, "data", `fabric_${v}`, relPath);
    plannedFiles++;
    if (emit(target, rec.content)) wroteFiles++;
  }
  const provenance = {
    sourceRepo: SOURCE_REPO,
    branch: BRANCH,
    commitSha,
    treeFile: relative(ROOT, TREE_FILE).split(sep).join("/"),
    fetchedAt: new Date().toISOString(),
    integrity: "git blob SHA-1（`blob <len>\\0` + 内容）逐文件对账上游 tree 条目；sha256 为本地防漂移",
    expandSpec: "markdown-it-vuepress-code-snippet-enhanced@dfb9fa25527b2f772d50ca37ae526484c890b8ae（transcludeWith=区间翻转 / transclude={a-b}=行区间 / 缺省整文件；除 dontTrim 外按最短前导空白反缩进）",
    version: v,
    files: Object.fromEntries(
      [...paths].sort().map((p) => {
        const rec = fetched.get(p);
        return [p, { blobSha: rec.blobSha, sha256: rec.sha256, bytes: rec.bytes, via: rec.via }];
      }),
    ),
    aliases: Object.fromEntries(
      Object.entries(ALIASES).filter(([, a]) => paths.has(a.realPath)).map(([t, a]) => [t, { realPath: a.realPath, reason: a.reason, evidence: a.evidence }]),
    ),
  };
  const pfile = join(ROOT, "data", `fabric_${v}`, "reference.provenance.json");
  plannedProvenance++;
  if (emit(pfile, JSON.stringify(provenance, null, 2) + "\n")) wroteProvenance++;
  console.log(`  ${v}: reference 文件 ${paths.size} · provenance ${WRITE ? "写入" : "DRYRUN"}`);
}

console.log(`\n完成：reference 文件 ${wroteFiles}/${plannedFiles} 写盘 · provenance ${wroteProvenance}/${plannedProvenance} 份${WRITE ? "" : "（DRYRUN，加 --write 才落盘）"}`);
if (!WRITE) logDryRunBanner("fetch-fabric-transcludes.mjs");
