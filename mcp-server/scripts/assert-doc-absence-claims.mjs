#!/usr/bin/env node
/**
 * assert-doc-absence-claims — 「文档缺页断言 vs 检索实况」一致性门（story S5 / 第 5c 轮）。
 *
 * 钉的性质：**某档的正文 / 档内总纲 / skill 声称「本仓没有该文档页」「该页 DOC_NOT_FOUND」
 * 或「该页没写明某个本档事件名」，而检索侧（同一份已入库语料）实测能取到该页 / 该名字逐字存在
 * ⇒ 断言与实况互斥，判红并点名两侧。**
 * 为什么值得单独钉（本轮病灶形状，且已复发一次）：`neoforge/1.20.6` 与 `1.20.4` 的
 * `06-networking.mdc` 早在 2026-09-13 / 09-19 已把「无 payload 页」的前提改对，
 * 但同树的 `AGENTS.md:16/:23` 与 `.cursor/skills/mc-networking/SKILL.md:16` 仍留着旧断言
 * ⇒ 规则与总纲/skill 在同档内互斥（现门全部抓不到：它们只看代码形状，不看「文档存在性声称」）。
 *
 * ── 覆盖面（诚实标注，禁止读成「全面检查」）────────────────────────────────
 *   本门是**表驱动的回归守卫**：只钉 `CLAIMS` 里逐条登记过的 (断言行 ↔ 被声称缺失的页/名字) 对。
 *   新缺陷要靠**人工新增登记**才会红；表外的档 / 表外的对**不判**。⇒ 它是回归守卫，**不是万能检测器**。
 *   为什么必须自带表（R60③ 教训，同 `assert-rule-ban-vs-example.mjs:16-20`）：「本档没有该页」这类
 *   自然语言声称与它针对的语料事实之间**没有可机读的绑定线索**，且同一字符串既出现在真声称行里、
 *   也出现在「旧稿…已作废」的**更正引文**行里（实测 `neoforge/1.20.6/.cursor/rules/06-networking.mdc:9`
 *   与 `neoforge/1.20.4/.cursor/rules/06-networking.mdc:3` 就是后者）⇒ 任何「grep DOC_NOT_FOUND 归零」
 *   式验收必然把更正行误判为红。本门因此按**声称式**（行级 PAGE_RE ∧ ¬CITE_RE）判定，并按行分桶。
 *
 * 判据（四条，全部行级）：
 *   ① 锚点行 = `anchor.file` 内先精确取 `anchor.line`、失配再按半径 ±8 外扩找 `anchor.hint`
 *      （hint 是「改准后仍会保留」的特征串，不是被禁的那句话）。找不到 ⇒ 该条 `lost`（计入地板）。
 *   ② 声称式：mode='page' 要求该行匹配 `PAGE_RE`；mode='term' 要求该行匹配 `BAN_RE` 且匹配 `termRe`
 *      （= 该行在说「这个本档事件名不属于本档 / 该页没写明它」）。
 *      同一行若含 `CITE_RE`（更正/旧稿/原先/作废/过期前提…）⇒ 分桶 `citation`，**不判红**（反证陷阱腿）。
 *   ③ 检索侧（本门**不 spawn CLI**，直接只读 `data/<platform>_<ver>/**` 的 `index-l0.json` +
 *      `processed/<页正文>.md`；口径对应见 `retrieve()` 注释与 `EVIDENCE` 表）。三态：
 *        `found`     —— 该页 id 在本档 index 里且 `entry.version === 请求版本`（= 实测 `ok:true` +
 *                       该 id 在命中里 + `versionFallback:false`，即不是邻近版顶上）
 *        `notfound`  —— index 无该 id ⇒ 该条 `unjudged`（**禁止**读成「声称成立」）
 *        `unjudged`  —— index 文件不在 / 页正文文件缺失 ⇒ 无法判，**一律不判红**，只进未判定计数
 *      term 腿三态：正文逐字含该名 = `verbatim true`；读到正文且确认没有 = `verbatim false`；
 *      正文读不到 = 无该字段 = `未判定`（与本仓 `verbatim` 位同口径，见根 AGENTS.md §工具边界）。
 *   ④ 声称活 + 检索 `found` / `verbatim true` ⇒ 红，同时点名断言侧 `file:line` 与实测侧证据。
 *
 * R47 采集面地板（形状照抄 `assert-rule-ban-vs-example.mjs:220-232`）：
 *   采集为 0 ⇒ `[FLOOR-COLLECTOR]` 红（明写「这是采集器失效，不是代码干净」）；
 *   实扫**低于**地板 ⇒ `[FLOOR-LOW]` 红；**地板是下界 `<`，不是等式**（正常新增只会抬高计数）；
 *   汇总行**无条件**打印「扫文件 / 判条目 / 未判定 / 引用 / 拒 / 采集面 / 地板」。
 *
 * 用法：
 *   node scripts/assert-doc-absence-claims.mjs                # 判红/绿（单次 <2000ms：只读 2 份 index + 2 份正文，不 spawn 子进程）
 *   node scripts/assert-doc-absence-claims.mjs --selftest      # 纯内存投毒（不落盘、不读语料）
 *   MC_SKILL_DAC_GATE_INFO=1 node scripts/assert-doc-absence-claims.mjs   # 打印每条分桶与检索证据
 *   MC_SKILL_DAC_TEST_ROOT=<假根> node scripts/assert-doc-absence-claims.mjs  # 换根（投毒用）
 *
 * 实测等价性（本轮 2026-09-23 用真 CLI 逐条复核，载荷留在 `temp/ralph-20260922/_5c-cli-*.log`）：
 *   `search_neoforge_docs --version=1.20.6 --query=networking/payload` → ok:true / total:10 /
 *   results[0].id=`networking/payload` / versionFallback:false / resolvedVersion=1.20.6；
 *   `--query=RegisterPayloadHandlersEvent` @1.20.6 → verbatim_summary{judged:20,hits:2} 且
 *   results[0].verbatim=**true**；@1.20.4 → hits:0 且 results[0].verbatim=**false**；
 *   单数 `RegisterPayloadHandlerEvent` 恰好相反（@1.20.4 true / @1.20.6 false）⇒ R39 事件名互斥。
 *   ⚠️ neoforge 载荷**没有** `fallback` / `sourcePlatform` / `source_version` 三键（那是 quilt 专有，
 *   本轮逐键确认缺席）⇒ 本门判据只看实测到的字段。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');
const TEST_ROOT = process.env.MC_SKILL_DAC_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const DATA = process.env.MC_SKILL_DATA ? path.resolve(process.env.MC_SKILL_DATA) : path.join(ROOT, 'data');
const INFO = process.env.MC_SKILL_DAC_GATE_INFO === '1';
const NL = String.fromCharCode(10);

/** 声称「本仓/本档没有该文档页」的行级特征（真声称与引用旧稿共用，靠 CITE_RE 分桶）。 */
export const PAGE_RE = /无已核实[^。|]{0,14}页|没有[^。|]{0,8}页|页为\s*`?DOC_NOT_FOUND|`?DOC_NOT_FOUND`?[（(]?|页不存在|无\s*`?networking\/payload|查不到该页/;
/** 引用式提及（更正叙述 / 旧稿引文 / 已作废前提）：含这些词的行**不算声称**。 */
export const CITE_RE = /更正|旧稿|原先|作废|过期前提|已改|反证|该前提|是错误|失实/;
/** 声称「这个事件名不是本档的 / 该页没写明它」。 */
export const BAN_RE = /禁止抄|不要抄|不得抄|别抄|禁止把|不要把|不是本档|当本档|除非该页写明|页里没有|没写明|不得输出|禁止输出/;

