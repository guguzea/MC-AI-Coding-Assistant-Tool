/**
 * CLI / 工具布尔旗标解析。裸 flag 为开；显式 false/0/no/off 为关。
 */
export function parseFlagTruthy(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (Array.isArray(v)) {
    const last = v.at(-1);
    return parseFlagTruthy(last);
  }
  const s = String(v).trim().toLowerCase();
  if (s === "" || s === "true" || s === "1" || s === "yes" || s === "on") return true;
  if (s === "false" || s === "0" || s === "no" || s === "off") return false;
  return true;
}
