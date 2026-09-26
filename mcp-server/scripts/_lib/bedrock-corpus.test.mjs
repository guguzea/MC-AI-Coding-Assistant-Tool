#!/usr/bin/env node
/**
 * bedrock-corpus.test.mjs — S13-T2（2026-09-22 第 8 轮）
 *
 * 为什么必须有：`_lib/bedrock-corpus.mjs` 是被 Git 跟踪的，所以 `assert-scripts-parse.mjs`
 * 一直在**看得见**它——但那道门只跑 `node --check`（只解析、不执行）。于是「`tableToMd` 因为
 * 通用剥标签先跑而永不触发」这种**逻辑死代码**在门下全程是绿的（可见 ≠ 被测，边界已写进该门头注释）。
 * 本文件是那台转换器的第一批**行为**回归。
 *
 * 运行：`cd mcp-server && node --test scripts/_lib/bedrock-corpus.test.mjs`
 * 退出码：0 = 全绿；1 = 有失败。
 *
 * 设计（对齐仓库既有 `_lib/*.test.mjs` 形状）：
 *  - 不联网、不写盘：`learnToMarkdown` 是纯字符串函数，本文件**零 fs 落笔**
 *    ⇒ 不需要进 `SCRIPT_WRITE_GUARD_NON_WRITERS`（该表只收「有写原语但落点在 OS tmpdir」的文件）。
 *  - 只用 node:test 与 node:assert/strict（Node stdlib）。
 *  - 「能红」的构造：例 ① 钉生产顺序（表格先走 → 有管道表）；例 ② 用一份**手工复现的旧序**
 *    链（通用剥标签先走）当反例，断言**此时没有管道表**。两条合起来才叫钉住了顺序：
 *    只留 ① 的话，别人把 ① 改成「断言散行」也能变绿。
 *
 * ⚠️ 判别式上的一个坑（本轮实测踩过，写下来防第二个人踩）：`/^\|(?: *--- *|)+$/` **看着**对、
 *   其实永远不匹配 —— 组内未转义的 `|` 是「或」不是竖线，`(?: *--- *|)` 于是等价于
 *   「` --- ` 或 空」，`+` 撞上零宽分支即废。分隔行的 `|` 一律要写成 `\|`。
 *   反证：把下面 PIPE_SEP 的 `\|` 去掉，例 ① 与例 ② 会**同时**变绿（② 的「零命中」是假的）。
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { learnToMarkdown } from "./bedrock-corpus.mjs";

/** Learn 的 API 表：两列，含 thead/tbody、冒号命名空间与 `&amp;` 实体（转义腿一起验）。 */
const TABLE_HTML = `<main>
  <h1>Component types</h1>
  <p>Intro paragraph before the table.</p>
  <table>
    <thead><tr><th>Name</th><th>Type</th></tr></thead>
    <tbody>
      <tr><td>minecraft:inventory</td><td>Component</td></tr>
      <tr><td>minecraft:is_stackable &amp; heavier</td><td>Boolean</td></tr>
    </tbody>
  </table>
  <p>Outro paragraph after the table.</p>
</main>`;

/** 管道表**内容**行：`| a | b | …`，**列数无关**（≥2 列）。
 *  ⚠️ 这里原来写成 `/^\|[^|\n]+\|[^|\n]+\|$/`（硬钉两列）⇒ 删掉整个 `tableToMd` 函数例 ①③ 仍全绿
 *  （投毒矩阵 MUT F 实测：三列夹具渲成 `| a | b | c |` 被两列式判 0 行，`bars.length===3` 反而成立）。
 *  列数无关 + 下面的 `!isSep` 才是「有表结构」这件事本身。 */
const PIPE_ROW = /^\|[^|\n]*(?:\|[^|\n]*)+\|$/;
/** 管道表**分隔**行：`| --- | --- |` —— 只有 tableToMd 产这形态。组内的竖线必须转义，见头注释。 */
const PIPE_SEP = /^\|(?: *--- *\|)+$/;
const isSep = (l) => PIPE_SEP.test(l);
const isRow = (l) => PIPE_ROW.test(l) && !isSep(l);

