#!/usr/bin/env node
/**
 * assert-tool-name-refs.mjs —— 「工具名引用」门（P0-A5，2026-11-04）
 *
 * 管什么：**注册工具时传出去的 description / title 文本**（以及 CLI list-tools 读的那份
 *   schema 清单 description、src/prompts/templates.ts 的工作流模板正文）里出现的
 *   「工具名形状」标识符（形如 [a-z][a-z0-9]*(_[a-z0-9]+)+），若既不是**已注册的工具名**、
 *   在**仓库源码里也找不到任何别的出处** ⇒ 红【TOOL-NAME-UNKNOWN】。
 *
 * 为什么立这道门（对标项目的反面教材）：mcp-rogal 的 FakePlayersTool.java:48 描述里写了不存在的
 *   click_dialog_button、OpenScreenTool.java:74 写了 set_option（真名是 options）——
 *   模型会照着 description 去调不存在的工具，而这类缺陷此前**没有任何门**能看见。
 *
 * 真值源（两条，互为交叉校验）：
 *   ① src/tool-registry.ts / src/wave/register.ts 里 server.registerTool(<name>, {...}) 的 name
 *      （字面量，或 xxxSchema.name —— 后者从 export const xxxSchema = { name: "..." } 现解析）；
 *   ② 同一对文件里 indexToolSchemas / waveToolSchemas 数组每条的 name: "..."。
 *   两集合**必须相等**（这正是本仓 tool-registry.ts:1435 那条 F-8 注记写下的契约：
 *   「index 清单 = index 注册」，此前 47 vs 46 数错过一次）。任一侧少了/多了 ⇒ 红【REGISTRY-DRIFT】。
 *   ⚠ 计数**不写死**：加工具是合法动作，写死 89 会让下一次合法加门必红（等式棘轮反面教材）。
 *
 * 判据（三层，逐层过滤误报）：
 *   ① 命中名 ∈ 注册表 ⇒ 绿（桶 registered）。
 *   ② 命中名在**仓库源码**（mcp-server/src/**，**扣掉被扫描的描述面本身**）里另有出处
 *      —— 代码标识符或字符串字面量（参数名 minecraft_version / 枚举值 loot_table /
 *      字段 highlight_key / 计划动作 query_inventory_slot / 档名 fabric_1.21.11 …）
 *      ⇒ 绿（桶 declared-elsewhere，附出处 路径:行号）。
 *   ③ 其余 ⇒ 红，除非该 id 被**棘轮基线** tool-name-refs-baseline.json 钉住（桶 pinned）。
 *   为什么要有②：本门首测的命中里绝大多数是参数名/档名/文件名，**不是**工具引用；
 *   没有②就得把几十条误报全塞进基线，等于把门调软。② 的判据是「有出处」，不是「看着像」。
 *   活性证据（防②变成万能橡皮章）：对全部真工具名各造两种打字错误（去尾字母 / 去掉第一个下划线），
 *   **0 个**能靠②隐身（脚本每次真跑现算并打印，见 blindSpotProbe）⇒ ② 不是「什么都放过」。
 *
 * 棘轮（基线条数只许降）：
 *   - ratchet.ceiling 不得大于本脚本里冻结的 FROZEN_CEILING（要放宽得改脚本，改不动就看不见）；
 *   - 基线钉住的条数不得大于 ratchet.ceiling；
 *   - 基线条目**已不再是红** ⇒ 红【BASELINE-STALE】，逼作者当场删条目（只许降，不留陈旧账）。
 *
 * 不依赖 dist：照 assert-generator-template-safety.mjs 的先例**直接读 src/** 源码**做静态解析
 *   （自带的轻量 TS 表达式解析器认字符串字面量 + 同文件/跨文件的顶层 const 常量，并**跟进零参函数体**
 *   —— 如 GENERATE_NETWORK_PACKET_DESCRIPTION = generateNetworkPacketDescription()，不跟进这段描述
 *   在静态解析里就是空的），所以 dist 坏了/旧了它照样能跑。**不跑 tsc、不 spawn 任何子进程。**
 *   解析结果近乎空的描述面会进「薄面读数」打印（现 0 段）—— 那是本门自曝的盲区，不是静默放过。
 *
 * 不写盘：本门**零写盘**（连 --tsv 也走 stdout）。同仓先例 assert-rules-api-names.mjs 用
 *   --queue=<绝对路径> 落 TSV，那需要在 _lib/script-write-guard-check.mjs 的 NON_WRITERS 里签字
 *   —— 那个文件不在本任务的写范围内，故此处改成 stdout（人工审：node ... --tsv > x.tsv）。
 *
 * 拦得住什么 / 拦不住什么：
 *   拦得住：描述里点名了**不存在**的工具名（发明名 / 少一个字母 / 写成另一个真名）；
 *           title 与 description 两面都扫；CLI 清单那份 description 与模板正文也扫；
 *           注册表两条真值源漂移；基线被抬高或被塞陈旧条目。
 *   拦不住：① 描述里写的是**正确**的工具名但语义写错（「用 query_api 查 Fabric API」）；
 *           ② 名字**没下划线**的工具（形状要求至少一个下划线，本仓现 89 个全满足）；
 *           ③ 该名字在仓库别处**另有出处**时被②放过 —— 例如某名字恰好是某个枚举值/字段名；
 *           ④ 描述里只写了自然语言、一个标识符都没有（「用那个查文档的工具」）；
 *           ⑤ 别的文件（非注册面 / 非 templates.ts）里的散文提及；
 *           ⑥ 描述由**带参函数 / 数据 / 运行时拼接**生成的（静态解析看不到正文）—— 现盘只有零参函数
 *              一处且已跟进；新出现这类描述会被「薄面读数」点名，但**不判红**（宁可点名，不假装覆盖）。
 *
 * 用法：
 *   node scripts/assert-tool-name-refs.mjs              # 真跑（0 红才 rc=0）
 *   node scripts/assert-tool-name-refs.mjs --selftest   # 判据活性自证（内存夹具，不 spawn）
 *   node scripts/assert-tool-name-refs.mjs --tsv        # 全部命中出 TSV（stdout，人工审）
 *   node scripts/assert-tool-name-refs.mjs --print-baseline  # 按当前红集打印基线 JSON（stdout）
 * 自证含一条**假根端到端臂**（**纯内存**造一份最小 src 源码集喂给真 runGate：同一棵树上投毒必红 /
 * 名字改对必绿），不落盘、不 spawn、不碰真 src —— 证明本门的解析器 + 判据接起来是活的，而不是只有
 * 纯函数在自说自话。为什么不落 OS tmpdir：本脚本在 scripts/ 下，任何写盘原语都会让
 * assert-script-write-guard（默认 npm test 链上的 S20 门）判本门「会写仓库文件」；纯内存是更强的形态。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, ".."); // mcp-server/
const REPO_ROOT = path.resolve(PKG, "..");
const SRC = path.join(PKG, "src");
const BASELINE_PATH = path.join(HERE, "tool-name-refs-baseline.json");
const TEMPLATES_REL = "prompts/templates.ts";
/** 冻结上界：基线只许降到这个数以下；要放宽**必须改本行**（改不动就看不见）。 */
const FROZEN_CEILING = 12;

