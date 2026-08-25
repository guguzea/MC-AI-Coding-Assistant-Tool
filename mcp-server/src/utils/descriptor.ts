/**
 * Shared JNI descriptor helpers for query_api / convert_mapping / CLI.
 */

const PRIMITIVES: Record<string, string> = {
  B: "byte",
  C: "char",
  D: "double",
  F: "float",
  I: "int",
  J: "long",
  S: "short",
  Z: "boolean",
  V: "void",
};

/** Parse one field/type descriptor starting at `i`; returns [javaType, nextIndex]. */
export function parseTypeAt(desc: string, i: number, depth = 0): [string, number] {
  if (depth > 32) return ["?", desc.length]; // 防嵌套数组爆栈；消费剩余描述符，禁止拆成多个参数
  if (i >= desc.length) return ["?", i];
  const c = desc[i];
  if (PRIMITIVES[c]) return [PRIMITIVES[c], i + 1];
  if (c === "[") {
    const [inner, next] = parseTypeAt(desc, i + 1, depth + 1);
    return [`${inner}[]`, next];
  }
  if (c === "L") {
    const end = desc.indexOf(";", i + 1);
    if (end < 0) return [`Object(${desc.slice(i)})`, desc.length];
    const slash = desc.slice(i + 1, end);
    const simple = slash.includes("/") ? slash.slice(slash.lastIndexOf("/") + 1) : slash;
    return [simple.replace(/\$/g, "."), end + 1];
  }
  return [`?${c}`, i + 1];
}

/** Human-readable type for a field or return type descriptor (e.g. `F`, `Ljava/lang/String;`). */
export function readableType(typeDesc: string): string {
  if (!typeDesc) return "void";
  const [t] = parseTypeAt(typeDesc, 0);
  return t;
}

/** Return type from a full method descriptor `(...)X`. */
export function returnType(methodDescriptor: string): string {
  if (!methodDescriptor) return "void";
  const close = methodDescriptor.lastIndexOf(")");
  if (close < 0) return readableType(methodDescriptor);
  return readableType(methodDescriptor.slice(close + 1));
}

/** Parameter Java types from a method descriptor. */
export function parameterTypes(methodDescriptor: string): string[] {
  if (!methodDescriptor || !methodDescriptor.startsWith("(")) return [];
  const close = methodDescriptor.indexOf(")");
  if (close < 0) return [];
  const body = methodDescriptor.slice(1, close);
  const out: string[] = [];
  let i = 0;
  while (i < body.length) {
    const [t, next] = parseTypeAt(body, i);
    out.push(t);
    i = next;
  }
  return out;
}

/**
 * Readable signature, e.g. `getHealth(): float` or `hurt(Entity, float): void`.
 * Uses simple class names for object types.
 */
export function readableSignature(methodName: string, methodDescriptor: string): string {
  const params = parameterTypes(methodDescriptor);
  const ret = returnType(methodDescriptor);
  return `${methodName}(${params.join(", ")}): ${ret}`;
}
