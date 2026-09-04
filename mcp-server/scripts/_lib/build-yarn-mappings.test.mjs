import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  parseTinyToClassMap,
  parseTinyV1,
  renderYarnMappingJson,
  reconcileTinyWithJson,
  compareCensus,
  hasNoYarnName,
  isSkippedBySqliteBuilder,
  findYarnTinyPacks,
  verifyPack,
  TINY_V1_COLUMNS,
} from "./build-yarn-mappings.mjs";

/**
 * Synthetic tiny v1 fixture. Columns (verified against
 * data/fabric_1.21.11/mappings/yarn-1.21.11+build.6-tiny.gz):
 *   CLASS  (4) official | intermediary | named
 *   FIELD  (6) owner | desc | officialName | intermediaryName | namedName
 *   METHOD (6) owner | desc | officialName | intermediaryName | namedName
 */
const SAMPLE = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "FIELD\ta\tLaA;\tb\tfield_40713\tNEGATIVE_X",
  "METHOD\ta\t()V\tnet/minecraft/class_3\tmethod_6032\tdidFoo",
  "CLASS\tb\tnet/minecraft/class_10\tnet/minecraft/Beta",
  // genuinely unmapped: named column still carries the intermediary id
  "METHOD\tb\t(I)Z\tx\tmethod_9\tmethod_9",
  // unmapped by pattern (named is a method_N id but differs from intermediary col)
  "FIELD\tb\tI\ty\tfield_77\tfield_78",
  "",
].join("\n");

const META = { version: "1.21.1+build.3", source: "synthetic", format: "yarn-tiny-v1" };

test("tiny v1 tag/column contract: CLASS=4, FIELD/METHOD=6", () => {
  assert.equal(TINY_V1_COLUMNS.CLASS, 4);
  assert.equal(TINY_V1_COLUMNS.FIELD, 6);
  assert.equal(TINY_V1_COLUMNS.METHOD, 6);
});

test("FIELD/METHOD take the LAST column as namedName (N-7 regression)", () => {
  const out = parseTinyToClassMap(SAMPLE);
  const field = out.methodMap["net/minecraft/Alpha.field_40713:LaA;"];
  assert.equal(field.namedName, "NEGATIVE_X", "namedName must be cols[5], not cols[4]");
  assert.equal(field.intermediaryName, "field_40713");
  assert.equal(field.officialName, "b");
  assert.equal(field.officialClass, "a");
  assert.equal(field.intermediaryClass, "net/minecraft/class_1");
  assert.equal(field.namedClass, "net/minecraft/Alpha");
  assert.equal(field.descriptor, "LaA;");
  assert.equal(field.kind, "field");

  const method = out.methodMap["net/minecraft/Alpha.method_6032:()V"];
  assert.equal(method.namedName, "didFoo");
  assert.equal(method.intermediaryName, "method_6032");
  assert.equal(method.kind, "method");
});

test("counts are per-tag: classCount/methodCount/fieldCount", () => {
  const out = parseTinyToClassMap(SAMPLE);
  assert.equal(out.classCount, 2);
  assert.equal(out.methodCount, 2); // METHOD rows only
  assert.equal(out.fieldCount, 2); // FIELD rows are counted too
  assert.equal(out.memberCount, 4);
  assert.equal(Object.keys(out.classMap).length, 2);
  assert.equal(Object.keys(out.methodMap).length, 4);
  // Legacy import regex in build-yarn-sqlite.mjs pins this key set/order.
  assert.deepEqual(Object.keys(out.classMap["net/minecraft/Alpha"]), [
    "officialClass",
    "intermediaryClass",
    "namedClass",
  ]);
});

test("census reports selfEq and legitimately-unmapped separately", () => {
  const out = parseTinyToClassMap(SAMPLE);
  assert.equal(out.unmappedNamed.CLASS, 0);
  assert.equal(out.unmappedNamed.methodSelfEq, 1, "method_9 === method_9");
  assert.equal(out.unmappedNamed.fieldSelfEq, 0, "field_77 !== field_78");
  assert.equal(out.unmappedNamed.method, 1);
  assert.equal(out.unmappedNamed.field, 1, "field_78 has no yarn name even though it differs");
  assert.equal(hasNoYarnName("method", "didFoo"), false);
  assert.equal(hasNoYarnName("field", "NEGATIVE_X"), false);
});