const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join("/");
const lineAt = (text, index) => text.slice(0, index).split("\n").length;

// ── 轻量 TS 源码解析（不依赖 tsc / dist）────────────────────────────────────

/** 从 text[i]（一个开括号）扫到配对的闭括号，返回**闭括号之后**的下标。跳过字符串/模板/注释。 */
export function findBalancedEnd(text, i) {
  const open = text[i];
  const close = open === "{" ? "}" : open === "(" ? ")" : "]";
  let depth = 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") { i = skipString(text, i) - 1; continue; }
    if (c === "/" && text[i + 1] === "/") { while (i < text.length && text[i] !== "\n") i++; continue; }
    if (c === "/" && text[i + 1] === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i++; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return i + 1; }
  }
  return text.length;
}
/** 跳过 text[i] 处的一个字符串/模板字面量，返回其后下标。模板的插值段走括号配平。 */
export function skipString(text, i) {
  const q = text[i];
  i++;
  while (i < text.length && text[i] !== q) {
    if (text[i] === "\\") { i += 2; continue; }
    if (q === "`" && text[i] === "$" && text[i + 1] === "{") { i = findBalancedEnd(text, i + 1); continue; }
    i++;
  }
  return i + 1;
}
/** 顶层 const NAME = <expr> 的初始化式结束位（分号在括号深度 0 处）。 */
function findStatementEnd(text, i) {
  let depth = 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") { i = skipString(text, i) - 1; continue; }
    if (c === "/" && text[i + 1] === "/") { while (i < text.length && text[i] !== "\n") i++; continue; }
    if (c === "/" && text[i + 1] === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i++; continue; }
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth--;
    else if (c === ";" && depth === 0) return i;
  }
  return text.length;
}
/** 把一段表达式拆成「字符串字面量」与「标识符」两种 token（转义按 JS 语义还原）。 */
export function tokenizeExpr(expr) {
  const out = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let s = "";
      const start = i;
      i++;
      while (i < expr.length && expr[i] !== q) {
        if (expr[i] === "\\") {
          const e = expr[i + 1];
          s += e === "n" ? "\n" : e === "t" ? "\t" : e === "r" ? "\r" : e;
          i += 2;
          continue;
        }
        if (q === "`" && expr[i] === "$" && expr[i + 1] === "{") { i = findBalancedEnd(expr, i + 1); continue; }
        s += expr[i];
        i++;
      }
      i++;
      out.push({ kind: "str", value: s, start });
    } else if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < expr.length && /[\w$]/.test(expr[j])) j++;
      out.push({ kind: "id", value: expr.slice(i, j), start: i });
      i = j;
    } else i++;
  }
  return out;
}
/** 顶层 const 表：name → {file, start, end, expr}；重名（跨文件同名）一律剔除并记入 dupes。 */
export function collectConsts(sources) {
  const consts = new Map();
  const dupes = new Set();
  for (const { file, text } of sources) {
    const re = /^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::[^=\n]*)?=\s*/gm;
    let m;
    while ((m = re.exec(text))) {
      const name = m[1];
      const start = re.lastIndex;
      const end = findStatementEnd(text, start);
      if (consts.has(name)) { dupes.add(name); consts.delete(name); }
      else if (!dupes.has(name)) consts.set(name, { file, start, end, expr: text.slice(start, end) });
    }
  }
  return { consts, dupes };
}
/** 顶层 `function NAME(...)` 表（含 export / async）：name → {file, start, end, body}。 */
export function collectFunctions(sources) {
  const funcs = new Map();
  const dupes = new Set();
  for (const { file, text } of sources) {
    const re = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm;
    let m;
    while ((m = re.exec(text))) {
      const name = m[1];
      const afterParams = findBalancedEnd(text, m.index + m[0].length - 1);
      let i = afterParams;
      while (i < text.length && text[i] !== "{") i++;
      if (i >= text.length) continue;
      const bodyEnd = findBalancedEnd(text, i);
      if (funcs.has(name)) { dupes.add(name); funcs.delete(name); }
      else if (!dupes.has(name)) funcs.set(name, { file, start: m.index, end: bodyEnd, body: text.slice(i, bodyEnd) });
    }
  }
  return { funcs, dupes };
}

