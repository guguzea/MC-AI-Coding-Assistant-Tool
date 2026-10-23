#!/usr/bin/env node
/**
 * extract-liteloader-api-surface.mjs —— 从**本机未跟踪的 LiteLoader 1.12.2 源码树**（`ll-src/`）
 * 抽「API 签名面」，落进已接的语料面 `data/liteloader_1.12.2/liteloader-docs/1.12.2/`。**默认 dry-run**。
 *
 * ## 为什么要有这一面
 * 上游 `https://develop.liteloader.com/liteloader/LiteLoader` 的 1.12.2 分支是 **All Rights Reserved**
 * （源码头逐字：`Copyright (C) 2012-16 Adam Mummery-Smith` / `All Rights Reserved.`，见
 * `ll-src/com/mumfrey/liteloader/LiteMod.java:1-5`）⇒ **源码本身不得入库、不得再分发**
 * （登记见 `THIRD_PARTY_NOTICES.md` 的「LiteLoader 1.12.2 源码树（`ll-src/`）」节）。
 * 而本仓「禁止凭训练记忆补 API 名」这条红线需要**可核的 API 名**。本脚本走的就是两者之间的那条窄路：
 * **只落类型名与成员签名（接口事实面）**，不落注释散文、不落方法体、不落常量的初始化值、不落任何实现。
 *
 * ## 版权边界（写进产物的 frontmatter，不是口头承诺）
 * - **不抄散文**：javadoc 注释、行内注释、`@author` 之类全部在抽取前被抹平，产物里一个注释字符都没有。
 * - **不抄实现**：方法体整块跳过；`default` 方法只留签名；字段只留 `修饰符 类型 名`，`= …` 之后的初始化值丢弃。
 * - **不抄常量值**：枚举常量只留名字。
 * - ⚠ 这不是「合规证明」：签名集合的版权地位在各法域仍有争议，本脚本只做**最小化复制**。残余风险由
 *   `_surface-report.json` 的 `licenseBoundary` 字段逐条列明，**不得**据此宣称已获再分发授权。
 *
 * ## 落点：**规则树**的知识面，不是 `data/` 语料面
 *   liteloader/1.12.2/knowledge/common/api-surface.md      ← 单文件（与同目录 `verified-api.md` 并列）
 *
 * 为什么是这里（2026-10-22 两条实测）：
 *   ① `data/<platform>_<ver>/<source>/<ver>/` 那种语料面**混不进文档树** —— 实测把 73 个签名页
 *     塞进 `data/liteloader_1.12.2/liteloader-docs/1.12.2/` 会把该树正文中位从 753 拉到 270，
 *     `assert-corpus-semantics` 判「整树变薄/回退为桩」红。签名页是「一行一声明」的薄面，
 *     **天然**比教程正文薄，和教程混算 median 是错的口径；要对就得单开平台 id（`spigot` /
 *     `paper-api` 那条路，需改 `platforms.ts` + build）。
 *   ② 规则树这条路**不用改 src、不进 `data/`**：`liteloader/<ver>/knowledge/common/` 已被
 *     `verified-api.md` 占用为「本档 API 名」的家，本文件是它的**扩面版**（全 73 个公开类型 vs 6 行表）。
 *
 * ## 与 `verified-api.md` 的分工（**不要混读**）
 *   `verified-api.md` = **真构件 javap 复核**（最强证据，可对外输出的名单）；
 *   本文件         = **源码树抽取**（上游 ARR 分支的本地副本），只证明「这个名字在该分支存在」。
 *   ⇒ 本文件可作**检索入口**（别再凭记忆拼 API 名），**不得**当作「可输出给用户的已核实名单」；
 *     两处冲突时以 `verified-api.md` 为准。
 *
 * ## 抽取范围（`--scope`，默认 `api`）
 *   api  = `com/mumfrey/liteloader/*.java` + `api/**` + `modconfig/**`（mod 作者面向的入口与配置面）
 *   all  = 整棵 `com/mumfrey/liteloader/**`（含 core/transformers/client —— 内部实现，仅作本地核对）
 *
 * ## 用法
 *   node scripts/extract-liteloader-api-surface.mjs --list
 *   node scripts/extract-liteloader-api-surface.mjs --selftest          # 解析器自证（内存样本，不碰盘）
 *   node scripts/extract-liteloader-api-surface.mjs --write             # 落盘（默认 dry-run）
 */

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// 落盘一律走守卫（默认 dry-run，`--write` 才写；见 scripts/_lib/write-guard.mjs）
import { emit, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");
const REPO = path.resolve(MCP, "..");

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const SRC = path.resolve(opt("--src") || path.join(REPO, "ll-src"));
const VERSION = opt("--version") || "1.12.2";
const OUT = path.resolve(
  opt("--out") || path.join(REPO, "liteloader", VERSION, "knowledge", "common", "api-surface.md"),
);
const SCOPE = opt("--scope") || "api";
const WRITE = wantWrite();
const LIST = has("--list");
const SELFTEST = has("--selftest");
const PRODUCER_REV = "extract-liteloader-api-surface.mjs@2";
const PKG_ROOT = "com/mumfrey/liteloader"; // jar 内路径前缀（正斜杠）
const PKG_DOTTED = PKG_ROOT.replace(/\//g, "."); // 包名形态（点分隔）—— 别混用，2026-10-22 实测混用会把候选类过滤成 0

// 两条输入路线：src = 源码树（旧路，带形参名）；jar = 真构件 javap（证据等级更高，无参照名）
const JAR = opt("--jar") ? path.resolve(opt("--jar")) : null;
const FROM = opt("--from") || (JAR ? "jar" : "src");
const JAVAP = opt("--javap") || null;
const EXPECT_MD5 = (opt("--expect-md5") || "").toLowerCase();
const VANILLA = opt("--vanilla") || "auto";

/* ────────────────────────── 解析器 ────────────────────────── */

/**
 * 抹平注释与字符串/字符字面量的**内容**，保持偏移与行号不变（换行留着）。
 * 这样后续所有正则都跑在「没有散文」的串上 —— 抽取器不可能把注释带进产物。
 */
function stripNoise(src) {
  const out = src.split("");
  const n = src.length;
  const blank = (a, b) => {
    for (let k = a; k < b; k++) if (out[k] !== "\n" && out[k] !== "\r") out[k] = " ";
  };
  let i = 0;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "/") {
      let j = src.indexOf("\n", i);
      if (j < 0) j = n;
      blank(i, j);
      i = j;
      continue;
    }
    if (c === "/" && d === "*") {
      const j = src.indexOf("*/", i + 2);
      const e = j < 0 ? n : j + 2;
      blank(i, e);
      i = e;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === c) {
          j++;
          break;
        }
        j++;
      }
      blank(i + 1, Math.max(i + 1, j - 1));
      i = j;
      continue;
    }
    i++;
  }
  return out.join("");
}

