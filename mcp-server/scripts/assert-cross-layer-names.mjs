/**
 * 门：跨层类名（档位类名层 ↔ 正文实名）—— 覆盖 **leg2 判据面之外** 的文件。
 *
 * 为什么单列一道（`docs/knowledge-coverage-sweep-20260924.md` §6.8 缺口②）：
 *   `assert-skill-mappings-key.mjs` 的 leg2 只扫 `.cursor/skills/**` 的**围栏代码** ⇒
 *   `knowledge/**`、`code-patterns/**`、`.cursor/rules/**`、`AGENTS.md`、`CLAUDE.md`、`scaffold/**`
 *   全无判据面。§6.8 那轮 15 处跨层错名里 **13 处** 落在这个盲区（例：5 个 forge 档的
 *   `knowledge/antipatterns/networking.md:71` 用 `ServerWorld`；1.16.5 `code-patterns/*` 用 `Level`）。
 *
 * 判据（档位类名层，出自 §6.8 表）：
 *   · forge ≤1.16.5 → **MCP 类名层**；forge ≥1.17.1 / neoforge → **mojmap**（official·parchment 叠其上）；
 *   · fabric 1.14.4–1.21.11 → **yarn**、26.1.2 → 去混淆官方名；quilt → **yarn**；
 *   · liteloader / rift / modloader → **MCP 系老档**；bedrock → 无 Java 映射（不判）。
 * 四条腿（`.md`/`.mdc` 只取**围栏代码**、`.java` 取全文；镜像与 `.cursor/skills/**` 不在本门面内）：
 *   A. yarn 档出现 `mojmapOnly` 名 ⇒ 红（与 leg2 同一份 pairs 集合，单一实现见 `assert-skill-mappings-key.mjs`）；
 *   B. mojmap 档出现 `yarnOnly` 名 ⇒ 红（同上）；
 *   C. mojmap 档出现**本档 mojmap 里不存在的 MCP 类名** ⇒ 红（MCP 集合 = `data/forge_1.16.5/mappings/obf_to_srg.tsrg`
 *      的顶层简名；本档 mojmap 集合 = `data/forge_<v>/mappings/client.txt` 的**点号**简名）。
 *      四腿共用一条**限定规则**：紧跟在大写限定名点号后的 token（`TickEvent.Phase` 的嵌套枚举/静态成员访问）
 *      不是类引用 ⇒ 不判；小写限定的 FQCN（`net.minecraft...Level`）照判。
 *   D. MCP 档出现同代 mojmap 名 ⇒ 红（同代 = 1.16.5 + 1.17.1 的 client.txt；本档 MCP 集合 = 该档
 *      `joined.srg`/`joined.tsrg`，1.14.4/1.15.2 无类名源 ⇒ 以 1.16.5 的 tsrg 代（同为 MCP 层，已在注释里声明）。
 * 豁免：`ALLOW`（逐文件 × token，必须给 why——解旗不是免责）；基线：`BASELINE`（棘轮，只许降）。
 *
 * 用法：
 *   node scripts/assert-cross-layer-names.mjs             # 判红/绿
 *   node scripts/assert-cross-layer-names.mjs --dump      # 只读：打印全部冲突 + 退出 0
 *   node scripts/assert-cross-layer-names.mjs --selftest  # 纯内存 + 端到端夹具
 *   node scripts/assert-cross-layer-names.mjs --require-pairs  # 维护者本地：无对照产物即响亮判红
 *     （或 MC_SKILL_REQUIRE_PAIRS=1；CI 勿开——pairs 按许可不入库，CI 永远没有）
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { loadPairs, PAIRS_DIR } from "./assert-skill-mappings-key.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const argVal = (n) => {
  const hit = argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : null;
};
const ROOT = path.resolve(argVal("root") || path.join(HERE, "..", ".."));
const DUMP = argv.includes("--dump");
const SELFTEST = argv.includes("--selftest");
/** 忽略基线（= 把三个基线当 0）：自证端到端与「清理批次」用；日常判红仍走棘轮。 */
const STRICT = argv.includes("--strict");
/**
 * `--require-pairs`（或 env `MC_SKILL_REQUIRE_PAIRS=1`）：**无对照产物 ⇒ 响亮判红**。
 * 背景（2026-09-25 pairs 复现性洞）：pairs 由 `build-yarn-mojmap-pairs.mjs` 现生，只落
 * `$MC_SKILL_CACHE/yarn-mojmap-pairs`（未设该 env 时落 tmpdir 一次性目录）——tmpdir 被清 = 产物档 0
 * = 腿 A/B **静默不判**，基线 A/B 的存量数在这类机器上只是装饰。
 * 同日裁定把**派生对照表**发布进 `data/_yarn-mojmap-pairs/`（**15 档 / 112,971 类名对**，含二次发布
 * 补的 1.20.6 / 1.21.5，见该目录 provenance；`client.txt` 本体仍 gitignored、不入库），
 * 读侧 `PAIRS_DIR` 已默认指它 ⇒ 干净 clone 也判得了。
 * 默认不开（CI 必须能绿）；维护者本地跑链 / 复核 A/B 基线时必须开：红文案直接念再生命令。
 */
const REQUIRE_PAIRS = argv.includes("--require-pairs") || process.env.MC_SKILL_REQUIRE_PAIRS === "1";
const PAIRS = path.resolve(argVal("pairs-dir") || PAIRS_DIR);