/** 判据正则集中一处，好让 --selftest 能单独把一条腿改瞎（ST4c 证明它们不是装饰）。 */
export const RES = { page: PAGE_RE, cite: CITE_RE, ban: BAN_RE };

/**
 * 登记表。字段：
 *   kind: 'page'（声称缺页）| 'term'（声称某事件名不属本档 / 该页没写明）
 *   anchor: { file, line, hint } —— hint 必须在「改准后」仍留在该行（见每条 fix 说明）
 *   page: 被声称缺失的页 id；term/termRe: kind='term' 时是本档事件名与其在行内的写法
 *   want: 本条**实测到**的期望（found / verbatim true|false），写死是故意的：语料被动过就会红
 */
export const CLAIMS = [
  {
    id: 'neoforge-1.20.6-agents-net-row',
    pack: 'neoforge/1.20.6',
    kind: 'term',
    platform: 'neoforge',
    version: '1.20.6',
    page: 'networking/payload',
    term: 'RegisterPayloadHandlersEvent',
    termRe: /RegisterPayloadHandlersEvent|复数 Handlers/,
    anchor: { file: 'neoforge/1.20.6/AGENTS.md', line: 16, hint: 'networking 页 Payload' },
    want: { verbatim: true, indexIds: ['networking/payload'] },
    why: '该行称「不要抄 1.21.1 复数 Handlers 除非该页写明」，而 1.20.6 该页正文逐字用的**就是**复数（实测 verbatim:true / hits:2）⇒ 它禁止的正是本版唯一实名。出处：`temp/ralph-20260922/_5c-cli-plural-1.20.6.log`、`neoforge/1.20.6/.cursor/rules/06-networking.mdc:7`',
  },
  {
    id: 'neoforge-1.20.6-agents-payload-page',
    pack: 'neoforge/1.20.6',
    kind: 'page',
    platform: 'neoforge',
    version: '1.20.6',
    page: 'networking/payload',
    anchor: { file: 'neoforge/1.20.6/AGENTS.md', line: 23, hint: 'payload' },
    want: { found: true, indexIds: ['networking/payload'] },
    why: '该行称「本档无已核实 payload 页」，实测 `search_neoforge_docs version=1.20.6 query=networking/payload` → `ok:true` / `total:10` / 首选 id `networking/payload` / `versionFallback:false`（不是邻版顶上）。出处：`temp/ralph-20260922/_5c-cli-page-1.20.6.log`',
  },
  {
    id: 'neoforge-1.20.6-agents-plural-term',
    pack: 'neoforge/1.20.6',
    kind: 'term',
    platform: 'neoforge',
    version: '1.20.6',
    page: 'networking/payload',
    term: 'RegisterPayloadHandlersEvent',
    termRe: /RegisterPayloadHandlersEvent/,
    anchor: { file: 'neoforge/1.20.6/AGENTS.md', line: 23, hint: 'RegisterPayloadHandlersEvent' },
    want: { verbatim: true, indexIds: ['networking/payload'] },
    why: '同一行的「禁止抄 … 复数 `RegisterPayloadHandlersEvent`」与本页逐字实况相反（verbatim:true，正文出现 3 次）。出处：`neoforge/1.20.6/.cursor/rules/06-networking.mdc:7`',
  },
  {
    id: 'neoforge-1.20.4-skill-docnotfound',
    pack: 'neoforge/1.20.4',
    kind: 'page',
    platform: 'neoforge',
    version: '1.20.4',
    page: 'networking/payload',
    anchor: { file: 'neoforge/1.20.4/.cursor/skills/mc-networking/SKILL.md', line: 16, hint: 'networking/payload' },
    want: { found: true, indexIds: ['networking/payload'] },
    why: '该行称「本库 `search_neoforge_docs` 的 `networking/payload` 页为 `DOC_NOT_FOUND`」，实测 `version=1.20.4` 同形查询 `ok:true` / `total:10` / 首选 id `networking/payload` / `versionFallback:false`。出处：`temp/ralph-20260922/_5c-cli-page-1.20.4.log`、`neoforge/1.20.4/.cursor/rules/06-networking.mdc:3`',
  },
  {
    id: 'neoforge-1.20.4-skill-plural-term',
    pack: 'neoforge/1.20.4',
    kind: 'term',
    platform: 'neoforge',
    version: '1.20.4',
    page: 'networking/payload',
    term: 'RegisterPayloadHandlersEvent',
    termRe: /RegisterPayloadHandlersEvent|复数 Handlers/,
    anchor: { file: 'neoforge/1.20.4/.cursor/skills/mc-networking/SKILL.md', line: 46, hint: 'RegisterPayloadHandlersEvent' },
    want: { verbatim: false, indexIds: ['networking/payload'] },
    why: 'R39 正例腿：1.20.4 该页正文逐字用**单数** `RegisterPayloadHandlerEvent`（verbatim:true），复数 verbatim:false ⇒ 该行「把 1.21 的复数当本档」的禁令与实况**一致**，本门必须判绿（证明表内不因「有禁令字样」就自我开火）。出处：`temp/ralph-20260922/_5c-cli-plural-1.20.4.log` + `_5c-cli-singular-1.20.4.log`',
  },
  {
    id: 'neoforge-1.20.6-rule-correction-cite',
    pack: 'neoforge/1.20.6',
    kind: 'page',
    platform: 'neoforge',
    version: '1.20.6',
    page: 'networking/payload',
    anchor: { file: 'neoforge/1.20.6/.cursor/rules/06-networking.mdc', line: 9, hint: '本档没有 payload 页' },
    want: { found: true, indexIds: ['networking/payload'] },
    why: '反证陷阱腿：这条已改对的**更正行**里逐字引用了旧断言「本档没有 payload 页、返回 `DOC_NOT_FOUND`」——它含 PAGE_RE 且检索侧确实 found，只有 CITE_RE（「更正」）能把它与真声称分开 ⇒ 用它钉住「验收判据不能是 grep DOC_NOT_FOUND 归零」。出处：`neoforge/1.20.6/.cursor/rules/06-networking.mdc:9`',
  },
  {
    id: 'neoforge-1.20.4-rule-correction-cite',
    pack: 'neoforge/1.20.4',
    kind: 'page',
    platform: 'neoforge',
    version: '1.20.4',
    page: 'networking/payload',
    anchor: { file: 'neoforge/1.20.4/.cursor/rules/06-networking.mdc', line: 3, hint: 'DOC_NOT_FOUND' },
    want: { found: true, indexIds: ['networking/payload'] },
    why: '同上：1.20.4 规则侧 09-19 的更正行里含「旧稿「`DOC_NOT_FOUND`」是过期前提，已作废」⇒ 必须落 citation 桶。出处：`neoforge/1.20.4/.cursor/rules/06-networking.mdc:3`',
  },
];