/** `{` 的配对位置（s[i] 必须是 `{`）。找不到返回 -1。 */
function matchBrace(s, i) {
  let depth = 0;
  for (let k = i; k < s.length; k++) {
    if (s[k] === "{") depth++;
    else if (s[k] === "}") {
      depth--;
      if (depth === 0) return k;
    }
  }
  return -1;
}

/** 在深度 0 处按逗号切（括号/尖括号里的逗号不切）。 */
function splitTopLevel(s, sep) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "<" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === ">" || ch === "]" || ch === "}") depth--;
    if (ch === sep && depth === 0) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}

// 不加 `m` 标志：`rest` 是从某个 `p` 处切到文件尾的串，`^` 必须只认 rest 的第一个字符 ——
// 加了 `m` 会从前面的 `package`/`import` 行一路匹配到后面的 `public interface`，把 decl 撑成一整段前导代码。
const TYPE_RE = /^[ \t]*public[ \t]+(?:(?:abstract|final|static|strictfp)[ \t]+)*(interface|class|enum|@interface)[ \t]+([A-Za-z_$][\w$]*)/;

/** 归一化一条成员声明：去注解、折叠空白、丢初始化值。 */
function normalizeMember(raw) {
  let t = raw.replace(/@[A-Za-z_$][\w$.]*[ \t]*(\[[ \t]*\])?[ \t]*(\((?:[^()]|\([^()]*\))*\))?/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  if (!t) return null;
  // 丢初始化值（`= …`），但保留 `==`（声明里不该出现，保险起见仍然只切单个 `=`）
  const eq = t.indexOf("=");
  if (eq >= 0) t = t.slice(0, eq).trim();
  return t || null;
}

/**
 * 抽一个文件的顶层 public 类型。
 * 返回 `{kind, name, decl, members, enumConstants, skipped: {nested, blocks}}`。
 */
function parseFile(src, expectName) {
  const clean = stripNoise(src);

  // 只在花括号深度 0 处认顶层类型声明
  let depth = 0;
  let declAt = -1;
  let m = null;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === "p" && depth === 0) {
      const rest = clean.slice(i);
      const hit = rest.match(TYPE_RE);
      if (hit) {
        m = hit;
        declAt = i;
        break;
      }
    }
  }
  if (!m) return null;
  if (expectName && m[2] !== expectName) return null;

  const kind = m[1];
  const name = m[2];
  const braceAt = clean.indexOf("{", declAt);
  if (braceAt < 0) return null;
  const decl = normalizeMember(clean.slice(declAt, braceAt));
  const endAt = matchBrace(clean, braceAt);
  if (endAt < 0) return null;
  let body = clean.slice(braceAt + 1, endAt);

  const members = [];
  const skipped = { nested: 0, blocks: 0 };
  let enumConstants = [];

  if (kind === "enum") {
    // 常量区 = 体开头到第一个深度 0 的 `;`（没有就是整段）
    let cut = -1;
    let d = 0;
    for (let i = 0; i < body.length; i++) {
      const ch = body[i];
      if (ch === "(" || ch === "{") d++;
      else if (ch === ")" || ch === "}") d--;
      else if (ch === ";" && d === 0) {
        cut = i;
        break;
      }
    }
    const constsRaw = cut < 0 ? body : body.slice(0, cut);
    enumConstants = splitTopLevel(constsRaw, ",")
      .map((p) => (p.match(/[ \t]*([A-Za-z_$][\w$]*)/) || [])[1])
      .filter(Boolean);
    body = cut < 0 ? "" : body.slice(cut + 1);
  }

  // 深度 1 扫成员：`;` 结尾 = 声明；`{` = 方法体/初始化块/嵌套类型
  let start = 0;
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    if (c === "{") {
      const head = body.slice(start, i);
      const headNorm = normalizeMember(head);
      const isNestedType = headNorm && /\b(class|interface|enum|@interface)\b/.test(headNorm);
      // `= new X() { … }` 是带匿名类的字段初始化，不是方法声明 —— 用 `=` 排除
      const isMethodHead = headNorm && !isNestedType && headNorm.includes("=") === false && /\)[ \t]*(throws[^{]*)?$/.test(headNorm);
      if (isNestedType) skipped.nested++;
      else if (isMethodHead) {
        const sig = normalizeMember(head);
        if (sig && isPubliclyVisible(sig, kind)) members.push(sig);
      } else skipped.blocks++;
      const close = matchBrace(body, i);
      i = close < 0 ? body.length : close + 1;
      start = i;
      continue;
    }
    if (c === ";") {
      const sig = normalizeMember(body.slice(start, i));
      if (sig && isPubliclyVisible(sig, kind)) members.push(sig);
      i++;
      start = i;
      continue;
    }
    i++;
  }

  return { kind, name, decl, members, enumConstants, skipped };
}

