/**
 * Lazy, read-only mapping lookup via prebuilt SQLite (schema v2/v3/v4).
 *
 * HARD RULE: never readFileSync / JSON.parse yarn-mappings.json in this module.
 * schema v3 adds fields / searge_fields; v4 adds single-column name_official /
 * name_intermediary indexes. Runtime openDbCached is readOnly — never CREATE INDEX.
 * v2 remains readable for class/method.
 */

import { existsSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import { resolveDataDir } from "../utils/path.js";
import { isSafeVersionSegment } from "../utils/minecraft-version.js";

export { VERSION_SEGMENT_RE } from "../utils/minecraft-version.js";

type MappingDb = DatabaseSync;

const _dbs = new Map<string, MappingDb>();
const MAPPING_DB_CAP = 8;
const _pathCache = new Map<string, string | null>();
const _csvPathCache = new Map<string, string | null>();

export function normalizeMcVersion(input: string): string {
  let v = input.trim();
  if (!v) throw new Error("empty version");
  v = v.replace(/^forge_/i, "").replace(/^fabric_/i, "").replace(/^v/i, "");
  return v;
}

function fabricSqlitePath(version: string): string | null {
  if (!isSafeVersionSegment(version)) return null;
  return resolveDataDir(`fabric_${version}`, "mappings", "yarn-mappings.sqlite");
}

function forgeSqlitePath(version: string): string | null {
  if (!isSafeVersionSegment(version)) return null;
  return resolveDataDir(`forge_${version}`, "mappings", "yarn-mappings.sqlite");
}

function readMeta(db: MappingDb, key: string): string | null {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

function methodCountOf(db: MappingDb): number {
  const fromMeta = Number(readMeta(db, "methodCount") || "0");
  if (fromMeta > 0) return fromMeta;
  try {
    const m = db.prepare("SELECT COUNT(*) AS c FROM methods").get() as { c: number };
    if (m.c > 0) return m.c;
  } catch {
    /* no methods table */
  }
  try {
    const s = db.prepare("SELECT COUNT(*) AS c FROM searge_methods").get() as { c: number };
    return s.c;
  } catch {
    return 0;
  }
}

function dbCacheKey(dbPath: string): string {
  return process.platform === "win32" ? dbPath.toLowerCase() : dbPath;
}

function withReadOnlyDb<T>(dbPath: string, fn: (db: MappingDb) => T): T {
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    return fn(db);
  } finally {
    try {
      db.close();
    } catch {
      /* ignore */
    }
  }
}

function openDbCached(dbPath: string): MappingDb | null {
  const key = dbCacheKey(dbPath);
  const cached = _dbs.get(key);
  if (cached) {
    _dbs.delete(key);
    _dbs.set(key, cached);
    return cached;
  }
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    _dbs.set(key, db);
    while (_dbs.size > MAPPING_DB_CAP) {
      const oldest = _dbs.keys().next().value;
      if (oldest === undefined) break;
      const old = _dbs.get(oldest);
      if (!old) {
        _dbs.delete(oldest);
        continue;
      }
      let closed = false;
      try {
        old.close();
        closed = true;
      } catch {
        try {
          old.close();
          closed = true;
        } catch {
          console.error(`[yarn-sqlite] close() 失败，保留旧句柄: ${oldest}`);
        }
      }
      if (closed) _dbs.delete(oldest);
      else break;
    }
    return db;
  } catch {
    return null;
  }
}

/** Resolve best sqlite path for version (fabric preferred when useful). */
export function resolveMappingDbPath(version: string): string | null {
  const v = normalizeMcVersion(version);
  if (_pathCache.has(v)) return _pathCache.get(v) ?? null;

  // 版本段非法（含路径穿越）→ 直接无库可解析，走上层 NOT_FOUND 降级
  if (!isSafeVersionSegment(v)) return null;
  const fabric = fabricSqlitePath(v);
  const forge = forgeSqlitePath(v);
  if (!fabric || !forge) return null;

  let chosen: string | null = null;
  if (existsSync(fabric)) {
    try {
      chosen = withReadOnlyDb(fabric, (db) => {
        const era = readMeta(db, "mappingEra") || "";
        const mc = methodCountOf(db);
        return mc > 0 || era === "yarn-tiny" ? fabric : null;
      });
    } catch {
      chosen = null; // 打开失败不乐观缓存（B19），转 forge 兜底
    }
  }
  if (!chosen && existsSync(forge)) {
    chosen = forge;
  }
  if (chosen === fabric && existsSync(forge)) {
    try {
      const fabMc = withReadOnlyDb(fabric, methodCountOf);
      const forgeMc = withReadOnlyDb(forge, methodCountOf);
      if (fabMc === 0 && forgeMc > 0) chosen = forge;
    } catch {
      /* keep fabric */
    }
  }

  _pathCache.set(v, chosen);
  return chosen;
}

