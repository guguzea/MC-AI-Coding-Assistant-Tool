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
  chaptersFromSearchIndex,
} from "../probe-forge-versions.js";
import { htmlToMd, stripTags } from "../fetch-forge-docs.js";
import { splitClassUrl, parsePackageSummary } from "../fetch-forge-javadoc.js";
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
  const fakeIndexOk = async () => ({ ok: true, url: "https://x/search/search_index.json", chapters: ["a", "index", "models/advanced/imodel"] });
  const m = await buildManifest({
    javadocVersions: [{ mcVersion: "1.10.2", forgeVersion: "x", url: "http://t" }],
    mkdocsVersions:  [{ mcVersion: "1.20.1", forgeVersion: "y", mkdocsRoute: "1.20.1", javaVersion: 17, mappings: "moj" }],
    probeJavadoc:    async () => ({ available: true,  packageCount: 5 }),
    probeMkDocs:     async () => ({ ok: true, content: '<a href="../x/y/">a</a>', finalUrl: "https://docs.readthedocs.net/en/1.20.1/gettingstarted/", baseUrl: "https://docs.readthedocs.net/en/1.20.1/gettingstarted/" }),
    probeSearchIndex: fakeIndexOk,
  });
  assert.equal(m.versions["1.10.2"].javadoc.packageCount, 5);
  assert.equal(m.versions["1.20.1"].mkdocs.available, true);
  // F1：期望清单必须取上游 search_index，导航表只是兜底
  assert.equal(m.versions["1.20.1"].mkdocs.chaptersSource, "search_index");
  assert.deepEqual(m.versions["1.20.1"].mkdocs.chapters, ["a", "index", "models/advanced/imodel"]);
});

test("buildManifest falls back to nav when search_index unreadable", async () => {
  const m = await buildManifest({
    javadocVersions: [],
    mkdocsVersions:  [{ mcVersion: "1.20.1", forgeVersion: "y", mkdocsRoute: "1.20.1", javaVersion: 17, mappings: "moj" }],
    probeMkDocs:     async () => ({ ok: true, content: '<a href="../forgedev/">a</a>', finalUrl: "https://docs.minecraftforge.net/en/1.20.1/gettingstarted/", baseUrl: "https://docs.minecraftforge.net/en/1.20.1/gettingstarted/" }),
    probeSearchIndex: async () => ({ ok: false, reason: "HTTP 503" }),
  });
  assert.equal(m.versions["1.20.1"].mkdocs.chaptersSource, "nav");
  assert.ok(m.versions["1.20.1"].mkdocs.chapters.includes("forgedev"), "导航兜底表应含 forgedev");
});

