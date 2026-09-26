/**
 * 门：含围栏代码的 Skill 正文必须声明 frontmatter `mappings:` 键（非空），且**键值与正文实名一致**。
 *
 * 两腿（A7，2026-09-24）：
 *   · leg1（纯本地，无外部数据）：含围栏代码 ⇒ 必须有 `mappings:`；声明 `mappings_alt` ⇒ 必须有
 *     「### ⚠️ 映射口径」披露块且块里有四列对照行；有对照行却没 `mappings_alt` 也算红。
 *     另判**值域**（前缀必须在册：「值+括注」取前缀）与**值-版本**（`mcp` 只在 ≤1.16.5 的 forge 档成立；
 *     跨平台件带 `platforms:` 数组者不按档位判）——2026-09-25 修复批防复发，证据见 `MAPPING_VALUE_PREFIXES` 注释。
 *   · leg2（需对照产物，见下）：`mappings:` 声称的值必须与正文**实际用到的类名所属映射**一致 ——
 *     声称 yarn 却用 mojmap 名（无 `mappings_alt`）⇒ 红；声明了 alt 却没在披露块点名实际用到的跨映射名 ⇒ 红。
 *     ⚠️ 依赖 mojmap 侧类名：`client.txt` 本体（gitignored + 许可明文禁止再分发完整件）**不入库**，
 *     但按它 join 出来的**派生对照表**已于 2026-09-25 裁定入库 —— 读侧默认
 *     `data/_yarn-mojmap-pairs/`（**15 档 / 112,971 类名对**；二次发布把 1.20.6 / 1.21.5 补进，
 *     见该目录 provenance 的 `extendedNote`，字节 sha 钉在那）；
 *     生成器 `scripts/build-yarn-mojmap-pairs.mjs` 仍只写 `$MC_SKILL_CACHE`（或 OS tmpdir），从不写仓库。
 *     **产物不在 ⇒ 打印 `leg2 skipped（…）` 并保持 leg1 的退出码**（不静默绿，也不假装判过）。
 *
 * 判据修正（2026-09-25，G4/A7 清尾；复算证据 = `docs/knowledge-coverage-sweep-20260924.md` §6.6）：
 *   旧算法把角色建在「跨映射对的整名」上，两类**假阳性**（首测 123 件里 74 件）：
 *     ① **等名对被跳过**：`mojmap Material ↔ yarn Material` 这类同行同简名对不进两侧集合 ⇒ 简名失去
 *        「另一侧也存在」的保护，被无关行（`client.model.Material ↔ SpriteIdentifier`）毒成 mojmapOnly；
 *     ② **嵌套类简名匹配不上**：两侧都是 `Item$Settings` / `BlockBehaviour$Properties` 形态（见
 *        sqlite `classes.named` / tiny named 列 / client.txt `X$Y` 行），正文写的是 `Settings` /
 *        `Properties` ⇒ 整名比对永远错过，`[Settings]` 这类报点必假。
 *   修正：① 等名对也进两侧集合；② 两侧再并入**嵌套类最内段**作保护（yarn 侧 = `yarn-*-tiny.gz` 的
 *   named 列，mojmap 侧 = `client.txt`；两源缺失时退到产物里的 `$` 形态）；③ **段名只做保护、不做
 *   证据**（`Configuration` / `System` / `Method` / `EntryBuilder` 这类段名是通用词，当证据会再产一批
 *   假阳性）；④ 第三方库撞名走**逐文件豁免台账**（`LEG2_FILE_ALLOW`，逐条给 why）；
 *   ⑤ **元语境行不算用法**（`不要/禁止/❌/没有 X` 禁止句 + `Minecraft Wiki/EULA` 专有名词）；
 *   ⑥ **MCP 类名保护**（官方方向）：Forge 官方 1.16.x 文档逐字 —— 「The official mappings provide all
 *   method and field names, **with the class names coming in 1.17**」
 *   （https://docs.minecraftforge.net/en/1.16.x/gettingstarted/）⇒ 1.16.5 的 `official` 通道**不含类名**、
 *   类名沿用 MCP 层（同源佐证：1.16.5 MDK 的 `build.gradle` 注释「official MCVersion Official field/method
 *   names from Mojang mapping files」；仓内 `data/forge_1.16.5/mappings/obf_to_srg.tsrg` 即 MCP 类名源，
 *   1.17.1+ 无此源 ⇒ 保护集为空，恰对应「1.17 起 official 含类名」）⇒ `yarnOnly` 扣除 MCP 类名，
 *   见 `mcpClassNameProtect`。
 *   修正后基线按实测重签（见 `LEG2_BASELINE`）。
 *
 * 判据纯本地、只看源稿 .cursor/skills/（投影件由 assert-skill-mirrors 管）。
 * 用法：node assert-skill-mappings-key.mjs [--root=<repo>] [--selftest] [--pairs-dir=<dir>]
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
function argVal(name) {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(argVal("root") || path.join(HERE, "..", ".."));
const SELFTEST = argv.includes("--selftest");
/** 只读清单模式：打印**全部** leg2 冲突（`LEG2 <rel> :: <tokens>` 逐行）+ 退出 0（清理批次用；判红逻辑不变）。 */
const DUMP = argv.includes("--dump-leg2");
/**
 * 本文件既是可执行门、也是**跨层名门的数据源**（`assert-cross-layer-names.mjs` 直接 import 本文件的
 * `loadPairs` / `LEG2_META_LINE` / `PAIRS_DIR`）⇒ 被 import 时不得跑主流程（否则 import 就会判红/退出）。
 * 两份实现会漂移，所以这里刻意只留**一份**名字集合构造。
 */
const isMain = (() => {
  try {
    return !process.argv[1] || path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return true;
  }
})();
export { loadPairs, LEG2_META_LINE, PAIRS_DIR };

const PLATFORMS = ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"];

/**
 * leg1 增两记（2026-09-25 修复批，防复发；证据见门头注）：
 *  · **值域**：`mappings:` 值的前缀必须在册（「值 + 括注」体例取前缀）——`hint` 这类垃圾值当场红；
 *  · **值-版本**：`mcp` 只在 ≤1.16.5 的 forge 档成立。MCP 由 `stable`/`snapshot` 通道生成，而 FG5 官方文档
 *    明言「stable/snapshot **自 1.17 起不再存在**」（1.17+ 只剩 `official`；parchment 是叠在其上的参数名层）。
 *    跨平台件（frontmatter 带 `platforms:` 数组）不按档位判。
 *  · **值-版本（2026-09-25 第二遍补）**：`parchment` 自 **1.16.5** 起才有（ParchmentMC 构件最早
 *    `parchment-1.16.5`；本仓 `data/` 的 parchment 产物也只从 1.16.5 起）——`forge/1.14.4` 曾声明
 *    `parchment`（§6.8 修复批已改回 `mcp`），本条防复发。
 */
const MAPPING_VALUE_PREFIXES = ["yarn", "mcp", "parchment", "official", "mojmap", "mojmap-unobfuscated"];
const MCP_MAX_VERSION = "1.16.5";
const PARCHMENT_MIN_VERSION = "1.16.5";
/** 版本号数值比较 a ≤ b（逐段，段数不足补 0）。 */
function versionAtMost(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x < y;
  }
  return true;
}

