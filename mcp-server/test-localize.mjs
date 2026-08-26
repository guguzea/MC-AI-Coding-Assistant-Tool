/**
 * Tests for localize_mod (own + third_party jar flows).
 */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";
import { localizeMod } from "./dist/localize/index.js";
import { placeholdersMatch } from "./dist/localize/placeholders.js";
import { resolvePackFormat } from "./dist/localize/pack-format.js";
import { getWorkflowTemplate } from "./dist/prompts/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TMP = join(__dirname, "_temp_localize_test");

/** Minimal ZIP (store or deflate) writer for mock jars. */
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function buildZip(entries, { deflate = false } = {}) {
  const parts = [];
  const central = [];
  let offset = 0;

  for (const { name, content } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const compressed = deflate ? deflateRawSync(data) : data;
    const method = deflate ? 8 : 0;
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    const localHeaderOffset = offset;
    parts.push(local, nameBuf, compressed);
    offset += local.length + nameBuf.length + compressed.length;

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(method, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(compressed.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(localHeaderOffset, 42);
    central.push(cd, nameBuf);
  }

  const cdStart = offset;
  for (const c of central) {
    parts.push(c);
    offset += c.length;
  }
  const cdSize = offset - cdStart;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdStart, 16);
  eocd.writeUInt16LE(0, 20);
  parts.push(eocd);
  return Buffer.concat(parts);
}

function writeMockJar(name, entries, opts) {
  mkdirSync(TMP, { recursive: true });
  const p = join(TMP, name);
  writeFileSync(p, buildZip(entries, opts));
  return p;
}

function testOwnDiff() {
  const en = { "item.m.a": "Apple", "item.m.b": "Bread %s", "item.m.c": "Same" };
  const zh = { "item.m.a": "苹果", "item.m.c": "Same", "item.m.old": "旧键", "item.m.b": "面包 %d" };
  const r = localizeMod({ mode: "own", action: "diff", enUsJson: en, zhCnJson: zh });
  assert.equal(r.ok, true);
  assert.deepEqual(r.missingInZh, []);
  assert.ok(r.extraInZh.includes("item.m.old"));
  assert.ok(r.identicalToEn.includes("item.m.c"));
  assert.ok(r.placeholderMismatches.some((x) => x.key === "item.m.b"));
  assert.ok(typeof r.keyRenameHint === "string" && r.keyRenameHint.length > 10);
}

function testOwnDiffMissing() {
  const r = localizeMod({
    mode: "own",
    action: "diff",
    sourceJson: { a: "1", b: "2" },
    zhCnJson: { a: "一" },
  });
  assert.deepEqual(r.missingInZh, ["b"]);
  assert.deepEqual(r.extraInZh, []);
}

function testOwnNonStringKeysAndLocale() {
  const r = localizeMod({
    mode: "own",
    action: "diff",
    sourceJson: { a: "1", b: 2 },
    zhCnJson: { a: "一" },
    sourceLocale: "EN_GB",
  });
  assert.equal(r.ok, true);
  assert.equal(r.sourceLocaleUsed, "en_gb");
  assert.ok(r.warnings?.some((w) => /非字符串/.test(w) && /\bb\b/.test(w)), JSON.stringify(r.warnings));
}

function testOwnEmptyPreserved() {
  const r = localizeMod({
    mode: "own",
    action: "draft_zh",
    enUsJson: { a: "Hello" },
    zhCnJson: { a: "" },
  });
  assert.equal(r.ok, true);
  assert.deepEqual(r.needsTranslation, ["a"]);
  assert.ok(!(r.preservedFromExisting ?? []).includes("a"), JSON.stringify(r.preservedFromExisting));
}

function testPlaceholderNormalize() {
  assert.equal(placeholdersMatch("Hello %s", "你好 %1$s"), true);
  assert.equal(placeholdersMatch("val %f done", "值 %f 完"), true);
  assert.equal(placeholdersMatch("%s and %d", "%d ge, %s"), true, "顺序式按类型多重集");
  assert.equal(placeholdersMatch("%s and %s", "%s and %d"), false, "类型多重集不一致");
  assert.equal(placeholdersMatch("%2$s", "%1$s"), false, "位置式按编号");
  assert.equal(placeholdersMatch("%S %D", "%s %d"), true);
  assert.equal(placeholdersMatch("%.2f done", "完 %f"), true);
}

function testOwnDraft() {
  const r = localizeMod({
    mode: "own",
    action: "draft_zh",
    enUsJson: { a: "Hello", b: "World" },
    zhCnJson: { a: "你好" },
  });
  assert.equal(r.ok, true);
  assert.deepEqual(r.needsTranslation, ["b"]);
  assert.equal(r.zhCn.a, "你好");
  assert.equal(r.zhCn.b, "World");
  assert.ok(r.files["zh_cn.json"].includes("你好"));
}

function testOwnEmptySource() {
  const r = localizeMod({ mode: "own", action: "diff", enUsJson: {}, zhCnJson: {} });
  assert.equal(r.ok, true);
  assert.deepEqual(r.missingInZh, []);
}

function testOwnBadZh() {
  const r = localizeMod({
    mode: "own",
    action: "draft_zh",
    enUsJson: { a: "x" },
    zhCnJson: "{not json",
  });
  assert.equal(r.ok, true);
  assert.ok(r.warnings?.includes("ZH_PARSE_FAILED_TREATED_AS_EMPTY"));
  assert.deepEqual(r.needsTranslation, ["a"]);
}

function testOwnBadSource() {
  const r = localizeMod({ mode: "own", action: "diff", enUsJson: "{bad", zhCnJson: {} });
  assert.equal(r.ok, false);
  assert.equal(r.code, "LANG_PARSE_ERROR");
}

function testOwnMissingSource() {
  const r = localizeMod({ mode: "own", action: "diff" });
  assert.equal(r.ok, false);
  assert.equal(r.code, "INVALID_INPUT");
}

function testJarExtractEn() {
  const jar = writeMockJar("single-en.jar", [
    {
      name: "assets/demo/lang/en_us.json",
      content: JSON.stringify({ "item.demo.x": "X" }),
    },
  ]);
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, true);
  assert.equal(r.namespace, "demo");
  assert.equal(r.sourceLocaleUsed, "en_us");
  assert.equal(r.sourceLocaleFallback, false);
  assert.equal(r.source["item.demo.x"], "X");
}