/**
 * 采集面地板（R47）。口径与 as-of 随值注明：
 *   filesMin   —— 表内 anchor.file 去重后在 ROOT **真读到**的件数；as-of 2026-09-23 实扫 = 4 件
 *     （`AGENTS.md` / `mc-networking/SKILL.md` / 两档 `06-networking.mdc`），地板取 3。
 *   judgedMin  —— **判定成功**的条目数（锚点行找得到；含 citation / unjudged 桶）；as-of 实扫 = 7，地板取 5。
 *   claimsMin  —— 活声称数（kind 匹配到声称式、且不在 citation 桶）；
 *     as-of 修复前 = 5（4 红 + 1 与实况一致的绿禁令），修复后 = 1（只剩 `neoforge-1.20.4-skill-plural-term`
 *     这条与实况一致的本档禁令）⇒ 地板取下界 1，**不是**等式棘轮。
 */
export const FLOORS = { filesMin: 3, judgedMin: 5, claimsMin: 1 };

const indexCache = new Map();
const bodyCache = new Map();

/**
 * 只读定位本档语料目录：`data/<platform>_<version>/*\/<version>/index-l0.json`。
 * 口径对应 CLI 字段：index 命中该 id 且 `entry.version === version`
 *   ⇔ `ok:true` + 该 id 在 results 里 + `versionFallback:false`（实测两档载荷均无 quilt 专有
 *   `fallback`/`sourcePlatform`/`source_version` 三键，故不引入该判据）。
 */
