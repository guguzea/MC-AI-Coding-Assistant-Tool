/**
 * assert-skill-yarn-attest.mjs —— Fabric/Quilt Skill 正文类名的「第二出处」门（2026-09-20 用户裁定升格）。
 *
 * 裁定背景：`data/fabric_<ver>/mappings/yarn-mappings.sqlite` 原本只被 `convert_mapping` 用来互转
 * 名字，不算「文档出处」。用户 2026-09-20 明示：**升格为「类名存在性」合法来源并配门**。
 * 本门就是那只门。它只回答一个问题 —— 这个标识符在该版本档**确实存在**吗 —— 不回答"怎么用"。
 *
 * 判据（(a)(b)(c) 任一即算有出处，(d) 是否决它们的一道闸）：
 *   (a) 本档语料逐字命中：`data/<平台>_<版本>/**` 下任一原文（`.md|.java|.json|.gradle|.kts|.mcfunction|.toml|.txt`）含该串；
 *       **`mappings/` 整目录排除**（那里是 yarn-mappings.json / parchment-params.json 这类机器 dump，两套映射的
 *       类名全在里面，读它等于给任意类名背书）。
 *       **注释行不算命中**（2026-09-27 C1）：上游页里被注释掉的示例代码、javadoc 续行、`<!-- -->` 说明段
 *       都可能留着早已失效的类名，让这种行替正文背书 = 门替陈旧名字放行。行照旧计入语料长度，只是把
 *       非空白字符抹平，保证"有没有这一页"与"名字是否被断言"两件事分开量。
 *   (b) 本档 yarn 映射命中：`yarn-mappings.sqlite` 的 classes.named 尾段 / methods.name_named
 *       / fields.name_named 等于该串；
 *   (c) 同行带未核实/禁止/零命中/不得 之类负例标记 ⇒ 那是"告诉读者别写这个名字"，不算断言；
 *   (d) **mojmap 独有名否决**：命中 `MOJMAP_ONLY` 且本档 yarn 映射**没能证实**该名 ⇒ (a) 不算出处，
 *       文件必须带「### ⚠️ 映射口径：本档语料是 mojmap」披露块并点名该 id，否则红。
 *       没有 (d) 时 (a) 会替 mojmap 背书 —— Fabric 1.20.4 / 1.21.x 的语料本身就是 mojmap 写的。
 *       **2026-09-27 C1 改的正是这半句**：旧写法是 `leg.usable && …`，于是「库不存在 / 打不开 / 零行」
 *       三种情形会把这道否决闸**静默熄火**，而 (a) 那腿照旧替 mojmap 名背书 ⇒ 库越坏门越绿。
 *       现在判据反过来：只有映射腿**真的证出**该名才放行，读不到库 = 证不出 = 照旧要披露。
 *   (e) **嵌套尾段限定同现（R2，2026-10-06）**：(b) 按 `Outer$Inner` 行取最内尾段是 2026-10-06 两腿批
 *       为放行 `SpawnRestriction.Location` 一族切的刀，但同一刀也把 `Default/Data/Entry/Config` 这类
 *       通用尾段变成裸名放行凭证（映射里只要存在任一 `X$Default` 行即可）。收紧：只出自 `$` 行且无
 *       独立同名行的尾段记入 `tailOnly`，裸用须**本件同现**限定形态（`Outer.Location` / `Outer$Location`）
 *       才放行，否则红【嵌套尾段·无限定同现】。真有独立类的名字（非嵌套行在场）不受影响。
 *   (f) **外部声明逐名签收（R1，2026-10-06）**：fabric 管辖权分支里，件内 frontmatter/注记声明
 *       `externalApis` 从前是**文件级开关**——声明过任意外部库，该文件里任意非宇宙名都转队列，
 *       「队列待人工审」实际 = 没人读的白洗通道。收紧：转队列须同时满足「该**名**在签收台账
 *       `external-apis-signoff.tsv`（name⇐slugs⇐basis⇐asof）」「台账 slug 集与本件声明有交集」；
 *       未入账 ⇒ 红【外部名未签收】、归属不符 ⇒ 红【外部声明归属不符】。台账读不动/零行 ⇒
 *       主门点名判红【SIGNOFF-MISSING】（清空台账不得关掉执法，与 SQLITE-UNREADABLE 同族）。
 *       队列 TSV 第 4 列 = 跨平台打标：名命中 forge/neoforge loader-api 摘要类末段 ⇒ 标 `forge`/
 *       `neoforge`（只打标供签收人识别跨加载器库泄漏，不判红——Mixin 这类合法共用件不得误杀）。
 *
 * 已知边界（写进 AGENTS 的同一句里）：
 *   - sqlite 只含 **vanilla** 名（Yarn named），**不含** `net.fabricmc.fabric.api.*` ⇒ Fabric API
 *     的类仍只能走 (a) 语料。
 *   - Yarn 与 mojmap 不同名：`MobEffect` 在 Yarn 档里是 `StatusEffect`，`ServerLevel` / `VillagerTrades`
 *     一类在 Yarn 档查不到。抓它靠 (d) 的名表 + 披露要求；(b) 本身只能说"本档映射没这个名"，
 *     说不了"这是另一套映射的名"。
 *   - 门只证存在性，不证语义/签名/用法。签名与流程仍须 `search_*_docs` 或反编译源码。
 *
 * 时代真相（2026-09-20 逐库实读 `meta.mappingEra`，22 份同名文件）：**文件名里的 yarn 是假的**。
 *   - `fabric_*` 13 档 = `yarn-tiny`（本门唯一认的时代；1.14.4 … 1.21.11 全在，只 `fabric_26.1.2` 无库）
 *   - `forge_1.7.10/1.8.9/1.9.4/1.10.2/1.11.2/1.12.2` = `forge-srg`（named 列是 MCP `func_/field_`，
 *     `intermediary` 与 `named` 逐行相同 ⇒ 那列没有信息）
 *   - `forge_1.13.2` = `tsrg`（同上）
 *   - `forge_1.14.4` / `forge_1.15.2` = `mcp-csv`，且 **classes/methods/fields 三表 0 行**，
 *     meta 却写 `methodCount:11445 / fieldCount:15133`（那些行只进了 `searge_*` 表）⇒ 光看文件在不在
 *     就把映射腿打开，等于给一个空库背书。本门因此两道都查：时代必须是 yarn，三表必须真有行。
 *
 * 用法：
 *   node scripts/assert-skill-yarn-attest.mjs                        # 清单门（默认）
 *   node scripts/assert-skill-yarn-attest.mjs --selftest             # 证明本门真会红
 *   node scripts/assert-skill-yarn-attest.mjs --pack=fabric_1.21.11 --names=Goal,MobEffect
 *   node scripts/assert-skill-yarn-attest.mjs --queue=<仓库外绝对路径>   # 把「签收台账在册·非MC宇宙名」条目写成 TSV（第 4 列跨平台打标）供人工审（仓库内路径拒绝 [QUEUE-IN-REPO]，写作不影响 rc）
 *   MC_SKILL_YARN_ATTEST_LIST=<file> 覆盖清单路径；MC_SKILL_YARN_ATTEST_ROOT=<dir> 只给 selftest 用；
 *   MC_SKILL_YARN_ATTEST_SIGNOFF=<file> 覆盖签收台账路径（默认 scripts/external-apis-signoff.tsv）。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { fapiRoster, fapiSummaries, loaderSummaries } from "./_lib/api-name-collector.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const LIST_PATH = process.env.MC_SKILL_YARN_ATTEST_LIST
  ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_LIST)
  : path.join(HERE, "skill-yarn-attest.files.txt");
let ROOT = process.env.MC_SKILL_YARN_ATTEST_ROOT ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_ROOT) : REPO_ROOT;

const sqliteCache = new Map();

/** Fabric API 归属名单（与规则门 `assert-rules-api-names` **同三来源、同 per-档 口径**）：
 *   ① 本档语料正文里 `net/fabricmc/…` 限定名的末段（`fapiRoster`，生产件本体）
 *   ② 本档 `mcp-server/data/loader-api-summaries/<档>-fabric-api.json` 的类末段（`fapiSummaries`）
 *   ③ 本档 `<档>-fabric.json` = **fabric-loader 本体**的类末段（`loaderSummaries`，2026-09-28 入库 14 档）
 * 为什么要接进本门：技能源稿大量写 FAPI（`ClientModInitializer` / `ParticleFactoryRegistry`），
 * 而本门的第二出处只有 vanilla 的 yarn 映射（根总纲「边界②」：Yarn 库里 `net/fabricmc/*` = 0 条）
 * ⇒ 没有这份名单，particle 一族实测 58 处红里 9 处是这类名字，门永远钉红。
 * ③ 单列一路的理由：`ClientModInitializer` / `DedicatedServerModInitializer` / `Environment` / `EnvType`
 * 是 **loader** 类，前两路都不含（实测 ② 的 11 件里 Environment / EnvType 0 命中）⇒ 没有 ③ 的话
 * 「实现加载器入口点」这一最标准的写法在本门必红（重建腿之后实测残留 8 处里 6 处就是它）。
 * 摘要件**在盘但读不动** ⇒ 随 `unreadable` 交给上层点名判红，不得塌成「该档没有 FAPI 名」。 */
let fapiSumDir = process.env.MC_SKILL_YARN_ATTEST_FAPI_SUMMARIES
  ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_FAPI_SUMMARIES)
  : path.join(HERE, "..", "data", "loader-api-summaries");
// ③ 与 ② 同目录、不同件 ⇒ 单独一个旋钮，两臂活证才能「只切 loader 面」（与规则门同一套机制）。
let loaderSumDir = process.env.MC_SKILL_YARN_ATTEST_LOADER_SUMMARIES
  ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_LOADER_SUMMARIES)
  : path.join(HERE, "..", "data", "loader-api-summaries");
// R1 签收台账（2026-10-06）：外部名从「文件级开关」改「逐名签收」⇒ 名不在台账里，
// 件内声明了 externalApis 也照旧红。与 SQLITE-UNREADABLE 同理：清空台账不得等于关掉执法
// ⇒ 台账读不动 / 零行 ⇒ 主门直接红【SIGNOFF-MISSING】。
let ledgerPath = process.env.MC_SKILL_YARN_ATTEST_SIGNOFF
  ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_SIGNOFF)
  : path.join(HERE, "external-apis-signoff.tsv");
const signoffCache = { box: null };
const crossCache = { map: null };
function resetExternalLegs() { signoffCache.box = null; crossCache.map = null; }
function signoffLedger() {
  if (signoffCache.box) return signoffCache.box;
  const box = { data: new Map(), missing: null };
  let raw = null;
  try { raw = fs.readFileSync(ledgerPath, "utf8"); } catch (e) { box.missing = `${ledgerPath} 读不动（${e.message}）`; }
  if (raw !== null) {
    for (const line of raw.split(/\r?\n/)) {
      const s = line.trim();
      if (!s || s.startsWith("#") || s.startsWith("name\t")) continue;
      const [name, slugs, basis, asof] = s.split("\t");
      if (!name || !slugs) { box.missing = box.missing ?? `台账行缺字段：${s.slice(0, 80)}`; continue; }
      box.data.set(name, { slugs: slugs.split(",").map((x) => x.trim()).filter(Boolean), basis: basis ?? "", asof: asof ?? "" });
    }
    if (!box.data.size && !box.missing) box.missing = "台账零行（清空台账不得关掉执法）";
  }
  signoffCache.box = box;
  return box;
}
/** R1b 跨平台打标（2026-10-06）：签收名同时命中 forge/neoforge 摘要件的类名末段 ⇒ 队列行带标记列。
 *  判**信息**不判红——Mixin/JDK 这类跨平台共享库在两平台都合法在场；真·跨加载器漏网（NeoForge 类
 *  出现在 fabric 件里）由签收人对着标记逐条处置，门不替人猜。 */
function crossPlatforms() {
  if (crossCache.map) return crossCache.map;
  const m = new Map();
  let names = [];
  try { names = fs.readdirSync(loaderSumDir); } catch { names = []; }
  for (const fn of names) {
    const mt = fn.match(/^(.+)-(forge|neoforge)\.json$/);
    if (!mt) continue;
    let j = null;
    try { j = JSON.parse(fs.readFileSync(path.join(loaderSumDir, fn), "utf8")); } catch { continue; }
    for (const c of j?.classes ?? []) {
      const tail = String(c?.fqcn ?? "").split(/[.$]/).pop();
      if (!tail || !/^[A-Z]/.test(tail)) continue;
      const cur = m.get(tail);
      if (cur && !cur.includes(mt[2])) m.set(tail, `${cur},${mt[2]}`);
      else if (!cur) m.set(tail, mt[2]);
    }
  }
  crossCache.map = m;
  return m;
}
/** R2 嵌套尾段限定同现（2026-10-06）：裸尾段不再以映射里有 `Outer$Inner` 行作放行凭证——
 *  须该件内（正文或围栏）同现限定形态 `Outer.Inner` / `Outer$Inner`。 */
