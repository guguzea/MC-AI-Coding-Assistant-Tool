#!/usr/bin/env node
/**
 * Propagate Wave D skills from forge/1.20.1 → other forge / fabric / neoforge.
 * Then run: pwsh scripts/sync-skills.ps1 -All
 *
 * 库模组 Skill（mc-config / mc-geckolib / mc-curios / mc-patchouli 等）
 * 不再经本脚本传播：改走 knowledge/libs 源稿即用（不落盘，见 plan §3.6 解析规则）。
 * **禁止**把 Wave D Java Skill 无差别传播到 bedrock / modloader / quilt / liteloader / rift。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const WAVE_D = [
  "mc-renderer",
  "mc-model",
  "mc-worldgen",
  "mc-structure",
  "mc-advancement",
  "mc-loottable",
  "mc-datapack",
  "mc-resourcepack",
  "mc-gametest",
  "mc-enchantment",
  "mc-potion",
  "mc-effect",
  "mc-ai",
  "mc-energy",
  "mc-multiblock",
  "mc-command",
  "mc-villager",
  "mc-weather",
  "mc-dimension",
];

const FORGE_VERSIONS = [
  "1.12.2",
  "1.13.2",
  "1.14.4",
  "1.15.2",
  "1.16.5",
  "1.17.1",
  "1.18.2",
  "1.19.4",
  "1.20.4",
];

const FABRIC_VERSIONS = [
  "1.14.4",
  "1.16.5",
  "1.17.1",
  "1.18.2",
  "1.19.4",
  "1.20.1",
  "1.20.4",
  "1.21.1",
  "1.21.3",
  "1.21.11",
];

const NEOFORGE_VERSION = "1.20.4";

function readUtf8(p) {
  let s = fs.readFileSync(p, "utf8");
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  return s;
}

function writeUtf8(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text, "utf8");
}

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error("missing frontmatter");
  return { fm: m[1], body: m[2] };
}

function setFmField(fm, key, value) {
  const re = new RegExp(`^${key}:\\s*.*$`, "m");
  if (re.test(fm)) return fm.replace(re, `${key}: ${value}`);
  return `${fm}\n${key}: ${value}`;
}

function adaptBody(body, { platform, version, knowledgeHint, docsTool }) {
  let out = body;
  out = out.replaceAll("forge/1.20.1/", `${knowledgeHint}/`);
  out = out.replaceAll("`forge/1.20.1/", `\`${knowledgeHint}/`);
  out = out.replace(/search_forge_docs/g, docsTool);
  // Fabric curios note
  if (platform === "fabric") {
    out = out.replace(
      /Curios 饰品槽/g,
      "Trinkets / Curios 风格饰品槽（Fabric 优先 Trinkets）"
    );
  }
  if (platform === "neoforge") {
    out = out.replace(/ForgeConfigSpec/g, "ModConfigSpec / NeoForge config");
  }
  // Keep skeleton banner but clarify platform
  out = out.replace(
    /> Wave D 技能骨架。详细规则见对应 `\.cursor\/rules\/` 与 MCP `[^`]+` \/ 专题工具。/,
    `> Wave D 技能骨架（${platform} ${version}）。详细规则见对应 \`.cursor/rules/\` 与 MCP \`${docsTool}\` / 专题工具。`
  );
  return out;
}

function buildSkill(srcText, { platform, version, mappings, knowledgeHint, docsTool }) {
  const { fm: fm0, body: body0 } = splitFrontmatter(srcText);
  let fm = fm0;
  fm = setFmField(fm, "platform", platform);
  fm = setFmField(fm, "version", `"${version}"`);
  fm = setFmField(fm, "mappings", mappings);
  // Soft-adapt description for fabric cloth/curios
  if (platform === "fabric") {
    fm = fm.replace(
      /description:\s*ForgeConfigSpec、Cloth Config/,
      "description: Cloth Config 配置屏、Mod Menu"
    );
    fm = fm.replace(
      /description:\s*Curios 饰品槽/,
      "description: Trinkets/Curios 风格饰品槽"
    );
  }
  const body = adaptBody(body0, { platform, version, knowledgeHint, docsTool });
  return `---\n${fm}\n---\n${body}`;
}

function ensureForgeSkillsDir(ver) {
  const dir = path.join(ROOT, "forge", ver, ".cursor", "skills");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function main() {
  const srcRoot = path.join(ROOT, "forge", "1.20.1", ".cursor", "skills");
  let written = 0;

  for (const name of WAVE_D) {
    const srcPath = path.join(srcRoot, name, "SKILL.md");
    if (!fs.existsSync(srcPath)) {
      console.warn("MISSING source", name);
      continue;
    }
    const srcText = readUtf8(srcPath);

    for (const ver of FORGE_VERSIONS) {
      const out = buildSkill(srcText, {
        platform: "forge",
        version: ver,
        mappings: "mcp",
        knowledgeHint: `forge/${ver}`,
        docsTool: "search_forge_docs",
      });
      const dest = path.join(ensureForgeSkillsDir(ver), name, "SKILL.md");
      writeUtf8(dest, out);
      written++;
    }

    for (const ver of FABRIC_VERSIONS) {
      const out = buildSkill(srcText, {
        platform: "fabric",
        version: ver,
        mappings: "yarn",
        knowledgeHint: `fabric/${ver}`,
        docsTool: "search_fabric_docs",
      });
      const dest = path.join(ROOT, "fabric", ver, ".cursor", "skills", `${name}.md`);
      writeUtf8(dest, out);
      written++;
    }

    {
      const out = buildSkill(srcText, {
        platform: "neoforge",
        version: NEOFORGE_VERSION,
        mappings: "mcp",
        knowledgeHint: "neoforge",
        docsTool: "search_neoforge_docs",
      });
      const dest = path.join(
        ROOT,
        "neoforge",
        ".cursor",
        "skills",
        name,
        "SKILL.md"
      );
      writeUtf8(dest, out);
      written++;
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        waveD: WAVE_D.length,
        written,
        forgeVersions: FORGE_VERSIONS.length,
        fabricVersions: FABRIC_VERSIONS.length,
        neoforge: true,
      },
      null,
      2
    )
  );
}

main();
