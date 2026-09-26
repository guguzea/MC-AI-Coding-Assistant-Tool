/**
 * assert-backlog-table-shape.mjs —— 给 `CONTRIBUTING.md` §未排期清单**这张表的形状**立一道受纳管的门（第 36 轮）。
 *
 * 为什么立：该表前言自写「台账历史行不回改，故本表是状态的**唯一现行读法**」，而此前**全仓没有任何门判它的形状** ——
 * `grep -rln CONTRIBUTING mcp-server/scripts/*.mjs` 的命中全是把它当**权威正文引用**，不是判据；
 * `temp/ralph-20260922/_anchor-lint.mjs` 默认判面只有 `PLAN-STATE-r2.md`（CONTRIBUTING 要人手动当 argv 传）。
 * 于是第 33、34 两轮连续把它写坏而无人报警（`L41`/`L42` 的第三列整列缺失 + `L43` 插到 `L42` 之前），
 * 第 35 轮只补了自己那行。后果不是难看：
 *   - **第三列「需要谁拍板」丢失** = 「这条欠谁一个决定」没了 ⇒ 下一轮把它当「无人欠做」跳过；
 *   - **号序错乱** = 按号扫的人以为表到 `L42` 就结束（`L43` 夹在中间）。
 *
 * 判据口径（**只判形状**，全部从 `CONTRIBUTING.md` 现扫，禁止硬钉行号）：
 *   ① 某行 cell 数 ≠ 3  ⇒ `BAD_CELL_COUNT`
 *   ② 第三列存在但为空/只含空白 ⇒ `EMPTY_DECIDER`
 *   ③ 号序不是逐行 +1（重号 / 跳号 / 乱序）⇒ `NUM_ORDER`
 *   ④ 首号 ≠ 1 ⇒ `FIRST_NUM`
 *   ⑤ 行数 < 地板 40 ⇒ `COVERAGE_BELOW_FLOOR`（**只许小于号**，加行不得红）
 *   ⑥ 采到 0 行 ⇒ `COLLECTOR_RETURNED_ZERO` + exit(1)（采集器塌了 ≠ 「表很干净」）
 *   ⑦ 锚（`## 未排期清单`）不在盘 ⇒ `ANCHOR_MISSING` + exit(1)
 *
 * **只打印不判红**（防把散文口径做成棘轮）：`现状` 列含 `as-of` / `未复核` / `已闭环` 的**份数**、
 * 单元格数分布。该表规矩要求「带分母 + 口径 + as-of」是 **prose 口径**，做成红腿会让一次**合法的改词**
 * 把无关门判红 —— 同 `CONTRIBUTING.md` `L18` 那条教训的形状。
 *
 * 本门**只读**：不改 `CONTRIBUTING.md`、不碰 `data/**`、不 spawn CLI（墙钟须在 `test-scripts.mjs` 的预算内）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
export const CONTRIBUTING = path.join(ROOT, "CONTRIBUTING.md");

/** 区间锚：按**标题文本**定位（本仓行号漂移是 `L3`/`R119` 反复点名的病，禁止用 `:383` 这类行号锚）。 */
export const SECTION_HEADING = "## 未排期清单";
/** 行锚：一条一行、行首是反引号包的 `L<n>`（与 `temp/ralph-20260922/_v32-table.mjs` 探针同口径）。 */
export const ROW_RE = /^\| `L(\d+)`/;
/** 地板（as-of 2026-09-25 现扫 = 43 行）。**只许 `<` 判红**：合法加行必然让它涨。 */
export const FLOOR_ROWS = 40;
/** 表应有的列数：条目 / 现状 / 需要谁拍板。 */
export const EXPECT_CELLS = 3;
/** prose 口径（只打印）：现状列是否带 as-of / 未复核 / 已闭环 三者之一。 */
export const PROSE_RE = /as-of|未复核|已闭环/;

/** 拆格：`| a | b | c |` → ["a","b","c"]（首尾空串去掉，同 `split("|").length - 2` 的分母）。 */
export function splitCells(line) {
  const parts = String(line).split("|");
  return parts.slice(1, -1).map((s) => s.trim());
}

