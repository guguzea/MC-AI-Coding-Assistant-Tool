/**
 * Assert .cursor/skills|rules 与各 IDE 镜像规范化后哈希一致。
 * 规范化与 scripts/sync-skills.ps1 对齐（路径引用、BOM、换行）。
 *
 * 末尾另有 pack-tree 不变式（同一份「源稿 ↔ 派生树」契约）：
 *   - neoforge/ 根档 = legacy trap：只留 .cursor 源稿，7 套投影树必须为空。
 *   - 任何档不得有 `.cursor/agents/`（复数）——sync 只写 `.cursor/agent/`（单数）。
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
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
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

  // GAP-L14（**只登记现状，不是覆盖**）：`.cursor/skills/<name>.md` 这种 flat 源稿面在真跑的采集器里
  // 被 `continue` 掉 ⇒ 排给它的镜像目标数 = 0 ⇒ 漂移 1 字节也照样绿。判据本身没这个洞（上面六记投毒
  // 都红），洞在采集器。补 sha 比对 = CONTRIBUTING.md §未排期清单 `L14`（as-of 2026-09-24 实测该面 380 份）。
  const flatDrift = checkMirrorGroup({ targets: [], read: () => null, label: (r) => r });
  console.log(
    `  ⚠ GAP-L14 flat .md 源稿面：采集器排给它 ${flatDrift.length === 0 ? "0 个镜像目标" : "?"} ⇒ 该面漂移**判不了**（现状，非本例判红；补判据是 L14 的活）`,
  );

  if (bad) {
    console.log(`assert-skill-mirrors --selftest: ${bad}/${cases.length} 例不符 ⇒ 判据已退化`);
    process.exit(1);
  }
  console.log(
    `assert-skill-mirrors --selftest: ok · ${cases.length} 例全中（${cases.filter((c) => c.wantFail).length} 投毒必红 + 2 基线绿 + 不判对照绿；内存夹具，未写盘）+ 1 记 GAP-L14 现状登记`,
  );
}

if (process.argv.includes("--selftest")) {
  runSelftest();
  process.exit(0);
}

const failures = [];
let packsScanned = 0;
let mirrorHashChecked = 0;

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
    for (const skillName of readdirSync(skillsDir)) {
      const srcPath = join(skillsDir, skillName, "SKILL.md");
      const flat = join(skillsDir, skillName);
      if (existsSync(srcPath)) {
        cursorSkillNames.add(skillName);
      } else if (statSync(flat).isFile() && skillName.endsWith(".md")) {
        cursorSkillNames.add(skillName.replace(/\.md$/, ""));
        continue;
      } else {
        continue;
      }
      const normalized = normalizePathRefs(readFileSync(srcPath, "utf8"), pack.rel);
      // ⚠️ flat `.md` 源稿面（`.cursor/skills/<name>.md`）在上面 `continue` 掉了：那里排给它
      // **0 个镜像目标** ⇒ 该面漂移 1 字节也照样绿。洞在采集器不在判据（判据侧的反证见本文件
      // `--selftest` 的 GAP-L14 现状登记）；补 sha 比对 = CONTRIBUTING.md §未排期清单 `L14`。
      const skillTargets = SKILL_MIRROR_RELS(skillName).map((rel) => ({ rel, wantText: normalized }));
      mirrorHashChecked += skillTargets.length;
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
  `assert-skill-mirrors: ok (扫档=${packsScanned} 镜像比对目标=${mirrorHashChecked} · 实测 AGENTS 漂移 ${agentsDrift.size} 档 / 台账 ${KNOWN_AGENTS_DRIFT.size} 档，只准缩短 · frontmatter 合法性已查 ${fmRulesChecked} 篇规则 + ${fmSkillsChecked} 个技能正文 · ` +
    `R47 复数 agents 孤儿腿：扫候选目录=${pluralOrphanScanned} 平台=${PLURAL_ORPHAN_PLATS.length} 拒=${failures.length})`,
);
