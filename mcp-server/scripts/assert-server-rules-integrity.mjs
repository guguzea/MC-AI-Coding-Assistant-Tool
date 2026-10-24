#!/usr/bin/env node
/**
 * assert-server-rules-integrity —— **服务端面规则载体**（`paper/<ver>/rules/**`）的出处门。
 *
 * ## 为什么需要它（不是"为了对称"）
 * 本仓现有规则面门**扫不到这一面**（2026-10-15 实测）：
 *   - `assert-rules-api-names.mjs:174` 只收 **`.mdc`**（`filter((x) => /\.mdc$/.test(x))`），
 *     而本面用 `.md`；
 *   - `assert-rules-match-tool.mjs` 是 **quilt 专属**（自印「90 个 quilt 源文件 / 10 档 quilt」）。
 * ⇒ 本面 11 个文件的「出处纪律」此前**无人守护**（改错一个 `文件:行` 不会有任何门报警）。
 *
 * ## 判据（四正三补，全部机械可检）
 * ① **出处可解析**：每个 `<name>.md:<line>` 的 `<name>` 必须能在三个语料面里找到同名文件
 *    —— 解析不到 = 编造嫌疑（**这是本门存在的首要理由**）。
 * ② **行号在界内**：`1 ≤ start ≤ end ≤ 文件行数`。
 * ③ **不是空行**：被引的每一行都要有内容（指向空气行 = 出处失效）。
 * ④ **每篇必须有「未核实」段**：本面的写作纪律是"语料证不出的明写未核实"；
 *    缺这一段说明作者没做区分，**判红**（不是风格问题，是可追溯性问题）。
 *
 * ## 三条补腿（2026-10-21 补；对应审查 F-13 的「出处门盲区」）
 * 首版的文法 `CITE_RE` **只收 `<name>.md:<line>`**。实测本面另有 **141 处裸行号**
 * （表格里写 `:29`、正文里写 "见 ```:147-164```"）与 **23 处只写文件名**的提法
 * —— 它们**内容可以全对，但改错不会有任何门报警**（2026-10-20 审查已把这条立成 P2）。
 * 补腿之后判据是：
 * ⑤ **裸行号要能解析**：`:NN` / `:NN-MM` 按**两段式**解析 —— 先取**同一小节内**最近出现的
 *    语料文件名（标题行重置），本节没有则退到**全文**最近的那一个；解析不到 / 越界 /
 *    **起行是空行** 三者任一即红。⚠ 起行判空是**刻意只判起行**：多段落区间天然跨空行，
 *    若照 ③ 的全行判空会逼作者把语义区间改写成"紧贴的非空行"，那是改内容迁就门。
 *    投毒自证里"裸行号指向空行必红"这一臂钉的就是起行。
 * ⑥ **自引要显式**：`本文件:NN` 是**指向本篇规则文件自身**的引法（不是语料件）；
 *    行号对本篇正文核（越界/起行空同样判红）。**裸行号不许用来做自引** —— 否则
 *    "同一个 `:55` 到底是语料第 55 行还是本篇第 55 行"永远说不清，两段式解析也会把它
 *    静默算进语料（那是**假绿**，比漏检更糟）。
 * ⑦ **只写文件名也得解析得到**：行内每个 `.md` 提法要么落在三个语料面，要么是本档
 *    同级规则件（`paper/<ver>/rules/*.md`，即兄弟篇互指）；两者都不是 ⇒ 编造文件名。
 * ⚠ **围栏代码块不参与 ⑤⑥⑦**：``` 里的 `:1` 是 JSON 的 `"height":1`，
 *    扫进来会造出假红（2026-10-21 实测 `09-traps.md:352` 就是这么被误报的）。
 *
 * ## 缺件降级（照本仓既定范式）
 * 语料面是**可选数据包**（`data/` 不进 git）⇒ 缺面默认**降级并吼**、`--require` fail-closed（rc=2）。
 * **降级的那个 0 不是通过。**
 *
 * 退出码：0 = 通过（或缺件降级）；1 = 有判据不达标；2 = 缺件且带 `--require`。
 */
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const DATA = process.env.MC_SKILL_DATA ? resolve(process.env.MC_SKILL_DATA) : join(REPO, "data");

