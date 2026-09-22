/**
 * 写盘脚本默认 dry-run；显式 `--write` 才落盘。
 * 仓库内所有会改文件的维护脚本只能经本文件的 emit / emitCopy 落盘。
 *
 * 两类出口，互不重叠：
 *  - 仓库内：emit / emitCopy（受 `--write` 管，默认只打 `DRYRUN <rel>`）
 *    以及 emitRemove（仓库内删除出口，受同一 `--write` 管，默认只打 `DRYRUN rm <rel>`）
 *  - 仓库外（`$MC_SKILL_CACHE` / 系统临时目录，以及 gitignore 的 `temp/`）：
 *    scratchMkdirAll / scratchRemove / scratchWriteText（不受 `--write` 管，
 *    但目标一旦落进仓库即 throw）
 * 有了第二类，脚本里就不必再出现裸 mkdirSync / rmSync / writeFileSync：
 * 门禁得以逐行要求「所有落笔都在本文件内」，而不是靠注释豁免整个脚本。
 */
import { copyFileSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
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

/**
 * 同步退避（2026-09-21）：`Atomics.wait` 在 **Node 主线程**可用（被禁的只有浏览器主线程），
 * 所以同步出口也能带退避 —— 不必把 32 个同步调用点改成 await。
 * 亲验：三次退避 200+600+1500 实测 2325ms，等待后主线程定时器/IO 正常。
 */
export function sleepSync(ms) {
  const sab = new SharedArrayBuffer(4);
  Atomics.wait(new Int32Array(sab), 0, 0, ms);
}

/**
 * 原子文本落盘（2026-09-21）：先写 `.<名字>.<pid>.tmp` 再 rename 换入，最后清 tmp。
 *
 * 为什么与 emit 并列：emit 是 `mkdirSync + writeFileSync` 直写 —— 同步卷（本仓在 OneDrive）上
 * 写到一半失败会留下**半截但看起来有内容**的文件（被索引成一篇残页，比失败更糟）。
 * rename 是原子的：要么旧内容、要么新内容，不会有第三种。
 *
 * 与 emit 同受 `--write` 管（默认只打 DRYRUN）。
 * 退避：失败按 `delays` 做**同步**退避后重试（默认 200/600/1500ms，与既有抓取器
 * `bedrock-corpus.mjs` 的 writeWithRetry 同口径）—— 因为 -4094/UNKNOWN 是 OneDrive 卷上的
 * **偶发**抖动，一次失败不等于写不进去。三次仍失败 ⇒ 清 tmp 后抛（不留残骸）。
 * `opts` 的三个注入口（write / rename / sleep）只为投毒自证而存在，生产调用一律走默认。
 */
export const EMIT_ATOMIC_DELAYS = [200, 600, 1500];

export function emitAtomic(target, text, opts = {}) {
  const { delays = EMIT_ATOMIC_DELAYS, write = writeFileSync, rename = renameSync, sleep = sleepSync } = opts;
  const p = toAbs(target);
  if (!WRITE) {
    console.log(`DRYRUN ${display(p)}`);
    return false;
  }
  mkdirSync(dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.tmp`;
  let last;
  for (let i = 0; i <= delays.length; i++) {
    try {
      write(tmp, text, "utf8");
      rename(tmp, p);
      console.log(`WROTE ${display(p)}`);
      return true;
    } catch (e) {
      last = e;
      if (i >= delays.length) break;
      sleep(delays[i]);
    }
  }
  // 全败 ⇒ 清掉 tmp 再抛：不让残骸留在仓库里（否则下一步 F 类门会把它当正文）。
  try {
    rmSync(tmp, { force: true });
  } catch {
    /* 清不掉就算了：交给上层报错 */
  }
  throw last;
}

/** 唯一删除出口：默认只打印 `DRYRUN rm <仓库相对路径>`（`--write` 才真删）。 */
export function emitRemove(target, opts = {}) {
  const p = toAbs(target);
  if (!WRITE) {
    console.log(`DRYRUN rm ${display(p)}`);
    return false;
  }
  rmSync(p, { recursive: true, force: true, ...opts });
  console.log(`REMOVED ${display(p)}`);
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
