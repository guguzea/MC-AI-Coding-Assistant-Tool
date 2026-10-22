#!/usr/bin/env node
/**
 * extract-rift-api-surface.mjs —— 从 **Rift 真构件**抽 `verified-api.md`（Rift 侧签名表）。**默认 dry-run**。
 *
 * ## 为什么要有这个脚本
 * `rift/1.13.2/knowledge/common/verified-api.md` 里那张「39 个 listener 接口」表是 **`javap` 对真构件**
 * 跑出来的（表头自己写明「不是 wiki 转述」），但它当初是手工整理的。新增 `rift/1.13/` 档时，
 * 若把 1.13.2 那份直接拷过来，就等于「复制结论」——本项目要的是**同源复算**：
 * 同一个件、重跑一遍 `javap`、按同一张表的形状重新生成。
 *
 * ## 事实（2026-10-23 实测，两条都独立核过）
 * - 上游 `DimensionalDevelopment/Rift` **archived**（最后提交 2019-01-01），**MIT**。
 * - 构件 `Rift:1.0.4-106` 的 `profile.json` 自标 `"inheritsFrom": "1.13"` ⇒ 它是 **1.13 件**，
 *   不是 1.13.1/1.13.2 件（后两者只有 Chocohead 的 `newerer` / `newerest` 社区分支）。
 *   ⇒ `rift/1.13/` 档用它是**版本对齐**；`rift/1.13.2/` 用它属跨版本实验。
 *
 * ## 落点
 *   rift/<ver>/knowledge/common/verified-api.md
 *
 * ## 用法
 *   node scripts/extract-rift-api-surface.mjs --jar <Rift-1.0.4-106.jar> --version 1.13
 *   node scripts/extract-rift-api-surface.mjs --jar ... --version 1.13 --write
 */

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emit, scratchRemove, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");
const REPO = path.resolve(MCP, "..");

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const opt = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

const JAR = opt("--jar") ? path.resolve(opt("--jar")) : null;
const VERSION = opt("--version") || "1.13";
const OUT = path.resolve(
  opt("--out") || path.join(REPO, "rift", VERSION, "knowledge", "common", "verified-api.md"),
);
const WRITE = wantWrite();
const LIST = has("--list");
const SELFTEST = has("--selftest");
const PRODUCER_REV = "extract-rift-api-surface.mjs@1";
const EXPECT_SHA256 = (opt("--expect-sha256") || "").toLowerCase();
/** 只收这两棵：mod 作者面向的 listener 面 + loader 的初始化面。mixin/hook 是实现，不是 API。 */
const PKG_PREFIXES = ["org.dimdev.rift.listener", "org.dimdev.riftloader.listener"];

function findJdkTool(name) {
  const exe = process.platform === "win32" ? `${name}.exe` : name;
  const cands = [];
  if (process.env.JAVA_HOME) cands.push(path.join(process.env.JAVA_HOME, "bin", exe));
  const jdks = path.join(process.env.USERPROFILE || "", ".gradle", "jdks");
  if (existsSync(jdks)) {
    const major = (n) => Number((n.match(/(?:jdk|adoptium|jbr)[-_]?(\d+)/i) || n.match(/(\d+)/) || [])[1] || 0);
    for (const e of readdirSync(jdks, { withFileTypes: true })
      .filter((x) => x.isDirectory())
      .map((x) => ({ dir: path.join(jdks, x.name), v: major(x.name) }))
      .sort((a, b) => b.v - a.v)) {
      cands.push(path.join(e.dir, "bin", exe));
    }
  }
  for (const c of cands) if (existsSync(c)) return c;
  try {
    const first = execFileSync(process.platform === "win32" ? "where" : "which", [exe], { encoding: "utf8" })
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)[0];
    if (first) return first;
  } catch {
    /* 落到下面抛 */
  }
  throw new Error(`找不到 ${exe}：设 JAVA_HOME 或把 JDK 放到 ~/.gradle/jdks`);
}

