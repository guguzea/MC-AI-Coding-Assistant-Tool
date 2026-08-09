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
  if (registry) {
    return db
      .prepare(
        `SELECT registry, id, translation_key AS translationKey FROM entries
         WHERE registry = ? AND (LOWER(id) LIKE ? OR LOWER(COALESCE(translation_key,'')) LIKE ?)
         ORDER BY id LIMIT ?`,
      )
      .all(registry, like, like, limit) as unknown as RegistryMatch[];
  }
  return db
    .prepare(
      `SELECT registry, id, translation_key AS translationKey FROM entries
       WHERE LOWER(id) LIKE ? OR LOWER(COALESCE(translation_key,'')) LIKE ?
       ORDER BY registry, id LIMIT ?`,
    )
    .all(like, like, limit) as unknown as RegistryMatch[];
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
