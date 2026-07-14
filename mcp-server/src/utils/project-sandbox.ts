/**
 * Restrict port_project write targets to an allowlisted project root.
 *
 * Writes require:
 *   MC_SKILL_ALLOW_WRITE=1
 *   MC_SKILL_PROJECT_ROOT=<absolute allowlist root>
 * and projectPath must resolve inside that root (realpath-aware).
 */

import { existsSync, realpathSync } from "fs";
import { isAbsolute, resolve, sep } from "path";

export class ProjectPathError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "WRITE_DISABLED"
      | "PROJECT_ROOT_REQUIRED"
      | "PATH_OUTSIDE_ALLOWLIST"
      | "PATH_NOT_FOUND",
  ) {
    super(message);
    this.name = "ProjectPathError";
  }
}

function realOrResolve(p: string): string {
  try {
    if (existsSync(p)) return realpathSync(p);
  } catch {
    /* fall through */
  }
  return resolve(p);
}

function isInside(child: string, parent: string): boolean {
  const c = realOrResolve(child);
  const p = realOrResolve(parent);
  if (c === p) return true;
  const prefix = p.endsWith(sep) ? p : p + sep;
  return c.startsWith(prefix);
}

/**
 * Resolve and validate a project path for read (always) or write (gated).
 * @param projectPath user-supplied path
 * @param forWrite whether the caller will mutate the filesystem
 */
export function resolveProjectPath(projectPath: string, forWrite: boolean): string {
  const resolved = resolve(isAbsolute(projectPath) ? projectPath : resolve(process.cwd(), projectPath));

  if (!forWrite) {
    return resolved;
  }

  if (process.env.MC_SKILL_ALLOW_WRITE !== "1") {
    throw new ProjectPathError(
      "写操作已禁用。设置环境变量 MC_SKILL_ALLOW_WRITE=1 并配置 MC_SKILL_PROJECT_ROOT 后，" +
        "再以 dryRun=false 且 confirmed=true 执行。",
      "WRITE_DISABLED",
    );
  }

  const allowRoot = process.env.MC_SKILL_PROJECT_ROOT;
  if (!allowRoot || !allowRoot.trim()) {
    throw new ProjectPathError(
      "写操作需要 MC_SKILL_PROJECT_ROOT（允许写入的项目根目录绝对路径）。",
      "PROJECT_ROOT_REQUIRED",
    );
  }

  const root = resolve(allowRoot);
  if (!isInside(resolved, root)) {
    throw new ProjectPathError(
      `projectPath 超出允许范围：${resolved} 不在 MC_SKILL_PROJECT_ROOT=${root} 内`,
      "PATH_OUTSIDE_ALLOWLIST",
    );
  }

  return resolved;
}