function qualifiedInText(text, id) {
  const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`[A-Za-z_$][\\w$]*\\s*[.$]\\s*${esc}\\b`).test(text);
}
const fapiVetoCache = new Map();
function fapiVetoFor(version) {
  const key = `${ROOT}|${version}|${fapiSumDir}|${loaderSumDir}`;
  const hit = fapiVetoCache.get(key);
  if (hit) return hit;
  const roster = fapiRoster(path.join(ROOT, "data"), [`fabric_${version}`]);
  const sum = fapiSummaries(fapiSumDir, [version]);
  const lsum = loaderSummaries(loaderSumDir, [version]);
  const names = new Set(roster.names.keys());
  let fromApi = 0;
  let fromLoader = 0;
  const s = sum.byVer.get(version);
  if (s) for (const n of s) if (!names.has(n)) { names.add(n); fromApi++; }
  const l = lsum.byVer.get(version);
  if (l) for (const n of l) if (!names.has(n)) { names.add(n); fromLoader++; }
  const unreadable = [
    ...(sum.unreadable ?? []).map((v) => `fabric-api:${v}`),
    ...(lsum.unreadable ?? []).map((v) => `fabric-loader:${v}`),
  ];
  const made = {
    names, unreadable,
    absent: [...(sum.absent ?? []), ...(lsum.absent ?? [])],
    counts: { roster: roster.names.size, api: fromApi, loader: fromLoader, total: names.size },
  };
  fapiVetoCache.set(key, made);
  return made;
}

/** 本件自声明位 = 作者在**这一篇正文里**自己定义的名字，属「引用外部 API」之外的形状：
 *  类型声明（与规则门 `analyze` 的 decl Set 同口径）∪ `static final` 常量 ∪ 带可见性的方法声明。
 *  代价点名：方法声明被否决后，「override 写错名」这一类在本门不再响 —— 那是**签名门**的判面
 *  （根总纲 §9：签名/参数个数与本门的名字判据正交），不要指望本门拦它。 */
function declaredNames(text) {
  const s = new Set();
  for (const m of text.matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_]*)/g)) s.add(m[1]);
  for (const m of text.matchAll(/\bstatic\s+final\s+[\w.<>?[\]]+\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/g)) s.add(m[1]);
  for (const m of text.matchAll(/^[ \t]*(?:public|private|protected)\s+(?:static\s+|final\s+|synchronized\s+|abstract\s+)*[\w.<>?[\]]+\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^()]*\)\s*\{/gm)) s.add(m[1]);
  // 形参/字段声明位（2026-10-06 两腿批）：`PlayerInventory playerInventory)` / `PacketSender responseSender,` /
  // `PacketContext<?> packetContext)` —— 这些位置的名字是**作者起的**（叫什么由作者定），不构成对外部 API 的
  // 引用，与类名、`static final` 常量同类，进声明位否决。防线三条：类型侧必须大写起头（可带一层泛型）、
  // 名字侧小写起头、名字后紧跟逗号/闭圆/分号 ⇒ `Arrays.sort(arr)`（类型后是点不是空格）、`foo(bar)`
  // （类型侧小写起头）都不误吸；采集侧只收带大写且 ≥4 字符的名字，散文被误吸一个形参名也无害。
  for (const m of text.matchAll(/\b[A-Z][A-Za-z0-9_$]*(?:<[^<>]*>)?\s+([a-z][A-Za-z0-9_]*)\s*[,);]/g)) s.add(m[1]);
  // lambda 裸形参表：`(..., responseSender) ->` / `(packetContext, buf) ->` —— Java/Kotlin 的 lambda 实参表
  // 不带类型，名字同样由作者起。两步走：先整表圈进「括号+紧跟 ->」的位置，再**按 token 过滤** ——
  // 只吸小写起头的名字；混进表里的大写起头名字（`GhostlyType`）照旧被采集判红，不因同表有合法形参而漏网。
  for (const m of text.matchAll(/\(([^()]*)\)\s*->/g)) {
    for (const n of m[1].split(/\s*,\s*/)) if (/^[a-z][\w]*$/.test(n)) s.add(n);
  }
  return s;
}


function setRoot(dir) {
  ROOT = path.resolve(dir);
  for (const db of sqliteCache.values()) {
    try {
      db?.close();
    } catch {}
  }
  corpusCache.clear();
  sqliteCache.clear();
  legCache.clear();
  fapiVetoCache.clear();
  resetExternalLegs(); // R1：台账/跨平台缓存按 ROOT 与 ledgerPath 取值，换根必须失效（与宇宙缓存同形）
  // mcUniverse() 按 ROOT 建（扫 ROOT/data 的 fabric_* 档）⇒ 与上面几个缓存同形，换 ROOT 必须失效。
  // 否则 selftest 的 tmp 宇宙会漏进同进程的实跑读数（或反过来），管辖权分支就成了按调用顺序定值的轮盘。
  mcUniverseCache.set = null;
  mcUniverseCache.fapiMembers = null;
}

const NEG = /未核实|禁止|不得|零命中|没有|无源|不写|另一套|别的版本|勿抄/;
const STOP = new Set([
  "TODO",
  "SKILL",
  "AGENTS",
  "AGENT_USAGE",
  "CONTRIBUTING",
  "README",
  "IF",
  "ELSE",
  "TRUE",
  "FALSE",
  "NULL",
  "MCP",
  "CLI",
  "API",
  "JSON",
  "YARN",
  "MOJMAP",
  "PARCHMENT",
  "MOD_ID",
  "IDE",
  "PNG",
  "JDK",
  "Gradle",
  "Fabric",
  "Forge",
  "NeoForge",
  "Quilt",
  "Minecraft",
  "Override",
  "Deprecated",
  // 2026-09-28（particle 一族实测）：技能稿里**作者自造的示例名**与**散文词**。要求它们在 vanilla
  // 映射或语料里存在是范畴错误 —— 本门证的是「外部 API 名有没有出处」，不是「示例工程每个标识符
  // 都得是 Minecraft 的东西」。⚠ 手列名单的已知弱点：换一个新示例名就重新红；大头由 declaredNames()
  // （本件声明位）兜，这里只收「示例稿按惯例自造、且任何一档都不可能有出处」的这一小批。
  "MyParticle", "MyParticleType", "MyEffectParticle", "MyEffectsParticleFactory", "ExampleModClient",
  "MY_PARTICLE", "MY_EFFECTS_PARTICLE", "Factory",
]);

/** 非 JVM 围栏语言（构建脚本 / 配置 / shell / 数据）——本门的判面是「MC API 类名有没有出处」，
 *  `mavenCentral()` / `filesMatching(...)` / `gradlew` / pack JSON 里的键不是 MC 名，按 MC 名要求它们
 *  在 yarn 或语料里有出处是范畴错误（根总纲「不确定时」也只在讲 API 名）。2026-10-06 扩面实测：
 *  全量 532 件里 63 处落在这类围栏，逐条读正文均为 Gradle DSL / bash 命令，无一处是 MC API。
 *  ⚠️ 无标签围栏照旧判（Decision Flow 里写的是真类名，如 `Monster` / `PlacedFeature`）。 */
const NON_JVM_FENCE = /^(gradle|groovy|kts?|buildscript|bash|sh|shell|zsh|powershell|ps1|cmd|bat|jsonc?|json5|ya?ml|toml|properties|ini|csv|tsv|txt|text|diff|patch|http|xml|html|mermaid|dot|graphviz|sql|dotgraph)$/i;

