export const IDEAL_ID = /^[a-z][a-z0-9_]*$/;

/** 归一化 modId/targetName：大写→小写，./-→_；无法得到合法标识则返回 null */
export function normalizeModIdentifier(raw: string): { value: string; warned: boolean } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let warned = false;
  if (!IDEAL_ID.test(trimmed)) warned = true;
  let v = trimmed.toLowerCase().replace(/[.\-]+/g, "_").replace(/[^a-z0-9_]/g, "_");
  v = v.replace(/_+/g, "_").replace(/^_|_$/g, "");
  if (!v || !/^[a-z]/.test(v)) {
    if (/^[0-9]/.test(v)) {
      v = `m_${v}`;
      warned = true;
    } else {
      return null;
    }
  }
  if (!IDEAL_ID.test(v)) return null;
  return { value: v, warned: warned || v !== trimmed };
}

export function toPascalCase(modId: string): string {
  return modId
    .split(/[_-]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export function toUpperSnake(name: string): string {
  return name.toUpperCase().replace(/-/g, "_");
}