/**
 * 接口/注解的成员隐含 public ⇒ 无修饰符也要留；类的成员只留显式 public/protected。
 * 这样「API 面」不会把 private 实现细节带进产物。
 */
function isPubliclyVisible(sig, kind) {
  if (/^private\b/.test(sig)) return false;
  if (kind === "interface" || kind === "@interface") return true;
  return /^(public|protected)\b/.test(sig);
}

/* ────────────────────────── 文件清单 ────────────────────────── */

function walkJava(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkJava(p, acc);
    else if (e.isFile() && e.name.endsWith(".java")) acc.push(p);
  }
  return acc;
}

function collectFiles() {
  const root = path.join(SRC, ...PKG_ROOT.split("/"));
  if (!existsSync(root)) throw new Error(`源码树不在：${root}（--src 指到 ll-src 的父目录）`);
  if (SCOPE === "all") return walkJava(root).sort();
  if (SCOPE !== "api") throw new Error(`--scope 只认 api|all，收到 ${SCOPE}`);
  const files = [];
  for (const e of readdirSync(root, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith(".java")) files.push(path.join(root, e.name));
  }
  files.push(...walkJava(path.join(root, "api")));
  files.push(...walkJava(path.join(root, "modconfig")));
  return files.sort();
}

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/* ────────────────────────── 构件（javap）路线 ────────────────────────── */

/** 找 JDK 工具：显式给 > JAVA_HOME > gradle 自带 jdks（取最高版）> PATH。 */
function findJdkTool(name) {
  const exe = process.platform === "win32" ? `${name}.exe` : name;
  if (name === "javap" && JAVAP) return JAVAP;
  const cands = [];
  if (process.env.JAVA_HOME) cands.push(path.join(process.env.JAVA_HOME, "bin", exe));
  const jdks = path.join(process.env.USERPROFILE || "", ".gradle", "jdks");
  if (existsSync(jdks)) {
    // 按目录名里的主版本号取最大（字典序会把 `jdk-16…` 排在 `eclipse_adoptium-21` 前，
    // 2026-10-22 实测就选错了件；`javap` 新旧都能读 Java 8 class，但版本要可复现）
    const major = (name) => {
      const m = name.match(/(?:jdk|adoptium|jbr)[-_]?(\d+)/i) || name.match(/(\d+)/);
      return m ? Number(m[1]) : 0;
    };
    const dirs = readdirSync(jdks, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({ dir: path.join(jdks, e.name), v: major(e.name) }))
      .sort((a, b) => b.v - a.v);
    for (const d of dirs) cands.push(path.join(d.dir, "bin", exe));
  }
  for (const c of cands) if (existsSync(c)) return c;
  try {
    const out = execFileSync(process.platform === "win32" ? "where" : "which", [exe], { encoding: "utf8" });
    const first = out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
    if (first) return first;
  } catch {
    /* 找不到就下面抛 */
  }
  throw new Error(`找不到 ${exe}：给 --javap <path> 或设 JAVA_HOME（本机 gradle jdks 也没命中）`);
}

