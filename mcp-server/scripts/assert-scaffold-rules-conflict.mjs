/**
 * Gate：W4-S18 —— scaffold 不得使用「同档规则里以 ❌ 标注」的符号。
 *
 * 背景：scaffold 是 agent 抄代码的第一来源。规则正文里已经用 ❌ 明确判死的符号（被移除 / 被改名 /
 * 跨档误用的 API），一旦出现在同档 scaffold 的 .java 里，抄出来的代码必然编译不过或跑错。
 * S18 审查命中的 5 处（1.17.1 括号未闭合 / 1.20.1+1.20.4 `.tab(CreativeModeTab.TAB_*)` /
 * 1.19.4 整段串成 1.20.1 API / 1.18.2 `MapColor` / 1.15.2 缺 import）本质都是这一族，
 * 手工改一轮挡不住下一次回归，所以钉成静态门。
 *
 * 断言分两层：
 *  A. 内容层（任何数据根都跑，包括 MC_SKILL_SCAFFOLD_TEST_ROOT 假根）
 *     A1 逐档读 `<pack>/.cursor/rules/*.mdc`，先分「判死 / 正解」两种管辖：
 *        行（或 markdown 标题）里出现 ❌ ⇒ 该行及其后的无标记行受「判死」管辖；
 *        出现 ✅ ⇒ 切回「正解」管辖（❌ 小节里常跟一段 ✅ 对照示例，把它们当判死会成片误伤）。
 *     A2 三道噪声过滤，全过才算「判死符号」：
 *        ① 场合过滤：判死文本含 `客户端/服务端/线程/时机/Mixin/Gradle/错误的/…` ⇒ 判的是使用场合，
 *           不是这个名字本身（`MinecraftClient` / `Blocks` 这类合法 API 因此不会被判死）；
 *        ② 判死判据：判死文本必须断言「名字本身不成立」（`移除 / 不存在 / 改名 / 已过时 / 禁止 /
 *           不要 / 编译不过 / …`）；只有 ❌ 没有断言行 = 合法 API 的反例演示。
 *           注意 `错误` / `错误示例` 故意不算判死判据（反例行几乎都写「// ❌ 错误：」）。
 *        ③ 歧义过滤：该文本还出现在同档任何「正解」行里 ⇒ 规则没判死，丢弃。
 *        符号形状：含大写字母、每段都是合法标识符、单段长度 >=6 且非全大写常量；
 *        Java 关键字、JDK 通用名、Gradle 任务名、文档占位名（`My*` / `Example*`）直接丢。
 *     A3 命中判定：判死符号在同档 scaffold 的 .java 里出现 = 冲突 = 红。匹配前先挖掉 Java 注释
 *        （被注释掉的示例行不是可抄代码）；单段名按 `\bName\b`，双段名按 `A[.#]b` 整链匹配。
 *     已知盲区（写明，不假装覆盖）：规则只用散文断言移除、整行没有 ❌ 时不进门 ——
 *        实测例 `forge/1.20.1/.cursor/rules/03-item.mdc:27`「`Item.Properties` 在 1.20.1 没有 `tab()`
 *        方法」。同例还有形状门槛排除的短小写方法名（`tab`）。这类要靠规则把判据写成 ❌ 才拦得住。
 *  B. 台账层（只跑真数据根；TEST_ROOT 跳过；RELEDGER=1 只重算并打印、不判红）
 *     钉死被检档数 / 规则篇数 / 三道过滤各自的丢弃数 / 判死符号数 / 冲突数，
 *     防止「零候选 → 零命中」的假绿（候选数暴跌 = 规则 ❌ 写法变了，门已经瞎了，必须显式重钉）。
 *
 * 用法：
 *   node scripts/assert-scaffold-rules-conflict.mjs
 *   MC_SKILL_SCAFFOLD_RELEDGER=1 node scripts/assert-scaffold-rules-conflict.mjs      # 重算台账并打印新数
 *   MC_SKILL_SCAFFOLD_TEST_ROOT=<假根> node scripts/assert-scaffold-rules-conflict.mjs # 投毒自证用
 *   MC_SKILL_SCAFFOLD_GATE_INFO=1 / MC_SKILL_SCAFFOLD_GATE_DEBUG=1                    # 判死清单 / 逐符号出处
 *
 * 注：本 gate 只读知识库根（平台/<版本>），不依赖 dist，也不需要 npm run build。
 *     镜像面：只读 `<pack>/.cursor/rules`（知识库源稿），不读 .claude/.continue/.agents/.trae 投影。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

/** 测试假根：与 assert-fabric-transcludes 的 MC_SKILL_TRANSCLUDE_TEST_ROOT 同形态。 */
const TEST_ROOT = process.env.MC_SKILL_SCAFFOLD_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const RELEDGER = process.env.MC_SKILL_SCAFFOLD_RELEDGER === "1";

