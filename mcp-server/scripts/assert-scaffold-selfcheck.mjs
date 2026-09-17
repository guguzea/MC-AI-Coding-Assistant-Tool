/**
 * Gate：W5-S25a —— Fabric scaffold 自洽门（「照模板即失败」族的静态拦截）。
 *
 * 背景：scaffold 是 agent 生成工程时逐字抄的模板。族 A（F159 / F164 / F167 / F168）的共同形态是
 * 「模板自身引用了自己没有的东西」：processResources 的 expand 键少给 ⇒ Gradle 抛
 * MissingPropertyException；accessWidener / mixins.json / icon / entrypoint 指向不存在的文件或类
 * ⇒ loom 配置期或 loader 启动期炸；依赖行被注释掉但 .java 仍 import 它 ⇒ 「程序包不存在」。
 * 这类缺陷不需要读懂业务语义就能判死，所以钉成静态门。S25a 只修了被授权的 6 档
 * （1.14.4 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.21.1），门本身对**全部 fabric 档**生效；
 * 越权档（1.21.3 等）的既有违规走下面的 KNOWN 台账，不放宽断言。
 *
 * 断言面（逐档跑 `fabric/<ver>/scaffold/`）：
 *   A1 expand 自洽：`filesMatching(...) { expand ... }` 给出的键集合 ⊇ 该档 `src/**` 里实际出现的
 *      `${...}` 占位符集合。**用集合判定，不硬编码键清单** —— 每档占位符形状本来就不同
 *      （1.21.1 把 authors/license 写成字面量、1.21.4/1.21.8/1.21.10/26.1.2 只用 `${version}`），
 *      钉死清单必然 per-档漂移。`expand replaceProperties`（变量式 map，1.21.11 用）同样识别。
 *   A2 引用文件存在：build.gradle 的 `accessWidenerPath = file(...)`（只看不被注释的声明）、
 *      fabric.mod.json 的 `mixins[]` / `icon` / `custom` 里的 `*.accesswidener` 路径，解析
 *      `${...}`（按同档 gradle.properties）后必须在 scaffold 内存在。
 *   A3 入口类存在：fabric.mod.json `entrypoints` 的每个类名，`${maven_group}` / `${mod_id}` 解析后
 *      必须能在 `src/main/java/**` 找到同名 `.java`。
 *   A4 wrapper 三件：`gradlew` / `gradlew.bat` / `gradle/wrapper/gradle-wrapper.properties` 齐备。
 *      例外走仓内既有口径：`pack.meta.json` 的 `scaffold.mode === "reference"` 表示本档 scaffold
 *      按参照件读、wrapper 缺件已在该 meta 的 `gaps[]` 里登记（实测 1.21.4 / 1.21.8 / 1.21.10 /
 *      26.1.2 四档即此形态），不当成本门的红。
 *   A5 注释依赖不得仍被 import：被 `//` 注释掉的依赖坐标（modImplementation / modApi /
 *      implementation / compileOnly / runtimeOnly / include 等），若该 group:artifact 在别处没有
 *      **启用态**声明，而它隐含的 Java 包前缀（group 去掉 `-` 后缀段，如
 *      `net.fabricmc.fabric-api` → `net.fabricmc.fabric`）仍被 `src/` 下的 .java import ⇒ 红。
 *
 * 盲区（写明，不假装覆盖）：
 *   · A1 只管「键在不在」，不管「该文件在不在 filesMatching 的 glob 里」。实测除 1.21.11 外所有档
 *     的 glob 都是 `["fabric.mod.json", "pack.mcmeta"]`，而 `examplemod.mixins.json` 同样带
 *     `${maven_group}.${mod_id}` ⇒ 那棵树上的占位符根本不会被展开。这是 glob 覆盖面问题，
 *     改 glob 超出 S25a 授权（任务书：filesMatching 块以外一律不碰），已移交 S25b。
 *   · A2 不查 mixins.json **内部**声明的 mixin 类是否存在（1.17.1 / 1.18.2 缺件、1.21.3 / 1.21.11
 *     的 `"${mod_id}.mixin.ExampleMixin"` 与 package 双前缀）。实测 1.21.1 该项本就自洽 ⇒ 无红可拦，
 *     按任务书只登记；要进门需 S25b 一并定案（补类还是去声明）。
 *   · A5 只看「推导包根 vs import 前缀」，两处先天限制：① 看不出「坐标本身写错」—— 历史活例是 1.19.4
 *     build.gradle 注释态的 `net.fabric.sdk:fabric-api`（仓内不存在的 groupId，取消注释也解析不到），
 *     2026-09-14 S41 已把该腿改成启用态正坐标 ⇒ 门这条盲区暂无活例，但判据仍不覆盖此类；
 *     ② 包根按 Maven 惯例从 group/artifact 同形推，库若故意不同形（Cloth：
 *     `me.shedaniel.cloth:cloth-config-fabric` ↔ 实际包根 `me.shedaniel.clothconfig2`）推不出来
 *     ⇒ A5 只对与包根同形的坐标（Fabric API 这一族）有约束力。
 *   · Gradle 求值面（`project.X` 是否真的存在、loom 版本与 Gradle 版是否相配）不在门内 —— 那要跑
 *     真构建，属人在环，不由本门代跑。
 *
 * 用法：
 *   node scripts/assert-scaffold-selfcheck.mjs
 *   MC_SKILL_SCAFFOLD_SELFCHECK_RELEDGER=1 node scripts/assert-scaffold-selfcheck.mjs  # 重算豁免台账并打印
 *   MC_SKILL_SCAFFOLD_SELFCHECK_TEST_ROOT=<假根> node scripts/assert-scaffold-selfcheck.mjs
 *       # 投毒自证用：假根下**不查豁免台账**（否则被投的桩若撞上榜里的键会假绿）
 *   MC_SKILL_SCAFFOLD_SELFCHECK_INFO=1 ...                                              # 打印逐条命中与豁免
 *
 * 注：本 gate 只读知识库根，不依赖 dist，也不需要 npm run build。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.MC_SKILL_SCAFFOLD_SELFCHECK_TEST_ROOT
  ? path.resolve(process.env.MC_SKILL_SCAFFOLD_SELFCHECK_TEST_ROOT)
  : path.resolve(HERE, "..", "..");
const RELEDGER = process.env.MC_SKILL_SCAFFOLD_SELFCHECK_RELEDGER === "1";
const INFO = process.env.MC_SKILL_SCAFFOLD_SELFCHECK_INFO === "1";
const TEST_ROOT = Boolean(process.env.MC_SKILL_SCAFFOLD_SELFCHECK_TEST_ROOT);
const PLATFORM = "fabric";

/**
 * 已知豁免台账。一条 = 一个「已实测、但本轮无权/不该由 S25a 修」的命中。
 * 匹配键格式见 finding()；台账里的键**必须**命中真实 finding（否则算失效豁免 = 红），
 * 新出现的违规没有上榜 = 红。⇒ 台账只能显式改，不会被门悄悄放宽。
 */
