#!/usr/bin/env node
/**
 * mcp-csv-extractor.js
 * Read MCP stable CSV files (methods.csv / fields.csv / params.csv) under
 * data/forge_<version>/mappings/ and write the extracted/ indexes.
 *
 * The CSVs do not encode class paths, so the emitted indexes are constrained:
 *   - api-index.json: empty (no class path => nothing to index)
 *   - method-lookup.json: searge -> { mcpName, descriptor, parameters }
 *   - critical-classes.json: empty (no class paths in CSV)
 *   - class-names.json: distinct method/field names (incomplete, search aid only)
 *
 * Usage:
 *   node scripts/mcp-csv-extractor.js --version=1.14.4
 *   node scripts/mcp-csv-extractor.js --version 1.15.2
 *
 * Exit codes:
 *   0 success
 *   2 bad CLI usage (missing/empty --version)
 *   3 I/O / parse error
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parseCliArgs } from "./_lib/args.js";
import { parseCSV, csvField, csvRow } from "./_lib/csv.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Constants (exported for tests) ──────────────────────────────────────────

export const CRITICAL_CLASSES_1_14 = [
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
  "net/minecraft/world/block/Block",
  "net/minecraft/world/block/state/BlockStateBase",
  "net/minecraft/world/block/entity/BlockEntity",
  "net/minecraft/world/block/entity/BlockEntityType",
  "net/minecraft/world/entity/Entity",
  "net/minecraft/world/entity/LivingEntity",
  "net/minecraft/world/entity/Mob",
  "net/minecraft/world/entity/animal/Animal",
  "net/minecraft/world/entity/EntityType",
  "net/minecraftforge/common/capabilities/Capability",
  "net/minecraftforge/common/capabilities/CapabilityManager",
  "net/minecraftforge/common/capabilities/ICapabilityProvider",
  "net/minecraftforge/common/capabilities/ICapabilitySerializable",
  "net/minecraftforge/eventbus/api/Event",
  "net/minecraftforge/fml/common/eventhandler/SubscribeEvent",
  "net/minecraftforge/network/ConnectionProtocol",
  "net/minecraftforge/network/simple/SimpleNetworkHandler",
  "net/minecraft/world/item/crafting/RecipeSerializer",
  "net/minecraft/data/recipes/RecipeProvider",
  "net/minecraft/data/recipes/ShapedRecipeBuilder",
  "net/minecraft/data/recipes/ShapelessRecipeBuilder",
  "net/minecraft/data/loot/LootTableProvider",
];

// CSV columns we require on each file. Missing columns -> hard error.
const REQUIRED_COLUMNS = {
  methods: ["searge", "name", "desc"],
  fields:  ["searge", "name", "desc"],
  params:  ["param", "name"],
};

// ── Pure helpers (exported for tests) ───────────────────────────────────────

/**
 * Build the lookup object for methods. Pure.
 */
export function buildMethodEntries(methods, required = REQUIRED_COLUMNS.methods) {
  const lookup = {};
  let total = 0;
  for (const m of methods) {
    for (const c of required) if (!m[c]) continue;
    if (!m.searge || !m.name) continue;
    if (m.searge === m.name) continue;
    lookup[`func:${m.searge}`] = {
      searge: m.searge,
      mcpName: m.name,
      methodName: m.name,
      descriptor: m.desc || "",
      parameters: [],
      javadoc: null,
    };
    total++;
  }
  return { lookup, total };
}

export function buildFieldEntries(fields, required = REQUIRED_COLUMNS.fields) {
  const lookup = {};
  let total = 0;
  for (const f of fields) {
    for (const c of required) if (!f[c]) continue;
    if (!f.searge || !f.name) continue;
    if (f.searge === f.name) continue;
    lookup[`field:${f.searge}`] = {
      searge: f.searge,
      mcpName: f.name,
      fieldName: f.name,
      descriptor: f.desc || "",
      javadoc: null,
    };
    total++;
  }
  return { lookup, total };
}

export function buildParamMap(params, required = REQUIRED_COLUMNS.params) {
  const out = {};
  for (const p of params) {
    for (const c of required) if (!p[c]) continue;
    if (p.param && p.name) out[p.param] = p.name;
  }
  return out;
}

/**
 * Validate that the parsed CSV row objects actually contain the required
 * columns. Returns a list of errors (empty == pass).
 */
export function validateColumns(rows, required, file) {
  const errs = [];
  if (!Array.isArray(rows) || rows.length === 0) {
    errs.push(`${file}: no rows parsed`);
    return errs;
  }
  const sample = rows[0];
  for (const col of required) {
    if (!(col in sample)) errs.push(`${file}: missing required column "${col}"`);
  }
  return errs;
}

/**
 * Validate the four output blobs we promise to write. Pure.
 */
export function validateOutputs(outputs) {
  const errs = [];
  if (!outputs || typeof outputs !== "object") {
    errs.push("outputs missing");
    return errs;
  }
  if (typeof outputs.methodLookup !== "object" || outputs.methodLookup === null) {
    errs.push("method-lookup must be an object");
  }
  if (typeof outputs.critical !== "object" || outputs.critical === null) {
    errs.push("critical-classes must be an object");
  }
  if (Object.keys(outputs.methodLookup).length < outputs.expectedMethods) {
    errs.push(
      `method-lookup has ${Object.keys(outputs.methodLookup).length} entries, expected at least ${outputs.expectedMethods}`
    );
  }
  if (Object.keys(outputs.critical).length !== CRITICAL_CLASSES_1_14.length) {
    errs.push(`critical-classes count mismatch`);
  }
  if (!Array.isArray(outputs.classNames)) {
    errs.push("class-names must be an array");
  } else if (outputs.classNames.length === 0) {
    errs.push("class-names is empty (params/methods/fields likely missing)");
  }
  return errs;
}

