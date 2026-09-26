#!/usr/bin/env node
/**
 * S35 · 禁区矛盾豁免门 + 用户裁定面的活性断言。
 *
 * 本门管两张面，别把它们混成一张：
 *
 * 一）**豁免面**（`EXEMPTIONS[]`）：矛盾一方落在禁区内（`ATTRIBUTION.md` 一字不动）或落在已裁定关闭的
 *   协议/许可面（2026-09-01），非禁区侧能收敛的都已收敛，剩下的只能「登记 + 豁免」。豁免一旦可以被
 *   随手添加，就等于把断言放松了 ⇒ 本门把豁免做成**双向、活性、有解释**三件事：
 *   A1 每条豁免必须自带非空 `why`（为何不可改）与 `recheck`（复核指令，含可执行动词）；
 *   A2 与解释文件双向对齐：`temp/PLAN-2026-09-08-禁区矛盾豁免.md` 里的 `## <id>` 小节集合
 *      必须与门内 `EXEMPTIONS[]` 的 id 集合**完全相等**（门多一条 = 红，文件多一条 = 红）；
 *      该文件在 `temp/`（不入库），缺失时本项降级为提示，不当红——否则 fresh clone 必红。
 *   A3 活性检查：每条豁免登记的 needle 必须仍在盘上原文里（矛盾已被修好或行已漂 ⇒
 *      僵尸豁免 = 红，逼着修完的人回来删条目）；
 *   A4 覆盖面检查：豁免只准指向 `community_knowledge/**`，且禁止指向被禁的生成物；
 *      id 不得重复；needle 不得是空串或纯空白。
 *
 * 二）**裁定面·单行**（`THIRD_STATE`）：豁免被裁定关闭后**留下的判据**，不是豁免。F52 于 2026-09-24 由用户
 *   裁定 (a) 关闭（三面统一「第三态」措辞 ⇒ 矛盾消除）⇒ 豁免条目删除，但它的两根 needle 改指到裁定后
 *   的第三态原文上继续判：凡引用 post/2571 且给许可结论的行，必须**同时含两半**（A = 帖内无逐帖显式声明，
 *   B = 站级默认 BY-NC-SA 3.0 适用），必须带取证时效与证据档位，且不得回退到被裁定否决的任一侧旧措辞。
 *   **删豁免 ≠ 让门变瞎**：这条判据就是那次的落地，反证在 `--selftest` 的 POISON-A/B/C/D 里。
 *   判据只咬含 `THIRD_STATE.key` 的行 ⇒ 协议列其它取值不受本单行腿判（对照例 = `--selftest` 的 CONTROL）。
 *
 * 二′）**裁定面·全表（R49，2026-09-25 用户裁定 L59-E=③ 折中扩判面）**（`thirdStateFace`）：把「第三态措辞须含
 *   `halfA` + `halfB` + as-of」从 2571 单行扩到 `links/mcmod-dev-tutorials.md` 的**全部第三态格**。
 *   判面来源（采集器 1，权威）= 该文件证据位小节里 证据级 == `**A（无声明）**` 的帖 id 清单；
 *   交叉面（采集器 2）= 主表协议格（split 后第 3 格）带 `⚠️` 的行。**禁止**用「含第三态措辞的行」当采集面——
 *   那是自指：谁把 halfA/halfB 删了谁就从判面上消失（本仓 `L21` 假红发生器同族）。⚠️ 只是「本格表态为第三态」
 *   的标记：撕措辞不撕 ⚠️ ⇒ 照判（`--selftest` 的 R49-POISON-halfA/halfB/asof 三条逐腿钉住）。
 *   判据：对采集器 1∩2 的每个 id，其协议格必须同时含 `halfA` + `halfB` + 一个 `as-of 20xx-xx-xx` 串，
 *   缺任一 ⇒ 判红并点名 id。交叉判：⚠️ 格的 id 不在 A（无声明）清单 ⇒ 判红（措辞与证据面矛盾）。
 *   三条地板全用 `<`（不许等式棘轮；语料扩了要跟着抬）：A（无声明）id 数 / 被实判主表行数 / 含 as-of 行数，
 *   现值 = **46 / 25 / 25**（as-of 2026-09-25，本门采集器实读，非 grep 口径）；任一分母塌 0 ⇒
 *   `COLLECTOR_RETURNED_ZERO`；证据位小节标题消失 ⇒ `ANCHOR_MISSING`（两者 rc=1，禁止读成「表很干净」）。
 *   折中边界要说死：把某格 ⚠️+措辞**整格改判**成别的协议值（连 ⚠️ 一起删）仍从本判面逃逸——那是 `L58`
 *   欠账二「协议列取值 ↔ 证据级全表一致」新门的活（另轮）；本面只保证「凡标了第三态的格，措辞与证据级不许被剪弱」。
 *   另有 21 个 A（无声明）id 的主表格非第三态措辞（19 格「默认 BY-NC-SA / 默认（未声明）」✅ 行 + 3978 / 4403
 *   两格引着帖内声明行，后者系生成器 `_v48-fixrefs.mjs` 对「一格两帖」证据行的 `/无声明/` 糊判；派单 F.3 明令
 *   本轮 67/21/46 计数不得变 ⇒ 未修、不判，登记见 `CONTRIBUTING.md`）——这正是派单「对**每个** A（无声明）id
 *   判主表行」的字面读法与生产 rc=0 不能兼得的地方，本门取 L59-E 的「折中」字面落点：判面 = 两采集器交集。
 *
 * 用法：
 *   node scripts/assert-community-attribution.mjs            # 真跑（盘上实况）
 *   node scripts/assert-community-attribution.mjs --selftest # 判据活性自证（内存夹具，不写盘）
 *
 * 假根（外部投毒自证用）：MC_SKILL_COMMUNITY_ATTR_TEST_ROOT=<dir>
 *   <dir>/community_knowledge/ATTRIBUTION.md
 *   <dir>/community_knowledge/authored/forge-event-system-practices.md
 *   <dir>/community_knowledge/links/mcmod-dev-tutorials.md
 *   <dir>/temp/PLAN-2026-09-08-禁区矛盾豁免.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.MC_SKILL_COMMUNITY_ATTR_TEST_ROOT
  ? path.resolve(process.env.MC_SKILL_COMMUNITY_ATTR_TEST_ROOT)
  : path.resolve(HERE, "..", "..");

const LEDGER_REL = "temp/PLAN-2026-09-08-禁区矛盾豁免.md";

/** 已登记豁免。加一条必须同时：在解释文件建同名 `## <id>` 小节 + 保住 needle 在盘上。 */
const EXEMPTIONS = [
  {
    id: "F51-attribution-pointer",
    why: "矛盾一方在 ATTRIBUTION.md（禁区，一字不动）：:8 记的是作者口头许可原话，:11 记的是实际入库口径。",
    recheck:
      "ls -R community_knowledge/permitted/*/pages 逐页确认 title 仍带「仅指针」；许可事实变更由用户直接编辑 ATTRIBUTION.md 后删本条豁免。",
    pins: [
      { file: "community_knowledge/ATTRIBUTION.md", needle: "允许本仓库收录提炼内容" },
      { file: "community_knowledge/ATTRIBUTION.md", needle: "不入库正文" },
    ],
  },
  // F52-event-system-license：2026-09-24 由用户裁定 (a) 关闭（三面统一「第三态」措辞 ⇒ 矛盾已消除，
  // 豁免失去存在理由），整条删除，**不是漏配**。它原来钉的两根 needle 已改指到下面 THIRD_STATE 的
  // 裁定面判据上，门仍会红（反证：`node scripts/assert-community-attribution.mjs --selftest`）。
];