function idsOf(text, { scope = "all", stats = null } = {}) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let inBlock = false;
  let fenceLang = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
      if (inBlock) { inBlock = false; fenceLang = ""; }
      else { inBlock = true; fenceLang = line.replace(/^```/, "").trim(); }
      continue;
    }
    if (scope === "fence" && !inBlock) continue;
    if (scope === "prose" && inBlock) continue;
    if (inBlock && NON_JVM_FENCE.test(fenceLang)) {
      if (stats) stats.fenceSkippedLines = (stats.fenceSkippedLines ?? 0) + 1;
      continue;
    }
    if (inBlock && /^\s*(\/\/|\*|\/\*)/.test(line)) continue;
    if (NEG.test(line)) continue;
    // 判侧也要抹注释/字符串（与语料侧 C1②、§3 的 `.java` 行尾同口径）：
    //   `super(true);  // alwaysShow = true` 里的名字不是「对外部 API 的引用」，
    //   `Identifier.of("mod","my_Particle_Type")` 里的散文词也不是。先摘字符串（保住串内的 `//`）再抹注释。
    let body = line;
    if (inBlock) body = stripCommentsAndStrings(line);
    const ids = new Set();
    for (const raw of body.split(/[^A-Za-z0-9_.$#()/]+/)) {
      for (const part of raw.split(/[.$#()/]+/)) {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) continue;
        if (!/[A-Z]/.test(part)) continue;
        if (part.length < 4) continue;
        if (STOP.has(part)) continue;
        ids.add(part);
      }
    }
    for (const id of ids) out.push({ id, at: i + 1 });
  }
  return out;
}

const corpusCache = new Map();

/**
 * 语料里的「注释形态」行 —— 这类行上的类名**不算出处**（C1②）。
 * 按扩展名分叉，避免把 markdown 的项目符号行当注释抹掉：
 *   - `.java|.gradle|.kts`：`//`、`/*`、javadoc 续行 `*`
 *   - 其余（`.md|.json|.txt|.mcfunction|.toml`）：`//`、`/*`、`*​/`、`<!--`、`-->`
 *     —— markdown 的 `* 条目` 是正文不是注释，`#` 是标题，都不能抹。
 */
function isCommentLine(ext, line) {
  if (ext === "java" || ext === "gradle" || ext === "kts") return /^\s*(\/\/|\/?\*)/.test(line);
  return /^\s*(\/\/|\/\*|\*\/|<!--|-->)/.test(line);
}

/** 判侧抹平：先摘字符串字面量（保住串内的 `//`），再抹行尾与块注释。行与长度照旧，行号不动。 */
function stripCommentsAndStrings(line) {
  return line
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'[^'\\]*'/g, "'x'")
    .replace(/\/\/.*$/, "")
    .replace(/\/\*.*?\*\//g, "");
}

/** 抹平一行里的非空白字符：行还在、长度还在，但任何名字都匹配不上。 */
function blankLine(line) {
  return line.replace(/\S/g, " ");
}

function corpusBlob(platform, version) {
  const key = `${platform}_${version}`;
  if (corpusCache.has(key)) return corpusCache.get(key);
  const root = path.join(ROOT, "data", key);
  let blob = "";
  if (fs.existsSync(root)) {
    const stack = [root];
    while (stack.length) {
      const cur = stack.pop();
      let entries = [];
      try {
        entries = fs.readdirSync(cur, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const f of entries) {
        const full = path.join(cur, f.name);
        if (f.isDirectory()) {
          // mappings/ 是机器 dump（yarn-mappings.json / parchment-params.json）——两套映射的类名全在里面，
          // 让它进语料 ⇒ 几乎任何类名都"有出处"，mojmap 名也被洗白。映射侧的证据只走带时代校验的 sqlite 腿。
          if (f.name === "mappings") continue;
          stack.push(full);
        } else if (/\.(md|java|json|gradle|kts|mcfunction|toml|txt)$/.test(f.name)) {
          try {
            const ext = f.name.slice(f.name.lastIndexOf(".") + 1);
            for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
              blob += (isCommentLine(ext, line) ? blankLine(line) : line) + "\n";
            }
          } catch {}
        }
      }
    }
  }
  corpusCache.set(key, blob);
  return blob;
}

/* ── 管辖权（2026-10-06 扩面批）─────────────────────────────────────────────
 * 全量实测 532 件 = 856 处红，逐条定性后分成两族：
 *   ① 确实是 MC 名（本档或别档的 yarn / FAPI / loader / mojmap 列有它）⇒ 本门照旧逐档判，
 *      别档有本档无 = 真·逐版泄漏，必须红（这条是本门的存在理由，没有放松）。
 *   ② 全仓 MC 两路都查无（Cloth / Mixin / REI / Netty / JDK / Kotlin 插件 / Gradle DSL /
 *      示例自造名 / 本仓工具参数）⇒ 门对它们**没有出处可谈**，要求它们在 vanilla 映射里存在
 *      是范畴错误（文件头 STOP 名单的注释早已点名这个弱点：「换一个新示例名就重新红」）。
 * 族②不得静默放行：只有**该件 frontmatter 显式声明了外部库**（`externalApis:`）才记账不判红，
 * 且逐条进 `--queue` 的人工审清单；没声明的件里冒出查无名 ⇒ 照旧红（这正是抓
 * `MonsterEntity` 这类「长得像 MC 的幻觉名」的腿，实测该名单路 12/13 档红）。 */

/** 全仓 fabric 档（yarn 三表尾段 ∪ FAPI 真构件类/方法/字段 ∪ loader 摘要 ∪ mojmap official 列）。
 *  只用来回答「这串名字是不是 MC 生态的名」，不用来放行任何一档 —— 按档判定仍走 mappingLeg/语料。 */
const mcUniverseCache = { set: null, fapiMembers: null };
function mcUniverse() {
  if (mcUniverseCache.set) return mcUniverseCache;
  const set = new Set();
  const fapiMembers = new Map(); // 档 -> Set(方法/字段名)，用于本档否决位
  const dataRoot = path.join(ROOT, "data");
  let vers = [];
  try {
    vers = fs.readdirSync(dataRoot, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name.startsWith("fabric_")).map((d) => d.name.slice(7));
  } catch {}
  for (const v of vers) {
    const leg = mappingLeg("fabric", v);
    for (const n of leg.ids) set.add(n);
    // official（mojmap）列：判「这串名字是不是 MC 名」用。注意它**不是**放行依据 —— 放行仍要
    // 本档语料或本档映射证出；mojmap 独有那一层由 MOJMAP_ONLY + 披露块负责。
    const db = sqliteCache.get(`fabric_${v}`);
    if (db) {
      try {
        for (const r of db.prepare("select official from classes").all()) {
          const tail = String(r.official ?? "").split(/[/$.]/).pop(); // 与 mappingLeg 同刀：official 也有 `Outer$Inner`
          if (tail && /^[A-Z]/.test(tail)) set.add(tail);
        }
      } catch {}
    }
    const members = new Set();
    for (const suffix of ["-fabric-api", "-fabric"]) {
      const sf = path.join(HERE, "..", "data", "loader-api-summaries", `${v}${suffix}.json`);
      if (!fs.existsSync(sf)) continue;
      let j = null;
      try {
        j = JSON.parse(fs.readFileSync(sf, "utf8"));
      } catch {
        continue; // 读不动由 fapiVetoFor 那条腿点名判红，这里不重复报
      }
      for (const c of j?.classes ?? []) {
        const fq = typeof c?.fqcn === "string" ? c.fqcn : "";
        if (!/^net\.fabricmc\./.test(fq)) continue; // 与归属名单同尺：只认 FAPI/loader 自己的包
        for (const m of c.methods ?? []) if (typeof m?.name === "string") members.add(m.name);
        for (const fl of c.fields ?? []) {
          const n = typeof fl === "string" ? fl : fl?.name;
          if (n) members.add(n);
        }
      }
    }
    fapiMembers.set(v, members);
    for (const n of members) set.add(n);
  }
  for (const n of MOJMAP_ONLY) set.add(n);
  mcUniverseCache.set = set;
  mcUniverseCache.fapiMembers = fapiMembers;
  return mcUniverseCache;
}

/** 本档 FAPI / loader 摘要件的**成员**否决位（类末段那一路由 fapiVetoFor 负责，这里补方法与字段）。
 *  动机：`registerGlobalReceiver` / `addCarver` / `ALLOW_DEATH` / `PICKAXES` 这些是真 FAPI 成员，
 *  摘要件里就有（类清单此前只取了类名）⇒ 门把它们判成「无出处」是名单没接全，不是正文写错。 */
function fapiMemberVeto(version) {
  const { fapiMembers } = mcUniverse();
  return fapiMembers.get(version) ?? new Set();
}

/** 件级外部库声明：frontmatter `externalApis: [a, b]` / `externalApis: a, b`，或行内标记
 *  `<!-- external-apis: a, b -->`。返回声明名数组（可为空）。 */
function externalApisOf(text) {
  const fm = text.match(/^---[\s\S]*?^externalApis:\s*(.*)$/m);
  if (fm) {
    const v = fm[1].replace(/^\[|\]$/g, "");
    const arr = v.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);
    if (arr.length) return arr;
  }
  const marker = text.match(/<!--\s*external-apis:\s*([^>]+?)\s*-->/i);
  if (marker) return marker[1].split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);
  return [];
}

/** 本门认的映射时代。磁盘实测另有三类同名文件，见文件头「时代真相」。 */
const YARN_ERAS = new Set(["yarn-tiny", "yarn"]);

const legCache = new Map();
/**
 * 解析某档 `mappings/yarn-mappings.sqlite` 能否当「类名存在性」出处。
 * 只文件存在不算 —— 磁盘实测 forge 档里同名文件装的是 forge-srg / tsrg / mcp-csv，
 * 且 `data/forge_1.14.4` / `forge_1.15.2` 两份的 classes/methods/fields **零行**
 * （meta 却写 methodCount 11445 / fieldCount 15133，那些行只在 searge_* 表里）。
 *
 * `state` 是**四态**（C1①：旧版把后三种揉成一句 `usable:false` + 不同 `why`，
 * 于是调用方按 `leg.usable` 决定要不要执法 ⇒ 库越坏、执法越少）：
 *   `absent`     根本没有这个文件（`fabric_26.1.2` 按设计无库）
 *   `unreadable` 文件在但读不动 / 不是 sqlite / 零字节 / 表缺失 ⇒ **主门为此红（读失败不得当"查无"）**
 *   `era`        时代不是 yarn（forge-srg / tsrg / mcp-csv）
 *   `zero-rows`  yarn 时代但三张主表零行
 *   `ok`         可用
 */
function mappingLeg(platform, version) {
  const key = `${platform}_${version}`;
  if (legCache.has(key)) return legCache.get(key);
  const leg = {
    exists: false,
    state: "absent",
    era: null,
    ids: new Set(),
    tailOnly: new Set(), // 只出自 `Outer$Inner` 行的尾段（无独立同名行）⇒ 放行须限定同现（R2）
    usable: false,
    why: "无 yarn-mappings.sqlite（只能靠语料）",
  };
  legCache.set(key, leg);
  const file = path.join(ROOT, "data", key, "mappings", "yarn-mappings.sqlite");
  if (!fs.existsSync(file)) return leg;
  leg.exists = true;
  // 打开 + 读 meta 一起重试至多 3 次：本仓在 OneDrive 卷上，写盘/读盘偶发 -4094 / EBUSY（见项目账
  // project-onedrive-write-jitter）。**fail-loud 的门不得同时是 flaky 的门** —— 抖动重试掉，
  // 三次仍失败才判 unreadable 并红（真损坏照样被抓，只是不被瞬时锁骗红）。
  let db = null;
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      db = new DatabaseSync(file, { readOnly: true });
      leg.era = db.prepare("select value from meta where key='mappingEra'").get()?.value ?? null;
      lastErr = null;
      break;
    } catch (err) {
      try {
        db?.close();
      } catch {}
      db = null;
      lastErr = err;
      if (attempt < 2) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150 << attempt);
    }
  }
  if (!db) {
    leg.state = "unreadable";
    leg.why = `yarn-mappings.sqlite 存在但三次读不动（最后一次：${lastErr?.message ?? "open/query 失败"}）`;
    return leg;
  }
  sqliteCache.set(key, db);
  if (!YARN_ERAS.has(leg.era)) {
    leg.state = "era";
    leg.why = `该档 yarn-mappings.sqlite 的 mappingEra=${leg.era ?? "(无 meta)"}，不是 yarn 名，不得当出处`;
    return leg;
  }
  const nestedSegs = new Set();
  const plainSegs = new Set();
  for (const [table, col] of [
    ["classes", "named"],
    ["methods", "name_named"],
    ["fields", "name_named"],
  ]) {
    try {
      for (const r of db.prepare(`select ${col} as n from ${table}`).all()) {
        // 嵌套类切段（2026-10-06 两腿批）：classes.named 存 `net/…/SpawnRestriction$Location`，
        // 采集侧把 `SpawnRestriction.Location` 按 `.` 切成 id `Location` ⇒ 腿只剥 `/` 就永不匹配
        // （实测残余红 5×Location + 4×WrapperLookup 全是这形状）。只取**最内**尾段：
        // 没有该嵌套类的版本（1.14.4 的映射里没有 RegistryWrapper$WrapperLookup）照旧不放行，
        // 逐版语义不动；methods/fields 行的名字本就不含 `/`/`$`，同一刀切下去是恒等。
        // R2 收紧（2026-10-06）：出自 `$` 行的尾段单独记入 tailOnly ⇒ 裸 `Location`/`Config` 这类
        // 通用尾段不得因映射里存在某条 `Outer$Inner` 行而静默变绿；放行须限定同现（qualifiedInText）。
        const full = String(r.n ?? "");
        const seg = full.split(/[/$]/).pop();
        if (seg) {
          leg.ids.add(seg);
          if (full.includes("$")) nestedSegs.add(seg);
          else plainSegs.add(seg);
        }
      }
    } catch (err) {
      leg.state = "unreadable";
      leg.why = `yarn-mappings.sqlite 的 ${table}.${col} 读失败（${err?.message ?? "query 失败"}）`;
      leg.ids.clear();
      return leg;
    }
  }
  leg.tailOnly = new Set([...nestedSegs].filter((s) => !plainSegs.has(s)));
  if (!leg.ids.size) {
    leg.state = "zero-rows";
    leg.why = "yarn-tiny 档但 classes/methods/fields 零行 ⇒ 映射腿是空转，不得当出处";
    return leg;
  }
  leg.state = "ok";
  leg.usable = true;
  leg.why = `yarn 映射（${leg.ids.size} 个名）`;
  return leg;
}

/**
 * mojmap 独有名表。左列在各 fabric 档 `mappings/yarn-mappings.sqlite` 里 **0 命中**，
 * 右列（Yarn 对应名）在同一 sqlite **有类** —— 2026-09-20 逐名实读 6 个 Fabric 档的 sqlite 得出。
 * 为什么需要这张表：Fabric 1.20.4 / 1.21.x 的**语料本身就是 mojmap**
 * （`data/fabric_<v>/reference/<v>/build.gradle` 写 `mappings loom.officialMojangMappings()`，
 * docs 正文同名），所以「本档语料逐字命中」这条腿**会替 mojmap 名背书** ——
 * 而这些名抄进 Yarn 工程必编译失败。围栏里出现左列名 ⇒ 文件必须带披露块，否则红。
 * 括注 null 的那几个（GameTestHelper / MobSpawnType / PotionBrewing / ContextAwarePredicate /
 * EnchantmentTarget / EquipmentSlotGroup / RegistryLookup 与三个 datagen 生成器名）只是「Yarn 对应名
 * 未经本档 sqlite 证实」，仍然算 mojmap 独有，一样必须披露。
 */
const MOJMAP_ONLY = new Set([
  "MobEffect",
  "MobEffectInstance",
  "MobEffectCategory",
  "ResourceLocation",
  "Level",
  "ServerLevel",
  "Player",
  "ServerPlayer",
  "BuiltInRegistries",
  "BlockBehaviour",
  "SoundType",
  "SoundSource",
  "InteractionResult",
  "InteractionHand",
  "Vec3",
  "HolderLookup",
  "AdvancementHolder",
  "CriteriaTriggers",
  "GameTestHelper",
  "MobSpawnType",
  "PotionBrewing",
  "ContextAwarePredicate",
  "EnchantmentTarget",
  "EquipmentSlotGroup",
  "RegistryLookup",
  "ItemModelGenerators",
  "BlockModelGenerators",
  "ModelTemplates",
]);

const DISCLOSE_MARK = "### ⚠️ 映射口径：本档语料是 mojmap";

