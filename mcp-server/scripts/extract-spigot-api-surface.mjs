#!/usr/bin/env node
/**
 * extract-spigot-api-surface.mjs —— 从 **`spigot-api` 构件**抽签面，按 MC 版本分档落盘。
 * **默认 dry-run**，`--write` 才落盘；写盘走 write-guard。
 *
 * ## 为什么需要它（javadoc 路线补不了）
 * `hub.spigotmc.org/javadocs/spigot/` **没有版本轴**（`/1.21.4/` 实测 404），
 * `/javadocs/bukkit/` 与 `/javadocs/spigot/` 返回的是**同一份**当前文档 ⇒ 想要「1.21.4 的 Spigot 签名面」，
 * 只能从 maven 的 `org.spigotmc:spigot-api:<ver>-R0.1-SNAPSHOT` 构件上 `javap` 取。
 * （同一条思路的先例：`extract-liteloader-api-surface.mjs` / `extract-rift-api-surface.mjs`。）
 *
 * ## 产物形态**刻意对齐 javadoc 面**
 *   data/spigot_<ver>/spigot-api/<ver>/
 *     raw/<flat>.javap.txt       ← `javap` 原文（当 raw 用，保证 raw↔proc 1:1 可被 G3 核）
 *     processed/<flat>.md        ← frontmatter + `- ` 签名行（与 javadoc 面同构，能进索引与语义门）
 *     index-l0.json / meta.json / _orphan-report.json
 *
 * ## 边界（产物头部与「未核实」节都会写）
 *   - 构件路线**没有形参名**（class 文件不带 `MethodParameters`）、**看不到注解 `default` 值**；
 *   - 含编译器合成的 **bridge method** 与枚举的 `values()/valueOf()`；
 *   - 只证「构件里有这个名字与这个形状」，不证行为。
 *
 * ## 用法
 *   node scripts/extract-spigot-api-surface.mjs --version 1.21.4                    # dry-run
 *   node scripts/extract-spigot-api-surface.mjs --version 1.21.4 --write
 *   node scripts/extract-spigot-api-surface.mjs --version 1.21.4 --write --expect-md5 <md5>
 */

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emit, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const VERSION = opt("--version");
const WRITE = wantWrite();
const MIRROR = opt("--mirror") || "https://repo.papermc.io/repository/maven-public";
const EXPECT_MD5 = (opt("--expect-md5") || "").toLowerCase();
const PRODUCER_REV = "extract-spigot-api-surface.mjs@1";
/** 取数面：Bukkit 核心 + Spigot 扩展。`--scope all` 连 bungee chat 之类一起收。 */
const SCOPE = opt("--scope") || "api";
const PKG_PREFIXES = SCOPE === "all" ? ["org/bukkit/", "org/spigotmc/", "net/md_5/"] : ["org/bukkit/", "org/spigotmc/"];

if (!VERSION) {
  console.error("用法: node scripts/extract-spigot-api-surface.mjs --version <ver> [--write] [--expect-md5 <md5>]");
  process.exit(2);
}

// 目录名沿用平台子目录 `spigot-javadoc`（`PLATFORM_DOC_SUBDIR.spigot`），**不是**说它是 javadoc HTML：
// 来源写在每页 frontmatter 的 `sourceType: javap` 与 `meta.json` 里。这么摆是为了让检索链路
// （`<platform>_<ver>/<subdir>/<ver>` 的拼法）对新档与既有 `stable` 档一致，不用改 store/门。
const OUT_DIR = path.resolve(opt("--out") || path.join(REPO, "data", `spigot_${VERSION}`, "spigot-javadoc", VERSION));

/* ────────────────── JDK 工具 ────────────────── */

