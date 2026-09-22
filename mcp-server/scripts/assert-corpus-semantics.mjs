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
 *      `stub` := bodyChars < 40 **且无任何 `## ` 小节**（真·空页；2026-09-18 收紧：仅 body<40 会把
 *      「单构造器嵌套类」这类合法极薄页误报——实测 132/197 是这种，故 `thin`（薄但有结构）只打印不判红）。
 *   ② 每条树必须**在基线里登记**（新树/改名树 = 红，防「新增一棵没人看过的树」）；基线里登记但盘上没有 = 红。
 *   ③ `stub ≤ 基线 allowedStubs`（**ratchet：只许降**，超即红）。
 *   ④ 有 ≥5 篇的树：`median ≥ 基线 medianFloor`（生成基线时取 0.6×实测中位，且不低于 100）。
 *   ⑤ 全局：`Σstub ≤ 基线 totalStubBudget`（ratchet）。
 *   ⑥ 按树 opt-in 的 `p10Floor`：`p10 ≥ 地板`（2026-09-22 用户裁定③）。存在的理由 = ④ 的盲区：
 *      「一页一声明」体裁（bedrock-scriptapi 624 页）中位数天然是"中等那页"，把最薄的一成刷成
 *      60 字也惊不动 median；p10 盯的就是从尾部开始塌。基线钉了 p10Floor 而统计没算 p10 ⇒ 该判据红（不许空转）。
 *   ⑦ 按树 opt-in 的 `membersFloor`：`Σ成员条数 ≥ 地板` + **逐页自洽**（2026-09-22 用户裁定④）。
 *      计数口径 = 页内 `## Members（N）` 自报的 N 逐页求和，并要求它等于该页 `### \`x\`` 小节数 ——
 *      「一页一声明」族（scriptapi）光看厚度不够：截断掉半截成员列表的页，正文照样有几百字。
 *      N 与实际小节数不等 ⇒ 当场红（不依赖地板，抓的是单页截断）；Σ 地板抓的是整树掉页。
 *      稳定计数源 = 生产者留在树上的 `scriptapi-typed.json`（它自己解析 npm d.ts 的成员清单），
 *      三方对账由 `assert-bedrock-scriptapi-members.mjs` 负责；本判据只读语料，不读那份 JSON。
 *
 * 诚实边界（明写，不夸大）：
 *   · `sectionless`（无 `## ` 小节）**只打印、不判红** —— 2026-09-18 **逐族定性完成**
 *     （证据：temp/audit/sweep81/SECTIONLESS-TRIAGE.md + logs/sectionless.log）：
 *     bedrock 20/20（Learn 转储为扁平文本）、liteloader 27/30（上游用 `#`+`###` 跳 `##`）、
 *     forge-docs 12–21%（`#`+`###` 或扁平）、fabric-docs 2–6%（setext/MDX 索引页）、
 *     neoforge-docs 1–7%、quilt 25%、modloader 1/1（设计如此的空表页）、rift 1/6（上游空页，具名 residue）
 *     —— **全部为体例差异，无内容缺失**；⇒ 结论：**不升级为判据**（若未来某族改为「应有 ##」体裁，再按族加判据）。
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