/**
 * 把一段表达式解析成文本：字符串字面量取内容，标识符按顶层 const 递归展开（循环引用靠 seen 断）；
 * 零参函数调用（`f()`，如 GENERATE_NETWORK_PACKET_DESCRIPTION = generateNetworkPacketDescription()）
 * 再进函数体取字面量 —— 否则这类描述在静态解析里是**空的**，本门会漏扫（首测实测 2 段，见薄面读数）。
 * ★ 相邻片段之间**必须插分隔符**：本门首跑实测，"…请先 list_doc_versions" + "true 时…" 这类
 *   相邻字面量若直接拼会造出 list_doc_versionstrue 这个**不存在的名字**（假红）。
 *   插空格只可能**少**发现「被拆开写的名字」，不会凭空造名字 —— 对名字存在性门是安全方向。
 */
export function resolveExpr(expr, consts, seen = new Set(), unresolved = null, used = null, funcs = null) {
  const parts = [];
  for (const tk of tokenizeExpr(expr)) {
    if (tk.kind === "str") { parts.push(tk.value); continue; }
    if (seen.has(tk.value)) continue;
    const c = consts.get(tk.value);
    if (c) {
      seen.add(tk.value);
      if (used) used.add(tk.value);
      parts.push(resolveExpr(c.expr, consts, seen, unresolved, used, funcs));
      continue;
    }
    if (funcs && funcs.has(tk.value) && expr.slice(tk.start + tk.value.length).trimStart().startsWith("(")) {
      const fn = funcs.get(tk.value);
      seen.add(tk.value);
      if (used) used.add(tk.value);
      parts.push(resolveExpr(fn.body, consts, seen, unresolved, used, funcs));
      continue;
    }
    if (unresolved) unresolved.add(tk.value);
  }
  return parts.filter((p) => p !== "").join(" ");
}
/** 工具名形状：小写起头、至少一个下划线分段。 */
export const TOOL_SHAPE_SOURCE = "[a-z][a-z0-9]*(?:_[a-z0-9]+)+";
/** 文本里的工具名形状标识符（前后不得再是词字符 ⇒ 不会从档名里切出片段）。 */
export function candidateIds(text) {
  const re = new RegExp(TOOL_SHAPE_SOURCE, "g");
  const out = [];
  let m;
  while ((m = re.exec(text))) {
    const id = m[0];
    const before = text[m.index - 1];
    const after = text[m.index + id.length];
    if (before && /\w/.test(before)) continue;
    if (after && /\w/.test(after)) continue;
    out.push({ id, index: m.index, context: text.slice(Math.max(0, m.index - 28), m.index + id.length + 28).replace(/\s+/g, " ") });
  }
  return out;
}
/** 扫全文件的字符串字面量（跳过注释与模板插值里的代码）。 */
export function forEachStringLiteral(text, cb) {
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let s = "";
      const start = i;
      i++;
      while (i < text.length && text[i] !== q) {
        if (text[i] === "\\") {
          const e = text[i + 1];
          s += e === "n" ? "\n" : e === "t" ? "\t" : e === "r" ? "\r" : e;
          i += 2;
          continue;
        }
        if (q === "`" && text[i] === "$" && text[i + 1] === "{") { i = findBalancedEnd(text, i + 1); continue; }
        s += text[i];
        i++;
      }
      i++;
      cb(s, start);
    } else if (c === "/" && text[i + 1] === "/") { while (i < text.length && text[i] !== "\n") i++; }
    else if (c === "/" && text[i + 1] === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i += 2; }
    else i++;
  }
}
/** 抽注册面：每个 registerTool(<nameArg>, { title, description, inputSchema }, …)。 */
export function extractRegistrations(text, file) {
  const out = [];
  const re = /registerTool\(\s*/g;
  let m;
  while ((m = re.exec(text))) {
    let i = re.lastIndex;
    const nameStart = i;
    let nameEnd;
    if (text[i] === '"') nameEnd = text.indexOf('"', i + 1) + 1;
    else { let j = i; while (j < text.length && text[j] !== ",") j++; nameEnd = j; }
    const nameArg = text.slice(nameStart, nameEnd).trim();
    i = nameEnd;
    while (i < text.length && text[i] !== ",") i++;
    i++;
    while (i < text.length && /\s/.test(text[i])) i++;
    const line = lineAt(text, m.index);
    if (text[i] !== "{") { out.push({ file, line, nameArg, titleExpr: null, descExpr: null, start: nameStart, end: nameEnd }); continue; }
    const objStart = i;
    const objEnd = findBalancedEnd(text, i);
    const obj = text.slice(objStart, objEnd);
    const tm = /title:\s*([\s\S]*?),\r?\n\s*(?:description|inputSchema)/.exec(obj);
    const dm = /description:\s*([\s\S]*?),\r?\n\s*(?:inputSchema|annotations|title)/.exec(obj);
    out.push({ file, line, nameArg, titleExpr: tm ? tm[1] : null, descExpr: dm ? dm[1] : null, start: objStart, end: objEnd });
  }
  return out;
}
/** 抽 export const <arrayName> = [ { name: "…", description: …, inputSchema: … }, … ] 每一条。 */
export function extractArrayEntries(text, arrayName) {
  const decl = text.indexOf("export const " + arrayName);
  if (decl < 0) return null;
  const close = text.indexOf("\n];", decl);
  const segEnd = close < 0 ? text.length : close + 3;
  const seg = text.slice(decl, segEnd);
  const out = [];
  const startRe = /\{\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = startRe.exec(seg))) {
    const braceStart = seg.lastIndexOf("{", m.index + 1);
    const braceEnd = findBalancedEnd(seg, braceStart);
    const obj = seg.slice(braceStart, braceEnd);
    const dm = /description:\s*([\s\S]*),\s*inputSchema\s*:/.exec(obj);
    out.push({
      file: null,
      name: m[1],
      descExpr: dm ? dm[1] : null,
      start: decl + braceStart,
      end: decl + braceEnd,
      line: lineAt(text, decl + braceStart),
    });
  }
  return { entries: out, start: decl, end: segEnd };
}
/** xxxSchema.name → export const xxxSchema = { name: "…" } 现解析。 */
export function resolveNameArg(nameArg, consts) {
  if (nameArg.startsWith('"')) return nameArg.slice(1, -1);
  const m = /^([\w$]+)\.name$/.exec(nameArg);
  if (!m) return null;
  const c = consts.get(m[1]);
  if (!c) return null;
  const n = /name:\s*"([^"]+)"/.exec(c.expr);
  return n ? n[1] : null;
}

