/**
 * 公共正则工具（A-3：用户输入拼正则前必须转义）。
 */

/** 转义字符串中的正则元字符，供 new RegExp 安全插值。 */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 把链式 `.*` 收成行内有界量词，降低崩溃正则多项式回溯。 */
export function lineBounded(source: string, n = 200): string {
  const cap = Math.max(0, Math.min(Math.floor(n), 10_000));
  return source.replace(/\.\*/g, `[^\\n]{0,${cap}}`);
}
