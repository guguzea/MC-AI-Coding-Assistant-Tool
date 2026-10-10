/**
 * 门：作者规范（仓库根 WRITING-FOR-AGENTS.md）的机器可判子集。判据三腿：
 *
 *   · J1 frontmatter 形状（作者规范 §6）—— `common_skill/<dir>/SKILL.md` 必须有闭合 frontmatter；
 *     `name` kebab-case 且 == 目录名；`description` ≥20 字符、带触发形态（当…时/use when/激活）、
 *     带排除形态（不[适用替代能要]|禁止|除非|not for/never use/unlike）。无豁免：编不出排除句就改技能本身。
 *   · J2 指针路径防过期（§2；根 AGENTS.md「易过期的路径描述」坑）—— 目标文件里形如仓库路径的
 *     行内反引号 token 必须在盘上可解析。入判门槛：字符集 [A-Za-z0-9_.-/] 起于字母数字、含 `/`、
 *     非 `./` `../` 前缀（占位符含 <>、URI 含 :、命令含空格、树形图含 ├ 都因此天然出局）；
 *     ``` 围栏内容不扫；首段 ∈ {dist,build,node_modules,run,temp} 不判（构建产物与易变区）。无豁免。
 *   · J3 纯负向棘轮（§4「风格负向转正」，安全负向按规范自带例外走豁免台账）—— 强负向词
 *     （禁止|不得|不可|不要|严禁|绝不|勿）所在行若同行无任何配对义务词（必须|须|先|改口|留|停|标|
 *     明说|直接|优于|而非|不是|保留|走|用|选|照|按|只能|只准…）记一条「纯负向」。逐文件计数钉棘轮基线
 *     （authoring-lint-baseline.json）：升 ⇒ 红；降 ⇒ 提示重钉不判红；基线缺文件或条目缺 ⇒ [J3-BASELINE-*] 红。
 *     豁免台账 authoring-lint.exemptions.txt（TAB 三列 file\tscope\tbasis；scope=前 24 字符指纹或 *，
 *     basis 只许 safety-neg:/example:/user-approved: 三形），条目原文必须仍在盘上（过期即红，
 *     形状同 assert-community-attribution）。
 *
 * 真跑目标面（v1，故意窄）：WRITING-FOR-AGENTS.md + common_skill/**.md；追加走可选清单
 * authoring-lint.files.txt（缺 = 不报错）。CONTRIBUTING.md 与根 AGENTS.md 暂不入面：里面的
 * `knowledge/antipatterns/`、`scaffold/gradle.properties`、`META-INF/mods.toml` 这类「相对平台档」
 * 惯例路径在仓库根解析不到 ⇒ 入面会先造一堆假红；扩面需先有相对面规则，属另批。
 *
 * 用法：node assert-authoring-lint.mjs [--root=<dir>] [--selftest] [--measure-floors]
 *   --selftest 内存夹具（注入 exists），三桶：投毒必红 / 反退化断言 / 正对照须绿，例数现数现印。
 *   --measure-floors 只打印建议基线 JSON 到 stdout，绝不写盘（重钉靠人过目后手抄）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
function argVal(name) {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(argVal("root") || path.join(HERE, "..", ".."));

// ---------- 判据常量 ----------
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TRIGGER = /(当.{2,80}?时|触发|激活|use when|Use when|use .*when)/;
// 排除形态 = description 里出现「声明自己不该干的」句式；不要求逐字「不适用」（mc-retro「不自动改」、
// mc-router「不激活」、mc-spec「不开新提问」都是合法排除声明）。
const EXCLUDE = /(不[适用替代能要]|不激活|不自动|不开|不写|不代|不引用|禁止|除非|not for|never use|unlike)/;
const NEG = /(禁止|不得|不可|不要|严禁|绝不|勿)/;
const OBLIG = /(必须|须|该|要先|先|只能|只准|一律|照|按|用|选|走|改口|留|给|停|标|明说|直接|立即|优于|而非|不是|保留|配|落|放|读|跑|追加|登记|同步|过目|点头)/;
const SKIP_ROOTS = new Set(["dist", "build", "node_modules", "run", "temp"]);

// ---------- 纯判据（selftest 与真跑共用一份） ----------

/** 行内反引号 token（跳过 ``` 围栏）。 */
function inlineTokens(text) {
  const out = [];
  let fence = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) { fence = !fence; continue; }
    if (fence) continue;
    for (const m of line.matchAll(/`([^`\n]+)`/g)) out.push(m[1].trim());
  }
  return out;
}

/** token 是否声明为「仓库根相对路径存在」。 */
function isRepoPathClaim(tok) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_.\-/]*$/.test(tok)) return false;
  if (!tok.includes("/")) return false;
  if (/^\.\.?\//.test(tok)) return false;
  let t = tok.endsWith("/") ? tok.slice(0, -1) : tok;
  if (t.endsWith(".")) return false;
  if (SKIP_ROOTS.has(t.split("/")[0])) return false;
  return true;
}

function repoPathOf(tok) {
  return tok.endsWith("/") ? tok.slice(0, -1) : tok;
}

function lintJ1(rel, text) {
  const errors = [];
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return [`${rel} :: [J1-NO-FRONTMATTER] SKILL.md 必须以闭合 frontmatter 开头`];
  const name = (fm[1].match(/^name:[ \t]*(\S+)[ \t]*$/m) || [])[1];
  const desc = (fm[1].match(/^description:[ \t]*(.+)$/m) || [])[1];
  const dir = rel.split("/").slice(-2)[0];
  if (!name || !KEBAB.test(name)) errors.push(`${rel} :: [J1-NAME] name 缺失或非 kebab：${name ?? "(无)"}`);
  else if (name !== dir) errors.push(`${rel} :: [J1-NAME-DIR] name(${name}) ≠ 目录名(${dir})`);
  if (!desc || desc.trim().length < 20) errors.push(`${rel} :: [J1-DESC-SHORT] description 缺失或 <20 字符`);
  else {
    if (!TRIGGER.test(desc)) errors.push(`${rel} :: [J1-DESC-TRIGGER] description 没有触发形态（当…时/use when/激活）`);
    if (!EXCLUDE.test(desc)) errors.push(`${rel} :: [J1-DESC-EXCLUDE] description 没有排除形态（不适用/不替代/除非…）`);
  }
  return errors;
}

function lintJ2(rel, text, exists) {
  const errors = [];
  for (const tok of inlineTokens(text)) {
    if (!isRepoPathClaim(tok)) continue;
    const p = repoPathOf(tok);
    if (!exists(p)) errors.push(`${rel} :: [J2-STALE-PATH] 指针声明 \`${tok}\` 在盘上解析不到`);
  }
  return errors;
}

