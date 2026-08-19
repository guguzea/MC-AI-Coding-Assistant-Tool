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

export type PackActivationStatus = "ready" | "draft";

export type PackInfo = {
  platform: PackPlatform;
  minecraftVersion: string;
  packDir: string;
  agentsPath: string;
  trap?: boolean;
  trapNote?: string;
  status?: PackActivationStatus;
};

function isVersionDirName(name: string): boolean {
  return /^\d+(\.\d+)*$/.test(name);
}

export function readPackStatus(packDir: string): PackActivationStatus {
  const metaPath = join(packDir, "pack.meta.json");
  if (existsSync(metaPath)) {
    try {
      const j = JSON.parse(readFileSync(metaPath, "utf8")) as Record<string, unknown>;
      const s = String(j.status ?? j["pack-status"] ?? "").toLowerCase();
      if (s === "draft") return "draft";
    } catch {
      /* ignore */
    }
  }
  return "ready";
}

export function knowledgeVersion(platform: string, mcVersion: string): string {
  const p = platform.toLowerCase();
  const v = mcVersion.trim();
  if (p === "neoforge" && v.startsWith("26.1")) return "26.1";
  return v;
}

export function listPacks(repoRoot = resolveRepoRoot()): { packs: PackInfo[]; traps: PackInfo[]; drafts: PackInfo[] } {
  const packs: PackInfo[] = [];
  const traps: PackInfo[] = [];
  const drafts: PackInfo[] = [];
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
      const info: PackInfo = {
        platform,
        minecraftVersion: name,
        packDir,
        agentsPath,
        status: readPackStatus(packDir),
      };
      if (info.status === "draft") drafts.push(info);
      else packs.push(info);
    }
  }
  return { packs, traps, drafts };
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
  let ruleNames: string[] = [];
  try {
    ruleNames = readdirSync(rulesDir);
  } catch {
    ruleNames = [];
  }
  const overlayRules = ruleNames.filter((n) => /^(0[2-9]|10)-/.test(n));
  if (!overlayRules.length) {
    return {
      wanted,
      status: "version_mismatch",
      note: `${wanted} 有 AGENTS 但没有 02–10 规则。仍返回 Quilt 本档；改口 search_fabric_docs，不要用邻版 Fabric。`,
      fabricDir,
    };
  }
  return { wanted, status: "ok", note: `02–10 可读 ${wanted}/.cursor/rules`, fabricDir };
}

export function inspectPack(
  platform: string,
  minecraftVersion: string,
  repoRoot = resolveRepoRoot(),
): { pack: PackInfo; status: PackActivationStatus } | null {
  const p = platform.trim().toLowerCase() as PackPlatform;
  if (p === "bedrock") {
    const packDir = join(repoRoot, "bedrock");
    const agentsPath = join(packDir, "AGENTS.md");
    if (existsSync(agentsPath)) {
      const status = readPackStatus(packDir);
      return { pack: { platform: "bedrock", minecraftVersion: "*", packDir, agentsPath, status }, status };
    }
    return null;
  }
  const ver = knowledgeVersion(p, minecraftVersion);
  const packDir = join(repoRoot, p, ver);
  const agentsPath = join(packDir, "AGENTS.md");
  if (!existsSync(agentsPath)) return null;
  const status = readPackStatus(packDir);
  return { pack: { platform: p, minecraftVersion: ver, packDir, agentsPath, status }, status };
}

export function findPack(
  platform: string,
  minecraftVersion: string,
  repoRoot = resolveRepoRoot(),
): PackInfo | null {
  const inspected = inspectPack(platform, minecraftVersion, repoRoot);
  if (!inspected || inspected.status !== "ready") return null;
  return inspected.pack;
}

