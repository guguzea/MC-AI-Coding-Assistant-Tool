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
      targetPlatform: "fabric",
      targetVersion: "1.20.4",
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

async function testMigrationRequiresConfirmationAndWritesWhenConfirmed() {
  const root = mkdtempSync(join(tmpdir(), "mc-skill-migrate-"));
  const source = join(root, "src", "main", "java", "Example.java");
  mkdirSync(join(root, "src", "main", "java"), { recursive: true });
  writeFileSync(source, "import net.minecraftforge.eventbus.api.Event;\n", "utf8");

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
    rmSync(root, { recursive: true, force: true });
  }
}

await testNeoForgeGenericRouting();
await testUnknownPlatformEvidence();
await testArchitecturyDryRunDoesNotWrite();
await testMigrationRequiresConfirmationAndWritesWhenConfirmed();
console.log("core regression tests passed");