// ── 判据（纯函数，selftest 直接喂内存夹具）──────────────────────────────────

/**
 * 三层判据 + 棘轮。
 * @returns {{buckets:object, redIds:string[], unpinned:string[], stale:string[], ceiling:number, frozenCeiling:number, errors:string[]}}
 */
export function judgeRefs({ candidates, registry, vocab, pinned = [], ceiling, frozenCeiling }) {
  const buckets = { registered: [], declared: [], red: [], pinned: [] };
  // bucketById：按 **id** 归位。★ 不能用 `buckets.declared.includes(c)` 判桶 —— declared 那桶里放的是
  // 加了 evidence 的**副本**，对象身份比较必落空，会把 300 多条「另有出处」全标成 RED（首版实测的错标）。
  const bucketById = new Map();
  const redIds = new Set();
  for (const c of candidates) {
    if (registry.has(c.id)) { buckets.registered.push(c); bucketById.set(c.id, "registered"); continue; }
    if (vocab.has(c.id)) { buckets.declared.push({ ...c, evidence: vocab.get(c.id) }); bucketById.set(c.id, "declared-elsewhere"); continue; }
    redIds.add(c.id);
  }
  const pinMap = new Map(pinned.map((p) => [p.id, p]));
  const unpinned = [...redIds].filter((id) => !pinMap.has(id)).sort();
  const stale = [...pinMap.keys()].filter((id) => !redIds.has(id)).sort();
  for (const c of candidates) if (redIds.has(c.id) && pinMap.has(c.id)) buckets.pinned.push(c);
  for (const id of redIds) bucketById.set(id, pinMap.has(id) ? "pinned" : "RED");
  const errors = [];
  // 豁免台账质量：每条基线必须写清「为什么」并记下观测位点（否则基线会退化成一张无依据的免死金牌）
  for (const p of pinned) {
    if (!p || typeof p.id !== "string" || !p.id) { errors.push("[BASELINE-LEDGER] 基线条目缺 id：" + JSON.stringify(p)); continue; }
    if (!p.reason || !String(p.reason).trim()) errors.push("[BASELINE-LEDGER] 基线条目 " + p.id + " 缺 reason（必须写清为什么它不是工具引用）");
    if (!Array.isArray(p.sites) || p.sites.length === 0) errors.push("[BASELINE-LEDGER] 基线条目 " + p.id + " 缺 sites（必须记下观测到的位点）");
  }
  if (typeof frozenCeiling === "number" && ceiling > frozenCeiling) {
    errors.push("[RATCHET-RAISED] 基线上界 " + ceiling + " > 冻结上界 " + frozenCeiling + " ⇒ 棘轮只许降，不许抬");
  }
  if (pinMap.size > ceiling) {
    errors.push("[RATCHET-OVERFLOW] 基线钉住 " + pinMap.size + " 条 > 上界 " + ceiling + " ⇒ 棘轮只许降");
  }
  if (stale.length) {
    errors.push("[BASELINE-STALE] 基线条目已不再是红 ⇒ 请从基线删除（只许降，不留陈旧账）：" + stale.join(", "));
  }
  if (unpinned.length) {
    errors.push(
      "[TOOL-NAME-UNKNOWN] 描述/模板里出现「工具名形状」但**未注册、源码里也无出处**的标识符 " +
        unpinned.length + " 个（模型会照着去调不存在的工具）：\n" +
        unpinned
          .map(
            (id) =>
              "    " + id + "  ← " +
              [...new Set(candidates.filter((c) => c.id === id).map((c) => c.site + " [" + c.surface + "]"))].join(" · "),
          )
          .join("\n"),
    );
  }
  return { buckets, bucketById, redIds: [...redIds].sort(), unpinned, stale, ceiling, frozenCeiling, errors };
}
/** 两条真值源必须相等（这是本仓自己写下的契约，不是外部假设）。 */
export function checkRegistryConsistency(regNames, arrNames) {
  const a = [...regNames].sort();
  const b = [...arrNames].sort();
  const missingInArray = a.filter((x) => !arrNames.has(x));
  const missingInReg = b.filter((x) => !regNames.has(x));
  const errors = [];
  if (missingInArray.length) errors.push("[REGISTRY-DRIFT] registerTool 注册了、schema 清单里没有：" + missingInArray.join(", "));
  if (missingInReg.length) errors.push("[REGISTRY-DRIFT] schema 清单里有、registerTool 没注册：" + missingInReg.join(", "));
  return { errors, regCount: a.length, arrCount: b.length };
}
/** 对每个真工具名造两种打字错误（去尾字母 / 去掉第一个下划线），数出「靠②有出处隐身」的条数。 */
export function blindSpot(registry, vocab) {
  let probed = 0;
  const hidden = [];
  for (const n of registry) {
    for (const v of new Set([n.slice(0, -1), n.replace("_", "")])) {
      if (v.length < 4 || registry.has(v)) continue;
      if (!new RegExp("^" + TOOL_SHAPE_SOURCE + "$").test(v)) continue;
      probed++;
      if (vocab.has(v)) hidden.push(n + "→" + v);
    }
  }
  return { probed, hidden };
}