/** jar 内 API 面类名（顶层、非内部类、非 package-info），按 --scope 过滤。 */
function collectFromJar(jarPath) {
  if (!existsSync(jarPath)) throw new Error(`构件不在：${jarPath}`);
  const jarExe = findJdkTool("jar");
  const list = execFileSync(jarExe, ["tf", jarPath], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const inScope = (fq) => {
    if (SCOPE === "all") return true;
    const pkg = fq.slice(0, fq.lastIndexOf("."));
    return pkg === PKG_DOTTED || pkg.startsWith(`${PKG_DOTTED}.api`) || pkg.startsWith(`${PKG_DOTTED}.modconfig`);
  };
  const all = list
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((n) => n.startsWith(`${PKG_ROOT}/`) && n.endsWith(".class"))
    .map((n) => n.slice(0, -".class".length).replace(/\//g, "."))
    .filter((fq) => !fq.endsWith("package-info"));
  const fqcns = all.filter((fq) => !fq.includes("$")).filter(inScope);
  // 嵌套类型**只列名**（`Outer$Inner`）：不展开成员，也不再把它们说成"未抽"。
  // 匿名类（`Outer$1` / `Outer$1$2`）不是可引用的类型名，排除。
  const nested = all
    .filter((fq) => fq.includes("$"))
    .filter((fq) => !fq.split("$").slice(1).some((seg) => /^\d+$/.test(seg)))
    .filter((fq) => inScope(fq.split("$")[0]));
  if (SCOPE !== "all" && SCOPE !== "api") throw new Error(`--scope 只认 api|all，收到 ${SCOPE}`);
  if (process.env.MC_SKILL_LL_DEBUG === "1") {
    console.error(`[debug] jar 内条目 ${list.split(/\r?\n/).length} · 候选类 ${fqcns.length} · ${jarExe}`);
    if (!fqcns.length) {
      const raw = list.split(/\r?\n/);
      console.error(`[debug] 前 8 条: ${JSON.stringify(raw.slice(0, 8))}`);
      console.error(`[debug] 含 mumfrey 的行: ${raw.filter((l) => l.includes("mumfrey")).length}`);
      console.error(`[debug] 含 mumfrey 样例: ${JSON.stringify(raw.filter((l) => l.includes("mumfrey")).slice(0, 3))}`);
    }
  }
  return { top: fqcns.sort(), nested: [...new Set(nested)].sort() };
}

/**
 * 解析 `javap` 的文本输出（不加 `-p`：只要 public/protected；package-private 与 private 天然不出现）。
 * 形参名**拿不到** —— 构件里没有 `MethodParameters`（1.12.2/1.10.2/1.8.9 三件实测都只有类型），
 * 这是构件路线相对源码树路线**唯一**的信息损失，产物头部必须写明。
 */
function parseJavapOutput(text) {
  const pages = [];
  const blocks = text.split(/^Compiled from .*$/m).slice(1);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    let declIdx = lines.findIndex((l) => /^\S.*\{$/.test(l));
    if (declIdx < 0) continue;
    const decl = lines[declIdx].replace(/\s*\{$/, "").trim();
    if (!/^public\b/.test(decl)) continue; // 包私有顶层类型不是 API 面
    // class 文件里没有 `enum`/`@interface` 关键字：javap 原样显示成
    // `public final class X extends java.lang.Enum<X>` / `public interface X extends java.lang.annotation.Annotation`
    // （2026-10-22 实测于 1.12.2 的 ConfigStrategy / ExposableOptions）
    const kind = /extends java\.lang\.Enum</.test(decl)
      ? "enum"
      : /extends java\.lang\.annotation\.Annotation\b/.test(decl)
        ? "@interface"
        : /\binterface\b/.test(decl)
          ? "interface"
          : "class";
    const body = [];
    for (let i = declIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (/^\}/.test(l)) break;
      const m = l.match(/^  (.+);$/);
      if (m && !/^static \{\}/.test(m[1]) && /^(public|protected)\b/.test(m[1])) body.push(m[1].trim());
    }
    const fqcnGuess = (decl.match(/\b(?:class|interface|enum|@interface)\s+([\w.$]+)/) || [])[1];
    if (!fqcnGuess) continue;
    const pkg = fqcnGuess.slice(0, fqcnGuess.lastIndexOf("."));
    const name = fqcnGuess.slice(fqcnGuess.lastIndexOf(".") + 1);

    // 枚举常量：javap 形如 `public static final com.x.Level Unversioned`（**不保证全大写**）
    const enumConstants = [];
    const members = [];
    for (const s of body) {
      const em = s.match(new RegExp(`^public static final ${fqcnGuess.replace(/\./g, "\\.")} (\\w+)$`));
      if (kind === "enum" && em) enumConstants.push(em[1]);
      else members.push(s);
    }
    pages.push({
      id: `${VERSION}/${fqcnGuess}`,
      fqcn: fqcnGuess,
      pkg,
      flat: fqcnGuess.replace(/\./g, "_"),
      kind,
      name,
      decl,
      members,
      enumConstants,
      skipped: { nested: 0, blocks: 0 },
    });
  }
  return pages;
}

/**
 * vanilla 类型可读性 —— **比例判据，不是「出现过 `net.minecraft.` 就算 MCP」**。
 * 2026-10-22 实测：1.10.2 件里 `net.minecraft.` 只出现 3 次（`ServerTickable` 那几条），
 * 却有 36 处 `bcx`/`ey`/`eq` 这类裸短类型 ⇒ 首版按「出现即 mcp」把它判成 MCP 可读，是错的。
 */
function detectVanilla(pages) {
  const text = pages.map((p) => `${p.decl} ${p.members.join(" ")}`).join(" ");
  const mcCount = (text.match(/net\.minecraft\./g) || []).length;
  const PRIM = new Set(["int", "long", "float", "double", "boolean", "byte", "char", "short", "void"]);
  const shorts = new Set();
  for (const m of text.matchAll(/(?:^|[(,<[\s])([a-z]{2,4})(?=[,)>\]\s])/g)) {
    const s = m[1];
    if (!PRIM.has(s)) shorts.add(s);
  }
  if (mcCount >= 10 && shorts.size <= 3) return "mcp";
  if (shorts.size >= 5) return "mixed-or-obfuscated";
  return mcCount > shorts.size * 4 ? "mcp" : "mixed-or-obfuscated";
}

function readBrand() {
  const p = path.join(SRC, "liteloader.properties");
  if (!existsSync(p)) throw new Error(`缺 ${p}：取不到上游版本标识（asOfVersion），拒绝继续`);
  const txt = readFileSync(p, "utf8");
  const m = txt.match(/^brand=(.+)$/m);
  if (!m) throw new Error(`${p} 里没有 brand= ⇒ 无法钉 asOfVersion，拒绝继续`);
  return m[1].trim();
}

/* ────────────────────────── 产物拼装 ────────────────────────── */

const KIND_LABEL = { interface: "Interface", class: "Class", enum: "Enum", "@interface": "Annotation" };

/**
 * 整树渲染成一个知识文件。**不用 ``` 围栏**：规则树里 `lint-skill-verified-api` 会扫代码块里的
 * Pascal 名字并要求它出现在同档核实表；签名面是「扩面参考」，不该被那份清单的判据管，故一律用行内码。
 */
function renderKnowledge(pages, meta) {
  const byPkg = new Map();
  for (const p of pages) {
    if (!byPkg.has(p.pkg)) byPkg.set(p.pkg, []);
    byPkg.get(p.pkg).push(p);
  }
  const pkgs = [...byPkg.keys()].sort((a, b) => (a === "com.mumfrey.liteloader" ? -1 : b === "com.mumfrey.liteloader" ? 1 : a.localeCompare(b)));

  const isJar = meta.evidence === "jar";
  const out = [
    `# LiteLoader ${meta.version} API 签名面（${isJar ? "真构件 javap" : "源码树抽取"}）`,
    "",
    ...(isJar
      ? [
          "> **证据等级 = 真构件 `javap`**（本档最高等级，与同目录 `verified-api.md` 同级）。本文件由构件字节直接读出，",
          "> 不是源码树推断；供检索时**别再凭记忆拼 API 名**。即便同级，**仍不得**把本文件当成「可输出给用户的已核实名单」",
          "> —— 对外结论以 `verified-api.md`（人工逐字复核过的窄表）为准。",
        ]
      : [
          "> **证据等级 = 源码树**，不是构件 javap 复核。本文件只证明「这个名字在上游该分支里存在」，",
          "> 供检索时**别再凭记忆拼 API 名**；**不得**当成「可输出给用户的已核实名单」——那由同目录",
          "> `verified-api.md`（真构件 javap 逐字复核）负责，两处冲突以它为准。",
        ]),
    ">",
    `> 来源/版权/边界：根 \`THIRD_PARTY_NOTICES.md\` 的${
      meta.version === "1.12.2" ? "「LiteLoader 1.12.2 源码树」节与「派生的签名面」条" : "「派生的签名面」条"
    }。上游**未给开放许可**（版权保留），`,
    "> 构件与源码树均不入库、不得再分发；本文件**只含类型名与成员签名**，注释散文 / 方法体 / 初始化值均未抽取。",
    "",
    `生成：\`node mcp-server/scripts/extract-liteloader-api-surface.mjs --write\`（生成器 \`${PRODUCER_REV}\`）  `,
    `版本钉：\`${meta.asOfVersion}\`（${meta.asOfSource}）  `,
    ...(isJar
      ? [
          `构件：\`${meta.jarName}\` · md5 \`${meta.jarMd5}\`${meta.expectMd5 ? "（与 `--expect-md5` 给定值一致）" : ""} · ${meta.jarBytes} B  `,
          `javap：\`${meta.javapVersion}\` · vanilla 类型可读性：**${
            meta.vanilla === "mcp" ? "MCP 可读（真名）" : "混淆名 / 混杂 —— 不可据本文件写 vanilla 类名，只证类名·方法名·元数"
          }**`,
        ]
      : [`输入清单哈希：\`${meta.manifestSha256}\``]),
    "",
    "**计数（分母写清）**",
    "",
    isJar
      ? `- 构件内扫 \`${meta.scopeDirs}\` 候选类 **${meta.classCandidates}** 个 → 顶层 public 类型 **${meta.typePages}** 个（接口 ${meta.kinds.interface} / 类 ${meta.kinds.class} / 枚举 ${meta.kinds.enum} / 注解 ${meta.kinds["@interface"]}）`
      : `- 扫 \`${meta.scopeDirs}\` 下 **${meta.javaFiles}** 个 \`.java\` → **${meta.typePages}** 个顶层 public 类型（接口 ${meta.kinds.interface} / 类 ${meta.kinds.class} / 枚举 ${meta.kinds.enum} / 注解 ${meta.kinds["@interface"]}）`,
    `- 成员签名 **${meta.members}** 条 + 枚举常量 **${meta.enumConstants}** 个`,
    ...(isJar
      ? [
          "- 构件路线**没有形参名**：class 文件不带 `MethodParameters`（三版实测），参数只到类型",
          "- 构件路线**看不到注解 `default` 值**（`javap` 不带 `-v` 时不显示 `AnnotationDefault`）",
          "- 枚举按 class 文件原样显示为 `final class ... extends java.lang.Enum<…>`，并含编译器合成的 `values()` / `valueOf()`",
          "- 含编译器合成的 **bridge method**（泛型擦除产物，多为返回 `java.lang.Object` 的同名重载；写作时按泛型真身取，别照抄桥）",
          meta.nestedTypes?.length
            ? `- 嵌套类型 **${meta.nestedTypes.length}** 个：**只列名**（见文末），未展开成员`
            : "- 本构件范围内没有可引用的嵌套类型（匿名类 `Outer$1` 已排除）",
        ]
      : [
          `- 跳过 **${meta.skippedFiles}** 个文件（无顶层 public 类型，即包私有类）`,
          `- **未抽** ${meta.nestedTypes} 个嵌套类型（本脚本只取顶层类型；嵌套类型的名字需另查源码）`,
          `- 方法体 / 初始化块 ${meta.blocks} 处（本文件**不含任何实现**）`,
        ]),
    "",
  ];

  for (const pkg of pkgs) {
    const list = byPkg.get(pkg).sort((a, b) => a.name.localeCompare(b.name));
    out.push(`## \`${pkg}\`（${list.length} 类）`, "");
    for (const p of list) {
      out.push(`### \`${p.fqcn}\``, "", `**${KIND_LABEL[p.kind]}** \`${p.decl.replace(/`/g, "'")}\``, "");
      if (p.enumConstants.length) {
        out.push(`枚举常量：${p.enumConstants.map((c) => "`" + c + "`").join(" · ")}`, "");
      }
      if (p.members.length) {
        for (const s of p.members) out.push(`- \`${s.replace(/`/g, "'")}\``);
        out.push("");
      } else if (!p.enumConstants.length) {
        out.push("_（无成员签名）_", "");
      }
    }
  }

  // 嵌套类型清单：2026-10-23 起不再只说「未抽」—— 把可引用的嵌套类型名逐条列出（不展开成员）。
  // 匿名类（`Outer$1`）不是可写进代码的类型名，已在上游过滤掉。
  if (isJar && meta.nestedTypes?.length) {
    out.push(
      "## 嵌套类型（只列名，未展开成员）",
      "",
      `本构件范围内的嵌套类型 **${meta.nestedTypes.length}** 个（\`Outer$Inner\` 形态；匿名类已排除）。`,
      `它们的**成员签名不在本文件里**，且**可见性未逐个核**（\`jar tf\` 只给文件名，分不出 public 还是 private 内部类）`,
      `⇒ 要用就自己 \`javap -classpath <构件> '<Outer$Inner>'\` 看那一层，别把这里当成「可引用清单」。`,
      "",
    );
    for (const n of meta.nestedTypes) out.push(`- \`${n}\``);
    out.push("");
  }

  out.push(
    "## 未核实 / 未覆盖",
    "",
    ...(isJar
      ? [
          `- 嵌套类型**只列名不展开成员**（${meta.nestedTypes?.length ?? 0} 个，见上一节清单）：它们的成员签名不在本文件里，要用就自己 \`javap\` 那一层。`,
          "- 形参名与注解 `default` 值在构件里取不到（见上「计数」小节的三条限制）。",
          ...(meta.vanilla === "mcp"
            ? []
            : [
                "- ⚠ **本件 vanilla 类型名是混淆名 / 混杂**：签名里的 `bcx`、`ey` 这类**不是**可用的类型名。" +
                  "本档只证「类名 / 方法名 / 元数」，写代码时 vanilla 类型必须另取该版 MCP 名（本档无映射腿）。",
              ]),
          "- 本文件**只**证明「构件里有这个名字与这个形状」，不证明它的行为、也不证明它在别的版本同样存在。",
        ]
      : [
          `- ${meta.nestedTypes} 个嵌套类型未抽（只取顶层类型）。`,
          `- ${meta.skippedFiles} 个文件是包私有类型，按「非 API 面」跳过。`,
          "- 本文件**不是**构件复核：签名逐字来自源码树，未与该版构件的 `javap` 对照。",
          "- 形参名取自源码；构件不带 `MethodParameters`（Paper 侧的同类坑见根 `AGENTS.md`），跨面比形参名要当心。",
        ]),
    "",
  );

  return out.join("\n");
}

