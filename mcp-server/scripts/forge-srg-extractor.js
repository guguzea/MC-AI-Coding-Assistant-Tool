#!/usr/bin/env node
/**
 * forge-srg-extractor.js
 * 从 mcp-X.zip 内的 joined.srg（Forge SRG 格式）提取类名/方法名/字段名映射，
 * 生成供 MCP Server 使用的高效索引文件。
 *
 * Forge SRG 格式（不同于 Mojang TSRG）：
 *   PK: <obfuscated> <mapped>            ← 包名映射
 *   CL: <obfuscated> <mapped/Class>      ← 类名映射
 *   FD: <obfuscated> <mapped/Class>      ← 字段
 *   MD: <obfuscated> <mapped/Class> <descriptor> <mapped/method>  ← 方法
 *
 * 运行：
 *   node scripts/forge-srg-extractor.js --version=1.12.2
 *   node scripts/forge-srg-extractor.js --version=1.7.10
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CLI ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const versionArg = args.find(a => a.startsWith("--version="))?.split("=")[1];
if (!versionArg) {
  console.error("用法: node forge-srg-extractor.js --version=1.7.10");
  process.exit(1);
}

// ── 路径 ────────────────────────────────────────────────────────────────

const DATA_ROOT = join(__dirname, "..", "..", "data", `forge_${versionArg}`);
const MAPPINGS_DIR = join(DATA_ROOT, "mappings");
const EXTRACTED = join(DATA_ROOT, "extracted");

// ── 定位 joined.srg（可能在 zip 内或已经在 mappings/ 下）────────────────────────────────

function findJoinedSrg() {
  // 1. 直接在 mappings/ 下
  const direct = join(MAPPINGS_DIR, "joined.srg");
  if (readdirSync(MAPPINGS_DIR).includes("joined.srg")) {
    return direct;
  }
  // 2. 在 mcp-X.zip 里
  const zips = readdirSync(MAPPINGS_DIR).filter(f => f.endsWith(".zip"));
  if (zips.length === 0) throw new Error(`No mappings zip/joined.srg in ${MAPPINGS_DIR}`);
  // 用 node:zlib 解 zip 太重，我们改用 unzip 子进程
  throw new Error(
    `joined.srg 不在 ${MAPPINGS_DIR} 下。请先手动解压：\n` +
    `  Expand-Archive -Path "${join(MAPPINGS_DIR, zips[0])}" -DestinationPath "${join(MAPPINGS_DIR, "_srg")}"\n` +
    `  Copy-Item "${join(MAPPINGS_DIR, "_srg", "joined.srg")}" "${MAPPINGS_DIR}" -Force\n` +
    `  Remove-Item -Recurse -Force "${join(MAPPINGS_DIR, "_srg")}"`
  );
}

const SRG_PATH = findJoinedSrg();
console.log(`Loading ${SRG_PATH}...`);
const raw = readFileSync(SRG_PATH, "utf-8");
const lines = raw.split(/\r?\n/);

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
  "net/minecraft/tileentity/TileEntity",
  "net/minecraft/tileentity/TileEntityType",
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

// ── 解析 Forge SRG ──────────────────────────────────────────────────────

const apiIndex = {};       // className → { javadoc, methods: [], fields: [] }
const methodLookup = {};   // "className.methodName:desc" → details
const classNames = new Set();

let totalMethods = 0;
let totalFields = 0;
let ownerNotInClassNames = 0; // 成员行 owner 不在 CL 名册的条数（非 0 即解析异常，作诊断信号）

// 成员行的 owner 取自本行自带的 mapped 全名前缀，而不是「最近的 CL: 行」——
// joined.srg 的 CL/FD/MD 是分段排布，用 currentClass 会把全文件成员并进最后一个类。
function splitOwner(mapped) {
  const i = mapped.lastIndexOf("/");
  if (i <= 0) return null;
  return { owner: mapped.slice(0, i), member: mapped.slice(i + 1) };
}

function ensureOwnerSlot(owner) {
  if (!apiIndex[owner]) apiIndex[owner] = { javadoc: null, methods: [], fields: [] };
  if (!classNames.has(owner)) ownerNotInClassNames++;
}

// Forge SRG 行格式：
//   CL: <obf> <mapped_class>
//   FD: <obf_class>/<obf_field> <mapped_class_full>/<mapped_field>
//   MD: <obf_class>/<obf_method> <descriptor1> <mapped_class_full>/<mapped_method> <descriptor2>
//
// 注：descriptor1 是 obfuscated，descriptor2 是 mapped（通常相同），用 mapped 那个。
for (const line of lines) {
  if (!line) continue;
  const colonIdx = line.indexOf(":");
  if (colonIdx < 0) continue;
  const code = line.slice(0, colonIdx + 1); // 保留冒号
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) continue;
  const tokens = rest.split(/\s+/);

  if (code === "PK:") {
    continue; // 包名映射，跳过
  }

  if (code === "CL:") {
    // 恒等/同名 CL 行（obf 名 == mapped 名）曾因 tokens[0] !== tokens[1] 被整行跳过：
    // 该类既不进 classNames、也不建 apiIndex 位 ⇒ 其成员被并进「最后一个类」，类名也从
    // class-names.json 里少掉。六档各有 21/34/33/31/31/31 个恒等类、挂着 1.8–2.3% 的成员。
    if (tokens.length === 2) {
      classNames.add(tokens[1]);
      if (!apiIndex[tokens[1]]) {
        apiIndex[tokens[1]] = { javadoc: null, methods: [], fields: [] };
      }
    }
    continue;
  }

  if (code === "FD:") {
    // FD: obf/class obf/field MAPPED/CLASS/mapped_field（joined.srg 恒 2 token）
    // 4 token 形（含描述符）取 tokens[2] 为 mapped 全名、tokens[3] 为描述符。
    const mapped = tokens.length === 2 ? tokens[1] : tokens.length >= 4 ? tokens[2] : null;
    const descriptor = tokens.length >= 4 && tokens[3].includes("(") ? tokens[3] : "";
    const sp = mapped ? splitOwner(mapped) : null;
    if (!sp) continue;
    ensureOwnerSlot(sp.owner);
    apiIndex[sp.owner].fields.push({ name: sp.member, descriptor, javadoc: null });
    methodLookup[`${sp.owner}.${sp.member}:${descriptor}`] = {
      className: sp.owner, fieldName: sp.member, descriptor, javadoc: null,
    };
    totalFields++;
    continue;
  }

  if (code === "MD:") {
    // MD: obfClass/obfMethod descriptor mappedClassFull/mappedMethod descriptor（joined.srg 恒 4 token）
    const mapped = tokens.length === 4 ? tokens[2] : tokens.length === 2 ? tokens[1] : null;
    const descriptor = tokens.length === 4 ? tokens[3] : "";
    const sp = mapped ? splitOwner(mapped) : null;
    if (!sp) continue;
    ensureOwnerSlot(sp.owner);
    apiIndex[sp.owner].methods.push({ name: sp.member, descriptor, parameters: [], javadoc: null });
    methodLookup[`${sp.owner}.${sp.member}:${descriptor}`] = {
      className: sp.owner, methodName: sp.member, descriptor, parameters: [], javadoc: null,
    };
    totalMethods++;
    continue;
  }
}

console.log(`Parsed ${classNames.size} classes, ${totalMethods} methods, ${totalFields} fields`);
if (ownerNotInClassNames > 0) {
  console.warn(`WARN: ${ownerNotInClassNames} 条成员行的 owner 不在 CL 名册 —— 解析异常或 CL 行缺失`);
}

// ── 写文件 ──────────────────────────────────────────────────────────────

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
