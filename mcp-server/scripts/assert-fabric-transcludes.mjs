/**
 * Gate：Fabric 语料 transclude 展开的离线自证（Wave 7.1 / D-2=B「真展开」的验收面）。
 *
 * 背景：上游 fabric-docs 的 `.md` 里代码全是 `@[code …](@/reference/…)` 占位符，由 VitePress
 * 渲染期读同仓库 `reference/` 展开（`markdown-it-vuepress-code-snippet-enhanced@dfb9fa25`）。
 * 我们镜像语料时只拷了 `.md`，于是 `get_fabric_doc_full` 吐给模型的是 1672 处裸占位符 = 空代码块。
 * 现在取件端 `scripts/fetch-fabric-transcludes.mjs` 把 reference 镜像到 `data/fabric_<ver>/`，
 * 运行时 `src/docs-platform/fabric/transclude.ts` 在读取侧展开。本 gate 证明这三件事都还成立。
 *
 * 断言分两层：
 *  A. 内容层（任何数据根都跑）
 *     A1 每个 `@[code]` 目标都能在本地 reference 镜像里取到字节（missing / malformed / 残留标记 = 0）；
 *     A2 展开后正文里没有空代码块；
 *     A3 整文件展开块（无 transclude* 属性）的 sha256 必须命中 provenance 表；区间块每一行必须
 *        是上游文件里出现过的原文行（去缩进后）——区间块的 sha 不等于整文件 sha，但内容必须是原文；
 *     A4 provenance ↔ 磁盘双向对账：表内每个文件在盘上且 sha256 相符；盘上每个文件都在表内；
 *     A5 同一占位符集在 raw/ 与 processed/ 两侧计数相同（语料加工没吞标记，也没造标记）。
 *  B. 台账层（只跑真数据根；测试假根跳过）
 *     逐版 processed 处数 = 127/224/260/278/344/439，合计 1672，raw+processed = 3344，
 *     全局唯一目标 = 669。这些数与 §12 台账和 plan 里的「3344 处 / 669 目标」同口径。
 *  C. 摘要位（2026-09-25 补）：`sections[].summary` / `firstParagraph` 是烘焙期按**未展开**原文
 *     截的首段，会把裸标记当正文交给模型。本腿造真 store 调 `loadSummary` / `loadFullDoc`，
 *     判服务出的响应（读文件比对字符串看不见「清洗调用被摘掉」这种变异）；另配两条合成串
 *     单元腿，语料哪天重烘焙（靶子归 0）也不失去判据。
 *
 * 投毒自检在 `test-scripts.mjs`：假根里删一个 reference 文件 / 改一个字节 / 删一行 processed 标记，
 * 本 gate 必须立刻红并且点名该目标。
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
let runtime;
try {
  runtime = await import("../dist/docs-platform/fabric/transclude.js");
} catch {
  console.error(
    "assert-fabric-transcludes: 缺 ../dist/docs-platform/fabric/transclude.js —— 先 `npm run build`" +
      "（本 gate 与运行时共用同一份展开实现，不另写一份正则）",
  );
  process.exit(1);
}
const {
  clearTranscludeCache,
  expandTranscludes,
  hasUnexpandedMarker,
  loadReferenceProvenance,
  referenceAvailable,
  scanTranscludeSites,
  stripTranscludeMarkers,
  upstreamRelPathFor,
  referenceLocalPath,
} = runtime;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

/** 测试假根：与 assert-powershell 的 MC_SKILL_PS_TEST_ROOT 同形态。 */
const TEST_ROOT = process.env.MC_SKILL_TRANSCLUDE_TEST_ROOT;
const DATA_DIR = TEST_ROOT ? path.resolve(TEST_ROOT) : path.resolve(process.env.MC_SKILL_DATA || path.join(REPO_ROOT, "data"));

