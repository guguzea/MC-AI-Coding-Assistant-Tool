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

  const like = `%${q.replace(/%/g, "")}%`;
  const fetchLimit = Math.max(limit * 8, 200);
  const rows = registry
    ? (db
        .prepare(
          `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE registry = ? AND (LOWER(id) LIKE ? OR LOWER(COALESCE(translation_key,'')) LIKE ?)
         LIMIT ?`,
        )
        .all(registry, like, like, fetchLimit) as unknown as RegistryMatch[])
    : (db
        .prepare(
          `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE LOWER(id) LIKE ? OR LOWER(COALESCE(translation_key,'')) LIKE ?
         LIMIT ?`,
        )
        .all(like, like, fetchLimit) as unknown as RegistryMatch[]);

  return [...rows]
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
