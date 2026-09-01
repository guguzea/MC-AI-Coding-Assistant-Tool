/**
 * analyze_build_log — 解析用户粘贴的 Gradle / javac 构建日志。
 * 不执行 gradlew，不联网，不写盘。
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { z } from "zod";

export const analyzeBuildLogSchema = z.object({
  logText: z.string().optional().describe("Gradle/javac 构建日志全文（与 logPath 二选一）"),
  logPath: z.string().optional().describe("构建日志文件绝对路径（与 logText 二选一）"),
  platform: z
    .enum(["forge", "neoforge", "fabric", "quilt", "unknown"])
    .optional()
    .describe("可选；用于推荐 search_*_docs / query_loader_api"),
  minecraftVersion: z.string().optional().describe("可选精确 MC 版本，写入建议工具参数"),
});

export type AnalyzeBuildLogInput = z.infer<typeof analyzeBuildLogSchema>;

export interface BuildLogIssue {
  kind:
    | "cannot_find_symbol"
    | "incompatible_types"
    | "missing_property"
    | "loom_remap"
    | "compilation_failure"
    | "dependency"
    | "other";
  message: string;
  symbol?: string;
  /** javac `location:` 续行 —— 符号缺失所在的类/接口（不是 symbol 本身） */
  location?: string;
  file?: string;
  line?: number;
  suggestedTools: Array<{ tool: string; args: Record<string, unknown>; reason: string }>;
}

export interface AnalyzeBuildLogResult {
  ok: boolean;
  truncated?: boolean;
  /** 日志原始字节数（截断前）；未截断时等于 keptBytes */
  totalBytes?: number;
  keptBytes?: number;
  omittedBytes?: number;
  /** 命中模式但被 40 条上限挤掉的数量（0 = issueCount 就是全部命中） */
  droppedMatches?: number;
  issueCount: number;
  issues: BuildLogIssue[];
  summary: string[];
  error?: string;
}

const LOG_MAX = 2 * 1024 * 1024;
const LOG_HEAD_RATIO = 0.25;

interface LogClamp {
  text: string;
  truncated: boolean;
  totalBytes: number;
  keptBytes: number;
  omittedBytes: number;
}

/**
 * 按 UTF-8 **字节**裁剪（text.slice 数的是 UTF-16 码元，含中文的日志会超预算）。
 * 留头部一小段 + 尾部一大段：Gradle 的真正异常与 BUILD FAILED 在末尾，javac 的 error 段
 * 在任意位置；只留头部等于「看不到失败原因」，还可能报出 0 issues 让人以为日志是干净的。
 */
function clampLogBytes(text: string): LogClamp {
  const buf = Buffer.from(text, "utf8");
  const totalBytes = buf.length;
  if (totalBytes <= LOG_MAX) {
    return { text, truncated: false, totalBytes, keptBytes: totalBytes, omittedBytes: 0 };
  }
  const headBudget = Math.floor(LOG_MAX * LOG_HEAD_RATIO);
  const nlHead = buf.indexOf(0x0a, headBudget);
  const headEnd = nlHead >= 0 ? nlHead + 1 : totalBytes;
  let tailStart = totalBytes - (LOG_MAX - headBudget);
  if (tailStart <= headEnd) {
    // 整份日志是一行（或头部没有换行）：只能退化成纯头部截断，别把字节算两遍。
    const keptBuf = buf.subarray(0, LOG_MAX);
    return {
      text: keptBuf.toString("utf8"),
      truncated: true,
      totalBytes,
      keptBytes: keptBuf.length,
      omittedBytes: totalBytes - keptBuf.length,
    };
  }
  const nlTail = buf.indexOf(0x0a, tailStart);
  if (nlTail >= 0 && nlTail + 1 < totalBytes) tailStart = nlTail + 1; // 丢掉可能被切坏的半行
  const omittedBytes = tailStart - headEnd;
  const kept =
    buf.subarray(0, headEnd).toString("utf8") +
    `\n[... analyze_build_log 省略 ${omittedBytes} 字节 / 共 ${totalBytes} 字节 ...]\n` +
    buf.subarray(tailStart).toString("utf8");
  return {
    text: kept,
    truncated: true,
    totalBytes,
    keptBytes: Buffer.byteLength(kept, "utf8"),
    omittedBytes,
  };
}

