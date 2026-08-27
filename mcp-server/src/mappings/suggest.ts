/** 高门槛方法名相似建议；过短、过长或分数不足则返回 [] */

import { editDistanceLimited } from "../utils/edit-distance.js";

const INPUT_MAX = 64;
const CANDIDATE_MAX = 96;
const DIST_MAX = 2;

export function suggestSimilarMethods(
  input: string,
  methodNames: string[],
  limit = 3,
): string[] {
  if (input.length <= 4 || input.length > INPUT_MAX) return [];
  const lower = input.toLowerCase();
  const scored: Array<{ name: string; score: number }> = [];

  const prefixOf = (s: string) => {
    const m = s.match(/^(get|set|is|has|to|as)/i);
    return m ? m[1].toLowerCase() : "";
  };
  const inputPrefix = prefixOf(input);

  for (const name of methodNames) {
    if (name.length > CANDIDATE_MAX) continue;
    const n = name.toLowerCase();
    if (n === lower) continue;
    const dist = editDistanceLimited(lower, n, DIST_MAX);
    const shorter = Math.min(lower.length, n.length);
    if (dist === null && shorter < lower.length * 0.7) continue;

    let score = 0;
    if (n.startsWith(lower) || lower.startsWith(n.slice(0, Math.min(4, n.length)))) score += 5;
    const namePrefix = prefixOf(name);
    if (inputPrefix && namePrefix && inputPrefix === namePrefix) {
      score += 3;
      const a = lower.slice(inputPrefix.length);
      const b = n.slice(namePrefix.length);
      if (a && b && (b.includes(a) || a.includes(b))) score += 6;
    }
    if (dist !== null && dist <= DIST_MAX && shorter >= lower.length * 0.7) score += 4 - dist;
    if (score < 6) continue;
    scored.push({ name, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return [...new Set(scored.map((s) => s.name))].slice(0, limit);
}
