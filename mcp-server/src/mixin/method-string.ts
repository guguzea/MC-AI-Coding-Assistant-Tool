/**
 * Parse Mixin @Inject / @Redirect method target strings (multi-layer naming).
 */
import { parseTypeAt } from "../utils/descriptor.js";

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

/** MCP SRG：`func_110143_aJ`（后缀可为多字母，禁止写成 `[a-z]$` 单字母） */
export const SRG_METHOD_RE = /^func_\d+_[a-zA-Z]+$/;
/** MCP SRG 字段：`field_100013_f`；与 Yarn `field_6247`（无后缀字母）不重叠 */
export const SRG_FIELD_RE = /^field_\d+_[a-zA-Z]+$/;
const YARN_RE = /^method_\d+$/i;
const MOJANG_RE = /^m_\d+_$/;

export function isSrgMethod(name: string): boolean {
  return SRG_METHOD_RE.test(name.trim());
}

export function isSrgField(name: string): boolean {
  return SRG_FIELD_RE.test(name.trim());
}

export function detectNamingStyle(name: string): MethodNamingStyle {
  const n = name.trim();
  if (SRG_METHOD_RE.test(n) || SRG_FIELD_RE.test(n)) return "srg";
  if (YARN_RE.test(n)) return "yarn_intermediary";
  if (MOJANG_RE.test(n)) return "mojang_hashed";
  if (n.includes("(") && n.includes(")")) return "descriptor_combined";
  if (/^[a-z][a-zA-Z0-9_$]*$/.test(n)) return "readable";
  return "unknown";
}

/** Split `hurt(Lnet/minecraft/...;F)V` into name + descriptor（含返回类型，停在 parseTypeAt 消费完） */
export function splitMethodAndDescriptor(combined: string): { methodName: string; descriptor: string } {
  const idx = combined.indexOf("(");
  if (idx < 0) {
    return { methodName: combined.trim(), descriptor: "" };
  }
  const methodName = combined.slice(0, idx).trim();
  const close = combined.indexOf(")", idx);
  if (close < 0) {
    return { methodName, descriptor: combined.slice(idx) };
  }
  const [, retEnd] = parseTypeAt(combined, close + 1);
  return { methodName, descriptor: combined.slice(idx, retEnd) };
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
