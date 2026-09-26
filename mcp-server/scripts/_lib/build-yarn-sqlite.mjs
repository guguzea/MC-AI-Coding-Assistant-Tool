/**
 * Build per-version yarn-mappings.sqlite (schema v4) from Tiny / TSRG / SRG / CSV.
 *
 * schema v3 adds `fields` + `searge_fields` (v2 class/method tables unchanged).
 * schema v4 adds single-column name_official / name_intermediary indexes
 * (lookupByObfuscated UNION queries; runtime is readOnly and must not CREATE INDEX).
 * Runtime MUST NOT load yarn-mappings.json; only the sqlite artefact is queried.
 *
 * Usage（默认 dry-run，只打印 DRYRUN；--write 才真正产出）:
 *   node scripts/_lib/build-yarn-sqlite.mjs <mappingsDir> [--version=1.20.1] [--write]
 *   node scripts/_lib/build-yarn-sqlite.mjs --all [--write]
 * 文本报告走 write-guard emit；二进制 sqlite 仍走 replaceSqliteAtomically
 * （rename/.bak 重试，见 DEBT 在册理由）。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { GUARD_ROOT, emit, logDryRunBanner, wantWrite } from "../../../scripts/_lib/write-guard.mjs";
import { parseTiny, findTinyPath } from "./parse-tiny.mjs";
import { importTsrgStream } from "./import-tsrg.mjs";
import { importForgeSrgStream } from "./import-forge-srg.mjs";
import { importMcpCsvMethods, importMcpCsvFields } from "./import-mcp-csv.mjs";
import { importSrgToOfficialStream } from "./import-srg-to-official.mjs";

const SCHEMA_VERSION = "4";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 本文件位于 <repo>/mcp-server/scripts/_lib ⇒ 三级上即仓库根。刻意不复用 GUARD_ROOT，
// 免得这个不变量跟着 write-guard 那次改动一起漂。
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

/**
 * meta 里这四个键是「只写不读」的来源台账（运行时只读 mappingEra / schemaVersion / *Count），
 * 但 .sqlite 是 tracked 二进制 ⇒ 绝对路径会把本机盘符钉进仓库历史（现存 22 个映射库正因如此
 * 分裂成 19 个 `H:\MC_skill\…` + 3 个 OneDrive 桌面路径）。一律折成仓库相对 POSIX，
 * 仓库外的源（夹具 / 用户自备 jar 目录）退化成 basename，绝不落盘符。
 */
const META_PATH_KEYS = new Set(["source", "sourceFile", "seargeCsv", "seargeFieldsCsv", "fellBackTo"]);

/** 值为 JSON 序列化、内部还嵌着 `source` 路径的键（抓取失败回退台账 `buildAttempts`）。 */
const META_PATH_JSON_KEYS = new Set(["buildAttempts"]);

function repoRelativePosix(p) {
  const abs = path.resolve(String(p));
  const rel = path.relative(REPO_ROOT, abs);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return path.basename(abs);
  return rel.split(path.sep).join("/");
}

/**
 * 错误文本没法「折成相对路径」（它不是路径），但里面常整段嵌着仓库绝对路径（ENOENT 之类）。
 * 把仓库根的三种文本形态（`\` / `/` / JSON 转义的 `\\`）换成 `<repo>/` 占位，机器信息即归零。
 */
function stripRepoRoot(text) {
  let s = String(text);
  for (const form of [
    REPO_ROOT.split(path.sep).join("\\"),
    REPO_ROOT.split(path.sep).join("/"),
    REPO_ROOT.split(path.sep).join("\\\\"),
  ]) {
    s = s.split(form).join("<repo>");
  }
  return s;
}

/** JSON 台账里的 `source` 字段同样不许带盘符；解析不了就原样留（清洗不许吞台账）。 */
function neutralizeJsonPaths(s) {
  try {
    const parsed = JSON.parse(s);
    const walkOne = (row) => {
      if (!row || typeof row !== "object") return row;
      const next = { ...row };
      if (typeof next.source === "string") next.source = repoRelativePosix(next.source);
      if (typeof next.error === "string") next.error = stripRepoRoot(next.error);
      return next;
    };
    if (Array.isArray(parsed)) return JSON.stringify(parsed.map(walkOne));
    if (parsed && typeof parsed === "object") return JSON.stringify(walkOne(parsed));
    return s;
  } catch {
    return s;
  }
}