/** 本门面内的平台（bedrock 无 Java 映射，不入判）。 */
const PLATFORMS = ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader"];
/** 版本无关的子面（neoforge 的根级 docs/scaffold）：按 mojmap 层判，集合取**跨档并集**（保守，逐条人核）。 */
const NEOFORGE_VERSIONLESS = new Set(["code-patterns", "knowledge", "scaffold", "rules"]);
const MIRROR = /[\\/](\.claude|\.continue|\.trae|\.opencode|\.agents|\.zcode|\.pi)[\\/]/;
/** 专有名词行（`Minecraft Wiki` / `Minecraft EULA`）——正文里的站点名，不是类用法。 */
const NOUN_LINE = /Minecraft\s+(Wiki|EULA)/;
/**
 * 逐文件豁免台账（解旗不是免责：要加条目必须先给出「该 token 在此文件里确为另一层/第三方」的证据）。
 * as-of 2026-09-25 首测为空（8 件首测冲突全按内容修正，基线 0）。
 */
const ALLOW = [
  // 2026-09-25：Forge 自有 datagen 类，**跨代同名**（Forge 类不随 MC 重映射改名）⇒ 1.16.5 tsrg 快照里
  // 的 forge 类行把它们带进「MCP 顶层名」集合，才会在 1.17+ 档误报。证据：1.19.4/1.20.1/1.20.4 的
  // 07-datagen.mdc 里 `new ModBlockTagsProvider(output, lookup)` / `extends BlockTagsProvider` 是
  // Forge datagen 现行 API（本档 client.txt 无此二类 ⇒ 若是 MC 类早该改名， Forge 类不受映射影响）。
  {
    match: /^forge\/(?:1\.1[789]|1\.20)\.\d+\/(?:\.cursor\/rules|code-patterns|knowledge)\//,
    tokens: new Set(["ItemModelProvider", "BlockTagsProvider"]),
    why: "Forge 自有类（client.model.generators.ItemModelProvider / common.data.BlockTagsProvider），1.17+ 同名存在 ⇒ 非 MCP-era MC 名",
  },
];
/**
 * 存量基线（棘轮：只许降不许增）。**两条分开**：
 *   · A/B/C 腿 = 高精度（yarn↔mojmap 对照对 + 顶层 MCP 名，均已排除段名）⇒ **0 = 零容忍**；
 *   · D 腿 = 「MCP 档（≤1.16.5 / 老平台）出现同代 mojmap 名」。它**天然夹带合法的跨版本对照**
 *     （`knowledge/version-changes/**`、`knowledge/porting/**` 会点名别档的类；`Resource`/`Pack`/`Recipe`/
 *     `Player`/`Context` 这类词又是通用英文）⇒ 先按实测登记基线、只做**棘轮**（新增即红），
 *     存量按 §6.8 的法子逐条人核后再降。as-of 2026-09-25 首测见 BASELINE_D。
 */
const BASELINE = 110; // A/B 存量沿革：首测 130（13:34）→ 135（pairs 判集微移）→ 125（B 真欠账 10 行修复）→ **110（2026-09-26 三钉，A=87 + B=23）**：
// ① B 真欠账再修 15 行（KeyBinding 术语散用改词：rules/09 ×4、AGENTS.md ×5、CLAUDE.md ×5、knowledge/antipatterns/events.md ×5
// —— 交接单 `temp/audit-20260921/HANDOFF-fixer-20260926.md` ①桶 B，scanner 131→验收对账）；② 15 档仓库版 pairs
// （data/_yarn-mojmap-pairs，112,971 对）判集较 13 档自拉版再扩 ⇒ 排除面扩大，B/D 计数整体下移（红点文件零写入）。
// 首测→三钉全程：A/B 红点文件 mtime ≤ 建门时点（temp/_ab-attrib.cjs 可复算），文本修复逐条留痕于本注释与 CHANGELOG。
// fabric 侧 `knowledge/porting/forge-to-fabric.md`（移植指南会**合法**点名 Forge 侧类名）、`scaffold/**`、
// `code-patterns/**` 里混进的 mojmap 名（`Mob`/`Behavior`/`Player`/`DiggerItem`/`Material`…）。
// §6.8 修掉的 `ServerWorld`/`Level` 属这条腿的**已清**样本；余量按 leg2 的老法分批清 + 基线只许降。
const BASELINE_C = 0; // 首测 33 ⇒ 同日清零（2026-09-25 第二遍）：真欠账 24 行文本修复
// （KeyboardListener→KeyboardHandler ×5、BiomeAmbience→BiomeSpecialEffects ×1（1.16 Forge 教程原样）、
// EntityDataManager→SynchedEntityData ×3（原行自并列两代名，改只留本档正名）、IRecipe→Recipe ×3、
// SetCount→SetItemCountFunction ×2、RandomValueRange→NumberProvider ×5、LootEntry→LootPoolEntryContainer ×5；
// 含糊注「以本版 mappings 为准」按裁决撤下换实名）+ Forge 跨代同名类 9 行（ItemModelProvider×5 /
// BlockTagsProvider×4）进 **ALLOW**（Forge 类不随映射改名，tsrg 快照含 forge 类行所致的门误报）。
// 全部替换名经 5 版 client.txt 现验；替换脚本 = `temp/_c33-fix.cjs` / `_c33-fix2.cjs`（逐条断言命中数）。
// 台账清完后盘上实测仍余 15 行 `Phase`（5 档 × events.md/08-client-server/09-anti-patterns）：逐处核实
// 全是 `TickEvent.Phase.START/END` 的**嵌套枚举成员访问**，不是类引用 ⇒ 走**门侧判据**修正（大写限定豁免，
// 见 flagsFor 头注），**不改文本**——`Phase` 是 Forge 事件 API 实名；撞名来源 = tsrg 顶层
// `net/minecraft/entity/boss/dragon/phase/Phase`（1.17+ 该 vanilla 类叫 `EnderDragonPhase`，五版 client.txt 逐字可核）。
const BASELINE_D = 97; // as-of 2026-09-25 首测 109（腿 D：MCP 档出现同代 mojmap 名；`version-changes/**`/
// `porting/**` 的**合法跨版本对照**与通用英文词（`Resource`/`Pack`/`Recipe`/`Player`/`Context`）是主要噪声）。
// 同日随大写限定判据修正**降钉 109→97**：−12 条全是点号限定成员访问（与 C 腿 15 条 `Phase` 同一豁免，
// 复测读数 97 见本文件实跑行）。
const BASELINE_E = 7; // 首测 2（2026-09-25）⇒ **7（2026-09-26 三钉）**，构成必须读全：
// ① mc-networking(2 处) / mc-renderer(3 处) = §6.8 未决的 1.16.5 混合档判定，15 档成员名表变全后 1→2/1→3（存量位移，待人核）；
// ② data/forge_{1.17.1..1.20.4}/mappings/mcp_config-*.provenance.json ×5 = **并行车道待补件**（provenance 已放、
//    对应 methods/fields csv 未纳管 ⇒ 腿 E「已纳管表缺失」）。csv 补齐入库后这 5 行**必须降掉**（只许降），
//    降不掉 = 车道没收口。
// 的 `mc-networking`（声明 mcp，只见 `sendToServer`/`readInt` 等 Mojang 侧）与 `mc-renderer`（同）；
// 其余 1.16.5 声明件要么两套并用（真混合，不判）、要么无判别名。1.15.2 档缺 Mojang 成员名源
// （`client.txt` 不可再分发 ⇒ 不入库）⇒ 该档本腿记「许可桶」（见 judged.noMemberTablesLicense）。
const MAX_PRINT = 40;

