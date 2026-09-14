/**
 * G3 · 语料保真门（Wave 7.1 / 修复计划 S4-G3）。
 *
 * 守的是这一条静默通道：语料加工（raw → processed）或取件（reference 镜像）悄悄退化，
 * 而 `get_*_doc_full` 照样 `ok:true` 吐正文 —— 于是模型读到的是裸占位符、被吃掉一半的
 * 泛型签名、或上游混淆名，且没有任何一层报错。这类退化在检索侧完全看不出来，
 * 只能靠「对磁盘原始语料做逐档复算 + 精确台账」钉住。
 *
 * 与既有门的分工（不重复覆盖）：
 * - `assert-fabric-transcludes.mjs`：`@[code]` 占位符**能不能展开**（reader 侧）；
 * - 本门：`<<<` 占位符**根本没被展开也没被取件**（reader + 取件双侧都缺，S6 的验收面）、
 *   raw↔processed 结构对应、上游中介名不外泄到正文、尖括号泛型不被加工吃掉。
 *
 * 两层结构（与 assert-powershell / assert-fabric-transcludes 同形态）：
 *  A. 内容层（任何数据根都跑，纯规则，无台账数字）
 *     A1 每个 `{raw,processed}` 树：raw 与 processed 文件数必须相同（加工不得吞页/造页）；
 *     A2 processed 内 basename 不得重复（重名 ⇒ `get_doc_full` 按名取页会取错类）；
 *     A3 每个 `^<<<` 残留目标必须是仓库绝对路径（`@/…`；实测前缀有 reference / public / .github）。
 *        S6 已让读者展开 `<<<` ⇒「字节在盘上而正文仍是占位符」不再是缺陷，语料本就该留占位符、
 *        展开只发生在返回给调用方的副本上；于是这一条换成更实的检查：blob 已在镜像里时，
 *        站点要的 `#region` 必须在 blob 里有成对 `#region`/`#endregion` 标记 —— 否则读者给出
 *        `No lines matched.`，模型只看到一个空围栏且全程没有错误码。取件未做的目标只计台账处数。
 *     A4 上游中介名（`class_\d+`/`field_\d+`/`method_\d+`）只许出现在代码语境（围栏内或行内反引号），
 *        出现在正文必须逐处在存量台账 `DEBT_INTERMEDIARY_BARE` 内（键 = 相对路径:行号|该行的目标名集合）；
 *     A5 尖括号泛型保真：同名 raw/processed 配对里，raw 中的 `Foo<...>` 记号必须都在 processed 存活；
 *        每条丢失都必须按树命中存量台账 `DEBT_ANGLE_LOSS`（今日为空 ⇒ 任何丢失即红，假根真根同规则）。
 *  B. 台账层（只跑真数据根；`MC_SKILL_CORPUS_TEST_ROOT` 指到假根时整层跳过）
 *     逐档 `<<<` 处数/文件数、逐树结构类别（raw/proc 篇数 + identical/contentDiff/markerOnly/
 *     fmOnly/noTwin + processed 重名数 + 该树 `<<<` 处数）、中介名行命中数（总/围栏内/行内码）。**精确钉死**：多一处红、少一处也红
 *     （S6 取件+展开做完时显式改台账，和 G1 的 DEBT 同一纪律）。
 *
 * 台账数字不许由外部探针喂：`MC_SKILL_CORPUS_RELEDGER=1` 让本门把**自己算出的**台账打成 JSON
 * 后退出，改台账只能靠这一条（避免「探针一套正则、门另一套正则」这种永远绿的分叉）。
 *
 * plan 原文要求的是 `<<<`/`@[code` 残留 = 0、中介名 = 0。实测今日不成立
 * （`<<<` 残留 633 处、中介名 979 处），所以本门按「存量台账 + 回归即红」落地，
 * 该口径偏离已在 `temp/PLAN-2026-09-08-销账-S4.md` 登记，S6 清零时把台账改空。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let transclude;
try {
  transclude = await import("../dist/docs-platform/fabric/transclude.js");
} catch {
  console.error(
    "assert-corpus-faithfulness: 缺 ../dist/docs-platform/fabric/transclude.js —— 先 `npm run build`" +
      "（`<<<` 目标的本地路径与运行时/取件 gate 共用同一条公式，不另写一份）",
  );
  process.exit(1);
}
const { loadReferenceProvenance, referenceLocalPath, parseAngleSpec, angleResolve, NO_LINES_MATCHED } = transclude;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

const TEST_ROOT = process.env.MC_SKILL_CORPUS_TEST_ROOT;
const DATA_DIR = TEST_ROOT
  ? path.resolve(TEST_ROOT)
  : path.resolve(process.env.MC_SKILL_DATA || path.join(REPO_ROOT, "data"));
const LEDGER_MODE = !TEST_ROOT;

/** 与 transclude.ts 的 FENCE_RE 一致：围栏内的标记是字面文本，不是占位符。 */
function statSyncIsDir(p) {
  try {
    return fs.readdirSync(p) && true;
  } catch {
    return false;
  }
}
/** 只列目录名：data/<pack>/ 下混着 meta.json 这类散文件，直接 readdirSync 会 ENOTDIR。 */
function dirsOf(d) {
  let es;
  try {
    es = fs.readdirSync(d, { withFileTypes: true });
  } catch {
    return [];
  }
  return es.filter((e) => e.isDirectory()).map((e) => e.name);
}
const FENCE_RE = /^ {0,3}(```|~~~)/;
const DIRECTIVE_RE = /^ *<<< *(.*)$/;
const CODE_MARKER_RE = /^ *@\[code/;
const INTERMEDIARY_RE = /\b(?:class|field|method)_\d+\b/g;
/** 泛型记号：首字母大写的标识符紧跟尖括号。闭合标签（`Foo</code>`）与 `<yarn …>` 注记都不算。 */
const GENERIC_RE = /\b[A-Z]\w*<(?!\/)[^>\n]*>/g;
/** 尖括号被转义成实体不算丢失（那是 HTML 安全写法，不是内容被吃掉）。 */
const unesc = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// ── 台账（只由本门 MC_SKILL_CORPUS_RELEDGER=1 重算，禁止手改数字）────────────
// B 层：逐档 `<<<` 残留（处数/文件数）
const LEDGER_DIRECTIVE = {
  "fabric_1.21.10": { sites: 5, files: 2 },
  "fabric_1.21.11": { sites: 23, files: 6 },
  "fabric_1.21.4": { sites: 3, files: 1 },
  "fabric_1.21.8": { sites: 4, files: 2 },
  "fabric_26.1.2": { sites: 598, files: 69 },
};
// B 层：逐树结构类别 raw/proc 篇数、变换类别计数、processed 重名数、该树 <<< 处数
const LEDGER_TREES = {
  "fabric_1.14.4/fabric-wiki/1.14.4": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.16.5/fabric-wiki/1.16.5": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.17.1/fabric-wiki/1.17.1": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.18.2/fabric-wiki/1.18.2": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.19.4/fabric-wiki/1.19.4": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.20.1/fabric-wiki/1.20.1": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.20.4/fabric-docs/1.20.4": { raw: 31, proc: 31, identical: 0, contentDiff: 31, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.20.4/fabric-wiki/1.20.4": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.1/fabric-docs/1.21.1": { raw: 45, proc: 45, identical: 0, contentDiff: 45, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.1/fabric-wiki/1.21.1": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.10/fabric-docs/1.21.10": { raw: 79, proc: 79, identical: 0, contentDiff: 79, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 5 },
  "fabric_1.21.10/fabric-wiki/1.21.10": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.11/fabric-docs/1.21.11": { raw: 93, proc: 93, identical: 0, contentDiff: 93, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 23 },
  "fabric_1.21.11/fabric-wiki/1.21.11": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.3/fabric-wiki/1.21.3": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.4/fabric-docs/1.21.4": { raw: 51, proc: 51, identical: 0, contentDiff: 51, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 3 },
  "fabric_1.21.4/fabric-wiki/1.21.4": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_1.21.8/fabric-docs/1.21.8": { raw: 67, proc: 67, identical: 0, contentDiff: 67, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 4 },
  "fabric_1.21.8/fabric-wiki/1.21.8": { raw: 7, proc: 7, identical: 0, contentDiff: 7, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "fabric_26.1.2/fabric-docs/26.1.2": { raw: 100, proc: 100, identical: 0, contentDiff: 100, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 598 },
  "forge_1.12.2/forge-docs/1.12.2": { raw: 57, proc: 57, identical: 0, contentDiff: 46, markerOnly: 0, fmOnly: 11, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.13.2/forge-docs/1.13.2": { raw: 43, proc: 43, identical: 0, contentDiff: 33, markerOnly: 0, fmOnly: 10, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.14.4/forge-docs/1.14.4": { raw: 45, proc: 45, identical: 0, contentDiff: 34, markerOnly: 0, fmOnly: 11, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.15.2/forge-docs/1.15.2": { raw: 40, proc: 40, identical: 0, contentDiff: 29, markerOnly: 0, fmOnly: 11, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.16.5/forge-docs/1.16.5": { raw: 41, proc: 41, identical: 0, contentDiff: 29, markerOnly: 0, fmOnly: 12, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.17.1/forge-docs/1.17.1": { raw: 41, proc: 41, identical: 0, contentDiff: 30, markerOnly: 0, fmOnly: 11, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.18.2/forge-docs/1.18.2": { raw: 33, proc: 33, identical: 0, contentDiff: 25, markerOnly: 0, fmOnly: 8, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.19.4/forge-docs/1.19.4": { raw: 39, proc: 39, identical: 0, contentDiff: 32, markerOnly: 0, fmOnly: 7, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.20.1/forge-docs/1.20.1": { raw: 70, proc: 70, identical: 0, contentDiff: 63, markerOnly: 0, fmOnly: 7, noTwin: 0, dup: 0, dir: 0 },
  "forge_1.20.4/forge-docs/1.20.4": { raw: 70, proc: 70, identical: 0, contentDiff: 69, markerOnly: 0, fmOnly: 1, noTwin: 0, dup: 0, dir: 0 },
  "forge_javadoc/1.10.2": { raw: 3254, proc: 3254, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 0, noTwin: 3254, dup: 0, dir: 0 },
  "forge_javadoc/1.11.2": { raw: 3335, proc: 3335, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 0, noTwin: 3335, dup: 0, dir: 0 },
  "forge_javadoc/1.12.2": { raw: 4567, proc: 4567, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 0, noTwin: 4567, dup: 0, dir: 0 },
  "forge_javadoc/1.7.10": { raw: 2464, proc: 2464, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 0, noTwin: 2464, dup: 0, dir: 0 },
  "forge_javadoc/1.8.9": { raw: 2837, proc: 2837, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 0, noTwin: 2837, dup: 0, dir: 0 },
  "forge_javadoc/1.9.4": { raw: 3111, proc: 3111, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 0, noTwin: 3111, dup: 0, dir: 0 },
  "liteloader_1.10.2/liteloader-docs/1.10.2": { raw: 30, proc: 30, identical: 0, contentDiff: 30, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "liteloader_1.12.2/liteloader-docs/1.12.2": { raw: 31, proc: 31, identical: 0, contentDiff: 31, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "liteloader_1.8.9/liteloader-docs/1.8.9": { raw: 30, proc: 30, identical: 0, contentDiff: 30, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.20.4/neoforge-docs/1.20.4": { raw: 61, proc: 61, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 61, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.20.6/neoforge-docs/1.20.6": { raw: 64, proc: 64, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 64, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.21.1/neoforge-docs/1.21.1": { raw: 63, proc: 63, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 63, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.21.10/neoforge-docs/1.21.10": { raw: 75, proc: 75, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 75, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.21.11/neoforge-docs/1.21.11": { raw: 75, proc: 75, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 75, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.21.3/neoforge-docs/1.21.3": { raw: 67, proc: 67, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 67, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.21.5/neoforge-docs/1.21.5": { raw: 72, proc: 72, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 72, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_1.21.8/neoforge-docs/1.21.8": { raw: 73, proc: 73, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 73, noTwin: 0, dup: 0, dir: 0 },
  "neoforge_26.1/neoforge-docs/26.1": { raw: 77, proc: 77, identical: 0, contentDiff: 0, markerOnly: 0, fmOnly: 77, noTwin: 0, dup: 0, dir: 0 },
  "rift_1.13.2/rift-docs/1.13.2": { raw: 6, proc: 6, identical: 0, contentDiff: 6, markerOnly: 0, fmOnly: 0, noTwin: 0, dup: 0, dir: 0 },
};
// A5 存量债务：按树登记的泛型记号丢失数（今日为空；加工若吃掉签名才登记）
const DEBT_ANGLE_LOSS = {};
// A4 存量债务：正文里的上游中介名（相对 data 根路径:行号|该处名字）
//      S7 之后剩下的这些都是「上游正文跨版本残留、本版映射里没有」的 intermediary，逐条点名保留。
const DEBT_INTERMEDIARY_BARE = [
  "fabric_1.14.4/fabric-wiki/1.14.4/processed/tutorial_items.md:31|class_7923,field_41178",
  "fabric_1.16.5/fabric-wiki/1.16.5/processed/tutorial_items.md:31|class_7923,field_41178",
  "fabric_1.17.1/fabric-wiki/1.17.1/processed/tutorial_items.md:31|class_7923,field_41178",
  "fabric_1.18.2/fabric-wiki/1.18.2/processed/tutorial_items.md:31|class_7923,field_41178",
  "fabric_1.20.4/fabric-wiki/1.20.4/processed/tutorial_commands.md:125|class_2164",
  "fabric_1.21.1/fabric-wiki/1.21.1/processed/tutorial_commands.md:125|class_2164",
  "fabric_1.21.10/fabric-wiki/1.21.10/processed/tutorial_commands.md:126|class_2164",
  "fabric_1.21.11/fabric-wiki/1.21.11/processed/tutorial_commands.md:125|class_2164",
  "fabric_1.21.3/fabric-wiki/1.21.3/processed/tutorial_commands.md:125|class_2164",
  "fabric_1.21.4/fabric-wiki/1.21.4/processed/tutorial_commands.md:126|class_2164",
  "fabric_1.21.8/fabric-wiki/1.21.8/processed/tutorial_commands.md:126|class_2164",
];
// B 层汇总（处数均为「行命中数」：一行出现两个中介名记 1 处）
const LEDGER_TOTALS = {
  directiveSites: 633,
  directiveFiles: 80,
  directiveFenced: 0,
  directiveOnDisk: 633,
  intermediaryTotal: 288,
  intermediaryFenced: 274,
  intermediaryInlineCode: 3,
};

const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join("/");
const relData = (p) => path.relative(DATA_DIR, p).split(path.sep).join("/");

if (!fs.existsSync(DATA_DIR)) {
  console.error(`assert-corpus-faithfulness: 数据根不存在 ${DATA_DIR}（MC_SKILL_DATA 指对了吗？）`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, out);
    else if (e.isFile()) out.push(abs);
  }
  return out;
}

/** 所有 `{raw,processed}` 目录对；tree 键 = `<pack>/<source>/<subv>`（相对 data 根）。 */
function findTrees() {
  const trees = [];
  for (const pack of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!pack.isDirectory()) continue;
    const packRoot = path.join(DATA_DIR, pack.name);
    (function scan(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        const abs = path.join(dir, e.name);
        if (e.name === "raw" && fs.existsSync(path.join(dir, "processed"))) {
          trees.push({
            pack: pack.name,
            packRoot,
            tree: path.relative(DATA_DIR, dir).split(path.sep).join("/"),
            raw: abs,
            processed: path.join(dir, "processed"),
          });
          continue;
        }
        scan(abs);
      }
    })(packRoot);
  }
  return trees.sort((a, b) => a.tree.localeCompare(b.tree));
}

/** 行级扫描：返回未展开的 `<<<` 目标（围栏内计入 fenced 数但不算残留）。 */
function scanDirectives(file) {
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  let inFence = false;
  let fenced = 0;
  const sites = [];
  lines.forEach((line, idx) => {
    if (FENCE_RE.test(line)) inFence = !inFence;
    if (!/^ *<<</.test(line)) return;
    if (inFence) {
      fenced++;
      return;
    }
    const rest = DIRECTIVE_RE.exec(line)?.[1]?.trim() ?? "";
    const first = rest.split(/\s+/)[0];
    // 目标必须走运行时的同一条文法解析：门若把 `[Output]` / `{5-7}` 留在路径里，
    // 这 13 处就会既不算「已取件」也不做区段核对 ⇒ 门与读者对同一页给出不同结论。
    sites.push({ line: idx + 1, raw: rest, target: parseAngleSpec(first, rest.slice(first.length)).path });
  });
  return { sites, fenced };
}

/** 行级中介名扫描：围栏内 = code，行内反引号内 = inline，其余 = prose。 */
function scanIntermediary(file) {
  const lines = fs.readFileSync(file, "utf-8").split("\n");
  let inFence = false;
  const hits = [];
  lines.forEach((line, idx) => {
    if (FENCE_RE.test(line)) inFence = !inFence;
    const names = line.match(INTERMEDIARY_RE);
    if (!names) return;
    let ctx = "prose";
    if (inFence) ctx = "code";
    else {
      const spans = [];
      const re = /`[^`\n]*`/g;
      let m;
      while ((m = re.exec(line))) spans.push([m.index, m.index + m[0].length]);
      const first = line.search(INTERMEDIARY_RE);
      if (spans.some(([a, b]) => first >= a && first < b)) ctx = "inline";
    }
    hits.push({ line: idx + 1, ctx, names: [...new Set(names)].sort() });
  });
  return hits;
}

