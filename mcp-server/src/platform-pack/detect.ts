import { existsSync, readFileSync, statSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { detectProjectLoaders, javaBlobFromFiles } from "../diagnostics/index.js";
import { actionable, ActionCodes } from "../utils/actionable.js";
import { loadModProject } from "../utils/project-files.js";
import { docsToolForPlatform } from "../loader-api/keys.js";
import {
  findPack,
  isKnowledgePackScaffold,
  isMcSkillKnowledgeRepo,
  knowledgeVersion,
  listPacks,
  listSameSeriesCandidates,
} from "./catalog.js";
import { detectMinecraftVersion, detectMinecraftVersionFromIncludedSubprojects } from "../utils/minecraft-version.js";

export type DetectModProjectArgs = {
  projectPath?: string;
};

type DetectAction = ReturnType<typeof actionable>;

export type DetectModProjectResult =
  | {
      ok: false;
      action: DetectAction;
      projectRoot?: string;
      resolvedFrom?: string;
      loader?: string;
      platform?: string;
      minecraftVersion?: string | null;
      knowledgeVersion?: string;
      packFound?: boolean;
      candidates?: string[];
      warnings?: string[];
    }
  | {
      ok: true;
      projectRoot: string;
      resolvedFrom: string;
      loader: string;
      loaders?: string[];
      multiLoader?: boolean;
      architectury?: boolean;
      platform: string;
      minecraftVersion: string | null;
      knowledgeVersion?: string;
      packFound: boolean;
      packDir?: string;
      agentsPath?: string;
      candidates?: string[];
      warnings?: string[];
      next?: string;
      action?: DetectAction;
    };

function resolveDetectRoot(projectPath?: string): { ok: true; root: string; from: string } | { ok: false; action: ReturnType<typeof actionable> } {
  const raw = (projectPath?.trim() || process.env.MC_SKILL_PROJECT_ROOT || "").trim();
  if (!raw) {
    return {
      ok: false,
      action: actionable("PROJECT_ROOT_REQUIRED", "detect 需要项目根：传入 projectPath（CLI --project）或 MC_SKILL_PROJECT_ROOT。", [
        "session 不需要项目根：activate_platform_pack action=session --platform=... --minecraftVersion=...",
      ]),
    };
  }
  if (!isAbsolute(raw)) {
    return {
      ok: false,
      action: actionable("PROJECT_ROOT_REQUIRED", "projectPath / MC_SKILL_PROJECT_ROOT 必须是绝对路径。", [
        "使用 --project <绝对路径>",
      ]),
    };
  }
  const root = resolve(raw);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return {
      ok: false,
      action: actionable("NOT_FOUND", `项目根不存在或不是目录：${root}`, ["检查路径"]),
    };
  }
  return { ok: true, root, from: projectPath?.trim() ? "projectPath" : "MC_SKILL_PROJECT_ROOT" };
}

function parseMcVersion(gradleProperties?: string, buildGradle?: string): string | null {
  const detected = detectMinecraftVersion({ gradleProperties, buildGradle });
  return detected === "unknown" ? null : detected;
}

