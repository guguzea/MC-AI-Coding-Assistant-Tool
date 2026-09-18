#!/usr/bin/env node
/**
 * assert-rule-ledger — 审计结论「机读清单 + 逐条销账」门（sweep81 C-2；v2 = 闭合「假闭环」的收口版）。
 *
 * 存在理由（sweep80 §I / §H-1 根因）：审计结论落在 `temp/audit/findings/**`，而 `npm test` 链
 * 只看**工具实现**与**文档计数** —— 两者之间没有桥，于是同一批 S1 可以跨 70+ sweep 存活。
 * 本门是那座桥：`assertion-ledger.json` 里每条不变量都必须
 *   ① 有可证伪的 claim；② 有作者（哪一轮审计 + 哪一轮修复）；③ 有一手证据（evidence 散文）
 *      与**可解析的证据文件引用**（evidenceRefs，逐个必须真实存在）；
 *   ④ status=closed 时必须点名 ≥1 道**真实存在且被真跑**的门，并带 closedAt；
 *   ⑤ status=open 时必须写清 whyOpen + nextRound（未闭合的东西不许静静躺着）。
 *
 * v2（2026-09-18）相对 v1 骨架新增的**逐条销账能力**：
 *   · 每条可挂**多道门**（`gates[]`，老字段 `gate` 兼容）；
 *   · `evidenceRefs[]` 逐条做**存在性**校验（清单指向空气 = 不变量无人守）；
 *   · `--verify`：把清单里每道门**真跑一遍**，逐条给出 pass/fail 与汇总（`MC_SKILL_LEDGER_VERIFY=1`）；
 *   · open 条目在默认输出里**逐条点名**（含 nextRound），不允许藏在计数里；
 *   · `MC_SKILL_RULE_LEDGER_INFO=1` 打印逐条明细表。
 *
 * 用法：
 *   node scripts/assert-rule-ledger.mjs                       # 静态判红/绿（默认；快）
 *   MC_SKILL_RULE_LEDGER_INFO=1 node scripts/…                 # 附逐条明细
 *   MC_SKILL_LEDGER_VERIFY=1 node scripts/…                    # 逐条销账：真跑每道门并逐条报 pass/fail
 *   node scripts/assert-rule-ledger.mjs --selftest             # 纯内存畸形清单投毒（不碰仓库文件）
 *   MC_SKILL_LEDGER_PATH=<file> node scripts/…                 # 指向别处清单（投毒用）
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');
const SCRIPTS_DIR = path.join(SERVER_ROOT, 'scripts');
const LEDGER_PATH = process.env.MC_SKILL_LEDGER_PATH
  ? path.resolve(process.env.MC_SKILL_LEDGER_PATH)
  : path.join(SCRIPTS_DIR, 'assertion-ledger.json');
const INFO = process.env.MC_SKILL_RULE_LEDGER_INFO === '1';
const VERIFY = process.env.MC_SKILL_LEDGER_VERIFY === '1';

/**
 * 「真跑」的权威来源 = **两处并集**（2026-09-18 实测踩过：只用 ① 会把每轮都跑的门误判成没人跑）：
 *   ① `test-scripts.mjs` 里那张 `for (const gate of [...])` 真跑清单（本仓新增门的常规挂点）；
 *   ② `mcp-server/package.json` 的 `test` 脚本链（`test-core.mjs` / `test-update.mjs` 等只在链上）。
 */
const HOSTS = [path.join(SERVER_ROOT, 'test-scripts.mjs'), path.join(SERVER_ROOT, 'package.json')];
const HOST = HOSTS[0];