/**
 * 采集器：锚 → 区间 → 逐行。返回 `{ rows, headingMissing, blankInside, sectionLines }`。
 * `blankInside` = 表区间内的空行数（空行会把 markdown 表截断，属形状事实，本轮**只打印**）。
 */
export function collectBacklogRows(text, { heading = SECTION_HEADING, rowRe = ROW_RE } = {}) {
  const lines = String(text ?? "").split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith(heading));
  if (start === -1) return { rows: [], headingMissing: true, blankInside: 0, sectionLines: 0, anchors: {} };
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) { end = i; break; }
  }
  const rows = [];
  let blankInside = 0;
  for (let i = start; i < end; i++) {
    const m = rowRe.exec(lines[i]);
    if (m) rows.push({ line: i + 1, n: Number(m[1]), cells: splitCells(lines[i]), raw: lines[i] });
  }
  // 口径：表内空行 = **首行到末行之间**的空行（那才会把 markdown 表截断）；末行之后的空行不算。
  if (rows.length) {
    for (let i = rows[0].line; i < rows[rows.length - 1].line; i++) {
      if (lines[i - 1].trim() === "") blankInside += 1;
    }
  }
  return { rows, headingMissing: false, blankInside, sectionLines: end - start, anchors: { start, end } };
}

/** 形状判据（纯函数，可投毒）：只判形状，四把尺 = 列数 / 第三列非空 / 号序 / 首号 + 两条采集器自证。 */
export function shapeCheck(rows, { floor = FLOOR_ROWS } = {}) {
  const errors = [];
  if (rows.length === 0) {
    errors.push("BACKLOG COLLECTOR_RETURNED_ZERO：一行 `L<n>` 都没采到 ⇒ 判据在看空气（表被整段重写？行锚漂了？发现器失效？），禁止把「0 行」读成「表很干净」");
    return { errors, rows: 0, prose: 0, first: null, last: null, gaps: [], badCells: [], emptyDecider: [] };
  }
  const badCells = [];
  const emptyDecider = [];
  for (const r of rows) {
    if (r.cells.length !== EXPECT_CELLS) {
      badCells.push(`L${r.n}@${r.line} cells=${r.cells.length}（≠ ${EXPECT_CELLS} ⇒ 第三列「需要谁拍板」**整列缺失**，不是内容为空）`);
      continue;
    }
    if (!r.cells[2] || !r.cells[2].trim()) emptyDecider.push(`L${r.n}@${r.line} 第三列为空/只含空白 ⇒ 这条「欠谁一个决定」丢了`);
  }
  for (const s of badCells) errors.push(`BACKLOG BAD_CELL_COUNT：${s}`);
  for (const s of emptyDecider) errors.push(`BACKLOG EMPTY_DECIDER：${s}`);
  const gaps = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].n !== rows[i - 1].n + 1) gaps.push(`${rows[i - 1].n}->${rows[i].n}@${rows[i].line}`);
  }
  if (gaps.length) {
    errors.push(`BACKLOG NUM_ORDER：号序不是逐行 +1（重号 / 跳号 / 乱序）⇒ 按号扫的人会以为表在中途结束。断点 ${gaps.length} 处：${gaps.join(", ")}`);
  }
  if (rows[0].n !== 1) errors.push(`BACKLOG FIRST_NUM：首号 = L${rows[0].n} ≠ 1 ⇒ 表头之前的条目被吞了（本表规矩是 L<n> 从 1 递增）`);
  if (rows.length < floor) {
    errors.push(`BACKLOG COVERAGE_BELOW_FLOOR：采到 ${rows.length} 行 < 地板 ${floor}（as-of 2026-09-25 现扫 43）⇒ 表被整段截断/采集面变薄（下界，加行不红）`);
  }
  const prose = rows.filter((r) => PROSE_RE.test(r.cells[1] ?? "")).length;
  return { errors, rows: rows.length, prose, first: rows[0].n, last: rows[rows.length - 1].n, gaps, badCells, emptyDecider };
}