function findJdkTool(name) {
  const exe = process.platform === "win32" ? `${name}.exe` : name;
  const explicit = name === "javap" ? opt("--javap") : null;
  if (explicit) return explicit;
  const cands = [];
  if (process.env.JAVA_HOME) cands.push(path.join(process.env.JAVA_HOME, "bin", exe));
  const jdks = path.join(process.env.USERPROFILE || "", ".gradle", "jdks");
  if (existsSync(jdks)) {
    const major = (n) => {
      const m = n.match(/(?:jdk|adoptium|jbr)[-_]?(\d+)/i) || n.match(/(\d+)/);
      return m ? Number(m[1]) : 0;
    };
    for (const d of readdirSync(jdks, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({ dir: path.join(jdks, e.name), v: major(e.name) }))
      .sort((a, b) => b.v - a.v))
      cands.push(path.join(d.dir, "bin", exe));
  }
  for (const c of cands) if (existsSync(c)) return c;
  try {
    const out = execFileSync(process.platform === "win32" ? "where" : "which", [exe], { encoding: "utf8" });
    const first = out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
    if (first) return first;
  } catch {
    /* 落到抛错 */
  }
  throw new Error(`找不到 ${exe}：给 --javap <path> 或设 JAVA_HOME`);
}

/* ────────────────── 构件下载 ────────────────── */

