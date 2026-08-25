import { existsSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import { vanillaRegistrySqlitePath, buildRegistryIndex } from "./builder.js";

const _cache = new Map<string, DatabaseSync>();

function openRegistryDb(version: string): DatabaseSync | null {
  const path = vanillaRegistrySqlitePath(version);
  if (!existsSync(path)) {
    try {
      buildRegistryIndex(version);
    } catch {
      return null;
    }
  }
  if (!existsSync(path)) return null;
  if (_cache.has(path)) return _cache.get(path)!;
  const db = new DatabaseSync(path, { readOnly: true });
  _cache.set(path, db);
  return db;
}

export interface RegistryMatch {
  registry: string;
  id: string;
  translationKey?: string | null;
}

function rankRegistryMatch(id: string, q: string): number {
  const lower = id.toLowerCase();
  const colon = lower.indexOf(":");
  const path = colon >= 0 ? lower.slice(colon + 1) : lower;
  if (lower === q || lower === `minecraft:${q}`) return 0;
  if (path === q) return 1;
  if (path.startsWith(q + "_") || path.startsWith(q + "/")) return 2;
  if (path.startsWith(q) || path.endsWith("/" + q)) return 3;
  return 4;
}

export function searchRegistryEntries(
  version: string,
  registry: string | undefined,
  query: string,
  limit = 25,
): RegistryMatch[] {
  const db = openRegistryDb(version);
  if (!db) return [];
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // 剥掉 % LIKE 通配符；保留 `_` 并转义为字面量（P3-094）
  const like = `%${q.replace(/%/g, "").replace(/_/g, "\\_")}%`;
  const exactNs = q.includes(":") ? q : `minecraft:${q}`;
  const exactSql = registry
    ? `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE registry = ? AND (LOWER(id) = ? OR LOWER(id) = ?)`
    : `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE LOWER(id) = ? OR LOWER(id) = ?`;
  const exactRows = (
    registry
      ? (db.prepare(exactSql).all(registry, q, exactNs) as unknown as RegistryMatch[])
      : (db.prepare(exactSql).all(q, exactNs) as unknown as RegistryMatch[])
  );

  const fetchLimit = Math.max(limit * 8, 200);
  const likeRows = registry
    ? (db
        .prepare(
          `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE registry = ? AND (LOWER(id) LIKE ? ESCAPE '\\' OR LOWER(COALESCE(translation_key,'')) LIKE ? ESCAPE '\\')
         ORDER BY registry, id
         LIMIT ?`,
        )
        .all(registry, like, like, fetchLimit) as unknown as RegistryMatch[])
    : (db
        .prepare(
          `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE LOWER(id) LIKE ? ESCAPE '\\' OR LOWER(COALESCE(translation_key,'')) LIKE ? ESCAPE '\\'
         ORDER BY registry, id
         LIMIT ?`,
        )
        .all(like, like, fetchLimit) as unknown as RegistryMatch[]);

  const seen = new Set(exactRows.map((r) => `${r.registry}\0${r.id}`));
  const merged = [...exactRows];
  for (const r of likeRows) {
    const k = `${r.registry}\0${r.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(r);
  }

  return merged
    .sort((a, b) => {
      const ra = rankRegistryMatch(a.id, q);
      const rb = rankRegistryMatch(b.id, q);
      if (ra !== rb) return ra - rb;
      if (a.id.length !== b.id.length) return a.id.length - b.id.length;
      return a.registry.localeCompare(b.registry) || a.id.localeCompare(b.id);
    })
    .slice(0, limit);
}

export function listRegistryNames(version: string): string[] {
  const db = openRegistryDb(version);
  if (!db) return [];
  const rows = db.prepare("SELECT DISTINCT registry FROM entries ORDER BY registry").all() as Array<{
    registry: string;
  }>;
  return rows.map((r) => r.registry);
}

export function registryDataAvailable(version: string): boolean {
  return openRegistryDb(version) !== null;
}

export function closeRegistryDbs(): void {
  for (const db of _cache.values()) db.close();
  _cache.clear();
}
