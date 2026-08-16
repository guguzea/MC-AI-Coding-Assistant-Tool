import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { resolveRepoRoot } from "../utils/path.js";

export const PACK_PLATFORMS = [
  "forge",
  "fabric",
  "neoforge",
  "quilt",
  "liteloader",
  "rift",
  "modloader",
  "bedrock",
] as const;

export type PackPlatform = (typeof PACK_PLATFORMS)[number];

export type PackInfo = {
  platform: PackPlatform;
  minecraftVersion: string;
  packDir: string;
  agentsPath: string;
  trap?: boolean;
  trapNote?: string;
};

function isVersionDirName(name: string): boolean {
  return /^\d+(\.\d+)*$/.test(name);
}

export function knowledgeVersion(platform: string, mcVersion: string): string {
  const p = platform.toLowerCase();
  const v = mcVersion.trim();
  if (p === "neoforge" && v.startsWith("26.1")) return "26.1";
  return v;
}

export function listPacks(repoRoot = resolveRepoRoot()): { packs: PackInfo[]; traps: PackInfo[] } {
  const packs: PackInfo[] = [];
  const traps: PackInfo[] = [];
  for (const platform of PACK_PLATFORMS) {
    const dir = join(repoRoot, platform);
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
    if (platform === "bedrock") {
      const agents = join(dir, "AGENTS.md");
      if (existsSync(agents)) {
        packs.push({ platform, minecraftVersion: "*", packDir: dir, agentsPath: agents });
      }
      continue;
    }
    const rootAgents = join(dir, "AGENTS.md");
    if (existsSync(rootAgents) && platform === "neoforge") {
      traps.push({
        platform,
        minecraftVersion: "",
        packDir: dir,
        agentsPath: rootAgents,
        trap: true,
        trapNote: "neoforge/AGENTS.md 是分发说明，禁止当版本档激活",
      });
    }
    let names: string[] = [];
    try {
      names = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!isVersionDirName(name)) continue;
      const packDir = join(dir, name);
      try {
        if (!statSync(packDir).isDirectory()) continue;
      } catch {
        continue;
      }
      const agentsPath = join(packDir, "AGENTS.md");
      if (!existsSync(agentsPath)) continue;
      packs.push({ platform, minecraftVersion: name, packDir, agentsPath });
    }
  }
  return { packs, traps };
}

export function fabricRulesOverlay(
  minecraftVersion: string,
  repoRoot = resolveRepoRoot(),
): {
  wanted: string;
  status: "ok" | "missing" | "version_mismatch";
  note: string;
  fabricDir?: string;
} {
  const wanted = `fabric/${minecraftVersion}`;
  const fabricDir = join(repoRoot, "fabric", minecraftVersion);
  if (!existsSync(fabricDir) || !existsSync(join(fabricDir, "AGENTS.md"))) {
    return {
      wanted,
      status: "missing",
      note: `没有 ${wanted} 规则树。仍返回 Quilt 本档；改口 search_fabric_docs，不要用邻版 Fabric。`,
    };
  }
  const rulesDir = join(fabricDir, ".cursor", "rules");
  if (!existsSync(rulesDir)) {
    return {
      wanted,
      status: "missing",
      note: `${wanted} 无 .cursor/rules。仍返回 Quilt 本档；改口 search_fabric_docs。`,
    };
  }
  return { wanted, status: "ok", note: `02–10 可读 ${wanted}/.cursor/rules`, fabricDir };
}

export function findPack(
  platform: string,
  minecraftVersion: string,
  repoRoot = resolveRepoRoot(),
): PackInfo | null {
  const p = platform.trim().toLowerCase() as PackPlatform;
  if (p === "bedrock") {
    const packDir = join(repoRoot, "bedrock");
    const agentsPath = join(packDir, "AGENTS.md");
    if (existsSync(agentsPath)) {
      return { platform: "bedrock", minecraftVersion: "*", packDir, agentsPath };
    }
    return null;
  }
  const ver = knowledgeVersion(p, minecraftVersion);
  const packDir = join(repoRoot, p, ver);
  const agentsPath = join(packDir, "AGENTS.md");
  if (existsSync(agentsPath)) {
    return { platform: p, minecraftVersion: ver, packDir, agentsPath };
  }
  return null;
}

export function listRuleFiles(packDir: string): Array<{ id: string; fileName: string; abs: string }> {
  const dir = join(packDir, ".cursor", "rules");
  if (!existsSync(dir)) return [];
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  const out: Array<{ id: string; fileName: string; abs: string }> = [];
  for (const name of names.sort()) {
    const m = name.match(/^(\d{2})-/);
    if (!m) continue;
    if (!name.endsWith(".mdc") && !name.endsWith(".md")) continue;
    out.push({ id: m[1], fileName: name, abs: join(dir, name) });
  }
  return out;
}

export type SkillIndexEntry = { name: string; description: string; relPosix: string };

function frontmatterDescription(text: string): { name?: string; description: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { description: text.split("\n").find((l) => l.startsWith("# "))?.replace(/^#\s+/, "") ?? "" };
  const name = m[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = m[1].match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
  return { name, description };
}

export function listSkillIndex(packDir: string, repoRoot = resolveRepoRoot()): SkillIndexEntry[] {
  const out: SkillIndexEntry[] = [];
  const seen = new Set<string>();
  const roots = [
    join(packDir, ".cursor", "skills"),
    join(packDir, ".agents", "skills"),
  ];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    let names: string[] = [];
    try {
      names = readdirSync(root);
    } catch {
      continue;
    }
    for (const name of names) {
      const skillMd = join(root, name, "SKILL.md");
      const flat = join(root, name);
      let abs = "";
      if (existsSync(skillMd)) abs = skillMd;
      else if (name.endsWith(".md") && existsSync(flat) && statSync(flat).isFile()) abs = flat;
      if (!abs) continue;
      const rel = relative(repoRoot, abs).replace(/\\/g, "/");
      const body = readFileSync(abs, "utf8");
      const fm = frontmatterDescription(body);
      const skillName = fm.name || name.replace(/\.md$/, "");
      if (seen.has(skillName)) continue;
      seen.add(skillName);
      out.push({ name: skillName, description: fm.description, relPosix: rel });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function readText(abs: string, maxChars = 120_000): string {
  const t = readFileSync(abs, "utf8");
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars)}\n\n…[截断 ${t.length - maxChars} 字符]`;
}