function negLines(text) {
  const hits = [];
  let fence = false;
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^```/.test(line.trim())) { fence = !fence; return; }
    if (fence) return;
    if (NEG.test(line) && !OBLIG.test(line)) {
      hits.push({ n: i + 1, fp: line.trim().slice(0, 24) });
    }
  });
  return hits;
}

function applyExemptions(hits, exemptions, rel) {
  const remain = [];
  for (const h of hits) {
    const hit0 = exemptions.find((e) => e.file === rel && (e.scope === "*" || e.scope === h.fp));
    if (!hit0) remain.push(h);
  }
  return remain;
}

function checkExemptionLiveness(exemptions, docsByRel) {
  const errors = [];
  const validBasis = /^(safety-neg:|example:|user-approved:)/;
  for (const e of exemptions) {
    if (!validBasis.test(e.basis)) {
      errors.push(`exemption:${e.file}#${e.scope} :: [BAD-BASIS] basis 只许 safety-neg:/example:/user-approved: 三形`);
      continue;
    }
    const text = docsByRel[e.file];
    if (text == null) { errors.push(`exemption:${e.file}#${e.scope} :: [FILE-GONE] 豁免指向的文件不在面内`); continue; }
    if (e.scope !== "*") {
      const lines = text.split(/\r?\n/).map((l) => l.trim().slice(0, 24));
      if (!lines.some((l) => l && l === e.scope)) errors.push(`exemption:${e.file}#${e.scope} :: [STALE] 豁免原文已不在盘上`);
    }
  }
  return errors;
}