async function resolveSnapshotJar(version) {
  const coord = `org/spigotmc/spigot-api/${version}-R0.1-SNAPSHOT`;
  const metaUrl = `${MIRROR}/${coord}/maven-metadata.xml`;
  const r = await fetch(metaUrl, { signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${metaUrl} → HTTP ${r.status}`);
  const t = await r.text();
  for (const b of t.matchAll(/<snapshotVersion>([\s\S]*?)<\/snapshotVersion>/g)) {
    const ext = (b[1].match(/<extension>([^<]+)</) || [])[1];
    const cls = (b[1].match(/<classifier>([^<]+)</) || [])[1];
    const val = (b[1].match(/<value>([^<]+)</) || [])[1];
    if (ext === "jar" && !cls && val) {
      return { url: `${MIRROR}/${coord}/spigot-api-${val}.jar`, name: `spigot-api-${val}.jar` };
    }
  }
  throw new Error(`metadata 里没有 jar 条目：${metaUrl}`);
}

async function download(url, dest) {
  mkdirSync(path.dirname(dest), { recursive: true });
  if (existsSync(dest) && readFileSync(dest).length > 100_000) return readFileSync(dest);
  const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(600000) });
  if (!r.ok) throw new Error(`下载失败 HTTP ${r.status}：${url}`);
  const b = Buffer.from(await r.arrayBuffer());
  writeFileSync(dest, b);
  return b;
}

/* ────────────────── javap 解析 ────────────────── */

/** 解析 `javap`（不加 `-p`）文本；一次可含多页（每页以 `Compiled from` 开头）。 */
function parseJavap(text) {
  const pages = [];
  for (const block of text.split(/^Compiled from .*$/m).slice(1)) {
    const lines = block.split(/\r?\n/);
    const declIdx = lines.findIndex((l) => /^\S.*\{$/.test(l));
    if (declIdx < 0) continue;
    const decl = lines[declIdx].replace(/\s*\{$/, "").trim();
    if (!/^public\b/.test(decl)) continue;
    const kind = /extends java\.lang\.Enum</.test(decl)
      ? "enum"
      : /extends java\.lang\.annotation\.Annotation\b/.test(decl)
        ? "@interface"
        : /\binterface\b/.test(decl)
          ? "interface"
          : "class";
    const fqcn = (decl.match(/\b(?:class|interface|enum|@interface)\s+([\w.$]+)/) || [])[1];
    if (!fqcn) continue;
    const members = [];
    const enumConstants = [];
    for (let i = declIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (/^\}/.test(l)) break;
      const m = l.match(/^  (.+);$/);
      if (!m || /^static \{\}/.test(m[1]) || !/^(public|protected)\b/.test(m[1])) continue;
      const s = m[1].trim();
      const em = s.match(new RegExp(`^public static final ${fqcn.replace(/\./g, "\\.")} (\\w+)$`));
      if (kind === "enum" && em) enumConstants.push(em[1]);
      else members.push(s);
    }
    pages.push({ fqcn, kind, decl, members, enumConstants, rawBlock: block.trim() });
  }
  return pages;
}

function classesInJar(jar) {
  const jarExe = findJdkTool("jar");
  const list = execFileSync(jarExe, ["tf", jar], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return list
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((n) => n.endsWith(".class") && PKG_PREFIXES.some((p) => n.startsWith(p)))
    .map((n) => n.slice(0, -".class".length).replace(/\//g, "."))
    .filter((fq) => !fq.endsWith("package-info"))
    .map((fq) => fq.replace(/\$/g, ".")) // 嵌套类：`Outer$Inner` → `Outer.Inner`（javap 认点号）
    .sort();
}

/** 分批调 javap（Windows 命令行 ~32KB，1400 个全名会超）。 */
function javapAll(javapExe, jar, fqcns, batch = 120) {
  const chunks = [];
  for (let i = 0; i < fqcns.length; i += batch) chunks.push(fqcns.slice(i, i + batch));
  const texts = [];
  for (const c of chunks) {
    texts.push(
      execFileSync(javapExe, ["-classpath", jar, ...c], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }),
    );
  }
  return texts.join("\n");
}

const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const md5 = (b) => crypto.createHash("md5").update(b).digest("hex");

/* ────────────────── 主流程 ────────────────── */

async function main() {
  console.log(`Spigot API 签名面抽取 · 版本 ${VERSION}`);
  console.log(`  镜像   : ${MIRROR}`);
  console.log(`  取数面 : ${PKG_PREFIXES.join(" + ")}（scope=${SCOPE}）`);
  console.log(`  落点   : ${OUT_DIR}`);

  const resolved = await resolveSnapshotJar(VERSION);
  console.log(`  构件   : ${resolved.name}`);

  if (!WRITE) {
    console.log("\n（dry-run：未下载、未落盘；加 --write 才做）");
    console.log(`  将要：下载 ${resolved.name} → javap 全类 → 写 raw/ + processed/ + index + meta`);
    return;
  }

  // 构件落 `temp/`（gitignored，不入库）：它不是产物，只是这次抽取的输入；
  // 放仓库外的临时区还能避开 write-guard 对「写仓库正文」的闸门语义。
  const jarPath = path.join(REPO, "temp", "spigot-jars", resolved.name);
  const buf = await download(resolved.url, jarPath);
  const jarMd5 = md5(buf);
  if (EXPECT_MD5 && jarMd5 !== EXPECT_MD5) {
    throw new Error(`构件 md5 不符：实测 ${jarMd5}，期望 ${EXPECT_MD5} ⇒ 拒绝，这不是本版登记的那件`);
  }
  console.log(`  下载完 : ${(buf.length / 1048576).toFixed(1)} MB · md5 ${jarMd5}`);

  const javapExe = findJdkTool("javap");
  const javapVersion = execFileSync(javapExe, ["-version"], { encoding: "utf8" }).trim().split(/\r?\n/)[0];
  const fqcns = classesInJar(jarPath);
  console.log(`  类候选 : ${fqcns.length}`);

  const text = javapAll(javapExe, jarPath, fqcns);
  const pages = parseJavap(text);
  if (!pages.length) throw new Error("抽到 0 个类型 —— 构件或范围不对，拒绝写盘");
  console.log(`  javap  : ${pages.length} 个 public 类型`);

  // 目录由 `emit` 自建（它内部 mkdirSync(dirname)），这里不再直接 mkdir —— 仓库正文只能经 emit 落地。
  const rawDir = path.join(OUT_DIR, "raw");
  const procDir = path.join(OUT_DIR, "processed");

  const fetchedAt = opt("--at") || new Date().toISOString();
  const entries = [];
  let memberTotal = 0;
  let enumTotal = 0;

  for (const p of pages) {
    const flat = p.fqcn.replace(/\./g, "_");
    // raw：javap 原文（一页一块），保证 raw↔proc 1:1 可被 G3 核。写盘走 emit（仓库正文的唯一出口）。
    emit(path.join(rawDir, `${flat}.javap.txt`), `Compiled from <spigot-api>\n${p.rawBlock}\n`);
    const body = [
      `- \`${p.decl.replace(/`/g, "'")}\``,
      ...(p.enumConstants.length ? [`- 枚举常量：${p.enumConstants.map((c) => `\`${c}\``).join(" · ")}`] : []),
      ...p.members.map((s) => `- \`${s.replace(/`/g, "'")}\``),
    ].join("\n");
    const header =
      `---\n` +
      `title: "${p.fqcn}"\n` +
      `package: "${p.fqcn.slice(0, p.fqcn.lastIndexOf("."))}"\n` +
      `source: ${resolved.url}\n` +
      `sourceType: javap\n` +
      `fetchedWith: ${PRODUCER_REV}\n` +
      `fetchedAt: ${fetchedAt}\n` +
      `asOfVersion: "${VERSION}-R0.1-SNAPSHOT"\n` +
      `jarMd5: "${jarMd5}"\n` +
      `---\n\n`;
    emit(path.join(procDir, `${flat}.md`), header + body + "\n");
    memberTotal += p.members.length;
    enumTotal += p.enumConstants.length;
    // 索引条目**必须与既有 javadoc 档同形**（`data/spigot_stable/.../index-l0.json` 的字段集）：
    // 检索层会读 `tags.join()` 等字段，少一个就 `Cannot read properties of undefined`（2026-10-23 实测踩到）。
    entries.push({
      id: `${VERSION}/${flat}`,
      version: VERSION,
      label: p.fqcn,
      url: resolved.url,
      tags: ["spigot", "javap", p.fqcn.slice(0, p.fqcn.lastIndexOf("."))],
      priority: "⭐",
      sectionCount: p.members.length + p.enumConstants.length + 1,
    });
  }

  for (const [file, data] of [
    ["index-l0.json", JSON.stringify(entries, null, 0)],
    [
      "meta.json",
      JSON.stringify(
        {
          version: VERSION,
          asOfVersion: `${VERSION}-R0.1-SNAPSHOT`,
          // 名字里带 javadoc 是**目录约定**（PLATFORM_DOC_SUBDIR.spigot），来源以下面两行为准
          faceKind: "signature-face-from-artifact",
          sourceNote: `上游 javadoc 无版本轴（/javadocs/spigot/<ver>/ 实测 404）⇒ 本档签名逐字来自 maven 构件 javap，不是 javadoc HTML 抽取`,
          artifact: resolved.name,
          jarMd5,
          jarBytes: buf.length,
          jarUrl: resolved.url,
          producer: PRODUCER_REV,
          javapVersion,
          fetchedAt,
          counts: { classes: pages.length, members: memberTotal, enumConstants: enumTotal },
          scope: PKG_PREFIXES,
        },
        null,
        2,
      ) + "\n",
    ],
    ["_orphan-report.json", JSON.stringify({ version: VERSION, orphans: [], note: "构件路线无「抓失败」概念：javap 一次成功或整体失败" }, null, 2) + "\n"],
  ]) {
    emit(path.join(OUT_DIR, file), data);
  }

  const kinds = (k) => pages.filter((p) => p.kind === k).length;
  console.log(
    `\n✅ ${pages.length} 类型（接口 ${kinds("interface")} / 类 ${kinds("class")} / 枚举 ${kinds("enum")} / 注解 ${kinds("@interface")}）` +
      ` · 成员 ${memberTotal} + 枚举常量 ${enumTotal}`,
  );
  console.log(`✅ → ${OUT_DIR}`);
  console.log(`   jar sha256 ${sha256(buf).slice(0, 16)}…（留档：jar 在 _jar/ 下，不入库）`);
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});
