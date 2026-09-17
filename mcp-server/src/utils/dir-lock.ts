/**
 * 通用目录锁（审计 NP-4，2026-09-17）：mkdir 原子抢占 + owner.json 心跳 + rename CAS 抢占陈旧锁。
 *
 * 逻辑自 decompile/cache.ts 的缓存锁**原样抽出**（语义不变），供 update --action=apply 等其它
 * 写链路复用同一套原语，不再各写一份。锁目录：`<root>/locks/<清洗名>_<sha1 前 8>`。
 *
 * 语义边界（与抽出的原实现一致，勿改）：
 * - 同进程内重复获取同一把锁**就是 busy**（cache 层既有测试按此断言）。调用方若要
 *   「一层持锁、内层复用」，请在最外层只取一次（见 update/index.ts 的 update-apply）。
 * - 陈旧判据 = owner.at 超时（持锁进程死亡/失联）；rename 抢占后赢家再复核，仍存活的锁原位还回。
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

export class DirLockBusyError extends Error {
  code = "DIR_LOCK_BUSY";
  constructor(key: string, timeoutMs: number) {
    super(`目录锁 busy: ${key}（超时 ${timeoutMs}ms）；另一个进程正持有同一把锁，请稍后重试`);
  }
}

/** 锁名清洗：与 cache.ts 的 sanitizeCacheSegment 同规则，保证既有锁目录名不变。 */
function sanitizeLockSegment(name: string): string | null {
  const cleaned = name.replace(/[^a-z0-9._-]/gi, "_");
  if (!cleaned || cleaned === "." || cleaned === ".." || cleaned.includes("..")) return null;
  return cleaned;
}

/** 锁目录名 = 清洗段 + 原名 sha1 前 8 位（必须稳定：陈旧锁抢占用例按真实路径放置夹具）。 */
export function sanitizeDirLockName(name: string): string {
  const hash = createHash("sha1").update(name).digest("hex").slice(0, 8);
  const segment = sanitizeLockSegment(name.toLowerCase()) ?? "invalid";
  return `${segment.slice(0, 80)}_${hash}`;
}

export function dirLockPathOf(root: string, name: string): string {
  return join(root, "locks", sanitizeDirLockName(name));
}

function writeOwner(lockDir: string): void {
  writeFileSync(join(lockDir, "owner.json"), JSON.stringify({ pid: process.pid, at: Date.now() }));
}

/** 持锁方心跳：续租 owner.at（同时刷新目录 mtime），防止长任务被误抢占。 */
const lockHeartbeats = new Map<string, NodeJS.Timeout>();

function lockHeartbeatKey(root: string, name: string): string {
  return `${root}\0${name}`;
}

function startLockHeartbeat(root: string, name: string, lockDir: string, timeoutMs: number): void {
  stopLockHeartbeat(root, name);
  const interval = Math.max(1_000, Math.min(Math.floor(timeoutMs / 3), 30_000));
  const timer = setInterval(() => {
    try {
      writeOwner(lockDir);
    } catch {
      /* 锁目录被异常移除时停止续租 */
      stopLockHeartbeat(root, name);
    }
  }, interval);
  timer.unref?.();
  lockHeartbeats.set(lockHeartbeatKey(root, name), timer);
}

function stopLockHeartbeat(root: string, name: string): void {
  const timer = lockHeartbeats.get(lockHeartbeatKey(root, name));
  if (timer) {
    clearInterval(timer);
    lockHeartbeats.delete(lockHeartbeatKey(root, name));
  }
}

/** 持锁期间手动续租（长任务分段时调用）。 */
export function touchDirLock(name: string, root: string): void {
  const lockDir = dirLockPathOf(root, name);
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
 * 获取目录锁（mkdir 原子性 + rename 原子抢占 + 持锁心跳）。返回释放函数。
 * - 空闲 → 直接获取，启动心跳续租
 * - busy 且未超时 → DirLockBusyError
 * - busy 且陈旧（owner.at 超时）→ rename 原子抢占后获取
 */
export async function acquireDirLock(
  root: string,
  name: string,
  timeoutMs = 600_000,
): Promise<() => void> {
  const locksDir = join(root, "locks");
  mkdirSync(locksDir, { recursive: true });
  const lockDir = dirLockPathOf(root, name);

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
      stopLockHeartbeat(root, name);
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

  throw new DirLockBusyError(name, timeoutMs);
}

/** 调试辅助：列出锁目录残留（不用于生产逻辑） */
export function listDirLocks(root: string): string[] {
  const locksDir = join(root, "locks");
  if (!existsSync(locksDir)) return [];
  return readdirSync(locksDir);
}
