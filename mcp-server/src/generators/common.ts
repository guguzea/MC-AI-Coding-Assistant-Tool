export { normalizeModIdentifier, toJavaClassName } from "../datagen/common.js";

import { isExactMcVersionToken, matchesExactMcVersion } from "../utils/minecraft-version.js";

/** 精确 MC 版本 token（禁止 1.20.4beta / 1.2100 无锚混入）。 */
export function exactMcVersion(s: string): boolean {
  return isExactMcVersionToken(s);
}

export { matchesExactMcVersion };

/**
 * W2-1（2026-09-21）：MC 时代**上界**哨兵（与 generate_worldgen 的 N6 同形）。
 * `exactMcVersion` 只判「是不是 x.y.z 形」，`1.99.9` / `26.99.9` 这类编造 version 会一路生成成功
 * （旧病：generate_model / generate_lang / generate_config 的 fabric 分支接受 1.99.9 并回 ok:true + files）。
 * 本仓 as-of 2026-09-21 只核到 1.x 的 1.21.x 与 26.1.x；超出即拒 —— 上游出新代时抬常量并附依据。
 */
export const MC_MAX_MINOR_1X = 21;
export const MC_MAX_MINOR_26X = 1;

/** 通过则返回 null；否则返回可直接拼进 errors 的说明。 */
export function eraUpperBoundError(version: string): string | null {
  const v = version.trim();
  if (/^1\./.test(v)) {
    const mm = v.match(/^1\.(\d+)(?:\.(\d+))?$/);
    const minor = mm ? Number(mm[1]) : 0;
    if (minor > MC_MAX_MINOR_1X) {
      return `未跟进 1.${minor}.x（本仓 as-of 2026-09-21 只核到 1.${MC_MAX_MINOR_1X}.x）—— 禁止默默生成；先按 search_*_docs 核该代格式，再抬 MC_MAX_MINOR_1X。`;
    }
    return null;
  }
  if (/^26\./.test(v)) {
    const mm = v.match(/^26\.(\d+)/);
    const minor = mm ? Number(mm[1]) : 0;
    if (minor > MC_MAX_MINOR_26X) {
      return `未跟进 26.${minor}.x（本仓 as-of 2026-09-21 只核到 26.${MC_MAX_MINOR_26X}.x）—— 禁止默默生成；先按 search_*_docs 核该代格式，再抬 MC_MAX_MINOR_26X。`;
    }
    return null;
  }
  return `只认 1.x 与 26.x 的精确 MC 版本，收到 ${version}。`;
}

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