/** 只打印、不判红的口径腿（返回文本，供 main 与 selftest 打印）。 */
export function proseCensus({ rows, blankInside = 0 }) {
  const dist = {};
  for (const r of rows) dist[r.cells.length] = (dist[r.cells.length] || 0) + 1;
  const longest = rows.reduce((a, r) => (!a || r.raw.length > a.raw.length ? r : a), null);
  return {
    prose: rows.filter((r) => PROSE_RE.test(r.cells[1] ?? "")).length,
    total: rows.length,
    dist: Object.entries(dist).map(([k, v]) => `${k} 格×${v}`).join(" / "),
    blankInside,
    longest: longest ? `L${longest.n}@${longest.line} ${longest.raw.length} 字符` : "（无）",
  };
}

/** 现盘一次读文件的完整判定（main 与 selftest 的正对照共用）。 */
export function backlogShapeFace(file = CONTRIBUTING) {
  if (!fs.existsSync(file)) {
    return { errors: [`BACKLOG ANCHOR_MISSING：${path.relative(ROOT, file)} 不在盘 ⇒ 本门没有判面`], fatal: true };
  }
  const text = fs.readFileSync(file, "utf8");
  const c = collectBacklogRows(text);
  if (c.headingMissing) {
    return { errors: [`BACKLOG ANCHOR_MISSING：找不到标题「${SECTION_HEADING}」（被改名？）⇒ 表形判据失去区间，禁止按「0 行 = 干净」放行`], fatal: true };
  }
  const s = shapeCheck(c.rows);
  const p = proseCensus(c);
  // 注意：不展开 `c`（它带 `rows` 数组，会把 `s.rows` 这个**份数**盖成对象 ⇒ 打印出 [object Object]）。
  return { ...s, ...p, blankInside: c.blankInside, sectionLines: c.sectionLines, rowList: c.rows, fatal: false };
}

/* ------------------------------- selftest ------------------------------- */

/** 把现盘一行改成「第三列整列缺失」（喂给真判据，非落盘）。 */
function dropThirdCell(rowLine) {
  const cells = splitCells(rowLine);
  return `| ${cells[0]} | ${cells[1]} |`;
}
/** 把现盘一行的第三列掏空（列还在、内容没了）。 */
function blankThirdCell(rowLine) {
  const cells = splitCells(rowLine);
  return `| ${cells[0]} | ${cells[1]} |   |`;
}

