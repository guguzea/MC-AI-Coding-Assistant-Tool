import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync, utimesSync, readdirSync, statSync, cpSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

import { listVersions, searchForgeDocs, searchDocs, getDocFull, getDocSummary, getDocRelated, getForgeDocSummary, getForgeDocFull } from "./dist/docs-platform/forge/index.js";
import { analyzePortingPath, portProject, javaForMcVersion } from "./dist/porting/index.js";
import { convertYarnMember, closeAllYarnDbs, resolveMappingDbPath, resolveCsvMappingDbPath } from "./dist/mappings/yarn-sqlite.js";
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
import { diagnoseGradle, detectMinecraftVersion, parseGradleProperties } from "./dist/gradle/index.js";
import { isExactMcVersionToken, matchesExactMcVersion, isMcVersionFamily, VERSION_SEGMENT_RE, isSafeVersionSegment, classifyMinecraftVersion } from "./dist/utils/minecraft-version.js";
import { withDocsFallbackFields, matchDocIndexId, pathBoost } from "./dist/docs-platform/search-utils.js";
import { detectLoader, detectProjectLoaders, classifyJavaFmlToml, getMigrationGuide, checkDependencies, extractGradleDependenciesBlock, javaBlobFromFiles } from "./dist/diagnostics/index.js";
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
  BEDROCK_CAPABILITIES,
} from "./dist/bedrock/index.js";
import { listSemanticDbPresence, semanticStaleSearchWarning, getSemanticIndexStatus, closeSemanticStatusDbs } from "./dist/docs-platform/semantic/status.js";
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
import { buildEntries as buildCommunityEntries } from "./scripts/_lib/community-index-core.mjs";
import { analyzeCrash, CRASH_ANALYZE_MAX, CRASH_HARD_MAX } from "./dist/crash/index.js";
import { validateProject } from "./dist/validate/index.js";
import { validateDatapackJson } from "./dist/datapack/index.js";
import { collectJavaSources, collectCrashReports } from "./dist/utils/project-files.js";
import { checkPublishReady } from "./dist/publish/index.js";
import { inspectRuntime } from "./dist/runtime-inspect/index.js";
import { exclusiveFabricFallbackRefusal } from "./dist/docs-platform/quilt-search.js";
import { getWorkflowTemplate, WORKFLOW_TEMPLATES } from "./dist/prompts/index.js";
import { KNOWN_VERSIONS } from "./dist/docs-platform/platforms.js";
import { sessionPlatformPack } from "./dist/platform-pack/session.js";
import { detectModProject } from "./dist/platform-pack/detect.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseToolText(result) {
  return JSON.parse(result.content[0].text);
}

/**
 * Learn 缓存页把表格拍平成一格一行：段名 → Name[/Type]/Description → 行名、描述……
 * 取某段表格的行名（遇到「行名紧跟下一张表的 Name」即停）。
 */
