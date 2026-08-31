/**
 * A-2 双视图复核：解压交给外部工具（unzip/7z/bsdtar）时，它们按本地文件头（LFH）落盘，
 * 而前置校验只看中央目录（CD）。构造「CD 干净、LFH 恶意」的 zip 可绕过清单校验。
 * 解压后必须复核：实际落盘文件集合 == CD 清单集合，且每个文件的 realpath 仍在解压根内。
 */

import { lstatSync, readdirSync, realpathSync } from "fs";
import { join, relative, resolve, sep } from "path";

export interface ExtractVerifyResult {
  ok: boolean;
  problem?: string;
  extraFiles?: string[];
  missingFiles?: string[];
}

function walkRelTree(
  root: string,
  base: string,
  depth: number,
  seenReal: Set<string>,
  files: string[],
  dirs: string[],
  symlinks: string[],
): void {
  if (depth > 32) {
    // C35：深层多余文件不得静默漏检——塞入哨兵条目让清单比对失败
    files.push("__MAX_DEPTH_EXCEEDED__");
    return;
  }
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    let st;
    try {
      st = lstatSync(p);
    } catch {
      continue;
    }
    const rel = relative(base, p).split(sep).join("/");
    if (st.isSymbolicLink()) {
      symlinks.push(rel);
      continue;
    }
    let real: string;
    try {
      real = realpathSync(p);
    } catch {
      continue;
    }
    if (seenReal.has(real)) continue;
    seenReal.add(real);
    if (st.isDirectory()) {
      dirs.push(rel);
      walkRelTree(p, base, depth + 1, seenReal, files, dirs, symlinks);
    } else if (st.isFile()) {
      files.push(rel);
    }
  }
}

function insideRoot(realRoot: string, realPath: string): boolean {
  if (realPath === realRoot) return true;
  const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep;
  return realPath.startsWith(prefix);
}

/**
 * 复核 rootDir 下实际落盘的文件集合与 expectedRelFiles 一致：
 * - 落盘文件不得出现在清单之外（LFH 欺骗注入 → extra）；
 * - 清单条目必须落盘为同名文件或目录（目录条目在不同工具下带/不带尾斜杠，均算满足）；
 * - 每个文件 realpath 必须仍在 rootDir 内。
 */
export function verifyExtractedTree(rootDir: string, expectedRelFiles: string[]): ExtractVerifyResult {
  const absRoot = resolve(rootDir);
  let realRoot: string;
  try {
    realRoot = realpathSync(absRoot).toLowerCase();
  } catch {
    return { ok: false, problem: "解析解压根 realpath 失败" };
  }

  const files: string[] = [];
  const dirs: string[] = [];
  const symlinks: string[] = [];
  try {
    walkRelTree(absRoot, absRoot, 0, new Set(), files, dirs, symlinks);
  } catch (err) {
    return { ok: false, problem: `扫描解压树失败: ${(err as Error).message}` };
  }

  if (symlinks.length > 0) {
    return {
      ok: false,
      problem: `解压树含符号链接，已拒绝: ${symlinks.slice(0, 5).join(", ")}`,
    };
  }

  const fileSet = new Set(files);
  const dirSet = new Set(dirs);
  const expectedSet = new Set(expectedRelFiles.map((e) => e.replace(/\\/g, "/").replace(/\/$/, "")));

  const extra = files.filter((f) => !expectedSet.has(f));
  if (extra.length > 0) {
    return {
      ok: false,
      problem: `落盘了中央目录之外的文件（疑似 LFH 欺骗）: ${extra.slice(0, 5).join(", ")}`,
      extraFiles: extra,
    };
  }
  const missing = [...expectedSet].filter((e) => !fileSet.has(e) && !dirSet.has(e));
  if (missing.length > 0) {
    return {
      ok: false,
      problem: `中央目录条目未落盘: ${missing.slice(0, 5).join(", ")}`,
      missingFiles: missing,
    };
  }

  for (const f of files) {
    let realFile: string;
    try {
      realFile = realpathSync(join(absRoot, f)).toLowerCase();
    } catch {
      return { ok: false, problem: `无法解析落盘文件 realpath: ${f}` };
    }
    if (!insideRoot(realRoot, realFile)) {
      return { ok: false, problem: `落盘文件 realpath 逃逸解压根: ${f} → ${realFile}` };
    }
  }
  return { ok: true };
}