export function selfTest() {
  const cases = [];
  const disk = fs.readFileSync(CONTRIBUTING, "utf8");
  const base = collectBacklogRows(disk);
  const rowLine = (n) => base.rows.find((r) => r.n === n)?.raw ?? base.rows[0].raw;

  // ① 正对照：现盘逐字副本 ⇒ 必绿（本门立在一堆现症红项上就是装饰，故先钉「修完的盘必须绿」）
  cases.push({ name: "CONTROL 现盘逐字副本 ⇒ 绿", red: false, err: shapeCheck(base.rows).errors.join(" | ") });
  cases.push({ name: "CONTROL 现盘走完整面（backlogShapeFace）⇒ 绿且行数 ≥ 地板", red: false,
    err: (() => {
      const f = backlogShapeFace();
      if (f.fatal) return "判面锚缺失";
      return f.errors.length ? f.errors.join(" | ") : (f.rows < FLOOR_ROWS ? `行数 ${f.rows} < 地板` : "");
    })() });

  // ② 投毒：某行**删掉第三列**（= 第 33/34 轮真实写坏的形状）⇒ 红，且红在 BAD_CELL_COUNT
  cases.push({ name: "投毒 第三列整列缺失 ⇒ BAD_CELL_COUNT", red: true,
    err: (() => {
      const poisoned = base.rows.map((r) => (r.n === 1 ? { ...r, cells: splitCells(dropThirdCell(r.raw)), raw: dropThirdCell(r.raw) } : r));
      const e = shapeCheck(poisoned).errors.filter((x) => /BAD_CELL_COUNT/.test(x));
      return e.length ? e.join(" | ") : "";
    })() });
  // ②b 投毒：第三列**在但为空** ⇒ 红在 EMPTY_DECIDER（与 ② 是两种形状，都得咬）
  cases.push({ name: "投毒 第三列为空（列还在）⇒ EMPTY_DECIDER", red: true,
    err: (() => {
      const poisoned = base.rows.map((r) => (r.n === 2 ? { ...r, cells: splitCells(blankThirdCell(r.raw)), raw: blankThirdCell(r.raw) } : r));
      const e = shapeCheck(poisoned).errors.filter((x) => /EMPTY_DECIDER/.test(x));
      return e.length ? e.join(" | ") : "";
    })() });

  // ③ 投毒：插入一行号序乱（第 36 轮修之前的**真形状** L41, L43, L42）⇒ 红在 NUM_ORDER
  cases.push({ name: "投毒 号序乱（L43 插在 L42 前，现盘曾有的形状）⇒ NUM_ORDER", red: true,
    err: (() => {
      const i41 = base.rows.findIndex((r) => r.n === 41);
      const i42 = base.rows.findIndex((r) => r.n === 42);
      const i43 = base.rows.findIndex((r) => r.n === 43);
      if ([i41, i42, i43].some((i) => i < 0)) return "skip-no-43"; // 表没到 43 行时本例不适用（前提自证）
      const shuffled = [...base.rows];
      const r43 = shuffled[i43];
      shuffled.splice(i43, 1);
      shuffled.splice(i42, 0, r43); // 放到 L42 之前 ⇒ L41, L43, L42
      const e = shapeCheck(shuffled).errors.filter((x) => /NUM_ORDER/.test(x));
      return e.length ? e.join(" | ") : "";
    })() });
  // ③b 投毒：重号 / 跳号各一记（同一条腿的两种退化，不得只抓「倒序」）
  cases.push({ name: "投毒 重号 ⇒ NUM_ORDER", red: true,
    err: shapeCheck(base.rows.map((r, i) => (i === base.rows.length - 1 ? { ...r, n: r.n - 1 } : r))).errors.filter((x) => /NUM_ORDER/.test(x)).join(" | ") });
  cases.push({ name: "投毒 跳号 ⇒ NUM_ORDER", red: true,
    err: shapeCheck(base.rows.map((r) => (r.n === 20 ? { ...r, n: 999 } : r))).errors.filter((x) => /NUM_ORDER/.test(x)).join(" | ") });
  // ④ 投毒：首号 ≠ 1
  cases.push({ name: "投毒 首号 ≠ 1 ⇒ FIRST_NUM", red: true,
    err: shapeCheck(base.rows.map((r, i) => (i === 0 ? { ...r, n: 5 } : r))).errors.filter((x) => /FIRST_NUM/.test(x)).join(" | ") });

  // ⑤ 采集器塌了：正则退化到采 0 行 ⇒ COLLECTOR_RETURNED_ZERO（并核 main 的退出码腿会 exit 1）
  cases.push({ name: "投毒 正则采 0 行 ⇒ COLLECTOR_RETURNED_ZERO", red: true,
    err: (() => {
      const zero = collectBacklogRows(disk, { rowRe: /^\| `ZZZ(\d+)`/ });
      if (zero.rows.length !== 0) return ""; // 前提自证：采到东西就说明这条投毒无效
      return shapeCheck(zero.rows).errors.filter((x) => /COLLECTOR_RETURNED_ZERO/.test(x)).join(" | ");
    })() });
  cases.push({ name: "投毒 锚被改名 ⇒ ANCHOR_MISSING", red: true,
    err: (() => {
      const c = collectBacklogRows(disk, { heading: "## 这一节不存在了" });
      return c.headingMissing && backlogShapeFromCollected(c).length ? backlogShapeFromCollected(c).join(" | ") : "";
    })() });

  // ⑥ **不判对照**（prose 口径不得做成红腿）：把某行 `现状` 里的 as-of 全删掉 ⇒ 仍绿
  cases.push({ name: "CONTROL 合法改词（现状列去掉 as-of）⇒ 不判红", red: false,
    err: (() => {
      const poisoned = base.rows.map((r) => (r.n === 3 ? { ...r, cells: [r.cells[0], "本轮实测，没有 as-of 也没有分母", r.cells[2]] } : r));
      return shapeCheck(poisoned).errors.join(" | ");
    })() });
  // ⑦ **不判对照**（地板只许小于号）：在表尾合法加一行 ⇒ 仍绿（等式棘轮会让下一次合法登记必红）。
  //     号取「末号 +1」而不是钉死 L44 —— 钉死的话，等表真加到那一号时这条对照会因重号自己变红。
  cases.push({ name: `CONTROL 合法加一行（末号 +1）⇒ 不判红（地板只小于号）`, red: false,
    err: shapeCheck([...base.rows, { line: 0, n: (base.rows.at(-1)?.n ?? 0) + 1, cells: ["`L99` 新登记", "本轮实测 as-of 2026-09-25", "排期"] }]).errors.join(" | ") });
  // ⑧ 投毒：地板腿本身要活着 —— 表被截到 10 行 ⇒ COVERAGE_BELOW_FLOOR
  cases.push({ name: "投毒 表被截断到 10 行 ⇒ COVERAGE_BELOW_FLOOR", red: true,
    err: shapeCheck(base.rows.slice(0, 10)).errors.filter((x) => /COVERAGE_BELOW_FLOOR/.test(x)).join(" | ") });

  const failed = cases.filter((c) => Boolean(c.err) !== c.red);
  for (const c of cases) {
    console.log(`  selftest ${c.red ? "应红" : "应绿"}=${c.err ? "RED" : "green"}  ${c.name}${c.err ? " :: " + String(c.err).slice(0, 150) : ""}`);
  }
  if (failed.length) {
    console.error(`SELFTEST_FAILED ${failed.length}/${cases.length} 例判据失灵：\n${failed.map((f) => " - " + f.name).join("\n")}`);
    return 1;
  }
  console.log(`  表形门 selftest: ${cases.length} 例（${cases.filter((c) => c.red).length} 投毒必红 + ${cases.filter((c) => !c.red).length} 正对照/不判对照）全按预期`);
  return 0;
}

