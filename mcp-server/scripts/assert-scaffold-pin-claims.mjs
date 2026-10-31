#!/usr/bin/env node
/**
 * Gate：版本档自述里的「钉值声明」必须等于该档 `scaffold/gradle.properties` 的实钉值。
 *
 * 立门缘由（2026-10-30 R2 审计）：2026-09 一轮里同一类缺陷反复出现 —— 规则/Skill 正文写着
 * `loader_version=0.19.3` / `loom_version=1.0.18`，而 scaffold 早已升到 0.19.5 / 1.4-SNAPSHOT；
 * agent 逐字抄正文 ⇒ 生成工程用过期钉值构建失败。当时靠人工 grep 逐条改，没有门看住。
 *
 * 判据：
 *  · **真值源 = 该档 `scaffold/gradle.properties`**（唯一；本文档集不自称钉值）。
 *  · 扫描面 = 该档的 `.cursor/rules/00-project-setup.mdc`、`AGENTS.md`、`.cursor/skills/**`、`.cursor/agent/**`
 *    （7 个 IDE 投影目录不扫：一致性归 `assert-skill-mirrors`；`knowledge/**` 也不扫 ——
 *    那里的 `version-changes/*` 与 `antipatterns/*` 天然会引用**别的版本**的钉值当例子，
 *    拿来当「本档声明」判必假红，2026-10-30 实测 69 条命中里 67 条属这一类）。
 *  · 只比 **scaffold 里真有的键**（`forge_version` / `loader_version` / `mapping_version` / `yarn_mappings` …）；
 *    `loader_version_range`、`forge_version_range` 这类区间键不参与。
 *  · **只咬肯定句**：命中行带「不要 / 禁止 / 旧写法 / 照抄 / 残留 / 备选 / 曾 / 示例」或行首 `>` 的一律跳过
 *    （那些是反例与引用，写别的版本的钉值是**正确**行为）。
 *
 * 假绿防护：
 *  ① 声明总数地板（`:FLOOR_CLAIMS`）—— 扫描面塌缩 / 正则被改瞎时当场红；
 *  ② `--selftest` 三臂（干净必绿 / 错值必红且红在该键上 / 反例行跳过）；
 *  ③ 每个档必须有 scaffold；有 scaffold 却连一个文件都没扫到也算红（路径改名会静默零覆盖）。
 *
 * 用法：
 *   node scripts/assert-scaffold-pin-claims.mjs
 *   node scripts/assert-scaffold-pin-claims.mjs --root=<假根>
 *   node scripts/assert-scaffold-pin-claims.mjs --selftest
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { spawnSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SELFTEST = process.argv.includes("--selftest");
const rootArg = process.argv.find((a) => a.startsWith("--root="));
const ROOT = path.resolve(rootArg ? rootArg.slice("--root=".length) : path.join(HERE, "..", ".."));

/** 参与比对的键（值必须与 scaffold 逐字相等）。区间键（`*_range`）刻意不在册。 */
const PIN_KEYS = [
  "loom_version",
  "loader_version",
  "minecraft_version",
  "yarn_mappings",
  "fabric_api_version",
  "fabric_version",
  "neo_version",
  "forge_version",
  "mappings_channel",
  "mapping_version",
];
const CLAIM_RE = new RegExp(`\\b(${PIN_KEYS.join("|")})\\s*=\\s*["']?([0-9][0-9A-Za-z._+\\-]*)`, "g");
/**
 * 第二形态：build.gradle 片段 `id 'fabric-loom' version '1.4-SNAPSHOT'`。
 *
 * 为什么要加（2026-10-31 R2 复审）：本门首版只认 `key=value`，而**规则树 00-project-setup 教
 * 构建脚本时用的是 Groovy 片段形** —— 2026-10-30 修掉的真实缺陷 `fabric/1.18.2/.../00-project-setup.mdc:108`
 * 原文是 `id 'fabric-loom' version '1.0.18'`，首版门对它 **miss**（实测：同一行 OLD_RE 不命中、
 * 本正则命中）。真树上两形态**零重叠**（OLD only 87 行 / 片段形 only 10 行 / 交集 0），
 * 所以漏掉的不是边角，是整整一类。
 *
 * 真值源不是 gradle.properties 的键（loom 版本多数档只在 build.gradle 里，properties 里没有
 * `loom_version` 键），而是**该档 scaffold/build.gradle 实钉**（支持 `"${loom_version}"` 变量引用，
 * 按 properties 解引用）。
 */
