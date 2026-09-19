#!/usr/bin/env node
/**
 * assert-rule-internal-refs.mjs — 规则文件「见本文件「X」」内引文必须能在本文件定位的门（2026-09-19 W5-1 落地）。
 *
 * 立门缘由（W5-1 实测缺陷）：7 档 quilt 01-registry / 05-events 的 :3 横幅写
 * 「（maven 只到 alpha，见本文件「maven 实证」段）」，但 13/14 处被指小节在本文件**不存在**
 * （唯一有落点的 quilt/1.21.1 01-registry:9 是粗体块而非标题）——W5-1 已把这 14 处引用句改为
 * 指向 `quilt/<ver>/AGENTS.md` 顶部横幅；本门防止该形态复活或以新小节名再犯。
 *
 * 引文形态（survey 2026-09-19 全仓 .cursor/rules/*.mdc 621 份实测：仅两种形态、15 处命中）：
 *   A. `见本文件「X」`（含链式 `见本文件「A」与「B」两节` —— A、B 都必须可定位）；
 *   B. `（见「X」`（括注式）。
 * 定位口径（宽严按此实现，门头写明）：X 必须能在**同一文件**里以下列任一形态出现（围栏 ```/~~~
 * 内的行不算锚点也不算引文）——
 *   - 标题：`^#{1,6}\s` 行、# 后文本包含 X（子串）；
 *   - 粗体块：`**…X…**` 粗体片段包含 X（子串）——覆盖 1.21.1:9「maven 实证（截至 2026-09-04）」这类存量。
 * 豁免台账 KNOWN（{rel, target} 精确匹配）：本 sweep 收口时为空（仅存的 fabric/1.19.4 链式引用
 * 两处落点都在：00-project-setup.mdc:103/:166）。后续若出现暂不修复的存量，登记这里并在 reason 写明。
 *
 * 用法
 *   node scripts/assert-rule-internal-refs.mjs
 *   node scripts/assert-rule-internal-refs.mjs --selftest   # 纯内存投毒（7 例 + 真实输入正对照）
 *
 * 盲区（写明，不假装覆盖）：只扫 8 平台档树 `.cursor/rules/*.mdc` 源稿；.cursor/skills、
 * AGENTS.md、镜像宿主（.claude/.continue/.trae/.opencode/.agents/.zcode/.pi）不在本门——
 * 镜像由 assert-skill-mirrors 保证与源稿一致，源稿绿 ⇒ 镜像同态；跨文件引用（「见 quilt/…」）
 * 不在本门（那是另一形态，且本 sweep 未发现死例）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");

export const SCAN_ROOTS = ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"];
/** 豁免台账（sweep92 收口时为空；登记格式：{ rel: "quilt/1.20.4/.cursor/rules/01-registry.mdc", target: "…", reason: "…" }） */
export const KNOWN = [];
const FENCE_RE = /^\s*(```|~~~)/;

/** 收集引文（围栏外）：返回 [{line, target, form}] */
export function extractRefs(text) {
  const refs = [];
  let fence = false;
  text.split(/\r?\n/).forEach((line, idx) => {
    if (FENCE_RE.test(line)) { fence = !fence; return; }
    if (fence) return;
    for (const m of line.matchAll(/见本文件\s*((?:「[^」]+」(?:\s*(?:与|和|及|、)\s*)?)+)/g)) {
      for (const t of m[1].matchAll(/「([^」]+)」/g)) refs.push({ line: idx + 1, target: t[1], form: "见本文件「…」" });
    }
    for (const m of line.matchAll(/（\s*见\s*「([^」]+)」/g)) refs.push({ line: idx + 1, target: m[1], form: "（见「…」）" });
  });
  return refs;
}

/** 收集锚点（围栏外）：标题文本 + 粗体片段 */
export function extractAnchors(text) {
  const headings = [];
  const bolds = [];
  let fence = false;
  text.split(/\r?\n/).forEach((line) => {
    if (FENCE_RE.test(line)) { fence = !fence; return; }
    if (fence) return;
    const hm = line.match(/^#{1,6}\s+(.*)$/);
    if (hm) headings.push(hm[1]);
    for (const m of line.matchAll(/\*\*([^*\n]+)\*\*/g)) bolds.push(m[1]);
  });
  return { headings, bolds };
}

export function resolveTarget(anchors, target) {
  if (anchors.headings.some((h) => h.includes(target))) return "heading";
  if (anchors.bolds.some((b) => b.includes(target))) return "bold";
  return null;
}

/** 单文件检查：返回问题列表（空 = 绿）。known 覆盖默认台账（selftest 注入用）。 */
export function checkRuleText(rel, text, known = KNOWN) {
  const problems = [];
  const anchors = extractAnchors(text);
  for (const ref of extractRefs(text)) {
    if (known.some((k) => k.rel === rel && k.target === ref.target)) continue;
    const where = resolveTarget(anchors, ref.target);
    if (!where) {
      problems.push(`${rel}:${ref.line}: 引文「${ref.target}」（${ref.form}）在本文件无标题/粗体块落点 —— 死引用；改指真实锚点（如同档 AGENTS.md 横幅）或补真小节，或登记 KNOWN 台账`);
    }
  }
  return problems;
}

export function collectRuleFiles(io) {
  if (io && io.files) return io.files;
  const out = [];
  const walkRules = (dir, relBase) => {
    let ents;
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walkRules(p, `${relBase}/${e.name}`);
      else if (e.name.endsWith(".mdc")) out.push({ rel: relBase + "/" + e.name, abs: p });
    }
  };
  for (const base of SCAN_ROOTS) {
    const absBase = path.join(ROOT, base);
    if (!fs.existsSync(absBase)) continue;
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        if (e.name === ".cursor") {
          const rulesDir = path.join(dir, e.name, "rules");
          if (fs.existsSync(rulesDir)) walkRules(rulesDir, path.relative(ROOT, rulesDir).replaceAll("\\", "/"));
        } else {
          walk(path.join(dir, e.name));
        }
      }
    };
    walk(absBase);
  }
  return out.sort((a, b) => (a.rel < b.rel ? -1 : 1));
}

export function runAll(files) {
  const problems = [];
  for (const f of files) problems.push(...checkRuleText(f.rel, fs.readFileSync(f.abs, "utf8")));
  return { problems, count: files.length };
}

// ── --selftest：纯内存投毒（不碰仓库文件）───────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  const cases = [
    ["① 标题死引用（W5-1 形态）", () => checkRuleText("t/01-x.mdc", "# 01\n\n> 见本文件「maven 实证」段。\n\n## 核心事实\n")],
    ["② 链式引用一死一活", () => checkRuleText("t/00-x.mdc", "见本文件「A 节」与「鬼节」两节\n\n## A 节\n")],
    ["③ 括注式死引用（（见「X」））", () => checkRuleText("t/02-x.mdc", "先做准备（见「不存在的准备节」）。\n")],
    ["④ 粗体块不算救（目标只是普通正文词，非粗体/标题）", () => checkRuleText("t/03-x.mdc", "见本文件「maven 实证」段。\n\n- maven 实证：只有 alpha（无粗体包裹）\n")],
    ["正例C：围栏内引文形态不报警（extractRefs 围栏感知，必须绿）", () => {
      const refs = extractRefs("```\n见本文件「不存在」段\n```\n");
      return refs.length === 0 ? [] : [`围栏内引文被当成引文抽取：${refs.length} 处`];
    }],
    ["⑥ 默认 KNOWN 台账为空：未登记的死引用仍必须红", () => checkRuleText("t/05-x.mdc", "见本文件「暂存缺陷」段。\n")],
    ["⑦ 端到端投毒：真实仓库文件文本追加死引用必须检出", () => {
      const files = collectRuleFiles();
      const first = files[0];
      const saved = fs.readFileSync(first.abs, "utf8");
      return checkRuleText(`POISONED:${first.rel}`, saved + "\n见本文件「audit-20260918-ghost-section」段。\n");
    }],
    ["正例A：链式双活（fabric/1.19.4 形态）必须绿", () => checkRuleText("t/00-ok.mdc", "见本文件「A 节」与「B 节」两节\n\n## A 节\n\n## B 节\n")],
    ["正例B：粗体块落点（quilt 1.21.1:9 存量形态）必须绿", () => checkRuleText("t/01-ok.mdc", "见本文件「maven 实证」段。\n\n- **maven 实证（截至 2026-09-04）：零可用正式版构件**——背景\n")],
  ];
  let missed = 0;
  for (const [name, fn] of cases) {
    if (name.startsWith("正例")) {
      const got = fn();
      if (got.length !== 0) { missed++; console.error(`  ✗ selftest「${name}」应绿实红：${got[0]}`); }
      continue;
    }
    const got = fn();
    if (got.length === 0) { missed++; console.error(`  ✗ selftest「${name}」应红实绿`); }
  }
  // KNOWN 豁免正例（显式传入台账后必须绿）
  const knownOk = checkRuleText("t/06-x.mdc", "见本文件「暂存缺陷」段。\n", [{ rel: "t/06-x.mdc", target: "暂存缺陷", reason: "selftest" }]);
  if (knownOk.length !== 0) { missed++; console.error("  ✗ selftest「KNOWN 豁免显式传入」应绿实红"); }
  // 正对照：真实输入必须 0 问题（防「一律红」式假判别力）
  const real = runAll(collectRuleFiles());
  if (real.problems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实仓库本应绿，实得 ${real.problems.length} 项：`);
    for (const p of real.problems.slice(0, 8)) console.error(`      ${p}`);
  }
  console.log(
    `\nassert-rule-internal-refs(selftest): ${
      missed === 0 ? `OK（7 类畸形全检出 + 2 内存正例 + KNOWN 豁免 + 真实输入正对照绿：${real.count} 份 .cursor/rules/*.mdc）` : `${missed} 例不符`
    }`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const { problems, count } = runAll(collectRuleFiles());
if (problems.length) {
  console.error(`assert-rule-internal-refs: RED（${problems.length} 条）`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`assert-rule-internal-refs: ok（${count} 份 .cursor/rules/*.mdc：见本文件「X」/（见「X」）引文全部可在本文件定位；KNOWN 豁免 ${KNOWN.length} 条）`);