function locateIndex(platform, version) {
  const key = `${platform}/${version}`;
  if (indexCache.has(key)) return indexCache.get(key);
  let out = { status: 'no-corpus', entries: [], dir: null };
  const base = path.join(DATA, `${platform}_${version}`);
  if (fs.existsSync(base)) {
    for (const sub of fs.readdirSync(base)) {
      const cand = path.join(base, sub, version, 'index-l0.json');
      if (fs.existsSync(cand)) {
        try {
          const arr = JSON.parse(fs.readFileSync(cand, 'utf8'));
          if (Array.isArray(arr)) {
            out = { status: 'ok', entries: arr, dir: path.dirname(cand) };
            break;
          }
        } catch {
          out = { status: 'bad-json', entries: [], dir: null };
        }
      }
    }
  }
  indexCache.set(key, out);
  return out;
}

/** 页正文：`<index 同级>/processed/<id 的 '/' 换 '_'>.md`；读不到 = 未判定（无 verbatim 字段）。 */
function readBody(platform, version, pageId) {
  const key = `${platform}/${version}/${pageId}`;
  if (bodyCache.has(key)) return bodyCache.get(key);
  const idx = locateIndex(platform, version);
  let text = null;
  if (idx.status === 'ok' && idx.dir) {
    const p = path.join(idx.dir, 'processed', pageId.split('/').join('_') + '.md');
    try {
      text = fs.readFileSync(p, 'utf8');
    } catch {
      text = null;
    }
  }
  bodyCache.set(key, text);
  return text;
}

/**
 * 检索侧（真跑用；--selftest 用注入版）。返回：
 *   { status: 'found'|'notfound'|'unjudged', evidence, verbatim: true|false|null }
 */
export function retrieve(platform, version, pageId, term) {
  const idx = locateIndex(platform, version);
  if (idx.status !== 'ok') {
    return { status: 'unjudged', evidence: `本仓无 ${platform}_${version} 的 index-l0.json（status=${idx.status}）⇒ 未判定，禁止读成「页不存在」`, verbatim: null };
  }
  const hit = idx.entries.filter((e) => e && e.id === pageId && e.version === version);
  if (!hit.length) {
    return { status: 'notfound', evidence: `index-l0（${idx.entries.length} 页）内无 id=${pageId} 且 version=${version} 的条目 ⇒ 未判定`, verbatim: null };
  }
  let verbatim = null;
  let bodyNote = '未取正文';
  if (term) {
    const body = readBody(platform, version, pageId);
    if (body == null) {
      bodyNote = 'processed 正文读不到 ⇒ verbatim 字段缺席 = 未判定';
    } else {
      verbatim = body.includes(term);
      bodyNote = `正文 ${body.length} 字符，${JSON.stringify(term)} ${verbatim ? '逐字出现' : '零命中'}`;
    }
  }
  return {
    status: 'found',
    verbatim,
    evidence: `index-l0 命中 id=${pageId}（label=${JSON.stringify(hit[0].label)}，version=${hit[0].version} ⇒ 等价 CLI 的 versionFallback:false）· ${bodyNote}`,
  };
}

/** 锚点行定位：先精确行，再半径外扩；必须含 hint（hint 是「改准后仍保留」的特征串）。 */
export function findAnchor(text, anchor) {
  const lines = String(text).split(NL);
  const exact = (anchor.line || 1) - 1;
  const order = [];
  if (exact >= 0 && exact < lines.length) order.push(exact);
  for (let r = 1; r <= 8; r++) {
    for (const i of [exact - r, exact + r]) if (i >= 0 && i < lines.length && !order.includes(i)) order.push(i);
  }
  for (let i = 0; i < lines.length; i++) if (!order.includes(i)) order.push(i);
  for (const i of order) {
    const l = lines[i].replace(/\r$/, '');
    if (l.includes(anchor.hint)) return { no: i + 1, text: l.trim().slice(0, 200) };
  }
  return null;
}

/**
 * 纯判定腿（--selftest 与真跑共用）。
 * @param claims  登记表
 * @param floors  {filesMin,judgedMin,claimsMin}
 * @param read    (rel) => text | null
 * @param retr    (platform, version, pageId, term) => {status, verbatim, evidence}
 */