const KNOWN = [
  // A1 · （原 "A1|1.21.3|src/main/resources" 豁免已于 2026-09-16 撤销：该档升 Gradle 8.10 时
  //      按 fabric/1.21.1 成功基线补齐 expand 的 mod_name / mod_description，并把 fabric.mod.json 的
  //      authors/license 改硬编码 ⇒ 真机构建 BUILD SUCCESSFUL in 1m54s，命中归零，台账不许留空壳）
  // A2 · icon 声明 `assets/examplemod/icon.png` 但 scaffold 不带货架图标二进制：
  //      loader 侧缺图标只 WARN（回退默认图标），不属「照模板即失败」的阻断族；
  //      补 PNG 是往知识库塞二进制资产，需用户裁定，不由本门顺手生成。10 档同形。
  "A2|1.14.4|icon|assets/examplemod/icon.png",
  "A2|1.16.5|icon|assets/examplemod/icon.png",
  "A2|1.17.1|icon|assets/examplemod/icon.png",
  "A2|1.18.2|icon|assets/examplemod/icon.png",
  "A2|1.19.4|icon|assets/examplemod/icon.png",
  "A2|1.20.1|icon|assets/examplemod/icon.png",
  "A2|1.20.4|icon|assets/examplemod/icon.png",
  "A2|1.21.1|icon|assets/examplemod/icon.png",
  "A2|1.21.3|icon|assets/examplemod/icon.png",
  "A2|1.21.11|icon|assets/examplemod/icon.png",
  // A5 · 历史命中已全部清零（2026-09-14 S41）：fabric-api 腿在 1.14.4 / 1.16.5（S25a 任务书点名）
  //      与 1.17.1 / 1.19.4 / 1.21.3（S41 补，任务书未点 ⇒ 当时只登记）五档均已改成启用态正坐标，
  //      与本文件 Cloth 段 `exclude group: "net.fabricmc.fabric-api"` 同源。注释态的 Cloth 腿不算 A5 命中：
  //      包根 `me.shedaniel.clothconfig2` 与坐标 group 不同形（见上「盲区」②），门推不出它的包前缀。
  //      1.21.1:36 注释的是正坐标加 `+extra` 后缀，同坐标在 :30 已是启用态 ⇒ 走「别处已启用」豁免支路。
];

