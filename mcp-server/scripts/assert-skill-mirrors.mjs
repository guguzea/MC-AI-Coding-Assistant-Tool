/**
 * Assert .cursor/skills|rules 与各 IDE 镜像规范化后哈希一致。
 * 规范化与 scripts/sync-skills.ps1 对齐（路径引用、BOM、换行）。
 *
 * 末尾另有 pack-tree 不变式（同一份「源稿 ↔ 派生树」契约）：
 *   - neoforge/ 根档 = legacy trap：只留 .cursor 源稿，7 套投影树必须为空。
 *   - 任何档不得有 `.cursor/agents/`（复数）——sync 只写 `.cursor/agent/`（单数）。
 *   - 反之任何投影树根（`.claude/agent/` 等）不得有**单数** `agent/`——sync 写的是 `<host>/agents/default.md`
 *     （复数），单数挂在 .cursor 以外 = 旧版脚本残留（2026-09-29 判据 2d）。
 *   - 有 `.cursor/rules` 的档必须有薄包装 `sync-skills.ps1`（转发仓库脚本）。
 *   - 投影树根（`.claude/` 等 7 套）里不得出现游离 `AGENTS.md`——sync 不写该路径。
 *   - AGENTS.md → .cursor/agent + .claude/agents + .trae/agents 三镜像：
 *     存量漂移记在 KNOWN_AGENTS_DRIFT 台账里，新增漂移直接失败；
 *     台账条目一旦不再漂移也必须删（跑过一次真 sync 就得缩短），否则它变成永久豁免名单。
 *   - (4) frontmatter「有就必须合法」（D-3 已裁 = A）：键集白名单 + description 非空
 *     + alwaysApply 布尔 + globs 数组或空 + status ∈ {ready,draft}；
 *     没有 frontmatter 的 450 篇规则 / 94 个技能按裁定不查、不补。
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// MC_SKILL_MIRROR_ROOT = 只给 --selftest 的「真采集器两臂」用（tmp 假树），默认口径逐字不变。
// 没有这个旋钮的话，采集器侧的洞没法证：判据侧的夹具（evaluateMirrors）根本不经采集器。
const repoRoot = process.env.MC_SKILL_MIRROR_ROOT ? resolve(process.env.MC_SKILL_MIRROR_ROOT) : join(here, "..", "..");
const PLATS = ["forge", "fabric", "quilt", "liteloader", "rift", "modloader", "neoforge"];
const RULE_MIRRORS = [
  [".claude", "rules", ".mdc"],
  [".continue", "rules", ".mdc"],
  [".trae", "rules", ".mdc"],
  [".opencode", "rules", ".mdc"],
  [".agents", "rules", ".mdc"],
  [".zcode", "rules", ".mdc"],
];

function sha(text) {
  return createHash("sha256").update(normText(text)).digest("hex");
}

function normText(text) {
  return String(text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

function normalizePathRefs(text, rel) {
  if (!rel) return text;
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let t = text;
  t = t.replace(new RegExp("`" + escaped + "/\\.cursor/rules/(\\d{2}-[a-z-]+\\.mdc)`", "g"), "`$1`");
  t = t.replace(new RegExp(escaped + "/\\.cursor/rules/(\\d{2}-[a-z-]+\\.mdc)", "g"), "$1");
  return t;
}

function listVersionDirs() {
  const out = [];
  for (const plat of PLATS) {
    const platDir = join(repoRoot, plat);
    if (!existsSync(platDir) || !statSync(platDir).isDirectory()) continue;
    for (const name of readdirSync(platDir)) {
      const verDir = join(platDir, name);
      if (!statSync(verDir).isDirectory()) continue;
      if (!/^\d+\.\d+/.test(name)) continue;
      if (!existsSync(join(verDir, ".cursor", "rules"))) continue;
      out.push({ plat, ver: name, base: verDir, rel: `${plat}/${name}` });
    }
  }
  const be = join(repoRoot, "bedrock");
  if (existsSync(join(be, ".cursor", "rules"))) {
    out.push({ plat: "bedrock", ver: "", base: be, rel: "bedrock" });
  }
  return out;
}

function piRuleText(srcText, piName) {
  let ruleText = srcText;
  if (!/^description\s*:/m.test(ruleText)) {
    const titleLine = ruleText.split(/\r?\n/).find((l) => /^#\s+/.test(l));
    const desc = titleLine ? titleLine.replace(/^#\s+/, "").trim() : piName;
    if (ruleText.startsWith("---")) {
      ruleText = ruleText.replace(/^---\r?\n/, `---\ndescription: ${desc}\n`);
    } else {
      ruleText = `---\ndescription: ${desc}\n---\n\n${ruleText}`;
    }
  }
  return ruleText;
}

/**
 * 纯判据（第 27 轮 S16/T8 抽出）：一份 canonical 文本 ↔ N 个镜像目标的一致性。
 * `read(rel)` 返回文本，文件不存在返回 null；`label(rel)` 只负责显示路径。
 * 比对原语只有一个：`sha()`（含 `normText` 的 BOM/换行归一）⇒ 真跑与本文件的 `--selftest`
 * 共用同一份判据，不留第二个真值源。
 */
function checkMirrorGroup({ targets, read, label }) {
  const out = [];
  for (const t of targets) {
    const text = read(t.rel);
    if (text === null) {
      out.push(`missing ${label(t.rel)}`);
      continue;
    }
    if (sha(text) !== sha(t.wantText)) out.push(`hash mismatch ${label(t.rel)}`);
  }
  return out;
}

/** 采集器地板（R47 同形）：一棵档/一次比对都没发生 = 换错根，不是零缺陷。 */
function collectorFloor({ packs, compared }) {
  if (packs > 0 && compared > 0) return [];
  return [
    `COLLECTOR_RETURNED_ZERO: 扫到档=${packs} 镜像比对=${compared} ⇒ 换错根（repoRoot 指偏 / 平台树被搬走），判不了（拒）`,
  ];
}

/* ------------------------------------------------------------------- selftest */

const SKILL_MIRROR_RELS = (skillName) => [
  `.continue/skills/${skillName}/SKILL.md`,
  `.opencode/skills/${skillName}/SKILL.md`,
  `.agents/skills/${skillName}/SKILL.md`,
  `.zcode/skills/${skillName}/SKILL.md`,
  `.pi/skills/${skillName}/SKILL.md`,
  `.trae/skills/${skillName}.md`,
  `.claude/commands/${skillName.replace(/^mc-/, "")}.md`,
];
const RULE_REL_ALL = (name) => [
  ...RULE_MIRRORS.map(([host, sub]) => `${host}/${sub}/${name}`),
  `.pi/rules/${name.replace(/\.mdc$/, ".md")}`,
];

