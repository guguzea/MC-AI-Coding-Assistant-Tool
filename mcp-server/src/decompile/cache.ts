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

import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, readdirSync, renameSync } from "fs";
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

function lockDirOf(root: string, name: string): string {
  return join(root, "locks", sanitizeLockName(name));
}

function writeOwner(lockDir: string): void {
  writeFileSync(join(lockDir, "owner.json"), JSON.stringify({ pid: process.pid, at: Date.now() }));
}

/** 持锁方心跳：续租 owner.at（同时刷新目录 mtime），防止长任务（VineFlower 可超时窗）被误抢占。 */
const lockHeartbeats = new Map<string, NodeJS.Timeout>();

function startLockHeartbeat(root: string, name: string, lockDir: string, timeoutMs: number): void {
  stopLockHeartbeat(name);
  const interval = Math.max(1_000, Math.min(Math.floor(timeoutMs / 3), 30_000));
  const timer = setInterval(() => {
    try {
      writeOwner(lockDir);
    } catch {
      /* 锁目录被异常移除时停止续租 */
      stopLockHeartbeat(name);
    }
  }, interval);
  timer.unref?.();
  lockHeartbeats.set(name, timer);
}

function stopLockHeartbeat(name: string): void {
  const timer = lockHeartbeats.get(name);
  if (timer) {
    clearInterval(timer);
    lockHeartbeats.delete(name);
  }
}

/** 持锁期间手动续租（长任务分段时调用）。 */
export function touchCacheLock(name: string, root: string = resolveCacheRoot()): void {
  const lockDir = lockDirOf(root, name);
  if (!existsSync(lockDir)) return;
  try {
    writeOwner(lockDir);
  } catch {
    /* ignore */
  }
}

function lockAgeMs(lockDir: string): number | null {
  try {
    const raw = JSON.parse(readFileSync(join(lockDir, "owner.json"), "utf8")) as { at?: number };
    if (typeof raw.at === "number") return Date.now() - raw.at;
  } catch {
    /* fall through to mtime */
  }
  try {
    return Date.now() - statSync(lockDir).mtimeMs;
  } catch {
    return null;
  }
}

/**
 * rename 原子抢占陈旧锁（proper-lockfile 式 CAS）：
 * renameSync 只有一个赢家；赢家再复核 owner.at 确认确实陈旧，仍存活的锁原位还回。
 */
function takeOverStaleLock(locksDir: string, lockDir: string, timeoutMs: number): boolean {
  const tmp = join(locksDir, `.${Date.now()}-${process.pid}.taken`);
  try {
    renameSync(lockDir, tmp);
  } catch {
    return false; // 他人已抢先 rename / 锁已被释放
  }
  const age = lockAgeMs(tmp);
  if (age !== null && age <= timeoutMs) {
    // 锁其实仍存活（可能刚被并发持有者续租）：原位恢复，放弃本次抢占
    try {
      renameSync(tmp, lockDir);
    } catch {
      rmSync(tmp, { recursive: true, force: true });
    }
    return false;
  }
  rmSync(tmp, { recursive: true, force: true });
  return true;
}

/**
 * 获取缓存锁（mkdir 原子性 + rename 原子抢占 + 持锁心跳）。返回释放函数。
 * - 空闲 → 直接获取，启动心跳续租
 * - busy 且未超时 → CACHE_LOCK_BUSY
 * - busy 且陈旧（owner.at 超时，持锁进程死亡/失联）→ rename 原子抢占后获取
 */
export async function acquireCacheLock(
  root: string = resolveCacheRoot(),
  name: string,
  timeoutMs = 600_000,
): Promise<() => void> {
  const locksDir = join(root, "locks");
  mkdirSync(locksDir, { recursive: true });
  const lockDir = lockDirOf(root, name);

  const tryAcquire = (): boolean => {
    try {
      mkdirSync(lockDir);
      writeOwner(lockDir);
      return true;
    } catch {
      return false;
    }
  };

  const acquire = (): (() => void) | null => {
    if (!tryAcquire()) return null;
    startLockHeartbeat(root, name, lockDir, timeoutMs);
    return () => {
      stopLockHeartbeat(name);
      rmSync(lockDir, { recursive: true, force: true });
    };
  };

  const acquired = acquire();
  if (acquired) return acquired;

  const age = lockAgeMs(lockDir);
  if (age !== null && age > timeoutMs && takeOverStaleLock(locksDir, lockDir, timeoutMs)) {
    const retried = acquire();
    if (retried) return retried;
  }

  throw new CacheLockBusyError(name, timeoutMs);
}

/** 调试辅助：列出锁目录残留（不用于生产逻辑） */
export function listLocks(root: string = resolveCacheRoot()): string[] {
  const locksDir = join(root, "locks");
  if (!existsSync(locksDir)) return [];
  return readdirSync(locksDir);
}
