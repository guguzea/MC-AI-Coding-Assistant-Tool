/**
 * G4 · 索引与映射自洽门（Wave 7.1 / 修复计划 S4-G4）。
 *
 * 静默通道：`search_docs` 的语义层与 `convert_mapping` 的映射层都是「台账 + 磁盘 sqlite」两份真相。
 * 任一份悄悄漂移，工具照样 `ok:true`，只是命中变少、变空、或返回一个取不到正文的命中：
 * - manifest 说 70 chunks 而库里实际 74（quilt/1.20.4 实测过：整份 manifest 的 sha256 也一起过期）
 *   ⇒ `audit-data-consistency` 只打 WARN（S-semantic-meta / S-semantic-docs / S-semantic-fts5-only），
 *     本门把这三类升成必须红；
 * - `chunks_fts` 有行但 `docs` 没有对应 doc_id ⇒ 命中能返回、`get_doc_full` 取不到正文；
 * - 嵌入层整段为 0（F107 的 8 个 fabric-wiki 库）⇒ 语义检索静默退成纯 FTS，排名和「有向量」时不一样，
 *     没有任何字段告诉调用方；
 * - yarn-mappings.sqlite 的 meta 计数与实际行数不符 ⇒ `methodCountOf` 优先读 meta，
 *     于是覆盖率、命中率与「本版无该成员」的判断全按过期数字说话。
 *
 * 两层结构（与 G1/G2/G3 同形态）：
 *  A. 内容层（任何数据根都跑，纯规则；`MC_SKILL_INDEX_TEST_ROOT` 指假根时只跑这层）
 *     A1 manifest ↔ 磁盘双向 1:1：每条目的 db 文件必须在；盘上每个 `semantic/db.sqlite` 必须有条目；
 *        且 entry.path 的尾缀必须等于「键推出的规范路径」（库放错档 / 条目抄错行都会被点名）；
 *     A2 逐库重算：COUNT(chunks)==entry.chunks、COUNT(chunk_embeddings)==entry.embedded、
 *        COUNT(chunks_fts)==COUNT(chunks)、库内 meta.chunks/meta.embedded 与 manifest 三者一致；
 *     A2b 向量层缺口必须「按声明故意缺」：COUNT(chunk_embeddings)==库内 meta.embeddable
 *        （F99 修法：短块照旧进 chunks/chunks_fts，只有向量层按阈值不嵌 ⇒ 缺口必须可证明，
 *        整库退纯 FTS 仍只许躺在 DEBT_FTS_ONLY）；
 *     A3 entry.sha256 == 磁盘文件 sha256（库重建过但 manifest 没跟着写 = 过期台账，零容忍）；
 *     A4 命中可取回：`chunks.doc_id` 必须都能在 `docs` 找到（孤儿 chunk = 命中了但正文取不到）；
 *     A5 `embedded==0 && chunks>0` 与 `chunks==0` 两类降级只许逐条躺在存量台账里；
 *     A6 索引目录旁不得残留 `db.sqlite.tmp-*` / `*-journal`（半截事务文件会被下一次构建当旧库读）；
 *        残留只许登记在 `DEBT_RESIDUE`，本门**不删**（删除是数据拥有者的动作）；
 *     A7 每个 yarn-mappings.sqlite：meta.classCount / methodCount / fieldCount 必须等于表内实际行数，
 *        成员数按读侧口径「methods 有行用它，否则 searge_*」算（mcp-csv-era 全在 searge_*，
 *        forge-srg/tsrg 的 searge_* 又是另一批行 ⇒ 相加会虚高，只能二选一）；
 *        仍不符的只许逐条躺在 `DEBT_MAPPING_COUNT`（键 pack|kind|meta|实际），因为读侧 `methodCountOf`
 *        直接信 meta，虚报的覆盖数没有任何地方会发现；schemaVersion>=3 还必须有 idx_*_official 索引。
 *  B. 台账层（只跑真数据根）
 *     条目数、Σchunks、Σembedded、逐平台 {条目, chunks, embedded}、降级清单、残留清单、
 *     逐档 yarn 行数与「有 named 名」计数。**精确钉死**，多一条少一条都红。
 *
 * 台账同 G3：只能由本门 `MC_SKILL_INDEX_RELEDGER=1` 重算生成，禁止手改数字。
 * 修好一条台账条目必须显式清空它，否则「已不在实扫结果里」这条红会提醒你来收。
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

const TEST_ROOT = process.env.MC_SKILL_INDEX_TEST_ROOT;
const DATA_DIR = TEST_ROOT
  ? path.resolve(TEST_ROOT)
  : path.resolve(process.env.MC_SKILL_DATA || path.join(REPO_ROOT, "data"));
const LEDGER_MODE = !TEST_ROOT;
const MANIFEST = path.join(DATA_DIR, "semantic-index-manifest.json");

// ── 台账（只由本门 MC_SKILL_INDEX_RELEDGER=1 重算，禁止手改数字）────────────
// B 层汇总 + 逐平台 {条目, chunks, embedded}
// F99 修法后重算（MC_SKILL_INDEX_RELEDGER=1）：chunks 25634→34029 = 短块回到关键词层；
// embedded 保持长块数（25634→25630 的 -4 是 4 个「整页只有一块且低于阈值」的兜底块，改由关键词层覆盖）。
const LEDGER_SUM = {
  entries: 60, chunks: 34029, embedded: 25630,
  perPlatform: {
    "bedrock": { entries: 1, chunks: 308, embedded: 303 },
    "fabric": { entries: 27, chunks: 7935, embedded: 5898 },
    "forge": { entries: 10, chunks: 5856, embedded: 4429 },
    "liteloader": { entries: 3, chunks: 443, embedded: 363 },
    "modloader": { entries: 3, chunks: 6, embedded: 2 },
    "neoforge": { entries: 9, chunks: 18877, embedded: 14169 },
    "quilt": { entries: 6, chunks: 557, embedded: 437 },
    "rift": { entries: 1, chunks: 47, embedded: 29 },
  },
};
// A5 存量债务：有 chunks 但嵌入层为 0（语义检索静默退化成纯 FTS）
const DEBT_FTS_ONLY = [
  // F99 修法后的必然结果：整库唯一那块低于向量阈值 ⇒ 只有关键词层。
  // 阈值只管向量层是设计，登记在此是为了让「以后又多一个纯 FTS 库」必须被看见。
  "modloader|1.2.5|modloader-docs",
  "modloader|1.5.2|modloader-docs",
];
// A5 存量债务：整库空索引（该 source 在本仓库没有 processed/l0 正文）
const DEBT_EMPTY_INDEX = [
  "fabric|1.14.4|fabric-docs",
  "fabric|1.16.5|fabric-docs",
  "fabric|1.17.1|fabric-docs",
  "fabric|1.18.2|fabric-docs",
  "fabric|1.19.4|fabric-docs",
  "fabric|1.20.1|fabric-docs",
  "fabric|1.21.3|fabric-docs",
];
// A6 存量债务：索引目录里的半截事务残留（相对 data 根；删除动作交数据拥有者，本门只登记不删）
// 2026-09-13：三条 db.sqlite.old 不在盘上了 —— 本轮全量重建走「旧库改名成 .old → 新库顶上 →
// finally 清同名 .old」这条既定路径，等于被构建器收走；登记按实盘撤下，不是谁手工删的。
// 2026-09-15 全部清空（**不是手工清账，是实盘先变、台账跟账**）：10 个半截事务残留
// （5 个 git 跟踪的 `db.sqlite.tmp-<pid>` + 5 个未跟踪的 `-journal`）已由用户全部删除，
// 本门 drain check 逐条点名后按纪律处理 —— 「债务清单**清空而不删除**：留空数组 = 零容忍，复发才响亮」。
const DEBT_RESIDUE = [];
// A7 存量债务：yarn 库 meta 计数 ≠ 表内实际行数（键 pack|kind|meta|实际；读侧直接信 meta ⇒ 覆盖数虚报）
const DEBT_MAPPING_COUNT = [
  "fabric_1.19.4|methodCount|39820|36036",
  "fabric_1.20.1|methodCount|40911|36992",
  "fabric_1.20.4|methodCount|43440|39370",
  "forge_1.13.2|fieldCount|14542|14536",
  "forge_1.13.2|methodCount|26093|26024",
];
// B 层：逐档 yarn-mappings.sqlite 实际行数 + official（mojmap）覆盖行数 + schemaVersion
// 2026-09-19 重算（MC_SKILL_INDEX_RELEDGER=1）：N-11.2 v2 named 修复落库后 unresolved 大幅回落
// （fields 全 13 档 ↓，methods 10 档 ↓，1.14.4/1.16.5/1.17.1 的 methods 本就无 v1 有损）；其余键逐字未变。
const LEDGER_YARN = {
  "fabric_1.14.4": { classes: 4976, classesNamed: 4891, unresolvedMethods: 8154, unresolvedFields: 2544, methods: 21982, fields: 18196, seargeMethods: 0, seargeFields: 0, classesOfficial: 4976, officialMethods: 21982, officialFields: 18196, schema: 4 },
  "fabric_1.16.5": { classes: 5445, classesNamed: 5430, unresolvedMethods: 9495, unresolvedFields: 1557, methods: 27094, fields: 21480, seargeMethods: 0, seargeFields: 0, classesOfficial: 5445, officialMethods: 27094, officialFields: 21480, schema: 4 },
  "fabric_1.17.1": { classes: 6107, classesNamed: 6092, unresolvedMethods: 7195, unresolvedFields: 2997, methods: 28016, fields: 27553, seargeMethods: 0, seargeFields: 0, classesOfficial: 6107, officialMethods: 28016, officialFields: 27553, schema: 4 },
  "fabric_1.18.2": { classes: 6391, classesNamed: 6374, unresolvedMethods: 7590, unresolvedFields: 2986, methods: 29716, fields: 28654, seargeMethods: 0, seargeFields: 0, classesOfficial: 6391, officialMethods: 29716, officialFields: 28654, schema: 4 },
  "fabric_1.19.4": { classes: 7326, classesNamed: 7305, unresolvedMethods: 10365, unresolvedFields: 3127, methods: 36036, fields: 32454, seargeMethods: 0, seargeFields: 0, classesOfficial: 7326, officialMethods: 36036, officialFields: 32454, schema: 4 },
  "fabric_1.20.1": { classes: 7431, classesNamed: 7411, unresolvedMethods: 10833, unresolvedFields: 2963, methods: 36992, fields: 32923, seargeMethods: 0, seargeFields: 0, classesOfficial: 7431, officialMethods: 36992, officialFields: 32923, schema: 4 },
  "fabric_1.20.4": { classes: 7782, classesNamed: 7762, unresolvedMethods: 11854, unresolvedFields: 3104, methods: 39370, fields: 35024, seargeMethods: 0, seargeFields: 0, classesOfficial: 7782, officialMethods: 39370, officialFields: 35024, schema: 4 },
  "fabric_1.21.10": { classes: 9953, classesNamed: 9907, unresolvedMethods: 13375, unresolvedFields: 3575, methods: 48591, fields: 44095, seargeMethods: 0, seargeFields: 0, classesOfficial: 9953, officialMethods: 48591, officialFields: 44095, schema: 4 },
  "fabric_1.21.11": { classes: 10274, classesNamed: 10227, unresolvedMethods: 13623, unresolvedFields: 3745, methods: 49730, fields: 45248, seargeMethods: 0, seargeFields: 0, classesOfficial: 10274, officialMethods: 49730, officialFields: 45248, schema: 4 },
  "fabric_1.21.1": { classes: 8262, classesNamed: 8243, unresolvedMethods: 11324, unresolvedFields: 3176, methods: 41282, fields: 37682, seargeMethods: 0, seargeFields: 0, classesOfficial: 8262, officialMethods: 41282, officialFields: 37682, schema: 4 },
  "fabric_1.21.3": { classes: 8719, classesNamed: 8700, unresolvedMethods: 12360, unresolvedFields: 3365, methods: 43811, fields: 39464, seargeMethods: 0, seargeFields: 0, classesOfficial: 8719, officialMethods: 43811, officialFields: 39464, schema: 4 },
  "fabric_1.21.4": { classes: 8850, classesNamed: 8829, unresolvedMethods: 12466, unresolvedFields: 3391, methods: 44336, fields: 39883, seargeMethods: 0, seargeFields: 0, classesOfficial: 8850, officialMethods: 44336, officialFields: 39883, schema: 4 },
  "fabric_1.21.8": { classes: 9469, classesNamed: 9423, unresolvedMethods: 12964, unresolvedFields: 3529, methods: 46592, fields: 42418, seargeMethods: 0, seargeFields: 0, classesOfficial: 9469, officialMethods: 46592, officialFields: 42418, schema: 4 },
  "forge_1.10.2": { classes: 2949, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 18571, fields: 10813, seargeMethods: 0, seargeFields: 0, classesOfficial: 2949, officialMethods: 18571, officialFields: 10813, schema: 4 },
  "forge_1.11.2": { classes: 3091, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 19334, fields: 11076, seargeMethods: 0, seargeFields: 0, classesOfficial: 3091, officialMethods: 19334, officialFields: 11076, schema: 4 },
  "forge_1.12.2": { classes: 3313, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 20817, fields: 11915, seargeMethods: 9654, seargeFields: 10005, classesOfficial: 3313, officialMethods: 20817, officialFields: 11915, schema: 4 },
  "forge_1.13.2": { classes: 3993, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 26024, fields: 14536, seargeMethods: 10770, seargeFields: 11816, classesOfficial: 3993, officialMethods: 26024, officialFields: 14536, schema: 4 },
  "forge_1.14.4": { classes: 0, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 0, fields: 0, seargeMethods: 11445, seargeFields: 15133, classesOfficial: 0, officialMethods: 0, officialFields: 0, schema: 4 },
  "forge_1.15.2": { classes: 0, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 0, fields: 0, seargeMethods: 10598, seargeFields: 15756, classesOfficial: 0, officialMethods: 0, officialFields: 0, schema: 4 },
  "forge_1.7.10": { classes: 1815, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 13263, fields: 6900, seargeMethods: 0, seargeFields: 0, classesOfficial: 1815, officialMethods: 13263, officialFields: 6900, schema: 4 },
  "forge_1.8.9": { classes: 2507, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 16426, fields: 8917, seargeMethods: 0, seargeFields: 0, classesOfficial: 2507, officialMethods: 16426, officialFields: 8917, schema: 4 },
  "forge_1.9.4": { classes: 2908, classesNamed: 0, unresolvedMethods: 0, unresolvedFields: 0, methods: 18228, fields: 10634, seargeMethods: 0, seargeFields: 0, classesOfficial: 2908, officialMethods: 18228, officialFields: 10634, schema: 4 },
};

const failures = [];
const fail = (msg) => failures.push(msg);
const relData = (p) => path.relative(DATA_DIR, p).split(path.sep).join("/");
const keyOf = (e) => `${e.platform}|${e.version}|${e.source}`;
const sha256File = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
/** 与运行时 semanticDbPath 同一条公式：键 ⇒ 相对 data 根的规范路径（别信 manifest 里的构建机绝对路径）。 */
const expectedRelOf = (e) => `${e.platform}_${e.version}/${e.source}/${e.version}/semantic/db.sqlite`;
const entryAbsPath = (e) => path.join(DATA_DIR, expectedRelOf(e));
const countOf = (db, table) => {
  try {
    return Number(db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get()?.n ?? 0);
  } catch {
    return -1;
  }
};

