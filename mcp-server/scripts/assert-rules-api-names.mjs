#!/usr/bin/env node
/**
 * assert-rules-api-names.mjs —— Fabric 规则树面的「API 名跟丢版本」闸（切片 1 建档 · 切片 3 加固 · 切片 4 修真缺陷并补围栏腿，2026-09-27）
 *
 * 管什么：`fabric/<ver>/.cursor/rules/*.mdc` 围栏里的**类名**，在**该档**的 Yarn 映射里查无，
 *         而 intermediary 等价类说「这个实体在本档该叫另一个名」⇒ 红【RENAME-STALE】。
 * 不管什么（各有邻门，见规划稿 §9）：方法签名/参数个数（签名门）、mojmap 口径与披露块
 *         （assert-skill-yarn-attest）、**技能源稿面**（本门只扫 rules/*.mdc；把 skills 面并进来的成本已实测 = 红候选 0
 *          —— 532 件 / 判名 5,032 / 五桶 2,544·1,216·**0**·4·1,268，见 CONTRIBUTING L85 与 D:/mc-skill-temp/logs-20260927/skillface-census2.txt，
 *          **扩不扩由用户裁**）、8 宿主镜像面（assert-skill-mirrors）。
 *
 * 真值源裁定（规划稿 §13）：锚 = intermediary，改名是**观测到的 diff**，不是形状推断。
 *   本轮实测：13 档同档内 intermediary↔named 一对一（distinct==类行）、空值 0 行；
 *   跨档 12,778 类里 904 改过 1 次名、46 改过 ≥2 次 ⇒ 「一 inter 多 named」只可能是改名本身。
 * 红腿谓词（§14）：强类型位 ∧ ¬限定右段 ∧ ¬箭头简写行 ∧ 锚唯一 ∧ 非 FAPI 碰撞名。
 *   切片 1 时实扫 17 个桶 3 候选 ⇒ 存活 1（fabric/1.14.4/.cursor/rules/10-gui.mdc 的 SimpleInventory）；
 *   **切片 4 已把那条正文修成 BasicInventory ⇒ 真树现 0 红**（同轮把 §#23 的「蹭真缺陷」反证换成自造五臂）。
 *   ⚠ 三条否决分量在当前存量上互不可区分（各自都能给出 1）⇒ 必要性只由 --selftest 逐条投毒钉。
 * 豁免与棘轮（§16/§22）：六列点名表 + 基线下界 < 与上界只许降；依据一断即红，例外不许静默扩张。
 *   基线**键集**由 collector 的 REQUIRED_FLOOR_KEYS / REQUIRED_CEILING_KEYS 钉死：真跑（含 --pack）少任一键
 *   ⇒ [BASELINE-KEY-LOSS] 红。理由 = compareFloors 按基线现有键循环，「删键」比「把地板写成 0」更安静。
 *   桶5（UNKNOWN-ALL-PACKS；2026-09-29 实扫 1 066 个「档 × 文件 × 名」位点）**不收编进豁免**：抽样全是 Gradle
 *   任务名／IDE 名／散文词，收编要么造上千条假红，要么给「豁免条数上界 0 且只许降」开一个永久口子。
 *   这里只印一个三分类读数（classifyBucket5 + --selftest 的 T60/T61/T62，四族之和必须等于桶5 的位数），
 *   它**不进 rc、不进基线、不作判据** —— 是切词器人群的健康读数，不是欠账。
 * I/O 四态（§4）：absent / NO-LIB-BY-DESIGN / era / zero-rows / unreadable —— **读失败不得塌成「查无此名」**。
 *
 * 档位面 = 规则树目录 ∪ 数据目录（有库没正文、有正文没库都真实存在，各按状态打印）。
 * 只读：本门不写仓库。队列需 --queue=<绝对路径> 且拒绝仓库内路径。
 * 用法：node scripts/assert-rules-api-names.mjs [--pack=fabric_1.21.1] [--queue=<abs>] | --selftest | --measure-floors
 * env：MC_SKILL_RULES_ROOT（只给 selftest）、MC_SKILL_RULES_DATA、MC_SKILL_RULES_BASELINE、MC_SKILL_RULES_EXEMPTIONS
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import {
  ARROW_LINE, NEG, STRONG, buildEquivalence, classify, compareFloors, corpusTokens, fenceIds, REQUIRED_CEILING_KEYS, REQUIRED_FLOOR_KEYS,
  fapiRoster, fapiSummaries, loaderSummaries, loadExemptions, mappingLeg, occContexts, partsOf, verCmp,
} from "./_lib/api-name-collector.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");

let ROOT = process.env.MC_SKILL_RULES_ROOT ? path.resolve(process.env.MC_SKILL_RULES_ROOT) : REPO_ROOT;
let DATA = process.env.MC_SKILL_RULES_DATA ? path.resolve(process.env.MC_SKILL_RULES_DATA) : path.join(ROOT, "data");
const BASELINE_PATH = process.env.MC_SKILL_RULES_BASELINE
  ? path.resolve(process.env.MC_SKILL_RULES_BASELINE)
  : path.join(HERE, "rules-api-names-baseline.json");
const EXEMPT_PATH = process.env.MC_SKILL_RULES_EXEMPTIONS
  ? path.resolve(process.env.MC_SKILL_RULES_EXEMPTIONS)
  : path.join(HERE, "rules-api-names.exemptions.txt");
// FAPI 名单第二来源（逐档摘要件）的落点。**故意不跟 MC_SKILL_RULES_DATA 走** —— 摘要件属 mcp-server/data/，
// 不是 data/ 语料面；把它做成可指空的目录，正是活证臂「同一份载荷、只切这个来源」要做两臂的机制前提。
const FAPI_SUM_DIR = process.env.MC_SKILL_RULES_FAPI_SUMMARIES
  ? path.resolve(process.env.MC_SKILL_RULES_FAPI_SUMMARIES)
  : path.join(HERE, "..", "data", "loader-api-summaries");
// 第三来源（加载器本体摘要件 <档>-fabric.json）与第二来源**同目录、不同件**，所以单独一个可指空的旋钮：
// 活证臂要能做「同一份载荷、只切 loader 面」的两臂，共用 env 就切不开了。
const LOADER_SUM_DIR = process.env.MC_SKILL_RULES_LOADER_SUMMARIES
  ? path.resolve(process.env.MC_SKILL_RULES_LOADER_SUMMARIES)
  : path.join(HERE, "..", "data", "loader-api-summaries");

const verOf = (pack) => pack.slice("fabric_".length);
const packOf = (ver) => `fabric_${ver}`;
/** 队列的唯一排序键（规划稿 §21）：pack 数值序 → relPath → line → id。analyze 与 renderQueue 共用一份。 */
const sgn = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
const queueCmp = (a, b) =>
  verCmp(String(a.pack ?? "").slice("fabric_".length), String(b.pack ?? "").slice("fabric_".length)) ||
  sgn(String(a.relPath ?? ""), String(b.relPath ?? "")) ||
  Number(a.line ?? 0) - Number(b.line ?? 0) ||
  sgn(String(a.id ?? ""), String(b.id ?? ""));
/** 红行与冲突哨兵的排序键（ver 数值序 → relPath → at → id）。
 *  这两面打印时只截前 N 条（红全印但豁免后可能很长，冲突哨兵只印前 4、AMBIGUOUS-CLASS 前 10），
 *  不排 ⇒ 「被展示的是哪几条」随 fs.readdirSync 的目录枚举序变（§21 确定性要求的同一形状）。 */
const siteCmp = (a, b) =>
  verCmp(String(a.ver ?? ""), String(b.ver ?? "")) ||
  sgn(String(a.relPath ?? ""), String(b.relPath ?? "")) ||
  Number(a.at ?? 0) - Number(b.at ?? 0) ||
  sgn(String(a.id ?? ""), String(b.id ?? ""));
let SELFTEST_FAPI_DIR = null; // selftest() 里置为空白目录；主入口与真跑保持 null ⇒ 用仓库真摘要件

function setRoots(root, data) {
  ROOT = path.resolve(root);
  DATA = data ? path.resolve(data) : path.join(ROOT, "data");
}