/** 路径折相对后就只剩文件名可辨 ⇒ 用内容哈希保住「这个库出自哪一份字节」。 */
function sha256FileSync(absPath) {
  const fd = fs.openSync(absPath, "r");
  const hash = createHash("sha256");
  const buf = Buffer.alloc(1 << 20);
  try {
    let n;
    while ((n = fs.readSync(fd, buf, 0, buf.length, null)) > 0) hash.update(buf.subarray(0, n));
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest("hex");
}

export function openYarnDb(dbPath, { readonly = false } = {}) {
  return new DatabaseSync(dbPath, { readOnly: readonly });
}

export function initYarnSchema(db) {
  db.exec(`
    PRAGMA journal_mode = OFF;
    PRAGMA synchronous = OFF;
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS classes (
      named TEXT PRIMARY KEY,
      intermediary TEXT NOT NULL,
      official TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_classes_intermediary ON classes(intermediary);
    DROP INDEX IF EXISTS idx_classes_official;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_classes_official ON classes(official) WHERE official IS NOT NULL;

    CREATE TABLE IF NOT EXISTS methods (
      owner_named TEXT NOT NULL,
      name_named TEXT NOT NULL,
      descriptor_named TEXT NOT NULL DEFAULT '',
      name_official TEXT NOT NULL,
      descriptor_official TEXT NOT NULL DEFAULT '',
      name_intermediary TEXT,
      PRIMARY KEY (owner_named, name_named, descriptor_named)
    );
    CREATE INDEX IF NOT EXISTS idx_methods_official
      ON methods(owner_named, name_official, descriptor_official);
    CREATE INDEX IF NOT EXISTS idx_methods_named
      ON methods(owner_named, name_named);
    CREATE INDEX IF NOT EXISTS idx_methods_name_official ON methods(name_official);
    CREATE INDEX IF NOT EXISTS idx_methods_name_intermediary ON methods(name_intermediary);

    CREATE TABLE IF NOT EXISTS fields (
      owner_named TEXT NOT NULL,
      name_named TEXT NOT NULL,
      descriptor_named TEXT NOT NULL DEFAULT '',
      name_official TEXT NOT NULL,
      descriptor_official TEXT NOT NULL DEFAULT '',
      name_intermediary TEXT,
      PRIMARY KEY (owner_named, name_named, descriptor_named)
    );
    CREATE INDEX IF NOT EXISTS idx_fields_official
      ON fields(owner_named, name_official, descriptor_official);
    CREATE INDEX IF NOT EXISTS idx_fields_named
      ON fields(owner_named, name_named);
    CREATE INDEX IF NOT EXISTS idx_fields_name_official ON fields(name_official);
    CREATE INDEX IF NOT EXISTS idx_fields_name_intermediary ON fields(name_intermediary);

    CREATE TABLE IF NOT EXISTS searge_methods (
      searge TEXT PRIMARY KEY,
      name_named TEXT NOT NULL,
      descriptor_named TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_searge_methods_name ON searge_methods(name_named);

    CREATE TABLE IF NOT EXISTS searge_fields (
      searge TEXT PRIMARY KEY,
      name_named TEXT NOT NULL,
      descriptor_named TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_searge_fields_name ON searge_fields(name_named);
  `);
}

function setMeta(db, entries) {
  const out = {};
  for (const [k, v] of Object.entries(entries)) {
    if (v == null) {
      out[k] = "";
      continue;
    }
    const s = String(v);
    if (META_PATH_KEYS.has(k)) {
      out[k] = repoRelativePosix(s);
      continue;
    }
    if (META_PATH_JSON_KEYS.has(k)) {
      out[k] = neutralizeJsonPaths(s);
      continue;
    }
    out[k] = s;
  }
  // 来源身份 = 可移植相对路径 + 内容哈希。源取不到（流式夹具）就不写这个键，不写空串冒充哈希。
  if (entries.source != null && out.sourceSha256 === undefined) {
    try {
      const abs = path.resolve(String(entries.source));
      if (fs.existsSync(abs)) out.sourceSha256 = sha256FileSync(abs);
    } catch {
      /* 同上：宁可少一个键 */
    }
  }
  const stmt = db.prepare("INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(out)) stmt.run(k, v);
}

function clearMappingTables(db) {
  db.exec(`
    DELETE FROM methods;
    DELETE FROM fields;
    DELETE FROM searge_methods;
    DELETE FROM searge_fields;
    DELETE FROM classes;
    DELETE FROM meta;
  `);
}

/** Import Tiny via shared parse-tiny (writes classes + methods). */
export async function importTinyIntoDb(db, tinyPath, meta = {}, { strict = false } = {}) {
  initYarnSchema(db);
  clearMappingTables(db);
  const parsed = await parseTiny(tinyPath, { strict });
  const insertClass = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );
  const insertMethod = db.prepare(
    `INSERT OR REPLACE INTO methods(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const insertField = db.prepare(
    `INSERT OR REPLACE INTO fields(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );

  db.exec("BEGIN");
  for (const c of parsed.classes) {
    if (!c.named) continue;
    insertClass.run(c.named, c.intermediary || "", c.official || "");
  }
  for (const m of parsed.methods) {
    if (!m.ownerNamed || !m.nameNamed) continue;
    // `<init>` / `<clinit>` are deliberately NOT stored. Yarn tiny for 1.19.4 / 1.20.1 /
    // 1.20.4 carries 3,784 / 3,919 / 4,070 METHOD lines whose named column is literally
    // `<init>` (other versions carry none), so `methods` rows < meta.methodCount by exactly
    // that amount — that is the designed shape, not data loss. The tolerance-0 gate models
    // this same rule in build-yarn-mappings.mjs#isSkippedBySqliteBuilder; the two MUST move
    // together (measured: storing the ctor rows makes verify go red on
    // `census methods.inserted: json/tiny=36036 sqlite=39820`).
    // meta.*Count = source line counts; meta.stored*Count below = actual table rows.
    if (m.nameNamed.startsWith("<")) continue;
    insertMethod.run(
      m.ownerNamed,
      m.nameNamed,
      m.descriptorNamed || "",
      m.nameOfficial || "",
      m.descriptorOfficial || "",
      m.nameIntermediary || null,
    );
  }
  for (const f of parsed.fields) {
    if (!f.ownerNamed || !f.nameNamed) continue;
    insertField.run(
      f.ownerNamed,
      f.nameNamed,
      f.descriptorNamed || "",
      f.nameOfficial || "",
      f.descriptorOfficial || "",
      f.nameIntermediary || null,
    );
  }
  // COUNT(*) — not the loop counter — so PK collapses can never hide behind meta again.
  const storedClassCount = db.prepare("SELECT COUNT(*) AS c FROM classes").get().c;
  const storedMethodCount = db.prepare("SELECT COUNT(*) AS c FROM methods").get().c;
  const storedFieldCount = db.prepare("SELECT COUNT(*) AS c FROM fields").get().c;
  setMeta(db, {
    schemaVersion: SCHEMA_VERSION,
    version: meta.version ?? "",
    format: "yarn-tiny-v1",
    mappingEra: "yarn-tiny",
    source: meta.source ?? tinyPath,
    sourceFile: meta.source ?? tinyPath,
    builtAt: new Date().toISOString(),
    // *Count = source line counts (what the tiny carried, including `<init>` lines).
    // stored*Count = rows actually in the table. Kept separate on purpose; a gap
    // between the two now only means malformed/empty-named lines were skipped.
    classCount: String(parsed.classes.length),
    methodCount: String(parsed.methods.length),
    fieldCount: String(parsed.fields.length),
    storedClassCount: String(storedClassCount),
    storedMethodCount: String(storedMethodCount),
    storedFieldCount: String(storedFieldCount),
    buildWarnings: JSON.stringify(parsed.warnings ?? []),
  });
  db.exec("COMMIT");
  return {
    classCount: parsed.classes.length,
    methodCount: parsed.methods.length,
    fieldCount: parsed.fields.length,
    mappingEra: "yarn-tiny",
    warnings: parsed.warnings,
    parsed,
  };
}

/** @deprecated Prefer importTinyIntoDb; kept for stream-based unit tests. */
export async function importTinyStream(db, input, meta = {}) {
  const { parseTinyStream } = await import("./parse-tiny.mjs");
  initYarnSchema(db);
  clearMappingTables(db);
  const parsed = await parseTinyStream(input, { strict: false });
  const insertClass = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );
  const insertMethod = db.prepare(
    `INSERT OR REPLACE INTO methods(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const insertField = db.prepare(
    `INSERT OR REPLACE INTO fields(
      owner_named, name_named, descriptor_named,
      name_official, descriptor_official, name_intermediary
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  db.exec("BEGIN");
  for (const c of parsed.classes) {
    if (!c.named) continue;
    insertClass.run(c.named, c.intermediary || "", c.official || "");
  }
  for (const m of parsed.methods) {
    if (!m.ownerNamed || !m.nameNamed || m.nameNamed.startsWith("<")) continue;
    insertMethod.run(
      m.ownerNamed,
      m.nameNamed,
      m.descriptorNamed || "",
      m.nameOfficial || "",
      m.descriptorOfficial || "",
      m.nameIntermediary || null,
    );
  }
  for (const f of parsed.fields) {
    if (!f.ownerNamed || !f.nameNamed) continue;
    insertField.run(
      f.ownerNamed,
      f.nameNamed,
      f.descriptorNamed || "",
      f.nameOfficial || "",
      f.descriptorOfficial || "",
      f.nameIntermediary || null,
    );
  }
  setMeta(db, {
    schemaVersion: SCHEMA_VERSION,
    version: meta.version ?? "",
    format: meta.format ?? "yarn-tiny-v1",
    mappingEra: "yarn-tiny",
    source: meta.source ?? "",
    builtAt: new Date().toISOString(),
    classCount: String(parsed.classes.length),
    methodCount: String(parsed.methods.length),
    fieldCount: String(parsed.fields.length),
  });
  db.exec("COMMIT");
  return {
    classCount: parsed.classes.length,
    methodCount: parsed.methods.length,
    fieldCount: parsed.fields.length,
    mappingEra: "yarn-tiny",
    warnings: parsed.warnings,
  };
}

/**
 * Stream-scan legacy yarn-mappings.json for classMap entries (class-only, methodCount=0).
 */
export async function importLegacyJsonStream(db, jsonPath, meta = {}) {
  initYarnSchema(db);
  clearMappingTables(db);
  const insert = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );

  const re =
    /"((?:[^"\\]|\\.)+)":\{"officialClass":"((?:[^"\\]|\\.)*)","intermediaryClass":"((?:[^"\\]|\\.)*)","namedClass":"((?:[^"\\]|\\.)*)"\}/g;

  let classCount = 0;
  let carry = "";
  const stream = fs.createReadStream(jsonPath, { encoding: "utf8", highWaterMark: 1024 * 1024 });

  db.exec("BEGIN");
  for await (const chunk of stream) {
    const text = carry + chunk;
    re.lastIndex = 0;
    let match;
    let lastEnd = 0;
    while ((match = re.exec(text)) !== null) {
      const named = match[4] || match[1];
      insert.run(named, match[3], match[2]);
      classCount++;
      lastEnd = match.index + match[0].length;
    }
    carry = text.slice(Math.max(0, lastEnd - 64, text.length - 2048));
  }
  setMeta(db, {
    schemaVersion: SCHEMA_VERSION,
    version: meta.version ?? "",
    format: meta.format ?? "yarn-json-import",
    mappingEra: "yarn-tiny",
    source: meta.source ?? jsonPath,
    sourceFile: jsonPath,
    builtAt: new Date().toISOString(),
    classCount: String(classCount),
    methodCount: "0",
    fieldCount: "0",
    buildWarnings: JSON.stringify(["legacy json: methodCount=0; prefer tiny rebuild"]),
  });
  db.exec("COMMIT");
  return { classCount, methodCount: 0, fieldCount: 0, mappingEra: "yarn-tiny" };
}

function listCandidateSources(mappingsDir) {
  const candidates = [];
  const tiny = findTinyPath(mappingsDir);
  if (tiny) candidates.push({ kind: "tiny", ...tiny });
  const tsrg = path.join(mappingsDir, "joined.tsrg");
  if (fs.existsSync(tsrg)) candidates.push({ kind: "tsrg", path: tsrg });
  const srg = path.join(mappingsDir, "joined.srg");
  if (fs.existsSync(srg)) candidates.push({ kind: "srg", path: srg });
  // MCPConfig 的 `tsrg2 left right`（SRG ↔ mojmap 可读名）——Forge 1.17+ 唯一有 `m_/f_`
  // 成员名的来源，由 scripts/ingest-forge-srg.mjs 削减后入库（.tsrg.gz）。
  // 排在 csv 之前、joined.* 之后：这三样同档共存时不抢既有档的行为。
  try {
    for (const name of fs.readdirSync(mappingsDir).sort()) {
      if (/^srg_to_(official|parchment|snapshot).*\.tsrg(\.gz)?$/.test(name)) {
        candidates.push({ kind: "srg-to-official", path: path.join(mappingsDir, name) });
      }
    }
  } catch {
    /* 目录读不到 = 该档无来源，交给上层报「无候选」 */
  }
  const csv = path.join(mappingsDir, "methods.csv");
  if (fs.existsSync(csv)) candidates.push({ kind: "csv", path: csv });
  const json = path.join(mappingsDir, "yarn-mappings.json");
  if (fs.existsSync(json)) candidates.push({ kind: "json", path: json });
  return candidates;
}

async function tryImportSource(db, source, opts) {
  if (source.kind === "tiny") {
    return importTinyIntoDb(db, source.path, {
      version: opts.version,
      source: source.path,
    });
  }
  if (source.kind === "tsrg") {
    initYarnSchema(db);
    clearMappingTables(db);
    const input = fs.createReadStream(source.path, { encoding: "utf8" });
    const r = await importTsrgStream(db, input, { version: opts.version, source: source.path });
    setMeta(db, {
      schemaVersion: SCHEMA_VERSION,
      version: opts.version ?? "",
      mappingEra: "tsrg",
      format: "joined-tsrg",
      source: source.path,
      sourceFile: source.path,
      builtAt: new Date().toISOString(),
      classCount: String(r.classCount),
      methodCount: String(r.methodCount),
      fieldCount: String(r.fieldCount ?? 0),
    });
    return r;
  }
  if (source.kind === "srg") {
    initYarnSchema(db);
    clearMappingTables(db);
    const input = fs.createReadStream(source.path, { encoding: "utf8" });
    const r = await importForgeSrgStream(db, input, { version: opts.version, source: source.path });
    setMeta(db, {
      schemaVersion: SCHEMA_VERSION,
      version: opts.version ?? "",
      mappingEra: "forge-srg",
      format: "joined-srg",
      source: source.path,
      sourceFile: source.path,
      builtAt: new Date().toISOString(),
      classCount: String(r.classCount),
      methodCount: String(r.methodCount),
      fieldCount: String(r.fieldCount ?? 0),
    });
    return r;
  }
  if (source.kind === "srg-to-official") {
    initYarnSchema(db);
    clearMappingTables(db);
    const raw = fs.createReadStream(source.path);
    const input = String(source.path).endsWith(".gz") ? raw.pipe(zlib.createGunzip()) : raw;
    const r = await importSrgToOfficialStream(db, input, { version: opts.version, source: source.path });
    // ⚠️ searge_* 表按 `searge` 做主键，而 MCPConfig 的同一个 `m_<id>_` 会在多个 owner 下各列一行
    // （实测 1.20.1：方法 48,575 行 / 唯一 SRG 键 33,222；字段 32,079 行 / 31,003 键，那 1,076 个
    // 是同 owner 的「裸形 + 带描述符形」两行）。**可读名逐键唯一 ⇒ 塌行不丢信息**，但 meta 若照抄
    // 行数就是 `DEBT_MAPPING_COUNT` 那个病（读侧直接信 meta ⇒ 覆盖数虚报）⇒ 这里必须数表内实数。
    const countRows = (t) => String(db.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get().c);
    setMeta(db, {
      schemaVersion: SCHEMA_VERSION,
      version: opts.version ?? "",
      mappingEra: "mcp-config-srg",
      format: "mcpconfig-srg-to-official",
      source: source.path,
      sourceFile: source.path,
      builtAt: new Date().toISOString(),
      classCount: String(r.classCount),
      methodCount: String(r.methodCount),
      fieldCount: String(r.fieldCount),
      seargeMethodCount: countRows("searge_methods"),
      seargeFieldCount: countRows("searge_fields"),
      srgNameCollisionNote:
        "searge_* 按 SRG 名主键去重：同名的跨 owner 副本只留一行（可读名逐键唯一，不丢信息）；methods/fields 表按 owner 存全量行",
    });
    return r;
  }
  if (source.kind === "csv") {
    initYarnSchema(db);
    clearMappingTables(db);
    const methodsPath = source.path;
    const fieldsPath = path.join(path.dirname(methodsPath), "fields.csv");
    const r = importMcpCsvMethods(db, methodsPath, { version: opts.version, source: methodsPath });
    let fieldCount = 0;
    if (fs.existsSync(fieldsPath)) {
      const fr = importMcpCsvFields(db, fieldsPath, { version: opts.version, source: fieldsPath });
      fieldCount = fr.fieldCount;
    }
    setMeta(db, {
      schemaVersion: SCHEMA_VERSION,
      version: opts.version ?? "",
      mappingEra: "mcp-csv",
      format: "mcp-methods-csv",
      source: methodsPath,
      sourceFile: methodsPath,
      builtAt: new Date().toISOString(),
      classCount: "0",
      methodCount: String(r.methodCount),
      fieldCount: String(fieldCount),
      ...(fs.existsSync(fieldsPath)
        ? { seargeFieldsCsv: fieldsPath, seargeFieldCount: String(fieldCount) }
        : {}),
    });
    return { ...r, fieldCount };
  }
  if (source.kind === "json") {
    return importLegacyJsonStream(db, source.path, { version: opts.version, source: source.path });
  }
  throw new Error(`Unknown source kind: ${source.kind}`);
}

/** Build sqlite for one mappings directory. Returns output path. */
export async function buildYarnSqliteForDir(mappingsDir, opts = {}) {
  const outPath = opts.outPath ?? path.join(mappingsDir, "yarn-mappings.sqlite");
  // Build on local temp disk first — avoids H:/ network-drive SQLITE_IOERR during bulk insert.
  const tmpPath = path.join(
    os.tmpdir(),
    `yarn-mappings-${process.pid}-${Date.now()}.sqlite`,
  );

  const candidates = listCandidateSources(mappingsDir);
  if (candidates.length === 0) {
    throw new Error(`No mapping sources in ${mappingsDir}`);
  }

  const db = openYarnDb(tmpPath, { readonly: false });
  const attempts = [];
  let result = null;
  let used = null;
  try {
    for (const source of candidates) {
      try {
        initYarnSchema(db);
        clearMappingTables(db);
        result = await tryImportSource(db, source, opts);
        used = source;
        attempts.push({ source: source.path || source.kind, ok: true, era: result.mappingEra });
        break;
      } catch (err) {
        attempts.push({
          source: source.path || source.kind,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    if (!result || !used) {
      throw new Error(
        `All mapping sources failed for ${mappingsDir}: ${JSON.stringify(attempts)}`,
      );
    }

    // Layer MCP methods.csv onto SRG/TSRG DBs so searge↔MCP named works (1.7–1.13).
    let seargeCount = 0;
    let seargeFieldCount = 0;
    if (
      (result.mappingEra === "forge-srg" || result.mappingEra === "tsrg") &&
      fs.existsSync(path.join(mappingsDir, "methods.csv"))
    ) {
      try {
        const csv = importMcpCsvMethods(db, path.join(mappingsDir, "methods.csv"), {
          version: opts.version,
          source: path.join(mappingsDir, "methods.csv"),
        });
        seargeCount = csv.methodCount;
        setMeta(db, {
          seargeCsv: path.join(mappingsDir, "methods.csv"),
          seargeMethodCount: String(seargeCount),
        });
        attempts.push({
          source: path.join(mappingsDir, "methods.csv"),
          ok: true,
          era: "mcp-csv-layer",
        });
      } catch (err) {
        attempts.push({
          source: path.join(mappingsDir, "methods.csv"),
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const fieldsCsvPath = path.join(mappingsDir, "fields.csv");
    if (
      (result.mappingEra === "forge-srg" || result.mappingEra === "tsrg") &&
      fs.existsSync(fieldsCsvPath)
    ) {
      try {
        const csv = importMcpCsvFields(db, fieldsCsvPath, {
          version: opts.version,
          source: fieldsCsvPath,
        });
        seargeFieldCount = csv.fieldCount;
        setMeta(db, {
          seargeFieldsCsv: fieldsCsvPath,
          seargeFieldCount: String(seargeFieldCount),
        });
        attempts.push({ source: fieldsCsvPath, ok: true, era: "mcp-csv-fields-layer" });
      } catch (err) {
        attempts.push({
          source: fieldsCsvPath,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (attempts.some((a) => !a.ok)) {
      setMeta(db, {
        fellBackTo: used.path || used.kind,
        primaryFailed: "true",
        buildAttempts: JSON.stringify(attempts),
      });
    }
    db.close();
    replaceSqliteAtomically(tmpPath, outPath);
    return {
      outPath,
      classCount: result.classCount,
      methodCount: result.methodCount,
      fieldCount: result.fieldCount > 0 ? result.fieldCount : undefined,
      seargeMethodCount: seargeCount || undefined,
      seargeFieldCount: seargeFieldCount || undefined,
      mappingEra: result.mappingEra,
      source: repoRelativePosix(used.path || used.kind),
      attempts,
      fellBackTo: attempts.some((a) => !a.ok) ? repoRelativePosix(used.path || used.kind) : undefined,
    };
  } catch (err) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {
        /* ignore */
      }
    }
    throw err;
  }
}

function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* spin */
  }
}

/** Windows-safe replace. Supports cross-drive (os.tmpdir → H:) via copy. */
function replaceSqliteAtomically(tmpPath, outPath) {
  const bak = outPath + ".bak";
  let lastErr;
  for (let i = 0; i < 10; i++) {
    try {
      if (fs.existsSync(bak)) {
        try {
          fs.unlinkSync(bak);
        } catch {
          /* ignore */
        }
      }
      if (fs.existsSync(outPath)) {
        try {
          fs.renameSync(outPath, bak);
        } catch {
          try {
            fs.unlinkSync(outPath);
          } catch {
            /* keep trying */
          }
        }
      }
      try {
        fs.renameSync(tmpPath, outPath);
      } catch {
        // Cross-device rename fails — copy then unlink tmp
        fs.copyFileSync(tmpPath, outPath);
        try {
          fs.unlinkSync(tmpPath);
        } catch {
          /* ignore */
        }
      }
      if (fs.existsSync(bak)) {
        try {
          fs.unlinkSync(bak);
        } catch {
          /* leave bak */
        }
      }
      return;
    } catch (err) {
      lastErr = err;
      sleepSync(200 * (i + 1));
    }
  }
  throw lastErr || new Error(`Failed to place sqlite at ${outPath}`);
}

/** fabric_/forge_ 下含可导入源的 mappings 目录（整体构建与 CLI dry 列举共用一份口径）。 */
export function collectMappingTargets(dataRoot) {
  const targets = [];
  for (const entry of fs.readdirSync(dataRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const isFabric = entry.name.startsWith("fabric_");
    const isForge = entry.name.startsWith("forge_");
    if (!isFabric && !isForge) continue;
    const ver = entry.name.replace(/^fabric_/, "").replace(/^forge_/, "");
    const mappingsDir = path.join(dataRoot, entry.name, "mappings");
    if (!fs.existsSync(mappingsDir)) continue;
    if (listCandidateSources(mappingsDir).length === 0) continue;
    targets.push({ name: entry.name, platform: isFabric ? "fabric" : "forge", ver, mappingsDir });
  }
  return targets;
}

export async function buildAllMappingSqlite(dataRoot) {
  const results = [];
  const report = [];
  for (const t of collectMappingTargets(dataRoot)) {
    const started = Date.now();
    try {
      const r = await buildYarnSqliteForDir(t.mappingsDir, { version: t.ver });
      results.push({ platform: t.platform, version: t.ver, ...r });
      report.push({
        version: t.ver,
        platform: t.platform,
        source: r.source,
        era: r.mappingEra,
        methodCount: r.methodCount,
        classCount: r.classCount,
        ok: true,
        fellBackTo: r.fellBackTo,
        durationMs: Date.now() - started,
      });
      console.error(
        `built ${r.outPath}: era=${r.mappingEra} classes=${r.classCount} methods=${r.methodCount} fields=${r.fieldCount ?? 0}`,
      );
    } catch (err) {
      report.push({
        version: t.ver,
        platform: t.platform,
        ok: false,
        error: stripRepoRoot(err instanceof Error ? err.message : String(err)),
        durationMs: Date.now() - started,
      });
      console.error(`FAIL ${t.name}: ${err instanceof Error ? err.message : err}`);
    }
  }

  const reportPath = path.join(__dirname, "mapping-sqlite-build-report.json");
  emit(reportPath, JSON.stringify(report, null, 2));
  const failed = report.filter((r) => !r.ok).length;
  return { results, report, reportPath, failed };
}

/** @deprecated alias */
export async function buildAllFabricYarnSqlite(dataRoot) {
  const all = await buildAllMappingSqlite(dataRoot);
  return all.results.filter((r) => r.platform === "fabric");
}

function defaultDataRoot() {
  return path.resolve(__dirname, "..", "..", "..", "data");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const write = wantWrite(args);
  const repoRel = (p) => path.relative(GUARD_ROOT, p).split(path.sep).join("/");
  if (args.includes("--all")) {
    const dataRoot = defaultDataRoot();
    if (!write) {
      for (const t of collectMappingTargets(dataRoot)) {
        console.log(`DRYRUN ${repoRel(path.join(t.mappingsDir, "yarn-mappings.sqlite"))}`);
      }
      console.log(`DRYRUN ${repoRel(path.join(__dirname, "mapping-sqlite-build-report.json"))}`);
      logDryRunBanner("build-yarn-sqlite");
    } else {
      buildAllMappingSqlite(dataRoot)
        .then(({ results, reportPath, failed }) => {
          console.log(
            JSON.stringify({ ok: failed === 0, built: results.length, failed, reportPath }, null, 2),
          );
          if (failed > 0) process.exit(1);
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    }
  } else {
    const dir = args.find((a) => !a.startsWith("--"));
    if (!dir) {
      console.error("usage: build-yarn-sqlite.mjs <mappingsDir> | --all  （默认 dry-run，加 --write 才产出）");
      process.exit(2);
    }
    if (!write) {
      console.log(`DRYRUN ${repoRel(path.join(path.resolve(dir), "yarn-mappings.sqlite"))}`);
      logDryRunBanner("build-yarn-sqlite");
    } else {
      const versionFlag = args.find((a) => a.startsWith("--version="));
      buildYarnSqliteForDir(path.resolve(dir), {
        version: versionFlag ? versionFlag.slice(10) : undefined,
      })
        .then((r) => console.log(JSON.stringify({ ok: true, ...r }, null, 2)))
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    }
  }
}
