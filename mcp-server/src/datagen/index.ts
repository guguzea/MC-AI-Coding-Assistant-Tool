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
import * as neo1204 from "./neoforge-1.20.4.js";

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

/** NeoForge 1.21.0–1.21.4：GatherDataEvent + addProvider（非 Client 分轨）。只认 Minecraft 版本 1.21 / 1.21.x；Neo 构建号 21.1.x 返回 null。 */
export function parseNeo21Patch(version: string): number | null {
  const v = version.trim();
  if (/^26\.1/.test(v)) return null;
  if (v === "1.21") return 0;
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

function looksLikeNeoForgeBuildNumber(version: string): boolean {
  const v = version.trim();
  return /^(20|21)\.\d/.test(v) && !v.startsWith("1.");
}

function isUnsupportedNeoForge21(platform: string, version: string): boolean {
  if (platform !== "neoforge") return false;
  const v = version.trim();
  if (/^26\.1/.test(v)) return false;
  if (!v.startsWith("1.21")) return false;
  return !isNeoForge21Platform(platform, version);
}

export function isNeoForge261Platform(platform: string, version: string): boolean {
  return platform === "neoforge" && /^26\.1/.test(version.trim());
}

function isNeoForge1204Datagen(platform: string, version: string): boolean {
  return platform === "neoforge" && /^1\.20\.4/.test(version.trim());
}

function isNeoForge1206Datagen(platform: string, version: string): boolean {
  return platform === "neoforge" && /^1\.20\.6/.test(version.trim());
}

function isForge1204Datagen(platform: string, version: string): boolean {
  return platform === "forge" && /^1\.20\.4/.test(version.trim());
}

const FABRIC_DATAGEN_GENERATE = new Set(["1.21.1", "1.21.4", "1.21.8"]);
const FABRIC_DATAGEN_BUILD_RECIPES = new Set(["1.21.10", "1.21.11"]);

function fabricDatagenRecipeMethod(version: string): "generate" | "buildRecipes" | null {
  const v = version.trim();
  if (FABRIC_DATAGEN_GENERATE.has(v)) return "generate";
  if (FABRIC_DATAGEN_BUILD_RECIPES.has(v)) return "buildRecipes";
  return null;
}

function isFabricDatagenVersion(version: string): boolean {
  const v = version.trim();
  if (/^26\.1/.test(v)) return true;
  return fabricDatagenRecipeMethod(v) !== null;
}

function prependDocsReview(code: string, tool: string, version: string): string {
  const line = `// 修改此骨架前必须用 ${tool}(version=${version}) 复核；禁止邻档 API。`;
  if (code.startsWith(line)) return code;
  return `${line}\n${code}`;
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
  if (platform === "neoforge" && looksLikeNeoForgeBuildNumber(ver)) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `version=${ver} 看起来是 NeoForge 构建号，不是 Minecraft 版本。请传 Minecraft 版本（如 1.21.1 / 1.21.8 / 26.1），不要传 21.1.x。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_neoforge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。`,
      ],
    };
  }
  if (platform === "quilt") {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `Quilt Datagen 无足够 QSL/QFAPI 类名可写专用骨架（当前 version=${ver}）。不要吐 Fabric API / Forge DataGen。请改用 search_docs platform=quilt 手写。该版本无原生生成器，不要理解为游戏里做不了。`,
      ],
    };
  }
  if (platform === "fabric") {
    if (!isFabricDatagenVersion(ver)) {
      return {
        code: null,
        usedModId: query.modId,
        usedTargetName: query.targetName,
        errors: [
          `尚无 Fabric Datagen 模板覆盖 version=${ver}（已核实：1.21.1 / 1.21.4 / 1.21.8 为 generate()；1.21.10 / 1.21.11 为 buildRecipes；26.1*）。1.20.1 / 1.20.4 / 1.21.5 无官方页或核不到签名。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_fabric_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。不要生成 Forge DataGen。`,
        ],
      };
    }
  }
  const neoLegacy = isNeoForge21LegacyDatagen(platform, ver);
  const neoClient = isNeoForge21ClientDatagen(platform, ver);
  const neo2111 = isNeoForge2111Datagen(platform, ver);
  const neo261 = isNeoForge261Platform(platform, ver);
  const neo1204Dg = isNeoForge1204Datagen(platform, ver);
  const neo1206 = isNeoForge1206Datagen(platform, ver);
  const forge1204 = isForge1204Datagen(platform, ver);
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
  if (
    platform === "neoforge" &&
    ver !== "1.20.1" &&
    !neoLegacy &&
    !neoClient &&
    !neo2111 &&
    !neo261 &&
    !neo1204Dg &&
    !neo1206
  ) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        "NeoForge Datagen 当前支持 1.20.4 / 1.20.6（均仅 recipe）/ 1.21.0–1.21.11 与 26.1。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_neoforge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。",
      ],
    };
  }
  if (platform === "forge" && ver !== "1.20.1" && !forge1204) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `Forge Datagen 模板仅覆盖 1.20.1 与 1.20.4（FinishedRecipe；当前 version=${ver}）。1.19.4 / 1.18.2 未核到 RecipeProvider 构造签名故不写；1.12.2 无 DataGen。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_forge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。不要套用 1.21 ResourceLocation.fromNamespaceAndPath / RecipeOutput。`,
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
  if (platform === "fabric") {
    const recipeMethod = fabricDatagenRecipeMethod(ver) ?? "buildRecipes";
    code = generateFabric(
      providerType as FabricProviderType,
      modId,
      targetName,
      classBase,
      /^26\.1/.test(ver),
      recipeMethod,
    );
    if (ver !== "1.21.11" && !/^26\.1/.test(ver)) {
      code = prependDocsReview(code, "search_fabric_docs", ver);
      warnings.push(`Fabric ${ver} Datagen：recipe 方法为 ${recipeMethod}（search_fabric_docs version=${ver}）。`);
    }
    if (providerType === "recipe" && !/^26\.1/.test(ver)) {
      warnings.push(
        "Mojmap 骨架参数类型为 RecipeOutput；Yarn 工程请改为 RecipeExporter。禁止混映射。",
      );
    }
  } else if (platform === "neoforge" && neo261) {
    code = generateNeoForge261(providerType as NeoForge261ProviderType, modId, targetName, classBase);
  } else if (platform === "neoforge" && neo2111) {
    code = generateNeoForge215(providerType as NeoForge215ProviderType, modId, targetName, classBase, "Identifier");
  } else if (platform === "neoforge" && neoClient) {
    code = generateNeoForge215(providerType as NeoForge215ProviderType, modId, targetName, classBase, "ResourceLocation");
  } else if (platform === "neoforge" && neoLegacy) {
    code = generateNeoForge21(providerType as NeoForge21ProviderType, modId, targetName, classBase);
  } else if (platform === "neoforge" && neo1206) {
    if (providerType !== "recipe") {
      return {
        code: null,
        usedModId: modId,
        usedTargetName: targetName,
        errors: [
          `NeoForge 1.20.6 Datagen 本波仅核实 RecipeProvider（两参 PackOutput + HolderLookup，buildRecipes(RecipeOutput)）。providerType=${providerType} 请 search_neoforge_docs(version=1.20.6) 手写。`,
        ],
        warnings: warnings.length ? warnings : undefined,
      };
    }
    code = prependDocsReview(
      generateNeoForge21(providerType as NeoForge21ProviderType, modId, targetName, classBase),
      "search_neoforge_docs",
      "1.20.6",
    );
    warnings.push("NeoForge 1.20.6 RecipeProvider 为两参 PackOutput + HolderLookup，buildRecipes(RecipeOutput)；与 1.21.0–1.21.4 核实一致。");
  } else if (platform === "neoforge" && neo1204Dg) {
    if (providerType !== "recipe") {
      return {
        code: null,
        usedModId: modId,
        usedTargetName: targetName,
        errors: [
          `NeoForge 1.20.4 Datagen 本波仅核实 RecipeProvider（一参 PackOutput + RecipeOutput）。providerType=${providerType} 请 search_neoforge_docs(version=1.20.4) 手写。`,
        ],
        warnings: warnings.length ? warnings : undefined,
      };
    }
    code = neo1204.generateRecipe(modId, targetName, classBase);
    warnings.push("NeoForge 1.20.4 RecipeProvider 是一参 PackOutput，不要抄 1.21 两参构造。");
  } else {
    if (platform === "neoforge" && ver === "1.20.1") {
      warnings.push(
        "NeoForge 1.20.1 Datagen 复用 Forge 1.20.1 模板骨架；import 跟工程包名与 search_neoforge_docs(version=1.20.1)，禁止默写。不要用 1.20.4+ DeferredBlock / Attachment。",
      );
    }
    if (forge1204) {
      warnings.push(
        "Forge 1.20.4 Datagen 文档路由为 1.20.x；RecipeProvider 为 FinishedRecipe + MyRecipeProvider::new（与 1.20.1 核实一致）。禁止抄 1.21 RecipeOutput。",
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
    if (forge1204) {
      code = prependDocsReview(code, "search_forge_docs", "1.20.4");
    }
  }

  return {
    code,
    usedModId: modId,
    usedTargetName: targetName,
    warnings: warnings.length ? warnings : undefined,
  };
}