test("learnToMarkdown: <table> → markdown 管道表（表格必须先于通用剥标签走）", () => {
  const md = learnToMarkdown(TABLE_HTML, "https://learn.microsoft.com/bedrock/component-types");
  const lines = md.split("\n").map((l) => l.trim());
  const seps = lines.filter(isSep);
  const rows = lines.filter(isRow);

  // 判别式自身先自证：不成立就说明上面那个正则是空转的，下面的绿全是假的。
  assert.ok(isSep("| --- | --- |"), "PIPE_SEP 判别式失效（组内竖线未转义？）");
  assert.ok(isRow("| Name | Type |") && !isSep("| Name | Type |"), "PIPE_ROW 判别式失效");
  // ① 分隔行存在 ⇒ 走的是 tableToMd，不是把表压成散行文本。
  assert.equal(seps.length, 1, `期望恰有 1 条 | --- | 分隔行，实得 ${seps.length} 条：${JSON.stringify(seps)}`);
  // ② 表头 + 2 条数据行 = 3 条内容行（thead 与 tbody 的 tr 都要收进来）。
  assert.equal(rows.length, 3, `期望 3 条管道表行，实得 ${rows.length} 条：${JSON.stringify(rows)}`);
  // ③ 逐字内容：`&amp;` 要解码成 `&`。
  assert.ok(rows.includes("| Name | Type |"), `表头行缺失，实得 ${JSON.stringify(rows)}`);
  assert.ok(rows.includes("| minecraft:inventory | Component |"), "第一行数据缺失");
  assert.ok(rows.includes("| minecraft:is_stackable & heavier | Boolean |"), "实体解码后的第二行数据缺失");
  // ④ 表外正文没被「表格先走」这一趟挤掉。
  assert.match(md, /^# Component types$/m);
  assert.match(md, /Intro paragraph before the table\./);
  assert.match(md, /Outro paragraph after the table\./);
});

test("反例：通用剥标签先跑（旧序）⇒ 表结构被打散、**没有**管道表", () => {
  // 这份链是 S14-T1 修复**之前** bedrock-corpus.mjs 的原样复刻：先跑
  // `.replace(/<(\w+)[^>]*>/gi, " ")`（它吃掉 `<table>`/`<td>` 的开标签、只留闭标签），
  // 再想用 `/<table[\s\S]*?<\/table>/` 去捞表格 —— 那时已经一个都配不上 ⇒ tableToMd 是死代码。
  // 断言方向因此是「**没有**管道表」，与例 ① 的「有」互为对照。
  let body = TABLE_HTML.slice(TABLE_HTML.indexOf("<main"), TABLE_HTML.indexOf("</main>"));
  body = body.replace(/<(script|style|nav|header|footer|svg|iframe|noscript|aside|form)[\s\S]*?<\/\1>/gi, " ");
  body = body
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_m, t) => `\n\n# ${t.replace(/<[^>]+>/g, "").trim()}\n\n`)
    .replace(/<(p|div|section|tr|br)[^>]*>/gi, "\n")
    .replace(/<(\w+)[^>]*>/gi, " "); // ← 凶手：`<table>` 的开标签在这里消失

  assert.ok(!/<table/i.test(body), "前提不成立：旧序链跑完后 <table> 开标签竟然还在");
  const legacy = body.replace(/<[^>]+>/g, " ");
  // 死代码实锤：表格那一趟即使照跑也命中 0 次。
  assert.equal([...legacy.matchAll(/<table[\s\S]*?<\/table>/gi)].length, 0, "旧序下 tableToMd 仍被触发，顺序断言失效");
  const llines = legacy.split("\n").map((l) => l.trim());
  assert.equal(llines.filter(isSep).length, 0, "旧序竟然产出了 | --- | 分隔行");
  assert.equal(llines.filter(isRow).length, 0, "旧序竟然产出了管道表内容行");
  // 数据还在、但已经扁成散行 —— 这正是「丢了表结构」的形态，也是例 ① 不允许退回的地方。
  assert.match(legacy, /minecraft:inventory\s+Component/);
});

