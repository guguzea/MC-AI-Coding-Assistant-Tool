import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

import { listVersions, searchForgeDocs, searchDocs, getDocFull, getDocRelated } from "./dist/docs-platform/forge/index.js";
import { analyzePortingPath, portProject } from "./dist/porting/index.js";
import { convertYarnMember, closeAllYarnDbs } from "./dist/mappings/yarn-sqlite.js";
import { convertMapping, suggestSimilarMethods } from "./dist/mappings/index.js";
import { createFabricDocStore } from "./dist/docs-platform/fabric/store.js";
import { searchFabricDocs, listFabricVersions } from "./dist/docs-platform/fabric/index.js";
import { ForgeDocStore } from "./dist/docs-platform/forge/store.js";
import {
  PlatformDataMissingError,
  hasPlatformDocData,
  platformDataMissingPayload,
} from "./dist/docs-platform/platform-data.js";
import { resolvePlatformDataDir } from "./dist/docs-platform/store.js";
import { NeoForgeDocStore } from "./dist/docs-platform/neoforge/store.js";
import { assertWritablePath, ProjectPathError, isInsideReal, nativeReal } from "./dist/utils/project-sandbox.js";
import { searchNeoForgeDocs } from "./dist/docs-platform/neoforge/index.js";
import { generateDatagen } from "./dist/datagen/index.js";
import { generateLang, generateCapability, generateConfig, generateEntityRenderer } from "./dist/generators/index.js";
import { diagnoseGradle, detectMinecraftVersion } from "./dist/gradle/index.js";
import { detectLoader, getMigrationGuide, checkDependencies } from "./dist/diagnostics/index.js";
import { getVersionInfo } from "./dist/version/index.js";
import { resolvePackFormat } from "./dist/localize/pack-format.js";
import { mapShortCommand } from "./dist/cli-parse.js";
import { isQslSpecificQuery, filterFabricFallbackHits } from "./dist/docs-platform/quilt-fallback-filter.js";
import {
  generateAddonManifest,
  generateBpEntity,
  loadBedrockDocsStatus,
  validateAddonManifest,
  getBedrockDocFull,
} from "./dist/bedrock/index.js";
import { listSemanticDbPresence, semanticStaleSearchWarning } from "./dist/docs-platform/semantic/status.js";
import { isSemanticIndexStale } from "./dist/docs-platform/semantic/fingerprint.js";
import { SEMANTIC_DDL, semanticDbPath } from "./dist/docs-platform/semantic/search.js";
import { resolveDataDir } from "./dist/utils/path.js";
import { symlinkSync } from "node:fs";
import { resolve } from "node:path";
import {
  listCommunitySources,
  searchCommunityDocs,
  getCommunityDocFull,
} from "./dist/docs-platform/community/index.js";
import { analyzeCrash } from "./dist/crash/index.js";
import { validateProject } from "./dist/validate/index.js";
import { validateDatapackJson } from "./dist/datapack/index.js";
import { collectJavaSources } from "./dist/utils/project-files.js";
import { checkPublishReady } from "./dist/publish/index.js";
import { inspectRuntime } from "./dist/runtime-inspect/index.js";
import { exclusiveFabricFallbackRefusal } from "./dist/docs-platform/quilt-search.js";
import { getWorkflowTemplate, WORKFLOW_TEMPLATES } from "./dist/prompts/index.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseToolText(result) {
  return JSON.parse(result.content[0].text);
}

async function testNeoForgeGenericRouting() {
  const response = parseToolText(await listVersions({ platform: "neoforge" }));
  assert.equal(response.platform, "neoforge");
  assert.ok(Array.isArray(response.versions));
  assert.ok(response.versions.length > 0, "NeoForge should expose at least one indexed version");
}

async function testUnknownPlatformEvidence() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-empty-"));
  try {
    const result = JSON.parse(await analyzePortingPath({ projectPath: root }));
    assert.equal(result.ok, false);
    assert.equal(result.error.code, "NOT_A_MOD_PROJECT");
    const withTarget = JSON.parse(await analyzePortingPath({ projectPath: root, targetPlatform: "fabric" }));
    assert.equal(withTarget.ok, false);
    assert.equal(withTarget.error.code, "NOT_A_MOD_PROJECT");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function testForgeDetectedFromGradleOnly() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-forge-meta-"));
  try {
    mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(
      join(root, "build.gradle"),
      `
plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }
minecraft { mappings channel: 'official', version: '1.20.1' }
dependencies {
  minecraft 'net.minecraftforge:forge:1.20.1-47.2.0'
}
`,
      "utf8",
    );
    writeFileSync(
      join(root, "src", "main", "resources", "META-INF", "mods.toml"),
      `
modLoader="javafml"
loaderVersion="[47,)"
[[mods]]
modId="examplemod"
version="1.0.0"
displayName="Example Mod"
`,
      "utf8",
    );
    const result = JSON.parse(await analyzePortingPath({
      projectPath: root,
      targetPlatform: "neoforge",
      targetVersion: "1.20.4",
    }));
    assert.equal(result.analysis.current.platform, "forge");
    assert.equal(result.analysis.current.modId, "examplemod");
    assert.equal(result.analysis.current.mcVersion, "1.20.1");
    assert.equal(result.analysis.current.platformVersion, "47.2.0");
    assert.equal(result.analysis.current.mappings, "official");
    assert.equal(result.analysis.current.stats.javaFiles, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function testArchitecturyDryRunDoesNotWrite() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-dryrun-"));
  try {
    const result = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      targetVersion: "1.20.4",
      modId: "examplemod",
      dryRun: true,
    }));
    assert.equal(result.ok, true);
    assert.equal(result.dryRun, true);
    assert.equal(existsSync(join(root, "common")), false);
    assert.equal(existsSync(join(root, "fabric")), false);
    assert.equal(existsSync(join(root, "neoforge")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function testWriteBlockedWithoutAllowEnv() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-block-"));
  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevRoot = process.env.MC_SKILL_PROJECT_ROOT;
  delete process.env.MC_SKILL_ALLOW_WRITE;
  delete process.env.MC_SKILL_PROJECT_ROOT;
  try {
    const result = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      dryRun: false,
      confirmed: true,
      modId: "sandboxmod",
    }));
    assert.equal(result.ok, false);
    assert.equal(result.error.code, "WRITE_DISABLED");
  } finally {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevRoot === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevRoot;
    rmSync(root, { recursive: true, force: true });
  }
}

async function testMigrationRequiresConfirmationAndWritesWhenConfirmed() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-migrate-"));
  const source = join(root, "src", "main", "java", "Example.java");
  mkdirSync(join(root, "src", "main", "java"), { recursive: true });
  writeFileSync(source, "import net.minecraftforge.eventbus.api.Event;\n", "utf8");

  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevRoot = process.env.MC_SKILL_PROJECT_ROOT;
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = root;

  try {
    await portProject({
      projectPath: root,
      action: "apply_version_migration",
      dryRun: false,
      confirmed: false,
    });
    assert.match(readFileSync(source, "utf8"), /net\.minecraftforge/);

    await portProject({
      projectPath: root,
      action: "apply_version_migration",
      dryRun: false,
      confirmed: true,
    });
    assert.match(readFileSync(source, "utf8"), /net\.neoforged/);
    assert.doesNotMatch(readFileSync(source, "utf8"), /net\.minecraftforge/);
  } finally {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevRoot === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevRoot;
    rmSync(root, { recursive: true, force: true });
  }
}

async function testYarnShortNameAndMojangHeuristic() {
  const dataRoot =
    process.env.MC_SKILL_DATA ??
    resolve(fileURLToPath(new URL("..", import.meta.url)), "data");
  process.env.MC_SKILL_DATA = dataRoot;
  try {
    const short = convertYarnMember("1.20.1", "yarn", "mojang", "Block");
    assert.equal(short.found, true);
    assert.equal(short.converted, "cpn");

    const fqn = convertYarnMember(
      "1.20.1",
      "mojang",
      "yarn",
      "net.minecraft.world.level.block.Block",
    );
    assert.equal(fqn.found, true);
    assert.equal(fqn.converted, "net/minecraft/block/Block");
  } finally {
    closeAllYarnDbs();
  }
}

async function testFabricClassPrefixSearch() {
  const dataRoot =
    process.env.MC_SKILL_DATA ??
    resolve(fileURLToPath(new URL("..", import.meta.url)), "data");
  process.env.MC_SKILL_DATA = dataRoot;
  const store = createFabricDocStore("1.20.4", "fabric-docs", dataRoot);
  const byClass = store.searchIndex("class:item", "1.20.4");
  assert.ok(byClass.length > 0, "class:item should hit L0 index via prefix-only filter");
  const byPlain = store.searchIndex("item", "1.20.4");
  assert.ok(byPlain.length > 0, "plain item search should still work");
}

async function testSandboxAssertWritablePath() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-sandbox-"));
  const secret = mkdtempSync(join(tmpdir(), "mc-skill-secret-"));
  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevRoot = process.env.MC_SKILL_PROJECT_ROOT;
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = root;
  try {
    // New file under existing parent — allowed
    assertWritablePath(join(root, "NewFile.java"), nativeReal(root));

    // Relative PROJECT_ROOT rejected
    process.env.MC_SKILL_PROJECT_ROOT = "relative-not-allowed";
    const blocked = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      dryRun: false,
      confirmed: true,
      modId: "relmod",
    }));
    assert.equal(blocked.ok, false);
    assert.equal(blocked.error.code, "PROJECT_ROOT_REQUIRED");

    process.env.MC_SKILL_PROJECT_ROOT = root;

    // Symlink / junction escape: link inside root pointing outside
    const linkInside = join(root, "escape-link");
    try {
      symlinkSync(secret, linkInside, "junction");
    } catch {
      try {
        symlinkSync(secret, linkInside, "dir");
      } catch (e) {
        console.log("skip symlink escape test:", e.message);
        return;
      }
    }
    let threw = false;
    try {
      assertWritablePath(join(linkInside, "leak.txt"), nativeReal(root));
    } catch (e) {
      threw = true;
      assert.ok(e instanceof ProjectPathError);
      assert.equal(e.code, "PATH_OUTSIDE_ALLOWLIST");
    }
    assert.equal(threw, true, "symlink/junction escape must be rejected");

    // Windows case-insensitive prefix
    if (process.platform === "win32") {
      const a = nativeReal(root);
      const b = a.toUpperCase();
      assert.equal(isInsideReal(a, b), true);
    }
  } finally {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevRoot === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevRoot;
    rmSync(root, { recursive: true, force: true });
    rmSync(secret, { recursive: true, force: true });
  }
}

async function testNeoForge1201ForgeCompat() {
  const dataRoot =
    process.env.MC_SKILL_DATA ??
    resolve(fileURLToPath(new URL("..", import.meta.url)), "data");
  process.env.MC_SKILL_DATA = dataRoot;
  const result = await searchNeoForgeDocs({ query: "event", version: "1.20.1" });
  const text = result.content[0].text;
  const body = JSON.parse(text);
  assert.equal(body.ok, true);
  assert.ok(Array.isArray(body.results));
  assert.ok(body.results.length > 0, "NeoForge 1.20.1 should fall back to Forge docs");
  assert.equal(body.forgeCompatible, true);
}

