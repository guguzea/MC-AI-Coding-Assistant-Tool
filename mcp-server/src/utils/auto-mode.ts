/**
 * 工程沙箱内全自动模式（`MC_SKILL_AUTO_MODE=1`）单一真相源。
 *
 * 设计契约（opt-in，未设或非 `"1"` 时全部行为严格保持现行人在环）：
 *   1. 严格开关：`process.env.MC_SKILL_AUTO_MODE === "1"` 才激活，对话口头指令不解锁代码门控。
 *   2. 工程写盘仍受 `MC_SKILL_PROJECT_ROOT` 硬边界与知识库禁写保护约束（绝不越出项目根、绝不改写 MC_skill 仓自身）。
 *   3. 游玩自测仍必须显式配置 `MC_SKILL_PLAYTEST_ROOT`（不自动回落到 `MC_SKILL_PROJECT_ROOT`）；
 *      在授权 playtest 根内免 `MC_SKILL_PLAYTEST_ALLOW` / `confirmed` / `playtest_intent` 禁列限制。
 *   4. 永久严格例外（不随全自动放开）：`mc_skill_update` 自更新确认、`download_official_mdk` SHA256 pin 校验、
 *      正式 `.minecraft` 实例、以及外部发布上传。
 */
import { existsSync, readFileSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { isInsideReal, nativeReal, resolveRepoRoot } from "./path.js";

export const AUTO_MODE_ENV = "MC_SKILL_AUTO_MODE";

export function isAutoModeEnabled(): boolean {
  return process.env.MC_SKILL_AUTO_MODE === "1";
}

/**
 * 轻量知识库自检（不依赖 platform-pack/catalog.ts，避免与 project-sandbox 循环引用）：
 * 命中仓库根本身或其任一子路径，或含本助手 mcp-server/package.json 标识即判为知识库树。
 */
export function isInsideKnowledgeRepoTree(targetPath: string): boolean {
  try {
    const abs = resolve(targetPath);
    const pkgPath = join(abs, "mcp-server", "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { name?: string; description?: string };
        const name = String(pkg.name ?? "");
        const desc = String(pkg.description ?? "");
        if (name === "mc-ai-coding-assistant-tool" || /MC AI Coding Assistant/i.test(desc)) {
          return true;
        }
      } catch {
        /* ignore malformed package.json */
      }
    }
    const repoReal = nativeReal(resolveRepoRoot());
    const targetReal = existsSync(abs) ? nativeReal(abs) : abs;
    return isInsideReal(targetReal, repoReal);
  } catch {
    return false;
  }
}

export type PlaytestAuthRootResult =
  | { ok: true; root: string; viaAutoMode: boolean }
  | { ok: false; code: string; message: string };

/**
 * 统一解析游玩自测授权根（供 inspect_playtest_evidence / inspect_playtest_multi /
 * playtest_bridge / playtest_intent 共用，避免四处复制漂移）。
 */
export function resolvePlaytestAuthRoot(): PlaytestAuthRootResult {
  const auto = isAutoModeEnabled();
  const explicitAllow = process.env.MC_SKILL_PLAYTEST_ALLOW === "1";
  if (!explicitAllow && !auto) {
    return {
      ok: false,
      code: "PLAYTEST_DISABLED",
      message:
        "游玩自测未授权。设置 MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>（一次授权一路径，见根 AGENTS.md）。",
    };
  }
  const envRoot = (process.env.MC_SKILL_PLAYTEST_ROOT || "").trim();
  if (!envRoot) {
    return { ok: false, code: "AUTHORIZATION_REQUIRED", message: "缺 MC_SKILL_PLAYTEST_ROOT（绝对路径的授权根）。" };
  }
  if (!isAbsolute(envRoot) || !existsSync(envRoot)) {
    return {
      ok: false,
      code: "AUTHORIZATION_REQUIRED",
      message: `MC_SKILL_PLAYTEST_ROOT 必须是存在的绝对路径：${envRoot}`,
    };
  }
  return { ok: true, root: nativeReal(resolve(envRoot)), viaAutoMode: !explicitAllow && auto };
}

export interface AutoModeStatus {
  enabled: boolean;
  envVar: typeof AUTO_MODE_ENV;
  projectWriteArmed: boolean;
  projectRootReason?: string;
  playtestArmed: boolean;
  playtestRootReason?: string;
  strictExceptions: readonly string[];
  unlockedInPlaytestRoot: readonly string[];
}

export function getAutoModeStatus(): AutoModeStatus {
  const enabled = isAutoModeEnabled();
  const projRaw = (process.env.MC_SKILL_PROJECT_ROOT || "").trim();
  let projectWriteArmed = false;
  let projectRootReason: string | undefined;
  if (enabled) {
    if (!projRaw) {
      projectRootReason = "未设置 MC_SKILL_PROJECT_ROOT（工程沙箱写盘仍被拒）";
    } else if (!isAbsolute(projRaw) || !existsSync(projRaw)) {
      projectRootReason = `MC_SKILL_PROJECT_ROOT 不是存在的绝对路径：${projRaw}`;
    } else if (isInsideKnowledgeRepoTree(projRaw)) {
      projectRootReason = "MC_SKILL_PROJECT_ROOT 指向 MC_skill 知识库目录树（沙箱全自动禁止修改知识库自身）";
    } else {
      projectWriteArmed = true;
    }
  }

  const playRaw = (process.env.MC_SKILL_PLAYTEST_ROOT || "").trim();
  let playtestArmed = false;
  let playtestRootReason: string | undefined;
  if (enabled) {
    if (!playRaw) {
      playtestRootReason = "未单独设置 MC_SKILL_PLAYTEST_ROOT（游玩自测工具保持未授权，不会自动回落到 MC_SKILL_PROJECT_ROOT）";
    } else if (!isAbsolute(playRaw) || !existsSync(playRaw)) {
      playtestRootReason = `MC_SKILL_PLAYTEST_ROOT 不是存在的绝对路径：${playRaw}`;
    } else {
      playtestArmed = true;
    }
  }

  return {
    enabled,
    envVar: AUTO_MODE_ENV,
    projectWriteArmed,
    ...(projectRootReason ? { projectRootReason } : {}),
    playtestArmed,
    ...(playtestRootReason ? { playtestRootReason } : {}),
    strictExceptions: ["mc_skill_update", "mdk_sha256_pin", "formal_minecraft_instance", "external_publish_upload"],
    unlockedInPlaytestRoot: ["eula_txt_in_playtest_root", "playtest_intent_kill_tnt_fill"],
  };
}
