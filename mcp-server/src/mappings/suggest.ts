/** 高门槛方法名相似建议；过短或分数不足则返回 [] */

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function suggestSimilarMethods(
  input: string,
  methodNames: string[],
  limit = 3,
): string[] {
  if (input.length <= 4) return [];
  const lower = input.toLowerCase();
  const scored: Array<{ name: string; score: number }> = [];

  const prefixOf = (s: string) => {
    const m = s.match(/^(get|set|is|has|to|as)/i);
    return m ? m[1].toLowerCase() : "";
  };
  const inputPrefix = prefixOf(input);

  for (const name of methodNames) {
    const n = name.toLowerCase();
    if (n === lower) continue;
    const dist = levenshtein(lower, n);
    const shorter = Math.min(lower.length, n.length);
    if (shorter < lower.length * 0.7 && dist > 2) continue;

    let score = 0;
    if (n.startsWith(lower) || lower.startsWith(n.slice(0, Math.min(4, n.length)))) score += 5;
    const namePrefix = prefixOf(name);
    if (inputPrefix && namePrefix && inputPrefix === namePrefix) {
      score += 3;
      const a = lower.slice(inputPrefix.length);
      const b = n.slice(namePrefix.length);
      if (a && b && (b.includes(a) || a.includes(b))) score += 6;
    }
    if (dist <= 2 && shorter >= lower.length * 0.7) score += 4 - dist;
    if (score < 6) continue;
    scored.push({ name, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return [...new Set(scored.map((s) => s.name))].slice(0, limit);
}