const REQUIRED = ['id', 'claim', 'author', 'evidence', 'status'];
const STATUSES = new Set(['closed', 'open']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 归一化门列表：兼容 v1 的单数 `gate`。 */
export function gatesOf(r) {
  const list = [];
  if (Array.isArray(r.gates)) for (const g of r.gates) if (typeof g === 'string' && g.trim()) list.push(g.trim());
  if (typeof r.gate === 'string' && r.gate.trim() && !list.includes(r.gate.trim())) list.push(r.gate.trim());
  return list;
}

/** 门文件的落点：assert-* 在 scripts/ 下；test-* 在 mcp-server/ 根。 */
export function gatePathOf(gate, scriptsDir = SCRIPTS_DIR) {
  return gate.startsWith('test-') ? path.join(path.dirname(scriptsDir), gate) : path.join(scriptsDir, gate);
}

/** 纯函数：校验清单（真跑、--verify 与 --selftest 共用）。 */
export function validateLedger(ledger, ctx = {}) {
  const problems = [];
  const { scriptsDir = SCRIPTS_DIR, hostTexts = [], repoRoot = REPO_ROOT } = ctx;
  if (!ledger || typeof ledger !== 'object' || !Array.isArray(ledger.rules)) {
    return ['清单顶层必须是对象且含 rules 数组（空清单同样不合格：不允许永远绿的空门）'];
  }
  if (ledger.rules.length === 0) {
    problems.push('rules 为空：本门不接受空清单（至少要有 1 条真实不变量）');
  }
  const seen = new Set();
  for (const [i, r] of ledger.rules.entries()) {
    const at = `rules[${i}]${r && r.id ? `(${r.id})` : ''}`;
    if (!r || typeof r !== 'object') {
      problems.push(`${at}: 必须是对象`);
      continue;
    }
    for (const k of REQUIRED) {
      if (typeof r[k] !== 'string' || r[k].trim() === '') problems.push(`${at}: 缺必填字段 ${k}`);
    }
    if (r.id && seen.has(r.id)) problems.push(`${at}: id 重复`);
    if (r.id) seen.add(r.id);
    if (r.status && !STATUSES.has(r.status)) problems.push(`${at}: status 只允许 ${[...STATUSES].join(' / ')}`);

    // 逐条销账 ①：evidenceRefs 必须逐条真实存在（清单指向空气 = 该不变量其实无人守）
    if (!Array.isArray(r.evidenceRefs) || r.evidenceRefs.length === 0) {
      problems.push(`${at}: 缺 evidenceRefs（≥1 个仓库内证据文件路径；散文证据不够，要有可解析引用）`);
    } else {
      for (const ref of r.evidenceRefs) {
        if (typeof ref !== 'string' || !ref.trim()) {
          problems.push(`${at}: evidenceRefs 含空项`);
        } else if (!fs.existsSync(path.join(repoRoot, ref))) {
          problems.push(`${at}: evidenceRefs 指向不存在的文件 ${ref}`);
        }
      }
    }

    const gates = gatesOf(r);
    if (r.status === 'closed') {
      if (gates.length === 0) {
        problems.push(`${at}: status=closed 必须点名 ≥1 道门（gates[]）；没有门的「已销账」是假闭环`);
      }
      if (typeof r.closedAt !== 'string' || !DATE_RE.test(r.closedAt)) {
        problems.push(`${at}: status=closed 必须带 closedAt（YYYY-MM-DD）`);
      }
    }
    if (r.status === 'open') {
      for (const k of ['whyOpen', 'nextRound']) {
        if (typeof r[k] !== 'string' || r[k].trim() === '') {
          problems.push(`${at}: status=open 必须写清 ${k}（未闭合项不许静静躺着）`);
        }
      }
    }

    for (const gate of gates) {
      const gatePath = gatePathOf(gate, scriptsDir);
      if (!fs.existsSync(gatePath)) {
        problems.push(`${at}: 点名的门不存在 ${gate}（清单指向空气 = 该不变量其实无人守）`);
      } else if (hostTexts.length > 0 && !hostTexts.some((t) => t.includes(gate))) {
        problems.push(
          `${at}: 点名的门 ${gate} 没有被任何宿主真跑（test-scripts.mjs 与 package.json 的 test 链都没提到 ⇒ 登记在册≠有人跑）`,
        );
      }
    }
  }
  return problems;
}

/** --verify：逐条真跑每道门，返回 per-item 结果（不写盘）。 */
function verifyLedger(ledger) {
  const perGate = new Map();
  const uniqueGates = new Set();
  for (const r of ledger.rules) for (const g of gatesOf(r)) uniqueGates.add(g);
  for (const gate of uniqueGates) {
    const gatePath = gatePathOf(gate);
    if (!fs.existsSync(gatePath)) {
      perGate.set(gate, { rc: 127, note: '门文件不存在' });
      continue;
    }
    const r = spawnSync(process.execPath, [gatePath], { cwd: SERVER_ROOT, encoding: 'utf8', timeout: 900_000, windowsHide: true });
    const tail = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split(/\r?\n/).filter(Boolean).pop() ?? '';
    perGate.set(gate, { rc: r.status ?? 1, note: tail.slice(0, 120) });
  }
  let failed = 0;
  console.log('=== 逐条销账（--verify：每道门真跑一次）===');
  for (const r of ledger.rules) {
    const gates = gatesOf(r);
    if (r.status !== 'closed') {
      console.log(`  ○ ${r.id} [open]（whyOpen: ${r.whyOpen ?? '(缺)'} / nextRound: ${r.nextRound ?? '(缺)'}）`);
      continue;
    }
    const results = gates.map((g) => perGate.get(g) ?? { rc: 127, note: '未跑' });
    const ok = results.length > 0 && results.every((x) => x.rc === 0);
    if (!ok) failed++;
    console.log(
      `  ${ok ? '✓' : '✗'} ${r.id} · ${gates.map((g, i) => `${g}:rc=${results[i].rc}`).join(' / ')}` +
        (ok ? '' : ` —— ${results.map((x) => x.note).join(' | ')}`),
    );
  }
  const uniq = [...perGate.entries()];
  console.log(`门 ${uniq.length} 道：${uniq.map(([g, x]) => `${g}(${x.rc})`).join(', ')}`);
  console.log(`逐条销账结果：${ledger.rules.length - failed} / ${ledger.rules.length} 条通过`);
  return failed === 0;
}

if (process.argv.includes('--selftest')) {
  const hostTexts = HOSTS.filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f, 'utf8'));
  const base = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  const ctx = { hostTexts };
  const mk = (patch) => ({ rules: [{ ...base.rules[0], ...patch }] });
  const cases = [
    ['空清单', { rules: [] }],
    ['缺必填字段', mk({ evidence: '' })],
    ['指向不存在的门', mk({ gates: ['no-such-gate.mjs'], gate: undefined })],
    ['非法 status', mk({ status: 'done' })],
    ['顶层不是对象', [{ rules: [] }]],
    ['closed 缺 closedAt', mk({ closedAt: '' })],
    ['closed 缺 gates', mk({ gates: [], gate: undefined })],
    ['evidenceRefs 指向不存在文件', mk({ evidenceRefs: ['no/such/evidence-file.md'] })],
    ['evidenceRefs 为空', mk({ evidenceRefs: [] })],
    ['open 缺 whyOpen/nextRound', { rules: [{ ...base.rules[0], status: 'open', whyOpen: '', nextRound: '' }] }],
  ];
  // 「存在但没人跑」的门：**动态找**（硬编码文件名会因挂点变化而失效）
  const orphan = fs
    .readdirSync(SCRIPTS_DIR)
    .filter((n) => n.startsWith('assert-') && n.endsWith('.mjs'))
    .find((n) => !hostTexts.some((t) => t.includes(n)));
  if (orphan) cases.push([`指向没被真跑的门(${orphan})`, mk({ gates: [orphan], gate: undefined })]);
  else console.log('  note: scripts/ 下不存在「存在但未被任何宿主真跑」的门 ⇒ 跳过该投毒用例');
  let missed = 0;
  for (const [name, mut] of cases) {
    // 纯函数直接收对象（不落盘）—— 本门对仓库零写入，无需 write-guard 豁免（C0 尾巴的教训）。
    const problems = validateLedger(mut, ctx);
    if (problems.length === 0) {
      missed++;
      console.error(`  ✗ selftest「${name}」应红实绿`);
    }
  }
  const realProblems = validateLedger(JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')), ctx);
  if (realProblems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实清单本应绿，实得 ${realProblems.length} 项问题`);
    for (const p of realProblems.slice(0, 5)) console.error(`      ${p}`);
  }
  console.log(
    `\nassert-rule-ledger(selftest): ${missed === 0 ? `OK（${cases.length} 类畸形清单全检出 + 真实清单正对照绿）` : missed + ' 例不符'}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
} else {
  if (!fs.existsSync(LEDGER_PATH)) {
    console.error(`assert-rule-ledger: 清单不存在 ${LEDGER_PATH}`);
    process.exit(1);
  }
  let ledger;
  try {
    ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  } catch (e) {
    console.error(`assert-rule-ledger: 清单不是合法 JSON —— ${e.message}`);
    process.exit(1);
  }
  const hostTexts = HOSTS.filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f, 'utf8'));
  const problems = validateLedger(ledger, { hostTexts });
  const rules = Array.isArray(ledger.rules) ? ledger.rules : [];
  const closed = rules.filter((r) => r && r.status === 'closed');
  const open = rules.filter((r) => r && r.status === 'open');
  if (problems.length > 0) {
    console.error(`assert-rule-ledger: ${problems.length} 项不通过（清单 ${path.relative(SERVER_ROOT, LEDGER_PATH)}）`);
    for (const p of problems.slice(0, 25)) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  if (INFO) {
    console.log('id | status | gates | closedAt | 证据引用');
    for (const r of rules) {
      console.log(
        `${r.id} | ${r.status} | ${gatesOf(r).join(",") || "-"} | ${r.closedAt ?? "-"} | ${(r.evidenceRefs ?? []).length} 个`,
      );
    }
  }
  console.log(
    `assert-rule-ledger: ok（不变量 ${rules.length} 条：closed ${closed.length} / open ${open.length}；` +
      `每条 closed 的门均存在且被 ${path.basename(HOST)} ∪ package.json 真跑 · 证据引用逐条存在）`,
  );
  for (const r of open) {
    console.log(`  ○ open: ${r.id} —— whyOpen: ${r.whyOpen}；nextRound: ${r.nextRound}`);
  }
  if (VERIFY) {
    const ok = verifyLedger(ledger);
    process.exitCode = ok ? 0 : 1;
  }
}
