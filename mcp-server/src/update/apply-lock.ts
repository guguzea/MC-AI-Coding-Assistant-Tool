/**
 * `update --action=apply` 的跨进程锁（审计 NP-4，2026-09-17）。
 *
 * 复用通用目录锁（utils/dir-lock.ts）的 `update-apply` 名字，并额外提供**同进程重入**：
 * apply 流程里 tooling 段（git 合并 + npm 构建）与 data 段（解压 → next 组装 → 换入）
 * 各自 include 一次；同进程对同一把锁再取就是 busy，直接取会自锁，故这里记住持有者：
 * 第一次真取、嵌套复用（no-op release）、只有真取者那次 release 才真正释放。
 *
 * busy（别的进程正持有）时抛 DirLockBusyError，由调用方翻成 UPDATE_BUSY 信封。
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { acquireDirLock, dirLockPathOf } from "../utils/dir-lock.js";
import { resolveCacheRoot } from "../utils/path.js";

const LOCK_NAME = "update-apply";
let held: (() => void) | null = null;
/** C16：正在取锁的 in-flight promise —— 同进程**交错**并发必须复用同一次取锁，而不是各自真去抢。 */
let inflight: Promise<void> | null = null;

/** 取 update-apply 锁（同进程重入返回 no-op release）；别的进程持有时抛 DirLockBusyError。 */
export async function acquireUpdateApplyLock(timeoutMs = 600_000): Promise<() => void> {
  if (held) return () => {};
  if (inflight) {
    // 交错并发：等首次取锁完成并复用它，返回 no-op（真释放只由首次调用者那次 release 执行）。
    await inflight;
    return () => {};
  }
  inflight = acquireDirLock(resolveCacheRoot(), LOCK_NAME, timeoutMs).then((release) => {
    held = release;
  });
  try {
    await inflight;
  } finally {
    inflight = null;
  }
  return () => {
    const release = held;
    if (!release) return;
    held = null;
    release();
  };
}

/**
 * N7（2026-09-19 裁定）：**非阻塞**试探取锁 —— 锁目录不存在时用 mkdir 原子占住，拿到才动盘。
 *
 * 为什么不用 `acquireUpdateApplyLock(小 timeout)`：dir-lock 的 `timeoutMs` 同时是**陈旧抢占阈值**
 * （`age <= timeoutMs` 视为存活），传小值会把别的进程**正持有的活锁**当成陈旧抢走。
 * 为什么不保持 A-40 原样的「existsSync 探测」：那是 TOCTOU —— 两个进程可以同时过闸，
 * 并发动盘（`recoverPartialSwap` 还会无条件删 `.next`，可能与刚取到锁、正在组装 `.next` 的进程撞车）。
 *
 * 语义边界（与 A-40 注释一致，只是把「探测」升级成「原子占位」）：
 *   · **不等待**：拿不到立刻返回 null（活锁/残锁一律交给主路径：活锁由持有者自愈、残锁由
 *     `takeOverStaleLock` 陈旧抢占后自愈）；
 *   · **不陈旧抢占**：`owner.json` 过期也不抢 —— 那是主路径的职责；
 *   · 拿到锁的窗口极短（一次 `recoverPartialSwap`），期间并发 apply 会看到锁目录 ⇒ UPDATE_BUSY，
 *     这是正确串行化，不再是并发写盘。
 * 返回 release（调用方必须 finally 释放）；本进程崩溃留下的目录会被主路径当残锁按陈旧接管。
 */
export function tryAcquireUpdateApplyLock(): (() => void) | null {
  const lockDir = dirLockPathOf(resolveCacheRoot(), LOCK_NAME);
  if (existsSync(lockDir)) return null;
  try {
    mkdirSync(lockDir, { recursive: true });
  } catch {
    return null; // 与并发取锁的极小窗口竞争：抢不到就放弃（不等待）
  }
  try {
    writeFileSync(join(lockDir, "owner.json"), JSON.stringify({ pid: process.pid, at: Date.now() }));
  } catch {
    /* owner 写不进去不影响互斥：目录存在本身就是占位 */
  }
  return () => {
    try {
      rmSync(lockDir, { recursive: true, force: true });
    } catch {
      /* 释放失败 = 残锁，交给主路径陈旧抢占 */
    }
  };
}
