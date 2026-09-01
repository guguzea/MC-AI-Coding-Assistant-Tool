export { normalizeModIdentifier, toJavaClassName } from "../datagen/common.js";

import { isExactMcVersionToken, matchesExactMcVersion } from "../utils/minecraft-version.js";

/** 精确 MC 版本 token（禁止 1.20.4beta / 1.2100 无锚混入）。 */
export function exactMcVersion(s: string): boolean {
  return isExactMcVersionToken(s);
}

export { matchesExactMcVersion };

export function toPascalCase(modId: string): string {
  return modId.split(/[_-]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

export function withJavaTypeSuffix(className: string, suffix: string): string {
  if (!className) return suffix;
  if (className.toLowerCase().endsWith(suffix.toLowerCase())) return className;
  return className + suffix;
}

/** 去掉用户已写的类型后缀，便于模板再拼接 `Packet` / `Capability` / `Renderer` */
export function stripJavaTypeSuffix(className: string, suffix: string): string {
  const re = new RegExp(`${suffix}$`, "i");
  const stripped = className.replace(re, "");
  return stripped || className;
}

export interface GeneratorResult {
  code: string | null;
  files?: Record<string, string>;
  warnings?: string[];
  errors?: string[];
  experimental?: boolean;
  /** 建议写入的相对工程路径（generate_* 包装后填充；默认仍只吐文本） */
  suggestedPath?: string | null;
  suggestedPaths?: string[];
}

export type PlatformTarget = "forge_1.20.1" | "neoforge_1.21";

/** 生成器白名单未覆盖时的统一改口（不发明 Java 模板）。 */
export function noNativeGeneratorError(docsTool: string, skillOrRule: string): string {
  return `该版本无原生生成器，不要理解为游戏里做不了。请改用 ${docsTool} 手动编写，参考 ${skillOrRule}。`;
}

export function docsToolForGeneratorPlatform(platform: string): string {
  const p = platform.trim().toLowerCase();
  if (p.startsWith("neoforge") || p === "neo") return "search_neoforge_docs";
  if (p.startsWith("fabric") || p === "quilt") return "search_fabric_docs";
  if (p.startsWith("forge")) return "search_forge_docs";
  return "search_*_docs";
}
