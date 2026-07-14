import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { listVersions } from "./dist/docs-platform/forge/index.js";
import { analyzePortingPath, portProject } from "./dist/porting/index.js";
import { convertYarnMember, closeAllYarnDbs } from "./dist/mappings/yarn-sqlite.js";
import { createFabricDocStore } from "./dist/docs-platform/fabric/store.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

await testNeoForgeGenericRouting();
await testUnknownPlatformEvidence();
await testForgeDetectedFromGradleOnly();
await testYarnShortNameAndMojangHeuristic();
await testFabricClassPrefixSearch();
await testArchitecturyDryRunDoesNotWrite();
await testWriteBlockedWithoutAllowEnv();
await testMigrationRequiresConfirmationAndWritesWhenConfirmed();
console.log("core regression tests passed");