function skillFiles(root) {
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

function hasFencedCode(body) {
  const lines = body.split(/\r?\n/);
  let fence = false;
  for (const l of lines) {
    if (/^\s{0,3}```/.test(l)) {
      if (!fence) { fence = true; continue; }
      return true;
      }
  }
  void fence;
  return false;
}

function frontmatter(text) {
  const s = text.replace(/^/, "");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(s);
  return m ? m[1] : null;
}

function mappingValue(fm) {
  const m = /^mappings:\s*(.*)$/m.exec(fm);
  if (!m) return null;
  const v = m[1].trim().replace(/^["']|["']$/g, "");
  return v === "" ? "" : v;
}

function altValue(fm) {
  const m = /^mappings_alt:\s*(.*)$/m.exec(fm);
  if (!m) return null;
  const v = m[1].trim().replace(/^["']|["']$/g, "");
  return v === "" ? "" : v;
}

const DISCLOSE_MARK = /^### ⚠️ 映射口径/;

/**
 * leg2 的**逐文件豁免台账**（2026-09-25 修正④）：命中文件里这些 token 指**第三方库**的类
 * （不是 MC 映射证据），逐条给 why。豁免是「解旗」不是「免责」：文件本身仍受 leg1 与
 * assert-skill-mirrors 管；要加新条目须先给出「该 token 在此文件里确为第三方类」的证据。
 */
const LEG2_FILE_ALLOW = [
  {
    match: /\/mc-cloth-config\.md$|\/mc-cloth-config\/SKILL\.md$/,
    tokens: new Set(["Gui", "Configuration", "EntryBuilder", "ConfigEntry"]),
    why: "Cloth Config 第三方库自带同名类（`@ConfigEntry.Gui.Excluded` 等；文件内已声明「第三方、API 未核实」与 me.shedaniel 坐标）",
  },
];
/** 该文件的该 token 是否被豁免（需 why 在册）。 */
function allowedToken(rel, token) {
  return LEG2_FILE_ALLOW.some((a) => a.match.test(rel) && a.tokens.has(token));
}

/**
 * **元语境行**（修正⑤，2026-09-25）：行内出现这些词时，该行的标识符不算「用了某映射」——
 *   ① 禁止/反例句：`不要` / `禁止` / `❌` / `没有 X` / `无 X.mapping`（点名 mojmap 名是为警告，不是用法；
 *      仓内先例 = `assert-glossary-mojmap-face.mjs` 的「否定感知判别」）；
 *   ② 专有名词：`Minecraft Wiki` / `Minecraft EULA`（站点/产品名，不是类 `net.minecraft.client.Minecraft`）。
 * 证据 = `docs/knowledge-coverage-sweep-20260924.md` §6.6（fabric 19 件里 10 件的报点属这两类）。
 */
const LEG2_META_LINE = /不要|禁止|❌|没有\s*[A-Za-z_]|无\s+[A-Za-z_]|Minecraft\s+(Wiki|EULA)/;

/**
 * leg2 的**存量基线**（口径：本门自带判据 + `build-yarn-mojmap-pairs.mjs` 产的 12 档对照 + 现行语料）。
 * 沿革（每步都有复算证据，明细 = `docs/knowledge-coverage-sweep-20260924.md` §6.6）：
 *   · 2026-09-24 首测 = **123**（旧算法：只按「跨映射对整名」建两侧集合）。
 *   · 2026-09-25 修正①②（等名对进两侧 + 嵌套最内段并入两侧）⇒ 53。
 *   · 2026-09-25 修正③④（**段名只保护不建旗** + 第三方库撞名逐文件豁免台账）⇒ **31**
 *     = fabric 19 + forge 12（`System`/`Override`/`Method`/`Consumer`/`Tick` 等段名假阳性全部退场）。
 *   · 2026-09-25 修正⑤（**元语境行不算用法**：`不要/禁止/❌/没有 X` 与 `Minecraft Wiki/EULA`）⇒ 21。
 *   · 2026-09-25 清理批（子代理逐件分类 + 我落地；行内容全部由 pairs 逐档 join 取证）⇒ 11
 *     （fabric 19 → 0：10 件元语境假阳性 + 9 件补披露行/新建披露块；forge/1.17.1 `Chunk` → `LevelChunk`）。
 *   · 2026-09-25 修正⑥（**MCP 类名保护**）⇒ **0**。剩 11 件「forge/1.16.5 声明 official 却用 MCP 类名」
 *     经外网一手裁决：Forge 官方 1.16.x 文档逐字 —— 「The official mappings provide all method and field
 *     names, **with the class names coming in 1.17**」（docs.minecraftforge.net/en/1.16.x/gettingstarted/；
 *     同源佐证 = 1.16.5 MDK 的 build.gradle 注释「official MCVersion Official field/method names from Mojang
 *     mapping files」）⇒ 1.16.5 的 official 通道**不含类名**、类名沿用 MCP 层 —— **档内成文是对的，是门错**
 *     （早前拿 `client.txt` 当「official 类名」属误读：那是 Mojang 原始文件，FG 在 1.16.5 不从它取类名）。
 *     保护源 = `data/forge_<v>/mappings/` 的 tsrg/srg 类行（1.16.5 有 `obf_to_srg.tsrg`；1.17.1+ 无此源
 *     ⇒ 空集，恰对应「1.17 起 official 含类名」）。见 `mcpClassNameProtect`。
 *   ⑦ **值域扩到 parchment / mcp 族**（2026-09-25 第二遍，堵 `docs/knowledge-coverage-sweep-20260924.md`
 *   §6.8 缺口①）：判据面原来只认 `yarn / mojmap / official` 三值 ⇒ `parchment`（forge 四档 35×4=140 件）
 *   与 `mcp`（≤1.16.5 各档）的键值**根本不进 leg2**（本轮 15 处跨层错名里就有 1 处是 `parchment` 声明件）。
 *   现按**族**判：`yarn` 一侧 ↔ 其余（`mojmap` / `official` / `parchment` / `mcp`）一侧 —— 依据：
 *   `official` 与 `parchment` 都叠在 mojmap 上（parchment 只补参数名/javadoc，见仓根 AGENTS.md:212）；
 *   `mcp`（≤1.16.5）的**类名**沿用 MCP 层，由 `mcpClassNameProtect` 兜底（否则 MCP 类名会被误判成
 *   「用了 Yarn 名」）。扩族后判 437 件（原 315）；8 件首测冲突已全部按内容修正（6 处 = 围栏内注释里的
 *   普通英文/中文用词、2 处 = 上游页面转述的旧套名）。
 * 入口：`--dump-leg2` 打印全部冲突（复核用）。棘轮：**0 = 零容忍**，任何新增冲突（> 基线）即红；
 * 豁免只有两条正当出路：补 `mappings_alt` + 披露块，或入 `LEG2_FILE_ALLOW`（逐条给 why）。
 */
const LEG2_BASELINE = 0;

// 2026-09-26（交接单②，照抄 cross-layer 同名模板）：--require-pairs / MC_SKILL_REQUIRE_PAIRS=1 ⇒
// 无对照产物时**响亮判红**（默认关）。派生对照表已入库 `data/_yarn-mojmap-pairs/`（干净 clone 与 CI
// 都判得了）⇒ 本开关不是给 CI 的，而是维护者复核基线时的**显式断言**：防「leg2 skipped 静默」被读成
// 已覆盖（L57 的活体教训）。CI 勿开——开着的意义只在「要求产物在场」的复核场景。
const REQUIRE_PAIRS = process.argv.includes("--require-pairs") || process.env.MC_SKILL_REQUIRE_PAIRS === "1";

/**
 * leg2 的对照产物落点（2026-09-25 用户裁定：派生对照表**入库**到 `data/_yarn-mojmap-pairs/`）。
 * 默认顺序 = 仓库内发布副本 → `$MC_SKILL_CACHE/yarn-mojmap-pairs` → OS tmpdir，取第一个真有
 * `index.json` 的；仓库副本排第一**不是**因为它更新，而是它的字节 sha 钉在该目录
 * `yarn-mojmap-pairs-provenance.json` 里、干净 clone 与 CI 都拿得到。`$MC_SKILL_CACHE` 那份是生成器
 * 实时输出（可能更新鲜，也可能只有本机有）。档数 / 对数不写进注释 —— 跑动时由本腿打印，见 `leg2 对照源`。
 * 显式 `--pairs-dir` **一律照办**（哪怕指错也要响亮 skipped，不许静默回退到别处的副本）。
 * 四处都不存在时返回**仓库路径**：让 skipped 文案点名的是规范位置。
 */
const PAIRS_DEFAULT = path.join(ROOT, "data", "_yarn-mojmap-pairs");
const PAIRS_CANDIDATES = [
  PAIRS_DEFAULT,
  ...(process.env.MC_SKILL_CACHE ? [path.join(process.env.MC_SKILL_CACHE, "yarn-mojmap-pairs")] : []),
  path.join(os.tmpdir(), "mc-skill-yarn-mojmap-pairs"),
];
const PAIRS_DIR = argVal("pairs-dir")
  ? path.resolve(String(argVal("pairs-dir")))
  : PAIRS_CANDIDATES.find((d) => fs.existsSync(path.join(d, "index.json"))) ?? PAIRS_DEFAULT;

/** 嵌套类最内段（`A$B$C` → `C`；无 `$` → null）。两侧数据都以 `X$Y` 整名存，正文却按简名用。 */
function innermost(name) {
  const i = String(name).lastIndexOf("$");
  return i === -1 ? null : String(name).slice(i + 1);
}
/** 一组类名里的嵌套类最内段集合。 */
function segmentsOf(names) {
  const out = new Set();
  for (const n of names) {
    const seg = innermost(n);
    if (seg) out.add(seg);
  }
  return out;
}
/** yarn 侧嵌套名（`yarn-*-tiny.gz` 的 named 列 / v1 末列）；读不到返回 null（调用方退到产物 `$` 形态）。 */
function yarnNestedSegments(root, version) {
  try {
    const dir = path.join(root, "data", `fabric_${version}`, "mappings");
    const gz = fs.readdirSync(dir).find((f) => /^yarn-.*tiny\.gz$/.test(f));
    if (!gz) return null;
    const text = zlib.gunzipSync(fs.readFileSync(path.join(dir, gz))).toString("utf8");
    return segmentsOf(
      text
        .split("\n")
        .filter((l) => l.startsWith("CLASS\t"))
        .map((l) => l.split("\t").pop()),
    );
  } catch {
    return null;
  }
}
/** mojmap 侧嵌套名（`client.txt` 的 `X$Y -> obf:` 行）；本地 forge 目录 → 产物目录，都读不到返回 null。 */
function mojmapNestedSegments(pairsDir, root, version) {
  const candidates = [
    path.join(root, "data", `forge_${version}`, "mappings", "client.txt"),
    path.join(pairsDir, "mojmap", version, "client.txt"),
  ];
  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue;
      const fqcns = [];
      for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
        if (!line || line.startsWith("#") || /^\s/.test(line)) continue;
        const m = /^([\w.$]+)\s*->\s*[\w$]+:?$/.exec(line.trimEnd());
        if (m) fqcns.push(m[1]);
      }
      return segmentsOf(fqcns);
    } catch {
      /* 换下一个候选 */
    }
  }
  return null;
}

/**
 * **MCP/旧命名层的类名保护集**（修正⑥，2026-09-25；外部一手证据见门头注）：
 * Forge 官方 1.16.x 文档逐字 —— 「The official mappings provide all method and field names,
 * **with the class names coming in 1.17**」⇒ 1.16.5 的 `official` 通道**不含类名**，类名沿用 MCP 层；
 * 因此该档 official 文件里的 `World` / `PlayerEntity` / `AbstractBlock` 等 **MCP 类名是合法写法**，
 * 不是「用了 Yarn 名」。数据源 = 仓内 `data/forge_<v>/mappings/` 的 tsrg/srg 类行（1.16.5 有
 * `obf_to_srg.tsrg`；1.17.1+ 无此源 ⇒ 空集，恰好对应「1.17 起 official 含类名」）。
 * 只用于**消 `yarnOnly`（official/mojmap 方向）的旗**，不影响 `mojmapOnly`（Yarn 方向）。
 */
function mcpClassNameProtect(root, version) {
  const out = new Set();
  const dir = path.join(root, "data", `forge_${version}`, "mappings");
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /\.(tsrg|srg)$/.test(f));
  } catch {
    return out;
  }
  // **回退**（2026-09-25 第三遍补）：1.14.4 / 1.15.2 的 mappings 目录只有 csv/zip、**没有 tsrg/srg**
  // （与 `assert-cross-layer-names.mjs` 同一裁决：1.14.4/1.15.2 无类名源 ⇒ 以 1.16.5 的 tsrg 代——
  // 同为 MCP 类名层）。没有这条回退，1.14 时代 yarn≈MCP 的**同形名**（PlayerEntity / World /
  // ServerWorld / ContainerType / ItemGroup / SoundCategory…）会因「在 pairs 的 yarn 侧」被误判成
  // 「mcp 声明件用了 yarn 名」（pairs 重拉到 13/13 档把 1.14.4 补进判据面时现形，10 件全假红）。
  if (!files.length) {
    const fallback = path.join(root, "data", "forge_1.16.5", "mappings", "obf_to_srg.tsrg");
    try {
      files = [path.basename(fallback)];
      const text = fs.readFileSync(fallback, "utf8");
      for (const line of text.split(/\r?\n/)) {
        if (!line || /^[\t ]/.test(line)) continue;
        const m = /^CL:\s+\S+\s+(\S+)/.exec(line) ?? /^(\S+)\s+(\S+)$/.exec(line);
        const mapped = m ? (m[2] ?? m[1]) : null;
        if (!mapped || !mapped.includes("/")) continue;
        const simple = mapped.slice(mapped.lastIndexOf("/") + 1);
        if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(simple)) continue;
        out.add(simple);
        const inner = simple.slice(simple.lastIndexOf("$") + 1);
        if (inner !== simple) out.add(inner);
      }
    } catch {
      /* 1.16.5 tsrg 也不在 ⇒ 空集（摘要行会打印集合大小，不静默） */
    }
    return out;
  }
  for (const f of files) {
    let text = "";
    try {
      text = fs.readFileSync(path.join(dir, f), "utf8");
    } catch {
      continue;
    }
    for (const line of text.split(/\r?\n/)) {
      if (!line || /^[\t ]/.test(line)) continue; // 缩进行 = 成员，跳过
      const m = /^CL:\s+\S+\s+(\S+)/.exec(line) ?? /^(\S+)\s+(\S+)$/.exec(line);
      const mapped = m ? (m[2] ?? m[1]) : null;
      if (!mapped || !mapped.includes("/")) continue;
      const simple = mapped.slice(mapped.lastIndexOf("/") + 1);
      if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(simple)) continue;
      out.add(simple);
      const inner = simple.slice(simple.lastIndexOf("$") + 1);
      if (inner !== simple) out.add(inner); // 嵌套类也按简名保护（`AbstractBlock$Properties` → `Properties`）
    }
  }
  return out;
}

/** 版本 → {mojmapOnly, yarnOnly}（修正版口径：等名对进两侧 + 嵌套简名并入两侧，见门头注）。 */
function loadPairs(pairsDir, root) {
  const indexPath = path.join(pairsDir, "index.json");
  if (!fs.existsSync(indexPath)) return null;
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch {
    return null;
  }
  const byVersion = new Map();
  for (const [v, e] of Object.entries(meta.versions ?? {})) {
    if (!e?.file || !(e.count > 0)) continue;
    try {
      const payload = JSON.parse(fs.readFileSync(path.join(pairsDir, e.file), "utf8"));
      // **证据集**（可建旗）：只放顶层名；等名对**也**进（它们正是「该简名在两侧都真实存在」的证据，
      // 旧算法先 `if (p.mojmap !== p.yarn)` 跳过 ⇒ 简名被无关行毒进 mojmapOnly，见门头注）。
      const mojmapTop = new Set();
      const yarnTop = new Set();
      for (const p of payload.pairs ?? []) {
        mojmapTop.add(p.mojmap);
        yarnTop.add(p.yarn);
      }
      // **保护集**（只消旗）：顶层 ∪ 嵌套类最内段（主源 = tiny named 列 / client.txt；
      // 缺源退到产物自身的 `$` 形态）。段名**只做保护、不做证据** —— 段名多是通用词
      // （`Configuration` / `System` / `Method` / `EntryBuilder`），拿它当「用了对面映射」的证据
      // 会产出成批假阳性（2026-09-25 修正③，见门头注）。
      const mojmapProtect = new Set(mojmapTop);
      const yarnProtect = new Set(yarnTop);
      for (const s of mojmapNestedSegments(pairsDir, root, v) ?? segmentsOf(mojmapTop)) mojmapProtect.add(s);
      for (const s of yarnNestedSegments(root, v) ?? segmentsOf(yarnTop)) yarnProtect.add(s);
      // **只留无歧义的名**：一个词同时是某类的 mojmap 名与另一类的 yarn 名（含段名保护，
      // 如 `Settings` / `Level` / `Material` / `Properties`）时，词面无法判它属于哪一侧 ⇒ 一律不判。
      const mcpProtect = mcpClassNameProtect(root, v);
      const mojmapOnly = new Set([...mojmapTop].filter((n) => !yarnProtect.has(n)));
      const yarnOnly = new Set([...yarnTop].filter((n) => !mojmapProtect.has(n) && !mcpProtect.has(n)));
      byVersion.set(v, { mojmapOnly, yarnOnly, count: e.count });
    } catch {
      /* 单档读坏按缺档处理（该档的文件会被计入 skipped） */
    }
  }
  return byVersion.size ? byVersion : null;
}

/**
 * leg2：`mappings:` 键值 ↔ 正文实名一致性。
 * 判法：把文件切成标识符 token 集合（一次扫描，避免 9000+ 名字逐个跑正则），
 * 与「另一侧映射」的名字集合求交 —— 交集非空即「正文用了与声称不符的映射名」。
 */
function leg2Check({ root, files, byVersion }) {
  const problems = [];
  const items = [];
  let judged = 0;
  let conflicts = 0;
  let noPairs = 0;
  const tokensOf = (text) => new Set(String(text).match(/[A-Za-z_$][A-Za-z0-9_$]*/g) ?? []);
  for (const rel of files) {
    const version = rel.split("/")[1];
    const text = fs.readFileSync(path.join(root, rel), "utf8");
    const fm = frontmatter(text);
    if (fm === null) continue;
    const declared = mappingValue(fm);
    // 值域族（2026-09-25 修正⑦）：`yarn` 一侧 ↔ 其余（mojmap/official/parchment/mcp）一侧 ——
    // official/parchment 都叠在 mojmap 上（parchment 只补参数名/javadoc，见仓根 AGENTS.md:212）；
    // mcp（≤1.16.5）的**类名**沿用 MCP 层，由 `mcpClassNameProtect` 兜底。见门头注/基线沿革⑦。
    const family =
      declared === "yarn" ? "yarn" : ["mojmap", "official", "parchment", "mcp"].includes(declared) ? "mojmap" : null;
    if (!family) continue;
    if (!hasFencedCode(text.slice(fm.length + 6))) continue; // 门只管有代码的件
    const entry = byVersion.get(version);
    if (!entry) {
      noPairs += 1;
      continue;
    }
    judged += 1;
    const wanted = family === "yarn" ? entry.mojmapOnly : entry.yarnOnly;
    const other = family === "yarn" ? "mojmap" : "yarn";
    // 只判**围栏代码**里的标识符（正文散文里的同名词不算「用了某映射」）；
    // 再剔元语境行（禁止/反例句 + 专有名词，见 `LEG2_META_LINE` 注释）。
    const codeText = (text.match(/^```[\s\S]*?^```/gm) ?? [])
      .join("\n")
      .split(/\r?\n/)
      .filter((l) => !LEG2_META_LINE.test(l))
      .join("\n");
    const toks = tokensOf(codeText);
    const used = [...toks].filter((t) => wanted.has(t) && !allowedToken(rel, t));
    if (!used.length) continue;
    const alt = altValue(fm);
    if (alt === null || alt === "") {
      conflicts += 1;
      problems.push(
        `${rel}: 声称 mappings=${declared}，正文却用了 ${used.length} 个 ${other} 名（如 ${used.slice(0, 3).join(", ")}）且未声明 mappings_alt ⇒ 键值与正文实名冲突`,
      );
      items.push({ rel, declared, other, used, undisclosed: null });
      continue;
    }
    const disclosed = new Set(disclosureOf(text).rows.map((r) => r.cells[0].replace(/`/g, "")));
    const undisclosed = used.filter((n) => !disclosed.has(n));
    if (undisclosed.length) {
      conflicts += 1;
      problems.push(
        `${rel}: 声明了 mappings_alt，但披露块没点名 ${undisclosed.length} 个实际用到的跨映射名（如 ${undisclosed.slice(0, 3).join(", ")}）⇒ 键值与正文实名不一致`,
      );
      items.push({ rel, declared, other, used, undisclosed });
    }
  }
  return { problems, judged, conflicts, noPairs, items };
}

