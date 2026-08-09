/**
 * Tooling (git + npm) update path.
 */

import { execFileSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";
import { resolveRepoRoot } from "../utils/path.js";
import { assertWritablePath, getAllowRootReal, nativeReal, isInsideReal } from "../utils/project-sandbox.js";
import { defaultUpdateRepo } from "./github.js";

export function readLocalToolingVersion(repoRoot?: string): string {
  const root = repoRoot ?? resolveRepoRoot();
  const pkg = join(root, "mcp-server", "package.json");
  try {
    const j = JSON.parse(readFileSync(pkg, "utf8")) as { version?: string };
    return j.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export function gitDescribe(repoRoot?: string): string | undefined {
  try {
    return execFileSync("git", ["describe", "--tags", "--always"], {
      cwd: repoRoot ?? resolveRepoRoot(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    }).trim();
  } catch {
    return undefined;
  }
}

function git(repoRoot: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }).trim();
}

/** Normalize GitHub remote URL → owner/repo */
export function normalizeGithubRepoUrl(url: string): string | null {
  const u = url.trim().replace(/\.git$/i, "");
  const https = u.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  if (https) return `${https[1]}/${https[2]}`;
  return null;
}

export function findMatchingRemote(
  repoRoot: string,
  expectedRepo = defaultUpdateRepo(),
): { ok: true; remote: string } | { ok: false; action: ActionEnvelope } {
  const forced = process.env.MC_SKILL_UPDATE_REMOTE?.trim();
  if (forced) {
    try {
      git(repoRoot, ["remote", "get-url", forced]);
      return { ok: true, remote: forced };
    } catch {
      return {
        ok: false,
        action: actionable(
          "GIT_REMOTE_MISSING",
          `指定远程不存在: ${forced}`,
          ["检查 MC_SKILL_UPDATE_REMOTE", "或清空该变量以自动扫描"],
          ["mc_skill_update"],
        ),
      };
    }
  }

  let remotes: string[] = [];
  try {
    remotes = git(repoRoot, ["remote"]).split(/\r?\n/).filter(Boolean);
  } catch {
    return {
      ok: false,
      action: actionable("GIT_NOT_REPO", "当前安装不是 git 仓库", ["使用 git clone 安装本仓库后再自动更新"], [
        "mc_skill_update",
      ]),
    };
  }

  const matches: string[] = [];
  for (const name of remotes) {
    try {
      const url = git(repoRoot, ["remote", "get-url", name]);
      const norm = normalizeGithubRepoUrl(url);
      if (norm && norm.toLowerCase() === expectedRepo.toLowerCase()) matches.push(name);
    } catch {
      /* skip */
    }
  }

  if (matches.length === 0) {
    return {
      ok: false,
      action: actionable(
        "GIT_REMOTE_MISMATCH",
        `未找到匹配 ${expectedRepo} 的 git remote`,
        [
          `添加 remote：git remote add origin https://github.com/${expectedRepo}.git`,
          "或设置 MC_SKILL_UPDATE_REPO / MC_SKILL_UPDATE_REMOTE",
        ],
        ["mc_skill_update"],
      ),
    };
  }
  if (matches.includes("origin")) return { ok: true, remote: "origin" };
  return { ok: true, remote: matches[0] };
}

export function isGitDirty(repoRoot: string): boolean {
  try {
    const out = git(repoRoot, ["status", "--porcelain"]);
    return out.length > 0;
  } catch {
    return true;
  }
}

export interface ToolingApplyOpts {
  tag: string;
  dryRun: boolean;
  allowDirty?: boolean;
  stashDirty?: boolean;
  repoRoot?: string;
  /** Skip npm ci/build (tests). */
  skipBuild?: boolean;
  /** Injected git runner for tests. */
  runGit?: (args: string[]) => string;
}

export interface ToolingApplyResult {
  ok: boolean;
  steps: string[];
  remote?: string;
  restartRequired?: boolean;
  action?: ActionEnvelope;
}

export function applyToolingUpdate(opts: ToolingApplyOpts): ToolingApplyResult {
  const repoRoot = opts.repoRoot ?? resolveRepoRoot();
  const steps: string[] = [];

  if (!existsSync(join(repoRoot, ".git"))) {
    return {
      ok: false,
      steps,
      action: actionable("GIT_NOT_REPO", "不是 git 仓库，无法自动更新 tooling", [
        "请 git clone 官方仓库后使用",
      ], ["mc_skill_update"]),
    };
  }

  if (!opts.dryRun) {
    try {
      const allow = getAllowRootReal();
      const realRepo = nativeReal(repoRoot);
      if (!isInsideReal(realRepo, allow) && realRepo !== allow) {
        return {
          ok: false,
          steps,
          action: actionable(
            "PATH_OUTSIDE_ALLOWLIST",
            "仓库根不在 MC_SKILL_PROJECT_ROOT 内",
            ["将 MC_SKILL_PROJECT_ROOT 设为 MC_skill 仓库根绝对路径"],
            ["mc_skill_update"],
          ),
        };
      }
      assertWritablePath(join(repoRoot, "mcp-server", "package.json"), allow);
    } catch (err) {
      return {
        ok: false,
        steps,
        action: actionable(
          (err as { code?: string }).code ?? "WRITE_DISABLED",
          (err as Error).message,
          ["设置 MC_SKILL_ALLOW_WRITE=1 与 MC_SKILL_PROJECT_ROOT=仓库根", "confirmed=true dryRun=false"],
          ["mc_skill_update"],
        ),
      };
    }
  }

  const match = findMatchingRemote(repoRoot);
  if (!match.ok) return { ok: false, steps, action: match.action };
  const remote = match.remote;
  steps.push(`git fetch --tags ${remote}`);
  steps.push(`git merge --ff-only ${opts.tag}`);

  const dirty = isGitDirty(repoRoot);
  if (dirty && !opts.allowDirty) {
    return {
      ok: false,
      steps,
      remote,
      action: actionable(
        "GIT_DIRTY",
        "工作区有未提交改动",
        ["提交或贮藏本地改动", "或 allowDirty=true（可选 stashDirty=true）"],
        ["mc_skill_update"],
      ),
    };
  }

  if (opts.dryRun) {
    if (dirty && opts.allowDirty && opts.stashDirty) {
      steps.unshift(`git stash push -u -m mc-skill-update`);
      steps.push(`git stash pop`);
    }
    steps.push(`cd mcp-server && npm ci && npm run build`);
    return { ok: true, steps, remote, restartRequired: true };
  }

  const run = opts.runGit ?? ((args: string[]) => git(repoRoot, args));
  let stashed = false;
  try {
    run(["fetch", "--tags", remote]);
    if (dirty && opts.allowDirty && opts.stashDirty) {
      steps.unshift(`git stash push -u -m mc-skill-update`);
      run(["stash", "push", "-u", "-m", "mc-skill-update"]);
      stashed = true;
    }
    try {
      run(["merge", "--ff-only", opts.tag]);
    } catch (err) {
      return {
        ok: false,
        steps,
        remote,
        action: actionable(
          "GIT_NOT_FF",
          `无法快进合并到 ${opts.tag}: ${(err as Error).message}`,
          [
            "手动处理分歧历史后重试",
            stashed ? "本地改动在 stash 中，可用 git stash pop 恢复" : "检查本地提交是否分叉",
          ],
          ["mc_skill_update"],
        ),
      };
    }
    if (stashed) {
      try {
        run(["stash", "pop"]);
      } catch (err) {
        return {
          ok: false,
          steps,
          remote,
          restartRequired: true,
          action: actionable(
            "GIT_STASH_POP_CONFLICT",
            `merge 成功但 stash pop 冲突: ${(err as Error).message}`,
            ["手动解决冲突", "stash 仍保留，勿 drop"],
            ["mc_skill_update"],
          ),
        };
      }
    }

    if (!opts.skipBuild) {
      steps.push(`cd mcp-server && npm ci && npm run build`);
      execFileSync(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["ci"],
        { cwd: join(repoRoot, "mcp-server"), stdio: "pipe", windowsHide: true },
      );
      execFileSync(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["run", "build"],
        { cwd: join(repoRoot, "mcp-server"), stdio: "pipe", windowsHide: true },
      );
    }

    return { ok: true, steps, remote, restartRequired: true };
  } catch (err) {
    return {
      ok: false,
      steps,
      remote,
      action: actionable(
        "TOOLING_UPDATE_FAILED",
        (err as Error).message,
        ["查看 git/npm 输出", "手动 pull 后 npm ci && npm run build"],
        ["mc_skill_update"],
      ),
    };
  }
}
