/**
 * 数据生成辅助模块
 *
 * Forge 1.20.1、NeoForge 1.21.x、NeoForge 26.1、Fabric Loom。
 */

import { isExactMcVersionToken, isMcVersionFamily } from "../utils/minecraft-version.js";
import { ownGet } from "../utils/own-record.js";
import { normalizeModIdentifier, toJavaClassName } from "./common.js";
import * as forge from "./forge-1.20.1.js";
import { generateFabric, type FabricProviderType, type FabricIdStyle } from "./fabric.js";
import { generateNeoForge21, type NeoForge21ProviderType } from "./neoforge-1.21.js";
import { generateNeoForge215, type NeoForge215ProviderType } from "./neoforge-1.21.5.js";
import { generateNeoForge261, type NeoForge261ProviderType } from "./neoforge-26.1.js";
import * as neo1204 from "./neoforge-1.20.4.js";
import * as forge1204Dg from "./forge-1.20.4.js";

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
    | "sound"
    | "language";
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
  if (isMcVersionFamily(v, "26.1")) return null;
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
  if (isMcVersionFamily(v, "26.1")) return false;
  if (!/^1\.21(\.|$)/.test(v)) return false;
  return !isNeoForge21Platform(platform, version);
}

export function isNeoForge261Platform(platform: string, version: string): boolean {
  return platform === "neoforge" && isMcVersionFamily(version.trim(), "26.1");
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

// 有 recipe 骨架的 Fabric 档。注意：这里只表示「本档可发骨架」，不表示映射 ——
// `generate(RecipeExporter)` / `buildRecipes(RecipeOutput)` 是 Yarn↔Mojmap 的差异，不是版本差异
// （Mojang 官方 client.txt 1.21.1–1.21.11 均有 `buildRecipes`，`RecipeExporter` 类在 mojmap 不存在）。
const FABRIC_DATAGEN_RECIPE_VERSIONS = new Set(["1.21.1", "1.21.3", "1.21.4", "1.21.8", "1.21.10", "1.21.11"]);

// 「层数」是**真的版本差异**（与上面的映射轴正交）：1.21.3 起 vanilla `RecipeProvider` 的
// `buildRecipes()` 改为无参、`RecipeOutput` 存成字段，`FabricRecipeProvider` 唯一要实现的抽象方法
// 变成 `createRecipeProvider(HolderLookup.Provider, RecipeOutput)` → 返回一个 vanilla 生成器。
// 证据：① Mojang 官方 client.txt（piston-meta `client_mappings`）1.21.1 = `void buildRecipes(RecipeOutput)`，
// 1.21.3 = `RecipeOutput output` 字段 + `void buildRecipes()`；
// ② `mcp-server/data/loader-api-summaries/*-fabric-api.json` 里 FabricRecipeProvider 的抽象方法
// 1.21.1 = `void method_10419(class_8790)`，1.21.3/1.21.11 = `class_2446 method_62766(class_7225.class_7874, class_8790)`
// （= `RecipeProvider createRecipeProvider(HolderLookup.Provider, RecipeOutput)`，与 26.1.2 已具名条目同签名）；
// ③ `fabric/1.21.11/.cursor/rules/07-datagen.mdc:155-159` 明确把单层带参写法列为「1.21.11 不存在，编译器直接拒」。
const FABRIC_RECIPE_TWO_LAYER_VERSIONS = new Set(["1.21.3", "1.21.4", "1.21.8", "1.21.10", "1.21.11"]);

/**
 * C-17：白名单外的 Fabric 1.21.x 档**逐个**给出拒因（不允许只回「尚无模板」）。
 * 为什么不直接把这些档加进 FABRIC_DATAGEN_RECIPE_VERSIONS：三处独立测量一致表明
 * 「本仓库对该档零语料」，骨架里的类名/方法名无处可核：
 *  ① `ls data | grep fabric_1.21` → 只有 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11；
 *     1.21.2 / 1.21.5 / 1.21.6 / 1.21.7 / 1.21.9 **无目录**。
 *  ② `find data -name yarn-mappings.sqlite` → 同样只覆盖上面 6 档（`mcp-server/data/fabric_1.21.4/mappings/`
 *     实有 yarn-1.21.4+build.8-tiny.gz + yarn-mappings.sqlite；1.21.2/6/7/9 连目录都没有）。
 *  ③ `ls fabric`（技能语料）→ 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 / 26.1.2 有
 *     `.cursor/rules/07-datagen.mdc`；1.21.2 / 1.21.6 / 1.21.7 / 1.21.9 **无版本目录**。
 * 另：本地 `data/<loader>_<ver>/mappings/client.txt` 只有 forge_1.16.5–1.20.4（实测 ls），1.21.x 无 Mojang 官方
 * client.txt 可核 → 单层/两层归属只能按「1.21.3 起两层」外推，属推定而非核实。
 * 结论：不白名单化（无据可核就发骨架=编造 API），改为把拒因逐档写清。
 * // TODO(未核实)：1.20.1 / 1.20.4 虽在 ①②③ 都有语料，但仍不在 recipe 白名单，
 *   其「不发骨架」的具体原因本波没核到，沿用中性兜底文案，不编造。
 */
const FABRIC_DATAGEN_UNVERIFIED_REASONS: Record<string, string> = {
  "1.21.2":
    "1.21.2：夹在 1.21.1（单层 buildRecipes(RecipeOutput)）与 1.21.3（两层 createRecipeProvider）之间，" +
    "本仓库无 data/fabric_1.21.2 目录、无 fabric_1.21.2/mappings/yarn-mappings.sqlite、无 fabric/1.21.2 规则档，" +
    "该档落在哪一层无从核实；签名不猜就不发骨架。",
  "1.21.5":
    "1.21.5：本仓库无 data/fabric_1.21.5 目录、无 yarn-mappings.sqlite、无 fabric/1.21.5 规则档，" +
    "RecipeProvider 构造签名未核到（旧文案所谓「无官方页」即此意），不发骨架。",
  "1.21.6":
    "1.21.6：按「1.21.3 起两层」外推应为 createRecipeProvider + 无参 buildRecipes，" +
    "但本仓库无 data/fabric_1.21.6、无 yarn-mappings.sqlite、无 fabric/1.21.6 规则档，属推定未核实。",
  "1.21.7":
    "1.21.7：同 1.21.6 —— 两层形态为外推，且本仓库无 data/fabric_1.21.7、无 yarn-mappings.sqlite、" +
    "无 fabric/1.21.7 规则档，未逐档核实。",
  "1.21.9":
    "1.21.9：相邻的 1.21.8 与 1.21.10 都在白名单，但本仓库独缺 data/fabric_1.21.9（无目录、" +
    "无 yarn-mappings.sqlite、无 fabric/1.21.9 规则档），两档之间的 1.21.9 不能默认同签名。",
};

function isFabricDatagenVersion(version: string): boolean {
  const v = version.trim();
  if (isMcVersionFamily(v, "26.1")) return true;
  return FABRIC_DATAGEN_RECIPE_VERSIONS.has(v);
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
  if (!isExactMcVersionToken(ver)) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `version 必须是精确 MC 版本（如 1.21.3 / 26.1），收到 ${ver}。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_*_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。`,
      ],
    };
  }
  if (platform === "quilt") {
    // D-2/D-3 门闩：quilt 各档均无 07-datagen 规则、无可核 QFAPI datagen 签名 → 不给成功路径。
    const qslNote = ["1.18.2", "1.19.4", "1.20.1", "1.20.4"].includes(ver)
      ? `QFAPI ${ver} 线的历史构件不含可核 datagen 教程（本档也无 07 规则）。`
      : `QSL/QFAPI 在 ${ver} 无任何已发布构件（QSL 已于 2025-12 停更）`;
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        `Quilt Datagen 无已核实签名，不生成骨架：${qslNote} 不要吐 Fabric API / Forge DataGen 冒充。` +
          "两条路：① 工程声明 fabric-api 时按同版 Fabric DataGen 手写（search_fabric_docs version=" +
          ver +
          "）；② 纯手写 data/ JSON。参考规则 07-datagen / mc-datagen Skill。该版本无原生生成器，不要理解为游戏里做不了。",
      ],
    };
  }
  if (platform === "neoforge" && ver === "1.20.1") {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        "NeoForge 1.20.1 是 Forge 兼容层，Datagen 包名必须跟工程，禁止默写 net.minecraftforge.data.event.GatherDataEvent。请改用 search_neoforge_docs(version=1.20.1) 手写。该版本无原生生成器，不要理解为游戏里做不了。",
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
          `尚无 Fabric Datagen 模板覆盖 version=${ver}。` +
            (ownGet(FABRIC_DATAGEN_UNVERIFIED_REASONS, ver) ??
              `本仓库对该档没有已核实的 Fabric Datagen 骨架（RecipeProvider 签名未逐档核实）。`) +
            ` 已核实可发骨架的档：${[...FABRIC_DATAGEN_RECIPE_VERSIONS].join(" / ")} 与 26.1*。` +
            `该版本无原生生成器，不要理解为游戏里做不了。请改用 search_fabric_docs 手动编写，` +
            `参考规则 07-datagen / mc-datagen Skill。不要生成 Forge DataGen。`,
        ],
      };
    }
  }
  const neoLegacy = isNeoForge21LegacyDatagen(platform, ver);
  const neoClient = isNeoForge21ClientDatagen(platform, ver);
  const neo2111 = isNeoForge2111Datagen(platform, ver);
  const neo261 = isNeoForge261Platform(platform, ver);
  if (providerType === "language" && !(platform === "neoforge" && neo261)) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: ["language provider 仅 NeoForge 26.1 接线；其它档请用 search_*_docs 手写 LanguageProvider。"],
    };
  }
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
        `Forge Datagen 模板仅覆盖 1.20.1（Consumer<FinishedRecipe>）与 1.20.4（仅 recipe，buildRecipes(RecipeOutput)）；当前 version=${ver}。1.19.4 / 1.18.2 未核到 RecipeProvider 构造签名故不写；1.12.2 无 DataGen。该版本无原生生成器，不要理解为游戏里做不了。请改用 search_forge_docs 手动编写，参考规则 07-datagen / mc-datagen Skill。`,
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
  const classBase = toJavaClassName(query.modId);

  let code: string;
  try {
    if (platform === "fabric") {
    // Mojmap：1.21.10→1.21.11 之间 ResourceLocation 改名为 Identifier（net.minecraft.resources）
    const idStyle: FabricIdStyle = ver === "1.21.11" || isMcVersionFamily(ver, "26.1") ? "Identifier" : "ResourceLocation";
    code = generateFabric(
      providerType as FabricProviderType,
      modId,
      targetName,
      classBase,
      isMcVersionFamily(ver, "26.1"),
      idStyle,
      FABRIC_RECIPE_TWO_LAYER_VERSIONS.has(ver),
    );
    if (ver !== "1.21.11" && !isMcVersionFamily(ver, "26.1")) {
      code = prependDocsReview(code, "search_fabric_docs", ver);
      warnings.push(`Fabric ${ver} Datagen：骨架为 Mojmap 名，请 search_fabric_docs version=${ver} 复核。`);
    }
    if (providerType === "particle" || providerType === "sound") {
      warnings.push(
        `Fabric 无独立 ${providerType} DataGen Provider；骨架仅为资源路径注释，请 search_fabric_docs 手写 JSON。`,
      );
    }
    if (idStyle === "Identifier") {
      warnings.push(
        `Fabric ${ver} Mojmap 已改名：TagKey 用 net.minecraft.resources.Identifier.fromNamespaceAndPath（1.21.11 起，非 Yarn 的 net.minecraft.util.Identifier/of）。`,
      );
    }
    if (providerType === "recipe" && !isMcVersionFamily(ver, "26.1")) {
      warnings.push(
        `Mojmap 骨架：buildRecipes。Yarn 工程整段换成 generate(RecipeExporter)（同类同名差异，非版本差异）；禁止同一文件混映射。本档名以 get_minecraft_source version=${ver} mapping=mojmap 为准，禁止读邻档规则。`,
      );
      if (ver === "1.21.1") {
        warnings.push(
          `Fabric ${ver}：本档 recipe 为**单层**形态（RecipeProvider.buildRecipes(RecipeOutput) 带参，Mojang client.txt 实测）；1.21.3 起改为两层（createRecipeProvider + 无参 buildRecipes），不要跨版套用。`,
        );
      }
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
  } else if (platform === "forge" && forge1204) {
    if (providerType !== "recipe") {
      return {
        code: null,
        usedModId: modId,
        usedTargetName: targetName,
        errors: [
          `Forge 1.20.4 Datagen 本波仅核实 RecipeProvider（一参 PackOutput + buildRecipes(RecipeOutput)，依据 data/forge_1.20.4/extracted 索引）。providerType=${providerType} 请 search_forge_docs(version=1.20.4) 手写。`,
        ],
        warnings: warnings.length ? warnings : undefined,
      };
    }
    code = forge1204Dg.generateRecipe(modId, targetName, classBase);
    warnings.push(
      "Forge 1.20.4（vanilla 1.20.2+）：buildRecipes(RecipeOutput)，FinishedRecipe 类已不存在；不要抄 1.20.1 的 Consumer<FinishedRecipe>。",
    );
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
    if (code) {
      code = prependDocsReview(code, "search_forge_docs", "1.20.1");
    }
  }
  } catch (e) {
    return {
      code: null,
      usedModId: modId,
      usedTargetName: targetName,
      errors: [(e as Error).message],
      warnings: warnings.length ? warnings : undefined,
    };
  }

  return {
    code,
    usedModId: modId,
    usedTargetName: targetName,
    warnings: warnings.length ? warnings : undefined,
  };
}
