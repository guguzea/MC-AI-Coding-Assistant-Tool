/**
 * T2 反编译缓存管线（仅写 MC_SKILL_CACHE / 默认 %APPDATA%\mc-skill-cache，
 * 绝不触碰项目目录与 MC_SKILL_ALLOW_WRITE / MC_SKILL_PROJECT_ROOT 语义）。
 *
 * 目录布局（参照竞品 MCDxAI cache 管线）：
 *   <root>/{jars,mappings,remapped,decompiled,decompiled-mods,registry,resources,cache.db}
 *
 * cache.db（node:sqlite，schema v1）：
 *   meta(key TEXT PRIMARY KEY, value TEXT)         —— 下载/反编译状态等版本元数据
 *   artifacts(key TEXT PRIMARY KEY, kind, version, path, sha256, state, updated_at)
 *                                                  —— 已落地产物（供二次校验 / search_mod_code 定位）
 *
 * 锁：<root>/locks/<sanitized>.lock 目录 + 超时陈旧回收；同版本并发反编译互斥。
 */

import { existsSync, mkdirSync, rmSync, statSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import os from "os";
import { DatabaseSync } from "node:sqlite";

export interface CachePaths {
  root: string;
  jars: string;
  mappings: string;
  remapped: string;
  decompiled: string;
  decompiledMods: string;
  registry: string;
  resources: string;
  db: string;
}

/** 缓存根目录解析（纯函数，不建目录） */
export function resolveCacheRoot(): string {
  const env = process.env.MC_SKILL_CACHE;
  if (env) return env;
  if (process.platform === "win32") {
    const appData = process.env.APPDATA;
    if (appData) return join(appData, "mc-skill-cache");
    return join(os.homedir(), "mc-skill-cache");
  }
  return join(os.homedir(), ".config", "mc-skill-cache");
}

const LAYOUT = [
  "jars",
  "mappings",
  "remapped",
  "decompiled",
  "decompiled-mods",
  "registry",
  "resources",
  "locks",
] as const;

/** 确保缓存目录布局存在（root 可覆盖，测试用） */
export function ensureCachePaths(root: string = resolveCacheRoot()): CachePaths {
  for (const dir of LAYOUT) {
    mkdirSync(join(root, dir), { recursive: true });
  }
  return {
    root,
    jars: join(root, "jars"),
    mappings: join(root, "mappings"),
    remapped: join(root, "remapped"),
    decompiled: join(root, "decompiled"),
    decompiledMods: join(root, "decompiled-mods"),
    registry: join(root, "registry"),
    resources: join(root, "resources"),
    db: join(root, "cache.db"),
  };
}

// ── cache.db ──────────────────────────────────────────────────────────────────

export function openCacheDb(root: string = resolveCacheRoot()): DatabaseSync {
  const dbPath = join(root, "cache.db");
  if (!existsSync(root)) mkdirSync(root, { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS artifacts (
      key TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      version TEXT,
      path TEXT NOT NULL,
      sha256 TEXT,
      state TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  return db;
}

export function setMeta(db: DatabaseSync, key: string, value: string): void {
  db.prepare(
    "INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  ).run(key, value);
}

export function getMeta(db: DatabaseSync, key: string): string | null {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export interface ArtifactRecord {
  key: string;
  kind: string;
  version: string | null;
  path: string;
  sha256: string | null;
  state: string;
  updatedAt: string;
}

export function setArtifact(
  db: DatabaseSync,
  key: string,
  kind: string,
  path: string,
  opts: { version?: string | null; sha256?: string | null; state?: string } = {},
): void {
  db.prepare(
    `INSERT INTO artifacts (key, kind, version, path, sha256, state, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       kind = excluded.kind, version = excluded.version, path = excluded.path,
       sha256 = excluded.sha256, state = excluded.state, updated_at = excluded.updated_at`,
  ).run(key, kind, opts.version ?? null, path, opts.sha256 ?? null, opts.state ?? "ready", new Date().toISOString());
}

export function getArtifact(db: DatabaseSync, key: string): ArtifactRecord | null {
  const row = db.prepare("SELECT * FROM artifacts WHERE key = ?").get(key) as
    | (Omit<ArtifactRecord, "updatedAt"> & { updated_at: string })
    | undefined;
  if (!row) return null;
  return { ...row, updatedAt: row.updated_at };
}

// ── 锁 ────────────────────────────────────────────────────────────────────────

export class CacheLockBusyError extends Error {
  code = "CACHE_LOCK_BUSY";
  constructor(key: string, timeoutMs: number) {
    super(`缓存锁 busy: ${key}（超时 ${timeoutMs}ms）；同版本并发反编译进行中，请稍后重试`);
  }
}

function sanitizeLockName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * 获取缓存锁（mkdir 原子性）。返回释放函数。
 * - busy 且未超过 timeout → CACHE_LOCK_BUSY
 * - busy 且已陈旧（超过 timeout）→ 抢占（删除后重试一次）
 */
export async function acquireCacheLock(
  root: string = resolveCacheRoot(),
  name: string,
  timeoutMs = 600_000,
): Promise<() => void> {
  const locksDir = join(root, "locks");
  mkdirSync(locksDir, { recursive: true });
  const lockDir = join(locksDir, sanitizeLockName(name));

  const tryAcquire = (): boolean => {
    try {
      mkdirSync(lockDir);
      writeFileSync(join(lockDir, "owner.json"), JSON.stringify({ pid: process.pid, at: Date.now() }));
      return true;
    } catch {
      return false;
    }
  };

  if (tryAcquire()) {
    return () => rmSync(lockDir, { recursive: true, force: true });
  }

  // busy：陈旧回收
  let stale = false;
  try {
    stale = Date.now() - statSync(lockDir).mtimeMs > timeoutMs;
  } catch {
    stale = false;
  }
  if (stale) {
    rmSync(lockDir, { recursive: true, force: true });
    if (tryAcquire()) {
      return () => rmSync(lockDir, { recursive: true, force: true });
    }
  }

  throw new CacheLockBusyError(name, timeoutMs);
}

/** 调试辅助：列出锁目录残留（不用于生产逻辑） */
export function listLocks(root: string = resolveCacheRoot()): string[] {
  const locksDir = join(root, "locks");
  if (!existsSync(locksDir)) return [];
  return readdirSync(locksDir);
}