if (!fs.existsSync(MANIFEST)) {
  console.error(`assert-index-consistency: 缺 manifest ${MANIFEST}`);
  process.exit(1);
}
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
} catch (e) {
  console.error(`assert-index-consistency: manifest 解析失败 ${e?.message ?? e}`);
  process.exit(1);
}
const entries = Array.isArray(manifest.entries) ? manifest.entries : [];

/** 磁盘上所有 `semantic/db.sqlite` 与其半截残留。 */
function scanIndexTree(dir, out = { dbs: [], residue: [] }) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "mappings" || e.name === "_models") continue;
      scanIndexTree(abs, out);
    } else if (e.name === "db.sqlite") out.dbs.push(abs);
    else if (e.name.startsWith("db.sqlite.")) out.residue.push(abs);
  }
  return out;
}
const disk = scanIndexTree(DATA_DIR);

const stat = {
  keys: new Set(),
  sum: { chunks: 0, embedded: 0 },
  perPlatform: {},
  ftsOnly: [],
  empty: [],
  yarn: {},
  mappingDebt: [],
};

for (const e of entries) {
  const key = keyOf(e);
  if (stat.keys.has(key)) fail(`manifest 条目重复 ${key}`);
  stat.keys.add(key);
  // A1b path 与键自洽（键决定规范路径；path 只是构建机记号，指错档说明条目被挪过/抄错行）
  const posixPath = String(e.path ?? "").replace(/\\/g, "/");
  if (!posixPath.endsWith(expectedRelOf(e))) {
    fail(`${key}: manifest.path「${e.path}」尾缀不等于规范路径 ${expectedRelOf(e)} ⇒ 库放错档或条目抄错`);
  }
  const abs = entryAbsPath(e);
  // A1 条目 → 磁盘
  if (!fs.existsSync(abs)) {
    fail(`${key}: manifest 指向的库不存在（${relData(abs)}）⇒ 语义检索静默 0 命中`);
    continue;
  }
  // A3 sha256 对账
  if (typeof e.sha256 === "string" && sha256File(abs) !== e.sha256) {
    fail(`${key}: 库文件 sha256 ≠ manifest.sha256 ⇒ 库重建过但台账没跟着写（audit 只打 WARN，这里算红）`);
  }
  const db = new DatabaseSync(abs, { readOnly: true });
  let chunks = 0, emb = 0, fts = 0, docs = 0, orphan = 0;
  const meta = {};
  try {
    chunks = countOf(db, "chunks");
    emb = countOf(db, "chunk_embeddings");
    fts = countOf(db, "chunks_fts");
    docs = countOf(db, "docs");
    try {
      for (const r of db.prepare("SELECT key, value FROM meta").all()) meta[r.key] = r.value;
    } catch {
      fail(`${key}: 没有 meta 表 ⇒ 构建器无法回写台账`);
    }
    try {
      orphan = Number(
        db
          .prepare("SELECT COUNT(*) AS n FROM chunks c LEFT JOIN docs d ON c.doc_id = d.doc_id WHERE d.doc_id IS NULL")
          .get()?.n ?? 0,
      );
    } catch {
      /* 表缺失在下面的半截库分支报 */
    }
  } finally {
    db.close();
  }
  if (chunks < 0 || emb < 0 || fts < 0 || docs < 0) {
    fail(`${key}: 表缺失（chunks=${chunks} emb=${emb} fts=${fts} docs=${docs}）⇒ 半截库`);
    continue;
  }
  // A2 三方对账
  if (chunks !== Number(e.chunks)) fail(`${key}: manifest.chunks ${e.chunks} ≠ 库内 COUNT(chunks) ${chunks}`);
  if (emb !== Number(e.embedded)) fail(`${key}: manifest.embedded ${e.embedded} ≠ 库内 COUNT(chunk_embeddings) ${emb}`);
  if (fts !== chunks) fail(`${key}: chunks_fts ${fts} ≠ chunks ${chunks} ⇒ 全文层与向量层不同源`);
  if (meta.chunks !== undefined && Number(meta.chunks) !== chunks) {
    fail(`${key}: 库内 meta.chunks ${meta.chunks} ≠ COUNT(chunks) ${chunks}`);
  }
  if (meta.embedded !== undefined && Number(meta.embedded) !== emb) {
    fail(`${key}: 库内 meta.embedded ${meta.embedded} ≠ COUNT(chunk_embeddings) ${emb}`);
  }
  // A2b 向量层缺口必须「按声明故意缺」（F99：短块只退向量层，不退关键词层）
  if (chunks > 0 && meta.embeddable === undefined) {
    fail(`${key}: 库内没有 meta.embeddable ⇒ 无法证明向量层的缺口都是故意的（短块按阈值不嵌）`);
  } else if (chunks > 0 && emb !== Number(meta.embeddable) && !DEBT_FTS_ONLY.includes(key)) {
    fail(
      `${key}: COUNT(chunk_embeddings) ${emb} ≠ 构建器声明的应嵌数 ${meta.embeddable}（全量块 ${chunks}）` +
        `⇒ 有长块没拿到向量，或短块混进了向量层`,
    );
  }
  // A4 命中可取回
  if (orphan > 0) fail(`${key}: ${orphan} 个孤儿 chunk（doc_id 在 docs 里不存在）⇒ 命中了但 get_doc_full 取不到正文`);

  // A5 降级台账
  if (chunks === 0) {
    stat.empty.push(key);
    if (!DEBT_EMPTY_INDEX.includes(key)) fail(`${key}: 空索引且不在台账 ⇒ 这一档的语义检索永远 0 命中`);
  } else if (emb === 0) {
    stat.ftsOnly.push(key);
    if (!DEBT_FTS_ONLY.includes(key)) fail(`${key}: chunks=${chunks} 但嵌入层为 0 且不在台账 ⇒ 静默退化纯 FTS`);
  }
  stat.sum.chunks += chunks;
  stat.sum.embedded += emb;
  const per = (stat.perPlatform[e.platform] ??= { entries: 0, chunks: 0, embedded: 0 });
  per.entries++;
  per.chunks += chunks;
  per.embedded += emb;
}