/** 取披露块正文（从标记行到下一个二级标题）。没有则空串。 */
function disclosureSection(text) {
  const start = text.indexOf(DISCLOSE_MARK);
  if (start < 0) return "";
  const rest = text.slice(start + DISCLOSE_MARK.length);
  const end = rest.search(/\n## /);
  return end < 0 ? rest : rest.slice(0, end);
}

function sqliteHas(platform, version, id) {
  const leg = mappingLeg(platform, version);
  return leg.usable && leg.ids.has(id);
}

function attestation(relPath) {
  const parts = relPath.split(/[\\/]/);
  const platform = parts[0];
  const version = parts[1];
  const abs = path.join(ROOT, relPath.replace(/\\/g, "/"));
  if (!fs.existsSync(abs)) return { missing: [`MISSING ${relPath}`] };
  const text = fs.readFileSync(abs, "utf8");
  const corpus = corpusBlob(platform, version);
  const leg = mappingLeg(platform, version);
  const said = disclosureSection(text);
  // 两条否决位先判（都在 MOJMAP 腿之前，避免 Fabric API 名被当成「未披露的 mojmap 名」）：
  //   ① 本篇自己声明的名字 = 作者定义，不是对外部 API 的引用
  //   ② Fabric API / loader 归属名单（按档切片，三来源；见 fapiVetoFor 的头注）
  const decl = declaredNames(text);
  // 只有 Fabric / Quilt 两平台有 Fabric API 这一说：forge 档若也去查 `data/fabric_<同版本号>`，
  // 就会拿 Fabric 的名单去否决 Forge 的名字（跨平台漏否决）。
  const NO_FAPI = { names: new Set(), unreadable: [], absent: [], counts: { roster: 0, api: 0, loader: 0, total: 0 } };
  const fapi = platform === "fabric" || platform === "quilt" ? fapiVetoFor(version) : NO_FAPI;
  // FAPI / loader 摘要件的**成员**否决位（方法与字段名；类名那一路在 fapi.names 里）
  const fapiMembers = platform === "fabric" ? fapiMemberVeto(version) : new Set();
  // 管辖权：这个名到底是不是 MC 生态的名（跨全仓 yarn ∪ FAPI ∪ loader ∪ mojmap 列）
  const universe = mcUniverse().set;
  const externalApis = platform === "fabric" ? externalApisOf(text) : [];
  const queue = [];
  const stats = {};
  const vetoed = { decl: 0, fapi: 0, member: 0, externalQueued: 0 };
  const bad = [];
  const seen = new Set();
  for (const { id, at } of idsOf(text, { scope: "fence", stats })) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (decl.has(id)) { vetoed.decl++; continue; }
    if (fapi.names.has(id)) { vetoed.fapi++; continue; }
    if (fapiMembers.has(id)) { vetoed.member++; continue; }
    // mojmap 独有名：语料命中也不算 —— 语料本身就是 mojmap 写的。必须在本文件的披露块里点名。
    // 判据是「映射腿有没有证出这个名字」，**不是**「映射腿能不能读」。旧写法 `leg.usable && …`
    // 让库缺失/损坏/零行时这道闸熄火 ⇒ 将文件挪走/清空库就能关掉执法，故反向写成 !(读通且有)。
    if (MOJMAP_ONLY.has(id) && !(leg.usable && leg.ids.has(id)) && !said.includes(`\`${id}\``)) {
      bad.push(
        `${relPath}:L${at} ${id}【MOJMAP-UNDISCLOSED】mojmap 名，本档 yarn 映射未证出该名字（映射腿状态 ${leg.state}）；` +
          `语料命中不算出处 ⇒ 文件须加「${DISCLOSE_MARK}」披露块`,
      );
      continue;
    }
    if (corpus.includes(id)) continue;
    if (leg.usable && leg.ids.has(id)) {
      // R2（2026-10-06）：嵌套尾段（tailOnly）以「本件限定同现」为放行凭证；裸尾段照红。
      // 独立类名不在 tailOnly 里（同名的非嵌套行会把它归入 plain），故真·独立类零影响。
      if (!leg.tailOnly.has(id) || qualifiedInText(text, id)) continue;
      // R1∩R2 归属优先（2026-10-06）：该名同时是「签收台账在册 ∧ 本件声明相符」的外部名时，
      // 归属（转队列人工审）赢过映射尾段判红——映射里恰有一条**无关的** `X$名` 嵌套行，不足以把
      // 已逐名签收的库名（真树例：1.21.11 Cloth Config 的 `ConfigEntry`）判成 MC 嵌套尾段。
      // 台账仍是逐名入账制，这里不放松 R1：没入账的外部名落到下面的普通红/未签收红，不静默。
      if (platform === "fabric" && externalApis.length) {
        const box = signoffLedger();
        if (box.missing) stats.signoffMissing ??= box.missing;
        const rec = box.data.get(id);
        if (rec && rec.slugs.some((s) => externalApis.includes(s))) {
          vetoed.externalQueued++;
          queue.push(`${relPath}\tL${at}\t${id}\t${crossPlatforms().get(id) ?? ""}`);
          continue;
        }
      }
      bad.push(
        `${relPath}:L${at} ${id}【嵌套尾段·无限定同现】本档映射只以 \`Outer$${id}\` 嵌套行在场，本件未同现限定形态（Outer.${id} / Outer$${id}）⇒ 裸尾段不放行（2026-10-06 R2；若确有独立类，须由本档语料/映射的独立行证出；若属外部库名，须入签收台账并在本件声明对应 slug）`,
      );
      continue;
    }
    // 管辖权分支：全仓 fabric 宇宙（yarn 三表 ∪ FAPI/loader 成员 ∪ official 尾段 ∪ MOJMAP_ONLY）都查无
    // ⇒ 这不是「用错版本的 MC 名」，是外部库/自造名。件内**显式声明**外部库、且该**名**在签收台账
    // （external-apis-signoff.tsv）以对应 slug 入账，才记账进 --queue（R1 逐名签收，2026-10-06）；
    // 未声明/未签收照旧红 —— 这条腿就是抓 `MonsterEntity` 这类「长得像 MC 的幻觉名」的，不得写成无条件放行。
    // ⚠ 只限 fabric：宇宙集是按 `data/fabric_*` 建的，拿它去红 forge/quilt 名是新执法面（不许）；
    //   且当本档映射腿不可用时，红文案仍带 leg.why —— 否则「零行库 / 库读不动」那两条既有的
    //   状态点名会被本分支的措辞吞掉，管辖权反而把状态披露降级成装饰（selftest 有臂钉这条）。
    if (platform === "fabric" && !universe.has(id)) {
      if (externalApis.length) {
        // R1（2026-10-06）：文件级开关 ⇒ 逐名签收。台账记有该**名**且其 slug 集与本件声明有交集
        // 才转队列；「声明过任意外部库」不再是任意外部名的放行凭证（堵白洗通道）。
        const box = signoffLedger();
        if (box.missing) stats.signoffMissing = box.missing; // 台账在场读不动/零行 ⇒ 点名信号（main 判红）
        const rec = box.data.get(id);
        if (rec && rec.slugs.some((s) => externalApis.includes(s))) {
          vetoed.externalQueued++;
          const cross = crossPlatforms().get(id) ?? "";
          queue.push(`${relPath}\tL${at}\t${id}\t${cross}`);
          continue;
        }
        bad.push(
          rec
            ? `${relPath}:L${at} ${id}【外部声明归属不符】签收台账记属 ${rec.slugs.join("/")}，本件声明 ${externalApis.join("/")} ⇒ 改正其一（2026-10-06 R1）`
            : `${relPath}:L${at} ${id}【外部名未签收】非 MC 宇宙名且件内声明了外部库，但该**名**不在签收台账（external-apis-signoff.tsv）⇒ 新外部符号须先入账（name⇐slugs⇐basis⇐签收日）再件内声明对应 slug；未入账即红——这条就是堵住「文件级开关白洗」的腿（2026-10-06 R1）${leg.usable ? "" : `；本档映射腿状态：${leg.why}`}`,
        );
        continue;
      }
      bad.push(
        `${relPath}:L${at} ${id}【非MC宇宙名·未声明外部库】该名字在本仓全部 fabric 档的 yarn 映射、` +
          `FAPI/loader 摘要成员与 mojmap 对照列均查无 ⇒ 属外部库/自造名；库类 Skill 须加 ` +
          `frontmatter externalApis: [...] 或 <!-- external-apis: ... --> 声明（声明后逐条进 --queue 人工审），` +
          `自造示例常量则按现行惯例在同行加「本件自造…没有任何 MC 符号出处」负例注记${
            leg.usable ? "" : `；本档映射腿状态：${leg.why}` /* 保留状态措辞，见上方 ⚠ */
          }`,
      );
      continue;
    }
    bad.push(`${relPath}:L${at} ${id}${leg.usable ? "" : `（${leg.why}）`}`);
  }
  return { bad, queue, leg, vetoed, fapiIo: fapi.unreadable.map((v) => `${v}`), stats };
}

