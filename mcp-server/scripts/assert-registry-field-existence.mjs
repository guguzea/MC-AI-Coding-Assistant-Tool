#!/usr/bin/env node
/**
 * Gate：注册表「字段级存在性」——补 `assert-rules-api-names.mjs` 只判类名的盲区。
 *
 * 为什么：`assert-rules-api-names.mjs` 的红腿谓词是**类名级**（真值源 = intermediary 锚 →
 * 等价类给出「本档该类该叫什么」）。`Registries` 这个**类**在 1.21.1 / 1.21.3 / 1.21.11
 * 都存在 ⇒ 类名级判绿；而 `Registries.ENCHANTMENT` 这个**字段**自 1.21.1 起已不在
 * `Registries` 上（改挂在 `RegistryKeys`）⇒ 24 处错字段全绿。本条补字段级腿。
 *
 * 判据（只查登记档的可扫描面）：
 *   对围栏内出现的 `Registries.<MEMBER>` / `RegistryKeys.<MEMBER>`（MEMBER 为 UPPER_SNAKE），
 *   按该档 `data/fabric_<v>/mappings/yarn-mappings.sqlite` 查该 member 是否落在 class 上
 *   （`fields.owner_named` 或 `methods.owner_named` + `name_named`）；不在即违规。
 *   若 class=Registries 而 member 落在 RegistryKeys 上，点名正解「应写 RegistryKeys.<MEMBER>」。
 *
 * 棘轮：版本面当前未修 ⇒ 违规收进基线（`scripts/data/registry-field-baseline.json`），
 * 判据 = 现值必须是基线的子集（新增即红）；基线条目消失 = 陈旧，只提示不红（只许降）。
 *
 * 用法：
 *   node scripts/assert-registry-field-existence.mjs
 *   node scripts/assert-registry-field-existence.mjs --measure   # 打印可粘贴的基线 JSON
 *   node scripts/assert-registry-field-existence.mjs --selftest  # 纯函数夹具 + 真库活性腿
 *   MC_SKILL_REGISTRY_FIELD_TEST_ROOT=<假根>  # 换根（缺件会红）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const TEST_ROOT = process.env.MC_SKILL_REGISTRY_FIELD_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const BASELINE = path.join(HERE, "data", "registry-field-baseline.json");
const CLASSES = ["Registries", "RegistryKeys"];
const MEMBER_RX = new RegExp(`\\b(${CLASSES.join("|")})\\.([A-Z][A-Z0-9_]+)\\b`, "g");
const FILE_FLOOR = 20; // 扫描面地板：低于此数说明主面上没有可扫文件 ⇒ 红

/** 收集 <text, label> 对（label 进违规键；不含行号，避免行漂断棘轮）。 */
export function collectPairs(text) {
  const out = [];
  for (const m of text.matchAll(MEMBER_RX)) out.push({ cls: m[1], member: m[2] });
  return out;
}

/**
 * 纯函数：给定「(cls,member) → 该 member 落在哪些类上」与「member 在该档是否存在」两个解析器，
 * 产出违规。**只在 member 于本档确实存在、但 owner 不是该 class 时判违规**（F19/F13 形态：
 * 真字段挂错类）——纯占位（如 `Registries.XXX`）在本档任何类上都查无，按设计不判违规，
 * 否则会把示意用假名灌进基线。
 */
export function findViolations(entries, resolve) {
  const out = [];
  for (const e of entries) {
    const owners = resolve.ownersOf(e.cls, e.member);
    if (owners.includes(e.cls)) continue;
    if (!resolve.memberKnown(e.member)) continue; // 本档查无此成员名 ⇒ 占位/示意，不判
    const hint = e.cls === "Registries" && owners.includes("RegistryKeys") ? `（本档应写 RegistryKeys.${e.member}）` : "";
    out.push({ key: e.key, cls: e.cls, member: e.member, hint });
  }
  return out;
}

function simpleOf(cls) {
  return cls.startsWith("net/minecraft/") ? cls.slice(cls.lastIndexOf("/") + 1) : cls;
}

/** 扫 packs：有 yarn-mappings.sqlite 的 fabric 档。 */
function listPacks() {
  const dataDir = path.join(ROOT, "data");
  if (!fs.existsSync(dataDir)) return [];
  return fs
    .readdirSync(dataDir)
    .filter((d) => /^fabric_/.test(d) && fs.existsSync(path.join(dataDir, d, "mappings", "yarn-mappings.sqlite")))
    .map((d) => d.replace(/^fabric_/, ""))
    .sort();
}

function listFiles(version) {
  const base = path.join(ROOT, "fabric", version);
  const out = [];
  const walk = (dir, filter) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, filter);
      else if (filter(e.name)) out.push(p);
    }
  };
  walk(path.join(base, ".cursor"), (n) => n.endsWith(".md") || n.endsWith(".mdc"));
  walk(path.join(base, "knowledge"), (n) => n.endsWith(".md"));
  return out.sort();
}

function openDb(version) {
  try {
    return new DatabaseSync(path.join(ROOT, "data", `fabric_${version}`, "mappings", "yarn-mappings.sqlite"), {
      readOnly: true,
    });
  } catch {
    return null;
  }
}

function fqcnOf(db, simple) {
  const r = db
    .prepare("SELECT named FROM classes WHERE named = ? OR named LIKE ? LIMIT 4")
    .all(`net/minecraft/registry/${simple}`, `%/${simple}`);
  return r.map((x) => x.named);
}

function ownersOf(db, cls, member) {
  const owners = [];
  for (const fq of fqcnOf(db, cls)) {
    const f = db.prepare("SELECT owner_named FROM fields WHERE owner_named=? AND name_named=? LIMIT 1").get(fq, member);
    const m = db.prepare("SELECT owner_named FROM methods WHERE owner_named=? AND name_named=? LIMIT 1").get(fq, member);
    if (f || m) owners.push(simpleOf(fq));
  }
  return owners;
}

