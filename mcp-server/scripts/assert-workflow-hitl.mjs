#!/usr/bin/env node
/**
 * assert-workflow-hitl — 工作流模板「人在环」语义门（W5-3，2026-09-20）。
 *
 * 背景：`get_workflow_template` 是**人在环清单**，不是无人值守流水线。模板措辞散落在
 * `src/prompts/templates.ts` 的 40+ 个 body 里，靠人眼守不住；本门把它变成可机械复核的判据。
 *
 * 判据（每个模板都要满足，二选一）：
 *   ① body 引 `${WORKFLOW_HITL}` 常量（措辞单源）；或
 *   ② body 含「确认语义」字样（人在环 / 确认）。
 * 另加两条：
 *   · MUST_REFERENCE（曾「零确认语义」的 5 个模板）**必须**走 ①；
 *   · 走 ②（不引常量）的模板数不得超过 NON_CONSTANT_CEILING（棘轮只降 —— 收敛进度不许回退）。
 *
 * 用法：
 *   node scripts/assert-workflow-hitl.mjs              # 判红/绿（默认）
 *   node scripts/assert-workflow-hitl.mjs --selftest   # 纯内存畸形文本投毒（不碰仓库文件）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const TEMPLATES_TS = path.join(SERVER_ROOT, 'src', 'prompts', 'templates.ts');

/** 曾「零确认语义」的模板：必须直接引常量（W5-3 计划点名清单）。 */
export const MUST_REFERENCE = [
  'mc-crash-triage',
  'mc-localize-mod',
  'mc-publish',
  'mc-bedrock-addon',
  'mc-ci-publish-extra',
];

/**
 * 不引常量、靠「确认语义」字样兜底的模板数上限（棘轮只降）。
 * 2026-09-20 实测历史：45 个模板中 17 个引常量 ⇒ 余下 28 个靠语义字样。
 * 2026-09-20 W5-3② 收敛：把 16 个模板里逐字重复的「清单（人在环：…须用户确认后执行）」抽成
 * `WORKFLOW_HITL_STEPS` 常量（渲染文本逐字不变）⇒ 引常量 33 个 / 兜底 12 个，上限随之下调到 12。
 */
export const NON_CONSTANT_CEILING = 12;

/** 确认语义字样（② 的判据）。 */
const SEMANTIC_RE = /人在环|确认/;

/**
 * 视为「引常量」的引用形态（W5-3②，2026-09-20）：
 * `WORKFLOW_HITL`（整段人在环宣言）与 `WORKFLOW_HITL_STEPS`（16 模板共用的步骤清单措辞，单源去重）。
 * 两者都是单源常量 ⇒ 都算 ①。
 */
const HITL_REFS = ["${WORKFLOW_HITL}", "${WORKFLOW_HITL_STEPS}"];
const refsHitl = (block) => HITL_REFS.some((r) => block.includes(r));

/** 顶层模板块：`\n  "key": {` … 到下一个同形块之前。 */
const BLOCK_RE = /\n {2}"([A-Za-z0-9_-]+)": \{/g;

export function parseBlocks(text) {
  const starts = [];
  BLOCK_RE.lastIndex = 0;
  let m;
  while ((m = BLOCK_RE.exec(text))) starts.push({ key: m[1], at: m.index });
  const blocks = new Map();
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].at : text.length;
    blocks.set(starts[i].key, text.slice(starts[i].at, end));
  }
  return blocks;
}