// ── Pipeline (testable with injected IO) ────────────────────────────────────

export function extractFromMappings({
  methods = [],
  fields = [],
  params = [],
} = {}) {
  const colErrors = [
    ...validateColumns(methods, REQUIRED_COLUMNS.methods, "methods.csv"),
    ...validateColumns(fields, REQUIRED_COLUMNS.fields, "fields.csv"),
    ...validateColumns(params, REQUIRED_COLUMNS.params, "params.csv"),
  ];

  const { lookup: methodFromMethods, total: totalMethods } = buildMethodEntries(methods);
  const { lookup: methodFromFields, total: totalFields } = buildFieldEntries(fields);
  const methodLookup = { ...methodFromMethods, ...methodFromFields };
  const paramMap = buildParamMap(params);

  const classNamesSet = new Set();
  for (const m of methods) if (m.name) classNamesSet.add(m.name);
  for (const f of fields)  if (f.name) classNamesSet.add(f.name);

  const critical = {};
  for (const name of CRITICAL_CLASSES_1_14) critical[name] = null;

  const outputs = {
    methodLookup,
    critical,
    classNames: [...classNamesSet].sort(),
    expectedMethods: totalMethods,
    expectedFields: totalFields,
    paramMapSize: Object.keys(paramMap).length,
    columnErrors: colErrors,
  };

  const outputErrors = validateOutputs(outputs);
  return { outputs, columnErrors: colErrors, outputErrors };
}

// ── File IO & CLI ───────────────────────────────────────────────────────────

function readInputs(versionArg) {
  const MAPPINGS_DIR = join(__dirname, "..", "..", "data", `forge_${versionArg}`, "mappings");
  const files = {
    methods: join(MAPPINGS_DIR, "methods.csv"),
    fields:  join(MAPPINGS_DIR, "fields.csv"),
    params:  join(MAPPINGS_DIR, "params.csv"),
  };
  const ioErrors = [];
  for (const [k, p] of Object.entries(files)) {
    if (!existsSync(p)) ioErrors.push(`missing input: ${p}`);
  }
  if (ioErrors.length) return { ioErrors, files: {} };
  try {
    return {
      ioErrors: [],
      files: {
        methods: parseCSV(readFileSync(files.methods, "utf8")),
        fields:  parseCSV(readFileSync(files.fields,  "utf8")),
        params:  parseCSV(readFileSync(files.params,  "utf8")),
      },
      paths: {
        mappings: MAPPINGS_DIR,
        out:      join(__dirname, "..", "..", "data", `forge_${versionArg}`, "extracted"),
      },
    };
  } catch (e) {
    return { ioErrors: [`read error: ${e.message}`], files: {} };
  }
}

function writeOutputs(outDir, outputs) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "api-index.json"), JSON.stringify({}));
  writeFileSync(join(outDir, "method-lookup.json"), JSON.stringify(outputs.methodLookup));
  writeFileSync(join(outDir, "critical-classes.json"), JSON.stringify(outputs.critical, null, 2));
  writeFileSync(join(outDir, "class-names.json"), JSON.stringify(outputs.classNames));
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (!args.flags.version || args.flags.versionError) {
    console.error("用法: node mcp-csv-extractor.js --version=1.14.4");
    console.error("(--version requires a non-empty value)");
    process.exit(2);
  }
  const versionArg = args.flags.version;

  const io = readInputs(versionArg);
  if (io.ioErrors.length) {
    for (const e of io.ioErrors) console.error(`✗ ${e}`);
    process.exit(3);
  }

  const { files } = io;
  const { outputs, columnErrors, outputErrors } = extractFromMappings({
    methods: files.methods.rows,
    fields:  files.fields.rows,
    params:  files.params.rows,
  });

  // Surface CSV / output validation problems but keep going so the user gets a
  // complete diagnostic. Non-zero exit if anything fails.
  const allErrors = [...columnErrors, ...outputErrors];
  if (allErrors.length) {
    for (const e of allErrors) console.error(`✗ ${e}`);
  }

  if (columnErrors.length === 0 && outputErrors.length === 0) {
    writeOutputs(io.paths.out, outputs);
    console.log(
      `  methods: ${outputs.expectedMethods}, fields: ${outputs.expectedFields}, params: ${outputs.paramMapSize}`
    );
    console.log(`  method-lookup.json: ${Object.keys(outputs.methodLookup).length} entries`);
    console.log(`  class-names.json: ${outputs.classNames.length} names`);
    console.log(`\nDONE! Output: ${io.paths.out}`);
    process.exit(0);
  }
  process.exit(4);
}

// Re-export for tests that want to round-trip a CSV through the real parser
// while building a small synthetic input.
export const _csv = { parseCSV, csvField, csvRow };

// Only auto-run when invoked directly (lets tests import this module safely).
const invokedDirectly =
  process.argv[1] &&
  import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