test("5-column member row is an ERROR, never a silent skip", () => {
  const bad = [
    "v1\tofficial\tintermediary\tnamed",
    "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
    "FIELD\ta\tLaA;\tb\tfield_40713", // 5 cols — one short
  ].join("\n");
  assert.throws(
    () => parseTinyToClassMap(bad),
    /expected 6 columns, got 5/,
    "strict default must fail the build",
  );
  const lenient = parseTinyToClassMap(bad, { strict: false });
  assert.equal(lenient.badRows.length, 1);
  assert.equal(lenient.badRows[0].tag, "FIELD");
  assert.equal(lenient.badRows[0].expected, 6);
  assert.equal(lenient.badRows[0].actual, 5);
  assert.equal(lenient.badRows[0].lineNo, 3);
  assert.equal(Object.keys(lenient.methodMap).length, 0, "bad row must not become a partial row");
});

test("unknown/other tags are counted, not parsed", () => {
  const r = parseTinyV1(
    [
      "v1\tofficial\tintermediary\tnamed",
      "COMMENT\tthis is a comment",
      "CLASS\ta\tclass_1\tAlpha",
      "",
    ].join("\n"),
  );
  assert.equal(r.otherTagLines, 1);
  assert.equal(r.totalDataLines, 2);
  assert.equal(r.classes.length, 1);
});

test("flat tiny layout resolves owner by official, not by last CLASS", () => {
  const out = parseTinyToClassMap(
    [
      "v1\tofficial\tintermediary\tnamed",
      "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
      "CLASS\tb\tnet/minecraft/class_10\tnet/minecraft/Beta",
      "METHOD\ta\t()V\tx\tmethod_1\tfromAlpha",
      "",
    ].join("\n"),
  );
  assert.ok(out.methodMap["net/minecraft/Alpha.method_1:()V"]);
  assert.equal(out.unresolvedOwner.length, 0);
});

test("member row without a CLASS owner is an error", () => {
  assert.throws(
    () => parseTinyToClassMap("v1\tofficial\tintermediary\tnamed\nMETHOD\tz\t()V\tx\tmethod_1\tfoo"),
    /unresolvable owner/,
  );
});

test("renders yarn-mappings.json and reconciles 0-diff against tiny", () => {
  const parsed = parseTinyToClassMap(SAMPLE);
  const json = renderYarnMappingJson(parsed, META);
  const back = JSON.parse(json);
  assert.equal(back.version, "1.21.1+build.3");
  assert.equal(back.classCount, 2);
  assert.equal(back.methodCount, 2);
  assert.equal(back.fieldCount, 2);
  assert.equal(back.classMap["net/minecraft/Alpha"].intermediaryClass, "net/minecraft/class_1");
  assert.equal(back.methodMap["net/minecraft/Alpha.field_40713:LaA;"].namedName, "NEGATIVE_X");

  const { errors, census } = reconcileTinyWithJson(SAMPLE, back);
  assert.deepEqual(errors, [], `reconcile must be green, got ${errors.join(" | ")}`);
  assert.equal(census.badColumnRows, 0);
  assert.equal(census.class.total, 2);
  assert.equal(census.method.total, 2);
  assert.equal(census.field.total, 2);
});

test("reconcile is RED when a row carries the pre-fix column index", () => {
  const parsed = parseTinyToClassMap(SAMPLE);
  const row = parsed.methodMap["net/minecraft/Alpha.field_40713:LaA;"];
  row.namedName = row.intermediaryName; // the p[4] bug
  const { errors, census } = reconcileTinyWithJson(SAMPLE, JSON.parse(renderYarnMappingJson(parsed, META)));
  assert.ok(errors.some((e) => /namedName json="field_40713" tiny="NEGATIVE_X"/.test(e)), errors[0]);
  // census 立刻不等：具名行被当成未映射
  assert.equal(census.field.unmapped, 1, "tiny 侧真值");
  assert.equal(census.json.field.unmapped, 2, "投毒后 json 侧多出一条");
  assert.equal(census.json.field.selfEq, 1);
  assert.ok(
    errors.some((e) => e.includes("tiny↔json census field.unmapped")),
    errors.join(" | "),
  );
  assert.ok(errors.some((e) => e.includes("tiny↔json census field.selfEq")), errors.join(" | "));
});

