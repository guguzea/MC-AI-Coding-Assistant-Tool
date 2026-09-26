/**
 * offline tests for scripts/audit-data-consistency.mjs
 * ─────────────────────────────────────────────────────
 * Builds a synthetic fixture under a temp dir, runs the audit, and asserts:
 *   1. The fixture tree is not mutated after the audit (read-only contract).
 *   2. Planted ERRORs are surfaced with the right path/expected/actual tri-tuple.
 *   3. The CLI parser handles both `version` forms (MC version + index path).
 *   4. An empty data root (scanned=0) is a hard ERROR + exit 1, not a silent pass
 *      (S17-T2, round 33 — the vacuous pass used to exit 0).
 *   5. The dup-key collector is indentation-agnostic: 2-space / 4-space / tab /
 *      minified duplicates all red; collecting 0 keys is itself an ERROR (S17-T1).
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
import { fileURLToPath } from "node:url";

import {
  auditIndex,
  parseArgs,
  parseIndexName,
  collectTopLevelJsonKeys,
  manifestKeyCensus,
  RAW_PROCESSED_SET_EXCEPTIONS,
  skipsRawProcessedSet,
  l0ProcessedStem,
} from "./scripts/audit-data-consistency.mjs";

// 2026-09-17：pathname 在含非 ASCII 的路径下是百分号编码（如 桌面 → %E6%A1%8C%E9%9D%A2），
// 手搓 replace 前导 "/" 会得到不存在的编码路径 → spawnSync ENOENT、stdout undefined。
// 必须用 fileURLToPath（解码 + Windows 盘符处理），与 test-core 等同口径。
const REPO = path.dirname(fileURLToPath(import.meta.url));
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

// S17/T3（第 32 轮）+ S17-T1 采集面放宽（第 33 轮）：`G-manifest-dup-key` 的可红性 + 采集非空证明。
// 该腿自 第 11 轮 起就在 `scripts/audit-data-consistency.mjs`（读侧：JSON.parse 对重复键
// last-wins 静默吞并，故按**原始文本**数顶层键）。第 32 轮只证了它「能红」（2 空格夹具）。
// 第 33 轮补的是它缺失的**形状无关性**：旧采集正则 `/^ {2}"/gm` 只认「行首恰好 2 空格」，
// 4 空格 / tab / 压成一行的 manifest 采集 0 条 ⇒ 静默放行（= 第 32 轮 P2 反证抓到的「恒真于空」）。
// 现采集器 = `collectTopLevelJsonKeys`（字符串态 + 括号深度扫描，缩进不参与判定），
// 第二机制 = `JSON.parse` 顶层唯一键集，两机制交叉核；采到 0 条本身判红（`G-manifest-collector-zero`）。
// 本例因此要跑**四组缩进形状**的投毒 + 一组干净对照 + 一组「嵌套重复键不判」对照。
async function testManifestDupKeyLeg() {
  const root = tmpRoot("manidup");
  buildCleanFixture(root);
  const manifest = path.join(root, "forge_1.20.1", "forge-docs", "_manifest.json");

  // 正对照：同一条目写一次 ⇒ 腿不触发、整体 rc=0（腿不得对干净数据判红）。
  writeText(manifest, JSON.stringify({ "1.20.1/intro": { file: "intro.md" } }, null, 2));
  const clean = spawnAudit(["--data-root=" + root, "--platform=forge"], SCRIPTS_DIR, root);
  assert.equal(clean.status, 0, `干净 manifest 应 rc=0，实得:\n${clean.stdout}`);
  assert.ok(
    !JSON.parse(clean.stdout).issues.some((i) => i.check.startsWith("G-manifest-")),
    "干净夹具不得触发去重腿或采集器零腿",
  );

  // ---- 采集器形状无关性（第 33 轮核心）：同一份「重复顶层键」正文，四种缩进形态都必须红 ----
  const indentShape = (pad) => `{\n${pad}"1.20.1/intro": {\n${pad}${pad}"file": "intro.md"\n${pad}},\n`
    + `${pad}"1.20.1/intro": {\n${pad}${pad}"file": "intro.md"\n${pad}}\n}\n`;
  const shapes = [
    ["2 空格（旧正则唯一认得的形状）", indentShape("  ")],
    ["4 空格（旧正则采 0 条 ⇒ 静默放行）", indentShape("    ")],
    ["tab（旧正则采 0 条）", indentShape("\t")],
    ["压缩成一行（旧正则采 0 条）", '{"1.20.1/intro":{"file":"intro.md"},"1.20.1/intro":{"file":"intro.md"}}'],
  ];
  for (const [label, body] of shapes) {
    // 先自证「旧正则在该形状下确实采 0 条」——否则这条投毒不构成对旧洞的反证。
    if (!label.startsWith("2 空格")) {
      assert.equal((body.match(/^ {2}"/gm) ?? []).length, 0, `${label}：旧 2 空格正则本应采 0 条，夹具形状变了`);
    }
    writeText(manifest, body);
    const poisoned = spawnAudit(["--data-root=" + root, "--platform=forge"], SCRIPTS_DIR, root);
    assert.equal(poisoned.status, 1, `${label} + 重复顶层键必须 rc=1，实得 0 ⇒ 采集面仍有形状洞:\n${poisoned.stdout}`);
    const payload = JSON.parse(poisoned.stdout);
    const hits = payload.issues.filter((i) => i.check === "G-manifest-dup-key");
    assert.equal(hits.length, 1, `${label}: 应恰有 1 条 G-manifest-dup-key，实得 ${hits.length}`);
    assert.equal(hits[0].level, "ERROR");
    assert.equal(hits[0].expected, "unique top-level keys (1)");
    assert.match(hits[0].actual, /raw key occurrences 2/, `${label}: 采集器必须真数到 2 个键（防 0 条恒绿）`);
    assert.match(hits[0].actual, /1\.20\.1\/intro/, "须点名重复的键");
    // rc=1 唯一归因本腿
    const errs = payload.issues.filter((i) => i.level === "ERROR").map((i) => i.check);
    assert.deepEqual(errs, ["G-manifest-dup-key"], `${label}: 除本腿外不得有其他 ERROR，实得 ${JSON.stringify(errs)}`);
  }

  // ---- 反证「恒真于空」：采到 0 条 ⇒ COLLECTOR_RETURNED_ZERO + rc=1 ----
  writeText(manifest, "{}");
  const zero = spawnAudit(["--data-root=" + root, "--platform=forge"], SCRIPTS_DIR, root);
  assert.equal(zero.status, 1, `顶层 0 键（采集 0 条）必须 rc=1，实得 0 ⇒ 恒真于空未堵:\n${zero.stdout}`);
  const zpayload = JSON.parse(zero.stdout);
  const zhits = zpayload.issues.filter((i) => i.check === "G-manifest-collector-zero");
  assert.equal(zhits.length, 1, `应恰有 1 条采集器零腿，实得 ${zhits.length}`);
  assert.match(zhits[0].actual, /COLLECTOR_RETURNED_ZERO/);

  // ---- 不判对照：重复键在**嵌套层**（值对象内部）⇒ 顶层无重复 ⇒ 不得判红 ----
  writeText(manifest, '{\n  "1.20.1/intro": {\n    "file": "intro.md",\n    "file": "intro.md"\n  }\n}\n');
  const nested = spawnAudit(["--data-root=" + root, "--platform=forge"], SCRIPTS_DIR, root);
  const npayload = JSON.parse(nested.stdout);
  assert.ok(
    !npayload.issues.some((i) => i.check === "G-manifest-dup-key"),
    `嵌套层重复键不是顶层键，本腿不该判红（深度过滤失效）:\n${nested.stdout}`,
  );

  // ---- 字符串态自证：键里带转义引号 + 值里有嵌套对象 ⇒ 采集器仍数对顶层键 ----
  // （用 JSON.stringify 造夹具，别手写转义串：Git Bash / JS 双层转义会吃掉反斜杠，
  //   第 33 轮内联探针就因此把合法 JSON 打成了语法错误。）
  const escKey = 'a"b';
  const escBody = `{\n  ${JSON.stringify(escKey)}: { "file": "intro.md" },\n  "c": { "d": { "e": 1 } }\n}\n`;
  const escCensus = manifestKeyCensus(escBody);
  assert.equal(escCensus.parseError, null, `夹具必须是合法 JSON：${escCensus.parseError}`);
  assert.equal(escCensus.collectorZero, false, "带转义引号的键不得让扫描器掉进字符串态");
  assert.deepEqual(escCensus.occurrences.slice().sort(), [escKey, "c"].sort(), `转义键采集结果应恰为顶层两键，实得 ${JSON.stringify(escCensus.occurrences)}`);
  assert.equal(escCensus.dupKeys.length, 0);
  assert.equal(collectTopLevelJsonKeys(escBody).length, 2, "collectTopLevelJsonKeys 单独可投毒（与 census 同口径）");
  // 深度过滤对照：同一份正文把重复键放进**值对象**里 ⇒ 顶层无重复 ⇒ 采集器只报 1 个键
  const nestedBody = `{\n  "1.20.1/intro": {\n    "file": "intro.md",\n    "file": "intro.md"\n  }\n}\n`;
  assert.deepEqual(manifestKeyCensus(nestedBody).occurrences, ["1.20.1/intro"], "只许收深度 1 的键");
  assert.equal(manifestKeyCensus(nestedBody).dupKeys.length, 0);
  // 第二机制的真实收益：JSON 里 `"a\"b"` 与 `"a\u0022b"` 是**同一个键**，旧正则按原文比字面 ⇒ 漏判。
  // 采集器解完转义再比 ⇒ 这种等价重复必须红（同时 parserKeyCount=1 < 扫描 occurrence=2）。
  const equivBody = '{\n  "a\\"b": 1,\n  "a\\u0022b": 2\n}\n';
  const equiv = manifestKeyCensus(equivBody);
  assert.equal(equiv.parseError, null, `等价重复夹具必须合法 JSON：${equiv.parseError}`);
  assert.deepEqual(equiv.occurrences, [escKey, escKey], `解码后两个键必须同名，实得 ${JSON.stringify(equiv.occurrences)}`);
  assert.deepEqual(equiv.dupKeys, [escKey], "转义等价重复必须被抓到（旧按原文比字面的做法会放行）");
  writeText(manifest, equivBody);
  const equivRun = spawnAudit(["--data-root=" + root, "--platform=forge"], SCRIPTS_DIR, root);
  assert.equal(equivRun.status, 1, `转义等价重复键必须 rc=1:\n${equivRun.stdout}`);
  assert.ok(
    JSON.parse(equivRun.stdout).issues.some((i) => i.check === "G-manifest-dup-key"),
    "等价重复须由去重腿点名",
  );
}

// S17-T2（第 33 轮）：`scanned=0` 是红，不是「没东西可查 ⇒ 过」。
// 修前实测两条路径均 rc=0（`--data-root=<不存在>` / `--platform=forge --version=9.9.9`，
// payload `scanned:[]`），即消费方拿「过滤器拼错 / MC_SKILL_DATA 没指对」的空跑当「查过且干净」。
async function testScannedZeroIsRed() {
  const missing = spawnAudit(["--data-root=" + path.join(os.tmpdir(), "mc-audit-no-such-root-xyz")], SCRIPTS_DIR, process.cwd());
  assert.equal(missing.status, 1, `数据根不存在必须 rc=1，实得 0 ⇒ 空跑腿仍是假绿:\n${missing.stdout}`);
  const mp = JSON.parse(missing.stdout);
  assert.equal(mp.scanned.length, 0, "该例前提：scanned 必须为 0");
  assert.equal(mp.summary.ERROR, 1, `应恰 1 条 ERROR，实得 ${JSON.stringify(mp.summary)}`);
  assert.equal(mp.issues[0].check, "Z-scanned-zero");
  assert.match(mp.issues[0].actual, /COLLECTOR_RETURNED_ZERO/);

  const root = tmpRoot("zerotarget");
  buildCleanFixture(root);
  const badFilter = spawnAudit(["--data-root=" + root, "--platform=forge", "--version=9.9.9"], SCRIPTS_DIR, root);
  assert.equal(badFilter.status, 1, `过滤器无命中（本档没建档）必须 rc=1，实得 0:\n${badFilter.stdout}`);
  assert.equal(JSON.parse(badFilter.stdout).scanned.length, 0);
  // 对照：同一 data-root、命中真实的 forge_1.20.1 ⇒ 不得红（红腿只对空跑）
  const goodFilter = spawnAudit(["--data-root=" + root, "--platform=forge", "--version=1.20.1"], SCRIPTS_DIR, root);
  assert.equal(goodFilter.status, 0, `过滤器有命中且干净必须 rc=0:\n${goodFilter.stdout}`);
  assert.equal(JSON.parse(goodFilter.stdout).scanned.length, 1);
}

async function testEmptyFixture() {
  const root = tmpRoot("empty");
  buildEmptyFixture(root);
  const r = spawnAudit(["--data-root=" + root], SCRIPTS_DIR, root);
  // S17-T2（第 33 轮改判）：旧断言是「没有平台版本目录 ⇒ 无 issue ⇒ rc=0」，
  // 那正是本仓点名的假绿形状（空跑被消费方读成「查过且干净」）。现在 scanned=0 ⇒ 1 条
  // `Z-scanned-zero` ERROR ⇒ rc=1。完整形状（含「过滤器拼错」与「命中且干净 ⇒ 绿」对照）
  // 见 testScannedZeroIsRed。
  assert.equal(r.status, 1, `空 data root（scanned=0）必须 rc=1，实得 0:\n${r.stdout}`);
  const payload = JSON.parse(r.stdout);
  assert.equal(payload.scanned.length, 0);
  assert.equal(payload.summary.ERROR, 1);
  assert.equal(payload.issues[0].check, "Z-scanned-zero");
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
    assert.equal(/^(forge_|fabric_|neoforge_|liteloader_)/.test(e.platformPrefix), false, `forbidden prefix ${e.platformPrefix}`);
  }
  assert.equal(skipsRawProcessedSet("quilt_1.21.1", "quilt-docs"), true);
  assert.equal(skipsRawProcessedSet("liteloader_1.12.2", "liteloader-docs"), false);
  assert.equal(skipsRawProcessedSet("forge_1.20.1", "forge-docs"), false);
}

async function testQuiltProcessedOnlySkipsE() {
  const root = tmpRoot("quilt-e");
  const fx = processedOnlyFixture(root, "quilt_1.21.1", "quilt", "1.21.1", "quilt-docs");
  const issues = auditIndex(fx.root, fx.idx);
  assert.equal(issues.filter((i) => i.check === "E-raw-processed-set").length, 0, JSON.stringify(issues));
}

async function testLiteLoaderProcessedOnlyReportsE() {
  const root = tmpRoot("ll-e");
  const fx = processedOnlyFixture(root, "liteloader_1.12.2", "liteloader", "1.12.2", "liteloader-docs");
  const issues = auditIndex(fx.root, fx.idx);
  assert.ok(issues.some((i) => i.check === "E-raw-processed-set" && i.level === "ERROR"), JSON.stringify(issues));
}

async function testLiteLoaderRawProcessedStemParity() {
  const root = tmpRoot("ll-parity");
  const ver = "1.12.2";
  const docsRoot = path.join(root, "liteloader_1.12.2", "liteloader-docs", ver);
  writeText(path.join(docsRoot, "raw", "wiki_dev.txt"), "raw wiki\n");
  writeText(path.join(docsRoot, "processed", "wiki_dev.md"), "# wiki\n");
  writeJSON(path.join(docsRoot, "index-l0.json"), [
    { id: `${ver}/wiki_dev`, version: ver, label: "wiki_dev", processedFile: "processed/wiki_dev.md" },
  ]);
  const issues = auditIndex(root, { name: "liteloader_1.12.2", platform: "liteloader", version: ver });
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
  ["manifest dup-key leg: 4 indent shapes red / clean green / collector-zero red", testManifestDupKeyLeg],
  ["scanned=0 (missing data root / filter no-hit) is red, matched-clean still green", testScannedZeroIsRed],
  ["empty fixture (scanned=0) red with Z-scanned-zero", testEmptyFixture],
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
  ["liteloader processed-only reports E-raw-processed-set", testLiteLoaderProcessedOnlyReportsE],
  ["liteloader raw.txt vs processed.md stem parity", testLiteLoaderRawProcessedStemParity],
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
