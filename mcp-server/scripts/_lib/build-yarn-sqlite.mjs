/**
 * Build per-version yarn-mappings.sqlite from tiny (preferred) or legacy JSON.
 *
 * Runtime MUST NOT load yarn-mappings.json; only the sqlite artefact is queried.
 *
 * Schema:
 *   meta(key TEXT PRIMARY KEY, value TEXT)
 *   classes(named TEXT PRIMARY KEY, intermediary TEXT NOT NULL, official TEXT)
 *   INDEX on intermediary, official
 *
 * Usage:
 *   node scripts/_lib/build-yarn-sqlite.mjs <mappingsDir> [--version=1.20.1]
 *   node scripts/_lib/build-yarn-sqlite.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

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
  `);
}

function setMeta(db, entries) {
  const stmt = db.prepare("INSERT OR REPLACE INTO meta(key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(entries)) {
    stmt.run(k, v == null ? "" : String(v));
  }
}

/** Import CLASS rows from a yarn tiny v1 text stream (async line reader). */
export async function importTinyStream(db, input, meta = {}) {
  initYarnSchema(db);
  db.exec("DELETE FROM classes; DELETE FROM meta;");
  const insert = db.prepare(
    "INSERT OR REPLACE INTO classes(named, intermediary, official) VALUES (?, ?, ?)",
  );
  let classCount = 0;
  let methodCount = 0;

  db.exec("BEGIN");
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line || line.startsWith("v1\t")) continue;
    const cols = line.split("\t");
    const tag = cols[0];
    if (tag === "CLASS") {
      const official = cols[1] ?? "";
      const intermediary = cols[2] ?? "";
      const named = cols[3] ?? "";
      if (named) {
        insert.run(named, intermediary, official);
        classCount++;
      }
    } else if (tag === "METHOD") {
      methodCount++;
    }
  }
  setMeta(db, {
    version: meta.version ?? "",
    format: meta.format ?? "yarn-tiny-v1",
    source: meta.source ?? "",
    builtAt: new Date().toISOString(),
    classCount: String(classCount),
    methodCount: String(methodCount),
  });
  db.exec("COMMIT");
  return { classCount, methodCount };
}

/**
 * Stream-scan legacy yarn-mappings.json for classMap entries without JSON.parse of the whole file.
 * Matches: "named/path":{"officialClass":"a","intermediaryClass":"...","namedClass":"..."}
 */
export async function importLegacyJsonStream(db, jsonPath, meta = {}) {
  initYarnSchema(db);
  db.exec("DELETE FROM classes; DELETE FROM meta;");
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
    // Keep a tail large enough for a max-size entry (~1KB)
    carry = text.slice(Math.max(0, lastEnd - 64, text.length - 2048));
  }
  setMeta(db, {
    version: meta.version ?? "",
    format: meta.format ?? "yarn-json-import",
    source: meta.source ?? jsonPath,
    builtAt: new Date().toISOString(),
    classCount: String(classCount),
    methodCount: meta.methodCount != null ? String(meta.methodCount) : "",
  });
  db.exec("COMMIT");
  return { classCount, methodCount: 0 };
}

function findTinyPath(mappingsDir) {
  const names = fs.readdirSync(mappingsDir);
  const gz = names.find((n) => n.endsWith("-tiny.gz") || n === "mappings.tiny.gz");
  if (gz) return { path: path.join(mappingsDir, gz), gzip: true };
  const tiny = names.find((n) => n === "mappings.tiny" || n.endsWith(".tiny"));
  if (tiny) return { path: path.join(mappingsDir, tiny), gzip: false };
  return null;
}

function peekJsonMeta(jsonPath) {
  // Read only the first 512 bytes for version/format/source/methodCount headers
  const fd = fs.openSync(jsonPath, "r");
  try {
    const buf = Buffer.alloc(800);
    const n = fs.readSync(fd, buf, 0, 800, 0);
    const head = buf.slice(0, n).toString("utf8");
    const version = /"version"\s*:\s*"([^"]+)"/.exec(head)?.[1];
    const format = /"format"\s*:\s*"([^"]+)"/.exec(head)?.[1];
    const source = /"source"\s*:\s*"([^"]+)"/.exec(head)?.[1];
    const methodCount = /"methodCount"\s*:\s*(\d+)/.exec(head)?.[1];
    return { version, format, source, methodCount };
  } finally {
    fs.closeSync(fd);
  }
}

/** Build sqlite for one mappings directory. Returns output path. */
export async function buildYarnSqliteForDir(mappingsDir, opts = {}) {
  const outPath = opts.outPath ?? path.join(mappingsDir, "yarn-mappings.sqlite");
  const tmpPath = outPath + ".tmp";
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

  const db = openYarnDb(tmpPath, { readonly: false });
  try {
    const tiny = findTinyPath(mappingsDir);
    const jsonPath = path.join(mappingsDir, "yarn-mappings.json");
    let result;
    if (tiny) {
      const input = tiny.gzip
        ? fs.createReadStream(tiny.path).pipe(zlib.createGunzip())
        : fs.createReadStream(tiny.path, { encoding: "utf8" });
      const meta = {
        version: opts.version,
        source: tiny.path,
        format: "yarn-tiny-v1",
      };
      if (fs.existsSync(jsonPath)) {
        const peeked = peekJsonMeta(jsonPath);
        meta.version = meta.version || peeked.version;
        meta.source = peeked.source || meta.source;
      }
      result = await importTinyStream(db, input, meta);
    } else if (fs.existsSync(jsonPath)) {
      const peeked = peekJsonMeta(jsonPath);
      result = await importLegacyJsonStream(db, jsonPath, {
        version: opts.version || peeked.version,
        format: peeked.format,
        source: peeked.source,
        methodCount: peeked.methodCount,
      });
    } else {
      throw new Error(`No yarn tiny or yarn-mappings.json in ${mappingsDir}`);
    }
    db.close();
    fs.renameSync(tmpPath, outPath);
    return { outPath, ...result };
  } catch (err) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    throw err;
  }
}

export async function buildAllFabricYarnSqlite(dataRoot) {
  const results = [];
  for (const entry of fs.readdirSync(dataRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith("fabric_")) continue;
    const ver = entry.name.slice("fabric_".length);
    const mappingsDir = path.join(dataRoot, entry.name, "mappings");
    if (!fs.existsSync(mappingsDir)) continue;
    const hasYarn =
      fs.existsSync(path.join(mappingsDir, "yarn-mappings.json")) || findTinyPath(mappingsDir);
    if (!hasYarn) continue;
    const r = await buildYarnSqliteForDir(mappingsDir, { version: ver });
    results.push({ version: ver, ...r });
    console.error(`built ${r.outPath}: classes=${r.classCount}`);
  }
  return results;
}

function defaultDataRoot() {
  return path.resolve(__dirname, "..", "..", "..", "data");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--all")) {
    const dataRoot = defaultDataRoot();
    buildAllFabricYarnSqlite(dataRoot)
      .then((rows) => {
        console.log(JSON.stringify({ ok: true, built: rows.length, rows }, null, 2));
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
