import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { actionable } from "../utils/actionable.js";
import { docsToolForPlatform } from "../loader-api/keys.js";
import {
  fabricRulesOverlay,
  findPack,
  listRuleFiles,
  listSkillIndex,
  readText,
} from "./catalog.js";

export type SessionArgs = {
  platform: string;
  minecraftVersion: string;
  topics?: string[];
  includeAllRules?: boolean;
};

function topicIds(topics?: string[], includeAll?: boolean): string[] {
  if (includeAll) return ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
  if (topics && topics.length) {
    return topics.map((t) => {
      const m = String(t).match(/(\d{2})/);
      return m ? m[1] : String(t).padStart(2, "0").slice(0, 2);
    });
  }
  return ["00", "01", "09"];
}

function verifiedApiNotes(packDir: string): Array<{ path: string; excerpt: string }> {
  const common = join(packDir, "knowledge", "common");
  if (!existsSync(common)) return [];
  let names: string[] = [];
  try {
    names = readdirSync(common);
  } catch {
    return [];
  }
  return names
    .filter((n) => /verified-api/i.test(n) && n.endsWith(".md"))
    .map((n) => {
      const abs = join(common, n);
      const text = readText(abs, 1200);
      return { path: abs.replace(/\\/g, "/"), excerpt: text.split("\n").slice(0, 20).join("\n") };
    });
}

export function sessionPlatformPack(args: SessionArgs) {
  const platform = String(args.platform ?? "").trim().toLowerCase();
  const minecraftVersion = String(args.minecraftVersion ?? "").trim();
  if (!platform || !minecraftVersion) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", "session 需要 platform 与 minecraftVersion（不依赖项目根）。", [
        "传入 platform + minecraftVersion",
        "activate_platform_pack action=list 可查看已建档",
      ]),
    };
  }
  const pack = findPack(platform, minecraftVersion);
  if (!pack) {
    return {
      ok: false,
      action: actionable(
        "PACK_NOT_FOUND",
        `没有 ${platform} ${minecraftVersion} 的规则树，禁止读邻档 00–10。`,
        [`改用 ${docsToolForPlatform(platform)}`],
        [docsToolForPlatform(platform)],
      ),
    };
  }

  const includeAll = args.includeAllRules === true;
  const ids = topicIds(args.topics, includeAll);
  const rules = listRuleFiles(pack.packDir);
  const overlay =
    pack.platform === "quilt" ? fabricRulesOverlay(pack.minecraftVersion) : undefined;

  const ruleBodies: Array<{ id: string; fileName: string; source: string; text: string }> = [];
  for (const id of ids) {
    const local = rules.find((r) => r.id === id);
    if (local) {
      ruleBodies.push({
        id,
        fileName: local.fileName,
        source: pack.packDir.replace(/\\/g, "/"),
        text: readText(local.abs),
      });
      continue;
    }
    if (overlay?.status === "ok" && overlay.fabricDir && Number(id) >= 2) {
      const fabricRules = listRuleFiles(overlay.fabricDir);
      const fr = fabricRules.find((r) => r.id === id);
      if (fr) {
        ruleBodies.push({
          id,
          fileName: fr.fileName,
          source: overlay.wanted,
          text: readText(fr.abs),
        });
      }
    }
  }

  const skills = listSkillIndex(pack.packDir);
  return {
    ok: true,
    dest: "session",
    platform: pack.platform,
    minecraftVersion: pack.minecraftVersion,
    packDir: pack.packDir.replace(/\\/g, "/"),
    agents: readText(pack.agentsPath),
    rules: ruleBodies,
    ruleIndex: rules.map((r) => ({ id: r.id, fileName: r.fileName })),
    overlay,
    verifiedApi: verifiedApiNotes(pack.packDir),
    skills,
    libSkillsNote:
      "库 Skill 不复制：按平台读 knowledge/libs/<forge-only|fabric-only|neo-only|all-platforms>/mc-<name>/SKILL.md；不确定先读 mc-lib-catalog。",
    includeAllRules: includeAll,
    contextWarning: includeAll
      ? "includeAllRules=true 会灌入 00–10 全文，上下文体积大；默认只要 00+01+09。"
      : undefined,
    ideLoadNotes:
      "各 IDE 扫不到知识库里嵌套的 forge/<ver>/.cursor（打开的是用户模组工程）。会话包只服务当前对话；要工程内常驻请 activate_platform_pack action=write（hosts 必填）。不要把规则拷进 MC_skill 仓库根。",
  };
}