function genericTokens(text) {
  return text.match(GENERIC_RE) ?? [];
}

/** 同名 raw 配对：`.md`↔`.md`、wiki 的 `.md`↔`.txt`，再退到展平命名（javadoc）。 */
function findTwin(relIn, rawDir, rawFiles) {
  const cand = [path.join(rawDir, relIn), path.join(rawDir, relIn.replace(/\.(md|mdx)$/, ".txt"))];
  for (const c of cand) if (fs.existsSync(c)) return c;
  const stem = path.basename(relIn).replace(/\.[^.]+$/, "");
  return (
    rawFiles.find((r) => {
      const b = path.basename(r);
      return b === stem || b.replace(/\.[^./]+$/, "").replace(/[\\/]/g, "_") === stem;
    }) ?? null
  );
}

const stat = {
  trees: {},
  directive: { perPack: {}, sites: 0, files: 0, fenced: 0, onDiskSites: 0 },
  intermediary: { total: 0, code: 0, inline: 0, prose: [] },
  angleLoss: {},
  angleLossSample: {},
};

for (const t of findTrees()) {
  const rawFiles = walk(t.raw);
  const procFiles = walk(t.processed).sort();
  const entry = {
    rawFiles: rawFiles.length,
    procFiles: procFiles.length,
    identical: 0,
    contentDiff: 0,
    markerOnly: 0,
    fmOnly: 0,
    noTwin: 0,
    dupBasenames: 0,
    directiveSites: 0,
    directiveFenced: 0,
    directiveOnDisk: 0,
  };
  stat.trees[t.tree] = entry;

  // A2 重名 basename（processed 侧）
  const seen = new Map();
  for (const f of procFiles) {
    const b = path.basename(f);
    seen.set(b, (seen.get(b) ?? 0) + 1);
  }
  entry.dupBasenames = [...seen.values()].filter((n) => n > 1).length;
  if (entry.dupBasenames > 0) {
    const worst = [...seen.entries()].filter(([, n]) => n > 1).slice(0, 5).map(([b, n]) => `${b}×${n}`);
    fail(`${relData(t.processed)}: processed 有 ${entry.dupBasenames} 个重名 basename（${worst.join(", ")}）⇒ 按名取页会取错文件`);
  }

  // A1 raw/processed 计数
  if (entry.rawFiles !== entry.procFiles) {
    // 方向要分清：活例是 fetch-forge-javadoc.js 抓进 raw 后没人重跑 indexer ⇒ processed 少。
    const a1Remedy =
      entry.rawFiles > entry.procFiles
        ? "raw 侧有新页未镜像 ⇒ 重跑该树生产者（forge_javadoc：`node mcp-server/scripts/forge-javadoc-indexer.js --version=<v>`）"
        : "processed 侧多页 ⇒ 镜像错位或 raw 侧删页未同步";
    fail(`${t.tree}: raw ${entry.rawFiles} 篇 ≠ processed ${entry.procFiles} 篇 ⇒ 加工吞页或造页 · ${a1Remedy}`);
  }

  // `<<<` 残留：只算 processed（那才是读者吐给模型的正文）
  const prov = loadReferenceProvenance(t.packRoot);
  for (const f of procFiles) {
    if (!/\.(md|mdx|txt)$/.test(f)) continue;
    const { sites, fenced } = scanDirectives(f);
    entry.directiveSites += sites.length;
    entry.directiveFenced += fenced;
    stat.directive.sites += sites.length;
    stat.directive.fenced += fenced;
    if (!sites.length) continue;
    stat.directive.files++;
    const per = (stat.directive.perPack[t.pack] ??= { sites: 0, files: 0 });
    per.sites += sites.length;
    per.files++;
    for (const s of sites) {
      if (!/^@\//.test(s.target)) {
        fail(`${relData(f)}:${s.line}: 未展开 <<< 目标形态异常「${s.target}」⇒ 不是仓库绝对路径（@/…），取件与展开规则都无从下手`);
        continue;
      }
      const abs = referenceLocalPath(s.target, t.packRoot, prov);
      if (!fs.existsSync(abs)) continue; // 取件未做：只计台账处数
      entry.directiveOnDisk++;
      stat.directive.onDiskSites++;
      // S6 起读者会展开 <<< ⇒ 剩下的静默通道是「blob 在、区段名对不上」：
      // 那时展开结果是 No lines matched.，模型读到一个空围栏而且没有任何错误码。
      // 判据必须与读者同源：门自己再写一份「区段名在不在」的土办法，就会出现「门绿着、展开是空围栏」
      const specTok = s.raw.trim().split(/\s+/)[0];
      const ang = parseAngleSpec(specTok, s.raw.trim().slice(specTok.length));
      if (ang.region === null && !ang.lines) continue; // 整份引用：blob 在就够
      const [body] = angleResolve(fs.readFileSync(abs, "utf8"), ang);
      if (body === NO_LINES_MATCHED || body.trim() === "") {
        fail(
          `${relData(f)}:${s.line}: <<<「${specTok}」在镜像 blob ${rel(abs)} 里解析不出正文` +
            `（区段名或行选对不上）⇒ 展开成空代码块，模型只看到围栏`,
        );
      }
    }
  }

  // 中介名 + 泛型丢失（processed 侧，逐页）
  for (const f of procFiles) {
    const relIn = path.relative(t.processed, f);
    if (!/\.(md|mdx)$/.test(f)) continue;
    for (const h of scanIntermediary(f)) {
      stat.intermediary.total++;
      if (h.ctx === "code") stat.intermediary.code++;
      else if (h.ctx === "inline") stat.intermediary.inline++;
      else stat.intermediary.prose.push(`${relData(f)}:${h.line}|${h.names.join(",")}`);
    }
    const twin = findTwin(relIn, t.raw, rawFiles);
    if (!twin) {
      entry.noTwin++;
      continue;
    }
    const a = fs.readFileSync(twin, "utf-8");
    const b = fs.readFileSync(f, "utf-8");
    if (a === b) {
      entry.identical++;
      continue;
    }
    const ta = genericTokens(unesc(a));
    const left = new Map();
    for (const x of genericTokens(unesc(b))) left.set(x, (left.get(x) ?? 0) + 1);
    const missing = [];
    for (const x of ta) {
      const n = left.get(x) ?? 0;
      if (n > 0) left.set(x, n - 1);
      else missing.push(x);
    }
    if (missing.length) {
      stat.angleLoss[t.tree] = (stat.angleLoss[t.tree] ?? 0) + missing.length;
      if (!stat.angleLossSample[t.tree]) stat.angleLossSample[t.tree] = `${relData(f)}: ${missing[0]}`;
    }
    const al = a.split("\n");
    const bl = b.split("\n");
    const onlyA = al.filter((l) => !bl.includes(l));
    const onlyB = bl.filter((l) => !al.includes(l));
    const cls = (l) =>
      CODE_MARKER_RE.test(l) || /^\s*<<</.test(l)
        ? "marker"
        : l.trim() === ""
          ? "blank"
          : /^[A-Za-z0-9_-]+:\s/.test(l) || l.trim() === "---"
            ? "fm"
            : "content";
    if ([...onlyA, ...onlyB].some((l) => cls(l) === "content")) entry.contentDiff++;
    else if ([...onlyA, ...onlyB].some((l) => cls(l) === "marker")) entry.markerOnly++;
    else entry.fmOnly++;
  }
}

