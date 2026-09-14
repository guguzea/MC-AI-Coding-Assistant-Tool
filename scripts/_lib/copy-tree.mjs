/**
 * 目录递归复制的唯一出口。
 *
 * 为什么不用 `fs.cpSync(dir, dir, { recursive: true })`：在本工作区的同步卷
 * （OneDrive 目录，路径含非 ASCII）上，它**必定**让宿主进程以 0xC0000409
 * （STATUS_STACK_BUFFER_OVERRUN，native fast-path `cpSyncCheckPaths` 里）静默消失 ——
 * 没有 JS 异常、没有栈、`try/catch` 拦不住，实测 0/5 成功；同样的源目录带上
 * `filter: () => true`（走另一条 JS 侧路径）或改成下面的 `copyFileSync` 逐文件拷贝则 5/5 正常。
 * 与文件类型、文件数、路径长度、是否 .jar 均无关（都实测排除过）。
 *
 * 语义对齐 `cpSync` 的默认行为：目标已存在则覆盖（force），目录不存在则建。
 * 符号链接跟随其目标复制；指向目录的链接也跟随，但按 realpath 去重，避免环。
 */
import { copyFileSync, lstatSync, mkdirSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * @param {string} from 源（目录或文件）
 * @param {string} to 目标
 * @returns {number} 复制的文件数
 */
export function copyTree(from, to) {
  if (!lstatSync(from)) return 0; // 不存在时上面直接抛 ENOENT，与 cpSync 一致
  if (!lstatSync(from).isDirectory()) {
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    return 1;
  }
  return walk(from, to, new Set());
}

function walk(src, dest, seenDirs) {
  mkdirSync(dest, { recursive: true });
  let n = 0;
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const sp = join(src, entry.name);
    const dp = join(dest, entry.name);
    let isDir = entry.isDirectory();
    if (entry.isSymbolicLink()) {
      // 链接本身不复制（跨机器无意义）；跟随目标：文件直接拷，目录递归
      try {
        isDir = statSync(sp).isDirectory();
      } catch {
        continue; // 断链：跳过而不是让整棵拷贝挂掉
      }
    }
    if (isDir) {
      const real = safeRealpath(sp);
      if (real && seenDirs.has(real)) continue; // 环
      if (real) seenDirs.add(real);
      n += walk(sp, dp, seenDirs);
      continue;
    }
    copyFileSync(sp, dp);
    n++;
  }
  return n;
}

function safeRealpath(p) {
  try {
    return realpathSync(p);
  } catch {
    return null;
  }
}