/**
 * 裁定面判据（原 F52 关闭后接手）。措辞真值 = 用户裁定 (a) + 2026-09-24 直连取证，不要就地改口径；
 * 要改口径必须先重新取证并让用户裁定，然后同步改本对象与三面原文。
 */
const THIRD_STATE = {
  fromClosedExemption: "F52-event-system-license",
  closedAt: "2026-09-24",
  ruling:
    "用户裁定 (a)：`community_knowledge/authored/forge-event-system-practices.md` :6/:12/:87 + `community_knowledge/links/mcmod-dev-tutorials.md` :36 统一为第三态",
  basis:
    "外部-only，as-of 2026-09-24 用户直连测量：`.post-content` innerText 7055 字符、页脚之前许可类关键词命中 0、页脚「除另有声明，所有开放公共编辑的内容均使用 BY-NC-SA 3.0 协议。」位于 innerText 尾部 index 7376 / 总 7428。仓内无该页落盘副本 ⇒ 不得写成「语料逐字」；该站内容会变，复核须重新直连。",
  key: "post/2571",
  halfA: "帖内无逐帖显式声明",
  halfB: "站级默认 BY-NC-SA 3.0",
  asOf: "as-of 2026-09-24",
  tier: "外部-only",
  slideBack: ["显式 BY-NC-SA", "未声明协议", "均未声明"],
  files: [
    { file: "community_knowledge/authored/forge-event-system-practices.md", minLines: 3 },
    { file: "community_knowledge/links/mcmod-dev-tutorials.md", minLines: 1 },
  ],
};