// A4 正文中介名：只许在存量台账内
for (const key of stat.intermediary.prose) {
  if (!DEBT_INTERMEDIARY_BARE.includes(key)) {
    fail(`正文外泄上游中介名 ${key} ⇒ 不在存量台账内（模型会照抄 class_1792 这种混淆名）`);
  }
}

// A5 泛型记号丢失：只许在存量台账内，且按树精确核数
for (const [tree, got] of Object.entries(stat.angleLoss)) {
  const want = DEBT_ANGLE_LOSS[tree] ?? 0;
  if (want !== got) {
    fail(
      `${tree}: raw 的 ${got} 个尖括号泛型在 processed 未原样存活（台账 ${want}），例 ${stat.angleLossSample[tree]}` +
        `⇒ 模型读到的签名与上游不一致（少类型参数或被改写）`,
    );
  }
}
for (const tree of Object.keys(DEBT_ANGLE_LOSS)) {
  if (!stat.angleLoss[tree]) fail(`泛型丢失台账条目 ${tree} 已不在实扫结果里 ⇒ 清零是好事，但要显式改台账`);
}

// A8 内容级损坏签名：raw / processed 里出现控制字节或 U+FFFD ⇒ 该文件已不是文本。
// 2026-09-13 实例：fabric_1.21.10 的 develop_networking.md 整页被二进制覆盖
// （11,062 B 里 35/36 行含控制字节）。A1 只比「页数」、A5 只比「泛型是否存活」，
// 两者都放过它 —— 因为 processed 是坏之前从好 raw 生成的，配对看起来完全正常。
const DAMAGE_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD]/;
function* walkMd(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const abs = dir + path.sep + e.name;
    if (e.isDirectory()) yield* walkMd(abs);
    else if (e.name.endsWith(".md")) yield abs;
  }
}
{
  let scanned = 0;
  for (const pack of fs.readdirSync(DATA_DIR)) {
    const packDir = DATA_DIR + path.sep + pack;
    if (!pack.includes("_") || statSyncIsDir(packDir) === false) continue;
    for (const srcDir of dirsOf(packDir)) {
      for (const ver of dirsOf(packDir + path.sep + srcDir)) {
        for (const layer of ["raw", "processed"]) {
          const base = packDir + path.sep + srcDir + path.sep + ver + path.sep + layer;
          for (const abs of walkMd(base)) {
            scanned++;
            let text;
            try {
              const buf = fs.readFileSync(abs);
              if (buf.length > (8 << 20)) continue;
              text = buf.toString("utf8");
            } catch {
              continue;
            }
            if (!DAMAGE_RE.test(text)) continue;
            const line = text.split(/\r?\n/).findIndex((l) => DAMAGE_RE.test(l)) + 1;
            fail(
              `${path.relative(DATA_DIR, abs).split(path.sep).join("/")}:${line} 含控制字节/替换符（损坏签名）` +
                ` ⇒ 这份语料已不可信，必须用写入者重抓（fetch-fabric-docs / fetch-forge-docs），禁止手改正文`,
            );
          }
        }
      }
    }
  }
  stat.damageScanned = scanned;
}

