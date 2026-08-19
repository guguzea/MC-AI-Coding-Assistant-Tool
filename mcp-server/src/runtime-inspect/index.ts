/**
 * 日志型 runtime inspector：只读 latest.log / crash-report 尾部。
 * 禁止 JDWP attach、禁止改游戏、禁止全盘 / 向上走到盘符根。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, resolve } from "path";
import { analyzeCrash } from "../crash/index.js";
import { analyzeLog } from "../diagnostics/index.js";
import { actionable, ActionCodes } from "../utils/actionable.js";

export interface InspectRuntimeQuery {
  logsDir?: string;
  crashReportsDir?: string;
  projectPath?: string;
  maxLines?: number;
  maxBytes?: number;
  version?: string;
}

const DEFAULT_MAX_LINES = 200;
const HARD_MAX_LINES = 2000;
const DEFAULT_MAX_BYTES = 512 * 1024;
const HARD_MAX_BYTES = 2 * 1024 * 1024;
const DUMP_MAX_BYTES = 64 * 1024;
const SCAN_TIMEOUT_MS = 5000;
const MAX_DIR_ENTRIES = 80;

const REL_LOG_DIRS = [
  ["run", "logs"],
  ["runs", "client", "logs"],
  ["build", "run", "logs"],
];
const REL_CRASH_DIRS = [
  ["run", "crash-reports"],
  ["runs", "client", "crash-reports"],
  ["crash-reports"],
];

function capLines(n?: number): number {
  const v = n ?? DEFAULT_MAX_LINES;
  if (!Number.isFinite(v) || v < 1) return DEFAULT_MAX_LINES;
  return Math.min(Math.floor(v), HARD_MAX_LINES);
}

function capBytes(n?: number): number {
  const v = n ?? DEFAULT_MAX_BYTES;
  if (!Number.isFinite(v) || v < 1) return DEFAULT_MAX_BYTES;
  return Math.min(Math.floor(v), HARD_MAX_BYTES);
}

function isDir(p: string): boolean {
  try {
    return existsSync(p) && statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function isFile(p: string): boolean {
  try {
    return existsSync(p) && statSync(p).isFile();
  } catch {
    return false;
  }
}

function newestMatching(dir: string, re: RegExp, deadline: number): string | undefined {
  if (!isDir(dir)) return undefined;
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return undefined;
  }
  if (names.length > MAX_DIR_ENTRIES) names = names.slice(0, MAX_DIR_ENTRIES);
  let best: { path: string; mtime: number } | undefined;
  for (const name of names) {
    if (Date.now() > deadline) break;
    if (!re.test(name)) continue;
    const abs = join(dir, name);
    try {
      const st = statSync(abs);
      if (!st.isFile()) continue;
      if (!best || st.mtimeMs > best.mtime) best = { path: abs, mtime: st.mtimeMs };
    } catch {
      /* skip */
    }
  }
  return best?.path;
}

function readTail(abs: string, maxBytes: number, maxLines: number): { text: string; truncated: boolean; bytes: number } {
  const st = statSync(abs);
  const size = st.size;
  const start = size > maxBytes ? size - maxBytes : 0;
  const buf = readFileSync(abs);
  const slice = start > 0 ? buf.subarray(start) : buf;
  let text = slice.toString("utf8");
  if (start > 0 && text.charCodeAt(0) === 0xfffd) {
    const nl = text.indexOf("\n");
    if (nl >= 0) text = text.slice(nl + 1);
  }
  const lines = text.split(/\r?\n/);
  const truncated = start > 0 || lines.length > maxLines;
  const kept = lines.length > maxLines ? lines.slice(-maxLines) : lines;
  return { text: kept.join("\n"), truncated, bytes: slice.length };
}

function boundedLogsDir(projectRoot: string, deadline: number): string | undefined {
  const root = resolve(projectRoot);
  for (const parts of REL_LOG_DIRS) {
    if (Date.now() > deadline) return undefined;
    const cand = join(root, ...parts);
    if (isDir(cand)) return cand;
  }
  return undefined;
}

function boundedCrashDir(projectRoot: string, deadline: number): string | undefined {
  const root = resolve(projectRoot);
  for (const parts of REL_CRASH_DIRS) {
    if (Date.now() > deadline) return undefined;
    const cand = join(root, ...parts);
    if (isDir(cand)) return cand;
  }
  return undefined;
}

function summarizeLog(analysis: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of ["ok", "crashKind", "hints", "modList", "errors", "warnings", "dedicated", "isDedicated", "summary"]) {
    if (k in analysis) out[k] = analysis[k];
  }
  const text = JSON.stringify(analysis);
  if (/DedicatedServer|dedicated server/i.test(text)) out.dedicatedServer = true;
  if (/ERROR|Exception/i.test(text) && !out.errors) {
    out.hasErrorOrException = true;
  }
  return out;
}

