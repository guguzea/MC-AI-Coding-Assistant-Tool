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

/**
 * 通道类名回映射（1.16.5 特例；ForgeGradle issue #795）。
 *
 * 事实：1.16.5 的 Forge `official` 通道**不应用 Mojang 类名**（为与 1.16 其它版本保持二进制兼容），
 * 类名沿用 SRG（`obf_to_srg.tsrg` 右列：实测 `brx net/minecraft/world/World`、`aqa net/minecraft/entity/Entity`），
 * 只有字段/方法用 Mojang 名（实测 `World#isClientSide`、`Item.Properties#stacksTo`）。
 * 而 parchment.json / client.txt 给的是 **Mojang 类名**（`net.minecraft.world.level.Level`）⇒
 * 本档索引若按 Mojang 类名生成，就与「照文档写代码能不能直接编译」的硬判据冲突
 * （2026-09-14 javap 实测：`forge-1.16.5-36.2.34_mapped_official_1.16.5.jar` 里只有
 *  `net/minecraft/world/World`、`net/minecraft/data/loot/BlockLootTables`，无 `world/level/*`）。
 */
const CHANNEL_CLASS_REMAP_VERSIONS = new Set(["1.16.5"]);

async function buildChannelClassRemap() {
  const tsrgPath = join(DATA_DIR, "obf_to_srg.tsrg");
  if (!existsSync(tsrgPath)) {
    console.warn(
      `WARN: 缺 ${tsrgPath}（1.16.5 通道类名回映射跳过 —— 见 forge/1.16.5 通道说明与 FG #795）`,
    );
    return null;
  }
  const obfToSrg = new Map();
  for (const line of readFileSync(tsrgPath, "utf-8").split(/\r?\n/)) {
    if (!line || /^\s/.test(line)) continue; // 类行无缩进；缩进行是字段/方法
    const parts = line.trim().split(/\s+/);
    if (parts.length === 2 && parts[1].includes("/")) obfToSrg.set(parts[0], parts[1]);
  }
  const mojangFile = await ensureMojangClientMappings(DATA_DIR, versionArg);
  if (!mojangFile.path) return null;
  const mojangMaps = await parseMojangProguardFile(mojangFile.path);
  const namedToSrg = new Map();
  for (const [obf, named] of mojangMaps.obfToNamed) {
    const srg = obfToSrg.get(obf);
    if (srg && srg !== named) namedToSrg.set(named, srg);
  }
  console.log(
    `Channel class remap (${versionArg}, FG #795): ${namedToSrg.size} Mojang 类名 → SRG 类名（仅本档需要）`,
  );
  return namedToSrg;
}

function applyChannelClassRemap(map) {
  const rename = (n) => map.get(n) ?? n;
  const renamedIndex = {};
  let movedClasses = 0;
  for (const [key, value] of Object.entries(apiIndex)) {
    const nk = rename(key);
    if (nk !== key) movedClasses++;
    renamedIndex[nk] = value;
  }
  const renamedLookup = {};
  for (const [key, value] of Object.entries(methodLookup)) {
    const oldClass = value.className;
    const nk = rename(oldClass);
    if (nk !== oldClass) {
      value.className = nk;
      renamedLookup[`${nk}.${key.slice(oldClass.length + 1)}`] = value;
    } else {
      renamedLookup[key] = value;
    }
  }
  for (const k of Object.keys(apiIndex)) delete apiIndex[k];
  for (const k of Object.keys(methodLookup)) delete methodLookup[k];
  Object.assign(apiIndex, renamedIndex);
  Object.assign(methodLookup, renamedLookup);
  console.log(`Channel class remap applied: ${movedClasses} 个类键已改写为 SRG 名`);
}

mkdirSync(OUT_DIR, { recursive: true });
const mergeResult = await mergeMojangSupplement();

// 通道回映射必须在 Mojang supplement **之后**（supplement 用 Mojang 名查 apiIndex），
// 但在写盘与 critical/class-names 之前。
const channelClassRemap = CHANNEL_CLASS_REMAP_VERSIONS.has(versionArg)
  ? await buildChannelClassRemap()
  : null;
if (channelClassRemap) applyChannelClassRemap(channelClassRemap);

writeFileSync(join(OUT_DIR, "api-index.json"), JSON.stringify(apiIndex, null, 0));
console.log(
  `api-index.json   — ${Object.keys(apiIndex).length} classes, ${totalMethods} methods, ${totalFields} fields`,
);

writeFileSync(join(OUT_DIR, "method-lookup.json"), JSON.stringify(methodLookup, null, 0));
console.log(`method-lookup.json — ${Object.keys(methodLookup).length} entries`);

const critical = {};
for (const name of CRITICAL_CLASSES) {
  // 若本档做过通道类名回映射，CRITICAL_CLASSES 里的 Mojang 名要先换成 SRG 名再查。
  const key = channelClassRemap ? (channelClassRemap.get(name) ?? name) : name;
  if (apiIndex[key]) critical[key] = apiIndex[key];
}
writeFileSync(join(OUT_DIR, "critical-classes.json"), JSON.stringify(critical, null, 2));
console.log(`critical-classes.json — ${Object.keys(critical).length} classes`);

const classNames = Object.keys(apiIndex).sort();
writeFileSync(join(OUT_DIR, "class-names.json"), JSON.stringify(classNames, null, 0));
console.log(`class-names.json — ${classNames.length} names`);

if (mergeResult.added === 0) {
  console.warn("WARN: supplement added 0 methods — check Mojang client.txt availability");
}
