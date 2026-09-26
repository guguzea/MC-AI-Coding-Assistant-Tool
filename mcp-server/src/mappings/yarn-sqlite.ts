/**
 * Lazy, read-only mapping lookup via prebuilt SQLite (schema v2/v3/v4).
 *
 * HARD RULE: never readFileSync / JSON.parse yarn-mappings.json in this module.
 * schema v3 adds fields / searge_fields; v4 adds single-column name_official /
 * name_intermediary indexes. Runtime openDbCached is readOnly — never CREATE INDEX.
 * v2 remains readable for class/method.
 */

import { existsSync } from "fs";
import type { DatabaseSync } from "node:sqlite";
import { openDatabaseSync } from "../utils/sqlite-runtime.js";
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
  const db = openDatabaseSync(dbPath, { readOnly: true });
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
    const db = openDatabaseSync(dbPath, { readOnly: true });
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

/**
 * 「同一个 MC 版本既有 Fabric 库又有 Forge 库」时该开哪一份（2026-09-26 未做③带出的真缺陷）。
 * 修前 `resolveMappingDbPath` 恒先取 fabric，只要 fabric 的 methods>0 就定案 ⇒ 问
 * 「Forge 1.20.4 的 `makeExecutor` 对应哪个 SRG 名」会被 Fabric 的 yarn-tiny 库回答，
 * 而那份库的 `name_official` 是 notch 短名、根本没有 mojmap 可读名 ⇒ 报 NOT_FOUND 并给出
 * **Yarn** 相似名（实测 suggestions 里是 `makeIoExecutor`）。这是假阴性，不是「该档没数据」。
 * 默认（不传）= 旧行为逐字不变，只有显式给了加载器才改判，免得打断按旧形状工作的消费者。
 */
export type MappingDbPreference = "fabric" | "forge";

