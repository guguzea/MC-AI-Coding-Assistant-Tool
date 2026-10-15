#!/usr/bin/env node
/**
 * assert-playtest-server-driver-compiles —— `generate_playtest_server_driver` 生成物的**真构件编译腿**。
 *
 * ## 这一腿补的是哪一格
 * 生成器此前只到「**结构壳**」（文本形状对、未编译）。本门拿**真 paper-api 构件件**对它做一次真
 * `javac`，把证据抬到「**真构件编译验证**」（本仓验证强度三等的第二等；第一等是真机跑通）。
 *
 * ## 依赖是**机器本地资产**（⇒ 与既有编译腿同范式）
 * - `paper-api` jar：`F:\MOD_TEST\paper-cache\paper-api-<ver>.jar`，或 `$MC_SKILL_CACHE/paper-api/`
 *   取法（**已实测可解**）：`https://repo.papermc.io/repository/maven-public/io/papermc/paper/paper-api/<ver>/paper-api-<ver>.jar`
 *   版本串**已实证**：Javadoc 站的 `asOfVersion`（`26.3.build.178-stable`）**就是** maven 版本列表里的
 *   真实条目（`26.3.build.175-stable` … `190-stable` 连续段）—— 上一轮误判成"形状不同"是错的，
 *   那是被 `<latest>` = `26.3-pre-2.build.0-alpha`（预发布、排在列表最末）带偏。
 * - JDK 21+：Paper 26.3 线要的 JDK；本机候选 `G:\graalvm-jdk-21*` / `G:\JAVA17*`。
 *   ⚠ 本门**不代下**任何构件件（与既有编译腿同纪律）。
 *
 * ⇒ 缺件时**默认降级并吼**（CI / 别的机器上必然缺），`--require` 走 fail-closed（缺件 rc=2）。
 *   **降级的那个 0 不是通过**。
 *
 * 退出码：0 = 编译通过（或本机缺件而降级）；1 = 编译失败；2 = 缺件且带 `--require`。
 */
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MCP = resolve(HERE, "..");
const REPO = resolve(MCP, "..");
const REQUIRE = process.argv.includes("--require");
const CACHE = process.env.MC_SKILL_CACHE || join(process.env.TEMP || "/tmp", "mc-skill-cache");

const PAPER_API_VERSION = "26.3.build.178-stable";

/**
 * 找 classpath 构件件。
 *
 * ⚠ **不能只要 `paper-api.jar`**（2026-10-15 实测）：Paper 侧 `CommandSender` 继承 Adventure 的
 * `net.kyori.adventure.audience.Audience`，只放 api 一件时 javac 报
 *   `class file for net.kyori.adventure.key.Namespaced not found`
 * ⇒ 同目录下的 `adventure-*.jar` 必须一并入 classpath（这正是"真构件编译"能抓到、而结构壳抓不到的那类缺口）。
 */
function findClasspathJars() {
  const dirs = [
    "F:\\MOD_TEST\\paper-cache",
    join(CACHE, "paper-api"),
    join(REPO, "temp", "paper-cache"),
  ];
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    const all = readdirSync(d);
    const api =
      all.find((f) => f === `paper-api-${PAPER_API_VERSION}.jar`) ?? all.find((f) => /^paper-api-.*\.jar$/.test(f));
    if (!api) continue;
    const adv = all.filter((f) => /^adventure-.*\.jar$/.test(f)).sort();
    return { dir: d, jars: [join(d, api), ...adv.map((f) => join(d, f))], adv };
  }
  return null;
}