function docsTool(platform?: string): string {
  switch (platform) {
    case "neoforge":
      return "search_neoforge_docs";
    case "fabric":
      return "search_fabric_docs";
    case "forge":
      return "search_forge_docs";
    default:
      // quilt / liteloader / rift / modloader / 未知：通用入口（platform 必填且为枚举值）
      return "search_docs";
  }
}

const LIST_VERSIONS_TOOL: Record<string, string> = {
  forge: "list_forge_versions",
  neoforge: "list_neoforge_versions",
  fabric: "list_fabric_versions",
  quilt: "list_doc_versions",
};

/**
 * 文档检索建议：所有 search_*_docs 必填 version，search_docs 还必填 platform。
 * 凑不齐必填参数就不要吐「去搜文档」的建议（那是一次必然失败的调用），改成先列版本。
 */
function docsSuggestion(
  platform: string | undefined,
  minecraftVersion: string | undefined,
  query: string | undefined,
  reason: string,
): BuildLogIssue["suggestedTools"] {
  const q = query?.trim();
  if (!q || /^(?:unknown|type)$/.test(q)) return [];
  const ver = minecraftVersion?.trim();
  const plat = platform && platform !== "unknown" ? platform : undefined;
  const tool = docsTool(plat);
  if (ver && plat) {
    const args: Record<string, unknown> = { query: q, version: ver };
    if (tool === "search_docs") args.platform = plat;
    return [{ tool, args, reason }];
  }
  const listTool = plat ? LIST_VERSIONS_TOOL[plat] ?? "list_doc_versions" : "list_doc_versions";
  const missing = !plat && !ver ? "平台与版本" : !plat ? "platform" : "MC 版本";
  return [
    {
      tool: listTool,
      args: {},
      reason: `${reason}：缺${missing}，${tool} 的必填参数凑不齐（禁止猜版本）。先用 ${listTool} 确认可用版本，再以 query="${q}" 检索`,
    },
  ];
}

/** javac 没给出 symbol: 续行时唯一的诚实出路：把整段（含缩进续行）再喂一次。 */
function noSymbolHint(what = "本条"): BuildLogIssue["suggestedTools"] {
  return [
    {
      tool: "analyze_build_log",
      args: {},
      reason: `${what}没解析到 symbol:/location:（javac 把它们印在缩进续行里）。重新粘贴含缩进的整段，或按 message 里的 文件:行号 直接看源码`,
    },
  ];
}

function suggestForSymbol(
  symbol: string | undefined,
  location: string | undefined,
  platform: string | undefined,
  minecraftVersion: string | undefined,
): BuildLogIssue["suggestedTools"] {
  const ver = minecraftVersion?.trim();
  const tools: BuildLogIssue["suggestedTools"] = [];
  if (!symbol) return noSymbolHint("cannot find symbol 这条");
  if (platform && platform !== "unknown" && ver) {
    tools.push({
      tool: "query_loader_api",
      args: { platform, minecraftVersion: ver, className: symbol },
      reason: "核对 loader/模组 API 是否存在该方法或类型",
    });
  }
  tools.push(...docsSuggestion(platform, ver, symbol, "在官方文档中搜索该符号"));
  if (ver) {
    tools.push({
      tool: "query_api",
      args: { className: symbol, version: ver },
      reason: "若为 Vanilla/Parchment 索引范围内类，查方法签名（26.1+ 无索引）",
    });
  }
  if (location && ver && platform && platform !== "unknown") {
    tools.push({
      tool: "query_loader_api",
      args: { platform, minecraftVersion: ver, className: location },
      reason: `symbol 缺失的位置是 ${location}：核对该类在本版是否改名/移位`,
    });
  }
  return tools;
}

function suggestGradle(
  platform: string | undefined,
  minecraftVersion: string | undefined,
): BuildLogIssue["suggestedTools"] {
  return [
    {
      tool: "diagnose_gradle",
      args: {},
      reason: "对照工程 build.gradle / gradle.properties 配置",
    },
    ...docsSuggestion(platform, minecraftVersion, "gradle setup loom", "查官方构建/Loom/NeoGradle 说明"),
  ];
}

/**
 * 文件:行号。`:` 不在路径字符类里，所以必须显式允许 Windows 盘符前缀 ——
 * 否则 C:\Users\me\Foo.java:42 会被切成 /Users/me/Foo.java（下游打不开）。
 */
