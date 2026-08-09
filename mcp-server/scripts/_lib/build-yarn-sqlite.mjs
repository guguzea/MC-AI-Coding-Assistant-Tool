/**
 * Build per-version yarn-mappings.sqlite (schema v3) from Tiny / TSRG / SRG / CSV.
 *
 * schema v3 adds `fields` + `searge_fields` (v2 class/method tables unchanged).
 * Runtime MUST NOT load yarn-mappings.json; only the sqlite artefact is queried.
 *
 * Usage:
 *   node scripts/_lib/build-yarn-sqlite.mjs <mappingsDir> [--version=1.20.1]
 *   node scripts/_lib/build-yarn-sqlite.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { parseTiny, findTinyPath } from "./parse-tiny.mjs";
import { importTsrgStream } from "./import-tsrg.mjs";
import { importForgeSrgStream } from "./import-forge-srg.mjs";
import { importMcpCsvMethods, importMcpCsvFields } from "./import-mcp-csv.mjs";

const SCHEMA_VERSION = "3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    CREATE INDEX IF NOT EXISTS idx_classes_official ON classes(official);

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
  const stmt = db.prepare("INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(entries)) {
    stmt.run(k, v == null ? "" : String(v));
  }
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
  setMeta(db, {
    schemaVersion: SCHEMA_VERSION,
    version: meta.version ?? "",
    format: "yarn-tiny-v1",
    mappingEra: "yarn-tiny",
    source: meta.source ?? tinyPath,
    sourceFile: meta.source ?? tinyPath,
    builtAt: new Date().toISOString(),
    classCount: String(parsed.classes.length),
    methodCount: String(parsed.methods.length),
    fieldCount: String(parsed.fields.length),
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
      source: used.path || used.kind,
      attempts,
      fellBackTo: attempts.some((a) => !a.ok) ? used.path || used.kind : undefined,
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

export async function buildAllMappingSqlite(dataRoot) {
  const results = [];
  const report = [];
  for (const entry of fs.readdirSync(dataRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const isFabric = entry.name.startsWith("fabric_");
    const isForge = entry.name.startsWith("forge_");
    if (!isFabric && !isForge) continue;
    const ver = entry.name.replace(/^fabric_/, "").replace(/^forge_/, "");
    const mappingsDir = path.join(dataRoot, entry.name, "mappings");
    if (!fs.existsSync(mappingsDir)) continue;
    if (listCandidateSources(mappingsDir).length === 0) continue;

    const started = Date.now();
    try {
      const r = await buildYarnSqliteForDir(mappingsDir, { version: ver });
      results.push({ platform: isFabric ? "fabric" : "forge", version: ver, ...r });
      report.push({
        version: ver,
        platform: isFabric ? "fabric" : "forge",
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
        version: ver,
        platform: isFabric ? "fabric" : "forge",
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - started,
      });
      console.error(`FAIL ${entry.name}: ${err instanceof Error ? err.message : err}`);
    }
  }

  const reportPath = path.join(__dirname, "mapping-sqlite-build-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
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
  if (args.includes("--all")) {
    const dataRoot = defaultDataRoot();
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
  } else {
    const dir = args.find((a) => !a.startsWith("--"));
    if (!dir) {
      console.error("usage: build-yarn-sqlite.mjs <mappingsDir> | --all");
      process.exit(2);
    }
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