/** Forge sqlite with searge_methods for searge↔named (mcp-csv era, or SRG/TSRG + CSV layer). */
export function resolveCsvMappingDbPath(version: string): string | null {
  const v = normalizeMcVersion(version);
  if (_csvPathCache.has(v)) return _csvPathCache.get(v) ?? null;
  const forge = forgeSqlitePath(v);
  let chosen: string | null = null;
  if (forge && existsSync(forge)) {
    try {
      chosen = withReadOnlyDb(forge, (db) => {
        const era = readMeta(db, "mappingEra");
        let seargeCount = 0;
        try {
          seargeCount = (
            db.prepare("SELECT COUNT(*) AS c FROM searge_methods").get() as { c: number }
          ).c;
        } catch {
          seargeCount = 0;
        }
        return era === "mcp-csv" || seargeCount > 0 ? forge : null;
      });
    } catch {
      /* ignore */
    }
  }
  _csvPathCache.set(v, chosen);
  return chosen;
}

export function getYarnDb(version: string): MappingDb | null {
  const dbPath = resolveMappingDbPath(version);
  if (!dbPath || !existsSync(dbPath)) return null;
  return openDbCached(dbPath);
}

export function getCsvDb(version: string): MappingDb | null {
  const dbPath = resolveCsvMappingDbPath(version);
  if (!dbPath || !existsSync(dbPath)) return null;
  return openDbCached(dbPath);
}

export function closeAllYarnDbs(): void {
  for (const db of _dbs.values()) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
  }
  _dbs.clear();
  _pathCache.clear();
  _csvPathCache.clear();
}

export function yarnDbIsOpen(version: string): boolean {
  const p = resolveMappingDbPath(version);
  return p ? _dbs.has(dbCacheKey(p)) : false;
}

function toSlash(name: string): string {
  return name.replace(/\./g, "/");
}