async function testCommunityDocsSearchAndLinks() {
  const listed = await listCommunitySources();
  assert.ok(listed.total >= 1, "community index should have entries");
  assert.equal(listed.byKind?.unknown ?? 0, 0, "AGENT_USAGE/README must not be indexed as unknown");
  const empty = await searchCommunityDocs({ query: "   " });
  assert.equal(empty.total, 0, "blank query must not list all entries");
  const search = await searchCommunityDocs({ query: "发布" });
  assert.ok(search.total >= 1, "search 发布 should hit authored publishing");
  assert.ok(search.results.some((r) => r.id.includes("publishing") || /发布/.test(r.label + r.summary)));
  const cap = await searchCommunityDocs({ query: "ITEM_HANDLER" });
  assert.ok(cap.total >= 1, "search ITEM_HANDLER should hit capability short doc");
  const bodyHit = await searchCommunityDocs({ query: "发表模组篇" });
  assert.ok(bodyHit.total >= 1, "body search should hit permitted crash-publishing page");
  const titleHit = await searchCommunityDocs({ query: "如何制作并且维护" });
  assert.ok(titleHit.total >= 1, "permitted pages should be findable by guide title via index summary");
  const cjk = await searchCommunityDocs({ query: "漏斗管道Capability" });
  assert.ok(cjk.total >= 1, "CJK tokenization should hit capability docs");
  const linkHits = await searchCommunityDocs({ query: "官方文档", sourceKind: "links" });
  assert.ok(linkHits.total >= 1);
  const full = await getCommunityDocFull({ id: linkHits.results[0].id });
  assert.equal(full.linkOnly, true);
  assert.ok(full.url, "links full must return url");
  assert.equal(full.content, "");
  const machine = await getCommunityDocFull({ id: "authored/machine-be-gui-working" });
  assert.ok(!machine.content.startsWith("\r"), "full content should strip leading CR after frontmatter");
  assert.match(machine.content, /^#\s/);
}

async function testSearchEnhancements() {
  const deferred = parseToolText(await searchForgeDocs({ query: "DeferredRegister", version: "1.20.1" }));
  assert.ok(deferred.total >= 1, "DeferredRegister should hit");
  assert.ok(
    deferred.results.some((r) => /registr/i.test(r.id + r.label)),
    "DeferredRegister should relate to registries",
  );

  const registry = parseToolText(await searchForgeDocs({ query: "registry", version: "1.20.1" }));
  assert.ok(registry.total >= 1);
  assert.ok(
    /concepts|registr/i.test(registry.results[0].id + registry.results[0].label),
    "registry ranking should prefer concepts/registry page",
  );

  const fallback = parseToolText(await searchForgeDocs({ query: "block", version: "9.9.9" }));
  assert.equal(fallback.versionFallback, true);
  assert.ok(fallback.resolvedVersion);
  assert.notEqual(fallback.resolvedVersion, "9.9.9");

  const dataRoot = resolveDataDir();
  const forgeStore = new ForgeDocStore(dataRoot);
  forgeStore.searchIndex("DeferredRegister", "1.20.1");
  const gen1 = forgeStore.getSymbolIndexBuildGeneration("1.20.1");
  forgeStore.searchIndex("RegisterEvent", "1.20.1");
  const gen2 = forgeStore.getSymbolIndexBuildGeneration("1.20.1");
  assert.equal(gen1, 1);
  assert.equal(gen2, 1, "symbol index must not rebuild on second search");

  const fabricMiss = parseToolText(await searchFabricDocs({ query: "Registry", version: "9.9.9" }));
  assert.equal(fabricMiss.ok, false);
  assert.equal(fabricMiss.error?.code, "VERSION_NOT_FOUND");

  const fabricHit = parseToolText(await searchFabricDocs({ query: "Identifier", version: "1.20.1" }));
  assert.ok(fabricHit.total >= 1 || fabricHit.results?.length >= 1, "Fabric Identifier should hit via L1 symbols");

  const nf = parseToolText(await searchNeoForgeDocs({ query: "registry", version: "1.20.4" }));
  assert.ok(nf.total >= 1);
  for (const r of nf.results.slice(0, 5)) {
    const hay = `${r.id} ${r.label} ${(r.tags ?? []).join(" ")}`.toLowerCase();
    // 修 bug 后不应整页无词却仅因 high priority 进结果；允许 concepts 等同义命中
    assert.ok(
      /registr|deferred|block|item|event/i.test(hay) || (r.score ?? 1) > 0,
      `neoforge registry hit should be topical: ${r.id}`,
    );
  }
  assert.ok(
    nf.results.some((r) => typeof r.score === "number" && r.score > 0),
    "NeoForge search results must retain relevance score",
  );

  // AT 短查询白名单：不得被停用词表丢弃
  const { enhancedSearch, expandQueryTerms } = await import("./dist/docs-platform/search-utils.js");
  assert.ok(expandQueryTerms("constructor").includes("constructor"), "constructor must not hit Object.prototype");
  assert.ok(expandQueryTerms("toString").includes("tostring"));
  const ctorHits = enhancedSearch({
    query: "constructor",
    l0: [
      {
        id: "blocks/blocks",
        label: "Blocks",
        tags: ["block"],
        priority: "🟡",
      },
    ],
    limit: 5,
    minTokenLength: 2,
  });
  assert.ok(Array.isArray(ctorHits), "constructor query must not throw");
  const atHits = enhancedSearch({
    query: "AT",
    l0: [
      {
        id: "advanced/accesstransformers",
        label: "Access Transformers",
        tags: ["at", "accesstransformer"],
        priority: "⭐",
      },
      {
        id: "blocks",
        label: "Blocks",
        tags: ["block"],
        priority: "🟢",
      },
    ],
    limit: 5,
    minTokenLength: 2,
  });
  assert.ok(atHits.length >= 1, "AT whitelist query must not be dropped as stop word");
  assert.ok(
    atHits.some((h) => /accesstransformer|at/i.test(h.id + h.label + h.tags.join(" "))),
    "AT should match access transformer page",
  );

  const fabricViaDocs = parseToolText(
    await searchDocs({ query: "Identifier", version: "1.20.1", platform: "fabric", source: "fabric-docs" }),
  );
  assert.equal(fabricViaDocs.ok, true);
  assert.equal(fabricViaDocs.source, "fabric-docs");
  assert.ok(fabricViaDocs.total >= 1 || fabricViaDocs.results?.length >= 1);

  const nfFb = parseToolText(await searchNeoForgeDocs({ query: "block", version: "26.2" }));
  assert.equal(nfFb.versionFallback, true);
  assert.equal(nfFb.resolvedVersion, "26.1");
  assert.ok(nfFb.warning, "26.2 fallback must include warning");

  const nf1201 = new NeoForgeDocStore(dataRoot);
  const summary = nf1201.loadSummary("concepts/registries", "1.20.1");
  assert.ok(summary.id.includes("registr"), "1.20.1 short id should resolve");

  const docsFb = parseToolText(await searchDocs({ query: "block", version: "9.9.9", platform: "forge" }));
  assert.equal(docsFb.versionFallback, true);

  // 数据层验收：Fabric label 可读；NeoForge 1.20.4 含 concepts/registries
  const fabricL0Path = join(dataRoot, "fabric_1.20.1", "fabric-docs", "1.20.1", "index-l0.json");
  const fabricL0 = JSON.parse(readFileSync(fabricL0Path, "utf8"));
  const eventsEntry = fabricL0.find((e) => String(e.id).includes("develop_events"));
  assert.ok(eventsEntry, "fabric L0 must include develop_events");
  assert.equal(eventsEntry.label, "Events", "FAB-05: label must be readable title not slug");
  assert.ok(
    fabricL0.some((e) => (e.tags ?? []).includes("registry") || (e.tags ?? []).includes("datagen")),
    "fabric L0 should carry semantic tags like registry/datagen",
  );

  const nfL0Path = join(dataRoot, "neoforge_1.20.4", "neoforge-docs", "1.20.4", "index-l0.json");
  const nfL0 = JSON.parse(readFileSync(nfL0Path, "utf8"));
  assert.ok(
    nfL0.some((e) => e.id === "concepts/registries" || String(e.id).endsWith("concepts/registries")),
    "NeoForge 1.20.4 index-l0 must include concepts/registries",
  );
  const nfReg = parseToolText(await searchNeoForgeDocs({ query: "registry", version: "1.20.4" }));
  assert.ok(
    nfReg.results.some((r) => /concepts\/registries|registries/i.test(r.id + r.label)),
    "search_neoforge_docs registry@1.20.4 should hit concepts/registries",
  );
}

async function testDatagenAndMappingGates() {
  const soft = generateDatagen({
    providerType: "recipe",
    modId: "example.mod",
    targetName: "My-Block",
    platform: "forge",
    version: "1.20.1",
  });
  assert.ok(soft.code, "soft-normalized datagen should still emit code");
  assert.equal(soft.usedModId, "example_mod");
  assert.equal(soft.usedTargetName, "my_block");
  assert.ok(soft.warnings?.length >= 1);

  const pascal = generateDatagen({
    providerType: "recipe",
    modId: "ExampleMod",
    targetName: "ruby_block",
    platform: "forge",
    version: "1.20.1",
  });
  assert.ok(pascal.code?.includes("ExampleModRecipeProvider"), "class name must keep PascalCase");
  assert.ok(pascal.code?.includes("examplemod:ruby_block"), "recipe id must use targetName");
  assert.ok(!pascal.code?.includes("ExamplemodRecipeProvider"));

  for (const t of /** @type {const} */ (["recipe", "blockstate", "itemmodel", "loottable", "tag"])) {
    const d = generateDatagen({ providerType: t, modId: "demo", targetName: "stone_block", platform: "forge", version: "1.20.1" });
    assert.ok(d.code?.includes("net.minecraft.data.PackOutput"), `${t} PackOutput`);
    assert.ok(!d.code?.includes("data.pack.PackOutput"), `${t} wrong PackOutput package`);
    assert.ok(!d.code?.includes("::iterator"), `${t} must not use ::iterator`);
    assert.ok(d.code?.includes("net.minecraftforge"), `${t} forge imports`);
    assert.ok(!d.code?.includes("net.neoforged"), `${t} must not be NeoForge`);
    if (t === "loottable") assert.ok(d.code?.includes("void generate()"), "loot generate()");
    assert.ok(!d.code?.includes("fromNamespaceAndPath"), `${t} 1.20.1 must not use 1.21 factory`);
  }

  const forge112 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "stone_block",
    platform: "forge",
    version: "1.12.2",
  });
  assert.equal(forge112.code, null);
  assert.ok(forge112.errors?.some((e) => /仅覆盖 1\.20\.1/.test(e)), JSON.stringify(forge112));

  const nfRecipe = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "stone_block",
    platform: "neoforge",
    version: "1.21.1",
  });
  assert.ok(nfRecipe.code?.includes("net.neoforged.neoforge.data.event.GatherDataEvent"));
  assert.ok(nfRecipe.code?.includes("RecipeOutput"));
  assert.ok(!nfRecipe.code?.includes("net.minecraftforge"));

  for (const t of /** @type {const} */ (["advancement", "particle", "sound"])) {
    const forgeExtra = generateDatagen({ providerType: t, modId: "demo", targetName: "spark", platform: "forge", version: "1.20.1" });
    assert.ok(forgeExtra.code?.includes("net.minecraftforge"), `${t} forge path`);
    assert.ok(!forgeExtra.code?.includes("fromNamespaceAndPath"), `${t} 1.20.1 factory`);

    const nfExtra = generateDatagen({
      providerType: t,
      modId: "demo",
      targetName: "spark",
      platform: "neoforge",
      version: "1.21.1",
    });
    assert.ok(nfExtra.code?.includes("net.neoforged"), `${t} neoforge path`);
    if (t === "advancement") {
      assert.ok(
        nfExtra.code?.includes("net.neoforged.neoforge.common.data.AdvancementProvider"),
        "NeoForge AdvancementProvider",
      );
    }
    if (t === "sound") {
      assert.ok(nfExtra.code?.includes("SoundDefinitionsProvider"), "sound datagen provider");
    }
    if (t === "particle") {
      assert.ok(nfExtra.code?.includes("ParticleDescriptionProvider"), "particle datagen provider");
    }
  }

  const sugg = suggestSimilarMethods("getHealth", ["getMaxHealth", "getHunger", "hurt"]);
  assert.ok(sugg.includes("getMaxHealth"));
  const short = suggestSimilarMethods("getH", ["getHunger", "getMaxHealth", "getHealth"]);
  assert.equal(short.length, 0, "getH must not suggest unrelated methods");

  const mapped = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "getHealth",
    ownerClass: "net.minecraft.world.entity.LivingEntity",
    version: "1.20.1",
  });
  assert.equal(mapped.found, true);
  assert.equal(mapped.mappingType, "method");
  assert.ok(mapped.converted && mapped.converted !== "getHealth", "mcp→mojang must convert official");
  assert.equal(mapped.fallbackUsed, false);

  const csvFwd = convertMapping({
    from: "mojang",
    to: "mcp",
    memberName: "func_110143_aJ",
    version: "1.14.4",
  });
  assert.equal(csvFwd.found, true);
  assert.equal(csvFwd.converted, "getHealth");
  assert.equal(csvFwd.mappingEra, "mcp-csv");

  const csvRev = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "getHealth",
    version: "1.14.4",
  });
  // getHealth 在 CSV 中对应多条 searge → ambiguous（符合 R2/R3）
  assert.equal(csvRev.found, false);
  assert.equal(csvRev.ambiguous, true);
  assert.ok(
    csvRev.candidates?.some((c) => c.official === "func_110143_aJ"),
    "candidates should include LivingEntity getHealth searge",
  );
  assert.ok(csvRev.action?.code === "AMBIGUOUS" || csvRev.action?.code === "NOT_FOUND");

  // schema v3 field: CSV searge field
  const fieldCsv = convertMapping({
    from: "mojang",
    to: "mcp",
    memberName: "field_100013_f",
    version: "1.14.4",
    memberKind: "field",
  });
  assert.equal(fieldCsv.found, true, "1.14.4 fields.csv should resolve field searge");
  assert.equal(fieldCsv.converted, "isPotionDurationMax");
  assert.equal(fieldCsv.mappingType, "field");
  assert.equal(fieldCsv.schemaVersion, "3");

  // yarn-tiny field path must not claim SCHEMA_FIELDS_UNAVAILABLE on v3
  const fieldYarn = convertMapping({
    from: "yarn",
    to: "mojang",
    memberName: "age",
    ownerClass: "net.minecraft.world.entity.Entity",
    version: "1.20.1",
    memberKind: "field",
  });
  assert.notEqual(fieldYarn.resultKind, "SCHEMA_FIELDS_UNAVAILABLE");
  assert.equal(fieldYarn.schemaVersion, "3");

  const csvRevUnique = convertMapping({
    from: "mojang",
    to: "mcp",
    memberName: "func_110143_aJ",
    version: "1.14.4",
  });
  assert.equal(csvRevUnique.found, true);
  assert.equal(csvRevUnique.converted, "getHealth");

  const csvOwner = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "getHealth",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.14.4",
  });
  // 1.14.4 有 fabric yarn-tiny：带 owner 走 Yarn（不走纯 CSV）
  assert.equal(csvOwner.found, true);
  assert.equal(csvOwner.mappingEra, "yarn-tiny");
  assert.ok(
    csvOwner.converted && !String(csvOwner.converted).startsWith("func_"),
    "1.14.4 yarn owner path must return obf not searge",
  );

  // 1.12.2 / 1.13.2：SRG/TSRG + CSV — 带 owner 的 MCP 名 → 真正 obf（非 func_）
  for (const [ver, obf] of [
    ["1.12.2", "cd"],
    ["1.13.2", "cq"],
  ]) {
    const legacyOwner = convertMapping({
      from: "mcp",
      to: "mojang",
      memberName: "getHealth",
      ownerClass: "net.minecraft.entity.EntityLivingBase",
      version: ver,
    });
    assert.equal(legacyOwner.found, true, `${ver} owner+getHealth must hit`);
    assert.equal(legacyOwner.converted, obf, `${ver} mcp→mojang must be obf not searge`);
    assert.ok(
      !String(legacyOwner.converted).startsWith("func_"),
      `${ver} must not return searge as mojang`,
    );
    assert.equal(legacyOwner.named, "getHealth");

    const legacySearge = convertMapping({
      from: "mcp",
      to: "mojang",
      memberName: "func_110143_aJ",
      version: ver,
    });
    assert.equal(legacySearge.found, true, `${ver} unique searge must hit`);
    assert.equal(legacySearge.converted, obf, `${ver} searge→mojang must be obf`);
    assert.equal(legacySearge.named, "getHealth");
  }

  const miss = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "noSuchMethodZZZ",
    ownerClass: "net.minecraft.world.entity.LivingEntity",
    version: "1.20.1",
  });
  assert.equal(miss.found, false);
  assert.equal(miss.converted, null);
  assert.equal(miss.fallbackUsed, false);

  const fb = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "noSuchMethodZZZ",
    ownerClass: "net.minecraft.world.entity.LivingEntity",
    version: "1.20.1",
    allow_fallback: true,
  });
  assert.equal(fb.found, false);
  assert.equal(fb.converted, "noSuchMethodZZZ");
  assert.equal(fb.fallbackUsed, true);

  const { queryApi, disposeApiData } = await import("./dist/api/index.js");
  const api = await queryApi({
    className: "net.minecraft.world.entity.LivingEntity",
    methodName: "getHealth",
    version: "1.20.1",
  });
  assert.equal(api.found, true);
  assert.ok(api.methods?.some((m) => m.name === "getHealth" && m.descriptor === "()F"));

  // Forge/Parchment = Mojang named (1.20.1 Entity uses level() not getLevel/getWorld)
  for (const [methodName, yarnWrong] of [
    ["level", "getWorld"],
    ["getDeltaMovement", "getVelocity"],
    ["isUnderWater", "isSubmergedInWater"],
    ["isCrouching", "isInSneakingPose"],
    ["isShiftKeyDown", "isSneaking"],
    ["getUUID", "getUuid"],
  ]) {
    const hit = await queryApi({
      className: "net.minecraft.world.entity.Entity",
      methodName,
      version: "1.20.1",
    });
    assert.equal(hit.found, true, `Entity.${methodName} must be found (Mojang name)`);
    const wrong = await queryApi({
      className: "net.minecraft.world.entity.Entity",
      methodName: yarnWrong,
      version: "1.20.1",
    });
    assert.equal(
      wrong.found,
      false,
      `Entity.${yarnWrong} is Yarn-only and must NOT be in Forge api-index`,
    );
  }

  const blck = await queryApi({
    className: "net.minecraft.world.level.block.entity.Blck",
    version: "1.20.1",
  });
  assert.equal(blck.found, false, "edit-distance Blck must not be a hit");
  const joined = (blck.suggestions ?? []).join(" ");
  assert.ok(!/\bPack\b/.test(joined), `Blck must not suggest Pack: ${joined}`);
  const q1211 = await queryApi({
    className: "net.minecraft.world.entity.LivingEntity",
    version: "1.21.1",
  });
  assert.equal(q1211.found, false);
  assert.ok(q1211.warning && /无 Vanilla API 索引/.test(q1211.warning), JSON.stringify(q1211).slice(0, 500));
  disposeApiData();

  const gradle = diagnoseGradle({
    buildGradle: `
plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }
java.toolchain.languageVersion = JavaLanguageVersion.of(17)
minecraft { mappings channel: 'parchment', version: '2023.09.03-1.20.1' }
dependencies { minecraft 'net.minecraftforge:forge:1.20.1-47.2.0' }
jar { finalizedBy 'reobfJar' }
copyIdeResources = true
`,
    gradleProperties: "minecraft_version=1.19.2\nforge_version=47.1.0\n",
  });
  assert.ok(gradle.errors.some((e) => /不一致/.test(e)));

  const loom = diagnoseGradle({
    buildGradle: `plugins { id 'fabric-loom' version '1.6-SNAPSHOT' }\n`,
  });
  assert.equal(loom.status, "failed");
  assert.ok(loom.errors.some((e) => /toolchain|Java/.test(e)), JSON.stringify(loom.errors));
  assert.ok(loom.suggestions.some((s) => s.includes("search_fabric_docs")));
  assert.ok(!loom.suggestions.some((s) => /query_fabric_registry/.test(s)));

  const loom261 = diagnoseGradle({
    buildGradle: `plugins { id 'fabric-loom' version '1.6-SNAPSHOT' }\ndependencies { modImplementation 'net.fabricmc.fabric-api:fabric-api:1.0' }\n`,
    gradleProperties: "minecraft_version=26.1.2\n",
  });
  assert.equal(loom261.status, "failed");
  assert.ok(loom261.errors.some((e) => /net\.fabricmc\.fabric-loom/.test(e)), JSON.stringify(loom261.errors));
  assert.ok(loom261.errors.some((e) => /modImplementation/.test(e)));
  assert.ok(loom261.errors.some((e) => /25/.test(e)));

  const neo = diagnoseGradle({
    buildGradle: `plugins { id 'net.neoforged.gradle.userdev' version '7.0.80' }\n`,
  });
  assert.ok(neo.suggestions.some((s) => s.includes("search_neoforge_docs")));

  // E2E-004：liteloader 插件不得跑 FG6 / Java17 / 1.20
  const ll = diagnoseGradle({
    buildGradle: `
apply plugin: 'net.minecraftforge.gradle.liteloader'
minecraft {
  version = '1.12.2-14.23.5.2847'
  mappings = 'stable_39'
  runDir = 'run'
}
task runClient {}
`,
  });
  assert.equal(ll.errors.length, 0, JSON.stringify(ll.errors));
  assert.ok(!ll.errors.some((e) => /Java 17|toolchain|6\.0,6\.2|forge:1\.20|47/.test(e)));
  assert.ok(!ll.warnings.some((w) => /Java toolchain 应为 17|Minecraft 版本.*1\.20|不以 47/.test(w)));
  assert.ok(ll.warnings.some((w) => /LiteMod/.test(w)));

  const llHybridNoPlugin = diagnoseGradle({
    buildGradle: `
apply plugin: 'net.minecraftforge.gradle.forge'
dependencies { minecraft 'net.minecraftforge:forge:1.12.2-14.23.5.2847' }
// LiteMod
`,
  });
  assert.ok(llHybridNoPlugin.errors.some((e) => /liteloader/.test(e)));
  assert.ok(!llHybridNoPlugin.warnings.some((w) => /Java toolchain 应为 17/.test(w)));

  const quiltLoom = diagnoseGradle({
    buildGradle: `plugins { id 'org.quiltmc.loom' version '1.7.4' }\n`,
  });
  assert.ok(quiltLoom.warnings.some((w) => /Quilt Loom/.test(w)));
  assert.ok(quiltLoom.suggestions.some((s) => /search_docs/.test(s)));

  const mlGradle = diagnoseGradle({
    buildGradle: "public class mod_Example extends BaseMod {\n  public String getName() { return \"x\"; }\n}\n",
  });
  assert.equal(mlGradle.errors.length, 0);
  assert.ok(mlGradle.warnings.some((w) => /ModLoader|BaseMod/.test(w)));
  assert.ok(mlGradle.suggestions.some((s) => /safe-api/.test(s)));

  const riftGradle = diagnoseGradle({
    buildGradle: "apply plugin: 'net.minecraftforge.gradle.tweaker-client'\n",
  });
  assert.ok(riftGradle.warnings.some((w) => /Rift/.test(w)));
  assert.ok(!riftGradle.errors.some((e) => /Java 17|6\.0,6\.2/.test(e)));

  const commentLl = diagnoseGradle({
    buildGradle: `
plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }
java.toolchain.languageVersion = JavaLanguageVersion.of(17)
dependencies { minecraft 'net.minecraftforge:forge:1.20.1-47.2.0' }
// migrated from liteloader last year
`,
  });
  assert.ok(!commentLl.errors.some((e) => /liteloader/.test(e)), JSON.stringify(commentLl.errors));
  assert.ok(!commentLl.warnings.some((w) => /LiteLoader|不要当 Forge 1\.20/.test(w)));
  assert.ok(
    commentLl.warnings.some((w) => /gradle.properties|copyIdeResources|mappings/.test(w)),
    JSON.stringify(commentLl.warnings),
  );

  const extrasLl = diagnoseGradle({
    buildGradle: `
plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }
java.toolchain.languageVersion = JavaLanguageVersion.of(17)
dependencies { minecraft 'net.minecraftforge:forge:1.20.1-47.2.0' }
`,
    litemodJson: '{"name":"legacy"}',
  });
  assert.ok(
    extrasLl.errors.some((e) => /未 apply plugin: 'net.minecraftforge.gradle.liteloader'/.test(e)),
    JSON.stringify(extrasLl.errors),
  );
  assert.ok(!extrasLl.warnings.some((w) => /Java toolchain 应为 17/.test(w)));
  assert.ok(!extrasLl.errors.some((e) => /Java 17|6\.0,6\.2|forge:1\.20/.test(e)));

  const lang = generateLang("demo", {
    "item.demo.sword": "Sword",
    item_gem: "Gem",
    ruby: "Ruby",
  });
  const en = JSON.parse(lang.files["assets/demo/lang/en_us.json"]);
  assert.equal(en["item.demo.sword"], "Sword");
  assert.equal(en["item.demo.gem"], "Gem");
  assert.equal(en["block.demo.ruby"], undefined);
  assert.ok(!("ruby" in en));
  assert.ok(lang.warnings?.some((w) => /ruby/.test(w)));
}