/** 规则载体的扫描面（服务端面）。目录不存在即视为缺面。 */
export const RULES_GLOB_ROOT = join(REPO, "paper");
/** 三个语料面（都是**扁平** processed，故按 basename 解析即可）。 */
export const CORPUS_FACES = [
  "spigot_stable/spigot-javadoc/stable/processed",
  "paper-api_stable/paper-javadoc/stable/processed",
  "paper_stable/paper-docs/stable/processed",
];
/**
 * 出处引用的文法是 `<name>.md:<start>` 或 `<name>.md:<start>-<end>`。
 *
 * ⚠ 文件名类**必须含 `-`**：教程面（PaperMC 官方文档）的页名大量带连字符
 * （`api__plugin-configs.md` / `getting-started__plugin-yml.md` / `api__event-api__event-listeners.md`）。
 * 首版写成 `[A-Za-z0-9_]+` ⇒ 这些名字被**截断成尾部**（`configs.md` / `yml.md` / `listeners.md`）
 * 而误报"解析不到"（2026-10-15 实测）。
 */
export const CITE_RE = /([A-Za-z0-9_-]+\.md):(\d+)(?:-(\d+))?/g;
/**
 * **只写文件名**（不带行号）的提法。与 `CITE_RE` 的差别只看「后面有没有 `:行号`」。
 *
 * ⚠ 左边界排除 `[A-Za-z0-9_.\/-]`：否则 `a@1.2.3/x.md` 会被切出中间段，
 *   右边界排除 `[A-Za-z0-9_-]`：否则 `net.md-5` 会被截成 `net.md`（实测踩到）。
 */
export const NAME_RE = /(?<![A-Za-z0-9_.\/-])([A-Za-z0-9_-]+\.md)(?![A-Za-z0-9_-])/g;
/**
 * **裸行号** `:NN` / `:NN-MM`（前面没有紧跟文件名）。
 *
 * 左边界把 `:` 也排除掉，免得 `:::` 这种告示牌语法被当成行号；后面的否定环视排除
 * `[A-Za-z0-9_.\/-]` 是为了不咬进 `12:34` 这种时间戳与 URL 端口。
 */
export const BARE_REF_RE = /(?<![A-Za-z0-9_.\/:\/-]):(\d+)(?:-(\d+))?/g;
/**
 * **自引** `本文件:NN` / `本文件:NN-MM`（指向本篇规则文件自己，不是语料件）。
 *
 * 为什么单开一条：裸行号与自引在字面上无法区分（都是 `:55`），而两者的**判定对象
 * 完全不同**（语料件 vs 本篇正文）。若允许裸行号做自引，两段式解析会把它静默算进
 * 语料 —— 那是**假绿**。故自引必须显式写 `本文件:`，裸行号一律按语料解释。
 */
export const SELF_REF_RE = /本文件\s*:\s*(\d+)(?:-(\d+))?/g;
/**
 * 自引也可以写成 `本文件 :NN`（中间带空格）—— `SELF_REF_RE` 的 `\s*:` 已容忍；
 * 这里再容忍 `本文件` 与 `:` 之间夹一个空格且冒号后带空格的形态（写作习惯差异）。
 */
/**
 * 每篇必须有的「未核实」**小节**（写作纪律的可检形式）。
 *
 * ⚠ **首版判据只测词是否出现过**（`/未核实/`）—— 太弱：一句话顺带提一次也能过
 * （2026-10-15 用户指出后改）。现要求**真标题**（`^#{1,4} … 未核实`）+ **标题下至少一条**。
 */
export const UNVERIFIED_HEADING_RE = /^#{1,4}\s*.*未核实/m;