// A1 磁盘 → manifest
for (const abs of disk.dbs) {
  const posix = relData(abs);
  const m = /^([^/]+)\/([^/]+)\/([^/]+)\/semantic\/db\.sqlite$/.exec(posix);
  if (!m) {
    fail(`${posix}: 路径形态不是 <platform>_<version>/<source>/<version>/semantic/db.sqlite ⇒ 定位不到台账键`);
    continue;
  }
  const [, pack, source, versionDir] = m;
  const cut = pack.lastIndexOf("_");
  const platform = cut === -1 ? pack : pack.slice(0, cut);
  const version = cut === -1 ? "" : pack.slice(cut + 1);
  if (version !== versionDir) {
    fail(`${posix}: 档目录版本 ${version} ≠ 索引层版本 ${versionDir} ⇒ 库放错档`);
  }
  const key = `${platform}|${version}|${source}`;
  if (!stat.keys.has(key)) fail(`磁盘有库 ${posix} 但 manifest 没有条目（键 ${key}）⇒ 建了索引却没登记`);
}

// A6 残留
for (const abs of disk.residue) {
  const rel = relData(abs);
  if (!DEBT_RESIDUE.includes(rel)) {
    fail(`索引目录残留 ${rel} ⇒ 半截事务文件会被下一次构建当旧库读；不在台账内`);
  }
}