export function detectModProject(args: DetectModProjectArgs = {}): DetectModProjectResult {
  const resolved = resolveDetectRoot(args.projectPath);
  if (!resolved.ok) return { ok: false, action: resolved.action };
  if (isMcSkillKnowledgeRepo(resolved.root) || isKnowledgePackScaffold(resolved.root)) {
    return {
      ok: false,
      projectRoot: resolved.root,
      resolvedFrom: resolved.from,
      action: actionable(
        "KNOWLEDGE_REPO_NOT_MOD",
        "这是 MC Skill 知识库根（或某版 scaffold），不是用户模组工程。session 不需要项目根。",
        [
          "activate_platform_pack action=session --platform=... --minecraftVersion=...",
          "detect / write 请把 projectPath 改成用户模组工程绝对路径",
        ],
        ["activate_platform_pack"],
      ),
    };
  }
  const loaded = loadModProject(resolved.root);
  const detected = detectProjectLoaders({
    buildGradle: loaded.buildGradle,
    modsToml: loaded.modsToml,
    fabricModJson: loaded.fabricModJson,
    neoModsToml: loaded.neoModsToml,
    extras: {
      quiltModJson: loaded.quiltModJson,
      litemodJson: loaded.litemodJson,
      riftmodJson: loaded.riftmodJson,
      addonManifest: loaded.addonManifest,
    },
    javaBlob: javaBlobFromFiles(loaded.javaFiles),
    fabricModJsons: loaded.fabricModJsons,
    quiltModJsons: loaded.quiltModJsons,
    modsTomls: loaded.modsTomls,
    neoModsTomls: loaded.neoModsTomls,
  });
  const loader = detected.primary;
  let minecraftVersion = parseMcVersion(loaded.gradleProperties, loaded.buildGradle);
  if (!minecraftVersion) {
    const settingsPath = join(resolved.root, "settings.gradle");
    if (existsSync(settingsPath)) {
      let settingsGradle = "";
      try {
        settingsGradle = readFileSync(settingsPath, "utf8");
      } catch {
        settingsGradle = "";
      }
      const nested = detectMinecraftVersionFromIncludedSubprojects({
        settingsGradle,
        readSubprojectProperties: (inc) => {
          const p = join(resolved.root, inc, "gradle.properties");
          if (!existsSync(p)) return undefined;
          try {
            return readFileSync(p, "utf8");
          } catch {
            return undefined;
          }
        },
      });
      if (nested !== "unknown") minecraftVersion = nested;
    }
  }
  const platform = loader === "liteloader_forge" ? "liteloader" : loader;
  const versionWarnings: string[] = [];
  if (minecraftVersion === "1.21") {
    versionWarnings.push("不要把 1.21 当成 1.21.1");
  }

  if (detected.multiLoader) {
    const listed = detected.loaders.join(", ");
    return {
      ok: true,
      projectRoot: resolved.root,
      resolvedFrom: resolved.from,
      loader,
      loaders: detected.loaders,
      multiLoader: true,
      architectury: detected.architectury,
      platform: "unknown",
      minecraftVersion,
      packFound: false,
      ...(versionWarnings.length ? { warnings: versionWarnings } : {}),
      action: actionable(
        ActionCodes.PICK_PLATFORM,
        `检测到多加载器${detected.architectury ? "/Architectury" : ""}：${listed}。请询问用户指定 platform，禁止静默选 Fabric 或 Forge。在用户指定前不得调用 activate_platform_pack。`,
        [
          `向用户列出 loaders[]（${listed}）并询问要用哪一个 platform`,
          "用户指定后再 activate_platform_pack action=session --platform=... --minecraftVersion=...",
        ],
      ),
    };
  }
  const pack =
    platform !== "unknown" && minecraftVersion
      ? findPack(platform, minecraftVersion)
      : platform === "bedrock"
        ? findPack("bedrock", "*")
        : null;

  if (!pack) {
    const kv = minecraftVersion && platform !== "unknown" ? knowledgeVersion(platform, minecraftVersion) : "";
    const candidates =
      minecraftVersion && platform !== "unknown"
        ? listSameSeriesCandidates(platform, minecraftVersion)
        : [];
    const ask =
      candidates.length > 0
        ? `精确包不存在。同系列已建档：${candidates.join(", ")}。请询问用户选哪一档，禁止静默当成 ${candidates[0]}。`
        : "或 activate_platform_pack action=list 查看已建档版本";
    return {
      ok: false,
      projectRoot: resolved.root,
      resolvedFrom: resolved.from,
      loader,
      platform,
      minecraftVersion,
      knowledgeVersion: kv || undefined,
      packFound: false,
      candidates: candidates.length ? candidates : undefined,
      ...(versionWarnings.length ? { warnings: versionWarnings } : {}),
      action: actionable(
        "PACK_NOT_FOUND",
        platform === "unknown"
          ? "未能判定加载器，无法激活平台包。"
          : `没有 ${platform} ${minecraftVersion ?? "?"} 的规则树（禁止读邻档 00–10）。${candidates.length ? ask : ""}`,
        platform === "unknown"
          ? [
              "向用户询问 platform，禁止默认 Forge",
              "或 activate_platform_pack action=list 查看已建档版本",
            ]
          : [
              `改用 ${docsToolForPlatform(platform)}`,
              candidates.length ? ask : "或 activate_platform_pack action=list 查看已建档版本",
            ],
        platform === "unknown" ? ["activate_platform_pack"] : [docsToolForPlatform(platform)],
      ),
    };
  }

  return {
    ok: true,
    projectRoot: resolved.root,
    resolvedFrom: resolved.from,
    loader,
    platform: pack.platform,
    minecraftVersion,
    knowledgeVersion: pack.minecraftVersion,
    packFound: true,
    packDir: pack.packDir,
    agentsPath: pack.agentsPath,
    next: "activate_platform_pack action=session（或 write，hosts 必填）",
    ...(versionWarnings.length ? { warnings: versionWarnings } : {}),
  };
}

export function listPlatformPacks() {
  const { packs, traps, drafts } = listPacks();
  return {
    packs: packs.map((p) => ({
      platform: p.platform,
      minecraftVersion: p.minecraftVersion,
      packDir: p.packDir,
    })),
    traps: traps.map((t) => ({ path: t.agentsPath, note: t.trapNote })),
    drafts: drafts.map((p) => ({
      platform: p.platform,
      minecraftVersion: p.minecraftVersion,
      packDir: p.packDir,
      status: "draft",
    })),
  };
}
