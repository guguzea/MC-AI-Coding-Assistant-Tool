#!/usr/bin/env node
/**
 * assert-rule-ledger — 审计结论「机读清单 + 扫 HEAD」门骨架（sweep81 C-2）。
 *
 * 存在理由（sweep80 §I / §H-1 根因）：审计结论落在 `temp/audit/findings/**`，而 `npm test` 链
 * 只看**工具实现**与**文档计数** —— 两者之间没有桥，于是同一批 S1 可以跨 70+ sweep 存活。
 * 本门是那座桥的**骨架**：`assertion-ledger.json` 里每条不变量都必须
 *   ① 有可证伪的 claim；② 有作者（哪一轮审计 + 哪一轮修复）；③ 有一手证据；
 *   ④ status=closed 时必须点名一道**真实存在且被真跑**的门。
 *
 * 本版范围（用户拍板：C-2 只建骨架）：
 *   - 只校验清单自身的**完整性与可达性**（含「不允许空清单」「不允许指向不存在的门」
 *     「不允许指向没被 test-scripts 真跑的门」「status=closed 必须有证据」）；
 *   - **不**逐条复算被点名门的判据（那是后续轮：逐条销账能力）。
 *   - 因此本门**从第一天起就有判别力**（不是永远绿的空门）：`--selftest` 用三种畸形清单证明它会红。
 *
 * 用法：
 *   node scripts/assert-rule-ledger.mjs            # 判红/绿
 *   node scripts/assert-rule-ledger.mjs --selftest # 纯内存 + OS tmpdir 投毒（不碰仓库文件）
 *   MC_SKILL_LEDGER_PATH=<file> node scripts/assert-rule-ledger.mjs   # 指向别处清单（投毒用）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const SCRIPTS_DIR = path.join(SERVER_ROOT, 'scripts');
const LEDGER_PATH = process.env.MC_SKILL_LEDGER_PATH
  ? path.resolve(process.env.MC_SKILL_LEDGER_PATH)
  : path.join(SCRIPTS_DIR, 'assertion-ledger.json');
/**
 * 「真跑」的权威来源 = **两处并集**（2026-09-18 实测踩过：只用 ① 会把每轮都跑的门误判成没人跑）：
 *   ① `test-scripts.mjs` 里那张 `for (const gate of [...])` 真跑清单（本仓新增门的常规挂点）；
 *   ② `mcp-server/package.json` 的 `test` 脚本链（`assert-no-invalid-api-shapes.mjs` 就只在链上、不在 ①）。
 */
const HOSTS = [path.join(SERVER_ROOT, 'test-scripts.mjs'), path.join(SERVER_ROOT, 'package.json')];
const HOST = HOSTS[0];

const REQUIRED = ['id', 'claim', 'author', 'evidence', 'status', 'gate'];
const STATUSES = new Set(['closed', 'open']);

/** 纯函数：校验清单（供真跑与 --selftest 共用）。 */
export function validateLedger(ledger, ctx = {}) {
  const problems = [];
  const { scriptsDir = SCRIPTS_DIR, hostTexts = [] } = ctx;
  if (!ledger || typeof ledger !== 'object' || !Array.isArray(ledger.rules)) {
    return ['清单顶层必须是对象且含 rules 数组（空清单同样不合格：不允许永远绿的空门）'];
  }
  if (ledger.rules.length === 0) {
    problems.push('rules 为空：本门不接受空清单（骨架也至少要 1 条真实不变量）');
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
    if (r.gate) {
      const gatePath = path.join(scriptsDir, r.gate);
      if (!fs.existsSync(gatePath)) {
        problems.push(`${at}: 点名的门不存在 ${r.gate}（清单指向空气 = 该不变量其实无人守）`);
      } else if (hostTexts.length > 0 && !hostTexts.some((t) => t.includes(r.gate))) {
        problems.push(
          `${at}: 点名的门 ${r.gate} 没有被任何宿主真跑（test-scripts.mjs 与 package.json 的 test 链都没提到 ⇒ 登记在册≠有人跑）`,
        );
      }
    }
  }
  return problems;
}

if (process.argv.includes('--selftest')) {
  const hostTexts = HOSTS.filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f, 'utf8'));
  const base = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  const cases = [
    ['空清单', { rules: [] }],
    ['缺必填字段', { rules: [{ ...base.rules[0], evidence: '' }] }],
    ['指向不存在的门', { rules: [{ ...base.rules[0], gate: 'no-such-gate.mjs' }] }],
    ['非法 status', { rules: [{ ...base.rules[0], status: 'done' }] }],
    ['顶层不是对象', [{ rules: [] }]],
  ];
  // 「存在但没人跑」的门：**动态找**（硬编码文件名会因挂点变化而失效）
  const orphan = fs
    .readdirSync(SCRIPTS_DIR)
    .filter((n) => n.startsWith('assert-') && n.endsWith('.mjs'))
    .find((n) => !hostTexts.some((t) => t.includes(n)));
  if (orphan) cases.push([`指向没被真跑的门(${orphan})`, { rules: [{ ...base.rules[0], gate: orphan }] }]);
  else console.log('  note: scripts/ 下不存在「存在但未被任何宿主真跑」的门 ⇒ 跳过该投毒用例');
  let missed = 0;
  for (const [name, mut] of cases) {
    // sweep81 C0 尾巴修正：旧版把用例先落 OS tmpdir 再读回 —— 纯冗余（validateLedger 是纯函数，
    // 收对象即可），却让本门自己踩 write-guard（`writeFileSync` / `rmSync` 直接调用）⇒ test-core 恒红。
    // 去掉这次磁盘往返后，本门对仓库零写入，无需任何豁免签字。
    const problems = validateLedger(mut, { hostTexts });
    if (problems.length === 0) {
      missed++;
      console.error(`  ✗ selftest「${name}」应红实绿`);
    }
  }
  // 正对照：真实清单必须绿
  const realProblems = validateLedger(JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')), { hostTexts });
  if (realProblems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实清单本应绿，实得 ${realProblems.length} 项问题`);
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
  const closed = rules.filter((r) => r && r.status === 'closed').length;
  const open = rules.filter((r) => r && r.status === 'open').length;
  if (problems.length > 0) {
    console.error(`assert-rule-ledger: ${problems.length} 项不通过（清单 ${path.relative(SERVER_ROOT, LEDGER_PATH)}）`);
    for (const p of problems.slice(0, 25)) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  console.log(
    `assert-rule-ledger: ok（不变量 ${rules.length} 条：closed ${closed} / open ${open}；每条点名的门均存在且被 ${path.basename(HOST)} 真跑）`,
  );
}
