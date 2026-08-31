/**
 * Assert .cursor/skills|rules 与各 IDE 镜像规范化后哈希一致。
 * 规范化与 scripts/sync-skills.ps1 对齐（路径引用、BOM、换行）。
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

if (failures.length) {
  console.error(`assert-skill-mirrors: ${failures.length} mismatch(es)`);
  for (const f of failures.slice(0, 40)) console.error(`  ${f}`);
  if (failures.length > 40) console.error(`  … +${failures.length - 40} more`);
  process.exit(1);
}
console.log("assert-skill-mirrors: ok");