const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/") || ".";
const infoLines = [];

if (!fs.existsSync(path.join(ROOT, PLATFORM))) {
  console.error(`assert-scaffold-selfcheck: 找不到 ${rel(ROOT)}/${PLATFORM} —— 检查换根路径`);
  process.exit(1);
}

// ── 工具 ────────────────────────────────────────────────────────────────
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, acc);
    else acc.push(abs);
  }
  return acc;
}
const relSc = (sc, abs) => path.relative(sc, abs).split(path.sep).join("/");
const isCommentLine = (line) => /^\s*(\/\/|\*|\/\*)/.test(line);
/**
 * 把 Groovy 源码里的字符串内容与注释挖成空格（保长度、保换行），只用于结构扫描（括号配对）。
 * 必须同时认注释：1.21.11 `build.gradle:2` 的注释里有一个英文撇号（`tree's`），只认引号的实现会
 * 把它当字符串起始，一路吞到下一个 `'` —— 实测那样 `filesMatching` 整块消失、expand 键被误判为 0。
 */
function maskStrings(src) {
  const out = src.split("");
  let state = "code"; // code | sq | dq | line | block
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    const d = src[i + 1];
    if (state === "code") {
      if (c === "/" && d === "/") { state = "line"; out[i] = " "; continue; }
      if (c === "/" && d === "*") { state = "block"; out[i] = " "; continue; }
      if (c === '"' || c === "'") state = c === '"' ? "dq" : "sq"; // 保留引号本身
      continue;
    }
    if (state === "line") {
      if (c === "\n") { state = "code"; continue; }
      out[i] = " ";
      continue;
    }
    if (state === "block") {
      if (c === "*" && d === "/") { state = "code"; out[i] = " "; i++; continue; }
      if (c !== "\n") out[i] = " ";
      continue;
    }
    // 字符串态：内容挖空，闭合引号保留
    if (c === "\\") { out[i] = " "; i++; if (src[i] !== "\n") out[i] = " "; continue; }
    if ((state === "dq" && c === '"') || (state === "sq" && c === "'")) { state = "code"; continue; }
    if (c !== "\n") out[i] = " ";
  }
  return out.join("");
}
function pairEnd(src, start, open, close) {
  if (start < 0 || src[start] !== open) return -1;
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === open) depth++;
    else if (src[i] === close) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
/** gradle.properties → map；`version` 若缺则按 scaffold 惯例从 `mod_version` 派生。 */
function readProps(sc) {
  const p = path.join(sc, "gradle.properties");
  const map = new Map();
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      if (isCommentLine(line) || !line.includes("=")) continue;
      const i = line.indexOf("=");
      map.set(line.slice(0, i).trim(), line.slice(i + 1).trim());
    }
  }
  if (!map.has("version") && map.has("mod_version")) map.set("version", map.get("mod_version"));
  return map;
}
/** 用 props 解析 `${k}`；解析不掉的占位符原样留着（调用方按「未解析」判）。 */
function resolveTokens(text, props) {
  return String(text).replace(/\$\{([^}]*)\}/g, (all, k) => (props.has(k) ? props.get(k) : all));
}
const unresolved = (text) => /\$\{[^}]*\}/.test(text);