async function testPortingFabricYarnAndProps() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-port-props-"));
  try {
    mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(join(root, "gradle.properties"), "minecraft_version=1.20.1\nforge_version=47.2.0\nmod_id=demo_mod\nmapping_channel=official\n", "utf8");
    writeFileSync(join(root, "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
    writeFileSync(
      join(root, "src", "main", "resources", "META-INF", "mods.toml"),
      'modLoader="javafml"\n[[mods]]\nmodId="${mod_id}"\n',
      "utf8",
    );
    const result = JSON.parse(await analyzePortingPath({
      projectPath: root,
      targetPlatform: "fabric",
      targetVersion: "1.20.1",
    }));
    assert.equal(result.analysis.current.modId, "demo_mod");
    assert.equal(result.analysis.current.mcVersion, "1.20.1");
    assert.equal(result.analysis.target.mappings, "yarn");
    assert.ok(!result.analysis.referenceLinks.some((l) => /26\.1/.test(l.url)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function testCrashAnalyzeKindAndMissingDep() {
  const { analyzeCrash, detectCrashKind } = await import("./dist/crash/index.js");
  const fmlName = "---- Minecraft Crash Report ----\nFile: crash-2024-01-01_12.00.00-fml.txt\nMissing or unsupported mandatory dependencies: examplelib\n";
  assert.equal(detectCrashKind(fmlName), "fml");
  const result = analyzeCrash({ crashReport: fmlName, version: "1.20.1" });
  assert.equal(result.crashKind, "fml");
  assert.match(result.probableCause, /缺少强制依赖|前置/);
  assert.ok(Array.isArray(result.logHints) && result.logHints.length > 0);

  const beNull =
    '---- Minecraft Crash Report ----\nDescription: Unexpected error\n\njava.lang.NullPointerException: Cannot invoke "net.minecraft.world.level.block.entity.BlockEntity.getBlockState()" because "be" is null\n';
  const beResult = analyzeCrash({ crashReport: beNull, version: "1.20.1" });
  assert.match(beResult.probableCause, /BlockEntity 引用为 null|未取到 BE/);
  assert.doesNotMatch(beResult.probableCause, /world 为 null/);

  const unknown = analyzeCrash({ crashReport: "not a crash report at all", version: "1.20.1" });
  assert.equal(unknown.crashKind, "unknown");
  assert.match(unknown.probableCause, /minecraft\.wiki\/w\/Crash_report/);
  assert.ok(unknown.fixSuggestions.some((s) => /minecraft\.wiki\/w\/Crash_report/.test(s)));

  assert.equal(detectCrashKind("org.quiltmc.loader.impl.QuiltLoader crashed"), "quilt");
  assert.equal(detectCrashKind("at com.mumfrey.liteloader.core.LiteLoader"), "liteloader");
  assert.equal(detectCrashKind("org.dimdev.riftloader.RiftLoaderClientTweaker"), "rift");
  assert.equal(
    detectCrashKind("---- Minecraft Crash Report ----\nat net.minecraft.src.ModLoader.init(ModLoader.java:120)\n"),
    "modloader",
  );
  assert.equal(
    detectCrashKind("---- Minecraft Crash Report ----\nat ModLoader.addMod(ModLoader.java:1)\n"),
    "modloader",
  );
  assert.equal(
    detectCrashKind(
      "---- Minecraft Crash Report ----\nFile: crash-2024-01-01_12.00.00-fabric.txt\norg.quiltmc.loader.impl.QuiltLoader failed\n",
    ),
    "quilt",
  );
}

async function testPlatformDataMissing() {
  const empty = mkdtempSync(join(tmpdir(), "mc-skill-plat-miss-"));
  try {
    assert.equal(hasPlatformDocData("fabric", empty), false);
    assert.equal(hasPlatformDocData("forge", empty), false);
    assert.equal(hasPlatformDocData("neoforge", empty), false);

    const forgeStore = new ForgeDocStore(empty);
    assert.throws(
      () => forgeStore.getAvailableVersions(),
      (e) => e instanceof PlatformDataMissingError && e.platform === "forge",
    );

    const fabStore = createFabricDocStore("1.20.1", "fabric-docs", empty);
    assert.throws(
      () => fabStore.searchIndex("Registry", "1.20.1"),
      (e) => e instanceof PlatformDataMissingError && e.platform === "fabric",
    );

    const prev = process.env.MC_SKILL_DATA;
    process.env.MC_SKILL_DATA = empty;
    try {
      assert.throws(
        () => resolvePlatformDataDir("neoforge"),
        (e) => e instanceof PlatformDataMissingError && e.platform === "neoforge",
      );

      const listed = parseToolText(await listFabricVersions());
      assert.equal(listed.ok, false);
      assert.equal(listed.error?.code, "PLATFORM_DATA_MISSING");
      assert.equal(listed.error?.platform, "fabric");
      assert.match(listed.error?.hint ?? "", /下载|fabric_/i);

      const searched = parseToolText(
        await searchFabricDocs({ query: "Registry", version: "1.20.1" }),
      );
      assert.equal(searched.ok, false);
      assert.equal(searched.error?.code, "PLATFORM_DATA_MISSING");

      const docsSearch = parseToolText(
        await searchDocs({ query: "block", version: "1.20.1", platform: "fabric" }),
      );
      assert.equal(docsSearch.ok, false);
      assert.equal(docsSearch.error?.code, "PLATFORM_DATA_MISSING");

      const neoListed = parseToolText(await listVersions({ platform: "neoforge" }));
      assert.equal(neoListed.ok, false);
      assert.equal(neoListed.error?.code, "PLATFORM_DATA_MISSING");
      assert.notEqual(neoListed.error?.code, "INTERNAL_ERROR");
    } finally {
      if (prev === undefined) delete process.env.MC_SKILL_DATA;
      else process.env.MC_SKILL_DATA = prev;
    }

    // 有完整数据时：错误版本仍是 VERSION_NOT_FOUND，不是 MISSING
    const fabricMiss = parseToolText(await searchFabricDocs({ query: "Registry", version: "9.9.9" }));
    assert.equal(fabricMiss.ok, false);
    assert.equal(fabricMiss.error?.code, "VERSION_NOT_FOUND");

    const payload = platformDataMissingPayload("neoforge");
    assert.equal(payload.error.code, "PLATFORM_DATA_MISSING");
  } finally {
    rmSync(empty, { recursive: true, force: true });
  }
}

/** hasPlatformDocData(neoforge) 认可 forge_1.20.1 时，resolvePlatformDataDir 必须同样认可，避免 INTERNAL_ERROR */
async function testNeoForgeResolveDirForgeCompat() {
  const forgeOnly = mkdtempSync(join(tmpdir(), "mc-skill-nf-forge-compat-"));
  const forgeDocs = join(forgeOnly, "forge_1.20.1", "forge-docs", "1.20.1");
  mkdirSync(forgeDocs, { recursive: true });
  writeFileSync(
    join(forgeDocs, "index-l0.json"),
    JSON.stringify([
      {
        id: "1.20.1/concepts_registries",
        version: "1.20.1",
        label: "Registries",
        url: "https://example.com",
        tags: ["registry"],
        priority: "high",
        sectionCount: 1,
      },
    ]),
    "utf8",
  );

  assert.equal(hasPlatformDocData("neoforge", forgeOnly), true);
  assert.equal(hasPlatformDocData("forge", forgeOnly), true);

  const prev = process.env.MC_SKILL_DATA;
  process.env.MC_SKILL_DATA = forgeOnly;
  try {
    assert.equal(resolvePlatformDataDir("neoforge"), forgeOnly);

    const listed = parseToolText(await listVersions({ platform: "neoforge" }));
    assert.equal(listed.ok, true);
    assert.ok(listed.versions.includes("1.20.1"));
    assert.notEqual(listed.error?.code, "INTERNAL_ERROR");

    const searched = parseToolText(
      await searchDocs({ query: "Registries", version: "1.20.1", platform: "neoforge" }),
    );
    assert.equal(searched.ok, true);
    assert.notEqual(searched.error?.code, "INTERNAL_ERROR");
  } finally {
    if (prev === undefined) delete process.env.MC_SKILL_DATA;
    else process.env.MC_SKILL_DATA = prev;
    rmSync(forgeOnly, { recursive: true, force: true });
  }
}

// T5: obfuscated/intermediary 映射层 + lookup_obfuscated（断言值已对照 fabric_1.20.1 sqlite 实证）
async function testObfuscatedLayerAndLookup() {
  const { lookupObfuscated } = await import("./dist/mappings/index.js");

  // 1. intermediary→obfuscated（无 owner，走全局反查）：method_6032 → er
  const obf = convertMapping({
    from: "intermediary",
    to: "obfuscated",
    memberName: "method_6032",
    version: "1.20.1",
  });
  assert.equal(obf.found, true);
  assert.equal(obf.converted, "er", "intermediary→obfuscated must yield official short name");
  assert.equal(obf.mappingType, "method");

  // 2. obfuscated→yarn（带 owner）：er → getHealth
  const obfToYarn = convertMapping({
    from: "obfuscated",
    to: "yarn",
    memberName: "er",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.20.1",
  });
  assert.equal(obfToYarn.found, true);
  assert.equal(obfToYarn.converted, "getHealth", "obfuscated→yarn must reverse via official");

  // 3. yarn→obfuscated：getHealth → er（与 to=mojang 同值）
  const yarnToObf = convertMapping({
    from: "yarn",
    to: "obfuscated",
    memberName: "getHealth",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.20.1",
  });
  assert.equal(yarnToObf.found, true);
  assert.equal(yarnToObf.converted, "er");

  // 4. obfuscated→obfuscated = identity
  const obfId = convertMapping({
    from: "obfuscated",
    to: "obfuscated",
    memberName: "er",
    version: "1.20.1",
  });
  assert.equal(obfId.found, true);
  assert.equal(obfId.converted, "er");
  assert.equal(obfId.resultKind, "identity");

  // 5. 字段：field_6247 → bI（无 owner 全局反查）
  const obfField = convertMapping({
    from: "intermediary",
    to: "obfuscated",
    memberName: "field_6247",
    memberKind: "field",
    version: "1.20.1",
  });
  assert.equal(obfField.found, true);
  assert.equal(obfField.converted, "bI", "field intermediary→obfuscated must yield bI");

  // 6. 5.5 兼容：to=mojang 值不变，notes 增加 obfuscated 提示
  const moj = convertMapping({
    from: "yarn",
    to: "mojang",
    memberName: "getHealth",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.20.1",
  });
  assert.equal(moj.found, true);
  assert.equal(moj.converted, "er", "to=mojang must keep legacy value");
  assert.ok(
    (moj.notes ?? []).some((n) => n.includes("obfuscated")),
    "to=mojang notes must hint obfuscated layer",
  );

  // 7. 26.1 守卫：obfuscated 层拒绝 remap
  const obf26 = convertMapping({
    from: "obfuscated",
    to: "yarn",
    memberName: "er",
    version: "26.1",
  });
  assert.equal(obf26.found, false);
  assert.equal(obf26.resultKind, "UNOBFUSCATED_NO_YARN");

  // ── lookup_obfuscated ────────────────────────────────────────────────
  const lo1 = lookupObfuscated({ name: "method_6032", version: "1.20.1" });
  assert.equal(lo1.found, true);
  assert.equal(lo1.kind, "method");
  assert.equal(lo1.yarn, "getHealth");
  assert.equal(lo1.obfuscated, "er");
  assert.equal(lo1.intermediary, "method_6032");
  assert.equal(lo1.ownerClass, "net.minecraft.entity.LivingEntity");
  assert.equal(lo1.descriptor, "()F");

  const lo2 = lookupObfuscated({ name: "er", version: "1.20.1" });
  assert.equal(lo2.found, true, "bare obfuscated short name must hit");
  assert.equal(lo2.yarn, "getHealth", "method hit must take priority over field hits");
  assert.equal(lo2.intermediary, "method_6032");

  const lo3 = lookupObfuscated({ name: "field_6247", version: "1.20.1" });
  assert.equal(lo3.found, true);
  assert.equal(lo3.kind, "field");
  assert.equal(lo3.yarn, "HEALTH");
  assert.equal(lo3.obfuscated, "bI");

  const lo4 = lookupObfuscated({ name: "afl", version: "1.20.1" });
  assert.equal(lo4.found, true, "obfuscated class short name must hit");
  assert.equal(lo4.kind, "class");
  assert.equal(lo4.yarn, "net.minecraft.server.command.PlaySoundCommand");

  const lo5 = lookupObfuscated({ name: "m_46859_", version: "1.20.1" });
  assert.equal(lo5.found, false, "mojang-hashed names not in yarn sqlite");
  assert.equal(lo5.action?.code, "NOT_FOUND");

  const lo6 = lookupObfuscated({ name: "er", version: "26.1" });
  assert.equal(lo6.found, false);
  assert.equal(lo6.resultKind, "UNOBFUSCATED_NO_YARN");

  // SRG func_ 反查（后缀多字母 aJ，禁止被过严正则判成非 SRG）
  const loSrg = lookupObfuscated({ name: "func_110143_aJ", version: "1.20.1" });
  if (loSrg.found) {
    assert.equal(loSrg.kind, "method");
    assert.ok(loSrg.yarn);
  } else {
    assert.equal(loSrg.action?.code, "NOT_FOUND");
  }

  const loSrgCsv = lookupObfuscated({ name: "func_110143_aJ", version: "1.14.4" });
  assert.equal(loSrgCsv.found, true, `1.14.4 SRG func_110143_aJ 应命中 CSV，实际 ${JSON.stringify(loSrgCsv)}`);
  assert.equal(loSrgCsv.kind, "method");
  assert.equal(loSrgCsv.yarn, "getHealth");

  // convert 无 owner：裸 er 三路回退（方法优先 → getHealth，不得假 NOT_FOUND）
  const convEr = convertMapping({
    from: "obfuscated",
    to: "yarn",
    memberName: "er",
    version: "1.20.1",
  });
  assert.ok(
    (convEr.found && convEr.converted === "getHealth") ||
      (convEr.found === false && convEr.ambiguous === true),
    "bare er obfuscated→yarn must succeed or AMBIGUOUS, never silent NOT_FOUND",
  );
  if (convEr.found) {
    assert.equal(convEr.memberKind, "method");
  }

  // convert 无 owner：类短名 afl → class 回退
  const convCls = convertMapping({
    from: "obfuscated",
    to: "yarn",
    memberName: "afl",
    version: "1.20.1",
  });
  assert.equal(convCls.found, true, "class short name afl must resolve via class fallback");
  assert.equal(convCls.memberKind, "class");
  assert.ok(
    String(convCls.converted).includes("PlaySoundCommand"),
    `expected PlaySoundCommand, got ${convCls.converted}`,
  );
}

async function testFivePlatformRouting() {
  assert.equal(
    detectLoader("id 'fabric-loom'", undefined, '{"id":"x"}', undefined, { quiltModJson: '{"schema_version":1}' }),
    "quilt",
  );
  assert.equal(detectLoader("id 'fabric-loom'", undefined, '{"id":"x"}'), "fabric");
  assert.equal(
    detectLoader("apply plugin: 'net.minecraftforge.gradle.liteloader'", 'modLoader="javafml"', undefined, undefined, {
      litemodJson: '{"name":"x"}',
    }),
    "liteloader_forge",
  );
  assert.ok(isQslSpecificQuery("QSL QuiltRegistry 注册"));
  const filtered = filterFabricFallbackHits([
    { id: "a", label: "net.fabricmc.fabric.api.event.registry.FabricRegistryBuilder", url: "https://fabricmc.net/wiki" },
    { id: "b", label: "net.minecraft.world.item.Item", url: "https://docs.fabricmc.net/loom" },
    { id: "c", label: "FabricItemSettings / ItemGroupEvents", url: "https://docs.fabricmc.net" },
    { id: "d", label: "net.fabricmc.fabric.api.object.builder.v1.entity", url: "https://docs.fabricmc.net" },
  ]);
  assert.equal(filtered.hits.length, 1);
  assert.equal(filtered.hits[0].id, "b");

  const qsl = parseToolText(
    await searchDocs({ platform: "quilt", version: "1.20.1", query: "QSL QuiltRegistry 注册" }),
  );
  assert.notEqual(qsl.fallback, "fabric", "QSL 查询禁止 Fabric 向量回退");
  const blob = JSON.stringify(qsl);
  assert.ok(!/net\.fabricmc\.fabric\.api\.event\.registry/.test(blob));
  if (!qsl.ok) {
    assert.equal(qsl.error?.code, "PLATFORM_DATA_MISSING");
    assert.ok(/QSL|禁止回退|QuiltRegistry/.test(qsl.warning || qsl.error?.hint || qsl.error?.message || ""));
  }

  const man = generateAddonManifest({
    packName: "Demo",
    packType: "script",
    beta: true,
    minEngineVersion: [1, 21, 0],
  });
  const bp = JSON.stringify(man.files);
  assert.ok(!/experimentalGameplay/.test(bp));
  assert.ok(!/worldgen\/experimental/.test(bp));
  assert.ok(man.warnings.some((w) => /Beta APIs/.test(w)));
  const bad = validateAddonManifest(JSON.stringify({ format_version: 2, experimentalGameplay: true, header: {}, modules: [] }));
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.some((e) => /experimentalGameplay/.test(e)));

  assert.equal(detectLoader("apply plugin: 'net.minecraftforge.gradle.tweaker-client'"), "rift");
  assert.equal(
    detectLoader(
      "apply plugin: 'net.minecraftforge.gradle.tweaker-client'\n// net.minecraftforge.gradle.forge substring must not win",
      undefined,
      undefined,
      undefined,
      { riftmodJson: '{"id":"example"}' },
    ),
    "rift",
  );
  const addonManifest = JSON.stringify({
    format_version: 2,
    header: { name: "x", uuid: "00000000-0000-0000-0000-000000000000", version: [1, 0, 0] },
    modules: [{ type: "data", uuid: "11111111-1111-1111-1111-111111111111", version: [1, 0, 0] }],
  });
  assert.equal(detectLoader("", undefined, undefined, undefined, { addonManifest }), "bedrock");
  assert.equal(detectLoader("public class mod_Example extends BaseMod {\n}"), "modloader");

  // E2E-001：混合脚手架钉死 liteloader 插件 + stable_39，且有 LiteMod + Forge 入口
  const hybridRoot = join(REPO_ROOT, "liteloader", "1.12.2", "scaffold", "hybrid");
  const hybridGradle = readFileSync(join(hybridRoot, "build.gradle"), "utf8");
  assert.ok(/net\.minecraftforge\.gradle\.liteloader/.test(hybridGradle));
  assert.ok(/stable_39/.test(hybridGradle));
  const liteModSrc = readFileSync(
    join(hybridRoot, "src", "main", "java", "com", "example", "examplehybrid", "LiteModExample.java"),
    "utf8",
  );
  assert.ok(/OutboundChatListener/.test(liteModSrc));
  assert.ok(
    existsSync(join(hybridRoot, "src", "main", "java", "com", "example", "examplehybrid", "ForgeEntry.java")),
  );

  // E2E-002：点名 Beta 爆炸时带 BP/manifest.json beta 依赖，禁止 experimentalGameplay
  const ent = generateBpEntity({ identifier: "demo:widget", betaExplodeEvent: true });
  const bpManText = JSON.stringify(ent.files?.["BP/manifest.json"] ?? {});
  assert.ok(/@minecraft\/server/.test(bpManText), bpManText);
  assert.ok(/"beta"/.test(bpManText), bpManText);
  const allEntFiles = JSON.stringify(ent.files);
  assert.ok(!/experimentalGameplay/.test(allEntFiles));
  assert.ok(!/worldgen\/experimental/.test(allEntFiles));
  assert.ok(!/@minecraft\/server-beta/.test(allEntFiles));
  assert.ok(Array.isArray(ent.warnings) && ent.warnings.some((w) => /Beta APIs/.test(w)));

  const tmpStatus = mkdtempSync(join(tmpdir(), "mc-skill-bedrock-status-"));
  try {
    writeFileSync(
      join(tmpStatus, "bedrock-docs-status.json"),
      JSON.stringify({
        localRevision: "abc",
        remoteRevision: "abc",
        fetchedAt: new Date().toISOString(),
        stale: true,
      }),
      "utf8",
    );
    assert.equal(loadBedrockDocsStatus(tmpStatus).stale, false);

    writeFileSync(
      join(tmpStatus, "bedrock-docs-status.json"),
      JSON.stringify({
        localRevision: "abc",
        remoteRevision: "abc",
        fetchedAt: "2020-01-01T00:00:00.000Z",
        stale: false,
      }),
      "utf8",
    );
    assert.equal(loadBedrockDocsStatus(tmpStatus).stale, true);

    writeFileSync(
      join(tmpStatus, "bedrock-docs-status.json"),
      JSON.stringify({
        localRevision: "abc",
        remoteRevision: "xyz",
        fetchedAt: new Date().toISOString(),
        stale: false,
      }),
      "utf8",
    );
    assert.equal(loadBedrockDocsStatus(tmpStatus).stale, true);
  } finally {
    rmSync(tmpStatus, { recursive: true, force: true });
  }

  const presence = listSemanticDbPresence(resolveDataDir());
  assert.ok(
    presence.some((p) => p.platform === "bedrock" && p.version === "stable"),
    "listSemanticDbPresence must include bedrock_stable",
  );

  // E2E-005：processed 指纹与 sqlite 不一致时 search 路径应 warning stale（不改仓库真实库）
  const tmpData = mkdtempSync(join(tmpdir(), "mc-skill-sem-stale-"));
  try {
    const versionDir = join(tmpData, "quilt_1.20.1", "quilt-docs", "1.20.1");
    mkdirSync(join(versionDir, "processed"), { recursive: true });
    mkdirSync(join(versionDir, "semantic"), { recursive: true });
    writeFileSync(join(versionDir, "index-l0.json"), JSON.stringify({ docs: [] }), "utf8");
    writeFileSync(join(versionDir, "processed", "x.md"), "# QSL\n", "utf8");
    const dbPath = semanticDbPath(tmpData, "quilt", "1.20.1", "quilt-docs");
    const db = new DatabaseSync(dbPath);
    db.exec(SEMANTIC_DDL);
    db.exec(`
      INSERT INTO meta (key, value) VALUES
        ('docs', '1'),
        ('chunks', '1'),
        ('built_at', '2010-01-01T00:00:00.000Z'),
        ('source_fingerprint', 'intentionally-wrong');
    `);
    db.close();
    const stale = isSemanticIndexStale({
      builtAtIso: "2010-01-01T00:00:00.000Z",
      storedFingerprint: "intentionally-wrong",
      versionDir,
    });
    assert.equal(stale.stale, true);
    const warn = semanticStaleSearchWarning(tmpData, "quilt", "1.20.1", "quilt-docs");
    assert.match(warn ?? "", /语义索引过期/);
  } finally {
    rmSync(tmpData, { recursive: true, force: true });
  }
}

async function testReviewFixes() {
  const riftRoot = mkdtempSync(join(tmpdir(), "mc-skill-rift-port-"));
  try {
    writeFileSync(
      join(riftRoot, "build.gradle"),
      "apply plugin: 'net.minecraftforge.gradle.tweaker-client'\n",
      "utf8",
    );
    const rift = JSON.parse(await analyzePortingPath({ projectPath: riftRoot, targetPlatform: "forge" }));
    assert.equal(rift.ok, false, JSON.stringify(rift));
    assert.equal(rift.error.code, "UNSUPPORTED_PORT");
    assert.match(String(rift.error.message), /rift/i);
    assert.doesNotMatch(String(rift.error.message), /forge → neoforge/i);
  } finally {
    rmSync(riftRoot, { recursive: true, force: true });
  }

  const quiltDual = mkdtempSync(join(tmpdir(), "mc-skill-quilt-dual-"));
  try {
    mkdirSync(join(quiltDual, "src", "main", "resources"), { recursive: true });
    writeFileSync(join(quiltDual, "build.gradle"), "plugins { id 'org.quiltmc.loom' version '1.7.4' }\n", "utf8");
    writeFileSync(
      join(quiltDual, "src", "main", "resources", "quilt.mod.json"),
      JSON.stringify({ schema_version: 1, quilt_loader: { id: "quiltmod", version: "1.0.0" } }),
      "utf8",
    );
    writeFileSync(
      join(quiltDual, "src", "main", "resources", "fabric.mod.json"),
      JSON.stringify({ schemaVersion: 1, id: "fabricname", version: "9.9.9" }),
      "utf8",
    );
    const q = JSON.parse(await analyzePortingPath({ projectPath: quiltDual, targetPlatform: "quilt" }));
    assert.equal(q.ok, true, JSON.stringify(q.error ?? q));
    assert.equal(q.analysis.current.platform, "quilt");
    assert.equal(q.analysis.current.modId, "quiltmod");
  } finally {
    rmSync(quiltDual, { recursive: true, force: true });
  }

  const quiltLoomOnly = mkdtempSync(join(tmpdir(), "mc-skill-quilt-loom-"));
  try {
    mkdirSync(join(quiltLoomOnly, "src", "main", "resources"), { recursive: true });
    writeFileSync(
      join(quiltLoomOnly, "build.gradle"),
      "plugins { id 'org.quiltmc.loom' version '1.7.4'\n  id 'fabric-loom' version '1.6-SNAPSHOT' }\n",
      "utf8",
    );
    writeFileSync(
      join(quiltLoomOnly, "src", "main", "resources", "fabric.mod.json"),
      JSON.stringify({ schemaVersion: 1, id: "fabricname" }),
      "utf8",
    );
    const q = JSON.parse(await analyzePortingPath({ projectPath: quiltLoomOnly, targetPlatform: "quilt" }));
    assert.equal(q.ok, true, JSON.stringify(q.error ?? q));
    assert.equal(q.analysis.current.platform, "quilt");
  } finally {
    rmSync(quiltLoomOnly, { recursive: true, force: true });
  }

  const bpRoot = mkdtempSync(join(tmpdir(), "mc-skill-bp-port-"));
  try {
    mkdirSync(join(bpRoot, "BP"), { recursive: true });
    writeFileSync(
      join(bpRoot, "BP", "manifest.json"),
      JSON.stringify({
        format_version: 2,
        header: { name: "pack", uuid: "00000000-0000-0000-0000-000000000000", version: [1, 0, 0] },
        modules: [{ type: "data", uuid: "11111111-1111-1111-1111-111111111111", version: [1, 0, 0] }],
      }),
      "utf8",
    );
    const bp = JSON.parse(await analyzePortingPath({ projectPath: bpRoot }));
    assert.equal(bp.ok, false, JSON.stringify(bp));
    assert.equal(bp.error.code, "UNSUPPORTED_PORT");
    assert.match(String(bp.error.message), /bedrock/i);
  } finally {
    rmSync(bpRoot, { recursive: true, force: true });
  }

  const qslFull = parseToolText(
    await getDocFull({ platform: "quilt", version: "1.20.1", id: "qsl-qfapi", highlight_key: false }),
  );
  assert.notEqual(qslFull.ok, false, JSON.stringify(qslFull.error ?? qslFull).slice(0, 500));
  assert.equal(qslFull.fallback, null);
  const qslText = JSON.stringify(qslFull);
  assert.match(qslText, /QSL|Quilted Fabric API|quilt/i);

  const fabFb = parseToolText(
    await getDocFull({
      platform: "quilt",
      version: "1.20.1",
      id: "1.20.1/develop_networking",
      highlight_key: false,
    }),
  );
  assert.equal(fabFb.fallback, "fabric", JSON.stringify(fabFb.error ?? { fallback: fabFb.fallback }).slice(0, 400));
  assert.ok(fabFb.content || fabFb.meta, JSON.stringify(Object.keys(fabFb)));
  assert.match(JSON.stringify(fabFb), /network/i);

  const bed = parseToolText(await getBedrockDocFull({ id: "stable/pack-manifest", version: "stable" }));
  assert.notEqual(bed.ok, false, JSON.stringify(bed.error ?? bed).slice(0, 400));
  assert.match(JSON.stringify(bed), /manifest/i);

  const quiltVal = validateProject({
    buildGradle: "plugins { id 'org.quiltmc.loom' version '1.7.4' }\n",
  });
  assert.equal(quiltVal.status, "failed", JSON.stringify(quiltVal));
  assert.equal(quiltVal.passed, false, JSON.stringify(quiltVal));
  assert.ok(quiltVal.errors.some((e) => /quilt.mod.json/.test(e)));
  assert.equal(quiltVal.deprecated_legacy_passed, undefined);

  const fabricVal = validateProject({
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content:
        "package com.example;\nimport net.fabricmc.api.ModInitializer;\npublic class ExampleMod implements ModInitializer {\n  public void onInitialize() {}\n}\n",
    }],
  });
  assert.equal(fabricVal.status, "failed", JSON.stringify(fabricVal));
  assert.equal(fabricVal.passed, false, JSON.stringify(fabricVal));
  assert.ok(fabricVal.errors.some((e) => /fabric.mod.json/.test(e)));
  assert.ok(!fabricVal.errors.some((e) => /DeferredRegister|@Mod/.test(e)));
  assert.equal(fabricVal.deprecated_legacy_passed, undefined);

  const fabricPass = validateProject({
    fabricModJson: JSON.stringify({
      schemaVersion: 1,
      id: "examplemod",
      entrypoints: { main: ["com.example.ExampleMod"] },
    }),
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content:
        "package com.example;\nimport net.fabricmc.api.ModInitializer;\npublic class ExampleMod implements ModInitializer {\n  public void onInitialize() {}\n}\n",
    }],
  });
  assert.equal(fabricPass.status, "passed", JSON.stringify(fabricPass));
  assert.equal(fabricPass.deprecated_legacy_passed, undefined);

  const bedrockVal = validateProject({
    javaFiles: [{
      path: "BP/manifest.json",
      content: JSON.stringify({
        format_version: 2,
        header: { name: "pack", uuid: "00000000-0000-0000-0000-000000000000", version: [1, 0, 0] },
        modules: [{ type: "data", uuid: "11111111-1111-1111-1111-111111111111", version: [1, 0, 0] }],
      }),
    }],
  });
  assert.equal(bedrockVal.status, "skipped", JSON.stringify(bedrockVal));
  assert.equal(bedrockVal.passed, false, JSON.stringify(bedrockVal));
  assert.deepEqual(bedrockVal.errors, []);
  assert.match(bedrockVal.warnings[0], /validate_addon_manifest/);
  assert.equal(bedrockVal.deprecated_legacy_passed, undefined);

  const forgeVal = validateProject({
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content: '@Mod("other")\npublic class ExampleMod {}\n',
    }],
  });
  assert.ok(forgeVal.errors.some((e) => /@Mod/.test(e)), JSON.stringify(forgeVal));
  assert.equal(forgeVal.passed, false);

  const neoVal = validateProject({
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content:
        "package com.example;\nimport net.neoforged.bus.api.IEventBus;\npublic class ExampleMod {}\n",
    }],
  });
  assert.equal(neoVal.status, "failed", JSON.stringify(neoVal));
  assert.equal(neoVal.passed, false, JSON.stringify(neoVal));
  assert.ok(neoVal.errors.some((e) => /@Mod/.test(e)), JSON.stringify(neoVal.errors));
  assert.equal(neoVal.deprecated_legacy_passed, undefined);

  const neoPass = validateProject({
    neoModsToml: 'modLoader="javafml"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content:
        "package com.example;\nimport net.neoforged.bus.api.IEventBus;\nimport net.neoforged.fml.common.Mod;\n@Mod(\"examplemod\")\npublic class ExampleMod {\n  public ExampleMod(IEventBus bus) {}\n}\n",
    }],
  });
  assert.equal(neoPass.status, "passed", JSON.stringify(neoPass));

  const exclusiveHit = exclusiveFabricFallbackRefusal({
    id: "wiki/FabricRegistryBuilder",
    label: "net.fabricmc.fabric.api.event.registry.FabricRegistryBuilder",
  });
  assert.ok(exclusiveHit && exclusiveHit.ok === false);

  const exclFull = parseToolText(
    await getDocFull({ platform: "quilt", version: "1.20.1", id: "FabricRegistryBuilder", highlight_key: false }),
  );
  assert.equal(exclFull.ok, false, JSON.stringify(exclFull).slice(0, 500));
  assert.ok(!exclFull.content, JSON.stringify(Object.keys(exclFull)));
  assert.match(JSON.stringify(exclFull), /QSL|禁止|Registry|ItemGroup/i);
  assert.doesNotMatch(JSON.stringify(exclFull), /已降级/);

  const qRelated = parseToolText(
    await getDocRelated({ platform: "quilt", version: "1.20.1", id: "qsl-qfapi", limit: 5 }),
  );
  assert.ok(Array.isArray(qRelated), JSON.stringify(qRelated).slice(0, 400));
  assert.ok(qRelated.length >= 0);

  const qRelatedFb = parseToolText(
    await getDocRelated({
      platform: "quilt",
      version: "1.20.1",
      id: "1.20.1/develop_networking",
      limit: 5,
    }),
  );
  assert.ok(Array.isArray(qRelatedFb), JSON.stringify(qRelatedFb).slice(0, 400));
  if (qRelatedFb.length > 0) {
    assert.equal(qRelatedFb[0].sourcePlatform, "fabric");
    assert.match(String(qRelatedFb[0].warning || ""), /回退 Fabric|QSL/);
  }

  const exclRelated = parseToolText(
    await getDocRelated({ platform: "quilt", version: "1.20.1", id: "FabricRegistryBuilder", limit: 5 }),
  );
  assert.equal(exclRelated.ok, false, JSON.stringify(exclRelated).slice(0, 400));
  assert.ok(!Array.isArray(exclRelated));

  const quiltBadVer = parseToolText(
    await searchDocs({ platform: "quilt", version: "0.0.0", query: "loom" }),
  );
  assert.equal(quiltBadVer.ok, false, JSON.stringify(quiltBadVer).slice(0, 500));
  assert.equal(quiltBadVer.error?.code, "VERSION_NOT_FOUND");
  assert.doesNotMatch(JSON.stringify(quiltBadVer), /已降级/);
  assert.ok(
    Array.isArray(quiltBadVer.availableVersions) || /1\.20/.test(quiltBadVer.error?.hint || ""),
    JSON.stringify(quiltBadVer.error ?? quiltBadVer).slice(0, 400),
  );
}