// ── 真跑 ────────────────────────────────────────────────────────────────────

function loadSources(root) {
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== "node_modules") walk(p); }
      else if (e.name.endsWith(".ts")) files.push(p);
    }
  };
  walk(root);
  return files.sort().map((f) => ({ file: f, text: fs.readFileSync(f, "utf8") }));
}

function readBaseline(p) {
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return { __bad: true }; }
}

export function runGate(opts = {}) {
  const srcRoot = opts.srcRoot ?? SRC;
  const baselinePath = opts.baselinePath ?? BASELINE_PATH;
  const registryFiles = [path.join(srcRoot, "tool-registry.ts"), path.join(srcRoot, "wave", "register.ts")];
  const templatesFile = path.join(srcRoot, TEMPLATES_REL);
  // sources / baseline 可注入：selftest 的假根臂走**纯内存**夹具（不落盘）—— 本脚本住在 scripts/ 下，
  // 直接落盘会被 assert-script-write-guard（默认链上的 S20 门）判成「会写仓库文件的脚本」。
  const sources = opts.sources ?? loadSources(srcRoot);
  const textOf = new Map(sources.map((s) => [s.file, s.text]));
  const { consts, dupes } = collectConsts(sources);
  const { funcs } = collectFunctions(sources);
  const errors = [];

  for (const f of [...registryFiles, templatesFile]) {
    if (!textOf.has(f)) errors.push("[SRC-MISSING] 扫描面文件不在盘上：" + rel(f));
  }
  if (errors.length) return { errors, fatal: true, textOf };

  // ① 真值源
  const regs = registryFiles.flatMap((f) => extractRegistrations(textOf.get(f), f));
  const regNames = new Set();
  const unresolvedNameArgs = [];
  for (const r of regs) {
    const n = resolveNameArg(r.nameArg, consts);
    if (n) regNames.add(n);
    else unresolvedNameArgs.push(rel(r.file) + ":" + r.line + " " + r.nameArg);
  }
  const arrNames = new Set();
  const arrays = [];
  for (const [f, arrName] of [[registryFiles[0], "indexToolSchemas"], [registryFiles[1], "waveToolSchemas"]]) {
    const got = extractArrayEntries(textOf.get(f), arrName);
    if (!got) { errors.push("[SRC-MISSING] 找不到 schema 清单数组 " + arrName + "（" + rel(f) + "）"); continue; }
    for (const e of got.entries) { e.file = f; arrNames.add(e.name); arrays.push(e); }
  }
  const drift = checkRegistryConsistency(regNames, arrNames);
  errors.push(...drift.errors);
  if (unresolvedNameArgs.length) errors.push("[REGISTRY-UNRESOLVED] registerTool 首参解析不出工具名：\n    " + unresolvedNameArgs.join("\n    "));
  if (errors.length) return { errors, fatal: true, textOf };

  // ② 扫描面
  const unresolved = new Set();
  const usedConsts = new Set();
  const surfaces = [];
  for (const r of regs) {
    const name = resolveNameArg(r.nameArg, consts);
    const site = rel(r.file) + ":" + r.line;
    if (r.titleExpr) surfaces.push({ label: name + "/title", site, text: resolveExpr(r.titleExpr, consts, new Set(), unresolved, usedConsts, funcs) });
    if (r.descExpr) surfaces.push({ label: name + "/description", site, text: resolveExpr(r.descExpr, consts, new Set(), unresolved, usedConsts, funcs) });
  }
  for (const e of arrays) {
    if (!e.descExpr) continue;
    surfaces.push({
      label: e.name + "/schema-list-description",
      site: rel(e.file) + ":" + e.line,
      text: resolveExpr(e.descExpr, consts, new Set(), unresolved, usedConsts, funcs),
    });
  }
  // 模板正文：整文件按**原文**扫（正文就是模板字面量本身）
  const tplText = textOf.get(templatesFile);

  // 薄面读数：解析出的文本过短 ⇒ 该描述多半是**函数调用现拼**的（如 GENERATE_NETWORK_PACKET_DESCRIPTION
  // 就是 generateNetworkPacketDescription()），静态解析器看不到正文 —— 这是本门已知的盲区，必须报出来。
  // 阈值取 8：正常 title 也有二十来个字符，只有**解析结果近乎空**才说明正文根本没被静态取到。
  const thinSurfaces = surfaces.filter((s) => s.text.trim().length < 8).map((s) => s.label + "@" + s.site);

  const candidates = [];
  for (const s of surfaces) for (const c of candidateIds(s.text)) candidates.push({ ...c, surface: s.label, site: s.site });
  for (const c of candidateIds(tplText)) {
    candidates.push({ ...c, surface: "templates.ts", site: rel(templatesFile) + ":" + lineAt(tplText, c.index) });
  }

  // ③ 出处词表（扫 src/**，扣掉被扫的描述面本身 —— 否则描述里自己写的名字会给自己当出处）
  const exclude = new Map();
  const addRange = (f, s, e) => { if (!exclude.has(f)) exclude.set(f, []); exclude.get(f).push([s, e]); };
  for (const r of regs) addRange(r.file, r.start, r.end);
  for (const e of arrays) addRange(e.file, e.start, e.end);
  for (const n of usedConsts) {
    const c = consts.get(n);
    if (c) addRange(c.file, c.start, c.end);
    else { const fn = funcs.get(n); if (fn) addRange(fn.file, fn.start, fn.end); }
  }
  addRange(templatesFile, 0, Number.MAX_SAFE_INTEGER);
  const vocab = new Map(); // id -> {file, index}
  for (const { file, text } of sources) {
    const skip = exclude.get(file) || [];
    const inSkip = (i) => skip.some(([a, b]) => i >= a && i < b);
    const re = /[A-Za-z_$][\w$]*/g;
    let m;
    while ((m = re.exec(text))) if (!inSkip(m.index) && !vocab.has(m[0])) vocab.set(m[0], { file, index: m.index });
    forEachStringLiteral(text, (s, start) => {
      if (inSkip(start)) return;
      for (const w of s.match(/[A-Za-z_$][\w$]*/g) || []) if (!vocab.has(w)) vocab.set(w, { file, index: start });
    });
  }

  // ④ 基线 + 判据
  const baseline = opts.baseline !== undefined ? opts.baseline : readBaseline(baselinePath);
  if (baseline === null || baseline === undefined) errors.push("[BASELINE-MISSING] 缺棘轮基线：" + rel(baselinePath));
  else if (baseline.__bad) errors.push("[BASELINE-BAD] 基线不是合法 JSON：" + rel(baselinePath));
  if (errors.length) return { errors, fatal: true, textOf };
  const pinned = Array.isArray(baseline.pinned) ? baseline.pinned : [];
  const ceiling = typeof baseline.ratchet?.ceiling === "number" ? baseline.ratchet.ceiling : pinned.length;
  const verdict = judgeRefs({ candidates, registry: regNames, vocab, pinned, ceiling, frozenCeiling: FROZEN_CEILING });
  errors.push(...verdict.errors);

  return {
    errors,
    fatal: false,
    textOf,
    regCount: regNames.size,
    arrCount: arrNames.size,
    surfaceCount: surfaces.length + 1,
    candidateCount: candidates.length,
    unresolvedCount: unresolved.size,
    unresolvedNames: [...unresolved].sort(),
    thinSurfaces,
    vocabSize: vocab.size,
    constDupes: dupes.size,
    ceiling,
    frozenCeiling: FROZEN_CEILING,
    pinnedCount: pinned.length,
    blindSpotProbe: blindSpot(regNames, vocab),
    verdict,
    candidates,
    vocab,
  };
}