/** 锚缺失时采集结果 → 判据文本（单独抽出，便于 selftest 直接喂）。 */
export function backlogShapeFromCollected(c) {
  if (!c.headingMissing) return [];
  return [`BACKLOG ANCHOR_MISSING：找不到标题「${SECTION_HEADING}」⇒ 区间失效，采集 0 行不得读成「表很干净」`];
}

/* ---------------------------------- main ---------------------------------- */

function main() {
  if (process.argv.includes("--selftest")) process.exit(selfTest());
  const f = backlogShapeFace();
  console.log(`  §未排期清单 表形: 行数 ${f.rows}（地板 ${FLOOR_ROWS}，下界）· 首号 ${f.first} 末号 ${f.last} · 断号 ${f.gaps?.length ?? 0} 处 · 非 ${EXPECT_CELLS} 格行 ${f.badCells?.length ?? 0} · 第三列为空 ${f.emptyDecider?.length ?? 0} · 判 ${f.errors.length} 项`);
  // 只打印不判红（prose 口径 + 形状分布）：改词合法，故这些数字进报告不进退出码。
  console.log(`  §未排期清单 只打印（不判红）: 现状列含 as-of/未复核/已闭环 ${f.prose}/${f.total} 份 · 格数分布 ${f.dist} · 表内空行 ${f.blankInside} · 最长行 ${f.longest}`);
  if (f.fatal) {
    console.error(`assert-backlog-table-shape: FAILED（判面缺失）\n - ${f.errors.join("\n - ")}`);
    process.exit(1);
  }
  if (f.errors.length) {
    console.error(`assert-backlog-table-shape: FAILED（${f.errors.length} 项）\n${f.errors.map((e) => " - " + e).join("\n")}`);
    process.exit(1);
  }
  console.log(`assert-backlog-table-shape: ok（${f.rows} 行 × ${EXPECT_CELLS} 列，号序 1..${f.last} 连续；复核口径 = 现扫 ${pathToFileURL(CONTRIBUTING).pathname.slice(1)}，锚「${SECTION_HEADING}」）`);
}

main();