/** 基岩没有 Java scaffold；其余带 .java 的平台全查。 */
const PLATFORMS = ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader"];

/** 明显不是「本档已判死 API」的高频词（Java 关键字 / JDK 通用名 / 注解名）。 */
const STOPWORDS = new Set([
  "new", "this", "super", "null", "true", "false", "void", "static", "final", "public", "private",
  "protected", "class", "interface", "enum", "record", "return", "throw", "import", "package",
  "Override", "Deprecated", "SideOnly", "OnlyIn", "mod", "Mod", "getMod", "setMod",
  "NullPointerException", "IllegalArgumentException", "IllegalStateException", "RuntimeException",
  "Optional", "List", "Map", "Set", "String", "Object", "Integer", "Registry",
  // Gradle 任务名不是 Java 符号，只出现在 build.gradle 与命令行 ❌ 行里
  "compileJava", "processResources", "runClient", "runServer", "runData", "genSources",
  "buildGameTest", "setupDecompWorkspace", "runGameTestServer", "createMcpToSrg",
]);
/** 文档示例占位名（`MyClass` / `ExampleMod` / `Shadow`）不是真实 API，出现即丢弃。 */
const PLACEHOLDER_RE = /^(My|Some|Fake|Dummy|Target[A-Z]|Example|Shadow$)/;
/**
 * 上下文限定词：❌ 行里带任何一个 ⇒ 规则判的是「用错场合 / 用错端 / 用错时机」，
 * 不是「这个符号在本档不存在」⇒ 该行不抽符号。
 * （否则 `MinecraftClient` / `Blocks` / `Attributes` 这类合法 API 会被成片误伤。）
 */
const CONTEXT_CUES = [
  "客户端", "服务端", "专用", "仅", "只在", "共享代码", "线程", "时机", "太早", "未就绪", "崩溃",
  "泄漏", "内存", "null", "忘", "注解", "声明", "entrypoint", "Mixin", "mixin", "gradle", "Gradle",
  "任务", "命令", "插件", "大小写", "横杠", "连字符", "驼峰", "大写", "小写", "JSON", "json",
  "路径", "不一致", "未检查", "没有取消", "重复", "顺序", "无效的", "错误的", " vs ", "回调", "注册时机",
];
const isContextual = (text) => CONTEXT_CUES.some((cue) => text.includes(cue));
/**
 * 「符号级判死」正面判据：❌ 行必须断言**这个名字本身**在本档不成立
 * （被移除 / 被改名 / 从来不存在 / 明确禁止使用），才算判死符号。
 * 只有 ❌ 而没有这类断言行 = 演示「合法 API 用错场合」（例：`❌ 在消息处理器中直接修改世界` 里的
 * `player.getLevel`），抽出来会把正版 API 判死。
 * 注意：`错误` / `错误示例` **不**在表内 —— 反例代码几乎都写「// ❌ 错误：」，加了等于没有过滤。
 */
