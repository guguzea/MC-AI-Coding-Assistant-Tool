/**
 * 写盘脚本默认 dry-run；显式 `--write` 才落盘。
 * 仓库内所有会改文件的维护脚本只能经本文件的 emit / emitCopy 落盘。
 *
 * 两类出口，互不重叠：
 *  - 仓库内：emit / emitCopy（受 `--write` 管，默认只打 `DRYRUN <rel>`）
 *  - 仓库外（`$MC_SKILL_CACHE` / 系统临时目录，以及 gitignore 的 `temp/`）：
 *    scratchMkdirAll / scratchRemove / scratchWriteText（不受 `--write` 管，
 *    但目标一旦落进仓库即 throw）
 * 有了第二类，脚本里就不必再出现裸 mkdirSync / rmSync / writeFileSync：
 * 门禁得以逐行要求「所有落笔都在本文件内」，而不是靠注释豁免整个脚本。
 */
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const GUARD_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** 只读：命令行是否显式要求落盘。 */
export function wantWrite(argv = process.argv) {
  return argv.includes("--write");
}

export function logDryRunBanner(scriptName) {
  console.log(`[${scriptName}] dry-run：不会写盘。确认后加 --write。`);
}

const WRITE = wantWrite();

function toAbs(target) {
  return isAbsolute(target) ? resolve(target) : resolve(GUARD_ROOT, target);
}

function display(p) {
  return relative(GUARD_ROOT, p).split(sep).join("/");
}

/**
 * 仓库外临时落笔：mkdir / rm / 写文本只许碰 `$MC_SKILL_CACHE`、系统临时目录或 gitignore 的 `temp/`。
 * 目标解析进仓库（`temp/` 除外）即 throw —— 否则「scratch」就成了绕过 `--write` 的后门。
 */
function assertScratch(target) {
  const p = toAbs(target);
  const rel = display(p);
  const outsideRepo = /^[a-zA-Z]:\//.test(rel) || rel.startsWith("../");
  if (!outsideRepo && rel !== "temp" && !rel.startsWith("temp/")) {
    throw new Error(`write-guard: scratch 目标不许落在仓库内（${rel}）；仓库文件只能走 emit / emitCopy`);
  }
  return p;
}

export function scratchMkdirAll(target) {
  return mkdirSync(assertScratch(target), { recursive: true });
}

export function scratchRemove(target, opts = {}) {
  return rmSync(assertScratch(target), { recursive: true, force: true, ...opts });
}

export function scratchWriteText(target, text) {
  const p = assertScratch(target);
  mkdirSync(dirname(p), { recursive: true });
  return writeFileSync(p, text, "utf8");
}

/** 唯一文本写盘出口：默认只打印 `DRYRUN <仓库相对路径>`。 */
export function emit(target, text) {
  const p = toAbs(target);
  if (!WRITE) {
    console.log(`DRYRUN ${display(p)}`);
    return false;
  }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text, "utf8");
  console.log(`WROTE ${display(p)}`);
  return true;
}

/** 唯一复制出口：默认只打印目标路径。 */
export function emitCopy(target, source) {
  const p = toAbs(target);
  if (!WRITE) {
    console.log(`DRYRUN ${display(p)}`);
    return false;
  }
  mkdirSync(dirname(p), { recursive: true });
  copyFileSync(source, p);
  console.log(`WROTE ${display(p)}`);
  return true;
}