function testJarPackDraft() {
  const jar = writeMockJar("pack.jar", [
    {
      name: "assets/demo/lang/en_us.json",
      content: JSON.stringify({ a: "A", b: "B" }),
    },
    {
      name: "assets/demo/lang/zh_cn.json",
      content: JSON.stringify({ a: "甲" }),
    },
  ]);
  const r = localizeMod({
    mode: "third_party",
    action: "pack_draft",
    jarPath: jar,
    mcVersion: "1.20.1",
  });
  assert.equal(r.ok, true);
  assert.equal(r.packFormat, 15);
  assert.equal(r.packFormatNeedsReview, true);
  assert.equal(r.zhCn.a, "甲");
  assert.equal(r.zhCn.b, "B");
  assert.deepEqual(r.needsTranslation, ["b"]);
  assert.ok(r.files["pack.mcmeta"]);
  assert.ok(r.files["assets/demo/lang/zh_cn.json"]);
}

function testJarFallbackDe() {
  const jar = writeMockJar("de-only.jar", [
    {
      name: "assets/demo/lang/de_de.json",
      content: JSON.stringify({ hello: "Hallo" }),
    },
    {
      name: "assets/demo/lang/zh_cn.json",
      content: JSON.stringify({}),
    },
  ]);
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, true);
  assert.equal(r.sourceLocaleUsed, "de_de");
  assert.equal(r.sourceLocaleFallback, true);
  assert.equal(r.source.hello, "Hallo");
}

