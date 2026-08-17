import { existsSync, statSync } from "fs";
import { isAbsolute, resolve } from "path";
import { detectLoader } from "../diagnostics/index.js";
import { actionable } from "../utils/actionable.js";
import { loadModProject } from "../utils/project-files.js";
import { docsToolForPlatform } from "../loader-api/keys.js";
import { findPack, knowledgeVersion, listPacks } from "./catalog.js";
import { detectMinecraftVersion } from "../utils/minecraft-version.js";

export type DetectModProjectArgs = {
  projectPath?: string;
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

export function detectModProject(args: DetectModProjectArgs = {}) {
  const resolved = resolveDetectRoot(args.projectPath);
  if (!resolved.ok) return { ok: false, action: resolved.action };
  const loaded = loadModProject(resolved.root);
  const loader = detectLoader(
    loaded.buildGradle ?? "",
    loaded.modsToml,
    loaded.fabricModJson,
    loaded.neoModsToml,
    {
      quiltModJson: loaded.quiltModJson,
      litemodJson: loaded.litemodJson,
      riftmodJson: loaded.riftmodJson,
      addonManifest: loaded.addonManifest,
    },
  );
  const minecraftVersion = parseMcVersion(loaded.gradleProperties, loaded.buildGradle);
  const platform = loader === "liteloader_forge" ? "liteloader" : loader;
  const pack =
    platform !== "unknown" && minecraftVersion
      ? findPack(platform, minecraftVersion)
      : platform === "bedrock"
        ? findPack("bedrock", "*")
        : null;

  if (!pack) {
    const kv = minecraftVersion && platform !== "unknown" ? knowledgeVersion(platform, minecraftVersion) : "";
    return {
      ok: true,
      projectRoot: resolved.root,
      resolvedFrom: resolved.from,
      loader,
      platform,
      minecraftVersion,
      knowledgeVersion: kv || undefined,
      packFound: false,
      action: actionable(
        "PACK_NOT_FOUND",
        platform === "unknown"
          ? "未能判定加载器，无法激活平台包。"
          : `没有 ${platform} ${minecraftVersion ?? "?"} 的规则树（禁止读邻档 00–10）。`,
        [
          `改用 ${docsToolForPlatform(platform === "unknown" ? "forge" : platform)}`,
          "或 activate_platform_pack action=list 查看已建档版本",
        ],
        [docsToolForPlatform(platform === "unknown" ? "forge" : platform)],
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