/* ────────────────────────── 自证 ────────────────────────── */

function selftest() {
  const cases = [];
  const IFACE = `/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

/**
 * Base interface for mods — 这段散文绝不能出现在产物里
 * @author Adam Mummery-Smith
 */
public interface LiteMod extends Exposable, Listener
{
    /** Get the mod version string */
    public abstract String getVersion();

    public abstract void init(File configPath);
}`;
  cases.push([
    "interface + 注释抹平",
    parseFile(IFACE, "LiteMod"),
    { kind: "interface", declHas: "public interface LiteMod extends Exposable, Listener", members: ["public abstract String getVersion()", "public abstract void init(File configPath)"] },
  ]);

  const CLS = `package x;
public abstract class Impl implements Runnable {
    private static final String SECRET = "do-not-leak";
    public static final int VISIBLE = 42;
    private int hidden;
    public Impl(int a) { this.hidden = a; }
    public void run() {
        int q = 1; // 分号在体内，绝不能被当成员
        if (q > 0) { q++; }
    }
    protected abstract <T extends Comparable<T>> T pick(T a, T b) throws Exception;
    static { System.out.println("block"); }
    public class Inner { public void z() {} }
}`;
  cases.push([
    "class + 方法体/初始化块/私有字段",
    parseFile(CLS, "Impl"),
    { kind: "class", members: ["public static final int VISIBLE", "public Impl(int a)", "public void run()", "protected abstract <T extends Comparable<T>> T pick(T a, T b) throws Exception"], skip: { nested: 1, blocks: 1 } },
  ]);

  const ENUM = `package x;
public enum Level {
    NONE, HIGH(3), ULTRA(4, "u");
    public int weight() { return 1; }
    private final int w;
    Level() { this.w = 0; }
    Level(int w) { this.w = w; }
    Level(int w, String s) { this.w = w; }
}`;
  cases.push(["enum + 常量区", parseFile(ENUM, "Level"), { kind: "enum", enumConstants: ["NONE", "HIGH", "ULTRA"], members: ["public int weight()"] }]);

  // 构件路线（javap 输出）自证：2026-10-22 首版把 `PKG_ROOT`（正斜杠的 jar 内路径前缀）当包名比 ⇒
  // 候选类被过滤成 0，javap 收到空参数、报「未指定类」。这条用例把它钉死。
  const JAVAP_TXT = [
    'Compiled from "LiteMod.java"',
    "public interface com.mumfrey.liteloader.LiteMod extends com.mumfrey.liteloader.modconfig.Exposable,com.mumfrey.liteloader.api.Listener {",
    "  public abstract java.lang.String getVersion();",
    "  public abstract void init(java.io.File);",
    "}",
    'Compiled from "ConfigStrategy.java"',
    "public final class com.mumfrey.liteloader.modconfig.ConfigStrategy extends java.lang.Enum<com.mumfrey.liteloader.modconfig.ConfigStrategy> {",
    "  public static final com.mumfrey.liteloader.modconfig.ConfigStrategy Unversioned;",
    "  public static com.mumfrey.liteloader.modconfig.ConfigStrategy[] values();",
    "  static {};",
    "}",
    'Compiled from "Hidden.java"',
    "class com.mumfrey.liteloader.Hidden {",
    "  public void nope();",
    "}",
  ].join("\n");
  const jp = parseJavapOutput(JAVAP_TXT);
  const javapErrs = [];
  if (jp.length !== 2) javapErrs.push(`应得 2 个 public 类型（包私有的 Hidden 必须被丢），实得 ${jp.length}`);
  const liteMod = jp.find((p) => p.name === "LiteMod");
  const strategy = jp.find((p) => p.name === "ConfigStrategy");
  if (!liteMod) javapErrs.push("缺 LiteMod");
  else {
    if (liteMod.kind !== "interface") javapErrs.push(`LiteMod kind=${liteMod.kind}`);
    if (liteMod.members.length !== 2) javapErrs.push(`LiteMod 成员 ${liteMod.members.length}`);
    if (liteMod.fqcn !== "com.mumfrey.liteloader.LiteMod") javapErrs.push(`fqcn=${liteMod.fqcn}`);
  }
  if (!strategy) javapErrs.push("缺 ConfigStrategy（枚举识别失败）");
  else {
    if (strategy.kind !== "enum") javapErrs.push(`ConfigStrategy kind=${strategy.kind}（应识别为 enum：extends java.lang.Enum）`);
    if (JSON.stringify(strategy.enumConstants) !== '["Unversioned"]') {
      javapErrs.push(`枚举常量 ${JSON.stringify(strategy.enumConstants)}`);
    }
    if (strategy.members.some((m) => m.includes("static {}"))) javapErrs.push("静态初始化块漏进来了");
  }

  let bad = 0;
  if (javapErrs.length) {
    bad++;
    console.log(`❌ javap 解析（构件路线）\n   ${javapErrs.join("\n   ")}`);
  } else console.log("✅ javap 解析（构件路线）");
  for (const [label, got, want] of cases) {
    const errs = [];
    if (!got) errs.push("解析返回 null");
    else {
      if (want.kind && got.kind !== want.kind) errs.push(`kind=${got.kind} != ${want.kind}`);
      if (want.declHas && !got.decl.includes(want.declHas)) errs.push(`decl 不含 ${want.declHas}：${got.decl}`);
      if (want.members) {
        for (const w of want.members) if (!got.members.includes(w)) errs.push(`缺成员 ${w}`);
        const extra = got.members.filter((x) => !want.members.includes(x));
        if (extra.length) errs.push(`多出成员 ${JSON.stringify(extra)}`);
      }
      if (want.enumConstants && JSON.stringify(got.enumConstants) !== JSON.stringify(want.enumConstants)) {
        errs.push(`枚举常量 ${JSON.stringify(got.enumConstants)}`);
      }
      if (want.skip && JSON.stringify(got.skipped) !== JSON.stringify(want.skip)) {
        errs.push(`skipped ${JSON.stringify(got.skipped)} != ${JSON.stringify(want.skip)}`);
      }
      const all = JSON.stringify(got);
      // `package`/`import` 混进 decl 是 2026-10-22 首版真踩过的坑（TYPE_RE 误加 `m` 标志 ⇒
      // decl 从文件头的 `package` 一路撑到类型声明），留作回归哨
      for (const banned of ["do-not-leak", "这段散文", "Mummery", "All Rights", "System.out", "this.hidden", "package ", "import "]) {
        if (all.includes(banned)) errs.push(`泄漏了 ${banned}`);
      }
    }
    if (errs.length) {
      bad++;
      console.log(`❌ ${label}\n   ${errs.join("\n   ")}`);
    } else console.log(`✅ ${label}`);
  }
  const total = cases.length + 1; // +1 = 上面的 javap 解析用例
  console.log(bad ? `\n❌ 自证失败 ${bad}/${total}` : `\n✅ 自证 ${total}/${total}`);
  process.exit(bad ? 1 : 0);
}

