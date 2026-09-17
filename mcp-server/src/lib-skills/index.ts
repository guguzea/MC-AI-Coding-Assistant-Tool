/**
 * resolve_lib_skills —— knowledge/libs §3.6 解析（与 scripts/resolve-lib-skills.mjs **同一 core**）。
 *
 * 同一 core 的实现方式：spawn **同一份脚本**（不复制解析逻辑；CLI 仓库线 `lib resolve` 也转发它）。
 * 本模块只做三件事：① 参数校验；② 输出归一（仓库相对路径）；③ versions.json 真值提示
 * （该库若带结构化版本真值，path 旁给出 `versionsJson` —— 用户侧"跳过版本标记"的硬拦提示）。
 * 只读：不改任何文件；不返回 skill 正文（AI 仍直接读源稿 —— 文件即用）。
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as z from "zod";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..", ".."); // dist/lib-skills → mcp-server → 仓库根
const SCRIPT = path.join(REPO_ROOT, "scripts", "resolve-lib-skills.mjs");

const PLATFORMS = new Set(["forge", "fabric", "quilt", "neoforge", "bedrock"]);

export const resolveLibSkillsSchema = z.object({
  platform: z
    .string()
    .describe("平台：forge | fabric | quilt | neoforge | bedrock"),
  mcVersion: z
    .string()
    .describe("精确 MC 版本（如 1.21.1 / 26.1.2）；bedrock 可传 stable。禁止用邻版顶替"),
});

/** 工具描述单一来源（registerTool 与静态 schema 表共用 —— test-cli 有 description drift 门） */
export const RESOLVE_LIB_SKILLS_DESCRIPTION =
  "按平台 + 精确 MC 版本解析 knowledge/libs 库 skill 源稿（§3.6：组映射 + frontmatter platforms/mcVersions 过滤），" +
  "返回 {skillId, path, modIds, platforms[, versionsJson]}（path 为仓库相对路径）。" +
  "与 CLI `lib resolve` 同一 core（同一份脚本，不复制逻辑）。" +
  "【边界】只解析、不返回正文 —— AI 仍直接读源稿文件（文件即用）；" +
  "带 versionsJson 的库（当前 mc-cloth-config）写依赖坐标前必须读该文件对应 MC 版本的 slot（coord/state/basis），state != active 一律不采纳。";

export interface LibSkillHit {
  skillId: string;
  /** 仓库相对 POSIX 路径（如 knowledge/libs/fabric-only/mc-cloth-config/SKILL.md） */
  path: string;
  modIds: string[];
  platforms: string[];
  /** 该库若带 versions.json（结构化版本真值），给出其仓库相对路径 —— 写坐标前先读它 */
  versionsJson?: string;
}

export interface ResolveLibSkillsOutput {
  ok: boolean;
  platform: string;
  mcVersion: string;
  count: number;
  skills: LibSkillHit[];
  error?: string;
}

export function resolveLibSkills(args: { platform?: unknown; mcVersion?: unknown }): ResolveLibSkillsOutput {
  const platform = String(args.platform ?? "").trim();
  const mcVersion = String(args.mcVersion ?? "").trim();
  const bad = (error: string): ResolveLibSkillsOutput => ({ ok: false, platform, mcVersion, count: 0, skills: [], error });
  if (!platform) return bad("platform 必填（forge | fabric | quilt | neoforge | bedrock）");
  if (!PLATFORMS.has(platform)) return bad(`未知平台：${platform}（应为 forge | fabric | quilt | neoforge | bedrock）`);
  if (!mcVersion) return bad("mcVersion 必填（精确 MC 版本，如 1.21.1 / 26.1.2；bedrock 可传 stable）");
  if (!fs.existsSync(SCRIPT)) return bad(`解析脚本不存在：${SCRIPT}（CLI/MCP 需在仓库内运行）`);
  let raw = "";
  try {
    raw = execFileSync(process.execPath, [SCRIPT, "--platform", platform, "--version", mcVersion], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      windowsHide: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return bad(`解析执行失败：${msg.slice(0, 300)}`);
  }
  let arr: Array<Omit<LibSkillHit, "versionsJson">> = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("not array");
    arr = parsed as Array<Omit<LibSkillHit, "versionsJson">>;
  } catch {
    return bad("解析输出不是 JSON 数组");
  }
  const skills: LibSkillHit[] = arr.map((s) => {
    const abs = String(s.path ?? "");
    const dir = path.dirname(abs);
    const rel = path.relative(REPO_ROOT, dir).replace(/\\/g, "/");
    const hit: LibSkillHit = { ...s, path: `${rel}/SKILL.md` };
    if (fs.existsSync(path.join(dir, "versions.json"))) hit.versionsJson = `${rel}/versions.json`;
    return hit;
  });
  return { ok: true, platform, mcVersion, count: skills.length, skills };
}