test("learnToMarkdown: 单元格里的竖线被转义，不撑破表", () => {
  const md = learnToMarkdown(
    `<main><h1>T</h1><table><tr><th>A</th><th>B</th></tr><tr><td>x|y</td><td>ok</td></tr></table></main>`,
    "https://learn.microsoft.com/bedrock/pipe",
  );
  const bars = md.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  assert.equal(bars.length, 3, `表头 + 分隔 + 1 数据行 = 3，实得 ${JSON.stringify(bars)}`);
  assert.equal(bars.filter(isSep).length, 1, "分隔行计数不对");
  assert.ok(bars.includes("| x\\|y | ok |"), `竖线未转义：${JSON.stringify(bars)}`);
});

test("learnToMarkdown: 无表格页不受本轮改动影响（标题/列表/代码块/页脚噪音照旧）", () => {
  const md = learnToMarkdown(
    `<main><h1>No table here</h1><h2>Section</h2><ul><li>alpha</li><li>beta</li></ul>` +
      `<pre class="lang-json"><code>{"a": 1}</code></pre>` +
      `<p>Copy Markdown</p><p>Was this page helpful?</p><p>Yes</p><p>No</p></main>`,
    "https://learn.microsoft.com/bedrock/plain",
  );
  assert.match(md, /^# No table here$/m);
  assert.match(md, /^## Section$/m);
  // 实况：`<ul>` 的开标签被通用剥成空格，所以首个 `<li>` 前带一个空格（` - alpha`）。
  // 那是**既有形态**、不在本轮范围（S14 只治表格顺序），这里按实况容忍前导空白。
  assert.match(md, /^[ \t]*- alpha$/m);
  assert.match(md, /^- beta$/m);
  assert.match(md, /```json\n\{"a": 1}\n```/);
  assert.equal(/^\|/m.test(md), false, "无表格页不应凭空长出管道表");
  // NOISE_LINES 两类噪音都要不在：S14 前已滤的 + 本轮新加的。
  for (const noise of ["Copy Markdown", "Was this page helpful?", "Need help with this topic?", "Suggest a fix?"]) {
    assert.ok(!md.includes(noise), `页脚噪音残留：${noise}`);
  }
});

test("learnToMarkdown: 页脚投票 Yes/No/No 删掉，正文里取值 Yes/No 的那行留下", () => {
  // 双向钉：把 `/^Yes$/i`、`/^No$/i` 塞回 NOISE_LINES（裸锚定式）会连正文取值一起吃掉；
  // 完全不处理页脚则 3 行投票漏删。实测语料 773 行整行 Yes/No 中 762 行是页脚（锚点上、距离 1/2/
  // 各 254 行），11 行是正文取值（如 `+ **Required Permission**` 之后的 `No`）—— 见
  // temp/ralph-20260922/logs/v9-far-rows.txt。
  const md = learnToMarkdown(
    `<main><h1>Audit</h1>` +
      `<ul><li><strong>Required Permission</strong></li></ul><p>No</p>` +
      `<p>Body paragraph that keeps the footer far away from the value line.</p>` +
      `<p>Was this page helpful?</p><p>Yes</p><p>No</p><p>No</p></main>`,
    "https://learn.microsoft.com/bedrock/audit",
  );
  const lines = md.split("\n").map((l) => l.trim());
  const votes = lines.filter((l) => l === "Yes" || l === "No");
  assert.equal(votes.length, 1, `页脚 3 行该删、正文 1 行该留，实得 ${JSON.stringify(votes)}`);
  const vi = lines.findIndex((l) => l === "No");
  assert.ok(
    lines.slice(0, vi).some((l) => /Required Permission/.test(l)),
    `留下的 No 不该是正文那一行：${JSON.stringify(lines.slice(0, vi + 1))}`
  );
  assert.ok(!md.includes("Was this page helpful?"), "页脚锚点行没被 NOISE_LINES 滤掉");
  assert.match(md, /Body paragraph/, "「表格/噪音清理」不该吃掉正文段落");
});

test("learnToMarkdown: 窗口边界本身有牙齿 —— 页脚**之后**出现的正文 No 不许被连带删掉", () => {
  // 这条钉的是 `FOOTER_VOTE_WINDOW` 这个**上界**：把判据写成「一路向上找到锚点为止」（去掉窗口）
  // 时，页脚之后正文里的取值 `No` 会被误删，本例即红。语料里 11 行正文取值就是这么来的形态。
  const md = learnToMarkdown(
    `<main><h1>Late</h1>` +
      `<p>Was this page helpful?</p><p>Yes</p><p>No</p><p>No</p>` +
      `<h2>Permission matrix</h2><p>Some far-away paragraph.</p>` +
      `<ul><li><strong>Applies to</strong></li></ul><p>No</p></main>`,
    "https://learn.microsoft.com/bedrock/late",
  );
  const lines = md.split("\n").map((l) => l.trim());
  const votes = lines.filter((l) => l === "Yes" || l === "No");
  assert.equal(votes.length, 1, `页脚 3 行该删、页脚之后那 1 行正文该留，实得 ${JSON.stringify(votes)}`);
  const vi = lines.findIndex((l) => l === "No");
  assert.ok(
    /Permission matrix/.test(lines.slice(0, vi).join("\n")),
    `留下的 No 应当来自页脚之后的小节：${JSON.stringify(lines.slice(0, vi + 1))}`
  );
});

test("learnToMarkdown: 单元格里的 &lt; 不得把后续表格行吞掉（收尾剥标签须认标签名字符）", () => {
  // 真实形状取自 learn 缓存页 block-components：某格正文写 `format_version &lt; 1.19.40)`，
  // 表格趟 decode 之后它就是字面 `<`，收尾那趟若用 /<[^>]+>/ 会一路吞到下一个 `>`。
  const md = learnToMarkdown(
    `<main><h2>Component inventory</h2><table>` +
      `<tr><td>Property</td><td>Type</td></tr>` +
      `<tr><td>minecraft:collision_box</td><td>Boolean</td></tr>` +
      `<tr><td>minecraft:light_emission</td><td>Legacy component (format_version &lt; 1.19.40).</td></tr>` +
      `<tr><td>minecraft:display_name</td><td>String</td></tr>` +
      `</table><p>Far tail with a greater-than sign &gt; and more prose.</p></main>`,
    "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockproperties/block_components",
  );
  const names = [...md.matchAll(/minecraft:[a-z_]+/g)].map((m) => m[0]);
  assert.equal(names.length, 3, `三行组件名都该活着，实得 ${JSON.stringify(names)}`);
  for (const n of ["minecraft:collision_box", "minecraft:light_emission", "minecraft:display_name"]) {
    assert.ok(names.includes(n), `丢了 ${n} ⇒ 剥标签趟又吞行了：${JSON.stringify(md)}`);
  }
  assert.ok(/< 1\.19\.40/.test(md), `单元格里的比较号该原样留下：${JSON.stringify(md)}`);
  assert.ok(
    /Far tail with a greater-than sign > and more prose/.test(md),
    `表格之后的正文不得被连带吞掉：${JSON.stringify(md.slice(-160))}`
  );
  const rows = md.split(/\r?\n/).filter(isRow);
  assert.ok(rows.length >= 4, `管道表行数塌了（实得 ${rows.length}）：${JSON.stringify(rows)}`);
});