/* ────────────────────────── 主流程 ────────────────────────── */

function main() {
  if (SELFTEST) return selftest();

  // fail-closed：本文件是「一行一声明」的薄面，落进 `data/` 的任何语料树都会拖垮该树的正文厚度判据
  // （2026-10-22 实测：混进 `data/liteloader_1.12.2/liteloader-docs/` 把 median 从 753 拉到 270，
  // `assert-corpus-semantics` 判红）。本产物的家是规则树知识面，不是 `data/`。
  if (OUT.split(/[\\/]/).includes("data")) {
    throw new Error(`拒绝落进 data/：${OUT}\n签名面属于规则树知识面（liteloader/<ver>/knowledge/common/），不属于语料面`);
  }

  if (FROM !== "src" && FROM !== "jar") throw new Error(`--from 只认 src|jar，收到 ${FROM}`);

  const scopeDirs = SCOPE === "api" ? `${PKG_ROOT}（顶层 + api/** + modconfig/**）` : `${PKG_ROOT}/**`;
  const kindCount = (pages, k) => pages.filter((p) => p.kind === k).length;

  let pages;
  let meta;
  const skipped = [];

  if (FROM === "jar") {
    if (!JAR) throw new Error("--from=jar 需要 --jar <path>（构件不入库，指到本机留档）");
    if (!existsSync(JAR)) throw new Error(`构件不在：${JAR}`);
    const buf = readFileSync(JAR);
    const jarMd5 = crypto.createHash("md5").update(buf).digest("hex");
    // 与登记值对钉：不符就拒 —— 防止「目录名写着 A、件其实是 B」（拿错件做出来的面比没有更坏）
    if (EXPECT_MD5 && jarMd5 !== EXPECT_MD5) {
      throw new Error(`构件 md5 不符：实测 ${jarMd5}，期望 ${EXPECT_MD5} ⇒ 拒绝，这不是本版登记的那件`);
    }
    const { top: fqcns, nested: nestedTypes } = collectFromJar(JAR);
    const javapExe = findJdkTool("javap");
    const javapVersion = execFileSync(javapExe, ["-version"], { encoding: "utf8" }).trim().split(/\r?\n/)[0];
    const text = execFileSync(javapExe, ["-classpath", JAR, ...fqcns], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
    });
    pages = parseJavapOutput(text);
    const vanilla = VANILLA === "auto" ? detectVanilla(pages) : VANILLA;
    meta = {
      evidence: "jar",
      version: VERSION,
      asOfVersion: opt("--as-of") || VERSION,
      asOfSource: opt("--as-of") ? "显式给" : "回落到版本目录名",
      jarName: path.basename(JAR),
      jarMd5,
      jarBytes: buf.length,
      expectMd5: EXPECT_MD5 || null,
      javapVersion,
      vanilla,
      classCandidates: fqcns.length + nestedTypes.length,
      nestedTypes,
      scopeDirs,
      typePages: pages.length,
      kinds: {
        interface: kindCount(pages, "interface"),
        class: kindCount(pages, "class"),
        enum: kindCount(pages, "enum"),
        "@interface": kindCount(pages, "@interface"),
      },
      members: pages.reduce((a, p) => a + p.members.length, 0),
      enumConstants: pages.reduce((a, p) => a + p.enumConstants.length, 0),
    };
  } else {
    const brand = readBrand();
    const files = collectFiles();
    const manifest = [];
    pages = [];
    for (const f of files) {
      const buf = readFileSync(f);
      const rel = path.relative(SRC, f).replace(/\\/g, "/");
      manifest.push({ file: rel, bytes: buf.length, sha256: sha256(buf) });
      const expect = path.basename(f, ".java");
      let parsed = null;
      try {
        parsed = parseFile(buf.toString("utf8"), expect);
      } catch (e) {
        skipped.push({ file: rel, reason: `parse-error: ${e.message}` });
        continue;
      }
      if (!parsed) {
        skipped.push({ file: rel, reason: "无顶层 public 类型（或与文件不同名）" });
        continue;
      }
      const pkg = path.posix.dirname(rel).replace(/\//g, ".");
      const fqcn = `${pkg}.${parsed.name}`;
      pages.push({
        id: `${VERSION}/${fqcn.replace(/\./g, "_")}`,
        fqcn,
        pkg,
        flat: fqcn.replace(/\./g, "_"),
        kind: parsed.kind,
        name: parsed.name,
        decl: parsed.decl,
        members: parsed.members,
        enumConstants: parsed.enumConstants,
        skipped: parsed.skipped,
      });
    }
    meta = {
      evidence: "src",
      version: VERSION,
      asOfVersion: brand,
      asOfSource: "取自 `ll-src/liteloader.properties` 的 `brand=`",
      manifestSha256: sha256(JSON.stringify(manifest)),
      scopeDirs,
      javaFiles: files.length,
      typePages: pages.length,
      kinds: {
        interface: kindCount(pages, "interface"),
        class: kindCount(pages, "class"),
        enum: kindCount(pages, "enum"),
        "@interface": kindCount(pages, "@interface"),
      },
      members: pages.reduce((a, p) => a + p.members.length, 0),
      enumConstants: pages.reduce((a, p) => a + p.enumConstants.length, 0),
      skippedFiles: skipped.length,
      nestedTypes: pages.reduce((a, p) => a + p.skipped.nested, 0),
      blocks: pages.reduce((a, p) => a + p.skipped.blocks, 0),
    };
  }

  console.log(`输入    : ${FROM === "jar" ? `构件 ${meta.jarName} (md5 ${meta.jarMd5})` : `源码树 ${SRC}`}`);
  console.log(`as-of   : ${meta.asOfVersion}`);
  console.log(`范围    : ${SCOPE}（${FROM === "jar" ? `${meta.classCandidates} 个候选类` : `${meta.javaFiles} 个 .java`}）`);
  console.log(`落点    : ${OUT}`);
  console.log(
    `类型页  : ${meta.typePages}（接口 ${meta.kinds.interface} / 类 ${meta.kinds.class} / 枚举 ${meta.kinds.enum} / 注解 ${meta.kinds["@interface"]}）`,
  );
  console.log(`成员签名: ${meta.members} 条 + 枚举常量 ${meta.enumConstants} 个`);
  if (FROM === "jar") console.log(`vanilla : ${meta.vanilla}`);

  if (LIST) {
    for (const p of pages) console.log(`  ${p.id}  (${p.members.length} 成员)`);
    for (const s of skipped) console.log(`  skip ${s.file}: ${s.reason}`);
    return;
  }

  // 硬失败：抽到 0 页说明范围/路径/构件不对，不能静默写空面
  if (pages.length === 0) throw new Error("抽到 0 个类型 —— 输入不对，拒绝写盘");

  if (!WRITE) {
    console.log("\n（dry-run：未写任何文件；加 --write 落盘）");
    console.log(`产物预览（前 22 行）：\n${renderKnowledge(pages, meta).split("\n").slice(0, 22).join("\n")}`);
    return;
  }

  emit(OUT, renderKnowledge(pages, meta));
  console.log(`\n✅ ${meta.typePages} 个类型 → ${OUT}`);
}

main();
