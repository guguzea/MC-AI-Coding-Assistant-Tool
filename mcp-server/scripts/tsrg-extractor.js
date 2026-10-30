#!/usr/bin/env node
/**
 * tsrg-extractor.js
 * 从 joined.tsrg 提取类名/方法名/字段名映射，
 * 生成供 MCP Server 使用的高效索引文件。
 *
 * TSRG 格式：
 *   CLASS  obfuscated mapped
 *   FIELD  obfuscated desc mapped
 *   METHOD obfuscated desc mapped
 *
 * 运行：
 *   node scripts/tsrg-extractor.js --version=1.13.2
 *   node scripts/tsrg-extractor.js --version=1.14.4
 *
 * 边界：MCPConfig 的 joined.tsrg 是 **vanilla-only**（Forge 的 patch 与 Forge 类不在其中），
 * 所以 critical-classes 的 Forge 条目在本工件里恒为 null；这里按版本代选 vanilla 路径表。
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CLI ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];

if (!versionArg) {
  console.error("用法: node tsrg-extractor.js --version=1.13.2");
  process.exit(1);
}

// ── 路径配置 ────────────────────────────────────────────────────────────

const EXTRACTED = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "extracted");

// joined.tsrg 位置：从 MCP config zip 解压后的 config/joined.tsrg
// 但我们把它复制到了 mappings/ 根目录
const TSRG_PATH = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "mappings", "joined.tsrg");

// ── 关键 Forge 类（高精度索引）────────────────────────────────────────────
// 1.16+ 的官方/SRG 路径表（1.16.5 那档走 parchment-extractor，本表只作 1.16+ 的 joined.tsrg 兜底）
const CRITICAL_CLASSES = new Set([
  "net/minecraftforge/registries/DeferredRegister",
  "net/minecraftforge/registries/ForgeRegistries",
  "net/minecraftforge/registries/RegistryObject",
  "net/minecraftforge/registries/IForgeRegistry",
  "net/minecraft/world/item/Item",
  "net/minecraft/world/item/BlockItem",
  "net/minecraft/world/item/SwordItem",
  "net/minecraft/world/item/PickaxeItem",
  "net/minecraft/world/item/AxeItem",
  "net/minecraft/world/item/HoeItem",
  "net/minecraft/world/item/ShovelItem",
  "net/minecraft/world/item/ArmorItem",
  "net/minecraft/world/item/FoodProperties",
  "net/minecraft/world/block/Block",
  "net/minecraft/world/block/state/BlockBehaviour",
  "net/minecraft/world/tileentity/BlockEntity",
  "net/minecraft/world/tileentity/BlockEntityType",
  "net/minecraft/world/entity/Entity",
  "net/minecraft/world/entity/LivingEntity",
  "net/minecraft/world/entity/Mob",
  "net/minecraft/world/entity/animal/Animal",
  "net/minecraft/world/entity/projectile/Projectile",
  "net/minecraft/world/entity/EntityType",
  "net/minecraft/world/entity/ai/attributes/Attribute",
  "net/minecraft/world/entity/ai/attributes/RangedAttribute",
  "net/minecraftforge/common/capabilities/Capability",
  "net/minecraftforge/common/capabilities/CapabilityManager",
  "net/minecraftforge/common/capabilities/ICapabilityProvider",
  "net/minecraftforge/common/capabilities/ICapabilitySerializable",
  "net/minecraftforge/common/capabilities/LazyOptional",
  "net/minecraftforge/fml/common/eventhandler/Event",
  "net/minecraftforge/fml/common/eventhandler/SubscribeEvent",
  "net/minecraftforge/network/NetworkRegistry",
  "net/minecraftforge/network/simple/SimpleChannel",
  "net/minecraftforge/network/handshake/NetworkDispatcher",
  "net/minecraft/world/item/crafting/RecipeSerializer",
  "net/minecraft/data/recipes/RecipeProvider",
  "net/minecraft/data/recipes/ShapedRecipeBuilder",
  "net/minecraft/data/recipes/ShapelessRecipeBuilder",
  "net/minecraft/data/loot/LootTableProvider",
  "net/minecraft/data/loot/LootPool",
  "net/minecraftforge/common/data/LanguageProvider",
]);

// 1.13–1.15 的 SRG 路径表（1.17 才把 item/block/entity 挪进 world/，Mob 也从 MobEntity 改名）。
// 逐条在 1.14.4 + 1.15.2 的 joined.tsrg 里实证存在；Forge 类不在 MCPConfig 里 ⇒ 本表只列 vanilla。
const CRITICAL_CLASSES_LEGACY = new Set([
  "net/minecraft/item/Item",
  "net/minecraft/item/BlockItem",
  "net/minecraft/item/SwordItem",
  "net/minecraft/item/PickaxeItem",
  "net/minecraft/item/AxeItem",
  "net/minecraft/item/HoeItem",
  "net/minecraft/item/ShovelItem",
  "net/minecraft/item/ArmorItem",
  "net/minecraft/item/Food",
  "net/minecraft/block/Block",
  "net/minecraft/block/BlockState",
  "net/minecraft/tileentity/TileEntity",
  "net/minecraft/tileentity/TileEntityType",
  "net/minecraft/entity/Entity",
  "net/minecraft/entity/LivingEntity",
  "net/minecraft/entity/MobEntity",
  "net/minecraft/entity/passive/AnimalEntity",
  "net/minecraft/entity/EntityType",
  "net/minecraft/entity/ai/attributes/Attribute",
  "net/minecraft/entity/ai/attributes/RangedAttribute",
  "net/minecraft/item/crafting/IRecipeSerializer",
  "net/minecraft/data/RecipeProvider",
  "net/minecraft/data/ShapedRecipeBuilder",
  "net/minecraft/data/ShapelessRecipeBuilder",
]);

const CRITICAL = /^1\.(?:13|14|15)\b/.test(versionArg) ? CRITICAL_CLASSES_LEGACY : CRITICAL_CLASSES;

// ── 解析 TSRG ────────────────────────────────────────────────────────────

console.log(`Loading ${TSRG_PATH}...`);
const raw = readFileSync(TSRG_PATH, "utf-8");
const lines = raw.split(/\r?\n/);

// 数据结构
const apiIndex = {};       // className → { javadoc, methods: [], fields: [] }
const methodLookup = {};   // "className.methodName:desc" → { className, methodName, descriptor, parameters, javadoc }
const classNames = new Set();

let currentClassName = null;
let totalMethods = 0;
let totalFields = 0;

for (const rawLine of lines) {
  // Class lines start at column 0, member lines are tab-indented
  const isIndented = rawLine.startsWith("\t");

  if (!isIndented) {
    // Class name line: "obfuscated mappedClassName" (no leading tab)
    const tokens = rawLine.trim().split(/\s+/);
    if (tokens.length === 2) {
      const [obfName, mappedName] = tokens;
      if (!mappedName || mappedName === "") continue;
      // 身份类行（obfName === mappedName）也是合法 owner：**不得 continue 跳过** ——
      // 跳过会使 currentClassName 停在前一任真名类，其下全部 tab 缩进成员行错挂到那个类
      // （1.13.2 实测：34 条身份 CLASS 行 + 640 条成员行错挂；旧 continue 亦不 reset owner）。
      currentClassName = mappedName;
      classNames.add(currentClassName);
      if (!apiIndex[currentClassName]) {
        apiIndex[currentClassName] = { javadoc: null, methods: [], fields: [] };
      }
    }
    continue;
  }

  // Member line (tab-indented)
  if (!currentClassName) continue;

  const line = rawLine.trim();
  const tokens = line.split(/\s+/);
  if (tokens.length === 0) continue;

  // 3-token: obf desc mappedName  — method (has () in desc) or 3-token field
  if (tokens.length === 3) {
    const [obfName, descriptor, mappedName] = tokens;
    if (!mappedName || mappedName === "") continue;
    if (obfName.startsWith("<")) continue;
    if (descriptor.includes("(") && descriptor.includes(")")) {
      apiIndex[currentClassName].methods.push({ name: mappedName, descriptor, parameters: [], javadoc: null });
      methodLookup[`${currentClassName}.${mappedName}:${descriptor}`] = {
        className: currentClassName, methodName: mappedName, descriptor, parameters: [], javadoc: null,
      };
      totalMethods++;
    } else {
      apiIndex[currentClassName].fields.push({ name: mappedName, descriptor, javadoc: null });
      methodLookup[`${currentClassName}.${mappedName}:${descriptor}`] = {
        className: currentClassName, fieldName: mappedName, descriptor, javadoc: null,
      };
      totalFields++;
    }
    continue;
  }

  // 2-token: obf mappedName — field without descriptor (mappedName == obfName)
  if (tokens.length === 2) {
    const [obfName, mappedName] = tokens;
    if (!mappedName || mappedName === "") continue;
    if (obfName.startsWith("<")) continue;
    const descriptor = "";
    apiIndex[currentClassName].fields.push({ name: mappedName, descriptor, javadoc: null });
    methodLookup[`${currentClassName}.${mappedName}:${descriptor}`] = {
      className: currentClassName, fieldName: mappedName, descriptor, javadoc: null,
    };
    totalFields++;
    continue;
  }

  // 4-token: obf obfMapped desc mappedName
  if (tokens.length === 4) {
    const [obfName, , descriptor, mappedName] = tokens;
    if (!mappedName || mappedName === "") continue;
    if (obfName.startsWith("<")) continue;
    if (descriptor.includes("(") && descriptor.includes(")")) {
      apiIndex[currentClassName].methods.push({ name: mappedName, descriptor, parameters: [], javadoc: null });
      methodLookup[`${currentClassName}.${mappedName}:${descriptor}`] = {
        className: currentClassName, methodName: mappedName, descriptor, parameters: [], javadoc: null,
      };
      totalMethods++;
    } else {
      apiIndex[currentClassName].fields.push({ name: mappedName, descriptor, javadoc: null });
      methodLookup[`${currentClassName}.${mappedName}:${descriptor}`] = {
        className: currentClassName, fieldName: mappedName, descriptor, javadoc: null,
      };
      totalFields++;
    }
    continue;
  }
}

console.log(`Parsed ${classNames.size} classes, ${totalMethods} methods, ${totalFields} fields`);

// ── 生成 critical-classes ───────────────────────────────────────────────

const criticalStats = {};
let foundCritical = 0;
for (const name of CRITICAL) {
  if (apiIndex[name]) {
    foundCritical++;
    criticalStats[name] = {
      methods: apiIndex[name].methods.length,
      fields: apiIndex[name].fields.length,
    };
  } else {
    criticalStats[name] = null;
  }
}
console.log(`Critical classes: ${foundCritical}/${CRITICAL.size} found`);

// ── 写入文件 ─────────────────────────────────────────────────────────────

mkdirSync(EXTRACTED, { recursive: true });

writeFileSync(join(EXTRACTED, "api-index.json"), JSON.stringify(apiIndex, null, 0));
console.log(`api-index.json   — ${Object.keys(apiIndex).length} classes`);

writeFileSync(join(EXTRACTED, "method-lookup.json"), JSON.stringify(methodLookup, null, 0));
console.log(`method-lookup.json — ${Object.keys(methodLookup).length} entries`);

writeFileSync(join(EXTRACTED, "critical-classes.json"), JSON.stringify(criticalStats, null, 2));
console.log(`critical-classes.json — ${foundCritical}/${CRITICAL.size} found`);

const sortedClassNames = [...classNames].sort();
writeFileSync(join(EXTRACTED, "class-names.json"), JSON.stringify(sortedClassNames, null, 0));
console.log(`class-names.json   — ${sortedClassNames.length} names`);

console.log(`\nDONE! Output: ${EXTRACTED}`);