function toDot(name: string): string {
  return name.replace(/\//g, ".");
}

function simpleClassName(name: string): string {
  const slash = toSlash(name);
  const parts = slash.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? name;
}

/** SQLite GLOB 元字符转义（GLOB 无 ESCAPE 子句，用 [...] 包住字面量）。 */
function globLiteral(s: string): string {
  return s.replace(/[*?\[\]]/g, (c) => `[${c}]`);
}

/** 映射层名：obfuscated = Tiny official 混淆短名（er）；intermediary = method_6032 类。 */
export type MappingLayer = "mojang" | "mcp" | "yarn" | "parchment" | "obfuscated" | "intermediary";

/** 层名 → sqlite 列名（parchment 与 mcp 同层，走 name_named）。 */
function layerColumn(from: MappingLayer): "name_official" | "name_intermediary" | "name_named" {
  if (from === "mojang" || from === "obfuscated") return "name_official";
  if (from === "intermediary") return "name_intermediary";
  return "name_named";
}

export interface YarnClassRow {
  named: string;
  intermediary: string;
  official: string | null;
}

export interface MethodRow {
  owner_named: string;
  name_named: string;
  descriptor_named: string;
  name_official: string;
  descriptor_official: string;
  name_intermediary: string | null;
}

export interface MethodCandidate {
  name: string;
  descriptor: string;
  official: string;
  intermediary?: string | null;
  owner?: string;
}

export interface LookupMethodResult {
  found: boolean;
  ambiguous?: boolean;
  row?: MethodRow;
  candidates?: MethodCandidate[];
  mappingEra?: string | null;
  resultKind?: string;
  notes?: string[];
  /** csv = MCP searge_methods 命中；yarn-tiny = fabric named 列（不得冒充 mcp/parchment） */
  source?: "csv" | "yarn-tiny";
}

function scorePackageOverlap(inputSlash: string, candidateNamed: string): number {
  const inputTokens = new Set(
    inputSlash
      .toLowerCase()
      .split("/")
      .filter((t) => t.length > 0),
  );
  if (inputTokens.size <= 1) return 0;
  const candTokens = candidateNamed.toLowerCase().split("/");
  return candTokens.filter((t) => inputTokens.has(t)).length;
}

function pickBestCandidate(
  memberName: string,
  candidates: YarnClassRow[],
): YarnClassRow | null {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const inputSlash = toSlash(memberName);
  let best: YarnClassRow | null = null;
  let bestScore = -1;
  for (const c of candidates) {
    const score = scorePackageOverlap(inputSlash, c.named);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  if (best && bestScore >= 2) return best;

  const mcOnly = candidates.filter((c) => c.named.startsWith("net/minecraft/"));
  if (mcOnly.length === 1) return mcOnly[0];

  return null;
}

export function getMappingEra(version: string): string | null {
  const db = getYarnDb(version);
  if (!db) return null;
  return readMeta(db, "mappingEra");
}

export function getSchemaVersion(version: string): string | null {
  const db = getYarnDb(version);
  if (!db) return null;
  return readMeta(db, "schemaVersion");
}

function dbHasFieldsTable(db: MappingDb): boolean {
  try {
    db.prepare("SELECT 1 FROM fields LIMIT 1").get();
    return true;
  } catch {
    return false;
  }
}

function dbHasSeargeFields(db: MappingDb): boolean {
  try {
    db.prepare("SELECT 1 FROM searge_fields LIMIT 1").get();
    return true;
  } catch {
    return false;
  }
}

export interface FieldRow {
  owner_named: string;
  name_named: string;
  descriptor_named: string;
  name_official: string;
  descriptor_official: string;
  name_intermediary: string | null;
}

export interface LookupFieldResult {
  found: boolean;
  ambiguous?: boolean;
  row?: FieldRow;
  candidates?: MethodCandidate[];
  mappingEra?: string | null;
  resultKind?: string;
  notes?: string[];
  source?: "csv" | "yarn-tiny";
}

export function lookupField(
  version: string,
  opts: {
    ownerClass?: string;
    memberName: string;
    descriptor?: string;
    from: MappingLayer;
  },
): LookupFieldResult {
  const db = getYarnDb(version);
  const era = db ? readMeta(db, "mappingEra") : null;
  const schema = db ? readMeta(db, "schemaVersion") : null;
  const csvDb = getCsvDb(version);
  const { memberName, descriptor, from } = opts;

  if (!db) {
    return {
      found: false,
      mappingEra: null,
      notes: [`未找到 yarn-mappings.sqlite（version=${version}）`],
    };
  }

  if (!dbHasFieldsTable(db) && !(csvDb && dbHasSeargeFields(csvDb))) {
    return {
      found: false,
      mappingEra: era,
      resultKind: "SCHEMA_FIELDS_UNAVAILABLE",
      notes: [
        `当前 schemaVersion=${schema ?? "unknown"} 无 fields 表`,
        "请运行 npm run build:yarn-sqlite 重建为 schema v3",
      ],
    };
  }

  // Global CSV searge↔named for fields when no owner
  if (csvDb && dbHasSeargeFields(csvDb) && !opts.ownerClass) {
    const isSearge = /^field_/.test(memberName);
    if (isSearge || from === "mojang") {
      const row = csvDb
        .prepare("SELECT searge, name_named, descriptor_named FROM searge_fields WHERE searge = ?")
        .get(memberName) as { searge: string; name_named: string; descriptor_named: string } | undefined;
      if (row) {
        return {
          found: true,
          source: "csv",
          mappingEra: era || "mcp-csv",
          row: {
            owner_named: "",
            name_named: row.name_named,
            descriptor_named: row.descriptor_named || "",
            name_official: row.searge,
            descriptor_official: row.descriptor_named || "",
            name_intermediary: null,
          },
        };
      }
    }
    if (!isSearge) {
      const rows = csvDb
        .prepare(
          "SELECT searge, name_named, descriptor_named FROM searge_fields WHERE name_named = ? LIMIT 20",
        )
        .all(memberName) as Array<{ searge: string; name_named: string; descriptor_named: string }>;
      if (rows.length === 1) {
        const row = rows[0];
        return {
          found: true,
          source: "csv",
          mappingEra: era || "mcp-csv",
          row: {
            owner_named: "",
            name_named: row.name_named,
            descriptor_named: row.descriptor_named || "",
            name_official: row.searge,
            descriptor_official: row.descriptor_named || "",
            name_intermediary: null,
          },
        };
      }
      if (rows.length > 1) {
        return {
          found: false,
          ambiguous: true,
          mappingEra: "mcp-csv",
          candidates: rows.map((r) => ({
            name: r.name_named,
            descriptor: r.descriptor_named || "",
            official: r.searge,
          })),
          notes: ["CSV 同名字段多条 searge，请改用 field_ 主键或传入 ownerClass"],
        };
      }
    }
  }

  if (!dbHasFieldsTable(db)) {
    return {
      found: false,
      mappingEra: era,
      resultKind: "SCHEMA_FIELDS_UNAVAILABLE",
      notes: ["无 fields 表可用"],
    };
  }

  if (!opts.ownerClass) {
    return {
      found: false,
      mappingEra: era,
      notes: ["字段查询需要 ownerClass（纯 CSV 全局 searge↔named 除外）"],
    };
  }

  const ownerNamed = resolveOwnerClassNamed(
    version,
    opts.ownerClass,
    from === "parchment" ? "mcp" : from,
  );
  if (!ownerNamed) {
    return { found: false, mappingEra: era, notes: [`无法解析 ownerClass: ${opts.ownerClass}`] };
  }

  // MCP named via searge_fields → fields (SRG/TSRG layer)
  if (csvDb && dbHasSeargeFields(csvDb) && from !== "mojang" && !/^field_/.test(memberName)) {
    const csvRows = csvDb
      .prepare(
        "SELECT searge, name_named, descriptor_named FROM searge_fields WHERE name_named = ? LIMIT 40",
      )
      .all(memberName) as Array<{ searge: string; name_named: string; descriptor_named: string }>;
    if (csvRows.length > 0) {
      const hits: FieldRow[] = [];
      for (const csv of csvRows) {
        const row = (
          descriptor
            ? db
                .prepare(
                  `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
                   FROM fields WHERE owner_named = ? AND name_named = ? AND descriptor_named = ? LIMIT 1`,
                )
                .get(ownerNamed, csv.searge, descriptor)
            : db
                .prepare(
                  `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
                   FROM fields WHERE owner_named = ? AND name_named = ? LIMIT 1`,
                )
                .get(ownerNamed, csv.searge)
        ) as FieldRow | undefined;
        if (row) {
          hits.push({
            ...row,
            name_named: memberName,
            descriptor_named: row.descriptor_named || csv.descriptor_named || "",
          });
        }
      }
      if (hits.length === 1) {
        return { found: true, source: "csv", row: hits[0], mappingEra: era };
      }
      if (hits.length > 1) {
        return {
          found: false,
          ambiguous: true,
          mappingEra: era,
          candidates: hits.map((r) => ({
            name: r.name_named,
            descriptor: r.descriptor_named,
            official: r.name_official,
            intermediary: r.name_intermediary,
            owner: r.owner_named,
          })),
        };
      }
    }
  }

  const fromOfficial = from === "mojang" || from === "obfuscated";
  const col = layerColumn(from);
  const colDesc = col === "name_official" ? "descriptor_official" : "descriptor_named";
  if (descriptor) {
    const row = db
      .prepare(
        `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
         FROM fields WHERE owner_named = ? AND ${col} = ? AND ${colDesc} = ? LIMIT 1`,
      )
      .get(ownerNamed, memberName, descriptor) as FieldRow | undefined;
    if (!row) return { found: false, mappingEra: era };
    return { found: true, source: "yarn-tiny", row, mappingEra: era };
  }

  const rows = db
    .prepare(
      `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
       FROM fields WHERE owner_named = ? AND ${col} = ? LIMIT 20`,
    )
    .all(ownerNamed, memberName) as unknown as FieldRow[];

  if (rows.length === 0) return { found: false, mappingEra: era };
  if (rows.length === 1) return { found: true, source: "yarn-tiny", row: rows[0], mappingEra: era };
  return {
    found: false,
    ambiguous: true,
    mappingEra: era,
    candidates: rows.map((r) => ({
      name: r.name_named,
      descriptor: r.descriptor_named,
      official: r.name_official,
      intermediary: r.name_intermediary,
      owner: r.owner_named,
    })),
    notes: ["同名字段多条，请传入 descriptor"],
  };
}

export function lookupYarnClass(
  version: string,
  memberName: string,
  from: "yarn" | "mojang" | "mcp" | "parchment" | "obfuscated" | "intermediary",
): YarnClassRow | null {
  const db = getYarnDb(version);
  if (!db) return null;

  const slash = toSlash(memberName);
  const dot = toDot(memberName);

  if (from === "yarn") {
    const byNamed = db
      .prepare("SELECT named, intermediary, official FROM classes WHERE named = ? OR named = ? LIMIT 1")
      .get(slash, dot) as YarnClassRow | undefined;
    if (byNamed) return byNamed;
  }

  if (from === "mojang" || from === "obfuscated") {
    const byOfficial = db
      .prepare("SELECT named, intermediary, official FROM classes WHERE official = ? LIMIT 1")
      .get(memberName) as YarnClassRow | undefined;
    if (byOfficial) return byOfficial;
  }

  const byInter = db
    .prepare(
      "SELECT named, intermediary, official FROM classes WHERE intermediary = ? OR intermediary = ? LIMIT 1",
    )
    .get(slash, dot) as YarnClassRow | undefined;
  if (byInter) return byInter;

  const byNamed2 = db
    .prepare("SELECT named, intermediary, official FROM classes WHERE named = ? OR named = ? LIMIT 1")
    .get(slash, dot) as YarnClassRow | undefined;
  if (byNamed2) return byNamed2;

  const simple = simpleClassName(memberName);
  if (simple) {
    const candidates = db
      .prepare(
        "SELECT named, intermediary, official FROM classes WHERE named = ? OR named GLOB ? LIMIT 40",
      )
      .all(simple, `*/${globLiteral(simple)}`) as unknown as YarnClassRow[];
    const picked = pickBestCandidate(memberName, candidates);
    if (picked) return picked;
  }

  return null;
}

/** Resolve owner to named slash path using an already-open version. */
export function resolveOwnerClassNamed(
  version: string,
  ownerClass: string,
  from: MappingLayer,
): string | null {
  const row = lookupYarnClass(version, ownerClass, from === "parchment" ? "mcp" : from);
  if (row) return row.named;
  const db = getYarnDb(version);
  if (!db) return null;
  const slash = toSlash(ownerClass);
  const hit = db
    .prepare("SELECT named FROM classes WHERE named = ? LIMIT 1")
    .get(slash) as { named: string } | undefined;
  return hit?.named ?? null;
}

type SeargeCsvRow = {
  searge: string;
  name_named: string;
  descriptor_named: string;
};

function dbHasMethods(db: MappingDb): boolean {
  try {
    return (db.prepare("SELECT COUNT(*) AS c FROM methods").get() as { c: number }).c > 0;
  } catch {
    return false;
  }
}

function methodsBySearge(db: MappingDb, searge: string): MethodRow[] {
  return db
    .prepare(
      `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
       FROM methods WHERE name_named = ? LIMIT 40`,
    )
    .all(searge) as unknown as MethodRow[];
}

/** CSV searge/named → MethodRow；若 methods 表有行则补齐真正的 obf（name_official）。 */
function methodRowFromCsv(
  csvDb: MappingDb,
  csv: SeargeCsvRow,
  methodsDb: MappingDb | null,
): LookupMethodResult {
  const mcpNamed = csv.name_named;
  const desc = csv.descriptor_named || "";
  const fallback: MethodRow = {
    owner_named: "",
    name_named: mcpNamed,
    descriptor_named: desc,
    name_official: csv.searge,
    descriptor_official: desc,
    name_intermediary: null,
  };

  if (!methodsDb || !dbHasMethods(methodsDb)) {
    return { found: true, source: "csv", mappingEra: "mcp-csv", row: fallback };
  }

  const hits = methodsBySearge(methodsDb, csv.searge);
  if (hits.length === 0) {
    return {
      found: true,
      source: "csv",
      mappingEra: "mcp-csv",
      row: fallback,
      notes: ["CSV 命中但 methods 无对应 searge，name_official 回退为 searge"],
    };
  }

  const uniqueObf = [...new Set(hits.map((h) => h.name_official))];
  if (uniqueObf.length > 1) {
    return {
      found: false,
      ambiguous: true,
      mappingEra: readMeta(methodsDb, "mappingEra"),
      candidates: hits.map((r) => ({
        name: mcpNamed,
        descriptor: r.descriptor_named,
        official: r.name_official,
        intermediary: r.name_intermediary,
        owner: r.owner_named,
      })),
      notes: ["同一 searge 对应多个混淆名，请传入 ownerClass"],
    };
  }

  const hit = hits[0];
  return {
    found: true,
    source: "csv",
    mappingEra: readMeta(methodsDb, "mappingEra") || "mcp-csv",
    row: {
      ...hit,
      name_named: mcpNamed,
      descriptor_named: hit.descriptor_named || desc,
    },
    notes:
      hits.length > 1
        ? ["同一 searge 多 owner 但混淆名唯一；未提供 ownerClass 时取首条"]
        : undefined,
  };
}

/**
 * SRG/TSRG + MCP CSV：MCP 可读名 + owner → searge → methods（含真正 obf）。
 * methods.name_named 存的是 func_xxx，不能直接用 getHealth 查。
 */
function lookupMethodViaCsvOwner(
  version: string,
  methodsDb: MappingDb,
  csvDb: MappingDb,
  opts: {
    ownerClass: string;
    memberName: string;
    descriptor?: string;
    from: MappingLayer;
  },
): LookupMethodResult | null {
  if (!dbHasMethods(methodsDb)) return null;

  const { memberName, descriptor, from } = opts;
  const isSearge = /^func_/.test(memberName) || /^field_/.test(memberName);
  // Mojang/obf 或已是 searge：走普通 methods 路径即可
  if (from === "mojang" || isSearge) return null;

  const ownerNamed = resolveOwnerClassNamed(
    version,
    opts.ownerClass,
    from === "parchment" ? "mcp" : from,
  );
  if (!ownerNamed) {
    return {
      found: false,
      mappingEra: readMeta(methodsDb, "mappingEra"),
      notes: [`无法解析 ownerClass: ${opts.ownerClass}`],
    };
  }

  const csvRows = csvDb
    .prepare(
      "SELECT searge, name_named, descriptor_named FROM searge_methods WHERE name_named = ? LIMIT 40",
    )
    .all(memberName) as SeargeCsvRow[];
  if (csvRows.length === 0) return null;

  const hits: MethodRow[] = [];
  for (const csv of csvRows) {
    let row: MethodRow | undefined;
    if (descriptor) {
      row = methodsDb
        .prepare(
          `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
           FROM methods WHERE owner_named = ? AND name_named = ? AND descriptor_named = ? LIMIT 1`,
        )
        .get(ownerNamed, csv.searge, descriptor) as unknown as MethodRow | undefined;
    } else {
      const rows = methodsDb
        .prepare(
          `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
           FROM methods WHERE owner_named = ? AND name_named = ? LIMIT 20`,
        )
        .all(ownerNamed, csv.searge) as unknown as MethodRow[];
      if (rows.length > 1) {
        return {
          found: false,
          ambiguous: true,
          mappingEra: readMeta(methodsDb, "mappingEra"),
          candidates: rows.map((r) => ({
            name: memberName,
            descriptor: r.descriptor_named,
            official: r.name_official,
            intermediary: r.name_intermediary,
            owner: r.owner_named,
          })),
          notes: ["存在多个重载，请传入 descriptor"],
        };
      }
      row = rows[0];
    }
    if (row) {
      hits.push({
        ...row,
        name_named: memberName,
        descriptor_named: row.descriptor_named || csv.descriptor_named || "",
      });
    }
  }

  const era = readMeta(methodsDb, "mappingEra");
  // yarn-tiny methods.name_named 是 Yarn 名不是 searge：CSV 已确认 MCP named 后，用同名再查 methods。
  if (hits.length === 0) {
    let namedRow: MethodRow | undefined;
    if (descriptor) {
      namedRow = methodsDb
        .prepare(
          `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
           FROM methods WHERE owner_named = ? AND name_named = ? AND descriptor_named = ? LIMIT 1`,
        )
        .get(ownerNamed, memberName, descriptor) as unknown as MethodRow | undefined;
    } else {
      const namedRows = methodsDb
        .prepare(
          `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
           FROM methods WHERE owner_named = ? AND name_named = ? LIMIT 20`,
        )
        .all(ownerNamed, memberName) as unknown as MethodRow[];
      if (namedRows.length > 1) {
        return {
          found: false,
          ambiguous: true,
          source: "csv",
          mappingEra: era,
          candidates: namedRows.map((r) => ({
            name: memberName,
            descriptor: r.descriptor_named,
            official: r.name_official,
            intermediary: r.name_intermediary,
            owner: r.owner_named,
          })),
          notes: ["存在多个重载，请传入 descriptor"],
        };
      }
      namedRow = namedRows[0];
    }
    if (namedRow) {
      hits.push({
        ...namedRow,
        name_named: memberName,
        descriptor_named: namedRow.descriptor_named || csvRows[0]?.descriptor_named || "",
      });
    }
  }

  // CSV 有同名但该类无对应 searge/named 行 → 回退普通 methods（避免打断 yarn-tiny → mojang）
  if (hits.length === 0) {
    return null;
  }
  if (hits.length === 1) {
    return {
      found: true,
      source: "csv",
      row: hits[0],
      mappingEra: era,
      notes: descriptor ? undefined : ["CSV+methods 联合命中（MCP named→searge→obf）"],
    };
  }
  return {
    found: false,
    ambiguous: true,
    mappingEra: era,
    candidates: hits.map((r) => ({
      name: r.name_named,
      descriptor: r.descriptor_named,
      official: r.name_official,
      intermediary: r.name_intermediary,
      owner: r.owner_named,
    })),
    notes: ["同名 MCP 在该类下对应多条 searge/方法，请传入 descriptor 或改用 searge"],
  };
}

export function lookupMethod(
  version: string,
  opts: {
    ownerClass?: string;
    memberName: string;
    descriptor?: string;
    from: MappingLayer;
  },
): LookupMethodResult {
  const db = getYarnDb(version);
  const era = db ? readMeta(db, "mappingEra") : null;
  const csvDb = getCsvDb(version);
  const { memberName, descriptor, from } = opts;

  // SRG/TSRG + CSV：带 owner 的 MCP 可读名需经 searge 再查 methods
  if (opts.ownerClass && csvDb && db) {
    const via = lookupMethodViaCsvOwner(version, db, csvDb, {
      ownerClass: opts.ownerClass,
      memberName,
      descriptor,
      from,
    });
    if (via) return via;
  }

  // Prefer Forge mcp-csv for global searge↔named when no ownerClass
  // (even if fabric yarn-tiny exists for the same MC version).
  const useCsv = Boolean(csvDb) && !opts.ownerClass;
  if (useCsv && csvDb) {
    const isSearge = /^func_/.test(memberName) || /^field_/.test(memberName);
    // 仅用 Forge CSV 库自身的 methods（SRG/TSRG）；勿 join Fabric yarn-tiny
    const methodsDb = dbHasMethods(csvDb) ? csvDb : null;
    if (isSearge || from === "mojang") {
      const row = csvDb
        .prepare("SELECT searge, name_named, descriptor_named FROM searge_methods WHERE searge = ?")
        .get(memberName) as SeargeCsvRow | undefined;
      if (row) return methodRowFromCsv(csvDb, row, methodsDb);
    }
    if (!isSearge) {
      const rows = csvDb
        .prepare(
          "SELECT searge, name_named, descriptor_named FROM searge_methods WHERE name_named = ? LIMIT 20",
        )
        .all(memberName) as SeargeCsvRow[];
      if (rows.length === 1) {
        return methodRowFromCsv(csvDb, rows[0], methodsDb);
      }
      if (rows.length > 1) {
        return {
          found: false,
          ambiguous: true,
          mappingEra: "mcp-csv",
          candidates: rows.map((r) => ({
            name: r.name_named,
            descriptor: r.descriptor_named || "",
            official: r.searge,
          })),
          notes: ["CSV 同名多条 searge，请改用 searge 主键或传入 ownerClass"],
        };
      }
    }
  }

  // Explicit reject ownerClass against csv-only MCP layer（F-D203）：
  // 无 fabric yarn 库（era 即 mcp-csv）时维持原拒绝；
  // 全量数据（yarn-tiny 在场）时不抢断 yarn owner 路径，只在最终 miss 时附加 CSV 指引。
  const csvEra = csvDb ? readMeta(csvDb, "mappingEra") : null;
  const csvOwnerHint =
    "此版本 MCP 可读层仅有全局 searge↔name（无类路径）；带 owner 未命中时，可去掉 owner 用 searge（func_/field_）或 MCP named 全局查询";
  if (era === "mcp-csv" && opts.ownerClass) {
    return {
      found: false,
      mappingEra: era,
      resultKind: "csv-no-owner",
      notes: [
        "此版本仅有全局 searge↔name，无类路径；请用不带 owner 的 searge/named，或升级到 1.16+ Yarn",
      ],
    };
  }

  if (!db) {
    return {
      found: false,
      mappingEra: null,
      notes: [`未找到 yarn-mappings.sqlite（version=${version}）`],
    };
  }

  if (era === "mcp-csv") {
    return { found: false, mappingEra: era };
  }

  if (!opts.ownerClass) {
    return {
      found: false,
      mappingEra: era,
      notes: ["方法查询需要 ownerClass（CSV 时代除外）"],
    };
  }

  const ownerNamed = resolveOwnerClassNamed(
    version,
    opts.ownerClass,
    from === "parchment" ? "mcp" : from,
  );
  if (!ownerNamed) {
    return { found: false, mappingEra: era, notes: [`无法解析 ownerClass: ${opts.ownerClass}`] };
  }

  const fromOfficial = from === "mojang" || from === "obfuscated";
  const col = layerColumn(from);
  const colDesc = col === "name_official" ? "descriptor_official" : "descriptor_named";

  if (descriptor) {
    const row = db
      .prepare(
        `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
         FROM methods WHERE owner_named = ? AND ${col} = ? AND ${colDesc} = ? LIMIT 1`,
      )
      .get(ownerNamed, memberName, descriptor) as unknown as MethodRow | undefined;
    if (!row) {
      return {
        found: false,
        mappingEra: era,
        ...(csvEra === "mcp-csv" ? { notes: [csvOwnerHint] } : {}),
      };
    }
    return { found: true, source: "yarn-tiny", row, mappingEra: era };
  }

  const rows = db
    .prepare(
      `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
       FROM methods WHERE owner_named = ? AND ${col} = ? LIMIT 20`,
    )
    .all(ownerNamed, memberName) as unknown as MethodRow[];

  if (rows.length === 0) {
    return {
      found: false,
      mappingEra: era,
      ...(csvEra === "mcp-csv" ? { notes: [csvOwnerHint] } : {}),
    };
  }
  if (rows.length === 1) {
    return {
      found: true,
      source: "yarn-tiny",
      row: rows[0],
      mappingEra: era,
      notes: ["唯一重载，未提供 descriptor"],
    };
  }
  return {
    found: false,
    ambiguous: true,
    mappingEra: era,
    candidates: rows.map((r) => ({
      name: r.name_named,
      descriptor: r.descriptor_named,
      official: r.name_official,
      intermediary: r.name_intermediary,
      owner: r.owner_named,
    })),
    notes: ["存在多个重载，请传入 descriptor"],
  };
}

export function convertYarnMember(
  version: string,
  from: MappingLayer,
  to: MappingLayer,
  memberName: string,
): {
  found: boolean;
  converted: string | null;
  mappingType: "class";
  notes: string[];
  row?: YarnClassRow;
  ambiguous?: boolean;
} {
  const dbPath = resolveMappingDbPath(version);
  if (!dbPath) {
    return {
      found: false,
      converted: null,
      mappingType: "class",
      notes: [
        `未找到 yarn-mappings.sqlite（version=${version}）`,
        "请运行: node mcp-server/scripts/_lib/build-yarn-sqlite.mjs --all",
      ],
    };
  }

  if (from === "mojang" || from === "obfuscated") {
    const db = getYarnDb(version);
    if (db) {
      const officialHits = db
        .prepare("SELECT named, intermediary, official FROM classes WHERE official = ? LIMIT 2")
        .all(memberName) as unknown as YarnClassRow[];
      if (officialHits.length > 1) {
        return {
          found: false,
          converted: null,
          mappingType: "class",
          ambiguous: true,
          notes: [`classes.official 命中 ${officialHits.length} 条，拒绝静默取第一条`],
        };
      }
    }
  }

  const row = lookupYarnClass(version, memberName, from === "parchment" ? "mcp" : from);
  if (!row) {
    return {
      found: false,
      converted: null,
      mappingType: "class",
      notes: [`已在 mapping SQLite（${version}）中查询，未找到类: ${memberName}`],
    };
  }

  // yarn-tiny 库的 named 列是 Yarn 名：跨层到 mcp/parchment 若返回 yarn 名即假成功，拒绝。
  const era = getMappingEra(version);
  if (era === "yarn-tiny" && (to === "mcp" || to === "parchment")) {
    return {
      found: false,
      converted: null,
      mappingType: "class",
      notes: [
        `version=${version} 为 yarn-tiny 数据（named 列为 Yarn 名），无 MCP/Parchment 可读层，拒绝把 Yarn 名冒充 ${to} 名。`,
        "Mojang/Parchment 可读名请用 query_api / get_method_params；或改 to=yarn。",
      ],
    };
  }

  let converted = memberName;
  if (to === "yarn") converted = row.named;
  else if (to === "mojang" || to === "obfuscated") converted = row.official || memberName;
  else if (to === "intermediary") converted = row.intermediary || memberName;
  else if (to === "mcp" || to === "parchment") {
    converted = row.named;
  }
  if (converted.includes("/")) converted = toDot(converted);

  return {
    found: true,
    converted,
    mappingType: "class",
    row,
    notes: [
      `Yarn/mapping SQLite 类级命中（${version}）`,
      `named=${row.named}`,
      `intermediary=${row.intermediary}`,
      `official=${row.official ?? "(empty)"}`,
    ],
  };
}

export function yarnSqlitePath(version: string): string {
  return resolveMappingDbPath(version) ?? fabricSqlitePath(normalizeMcVersion(version)) ?? "";
}

export interface ObfuscatedHitRow {
  kind: "method" | "field";
  ownerClass: string; // named slash path
  yarn: string; // name_named
  official: string; // name_official（混淆短名）
  intermediary: string; // name_intermediary（method_6032 类）
  descriptor: string; // descriptor_named
}

export interface LookupByObfuscatedResult {
  found: boolean;
  rows?: ObfuscatedHitRow[];
  mappingEra?: string | null;
  notes?: string[];
}

/**
 * 全局反查（无需 ownerClass）：按 name_intermediary 或 name_official 命中方法/字段。
 * SRG 风格（func_/field_）优先走 Forge CSV searge 表（1.14–1.15 等）。
 */
export function lookupByObfuscated(
  version: string,
  token: string,
  kind: "method" | "field",
): LookupByObfuscatedResult {
  const era = getMappingEra(version);
  const isSrg = kind === "method" ? /^func_\d+_[a-zA-Z]+$/.test(token) : /^field_\d+_[a-zA-Z]+$/.test(token);

  // SRG → Forge CSV searge 表全局反查
  if (isSrg) {
    const csvDb = getCsvDb(version);
    if (csvDb) {
      const table = kind === "method" ? "searge_methods" : "searge_fields";
      try {
        const rows = csvDb
          .prepare(`SELECT searge, name_named, descriptor_named FROM ${table} WHERE searge = ? LIMIT 20`)
          .all(token) as Array<{ searge: string; name_named: string; descriptor_named: string | null }>;
        if (rows.length > 0) {
          return {
            found: true,
            mappingEra: era ?? "mcp-csv",
            rows: rows.map((r) => ({
              kind,
              ownerClass: "",
              yarn: r.name_named,
              official: r.searge,
              intermediary: "",
              descriptor: r.descriptor_named ?? "",
            })),
          };
        }
      } catch {
        /* no searge table — fall through */
      }
    }
  }

  const db = getYarnDb(version);
  if (!db) {
    return {
      found: false,
      mappingEra: era,
      notes: [`未找到 yarn-mappings.sqlite（version=${version}）`],
    };
  }

  const table = kind === "method" ? "methods" : "fields";
  let rows: Array<{
    owner_named: string;
    name_named: string;
    descriptor_named: string | null;
    name_official: string;
    name_intermediary: string | null;
  }>;
  try {
    rows = db
      .prepare(
        `SELECT owner_named, name_named, descriptor_named, name_official, name_intermediary
         FROM ${table} WHERE name_intermediary = ?
         UNION
         SELECT owner_named, name_named, descriptor_named, name_official, name_intermediary
         FROM ${table} WHERE name_official = ?
         LIMIT 20`,
      )
      .all(token, token) as unknown as Array<{
      owner_named: string;
      name_named: string;
      descriptor_named: string | null;
      name_official: string;
      name_intermediary: string | null;
    }>;
  } catch {
    return {
      found: false,
      mappingEra: era,
      notes: [`${kind} 表不可用（schema v2 无 ${table}）`],
    };
  }

  if (rows.length === 0) return { found: false, mappingEra: era };
  return {
    found: true,
    mappingEra: era,
    rows: rows.map((r) => ({
      kind,
      ownerClass: r.owner_named,
      yarn: r.name_named,
      official: r.name_official,
      intermediary: r.name_intermediary ?? "",
      descriptor: r.descriptor_named ?? "",
    })),
  };
}