/** 解析 build.gradle 里所有 `filesMatching(...) { ... }` 块 → { globs:[…], body } + expand 键集合。 */
function parseExpand(bg) {
  const masked = maskStrings(bg);
  // 先收集 `NAME = [ k: v, ... ]` 形式的具名 map（`expand replaceProperties` 用）
  const namedMaps = new Map();
  for (const m of masked.matchAll(/\b([A-Za-z_]\w*)\s*=\s*\[/g)) {
    const end = pairEnd(masked, masked.indexOf("[", m.index), "[", "]");
    if (end < 0) continue;
    const body = bg.slice(m.index + m[0].length, end);
    const keys = [...body.matchAll(/(?:^|[,\[{])\s*(["']?)([A-Za-z_]\w*)\1\s*:/g)].map((x) => x[2]);
    if (keys.length) namedMaps.set(m[1], keys);
  }
  const blocks = [];
  let pos = 0;
  while (true) {
    const at = masked.indexOf("filesMatching", pos);
    if (at < 0) break;
    const paren = masked.indexOf("(", at);
    const parenEnd = pairEnd(masked, paren, "(", ")");
    const brace = parenEnd > 0 ? masked.indexOf("{", parenEnd) : -1;
    const braceEnd = brace > 0 ? pairEnd(masked, brace, "{", "}") : -1;
    if (parenEnd < 0 || braceEnd < 0) { pos = at + 11; continue; }
    const args = bg.slice(paren + 1, parenEnd);
    const body = bg.slice(brace + 1, braceEnd);
    const globs = [...args.matchAll(/(["'])([^"']+)\1/g)].map((x) => x[2]);
    const keys = new Set();
    for (const em of body.matchAll(/\bexpand\b/g)) {
      const rest = body.slice(em.index + em[0].length);
      const first = rest.trimStart();
      const ident = first.match(/^[A-Za-z_]\w*(?=\s*$|\s*\n)/);
      if (ident && namedMaps.has(ident[0])) {
        for (const k of namedMaps.get(ident[0])) keys.add(k);
      }
      for (const k of rest.matchAll(/(["'])([A-Za-z_]\w*)\1\s*:/g)) keys.add(k[2]);
      for (const k of rest.matchAll(/(?:^|[,\[{])\s*([A-Za-z_]\w*)\s*:/g)) keys.add(k[1]);
    }
    blocks.push({ globs, keys, body });
    pos = braceEnd;
  }
  return { blocks, namedMaps };
}

/**
 * Maven 坐标 → 该库的 Java 包根。group 末段带 `-xxx` 后缀时先剥掉（`net.fabricmc.fabric-api` → `net.fabricmc.fabric`）；
 * group 与 artifact 不同形（畸形坐标 `net.fabricmc:fabric-api`，少了 group 里的 `.fabric-api` 段）时补上 artifact 首段。
 * 两条路径对 Fabric API 收敛到同一个包根，也就不会退化去匹配 fabric-loader 的 `net.fabricmc.api.*`。
 */
function javaPackageRoot(group, artifact) {
  const a0 = String(artifact || "").split("-")[0];
  const gLast = String(group || "").split(".").pop() || "";
  if (!a0 || gLast.split("-")[0] === a0) return String(group || "").split("-")[0];
  return `${group}.${a0}`;
}

const TEXT_EXT = new Set([".json", ".mcmeta", ".java", ".properties", ".txt", ".toml", ".accesswidener", ".md", ".cfg"]);
const DEP_KW = "modImplementation|modApi|modCompileOnly|modRuntimeOnly|modLocalRuntime|implementation|compileOnly|runtimeOnly|annotationProcessor|localRuntime|include|api";
const CONFIGURATION_EXEMPT_MODES = new Set(["reference"]);

// ── 逐档扫描 ─────────────────────────────────────────────────────────────
const findings = [];
function finding(key, msg) {
  findings.push({ key, msg });
}

const census = { packs: 0, scaffoldFiles: 0, srcFiles: 0, javaFiles: 0, expandBlocks: 0, depLines: 0 };
const vers = fs.readdirSync(path.join(ROOT, PLATFORM), { withFileTypes: true })
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

for (const v of vers) {
  const sc = path.join(ROOT, PLATFORM, v, "scaffold");
  if (!fs.existsSync(sc) || !fs.existsSync(path.join(sc, "build.gradle"))) continue;
  census.packs++;
  const all = walk(sc);
  census.scaffoldFiles += all.length;
  const rels = all.map((f) => relSc(sc, f));
  const props = readProps(sc);
  const bgRaw = fs.readFileSync(path.join(sc, "build.gradle"), "utf8");
  const bgLines = bgRaw.split(/\r?\n/);

  // ── A1 expand 键 ⊇ src/** 实际占位符 ────────────────────────────
  const { blocks } = parseExpand(bgRaw);
  census.expandBlocks += blocks.length;
  const expandKeys = new Set();
  for (const b of blocks) for (const k of b.keys) expandKeys.add(k);
  const phByDir = new Map(); // 目录前缀 → 缺键集合（台账键按目录粒度，避免逐文件膨胀）
  const srcFiles = rels.filter((r) => r.startsWith("src/"));
  for (const r of srcFiles) {
    const abs = path.join(sc, r);
    if (!TEXT_EXT.has(path.extname(r))) continue;
    census.srcFiles++;
    const txt = fs.readFileSync(abs, "utf8");
    const missing = new Set();
    for (const m of txt.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)) if (!expandKeys.has(m[1])) missing.add(m[1]);
    if (!missing.size) continue;
    const dir = path.posix.dirname(r);
    if (!phByDir.has(dir)) phByDir.set(dir, new Set());
    for (const k of missing) phByDir.get(dir).add(k);
    infoLines.push(`A1 ${v}: ${r} 缺 expand 键 ${[...missing].sort().join(",")}（expand 键 ${expandKeys.size}）`);
  }
  for (const [dir, missing] of phByDir) {
    finding(`A1|${v}|${dir}`,
      `${rel(sc)}/build.gradle 的 expand 只有 ${[...expandKeys].sort().join(",") || "(空)"}，` +
      `${dir}/** 用到而缺的键：${[...missing].sort().join(",")} ⇒ Gradle expand 抛 MissingPropertyException（照模板即构建失败）`);
  }

  // ── A2 引用文件（accesswidener / mixins.json / icon）──────────────
  const checkResFile = (resolvedPath, kind, from) => {
    const cands = [
      `src/main/resources/${resolvedPath}`,
      resolvedPath,
    ];
    const hit = rels.some((r) => cands.includes(r));
    if (!hit) finding(`A2|${v}|${kind}|${resolvedPath}`,
      `${from} 指向 ${resolvedPath}，scaffold 内不存在（候选 ${cands.join(" / ")}）`);
    return hit;
  };
  for (let i = 0; i < bgLines.length; i++) {
    const line = bgLines[i];
    if (isCommentLine(line)) continue;
    for (const m of line.matchAll(/accessWidenerPath\s*=\s*file\(\s*["']([^"']+)["']/g)) {
      const p = resolveTokens(m[1], props);
      if (unresolved(p)) {
        finding(`A2|${v}|aw|unresolved`, `${rel(sc)}/build.gradle:${i + 1} accessWidenerPath 仍含未解析占位符 ${m[1]}（gradle.properties 缺键）`);
        continue;
      }
      checkResFile(p.replace(/^\/+/, ""), "aw", `${rel(sc)}/build.gradle:${i + 1}`);
    }
  }
  const fmjRel = "src/main/resources/fabric.mod.json";
  let fmj = null;
  if (rels.includes(fmjRel)) {
    try {
      fmj = JSON.parse(fs.readFileSync(path.join(sc, fmjRel), "utf8"));
    } catch (e) {
      finding(`A2|${v}|json`, `${rel(sc)}/${fmjRel} 不是合法 JSON：${e.message}`);
    }
  }
  if (fmj) {
    for (const entry of Array.isArray(fmj.mixins) ? fmj.mixins : []) {
      const p = resolveTokens(typeof entry === "string" ? entry : entry?.config ?? "", props);
      if (unresolved(p)) { finding(`A2|${v}|mixins|unresolved`, `${fmjRel} "mixins" 项 ${entry} 含 gradle.properties 未定义的占位符`); continue; }
      checkResFile(p, "mixins", `${fmjRel} "mixins"`);
    }
    if (typeof fmj.icon === "string" && fmj.icon) {
      const p = resolveTokens(fmj.icon, props);
      if (unresolved(p)) finding(`A2|${v}|icon|unresolved`, `${fmjRel} "icon" 项 ${fmj.icon} 含未定义占位符`);
      else checkResFile(p, "icon", `${fmjRel} "icon"`);
    }
    const awStrings = [];
    (function scan(node) {
      if (typeof node === "string") { if (node.endsWith(".accesswidener")) awStrings.push(node); return; }
      if (Array.isArray(node)) { for (const x of node) scan(x); return; }
      if (node && typeof node === "object") { for (const x of Object.values(node)) scan(x); }
    })(fmj.custom ?? {});
    for (const s of awStrings) {
      const p = resolveTokens(s, props);
      if (unresolved(p)) { finding(`A2|${v}|aw|unresolved`, `${fmjRel} custom 里 ${s} 含未定义占位符`); continue; }
      checkResFile(p, "aw", `${fmjRel} custom`);
    }

    // ── A3 entrypoints ────────────────────────────────────────────
    for (const [kind, list] of Object.entries(fmj.entrypoints ?? {})) {
      for (const raw of Array.isArray(list) ? list : []) {
        const val = typeof raw === "string" ? raw : raw?.value;
        if (!val) continue;
        const fqcn = resolveTokens(val, props);
        const expected = `src/main/java/${fqcn.replace(/\./g, "/")}.java`;
        if (!rels.includes(expected)) {
          finding(`A3|${v}|entrypoint|${kind}|${fqcn}`,
            `${fmjRel} entrypoints.${kind} 声明 ${val} → 解析为 ${fqcn}，但 ${expected} 不存在 ⇒ loader 启动即报入口类缺失`);
        }
      }
    }
  }

  // ── A4 wrapper 三件（pack.meta.json 声明 reference 的档豁免）──────
  let mode = null;
  const metaPath = path.join(ROOT, PLATFORM, v, "pack.meta.json");
  if (fs.existsSync(metaPath)) {
    try { mode = JSON.parse(fs.readFileSync(metaPath, "utf8"))?.scaffold?.mode ?? null; }
    catch { finding(`A4|${v}|meta`, `${rel(metaPath)} 不是合法 JSON`); }
  }
  if (!mode || !CONFIGURATION_EXEMPT_MODES.has(mode)) {
    for (const f of ["gradlew", "gradlew.bat", "gradle/wrapper/gradle-wrapper.properties"]) {
      if (!rels.includes(f)) finding(`A4|${v}|wrapper|${f}`, `${rel(sc)} 缺 ${f}（scaffold.mode=${mode ?? "未声明"}，不是 reference 豁免）`);
    }
  } else {
    infoLines.push(`A4 ${v}: scaffold.mode=reference → wrapper 三件按 pack.meta.json gaps[] 豁免`);
  }

  // ── A5 被注释掉的依赖 vs .java import ────────────────────────────
  const enabledGroups = new Set();
  const commented = [];
  for (let i = 0; i < bgLines.length; i++) {
    const line = bgLines[i];
    const dm = line.match(new RegExp(`(?:^|[\\s("'])(${DEP_KW})[\\s("']+([A-Za-z0-9_.\\-]+):([A-Za-z0-9_.\\-]+)`));
    if (!dm) continue;
    census.depLines++;
    const coord = `${dm[2]}:${dm[3]}`;
    if (isCommentLine(line)) commented.push({ i, line, coord, group: dm[2], artifact: dm[3] });
    else enabledGroups.add(coord);
  }
  const javaText = rels.filter((r) => r.endsWith(".java")).map((r) => {
    census.javaFiles++;
    return { r, txt: fs.readFileSync(path.join(sc, r), "utf8") };
  });
  const seen = new Set();
  for (const { i, coord, group, artifact } of commented) {
    if (enabledGroups.has(coord)) continue; // 同坐标另有启用态声明 ⇒ 依赖在场，注释行只是冗余示例
    const prefix = javaPackageRoot(group, artifact);
    if (!prefix || prefix.split(".").length < 2) continue;
    let hit = null;
    for (const j of javaText) {
      const ls = j.txt.split(/\r?\n/);
      for (let n = 0; n < ls.length && !hit; n++) {
        const t = ls[n].trim();
        if (t.startsWith(`import ${prefix}.`) || t.startsWith(`import ${prefix}(`)) hit = { r: j.r, n, t };
      }
      if (hit) break;
    }
    if (!hit) continue;
    const key = `A5|${v}|dep|${coord}`;
    if (seen.has(key)) continue;
    seen.add(key);
    finding(key,
      `${rel(sc)}/build.gradle:${i + 1} 依赖 ${coord} 处于注释态，但 ${relSc(sc, path.join(sc, hit.r))}:${hit.n + 1} 仍 \`${hit.t}\` ` +
      `⇒ 程序包 ${prefix} 不在 classpath，编译失败`);
  }
}

if (census.packs === 0) fail(`${rel(ROOT)}/${PLATFORM}/*/scaffold 一个都没扫到 —— 零档不等于零缺陷，检查换根路径`);

// ── 台账层 ───────────────────────────────────────────────────────────────
const known = TEST_ROOT ? [] : KNOWN;
const knownSet = new Set(known);
if (knownSet.size !== known.length) fail(`豁免台账里有重复键：${known.filter((k, n) => known.indexOf(k) !== n).join(", ")}`);

const exempt = [];
const red = [];
for (const f of findings) (knownSet.has(f.key) ? exempt : red).push(f);

if (!TEST_ROOT) {
  for (const k of knownSet) {
    if (!findings.some((f) => f.key === k)) {
      fail(`豁免台账失效：${k} 在本轮扫描里已无对应命中（项已修好或键写错）⇒ 删掉这条豁免，别留空壳`);
    }
  }
}
for (const f of red) fail(f.msg);

if (INFO) {
  for (const l of infoLines) console.log(`  info: ${l}`);
  for (const f of findings) console.log(`  ${knownSet.has(f.key) ? "exempt" : "RED"}: ${f.key}`);
}

const summary = () =>
  `${census.packs} 档 scaffold（文件 ${census.scaffoldFiles} / src 文本 ${census.srcFiles} / java ${census.javaFiles}）· ` +
  `filesMatching 块 ${census.expandBlocks} · 依赖行 ${census.depLines} · 命中 ${findings.length}（豁免 ${exempt.length} / 红 ${red.length}）· ` +
  `台账 ${TEST_ROOT ? "skipped(test-root)" : RELEDGER ? "recomputed" : `${known.length} 条`}`;

if (RELEDGER && !TEST_ROOT) {
  console.log("  [reledger] 豁免台账重算（把下面的数组抄回 KNOWN 常量再提交）：");
  const keys = findings.map((f) => f.key).sort();
  console.log(`  const KNOWN = ${keys.length ? JSON.stringify(keys, null, 2).replace(/\n/g, "\n  ") : "[]"};`);
  console.log(`  ${summary()}`);
  process.exit(0);
}

if (failures.length) {
  console.error(`assert-scaffold-selfcheck: ${failures.length} 项不通过（${summary()}）`);
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}
console.log(`  assert-scaffold-selfcheck: ${summary()}`);
