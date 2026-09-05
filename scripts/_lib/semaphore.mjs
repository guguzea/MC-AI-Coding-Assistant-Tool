/**
 * 计数信号量：限制并发数。
 *
 * 计数交接必须全在 `release()` 里同步完成（自己退一格 + 有 waiter 就把那一格转给它）。
 * 若在被唤醒后再 `active++`，同一个槽会被算两次，`active` 单调上漂，最终所有 `acquire()`
 * 永久挂住。`activeCount()` 只为把这条不变式做成可断言的测试而存在。
 */
export function makeSemaphore(n) {
  let active = 0;
  const waiters = [];
  return {
    async acquire() {
      if (active < n) {
        active++;
        return;
      }
      await new Promise((res) => waiters.push(res));
      // 槽位已由 release() 同步交接并计数，这里不得再 active++
    },
    release() {
      active--; // 先退掉自己的槽
      const w = waiters.shift();
      // 交接：一次减 + 一次加，绝不双减 / 双加；release 全程同步，中间无新 acquire 插队。
      if (w) {
        active++;
        w();
      }
    },
    activeCount: () => active,
  };
}

export async function withSlot(sem, fn) {
  await sem.acquire();
  try {
    return await fn();
  } finally {
    sem.release();
  }
}