/** 精确包不存在时列出同系列已建档版本（1.21 → 1.21.1/1.21.3/…）。禁止静默折叠。 */
export function listSameSeriesCandidates(
  platform: string,
  minecraftVersion: string,
  repoRoot = resolveRepoRoot(),
): string[] {
  const p = platform.trim().toLowerCase();
  const v = minecraftVersion.trim();
  if (!p || !v || p === "unknown") return [];
  const { packs } = listPacks(repoRoot);
  const prefix = v.endsWith(".") ? v : `${v}.`;
  return packs
    .filter((x) => x.platform === p)
    .map((x) => x.minecraftVersion)
    .filter((pv) => pv === v || pv.startsWith(prefix))
    .sort();
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

export type SkillIndexEntry = {
  name: string;
  description: string;
  relPosix: string;
  absPath: string;
  source?: string;
  mappingNote?: string;
};

export function toPosixAbs(abs: string): string {
  return abs.replace(/\\/g, "/");
}

/** 与 scripts/resolve-lib-skills.mjs coversVersion 同口径。 */
export function cmpMcVersions(a: string, b: string): number {
  const pa = String(a).split(".").map((s) => parseInt(s, 10) || 0);
  const pb = String(b).split(".").map((s) => parseInt(s, 10) || 0);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

export function coversMcVersion(token: string, mcVersion: string): boolean {
  const t = String(token).trim();
  if (!t || t === "*") return true;
  let m = t.match(/^(\d[\d.]*)\+$/);
  if (m) return cmpMcVersions(mcVersion, m[1]) >= 0;
  m = t.match(/^≤(\d[\d.]*)$/);
  if (m) return cmpMcVersions(mcVersion, m[1]) <= 0;
  m = t.match(/^(\d[\d.]*)-(\d[\d.]*)$/);
  if (m) return cmpMcVersions(mcVersion, m[1]) >= 0 && cmpMcVersions(mcVersion, m[2]) <= 0;
  return t === mcVersion || mcVersion.startsWith(`${t}.`);
}

function parseYamlList(value: string): string[] {
  const v = String(value).trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter((s) => s !== "");
  }
  const bare = v.replace(/^["']|["']$/g, "");
  return bare === "" ? [] : [bare];
}

function parseFrontmatterMap(text: string): Record<string, string> {
  const meta: Record<string, string> = {};
  if (!text.startsWith("---")) return meta;
  const end = text.indexOf("\n---", 3);
  if (end < 0) return meta;
  for (const line of text.slice(3, end).split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    meta[m[1]] = m[2].trim();
  }
  return meta;
}

const LIB_GROUPS: Record<string, string[]> = {
  forge: ["forge-only", "all-platforms"],
  fabric: ["fabric-only", "all-platforms"],
  quilt: ["fabric-only", "all-platforms"],
  neoforge: ["neo-only", "all-platforms"],
  bedrock: ["bedrock-only"],
};

/** 库 Skill 索引：组映射 + platforms 二次确认 + mcVersions 窗口。absPath 为知识库绝对路径。 */
export function listLibSkillIndex(
  platform: string,
  mcVersion: string,
  repoRoot = resolveRepoRoot(),
): SkillIndexEntry[] {
  const p = platform.trim().toLowerCase();
  const ver = mcVersion.trim();
  const groups = LIB_GROUPS[p];
  if (!groups || !ver) return [];
  const libsRoot = join(repoRoot, "knowledge", "libs");
  const out: SkillIndexEntry[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    const groupDir = join(libsRoot, group);
    if (!existsSync(groupDir) || !statSync(groupDir).isDirectory()) continue;
    let names: string[] = [];
    try {
      names = readdirSync(groupDir);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!/^mc-/.test(name)) continue;
      const skillFile = join(groupDir, name, "SKILL.md");
      if (!existsSync(skillFile) || !statSync(skillFile).isFile()) continue;
      const body = readFileSync(skillFile, "utf8");
      const meta = parseFrontmatterMap(body);
      const platforms = parseYamlList(meta.platforms ?? "");
      if (!platforms.includes(p)) continue;
      const versionTokens = [
        ...parseYamlList(meta.mcVersions ?? ""),
        ...parseYamlList(meta.minecraftVersions ?? ""),
      ];
      if (versionTokens.length > 0 && !versionTokens.some((t) => coversMcVersion(t, ver))) continue;
      const fm = frontmatterDescription(body);
      const skillName = fm.name || name;
      if (seen.has(skillName)) continue;
      seen.add(skillName);
      const rel = relative(repoRoot, skillFile).replace(/\\/g, "/");
      out.push({
        name: skillName,
        description: fm.description,
        relPosix: rel,
        absPath: toPosixAbs(skillFile),
      });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

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
      out.push({
        name: skillName,
        description: fm.description,
        relPosix: rel,
        absPath: toPosixAbs(abs),
      });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function mappingNoteForFabricSkill(fabricVer: string): string {
  return (
    `本 Skill 正文来自 Fabric ${fabricVer} 规则包，映射以该 Fabric 档为准（多为 Yarn named；26.1.2 为官方名）。` +
    `请与当前 Quilt 工程的 mappings 对齐后再抄代码。禁止把 class_ / method_ / field_ 中间名当 API。`
  );
}

export function mergeQuiltFabricSkills(
  quiltDir: string,
  fabricDir: string,
  fabricVer: string,
  repoRoot = resolveRepoRoot(),
): SkillIndexEntry[] {
  const quilt = listSkillIndex(quiltDir, repoRoot);
  const fabric = listSkillIndex(fabricDir, repoRoot);
  const byName = new Map<string, SkillIndexEntry>();
  const note = mappingNoteForFabricSkill(fabricVer);
  const source = `fabric/${fabricVer}`;
  for (const s of fabric) {
    byName.set(s.name, { ...s, source, mappingNote: note });
  }
  for (const s of quilt) {
    byName.set(s.name, s);
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function readText(abs: string, maxChars = 120_000): string {
  const t = readFileSync(abs, "utf8");
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars)}\n\n…[截断 ${t.length - maxChars} 字符]`;
}
