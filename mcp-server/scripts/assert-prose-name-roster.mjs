#!/usr/bin/env node
/**
 * Gate：技能/规则**散文里的类名清单**必须落在真构件名册里 —— 补 `assert-skill-yarn-attest.mjs`
 * 「只看围栏内」的盲区。
 *
 * 为什么：`assert-skill-yarn-attest.mjs` 的判面是 `scope: "fence"`（围栏外一行不判，见其
 * `:285` / `:660` 自述）。而 agent 最会照抄的那一行常在**围栏外**——`mc-item/SKILL.md:15` 的
 * 名字清单就是散文行，且该件 frontmatter 写着「类名只来自本档核实表」。F18
 * （`CompostableItemRegistry`，真名 `CompostingChanceRegistry`）因此全绿。
 *
 * 判据（只查登记档）：
 *   扫 `.cursor/**` + `knowledge/**`（**先剥掉围栏块**，围栏由上面那道门管），找形如
 *   `<Name>Registry` / `<Name>RegistryEvents` 的 token；若该名**既不在**本档 FAPI 真构件名册
 *   （`mcp-server/data/loader-api-summaries/<v>-fabric-api.json` 的 `simpleName`）**也不在**
 *   本档 vanilla 映射（`yarn-mappings.sqlite` 的 `classes.named` 末段），即判违规。
 *   —— 两道名册同时缺席才算「查无此名」，vanilla 的 `SimpleRegistry` / `DefaultedRegistry`
 *   因在后一道里而在场，不会被误判。
 *
 * 棘轮：版本面当前未修 ⇒ 违规收进基线（`scripts/data/prose-name-roster-baseline.json`），
 * 判据 = 现值必须是基线的子集（新增即红）；基线条目消失 = 陈旧，只提示不红。
 *
 * 用法：
 *   node scripts/assert-prose-name-roster.mjs
 *   node scripts/assert-prose-name-roster.mjs --measure
 *   node scripts/assert-prose-name-roster.mjs --selftest
 *   MC_SKILL_PROSE_ROSTER_TEST_ROOT=<假根>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const TEST_ROOT = process.env.MC_SKILL_PROSE_ROSTER_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const BASELINE = path.join(HERE, "data", "prose-name-roster-baseline.json");
const TOKEN_RX = /\b([A-Z][A-Za-z0-9]*Registry(?:Events)?)\b/g;

/** 剥掉围栏块（```…``` / ~~~…~~~）—— 围栏面归 assert-skill-yarn-attest 管。 */
export function stripFences(text) {
  return text.replace(/^[ \t]*(```|~~~)[^\n]*\n[\s\S]*?^[ \t]*\1[^\n]*$/gm, "");
}

/**
 * 只收「名字清单」形态的散文行：顿号串（`A、B、C。`）、表格行（`| A | … |`）、列表项（`- A…`）。
 * 目的是只判「agent 会照抄的名字清单」，不把规则正文的散句/负例/移植对照表拉进判面。
 */
export function listLikeLines(text) {
  return stripFences(text)
    .split(/\r?\n/)
    .filter((l) => l.includes("、") || /^\s*\|/.test(l) || /^\s*[-*]\s/.test(l));
}

/** 纯函数：给定清单行 + 「本档是否有这个类」判定，产出违规名单。 */
export function findRosterViolations(label, text, known) {
  const out = [];
  for (const line of listLikeLines(text)) {
    for (const m of line.matchAll(TOKEN_RX)) {
      if (!known(m[1])) out.push({ key: `${label}|${m[1]}`, name: m[1] });
    }
  }
  return out;
}

function listPacks() {
  const dir = path.join(ROOT, "mcp-server", "data", "loader-api-summaries");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^(.+)-fabric-api\.json$/.test(f))
    .map((f) => f.replace(/-fabric-api\.json$/, ""))
    .filter((v) => fs.existsSync(path.join(ROOT, "data", `fabric_${v}`, "mappings", "yarn-mappings.sqlite")))
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
  // F18 的落点面：技能源稿（名字清单）与 knowledge/common（核实表）。
  walk(path.join(base, ".cursor", "skills"), (n) => n.endsWith(".md"));
  walk(path.join(base, "knowledge", "common"), (n) => n.endsWith(".md"));
  return out.sort();
}

function rosterOf(version) {
  const f = path.join(ROOT, "mcp-server", "data", "loader-api-summaries", `${version}-fabric-api.json`);
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  return new Set((j.classes ?? []).map((c) => c.simpleName).filter(Boolean));
}

function run() {
  const packs = listPacks();
  const current = new Set();
  const scanned = { files: 0, tokens: 0 };
  for (const version of packs) {
    let roster;
    try {
      roster = rosterOf(version);
    } catch {
      continue;
    }
    let db;
    try {
      db = new DatabaseSync(path.join(ROOT, "data", `fabric_${version}`, "mappings", "yarn-mappings.sqlite"), { readOnly: true });
    } catch {
      continue;
    }
    const known = (name) => {
      if (roster.has(name)) return true;
      const r = db.prepare("SELECT 1 FROM classes WHERE named=? OR named LIKE ? LIMIT 1").get(
        `net/minecraft/registry/${name}`,
        `%/${name}`,
      );
      return Boolean(r);
    };
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
        scanned.tokens += listLikeLines(text).join("\n").match(TOKEN_RX)?.length ?? 0;
        for (const v of findRosterViolations(`fabric/${version}|${rel}`, text, known)) current.add(v.key);
      }
    } finally {
      db.close();
    }
  }

  const blRaw = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : { keys: [] };
  const baseline = new Set(blRaw.keys ?? []);
  const fileFloor = Number.isFinite(blRaw.fileFloor) ? blRaw.fileFloor : 20;
  const tokenFloor = Number.isFinite(blRaw.tokenFloor) ? blRaw.tokenFloor : 50;
  const failures = [];
  if (scanned.files < fileFloor) failures.push(`扫描面塌零：只扫到 ${scanned.files} 件（地板 ${fileFloor}）—— 采集器空转不得判绿`);
  if (scanned.tokens < tokenFloor) failures.push(`名册 token 塌零：只采到 ${scanned.tokens} 个（地板 ${tokenFloor}）—— 采集器空转不得判绿`);
  const added = [...current].filter((k) => !baseline.has(k)).sort();
  for (const k of added) failures.push(`新增违规（不在基线）：${k}`);
  const stale = [...baseline].filter((k) => !current.has(k));

  if (process.argv.includes("--measure")) {
    console.log(JSON.stringify({ keys: [...current].sort() }, null, 2));
    return;
  }
  if (failures.length) {
    console.error(`assert-prose-name-roster: ${failures.length} 项不通过`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log(
    `  assert-prose-name-roster: ok（扫 ${scanned.files} 件 / 名册 token ${scanned.tokens} · 违规 ${current.size}（基线 ${baseline.size}，新增 0，陈旧 ${stale.length}））`,
  );
}

function selftest() {
  const fail = [];
  // ① 围栏块必须被剥掉（围栏面归另一道门）
  const fenced = "```java\nnew CompostableItemRegistry();\n```\n";
  if (findRosterViolations("l", fenced, () => false).length !== 0) fail.push("① 围栏内 token 不得进本门判面");
  // ② 散文 token 不在任何名册 ⇒ 违规（F18 形态）
  const prose = "Item.Properties、ItemGroupEvents.modifyEntriesEvent、FuelRegistryEvents.BUILD、CompostableItemRegistry。\n";
  const got = findRosterViolations("l", prose, (n) => n === "FuelRegistryEvents");
  if (got.length !== 1 || got[0].name !== "CompostableItemRegistry") fail.push(`② 散文错名应判 1 条，实得 ${JSON.stringify(got)}`);
  // ③ 两道名册任一在场即不判（vanilla SimpleRegistry 不该被误判）；非清单行不进判面
  if (findRosterViolations("l", "- 用 SimpleRegistry。\n", (n) => n === "SimpleRegistry").length !== 0) fail.push("③ 命中名册不得违规");
  if (findRosterViolations("l", "正文里提到 CompostableItemRegistry 但这不是清单行。\n", () => false).length !== 0) fail.push("③b 非清单行不得进判面");
  // ④ 真库活性腿：1.21.10 上 CompostingChanceRegistry 在 FAPI 名册、CompostableItemRegistry 不在
  const vers = listPacks();
  const v = vers.includes("1.21.10") ? "1.21.10" : vers[0];
  if (!v) fail.push("④ 无名册档可做活性腿");
  else {
    const roster = rosterOf(v);
    if (!roster.has("CompostingChanceRegistry")) fail.push(`④ ${v} FAPI 名册应有 CompostingChanceRegistry`);
    if (roster.has("CompostableItemRegistry")) fail.push(`④ ${v} FAPI 名册不应有 CompostableItemRegistry`);
  }
  if (fail.length) {
    console.error(`assert-prose-name-roster --selftest: ${fail.length} 项不通过`);
    for (const f of fail) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log(`  assert-prose-name-roster --selftest: ok（4 组夹具 + 真名册活性腿 @ ${v}）`);
}

if (process.argv.includes("--selftest")) selftest();
else run();
