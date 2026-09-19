#!/usr/bin/env node
/**
 * assert-rules-match-tool.mjs — 「规则文件自述的检索行为」vs「CLI 实测载荷」一致性门（quilt 侧）
 *
 * 立门缘由（S30 / F81·F82·F115·F78·F88）
 *   quilt 规则树里长期写着「本档 `search_docs(platform=quilt)` 返回 `PLATFORM_DATA_MISSING`、
 *   不会回退 Fabric」——那是**没有实测支撑的自我设禁**：agent 读到就放弃检索、凭记忆作答。
 *   2026-09-13 用 `MC_SKILL_DATA=data node mcp-server/dist/cli.js search_docs --platform=quilt …`
 *   逐档实跑（全量载荷见 `temp/PLAN-2026-09-08-销账-S30.md` §0.1–§0.3）：10 档 quilt 里
 *   **没有任何一条路径**返回 `PLATFORM_DATA_MISSING`。真实形态只有三种：
 *     A 有 quilt-docs 语料的档
 *       → ok:true + fallback:null + resolvedVersion:<本版> + semantic:true + total:N
 *     B 有包但本版缺 quilt-docs 页的档（1.21.3 / 1.21.4 / 1.21.8 / 1.21.10）
 *       → ok:true + fallback:"quilt" + resolvedVersion:<同线已建档>（1.21.1 / 1.21.11）
 *         或 ok:true + fallback:"fabric" + sourcePlatform:"fabric"（同版 Fabric 正文）
 *     C 本仓完全无语料的空洞档（如 1.21.2）
 *       → ok:false + VERSION_NOT_FOUND + fallback:null（载荷**无** total 键）
 *   ① 路径（fallback:"quilt"）的顶层键**同时**含 `source_version` 与 `resolvedVersion`（同值 = 同线源版），
 *   另有 `requestedVersion` / `query`；② 路径（fallback:"fabric"）反过来无此键，只有 `sourcePlatform`。
 *   键位由 `node mcp-server/dist/cli.js search_docs --platform=quilt --version=1.21.4` 两条 query 实跑取得，
 *   出处 `mcp-server/src/docs-platform/quilt-search.ts:183,200,343`。
 *   `total:0` / `found:false` 只证明本仓索引未覆盖，禁止写成「上游没有该 API」。
 *
 * 扫描面：quilt/<ver>/{.cursor/rules/**,.cursor/agent/**,AGENTS.md,pack.meta.json,knowledge/**}
 *   只读 `.cursor` 源树；7 个投影目录（.claude/.continue/.trae/.opencode/.agents/.zcode/.pi）
 *   由 scripts/sync-skills.ps1 生成，投影滞后属同步问题不是内容错误 ⇒ 一律排除。
 *
 * 假绿防护（三条，任一不满足即红）
 *   ① 逐档枚举 EXPECTED_PACKS，缺档目录 / 缺必查文件即红；
 *   ② 打印并下限校验「扫描文件数 / 断言条数」，真根模式下少一个都不算过；
 *   ③ 每条禁用形态必须咬得住内置 KNOWN_BAD 样本（= 本仓已删掉的原句）；
 *      正则被掏空 / 改软 ⇒ 判「规则失效」直接红。
 *
 * 用法
 *   node mcp-server/scripts/assert-rules-match-tool.mjs
 *   MC_SKILL_RULES_MATCH_TEST_ROOT=<假根> node mcp-server/scripts/assert-rules-match-tool.mjs
 *     假根模式＝投毒自证专用：A 层（逐文件内容 + 该文件所属档的实测口径）照咬，
 *     B 层（全仓枚举 / 计数下限 / 语料页存在性）跳过。
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const TEST_ROOT = process.env.MC_SKILL_RULES_MATCH_TEST_ROOT
  ? path.resolve(process.env.MC_SKILL_RULES_MATCH_TEST_ROOT)
  : null;
const ROOT = TEST_ROOT || path.resolve(HERE, '..', '..');

/** 本版无 quilt-docs 页 ⇒ 实测两态；值 = 实跑看到的同线语料来源版 */
const GAP_PACKS = { '1.21.3': '1.21.1', '1.21.4': '1.21.1', '1.21.8': '1.21.11', '1.21.10': '1.21.11' };
/** 本版有 quilt-docs 语料 ⇒ 实测 fallback:null */
const CORPUS_PACKS = ['1.18.2', '1.19.4', '1.20.1', '1.20.4', '1.21.1', '1.21.11'];
const EXPECTED_PACKS = [...CORPUS_PACKS, ...Object.keys(GAP_PACKS)];
const F82_PACKS = ['1.18.2', '1.19.4', '1.20.1'];
const F115_PACKS = ['1.21.3', '1.21.4'];
const F115_CORPUS_PAGE = 'data/quilt_1.21.1/quilt-docs/1.21.1/processed/qsl-verified.md';
const GAP_RULE_FILES = ['01-registry', '05-events', '06-networking'];
const MIN_FILES = 40;
const MIN_ASSERTIONS = 120;

