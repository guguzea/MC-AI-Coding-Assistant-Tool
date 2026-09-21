/**
 * Bedrock content-log 分析器（B26）。
 *
 * 只复用 runtime-inspect 的「目录发现 + 有界读取」骨架；解析为 Bedrock content_log 专用行格式
 * （[时间][LEVEL][标签] 消息），不复用 Java 崩溃日志拆解。只读、不写盘、不调外网。
 */
import { closeSync, existsSync, fstatSync, openSync, readSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { z } from "zod";
import { actionable, ActionCodes } from "../utils/actionable.js";

export const analyzeBedrockContentLogSchema = z.object({
  logPath: z.string().optional().describe("content_log.txt 绝对路径"),
  logsDir: z.string().optional().describe("含 content_log*.txt 的目录"),
  projectPath: z.string().optional().describe("mod 工程根（自动找 logs/content_log*.txt）"),
  maxLines: z.number().optional().describe("最多读行数（默认 400，封顶 4000）"),
  maxBytes: z.number().optional().describe("最多读字节（默认 512KB，封顶 2MB）"),
});

export interface AnalyzeBedrockContentLogQuery {
  logPath?: string;
  logsDir?: string;
  projectPath?: string;
  maxLines?: number;
  maxBytes?: number;
}

const DEFAULT_MAX_LINES = 400;
const HARD_MAX_LINES = 4000;
const DEFAULT_MAX_BYTES = 512 * 1024;
const HARD_MAX_BYTES = 2 * 1024 * 1024;
const SCAN_TIMEOUT_MS = 5000;
const MAX_DIR_ENTRIES = 80;

const REL_LOG_DIRS = [["logs"], ["behavior_packs", "logs"], ["worlds", "logs"]];

/**
 * Bedrock content_log 行。覆盖形（W4-6，2026-09-20 收紧）：
 *   `[2024-05-01 12:00:00.123][INFO][tag] msg`  长日期 + 毫秒（. 或 ,）
 *   `[12:00:01][WARNING][addon] msg`            短时间戳
 *   `[12:00:00:789]<Error>[Scripting] msg`      毫秒冒号形 + 尖括号级别
 * 级别允许 `[LEVEL]` 或 `<LEVEL>`；tag 可选；时间戳与级别之间允许空格。
 * 仍只有 5 个捕获组（两处外括号均为 (?: 非捕获），`[, , , level, tag, msg]` 取值语义不变。
 */
const CONTENT_LINE_RE =
  /^\[(?:(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:[.,:]\d{1,3})?)|(\d{2}:\d{2}:\d{2}(?:[.,:]\d{1,3})?))\]\s*[\[<]([A-Za-z]+)[\]>]\s*(?:\[([^\]]*)\])?\s*(.*)$/;

/**
 * BDS 控制台/服务端日志行（2026-09-20 **真机**取样，`test-fixtures/bedrock-bds-console.txt`）：
 * `[2026-09-20 22:12:03:504 ERROR] The following issues were found when loading packs:`
 * —— 与客户端 content_log 文件不同：**级别与时间戳同处一方括号内**、无标签方括号。
 * ⚠️ BDS 1.21.102.1 实测只把内容错误打到**控制台**：`content-log-file-enabled=true` 会打印
 * 「Content logging to disk is enabled. Writing log to: ContentLog<ts>」但**不产出任何文件**
 * （4 次起服 · 含预建 logs/ · G:\dbs 全域与 %TEMP%/APPDATA/LOCALAPPDATA 均无该文件）。
 */
const BDS_CONSOLE_LINE_RE =
  /^\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:[.,:]\d{1,3})?)\s+([A-Za-z]+)\]\s?(.*)$/;

const SUSPICIOUS_ISSUES: Array<{ re: RegExp; label: string }> = [
  { re: /Missing dependenc|Mod[ _-]?script.*failed|Script start failed/i, label: "脚本/依赖问题" },
  { re: /Exception|Error:|\[Error\]/i, label: "异常字样" },
  { re: /experimentalGameplay|Beta API/i, label: "实验性 API 使用" },
  { re: /Content Log|content-log/i, label: "内容日志自身报告" },
];

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
  const candidates: { path: string; mtime: number }[] = [];
  for (const name of names) {
    if (Date.now() > deadline) break;
    if (!re.test(name)) continue;
    const abs = join(dir, name);
    try {
      const st = statSync(abs);
      if (!st.isFile()) continue;
      candidates.push({ path: abs, mtime: st.mtimeMs });
    } catch {
      /* skip */
    }
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates.slice(0, 80)[0]?.path;
}

