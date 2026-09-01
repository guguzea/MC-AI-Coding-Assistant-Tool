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
  /** true = 该拒绝来自 2026-08 引入的「MC_SKILL_PROJECT_ROOT 为硬边界」破坏性变更（此前 explicitRoot 可覆盖 env）。 */
  public readonly breakingChange: boolean;
  constructor(
    message: string,
    public readonly code:
      | "WRITE_DISABLED"
      | "PROJECT_ROOT_REQUIRED"
      | "PATH_OUTSIDE_ALLOWLIST"
      | "PATH_NOT_FOUND"
      | "PARENT_DIR_MISSING",
    breakingChange = false,
  ) {
    super(message);
    this.name = "ProjectPathError";
    this.breakingChange = breakingChange;
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

/**
 * 写盘 allowlist 根：MC_SKILL_PROJECT_ROOT 为硬边界（AND 口径，与 port_project/resolveAllowRoot 一致）。
 * - 设置了 MC_SKILL_PROJECT_ROOT：explicitRoot（projectPath）必须落在 env root 内，否则拒绝（破坏性变更）。
 * - 未设置 env：保持 explicitRoot 自身作为根（供平台包写入用户模组工程）。
 *   `requireEnvRoot` 会关掉这条兜底——generate_* 的 projectPath 完全由模型给，单参数即写盘等于只有一道守卫。
 * 仍要求 MC_SKILL_ALLOW_WRITE=1。
 */
export function resolveWriteAllowRoot(
  explicitRoot?: string,
  opts?: { requireEnvRoot?: boolean },
): string {
  if (process.env.MC_SKILL_ALLOW_WRITE !== "1") {
    throw new ProjectPathError(
      "写操作已禁用。设置环境变量 MC_SKILL_ALLOW_WRITE=1，并以 dryRun=false 且 confirmed=true 执行。",
      "WRITE_DISABLED",
    );
  }

  const envRoot = (process.env.MC_SKILL_PROJECT_ROOT || "").trim();
  if (!envRoot && opts?.requireEnvRoot) {
    throw new ProjectPathError(
      "该写操作要求显式设置 MC_SKILL_PROJECT_ROOT（绝对路径）作为硬边界；" +
        "只传 projectPath 不足以放行——projectPath 由调用方/模型给出，与写盘根同义时沙箱形同虚设。",
      "PROJECT_ROOT_REQUIRED",
    );
  }
  if (envRoot) {
    if (!isAbsolute(envRoot)) {
      throw new ProjectPathError(
        "MC_SKILL_PROJECT_ROOT 必须是绝对路径（不允许相对路径，以免随进程 cwd 漂移）。",
        "PROJECT_ROOT_REQUIRED",
      );
    }
    const envReal = resolve(envRoot);
    if (!existsSync(envReal)) {
      throw new ProjectPathError(`MC_SKILL_PROJECT_ROOT 不存在：${envReal}`, "PATH_NOT_FOUND");
    }
    const root = nativeReal(envReal);

    const arg = explicitRoot?.trim();
    if (arg) {
      if (!isAbsolute(arg)) {
        throw new ProjectPathError(
          "项目根必须是绝对路径（不允许相对路径，以免随进程 cwd 漂移）。",
          "PROJECT_ROOT_REQUIRED",
        );
      }
      const proj = resolve(arg);
      if (!existsSync(proj)) {
        throw new ProjectPathError(`项目根不存在：${proj}`, "PATH_NOT_FOUND");
      }
      let projReal: string;
      try {
        projReal = nativeReal(proj);
      } catch (err) {
        throw new ProjectPathError(`无法解析项目根真实路径：${(err as Error).message}`, "PATH_NOT_FOUND");
      }
      if (!isInsideReal(projReal, root)) {
        throw new ProjectPathError(
          `projectPath ${proj} 不在 MC_SKILL_PROJECT_ROOT=${root} 内。` +
            "已设置 MC_SKILL_PROJECT_ROOT 时它是硬边界，projectPath 不能覆盖（破坏性变更）。" +
            "请把 MC_SKILL_PROJECT_ROOT 改为包含目标工程的目录，或改用其内的 projectPath。",
          "PATH_OUTSIDE_ALLOWLIST",
          true,
        );
      }
    }
    return root;
  }

  const allowRoot = (explicitRoot?.trim() || "").trim();
  if (!allowRoot) {
    throw new ProjectPathError(
      "写操作需要绝对路径项目根：传入 projectPath（CLI --project）或设置 MC_SKILL_PROJECT_ROOT。",
      "PROJECT_ROOT_REQUIRED",
    );
  }
  if (!isAbsolute(allowRoot)) {
    throw new ProjectPathError(
      "项目根必须是绝对路径（不允许相对路径，以免随进程 cwd 漂移）。",
      "PROJECT_ROOT_REQUIRED",
    );
  }
  const root = resolve(allowRoot);
  if (!existsSync(root)) {
    throw new ProjectPathError(`项目根不存在：${root}`, "PATH_NOT_FOUND");
  }
  return nativeReal(root);
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

  // 目标自身已存在时（upsert/marker/manifest 类写法）复核其真实路径：
  // 目标若是指向沙箱外的 symlink/junction，writeFileSync 会穿透写出（F-B02）
  if (existsSync(absTarget)) {
    let realTarget: string;
    try {
      realTarget = nativeReal(absTarget);
    } catch (err) {
      throw new ProjectPathError(
        `无法解析目标真实路径：${(err as Error).message}`,
        "PATH_NOT_FOUND",
      );
    }
    if (!isInsideReal(realTarget, realRoot)) {
      throw new ProjectPathError(
        `写入目标是指向沙箱外的链接：${absTarget} → ${realTarget}（不在 ${realRoot} 内）`,
        "PATH_OUTSIDE_ALLOWLIST",
      );
    }
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
