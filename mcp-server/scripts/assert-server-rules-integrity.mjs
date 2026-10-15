#!/usr/bin/env node
/**
 * assert-server-rules-integrity —— **服务端面规则载体**（`paper/<ver>/rules/**`）的出处门。
 *
 * ## 为什么需要它（不是"为了对称"）
 * 本仓现有规则面门**扫不到这一面**（2026-10-15 实测）：
 *   - `assert-rules-api-names.mjs:174` 只收 **`.mdc`**（`filter((x) => /\.mdc$/.test(x))`），
 *     而本面用 `.md`；
 *   - `assert-rules-match-tool.mjs` 是 **quilt 专属**（自印「90 个 quilt 源文件 / 10 档 quilt」）。
 * ⇒ 本面 11 个文件的「出处纪律」此前**无人守护**（改错一个 `文件:行` 不会有任何门报警）。
 *
 * ## 判据（四正一毒，全部机械可检）
 * ① **出处可解析**：每个 `<name>.md:<line>` 的 `<name>` 必须能在三个语料面里找到同名文件
 *    —— 解析不到 = 编造嫌疑（**这是本门存在的首要理由**）。
 * ② **行号在界内**：`1 ≤ start ≤ end ≤ 文件行数`。
 * ③ **不是空行**：被引的每一行都要有内容（指向空气行 = 出处失效）。
 * ④ **每篇必须有「未核实」段**：本面的写作纪律是"语料证不出的明写未核实"；
 *    缺这一段说明作者没做区分，**判红**（不是风格问题，是可追溯性问题）。
 *
 * ## 缺件降级（照本仓既定范式）
 * 语料面是**可选数据包**（`data/` 不进 git）⇒ 缺面默认**降级并吼**、`--require` fail-closed（rc=2）。
 * **降级的那个 0 不是通过。**
 *
 * 退出码：0 = 通过（或缺件降级）；1 = 有判据不达标；2 = 缺件且带 `--require`。
 */
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const DATA = process.env.MC_SKILL_DATA ? resolve(process.env.MC_SKILL_DATA) : join(REPO, "data");

/** 规则载体的扫描面（服务端面）。目录不存在即视为缺面。 */
export const RULES_GLOB_ROOT = join(REPO, "paper");
/** 三个语料面（都是**扁平** processed，故按 basename 解析即可）。 */
export const CORPUS_FACES = [
  "spigot_stable/spigot-javadoc/stable/processed",
  "paper-api_stable/paper-javadoc/stable/processed",
  "paper_stable/paper-docs/stable/processed",
];
/**
 * 出处引用的文法是 `<name>.md:<start>` 或 `<name>.md:<start>-<end>`。
 *
 * ⚠ 文件名类**必须含 `-`**：教程面（PaperMC 官方文档）的页名大量带连字符
 * （`api__plugin-configs.md` / `getting-started__plugin-yml.md` / `api__event-api__event-listeners.md`）。
 * 首版写成 `[A-Za-z0-9_]+` ⇒ 这些名字被**截断成尾部**（`configs.md` / `yml.md` / `listeners.md`）
 * 而误报"解析不到"（2026-10-15 实测）。
 */
export const CITE_RE = /([A-Za-z0-9_-]+\.md):(\d+)(?:-(\d+))?/g;
/**
 * 每篇必须有的「未核实」**小节**（写作纪律的可检形式）。
 *
 * ⚠ **首版判据只测词是否出现过**（`/未核实/`）—— 太弱：一句话顺带提一次也能过
 * （2026-10-15 用户指出后改）。现要求**真标题**（`^#{1,4} … 未核实`）+ **标题下至少一条**。
 */
export const UNVERIFIED_HEADING_RE = /^#{1,4}\s*.*未核实/m;