// 桶5（UNKNOWN-ALL-PACKS = 全档映射与语料皆查无）的**三分类读数**。这 1 066 条不收编进豁免：
// 要么造上千条假红，要么给「豁免条数上界 0 且只许降」开永久口子 —— 后者更坏（用户 2026-09-29 裁定）。
// 所以这里**只印数、当切词器健康读数**：判据是行级形状（不引词表、不引名单），四类互斥且必闭合
// （ide → gradle → prose → other 按序取第一个命中），闭合等式由 selftest T58 在合成输入上钉。
const B5_IDE = /(IntelliJ|IDEA|Eclipse|VS ?Code|Cursor|Qoder|编辑器|\bIDE\b)/;
const B5_GRADLE = /gradlew|build\.gradle|settings\.gradle|gradle\.properties|\.gradle\b|loom|repositor|dependenc|sourceSets|filesMatching|processResources|genSources|mavenCentral|archivesBaseName|\btasks?\b|runClient|runServer|\.jar\b|remap|mapping|SNAPSHOT/i;
/** 行尾注释段（`#` 或 `//` 之后）；IDE 名实测总与 gradlew 命令同一行，所以判序必须先 ide 后 gradle。 */
function b5CommentTail(line) {
  const m = /(?:#|\/\/)([\s\S]*)$/.exec(String(line ?? ""));
  return m ? m[1] : "";
}
function classifyBucket5(id, line) {
  const t = b5CommentTail(line);
  if (t && B5_IDE.test(t) && new RegExp(`(^|[^A-Za-z0-9_])${id}([^A-Za-z0-9_]|$)`).test(t)) return "ide";
  if (/^[a-z]/.test(id) || B5_GRADLE.test(line ?? "")) return "gradle";
  if (/^[A-Z][a-z0-9]+$/.test(id)) return "prose";
  return "other";
}

/** 核心：扫一遍，返回全部判定与计数。opts.onlyPack 只扫单档（探针/定位用，地板按整面签）。 */
export function analyze(opts = {}) {
  const root = opts.root ? path.resolve(opts.root) : ROOT;
  const dataRoot = opts.dataRoot ? path.resolve(opts.dataRoot) : DATA;
  const baseline = opts.baseline ?? readBaseline();
  const exemptionsText = opts.exemptionsText ?? (fs.existsSync(opts.exemptPath ?? EXEMPT_PATH) ? fs.readFileSync(opts.exemptPath ?? EXEMPT_PATH, "utf8") : "");
  const t0 = Date.now();

  const rulesRoot = path.join(root, "fabric");
  const dirsOf = (d) => {
    try { return fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name); } catch { return []; }
  };
  // 档位形状必须现查：data/ 下另有 fabric_porting 这类**非版本**目录，按前缀收会把它们当成档
  // （实测多出一个 absent 腿 + 分母从 14 涨到 15），所以只认 \d+(\.\d+)+ 形态。
  const isVer = (v) => /^\d+(\.\d+)+$/.test(v);
  const rulesVers = dirsOf(rulesRoot).filter(isVer);
  const dataVers = dirsOf(dataRoot)
    .filter((x) => /^fabric_.+$/.test(x))
    .map((x) => x.slice("fabric_".length))
    .filter(isVer);
  const vers = [...new Set([...rulesVers, ...dataVers])].sort(verCmp);
  const packs = opts.onlyPack ? vers.filter((v) => packOf(v) === opts.onlyPack) : vers;

  // ① 映射腿（四态）+ 等价类。legs 用全档，不受 onlyPack 影响，否则单档跑会把锚算错。
  const legOf = new Map();
  for (const v of vers) legOf.set(v, mappingLeg(packOf(v), path.join(dataRoot, packOf(v))));
  const io = [...legOf.values()].filter((l) => l.state === "unreadable");
  const eq = buildEquivalence([...legOf.values()], verOf);

  // ② Fabric API 否决位名单
  const tR = Date.now();
  const roster = fapiRoster(dataRoot, vers.map(packOf));
  const rosterMs = Date.now() - tR;
  // ②b 第二来源：逐档 fabric-api 摘要件（规划稿 §27 ① 登记的洞 —— 语料从不写 FAPI 限定名）
  // SELFTEST_FAPI_DIR：selftest 一律走一个**空的**摘要件目录。不这么做的话，46 组合成夹具会被仓库真名单
  // 静默否决 —— 新否决面里含 `Container` / `Frame` 这类通用名，将来谁拿它们做夹具就悄悄不红了。
  const fapiSum = fapiSummaries(opts.fapiSummariesDir ?? SELFTEST_FAPI_DIR ?? FAPI_SUM_DIR, vers);
  // ②c 第三来源：加载器本体的逐档摘要件（`<档>-fabric.json`，2026-09-28 由 scaffold 钉的 fabric-loader
  // -sources.jar 经 scripts/decompile-loader-apis.mjs 生成）。`ClientModInitializer` / `Environment` / `EnvType`
  // 这类 loader 类既不在本档 yarn 映射、也不在语料 FQCN 与 fabric-api 名单里 ⇒ 前两路都挡不住，
  // 规则树写正规入口点会被判成 RENAME-STALE 假红（探针实测 14 档各 265/79 类，net.fabricmc.* 全含）。
  const loaderSum = loaderSummaries(opts.loaderSummariesDir ?? SELFTEST_FAPI_DIR ?? LOADER_SUM_DIR, vers);

  // ③ 语料 token（桶 2 的那道证明；注释行不算出处）
  const tC = Date.now();
  const corpusOf = new Map();
  for (const v of vers) corpusOf.set(v, corpusTokens(path.join(dataRoot, packOf(v))));
  const corpusMs = Date.now() - tC;

  // ④ 规则树面
  const reds = [], queue = [], waived = [], exemptBad = [], conflicts = [];
  const bucketCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 0: 0 };
  const b5 = { ide: 0, gradle: 0, prose: 0, other: 0 }; // 桶5 三分类读数（只打印，见 classifyBucket5 头注）
  let rulesFiles = 0, judgedNames = 0, fenceOddFiles = 0, classOrFapi = 0, multiAnchorRed = 0, arrowSites = 0;
  const fenceOddList = [];
  let corpusPacks = 0;
  for (const v of vers) {
    const c = corpusOf.get(v);
    if (c && c.tokens.size > 0) corpusPacks++;
  }
  for (const v of packs) {
    const dir = path.join(rulesRoot, v, ".cursor", "rules");
    if (!fs.existsSync(dir)) continue;
    const leg = legOf.get(v);
    const toks = corpusOf.get(v)?.tokens ?? new Set();
    for (const f of fs.readdirSync(dir).filter((x) => /\.mdc$/.test(x))) {
      const rel = `fabric/${v}/.cursor/rules/${f}`;
      let text = "";
      try { text = fs.readFileSync(path.join(dir, f), "utf8"); } catch { exemptBad.push(`${rel}: 读不动`); continue; }
      rulesFiles++;
      const { ids, fenceOdd } = fenceIds(text);
      if (fenceOdd) { fenceOddFiles++; fenceOddList.push(rel); }
      const decl = new Set([...text.matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_]*)/g)].map((m) => m[1]));
      const agg = new Map();
      for (const { id, at, line } of ids) {
        if (decl.has(id)) continue;
        const flags = occContexts(line, id);
        if (flags.has("ARROWLINE")) arrowSites++;
        if (!agg.has(id)) agg.set(id, { flags: new Set(), at, line });
        const a = agg.get(id);
        for (const fl of flags) a.flags.add(fl);
      }
      const presentElsewhere = (id) => vers.filter((vv) => vv !== v && legOf.get(vv).state === "ok" && legOf.get(vv).tails.has(id));
      for (const [id, a] of agg) {
        judgedNames++;
        const site = { ver: v, relPath: rel, id, flags: a.flags, at: a.at, line: a.line };
        const r = classify(site, { leg, eq, roster, fapiSum, loaderSum, tokens: toks, presentElsewhere: presentElsewhere(id) });
        r.occFlags = [...a.flags].sort().join(",");
        bucketCount[r.bucket] = (bucketCount[r.bucket] ?? 0) + 1;
        // 口径与 bucketCount 逐字同分母：一个「档 × 文件 × 名」位点计一次，行文本取该位点首现行（同 a.at）。
        if (r.bucket === 5) b5[classifyBucket5(id, a.line)]++;
        if (r.verdict === "CLASS-OR-FAPI") classOrFapi++;
        if (r.verdict === "BUCKET-CONFLICT") conflicts.push({ ...r, ...site, ver: v }); // 冲突哨兵单独一面：不占 renameStaleRed 的数，也不许被豁免表洗
        else if (r.red) {
          if ((eq.tailToInter.get(id) ?? new Set()).size >= 2) multiAnchorRed++;
          reds.push({ ...r, ...site, ver: v });
        } else if (r.bucket >= 3 || r.verdict === "CLASS-OR-FAPI") {
          queue.push({ bucket: r.verdict, pack: packOf(v), relPath: rel, line: a.at, id, candidates: r.candidates, anchor: r.anchor, legState: leg.state, occFlags: r.occFlags, why: r.why });
        }
      }
    }
  }

  // ⑤ 豁免：命中即放行并验证依据；依据断 ⇒ 红
  const ex = opts.exemptions ?? loadExemptions(exemptionsText);
  const exIndex = new Map();
  for (const row of ex.rows) exIndex.set(`${row.relPath}|${row.line}|${row.simpleName}`, row);
  const keptReds = [];
  for (const red of reds) {
    const key = `${red.relPath}|${red.at}|${red.id}`;
    const row = exIndex.get(key);
    if (!row) { keptReds.push(red); continue; }
    const abs = path.join(root, row.relPath);
    const lineText = fs.existsSync(abs) ? (fs.readFileSync(abs, "utf8").split(/\r?\n/)[row.line - 1] ?? "") : "";
    if (!lineText.includes(row.simpleName)) {
      exemptBad.push(`EXEMPTION-STALE ${key}：该行现已不含此名（正文已改 ⇒ 豁免行必须删）`);
      keptReds.push(red);
      exIndex.delete(key);
      continue;
    }
    const v = verOf(packOf(red.ver ? red.ver : row.relPath.split("/")[1]));
    const leg = legOf.get(v);
    if (!leg || !leg.tails.has(row.newName)) {
      exemptBad.push(`EXEMPTION-FABRICATED ${key}：提名 ${row.newName} 在本档 yarn 映射查无（不许编造正解）`);
      keptReds.push(red);
      exIndex.delete(key);
      continue;
    }
    waived.push(`${key} → ${row.newName}（basis=${row.basis}）`);
    exIndex.delete(key);
  }
  // 没对上任何红点的豁免行 = 行号写错 / 正文挪位 / 已修完 —— 同样算依据断，不许堆死行
  for (const [key] of exIndex) {
    exemptBad.push(`EXEMPTION-STALE(未命中) ${key}：本档现无该红点，豁免行要么行号错、要么正文已改完，必须删`);
  }

  const measured = {
    packs: vers.length,
    packsWithLib: [...legOf.values()].filter((l) => l.state === "ok").length,
    classRows: [...legOf.values()].filter((l) => l.state === "ok").reduce((a, l) => a + l.rows, 0),
    rulesFiles, judgedNames,
    bucket1: bucketCount[1],
    equivClasses: eq.classTotal, equivNames: eq.nameTotal,
    rosterNames: roster.names.size, corpusPacks,
    fapiSumPacks: fapiSum.byVer.size, fapiSumNames: fapiSum.namesTotal, fapiSumUnion: fapiSum.unionSize, fapiSumAbsent: fapiSum.absent.length,
    loaderSumPacks: loaderSum.byVer.size, loaderSumNames: loaderSum.namesTotal, loaderSumUnion: loaderSum.unionSize, loaderSumAbsent: loaderSum.absent.length,
    ambiguousClass: eq.ambiguous.length, bucketConflict: conflicts.length,
    renameStaleRed: keptReds.length, classOrFapi, exemptions: ex.rows.length,
    ambiguousRoster: roster.ambiguous.length, multiAnchorRed, fenceOddFiles,
  };
  // --pack 是**故意只扫一面**：整面地板必然跌破，那不是缺陷而是没执法 ⇒ 明说不执法，不装作绿。
  const partial = !!opts.onlyPack;
  const trips = partial ? [] : baseline ? compareFloors(measured, baseline, vers.length, !!opts.requireKeys) : [{ kind: "COLLECTOR", msg: "[FLOOR-COLLECTOR] 缺基线文件 rules-api-names-baseline.json ⇒ 棘轮不存在，门不许当绿" }];
  // --pack 跳过整面地板（必然跌破，那是没执法不是缺陷），但**基线键集**这条不跳过 —— 删键做绿与扫几档无关。
  if (partial && baseline && opts.requireKeys) for (const t of compareFloors(measured, baseline, vers.length, true)) if (t.kind === "BASELINE") trips.push(t);
  if (ex.bad.length) for (const b of ex.bad) trips.push({ kind: "EXEMPT", msg: `[EXEMPTION-BAD] ${b}` });

  // 奇偶不闭合的代码围栏 = 该文件**后半篇整体脱离判名面**（fenceIds 从此不再收名）⇒ 这是采集面塌缩，
  // 不是格式瑕疵。采集器头注早就写「由调用方判红」却只印了个数（2026-09-27 切片 4 之后补上执法）。
  const fenceOddMax = baseline?.ceilings?.fenceOddFilesMax ?? 0;
  if (!partial && fenceOddList.length > fenceOddMax) {
    for (const f of fenceOddList) trips.push({ kind: "FENCE", msg: `[FENCE-ODD] ${f}：代码围栏数量为奇数 ⇒ 该文件后半篇不被判名` });
    trips.push({ kind: "FENCE", msg: `[FENCE-CEILING] 不闭合围栏 ${fenceOddList.length} 件 > 上界 ${fenceOddMax}（口径：${baseline?.basis?.fenceOddFiles ?? "见基线 fenceOddFilesMax"}；只准降不准升，真要有历史欠账须逐件点名后写进基线并附证据）` });
  }

  // 摘要件**在盘但读不动** ⇒ 该档的 FAPI 否决面塌成零。这方向是「更容易红」（假红），不是假绿，
  // 但按本门一条不改的规矩：采集面塌缩必须点名，不许静默把它当成「该档没有 FAPI 名」。
  // 两路来源各自点名（串不同 ⇒ 老断言按 [FAPI-SUMMARY-UNREADABLE] 匹配的仍只匹配第二路）。
  for (const [sum, label, tag] of [[fapiSum, "fabric-api", "FAPI-SUMMARY-UNREADABLE"], [loaderSum, "fabric-loader", "LOADER-SUMMARY-UNREADABLE"]]) {
    if (partial || !sum.unreadable.length) continue;
    for (const v of sum.unreadable) {
      trips.push({ kind: "SUM-UNREADABLE", msg: `[${tag}] ${v}：${label} 摘要件存在但解析失败 ⇒ 该档该路否决源熄火，与 vanilla 同名的类会被判成 RENAME-STALE 假红（落点 ${sum.dir}）` });
    }
  }

  // 同档 inter→多named = 摄入出错（规划稿 §13 第 1 类歧义的裁定：判红，不许绿）。建表侧已改成「不静默覆盖」，
  // 这里负责让它咬到 rc —— 否则坏库只会表现为「少几条等价类」，谁都看不见。
  if (!partial && eq.ambiguous.length) {
    for (const a of eq.ambiguous.slice(0, 10)) trips.push({ kind: "AMBIG", msg: `[AMBIGUOUS-CLASS] ${a} ⇒ 等价类面拒绝在此库上继续判定（先修摄入或按档摘库，不许拿改名解释它）` });
    if (eq.ambiguous.length > 10) trips.push({ kind: "AMBIG", msg: `[AMBIGUOUS-CLASS] 另有 ${eq.ambiguous.length - 10} 条同类（只点名前 10 条）` });
  }

  // 队列的序在 renderQueue 里统一排（queueCmp）。这里曾经另有一份 `pack+relPath+line+id` 的 localeCompare 拼接排序 ——
  // 拼接串比较既不是版本数值序（fabric_1.21.10 会排到 fabric_1.21.8 前）也不是行号数值序（113 排到 35 前），
  // 而它把 fs.readdirSync 的序「洗成了看起来有序」，所以上一轮我只看见「没排」没看见「排错」。两份实现留一份。
  queue.sort(queueCmp);
  return {
    reds: keptReds.sort(siteCmp), waived, exemptBad, conflicts: conflicts.sort(siteCmp), queue, trips, io, measured, bucketCount, b5,
    legModes: countBy([...legOf.values()].map((l) => l.state)),
    partial, unenforced: partial ? 1 : 0,
    fenceOddFiles, fenceOddList, fenceOddMax, arrowSites, rosterMs, corpusMs, legMs: Date.now() - t0 - rosterMs - corpusMs,
    ms: Date.now() - t0, vers, roster, fapiSum, loaderSum, eq, legOf,
  };
}