/**
 * 纯核心：输入注入文件表与 exists，返回 {errors, notes, counts}。
 * @param {{docs: Record<string,string>, skills: Record<string,string>, baseline: any,
 *          exemptions: Array<{file,scope,basis}>, exists: (rel:string)=>boolean}} env
 */
function evaluate(env) {
  const { docs, skills, baseline, exemptions, exists } = env;
  const errors = [];
  const notes = [];
  const counts = { j1: 0, j2Paths: 0, j3: 0, exempt: 0 };

  for (const [rel, text] of Object.entries(skills)) {
    errors.push(...lintJ1(rel, text));
    counts.j1++;
  }
  for (const [rel, text] of Object.entries(docs)) {
    errors.push(...lintJ2(rel, text, exists));
    counts.j2Paths += inlineTokens(text).filter(isRepoPathClaim).length;
    const raw = negLines(text);
    const kept = applyExemptions(raw, exemptions, rel);
    counts.j3 += kept.length;
    counts.exempt += raw.length - kept.length;
    if (!baseline || !baseline.asOf || !baseline.targets) {
      // 整份基线缺席：单条红一次即可，逐文件红会刷屏
    } else {
      const base = rel in baseline.targets ? baseline.targets[rel] : null;
      if (base == null) {
        errors.push(`${rel} :: [J3-BASELINE-MISSING] 棘轮基线没有该文件条目（--measure-floors 出建议值，人工过目后落基线）`);
      } else if (kept.length > base) {
        errors.push(`${rel} :: [J3-RATCHET] 纯负向 ${kept.length} > 基线 ${base}（升 = 新负向未转正或漏走豁免；逐条：${kept.map((h) => `L${h.n}`).join(", ")}）`);
      } else if (kept.length < base) {
        notes.push(`${rel} 纯负向 ${kept.length} < 基线 ${base} ⇒ 棘轮可下调（--measure-floors）`);
      }
    }
  }
  errors.push(...checkExemptionLiveness(exemptions, docs));
  if (!baseline || !baseline.asOf || !baseline.targets) {
    errors.push(`[BASELINE-MISSING] 基线文件缺席或缺 asOf/targets`);
  } else {
    for (const rel of Object.keys(baseline.targets)) {
      if (!(rel in docs)) errors.push(`baseline:${rel} :: [J3-BASELINE-ORPHAN] 基线条目指向不在面内的文件（删条目或补面）`);
    }
  }
  return { errors, notes, counts };
}

// ---------- 真跑装配 ----------
function readExemptions(file) {
  try {
    return fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => {
        const [file_, scope, basis] = l.split("\t");
        return { file: (file_ || "").trim(), scope: (scope || "").trim(), basis: (basis || "").trim() };
      });
  } catch { return []; }
}

