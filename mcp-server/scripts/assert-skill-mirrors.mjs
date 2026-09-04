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

const failures = [];

for (const pack of listVersionDirs()) {
  const rulesDir = join(pack.base, ".cursor", "rules");
  const rules = readdirSync(rulesDir).filter((n) => n.endsWith(".mdc"));
  for (const name of rules) {
    const src = readFileSync(join(rulesDir, name), "utf8");
    const srcHash = sha(src);
    for (const [host, sub, ext] of RULE_MIRRORS) {
      const dest = join(pack.base, host, sub, name.replace(/\.mdc$/, ext) === name ? name : name);
      const destPath = join(pack.base, host, sub, name);
      if (!existsSync(destPath)) {
        failures.push(`missing ${relative(repoRoot, destPath)}`);
        continue;
      }
      if (sha(readFileSync(destPath, "utf8")) !== srcHash) {
        failures.push(`hash mismatch ${relative(repoRoot, destPath)}`);
      }
    }
    const piName = name.replace(/\.mdc$/, ".md");
    const piPath = join(pack.base, ".pi", "rules", piName);
    if (!existsSync(piPath)) {
      failures.push(`missing ${relative(repoRoot, piPath)}`);
    } else if (sha(readFileSync(piPath, "utf8")) !== sha(piRuleText(src, piName))) {
      failures.push(`hash mismatch ${relative(repoRoot, piPath)}`);
    }
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
      const want = sha(normalized);
      const skillMirrors = [
        join(pack.base, ".continue", "skills", skillName, "SKILL.md"),
        join(pack.base, ".opencode", "skills", skillName, "SKILL.md"),
        join(pack.base, ".agents", "skills", skillName, "SKILL.md"),
        join(pack.base, ".zcode", "skills", skillName, "SKILL.md"),
        join(pack.base, ".pi", "skills", skillName, "SKILL.md"),
        join(pack.base, ".trae", "skills", `${skillName}.md`),
        join(pack.base, ".claude", "commands", `${skillName.replace(/^mc-/, "")}.md`),
      ];
      for (const dest of skillMirrors) {
        if (!existsSync(dest)) {
          failures.push(`missing ${relative(repoRoot, dest)}`);
          continue;
        }
        if (sha(readFileSync(dest, "utf8")) !== want) {
          failures.push(`hash mismatch ${relative(repoRoot, dest)}`);
        }
      }
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
for (const plat of PLATS) {
  const platDir = join(repoRoot, plat);
  if (!existsSync(platDir)) continue;
  const candidates = [{ base: platDir, rel: plat }];
  for (const name of readdirSync(platDir)) {
    const dir = join(platDir, name);
    if (statSync(dir).isDirectory()) candidates.push({ base: dir, rel: `${plat}/${name}` });
  }
  for (const { base, rel } of candidates) {
    const plural = join(base, ".cursor", "agents");
    if (existsSync(plural) && statSync(plural).isDirectory()) {
      failures.push(
        `orphan ${rel}/.cursor/agents/ (plural is never a sync target — keep .cursor/agent/default.md only)`,
      );
    }
  }
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

if (failures.length) {
  console.error(`assert-skill-mirrors: ${failures.length} mismatch(es)`);
  for (const f of failures.slice(0, 40)) console.error(`  ${f}`);
  if (failures.length > 40) console.error(`  … +${failures.length - 40} more`);
  process.exit(1);
}
console.log(
  `assert-skill-mirrors: ok (实测 AGENTS 漂移 ${agentsDrift.size} 档 / 台账 ${KNOWN_AGENTS_DRIFT.size} 档，只准缩短)`,
);