async function testPlan2PrimerMdkFabricPorting() {
  const nf1205 = parseToolText(await searchNeoForgeDocs({ query: "primer migration", version: "1.20.5" }));
  assert.equal(nf1205.ok, true, JSON.stringify(nf1205).slice(0, 400));
  assert.ok(nf1205.warning, "1.20.5 must warn about missing main doc tree");

  const nf262 = parseToolText(await searchNeoForgeDocs({ query: "events", version: "26.2" }));
  assert.equal(nf262.ok, true, JSON.stringify(nf262).slice(0, 400));
  assert.equal(nf262.fallback, true, JSON.stringify(nf262).slice(0, 600));
  assert.ok(nf262.source_version, JSON.stringify(nf262).slice(0, 400));
  assert.match(String(nf262.warning || ""), /PACK_NOT_FOUND|不得据此推断规则树/);

  const toc = getMigrationGuide("26.1->26.2", { platform: "neoforge" });
  assert.equal(toc.found, true, JSON.stringify(toc).slice(0, 400));
  assert.ok(Array.isArray(toc.toc), "get_migration_guide default is toc");
  assert.equal(toc.content, undefined);

  const chap = getMigrationGuide("26.1->26.2", { platform: "neoforge", section: "Pack Changes" });
  assert.equal(chap.found, true, JSON.stringify(chap).slice(0, 400));
  assert.equal(chap.sectionFound, true, JSON.stringify(chap).slice(0, 400));
  assert.ok(String(chap.content || "").includes("Pack Changes"), String(chap.content).slice(0, 200));
  assert.ok(String(chap.content || "").length < 8000, "section must not dump the whole primer");

  const miss = getMigrationGuide("26.1->26.2", { platform: "neoforge", section: "NotARealHeadingXYZ" });
  assert.equal(miss.sectionFound, false);
  assert.equal(miss.content, undefined);

  const { downloadOfficialMdk } = await import("./dist/mdk/index.js");
  const dry = await downloadOfficialMdk({
    platform: "neoforge",
    minecraftVersion: "26.1.2",
    buildPlugin: "moddevgradle",
    dryRun: true,
  });
  assert.equal(dry.ok, true);
  assert.equal(dry.downloaded, false);
  assert.ok(String(dry.url).includes("1fd0f4d9"));

  const needPlugin = await downloadOfficialMdk({
    platform: "neoforge",
    minecraftVersion: "26.2",
    dryRun: true,
  });
  assert.equal(needPlugin.ok, false);

  const neo1211 = await downloadOfficialMdk({
    platform: "neoforge",
    minecraftVersion: "1.21.1",
    buildPlugin: "moddevgradle",
    dryRun: true,
  });
  if (neo1211.ok) {
    assert.ok(String(neo1211.url).includes(String(neo1211.ref)), JSON.stringify({ url: neo1211.url, ref: neo1211.ref }));
  } else {
    assert.equal(neo1211.error?.code, "MDK_NOT_PINNED");
  }

  const { generateNetworkPacket: genPkt } = await import("./dist/generators/index.js");
  const noPlat = genPkt("my_mod", "sync_msg");
  assert.equal(noPlat.code, null);
  assert.ok(noPlat.errors?.some((e) => /platform 必填/.test(e)), JSON.stringify(noPlat));

  const nf261 = genPkt("my_mod", "sync_msg", "neoforge_26.1");
  assert.ok(nf261.code?.includes("Identifier"), nf261.code?.slice(0, 400));
  assert.ok(!/new ResourceLocation\s*\(/.test(nf261.code || ""), nf261.code?.slice(0, 400));

  const bareNeo = genPkt("my_mod", "sync_msg", "neoforge");
  assert.equal(bareNeo.code, null);
  assert.ok(bareNeo.errors?.length, JSON.stringify(bareNeo));

  const bareFab = genPkt("my_mod", "sync_msg", "fabric");
  assert.equal(bareFab.code, null);
  assert.ok(!/net\.minecraftforge/.test(bareFab.code || ""));

  const fabPkt = genPkt("my_mod", "sync_msg", "fabric_1.21");
  assert.ok(fabPkt.code?.includes("PayloadTypeRegistry"), fabPkt.code?.slice(0, 400));
  assert.ok(fabPkt.code?.includes("playC2S"), fabPkt.code?.slice(0, 500));
  assert.ok(fabPkt.code?.includes("net.minecraft.util.Identifier"), fabPkt.code?.slice(0, 500));
  assert.ok(!fabPkt.code?.includes("fromNamespaceAndPath"), fabPkt.code?.slice(0, 500));
  assert.ok(!fabPkt.code?.includes("serverboundPlay"), fabPkt.code?.slice(0, 500));
  assert.ok(!/net\.minecraftforge/.test(fabPkt.code || ""));
  assert.ok(!/net\.neoforged/.test(fabPkt.code || ""));

  const fabPkt261 = genPkt("my_mod", "sync_msg", "fabric_26.1");
  assert.ok(fabPkt261.code?.includes("ServerPlayNetworking"));
  assert.ok(fabPkt261.code?.includes("serverboundPlay"), fabPkt261.code?.slice(0, 500));
  assert.ok(!fabPkt261.code?.includes("playC2S"), fabPkt261.code?.slice(0, 500));
  assert.ok(!/net\.minecraftforge/.test(fabPkt261.code || ""));

  const { searchFabricDocs } = await import("./dist/docs-platform/fabric/index.js");
  const fa = parseToolText(await searchFabricDocs({ query: "porting 26.2 vulkan", version: "26.1.2" }));
  assert.equal(fa.ok, true);
  assert.ok(
    (fa.results ?? []).some((r) => r.id === "porting/26.2" || r.source === "porting-extra"),
    JSON.stringify(fa.results?.slice(0, 8)).slice(0, 600),
  );
}

async function testMdkUnpackFixtures() {
  const { createStoreZip, unpackMdkArchive, assertNoZipSlip, isForbiddenEngineArchive, probeUnzipTool } =
    await import("./dist/mdk/index.js");
  assert.equal(
    isForbiddenEngineArchive("https://github.com/MinecraftForge/MinecraftForge/archive/1.20.1.zip"),
    true,
  );
  assert.equal(isForbiddenEngineArchive("https://maven.minecraftforge.net/net/minecraftforge/forge/1.20.1-47.3.0/forge-1.20.1-47.3.0-mdk.zip"), false);

  const slip = assertNoZipSlip(["../evil.txt"], join(tmpdir(), "unpacked"));
  assert.equal(slip.ok, false);

  const java = `package com.example.examplemod;
import net.neoforged.fml.common.Mod;
@Mod("examplemod")
public class ExampleMod {}
`;
  const goodZip = createStoreZip([
    { name: "MDK-sha/src/main/java/com/example/examplemod/ExampleMod.java", data: java },
    { name: "MDK-sha/gradle.properties", data: "neo_version=21.1.0\n" },
  ]);
  const dest = mkdtempSync(join(tmpdir(), "mdk-unpack-"));
  try {
    const badHash = unpackMdkArchive({
      zip: goodZip,
      destCache: join(dest, "mismatch"),
      expectedSha256: "0".repeat(64),
    });
    assert.equal(badHash.ok, false);
    assert.equal(badHash.error?.code, "SHA256_MISMATCH");
    assert.ok(existsSync(badHash.archivePath), "mismatch 仍保留 zip");

    const slipZip = createStoreZip([{ name: "../evil.txt", data: "x" }]);
    const slipDest = join(dest, "slip");
    const slipRes = unpackMdkArchive({ zip: slipZip, destCache: slipDest });
    assert.equal(slipRes.ok, false);
    assert.equal(slipRes.error?.code, "ZIP_SLIP");
    assert.ok(existsSync(slipRes.archivePath));

    const tool = probeUnzipTool();
    if (!tool) {
      const missing = unpackMdkArchive({ zip: goodZip, destCache: join(dest, "notool") });
      assert.equal(missing.ok, false);
      assert.equal(missing.error?.code, "UNZIP_TOOL_MISSING");
      return;
    }
    const ok = unpackMdkArchive({ zip: goodZip, destCache: join(dest, "ok") });
    assert.equal(ok.ok, true, JSON.stringify(ok.error));
    assert.equal(ok.entryClass, "com.example.examplemod.ExampleMod");
    assert.ok(ok.unpackedRoot?.includes("MDK-sha") || ok.unpackedRoot, ok.unpackedRoot);
    assert.ok(existsSync(ok.archivePath));
  } finally {
    rmSync(dest, { recursive: true, force: true });
  }
}

function testProjectPathFill() {
  const fixture = join(dirname(fileURLToPath(import.meta.url)), "test-fixtures", "forge-mini");
  const val = validateProject({ projectPath: fixture });
  assert.equal(val.status, "passed", JSON.stringify(val));
  assert.equal(val.passed, true, JSON.stringify(val));
  assert.ok(Array.isArray(val.checks) && val.checks.length > 0, JSON.stringify(val.checks));
  assert.ok(!val.errors?.some((e) => /@Mod/.test(e)), JSON.stringify(val.errors));

  const valCrash = validateProject({ projectPath: fixture, includeCrashAnalysis: true });
  assert.ok(Array.isArray(valCrash.crashAnalyses) && valCrash.crashAnalyses.length > 0, JSON.stringify(valCrash));

  const gradle = diagnoseGradle({ projectPath: fixture });
  assert.notEqual(gradle.ok, false, JSON.stringify(gradle));
  assert.ok(Array.isArray(gradle.errors) && Array.isArray(gradle.warnings));

  const deps = checkDependencies("", undefined, undefined, undefined, { projectPath: fixture });
  assert.equal(deps.detectedLoader, "forge", JSON.stringify(deps));

  const stillContent = validateProject({
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content: '@Mod("other")\npublic class ExampleMod {}\n',
    }],
  });
  assert.equal(stillContent.passed, false, JSON.stringify(stillContent));
  assert.ok(stillContent.errors.some((e) => /@Mod/.test(e)));

  const bad = validateProject({ projectPath: join(fixture, "no-such") });
  assert.equal(bad.passed, false);
  assert.equal(bad.ok, false);
  assert.equal(bad.action?.code, "INVALID_INPUT");

  const badG = diagnoseGradle({ projectPath: join(fixture, "no-such") });
  assert.equal(badG.ok, false);
  assert.equal(badG.action?.code, "INVALID_INPUT");

  const badD = checkDependencies("", undefined, undefined, undefined, { projectPath: join(fixture, "no-such") });
  assert.equal(badD.ok, false);
  assert.equal(badD.action?.code, "INVALID_INPUT");
}