// ── B 层：台账对账 ──────────────────────────────────────────────────────────
if (process.env.MC_SKILL_CORPUS_RELEDGER) {
  console.log(
    JSON.stringify(
      {
        LEDGER_DIRECTIVE: Object.fromEntries(Object.entries(stat.directive.perPack).map(([k, v]) => [k, v])),
        LEDGER_TREES: Object.fromEntries(
          Object.entries(stat.trees).map(([k, v]) => [
            k,
            {
              raw: v.rawFiles,
              proc: v.procFiles,
              identical: v.identical,
              contentDiff: v.contentDiff,
              markerOnly: v.markerOnly,
              fmOnly: v.fmOnly,
              noTwin: v.noTwin,
              dup: v.dupBasenames,
              dir: v.directiveSites,
              dirFenced: v.directiveFenced,
            },
          ]),
        ),

        DEBT_ANGLE_LOSS: stat.angleLoss,
        DEBT_INTERMEDIARY_BARE: stat.intermediary.prose,
        LEDGER_TOTALS: {
          directiveSites: stat.directive.sites,
          directiveFiles: stat.directive.files,
          directiveFenced: stat.directive.fenced,
          directiveOnDisk: stat.directive.onDiskSites,
          intermediaryTotal: stat.intermediary.total,
          intermediaryFenced: stat.intermediary.code,
          intermediaryInlineCode: stat.intermediary.inline,
        },
      },
      null,
      1,
    ),
  );
  process.exit(0);
}

