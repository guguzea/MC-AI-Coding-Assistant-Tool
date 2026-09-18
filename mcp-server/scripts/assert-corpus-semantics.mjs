#!/usr/bin/env node
/**
 * assert-corpus-semantics — `data/**` **全树语义读**门（sweep81：闭合「M 类机械对账 ≠ 语义读」的缺口）。
 *
 * 为什么存在：`assert-corpus-faithfulness.mjs` 做的是 M 类机械对账（篇数 raw==processed、结构类别、
 * `<<<` 残留、目录层完整性）—— 它对「正文是否存在」是盲的。实例：`forge_javadoc/1.12.2` 整棵树
 * 4,567 篇全是 40 B 以下空壳（median = 0），机械对账（raw 4567 == proc 4567）此前一路绿。
 *
 * 本门做什么（可复算的「语义读」，不是 LLM 阅读）：
 *   ① 逐树统计**正文存活**指标：`bodyChars`（去 frontmatter / 标题行 / `>`/`<<<`/`<!--` 标记行后的正文字符数）；
 *      `stub` := bodyChars < 40（标题桩）。
 *   ② 每条树必须**在基线里登记**（新树/改名树 = 红，防「新增一棵没人看过的树」）；基线里登记但盘上没有 = 红。
 *   ③ `stub ≤ 基线 allowedStubs`（**ratchet：只许降**，超即红）。
 *   ④ 有 ≥5 篇的树：`median ≥ 基线 medianFloor`（生成基线时取 0.6×实测中位，且不低于 100）。
 *   ⑤ 全局：`Σstub ≤ 基线 totalStubBudget`（ratchet）。
 *
 * 诚实边界（明写，不夸大）：
 *   · `sectionless`（无 `## ` 小节）**只打印、不判红** —— 实测存在整类「无 ## 但正文厚」的体例
 *     （liteloader 90%、bedrock 100%、forge-docs 最高 21%），没有证据说它们错。
 *   · 本门不判断语义**正确性**（内容对不对），只判断正文**存活与厚度**；正确性由各专族门与源稿门负责。
 *
 * 用法：
 *   node scripts/assert-corpus-semantics.mjs                       # 判红/绿（打印逐树一行）
 *   MC_SKILL_CORPUS_SEMANTICS_INFO=1 node scripts/…                 # 附 sectionless/p10/median 详情
 *   MC_SKILL_CORPUS_SEMANTICS_RELEDGER=1 node scripts/…             # 重算并打印基线 JSON（只打印，不写盘）
 *   node scripts/assert-corpus-semantics.mjs --selftest             # 纯内存投毒（不碰仓库文件）
 *   MC_SKILL_CORPUS_SEMANTICS_DATA_ROOT=<dir> / MC_SKILL_CORPUS_SEMANTICS_BASELINE=<file>   # 换根/换基线（投毒用）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');
const DATA_ROOT = process.env.MC_SKILL_CORPUS_SEMANTICS_DATA_ROOT
  ? path.resolve(process.env.MC_SKILL_CORPUS_SEMANTICS_DATA_ROOT)
  : path.join(REPO_ROOT, 'data');
const BASELINE_PATH = process.env.MC_SKILL_CORPUS_SEMANTICS_BASELINE
  ? path.resolve(process.env.MC_SKILL_CORPUS_SEMANTICS_BASELINE)
  : path.join(HERE, 'corpus-semantics-baseline.json');
const INFO = process.env.MC_SKILL_CORPUS_SEMANTICS_INFO === '1';
const RELEDGER = process.env.MC_SKILL_CORPUS_SEMANTICS_RELEDGER === '1';

/** stub 判据：正文（去 frontmatter/标题/标记行）字符数 < 40 ⇒ 标题桩。 */
export const STUB_MIN = 40;
/** 有 ≥5 篇的树的全局 median 地板。 */
export const GLOBAL_MEDIAN_FLOOR = 100;

export function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(text);
  return m ? text.slice(m[0].length) : text;
}