const VERDICT_CUES = [
  "移除", "不存在", "没有", "改名", "更名", "重命名", "已过时", "过时", "废弃", "弃用",
  "deprecated", "removed", "renamed", "禁止", "不要", "别用", "误用", "错用", "写错", "拼错",
  "编译不过", "无法解析", "找不到", "不再", "换用", "改用", "应为", "应是", "属于", "已并入",
  "1.12.2 是", "旧版", "上一版", "跨档", "串档", "勿用", "无效",
];
const hasVerdict = (text) => VERDICT_CUES.some((cue) => text.includes(cue));
const DEBUG = process.env.MC_SKILL_SCAFFOLD_GATE_DEBUG === "1";

const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/") || ".";

if (!fs.existsSync(ROOT)) {
  console.error(`assert-scaffold-rules-conflict: 仓库根不存在 ${ROOT}`);
  process.exit(1);
}

// ── 工具：Java 形状判定 ──────────────────────────────────────────────────
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const hasUpper = (s) => /[A-Z]/.test(s);

/** 一个候选文本（已去括号/参数）是否够格当「符号」。 */
function symbolShape(text) {
  if (!text) return null;
  const t = text.trim();
  if (!t || /\s/.test(t)) return null;
  const segs = t.split(/[.#]/).filter(Boolean);
  if (segs.length === 0) return null;
  // 文件名（build.gradle / pack.mcmeta / 1.20.1）不算符号：含 `.` 但段名非法
  if (!segs.every((s) => IDENT.test(s))) return null;
  if (!segs.some(hasUpper)) return null; // 全小写 = 不是 Java 符号名
  if (segs.some((s) => /^[0-9]/.test(s))) return null;
  if (STOPWORDS.has(t)) return null;
  if (segs.some((s) => PLACEHOLDER_RE.test(s))) return null;
  if (segs.length === 1) {
    // 单段：过短（<=4）或全大写常量（TAB / NBT 之类）噪声太大
    if (t.length < 6) return null;
    if (/^[A-Z0-9_]+$/.test(t)) return null;
    return { kind: "single", name: t };
  }
  return { kind: "qualified", name: t, regex: new RegExp(
    segs.map((s) => s.replace(/\$/g, "\\$")).join("\\s*(?:[.#]|::)\\s*") + "\\b",
  ) };
}

function matchIn(symbol, text) {
  return symbol.kind === "single"
    ? new RegExp(`\\b${symbol.name.replace(/\$/g, "\\$")}\\b`).test(text)
    : symbol.regex.test(text);
}

/**
 * 把 .java 的注释挖空（保留行数与字符串字面量）。
 * scaffold 里被注释掉的示例行（如 `// MinecraftClient.getInstance()…`）不是可抄的代码，
 * 不计入冲突；规则正文里的 ✅/❌ 判据同理只看非注释内容。
 */
function blankJavaComments(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  let state = "code"; // code | line | block | string | char
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (state === "code") {
      if (c === "/" && d === "/") { state = "line"; out.push("  "); i += 2; continue; }
      if (c === "/" && d === "*") { state = "block"; out.push("  "); i += 2; continue; }
      if (c === '"') { state = "string"; }
      else if (c === "'") { state = "char"; }
      out.push(c); i++; continue;
    }
    if (state === "line") {
      if (c === "\n") { state = "code"; out.push(c); } else out.push(" ");
      i++; continue;
    }
    if (state === "block") {
      if (c === "*" && d === "/") { state = "code"; out.push("  "); i += 2; continue; }
      out.push(c === "\n" ? "\n" : " "); i++; continue;
    }
    // string / char：整段照抄，处理转义
    if (c === "\\") { out.push(c, d ?? ""); i += 2; continue; }
    if ((state === "string" && c === '"') || (state === "char" && c === "'")) state = "code";
    out.push(c); i++;
  }
  return out.join("").split(/\r?\n/);
}

/** 从 ❌ 行（含其管辖标题）里抽候选符号文本。 */
function candidatesFromLine(line) {
  const out = [];
  // 反引号内的内容
  for (const m of line.matchAll(/`([^`\n]+)`/g)) out.push(...bare(m[1]));
  // 示例代码：`a.b.c(` 形式的点号链（不单独取链头，避免把原版 `Blocks` 类判死）
  for (const m of line.matchAll(/([A-Za-z_$][A-Za-z0-9_$]*(?:\s*[.#]\s*[A-Za-z_$][A-Za-z0-9_$]*)+)\s*\(/g)) {
    out.push(...bare(m[1]));
  }
  // 示例代码：裸方法名 `setRegistryName(` —— `new MyBlock().setRegistryName(...)` 的链头被
  // 括号截断，上一条抓不到。是否误伤交给「场合/判死判据 + A2 歧义过滤」三层：
  // 合法 API 必然在正文别处以正解身份出现，会被 A2 丢掉。
  for (const m of line.matchAll(/\b([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g)) out.push(m[1]);
  return out;
}
function bare(s) {
  // `DataGenerator#addProvider(IDataProvider)` / `MenuScreens.register()` / `modLoc()` → 去参数
  return s
    .replace(/\([^)]*\)/g, "")
    .split(/[,;]/)
    .map((x) => x.replace(/\{\s*\}$/, "").replace(/\[\s*\]$/, "").trim())
    .filter(Boolean);
}

// ── 收集 ────────────────────────────────────────────────────────────────
const packs = [];
for (const plat of PLATFORMS) {
  const base = path.join(ROOT, plat);
  if (!fs.existsSync(base)) continue;
  for (const e of fs.readdirSync(base, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    packs.push({ platform: plat, version: e.name, dir: path.join(base, e.name) });
  }
}

const census = { packsChecked: 0, rulesFiles: 0, crossLines: 0, contextualSkipped: 0, verdictSkipped: 0, banned: 0, ambiguousDropped: 0, conflicts: 0 };
const perPackBanned = {};
const infoLines = [];

function walkJava(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walkJava(abs, acc);
    else if (e.name.endsWith(".java")) acc.push(abs);
  }
  return acc;
}

for (const pack of packs.sort((a, b) => rel(a.dir).localeCompare(rel(b.dir)))) {
  const rulesDir = path.join(pack.dir, ".cursor", "rules");
  const scaffoldDir = path.join(pack.dir, "scaffold");
  if (!fs.existsSync(rulesDir) || !fs.existsSync(scaffoldDir)) continue;
  const javaFiles = walkJava(scaffoldDir, []);
  const ruleNames = fs.readdirSync(rulesDir).filter((f) => f.endsWith(".mdc")).sort();
  if (javaFiles.length === 0 || ruleNames.length === 0) continue;
  census.packsChecked++;
  census.rulesFiles += ruleNames.length;

  const crossLines = [];
  const plainLines = [];
  let contextualSkipped = 0;
  let verdictSkipped = 0;
  for (const rn of ruleNames) {
    const text = fs.readFileSync(path.join(rulesDir, rn), "utf8");
    const lines = text.split(/\r?\n/);
    let mode = null; // 'bad' = 受 ❌ 判死管辖；'ok' = 受 ✅ 正解管辖
    let governing = ""; // 最近的 ❌ 标题 / ❌ 正文行（管辖其下的对照代码）
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (/^#{1,6}\s/.test(line)) {
        mode = line.includes("❌") ? "bad" : null;
        governing = line.includes("❌") ? line : "";
      }
      const marked = line.includes("❌") ? "bad" : line.includes("✅") ? "ok" : null;
      if (marked) {
        mode = marked;
        governing = marked === "bad" ? line : "";
      }
      if (mode === "bad") {
        const ctx = governing === line ? "" : governing;
        const probe = `${ctx}\n${line}`;
        if (isContextual(probe)) contextualSkipped++; // 判的是场合，不是符号
        else if (!hasVerdict(probe)) verdictSkipped++; // 合法 API 的反例演示，不判死名字
        else crossLines.push({ rn, idx, line, ctx });
      } else plainLines.push(line);
    }
  }
  census.crossLines += crossLines.length;
  census.contextualSkipped += contextualSkipped;
  census.verdictSkipped += verdictSkipped;

  const banned = new Map();
  for (const { rn, idx, line, ctx } of crossLines) {
    for (const cand of candidatesFromLine(`${ctx}\n${line}`)) {
      const sym = symbolShape(cand);
      if (!sym) continue;
      const key = `${sym.kind}:${sym.name}`;
      // A2 歧义过滤：同档任何非 ❌ 行也用了这个文本 → 规则没判死
      const ambiguous = plainLines.some((l) => matchIn(sym, l));
      if (ambiguous) { census.ambiguousDropped++; continue; }
      if (!banned.has(key)) banned.set(key, { ...sym, where: `${rn}:${idx + 1}`, src: line.trim().slice(0, 120) });
      if (DEBUG) console.log(`  debug: ${pack.platform}/${pack.version} \`${sym.name}\` ← ${rn}:${idx + 1}: ${banned.get(key).src}`);
    }
  }
  census.banned += banned.size;
  perPackBanned[`${pack.platform}/${pack.version}`] = banned.size;
  if (banned.size) infoLines.push(`${rel(pack.dir)}: 判死符号 ${banned.size} → ${[...banned.values()].map((s) => s.name).join(", ")}`);

  for (const f of javaFiles) {
    const raw = fs.readFileSync(f, "utf8").split(/\r?\n/);
    const code = blankJavaComments(raw.join("\n"));
    for (const sym of banned.values()) {
      const n = code.findIndex((l) => matchIn(sym, l));
      if (n < 0) continue;
      census.conflicts++;
      fail(
        `${rel(f)}:${n + 1} 抄到同档规则判死的符号 \`${sym.name}\` —— ` +
          `${JSON.stringify((raw[n] || "").trim().slice(0, 90))}｜规则 ${pack.platform}/${pack.version}/.cursor/rules/${sym.where}` +
          ` → 按规则正解改写，禁止照抄 scaffold`,
      );
    }
  }
}

if (census.packsChecked === 0) {
  fail(`根 ${rel(ROOT)} 下没有任何「既有 .cursor/rules 又有 scaffold/*.java」的档 —— 零档不等于零缺陷，检查换根路径`);
}

// ── B. 台账层 ───────────────────────────────────────────────────────────
const LEDGER = {
  packsChecked: 47,
  rulesFiles: 447,
  crossLines: 422,
  // 2026-09-13 重钉（S18 裁定·散文禁令升级）：1.19.4 / 1.20.1 / 1.20.4 的 03-item.mdc 各新增
  // 一条 `❌ Item.Properties#tab(...)` 行（带 api-index + 语料页证据锚）。该 3 行含场合语，
  // 门按「场合型」丢弃 ⇒ contextualSkipped 3021 → 3027（+6 = 3 行 × 含空行 2 行），crossLines 不变。
  contextualSkipped: 3027,
  // 2026-09-14 重钉（S29e · fabric/1.16.5 判死示证改口）：08-client-server.mdc 里两处
  // `EntityRendererRegistry.register(...)`（1.17+ 静态形态，对本档是错签名）换成「实例形态 + 取法见 04」
  // 的指针注释 ⇒ crossLines 425 → 422、verdictSkipped 2261 → 2262、banned 60 → 58（1.16.5 判死清零）。
  // conflicts 仍为 0：这条才是本门的实质判据，台账只负责让「分布变了」必须被看见。
  verdictSkipped: 2262,
  banned: 58,
  conflicts: 0,
};

/**
 * 逐档判死分布。只钉总数会被「一档 +3 / 另一档 −3」互相抵消蒙过去 —— 分布钉住后，
 * 换了个档犯同样的错也红。键 = `<platform>/<version>`，值为 0 的档不登记。
 */
const LEDGER_PER_PACK_BANNED = {
  "fabric/1.14.4": 1,
  "fabric/1.17.1": 1,
  "fabric/1.18.2": 2,
  "fabric/1.19.4": 3,
  "fabric/1.20.1": 3,
  "fabric/1.20.4": 3,
  "fabric/1.21.1": 3,
  "fabric/1.21.3": 2,
  "fabric/1.21.11": 6,
  "fabric/26.1.2": 4,
  "forge/1.14.4": 3,
  "forge/1.15.2": 4,
  "forge/1.16.5": 4,
  "forge/1.17.1": 4,
  "forge/1.18.2": 3,
  "forge/1.19.4": 4,
  "forge/1.20.1": 4,
  "forge/1.20.4": 4,
};

if (!TEST_ROOT) {
  const got = {
    packsChecked: census.packsChecked,
    rulesFiles: census.rulesFiles,
    crossLines: census.crossLines,
    contextualSkipped: census.contextualSkipped,
    verdictSkipped: census.verdictSkipped,
    banned: census.banned,
    conflicts: census.conflicts,
  };
  const gotBanned = Object.fromEntries(Object.entries(perPackBanned).filter(([, v]) => v));
  if (RELEDGER) {
    console.log("  [reledger] 台账重算（把下面的数抄回 LEDGER 常量再提交）：");
    console.log(`    const LEDGER = ${JSON.stringify(got, null, 2).replace(/\n/g, "\n    ")};`);
    console.log(`    const LEDGER_PER_PACK_BANNED = ${JSON.stringify(gotBanned, null, 2).replace(/\n/g, "\n    ")};`);
  } else {
    for (const k of Object.keys(LEDGER)) {
      if (got[k] !== LEDGER[k]) {
        fail(`台账漂移: ${k}=${got[k]}，钉的是 ${LEDGER[k]}（规则 ❌ 写法或 scaffold 变了 → 复核后 MC_SKILL_SCAFFOLD_RELEDGER=1 重钉）`);
      }
    }
    for (const [k, v] of Object.entries(gotBanned)) {
      if (LEDGER_PER_PACK_BANNED[k] === undefined) {
        fail(`判死分布漂移: ${k} 新增 ${v} 个判死符号（台账里该档此前为 0）—— 总数没变也要点名`);
      } else if (LEDGER_PER_PACK_BANNED[k] !== v) {
        fail(`判死分布漂移: ${k} ${LEDGER_PER_PACK_BANNED[k]} → ${v}`);
      }
    }
    for (const [k, v] of Object.entries(LEDGER_PER_PACK_BANNED)) {
      if (!gotBanned[k]) {
        fail(`判死分布漂移: ${k} 的 ${v} 个判死符号没了 —— 复核是真修好了还是 ❌ 示证被删（删示证不算修好）`);
      }
    }
  }
}

if (process.env.MC_SKILL_SCAFFOLD_GATE_INFO === "1") {
  for (const l of infoLines) console.log(`  info: ${l}`);
  console.log(`  info: packs=${census.packsChecked} rules=${census.rulesFiles} ❌判死行=${census.crossLines} 场合型丢弃=${census.contextualSkipped} 无反例判据丢弃=${census.verdictSkipped} 判死=${census.banned} 歧义丢弃=${census.ambiguousDropped} 冲突=${census.conflicts} 根=${ROOT} 台账=${TEST_ROOT ? "skipped(test-root)" : RELEDGER ? "recomputed" : "checked"}`);
}

if (failures.length > 0) {
  console.error(
    `assert-scaffold-rules-conflict: ${failures.length} 项不通过（${census.packsChecked} 档 · 判死符号 ${census.banned} 个 · ` +
      `冲突 ${census.conflicts}）`,
  );
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}

console.log(
  `  assert-scaffold-rules-conflict: ${census.packsChecked} 档 · 规则 ${census.rulesFiles} 篇 / ❌ 行 ${census.crossLines} 条 · ` +
    `判死符号 ${census.banned}（歧义丢弃 ${census.ambiguousDropped}）· scaffold 冲突 0 · 台账 ${TEST_ROOT ? "skipped(test-root)" : RELEDGER ? "recomputed" : "checked"}`,
);
