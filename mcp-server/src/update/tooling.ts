/**
 * Tooling (git + npm) update path.
 */

import { execFile } from "child_process";
import { promisify } from "util";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";
import { resolveRepoRoot } from "../utils/path.js";
import { assertWritablePath, getAllowRootReal, nativeReal, isInsideReal } from "../utils/project-sandbox.js";
import { defaultUpdateRepo } from "./github.js";

/**
 * D-7：异步 execFile（promisify）替换 execFileSync。
 * execFileSync 会同步阻塞整个 Node 事件循环：MCP 进程在 `git fetch/merge/stash` 与
 * `npm ci && npm run build`（最长 600s）期间对所有其它请求停止响应，且无法取消。
 * 超时值一律保持原样（30s / 120s / 600s）。
 * 附注：promisify(execFile) 的重载不接受 stdio 选项（实测 TS2769），故原 stdio 配置被去掉；
 * 但实测 async execFile 并不会自行关闭子进程 stdin，因此统一走下面的 execCapture，
 * 由它显式 end 掉 stdin，才与旧 execFileSync 的 stdio[0]="ignore" 等价。
 */
const execFileAsync = promisify(execFile);

/**
 * 统一入口：异步执行并取回 stdout（utf8）。
 * 关键点 pending.child.stdin.end()：实测 async execFile 会把子进程 stdin 留在打开状态
 * （探针脚本 1.3s 后仍报 STDIN_STILL_OPEN，显式 end 后 0.1s 内即 STDIN_ENDED），
 * 而旧 execFileSync 传的是 stdio[0]="ignore"（= 已关闭）。补上 end() 才等价，
 * 否则需要交互输入的 git 命令（凭据提示 / editor）会把整个 timeout 烧光。
 */
async function execCapture(file: string, args: string[], cwd: string, timeoutMs: number): Promise<string> {
  const pending = execFileAsync(file, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
    timeout: timeoutMs,
  });
  pending.child?.stdin?.end();
  const { stdout } = await pending;
  return stdout;
}

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

export async function gitDescribe(repoRoot?: string): Promise<string | undefined> {
  try {
    const stdout = await execCapture(
      "git",
      ["describe", "--tags", "--always"],
      repoRoot ?? resolveRepoRoot(),
      30_000,
    );
    return stdout.trim();
  } catch {
    return undefined;
  }
}

async function git(repoRoot: string, args: string[]): Promise<string> {
  const stdout = await execCapture("git", args, repoRoot, 120_000);
  return stdout.trim();
}

/** Normalize GitHub remote URL → owner/repo */
export function normalizeGithubRepoUrl(url: string): string | null {
  const u = url.trim().replace(/\.git$/i, "");
  const https = u.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  if (https) return `${https[1]}/${https[2]}`;
  return null;
}

export async function findMatchingRemote(
  repoRoot: string,
  expectedRepo = defaultUpdateRepo(),
): Promise<{ ok: true; remote: string } | { ok: false; action: ActionEnvelope }> {
  const forced = process.env.MC_SKILL_UPDATE_REMOTE?.trim();
  if (forced) {
    try {
      await git(repoRoot, ["remote", "get-url", forced]);
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
    remotes = (await git(repoRoot, ["remote"])).split(/\r?\n/).filter(Boolean);
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
      const url = await git(repoRoot, ["remote", "get-url", name]);
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

export async function isGitDirty(repoRoot: string): Promise<boolean> {
  try {
    const out = await git(repoRoot, ["status", "--porcelain"]);
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

export async function applyToolingUpdate(opts: ToolingApplyOpts): Promise<ToolingApplyResult> {
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

  const match = await findMatchingRemote(repoRoot);
  if (!match.ok) return { ok: false, steps, action: match.action };
  const remote = match.remote;
  steps.push(`git fetch --tags ${remote}`);
  steps.push(`git merge --ff-only ${opts.tag}`);

  // tag 来自 GitHub release.tag_name 或用户输入；拒绝 `-` 开头与非法字符，防被 git 当选项
  if (!/^v?\d[\w.\-]*$/.test(opts.tag)) {
    return {
      ok: false,
      steps,
      remote,
      action: actionable(
        "UPDATE_INVALID_TAG",
        `tag 形如选项或含非法字符，已拒绝对它执行 git 操作: ${opts.tag}`,
        ["tag 应形如 V1.0.4 / v1.0.4-data-refresh", "核对 Release 的 tag_name"],
        ["mc_skill_update"],
      ),
    };
  }

  const dirty = await isGitDirty(repoRoot);
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

  // opts.runGit 保持同步测试接缝（注入方仍返回 string），真实路径改用异步 git runner
  const injected = opts.runGit;
  const run: (args: string[]) => Promise<string> = injected
    ? async (args: string[]) => injected(args)
    : (args: string[]) => git(repoRoot, args);
  let stashed = false;
  let merged = false;
  try {
    await run(["fetch", "--tags", remote]);
    if (dirty && opts.allowDirty && opts.stashDirty) {
      steps.unshift(`git stash push -u -m mc-skill-update`);
      await run(["stash", "push", "-u", "-m", "mc-skill-update"]);
      stashed = true;
    }
    try {
      await run(["merge", "--ff-only", opts.tag]);
      merged = true;
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
        await run(["stash", "pop"]);
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
      try {
        const npm = process.platform === "win32" ? "npm.cmd" : "npm";
        const npmCwd = join(repoRoot, "mcp-server");
        await execCapture(npm, ["ci"], npmCwd, 600_000);
        await execCapture(npm, ["run", "build"], npmCwd, 600_000);
      } catch (err) {
        return {
          ok: false,
          steps,
          remote,
          restartRequired: true,
          action: actionable(
            "TOOLING_MERGED_BUILD_FAILED",
            `merge 已完成但 npm build 失败: ${(err as Error).message}`,
            ["源码已在新 tag，dist 可能仍旧；重载 MCP 前先修好 build", "手动 npm ci && npm run build"],
            ["mc_skill_update"],
          ),
        };
      }
    }

    return { ok: true, steps, remote, restartRequired: true };
  } catch (err) {
    return {
      ok: false,
      steps,
      remote,
      restartRequired: merged,
      action: actionable(
        merged ? "TOOLING_MERGED_BUILD_FAILED" : "TOOLING_UPDATE_FAILED",
        (err as Error).message,
        ["查看 git/npm 输出", "手动 pull 后 npm ci && npm run build"],
        ["mc_skill_update"],
      ),
    };
  }
}
