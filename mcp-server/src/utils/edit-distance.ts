/**
 * 有界 Levenshtein：距离超过 max 时提前返回 null，避免无界 DP 分配。
 */
export function editDistanceLimited(a: string, b: string, max: number): number | null {
  if (Math.abs(a.length - b.length) > max) return null;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1);
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return null;
    prev = cur;
  }
  return prev[n] <= max ? prev[n] : null;
}