if (LEDGER_MODE) {
  const eq = (label, want, got) => {
    if (want !== got) fail(`${label}: 台账 ${want} ≠ 实扫 ${got}`);
  };
  eq("<<< 残留总处数", LEDGER_TOTALS.directiveSites, stat.directive.sites);
  eq("<<< 残留文件数", LEDGER_TOTALS.directiveFiles, stat.directive.files);
  eq("<<< 围栏内字面文本数", LEDGER_TOTALS.directiveFenced, stat.directive.fenced);
  eq("中介名总处数", LEDGER_TOTALS.intermediaryTotal, stat.intermediary.total);
  eq("中介名围栏内处数", LEDGER_TOTALS.intermediaryFenced, stat.intermediary.code);
  eq("中介名行内代码处数", LEDGER_TOTALS.intermediaryInlineCode, stat.intermediary.inline);
  for (const [pack, want] of Object.entries(LEDGER_DIRECTIVE)) {
    const got = stat.directive.perPack[pack] ?? { sites: 0, files: 0 };
    eq(`<<< ${pack} 处数`, want.sites, got.sites);
    eq(`<<< ${pack} 文件数`, want.files, got.files);
  }
  for (const [tree, got] of Object.entries(stat.directive.perPack)) {
    if (!LEDGER_DIRECTIVE[tree]) fail(`<<< 残留出现在未登记档 ${tree}（sites=${got.sites}）⇒ 台账外新增`);
  }
  for (const tree of Object.keys(stat.trees)) {
    if (!LEDGER_TREES[tree]) fail(`树 ${tree} 不在台账 ⇒ 新增/改名树，先核加工链再登记`);
  }
  for (const [tree, want] of Object.entries(LEDGER_TREES)) {
    const got = stat.trees[tree];
    if (!got) {
      fail(`树 ${tree} 在台账里但磁盘没有 ⇒ 加工/镜像少了一棵（或档被挪走）`);
      continue;
    }
    eq(`${tree} raw`, want.raw, got.rawFiles);
    eq(`${tree} proc`, want.proc, got.procFiles);
    eq(`${tree} identical`, want.identical, got.identical);
    eq(`${tree} contentDiff`, want.contentDiff, got.contentDiff);
    eq(`${tree} markerOnly`, want.markerOnly, got.markerOnly);
    eq(`${tree} fmOnly`, want.fmOnly, got.fmOnly);
    eq(`${tree} noTwin`, want.noTwin, got.noTwin);
    eq(`${tree} dup`, want.dup, got.dupBasenames);
    eq(`${tree} <<<`, want.dir, got.directiveSites);
  }
  for (const key of DEBT_INTERMEDIARY_BARE) {
    if (!stat.intermediary.prose.includes(key)) {
      fail(`存量台账条目 ${key} 已不在实扫结果里 ⇒ 债务被清掉是好事，但必须显式改台账（S6/S3）`);
    }
  }
  eq("<<< 字节已在盘上的处数", LEDGER_TOTALS.directiveOnDisk, stat.directive.onDiskSites);
}