/** 档位类名层（纯函数，可自证）。`ver` 为空 ⇒ 版本无关子面（neoforge 根级），按 mojmap 判。 */
export function layerOf(platform, ver) {
  if (platform === "bedrock") return null;
  if (platform === "fabric") return ver === "26.1.2" ? "mojmap" : "yarn";
  if (platform === "quilt") return "yarn";
  if (platform === "liteloader" || platform === "rift" || platform === "modloader") return "mcp";
  if (platform === "forge") {
    const p = String(ver).split(".").map(Number);
    return p[0] * 100 + (p[1] || 0) <= 116 ? "mcp" : "mojmap";
  }
  if (platform === "neoforge") return "mojmap";
  return null;
}

/** 从 `client.txt`（Mojang 官方，点号 FQCN）取**顶层简名**集合。 */
function mojmapClassesOf(root, ver) {
  const out = new Set();
  try {
    for (const l of fs.readFileSync(path.join(root, "data", `forge_${ver}`, "mappings", "client.txt"), "utf8").split(/\r?\n/)) {
      const m = /^([\w.$]+)\s*->/.exec(l);
      if (!m) continue;
      const simple = m[1].slice(m[1].lastIndexOf(".") + 1);
      if (/^[A-Z][A-Za-z0-9_]*$/.test(simple)) out.add(simple);
    }
  } catch {
    /* 无 client.txt（≤1.15.2）⇒ 空集 */
  }
  return out;
}
/** 1.16.5 的 MCP 类名（tsrg 顶层简名）。 */
function mcpClasses16(root) {
  const out = new Set();
  try {
    for (const l of fs.readFileSync(path.join(root, "data", "forge_1.16.5", "mappings", "obf_to_srg.tsrg"), "utf8").split(/\r?\n/)) {
      if (!l || /^[\t ]/.test(l)) continue;
      const m = /^CL:\s+\S+\s+(\S+)/.exec(l) ?? /^(\S+)\s+(\S+)$/.exec(l);
      const mapped = m ? (m[2] ?? m[1]) : null;
      if (!mapped) continue;
      const simple = mapped.slice(mapped.lastIndexOf("/") + 1);
      // **只取顶层名**：嵌套段名（`AbstractBlock$Properties` → `Properties`）是通用词，当证据会产成批
      // 假阳性 —— 与 leg2 修正③同一条教训（`Properties`/`Builder`/`Type`/`Phase` 全属此类）。
      if (/^[A-Z][A-Za-z0-9_]*$/.test(simple)) out.add(simple);
    }
  } catch {
    /* 源不在 ⇒ 空集（腿 C/D 自动失效，不静默绿：摘要行会打印集合大小） */
  }
  return out;
}
/** 某 MCP 老档自己的类名集合（joined.srg / joined.tsrg）；无源返回 null。 */
function ownMcpClasses(root, ver) {
  for (const f of [`data/forge_${ver}/mappings/joined.tsrg`, `data/forge_${ver}/mappings/joined.srg`]) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    const out = new Set();
    for (const l of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = /^CL:\s+\S+\s+(\S+)/.exec(l) ?? /^[a-zA-Z_$][\w$]*\s+(\S+)/.exec(l);
      if (!m) continue;
      const mapped = m[1];
      const simple = mapped.slice(mapped.lastIndexOf("/") + 1).split("$").pop();
      if (/^[A-Z][A-Za-z0-9_]*$/.test(simple)) out.add(simple);
    }
    if (out.size) return out;
  }
  return null;
}
/**
 * 腿 E（**成员名族**，混合档专用）：`forge ≤1.16.5` 是**混合档** —— 该档 `official` 通道 = MCP 类名 +
 * **Mojang 成员名**，而 `mcp` 通道 = MCP 类名 + **MCP 成员名**；两通道**类名同一套**，唯一差别落在成员名
 * （`getLevel`/`isClientSide` ↔ `getWorld`/`isRemote`；`Block$Properties.of` ↔ `create`）。判据（保守）：
 * 声明 `mcp` 却**只有** Mojang 侧成员名证据、或声明 `official` 却**只有** MCP 侧证据 ⇒ 红；
 * 「两套并用」（真混合）与「无判别名」不判（实测 1.16.5 多数件属前者）。一手依据见
 * `docs/knowledge-coverage-sweep-20260924.md` §6.10。
 */