// ── --selftest：判据活性自证（全内存夹具，不 spawn、不写盘）─────────────────

function selftest() {
  const R = new Set(["query_api", "search_forge_docs", "get_forge_doc_summary", "read_knowledge_resource", "resolve_lib_skills"]);
  const V = new Map([["minecraft_version", { file: "x.ts", index: 0 }], ["loot_table", { file: "x.ts", index: 0 }]]);
  const cand = (id, surface = "tool/description", site = "a.ts:1") => ({ id, surface, site, index: 0, context: id });
  const J = (candidates, pinned = [], ceiling = 0) =>
    judgeRefs({ candidates, registry: R, vocab: V, pinned, ceiling, frozenCeiling: FROZEN_CEILING });
  const redOn = (id) => J([cand(id)]).errors.some((e) => e.includes(id) && e.includes("TOOL-NAME-UNKNOWN"));
  const constsOf = (src) => collectConsts([{ file: "f.ts", text: src }]).consts;

  const arms = [
    ["投毒① 发明名（对标 mcp-rogal 的 click_dialog_button）必红", () => redOn("click_dialog_button")],
    ["投毒② 真名写错成另一个名（set_option，真名 options）必红", () => redOn("set_option")],
    ["投毒③ 真名少一个字母（search_forge_doc）必红", () => redOn("search_forge_doc")],
    [
      "投毒④ 真值源漂移（注册多一个 / 清单少一个）必红",
      () => {
        const d1 = checkRegistryConsistency(new Set(["a_b", "c_d"]), new Set(["a_b"]));
        const d2 = checkRegistryConsistency(new Set(["a_b"]), new Set(["a_b", "c_d"]));
        return d1.errors.length > 0 && d2.errors.length > 0 && d1.errors[0].includes("c_d") && d2.errors[0].includes("c_d");
      },
    ],
    [
      "投毒⑤ 基线塞了已不再是红的陈旧条目必红",
      () => J([cand("query_api")], [{ id: "gone_tool", reason: "x" }], 1).errors.some((e) => e.includes("BASELINE-STALE")),
    ],
    [
      "投毒⑥ 基线棘轮上界被抬高必红",
      () =>
        judgeRefs({ candidates: [], registry: R, vocab: V, pinned: [], ceiling: FROZEN_CEILING + 1, frozenCeiling: FROZEN_CEILING })
          .errors.some((e) => e.includes("RATCHET-RAISED")),
    ],
    [
      "投毒⑦ 钉住条数超上界必红",
      () =>
        J(
          [cand("nope_one"), cand("nope_two"), cand("nope_three")],
          [{ id: "nope_one", reason: "x", sites: ["a.ts:1"] }, { id: "nope_two", reason: "x", sites: ["a.ts:2"] }],
          1,
        ).errors.some((e) => e.includes("RATCHET-OVERFLOW")),
    ],
    [
      "投毒⑩ 基线条目缺 reason / 缺 sites（台账退化成免死金牌）必红",
      () =>
        J([cand("nope_one")], [{ id: "nope_one", reason: "", sites: ["a.ts:1"] }], 1).errors.some((e) => e.includes("BASELINE-LEDGER")) &&
        J([cand("nope_one")], [{ id: "nope_one", reason: "x", sites: [] }], 1).errors.some((e) => e.includes("BASELINE-LEDGER")),
    ],
    [
      "投毒⑧ 相邻字面量粘连（list_doc_versions + true）不得造出假名",
      () => {
        const text = resolveExpr('"请先 list_doc_versions" + "true 时提取"', constsOf(""));
        return candidateIds(text).every((c) => c.id !== "list_doc_versionstrue") && /list_doc_versions/.test(text);
      },
    ],
    [
      "投毒⑨ title 面确实进扫描面（真抽取器夹具）",
      () => {
        const src =
          'server.registerTool(\n  "t_probe",\n  {\n    title: "Use click_dialog_button",\n    description: "ok",\n    inputSchema: z.object({}),\n  },\n  async () => {},\n);\n';
        const regs = extractRegistrations(src, "f.ts");
        if (regs.length !== 1 || !regs[0].titleExpr) return false;
        const title = resolveExpr(regs[0].titleExpr, constsOf(src));
        return candidateIds(title).some((c) => c.id === "click_dialog_button");
      },
    ],
    [
      "对照⑤ 桶标签按 id 归位（declared 行不得被标成 RED）",
      () => {
        const v = J([cand("query_api"), cand("minecraft_version"), cand("click_dialog_button")], [{ id: "click_dialog_button", reason: "x", sites: ["a.ts:1"] }], 1);
        return (
          v.errors.length === 0 &&
          v.bucketById.get("query_api") === "registered" &&
          v.bucketById.get("minecraft_version") === "declared-elsewhere" &&
          v.bucketById.get("click_dialog_button") === "pinned"
        );
      },
    ],
    ["对照① 已注册工具名必须绿", () => J([cand("query_api")]).errors.length === 0],
    ["对照② 源码里另有出处的参数名必须绿（minecraft_version）", () => J([cand("minecraft_version")]).errors.length === 0],
    ["对照③ 空描述 / 全命中都有出处必须绿", () => J([]).errors.length === 0 && J([cand("query_api"), cand("loot_table")]).errors.length === 0],
    [
      "对照④ 红全部被基线钉住时必须绿（棘轮只压新增）",
      () => J([cand("click_dialog_button")], [{ id: "click_dialog_button", reason: "首测存量", sites: ["a.ts:1"] }], 1).errors.length === 0,
    ],
    [
      "投毒⑪ 零参函数现拼的描述（f() 里写字面量）必须被解析进扫描面",
      () => {
        const src = 'export function buildDesc() {\n  return "用 click_dialog_button 打开";\n}\nexport const D = buildDesc();\n';
        const { consts } = collectConsts([{ file: "f.ts", text: src }]);
        const { funcs } = collectFunctions([{ file: "f.ts", text: src }]);
        const text = resolveExpr(consts.get("D").expr, consts, new Set(), null, null, funcs);
        return candidateIds(text).some((c) => c.id === "click_dialog_button");
      },
    ],
    ["活性② 假根端到端：最小 src 树 + 投毒描述必红", () => fakeRootArm(true)],
    ["活性③ 假根端到端：同一棵树把名字改对必须绿", () => fakeRootArm(false)],
    [
      "活性① 真盘两条真值源相等且非空",
      () => {
        const got = realRegistryNames();
        const drift = checkRegistryConsistency(got.regNames, got.arrNames);
        return drift.errors.length === 0 && got.regNames.size >= 50 && got.arrNames.size >= 50;
      },
    ],
  ];

  let bad = 0;
  let poison = 0;
  let control = 0;
  let live = 0;
  for (const [name, fn] of arms) {
    let ok = false;
    try { ok = fn() === true; } catch { ok = false; }
    if (!ok) bad++;
    if (name.startsWith("投毒")) poison++;
    else if (name.startsWith("对照")) control++;
    else live++;
    console.log("  " + (ok ? "✅" : "❌") + " " + name);
  }
  console.log(
    "assert-tool-name-refs(selftest): " + (arms.length - bad) + "/" + arms.length +
      " 通过（" + poison + " 投毒必红 + " + control + " 对照必绿 + " + live + " 活性，分母现数）",
  );
  process.exit(bad === 0 ? 0 : 1);
}

