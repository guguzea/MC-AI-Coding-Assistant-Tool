/**
 * ZIP 成员路径守卫（公共版，mdk 与 update 共用）。
 * A-2/A-5：segment 级 `..` 判定 + Windows 保留设备名拒绝（fail-closed）。
 */

const WINDOWS_RESERVED = new Set([
  "CON", "PRN", "AUX", "NUL",
  ...Array.from({ length: 9 }, (_, i) => `COM${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `LPT${i + 1}`),
]);

/** Windows 保留设备名（含结尾点/空格变体，如 "CON."、"NUL "）。 */
export function isWindowsReservedName(name: string): boolean {
  const base = name.replace(/\\/g, "/").split("/").pop() ?? "";
  const stem = base.replace(/[.\s]+$/, "").toUpperCase();
  if (!stem) return false;
  if (WINDOWS_RESERVED.has(stem)) return true;
  const m = stem.match(/^(COM|LPT)[1-9]$/);
  return m !== null;
}

/**
 * zip 条目名是否不可安全落盘：空、绝对路径、盘符、segment 级 `..`、Windows 保留名。
 * （注意：按 path segment 判 `..`，不再误伤 foo..bar.json 这类含连续点的合法名。）
 */
export function isUnsafeZipEntry(name: string): boolean {
  const n = name.replace(/\\/g, "/");
  if (!n || n === ".") return true;
  if (n.startsWith("/")) return true;
  if (/^[a-zA-Z]:/.test(n)) return true;
  if (n.split("/").some((p) => p === "..")) return true;
  if (isWindowsReservedName(n)) return true;
  return false;
}