function testJarDotLang() {
  // D-5：pre-flattening .lang 行式格式（<1.13 / 基岩同族）
  const langContent = [
    "# comment line",
    "item.demo.x=X",
    "item.demo.y=Y with \\n newline",
    "",
    "item.demo.z=Z",
  ].join("\n");
  const jar = writeMockJar("dotlang.jar", [
    { name: "assets/demo/lang/en_us.lang", content: langContent },
    { name: "assets/demo/lang/zh_cn.lang", content: "item.demo.x=叉\n" },
  ]);
  const ex = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(ex.ok, true, JSON.stringify(ex).slice(0, 300));
  assert.equal(ex.namespace, "demo");
  assert.equal(ex.sourceLocaleUsed, "en_us");
  assert.equal(ex.source["item.demo.x"], "X");
  assert.equal(ex.source["item.demo.y"], "Y with \\n newline");
  assert.ok(ex.files["en_us.lang"], "extract 应输出 .lang 源文件");
  assert.ok(ex.files["zh_cn.lang"], "已有 zh 应按 .lang 输出");
  assert.ok(ex.notes.some((n) => /\.lang 行式格式/.test(n)), ex.notes.join("|"));

  const draft = localizeMod({ mode: "third_party", action: "pack_draft", jarPath: jar, mcVersion: "1.12.2" });
  assert.equal(draft.ok, true);
  const zhKey = "assets/demo/lang/zh_cn.lang";
  assert.ok(draft.files[zhKey], `pack_draft 应产出 ${zhKey}：${Object.keys(draft.files).join(",")}`);
  const body = draft.files[zhKey];
  assert.match(body, /^item\.demo\.x=叉$/m);
  assert.match(body, /^item\.demo\.y=Y with \\n newline$/m, "值内 \\n 字面量必须原样保留");
  assert.equal(draft.needsTranslation.includes("item.demo.y"), true);
}

function testJarChineseOnly() {
  const jar = writeMockJar("zh-only.jar", [
    {
      name: "assets/demo/lang/zh_cn.json",
      content: JSON.stringify({ a: "已有" }),
    },
  ]);
  const r = localizeMod({ mode: "third_party", action: "pack_draft", jarPath: jar, mcVersion: "1.20.1" });
  assert.equal(r.ok, true);
  assert.equal(r.code, "Chinese_ready_in");
  assert.equal(r.zhCn.a, "已有");
  assert.ok(r.files["assets/demo/lang/zh_cn.json"].includes("已有"));
  assert.ok(r.notes?.some((n) => /无法检测缺失键|Chinese_ready_in/.test(n)));
}

function testJarAmbiguousNs() {
  const jar = writeMockJar("multi-ns.jar", [
    { name: "assets/ns_a/lang/en_us.json", content: "{}" },
    { name: "assets/ns_b/lang/en_us.json", content: "{}" },
  ]);
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, false);
  assert.equal(r.code, "NAMESPACE_AMBIGUOUS");
  assert.ok(r.availableNamespaces.includes("ns_a"));
  assert.ok(r.availableNamespaces.includes("ns_b"));

  const r2 = localizeMod({
    mode: "third_party",
    action: "extract",
    jarPath: jar,
    namespace: "ns_b",
  });
  assert.equal(r2.ok, true);
  assert.equal(r2.namespace, "ns_b");
}

function testJarNotFound() {
  const r = localizeMod({
    mode: "third_party",
    action: "extract",
    jarPath: join(TMP, "no-such-file.jar"),
  });
  assert.equal(r.ok, false);
  assert.equal(r.code, "JAR_NOT_FOUND");
}

function testJarBadSourceJson() {
  const jar = writeMockJar("bad-en.jar", [
    { name: "assets/demo/lang/en_us.json", content: "{broken" },
  ]);
  const r = localizeMod({ mode: "third_party", action: "pack_draft", jarPath: jar });
  assert.equal(r.ok, false);
  assert.equal(r.code, "LANG_PARSE_ERROR");
  assert.equal(r.files, undefined);
}

function testJarBadNs() {
  const jar = writeMockJar("one.jar", [
    { name: "assets/demo/lang/en_us.json", content: "{}" },
  ]);
  const r = localizeMod({
    mode: "third_party",
    action: "extract",
    jarPath: jar,
    namespace: "nope",
  });
  assert.equal(r.ok, false);
  assert.equal(r.code, "NAMESPACE_NOT_FOUND");
}

function testJarNoLang() {
  const jar = writeMockJar("nolan.jar", [
    { name: "META-INF/mods.toml", content: "modId=x" },
  ]);
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, false);
  assert.equal(r.code, "LANG_NOT_IN_JAR");
}

function testJarSkippedMinecraftLang() {
  const jar = writeMockJar("mc-lang.jar", [
    { name: "assets/minecraft/lang/en_us.json", content: "{}" },
  ]);
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, false);
  assert.equal(r.code, "LANG_NOT_IN_JAR");
  assert.equal(r.skippedMinecraftLang, 1);
}

function testJarZhSibling() {
  const jar = writeMockJar("zh-hk.jar", [
    { name: "assets/demo/lang/en_us.json", content: JSON.stringify({ a: "A", b: "B" }) },
    { name: "assets/demo/lang/zh_hk.json", content: JSON.stringify({ a: "甲" }) },
  ]);
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, true, JSON.stringify(r).slice(0, 300));
  assert.deepEqual(r.missingInZh, ["b"]);
  assert.equal(r.zhCn.a, "甲");
}

