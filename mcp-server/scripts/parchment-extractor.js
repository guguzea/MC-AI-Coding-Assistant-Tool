#!/usr/bin/env node
/**
 * parchment-extractor.js
 * 从 parchment.json 提取关键 Forge 类和方法的映射数据，
 * 并用同版本 Yarn Tiny（经 parse-tiny.mjs）补全缺失无参方法。
 *
 * 运行：
 *   node scripts/parchment-extractor.js --version=1.20.1
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseTiny, findTinyPath, findNamedMethod } from "./_lib/parse-tiny.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const versionArg = args.find((a) => a.startsWith("--version="))?.split("=")[1];

if (!versionArg) {
  console.error("用法: node parchment-extractor.js --version=1.20.1");
  process.exit(1);
}

const DATA_DIR = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "mappings");
const OUT_DIR = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "extracted");
const FABRIC_MAPPINGS = join(__dirname, "..", "..", "data", `fabric_${versionArg}`, "mappings");

function findParchmentJson() {
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const preferred = files.find((f) => f.startsWith("parchment"));
  if (preferred) return join(DATA_DIR, preferred);
  if (files.length > 0) return join(DATA_DIR, files[0]);
  throw new Error(`No parchment JSON found in ${DATA_DIR}`);
}

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

const parchmentPath = findParchmentJson();
console.log(`Loading ${parchmentPath}...`);
const raw = JSON.parse(readFileSync(parchmentPath, "utf-8"));
const classes = raw.classes || [];

const apiIndex = {};
const methodLookup = {};

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
        parameters: (m.parameters || []).map((p) => ({ index: p.index, name: p.name })),
        javadoc: (m.javadoc || [])[0] || null,
      });
      totalMethods++;
      methodLookup[`${name}.${m.name}:${m.descriptor}`] = {
        className: name,
        methodName: m.name,
        descriptor: m.descriptor,
        parameters: (m.parameters || []).map((p) => p.name),
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

/** Build official -> parchment class name map using Yarn Tiny. */
async function mergeYarnSupplement() {
  if (!existsSync(FABRIC_MAPPINGS)) {
    console.warn(`WARN: no fabric_${versionArg}/mappings — skip Yarn supplement`);
    return { added: 0, tinyParsed: null };
  }
  const tiny = findTinyPath(FABRIC_MAPPINGS);
  if (!tiny) {
    console.warn(`WARN: no tiny in ${FABRIC_MAPPINGS} — skip Yarn supplement`);
    return { added: 0, tinyParsed: null };
  }
  console.log(`Merging Yarn tiny: ${tiny.path}`);
  const parsed = await parseTiny(tiny.path, { strict: false });

  // Map Tiny official -> Tiny named, then align to Parchment classes:
  // Prefer matching by official: for each parchment class, find Tiny class whose named
  // simple name matches OR whose named path ends with same simple name, using official as key.
  /** @type {Map<string, typeof parsed.classes[0]>} */
  const byOfficial = new Map();
  /** @type {Map<string, string[]>} simpleName -> parchment class paths */
  const parchmentBySimple = new Map();
  for (const pName of Object.keys(apiIndex)) {
    const simple = pName.split("/").pop();
    if (!parchmentBySimple.has(simple)) parchmentBySimple.set(simple, []);
    parchmentBySimple.get(simple).push(pName);
  }

  for (const c of parsed.classes) {
    if (c.official) byOfficial.set(c.official, c);
  }

  // official -> best parchment class path
  /** @type {Map<string, string>} */
  const officialToParchment = new Map();
  for (const c of parsed.classes) {
    if (!c.official || !c.named) continue;
    const simple = c.named.split("/").pop();
    const candidates = parchmentBySimple.get(simple) || [];
    if (candidates.length === 0) continue;
    // Prefer path containing same trailing segments as yarn named under net/minecraft
    let best = candidates[0];
    let bestScore = -1;
    const yarnTokens = new Set(c.named.split("/").filter(Boolean));
    for (const cand of candidates) {
      const score = cand.split("/").filter((t) => yarnTokens.has(t)).length;
      if (score > bestScore) {
        bestScore = score;
        best = cand;
      }
    }
    // Prefer world/entity over entity when both exist for LivingEntity
    officialToParchment.set(c.official, best);
  }

  let added = 0;
  for (const m of parsed.methods) {
    if (!m.nameNamed || m.nameNamed.startsWith("<")) continue;
    const parchClass = officialToParchment.get(m.ownerOfficial);
    if (!parchClass || !apiIndex[parchClass]) continue;
    const key = `${m.nameNamed}:${m.descriptorNamed}`;
    const exists = apiIndex[parchClass].methods.some(
      (x) => x.name === m.nameNamed && x.descriptor === m.descriptorNamed,
    );
    if (exists) continue;
    apiIndex[parchClass].methods.push({
      name: m.nameNamed,
      descriptor: m.descriptorNamed,
      parameters: [],
      javadoc: null,
      source: "yarn-supplement",
    });
    methodLookup[`${parchClass}.${m.nameNamed}:${m.descriptorNamed}`] = {
      className: parchClass,
      methodName: m.nameNamed,
      descriptor: m.descriptorNamed,
      parameters: [],
      javadoc: null,
      source: "yarn-supplement",
    };
    totalMethods++;
    added++;
  }

  // Export for cross-check tests
  const gh = findNamedMethod(parsed, "getHealth", "LivingEntity");
  if (gh) {
    writeFileSync(
      join(OUT_DIR, "yarn-supplement-getHealth.json"),
      JSON.stringify(
        {
          ownerNamed: gh.ownerNamed,
          ownerOfficial: gh.ownerOfficial,
          nameNamed: gh.nameNamed,
          nameOfficial: gh.nameOfficial,
          descriptor: gh.descriptorNamed,
          parchmentClass: officialToParchment.get(gh.ownerOfficial) ?? null,
        },
        null,
        2,
      ),
    );
  }

  console.log(`Yarn supplement: added ${added} methods`);
  return { added, tinyParsed: parsed };
}

mkdirSync(OUT_DIR, { recursive: true });
const mergeResult = await mergeYarnSupplement();

writeFileSync(join(OUT_DIR, "api-index.json"), JSON.stringify(apiIndex, null, 0));
console.log(
  `api-index.json   — ${Object.keys(apiIndex).length} classes, ${totalMethods} methods, ${totalFields} fields`,
);

writeFileSync(join(OUT_DIR, "method-lookup.json"), JSON.stringify(methodLookup, null, 0));
console.log(`method-lookup.json — ${Object.keys(methodLookup).length} entries`);

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

const classNames = Object.keys(apiIndex).sort();
writeFileSync(join(OUT_DIR, "class-names.json"), JSON.stringify(classNames, null, 0));
console.log(`class-names.json   — ${classNames.length} names`);
console.log(`Yarn merge added: ${mergeResult.added}`);

console.log(`\nDONE! Output: ${OUT_DIR}`);