const PROJECTION = /(^|[\\/])\.(claude|continue|trae|opencode|agents|zcode|pi)([\\/]|$)/;
const FACE = /(^|[\\/])(\.cursor[\\/](rules|agent)[\\/]|AGENTS\.md$|pack\.meta\.json$|knowledge[\\/])/;

const failures = [];
let scanned = 0;
let assertions = 0;
const fail = (m) => { failures.push(m); };
const lineOf = (text, idx) => text.slice(0, idx).split(/\r?\n/).length;

/** 禁用形态：命中即红 */
const BANNED = [
  {
    id: 'no-fabric-fallback-claim',
    re: /(?:不|无|绝|严禁|禁止)[^。\n]{0,6}回退[^。\n]{0,6}(?:Fabric|fabric|同版)/,
    why: '实测 B 档检索确有 fallback:"fabric" + sourcePlatform:"fabric" 的回退面；「不回退 Fabric」是无据自设禁',
  },
  {
    id: 'source-version-absence-claim',
    re: /没有\s*\*\*\s*`?source_version|载荷[^\n。]{0,10}没有\s*`?source_version/,
    why: '实测 fallback:"quilt" 路径的顶层键里就有 source_version（quilt-search.ts:183/200/343），与 resolvedVersion 并存 ⇒ 写「载荷没有 source_version」是错的',
  },
  {
    id: 'modid-hyphen-ban',
    re: /(?:全小写|小写)[^。\n]{0,6}无\s*[`'"]?-[`'"]?/,
    why: '根 AGENTS.md 口径：Fabric/Quilt mod id 允许连字符（官方 example-mod）⇒ 不得写「全小写无 -」',
  },
  {
    id: 'upstream-absence-from-index-gap',
    re: /(?:上游|官方)[^。\n]{0,8}(?:没有|不存在|未发布)[^。\n]{0,10}(?:QSL|QFAPI)/,
    why: 'total:0 / found:false 只证明本仓索引未覆盖，禁止写成「上游没有 QSL/QFAPI」',
  },
];

/** 同行配对：出现 token 的行必须同时给出 must */
const PAIRS = [
  {
    id: 'source-version-pair',
    token: /source_version/,
    must: /resolvedVersion/,
    why: '提到 source_version 就必须同点正确键 resolvedVersion，防读者当它是载荷字段',
  },
  {
    id: 'hyphen-pair',
    token: /连字符/,
    must: /允许连字符/,
    why: 'quilt 侧只允许「允许连字符」这一种口径',
  },
];

/** 已被本仓删除的错误原句：每条禁用形态至少要咬住其中一条，否则说明规则失效 */
const KNOWN_BAD = {
  'no-fabric-fallback-claim': [
    '不清楚方法名 → `search_docs({platform:"quilt"})`；无独立树时 QSL 查询会 `PLATFORM_DATA_MISSING`，**不会**回退 Fabric Registry 页',
    'search_docs(platform=quilt) 对 QSL 查询返回 PLATFORM_DATA_MISSING（不回退 Fabric）',
  ],
  'source-version-absence-claim': [
    // 2026-09-13 一轮「更正」写出的新错句（12 个 quilt 源稿 + 本门旧版），2026-09-14 CLI + 源码双证推翻后删掉：
    '载荷里**没有** `source_version` 这个键，`source_version=1.21.1` 只是 `warning` 文本内的写法。',
  ],
  'modid-hyphen-ban': [
    '- 元数据：`src/main/resources/quilt.mod.json`，id 在 `quilt_loader.id`，全小写无 `-`',
  ],
  'upstream-absence-from-index-gap': [
    '上游没有 QSL 构件，所以检索必然空返回',
    '官方不存在 QFAPI 正式版 ⇒ 本档不写 QSL',
  ],
  'pdm-as-tool-behavior': [
    '无独立树时 QSL 查询会 `PLATFORM_DATA_MISSING`，**不会**回退 Fabric Registry 页',
    'search_docs(platform=quilt) 对 QSL 查询返回 PLATFORM_DATA_MISSING（不回退 Fabric）',
  ],
};

const PDM_NEG = /(不会|不返回|不存在|均不|都不|没有|并非|不是|不属于)/;
const PDM_TOKEN = 'PLATFORM_DATA_MISSING';

/** 返回该文本里「把 PLATFORM_DATA_MISSING 当工具行为陈述」的出现位置 */
function pdmViolations(text) {
  const bad = [];
  let i = -1;
  while ((i = text.indexOf(PDM_TOKEN, i + 1)) >= 0) {
    assertions++;
    const lineStart = text.lastIndexOf('\n', i) + 1;
    const before = text.slice(Math.max(lineStart, i - 40), i);
    if (!PDM_NEG.test(before)) bad.push(i);
  }
  return bad;
}

function walk(dir, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!PROJECTION.test(p)) walk(p, out);
      continue;
    }
    if (!/\.(mdc|md|json)$/.test(e.name)) continue;
    out.push(p);
  }
}