export function judge(claims, floors, read, retr) {
  const conflicts = [];
  const lost = [];
  const citations = [];
  const unjudged = [];
  const consistent = [];
  const faceFiles = new Set();
  for (const c of claims) faceFiles.add(c.anchor.file);
  const texts = new Map();
  let missing = 0;
  for (const rel of [...faceFiles].sort()) {
    const t = read(rel);
    if (t == null) {
      missing++;
      continue;
    }
    texts.set(rel, t);
  }
  let judged = 0;
  for (const t of texts.values()) judged += t.split(NL).length;

  let activeClaims = 0;
  for (const c of claims) {
    const t = texts.get(c.anchor.file);
    if (t == null) {
      lost.push({ id: c.id, reason: '锚点文件读不到' });
      continue;
    }
    const a = findAnchor(t, c.anchor);
    if (!a) {
      lost.push({ id: c.id, reason: `锚点 ${c.anchor.file} 内找不到 hint ${JSON.stringify(c.anchor.hint)}（该行被删 / 档被搬走 ⇒ 必须人工重签登记表）` });
      continue;
    }
    if (RES.cite.test(a.text)) {
      citations.push({ id: c.id, at: `${c.anchor.file}:${a.no}`, reason: '同一行含更正/旧稿/作废等引用标记 ⇒ 是「引用旧断言」不是「声称」，不判红' });
      continue;
    }
    const claiming = c.kind === 'page' ? RES.page.test(a.text) : RES.ban.test(a.text) && (!c.termRe || c.termRe.test(a.text));
    if (!claiming) {
      consistent.push({ id: c.id, at: `${c.anchor.file}:${a.no}`, reason: '锚点行已不含声称式（断言改准）⇒ 绿' });
      continue;
    }
    activeClaims++;
    const r = retr(c.platform, c.version, c.page, c.kind === 'term' ? c.term : null);
    const side = `${c.anchor.file}:${a.no}`;
    if (r.status === 'notfound' || r.status === 'unjudged') {
      unjudged.push({ id: c.id, at: side, reason: `声称活，但检索侧未判定 —— ${r.evidence}` });
      continue;
    }
    if (c.kind === 'page') {
      conflicts.push({ id: c.id, pack: c.pack, side, sideText: a.text, evidence: r.evidence, mode: '声称缺页 ↔ 实测该页可取', want: c.want });
      continue;
    }
    if (r.verbatim === true) {
      conflicts.push({ id: c.id, pack: c.pack, side, sideText: a.text, evidence: r.evidence, mode: `声称「${c.term} 非本档 / 该页没写明」↔ 实测该页正文逐字出现`, want: c.want });
    } else if (r.verbatim === false) {
      consistent.push({ id: c.id, at: side, reason: `本档禁令与实况一致（${c.term} 在该页零逐字命中）⇒ 绿` });
    } else {
      unjudged.push({ id: c.id, at: side, reason: `声称活，但 verbatim 字段缺席 —— ${r.evidence}` });
    }
  }

  const scanned = texts.size;
  const resolved = claims.length - lost.length;
  const floorTrips = [];
  if (scanned === 0) {
    floorTrips.push({ kind: 'COLLECTOR', msg: `[FLOOR-COLLECTOR] 采集面 扫文件=0 —— 这是**采集器失效**（换错根 / 表内路径写错 / 档被搬走），不是断言干净（地板 文件≥${floors.filesMin}；口径见 FLOORS 注释与 as-of）` });
  } else if (scanned < floors.filesMin) {
    floorTrips.push({ kind: 'LOW', msg: `[FLOOR-LOW] 扫文件=${scanned} < 地板 ${floors.filesMin}（口径：CLAIMS 去重 anchor.file 在 ROOT 真读到件数；as-of 2026-09-23）` });
  }
  if (scanned > 0 && resolved === 0) {
    floorTrips.push({ kind: 'COLLECTOR', msg: `[FLOOR-COLLECTOR] 采集面 判定条目=0（登记 ${claims.length} 条）—— 这是**采集器失效**（hint 全部失配 / 锚点行被静默删除 / CITE_RE 改宽到吞掉一切），不是断言干净（地板 判定条目≥${floors.judgedMin}；as-of 2026-09-23）` });
  } else if (resolved > 0 && resolved < floors.judgedMin) {
    floorTrips.push({ kind: 'LOW', msg: `[FLOOR-LOW] 判定条目=${resolved} < 地板 ${floors.judgedMin}（口径：锚点行找得到、落到 声称/引用/未判定/改准 四桶之一的条目数；as-of 2026-09-23）` });
  }
  if (resolved > 0 && activeClaims === 0) {
    floorTrips.push({ kind: 'COLLECTOR', msg: `[FLOOR-COLLECTOR] 采集面 活声称=0（登记 ${claims.length} 条）—— 这是**声称式判据失效**（PAGE_RE / BAN_RE 被改瞎，或全部锚点行被重写成散文），门已无腿可判（地板 活声称≥${floors.claimsMin}；as-of 2026-09-23）` });
  } else if (activeClaims > 0 && activeClaims < floors.claimsMin) {
    floorTrips.push({ kind: 'LOW', msg: `[FLOOR-LOW] 活声称=${activeClaims} < 地板 ${floors.claimsMin}（口径：锚点行匹配声称式且不在 citation 桶；as-of 2026-09-23）` });
  }
  return { conflicts, lost, citations, unjudged, consistent, scanned, missing, judged, resolved, activeClaims, floorTrips, claims: claims.length };
}

