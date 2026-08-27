import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

import { listVersions, searchForgeDocs, searchDocs, getDocFull, getDocSummary, getDocRelated, getForgeDocSummary, getForgeDocFull } from "./dist/docs-platform/forge/index.js";
import { analyzePortingPath, portProject, javaForMcVersion } from "./dist/porting/index.js";
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
import { searchNeoForgeDocs, getNeoForgeDocSummary, getNeoForgeDocFull, getNeoForgeDocRelated } from "./dist/docs-platform/neoforge/index.js";
import { generateDatagen, parseNeo21Patch } from "./dist/datagen/index.js";
import { generateLang, generateCapability, generateConfig, generateEntityRenderer, generateNetworkPacket, NETWORK_PACKET_PLATFORMS, generateNetworkPacketDescription } from "./dist/generators/index.js";
import { diagnoseGradle, detectMinecraftVersion } from "./dist/gradle/index.js";
import { isExactMcVersionToken, matchesExactMcVersion, VERSION_SEGMENT_RE, isSafeVersionSegment, classifyMinecraftVersion } from "./dist/utils/minecraft-version.js";
import { withDocsFallbackFields, matchDocIndexId, pathBoost } from "./dist/docs-platform/search-utils.js";
import { detectLoader, detectProjectLoaders, classifyJavaFmlToml, getMigrationGuide, checkDependencies, extractGradleDependenciesBlock } from "./dist/diagnostics/index.js";
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
  analyzeBedrockContentLog,
} from "./dist/bedrock/index.js";
import { listSemanticDbPresence, semanticStaleSearchWarning, getSemanticIndexStatus } from "./dist/docs-platform/semantic/status.js";
import { isSemanticIndexStale } from "./dist/docs-platform/semantic/fingerprint.js";
import { SEMANTIC_DDL, semanticDbPath } from "./dist/docs-platform/semantic/search.js";
import { resolveDataDir, diagnoseDataPaths } from "./dist/utils/path.js";
import { symlinkSync } from "node:fs";
import { resolve } from "node:path";
import {
  listCommunitySources,
  searchCommunityDocs,
  getCommunityDocFull,
} from "./dist/docs-platform/community/index.js";
import { CommunityDocStore, stripLeadingFrontmatter } from "./dist/docs-platform/community/store.js";
import { analyzeCrash, CRASH_ANALYZE_MAX, CRASH_HARD_MAX } from "./dist/crash/index.js";
import { validateProject } from "./dist/validate/index.js";
import { validateDatapackJson } from "./dist/datapack/index.js";
import { collectJavaSources, collectCrashReports } from "./dist/utils/project-files.js";
import { checkPublishReady } from "./dist/publish/index.js";
import { inspectRuntime } from "./dist/runtime-inspect/index.js";
import { exclusiveFabricFallbackRefusal } from "./dist/docs-platform/quilt-search.js";
import { getWorkflowTemplate, WORKFLOW_TEMPLATES } from "./dist/prompts/index.js";
import { KNOWN_VERSIONS } from "./dist/docs-platform/platforms.js";

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
  mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
  writeFileSync(source, "import net.minecraftforge.eventbus.api.Event;\n", "utf8");
  writeFileSync(join(root, "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
  writeFileSync(
    join(root, "src", "main", "resources", "META-INF", "mods.toml"),
    'modLoader="javafml"\n[[mods]]\nmodId="example"\n',
    "utf8",
  );

  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevRoot = process.env.MC_SKILL_PROJECT_ROOT;
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = root;

  try {
    await portProject({
      projectPath: root,
      action: "apply_version_migration",
      targetVersion: "1.20.4",
      targetPlatform: "neoforge",
      dryRun: false,
      confirmed: false,
    });
    assert.match(readFileSync(source, "utf8"), /net\.minecraftforge/);

    await portProject({
      projectPath: root,
      action: "apply_version_migration",
      targetVersion: "1.20.4",
      targetPlatform: "neoforge",
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

async function testMigrationSamePlatformDoesNotRenameForgePackages() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-migrate-same-"));
  const source = join(root, "src", "main", "java", "Example.java");
  mkdirSync(join(root, "src", "main", "java"), { recursive: true });
  mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
  writeFileSync(source, "import net.minecraftforge.eventbus.api.Event;\n", "utf8");
  writeFileSync(join(root, "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
  writeFileSync(
    join(root, "src", "main", "resources", "META-INF", "mods.toml"),
    'modLoader="javafml"\n[[mods]]\nmodId="example"\n',
    "utf8",
  );
  const prevAllow = process.env.MC_SKILL_ALLOW_WRITE;
  const prevRoot = process.env.MC_SKILL_PROJECT_ROOT;
  process.env.MC_SKILL_ALLOW_WRITE = "1";
  process.env.MC_SKILL_PROJECT_ROOT = root;
  try {
    const out = JSON.parse(await portProject({
      projectPath: root,
      action: "apply_version_migration",
      targetVersion: "1.20.1",
      targetPlatform: "forge",
      dryRun: false,
      confirmed: true,
    }));
    assert.equal(out.ok, true);
    assert.ok(out.skippedReason);
    assert.equal((out.changes?.packageRenames ?? []).length, 0);
    assert.match(readFileSync(source, "utf8"), /net\.minecraftforge/);
    assert.doesNotMatch(readFileSync(source, "utf8"), /net\.neoforged/);
  } finally {
    if (prevAllow === undefined) delete process.env.MC_SKILL_ALLOW_WRITE;
    else process.env.MC_SKILL_ALLOW_WRITE = prevAllow;
    if (prevRoot === undefined) delete process.env.MC_SKILL_PROJECT_ROOT;
    else process.env.MC_SKILL_PROJECT_ROOT = prevRoot;
    rmSync(root, { recursive: true, force: true });
  }
}

async function testExtractCommonArchitecturyLayout() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-arch-src-"));
  const source = join(root, "common", "src", "main", "java", "a", "A.java");
  mkdirSync(join(root, "common", "src", "main", "java", "a"), { recursive: true });
  writeFileSync(source, "import net.minecraftforge.registries.DeferredRegister;\nclass A {}\n", "utf8");
  try {
    const out = JSON.parse(await portProject({
      projectPath: root,
      action: "extract_common",
      dryRun: true,
    }));
    assert.equal(out.ok, true);
    assert.ok(out.candidates?.some((c) => /A\.java/.test(c.relPath)), JSON.stringify(out));
    const cand = out.candidates.find((c) => /A\.java/.test(c.relPath));
    assert.equal(cand.status, "has_loader_calls", `仅 import 也应 has_loader_calls: ${JSON.stringify(cand)}`);
    assert.notEqual(cand.status, "safe_to_move");
    writeFileSync(join(root, "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
    const analyzed = JSON.parse(await analyzePortingPath({
      projectPath: root,
      targetPlatform: "neoforge",
      targetVersion: "1.20.1",
    }));
    assert.notEqual(analyzed.error?.code, "SRC_NOT_FOUND", JSON.stringify(analyzed.error ?? analyzed.analysis?.current));
    assert.ok(
      (analyzed.analysis?.current?.stats?.javaFiles ?? 0) >= 1,
      `Architectury common/src 应被 analyze 扫到: ${JSON.stringify(analyzed.analysis?.current?.stats)}`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function testPortingTargetVersionRequired() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-no-ver-"));
  try {
    mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(join(root, "build.gradle"), "plugins { id 'net.minecraftforge.gradle' }\n", "utf8");
    writeFileSync(
      join(root, "src", "main", "resources", "META-INF", "mods.toml"),
      'modLoader="javafml"\n[[mods]]\nmodId="nover"\n',
      "utf8",
    );
    const analyzed = JSON.parse(await analyzePortingPath({ projectPath: root, targetPlatform: "neoforge" }));
    assert.equal(analyzed.ok, false);
    assert.equal(analyzed.error.code, "TARGET_VERSION_REQUIRED");

    const missingMigrate = JSON.parse(await portProject({
      projectPath: root,
      action: "apply_version_migration",
      dryRun: true,
    }));
    assert.equal(missingMigrate.ok, false);
    assert.equal(missingMigrate.error.code, "TARGET_VERSION_REQUIRED");

    const initDefault = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      modId: "examplemod",
      dryRun: true,
    }));
    assert.equal(initDefault.ok, true);
    assert.ok(
      (initDefault.warnings ?? []).some((w) => /未传 targetVersion/.test(w) && /1\.20\.4/.test(w)),
      JSON.stringify(initDefault.warnings),
    );
  } finally {
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
    assert.equal(fqn.converted, "net.minecraft.block.Block");

    // yarn-tiny 库无 MCP/Parchment 可读层：拒绝把 Yarn 名冒充 mcp/parchment 名（F-D202）
    const refuse = convertYarnMember("1.20.1", "yarn", "parchment", "Block");
    assert.equal(refuse.found, false, JSON.stringify(refuse));
    assert.ok(refuse.notes.some((n) => /yarn-tiny|MCP\/Parchment/.test(n)), JSON.stringify(refuse.notes));

    const gate = convertMapping({
      from: "yarn",
      to: "parchment",
      memberName: "net.minecraft.entity.LivingEntity",
      version: "1.20.1",
    });
    assert.equal(gate.found, false, JSON.stringify(gate));
    assert.equal(gate.resultKind, "YARN_TINY_NO_MCP_LAYER");
  } finally {
    closeAllYarnDbs();
  }
}

async function testFabricClassPrefixSearch() {
  const dataRoot =
    process.env.MC_SKILL_DATA ??
    resolve(fileURLToPath(new URL("..", import.meta.url)), "data");
  process.env.MC_SKILL_DATA = dataRoot;
  const store = createFabricDocStore("26.1.2", "fabric-docs", dataRoot);
  const byClass = store.searchIndex("class:item", "26.1.2");
  assert.ok(byClass.length > 0, "class:item should hit L0 index via prefix-only filter");
  const byPlain = store.searchIndex("item", "26.1.2");
  assert.ok(byPlain.length > 0, "plain item search should still work");

  // F-D103：search 同系列命中后，summary/full(1.16.8) 也应同系列解析而非 VERSION_NOT_FOUND
  const forgeStore = new ForgeDocStore(dataRoot);
  if (forgeStore.getAvailableVersions().includes("1.16.5")) {
    const search = forgeStore.searchIndexDetailed("registries", "1.16.8");
    assert.ok(search.results.length > 0, "series-resolved search should hit");
    const hitId = search.results[0].id;
    const summary = forgeStore.loadSummary(hitId, "1.16.8");
    assert.equal(summary.id, hitId);
    const full = await forgeStore.loadFullDoc(hitId, "1.16.8");
    assert.ok(full.content.length > 0);
  }
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

    // 目标自身是已存在 symlink 时也必须拒绝（F-B02：upsert/marker 类读旧写新会穿透链接）
    const targetFile = join(secret, "outside.txt");
    writeFileSync(targetFile, "x", "utf8");
    const fileLink = join(root, "leak-file.txt");
    try {
      symlinkSync(targetFile, fileLink, "file");
      let threw2 = false;
      try {
        assertWritablePath(fileLink, nativeReal(root));
      } catch (e) {
        threw2 = true;
        assert.ok(e instanceof ProjectPathError);
        assert.equal(e.code, "PATH_OUTSIDE_ALLOWLIST");
      }
      assert.equal(threw2, true, "existing symlink target must be rejected");
    } catch (e) {
      console.log("skip file-symlink target test:", e.message);
    }

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

function testAuditMinorFixes() {
  const nested = `
dependencies {
  foo {
    bar { }
  }
  implementation 'x:y:1'
}`;
  const block = extractGradleDependenciesBlock(nested);
  assert.ok(block && /implementation/.test(block), block);
  const r = checkDependencies(nested, 'modLoader="javafml"\n[[mods]]\nmodId="x"\nversion="1"');
  assert.ok(!r.suggestions.some((s) => /implementation \/ modImplementation/.test(s)), JSON.stringify(r.suggestions));

  const body = "---\ntitle: x\n---\n# Hello\ntext ---\nmore";
  assert.match(stripLeadingFrontmatter(body), /^# Hello/);
  const innerDash = "---\na: 1\n---\nkeep ---\nthis";
  assert.match(stripLeadingFrontmatter(innerDash), /keep ---/);

  const badRoot = mkdtempSync(join(tmpdir(), "mc-comm-"));
  try {
    mkdirSync(join(badRoot, "indexes"), { recursive: true });
    writeFileSync(join(badRoot, "indexes", "index-l0.json"), "{not json", "utf8");
    const store = new CommunityDocStore(badRoot);
    const listed = store.listSources();
    assert.equal(listed.total, 0);
    assert.ok(listed.warning && /MC_SKILL_COMMUNITY/.test(listed.warning), listed.warning);
  } finally {
    rmSync(badRoot, { recursive: true, force: true });
  }
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
  assert.equal(fallback.ok, false);
  assert.equal(fallback.code, "VERSION_NOT_FOUND");
  assert.match(String(fallback.hint ?? ""), /list_forge_versions/);

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

  const fabricHit = parseToolText(await searchFabricDocs({ query: "Identifier", version: "26.1.2" }));
  assert.ok(fabricHit.total >= 1 || fabricHit.results?.length >= 1, "Fabric Identifier should hit via L1 symbols");

  const fabricEmpty = parseToolText(await searchFabricDocs({ query: "blocks", version: "1.14.4" }));
  assert.notEqual(fabricEmpty.error?.code, "VERSION_NOT_FOUND");
  assert.ok(fabricEmpty.fabricDocsEmpty || /无版本化页/.test(String(fabricEmpty.warning ?? "")), JSON.stringify(fabricEmpty).slice(0, 400));
  assert.ok(fabricEmpty.wikiIsCurrentSite || /现行/.test(String(fabricEmpty.warning ?? "")), String(fabricEmpty.warning ?? "").slice(0, 300));

  const fab262 = parseToolText(await searchFabricDocs({ query: "porting", version: "26.2" }));
  assert.notEqual(fab262.error?.code, "VERSION_NOT_FOUND", JSON.stringify(fab262).slice(0, 400));
  assert.ok(fab262.ok !== false, JSON.stringify(fab262).slice(0, 400));
  assert.equal(fab262.sourceUsed ?? fab262.source, "porting-extra");
  assert.match(String(fab262.warning ?? ""), /porting-extra|26\.2/);

  const firstItem = parseToolText(await searchFabricDocs({ query: "first item", version: "1.20.4" }));
  assert.ok(
    (firstItem.results ?? []).some((r) => r.id === "1.20.4/develop_items_first-item"),
    JSON.stringify(firstItem.results?.slice(0, 5)).slice(0, 500),
  );
  assert.notEqual(firstItem.fallback, true);

  const net1204 = parseToolText(await searchFabricDocs({ query: "networking", version: "1.20.4" }));
  const netIds = (net1204.results ?? []).map((r) => r.id);
  assert.ok(!netIds.includes("1.20.4/develop_networking"), netIds.join(","));
  if (net1204.fallback === true || /wiki/i.test(String(net1204.sourceUsed ?? ""))) {
    assert.match(String(net1204.warning ?? ""), /不是 1\.20\.4/);
    if (/wiki/i.test(String(net1204.sourceUsed ?? net1204.warning ?? ""))) {
      assert.match(String(net1204.warning ?? ""), /现行|1\.20\.5|Payload/);
    }
  } else {
    assert.equal(net1204.sourceUsed ?? net1204.source, "fabric-docs");
  }

  const armor1204 = parseToolText(await searchFabricDocs({ query: "armor", version: "1.20.4" }));
  assert.ok(
    (armor1204.results ?? []).some((r) => /1\.20\.4\/develop_items_custom-armor|custom-armor|food/.test(String(r.id))),
    JSON.stringify(armor1204.results?.slice(0, 8)).slice(0, 600),
  );
  assert.notEqual(armor1204.fallback, true);

  const sounds1211 = parseToolText(await searchFabricDocs({ query: "sounds", version: "1.21.1" }));
  assert.ok(
    (sounds1211.results ?? []).some((r) =>
      /1\.21\.1\/develop_.*sound|text-and-translations/.test(String(r.id)),
    ),
    JSON.stringify(sounds1211.results?.slice(0, 8)).slice(0, 600),
  );
  assert.notEqual(sounds1211.fallback, true);

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
    await searchDocs({ query: "Identifier", version: "26.1.2", platform: "fabric", source: "fabric-docs" }),
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
  assert.equal(docsFb.ok, false);
  assert.equal(docsFb.error?.code, "VERSION_NOT_FOUND");
  assert.match(String(docsFb.error?.hint ?? ""), /list_forge_versions/);

  // 数据层验收：Fabric label 可读；NeoForge 1.20.4 含 concepts/registries
  const fabricL0Path = join(dataRoot, "fabric_26.1.2", "fabric-docs", "26.1.2", "index-l0.json");
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
    assert.ok(d.code?.includes("search_forge_docs"), `${t} docs-review`);
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
      assert.ok(forgeExtra.code?.includes("Consumer<Advancement>"), "GH1 Forge 1.20.1 Consumer<Advancement>");
      assert.ok(!forgeExtra.code?.includes("AdvancementHolder"), "GH1 must not copy neo Holder");
      assert.ok(forgeExtra.code?.includes("search_forge_docs"), "GH1 docs-review on 1.20.1 providers");
      assert.ok(
        nfExtra.code?.includes("net.neoforged.neoforge.common.data.AdvancementProvider"),
        "NeoForge AdvancementProvider",
      );
      assert.ok(nfExtra.code?.includes("AdvancementHolder"), "neo 1.21 must keep Holder");
    }
    if (t === "sound") {
      assert.ok(nfExtra.code?.includes("SoundDefinitionsProvider"), "sound datagen provider");
    }
    if (t === "particle") {
      assert.ok(nfExtra.code?.includes("ParticleDescriptionProvider"), "particle datagen provider");
    }
  }

  const unknownNf = generateDatagen({
    providerType: /** @type {any} */ ("nope"),
    modId: "demo",
    targetName: "spark",
    platform: "neoforge",
    version: "1.21.1",
  });
  assert.equal(unknownNf.code, null, JSON.stringify(unknownNf));
  assert.ok(unknownNf.errors?.some((e) => /Unknown NeoForge 1\.21 provider/.test(e)), JSON.stringify(unknownNf));
  const knownNf = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "spark",
    platform: "neoforge",
    version: "1.21.1",
  });
  assert.ok(knownNf.code?.includes("net.neoforged"), JSON.stringify(knownNf));

  const sugg = suggestSimilarMethods("getHealth", ["getMaxHealth", "getHunger", "hurt"]);
  assert.ok(sugg.includes("getMaxHealth"));
  const short = suggestSimilarMethods("getH", ["getHunger", "getMaxHealth", "getHealth"]);
  assert.equal(short.length, 0, "getH must not suggest unrelated methods");
  assert.equal(suggestSimilarMethods("a".repeat(65), ["getHealth"]).length, 0, "input>64 must return []");
  assert.equal(suggestSimilarMethods("getHealth", ["x".repeat(97)]).length, 0, "candidate>96 must skip");

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

  // F-D203：1.14.4 全量数据（fabric yarn-tiny + forge mcp-csv 并存）下，带 owner 的 MCP 可读名
  // 未命中时应附带 CSV 指引 note（yarn 命中路径见下方 csvOwner 用例），而非无提示通用 miss
  const csvOwnerGuided = convertMapping({
    from: "mcp",
    to: "mojang",
    memberName: "getHealth",
    ownerClass: "net.minecraft.entity.EntityLivingBase",
    version: "1.14.4",
  });
  assert.equal(csvOwnerGuided.found, false, JSON.stringify(csvOwnerGuided));
  assert.ok(
    (csvOwnerGuided.notes ?? []).some((n) => /searge|owner/.test(n)),
    JSON.stringify(csvOwnerGuided.notes),
  );

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

  // D1：Yarn 专名不得冒充 MCP；CSV 同名（getHealth）走 csv 源
  const fake114 = convertMapping({
    from: "yarn",
    to: "mcp",
    memberName: "applyDamage",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.14.4",
  });
  assert.equal(fake114.found, false, "1.14.4 yarn applyDamage must not masquerade as MCP");
  assert.equal(fake114.converted, null);
  assert.equal(fake114.resultKind, "YARN_TINY_NO_MCP_LAYER", fake114.resultKind);
  const fake115 = convertMapping({
    from: "yarn",
    to: "mcp",
    memberName: "applyDamage",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.15.2",
  });
  assert.equal(fake115.found, false, "1.15.2 yarn applyDamage must not be MCP");
  assert.equal(fake115.converted, null);
  assert.ok(
    fake115.resultKind === "YARN_TINY_NO_MCP_LAYER" || fake115.resultKind === "csv-no-owner",
    fake115.resultKind,
  );
  const yarnNamedCsv = convertMapping({
    from: "yarn",
    to: "mcp",
    memberName: "getHealth",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.14.4",
  });
  assert.equal(yarnNamedCsv.found, true, JSON.stringify(yarnNamedCsv));
  assert.equal(yarnNamedCsv.converted, "getHealth");
  assert.equal(yarnNamedCsv.source, "csv");
  const yarnParchment201 = convertMapping({
    from: "yarn",
    to: "parchment",
    memberName: "LivingEntity",
    version: "1.20.1",
    memberKind: "class",
  });
  assert.equal(yarnParchment201.found, false);
  assert.equal(yarnParchment201.resultKind, "YARN_TINY_NO_MCP_LAYER");
  const yarnToParchment = convertMapping({
    from: "yarn",
    to: "parchment",
    memberName: "applyDamage",
    ownerClass: "net.minecraft.entity.LivingEntity",
    version: "1.14.4",
  });
  assert.notEqual(yarnToParchment.converted, "applyDamage");
  assert.ok(yarnToParchment.found === false || yarnToParchment.confidence !== "high" || yarnToParchment.source === "csv");

  const pktDesc = generateNetworkPacketDescription();
  for (const tok of NETWORK_PACKET_PLATFORMS) {
    assert.ok(pktDesc.includes(tok), `A1 description missing ${tok}`);
  }

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
  const handler = await queryApi({ className: "Handler", version: "1.20.1" });
  assert.equal(handler.found, false, "ambiguous Handler must not hit MouseHandler");
  assert.ok(!handler.methods?.length, "ambiguous Handler must not return methods");
  assert.notEqual(handler.className, "net.minecraft.client.MouseHandler");
  const itemSimple = await queryApi({ className: "Item", version: "1.20.1" });
  assert.equal(itemSimple.found, true, "unique simple name Item must hit");
  assert.equal(itemSimple.className, "net.minecraft.world.item.Item");
  assert.equal(itemSimple.autoCorrected, true);
  assert.equal(itemSimple.requestedClassName, "Item");
  const q1211 = await queryApi({
    className: "net.minecraft.world.entity.LivingEntity",
    version: "1.21.1",
  });
  assert.equal(q1211.found, false);
  assert.equal(q1211.action?.code, "DATA_UNAVAILABLE");
  assert.ok(q1211.warning && /无 Vanilla API 索引/.test(q1211.warning), JSON.stringify(q1211).slice(0, 500));
  const { getMethodParams } = await import("./dist/mappings/convert.js");
  const overloads = getMethodParams({
    className: "net.minecraft.world.entity.LivingEntity",
    methodName: "addEffect",
    version: "1.20.1",
  });
  assert.equal(overloads.found, false, JSON.stringify(overloads).slice(0, 400));
  assert.equal(overloads.ambiguous, true);
  assert.ok(Array.isArray(overloads.candidates) && overloads.candidates.length > 1);
  const noIdx = getMethodParams({
    className: "net.minecraft.world.item.Item",
    methodName: "use",
    version: "26.1",
  });
  assert.equal(noIdx.found, false);
  assert.equal(noIdx.action?.code, "DATA_UNAVAILABLE");
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

  const llLeftoverFab = diagnoseGradle({
    buildGradle: `
apply plugin: 'net.minecraftforge.gradle.liteloader'
minecraft {
  version = '1.12.2-14.23.5.2847'
  mappings = 'stable_39'
  runDir = 'run'
}
task runClient {}
`,
    fabricModJson: '{"schemaVersion":1,"id":"leftover"}',
    litemodJson: '{"name":"x"}',
    modsToml: 'modLoader="javafml"\n[[mods]]\nmodId="demo"',
  });
  assert.equal(llLeftoverFab.errors.length, 0, JSON.stringify(llLeftoverFab.errors));
  assert.ok(!llLeftoverFab.errors.some((e) => /Java 17|toolchain|6\.0,6\.2|forge:1\.20/.test(e)));
  assert.ok(llLeftoverFab.warnings.some((w) => /LiteMod/.test(w)));

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
  }, "1.20.1");
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

  const inner = analyzeCrash({
    crashReport:
      "---- Minecraft Crash Report ----\nDescription: Ticking screen\n\tat net.minecraft.client.Minecraft$Inner.run(Minecraft.java:1)\n",
    version: "1.20.1",
  });
  assert.ok(
    (inner.deobfuscated ?? []).some((s) => /Minecraft\$Inner/i.test(s)),
    JSON.stringify(inner.deobfuscated),
  );
  const anon = analyzeCrash({
    crashReport:
      "---- Minecraft Crash Report ----\nDescription: Ticking\n\tat net.minecraft.client.Minecraft$1.run(Minecraft.java:1)\n\tat net.foo.Bar$$Lambda$12/0x1.run(Unknown)\n",
    version: "1.20.1",
  });
  assert.ok(!(anon.deobfuscated ?? []).some((s) => /Minecraft\$1$/.test(s) || /\$\$Lambda/.test(s)), JSON.stringify(anon.deobfuscated));

  const lateQuilt = `${"x".repeat(70 * 1024)}\norg.quiltmc.loader.impl.QuiltLoader crashed`;
  assert.equal(detectCrashKind(lateQuilt), "quilt");
  const earlyQuilt = `org.quiltmc.loader.impl.QuiltLoader crashed\n${"x".repeat(70 * 1024)}`;
  assert.equal(detectCrashKind(earlyQuilt), "quilt");
  const midOnlyQuilt = `${"x".repeat(70 * 1024)}\norg.quiltmc.loader.impl.QuiltLoader crashed\n${"x".repeat(70 * 1024)}`;
  assert.notEqual(detectCrashKind(midOnlyQuilt), "quilt");

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

  const fabricNoVer = analyzeCrash({
    crashReport: "---- Minecraft Crash Report ----\nFabric Loader 0.16.0\nnet.fabricmc.loader.impl.FabricLoaderImpl\n",
  });
  assert.equal(fabricNoVer.crashKind, "fabric");
  assert.ok(Array.isArray(fabricNoVer.deobfuscated));
  assert.equal(fabricNoVer.analysisComplete, false);
  assert.equal(fabricNoVer.ok, true);
  assert.equal(fabricNoVer.action?.code, "VERSION_REQUIRED");

  // Forgified Fabric API 保留 net.fabricmc.* 栈帧：NeoForge/Forge 报告不得误判 fabric（F-E201）
  const neoWithFabricApi =
    "---- Minecraft Crash Report ----\n" +
    "net.neoforged.neoforge.network.registration.PayloadRegistry\n" +
    "at net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents.endServerTick(ServerTickEvents.java:50)\n";
  assert.equal(detectCrashKind(neoWithFabricApi), "fml");
  const neoResult = analyzeCrash({ crashReport: neoWithFabricApi, version: "1.20.1" });
  assert.notEqual(neoResult.crashKind, "fabric");

  const fileNameFabricWithNeo =
    "---- Minecraft Crash Report ----\n" +
    "File: crash-2024-01-01_12.00.00-fabric.txt\n" +
    "cpw.mods.modlauncher.TransformingClassLoader\n";
  assert.notEqual(detectCrashKind(fileNameFabricWithNeo), "fabric");

  assert.equal(
    detectCrashKind("---- Minecraft Crash Report ----\nnet.minecraft.server.dedicated.DedicatedServer\n"),
    "vanilla",
  );
  const vanillaSrv = analyzeCrash({
    crashReport: "---- Minecraft Crash Report ----\nnet.minecraft.server.dedicated.DedicatedServer\n",
    version: "1.20.1",
  });
  assert.equal(vanillaSrv.crashKind, "vanilla");

  const lambdaCrash = analyzeCrash({
    crashReport:
      "---- Minecraft Crash Report ----\nat net.minecraft.world.item.Item$Properties.<init>\nat com.example.Mod.lambda$onTick$0(Mod.java:1)\n",
    version: "1.20.1",
  });
  assert.ok(!(lambdaCrash.deobfuscated ?? []).some((s) => /lambda\$/i.test(s)), JSON.stringify(lambdaCrash.deobfuscated));
  assert.ok(!(lambdaCrash.deobfuscated ?? []).some((s) => /\$Properties/i.test(s)), JSON.stringify(lambdaCrash.deobfuscated));

  const oversizeBody = `---- Minecraft Crash Report ----\nFabric Loader\n${("xxxxxxxx\n").repeat(70_000)}`;
  const oversize = analyzeCrash({
    crashReport: oversizeBody,
    version: "1.20.1",
  });
  assert.ok(oversizeBody.length > CRASH_ANALYZE_MAX);
  assert.equal(oversize.ok, true, "超过 512KB 应截断后分析，不得整份拒绝");
  assert.equal(oversize.truncated, true);
  assert.notEqual(oversize.action?.code, "INVALID_INPUT");
  assert.ok((oversize.logHints ?? []).some((h) => /截断/.test(h)), JSON.stringify(oversize.logHints));

  const tooHuge = analyzeCrash({
    crashReport: "x".repeat(CRASH_HARD_MAX + 1),
    version: "1.20.1",
  });
  assert.equal(tooHuge.ok, false);
  assert.equal(tooHuge.action?.code, "INVALID_INPUT");
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

  const evilIdentity = convertMapping({
    from: "yarn",
    to: "yarn",
    memberName: "foo",
    version: "..\\..\\evil",
  });
  assert.equal(evilIdentity.found, false, "from===to must not succeed on path-traversal version");
  assert.equal(evilIdentity.action?.code, "INVALID_INPUT");
  const slashIdentity = convertMapping({
    from: "yarn",
    to: "yarn",
    memberName: "foo",
    version: "../../evil",
  });
  assert.equal(slashIdentity.found, false);
  assert.equal(slashIdentity.action?.code, "INVALID_INPUT");

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

  const loSrgField = lookupObfuscated({ name: "field_100013_f", version: "1.14.4" });
  assert.equal(loSrgField.found, true, `默认路径 SRG field 应命中，实际 ${JSON.stringify(loSrgField)}`);
  assert.equal(loSrgField.kind, "field");
  assert.ok(loSrgField.yarn, JSON.stringify(loSrgField));

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

async function testThinLoaderAndFabricWiki() {
  const llIndex = join(REPO_ROOT, "data", "liteloader_1.12.2", "liteloader-docs", "1.12.2", "index-l0.json");
  const llL0 = JSON.parse(readFileSync(llIndex, "utf8"));
  assert.ok(llL0.some((e) => e.id === "1.12.2/verified-api"));
  assert.ok(llL0.some((e) => e.id === "1.12.2/hybrid"));
  assert.ok(llL0.some((e) => e.source === "liteloader-wiki" && String(e.id).includes("/wiki_")));
  const verified = readFileSync(
    join(REPO_ROOT, "data", "liteloader_1.12.2", "liteloader-docs", "1.12.2", "processed", "verified-api.md"),
    "utf8",
  );
  assert.match(verified, /已核实客户端接口/);
  assert.ok(!existsSync(join(REPO_ROOT, "data", "liteloader_1.12.2", "liteloader-docs", "1.12.2", "index-l1.json")));
  assert.ok(
    existsSync(join(REPO_ROOT, "data", "liteloader_1.12.2", "liteloader-docs", "1.12.2", "semantic", "db.sqlite")),
    "liteloader 1.12.2 semantic db",
  );

  const llSearch = parseToolText(
    await searchDocs({ platform: "liteloader", version: "1.12.2", query: "litemod.json" }),
  );
  assert.equal(llSearch.semantic, true, JSON.stringify({ semantic: llSearch.semantic, warning: llSearch.warning }).slice(0, 400));
  assert.ok(llSearch.wikiIsCurrentSite || /现行站/.test(String(llSearch.warning ?? "")), String(llSearch.warning ?? "").slice(0, 300));
  assert.ok(
    (llSearch.results ?? []).some((r) => /wiki_/.test(r.id)),
    JSON.stringify(llSearch.results?.slice(0, 5)).slice(0, 400),
  );

  const riftL0 = JSON.parse(
    readFileSync(join(REPO_ROOT, "data", "rift_1.13.2", "rift-docs", "1.13.2", "index-l0.json"), "utf8"),
  );
  assert.ok(riftL0.some((e) => e.id === "1.13.2/listeners"));
  assert.ok(riftL0.some((e) => e.id === "1.13.2/making-mods-wiki"));
  assert.ok(riftL0.some((e) => e.id === "1.13.2/wiki_installing_multimc"));
  const extract = readFileSync(
    join(REPO_ROOT, "data", "rift_1.13.2", "rift-docs", "1.13.2", "processed", "making-mods-wiki.md"),
    "utf8",
  );
  assert.match(extract, /已核实事实/);
  assert.ok(
    existsSync(join(REPO_ROOT, "data", "rift_1.13.2", "rift-docs", "1.13.2", "semantic", "db.sqlite")),
    "rift semantic db",
  );

  const riftSearch = parseToolText(
    await searchDocs({ platform: "rift", version: "1.13.2", query: "MultiMC" }),
  );
  assert.equal(riftSearch.semantic, true, JSON.stringify({ semantic: riftSearch.semantic, warning: riftSearch.warning }).slice(0, 400));
  assert.ok(
    (riftSearch.results ?? []).some((r) => r.id === "1.13.2/wiki_installing_multimc"),
    JSON.stringify(riftSearch.results?.slice(0, 6)).slice(0, 400),
  );
  assert.ok(riftSearch.wikiIsCurrentSite || /归档/.test(String(riftSearch.warning ?? "")));

  for (const ver of ["1.21.4", "1.21.8", "1.21.10"]) {
    const wikiL0 = join(REPO_ROOT, "data", `fabric_${ver}`, "fabric-wiki", ver, "index-l0.json");
    assert.ok(existsSync(wikiL0), `missing fabric-wiki for ${ver}`);
    const arr = JSON.parse(readFileSync(wikiL0, "utf8"));
    assert.ok(arr.length >= 7, `${ver} wiki L0 ${arr.length}`);
    assert.ok(
      existsSync(join(REPO_ROOT, "data", `fabric_${ver}`, "fabric-wiki", ver, "semantic", "db.sqlite")),
      `${ver} fabric-wiki semantic db`,
    );
  }
  assert.equal(existsSync(join(REPO_ROOT, "data", "fabric_26.1.2", "fabric-wiki")), false);
}

async function testFivePlatformRouting() {
  for (const v of ["1.21.4", "1.21.8", "1.21.10"]) {
    assert.ok(KNOWN_VERSIONS.fabric.includes(v), `KNOWN_VERSIONS.fabric missing ${v}`);
  }
  for (const v of ["1.21.3", "1.21.4", "1.21.8", "1.21.10"]) {
    assert.ok(KNOWN_VERSIONS.quilt.includes(v), `KNOWN_VERSIONS.quilt missing ${v}`);
  }
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
  const leftoverFab = '{"schemaVersion":1,"id":"leftover"}';
  assert.equal(
    detectLoader("apply plugin: 'net.minecraftforge.gradle.liteloader'", 'modLoader="javafml"', leftoverFab, undefined, {
      litemodJson: '{"name":"x"}',
    }),
    "liteloader_forge",
  );
  assert.equal(
    detectLoader("", undefined, leftoverFab, undefined, { litemodJson: '{"name":"legacy"}' }),
    "liteloader",
  );
  assert.equal(
    detectLoader("apply plugin: 'net.minecraftforge.gradle.forge'", 'modLoader="javafml"', leftoverFab, undefined, {
      litemodJson: '{"name":"x"}',
    }),
    "unknown",
  );
  assert.equal(
    detectLoader("id 'fabric-loom'", undefined, leftoverFab, undefined, { litemodJson: '{"name":"legacy"}' }),
    "fabric",
    "fabric-loom 工程里的残留 litemod.json 不得压过 Fabric",
  );
  const llFabLoaders = detectProjectLoaders({
    buildGradle: "apply plugin: 'net.minecraftforge.gradle.liteloader'",
    modsToml: 'modLoader="javafml"\n[[mods]]\nmodId="demo"',
    fabricModJson: leftoverFab,
    extras: { litemodJson: '{"name":"x"}' },
  });
  assert.equal(llFabLoaders.primary, "liteloader_forge");
  assert.ok(llFabLoaders.loaders.includes("liteloader") || llFabLoaders.loaders.includes("liteloader_forge"));
  assert.ok(llFabLoaders.loaders.includes("fabric"));
  assert.equal(llFabLoaders.multiLoader, true);
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

  const q1201 = parseToolText(await searchDocs({ platform: "quilt", version: "1.20.1", query: "registry" }));
  assert.notEqual(q1201.error?.code, "VERSION_NOT_FOUND", JSON.stringify(q1201.error ?? {}).slice(0, 300));
  assert.notEqual(q1201.fallback, "fabric", "1.20.1 有 quilt-docs，不得误回退 Fabric");

  const qNet = parseToolText(
    await searchDocs({ platform: "quilt", version: "1.21.11", query: "ServerPlayNetworking" }),
  );
  const qNetHits = qNet.results ?? [];
  const qNetExclusive = qNetHits.filter((r) =>
    /ServerPlayNetworking|ClientPlayNetworking|PacketByteBufs|fabric\.api\.networking/.test(JSON.stringify(r)),
  );
  if (qNetExclusive.length) {
    assert.ok(qNet.warning, JSON.stringify(qNet).slice(0, 400));
    assert.notEqual(qNet.fallback, null);
  }
  if (qNet.error?.code === "FABRIC_EXCLUSIVE") {
    assert.ok(qNet.warning, JSON.stringify(qNet).slice(0, 400));
  }

  const qReg = parseToolText(await searchDocs({ platform: "quilt", version: "1.21.11", query: "registry" }));
  assert.notEqual(qReg.error?.code, "VERSION_NOT_FOUND", JSON.stringify(qReg.error ?? {}).slice(0, 400));
  assert.equal(qReg.ok, true, JSON.stringify(qReg.error ?? qReg).slice(0, 400));
  assert.notEqual(qReg.fallback, "fabric", "1.21.11 已入库 quilt-docs，不得回退 Fabric Registry");
  assert.doesNotMatch(String(qReg.warning ?? ""), /Quilt 官方文档无此版本/);

  const q1211qsl = parseToolText(
    await searchDocs({ platform: "quilt", version: "1.21.11", query: "QSL QuiltRegistry" }),
  );
  assert.notEqual(q1211qsl.fallback, "fabric", "1.21.11 QSL 查询禁止回退 Fabric");
  assert.ok(
    q1211qsl.ok === false || q1211qsl.error?.code === "FABRIC_EXCLUSIVE" || /QSL|禁止回退|QuiltRegistry/.test(JSON.stringify(q1211qsl)),
    JSON.stringify(q1211qsl).slice(0, 400),
  );

  const qModJson = parseToolText(
    await searchDocs({ platform: "quilt", version: "1.21.11", query: "quilt.mod.json schema_version" }),
  );
  assert.equal(qModJson.ok, true, JSON.stringify(qModJson.error ?? qModJson).slice(0, 400));
  assert.ok(
    (qModJson.results ?? []).some((r) => r.id === "1.21.11/quilt-mod-json"),
    `expected 1.21.11/quilt-mod-json in results: ${JSON.stringify(qModJson.results ?? []).slice(0, 400)}`,
  );
  assert.notEqual(qModJson.fallback, "quilt", "1.21.11 有 quilt-mod-json，不得回退 1.21.1");

  const qModFull = parseToolText(
    await getDocFull({ platform: "quilt", version: "1.21.11", id: "1.21.11/quilt-mod-json", highlight_key: false }),
  );
  assert.notEqual(qModFull.ok, false, JSON.stringify(qModFull.error ?? qModFull).slice(0, 400));
  assert.equal(qModFull.fallback, null);
  assert.match(JSON.stringify(qModFull), /quilt_loader|schema_version/i);

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
  const both = generateAddonManifest({ packName: "BothPack", packType: "both" });
  const rpH = both.files["RP/manifest.json"].header.uuid;
  const bpH = both.files["BP/manifest.json"].header.uuid;
  const rpM = both.files["RP/manifest.json"].modules[0].uuid;
  const bpM = both.files["BP/manifest.json"].modules[0].uuid;
  assert.notEqual(rpH, bpH, "packType=both RP/BP header UUID 必须不同");
  assert.notEqual(rpM, bpM, "packType=both RP/BP module UUID 必须不同");
  assert.notEqual(rpH, rpM);
  const bad = validateAddonManifest(JSON.stringify({ format_version: 2, experimentalGameplay: true, header: {}, modules: [] }));
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.some((e) => /experimentalGameplay/.test(e)));
  const noModUuid = validateAddonManifest(JSON.stringify({
    format_version: 2,
    header: { name: "x", uuid: "00000000-0000-0000-0000-000000000000", version: [1, 0, 0] },
    modules: [{ type: "data", version: [1, 0, 0] }],
  }));
  assert.equal(noModUuid.ok, false);
  assert.ok(noModUuid.errors.some((e) => /modules\[0\]\.uuid/.test(e)), JSON.stringify(noModUuid.errors));
  const strVer = validateAddonManifest(JSON.stringify({
    format_version: 2,
    header: { name: "x", uuid: "00000000-0000-0000-0000-000000000000", version: [1, 0, 0] },
    modules: [{ type: "data", uuid: "11111111-1111-1111-1111-111111111111", version: ["1", "0", "0"] }],
  }));
  assert.equal(strVer.ok, false);
  assert.ok(strVer.errors.some((e) => /modules\[0\]\.version/.test(e)));

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

  const neoTomlOnly = 'modLoader="javafml"\nloaderVersion="[21,)"\n[[mods]]\nmodId="demo"\n[[dependencies.demo]]\nmodId="neoforge"\n';
  assert.equal(detectLoader("", neoTomlOnly), "neoforge");
  assert.equal(classifyJavaFmlToml(neoTomlOnly), "neoforge");
  assert.equal(
    detectLoader("", 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n'),
    "forge",
  );
  const javafmlBare = 'modLoader="javafml"\n[[mods]]\nmodId="demo"\n';
  assert.equal(detectLoader("", javafmlBare), "unknown");
  assert.equal(
    detectLoader("plugins { id 'net.minecraftforge.gradle' }", javafmlBare),
    "forge",
  );
  const deps = checkDependencies("", javafmlBare);
  assert.equal(deps.detectedLoader, "unknown");
  assert.equal(deps.action?.code, "PICK_PLATFORM");

  const neoWithFabricJson =
    'modLoader="javafml"\nloaderVersion="[21,)"\n[[mods]]\nmodId="demo"\n[[dependencies.demo]]\nmodId="neoforge"\n';
  assert.equal(
    detectLoader(
      "plugins { id 'net.neoforged.gradle.userdev' }",
      undefined,
      '{"schemaVersion":1,"id":"leftover"}',
      neoWithFabricJson,
    ),
    "neoforge",
  );
  assert.equal(
    detectLoader("plugins { id 'net.neoforged.gradle.userdev' }"),
    "neoforge",
  );
  assert.equal(
    detectLoader("plugins { id 'net.neoforged.moddev' }"),
    "neoforge",
  );
  assert.equal(
    detectLoader('plugins { id("net.neoforged.moddev") }'),
    "neoforge",
  );
  const forgeCommentNeo =
    "plugins { id 'net.minecraftforge.gradle' }\n// TODO: neoforge port\njava.toolchain.languageVersion = JavaLanguageVersion.of(17)\n";
  assert.equal(detectLoader(forgeCommentNeo, 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n'), "forge");
  const forgeCompatDep =
    "plugins { id 'net.minecraftforge.gradle' }\nimplementation '...neoforge-compat'\n";
  assert.equal(detectLoader(forgeCompatDep, 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n'), "forge");
  const commentNeoGradle = diagnoseGradle({
    buildGradle: forgeCommentNeo,
    gradleProperties: "minecraft_version=1.20.1\nforge_version=47.2.0\n",
  });
  assert.ok(!(commentNeoGradle.errors ?? []).some((e) => /NeoGradle userdev|ModDevGradle/i.test(String(e))), JSON.stringify(commentNeoGradle.errors));
  const neoFabLoaders = detectProjectLoaders({
    buildGradle: "plugins { id 'net.neoforged.gradle.userdev' }",
    fabricModJson: '{"schemaVersion":1,"id":"leftover"}',
    neoModsToml: neoWithFabricJson,
  });
  assert.equal(neoFabLoaders.primary, "neoforge");
  assert.ok(neoFabLoaders.loaders.includes("neoforge"));
  assert.ok(neoFabLoaders.loaders.includes("fabric"));
  assert.equal(neoFabLoaders.multiLoader, true);
  const quiltDualLoaders = detectProjectLoaders({
    buildGradle: "id 'org.quiltmc.loom'",
    fabricModJson: '{"schemaVersion":1,"id":"x"}',
    extras: { quiltModJson: '{"schema_version":1}' },
  });
  assert.equal(quiltDualLoaders.primary, "quilt");
  const archLoaders = detectProjectLoaders({
    buildGradle: 'plugins { id "architectury-plugin" }',
    fabricModJson: '{"schemaVersion":1,"id":"demo"}',
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="demo"\n',
  });
  assert.equal(archLoaders.multiLoader, true);
  assert.ok(archLoaders.loaders.includes("fabric"));
  assert.ok(archLoaders.loaders.includes("forge"));

  const neoFabRoot = mkdtempSync(join(tmpdir(), "mc-skill-neo-fab-"));
  try {
    mkdirSync(join(neoFabRoot, "src", "main", "java", "demo"), { recursive: true });
    mkdirSync(join(neoFabRoot, "src", "main", "resources", "META-INF"), { recursive: true });
    writeFileSync(
      join(neoFabRoot, "build.gradle"),
      "plugins { id 'net.neoforged.gradle.userdev' version '7.0.184' }\n",
      "utf8",
    );
    writeFileSync(
      join(neoFabRoot, "src", "main", "resources", "META-INF", "neoforge.mods.toml"),
      neoWithFabricJson,
      "utf8",
    );
    writeFileSync(
      join(neoFabRoot, "src", "main", "resources", "fabric.mod.json"),
      JSON.stringify({ schemaVersion: 1, id: "leftover" }),
      "utf8",
    );
    writeFileSync(
      join(neoFabRoot, "src", "main", "java", "demo", "Main.java"),
      "package demo;\nimport net.neoforged.fml.common.Mod;\n@Mod(\"demo\") class Main {}\n",
      "utf8",
    );
    const neoDeps = checkDependencies("", undefined, undefined, undefined, { projectPath: neoFabRoot });
    assert.equal(neoDeps.detectedLoader, "neoforge", JSON.stringify(neoDeps));
    assert.ok(Array.isArray(neoDeps.loaders) && neoDeps.loaders.includes("neoforge"));
    const neoGradle = diagnoseGradle({ projectPath: neoFabRoot });
    assert.ok(!neoGradle.errors?.some((e) => /fabric-loom|Yarn/i.test(e)), JSON.stringify(neoGradle).slice(0, 500));
    const neoVal = validateProject({ projectPath: neoFabRoot });
    assert.ok(!neoVal.errors.some((e) => /fabric\.mod\.json/.test(e)), JSON.stringify(neoVal).slice(0, 500));
  } finally {
    rmSync(neoFabRoot, { recursive: true, force: true });
  }

  assert.equal(parseNeo21Patch("1.21"), 0);
  assert.equal(parseNeo21Patch("1.21.5"), 5);
  assert.equal(parseNeo21Patch("21.1.0"), null);
  const neoBuild = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "21.1.0",
  });
  assert.equal(neoBuild.code, null);
  assert.ok(neoBuild.errors?.some((e) => /Minecraft 版本/.test(e)), JSON.stringify(neoBuild));

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

  const tmpBad = mkdtempSync(join(tmpdir(), "mc-skill-sem-bad-"));
  const prevData = process.env.MC_SKILL_DATA;
  try {
    const versionDir = join(tmpBad, "quilt_1.20.1", "quilt-docs", "1.20.1");
    mkdirSync(join(versionDir, "semantic"), { recursive: true });
    const dbPath = semanticDbPath(tmpBad, "quilt", "1.20.1", "quilt-docs");

    writeFileSync(dbPath, "");
    const emptyRow = listSemanticDbPresence(tmpBad).find((p) => p.platform === "quilt" && p.version === "1.20.1");
    assert.equal(emptyRow?.exists, false, "empty sqlite must not count as exists");

    writeFileSync(dbPath, "not a sqlite database");
    const garbageRow = listSemanticDbPresence(tmpBad).find((p) => p.platform === "quilt" && p.version === "1.20.1");
    assert.equal(garbageRow?.exists, false, "garbage sqlite must not count as exists");

    rmSync(dbPath, { force: true });
    const broken = new DatabaseSync(dbPath);
    broken.exec("CREATE TABLE foo (id INTEGER)");
    broken.close();
    const noMeta = listSemanticDbPresence(tmpBad).find((p) => p.platform === "quilt" && p.version === "1.20.1");
    assert.equal(noMeta?.exists, false, "sqlite without meta must not count as exists");

    process.env.MC_SKILL_DATA = tmpBad;
    const paths = diagnoseDataPaths();
    const idx = getSemanticIndexStatus(tmpBad);
    assert.equal(paths.semantic.present, idx.presentCount);
    assert.equal(paths.semantic.present, 0);
    const sample = idx.samples.find((s) => s.platform === "quilt" && s.version === "1.20.1");
    assert.equal(sample?.exists, false);
  } finally {
    if (prevData === undefined) delete process.env.MC_SKILL_DATA;
    else process.env.MC_SKILL_DATA = prevData;
    rmSync(tmpBad, { recursive: true, force: true });
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

  const dualRoot = mkdtempSync(join(tmpdir(), "mc-skill-dual-unsup-"));
  try {
    mkdirSync(join(dualRoot, "src", "main", "resources"), { recursive: true });
    writeFileSync(join(dualRoot, "src", "main", "resources", "litemod.json"), '{"name":"lite","version":"1.0"}\n', "utf8");
    const dual = JSON.parse(await analyzePortingPath({ projectPath: dualRoot, targetPlatform: "bedrock" }));
    assert.equal(dual.ok, false, JSON.stringify(dual));
    assert.equal(dual.error.code, "UNSUPPORTED_PORT");
    assert.match(String(dual.error.hint), /liteloader/);
    assert.match(String(dual.error.hint), /bedrock/);
    assert.ok(
      (dual.error.next ?? []).some((n) => /liteloader/.test(n) && /bedrock/.test(n)),
      JSON.stringify(dual.error.next),
    );
  } finally {
    rmSync(dualRoot, { recursive: true, force: true });
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
    const q = JSON.parse(await analyzePortingPath({ projectPath: quiltDual, targetPlatform: "quilt", targetVersion: "1.21.1" }));
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
    const q = JSON.parse(await analyzePortingPath({ projectPath: quiltLoomOnly, targetPlatform: "quilt", targetVersion: "1.21.1" }));
    assert.equal(q.ok, true, JSON.stringify(q.error ?? q));
    assert.equal(q.analysis.current.platform, "quilt");
  } finally {
    rmSync(quiltLoomOnly, { recursive: true, force: true });
  }

  const fabToQuilt = mkdtempSync(join(tmpdir(), "mc-skill-fab-quilt-"));
  try {
    mkdirSync(join(fabToQuilt, "src", "main", "resources"), { recursive: true });
    writeFileSync(join(fabToQuilt, "build.gradle"), "plugins { id 'fabric-loom' version '1.6-SNAPSHOT' }\n", "utf8");
    writeFileSync(
      join(fabToQuilt, "src", "main", "resources", "fabric.mod.json"),
      JSON.stringify({ schemaVersion: 1, id: "fabmod", version: "1.0.0" }),
      "utf8",
    );
    const q = JSON.parse(
      await analyzePortingPath({ projectPath: fabToQuilt, targetPlatform: "quilt", targetVersion: "1.21.1" }),
    );
    assert.equal(q.ok, true, JSON.stringify(q.error ?? q));
    assert.equal(q.analysis.current.platform, "fabric");
    assert.equal(q.analysis.recommendedRoute, "version_migration", JSON.stringify(q.analysis.recommendedRoute));
    assert.ok(
      !(q.analysis.routeSteps ?? []).some((s) => /init_architectury/.test(s)),
      JSON.stringify(q.analysis.routeSteps),
    );
  } finally {
    rmSync(fabToQuilt, { recursive: true, force: true });
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
  assert.equal(fabFb.ok, false, JSON.stringify(fabFb.error ?? fabFb).slice(0, 400));
  assert.equal(fabFb.error?.code, "DOC_NOT_FOUND");
  assert.equal(fabFb.fallback, "fabric");

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

  const unknownVal = validateProject({
    javaFiles: [{ path: "src/Foo.java", content: "public class Foo {}\n" }],
  });
  assert.equal(unknownVal.status, "skipped", JSON.stringify(unknownVal));
  assert.equal(unknownVal.passed, null, JSON.stringify(unknownVal));
  assert.equal(unknownVal.ok, true, JSON.stringify(unknownVal));

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

  const fooMainTrap = validateProject({
    fabricModJson: JSON.stringify({
      schemaVersion: 1,
      id: "examplemod",
      entrypoints: { main: ["com.example.Main"] },
    }),
    javaFiles: [{
      path: "src/main/java/com/example/FooMain.java",
      content: "package com.example;\npublic class FooMain {}\n",
    }],
  });
  assert.equal(fooMainTrap.status, "failed", JSON.stringify(fooMainTrap));
  assert.ok(
    fooMainTrap.errors.some((e) => /entrypoint 类未在提供的 Java 源中找到：com\.example\.Main/.test(e)),
    JSON.stringify(fooMainTrap.errors),
  );

  const nestedOk = validateProject({
    fabricModJson: JSON.stringify({
      schemaVersion: 1,
      id: "examplemod",
      entrypoints: { main: ["com.example.Outer$Inner"] },
    }),
    javaFiles: [{
      path: "src/main/java/com/example/Outer$Inner.java",
      content: "package com.example;\npublic class Inner {}\n",
    }],
  });
  assert.equal(nestedOk.status, "passed", JSON.stringify(nestedOk));

  // A-3：entrypoint 含正则元字符时不得让 validate_project 崩溃（结构化失败而非 SyntaxError）
  let a3val;
  try {
    a3val = validateProject({
      fabricModJson: JSON.stringify({
        schemaVersion: 1,
        id: "examplemod",
        entrypoints: { main: ["net.foo.Class[a(", "com.example.ExampleMod"] },
      }),
      javaFiles: [{
        path: "src/main/java/com/example/ExampleMod.java",
        content:
          "package com.example;\nimport net.fabricmc.api.ModInitializer;\npublic class ExampleMod implements ModInitializer {\n  public void onInitialize() {}\n}\n",
      }],
    });
  } catch (err) {
    a3val = { crashed: String(err) };
  }
  assert.ok(!a3val.crashed, `malicious entrypoint crashed validator: ${a3val.crashed}`);
  assert.equal(a3val.status, "failed", JSON.stringify(a3val));
  assert.ok(
    a3val.errors.some((e) => /net\.foo\.Class|entrypoint/i.test(e)),
    JSON.stringify(a3val.errors),
  );

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
  assert.equal(bedrockVal.passed, null, JSON.stringify(bedrockVal));
  assert.equal(bedrockVal.ok, true, JSON.stringify(bedrockVal));
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

  const forgeSingleQuote = validateProject({
    modsToml: "modLoader='javafml'\nloaderVersion='[47,)'\n[[mods]]\nmodId='examplemod'\nversion='1.0.0'\n",
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content: '@Mod("examplemod")\npublic class ExampleMod {}\n',
    }],
  });
  assert.ok(
    !forgeSingleQuote.errors.some((e) => /modLoader/.test(e)),
    `单引号 modLoader 应通过: ${JSON.stringify(forgeSingleQuote.errors)}`,
  );

  const neoCommentBus = validateProject({
    neoModsToml: 'modLoader="javafml"\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\n',
    javaFiles: [{
      path: "src/main/java/com/example/ExampleMod.java",
      content:
        "package com.example;\nimport net.neoforged.fml.common.Mod;\n@Mod(\"examplemod\")\npublic class ExampleMod {\n  public ExampleMod() {}\n  // leftover IEventBus mention\n}\n",
    }],
  });
  assert.equal(neoCommentBus.status, "failed", JSON.stringify(neoCommentBus));
  assert.ok(neoCommentBus.errors.some((e) => /IEventBus/.test(e)), JSON.stringify(neoCommentBus.errors));

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
  if (qRelatedFb.ok === false) {
    assert.ok(
      qRelatedFb.error?.code === "DOC_NOT_FOUND" || qRelatedFb.error?.code === "VERSION_NOT_FOUND",
      JSON.stringify(qRelatedFb).slice(0, 400),
    );
  } else {
    assert.ok(Array.isArray(qRelatedFb), JSON.stringify(qRelatedFb).slice(0, 400));
    if (qRelatedFb.length > 0) {
      assert.equal(qRelatedFb[0].sourcePlatform, "fabric");
      assert.match(String(qRelatedFb[0].warning || ""), /回退 Fabric|QSL/);
    }
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
  assert.ok(
    fabPkt.warnings?.[0]?.includes("模糊 token") &&
      /禁止把本骨架当 1\.21\.1/.test(fabPkt.warnings.join("\n")) &&
      /fabric_26\.1\.2/.test(fabPkt.warnings.join("\n")),
    JSON.stringify(fabPkt.warnings),
  );

  const fabPkt261 = genPkt("my_mod", "sync_msg", "fabric_26.1");
  assert.ok(fabPkt261.code?.includes("ServerPlayNetworking"));
  assert.ok(fabPkt261.code?.includes("serverboundPlay"), fabPkt261.code?.slice(0, 500));
  assert.ok(!fabPkt261.code?.includes("playC2S"), fabPkt261.code?.slice(0, 500));
  assert.ok(!/net\.minecraftforge/.test(fabPkt261.code || ""));

  const networkCases = [
    { token: "neoforge_1.21.1", mustInclude: ["RegisterPayloadHandlersEvent", "DirectionalPayloadHandler"], mustNotInclude: ["SimpleChannel", "RegisterPayloadHandlerEvent"] },
    { token: "neoforge_1.21.3", mustInclude: ["RegisterPayloadHandlersEvent", "playBidirectional"], mustNotInclude: ["SimpleChannel"] },
    { token: "fabric_1.21.3", mustInclude: ["PayloadTypeRegistry", "playC2S"], mustNotInclude: ["serverboundPlay"] },
    { token: "fabric_1.21.4", mustInclude: ["PayloadTypeRegistry", "playC2S"], mustNotInclude: ["serverboundPlay", "RegisterPayloadHandlersEvent"] },
    { token: "fabric_1.21.8", mustInclude: ["playC2S", "CustomPayload"], mustNotInclude: ["serverboundPlay"] },
    { token: "fabric_1.21.10", mustInclude: ["PayloadTypeRegistry", "playC2S"], mustNotInclude: ["serverboundPlay"] },
    { token: "fabric_1.21.11", mustInclude: ["PayloadTypeRegistry", "playC2S"], mustNotInclude: ["serverboundPlay"] },
    { token: "fabric_26.1.2", mustInclude: ["serverboundPlay", "CustomPacketPayload"], mustNotInclude: ["playC2S"] },
    { token: "forge_1.20.4", mustInclude: ["SimpleChannel", "FriendlyByteBuf", "NetworkEvent"], mustNotInclude: ["PayloadTypeRegistry", "RegisterPayloadHandlersEvent"] },
    { token: "forge_1.19.4", mustInclude: ["FriendlyByteBuf", "NetworkEvent"], mustNotInclude: ["RecipeOutput", "PayloadTypeRegistry"] },
    { token: "forge_1.18.2", mustInclude: ["FriendlyByteBuf"], mustNotInclude: ["PayloadTypeRegistry"] },
    { token: "forge_1.12.2", mustInclude: ["IMessage", "SimpleNetworkWrapper"], mustNotInclude: ["FriendlyByteBuf", "PayloadTypeRegistry", "playC2S"] },
  ];
  for (const c of networkCases) {
    const r = genPkt("demo", "sync", c.token);
    assert.ok(r.code, `${c.token} should generate: ${JSON.stringify(r.errors)}`);
    for (const s of c.mustInclude) {
      assert.ok(r.code.includes(s), `${c.token} missing ${s}: ${r.code.slice(0, 240)}`);
    }
    for (const s of c.mustNotInclude) {
      assert.ok(!r.code.includes(s), `${c.token} must not include ${s}`);
    }
  }
  const noNet1204 = genPkt("demo", "sync", "fabric_1.20.4");
  assert.equal(noNet1204.code, null);
  const noNet1211 = genPkt("demo", "sync", "fabric_1.21.1");
  assert.equal(noNet1211.code, null);
  assert.ok(
    (noNet1211.errors ?? []).some((e) => /failures\.json/.test(e) && /search_fabric_docs version=1\.21\.4/.test(e)),
    JSON.stringify(noNet1211.errors),
  );
  const noNetNeo1206 = genPkt("demo", "sync", "neoforge_1.20.6");
  assert.equal(noNetNeo1206.code, null);
  const noNet1201 = genPkt("demo", "sync", "fabric_1.20.1");
  assert.equal(noNet1201.code, null);

  const neoFuzzy = genPkt("demo", "sync", "neoforge_1.21");
  assert.ok(neoFuzzy.code);
  assert.ok(
    (neoFuzzy.warnings ?? []).some((w) => /neoforge_1\.21\.1/.test(w) && /neoforge_26\.1/.test(w) && /模糊 token/.test(w)),
    JSON.stringify(neoFuzzy.warnings),
  );

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
    // 本用例专测 zip-slip 识别，与 pin 门无关 → 显式 allowUnpinned 绕开 A-2 fail-closed
    const slipRes = unpackMdkArchive({ zip: slipZip, destCache: slipDest, allowUnpinned: true });
    assert.equal(slipRes.ok, false);
    assert.equal(slipRes.error?.code, "ZIP_SLIP");
    assert.ok(existsSync(slipRes.archivePath));

    const tool = probeUnzipTool();
    if (!tool) {
      const missing = unpackMdkArchive({ zip: goodZip, destCache: join(dest, "notool"), allowUnpinned: true });
      assert.equal(missing.ok, false);
      assert.equal(missing.error?.code, "UNZIP_TOOL_MISSING");
      return;
    }
    const ok = unpackMdkArchive({ zip: goodZip, destCache: join(dest, "ok"), allowUnpinned: true });
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
  const { queryApi } = await import("./dist/api/index.js");
  const { getMethodParams } = await import("./dist/mappings/convert.js");
  for (const k of protoKeys.slice(0, 3)) {
    // query_api / get_method_params 裸索引已改 ownGet：原型键必须返回结构化 found:false 而非抛错（F-D201）
    const qa = await queryApi({ className: k, version: "1.20.1" });
    assert.equal(qa.found, false, `queryApi(${k}) must not hit Object.prototype`);
    assert.ok(Array.isArray(qa.suggestions), `queryApi(${k}) must return structured envelope`);

    const mp = getMethodParams({ className: k, methodName: "toString", version: "1.20.1" });
    assert.equal(mp.found, false, `getMethodParams(${k}) must not hit Object.prototype`);

    const cm = convertMapping({
      from: "mojang",
      to: "yarn",
      memberName: "m_91003_",
      ownerClass: k,
      version: "1.20.1",
    });
    assert.equal(cm.found, false, `convertMapping ownerClass=${k} must not hit Object.prototype`);
  }
  for (const k of protoKeys) {
    const vi = await getVersionInfo({ version: k, action: "register", platform: "forge" });
    assert.equal(vi.forgeVersion, "unknown", `get_version_info(${k}) must not hit Object.prototype`);
    assert.equal(vi.ok, false);
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
  assert.ok(!/DeferredRegister/.test(v112.recommendation), v112.recommendation);

  const v165 = await getVersionInfo({ version: "1.16.5", action: "register", platform: "forge" });
  assert.ok(!/创建 DeferredRegister/.test(v165.recommendation), v165.recommendation);

  const v194 = await getVersionInfo({ version: "1.19.4", action: "register", platform: "forge" });
  assert.ok(/DeferredRegister/.test(v194.recommendation), v194.recommendation);

  const v1204 = await getVersionInfo({ version: "1.20.4", action: "register", platform: "forge" });
  assert.ok(/49/.test(v1204.forgeVersion), v1204.forgeVersion);
  assert.ok(/DeferredRegister/.test(v1204.recommendation), v1204.recommendation);

  const v1211 = await getVersionInfo({ version: "1.21.1", action: "register", platform: "forge" });
  assert.ok(/search_forge_docs/.test(v1211.recommendation), v1211.recommendation);
  assert.ok(!/创建 DeferredRegister/.test(v1211.recommendation), v1211.recommendation);

  const v112be = await getVersionInfo({ version: "1.12.2", action: "blockentity", platform: "forge" });
  assert.ok(v112be.recommendation.includes("ITileEntityProvider"), v112be.recommendation);
  assert.ok(v112be.recommendation.includes("BlockContainer"), v112be.recommendation);
  assert.ok(v112be.recommendation.includes("不要使用"), v112be.recommendation);

  const v1211be = await getVersionInfo({ version: "1.21.1", action: "blockentity", platform: "forge" });
  assert.ok(/search_forge_docs/.test(v1211be.recommendation), v1211be.recommendation);
  assert.ok(/不要套用/.test(v1211be.recommendation), v1211be.recommendation);
  assert.ok(!/需实现 EntityBlock/.test(v1211be.recommendation), v1211be.recommendation);

  const v1211attr = await getVersionInfo({ version: "1.21.1", action: "attribute", platform: "forge" });
  assert.ok(/search_forge_docs/.test(v1211attr.recommendation), v1211attr.recommendation);
  assert.ok(!/ForgeRegistries\.Keys\.ATTRIBUTES/.test(v1211attr.recommendation), v1211attr.recommendation);
  const v1201attr = await getVersionInfo({ version: "1.20.1", action: "attribute", platform: "forge" });
  assert.ok(/ForgeRegistries\.Keys\.ATTRIBUTES/.test(v1201attr.recommendation), v1201attr.recommendation);
}

function testPlan1Fixes() {
  assert.equal(javaForMcVersion("26.1"), 25);
  assert.equal(javaForMcVersion("27.0"), 25);
  assert.equal(javaForMcVersion("1.21.11"), 25);
  assert.equal(javaForMcVersion("1.21.1"), 21);
  assert.equal(javaForMcVersion("1.21"), 21);
  assert.equal(javaForMcVersion("1.20.5"), 21);
  assert.equal(javaForMcVersion("1.20.6"), 21);
  assert.equal(javaForMcVersion("1.20.4"), 17);
  assert.equal(javaForMcVersion("1.18.2"), 17);
  assert.equal(javaForMcVersion("1.17"), 16);
  assert.equal(javaForMcVersion("1.17.1"), 16);
  assert.equal(javaForMcVersion("1.16.5"), 8);
  assert.equal(javaForMcVersion("1.12.2"), 8);

  assert.equal(detectMinecraftVersion({ gradleProperties: "minecraft_version=1.20.1\n" }), "1.20.1");
  assert.equal(detectMinecraftVersion({ gradleProperties: "neo_version=27.0.1\n" }), "27.0.1");
  assert.equal(isExactMcVersionToken("27.0"), true);
  assert.equal(isExactMcVersionToken("27.0-beta"), false);
  assert.equal(matchesExactMcVersion("27.0", "27.0"), true);
  assert.equal(matchesExactMcVersion("27.0", "26.1"), false);

  const forgeFb = withDocsFallbackFields({
    fallback: true,
    platform: "forge",
    requestedVersion: "1.20.4",
    resolvedVersion: "1.20.1",
  });
  assert.match(String(forgeFb.warning), /官方 Forge 文档/);
  assert.doesNotMatch(String(forgeFb.warning), /官方 docs 文档/);
  assert.equal(matchDocIndexId("1.20.1/concepts_registries", "concepts/registries", "1.20.1"), true);
  assert.equal(matchDocIndexId("1.20.1/concepts_registries", "1.20.1/concepts_registries", "1.20.1"), true);
  assert.equal(matchDocIndexId("other/page", "concepts/registries", "1.20.1"), false);
  assert.equal(pathBoost("concepts/registries", true), 12);
  assert.equal(pathBoost("concepts/registries", false), 0);
  assert.ok(pathBoost("foo/datagen", true) < pathBoost("concepts/registries", true));
  const genericFb = withDocsFallbackFields({
    fallback: true,
    requestedVersion: "1.20.4",
    resolvedVersion: "1.20.1",
  });
  assert.match(String(genericFb.warning), /官方 docs 文档/);
  assert.equal(detectMinecraftVersion({ gradleProperties: "mc_version=1.16.5\n" }), "1.16.5");
  assert.equal(detectMinecraftVersion({ buildGradle: "minecraft '1.20.1'\n" }), "1.20.1");
  assert.equal(detectMinecraftVersion({ buildGradle: "minecraft_version = '1.20.1'\n" }), "1.20.1");
  assert.equal(
    detectMinecraftVersion({ buildGradle: "dependencies { minecraft 'net.minecraftforge:forge:1.20.1-47.2.0' }\n" }),
    "1.20.1",
  );
  assert.equal(detectMinecraftVersion({ buildGradle: "plugins { id 'net.minecraftforge.gradle' }\n" }), "unknown");

  assert.equal(classifyMinecraftVersion("1.21"), "1.21.x");
  assert.equal(classifyMinecraftVersion("1.21.1"), "1.21.x");
  assert.equal(classifyMinecraftVersion("1.21.11"), "1.21.x");
  assert.equal(classifyMinecraftVersion("26.1"), "26.x");
  assert.equal(classifyMinecraftVersion("26.1.1"), "26.x");
  assert.equal(classifyMinecraftVersion("1.20.1"), "1.20.1");
  assert.equal(classifyMinecraftVersion("1.15.2"), "other");

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

  const fabTag21 = generateDatagen({
    providerType: "tag",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.4",
  });
  assert.ok(fabTag21.code?.includes("FabricTagProvider.ItemTagProvider"), fabTag21.code?.slice(0, 600));
  assert.ok(!fabTag21.code?.includes("FabricTagsProvider"), "GH2 1.21.x must be singular FabricTagProvider");
  assert.ok(fabTag21.code?.includes("getOrCreateTagBuilder"), "GH2 keep getOrCreateTagBuilder");
  const fabTag261 = generateDatagen({
    providerType: "tag",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "26.1.2",
  });
  assert.ok(fabTag261.code?.includes("FabricTagsProvider.ItemTagsProvider"), "GH2 26.1 keeps plural");
  assert.ok(!fabTag261.code?.includes("FabricTagProvider.ItemTagProvider"), "GH2 26.1 must not use 1.21 singular");

  const fabGen = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.4",
  });
  assert.ok(fabGen.code?.includes("void generate("), fabGen.code?.slice(0, 500));
  assert.ok(!fabGen.code?.includes("void buildRecipes("), fabGen.code?.slice(0, 400));
  assert.ok(
    fabGen.warnings?.some((w) => /RecipeExporter/.test(w)),
    JSON.stringify(fabGen.warnings),
  );
  assert.ok(fabGen.code?.includes("Yarn 工程改为 RecipeExporter"), fabGen.code?.slice(0, 800));

  const fab213 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.3",
  });
  assert.ok(fab213.code?.includes("void generate("), fab213.errors?.join(";") ?? fab213.code?.slice(0, 400));
  assert.ok(!fab213.code?.includes("void buildRecipes("));

  const fabBuild = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.10",
  });
  assert.ok(fabBuild.code?.includes("void buildRecipes("), fabBuild.code?.slice(0, 500));

  const fabNoNet = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.20.4",
  });
  assert.equal(fabNoNet.code, null);

  const fab215 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.5",
  });
  assert.equal(fab215.code, null);

  const quiltDg = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "quilt",
    version: "1.21.11",
  });
  assert.equal(quiltDg.code, null);
  assert.ok(quiltDg.errors?.some((e) => /search_fabric_docs version=1\.21\.11|手写 data\/ JSON/.test(e)), JSON.stringify(quiltDg.errors));

  const neo1201Dg = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "1.20.1",
  });
  assert.equal(neo1201Dg.code, null);
  assert.ok(neo1201Dg.errors?.some((e) => /search_neoforge_docs/.test(e)), JSON.stringify(neo1201Dg.errors));
  assert.ok(!/net\.minecraftforge\.data\.event\.GatherDataEvent/.test(neo1201Dg.code || ""));

  const forge194 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "forge",
    version: "1.19.4",
  });
  assert.equal(forge194.code, null);
  assert.ok(!/RecipeOutput/.test(forge194.code || ""));

  const forge1204 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "forge",
    version: "1.20.4",
  });
  // F-E101：vanilla 1.20.2+ 为 buildRecipes(RecipeOutput)；FinishedRecipe 类在 1.20.4 已不存在
  assert.ok(forge1204.code?.includes("RecipeOutput"), forge1204.code?.slice(0, 400));
  assert.ok(!forge1204.code?.includes("Consumer<FinishedRecipe>"), forge1204.code?.slice(0, 400));
  assert.ok(!/import net\.minecraft\.data\.recipes\.FinishedRecipe;/.test(forge1204.code || ""));
  assert.ok(
    forge1204.warnings?.some((w) => /buildRecipes\(RecipeOutput\)/.test(w)),
    JSON.stringify(forge1204.warnings),
  );

  const forge1204NonRecipe = generateDatagen({
    providerType: "blockstate",
    modId: "demo",
    targetName: "x",
    platform: "forge",
    version: "1.20.4",
  });
  assert.equal(forge1204NonRecipe.code, null);
  assert.ok(
    forge1204NonRecipe.errors?.some((e) => /仅核实 RecipeProvider/.test(e)),
    JSON.stringify(forge1204NonRecipe.errors),
  );

  const neo1204 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "1.20.4",
  });
  assert.ok(neo1204.code?.includes("RecipeOutput"), neo1204.code?.slice(0, 400));
  assert.ok(neo1204.code?.includes("PackOutput output)"), neo1204.code?.slice(0, 500));
  assert.ok(!/CompletableFuture/.test(neo1204.code || ""), "1.20.4 neo must not copy 1.21 two-arg ctor");

  const neo1206 = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "1.20.6",
  });
  assert.ok(neo1206.code?.includes("CompletableFuture"), neo1206.code?.slice(0, 400));
  assert.ok(neo1206.code?.includes("RecipeOutput"), neo1206.code?.slice(0, 300));

  const neo1206loot = generateDatagen({
    providerType: "loottable",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "1.20.6",
  });
  assert.equal(neo1206loot.code, null);
  assert.ok(neo1206loot.errors?.some((e) => /仅核实 RecipeProvider/.test(e)), JSON.stringify(neo1206loot));

  const neo1201pkt = generateNetworkPacket("demo", "sync", "neoforge_1.20.1");
  assert.ok(neo1201pkt.code, JSON.stringify(neo1201pkt.errors));
  assert.ok(!/Attachment/.test(neo1201pkt.code || ""));
  assert.ok(!/RegisterPayloadHandlersEvent/.test(neo1201pkt.code || ""));

  const capFab = generateCapability("my_mod", "mana", "fabric", "1.20.1");
  assert.equal(capFab.code, null);
  assert.ok(capFab.errors?.some((e) => /CCA|Cardinal|cca/i.test(e)), JSON.stringify(capFab));

  const capNeoNoVer = generateCapability("my_mod", "mana", "neoforge");
  assert.equal(capNeoNoVer.code, null);

  const capNeo1201 = generateCapability("my_mod", "mana", "neoforge", "1.20.1");
  assert.ok(capNeo1201.code, JSON.stringify(capNeo1201));
  assert.match(String(capNeo1201.code), /Capability/);
  assert.doesNotMatch(String(capNeo1201.code), /AttachmentType/);

  const capNeo1204 = generateCapability("my_mod", "mana", "neoforge", "1.20.4");
  assert.ok(capNeo1204.code?.includes("AttachmentType"), capNeo1204.code);

  const cfgNeo1204 = generateConfig("my_mod", "neoforge", "1.20.4");
  assert.ok(cfgNeo1204.code?.includes("ModConfigSpec"), cfgNeo1204.code);
  assert.ok(!/ForgeConfigSpec/.test(cfgNeo1204.code || ""));
  assert.ok(cfgNeo1204.warnings?.some((w) => /ModConfigSpec/.test(w)), JSON.stringify(cfgNeo1204.warnings));

  const wfCfg = getWorkflowTemplate("mc-config");
  assert.equal(wfCfg.found, true);
  assert.ok(/ModConfigSpec/.test(wfCfg.body), wfCfg.body);
  assert.ok(!/NeoForge 1\.20\.4：ForgeConfigSpec/.test(wfCfg.body), wfCfg.body);

  const cfgNeo1201 = generateConfig("my_mod", "neoforge", "1.20.1");
  assert.ok(cfgNeo1201.code?.includes("ForgeConfigSpec"), cfgNeo1201.code);

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

  const pubLoaderOnly = checkPublishReady({
    modsToml: `modLoader="javafml"\nloaderVersion="[47,)"\n`,
  });
  assert.equal(pubLoaderOnly.ready, false, JSON.stringify(pubLoaderOnly));
  assert.ok(pubLoaderOnly.errors.some((e) => /version/i.test(e)), JSON.stringify(pubLoaderOnly.errors));

  const pub = checkPublishReady({
    fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", license: "MIT" }),
  });
  assert.equal(pub.ready, true, JSON.stringify(pub));
  assert.ok(pub.warnings.some((w) => /不上传/.test(w)));

  const fatRoot = mkdtempSync(join(tmpdir(), "mc-pub-all-"));
  try {
    mkdirSync(join(fatRoot, "build", "libs"), { recursive: true });
    writeFileSync(join(fatRoot, "build", "libs", "mod-all.jar"), "fat");
    writeFileSync(join(fatRoot, "build", "libs", "mod-sources.jar"), "src");
    const pubFat = checkPublishReady({
      projectPath: fatRoot,
      fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", license: "MIT" }),
    });
    assert.ok((pubFat.jars ?? []).some((j) => /mod-all\.jar$/.test(j)), JSON.stringify(pubFat));
    assert.ok(!(pubFat.jars ?? []).some((j) => /mod-sources\.jar$/.test(j)), JSON.stringify(pubFat));
    assert.ok(pubFat.warnings.some((w) => /\*-all\.jar/.test(w)), JSON.stringify(pubFat.warnings));

    writeFileSync(join(fatRoot, "build", "libs", "mod.jar"), "thin");
    const pubBoth = checkPublishReady({
      projectPath: fatRoot,
      fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", license: "MIT" }),
    });
    assert.ok((pubBoth.jars ?? []).some((j) => /mod\.jar$/.test(j)), JSON.stringify(pubBoth));
    assert.ok(!(pubBoth.jars ?? []).some((j) => /mod-all\.jar$/.test(j)), JSON.stringify(pubBoth));
  } finally {
    rmSync(fatRoot, { recursive: true, force: true });
  }

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

  const inspCrashRoot = mkdtempSync(join(tmpdir(), "mc-inspect-crash-"));
  try {
    const body = `---- Minecraft Crash Report ----\nFabric Loader\n${("xxxxxxxx\n").repeat(70_000)}`;
    writeFileSync(join(inspCrashRoot, "crash-latest.txt"), body);
    const insp = inspectRuntime({
      crashReportsDir: inspCrashRoot,
      version: "1.20.1",
      maxBytes: 2 * 1024 * 1024,
    });
    assert.equal(insp.ok, true, JSON.stringify(insp));
    assert.ok((insp.warnings ?? []).some((w) => /截断/.test(w)), JSON.stringify(insp.warnings));
    assert.notEqual(insp.crashAnalysis?.action?.code, "INVALID_INPUT", JSON.stringify(insp.crashAnalysis));
    assert.equal(insp.crashAnalysis?.ok, true);
  } finally {
    rmSync(inspCrashRoot, { recursive: true, force: true });
  }

  const crashCapRoot = mkdtempSync(join(tmpdir(), "mc-crash-cap-"));
  try {
    mkdirSync(join(crashCapRoot, "crash-reports"), { recursive: true });
    for (let i = 0; i < 22; i++) {
      const n = String(i).padStart(2, "0");
      const p = join(crashCapRoot, "crash-reports", `crash-${n}.txt`);
      writeFileSync(p, `report ${n}\n`);
      const ts = 1_700_000_000 + i;
      utimesSync(p, ts, ts);
    }
    const capped = collectCrashReports(crashCapRoot);
    assert.equal(capped.reports.length, 20, JSON.stringify(capped.reports.map((r) => r.path)));
    assert.match(String(capped.warning), /截断/);
    const now = Date.now() / 1000;
    utimesSync(join(crashCapRoot, "crash-reports", "crash-21.txt"), now, now);
    utimesSync(join(crashCapRoot, "crash-reports", "crash-20.txt"), now, now);
    const newest = collectCrashReports(crashCapRoot);
    const newestPaths = newest.reports.map((r) => r.path);
    assert.ok(newestPaths.includes("crash-reports/crash-21.txt"), JSON.stringify(newestPaths));
    assert.ok(newestPaths.includes("crash-reports/crash-20.txt"), JSON.stringify(newestPaths));
    assert.ok(!newestPaths.includes("crash-reports/crash-00.txt"), JSON.stringify(newestPaths));
    const small = collectCrashReports(crashCapRoot);
    assert.ok(small.reports.every((r) => r.path.startsWith("crash-reports/")), JSON.stringify(small.reports));
  } finally {
    rmSync(crashCapRoot, { recursive: true, force: true });
  }

  const contentLogRoot = mkdtempSync(join(tmpdir(), "mc-clog-"));
  try {
    const logPath = join(contentLogRoot, "content_log.txt");
    writeFileSync(
      logPath,
      [
        "[12:00:00][WARN][Actor] missing texture",
        "this line is garbage not a content log",
        "[12:00:01][ERROR][Script] boom",
      ].join("\n"),
      "utf8",
    );
    const clog = analyzeBedrockContentLog({ logPath });
    assert.equal(clog.ok, true, JSON.stringify(clog));
    assert.equal(clog.warnings.length, 1, JSON.stringify(clog.warnings));
    assert.ok(clog.warnings[0].includes("missing texture"), JSON.stringify(clog.warnings));
    assert.equal(clog.unparsedLines.length, 1, JSON.stringify(clog.unparsedLines));
    assert.match(clog.unparsedLines[0], /garbage/);
    assert.ok(!clog.warnings.some((w) => /garbage/.test(w)), JSON.stringify(clog.warnings));
  } finally {
    rmSync(contentLogRoot, { recursive: true, force: true });
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

async function testW2MappingDocsFixes() {
  assert.equal(VERSION_SEGMENT_RE.test("1.20.1"), true);
  assert.equal(isSafeVersionSegment("1.20.1"), true);
  assert.equal(isSafeVersionSegment("..\\..\\evil"), false);
  assert.equal(isSafeVersionSegment("../../evil"), false);
  assert.equal(isExactMcVersionToken("1.16.5"), true, "path gate must not be isExactMcVersionToken-only");

  const s1201 = parseToolText(await searchDocs({ query: "block", version: "1.20.1", platform: "forge" }));
  assert.equal(s1201.ok, true, JSON.stringify(s1201).slice(0, 400));
  assert.ok(s1201.fallback !== true, "exact forge 1.20.1 must not stamp fallback:true");
  assert.equal(s1201.source_route, undefined, "source_route is deprecated");

  const dedicated1201 = parseToolText(await searchForgeDocs({ query: "block", version: "1.20.1" }));
  assert.ok(dedicated1201.fallback !== true);
  assert.equal(dedicated1201.source_route, undefined);

  const s1204 = parseToolText(await searchDocs({ query: "block", version: "1.20.4", platform: "forge" }));
  if (s1204.ok && !s1204.versionFallback) {
    assert.ok(s1204.fallback !== true, "1.20.4 dedicated-route must not fake versionFallback envelope");
    assert.match(String(s1204.warning ?? ""), /1\.20\.x/);
    assert.equal(s1204.source_route, undefined);
  }

  const forgeStore = new ForgeDocStore(resolveDataDir());
  if (forgeStore.getAvailableVersions().includes("1.16.5")) {
    const s168 = parseToolText(await searchDocs({ query: "registries", version: "1.16.8", platform: "forge" }));
    assert.equal(s168.ok, true, JSON.stringify({ ok: s168.ok, error: s168.error, warning: s168.warning }).slice(0, 400));
    assert.equal(s168.fallback, true);
    assert.equal(s168.versionFallback, true);
    assert.equal(s168.source_version, s168.resolvedVersion);
    assert.equal(s168.resolvedVersion, "1.16.5");
    assert.equal(s168.source_route, undefined);
    assert.equal(s168.confidence, "fallback");
    assert.equal(s168.action?.code, "VERSION_FALLBACK");

    const hitId = s168.results?.[0]?.id;
    assert.ok(hitId, "1.16.8 search should return a page id");
    const sum = parseToolText(await getDocSummary({ id: hitId, version: "1.16.8", platform: "forge" }));
    assert.equal(sum.fallback, true);
    assert.equal(sum.source_version, "1.16.5");
    assert.equal(sum.confidence, "fallback");
    assert.equal(sum.action?.code, "VERSION_FALLBACK");
    assert.equal(sum.versionFallback, true);
    assert.ok(sum.warning, "neighbor get_doc_summary must include warning");

    const full = parseToolText(await getDocFull({ id: hitId, version: "1.16.8", platform: "forge" }));
    assert.equal(full.fallback, true);
    assert.equal(full.source_version, "1.16.5");
    assert.equal(full.action?.code, "VERSION_FALLBACK");

    const forgeSum = parseToolText(await getForgeDocSummary({ id: hitId, version: "1.16.8" }));
    assert.equal(forgeSum.fallback, true);
    assert.equal(forgeSum.source_version, "1.16.5");
    const forgeFull = parseToolText(await getForgeDocFull({ id: hitId, version: "1.16.8" }));
    assert.equal(forgeFull.fallback, true);
    assert.equal(forgeFull.source_version, "1.16.5");
  }

  const exactSum = parseToolText(await getDocSummary({
    id: "concepts/registries",
    version: "1.20.1",
    platform: "forge",
  }));
  if (exactSum.ok !== false && !exactSum.error) {
    assert.ok(exactSum.fallback !== true, "exact get_doc_summary must not add fallback envelope");
    assert.equal(exactSum.source_route, undefined);
  }

  const neoSum = parseToolText(await getNeoForgeDocSummary({ id: "concepts/registries", version: "1.20.1" }));
  assert.ok(neoSum.ok !== false, JSON.stringify(neoSum).slice(0, 400));
  assert.equal(neoSum.forgeCompatible, true);
  assert.ok(neoSum.fallback !== true, "Neo 1.20.1 Forge-compat must not get fallback:true");
  const neoFull = parseToolText(await getNeoForgeDocFull({ id: "concepts/registries", version: "1.20.1" }));
  assert.equal(neoFull.forgeCompatible, true);
  assert.ok(neoFull.fallback !== true);
  const neoRel = parseToolText(await getNeoForgeDocRelated({ id: "concepts/registries", version: "1.20.1" }));
  assert.equal(neoRel.forgeCompatible, true);
  assert.ok(neoRel.fallback !== true);

  const neo262 = parseToolText(await getNeoForgeDocSummary({ id: "concepts/registries", version: "26.2" }));
  if (neo262.ok !== false && neo262.versionFallback) {
    assert.equal(neo262.fallback, true);
    assert.equal(neo262.source_version, neo262.resolvedVersion);
    assert.equal(neo262.action?.code, "VERSION_FALLBACK");
  }

  const { queryApi } = await import("./dist/api/index.js");
  const qa = await queryApi({ className: "Item", version: "..\\..\\evil" });
  assert.equal(qa.found, false);
  assert.equal(qa.action?.code, "INVALID_INPUT");
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
await testMigrationSamePlatformDoesNotRenameForgePackages();
await testExtractCommonArchitecturyLayout();
await testPortingTargetVersionRequired();
await testCommunityDocsSearchAndLinks();
testAuditMinorFixes();
await testCrashAnalyzeKindAndMissingDep();
await testPlatformDataMissing();
await testNeoForgeResolveDirForgeCompat();
await testSearchEnhancements();
await testDatagenAndMappingGates();
await testPortingFabricYarnAndProps();
await testObfuscatedLayerAndLookup();
await testFivePlatformRouting();
await testThinLoaderAndFabricWiki();
await testReviewFixes();
await testPlan2PrimerMdkFabricPorting();
await testMdkUnpackFixtures();
await testProjectPathFill();
testPlan1Fixes();
await testPrototypeOwnKeys();
await testW2MappingDocsFixes();
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