function jarClasses(jar) {
  const out = execFileSync(findJdkTool("jar"), ["tf", jar], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((n) => n.endsWith(".class") && !n.includes("$") && !n.endsWith("package-info.class"))
    .map((n) => n.slice(0, -".class".length).replace(/\//g, "."))
    .filter((fq) => PKG_PREFIXES.some((p) => fq === p || fq.startsWith(`${p}.`)))
    .sort();
}

/** 解析 `javap` 输出 → [{fqcn, kind, decl, members}]。 */
function parseJavap(text) {
  const res = [];
  for (const block of text.split(/^Compiled from .*$/m).slice(1)) {
    const lines = block.split(/\r?\n/);
    const i = lines.findIndex((l) => /^\S.*\{$/.test(l));
    if (i < 0) continue;
    const decl = lines[i].replace(/\s*\{$/, "").trim();
    const fqcn = (decl.match(/\b(?:class|interface|enum|@interface)\s+([\w.$]+)/) || [])[1];
    if (!fqcn) continue;
    const kind = /extends java\.lang\.Enum</.test(decl)
      ? "enum"
      : /extends java\.lang\.annotation\.Annotation\b/.test(decl)
        ? "@interface"
        : /\binterface\b/.test(decl)
          ? "interface"
          : "class";
    const members = [];
    for (let k = i + 1; k < lines.length; k++) {
      if (/^\}/.test(lines[k])) break;
      const m = lines[k].match(/^  (.+);$/);
      if (m && !/^static \{\}/.test(m[1]) && /^(public|protected)\b/.test(m[1])) members.push(m[1].trim());
    }
    res.push({ fqcn, kind, decl, members });
  }
  return res;
}

function render(types, meta) {
  const listener = types.filter((t) => t.fqcn.startsWith("org.dimdev.rift.listener"));
  const loader = types.filter((t) => t.fqcn.startsWith("org.dimdev.riftloader.listener"));
  const row = (t) => `| \`${t.fqcn}\` | \`${t.decl}\`<br>${t.members.map((m) => "`" + m + "`").join("<br>")} |`;

  const lines = [
    `# verified-api · rift ${meta.version}（本档 **Rift 侧**的权威签名表）`,
    "",
    `> **性质**：本表由 \`javap\` 对**真构件**跑出（生成器 \`${PRODUCER_REV}\`），**不是 wiki 转述**。`,
    "> **MC 侧不在本表**（本表只收 Rift 侧签名）；参数里的 `net.minecraft.*` 类型名若要使用，须另按该 MC 版本的映射核。",
    "",
    "## 1. 构件（可复现）",
    "",
    "| 项 | 值 |",
    "|---|---|",
    `| 坐标 | \`com.github.DimensionalDevelopment:Rift:${meta.build}\`${meta.classifier ? `，**classifier = \`${meta.classifier}\`**` : "（**plain 件**，非 `-dev`）"} |`,
    `| 文件 | \`${meta.jarName}\` |`,
    `| 大小 / 条目 | ${meta.jarBytes} B / ${meta.entries} entries |`,
    `| sha256 | \`${meta.sha256}\` |`,
    "| 上游仓 | `DimensionalDevelopment/Rift` —— **archived**（最后提交 2019-01-01），**MIT** |",
    `| 复现命令 | \`javap -classpath ${meta.jarName} <FQCN>\`（生成器用的判读器：\`${meta.javapVersion}\`） |`,
    "",
    `**构件的版本自述**：jar 内 \`profile.json\` 的 \`inheritsFrom\` = **\`${meta.profileInheritsFrom ?? "（未读到）"}\`**`,
    `⇒ 该件面向 **MC ${meta.profileInheritsFrom ?? "?"}**。`,
    "",
    `## 2. listener 接口（${listener.length} 个，javap 全量导出）`,
    "",
    "包 `org.dimdev.rift.listener` + 子包 `…listener.client`。签名逐字来自 javap；**参数里的 `net.minecraft.*` 未对 MC 真构件核**。",
    "",
    "| 接口 | 签名 |",
    "|---|---|",
    ...listener.map(row),
    "",
    `## 3. loader 侧（${loader.length} 个）`,
    "",
    "| 类型 | 签名 |",
    "|---|---|",
    ...loader.map(row),
    "",
    "## 4. 本档的边界（别外推）",
    "",
    `- 本表覆盖 \`${PKG_PREFIXES.join("` / `")}\` 下的顶层 public 类型；**mixin / hook / network / util 是实现面，不在此列**。`,
    "- 形参名与注解 `default` 值在构件里取不到（class 文件不带 `MethodParameters`、`javap` 不带 `-v`）。",
    "- 本文件**不是**「可对外输出的已核实名单」：对外结论仍以人工复核过的窄表（同目录 `listeners.md` 的对账节）为准。",
    "",
  ];
  return lines.join("\n");
}

function selftest() {
  const txt = [
    'Compiled from "ClientTickable.java"',
    "public interface org.dimdev.rift.listener.client.ClientTickable {",
    "  public abstract void clientTick();",
    "}",
    'Compiled from "Hidden.java"',
    "class org.dimdev.rift.listener.Hidden {",
    "  public void nope();",
    "}",
    'Compiled from "InitializationListener.java"',
    "public interface org.dimdev.riftloader.listener.InitializationListener {",
    "  public abstract void onInitialization();",
    "}",
  ].join("\n");
  const got = parseJavap(txt);
  const errs = [];
  if (got.length !== 3) errs.push(`应解析 3 个类型，实得 ${got.length}`);
  const ct = got.find((t) => t.fqcn.endsWith("ClientTickable"));
  if (!ct || ct.members[0] !== "public abstract void clientTick()") errs.push("ClientTickable 签名不对");
  const md = render(got, {
    version: "1.13",
    build: "1.0.4-106",
    classifier: "",
    jarName: "x.jar",
    jarBytes: 1,
    entries: 1,
    sha256: "x",
    javapVersion: "21",
    profileInheritsFrom: "1.13",
  });
  if (!md.includes("listener 接口（2 个")) errs.push("计数行不对（Hidden 是包私有，应被排除；loader 侧 1 个）");
  if (errs.length) {
    console.log(`❌ 自证失败\n   ${errs.join("\n   ")}`);
    process.exit(1);
  }
  console.log("✅ 自证 1/1");
  process.exit(0);
}

function main() {
  if (SELFTEST) return selftest();
  if (!JAR) throw new Error("需要 --jar <path>（构件不入库，指到本机留档）");
  if (!existsSync(JAR)) throw new Error(`构件不在：${JAR}`);
  if (OUT.split(/[\\/]/).includes("data")) throw new Error(`拒绝落进 data/：${OUT}（本文件属规则树知识面）`);

  const buf = readFileSync(JAR);
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  if (EXPECT_SHA256 && sha256 !== EXPECT_SHA256) {
    throw new Error(`构件 sha256 不符：实测 ${sha256}，期望 ${EXPECT_SHA256} ⇒ 拒绝`);
  }
  const fqcns = jarClasses(JAR);
  const javapVersion = execFileSync(findJdkTool("javap"), ["-version"], { encoding: "utf8" }).trim().split(/\r?\n/)[0];
  const text = execFileSync(findJdkTool("javap"), ["-classpath", JAR, ...fqcns], {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
  const types = parseJavap(text);

  // 把 profile.json 解到**系统临时目录**读（不落仓库、不碰构件所在目录的同名文件）
  let profileInheritsFrom = null;
  try {
    const scratch = mkdtempSync(path.join(tmpdir(), "rift-profile-"));
    execFileSync(findJdkTool("jar"), ["xf", JAR, "profile.json"], { cwd: scratch, encoding: "utf8" });
    const p = path.join(scratch, "profile.json");
    if (existsSync(p)) profileInheritsFrom = JSON.parse(readFileSync(p, "utf8")).inheritsFrom ?? null;
    scratchRemove(scratch); // 仓库外临时目录，走守卫的 scratch 出口
  } catch {
    /* 读不到就留空，产物里如实写「未读到」 */
  }

  const nameParts = path.basename(JAR).match(/Rift-([\d.]+(?:-\d+)?)(-dev)?\.jar/i);
  const meta = {
    version: VERSION,
    build: nameParts ? nameParts[1] : "unknown",
    classifier: nameParts && nameParts[2] ? "dev" : "",
    jarName: path.basename(JAR),
    jarBytes: buf.length,
    entries: execFileSync(findJdkTool("jar"), ["tf", JAR], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean).length,
    sha256,
    javapVersion,
    profileInheritsFrom,
  };

  console.log(`构件    : ${meta.jarName} (sha256 ${sha256.slice(0, 16)}…)`);
  console.log(`自述版本: profile.json inheritsFrom = ${profileInheritsFrom ?? "（未读到）"}`);
  console.log(`类面    : ${fqcns.length} 个候选 → ${types.length} 个已解析`);
  console.log(`落点    : ${OUT}`);

  if (LIST) {
    for (const t of types) console.log(`  ${t.kind.padEnd(9)} ${t.fqcn}  (${t.members.length})`);
    return;
  }
  if (!types.length) throw new Error("抽到 0 个类型 —— 包前缀或构件不对，拒绝写盘");

  if (!WRITE) {
    console.log("\n（dry-run：未写任何文件；加 --write 落盘）");
    console.log(render(types, meta).split("\n").slice(0, 18).join("\n"));
    return;
  }
  emit(OUT, render(types, meta));
  console.log(`\n✅ ${types.length} 个类型 → ${OUT}`);
}

main();
