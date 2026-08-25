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

/** Bedrock content_log 行：`[2024-05-01 12:00:00.123][INFO][tag] msg`（也接受无标签/短时间戳变体） */
const CONTENT_LINE_RE =
  /^\[(?:(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:[.,]\d{3})?)|(\d{2}:\d{2}:\d{2}))\]\[([A-Za-z]+)\](?:\[([^\]]*)\])?\s*(.*)$/;

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

  const fd = openSync(abs, "r");
  let text = "";
  let bytes = 0;
  let truncated = false;
  try {
    const size = fstatSync(fd).size;
    const start = size > maxBytes ? size - maxBytes : 0;
    bytes = Math.max(0, size - start);
    const buf = Buffer.alloc(bytes);
    if (bytes > 0) readSync(fd, buf, 0, bytes, start);
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
  const issues: Array<{ label: string; sample: string }> = [];
  for (const line of text.split(/\r?\n/)) {
    const m = CONTENT_LINE_RE.exec(line);
    if (!m) {
      if (line.trim() && line.trim() !== "=BEGIN=INFO=" && !line.trim().startsWith("Content log"))
        warnings.push(line.slice(0, 200));
      continue;
    }
    const [, , , level, tag, msg] = m;
    const lvl = (level || "LOG").toUpperCase();
    levelCounts[lvl] = (levelCounts[lvl] ?? 0) + 1;
    if (tag) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    const entry = `[${tag ?? "?"}] ${msg.trim().slice(0, 200)}`;
    if (lvl === "ERROR") {
      if (errors.length < 12) errors.push(entry);
    } else if (lvl === "WARN" || lvl === "WARNING") {
      if (warnings.length < 12) warnings.push(entry);
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
    issues,
    totalKnownEntries: Object.values(levelCounts).reduce((a, b) => a + b, 0),
  };
}
