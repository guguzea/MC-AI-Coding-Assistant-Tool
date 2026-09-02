/**
 * 写盘脚本默认 dry-run；显式 `--write` 才落盘。
 * 仓库内所有会改文件的维护脚本只能经本文件的 emit / emitCopy 落盘。
 */
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
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