function parseFileLoc(s: string): { file?: string; line?: number } {
  // Foo.java:42: error: ...
  const m1 = s.match(/((?:[A-Za-z]:)?[\w./\\-]+\.(?:java|kt|groovy|gradle(?:\.kts)?)):(\d+)/);
  if (m1) return { file: m1[1].replace(/\\/g, "/"), line: Number(m1[2]) };
  // at path (Foo.java:42)
  const m2 = s.match(/\(((?:[A-Za-z]:)?[^()]+\.(?:java|kt)):(\d+)\)/);
  if (m2) return { file: m2[1].replace(/\\/g, "/"), line: Number(m2[2]) };
  return {};
}

/**
 * javac 的 symbol: / location: / required: / found: 一律在错误头行之后的**缩进续行**里
 * （中间还夹着源码行与 `^`）。只看头行必然拿不到符号名，早期版本因此把 "unknown" 当查询词。
 */
function readContinuation(lines: string[], i: number, maxLines = 8): string {
  const out: string[] = [];
  for (let j = i + 1; j < lines.length && out.length < maxLines; j++) {
    if (!/^\s+\S/.test(lines[j])) break;
    out.push(lines[j]);
  }
  return out.join("\n");
}

function firstGroup(text: string, re: RegExp): string | undefined {
  const m = text.match(re);
  if (!m) return undefined;
  const v = m[1].trim().replace(/[.,;]+$/, "");
  return v || undefined;
}