function production() {
  const targetRels = ["WRITING-FOR-AGENTS.md"];
  const extraList = path.join(HERE, "authoring-lint.files.txt");
  if (fs.existsSync(extraList)) {
    for (const l of fs.readFileSync(extraList, "utf8").split(/\r?\n/)) {
      const t = l.trim();
      if (t && !t.startsWith("#") && !targetRels.includes(t)) targetRels.push(t);
    }
  }
  const docs = {};
  for (const rel of targetRels) {
    const p = path.join(ROOT, rel);
    if (fs.existsSync(p)) docs[rel] = fs.readFileSync(p, "utf8");
    else docs[rel] = null;
  }
  if (fs.existsSync(path.join(ROOT, "common_skill"))) {
    for (const n of fs.readdirSync(path.join(ROOT, "common_skill")).sort()) {
      const d = path.join(ROOT, "common_skill", n);
      if (!fs.statSync(d).isDirectory()) continue;
      for (const f of ["SKILL.md", "README.md"]) {
        const rel = `common_skill/${n}/${f}`;
        if (fs.existsSync(path.join(d, f))) docs[rel] = fs.readFileSync(path.join(d, f), "utf8");
      }
    }
  }
  const missing = Object.entries(docs).filter(([, v]) => v == null).map(([k]) => k);
  for (const k of missing) delete docs[k];
  const skills = {};
  for (const rel of Object.keys(docs)) {
    if (/^common_skill\/[^/]+\/SKILL\.md$/.test(rel)) skills[rel] = docs[rel];
  }
  let baseline = null;
  try { baseline = JSON.parse(fs.readFileSync(path.join(HERE, "authoring-lint-baseline.json"), "utf8")); } catch { /* 缺席由 evaluate 判红 */ }
  const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
  return { docs, skills, baseline, exemptions: readExemptions(path.join(HERE, "authoring-lint.exemptions.txt")), exists, missing };
}

if (argv.includes("--measure-floors")) {
  const env = production();
  const targets = {};
  for (const [rel, text] of Object.entries(env.docs)) targets[rel] = negLines(text).length;
  process.stdout.write(JSON.stringify({ asOf: new Date().toISOString().slice(0, 10), targets }, null, 2) + "\n");
  process.exit(0);
}

if (!argv.includes("--selftest")) {
  const env = production();
  if (env.missing.length) {
    process.stdout.write(`FAIL：声明的目标文件不在盘上（面内文件消失按红处理）：\n${env.missing.map((m) => `  ${m}\n`).join("")}`);
    process.exit(1);
  }
  const { errors, notes, counts } = evaluate(env);
  for (const n of notes) process.stdout.write(`  note: ${n}\n`);
  if (errors.length) {
    process.stdout.write(`FAIL（${errors.length} 条）:\n` + errors.map((e) => `  ${e}\n`).join(""));
    process.exit(1);
  }
  process.stdout.write(
    `ok: 目标 ${Object.keys(env.docs).length} 件 · J1 技能 ${counts.j1} 份 · J2 路径指针 ${counts.j2Paths} 枚全在盘 · J3 纯负向现数 ${counts.j3}（豁免 ${counts.exempt}）\n`
  );
  process.exit(0);
}

// ---------- --selftest：三桶全内存（exists 注入假盘，不碰仓库、不落盘） ----------
let passed = 0;
let poisonCount = 0, controlCount = 0, antiCount = 0;
const fakeExists = (rel) => new Set(["real/file.md", "docs/a.md", "common_skill/x/SKILL.md"]).has(rel);

function run(label, bucket, env, expectRed, needle) {
  if (bucket === "poison") poisonCount++; else if (bucket === "control") controlCount++; else antiCount++;
  const { errors } = evaluate(env);
  if (expectRed) {
    if (!errors.length) { process.stdout.write(`FAIL ${label}：该红没红\n`); process.exit(1); }
    if (needle && !errors.some((e) => e.includes(needle))) { process.stdout.write(`FAIL ${label}：红了但没点中 ${needle}：${errors.join(" | ")}\n`); process.exit(1); }
  } else if (errors.length) {
    process.stdout.write(`FAIL ${label}：正对照不该红：${errors.join(" | ")}\n`); process.exit(1);
  }
  passed++;
}

const BASE = { asOf: "2026-10-10", targets: { "docs/a.md": 0 } };
const CLEAN_DOC = "# t\n\n指针 `real/file.md` 在盘。\n必须给例子，不得空转。\n";
const SKILL_OK = "---\nname: demo\ndescription: 当用户要拷问需求时激活，帮他把设计树问完。不适用于具体 API 问答与报错排查。\n---\n\n# demo\n";
const skillEnv = (skillText, docText = CLEAN_DOC, baseline = BASE, ex = []) => ({
  docs: { "docs/a.md": docText }, skills: { "common_skill/demo/SKILL.md": skillText },
  baseline, exemptions: ex, exists: fakeExists,
});

