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
 *   MC_SKILL_YARN_ATTEST_LIST=<file> 覆盖清单路径；MC_SKILL_YARN_ATTEST_ROOT=<dir> 只给 selftest 用。
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

function idsOf(text, { scope = "all" } = {}) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
      inBlock = !inBlock;
      continue;
    }
    if (scope === "fence" && !inBlock) continue;
    if (scope === "prose" && inBlock) continue;
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
  for (const [table, col] of [
    ["classes", "named"],
    ["methods", "name_named"],
    ["fields", "name_named"],
  ]) {
    try {
      for (const r of db.prepare(`select ${col} as n from ${table}`).all()) {
        const tail = String(r.n ?? "").split("/").pop();
        if (tail) leg.ids.add(tail);
      }
    } catch (err) {
      leg.state = "unreadable";
      leg.why = `yarn-mappings.sqlite 的 ${table}.${col} 读失败（${err?.message ?? "query 失败"}）`;
      leg.ids.clear();
      return leg;
    }
  }
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
  const vetoed = { decl: 0, fapi: 0 };
  const bad = [];
  const seen = new Set();
  for (const { id, at } of idsOf(text, { scope: "fence" })) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (decl.has(id)) { vetoed.decl++; continue; }
    if (fapi.names.has(id)) { vetoed.fapi++; continue; }
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
    if (leg.usable && leg.ids.has(id)) continue;
    bad.push(`${relPath}:L${at} ${id}${leg.usable ? "" : `（${leg.why}）`}`);
  }
  return { bad, leg, vetoed, fapiIo: fapi.unreadable.map((v) => `${v}`) };
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
  const vetoSum = { decl: 0, fapi: 0 };
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
    if (r.vetoed) { vetoSum.decl += r.vetoed.decl; vetoSum.fapi += r.vetoed.fapi; }
    legModes.set(r.leg?.state ?? "无库", (legModes.get(r.leg?.state ?? "无库") || 0) + 1);
  }
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
  if (all.length) {
    console.error(`assert-skill-yarn-attest: ${all.length} 处标识符既不在本档语料、也不在本档 yarn 映射：`);
    for (const a of all.slice(0, 40)) console.error(`  - ${a}`);
    if (all.length > 40) console.error(`  … +${all.length - 40} more`);
    process.exit(1);
  }
  // 覆盖披露（B1-a「先量后改」的「量」：全量扩面实测 532 件 ⇒ rc1、约 1615 处问题行 ⇒ 批量工程，未做）
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
      `fabric 技能源稿共 ${fabricTotal} 件 ⇒ 未入清单 ${fabricTotal - files.length} 件〔扩面实测 = 全量 rc1、约 1615 处问题行，属批量工程，见 docs/knowledge-coverage-sweep-20260924.md §6.10⑥〕；` +
      `语料腿已抹平注释行〔2026-09-27 C1②：现状零翻红，实测 910 个名/33 件〕；全部标识符均有出处）`,
  );
}
