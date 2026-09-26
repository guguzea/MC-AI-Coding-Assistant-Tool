#!/usr/bin/env node
/**
 * assert-workflow-hitl — 工作流模板「人在环」语义门（W5-3，2026-09-20）。
 *
 * 背景：`get_workflow_template` 是**人在环清单**，不是无人值守流水线。模板措辞散落在
 * `src/prompts/templates.ts` 的 40+ 个 body 里，靠人眼守不住；本门把它变成可机械复核的判据。
 *
 * 判据（每个模板都要满足，二选一）：
 *   ① body 引 `${WORKFLOW_HITL}` 常量（措辞单源）；或
 *   ② body 含「**approval** 语义」字样（见 `SEMANTIC_RE`）。
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
 * 不引常量、靠「approval 语义」字样兜底的模板数上限（棘轮只降）。
 * 2026-09-20 实测历史：45 个模板中 17 个引常量 ⇒ 余下 28 个靠语义字样。
 * 2026-09-20 W5-3② 收敛：把 16 个模板里逐字重复的「清单（人在环：…须用户确认后执行）」抽成
 * `WORKFLOW_HITL_STEPS` 常量（渲染文本逐字不变）⇒ 引常量 33 个 / 兜底 12 个，上限随之下调到 12。
 * 2026-09-25（第 30 轮，审查项 P-3）：判据从裸 `确认` 换成 approval 词表后，兜底 12 个里有 7 个转红
 * （它们的「确认」全是 `1. 确认平台与精确 MC 版本` = *verify*，不是「写盘/跑 Gradle 前停下等用户」的
 * *approval*）⇒ 那 7 个改引 `${WORKFLOW_HITL}`，上限 12 → **5 = 实况数，只降不升**。
 * ⚠️ 余下 5 个（`mc-new-block` / `mc-port-mod` / `mc-gametest` / `mc-setup-env` / `mc-config`）**本就带真条款**
 * （`dryRun`、「提醒用户确认后手动 ./gradlew…；Agent 不代跑 Gradle」这类）——把它们也压到 0 属**可选收敛**、
 * 不是缺陷，且硬改成引常量只会给健康模板加冗余；**禁止**为「0 更好看」去动它们。
 */
export const NON_CONSTANT_CEILING = 5;

/**
 * approval 语义字样（② 的判据）。
 * ⚠️ **刻意不含裸 `确认`**（第 30 轮收紧）：`确认平台与精确 MC 版本` 是「让用户核对信息」的 *verify*，
 * 与「写盘 / 跑 Gradle / 上传前先停下等用户点头」的 *approval* 是两件事；旧判据 `/人在环|确认/` 被前者喂饱，
 * 于是 7 个没有任何 approval 条款的模板一直判绿（台账 `CONTRIBUTING.md` L36）。
 */
const SEMANTIC_RE = /人在环|用户确认|确认后|须经用户|等待用户|不代跑|不得代跑|dryRun|dry-run/;

/**
 * 视为「引常量」的引用形态（W5-3②，2026-09-20）：
 * `WORKFLOW_HITL`（整段人在环宣言）与 `WORKFLOW_HITL_STEPS`（16 模板共用的步骤清单措辞，单源去重）。
 * 两者都是单源常量 ⇒ 都算 ①。
 */
const HITL_REFS = ["${WORKFLOW_HITL}", "${WORKFLOW_HITL_STEPS}"];
const refsHitl = (block) => HITL_REFS.some((r) => block.includes(r));