function docTableRowNames(pageText, section) {
  const lines = pageText.split(/\r?\n/).map((l) => l.trim());
  let start = -1;
  for (let k = 0; k < lines.length; k++) {
    if (lines[k] === section && lines[k + 1] === "Name") {
      start = k;
      break;
    }
  }
  if (start < 0) return [];
  let i = start + 1;
  while (i < lines.length && ["Name", "Type", "Description"].includes(lines[i])) i++;
  const NAME_RE = /^[a-z][a-zA-Z0-9_]*$/;
  const out = [];
  for (; i < lines.length; i++) {
    if (!NAME_RE.test(lines[i])) continue;
    if (lines[i + 1] === "Name") break;
    out.push(lines[i]);
  }
  return out;
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
    // targetPlatform 是必填：缺参数属于输入非法，必须在扫工程之前就以 INVALID_INPUT 拒掉，
    // 且消息点名是哪个字段（否则调用方只看到一个与缺参无关的 NOT_A_MOD_PROJECT）。
    const noTarget = JSON.parse(await analyzePortingPath({ projectPath: root }));
    assert.equal(noTarget.ok, false);
    assert.equal(noTarget.error.code, "INVALID_INPUT");
    assert.match(noTarget.error.message, /targetPlatform/, noTarget.error.message);
    // 参数齐了才轮到工程判定
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

async function testLiteLoaderForgeHybridNotMultiLoader() {
  // D-2 / N-4：混合工程（litemod.json + javafml mods.toml + liteloader 专用插件）此前在
  // detect_mod_project 里被双加成 forge + liteloader → detect.ts 的 multiLoader 门抢在
  // primary 之前返回 PICK_PLATFORM，AGENTS.md §4 的四分支决策在工具面根本走不到。
  const writeProj = (root, { gradle, modsToml, litemod }) => {
    mkdirSync(join(root, "src", "main", "resources", "META-INF"), { recursive: true });
    if (gradle) writeFileSync(join(root, "build.gradle"), gradle, "utf8");
    if (modsToml) {
      writeFileSync(join(root, "src", "main", "resources", "META-INF", "mods.toml"), modsToml, "utf8");
    }
    if (litemod) writeFileSync(join(root, "litemod.json"), litemod, "utf8");
  };
  const javafml = 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n';
  const cases = [
    {
      name: "hybrid",
      files: {
        gradle:
          "apply plugin: 'net.minecraftforge.gradle.forge'\napply plugin: 'net.minecraftforge.gradle.liteloader'\n",
        modsToml: javafml,
        litemod: '{"name":"examplemod","author":"a","description":"d","pack_version":4,"version":"1.0"}',
      },
      wantLoader: "liteloader_forge",
      wantPlatform: "liteloader",
      wantNotMulti: true,
    },
    {
      name: "pureLiteLoader",
      // 「纯 LiteLoader」= MCP + Eclipse，无 Gradle：只有 litemod.json、没有 Forge 元数据。
      // 带 net.minecraftforge.gradle.liteloader 插件的工程按 :286 的判据必然是混合工程
      // （该插件是 ForgeGradle 命名空间下的构建期硬证据），不是本用例要覆盖的形态。
      files: {
        gradle: undefined,
        modsToml: undefined,
        litemod: '{"name":"examplemod","author":"a","description":"d","pack_version":4,"version":"1.0"}',
      },
      wantLoader: "liteloader",
      wantPlatform: "liteloader",
      wantNotMulti: true,
    },
    {
      name: "pureForge",
      files: {
        gradle: "apply plugin: 'net.minecraftforge.gradle.forge'\n",
        modsToml: javafml,
        litemod: undefined,
      },
      wantLoader: "forge",
      wantPlatform: "forge",
      wantNotMulti: true,
    },
  ];
  for (const c of cases) {
    const root = mkdtempSync(join(tmpdir(), `mc-skill-hybrid-${c.name}-`));
    try {
      writeProj(root, c.files);
      const r = detectModProject({ projectPath: root });
      const blob = JSON.stringify(r);
      assert.equal(r.loader, c.wantLoader, `${c.name}: ${blob.slice(0, 300)}`);
      assert.equal(r.platform, c.wantPlatform, `${c.name}: ${blob.slice(0, 300)}`);
      assert.notEqual(r.action?.code, "PICK_PLATFORM", `${c.name} 不得再问 platform: ${blob.slice(0, 300)}`);
      if (c.wantNotMulti) {
        assert.notEqual(r.multiLoader, true, `${c.name} 单加载器工程不得判多加载器: ${blob.slice(0, 300)}`);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
}

async function testPortProjectRejectsBadVersionToken() {
  // P0-1 / B-15：targetVersion / neoforgeVersion 会被写进用户工程的 gradle.properties 与
  // build.gradle。此前 portProject 只在个别 action 分支里看版本，注入串能走到写盘路径。
  const root = mkdtempSync(join(tmpdir(), "mc-skill-badver-"));
  const bad = [
    { key: "targetVersion", value: "1.20.4 ${bad}" },
    { key: "targetVersion", value: "1.20.4-beta" },
    { key: "targetVersion", value: "1.21beta" },
    { key: "targetVersion", value: "latest" },
    { key: "neoforgeVersion", value: "21.1.x" },
    { key: "neoforgeVersion", value: "21.1.113)" },
  ];
  try {
    for (const b of bad) {
      const r = JSON.parse(await portProject({
        projectPath: root,
        action: "init_architectury",
        modId: "examplemod",
        targetVersion: "1.20.4",
        neoforgeVersion: "20.4.237",
        dryRun: true,
        [b.key]: b.value,
      }));
      const blob = JSON.stringify(r);
      assert.equal(r.ok, false, `${b.key}="${b.value}" 必须早退: ${blob.slice(0, 240)}`);
      assert.equal(r.error?.code, "INVALID_INPUT", blob.slice(0, 240));
      assert.ok(String(r.error?.message).includes(b.key), `拒绝文案必须点名是哪个字段: ${blob.slice(0, 240)}`);
      assert.ok(Array.isArray(r.error?.next), "必须带 next 步骤");
    }
    // 正向对照：合法 token 不得被这道门误杀（把守卫改成恒抛会在这里红）
    const ok = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      modId: "examplemod",
      targetVersion: "1.20.4",
      neoforgeVersion: "20.4.237",
      dryRun: true,
    }));
    assert.equal(ok.ok, true, JSON.stringify(ok).slice(0, 240));
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
      neoforgeVersion: "20.4.237",
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
      neoforgeVersion: "20.4.237",
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

    const missingNeo = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      modId: "examplemod",
      dryRun: true,
    }));
    assert.equal(missingNeo.ok, false);
    assert.equal(missingNeo.error.code, "NEOFORGE_VERSION_REQUIRED");

    const initDefault = JSON.parse(await portProject({
      projectPath: root,
      action: "init_architectury",
      modId: "examplemod",
      neoforgeVersion: "20.4.237",
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

async function testArchitecturySettingsGradleFromKb() {
  const kbPath = join(REPO_ROOT, "data", "porting", "architectury-patterns.json");
  const kb = JSON.parse(readFileSync(kbPath, "utf8"));
  // 形状契约：读取端只认字符串数组（历史 bug：写成 { content: [...] } → Array.isArray 恒 false → KB 从未生效）
  assert.ok(Array.isArray(kb.settingsGradle), `KB settingsGradle 必须是数组，实际 ${JSON.stringify(kb.settingsGradle)?.slice(0, 60)}`);
  assert.ok(kb.settingsGradle.length >= 10, `KB settingsGradle 行数异常：${kb.settingsGradle.length}`);
  assert.ok(
    kb.settingsGradle.every((l) => typeof l === "string"),
    "KB settingsGradle 每行必须是字符串",
  );
  assert.equal(
    kb.settingsGradle.filter((l) => l.includes("${modId}")).length,
    1,
    "KB settingsGradle 必须只有一个 ${modId} 占位符",
  );
  const marker = kb.settingsGradle[0];
  assert.ok(marker.startsWith("//"), `KB 首行必须是指向来源的注释行（fallback 靠它区分）：${marker}`);

  const root = mkdtempSync(join(tmpdir(), "mc-skill-arch-kb-"));
  const prevData = process.env.MC_SKILL_DATA;
  const render = (lines) => lines.map((l) => l.split("${modId}").join("kbtest"));
  try {
    const call = async () =>
      JSON.parse(await portProject({
        projectPath: root,
        action: "init_architectury",
        modId: "kbtest",
        neoforgeVersion: "20.4.237",
        targetVersion: "1.20.4",
        dryRun: true,
      }));

    const fromKb = (await call()).diffPreview["settings.gradle"].split("\n");
    assert.deepEqual(
      fromKb,
      render(kb.settingsGradle),
      "settings.gradle 必须逐行等于 KB 模板（${modId} 已替换）——不等说明读取端又用回了 fallback",
    );
    assert.ok(fromKb.includes("rootProject.name = 'kbtest-multiloader'"), JSON.stringify(fromKb));
    assert.ok(!fromKb.some((l) => l.includes("${modId}")), "占位符必须被替换干净");

    const emptyData = mkdtempSync(join(tmpdir(), "mc-skill-arch-kb-miss-"));
    process.env.MC_SKILL_DATA = emptyData;
    try {
      const fromFallback = (await call()).diffPreview["settings.gradle"].split("\n");
      assert.ok(!fromFallback.includes(marker), `KB 缺失时必须退回 fallback（仍含 KB 标记行 = 断言在测空气）`);
      assert.deepEqual(
        fromFallback.filter((l) => l.trim() && !l.startsWith("//")),
        render(kb.settingsGradle.filter((l) => l.trim() && !l.startsWith("//"))),
        "fallback 正文必须与 KB 正文一致（只允许差 KB 的溯源注释行）",
      );
      rmSync(emptyData, { recursive: true, force: true });
    } finally {
      if (prevData === undefined) delete process.env.MC_SKILL_DATA;
      else process.env.MC_SKILL_DATA = prevData;
    }
  } finally {
    if (prevData === undefined) delete process.env.MC_SKILL_DATA;
    else process.env.MC_SKILL_DATA = prevData;
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
      neoforgeVersion: "20.4.237",
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
  const bodyHit = await searchCommunityDocs({ query: "发表模组篇", limit: 50 });
  assert.ok(
    bodyHit.results.some((r) => r.id === "mcmod-3993/crash-publishing"),
    "permitted crash-publishing must be findable by chapter name via index summary",
  );
  const titleHit = await searchCommunityDocs({ query: "如何制作并且维护", limit: 50 });
  assert.ok(
    titleHit.results.filter((r) => r.id.startsWith("mcmod-3993/")).length >= 4,
    "all four permitted pages should be findable by guide title via index summary",
  );
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
  {
    // trie 只存小写段键，曾在返回层把 suggestions 大小写毁掉（Blaze3D → blaze3d）。
    // 只断言「每条 suggestion 原样存在于 class-names.json」，不钉死返回了哪 5 个类。
    // 别改成「把 suggestion 再查一遍断言 found:true」：毁掉的名字会经线性兜底自动纠正，那样是空门禁。
    // 背景与维护注意见 docs/query-api-classname-case.md。
    const moj = await queryApi({ className: "com.mojang", version: "1.20.4" });
    assert.equal(moj.found, false, "broad prefix com.mojang must not exact-match");
    const suggested = (moj.suggestions ?? [])
      .map((s) => s.match(/^你指的是 (.+) 吗？$/)?.[1])
      .filter(Boolean);
    assert.ok(
      suggested.length > 0,
      `com.mojang must return suggestions, got ${JSON.stringify(moj.suggestions)}`,
    );
    const knownNames = new Set(
      JSON.parse(
        readFileSync(resolveDataDir("forge_1.20.4", "extracted", "class-names.json"), "utf8"),
      ),
    );
    for (const fqcn of suggested) {
      assert.ok(
        knownNames.has(fqcn.replace(/\./g, "/")),
        `suggestion must preserve class-names.json case verbatim, got: ${fqcn}`,
      );
    }
  }
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

// S6：gradle.properties 值里的行内注释必须剥掉，但无前置空白的 #（URL 片段）不能当注释
function testGradlePropertiesInlineComment() {
  const props = parseGradleProperties(
    [
      "# 顶部注释",
      "a=1 # 行内注释",
      "url=https://example.com/#frag",
      "mod_id = demo_mod   # 与 mods.toml 保持一致",
      "empty=",
    ].join("\n"),
  );
  assert.equal(props.a, "1");
  assert.equal(props.mod_id, "demo_mod");
  assert.equal(props.url, "https://example.com/#frag");
  assert.equal(props.empty, "");

  const modsToml = 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="demo_mod"\n';
  const buildGradle = "plugins { id 'net.minecraftforge.gradle' version '[6.0,7.0)' }\n";
  const same = validateProject({
    modsToml,
    buildGradle,
    gradleProperties: "mod_id=demo_mod # 与 mods.toml 一致\n",
  });
  assert.ok(
    !same.warnings.some((w) => /gradle\.properties 中 mod_id/.test(w)),
    `行内注释被当成 mod_id 的一部分：${same.warnings.join(" | ")}`,
  );

  // 正控：真的不一致时仍必须报出来（防止这条检查被整段删掉也「通过」）
  const diff = validateProject({
    modsToml,
    buildGradle,
    gradleProperties: "mod_id=other_mod # 真不一致\n",
  });
  assert.ok(
    diff.warnings.some((w) => /gradle\.properties 中 mod_id='other_mod'/.test(w)),
    `真不一致未报警：${diff.warnings.join(" | ")}`,
  );
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

/**
 * B-26 回归：宽松兜底模式 `mods.toml|ModFileLocator|mod…loading…failed` 在 KNOWN_PATTERNS 里
 * 排在具名版本范围模式之前，旧实现「首命中即 return」→ 加载期版本冲突被误报成
 * 「mods.toml 配置错误导致 mod 加载失败」。现在按 specificity 仲裁。
 * 两条腿缺一不可：只测第一条无法证明日志真的同时命中两条模式（空断言）。
 */
function testCrashPatternSpecificity() {
  const VERSION_LINE = "Caused by: net.minecraftforge.fml.ModLoadingException: Incompatible mods found!\n";
  const lines = [
    "---- Minecraft Crash Report ----",
    "Description: Mod loading error has occurred",
    "",
    "java.lang.Exception: Mod Loading has failed",
    "\tat net.minecraftforge.fml.CrashReportExtender.dumpModLoadingCrashReport(CrashReportExtender.java:73)",
    VERSION_LINE,
    "\tMod file: /mods/some_mod-1.4.0.jar",
    "\tDependency declared in mods.toml (some_mod)",
    "",
    "System Details:",
    "\tMinecraft Version: 1.20.1",
  ];
  const report = lines.join("\n");

  const both = analyzeCrash({ crashReport: report, version: "1.20.1" });
  assert.equal(both.probableCause, "模组或 loader 版本范围不兼容", `精确版本指纹未胜出：${both.probableCause}`);

  // 删掉唯一那条具名指纹：宽松兜底必须仍然接住，否则上面的日志根本没命中兜底模式（断言测空气）
  const broadOnly = analyzeCrash({ crashReport: report.replace(VERSION_LINE, ""), version: "1.20.1" });
  assert.equal(broadOnly.probableCause, "mods.toml 配置错误导致 mod 加载失败", `兜底模式未生效（用例日志没命中宽松模式？）：${broadOnly.probableCause}`);
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

    // S3：校验失败不得记成「已验证」。同一实例反复调用必须仍抛 MISSING，
    // 不能漏到 resolveVersionDir 变成 VERSION_NOT_FOUND / INTERNAL_ERROR
    const neoStore = new NeoForgeDocStore(empty);
    for (const [label, call] of [
      ["getAvailableVersions 首次", () => neoStore.getAvailableVersions()],
      ["searchIndex", () => neoStore.searchIndex("Registry", "1.21.1")],
      ["getAvailableVersions 二次", () => neoStore.getAvailableVersions()],
      ["loadSummary", () => neoStore.loadSummary("some-page", "1.21.1")],
    ]) {
      assert.throws(
        call,
        (e) => e instanceof PlatformDataMissingError && e.platform === "neoforge",
        `neoforge ${label} 应抛 PlatformDataMissingError`,
      );
    }

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
  // 歧义 mods.toml（[47,) 同覆盖 Forge 1.20.1 / NeoForge 20.1）+ 残留 fabric.json：
  // 不得因为「有个残留 fabric 文件」就拍板成 forge，也不得判成 fabric → unknown（PICK_PLATFORM）。
  assert.equal(
    detectLoader("", 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n', leftoverFab),
    "unknown",
    "残留 fabric.mod.json 不得把歧义 javafml mods.toml 变成确定 forge",
  );
  // 同一 toml 有无残留 fabric.json 必须同判（一致性：残留文件不该改变 Forge/Neo 判定）
  assert.equal(
    detectLoader("", 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n', leftoverFab),
    detectLoader("", 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n'),
    "有无残留 fabric.mod.json 不得影响 Forge/Neo 判定",
  );
  // 明确 forge 依赖时，残留 fabric.mod.json 仍不得压过 Forge 元数据（原断言的意图保留）
  assert.equal(
    detectLoader(
      "",
      'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n[[dependencies.examplemod]]\nmodId="forge"\n',
      leftoverFab,
    ),
    "forge",
    "残留 fabric.mod.json 不得压过明确 javafml mods.toml",
  );
  // 旧实现 unknown→forge 早退，永远碰不到 :273；修后 fabric-loom 强信号必须可达
  assert.equal(
    detectLoader("id 'fabric-loom'", 'modLoader="javafml"\n[[mods]]\nmodId="demo"\n', leftoverFab),
    "fabric",
    "仅裸 javafml 的残留 mods.toml 不得压过 fabric-loom",
  );
  // S9：判定链与根 AGENTS.md 顺序表逐条对齐（失效加载器的残留不得压过在场加载器；歧义不拍板）
  const s9AmbiguousToml = 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n';
  const s9LoaderVerOnlyToml = 'loaderVersion="[14,)"\n[[mods]]\nmodId="demo"\n';
  const s9RiftGradle = "apply plugin: 'net.minecraftforge.gradle.tweaker-client'\n";
  for (const [desc, gradle, modsToml, fabricJson, neoToml, extras, want] of [
    [
      "残留 fabric.mod.json + 歧义 loaderVersion [47,) → unknown（不得因为有个残留文件就拍板）",
      "", s9AmbiguousToml, leftoverFab, undefined, undefined, "unknown",
    ],
    [
      "riftmod.json + litemod.json 同时存在 → rift（LiteLoader 残留不得压过 Rift 在场证据）",
      "", undefined, undefined, undefined,
      { riftmodJson: '{"id":"example"}', litemodJson: '{"name":"legacy"}' }, "rift",
    ],
    [
      "tweaker-client + javafml mods.toml + litemod.json → rift（Rift 先于纯 LiteLoader / 并存 unknown）",
      s9RiftGradle, 'modLoader="javafml"\n[[mods]]\nmodId="demo"\n', undefined, undefined,
      { litemodJson: '{"name":"legacy"}' }, "rift",
    ],
    [
      "riftmod.json + liteloader 专用插件 → liteloader_forge（显式插件是构建期硬证据，优先于 rift json）",
      "apply plugin: 'net.minecraftforge.gradle.liteloader'", 'modLoader="javafml"', undefined, undefined,
      { riftmodJson: '{"id":"example"}', litemodJson: '{"name":"x"}' }, "liteloader_forge",
    ],
    [
      "litemod.json + fabric-loom → fabric（无残留 fabric.mod.json 时 Loom 仍是强信号）",
      "id 'fabric-loom'", undefined, undefined, undefined,
      { litemodJson: '{"name":"legacy"}' }, "fabric",
    ],
    [
      "仅 loaderVersion 的 mods.toml 也是 FML 元数据：hasForgeMeta 复用 classifyJavaFmlToml，不另写正则",
      "", s9LoaderVerOnlyToml, undefined, undefined,
      { litemodJson: '{"name":"legacy"}' }, "unknown",
    ],
  ]) {
    assert.equal(detectLoader(gradle, modsToml, fabricJson, neoToml, extras), want, desc);
  }
  // S9 延伸（工具面取证驱动）：detect.ts 的 multiLoader 门排在 primary 之前，
  // primary 已决断时残留元数据再进 loaders[] 就会把判定链架空成 PICK_PLATFORM。
  // tweaker-client 只是名字带 net.minecraftforge.gradle，不是 ForgeGradle 证据（无 litemod 残留时单独验）
  const riftNoLite = detectProjectLoaders({
    buildGradle: "apply plugin: 'net.minecraftforge.gradle.tweaker-client'",
    extras: { riftmodJson: '{"id":"example"}' },
  });
  assert.equal(
    riftNoLite.loaders.includes("forge"),
    false,
    JSON.stringify(riftNoLite.loaders),
  );
  const riftResidual = detectProjectLoaders({
    buildGradle: "apply plugin: 'net.minecraftforge.gradle.tweaker-client'",
    extras: { riftmodJson: '{"id":"example"}', litemodJson: '{"name":"legacy"}' },
  });
  assert.equal(riftResidual.primary, "rift");
  assert.deepEqual(riftResidual.loaders, ["rift"], JSON.stringify(riftResidual.loaders));
  assert.equal(
    riftResidual.multiLoader,
    false,
    "Rift 在场 + LiteLoader 残留不得判成多加载器（tweaker-client 也不是 ForgeGradle）",
  );
  // 真·冲突仍然问用户：riftmod.json + 明确 forge 依赖的 mods.toml
  const riftVsForge = detectProjectLoaders({
    buildGradle: "",
    modsToml:
      'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="demo"\n[[dependencies.demo]]\nmodId="forge"\n',
    extras: { riftmodJson: '{"id":"example"}' },
  });
  assert.equal(riftVsForge.multiLoader, true, JSON.stringify(riftVsForge.loaders));
  assert.ok(riftVsForge.loaders.includes("rift") && riftVsForge.loaders.includes("forge"));
  // 纯 Forge 工程不受影响
  const plainForge = detectProjectLoaders({
    buildGradle: "plugins { id 'net.minecraftforge.gradle' }",
    modsToml: 'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="demo"\n[[dependencies.demo]]\nmodId="forge"\n',
  });
  assert.equal(plainForge.multiLoader, false, JSON.stringify(plainForge.loaders));
  const llOnlyLoaders = detectProjectLoaders({
    buildGradle: "apply plugin: 'net.minecraftforge.gradle.liteloader'",
    modsToml: 'modLoader="javafml"\n[[mods]]\nmodId="demo"',
    extras: { litemodJson: '{"name":"x"}' },
  });
  assert.equal(llOnlyLoaders.primary, "liteloader_forge");
  assert.ok(llOnlyLoaders.loaders.includes("liteloader_forge"));
  assert.equal(llOnlyLoaders.loaders.includes("liteloader"), false, JSON.stringify(llOnlyLoaders.loaders));
  // D-2：hybrid 的 mods.toml / net.minecraftforge 导入不得再双加成 "forge"——
  // 只断言 primary 会让「loaders=[forge,liteloader_forge] + multiLoader=true」蒙过这条测试。
  assert.deepEqual(llOnlyLoaders.loaders, ["liteloader_forge"], JSON.stringify(llOnlyLoaders.loaders));
  assert.equal(llOnlyLoaders.multiLoader, false, JSON.stringify(llOnlyLoaders.loaders));
  const llFabLoaders = detectProjectLoaders({
    buildGradle: "apply plugin: 'net.minecraftforge.gradle.liteloader'",
    modsToml: 'modLoader="javafml"\n[[mods]]\nmodId="demo"',
    fabricModJson: leftoverFab,
    extras: { litemodJson: '{"name":"x"}' },
  });
  assert.equal(llFabLoaders.primary, "liteloader_forge");
  assert.ok(llFabLoaders.loaders.includes("liteloader_forge"));
  assert.equal(llFabLoaders.loaders.includes("liteloader"), false, JSON.stringify(llFabLoaders.loaders));
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

  // S4：capabilities 白名单必须跟着本仓缓存的官方页走，不能各自漂移
  {
    const pagePath = join(
      REPO_ROOT,
      "data",
      "bedrock_stable",
      "bedrock-docs",
      "stable",
      "processed",
      "pack-manifest.md",
    );
    const capsFromPage = docTableRowNames(readFileSync(pagePath, "utf8"), "capabilities");
    assert.ok(capsFromPage.length >= 5, `官方页 capabilities 解析异常：${JSON.stringify(capsFromPage)}`);
    assert.deepEqual(
      [...BEDROCK_CAPABILITIES].sort(),
      [...capsFromPage].sort(),
      "BEDROCK_CAPABILITIES 与官方 pack-manifest capabilities 表不一致",
    );
    assert.ok(!capsFromPage.includes("script_eval"), "官方页已列出 script_eval → 需同步白名单与规则 01");

    const manifest = (caps) => JSON.stringify({
      format_version: 2,
      header: { name: "x", uuid: "00000000-0000-0000-0000-000000000000", version: [1, 0, 0] },
      modules: [{ type: "data", uuid: "11111111-1111-1111-1111-111111111111", version: [1, 0, 0] }],
      capabilities: caps,
    });
    const known = validateAddonManifest(manifest(["editorExtension", "experimental_custom_ui"]));
    assert.equal(known.ok, true, JSON.stringify(known.errors));
    assert.ok(
      !known.warnings.some((w) => /未知 capability/.test(w)),
      JSON.stringify(known.warnings),
    );
    const unknown = validateAddonManifest(manifest(["script_eval"]));
    assert.ok(
      unknown.warnings.some((w) => /未知 capability「script_eval」/.test(w)),
      JSON.stringify(unknown.warnings),
    );
    // 生成器吐 script_eval 时必须自带同一口径的「官方表未列」提示
    const genEval = generateAddonManifest({ packName: "EvalPack", packType: "data", scriptEval: true });
    assert.ok(
      genEval.warnings.some((w) => /script_eval 不在官方/.test(w)),
      JSON.stringify(genEval.warnings),
    );
  }

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
    "unknown",
    "loaderVersion [47,) 单独不能区分 Forge 1.20.1 与 NeoForge 1.20.1",
  );
  assert.equal(
    detectLoader(
      "",
      'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n[[dependencies.examplemod]]\nmodId="forge"\n',
    ),
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
    closeSemanticStatusDbs(); // A-38：LRU 会持有只读句柄，Windows 上不先释放就删不掉临时目录
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
    // routeSteps 公开契约 = string[]。旧断言写成 `typeof s === "string" ? s : s?.text ?? ""`
    // 双形态兜底，正是让「改成对象数组」这次契约破坏无声通过的原因。现在必须逐元素是字符串。
    assert.ok(Array.isArray(q.analysis.routeSteps), "routeSteps 必须是数组");
    assert.ok(
      q.analysis.routeSteps.every((s) => typeof s === "string"),
      `routeSteps 契约是 string[]，实际：${JSON.stringify(q.analysis.routeSteps)}`,
    );
    assert.ok(
      !q.analysis.routeSteps.some((s) => /init_architectury/.test(s)),
      JSON.stringify(q.analysis.routeSteps),
    );
    assert.equal(
      q.analysis.nextSteps.length,
      q.analysis.routeSteps.length,
      "nextSteps 必须与 routeSteps 一一对应",
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
    // targetPlatform 必填后，基岩包也要带着目标来问；UNSUPPORTED_PORT 消息同时点名两端
    const noTarget = JSON.parse(await analyzePortingPath({ projectPath: bpRoot }));
    assert.equal(noTarget.ok, false, JSON.stringify(noTarget));
    assert.equal(noTarget.error.code, "INVALID_INPUT");
    const bp = JSON.parse(await analyzePortingPath({ projectPath: bpRoot, targetPlatform: "fabric" }));
    assert.equal(bp.ok, false, JSON.stringify(bp));
    assert.equal(bp.error.code, "UNSUPPORTED_PORT");
    assert.match(String(bp.error.message), /bedrock/i);
    assert.match(String(bp.error.message), /fabric/, "消息应点名目标端");
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
    buildGradle: "plugins { id 'net.minecraftforge.gradle' }\n",
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
    buildGradle: "plugins { id 'net.minecraftforge.gradle' }\n",
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
    assert.notEqual(typeof pf.packFormat, "function", `pack_format(${k}) must not resolve to Function`);
    assert.ok(pf.packFormat === null || typeof pf.packFormat === "number", `pack_format(${k}) must be number|null`);
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

  const v165be = await getVersionInfo({ version: "1.16.5", action: "blockentity", platform: "forge" });
  assert.match(v165be.recommendation, /ITileEntityProvider/);
  assert.match(v165be.recommendation, /不要使用 EntityBlock/);
  const v132be = await getVersionInfo({ version: "1.13.2", action: "blockentity", platform: "forge" });
  assert.match(v132be.recommendation, /ITileEntityProvider/);
  assert.match(v132be.recommendation, /不要使用 EntityBlock/);

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
  assert.equal(isMcVersionFamily("26.1.2", "26.1"), true);
  assert.equal(isMcVersionFamily("26.12", "26.1"), false);
  assert.equal(isMcVersionFamily("1.21.11", "1.21"), true);

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
  assert.equal(classifyMinecraftVersion("1.20"), "1.20.x");
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
    buildGradle: "plugins { id 'net.minecraftforge.gradle' }\n",
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
    buildGradle: "plugins { id 'net.minecraftforge.gradle' }\n",
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

  // N-1 + N-11：Fabric recipe 骨架两条正交轴都必须对。
  // ① 映射轴：只发 Mojmap 单一映射（`generate(RecipeExporter)` 是同一方法的 Yarn 名，非版本差异）。
  // ② 层数轴（真版本差异）：1.21.1 单层带参 `buildRecipes(RecipeOutput)`；1.21.3+ 两层
  //   `createRecipeProvider(HolderLookup.Provider, RecipeOutput)` → 匿名 vanilla RecipeProvider 的无参 `buildRecipes()`。
  //   判据：Mojang 官方 client.txt（piston-meta client_mappings）逐版实测 + loader-api-summaries 抽象方法签名
  //   + fabric/1.21.11/.cursor/rules/07-datagen.mdc:155-159。
  const fabOneLayer = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "1.21.1",
  });
  assert.ok(fabOneLayer.code?.includes("void buildRecipes(RecipeOutput"), fabOneLayer.code?.slice(0, 500));
  assert.ok(!/createRecipeProvider\(/.test(fabOneLayer.code || ""), "N-11 1.21.1 必须仍是单层，不得提前两层化");
  assert.ok(!/RecipeExporter|RegistryWrapper|offerTo\(/.test(fabOneLayer.code || ""), "N-1 1.21.1 骨架禁止出现 Yarn 名");
  assert.ok(
    fabOneLayer.warnings?.some((w) => /RecipeExporter/.test(w) && /Yarn/.test(w)),
    JSON.stringify(fabOneLayer.warnings),
  );
  assert.ok(
    fabOneLayer.warnings?.some((w) => /单层/.test(w) && /1\.21\.3/.test(w)),
    `1.21.1 必须说明本档单层、1.21.3 起两层：${JSON.stringify(fabOneLayer.warnings)}`,
  );

  for (const ver of ["1.21.3", "1.21.4", "1.21.8", "1.21.10", "1.21.11"]) {
    const out = generateDatagen({
      providerType: "recipe",
      modId: "demo",
      targetName: "x",
      platform: "fabric",
      version: ver,
    });
    const snippet = out.code?.slice(0, 700) ?? String(out.errors?.join(";"));
    assert.ok(out.code?.includes("createRecipeProvider(HolderLookup.Provider registryLookup, RecipeOutput exporter)"), `${ver}: ${snippet}`);
    assert.ok(out.code?.includes("new RecipeProvider(registryLookup, exporter)"), `${ver}: ${snippet}`);
    assert.ok(out.code?.includes("public void buildRecipes() {"), `${ver}: ${snippet}`);
    assert.ok(out.code?.includes('save(output, "demo:x")'), `${ver}: ${snippet}`);
    assert.ok(out.code?.includes("import net.minecraft.data.recipes.RecipeProvider;"), `${ver}: ${snippet}`);
    assert.ok(
      !/buildRecipes\(\s*RecipeOutput/.test(out.code || ""),
      `N-11 ${ver} 禁止单层带参 override（该方法 1.21.3 起不存在，编译器直接拒）`,
    );
    assert.ok(!/RecipeExporter|RegistryWrapper|offerTo\(/.test(out.code || ""), `${ver} 骨架禁止混映射`);
  }

  const fab261Recipe = generateDatagen({
    providerType: "recipe",
    modId: "demo",
    targetName: "x",
    platform: "fabric",
    version: "26.1.2",
  });
  assert.ok(
    fab261Recipe.code?.includes("createRecipeProvider(") && fab261Recipe.code?.includes("void buildRecipes()"),
    fab261Recipe.code?.slice(0, 600),
  );
  assert.ok(!/RecipeExporter|RegistryWrapper|offerTo\(/.test(fab261Recipe.code || ""), "26.1 两层 Mojmap 骨架禁止 Yarn 名");

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
  assert.ok(neo1204.code?.includes("RecipeProvider::new"), neo1204.code?.slice(0, 800));
  assert.ok(!/CompletableFuture/.test(neo1204.code || ""), "1.20.4 neo must not copy 1.21 two-arg ctor");

  const neo215model = generateDatagen({
    providerType: "itemmodel",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "1.21.5",
  });
  assert.ok(
    neo215model.code?.includes("registerModels(BlockModelGenerators blockModels, ItemModelGenerators itemModels)"),
    neo215model.code?.slice(0, 800),
  );
  const neo261model = generateDatagen({
    providerType: "itemmodel",
    modId: "demo",
    targetName: "x",
    platform: "neoforge",
    version: "26.1",
  });
  assert.ok(
    neo261model.code?.includes("registerModels(BlockModelGenerators blockModels, ItemModelGenerators itemModels)"),
    neo261model.code?.slice(0, 800),
  );

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
  assert.ok(!/ManaData/.test(capNeo1204.code || ""), capNeo1204.code);
  assert.ok(capNeo1204.code?.includes("AttachmentType<Object>"), capNeo1204.code);

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

  // D-4=A：library 是 opt-in，默认 cloth（上面 cfgFab 未传 library 即现状证明）。
  const cfgYacl = generateConfig("my_mod", "fabric", "1.21.11", "yacl");
  assert.ok(cfgYacl.code?.includes("dev.isxander.yacl3"), cfgYacl.code?.slice(0, 300));
  assert.ok(!/clothconfig2/.test(cfgYacl.code || ""), "library=yacl 不得再吐 Cloth 骨架");
  assert.ok(!cfgFab.code?.includes("TODO(未核实)"), "默认 cloth 骨架不得被 yacl 未核实标记污染");
  // 未核实计数由骨架自身 TODO 条数推导，禁止写死数字。
  const yaclTodo = (cfgYacl.code.match(/TODO\(未核实\)/g) ?? []).length;
  assert.ok(yaclTodo > 0, "yacl 骨架必须保留未核实 TODO");
  assert.ok(
    cfgYacl.warnings?.some(
      (w) =>
        /YACL 为 opt-in、默认仍 Cloth/.test(w) &&
        w.includes(`本骨架 ${yaclTodo} 处签名未核实`) &&
        /ingest_loader_api/.test(w),
    ),
    JSON.stringify(cfgYacl.warnings),
  );
  // 编译前置义务必须在骨架头部可见（withDocsReviewHeader + 正文 note）。
  assert.match(cfgYacl.code || "", /^\/\/ 修改此骨架前必须用 query_loader_api\(version=1\.21\.11\) 复核/);
  assert.match(cfgYacl.code || "", /ingest_loader_api/);
  assert.ok(!/YetAnotherConfigLib\.create|ModMenuApi\s*\{|\.addCategory\(/.test(cfgYacl.code || ""), "禁止凭记忆补 YACL 方法链");

  const cfgQuiltYacl = generateConfig("my_mod", "quilt", "1.21.1", "yacl");
  assert.ok(cfgQuiltYacl.code?.includes("dev.isxander.yacl3"), cfgQuiltYacl.code?.slice(0, 200));
  assert.ok(cfgQuiltYacl.warnings?.some((w) => /QSL/.test(w)), JSON.stringify(cfgQuiltYacl.warnings));
  const cfgQuilt = generateConfig("my_mod", "quilt", "1.21.1");
  assert.ok(cfgQuilt.code?.includes("clothconfig2"), cfgQuilt.code?.slice(0, 200));

  // forge/neoforge 不受 library 影响（opt-in 仅 fabric/quilt 生效）
  const cfgForgeYacl = generateConfig("my_mod", "forge", "1.20.1", "yacl");
  assert.ok(cfgForgeYacl.code?.includes("ForgeConfigSpec"), cfgForgeYacl.code?.slice(0, 200));
  assert.ok(!/dev\.isxander/.test(cfgForgeYacl.code || ""));

  const rendOk = generateEntityRenderer("my_mod", "slime", "forge", "1.20.1");
  assert.ok(rendOk.code?.includes("@OnlyIn"), rendOk.code);
  assert.ok(rendOk.code?.includes("package com.example"), rendOk.code);
  assert.ok(rendOk.code?.includes("getTextureLocation"), rendOk.code);
  assert.ok(!/extends MobRenderer/.test(rendOk.code || ""), rendOk.code);
  assert.ok(!/new \w+Model\(/.test(rendOk.code || ""), rendOk.code);
  assert.ok(!rendOk.code?.includes("fromNamespaceAndPath"), rendOk.code);

  // S2：骨架引用的每个类型首段必须可解析（import 或本文件声明），否则吐出的代码编译不过
  for (const [label, code] of [["neoforge 26.1", rend261.code], ["forge 1.20.1", rendOk.code]]) {
    assert.ok(/^package\s+com\.example\.\w+\.client;/m.test(code || ""), `${label}: 缺 package 声明`);
    const imported = [...(code || "").matchAll(/^import\s+([\w.]+);$/gm)].map((m) => m[1].split(".").pop());
    const declared = [...(code || "").matchAll(/\bclass\s+(\w+)/g)].map((m) => m[1]);
    const refs = new Set();
    for (const m of (code || "").matchAll(/extends\s+([\w.]+)/g)) refs.add(m[1]);
    for (const m of (code || "").matchAll(/<([\w.]+)>/g)) refs.add(m[1]);
    for (const m of (code || "").matchAll(/\(\s*([\w.]+)\s+\w+\s*\)/g)) refs.add(m[1]);
    for (const ref of refs) {
      const head = ref.split(".")[0];
      assert.ok(imported.includes(head) || declared.includes(head), `${label}: 引用类型 ${ref} 无 import 也无同文件声明`);
    }
    assert.ok((code || "").includes("import com.example.my_mod.entity.Slime;"), `${label}: 实体类未 import`);
  }

  const pkt1204 = generateNetworkPacket("demo", "sync", "neoforge_1.20.4");
  assert.ok(pkt1204.code?.includes("@SubscribeEvent"), pkt1204.code);
  assert.ok(pkt1204.code?.includes("import net.neoforged.bus.api.SubscribeEvent"), pkt1204.code);

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

  // C-13：非法版本 token 必须在 switch(kind) 之前早退。旧行为是 valid:true +
  // version:"1.21beta" 原样回显，调用方会以为真按该版本校验过。
  const badToken = validateDatapackJson({ kind: "recipe", jsonContent: "{}", version: "1.21beta" });
  assert.equal(badToken.valid, false, JSON.stringify(badToken));
  assert.equal(badToken.version, "", `非法版本不得回显原串: ${JSON.stringify(badToken)}`);
  assert.equal(badToken.action?.code, "INVALID_INPUT", JSON.stringify(badToken));
  assert.ok(/1\.21beta/.test(String(badToken.errors?.[0])), "错误行必须点名被拒的版本串");
  assert.equal(special.version, "1.20.1", "正向对照：合法 token 仍要原样回显并正常走完");

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

// ── #10 基岩误判 ───────────────────────────────────────────────────────────
// Java 源码里出现 "format_version" / "modules" 这两个带引号的字符串常量，
// 会被误判成基岩 add-on。javaBlob 只由 collectJavaSources 产出（恒为
// src/main/java/**.java），永远不含基岩 manifest；真基岩也没有 Java 源码。
// 故该启发式只可能产生误报，基岩应走 extras.addonManifest（真实 manifest.json）。
function testBedrockMisdetectionFixed() {
  const javaWithKeys = [
    {
      path: "src/main/java/com/example/MyMod.java",
      content: [
        "package com.example;",
        "public class MyMod {",
        '    public static final String FORMAT_VERSION_KEY = "format_version";',
        '    public static final String MODULES_KEY = "modules";',
        "}",
      ].join("\n"),
    },
  ];
  const forgeGradle = [
    "buildscript { repositories { maven { url = 'https://maven.minecraftforge.net/' } } }",
    "apply plugin: 'net.minecraftforge.gradle'",
  ].join("\n");

  // 1) 有 Forge build.gradle：不得被 Java 里的常量污染
  assert.equal(
    detectProjectLoaders({ buildGradle: forgeGradle, javaBlob: javaBlobFromFiles(javaWithKeys) }).primary,
    "forge",
    "Forge 工程不得因 Java 字符串常量被判为基岩",
  );

  // 2) 无任何可识别元数据：也不得回落成基岩（这是 reinforceLoaderWithJava 的路径）
  assert.notEqual(
    detectProjectLoaders({ javaBlob: javaBlobFromFiles(javaWithKeys) }).primary,
    "bedrock",
    "javaBlob 不得作为基岩判定依据",
  );

  // 3) validateProject 端到端同样不得误判
  const r = validateProject({ javaFiles: javaWithKeys, buildGradle: forgeGradle });
  assert.notEqual(r.status, "failed", `validate_project 不应失败: ${JSON.stringify(r.errors)}`);

  // 4) 阳性对照：真实 manifest.json 仍必须能识别为基岩（防止矫枉过正）
  const realManifest = JSON.stringify({
    format_version: 2,
    header: { name: "pack", description: "d", min_engine_version: [1, 21, 0], uuid: "u1", version: [1, 0, 0] },
    modules: [{ type: "data", uuid: "u2", version: [1, 0, 0] }],
  });
  assert.equal(
    detectProjectLoaders({ extras: { addonManifest: realManifest } }).primary,
    "bedrock",
    "真实 manifest.json 必须仍被识别为基岩",
  );

  // 5) 阳性对照：manifest 内容缺 modules 时不得判基岩（形状校验生效）
  const noModules = JSON.stringify({ format_version: 2 });
  assert.notEqual(
    detectProjectLoaders({ extras: { addonManifest: noModules } }).primary,
    "bedrock",
    "缺少 modules 的 manifest 不得判为基岩",
  );
}

async function testW2MappingDocsFixes() {
  assert.equal(VERSION_SEGMENT_RE.test("1.20.1"), true);
  assert.equal(isSafeVersionSegment("1.20.1"), true);
  assert.equal(isSafeVersionSegment("..\\..\\evil"), false);
  assert.equal(isSafeVersionSegment("../../evil"), false);
  // A-39：非法版本段不得先撞上 _pathCache（先校验、后查缓存）
  const ysPath = new URL("./dist/mappings/yarn-sqlite.js", import.meta.url);
  const ysSrc = readFileSync(ysPath, "utf8");
  const body = ysSrc.slice(ysSrc.indexOf("function resolveMappingDbPath"));
  const guardAt = body.indexOf("isSafeVersionSegment(v)");
  const cacheAt = body.indexOf("_pathCache.has(v)");
  assert.ok(guardAt >= 0 && cacheAt >= 0, "resolveMappingDbPath 结构变了，A-39 门需同步更新");
  assert.ok(guardAt < cacheAt, "A-39：_pathCache 查询不得先于 isSafeVersionSegment 校验");
  // 同族第二处：_csvPathCache 也必须在校验之后才读（否则非法段可污染缓存 key）
  const csvBody = ysSrc.slice(ysSrc.indexOf("function resolveCsvMappingDbPath"));
  const csvGuardAt = csvBody.indexOf("isSafeVersionSegment(v)");
  const csvCacheAt = csvBody.indexOf("_csvPathCache.has(v)");
  assert.ok(csvGuardAt >= 0 && csvCacheAt >= 0, "resolveCsvMappingDbPath 结构变了，A-39 门需同步更新");
  assert.ok(csvGuardAt < csvCacheAt, "A-39：_csvPathCache 查询不得先于 isSafeVersionSegment 校验");
  assert.equal(resolveCsvMappingDbPath(".."), null, "`..` 版本不得解析出 CSV 库");
  assert.equal(resolveMappingDbPath(".."), null, "`..` 版本必须无库可解析");
  assert.equal(resolveMappingDbPath("../../evil"), null);
  assert.equal(resolveMappingDbPath("fabric_../x"), null);
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
  const neoRelHits = neoRel.results ?? neoRel.related ?? [];
  assert.ok(
    !neoRelHits.some((r) => r.id === "concepts/registries" || r.id === neoRel.id),
    JSON.stringify(neoRelHits.map((r) => r.id)).slice(0, 400),
  );

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

// ── R4/R6：analyze_porting_path 交接必须真实可调用 ──────────────────────────
async function testPortingHandoffArgsAreCallable() {
  const { analyzePortingPathSchema, portProjectSchema } = await import("./dist/porting/types.js");
  const { getMigrationGuideSchema } = await import("./dist/wave/register.js");
  const { searchDocsSchema } = await import("./dist/docs-platform/forge/index.js");
  const schemas = {
    port_project: portProjectSchema,
    get_migration_guide: getMigrationGuideSchema,
    search_docs: searchDocsSchema.inputSchema ?? searchDocsSchema,
  };

  // R4：契约是「必填」，就必须在 schema 边界拒掉，别让调用方先吃一次运行时 INVALID_INPUT
  assert.equal(
    analyzePortingPathSchema.safeParse({ projectPath: "/tmp/x" }).success,
    false,
    "targetPlatform 缺失必须被 schema 拒绝（旧 schema 写 optional，与实际运行时契约相反）",
  );
  assert.equal(
    analyzePortingPathSchema.safeParse({ projectPath: "/tmp/x", targetPlatform: "neoforge" }).success,
    true,
  );

  const forgeGradle =
    "plugins { id 'net.minecraftforge.gradle' version '6.0.6' }\n" +
    "minecraft { mappings channel: 'official', version: '1.20.1' }\n";
  const forgeModsToml =
    'modLoader="javafml"\nloaderVersion="[47,)"\n[[mods]]\nmodId="examplemod"\n' +
    '[[dependencies.examplemod]]\nmodId="forge"\n';
  const fabricGradle = "plugins { id 'fabric-loom' version '1.6-SNAPSHOT' }\n";
  const fabricJson = JSON.stringify({ schemaVersion: 1, id: "fabmod", version: "1.0.0" });

  const cases = [
    { label: "forge→neoforge", files: { "build.gradle": forgeGradle, "src/main/resources/mods.toml": forgeModsToml }, args: { targetPlatform: "neoforge", targetVersion: "1.20.4" } },
    { label: "fabric→quilt", files: { "build.gradle": fabricGradle, "gradle.properties": "minecraft_version=1.20.1\n", "src/main/resources/fabric.mod.json": fabricJson }, args: { targetPlatform: "quilt", targetVersion: "1.21.1" } },
    { label: "fabric→neoforge(跨平台)", files: { "build.gradle": fabricGradle, "gradle.properties": "minecraft_version=1.20.1\n", "src/main/resources/fabric.mod.json": fabricJson }, args: { targetPlatform: "neoforge", targetVersion: "1.20.4" } },
  ];

  let actionableSteps = 0;
  for (const c of cases) {
    const root = mkdtempSync(join(tmpdir(), "mc-skill-handoff-"));
    try {
      for (const [p, content] of Object.entries(c.files)) {
        mkdirSync(join(root, dirname(p)), { recursive: true });
        writeFileSync(join(root, p), content, "utf8");
      }
      const out = JSON.parse(await analyzePortingPath({ projectPath: root, ...c.args }));
      assert.equal(out.ok, true, `${c.label}: ${JSON.stringify(out.error ?? out)}`);
      assert.ok(
        out.analysis.routeSteps.every((s) => typeof s === "string"),
        `${c.label}: routeSteps 契约是 string[] → ${JSON.stringify(out.analysis.routeSteps)}`,
      );
      assert.equal(
        out.analysis.nextSteps.length,
        out.analysis.routeSteps.length,
        `${c.label}: nextSteps 与 routeSteps 不平行`,
      );
      for (const ns of out.analysis.nextSteps) {
        if (!ns.tool) continue;
        actionableSteps += 1;
        const schema = schemas[ns.tool];
        assert.ok(schema, `${c.label}: nextSteps 引用未登记 schema 的工具 ${ns.tool}`);
        const parsed = schema.safeParse(ns.args);
        assert.equal(
          parsed.success,
          true,
          `${c.label}: ${ns.tool} 的 args 不可直接调用 → ${JSON.stringify(ns.args)} / ${JSON.stringify(parsed.error?.issues ?? parsed.error)}`,
        );
        for (const [k, v] of Object.entries(ns.args ?? {})) {
          assert.ok(
            !/^\s*(check|todo|tbd|n\/?a|null|<.*>|\{\{.*\}\})/i.test(String(v)),
            `${c.label}: ${ns.tool}.${k}=${JSON.stringify(v)} 是占位值，不是合法参数`,
          );
        }
      }
      // 每条路线都至少要有一个可执行交接（否则 nextSteps 形同不存在）
      assert.ok(
        out.analysis.nextSteps.some((ns) => ns.tool),
        `${c.label}: 没有任何可执行交接`,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
  assert.ok(actionableSteps >= 3, `可执行交接过少：${actionableSteps}`);
}

// ── S12：移植知识库 ↔ 本仓证据源（manifest / fabric meta / primer / 规则树）──
const PORTING_KB_REL = "data/porting/knowledge-base/versions.json";
const PRIMER_DIR_REL = "data/neoforge_primers";
const ZERO_WIDTH = String.fromCharCode(0x200b);

/** "data/x.json#versions['1.21.1'].field" → { ok, value?, why? } */
function kbResolvePointer(pointer) {
  const [file, frag] = String(pointer).split("#");
  const abs = join(REPO_ROOT, file);
  if (!existsSync(abs)) return { ok: false, why: `缺文件 ${file}` };
  let cur;
  try {
    cur = JSON.parse(readFileSync(abs, "utf8"));
  } catch (e) {
    return { ok: false, why: `${file} 不是合法 JSON: ${e.message}` };
  }
  if (!frag) return { ok: true, value: cur };
  const text = /^[.[]/.test(frag) ? frag : "." + frag;
  const tokens = [];
  const re = /\.([A-Za-z_$][\w$]*)|\['([^']+)'\]|\["([^"]+)"\]/g;
  let m;
  let last = 0;
  while ((m = re.exec(text))) {
    if (m.index !== last) return { ok: false, why: `指针写法非法 ${pointer}` };
    tokens.push(m[1] ?? m[2] ?? m[3]);
    last = m.index + m[0].length;
  }
  if (last !== text.length) return { ok: false, why: `指针尾部无法解析 ${pointer}` };
  for (let i = 0; i < tokens.length; i++) {
    if (cur === null || typeof cur !== "object" || !(tokens[i] in cur)) {
      return { ok: false, why: `${file}#${tokens.slice(0, i + 1).join(".")} 不存在` };
    }
    cur = cur[tokens[i]];
  }
  return { ok: true, value: cur };
}

function kbVersionNumber(key) {
  const m = /^(\d+)\.(\d+)(?:\.(\d+))?$/.exec(key);
  return m ? Number(m[1]) * 1e6 + Number(m[2]) * 1e3 + Number(m[3] ?? 0) : null;
}

/** 本仓 <platform>/<ver> 规则树目录 + 该树规则文件数（0 = draft 树） */
function kbRuleTreeDirs() {
  const out = [];
  for (const p of ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader"]) {
    const base = join(REPO_ROOT, p);
    if (!existsSync(base)) continue;
    for (const d of readdirSync(base)) {
      const abs = join(base, d);
      if (!statSync(abs).isDirectory() || kbVersionNumber(d) === null) continue;
      let rules = 0;
      for (const host of readdirSync(abs)) {
        const rulesDir = join(abs, host, "rules");
        if (!existsSync(rulesDir) || !statSync(rulesDir).isDirectory()) continue;
        rules += readdirSync(rulesDir).filter((f) => f.endsWith(".mdc") || f.endsWith(".md")).length;
      }
      out.push({ dir: `${p}/${d}`, version: d, rules });
    }
  }
  return out;
}

/** primer 正文：剥 U+200B 后取 '## ' 小节标题 + frontmatter to/from */
function kbPrimerInfo(relPath) {
  const raw = readFileSync(join(REPO_ROOT, relPath), "utf8").split(ZERO_WIDTH).join("");
  const strip = (s) => s.trim().replace(/^"|"$/g, "");
  return {
    headings: [...raw.matchAll(/^## (.+)$/gm)].map((x) => x[1].trim()),
    to: /^to:\s*(.+)$/m.exec(raw)?.[1] ? strip(/^to:\s*(.+)$/m.exec(raw)[1]) : null,
    from: /^from:\s*(.+)$/m.exec(raw)?.[1] ? strip(/^from:\s*(.+)$/m.exec(raw)[1]) : null,
  };
}

const KB_PIN_SOURCES = {
  forge: (k) => `data/forge-versions-manifest.json#versions['${k}'].forgeVersion`,
  neoforge: (k) => {
    // N-5：优先指向拆分后的显式字段（exactVersion = 精确钉值 / versionRange = .x 版本段），
    // 两者都缺才退回历史两义别名 neoforgeVersion，让漂移扫描盯住新字段而不是旧别名。
    const base = `data/neoforge-versions-manifest.json#versions['${k}']`;
    for (const f of ["exactVersion", "versionRange", "neoforgeVersion"]) {
      if (kbResolvePointer(`${base}.${f}`).ok) return `${base}.${f}`;
    }
    return `${base}.neoforgeVersion`;
  },
  fabric: (k) => `data/fabric_${k}/meta.json#loader.version`,
  java: (k) =>
    kbResolvePointer(`data/neoforge-versions-manifest.json#versions['${k}'].javaVersion`).ok
      ? `data/neoforge-versions-manifest.json#versions['${k}'].javaVersion`
      : `data/forge-versions-manifest.json#versions['${k}'].javaVersion`,
  mappings: (k) =>
    kbResolvePointer(`data/neoforge-versions-manifest.json#versions['${k}'].mappings`).ok
      ? `data/neoforge-versions-manifest.json#versions['${k}'].mappings`
      : `data/forge-versions-manifest.json#versions['${k}'].mappings`,
};

/** 证据指针：data/... 走 JSON 指针；src:javaForMcVersion 走代码值 */
function kbResolveSource(key, pointer) {
  if (pointer === "src:javaForMcVersion") return { ok: true, value: javaForMcVersion(key) ?? null };
  return kbResolvePointer(pointer);
}

async function testPortingKbProvenance() {
  const kb = JSON.parse(readFileSync(join(REPO_ROOT, PORTING_KB_REL), "utf8"));
  const keys = Object.keys(kb.versions);
  const meta = kb.meta ?? {};
  const legacyKeys = new Set(meta.legacyUntaggedKeys ?? []);
  const asSet = (arr) => new Set((arr ?? []).map(String));
  const sameSet = (a, b, label) => {
    const missing = [...a].filter((x) => !b.has(x));
    const stale = [...b].filter((x) => !a.has(x));
    assert.deepEqual(
      { label, 未登记: missing, 过期登记: stale },
      { label, 未登记: [], 过期登记: [] },
      "登记必须双向：新增缺口要登记，缺口已补上要删登记",
    );
  };

  // G1 形状：合法版本键、完整字段、按版本号升序、老键集合与登记一致
  assert.ok(keys.length >= 30, `KB 版本键数量退化：${keys.length}`);
  const sortedNums = keys.map(kbVersionNumber);
  assert.ok(sortedNums.every((n) => n !== null), `非法版本键：${keys.filter((k) => kbVersionNumber(k) === null)}`);
  assert.deepEqual(
    sortedNums,
    [...sortedNums].sort((a, b) => a - b),
    "versions 键必须按版本号升序（人读时才能一眼看出漏档）",
  );
  for (const k of keys) {
    const e = kb.versions[k];
    for (const f of ["forge", "neoforge", "fabric", "java", "mappings", "docSource", "breakingChanges"]) {
      assert.ok(f in e, `${k} 缺字段 ${f}`);
    }
    assert.ok(Array.isArray(e.mappings), `${k}.mappings 必须是数组`);
    assert.ok(Array.isArray(e.breakingChanges), `${k}.breakingChanges 必须是数组`);
  }
  const untagged = keys.filter((k) => !legacyKeys.has(k));
  assert.ok(
    untagged.every((k) => kb.versions[k].provenance === "verified"),
    `新条目必须 provenance=verified：${untagged.filter((k) => kb.versions[k].provenance !== "verified")}`,
  );
  assert.deepEqual(
    keys.filter((k) => kb.versions[k].provenance === undefined).sort(),
    [...legacyKeys].sort(),
    "老键集合与 meta.legacyUntaggedKeys 不一致（该清单只能缩小，不能扩张）",
  );
  assert.ok(
    [...legacyKeys].every((k) => kb.versions[k]),
    `meta.legacyUntaggedKeys 里有不存在的键：${[...legacyKeys].filter((k) => !kb.versions[k])}`,
  );

  // G2 正向：每个 KB 键要么有同名规则树，要么登记为已知缺口
  const trees = kbRuleTreeDirs();
  const treeVersions = new Set(trees.map((t) => t.version));
  sameSet(
    asSet(keys.filter((k) => !treeVersions.has(k))),
    asSet(Object.keys(meta.kbKeysWithoutRuleTree ?? {})),
    "KB 键无同名规则树",
  );
  for (const [k, why] of Object.entries(meta.kbKeysWithoutRuleTree ?? {})) {
    assert.ok(String(why).length > 10, `${k} 的缺口说明太短：${why}`);
  }

  // G3 反向：每棵规则树要么有 KB 键（26.x.y 折到 26.x），要么登记；0 规则树 == draft 登记
  const familyKey = (ver) => {
    if (kb.versions[ver]) return ver;
    const m = /^26\.(\d+)\.\d+$/.exec(ver);
    return m && kb.versions[`26.${m[1]}`] ? `26.${m[1]}` : null;
  };
  sameSet(
    asSet(trees.map((t) => t.dir).filter((d) => !familyKey(d.split("/")[1]))),
    asSet(Object.keys(meta.knownRuleTreeGaps ?? {})),
    "规则树无 KB 键",
  );
  sameSet(
    asSet(trees.filter((t) => t.rules === 0).map((t) => `${t.dir}=0`)),
    asSet(Object.keys(meta.knownDraftRuleTrees ?? {}).map((d) => `${d}=0`)),
    "0 规则 draft 树",
  );

  // G4 primer 派生的 breakingChanges：标题逐字可回查，且没有静默漏小节
  const excluded = asSet(meta.breakingChangesRule?.excludedHeadings ?? ["Minor Migrations"]);
  const primerFiles = readdirSync(join(REPO_ROOT, PRIMER_DIR_REL)).filter((f) => f.endsWith(".md"));
  const primerByTarget = new Map();
  for (const f of primerFiles) {
    const info = kbPrimerInfo(`${PRIMER_DIR_REL}/${f}`);
    if (info.to) primerByTarget.set(info.to, { file: `${PRIMER_DIR_REL}/${f}`, ...info });
  }
  for (const k of keys) {
    for (const item of kb.versions[k].breakingChanges) {
      if (!item.evidence) continue;
      assert.ok(
        item.evidence.startsWith(PRIMER_DIR_REL + "/"),
        `${k}: breakingChanges.evidence 只能指向 ${PRIMER_DIR_REL}/（其余来源本门禁不认）→ ${item.evidence}`,
      );
      assert.ok(existsSync(join(REPO_ROOT, item.evidence)), `${k}: evidence 指向不存在的 ${item.evidence}`);
      const headings = kbPrimerInfo(item.evidence).headings;
      assert.ok(
        headings.includes(item.evidenceHeading),
        `${k}: 小节「${item.evidenceHeading}」在 ${item.evidence} 里找不到（凭记忆写的？）`,
      );
      assert.equal(item.description, item.evidenceHeading, `${k}: description 必须逐字等于 primer 小节标题`);
      assert.ok(!excluded.has(item.evidenceHeading), `${k}: ${item.evidenceHeading} 属于排除小节`);
    }
    const p = primerByTarget.get(k);
    if (!p || kb.versions[k].provenance !== "verified") continue;
    const kept = p.headings.filter((h) => !excluded.has(h));
    const mine = kb.versions[k].breakingChanges.filter((i) => i.evidence === p.file);
    assert.equal(
      mine.length,
      kept.length,
      `${k}: primer ${p.file} 有 ${kept.length} 个小节，KB 只收了 ${mine.length} 个 → ${kept.filter((h) => !mine.some((i) => i.evidenceHeading === h))}`,
    );
    for (const i of mine) assert.equal(i.primerRange, `${p.from} -> ${k}`, `${k}: primerRange 与 primer frontmatter 不符`);
  }
  for (const k of keys) {
    const e = kb.versions[k];
    if (e.provenance === "verified" && e.breakingChanges.length === 0 && !primerByTarget.get(k)) {
      assert.ok(String(e.note ?? "").length > 10, `${k}: breakingChanges 为空且无 primer ⇒ 必须有 note 说明「不代表无风险」`);
    }
  }

  // G5 可追溯性：verified 条目每个非空钉值都要有能解析且逐字相等的指针
  const normMappings = (v) => (typeof v === "string" ? v.split("+").map((s) => s.trim()).filter(Boolean) : v);
  const eqField = (field, kbVal, srcVal) => {
    if (field === "java") return Number(kbVal) === Number(srcVal);
    if (field === "mappings") return JSON.stringify(kbVal) === JSON.stringify(normMappings(srcVal));
    return String(kbVal) === String(srcVal);
  };
  for (const k of untagged) {
    const e = kb.versions[k];
    const src = e.sources ?? {};
    for (const field of ["forge", "neoforge", "fabric", "java", "mappings"]) {
      const has = field === "mappings" ? (e[field]?.length ?? 0) > 0 : e[field] != null;
      if (!has) continue;
      assert.ok(src[field], `${k}: ${field}=${JSON.stringify(e[field])} 没有 sources.${field} 证据指针`);
      const r = kbResolveSource(k, src[field]);
      assert.ok(r.ok, `${k}: sources.${field} 无法解析 → ${src[field]}（${r.why}）`);
      assert.ok(
        eqField(field, e[field], r.value),
        `${k}: ${field}=${JSON.stringify(e[field])} 与来源 ${src[field]}=${JSON.stringify(r.value)} 不符`,
      );
    }
    for (const token of [...String(src.ruleTrees ?? "").split(", "), ...String(src.dataDirs ?? "").split(", ")]) {
      if (!token) continue;
      assert.ok(existsSync(join(REPO_ROOT, token)), `${k}: sources 指向不存在的路径 ${token}`);
    }
  }

  // G6 java：KB 与 javaForMcVersion 不一致必须登记
  const javaConflicts = asSet(
    (meta.fieldConflicts ?? []).filter((c) => c.field === "java" && c.sourceFile === "src:javaForMcVersion").map((c) => c.key),
  );
  for (const k of keys) {
    const e = kb.versions[k];
    if (e.java == null) continue;
    const code = javaForMcVersion(k);
    if (code == null || Number(e.java) === code) {
      assert.ok(!javaConflicts.has(k), `${k}: 已登记 java 冲突，但代码值 ${code} 与 KB ${e.java} 已一致（登记过期）`);
      continue;
    }
    assert.ok(
      javaConflicts.has(k),
      `${k}: KB java=${e.java} 与 javaForMcVersion=${code} 不一致，必须登记进 meta.fieldConflicts`,
    );
  }

  // G7 行为边界（本 story 的验收）：1.20.1 → 1.21.1 / 26.1 必须给 KB 驱动的步骤
  const fabricGradle = "plugins { id 'fabric-loom' version '1.6-SNAPSHOT' }\n";
  const fabricJson = JSON.stringify({ schemaVersion: 1, id: "fabmod", version: "1.0.0" });
  for (const target of ["1.21.1", "26.1"]) {
    const root = mkdtempSync(join(tmpdir(), "mc-skill-kb-"));
    try {
      for (const [p, content] of Object.entries({
        "build.gradle": fabricGradle,
        "gradle.properties": "minecraft_version=1.20.1\n",
        "src/main/resources/fabric.mod.json": fabricJson,
      })) {
        mkdirSync(join(root, dirname(p)), { recursive: true });
        writeFileSync(join(root, p), content, "utf8");
      }
      const out = JSON.parse(await analyzePortingPath({ projectPath: root, targetPlatform: "neoforge", targetVersion: target }));
      assert.equal(out.ok, true, `1.20.1→${target}: ${JSON.stringify(out.error)}`);
      const a = out.analysis;
      assert.deepEqual(a.knowledgeGaps, [], `1.20.1→${target}: 仍有 KB 空洞 ${JSON.stringify(a.knowledgeGaps)}`);
      const beyond1202 = a.breakingChanges.filter((c) => kbVersionNumber(c.mcVersion) > kbVersionNumber("1.20.2"));
      assert.ok(
        beyond1202.length > 0,
        `1.20.1→${target}: breakingChanges 只来自 1.20.2 以下（${a.breakingChanges.length} 条），新键没进区间`,
      );
      assert.equal(a.target.java, kb.versions[target].java, `1.20.1→${target}: target.java 未走 KB`);
      assert.equal(a.target.mappings, kb.versions[target].mappings[0], `1.20.1→${target}: target.mappings 未走 KB`);
      const handoff = a.nextSteps.find((n) => n.tool === "port_project" && n.args?.action === "init_architectury");
      assert.ok(
        handoff,
        `1.20.1→${target}: 缺 init_architectury 交接（KB neoforge 钉值没被消费）→ ${JSON.stringify(a.nextSteps.map((n) => n.args))}`,
      );
      assert.equal(
        handoff.args.neoforgeVersion,
        kb.versions[target].neoforge,
        `1.20.1→${target}: 交接里的 neoforgeVersion 与 KB 钉值不符`,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  // G8 漂移扫描 ↔ meta.fieldConflicts 双向闭合
  const drifts = [];
  for (const k of keys) {
    const e = kb.versions[k];
    for (const field of ["forge", "neoforge", "fabric", "java", "mappings"]) {
      const pointer = KB_PIN_SOURCES[field](k);
      const r = kbResolvePointer(pointer);
      const has = field === "mappings" ? (e[field]?.length ?? 0) > 0 : e[field] != null;
      if (!r.ok || r.value == null || !has) {
        if (has && field !== "java" && field !== "mappings") {
          assert.ok(
            (meta.fieldConflicts ?? []).some((c) => c.key === k && c.field === field),
            `${k}: ${field}=${JSON.stringify(e[field])} 在本仓无钉值来源，必须登记 meta.fieldConflicts`,
          );
        }
        continue;
      }
      if (!eqField(field, e[field], r.value)) drifts.push({ key: k, field, kb: e[field], src: r.value, sourceFile: pointer });
    }
  }
  const registered = (meta.fieldConflicts ?? []).filter((c) => {
    const pointer = KB_PIN_SOURCES[c.field]?.(c.key);
    return pointer && pointer === c.sourceFile && kbResolvePointer(pointer).ok;
  });
  const tag = (d) => `${d.key}.${d.field}`;
  sameSet(asSet(drifts.map(tag)), asSet(registered.map(tag)), "字段漂移");
  for (const d of drifts) {
    const c = registered.find((x) => x.key === d.key && x.field === d.field);
    assert.ok(c, `${d.key}.${d.field}: 漂移未登记`);
    assert.ok(eqField(d.field, c.kb, d.kb), `${d.key}.${d.field}: 登记的 kb 值 ${JSON.stringify(c.kb)} 与实际 ${JSON.stringify(d.kb)} 不符`);
    assert.ok(eqField(d.field, d.src, c.source), `${d.key}.${d.field}: 登记的 source 值 ${JSON.stringify(c.source)} 与实际来源 ${JSON.stringify(d.src)} 不符`);
  }
  // 每条登记（含 code / 文档型）引用的证据必须仍然成立
  for (const c of meta.fieldConflicts ?? []) {
    if (c.sourceFile === "src:javaForMcVersion") {
      assert.equal(javaForMcVersion(c.key), c.source, `${c.key}: 登记的代码值已变 → ${javaForMcVersion(c.key)}`);
      continue;
    }
    const r = kbResolvePointer(c.sourceFile);
    if (c.source === null) {
      assert.ok(!r.ok, `${c.key}.${c.field}: 登记的 source=null（本仓无来源），但 ${c.sourceFile} 现在可解析了`);
      continue;
    }
    assert.ok(r.ok, `${c.key}.${c.field}: 登记证据失效 → ${c.sourceFile}（${r.why}）`);
    assert.equal(String(r.value), String(c.source), `${c.key}.${c.field}: 登记证据值已变 → ${JSON.stringify(r.value)}`);
  }
}

// S13：Fabric scaffold Gradle wrapper 三件套完整性 + 官方字节一致性
// jar 来源的仓内证据见 mcp-server/data/wrapper-jars.json（官方发行包 sha256 → 该版本自己的
// wrapper 任务离线生成 → 逐字节比对 zip 内嵌条目）。本表与该文件由 diffWrapperPins 强制对齐。
const WRAPPER_JARS = {
  "6.9.4": { sha256: "e996d452d2645e70c01c11143ca2d3742734a28da2bf61f25c82bdc288c9e637", size: 59203 },
  "7.4.2": { sha256: "575098db54a998ff1c6770b352c3b16766c09848bee7555dab09afc34e8cf590", size: 59821 },
  "7.6.1": { sha256: "c5a643cf80162e665cc228f7b16f343fef868e47d3a4836f62e18b7e17ac018a", size: 61574 },
  "8.4": { sha256: "0336f591bc0ec9aa0c9988929b93ecc916b3c1d52aed202c7381db144aa0ef15", size: 63721 },
  "8.6": { sha256: "d3b261c2820e9e3d8d639ed084900f11f4a86050a8f83342ade7b6bc9b0d2bdd", size: 43462 },
  "8.8": { sha256: "cb0da6751c2b753a16ac168bb354870ebb1e162e9083f116729cec9c781156b8", size: 43453 },
  "8.10": { sha256: "2db75c40782f5e8ba1fc278a5574bab070adccb2d21ca5a6e5ed840888448046", size: 43583 },
  "9.5.1": { sha256: "497c8c2a7e5031f6aa847f88104aa80a93532ec32ee17bdb8d1d2f67a194a9c7", size: 48462 },
};
// 钉值表本身必须先过格式校验：抄错一位 hex 会让该版本所有 scaffold 被误判为「被篡改」。
function findMalformedPins(table) {
  return Object.entries(table)
    .filter(([, e]) => !/^[0-9a-f]{64}$/.test(String(e?.sha256)) || !Number.isInteger(e?.size) || e.size <= 0)
    .map(([v, e]) => `钉值 ${v} 格式非法：sha256=${e?.sha256}（须 64 位小写 hex）size=${e?.size}`);
}
// 无 gradle-wrapper.properties 的档：写三件套必须先定 Gradle 版本，版本无仓内证据 → 登记空洞。
// 补齐后必须从这里删掉（登记过期同样算失败）。
const WRAPPER_VERSION_GAPS = ["1.21.4", "1.21.8", "1.21.10", "26.1.2"];

function scanScaffoldWrappers(root) {
  const fabricDir = join(root, "fabric");
  const problems = [];
  const seen = [];
  const byVersion = {};
  for (const ver of readdirSync(fabricDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
    const scaffold = join(fabricDir, ver, "scaffold");
    if (!existsSync(scaffold)) continue;
    seen.push(ver);
    const propsPath = join(scaffold, "gradle", "wrapper", "gradle-wrapper.properties");
    const files = {
      gradlew: join(scaffold, "gradlew"),
      gradlewBat: join(scaffold, "gradlew.bat"),
      jar: join(scaffold, "gradle", "wrapper", "gradle-wrapper.jar"),
    };
    const hasProps = existsSync(propsPath);
    const propsText = hasProps ? readFileSync(propsPath, "utf8") : "";
    const declared = hasProps ? propsText.match(/^distributionUrl=.+?gradle-([0-9][0-9A-Za-z.]*)-bin\.zip$/m)?.[1] ?? null : null;
    if (declared == null) {
      if (hasProps) problems.push(`${ver}: distributionUrl 解析不出 gradle-x.y.z`);
      for (const [name, p] of Object.entries(files)) {
        if (existsSync(p)) problems.push(`${ver}: 没有已声明版本却存在 ${name}`);
      }
      continue;
    }
    const pin = WRAPPER_JARS[declared];
    if (!pin) {
      problems.push(`${ver}: 声明 Gradle ${declared} 不在 WRAPPER_JARS 钉值表内`);
      continue;
    }
    (byVersion[declared] ??= []).push(`fabric/${ver}`);
    for (const [name, p] of Object.entries(files)) {
      if (!existsSync(p)) problems.push(`${ver}: 声明 ${declared} 但缺 ${name}`);
    }
    if (!existsSync(files.jar) || !existsSync(files.gradlew) || !existsSync(files.gradlewBat)) continue;
    const buf = readFileSync(files.jar);
    const sha = createHash("sha256").update(buf).digest("hex");
    if (sha !== pin.sha256) problems.push(`${ver}: jar sha256=${sha} != 官方 ${pin.sha256}`);
    if (buf.length !== pin.size) problems.push(`${ver}: jar ${buf.length}B != 官方 ${pin.size}B`);
    const count = (b, byte) => b.reduce((n, x) => n + (x === byte ? 1 : 0), 0);
    const gw = readFileSync(files.gradlew);
    const bat = readFileSync(files.gradlewBat);
    if (count(gw, 13) !== 0) problems.push(`${ver}: gradlew 含 CR（须 LF-only）`);
    if (count(gw, 10) === 0) problems.push(`${ver}: gradlew 为空`);
    if (count(bat, 13) === 0 || count(bat, 13) !== count(bat, 10)) problems.push(`${ver}: gradlew.bat 非纯 CRLF`);
    if (/^distributionUrl=file:/m.test(propsText)) problems.push(`${ver}: distributionUrl 指向本地路径`);
  }
  // 登记双向：无声明版本的 scaffold 必须在 WRAPPER_VERSION_GAPS；登记了就要仍然成立
  const gapSet = new Set(WRAPPER_VERSION_GAPS);
  for (const ver of seen) {
    const hasProps = existsSync(join(fabricDir, ver, "scaffold", "gradle", "wrapper", "gradle-wrapper.properties"));
    if (hasProps && gapSet.has(ver)) problems.push(`${ver}: 已登记为「无 Gradle 版本」空洞，但现在有 gradle-wrapper.properties（登记过期）`);
    if (!hasProps && !gapSet.has(ver)) problems.push(`${ver}: 无 gradle-wrapper.properties，必须登记进 WRAPPER_VERSION_GAPS`);
  }
  for (const ver of WRAPPER_VERSION_GAPS) {
    if (!seen.includes(ver)) problems.push(`${ver}: 登记在 WRAPPER_VERSION_GAPS，但没有 scaffold（登记过期）`);
  }
  const declaredCount = seen.filter((v) => existsSync(join(fabricDir, v, "scaffold", "gradle", "wrapper", "gradle-wrapper.properties"))).length;
  const sortedByVersion = {};
  for (const ver of Object.keys(byVersion).sort()) sortedByVersion[ver] = byVersion[ver].sort();
  return { seen: seen.sort(), problems, declaredCount, byVersion: sortedByVersion };
}

// 钉值表 ↔ mcp-server/data/wrapper-jars.json 双向对齐。纯函数、不碰盘，可内存投毒自证。
function diffWrapperPins(table, prov, byVersion, gaps = WRAPPER_VERSION_GAPS) {
  const problems = [];
  const jars = prov?.jars ?? {};
  const tableVers = Object.keys(table).sort().join(",");
  const provVers = Object.keys(jars).sort().join(",");
  if (tableVers !== provVers) problems.push(`版本集不一致：钉值表 [${tableVers}] != wrapper-jars.json [${provVers}]`);
  for (const [ver, e] of Object.entries(jars)) {
    if (!/^[0-9a-f]{64}$/.test(String(e?.jarSha256))) problems.push(`${ver}: JSON jarSha256 非 64 位小写 hex → ${e?.jarSha256}`);
    if (e?.verified === "official-distribution" && !/^[0-9a-f]{64}$/.test(String(e?.zipSha256)))
      problems.push(`${ver}: 宣称 official-distribution 却没有 64 位 hex zipSha256`);
    const pin = table[ver];
    if (!pin) continue;
    if (String(e.jarSha256) !== String(pin.sha256)) problems.push(`${ver}: JSON jarSha256 != 钉值表 sha256（表里被改 or 证据过期）`);
    if (Number(e.jarSize) !== Number(pin.size)) problems.push(`${ver}: JSON jarSize=${e.jarSize} != 钉值表 size=${pin.size}`);
    const claimed = [...(Array.isArray(e.usedBy) ? e.usedBy : [])].sort().join(",");
    const measured = [...(byVersion[ver] ?? [])].sort().join(",");
    if (claimed !== measured) problems.push(`${ver}: JSON usedBy=[${claimed}] != 实测 scaffold [${measured}]`);
  }
  const jsonGaps = [...(prov?.gaps?.wrapperVersionUndeclared ?? [])].sort().join(",");
  const codeGaps = [...gaps].sort().join(",");
  if (jsonGaps !== codeGaps) problems.push(`JSON gaps=[${jsonGaps}] != WRAPPER_VERSION_GAPS=[${codeGaps}]`);
  return problems;
}

async function testFabricScaffoldWrappers() {
  assert.deepEqual(findMalformedPins(WRAPPER_JARS), [], "WRAPPER_JARS 钉值格式非法");
  assert.equal(findMalformedPins({ "8.4": { sha256: "0336f591bc0ec9aa0c9988929b93ecc916b3c1d52aed202c7381db144aa0ef15".repeat(63), size: 63721 } }).length, 1, "钉值格式校验必须能报错");
  const { seen, problems, declaredCount, byVersion } = scanScaffoldWrappers(REPO_ROOT);
  assert.equal(seen.length, 14, `fabric/*/scaffold 应为 14 档，实际 ${seen.length} → ${seen.join(",")}`);
  assert.equal(declaredCount, 10, `已声明 Gradle 版本且应完整的档数应为 10，实际 ${declaredCount}`);
  assert.deepEqual(problems, [], `scaffold wrapper 门禁:\n  ${problems.join("\n  ")}`);

  const provPath = join(REPO_ROOT, "mcp-server", "data", "wrapper-jars.json");
  assert.ok(existsSync(provPath), `缺仓内出处记录 ${provPath}（钉值表失去可查证据）`);
  const prov = JSON.parse(readFileSync(provPath, "utf8"));
  assert.deepEqual(
    diffWrapperPins(WRAPPER_JARS, prov, byVersion),
    [],
    "WRAPPER_JARS ↔ mcp-server/data/wrapper-jars.json ↔ 实测 scaffold 三者不一致");

  // 自证：7 种注入必须各让门禁报出对应问题（门禁若永远绿 = 没在检查）
  const poison = (name, needle, mutate) => {
    const tmp = mkdtempSync(join(tmpdir(), "mc-skill-wrap-"));
    try {
      cpSync(join(REPO_ROOT, "fabric"), join(tmp, "fabric"), { recursive: true });
      mutate(join(tmp, "fabric"));
      const r = scanScaffoldWrappers(tmp);
      assert.ok(r.problems.length > 0, `${name}: 注入后门禁仍然全绿`);
      const hit = r.problems.filter((p) => p.includes(needle));
      assert.ok(hit.length > 0, `${name}: 门禁报错但不含「${needle}」→ ${JSON.stringify(r.problems.slice(0, 3))}`);
      return hit[0].split(":")[0];
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  };
  const touched = new Set([
    poison("缺 gradlew", "但缺 gradlew", (f) => rmSync(join(f, "1.20.1", "scaffold", "gradlew"))),
    poison("jar 被篡改", "jar sha256", (f) =>
      writeFileSync(join(f, "1.21.3", "scaffold", "gradle", "wrapper", "gradle-wrapper.jar"), Buffer.from([0x50, 0x4b, 0x03, 0x04]))),
    poison("gradlew 行尾", "gradlew 含 CR", (f) => {
      const p = join(f, "1.19.4", "scaffold", "gradlew");
      writeFileSync(p, readFileSync(p).toString("utf8").replace(/\n/g, "\r\n"));
    }),
    poison("bat 行尾", "非纯 CRLF", (f) => {
      const p = join(f, "1.18.2", "scaffold", "gradlew.bat");
      writeFileSync(p, readFileSync(p).toString("utf8").replace(/\r\n/g, "\n"));
    }),
    poison("版本未钉", "不在 WRAPPER_JARS 钉值表内", (f) => {
      const p = join(f, "1.17.1", "scaffold", "gradle", "wrapper", "gradle-wrapper.properties");
      writeFileSync(p, readFileSync(p).toString("utf8").replace("gradle-7.4.2-bin.zip", "gradle-7.5-bin.zip"));
    }),
    poison("空洞档半套", "没有已声明版本却存在", (f) =>
      writeFileSync(join(f, "26.1.2", "scaffold", "gradlew"), "#!/bin/sh\n")),
    poison("登记过期", "登记过期", (f) => {
      mkdirSync(join(f, "1.21.8", "scaffold", "gradle", "wrapper"), { recursive: true });
      writeFileSync(
        join(f, "1.21.8", "scaffold", "gradle", "wrapper", "gradle-wrapper.properties"),
        "distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10-bin.zip\n",
      );
    }),
  ]);
  assert.equal(touched.size, 7, `7 种注入应命中 7 个不同档，实际 ${touched.size} → ${JSON.stringify([...touched])}`);

  // 自证：钉值表 ↔ 仓内出处记录 的三向对齐也能报错（纯内存投毒，不动盘）
  const pinPoison = (name, needle, mutate) => {
    const t = structuredClone(WRAPPER_JARS);
    const p = structuredClone(prov);
    const v = structuredClone(byVersion);
    const g = [...WRAPPER_VERSION_GAPS];
    mutate({ table: t, prov: p, byVersion: v, gaps: g });
    const hits = diffWrapperPins(t, p, v, g).filter((s) => s.includes(needle));
    assert.ok(hits.length > 0, `${name}: 对齐门禁没报出「${needle}」`);
    return needle;
  };
  const pinChecked = new Set([
    // 抄错一位 hex（本story 真的在 JSON 里犯过一次：8.4 sha 少了一位）
    pinPoison("钉值被截位", "8.4: JSON jarSha256 != 钉值表", ({ table }) => {
      table["8.4"].sha256 = table["8.4"].sha256.slice(0, 63);
    }),
    pinPoison("usedBy 漂移", "usedBy=", ({ prov: p }) => {
      p.jars["8.4"].usedBy = ["fabric/1.18.2", "fabric/1.19.4"];
    }),
    pinPoison("空洞登记漂移", "JSON gaps=", ({ prov: p }) => {
      p.gaps.wrapperVersionUndeclared = p.gaps.wrapperVersionUndeclared.filter((x) => x !== "1.21.4");
    }),
  ]);
  assert.equal(pinChecked.size, 3, `3 种内存注入应各报一次，实际 ${pinChecked.size}`);
  assert.deepEqual(diffWrapperPins(WRAPPER_JARS, prov, byVersion), [], "投毒后基线必须仍然干净");
}

// ---- S23：「断言须有出处」门禁 ----
// 台账里每条 = 一个文件 + 一个敏感断言 needle + 可接受的出处 token。
// 命中 needle 的行必须带至少一个 token；一条都不命中 = 断言消失（台账过期，同样算失败）。
// 宿主镜像树（.agents/.claude/.continue/…）不在此扫描：scripts/assert-skill-mirrors.mjs
// 已强制镜像与源树逐字节一致，扫源树即可覆盖。
const PROVENANCE_ASSERTIONS = [
  {
    file: "forge/1.20.1/.cursor/rules/00-project-setup.mdc",
    needle: "Gradle 8",
    sources: ["mdk-checksums.json", "MDK"],
    why: "Forge 档的 Gradle 下限只允许引用官方 MDK 的实测钉值，禁止凭记忆写「不低于某版本」",
  },
  {
    file: "bedrock/.cursor/rules/07-script-api.mdc",
    needle: "gametest",
    sources: ["wiki.bedrock.dev"],
    why: "「Beta APIs」键名属社区权威（非 Microsoft Learn 官方），必须写明出处等级",
  },
  {
    file: "bedrock/knowledge/common/experiments.md",
    needle: "gametest",
    sources: ["wiki.bedrock.dev"],
    why: "同上：键名结论的唯二出处都在这两档里",
  },
];
const PROV_SKIP_DIRS = new Set(["node_modules", "dist", ".git", "temp", "_temp", "__oneoff"]);
const PROV_SCAN_EXT = /\.(md|mdc|ts|js|mjs|json|ps1|txt)$/;
const PROV_TEMP_CITE = /见\s*temp[\\/]/;

function provenanceScanRoots(root) {
  const roots = [
    "mcp-server/src", "mcp-server/scripts", "mcp-server/test-core.mjs", "scripts",
    "bedrock/.cursor/rules", "bedrock/knowledge", "knowledge", "community_knowledge",
    "README.md", "AGENTS.md",
  ];
  for (const plat of ["forge", "fabric", "quilt", "neoforge", "liteloader", "rift", "modloader"]) {
    const dir = join(root, plat);
    if (!existsSync(dir)) continue;
    for (const ver of readdirSync(dir)) {
      if (existsSync(join(dir, ver, ".cursor", "rules"))) roots.push(`${plat}/${ver}/.cursor/rules`);
      if (existsSync(join(dir, ver, "knowledge"))) roots.push(`${plat}/${ver}/knowledge`);
      if (existsSync(join(dir, ver, "AGENTS.md"))) roots.push(`${plat}/${ver}/AGENTS.md`);
    }
  }
  return roots;
}

function collectProvenanceFiles(root) {
  const files = [];
  const walk = (abs, rel) => {
    if (statSync(abs).isDirectory()) {
      for (const name of readdirSync(abs)) {
        if (PROV_SKIP_DIRS.has(name)) continue;
        walk(join(abs, name), `${rel}/${name}`);
      }
      return;
    }
    if (PROV_SCAN_EXT.test(abs)) files.push({ rel, text: readFileSync(abs, "utf8") });
  };
  const roots = provenanceScanRoots(root);
  for (const rel of roots) {
    const abs = join(root, rel);
    if (existsSync(abs)) walk(abs, rel);
  }
  return { files, roots: roots.length };
}

// read(rel) → 文件正文；读不到返回 null。注入进来，便于内存投毒。
function findUnsourcedAssertions(ledger, read) {
  const problems = [];
  for (const spec of ledger) {
    const text = read(spec.file);
    if (text == null) {
      problems.push(`${spec.file}: 台账指向的文件读不到（${spec.why}）`);
      continue;
    }
    const lines = text.split(/\r?\n/);
    let hits = 0;
    lines.forEach((ln, i) => {
      if (!ln.includes(spec.needle)) return;
      hits++;
      if (spec.sources.some((s) => ln.includes(s))) return;
      problems.push(
        `${spec.file}:L${i + 1} 断言「${spec.needle}」缺出处 [${spec.sources.join(" / ")}] → ${ln.trim().slice(0, 90)}`);
    });
    if (hits === 0) problems.push(`${spec.file}: 断言「${spec.needle}」消失（台账过期：补回文案或删掉这条台账）`);
  }
  return problems;
}

function findTempCitations(files) {
  const hits = [];
  for (const f of files) {
    f.text.split(/\r?\n/).forEach((ln, i) => {
      if (PROV_TEMP_CITE.test(ln)) hits.push(`${f.rel}:${i + 1} ${ln.trim().slice(0, 120)}`);
    });
  }
  return hits;
}

// wrapper-jars.json 的 MDK 实测记录 ↔ mcp-server/data/mdk-checksums.json ↔ 规则树数字，三向对齐。
function diffMdkMeasured(entries, mdkEntries, ruleText) {
  const problems = [];
  for (const e of entries ?? []) {
    const rec = (mdkEntries ?? []).find((r) => r.id === e.mdk);
    if (!rec) {
      problems.push(`mdkMeasured ${e.mdk}: mdk-checksums.json 里没有这个 id（证据链断）`);
      continue;
    }
    if (String(rec.sha256) !== String(e.zipSha256)) problems.push(`mdkMeasured ${e.mdk}: zipSha256 != mdk-checksums.json sha256`);
    if (!String(rec.archiveUrl ?? "").includes(String(e.artifact))) problems.push(`mdkMeasured ${e.mdk}: artifact ${e.artifact} 不在 archiveUrl 里`);
    if (e.mdk === "forge-1.20.1-forgegradle") {
      if (!ruleText.includes(String(e.artifact).replace("-mdk.zip", ""))) problems.push(`规则树没写 MDK 版本 ${e.artifact}`);
      if (!ruleText.includes(`Gradle ${e.declaredGradle}`)) problems.push(`规则树没写实测 Gradle ${e.declaredGradle}（数字漂移）`);
    }
  }
  return problems;
}

async function testAssertionProvenance() {
  const read = (rel) => {
    const p = join(REPO_ROOT, rel);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  const unsourced = findUnsourcedAssertions(PROVENANCE_ASSERTIONS, read);
  assert.deepEqual(unsourced, [], `「断言须有出处」门禁:\n  ${unsourced.join("\n  ")}`);

  const { files, roots } = collectProvenanceFiles(REPO_ROOT);
  assert.ok(files.length >= roots, `出处扫描集塌陷：${roots} 个扫描根只读到 ${files.length} 个文件（门禁会假绿）`);
  const dangling = findTempCitations(files);
  assert.deepEqual(dangling, [], `持久文件里存在指向临时目录的失效引用（temp/ 不入库，读者拿不到）:\n  ${dangling.join("\n  ")}`);

  const wrapJson = JSON.parse(readFileSync(join(REPO_ROOT, "mcp-server", "data", "wrapper-jars.json"), "utf8"));
  const mdkJson = JSON.parse(readFileSync(join(REPO_ROOT, "mcp-server", "data", "mdk-checksums.json"), "utf8"));
  const forgeRule = read("forge/1.20.1/.cursor/rules/00-project-setup.mdc") ?? "";
  const mdkProblems = diffMdkMeasured(wrapJson.mdkMeasured?.entries, mdkJson.entries, forgeRule);
  assert.deepEqual(mdkProblems, [], `MDK 实测记录 ↔ mdk-checksums.json ↔ 规则树数字不一致:\n  ${mdkProblems.join("\n  ")}`);
  console.log(
    `[assertion-provenance] 台账 ${PROVENANCE_ASSERTIONS.length} 条 · 扫描 ${roots} 根 / ${files.length} 档 · ` +
    `失效引用 ${dangling.length} · MDK 实测 ${wrapJson.mdkMeasured.entries.length} 档`);

  // 自证：每种注入都要报出对应问题，且报的是各自那条（不是同一处共享失败撑绿）
  const poison = (name, needle, run) => {
    const hits = run().filter((s) => s.includes(needle));
    assert.ok(hits.length > 0, `${name}: 门禁没报出「${needle}」`);
    return hits[0];
  };
  const fired = new Set([
    // 还原审查报告点名的原始写法：保留「Gradle 8」，出处整段没了
    poison("无出处下限", "缺出处", () => findUnsourcedAssertions(structuredClone(PROVENANCE_ASSERTIONS), (rel) => {
      const t = read(rel);
      return t == null ? t : t.replace(/^- Gradle Wrapper[^\n]*$/m, "- Gradle Wrapper 版本不低于 **Gradle 8.4**");
    })),
    // 出处 URL 改成无关域名（键名留着 = 凭空断言）
    poison("出处被抹", "缺出处", () => findUnsourcedAssertions(structuredClone(PROVENANCE_ASSERTIONS), (rel) => {
      const t = read(rel);
      return t == null ? t : t.replace(/wiki\.bedrock\.dev/g, "wiki.example.com");
    })),
    poison("断言消失", "消失", () => findUnsourcedAssertions(structuredClone(PROVENANCE_ASSERTIONS), (rel) => {
      const t = read(rel);
      return t == null ? t : t.split(/\r?\n/).filter((ln) => !ln.includes("gametest")).join("\n");
    })),
    poison("台账文件不存在", "读不到", () =>
      findUnsourcedAssertions([{ ...PROVENANCE_ASSERTIONS[0], file: "bedrock/knowledge/common/nope.md" }], read)),
    poison("指向临时目录的引用", "temp", () => {
      const target = files.find((f) => f.rel.split("/").length > 3);
      assert.ok(target, "扫描集里没有嵌套文件可用于投毒");
      // 「见」用转义写，否则本文件自己会被这条扫描命中
      const injected = "\u8be6\u89c1 temp/whatever.md";
      return findTempCitations(files.map((f) => (f === target ? { ...f, text: `${f.text}\n${injected}\n` } : f)));
    }),
    poison("MDK 版本漂移", "Gradle 8.9", () => {
      const e = structuredClone(wrapJson.mdkMeasured.entries);
      e.find((x) => x.mdk === "forge-1.20.1-forgegradle").declaredGradle = "8.9";
      return diffMdkMeasured(e, mdkJson.entries, forgeRule);
    }),
    poison("MDK 校验和漂移", "zipSha256", () => {
      const e = structuredClone(wrapJson.mdkMeasured.entries);
      e[0].zipSha256 = "f".repeat(64);
      return diffMdkMeasured(e, mdkJson.entries, forgeRule);
    }),
    poison("MDK id 失效", "没有这个 id", () => {
      const e = structuredClone(wrapJson.mdkMeasured.entries);
      e[0].mdk = "forge-1.99.9-forgegradle";
      return diffMdkMeasured(e, mdkJson.entries, forgeRule);
    }),
  ]);
  assert.equal(fired.size, 8, `8 种注入应各报一条独立问题，实际 ${fired.size} → ${JSON.stringify([...fired])}`);
  assert.deepEqual(findUnsourcedAssertions(PROVENANCE_ASSERTIONS, read), [], "投毒后基线必须仍然干净");
  assert.deepEqual(findTempCitations(files), [], "投毒后引用扫描必须仍然干净");
  assert.deepEqual(diffMdkMeasured(wrapJson.mdkMeasured.entries, mdkJson.entries, forgeRule), [], "投毒后 MDK 对齐必须仍然干净");
}

const F2612_PACK_REL = "fabric/26.1.2";
const F2612_SHEET_REL = "knowledge/common/verified-api-26.1.2.md";
const F2612_DOCS_REL = "data/fabric_26.1.2/fabric-docs/26.1.2/processed";
const F2612_SUMMARY_REL = "mcp-server/data/loader-api-summaries/26.1.2-fabric-api.json";
const F2612_MARKER = /禁止|不要|不得|❌|未核实|以该版|以本版|取代|换成|改名/;
const F2612_TIER2 = ["modImplementation", "modCompileOnly", "modApi", "remapJar", 'id "fabric-loom"',
  "ShapedRecipeJsonBuilder", "ShapelessRecipeJsonBuilder", "offerTo", "offerShapedRecipe", "RecipeExporter",
  "ResourceLocation", "DeferredRegister", "@SubscribeEvent", "IEventBus", "ExistingFileHelper",
  "PlayerEntity", "ActionResult", "Text.literal", "MinecraftClient", "ItemGroup", "SoundCategory",
  "CommandManager", "EntityArgumentType", "ServerCommandSource", "SpawnGroup", "GenerationStep.Feature",
  "HandledScreens", "FabricItemApi", "PacketCodec", "LootTableLoadingCallback", "SimpleChannel"];

/** 表 C 不手抄：从本档 docs 语料的 porting 页重新派生同一份 needle 清单。 */
function deriveFabric2612Needles(docsDir, summary) {
  const md = readFileSync(join(docsDir, "develop_porting_fabric-api.md"), "utf8");
  const allSimple = new Set(summary.classes.map((c) => c.simpleName));
  const last = (s) => s.split("/").pop().replace(/\$.*$/, "");
  const nested = (s) => s.split("/").pop();
  const targets = new Map();
  const newTokens = new Set();
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^- `([^`]+)` → `([^`]+)`/);
    if (!m) continue;
    const a = last(m[1]);
    const b = last(m[2]);
    if (/^[A-Z][A-Za-z0-9_]{5,}$/.test(b)) newTokens.add(b);
    if (/^[A-Z][A-Za-z0-9_]{5,}$/.test(a)) {
      if (!targets.has(a)) targets.set(a, []);
      targets.get(a).push(nested(m[2]));
    }
  }
  const needles = [...targets.keys()].filter((a) => !newTokens.has(a) && !allSimple.has(a)).sort();
  return { needles, targets };
}

function walkText(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkText(p, out);
    else if (/\.(md|mdc|java|json|groovy|properties)$/.test(e)) out.push(p);
  }
  return out;
}

function f2612Sections(sheetText) {
  const secs = {};
  let cur = null;
  for (const line of sheetText.split(/\r?\n/)) {
    const h = line.match(/^## (.+)$/);
    if (h) {
      const t = h[1].match(/^表\s*([A-E])\b/);
      cur = t ? `表${t[1]}` : null;
      if (cur && !secs[cur]) secs[cur] = [];
      continue;
    }
    if (!cur || !line.startsWith("| ")) continue;
    if (/^\|[-\s|:]+\|?$/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((s) => s.trim());
    if (!/[A-Za-z]/.test(cells[0] ?? "")) continue;
    secs[cur].push(cells);
  }
  return secs;
}

function scanFabric2612Knowledge(opts = {}) {
  const root = opts.root ?? REPO_ROOT;
  const packDir = opts.packDir ?? join(root, F2612_PACK_REL);
  const docsDir = opts.docsDir ?? join(root, F2612_DOCS_REL);
  const summaryPath = opts.summaryPath ?? join(root, F2612_SUMMARY_REL);
  const cloneDir = opts.cloneDir ?? join(root, "fabric/1.21.11/knowledge");
  const sheetPath = join(packDir, ...F2612_SHEET_REL.split("/"));
  const problems = [];
  const stats = { files: 0, needles: 0, tableA: 0, tableB: 0, tableC: 0, tier1: 0, tier2: 0, verifiedApi: 0, sessionStatus: "skip" };

  // 表必须落在 session 会列出的目录里，否则「知识入库」对宿主等于不存在
  const sheetCandidates = walkText(join(packDir, "knowledge")).filter((f) => /verified-api/i.test(f));
  if (!existsSync(sheetPath)) {
    problems.push(sheetCandidates.length
      ? `知识表不在 knowledge/common/ 下，session 递不出去：${sheetCandidates[0].replace(/\\/g, "/")}`
      : `缺少 ${F2612_SHEET_REL}`);
  }
  if (!existsSync(summaryPath)) problems.push("26.1.2 fabric-api loader 摘要缺失");
  if (!existsSync(join(docsDir, "develop_porting_fabric-api.md"))) problems.push("26.1.2 docs 语料缺 porting 页");

  let needles = [];
  let targets = new Map();
  if (problems.length === 0) {
    const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
    ({ needles, targets } = deriveFabric2612Needles(docsDir, summary));
    stats.needles = needles.length;
    const sheet = readFileSync(sheetPath, "utf8");
    const fqcnSet = new Set(summary.classes.map((c) => c.fqcn));
    const secs = f2612Sections(sheet);
    const pageText = new Map();

    // R1 逐行复算：表 A 的 loader-api FQCN 与 docs 页 id 必须真的存在、正文里真的写了那个名字
    for (const cells of secs.表A ?? []) {
      stats.tableA++;
      const name = (cells[0].match(/`([^`]+)`/) ?? [])[1];
      const src = cells[1] ?? "";
      const note = cells[2] ?? "";
      if (!name) { problems.push(`表 A 行解析不出名称：${cells[0]}`); continue; }
      if (src.startsWith("loader-api")) {
        const fqcns = [...src.matchAll(/`([a-z][\w.]*(?:\.[A-Z]\w*)+)`/g)].map((m) => m[1]);
        if (fqcns.length === 0) problems.push(`表 A ${name}: 声明 loader-api 却没给出 FQCN`);
        for (const f of fqcns) {
          if (!fqcnSet.has(f) && !fqcnSet.has(f.split("$")[0])) problems.push(`表 A ${name}: loader-api 摘要内没有 ${f}`);
        }
      }
      for (const id of [...note.matchAll(/`26\.1\.2\/([\w-]+)`/g)].map((m) => m[1])) {
        const p = join(docsDir, `${id}.md`);
        if (!existsSync(p)) { problems.push(`表 A ${name}: docs 页 ${id} 不存在`); continue; }
        let text = pageText.get(id);
        if (text === undefined) { text = readFileSync(p, "utf8"); pageText.set(id, text); }
        if (!new RegExp(`\\b${name.split(".")[0]}\\b`).test(text)) problems.push(`表 A ${name}: docs 页 ${id} 正文里没有 ${name.split(".")[0]}`);
      }
    }

    // R1b 表 B 签名逐字回查摘要（签名只能来自摘要，改一个字都要报）
    const allBySimple = new Map();
    for (const c of summary.classes) {
      if (!allBySimple.has(c.simpleName)) allBySimple.set(c.simpleName, []);
      allBySimple.get(c.simpleName).push(c);
    }
    for (const cells of secs.表B ?? []) {
      stats.tableB++;
      const head = (cells[0].match(/`([^`]+)`/) ?? [])[1] ?? "";
      const sig = (cells[1].match(/`([^`]+)`/) ?? [])[1];
      const citedFile = (cells[2].match(/[\w$/.-]+\.java/) ?? [])[0];
      const isClassRow = /类级/.test(cells[0]);
      if (isClassRow) {
        const cs = allBySimple.get(head) ?? [];
        if (!cs.length) { problems.push(`表 B ${head}: loader-api 摘要内没有类 ${head}`); continue; }
        if (!/空数组/.test(cells[1])) problems.push(`表 B ${head}: 类级行未声明「methods 空数组」，读者会以为有方法`);
        else if (!cs.some((c) => c.methods.length === 0)) problems.push(`表 B ${head}: 摘要内该类 methods 非空，「空数组」说法与摘要不一致`);
        continue;
      }
      if (!sig) { problems.push(`表 B ${head}: 方法行没有签名`); continue; }
      const [cls, method] = head.split(".");
      const c = (allBySimple.get(cls) ?? []).find((x) => citedFile ? x.file === citedFile : true)
        ?? (allBySimple.get(cls) ?? []).find((x) => x.methods.some((m) => m.name === method));
      if (!c) { problems.push(`表 B ${head}: loader-api 摘要内没有类 ${cls}${citedFile ? `（源文件 ${citedFile}）` : ""}`); continue; }
      const m = c.methods.find((x) => x.name === method);
      if (!m) problems.push(`表 B ${head}: 摘要内 ${cls}${citedFile ? `（${citedFile}）` : ""} 没有方法 ${method}`);
      else if (m.signature !== sig) problems.push(`表 B ${head}: 签名与摘要不一致（档内「${sig}」/ 摘要「${m.signature}」）`);
    }

    // R2 表 C 必须等于重新派生的 needle 清单
    const rowC = (secs.表C ?? []).map((c) => (c[0].match(/`([^`]+)`/) ?? [])[1]).filter(Boolean);
    stats.tableC = rowC.length;
    for (const n of needles) if (!rowC.includes(n)) problems.push(`表 C 缺 needle ${n}（porting 页派生）`);
    for (const n of rowC) if (!needles.includes(n)) problems.push(`表 C 多出 ${n}：不在本档派生清单内`);
    for (const cells of secs.表C ?? []) {
      const n = (cells[0].match(/`([^`]+)`/) ?? [])[1];
      if (n && !(cells[1] ?? "").trim()) problems.push(`表 C ${n}: 没有 26.1.2 现名`);
    }

    // R4 反克隆：26.1.2/knowledge 任一文件不得与 1.21.11/knowledge 同哈希
    if (existsSync(cloneDir)) {
      const cloneHash = new Map(
        walkText(cloneDir).map((f) => [createHash("sha256").update(readFileSync(f)).digest("hex"), f.replace(/\\/g, "/")]));
      for (const f of walkText(join(packDir, "knowledge"))) {
        const h = createHash("sha256").update(readFileSync(f)).digest("hex");
        if (cloneHash.has(h)) problems.push(`26.1.2 知识文件 ${f.replace(/\\/g, "/").split("/knowledge/")[1]} 与 1.21.11 档 ${cloneHash.get(h)} 同哈希（克隆嫌疑）`);
      }
    }
  }

  // R5 AGENTS.md 要让宿主找得到这张表，并写清 26.1/26.1.1 折叠到 26.1.2
  const agentsPath = join(packDir, "AGENTS.md");
  if (!existsSync(agentsPath)) problems.push("缺少 fabric/26.1.2/AGENTS.md");
  else {
    const a = readFileSync(agentsPath, "utf8");
    if (!a.includes("verified-api-26.1.2.md")) problems.push("AGENTS.md 未指向 verified-api-26.1.2.md（知识表对 session 读者不可发现）");
    if (!/26\.1\.1/.test(a) || !a.includes("knowledgeVersion")) problems.push("AGENTS.md 未写清 26.1/26.1.1 → knowledgeVersion 折叠到 26.1.2");
    if (!a.includes("禁止克隆")) problems.push("AGENTS.md 丢了「禁止克隆 fabric/1.21.11/knowledge」约束");
  }

  // R3 两条容忍规则：Tier-1 已死类名代码块内零容忍；块内 Tier-2 名必须邻近禁止措辞
  if (!opts.skipTolerance && needles.length) {
    const files = walkText(packDir);
    stats.files = files.length;
    const prefix = packDir.replace(/\\/g, "/") + "/";
    for (const f of files) {
      const rel = f.replace(/\\/g, "/").slice(prefix.length);
      const text = readFileSync(f, "utf8");
      const lines = text.split(/\r?\n/);
      const inFence = new Array(lines.length).fill(false);
      let open = false;
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*(```|~~~)/.test(lines[i])) { open = !open; continue; }
        inFence[i] = open;
      }
      for (let i = 0; i < lines.length; i++) {
        for (const n of needles) {
          if (!new RegExp(`\\b${n}\\b`).test(lines[i])) continue;
          stats.tier1++;
          if (inFence[i]) { problems.push(`${rel}:${i + 1} 代码块内出现已死类名 ${n} :: ${lines[i].trim().slice(0, 90)}`); continue; }
          if (!targets.get(n).some((t) => lines[i].includes(t)) && !F2612_MARKER.test(lines[i])) {
            problems.push(`${rel}:${i + 1} 提到 ${n} 但整行无 26.1.2 现名也无禁止措辞 :: ${lines[i].trim().slice(0, 90)}`);
          }
        }
        for (const n of F2612_TIER2) {
          if (!lines[i].includes(n)) continue;
          stats.tier2++;
          if (!inFence[i]) continue;
          const ctx = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join("\n");
          const at = text.indexOf(lines[i]);
          const whole = text.slice(Math.max(0, at - 240), at + lines[i].length + 240);
          if (F2612_MARKER.test(ctx) || F2612_MARKER.test(whole)) continue;
          problems.push(`${rel}:${i + 1} 代码块内出现 Yarn/邻版名 ${n} :: ${lines[i].trim().slice(0, 90)}`);
        }
      }
    }
  }

  // R6 session 真路径必须把这张表递出去（activate_platform_pack 唯一能证明「可读」的出口）
  if (!opts.skipSession) {
    const session = sessionPlatformPack({ platform: "fabric", minecraftVersion: "26.1.2", repoRoot: opts.sessionRoot ?? join(packDir, "..", "..") });
    const api = session?.verifiedApi ?? [];
    stats.sessionStatus = session?.ok ? "ok" : String(session?.action?.code ?? "fail");
    stats.verifiedApi = api.length;
    if (!session?.ok) problems.push(`session fabric 26.1.2 不 ok（${stats.sessionStatus}）：知识表对宿主不可达`);
    if (!api.some((x) => String(x.path).endsWith("verified-api-26.1.2.md"))) {
      problems.push("activate_platform_pack session 的 verifiedApi 里没有 verified-api-26.1.2.md（知识表未进入会话）");
    }
  }
  return { problems, stats };
}

async function testFabric2612Knowledge() {
  const { problems, stats } = scanFabric2612Knowledge();
  assert.equal(stats.needles, 72, `needle 清单应 72 条，实际 ${stats.needles}`);
  assert.equal(stats.tableC, stats.needles, `表 C 行数应等于派生 needle 数 ${stats.needles}，实际 ${stats.tableC}`);
  assert.ok(stats.files >= 400, `本档应扫到 ≥400 个文本文件（含 7 个投影树），实际 ${stats.files}`);
  assert.ok(stats.tableA >= 60 && stats.tableB >= 10, `表 A/表 B 行数异常 ${stats.tableA}/${stats.tableB}`);
  assert.ok(stats.tier1 >= 80 && stats.tier2 >= 400, `needle 命中数异常 tier1=${stats.tier1} tier2=${stats.tier2}`);
  assert.equal(stats.verifiedApi, 1, `session 应递出 1 份 verified-api，实际 ${stats.verifiedApi}`);
  assert.deepEqual(problems, [], `26.1.2 知识门禁:\n  ${problems.join("\n  ")}`);

  const SHEET = join(REPO_ROOT, F2612_PACK_REL, ...F2612_SHEET_REL.split("/"));
  const sheetText = readFileSync(SHEET, "utf8");
  const agentsText = readFileSync(join(REPO_ROOT, F2612_PACK_REL, "AGENTS.md"), "utf8");
  const withPack = (name, needle, mutate, opt = {}) => {
    const tmp = mkdtempSync(join(tmpdir(), "mc-skill-f2612-"));
    try {
      const pack = join(tmp, "fabric/26.1.2");
      mkdirSync(join(pack, "knowledge/common"), { recursive: true });
      writeFileSync(join(pack, "knowledge/common/verified-api-26.1.2.md"), sheetText);
      writeFileSync(join(pack, "AGENTS.md"), agentsText);
      mutate(pack);
      const r = scanFabric2612Knowledge({ packDir: pack, ...opt });
      assert.ok(r.problems.length > 0, `${name}: 注入后门禁仍然全绿`);
      const hit = r.problems.filter((p) => p.includes(needle));
      assert.ok(hit.length > 0, `${name}: 门禁报错但不含「${needle}」→ ${JSON.stringify(r.problems.slice(0, 2))}`);
      return hit.length;
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  };
  const SKIP = { skipTolerance: true, skipSession: true };
  const sheetTo = (mutate) => (pack) => {
    const p = join(pack, "knowledge/common/verified-api-26.1.2.md");
    writeFileSync(p, mutate(readFileSync(p, "utf8")));
  };
  const agentsTo = (mutate) => (pack) => {
    const p = join(pack, "AGENTS.md");
    writeFileSync(p, mutate(readFileSync(p, "utf8")));
  };
  const touched = {
    表A假FQCN: withPack("表A 假 FQCN", "loader-api 摘要内没有", sheetTo((s) =>
      s.replace("net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint", "net.fabricmc.fabric.api.datagen.v1.NoSuchEntrypoint")), SKIP),
    表A假docs页: withPack("表A 假 docs id", "docs 页", sheetTo((s) =>
      s.replace("`26.1.2/develop_data-generation_recipes`", "`26.1.2/develop_no_such_page`")), SKIP),
    表A名字不在页内: withPack("表A 名字与页面对不上", "正文里没有", sheetTo((s) =>
      s.replace("| `AttackBlockCallback` | loader-api `net.fabricmc.fabric.api.event.player.AttackBlockCallback` | docs `26.1.2/develop_events` |",
        "| `AttackBlockCallback` | loader-api `net.fabricmc.fabric.api.event.player.AttackBlockCallback` | docs `26.1.2/develop_networking` |")), SKIP),
    表B假签名: withPack("表B 假签名", "签名与摘要不一致", sheetTo((s) =>
      s.replace("`void register(T)`", "`void registerCallback(T)`")), SKIP),
    表C漏needle: withPack("表C 漏一行", "表 C 缺 needle FabricDataOutput", sheetTo((s) =>
      s.replace(/\| `FabricDataOutput` \|[^\n]*\n/, "")), SKIP),
    表C多余名: withPack("表C 多余一行", "表 C 多出 FabricGhostProvider", sheetTo((s) =>
      s.replace(/\| `FabricDataOutput` \|/, "| `FabricGhostProvider` | `FabricNothing` |\n| `FabricDataOutput` |")), SKIP),
    "克隆1.21.11": withPack("整文件克隆 1.21.11", "同哈希", (pack) =>
      writeFileSync(join(pack, "knowledge/common/glossary.md"),
        readFileSync(join(REPO_ROOT, "fabric/1.21.11/knowledge/common/glossary.md"), "utf8")), SKIP),
    AGENTS失焦: withPack("AGENTS 不再指向知识表", "未指向 verified-api-26.1.2.md", agentsTo((a) =>
      a.replace(/verified-api-26\.1\.2\.md/g, "某张表")), SKIP),
    AGENTS折叠缺失: withPack("AGENTS 折叠说明被删", "knowledgeVersion 折叠", agentsTo((a) =>
      a.replace(/\*\*版本折叠：\*\*[^\n]*\n/, "")), SKIP),
    缺知识表: withPack("知识表整个缺失", `缺少 ${F2612_SHEET_REL}`, (pack) =>
      rmSync(join(pack, "knowledge/common/verified-api-26.1.2.md")), SKIP),
    session不递表: withPack("表放错目录 → session 空", "verifiedApi 里没有", (pack) => {
      rmSync(join(pack, "knowledge/common/verified-api-26.1.2.md"));
      writeFileSync(join(pack, "knowledge/verified-api-26.1.2.md"), sheetText);
    }, { skipTolerance: true }),
  };
  // R3 单独再测：needle 进代码块 / 进无措辞散文 / 块内 Tier-2 名，各必须被抓；合法措辞不得误报
  const r3tmp = mkdtempSync(join(tmpdir(), "mc-skill-f2612t-"));
  try {
    const pack = join(r3tmp, "fabric/26.1.2");
    mkdirSync(join(pack, "knowledge/common"), { recursive: true });
    writeFileSync(join(pack, "knowledge/common/verified-api-26.1.2.md"), sheetText);
    writeFileSync(join(pack, "AGENTS.md"), agentsText);
    const gate = (file, text) => {
      writeFileSync(join(pack, file), text);
      const r = scanFabric2612Knowledge({ packDir: pack, skipSession: true });
      rmSync(join(pack, file), { force: true });
      return r;
    };
    mkdirSync(join(pack, ".cursor/rules"), { recursive: true });
    mkdirSync(join(pack, ".claude/skills/mc-x"), { recursive: true });
    const fence = gate(".cursor/rules/07-datagen.mdc", "# 07\n\n```\nIF 标签 → FabricTagProvider 系\n```\n");
    assert.ok(fence.problems.some((p) => p.includes("代码块内出现已死类名 FabricTagProvider")), `块内 needle 未报 → ${JSON.stringify(fence.problems.slice(0, 3))}`);
    const prose = gate(".claude/skills/mc-x/SKILL.md", "# x\n\n用 FabricTagProvider 注册标签。\n");
    assert.ok(prose.problems.some((p) => p.includes("无 26.1.2 现名也无禁止措辞")), `无措辞散文未报 → ${JSON.stringify(prose.problems.slice(0, 3))}`);
    const tier2 = gate(".claude/skills/mc-x/SKILL.md", "# x\n\n```java\nItemGroup group = ItemGroup.CREATE;\n```\n");
    assert.ok(tier2.problems.some((p) => p.includes("代码块内出现 Yarn/邻版名 ItemGroup")), `块内 Tier-2 未报 → ${JSON.stringify(tier2.problems.slice(0, 3))}`);
    const okProse = gate(".claude/skills/mc-x/SKILL.md", "# x\n\n`FabricTagProvider` 已改名；本档写 `FabricTagsProvider`。\n");
    assert.deepEqual(okProse.problems, [], `合法措辞被误报 → ${JSON.stringify(okProse.problems.slice(0, 3))}`);
  } finally {
    rmSync(r3tmp, { recursive: true, force: true });
  }
  for (const [k, v] of Object.entries(touched)) assert.ok(v > 0, `注入 ${k} 未命中`);
  console.log(`  [fabric2612] files=${stats.files} needles=${stats.needles} tableA=${stats.tableA} tableB=${stats.tableB} tableC=${stats.tableC} tier1=${stats.tier1} tier2=${stats.tier2} verifiedApi=${stats.verifiedApi} poisons=${Object.keys(touched).length + 4}`);
}


// ── S15 T4：仓库内 loader-api 摘要数据卫生门禁 ─────────────────────────────
// store.ts scanDir() 把官方目录里任意非 skip 的 *.json 直接当成一个可命中的 key，
// 所以生成器写出的空摘要 / 缺字段脏数据不会报错，只会被当成「已核实」答案返回。
const LOADER_API_SKIP_FILES = new Set([
  "index.json",
  "status.json",
  "extracted-classes.json",
  "validate-rules-last.json",
  "clone-audit-last.json",
  "fetch-jars-last.json",
  "pin-mdk-last.json",
  "fetch-loader-api-sources-last.json",
  "skipped-ingest.json",
]);
const LOADER_API_KEY_RE = /^(\d+\.\d+(?:\.\d+)?)-[a-z0-9][a-z0-9.-]*$/;
const ABS_PATH_RE = /(?:^|["'\s(:])(?:[A-Za-z]:[\\/]|\/home\/|\/Users\/|\/tmp\/|\\\\)/;

function isLoaderApiSummaryName(name) {
  return name.endsWith(".json") && !LOADER_API_SKIP_FILES.has(name) && !name.endsWith("-last.json");
}

function findAbsPathStrings(value, pathIn, hits) {
  if (typeof value === "string") {
    if (ABS_PATH_RE.test(value)) hits.push(`${pathIn}="${value.slice(0, 60)}"`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => findAbsPathStrings(v, `${pathIn}[${i}]`, hits));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) findAbsPathStrings(v, `${pathIn}.${k}`, hits);
  }
}

function scanLoaderApiData(dir) {
  const problems = [];
  const summaries = new Map();
  for (const name of readdirSync(dir).filter((n) => !n.endsWith(".json"))) {
    if (name === "README.md" || name === "sidecar-templates") continue;
    problems.push(`${name}: 官方摘要目录只允许 README.md / sidecar-templates / *.json，出现 ${name}`);
  }
  if (existsSync(join(dir, "sidecar-templates"))) {
    for (const n of readdirSync(join(dir, "sidecar-templates"))) {
      if (/\.(java|class)$/.test(n)) problems.push(`sidecar-templates/${n}: 反编译产物不得入库（只许留 cache）`);
    }
  }
  for (const name of readdirSync(dir).filter(isLoaderApiSummaryName)) {
    const key = name.replace(/\.json$/, "");
    let j;
    try {
      j = JSON.parse(readFileSync(join(dir, name), "utf8"));
    } catch (e) {
      problems.push(`${key}: JSON 解析失败 → ${String(e.message).slice(0, 60)}`);
      continue;
    }
    summaries.set(key, j);
    const km = key.match(LOADER_API_KEY_RE);
    if (!km) {
      problems.push(`${key}: 键名形状非法（须 <mcver>-<loader>），查询侧永远命中不到却仍占目录`);
      continue;
    }
    const classes = Array.isArray(j.classes) ? j.classes : [];
    if (classes.length === 0) problems.push(`${key}: 空摘要（classes=0），查询会返回 found:true 但零方法`);
    if (!Number.isInteger(j.classCount) || j.classCount !== classes.length) {
      problems.push(`${key}: classCount=${j.classCount} != classes.length=${classes.length}`);
    }
    if (!j.mappingsVersion) problems.push(`${key}: 缺 mappingsVersion，摘要失去可追溯的映射出处`);
    if (!j.source) problems.push(`${key}: 缺 source，无法区分官方代下与用户自备 jar`);
    else if (j.source === "user_jar") problems.push(`${key}: 仓库内摘要 source 不得为 user_jar（用户自备 jar 只允许写 cache overlay）`);
    if (j.invalid === true) problems.push(`${key}: invalid=true 仍留在官方目录（store 会静默跳过，目录却显示已入库）`);
    const hasIdx = Array.isArray(j.fqcnIndex);
    const idxCount = j.fqcnIndexCount ?? 0;
    if (hasIdx !== idxCount > 0) problems.push(`${key}: fqcnIndex 与 fqcnIndexCount=${idxCount} 不一致`);
    if (hasIdx && j.fqcnIndex.length !== idxCount) problems.push(`${key}: fqcnIndex 实长 ${j.fqcnIndex.length} != fqcnIndexCount=${idxCount}`);
    if (j.version !== undefined && j.version !== km[1]) problems.push(`${key}: version=${j.version} 与键名版本段 ${km[1]} 不一致`);
    const leaks = [];
    findAbsPathStrings(j, "$", leaks);
    if (leaks.length) problems.push(`${key}: 疑似本机绝对路径泄漏 → ${leaks.slice(0, 2).join(" / ")}`);
  }

  const idx = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
  const st = JSON.parse(readFileSync(join(dir, "status.json"), "utf8"));
  if (idx.cache !== "$MC_SKILL_CACHE") problems.push(`index.cache=${idx.cache}：必须写成 $MC_SKILL_CACHE，不得钉本机 cache 绝对路径`);
  if (st.cache !== "$MC_SKILL_CACHE") problems.push(`status.cache=${st.cache}：必须写成 $MC_SKILL_CACHE`);
  if (st.ok !== true) problems.push(`status.ok=${st.ok}：官方目录必须报告 ok:true`);
  const seenRowFiles = new Set();
  for (const row of idx.jars) {
    const rowKey = String(row.file).replace(/\.jar$/, "");
    if (seenRowFiles.has(rowKey)) problems.push(`index: ${rowKey} 重复登记`);
    seenRowFiles.add(rowKey);
    const j = summaries.get(rowKey);
    if (!j) {
      problems.push(`index 有行 ${rowKey} 但缺对应摘要文件`);
      continue;
    }
    const bad = ["classCount", "fqcnIndexCount", "mappingsVersion", "source"].filter((f) => row[f] !== j[f]);
    if (bad.length) problems.push(`index 行 ${rowKey} 与摘要不一致：${bad.map((f) => `${f}=${row[f]} vs ${j[f]}`).join(", ")}`);
    if (row.invalid === true) problems.push(`index 行 ${rowKey} 标 invalid=true 却仍登记在目录`);
  }
  for (const key of summaries.keys()) {
    if (!seenRowFiles.has(key)) problems.push(`摘要 ${key} 未登记进 index.json（list 模式看不到）`);
  }
  const stKeys = new Set((st.decompiled ?? []).map((f) => String(f).replace(/\.jar$/, "")));
  for (const key of summaries.keys()) if (!stKeys.has(key)) problems.push(`摘要 ${key} 未登记进 status.decompiled（登记缺失）`);
  for (const key of stKeys) if (!summaries.has(key)) problems.push(`status.decompiled 登记了 ${key} 但没有摘要文件（登记过期）`);
  for (const [key, mv] of Object.entries(st.mappingsVersion ?? {})) {
    if (!summaries.has(key)) problems.push(`status.mappingsVersion 有 ${key} 但无摘要文件（登记过期）`);
    else if (summaries.get(key).mappingsVersion !== mv) problems.push(`status.mappingsVersion[${key}]=${mv} != 摘要 ${summaries.get(key).mappingsVersion}`);
  }
  for (const key of summaries.keys()) {
    if (!(key in (st.mappingsVersion ?? {}))) problems.push(`status.mappingsVersion 缺 ${key}（生成器映射表未记全）`);
  }
  return { count: summaries.size, problems: problems.sort() };
}

async function testLoaderApiRepoDataHygiene() {
  const dir = join(REPO_ROOT, "mcp-server", "data", "loader-api-summaries");
  const clean = scanLoaderApiData(dir);
  assert.equal(clean.count, 36, `官方摘要应为 36 份，实际 ${clean.count}`);
  assert.deepEqual(clean.problems, [], `loader-api 数据卫生门禁:\n  ${clean.problems.join("\n  ")}`);

  const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
  const writeJson = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2), "utf8");
  const mutations = [
    ["空摘要", "空摘要", ["1.20.6-neoforge.json"], (t) => {
      const p = join(t, "1.20.6-neoforge.json");
      const j = readJson(p);
      j.classes = [];
      j.classCount = 0;
      writeJson(p, j);
    }],
    ["缺 mappingsVersion", "缺 mappingsVersion", ["1.21.5-neoforge.json"], (t) => {
      const p = join(t, "1.21.5-neoforge.json");
      const j = readJson(p);
      delete j.mappingsVersion;
      writeJson(p, j);
    }],
    ["source 写成 user_jar", "source 不得为 user_jar", ["1.21.10-neoforge.json"], (t) => {
      const p = join(t, "1.21.10-neoforge.json");
      const j = readJson(p);
      j.source = "user_jar";
      writeJson(p, j);
    }],
    ["缺 fqcnIndex", "fqcnIndex 与 fqcnIndexCount", ["1.20.1-neoforge.json"], (t) => {
      const p = join(t, "1.20.1-neoforge.json");
      const j = readJson(p);
      delete j.fqcnIndex;
      writeJson(p, j);
    }],
    ["脏文件名", "键名形状非法", ["probe-leftover.json"], (t) =>
      writeFileSync(join(t, "probe-leftover.json"), '{"classes":[],"classCount":0}', "utf8")],
    ["摘要未登记 index", "未登记进 index.json", ["9.9.9-neoforge.json"], (t) => {
      writeFileSync(
        join(t, "9.9.9-neoforge.json"),
        JSON.stringify(
          {
            classes: [{ name: "X" }],
            classCount: 1,
            fqcnIndexCount: 0,
            mappingsVersion: "parchment-9.9.9-2026.01.01",
            source: "official",
            version: "9.9.9",
          },
          null,
          2,
        ),
        "utf8",
      );
    }],
    ["index 与摘要不一致", "与摘要不一致", ["index.json"], (t) => {
      const p = join(t, "index.json");
      const j = readJson(p);
      j.jars.find((x) => x.file === "1.20.6-neoforge.jar").classCount = 1;
      writeJson(p, j);
    }],
    ["本机路径泄漏", "绝对路径泄漏", ["1.21.5-neoforge.json"], (t) => {
      const p = join(t, "1.21.5-neoforge.json");
      const j = readJson(p);
      j.note = "built on D:\\mc-skill-temp\\loader-jars";
      writeJson(p, j);
    }],
    ["cache 钉死本机", "必须写成 $MC_SKILL_CACHE", ["index.json"], (t) => {
      const p = join(t, "index.json");
      const j = readJson(p);
      j.cache = "D:\\mc-skill-temp";
      writeJson(p, j);
    }],
    ["java 入库", "反编译产物不得入库", ["sidecar-templates/Leak.java"], (t) =>
      writeFileSync(join(t, "sidecar-templates", "Leak.java"), "class Leak{}\n", "utf8")],
  ];
  // 目录 79MB：只拷一次，注入后按路径还原，避免 10 份全量拷贝
  const tmp = mkdtempSync(join(tmpdir(), "mc-skill-loaderapi-"));
  try {
    cpSync(dir, tmp, { recursive: true });
    for (const [name, needle, touched, mutate] of mutations) {
      mutate(tmp);
      const r = scanLoaderApiData(tmp);
      assert.ok(r.problems.length > 0, `${name}: 注入后门禁仍然全绿`);
      assert.ok(
        r.problems.some((p) => p.includes(needle)),
        `${name}: 门禁报错但不含「${needle}」→ ${JSON.stringify(r.problems.slice(0, 3))}`,
      );
      for (const rel of touched) {
        const src = join(dir, rel);
        if (existsSync(src)) cpSync(src, join(tmp, rel));
        else rmSync(join(tmp, rel), { force: true });
      }
      assert.deepEqual(scanLoaderApiData(tmp).problems, [], `${name}: 还原后门禁应重新全绿`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`  [loaderApiData] summaries=${clean.count} checks=${mutations.length} poisons=${mutations.length}`);
}

// ── S15 T3：0 字节 deflate 条目回归（zip-inflate A-1 上限）─────────────────
async function testZipInflateZeroByteDeflate() {
  const { inflateZipEntry, zipCrc32, ZipEntryLimitError } = await import("./dist/utils/zip-inflate.js");
  const { readZip } = await import("./dist/decompile/zip-util.js");
  const { deflateRawSync, inflateRawSync } = await import("node:zlib");

  // 用例数由实际调用导出（写死数字的话，删掉一条门禁照样报绿）
  let directCases = 0;
  const probeInflate = (compressed, opts) => {
    directCases++;
    return inflateZipEntry(compressed, opts);
  };

  // 记录修复存在的前提：zlib 不接受 maxOutputLength=0，抛的是未类型化 RangeError。
  const raw = (() => {
    try {
      inflateRawSync(deflateRawSync(Buffer.alloc(0)), { maxOutputLength: 0 });
      return null;
    } catch (e) {
      return e;
    }
  })();
  assert.ok(raw instanceof RangeError, `maxOutputLength=0 应抛 RangeError，实际 ${raw && raw.name}`);
  assert.ok(!(raw instanceof ZipEntryLimitError), "RangeError 未被 ZipEntryLimitError 覆盖 → 旧实现会在 readZip 里炸穿");

  const empty = probeInflate(deflateRawSync(Buffer.alloc(0)), { name: "META-INF/empty.txt", declaredSize: 0 });
  assert.ok(Buffer.isBuffer(empty) && empty.length === 0, `0 字节 deflate 条目应解出空 buffer，实际 ${empty && empty.length}`);

  // 谎报 0 但真有内容 → 必须 fail-closed 且是类型化错误（1 字节兜底上限没有放宽防线）
  const lie = (() => {
    try {
      return probeInflate(deflateRawSync(Buffer.from("not-empty-at-all")), { name: "lie.txt", declaredSize: 0 });
    } catch (e) {
      return e;
    }
  })();
  assert.ok(lie instanceof ZipEntryLimitError, `谎报 0 字节的条目必须被拒，实际 ${lie && lie.name}`);
  assert.ok(String(lie.code).startsWith("ZIP_ENTRY_"), `错误必须带 ZIP_ENTRY_* 码，实际 ${lie.code}`);

  const bomb = (() => {
    try {
      return probeInflate(deflateRawSync(Buffer.alloc(200000, 1)), { name: "bomb.bin", declaredSize: 10 });
    } catch (e) {
      return e;
    }
  })();
  assert.ok(bomb instanceof ZipEntryLimitError && bomb.code === "ZIP_ENTRY_BOMB_SUSPECTED", `膨胀超限须 BOMB_SUSPECTED，实际 ${bomb && bomb.code}`);

  const huge = (() => {
    try {
      return probeInflate(Buffer.from([0]), { name: "huge.bin", declaredSize: 300 * 1024 * 1024 });
    } catch (e) {
      return e;
    }
  })();
  assert.ok(huge instanceof ZipEntryLimitError && huge.code === "ZIP_ENTRY_TOO_LARGE", `声明超上限须 TOO_LARGE，实际 ${huge && huge.code}`);

  // 端到端：手搓 store + deflate + 0 字节 deflate 三条目 jar
  const parts = [];
  const central = [];
  let offset = 0;
  const push = (name, data, method) => {
    const compressed = method === 8 ? deflateRawSync(data) : data;
    const nameBuf = Buffer.from(name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x800, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(zipCrc32(data), 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    parts.push(local, nameBuf, compressed);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0x800, 8);
    cd.writeUInt16LE(method, 10);
    cd.writeUInt32LE(zipCrc32(data), 16);
    cd.writeUInt32LE(compressed.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += local.length + nameBuf.length + compressed.length;
  };
  push("empty-deflate.txt", Buffer.alloc(0), 8);
  push("hello.txt", Buffer.from("hello world"), 8);
  push("stored.txt", Buffer.from("stored"), 0);
  const cdBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(3, 8);
  eocd.writeUInt16LE(3, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  const map = readZip(Buffer.concat([...parts, cdBuf, eocd]));
  assert.equal(map.size, 3, `readZip 条目数应为 3，实际 ${map.size}`);
  assert.equal(map.get("empty-deflate.txt").length, 0, "0 字节 deflate 条目应经 readZip 正常读出");
  assert.equal(map.get("hello.txt").toString("utf8"), "hello world");
  assert.equal(map.get("stored.txt").toString("utf8"), "stored");
  assert.equal(directCases, 4, `直接过 inflateZipEntry 的用例应为 4 条，实际 ${directCases}`);
  console.log(`  [zipInflate] directCases=${directCases} readZip-entries=${map.size} zeroByteEntryOk=${map.get("empty-deflate.txt").length === 0}`);
}

// ---- S18：README / AGENTS 工具表 ↔ 实际注册集合（双向 diff，计数全由执行导出）----
const DOC_TOOL_GROUP_IDS = new Set(["1", "1b", "2", "3", "4", "5", "6", "6b", "7", "8", "9", "10", "11", "12", "13"]);

function docMdSlice(lines, startRe, stopRe) {
  const s = lines.findIndex((l) => startRe.test(l));
  if (s < 0) return null;
  const e = lines.findIndex((l, i) => i > s && stopRe.test(l));
  return lines.slice(s, e < 0 ? lines.length : e);
}

function docToolNamesFromCells(cells, registered) {
  const regSet = new Set(registered);
  const names = new Set();
  const unknown = [];
  for (const cell of cells) {
    for (const m of cell.matchAll(/`([^`]+)`/g)) {
      const t = m[1].trim();
      if (t.endsWith("*")) {
        const prefix = t.slice(0, -1);
        const hits = registered.filter((n) => n.startsWith(prefix));
        if (!hits.length) unknown.push(t);
        hits.forEach((h) => names.add(h));
      } else if (regSet.has(t)) {
        names.add(t);
      } else {
        unknown.push(t);
      }
    }
  }
  return { names, unknown };
}

function docToolNameColumnCells(lines) {
  return lines
    .filter((l) => l.trim().startsWith("|"))
    .map((l) => (l.split("|")[1] ?? "").trim())
    .filter((c) => c && !/^[-: ]*$/.test(c) && c !== "工具");
}

function docReadmeGroups(lines) {
  const groups = [];
  let cur = null;
  for (const l of lines) {
    if (/^### /.test(l)) {
      const h = /^### (\d+[a-z]?)(?:\. | )/.exec(l);
      cur = h && DOC_TOOL_GROUP_IDS.has(h[1]) ? { id: h[1], heading: l.trim(), declared: null, cells: [] } : null;
      if (cur) {
        const d = /（(\d+)）|\((\d+)\)/.exec(l);
        cur.declared = d ? Number(d[1] ?? d[2]) : null;
        groups.push(cur);
      }
      continue;
    }
    if (!cur || !l.trim().startsWith("|")) continue;
    const c = (l.split("|")[1] ?? "").trim();
    if (!c || /^[-: ]*$/.test(c) || c === "工具") continue;
    cur.cells.push(c);
  }
  return groups;
}

function diffDocToolTables({ readme, agents, registered }) {
  const problems = [];
  const registeredList = [...registered];
  if (new Set(registeredList).size !== registeredList.length) {
    problems.push("实际注册集合里存在重复工具名");
  }

  const readmeSec = docMdSlice(readme.split(/\r?\n/), /^## MCP Server 工具/, /^## (?!MCP Server 工具)/);
  if (!readmeSec) problems.push("README 找不到「## MCP Server 工具」节（锚点被改）");
  const readmeGroups = readmeSec ? docReadmeGroups(readmeSec) : [];
  if (readmeSec && readmeGroups.length !== DOC_TOOL_GROUP_IDS.size) {
    problems.push(`README 工具分节数 ${readmeGroups.length}，与预期编号集 ${DOC_TOOL_GROUP_IDS.size} 不符`);
  }
  const totalDecl = readmeSec ? /^## MCP Server 工具（(\d+) 个）/.exec(readmeSec[0]) : null;
  if (readmeSec && !totalDecl) {
    problems.push(`README 工具节标题未按「（N 个）」声明总数：${(readmeSec[0] ?? "").trim()}`);
  } else if (totalDecl && Number(totalDecl[1]) !== registeredList.length) {
    problems.push(`README 标题声明 ${totalDecl[1]} 个工具，实际注册 ${registeredList.length} 个`);
  }

  const groupUnion = new Set();
  const firstGroupOf = new Map();
  for (const g of readmeGroups) {
    const { names, unknown } = docToolNamesFromCells(g.cells, registeredList);
    for (const u of unknown) problems.push(`README §${g.id} 出现未注册的工具名 \`${u}\``);
    if (!g.cells.length) problems.push(`README §${g.id} 没有工具表行：${g.heading}`);
    if (g.declared === null) problems.push(`README §${g.id} 标题未声明计数：${g.heading}`);
    else if (g.declared !== names.size) problems.push(`README §${g.id} 声明 ${g.declared} 个，表内实际 ${names.size} 个`);
    for (const n of names) {
      if (firstGroupOf.has(n)) problems.push(`README 工具 \`${n}\` 同时出现在 §${firstGroupOf.get(n)} 与 §${g.id}`);
      else firstGroupOf.set(n, g.id);
      groupUnion.add(n);
    }
  }
  for (const n of registeredList) if (!groupUnion.has(n)) problems.push(`README 工具表缺 \`${n}\``);

  const agentsSec = docMdSlice(agents.split(/\r?\n/), /^#+ MCP Server 工具/, /^### 工具边界/);
  if (!agentsSec) problems.push("AGENTS.md 找不到「MCP Server 工具」表节（锚点被改）");
  const agentsCells = agentsSec ? docToolNameColumnCells(agentsSec) : [];
  if (agentsSec && agentsCells.length === 0) problems.push("AGENTS.md 工具表解析出 0 行（表格结构变了？）");
  const agentsNames = docToolNamesFromCells(agentsCells, registeredList);
  for (const u of agentsNames.unknown) problems.push(`AGENTS.md 出现未注册的工具名 \`${u}\``);
  for (const n of registeredList) if (!agentsNames.names.has(n)) problems.push(`AGENTS.md 工具表缺 \`${n}\``);

  return {
    problems,
    stats: {
      registered: registeredList.length,
      readmeGroups: readmeGroups.length,
      readmeRows: readmeGroups.reduce((a, g) => a + g.cells.length, 0),
      readmeTools: groupUnion.size,
      agentsRows: agentsCells.length,
      agentsTools: agentsNames.names.size,
    },
  };
}

async function testDocsToolTablesMatchRegistry() {
  const { listAllToolSchemas } = await import("./dist/tool-registry.js");
  const registered = listAllToolSchemas().map((t) => t.name);
  assert.ok(registered.length > 0, "listAllToolSchemas 返回空集合");
  const readme = readFileSync(join(REPO_ROOT, "README.md"), "utf8");
  const agents = readFileSync(join(REPO_ROOT, "AGENTS.md"), "utf8");
  const base = { readme, agents, registered };

  const clean = diffDocToolTables(base);
  assert.deepEqual(clean.problems, [], `干净文档应零差异，实际：\n${clean.problems.join("\n")}`);
  assert.equal(clean.stats.readmeTools, clean.stats.registered, "README 覆盖的工具数应等于实际注册数");
  assert.equal(clean.stats.agentsTools, clean.stats.registered, "AGENTS 覆盖的工具数应等于实际注册数");

  const poisoned = [
    ["README 少一行工具", { ...base, readme: readme.replace(/^\|[ \t]*`check_dependencies`[ \t]*\|.*\n/m, "") }, /缺 `check_dependencies`/],
    ["README 总数标错", { ...base, readme: readme.replace("## MCP Server 工具（80 个）", "## MCP Server 工具（79 个）") }, /标题声明 79/],
    ["README 分节计数标错", { ...base, readme: readme.replace("### 10. 代码生成模板（8）", "### 10. 代码生成模板（7）") }, /§10 声明 7 个/],
    ["README 出现未注册名", { ...base, readme: readme.replace("### 11. 日志与依赖诊断（4）", "### 11. 日志与依赖诊断（4）\n\n| 工具 | 作用 |\n|------|------|\n| `not_a_real_tool` | x |") }, /未注册的工具名 `not_a_real_tool`/],
    ["README 跨节重复", { ...base, readme: readme.replace("### 11. 日志与依赖诊断（4）", "### 11. 日志与依赖诊断（4）\n\n| 工具 | 作用 |\n|------|------|\n| `validate_at` | x |") }, /同时出现在 §/],
    ["AGENTS 漏一个工具", { ...base, agents: agents.replace(" / `download_official_mdk`", "") }, /AGENTS\.md 工具表缺 `download_official_mdk`/],
    ["AGENTS 名字写错", { ...base, agents: agents.replace("`analyze_bedrock_log`", "`analyze_bedrock_logs`") }, /AGENTS\.md 出现未注册的工具名/],
    ["AGENTS 表锚点被改", { ...base, agents: agents.replace("## MCP Server 工具（可选）", "## MCP 工具（可选）") }, /AGENTS\.md 找不到/],
  ];
  for (const [label, input, anchor] of poisoned) {
    const got = diffDocToolTables(input);
    assert.ok(got.problems.length > 0, `投毒「${label}」应至少报一条问题`);
    assert.ok(
      got.problems.some((p) => anchor.test(p)),
      `投毒「${label}」应命中锚点 ${anchor}，实际：\n${got.problems.join("\n")}`,
    );
    const recheck = diffDocToolTables(base);
    assert.deepEqual(recheck.problems, [], `投毒「${label}」后原文件应仍然零差异`);
  }

  const s = clean.stats;
  console.log(
    `  [docs-tool-tables] registered=${s.registered} README groups=${s.readmeGroups} rows=${s.readmeRows} tools=${s.readmeTools} ` +
      `AGENTS rows=${s.agentsRows} tools=${s.agentsTools} 双向零差异 投毒=${poisoned.length} 次全命中`,
  );
}

/**
 * S19：check_publish_ready 的发布清单必须现场读 community_knowledge/authored/publishing.md。
 * 断链（读不到清单）与改文档（换字段）都要体现在结果里；缺项永远只 warning，不动 ready。
 */
function testPublishChecklistFromCommunityDoc() {
  const modsTomlWith = (modsBody) =>
    `modLoader="javafml"\nloaderVersion="[47,)"\nversion="1.0.0"\nlicense="MIT"\n${modsBody}`;
  const fieldWarnings = (r) => r.warnings.filter((w) => /「元数据」要求/.test(w));
  const prevCommunity = process.env.MC_SKILL_COMMUNITY;
  const docRoot = mkdtempSync(join(tmpdir(), "mc-pub-doc-"));
  const emptyRoot = mkdtempSync(join(tmpdir(), "mc-pub-empty-"));
  const projRoot = mkdtempSync(join(tmpdir(), "mc-pub-proj-"));
  try {
    delete process.env.MC_SKILL_COMMUNITY;

    // 1) 同一工程：缺清单字段 → 每个缺项一条 warning；补齐后 warning 下降，errors/ready 不变
    const thin = checkPublishReady({ modsToml: modsTomlWith(`[[mods]]\nmodId="examplemod"\n`) });
    const full = checkPublishReady({
      modsToml: modsTomlWith(`[[mods]]\nmodId="examplemod"\ndisplayName="Example"\ndescription="d"\n`),
    });
    assert.equal(thin.publishing?.available, true, JSON.stringify(thin.publishing));
    assert.ok(fieldWarnings(thin).length > 0, "缺字段应有 publishing warning");
    assert.ok(thin.publishing.missing.includes("mods.toml:displayName"), JSON.stringify(thin.publishing.missing));
    assert.deepEqual(full.publishing.missing, [], JSON.stringify(full.publishing.missing));
    assert.ok(
      full.warnings.length < thin.warnings.length,
      `补齐后 warning 应更少：${full.warnings.length} vs ${thin.warnings.length}`,
    );
    assert.equal(full.ready, thin.ready, JSON.stringify([full.errors, thin.errors]));
    assert.deepEqual(full.errors, thin.errors, "清单检查不得改变 errors");
    assert.ok(thin.checks.some((c) => /publishing\.md 清单/.test(c)), JSON.stringify(thin.checks));

    // 2) 人在环边界：不上传声明仍在，且绝不出现「已代发布」
    for (const r of [thin, full]) {
      assert.ok(r.warnings.some((w) => /不上传/.test(w)), JSON.stringify(r.warnings));
      assert.ok(!r.warnings.some((w) => /已上传|已发布|已代发布/.test(w)), JSON.stringify(r.warnings));
    }

    // 3) 纯 Fabric 工程不被要求 Forge 的 mods.toml 字段（要求按文件名绑定）
    const fabric = checkPublishReady({
      fabricModJson: JSON.stringify({ id: "examplemod", version: "1.0.0", license: "MIT" }),
    });
    assert.equal(fabric.ready, true, JSON.stringify(fabric));
    assert.deepEqual(fabric.publishing.missing, [], JSON.stringify(fabric.publishing));
    assert.equal(fieldWarnings(fabric).length, 0, JSON.stringify(fabric.warnings));

    // 4) 投毒 A：换掉文档里的字段 → 要求随之改变，证明字段清单没写死
    mkdirSync(join(docRoot, "authored"), { recursive: true });
    writeFileSync(
      join(docRoot, "authored", "publishing.md"),
      [
        "---",
        "id: authored/publishing",
        "sourceKind: authored",
        "---",
        "",
        "# 测试用发布清单",
        "",
        "## 发布前检查清单",
        "",
        "1. **元数据**",
        "   - Forge：`mods.toml` 的 `authorBio`",
        "2. **自测**",
        "   - 干净客户端能进世界",
        "",
      ].join("\n"),
    );
    process.env.MC_SKILL_COMMUNITY = docRoot;
    const swapped = checkPublishReady({
      modsToml: modsTomlWith(`[[mods]]\nmodId="examplemod"\ndisplayName="Example"\n`),
    });
    assert.deepEqual(swapped.publishing.missing, ["mods.toml:authorBio"], JSON.stringify(swapped.publishing));
    assert.ok(!fieldWarnings(swapped).some((w) => /displayName/.test(w)), "文档没点 displayName 就不该要求它");

    // 5) 投毒 B：断开读取（清单里没有可机器核的条目）→ 降级 warning，不是静默通过
    process.env.MC_SKILL_COMMUNITY = emptyRoot;
    const broken = checkPublishReady({ modsToml: modsTomlWith(`[[mods]]\nmodId="examplemod"\n`) });
    assert.equal(broken.publishing.available, false, JSON.stringify(broken.publishing));
    assert.equal(fieldWarnings(broken).length, 0, JSON.stringify(broken.warnings));
    assert.ok(
      broken.warnings.some((w) => /未取到发布清单字段要求/.test(w)),
      JSON.stringify(broken.warnings),
    );
    assert.equal(broken.ready, thin.ready, "读不到清单同样不得影响 ready");

    // 6) logoFile 真实存在性（清单第 4 条）：补上文件后该 warning 消失
    delete process.env.MC_SKILL_COMMUNITY;
    mkdirSync(join(projRoot, "src", "main", "resources"), { recursive: true });
    const logoToml = modsTomlWith(
      `[[mods]]\nmodId="examplemod"\ndisplayName="Example"\ndescription="d"\nlogoFile="logo.png"\n`,
    );
    const noLogo = checkPublishReady({ projectPath: projRoot, modsToml: logoToml });
    assert.ok(
      noLogo.publishing.missing.includes("mods.toml:logoFile=logo.png"),
      JSON.stringify(noLogo.publishing.missing),
    );
    writeFileSync(join(projRoot, "src", "main", "resources", "logo.png"), "png");
    const withLogo = checkPublishReady({ projectPath: projRoot, modsToml: logoToml });
    assert.equal(withLogo.publishing.missing.length, 0, JSON.stringify(withLogo.publishing.missing));
    assert.ok(
      !withLogo.warnings.some((w) => /logoFile/.test(w)),
      JSON.stringify(withLogo.warnings),
    );

    console.log(
      `  [publish-checklist] 文档字段=${thin.publishing.fields.length} 人工项=${thin.publishing.manual.length} ` +
        `缺项 warning ${fieldWarnings(thin).length}→${fieldWarnings(full).length}（总 ${thin.warnings.length}→${full.warnings.length}）` +
        ` Fabric 误报=${fieldWarnings(fabric).length} 投毒=换字段/断链/真实存在性 3 类全命中 ready 不变=${thin.ready === full.ready}`,
    );
  } finally {
    if (prevCommunity === undefined) delete process.env.MC_SKILL_COMMUNITY;
    else process.env.MC_SKILL_COMMUNITY = prevCommunity;
    rmSync(docRoot, { recursive: true, force: true });
    rmSync(emptyRoot, { recursive: true, force: true });
    rmSync(projRoot, { recursive: true, force: true });
  }
}

/**
 * S20：会改仓库文件的维护脚本，写盘必须全部经 scripts/_lib/write-guard.mjs（默认 dry-run，--write 才落盘）。
 * 覆盖范围 = scripts/_oneoff/ + scripts/_lib/ 全部脚本 + 点名写仓库 data/ 的顶层脚本。
 * 纯函数：输入 [{ rel, text }]，输出 { problems, stats }；不读不写磁盘。
 */
const SCRIPT_WRITE_GUARD_REL = "scripts/_lib/write-guard.mjs";
const SCRIPT_WRITE_GUARD_DIRS = ["scripts/_oneoff", "scripts/_lib"];
const SCRIPT_WRITE_GUARD_FILES = [
  "scripts/index-qsl-verified.mjs",
  "scripts/fetch-neoforge-primers.mjs",
];
function scriptRequiresGuard(rel) {
  return rel.startsWith("scripts/_oneoff/") || SCRIPT_WRITE_GUARD_FILES.includes(rel);
}
const FS_MUTATION_PRIMITIVES = [
  "writeFileSync",
  "appendFileSync",
  "copyFileSync",
  "mkdirSync",
  "rmSync",
  "unlinkSync",
  "renameSync",
  "createWriteStream",
  "openSync",
  "truncateSync",
];

function diffScriptWriteGuard(files) {
  const problems = [];
  let guardAdopted = 0;
  let primitiveHits = 0;
  let outsideGuardHits = 0;
  let emitCallSites = 0;
  for (const file of files) {
    const isGuard = file.rel === SCRIPT_WRITE_GUARD_REL;
    const importsGuard = /(?:^|\n)\s*(?:import|export)[^;\n]*from\s+["'][^"']*write-guard\.mjs["']/.test(file.text);
    if (importsGuard) guardAdopted++;
    if (!isGuard && scriptRequiresGuard(file.rel) && !importsGuard) {
      problems.push(`${file.rel}:1 未 import write-guard，会写仓库文件的脚本必须默认 dry-run`);
    }
    file.text.split(/\r?\n/).forEach((line, idx) => {
      if (/\b(?:emit|emitCopy)\s*\(/.test(line) && !/\bimport\b/.test(line) && !/\bfunction\s+(?:emit|emitCopy)\b/.test(line)) {
        emitCallSites++;
      }
      for (const fn of FS_MUTATION_PRIMITIVES) {
        if (!new RegExp(`\\b(?:fs\\.)?${fn}\\s*\\(`).test(line)) continue;
        primitiveHits++;
        if (!isGuard) {
          outsideGuardHits++;
          problems.push(`${file.rel}:${idx + 1} 直接调用 ${fn}()，写盘必须走 write-guard 的 emit / emitCopy`);
        }
      }
    });
    if (isGuard) {
      if (!file.text.includes('"--write"')) {
        problems.push(`${SCRIPT_WRITE_GUARD_REL}:1 缺 "--write" 判定，emit 不再受 dryRun 保护`);
      }
      if (!file.text.includes("DRYRUN")) {
        problems.push(`${SCRIPT_WRITE_GUARD_REL}:1 缺 DRYRUN 输出，dry-run 无从取证`);
      }
    }
  }
  return {
    problems,
    stats: {
      scanned: files.length,
      guardAdopted,
      primitiveHits,
      outsideGuardHits,
      offenders: new Set(problems.map((p) => p.split(":")[0])).size,
      emitCallSites,
    },
  };
}

function listWriteGuardScope() {
  const fromDirs = SCRIPT_WRITE_GUARD_DIRS.flatMap((dir) => {
    const abs = join(REPO_ROOT, dir);
    return readdirSync(abs)
      .filter((name) => name.endsWith(".mjs"))
      .sort()
      .map((name) => ({ rel: `${dir}/${name}`, text: readFileSync(join(abs, name), "utf8") }));
  });
  const namedFiles = SCRIPT_WRITE_GUARD_FILES.map((rel) => ({
    rel,
    text: readFileSync(join(REPO_ROOT, rel), "utf8"),
  }));
  return [...fromDirs, ...namedFiles];
}

function testScriptWriteGuardFunnel() {
  const files = listWriteGuardScope();
  const base = { files };
  assert.ok(
    files.some((f) => f.rel === SCRIPT_WRITE_GUARD_REL),
    "门禁扫描范围必须含 write-guard.mjs 本身（否则唯一出口失控也查不出来）",
  );
  assert.ok(
    files.some((f) => f.rel.startsWith("scripts/_oneoff/")),
    "门禁扫描范围必须含 scripts/_oneoff/ 脚本",
  );
  for (const rel of SCRIPT_WRITE_GUARD_FILES) {
    assert.ok(
      files.some((f) => f.rel === rel),
      `门禁扫描范围必须含点名的写仓库 data/ 脚本 ${rel}（改名或删文件要显式改本清单）`,
    );
  }

  const clean = diffScriptWriteGuard(base.files);
  assert.deepEqual(clean.problems, [], `脚本应零违规，实际：\n${clean.problems.join("\n")}`);

  const oneoffRel = files.find((f) => f.rel.startsWith("scripts/_oneoff/")).rel;
  const dataWriterRel = SCRIPT_WRITE_GUARD_FILES[0];
  const guardText = files.find((f) => f.rel === SCRIPT_WRITE_GUARD_REL).text;
  const withText = (rel, text) => files.map((f) => (f.rel === rel ? { rel, text } : f));
  const poisoned = [
    ["裸 writeFileSync", oneoffRel, (t) => t + '\nfs.writeFileSync("x.txt", "y");\n', /直接调用 writeFileSync\(\)/],
    ["无 fs. 前缀 writeFileSync", oneoffRel, (t) => t + "\nwriteFileSync(join(ROOT, 'a.md'), body, 'utf8');\n", /直接调用 writeFileSync\(\)/],
    ["裸 mkdirSync", oneoffRel, (t) => t + '\nfs.mkdirSync("d", { recursive: true });\n', /直接调用 mkdirSync\(\)/],
    ["删除原语 rmSync", oneoffRel, (t) => t + '\nfs.rmSync(dir, { recursive: true, force: true });\n', /直接调用 rmSync\(\)/],
    ["流式写 createWriteStream", oneoffRel, (t) => t + '\nconst s = fs.createWriteStream(out);\n', /直接调用 createWriteStream\(\)/],
    ["绕过 guard（无 import）", oneoffRel, (t) => t.replace(/(?:^|\n)import[^;\n]*from\s+["'][^"']*write-guard\.mjs["'];?/, "\n"), /未 import write-guard/],
    ["顶层 data/ 脚本无 import", dataWriterRel, (t) => t.replace(/(?:^|\n)import[^;\n]*from\s+["'][^"']*write-guard\.mjs["'];?/, "\n"), /未 import write-guard/],
    ["顶层 data/ 脚本裸 copyFileSync", dataWriterRel, (t) => t + "\ncopyFileSync(src, dest);\n", /直接调用 copyFileSync\(\)/],
    ["guard 失去 --write 判定", SCRIPT_WRITE_GUARD_REL, () => guardText.replace(/"--write"/g, '"--nope"'), /缺 "--write" 判定/],
    ["guard 失去 DRYRUN 输出", SCRIPT_WRITE_GUARD_REL, () => guardText.replace(/DRYRUN/g, "SKIP"), /缺 DRYRUN 输出/],
  ];
  for (const [label, rel, mutate, anchor] of poisoned) {
    const src = files.find((f) => f.rel === rel);
    const got = diffScriptWriteGuard(withText(rel, mutate(src.text)));
    assert.ok(got.problems.length > 0, `投毒「${label}」应至少报一条问题`);
    assert.ok(
      got.problems.some((p) => anchor.test(p)),
      `投毒「${label}」应命中锚点 ${anchor}，实际：\n${got.problems.join("\n")}`,
    );
    const recheck = diffScriptWriteGuard(base.files);
    assert.deepEqual(recheck.problems, [], `投毒「${label}」后原文件应仍然零违规`);
  }

  // 反向对照：只读脚本里的 readFileSync 不得被当成写盘（否则门禁会误伤读盘）
  const readOnly = diffScriptWriteGuard([
    { rel: "scripts/_oneoff/probe-readonly.mjs", text: 'import { emit } from "../_lib/write-guard.mjs";\nconst t = readFileSync(p, "utf8");\nif (want) emit(p, t);\n' },
  ]);
  assert.deepEqual(readOnly.problems, [], `只读脚本误报：\n${readOnly.problems.join("\n")}`);

  const s = clean.stats;
  const oneoffCount = files.filter((f) => f.rel.startsWith("scripts/_oneoff/")).length;
  const libCount = files.filter((f) => f.rel.startsWith("scripts/_lib/")).length;
  assert.equal(s.outsideGuardHits, 0, `guard 之外不得有写盘原语，实际 ${s.outsideGuardHits} 处`);
  assert.ok(s.emitCallSites > 0, "未发现任何 emit 调用点，说明漏斗没被真正使用");
  console.log(
    `  [script-write-guard] 扫描=${s.scanned}（_oneoff ${oneoffCount} + _lib ${libCount} + 点名写 data/ ${SCRIPT_WRITE_GUARD_FILES.length}）` +
      ` guard 引用=${s.guardAdopted} emit 调用点=${s.emitCallSites} ` +
      `写盘原语命中=${s.primitiveHits}（write-guard 内 ${s.primitiveHits - s.outsideGuardHits}，范围外 ${s.outsideGuardHits}）` +
      ` 投毒=${poisoned.length} 类全命中 + 只读误报对照通过`,
  );
}

/**
 * S21：`--only=` 形态残留目录 —— **只读报告**，不删、不阻断。
 * 来源：`Gradle -Ponly=` 之类参数被误写成不带引号的 `--only=net/minecraft/...` 传给工具，
 * 于是当前工作目录下出现一个以整个参数字符串命名的目录（实测落在 `mcp-server/--only=net`）。
 * 删除与否是用户的决定，所以这里只把「有没有再现」变成每次 `npm test` 都会打印的一行。
 */
const RESIDUE_DIR_PREFIX = "--only=";
const RESIDUE_SCAN_SCOPES = ["", "temp", "mcp-server", "data"];

/** 递归数文件与字节（只 stat，不读内容）。坏链 / 竞态条目不计，不抛。 */
function measureDir(dir) {
  let files = 0;
  let bytes = 0;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let ents;
    try {
      ents = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of ents) {
      const p = join(cur, e.name);
      if (e.isDirectory()) {
        stack.push(p);
        continue;
      }
      try {
        bytes += statSync(p).size;
        files++;
      } catch {
        /* 不计 */
      }
    }
  }
  return { files, bytes };
}

/**
 * 在每个作用域的**直接子项**里找 `--only=` 形态目录。
 * 返回命中（带体积）与不可读作用域；纯函数，不写不删。
 */
function findResidueDirs(scopes, labelRoot, prefix = RESIDUE_DIR_PREFIX) {
  const norm = (p) => p.replace(/[\\/]+/g, "/").replace(/\/$/, "");
  const label = (p) => {
    const rel = norm(p).startsWith(norm(labelRoot) + "/") ? norm(p).slice(norm(labelRoot).length + 1) : norm(p);
    return rel === "" ? "." : rel;
  };
  const hits = [];
  const unreadable = [];
  for (const scope of scopes) {
    let ents;
    try {
      ents = readdirSync(scope, { withFileTypes: true });
    } catch {
      unreadable.push(label(scope));
      continue;
    }
    for (const e of ents) {
      if (!e.name.startsWith(prefix) || !e.isDirectory()) continue;
      const abs = join(scope, e.name);
      const { files, bytes } = measureDir(abs);
      hits.push({ scope: label(scope), rel: label(abs), files, mib: (bytes / 1024 / 1024).toFixed(1) });
    }
  }
  return { hits, unreadable };
}

function testResidueDirsReport() {
  // 自证：探测器既能抓到 1，也能在删干净后回到 0（否则「命中=0」可能是根本没在看）
  const fixture = mkdtempSync(join(tmpdir(), "mc-skill-residue-"));
  let detected = -1;
  let afterClean = -1;
  let wrongPrefixHits = -1;
  let unreadableOk = false;
  try {
    mkdirSync(join(fixture, RESIDUE_DIR_PREFIX + "net", "minecraft"), { recursive: true });
    writeFileSync(join(fixture, RESIDUE_DIR_PREFIX + "net", "minecraft", "client.jar"), "junk");
    writeFileSync(join(fixture, RESIDUE_DIR_PREFIX + "file-not-dir"), "junk");
    const one = findResidueDirs([fixture], fixture);
    detected = one.hits.length;
    assert.equal(detected, 1, `fixture 里有 1 个 ${RESIDUE_DIR_PREFIX} 目录，探测器却报了 ${detected}`);
    assert.equal(one.hits[0].files, 1, "应递归数到目录内 1 个文件");
    assert.ok(one.hits[0].rel.includes("net"), "命中名应是被当作目录名的那段参数残留");
    // 投毒：前缀写歪 ⇒ 同一 fixture 必须报 0（否则「命中=0」是恒真）
    wrongPrefixHits = findResidueDirs([fixture], fixture, "--nope=").hits.length;
    assert.equal(wrongPrefixHits, 0, "前缀失效时仍报命中 ⇒ 探测根本没读前缀");
    // 反向：普通文件形态（非目录）不得算命中
    assert.ok(!one.hits.some((h) => h.rel.includes("file-not-dir")), "同名普通文件被误判为残留目录");
    rmSync(join(fixture, RESIDUE_DIR_PREFIX + "net"), { recursive: true, force: true });
    const clean = findResidueDirs([fixture], fixture);
    afterClean = clean.hits.length;
    assert.equal(afterClean, 0, "删掉残留后应报 0，实际 " + afterClean);
    // 作用域不可读 ⇒ 记一条而不抛（报告型检查不得把套件搞红）
    unreadableOk = findResidueDirs([join(fixture, "no-such-scope")], fixture).unreadable.length === 1;
    assert.ok(unreadableOk, "不可读作用域应进 unreadable 清单");
  } finally {
    rmSync(fixture, { recursive: true, force: true }); // 只删本用例自己建的 fixture
  }

  // 真实报告：仓库根 + temp/ + mcp-server/ + data/
  const scopes = RESIDUE_SCAN_SCOPES.map((s) => join(REPO_ROOT, s));
  for (const must of ["", "temp", "mcp-server", "data"]) {
    assert.ok(RESIDUE_SCAN_SCOPES.includes(must), `扫描作用域少了 ${must || "仓库根"}（清单被悄悄收窄 ⇒ 报告恒为 0）`);
    assert.ok(existsSync(join(REPO_ROOT, must)), `扫描作用域 ${must || "仓库根"} 不存在`);
  }
  const { hits, unreadable } = findResidueDirs(scopes, REPO_ROOT);
  console.log(`  [residue] 作用域=${scopes.length} ${RESIDUE_DIR_PREFIX} 形态目录命中=${hits.length}（报告型，不阻断）`);
  for (const h of hits) console.log(`    ${h.rel}  文件=${h.files}  ${h.mib} MiB  (位于 ${h.scope}/)`);
  for (const u of unreadable) console.log(`    作用域不可读: ${u}`);
  console.log(
    `    自证：建 1 个 fixture→命中=1，删掉→命中=${afterClean}，前缀投毒→命中=${wrongPrefixHits}，不可读作用域=${unreadable.length ? "已记录" : "无"}`,
  );
}

/**
 * S22：`community_knowledge/indexes/index-l0.json` 与短文正文必须一致。
 * 索引是 `search_community_docs` 的元数据源（summary / tags / mcHint 都从索引来），
 * 改了正文没重建索引 ⇒ Agent 检索到的是上一版结论，而正文里已是新数字。
 * 纯函数比对器便于投毒自证；真实比对读运行时实际使用的那个根目录。
 */
function diffCommunityIndex(committed, rebuilt) {
  const canon = (e) =>
    JSON.stringify(Object.keys(e).sort().map((k) => [k, e[k]]));
  const c = new Map(committed.map((e) => [e.id, e]));
  const r = new Map(rebuilt.map((e) => [e.id, e]));
  const stale = [];
  const orphan = [];
  const unindexed = [];
  for (const [id, e] of c) {
    if (!r.has(id)) orphan.push(id);
    else if (canon(e) !== canon(r.get(id))) stale.push(id);
  }
  for (const id of r.keys()) if (!c.has(id)) unindexed.push(id);
  return { stale, orphan, unindexed };
}

function testCommunityIndexSync() {
  const zero = { stale: [], orphan: [], unindexed: [] };
  const fixture = [
    { id: "a/x", label: "X", path: "a/x.md", url: "", tags: ["t"], sourceKind: "authored", priority: 1, summary: "旧摘要", mcHint: "" },
    { id: "a/y", label: "Y", path: "a/y.md", url: "", tags: ["u"], sourceKind: "authored", priority: 1, summary: "不动", mcHint: "" },
  ];
  assert.deepEqual(diffCommunityIndex(fixture, fixture.map((e) => ({ ...e }))), zero, "同一份索引与源不该报任何差异");
  const flipped = fixture.map((e) => Object.fromEntries([...Object.entries(e)].reverse()));
  assert.deepEqual(diffCommunityIndex(fixture, flipped), zero, "字段顺序不同就被判陈旧 ⇒ 比对器在误报");
  const mutatedSummary = fixture.map((e) => (e.id === "a/x" ? { ...e, summary: "新摘要" } : e));
  assert.deepEqual(diffCommunityIndex(fixture, mutatedSummary).stale, ["a/x"], "正文摘要变了、索引没跟上 ⇒ 必须报陈旧");
  assert.deepEqual(diffCommunityIndex(fixture, mutatedSummary).orphan, [], "字段差异不得被误报成条目多余");
  assert.deepEqual(diffCommunityIndex(fixture.filter((e) => e.id !== "a/y"), fixture).unindexed, ["a/y"], "源里有、索引里没有 ⇒ 必须报未入库");
  assert.deepEqual(diffCommunityIndex([...fixture, { ...fixture[0], id: "a/z" }], fixture).orphan, ["a/z"], "索引里有、源里已删 ⇒ 必须报条目多余");
  const noIndex = diffCommunityIndex([], fixture);
  assert.deepEqual(noIndex.unindexed, ["a/x", "a/y"], "索引完全没建时两条都必须报未入库");
  assert.equal(noIndex.stale.length + noIndex.orphan.length, 0);
  const noSource = diffCommunityIndex(fixture, []);
  assert.deepEqual(noSource.orphan, ["a/x", "a/y"], "源根扫空时必须逐条报条目多余（否则空扫描能蒙混过关）");
  assert.equal(noSource.stale.length + noSource.unindexed.length, 0);

  const root = new CommunityDocStore().getRoot();
  const indexPath = join(root, "indexes", "index-l0.json");
  assert.ok(existsSync(indexPath), `找不到社区索引 ${indexPath}；重建命令：cd mcp-server && npm run community:index`);
  const committed = JSON.parse(readFileSync(indexPath, "utf8")).entries ?? [];
  const rebuilt = buildCommunityEntries(root);
  assert.ok(rebuilt.length > 0, `源根 ${root} 一个 .md 都没扫到 ⇒ 本门禁在空转`);
  assert.ok(committed.length > 0, "已提交索引为空 ⇒ 检索等于没有社区库");

  const { stale, orphan, unindexed } = diffCommunityIndex(committed, rebuilt);
  // 探针字面同时命中「自己有实测分发表或」与「正文引用别处实测表」（如总目录）——
  // 两类都必须在索引摘要里写清来源级别，否则检索侧看到的是旧口径。
  let refDocs = 0;
  const refHits = [];
  for (const e of rebuilt) {
    const file = join(root, e.path);
    if (!existsSync(file)) continue;
    const body = stripLeadingFrontmatter(readFileSync(file, "utf8"));
    if (!body.includes("分发窗口（Modrinth API 实测")) continue;
    refDocs++;
    if (/实测/.test(e.summary)) refHits.push(e.id);
  }
  console.log(
    `  [community-index] 根=${root} 索引=${committed.length} 源=${rebuilt.length} ` +
      `陈旧=${stale.length} 索引多余=${orphan.length} 未入库=${unindexed.length} ` +
      `正文引用Modrinth实测的短文=${refDocs}（索引摘要带实测= ${refHits.length}/${refDocs}）`,
  );
  for (const [kind, ids] of [["陈旧", stale], ["索引多余", orphan], ["未入库", unindexed]]) {
    for (const id of ids.slice(0, 10)) console.log(`    ${kind}: ${id}`);
  }
  assert.deepEqual(stale, [], `索引摘要/标签与正文不一致，跑 npm run community:index 重建 ${indexPath}`);
  assert.deepEqual(orphan, [], "索引里有已删除的短文，跑 npm run community:index 重建");
  assert.deepEqual(unindexed, [], "新短文没进索引，跑 npm run community:index 重建");
  assert.ok(refDocs > 0, "没有任何短文引用 Modrinth 实测分发数据 ⇒ 来源级别检查是空转");
  assert.equal(refHits.length, refDocs, "正文引用了 Modrinth 实测数字，索引摘要却没标注实测");
}

await testNeoForgeGenericRouting();
await testUnknownPlatformEvidence();
await testForgeDetectedFromGradleOnly();
await testLiteLoaderForgeHybridNotMultiLoader();
await testPortProjectRejectsBadVersionToken();
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
await testArchitecturySettingsGradleFromKb();
await testCommunityDocsSearchAndLinks();
testAuditMinorFixes();
await testCrashAnalyzeKindAndMissingDep();
testCrashPatternSpecificity();
await testPlatformDataMissing();
await testNeoForgeResolveDirForgeCompat();
await testSearchEnhancements();
await testDatagenAndMappingGates();
await testPortingFabricYarnAndProps();
testGradlePropertiesInlineComment();
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
await testPortingHandoffArgsAreCallable();
await testPortingKbProvenance();
await testFabricScaffoldWrappers();
await testAssertionProvenance();
await testFabric2612Knowledge();
await testLoaderApiRepoDataHygiene();
await testZipInflateZeroByteDeflate();
await testDocsToolTablesMatchRegistry();
testPublishChecklistFromCommunityDoc();
testBedrockMisdetectionFixed();
testScriptWriteGuardFunnel();
testResidueDirsReport();
testCommunityIndexSync();
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