/**
 * R49 · 第三态全表面（L59-E=③ 折中扩判面）。措辞真值同 THIRD_STATE.halfA/halfB（门内 :93-94 一带的定义行，
 * 别处不得另抄口径）。地板现值 = 46 / 25 / 25（as-of 2026-09-25，本门采集器对盘实读；分母口径见
 * `thirdStateFace` 返回值三个键）。**只许 `<` 判红**：等式棘轮会让下一次合法加行必红（同族 = backlog 形门
 * `FLOOR_ROWS`）；语料扩了要跟着抬地板，抬 = 重新实测 + 在 CONTRIBUTING 落账。
 */
const FACE = {
  file: "community_knowledge/links/mcmod-dev-tutorials.md",
  anchor: "## 协议列的逐行证据位",
  levelNone: "**A（无声明）**",
  warn: "⚠️",
  halfA: THIRD_STATE.halfA,
  halfB: THIRD_STATE.halfB,
  asOfRe: /as-of 20\d\d-\d{2}-\d{2}/,
  linkRe: /\]\(https:\/\/www\.mcmod\.cn\/post\/([0-9]{3,4})\.html\)/g,
  FLOOR_A_IDS: 40, // 现值 46（A（无声明）id 数）
  FLOOR_JUDGED: 20, // 现值 25（被实判主表行数 = 采集器 1∩2）
  FLOOR_ASOF: 20, // 现值 25（含 as-of 的被判行数）
};

/**
 * 纯判据：给定 links 文件全文，双采集器交叉后逐格判三件套，并守三条地板。
 * 不自指：采集器 1 只认 证据级 列的 `**A（无声明）**` 单元格逐字，采集器 2 只认协议格里的 ⚠️ 标记；
 * 被要求存在的 halfA/halfB/as-of **不参与采集**，只参与判定（谁删措辞谁不会从判面消失）。
 */
export function thirdStateFace(text, { floorAIds = FACE.FLOOR_A_IDS, floorJudged = FACE.FLOOR_JUDGED, floorAsOf = FACE.FLOOR_ASOF } = {}) {
  const errors = [];
  const lines = text.split(/\r?\n/);
  if (!lines.some((l) => l.startsWith(FACE.anchor))) {
    return {
      errors: [`R49 ANCHOR_MISSING：证据位小节标题「${FACE.anchor}」整行消失 ⇒ A（无声明）清单没了来源，禁止把「采不到」读成「没矛盾要判」`],
      aIds: 0, judged: 0, asOf: 0,
    };
  }
  // 采集器 1（判面来源，权威）：证据位表里 证据级 == **A（无声明）** 的帖 id 清单
  const aIds = new Set();
  for (const l of lines) {
    const m = l.match(/^\|\s*:[0-9]+\s*\|\s*([0-9]{3,4})\s*\|/);
    if (!m) continue;
    const cells = l.split("|").map((s) => s.trim());
    if (cells[4] === FACE.levelNone) aIds.add(m[1]);
  }
  // 采集器 2（主表交叉面）：帖子格带 post/<id>.html 链接、协议格（split 第 3 格）带 ⚠️ 的主表行
  const warn = new Map();
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.startsWith("| ") || /^\|\s*:[0-9]+\s*\|/.test(l)) continue;
    const cells = l.split("|");
    const proto = cells[3] || "";
    if (!proto.includes(FACE.warn)) continue;
    for (const m of (cells[1] || "").matchAll(FACE.linkRe)) if (!warn.has(m[1])) warn.set(m[1], { line: i + 1, proto });
  }
  if (aIds.size === 0)
    errors.push("R49 COLLECTOR_RETURNED_ZERO：证据位小节在、但 A（无声明）id 采集 = 0 ⇒ 表头/证据级列形被改（判面来源塌了，不是「表很干净」）");
  if (warn.size === 0)
    errors.push("R49 COLLECTOR_RETURNED_ZERO：主表协议格 ⚠️ 行采集 = 0 ⇒ 第三态格被整面抹除，交叉面塌空");
  for (const [id, r] of warn)
    if (!aIds.has(id))
      errors.push(`R49 交叉：主表 :${r.line} 帖 ${id} 协议格带 ⚠️（自称第三态），但证据位表该 id 的证据级不是 ${FACE.levelNone} ⇒ 措辞与证据面矛盾`);
  const judged = [...warn.keys()].filter((id) => aIds.has(id));
  let asOf = 0;
  for (const id of judged) {
    const r = warn.get(id);
    const miss = [];
    if (!r.proto.includes(FACE.halfA)) miss.push(`halfA「${FACE.halfA}」`);
    if (!r.proto.includes(FACE.halfB)) miss.push(`halfB「${FACE.halfB}」`);
    if (FACE.asOfRe.test(r.proto)) asOf++;
    else miss.push("as-of 20xx-xx-xx 取证时效串");
    if (miss.length)
      errors.push(`R49 判：帖 ${id}（主表 :${r.line}）第三态协议格缺 ${miss.join(" + ")} ⇒ 判面来源 = 证据位 A（无声明）清单 × ⚠️ 格交叉，措辞被剪弱照样判红`);
  }
  if (judged.length > 0 && asOf === 0)
    errors.push("R49 COLLECTOR_RETURNED_ZERO：被实判行 >0 但含 as-of 的行 = 0 ⇒ 取证时效被整面删除，该分母塌 0 不得放行");
  if (aIds.size > 0 && aIds.size < floorAIds)
    errors.push(`R49 COVERAGE_BELOW_FLOOR：采集到 A（无声明）id = ${aIds.size} < 地板 ${floorAIds}（现值 46，as-of 2026-09-25；只许 < 判红，语料扩了要跟着抬）`);
  if (judged.length > 0 && judged.length < floorJudged)
    errors.push(`R49 COVERAGE_BELOW_FLOOR：被实判主表行 = ${judged.length} < 地板 ${floorJudged}（现值 25；只许 <）`);
  if (asOf > 0 && asOf < floorAsOf)
    errors.push(`R49 COVERAGE_BELOW_FLOOR：含 as-of 的被判行 = ${asOf} < 地板 ${floorAsOf}（现值 25；只许 <）`);
  return { errors, aIds: aIds.size, judged: judged.length, asOf };
}