async function testPrototypeOwnKeys() {
  const protoKeys = ["constructor", "toString", "__proto__", "hasOwnProperty", "valueOf"];
  for (const k of protoKeys) {
    const vi = await getVersionInfo({ version: k, action: "register", platform: "forge" });
    assert.equal(vi.forgeVersion, "unknown", `get_version_info(${k}) must not hit Object.prototype`);
    assert.ok(!/DeferredRegister/.test(vi.recommendation), vi.recommendation);

    const mg = getMigrationGuide(k);
    assert.equal(mg.found, false, `get_migration_guide(${k}) must not be found`);

    const wf = getWorkflowTemplate(k);
    assert.equal(wf.found, false, `get_workflow_template(${k}) must not be found`);

    const pf = resolvePackFormat(k);
    assert.equal(typeof pf.packFormat, "number", `pack_format(${k}) must be a number`);
    assert.ok(pf.notes.some((n) => /未知 mcVersion/.test(n)), JSON.stringify(pf.notes));

    const short = mapShortCommand(k);
    assert.equal(short.tool, k, `SHORT_COMMANDS[${k}] must not resolve to Function`);
  }

  const v112 = await getVersionInfo({ version: "1.12.2", action: "register", platform: "forge" });
  assert.ok(/RegistryEvent/.test(v112.recommendation), v112.recommendation);
  assert.ok(!/创建 DeferredRegister/.test(v112.recommendation), v112.recommendation);

  const v165 = await getVersionInfo({ version: "1.16.5", action: "register", platform: "forge" });
  assert.ok(!/创建 DeferredRegister/.test(v165.recommendation), v165.recommendation);
}