function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-attest-selftest-"));
  setRoot(tmp);
  // hermetic（同规则门的 SELFTEST_FAPI_DIR）：合成夹具不得被仓库真 fabric-api 名单静默否决 ——
  // 名单里含 ClientModInitializer / ParticleFactoryRegistry 这类高频名，将来谁拿它们做「本该红」
  // 的夹具，会被一条与夹具无关的仓库数据悄悄压绿。主入口不切（真跑要真名单）。
  fapiSumDir = path.join(tmp, "no-fapi-summaries-here");
  // ③ 同理：loader 摘要件（14 档已入库）里就有 ClientModInitializer / Environment / EnvType，
  // 不切干净的话「本该红」的夹具会被仓库真名单压绿 ⇒ 这条腿就成了没人在跑的装饰。
  loaderSumDir = path.join(tmp, "no-loader-summaries-here");
  const pack = path.join(tmp, "data", "fabric_1.21.11", "mappings");
  fs.mkdirSync(pack, { recursive: true });
  fs.mkdirSync(path.join(tmp, "data", "fabric_1.21.11", "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "data", "fabric_1.21.11", "docs", "page.md"),
    "本页出现 StatusEffect 与 GoalSelector 两个名字。\n",
  );
  // (d) 闸的夹具：语料本身就是 mojmap 写的（真实档的 fabric-docs / reference 就是这样）。
  // 必须在任何 attestation() 之前落盘 —— corpusBlob 首次读后会缓存整包。
  fs.writeFileSync(
    path.join(tmp, "data", "fabric_1.21.11", "docs", "mojmap-page.md"),
    "本页示例代码 extends MobEffect —— 上游 fabric-docs 就是 mojmap 写法。\n",
  );
  const db = new DatabaseSync(path.join(pack, "yarn-mappings.sqlite"));
  db.exec(
    "create table meta (key text primary key, value text);" +
      "create table classes (named text, intermediary text, official text);" +
      "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
      "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
  );
  db.prepare("insert into meta values ('mappingEra',?)").run("yarn-tiny");
  db.prepare("insert into classes values (?,?,?)").run("net/minecraft/entity/ai/goal/Goal", "class_1313", "a");
  db.prepare("insert into methods values (?,?,?,?,?,?)").run(
    "net/minecraft/entity/LivingEntity",
    "getGoalSelector",
    "()Lnet/minecraft/entity/ai/goal/GoalSelector;",
    "a",
    "()Lnet/minecraft/entity/ai/goal/GoalSelector;",
    "method_5831",
  );
  // 两腿批载体：嵌套类行 —— 采集侧从 `SpawnRestriction.Location` 切出 `Location`，
  // 腿侧按 `$` 取最内尾段才放行（管辖⑦绿侧）；`GhostInner` 永不登记 ⇒ 同臂反证不熄火。
  db.prepare("insert into classes values (?,?,?)").run("net/minecraft/entity/spawn/SpawnRestriction$Location", "class_1255$class_1256", "a$a");
  // R1∩R2 归属优先臂的载体（2026-10-06）：`ConfigCategory` 在夹具映射**只**以嵌套行在场（tailOnly），
  // 台账在册（signoff-jur）且跨平台夹具命中 forge ⇒ 跨平台臂必须走「归属赢过尾段」转队列，
  // 而不是尾段红。删掉 attestation 里的归属回退 ⇒ 该臂翻红（投毒必红腿）。
  db.prepare("insert into classes values (?,?,?)").run("net/example/Signed$ConfigCategory", "class_9001$class_9002", "b$b");
  db.close();

  // 磁盘实况复刻①：data/forge_*/mappings/yarn-mappings.sqlite 装的是 forge-srg 名，不是 yarn
  const forgePack = path.join(tmp, "data", "forge_1.12.2", "mappings");
  fs.mkdirSync(forgePack, { recursive: true });
  fs.mkdirSync(path.join(tmp, "data", "forge_1.12.2", "docs"), { recursive: true });
  const srg = new DatabaseSync(path.join(forgePack, "yarn-mappings.sqlite"));
  srg.exec(
    "create table meta (key text primary key, value text);" +
      "create table classes (named text, intermediary text, official text);" +
      "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
      "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
  );
  srg.prepare("insert into meta values ('mappingEra',?)").run("forge-srg");
  srg.prepare("insert into classes values (?,?,?)").run("net/minecraft/item/ItemStack", "net/minecraft/item/ItemStack", "aip");
  srg.close();

  // 磁盘实况复刻②：yarn-tiny 但三张主表零行（data/forge_1.14.4 那种空转库的 yarn 版本）
  const emptyPack = path.join(tmp, "data", "fabric_1.20.1", "mappings");
  fs.mkdirSync(emptyPack, { recursive: true });
  fs.mkdirSync(path.join(tmp, "data", "fabric_1.20.1", "docs"), { recursive: true });
  const empty = new DatabaseSync(path.join(emptyPack, "yarn-mappings.sqlite"));
  empty.exec(
    "create table meta (key text primary key, value text);" +
      "create table classes (named text, intermediary text, official text);" +
      "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
      "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
  );
  empty.prepare("insert into meta values ('mappingEra',?)").run("yarn-tiny");
  empty.close();

  // ── 管辖权夹具的「宇宙载体」：另一档有、被检档没有的 MC 名（Monster）。
  // mcUniverse() 在**首次 attestation()** 时按当时磁盘上的 data/fabric_* 建集并缓存（setRoot 才失效），
  // 所以这份库必须落在首次 attestation 之前；名字只进 1.20.4 ⇒ 它在宇宙里、却不在被检的
  // fabric/1.21.11 语料/映射里 ⇒ 正是「别档有本档无 = 真·逐版泄漏，必须红」那一族，
  // 用来证明 externalApis 声明**洗不掉**宇宙名（设计头注的 MonsterEntity 幻觉名机读版）。
  const otherPack = path.join(tmp, "data", "fabric_1.20.4", "mappings");
  fs.mkdirSync(otherPack, { recursive: true });
  const other = new DatabaseSync(path.join(otherPack, "yarn-mappings.sqlite"));
  other.exec(
    "create table meta (key text primary key, value text);" +
      "create table classes (named text, intermediary text, official text);" +
      "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
      "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
  );
  other.prepare("insert into meta values ('mappingEra',?)").run("yarn-tiny");
  other.prepare("insert into classes values (?,?,?)").run("net/minecraft/entity/monster/Monster", "class_1635", "net/minecraft/world/entity/Monster");
  other.close();

  const skillDir = path.join(tmp, "fabric", "1.21.11", ".cursor", "skills", "mc-ai");
  fs.mkdirSync(skillDir, { recursive: true });
  const good = path.join(skillDir, "GOOD.md");
  const poison = path.join(skillDir, "POISON.md");
  fs.writeFileSync(
    good,
    "---\nname: mc-ai\n---\n\n```java\nGoalSelector selector = entity.getGoalSelector();\nStatusEffect effect = null;\n```\n\n`Goal` 由映射证实存在；`MobEffect` 本档未核实、禁止写。\n",
  );
  fs.writeFileSync(poison, "---\nname: mc-ai\n---\n\n```java\nMobEffectInstance fake = new MobEffectInstance();\n```\n");

  const cases = [];
  const g = attestation(path.relative(tmp, good).replace(/\\/g, "/"));
  cases.push(["绿档应零违规", g.bad.length === 0, true]);
  const p = attestation(path.relative(tmp, poison).replace(/\\/g, "/"));
  cases.push(["投毒必红（不存在的 Yarn 名）", p.bad.length === 1, true]);
  cases.push(["投毒抓的是 MobEffectInstance", /MobEffectInstance/.test(p.bad[0] || ""), true]);
  const noCorpus = attestation("fabric/1.21.11/.cursor/skills/nope/NOPE.md");
  cases.push(["不存在的文件要报 MISSING", Boolean(noCorpus.missing), true]);

  // 时代闸：forge-srg 的同名 sqlite 不得被当 yarn 出处（否则门会替 mojmap/MCP 名背书）
  const forgeDir = path.join(tmp, "forge", "1.12.2", ".cursor", "skills", "mc-item");
  fs.mkdirSync(forgeDir, { recursive: true });
  const forgeSkill = path.join(forgeDir, "SRG.md");
  fs.writeFileSync(forgeSkill, "---\nname: mc-item\n---\n\n```java\nItemStack s = null;\nNeverSeenAnywhere x = null;\n```\n");
  const eraLeg = mappingLeg("forge", "1.12.2");
  cases.push(["forge-srg 库的映射腿必须关掉", eraLeg.usable === false && /forge-srg/.test(eraLeg.why), true]);
  const fg = attestation(path.relative(tmp, forgeSkill).replace(/\\/g, "/"));
  cases.push(["forge-srg 档投毒仍要红（两个名都无出处）", fg.bad.length === 2, true]);

  // 空转库闸：yarn-tiny 但零行 ⇒ 映射腿关掉，且报的正是"零行"
  const emptyDir = path.join(tmp, "fabric", "1.20.1", ".cursor", "skills", "mc-block");
  fs.mkdirSync(emptyDir, { recursive: true });
  const emptySkill = path.join(emptyDir, "ZERO.md");
  fs.writeFileSync(emptySkill, "---\nname: mc-block\n---\n\n```java\nBlockPos p = null;\n```\n");
  const emptyLeg = mappingLeg("fabric", "1.20.1");
  cases.push(["零行 yarn 库的映射腿必须关掉", emptyLeg.usable === false && /零行/.test(emptyLeg.why), true]);
  const ez = attestation(path.relative(tmp, emptySkill).replace(/\\/g, "/"));
  cases.push(["零行库投毒仍要红", ez.bad.length === 1 && /零行/.test(ez.bad[0]), true]);

  // (d) mojmap 独有名闸：语料本身就是 mojmap ⇒ 语料命中不得替 mojmap 名背书，必须披露
  const raw = path.join(skillDir, "MOJI.md");
  fs.writeFileSync(raw, "---\nname: mc-effect\n---\n\n```java\nMobEffect effect = null;\n```\n");
  const m = attestation(path.relative(tmp, raw).replace(/\\/g, "/"));
  cases.push(["mojmap 名即使语料命中也要红", m.bad.length === 1 && /MOJMAP-UNDISCLOSED/.test(m.bad[0]), true]);
  const ok = path.join(skillDir, "MOJI_OK.md");
  fs.writeFileSync(
    ok,
    "---\nname: mc-effect\n---\n\n```java\nMobEffect effect = null;\n```\n\n### ⚠️ 映射口径：本档语料是 mojmap\n\n| 语料里的 mojmap 名 | Yarn 对应名 | 依据 |\n| --- | --- | --- |\n| `MobEffect` | `StatusEffect` | 本档 sqlite 有该类 |\n",
  );
  const mo = attestation(path.relative(tmp, ok).replace(/\\/g, "/"));
  cases.push(["披露块点名后即可放行", mo.bad.length === 0, true]);

  // ── C1① 夹具：库**存在但读不动**（磁盘损坏 / 被人清空挪走 / 压根不是 sqlite）。
  // 旧写法在这三种情形把 (d) 否决腿熄火 ⇒ 门比库完好时**更绿**，投毒者只要毁库就能关执法。
  const corruptPack = path.join(tmp, "data", "fabric_1.21.4", "mappings");
  fs.mkdirSync(corruptPack, { recursive: true });
  fs.mkdirSync(path.join(tmp, "data", "fabric_1.21.4", "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "data", "fabric_1.21.4", "docs", "mojmap-page.md"),
    "本页示例代码 extends MobEffect —— 上游 fabric-docs 就是 mojmap 写法。\n",
  );
  fs.writeFileSync(path.join(corruptPack, "yarn-mappings.sqlite"), "这不是 sqlite，是投毒用的垃圾字节。\n");
  const corruptDir = path.join(tmp, "fabric", "1.21.4", ".cursor", "skills", "mc-effect");
  fs.mkdirSync(corruptDir, { recursive: true });
  const DISCLOSED_BODY =
    "---\nname: mc-effect\n---\n\n```java\nMobEffect effect = null;\n```\n\n### ⚠️ 映射口径：本档语料是 mojmap\n\n| 语料里的 mojmap 名 | Yarn 对应名 | 依据 |\n| --- | --- | --- |\n| `MobEffect` | `StatusEffect` | 本档 sqlite 有该类 |\n";
  fs.writeFileSync(path.join(corruptDir, "CORRUPT.md"), "---\nname: mc-effect\n---\n\n```java\nMobEffect effect = null;\n```\n");
  fs.writeFileSync(path.join(corruptDir, "CORRUPT_OK.md"), DISCLOSED_BODY);
  const corruptLeg = mappingLeg("fabric", "1.21.4");
  cases.push(["读不动的库 state 必须是 unreadable（不得混进 era / absent）", corruptLeg.state === "unreadable", true]);
  const cAtt = attestation(path.relative(tmp, path.join(corruptDir, "CORRUPT.md")).replace(/\\/g, "/"));
  cases.push([
    "库读不动时 (d) mojmap 否决腿不得熄火",
    cAtt.bad.length === 1 && /MOJMAP-UNDISCLOSED/.test(cAtt.bad[0]) && /unreadable/.test(cAtt.bad[0]),
    true,
  ]);

  // 主门层面（子进程，跑的是真退出码）：毁库 ⇒ rc=1 且点名 SQLITE-UNREADABLE；
  // 同一份正文换到库完好的档 ⇒ rc=0 —— 这条正控证明"红"只归因于读不动，不是夹具本身构造错。
  const listFile = path.join(tmp, "list.txt");
  const gateSrc = fileURLToPath(import.meta.url);
  const runGate = (entry, extraEnv = {}) => {
    fs.writeFileSync(listFile, `${entry}\n`);
    return spawnSync(process.execPath, [gateSrc], {
      env: { ...process.env, MC_SKILL_YARN_ATTEST_ROOT: tmp, MC_SKILL_YARN_ATTEST_LIST: listFile, ...extraEnv },
      encoding: "utf8",
      timeout: 120_000,
    });
  };
  const rCorrupt = runGate("fabric/1.21.4/.cursor/skills/mc-effect/CORRUPT_OK.md");
  cases.push([
    "库读不动 ⇒ 主门 rc=1 并点名 SQLITE-UNREADABLE（正文本身已披露，红只归因于库）",
    rCorrupt.status === 1 && /SQLITE-UNREADABLE/.test(rCorrupt.stderr || ""),
    true,
  ]);
  const healthyPack = path.join(tmp, "data", "fabric_1.21.6", "mappings");
  fs.mkdirSync(healthyPack, { recursive: true });
  fs.mkdirSync(path.join(tmp, "data", "fabric_1.21.6", "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "data", "fabric_1.21.6", "docs", "mojmap-page.md"),
    "本页示例代码 extends MobEffect —— 上游 fabric-docs 就是 mojmap 写法。\n",
  );
  const healthy = new DatabaseSync(path.join(healthyPack, "yarn-mappings.sqlite"));
  healthy.exec(
    "create table meta (key text primary key, value text);" +
      "create table classes (named text, intermediary text, official text);" +
      "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
      "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
  );
  healthy.prepare("insert into meta values ('mappingEra',?)").run("yarn-tiny");
  healthy.prepare("insert into classes values (?,?,?)").run("net/minecraft/entity/LivingEntity", "class_1308", "a");
  healthy.close();
  const healthyDir = path.join(tmp, "fabric", "1.21.6", ".cursor", "skills", "mc-effect");
  fs.mkdirSync(healthyDir, { recursive: true });
  fs.writeFileSync(path.join(healthyDir, "HEALTHY_OK.md"), DISCLOSED_BODY);
  const rHealthy = runGate("fabric/1.21.6/.cursor/skills/mc-effect/HEALTHY_OK.md");
  cases.push(["同一份正文 + 库完好 ⇒ rc=0（正控，证明上一条的红只来自 unreadable）", rHealthy.status === 0, true]);

  // --pack 探针的判词必须与 attestation() 同口径：技能正文里那些「自查结果（--pack=…）」
  // 是人和 AI 都会照抄的一行，若它把 mojmap 名印成"可用"，就等于门自己教错。
  const probe = spawnSync(
    process.execPath,
    [gateSrc, "--pack=fabric_1.21.11", "--names=Goal,StatusEffect,MobEffect,NeverSeenAnywhere"],
    {
      env: { ...process.env, MC_SKILL_YARN_ATTEST_ROOT: tmp },
      encoding: "utf8",
      timeout: 120_000,
    },
  );
  const probeOut = probe.stdout || "";
  const probeRow = (name) => {
    const m = new RegExp(`^\\s*${name}\\s+语料[✓·]\\s+映射[✓·] ⇒ .+$`, "m").exec(probeOut);
    return m ? m[0] : "";
  };
  cases.push([
    "--pack 探针四态齐发：映射证出 / 仅语料弱出处 / mojmap 需披露 / 无出处（不得塌成两态）",
    /Goal\s+语料[✓·]\s+映射✓ ⇒ 可用（映射证出）/.test(probeRow("Goal")) &&
      /StatusEffect\s+语料✓\s+映射· ⇒ 弱出处/.test(probeRow("StatusEffect")) &&
      /MobEffect.*⇒ 需披露/.test(probeRow("MobEffect")) &&
      /NeverSeenAnywhere.*⇒ 无出处/.test(probeRow("NeverSeenAnywhere")),
    true,
  ]);

  // ── C1② 夹具：语料侧的**注释行**不算出处。上游页里被注释掉的旧代码、javadoc 续行、
  // `<!-- -->` 说明段都可能留着早已失效的类名，旧写法 `corpus.includes(id)` 一视同仁。
  const cmtPack = path.join(tmp, "data", "fabric_1.21.7", "mappings");
  fs.mkdirSync(cmtPack, { recursive: true });
  fs.mkdirSync(path.join(tmp, "data", "fabric_1.21.7", "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "data", "fabric_1.21.7", "docs", "comments.md"),
    "// CommentOnlyType 是被注释掉的旧示例\n<!-- CommentHtmlType 在 HTML 注释里 -->\nLiveOnlyType 出现在正文里。\n",
  );
  const cmtDb = new DatabaseSync(path.join(cmtPack, "yarn-mappings.sqlite"));
  cmtDb.exec(
    "create table meta (key text primary key, value text);" +
      "create table classes (named text, intermediary text, official text);" +
      "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
      "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
  );
  cmtDb.prepare("insert into meta values ('mappingEra',?)").run("yarn-tiny");
  cmtDb.prepare("insert into classes values (?,?,?)").run("net/minecraft/entity/ai/goal/Goal", "class_1313", "a");
  cmtDb.close();
  const cmtDir = path.join(tmp, "fabric", "1.21.7", ".cursor", "skills", "mc-cmt");
  fs.mkdirSync(cmtDir, { recursive: true });
  const cRed = path.join(cmtDir, "CMT_RED.md");
  fs.writeFileSync(cRed, "---\nname: mc-cmt\n---\n\n```java\nCommentOnlyType a = null;\n```\n");
  const cRedHtml = path.join(cmtDir, "CMT_HTML_RED.md");
  fs.writeFileSync(cRedHtml, "---\nname: mc-cmt\n---\n\n```java\nCommentHtmlType a = null;\n```\n");
  const cGreen = path.join(cmtDir, "CMT_GREEN.md");
  fs.writeFileSync(cGreen, "---\nname: mc-cmt\n---\n\n```java\nLiveOnlyType a = null;\n```\n");
  const cr = attestation(path.relative(tmp, cRed).replace(/\\/g, "/"));
  cases.push(["只命中语料注释行的名字要红", cr.bad.length === 1 && /CommentOnlyType/.test(cr.bad[0]), true]);
  const crh = attestation(path.relative(tmp, cRedHtml).replace(/\\/g, "/"));
  cases.push(["只命中语料 HTML 注释的名字要红", crh.bad.length === 1 && /CommentHtmlType/.test(crh.bad[0]), true]);
  const cg = attestation(path.relative(tmp, cGreen).replace(/\\/g, "/"));
  cases.push(["语料正文（非注释行）仍算出处（正控）", cg.bad.length === 0, true]);

  // ── 来源③（fabric-loader 摘要件）三臂：这是 2026-09-28 补的那一颗缺口。
  // 为什么单独成组：`ClientModInitializer` 既不在本档 yarn 映射（那是 vanilla 表）、也不在语料 FQCN
  // 与 fabric-api 摘要里 ⇒ 前两路都挡不住，正规入口点写法必红。摘掉 ③ 就回到红 = 承重证明；
  // 另配「在盘但读不动 ⇒ rc=1 并点名」与「件有效 ⇒ rc=0 正控」两臂（同 ② 的形状）。
  const loaderDir = path.join(tmp, "loader-sums-3");
  fs.mkdirSync(loaderDir, { recursive: true });
  fs.writeFileSync(
    path.join(loaderDir, "1.21.9-fabric.json"),
    JSON.stringify({
      key: "1.21.9-fabric",
      platform: "fabric",
      minecraftVersion: "1.21.9",
      classes: [
        { fqcn: "net.fabricmc.api.ClientModInitializer", simpleName: "ClientModInitializer" },
        { fqcn: "net.fabricmc.fabric.api.particle.v1.FabricParticleTypes", simpleName: "FabricParticleTypes" },
      ],
    }),
    "utf8",
  );
  const ldrSkill = path.join(tmp, "fabric", "1.21.9", ".cursor", "skills", "mc-particle");
  fs.mkdirSync(ldrSkill, { recursive: true });
  fs.writeFileSync(
    path.join(ldrSkill, "LOADER_VETO.md"),
    "---\nname: mc-particle\n---\n\n```java\npublic class Entry implements ClientModInitializer {\n}\n```\n",
    "utf8",
  );
  const ldrRel = path.relative(tmp, path.join(ldrSkill, "LOADER_VETO.md")).replace(/\\/g, "/");
  loaderSumDir = loaderDir;
  fapiVetoCache.clear();
  const withLoader = attestation(ldrRel);
  loaderSumDir = path.join(tmp, "no-loader-summaries-here");
  fapiVetoCache.clear();
  const withoutLoader = attestation(ldrRel);
  cases.push([
    "来源③ 在册 ⇒ loader 类名被否决（同一份正文，只差那件摘要）",
    withLoader.bad.length === 0,
    true,
  ]);
  cases.push([
    "来源③ 摘掉 ⇒ 同一条回到红并点名 ClientModInitializer（证它承重，不是装饰）",
    withoutLoader.bad.length === 1 && /ClientModInitializer/.test(withoutLoader.bad[0]),
    true,
  ]);
  // ③ 读不动 ⇒ 记账进 unreadable（不得塌成「该档没有 loader 名」）。
  // ⚠ 方向要指回**有件的那份目录**：上一条把 loaderSumDir 切回了不存在的目录，那里是
  // 「absent（整目录缺席）」不是「unreadable（在盘但读不动）」—— 这两个形状下面两条臂正是要分开的。
  loaderSumDir = loaderDir;
  fs.writeFileSync(path.join(loaderDir, "1.21.9-fabric.json"), "{ this is not json", "utf8");
  fapiVetoCache.clear();
  const ldrIo = fapiVetoFor("1.21.9");
  cases.push([
    "③ 件在盘但解析失败 ⇒ unreadable 记 fabric-loader:1.21.9 且名单塌空",
    (ldrIo.unreadable ?? []).includes("fabric-loader:1.21.9") && !ldrIo.names.has("ClientModInitializer"),
    true,
  ]);
  // 主门层面（子进程跑真退出码）：③ 读不动 ⇒ rc=1 + 【LOADER-SUMMARY-UNREADABLE】；件修好 ⇒ rc=0。
  const runGateWithSums = (sumDir) => runGate("fabric/1.21.9/.cursor/skills/mc-particle/LOADER_VETO.md", {
    MC_SKILL_YARN_ATTEST_LOADER_SUMMARIES: sumDir,
  });
  const rLdrIo = runGateWithSums(loaderDir);
  cases.push([
    "③ 读不动 ⇒ 主门 rc=1 并点名 LOADER-SUMMARY-UNREADABLE",
    rLdrIo.status === 1 && /LOADER-SUMMARY-UNREADABLE/.test(rLdrIo.stderr || ""),
    true,
  ]);
  fs.writeFileSync(
    path.join(loaderDir, "1.21.9-fabric.json"),
    JSON.stringify({ classes: [{ fqcn: "net.fabricmc.api.ClientModInitializer", simpleName: "ClientModInitializer" }] }),
    "utf8",
  );
  const rLdrOk = runGateWithSums(loaderDir);
  cases.push(["同一份正文 + ③ 有效 ⇒ rc=0（正控：上一条的红只来自读不动，不是夹具构造错）", rLdrOk.status === 0, true]);
  const rLdrAbsent = runGateWithSums(path.join(tmp, "no-loader-summaries-here"));
  cases.push([
    "③ 整目录缺席 ⇒ 不判红（缺席≠读不动），但那条名字回到红 rc=1",
    rLdrAbsent.status === 1 && !/LOADER-SUMMARY-UNREADABLE/.test(rLdrAbsent.stderr || "") && /ClientModInitializer/.test(rLdrAbsent.stderr || ""),
    true,
  ]);
  loaderSumDir = path.join(tmp, "no-loader-summaries-here");
  fapiVetoCache.clear();

  // ── 管辖权（2026-10-06 批）五臂：外部名不得静默放行、宇宙名不得被声明白洗、非 JVM 围栏不采、
  // 分支只吃 fabric。宇宙集在本进程首次 attestation 时已按夹具数据定型（含 Monster 载体，见上）。
  const jurDir = path.join(tmp, "fabric", "1.21.11", ".cursor", "skills", "mc-jur");
  fs.mkdirSync(jurDir, { recursive: true });
  const jurRel = (name) => `fabric/1.21.11/.cursor/skills/mc-jur/${name}`;
  // R1 台账夹具（2026-10-06）：管辖② 与跨平台臂要求**名**在签收台账入账 —— 「件内声明过外部库」
  // 本身不再是放行凭证。台账指到合成的 tmp 件，不指仓库真台账（selftest 的 hermetic 同 fapi/loader 面）。
  const jurLedger = path.join(tmp, "signoff-jur.tsv");
  fs.writeFileSync(
    jurLedger,
    [
      "name\tslugs\tbasis\tasof",
      "ClothConfigApi\tcloth-config\t夹具：虚构的 Cloth Config API 类名\t2026-10-06",
      "ConfigCategory\tcloth-config\t夹具：Cloth Config 配置类目（跨平台臂载体）\t2026-10-06",
    ].join("\n") + "\n",
    "utf8",
  );
  ledgerPath = jurLedger;
  resetExternalLegs();
  // ① 未声明 + 全夹具宇宙查无 ⇒ 【非MC宇宙名】红（这条腿就是抓幻觉名的，不得写成无条件放行）
  fs.writeFileSync(path.join(jurDir, "JUR_UNDECLARED.md"), "---\nname: mc-jur\n---\n\n```java\nClothConfigApi a = null;\n```\n");
  const ju = attestation(jurRel("JUR_UNDECLARED.md"));
  cases.push(["管辖① 未声明的非宇宙名红且点名【非MC宇宙名】", ju.bad.length === 1 && /ClothConfigApi/.test(ju.bad[0]) && /非MC宇宙名/.test(ju.bad[0]), true]);
  // ② 同名 + frontmatter 声明 + **台账在册** ⇒ 不红、逐条进队列（externalQueued 记账；队列是给人审的，不是放行凭证）
  fs.writeFileSync(path.join(jurDir, "JUR_DECLARED.md"), "---\nname: mc-jur\nexternalApis: [cloth-config]\n---\n\n```java\nClothConfigApi a = null;\n```\n");
  const jd = attestation(jurRel("JUR_DECLARED.md"));
  cases.push([
    "管辖② 声明+台账在册同名转队列不判红（bad=0、queue 恰含该行、externalQueued=1）",
    jd.bad.length === 0 && (jd.vetoed?.externalQueued ?? 0) === 1 && (jd.queue?.length ?? -1) === 1 && /ClothConfigApi/.test(jd.queue?.[0] ?? ""),
    true,
  ]);
  // ②b R1 投毒臂（2026-10-06）：件声明了 cloth-config，但夹带的名字**不在台账** ⇒ 必须红
  //    【外部名未签收】——从前文件级开关会把任意编造名静默转进「待人工审 = 没人读」的队列。
  fs.writeFileSync(path.join(jurDir, "JUR_FAKE.md"), "---\nname: mc-jur\nexternalApis: [cloth-config]\n---\n\n```java\nTotallyFabricatedThing x = null;\n```\n");
  const jf2 = attestation(jurRel("JUR_FAKE.md"));
  cases.push(["管辖②b 声明外部库+名未入台账 ⇒ 红【外部名未签收】（白洗通道被逐名签收堵住）", jf2.bad.length === 1 && /TotallyFabricatedThing/.test(jf2.bad[0]) && /外部名未签收/.test(jf2.bad[0]), true]);
  // ②c R1 归属臂：名在台账但记属别家 slug（cloth-config），本件声明 jdk ⇒ 红【外部声明归属不符】。
  fs.writeFileSync(path.join(jurDir, "JUR_MISMATCH.md"), "---\nname: mc-jur\nexternalApis: [jdk]\n---\n\n```java\nClothConfigApi a = null;\n```\n");
  const jm = attestation(jurRel("JUR_MISMATCH.md"));
  cases.push(["管辖②c 名记属他 slug、本件声明不符 ⇒ 红【外部声明归属不符】", jm.bad.length === 1 && /ClothConfigApi/.test(jm.bad[0]) && /外部声明归属不符/.test(jm.bad[0]), true]);
  // ③ 设计头注承诺「MonsterEntity 类幻觉名照旧抓」的机读版：宇宙在场（别档有本档无）的名字
  //    **即便文件声明了 externalApis** 也必须红，且红文案是**普通红**、不带【非MC宇宙名】——
  //    拿声明白洗 MC 名 = 本臂要拦的原罪。
  fs.writeFileSync(path.join(jurDir, "JUR_UNIVERSE.md"), "---\nname: mc-jur\nexternalApis: [cloth-config]\n---\n\n```java\nMonster m = null;\n```\n");
  const jw = attestation(jurRel("JUR_UNIVERSE.md"));
  cases.push(["管辖③ 宇宙名（夹具他档载体 Monster）声明 externalApis 仍普通红、不得带【非MC宇宙名】", jw.bad.length === 1 && /Monster/.test(jw.bad[0]) && !/非MC宇宙名/.test(jw.bad[0]), true]);
  // ④ 非 JVM 围栏不采 id：同一名字在 ~~~ 与 ```gradle 围栏里不红，放进 ```java 围栏才红；
  //    跳过的行数必须在 stats 里可数（「围栏没采」与「围栏里根本没有名字」要能在输出上区分）。
  fs.writeFileSync(
    path.join(jurDir, "JUR_FENCE.md"),
    "---\nname: mc-jur\n---\n\n~~~\nLoomApiThing a\n~~~\n\n```gradle\nLoomApiThing b = mavenCentral()\n```\n\n```java\nLoomApiThing c = null;\n```\n",
  );
  const jf = attestation(jurRel("JUR_FENCE.md"));
  cases.push(["管辖④ ~~~/gradle 围栏不采（红只来自 java 围栏那行），fenceSkippedLines>0", jf.bad.length === 1 && /LoomApiThing/.test(jf.bad[0]) && (jf.stats?.fenceSkippedLines ?? 0) > 0, true]);
  // ⑤⑥ 分支只限 fabric：forge/quilt 的「宇宙查无 + 声明」走旧路 —— 红，但**不得**带【非MC宇宙名】
  //    （宇宙集按 data/fabric_* 建，拿它去红别平台的名是新执法面；行为必须逐字不变）。
  fs.writeFileSync(
    path.join(tmp, "forge", "1.12.2", ".cursor", "skills", "mc-item", "SRG_EXT.md"),
    "---\nname: mc-item\nexternalApis: [witchery]\n---\n\n```java\nWitcheryMod w = null;\n```\n",
    "utf8",
  );
  const je = attestation("forge/1.12.2/.cursor/skills/mc-item/SRG_EXT.md");
  cases.push(["管辖⑤ forge 非宇宙名+声明 ⇒ 旧普通红（文案无【非MC宇宙名】）", je.bad.length === 1 && /WitcheryMod/.test(je.bad[0]) && !/非MC宇宙名/.test(je.bad[0]), true]);
  const quiltDir = path.join(tmp, "quilt", "1.21.11", ".cursor", "skills", "mc-jur");
  fs.mkdirSync(quiltDir, { recursive: true });
  fs.writeFileSync(
    path.join(quiltDir, "QJT_EXT.md"),
    "---\nname: mc-jur\nexternalApis: [qsl-config]\n---\n\n```java\nQuiltismThing q = null;\n```\n",
    "utf8",
  );
  const jq = attestation("quilt/1.21.11/.cursor/skills/mc-jur/QJT_EXT.md");
  cases.push(["管辖⑥ quilt 非宇宙名+声明 ⇒ 旧普通红（分支只吃 fabric，quilt 行为逐字不变）", jq.bad.length === 1 && /QuiltismThing/.test(jq.bad[0]) && !/非MC宇宙名/.test(jq.bad[0]), true]);

  // ── R1 台账失效臂（2026-10-06）：台账被清空（只剩注释 ⇒ 零行）⇒ 已声明的名**不放行**
  // （红【外部名未签收】），且 stats.signoffMissing 点名零行 —— main() 据此判【SIGNOFF-MISSING】红。
  // 「清空台账 = 关掉执法」在这条腿上塌掉：数据面已红，点名腿再给原因（SQLITE-UNREADABLE 同族）。
  const emptyLedger = path.join(tmp, "signoff-zero-row.tsv");
  fs.writeFileSync(emptyLedger, "# 只有注释\n", "utf8");
  ledgerPath = emptyLedger;
  resetExternalLegs();
  const jzl = attestation(jurRel("JUR_DECLARED.md"));
  cases.push([
    "台账零行 ⇒ 声明名不放行（红【外部名未签收】）且 stats.signoffMissing 点名零行",
    jzl.bad.length === 1 && /外部名未签收/.test(jzl.bad[0]) && /零行/.test(jzl.stats?.signoffMissing ?? ""),
    true,
  ]);
  ledgerPath = jurLedger;
  resetExternalLegs();

  // ── R1b 跨平台打标 + R1∩R2 归属优先臂（2026-10-06）：`ConfigCategory` 在夹具映射只以
  // `Signed$ConfigCategory` 嵌套行在场（tailOnly，裸用无限定同现）——若只看映射尾段，R2 会判红；
  // 名同时在台账在册 ∧ 本件声明 cloth-config ⇒ **归属（转队列人工审）赢过尾段红**，且命中
  // forge loader 摘要 ⇒ 队列第 4 列 = `forge`（打标供签收人识别跨加载器库泄漏；不判红——
  // Mixin 这类合法共用件不得误杀）。摘掉归属回退 ⇒ 本臂翻红。摘要目录切到合成夹具，
  // 与 hermetic loader 面同一手法。
  const crossDir = path.join(tmp, "cross-sums");
  fs.mkdirSync(crossDir, { recursive: true });
  fs.writeFileSync(path.join(crossDir, "1.20.1-forge.json"), JSON.stringify({ classes: [{ fqcn: "net.example.cfg.ConfigCategory" }] }), "utf8");
  fs.writeFileSync(path.join(crossDir, "1.20.1-neoforge.json"), JSON.stringify({ classes: [{ fqcn: "net.other.cfg.UnrelatedThing" }] }), "utf8");
  loaderSumDir = crossDir;
  resetExternalLegs();
  fs.writeFileSync(path.join(jurDir, "JUR_CROSS.md"), "---\nname: mc-jur\nexternalApis: [cloth-config]\n---\n\n```java\nConfigCategory c = null;\n```\n");
  const jcr = attestation(jurRel("JUR_CROSS.md"));
  cases.push([
    "R1b 打标 + R1∩R2 归属赢过尾段：tailOnly 名（台账在册+声明相符）不红、queue 第 4 列 = forge",
    jcr.bad.length === 0 && (jcr.queue?.length ?? 0) === 1 && (jcr.queue?.[0] ?? "").split("\t")[3] === "forge",
    true,
  ]);
  loaderSumDir = path.join(tmp, "no-loader-summaries-here");
  resetExternalLegs();

  // ── 两腿批（2026-10-06）：嵌套类最内尾段 + 形参名声明位。
  // ⑦ `Location` 在夹具 1.21.11 以 `SpawnRestriction$Location` 类行在场（语料没有它）⇒ 按 `$`
  //    切段后本档腿**须限定同现**才放行（R2 2026-10-06）：本件正文带 `SpawnRestriction.Location`
  //    散文载体（围栏外，idsOf scope=fence 不采它，但 qualifiedInText 认整件文本）；
  //    同件的 `GhostInner`（没有登记的嵌套名）照旧红 —— $ 切段不是 CamelCase 通配。
  fs.writeFileSync(
    path.join(jurDir, "JUR_NESTED.md"),
    "---\nname: mc-jur\n---\n\nSpawnRestriction.Location 以限定形态同现（R2 放行凭证）。\n\n```java\nLocation loc = null;\nGhostInner g = null;\n```\n",
  );
  const jn = attestation(jurRel("JUR_NESTED.md"));
  cases.push([
    "管辖⑦ 嵌套尾段+$切段+限定同现：Location 放行、GhostInner 仍红（且带【非MC宇宙名】）",
    jn.bad.length === 1 && /GhostInner/.test(jn.bad[0]) && !/Location/.test(jn.bad.join("|")),
    true,
  ]);
  // ⑦b R2 投毒臂：同一围栏去掉限定载体 ⇒ 裸尾段必须红【嵌套尾段·无限定同现】。
  //    ⑦ 的绿侧只有这条在红才不是「tailOnly 没接上」的假绿。
  fs.writeFileSync(path.join(jurDir, "JUR_TAIL_BARE.md"), "---\nname: mc-jur\n---\n\n```java\nLocation loc = null;\n```\n");
  const jtb = attestation(jurRel("JUR_TAIL_BARE.md"));
  cases.push(["管辖⑦b 裸嵌套尾段无限定同现 ⇒ 红【嵌套尾段·无限定同现】点名 Location", jtb.bad.length === 1 && /Location/.test(jtb.bad[0]) && /嵌套尾段/.test(jtb.bad[0]), true]);
  // ⑧ 形参位：`StatusEffect statusValue,`（StatusEffect 语料在场、statusValue 是小写起头形参）与
  //    `Goal goalRef)`（Goal 在夹具映射）⇒ 两个形参名走声明位否决；同件的 `GhostParam`（大写起头、
  //    非形参位、宇宙查无）照旧红 —— 形参模式只吸「类型 空格 小写名+界符」，不吸类型侧 token。
  fs.writeFileSync(
    path.join(jurDir, "JUR_PARAM.md"),
    "---\nname: mc-jur\n---\n\n```java\npublic void apply(StatusEffect statusValue, Goal goalRef) {\nGhostParam ghost = null;\n}\n```\n",
  );
  const jp = attestation(jurRel("JUR_PARAM.md"));
  cases.push([
    "管辖⑧ 形参名进声明位否决（decl≥2、红里无 statusValue/goalRef），GhostParam 照旧红",
    jp.bad.length === 1 && /GhostParam/.test(jp.bad[0]) && (jp.vetoed?.decl ?? 0) >= 2,
    true,
  ]);
  // ⑨ lambda 裸形参表：`(packetSenderExample, unusedThing) ->` 两名字走声明位；同一括号里**大写起头**的
  //    `GhostlyType`（可能是漏网的真引用）不被裸形参模式吸走、照旧红 —— 模式只认小写起头。
  fs.writeFileSync(
    path.join(jurDir, "JUR_LAMBDA.md"),
    "---\nname: mc-jur\n---\n\n```java\nlist.forEach((packetSenderExample, unusedThing, GhostlyType) -> {\n});\n```\n",
  );
  const jl = attestation(jurRel("JUR_LAMBDA.md"));
  cases.push([
    "管辖⑨ lambda 裸形参否决（红里无 packetSenderExample/unusedThing），括号里的大写名 GhostlyType 照旧红",
    jl.bad.length === 1 && /GhostlyType/.test(jl.bad[0]) && !/packetSenderExample|unusedThing/.test(jl.bad.join("|")),
    true,
  ]);

  // MC_SKILL_YARN_ATTEST_MAX 打印帽（顺手臂，SRG.md 恰是两红夹具）：帽只裁**人读条数**，
  // 判据/rc 不动 ⇒ MAX=1 仍 rc=1 且以「+1 more」点名被裁的那条；默认帽两条全列。
  const rMax1 = runGate("forge/1.12.2/.cursor/skills/mc-item/SRG.md", { MC_SKILL_YARN_ATTEST_MAX: "1" });
  cases.push(["MAX=1 ⇒ 仍 rc=1 且 stderr 出现「+1 more」（帽只裁条数不改判）", rMax1.status === 1 && /\+1 more/.test(rMax1.stderr || ""), true]);
  const rMaxD = runGate("forge/1.12.2/.cursor/skills/mc-item/SRG.md");
  cases.push(["默认帽 ⇒ 两红逐条全列（ItemStack + NeverSeenAnywhere）", rMaxD.status === 1 && /ItemStack/.test(rMaxD.stderr || "") && /NeverSeenAnywhere/.test(rMaxD.stderr || ""), true]);

  let missed = 0;
  for (const [name, got, want] of cases) {
    if (got === want) console.log(`  ok  ${name}`);
    else {
      console.error(`  RED ${name}（got ${got}, want ${want}）`);
      missed++;
    }
  }
  setRoot(REPO_ROOT);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`selftest: ${cases.length - missed}/${cases.length} 通过`);
  process.exitCode = missed === 0 ? 0 : 1;
}

function cliAttest(argv) {
  const packFlag = argv.find((a) => a.startsWith("--pack="));
  const namesFlag = argv.find((a) => a.startsWith("--names="));
  if (!packFlag || !namesFlag) {
    console.error("usage: assert-skill-yarn-attest.mjs --pack=fabric_<ver> --names=A,B,C | --selftest");
    process.exit(2);
    return;
  }
  const [platform, version] = packFlag.slice("--pack=".length).split("_");
  const names = namesFlag
    .slice("--names=".length)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const corpus = corpusBlob(platform, version);
  const leg = mappingLeg(platform, version);
  console.log(
    `pack=${platform}_${version} 语料=${(corpus.length / 1e6).toFixed(1)}MB 映射腿=${leg.state}${leg.usable ? "（开）" : "（关）"} ${leg.why}`,
  );
  for (const n of names) {
    const inCorpus = corpus.includes(n);
    const inSqlite = sqliteHas(platform, version, n);
    // 判词必须与 attestation() 同口径，否则技能正文里那句「自查结果（--pack=…）」会把
    // 「门会红的名字」念成「可用」—— 语料腿对 mojmap 独有名不算出处（(d) 否决）。
    let verdict;
    if (MOJMAP_ONLY.has(n) && !(leg.usable && leg.ids.has(n))) {
      verdict = inCorpus ? "需披露（mojmap 独有名，语料命中不算出处）" : "需披露（mojmap 独有名，本档映射未证出）";
    } else if (inSqlite) verdict = "可用（映射证出）";
    else if (inCorpus) verdict = "弱出处（仅语料命中，映射未证出 ⇒ 签名与用法仍须另行核实）";
    else verdict = "无出处";
    console.log(`  ${n.padEnd(26)} ${inCorpus ? "语料✓" : "语料·"} ${inSqlite ? "映射✓" : "映射·"} ⇒ ${verdict}`);
  }
}

const argv = process.argv.slice(2);
if (argv.includes("--selftest")) {
  selftest();
} else if (argv.some((a) => a.startsWith("--pack="))) {
  cliAttest(argv);
} else {
  if (!fs.existsSync(LIST_PATH)) {
    console.error(`assert-skill-yarn-attest: 清单不存在（${LIST_PATH}）。零输入不算通过。`);
    process.exit(1);
  }
  const files = fs
    .readFileSync(LIST_PATH, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  if (!files.length) {
    console.error(`assert-skill-yarn-attest: 清单为空（${LIST_PATH}）。零输入不算通过。`);
    process.exit(1);
  }
  const all = [];
  const io = [];
  let withLeg = 0;
  const legModes = new Map();
  // B1-a 放行腿（2026-09-25，§6.10③）：`fabric/26.1.2` 该档 **deobfuscated**（official 名、游戏 jar 无混淆），
  // 按设计**没有** yarn-mappings.sqlite ⇒ 本门的「类名存在性」判据对它不适用。显式放行 + 计数披露，
  // 而不是像过去那样靠「不在清单里」静默缺席。
  const PASS_261 = /^fabric\/26\.1\.2\//;
  let pass261 = 0;
  const fapiIo = new Set();
  const vetoSum = { decl: 0, fapi: 0, member: 0, externalQueued: 0 };
  // 管辖权台账（2026-10-06 批；同日 R1 收紧）：queueAll = 「签收台账在册·已声明对应 slug·非MC宇宙名」
  // 待人工审条目（TSV 行源，第 4 列 = 跨平台打标）；
  // fenceSkipped = 非 JVM 围栏跳过的行数 —— 披露项：围栏不采，但必须**可数**，
  // 否则「围栏里的名字没采」与「围栏里根本没有名字」在输出上不可区分。
  const queueAll = [];
  let fenceSkipped = 0;
  // R1（2026-10-06）：签收台账在场但读不动/零行 ⇒ 点名信号（清空台账不得关掉执法，SQLITE 同族）。
  let signoffMissing = null;
  for (const f of files) {
    if (PASS_261.test(f.replace(/\\/g, "/"))) {
      pass261 += 1;
      continue;
    }
    const r = attestation(f);
    if (r.missing) all.push(...r.missing);
    if (r.bad) all.push(...r.bad);
    if (r.leg?.state === "unreadable") {
      io.push(`${f} ⇒ ${r.leg.why}`);
    }
    if (r.leg?.usable) withLeg++;
    for (const v of r.fapiIo ?? []) fapiIo.add(v);
    // 四个否决计数一律 `?? 0` 防御：attestation() 对不存在的文件只回 { missing } 形状，
    // queue/stats/vetoed 各字段全为 undefined（selftest 的 MISSING 臂走的就是这条路）。
    queueAll.push(...(r.queue ?? []));
    fenceSkipped += r.stats?.fenceSkippedLines ?? 0;
    if (r.stats?.signoffMissing && !signoffMissing) signoffMissing = r.stats.signoffMissing;
    if (r.vetoed) {
      vetoSum.decl += r.vetoed.decl ?? 0;
      vetoSum.fapi += r.vetoed.fapi ?? 0;
      vetoSum.member += r.vetoed.member ?? 0;
      vetoSum.externalQueued += r.vetoed.externalQueued ?? 0;
    }
    legModes.set(r.leg?.state ?? "无库", (legModes.get(r.leg?.state ?? "无库") || 0) + 1);
  }
  // ── --queue=<绝对路径>：把「签收在册·非MC宇宙名」条目写 TSV 供人工审（R1 逐名签收：台账有名
  // 且 slug 交集才进队，**不**判红；队列是人审的入口，不是放行凭证）。同款纪律镜像
  // assert-rules-api-names.mjs :: main() 的 --queue 块：**不得**落仓库受管面。判据用 realpath ——
  // OneDrive 卷 / Junction 可以让「字符串上在仓库外」的路径实际别名到仓库内；realpath 拿不到 ⇒
  // 退回 resolve 结果照判（宁可多拒不可漏拒）。行序=清单序（清单按字典序入库，跨进程逐字节确定，
  // 与规则门的全树 readdir 不同，无需再排序）。**写作不改变 rc**（rc 只看 all.length）；但「用户
  // 点名要的队列件没写」属请求未达成，须点名并 rc=1，不得塌成静默成功。
  const queueFlag = argv.find((a) => a.startsWith("--queue="))?.slice("--queue=".length);
  let queueBlocked = false;
  if (queueFlag) {
    const abs = path.resolve(queueFlag);
    const realOf = (p) => {
      try {
        return fs.existsSync(p) ? fs.realpathSync(p) : path.join(fs.realpathSync(path.dirname(p)), path.basename(p));
      } catch {
        return p;
      }
    };
    const realAbs = realOf(abs);
    const realRoot = realOf(ROOT);
    if (realAbs === realRoot || realAbs.startsWith(realRoot + path.sep)) {
      console.error(`【QUEUE-IN-REPO】拒绝把队列写进仓库面：${abs}（realpath ${realAbs}）⇒ 队列只落本机侧/临时目录`);
      queueBlocked = true;
    } else {
      const rows = queueAll.map((q) => {
        // R1b（2026-10-06）：第 4 列 = 跨平台打标（该外部名同时出现在 forge/neoforge 的
        // loader-api 摘要类末段 ⇒ 大概率是跨加载器库/共用件被当 fabric-only 引用的候选）。
        // 只打标不判红：Mixin 这类合法跨平台件不得被误杀；信息给人签收时看。
        const [file, line, name, cross] = q.split("\t");
        return `${file}\t${String(line).replace(/^L/, "")}\t${name ?? ""}\t${cross ?? ""}`;
      });
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, ["file\tline\tname\t跨平台", ...rows].join("\n") + "\n", "utf8");
      console.log(`  队列已写 ${abs}（${rows.length} 行）`);
    }
  }
  // 收口摘要行（stderr，判红与否都印）：红数 / 队列数 / 围栏跳行 / 四类否决，一次跑完全部可数。
  console.error(
    `assert-skill-yarn-attest: 收口 — 红 ${all.length} 处 · 队列 ${queueAll.length} 条〔签收台账在册·待人工审〕 · 跨平台打标 ${queueAll.filter((q) => q.split("\t")[3]).length} 条 · 签收台账 ${signoffLedger().data.size} 名 · 非JVM围栏跳过 ${fenceSkipped} 行 · ` +
      `否决 decl ${vetoSum.decl} · fapi ${vetoSum.fapi} · member ${vetoSum.member} · externalQueued ${vetoSum.externalQueued}`,
  );
  // 摘要件在盘但读不动 ⇒ 归属名单会**静默缩小**（少一个来源就多一批假红），与 C1① 同族，故点名判红。
  // 两路来源分别点名：`fapiIo` 的条目形如 `fabric-api:1.21.4` / `fabric-loader:1.21.4`，
  // 老断言按【FAPI-SUMMARY-UNREADABLE】匹配 ⇒ ② 的串一字未改，③ 另起一串。
  if (fapiIo.size) {
    const arr = [...fapiIo];
    const api = arr.filter((a) => a.startsWith("fabric-api:")).map((a) => a.slice("fabric-api:".length));
    const loader = arr.filter((a) => a.startsWith("fabric-loader:")).map((a) => a.slice("fabric-loader:".length));
    console.error(`assert-skill-yarn-attest: ${arr.length} 档×来源 摘要件在盘但读不动 ⇒ 拒绝按「该档没有 FAPI 名」处理：`);
    for (const a of api.slice(0, 20)) console.error(`  - ${a}【FAPI-SUMMARY-UNREADABLE】`);
    for (const a of loader.slice(0, 20)) console.error(`  - ${a}【LOADER-SUMMARY-UNREADABLE】`);
    if (arr.length > 40) console.error(`  … +${arr.length - 40} more`);
    process.exit(1);
  }
  // 自证三条否决腿真在计数（否则「名单接了但没人查」与「没接」在输出上不可区分）。
  console.log(`  FAPI-VETO 否决面=本件声明 ${vetoSum.decl} 名 + Fabric API 归属 ${vetoSum.fapi} 名（摘要件读不动 ${fapiIo.size} 档）`);
  // C1①：库读不动 ⇒ **红**，不得退化成"这一腿没意见"。清空/挪走库从前的效果是少报，现在是必红。
  if (io.length) {
    console.error(`assert-skill-yarn-attest: ${io.length} 件所在档的 yarn-mappings.sqlite 存在但读不动 ⇒ 拒绝按"查无此名"处理：`);
    for (const a of io.slice(0, 20)) console.error(`  - ${a}【SQLITE-UNREADABLE】`);
    if (io.length > 20) console.error(`  … +${io.length - 20} more`);
    process.exit(1);
  }
  // R1（2026-10-06）：有名字走过台账分支、而台账读不动/零行 ⇒ 点名判红。清空/挪走台账不再能把
  // 「未签收即红」降级成静默放行：名字面已经红（台账空 ⇒ rec undefined），这条再给原因点名。
  if (signoffMissing) {
    console.error(`assert-skill-yarn-attest: 签收台账（external-apis-signoff.tsv）被引用但不可用 ⇒ 拒绝按「查无此名」静默处理：`);
    console.error(`  - ${signoffMissing}【SIGNOFF-MISSING】`);
    process.exit(1);
  }
  // 打印上限：默认 40（既有输出逐字不变）。MC_SKILL_YARN_ATTEST_MAX 只放宽**人读的条数**，
  // 不改判据、不改 rc、不改 all.length —— 它的用途是「全量扩面前先量后改」：拿门自己的 oracle
  // 出完整缺陷面，而不是另写一份判据复刻（复刻必然与门漂移，§6.10⑥ 的测量数就是这么来的）。
  const printMax = Math.max(1, Number(process.env.MC_SKILL_YARN_ATTEST_MAX) || 40);
  if (all.length) {
    console.error(`assert-skill-yarn-attest: ${all.length} 处标识符既不在本档语料、也不在本档 yarn 映射：`);
    for (const a of all.slice(0, printMax)) console.error(`  - ${a}`);
    if (all.length > printMax) console.error(`  … +${all.length - printMax} more`);
    process.exit(1);
  }
  // 名字面全绿但 --queue 目标被 [QUEUE-IN-REPO] 拒绝 ⇒ 仍 rc=1：写队列的诉求未达成，不得报 ok。
  // （成功写作不改 rc —— rc 只看 all.length，与既有合同一致。）
  if (queueBlocked) {
    console.error("assert-skill-yarn-attest: --queue 写入被拒绝 ⇒ rc=1（名字面判定不变，仅队列件未落盘）");
    process.exit(1);
  }
  // 覆盖披露（B1-a「先量后改」：2026-09-24 量的账 = 532 件全量、rc1、约 1615 处问题行 ⇒ 批量工程；
  // 2026-10-06 扩面批已完成该工程（红清零，残余转队列归因），下方文案改为运行期实数。
  let fabricTotal = 0;
  {
    const base = path.join(ROOT, "fabric");
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".md")) fabricTotal += 1;
      }
    };
    try {
      for (const v of fs.readdirSync(base, { withFileTypes: true })) {
        if (!v.isDirectory()) continue;
        const d = path.join(base, v.name, ".cursor", "skills");
        if (fs.existsSync(d)) walk(d);
      }
    } catch {}
  }
  console.log(
    `assert-skill-yarn-attest: ok（清单 ${files.length} 件＝判 ${files.length - pass261} + 26.1.2 放行 ${pass261}；${withLeg} 件映射腿可用 [${[...legModes].map(([k, v]) => `${k}:${v}`).join(" · ")}]；` +
      `fabric 技能源稿共 ${fabricTotal} 件 ⇒ 未入清单 ${fabricTotal - files.length} 件〔2026-10-06 扩面批：全量面红 856→0，` +
        `队列 ${queueAll.length} 条为签收台账在册、待人工审的归因记账〔新外部名须先入 external-apis-signoff.tsv 才进队〕；原「先量后改」账见 docs/knowledge-coverage-sweep-20260924.md §6.10⑥〕；` +
      `语料腿已抹平注释行〔2026-09-27 C1②：现状零翻红，实测 910 个名/33 件〕；全部标识符均有出处）`,
  );
}