/** 顶层模板块：`\n  "key": {` … 到下一个同形块之前。 */
const BLOCK_RE = /\n {2}"([A-Za-z0-9_-]+)": \{/g;

/**
 * S16-tail（第 11 轮）：BLOCK_RE 只认恰两空格缩进 —— 模板若被写成 4 空格 / Tab 缩进，
 * 整块会**悄悄逃出判定**（既不数进 nonConstant，也不查语义字样），门恒绿。
 * 每个真模板块必有一行 `title: …`（JS 对象裸键；正文示例 JSON 的 `"title":` 带引号，不误计）。
 * 判据取下界：解析块数 < title 行数 ⇒ 红（多解析不出假想块不算）。
 */
const TITLE_RE = /^\s+title: /gm;

export function countTitleLines(text) {
  return (text.match(TITLE_RE) || []).length;
}

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
  // 采集面塌了 = 恒绿的门，比误报更糟：结构一变（缩进 / 键名 / 模板挪文件）就 0 块，
  // 而 0 块进不了下面任何一条判据 ⇒ 必须显式判红并留可断言的标记串。
  if (blocks.size === 0) {
    return ['COLLECTOR_RETURNED_ZERO: 未解析到任何模板块（templates.ts 结构变了？BLOCK_RE 与写法失步？）'];
  }
  const titleLines = countTitleLines(text);
  if (blocks.size < titleLines) {
    problems.push(
      `块正则只解析到 ${blocks.size} 个模板块，正文有 ${titleLines} 行 title: 属性 ⇒ ${titleLines - blocks.size} 个模板因缩进异常逃出判定（S16-tail：曾恒绿）`,
    );
  }
  const nonConstant = [];
  for (const [key, block] of blocks) {
    if (refsHitl(block)) continue;
    nonConstant.push(key);
    if (!SEMANTIC_RE.test(block)) {
      problems.push(
        `${key}: 既不引 WORKFLOW_HITL 常量，也无 approval 字样（人在环 / 用户确认 / 确认后 / 须经用户 / 等待用户 / 不代跑 / 不得代跑 / dryRun）——只写「确认平台与精确 MC 版本」不算（那是 verify，不是停下等用户点头）`,
      );
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

/**
 * S27（第 13 轮，2026-09-24）：模板正文里被引的**具象**规则 / Skill 路径必须逐个 existsSync 为真。
 *
 * 为什么要这条腿：`get_workflow_template` 的正文是「去读 `fabric/<ver>/.cursor/rules/05-events.mdc:13`」
 * 这类可核对指针；引用一个不存在的档 = 直接把 agent 送去读不到的文件（计划第 4 条点名的首个此类缺陷）。
 * 第 12 轮的同类核查明在 `temp/ralph-20260922/r12b-paths.mjs`（临时脚本，不在门链里 ⇒ 无人复跑即失守），
 * 本轮把**判据**并进门、只留结论在 temp。
 *
 * 采集面自证：面 = `parseBlocks()` 解出的模板块（与 HITL 判定同一批块），条目 = 块内**具象**
 * `<平台>/<版本>/.cursor/{rules,skills}/…` 路径（按块去重）；**不扩进 `data/**`**（语料只读、上游逐字，
 * 也不得由门反查语料）。判据全部取下界地板（只 `<` ⇒ 采集面缩水才红，条目变多永不红），禁止等式棘轮。
 * 三条计数（扫了几件 / 判了几件 / 拒了几件）无条件打印。
 */
const CITED_PATH_RE =
  /(?:forge|neoforge|fabric|quilt|liteloader|rift|modloader|bedrock)\/[0-9][\w.]*\/\.cursor\/(?:rules|skills)\/[A-Za-z0-9._/-]+/g;

/** 地板（实测 as-of 2026-09-24：48 模板 / 22→30+ 条具象引用）：低于即采集面塌了，不是数量契约。 */
export const CITED_BLOCK_FLOOR = 4;
export const CITED_ITEM_FLOOR = 20;

/** 去掉行尾被中文标点/句点吞进来的尾巴（`.md` 后的 `.` 不算路径一部分）。 */
function trimCitedPath(raw) {
  return raw.replace(/[.,;:]+$/g, "");
}

/**
 * 纯函数：从模板块集合里采集具象路径并核存在性。
 * @returns {{problems:string[], scannedBlocks:number, judgedItems:number, rejectedItems:number, citedBlocks:number}}
 */
export function validateCitedPaths(blocks, repoRoot, opts = {}) {
  const blockFloor = opts.blockFloor ?? CITED_BLOCK_FLOOR;
  const itemFloor = opts.itemFloor ?? CITED_ITEM_FLOOR;
  const problems = [];
  const seen = new Set();
  let citedBlocks = 0;
  let judgedItems = 0;
  let rejectedItems = 0;
  for (const [key, block] of blocks) {
    CITED_PATH_RE.lastIndex = 0;
    const raw = [...block.matchAll(CITED_PATH_RE)].map((m) => trimCitedPath(m[0]));
    if (!raw.length) continue;
    citedBlocks++;
    for (const p of new Set(raw)) {
      const gk = `${key}\u0000${p}`;
      if (seen.has(gk)) continue;
      seen.add(gk);
      judgedItems++;
      if (!fs.existsSync(path.join(repoRoot, p))) {
        rejectedItems++;
        problems.push(`${key}: 模板引用的路径不存在 ⇒ ${p}（写成指针前必须 existsSync 为真，或改成「该档实扫无此文件」的边界陈述）`);
      }
    }
  }
  if (blocks.size < blockFloor) {
    problems.push(`采集面塌了：只解析到 ${blocks.size} 个模板块 < 地板 ${blockFloor}（BLOCK_RE 与模板写法失步？）`);
  }
  if (judgedItems < itemFloor) {
    problems.push(`采集面塌了：具象路径引用只判到 ${judgedItems} 条 < 地板 ${itemFloor}（引用格式变了或采集正则退化）`);
  }
  return { problems, scannedBlocks: blocks.size, judgedItems, rejectedItems, citedBlocks };
}

if (process.argv.includes('--selftest')) {
  const HITL_REF = '${WORKFLOW_HITL}\n1. step';
  const APPROVAL = '写完草稿提醒用户确认后手动 ./gradlew build；Agent 不代跑 Gradle';
  /** 第 5 位 wantMarker：要求 problems 里必须出现该子串（采集面塌了这类「红得对不对」的判据）。 */
  const cases = [
    ['正对照：引常量 + approval 字样', `${T('mc-publish', HITL_REF)}${T('mc-other', '【停】须用户确认后再写盘')}`, { mustRef: ['mc-publish'], ceiling: 1 }, 0],
    ['既无常量也无 approval 字样', `${T('mc-publish', HITL_REF)}${T('mc-bad', '1. 直接跑到底')}`, { mustRef: ['mc-publish'], ceiling: 5 }, 1],
    ['必备模板没引常量', T('mc-publish', '【停】须用户确认'), { mustRef: ['mc-publish'], ceiling: 5 }, 1],
    ['不引常量数 6 > 上限 5（ bodies 全带 approval，只可能栽在棘轮腿）',
      Array.from({ length: 6 }, (_, i) => T(`mc-a${i}`, APPROVAL)).join(''), { mustRef: [], ceiling: 5 }, 1],
    ['Tab缩进块逃过块正则（S16-tail）', `${T('mc-publish', HITL_REF)}\n\t"mc-tab": {\n\t\ttitle: "t",\n\t\tbody: \`1. 直接跑到底\`,\n\t},`, { mustRef: ['mc-publish'], ceiling: 5 }, 1],
    // 第 30 轮修的伪守卫：原写法把 IIFE 的布尔塞进元组第 2 位（当成 text），
    // 第 4 位 wantProblems 变 undefined ⇒ 循环对「真文件投毒」的判定**恒真**，投毒结果被丢掉。
    // 现按夹具契约传「投毒后的正文」，并令 ceiling=99 以隔离出 mustRef 腿（不让棘轮腿替它红）。
    ['真文件投毒：把真实 templates.ts 里所有 ${WORKFLOW_HITL} 引用抹掉 ⇒ 5 个必备模板必红',
      (() => {
        const real = fs.readFileSync(TEMPLATES_TS, 'utf8');
        const poisoned = real.split('${WORKFLOW_HITL}').join('');
        if (poisoned === real) throw new Error('投毒未生效：templates.ts 里找不到 ${WORKFLOW_HITL} 引用');
        return poisoned;
      })(), { mustRef: MUST_REFERENCE, ceiling: 99 }, 1],
    ['采集面塌了：parseBlocks 解出 0 块 ⇒ 必须红且带 COLLECTOR_RETURNED_ZERO', '', { mustRef: ['mc-publish'], ceiling: 5 }, 1, 'COLLECTOR_RETURNED_ZERO'],
    // ↓↓ 第 30 轮（P-3）两条：旧判据 `/人在环|确认/` 会放过第一条 ⇒ 它是本次收紧的唯一反证。
    ['投毒：body 只有「1. 确认平台与精确 MC 版本。」⇒ 必红（旧判据放过的那条）',
      T('mc-verify-only', '1. 确认平台与精确 MC 版本。'), { mustRef: [], ceiling: 5 }, 1],
    ['正对照：body 有「须用户确认后执行」⇒ 必绿',
      T('mc-approve', APPROVAL), { mustRef: [], ceiling: 5 }, 0],
  ];
  let missed = 0;
  for (const [name, text, opts, wantProblems, wantMarker] of cases) {
    const probs = validateTemplates(text, opts);
    const got = probs.length;
    let ok = wantProblems === 0 ? got === 0 : got > 0;
    if (ok && wantMarker) ok = probs.some((p) => p.includes(wantMarker));
    if (!ok) {
      missed++;
      console.error(
        `  ✗ selftest「${name}」应${wantProblems === 0 ? '绿' : '红'}${wantMarker ? `且带 ${wantMarker}` : ''}实${got === 0 ? '绿' : '红'}（problems=${got}${got ? ` · ${probs[0].slice(0, 60)}` : ''}）`,
      );
    }
  }
  const realProblems = validateTemplates(fs.readFileSync(TEMPLATES_TS, 'utf8'));
  if (realProblems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实 templates.ts 本应绿，实得 ${realProblems.length} 项`);
    for (const p of realProblems.slice(0, 3)) console.error(`      ${p}`);
  }
  // S27 路径腿夹具（纯内存块 + 真实仓库盘）：1 例必红投毒 + 1 例必绿对照 + 1 例采集面地板。
  const REPO_ROOT = path.resolve(SERVER_ROOT, '..');
  const pathCases = [
    ['路径腿投毒：引用不存在的档（必红）', 'fabric/9.9.99/.cursor/rules/05-events.mdc', { blockFloor: 1, itemFloor: 0 }, true],
    ['路径腿对照：真实存在的规则文件（必绿）', 'fabric/1.21.11/.cursor/rules/05-events.mdc', { blockFloor: 1, itemFloor: 0 }, false],
    ['路径腿地板：判到 1 条 < itemFloor 20（必红）', 'fabric/1.21.11/.cursor/rules/05-events.mdc', { blockFloor: 1 }, true],
  ];
  let pathMissed = 0;
  let pathRed = 0;
  const rp = validateCitedPaths(parseBlocks(fs.readFileSync(TEMPLATES_TS, 'utf8')), REPO_ROOT);
  for (const [name, body, opts, wantRed] of pathCases) {
    const r = validateCitedPaths(parseBlocks(T('mc-fixture', body)), REPO_ROOT, opts);
    const gotRed = r.problems.length > 0;
    if (gotRed !== wantRed) {
      pathMissed++;
      missed++;
      console.error(`  ✗ selftest「${name}」应${wantRed ? '红' : '绿'}实${gotRed ? '红' : '绿'}（problems=${r.problems.length}）`);
    } else if (wantRed) {
      pathRed++;
      console.error(`  （投毒如预期红）${name} ⇒ ${r.problems[0]}`);
    }
  }
  if (rp.problems.length > 0) {
    missed++;
    console.error(`  ✗ selftest 路径腿正对照：真实 templates.ts 本应绿，实得 ${rp.problems.length} 项`);
    for (const p of rp.problems.slice(0, 3)) console.error(`      ${p}`);
  }
  console.log(
    `路径腿采集面：扫 ${rp.scannedBlocks} 个模板块 / 判 ${rp.judgedItems} 条具象路径 / 拒 ${rp.rejectedItems} 条（地板 block≥${CITED_BLOCK_FLOOR}、item≥${CITED_ITEM_FLOOR}）`,
  );
  const pathTotal = pathCases.length + 1;
  console.log(
    `\nassert-workflow-hitl(selftest): ${missed === 0 ? `OK（${cases.length} 类畸形文本全检出 + 真实模板正对照绿 + 路径腿 ${pathTotal}/${pathTotal} 通过，含红投毒 ${pathRed} 例）` : missed + ' 例不符'}`,
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
  const paths = validateCitedPaths(blocks, path.resolve(SERVER_ROOT, '..'));
  const nonConstant = [...blocks].filter(([, b]) => !refsHitl(b)).map(([k]) => k);
  // 采集面计数无条件打印（先打再判红），否则红的时候看不到「到底扫到了什么」。
  console.log(
    `assert-workflow-hitl(路径腿): 扫 ${paths.scannedBlocks} 个模板块（其中 ${paths.citedBlocks} 块带具象路径引用）/ 判 ${paths.judgedItems} 条 / 拒 ${paths.rejectedItems} 条；地板 block≥${CITED_BLOCK_FLOOR}、item≥${CITED_ITEM_FLOOR}（只用小于号判红，非数量契约）`,
  );
  const all = problems.concat(paths.problems);
  if (all.length > 0) {
    console.error(`assert-workflow-hitl: ${all.length} 项不通过`);
    for (const p of all.slice(0, 25)) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  console.log(
    `assert-workflow-hitl: ok（模板 ${blocks.size} 个：引 WORKFLOW_HITL ${blocks.size - nonConstant.length} 个 / ` +
      `approval 字样兜底 ${nonConstant.length} 个 ≤ 上限 ${NON_CONSTANT_CEILING}（清单：${nonConstant.join(', ') || '无'}）；` +
      `${MUST_REFERENCE.length} 个必备模板均引常量；` +
      `模板引用的 ${paths.judgedItems} 条具象规则/Skill 路径全部 existsSync 为真）`,
  );
}
