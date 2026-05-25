#!/usr/bin/env node
/**
 * parchment-extractor.js
 * 从 parchment.json 提取关键 Forge 类和方法的映射数据，
 * 生成供 MCP Server 使用的高效索引文件。
 *
 * 运行: node scripts/parchment-extractor.js
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "mappings");
const OUT_DIR  = join(__dirname, "..", "data", "extracted");

// ── 关键 Forge 类（高精度索引）────────────────────────────────────────────
const CRITICAL_CLASSES = new Set([
  // Registry & Registration
  "net/minecraftforge/registries/DeferredRegister",
  "net/minecraftforge/registries/ForgeRegistries",
  "net/minecraftforge/registries/RegistryObject",
  "net/minecraftforge/registries/IForgeRegistry",
  // Block & Item
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
  // Entity
  "net/minecraft/world/entity/Entity",
  "net/minecraft/world/entity/LivingEntity",
  "net/minecraft/world/entity/Mob",
  "net/minecraft/world/entity/animal/Animal",
  "net/minecraft/world/entity/projectile/Projectile",
  "net/minecraft/world/entity/EntityType",
  "net/minecraft/world/entity/ai/attributes/Attribute",
  "net/minecraft/world/entity/ai/attributes/RangedAttribute",
  // Capability
  "net/minecraftforge/common/capabilities/Capability",
  "net/minecraftforge/common/capabilities/CapabilityManager",
  "net/minecraftforge/common/capabilities/ICapabilityProvider",
  "net/minecraftforge/common/capabilities/ICapabilitySerializable",
  "net/minecraftforge/common/capabilities/LazyOptional",
  // Events
  "net/minecraftforge/fml/common/eventhandler/Event",
  "net/minecraftforge/fml/common/eventhandler/SubscribeEvent",
  // Networking
  "net/minecraftforge/network/NetworkRegistry",
  "net/minecraftforge/network/simple/SimpleChannel",
  "net/minecraftforge/network/handshake/NetworkDispatcher",
  // Misc
  "net/minecraft/world/item/crafting/RecipeSerializer",
  "net/minecraft/data/recipes/RecipeProvider",
  "net/minecraft/data/recipes/ShapedRecipeBuilder",
  "net/minecraft/data/recipes/ShapelessRecipeBuilder",
  "net/minecraft/data/loot/LootTableProvider",
  "net/minecraft/data/loot/LootPool",
  "net/minecraftforge/common/data/LanguageProvider",
]);

// ── 加载 Parchment JSON ───────────────────────────────────────────────────
console.log("Loading parchment.json...");
const raw = JSON.parse(readFileSync(join(DATA_DIR, "parchment.json"), "utf-8"));
const classes = raw.classes; // 5720 classes

// ── 构建索引 ──────────────────────────────────────────────────────────────
const apiIndex = {};        // className → { javadoc, methods: [], fields: [] }
const methodLookup = {};    // "className.methodName:descriptor" → { parameters: [], javadoc }

let criticalCount = 0;
let totalMethods = 0;
let totalFields = 0;

for (const cls of classes) {
  const name = cls.name; // "net/minecraft/..."

  // 跳过非关键类（但记录总类数以了解覆盖范围）
  // 收集方法
  const methods = [];
  if (cls.methods) {
    for (const m of cls.methods) {
      methods.push({
        name: m.name,
        descriptor: m.descriptor,
        parameters: (m.parameters || []).map(p => ({ index: p.index, name: p.name })),
        javadoc: (m.javadoc || [])[0] || null,
      });
      totalMethods++;
      // 方法索引：className + methodName + descriptor（唯一确定）
      methodLookup[`${name}.${m.name}:${m.descriptor}`] = {
        className: name,
        methodName: m.name,
        descriptor: m.descriptor,
        parameters: (m.parameters || []).map(p => p.name),
        javadoc: (m.javadoc || [])[0] || null,
      };
    }
  }

  // 收集字段
  const fields = [];
  if (cls.fields) {
    for (const f of cls.fields) {
      fields.push({
        name: f.name,
        descriptor: f.descriptor,
        javadoc: (f.javadoc || [])[0] || null,
      });
      totalFields++;
      methodLookup[`${name}.${f.name}:${f.descriptor}`] = {
        className: name,
        fieldName: f.name,
        descriptor: f.descriptor,
        javadoc: (f.javadoc || [])[0] || null,
      };
    }
  }

  if (methods.length > 0 || fields.length > 0) {
    apiIndex[name] = {
      javadoc: (cls.javadoc || [])[0] || null,
      methods,
      fields,
    };
    if (CRITICAL_CLASSES.has(name)) criticalCount++;
  }
}

// ── 输出结果 ──────────────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });

// 1. 完整 API 索引
writeFileSync(
  join(OUT_DIR, "api-index.json"),
  JSON.stringify(apiIndex, null, 0)
);
console.log(`✓ api-index.json  — ${Object.keys(apiIndex).length} classes, ${totalMethods} methods, ${totalFields} fields`);

// 2. 方法快速查找表
writeFileSync(
  join(OUT_DIR, "method-lookup.json"),
  JSON.stringify(methodLookup, null, 0)
);
console.log(`✓ method-lookup.json — ${Object.keys(methodLookup).length} entries`);

// 3. 关键类列表（方便检查）
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
    criticalStats[name] = null; // 未找到
  }
}
writeFileSync(
  join(OUT_DIR, "critical-classes.json"),
  JSON.stringify(criticalStats, null, 2)
);
console.log(`✓ critical-classes.json — ${foundCritical}/${CRITICAL_CLASSES.size} classes found`);

// 4. 类名列表（用于模糊搜索）
const classNames = Object.keys(apiIndex).sort();
writeFileSync(
  join(OUT_DIR, "class-names.json"),
  JSON.stringify(classNames, null, 0)
);
console.log(`✓ class-names.json — ${classNames.length} class names`);

console.log("\n✅ 提取完成！");
console.log(`   输出目录: ${OUT_DIR}`);