/** 内存假树：Map<rel, text> + 一份 canonical ⇒ 跑判据，返回 failures。 */
function evaluateMirrors({ name, canonical, tree, isSkill }) {
  const wantText = isSkill ? normalizePathRefs(canonical, "fabric/9.9.9") : canonical;
  const rels = isSkill ? SKILL_MIRROR_RELS(name) : RULE_REL_ALL(name);
  const targets = rels.map((rel) => ({
    rel,
    wantText: rel.startsWith(".pi/rules/") ? piRuleText(canonical, name.replace(/\.mdc$/, ".md")) : wantText,
  }));
  return checkMirrorGroup({
    targets,
    read: (rel) => (tree.has(rel) ? tree.get(rel) : null),
    label: (rel) => rel,
  });
}

const SRC_MDC = "# 规则标题\n\n正文。\n";
const SRC_SKILL = "---\nname: mc-demo\n---\n\n见 `fabric/9.9.9/.cursor/rules/01-registry.mdc`。\n";
const treeFor = (name, canonical, isSkill) => {
  const want = isSkill ? normalizePathRefs(canonical, "fabric/9.9.9") : canonical;
  const tree = new Map();
  for (const rel of isSkill ? SKILL_MIRROR_RELS(name) : RULE_REL_ALL(name)) {
    tree.set(rel, rel.startsWith(".pi/rules/") ? piRuleText(canonical, name.replace(/\.mdc$/, ".md")) : want);
  }
  return tree;
};

/* ---------------------------------------------------------------- L14 真采集器三臂 */
// 判据侧的夹具（上面的 evaluateMirrors）不经采集器 ⇒ 堵上 L14 之后，「这一面真的有人在比」只能由
// 自己 spawn 一份、把 MC_SKILL_MIRROR_ROOT 指到 tmp 假树来证。三臂各是一件事：
//   A 基线绿 + ok 行必须印出 flat 面计数（谁把这一面接断，输出上就看不见）
//   B 只改 flat 源稿、7 面镜像不动 ⇒ 必红 7 条（= 2026-09-28 真发生过的那一形）
//   C 删掉 flat 源稿、目录型还在 ⇒ 必红并点名 FLAT-SKILL-NOT-COLLECTED（采集器复发病灶）
// 臂数只由这张名单决定（自印分母禁止在别处写死，见 runSelftest 的 totalCases）。
const L14_ARMS = [
  "A 基线绿且 ok 行印出 flat 面计数",
  "B 只改 flat 源稿必红 7 条且逐条落在 flat 面",
  "C 摘掉这一面必点名 FLAT-SKILL-NOT-COLLECTED",
];
const FLAT_RULE_SRC = "# 演示规则\n\n正文。\n";
const FLAT_SKILL_SRC = "---\nname: mc-flat\ndescription: 扁平技能源稿\n---\n\n正文。\n";
const FLAT_DIR_SRC = "---\nname: mc-dir\ndescription: 目录型技能源稿\n---\n\n正文。\n";

function buildMirrorFixture(root) {
  const base = join(root, "fabric", "9.9.9");
  const w = (rel, text) => {
    const p = join(base, ...rel.split("/"));
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, text, "utf8");
  };
  // 规则面也得齐：否则 collectorFloor 先红，把三臂的判词淹掉。
  w(".cursor/rules/00-demo.mdc", FLAT_RULE_SRC);
  for (const [host, sub] of RULE_MIRRORS) w(`${host}/${sub}/00-demo.mdc`, FLAT_RULE_SRC);
  w(".pi/rules/00-demo.md", piRuleText(FLAT_RULE_SRC, "00-demo.md"));
  w("sync-skills.ps1", "& (Join-Path $PSScriptRoot '..\\..\\scripts\\sync-skills.ps1') -TargetDir $here\n");
  w(".cursor/skills/mc-dir/SKILL.md", FLAT_DIR_SRC);
  for (const rel of SKILL_MIRROR_RELS("mc-dir")) w(rel, normalizePathRefs(FLAT_DIR_SRC, "fabric/9.9.9"));
  w(".cursor/skills/mc-flat.md", FLAT_SKILL_SRC);
  for (const rel of SKILL_MIRROR_RELS("mc-flat")) w(rel, normalizePathRefs(FLAT_SKILL_SRC, "fabric/9.9.9"));
  return base;
}

function runMirrorGateOn(root) {
  const out = spawnSync(process.execPath, [join(here, "assert-skill-mirrors.mjs")], {
    encoding: "utf8",
    env: { ...process.env, MC_SKILL_MIRROR_ROOT: root },
  });
  return { rc: out.status, text: `${out.stdout || ""}${out.stderr || ""}` };
}

