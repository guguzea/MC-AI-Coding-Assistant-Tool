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
import { acquireDirLock } from "../utils/dir-lock.js";
import { resolveCacheRoot } from "../utils/path.js";

const LOCK_NAME = "update-apply";
let held: (() => void) | null = null;

/** 取 update-apply 锁（同进程重入返回 no-op release）；别的进程持有时抛 DirLockBusyError。 */
export async function acquireUpdateApplyLock(timeoutMs = 600_000): Promise<() => void> {
  if (held) return () => {};
  held = await acquireDirLock(resolveCacheRoot(), LOCK_NAME, timeoutMs);
  return () => {
    const release = held;
    if (!release) return;
    held = null;
    release();
  };
}