function mcpMembersOf(root, ver) {
  const dir = path.join(root, "data", `forge_${ver}`, "mappings");
  const out = new Set();
  const read = (p) => {
    try {
      for (const l of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
        const c = l.split(",");
        if (c.length > 1 && c[1] && c[1] !== "name" && c[1] !== "field") out.add(c[1]);
      }
    } catch {}
  };
  for (const f of ["methods.csv", "fields.csv"]) read(path.join(dir, f));
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      for (const f of ["methods.csv", "fields.csv"]) read(path.join(dir, e.name, f));
    }
  } catch {}
  return out.size ? out : null;
}
/** Mojang 成员名：`client.txt`（gitignored + 许可不可再分发）。缺 = **许可桶**（合法跳过，只计数）；
 *  **与「数据洞」分桶**——有 client.txt 却缺已纳管 MCP named csv = tracked 数据缺失 ⇒ 计 rc
 *  （2026-09-25 审阅修正：原实现把两种原因混进一个 `noMemberTables`，clone 上会被读成许可原因 ⇒ 腿 E 静默失效）。 */
function mojangMembersOf(root, ver) {
  const out = new Set();
  let seen = false;
  try {
    for (const raw of fs.readFileSync(path.join(root, "data", `forge_${ver}`, "mappings", "client.txt"), "utf8").split(/\r?\n/)) {
      if (!raw || raw.startsWith("#")) continue;
      const l = raw.trim();
      const m = /^\d+:\d+:[^ ]+ (\w+)\(/.exec(l);
      if (m) { out.add(m[1]); seen = true; continue; }
      const f = /^[\w.$]+ (\w+) -> \w+$/.exec(l);
      if (f) { out.add(f[1]); seen = true; }
    }
  } catch {}
  return seen ? out : null;
}
const MEMBER_OK = (t) => t.length >= 5 && /^[a-z][A-Za-z0-9]*$/.test(t) && /[A-Z]/.test(t);

/**
 * 纳管表完整性（2026-09-25 审阅修正）：`*provenance*.json` 是「这批表应当存在且应当入库」的标记——
 *  ① 标记在而其 `contains` 列的 csv 缺 ⇒ **数据洞**（红，与 client.txt 有无无关）；
 *  ② csv 在盘却未被 git 跟踪 ⇒ 「忘了 add」（**WARN** 不计 rc：本仓工作流本就整树未提交，由 L10 清单收口；
 *     git 不可用 ⇒ 跳过不误报）。
 * 背景：原实现把「许可缺 client.txt」与「数据缺失」混进一个计数器，clone 上会被读成许可原因 ⇒ 腿 E 静默失效。
 */
function provenanceAudit(root) {
  const holes = [];
  const untracked = [];
  const mroot = path.join(root, "data");
  let packs = [];
  try {
    packs = fs.readdirSync(mroot, { withFileTypes: true }).filter((e) => e.isDirectory() && /^forge_/.test(e.name));
  } catch {
    return { holes, untracked };
  }
  const markers = [];
  for (const p of packs) {
    const mdir = path.join(mroot, p.name, "mappings");
    let ents = [];
    try {
      ents = fs.readdirSync(mdir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of ents) {
      if (e.isFile() && /provenance.*\.json$/.test(e.name)) markers.push({ dir: mdir, marker: path.join(mdir, e.name) });
      else if (e.isDirectory()) {
        const marker = path.join(mdir, e.name, "provenance.json");
        if (fs.existsSync(marker)) markers.push({ dir: path.join(mdir, e.name), marker });
      }
    }
  }
  for (const { dir, marker } of markers) {
    let contains = ["methods.csv", "fields.csv"];
    try {
      const j = JSON.parse(fs.readFileSync(marker, "utf8"));
      if (Array.isArray(j.contains) && j.contains.length) contains = j.contains;
    } catch {}
    const relMarker = path.relative(root, marker).replace(/\\/g, "/");
    const missing = contains.filter((f) => !fs.existsSync(path.join(dir, f)));
    if (missing.length) {
      holes.push({ rel: relMarker, leg: "E/已纳管表缺失", tok: missing.join(",") });
      continue;
    }
    const csvs = contains.map((f) => path.join(dir, f)).filter((p) => fs.existsSync(p));
    if (!csvs.length) continue;
    const r = spawnSync("git", ["-C", root, "ls-files", "--", ...csvs.map((p) => path.relative(root, p).replace(/\\/g, "/"))], { encoding: "utf8" });
    if (r.status !== 0) continue; // git 不可用 ⇒ 不误报
    const tracked = new Set(String(r.stdout || "").split(/\r?\n/).filter(Boolean));
    const notTracked = csvs.map((p) => path.relative(root, p).replace(/\\/g, "/")).filter((p) => !tracked.has(p));
    if (notTracked.length) untracked.push({ rel: relMarker, files: notTracked });
  }
  return { holes, untracked };
}
export function memberFlagsFor({ declared, code, mcp, moj }) {
  if ((declared !== "mcp" && declared !== "official") || !mcp || !moj) return [];
  const mcpOnly = new Set([...mcp].filter((n) => MEMBER_OK(n) && !moj.has(n)));
  const mojOnly = new Set([...moj].filter((n) => MEMBER_OK(n) && !mcp.has(n)));
  const calls = new Set([
    ...[...code.matchAll(/(?<![\w$.])([a-z][A-Za-z0-9]*)\s*\(/g)].map((m) => m[1]),
    ...[...code.matchAll(/\.([a-z][A-Za-z0-9]*)\b/g)].map((m) => m[1]),
  ]);
  let mV = 0;
  let jV = 0;
  for (const t of calls) {
    if (mcpOnly.has(t)) mV += 1;
    if (mojOnly.has(t)) jV += 1;
  }
  if (declared === "mcp" && mV === 0 && jV > 0) return [{ leg: "E/声明mcp但只见Mojang成员名", tok: `${jV} 处` }];
  if (declared === "official" && jV === 0 && mV > 0) return [{ leg: "E/声明official但只见MCP成员名", tok: `${mV} 处` }];
  return [];
}
/** 同代 mojmap 名（腿 D 用）：1.16.5 + 1.17.1 的 client.txt 并集，扣掉 MCP 类名。 */
function eraMojmapOnly(root, mcp) {
  const out = new Set();
  for (const v of ["1.16.5", "1.17.1"]) for (const n of mojmapClassesOf(root, v)) if (!mcp.has(n)) out.add(n);
  return out;
}

/** 腿 E 的取件：**声明件**只存在于 `.cursor/skills/**` —— 主循环按 leg2 口径把它们排除了，故单独收。 */
function collectDeclared(root) {
  const out = [];
  for (const pf of PLATFORMS) {
    const base = path.join(root, pf);
    if (!fs.existsSync(base)) continue;
    for (const v of fs.readdirSync(base, { withFileTypes: true })) {
      if (!v.isDirectory() || !/^\d/.test(v.name)) continue;
      const d = path.join(base, v.name, ".cursor", "skills");
      if (!fs.existsSync(d)) continue;
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory()) {
          const f = path.join(d, e.name, "SKILL.md");
          if (fs.existsSync(f)) out.push(path.relative(root, f).replace(/\\/g, "/"));
        } else if (e.isFile() && e.name.endsWith(".md")) {
          out.push(path.relative(root, path.join(d, e.name)).replace(/\\/g, "/"));
        }
      }
    }
  }
  return out;
}

/** 收集本门面内的文件（递归；不含镜像、`.cursor/skills/**`、`data`/`temp`/`dist`）。 */
function collect(root) {
  const out = [];
  for (const pf of PLATFORMS) {
    const base = path.join(root, pf);
    if (!fs.existsSync(base)) continue;
    for (const v of fs.readdirSync(base, { withFileTypes: true })) {
      if (!v.isDirectory()) continue;
      const isVer = /^\d/.test(v.name);
      if (pf === "neoforge" && !isVer && !NEOFORGE_VERSIONLESS.has(v.name)) continue;
      if (pf !== "neoforge" && !isVer) continue;
      const stack = [path.join(base, v.name)];
      while (stack.length) {
        const dir = stack.pop();
        let ents = [];
        try {
          ents = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
          continue;
        }
        for (const e of ents) {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) {
            if (MIRROR.test(p + "/") || ["data", "temp", "dist", "node_modules", "build", ".git"].includes(e.name)) continue;
            if (e.name === "skills" && /[\\/]\.cursor[\\/]/.test(p + "/")) continue; // leg2 的面
            stack.push(p);
          } else if (/\.(md|mdc|java)$/.test(e.name)) {
            out.push(path.relative(root, p).replace(/\\/g, "/"));
          }
        }
      }
    }
  }
  return out;
}