export function inspectRuntime(query: InspectRuntimeQuery): Record<string, unknown> {
  const maxLines = capLines(query.maxLines);
  const maxBytes = capBytes(query.maxBytes);
  const deadline = Date.now() + SCAN_TIMEOUT_MS;
  const warnings: string[] = [];
  let logsDir = query.logsDir?.trim() || undefined;
  let crashDir = query.crashReportsDir?.trim() || undefined;

  if (logsDir && !isDir(logsDir)) {
    return {
      ok: false,
      action: actionable(ActionCodes.NOT_FOUND, `logsDir 不是目录：${logsDir}`, [
        "传入启动器「打开日志文件夹」的路径",
      ]),
    };
  }
  if (crashDir && !isDir(crashDir)) {
    warnings.push(`crashReportsDir 不是目录，已忽略：${crashDir}`);
    crashDir = undefined;
  }

  if (!logsDir && query.projectPath) {
    const resolved = resolve(query.projectPath);
    if (!isDir(resolved)) {
      return {
        ok: false,
        action: actionable(ActionCodes.NOT_FOUND, `projectPath 不是目录：${query.projectPath}`, [
          "传入工程根，或直接给 logsDir",
        ]),
      };
    }
    logsDir = boundedLogsDir(resolved, deadline);
    if (!crashDir) crashDir = boundedCrashDir(resolved, deadline);
    if (!logsDir) {
      return {
        ok: false,
        action: actionable(
          ActionCodes.NOT_FOUND,
          "未在工程根下找到 run/logs、runs/client/logs、build/run/logs。禁止全盘扫描。",
          ["在启动器中「打开日志文件夹」后把路径传给 logsDir"],
        ),
        warnings,
      };
    }
  }

  if (!logsDir && !crashDir) {
    return {
      ok: false,
      action: actionable(ActionCodes.INVALID_INPUT, "需要 logsDir / crashReportsDir，或 projectPath 以便有界探测", [
        "优先传入启动器日志目录",
      ]),
    };
  }

  if (Date.now() > deadline) {
    return {
      ok: false,
      action: actionable(ActionCodes.NOT_FOUND, "探测超时。请直接传入 logsDir。", [
        "启动器「打开日志文件夹」",
      ]),
      warnings,
    };
  }

  const logFile = logsDir
    ? (isFile(join(logsDir, "latest.log")) ? join(logsDir, "latest.log") : newestMatching(logsDir, /\.log$/i, deadline))
    : undefined;
  const crashFile = crashDir ? newestMatching(crashDir, /\.(txt|log)$/i, deadline) : undefined;

  let logTail: { text: string; truncated: boolean } | undefined;
  let logAnalysis: Record<string, unknown> | undefined;
  if (logFile) {
    try {
      logTail = readTail(logFile, maxBytes, maxLines);
      if (logTail.truncated) warnings.push(`日志已截断（尾部 ${maxLines} 行 / ${maxBytes} 字节上限）`);
      logAnalysis = query.version?.trim()
        ? summarizeLog(analyzeLog({ logText: logTail.text, version: query.version }))
        : { skipped: true, reason: "未指定 version，未调用 analyze_log（禁止默认 1.20.1）" };
    } catch (e) {
      warnings.push(`读取日志失败：${(e as Error).message}`);
    }
  }

  let crashAnalysis: ReturnType<typeof analyzeCrash> | undefined;
  if (crashFile) {
    try {
      const tail = readTail(crashFile, maxBytes, maxLines);
      if (tail.truncated) warnings.push(`crash-report 已截断（尾部 ${maxLines} 行 / ${maxBytes} 字节上限）`);
      crashAnalysis = query.version?.trim()
        ? analyzeCrash({ crashReport: tail.text, version: query.version })
        : undefined;
      if (!query.version?.trim()) {
        warnings.push("未指定 version，未调用 crash_analyze（禁止默认 1.20.1）");
      }
    } catch (e) {
      warnings.push(`读取 crash-report 失败：${(e as Error).message}`);
    }
  }

  let dump: unknown;
  if (query.projectPath) {
    const dumpPath = join(resolve(query.projectPath), "run", "mc-skill-dump.json");
    if (isFile(dumpPath)) {
      try {
        const st = statSync(dumpPath);
        if (st.size > DUMP_MAX_BYTES) {
          warnings.push(`忽略 run/mc-skill-dump.json（超过 ${DUMP_MAX_BYTES} 字节）`);
        } else {
          dump = JSON.parse(readFileSync(dumpPath, "utf8"));
        }
      } catch {
        warnings.push("run/mc-skill-dump.json 存在但无法解析，已忽略");
      }
    }
  }

  const nextSteps = [
    "不要把本工具当 JVM attach",
    "有 Mixin 嫌疑再 mixin_analyze",
    "构建问题用 diagnose_gradle；结构问题用 validate_project（看 status）",
  ];

  return {
    ok: true,
    logsDir: logsDir ?? null,
    crashReportsDir: crashDir ?? null,
    logFile: logFile ?? null,
    crashFile: crashFile ?? null,
    logAnalysis,
    crashAnalysis,
    dump: dump ?? undefined,
    warnings,
    nextSteps,
    limits: { maxLines, maxBytes },
  };
}