function makeAccessor(root, fixture) {
  const cache = new Map();
  const abs = (rel) => path.join(root, rel.split("/").join(path.sep));
  return {
    has(rel) {
      if (fixture) return fixture.has(rel);
      return fs.existsSync(abs(rel));
    },
    read(rel) {
      if (fixture) return fixture.has(rel) ? fixture.get(rel) : null;
      if (!cache.has(rel)) cache.set(rel, fs.existsSync(abs(rel)) ? fs.readFileSync(abs(rel), "utf8") : null);
      return cache.get(rel);
    },
  };
}

/** 纯判据：给定文件访问器返回 failures / notes。不打印、不退出 ⇒ 真跑与 --selftest 共用同一份判据。
 *  opts.floors：R49 全表面的三条地板；真跑不传 = 生产地板（40/20/20）；内存夹具传小地板（1/1/1）。 */
function evaluate(acc, { floors } = {}) {
  const failures = [];
  const notes = [];
  const fail = (m) => failures.push(m);

  for (const e of EXEMPTIONS) {
    if (!e.id.trim()) fail("存在空 id 的豁免条目");
    if (!e.why || e.why.trim().length < 12) fail(`${e.id}: why 缺失或过短 ⇒ 不允许无解释豁免`);
    if (!e.recheck || !/(ls |grep |curl|node |打开|复核)/.test(e.recheck))
      fail(`${e.id}: recheck 不是一条可执行的复核指令`);
    if (!e.pins?.length) fail(`${e.id}: 没有登记任何原文 needle`);
  }
  const ids = EXEMPTIONS.map((e) => e.id);
  if (new Set(ids).size !== ids.length) fail(`豁免 id 重复：${ids.join(", ")}`);

  const seenMissing = new Set();
  for (const e of EXEMPTIONS) {
    for (const pin of e.pins ?? []) {
      if (!pin.file.startsWith("community_knowledge/")) {
        fail(`${e.id}: needle 指向豁免范围外（只准 community_knowledge/**）：${pin.file}`);
        continue;
      }
      if (/library-catalog\.ts|meta\.json$|semantic-index-manifest/.test(pin.file)) {
        fail(`${e.id}: needle 指向生成物，禁止用豁免覆盖生成物：${pin.file}`);
        continue;
      }
      if (!pin.needle || !pin.needle.trim()) {
        fail(`${e.id}: ${pin.file} 的 needle 为空`);
        continue;
      }
      const text = acc.read(pin.file);
      if (text === null) {
        const key = `${e.id}::${pin.file}`;
        if (!seenMissing.has(key)) {
          seenMissing.add(key);
          fail(`${e.id}: 登记的原文文件不在盘上 ⇒ ${pin.file}`);
        }
        continue;
      }
      const hits = text.split(pin.needle).length - 1;
      if (hits === 0)
        fail(
          `僵尸豁免：${e.id} 的 needle「${pin.needle}」已不在 ${pin.file}（矛盾已修好或行已漂 ⇒ 删掉这条豁免，别留空壳）`,
        );
    }
  }

  // —— 裁定面：第三态两半俱全 + 时效/档位 + 不倒回任一侧（假根只放部分文件时跳过缺失项）——
  for (const spec of THIRD_STATE.files) {
    if (!acc.has(spec.file)) continue;
    const text = acc.read(spec.file);
    if (text === null) {
      fail(`${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 在册但读不到`);
      continue;
    }
    const judged = text.split(/\r?\n/).filter((l) => l.includes(THIRD_STATE.key));
    if (judged.length < spec.minLines)
      fail(
        `${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 引用「${THIRD_STATE.key}」的行只剩 ${judged.length} 行（应 ≥ ${spec.minLines}）⇒ 第三态措辞被删或 URL 被改写，判据不得空转`,
      );
    for (const line of judged) {
      if (!line.includes(THIRD_STATE.halfA))
        fail(
          `${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 的 2571 行缺半句 A「${THIRD_STATE.halfA}」⇒ 已倒回「站级默认 = 帖内声明」单侧读法`,
        );
      if (!line.includes(THIRD_STATE.halfB))
        fail(
          `${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 的 2571 行缺半句 B「${THIRD_STATE.halfB}」⇒ 已倒回「该帖没有任何许可口径」单侧读法`,
        );
      for (const s of THIRD_STATE.slideBack)
        if (line.includes(s))
          fail(
            `${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 的 2571 行又出现被裁定 (a) 否决的旧措辞「${s}」`,
          );
    }
    if (!judged.some((l) => l.includes(THIRD_STATE.asOf)))
      fail(
        `${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 的 2571 行缺取证时效「${THIRD_STATE.asOf}」——该站内容会变，无 as-of 的许可结论不可复核`,
      );
    if (!judged.some((l) => l.includes(THIRD_STATE.tier)))
      fail(
        `${THIRD_STATE.fromClosedExemption} 裁定面：${spec.file} 的 2571 行缺证据档位「${THIRD_STATE.tier}」——禁止把直连取证写成「语料逐字」`,
      );
  }

  // —— R49 裁定面·全表（L59-E=③）：采集 = 证据位表 A（无声明）id 清单 × 主表 ⚠️ 协议格，判 = 三件套 ——
  // 夹具不落地该文件时跳过（假根只放部分文件的既有约定）；落地了就必须过 whole-face。
  let faceStats = null;
  if (acc.has(FACE.file)) {
    const text = acc.read(FACE.file);
    if (text === null) {
      fail(`R49 全表面：${FACE.file} 在册但读不到`);
    } else {
      const fr = thirdStateFace(text, floors || undefined);
      for (const e of fr.errors) fail(e);
      faceStats = fr;
    }
  }

  const ledgerIds = acc.has(LEDGER_REL)
    ? [...(acc.read(LEDGER_REL) || "").matchAll(/^## (\S+)\s*$/gm)].map((m) => m[1])
    : null;
  if (ledgerIds) {
    for (const id of ids) if (!ledgerIds.includes(id)) fail(`门内豁免 ${id} 在解释文件里没有同名小节 ⇒ 无解释豁免`);
    for (const id of ledgerIds)
      if (!ids.includes(id))
        fail(`解释文件登记了 ${id}，门内没有这条豁免 ⇒ 台账与门不同步（裁定关闭的豁免要同时删两侧）`);
    if (new Set(ledgerIds).size !== ledgerIds.length)
      fail(`解释文件里有重复小节：${ledgerIds.filter((x, i) => ledgerIds.indexOf(x) !== i).join(", ")}`);
  } else {
    notes.push(`解释文件缺失（${LEDGER_REL} 在 temp/，不入库）⇒ 双向对齐降级为提示，只用门内 inline 解释`);
  }

  return { failures, notes, ids, ledgerIds, faceStats };
}

/* ------------------------------------------------------------------- selftest */

const ATTR_STUB = "# 署名\n\n允许本仓库收录提炼内容\n与 `links/` 相同，不入库正文\n";
const LEDGER_STUB = "# 台账\n\n## F51-attribution-pointer\n\n- 略\n";
const OK_AUTHORED = [
  "---",
  `mcHint: 社区教程 post/2571 全文核实；帖内无逐帖显式声明、站级默认 BY-NC-SA 3.0 适用`,
  "---",
  `正文依据 [post/2571](https://www.mcmod.cn/post/2571.html)：帖内无逐帖显式声明 ⇒ 站级默认 BY-NC-SA 3.0 适用；as-of 2026-09-24 直连取证，外部-only。`,
  `- 思路来源：帖内无逐帖显式声明，但站级默认 BY-NC-SA 3.0 适用；as-of 2026-09-24、外部-only：https://www.mcmod.cn/post/2571.html`,
].join("\n");
// R49 起夹具的 links 文件必须自带「主表 ⚠️ 格 + 证据位小节」两面（whole-face 的采集器 1/2 都要有来源）；
// 第二格 4413 用于把 R49 三条投毒与单行腿（只咬 post/2571）隔离开——投毒 4413 时单行腿仍绿，红了必是 new face。
const OK_LINKS =
  "| [浅谈 Forge 的事件系统和使用](https://www.mcmod.cn/post/2571.html) | 事件系统 | ⚠️ 许可第三态：**帖内无逐帖显式声明**，但 **站级默认 BY-NC-SA 3.0 适用**（2026-09-24 用户裁定，取证 as-of 2026-09-24、外部-only） | 已提炼 |\n" +
  "| [匠魂3附属开发进阶](https://www.mcmod.cn/post/4413.html) | TiC3 附属进阶 | ⚠️ 帖内无逐帖显式声明，站级默认 BY-NC-SA 3.0 适用（as-of 2026-09-25 内置浏览器直访 post/4413.html，外部-only） | 中文 TiC 社区活跃 |\n" +
  "\n## 协议列的逐行证据位\n\n| 本文件行 | 帖 id | 本轮判定（取证件原文） | 证据级 | 读到什么 |\n|---|---|---|---|---|\n" +
  "| :1 | 2571 | ✅第三态正确 | **A（无声明）** | 帖页没有模板声明行 ⇒ 只说明帖内无逐帖显式声明、站级默认 BY-NC-SA 3.0 适用这一口径下限，不构成对「可否商用 / 可否演绎 / 可否转载」的任何方向的判断；点名要引用须先向作者确认 |\n" +
  "| :2 | 4413 | ❌虚标 | **A（无声明）** | 帖页没有模板声明行 ⇒ 只说明帖内无逐帖显式声明、站级默认 BY-NC-SA 3.0 适用这一口径下限，不构成对「可否商用 / 可否演绎 / 可否转载」的任何方向的判断；点名要引用须先向作者确认 |\n";
// 不判对照：协议列里**别的**帖子照常写「显式 BY-NC-SA」/「未声明协议」，只要该行不含 post/2571 就不受判
// ⇒ 证明裁定面没有退化成「community_knowledge 里所有文件/所有行都必须提 2571」。
const CONTROL_LINKS =
  OK_LINKS +
  `| [Curios API 添加饰品](https://www.mcmod.cn/post/3102.html) | 饰品栏 API 接入 | 显式 BY-NC-SA | 不受判 |\n` +
  `| [FML 加载模组过程](https://www.mcmod.cn/post/2338.html) | 加载链路原理 | 未声明协议 | 不受判 |\n` +
  `| [ProbeJS 插件及 VSC 实用技巧](https://www.mcmod.cn/post/5939.html) | 自动补全工具链 | 显式 BY-NC-SA | 不受判（R49 对照：id 5939 证据级 = **A**（有声明），协议格无 ⚠️ ⇒ 两面都不进判面） |\n` +
  `| :3 | 5939 | ✅ | **A** | 声明行 = 「…CC BY-NC-SA 协议。」（as-of 2026-09-25 内置浏览器直访 post/5939.html；省略号照抄未补全） |\n`;

function fixture(overrides = {}) {
  const base = new Map([
    ["community_knowledge/ATTRIBUTION.md", ATTR_STUB],
    ["community_knowledge/authored/forge-event-system-practices.md", OK_AUTHORED],
    ["community_knowledge/links/mcmod-dev-tutorials.md", OK_LINKS],
    [LEDGER_REL, LEDGER_STUB],
  ]);
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null) base.delete(k);
    else base.set(k, v);
  }
  return base;
}