/**
 * selftest 用：**纯内存**假根端到端臂 —— 造一份最小 src 源码集喂给真 runGate（真解析器 + 真判据 + 真出处词表），
 * 不落盘、不 spawn、不碰真 src。poisoned=true 时描述里写不存在的 click_dialog_button（必红）；
 * false 时写已注册的 probe_alpha（必绿）。同一棵树、只换一个名字 ⇒ 证明红是判据给的，不是「脚本自己崩了」。
 *
 * ★ 为什么不用 OS tmpdir 落盘：本脚本住在 scripts/ 下，**任何**写盘原语都会让 assert-script-write-guard
 *   （默认 npm test 链上的 S20 门）把本门判成「会写仓库文件的脚本」⇒ 要么给它签字豁免，要么别落盘。
 *   夹具能纯内存就别落盘 —— 零写盘是更强的形态，也不必给别人开豁免口子。
 */
function fakeRootArm(poisoned) {
  const root = path.join(PKG, "scripts", "__selftest-fixture__", poisoned ? "poisoned" : "clean");
  const desc = poisoned ? "打开对话框用 click_dialog_button。" : "打开对话框用 probe_alpha。";
  const registryText =
    'export const probeAlphaSchema = {\n  name: "probe_alpha",\n  inputSchema: z.object({}),\n};\n' +
    "server.registerTool(\n  probeAlphaSchema.name,\n  {\n    title: \"probe\",\n    description: " +
    JSON.stringify(desc) +
    ",\n    inputSchema: probeAlphaSchema.inputSchema,\n  },\n  async () => {},\n);\n" +
    'export const indexToolSchemas = [\n  { name: "probe_alpha", description: "x", inputSchema: probeAlphaSchema.inputSchema },\n];\n';
  const got = runGate({
    srcRoot: root,
    sources: [
      { file: path.join(root, "tool-registry.ts"), text: registryText },
      {
        file: path.join(root, "wave", "register.ts"),
        text: "export const waveToolSchemas: Array<{ name: string }> = [\n];\n",
      },
      { file: path.join(root, "prompts", "templates.ts"), text: 'export const T = "no tool refs here";\n' },
    ],
    baseline: { ratchet: { ceiling: 0 }, pinned: [] },
  });
  if (poisoned) return got.errors.some((e) => e.includes("click_dialog_button") && e.includes("TOOL-NAME-UNKNOWN"));
  return got.errors.length === 0;
}

