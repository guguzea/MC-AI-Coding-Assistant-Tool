/**
 * Build vanilla registry SQLite index from JSON dumps under data/vanilla_<ver>/registries/.
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { DatabaseSync } from "node:sqlite";
import { resolveDataDir } from "../utils/path.js";

export interface RegistryJsonEntry {
  id: string;
  translationKey?: string;
}

export interface BuildRegistryReport {
  version: string;
  sourceDir: string;
  sqlitePath: string;
  registries: Array<{ name: string; count: number }>;
  totalEntries: number;
}

export function vanillaRegistryDir(version: string): string {
  const v = version.trim().replace(/^v/i, "");
  return resolveDataDir(`vanilla_${v}`, "registries");
}

export function vanillaRegistrySqlitePath(version: string): string {
  return join(vanillaRegistryDir(version), "registry-index.sqlite");
}

function loadRegistryJson(filePath: string): RegistryJsonEntry[] {
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  if (Array.isArray(raw)) {
    return raw.filter((e): e is RegistryJsonEntry => typeof e === "object" && e !== null && "id" in e);
  }
  if (raw && typeof raw === "object" && "entries" in raw) {
    const entries = (raw as { entries: unknown }).entries;
    if (Array.isArray(entries)) {
      return entries.filter((e): e is RegistryJsonEntry => typeof e === "object" && e !== null && "id" in e);
    }
  }
  throw new Error(`Unsupported registry JSON shape: ${filePath}`);
}

/**
 * Import all `*.json` files in registries/ (basename without .json = registry name).
 */
export function buildRegistryIndex(
  version: string,
  options?: { force?: boolean; sqlitePath?: string },
): BuildRegistryReport {
  const sourceDir = vanillaRegistryDir(version);
  if (!existsSync(sourceDir)) {
    throw new Error(`Registry source directory missing: ${sourceDir}`);
  }
  const sqlitePath = options?.sqlitePath ?? vanillaRegistrySqlitePath(version);
  if (existsSync(sqlitePath) && !options?.force) {
    const db = new DatabaseSync(sqlitePath, { readOnly: true });
    const rows = db.prepare("SELECT registry, COUNT(*) AS c FROM entries GROUP BY registry").all() as Array<{
      registry: string;
      c: number;
    }>;
    db.close();
    const registries = rows.map((r) => ({ name: r.registry, count: r.c }));
    return {
      version,
      sourceDir,
      sqlitePath,
      registries,
      totalEntries: registries.reduce((s, r) => s + r.count, 0),
    };
  }

  const db = new DatabaseSync(sqlitePath);
  db.exec("DROP TABLE IF EXISTS entries");
  db.exec("DROP TABLE IF EXISTS meta");
  db.exec(`
    CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE entries (
      registry TEXT NOT NULL,
      id TEXT NOT NULL,
      translation_key TEXT,
      PRIMARY KEY (registry, id)
    );
    CREATE INDEX idx_entries_id ON entries(id);
  `);

  const registries: Array<{ name: string; count: number }> = [];
  let total = 0;
  const insert = db.prepare(
    "INSERT OR REPLACE INTO entries (registry, id, translation_key) VALUES (?, ?, ?)",
  );

  for (const name of readdirSync(sourceDir)) {
    if (!name.endsWith(".json") || name === "manifest.json") continue;
    const registryName = name.replace(/\.json$/i, "");
    const entries = loadRegistryJson(join(sourceDir, name));
    let count = 0;
    for (const e of entries) {
      if (!e.id || typeof e.id !== "string") continue;
      insert.run(registryName, e.id, e.translationKey ?? null);
      count++;
    }
    registries.push({ name: registryName, count });
    total += count;
  }

  db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run("mcVersion", version);
  db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run("builtAt", new Date().toISOString());
  db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run("entryCount", String(total));
  db.close();

  return { version, sourceDir, sqlitePath, registries, totalEntries: total };
}
