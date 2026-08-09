/**
 * 数据生成辅助模块
 *
 * Forge 1.20.1 与 NeoForge 1.21.x 两套模板。
 *
 * 依据：
 * - data/forge_1.20.1/forge-docs/.../datagen_*.md
 * - data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/resources*.md
 */

import { normalizeModIdentifier } from "./common.js";
import * as forge from "./forge-1.20.1.js";
import { generateNeoForge21, type NeoForge21ProviderType } from "./neoforge-1.21.js";

export { normalizeModIdentifier } from "./common.js";

export interface DatagenQuery {
  providerType:
    | "recipe"
    | "blockstate"
    | "itemmodel"
    | "loottable"
    | "tag"
    | "advancement"
    | "particle"
    | "sound";
  modId: string;
  targetName: string;
  version?: string;
  platform?: "forge" | "neoforge";
}

export interface DatagenResult {
  code: string | null;
  usedModId: string;
  usedTargetName: string;
  warnings?: string[];
  errors?: string[];
}

export function isNeoForge21Platform(platform: string, version: string): boolean {
  if (platform !== "neoforge") return false;
  const v = version.trim();
  return v.startsWith("1.21") || v === "21" || /^21\./.test(v);
}

export function generateDatagen(query: DatagenQuery): DatagenResult {
  const { providerType, version = "1.20.1", platform = "forge" } = query;
  const warnings: string[] = [];
  const neo21 = isNeoForge21Platform(platform, version);

  if (platform === "neoforge" && !neo21) {
    warnings.push(
      "NeoForge datagen 模板面向 1.21.x；请将 version 设为 1.21.1（或 1.21*），否则仍输出 1.21 模板但可能与你项目版本不一致",
    );
  }

  const mod = normalizeModIdentifier(query.modId);
  const target = normalizeModIdentifier(query.targetName);
  if (!mod || !target) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        "无法归一化 modId/targetName：请使用字母开头，可含数字与下划线（非法字符会被尝试转为下划线）",
      ],
    };
  }
  if (mod.warned) {
    warnings.push(
      `modId "${query.modId}" 已归一化为 "${mod.value}"（Forge 虽偶允许 ./-，模板使用下划线更安全）`,
    );
  }
  if (target.warned) {
    warnings.push(`targetName "${query.targetName}" 已归一化为 "${target.value}"`);
  }

  const modId = mod.value;
  const targetName = target.value;

  let code: string;
  if (platform === "neoforge") {
    code = generateNeoForge21(providerType as NeoForge21ProviderType, modId, targetName);
  } else {
    switch (providerType) {
      case "recipe":
        code = forge.generateRecipe(modId, targetName);
        break;
      case "blockstate":
        code = forge.generateBlockState(modId, targetName);
        break;
      case "itemmodel":
        code = forge.generateItemModel(modId, targetName);
        break;
      case "loottable":
        code = forge.generateLootTable(modId, targetName);
        break;
      case "tag":
        code = forge.generateTag(modId, targetName);
        break;
      case "advancement":
        code = forge.generateAdvancement(modId, targetName);
        break;
      case "particle":
        code = forge.generateParticle(modId, targetName);
        break;
      case "sound":
        code = forge.generateSound(modId, targetName);
        break;
      default:
        return {
          code: null,
          usedModId: modId,
          usedTargetName: targetName,
          errors: [`Unknown provider type: ${providerType}`],
          warnings: warnings.length ? warnings : undefined,
        };
    }
  }

  return {
    code,
    usedModId: modId,
    usedTargetName: targetName,
    warnings: warnings.length ? warnings : undefined,
  };
}