const SCRIPT_CLAIM_RE =
  /id\s+['"]([\w.\-]*loom[\w.\-]*)['"]\s+version\s+['"]([0-9][0-9A-Za-z._+\-]*)['"]/g;
const SCRIPT_VAR_RE =
  /id\s+['"]([\w.\-]*loom[\w.\-]*)['"]\s+version\s+"\$\{(\w+)\}"/;
/** 否定 / 引用 / 历史行：这些不是「本档声明」，写别的版本是对的。 */
const NOT_A_CLAIM = /不要|禁止|不得|旧写法|旧文档|照抄|残留|备选|另一条|曾|历史|示例|例如|如\s*`|e\.g\.|^\s*>/;
/** 声明总数地板（实测值以本门 ok 行与 §S4 类汇总为准；下界，非等式）。 */
const FLOOR_CLAIMS = 40;
const PLATFORMS = ["fabric", "forge", "neoforge", "quilt"];

function readProps(file) {
  const map = new Map();
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^\s*#/.test(line) || !line.includes("=")) continue;
    const i = line.indexOf("=");
    map.set(line.slice(0, i).trim(), line.slice(i + 1).trim());
  }
  return map;
}

/**
 * 该档 scaffold/build.gradle 里 loom 插件的**实钉值**（真值源）。
 * 支持 `id 'fabric-loom' version '1.4-SNAPSHOT'` 与 `id '…loom-remap' version "${loom_version}"`
 * （变量按同档 gradle.properties 解引用）。读不出就返回 null —— 调用方会判红，不静默放过。
 */
function readScaffoldLoom(buildGradle, props) {
  if (!fs.existsSync(buildGradle)) return null;
  const t = fs.readFileSync(buildGradle, "utf8");
  const lit = SCRIPT_CLAIM_RE.exec(t);
  SCRIPT_CLAIM_RE.lastIndex = 0;
  if (lit) return lit[2];
  const v = SCRIPT_VAR_RE.exec(t);
  if (v) return props.get(v[2]) ?? null;
  return null;
}

function tierFiles(dir) {
  const out = [];
  const add = (p) => fs.existsSync(p) && out.push(p);
  add(path.join(dir, ".cursor", "rules", "00-project-setup.mdc"));
  add(path.join(dir, "AGENTS.md"));
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(mdc|md)$/.test(e.name)) out.push(p);
    }
  };
  for (const sub of [".cursor/skills", ".cursor/agent"]) {
    const d = path.join(dir, sub);
    if (fs.existsSync(d)) walk(d);
  }
  return out;
}

function scan(root) {
  const failures = [];
  const stats = { tiers: 0, faces: 0, claims: 0, skipped: 0 };
  for (const pl of PLATFORMS) {
    const base = path.join(root, pl);
    if (!fs.existsSync(base)) continue;
    for (const v of fs.readdirSync(base)) {
      const dir = path.join(base, v);
      if (!fs.statSync(dir).isDirectory()) continue;
      const propsPath = path.join(dir, "scaffold", "gradle.properties");
      if (!fs.existsSync(propsPath)) continue;
      stats.tiers += 1;
      const props = readProps(propsPath);
      const realLoom = readScaffoldLoom(path.join(dir, "scaffold", "build.gradle"), props);
      const files = tierFiles(dir);
      stats.faces += files.length;
      if (!files.length) {
        failures.push(`${pl}/${v}: 有 scaffold/gradle.properties，但扫描面一个文件都没找到（00-project-setup / AGENTS.md / .cursor/skills）—— 路径改名会让本门静默零覆盖`);
        continue;
      }
      for (const f of files) {
        const rel = path.relative(root, f).split(path.sep).join("/");
        const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
        lines.forEach((line, i) => {
          CLAIM_RE.lastIndex = 0;
          let m;
          while ((m = CLAIM_RE.exec(line))) {
            const [, key, claimed] = m;
            const actual = props.get(key);
            if (actual === undefined) continue; // scaffold 不钉这个键 ⇒ 无从比对
            if (actual === claimed) {
              stats.claims += 1;
              continue;
            }
            if (NOT_A_CLAIM.test(line)) {
              stats.skipped += 1;
              continue;
            }
            stats.claims += 1;
            failures.push(`${rel}:${i + 1}: 声称 ${key}=${claimed}，本档 scaffold 实钉 ${actual}（照抄会生成过期工程）`);
          }
          // 第二形态：build.gradle 片段的 loom 钉值（真值 = 该档 scaffold/build.gradle）
          SCRIPT_CLAIM_RE.lastIndex = 0;
          let s;
          while ((s = SCRIPT_CLAIM_RE.exec(line))) {
            const [, plugin, claimed] = s;
            if (realLoom === null) {
              stats.claims += 1;
              failures.push(
                `${rel}:${i + 1}: 声称 ${plugin} version '${claimed}'，但本档 scaffold/build.gradle 里读不出 loom 钉值（真值源缺失，无法核对）`,
              );
              continue;
            }
            if (realLoom === claimed) {
              stats.claims += 1;
              continue;
            }
            if (NOT_A_CLAIM.test(line)) {
              stats.skipped += 1;
              continue;
            }
            stats.claims += 1;
            failures.push(
              `${rel}:${i + 1}: 声称 ${plugin} version '${claimed}'，本档 scaffold/build.gradle 实钉 '${realLoom}'（照抄会生成过期工程）`,
            );
          }
        });
      }
    }
  }
  if (stats.tiers === 0) failures.push(`${path.relative(process.cwd(), root) || "."}: 一个带 scaffold/gradle.properties 的档都没扫到 —— 检查换根路径`);
  if (stats.claims < FLOOR_CLAIMS) {
    failures.push(`声明只认到 ${stats.claims} 处（地板 ${FLOOR_CLAIMS}）—— 扫描面塌缩或正则被改瞎，不予放行`);
  }
  return { failures, stats };
}

if (SELFTEST) {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = fs;
  const tmpdir = (await import("node:os")).tmpdir;
  const SELF = url.fileURLToPath(import.meta.url);
  const SC = "forge/9.9.9/scaffold/";
  const TIER = "forge/9.9.9/";
  const PROPS = "minecraft_version=9.9.9\nforge_version=9.9.9.1\nmapping_channel=official\nmapping_version=9.9.9\n";
  const OK_00 = "# 版本号管理\n\n```properties\nminecraft_version=9.9.9\nforge_version=9.9.9.1\nmapping_version=9.9.9\n```\n";
  // ── 第二形态夹具：build.gradle 片段（真值源 = scaffold/build.gradle，不是 properties 键）──
  const SC_BG = "forge/9.9.9/scaffold/build.gradle";
  const BG_PROPS = "minecraft_version=9.9.9\nmapping_channel=official\nmapping_version=9.9.9\n";
  const BG_LIT = "plugins {\n    id 'fabric-loom' version '1.4-SNAPSHOT'\n}\n";
  const BG_00 = "# 构建\n\n```groovy\nplugins {\n    id 'fabric-loom' version '1.4-SNAPSHOT'\n}\n```\n";
  const BG_VAR_PROPS = "loom_version=1.17-SNAPSHOT\nminecraft_version=9.9.9\n";
  const BG_VAR_SC = "plugins {\n    id 'net.fabricmc.fabric-loom-remap' version \"\${loom_version}\"\n}\n";
  const BG_VAR_00 = "# 构建\n\n```groovy\nplugins {\n    id 'net.fabricmc.fabric-loom-remap' version '1.17-SNAPSHOT'\n}\n```\n";
  const cases = [
    // 地板在假根里达不到 ⇒ 用 --root 模式单独关掉地板（selftest 只证判据咬不咬得住）
    ["干净对照", { [SC + "gradle.properties"]: PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: OK_00 }, 0, "0 处漂移|ok"],
    ["错值必红", { [SC + "gradle.properties"]: PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: OK_00.replace("forge_version=9.9.9.1", "forge_version=8.8.8.8") }, 1, "forge_version=8.8.8.8"],
    ["反例行跳过", { [SC + "gradle.properties"]: PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: OK_00 + "\n- **不要**照抄旧写法 `forge_version=1.2.3`\n" }, 0, "0 处漂移|ok"],
    // —— 第二形态：build.gradle 片段（首版门对它 miss；2026-10-31 补，见 SCRIPT_CLAIM_RE 注释）——
    ["片段形·干净对照", { [SC_BG]: BG_LIT, [SC + "gradle.properties"]: BG_PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: BG_00 }, 0, "0 处漂移|ok"],
    [
      "片段形·错值必红（真缺陷复现：fabric/1.18.2 曾写 1.0.18）",
      { [SC_BG]: BG_LIT, [SC + "gradle.properties"]: BG_PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: BG_00.replace("version '1.4-SNAPSHOT'", "version '1.0.18'") },
      1,
      "version '1\\.0\\.18'",
    ],
    [
      "片段形·变量解引用（scaffold 用 \${loom_version}，正文写实值）",
      { [SC_BG]: BG_VAR_SC, [SC + "gradle.properties"]: BG_VAR_PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: BG_VAR_00 },
      0,
      "0 处漂移|ok",
    ],
    [
      "片段形·变量解引用后不匹配必红",
      { [SC_BG]: BG_VAR_SC, [SC + "gradle.properties"]: BG_VAR_PROPS, [TIER + ".cursor/rules/00-project-setup.mdc"]: BG_VAR_00.replace("'1.17-SNAPSHOT'", "'1.16-SNAPSHOT'") },
      1,
      "1\\.17-SNAPSHOT",
    ],
  ];
  let fails = 0;
  for (const [label, files, wantRc, marker] of cases) {
    const root = mkdtempSync(path.join(tmpdir(), "scaffold-pin-selftest-"));
    try {
      for (const [rel, body] of Object.entries(files)) {
        const abs = path.join(root, rel.split("/").join(path.sep));
        mkdirSync(path.dirname(abs), { recursive: true });
        writeFileSync(abs, body, "utf8");
      }
      const r = spawnSync(process.execPath, [SELF, `--root=${root}`, "--no-floor"], {
        encoding: "utf8",
        windowsHide: true,
        env: { ...process.env },
      });
      const out = `${r.stdout || ""}${r.stderr || ""}`;
      if (r.status !== wantRc || !new RegExp(marker).test(out)) {
        fails += 1;
        console.error(`  ✗ 「${label}」期望 rc=${wantRc} 且输出含 /${marker}/，实得 rc=${r.status}`);
        for (const l of out.split(/\r?\n/).filter(Boolean).slice(0, 4)) console.error(`    ${l}`);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
  console.log(fails ? `selftest FAILED（${fails}/${cases.length}）` : `selftest OK（${cases.length}/${cases.length}：1 正控 + 2 投毒，分母现数）`);
  process.exit(fails ? 1 : 0);
}

const noFloor = process.argv.includes("--no-floor");
const { failures, stats } = scan(ROOT);
const relevant = noFloor ? failures.filter((f) => !/声明只认到/.test(f)) : failures;
if (relevant.length) {
  console.error(`assert-scaffold-pin-claims: ${relevant.length} 处钉值声明与 scaffold 实钉不符（${stats.tiers} 档 / ${stats.faces} 个文件 / ${stats.claims} 处声明${noFloor ? " / 地板已关" : ""}）`);
  for (const f of relevant.slice(0, 40)) console.error(`  - ${f}`);
  if (relevant.length > 40) console.error(`  …另 ${relevant.length - 40} 处`);
  process.exit(1);
}
console.log(
  `assert-scaffold-pin-claims: ok（${stats.tiers} 档 / ${stats.faces} 个文件 / ${stats.claims} 处钉值声明与 scaffold 现算一致；反例/引用行跳过 ${stats.skipped} 处）`,
);