if (failures.length) {
  for (const f of failures.slice(0, 25)) console.error(`✗ ${f}`);
  if (failures.length > 25) console.error(`✗ …（另有 ${failures.length - 25} 条，同上）`);
  if (LEDGER_MODE) {
    console.error("（台账漂移：跑 `MC_SKILL_CORPUS_RELEDGER=1 node mcp-server/scripts/assert-corpus-faithfulness.mjs` 重算，别手改数字）");
  }
  console.error(`assert-corpus-faithfulness(G3): ${failures.length} 项不达标`);
  process.exit(1);
}

const treeCount = Object.keys(stat.trees).length;
const modeLabel = LEDGER_MODE ? "台账层已跑" : "内容层（假根）";
const angleLossTotal = Object.values(stat.angleLoss).reduce((s, n) => s + n, 0);
console.log(
  `  assert-corpus-faithfulness(G3): ${treeCount} 棵 raw/processed 树 · ${modeLabel} · ` +
    `<<< 残留 ${stat.directive.sites} 处/${stat.directive.files} 文件` +
    `（其中 ${stat.directive.onDiskSites} 处字节已在盘上，区段标记已逐个核实） · ` +
    `中介名 ${stat.intermediary.total} 处（围栏 ${stat.intermediary.code} · 行内码 ${stat.intermediary.inline} · ` +
    `正文 ${stat.intermediary.prose.length}，全在存量台账） · 泛型丢失 ${angleLossTotal} · 重名 0`,
);