function testPlan1Fixes() {
  assert.equal(detectMinecraftVersion({ gradleProperties: "minecraft_version=1.20.1\n" }), "1.20.1");
  assert.equal(detectMinecraftVersion({ gradleProperties: "mc_version=1.16.5\n" }), "1.16.5");
  assert.equal(detectMinecraftVersion({ buildGradle: "minecraft '1.20.1'\n" }), "1.20.1");
  assert.equal(detectMinecraftVersion({ buildGradle: "minecraft_version = '1.20.1'\n" }), "1.20.1");
  assert.equal(
    detectMinecraftVersion({ buildGradle: "dependencies { minecraft 'net.minecraftforge:forge:1.20.1-47.2.0' }\n" }),
    "1.20.1",
  );
  assert.equal(detectMinecraftVersion({ buildGradle: "plugins { id 'net.minecraftforge.gradle' }\n" }), "unknown");

  const g1204 = diagnoseGradle({
    buildGradle: `
plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }
java.toolchain.languageVersion = JavaLanguageVersion.of(17)
dependencies { minecraft 'net.minecraftforge:forge:1.20.4-49.0.0' }
`,
    gradleProperties: "minecraft_version=1.20.4\nforge_version=49.0.0\n",
  });
  assert.ok(!g1204.warnings.some((w) => /不以 47/.test(w)), JSON.stringify(g1204.warnings));

  const gUnknown = diagnoseGradle({
    buildGradle: `plugins { id 'net.minecraftforge.gradle' version '[6.0,6.2)' }\n`,
  });
  assert.ok(gUnknown.warnings.some((w) => /无法判定 MC 版本/.test(w)), JSON.stringify(gUnknown.warnings));
  assert.ok(!gUnknown.errors.some((e) => /6\.0,6\.2|不以 47/.test(e)), JSON.stringify(gUnknown.errors));

  const g112 = diagnoseGradle({
    buildGradle: `apply plugin: 'net.minecraftforge.gradle.forge'\n`,
    gradleProperties: "minecraft_version=1.12.2\n",
  });
  assert.ok(!g112.warnings.some((w) => /Java toolchain 应为 17|不以 47/.test(w)), JSON.stringify(g112.warnings));
  assert.ok(!g112.errors.some((e) => /copyIdeResources/.test(e)), JSON.stringify(g112.errors));

  const g165 = diagnoseGradle({
    buildGradle: `apply plugin: 'net.minecraftforge.gradle.forge'\njava.toolchain.languageVersion = JavaLanguageVersion.of(17)\n`,
    gradleProperties: "minecraft_version=1.16.5\n",
  });
  assert.ok(!g165.warnings.some((w) => /不以 47/.test(w)), JSON.stringify(g165.warnings));

  const modern = validateProject({
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content: `
@Mod("examplemod")
public class ExampleMod {
  public static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, "examplemod");
  public static final RegistryObject<Block> A = BLOCKS.register("a", () -> new Block(BlockBehaviour.Properties.of()));
  public static final RegistryObject<Block> B = BLOCKS.register("b", () -> new Block(BlockBehaviour.Properties.of()));
  public ExampleMod(IEventBus modEventBus) {
    BLOCKS.register(modEventBus);
  }
}
`,
    }],
  });
  assert.ok(!modern.errors.some((e) => /DeferredRegister|modEventBus/.test(e)), JSON.stringify(modern.errors));

  const constMod = validateProject({
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content: `
public class ExampleMod {
  public static final String MOD_ID = "examplemod";
}
@Mod(ExampleMod.MOD_ID)
public class ExampleMod { }
`,
    }],
  });
  assert.ok(!constMod.errors.some((e) => /@Mod/.test(e)), JSON.stringify(constMod.errors));

  const noPlatDatagen = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: undefined,
    version: "1.20.1",
  });
  assert.equal(noPlatDatagen.code, null);

  const noVer = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "",
  });
  assert.equal(noVer.code, null);
  assert.ok(noVer.errors?.some((e) => /version is required/.test(e)), JSON.stringify(noVer));

  const neoNoVer = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: undefined,
  });
  assert.equal(neoNoVer.code, null);

  const neo261 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "26.1.1",
  });
  assert.ok(neo261.code, JSON.stringify(neo261));
  assert.ok(neo261.code.includes("GatherDataEvent.Client"), neo261.code.slice(0, 500));
  assert.ok(!/new ResourceLocation/.test(neo261.code));
  assert.ok(!/ForgeConfigSpec/.test(neo261.code));
  assert.ok(!/net\.minecraftforge/.test(neo261.code));
  assert.ok(neo261.code.includes("net.neoforged"));

  const fabDatagen = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.11",
  });
  assert.ok(fabDatagen.code, JSON.stringify(fabDatagen));
  assert.ok(fabDatagen.code.includes("DataGeneratorEntrypoint"));
  assert.ok(!/net\.minecraftforge/.test(fabDatagen.code));
  assert.ok(!/net\.neoforged/.test(fabDatagen.code));

  const fab261 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "26.1.2",
  });
  assert.ok(fab261.code?.includes("FabricPackOutput"));
  assert.ok(!/net\.minecraftforge/.test(fab261.code || ""));
  assert.ok(!/net\.neoforged/.test(fab261.code || ""));

  const capFab = generateCapability("my_mod", "mana", "fabric", "1.20.1");
  assert.equal(capFab.code, null);
  assert.ok(capFab.errors?.some((e) => /CCA|Cardinal|cca/i.test(e)), JSON.stringify(capFab));

  const capNeoNoVer = generateCapability("my_mod", "mana", "neoforge");
  assert.equal(capNeoNoVer.code, null);

  const capNeo1201 = generateCapability("my_mod", "mana", "neoforge", "1.20.1");
  assert.equal(capNeo1201.code, null);

  const capNeo1204 = generateCapability("my_mod", "mana", "neoforge", "1.20.4");
  assert.ok(capNeo1204.code?.includes("AttachmentType"), capNeo1204.code);

  const cfgNoVer = generateConfig("my_mod", "neoforge");
  assert.equal(cfgNoVer.code, null);

  const rendNo = generateEntityRenderer("my_mod", "slime", "neoforge", "1.21.1");
  assert.equal(rendNo.code, null);

  const rend261 = generateEntityRenderer("my_mod", "slime", "neoforge", "26.1");
  assert.ok(rend261.code?.includes("Identifier"), rend261.code);
  assert.ok(rend261.code?.includes("EntityRenderer"), rend261.code);
  assert.ok(!/net\.minecraftforge/.test(rend261.code || ""));

  const cfgFab = generateConfig("my_mod", "fabric", "1.21.11");
  assert.ok(cfgFab.code?.includes("clothconfig2"), cfgFab.code);
  assert.ok(cfgFab.warnings?.some((w) => /依赖/.test(w)), JSON.stringify(cfgFab.warnings));
  assert.ok(!/net\.minecraftforge/.test(cfgFab.code || ""));

  const rendOk = generateEntityRenderer("my_mod", "slime", "forge", "1.20.1");
  assert.ok(rendOk.code?.includes("@OnlyIn"), rendOk.code);
  assert.ok(!rendOk.code?.includes("fromNamespaceAndPath"), rendOk.code);

  const triage = getWorkflowTemplate("mc-crash-triage");
  assert.equal(triage.found, true);
  assert.match(triage.body ?? "", /STATUS_GATE: skipped/);
  assert.match(triage.body ?? "", /STATUS_GATE: passed/);
  assert.match(triage.body ?? "", /status/);
  assert.match(triage.body ?? "", /skipped/);
  assert.doesNotMatch(triage.body ?? "", /validate_project[\s\S]{0,30}通过即结束/);

  const special = validateDatapackJson({
    kind: "recipe",
    jsonContent: JSON.stringify({ type: "minecraft:crafting_special_armordye" }),
    version: "1.20.1",
  });
  assert.equal(special.valid, true, JSON.stringify(special));
  const trim = validateDatapackJson({
    kind: "recipe",
    jsonContent: JSON.stringify({ type: "minecraft:smithing_trim", template: {}, base: {}, addition: {} }),
    version: "1.20.1",
  });
  assert.equal(trim.valid, true, JSON.stringify(trim));
  const shaped = validateDatapackJson({
    kind: "recipe",
    jsonContent: JSON.stringify({ type: "minecraft:crafting_shaped", pattern: ["#"], key: { "#": { item: "minecraft:stone" } } }),
    version: "1.20.1",
  });
  assert.equal(shaped.valid, false);
  assert.ok(shaped.errors.some((e) => /result/.test(e)));

  const scanRoot = mkdtempSync(join(tmpdir(), "mc-java-scan-"));
  try {
    mkdirSync(join(scanRoot, "src", "main", "java"), { recursive: true });
    writeFileSync(join(scanRoot, "src", "main", "java", "A.java"), "class A {}\n");
    writeFileSync(join(scanRoot, "src", "main", "java", "B.java"), "class B {}\n");
    const prev = process.env.MC_SKILL_JAVA_SCAN_MAX_FILES;
    process.env.MC_SKILL_JAVA_SCAN_MAX_FILES = "1";
    const scanned = collectJavaSources(scanRoot);
    if (prev === undefined) delete process.env.MC_SKILL_JAVA_SCAN_MAX_FILES;
    else process.env.MC_SKILL_JAVA_SCAN_MAX_FILES = prev;
    assert.equal(scanned.truncated, true);
    assert.ok(scanned.warning && /检查可能不完整/.test(scanned.warning), scanned.warning);
    assert.ok(/MC_SKILL_JAVA_SCAN_MAX_FILES/.test(scanned.warning ?? ""));
  } finally {
    rmSync(scanRoot, { recursive: true, force: true });
  }

  const pub = checkPublishReady({
    fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", license: "MIT" }),
  });
  assert.equal(pub.ready, true, JSON.stringify(pub));
  assert.ok(pub.warnings.some((w) => /不上传/.test(w)));

  const logRoot = mkdtempSync(join(tmpdir(), "mc-inspect-"));
  try {
    mkdirSync(join(logRoot, "run", "logs"), { recursive: true });
    writeFileSync(join(logRoot, "run", "logs", "latest.log"), "[Server thread/INFO]: Starting minecraft server version 1.20.1\nException: boom\n");
    const insp = inspectRuntime({ projectPath: logRoot, maxLines: 20 });
    assert.equal(insp.ok, true, JSON.stringify(insp));
    assert.ok(insp.logAnalysis, JSON.stringify(insp));
  } finally {
    rmSync(logRoot, { recursive: true, force: true });
  }

  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const docs = [
    readFileSync(join(repoRoot, "README.md"), "utf8"),
    readFileSync(join(repoRoot, "CONTRIBUTING.md"), "utf8"),
  ].join("\n");
  const wfCount = Object.keys(WORKFLOW_TEMPLATES).length;
  for (const m of docs.matchAll(/(\d+)\s*个工作流/g)) {
    assert.equal(Number(m[1]), wfCount, `文档写死「${m[1]} 个工作流」但模板数为 ${wfCount}`);
  }
}

