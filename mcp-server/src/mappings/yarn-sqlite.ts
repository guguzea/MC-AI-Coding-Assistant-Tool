/**
 * Lazy, read-only mapping lookup via prebuilt SQLite (schema v2).
 *
 * HARD RULE: never readFileSync / JSON.parse yarn-mappings.json in this module.
 */

import { existsSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import { resolveDataDir } from "../utils/path.js";

type MappingDb = DatabaseSync;

const _dbs = new Map<string, MappingDb>();
const _pathCache = new Map<string, string | null>();

export function normalizeMcVersion(input: string): string {
  let v = input.trim();
  if (!v) throw new Error("empty version");
  v = v.replace(/^forge_/i, "").replace(/^fabric_/i, "").replace(/^v/i, "");
  return v;
}

function fabricSqlitePath(version: string): string {
  return resolveDataDir(`fabric_${version}`, "mappings", "yarn-mappings.sqlite");
}

function forgeSqlitePath(version: string): string {
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

/** Resolve best sqlite path for version (fabric preferred when useful). */
export function resolveMappingDbPath(version: string): string | null {
  const v = normalizeMcVersion(version);
  if (_pathCache.has(v)) return _pathCache.get(v) ?? null;

  const fabric = fabricSqlitePath(v);
  const forge = forgeSqlitePath(v);

  let chosen: string | null = null;
  if (existsSync(fabric)) {
    try {
      const db = new DatabaseSync(fabric, { readOnly: true });
      const era = readMeta(db, "mappingEra") || "";
      const mc = methodCountOf(db);
      db.close();
      if (mc > 0 || era === "yarn-tiny") chosen = fabric;
    } catch {
      chosen = fabric;
    }
  }
  if (!chosen && existsSync(forge)) {
    chosen = forge;
  }
  // If fabric exists but methodCount=0 and forge has methods, prefer forge
  if (chosen === fabric && existsSync(forge)) {
    try {
      const fdb = new DatabaseSync(fabric, { readOnly: true });
      const fabMc = methodCountOf(fdb);
      fdb.close();
      const gdb = new DatabaseSync(forge, { readOnly: true });
      const forgeMc = methodCountOf(gdb);
      gdb.close();
      if (fabMc === 0 && forgeMc > 0) chosen = forge;
    } catch {
      /* keep fabric */
    }
  }

  _pathCache.set(v, chosen);
  return chosen;
}

export function getYarnDb(version: string): MappingDb | null {
  const v = normalizeMcVersion(version);
  const cached = _dbs.get(v);
  if (cached) return cached;
  const dbPath = resolveMappingDbPath(v);
  if (!dbPath || !existsSync(dbPath)) return null;
  const db = new DatabaseSync(dbPath, { readOnly: true });
  _dbs.set(v, db);
  return db;
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
}

export function yarnDbIsOpen(version: string): boolean {
  return _dbs.has(normalizeMcVersion(version));
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

export function lookupYarnClass(
  version: string,
  memberName: string,
  from: "yarn" | "mojang" | "mcp" | "parchment",
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

  if (from === "mojang") {
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
      .all(simple, `*/${simple}`) as unknown as YarnClassRow[];
    const picked = pickBestCandidate(memberName, candidates);
    if (picked) return picked;
  }

  return null;
}

/** Resolve owner to named slash path using an already-open version. */
export function resolveOwnerClassNamed(
  version: string,
  ownerClass: string,
  from: "yarn" | "mojang" | "mcp" | "parchment",
): string | null {
  const row = lookupYarnClass(version, ownerClass, from === "parchment" ? "mcp" : from);
  if (row) return row.named;
  const db = getYarnDb(version);
  if (!db) return null;
  const slash = toSlash(ownerClass);
  const hit = db
    .prepare("SELECT named FROM classes WHERE named = ? LIMIT 1")
    .get(slash) as { named: string } | undefined;
  return hit?.named ?? slash;
}

export function lookupMethod(
  version: string,
  opts: {
    ownerClass?: string;
    memberName: string;
    descriptor?: string;
    from: "mojang" | "mcp" | "yarn" | "parchment";
  },
): LookupMethodResult {
  const db = getYarnDb(version);
  const era = db ? readMeta(db, "mappingEra") : null;
  if (!db) {
    return {
      found: false,
      mappingEra: null,
      notes: [`未找到 yarn-mappings.sqlite（version=${version}）`],
    };
  }

  const { memberName, descriptor, from } = opts;

  // CSV era
  if (era === "mcp-csv") {
    if (opts.ownerClass) {
      return {
        found: false,
        mappingEra: era,
        resultKind: "csv-no-owner",
        notes: [
          "此版本仅有全局 searge↔name，无类路径；请用不带 owner 的 searge/named，或升级到 1.16+ Yarn",
        ],
      };
    }
    const isSearge = /^func_/.test(memberName) || /^field_/.test(memberName);
    if (isSearge || from === "mojang") {
      const row = db
        .prepare("SELECT searge, name_named, descriptor_named FROM searge_methods WHERE searge = ?")
        .get(memberName) as
        | { searge: string; name_named: string; descriptor_named: string }
        | undefined;
      if (!row) return { found: false, mappingEra: era };
      return {
        found: true,
        mappingEra: era,
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
    // named → searge
    const rows = db
      .prepare(
        "SELECT searge, name_named, descriptor_named FROM searge_methods WHERE name_named = ? LIMIT 20",
      )
      .all(memberName) as Array<{ searge: string; name_named: string; descriptor_named: string }>;
    if (rows.length === 0) return { found: false, mappingEra: era };
    if (rows.length > 1) {
      return {
        found: false,
        ambiguous: true,
        mappingEra: era,
        candidates: rows.map((r) => ({
          name: r.name_named,
          descriptor: r.descriptor_named || "",
          official: r.searge,
        })),
        notes: ["CSV 同名多条 searge，请改用 searge 主键查询"],
      };
    }
    const row = rows[0];
    return {
      found: true,
      mappingEra: era,
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

  const fromOfficial = from === "mojang";

  if (descriptor) {
    const row = (
      fromOfficial
        ? db
            .prepare(
              `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
               FROM methods WHERE owner_named = ? AND name_official = ? AND descriptor_official = ? LIMIT 1`,
            )
            .get(ownerNamed, memberName, descriptor)
        : db
            .prepare(
              `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
               FROM methods WHERE owner_named = ? AND name_named = ? AND descriptor_named = ? LIMIT 1`,
            )
            .get(ownerNamed, memberName, descriptor)
    ) as unknown as MethodRow | undefined;
    if (!row) return { found: false, mappingEra: era };
    return { found: true, row, mappingEra: era };
  }

  const rows = (
    fromOfficial
      ? db
          .prepare(
            `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
             FROM methods WHERE owner_named = ? AND name_official = ? LIMIT 20`,
          )
          .all(ownerNamed, memberName)
      : db
          .prepare(
            `SELECT owner_named, name_named, descriptor_named, name_official, descriptor_official, name_intermediary
             FROM methods WHERE owner_named = ? AND name_named = ? LIMIT 20`,
          )
          .all(ownerNamed, memberName)
  ) as unknown as MethodRow[];

  if (rows.length === 0) return { found: false, mappingEra: era };
  if (rows.length === 1) {
    return {
      found: true,
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
  from: "mojang" | "mcp" | "yarn" | "parchment",
  to: "mojang" | "mcp" | "yarn" | "parchment",
  memberName: string,
): {
  found: boolean;
  converted: string | null;
  mappingType: "class";
  notes: string[];
  row?: YarnClassRow;
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

  const row = lookupYarnClass(version, memberName, from === "parchment" ? "mcp" : from);
  if (!row) {
    return {
      found: false,
      converted: null,
      mappingType: "class",
      notes: [`已在 mapping SQLite（${version}）中查询，未找到类: ${memberName}`],
    };
  }

  let converted = memberName;
  if (to === "yarn") converted = row.named;
  else if (to === "mojang") converted = row.official || memberName;
  else if (to === "mcp" || to === "parchment") {
    // Prefer named (readable) for mcp/parchment when available from yarn-tiny
    converted = row.named.includes("/") ? toDot(row.named) : row.named;
  }

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
  return resolveMappingDbPath(version) ?? fabricSqlitePath(normalizeMcVersion(version));
}
