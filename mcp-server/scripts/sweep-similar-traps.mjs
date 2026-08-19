/**
 * In-process sweep: prototype keys, query_api empty shells, loader list, remaining tool families.
 * Writes _sweep-findings.json (gitignored).
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..");
const ROOT = join(REPO, "..");
process.env.MC_SKILL_DATA ??= join(ROOT, "data");
process.env.MC_SKILL_COMMUNITY ??= join(ROOT, "community_knowledge");

const findings = [];
const note = (sev, tool, msg, detail) => findings.push({ sev, tool, msg, detail });
const clip = (obj, n = 280) => {
  try {
    const s = JSON.stringify(obj);
    return s.length > n ? s.slice(0, n) + "…" : obj;
  } catch {
    return String(obj);
  }
};

async function main() {
  const docs = await import("../dist/docs-platform/index.js");
  const { searchBedrockDocs, generateAddonManifest, generateBpEntity, validateAddonManifest, validateBpJson } =
    await import("../dist/bedrock/index.js");
  const { queryApi } = await import("../dist/api/index.js");
  const { getVersionInfo } = await import("../dist/version/index.js");
  const { generateDatagen } = await import("../dist/datagen/index.js");
  const { getMigrationGuide, checkDependencies, analyzeLog } = await import("../dist/diagnostics/index.js");
  const { getWorkflowTemplate, listKnowledgeResources, readKnowledgeResource } = await import("../dist/prompts/index.js");
  const { mapShortCommand } = await import("../dist/cli-parse.js");
  const { resolvePackFormat } = await import("../dist/localize/pack-format.js");
  const {
    generateLang,
    generateCapability,
    generateConfig,
    generateEntityRenderer,
    generateNetworkPacket,
    generateModel,
    generateWorldgen,
  } = await import("../dist/generators/index.js");
  const { queryLoaderApi, searchLoaderApi, ingestLoaderApi } = await import("../dist/loader-api/index.js");
  const { activatePlatformPack, detectModProject } = await import("../dist/platform-pack/index.js");
  const { validateProject } = await import("../dist/validate/index.js");
  const { diagnoseGradle } = await import("../dist/gradle/index.js");
  const { analyzeCrash } = await import("../dist/crash/index.js");
  const { convertMapping, getMethodParams, lookupObfuscated } = await import("../dist/mappings/index.js");
  const { downloadOfficialMdk } = await import("../dist/mdk/index.js");
  const { analyzePortingPath, portProject } = await import("../dist/porting/index.js");
  const { mcSkillUpdate } = await import("../dist/update/index.js");
  const { queryRegistry } = await import("../dist/registry/index.js");
  const { validateDatapackJson } = await import("../dist/datapack/index.js");
  const { checkPublishReady } = await import("../dist/publish/index.js");
  const { inspectRuntime } = await import("../dist/runtime-inspect/index.js");
  const { mixinAnalyze } = await import("../dist/mixin/index.js");
  const { auditResources } = await import("../dist/audit-resources/index.js");
  const { searchModCodeHandler, analyzeModJarHandler } = await import("../dist/decompile/index.js");
  const { localizeMod } = await import("../dist/localize/index.js");
  const { validateAtHandler, validateAwHandler } = await import("../dist/mixin/deep-validate.js");

  const proto = ["constructor", "toString", "__proto__"];

  for (const k of proto) {
    for (const [name, fn] of [
      ["search_forge_docs", () => docs.searchForgeDocs({ query: k, version: "1.12.2" })],
      ["search_fabric_docs", () => docs.searchFabricDocs({ query: k, version: "1.20.1" })],
      ["search_neoforge_docs", () => docs.searchNeoForgeDocs({ query: k, version: "1.21.1" })],
      ["search_docs", () => docs.searchDocs({ query: k, platform: "rift", version: "1.13.2" })],
      ["search_bedrock_docs", () => searchBedrockDocs({ query: k })],
    ]) {
      try {
        const r = await fn();
        if (r && r.error && /iterable|prototype/i.test(String(r.error))) {
          note("error", name, `${k} prototype error`, clip(r));
        } else {
          note("info", name, `${k} ok`, { total: r.total, semantic: r.semantic });
        }
      } catch (e) {
        note("error", name, `${k} threw`, String(e.message || e));
      }
    }
    const vi = await getVersionInfo({ version: k, action: "register", platform: "forge" });
    if (vi.forgeVersion !== "unknown") note("error", "get_version_info", k, clip(vi));
    if (getMigrationGuide(k).found) note("error", "get_migration_guide", k);
    if (getWorkflowTemplate(k).found) note("error", "get_workflow_template", k);
    if (typeof resolvePackFormat(k).packFormat !== "number") note("error", "resolvePackFormat", k);
    if (mapShortCommand(k).tool !== k) note("error", "mapShortCommand", k);
  }

  const v112 = await getVersionInfo({ version: "1.12.2", action: "register", platform: "forge" });
  if (/创建 DeferredRegister/.test(v112.recommendation)) {
    note("error", "get_version_info", "1.12.2 still appends DeferredRegister", v112.recommendation);
  } else {
    note("info", "get_version_info", "1.12.2 register", v112.recommendation);
  }

  const block112 = await queryApi({ className: "net.minecraft.block.Block", version: "1.12.2" });
  const shellNote = (block112.warning || "") + (block112.notes ?? []).join(" ");
  if (block112.found && (block112.methods?.length ?? 0) === 0 && !/空壳|无方法/.test(shellNote)) {
    note("error", "query_api", "1.12.2 Block shell missing warning/notes", clip(block112));
  } else {
    note("info", "query_api", "1.12.2 Block", {
      found: block112.found,
      methods: block112.methods?.length,
      warned: /空壳|无方法/.test(shellNote),
    });
  }

  const dg = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "forge",
    version: "1.12.2",
  });
  if (dg.code) note("error", "generate_datagen", "1.12.2 must not emit code", clip(dg));
  const dg20 = generateDatagen({
    providerType: "sound",
    modId: "demo",
    targetName: "spark",
    platform: "forge",
    version: "1.20.1",
  });
  if (dg20.code?.includes("fromNamespaceAndPath")) {
    note("error", "generate_datagen", "1.20.1 still emits 1.21 factory");
  }

  const listed = searchLoaderApi({ mode: "list" });
  const maven = listed.mavenNotIndexed ?? [];
  if (Array.isArray(maven) && maven.length) {
    note("warn", "search_loader_api", "mavenNotIndexed not empty", maven);
  }
  const fabricKeys = (listed.indexed ?? []).map((x) => x.key).filter((k) => /fabric-api/.test(k));
  note("info", "search_loader_api", "list", {
    indexed: listed.indexed?.length,
    fabricApi: fabricKeys,
    mavenNotIndexed: maven,
  });
  const qForge = queryLoaderApi({
    platform: "forge",
    minecraftVersion: "1.12.2",
    className: "net.minecraftforge.registries.IForgeRegistry",
  });
  note("info", "query_loader_api", "1.12.2 IForgeRegistry", { found: qForge.found });

  const pack = activatePlatformPack({ action: "session", platform: "forge", minecraftVersion: "1.12.2" });
  const ruleIds = (pack.rules ?? []).map((r) => r.id);
  if (JSON.stringify(ruleIds) !== JSON.stringify(["00", "01", "09"])) {
    note("warn", "activate_platform_pack", "default rules not 00/01/09", ruleIds);
  }
  note("info", "activate_platform_pack", "session 1.12.2", {
    ok: pack.ok,
    rules: ruleIds,
    skills: pack.skills?.length,
  });

  const detect = detectModProject({ projectPath: ROOT });
  note("info", "detect_mod_project", "knowledge repo", clip(detect));

  for (const plat of ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader"]) {
    try {
      const lv = await docs.listVersions({ platform: plat });
      const vers = lv.versions ?? lv;
      note("info", "list_doc_versions", plat, Array.isArray(vers) ? vers.slice(0, 10) : clip(lv));
    } catch (e) {
      note("warn", "list_doc_versions", plat, String(e.message || e));
    }
  }

  validateProject({
    fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", entrypoints: { main: ["a.B"] } }),
  });
  diagnoseGradle({
    buildGradle: "plugins { id 'fabric-loom' }\n",
    gradleProperties: "minecraft_version=1.20.1\n",
  });
  analyzeCrash({ crashReport: "---- Minecraft Crash Report ----\njava.lang.NullPointerException\n", version: "1.20.1" });
  analyzeLog({ logText: "[Server thread/ERROR]: boom\n", version: "1.20.1" });
  checkDependencies("plugins { id 'fabric-loom' }\n", undefined, JSON.stringify({ id: "x" }));

  const tryCall = async (name, fn) => {
    try {
      await fn();
    } catch (e) {
      note("warn", name, "threw", String(e.message || e).slice(0, 240));
    }
  };

  await tryCall("convert_mapping", () =>
    convertMapping({
      from: "mcp",
      to: "mojang",
      memberName: "getHealth",
      ownerClass: "net.minecraft.world.entity.LivingEntity",
      version: "1.20.1",
    }),
  );
  await tryCall("get_method_params", () =>
    getMethodParams({
      className: "net.minecraft.world.entity.LivingEntity",
      methodName: "getHealth",
      version: "1.20.1",
    }),
  );
  await tryCall("lookup_obfuscated", () => lookupObfuscated({ name: "er", version: "1.20.1" }));

  generateLang("demo", { "item.demo.x": "X" });
  generateModel("demo", "x");
  generateWorldgen("demo", "x", "forge", "1.20.1");
  generateNetworkPacket("demo", "Sync", "forge_1.20.1");
  generateCapability("demo", "Mana", "forge", "1.20.1");
  generateConfig("demo", "forge", "1.20.1");
  generateEntityRenderer("demo", "SlimeFriend", "forge", "1.20.1");

  validateAddonManifest(
    JSON.stringify({
      format_version: 2,
      header: {
        name: "t",
        description: "d",
        uuid: "00000000-0000-0000-0000-000000000000",
        version: [1, 0, 0],
        min_engine_version: [1, 20, 0],
      },
      modules: [{ type: "data", uuid: "00000000-0000-0000-0000-000000000001", version: [1, 0, 0] }],
    }),
  );
  generateAddonManifest({ packName: "t", packType: "data" });
  generateBpEntity({ identifier: "demo:foo" });
  validateBpJson("entity", "{}");

  await tryCall("download_official_mdk", () =>
    downloadOfficialMdk({ platform: "forge", minecraftVersion: "1.20.1", dryRun: true }),
  );
  await tryCall("analyze_porting_path", () => analyzePortingPath({ projectPath: ROOT }));
  await tryCall("port_project", () =>
    portProject({ projectPath: ROOT, targetPlatform: "fabric", dryRun: true, action: "extract_common" }),
  );
  await tryCall("mc_skill_update", () => mcSkillUpdate({ action: "check" }));

  queryRegistry({ query: "minecraft:stone" });
  validateDatapackJson({
    kind: "recipe",
    jsonContent: JSON.stringify({
      type: "minecraft:crafting_shapeless",
      ingredients: [{ item: "minecraft:stone" }],
      result: { item: "minecraft:dirt" },
    }),
  });
  checkPublishReady({ fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", license: "MIT" }) });
  inspectRuntime({ projectPath: ROOT });
  await tryCall("mixin_analyze", () => mixinAnalyze({ mixinsJson: JSON.stringify({ package: "a.b", mixins: [] }) }));
  await tryCall("audit_resources", () => auditResources({ resourceRoot: join(ROOT, "mcp-server") }));
  await tryCall("search_mod_code", () => searchModCodeHandler({ query: "class", jarPath: join(REPO, "nope.jar") }));
  await tryCall("analyze_mod_jar", () => analyzeModJarHandler({ jarPath: join(REPO, "nope.jar") }));
  await tryCall("ingest_loader_api", () =>
    ingestLoaderApi({
      platform: "liteloader",
      minecraftVersion: "1.12.2",
      jarPath: "C:/nope.jar",
      mappingsVersion: "mcp-1.12.2",
      dryRun: true,
    }),
  );
  listKnowledgeResources();
  readKnowledgeResource("mcskill://workflow/mc-new-block");
  await tryCall("localize_mod", () => localizeMod({ mode: "own", action: "diff" }));
  await tryCall("validate_at", () => validateAtHandler({ atContent: "# test\n" }));
  await tryCall("validate_aw", () => validateAwHandler({ awContent: "accessWidener v1 named\n" }));

  const err = findings.filter((f) => f.sev === "error");
  const warn = findings.filter((f) => f.sev === "warn");
  writeFileSync(join(REPO, "_sweep-findings.json"), JSON.stringify({ error: err.length, warn: warn.length, findings }, null, 2));
  console.log(JSON.stringify({ error: err.length, warn: warn.length, errors: err, warns: warn }, null, 2));
  if (err.length) process.exitCode = 1;
  process.exit(process.exitCode ?? 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
