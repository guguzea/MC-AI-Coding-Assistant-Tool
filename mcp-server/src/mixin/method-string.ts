/**
 * Parse Mixin @Inject / @Redirect method target strings (multi-layer naming).
 */

export type MethodNamingStyle =
  | "srg"
  | "yarn_intermediary"
  | "mojang_hashed"
  | "readable"
  | "descriptor_combined"
  | "unknown";

export interface ParsedMethodRef {
  methodName: string;
  descriptor?: string;
  style: MethodNamingStyle;
  raw: string;
}

const SRG_RE = /^func_\d+_[a-z]$/i;
const YARN_RE = /^method_\d+$/i;
const MOJANG_RE = /^m_\d+_$/;

export function detectNamingStyle(name: string): MethodNamingStyle {
  const n = name.trim();
  if (SRG_RE.test(n)) return "srg";
  if (YARN_RE.test(n)) return "yarn_intermediary";
  if (MOJANG_RE.test(n)) return "mojang_hashed";
  if (n.includes("(") && n.includes(")")) return "descriptor_combined";
  if (/^[a-z][a-zA-Z0-9_$]*$/.test(n)) return "readable";
  return "unknown";
}

/** Split `hurt(Lnet/minecraft/...;F)V` into name + descriptor */
export function splitMethodAndDescriptor(combined: string): { methodName: string; descriptor: string } {
  const idx = combined.indexOf("(");
  if (idx < 0) {
    return { methodName: combined.trim(), descriptor: "" };
  }
  const methodName = combined.slice(0, idx).trim();
  const end = combined.lastIndexOf(")");
  const descriptor = end >= idx ? combined.slice(idx, end + 1) : combined.slice(idx);
  return { methodName, descriptor };
}

export function parseMethodReference(raw: string, separateDescriptor?: string): ParsedMethodRef {
  const trimmed = raw.trim();
  let methodName = trimmed;
  let descriptor = separateDescriptor?.trim();

  if (trimmed.includes("(")) {
    const split = splitMethodAndDescriptor(trimmed);
    methodName = split.methodName;
    descriptor = descriptor || split.descriptor;
  }

  const style = descriptor
    ? detectNamingStyle(methodName)
    : detectNamingStyle(methodName);

  return {
    methodName,
    descriptor: descriptor || undefined,
    style: trimmed.includes("(") ? "descriptor_combined" : style,
    raw: trimmed,
  };
}

/** Expand `method = { "a", "b" }` style arrays from annotation text */
export function parseMethodArrayLiteral(text: string): string[] {
  const inner = text.replace(/^\s*\{\s*/, "").replace(/\s*\}\s*$/, "");
  const out: string[] = [];
  const re = /"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner))) out.push(m[1]);
  return out;
}

export function mergeInjectMethodAndDesc(
  methodExpr: string | undefined,
  descExpr: string | undefined,
): ParsedMethodRef | null {
  if (!methodExpr && !descExpr) return null;
  const method = (methodExpr ?? "").trim();
  const desc = (descExpr ?? "").trim();
  if (!method && desc) {
    return { methodName: "", descriptor: desc, style: "unknown", raw: desc };
  }
  return parseMethodReference(method, desc || undefined);
}