export function analyzeBedrockContentLog(
  query: AnalyzeBedrockContentLogQuery,
): Record<string, unknown> {
  const maxLines = Math.min(Math.max(1, Math.floor(query.maxLines ?? DEFAULT_MAX_LINES)), HARD_MAX_LINES);
  const maxBytes = Math.min(Math.max(1, Math.floor(query.maxBytes ?? DEFAULT_MAX_BYTES)), HARD_MAX_BYTES);
  const deadline = Date.now() + SCAN_TIMEOUT_MS;

  let abs = query.logPath?.trim() || undefined;
  if (abs && !isFile(abs)) {
    return { ok: false, action: actionable(ActionCodes.NOT_FOUND, `logPath 不是文件：${abs}`, ["传 content_log.txt 绝对路径"]) };
  }

  if (!abs) {
    const logsDir = query.logsDir?.trim() || undefined;
    const root = logsDir && isDir(logsDir)
      ? resolve(logsDir)
      : query.projectPath
        ? (() => {
            const p = resolve(query.projectPath);
            if (!isDir(p)) return undefined;
            for (const parts of REL_LOG_DIRS) {
              if (Date.now() > deadline) return undefined;
              const cand = join(p, ...parts);
              if (isDir(cand)) return resolve(cand);
            }
            return undefined;
          })()
        : undefined;
    if (!root) {
      return { ok: false, action: actionable(ActionCodes.NOT_FOUND, "未找到 content_log 目录", ["传 logPath / logsDir / projectPath"]) };
    }
    abs = newestMatching(root, /content_log/i, deadline);
    if (!abs) {
      return { ok: false, action: actionable(ActionCodes.NOT_FOUND, `${root} 下没有 content_log*.txt`, ["核对启动器日志目录"]) };
    }
  }

  let fd: number;
  try {
    fd = openSync(abs, "r");
  } catch (err) {
    return {
      ok: false,
      action: actionable(ActionCodes.NOT_FOUND, `无法打开 content_log: ${(err as Error).message}`, [
        "核对路径权限与文件是否存在",
      ]),
    };
  }
  let text = "";
  let bytes = 0;
  let truncated = false;
  try {
    const size = fstatSync(fd).size;
    const start = size > maxBytes ? size - maxBytes : 0;
    bytes = Math.max(0, size - start);
    const buf = Buffer.alloc(bytes);
    if (bytes > 0) {
      let off = 0;
      while (off < bytes) {
        const n = readSync(fd, buf, off, bytes - off, start + off);
        if (n <= 0) break;
        off += n;
      }
    }
    let t = buf.toString("utf8");
    if (start > 0 && t.charCodeAt(0) === 0xfffd) {
      const nl = t.indexOf("\n");
      if (nl >= 0) t = t.slice(nl + 1);
    }
    const lines = t.split(/\r?\n/);
    truncated = start > 0 || lines.length > maxLines;
    text = (lines.length > maxLines ? lines.slice(-maxLines) : lines).join("\n");
  } finally {
    closeSync(fd);
  }

  const levelCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  const errors: string[] = [];
  const warnings: string[] = [];
  const unparsedLines: string[] = [];
  const issues: Array<{ label: string; sample: string }> = [];
  // 续行归并（2026-09-20 真机取样）：BDS 把内容错误明细以制表符缩进跟在上一行之后，
  // 那些行不是「坏行」，而是上一条的正文 ⇒ 追加到上一条，不进 unparsedLines。
  let lastBucket: "errors" | "warnings" | null = null;
  let lastIdx = -1;
  for (const line of text.split(/\r?\n/)) {
    const contentM = CONTENT_LINE_RE.exec(line);
    const consoleM = contentM ? null : BDS_CONSOLE_LINE_RE.exec(line);
    if (!contentM && !consoleM) {
      const trimmed = line.trim();
      // 空行 / 仅缩进行：既不记账，也**不打断**续行（真机样例里 header 与明细之间就有一行单制表符）。
      if (trimmed === "") continue;
      if (/^[ \t]+\S/.test(line) && lastBucket) {
        const arr = lastBucket === "errors" ? errors : warnings;
        if (arr[lastIdx]) arr[lastIdx] = `${arr[lastIdx]} ${trimmed}`.slice(0, 400);
        continue;
      }
      lastBucket = null;
      lastIdx = -1;
      if (trimmed !== "=BEGIN=INFO=" && !trimmed.startsWith("Content log")) unparsedLines.push(line.slice(0, 200));
      continue;
    }
    // 客户端 content_log 形（`[ts][LEVEL][tag] msg`）优先；BDS 控制台形（`[ts LEVEL] msg`）兜底。
    const level = contentM ? contentM[3] : consoleM![2];
    const tag = contentM ? contentM[4] : undefined;
    const msg = (contentM ? contentM[5] : consoleM![3]) ?? "";
    const lvl = (level || "LOG").toUpperCase();
    levelCounts[lvl] = (levelCounts[lvl] ?? 0) + 1;
    if (tag) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    const entry = `[${tag ?? "?"}] ${msg.trim().slice(0, 200)}`;
    lastBucket = null;
    lastIdx = -1;
    if (lvl === "ERROR") {
      if (errors.length < 12) {
        errors.push(entry);
        lastBucket = "errors";
        lastIdx = errors.length - 1;
      }
    } else if (lvl === "WARN" || lvl === "WARNING") {
      if (warnings.length < 12) {
        warnings.push(entry);
        lastBucket = "warnings";
        lastIdx = warnings.length - 1;
      }
    }
    for (const s of SUSPICIOUS_ISSUES) {
      if (s.re.test(msg) && !issues.some((x) => x.label === s.label)) {
        issues.push({ label: s.label, sample: entry });
      }
    }
  }

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tagName, count]) => ({ tag: tagName, count }));

  return {
    ok: true,
    file: abs,
    lines: text.split(/\r?\n/).filter(Boolean).length,
    bytes,
    truncated,
    levelCounts,
    topTags,
    errors,
    warnings: warnings.slice(0, 12),
    unparsedLines: unparsedLines.slice(0, 12),
    issues,
    totalKnownEntries: Object.values(levelCounts).reduce((a, b) => a + b, 0),
  };
}