/** 收集规则文件（`paper/<ver>/rules/*.md`）。返回 [{file, abs}]。 */
export function collectRuleFiles(root = RULES_GLOB_ROOT) {
  const out = [];
  if (!existsSync(root)) return out;
  for (const ver of readdirSync(root, { withFileTypes: true })) {
    if (!ver.isDirectory()) continue;
    const rulesDir = join(root, ver.name, "rules");
    if (!existsSync(rulesDir)) continue;
    for (const f of readdirSync(rulesDir, { withFileTypes: true })) {
      if (f.isFile() && f.name.endsWith(".md")) out.push({ file: `paper/${ver.name}/rules/${f.name}`, abs: join(rulesDir, f.name) });
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

/**
 * 建语料条目表（三个面合并）。
 *
 * ⚠ **为什么不能只做 basename→路径 的一对一映射**（首版实测踩到）：
 *  - 规则里写的是**短名**（`PluginManager.md:24`）以便阅读，而语料文件名是**完整扁平化**
 *    （`org_bukkit_plugin_PluginManager.md`）⇒ 必须支持**后缀解析**；
 *  - 且 `org_bukkit_*` 在 `spigot_stable` 与 `paper-api_stable` **两个面里都有**（实测跨面重名 1350 个），
 *    同名类在两面的**成员集与行号可能不同** ⇒ 必须保留**多候选**，而不是"先出现的面胜出"。
 */
export function buildCorpusIndex(dataRoot = DATA) {
  const entries = [];
  const faces = [...CORPUS_FACES];
  // 2026-10-23：**真版本签名面**也纳入（`data/paper-api_<ver>/paper-javadoc/<ver>/processed`）。
  // 2026-10-24：`data/spigot_<ver>/spigot-javadoc/<ver>/processed` 一并纳入 —— 版本档里现在有
  // 「本版 Bukkit 核心 vs Paper 扩展」那节，它的指针指到 spigot 的版本面；不纳入就会被判「编造文件名」，
  // 或（更坏）落到 `spigot_stable` 的同名文件上、行号越界而误红。
  // 版本档规则（`paper/<ver>/rules/*.md`）的出处指到**本版本**的签名页。`stable` 已在 CORPUS_FACES 里，跳过免得重复。
  try {
    for (const d of readdirSync(dataRoot, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const m = d.name.match(/^(paper-api|spigot)_(.+)$/);
      if (!m || m[2] === "stable") continue;
      const sub = m[1] === "spigot" ? "spigot-javadoc" : "paper-javadoc";
      const rel = `${d.name}/${sub}/${m[2]}/processed`;
      if (existsSync(join(dataRoot, rel))) faces.push(rel);
    }
  } catch {
    /* data 根不存在 ⇒ 按缺面处理（下游会降级） */
  }
  for (const face of faces) {
    const dir = join(dataRoot, face);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith(".md")) continue;
      entries.push({ base: f.name, abs: join(dir, f.name), face });
    }
  }
  return { entries };
}

/**
 * 取「同档兄弟规则件」的文件名集合（`paper/<ver>/rules/*.md`）。
 *
 * 用途 = 判据 ⑦ 的第二条腿：规则之间**互相点名**是合法引用形态（`见 `04-permissions.md` 的…`），
 * 它们本来就不该出现在语料面里。若不认这一态，每一条兄弟互指都会被判成「编造文件名」。
 * 只收**同一档**（同一个 `rules/` 目录），不收别的档 —— 跨档点名在服务端面没有先例。
 */
export function collectSiblingRuleNames(abs) {
  const dir = dirname(abs);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith(".md"))
    .map((f) => f.name)
    .sort();
}

/**
 * 解析一处出处引用 → 候选列表。
 * 规则：**精确名优先**；无精确则按**后缀**匹配（`PluginManager.md` ⇒ `…_PluginManager.md`）。
 */
export function resolveCite(name, corpus) {
  const exact = corpus.entries.filter((e) => e.base === name);
  if (exact.length) return exact;
  return corpus.entries.filter((e) => e.base.endsWith(`_${name}`));
}

/**
 * 切出「参与引用判定」的行：返回 `[{no, text, inFence}]`。
 *
 * ⚠ **围栏代码块里的内容一律不判引用**（`inFence=true`）。理由不是"偷懒"，是**实测**：
 * `09-traps.md:352` 的 `generator-settings` JSON 里有 `"height":1`，不排除的话
 * `BARE_REF_RE` 会把它读成"裸行号 `:1`"，再去本节最近的文件名（`api__pdc.md`）里找
 * 第 1 行 —— 那是**假红**。围栏里的东西是**被引原文**，不是引用本身。
 *
 * 围栏判定按 CommonMark 的 ``` 与 ~~~ 两种；闭合行本身也标 `inFence`（对齐常见渲染器）。
 */
export function splitJudgeLines(text) {
  const raw = text.split(/\r?\n/);
  const out = [];
  let fence = false;
  for (let i = 0; i < raw.length; i++) {
    const line = raw[i];
    const isFenceMark = /^\s*(```|~~~)/.test(line);
    if (isFenceMark) {
      out.push({ no: i + 1, text: line, inFence: true });
      fence = !fence;
      continue;
    }
    out.push({ no: i + 1, text: line, inFence: fence });
  }
  return out;
}

/**
 * 判一处 `:start[-end]` 在某个候选件里成不成立。
 * @returns {string|null} null = 成立；否则是**为什么红**（用于拼理由，可自查）。
 *
 * ⚠ **只判起行是否为空**（不是判每一行）：多段落区间（如 `getting-started__plugin-yml.md:137-153`
 * 覆盖 `### permissions` 到下一小节）**天然跨空行** —— 照判据 ③ 的全行判空会逼作者
 * 把语义正确的区间改写成"紧贴的非空行"，那是**改内容迁就门**。起行非空才是"这条指针
 * 真的落在东西上"的必要条件；③ 仍按全行判空（显式 `文件:行` 是强声明，标准更严）。
 */
function judgeRange(lines, start, end) {
  if (start < 1 || end < start || end > lines.length) return "越界(共" + lines.length + "行)";
  if (!String(lines[start - 1] ?? "").trim()) return "起行是空行";
  return null;
}

/**
 * 判一篇规则文件的四条件 + 三条补腿。
 * @returns {string[]} problems（空数组 = 通过）
 */
export function judgeRuleFile({ file, abs }, corpus) {
  const problems = [];
  const text = readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);

  // ④ 未核实小节：**真标题 + 至少一条**；行文里提到该词**不算**
  if (!UNVERIFIED_HEADING_RE.test(text)) {
    problems.push(
      `${file}: 缺「未核实」**标题** —— 行文里提到该词不算；本面要求 \`## 未核实\` 形态的真小节，否则无法区分已核实与未核实`,
    );
  } else {
    const hi = lines.findIndex((l) => UNVERIFIED_HEADING_RE.test(l));
    const level = (lines[hi].match(/^#+/) || [""])[0].length;
    let bullets = 0;
    for (let i = hi + 1; i < lines.length; i++) {
      if (/^#{1,4}\s/.test(lines[i]) && (lines[i].match(/^#+/) || [""])[0].length <= level) break;
      if (/^\s*[-*]\s+\S/.test(lines[i])) bullets++;
    }
    if (bullets === 0) {
      problems.push(`${file}: 「未核实」标题下**一条都没有**（空段等于没写 —— 语料证不出的必须逐条列出）`);
    }
  }

  // ①②③ 出处
  const seen = new Set();
  for (const m of text.matchAll(CITE_RE)) {
    const [, name, sStr, eStr] = m;
    const key = `${name}:${sStr}${eStr ? "-" + eStr : ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const start = Number(sStr);
    const end = eStr ? Number(eStr) : start;

    const cands = resolveCite(name, corpus);
    if (cands.length === 0) {
      problems.push(`${file}: 出处 \`${key}\` 解析不到 —— 三个语料面里都没有 ${name} 或其后缀（编造嫌疑）`);
      continue;
    }
    // 多候选：**至少一个面里该行号成立且非空**即算过（同名类在两面里成员集可能不同）；
    // 全部候选都不成立才判红，并把每个候选的实测行数打进理由（可自查）。
    const detail = [];
    let ok = false;
    for (const c of cands) {
      const tl = readFileSync(c.abs, "utf8").split(/\r?\n/);
      const total = tl.length;
      if (start < 1 || end < start || end > total) {
        detail.push(`${c.face}:${total}行(越界)`);
        continue;
      }
      const blanks = [];
      for (let n = start; n <= end; n++) if (!String(tl[n - 1] ?? "").trim()) blanks.push(n);
      if (blanks.length) {
        detail.push(`${c.face}:空行${blanks.join(",")}`);
        continue;
      }
      ok = true;
      break;
    }
    if (!ok) {
      problems.push(`${file}: 出处 \`${key}\` 在任何候选面里都不成立 —— ${cands.length} 个候选：${detail.join(" / ")}`);
    }
  }

  // ⑤⑥⑦ 三条补腿（2026-10-21）：裸行号 / 自引 / 只写文件名。
  // 全部只在**非围栏行**上跑 —— 围栏里是被引原文，不是引用（见 splitJudgeLines 的注释）。
  const judgeLines = splitJudgeLines(text);
  const rulesSiblings = new Set(collectSiblingRuleNames(abs));
  // ⑤ 的两段式上下文：小节内最近文件名 → 全文最近文件名。
  let secCtx = null; // 本节内最近出现的语料文件名（遇标题重置）
  let docCtx = null; // 全文最近出现的语料文件名（不重置，作为本节没提时的兜底）
  for (const { no, text: line, inFence } of judgeLines) {
    if (inFence) continue;
    // 标题行重置「本节」上下文（但不动 docCtx）
    if (/^#{1,6}\s/.test(line)) secCtx = null;

    // 先把本行所有 token 按列位置排好，才能让「行内先后」决定上下文继承顺序。
    //
    // ⚠ **自引的行号段必须先"吃掉"**，否则 `本文件 :99-169` 里的 `:99-169`
    //    会同时被 `SELF_REF_RE` 与 `BARE_REF_RE` 匹配到 ⇒ 同一条引用被判两次：
    //    一次按自引（对、绿）、一次按裸行号继承语料（错、红）—— 那是**假红**
    //    （2026-10-21 实测：`07-pdc.md:97` 就是这么报出来的）。
    //    规则：**自引区间内的裸行号一律跳过**（它已经被更具体的文法消费了）。
    const selfSpans = [];
    for (const m of line.matchAll(SELF_REF_RE)) {
      selfSpans.push([m.index, m.index + m[0].length]);
    }
    const inSelfSpan = (i) => selfSpans.some(([a, b]) => i >= a && i < b);

    const evts = [];
    for (const m of line.matchAll(NAME_RE)) evts.push({ kind: "name", idx: m.index, name: m[1] });
    for (const m of line.matchAll(SELF_REF_RE)) evts.push({ kind: "self", idx: m.index, s: Number(m[1]), e: m[2] ? Number(m[2]) : Number(m[1]) });
    for (const m of line.matchAll(BARE_REF_RE)) {
      if (inSelfSpan(m.index)) continue;
      evts.push({ kind: "bare", idx: m.index, raw: m[0], s: Number(m[1]), e: m[2] ? Number(m[2]) : Number(m[1]) });
    }
    evts.sort((a, b) => a.idx - b.idx);

    for (const e of evts) {
      if (e.kind === "name") {
        // ⑦ 只写文件名：要么是语料件，要么是同档兄弟规则件
        const isCorpus = resolveCite(e.name, corpus).length > 0;
        const isSibling = rulesSiblings.has(e.name);
        if (!isCorpus && !isSibling) {
          problems.push(
            `${file}:${no}: 文件名 \`${e.name}\` 解析不到 —— 三个语料面里没有它（含后缀匹配），也不是同档兄弟规则件（编造文件名嫌疑）`,
          );
          continue;
        }
        // 兄弟规则件不做语料上下文（它是本档内部互指，不是语料出处）
        if (isCorpus) {
          secCtx = e.name;
          docCtx = e.name;
        }
        continue;
      }

      if (e.kind === "self") {
        // ⑥ 自引：行号对**本篇正文**核
        const bad = judgeRange(lines, e.s, e.e);
        if (bad) problems.push(`${file}:${no}: 自引 \`本文件:${e.s}${e.e !== e.s ? "-" + e.e : ""}\` ${bad} —— 自引的行号必须落在本篇正文的非空行上`);
        continue;
      }

      // ⑤ 裸行号：两段式解析
      const ctx = secCtx ?? docCtx;
      if (!ctx) {
        problems.push(
          `${file}:${no}: 裸行号 \`${e.raw}\` 前面（本节与全文）都没有语料文件名可继承 —— 出处无从解析；请写成 \`<文件名>.md:${e.s}\`，指向本篇自身则写 \`本文件:${e.s}\``,
        );
        continue;
      }
      const cands = resolveCite(ctx, corpus);
      const detail = [];
      let ok = false;
      for (const c of cands) {
        const bad = judgeRange(readFileSync(c.abs, "utf8").split(/\r?\n/), e.s, e.e);
        if (bad) {
          detail.push(`${c.face}:${bad}`);
          continue;
        }
        ok = true;
        break;
      }
      if (!ok) {
        problems.push(
          `${file}:${no}: 裸行号 \`${e.raw}\` 继承的 \`${ctx}\` 不成立 —— ${detail.join(" / ")}（裸行号按「本节内最近文件名 → 全文最近文件名」继承；也可直接写全 \`<文件名>.md:${e.s}\`）`,
        );
      }
    }
  }
  return problems;
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
const REQUIRE = process.argv.includes("--require");
const SELFTEST = process.argv.includes("--selftest");

if (SELFTEST) {
  // 纯内存投毒：造一棵假规则树 + 假语料面，验四条判据各自能红、干净能绿。
  const tmp = mkdtempSync(join(tmpdir(), "server-rules-"));
  try {
    const dataRoot = join(tmp, "data");
    const face = join(dataRoot, CORPUS_FACES[0]);
    mkdirSync(face, { recursive: true });
    // 假语料：真文件，10 行，第 5 行是签名、第 6 行是空行
    writeFileSync(
      join(face, "FakeClass.md"),
      Array.from({ length: 10 }, (_, i) => (i === 4 ? "- `void ok()`" : i === 5 ? "" : `line ${i + 1}`)).join("\n"),
      "utf8",
    );
    const rulesDir = join(tmp, "paper", "26.3", "rules");
    mkdirSync(rulesDir, { recursive: true });
    // ⚠ 夹具的「未核实」段必须写**真条目**（`- 文字`）：首版夹具只放一个孤立 `-`，
    //    判据升级为"标题下至少一条"后它自己成了空段 ⇒ 连"干净应绿"都红了。
    //    **是夹具过时，不是门失效** —— 与"投毒夹具没跟上扁平化"同一类教训。
    const OK_SECTION = "\n\n## 未核实\n- 某某项本档未核\n";
    const cases = [
      ["01-ok.md", `# x\n出处 FakeClass.md:5${OK_SECTION}`, 0, "干净应绿"],
      ["02-ghost-file.md", `# x\n出处 NoSuchClass.md:1${OK_SECTION}`, 1, "引到不存在的文件应红"],
      ["03-out-of-range.md", `# x\n出处 FakeClass.md:99${OK_SECTION}`, 1, "行号越界应红"],
      ["04-blank-line.md", `# x\n出处 FakeClass.md:6${OK_SECTION}`, 1, "指向空行应红"],
      ["05-no-unverified.md", "# x\n出处 FakeClass.md:5\n", 1, "完全无未核实应红"],
      // 2026-10-15 用户指出判据太弱后补的两例：词在但无标题 / 有标题但空段
      ["06-word-only.md", "# x\n出处 FakeClass.md:5\n\n本档某处未核实。\n", 1, "只在行文里提该词（无标题）应红"],
      ["07-empty-section.md", "# x\n出处 FakeClass.md:5\n\n## 未核实\n\n", 1, "有「未核实」标题但一条都没有应红"],
      // ── 2026-10-21 补腿 ⑤⑥⑦ 的自证臂（对应审查 F-13「出处门盲区」）──────────────
      // ⑤ 裸行号：本节内继承最近文件名，解析不到 / 越界 / 起行空 都算红。
      ["08-bare-ok.md", `# x\n出处 FakeClass.md 的 \`:5\`${OK_SECTION}`, 0, "裸行号继承本节文件名应绿"],
      ["09-bare-blank.md", `# x\n出处 FakeClass.md 的 \`:6\`${OK_SECTION}`, 1, "裸行号指向空行应红"],
      ["10-bare-noctx.md", `# x\n出处见 \`:5\`${OK_SECTION}`, 1, "裸行号前无任何文件名应红"],
      ["11-bare-oor.md", `# x\n出处 FakeClass.md 的 \`:99\`${OK_SECTION}`, 1, "裸行号越界应红"],
      ["12-bare-docfallback.md", `# a\n出处 FakeClass.md:5\n\n## b\n裸 \`:5\`\n${OK_SECTION}`, 0, "本节没提文件名时退到全文最近（两段式第二段）应绿"],
      // ⑦ 只写文件名：语料件可，兄弟规则件可，其余红。
      ["13-sibling-ok.md", `# x\n见 \`01-ok.md\` 的写法${OK_SECTION}`, 0, "指同档兄弟规则件应绿"],
      ["14-name-ghost.md", `# x\n见 \`NoSuchPage.md\`${OK_SECTION}`, 1, "指向既非语料也非兄弟的文件名应红"],
      // ⑥ 自引：行号对本篇正文核。
      ["15-self-ok.md", `# x\n出处 FakeClass.md:5\n\n自引 本文件:2\n${OK_SECTION}`, 0, "自引落在本篇非空行应绿"],
      ["16-self-oor.md", `# x\n出处 FakeClass.md:5\n\n自引 本文件:99\n${OK_SECTION}`, 1, "自引越界应红"],
      // 围栏不参与判引用：JSON 的 \`"height":1\` 不是裸行号。
      ["17-fence-not-a-ref.md", `# x\n出处 FakeClass.md:5\n\n\`\`\`\n{"height":1}\n\`\`\`\n${OK_SECTION}`, 0, "围栏代码块里的 \`:1\` 不算裸行号（防假红）"],
    ];
    let bad = 0;
    let poisons = 0;
    let cleans = 0;
    const corpus = buildCorpusIndex(dataRoot);
    for (const [name, body, wantProblems, desc] of cases) {
      const abs = join(rulesDir, name);
      writeFileSync(abs, body, "utf8");
      const got = judgeRuleFile({ file: `paper/26.3/rules/${name}`, abs }, corpus).length;
      const ok = wantProblems === 0 ? got === 0 : got > 0;
      if (!ok) bad++;
      if (wantProblems === 0) cleans++;
      else poisons++;
      console.log(`  ${ok ? "✅" : "❌"} ${desc}（期望${wantProblems ? "≥1" : "0"} 个问题，实得 ${got}）`);
    }
    // 计数**动态算**：首版把 "4/4" 硬编码在文案里，加了两例之后输出就对不上了（自印不能撒谎）。
    console.log(
      bad === 0
        ? `投毒自证：${poisons}/${poisons} 畸形必红、${cleans} 例干净必绿 —— 门是活的`
        : `投毒自证失败：${bad} 例不符（共 ${cases.length} 例）`,
    );
    process.exit(bad === 0 ? 0 : 1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

const corpus = buildCorpusIndex();
if (corpus.entries.length === 0) {
  if (REQUIRE) {
    console.log(`❌ --require：三个语料面一个都不在（${CORPUS_FACES.join(" | ")}）`);
    process.exit(2);
  }
  console.log("⚠ 三个语料面都不在 ⇒ 本次**未验证**出处（不是通过）；强口径请加 --require");
  process.exit(0);
}

const files = collectRuleFiles();
if (files.length === 0) {
  if (REQUIRE) {
    console.log(`❌ --require：规则载体一篇都没有（${RULES_GLOB_ROOT}/<ver>/rules/*.md）`);
    process.exit(2);
  }
  console.log(`⚠ 规则载体不存在（${RULES_GLOB_ROOT}/<ver>/rules/*.md）⇒ 本次**未验证**，不是通过`);
  process.exit(0);
}

const problems = [];
for (const f of files) problems.push(...judgeRuleFile(f, corpus));

let citeCount = 0;
for (const f of files) citeCount += [...readFileSync(f.abs, "utf8").matchAll(CITE_RE)].length;

if (problems.length) {
  console.log(`assert-server-rules-integrity: ${problems.length} 项不达标（扫 ${files.length} 篇 / ${citeCount} 处出处）`);
  for (const p of problems.slice(0, 20)) console.log(`  ✗ ${p}`);
  if (problems.length > 20) console.log(`  …（共 ${problems.length} 项，只列前 20）`);
  process.exit(1);
}
console.log(
  `assert-server-rules-integrity: ok（规则 ${files.length} 篇 · 出处 ${citeCount} 处全部可解析且行号在界内 · 每篇均有「未核实」段）`,
);
