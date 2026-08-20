/**
 * 数据生成辅助模块
 *
 * Forge 1.20.1、NeoForge 1.21.x、NeoForge 26.1、Fabric/Quilt Loom。
 */

import { normalizeModIdentifier, toJavaClassName } from "./common.js";
import * as forge from "./forge-1.20.1.js";
import { generateFabric, type FabricProviderType } from "./fabric.js";
import { generateNeoForge21, type NeoForge21ProviderType } from "./neoforge-1.21.js";
import { generateNeoForge215, type NeoForge215ProviderType } from "./neoforge-1.21.5.js";
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

/** NeoForge 1.21.0–1.21.4：GatherDataEvent + addProvider（非 Client 分轨）。 */
export function parseNeo21Patch(version: string): number | null {
  const v = version.trim();
  if (/^26\.1/.test(v)) return null;
  if (v === "1.21" || v === "21" || /^21\./.test(v)) return 0;
  const m = v.match(/^1\.21(?:\.(\d+))?$/);
  if (!m) return null;
  return m[1] ? Number(m[1]) : 0;
}

export function isNeoForge21LegacyDatagen(platform: string, version: string): boolean {
  if (platform !== "neoforge") return false;
  const patch = parseNeo21Patch(version);
  return patch !== null && patch >= 0 && patch <= 4;
}

/** NeoForge 1.21.5–1.21.10：GatherDataEvent.Client + createProvider + RecipeProvider.Runner。 */
export function isNeoForge21ClientDatagen(platform: string, version: string): boolean {
  if (platform !== "neoforge") return false;
  const patch = parseNeo21Patch(version);
  return patch !== null && patch >= 5 && patch <= 10;
}

export function isNeoForge2111Datagen(platform: string, version: string): boolean {
  if (platform !== "neoforge") return false;
  return parseNeo21Patch(version) === 11;
}

export function isNeoForge21Platform(platform: string, version: string): boolean {
  return (
    isNeoForge21LegacyDatagen(platform, version) ||
    isNeoForge21ClientDatagen(platform, version) ||
    isNeoForge2111Datagen(platform, version)
  );
}

function isUnsupportedNeoForge21(platform: string, version: string): boolean {
  if (platform !== "neoforge") return false;
  const v = version.trim();
  if (/^26\.1/.test(v)) return false;
  if (!v.startsWith("1.21") && v !== "21" && !/^21\./.test(v)) return false;
  return !isNeoForge21Platform(platform, version);
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
      errors: [
        "platform is required（forge | neoforge | fabric | quilt），禁止默认 forge。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_*_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。",
      ],
    };
  }
  if (!version?.trim()) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        "version is required，禁止默认 1.20.1。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_*_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。",
      ],
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
          `尚无 Fabric/Quilt Datagen 模板覆盖 version=${ver}。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_fabric_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。不要生成 Forge DataGen。`,
        ],
      };
    }
  }
  const neoLegacy = isNeoForge21LegacyDatagen(platform, ver);
  const neoClient = isNeoForge21ClientDatagen(platform, ver);
  const neo2111 = isNeoForge2111Datagen(platform, ver);
  const neo261 = isNeoForge261Platform(platform, ver);
  if (platform === "neoforge" && isUnsupportedNeoForge21(platform, ver)) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `NeoForge Datagen 无 version=${ver} 模板（1.21.0–1.21.4 为 GatherDataEvent+addProvider；1.21.5+ 为 GatherDataEvent.Client+createProvider；1.21.11/26.1 用 Identifier）。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_neoforge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。`,
      ],
    };
  }
  if (platform === "neoforge" && ver !== "1.20.1" && !neoLegacy && !neoClient && !neo2111 && !neo261) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        "NeoForge Datagen 当前支持 1.21.0–1.21.11 与 26.1 分档模板。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_neoforge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。",
      ],
    };
  }
  if (platform === "forge" && ver !== "1.20.1") {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `Forge Datagen 模板仅覆盖 1.20.1（当前 version=${ver}）。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_forge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。1.12.2 无 DataGen，不要套用 1.21 ResourceLocation.fromNamespaceAndPath。`,
      ],
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
  } else if (platform === "neoforge" && neo2111) {
    code = generateNeoForge215(providerType as NeoForge215ProviderType, modId, targetName, classBase, "Identifier");
  } else if (platform === "neoforge" && neoClient) {
    code = generateNeoForge215(providerType as NeoForge215ProviderType, modId, targetName, classBase, "ResourceLocation");
  } else if (platform === "neoforge" && neoLegacy) {
    code = generateNeoForge21(providerType as NeoForge21ProviderType, modId, targetName, classBase);
  } else {
    if (platform === "neoforge" && ver === "1.20.1") {
      warnings.push(
        "NeoForge 1.20.1 Datagen 复用 Forge 1.20.1 模板骨架；import 跟工程包名与 search_neoforge_docs(version=1.20.1)，禁止默写。不要用 1.20.4+ DeferredBlock / Attachment。",
      );
    }
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