function flatCollectorArms() {
  const tmp = mkdtempSync(join(tmpdir(), "mirrors-l14-"));
  const problems = [];
  try {
    const base = buildMirrorFixture(tmp);
    const green = runMirrorGateOn(tmp);
    if (green.rc !== 0) {
      problems.push(`臂 A 基线绿：期望 rc=0，实得 rc=${green.rc} ⇒ ${green.text.split(/\r?\n/).find((l) => l.trim()) || "(无输出)"}`);
    }
    if (!/L14 flat \.md 面已进比对：源稿=1 件／排给它=7 个镜像目标（目录型=1 件）/.test(green.text)) {
      problems.push("臂 A：ok 行没印出 flat 面计数（源稿=1／排给它=7／目录型=1）⇒ 这一面在输出上不可见，接断了也看不出来");
    }
    writeFileSync(join(base, ".cursor", "skills", "mc-flat.md"), FLAT_SKILL_SRC.replace("正文。", "正文改了两个字。"), "utf8");
    const poison = runMirrorGateOn(tmp);
    // 分两条腿数：总数必须 = 7（flat 面 7 个镜像，目录型与规则面都不该被牵连），
    // 再逐条确认这 7 条**全落在 flat 面上**（形状见下面三种，别只认一种）。
    const all = poison.text.match(/hash mismatch[^\n]*/g) || [];
    // label 的形状有三种，都得认（第一发按 `.md` 一种写死，数出 2/7；第二发按 `/` 分隔符，数出 0/7）：
    //   `.trae/skills/mc-flat.md`、`.agents|.continue|.opencode|.pi|.zcode/skills/mc-flat/SKILL.md`、
    //   `.claude/commands/flat.md`（mc- 前缀被剥）。分隔符 = relative() 给的反斜杠。
    const flatSet = all.filter((l) => /mc-flat/.test(l) || /commands[\\/]flat\.md/.test(l));
    if (poison.rc === 0) problems.push("臂 B 只改 flat 源稿、7 面镜像不动 ⇒ 必须红（L14 复发那一形，今天真发生过）");
    else if (all.length !== 7) problems.push(`臂 B 应只有 7 条 hash mismatch（flat 的 7 面镜像），实得 ${all.length} 条：${all.slice(0, 3).join(" | ")}`);
    else if (flatSet.length !== 7) problems.push(`臂 B 的 7 条红点必须全落在 flat 面上，实得 ${flatSet.length}/7（另 ${7 - flatSet.length} 条落在别处 = 夹具没隔离干净）`);
    writeFileSync(join(base, ".cursor", "skills", "mc-flat.md"), FLAT_SKILL_SRC, "utf8");
    rmSync(join(base, ".cursor", "skills", "mc-flat.md"), { force: true });
    const cut = runMirrorGateOn(tmp);
    if (cut.rc === 0 || !/FLAT-SKILL-NOT-COLLECTED/.test(cut.text)) {
      problems.push(`臂 C flat 源稿被删而目录型还在 ⇒ 必须红并点名 FLAT-SKILL-NOT-COLLECTED，实得 rc=${cut.rc}`);
    }
  } finally {
    try {
      rmSync(tmp, { recursive: true, force: true });
    } catch {
      /* 删不掉由调用方的残留腿去红 */
    }
  }
  return problems;
}

