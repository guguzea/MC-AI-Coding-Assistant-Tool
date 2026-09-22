#!/usr/bin/env node
/**
 * assert-bedrock-scriptapi-members — scriptapi 树的「成员条数」必须挂在可核对的计数源上
 * （用户裁定 2026-09-22 第④条：members 接线，并且要**找一个稳定计数源**）。
 *
 * 为什么单独一道门：`assert-corpus-semantics` 的判据⑦只从**语料自身**数成员（页内
 * `## Members（N）` 自报数 ⇄ `### \`x\`` 小节数），它抓得住截断与掉页，但它信的仍是生产者
 * 自己写的标题。本门把那个数接到**独立于渲染结果**的计数源上：生产者在树上留下的
 * `scriptapi-typed.json` —— 它自己解析 npm `@minecraft/server` 的 `index.d.ts` 得到的声明清单
 * （含 `members[]`、源文件 `sha256`/`bytes`/`version`），与渲染后的页面逐条对账。
 * 树上**不存** `index.d.ts` 原文（源文件头是 Microsoft 版权 + 禁止再分发），所以"稳定"来自
 * 这份清单与页面的双向一致性，不来自任何手抄的总数 ⇒ 换 d.ts 版本 ⇒ 两个产物一起动，门跟着走。
 *
 * 判据：
 *  ① 三方计数相等：`typed.decls` 条数 == `index-l0.json` 条目数 == `processed/scriptapi` 页面数。
 *  ② 连接合法：`name (kind)` 在 decls 内唯一（不唯一 ⇒ label 直连会认错页，先红并说明 join 失效）；
 *     每条 index label 必须形如 `<name> (<kind>) — <pkg>@<ver>`（碰撞改名条目另带 ` [碰撞改名并存]` 后缀）。
 *  ③ 逐页四口径相等：`decl.members.length` == 页 `## Members（N）` == 页内 `### \`x\`` 小节数
 *     == 页内 ``` `ts` 围栏块数 − 1（第一块是声明头）。任一不等 ⇒ 点名到页。
 *  ④ 每页 sha256 == index 条目里记录的 sha256（生产者算在**写入的那段 md** 上）⇒ 抓「改了正文
 *     没重跑生产者」与手改页；index 有 id 而页不在 / 页在而 index 无条目，也在这条里点名。
 *  ⑤ 来源留痕：`typed.sha256` 是 64 位十六进制、`typed.bytes ≥ 生产者的 MIN_SOURCE_BYTES`、
 *     `typed.version` 与**所有** label 里的 `@ver` 逐字相同（半档混进另一个模块版本必红）。
 *
 * 用法：
 *   node scripts/assert-bedrock-scriptapi-members.mjs             # 真跑
 *   node scripts/assert-bedrock-scriptapi-members.mjs --selftest   # 纯内存夹具（各失守必红 + 干净夹具必绿）
 *   MC_SKILL_DATA=<dir>                                            # 换数据根（投毒用）
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SCRIPTAPI_INDEX_L0, SCRIPTAPI_PROCESSED_DIR, isDirectRun, sha } from "./_lib/bedrock-corpus.mjs";
import { MIN_SOURCE_BYTES, PKG_NAME, TYPED_JSON } from "./fetch-bedrock-script-api.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");
const SELFTEST = process.argv.includes("--selftest");

const TREE = join(DATA_ROOT, "bedrock_stable", "bedrock-scriptapi", "stable");
const TYPED = TYPED_JSON.replace(join(REPO_ROOT, "data"), DATA_ROOT);
const INDEX_L0 = SCRIPTAPI_INDEX_L0.replace(join(REPO_ROOT, "data"), DATA_ROOT);
const PAGES = join(SCRIPTAPI_PROCESSED_DIR.replace(join(REPO_ROOT, "data"), DATA_ROOT), "scriptapi");

/** ③ 的口径提取器：只认生产者自己写的那三种形状，正文里别处出现的 `###` 不参与。 */
export function countPageMembers(text) {
  const declared = /(^|\n)##\s*Members（(\d+)）/.exec(text);
  return {
    declared: declared ? Number(declared[2]) : 0,
    h3: (text.match(/^### `[^`]+`$/gm) || []).length,
    fences: Math.max(0, (text.match(/^```ts$/gm) || []).length - 1),
  };
}

/** ① 三方计数（纯函数，便于投毒）。 */
export function checkCounts({ declN, indexN, pageN }) {
  const problems = [];
  if (!(declN === indexN && indexN === pageN)) {
    problems.push(`计数三方不等：typed.decls=${declN} index-l0=${indexN} 页面=${pageN}（掉页 / 索引没剪 / 清单与正文不同源）`);
  }
  return problems;
}

/** ② 连接合法性：decls 的 `name (kind)` 必须唯一，index label 必须可解析且连得上。 */
export function checkJoin(decls, index, pkg = PKG_NAME) {
  const problems = [];
  const byKey = new Map();
  const dup = [];
  for (const d of decls) {
    const k = `${d.name} (${d.kind})`;
    if (byKey.has(k)) dup.push(k);
    else byKey.set(k, d);
  }
  if (dup.length) {
    problems.push(`typed.decls 里 name (kind) 不唯一 ⇒ label 直连会认错页（${dup.length} 条，例 ${[...new Set(dup)].slice(0, 3).join(" | ")}）`);
  }
  let broken = 0;
  for (const e of index) {
    const m = new RegExp(`^\\s*(.*?)\\s*\\((\\w+)\\)\\s*—\\s*${pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}@([\\w.+-]+)`).exec(String(e.label ?? ""));
    if (!m) {
      if (broken++ < 5) problems.push(`index 条目 label 不合式（连不上任何声明）：${e.id} label=${JSON.stringify(e.label)}`);
      continue;
    }
    if (!byKey.has(`${m[1]} (${m[2]})`)) {
      if (broken++ < 5) problems.push(`index 条目 ${e.id} 的「${m[1]} (${m[2]})」在 typed.decls 里不存在`);
    }
  }
  return { problems, byKey, mixedVersions: index.map((e) => (/@([\w.+-]+)(?:\s|\[|$)/.exec(String(e.label ?? "")) ?? [])[1]).filter(Boolean) };
}

/** ③ 单页四口径（纯函数）。 */
export function checkPageMembers(decl, text, id) {
  const { declared, h3, fences } = countPageMembers(text);
  const n = (decl.members ?? []).length;
  if (n === declared && declared === h3 && h3 === fences) return [];
  return [`${id}: 声明成员=${n} 页自报=${declared} 成员小节=${h3} 签名块=${fences}（四口径须全等）`];
}

/** ⑤ 来源留痕（纯函数）。 */
export function checkProvenance(typed, versionInLabels, minBytes = MIN_SOURCE_BYTES) {
  const problems = [];
  if (!/^[0-9a-f]{64}$/.test(String(typed.sha256 ?? ""))) {
    problems.push(`typed.sha256 不是 64 位十六进制（源文件留痕不可核）：${JSON.stringify(typed.sha256)}`);
  }
  if (!(typeof typed.bytes === "number" && typed.bytes >= minBytes)) {
    problems.push(`typed.bytes=${JSON.stringify(typed.bytes)} < 生产者自设下限 ${minBytes} ⇒ 源文件像被截断`);
  }
  if (!typed.version) problems.push("typed.version 缺失（无法与 label 里的模块版本对齐）");
  const vs = [...new Set(versionInLabels.filter(Boolean))];
  if (vs.length > 1) problems.push(`index label 里出现多个模块版本 ${vs.join(" / ")}（半档混版本）`);
  if (vs.length === 1 && typed.version && vs[0] !== typed.version) {
    problems.push(`typed.version=${typed.version} 与 index label 里的 @${vs[0]} 不符（清单与索引不是同一次摄取）`);
  }
  if (!vs.length) problems.push("index label 里一个版本号都没有 ⇒ 版本一致性判据在空转");
  return problems;
}

function finish(problems, notes) {
  for (const n of notes) console.log(`  · ${n}`);
  if (problems.length) {
    for (const p of problems) console.log(`✗ ${p}`);
    console.log(`assert-bedrock-scriptapi-members: ${problems.length} 项不达标`);
    process.exitCode = 1;
    return;
  }
  console.log(`assert-bedrock-scriptapi-members(MEMB): 达标 —— 计数三方相等 + 逐页四口径相等 + 每页 sha 对账 + 来源留痕可核（稳定计数源 = scriptapi-typed.json）`);
}

function realRun() {
  const problems = [];
  const notes = [];
  for (const [what, p] of [["scriptapi-typed.json", TYPED], ["index-l0.json", INDEX_L0], ["processed/scriptapi", PAGES]]) {
    if (!existsSync(p)) return { problems: [`${what} 不存在：${p}（换错根 ≠ 零缺陷；门不做"缺档即绿"的兜底）`], notes };
  }
  const typed = JSON.parse(readFileSync(TYPED, "utf8"));
  const index = JSON.parse(readFileSync(INDEX_L0, "utf8"));
  const pageFiles = readdirSync(PAGES).filter((f) => f.endsWith(".md"));
  problems.push(...checkCounts({ declN: typed.decls.length, indexN: index.length, pageN: pageFiles.length }));

  const { problems: joinProblems, byKey, mixedVersions } = checkJoin(typed.decls, index);
  problems.push(...joinProblems);
  problems.push(...checkProvenance(typed, mixedVersions));

  let pageMiss = 0, shaBad = 0, memberDrift = 0, checked = 0;
  let sumDeclared = 0, sumMembers = 0;
  const ids = new Set(index.map((e) => e.id));
  const samples = [];
  for (const e of index) {
    const base = String(e.id).replace(/^stable\/scriptapi\//, "");
    const f = join(PAGES, `${base}.md`);
    if (!existsSync(f)) {
      pageMiss++;
      if (samples.length < 5) samples.push(`条目 ${e.id} 在盘上没有对应页面`);
      continue;
    }
    const text = readFileSync(f, "utf8");
    if (sha(text) !== e.sha256) {
      shaBad++;
      if (samples.length < 5) samples.push(`${e.id}: 页 sha ${sha(text).slice(0, 10)} ≠ index 记的 ${String(e.sha256).slice(0, 10)}（正文被改过而生产者没重跑）`);
    }
    const m = /^\s*(.*?)\s*\((\w+)\)\s*—/.exec(String(e.label ?? ""));
    const decl = m ? byKey.get(`${m[1]} (${m[2]})`) : null;
    if (!decl) continue;
    checked++;
    const c = countPageMembers(text);
    sumDeclared += c.declared;
    sumMembers += (decl.members ?? []).length;
    const bad = checkPageMembers(decl, text, e.id);
    if (bad.length) {
      memberDrift++;
      if (samples.length < 5) samples.push(bad[0]);
    }
  }
  const orphans = pageFiles.filter((f) => !ids.has(`stable/scriptapi/${f.replace(/\.md$/, "")}`));
  if (pageMiss) problems.push(`index 有条目而盘上无页：${pageMiss} 条`);
  if (shaBad) problems.push(`页 sha256 与 index 对不上：${shaBad} 页`);
  if (memberDrift) problems.push(`四口径不等的页：${memberDrift} 页`);
  if (orphans.length) problems.push(`盘上有页而 index 无条目：${orphans.length} 个（例 ${orphans.slice(0, 3).join(" · ")}）`);

  notes.push(
    `三方计数：decls ${typed.decls.length} / index ${index.length} / 页面 ${pageFiles.length}`,
    `Σ成员：typed 侧 ${sumMembers} / 页自报侧 ${sumDeclared}（差 ${sumMembers - sumDeclared}）· 逐页四口径核过 ${checked} 页`,
    `sha 对账：${index.length - shaBad}/${index.length} 页逐字节一致（sha 算在生产者写入的那段 md 上）`,
    `来源：npm ${typed.pkg}@${typed.version}（${typed.sourceKind}，${typed.bytes} B，源文件 sha256 ${String(typed.sha256).slice(0, 12)}…）`,
    `树根：${TREE}`,
  );
  if (problems.length) notes.push(...samples);
  return { problems, notes };
}

function selfTest() {
  const problems = [];
  const expect = (label, got, want) => {
    if (got !== want) problems.push(`${label}：期望 ${want}，实得 ${got}`);
  };
  const decl = (name, kind, n) => ({ name, kind, members: Array.from({ length: n }, (_, i) => ({ name: `m${i}`, signature: "m(): void;" })) });
  const page = (n) => `# X (class)\n\n\`\`\`ts\nexport class X {}\n\`\`\`\n\n## Members（${n}）\n\n` +
    Array.from({ length: n }, (_, i) => `### \`m${i}\`\n\`\`\`ts\nm(): void;\n\`\`\`\n`).join("\n");
  const entry = (name, kind, ver = "2.9.0") => ({ id: `stable/scriptapi/${name}`, label: `${name} (${kind}) — @minecraft/server@${ver}`, sha256: "x".repeat(64) });

  expect("① 三方相等 ⇒ 绿", checkCounts({ declN: 3, indexN: 3, pageN: 3 }).length, 0);
  expect("① 页面掉一条 ⇒ 红", checkCounts({ declN: 3, indexN: 3, pageN: 2 }).length > 0, true);
  expect("② label 连不上 ⇒ 红", checkJoin([decl("A", "class", 1)], [{ id: "stable/scriptapi/Z", label: "Z (mystery) — @minecraft/server@2.9.0" }]).problems.length > 0, true);
  expect("② name (kind) 重复 ⇒ 红（join 会认错页）", checkJoin([decl("A", "class", 1), decl("A", "class", 2)], [entry("A", "class")]).problems.length > 0, true);
  expect("② 干净连接 ⇒ 绿", checkJoin([decl("A", "class", 1)], [entry("A", "class")]).problems.length, 0);
  expect("③ 四口径全等 ⇒ 绿", checkPageMembers(decl("A", "class", 4), page(4), "a").length, 0);
  expect("③ 正文少一个成员小节（截断）⇒ 红", checkPageMembers(decl("A", "class", 4), page(4).replace("### `m3`", "### m3"), "a").length > 0, true);
  expect("③ 页自报数被手改大 ⇒ 红", checkPageMembers(decl("A", "class", 4), page(4).replace("## Members（4）", "## Members（9）"), "a").length > 0, true);
  expect("③ 0 成员声明（无 Members 段）⇒ 绿", checkPageMembers(decl("A", "class", 0), "# A (class)\n\n```ts\nexport class A {}\n```\n", "a").length, 0);
  expect("⑤ 版本混档 ⇒ 红", checkProvenance({ sha256: "a".repeat(64), bytes: 760885, version: "2.9.0" }, ["2.9.0", "2.10.0"]).length > 0, true);
  expect("⑤ 源文件被截短 ⇒ 红", checkProvenance({ sha256: "a".repeat(64), bytes: 1200, version: "2.9.0" }, ["2.9.0"]).length > 0, true);
  expect("⑤ sha 不是 64 hex ⇒ 红", checkProvenance({ sha256: "deadbeef", bytes: 760885, version: "2.9.0" }, ["2.9.0"]).length > 0, true);
  expect("⑤ label 里没版本号（判据空转）⇒ 红", checkProvenance({ sha256: "a".repeat(64), bytes: 760885, version: "2.9.0" }, []).length > 0, true);
  expect("⑤ 清单与 label 版本不符 ⇒ 红", checkProvenance({ sha256: "a".repeat(64), bytes: 760885, version: "2.9.0" }, ["2.8.0"]).length > 0, true);
  expect("⑤ 干净 ⇒ 绿", checkProvenance({ sha256: "a".repeat(64), bytes: 760885, version: "2.9.0" }, ["2.9.0"]).length, 0);
  expect("④ sha 口径：改一个字符必须改变摘要（否则第④条是装饰）", sha(page(2)) === sha(page(2) + "x") ? "eq" : "ne", "ne");
  if (problems.length) {
    for (const p of problems) console.log(`✗ ${p}`);
    console.log(`assert-bedrock-scriptapi-members(selftest): ${problems.length} 例不符`);
    process.exitCode = 1;
  } else {
    console.log("assert-bedrock-scriptapi-members(selftest): OK（17 例夹具：计数 2 / 连接 3 / 四口径 4 / 来源留痕 5 / sha 1 / 其余正对照全绿）");
  }
}

if (SELFTEST) {
  selfTest();
} else if (isDirectRun(import.meta.url)) {
  const { problems, notes } = realRun();
  finish(problems, notes);
} else {
  // 被 import（例如 --selftest 之外的引用）时不自动跑：本文件顶层不做磁盘动作。
}
