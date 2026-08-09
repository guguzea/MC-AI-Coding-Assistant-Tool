#!/usr/bin/env node
/**
 * parchment-extractor.js
 * 从 parchment.json 提取关键 Forge 类和方法的映射数据，
 * 并用同版本 Mojang client.txt 补全缺失方法（写入 Mojang/Parchment 名；
 * Yarn Tiny 仅作 yarnName 交叉元数据）。
 *
 * 运行：
 *   node scripts/parchment-extractor.js --version=1.20.1
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseTiny, findTinyPath, findNamedMethod } from "./_lib/parse-tiny.mjs";
import {
  parseMojangProguardFile,
  lookupMojangMethod,
} from "./_lib/parse-mojang-proguard.mjs";
import { ensureMojangClientMappings } from "./_lib/ensure-mojang-mappings.mjs";

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

/** Supplement missing methods from Mojang client.txt (Forge/Parchment names). */
async function mergeMojangSupplement() {
  console.log(`Ensuring Mojang client mappings for ${versionArg}...`);
  const mojangFile = await ensureMojangClientMappings(DATA_DIR, versionArg);
  if (!mojangFile.path) {
    console.warn(
      `WARN: no Mojang client.txt (${mojangFile.error ?? "missing"}) — skip supplement`,
    );
    return { added: 0, tinyParsed: null };
  }
  console.log(
    `Mojang mappings: ${mojangFile.path}${mojangFile.downloaded ? " (downloaded)" : ""}`,
  );
  const mojangMaps = await parseMojangProguardFile(mojangFile.path);

  // Optional Yarn crosswalk: official triple → yarn name (for yarnName metadata)
  /** @type {Map<string, string>} */
  const yarnNameByObf = new Map();
  /** Fallback when Yarn declares method on interface (EntityLike) but Mojang on class */
  /** @type {Map<string, string>} */
  const yarnNameByObfMember = new Map();
  let tinyParsed = null;
  const tiny = existsSync(FABRIC_MAPPINGS) ? findTinyPath(FABRIC_MAPPINGS) : null;
  if (tiny) {
    console.log(`Loading Yarn tiny for name crosswalk: ${tiny.path}`);
    tinyParsed = await parseTiny(tiny.path, { strict: false });
    for (const m of tinyParsed.methods) {
      if (!m.nameOfficial || !m.nameNamed) continue;
      if (/^method_\d+$/.test(m.nameNamed)) continue;
      const key = `${m.ownerOfficial}\t${m.descriptorOfficial}\t${m.nameOfficial}`;
      if (!yarnNameByObf.has(key)) yarnNameByObf.set(key, m.nameNamed);
      const memberKey = `${m.descriptorOfficial}\t${m.nameOfficial}`;
      if (!yarnNameByObfMember.has(memberKey)) yarnNameByObfMember.set(memberKey, m.nameNamed);
    }
  }

  let added = 0;
  for (const [obfKey, mojang] of mojangMaps.methodsByObf) {
    const [obfOwner, obfDesc, obfName] = obfKey.split("\t");
    if (!obfName || obfName.startsWith("<")) continue;
    if (mojang.name.startsWith("lambda$") || mojang.name.includes("access$")) continue;

    const parchClass = mojangMaps.obfToNamed.get(obfOwner);
    if (!parchClass || !apiIndex[parchClass]) continue;

    const exists = apiIndex[parchClass].methods.some(
      (x) => x.name === mojang.name && x.descriptor === mojang.descriptor,
    );
    if (exists) continue;

    const yarnName =
      yarnNameByObf.get(obfKey) ?? yarnNameByObfMember.get(`${obfDesc}\t${obfName}`);
    apiIndex[parchClass].methods.push({
      name: mojang.name,
      descriptor: mojang.descriptor,
      parameters: [],
      javadoc: null,
      source: "mojang-supplement",
      yarnName: yarnName && yarnName !== mojang.name ? yarnName : undefined,
    });
    methodLookup[`${parchClass}.${mojang.name}:${mojang.descriptor}`] = {
      className: parchClass,
      methodName: mojang.name,
      descriptor: mojang.descriptor,
      parameters: [],
      javadoc: null,
      source: "mojang-supplement",
      yarnName: yarnName && yarnName !== mojang.name ? yarnName : undefined,
    };
    totalMethods++;
    added++;
  }

  // Export LivingEntity.getHealth cross-check artefact
  if (tinyParsed) {
    const gh = findNamedMethod(tinyParsed, "getHealth", "LivingEntity");
    if (gh) {
      const mojang = lookupMojangMethod(
        mojangMaps,
        gh.ownerOfficial,
        gh.descriptorOfficial,
        gh.nameOfficial,
      );
      writeFileSync(
        join(OUT_DIR, "yarn-supplement-getHealth.json"),
        JSON.stringify(
          {
            ownerNamed: gh.ownerNamed,
            ownerOfficial: gh.ownerOfficial,
            nameNamed: gh.nameNamed,
            nameOfficial: gh.nameOfficial,
            descriptor: gh.descriptorNamed,
            nameMojang: mojang?.name ?? null,
            descriptorMojang: mojang?.descriptor ?? null,
            parchmentClass: mojangMaps.obfToNamed.get(gh.ownerOfficial) ?? null,
          },
          null,
          2,
        ),
      );
    }
  }

  console.log(`Mojang supplement: added ${added} methods`);
  return { added, tinyParsed };
}

mkdirSync(OUT_DIR, { recursive: true });
const mergeResult = await mergeMojangSupplement();

writeFileSync(join(OUT_DIR, "api-index.json"), JSON.stringify(apiIndex, null, 0));
console.log(
  `api-index.json   — ${Object.keys(apiIndex).length} classes, ${totalMethods} methods, ${totalFields} fields`,
);

writeFileSync(join(OUT_DIR, "method-lookup.json"), JSON.stringify(methodLookup, null, 0));
console.log(`method-lookup.json — ${Object.keys(methodLookup).length} entries`);

const critical = {};
for (const name of CRITICAL_CLASSES) {
  if (apiIndex[name]) critical[name] = apiIndex[name];
}
writeFileSync(join(OUT_DIR, "critical-classes.json"), JSON.stringify(critical, null, 2));
console.log(`critical-classes.json — ${Object.keys(critical).length} classes`);

const classNames = Object.keys(apiIndex).sort();
writeFileSync(join(OUT_DIR, "class-names.json"), JSON.stringify(classNames, null, 0));
console.log(`class-names.json — ${classNames.length} names`);

if (mergeResult.added === 0) {
  console.warn("WARN: supplement added 0 methods — check Mojang client.txt availability");
}