function testJarPackDraftZhFormat() {
  const jar = writeMockJar("mix-fmt.jar", [
    { name: "assets/demo/lang/en_us.lang", content: "a=A\nb=B\n" },
    { name: "assets/demo/lang/zh_cn.json", content: JSON.stringify({ a: "甲" }) },
  ]);
  const draft = localizeMod({ mode: "third_party", action: "pack_draft", jarPath: jar, mcVersion: "1.12.2" });
  assert.equal(draft.ok, true, JSON.stringify(draft).slice(0, 300));
  assert.equal(draft.zhFormat, "json");
  assert.equal(draft.sourceFormat, "lang");
  assert.ok(draft.files["assets/demo/lang/zh_cn.json"], Object.keys(draft.files ?? {}).join(","));
  assert.equal(draft.files["assets/demo/lang/zh_cn.lang"], undefined);
}

function testJarBadZhContinues() {
  const jar = writeMockJar("bad-zh.jar", [
    { name: "assets/demo/lang/en_us.json", content: JSON.stringify({ a: "A" }) },
    { name: "assets/demo/lang/zh_cn.json", content: "{bad" },
  ]);
  const r = localizeMod({ mode: "third_party", action: "pack_draft", jarPath: jar });
  assert.equal(r.ok, true);
  assert.ok(r.warnings?.includes("ZH_PARSE_FAILED_TREATED_AS_EMPTY"));
  assert.deepEqual(r.needsTranslation, ["a"]);
}

function testDeflatedJar() {
  const jar = writeMockJar(
    "deflated.jar",
    [{ name: "assets/demo/lang/en_us.json", content: JSON.stringify({ z: "Zed" }) }],
    { deflate: true },
  );
  const r = localizeMod({ mode: "third_party", action: "extract", jarPath: jar });
  assert.equal(r.ok, true);
  assert.equal(r.source.z, "Zed");
}

function testPackFormatMap() {
  assert.equal(resolvePackFormat("1.21.4").packFormat, 46);
  const v218 = resolvePackFormat("1.21.8");
  assert.equal(v218.packFormat, 64);
  assert.notEqual(v218.packFormat, 15);
  assert.equal(resolvePackFormat("1.21.5").packFormat, 55);
  assert.equal(resolvePackFormat("26.1").packFormat, 84);
  const unknown = resolvePackFormat("9.9.9");
  assert.equal(unknown.packFormat, 15);
  assert.ok(unknown.notes.some((n) => /未知 mcVersion/.test(n)));
}

function testWorkflow() {
  const t = getWorkflowTemplate("mc-localize-mod");
  assert.equal(t.found, true);
  assert.ok(t.body?.includes("localize_mod"));
  assert.ok(t.body?.includes("packFormatNeedsReview") || t.body?.includes("pack_format"));
}

function optionalRealJars() {
  const tempRoot = join(__dirname, "..", "temp");
  if (!existsSync(tempRoot)) return;
  // Smoke only if known jars exist — skip quietly otherwise
  console.log("  (optional real jar smoke skipped unless present)");
}

function cleanup() {
  try {
    rmSync(TMP, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

function main() {
  cleanup();
  const tests = [
    testOwnDiff,
    testOwnDiffMissing,
    testOwnNonStringKeysAndLocale,
    testOwnDraft,
    testOwnEmptyPreserved,
    testPlaceholderNormalize,
    testOwnEmptySource,
    testOwnBadZh,
    testOwnBadSource,
    testOwnMissingSource,
    testJarExtractEn,
    testJarPackDraft,
    testJarFallbackDe,
    testJarDotLang,
    testJarChineseOnly,
    testJarAmbiguousNs,
    testJarNotFound,
    testJarBadSourceJson,
    testJarBadNs,
    testJarNoLang,
    testJarSkippedMinecraftLang,
    testJarZhSibling,
    testJarPackDraftZhFormat,
    testJarBadZhContinues,
    testDeflatedJar,
    testPackFormatMap,
    testWorkflow,
  ];
  for (const t of tests) {
    t();
    console.log(`ok ${t.name}`);
  }
  optionalRealJars();
  cleanup();
  console.log("test-localize: all passed");
}

main();