/** 收集规则文件（`paper/<ver>/rules/*.md`）。返回 [{file, abs}]。 */
export function collectRuleFiles(root = RULES_GLOB_ROOT) {
  const out = [];
  if (!existsSync(root)) return out;
  for (const ver of readdirSync(root, { withFileTypes: true })) {
    if (!ver.isDirectory()) continue;
    const rulesDir = join(root, ver.name, "rules");
    if (!existsSync(rulesDir)) continue;
    for (const f of readdirSync(rulesDir, { withFileTypes: true })) {
      if (f.isFile() && f.name.endsWith(".md")) out.push({ file: `paper/${ver.name}/rules/${f.name}`, abs: join(rulesDir, f.name) });
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

/**
 * 建语料条目表（三个面合并）。
 *
 * ⚠ **为什么不能只做 basename→路径 的一对一映射**（首版实测踩到）：
 *  - 规则里写的是**短名**（`PluginManager.md:24`）以便阅读，而语料文件名是**完整扁平化**
 *    （`org_bukkit_plugin_PluginManager.md`）⇒ 必须支持**后缀解析**；
 *  - 且 `org_bukkit_*` 在 `spigot_stable` 与 `paper-api_stable` **两个面里都有**（实测跨面重名 1350 个），
 *    同名类在两面的**成员集与行号可能不同** ⇒ 必须保留**多候选**，而不是"先出现的面胜出"。
 */
export function buildCorpusIndex(dataRoot = DATA) {
  const entries = [];
  for (const face of CORPUS_FACES) {
    const dir = join(dataRoot, face);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith(".md")) continue;
      entries.push({ base: f.name, abs: join(dir, f.name), face });
    }
  }
  return { entries };
}

/**
 * 解析一处出处引用 → 候选列表。
 * 规则：**精确名优先**；无精确则按**后缀**匹配（`PluginManager.md` ⇒ `…_PluginManager.md`）。
 */
export function resolveCite(name, corpus) {
  const exact = corpus.entries.filter((e) => e.base === name);
  if (exact.length) return exact;
  return corpus.entries.filter((e) => e.base.endsWith(`_${name}`));
}

/**
 * 判一篇规则文件的四条件。
 * @returns {string[]} problems（空数组 = 通过）
 */
export function judgeRuleFile({ file, abs }, corpus) {
  const problems = [];
  const text = readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);

  // ④ 未核实小节：**真标题 + 至少一条**；行文里提到该词**不算**
  if (!UNVERIFIED_HEADING_RE.test(text)) {
    problems.push(
      `${file}: 缺「未核实」**标题** —— 行文里提到该词不算；本面要求 \`## 未核实\` 形态的真小节，否则无法区分已核实与未核实`,
    );
  } else {
    const hi = lines.findIndex((l) => UNVERIFIED_HEADING_RE.test(l));
    const level = (lines[hi].match(/^#+/) || [""])[0].length;
    let bullets = 0;
    for (let i = hi + 1; i < lines.length; i++) {
      if (/^#{1,4}\s/.test(lines[i]) && (lines[i].match(/^#+/) || [""])[0].length <= level) break;
      if (/^\s*[-*]\s+\S/.test(lines[i])) bullets++;
    }
    if (bullets === 0) {
      problems.push(`${file}: 「未核实」标题下**一条都没有**（空段等于没写 —— 语料证不出的必须逐条列出）`);
    }
  }

  // ①②③ 出处
  const seen = new Set();
  for (const m of text.matchAll(CITE_RE)) {
    const [, name, sStr, eStr] = m;
    const key = `${name}:${sStr}${eStr ? "-" + eStr : ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const start = Number(sStr);
    const end = eStr ? Number(eStr) : start;

    const cands = resolveCite(name, corpus);
    if (cands.length === 0) {
      problems.push(`${file}: 出处 \`${key}\` 解析不到 —— 三个语料面里都没有 ${name} 或其后缀（编造嫌疑）`);
      continue;
    }
    // 多候选：**至少一个面里该行号成立且非空**即算过（同名类在两面里成员集可能不同）；
    // 全部候选都不成立才判红，并把每个候选的实测行数打进理由（可自查）。
    const detail = [];
    let ok = false;
    for (const c of cands) {
      const tl = readFileSync(c.abs, "utf8").split(/\r?\n/);
      const total = tl.length;
      if (start < 1 || end < start || end > total) {
        detail.push(`${c.face}:${total}行(越界)`);
        continue;
      }
      const blanks = [];
      for (let n = start; n <= end; n++) if (!String(tl[n - 1] ?? "").trim()) blanks.push(n);
      if (blanks.length) {
        detail.push(`${c.face}:空行${blanks.join(",")}`);
        continue;
      }
      ok = true;
      break;
    }
    if (!ok) {
      problems.push(`${file}: 出处 \`${key}\` 在任何候选面里都不成立 —— ${cands.length} 个候选：${detail.join(" / ")}`);
    }
  }
  return problems;
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
const REQUIRE = process.argv.includes("--require");
const SELFTEST = process.argv.includes("--selftest");

if (SELFTEST) {
  // 纯内存投毒：造一棵假规则树 + 假语料面，验四条判据各自能红、干净能绿。
  const tmp = mkdtempSync(join(tmpdir(), "server-rules-"));
  try {
    const dataRoot = join(tmp, "data");
    const face = join(dataRoot, CORPUS_FACES[0]);
    mkdirSync(face, { recursive: true });
    // 假语料：真文件，10 行，第 5 行是签名、第 6 行是空行
    writeFileSync(
      join(face, "FakeClass.md"),
      Array.from({ length: 10 }, (_, i) => (i === 4 ? "- `void ok()`" : i === 5 ? "" : `line ${i + 1}`)).join("\n"),
      "utf8",
    );
    const rulesDir = join(tmp, "paper", "26.3", "rules");
    mkdirSync(rulesDir, { recursive: true });
    // ⚠ 夹具的「未核实」段必须写**真条目**（`- 文字`）：首版夹具只放一个孤立 `-`，
    //    判据升级为"标题下至少一条"后它自己成了空段 ⇒ 连"干净应绿"都红了。
    //    **是夹具过时，不是门失效** —— 与"投毒夹具没跟上扁平化"同一类教训。
    const OK_SECTION = "\n\n## 未核实\n- 某某项本档未核\n";
    const cases = [
      ["01-ok.md", `# x\n出处 FakeClass.md:5${OK_SECTION}`, 0, "干净应绿"],
      ["02-ghost-file.md", `# x\n出处 NoSuchClass.md:1${OK_SECTION}`, 1, "引到不存在的文件应红"],
      ["03-out-of-range.md", `# x\n出处 FakeClass.md:99${OK_SECTION}`, 1, "行号越界应红"],
      ["04-blank-line.md", `# x\n出处 FakeClass.md:6${OK_SECTION}`, 1, "指向空行应红"],
      ["05-no-unverified.md", "# x\n出处 FakeClass.md:5\n", 1, "完全无未核实应红"],
      // 2026-10-15 用户指出判据太弱后补的两例：词在但无标题 / 有标题但空段
      ["06-word-only.md", "# x\n出处 FakeClass.md:5\n\n本档某处未核实。\n", 1, "只在行文里提该词（无标题）应红"],
      ["07-empty-section.md", "# x\n出处 FakeClass.md:5\n\n## 未核实\n\n", 1, "有「未核实」标题但一条都没有应红"],
    ];
    let bad = 0;
    let poisons = 0;
    let cleans = 0;
    const corpus = buildCorpusIndex(dataRoot);
    for (const [name, body, wantProblems, desc] of cases) {
      const abs = join(rulesDir, name);
      writeFileSync(abs, body, "utf8");
      const got = judgeRuleFile({ file: `paper/26.3/rules/${name}`, abs }, corpus).length;
      const ok = wantProblems === 0 ? got === 0 : got > 0;
      if (!ok) bad++;
      if (wantProblems === 0) cleans++;
      else poisons++;
      console.log(`  ${ok ? "✅" : "❌"} ${desc}（期望${wantProblems ? "≥1" : "0"} 个问题，实得 ${got}）`);
    }
    // 计数**动态算**：首版把 "4/4" 硬编码在文案里，加了两例之后输出就对不上了（自印不能撒谎）。
    console.log(
      bad === 0
        ? `投毒自证：${poisons}/${poisons} 畸形必红、${cleans} 例干净必绿 —— 门是活的`
        : `投毒自证失败：${bad} 例不符（共 ${cases.length} 例）`,
    );
    process.exit(bad === 0 ? 0 : 1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

const corpus = buildCorpusIndex();
if (corpus.entries.length === 0) {
  if (REQUIRE) {
    console.log(`❌ --require：三个语料面一个都不在（${CORPUS_FACES.join(" | ")}）`);
    process.exit(2);
  }
  console.log("⚠ 三个语料面都不在 ⇒ 本次**未验证**出处（不是通过）；强口径请加 --require");
  process.exit(0);
}

const files = collectRuleFiles();
if (files.length === 0) {
  if (REQUIRE) {
    console.log(`❌ --require：规则载体一篇都没有（${RULES_GLOB_ROOT}/<ver>/rules/*.md）`);
    process.exit(2);
  }
  console.log(`⚠ 规则载体不存在（${RULES_GLOB_ROOT}/<ver>/rules/*.md）⇒ 本次**未验证**，不是通过`);
  process.exit(0);
}

const problems = [];
for (const f of files) problems.push(...judgeRuleFile(f, corpus));

let citeCount = 0;
for (const f of files) citeCount += [...readFileSync(f.abs, "utf8").matchAll(CITE_RE)].length;

if (problems.length) {
  console.log(`assert-server-rules-integrity: ${problems.length} 项不达标（扫 ${files.length} 篇 / ${citeCount} 处出处）`);
  for (const p of problems.slice(0, 20)) console.log(`  ✗ ${p}`);
  if (problems.length > 20) console.log(`  …（共 ${problems.length} 项，只列前 20）`);
  process.exit(1);
}
console.log(
  `assert-server-rules-integrity: ok（规则 ${files.length} 篇 · 出处 ${citeCount} 处全部可解析且行号在界内 · 每篇均有「未核实」段）`,
);