function runSelftest() {
  const FIX_FLOORS = { floorAIds: 1, floorJudged: 1, floorAsOf: 1 }; // 小夹具专用地板（生产地板单列一条投毒判它活着）
  const cases = [
    { name: "GREEN 基线（第三态俱全 + 台账双向对齐 + R49 两面俱全）", want: "ok", fix: fixture() },
    {
      name: "POISON-A 撕掉半句 A（只剩站级默认那一半）",
      wantFail: `缺半句 A`,
      fix: fixture({
        "community_knowledge/authored/forge-event-system-practices.md": OK_AUTHORED.split(
          THIRD_STATE.halfA,
        ).join("（此处删掉了半句 A）"),
      }),
    },
    {
      name: "POISON-B 倒回旧措辞「显式 BY-NC-SA」",
      wantFail: "被裁定 (a) 否决的旧措辞",
      fix: fixture({
        "community_knowledge/authored/forge-event-system-practices.md": OK_AUTHORED.replace(
          "帖内无逐帖显式声明，但站级默认 BY-NC-SA 3.0 适用",
          "显式 BY-NC-SA，可署名演绎",
        ),
      }),
    },
    {
      name: "POISON-C 第三态整段被删（判据不得空转）",
      wantFail: "判据不得空转",
      fix: fixture({
        "community_knowledge/authored/forge-event-system-practices.md": OK_AUTHORED.split(/\r?\n/)
          .filter((l) => !l.includes(THIRD_STATE.key) || l.startsWith("mcHint:"))
          .join("\n"),
      }),
    },
    {
      name: "POISON-D 缺证据档位（把直连取证写成仓内可核）",
      wantFail: "缺证据档位",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.replace("、外部-only", ""),
      }),
    },
    {
      name: "POISON-E 台账留着已关闭的 F52 小节（A2 双向对齐仍活）",
      wantFail: "台账与门不同步",
      fix: fixture({
        [LEDGER_REL]: LEDGER_STUB + `\n## F52-event-system-license\n\n- 已关闭但忘了删\n`,
      }),
    },
    // —— R49 全表面（L59-E=③）。投毒一律打在 4413 格上：该行不含 post/2571 ⇒ 单行腿必绿，
    //    红了只能是新判面判的；这也是「两机制腿各自活」的隔离证据。——
    {
      name: "R49-POISON-1 撕掉 4413 格的 halfA（⚠️ 留着、措辞被剪）",
      wantFail: "R49 判：帖 4413",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.replace(
          "⚠️ 帖内无逐帖显式声明，站级默认 BY-NC-SA 3.0 适用（as-of 2026-09-25",
          "⚠️ 站级默认 BY-NC-SA 3.0 适用（as-of 2026-09-25",
        ),
      }),
    },
    {
      name: "R49-POISON-2 撕掉 4413 格的 halfB",
      wantFail: "R49 判：帖 4413",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.replace(
          "⚠️ 帖内无逐帖显式声明，站级默认 BY-NC-SA 3.0 适用（as-of 2026-09-25",
          "⚠️ 帖内无逐帖显式声明（as-of 2026-09-25",
        ),
      }),
    },
    {
      name: "R49-POISON-3 删掉 4413 格的 as-of（无时效的许可结论不可复核）",
      wantFail: "缺 as-of",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.replace(
          "（as-of 2026-09-25 内置浏览器直访 post/4413.html，外部-only）",
          "（内置浏览器直访 post/4413.html，外部-only）",
        ),
      }),
    },
    {
      name: "R49-POISON-4 主表 4413 格 ⚠️ 但证据位行被删（交叉判必红）",
      wantFail: "R49 交叉",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.split(/\r?\n/)
          .filter((l) => !l.startsWith("| :2 | 4413"))
          .join("\n"),
      }),
    },
    {
      name: "R49-POISON-5 采集面喂空：证据级列形被改（全角括号→半角）⇒ 采到 0 个 A（无声明）id",
      wantFail: "COLLECTOR_RETURNED_ZERO",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.split("**A（无声明）**").join("**A(无声明)**"),
      }),
    },
    {
      name: "R49-POISON-6 证据位小节标题整行消失 ⇒ ANCHOR_MISSING（不得读成「无矛盾」）",
      wantFail: "ANCHOR_MISSING",
      fix: fixture({
        "community_knowledge/links/mcmod-dev-tutorials.md": OK_LINKS.split(/\r?\n/)
          .filter((l) => !l.startsWith(FACE.anchor))
          .join("\n"),
      }),
    },
    {
      name: "R49-POISON-7 地板腿活着：生产地板（40/20/20）套 2 行小夹具 ⇒ COVERAGE_BELOW_FLOOR",
      wantFail: "COVERAGE_BELOW_FLOOR",
      floors: null, // = 用生产地板
      fix: fixture(),
    },
    {
      name: "CONTROL 不判对照（别的帖子写「显式 BY-NC-SA」/「未声明协议」/「A（有声明）」）",
      want: "ok",
      fix: fixture({ "community_knowledge/links/mcmod-dev-tutorials.md": CONTROL_LINKS }),
    },
    {
      name: "R49-CONTROL 现盘走完整面（真读 links 文件 + 生产地板）⇒ 绿且三读数 ≥ 地板",
      direct: true,
      check() {
        const abs = path.join(ROOT, ...FACE.file.split("/"));
        if (!fs.existsSync(abs)) return { skip: `${FACE.file} 不在盘（无该件的宿主机降级为提示，不算判过）` };
        const fr = thirdStateFace(fs.readFileSync(abs, "utf8"));
        if (fr.errors.length) return { err: fr.errors.join(" | ") };
        if (fr.aIds < FACE.FLOOR_A_IDS || fr.judged < FACE.FLOOR_JUDGED || fr.asOf < FACE.FLOOR_ASOF)
          return { err: `读数低于地板 aIds=${fr.aIds}/${FACE.FLOOR_A_IDS} judged=${fr.judged}/${FACE.FLOOR_JUDGED} asOf=${fr.asOf}/${FACE.FLOOR_ASOF}` };
        return { ok: `aIds=${fr.aIds} judged=${fr.judged} asOf=${fr.asOf}` };
      },
    },
  ];

  let bad = 0;
  for (const c of cases) {
    if (c.direct) {
      const r = c.check();
      if (r.skip) console.log(`  info ${c.name} → ${r.skip}`);
      else if (r.err) { bad++; console.log(`  ✗ ${c.name} 应当绿，实际红：${r.err.slice(0, 160)}`); }
      else console.log(`  ✓ ${c.name} → 绿（现盘 ${r.ok}）`);
      continue;
    }
    const floors = "floors" in c ? c.floors : FIX_FLOORS;
    const { failures } = evaluate(makeAccessor(ROOT, c.fix), { floors });
    if (c.want === "ok") {
      if (failures.length) {
        bad++;
        console.log(`  ✗ ${c.name} 应当绿，实际红 ${failures.length} 项：${failures[0]}`);
      } else console.log(`  ✓ ${c.name} → 绿`);
      continue;
    }
    const hit = failures.find((f) => f.includes(c.wantFail));
    if (!hit) {
      bad++;
      console.log(`  ✗ ${c.name} 应红在「${c.wantFail}」，实际失败 ${failures.length} 项（${failures[0] || "无"}）`);
    } else console.log(`  ✓ ${c.name} → 红：${hit.slice(0, 130)}`);
  }
  if (bad) {
    console.log(`assert-community-attribution --selftest: ${bad}/${cases.length} 例不符 ⇒ 判据已退化`);
    process.exit(1);
  }
  console.log(
    `assert-community-attribution --selftest: ok · ${cases.length} 例全中（${cases.filter((c) => c.wantFail).length} 投毒必红 + ${cases.filter((c) => c.want === "ok").length} 基线/对照绿 + 1 现盘全表面）；裁定面 = 单行腿（原 ${THIRD_STATE.fromClosedExemption}，${THIRD_STATE.closedAt} 关闭）+ R49 全表腿（L59-E=③）`,
  );
}

