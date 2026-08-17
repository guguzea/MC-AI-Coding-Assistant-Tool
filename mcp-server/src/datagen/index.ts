/**
 * 数据生成辅助模块
 *
 * Forge 1.20.1、NeoForge 1.21.x、NeoForge 26.1、Fabric/Quilt Loom。
 */

import { normalizeModIdentifier, toJavaClassName } from "./common.js";
import * as forge from "./forge-1.20.1.js";
import { generateFabric, type FabricProviderType } from "./fabric.js";
import { generateNeoForge21, type NeoForge21ProviderType } from "./neoforge-1.21.js";
import { generateNeoForge261, type NeoForge261ProviderType } from "./neoforge-26.1.js";

export { normalizeModIdentifier, toJavaClassName } from "./common.js";

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
  platform?: "forge" | "neoforge" | "fabric" | "quilt";
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

export function isNeoForge261Platform(platform: string, version: string): boolean {
  return platform === "neoforge" && /^26\.1/.test(version.trim());
}

export function generateDatagen(query: DatagenQuery): DatagenResult {
  const { providerType, version, platform } = query;
  const warnings: string[] = [];

  if (!platform) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: ["platform is required（forge | neoforge | fabric | quilt），禁止默认 forge"],
    };
  }
  if (!version?.trim()) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: ["version is required，禁止默认 1.20.1"],
    };
  }
  const ver = version.trim();
  if (platform === "fabric" || platform === "quilt") {
    const fabric21 = ver.startsWith("1.21");
    const fabric261 = /^26\.1/.test(ver);
    if (!fabric21 && !fabric261) {
      return {
        code: null,
        usedModId: query.modId,
        usedTargetName: query.targetName,
        errors: [
          `尚无 Fabric/Quilt Datagen 模板覆盖 version=${ver}。请用 search_fabric_docs / 该档 07-datagen，不要生成 Forge DataGen。`,
        ],
      };
    }
  }
  const neo21 = isNeoForge21Platform(platform, ver);
  const neo261 = isNeoForge261Platform(platform, ver);
  if (platform === "neoforge" && !neo21 && !neo261) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: ["NeoForge Datagen 当前仅支持 1.21.x 与 26.1 模板；其它版本请手写或查阅 search_neoforge_docs"],
    };
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
  const classBase = toJavaClassName(query.modId) || toJavaClassName(modId);

  let code: string;
  if (platform === "fabric" || platform === "quilt") {
    code = generateFabric(
      providerType as FabricProviderType,
      modId,
      targetName,
      classBase,
      /^26\.1/.test(ver),
    );
  } else if (platform === "neoforge" && neo261) {
    code = generateNeoForge261(providerType as NeoForge261ProviderType, modId, targetName, classBase);
  } else if (platform === "neoforge") {
    code = generateNeoForge21(providerType as NeoForge21ProviderType, modId, targetName, classBase);
  } else {
    switch (providerType) {
      case "recipe":
        code = forge.generateRecipe(modId, targetName, classBase);
        break;
      case "blockstate":
        code = forge.generateBlockState(modId, targetName, classBase);
        break;
      case "itemmodel":
        code = forge.generateItemModel(modId, targetName, classBase);
        break;
      case "loottable":
        code = forge.generateLootTable(modId, targetName, classBase);
        break;
      case "tag":
        code = forge.generateTag(modId, targetName, classBase);
        break;
      case "advancement":
        code = forge.generateAdvancement(modId, targetName, classBase);
        break;
      case "particle":
        code = forge.generateParticle(modId, targetName, classBase);
        break;
      case "sound":
        code = forge.generateSound(modId, targetName, classBase);
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
