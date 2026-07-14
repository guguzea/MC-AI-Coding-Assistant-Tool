import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { listVersions } from "./dist/docs-platform/forge/index.js";
import { analyzePortingPath, portProject } from "./dist/porting/index.js";

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

await testNeoForgeGenericRouting();
await testUnknownPlatformEvidence();
await testArchitecturyDryRunDoesNotWrite();
await testWriteBlockedWithoutAllowEnv();
await testMigrationRequiresConfirmationAndWritesWhenConfirmed();
console.log("core regression tests passed");