/* ----------------------------------------------------------------------- main */

if (process.argv.includes("--selftest")) {
  runSelftest();
  process.exit(0);
}

const { failures, notes, ids, ledgerIds, faceStats } = evaluate(makeAccessor(ROOT, null));
const rel = path.relative(process.cwd(), ROOT) || ".";
if (failures.length) {
  console.log(`assert-community-attribution: ${failures.length} 项失败（根=${rel}，豁免 ${ids.length} 条${ledgerIds ? ` / 台账 ${ledgerIds.length} 条` : " / 台账缺席"}）`);
  for (const f of failures.slice(0, 30)) console.log("  ✗ " + f);
  process.exit(1);
}
console.log(
  `assert-community-attribution: ok · 豁免 ${ids.length} 条全部有解释且原文仍在盘上；裁定面（原 ${THIRD_STATE.fromClosedExemption}，${THIRD_STATE.closedAt} 由用户裁定 (a) 关闭）第三态措辞在盘${ledgerIds ? ` · 与解释文件 ${ledgerIds.length} 条双向对齐` : ""}；R49 全表面读数 A（无声明）${faceStats ? faceStats.aIds : "-"} / 实判主表行 ${faceStats ? faceStats.judged : "-"} / 含 as-of ${faceStats ? faceStats.asOf : "-"}（地板 ${FACE.FLOOR_A_IDS}/${FACE.FLOOR_JUDGED}/${FACE.FLOOR_ASOF}，只许 <）（根=${rel}）`,
);
for (const n of notes) console.log("  info: " + n);
