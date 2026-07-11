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
      if (!mappedName || mappedName === "" || obfName === mappedName) continue;
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
for (const name of CRITICAL_CLASSES) {
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
console.log(`Critical classes: ${foundCritical}/${CRITICAL_CLASSES.size} found`);

// ── 写入文件 ─────────────────────────────────────────────────────────────

mkdirSync(EXTRACTED, { recursive: true });

writeFileSync(join(EXTRACTED, "api-index.json"), JSON.stringify(apiIndex, null, 0));
console.log(`api-index.json   — ${Object.keys(apiIndex).length} classes`);

writeFileSync(join(EXTRACTED, "method-lookup.json"), JSON.stringify(methodLookup, null, 0));
console.log(`method-lookup.json — ${Object.keys(methodLookup).length} entries`);

writeFileSync(join(EXTRACTED, "critical-classes.json"), JSON.stringify(criticalStats, null, 2));
console.log(`critical-classes.json — ${foundCritical}/${CRITICAL_CLASSES.size} found`);

const sortedClassNames = [...classNames].sort();
writeFileSync(join(EXTRACTED, "class-names.json"), JSON.stringify(sortedClassNames, null, 0));
console.log(`class-names.json   — ${sortedClassNames.length} names`);

console.log(`\nDONE! Output: ${EXTRACTED}`);