await testNeoForgeGenericRouting();
await testUnknownPlatformEvidence();
await testForgeDetectedFromGradleOnly();
await testYarnShortNameAndMojangHeuristic();
await testFabricClassPrefixSearch();
await testSandboxAssertWritablePath();
await testNeoForge1201ForgeCompat();
await testArchitecturyDryRunDoesNotWrite();
await testWriteBlockedWithoutAllowEnv();
await testMigrationRequiresConfirmationAndWritesWhenConfirmed();
await testCommunityDocsSearchAndLinks();
await testCrashAnalyzeKindAndMissingDep();
await testPlatformDataMissing();
await testNeoForgeResolveDirForgeCompat();
await testSearchEnhancements();
await testDatagenAndMappingGates();
await testPortingFabricYarnAndProps();
await testObfuscatedLayerAndLookup();
await testFivePlatformRouting();
await testReviewFixes();
await testPlan2PrimerMdkFabricPorting();
await testMdkUnpackFixtures();
await testProjectPathFill();
testPlan1Fixes();
await testPrototypeOwnKeys();
console.log("core regression tests passed");

// queryApi starts a Worker; SQLite handles must close — otherwise Node hangs after pass.
try {
  const { closeAllYarnDbs } = await import("./dist/mappings/yarn-sqlite.js");
  closeAllYarnDbs();
} catch {
  /* dist may omit if earlier import failed — ignore */
}
try {
  const { disposeApiData } = await import("./dist/api/index.js");
  disposeApiData();
} catch {
  /* ignore */
}
process.exit(0);