/** member 名在该档任何类上是否存在（用于排除示意占位名）。 */
function memberKnown(db, member) {
  const f = db.prepare("SELECT 1 FROM fields WHERE name_named=? LIMIT 1").get(member);
  const m = db.prepare("SELECT 1 FROM methods WHERE name_named=? LIMIT 1").get(member);
  return Boolean(f || m);
}

function run() {
  const packs = listPacks();
  const current = new Set();
  const scanned = { files: 0, pairs: 0 };
  for (const version of packs) {
    const db = openDb(version);
    if (!db) continue;
    try {
      for (const file of listFiles(version)) {
        scanned.files++;
        let text;
        try {
          text = fs.readFileSync(file, "utf8");
        } catch {
          continue;
        }
        const rel = path.relative(ROOT, file).replace(/\\/g, "/");
        const entries = collectPairs(text).map((p) => ({
          key: `fabric/${version}|${rel}|${p.cls}.${p.member}`,
          cls: p.cls,
          member: p.member,
        }));
        scanned.pairs += entries.length;
        const resolve = { ownersOf: (cls, member) => ownersOf(db, cls, member), memberKnown: (member) => memberKnown(db, member) };
        for (const v of findViolations(entries, resolve)) current.add(v.key);
      }
    } finally {
      db.close();
    }
  }

  const blRaw = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : { keys: [] };
  const baseline = new Set(blRaw.keys ?? []);
  const fileFloor = Number.isFinite(blRaw.fileFloor) ? blRaw.fileFloor : FILE_FLOOR;
  const failures = [];
  const floorViolations = [];
  if (scanned.files < fileFloor) {
    floorViolations.push(`扫描面塌零：只扫到 ${scanned.files} 件（地板 ${fileFloor}）—— 采集器空转不得判绿`);
  }
  const added = [...current].filter((k) => !baseline.has(k)).sort();
  for (const k of added) failures.push(`新增违规（不在基线）：${k}`);
  const stale = [...baseline].filter((k) => !current.has(k));
  if (floorViolations.length) failures.push(...floorViolations);

  if (process.argv.includes("--measure")) {
    console.log(JSON.stringify({ keys: [...current].sort() }, null, 2));
    return;
  }
  if (failures.length) {
    console.error(`assert-registry-field-existence: ${failures.length} 项不通过`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log(
    `  assert-registry-field-existence: ok（扫 ${scanned.files} 件 / ${scanned.pairs} 处强类型位 · 违规 ${current.size}（基线 ${baseline.size}，新增 0，陈旧 ${stale.length}））`,
  );
}

function selftest() {
  const fail = [];
  // ① 纯函数：member 真存在但 owner 不对 ⇒ 违规并点名正解
  const mk = (cls, member) => ({ key: `k|${cls}.${member}`, cls, member });
  const r1 = findViolations([mk("Registries", "ENCHANTMENT")], {
    ownersOf: (c, m) => (c === "Registries" && m === "ENCHANTMENT" ? ["RegistryKeys"] : ["Registries"]),
    memberKnown: () => true,
  });
  if (r1.length !== 1 || !/RegistryKeys\.ENCHANTMENT/.test(r1[0].hint)) fail.push("① 应判违规并点名正解");
  const r2 = findViolations([mk("Registries", "BLOCK")], { ownersOf: () => ["Registries"], memberKnown: () => true });
  if (r2.length !== 0) fail.push("② 命中名册不得违规");
  // ②b 本档任何类都查无该成员名（如示意占位 Registries.XXX）⇒ 不判
  const r2b = findViolations([mk("Registries", "XXX")], { ownersOf: () => [], memberKnown: () => false });
  if (r2b.length !== 0) fail.push("②b 示意占位不得判违规");
  // ③ 采集：成员名必须是 UPPER_SNAKE（不吃方法调用）
  const p = collectPairs("x Registries.ITEM_GROUP y Registries.getItem(z) RegistryKeys.ENCHANTMENT w");
  if (p.length !== 2) fail.push(`③ 采集应得 2 条，实得 ${p.length}`);
  // ④ 真库活性腿：1.21.10 的 Registries 上无 ENCHANTMENT，RegistryKeys 上有
  const vers = listPacks().filter((v) => fs.existsSync(path.join(ROOT, "data", `fabric_${v}`, "mappings", "yarn-mappings.sqlite")));
  const v = vers.includes("1.21.10") ? "1.21.10" : vers[0];
  if (!v) {
    fail.push("④ 无 yarn 库档可做活性腿");
  } else {
    const db = openDb(v);
    if (!db) fail.push(`④ 打不开 fabric_${v} 的 yarn 库`);
    else {
      try {
        const oReg = ownersOf(db, "Registries", "ENCHANTMENT");
        const oKeys = ownersOf(db, "RegistryKeys", "ENCHANTMENT");
        if (oReg.includes("Registries")) fail.push(`④ ${v} Registries 上竟有 ENCHANTMENT（判据器可疑）`);
        if (!oKeys.includes("RegistryKeys")) fail.push(`④ ${v} RegistryKeys 上应有 ENCHANTMENT（判据器可疑）`);
      } finally {
        db.close();
      }
    }
  }
  if (fail.length) {
    console.error(`assert-registry-field-existence --selftest: ${fail.length} 项不通过`);
    for (const f of fail) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log(`  assert-registry-field-existence --selftest: ok（4 组夹具 + 真库活性腿 @ ${v}）`);
}

if (process.argv.includes("--selftest")) selftest();
else run();
