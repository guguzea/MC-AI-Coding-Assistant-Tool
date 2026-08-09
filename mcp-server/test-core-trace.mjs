import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { listVersions, searchForgeDocs, searchDocs } from "./dist/docs-platform/forge/index.js";
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
import { diagnoseGradle } from "./dist/gradle/index.js";
import { resolveDataDir } from "./dist/utils/path.js";
import { symlinkSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  listCommunitySources,
  searchCommunityDocs,
  getCommunityDocFull,
} from "./dist/docs-platform/community/index.js";
import { analyzeCrash } from "./dist/crash/index.js";

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
    assert.equal(result.analysis.current.platform, "unknown");
    assert.equal(result.analysis.current.ambiguous, true);
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
  const { enhancedSearch } = await import("./dist/docs-platform/search-utils.js");
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
  });
  assert.ok(soft.code, "soft-normalized datagen should still emit code");
  assert.equal(soft.usedModId, "example_mod");
  assert.equal(soft.usedTargetName, "my_block");
  assert.ok(soft.warnings?.length >= 1);

  for (const t of /** @type {const} */ (["recipe", "blockstate", "itemmodel", "loottable", "tag"])) {
    const d = generateDatagen({ providerType: t, modId: "demo", targetName: "stone_block" });
    assert.ok(d.code?.includes("net.minecraft.data.PackOutput"), `${t} PackOutput`);
    assert.ok(!d.code?.includes("data.pack.PackOutput"), `${t} wrong PackOutput package`);
    assert.ok(!d.code?.includes("::iterator"), `${t} must not use ::iterator`);
    assert.ok(d.code?.includes("net.minecraftforge"), `${t} forge imports`);
    assert.ok(!d.code?.includes("net.neoforged"), `${t} must not be NeoForge`);
    if (t === "loottable") assert.ok(d.code?.includes("void generate()"), "loot generate()");
  }

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
    const forgeExtra = generateDatagen({ providerType: t, modId: "demo", targetName: "spark" });
    assert.ok(forgeExtra.code?.includes("net.minecraftforge"), `${t} forge path`);

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

  const { queryApi } = await import("./dist/api/index.js");
  const api = await queryApi({
    className: "net.minecraft.world.entity.LivingEntity",
    methodName: "getHealth",
    version: "1.20.1",
  });
  assert.equal(api.found, true);
  assert.ok(api.methods?.some((m) => m.name === "getHealth" && m.descriptor === "()F"));

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
  const result = analyzeCrash({ crashReport: fmlName });
  assert.equal(result.crashKind, "fml");
  assert.match(result.probableCause, /缺少强制依赖|前置/);
  assert.ok(Array.isArray(result.logHints) && result.logHints.length > 0);

  const beNull =
    '---- Minecraft Crash Report ----\nDescription: Unexpected error\n\njava.lang.NullPointerException: Cannot invoke "net.minecraft.world.level.block.entity.BlockEntity.getBlockState()" because "be" is null\n';
  const beResult = analyzeCrash({ crashReport: beNull });
  assert.match(beResult.probableCause, /BlockEntity 引用为 null|未取到 BE/);
  assert.doesNotMatch(beResult.probableCause, /world 为 null/);
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

console.log("PROGRESS: await testNeoForgeGenericRouting()"); await testNeoForgeGenericRouting()
console.log("PROGRESS: await testUnknownPlatformEvidence()"); await testUnknownPlatformEvidence()
console.log("PROGRESS: await testForgeDetectedFromGradleOnly()"); await testForgeDetectedFromGradleOnly()
console.log("PROGRESS: await testYarnShortNameAndMojangHeuristic()"); await testYarnShortNameAndMojangHeuristic()
console.log("PROGRESS: await testFabricClassPrefixSearch()"); await testFabricClassPrefixSearch()
console.log("PROGRESS: await testSandboxAssertWritablePath()"); await testSandboxAssertWritablePath()
console.log("PROGRESS: await testNeoForge1201ForgeCompat()"); await testNeoForge1201ForgeCompat()
console.log("PROGRESS: await testArchitecturyDryRunDoesNotWrite()"); await testArchitecturyDryRunDoesNotWrite()
console.log("PROGRESS: await testWriteBlockedWithoutAllowEnv()"); await testWriteBlockedWithoutAllowEnv()
console.log("PROGRESS: await testMigrationRequiresConfirmationAndWritesWhenConfirmed()"); await testMigrationRequiresConfirmationAndWritesWhenConfirmed()
console.log("PROGRESS: await testCommunityDocsSearchAndLinks()"); await testCommunityDocsSearchAndLinks()
console.log("PROGRESS: await testCrashAnalyzeKindAndMissingDep()"); await testCrashAnalyzeKindAndMissingDep()
console.log("PROGRESS: await testPlatformDataMissing()"); await testPlatformDataMissing()
console.log("PROGRESS: await testNeoForgeResolveDirForgeCompat()"); await testNeoForgeResolveDirForgeCompat()
console.log("PROGRESS: await testSearchEnhancements()"); await testSearchEnhancements()
console.log("PROGRESS: await testDatagenAndMappingGates()"); await testDatagenAndMappingGates()
console.log("PROGRESS: await testPortingFabricYarnAndProps()"); await testPortingFabricYarnAndProps()
console.log("core regression tests passed");