test("chaptersFromSearchIndex 归一：空 location→index、去锚点、解码 %2B、去尾斜杠、去重", () => {
  const json = JSON.stringify({
    docs: [
      { location: "", title: "Home", text: "x" },
      { location: "index/", title: "Home dup", text: "x" },
      { location: "models/advanced/imodelstate%2Bpart/", title: "t", text: "x" },
      { location: "concepts/registries/#get-a-registry", title: "t", text: "x" },
      { location: "concepts/registries/", title: "t", text: "x" },
      { location: "?q=1", title: "t", text: "x" },
    ],
  });
  assert.deepEqual(chaptersFromSearchIndex(json), ["concepts/registries", "index", "models/advanced/imodelstate+part"]);
  assert.throws(() => chaptersFromSearchIndex(JSON.stringify({ location: [] })), /docs/);
  assert.throws(() => chaptersFromSearchIndex("{}"), /docs/);
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

// ── fetch-forge-docs.js 正文转换（C1：残留标签 / 残实体 / 围栏吞页）──────────
// 判据来自 2026-09-21 的 raw-vs-processed 实测：实体 508 篇、残标签 376 篇、
// 未配对围栏 21 篇、行内围栏可疑 189 篇。旧 stripTags「开标签原样留下、只删闭标签」
// 且只解 6 个实体，所以这几条断言每一条都对应一类真实脏数据。

test("stripTags removes opening tags, not just closing ones", () => {
  const out = stripTags('<div class="admonition"><ul><li>alpha</li><li>beta</li></ul></div>');
  assert.ok(!/<\//.test(out), `残留闭标签: ${out}`);
  assert.ok(!/<[a-zA-Z]/.test(out), `残留开标签: ${out}`);
  assert.ok(out.includes("alpha") && out.includes("beta"), `正文丢失: ${out}`);
});

test("stripTags turns inline code tags into backticks", () => {
  assert.equal(stripTags("use <code>heldItem</code> here"), "use `heldItem` here");
  // 上游写坏的行内 <code>（只有开标签）不得留下反引号半边 —— 189 篇的成因
  const broken = stripTags("The next parameter, <code>heldItem`, is the `ItemStack");
  assert.ok(!/<code>/.test(broken), broken);
  assert.equal((broken.match(/`/g) || []).length % 2, 0, `反引号不配对: ${broken}`);
});

test("stripTags decodes nothing — decoding happens exactly once, at the end", () => {
  // 各 handler 都调 stripTags；若它也解码，最终那次 stripTags 就会把
  // 已解出来的 <Codec<? extends X>> 当标签吃掉（实测 codecs 页丢了 3 个围栏 + 泛型）
  assert.equal(stripTags("player&rsquo;s &amp; List&lt;String&gt;"), "player&rsquo;s &amp; List&lt;String&gt;");
});

test("htmlToMd decodes the entities upstream actually leaves behind", () => {
  const out = htmlToMd("<p>player&rsquo;s health &mdash; it&hellip; uses &#8217; &nbsp; &amp; more</p>");
  assert.ok(out.includes("’"), out);
  assert.ok(out.includes("—"), out);
  assert.ok(out.includes("…"), out);
  assert.ok(!/&#?\w+;/.test(out), `仍有未解实体: ${out}`);
  assert.ok(out.includes(" & "), `&amp; 必须最后解: ${out}`);
});

test("htmlToMd keeps escaped generics in prose and in code blocks", () => {
  // 先删后解 ⇒ &lt; 在删标签时还是实体，解出来就是活文本；反序则整段泛型消失
  assert.equal(htmlToMd("<p>List&lt;String&gt; names</p>"), "List<String> names");
  const code = htmlToMd("<pre><code>IForgeRegistry&lt;Codec&lt;? extends X&gt;&gt; DISPATCH</code></pre>");
  assert.ok(code.includes("IForgeRegistry<Codec<? extends X>> DISPATCH"), `泛型被吃:\n${code}`);
});

test("htmlToMd keeps code blocks that sit inside list items", () => {
  // 旧 ul/ol handler 对整项做 \\s+→" "，把围栏压成一行 ⇒ 26 个 <pre> 只吐 49 个围栏行
  const md = htmlToMd(
    "<ol><li>Declare it:<pre><code>public static final Codec&lt;Foo&gt; X = ...;</code></pre></li>" +
    "<li>Then register.</li></ol>"
  );
  const fenceLines = md.split("\n").filter(l => /^\s*`{3,}/.test(l));
  assert.equal(fenceLines.length, 2, `围栏被折叠:\n${md}`);
  assert.ok(md.includes("public static final Codec<Foo> X = ...;"), md);
  assert.ok(md.includes("Then register."), md);
  assert.ok(!/```.*```/.test(md), `围栏没独占整行:\n${md}`);
});

test("htmlToMd keeps code fences paired when the block demonstrates markdown", () => {
  const page = [
    "<p>Docs use fences:</p>",
    "<pre><code>```java",
    "public class Foo {}",
    "```</code></pre>",
    "<p>After the block: <code>RegistryObject</code> matters.</p>",
  ].join("\n");
  const md = htmlToMd(page);
  const fenceLines = md.split("\n").filter(l => /^\s*`{3,}/.test(l));
  assert.equal(fenceLines.length % 2, 0, `围栏不配对:\n${md}`);
  assert.ok(md.includes("````"), "块中块必须加宽到 4 反引号:\n" + md);
  // 被吞掉的页尾必须还在正文里
  assert.ok(md.includes("RegistryObject") && md.includes("After the block"), md);
});

test("htmlToMd keeps ordinary code blocks at three backticks", () => {
  const md = htmlToMd("<pre><code>public class Bar {}\n</code></pre>");
  assert.ok(md.includes("```java"), md);
  assert.ok(!md.includes("````"), "无块中块时不得无故加宽:\n" + md);
  assert.equal(md.split("\n").filter(l => /^\s*`{3,}/.test(l)).length, 2, md);
});

// ── fetch-forge-javadoc.js 落盘归属（C2 溯源抓出的错档缺陷）─────────────────
// 症状：raw/net/minecraft/client/renderer/entity/Entity.md 的 source 指向
// …/net/minecraft/entity/Entity.html —— 页被按 package-summary 的包落盘，
// 于是索引里长出本不存在的 FQCN（6 档共 319 篇，且与正确那份逐字节重复）。

const JB = "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/";

test("splitClassUrl returns the full package, not just the last segment", () => {
  assert.deepEqual(
    splitClassUrl(JB + "net/minecraft/entity/Entity.html", JB),
    { pkg: "net/minecraft/entity", file: "Entity" },
  );
  assert.deepEqual(
    splitClassUrl(JB + "net/minecraft/block/Block.EnumOffsetType.html", JB),
    { pkg: "net/minecraft/block", file: "Block.EnumOffsetType" },
  );
});

test("splitClassUrl 认得 cpw 前档与锚点，认不出时交回 null 而不是错包", () => {
  const b7 = "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/";
  assert.deepEqual(
    splitClassUrl(b7 + "cpw/mods/fml/common/Loader.html#field.summary", b7),
    { pkg: "cpw/mods/fml/common", file: "Loader" },
  );
  // 无 baseUrl 时走 javadoc 根兜底
  assert.deepEqual(
    splitClassUrl("https://x/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/IStringSerializable.html"),
    { pkg: "net/minecraft/util", file: "IStringSerializable" },
  );
  assert.equal(splitClassUrl("https://example.com/totally/unrelated/index.html", JB), null);
});

test("splitClassUrl 对非 javadoc 根不得凭空造包", () => {
  // 「认不出就退回 summary 包」是判据：这里必须 null，不得把 https 主机名当包名
  assert.equal(splitClassUrl("https://x/base/ibxm/IBXM.html"), null);
});

// ── parsePackageSummary：成员锚点不得被当成类页 ────────────────────────────
// 盘上实证：raw/net/minecraftforge/client/event/GuiScreen.html#height.md 等
// 同一个类页按成员锚点重复落了几十遍（1.10.2 / 1.11.2 / 1.12.2 各 20+ 篇）。

test("parsePackageSummary 丢掉成员锚点，只收真正的类页", () => {
  const summary = "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/package-summary.html";
  const html = [
    '<td><a href="../../../../net/minecraft/client/gui/GuiScreen.html" title="class in net.minecraft.client.gui">GuiScreen</a></td>',
    '<a href="../../../../net/minecraft/client/gui/GuiScreen.html#height">height</a>',
    '<a href="../../../../net/minecraft/client/gui/GuiScreen.html#drawScreen-int-int-float-">drawScreen</a>',
    '<a href="package-summary.html">Package</a>',
    '<a href="../../../../overview-summary.html">Overview</a>',
    '<a href="../../../../help-doc.html">Help</a>',
    '<a href="../../../net/minecraft/client/gui/screen/package-tree.html">Tree</a>',
  ].join("\n");
  const got = parsePackageSummary(html, summary);
  assert.equal(got.length, 1, `应只剩 1 个真类页，实得 ${JSON.stringify(got)}`);
  assert.equal(got[0].name, "GuiScreen");
  assert.ok(!got[0].absUrl.includes("#"), `absUrl 还带锚点: ${got[0].absUrl}`);
  assert.equal(
    got[0].absUrl,
    "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiScreen.html",
  );
});

test("htmlToMd converts tables, links and headings without tag residue", () => {  const md = htmlToMd(
    '<h2>Registry</h2><table><tr><th>Name</th><th>Kind</th></tr>' +
    '<tr><td><code>Item</code></td><td>obj</td></tr></table>' +
    '<p>See <a href="https://docs.minecraftforge.net/en/1.20.1/concepts/">concepts</a>.</p>'
  );
  assert.ok(md.startsWith("## Registry") || md.includes("\n## Registry"), md);
  assert.match(md, /^Name\s*\|\s*Kind$/m);
  assert.match(md, /^---\s*\|\s*---$/m);
  assert.ok(md.includes("[concepts](https://docs.minecraftforge.net/en/1.20.1/concepts/)"), md);
  assert.ok(!/<\/?(?:table|tr|td|th|h2|p)\b/.test(md), `残留标签:\n${md}`);
});

// The actual test definitions follow. We do not orchestrate the run from this
// file directly because node:test does not re-discover tests in the file that
// is already being evaluated. Instead, run via one of:
//
//   node scripts/_lib/test-helpers.mjs    (=> spawns `node --test` on itself)
//   node --test scripts/_lib/test-helpers.mjs
//
// Both honor the count summary written by the runner wrapper.