function countBy(arr) { const o = {}; for (const x of arr) o[x] = (o[x] ?? 0) + 1; return o; }

function readBaseline() {
  try { return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")); } catch { return null; }
}

/** 只读统计：该档 `data/` 面有没有 `fabric-docs` 正文（规划稿 §4「无语料正文档」态 + §12 自评新增②）。
 *  没有正文的档，桶 2「仅本档语料证出」的支撑只剩 fabric-wiki / reference 那几页，属**弱支撑**，
 *  但门不据此判红（平 0 ≠ 不存在），只把档数印出来，免得下轮把「语料档=14」读成「14 档都有正文」。 */
function docsBodyPacks(dataRoot, vers) {
  let n = 0;
  for (const v of vers) {
    const dir = path.join(dataRoot, packOf(v), "fabric-docs");
    if (!fs.existsSync(dir)) continue;
    let found = false;
    const stack = [dir];
    while (stack.length && !found) {
      const cur = stack.pop();
      let ents = [];
      try { ents = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
      for (const e of ents) {
        if (e.isFile() && /\.md$/.test(e.name)) { found = true; break; }
        if (e.isDirectory()) stack.push(path.join(cur, e.name));
      }
    }
    if (found) n++;
  }
  return n;
}

export function renderQueue(rows) {
  const head = ["bucket", "pack", "relPath", "line", "simpleName", "candidates", "anchor", "legState", "occFlags", "why"].join("\t");
  // 稳定排序（规划稿 §21：pack 数值序 → relPath → line → id）。不排 ⇒ 行序 = fs.readdirSync 的目录顺序，
  // 同一棵树换机器/换文件系统可以给出**同样字节数、完全不同行序**的队列（本轮实测：乱序喂入两侧都是 531 B、行序相反）
  // ⇒ 人工审队列时的 diff 全是噪音，而 selftest 的两次同进程跑（T36）结构上抓不到这一条（同一次 readdir 顺序必然一致）。
  const sorted = [...rows].sort(queueCmp);
  const body = sorted.map((r) => [
    r.bucket, r.pack, r.relPath, r.line, r.id,
    r.candidates?.length ? r.candidates.map((c) => `${c.ver}=${c.named}`).join("|") : "-",
    r.anchor ?? "-", r.legState, r.occFlags, r.why.replace(/[\t\n]/g, " "),
  ].join("\t"));
  return [head, ...body].join("\n") + "\n";
}

function main(argv) {
  const onlyPack = argv.find((a) => a.startsWith("--pack="))?.slice("--pack=".length);
  const qFlag = argv.find((a) => a.startsWith("--queue="))?.slice("--queue=".length);
  const r = analyze({ onlyPack, requireKeys: true });

  if (r.io.length) {
    for (const l of r.io) console.error(`【SQLITE-UNREADABLE】${l.pack}：${l.why}`);
    console.error("⇒ 读失败不得塌成「查无此名」；本门在任何内容判定之前即红（规划稿 §4）。");
    process.exitCode = 1;
    return;
  }
  for (const red of r.reds) {
    console.error(
      `【RENAME-STALE】${red.relPath}:${red.at} ${red.id} → 本档该叫 ${red.candidates.find((c) => c.ver === red.ver)?.named ?? "?"}｜锚 ${red.anchor}｜链 ${red.candidates.slice(0, 6).map((c) => `${c.ver}=${c.named}`).join(" ")}`,
    );
    console.error(`    该位上下文 [${red.occFlags}]｜判据：本档 yarn 映射查无 + 等价类给出本档正解 + 强类型位且非箭头简写行/限定右段`);
  }
  for (const w of r.waived) console.log(`  WAIVED ${w}`);
  if (r.conflicts.length) console.log(`  冲突哨兵 c1∧c3=${r.conflicts.length} 条（只计数不判红，理由见 collector:classify；逐条：${r.conflicts.slice(0, 4).map((c) => `${c.relPath}:${c.at} ${c.id}`).join(" ")}${r.conflicts.length > 4 ? " …" : ""}）`);
  // 去混淆档的等价类腿「按设计不适用」必须无条件点名（规划稿 §13 第 3 类），不许与「库不见了(absent)」混成一谈
  const byDesign = [...r.legOf.entries()].filter(([, l]) => l.state === "no-lib-by-design").map(([v]) => v);
  if (byDesign.length) console.log(`  等价类腿不适用（去混淆档，按设计无 yarn 库；桶 2 语料腿仍适用）：${byDesign.join(", ")}`);
  for (const b of r.exemptBad) console.error(`【${b}】`);
  for (const t of r.trips) console.error(`【${t.msg}】`);

  if (qFlag) {
    const abs = path.resolve(qFlag);
    if (abs.startsWith(REPO_ROOT + path.sep)) { console.error(`【QUEUE-IN-REPO】拒绝把队列写进仓库面：${abs}`); process.exitCode = 1; return; }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, renderQueue(r.queue), "utf8");
    console.log(`  队列已写 ${abs}（${r.queue.length} 行）`);
  }

  const m = r.measured;
  console.log(
    `汇总 档=${r.vers.length} 有库=${m.packsWithLib} 类行=${m.classRows} 等价类=${m.equivClasses}/${m.equivNames}名 名单=${m.rosterNames}(歧义${m.ambiguousRoster}) 语料档=${m.corpusPacks}` +
    ` | 文件=${m.rulesFiles} 判名=${m.judgedNames} 桶1=${m.bucket1} 桶2..5=${r.bucketCount[2]}/${r.bucketCount[3]}/${r.bucketCount[4]}/${r.bucketCount[5]}` +
    ` | 红=${m.renameStaleRed} 豁免=${m.exemptions} CLASS-OR-FAPI=${m.classOrFapi} 队列=${r.queue.length} 未执法腿=${r.unenforced}` +
    ` | 桶5三分类=Gradle ${r.b5.gradle}／IDE ${r.b5.ide}／散文 ${r.b5.prose}／未证类名 ${r.b5.other}（合计 ${r.b5.ide + r.b5.gradle + r.b5.prose + r.b5.other}／桶5 ${r.bucketCount[5]}；只打印不判红、不收编进豁免）` +
    `${r.partial ? "（--pack 单档跑 ⇒ 整面地板本轮不执法，不是绿）" : ""}`,
  );
  console.log(
    `  腿态=${JSON.stringify(r.legModes)} docs正文档=${docsBodyPacks(DATA, r.vers)}/${r.vers.length}档(其余档只有 fabric-wiki/reference ⇒ 桶2 弱支撑，计数不判红) 镜像同态=本门只扫 .cursor 源稿，7 面镜像由 assert-skill-mirrors 执法 围栏奇偶不闭合文件=${r.fenceOddFiles}(上界 ${r.fenceOddMax}，超出即红并逐件点名) FAPI否决源=语料${m.rosterNames}名+摘要件${m.fapiSumPacks}/${r.vers.length}档(逐档${m.fapiSumNames}·并集${m.fapiSumUnion}·缺席${m.fapiSumAbsent})+loader摘要件${m.loaderSumPacks}/${r.vers.length}档(逐档${m.loaderSumNames}·并集${m.loaderSumUnion}·缺席${m.loaderSumAbsent}) 箭头位=${r.arrowSites} | 计时 wall=${r.ms}ms leg=${r.legMs}ms corpus=${r.corpusMs}ms roster=${r.rosterMs}ms（时间不进 rc）`,
  );
  console.log(`  队列头（最多 15 行，全量配 --queue=<绝对路径>）：`);
  // 先排后截：排序在 renderQueue 内部做，所以这里必须拿**全量**渲染再取前 15 行 —— 旧写法是 slice(0,15) 再把那 15 行排，
  // 「被展示的是哪 15 条」仍随 fs.readdirSync 的目录顺序变，§21 的稳定排序要求就落空了。
  const qhead = renderQueue(r.queue).split("\n").slice(1, 16);
  for (const l of qhead) console.log("    " + l.replace(/\t/gi, " | "));
  process.exitCode = r.reds.length || r.trips.length || r.exemptBad.length ? 1 : 0;
}

/** 只打印建议基线，不写盘（写盘归用户；见规划稿 §22「禁止自动 RELEDGER」）。 */
function measureFloors() {
  const r = analyze({ requireKeys: true });
  const m = r.measured;
  const out = {
    asOf: new Date().toISOString().slice(0, 10),
    floors: {
      packsMin: r.vers.length,
      packsWithLibMin: m.packsWithLib, classRowsMin: m.classRows, rulesFilesMin: m.rulesFiles,
      judgedNamesMin: m.judgedNames, bucket1Min: m.bucket1, equivClassesMin: m.equivClasses,
      equivNamesMin: m.equivNames, rosterNamesMin: m.rosterNames, corpusPacksMin: m.corpusPacks,
    },
    ceilings: {
      renameStaleRedMax: m.renameStaleRed, classOrFapiMax: m.classOrFapi,
      exemptionsMax: m.exemptions, ambiguousRosterMax: m.ambiguousRoster, multiAnchorRedMax: m.multiAnchorRed,
      fenceOddFilesMax: m.fenceOddFiles,
    },
  };
  console.log(JSON.stringify(out, null, 2));
  // 量具自己也要自证：它印出的键集必须覆盖 REQUIRED_*，否则「照抄建议值」= 静默删棘轮。
  const missing = [...REQUIRED_FLOOR_KEYS, ...REQUIRED_CEILING_KEYS].filter(
    (k) => !(k in out.floors) && !(k in out.ceilings),
  );
  if (r.trips.length) {
    console.log(`⚠ 本次读数同时触发现行基线的 ${r.trips.length} 条 trip（本命令是量具，不改判、rc 只反映量具自身的完整性）：`);
    for (const t of r.trips) console.log(`   · ${t.msg.slice(0, 150)}`);
    console.log("⇒ 若 trip 是「数确实跌了」，那是内容/数据侧事件，须按门的红去查，不能只抄新数把地板调低。");
  }
  const signed = readBaseline() ?? { floors: {}, ceilings: {} };
  const signedKeys = [...Object.keys(signed.floors ?? {}), ...Object.keys(signed.ceilings ?? {})];
  const outKeys = [...Object.keys(out.floors), ...Object.keys(out.ceilings)];
  const dropped = signedKeys.filter((k) => !outKeys.includes(k));
  const added = outKeys.filter((k) => !signedKeys.includes(k));
  if (missing.length) console.log(`【METER-INCOMPLETE】量具自己不产这些必需键：${missing.join(",")} ⇒ 照抄建议值等于静默删棘轮，本命令判红`);
  if (dropped.length) console.log(`【METER-OUT-OF-STEP】现行基线有而量具不产的键：${dropped.join(",")}（照抄建议值会把它们抄没）`);
  if (added.length) console.log(`  · 量具新产而基线尚未签的键（只提示，不判红）：${added.join(",")}`);
  console.log("⇒ 上面是**现扫建议值（零余量）**；只打印不写盘。抄回基线时保留既有余量与 basis 注释 —— 把 3,981 直接抄成 judgedNamesMin 等于把下界改成等式，之后任何一次正常删改都会假红。");
  process.exitCode = missing.length || dropped.length ? 1 : 0;
}

// ═════════════════ selftest：合成 pack + 合成 .mdc，全部内存/tmp，不读真实 13 档数据 ═════════════════
function fakeLeg(pack, rows, state = "ok") {
  const leg = {
    pack, state, era: state === "ok" ? "yarn-tiny" : null, why: "fixture", usable: state === "ok",
    rows: state === "ok" ? rows.length : 0, nested: 0, tails: new Set(), fqcnByTail: new Map(),
    interToNamed: new Map(), namedToFqcn: new Map(), memberTails: new Set(), proven: new Set(),
  };
  if (state !== "ok") return leg;
  for (const [fq, inter] of rows) {
    const tail = fq.slice(fq.lastIndexOf("/") + 1);
    leg.tails.add(tail);
    if (!leg.fqcnByTail.has(tail)) leg.fqcnByTail.set(tail, new Set());
    leg.fqcnByTail.get(tail).add(fq);
    if (inter) { leg.interToNamed.set(inter, tail); leg.namedToFqcn.set(fq, inter); }
  }
  leg.proven = new Set([...leg.tails, ...leg.memberTails]);
  return leg;
}

function mkCtx(legs, extra = {}) {
  const eq = buildEquivalence(legs, verOf);
  return { eq, roster: extra.roster ?? { names: new Map(), ambiguous: [] }, tokens: extra.tokens ?? new Set(), ...extra };
}

function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-"));
  // 夹具一律与仓库真摘要件解耦（见 analyze 里那段注释）；T47/T48 自己传目录，不受此影响。
  SELFTEST_FAPI_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-selftest-fapi-"));
  const cases = [];
  let missed = 0;
  const arm = (name, fn) => cases.push({ name, fn });
  const eqFail = (a, b, what) => (a === b ? null : `${what}: 期望 ${JSON.stringify(b)}，实得 ${JSON.stringify(a)}`);

  // —— 合成三档：1.20.1 旧名 / 1.21.1 新名 / 1.21.10 第三次名 ——
  const P1 = "1.20.1", P2 = "1.21.1", P3 = "1.21.10";
  const legs3 = () => [
    fakeLeg(packOf(P1), [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_6044"], ["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]),
    fakeLeg(packOf(P2), [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"], ["net/minecraft/particle/BlockParticle", "net/minecraft/class_6044"], ["net/minecraft/particle/BrandNewParticle", "net/minecraft/class_7777"]]),
    fakeLeg(packOf(P3), [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"], ["net/minecraft/particle/TwoOptionParticle", "net/minecraft/class_6044"]]),
  ];

  // 1 桶1 绿
  arm("T01 本档映射证出 ⇒ 桶1 绿", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "SimpleParticleType", flags: new Set(["new"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.bucket, 1, "bucket") || eqFail(r.red, false, "red");
  });
  // 2 改名跟丢 ⇒ 红
  arm("T02 本档查无 + 锚给正解 + new 位 ⇒ 红 RENAME-STALE", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "DefaultParticleType", flags: new Set(["new"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.bucket, 3, "bucket") || eqFail(r.red, true, "red") || eqFail(r.verdict, "RENAME-STALE", "verdict");
  });
  // 3 箭头行否决
  arm("T03 同一个名换成箭头简写行 ⇒ 不红，进队列（证 ARROWLINE 分量必要）", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "DefaultParticleType", flags: new Set(["new", "ARROWLINE"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.red, false, "red") || eqFail(r.verdict, "RENAME-UNRESOLVED", "verdict");
  });
  // 4 限定右段否决
  arm("T04 限定名右段 ⇒ 不红（证 rightseg 分量必要）", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "DefaultParticleType", flags: new Set(["rightseg", "new"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.red, false, "red") || eqFail(r.verdict, "RENAME-UNRESOLVED", "verdict");
  });
  // 5 非强类型位否决
  arm("T05 只 bare（散文里提到）⇒ 不红（证 STRONG 分量必要）", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "DefaultParticleType", flags: new Set(["bare"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.red, false, "red");
  });
  // 6 锚不唯一否决（跨包同名：两个 intermediary 的历史名都是它）
  arm("T06 同名跨两个 intermediary（跨包同名）⇒ 不红，why 含「锚不唯一」", () => {
    const legs = [
      fakeLeg(packOf(P1), [["net/minecraft/a/AmbiguousThing", "net/minecraft/class_5001"], ["net/minecraft/b/AmbiguousThing", "net/minecraft/class_5002"]]),
      fakeLeg(packOf(P2), [["net/minecraft/a/ChangedOne", "net/minecraft/class_5001"], ["net/minecraft/b/ChangedTwo", "net/minecraft/class_5002"]]),
    ];
    const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "AmbiguousThing", flags: new Set(["new"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.red, false, "red") || (r.why.includes("锚不唯一") ? null : "why 没写锚不唯一：" + r.why);
  });
  // 7 FAPI 碰撞名否决
  arm("T07 名单∩等价类（如 Screens）⇒ 不红", () => {
    const legs = [
      fakeLeg(packOf(P1), [["net/fabricmc/fabric/api/client/screen/v1/Screens", "net/minecraft/class_3929"]]),
      fakeLeg(packOf(P2), [["net/minecraft/HandledScreens", "net/minecraft/class_3929"]]),
    ];
    const roster = { names: new Map([["Screens", new Set(["net/fabricmc/fabric/api/client/screen/v1"])]]), ambiguous: [] };
    const ctx = mkCtx(legs, { roster });
    const r = classify({ ver: P2, relPath: "x", id: "Screens", flags: new Set(["owner", "new"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.red, false, "red");
  });
  // 8 c2∧c3 ⇒ CLASS-OR-FAPI，不红
  arm("T08 语料逐字有此名 + 锚说该改名 ⇒ CLASS-OR-FAPI（不红，进队列）", () => {
    const legs = legs3();
    const ctx = mkCtx(legs, { tokens: new Set(["DefaultParticleType"]) });
    const r = classify({ ver: P2, relPath: "x", id: "DefaultParticleType", flags: new Set(["new"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.verdict, "CLASS-OR-FAPI", "verdict") || eqFail(r.red, false, "red");
  });
  // 9 桶4：该实体在本档根本不存在（锚在本档无名）⇒ 只在他档存在
  arm("T09 只在他档存在且本档无该锚 ⇒ 桶4 ADDED-LATER，不红", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P1, relPath: "x", id: "BrandNewParticle", flags: new Set(["new"]), at: 1, line: "" }, { ...ctx, leg: legs[0], presentElsewhere: [P2] });
    return eqFail(r.bucket, 4, "bucket") || eqFail(r.red, false, "red");
  });
  // 9b 同一形状但锚在本档另有名 ⇒ 那是改名跟丢（桶3），不得混进桶4
  arm("T09b 他档有名 + 本档该锚另有名 ⇒ 归桶3 且判红（前瞻写法也是缺陷，与 4c 同向）", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P1, relPath: "x", id: "BlockParticle", flags: new Set(["new"]), at: 1, line: "" }, { ...ctx, leg: legs[0], presentElsewhere: [P2, P3] });
    return eqFail(r.bucket, 3, "bucket") || eqFail(r.red, true, "red");
  });
  // 10 桶5
  arm("T10 全档皆无 ⇒ 桶5 UNKNOWN-ALL-PACKS，不红（平 0 不等于不存在）", () => {
    const legs = legs3(); const ctx = mkCtx(legs);
    const r = classify({ ver: P2, relPath: "x", id: "IntelliJThing", flags: new Set(["bare"]), at: 1, line: "" }, { ...ctx, leg: legs[1] });
    return eqFail(r.bucket, 5, "bucket") || eqFail(r.red, false, "red");
  });
  // 11 多跳链按数值序
  arm("T11 三跳链 1.20.1→1.21.1→1.21.10 按数值序给全链（非 Map 迭代序）", () => {
    const ctx = mkCtx(legs3());
    const ch = ctx.eq.chain("net/minecraft/class_6044").map((c) => `${c.ver}=${c.named}`).join(" ");
    return eqFail(ch, `${P1}=SimpleParticleType ${P2}=BlockParticle ${P3}=TwoOptionParticle`, "chain");
  });
  // 12 verCmp 数值序
  arm("T12 版本数值序：1.21.8 < 1.21.10 < 1.21.11 < 26.1.2", () => {
    const s = ["26.1.2", "1.21.10", "1.21.8", "1.21.11", "1.21.9"].sort(verCmp).join(" ");
    return eqFail(s, "1.21.8 1.21.9 1.21.10 1.21.11 26.1.2", "排序");
  });
  // 13 注释行不进面
  arm("T13 围栏里的注释行 // new DefaultParticleType( 不进取名面", () => {
    const { ids } = fenceIds("```java\n// DefaultParticleType x = new DefaultParticleType();\nclass Foo {}\n```");
    return eqFail(ids.filter((x) => x.id === "DefaultParticleType").length, 0, "注释行取名数");
  });
  // 14 负例行不进面
  arm("T14 负例行（同行「禁止」）不进取名面", () => {
    const { ids } = fenceIds("```java\nnew DefaultParticleType(); // 禁止这么写\n```");
    return eqFail(ids.filter((x) => x.id === "DefaultParticleType").length, 0, "负例取名数");
  });
  // 15 SCREAMING 剔除
  arm("T15 SCREAMING_SNAKE 示例常量被剔（PARTICLE_THING）", () => {
    return eqFail(partsOf("Registry<PARTICLE_THING> MY_ITEM").includes("PARTICLE_THING"), false, "SCREAMING");
  });
  // 16 泛型位置
  arm("T16 occContexts：List<Foo> 里的 Foo 记 generic 不记 rightseg", () => {
    const fl = occContexts("    List<FooThing> a = x;", "FooThing");
    return (fl.has("generic") ? null : "没记 generic") || (fl.has("rightseg") ? "误记 rightseg" : null);
  });
  // 17 方法引用
  arm("T17 occContexts：FooThing::bar 记 methodref", () => {
    const fl = occContexts("map(FooThing::bar)", "FooThing");
    return fl.has("methodref") ? null : "没记 methodref：" + [...fl].join(",");
  });
  // 18 数组
  arm("T18 occContexts：FooThing[] 记 array", () => {
    const fl = occContexts("FooThing[] arr = y;", "FooThing");
    return fl.has("array") ? null : "没记 array：" + [...fl].join(",");
  });
  // 19 Owner.Inner：右段与左段各有形状
  arm("T19 occContexts：FabricTagProvider.ItemTagProvider 的右段记 rightseg", () => {
    const fl = occContexts("→ FabricTagProvider.ItemTagProvider", "ItemTagProvider");
    return (fl.has("rightseg") ? null : "没记 rightseg") || (fl.has("ARROWLINE") ? null : "没记 ARROWLINE");
  });
  // 20 豁免格式
  arm("T20 loadExemptions：列数不足与 basis 不合形态都要报 bad", () => {
    const r = loadExemptions("a\t1\tB\tC\tcorpus:x.md:3\t2026-09-27\nbad\tonly\na\t2\tB\tC\thuh?\tR\n");
    return (r.rows.length === 1 ? null : `合法行应 1 实得 ${r.rows.length}`) || (r.bad.length === 2 ? null : `bad 应 2 实得 ${r.bad.length}`);
  });
  // 21 地板是下界
  arm("T21 compareFloors：实扫高于地板 ⇒ 仍无 trip（证 < 非等式）", () => {
    const b = { floors: { judgedNamesMin: 10 }, ceilings: { renameStaleRedMax: 5 }, basis: {} };
    return eqFail(compareFloors({ judgedNames: 11, renameStaleRed: 0 }, b, 1).length, 0, "trip 数");
  });
  // 22 FLOOR-LOW
  arm("T22 compareFloors：跌破下界 ⇒ FLOOR-LOW", () => {
    const b = { floors: { judgedNamesMin: 10 }, basis: {} };
    const t = compareFloors({ judgedNames: 3 }, b, 1);
    return (t.length === 1 && t[0].kind === "LOW") ? null : JSON.stringify(t);
  });
  // 23 FLOOR-COLLECTOR（0 而登记非空）
  arm("T23 compareFloors：实扫 0 而面非空 ⇒ FLOOR-COLLECTOR（采集器死了不是干净）", () => {
    const b = { floors: { judgedNamesMin: 10 }, basis: {} };
    const t = compareFloors({ judgedNames: 0 }, b, 1);
    return (t.length === 1 && t[0].kind === "COLLECTOR") ? null : JSON.stringify(t);
  });
  // 24 CEILING
  arm("T24 compareFloors：红条数超上界 ⇒ CEILING（只许降）", () => {
    const b = { ceilings: { renameStaleRedMax: 1 }, basis: {} };
    const t = compareFloors({ renameStaleRed: 2 }, b, 1);
    return (t.length === 1 && t[0].kind === "CEILING") ? null : JSON.stringify(t);
  });
  // 25 基线与门失步
  arm("T25 compareFloors：基线要一个门没测的数 ⇒ COLLECTOR（不许静默）", () => {
    const b = { floors: { nonsenseMetricMin: 3 }, basis: {} };
    const t = compareFloors({ judgedNames: 5 }, b, 1);
    return (t.length === 1 && t[0].kind === "COLLECTOR") ? null : JSON.stringify(t);
  });

  // —— 端到端（tmp 树 + 真 sqlite）——
  const writePack = (ver, rows, opts = {}) => {
    const dir = path.join(tmp, "data", packOf(ver), "mappings");
    fs.mkdirSync(dir, { recursive: true });
    const f = path.join(dir, "yarn-mappings.sqlite");
    if (opts.raw) { fs.writeFileSync(f, opts.raw); return f; }
    const db = new DatabaseSync(f);
    db.prepare("create table if not exists meta(key text primary key, value text)").run();
    db.prepare("create table if not exists classes(named text, intermediary text, official text)").run();
    db.prepare("create table if not exists methods(name_named text, name_intermediary text, name_official text, owner_official text, descriptor text)").run();
    db.prepare("create table if not exists fields(name_named text, name_intermediary text, name_official text, owner_official text, descriptor text)").run();
    db.prepare("insert into meta values('mappingEra', ?)").run(opts.era ?? "yarn-tiny");
    for (const [n, i] of rows) db.prepare("insert into classes values(?,?,?)").run(n, i, i ?? n);
    db.prepare("insert into methods values('probeMethod','method_1','method_1','net/minecraft/class_2400','()V')").run();
    db.prepare("insert into fields values('probeField','field_1','field_1','net/minecraft/class_2400','I')").run();
    // 成员名入口：真树 6 条冲突哨兵**全部**是「成员名撞别的档的历史类名」（ItemTagProvider），而类名级同档
    // 不可满足（collector:422 ②）⇒ 没有这条入口就无法在 analyze 层面造出冲突，T55 只能退化成单测 siteCmp。
    for (const [i, m] of (opts.members ?? []).entries()) {
      db.prepare("insert into fields values(?,?,?,?,?)").run(m, `field_9${i}`, `field_9${i}`, "net/minecraft/class_9999", "I");
    }
    db.close();
    return f;
  };
  const writeRules = (ver, content) => {
    const dir = path.join(tmp, "fabric", ver, ".cursor", "rules");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "10-gui.mdc"), content, "utf8");
  };
  const staleMdc = "```java\npublic static final ParticleType<?> P = new DefaultParticleType(true);\n```\n";

  const cleanTree = () => { for (const d of fs.readdirSync(tmp)) fs.rmSync(path.join(tmp, d), { recursive: true, force: true }); };
  const base = { floors: {}, ceilings: { renameStaleRedMax: 99, classOrFapiMax: 99, exemptionsMax: 99, ambiguousRosterMax: 99, multiAnchorRedMax: 99 }, basis: {} };

  // 26 端到端：能红
  arm("T26 端到端红：合成两档 + 旧名写进新档 ⇒ renameStaleRed=1", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```java\nclass Ok {}\n```");
    writeRules(P2, staleMdc);
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.reds.length === 1 && r.reds[0].id === "DefaultParticleType") ? null : `红 ${r.reds.length} 条：${JSON.stringify(r.reds.map((x) => x.id))}`;
  });
  // 27 端到端正控：新名不红
  arm("T27 端到端绿（正控）：同一位置改成本档正解名 ⇒ 红=0", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, "```java\nObject P = new SimpleParticleType(true);\n```");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return eqFail(r.reds.length, 0, "红数");
  });
  // 28 豁免放行
  arm("T28 豁免点名命中 ⇒ 红=0 且 WAIVED=1", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, staleMdc);
    const line = staleMdc.split("\n")[1];
    void line;
    const ex = `fabric/${P2}/.cursor/rules/10-gui.mdc\t2\tDefaultParticleType\tSimpleParticleType\tcorpus:data/x.java:1\tR1`;
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: ex });
    return (r.reds.length === 0 && r.waived.length === 1) ? null : `红=${r.reds.length} 豁免=${r.waived.length} bad=${JSON.stringify(r.exemptBad)}`;
  });
  // 29 豁免依据断
  arm("T29 豁免行指向一个不含该名的行 ⇒ EXEMPTION-STALE 且红不消", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, staleMdc);
    const ex = `fabric/${P2}/.cursor/rules/10-gui.mdc\t1\tDefaultParticleType\tSimpleParticleType\tcorpus:data/x.java:1\tR1`;
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: ex });
    return (r.exemptBad.some((x) => x.includes("EXEMPTION-STALE")) && r.reds.length === 1) ? null : `bad=${JSON.stringify(r.exemptBad)} 红=${r.reds.length}`;
  });
  // 30 豁免提名是编的
  arm("T30 豁免提的名本档映射查无 ⇒ EXEMPTION-FABRICATED（不许编正解）", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, staleMdc);
    const ex = `fabric/${P2}/.cursor/rules/10-gui.mdc\t2\tDefaultParticleType\tNonexistentProbe91234\tcorpus:data/x.java:1\tR1`;
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: ex });
    return r.exemptBad.some((x) => x.includes("EXEMPTION-FABRICATED")) ? null : `bad=${JSON.stringify(r.exemptBad)}`;
  });
  // 31 库损坏
  arm("T31 合成库是垃圾字节 ⇒ io 红（读失败不得塌成查无）", () => {
    cleanTree();
    writePack(P1, [], { raw: "this is not a sqlite file".repeat(40) });
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```java\nObject o = new WhateverThing();\n```");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.io.length === 1 && r.io[0].pack === packOf(P1)) ? null : `io=${JSON.stringify(r.io.map((x) => x.pack))}`;
  });
  // 32 清空库
  arm("T32 库存在但 classes 0 行 ⇒ zero-rows，等价类腿熄火且不进红侧", () => {
    cleanTree();
    writePack(P1, []);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```java\nObject o = new SimpleParticleType();\n```");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.legModes["zero-rows"] === 1 && r.io.length === 0) ? null : `腿态=${JSON.stringify(r.legModes)} io=${r.io.length}`;
  });
  // 33 era 非 yarn
  arm("T33 meta.mappingEra=forge-srg ⇒ 该档等价类腿不适用（正控：不因此红）", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/Whatever", "net/minecraft/class_9999"]], { era: "forge-srg" });
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```java\nObject o = new Whatever();\n```");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.legModes["era"] === 1 && r.reds.length === 0 && r.io.length === 0) ? null : `腿态=${JSON.stringify(r.legModes)} 红=${r.reds.length}`;
  });
  // 34 无库档
  arm("T34 无 yarn 库的档（26.1.2 形）⇒ absent 腿，语料腿仍跑，不红", () => {
    cleanTree();
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, "```java\nObject o = new SimpleParticleType();\n```");
    writeRules("9.9.9", "```java\nObject o = new SimpleParticleType();\n```");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.legModes["absent"] >= 1 && r.reds.length === 0) ? null : `腿态=${JSON.stringify(r.legModes)} 红=${r.reds.length}`;
  });
  // 34b 非版本目录不得当档（真实仓库里 data/ 下有 fabric_porting 这种前缀相同、不是档的目录）
  arm("T39 data/fabric_porting 这类非版本目录不得算一档（否则分母虚高 + 假 absent 腿）", () => {
    cleanTree();
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    fs.mkdirSync(path.join(tmp, "data", "fabric_porting"), { recursive: true });
    fs.mkdirSync(path.join(tmp, "fabric", "templates"), { recursive: true });
    writeRules(P2, "```java\nObject o = new SimpleParticleType();\n```");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.measured.packs === 1 && !r.legOf.has("porting") && !r.legOf.has("templates"))
      ? null : `档数=${r.measured.packs} 腿=${[...r.legOf.keys()].join(",")}`;
  });
  // 34c 队列不得落进仓库面（本门按「只读仓库」设计；产物只准去缓存根/系统 tmp）
  arm("T40 --queue 指向仓库内路径 ⇒ 拒绝并 rc=1（写盘前就挡，不留半截文件）", () => {
    const sp = spawnSync(process.execPath, [path.join(HERE, "assert-rules-api-names.mjs"), "--pack=fabric_1.14.4", `--queue=${path.join(REPO_ROOT, "temp", "should-not-exist.tsv")}`], {
      encoding: "utf8", windowsHide: true,
    });
    const leaked = fs.existsSync(path.join(REPO_ROOT, "temp", "should-not-exist.tsv"));
    return (sp.status === 1 && /QUEUE-IN-REPO/.test(sp.stderr) && !leaked)
      ? null : `rc=${sp.status} 拒词=${/QUEUE-IN-REPO/.test(sp.stderr)} 泄漏=${leaked}`;
  });
  // 34d 单档模式：整面地板必然跌破 ⇒ 必须报「不执法」而不是拿 FLOOR-LOW 冒充缺陷
  arm("T42 --pack 单档 ⇒ 无 FLOOR trip 且 unenforced=1（skip 不得装作绿，也不得假红）", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```java\nObject o = new DefaultParticleType();\n```");
    writeRules(P2, staleMdc);
    const strict = { floors: { judgedNamesMin: 999999 }, basis: {} };
    const one = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: strict, exemptionsText: "", onlyPack: packOf(P2) });
    const all = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: strict, exemptionsText: "" });
    return (one.trips.length === 0 && one.unenforced === 1 && one.reds.length === 1 && all.trips.length > 0 && all.unenforced === 0)
      ? null : `单档 trips=${one.trips.length} unenf=${one.unenforced} 红=${one.reds.length}｜整面 trips=${all.trips.length} unenf=${all.unenforced}`;
  });
  // 43 奇偶不闭合的围栏 = 采集面塌缩（不是格式洁癖）：既要红、点名，也要**数出真的少判了名字**
  arm("T43 围栏数量为奇数 ⇒ [FENCE-ODD] 红并点名，且后半篇的名字真的没进判名面", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    // 第二个 ```java 其实是「闭合」上一块 ⇒ b 那行落在块外，SimpleParticleType 从此不被判名
    writeRules(P2, "```java\nObject a = new DefaultParticleType();\n```java\nObject b = new SimpleParticleType(true);\n```\n");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    const named = r.trips.some((t) => t.msg.includes("[FENCE-ODD]") && t.msg.includes(`fabric/${P2}/.cursor/rules/10-gui.mdc`));
    return (r.fenceOddFiles === 1 && named && r.measured.judgedNames === 2)
      ? null : `fenceOdd=${r.fenceOddFiles} 点名=${named} 判名=${r.measured.judgedNames} trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
  });
  // 44 正控：把漏掉的那道闭合补上 ⇒ 不报 FENCE，且少判的那个名字回到判名面（证明 43 的红来自塌缩本身）
  arm("T44 补上漏掉的闭合 ⇒ 无 FENCE trip 且判名从 2 涨回 3（正控）", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, "```java\nObject a = new DefaultParticleType();\n```\n```java\nObject b = new SimpleParticleType(true);\n```\n");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    return (r.fenceOddFiles === 0 && r.trips.length === 0 && r.measured.judgedNames === 3)
      ? null : `fenceOdd=${r.fenceOddFiles} trips=${JSON.stringify(r.trips.map((t) => t.msg))} 判名=${r.measured.judgedNames}`;
  });
  // 45 基线**删键** = 静默撤棘轮（compareFloors 按基线现有键循环 ⇒ 删键比写 0 更安静）
  arm("T45 requireKeys ⇒ 空基线的每个必需键都报 [BASELINE-KEY-LOSS]", () => {
    const t = compareFloors({ judgedNames: 10 }, { floors: {}, ceilings: {} }, 1, true);
    const loss = t.filter((x) => x.kind === "BASELINE");
    const want = REQUIRED_FLOOR_KEYS.length + REQUIRED_CEILING_KEYS.length;
    return loss.length === want && loss.every((x) => x.msg.includes("[BASELINE-KEY-LOSS]"))
      ? null : `BASELINE trip=${loss.length}（须 ${want}）`;
  });
  // 46 正控：键齐 ⇒ 不因该腿红；不传 requireKeys（单元夹具默认）⇒ 这条腿根本不介入
  arm("T46 requireKeys 键齐 ⇒ 零 BASELINE trip；默认不传则不检查（44 组旧夹具不受影响）", () => {
    const full = {
      floors: Object.fromEntries(REQUIRED_FLOOR_KEYS.map((k) => [k, 0])),
      ceilings: Object.fromEntries(REQUIRED_CEILING_KEYS.map((k) => [k, 99])),
    };
    const measured = {
      packs: 14, packsWithLib: 13, classRows: 9, rulesFiles: 9, judgedNames: 9, bucket1: 9,
      equivClasses: 9, equivNames: 9, rosterNames: 9, corpusPacks: 9,
      renameStaleRed: 0, classOrFapi: 0, exemptions: 0, ambiguousRoster: 0, multiAnchorRed: 0, fenceOddFiles: 0,
    };
    const strict = compareFloors(measured, full, 1, true);
    const loose = compareFloors({ judgedNames: 1 }, { floors: {}, ceilings: {} }, 1);
    return (strict.length === 0 && loose.length === 0)
      ? null : `strict=${JSON.stringify(strict.map((x) => x.msg))} loose=${loose.length}`;
  });
  // 47 / 48 FAPI 否决面**第二来源**（逐档摘要件）。链上臂 G 用的是仓库真摘要件 ⇒ 它测的是「接线」，
  // 这两例用纯合成件 ⇒ 测的是「机制」：将来谁把 mcp-server/data/loader-api-summaries 改名或清掉，
  // 判据本身仍被钉住，不会只剩一侧证据。
  const sumDirOf = (fqcns) => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-fapi-"));
    fs.writeFileSync(path.join(d, `${P1}-fabric-api.json`), JSON.stringify({ classes: fqcns.map((f) => ({ fqcn: f })) }), "utf8");
    return d;
  };
  const stalePayload = () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    // P1 映射查无 SimpleParticleType ∧ 锚 class_2400 在 P1 该叫 DefaultParticleType ∧ 强类型位 ⇒ 形状上就是一条 RENAME-STALE
    writeRules(P1, "```java\nObject x = new SimpleParticleType(true);\n```\n");
  };
  arm("T47 摘要件点名该 FAPI 名 ⇒ 不判红，且否决串必须来自第二来源（不是语料名单那条）", () => {
    stalePayload();
    const r = analyze({
      root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "",
      fapiSummariesDir: sumDirOf(["net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider$SimpleParticleType"]),
    });
    const row = r.queue.find((q) => q.id === "SimpleParticleType");
    return (r.reds.length === 0 && !!row && /FAPI 摘要件名/.test(row.why) && !/FAPI 碰撞名/.test(row.why))
      ? null : `红=${r.reds.length} 队列判词=${row?.why ?? "(无行)"} trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
  });
  arm("T48 正控：同一载荷把摘要件来源指空 ⇒ 必红且按本档正解点名（证明 47 的绿来自那个来源）", () => {
    stalePayload();
    const r = analyze({
      root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "",
      fapiSummariesDir: fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-fapi-empty-")),
    });
    const red = r.reds.find((x) => x.id === "SimpleParticleType");
    return (r.reds.length === 1 && !!red && red.ver === P1 && red.candidates.some((c) => c.ver === P1 && c.named === "DefaultParticleType"))
      ? null : `红=${r.reds.length} 正解=${JSON.stringify(red?.candidates ?? null)} trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
  });
  // 52–54 第三来源（加载器摘要件 `<档>-fabric.json`，2026-09-28 入库 14 档）的三腿。
  // 与 47/48 同形但**来源不同**：这里 fabric-api 那一路一律指空 ⇒ 绿只能来自 loader 那一路。
  const loaderSumDirOf = (fqcns) => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-loader-"));
    fs.writeFileSync(path.join(d, `${P1}-fabric.json`), JSON.stringify({ classes: fqcns.map((f) => ({ fqcn: f })) }), "utf8");
    return d;
  };
  const EMPTY_FAPI = () => fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-fapi-empty-"));
  arm("T57 loader 摘要件点名该名 ⇒ 不判红，且否决串必须来自 loader 那一路（fabric-api 那一路此时是空的）", () => {
    stalePayload();
    const r = analyze({
      root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "",
      fapiSummariesDir: EMPTY_FAPI(),
      loaderSummariesDir: loaderSumDirOf(["net.fabricmc.api.ClientModInitializer$SimpleParticleType"]),
    });
    const row = r.queue.find((q) => q.id === "SimpleParticleType");
    return (r.reds.length === 0 && !!row && /loader 摘要件名/.test(row.why) && !/FAPI 摘要件名|FAPI 碰撞名/.test(row.why))
      ? null : `红=${r.reds.length} 队列判词=${row?.why ?? "(无行)"} trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
  });
  arm("T58 正控：只把 loader 摘要件指空 ⇒ 必红并按本档正解点名（证明 T57 的绿来自那一路，不是装饰）", () => {
    stalePayload();
    const r = analyze({
      root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "",
      fapiSummariesDir: EMPTY_FAPI(),
      loaderSummariesDir: fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-loader-empty-")),
    });
    const red = r.reds.find((x) => x.id === "SimpleParticleType");
    return (r.reds.length === 1 && !!red && red.ver === P1 && red.candidates.some((c) => c.ver === P1 && c.named === "DefaultParticleType"))
      ? null : `红=${r.reds.length} 正解=${JSON.stringify(red?.candidates ?? null)} trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
  });
  arm("T59 loader 摘要件在盘但读不动 ⇒ [LOADER-SUMMARY-UNREADABLE] 点名该档，且不得牵连 fabric-api 那一路", () => {
    stalePayload();
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-loader-corrupt-"));
    fs.writeFileSync(path.join(d, `${P1}-fabric.json`), "{ 这不是 JSON", "utf8");
    const r = analyze({
      root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "",
      fapiSummariesDir: EMPTY_FAPI(), loaderSummariesDir: d,
    });
    const msgs = r.trips.map((t) => t.msg);
    return (msgs.some((m) => /\[LOADER-SUMMARY-UNREADABLE\]/.test(m) && m.includes(P1)) && !msgs.some((m) => /\[FAPI-SUMMARY-UNREADABLE\]/.test(m)))
      ? null : `trips=${JSON.stringify(msgs)}`;
  });

  // 49–51 本轮「按规范逐条审计」补出来的三腿（规范 = 规划稿 §13 第 1/3 类 + §15 第 8 步；三条都是先缺后补）
  arm("T49 同档一个 intermediary 对两个 named ⇒ buildEquivalence 不静默覆盖，ambiguous 点名（§13 第 1 类 = 摄入错）", () => {
    const eq = buildEquivalence([fakeLeg(packOf(P1), [["net/minecraft/particle/Alpha", "net/minecraft/class_5000"], ["net/minecraft/particle/Beta", "net/minecraft/class_5000"]])], verOf);
    return (eq.ambiguous.length === 1 && eq.ambiguous[0].includes(P1) && eq.ambiguous[0].includes("class_5000") && eq.E.get("net/minecraft/class_5000").size === 1)
      ? null : `ambiguous=${JSON.stringify(eq.ambiguous)} 每档一名数=${eq.E.get("net/minecraft/class_5000")?.size}`;
  });
  arm("T50 c1∧c3 ⇒ 只计冲突哨兵：red=false、桶号仍是 1、verdict 可数（判红形已被真树否证，见 collector 注释）", () => {
    const legs = legs3();
    const eq = buildEquivalence(legs, verOf);
    // P2 的类名 SimpleParticleType（c1 成立）；而锚集里 class_6044 在 P2 叫 BlockParticle ⇒ 同时 c3 的锚也命中
    const r = classify(
      { ver: P2, id: "SimpleParticleType", flags: new Set(["new"]), at: 1 },
      { leg: legs[1], eq, roster: { names: new Map(), ambiguous: [] }, tokens: new Set() },
    );
    return (r.verdict === "BUCKET-CONFLICT" && r.red === false && r.bucket === 1 && r.candidates.length >= 2)
      ? null : `verdict=${r.verdict} red=${r.red} bucket=${r.bucket} 链长=${r.candidates.length} why=${r.why}`;
  });
  arm("T51 26.x 无库 = no-lib-by-design，不得与 absent 合并（§13 第 3 类），且不带 ioError", () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "rules-names-"));
    const byDesign = mappingLeg(packOf("26.1.2"), path.join(d, "fabric_26.1.2"));
    const realAbsent = mappingLeg(packOf("1.99.9"), path.join(d, "fabric_1.99.9"));
    fs.rmSync(d, { recursive: true, force: true });
    return (byDesign.state === "no-lib-by-design" && realAbsent.state === "absent" && byDesign.usable === false && realAbsent.usable === false)
      ? null : `26.1.2=${byDesign.state} 其他档=${realAbsent.state}`;
  });
  // 35 采集器失效地板
  arm("T35 规则目录被搬走 ⇒ judgedNames=0 且登记面非空 ⇒ FLOOR-COLLECTOR 红", () => {
    cleanTree();
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P2, "# 只有散文，零围栏\n没有代码块。\n");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: { floors: { judgedNamesMin: 5 }, basis: {} }, exemptionsText: "" });
    return r.trips.some((t) => t.kind === "COLLECTOR") ? null : `trips=${JSON.stringify(r.trips)}`;
  });
  // 36 队列确定性
  arm("T36 同输入跑两次 ⇒ 队列逐字节相同（迭代序/时间戳不得进产物）", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```java\n→ DefaultParticleType / BlockTagProvider\n```");
    writeRules(P2, "```java\n→ SimpleParticleType.get()\n```");
    const a = renderQueue(analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" }).queue);
    const b = renderQueue(analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" }).queue);
    return eqFail(a === b, true, "两次队列一致");
  });
  // 52 队列稳定排序（§21）。⚠ T36 抓不到这一条：它两次 analyze() 都在**同一进程**里，readdir 顺序必然一致，
  // 所以「renderQueue 不排序」这个缺陷在 T36 上照样绿 —— 本臂把同一组行按两种顺序直接喂 renderQueue。
  arm("T52 renderQueue 稳定排序：乱序喂入逐字节相同 + 版本数值序（1.21.8 先于 1.21.10）+ 同文件按行号", () => {
    const mk = (pack, rel, line, id) => ({ bucket: "UNKNOWN-ALL-PACKS", pack, relPath: rel, line, id, legState: "ok", occFlags: "bare", why: "w" });
    const rows = [
      mk("fabric_1.21.10", "fabric/1.21.10/.cursor/rules/03-item.mdc", 88, "Zeta"),
      mk("fabric_1.21.8", "fabric/1.21.8/.cursor/rules/07-datagen.mdc", 43, "ItemTagProvider"),
      mk("fabric_1.21.8", "fabric/1.21.8/.cursor/rules/07-datagen.mdc", 9, "Alpha"),
      mk("fabric_1.21.8", "fabric/1.21.8/.cursor/rules/02-block.mdc", 12, "Beta"),
    ];
    const a = renderQueue(rows);
    const b = renderQueue([...rows].reverse());
    if (a !== b) return `乱序喂入输出不同（正 ${a.length}B / 反 ${b.length}B）⇒ 队列行序仍随 readdir 变`;
    const got = a.split("\n").slice(1).filter(Boolean).map((l) => { const c = l.split("\t"); return `${c[1]}|${c[2]}|${c[3]}`; });
    const want = [
      "fabric_1.21.8|fabric/1.21.8/.cursor/rules/02-block.mdc|12",
      "fabric_1.21.8|fabric/1.21.8/.cursor/rules/07-datagen.mdc|9",
      "fabric_1.21.8|fabric/1.21.8/.cursor/rules/07-datagen.mdc|43",
      "fabric_1.21.10|fabric/1.21.10/.cursor/rules/03-item.mdc|88",
    ];
    if (got.join(" > ") !== want.join(" > ")) return `行序=${got.join(" > ")}｜应为 ${want.join(" > ")}（pack 数值序 → relPath → line）`;
    return null;
  });
  // 53 红行/冲突哨兵的排序键（打印只截前 N 条 ⇒ 不排的话「展示的是哪几条」随目录枚举序变，与 T52 同一形状的另一面）
  arm("T53 siteCmp：ver 数值序 → relPath → at → id，正序与反序喂入排完必须一致", () => {
    const mk = (ver, rel, at, id) => ({ ver, relPath: rel, at, id });
    const rows = [
      mk("1.21.10", "fabric/1.21.10/.cursor/rules/01-registry.mdc", 9, "Alpha"),
      mk("1.21.8", "fabric/1.21.8/.cursor/rules/09-anti-patterns.mdc", 100, "Zeta"),
      mk("1.21.8", "fabric/1.21.8/.cursor/rules/09-anti-patterns.mdc", 9, "Beta"),
      mk("26.1.2", "fabric/26.1.2/.cursor/rules/10-gui.mdc", 1, "Eta"),
    ];
    const want = ["1.21.8|9|Beta", "1.21.8|100|Zeta", "1.21.10|9|Alpha", "26.1.2|1|Eta"];
    for (const [tag, arr] of [["正序", rows], ["反序", [...rows].reverse()]]) {
      const got = [...arr].sort(siteCmp).map((x) => `${x.ver}|${x.at}|${x.id}`);
      if (got.join(" > ") !== want.join(" > ")) return `${tag}喂入排完=${got.join(" > ")}｜应为 ${want.join(" > ")}`;
    }
    return null;
  });
  // 54 钉「接线」本身：T53 只调 siteCmp，把 analyze 返回处那两个 .sort(siteCmp) 摘掉它照样绿（这是 L108 ⚠ 自己承认的边界）。
  //     本臂造一份**天然扫描序 ≠ 键序**的红载荷：两个旧名同一行，出现顺序 Zeta→Simple，而键序按 id 是 Simple→Zeta。
  arm("T54 接线：analyze().reds 必须已按 siteCmp 排好（载荷按扫描序会是 Zeta,Simple ⇒ 摘掉 .sort 本臂必红）", () => {
    cleanTree();
    writePack(P1, [
      ["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"],
      ["net/minecraft/particle/AlphaType", "net/minecraft/class_2500"],
    ]);
    writePack(P2, [
      ["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"],
      ["net/minecraft/particle/ZetaType", "net/minecraft/class_2500"],
    ]);
    // P1 两个名都查无、各自锚在 P1 另有其名、同一行、都在 new 位 ⇒ 两条 RENAME-STALE
    writeRules(P1, "```java\nObject o = new ZetaType(true) && new SimpleParticleType(true);\n```\n");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    const ids = r.reds.map((x) => x.id);
    if (ids.length !== 2) return `红应为 2 条，实得 ${ids.length}：${JSON.stringify(ids)}｜trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
    const want = [...r.reds].sort(siteCmp).map((x) => x.id);
    if (ids.join(",") !== want.join(",")) return `reds 未按键排：返回 ${ids.join(",")}｜键序 ${want.join(",")}`;
    if (ids[0] !== "SimpleParticleType") return `载荷的扫描序没造反（返回首行=${ids[0]}，期望键序 SimpleParticleType 先）⇒ 本臂无法区分排与没排：${ids.join(",")}`;
    return null;
  });
  // 55 第二枚「接线」：analyze() 返回处有**两枚** .sort(siteCmp)（reds 与 conflicts），T54 只钉住了前一枚。
  //     conflicts 不是理论面：真树现 6 条 > 打印窗 slice(0,4) ⇒ 「展示的是哪 4 条」正是 L108 那个缺陷的形状。
  arm("T55 接线：analyze().conflicts 必须已按 siteCmp 排好（摘掉 conflicts 那枚 .sort 本臂必红，而 T53/T54 都照绿）", () => {
    cleanTree();
    // P1 里 ZetaType / SimpleParticleType 是类名；P2 把这两个 inter 改叫别的名字，同时在 P2 各放一个**同名成员**
    // ⇒ 每个名 c1（本档成员名证出）∧ c3（锚说本档另有其名）成立 ⇒ 冲突哨兵 2 条（与真树 ItemTagProvider 同形）。
    writePack(P1, [
      ["net/minecraft/particle/ZetaType", "net/minecraft/class_2500"],
      ["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"],
    ]);
    writePack(P2, [
      ["net/minecraft/particle/ZetaRenamedType", "net/minecraft/class_2500"],
      ["net/minecraft/particle/SimpleRenamedType", "net/minecraft/class_2400"],
    ], { members: ["ZetaType", "SimpleParticleType"] });
    // 扫描序 = ZetaType 先；键序（同 ver/同文件/同 at ⇒ 按 id）= SimpleParticleType 先
    writeRules(P2, "```java\nObject a = ZetaType.ONE && SimpleParticleType.TWO;\n```\n");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    const cids = r.conflicts.map((x) => x.id);
    if (cids.length !== 2) return `冲突哨兵应为 2 条，实得 ${cids.length}：${JSON.stringify(cids)}｜reds=${JSON.stringify(r.reds.map((x) => x.id))}｜trips=${JSON.stringify(r.trips.map((t) => t.msg))}`;
    const cwant = [...r.conflicts].sort(siteCmp).map((x) => x.id);
    if (cids.join(",") !== cwant.join(",")) return `conflicts 未按键排：返回 ${cids.join(",")}｜键序 ${cwant.join(",")}`;
    if (cids[0] !== "SimpleParticleType") return `载荷的扫描序没造反（返回首行=${cids[0]}，期望键序 SimpleParticleType 先）⇒ 本臂无法区分排与没排：${cids.join(",")}`;
    return null;
  });
  // 56 钉「打印面可打开」：哨兵是**只印前 4 条**的截断展示（L108 修的正是这一族），而它旧形
  //     `${c.ver}:${c.id}@${c.line}` 里的 `line` 是**行文本**、行号在 `at` ⇒ 真树 6 条印出来一个定位符都没有
  //     （实测旧输出：`1.19.4:ItemTagProvider@  → FabricTagProvider.ItemTagProvider / BlockTagProvider`）。
  //     走主入口 spawn 而不是调 analyze()：钉的就是这一行 console.log，与 T38 同一配方（单档跑避开合成树的 FLOOR-COLLECTOR）。
  arm("T56 主入口打印：冲突哨兵逐条文必须带 relPath:行号 定位符（退回旧形 @行文本 ⇒ 本臂红）", () => {
    cleanTree();
    const sub = path.join(tmp, "print-probe");
    fs.mkdirSync(sub, { recursive: true });
    writePack(P1, [
      ["net/minecraft/particle/ZetaType", "net/minecraft/class_2500"],
      ["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"],
    ]);
    writePack(P2, [
      ["net/minecraft/particle/ZetaRenamedType", "net/minecraft/class_2500"],
      ["net/minecraft/particle/SimpleRenamedType", "net/minecraft/class_2400"],
    ], { members: ["ZetaType", "SimpleParticleType"] });
    writeRules(P2, "```java\nObject a = ZetaType.ONE && SimpleParticleType.TWO;\n```\n");
    const exFile = path.join(sub, "ex.txt");
    fs.writeFileSync(exFile, "", "utf8");
    const blFile = path.join(sub, "bl.json");
    fs.writeFileSync(blFile, JSON.stringify({
      asOf: "fixture",
      floors: Object.fromEntries(REQUIRED_FLOOR_KEYS.map((k) => [k, 0])),
      ceilings: Object.fromEntries(REQUIRED_CEILING_KEYS.map((k) => [k, 99])),
      basis: {},
    }), "utf8");
    const cRun = spawnSync(process.execPath, [path.join(HERE, "assert-rules-api-names.mjs"), `--pack=${packOf(P2)}`], {
      encoding: "utf8", windowsHide: true,
      env: { ...process.env, MC_SKILL_RULES_ROOT: tmp, MC_SKILL_RULES_DATA: path.join(tmp, "data"), MC_SKILL_RULES_BASELINE: blFile, MC_SKILL_RULES_EXEMPTIONS: exFile },
    });
    const line = String(cRun.stdout).split(/\r?\n/).find((l) => l.includes("冲突哨兵"));
    if (!line) return `stdout 无冲突哨兵行（rc=${cRun.status}）：\n${cRun.stdout}\n${cRun.stderr}`;
    const located = (line.match(/\.mdc:\d+ /g) || []).length;
    if (located !== 2) return `逐条文里带定位符的条目=${located}（应 2）｜该行=${line}`;
    if (/@\s/.test(line)) return `仍是旧形「@ + 行文本」⇒ 定位符没落到打印上｜该行=${line}`;
    return null;
  });
  // 60 桶5 三分类的判据本身（合成输入、不经盘）：四类各归其对 + 「ide 先于 gradle」这条判序 + 不吞行
  arm("T60 桶5 分类器：Gradle 任务名／IDE 名（实测与 gradlew 同一行）／散文词／未证类名各归其对，判序必须 ide 在前", () => {
    const cases = [
      ["processResources", "./gradlew processResources", "gradle"],
      ["genSources", "./gradlew genSources", "gradle"],
      ["mavenCentral", "repositories { mavenCentral() }", "gradle"],
      ["IntelliJ", "./gradlew idea   # IntelliJ IDEA", "ide"], // 同一行也命中 gradlew ⇒ 归 ide 才算判序对
      ["Eclipse", "./gradlew eclipse # Eclipse", "ide"],
      ["Could", 'IF 报错包含 "Could not resolve net.fabricmc"', "prose"],
      ["Vendor", '"Implementation-Vendor": project.maven_group', "prose"],
      ["ModBlocks", "new BlockItem(ModBlocks.MY_BLOCK, new Item.Settings())", "other"],
    ];
    const wrong = cases.filter(([id, line, want]) => classifyBucket5(id, line) !== want)
      .map(([id, , want]) => `${id}→${classifyBucket5(id, cases.find((c) => c[0] === id)[1])}(应 ${want})`);
    if (wrong.length) return `分类不符：${wrong.join(" ｜ ")}`;
    const keys = {};
    for (const [id, line] of cases) { const k = classifyBucket5(id, line); keys[k] = (keys[k] ?? 0) + 1; }
    const sum = Object.values(keys).reduce((a, x) => a + x, 0);
    const legal = Object.keys(keys).every((k) => ["ide", "gradle", "prose", "other"].includes(k));
    return sum === cases.length && legal ? null : `闭合不符：${JSON.stringify(keys)} 例数=${cases.length}`;
  });
  // 61 接线：b5 必须由扫描循环喂（摘掉 `if (r.bucket === 5) b5[...]++` 那行 ⇒ 本臂红），并核合计 = 桶5
  arm("T61 接线：analyze().b5 真被扫描循环喂到（gradle 与 ide 两族各 ≥1，且四族合计 = 桶5 位点数）", () => {
    cleanTree();
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    // 这几行里的名字在合成映射与语料里都查无 ⇒ 全落桶5；分类必须跟着动（Object/IDEA 这类是被切词器收进来的散文与产品名）
    writeRules(P1, "```java\nObject o = new DefaultParticleType();\n```\n```gradle\ntasks.register(\"genSources\") { }\n./gradlew processResources   # IntelliJ IDEA 里也能跑\n```\n");
    const r = analyze({ root: tmp, dataRoot: path.join(tmp, "data"), baseline: base, exemptionsText: "" });
    const sum = r.b5.ide + r.b5.gradle + r.b5.prose + r.b5.other;
    if (r.bucketCount[5] < 3) return `夹具没造出桶5 人群（桶5=${r.bucketCount[5]}）⇒ 本臂没有对象，不能算证`;
    if (sum !== r.bucketCount[5]) return `四族合计 ${sum} ≠ 桶5 ${r.bucketCount[5]} ⇒ 分类器吞行或漏行（JSON ${JSON.stringify(r.b5)}）`;
    if (r.b5.gradle < 1) return `gradle 族 = 0（JSON ${JSON.stringify(r.b5)}）⇒ 计数没接线，或 genSources/processResources 没进桶5`;
    if (r.b5.ide < 1) return `ide 族 = 0（JSON ${JSON.stringify(r.b5)}）⇒ IntelliJ 在 gradlew 同行被 gradle 判据抢走 ⇒ 判序漂了`;
    return null;
  });
  // 62 渲染面：主入口必须把三分类印出来并自带闭合分母（摘掉打印那半截 ⇒ 本臂红；T61 只管 analyze() 侧）
  arm("T62 主入口打印：汇总必须带「桶5三分类=…（合计 N／桶5 M）」且 N=M、Gradle+IDE 两族 ≥1", () => {
    cleanTree();
    const sub = path.join(tmp, "print-b5");
    fs.mkdirSync(sub, { recursive: true });
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    writeRules(P1, "```gradle\ntasks.register(\"genSources\") { }\n./gradlew processResources   # IntelliJ IDEA\n```\n");
    const blFile = path.join(sub, "bl.json");
    fs.writeFileSync(blFile, JSON.stringify({
      asOf: "fixture",
      floors: Object.fromEntries(REQUIRED_FLOOR_KEYS.map((k) => [k, 0])),
      ceilings: Object.fromEntries(REQUIRED_CEILING_KEYS.map((k) => [k, 99])),
      basis: {},
    }), "utf8");
    const exFile = path.join(sub, "ex.txt");
    fs.writeFileSync(exFile, "", "utf8");
    const sp = spawnSync(process.execPath, [path.join(HERE, "assert-rules-api-names.mjs")], {
      encoding: "utf8", windowsHide: true,
      env: { ...process.env, MC_SKILL_RULES_ROOT: tmp, MC_SKILL_RULES_DATA: path.join(tmp, "data"), MC_SKILL_RULES_BASELINE: blFile, MC_SKILL_RULES_EXEMPTIONS: exFile },
    });
    const line = String(sp.stdout).split(/\r?\n/).find((l) => l.includes("桶5三分类"));
    if (!line) return `stdout 无桶5三分类段（rc=${sp.status}）：\n${String(sp.stdout).slice(0, 300)}`;
    const g = /桶5三分类=Gradle (\d+)／IDE (\d+)／散文 (\d+)／未证类名 (\d+)（合计 (\d+)／桶5 (\d+)/.exec(line);
    if (!g) return `三分类段的形状不符（四族 + 合计 + 桶5 六枚数都得在）｜该行=${line.slice(0, 220)}`;
    const [gg, gi, gp, go, sum, b5] = g.slice(1).map(Number);
    if (gg + gi + gp + go !== sum) return `四族之和 ${gg + gi + gp + go} ≠ 自印合计 ${sum} ⇒ 打印侧自己也算不平（该行=${line.slice(0, 200)}）`;
    if (sum !== b5) return `合计 ${sum} ≠ 桶5 ${b5} ⇒ 分类吞行，或桶5 那枚数与分类不同源`;
    if (gg + gi < 1) return `Gradle 与 IDE 两族皆 0（${line.slice(0, 200)}）⇒ 夹具里那两行没被分到族，判据或接线漂了`;
    return null;
  });
  // 37 现门等价臂：同一棵合成 pack，现门 CLI 的映射✓/· 必须与本门 legs 一致
  arm("T37 现门等价：assert-skill-yarn-attest --pack 的「映射✓」集合与本门 tails 一致", () => {
    cleanTree();
    const rows = [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"], ["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_1277"]];
    writePack(P2, rows);
    const gate = path.join(HERE, "assert-skill-yarn-attest.mjs");
    const sp = spawnSync(process.execPath, [gate, `--pack=${packOf(P2)}`, "--names=SimpleParticleType,DefaultParticleType,ZzzAbsentProbe77"], {
      encoding: "utf8", env: { ...process.env, MC_SKILL_YARN_ATTEST_ROOT: tmp, MC_SKILL_YARN_ATTEST_LIST: path.join(tmp, "no-list.txt") },
    });
    if (sp.status !== 0 && sp.status !== null && !/pack=/.test(sp.stdout ?? "")) return `现门 CLI 未能对合成 pack 出判词 rc=${sp.status} ${String(sp.stderr).slice(0, 120)}`;
    const mine = new Set();
    for (const [fq] of rows) mine.add(fq.slice(fq.lastIndexOf("/") + 1));
    const theirs = new Set();
    for (const l of String(sp.stdout).split(/\r?\n/)) {
      const m = /^\s{2}(\S+)\s+语料\S\s+映射✓/.exec(l);
      if (m) theirs.add(m[1]);
    }
    const diff = [...mine].filter((x) => !theirs.has(x)).concat([...theirs].filter((x) => !mine.has(x)));
    return diff.length === 0 ? null : `不一致：${diff.join(",")}｜现门输出=${String(sp.stdout).replace(/\r?\n/g, " / ").slice(0, 220)}`;
  });
  // 38 主入口 rc 冒烟（红⇒rc=1 / 正控⇒rc=0）
  arm("T38 主入口 rc：投毒树 rc=1，改回正解 rc=0（同棵树两臂，证门不是恒红也不是恒绿）", () => {
    cleanTree();
    const sub = path.join(tmp, "rc-probe");
    fs.mkdirSync(sub, { recursive: true });
    writePack(P1, [["net/minecraft/particle/DefaultParticleType", "net/minecraft/class_2400"]]);
    writePack(P2, [["net/minecraft/particle/SimpleParticleType", "net/minecraft/class_2400"]]);
    const exFile = path.join(sub, "ex.txt");
    fs.writeFileSync(exFile, "", "utf8");
    const blFile = path.join(sub, "bl.json");
    // 子进程跑的是 main ⇒ requireKeys=true，夹具基线必须键集齐全（否则 rc=0 那一臂会被 BASELINE-KEY-LOSS 顶成红）
    fs.writeFileSync(blFile, JSON.stringify({
      asOf: "fixture",
      floors: Object.fromEntries(REQUIRED_FLOOR_KEYS.map((k) => [k, 0])),
      ceilings: Object.fromEntries(REQUIRED_CEILING_KEYS.map((k) => [k, 99])),
      basis: {},
    }), "utf8");
    const run = () => spawnSync(process.execPath, [path.join(HERE, "assert-rules-api-names.mjs"), `--pack=${packOf(P2)}`], {
      // 合成树里 corpusPacks / classRows 这类数**合法地**是 0 ⇒ 全局跑会因 FLOOR-COLLECTOR 红在错的原因上；
      // 本臂要证的是「主入口 rc 随名字翻转」，故按单档跑（键集这条腿在 --pack 下仍然执法）。
      encoding: "utf8", env: { ...process.env, MC_SKILL_RULES_ROOT: tmp, MC_SKILL_RULES_DATA: path.join(tmp, "data"), MC_SKILL_RULES_BASELINE: blFile, MC_SKILL_RULES_EXEMPTIONS: exFile },
    });
    writeRules(P2, staleMdc);
    const bad = run();
    writeRules(P2, "```java\nObject P = new SimpleParticleType(true);\n```");
    const good = run();
    void fs.existsSync;
    return (bad.status === 1 && good.status === 0) ? null : `投毒臂 rc=${bad.status}｜正控臂 rc=${good.status}｜${String(good.stdout).slice(0, 160)}`;
  });

  for (const c of cases) {
    let err = null;
    try { err = c.fn(); } catch (e) { err = `抛异常：${e.message}`; }
    if (err) { missed++; console.log(`  FAIL ${c.name}\n        ${err}`); } else console.log(`  ok   ${c.name}`);
  }
  setRoots(REPO_ROOT, null);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`selftest: ${cases.length - missed}/${cases.length} 通过`);
  process.exitCode = missed === 0 ? 0 : 1;
}

const argv = process.argv.slice(2);
if (argv.includes("--selftest")) selftest();
else if (argv.includes("--measure-floors")) measureFloors();
else main(argv);