/** Resolve best sqlite path for version (fabric preferred when useful). */
export function resolveMappingDbPath(
  version: string,
  prefer?: MappingDbPreference | null,
): string | null {
  const v = normalizeMcVersion(version);

  // A-39：先校验再查缓存 —— 非法版本段（含路径穿越）不允许作为 key 触到 _pathCache，
  // 直接无库可解析，走上层 NOT_FOUND 降级。
  if (!isSafeVersionSegment(v)) return null;
  const cacheKey = `${v}|${prefer ?? "-"}`;
  if (_pathCache.has(cacheKey)) return _pathCache.get(cacheKey) ?? null;
  const fabric = fabricSqlitePath(v);
  const forge = forgeSqlitePath(v);
  if (!fabric || !forge) return null;

  let chosen: string | null = null;
  // 显式要 Forge 线：forge 库里有货（有成员行或有 searge 层）就定它，读不到才回落 fabric。
  if (prefer === "forge" && existsSync(forge)) {
    try {
      const usable = withReadOnlyDb(forge, (db) => methodCountOf(db) > 0);
      if (usable) chosen = forge;
    } catch {
      chosen = null;
    }
  }
  if (!chosen && fabric && existsSync(fabric)) {
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
  if (chosen === fabric && existsSync(forge) && prefer !== "forge") {
    try {
      const fabMc = withReadOnlyDb(fabric, methodCountOf);
      const forgeMc = withReadOnlyDb(forge, methodCountOf);
      if (fabMc === 0 && forgeMc > 0) chosen = forge;
    } catch {
      /* keep fabric */
    }
  }

  _pathCache.set(cacheKey, chosen);
  return chosen;
}

/**
 * Forge sqlite with searge_methods for searge↔named (mcp-csv era, or SRG/TSRG + CSV layer).
 *
 * ⚠️ `mcp-config-srg`（1.17+ 从 MCPConfig 灌进来的那份，named 列 = `m_/f_`）**只在调用方显式要
 * Forge 那份时才算数**：否则一份纯 Forge 的库会去替「没声明平台的 Fabric 查询」回答 `to=mcp`，
 * 把 test-core:653 钉着的 `YARN_TINY_NO_MCP_LAYER` 契约悄悄改掉；而 1.14.4/1.15.2 的
 * `mcp-csv` 并存回答 MCP 是既有契约（test-core:1280），不能反向砍掉。
 */
export function resolveCsvMappingDbPath(
  version: string,
  prefer?: MappingDbPreference | null,
): string | null {
  const v = normalizeMcVersion(version);
  // A-39 同口径：校验先于缓存读，非法版本段不得作为 _csvPathCache 的 key。
  if (!isSafeVersionSegment(v)) return null;
  const cacheKey = `${v}|${prefer ?? "-"}`;
  if (_csvPathCache.has(cacheKey)) return _csvPathCache.get(cacheKey) ?? null;
  const forge = forgeSqlitePath(v);
  let chosen: string | null = null;
  if (forge && existsSync(forge)) {
    try {
      chosen = withReadOnlyDb(forge, (db) => {
        const era = readMeta(db, "mappingEra");
        if (era === "mcp-config-srg" && prefer !== "forge") return null;
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
  _csvPathCache.set(cacheKey, chosen);
  return chosen;
}

export function getYarnDb(version: string, prefer?: MappingDbPreference | null): MappingDb | null {
  const dbPath = resolveMappingDbPath(version, prefer);
  if (!dbPath || !existsSync(dbPath)) return null;
  return openDbCached(dbPath);
}

export function getCsvDb(version: string, prefer?: MappingDbPreference | null): MappingDb | null {
  const dbPath = resolveCsvMappingDbPath(version, prefer);
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

/**
 * 映射层名：obfuscated = Tiny official 混淆短名（er）；intermediary = method_6032 类。
 * A4d（2026-09-26）：另收 Linkie 侧扩展 namespace 名 —— 它们**不在支持面**，仅让 `convert_mapping`
 * 入口能「拒绝 + 指路」（`convert.ts` 的 `unsupportedNamespaceResult` 在任何查表逻辑之前 early-return）；
 * 其余调用方（lookup* / convertYarnMember）对它们永不命中。
 */
export type MappingLayer =
  | "mojang"
  | "mcp"
  | "yarn"
  | "parchment"
  | "obfuscated"
  | "intermediary"
  | "legacy-yarn"
  | "barn"
  | "feather"
  | "plasma"
  | "yarrn"
  | "quilt-mappings";

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

export function getMappingEra(version: string, prefer?: MappingDbPreference | null): string | null {
  const db = getYarnDb(version, prefer);
  if (!db) return null;
  return readMeta(db, "mappingEra");
}

export function getSchemaVersion(version: string, prefer?: MappingDbPreference | null): string | null {
  const db = getYarnDb(version, prefer);
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
    /** 同版本两侧都有库时该开哪一份（Forge 查询必须显式给 "forge"，见 resolveMappingDbPath 注）。 */
    preferPlatform?: MappingDbPreference | null;
  },
): LookupFieldResult {
  const db = getYarnDb(version, opts.preferPlatform);
  const era = db ? readMeta(db, "mappingEra") : null;
  const schema = db ? readMeta(db, "schemaVersion") : null;
  const csvDb = getCsvDb(version, opts.preferPlatform);
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
        "请运行 npm run build:yarn-sqlite 重建为 schema v4",
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
    opts.preferPlatform,
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

/** 查表层原语接受的层名（= A4d 之前的 MappingLayer 值集）；Linkie 扩展名在入口已被拒，永不抵达查表层。 */
export type LookupLayer = "yarn" | "mojang" | "mcp" | "parchment" | "obfuscated" | "intermediary";

export function lookupYarnClass(
  version: string,
  memberName: string,
  from: LookupLayer,
  prefer?: MappingDbPreference | null,
): YarnClassRow | null {
  const db = getYarnDb(version, prefer);
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
  prefer?: MappingDbPreference | null,
): string | null {
  // A4d：Linkie 扩展名已在 convertMapping 入口 early-return；此处 from 必在支持面（cast 收敛到 LookupLayer）。
  const row = lookupYarnClass(version, ownerClass, (from === "parchment" ? "mcp" : from) as LookupLayer, prefer);
  if (row) return row.named;
  const db = getYarnDb(version, prefer);
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
    preferPlatform?: MappingDbPreference | null;
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
    opts.preferPlatform,
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
    /** 同版本两侧都有库时该开哪一份（Forge 查询必须显式给 "forge"，见 resolveMappingDbPath 注）。 */
    preferPlatform?: MappingDbPreference | null;
  },
): LookupMethodResult {
  const db = getYarnDb(version, opts.preferPlatform);
  const era = db ? readMeta(db, "mappingEra") : null;
  const csvDb = getCsvDb(version, opts.preferPlatform);
  const { memberName, descriptor, from } = opts;

  // SRG/TSRG + CSV：带 owner 的 MCP 可读名需经 searge 再查 methods
  if (opts.ownerClass && csvDb && db) {
    const via = lookupMethodViaCsvOwner(version, db, csvDb, {
      ownerClass: opts.ownerClass,
      memberName,
      descriptor,
      from,
      preferPlatform: opts.preferPlatform,
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
    opts.preferPlatform,
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
        "请运行: node mcp-server/scripts/_lib/build-yarn-sqlite.mjs --all --write（该脚本默认 dryRun，不带 --write 只打印计划）",
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

  // A4d：同上——Linkie 扩展名已 early-return，此处必在支持面。
  const row = lookupYarnClass(version, memberName, (from === "parchment" ? "mcp" : from) as LookupLayer);
  if (!row) {
    return {
      found: false,
      converted: null,
      mappingType: "class",
      notes: [`已在 mapping SQLite（${version}）中查询，未找到类: ${memberName}`],
    };
  }

  // yarn-tiny 库的 named 列是 Yarn 名：跨层到 mcp/parchment 若返回 yarn 名即假成功，拒绝。
  // F131：from 侧同理——lookupYarnClass 对 mcp/parchment 输入会回落到 named 列，
  // 命中即把 Yarn 名当 MCP/Parchment 名用，故两侧一律拒绝（成员级 MCP 走 CSV/searge，不经此路）。
  const era = getMappingEra(version);
  const mcpLayerSide = to === "mcp" || to === "parchment" ? "to" : from === "mcp" || from === "parchment" ? "from" : null;
  if (era === "yarn-tiny" && mcpLayerSide) {
    const layer = mcpLayerSide === "to" ? to : from;
    return {
      found: false,
      converted: null,
      mappingType: "class",
      notes: [
        mcpLayerSide === "to"
          ? `version=${version} 为 yarn-tiny 数据（named 列为 Yarn 名），无 MCP/Parchment 可读层，拒绝把 Yarn 名冒充 ${layer} 名。`
          : `version=${version} 为 yarn-tiny 数据（named 列为 Yarn 名），无 MCP/Parchment 类层，拒绝把 ${layer} 类名拿去命中 Yarn 名列。`,
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

/**
 * S1′（2026-09-25 用户裁定：挂在兼容工具 query_api 上，不开新工具）：
 * 在盘映射索引的「名字存在性 + 成员名单」探针 —— api-index 未命中时的第二档出处。
 *
 * 它只回答「这个名字在该档的映射里到底有没有一个类叫它」，**不回答签名/用法**，
 * 所以返回里恒带 `mappingEra`：`yarn-tiny` 的 named 是 Yarn 名，而 `forge-srg` /
 * `tsrg` / `mcp-csv` 的 named 是 MCP `func_/field_` 名（AGENTS「文件名里的 yarn 会骗人」）。
 * 空 classes 表 ⇒ 返回 null（不给空库背书，与 assert-skill-yarn-attest 的双闸同口径）。
 */
export interface MappingsNameProbe {
  exists: boolean;
  matchKind: "exact" | "simple-unique" | "ambiguous" | "contains" | "none";
  named: string | null;
  intermediary: string | null;
  official: string | null;
  mappingEra: string;
  dbKind: "fabric" | "forge";
  candidates: string[];
  truncated: boolean;
  memberCounts: { methods: number; fields: number };
  memberSample: Array<{ kind: "method" | "field"; name: string; descriptor: string; official: string | null }>;
}

const PROBE_LIMIT_DEFAULT = 8;
const MEMBER_SAMPLE_MAX = 12;

function likeEscaped(s: string): string {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`).toLowerCase();
}

function namedColumnForms(name: string): [string, string] {
  return [toSlash(name), toDot(name)];
}

export function mappingsNameProbe(
  version: string,
  className: string,
  limit = PROBE_LIMIT_DEFAULT,
): MappingsNameProbe | null {
  if (!className?.trim()) return null;
  const db = getYarnDb(version);
  if (!db) return null;

  let classRows = 0;
  try {
    classRows = (db.prepare("SELECT COUNT(*) AS c FROM classes").get() as { c: number }).c;
  } catch {
    return null;
  }
  if (classRows === 0) return null;

  const era = readMeta(db, "mappingEra") ?? "";
  const dbKind: "fabric" | "forge" = /[\\/]fabric_/.test(resolveMappingDbPath(version) ?? "")
    ? "fabric"
    : "forge";
  const cap = Math.min(Math.max(1, limit), 40);
  const base: Omit<MappingsNameProbe, "exists" | "matchKind" | "named" | "intermediary" | "official" | "candidates" | "truncated" | "memberCounts" | "memberSample"> = {
    mappingEra: era,
    dbKind,
  };

  const readRow = (sql: string, params: unknown[]) => {
    try {
      return db.prepare(sql).all(...(params as never[])) as unknown as Array<{
        named: string;
        intermediary: string | null;
        official: string | null;
      }>;
    } catch {
      return [];
    }
  };
  const COLS = "named, intermediary, official FROM classes";

  const [slash, dot] = namedColumnForms(className);
  let matchKind: MappingsNameProbe["matchKind"] = "none";
  let hits: Array<{ named: string; intermediary: string | null; official: string | null }> = [];
  let truncated = false;

  hits = readRow(`SELECT ${COLS} WHERE named = ? OR named = ? LIMIT 2`, [slash, dot]);
  if (hits.length > 0) matchKind = "exact";

  const simple = simpleClassName(className);
  if (!hits.length && simple) {
    const bySimple = readRow(`SELECT ${COLS} WHERE named = ? OR named GLOB ? LIMIT ?`, [
      simple,
      `*/${globLiteral(simple)}`,
      cap + 1,
    ]);
    if (bySimple.length === 1) {
      hits = bySimple;
      matchKind = "simple-unique";
    } else if (bySimple.length > 1) {
      return {
        ...base,
        exists: true,
        matchKind: "ambiguous",
        named: null,
        intermediary: null,
        official: null,
        candidates: bySimple.slice(0, cap).map((r) => r.named),
        truncated: bySimple.length > cap,
        memberCounts: { methods: 0, fields: 0 },
        memberSample: [],
      };
    }
  }

  if (!hits.length) {
    const needle = `%${likeEscaped(simple || slash)}%`;
    const byContains = readRow(
      `SELECT ${COLS} WHERE lower(named) LIKE ? ESCAPE '\\' ORDER BY length(named) LIMIT ?`,
      [needle, cap + 1],
    );
    truncated = byContains.length > cap;
    hits = byContains.slice(0, cap);
    if (hits.length) matchKind = "contains";
  }

  if (!hits.length) {
    return {
      ...base,
      exists: false,
      matchKind: "none",
      named: null,
      intermediary: null,
      official: null,
      candidates: [],
      truncated,
      memberCounts: { methods: 0, fields: 0 },
      memberSample: [],
    };
  }

  const hit = hits[0];
  const counts = { methods: 0, fields: 0 };
  const sample: MappingsNameProbe["memberSample"] = [];
  const ownerForms = namedColumnForms(hit.named);
  const countOf = (table: string) => {
    try {
      return (
        db.prepare(`SELECT COUNT(*) AS c FROM ${table} WHERE owner_named = ? OR owner_named = ?`)
          .get(ownerForms[0], ownerForms[1]) as { c: number }
      ).c;
    } catch {
      return 0;
    }
  };
  const membersOf = (table: string, kind: "method" | "field", max: number) => {
    try {
      return db
        .prepare(
          `SELECT name_named, descriptor_named, name_official FROM ${table} WHERE owner_named = ? OR owner_named = ? ORDER BY name_named LIMIT ?`,
        )
        .all(ownerForms[0], ownerForms[1], max) as unknown as Array<{
        name_named: string;
        descriptor_named: string | null;
        name_official: string | null;
      }>;
    } catch {
      return [];
    }
  };

  counts.methods = countOf("methods");
  counts.fields = dbHasFieldsTable(db) ? countOf("fields") : 0;
  for (const m of membersOf("methods", "method", MEMBER_SAMPLE_MAX)) {
    sample.push({ kind: "method", name: m.name_named, descriptor: m.descriptor_named ?? "", official: m.name_official ?? null });
  }
  for (const f of membersOf("fields", "field", Math.max(0, MEMBER_SAMPLE_MAX - sample.length))) {
    sample.push({ kind: "field", name: f.name_named, descriptor: f.descriptor_named ?? "", official: f.name_official ?? null });
  }

  return {
    ...base,
    exists: true,
    matchKind,
    named: hit.named,
    intermediary: hit.intermediary ?? null,
    official: hit.official ?? null,
    candidates: hits.slice(1).map((r) => r.named),
    truncated,
    memberCounts: counts,
    memberSample: sample,
  };
}