/** 取该文件里「代码位」文本（md/mdc = 围栏代码；java = 全文）。 */
export function codeOf(rel, text) {
  if (/\.java$/.test(rel)) return text;
  return (text.match(/^```[\s\S]*?^```/gm) ?? [])
    .join("\n")
    .split(/\r?\n/)
    .filter((l) => !NOUN_LINE.test(l))
    .join("\n");
}

/**
 * 纯判据：给一族集合与一段代码文本，返回冲突 [{tok, leg}]。
 * sets = { mojmapOnly, yarnOnly, mcpTop, mojmapOwn, eraMojmapOnly, ownMcp }
 */
export function flagsFor({ layer, code, sets }) {
  const out = [];
  const seen = new Set();
  const src = String(code);
  for (const m of src.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)) {
    const t = m[0];
    if (t.length < 3 || !/^[A-Z]/.test(t)) continue;
    // **大写限定 = 成员访问，不是类引用**（2026-09-25 Phase 案）：`TickEvent.Phase.END` 里的 `Phase`
    // 是 Forge 事件的嵌套枚举；它进 mcpTop 是因为 1.16.5 vanilla 恰好有个同简名的龙阶段类
    // （tsrg `net/minecraft/entity/boss/dragon/phase/Phase`，1.17 起映射为 `EnderDragonPhase` ⇒
    // 五版 client.txt 逐字可核）。点号前是**大写开头的限定名** ⇒ 判为嵌套/静态成员访问，四腿都不判。
    // 小写限定（`net.minecraft.world.level.Level` 这类 FQCN/import 的真类引用）**照判**，不收此豁免。
    if (src[m.index - 1] === ".") {
      const before = /([A-Za-z_$][A-Za-z0-9_$]*)\.$/.exec(src.slice(0, m.index));
      if (before && /^[A-Z]/.test(before[1])) continue;
    }
    let leg = null;
    if (layer === "yarn" && sets.mojmapOnly?.has(t)) leg = "A/mojmap名@yarn档";
    else if (layer === "mojmap") {
      if (sets.yarnOnly?.has(t)) leg = "B/yarn名@mojmap档";
      else if (sets.mcpTop?.has(t) && sets.mojmapOwn && !sets.mojmapOwn.has(t)) leg = "C/MCP名@mojmap档";
    } else if (layer === "mcp") {
      if (sets.eraMojmapOnly?.has(t) && sets.ownMcp && !sets.ownMcp.has(t)) leg = "D/mojmap名@MCP档";
    }
    if (leg && !seen.has(t)) {
      seen.add(t);
      out.push({ tok: t, leg });
    }
  }
  return out;
}
/** 该文件的该 token 是否被豁免。 */
function allowed(rel, tok) {
  return ALLOW.some((a) => a.match.test(rel) && a.tokens.has(tok));
}