test("reconcile is RED for an orphan JSON row and for a missing row", () => {
  const parsed = parseTinyToClassMap(SAMPLE);
  const poisoned = JSON.parse(renderYarnMappingJson(parsed, META));
  poisoned.methodMap["net/minecraft/Alpha.field_999999:LaA;"] = {
    officialClass: "a",
    officialName: "zz",
    intermediaryClass: "net/minecraft/class_1",
    intermediaryName: "field_999999",
    namedClass: "net/minecraft/Alpha",
    namedName: "GHOST",
    descriptor: "LaA;",
    kind: "field",
  };
  const r1 = reconcileTinyWithJson(SAMPLE, poisoned);
  assert.ok(r1.errors.some((e) => e.startsWith("orphan methodMap row")), r1.errors[0]);

  const missing = JSON.parse(renderYarnMappingJson(parsed, META));
  delete missing.classMap["net/minecraft/Beta"];
  const r2 = reconcileTinyWithJson(SAMPLE, missing);
  assert.ok(r2.errors.some((e) => e.startsWith("missing classMap row")), r2.errors[0]);
  assert.ok(r2.errors.some((e) => e.startsWith("classMap 缺失")), r2.errors.join(" | "));

  const missingMember = JSON.parse(renderYarnMappingJson(parsed, META));
  delete missingMember.methodMap["net/minecraft/Beta.method_9:(I)Z"];
  const r3 = reconcileTinyWithJson(SAMPLE, missingMember);
  assert.ok(r3.errors.some((e) => e.startsWith("missing methodMap row")), r3.errors.join(" | "));
  assert.ok(r3.errors.some((e) => e.startsWith("methodMap 缺失")), r3.errors.join(" | "));
});

test("bad tiny row is RED in reconcile even with a matching JSON", () => {
  const bad = `${SAMPLE.replace("FIELD\tb\tI\ty\tfield_77\tfield_78", "FIELD\tb\tI\ty\tfield_77")}\n`;
  const parsed = parseTinyToClassMap(SAMPLE);
  const { errors, census } = reconcileTinyWithJson(bad, JSON.parse(renderYarnMappingJson(parsed, META)));
  assert.ok(errors.some((e) => /expected 6 columns, got 5/.test(e)), errors.join(" | "));
  assert.equal(census.badColumnRows, 1);
});

test("compareCensus is RED when the sqlite side disagrees", () => {
  const parsed = parseTinyToClassMap(SAMPLE);
  const { census } = reconcileTinyWithJson(SAMPLE, JSON.parse(renderYarnMappingJson(parsed, META)));
  const agree = {
    meta: { classCount: 2, methodCount: 2, fieldCount: 2 },
    class: { total: 2, selfEq: 0, unmapped: 0 },
    method: { total: 2, selfEq: 1, unmapped: 1 },
    field: { total: 2, selfEq: 0, unmapped: 1 },
  };
  assert.deepEqual(compareCensus(census, agree), []);
  const disagree = { ...agree, method: { total: 2, selfEq: 1, unmapped: 13623 } };
  assert.ok(compareCensus(census, disagree).some((e) => /legitimately-unmapped/.test(e)));
});

test("isSkippedBySqliteBuilder 钉住 sqlite 的三条跳过规则", () => {
  assert.equal(isSkippedBySqliteBuilder("class", { namedClass: "", intermediaryClass: "class_1" }), true);
  assert.equal(isSkippedBySqliteBuilder("method", { namedClass: "", namedName: "didFoo" }), true);
  assert.equal(isSkippedBySqliteBuilder("method", { namedClass: "A", namedName: "" }), true);
  assert.equal(
    isSkippedBySqliteBuilder("method", { namedClass: "A", namedName: "<init>" }),
    true,
    "构造器不入库：sqlite 与 tiny 的 method 差额全部来自这条规则",
  );
  assert.equal(
    isSkippedBySqliteBuilder("field", { namedClass: "A", namedName: "<row>" }),
    false,
    "`<` 规则只作用于 method —— 字段没有构造器，扩到字段会把入库子集算小",
  );
  assert.equal(isSkippedBySqliteBuilder("class", { namedClass: "A", intermediaryClass: "class_1" }), false);
});

/** 含构造器行的最小档：全量 2 条 METHOD，入库只有 1 条。 */
const TINY_CTOR = [
  "v1\tofficial\tintermediary\tnamed",
  "CLASS\ta\tnet/minecraft/class_1\tnet/minecraft/Alpha",
  "METHOD\ta\t()V\t<init>\tmethod_25609\t<init>",
  "METHOD\ta\t()V\trun\tmethod_6032\tdidFoo",
  "FIELD\ta\tI\tv\tfield_1\tvalue",
  "",
].join("\n");