/** 度量一棵树（目录 = `.../processed`）。stub = 真·空页（body<40 且无任何 `## ` 小节）。 */
export function measureTree(tree, dir) {
  const files = collectMdFiles(dir);
  const bodies = [];
  const stubFiles = [];
  let stub = 0;
  let thin = 0;
  let sectionless = 0;
  let members = 0;
  let memberMismatch = 0;
  const memberMismatchFiles = [];
  for (const f of files) {
    let text = '';
    try {
      text = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    const body = stripFrontmatter(text);
    const bc = countBodyChars(text);
    bodies.push(bc);
    const hasSections = /^##\s/m.test(body);
    if (!hasSections) sectionless++;
    if (bc < STUB_MIN) {
      if (hasSections) thin++;
      else {
        stub++;
        stubFiles.push(path.relative(dir, f).split(path.sep).join('/'));
      }
    }
    // 判据⑦的口径：生产者自报的成员条数（`## Members（N）`）与该页实际成员小节数必须相等。
    // 两样都没有的页（绝大多数族）在此恒等 0==0，不贡献任何计数 ⇒ 不会给别的族凭空加判据。
    const mn = /^##\s*Members（(\d+)）/m.exec(body);
    if (mn) members += Number(mn[1]);
    const h3 = (body.match(/^### `[^`]+`$/gm) || []).length;
    if (mn && Number(mn[1]) !== h3) {
      memberMismatch++;
      if (memberMismatchFiles.length < 5) {
        memberMismatchFiles.push(`${path.relative(dir, f).split(path.sep).join('/')}: 自报 ${mn[1]} 实际 ${h3}`);
      }
    }
  }
  bodies.sort((a, b) => a - b);
  const q = (p) => (bodies.length ? bodies[Math.min(bodies.length - 1, Math.floor(bodies.length * p))] : 0);
  return {
    tree,
    files: files.length,
    stub,
    thin,
    sectionless,
    stubFiles,
    p10: q(0.1),
    median: q(0.5),
    members,
    memberMismatch,
    memberMismatchFiles,
  };
}

/** 纯函数：逐树判定（真跑与 --selftest 共用）。 */
export function judgeTrees(stats, baseline) {
  const problems = [];
  if (!baseline || typeof baseline !== 'object' || !baseline.trees || typeof baseline.trees !== 'object') {
    return ['基线文件缺失/结构不对：顶层必须含 trees 对象'];
  }
  const budget = baseline.totalStubBudget;
  const residueEnabled = Array.isArray(baseline.residue);
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
    // 判据⑥（2026-09-22 用户裁定③）：p10 地板。median 对「一页一声明」这类体裁不敏感 ——
    // scriptapi 624 页把最薄的一成刷成 60 字，中位仍然好看。钉 p10 才抓得住"从尾部开始塌"。
    // 与 medianFloor 一样是**按树 opt-in**（不给全局地板：多数树的 p10 天然就低，加了只会假红）。
    if (typeof b.p10Floor === 'number') {
      if (typeof s.p10 !== 'number') {
        problems.push(`${s.tree}: 基线钉了 p10Floor=${b.p10Floor} 但统计里没有 p10 ⇒ 这条判据在空转（scanTree 被改了？）`);
      } else if (s.files >= 5 && s.p10 < b.p10Floor) {
        problems.push(`${s.tree}: 正文 p10 ${s.p10} < 地板 ${b.p10Floor}（最薄的一成先塌，median 未动也拦得住）`);
      }
    }
    // 判据⑦（2026-09-22 用户裁定④）：成员条数。两条独立腿 ——
    //   ⑦a 逐页自洽：页自报 `## Members（N）` 必须等于该页 `### \`x\`` 小节数（抓单页截断，不依赖地板）；
    //   ⑦b Σ 地板：整树成员总条数 ≥ 基线 `membersFloor`（抓成片掉页；按树 opt-in，同 ⑥ 的口径 0.6×）。
    // 只盯厚度的 ④⑥ 看不见这种缺陷：删掉一半成员列表的页正文仍有几百字，中位和 p10 照旧。
    if (typeof s.members === 'number' && s.memberMismatch > 0) {
      problems.push(
        `${s.tree}: ${s.memberMismatch} 页的成员自报条数与实际成员小节数不等（正文被截断/手改过）：${(s.memberMismatchFiles ?? []).join(' · ')}`,
      );
    }
    if (typeof b.membersFloor === 'number') {
      if (typeof s.members !== 'number') {
        problems.push(`${s.tree}: 基线钉了 membersFloor=${b.membersFloor} 但统计里没有 members ⇒ 这条判据在空转（measureTree 被改了？）`);
      } else if (s.members < b.membersFloor) {
        problems.push(`${s.tree}: Σ成员 ${s.members} < 地板 ${b.membersFloor}（成员列表成片消失，p10/median 未必动）`);
      }
    }
    // 具名 residue（可选层）：允许留下的真·空页必须**逐条具名**，且条目过期（文件已不是空页）即红。
    if (residueEnabled) {
      const named = baseline.residue.filter((r) => r && r.tree === s.tree);
      if (named.length !== s.stub) {
        problems.push(
          `${s.tree}: 真·空页 ${s.stub} 篇但具名 residue 只有 ${named.length} 条（允许的桩必须逐条登记，不许留匿名额度）`,
        );
      }
      for (const n of named) {
        if (!(s.stubFiles ?? []).includes(n.file)) {
          problems.push(`${s.tree}: residue 过期 —— ${n.file} 已不是真·空页（删掉该条；ratchet 只许降）`);
        }
      }
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
    [
      'residue 具名齐全（应绿）',
      [{ tree: 'a/good/1', files: 10, stub: 1, median: 400, stubFiles: ['processed/x.md'] }],
      {
        totalStubBudget: 1,
        trees: { 'a/good/1': { allowedStubs: 1, medianFloor: 100 } },
        residue: [{ tree: 'a/good/1', file: 'processed/x.md', reason: 'fixture' }],
      },
      true,
    ],
    [
      'residue 匿名额度（有桩未具名 ⇒ 红）',
      [{ tree: 'a/good/1', files: 10, stub: 2, median: 400, stubFiles: ['processed/x.md', 'processed/y.md'] }],
      {
        totalStubBudget: 2,
        trees: { 'a/good/1': { allowedStubs: 2, medianFloor: 100 } },
        residue: [{ tree: 'a/good/1', file: 'processed/x.md', reason: 'fixture' }],
      },
      false,
    ],
    [
      'residue 过期（条目对应文件已非空页 ⇒ 红）',
      [{ tree: 'a/good/1', files: 10, stub: 0, median: 400, stubFiles: [] }],
      {
        totalStubBudget: 0,
        trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 100 } },
        residue: [{ tree: 'a/good/1', file: 'processed/x.md', reason: 'fixture' }],
      },
      false,
    ],
    [
      // 判据⑥：p10 地板（2026-09-22 用户裁定③）。三例钉住"尾塌而 median 不动"这个 median 抓不到的形状。
      'p10 达标（应绿）',
      [{ tree: 'a/good/1', files: 624, stub: 0, median: 363, p10: 123 }],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, p10Floor: 110 } } },
      true,
    ],
    [
      'p10 掉一半而 median 未动（最薄的一成先塌 ⇒ 必红）',
      [{ tree: 'a/good/1', files: 624, stub: 0, median: 363, p10: 61 }],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, p10Floor: 110 } } },
      false,
    ],
    [
      '基线钉了 p10Floor 但统计没算 p10（判据空转 ⇒ 必红）',
      [{ tree: 'a/good/1', files: 624, stub: 0, median: 363 }],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, p10Floor: 110 } } },
      false,
    ],
    [
      // 判据⑦：成员条数（2026-09-22 用户裁定④）。p10/median 都达标的树，成员照样能成片丢 —— 这三例
      // 各自只让 ⑦ 的一条腿红，另两条腿保持绿，证明它不是前两条的重述。
      '成员 Σ 与逐页自洽都达标（应绿）',
      [{ tree: 'a/good/1', files: 624, stub: 0, median: 363, p10: 123, members: 2590, memberMismatch: 0 }],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, p10Floor: 110, membersFloor: 1554 } } },
      true,
    ],
    [
      'Σ成员掉到地板以下（成员列表成片消失 ⇒ 必红）',
      [{ tree: 'a/good/1', files: 624, stub: 0, median: 363, p10: 123, members: 900, memberMismatch: 0 }],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, p10Floor: 110, membersFloor: 1554 } } },
      false,
    ],
    [
      '单页截断（自报 12 实际 5，Σ 仍在地板上 ⇒ ⑦a 必红而 ④⑥ 全绿）',
      [
        {
          tree: 'a/good/1', files: 624, stub: 0, median: 363, p10: 123, members: 2590,
          memberMismatch: 1, memberMismatchFiles: ['scriptapi/AABB.md: 自报 12 实际 5'],
        },
      ],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, p10Floor: 110, membersFloor: 1554 } } },
      false,
    ],
    [
      '基线钉了 membersFloor 但统计没算 members（判据空转 ⇒ 必红）',
      [{ tree: 'a/good/1', files: 624, stub: 0, median: 363, p10: 123 }],
      { totalStubBudget: 0, trees: { 'a/good/1': { allowedStubs: 0, medianFloor: 200, membersFloor: 1554 } } },
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
      const prev = baseline.trees[s.tree] ?? {};
      next.trees[s.tree] = {
        files: s.files,
        allowedStubs: s.stub,
        medianFloor: s.files < 5 ? 0 : Math.max(GLOBAL_MEDIAN_FLOOR, Math.round(s.median * 0.6)),
        // p10Floor 是**按树 opt-in**（判据⑥）：只沿用"基线里本来就钉了"的那些，按同一 0.6 口径重算。
        // 不给全部树自动加上 —— 多数树的 p10 天然就低（一页一声明 / 表格体例），全量加只会把这条判据变成噪声源。
        ...(typeof prev.p10Floor === 'number' ? { p10Floor: Math.max(1, Math.round(s.p10 * 0.6)) } : {}),
        // membersFloor 同口径按树 opt-in（判据⑦b）：只有「一页一声明」这类带成员计数的族该钉；
        // 钉法取 0.6×Σ实测 —— 总成员数是**派生量**（由页内 `## Members（N）` 现算），不是抄来的常量。
        ...(typeof prev.membersFloor === 'number' ? { membersFloor: Math.max(1, Math.round(s.members * 0.6)) } : {}),
      };
    }
    console.log('[RELEDGER] 重算基线（只打印，不写盘；确认后手工替换 corpus-semantics-baseline.json）：');
    console.log(JSON.stringify(next, null, 2));
  }

  const totalStub = stats.reduce((a, s) => a + s.stub, 0);
  const totalFiles = stats.reduce((a, s) => a + s.files, 0);
  if (INFO) {
    console.log('tree | files | stub(真·空页) | thin(薄但有结构) | sectionless | p10 | median | Σ成员(页自报) | 成员不自洽页');
    for (const s of stats) {
      console.log(
        `${s.tree} | ${s.files} | ${s.stub} | ${s.thin} | ${s.sectionless} | ${s.p10} | ${s.median} | ${s.members} | ${s.memberMismatch}`,
      );
    }
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