// A7 yarn-mappings.sqlite
const yarnFiles = [];
(function walkYarn(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) {
      if (e.name === "yarn-mappings.sqlite") yarnFiles.push(path.join(dir, e.name));
      continue;
    }
    if (e.name === "semantic" || e.name === "_models") continue;
    walkYarn(path.join(dir, e.name));
  }
})(DATA_DIR);
for (const abs of yarnFiles.sort()) {
  const pack = relData(abs).split("/")[0];
  const db = new DatabaseSync(abs, { readOnly: true });
  const meta = {};
  try {
    for (const r of db.prepare("SELECT key, value FROM meta").all()) meta[r.key] = r.value;
  } catch {
    fail(`${pack}: yarn 库没有 meta 表`);
  }
  // A7-b 机器无关（2026-09-14）：yarn 库是 tracked 二进制，meta 里出现本机绝对路径 = 把盘符钉进仓库历史。
  //      现存教训：22 个库的 meta.source 曾分裂在 `H:\MC_skill\…`（19 个）与 OneDrive 桌面路径（3 个）之间。
  const dirtyKeys = Object.entries(meta)
    .filter(([, v]) => /\b[A-Za-z]:[\\/]/.test(String(v)) || String(v).includes("/home/") || String(v).includes("/Users/"))
    .map(([k]) => k);
  if (dirtyKeys.length) {
    fail(`${pack}: yarn meta 含本机绝对路径（键 ${dirtyKeys.join(", ")}）⇒ tracked 二进制不许钉盘符，重跑生产者 build-yarn-sqlite.mjs --all --write`);
  }
  if (meta.source && (meta.source.includes("\\") || /^[A-Za-z]:/.test(meta.source))) {
    fail(`${pack}: meta.source=${meta.source} 不是仓库相对 POSIX 形态 ⇒ 生产者 setMeta 的机器无关化被绕开`);
  }
  if (!/^[0-9a-f]{64}$/.test(String(meta.sourceSha256 ?? ""))) {
    fail(`${pack}: 缺 sourceSha256（64 位十六进制）⇒ 相对路径只剩文件名，来源字节无从核对`);
  }
  const classes = countOf(db, "classes");
  const methods = countOf(db, "methods");
  const fields = countOf(db, "fields");
  const cnt = (t, col) => {
    try {
      return Number(
        db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE ${col} IS NOT NULL AND ${col} <> ''`).get()?.n ?? 0,
      );
    } catch {
      return -1;
    }
  };
  const unresolved = (t) => {
    try {
      return Number(
        db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE name_named = name_intermediary`).get()?.n ?? 0,
      );
    } catch {
      return -1;
    }
  };
  const classesNamed = (() => {
    try {
      const n = Number(db.prepare("SELECT COUNT(*) AS n FROM classes WHERE named = intermediary").get()?.n ?? 0);
      return classes - n;
    } catch {
      return -1;
    }
  })();
  const unresolvedMethods = unresolved("methods");
  const unresolvedFields = unresolved("fields");
  const classesOfficial = cnt("classes", "official");
  const namedMethods = cnt("methods", "name_named");
  const namedFields = cnt("fields", "name_named");
  const officialMethods = cnt("methods", "name_official");
  const officialFields = cnt("fields", "name_official");
  const idx = new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all().map((r) => r.name));
  // 读侧 methodCountOf 的口径：meta 优先 → methods 表有行就用它 → 否则 searge_*。
  // mcp-csv-era（forge_1.14.4）methods 空、成员全在 searge_*；forge-srg/tsrg 则 searge_* 是**另一批**行，
  // 相加会虚高（实测 forge_1.12.2 methods 20817 + searge 9654 = 30471 ≠ meta 20817）⇒ 只能二选一。
  const seargeMethods = countOf(db, "searge_methods");
  const seargeFields = countOf(db, "searge_fields");
  db.close();
  const pos = (n) => (n > 0 ? n : 0);
  const effM = pos(methods) > 0 ? pos(methods) : pos(seargeMethods);
  const effF = pos(fields) > 0 ? pos(fields) : pos(seargeFields);
  const trio = (kind, want, got, where) => {
    if (want === undefined || Number(want) === got) return;
    const key = `${pack}|${kind}|${want}|${got}`;
    stat.mappingDebt.push(key);
    if (!DEBT_MAPPING_COUNT.includes(key)) {
      fail(`${pack}: meta.${kind} ${want} ≠ ${where} 实际 ${got} ⇒ 覆盖数虚报（读侧直接信 meta）；不在存量台账`);
    }
  };
  trio("classCount", meta.classCount, pos(classes), "classes");
  trio("methodCount", meta.methodCount, effM, pos(methods) > 0 ? "methods" : "searge_methods");
  trio("fieldCount", meta.fieldCount, effF, pos(fields) > 0 ? "fields" : "searge_fields");
  if (Number(meta.schemaVersion ?? 0) >= 3) {
    for (const want of ["idx_methods_official", "idx_fields_official"]) {
      if (!idx.has(want)) fail(`${pack}: schema v${meta.schemaVersion} 却缺索引 ${want} ⇒ convert_mapping 反查只能吐 intermediary`);
    }
  }
  stat.yarn[pack] = {
    classes,
    classesNamed,
    unresolvedMethods,
    unresolvedFields,
    methods,
    fields,
    seargeMethods: pos(seargeMethods),
    seargeFields: pos(seargeFields),
    namedMethods,
    namedFields,
    classesOfficial,
    officialMethods,
    officialFields,
    schema: Number(meta.schemaVersion ?? 0),
  };
}