test("census 分两套口径：全量 total 与 sqlite 入库子集", () => {
  const parsed = parseTinyToClassMap(TINY_CTOR);
  const { errors, census } = reconcileTinyWithJson(TINY_CTOR, JSON.parse(renderYarnMappingJson(parsed, META)));
  assert.deepEqual(errors, [], `最小档对账必须绿，得到 ${errors.join(" | ")}`);
  assert.equal(census.method.total, 2, "tiny 解析出 2 条 METHOD");
  assert.equal(census.method.inserted, 1, "其中 <init> 不入库");
  assert.equal(census.method.selfEqInserted, 0);
  assert.equal(census.method.unmappedInserted, 0);
  assert.equal(census.class.total, 1);
  assert.equal(census.class.inserted, 1);
  assert.equal(census.field.total, 1);
  assert.equal(census.field.inserted, 1);
  assert.equal(census.json.method.inserted, 1, "json 侧独立测得同一入库子集");

  const sql = {
    meta: { classCount: 1, methodCount: 2, fieldCount: 1 },
    class: { total: 1, selfEq: 0, unmapped: 0 },
    method: { total: 1, selfEq: 0, unmapped: 0 },
    field: { total: 1, selfEq: 0, unmapped: 0 },
  };
  assert.deepEqual(compareCensus(census, sql), [], "sqlite 腿比入库子集、meta 比全量");
  assert.ok(
    compareCensus(census, { ...sql, method: { total: 2, selfEq: 0, unmapped: 0 } }).some((e) =>
      /methods.inserted/.test(e),
    ),
    "把 <init> 也算成入库行必须报红",
  );
});

test("findYarnTinyPacks 只收 tiny 源 pack，薄档以 null json 呈现", () => {
  const root = mkdtempSync(path.join(tmpdir(), "yarnpacks-"));
  try {
    const mk = (pack, files) => {
      const dir = path.join(root, pack, "mappings");
      mkdirSync(dir, { recursive: true });
      for (const f of files) writeFileSync(path.join(dir, f), "");
    };
    mk("fabric_1.2.3", ["yarn-1.2.3+build.9-tiny.gz", "yarn-mappings.json", "yarn-mappings.sqlite"]);
    mk("fabric_1.2.4", ["yarn-1.2.4+build.1-tiny.gz", "yarn-mappings.sqlite"]);
    mk("forge_1.2.5", ["joined.srg", "yarn-mappings.sqlite"]);
    mk("fabric_1.2.6", ["yarn-1.2.6+build.2-tiny.gz"]);
    mk("bedrock_stable", []);
    const packs = findYarnTinyPacks(root);
    assert.deepEqual(
      packs.map((p) => p.pack),
      ["fabric_1.2.3", "fabric_1.2.4", "fabric_1.2.6"],
      "MCP/joined.srg 档无 tiny 源，按构造排除；mappings 目录里没有 tiny 的 pack 也不得出现",
    );
    assert.ok(packs[0].json && packs[0].sqlite);
    assert.equal(packs[1].json, null, "薄档没有 yarn-mappings.json");
    assert.equal(packs[2].sqlite, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("verifyPack 的两条 RED 路径都不得静默通过", () => {
  const noSqlite = verifyPack({
    pack: "fabric_1.2.6",
    tiny: "nowhere.tiny.gz",
    json: null,
    sqlite: null,
  });
  assert.equal(noSqlite.ok, false);
  assert.match(noSqlite.errors.join(" | "), /缺 yarn-mappings\.sqlite/);

  const root = mkdtempSync(path.join(tmpdir(), "yarnpackbad-"));
  try {
    const dir = path.join(root, "fabric_1.2.4", "mappings");
    mkdirSync(dir, { recursive: true });
    const tiny = path.join(dir, "yarn-1.2.4+build.1-tiny.gz");
    const sqlite = path.join(dir, "yarn-mappings.sqlite");
    writeFileSync(tiny, Buffer.from(""));
    writeFileSync(sqlite, "");
    const unreadable = verifyPack({ pack: "fabric_1.2.4", tiny, json: null, sqlite });
    assert.equal(unreadable.ok, false, "读不动的产物必须 RED，不能抛堆栈让其余 pack 失声");
    assert.match(unreadable.errors.join(" | "), /对账无法完成/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