const EXPECTED_PROCESSED_SITES = {
  "1.20.4": 127,
  "1.21.1": 224,
  "1.21.4": 260,
  "1.21.8": 278,
  "1.21.10": 344,
  "1.21.11": 439,
  "26.1.2": 0,
};
const EXPECTED_TOTAL_SITES = 3344;
const EXPECTED_PROCESSED_TOTAL = 1672;
const EXPECTED_UNIQUE_TARGETS = 669;

const failures = [];
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join("/");
const fail = (msg) => failures.push(msg);

if (!fs.existsSync(DATA_DIR)) {
  console.error(`assert-fabric-transcludes: 数据根不存在 ${DATA_DIR}（MC_SKILL_DATA 指对了吗？）`);
  process.exit(1);
}

/** 找出所有「带 reference 镜像」的档：`data/fabric_<ver>/reference.provenance.json`。 */
function findPacks() {
  const packs = [];
  for (const name of fs.readdirSync(DATA_DIR)) {
    if (!name.startsWith("fabric_")) continue;
    const packRoot = path.join(DATA_DIR, name);
    if (!fs.statSync(packRoot).isDirectory()) continue;
    if (!fs.existsSync(path.join(packRoot, "reference.provenance.json"))) continue;
    packs.push({ version: name.slice("fabric_".length), packRoot });
  }
  return packs.sort((a, b) => a.version.localeCompare(b.version));
}

/** 档内的 `<source>/<subv>/{raw,processed}` 目录对。 */
function findTrees(packRoot) {
  const trees = [];
  for (const source of fs.readdirSync(packRoot)) {
    const sourceDir = path.join(packRoot, source);
    if (!fs.statSync(sourceDir).isDirectory()) continue;
    if (source === "reference" || source === "mappings" || source.startsWith(".")) continue;
    for (const sub of fs.readdirSync(sourceDir)) {
      const subDir = path.join(sourceDir, sub);
      if (!fs.statSync(subDir).isDirectory()) continue;
      for (const kind of ["raw", "processed"]) {
        const dir = path.join(subDir, kind);
        if (fs.existsSync(dir)) trees.push({ source, kind, dir });
      }
    }
  }
  return trees;
}

function listMarkdown(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f))
    .sort();
}

/** 从展开后正文里抽出（块体, 来源注释里的目标+attrs）配对。 */
function parseExpandedBlocks(content) {
  const lines = content.split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const open = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(lines[i]);
    if (!open) continue;
    const fence = open[1];
    const closeRe = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}\\s*$`);
    const body = [];
    let j = i + 1;
    while (j < lines.length && !closeRe.test(lines[j])) {
      body.push(lines[j]);
      j++;
    }
    if (j >= lines.length) break;
    const m = /^<!-- source: (\S+)(.*?) -->$/.exec(lines[j + 1]?.trim() ?? "");
    if (m) blocks.push({ body: body.join("\n"), target: m[1], attrs: m[2].trim(), info: open[2] });
    i = j + (m ? 1 : 0);
  }
  return blocks;
}

const census = { processedSites: 0, rawSites: 0, uniqueTargets: new Set(), perVersion: {} };

const packs = findPacks();
if (packs.length === 0) {
  console.error(
    `assert-fabric-transcludes: ${rel(DATA_DIR)} 下没有任何带 reference.provenance.json 的 fabric 档 —— ` +
      `先跑 \`node scripts/fetch-fabric-transcludes.mjs --write\`（取件端），别把「零档」当「零缺陷」。`,
  );
  process.exit(1);
}

clearTranscludeCache();