const QUILT = path.join(ROOT, 'quilt');
if (!existsSync(QUILT)) {
  console.error(`✗ assert-rules-match-tool: 扫描面不存在 —— ${QUILT}`);
  process.exit(1);
}

const packsPresent = readdirSync(QUILT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d+\.\d+/.test(d.name))
  .map((d) => d.name);

const entries = [];
for (const v of packsPresent) {
  const files = [];
  walk(path.join(QUILT, v), files);
  for (const abs of files) {
    const rel = path.relative(QUILT, abs).split(path.sep).join('/');
    if (!FACE.test('/' + rel)) continue;
    entries.push({ pack: v, rel: `quilt/${rel}`, inPack: rel.split('/').slice(1).join('/'), abs });
  }
}

for (const ent of entries) {
  let text;
  try {
    text = readFileSync(ent.abs, 'utf8').replace(/^\uFEFF/, '');
  } catch (e) {
    fail(`${ent.rel}: 读取失败 ${e.message}`);
    continue;
  }
  scanned++;
  const v = ent.pack;

  for (const b of BANNED) {
    assertions++;
    const re = new RegExp(b.re.source, b.re.flags.includes('g') ? b.re.flags : b.re.flags + 'g');
    let m;
    while ((m = re.exec(text)) !== null) {
      fail(`${ent.rel}:${lineOf(text, m.index)}: [${b.id}] ${b.why} —— 实跑原文「${m[0].slice(0, 60)}」`);
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }

  for (const badIdx of pdmViolations(text)) {
    fail(`${ent.rel}:${lineOf(text, badIdx)}: [pdm-as-tool-behavior] 把 ${PDM_TOKEN} 写成本档检索行为——quilt 实测无此路径（A 档 fallback:null / B 档 fallback:"quilt"|"fabric" / C 档 ok:false + VERSION_NOT_FOUND）`);
  }

  for (const pr of PAIRS) {
    for (const line of text.split(/\r?\n/)) {
      if (!pr.token.test(line)) continue;
      assertions++;
      if (!pr.must.test(line)) fail(`${ent.rel}: [${pr.id}] ${pr.why} —— 行「${line.trim().slice(0, 60)}」`);
    }
  }

  const twoState = (label) => {
    const pinned = GAP_PACKS[v].split('.').join('\\.');
    has(text, /fallback["'”]?\s*[:=]\s*["'”]?quilt/, `${label}：① 同线语料态 fallback:"quilt"`);
    has(text, /fallback["'”]?\s*[:=]\s*["'”]?fabric/, `${label}：② 跨平台态 fallback:"fabric" + sourcePlatform:"fabric"`);
    has(text, /resolvedVersion/, `${label}：载荷键 resolvedVersion`);
    has(text, new RegExp(pinned), `${label}：同线语料来源版 ${GAP_PACKS[v]} 必须点名`);
    has(text, new RegExp(PDM_TOKEN), `${label}：必须写出 ${PDM_TOKEN} 并明言「不返回」`);
  };

  if (GAP_PACKS[v]) {
    const rule = ent.rel.match(/\.cursor\/rules\/(0\d-[a-z-]+)\.mdc$/);
    if (rule && GAP_RULE_FILES.includes(rule[1])) {
      twoState(`B 档 ${v} ${rule[1]}`);
      has(text, /source_version/, `${v} ${rule[1]}：① 路径的 source_version 顶层键必须点名（与 resolvedVersion 并存，值 = ${GAP_PACKS[v]}）`);
      if (F115_PACKS.includes(v)) {
        has(text, /qsl-verified/, `F115：${v} ${rule[1]} 须点名改口命中的 qsl-verified 语料页`);
        has(text, /上游原样|不改写|只当背景/, `F115：${v} ${rule[1]} 须声明语料正文受「上游原样」保护、只当背景`);
      }
    }
    if (/pack\.meta\.json$/.test(ent.rel)) {
      twoState(`B 档 ${v} pack.meta`);
      has(text, /VERSION_NOT_FOUND/, `B 档 ${v} pack.meta：须与空洞档的 VERSION_NOT_FOUND 划界`);
      has(text, /本仓|索引未覆盖|不得写成上游没有/, `B 档 ${v} pack.meta：须写明 0 命中只证明本仓索引未覆盖`);
    }
  } else if (CORPUS_PACKS.includes(v)) {
    if (/\.cursor\/rules\/05-events\.mdc$/.test(ent.rel)) {
      has(text, /fallback["'”]?\s*[:=]\s*["'”]?null/, `A 档 ${v} 05-events：本档实测 fallback:null`);
      has(text, new RegExp('不存在[^`\\n]{0,8}`?' + PDM_TOKEN), `A 档 ${v} 05-events：须明言 quilt 检索不存在 ${PDM_TOKEN} 路径`);
      has(text, /VERSION_NOT_FOUND/, `A 档 ${v} 05-events：须给出空洞档 VERSION_NOT_FOUND 作对照`);
      has(text, /resolvedVersion/, `A 档 ${v} 05-events：载荷键名 resolvedVersion`);
    }
  }

  if (/\.cursor\/rules\/00-project-setup\.mdc$/.test(ent.rel)) {
    has(text, /允许连字符/, `${v} 00-project-setup：mod id 连字符口径须与根 AGENTS.md 一致`);
  }
  if (F82_PACKS.includes(v) && ent.inPack === 'AGENTS.md') {
    has(text, /不可直接编译/, `F82 ${v} AGENTS：QSL 只能当方向、不可直接编译`);
    has(text, /build\.gradle:17/, `F82 ${v} AGENTS：须点出 scaffold/build.gradle:17 只有 quilt-loader`);
    has(text, /无任何 QSL 模块/, `F82 ${v} AGENTS：须写明依赖块内无任何 QSL 模块`);
  }
  if (v === '1.21.1' && (ent.inPack === 'knowledge/common/qsl-verified.md' || ent.inPack === '.cursor/rules/01-registry.mdc')) {
    has(text, new RegExp(F115_CORPUS_PAGE.replace(/\./g, '\\.').replace(/\//g, '\\/')), `F115：须点名派生语料页 ${F115_CORPUS_PAGE}`);
    has(text, /上游原样|不改写/, `F115：须写明语料正文不改写、编辑真值在源稿（2026-09-19 路线 A 后副本已与源稿同步）`);
  }
}

function has(text, re, why) {
  assertions++;
  if (!re.test(text)) fail(`缺失口径：${why}（/${re.source}/）`);
}

/* ---- 假绿防护 ①：逐档枚举（真根模式）---- */
if (!TEST_ROOT) {
  for (const v of EXPECTED_PACKS) {
    if (!packsPresent.includes(v)) fail(`[pack-missing] quilt/${v}/ 不在盘上 —— 本门以 10 档实跑表为基准，缺档即视为扫描面塌缩`);
  }
  for (const v of packsPresent) {
    const need = ['.cursor/rules/00-project-setup.mdc'];
    if (GAP_PACKS[v]) need.push(...GAP_RULE_FILES.map((f) => `.cursor/rules/${f}.mdc`), 'pack.meta.json');
    else need.push('.cursor/rules/05-events.mdc');
    for (const relNeed of need) {
      assertions++;
      if (!entries.some((e) => e.pack === v && e.rel.endsWith(relNeed))) {
        fail(`[required-file] quilt/${v}/${relNeed} 缺失或未进入扫描面 —— 口径文件被删也算假绿`);
      }
    }
  }
  const hasDocs = (v) => existsSync(path.join(ROOT, 'data', `quilt_${v}`, 'quilt-docs'));
  for (const [v, pinned] of Object.entries(GAP_PACKS)) {
    assertions++;
    if (hasDocs(v)) fail(`[corpus-drift] data/quilt_${v}/quilt-docs 已存在 —— 本门里的「B 档两态」是 2026-09-13 在缺语料前提下实跑的，语料补齐后必须重跑 CLI 并改口径`);
    assertions++;
    if (!hasDocs(pinned)) fail(`[pinned-source] 声明的同线语料源 data/quilt_${pinned}/quilt-docs 不存在 —— ① 号回退态（fallback:"quilt"）已失效`);
  }
  for (const v of CORPUS_PACKS) {
    assertions++;
    if (!hasDocs(v)) fail(`[corpus-drift] A 档 data/quilt_${v}/quilt-docs 不在盘上 —— 本档实测口径写的是 fallback:null + total:N，语料被删则该档退化成 B/C 档`);
  }
  assertions++;
  if (!existsSync(path.join(ROOT, F115_CORPUS_PAGE))) {
    fail(`[f115-corpus] F115 警示指向的语料页 ${F115_CORPUS_PAGE} 不存在 —— 警示已成悬空引用`);
  }
  assertions++;
  if (scanned < MIN_FILES) fail(`[false-green] 只扫到 ${scanned} 个 quilt 源文件（< ${MIN_FILES}）—— 扫描面塌缩，不予放行`);
  assertions++;
  if (assertions < MIN_ASSERTIONS) fail(`[false-green] 断言只有 ${assertions} 条（< ${MIN_ASSERTIONS}）—— 规则被掏空，不予放行`);
}

/* ---- 假绿防护 ③：禁用形态的活性自证（假根模式也跑）---- */
for (const b of BANNED) {
  const samples = KNOWN_BAD[b.id] || [];
  assertions++;
  if (!samples.length) fail(`[liveness] ${b.id} 没有 KNOWN_BAD 样本 —— 无从证明它会失败`);
  else if (!samples.some((s) => b.re.test(s))) fail(`[liveness] ${b.id} 的正则咬不到任何已删原句 —— 规则失效（假绿风险）`);
}
{
  assertions++;
  const live = (KNOWN_BAD['pdm-as-tool-behavior'] || []).some((s) => pdmViolations(s).length > 0);
  if (!live) fail('[liveness] pdm-as-tool-behavior 咬不到已删原句 —— 否定语境判据失效（假绿风险）');
  for (const pr of PAIRS) {
    assertions++;
    const sample = pr.id === 'source-version-pair'
      ? '载荷 `source_version:"1.21.1"` 表示命中同线语料'
      : '- 元数据：id 在 `quilt_loader.id`，禁止使用连字符';
    if (!pr.token.test(sample) || pr.must.test(sample)) fail(`[liveness] ${pr.id} 的配对判据对反例不敏感 —— 假绿风险`);
  }
}

if (failures.length) {
  console.error(`✗ assert-rules-match-tool: ${failures.length} 条规则自述与 CLI 实测不符（扫描 ${scanned} 个文件 / ${assertions} 条断言${TEST_ROOT ? ' / 假根模式' : ''}）`);
  for (const f of failures.slice(0, 60)) console.error(`  - ${f}`);
  if (failures.length > 60) console.error(`  …另 ${failures.length - 60} 条`);
  console.error(`  实测基准：2026-09-13 dist/cli.js search_docs --platform=quilt 逐档实跑（temp/PLAN-2026-09-08-销账-S30.md §0.1–§0.3）`);
  process.exit(1);
}

console.log(`✓ assert-rules-match-tool ok：${scanned} 个 quilt 源文件 / ${assertions} 条断言 / ${packsPresent.length} 档 quilt（A 档 fallback:null、B 档 fallback:"quilt"|"fabric"、C 档 VERSION_NOT_FOUND）三态口径与 2026-09-13 实跑一致${TEST_ROOT ? '（假根模式：仅 A 层）' : ''}`);
