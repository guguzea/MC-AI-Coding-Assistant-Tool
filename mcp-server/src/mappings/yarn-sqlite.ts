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
  // 至少命中包路径中的 2 个 token（例如 net + minecraft，或 block + Block）
  if (best && bestScore >= 2) return best;

  const mcOnly = candidates.filter((c) => c.named.startsWith("net/minecraft/"));
  if (mcOnly.length === 1) return mcOnly[0];

  return null;
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

  // Fallback named lookup (exact)
  const byNamed2 = db
    .prepare("SELECT named, intermediary, official FROM classes WHERE named = ? OR named = ? LIMIT 1")
    .get(slash, dot) as YarnClassRow | undefined;
  if (byNamed2) return byNamed2;

  // 简短类名 / Mojang 映射 FQN：按简单名后缀匹配，再用包路径打分消歧
  const simple = simpleClassName(memberName);
  if (simple && simple !== slash) {
    const candidates = db
      .prepare(
        "SELECT named, intermediary, official FROM classes WHERE named = ? OR named GLOB ? LIMIT 40",
      )
      .all(simple, `*/${simple}`) as unknown as YarnClassRow[];
    const picked = pickBestCandidate(memberName, candidates);
    if (picked) return picked;
  } else if (simple && !slash.includes("/")) {
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
    const simple = simpleClassName(memberName);
    const db = getYarnDb(version);
    let candidates: string[] = [];
    if (db && simple) {
      candidates = (
        db
          .prepare("SELECT named FROM classes WHERE named = ? OR named GLOB ? LIMIT 8")
          .all(simple, `*/${simple}`) as Array<{ named: string }>
      ).map((r) => r.named);
    }
    return {
      found: false,
      converted: memberName,
      mappingType: "class",
      notes: [
        `已在 yarn SQLite（${version}）中查询，未找到: ${memberName}`,
        "提示：Yarn 侧优先用路径形式（net/minecraft/block/Block）或简单类名（Block）。",
        "提示：与 Yarn 互转时，mojang 列是官方混淆名（如 cpn），不是 Mojang 映射全名；也可用简单类名/包路径启发式匹配。",
        candidates.length > 0
          ? `候选: ${candidates.join(", ")}`
          : "提示：当前索引覆盖类级映射（named / intermediary / official）。",
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
      "说明：返回的 mojang/official 为混淆短名；Yarn named 为斜杠路径。",
      "运行时未加载 yarn-mappings.json。",
    ],
  };
}

/** Path probe for diagnostics — does not open the DB. */
export function yarnSqlitePath(version: string): string {
  return sqlitePathForVersion(version);
}