/** 返回披露块信息：有没有块、块里的对照行（含列数）。未核实行（右列不是反引号名）不计。 */
function disclosureOf(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => DISCLOSE_MARK.test(l));
  if (start < 0) return { hasMark: false, rows: [] };
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i]) || /^### /.test(lines[i])) { end = i; break; }
  }
  const rows = [];
  for (let i = start; i < end; i++) {
    const l = lines[i];
    if (!/^\|\s*`/.test(l)) continue;
    const cells = l.split("|").slice(1, -1).map((s) => s.trim());
    if (cells.length < 2) continue;
    if (!/^`[A-Za-z][A-Za-z0-9_]*`$/.test(cells[0])) continue;
    if (!/^`[^`]+`$/.test(cells[1])) continue;
    rows.push({ at: i + 1, cells });
  }
  return { hasMark: true, rows };
}

function scan(root) {
  const bad = [];
  let fenced = 0;
  let total = 0;
  let withAlt = 0;
  let rowsChecked = 0;
  for (const rel of skillFiles(root)) {
    total++;
    const text = fs.readFileSync(path.join(root, rel), "utf8");
    const fm = frontmatter(text);
    const body = fm === null ? text : text.slice(fm.length + 6);
    const alt = fm === null ? null : altValue(fm);
    const dis = disclosureOf(text);
    rowsChecked += dis.rows.length;
    if (alt !== null) {
      withAlt++;
      if (alt === "") bad.push(`${rel}: mappings_alt 为空值`);
      if (!dis.hasMark) bad.push(`${rel}: 声明了 mappings_alt 但正文没有「### ⚠️ 映射口径」披露块`);
      else if (!dis.rows.length) bad.push(`${rel}: 声明了 mappings_alt 但披露块里没有对照行`);
    } else if (dis.rows.length) {
      bad.push(`${rel}: 披露块有 ${dis.rows.length} 行对照却未声明 mappings_alt（工具链无从识别）`);
    }
    for (const r of dis.rows) {
      if (r.cells.length !== 4) {
        bad.push(`${rel}:L${r.at} 对照行须四列「mojmap | Yarn | 适用版本 | 依据」，实际 ${r.cells.length} 列`);
      }
    }
    if (!hasFencedCode(body)) continue;
    fenced++;
    if (fm === null) { bad.push(`${rel}: 无 frontmatter，却有围栏代码`); continue; }
    const v = mappingValue(fm);
    if (v === null) bad.push(`${rel}: 有围栏代码但缺 mappings 键`);
    else if (v === "") bad.push(`${rel}: mappings 键为空值`);
    else {
      const prefix = v.split(/[\s（(]/)[0];
      if (!MAPPING_VALUE_PREFIXES.includes(prefix)) {
        bad.push(
          `${rel}: mappings 值前缀「${prefix}」不在册（合法：${MAPPING_VALUE_PREFIXES.join(" / ")}；「值+括注」体例取前缀）`,
        );
      } else if (prefix === "mcp" && !/^platforms:/m.test(text)) {
        const [plat, ver] = rel.split("/");
        if (plat === "forge" && !versionAtMost(ver, MCP_MAX_VERSION)) {
          bad.push(`${rel}: mappings: mcp 在 ${ver} 不存在（MCP 自 1.17 起取消，FG5 文档：stable/snapshot 1.17 起不再存在；本档应声明本包钉的 parchment/official）`);
        }
      } else if (prefix === "parchment" && !/^platforms:/m.test(text)) {
        const [, ver] = rel.split("/");
        if (!versionAtMost(PARCHMENT_MIN_VERSION, ver)) {
          bad.push(`${rel}: mappings: parchment 在 ${ver} 不存在（Parchment 构件最早 1.16.5；本仓 data/ 的 parchment 产物也只从 1.16.5 起 —— 见 docs/knowledge-coverage-sweep-20260924.md §6.8 的 forge/1.14.4 mc-sound 例）`);
        }
      }
    }
  }
  return { bad, fenced, total, withAlt, rowsChecked };
}

if (SELFTEST && isMain) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mappings-key-"));
  let fails = 0;
  const put = (rel, content) => {
    const abs = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
  };
  const FM_OK = "---\nname: mc-a\ndescription: d\nplatform: fabric\nversion: \"1.20.1\"\nmappings: yarn\n---\n\n# a\n\n```java\nint x = 1;\n```\n";
  const FM_NO_KEY = "---\nname: mc-a\ndescription: d\nplatform: fabric\nversion: \"1.20.1\"\n---\n\n# a\n\n```java\nint x = 1;\n```\n";
  const FM_EMPTY_KEY = "---\nname: mc-a\nmappings:\n---\n\n# a\n\n```json\n{}\n```\n";
  // 值域/版本约束（2026-09-25 修复批）夹具
  const FM_HINT = FM_OK.replace("mappings: yarn", "mappings: hint");
  const FM_PARCH = FM_OK.replace("mappings: yarn", "mappings: parchment");
  const FM_MCP = FM_OK.replace("mappings: yarn", "mappings: mcp");
  const FM_ANNOT = FM_OK.replace("mappings: yarn", "mappings: mojmap（游戏仍混淆；与去混淆不是同一档）");
  const NO_FENCE = "---\nname: mc-b\nplatform: fabric\n---\n\n# b\n\n正文里有 `inline` 但没有围栏。\n";
  const FENCE_LIKE_ONLY = "---\nname: mc-c\nplatform: fabric\n---\n\n# c\n\n```\n未闭合的假围栏\n";
  const BLOCK_OK =
    "---\nname: mc-d\nplatform: fabric\nversion: \"1.21.4\"\nmappings: yarn\nmappings_alt: mojmap\n---\n\n# d\n\n### ⚠️ 映射口径：本档语料是 mojmap\n\n| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |\n| --- | --- | --- | --- |\n| `GuiGraphics` | `DrawContext` | 1.20.1–1.21.11 | join（`net.minecraft.client.gui.DrawContext`） |\n\n- 说明行\n";
  const BLOCK_NO_ALT = BLOCK_OK.replace("mappings_alt: mojmap\n", "");
  const ALT_NO_BLOCK = BLOCK_OK.replace(/^### ⚠️ 映射口径[\s\S]*$/m, "## 其它\n\n正文。\n");
  const ROW_THREE_COL = BLOCK_OK.replace(
    "| `GuiGraphics` | `DrawContext` | 1.20.1–1.21.11 | join（`net.minecraft.client.gui.DrawContext`） |",
    "| `GuiGraphics` | `DrawContext` | join（`net.minecraft.client.gui.DrawContext`） |",
  );

  const cases = [
    { name: "有围栏 + 有键 → 绿", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_OK, want: 0 },
    { name: "有围栏 + 缺键 → 红", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_NO_KEY, want: 1 },
    { name: "有围栏 + 空值键 → 红", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_EMPTY_KEY, want: 1 },
    { name: "无围栏 + 缺键 → 绿（门只管有代码的）", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: NO_FENCE, want: 0 },
    { name: "未闭合伪围栏 → 绿（不得凭半个 ``` 判红）", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FENCE_LIKE_ONLY, want: 0 },
    { name: "扁平件同判（mc-a.md）", rel: "fabric/1.20.1/.cursor/skills/mc-a.md", content: FM_NO_KEY, want: 1 },
    { name: "alt + 四列对照块 → 绿", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: BLOCK_OK, want: 0 },
    { name: "有对照块但缺 alt → 红", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: BLOCK_NO_ALT, want: 1 },
    { name: "声明 alt 但无披露块 → 红", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: ALT_NO_BLOCK, want: 1 },
    { name: "对照行少一列（无适用版本）→ 红", rel: "fabric/1.21.4/.cursor/skills/mc-d/SKILL.md", content: ROW_THREE_COL, want: 1 },
    // 值域/版本约束（2026-09-25 修复批；可证伪：去掉 scan 里那段判据即全绿）
    { name: "值域门：前缀不在册（hint）⇒ 红", rel: "fabric/1.20.1/.cursor/skills/mc-a/SKILL.md", content: FM_HINT, want: 1 },
    { name: "值域门：forge/1.18.2 声明 mcp ⇒ 红（1.17+ 无 MCP 层）", rel: "forge/1.18.2/.cursor/skills/mc-a/SKILL.md", content: FM_MCP, want: 1 },
    { name: "值域门：forge/1.16.5 声明 mcp ⇒ 绿（≤1.16.5 合法）", rel: "forge/1.16.5/.cursor/skills/mc-a/SKILL.md", content: FM_MCP, want: 0 },
    { name: "值域门：括注体例取前缀（mojmap（…））⇒ 绿", rel: "neoforge/1.21.1/.cursor/skills/mc-a/SKILL.md", content: FM_ANNOT, want: 0 },
    { name: "值域门：forge/1.14.4 声明 parchment ⇒ 红（parchment 自 1.16.5 起）", rel: "forge/1.14.4/.cursor/skills/mc-a/SKILL.md", content: FM_PARCH, want: 1 },
    { name: "值域门：forge/1.18.2 声明 parchment ⇒ 绿（≥1.16.5）", rel: "forge/1.18.2/.cursor/skills/mc-a/SKILL.md", content: FM_PARCH, want: 0 },
  ];
  for (const c of cases) {
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    put(c.rel, c.content);
    const r = scan(tmp);
    const ok = r.bad.length === c.want;
    if (!ok) fails++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  实际红=${r.bad.length} 期望=${c.want}`);
    if (!ok) console.log("      " + r.bad.join("\n      "));
  }
  // ── leg2 夹具（A7）：键值 ↔ 正文实名一致性 ────────────────────────────────
  // 假对照产物：三对里有一对是「同词两侧都有」（歧义名，必须不判）。
  const pairsDir = path.join(tmp, "pairs");
  fs.mkdirSync(pairsDir, { recursive: true });
  fs.writeFileSync(
    path.join(pairsDir, "index.json"),
    JSON.stringify({ versions: { "1.20.1": { file: "yarn-mojmap-1.20.1.json", count: 3 } } }),
  );
  fs.writeFileSync(
    path.join(pairsDir, "yarn-mojmap-1.20.1.json"),
    JSON.stringify({
      version: "1.20.1",
      count: 12,
      pairs: [
        { obf: "a", mojmap: "MojOnly", yarn: "YarnName" },
        { obf: "b", mojmap: "Shared", yarn: "Shared" },
        { obf: "c", mojmap: "MojoTwo", yarn: "YarnTwo" },
        // 嵌套对（夹具）：两侧整名都是 `X$Y`，正文按简名 `Inner` 用 ⇒ 修正②后不得判。
        { obf: "d", mojmap: "MojNest$Inner", yarn: "YarnNest$Inner" },
        // 真实形态（1.16.5 实测行）：mojmap 顶层 `Settings` ↔ yarn 其它名 ⇒ 旧算法把 `Settings` 毒进 mojmapOnly；
        // 配一条 yarn 嵌套 `Item$Settings` ⇒ `Settings` 两侧皆有 ⇒ 不判。
        { obf: "e", mojmap: "Settings", yarn: "AbstractPropertiesHandler" },
        { obf: "f", mojmap: "Item$Properties", yarn: "Item$Settings" },
        // 真实形态（实测行）：yarn 顶层类 `Properties`（net/minecraft/state/property/Properties）⇒
        // `Properties` 进 yarnNames；mojmap 侧由 `Item$Properties` 的简名补 ⇒ 两侧皆有 ⇒ mojmap 档不得判。
        { obf: "h", mojmap: "BlockStateProperties", yarn: "Properties" },
        // 段名夹具（修正③）：`Outer$SegOnly` 的简名只做保护，不得作为建旗证据。
        { obf: "i", mojmap: "Outer$SegOnly", yarn: "YarnOuter$YarnSeg" },
        // 豁免夹具（修正④）：顶层 `Gui` 是 mojmap 名（yarn 侧叫 InGameHud）；cloth 文件里它指第三方类。
        { obf: "j", mojmap: "Gui", yarn: "InGameHud" },
        // 元语境夹具（修正⑤）：`Minecraft` 真身 = mojmap 客户端类；正文里另有点名警告与 Wiki/EULA 专有名词。
        { obf: "k", mojmap: "Minecraft", yarn: "MinecraftClient" },
        // MCP 类名夹具（修正⑥）：这些是 1.16.5 official 通道合法出现的 MCP 类名（tsrg 在册），
        // 与真 Yarn 名（YarnSpecial）必须区分对待。
        { obf: "l", mojmap: "Level", yarn: "World" },
        { obf: "m", mojmap: "BlockBehaviour", yarn: "AbstractBlock" },
        { obf: "n", mojmap: "Zzz", yarn: "YarnSpecial" },
      ],
    }),
  );
  // 修正⑥夹具：1.20.1 档铺一份 tsrg（official 方向的 MCP 类名源；必须与 loadPairs 的 root=tmp 同根，
  // 且要在 loadPairs 之前写好 —— 集合只在这一次调用里建）。
  fs.mkdirSync(path.join(tmp, "data", "forge_1.20.1", "mappings"), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, "data", "forge_1.20.1", "mappings", "obf_to_srg.tsrg"),
    "aa net/minecraft/world/World\nbb net/minecraft/block/AbstractBlock\ncc net/minecraft/block/AbstractBlock$Properties\n",
    "utf8",
  );
  const byVersion = loadPairs(pairsDir, tmp);
  const leg2Root = path.join(tmp, "leg2root");
  const fixture = ({ fm, code, prose = "", disclose = null }) =>
    `---\nname: mc-x\ndescription: d\nplatform: fabric\nversion: "1.20.1"\n${fm}\n---\n\n# x\n\n` +
    (disclose === null
      ? ""
      : `### ⚠️ 映射口径：本档语料是 mojmap\n\n| mojmap 名 | Yarn 名 | 适用版本 | 依据 |\n| --- | --- | --- | --- |\n| \`${disclose}\` | \`Y\` | 1.20.1 | 夹具 |\n\n`) +
    (prose ? prose + "\n\n" : "") +
    `\`\`\`java\n${code}\n\`\`\`\n`;
  const leg2Cases = [
    { name: "leg2：声称 yarn + 围栏用 mojmap 名 + 无 alt ⇒ 红", fm: "mappings: yarn", code: "MojOnly x = null;", want: 1 },
    { name: "leg2：同形 + mappings_alt + 披露块点名 ⇒ 绿", fm: "mappings: yarn\nmappings_alt: mojmap", code: "MojOnly x = null;", disclose: "MojOnly", want: 0 },
    { name: "leg2：alt 但披露块没点名 ⇒ 红", fm: "mappings: yarn\nmappings_alt: mojmap", code: "MojOnly x = null;", disclose: "SomethingElse", want: 1 },
    { name: "leg2：歧义名（两侧同词）不得判 ⇒ 绿", fm: "mappings: yarn", code: "Shared s = null;", want: 0 },
    { name: "leg2：mappings=mojmap + 围栏用 yarn 名 ⇒ 红", fm: "mappings: mojmap", code: "YarnName y = null;", want: 1 },
    { name: "leg2：同名只出现在散文、围栏里没有 ⇒ 绿", fm: "mappings: yarn", code: "int q = 1;", prose: "正文提到 MojOnly 但不在代码里。", want: 0 },
    // 判据修正（2026-09-25）两例：旧算法下的两个**假阳性形态**必须消失（可被证伪：
    // 把 loadPairs 的「等名对进两侧 / 嵌套简名并入」任一去掉，这两例立刻变红）。
    { name: "leg2 修正②：yarn 档用 `Settings`（yarn 嵌套简名）不得判 ⇒ 绿", fm: "mappings: yarn", code: "new Item.Settings();", want: 0 },
    { name: "leg2 修正②：mojmap 档用 `Properties`（mojmap 嵌套简名）不得判 ⇒ 绿", fm: "mappings: mojmap", code: "Properties p = null;", want: 0 },
    { name: "leg2 修正③：段名（`Outer$SegOnly` 的简名）只保护不建旗 ⇒ 绿", fm: "mappings: yarn", code: "SegOnly s = null;", want: 0 },
    { name: "leg2 豁免④：cloth 文件里的 `Gui`（第三方类）在册 ⇒ 绿", rel: "fabric/1.20.1/.cursor/skills/mc-cloth-config.md", fm: "mappings: yarn", code: "Gui g = null;", want: 0 },
    { name: "leg2 豁免④对照：非 cloth 文件同 token ⇒ 红（豁免不外溢）", fm: "mappings: yarn", code: "Gui g = null;", want: 1 },
    { name: "leg2 修正⑤：禁止句里的 mojmap 名不算用法 ⇒ 绿", fm: "mappings: yarn", code: "// 不要 MojOnly、不要编造别的\nint q = 1;", want: 0 },
    { name: "leg2 修正⑤：`Minecraft Wiki` 专有名词不算类用法 ⇒ 绿", fm: "mappings: yarn", code: "→ Minecraft Wiki 页面（链接）", want: 0 },
    { name: "leg2 修正⑤对照：`Minecraft` 在普通代码行仍算用法 ⇒ 红", fm: "mappings: yarn", code: "Minecraft mc = Minecraft.getInstance();", want: 1 },
    { name: "leg2 修正⑥：official 档用 MCP 类名 `World`（tsrg 在册）不得判 ⇒ 绿", fm: "mappings: official", code: "World w = null;", want: 0 },
    { name: "leg2 修正⑥：official 档用 MCP 嵌套简名 `Properties`（tsrg 在册）不得判 ⇒ 绿", fm: "mappings: official", code: "Properties p = null;", want: 0 },
    { name: "leg2 修正⑥对照：official 档用真 Yarn 名 `YarnSpecial` ⇒ 红（保护不泛化）", fm: "mappings: official", code: "YarnSpecial s = null;", want: 1 },
    // 族⑦（2026-09-25）：parchment / mcp 也按 mojmap 侧判（可证伪：把 family 里这两个值去掉即两例变绿）。
    { name: "leg2 族⑦：parchment 档用真 Yarn 名 ⇒ 红", fm: "mappings: parchment", code: "YarnSpecial s = null;", want: 1 },
    { name: "leg2 族⑦：parchment 档用 mojmap 名 ⇒ 绿", fm: "mappings: parchment", code: "MojoTwo x = null;", want: 0 },
    { name: "leg2 族⑦：mcp 档用 MCP 类名（tsrg 在册）⇒ 绿", fm: "mappings: mcp", code: "World w = null;", want: 0 },
    { name: "leg2 族⑦对照：mcp 档用真 Yarn 名 ⇒ 红", fm: "mappings: mcp", code: "YarnSpecial s = null;", want: 1 },
  ];
  for (const c of leg2Cases) {
    fs.rmSync(leg2Root, { recursive: true, force: true });
    const rel = c.rel ?? "fabric/1.20.1/.cursor/skills/mc-x/SKILL.md";
    const abs = path.join(leg2Root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, fixture(c), "utf8");
    const r = leg2Check({ root: leg2Root, files: skillFiles(leg2Root), byVersion });
    const ok = r.problems.length === c.want;
    if (!ok) fails += 1;
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  实际红=${r.problems.length} 期望=${c.want}`);
    if (!ok) console.log("      " + (r.problems.join("\n      ") || "(无问题)"));
  }
  cases.push(...leg2Cases);
  // 缺对照产物 ⇒ 打印 leg2 skipped 且**退出码不变**（端到端：真跑本门、指向空目录）
  {
    const emptyDir = path.join(tmp, "no-pairs");
    fs.mkdirSync(emptyDir, { recursive: true });
    fs.rmSync(leg2Root, { recursive: true, force: true });
    const rel = "fabric/1.20.1/.cursor/skills/mc-x/SKILL.md";
    const abs = path.join(leg2Root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, fixture({ fm: "mappings: yarn", code: "int q = 1;" }), "utf8");
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), `--root=${leg2Root}`, `--pairs-dir=${emptyDir}`], {
      encoding: "utf8",
      windowsHide: true,
    });
    const skippedPrinted = /leg2 skipped/.test(String(r.stdout || ""));
    const ok = r.status === 0 && skippedPrinted;
    if (!ok) fails += 1;
    console.log(`${ok ? "PASS" : "FAIL"}  leg2：缺对照产物 ⇒ 打印 skipped 且退出码不变  rc=${r.status} skipped=${skippedPrinted}`);
    if (!ok) console.log("      " + String(r.stdout || "").slice(0, 200));
  }
  // ②（2026-09-26）：--require-pairs 两记 —— 产物在 ⇒ 判得过（不误伤）；产物缺 ⇒ PAIRS_MISSING 响亮红
  {
    fs.rmSync(leg2Root, { recursive: true, force: true });
    const rel = "fabric/1.20.1/.cursor/skills/mc-x/SKILL.md";
    const abs = path.join(leg2Root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, fixture({ fm: "mappings: yarn", code: "int q = 1;" }), "utf8");
    const pd2 = path.join(tmp, "require-pairs");
    fs.mkdirSync(pd2, { recursive: true });
    fs.writeFileSync(
      path.join(pd2, "index.json"),
      JSON.stringify({ versions: { "1.20.1": { file: "yarn-mojmap-1.20.1.json", count: 1 } } }),
      "utf8",
    );
    fs.writeFileSync(
      path.join(pd2, "yarn-mojmap-1.20.1.json"),
      JSON.stringify({ version: "1.20.1", count: 1, pairs: [{ obf: "a", mojmap: "Level", yarn: "ServerWorld" }] }),
      "utf8",
    );
    const rIn = spawnSync(
      process.execPath,
      [fileURLToPath(import.meta.url), `--root=${leg2Root}`, `--pairs-dir=${pd2}`, "--require-pairs"],
      { encoding: "utf8", windowsHide: true },
    );
    const okIn = rIn.status === 0;
    if (!okIn) fails += 1;
    cases.push({ name: "require-pairs：产物在 ⇒ 正常判（不误伤）" });
    console.log(`${okIn ? "PASS" : "FAIL"}  require-pairs：产物在 ⇒ 正常判（不误伤）  rc=${rIn.status}`);
    if (!okIn) console.log("      " + String(rIn.stderr || rIn.stdout || "").slice(0, 200));
    const pd3 = path.join(tmp, "require-pairs-empty");
    fs.mkdirSync(pd3, { recursive: true });
    const rOut = spawnSync(
      process.execPath,
      [fileURLToPath(import.meta.url), `--root=${leg2Root}`, `--pairs-dir=${pd3}`, "--require-pairs"],
      { encoding: "utf8", windowsHide: true },
    );
    const missing = /PAIRS_MISSING/.test(String(rOut.stderr || "") + String(rOut.stdout || ""));
    const okOut = rOut.status === 1 && missing;
    if (!okOut) fails += 1;
    cases.push({ name: "require-pairs：产物缺 ⇒ PAIRS_MISSING 响亮红" });
    console.log(`${okOut ? "PASS" : "FAIL"}  require-pairs：产物缺 ⇒ PAIRS_MISSING 响亮红  rc=${rOut.status} missing=${missing}`);
    if (!okOut) console.log("      " + String(rOut.stderr || rOut.stdout || "").slice(0, 200));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? `selftest FAILED（${fails}/${cases.length}）` : `selftest OK（${cases.length}/${cases.length}）`);
  process.exit(fails ? 1 : 0);
}

function main() {
const res = scan(ROOT);
// ── leg2（A7）：键值 ↔ 正文实名一致性；无对照产物 ⇒ 打印 skipped 并**保持 leg1 的退出码** ──
const pairs = loadPairs(PAIRS_DIR, ROOT);
// ②（2026-09-26）：--require-pairs ⇒ skipped 不许静默：产物缺席即响亮红（默认关，见常量处注释）
if (REQUIRE_PAIRS && (!pairs || pairs.size === 0)) {
  console.error(
    `PAIRS_MISSING —— 按序试过的目录 = ${PAIRS_CANDIDATES.map((d) => path.relative(ROOT, d).replace(/\\/g, "/") || d).join(" · ")}；` +
      `当前取 = ${PAIRS_DIR}。再生命令：node scripts/build-yarn-mojmap-pairs.mjs [--offline] [--out=<dir>]` +
      `（产物按许可不入库；仓库发布副本 data/_yarn-mojmap-pairs 在库时本开关无需开——CI 勿开）`,
  );
  process.exit(1);
}
const leg2 = pairs ? leg2Check({ root: ROOT, files: skillFiles(ROOT), byVersion: pairs }) : null;
let leg2New = [];
if (pairs) {
  const pairsTotal = [...pairs.values()].reduce((a, b) => a + (b.count ?? 0), 0);
  console.log(
    `  leg2 对照源 ${path.relative(ROOT, PAIRS_DIR).replace(/\\/g, "/") || PAIRS_DIR}（${pairs.size} 档 / ${pairsTotal} 对；` +
      (argVal("pairs-dir")
        ? "落点 = 显式 --pairs-dir"
        : "候选顺序：data/_yarn-mojmap-pairs → $MC_SKILL_CACHE/yarn-mojmap-pairs → tmpdir") +
      "）",
  );
}
if (!pairs) {
  console.log(
    `  leg2 skipped（读不到对照产物：${PAIRS_DIR}${argVal("pairs-dir") ? " ← 显式 --pairs-dir" : ""}；` +
      `未指该参数时按序试 ${PAIRS_CANDIDATES.length} 处：${PAIRS_CANDIDATES.map((d) => path.relative(ROOT, d).replace(/\\/g, "/") || d).join(" · ")}）—— ` +
      `仓库副本应在 \`data/_yarn-mojmap-pairs/\`（一次性人工发布，见该目录 yarn-mojmap-pairs-provenance.json）；` +
      `本机也可 \`node scripts/build-yarn-mojmap-pairs.mjs\`（要联网）现生到 \$MC_SKILL_CACHE 再复跑。**skipped ≠ 判过**。`,
  );
} else if (DUMP) {
  console.log(`  leg2 dump：冲突 ${leg2.conflicts} 件（判 ${leg2.judged} 件；基线 ${LEG2_BASELINE}）`);
  for (const it of leg2.items) {
    console.log(
      `  LEG2 ${it.rel} :: ${it.used.join(", ")}${it.undisclosed ? ` :: 未披露 ${it.undisclosed.join(", ")}` : ""}`,
    );
  }
  process.exit(0);
} else if (leg2.conflicts > LEG2_BASELINE) {
  // 只对**新增**冲突判红：存量已登记为棘轮基线（只许降不许增 —— 与仓内「存量脏页只许减」同法）。
  leg2New = leg2.problems;
  console.error(
    `  leg2：冲突 ${leg2.conflicts} 件 > 存量基线 ${LEG2_BASELINE} ⇒ 有**新增**键值冲突（判 ${leg2.judged} 件 / 该档无对照产物 ${leg2.noPairs} 件）`,
  );
  for (const p of leg2.problems.slice(0, 40)) console.error("  " + p);
} else if (leg2.conflicts) {
  console.log(
    `  leg2：存量冲突 ${leg2.conflicts} 件（基线 ${LEG2_BASELINE}，只许降不许增；判 ${leg2.judged} 件 / 该档无对照产物 ${leg2.noPairs} 件）` +
      `—— 明细：${leg2.problems.slice(0, 3).join("；")}${leg2.problems.length > 3 ? "；…" : ""}`,
  );
}
const bad = [...res.bad, ...leg2New];
if (bad.length) {
  console.error(`assert-skill-mappings-key: ${bad.length} 件违规（共扫 ${res.total} 件，含围栏代码 ${res.fenced} 件）`);
  for (const b of res.bad.slice(0, 60)) console.error("  " + b);
  if (res.bad.length > 60) console.error(`  … +${res.bad.length - 60} more`);
  process.exit(1);
}
console.log(
  `assert-skill-mappings-key: ok（${res.total} 件 Skill 源稿，含围栏代码 ${res.fenced} 件均已声明非空 mappings 键；声明 mappings_alt 的 ${res.withAlt} 件均有披露块与对照行，对照行共 ${res.rowsChecked} 行皆四列）` +
    (leg2 ? `；leg2 判 ${leg2.judged} 件、冲突 ${leg2.conflicts} 件、该档无对照产物 ${leg2.noPairs} 件` : "；leg2 skipped（无对照产物）"),
);
}

if (isMain) main();