/** 纯函数：校验模板正文文本。 */
export function validateTemplates(text, opts = {}) {
  const ceiling = opts.ceiling ?? NON_CONSTANT_CEILING;
  const mustRef = opts.mustRef ?? MUST_REFERENCE;
  const problems = [];
  const blocks = parseBlocks(text);
  if (blocks.size === 0) return ['未解析到任何模板块（templates.ts 结构变了？）'];
  const nonConstant = [];
  for (const [key, block] of blocks) {
    if (refsHitl(block)) continue;
    nonConstant.push(key);
    if (!SEMANTIC_RE.test(block)) {
      problems.push(`${key}: 既不引 WORKFLOW_HITL 常量，也无「人在环/确认」字样（无人在环语义的模板不许存在）`);
    }
  }
  for (const key of mustRef) {
    if (!blocks.has(key)) {
      problems.push(`必备模板缺失：${key}`);
      continue;
    }
    if (!blocks.get(key).includes('${WORKFLOW_HITL}')) {
      problems.push(`${key}: 必须直接引 WORKFLOW_HITL 常量（此模板曾零确认语义）`);
    }
  }
  if (nonConstant.length > ceiling) {
    problems.push(
      `不引常量的模板 ${nonConstant.length} 个 > 上限 ${ceiling}（棘轮只降；清单：${nonConstant.join(', ')}）`,
    );
  }
  return problems;
}

const T = (key, body) => `\n  "${key}": {\n    title: "t",\n    body: \`${body}\`,\n  },`;

if (process.argv.includes('--selftest')) {
  const HITL_REF = '${WORKFLOW_HITL}\n1. step';
  const cases = [
    ['正对照：引常量 + 语义字样', `${T('mc-publish', HITL_REF)}${T('mc-other', '【停】须用户确认后再写盘')}`, { mustRef: ['mc-publish'], ceiling: 1 }, 0],
    ['既无常量也无语义字样', `${T('mc-publish', HITL_REF)}${T('mc-bad', '1. 直接跑到底')}`, { mustRef: ['mc-publish'], ceiling: 5 }, 1],
    ['必备模板没引常量', T('mc-publish', '【停】须用户确认'), { mustRef: ['mc-publish'], ceiling: 5 }, 1],
    ['不引常量数超上限', `${T('mc-publish', HITL_REF)}${T('mc-a', '确认')}${T('mc-b', '确认')}`, { mustRef: ['mc-publish'], ceiling: 1 }, 1],
    ['空文本', '', { mustRef: ['mc-publish'], ceiling: 5 }, 1],
  ];
  let missed = 0;
  for (const [name, text, opts, wantProblems] of cases) {
    const got = validateTemplates(text, opts).length;
    const ok = wantProblems === 0 ? got === 0 : got > 0;
    if (!ok) {
      missed++;
      console.error(`  ✗ selftest「${name}」应${wantProblems === 0 ? '绿' : '红'}实${got === 0 ? '绿' : '红'}（problems=${got}）`);
    }
  }
  const realProblems = validateTemplates(fs.readFileSync(TEMPLATES_TS, 'utf8'));
  if (realProblems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实 templates.ts 本应绿，实得 ${realProblems.length} 项`);
    for (const p of realProblems.slice(0, 3)) console.error(`      ${p}`);
  }
  console.log(
    `\nassert-workflow-hitl(selftest): ${missed === 0 ? `OK（${cases.length} 类畸形文本全检出 + 真实模板正对照绿）` : missed + ' 例不符'}`,
  );
  process.exitCode = missed === 0 ? 0 : 1;
} else {
  if (!fs.existsSync(TEMPLATES_TS)) {
    console.error(`assert-workflow-hitl: 找不到 ${TEMPLATES_TS}`);
    process.exit(1);
  }
  const text = fs.readFileSync(TEMPLATES_TS, 'utf8');
  const problems = validateTemplates(text);
  const blocks = parseBlocks(text);
  const nonConstant = [...blocks].filter(([, b]) => !refsHitl(b)).map(([k]) => k);
  if (problems.length > 0) {
    console.error(`assert-workflow-hitl: ${problems.length} 项不通过`);
    for (const p of problems.slice(0, 25)) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  console.log(
    `assert-workflow-hitl: ok（模板 ${blocks.size} 个：引 WORKFLOW_HITL ${blocks.size - nonConstant.length} 个 / ` +
      `语义字样兜底 ${nonConstant.length} 个 ≤ 上限 ${NON_CONSTANT_CEILING}；5 个必备模板均引常量）`,
  );
}
