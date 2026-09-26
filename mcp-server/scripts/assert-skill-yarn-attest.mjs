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
 *   (b) 本档 yarn 映射命中：`yarn-mappings.sqlite` 的 classes.named 尾段 / methods.name_named
 *       / fields.name_named 等于该串；
 *   (c) 同行带未核实/禁止/零命中/不得 之类负例标记 ⇒ 那是"告诉读者别写这个名字"，不算断言；
 *   (d) **mojmap 独有名否决**：命中 `MOJMAP_ONLY` 且本档 yarn 映射查无 ⇒ (a) 不算出处，
 *       文件必须带「### ⚠️ 映射口径：本档语料是 mojmap」披露块并点名该 id，否则红。
 *       没有 (d) 时 (a) 会替 mojmap 背书 —— Fabric 1.20.4 / 1.21.x 的语料本身就是 mojmap 写的。
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
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const LIST_PATH = process.env.MC_SKILL_YARN_ATTEST_LIST
  ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_LIST)
  : path.join(HERE, "skill-yarn-attest.files.txt");
let ROOT = process.env.MC_SKILL_YARN_ATTEST_ROOT ? path.resolve(process.env.MC_SKILL_YARN_ATTEST_ROOT) : REPO_ROOT;

const sqliteCache = new Map();

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
    const ids = new Set();
    for (const raw of line.split(/[^A-Za-z0-9_.$#()/]+/)) {
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
            blob += fs.readFileSync(full, "utf8") + "\n";
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
 */
function mappingLeg(platform, version) {
  const key = `${platform}_${version}`;
  if (legCache.has(key)) return legCache.get(key);
  const leg = { exists: false, era: null, ids: new Set(), usable: false, why: "无 yarn-mappings.sqlite（只能靠语料）" };
  legCache.set(key, leg);
  const file = path.join(ROOT, "data", key, "mappings", "yarn-mappings.sqlite");
  if (!fs.existsSync(file)) return leg;
  leg.exists = true;
  let db = null;
  try {
    db = new DatabaseSync(file, { readOnly: true });
  } catch {
    leg.why = "yarn-mappings.sqlite 打不开（只能靠语料）";
    return leg;
  }
  sqliteCache.set(key, db);
  try {
    leg.era = db.prepare("select value from meta where key='mappingEra'").get()?.value ?? null;
  } catch {
    leg.era = null;
  }
  if (!YARN_ERAS.has(leg.era)) {
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
    } catch {}
  }
  if (!leg.ids.size) {
    leg.why = "yarn-tiny 档但 classes/methods/fields 零行 ⇒ 映射腿是空转，不得当出处";
    return leg;
  }
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
  const bad = [];
  const seen = new Set();
  for (const { id, at } of idsOf(text, { scope: "fence" })) {
    if (seen.has(id)) continue;
    seen.add(id);
    // mojmap 独有名：语料命中也不算 —— 语料本身就是 mojmap 写的。必须在本文件的披露块里点名。
    if (leg.usable && MOJMAP_ONLY.has(id) && !leg.ids.has(id) && !said.includes(`\`${id}\``)) {
      bad.push(`${relPath}:L${at} ${id}【MOJMAP-UNDISCLOSED】mojmap 名，本档 yarn 映射 0 命中；语料命中不算出处 ⇒ 文件须加「${DISCLOSE_MARK}」披露块`);
      continue;
    }
    if (corpus.includes(id)) continue;
    if (leg.usable && sqliteHas(platform, version, id)) continue;
    bad.push(`${relPath}:L${at} ${id}${leg.usable ? "" : `（${leg.why}）`}`);
  }
  return { bad, leg };
}

function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "yarn-attest-selftest-"));
  setRoot(tmp);
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
    `pack=${platform}_${version} 语料=${(corpus.length / 1e6).toFixed(1)}MB 映射腿=${leg.usable ? `开（${leg.why}）` : `关（${leg.why}）`}`,
  );
  for (const n of names) {
    const inCorpus = corpus.includes(n);
    const inSqlite = sqliteHas(platform, version, n);
    console.log(`  ${n.padEnd(26)} ${inCorpus ? "语料✓" : "语料·"} ${inSqlite ? "映射✓" : "映射·"} ⇒ ${inCorpus || inSqlite ? "可用" : "无出处"}`);
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
  let withLeg = 0;
  const legModes = new Map();
  // B1-a 放行腿（2026-09-25，§6.10③）：`fabric/26.1.2` 该档 **deobfuscated**（official 名、游戏 jar 无混淆），
  // 按设计**没有** yarn-mappings.sqlite ⇒ 本门的「类名存在性」判据对它不适用。显式放行 + 计数披露，
  // 而不是像过去那样靠「不在清单里」静默缺席。
  const PASS_261 = /^fabric\/26\.1\.2\//;
  let pass261 = 0;
  for (const f of files) {
    if (PASS_261.test(f.replace(/\\/g, "/"))) {
      pass261 += 1;
      continue;
    }
    const r = attestation(f);
    if (r.missing) all.push(...r.missing);
    if (r.bad) all.push(...r.bad);
    if (r.leg?.usable) withLeg++;
    const mode = r.leg?.usable ? "开" : r.leg?.exists ? `关:${r.leg.era ?? "无meta"}` : "无库";
    legModes.set(mode, (legModes.get(mode) || 0) + 1);
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
      `fabric 技能源稿共 ${fabricTotal} 件 ⇒ 未入清单 ${fabricTotal - files.length} 件〔扩面实测 = 全量 rc1、约 1615 处问题行，属批量工程，见 docs/knowledge-coverage-sweep-20260924.md §6.10⑥〕；全部标识符均有出处）`,
  );
}