function judge(root, pairs) {
  const mcpTop = mcpClasses16(root);
  const era = eraMojmapOnly(root, mcpTop);
  const mojOwnCache = new Map();
  const ownCache = new Map();
  /** 该档 mojmap 类名集合；**无 client.txt ⇒ null**（腿 C 自动失效——不能把「源不在」当成「本档什么都没有」）。 */
  const mojOwnOf = (v) => {
    if (!mojOwnCache.has(v)) {
      const s = mojmapClassesOf(root, v);
      mojOwnCache.set(v, s.size ? s : null);
    }
    return mojOwnCache.get(v);
  };
  const conflicts = [];
  const legCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  const judged = { files: 0, withCode: 0, noPairs: 0, noMemberTablesLicense: 0, noMemberTablesData: 0 };
  const memberSetCache = new Map();
  for (const rel of collect(root)) {
    const [pf, ver] = rel.split("/");
    const layer = layerOf(pf, ver);
    if (!layer) continue;
    judged.files++;
    let text = "";
    try {
      text = fs.readFileSync(path.join(root, rel), "utf8");
    } catch {
      continue;
    }
    const code = codeOf(rel, text);
    if (!code.trim()) continue;
    judged.withCode++;
    const p = pairs?.[ver] ?? null;
    // 无该档对照产物 ⇒ **不拿跨档并集凑**（那会成批假阳性）：yarn 档直接不判并计入 noPairs；
    // mojmap 档仍有腿 C（MCP 名）可用，mcp 档仍有腿 D（同代 mojmap 名）可用。
    if (layer === "yarn" && !p) {
      judged.noPairs++;
      continue;
    }
    const sets = {
      mojmapOnly: p ? p.mojmapOnly : null,
      yarnOnly: p ? p.yarnOnly : null,
      mcpTop: layer === "mojmap" ? mcpTop : null,
      mojmapOwn: layer === "mojmap" ? mojOwnOf(ver) : null,
      eraMojmapOnly: layer === "mcp" ? era : null,
      ownMcp: layer === "mcp" ? (ownCache.has(ver) ? ownCache.get(ver) : (ownCache.set(ver, ownMcpClasses(root, ver) ?? mcpTop), ownCache.get(ver))) : null,
    };
    for (const f of flagsFor({ layer, code, sets })) {
      if (allowed(rel, f.tok)) continue;
      legCounts[f.leg[0]] += 1;
      conflicts.push({ rel, ...f });
    }
    // 腿 E 在主循环**之外**单独跑（声明件被本循环排除，见 collectDeclared）
  }
  // ── 腿 E：混合档（forge ≤1.16.5）声明件的成员名族 ─────────────────────────
  judged.memberJudged = 0;
  for (const rel of collectDeclared(root)) {
    const [pf, ver] = rel.split("/");
    if (layerOf(pf, ver) !== "mcp") continue;
    let text = "";
    try {
      text = fs.readFileSync(path.join(root, rel), "utf8");
    } catch {
      continue;
    }
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text.replace(/^\uFEFF/, ""));
    const declared = fm ? (/^mappings:\s*(.*)$/m.exec(fm[1]) || [])[1]?.trim() : null;
    if (declared !== "mcp" && declared !== "official") continue;
    if (!memberSetCache.has(ver)) {
      const mcp = mcpMembersOf(root, ver);
      const moj = mojangMembersOf(root, ver);
      // 分桶（2026-09-25 审阅修正）：缺 client.txt = **许可桶**（不可再分发，合法跳过，只计数）；
      // 有 client.txt 却缺已纳管 MCP named csv = **数据洞**（tracked 数据缺失 ⇒ 计 rc）。
      memberSetCache.set(ver, !moj ? "license" : mcp ? { mcp, moj } : "data-hole");
    }
    const ms = memberSetCache.get(ver);
    if (ms === "license") { judged.noMemberTablesLicense += 1; continue; }
    if (ms === "data-hole") {
      judged.noMemberTablesData += 1;
      conflicts.push({ rel: `data/forge_${ver}/mappings/`, leg: "E/数据洞（有 client.txt 缺已纳管 MCP csv）", tok: "missing" });
      continue;
    }
    const code = codeOf(rel, text);
    if (!code.trim()) continue;
    judged.memberJudged += 1;
    for (const f of memberFlagsFor({ declared, code, ...ms })) {
      legCounts.E += 1;
      conflicts.push({ rel, ...f });
    }
  }
  const prov = provenanceAudit(root);
  for (const h of prov.holes) {
    legCounts.E += 1;
    conflicts.push(h);
  }
  return {
    conflicts,
    judged,
    legCounts,
    memberUntracked: prov.untracked,
    sets: { mcpTop: mcpTop.size, era: era.size, pairsVersions: Object.keys(pairs ?? {}).length },
  };
}

