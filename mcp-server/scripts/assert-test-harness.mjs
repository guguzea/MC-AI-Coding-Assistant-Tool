/**
 * Static gate：手搓测试 harness 不得把 async 用例当同步用例「假绿」。
 *
 * 背景（真实事故）：test-decompile.mjs 的 `function test(name, fn)` 只写
 *   `fn(); passed += 1;`，于是 `test("...", async () => {...})` 立刻计数为通过，
 *   断言却在之后的任意时机才执行（夹具目录早被 rmSync 删掉），
 *   失败时变成 unhandledRejection 直接崩掉整个套件。
 *   结果：4 个锁 / Java 探测用例长期「绿着但从未运行过」。
 *
 * 两条规则：
 *  R-1 本地同步 harness（没有 thenable 处理）里禁止出现 async 用例调用点；
 *  R-2 本地 harness 必须显式处理 thenable（禁止把「不 await」重新变成静默通过）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const roots = [
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), // mcp-server
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "scripts"), // 根 scripts
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist" || e.name === ".git") continue;
      walk(path.join(dir, e.name), out);
      continue;
    }
    if (/\.(mjs|js)$/.test(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}

/** 本地定义的 `function test(` / `const test = (`（不是 import 自 node:test） */
const LOCAL_HARNESS = /(?:^|\n)\s*(?:async\s+)?function\s+test\s*\(\s*\w+\s*,\s*\w+\s*\)|(?:^|\n)\s*(?:const|let|var)\s+test\s*=\s*(?:async\s*)?\(?/;
/** harness 是否处理了 thenable（返回 promise 也算） */
const THENABLE_AWARE = /\.then\b|typeof\s+\w+\s*===?\s*["']object["']|instanceof\s+Promise|Promise\.resolve\s*\(\s*\)\.then|thenable/i;
/** async 用例被交给本地同步 harness 的调用点 */
const ASYNC_CALLSITE = /(?<![\w.])test\s*\(\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s*,\s*async\b/g;

const problems = [];
let scanned = 0;
let harnesses = 0;

/** 失败出口：process.exit(<非0>) / exitCode = / throw new / fail( */
const FAILURE_EXIT = /\bprocess\.exit\s*\(\s*(?!0\s*\))[^\s)]|\bexitCode\s*=|\bthrow\s+new\b|(?<![\w$])fail\s*\(/;

for (const root of roots) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    if (!LOCAL_HARNESS.test(text)) continue;
    // F95：前置门以前要求计数器叫 passed|failed|failures、后来到 console ——
    // 都可被命名绕过（文件不写 console 就整文件逃检）。现在凡定义本地 test(name, fn) 即入检，
    // 必须同时具备 assert. 调用与失败出口，缺任一项判红。
    scanned += 1;
    const missing = [];
    if (!/\bassert\./.test(text)) missing.push("`assert.` 调用");
    if (!FAILURE_EXIT.test(text)) missing.push("失败出口（`process.exit(<非0>)` / `exitCode =` / `throw new` / `fail(`）");
    if (missing.length) {
      problems.push({
        file,
        why: `本地 harness 缺 ${missing.join(" 与 ")}：没有断言或没有失败出口的测试文件永远绿，入检面不得被命名绕过`,
      });
    }

    const usesNodeTest = /from\s+["']node:test["']/.test(text);
    if (usesNodeTest) continue; // 官方 runner 自己会 await，不在本闸门范围

    harnesses += 1;
    const harnessDecl = text.slice(0, text.indexOf("function test(") > -1 ? text.indexOf("function test(") + 400 : 600);
    if (!THENABLE_AWARE.test(harnessDecl)) {
      problems.push({
        file,
        why: "同步 harness 未处理 thenable：async 用例会被计成通过（假绿）。请让 test() 检出 promise 并判失败，async 用例改用 await atest(...)",
      });
    }
    for (const m of text.matchAll(ASYNC_CALLSITE)) {
      const line = text.slice(0, m.index).split("\n").length;
      problems.push({ file, why: `第 ${line} 行：async 用例交给同步 test() → 改为 await atest(...)`, line });
    }
  }
}

/* ── R-3：audit 脚本里 async 导出必须 await ────────────────────────────────
 * audit-all-tools.mjs 曾把 async 的 getVersionInfo 当同步函数调 4 次：r 恒为
 * Promise，于是「weak」恒报、「constructor」恒误报 ERROR、另两条永远看不到值。
 * R-1/R-2 只看手搓 `function test(name, fn)` harness，这类线性 main() + note()
 * 的脚本落在门外——所以它绿了很久。
 * 判定面：解构导入 + 能在 dist 里解析到 async 声明的绑定。
 * 不覆盖：namespace 导入（const docs = await import(...)）的成员调用；
 *        解析不到声明时跳过（宁漏不误报）。
 */
const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const auditScripts = fs
  .existsSync(scriptsDir)
  ? fs
      .readdirSync(scriptsDir)
      .filter((n) => /^audit-.*\.mjs$/.test(n))
      .map((n) => path.join(scriptsDir, n))
  : [];

/** 在 dist 产物里解析 `<name>` 是否 async；null = 判不了 */
function isAsyncExport(modAbs, name, depth = 0) {
  if (depth > 4 || !fs.existsSync(modAbs)) return null;
  const t = fs.readFileSync(modAbs, "utf8");
  if (new RegExp(`async\\s+function\\s+${name}\\b`).test(t)) return true;
  if (new RegExp(`\\b${name}\\s*=\\s*async\\b`).test(t)) return true;
  if (new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`).test(t)) return false;
  for (const m of t.matchAll(/export\s*\{([^}]*)\}\s*from\s*["'](\.[^"']+)["']/g)) {
    for (const entry of m[1].split(",").map((s) => s.trim()).filter(Boolean)) {
      const [src, local] = entry.split(/\s+as\s+/).map((x) => x.trim());
      if ((local || src) === name) {
        const next = isAsyncExport(path.resolve(path.dirname(modAbs), m[2]), src, depth + 1);
        if (next !== null) return next;
      }
    }
  }
  return null;
}

let auditFiles = 0;
let asyncBindings = 0;
for (const file of auditScripts) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  const IMPORT_RE = /const\s*\{([^}]+)\}\s*=\s*(?:await\s+)?import\(\s*["'](\.[^"']+)["']\s*\)/g;
  const bindings = new Map(); // name -> module file it was imported from
  for (const m of text.matchAll(IMPORT_RE)) {
    if (!m[2].includes("dist")) continue;
    const modAbs = path.resolve(path.dirname(file), m[2]);
    if (!fs.existsSync(modAbs)) continue; // 未 npm run build：不判，别让新克隆变红
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/).pop().trim();
      if (name && !bindings.has(name)) bindings.set(name, modAbs);
    }
  }
  for (const [name, modAbs] of bindings) {
    if (isAsyncExport(modAbs, name) !== true) continue;
    asyncBindings += 1;
    for (const c of text.matchAll(new RegExp(`(?<![\\w$.])${name}\\s*\\(`, "g"))) {
      const lineNo = text.slice(0, c.index).split("\n").length;
      const lineStart = text.lastIndexOf("\n", c.index - 1) + 1;
      const lineEnd = text.indexOf("\n", c.index);
      const line = text.slice(lineStart, lineEnd < 0 ? text.length : lineEnd);
      const before = text.slice(lineStart, c.index);
      if (/(?:^|[^\w$.])await\s+$/.test(before)) continue;
      if (/^\s*$/.test(before) && /\bawait\s*$/.test(lines[lineNo - 2] ?? "")) continue;
      if (/\.then\s*\(|Promise\.(?:all|allSettled)\s*\(|\breturn\s+$/.test(`${line}|${before}`)) continue;
      problems.push({
        file,
        why: `第 ${lineNo} 行：${name}() 是 async 导出但未 await → 断言拿到的是 Promise（假绿/假红）`,
        line: lineNo,
      });
    }
  }
  auditFiles += 1;
}

/* ── R-4：恒真断言（tautology）不得进入测试面（W1-1，2026-09-21）───────────────
 * 当年 5 处「恒真 / 死断言」能红，但**没有任何闸防止它们再退回去** —— 谁把
 * `assert.ok(count >= 0)` 或 `assert.ok(true)` 写回来，全链仍然全绿。
 * 本段只认**静态可判的恒真**：字面真值 / 字面量之间的比较 / 同名自比 / 空测试函数体。
 * 明确**不碰** `x.indexOf(y) >= 0` 这类**存在性**断言 —— 那是真判据（indexOf 为 -1 即失败），
 * 仓内现有 7 处全是这一形态，必须继续放行。
 */
const SELF = fileURLToPath(import.meta.url);
const TAUTOLOGY = [
  [/assert\.ok\s*\(\s*(?:true|!false)\s*[,)]/, "assert.ok(true)"],
  [/assert\.ok\s*\(\s*\d+(?:\.\d+)?\s*(?:>=|<=|>|<)\s*\d+(?:\.\d+)?\s*[,)]/, "字面量之间的恒真比较"],
  [/assert\.(?:equal|strictEqual)\s*\(\s*([A-Za-z_$][\w$.]*)\s*,\s*\1\s*[,)]/, "同名自比（x, x）"],
  [/(?:async\s+)?function\s+test[A-Za-z0-9_]*\s*\([^)]*\)\s*\{\s*\}/, "空测试函数体（无断言）"],
];
let tautologyFiles = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    if (file === SELF) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!/\bassert\.|function\s+test[A-Za-z0-9_]*\s*\(/.test(text)) continue;
    tautologyFiles += 1;
    text.split("\n").forEach((line, idx) => {
      for (const [re, why] of TAUTOLOGY) {
        if (re.test(line)) {
          problems.push({ file, why: `第 ${idx + 1} 行：恒真断言（${why}）—— 断言必须能失败`, line: idx + 1 });
        }
      }
    });
  }
}

/* ── R-5：harness 注释不得写死「门自己现印的分母」（2026-09-28 用户裁定加腿）───────
 * 实况：`test-scripts.mjs` 的数组注释曾写死「registry 门 11 组（4 正控 + 7 投毒）／候选窗门 16 组（4 正控 + 12 投毒）」。
 * 两道门后来各加过臂（argv 白名单两臂 / 判据 6·7·8 三族），09-28 门自印已是 13 与 38 —— 而**注释全程不红**：
 * 条数不是判据（同文件自己写着「条数照例不写死」「地板是数组长度下界，非等式」），所以这一族
 * 「披露位 ≠ 实测量」（CONTRIBUTING `L76`–`L81`）此前只有人眼能抓。本段把它变成腿。
 * 口径三条：
 *  · **只扫注释行**（行首 `//`，或 `/* … *\/` 体内）。代码里的运行时自印（如 `console.log("… 5 组判据 …")`）
 *    是门在报实测量，写死它恰恰是对的 ⇒ 不算命中（自证臂③钉住这条不误伤）。
 *  · **只认与「正控 / 投毒」拆分绑定的分母**这 8 个形状；不碰 `>1 组`、`13 库`、`§#23 八臂`、`L76–L81`
 *    这类既不是分母也没绑拆分的数字（落笔时现扫存量 2 行 3 处 ⇒ 改后 0；文件数与注释行数由本段末尾自己打印，不在这里抄）。
 *  · 命中时只说「臂名该留、数字该删」，不去猜门现在的真实组数（那要 spawn 门，是另一条腿的成本，未做）。
 * 扫描面取两个 root 的**顶层** `test-*.mjs`（不递归）：harness 按定义就在顶层，递归会把 gitignore 的
 * `temp/**` 一次性脚本卷进来 —— 那是别人的 scratch，不该被本门判红。
 */
const R5_HARNESS_RE = /^test-.*\.mjs$/;
const R5_DENOM = [
  [/(\d+)\s*(?:组|例)(?:夹具)?\s*[（(:：=]?\s*(?:\d+\s*)?[^\n]{0,8}?(?:正控|投毒|正对照|反证|反退化|不判红)/, "S1 数量词（组/例）绑用例类别"],
  [/[（(]\s*\d+\s*(?:正控|投毒|正对照|反证|反退化)/, "S2 （N 正控…"],
  [/自检\s*\d+\s*\/\s*\d+/, "S3 自检 N/N"],
  [/(\d+)\s*组\s*[：:]\s*正控/, "S4 N 组：正控"],
  [/自证\s*\d+\s*组/, "S5 自证 N 组"],
  [/selftest[^\n]{0,16}?\d+\s*组/i, "S6 selftest 紧跟 N 组"],
  [/=\s*\d+\s*(?:投毒|正控)/, "S7 = N 投毒"],
  [/正控\s*\d+\s*[／/]\s*投毒\s*\d+/, "S8 正控 x ／投毒 y"],
  [/(\d+)\s*(?:组|例)(?:夹具)?\s*[：:（(=]/, "S9 N 组/例 后直接接冒号或括号（不要求出现类别词也算分母）"],
];
// 形状集在只读探针上量过两件事：① 真分母 7 条正例全抓（含「17 例夹具 + 干净正对照」这种无逐类数字的）；
// ② 6 条散文零误伤（「采集 0 条」「这条投毒」「只剩 1 条正控」「>1 组即红」「argv 白名单两臂…的正控」）。
// 量词只认 组 / 例 —— 这是本判据的误伤闸门：`条` 在中文里既是量词又常指「这一条」，按 条 收必假红。
const R5_FLOOR_FILES = 15; // 口径 = 两 root 顶层 test-*.mjs 文件数；as-of 2026-09-28 09:5x 实测 19；下界，非等式
const R5_FLOOR_LINES = 1500; // 口径 = 上述文件的注释行数；同次实测 2 010；下界（采集塌 ⇒ 本腿未跑 ⇒ 红）

/** 行首 `//` 与 `/* … *\/` 体算注释；行尾拖在代码后的 `//` 不算（那是代码行的注释尾巴，形状不稳）。 */
function r5CommentLines(text) {
  const out = [];
  let inBlock = false;
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    let isComment = false;
    if (inBlock) {
      isComment = true;
      if (t.includes("*/")) inBlock = false;
    } else if (t.startsWith("//")) {
      isComment = true;
    } else if (t.startsWith("/*")) {
      isComment = true;
      if (!t.includes("*/")) inBlock = true;
    }
    if (isComment) out.push({ n: i + 1, line: lines[i] });
  }
  return out;
}

function r5DenomHits(line) {
  return R5_DENOM.filter(([re]) => re.test(line)).map(([, why]) => why);
}

let r5Files = 0;
let r5CommentLineCount = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const name of fs.readdirSync(root)) {
    if (!R5_HARNESS_RE.test(name)) continue;
    const file = path.join(root, name);
    if (!fs.statSync(file).isFile()) continue;
    r5Files += 1;
    for (const { n, line } of r5CommentLines(fs.readFileSync(file, "utf8"))) {
      r5CommentLineCount += 1;
      for (const why of r5DenomHits(line)) {
        problems.push({
          file,
          line: n,
          why:
            `第 ${n} 行：harness 注释写死了门自印的分母（形状「${why}」）—— 臂名与判据名该留，` +
            "组数以该门 `--selftest` 现印为准；注释里的数字不是判据，门不会因为它红（本轮就是这么漂的）",
        });
      }
    }
  }
}
if (r5Files < R5_FLOOR_FILES) {
  problems.push({ file: SELF, why: `[R-5-FLOOR] 只扫到 ${r5Files} 个 harness 文件（地板 ${R5_FLOOR_FILES}）⇒ 采集面塌，本腿未跑，禁止按「零命中」放行` });
}
if (r5CommentLineCount < R5_FLOOR_LINES) {
  problems.push({ file: SELF, why: `[R-5-FLOOR] 只扫到 ${r5CommentLineCount} 行注释（地板 ${R5_FLOOR_LINES}）⇒ 注释提取器挂了（行首形状 / 块注释状态机被动过？），本腿未跑` });
}

// 自证臂（纯内存，不落盘、不 spawn、**不写死条数** —— 分母由数组现取，本门正是抓写死分母的）。
// 两类：`false` = 这条注释**不许**判红（散文里的 0 条 / 这一条 / >1 组 / N 臂 都不是分母）；
//       `true`  = 这条**必须**判红（各种把门自印的组数抄进注释的写法）。
// 没有这一段，「注释零命中」与「判据根本没跑」在 rc 上长得一模一样（本仓反复栽过的形状）。
const R5_ARMS = [
  ["不许误伤①只列臂名不写数", "// 该门管「坏 limit 被放行必须红」；条数以门自己 --selftest 现印为准 ⇒ 这里不写数", false],
  ["不许误伤②非分母数字", "// 判据 7（classes.official 冒出 >1 组即红）· 13 库现扫 0 组 · §#23 八臂 · 同族见 L76–L81", false],
  ["不许误伤③带臂名无拆分", "// 候选窗门管「摘掉 candidatesTotal」「真池数小于样本」各必须红，条数以门现印为准", false],
  ["不许误伤④散文里的「0 条」", "// 4 空格 / tab / 压成一行的 manifest 采集 0 条 ⇒ 静默放行（= 第 32 轮 P2 反证抓到的「恒真于空」）。", false],
  ["不许误伤⑤「这条投毒」不是分母", "// 先自证「旧正则在该形状下确实采 0 条」——否则这条投毒不构成对旧洞的反证。", false],
  ["不许误伤⑥「只剩 1 条正控」是设计描述", "// （两臂活证：原样 rc=0、砍到只剩 1 条正控 ⇒ rc=1 且点名三桶塌陷）。", false],
  ["不许误伤⑦臂名里带「正控/投毒」二字但无数量词", "// 另带 argv 白名单两臂（认 `--selftest` 的正控 + `--census` 必须进 unknown 的投毒）；", false],
  ["必抓①N 组（M 正控 + K 投毒", "// registry 门 11 组（4 正控 + 7 投毒，含「坏 limit 被放行必须红」）", true],
  ["必抓②N 组：正控 x / 投毒 y", "// 上面那道的自证（--selftest 8 组：正控 1 / 投毒 7）", true],
  ["必抓③自证 N 组", "// 上面那道的自证 16 组，覆盖披露/次序/正控/棘轮四判据", true],
  ["必抓④自检 N/N", "// 该门自检 38/38 通过 ⇒ 注释里抄了一份", true],
  ["必抓⑤N 例（x 正控 + y 投毒 + z 反证", "// L89 执法腿的自证：该门带 10 例（2 正控 + 6 投毒 + 2 反证）", true],
  ["必抓⑥N 例 = x 投毒必红 + y 不判红", "// 库坐标门的自证（23 例 = 16 投毒必红 + 7 不判红对照 + 真实输入正对照）", true],
  ["必抓⑦N 例夹具 + 正对照（无逐类数字也算分母）", "// 各必须当场红（17 例夹具 + 干净正对照）。", true],
  ["必抓⑧N 例：直接枚举臂名（不含类别词）", "// §6.8 缺口②：跨层名门的自证（15 例：四腿判据 / 层推导 / 代码位抽取 / 端到端先红后绿）。", true],
];
let r5ArmsOk = 0;
let r5ArmPos = 0;
let r5ArmNeg = 0;
for (const [name, text, mustFire] of R5_ARMS) {
  const fired = r5DenomHits(text).length > 0;
  mustFire ? (r5ArmPos += 1) : (r5ArmNeg += 1);
  if (fired === mustFire) {
    r5ArmsOk += 1;
  } else {
    problems.push({
      file: SELF,
      why: `R-5 自证臂「${name}」不符：该臂${mustFire ? "必须判红却零命中（分类器熄火 ⇒ 本腿不可信）" : "不许判红却命中了（误伤散文 ⇒ 下次没人信这条腿）"} —— 形状 ${JSON.stringify(r5DenomHits(text))}`,
    });
  }
}
// 提取器自己也要一臂：代码行（门的运行时自印）必须留在面外，否则本门会去咬 `console.log("… 5 组判据 …")`。
const r5CodeLine = '  console.log("  #19 scriptapi 大小写碰撞 / 索引剪枝: 5 组判据（含真实 624 声明的可跑性）");';
const r5ExtractorOk = r5CommentLines(r5CodeLine).length === 0;
if (!r5ExtractorOk) {
  problems.push({ file: SELF, why: "R-5 提取器自证挂：console.log 代码行被判成注释行 ⇒ 本门会咬门的运行时自印（那是量具正确行为，不是缺陷）" });
} else {
  r5ArmsOk += 1;
}
const R5_ARM_TOTAL = R5_ARMS.length + 1; // +1 = 提取器那条
if (R5_ARM_TOTAL < 12) {
  problems.push({ file: SELF, why: `[R-5-FLOOR] 自证臂只剩 ${R5_ARM_TOTAL} 条（地板 12）⇒ 有人删臂，「注释零命中」不再可信` });
}
if (r5ArmNeg < 5 || r5ArmPos < 6) {
  problems.push({ file: SELF, why: `[R-5-FLOOR] 自证臂两类各须 ≥5(不误伤)/≥6(必抓)，现 ${r5ArmNeg}/${r5ArmPos} ⇒ 只剩「投毒必红」这一侧的臂等于没有对照` });
}

if (problems.length) {
  console.error("assert-test-harness: 发现「绿着但从未执行 / 恒真断言 / 注释替实现撒谎」风险（R-1·R-2 harness 假绿 / R-3 audit 未 await / R-4 恒真 / R-5 注释写死门自印分母）：");
  for (const p of problems) console.error(`  ${path.relative(process.cwd(), p.file)} :: ${p.why}`);
  console.error("\n这类代码会「绿着但从未执行」或「恒报一个拿不到值的结论」。harness 侧见 test-decompile.mjs 的 test()/atest() 写法。");
  process.exit(1);
}
console.log(`assert-test-harness: ok (${harnesses} 个手搓 harness 已锁死 thenable 处理)`);
console.log(`assert-test-harness: ok R-3 (${auditFiles} 个 audit 脚本 / ${asyncBindings} 个 async 导出绑定已核 await)`);
console.log(`assert-test-harness: ok R-4 (${tautologyFiles} 个含断言的测试文件已扫恒真形态：字面真值 / 字面量比较 / 同名自比 / 空测试体)`);
console.log(
  `assert-test-harness: ok R-5 (${r5Files} 个顶层 test-*.mjs / ${r5CommentLineCount} 行注释已扫 ${R5_DENOM.length} 种「分母绑用例类别」形状 · 现存命中 0 · ` +
    `自证臂 ${r5ArmsOk}/${R5_ARM_TOTAL}（${r5ArmNeg} 条不许误伤 + ${r5ArmPos} 条必抓 + 提取器 1）· 地板 文件≥${R5_FLOOR_FILES} 注释行≥${R5_FLOOR_LINES} 臂≥12)`,
);
