/**
 * Lazy, read-only Yarn mapping lookup via prebuilt SQLite.
 *
 * HARD RULE: never readFileSync / JSON.parse yarn-mappings.json in this module.
 */

import { existsSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import { resolveDataDir } from "../utils/path.js";

type YarnDb = DatabaseSync;

const _dbs = new Map<string, YarnDb>();

function sqlitePathForVersion(version: string): string {
  return resolveDataDir(`fabric_${version}`, "mappings", "yarn-mappings.sqlite");
}

/** Open (or reuse) a readonly yarn DB for a MC version. Does not open at module load. */
export function getYarnDb(version: string): YarnDb | null {
  const cached = _dbs.get(version);
  if (cached) return cached;
  const dbPath = sqlitePathForVersion(version);
  if (!existsSync(dbPath)) return null;
  const db = new DatabaseSync(dbPath, { readOnly: true });
  _dbs.set(version, db);
  return db;
}

/** Test helper: close all lazy DBs. */
export function closeAllYarnDbs(): void {
  for (const db of _dbs.values()) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
  }
  _dbs.clear();
}

export function yarnDbIsOpen(version: string): boolean {
  return _dbs.has(version);
}

function toSlash(name: string): string {
  return name.replace(/\./g, "/");
}

function toDot(name: string): string {
  return name.replace(/\//g, ".");
}

export interface YarnClassRow {
  named: string;
  intermediary: string;
  official: string | null;
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

  // intermediary / mcp-style class_NNN or slash path
  const byInter = db
    .prepare(
      "SELECT named, intermediary, official FROM classes WHERE intermediary = ? OR intermediary = ? LIMIT 1",
    )
    .get(slash, dot) as YarnClassRow | undefined;
  if (byInter) return byInter;

  // Fallback named lookup
  const byNamed2 = db
    .prepare("SELECT named, intermediary, official FROM classes WHERE named = ? OR named = ? LIMIT 1")
    .get(slash, dot) as YarnClassRow | undefined;
  return byNamed2 ?? null;
}

export function convertYarnMember(
  version: string,
  from: "mojang" | "mcp" | "yarn" | "parchment",
  to: "mojang" | "mcp" | "yarn" | "parchment",
  memberName: string,
): {
  found: boolean;
  converted: string;
  mappingType: "class";
  notes: string[];
  row?: YarnClassRow;
} {
  const dbPath = sqlitePathForVersion(version);
  if (!existsSync(dbPath)) {
    return {
      found: false,
      converted: memberName,
      mappingType: "class",
      notes: [
        `未找到 yarn-mappings.sqlite：${dbPath}`,
        "请运行: node mcp-server/scripts/_lib/build-yarn-sqlite.mjs --all",
        "禁止运行时解析 yarn-mappings.json（会导致内存峰值 >1.5GB）。",
      ],
    };
  }

  const row = lookupYarnClass(version, memberName, from === "parchment" ? "mcp" : from);
  if (!row) {
    return {
      found: false,
      converted: memberName,
      mappingType: "class",
      notes: [
        `已在 yarn SQLite（${version}）中查询，未找到: ${memberName}`,
        "提示：当前索引覆盖类级映射（named / intermediary / official）。",
      ],
    };
  }

  let converted = memberName;
  if (to === "yarn") converted = row.named;
  else if (to === "mojang") converted = row.official || memberName;
  else converted = row.intermediary; // mcp / parchment ≈ intermediary bridge for yarn side

  return {
    found: true,
    converted,
    mappingType: "class",
    row,
    notes: [
      `✅ Yarn SQLite 点查成功（${version}）`,
      `named=${row.named}`,
      `intermediary=${row.intermediary}`,
      `official=${row.official ?? "(empty)"}`,
      "运行时未加载 yarn-mappings.json。",
    ],
  };
}

/** Path probe for diagnostics — does not open the DB. */
export function yarnSqlitePath(version: string): string {
  return sqlitePathForVersion(version);
}