function findJavac() {
  const roots = ["G:\\", "C:\\Program Files\\Java", "C:\\Program Files\\Eclipse Adoptium"];
  const out = [];
  const probe = (dir, depth) => {
    if (depth > 4 || !existsSync(dir)) return;
    let ents;
    try {
      ents = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    if (ents.some((e) => e.isFile() && e.name.toLowerCase() === "javac.exe")) {
      out.push(join(dir, "javac.exe"));
      return;
    }
    for (const e of ents) {
      if (e.isDirectory()) probe(join(dir, e.name), depth + 1);
    }
  };
  for (const r of roots) probe(r, 0);
  return out;
}

function javacMajor(javac) {
  try {
    const r = execFileSync(javac, ["-version"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    const m = String(r).match(/(\d+)/);
    return m ? Number(m[1]) : 0;
  } catch {
    return 0;
  }
}

/**
 * **实测钉死的 JDK 底线 = 25**（不是猜的）：
 * 用 JDK 21 编这只 jar 时 javac 报
 *   `bad class file: …/org/bukkit/Bukkit.class  class file has wrong version 69.0, should be 65.0`
 * class file version 69 = Java 25（Java N ⇒ 44+N）⇒ Paper API 26.3 线**要求 JDK 25**。
 * 这一条也**更正**了 `paper-plugin.ts` 里 `javaToolchain` 默认 `21` 的占位（那是未核实值，实测为错）。
 */
const REQUIRED_JDK = 25;

const cp = findClasspathJars();
const jar = cp?.jars[0] ?? null; // 仅用于"有没有件"的存在性判断与日志
const cpArg = cp ? cp.jars.join(delimiter) : "";
const allJavacs = findJavac()
  .map((j) => ({ path: j, major: javacMajor(j) }))
  .sort((a, b) => b.major - a.major);
const javacs = allJavacs.filter((j) => j.major >= REQUIRED_JDK);

if (!jar || javacs.length === 0) {
  const miss = [
    !jar ? `paper-api jar（${PAPER_API_VERSION}）` : null,
    javacs.length === 0
      ? `JDK ${REQUIRED_JDK}+ 的 javac（本机找到 ${allJavacs.length} 个，最高 major ${allJavacs[0]?.major ?? "-"}）`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
  if (REQUIRE) {
    console.log(`❌ --require：缺 ${miss}`);
    process.exit(2);
  }
  console.log(`⚠ 缺 ${miss} ⇒ 本次**未验证**，不是通过；强口径请加 --require`);
  process.exit(0);
}
console.log(`classpath = ${cp.jars.length} 件（paper-api 1 + adventure ${cp.adv.length}）from ${cp.dir}`);
console.log(`  ${cp.jars.map((j) => j.split(/[\\/]/).pop()).join("\n  ")}`);
console.log(
  `javac = ${javacs[0].path}（major ${javacs[0].major} ≥ 底线 ${REQUIRED_JDK}；本机候选 ${allJavacs.length} 个：${allJavacs.map((j) => j.major).join("/")}）`,
);

// ── 生成 → 写临时目录 → javac ────────────────────────────────────────────────
const work = join(CACHE, "paper-server-driver-compile");
rmSync(work, { recursive: true, force: true });
mkdirSync(join(work, "src"), { recursive: true });
mkdirSync(join(work, "out"), { recursive: true });

const raw = execFileSync(
  "node",
  [
    join(MCP, "dist", "cli.js"),
    "generate_playtest_server_driver",
    "--evidenceDir",
    join(work, "evidence"),
    "--json",
  ],
  { cwd: MCP, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, MC_SKILL_DATA: process.env.MC_SKILL_DATA ?? join(REPO, "data") } },
);
const res = JSON.parse(raw.slice(raw.indexOf("{"))).result ?? {};
const files = res.files ?? {};
const javaRel = Object.keys(files).find((k) => k.endsWith(".java"));
if (!javaRel) {
  console.log("❌ 生成物里没有 .java —— 生成器坏了（本门是活的）");
  process.exit(1);
}
const javaAbs = join(work, "src", javaRel);
mkdirSync(dirname(javaAbs), { recursive: true });
writeFileSync(javaAbs, files[javaRel], "utf8");
console.log(`生成物 = ${javaRel}（${files[javaRel].split("\n").length} 行）`);

try {
  // -J-Duser.language=en：中文 locale 下 javac 用「错误:」前缀，按词过滤会漏（既有编译腿踩过）
  execFileSync(
    javacs[0].path,
    [
      "-J-Duser.language=en",
      "-J-Duser.country=US",
      "-encoding",
      "UTF-8",
      "-nowarn",
      "-cp",
      cpArg,
      "-d",
      join(work, "out"),
      javaAbs,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
} catch (e) {
  console.log("❌ 真构件编译失败（本门是活的）：");
  const out = (String(e.stdout || "") + String(e.stderr || ""))
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12);
  out.forEach((l) => console.log("      " + l));
  process.exit(1);
}

const classCount = (function walk(d, acc = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(e.name);
  }
  return acc;
})(join(work, "out"));
console.log(`✅ 对真构件 ${PAPER_API_VERSION} 编译通过 · 产出 ${classCount.length} 个 class：${classCount.join(", ")}`);
console.log("证据等级：本门把 generate_playtest_server_driver 的产物从「结构壳」抬到「真构件编译验证」。");
process.exit(0);