// 投毒臂
run("poison J1 无 frontmatter", "poison", skillEnv("# demo\n正文没 frontmatter"), true, "J1-NO-FRONTMATTER");
run("poison J1 name≠目录", "poison", skillEnv("---\nname: other\ndescription: 当用户要拷问需求时激活，帮他把设计树问完。不适用于具体问答场景，这是个够长的描述文本。\n---\n"), true, "J1-NAME-DIR");
run("poison J1 desc 无排除", "poison", skillEnv("---\nname: demo\ndescription: 当用户提出新内容时激活，帮助对齐需求，一轮轮提问直到共识清单确认。这是一个足够长的描述。\n---\n"), true, "J1-DESC-EXCLUDE");
run("poison J2 过期路径", "poison", skillEnv(SKILL_OK, "引用 `gone/nothere.md` 当指针。"), true, "J2-STALE-PATH");
run("poison J3 棘轮升", "poison", skillEnv(SKILL_OK, "禁止裸写盘。\n"), true, "J3-RATCHET");
run("poison J3 基线缺条目", "poison", skillEnv(SKILL_OK, CLEAN_DOC, { asOf: "x", targets: {} }), true, "J3-BASELINE-MISSING");
run("poison J3 基线孤儿条目", "poison", skillEnv(SKILL_OK, CLEAN_DOC, { asOf: "x", targets: { "docs/gone.md": 0 } }), true, "J3-BASELINE-ORPHAN");
run("poison 基线整体缺席", "poison", skillEnv(SKILL_OK, CLEAN_DOC, null), true, "BASELINE-MISSING");
run("poison 豁免原文漂走", "poison", skillEnv(SKILL_OK, "禁止裸写盘。\n", { asOf: "x", targets: { "docs/a.md": 1 } },
  [{ file: "docs/a.md", scope: "改了又改的一句旧文", basis: "safety-neg:防删库" }]), true, "STALE");
run("poison 豁免 basis 坏形", "poison", skillEnv(SKILL_OK, CLEAN_DOC, BASE,
  [{ file: "docs/a.md", scope: "*", basis: "because-i-said" }]), true, "BAD-BASIS");

// 反退化臂
run("配对负向不计数（NEG+义务 同行）", "anti", skillEnv(SKILL_OK, "先跑 build，不得跳过测试。\n"), false);
run("围栏内容不被 J2 扫", "anti", skillEnv(SKILL_OK, "```text\n`fake/inside-fence.md`\n```\n"), false);
run("占位符/前缀/空格 token 出局", "anti", skillEnv(SKILL_OK, "指针候选 `data/<platform>_<ver>/`、`./scripts/x.mjs`、`mcskill://skill/x`、`node mcp-server/scripts/y.mjs` 都该出局。"), false);

// 正对照
run("正对照：干净技能+文档+基线", "control", skillEnv(SKILL_OK, CLEAN_DOC, BASE, []), false);
run("正对照：合法豁免放行且原文在盘", "control", skillEnv(SKILL_OK, "禁止裸写盘。\n", { asOf: "x", targets: { "docs/a.md": 1 } },
  [{ file: "docs/a.md", scope: "禁止裸写盘。", basis: "safety-neg:删库防线" }]), false);
{
  controlCount++;
  const env = skillEnv(SKILL_OK, CLEAN_DOC, { asOf: "x", targets: { "docs/a.md": 5 } }, []);
  const r = evaluate(env);
  if (r.errors.length) { process.stdout.write(`FAIL 降计数正对照红了：${r.errors.join("|")}\n`); process.exit(1); }
  if (!r.notes.some((n) => n.includes("棘轮可下调"))) { process.stdout.write(`FAIL 降计数没有下调提示\n`); process.exit(1); }
  passed++;
}

process.stdout.write(`自检 ${passed} 通过（${controlCount} 正控 + ${poisonCount} 投毒 + ${antiCount} 反退化，分母现数）\n`);
process.exit(0);