if (process.env.MC_SKILL_INDEX_RELEDGER) {
  console.log(
    JSON.stringify(
      {
        LEDGER_SUM: {
          entries: entries.length,
          chunks: stat.sum.chunks,
          embedded: stat.sum.embedded,
          perPlatform: stat.perPlatform,
        },
        DEBT_FTS_ONLY: stat.ftsOnly,
        DEBT_EMPTY_INDEX: stat.empty,
        DEBT_RESIDUE: disk.residue.map((p) => relData(p)).sort(),
        DEBT_MAPPING_COUNT: [...new Set(stat.mappingDebt)].sort(),
        LEDGER_YARN: stat.yarn,
      },
      null,
      1,
    ),
  );
  process.exit(0);
}

if (LEDGER_MODE) {
  const eq = (label, want, got) => {
    if (want !== got) fail(`${label}: 台账 ${want} ≠ 实扫 ${got}`);
  };
  eq("manifest 条目数", LEDGER_SUM.entries, entries.length);
  eq("Σchunks", LEDGER_SUM.chunks, stat.sum.chunks);
  eq("Σembedded", LEDGER_SUM.embedded, stat.sum.embedded);
  for (const [p, want] of Object.entries(LEDGER_SUM.perPlatform)) {
    const got = stat.perPlatform[p];
    if (!got) {
      fail(`平台 ${p} 在台账里但实扫没有 ⇒ 整档语料被摘掉`);
      continue;
    }
    eq(`${p} 条目`, want.entries, got.entries);
    eq(`${p} chunks`, want.chunks, got.chunks);
    eq(`${p} embedded`, want.embedded, got.embedded);
  }
  for (const p of Object.keys(stat.perPlatform)) {
    if (!LEDGER_SUM.perPlatform[p]) fail(`实扫出现未登记平台 ${p} ⇒ 新增建档面，先核来源再登记`);
  }
  for (const k of DEBT_FTS_ONLY) if (!stat.ftsOnly.includes(k)) fail(`降级台账 ${k} 已不在实扫里 ⇒ 嵌入补上了是好事，显式清台账（S5/S21）`);
  for (const k of DEBT_EMPTY_INDEX) if (!stat.empty.includes(k)) fail(`空索引台账 ${k} 已不在实扫里 ⇒ 正文补上了是好事，显式清台账`);
  for (const r of DEBT_RESIDUE) {
    if (!disk.residue.map((p) => relData(p)).includes(r)) fail(`残留台账 ${r} 已不在盘上 ⇒ 清掉了就显式删掉这条登记`);
  }
  for (const [pack, want] of Object.entries(LEDGER_YARN)) {
    const got = stat.yarn[pack];
    if (!got) {
      fail(`yarn 库 ${pack} 在台账里但盘上没有 ⇒ convert_mapping 本版直接降级`);
      continue;
    }
    eq(`${pack} classes`, want.classes, got.classes);
    eq(`${pack} methods`, want.methods, got.methods);
    eq(`${pack} fields`, want.fields, got.fields);
    eq(`${pack} seargeMethods`, want.seargeMethods, got.seargeMethods);
    eq(`${pack} seargeFields`, want.seargeFields, got.seargeFields);
    eq(`${pack} classes(official)`, want.classesOfficial, got.classesOfficial);
    eq(`${pack} methods(official)`, want.officialMethods, got.officialMethods);
    eq(`${pack} fields(official)`, want.officialFields, got.officialFields);
    eq(`${pack} schemaVersion`, want.schema, got.schema);
    eq(`${pack} 未具名 fields`, want.unresolvedFields, got.unresolvedFields);
    eq(`${pack} 未具名 methods`, want.unresolvedMethods, got.unresolvedMethods);
    eq(`${pack} classes(named)`, want.classesNamed, got.classesNamed);
  }
  for (const pack of Object.keys(stat.yarn)) {
    if (!LEDGER_YARN[pack]) fail(`实扫出现未登记 yarn 库 ${pack} ⇒ 先确认是谁建的再登记`);
  }
  const debtSeen = [...new Set(stat.mappingDebt)];
  for (const k of DEBT_MAPPING_COUNT) {
    if (!debtSeen.includes(k)) fail(`计数台账条目 ${k} 已不在实扫里 ⇒ 计数改对了是好事，显式清这条（S22/映射重建）`);
  }
}

if (failures.length) {
  for (const f of failures.slice(0, 25)) console.error(`✗ ${f}`);
  if (failures.length > 25) console.error(`✗ …（另有 ${failures.length - 25} 条，同上）`);
  if (LEDGER_MODE) {
    console.error("（台账漂移：跑 `MC_SKILL_INDEX_RELEDGER=1 node scripts/assert-index-consistency.mjs` 重算，别手改数字）");
  }
  console.error(`assert-index-consistency(G4): ${failures.length} 项不达标`);
  process.exit(1);
}

console.log(
  `  assert-index-consistency(G4): ${entries.length} 库 · Σchunks ${stat.sum.chunks} · Σembedded ${stat.sum.embedded} · ` +
    `sha256 全对账 · 孤儿 chunk 0 · 降级 ${stat.ftsOnly.length} 纯FTS + ${stat.empty.length} 空库（全在存量台账） · ` +
    `残留 ${disk.residue.length}（台账登记，门不删） · yarn ${Object.keys(stat.yarn).length} 档 · ` +
    `meta≠实际计数 ${[...new Set(stat.mappingDebt)].length} 条（全在存量台账，S22 映射重建时清空）` +
    (LEDGER_MODE ? " · 台账层已跑" : " · 内容层（假根）"),
);