/** selftest 用：只读真盘两条真值源（不判红，只报活性）。 */
function realRegistryNames() {
  const srcRoot = path.join(PKG, "src");
  const files = [path.join(srcRoot, "tool-registry.ts"), path.join(srcRoot, "wave", "register.ts")];
  const sources = files.map((f) => ({ file: f, text: fs.readFileSync(f, "utf8") }));
  const { consts } = collectConsts(loadSources(srcRoot));
  const regNames = new Set();
  for (const s of sources) {
    for (const r of extractRegistrations(s.text, s.file)) {
      const n = resolveNameArg(r.nameArg, consts);
      if (n) regNames.add(n);
    }
  }
  const arrNames = new Set();
  for (const [f, arrName] of [[files[0], "indexToolSchemas"], [files[1], "waveToolSchemas"]]) {
    const got = extractArrayEntries(sources.find((s) => s.file === f).text, arrName);
    for (const e of got ? got.entries : []) arrNames.add(e.name);
  }
  return { regNames, arrNames };
}

// ── 主入口 ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
if (argv.includes("--selftest")) selftest();

const result = runGate();

if (argv.includes("--tsv")) {
  const rows = [["bucket", "id", "surface", "site", "evidence"].join("\t")];
  const b = result.verdict?.buckets;
  for (const c of result.candidates ?? []) {
    const bucket = b ? (result.verdict.bucketById.get(c.id) ?? "?") : "?";
    const ev = result.vocab?.get(c.id);
    rows.push([bucket, c.id, c.surface, c.site, ev ? rel(ev.file) + ":" + lineAt(result.textOf.get(ev.file) ?? "", ev.index) : ""].join("\t"));
  }
  console.log(rows.join("\n"));
  process.exit(result.errors.length ? 1 : 0);
}

if (argv.includes("--print-baseline")) {
  const ids = result.verdict?.redIds ?? [];
  const sites = new Map();
  for (const c of result.candidates ?? []) {
    if (!ids.includes(c.id)) continue;
    if (!sites.has(c.id)) sites.set(c.id, []);
    if (!sites.get(c.id).includes(c.site)) sites.get(c.id).push(c.site);
  }
  console.log(
    JSON.stringify(
      {
        $comment: "棘轮基线（只许降）：pinned = 首测存量误报；ceiling 不得大于脚本里的 FROZEN_CEILING。",
        ratchet: { ceiling: ids.length, note: "只许降；条目一旦不再是红必须当场删除（BASELINE-STALE）" },
        pinned: ids.map((id) => ({ id, reason: "TODO 逐条写原因", sites: sites.get(id) ?? [] })),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (result.fatal || result.errors.length) {
  console.error("assert-tool-name-refs: " + result.errors.length + " 项不通过");
  for (const e of result.errors) console.error("  ✗ " + e);
  process.exit(1);
}

const v = result.verdict;
console.log(
  "assert-tool-name-refs: ok（真值源 registerTool " + result.regCount + " = schema 清单 " + result.arrCount +
    " · 扫描面 " + result.surfaceCount + " 段 · 命中 " + result.candidateCount + " 个形状位点：注册 " +
    v.buckets.registered.length + " + 另有出处 " + v.buckets.declared.length + " + 红 " + v.buckets.pinned.length +
    "（" + v.redIds.length + " 个 id，基线钉住 " + result.pinnedCount + "/" + result.ceiling + "，冻结上界 " + result.frozenCeiling + "）· 出处词表 " +
    result.vocabSize + " 名）",
);
console.log(
  "  ② 活性读数：对真工具名造 " + result.blindSpotProbe.probed + " 个打字错误变体，靠「有出处」隐身的 " +
    result.blindSpotProbe.hidden.length + " 个" +
    (result.blindSpotProbe.hidden.length ? "：" + result.blindSpotProbe.hidden.join(", ") : "（⇒ ② 不是万能橡皮章）"),
);
if (v.redIds.length) {
  console.log("  红 " + v.redIds.length + " 个 id / " + v.buckets.pinned.length + " 个位点（全部被基线钉住，未钉住的会 rc=1）：");
  for (const c of v.buckets.pinned.slice(0, 40)) console.log("    · " + c.id + "  ← " + c.site + " [" + c.surface + "]");
}
if (result.pinnedCount < result.ceiling) {
  console.log("  ⚠ 基线可降：pinned " + result.pinnedCount + " < 上界 " + result.ceiling + "（下次改动请把上界一并下调）");
}
if (result.thinSurfaces && result.thinSurfaces.length) {
  console.log(
    "  ⚠ 薄面读数：" + result.thinSurfaces.length + " 段描述面解析出的文本近乎空（描述由函数现拼 ⇒ 静态解析看不到正文，本门扫不到）：" +
      result.thinSurfaces.join(", "),
  );
}
if (result.unresolvedCount) {
  console.log(
    "  读数：描述表达式里有 " + result.unresolvedCount + " 个解析不出的标识符（跨包常量 / 重名 const ⇒ 该段文本可能不全，不判红）：" +
      result.unresolvedNames.slice(0, 20).join(", ") + (result.unresolvedCount > 20 ? " …" : ""),
  );
}
