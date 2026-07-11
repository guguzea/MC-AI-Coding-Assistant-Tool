#!/usr/bin/env node
/**
 * parchment-extractor.js
 * 从 parchment.json 提取关键 Forge 类和方法的映射数据，
 * 生成供 MCP Server 使用的高效索引文件。
 *
 * 运行：
 *   node scripts/parchment-extractor.js --version=1.20.1
 *   node scripts/parchment-extractor.js --version=1.18.2
 *   node scripts/parchment-extractor.js --version=1.12.2
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CLI ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];

if (!versionArg) {
  console.error("用法: node parchment-extractor.js --version=1.20.1");
  process.exit(1);
}

// ── 路径配置 ────────────────────────────────────────────────────────────

const DATA_DIR = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "mappings");
const OUT_DIR  = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "extracted");

function findParchmentJson() {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  const preferred = files.find(f => f.startsWith("parchment"));
  if (preferred) return join(DATA_DIR, preferred);
  if (files.length > 0) return join(DATA_DIR, files[0]);
  throw new Error(`No parchment JSON found in ${DATA_DIR}`);
}

// ── 关键 Forge 类（高精度索引）────────────────────────────────────────────
// 注意：1.12.x 使用旧包名（如 net.minecraftforge.event），1.17+ 使用新包名
const CRITICAL_CLASSES = new Set([
  // Registry & Registration (1.17+)
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
  // Capability (1.17+)
  "net/minecraftforge/common/capabilities/Capability",
  "net/minecraftforge/common/capabilities/CapabilityManager",
  "net/minecraftforge/common/capabilities/ICapabilityProvider",
  "net/minecraftforge/common/capabilities/ICapabilitySerializable",
  "net/minecraftforge/common/capabilities/LazyOptional",
  // Events (legacy)
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

const parchmentPath = findParchmentJson();
console.log(`Loading ${parchmentPath}...`);
const raw = JSON.parse(readFileSync(parchmentPath, "utf-8"));
const classes = raw.classes || [];

// ── 构建索引 ──────────────────────────────────────────────────────────────

const apiIndex = {};        // className → { javadoc, methods: [], fields: [] }
const methodLookup = {};    // "className.methodName:descriptor" → details

let totalMethods = 0;
let totalFields = 0;

for (const cls of classes) {
  const name = cls.name;

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
      methodLookup[`${name}.${m.name}:${m.descriptor}`] = {
        className: name,
        methodName: m.name,
        descriptor: m.descriptor,
        parameters: (m.parameters || []).map(p => p.name),
        javadoc: (m.javadoc || [])[0] || null,
      };
    }
  }

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
  }
}

// ── 输出结果 ──────────────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });

// 1. 完整 API 索引
writeFileSync(join(OUT_DIR, "api-index.json"), JSON.stringify(apiIndex, null, 0));
console.log(`api-index.json   — ${Object.keys(apiIndex).length} classes, ${totalMethods} methods, ${totalFields} fields`);

// 2. 方法快速查找表
writeFileSync(join(OUT_DIR, "method-lookup.json"), JSON.stringify(methodLookup, null, 0));
console.log(`method-lookup.json — ${Object.keys(methodLookup).length} entries`);

// 3. 关键类列表
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
writeFileSync(join(OUT_DIR, "critical-classes.json"), JSON.stringify(criticalStats, null, 2));
console.log(`critical-classes.json — ${foundCritical}/${CRITICAL_CLASSES.size} found`);

// 4. 类名列表（用于模糊搜索）
const classNames = Object.keys(apiIndex).sort();
writeFileSync(join(OUT_DIR, "class-names.json"), JSON.stringify(classNames, null, 0));
console.log(`class-names.json   — ${classNames.length} names`);

console.log(`\nDONE! Output: ${OUT_DIR}`);
