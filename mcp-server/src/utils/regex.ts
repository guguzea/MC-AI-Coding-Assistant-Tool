/**
 * 公共正则工具（A-3：用户输入拼正则前必须转义）。
 */

/** 转义字符串中的正则元字符，供 new RegExp 安全插值。 */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