/* ------------------------------------------- 单数 agent/ 面真采集器三臂（判据 2d） */
// 与 L14 同一族：这类腿管的是「目录形状存不存在」，只有经采集器（门自己 spawn 一棵 tmp 假树）才算证据，
// 内存夹具 evaluateMirrors 看不见它。三臂各一件事：
//   A 基线（fixture 只有合法的 .cursor/agent/）⇒ 绿，且 ok 行必须印出这一面的扫描数（接断了输出上就看得见）
//   B 造一件 `.claude/agent/default.md` ⇒ 必红、按路径点名，且**只有这一条**孤儿红（不误伤别面）
//   C 把这一面整片摘掉（删掉唯一平台目录 ⇒ 候选塌成 0）⇒ 必红并点名 SINGULAR-AGENT-SCAN-EMPTY
const SING_ARMS = [
  "A 基线绿且 ok 行印出单数 agent/ 扫描数",
  "B 造 .claude/agent/default.md 必红并按路径点名",
  "C 候选塌成 0 必红并点名 SINGULAR-AGENT-SCAN-EMPTY",
];
function singularOrphanArms() {
  const problems = [];
  const fresh = () => {
    const tmp = mkdtempSync(join(tmpdir(), "mirrors-l14-sing-")); // 前缀沿用 guard 依据（script-write-guard-check:65）
    buildMirrorFixture(tmp);
    return tmp;
  };
  const cleanup = [];
  try {
    const t1 = fresh(); cleanup.push(t1);
    const green = runMirrorGateOn(t1);
    if (green.rc !== 0) {
      problems.push(`臂 A 基线：期望 rc=0，实得 ${green.rc} ⇒ ${(green.text.split(/\r?\n/).find((l) => l.trim()) || "(无输出)")}`);
    }
    if (!/单数 agent\/ 面扫 \d+ 组合／孤儿 0 个/.test(green.text)) {
      problems.push(`臂 A：ok 行没印出单数 agent/ 面的扫描数 ⇒ 这一面被接断也看不出来。实得片段：${green.text.slice(0, 200)}`);
    }
    const t2 = fresh(); cleanup.push(t2);
    const stray = join(t2, "fabric", "9.9.9", ".claude", "agent");
    mkdirSync(stray, { recursive: true });
    writeFileSync(join(stray, "default.md"), "# 旧版脚本残留\n", "utf8");
    const poison = runMirrorGateOn(t2);
    const named = (poison.text.match(/orphan [^\n(]*\/\.claude\/agent\//g) || []);
    const anyAgentOrphan = (poison.text.match(/orphan [^\n(]*\/agent\//g) || []);
    if (poison.rc === 0) problems.push("臂 B：造了 .claude/agent/default.md 却 rc=0 ⇒ 这一面没人执法");
    else if (named.length !== 1) problems.push(`臂 B：应恰 1 条点名 fabric/9.9.9/.claude/agent/ 的红，实得 ${named.length} 条：${named.slice(0, 3).join(" | ")}`);
    else if (anyAgentOrphan.length !== 1) problems.push(`臂 B：其余宿主不该被牵连（单数孤儿红共 ${anyAgentOrphan.length} 条，应 1）：${anyAgentOrphan.join(" | ")}`);
    const t3 = fresh(); cleanup.push(t3);
    rmSync(join(t3, "fabric"), { recursive: true, force: true });
    const cut = runMirrorGateOn(t3);
    if (cut.rc === 0 || !/SINGULAR-AGENT-SCAN-EMPTY/.test(cut.text)) {
      problems.push(`臂 C：候选面塌成 0 时必红并点名 SINGULAR-AGENT-SCAN-EMPTY，实得 rc=${cut.rc}`);
    }
  } finally {
    for (const d of cleanup) {
      try { rmSync(d, { recursive: true, force: true }); } catch { /* 删不掉由调用方的残留腿去红 */ }
    }
  }
  return { problems, n: SING_ARMS.length };
}

function runSelftest() {
  const cases = [
    { name: "GREEN 规则面基线（6 镜像 + .pi 变换全一致）", want: "ok", call: () => evaluateMirrors({ name: "01-demo.mdc", canonical: SRC_MDC, tree: treeFor("01-demo.mdc", SRC_MDC, false), isSkill: false }) },
    { name: "GREEN 技能面基线（7 镜像 + 路径引用规范化全一致）", want: "ok", call: () => evaluateMirrors({ name: "mc-demo", canonical: SRC_SKILL, tree: treeFor("mc-demo", SRC_SKILL, true), isSkill: true }) },
    {
      name: "POISON-1BYTE 某个 .claude 镜像比 canonical 多一个字节 ⇒ 必红",
      wantFail: "hash mismatch .claude/rules/01-demo.mdc",
      call: () => {
        const t = treeFor("01-demo.mdc", SRC_MDC, false);
        t.set(".claude/rules/01-demo.mdc", SRC_MDC + "x");
        return evaluateMirrors({ name: "01-demo.mdc", canonical: SRC_MDC, tree: t, isSkill: false });
      },
    },
    {
      name: "POISON-MISSING 删掉一个镜像 ⇒ 红在 missing（不得退化成「没文件即绿」）",
      wantFail: "missing .trae/skills/mc-demo.md",
      call: () => {
        const t = treeFor("mc-demo", SRC_SKILL, true);
        t.delete(".trae/skills/mc-demo.md");
        return evaluateMirrors({ name: "mc-demo", canonical: SRC_SKILL, tree: t, isSkill: true });
      },
    },
    {
      name: "POISON-CANONICAL 只改源稿、镜像不动 ⇒ 全镜像红（证明比的是等式不是「镜像自洽」）",
      wantFail: "hash mismatch",
      call: () => evaluateMirrors({ name: "01-demo.mdc", canonical: SRC_MDC + "改了一个字\n", tree: treeFor("01-demo.mdc", SRC_MDC, false), isSkill: false }),
      count: 7,
    },
    {
      name: "POISON-PI 把 .pi 镜像写成裸源稿（跳过 piRuleText 变换）⇒ 必红",
      wantFail: "hash mismatch .pi/rules/01-demo.md",
      call: () => {
        const t = treeFor("01-demo.mdc", SRC_MDC, false);
        t.set(".pi/rules/01-demo.md", SRC_MDC);
        return evaluateMirrors({ name: "01-demo.mdc", canonical: SRC_MDC, tree: t, isSkill: false });
      },
    },
    {
      name: "CONTROL 不判对照：源稿**已带** description 时 .pi 镜像 = 源稿逐字（变换不得二次注入 frontmatter）",
      want: "ok",
      call: () => {
        const src = "---\ndescription: 已声明\n---\n\n# 规则标题\n\n正文。\n";
        const t = new Map();
        for (const rel of RULE_REL_ALL("02-demo.mdc")) t.set(rel, src);
        return evaluateMirrors({ name: "02-demo.mdc", canonical: src, tree: t, isSkill: false });
      },
    },
    {
      name: "FLOOR 采集器 0 档 / 0 比对 ⇒ COLLECTOR_RETURNED_ZERO",
      wantFail: "COLLECTOR_RETURNED_ZERO",
      call: () => collectorFloor({ packs: 0, compared: 0 }),
    },
  ];

  let bad = 0;
  for (const c of cases) {
    const problems = c.call();
    if (c.want === "ok") {
      if (problems.length) {
        bad++;
        console.log(`  ✗ ${c.name} 应当绿，实际红 ${problems.length} 项：${problems[0]}`);
      } else console.log(`  ✓ ${c.name} → 绿`);
      continue;
    }
    const hit = problems.find((p) => p.includes(c.wantFail));
    if (!hit) {
      bad++;
      console.log(`  ✗ ${c.name} 应红在「${c.wantFail}」，实际失败 ${problems.length} 项（${problems[0] || "无"}）`);
    } else if (c.count && problems.length !== c.count) {
      bad++;
      console.log(`  ✗ ${c.name} 应红 ${c.count} 项，实际 ${problems.length} 项：${hit}`);
    } else console.log(`  ✓ ${c.name} → 红：${hit.slice(0, 130)}${problems.length > 1 ? ` （共 ${problems.length} 项）` : ""}`);
  }

  // L14（2026-09-28 闭）：`.cursor/skills/<name>.md` 这面从前被采集器 `continue` 掉 ⇒ 排给它 0 个
  // 镜像目标、漂移 1 字节也绿。现在它进比对，并由三记**真采集器**臂钉住（自己 spawn、tmp 假树）。
  const collectorProblems = flatCollectorArms();
  if (collectorProblems.length) {
    for (const p of collectorProblems) console.log(`  ✗ L14 采集器臂：${p}`);
    bad += collectorProblems.length;
  } else {
    console.log(`  ✓ L14 采集器${L14_ARMS.length}臂 → 基线绿且印出 flat 计数 / 只改 flat 源稿必红 7 条 / 摘掉这一面必点名 FLAT-SKILL-NOT-COLLECTED`);
  }

  // 判据 2d（2026-09-29）：单数 `<host>/agent/` 残留面。同一族（只有经采集器才算证据），
  // 三臂同形：基线绿且印数 / 造一件必红且只红那一条 / 候选塌成 0 必点名地板。
  const sing = singularOrphanArms();
  if (sing.problems.length) {
    for (const p of sing.problems) console.log(`  ✗ 单数 agent/ 臂：${p}`);
    bad += sing.problems.length;
  } else {
    console.log(`  ✓ 单数 agent/ 采集器${sing.n}臂 → 基线绿且印出扫描数 / 造 .claude/agent/default.md 必红并点名 / 候选塌成 0 必点名 SINGULAR-AGENT-SCAN-EMPTY`);
  }

  // 分母由三处名单现推（cases / L14_ARMS / SING_ARMS），禁止在别处重抄「11 例」这种会烂的数。
  const totalCases = cases.length + L14_ARMS.length + sing.n;
  if (bad) {
    console.log(`assert-skill-mirrors --selftest: ${bad}/${totalCases} 例不符 ⇒ 判据已退化`);
    process.exit(1);
  }
  console.log(
    `assert-skill-mirrors --selftest: ok · ${totalCases} 例全中（${cases.filter((c) => c.wantFail).length} 投毒必红 + 2 基线绿 + 不判对照绿 + L14 真采集器 ${L14_ARMS.length} 臂 + 单数 agent/ 真采集器 ${sing.n} 臂；内存夹具 + tmp 假树，未碰仓库）`,
  );
}

if (process.argv.includes("--selftest")) {
  runSelftest();
  process.exit(0);
}

const failures = [];
let packsScanned = 0;
let mirrorHashChecked = 0;
// L14 已闭（2026-09-28）：flat `.cursor/skills/<name>.md` 这一面从前被采集器 `continue` 掉 ⇒
// 排给它的镜像目标 = 0。下面三个计数就是「这一面到底有没有人排目标」的可见位，臂 E/F/G 钉它。
let flatSkillSources = 0;
let flatSkillTargets = 0;
let dirSkillSources = 0;

for (const pack of listVersionDirs()) {
  packsScanned++;
  const rulesDir = join(pack.base, ".cursor", "rules");
  const rules = readdirSync(rulesDir).filter((n) => n.endsWith(".mdc"));
  const readInPack = (rel) => {
    const p = join(pack.base, ...rel.split("/"));
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  const labelInPack = (rel) => relative(repoRoot, join(pack.base, ...rel.split("/")));
  for (const name of rules) {
    const src = readFileSync(join(rulesDir, name), "utf8");
    const piName = name.replace(/\.mdc$/, ".md");
    // 6 套 IDE 规则镜像 = 逐字；.pi 规则镜像 = piRuleText(源稿)（无 description 时补一份）。
    const targets = [
      ...RULE_MIRRORS.map(([host, sub]) => ({ rel: `${host}/${sub}/${name}`, wantText: src })),
      { rel: `.pi/rules/${piName}`, wantText: piRuleText(src, piName) },
    ];
    mirrorHashChecked += targets.length;
    failures.push(...checkMirrorGroup({ targets, read: readInPack, label: labelInPack }));
  }

  // reverse-list extras in host rule mirrors
  const cursorRuleSet = new Set(rules);
  for (const [host, sub] of RULE_MIRRORS) {
    const hostDir = join(pack.base, host, sub);
    if (!existsSync(hostDir)) continue;
    for (const n of readdirSync(hostDir).filter((x) => x.endsWith(".mdc"))) {
      if (!cursorRuleSet.has(n)) {
        failures.push(`extra ${relative(repoRoot, join(hostDir, n))}`);
      }
    }
  }
  const piRulesDir = join(pack.base, ".pi", "rules");
  if (existsSync(piRulesDir)) {
    for (const n of readdirSync(piRulesDir).filter((x) => x.endsWith(".md"))) {
      const want = n.replace(/\.md$/, ".mdc");
      if (!cursorRuleSet.has(want)) {
        failures.push(`extra ${relative(repoRoot, join(piRulesDir, n))}`);
      }
    }
  }

  const skillsDir = join(pack.base, ".cursor", "skills");
  const cursorSkillNames = new Set();
  if (existsSync(skillsDir)) {
    for (const entry of readdirSync(skillsDir)) {
      const inDirSrc = join(skillsDir, entry, "SKILL.md");
      const flatSrc = join(skillsDir, entry);
      let bare = entry;
      let srcFile = inDirSrc;
      let isFlat = false;
      if (existsSync(inDirSrc)) {
        cursorSkillNames.add(entry);
        dirSkillSources++;
      } else if (statSync(flatSrc).isFile() && entry.endsWith(".md")) {
        // L14（2026-09-28 闭）：这里从前 `continue` —— 名字登记了、sha 比对没做 ⇒ 该面漂移 1 字节也绿。
        // 现与目录型同一条腿：normalized 后比 7 面镜像（`.trae`/`.claude` 的形状差异由 SKILL_MIRROR_RELS 给）。
        bare = entry.replace(/\.md$/, "");
        cursorSkillNames.add(bare);
        srcFile = flatSrc;
        isFlat = true;
        flatSkillSources++;
      } else {
        continue;
      }
      const normalized = normalizePathRefs(readFileSync(srcFile, "utf8"), pack.rel);
      const skillTargets = SKILL_MIRROR_RELS(bare).map((rel) => ({ rel, wantText: normalized }));
      mirrorHashChecked += skillTargets.length;
      if (isFlat) flatSkillTargets += skillTargets.length;
      failures.push(...checkMirrorGroup({ targets: skillTargets, read: readInPack, label: labelInPack }));
    }
  }

  for (const [host, sub] of [
    [".continue", "skills"],
    [".opencode", "skills"],
    [".agents", "skills"],
    [".zcode", "skills"],
    [".pi", "skills"],
  ]) {
    const d = join(pack.base, host, sub);
    if (!existsSync(d)) continue;
    for (const n of readdirSync(d)) {
      if (!statSync(join(d, n)).isDirectory()) continue;
      if (!cursorSkillNames.has(n)) {
        failures.push(`extra ${relative(repoRoot, join(d, n))}`);
      }
    }
  }
  const traeDir = join(pack.base, ".trae", "skills");
  if (existsSync(traeDir)) {
    for (const n of readdirSync(traeDir).filter((x) => x.endsWith(".md"))) {
      const stem = n.replace(/\.md$/, "");
      if (!cursorSkillNames.has(stem)) {
        failures.push(`extra ${relative(repoRoot, join(traeDir, n))}`);
      }
    }
  }
  const claudeDir = join(pack.base, ".claude", "commands");
  if (existsSync(claudeDir)) {
    for (const n of readdirSync(claudeDir).filter((x) => x.endsWith(".md"))) {
      const stem = n.replace(/\.md$/, "");
      if (!cursorSkillNames.has(stem) && !cursorSkillNames.has(`mc-${stem}`)) {
        failures.push(`extra ${relative(repoRoot, join(claudeDir, n))}`);
      }
    }
  }
}

// ── Pack-tree 不变式 ────────────────────────────────────────────────────────
// 下面三类都源于「只改派生产物 / 只删产物，源稿与生成器照旧」：
// 一次 sync-skills.ps1 就能把删掉的东西整套写回来，所以必须机器守住。

/** sync-skills.ps1 在每档写的 7 套投影树根（与 RULE_MIRRORS + .pi 一致）。 */
const PROJECTION_DIRS = [
  ".claude",
  ".continue",
  ".trae",
  ".opencode",
  ".agents",
  ".zcode",
  ".pi",
];

// (1) neoforge/ 根档是 legacy trap（neoforge/LEGACY-NOTICE.md）：现行版档在
//     neoforge/<ver>/，根档只留 .cursor 源稿。它曾有 325 个投影文件；删掉后
//     只要 sync 再把根目录列进 targets，一条命令就整套复活。
const nfRoot = join(repoRoot, "neoforge");
if (existsSync(join(nfRoot, ".cursor", "rules"))) {
  for (const host of PROJECTION_DIRS) {
    if (existsSync(join(nfRoot, host))) {
      failures.push(
        `legacy neoforge root pack gained projection ${relative(repoRoot, join(nfRoot, host))} ` +
          "(see neoforge/LEGACY-NOTICE.md; live packs are neoforge/<ver>/)",
      );
    }
  }
}

// (2) `.cursor/agents/`（复数）不是任何生成器的目标：sync-skills.ps1 只写
//     `.cursor/agent/default.md`（单数）+ `.claude/agents/` + `.trae/agents/`。
//     复数目录 = 旧时代手改投影留下的孤儿，没人读，也没人覆盖它。
//     S16-5（2026-09-24）：这里原先只走 PLATS ⇒ **bedrock 整棵被跳过**（它是根级单档，
//     不在 `<plat>/<ver>` 那套清单里）。同一不变式对 7 个 Java 平台成立，对基岩同样成立
//     ——2026-09-24 实测 `find bedrock -maxdepth 4 -type d -name agents` 只有 `.claude/agents`
//     与 `.trae/agents`（都是合法投影目标），故补面当天不红。
const PLURAL_ORPHAN_PLATS = [...PLATS, "bedrock"];
let pluralOrphanScanned = 0;
for (const plat of PLURAL_ORPHAN_PLATS) {
  const platDir = join(repoRoot, plat);
  if (!existsSync(platDir)) continue;
  const candidates = [{ base: platDir, rel: plat }];
  for (const name of readdirSync(platDir)) {
    const dir = join(platDir, name);
    if (statSync(dir).isDirectory()) candidates.push({ base: dir, rel: `${plat}/${name}` });
  }
  pluralOrphanScanned += candidates.length;
  for (const { base, rel } of candidates) {
    const plural = join(base, ".cursor", "agents");
    if (existsSync(plural) && statSync(plural).isDirectory()) {
      failures.push(
        `orphan ${rel}/.cursor/agents/ (plural is never a sync target — keep .cursor/agent/default.md only)`,
      );
    }
  }
}

// R47 地板：判据(2)的采集面。PLURAL_ORPHAN_PLATS 被改空 / 平台目录整体改名 ⇒ 这条腿一格不扫照样绿。
if (pluralOrphanScanned === 0) {
  failures.push(
    "orphan-scan 采集面 = 0（复数 .cursor/agents 一个候选目录都没扫到）⇒ 平台清单被改空，判据在空转（R47）",
  );
}

// (2b) scripts/sync-skills.ps1 头部自陈约定：「各版本目录下的 sync-skills.ps1 应为
//     对本脚本的薄包装」。缺一个 = 该档改了规则后没人能就地广播，只能记得去跑 -All。
//     只查「存在 + 确实是转发到仓库脚本的薄包装」，不查逐字节（bedrock 深度不同）。
for (const pack of listVersionDirs()) {
  const wrapper = join(pack.base, "sync-skills.ps1");
  const rel = relative(repoRoot, wrapper);
  if (!existsSync(wrapper)) {
    failures.push(`missing ${rel} (本档有 .cursor/rules 却没有薄包装 — 照 <repo>/fabric/1.21.11/sync-skills.ps1 补一个)`);
    continue;
  }
  const text = readFileSync(wrapper, "utf8");
  if (!/[\\/]scripts[\\/]sync-skills\.ps1/.test(text) || !/-TargetDir \$here/.test(text)) {
    failures.push(
      `${rel} is not a thin wrapper (必须转发到仓库 scripts/sync-skills.ps1 并传 -TargetDir $here；` +
        "自己实现一份就会和权威脚本分叉)",
    );
  }
}

// (2c) 投影树根里的游离 AGENTS.md：sync 只写 AGENTS.md → `.cursor/agent/default.md`
//     + `.claude/agents/` + `.trae/agents/` 三镜像，`<host>/AGENTS.md` 不在其列。
//     留着它 = 下次有人改档内 AGENTS.md，这份副本不会被任何命令更新，且 mirror gate 的
//     (3) 看不见它 → 陈旧副本静默存在。2026-09-04 实测全仓 2 份（forge/1.14.4 的
//     `.continue/AGENTS.md` 与 `.trae/AGENTS.md`，逐字节同权威），已删并立此不变式。
for (const pack of listVersionDirs()) {
  for (const host of PROJECTION_DIRS) {
    const orphan = join(pack.base, host, "AGENTS.md");
    if (existsSync(orphan)) {
      failures.push(
        `orphan ${relative(repoRoot, orphan)} (sync 从不写这个路径；把内容并回 ${pack.rel}/AGENTS.md 后删掉它)`,
      );
    }
  }
}

// (2d) 单数 `<host>/agent/`（host ≠ .cursor）与 (2) 是同一个病的镜像方向：sync 只写
//     `.cursor/agent/default.md`（单数，合法）+ `.claude/agents/` + `.trae/agents/`（复数，合法），
//     所以 `.claude/agent/`、`.trae/agent/` 这类目录既没人读、也没人覆盖。
//     2026-09-29 现扫（四把尺：`git ls-tree -r --name-only HEAD` = 2 ／ `git ls-files` = 2 ／
//     `git status --porcelain` = 2 条 ` D` ／ `find <8 平台根> -maxdepth 3 -type d -name agent` = 57 个目录
//     全部在 `.cursor/agent`、非 .cursor 宿主 0）：这类单数孤儿文件只有 2 件 ——
//     `fabric/1.21.1/.claude/agent/default.md` 与 `fabric/1.21.1/.trae/agent/default.md`，
//     且两者是**同一枚 blob**（`06d8bc3e5b6c8b87d69fe560e72d3d8a2a727e06`，1 291 B），
//     同档三个合法镜像现盘各 10 554 B ⇒ 内容是旧版脚本的残留，不是「漂移待同步」。
//     ⇒ 判据不能拿 sha 去比这两件（那是恒红一条腿，真值形状是「不该存在」），照抄 (2) 的形状：
//     出现即红 + 点名，删目录即清账。工作树已删（2 条 ` D`），所以本腿在现盘 0 红，
//     机制证据只由 --selftest 的 singularOrphanArms() 三臂承担。
let singularAgentScanned = 0;
let singularAgentOrphans = 0;
for (const plat of PLURAL_ORPHAN_PLATS) {
  const platDir = join(repoRoot, plat);
  if (!existsSync(platDir)) continue;
  const candidates = [{ base: platDir, rel: plat }];
  for (const name of readdirSync(platDir)) {
    const dir = join(platDir, name);
    if (statSync(dir).isDirectory()) candidates.push({ base: dir, rel: `${plat}/${name}` });
  }
  for (const { base, rel } of candidates) {
    // PROJECTION_DIRS 天然不含 .cursor ⇒ 那里合法的单数 agent/ 不会被牵连。
    for (const host of PROJECTION_DIRS) {
      singularAgentScanned++;
      const stray = join(base, host, "agent");
      if (existsSync(stray) && statSync(stray).isDirectory()) {
        singularAgentOrphans++;
        failures.push(
          `orphan ${rel}/${host}/agent/ (单数 agent/ 只许挂在 .cursor 下；sync 写的是 ${host}/agents/default.md ⇒ 删掉这个目录，别去补内容)`,
        );
      }
    }
  }
}

// R47 地板（与判据 (2) 的 pluralOrphanScanned 同形）：这一面一格都没扫 = 平台清单被改空 / 根指偏，
// 不是「零孤儿」。没有这条，把 PLURAL_ORPHAN_PLATS 改空就能让 (2d) 静默熄火。
if (singularAgentScanned === 0) {
  failures.push(
    "SINGULAR-AGENT-SCAN-EMPTY：单数 agent/ 面 0 个候选组合（平台 × 7 投影根）⇒ 采集面塌了（平台清单被改空 / MC_SKILL_MIRROR_ROOT 指偏），判据在空转（R47）",
  );
}

// (3) AGENTS.md 是权威源稿，sync 把它覆盖到三处镜像。台账原本是 sweep47 留下的存量漂移
//     （改了各档 AGENTS.md 却没重跑 sync）；2026-09-01 真跑 sync-skills.ps1 -All 后实测漂移 0 档，已清空。
//     只准临时挂账：先跑 node scripts/assert-skill-mirrors.mjs 看 rel，加一行、修好、删一行。
//     下面的双向检查会同时拒绝「新漂移」和「台账里的僵尸条目」，所以挂账不会变成永久豁免。
const KNOWN_AGENTS_DRIFT = new Set([]);

const agentsDrift = new Set();
for (const pack of listVersionDirs()) {
  const agentsSrc = join(pack.base, "AGENTS.md");
  if (!existsSync(agentsSrc)) continue;
  const want = sha(readFileSync(agentsSrc, "utf8"));
  const mirrors = [
    join(pack.base, ".cursor", "agent", "default.md"),
    join(pack.base, ".claude", "agents", "default.md"),
    join(pack.base, ".trae", "agents", "default.md"),
  ];
  const drifted = mirrors.filter((m) => !existsSync(m) || sha(readFileSync(m, "utf8")) !== want);
  if (!drifted.length) continue;
  agentsDrift.add(pack.rel);
  if (KNOWN_AGENTS_DRIFT.has(pack.rel)) continue;
  failures.push(
    `AGENTS.md mirrors out of sync in ${pack.rel}: ` +
      drifted.map((m) => relative(repoRoot, m)).join(", ") +
      " (run scripts/sync-skills.ps1 -TargetDir <pack>)",
  );
}

// 台账是「待重同步」清单，不是永久豁免名单：真跑过一次 sync，条目就必须删掉。
// 不这么要求的话，「只准缩短」只是句注释，台账会悄悄变成 36 档的长期免检。
const staleLedger = [...KNOWN_AGENTS_DRIFT].filter((rel) => !agentsDrift.has(rel));
if (staleLedger.length) {
  failures.push(
    `agents 漂移台账里有 ${staleLedger.length}/${KNOWN_AGENTS_DRIFT.size} 条已经不再漂移：` +
      `把这些 rel 从 KNOWN_AGENTS_DRIFT 删掉（跑 scripts/sync-skills.ps1 -All 后收敛）：${staleLedger.slice(0, 40).join(", ")}`,
  );
}

// ── (4) frontmatter 合法性（D-3 已裁 = A：只做「有就必须合法」的 gate）──────
// 实测基线（2026-09-05，git ls-files 口径）：`.cursor/rules/*.mdc` 528 个源稿里
// 78 有 frontmatter / 450 没有；`.cursor/skills/**` 1292 个里 1198 有 / 94 没有。
// 缺失者按裁定**不动**（批量补 = 528 × 8 投影写盘面，且 description 无 CLI 证据；
// 反向删那 78 个会改 alwaysApply / globs 的注入语义）。这里只守住「写了就必须合法」，
// 因为宿主按这些键决定规则注不注入：`alwaysApply: "yes"` 会被当真值以外的东西丢掉，
// 未知键静默忽略，空 `description` 让 .pi 侧又自动补一份 → 全都只在运行时才暴露。
// 只查源稿：各投影与源稿逐字节哈希相等，已由上面的 hash 检查钉住。
const RULE_FM_KEYS = new Set(["description", "globs", "alwaysApply", "status"]);
// status 是本仓自用的档内标记（实测 9 个 .mdc 写 `status: ready`），不是宿主键。
const SKILL_FM_KEYS = new Set([
  "name",
  "description",
  "platform",
  "version",
  "dependencies",
  "mappings",
  // 2026-09-20 用户裁定：本件除 mappings 基线外还含另一套映射的对照列 ⇒ 扁平加 mappings_alt。
  // 只能扁平：嵌套 YAML 会被 catalog.ts 的 parseFrontmatterMap（扁平 /^([\w-]+):\s*(.*)$/）整行丢掉。
  // 它与正文披露块/对照行的一致性由 assert-skill-mappings-key.mjs 钉，这里不放宽任何判定。
  "mappings_alt",
  "docsTool",
  "platforms",
  "mcVersions",
  "communityDocId",
]);

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { kind: "none" };
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return { kind: "unclosed" };
  const entries = [];
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (kv) entries.push({ key: kv[1], raw: kv[2].trim(), inline: true });
    else if (/^\s+-\s+\S/.test(line)) entries.push({ key: null, raw: line.trim(), inline: false });
  }
  return { kind: "ok", entries, block: m[1] };
}

/** 顶层键值：块式数组（`globs:` 后面跟 `  - xxx`）也算作该键的非内联值。 */
function frontmatterMap(entries) {
  const map = new Map();
  let last = null;
  for (const e of entries) {
    if (e.inline) {
      map.set(e.key, { raw: e.raw, blockItems: [] });
      last = e.key;
    } else if (last) {
      map.get(last).blockItems.push(e.raw);
    }
  }
  return map;
}

let fmRulesChecked = 0;
let fmSkillsChecked = 0;

function checkFrontmatter(relPath, text, keysAllowed, classLabel) {
  const parsed = parseFrontmatter(text);
  if (parsed.kind === "none") return;
  if (parsed.kind === "unclosed") {
    failures.push(`frontmatter ${classLabel}: ${relPath} 以 --- 开头但没有闭合的 ---（整块会被当正文）`);
    return;
  }
  if (classLabel === "rule") fmRulesChecked++;
  else fmSkillsChecked++;
  const map = frontmatterMap(parsed.entries);
  for (const [key, val] of map) {
    if (!keysAllowed.has(key)) {
      failures.push(
        `frontmatter ${classLabel}: ${relPath} 未知键 \`${key}:\`（白名单 = ${[...keysAllowed].join("/")}；宿主忽略未知键，写了等于没写）`,
      );
    }
    if (val.blockItems.length && !/^\[\]$/.test(val.raw) && val.raw !== "") {
      failures.push(`frontmatter ${classLabel}: ${relPath} 键 \`${key}:\` 同时有内联值和块式列表项`);
    }
  }
  const desc = map.get("description");
  if (!desc || (desc.raw === "" && !desc.blockItems.length)) {
    failures.push(
      `frontmatter ${classLabel}: ${relPath} 有 frontmatter 但 \`description\` 为空（.pi 侧会自动补一份标题当描述，源稿该自己写清）`,
    );
  }
  if (classLabel === "skill") {
    const name = map.get("name");
    if (!name || name.raw === "") {
      failures.push(`frontmatter skill: ${relPath} \`name:\` 为空（技能名以目录为准时，frontmatter 别写空值）`);
    }
    return;
  }
  const apply = map.get("alwaysApply");
  if (!apply) {
    failures.push(`frontmatter rule: ${relPath} 有 frontmatter 但缺 \`alwaysApply:\`（缺省即「不总是注入」，与不写 frontmatter 行为不同）`);
  } else if (apply.raw !== "true" && apply.raw !== "false") {
    failures.push(
      `frontmatter rule: ${relPath} \`alwaysApply: ${apply.raw}\` 不是布尔字面量 true/false（YAML 会把 yes/no/on/off 当字符串，宿主按布尔解析 → 静默失效）`,
    );
  }
  const globs = map.get("globs");
  if (globs && globs.raw !== "" && !/^\[.*\]$/.test(globs.raw) && !globs.blockItems.length) {
    failures.push(`frontmatter rule: ${relPath} \`globs:\` 既不是数组也不是空值：${globs.raw}`);
  }
  const status = map.get("status");
  if (status && status.raw !== "ready" && status.raw !== "draft") {
    failures.push(`frontmatter rule: ${relPath} \`status: ${status.raw}\` 不在 ready/draft（该值与 pack.meta.json 的拒载开关同词，别造第三种）`);
  }
}

for (const pack of listVersionDirs()) {
  const rulesDir = join(pack.base, ".cursor", "rules");
  for (const name of readdirSync(rulesDir).filter((x) => x.endsWith(".mdc"))) {
    const abs = join(rulesDir, name);
    checkFrontmatter(relative(repoRoot, abs), readFileSync(abs, "utf8"), RULE_FM_KEYS, "rule");
  }
  const skillsDir = join(pack.base, ".cursor", "skills");
  if (!existsSync(skillsDir)) continue;
  for (const entry of readdirSync(skillsDir)) {
    const inDir = join(skillsDir, entry, "SKILL.md");
    const flat = join(skillsDir, entry);
    if (existsSync(inDir)) {
      checkFrontmatter(relative(repoRoot, inDir), readFileSync(inDir, "utf8"), SKILL_FM_KEYS, "skill");
    } else if (statSync(flat).isFile() && entry.endsWith(".md")) {
      checkFrontmatter(relative(repoRoot, flat), readFileSync(flat, "utf8"), SKILL_FM_KEYS, "skill");
    }
  }
}

// L14 复发病灶（R47 同形）：flat `.md` 面**又**没人排目标 = 采集器被改回 `continue` / 该面被搬走。
// 只在「目录型有人在比、flat 一件都没排」时红 ⇒ 仓库真没有 flat 源稿的那天它不会假红（那两面都 0）。
if (flatSkillSources === 0 && dirSkillSources > 0) {
  failures.push(
    `FLAT-SKILL-NOT-COLLECTED: 目录型 SKILL.md 在比 ${dirSkillSources} 件，而 flat \`.cursor/skills/<name>.md\` 排到 sha 比对的 = 0 件 ` +
      "⇒ 采集器这一面又断了（L14 的病复发；判据在 checkMirrorGroup 没问题，洞在喂它的循环）",
  );
}

// 采集器地板（R47 同形，与 --selftest 的 FLOOR 例共用）：一棵档都没扫 / 一次镜像比对都没发生
// = repoRoot 指偏或平台树被搬走，**不是**「零漂移」。
failures.push(...collectorFloor({ packs: packsScanned, compared: mirrorHashChecked }));

if (failures.length) {
  console.error(`assert-skill-mirrors: ${failures.length} mismatch(es)`);
  for (const f of failures.slice(0, 40)) console.error(`  ${f}`);
  if (failures.length > 40) console.error(`  … +${failures.length - 40} more`);
  process.exit(1);
}
console.log(
  `assert-skill-mirrors: ok (扫档=${packsScanned} 镜像比对目标=${mirrorHashChecked} · L14 flat .md 面已进比对：源稿=${flatSkillSources} 件／排给它=${flatSkillTargets} 个镜像目标（目录型=${dirSkillSources} 件）· 实测 AGENTS 漂移 ${agentsDrift.size} 档 / 台账 ${KNOWN_AGENTS_DRIFT.size} 档，只准缩短 · frontmatter 合法性已查 ${fmRulesChecked} 篇规则 + ${fmSkillsChecked} 个技能正文 · ` +
    `R47 复数 agents 孤儿腿：扫候选目录=${pluralOrphanScanned} 平台=${PLURAL_ORPHAN_PLATS.length} · ` +
    `单数 agent/ 面扫 ${singularAgentScanned} 组合／孤儿 ${singularAgentOrphans} 个 · 拒=${failures.length})`,
);
