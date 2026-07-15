/**
 * Restrict port_project write targets to an allowlisted project root.
 *
 * Writes require:
 *   MC_SKILL_ALLOW_WRITE=1
 *   MC_SKILL_PROJECT_ROOT=<absolute allowlist root>
 *
 * Defense against symlink/Junction escape:
 *   Never rely on lstatSync().isSymbolicLink() (Windows Junctions often report false).
 *   Always realpathSync.native the parent directory of the write target, then
 *   prefix-match against the allowlist realpath (case-insensitive on win32).
 *   realpath the dirname only — the target file may not exist yet (ENOENT-safe).
 */

import { existsSync, realpathSync, statSync } from "fs";
import { dirname, isAbsolute, join, resolve, sep } from "path";

export class ProjectPathError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "WRITE_DISABLED"
      | "PROJECT_ROOT_REQUIRED"
      | "PATH_OUTSIDE_ALLOWLIST"
      | "PATH_NOT_FOUND"
      | "PARENT_DIR_MISSING",
  ) {
    super(message);
    this.name = "ProjectPathError";
  }
}

/** Prefer native realpath (resolves Windows Junctions); fall back to realpathSync. */
export function nativeReal(p: string): string {
  const native = (realpathSync as typeof realpathSync & { native?: (path: string) => string }).native;
  if (typeof native === "function") {
    return native(p);
  }
  return realpathSync(p);
}

/** Compare already-resolved real paths; case-insensitive on Windows. */
export function isInsideReal(childReal: string, parentReal: string): boolean {
  let c = childReal;
  let p = parentReal;
  if (process.platform === "win32") {
    c = c.toLowerCase();
    p = p.toLowerCase();
  }
  if (c === p) return true;
  const prefix = p.endsWith(sep) ? p : p + sep;
  return c.startsWith(prefix);
}

function resolveAllowRoot(): string {
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

  if (!isAbsolute(allowRoot.trim())) {
    throw new ProjectPathError(
      "MC_SKILL_PROJECT_ROOT 必须是绝对路径（不允许相对路径，以免随进程 cwd 漂移）。",
      "PROJECT_ROOT_REQUIRED",
    );
  }

  const root = resolve(allowRoot.trim());
  if (!existsSync(root)) {
    throw new ProjectPathError(
      `MC_SKILL_PROJECT_ROOT 不存在：${root}`,
      "PATH_NOT_FOUND",
    );
  }

  return nativeReal(root);
}

/**
 * Validate that a write target is inside the allowlist.
 * realpath is applied to dirname(target) only — the file itself may not exist yet.
 * Parent directory must already exist (or be creatable only after ancestors are checked).
 */
export function assertWritablePath(target: string, allowRootReal?: string): void {
  const absTarget = resolve(target);
  const realRoot = allowRootReal ?? resolveAllowRoot();
  const dir = dirname(absTarget);

  if (!existsSync(dir)) {
    throw new ProjectPathError(
      `写入目标的父目录不存在：${dir}（请先创建位于沙箱内的父目录）`,
      "PARENT_DIR_MISSING",
    );
  }

  let realDir: string;
  try {
    realDir = nativeReal(dir);
  } catch (err) {
    throw new ProjectPathError(
      `无法解析父目录真实路径：${(err as Error).message}`,
      "PATH_NOT_FOUND",
    );
  }

  if (!isInsideReal(realDir, realRoot)) {
    throw new ProjectPathError(
      `写入路径超出允许范围：${absTarget}（父目录 ${realDir} 不在 MC_SKILL_PROJECT_ROOT=${realRoot} 内）`,
      "PATH_OUTSIDE_ALLOWLIST",
    );
  }
}

/**
 * Assert a directory may be created: check the nearest existing ancestor is inside the sandbox.
 * Then mkdirSync(..., { recursive: true }) is safe w.r.t. Junction escape of existing links.
 */
export function assertCreatableDir(dirPath: string, allowRootReal?: string): void {
  const absDir = resolve(dirPath);
  const realRoot = allowRootReal ?? resolveAllowRoot();

  let cursor = absDir;
  while (!existsSync(cursor)) {
    const parent = dirname(cursor);
    if (parent === cursor) {
      throw new ProjectPathError(
        `无法找到可校验的祖先目录：${absDir}`,
        "PARENT_DIR_MISSING",
      );
    }
    cursor = parent;
  }

  let realAncestor: string;
  try {
    realAncestor = nativeReal(cursor);
  } catch (err) {
    throw new ProjectPathError(
      `无法解析祖先目录真实路径：${(err as Error).message}`,
      "PATH_NOT_FOUND",
    );
  }

  if (!isInsideReal(realAncestor, realRoot)) {
    throw new ProjectPathError(
      `创建目录超出允许范围：${absDir}（祖先 ${realAncestor} 不在沙箱内）`,
      "PATH_OUTSIDE_ALLOWLIST",
    );
  }
}

/**
 * Resolve and validate a project path for read (always) or write (gated).
 */
export function resolveProjectPath(projectPath: string, forWrite: boolean): string {
  const resolved = resolve(isAbsolute(projectPath) ? projectPath : resolve(process.cwd(), projectPath));

  if (!forWrite) {
    return resolved;
  }

  const realRoot = resolveAllowRoot();

  // Ensure project root resolves inside allowlist (Junction-aware via existing path).
  if (existsSync(resolved)) {
    const st = statSync(resolved);
    if (st.isDirectory()) {
      // Validate via a virtual file under the project root (dirname realpath of child = project realpath).
      assertWritablePath(join(resolved, ".write-check"), realRoot);
    } else {
      assertWritablePath(resolved, realRoot);
    }
  } else {
    assertCreatableDir(resolved, realRoot);
  }

  return resolved;
}

/** Return the resolved absolute allowlist root (native realpath), or throw. */
export function getAllowRootReal(): string {
  return resolveAllowRoot();
}