if (SELFTEST) {
  let fails = 0;
  const chk = (name, got, want) => {
    const ok = got === want;
    if (!ok) fails++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}  实际=${got} 期望=${want}`);
  };
  // 纯判据夹具
  const S = {
    mojmapOnly: new Set(["Level", "ServerLevel", "BlockBehaviour"]),
    yarnOnly: new Set(["World", "ServerWorld", "AbstractBlock"]),
    mcpTop: new Set(["World", "ServerWorld", "TileEntity", "BlockPos", "Phase"]),
    mojmapOwn: new Set(["Level", "ServerLevel", "BlockPos"]),
    eraMojmapOnly: new Set(["Level", "ServerLevel", "Player"]),
    ownMcp: new Set(["World", "ServerWorld", "TileEntity"]),
  };
  const n = (layer, code) => flagsFor({ layer, code, sets: S }).length;
  chk("A：yarn 档用 mojmap 名 ⇒ 1", n("yarn", "Level l = null;"), 1);
  chk("A 对照：yarn 档用同名（不在集合）⇒ 0", n("yarn", "Foo f = null;"), 0);
  chk("B：mojmap 档用 yarn 名 ⇒ 1", n("mojmap", "ServerWorld w = null;"), 1);
  chk("C：mojmap 档用本档不存在的 MCP 名 ⇒ 1", n("mojmap", "TileEntity t = null;"), 1);
  chk("C 对照：MCP 名但在本档 mojmap 里也有 ⇒ 0", n("mojmap", "BlockPos p = null;"), 0);
  // 大写限定豁免（2026-09-25 Phase 案）三连：豁免对 / 不扩大化 / 小写限定（FQCN）照判
  chk("C 限定豁免：`TickEvent.Phase.END` 成员访问 ⇒ 0", n("mojmap", "if (e.getPhase() == TickEvent.Phase.END) {}"), 0);
  chk("C 豁免不扩大化：裸 `Phase p = null;` ⇒ 1", n("mojmap", "Phase p = null;"), 1);
  chk("A 小写限定照判：FQCN `net.minecraft.world.level.Level` ⇒ 1", n("yarn", "net.minecraft.world.level.Level l = null;"), 1);
  chk("D：MCP 档用同代 mojmap 名 ⇒ 1", n("mcp", "Level l = null;"), 1);
  chk("D 对照：MCP 档用本档 MCP 名 ⇒ 0", n("mcp", "TileEntity t = null;"), 0);
  chk("小写/短名不判 ⇒ 0", n("yarn", "level x = null; ab = 1;"), 0);
  // 层推导
  chk("层：forge/1.16.5 = mcp", layerOf("forge", "1.16.5") === "mcp" ? 1 : 0, 1);
  chk("层：forge/1.17.1 = mojmap", layerOf("forge", "1.17.1") === "mojmap" ? 1 : 0, 1);
  chk("层：fabric/26.1.2 = mojmap", layerOf("fabric", "26.1.2") === "mojmap" ? 1 : 0, 1);
  chk("层：bedrock = null（不判）", layerOf("bedrock", "") === null ? 1 : 0, 1);
  // 代码位抽取：md 只取围栏；散文/专有名词不计
  chk("抽取：md 散文里的名字不计 ⇒ 0", codeOf("fabric/1.20.1/knowledge/x.md", "正文 Level 提一句。\n").length, 0);
  chk(
    "抽取：md 围栏里的名字计入",
    /Level/.test(codeOf("fabric/1.20.1/knowledge/x.md", "```java\nLevel l = null;\n```\n")) ? 1 : 0,
    1,
  );
  chk("抽取：专有名词行剔除", /Minecraft/.test(codeOf("fabric/1.20.1/knowledge/x.md", "```\n→ Minecraft Wiki 页面\n```\n")) ? 1 : 0, 0);
  chk("抽取：.java 取全文", /Level/.test(codeOf("forge/1.18.2/scaffold/X.java", "Level l;")) ? 1 : 0, 1);
  // 腿 E（混合档成员名族）：只有「相反」才判；两套并用 / 无判别名都不判
  const MS = { mcp: new Set(["isRemote", "getEntityWorld", "createBlockStateDefinition"]), moj: new Set(["isClientSide", "getLevel", "createAttributes"]) };
  chk("E：声明 mcp 却只见 Mojang 成员名 ⇒ 1", memberFlagsFor({ declared: "mcp", code: "if (world.isClientSide) {}", ...MS }).length, 1);
  chk("E：声明 mcp 且用 MCP 成员名 ⇒ 0", memberFlagsFor({ declared: "mcp", code: "world.isRemote();", ...MS }).length, 0);
  chk("E：两套并用（真混合档）⇒ 0", memberFlagsFor({ declared: "mcp", code: "a.isRemote(); b.isClientSide();", ...MS }).length, 0);
  chk("E：无判别名 ⇒ 0", memberFlagsFor({ declared: "mcp", code: "foo.bar();", ...MS }).length, 0);
  chk("E：声明 official 却只见 MCP 名 ⇒ 1", memberFlagsFor({ declared: "official", code: "e.getEntityWorld();", ...MS }).length, 1);
  chk("E：无成员名表（缺表）⇒ 0", memberFlagsFor({ declared: "mcp", code: "x.isRemote();", mcp: null, moj: null }).length, 0);
  // 端到端：合成根 + 合成 pairs ⇒ 先红后绿
  {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "xlayer-"));
    const put = (rel, s) => {
      const abs = path.join(tmp, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, s, "utf8");
    };
    put("data/forge_1.16.5/mappings/obf_to_srg.tsrg", "a net/minecraft/world/World\nb net/minecraft/block/Block\n");
    put("data/forge_1.16.5/mappings/client.txt", "net.minecraft.world.level.Level -> abc:\n");
    put("data/forge_1.13.2/mappings/joined.tsrg", "aa net/minecraft/world/World\n");
    put("data/forge_1.18.2/mappings/client.txt", "net.minecraft.world.level.Level -> abc:\n");
    const pd = path.join(tmp, "_pairs");
    fs.mkdirSync(pd, { recursive: true });
    fs.writeFileSync(path.join(pd, "index.json"), JSON.stringify({ versions: { "1.18.2": { file: "yarn-mojmap-1.18.2.json", count: 1 } } }));
    fs.writeFileSync(path.join(pd, "yarn-mojmap-1.18.2.json"), JSON.stringify({ version: "1.18.2", count: 1, pairs: [{ obf: "a", mojmap: "Level", yarn: "ServerWorld" }] }));
    const bad = [
      ["forge/1.18.2/code-patterns/x.md", "```java\nServerWorld w = null;\n```\n"], // 腿 B
      ["forge/1.16.5/knowledge/y.md", "```java\nLevel l = null;\n```\n"], // 腿 D
      ["fabric/1.18.2/knowledge/z.md", "```java\nLevel l = null;\n```\n"], // 腿 A（基线 0 ⇒ 必红；无产物则跳过）
    ];
    for (const [rel, s] of bad) put(rel, s);
    const run = () =>
      spawnSync(process.execPath, [fileURLToPath(import.meta.url), `--root=${tmp}`, `--pairs-dir=${pd}`, "--strict"], {
        encoding: "utf8",
        env: { ...process.env, NODE_OPTIONS: "" },
      });
    let r = run();
    const out = String(r.stdout || "") + String(r.stderr || "");
    const okE2e = r.status === 1 && /:: ServerWorld/.test(out) && /:: Level/.test(out);
    if (!okE2e) console.log("     ↳ 端到端输出：\n" + out.split(/\r?\n/).slice(0, 14).map((l) => "       " + l).join("\n"));
    chk("端到端：三处冲突 ⇒ rc=1 且点名（腿 A/B/D 各一）", okE2e ? 1 : 0, 1);
    for (const rel of ["forge/1.18.2/code-patterns/x.md", "forge/1.16.5/knowledge/y.md", "fabric/1.18.2/knowledge/z.md"]) put(rel, "```java\nint q = 1;\n```\n");
    r = run();
    chk("端到端：清干净 ⇒ rc=0", r.status === 0 ? 1 : 0, 1);
    // require-pairs 两记（2026-09-25 pairs 复现性洞）：产物在 ⇒ 不开开关行为不变；产物缺 + 开关开 ⇒ 响亮红
    const pd0 = path.join(tmp, "_pairs_empty");
    fs.mkdirSync(pd0, { recursive: true });
    const runReq = (dir, extra) =>
      spawnSync(process.execPath, [fileURLToPath(import.meta.url), `--root=${tmp}`, `--pairs-dir=${dir}`, ...(extra ?? [])], {
        encoding: "utf8",
        env: { ...process.env, NODE_OPTIONS: "" },
      });
    r = runReq(pd, ["--require-pairs"]);
    chk("require-pairs：产物在 ⇒ rc=0（不误伤）", r.status === 0 ? 1 : 0, 1);
    r = runReq(pd0, ["--require-pairs"]);
    const reqRed = r.status === 1 && /PAIRS_MISSING/.test(String(r.stderr || "") + String(r.stdout || ""));
    chk("require-pairs：产物缺 ⇒ rc=1 且点名 PAIRS_MISSING（静默失效改响亮）", reqRed ? 1 : 0, 1);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(fails ? `selftest FAILED（${fails} 例）` : "selftest OK");
  process.exit(fails ? 1 : 0);
}

// ⚠️ `loadPairs` 返回的是 **Map**（leg2 内部按 Map 用）；本门按版本号下标取值 ⇒ 必须先摊平成对象，
// 否则 `pairs?.[ver]` 恒 undefined 而**腿 A/B 静默失效**（首测已踩：pairs 档显示 0）。
const pairsMap = loadPairs(PAIRS, ROOT);
const pairs = pairsMap ? Object.fromEntries(pairsMap) : null;
if (REQUIRE_PAIRS && !(pairs && Object.keys(pairs).length)) {
  console.error(
    "assert-cross-layer-names: PAIRS_MISSING —— --require-pairs 开启，但对照产物不在（" +
      `查找目录 = ${PAIRS}）。` +
      "腿 A/B（yarn↔mojmap 对照）此刻是**静默不判**的，基线 A/B 读数在此环境不构成检验。\n" +
      "  再生：node mcp-server/scripts/build-yarn-mojmap-pairs.mjs [--offline] [--out=<dir>]" +
      "（产物按许可**不入库**；CI 环境不要开本开关）",
  );
  process.exit(1);
}
const res = judge(ROOT, pairs);
// 「忘了 add」走 WARN 不计 rc（本仓工作流整树未提交是常态，由 L10 清单收口）；但必须**每次可见**，
// 否则就是审阅指出的那种「失效被解释成设计」。
for (const w of res.memberUntracked ?? []) {
  console.log(`  ⚠️ 纳管表未 git add（clean clone 断链，L10 口径）：${w.rel} :: ${w.files.join(", ")}`);
}
const { judged, sets, legCounts } = res;
const ab = legCounts.A + legCounts.B;
const brief = () =>
  `判 ${judged.withCode} 件含代码 / 扫 ${judged.files} 件；腿计数 A=${legCounts.A} B=${legCounts.B} C=${legCounts.C} D=${legCounts.D} E=${legCounts.E}；` +
  `基线${STRICT ? "（--strict 已归零）" : ""} A/B=${STRICT ? 0 : BASELINE} C=${STRICT ? 0 : BASELINE_C} D=${STRICT ? 0 : BASELINE_D} E=${STRICT ? 0 : BASELINE_E}；` +
  `集合：pairs 档 ${sets.pairsVersions} / 顶层 MCP 名 ${sets.mcpTop} / 同代 mojmap 名 ${sets.era}；无对照产物 ${judged.noPairs} 件 · ` +
  `无成员名表：许可 ${judged.noMemberTablesLicense}（合法跳过）· 数据洞 ${judged.noMemberTablesData}（计 rc）`;
if (DUMP) {
  console.log(`  cross-layer dump：冲突 ${res.conflicts.length} 件（${brief()}）`);
  for (const c of res.conflicts) console.log(`  CROSS ${c.rel} :: ${c.tok} (${c.leg})`);
  process.exit(0);
}
const bAB = STRICT ? 0 : BASELINE;
const bC = STRICT ? 0 : BASELINE_C;
const bD = STRICT ? 0 : BASELINE_D;
const bE = STRICT ? 0 : BASELINE_E;
if (ab > bAB || legCounts.C > bC || legCounts.D > bD || legCounts.E > bE) {
  console.error(
    `assert-cross-layer-names: 新增跨层名冲突 —— A/B=${ab}（基线 ${bAB}）C=${legCounts.C}（基线 ${bC}）D=${legCounts.D}（基线 ${bD}）E=${legCounts.E}（基线 ${bE}）`,
  );
  console.error(`  ${brief()}`);
  const shown = res.conflicts.filter((c) => c.leg[0] === "A" || c.leg[0] === "B");
  for (const c of (shown.length ? shown : res.conflicts).slice(0, MAX_PRINT)) console.error(`  ${c.rel} :: ${c.tok}（${c.leg}）`);
  process.exit(1);
}
console.log(`assert-cross-layer-names: ok（${brief()}）`);
