#!/usr/bin/env node
/**
 * scripts/_lib/test-helpers.mjs
 * Node-native tests for the script helpers and the four target scripts.
 * Pure functions only — no network, no fs writes.
 *
 * Usage:
 *   node scripts/_lib/test-helpers.mjs            (auto-runs as a test script)
 *   node --test scripts/_lib/test-helpers.mjs     (proper test runner)
 *
 * Exit code: 0 on pass, 1 on first failure.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  parseCliArgs,
  parseVersion,
  compareVersions,
  isUpdateAvailable,
} from "./args.js";
import { parseCSV, csvField, csvRow, toCSV } from "./csv.js";
import { DiagnosticBag, exitCodeFor } from "./diag.js";

import {
  findUpdatesForLoader,
  resolveLatestKey,
  runCheck,
} from "../check-porting-updates.js";
import {
  buildJavadocEntry,
  buildMkDocsEntry,
  extractChapterPaths,
  filterByVersion,
  javaVersionForJavadoc,
  buildManifest,
} from "../probe-forge-versions.js";
import {
  CRITICAL_CLASSES_1_14,
  buildFieldEntries,
  buildMethodEntries,
  buildParamMap,
  extractFromMappings,
  validateColumns,
  validateOutputs,
} from "../mcp-csv-extractor.js";
import {
  checkJavadocVersions,
  checkManifest,
  checkMappings,
  checkMkDocsVersions,
  countFiles,
  countFilesRecursive,
  loadJson,
  rawStatusFor,
} from "../validate-forge-build.js";

const log = (...a) => console.log("  ", ...a);

// ── args.js ────────────────────────────────────────────────────────────────

test("parseCliArgs accepts --version x and --version=x, rejects empty", () => {
  const eqForm  = parseCliArgs(["--version=1.20.1"]);
  const spForm  = parseCliArgs(["--version", "1.20.1"]);
  assert.equal(eqForm.flags.version, "1.20.1");
  assert.equal(spForm.flags.version, "1.20.1");

  const missingEq = parseCliArgs(["--version="]);
  assert.equal(missingEq.flags.versionError, "empty-value");
  assert.equal(missingEq.flags.version, undefined);

  const missingSp = parseCliArgs(["--version"]);
  assert.equal(missingSp.flags.versionError, "missing-value");

  const spNextIsFlag = parseCliArgs(["--version", "--dry-run"]);
  assert.equal(spNextIsFlag.flags.versionError, "missing-value");
  assert.equal(spNextIsFlag.flags["dry-run"], true);
});

test("parseVersion handles X.Y, X.Y.Z, mixed tail", () => {
  assert.deepEqual(parseVersion("1.20.1"), [1, 20, 1]);
  assert.deepEqual(parseVersion("20.4.237"), [20, 4, 237]);
  assert.deepEqual(parseVersion("1.0.0-beta"), [1, 0, 0, "beta"]);
  assert.equal(parseVersion(""), null);
  assert.equal(parseVersion(null), null);
});

test("compareVersions is structured and handles missing segments", () => {
  assert.ok(compareVersions("1.20.1", "1.20.1") === 0);
  assert.ok(compareVersions("1.20.1", "1.20")  > 0);   // longer field wins on tie
  assert.ok(compareVersions("1.20",   "1.20.1") < 0);
  assert.ok(compareVersions("20.4.237", "20.4.99") > 0);
  assert.ok(compareVersions("0.16.0", "0.15.7") > 0);
  assert.ok(compareVersions(null, "1.0") < 0);
  assert.ok(compareVersions("1.0", null) > 0);
  assert.ok(compareVersions(null, null) === 0);
});

test("isUpdateAvailable only true when latest strictly greater", () => {
  assert.equal(isUpdateAvailable("47.2.0", "47.2.0"), false);
  assert.equal(isUpdateAvailable("47.2.0", "47.3.0"), true);
  assert.equal(isUpdateAvailable("47.3.0", "47.2.0"), false);
  assert.equal(isUpdateAvailable(null,  "47.3.0"), false);
  assert.equal(isUpdateAvailable("47.2.0", null),  false);
});

// ── csv.js (RFC4180) ───────────────────────────────────────────────────────

test("parseCSV handles quoted fields and embedded commas", () => {
  const text = `searge,name,desc\nfunc_123,"foo, bar","(Ljava/lang/String;)V"\n`;
  const { headers, rows, errors } = parseCSV(text);
  assert.equal(headers.length, 3);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].searge, "func_123");
  assert.equal(rows[0].name, "foo, bar");
  assert.equal(rows[0].desc, "(Ljava/lang/String;)V");
  assert.equal(errors.length, 0);
});

test("parseCSV handles escaped quotes and embedded newlines", () => {
  const text = `a,b\n"he said ""hi""","line1\nline2"\n`;
  const { rows, errors } = parseCSV(text);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].a, 'he said "hi"');
  assert.equal(rows[0].b, "line1\nline2");
  assert.equal(errors.length, 0);
});

test("parseCSV reports column-count errors", () => {
  const text = `a,b,c\nx,y\n`;
  const { errors } = parseCSV(text);
  assert.ok(errors.length >= 1, "should report column mismatch");
  assert.match(errors[0], /expected 3 columns, got 2/);
});

test("csvField quotes reserved chars", () => {
  assert.equal(csvField("plain"), "plain");
  assert.equal(csvField("a,b"), '"a,b"');
  assert.equal(csvField('a"b'), '"a""b"');
  assert.equal(csvField("a\nb"), '"a\nb"');
});

test("csvRow and toCSV round-trip simple", () => {
  const s = toCSV(["a", "b"], [{ a: "1,2", b: 'q"q' }]);
  assert.equal(s, `a,b\n"1,2","q""q"\n`);
  const reparsed = parseCSV(s).rows;
  assert.deepEqual(reparsed, [{ a: "1,2", b: 'q"q' }]);
  log("csv round-trip ok");
});

// ── check-porting-updates.js ───────────────────────────────────────────────

const LATEST = {
  neoforge: { "1.20.1": "20.2.88", "1.20.4": "20.4.237", "1.21.1": "21.1.113" },
  fabric:   { "1.20.1": "0.15.7",  "1.21.1": "0.16.0" },
  minecraft:{ "1.20.1": "1.20.4",  "1.21.1": "1.21.11" },
};

test("resolveLatestKey covers known prefixes", () => {
  assert.equal(resolveLatestKey("neoforge", "1.20.1"), "1.20.1");
  assert.equal(resolveLatestKey("neoforge", "1.20.6"), "1.20.1");
  assert.equal(resolveLatestKey("neoforge", "1.21.4"), "1.21.1");
  assert.equal(resolveLatestKey("fabric",   "1.21"),   "1.21.1");
  assert.equal(resolveLatestKey("fabric",   "9.9.9"),  null);
});

test("findUpdatesForLoader detects outdated entries", () => {
  const updates = findUpdatesForLoader(
    "neoforge", "1.20.1", { neoforge: "20.2.10" }, LATEST
  );
  assert.equal(updates.length, 1);
  assert.equal(updates[0].latest, "20.2.88");
  assert.equal(updates[0].current, "20.2.10");
});

test("findUpdatesForLoader ignores equal / unknown rows", () => {
  assert.equal(
    findUpdatesForLoader("neoforge", "1.20.1", { neoforge: "20.2.88" }, LATEST).length, 0
  );
  assert.equal(
    findUpdatesForLoader("neoforge", "9.9.9", { neoforge: "20.2.10" }, LATEST).length, 0
  );
});

test("runCheck aggregates across loader/MC", () => {
  const kb = {
    versions: {
      "1.20.1": { neoforge: "20.2.10", fabric: "0.15.7" },
      "1.21.1": { neoforge: "21.1.113", fabric: "0.16.0" },
      "1.20.4": { neoforge: "20.4.237" },
    },
  };
  const { updates } = runCheck(kb, LATEST);
  const loaders = updates.map((u) => u.loader).sort();
  assert.ok(loaders.includes("neoforge"));
  log("updates detected for:", updates.map((u) => `${u.loader}@${u.mcVer}`).join(", "));
});

// ── probe-forge-versions.js helpers ─────────────────────────────────────────

test("javaVersionForJavadoc uses structured compare", () => {
  assert.equal(javaVersionForJavadoc("1.7.10"), 7);
  assert.equal(javaVersionForJavadoc("1.10.2"), 7);
  assert.equal(javaVersionForJavadoc("1.11.2"), 8);
});

test("filterByVersion returns single entry or copy of full list", () => {
  const list = [{ mcVersion: "1.20.1" }, { mcVersion: "1.20.4" }];
  assert.equal(filterByVersion(list, "1.20.1").length, 1);
  assert.equal(filterByVersion(list, null).length, 2);
});

test("buildJavadocEntry shape", () => {
  const e = buildJavadocEntry(
    { mcVersion: "1.10.2", forgeVersion: "12.18.3.2185", url: "http://x" },
    { available: true, packageCount: 32 }
  );
  assert.equal(e.docSource, "javadoc");
  assert.equal(e.javaVersion, 7);
  assert.equal(e.javadoc.packageCount, 32);
});

test("buildMkDocsEntry fallback note when down", () => {
  const e = buildMkDocsEntry(
    { mcVersion: "1.20.1", forgeVersion: "47.2.0", mkdocsRoute: "1.20.1", javaVersion: 17, mappings: "mojmaps+parchment" },
    { ok: false },
    [],
    "https://docs.readthedocs.net/en/1.20.1/gettingstarted/"
  );
  assert.equal(e.note, "DNS/网络不可达，稍后重跑");
  assert.equal(e.mkdocs.available, false);
});

test("extractChapterPaths strips version prefix and asset links", () => {
  const base = "https://docs.readthedocs.net/en/1.20.1/gettingstarted/";
  const html = `
    <a href="../concepts/registries/">reg</a>
    <a href="../gettingstarted/index/">gs</a>
    <a href="../assets/logo.png">img</a>
    <a href="https://docs.readthedocs.net/en/1.20.1/concepts/sides/">side</a>
  `;
  const chapters = extractChapterPaths(html, base);
  // Filesystem-style path with at most 2 segments are kept (existing behaviour),
  // and the absolute version-prefixed href is normalised.
  assert.deepEqual(chapters, [
    "concepts/registries",
    "concepts/sides",
    "gettingstarted/index",
  ]);
});

test("buildManifest calls probe functions without network", async () => {
  const m = await buildManifest({
    javadocVersions: [{ mcVersion: "1.10.2", forgeVersion: "x", url: "http://t" }],
    mkdocsVersions:  [{ mcVersion: "1.20.1", forgeVersion: "y", mkdocsRoute: "1.20.1", javaVersion: 17, mappings: "moj" }],
    probeJavadoc:    async () => ({ available: true,  packageCount: 5 }),
    probeMkDocs:     async () => ({ ok: true, content: '<a href="../x/y/">a</a>', finalUrl: "https://docs.readthedocs.net/en/1.20.1/gettingstarted/", baseUrl: "https://docs.readthedocs.net/en/1.20.1/gettingstarted/" }),
  });
  assert.equal(m.versions["1.10.2"].javadoc.packageCount, 5);
  assert.equal(m.versions["1.20.1"].mkdocs.available, true);
});

// ── mcp-csv-extractor.js helpers ────────────────────────────────────────────

const SAMPLE_METHODS = [
  { searge: "func_123", name: "getName",   desc: "()Ljava/lang/String;" },
  { searge: "func_456", name: "func_456",  desc: "" },                          // skip (same as searge)
  { searge: "func_789", name: "doFoo",     desc: "(I)V" },
];
const SAMPLE_FIELDS = [
  { searge: "field_a", name: "name",     desc: "Ljava/lang/String;" },
  { searge: "field_b", name: "field_b",  desc: "" },                            // skip
];
const SAMPLE_PARAMS = [
  { param: "p_1_", name: "name" },
  { param: "p_2_", name: "value" },
];

test("validateColumns surfaces missing columns", () => {
  const errs = validateColumns([{ a: "1" }], ["a", "b"], "x.csv");
  assert.ok(errs.some((e) => e.includes("missing required column \"b\"")));
});

test("validateOutputs requires minimum counts", () => {
  const errs = validateOutputs({ methodLookup: {}, critical: { onlyOne: null }, classNames: [] });
  assert.ok(errs.length >= 1);
});

test("buildMethodEntries skips aliases and totalled correctly", () => {
  const { lookup, total } = buildMethodEntries(SAMPLE_METHODS);
  assert.equal(total, 2);
  assert.ok("func:func_123" in lookup);
  assert.ok(!("func:func_456" in lookup));
  assert.equal(lookup["func:func_789"].mcpName, "doFoo");
});

test("buildFieldEntries matches structure", () => {
  const { lookup, total } = buildFieldEntries(SAMPLE_FIELDS);
  assert.equal(total, 1);
  assert.ok("field:field_a" in lookup);
});

test("buildParamMap filters empty entries", () => {
  const m = buildParamMap(SAMPLE_PARAMS);
  assert.equal(m["p_1_"], "name");
  assert.equal(m["p_2_"], "value");
});

test("extractFromMappings returns consistent outputs and surfaces errors", () => {
  const ok = extractFromMappings({
    methods: SAMPLE_METHODS, fields: SAMPLE_FIELDS, params: SAMPLE_PARAMS,
  });
  assert.equal(ok.columnErrors.length, 0);
  assert.equal(ok.outputErrors.length, 0);
  assert.equal(Object.keys(ok.outputs.critical).length, CRITICAL_CLASSES_1_14.length);
  assert.ok(ok.outputs.classNames.length >= 3);

  const bad = extractFromMappings({ methods: [{ foo: "1" }], fields: [], params: [] });
  assert.ok(bad.columnErrors.length > 0);
});

// ── validate-forge-build.js helpers ─────────────────────────────────────────

test("rawStatusFor thresholds", () => {
  assert.equal(rawStatusFor(0,  10).ok, false);
  assert.equal(rawStatusFor(7,  10).level, "warn");
  assert.equal(rawStatusFor(10, 10).level, "ok");
  assert.equal(rawStatusFor(80, 100).level, "ok");
});

test("loadJson returns null for missing/bad", () => {
  assert.equal(loadJson("/no/such/file.json"), null);
});

test("countFiles returns 0 for missing path", () => {
  assert.equal(countFiles("/no/such/dir"), 0);
  assert.equal(countFilesRecursive("/no/such/dir"), 0);
});

test("checkManifest reports empty struct as missing info, not error", async () => {
  const r = checkManifest({ dataDir: "/no/such" });
  assert.equal(r.ok, false);
  assert.ok(r.bag.errors.some((e) => /MISSING/.test(e.msg)));
});

test("checkMkDocsVersions / checkJavadocVersions accept manifest override", () => {
  const manifest = {
    versions: {
      "1.20.1": {
        mkdocs: { available: true, chapters: [] },
      },
    },
  };
  // mkdocs: only the manifest-matching version enters the loop. With no data on
  // disk it should be reported as a failure (rawCount=0), pass+fail=1.
  const m = checkMkDocsVersions(manifest, { dataDir: "/no/such" });
  assert.equal(m.pass + m.fail, 1);

  // javadoc: manifest has no javadoc entries → everything SKIPs.
  const j = checkJavadocVersions(manifest, { dataDir: "/no/such" });
  assert.equal(j.ok, true);
  assert.equal(j.pass + j.fail, 0);
});

test("checkMappings returns bag without errors when both dirs empty (warnings only)", () => {
  const r = checkMappings({ dataDir: "/no/such" });
  assert.equal(r.ok, true);
  assert.equal(r.bag.errors.length, 0);
  assert.equal(r.bag.warnings.length, 2);
});

// ── DiagnosticBag helper ───────────────────────────────────────────────────

test("exitCodeFor honours bag state", () => {
  const empty = new DiagnosticBag();
  const failing = new DiagnosticBag();
  failing.error("bad");
  assert.equal(exitCodeFor(empty), 0);
  assert.equal(exitCodeFor(failing), 1);
});

test("DiagnosticBag toString formats warnings, errors, infos", () => {
  const b = new DiagnosticBag();
  b.warn("w"); b.error("e"); b.info("i");
  const out = b.toString();
  assert.match(out, /⚠ w/);
  assert.match(out, /✗ e/);
  assert.match(out, /· i/);
});

// The actual test definitions follow. We do not orchestrate the run from this
// file directly because node:test does not re-discover tests in the file that
// is already being evaluated. Instead, run via one of:
//
//   node scripts/_lib/test-helpers.mjs    (=> spawns `node --test` on itself)
//   node --test scripts/_lib/test-helpers.mjs
//
// Both honor the count summary written by the runner wrapper.




