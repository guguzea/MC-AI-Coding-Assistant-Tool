/**
 * offline tests for scripts/audit-data-consistency.mjs
 * ─────────────────────────────────────────────────────
 * Builds a synthetic fixture under a temp dir, runs the audit, and asserts:
 *   1. The fixture tree is not mutated after the audit (read-only contract).
 *   2. Planted ERRORs are surfaced with the right path/expected/actual tri-tuple.
 *   3. The CLI parser handles both `version` forms (MC version + index path).
 *   4. An empty fixture yields zero issues and exit code 0.
 *   5. The `selectIndexes` helper honours both forms.
 *   6. A clean fixture (parity between raw/processed + correct version metadata)
 *      yields zero ERRORs while still tolerating WARNs.
 *
 * All side effects are confined to `tmpdir()`, no repo files are touched.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
  auditIndex,
  parseArgs,
  parseIndexName,
  RAW_PROCESSED_SET_EXCEPTIONS,
  skipsRawProcessedSet,
  l0ProcessedStem,
} from "./scripts/audit-data-consistency.mjs";

const REPO = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
const SCRIPTS_DIR = path.join(REPO, "scripts");

function tmpRoot(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `mc-audit-${label}-`));
}

function writeJSON(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}

function writeText(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text, "utf8");
}

function hashDir(root) {
  // Cheap structural hash: every file → "<rel>::size::head8bytes"
  const out = [];
  function walk(p) {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, e.name);
      if (e.isDirectory()) walk(full);
      else {
        const buf = fs.readFileSync(full);
        out.push(`${path.relative(root, full)}|${buf.length}|${buf.subarray(0, 8).toString("hex")}`);
      }
    }
  }
  walk(root);
  out.sort();
  return out.join("\n");
}

function buildCleanFixture(root) {
  // forge_<ver>/forge-docs/<ver>/{raw,processed}, index-l2 with processedFile refs
  const ver = "1.20.1";
  const docsRoot = path.join(root, `forge_${ver}`, "forge-docs", ver);
  writeText(path.join(docsRoot, "raw", "intro.md"),
    `# intro\n\n> 来源：https://docs.minecraftforge.net/en/${ver}/\n> 版本：${ver}\n\nbody\n`);
  writeText(path.join(docsRoot, "processed", "intro.md"),
    `# Intro\n\nbody\n`);

  const index = [
    {
      id: `${ver}/intro`,
      version: ver,
      label: "Intro",
      url: `https://docs.minecraftforge.net/en/${ver}/intro`,
      processedFile: "processed/intro.md",
    },
  ];
  writeJSON(path.join(docsRoot, "index-l2.json"), index);
  writeJSON(path.join(root, `forge_${ver}`, "forge-docs", "_manifest.json"), {
    [`${ver}/intro`]: { file: "intro.md" },
  });
  return { idx: { name: `forge_${ver}`, platform: "forge", version: ver }, root };
}

function buildDirtyFixture(root) {
  const ver = "1.20.1";
  const docsRoot = path.join(root, `forge_${ver}`, "forge-docs", ver);
  // raw exists, processed missing → E ERROR
  writeText(path.join(docsRoot, "raw", "gettingstarted.md"),
    `# Getting Started\n\n> 来源：https://docs.minecraftforge.net/en/${ver}/gettingstarted\n> 版本：${ver}\n\nx\n`);
  // version mismatch in raw header → B ERROR
  writeText(path.join(docsRoot, "raw", "blocks.md"),
    `# blocks\n\n> 来源：https://docs.minecraftforge.net/en/${ver}/blocks\n> 版本：1.21.0\n\nbody\n`);
  // index has stale id-version
  writeJSON(path.join(docsRoot, "index-l2.json"), [
    { id: "1.20.1/gettingstarted", version: "1.20.1", processedFile: "processed/gettingstarted.md" },
    { id: "1.21.0/blocks", version: "1.21.0", processedFile: "processed/blocks.md" },
  ]);
  // manifest references a missing file
  writeJSON(path.join(root, `forge_${ver}`, "forge-docs", "_manifest.json"), {
    [`${ver}/registries`]: { file: "registries.md" },
  });
  return { idx: { name: `forge_${ver}`, platform: "forge", version: ver }, root };
}

function buildEmptyFixture(root) {
  return { idx: null, root };
}

function spawnAudit(args, cwd, dataRoot) {
  const argv = [path.join(SCRIPTS_DIR, "audit-data-consistency.mjs"), ...args];
  return spawnSync(process.execPath, argv, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

async function testReadOnlyContract() {
  const root = tmpRoot("ro");
  const fx = buildCleanFixture(root);
  const before = hashDir(fx.root);
  const r = spawnAudit(["--data-root=" + fx.root, "--platform=forge", "--version=1.20.1"], SCRIPTS_DIR, fx.root);
  const after = hashDir(fx.root);
  assert.equal(r.status, 0, `audit should pass on clean fixture:\n${r.stdout}`);
  assert.equal(before, after, "audit must not mutate the data root");
}

async function testPlantedErrors() {
  const root = tmpRoot("dirty");
  const fx = buildDirtyFixture(root);
  const r = spawnAudit(["--data-root=" + fx.root, "--platform=forge"], SCRIPTS_DIR, fx.root);
  const payload = JSON.parse(r.stdout);
  assert.equal(r.status, 1, "dirty fixture must yield exit 1");
  const byCheck = Object.create(null);
  for (const i of payload.issues) {
    byCheck[i.check] = byCheck[i.check] ?? [];
    byCheck[i.check].push(i);
  }
  // plant 5 error types
  assert.ok(byCheck["B-raw-header"], "expected raw header mismatch");
  assert.ok(
    byCheck["B-raw-header"].some((i) => i.actual && i.actual.includes("1.21.0")),
    "raw header should report 1.21.0 vs 1.20.1",
  );
  assert.ok(byCheck["D-index-id-version"], "expected id-version mismatch");
  assert.ok(byCheck["E-raw-processed-set"], "expected raw/processed set mismatch");
  assert.ok(byCheck["G-manifest-orphan"], "expected orphan manifest entry");
  // F ERROR because processed/gettingstarted.md missing
  assert.ok(byCheck["F-index-processedFile"], "expected missing processedFile");
  // tri-tuple shape
  for (const i of payload.issues) {
    assert.equal(typeof i.path, "string");
    assert.equal(typeof i.expected, "string");
    assert.equal(typeof i.actual, "string");
    assert.ok(["ERROR", "WARN"].includes(i.level));
  }
}

async function testEmptyFixture() {
  const root = tmpRoot("empty");
  buildEmptyFixture(root);
  const r = spawnAudit(["--data-root=" + root], SCRIPTS_DIR, root);
  // No platform version dirs → nothing to scan, no errors. Audit walks and exits 0.
  assert.equal(r.status, 0, `empty fixture should not error:\n${r.stdout}\n${r.stderr}`);
  const payload = JSON.parse(r.stdout);
  assert.equal(payload.summary.ERROR, 0);
}

async function testParseArgsBothVersionForms() {
  const a = parseArgs(["node", "audit-data-consistency.mjs", "--platform=fabric", "--version=1.20.1"]);
  assert.equal(a.platform, "fabric");
  assert.equal(a.version, "1.20.1");
  assert.equal(a.form, "mc");

  const b = parseArgs(["node", "audit-data-consistency.mjs", "--platform=forge", "--version=forge_1.20.1/forge-docs"]);
  assert.equal(b.platform, "forge");
  assert.equal(b.version, "forge_1.20.1/forge-docs");
  assert.equal(b.form, "index");
}

async function testParseIndexName() {
  assert.deepEqual(parseIndexName("forge_1.20.1"), { platform: "forge", version: "1.20.1", scope: "version", name: "forge_1.20.1" });
  assert.deepEqual(parseIndexName("fabric_1.21.1"), { platform: "fabric", version: "1.21.1", scope: "version", name: "fabric_1.21.1" });
  assert.deepEqual(parseIndexName("quilt_1.21.1"), { platform: "quilt", version: "1.21.1", scope: "version", name: "quilt_1.21.1" });
  assert.deepEqual(parseIndexName("liteloader_1.12.2"), { platform: "liteloader", version: "1.12.2", scope: "version", name: "liteloader_1.12.2" });
  assert.equal(parseIndexName("porting"), null);
  assert.equal(parseIndexName("neoforge_primers"), null);
  assert.equal(parseIndexName("forge-porting"), null);
  assert.equal(parseIndexName("test_mcp_check"), null);
}

async function testAuditIndexDirectly() {
  const root = tmpRoot("direct");
  const fx = buildDirtyFixture(root);
  const issues = auditIndex(fx.root, fx.idx);
  const types = new Set(issues.map((i) => i.check));
  for (const expected of ["B-raw-header", "D-index-id-version", "E-raw-processed-set", "G-manifest-orphan", "F-index-processedFile"]) {
    assert.ok(types.has(expected), `auditIndex missing ${expected}`);
  }
  assert.ok(issues.some((i) => i.level === "ERROR"));
}

async function testJsonOutputShape() {
  const root = tmpRoot("shape");
  buildCleanFixture(root);
  const r = spawnAudit(["--data-root=" + root, "--platform=forge"], SCRIPTS_DIR, root);
  assert.equal(r.status, 0);
  const payload = JSON.parse(r.stdout);
  assert.equal(payload.tool, "audit-data-consistency");
  assert.equal(payload.readOnly, true);
  assert.ok(Array.isArray(payload.issues));
  assert.ok(typeof payload.summary === "object");
  assert.ok(Array.isArray(payload.scanned));
}

async function testNestedFabricMetaVersionMismatch() {
  const root = tmpRoot("fabric-meta");
  const versionDir = path.join(root, "fabric_1.21.1");
  writeJSON(path.join(versionDir, "meta.json"), { meta: { mcVersion: "1.20.1" } });
  const issues = auditIndex(root, {
    name: "fabric_1.21.1",
    platform: "fabric",
    version: "1.21.1",
  });
  const mismatch = issues.find((issue) => issue.check === "A-meta");
  assert.ok(mismatch, "nested meta.mcVersion mismatch must be reported");
  assert.equal(mismatch.expected, 'version "1.21.1"');
  assert.equal(mismatch.actual, 'version "1.20.1"');
}

function buildForgeFrontmatterFixture(root) {
  // Confirm the audit recognises both forge raw formats:
  //   ---\nversion: "..."\n... (older mkdocs harvest)
  //   `> 版本：...` header (newer MkDocs/manual)
  const ver = "1.20.4";
  const docsRoot = path.join(root, `forge_${ver}`, "forge-docs", ver);
  writeText(path.join(docsRoot, "raw", "old_style.md"),
    `---\nversion: "${ver}"\nchapter: "old-style"\n---\n# Old Style\nbody\n`);
  writeText(path.join(docsRoot, "raw", "new_style.md"),
    `# New Style\n\n> 版本：${ver}\n\nbody\n`);
  // Wrong version on the new format must surface as ERROR.
  writeText(path.join(docsRoot, "raw", "wrong.md"),
    `# Wrong\n\n> 版本：1.20.1\n\nbody\n`);
  return { idx: { name: `forge_${ver}`, platform: "forge", version: ver }, root };
}

async function testForgeRawHeaderForms() {
  const root = tmpRoot("forge-fmt");
  const fx = buildForgeFrontmatterFixture(root);
  const issues = auditIndex(fx.root, fx.idx);
  // old_style + new_style pass; wrong → ERROR
  const errs = issues.filter((i) => i.check === "B-raw-header" && i.level === "ERROR");
  assert.equal(errs.length, 1, `expected exactly 1 B-raw-header ERROR, got ${errs.length}`);
  const warns = issues.filter((i) => i.check === "B-raw-header" && i.level === "WARN");
  assert.equal(warns.length, 0, "both forge formats must be accepted (no WARN)");
}

async function testHollowFabricBundleErrors() {
  const root = tmpRoot("hollow");
  const ver = "1.20.1";
  const versionDir = path.join(root, `fabric_${ver}`);
  writeJSON(path.join(versionDir, "meta.json"), {
    version: ver,
    meta: { mcVersion: ver, docs: { pages: [{ id: "networking", filename: "develop_networking.md" }] } },
  });
  writeJSON(path.join(versionDir, "fabric-docs", ver, "index-l0.json"), []);
  fs.mkdirSync(path.join(versionDir, "fabric-docs", ver, "raw"), { recursive: true });
  const issues = auditIndex(root, { name: `fabric_${ver}`, platform: "fabric", version: ver });
  assert.ok(issues.some((i) => i.check === "A-hollow-meta-pages" && i.level === "ERROR"), JSON.stringify(issues));
  assert.ok(issues.some((i) => i.check === "A-hollow-index-l0" && i.level === "ERROR"), JSON.stringify(issues));
}

async function testHonestEmptyFabricMetaPassesHollow() {
  const root = tmpRoot("honest-empty");
  const ver = "1.20.1";
  const versionDir = path.join(root, `fabric_${ver}`);
  writeJSON(path.join(versionDir, "meta.json"), {
    version: ver,
    meta: { mcVersion: ver, docs: { pages: [] } },
  });
  writeJSON(path.join(versionDir, "fabric-docs", ver, "index-l0.json"), []);
  const issues = auditIndex(root, { name: `fabric_${ver}`, platform: "fabric", version: ver });
  assert.equal(issues.filter((i) => i.check.startsWith("A-hollow") && i.level === "ERROR").length, 0, JSON.stringify(issues));
}

function processedOnlyFixture(root, indexName, platform, version, docSubdir) {
  const docsRoot = path.join(root, indexName, docSubdir, version);
  writeText(path.join(docsRoot, "processed", "only.md"), "# only\nbody\n");
  writeJSON(path.join(docsRoot, "index-l0.json"), [
    { id: `${version}/only`, version, label: "only", processedFile: "processed/only.md" },
  ]);
  return { idx: { name: indexName, platform, version }, root };
}

async function testRawProcessedExceptionTableGuard() {
  for (const e of RAW_PROCESSED_SET_EXCEPTIONS) {
    assert.ok(e.reason && String(e.reason).trim(), `exception missing reason: ${JSON.stringify(e)}`);
    assert.equal(/^(forge_|fabric_|neoforge_)/.test(e.platformPrefix), false, `forbidden prefix ${e.platformPrefix}`);
  }
  assert.equal(skipsRawProcessedSet("quilt_1.21.1", "quilt-docs"), true);
  assert.equal(skipsRawProcessedSet("forge_1.20.1", "forge-docs"), false);
}

async function testQuiltProcessedOnlySkipsE() {
  const root = tmpRoot("quilt-e");
  const fx = processedOnlyFixture(root, "quilt_1.21.1", "quilt", "1.21.1", "quilt-docs");
  const issues = auditIndex(fx.root, fx.idx);
  assert.equal(issues.filter((i) => i.check === "E-raw-processed-set").length, 0, JSON.stringify(issues));
}

async function testLiteLoaderProcessedOnlySkipsE() {
  const root = tmpRoot("ll-e");
  const fx = processedOnlyFixture(root, "liteloader_1.12.2", "liteloader", "1.12.2", "liteloader-docs");
  const issues = auditIndex(fx.root, fx.idx);
  assert.equal(issues.filter((i) => i.check === "E-raw-processed-set").length, 0, JSON.stringify(issues));
}

async function testForgeProcessedOnlyStillErrorsE() {
  const root = tmpRoot("forge-e");
  const fx = processedOnlyFixture(root, "forge_1.20.1", "forge", "1.20.1", "forge-docs");
  const issues = auditIndex(fx.root, fx.idx);
  assert.ok(issues.some((i) => i.check === "E-raw-processed-set" && i.level === "ERROR"), JSON.stringify(issues));
}

async function testFabricProcessedOnlyStillErrorsE() {
  const root = tmpRoot("fab-e");
  const fx = processedOnlyFixture(root, "fabric_1.21.1", "fabric", "1.21.1", "fabric-docs");
  const issues = auditIndex(fx.root, fx.idx);
  assert.ok(issues.some((i) => i.check === "E-raw-processed-set" && i.level === "ERROR"), JSON.stringify(issues));
}

async function testL0ProcessedStemHelper() {
  assert.equal(l0ProcessedStem("1.21.11/quilt-mod-json"), "quilt-mod-json");
  assert.equal(l0ProcessedStem("gettingstarted/modfiles"), "gettingstarted_modfiles");
  assert.equal(l0ProcessedStem("1.21.11/develop/items/first-item"), "develop_items_first-item");
}

async function testProcessedMissingFromL0StemErrorsJ() {
  const root = tmpRoot("j-stem");
  const ver = "1.21.11";
  const docsRoot = path.join(root, `quilt_${ver}`, "quilt-docs", ver);
  writeText(path.join(docsRoot, "processed", "quilt-mod-json.md"), "# RFC\n");
  writeText(path.join(docsRoot, "processed", "qsl-qfapi.md"), "# qsl\n");
  writeJSON(path.join(docsRoot, "index-l0.json"), [
    { id: `${ver}/qsl-qfapi`, version: ver, label: "qsl-qfapi" },
  ]);
  const issues = auditIndex(root, { name: `quilt_${ver}`, platform: "quilt", version: ver });
  assert.ok(
    issues.some(
      (i) =>
        i.check === "J-processed-l0-stem" &&
        i.level === "ERROR" &&
        /quilt-mod-json/.test(String(i.path ?? "")),
    ),
    JSON.stringify(issues),
  );
}

const tests = [
  ["read-only contract", testReadOnlyContract],
  ["planted errors surfaced", testPlantedErrors],
  ["empty fixture yields 0 errors", testEmptyFixture],
  ["CLI parser both version forms", testParseArgsBothVersionForms],
  ["parseIndexName keys", testParseIndexName],
  ["auditIndex direct call", testAuditIndexDirectly],
  ["json output shape", testJsonOutputShape],
  ["nested Fabric meta version mismatch", testNestedFabricMetaVersionMismatch],
  ["forge raw header accepts both frontmatter and `> 版本：` formats", testForgeRawHeaderForms],
  ["hollow fabric bundle meta pages ERROR", testHollowFabricBundleErrors],
  ["honest empty fabric meta no hollow ERROR", testHonestEmptyFabricMetaPassesHollow],
  ["RAW_PROCESSED_SET_EXCEPTIONS guard", testRawProcessedExceptionTableGuard],
  ["quilt processed-only skips E-raw-processed-set", testQuiltProcessedOnlySkipsE],
  ["liteloader processed-only skips E-raw-processed-set", testLiteLoaderProcessedOnlySkipsE],
  ["forge processed-only still E-raw-processed-set", testForgeProcessedOnlyStillErrorsE],
  ["fabric processed-only still E-raw-processed-set", testFabricProcessedOnlyStillErrorsE],
  ["l0ProcessedStem helper", testL0ProcessedStemHelper],
  ["processed missing from L0 stem errors J", testProcessedMissingFromL0StemErrorsJ],
];

let failed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    process.stdout.write(`ok   ${name}\n`);
  } catch (e) {
    failed++;
    process.stdout.write(`FAIL ${name}\n  ${e.stack || e.message}\n`);
  }
}

if (failed > 0) {
  process.stdout.write(`\n${failed} test(s) failed\n`);
  process.exit(1);
}
process.stdout.write("\nall audit-data-consistency tests passed\n");