/** `symbol:   method getHealth()` → `getHealth`（参数表对文档检索是噪音）。 */
function extractSymbol(header: string, cont: string): string | undefined {
  const raw =
    firstGroup(header, /symbol[:：]\s*(?:class|method|variable|constructor|record|interface)\s+(\S+)/i) ??
    firstGroup(cont, /symbol[:：]\s*(?:class|method|variable|constructor|record|interface)\s+(\S+)/i) ??
    firstGroup(header, /找不到符号[^\n]*?[:：]\s*(\S+)/) ??
    firstGroup(cont, /符号[:：]\s*(?:class|方法|变量|构造器)\s+(\S+)/);
  if (!raw) return undefined;
  return raw.replace(/\(.*$/, "").replace(/<.*$/, "") || undefined;
}

/** `location: class Foo` / `位置: 类 Foo` → `Foo`（符号缺失的位置，通常是用户自己的类）。 */
function extractLocation(cont: string): string | undefined {
  return (
    firstGroup(cont, /location[:：]\s*(?:class|interface|enum|record|variable)\s+([\w.$<>\[\]]+)/i) ??
    firstGroup(cont, /位置[:：]\s*(?:类|接口|枚举)\s+([\w.$<>\[\]]+)/)
  );
}

export function analyzeBuildLog(input: AnalyzeBuildLogInput): AnalyzeBuildLogResult {
  let text = input.logText;
  if (!text?.trim() && input.logPath) {
    const p = input.logPath;
    try {
      if (!existsSync(p) || !statSync(p).isFile()) {
        return { ok: false, issueCount: 0, issues: [], summary: [], error: `无法读取 logPath：${p}` };
      }
      text = readFileSync(p, "utf8");
    } catch (err) {
      return {
        ok: false,
        issueCount: 0,
        issues: [],
        summary: [],
        error: `读取 logPath 失败：${(err as Error).message}`,
      };
    }
  }
  if (!text?.trim()) {
    return {
      ok: false,
      issueCount: 0,
      issues: [],
      summary: [],
      error: "需要 logText 或 logPath（粘贴 Gradle/javac 失败日志；本工具不执行 gradlew）",
    };
  }

  const clamp = clampLogBytes(text);
  const truncated = clamp.truncated;
  const platform = input.platform;
  const mc = input.minecraftVersion;
  const issues: BuildLogIssue[] = [];
  const lines = clamp.text.split(/\r?\n/);
  let dropped = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/\bcannot find symbol\b/i.test(line) || /找不到符号|无法找到符号/.test(line)) {
      // javac 的 symbol: / location: 在下一行（缩进），只看头行永远取不到符号名。
      const cont = readContinuation(lines, i);
      const sym = extractSymbol(line, cont);
      const location = extractLocation(cont);
      const loc = parseFileLoc(line);
      if (issues.length >= 40) dropped++;
      else
        issues.push({
          kind: "cannot_find_symbol",
          message: line.trim().slice(0, 400),
          symbol: sym,
          location,
          ...loc,
          suggestedTools: suggestForSymbol(sym, location, platform, mc),
        });
      continue;
    }

    if (/incompatible types|类型不兼容|inconvertible types/i.test(line)) {
      const loc = parseFileLoc(line);
      if (issues.length >= 40) dropped++;
      else
        issues.push({
          kind: "incompatible_types",
          message: line.trim().slice(0, 400),
          ...loc,
          // required/found 已在 message 文本里；拿 `int`/`String` 当符号查文档只会得到噪音。
          suggestedTools: noSymbolHint("类型不兼容这条"),
        });
      continue;
    }

    if (/MissingPropertyException|Could not get unknown property|找不到属性/i.test(line)) {
      const prop = line.match(/property\s+['"]?([A-Za-z0-9_.]+)['"]?/i)?.[1];
      const loc = parseFileLoc(line);
      if (issues.length >= 40) dropped++;
      else
        issues.push({
          kind: "missing_property",
          message: line.trim().slice(0, 400),
          symbol: prop,
          ...loc,
          suggestedTools: suggestGradle(platform, mc),
        });
      continue;
    }

    if (/tiny-remapper|remapJar|RemapTask|Failed to remap|loom.*remap/i.test(line)) {
      const loc = parseFileLoc(line);
      if (issues.length >= 40) dropped++;
      else
        issues.push({
          kind: "loom_remap",
          message: line.trim().slice(0, 400),
          ...loc,
          suggestedTools: [
            ...suggestGradle(platform, mc),
            ...docsSuggestion(platform, mc, "loom remap mappings", "Loom remap / mappings 官方说明"),
          ],
        });
      continue;
    }

    if (/BUILD FAILED|Compilation failed|编译失败/i.test(line)) {
      if (issues.length >= 40) dropped++;
      else
        issues.push({
          kind: "compilation_failure",
          message: line.trim().slice(0, 400),
          suggestedTools: [
            { tool: "diagnose_gradle", args: {}, reason: "先核对 Gradle/Loom/Neo 插件与 Java 版本" },
            ...noSymbolHint("这条只有 BUILD FAILED 头行"),
          ],
        });
      continue;
    }

    if (/Could not resolve|Could not find|依赖.*失败|Unresolved dependency/i.test(line)) {
      if (issues.length >= 40) dropped++;
      else
        issues.push({
          kind: "dependency",
          message: line.trim().slice(0, 400),
          suggestedTools: [
            {
              tool: "check_dependencies",
              args: {},
              reason: "启发式检查 loader / 库冲突",
            },
            ...suggestGradle(platform, mc),
          ],
        });
    }
  }

  // Deduplicate near-identical messages
  const seen = new Set<string>();
  const deduped: BuildLogIssue[] = [];
  for (const issue of issues) {
    const key = `${issue.kind}|${issue.symbol ?? ""}|${issue.file ?? ""}|${issue.message.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(issue);
  }

  const summary: string[] = [];
  if (deduped.length === 0) {
    summary.push(
      truncated
        ? `已识别 0 条：注意日志超过 ${LOG_MAX} 字节，只分析了头尾片段（省略 ${clamp.omittedBytes} 字节），中段可能还有真正的失败原因`
        : "未识别出典型 javac/Gradle 失败模式；可再贴含 error: cannot find symbol 的片段",
    );
  } else {
    const counts = new Map<string, number>();
    for (const i of deduped) counts.set(i.kind, (counts.get(i.kind) ?? 0) + 1);
    for (const [k, n] of counts) summary.push(`${k}: ${n}`);
  }
  if (truncated) {
    summary.push(
      `日志 ${clamp.totalBytes} 字节 > 上限 ${LOG_MAX}：按字节保留头部 + 尾部共 ${clamp.keptBytes} 字节，省略中段 ${clamp.omittedBytes} 字节`,
    );
  }
  if (dropped > 0) summary.push(`另有 ${dropped} 条命中被 40 条上限挤掉（issueCount 不是全部命中数）`);
  summary.push("本工具不执行 gradlew；修完后请用户在本机重跑构建");

  return {
    ok: true,
    truncated: truncated || undefined,
    totalBytes: clamp.totalBytes,
    keptBytes: clamp.keptBytes,
    omittedBytes: truncated ? clamp.omittedBytes : undefined,
    droppedMatches: dropped || undefined,
    issueCount: deduped.length,
    issues: deduped,
    summary,
  };
}