for (const { version, packRoot } of packs) {
  const provenance = loadReferenceProvenance(packRoot);
  if (!provenance) {
    fail(`${rel(packRoot)}: 有 reference.provenance.json 但解析失败`);
    continue;
  }
  if (!referenceAvailable(packRoot)) {
    fail(`${rel(packRoot)}: provenance 在但 reference/ 目录不在`);
  }

  // A4 双向对账：盘上的「镜像件」= 档根下除语料树 / mappings 之外的全部文件
  //（reference/ 之外还有 .github/**，上游 transclude 也引它）
  const trees = findTrees(packRoot);
  const excludeTop = new Set(["mappings"]);
  for (const t of trees) excludeTop.add(t.source);
  const diskFiles = new Set();
  const walkDisk = (dir, prefix) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      const up = prefix ? `${prefix}/${e.name}` : e.name;
      if (e.isDirectory()) walkDisk(abs, up);
      else diskFiles.add(up);
    }
  };
  for (const entry of fs.readdirSync(packRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || excludeTop.has(entry.name)) continue;
    walkDisk(path.join(packRoot, entry.name), entry.name);
  }
  const listed = new Set(provenance.files.keys());
  for (const relPath of listed) {
    const abs = path.join(packRoot, relPath);
    if (!fs.existsSync(abs)) {
      fail(`${rel(packRoot)}: provenance 列了 ${relPath} 但盘上没有（被删 / 被 git clean 掉）`);
      continue;
    }
    const want = provenance.files.get(relPath).sha256;
    const got = sha256(fs.readFileSync(abs));
    if (want !== got) {
      fail(`${rel(packRoot)}: ${relPath} 字节漂移 sha256 want=${String(want).slice(0, 12)} got=${got.slice(0, 12)}`);
    }
  }
  for (const relPath of diskFiles) {
    if (!listed.has(relPath)) fail(`${rel(packRoot)}: 盘上有 ${relPath} 但 provenance 没记（孤儿镜像文件）`);
  }

  // C-7 门⑤：越界目标不得被解析成 packRoot 之外的路径 —— 修前**回退分支没有检查**
  // （`join(root, target.replace(/^@/, ""))` 会把 `../..` 规范化掉），于是
  // `../../../../Windows/win.ini` 这类目标能逃出 packRoot，且内容会被内联进交付正文。
  const escapeTargets = [
    "../../../../Windows/win.ini",
    "../" + "..".repeat(6) + "/mcp-server/package.json",
  ];
  for (const t of escapeTargets) {
    const got = referenceLocalPath(t, packRoot, provenance);
    if (got !== null) {
      const out = path.relative(packRoot, got);
      if (!out || out.startsWith("..") || path.isAbsolute(out)) {
        fail(`${rel(packRoot)}: 越界目标 ${t} 被解析成 ${got}（逃出 packRoot，内容会被内联进交付正文）—— C7 回归`);
      }
    }
    // 端到端：越界目标必须并进既有「本地取不到」通道，且**不得有任何内容被内联**
    const probe = expandTranscludes(`@[code](${t})\n`, packRoot, provenance);
    if (!probe.missing.includes(t)) {
      fail(`${rel(packRoot)}: 越界目标 ${t} 未被计入 missing（missing=${JSON.stringify(probe.missing)})—— C7 回归`);
    }
    if (!probe.content.includes(`Not Found: ${t}`)) {
      fail(
        `${rel(packRoot)}: 越界目标 ${t} 的展开体不是「Not Found」占位，实得 ${JSON.stringify(probe.content.slice(0, 120))} —— C7 回归`,
      );
    }
  }
  // 正对照：真实目标仍必须解析到 packRoot 内且文件存在（防「一律返 null」式假绿）
  const realKey = [...provenance.files.keys()][0];
  if (!realKey) {
    fail(`${rel(packRoot)}: provenance.files 为空 —— 本门没法做正对照，取件端没跑？`);
  } else {
    const absReal = referenceLocalPath(`@/${realKey}`, packRoot, provenance);
    if (absReal === null) {
      fail(`${rel(packRoot)}: 正对照失败 —— 合法目标 @/${realKey} 被判越界（修完必须仍然解析得到）`);
    } else {
      const inside = path.relative(packRoot, absReal);
      if (inside.startsWith("..") || path.isAbsolute(inside)) {
        fail(`${rel(packRoot)}: 正对照 ${realKey} 解析到 packRoot 之外：${absReal}`);
      }
      if (!fs.existsSync(absReal)) fail(`${rel(packRoot)}: 正对照 ${realKey} 解析成 ${absReal} 但盘上不存在`);
    }
  }

  let versionProcessed = 0;
  const perTreeSites = {};
  for (const { source, kind, dir } of findTrees(packRoot)) {
    let treeSites = 0;
    for (const file of listMarkdown(dir)) {
      const text = fs.readFileSync(file, "utf-8");
      const sites = scanTranscludeSites(text);
      treeSites += sites.length;
      for (const s of sites) census.uniqueTargets.add(s.target);
      if (kind !== "processed") continue;
      const res = expandTranscludes(text, packRoot, provenance);
      versionProcessed += res.sites;
      if (res.malformed > 0) fail(`${rel(file)}: ${res.malformed} 处 attrs/目标畸形，未展开`);
      if (res.missing.length > 0) {
        fail(
          `${rel(file)}: ${res.missing.length} 个目标本地取不到 → ${res.missing.slice(0, 3).join(", ")}` +
            `（跑 scripts/fetch-fabric-transcludes.mjs --write 取件）`,
        );
      }
      if (hasUnexpandedMarker(res.content)) fail(`${rel(file)}: 展开后正文仍残留 @[code 占位符`);
      if (/^ {0,3}(```|~~~)[^\n]*\n^ {0,3}\1\s*$/m.test(res.content)) {
        fail(`${rel(file)}: 展开后出现空代码块`);
      }
      for (const block of parseExpandedBlocks(res.content)) {
        const upRel = upstreamRelPathFor(block.target, provenance);
        const abs = referenceLocalPath(block.target, packRoot, provenance);
        if (!fs.existsSync(abs)) continue; // 已由 missing 报过
        const fileText = fs.readFileSync(abs, "utf-8");
        const isWholeFile = !/transclude(With|Tag)=|transclude=\{/.test(block.attrs);
        if (isWholeFile) {
          const want = provenance.files.get(upRel)?.sha256;
          if (!want) {
            fail(`${rel(file)}: 整文件块 ${upRel} 不在 provenance 表里`);
            continue;
          }
          const got = sha256(Buffer.from(fileText, "utf-8"));
          if (got !== want) {
            fail(
              `${rel(file)}: ${block.target} 展开块对应的上游文件 sha256 与 provenance 不符 want=${String(want).slice(0, 12)} got=${got.slice(0, 12)}`,
            );
          }
          // 运行时保留文件字节，只去掉一个尾换行（markdown-it 渲染时补回）。
          if (block.body !== fileText.replace(/\n$/, "")) {
            fail(`${rel(file)}: ${block.target} 整文件展开块与文件字节不一致（长度 ${block.body.length} vs ${fileText.length}）`);
          }
          continue;
        }
        if (block.body === "No lines matched.") continue; // 上游同形（区间无命中）
        const pool = new Set(fileText.split("\n").map((l) => l.replace(/^\s+/, "")));
        const invented = block.body
          .split("\n")
          .map((l) => l.replace(/^\s+/, ""))
          .filter((l) => l.trim() !== "" && !pool.has(l));
        if (invented.length > 0) {
          fail(
            `${rel(file)}: ${block.target} 展开块含 ${invented.length} 行上游文件里没有的内容，例如 ` +
              `${JSON.stringify(invented[0].slice(0, 60))}`,
          );
        }
      }
    }
    perTreeSites[`${source}/${kind}`] = treeSites;
    if (kind === "raw") census.rawSites += treeSites;
    else census.processedSites += treeSites;
  }

  census.perVersion[version] = versionProcessed;
  for (const [key, n] of Object.entries(perTreeSites)) {
    if (!key.endsWith("/processed")) continue;
    const rawKey = key.replace(/\/processed$/, "/raw");
    if (perTreeSites[rawKey] !== n) {
      fail(`${rel(packRoot)} ${key.replace(/\/processed$/, "")}: raw=${perTreeSites[rawKey]} processed=${n} 占位符数不等`);
    }
  }
}

// ── B. 台账层（真数据根才钉数）────────────────────────────────────────────
if (!TEST_ROOT) {
  for (const [version, expected] of Object.entries(EXPECTED_PROCESSED_SITES)) {
    const got = census.perVersion[version];
    if (got === undefined) fail(`台账: 档 fabric_${version} 没有 reference 镜像（取件端没跑？）`);
    else if (got !== expected) fail(`台账: fabric_${version} processed 占位符 ${got} 处，应为 ${expected} 处`);
  }
  const versionsFound = Object.keys(census.perVersion).sort();
  const versionsWant = Object.keys(EXPECTED_PROCESSED_SITES).sort();
  if (versionsFound.join() !== versionsWant.join()) {
    fail(`台账: 带镜像的档 = ${versionsFound.join(", ")}，应为 ${versionsWant.join(", ")}`);
  }
  if (census.processedSites !== EXPECTED_PROCESSED_TOTAL) {
    fail(`台账: processed 占位符合计 ${census.processedSites} 处，应为 ${EXPECTED_PROCESSED_TOTAL} 处`);
  }
  if (census.rawSites + census.processedSites !== EXPECTED_TOTAL_SITES) {
    fail(`台账: raw+processed 合计 ${census.rawSites + census.processedSites} 处，应为 ${EXPECTED_TOTAL_SITES} 处`);
  }
  if (census.uniqueTargets.size !== EXPECTED_UNIQUE_TARGETS) {
    fail(`台账: 唯一目标 ${census.uniqueTargets.size} 个，应为 ${EXPECTED_UNIQUE_TARGETS} 个`);
  }
}

// ── C. 摘要位（sections[].summary / firstParagraph）不得吐裸标记 ───────────────
// 展开只发生在**正文**读取路径；摘要是烘焙期按未展开原文截的首段，于是 `<<< @/…` 会被当正文
// 交给模型。实测口径（2026-09-25 现扫 DATA_DIR 全部 index-l*.json：63 目录 / 183 文件）：
// 72 处，全部落在 `[].sections[].summary`，只 fabric_1.21.11（2）与 fabric_26.1.2（70）两档。
// 本腿不比对文件字符串 —— 那对「把清洗调用从载入处摘掉」这种变异是瞎的（实测：字符串全在，
// 行为没了）。所以直接造真 store 调 loadSummary / loadFullDoc，判的是**服务出来的响应**。
const SUMMARY_MARK = /<<<\s*@\s*\S+|@\[code\b/g;
const storeRuntime = await import("../dist/docs-platform/fabric/store.js").then(
  (m) => m,
  () => {
    fail("缺 dist/docs-platform/fabric/store.js —— 先 `npm run build`（本腿调的是运行时真入口）");
    return null;
  },
);
let summaryTargets = [];
let summarySwept = 0;
let summaryLeaks = 0;
if (storeRuntime) {
  const findBakedIndex = (dir, out = []) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return out;
    }
    for (const e of entries) {
      const ap = path.join(dir, e.name);
      if (e.isDirectory()) findBakedIndex(ap, out);
      else if (/^index-l[12]\.json$/.test(e.name)) out.push(ap);
    }
    return out;
  };
  const seen = new Set();
  for (const d of fs.existsSync(DATA_DIR) ? fs.readdirSync(DATA_DIR) : []) {
    if (!/^fabric_/.test(d)) continue;
    const version = d.slice("fabric_".length);
    for (const f of findBakedIndex(path.join(DATA_DIR, d))) {
      let arr;
      try {
        arr = JSON.parse(fs.readFileSync(f, "utf8"));
      } catch {
        continue; // 坏 json 由别的门管，本腿只找靶子
      }
      for (const e of Array.isArray(arr) ? arr : []) {
        const fields = [e?.firstParagraph, ...(e?.sections ?? []).map((s) => s?.summary)].filter(
          (t) => typeof t === "string",
        );
        const hit = fields.some((t) => {
          SUMMARY_MARK.lastIndex = 0;
          return SUMMARY_MARK.test(t);
        });
        if (!hit || !e.id) continue;
        const key = `${version}#${e.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        summaryTargets.push({ version, id: e.id });
      }
    }
  }
  for (const t of summaryTargets) {
    const store = storeRuntime.createFabricDocStore(t.version, "fabric-docs", DATA_DIR);
    let payloads;
    try {
      payloads = [store.loadSummary(t.id, t.version), await store.loadFullDoc(t.id, t.version)];
    } catch (err) {
      fail(`摘要靶子 ${t.version}/${t.id} 取不到响应（${err?.constructor?.name}）⇒ 本腿无法判定`);
      continue;
    }
    for (const p of payloads) {
      const served = [p?.firstParagraph, ...((p?.sections ?? p?.meta?.sections) ?? []).map((s) => s?.summary)].filter(
        (x) => typeof x === "string",
      );
      for (const text of served) {
        summarySwept++;
        SUMMARY_MARK.lastIndex = 0;
        if (SUMMARY_MARK.test(text)) {
          summaryLeaks++;
          if (summaryLeaks <= 5) {
            fail(`服务出的摘要仍含裸标记 ${t.version}/${t.id}: ${JSON.stringify(text.slice(0, 120))}`);
          }
        }
      }
    }
  }
  // 单元层：真实语料哪天被重烘焙（靶子归 0）时，这条腿仍要有靶子。两种标记形态都过一遍。
  if (typeof stripTranscludeMarkers !== "function") {
    fail("transclude.js 未导出 stripTranscludeMarkers：摘要位清洗失去实现，单元腿无法判");
  } else {
    for (const s of [
      "create the interface you'd like to inject: <<< @/reference/latest/src/main/java/a.java#region",
      "you can create your tool items: @[code lang=java](@/reference/26.1.2/src/main/java/b.java)",
    ]) {
      SUMMARY_MARK.lastIndex = 0;
      if (!SUMMARY_MARK.test(s)) fail(`合成靶子本身不含标记（${JSON.stringify(s.slice(0, 60))}）⇒ 判据空扫`);
      const head = s.split(/<<<|@\[code/)[0].trim();
      const cut = stripTranscludeMarkers(s);
      SUMMARY_MARK.lastIndex = 0;
      if (SUMMARY_MARK.test(cut)) fail(`合成串清洗后仍含标记: ${JSON.stringify(cut.slice(0, 90))}`);
      if (!cut.startsWith(head.slice(0, 20))) fail(`合成串清洗把正文也吃掉了: ${JSON.stringify(cut.slice(0, 90))}`);
      if (s === cut) fail(`合成串清洗是空转（前后逐字相同）: ${JSON.stringify(cut.slice(0, 60))}`);
    }
  }
}

const summary = {
  dataDir: rel(DATA_DIR),
  packs: packs.length,
  rawSites: census.rawSites,
  processedSites: census.processedSites,
  uniqueTargets: census.uniqueTargets.size,
  perVersion: census.perVersion,
  ledger: TEST_ROOT ? "skipped(test-root)" : "checked",
  summaryTargets: summaryTargets.length,
  summarySwept,
  summaryLeaks,
};

if (failures.length > 0) {
  console.error(`assert-fabric-transcludes: ${failures.length} 项不通过（${JSON.stringify(summary.perVersion)}）`);
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}

console.log(
  `  assert-fabric-transcludes: ${packs.length} 档 · processed 占位符 ${census.processedSites} 处全部展开 · ` +
    `唯一目标 ${census.uniqueTargets.size} · 台账 ${summary.ledger} · ` +
    `摘要位 靶子 ${summary.summaryTargets} 页 / 扫出字段 ${summary.summarySwept} 条 / 残留 ${summary.summaryLeaks} 条`,
);