/** 正文净字符数：逐行去空行、`#` 标题、`>`/`<<<`/`<!--` 标记行。 */
export function countBodyChars(text) {
  let n = 0;
  for (const line of stripFrontmatter(text).split(/\r?\n/)) {
    const s = line.trim();
    if (!s) continue;
    if (s.startsWith('#')) continue;
    if (s.startsWith('>') || s.startsWith('<<<') || s.startsWith('<!--')) continue;
    n += s.length;
  }
  return n;
}

export function collectMdFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collectMdFiles(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** 度量一棵树（目录 = `.../processed`）。 */
export function measureTree(tree, dir) {
  const files = collectMdFiles(dir);
  const bodies = [];
  let stub = 0;
  let sectionless = 0;
  for (const f of files) {
    let text = '';
    try {
      text = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    const bc = countBodyChars(text);
    bodies.push(bc);
    if (bc < STUB_MIN) stub++;
    if (!/^##\s/m.test(stripFrontmatter(text))) sectionless++;
  }
  bodies.sort((a, b) => a - b);
  const q = (p) => (bodies.length ? bodies[Math.min(bodies.length - 1, Math.floor(bodies.length * p))] : 0);
  return { tree, files: files.length, stub, sectionless, p10: q(0.1), median: q(0.5) };
}

/** 纯函数：逐树判定（真跑与 --selftest 共用）。 */
export function judgeTrees(stats, baseline) {
  const problems = [];
  if (!baseline || typeof baseline !== 'object' || !baseline.trees || typeof baseline.trees !== 'object') {
    return ['基线文件缺失/结构不对：顶层必须含 trees 对象'];
  }
  const budget = baseline.totalStubBudget;
  const seen = new Set();
  for (const s of stats) {
    seen.add(s.tree);
    const b = baseline.trees[s.tree];
    if (!b) {
      problems.push(`${s.tree}: 树未登记进基线（新树/改名树必须先核语义并按 RELEDGER 重签）`);
      continue;
    }
    if (typeof b.allowedStubs === 'number' && s.stub > b.allowedStubs) {
      problems.push(
        `${s.tree}: 标题桩 ${s.stub} 篇 > 基线允许 ${b.allowedStubs} 篇（ratchet 只许降；正文退回空壳即红）`,
      );
    }
    const floor = Math.max(GLOBAL_MEDIAN_FLOOR, typeof b.medianFloor === 'number' ? b.medianFloor : 0);
    if (s.files >= 5 && s.median < floor) {
      problems.push(`${s.tree}: 正文中位 ${s.median} < 地板 ${floor}（整树变薄/回退为桩）`);
    }
  }
  for (const tree of Object.keys(baseline.trees)) {
    if (!seen.has(tree)) {
      problems.push(`${tree}: 基线登记但盘上没有（树被删/挪走 ⇒ 先核语义再重签基线）`);
    }
  }
  const totalStub = stats.reduce((a, s) => a + s.stub, 0);
  if (typeof budget === 'number' && totalStub > budget) {
    problems.push(`全局：Σ标题桩 ${totalStub} > 预算 ${budget}（ratchet 只许降）`);
  }
  return problems;
}

function discoverTrees() {
  const trees = [];
  const walk = (dir, depth) => {
    if (depth > 5) return;
    let es;
    try {
      es = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of es) {
      if (!e.isDirectory()) continue;
      const p = path.join(dir, e.name);
      if (e.name === 'processed') {
        trees.push({ tree: path.relative(DATA_ROOT, dir).split(path.sep).join('/'), dir: p });
        continue;
      }
      walk(p, depth + 1);
    }
  };
  walk(DATA_ROOT, 0);
  trees.sort((a, b) => a.tree.localeCompare(b.tree));
  return trees;
}

function selftest() {
  const B = (trees, budget) => ({ totalStubBudget: budget, trees });
  const two = (a, b) => [
    { tree: 'a/good/1', files: 10, ...a },
    { tree: 'b/thin/1', files: 10, ...b },
  ];
  const base = (trees, budget = 10) => B(trees, budget);
  const twoTrees = { 'a/good/1': { allowedStubs: 1, medianFloor: 100 }, 'b/thin/1': { allowedStubs: 0, medianFloor: 500 } };
  const cases = [
    ['good', two({ stub: 1, median: 400 }, { stub: 0, median: 600 }), base(twoTrees), true],
    ['stub 超预算', two({ stub: 2, median: 400 }, { stub: 0, median: 600 }), base(twoTrees), false],
    ['median 低于地板', two({ stub: 1, median: 400 }, { stub: 0, median: 499 }), base(twoTrees), false],
    [
      '未登记树',
      [...two({ stub: 1, median: 400 }, { stub: 0, median: 600 }), { tree: 'c/new/1', files: 10, stub: 0, median: 999 }],
      base(twoTrees),
      false,
    ],
    [
      '全局预算超',
      two({ stub: 1, median: 600 }, { stub: 1, median: 600 }),
      base({ 'a/good/1': { allowedStubs: 2, medianFloor: 0 }, 'b/thin/1': { allowedStubs: 2, medianFloor: 0 } }, 1),
      false,
    ],
  ];
  let missed = 0;
  for (const [name, stats, b, wantGreen] of cases) {
    const problems = judgeTrees(stats, b);
    const green = problems.length === 0;
    if (green !== wantGreen) {
      missed++;
      console.error(`  ✗ selftest「${name}」应${wantGreen ? '绿' : '红'}，实得 ${problems.length} 项问题：${problems.join(' | ')}`);
    }
  }
  // 基线登记但盘上无（用真实基线 + 假 stats 无法表达 ⇒ 单独构造）
  const missingTree = judgeTrees([], { totalStubBudget: 0, trees: { 'x/only-in-baseline/1': { allowedStubs: 0, medianFloor: 0 } } });
  if (missingTree.length === 0) {
    missed++;
    console.error('  ✗ selftest「基线登记但盘上无」应红实绿');
  }
  console.log(
    `\nassert-corpus-semantics(selftest): ${missed === 0 ? `OK（${cases.length + 1} 类畸形全检出）` : missed + ' 例不符'}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
}

if (process.argv.includes('--selftest')) {
  selftest();
} else {
  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`assert-corpus-semantics: 基线不存在 ${BASELINE_PATH}`);
    process.exit(1);
  }
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  const trees = discoverTrees();
  if (trees.length === 0) {
    console.error(`assert-corpus-semantics: ${DATA_ROOT} 下一棵 processed 树都没找到（换错根 ≠ 零缺陷）`);
    process.exit(1);
  }
  const stats = trees.map(({ tree, dir }) => measureTree(tree, dir));
  const problems = judgeTrees(stats, baseline);

  if (RELEDGER) {
    const next = { totalStubBudget: stats.reduce((a, s) => a + s.stub, 0), trees: {} };
    for (const s of stats) {
      next.trees[s.tree] = {
        files: s.files,
        allowedStubs: s.stub,
        medianFloor: s.files < 5 ? 0 : Math.max(GLOBAL_MEDIAN_FLOOR, Math.round(s.median * 0.6)),
      };
    }
    console.log('[RELEDGER] 重算基线（只打印，不写盘；确认后手工替换 corpus-semantics-baseline.json）：');
    console.log(JSON.stringify(next, null, 2));
  }

  const totalStub = stats.reduce((a, s) => a + s.stub, 0);
  const totalFiles = stats.reduce((a, s) => a + s.files, 0);
  if (INFO) {
    console.log('tree | files | stub | sectionless | p10 | median');
    for (const s of stats) console.log(`${s.tree} | ${s.files} | ${s.stub} | ${s.sectionless} | ${s.p10} | ${s.median}`);
  }
  if (problems.length > 0) {
    console.error(
      `assert-corpus-semantics: ${problems.length} 项不通过（树=${stats.length} / 篇=${totalFiles} / Σ桩=${totalStub} ≤ 预算 ${baseline.totalStubBudget}）`,
    );
    for (const p of problems.slice(0, 30)) console.error(`  ✗ ${p}`);
    if (problems.length > 30) console.error(`  …另有 ${problems.length - 30} 项`);
    process.exit(1);
  }
  console.log(
    `assert-corpus-semantics: ok（树 ${stats.length} / 篇 ${totalFiles} · Σ标题桩 ${totalStub} ≤ 预算 ${baseline.totalStubBudget} · ` +
      `逐树 median 均 ≥ 地板 · sectionless 仅打印不判红）`,
  );
}