function relOf(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function selftest() {
  const F = { filesMin: 2, judgedMin: 2, claimsMin: 1 };
  const A_FILE = 'neoforge/X/AGENTS.md';
  const B_FILE = 'neoforge/Y/.cursor/skills/mc-networking/SKILL.md';
  const mk = (o) => {
    const m = new Map(Object.entries(o));
    return (rel) => (m.has(rel) ? m.get(rel) : null);
  };
  const mkRetr = (table) => (plat, ver, page) => table[`${plat}/${ver}/${page}`] || { status: 'unjudged', evidence: 'fixture 未定义', verbatim: null };
  const REPO_CLAIM = mkRetr({
    'neoforge/X/networking/payload': { status: 'found', verbatim: true, evidence: 'index-l0 命中 id=networking/payload（label="Registering Payloads"，version=1.20.6）· 正文 6978 字符，"RegisterPayloadHandlersEvent" 逐字出现' },
    'neoforge/Y/networking/payload': { status: 'found', verbatim: false, evidence: 'index-l0 命中 id=networking/payload · 正文 5401 字符，"RegisterPayloadHandlersEvent" 零命中' },
  });
  /** 修复前形状：AGENTS 表行 + :23 段落同时「称无页」+「禁本档复数名」。 */
  const agentsBad = [
    '# 1.20.6',
    '',
    '| 项目 | 值 |',
    '|------|-----|',
    '| 网络 | networking 页 Payload（以该版文档为准，不要抄 1.21.1 复数 Handlers 除非该页写明） |',
    '',
    'pack-status: ready',
    '',
    '`generate_network_packet` **没有** `neoforge_1.20.6` 模板（本档无已核实 payload 页）。禁止抄 1.21.1 复数 `RegisterPayloadHandlersEvent` 除非该页写明。',
  ].join(NL);
  /** 修复后形状：同两处 hint 仍在，但落为实测口径 + 与实况一致的本档禁令。 */
  const agentsFixed = agentsBad
    .replace('以该版文档为准，不要抄 1.21.1 复数 Handlers 除非该页写明', '本档该页正文逐字用复数 `RegisterPayloadHandlersEvent` ×3，实测 verbatim:true，出处 06-networking:7')
    .replace('（本档无已核实 payload 页）。禁止抄 1.21.1 复数 `RegisterPayloadHandlersEvent` 除非该页写明。', '：实测 query=networking/payload → ok:true / total:10 / 首选 id networking/payload / versionFallback:false；本档该页逐字用复数 `RegisterPayloadHandlersEvent`。');
  /** 引用旧断言的更正行（本轮真树的 06-networking:9 形状）。 */
  const agentsCite = agentsBad.replace('（本档无已核实 payload 页）。禁止抄 1.21.1 复数 `RegisterPayloadHandlersEvent` 除非该页写明。', '**更正（2026-09-13）**：本节原先写「本档无已核实 payload 页、返回 `DOC_NOT_FOUND`」—— 该前提与盘上语料相反。本档该页逐字用复数 `RegisterPayloadHandlersEvent`。');
  const skillBad = [
    '# mc-networking（NeoForge 1.20.4）',
    '',
    '**本档不是 Forge SimpleChannel。** 本库 `search_neoforge_docs` 的 `networking/payload` 页为 `DOC_NOT_FOUND`。',
    '',
    '禁止：`SimpleChannel`；把 1.21 的 RegisterPayloadHandlersEvent（复数）当本档；',
  ].join(NL);

  const cPage = {
    id: 't-agents-payload-page', pack: 'neoforge/X', kind: 'page', platform: 'neoforge', version: 'X', page: 'networking/payload',
    anchor: { file: A_FILE, line: 9, hint: 'payload' }, want: { found: true }, why: 'fixture',
  };
  const cPlural = {
    id: 't-agents-plural-term', pack: 'neoforge/X', kind: 'term', platform: 'neoforge', version: 'X', page: 'networking/payload',
    term: 'RegisterPayloadHandlersEvent', termRe: /RegisterPayloadHandlersEvent|复数 Handlers/,
    anchor: { file: A_FILE, line: 9, hint: 'RegisterPayloadHandlersEvent' }, want: { verbatim: true }, why: 'fixture',
  };
  const cRow = {
    id: 't-agents-net-row', pack: 'neoforge/X', kind: 'term', platform: 'neoforge', version: 'X', page: 'networking/payload',
    term: 'RegisterPayloadHandlersEvent', termRe: /RegisterPayloadHandlersEvent|复数 Handlers/,
    anchor: { file: A_FILE, line: 5, hint: 'networking 页 Payload' }, want: { verbatim: true }, why: 'fixture',
  };
  const cSkill = {
    id: 't-skill-docnotfound', pack: 'neoforge/Y', kind: 'page', platform: 'neoforge', version: 'Y', page: 'networking/payload',
    anchor: { file: B_FILE, line: 3, hint: 'networking/payload' }, want: { found: true }, why: 'fixture',
  };
  const cBan = {
    id: 't-skill-plural-term-ok', pack: 'neoforge/Y', kind: 'term', platform: 'neoforge', version: 'Y', page: 'networking/payload',
    term: 'RegisterPayloadHandlersEvent', termRe: /RegisterPayloadHandlersEvent|复数 Handlers/,
    anchor: { file: B_FILE, line: 5, hint: 'RegisterPayloadHandlersEvent' }, want: { verbatim: false }, why: 'fixture',
  };
  /** 与实况一致的本档禁令（verbatim:false）+ 已改准的缺页声称 ⇒ 全绿。 */
  const skillFixed = skillBad.split('页为 `DOC_NOT_FOUND`').join('**可查**（实测 ok:true / total:10 / 首选 id networking/payload）');
  const ALL = [cRow, cPage, cPlural, cSkill, cBan];
  const R = { [A_FILE]: agentsBad, [B_FILE]: skillBad };

  const cases = [
    {
      // ① 表内「声称缺失 + 实测可取」⇒ 红并点名两侧
      name: 'ST1 声称缺页 + 实测该页可取 ⇒ 红并点名断言侧与检索侧',
      r: judge(ALL, F, mk(R), REPO_CLAIM),
      want: (r) => r.conflicts.length === 4 && r.conflicts.every((c) => c.side.includes(':') && c.evidence.includes('index-l0')) && r.activeClaims === 5 && r.consistent.length === 1,
    },
    {
      // ② 断言改成「本档实测可取（total/首选 id）」⇒ 绿
      name: 'ST2 断言改为「实测可取（total:10 / 首选 id）」⇒ 零红、落「改准」桶',
      r: judge(ALL, F, mk({ ...R, [A_FILE]: agentsFixed, [B_FILE]: skillFixed }), REPO_CLAIM),
      want: (r) => r.conflicts.length === 0 && r.consistent.length === 5 && r.unjudged.length === 0 && r.citations.length === 0 && r.resolved === 5 && r.floorTrips.length === 0,
    },
    {
      // ③ 高于地板 ⇒ 仍绿（证下界 `<` 非等式）
      name: 'ST3 实扫高于地板（登记 10 条 > 地板 2 / 活声称 8 > 地板 1）⇒ 仍绿（证地板是下界 < 而非等式）',
      r: judge([...ALL, ...ALL.map((c) => ({ ...c, id: c.id + '#2' }))], F, mk(R), REPO_CLAIM),
      want: (r) => r.claims === 10 && r.floorTrips.length === 0 && r.conflicts.length === 8 && r.activeClaims === 10 && r.consistent.length === 2,
    },
    {
      // ④ 采集塌 0 ⇒ [FLOOR-COLLECTOR]
      name: 'ST4a 锚点文件全读不到 ⇒ [FLOOR-COLLECTOR]（扫文件 0）',
      r: judge(ALL, F, mk({}), REPO_CLAIM),
      want: (r) => r.scanned === 0 && r.floorTrips.some((t) => t.kind === 'COLLECTOR' && t.msg.includes('扫文件=0')),
    },
    {
      name: 'ST4b hint 全部失配（锚点被静默删除）⇒ [FLOOR-COLLECTOR]（判定条目 0）',
      r: judge(ALL, F, mk({ [A_FILE]: '# 空档', [B_FILE]: '# 空档' }), REPO_CLAIM),
      want: (r) => r.resolved === 0 && r.lost.length === 5 && r.floorTrips.some((t) => t.kind === 'COLLECTOR' && t.msg.includes('判定条目=0')),
    },
    {
      name: 'ST4c 声称式判据被改瞎（RES.page / RES.ban 两条腿临时失配）=> [FLOOR-COLLECTOR]（活声称 0，证明正则不是装饰）',
      r: (function () {
        const saved = { page: RES.page, ban: RES.ban };
        RES.page = /x^/;
        RES.ban = /x^/;
        const out = judge(ALL, F, mk(R), REPO_CLAIM);
        RES.page = saved.page;
        RES.ban = saved.ban;
        return out;
      })(),
      want: (r) => r.activeClaims === 0 && r.conflicts.length === 0 && r.floorTrips.some((t) => t.kind === 'COLLECTOR' && t.msg.includes('活声称=0')),
    },
    {
      // ⑤ 未判定侧：页 id 换成不存在的串 ⇒ 不判红、只进未判定计数
      name: 'ST5 被声称缺失的页 id 换成本仓 index 里不存在的串（检索 notfound）⇒ 不判红、只进未判定计数（防误判腿）',
      r: judge(ALL, F, mk(R), () => ({ status: 'notfound', verbatim: null, evidence: 'index-l0 内无该 id ⇒ 未判定，禁止读成「声称成立」' })),
      want: (r) => r.conflicts.length === 0 && r.unjudged.length === 5 && r.floorTrips.length === 0,
    },
    {
      name: 'ST5b term 腿正文读不到（verbatim 字段缺席）⇒ 不判红、进未判定计数',
      r: judge(ALL, F, mk(R), () => ({ status: 'found', verbatim: null, evidence: 'processed 正文读不到 ⇒ verbatim 缺席 = 未判定' })),
      want: (r) => r.conflicts.length === 2 && r.unjudged.length === 3,
    },
    {
      // ⑥ 反证陷阱：更正行里引用了旧断言 ⇒ 必须不判红、进引用桶
      name: 'ST6 断言行被包成「更正：原先写…」引用式 ⇒ 不判红、进引用计数（grep 归零式验收的替死鬼腿）',
      r: judge(ALL, F, mk({ ...R, [A_FILE]: agentsCite }), REPO_CLAIM),
      want: (r) => r.conflicts.length === 2 && r.citations.length >= 2 && r.citations.every((c) => c.at === `${A_FILE}:9`),
    },
  ];

  let passed = 0;
  for (const c of cases) {
    const ok = c.want(c.r);
    if (ok) passed++;
    else {
      console.error(`  ✗ ${c.name}`);
      console.error(`    拒=${c.r.conflicts.length} 活声称=${c.r.activeClaims} 判定=${c.r.resolved} 未判定=${c.r.unjudged.length} 引用=${c.r.citations.length} 丢失=${c.r.lost.length} 改准=${c.r.consistent.length} 扫文件=${c.r.scanned} 地板=${c.r.floorTrips.map((t) => t.kind).join(',') || '无'}`);
      for (const f of c.r.conflicts.slice(0, 3)) console.error(`    冲突 ${f.id}: ${f.side} | ${f.evidence}`);
    }
  }
  const redConf = cases.filter((c) => c.r.conflicts.length > 0).length;
  const redFloor = cases.filter((c) => c.r.floorTrips.length > 0).length;
  const redAny = cases.filter((c) => c.r.conflicts.length > 0 || c.r.floorTrips.length > 0).length;
  console.log(`assert-doc-absence-claims(selftest): ${passed}/${cases.length}${passed === cases.length ? ` OK（${redAny} 记含红=${redConf} 冲突红 + ${redFloor} 地板红；其余为改准/引用/未判定对照腿）` : ' 有例不符'}`);
  process.exitCode = passed === cases.length ? 0 : 1;
}

if (process.argv.includes('--selftest')) {
  selftest();
} else {
  const failures = [];
  const read = (rel) => {
    try {
      return fs.readFileSync(path.join(ROOT, rel), 'utf8');
    } catch {
      return null;
    }
  };
  const r = judge(CLAIMS, FLOORS, read, retrieve);

  if (INFO) {
    for (const c of CLAIMS) {
      const t = read(c.anchor.file);
      const a = t == null ? null : findAnchor(t, c.anchor);
      const rr = a == null ? null : retrieve(c.platform, c.version, c.page, c.kind === 'term' ? c.term : null);
      console.log(`  info ${c.id}: 锚点=${a ? `${c.anchor.file}:${a.no}` : 'lost'} 检索=${rr ? `${rr.status}/verbatim=${rr.verbatim}` : '-'} ${rr ? rr.evidence : ''}`);
    }
    for (const c of r.conflicts) console.log(`  info 冲突 ${c.id}: ${c.side}`);
  }

  for (const f of r.floorTrips) failures.push(f.msg);
  for (const c of r.conflicts) {
    failures.push(`${c.side} [${c.id}] ${c.mode}：断言行「${c.sideText}」 —— 实测：${c.evidence} —— ${c.pack}：${CLAIMS.find((x) => x.id === c.id)?.why ?? ''}`);
  }
  if (r.missing) failures.push(`登记表内 ${r.missing} 个锚点文件读不到（路径写错 / 档被搬走 ⇒ 必须显式重签登记表，不许静默少扫）`);

  const summary =
    `汇总 扫文件=${r.scanned} 判条目=${r.resolved} 未判定=${r.unjudged.length} 引用=${r.citations.length} 拒=${r.conflicts.length} ` +
    `采集面=活声称 ${r.activeClaims}/登记 ${r.claims} 地板=文件≥${FLOORS.filesMin} 且 判定条目≥${FLOORS.judgedMin} 且 活声称≥${FLOORS.claimsMin}`;
  const packs = new Set(CLAIMS.map((c) => c.pack)).size;
  const coverage =
    `覆盖面：表内 ${CLAIMS.length} 条 / 判 ${packs} 档 / 被扫文件 ${r.scanned}（登记表去重实际读到的 anchor.file 件数）；检索侧=只读 data/**/index-l0.json + processed 正文，未 spawn CLI` +
    ` —— 这是**回归守卫**（钉住已登记的断言-页对，新病灶须人工新增登记），**不是万能检测器**：表外的档、表外的声称不判红；未判定桶 ${r.unjudged.length} 条 + 引用桶 ${r.citations.length} 条须人工抽查。`;
  console.log(`  ${coverage}`);
  console.log(`  ${summary}（口径与 as-of 见 FLOORS 注释）`);

  if (failures.length) {
    console.error(`assert-doc-absence-claims: ${failures.length} 项不通过（根=${relOf(ROOT) || '.'} · data=${relOf(DATA) || '.'}）`);
    for (const f of failures.slice(0, 20)) console.error(`  ✗ ${f}`);
    if (failures.length > 20) console.error(`  …另有 ${failures.length - 20} 项`);
    console.error(`  ${summary}`);
    process.exit(1);
  }
  console.log(
    `assert-doc-absence-claims: ok（表内 ${CLAIMS.length} 条：无「声称缺页/缺名 ↔ 实测可取」互斥；改准 ${r.consistent.length} · 引用 ${r.citations.length} · 未判定 ${r.unjudged.length} · 丢失 ${r.lost.length}）`,
  );
  for (const l of r.consistent) console.log(`  · lifted-claim ${l.id} @${l.at}: ${l.reason}`);
  for (const l of r.unjudged) console.log(`  · unjudged ${l.id} @${l.at}: ${l.reason}`);
}
