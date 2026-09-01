/**
 * get_minecraft_source 编排服务（T2）。
 *
 * 管线：解析版本 → Java 17 探测（FIRST）→ skip-download 门控 → 缓存命中
 *   → prepareInputs（下载 client jar / 映射 / 工具 jar）→ remapClientJar
 *   （yarn 两步 official→intermediary→named；26.1+ 免 remap）→ decompileJar
 *   （VineFlower）→ 定位类 → 源码片段。
 *
 * 默认零下载：不预热、不预取；仅用户显式调用时下载到 $MC_SKILL_CACHE。
 * 诚实失败：任何一步失败 → found:false + actionable，不假成功、不崩溃。
 */

import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { actionable, withAction, versionRequiredAction, missingMcVersion, type ActionEnvelope } from "../../utils/actionable.js";
import {
  parseMinecraftVersion,
  resolveMappingChoice,
  mappingDirName,
  type MappingChoice,
} from "../version-manager.js";
import { ensureCachePaths, openCacheDb, setArtifact, acquireCacheLock, CacheLockBusyError } from "../cache.js";
import {
  probeJava,
  toolchainActionable,
  skipDownloadsEnabled,
  downloadDisabledActionable,
} from "../java/java-process.js";
import { DownloadError } from "../downloaders/http.js";
import { DownloadDisabledError } from "../downloaders/resources.js";
import { prepareInputs, remapClientJar, decompileJar } from "./java-pipeline.js";

export interface MinecraftSourceArgs {
  version?: string;
  className: string;
  mapping?: "yarn" | "mojmap" | "auto";
  /** [start, end]（1-based 闭区间）行区间，默认整文件前 120 行 */
  lines?: [number, number];
  force?: boolean;
}

export interface SourceSnippetLine {
  line: number;
  text: string;
}

export interface MinecraftSourceResult {
  found: boolean;
  version?: string;
  mapping?: MappingChoice;
  className?: string;
  sourceFile?: string;
  totalLines?: number;
  snippet?: SourceSnippetLine[];
  cached?: boolean;
  remap?: "two-step-yarn" | "single-step-mojmap" | "none";
  note?: string;
  error?: string;
  action?: ActionEnvelope;
}

const SNIPPET_DEFAULT_LINES = 120;

/** className → jar 内相对路径（net.minecraft.world.item.Item → net/minecraft/world/item/Item） */
export function classToRelPath(className: string): { ok: boolean; relPath?: string; error?: string } {
  const cls = (className ?? "").trim().replace(/\.java$/i, "");
  if (!cls) return { ok: false, error: "className 不能为空" };
  if (cls.includes("..") || cls.includes("\\") || cls.startsWith("/")) {
    return { ok: false, error: `className 格式非法: ${className}` };
  }
  const relPath = cls.includes("/") ? cls : cls.replace(/\./g, "/");
  return { ok: true, relPath };
}

function readSnippet(file: string, lines?: [number, number]): { totalLines: number; snippet: SourceSnippetLine[]; error?: string } {
  const text = readFileSync(file, "utf8");
  const all = text.split(/\r?\n/);
  const total = all.length;
  let start = 1;
  let end = Math.min(total, SNIPPET_DEFAULT_LINES);
  if (Array.isArray(lines) && lines.length === 2) {
    const [s, e] = lines;
    if (!Number.isFinite(s) || !Number.isFinite(e) || s < 1 || e < s) {
      return { totalLines: total, snippet: [], error: `非法 lines 区间 [${s}, ${e}]，须 1-based 且 start<=end，禁止静默改范围` };
    }
    start = Math.min(s, total);
    end = Math.min(e, total);
  }
  const snippet: SourceSnippetLine[] = [];
  for (let i = start; i <= end; i++) {
    snippet.push({ line: i, text: all[i - 1] });
  }
  return { totalLines: total, snippet };
}

function toErrorResult(
  error: string,
  action: ActionEnvelope,
  extra: Record<string, unknown> = {},
): MinecraftSourceResult {
  return withAction({ found: false, error, ...extra }, action);
}

export async function getMinecraftSource(args: MinecraftSourceArgs): Promise<MinecraftSourceResult> {
  if (missingMcVersion(args.version)) {
    return toErrorResult("VERSION_REQUIRED", versionRequiredAction());
  }
  const version = args.version!.trim();

  // 0. 参数校验（版本 / 映射 / 类名）
  const vi = parseMinecraftVersion(version);
  if (!vi.valid || !vi.supported) {
    return toErrorResult("INVALID_INPUT", actionable("INVALID_INPUT", vi.error ?? `版本无效: ${version}`, [
      "支持区间：1.14–1.21.11（yarn/mojmap）与 26.1+（mojmap only）",
      "示例：1.20.1、1.21.11、26.1",
    ]), { version });
  }
  const choice = resolveMappingChoice(args.mapping, vi);
  if (choice.error) {
    return toErrorResult("INVALID_INPUT", actionable("INVALID_INPUT", choice.error, [
      "26.1+ 已去混淆，仅 mojmap（免 remap）",
      "1.14–1.21.11 可用 yarn（两步 remap）或 mojmap",
    ]), { version });
  }
  const mapping = choice.mapping!;
  const cls = classToRelPath(args.className);
  if (!cls.ok) {
    return toErrorResult("INVALID_INPUT", actionable("INVALID_INPUT", cls.error ?? "className 非法", [
      "示例：net.minecraft.world.item.Item",
    ]), { version, mapping });
  }
  const relPath = cls.relPath!;

  // 1. skip-download 门控（CI：先于 Java 探测，保证断言 DOWNLOAD_DISABLED）
  if (skipDownloadsEnabled()) {
    return toErrorResult("DOWNLOAD_DISABLED", downloadDisabledActionable(
      `get_minecraft_source 需要下载 client jar / 映射 / 工具 jar（${version}）`,
    ), { version, mapping, className: args.className });
  }

  // 2. Java 17+ 工具链探测（绝不崩溃）
  const probe = await probeJava();
  if (!probe.ready) {
    return toErrorResult("TOOLCHAIN_MISSING", toolchainActionable(
      `需要 Java 17+ 才能下载/重映射/反编译 MC 源码（当前: ${probe.versionText ?? "未检测到 java"}）。`,
    ), { version, mapping, className: args.className });
  }

  const cache = ensureCachePaths();
  const cacheDir = join(cache.decompiled, version, mappingDirName(mapping));
  const sourceFile = join(cacheDir, `${relPath}.java`);

  // 3. 缓存命中（非 force）
  if (!args.force && existsSync(sourceFile) && statSync(sourceFile).size > 0) {
    const sn = readSnippet(sourceFile, args.lines);
    if (sn.error) {
      return toErrorResult("INVALID_INPUT", actionable("INVALID_INPUT", sn.error, ["传入 lines=[start,end]，1-based 且 start<=end"]), { version });
    }
    const { totalLines, snippet } = sn;
    return {
      found: true,
      version,
      mapping,
      className: args.className.trim().replace(/\.java$/i, ""),
      sourceFile,
      totalLines,
      snippet,
      cached: true,
      remap: vi.unobfuscated ? "none" : mapping === "yarn" ? "two-step-yarn" : "single-step-mojmap",
    };
  }

  // 4. 同版本同映射并发互斥
  let release: () => void;
  try {
    release = await acquireCacheLock(cache.root, `mc-src-${version}-${mapping}`, 15 * 60_000);
  } catch (err) {
    if (err instanceof CacheLockBusyError) {
      return toErrorResult("CACHE_LOCK_BUSY", actionable("CACHE_LOCK_BUSY", err.message, [
        "同版本反编译进行中，稍后重试（缓存命中后 <1s）",
      ]), { version, mapping });
    }
    throw err;
  }

  try {
    // 5. 下载 + 重映射 + 反编译
    const gate = await prepareInputs(version, mapping, cache.root, { force: args.force === true });
    const { jar, how } = await remapClientJar(gate, version, mapping);
    const { outDir, file } = await decompileJar(gate, jar, version, mapping, relPath);
    if (!existsSync(file)) {
      return toErrorResult("CLASS_NOT_FOUND", actionable("CLASS_NOT_FOUND", `反编译完成但未找到类 ${relPath}`, [
        "确认 className 的包路径正确（可用 query_api 先确认类存在）",
        `已反编译目录: ${outDir}`,
      ]), { version, mapping, outDir });
    }
    const db = openCacheDb(cache.root);
    try {
      setArtifact(db, `mc-decompiled:${version}:${mapping}`, "decompiled", outDir, { version });
    } finally {
      db.close();
    }
    const sn = readSnippet(file, args.lines);
    if (sn.error) {
      return toErrorResult("INVALID_INPUT", actionable("INVALID_INPUT", sn.error, ["传入 lines=[start,end]，1-based 且 start<=end"]), { version });
    }
    const { totalLines, snippet } = sn;
    return {
      found: true,
      version,
      mapping,
      className: args.className.trim().replace(/\.java$/i, ""),
      sourceFile: file,
      totalLines,
      snippet,
      cached: false,
      remap: how,
      note:
        "首次反编译需下载并处理数百 MB（约 3–10 分钟）；之后同版本缓存命中 <1s。若需整版本源码，后续调用将直接命中。",
    };
  } catch (err) {
    if (err instanceof DownloadDisabledError) {
      return toErrorResult("DOWNLOAD_DISABLED", downloadDisabledActionable(err.message), { version, mapping });
    }
    if (err instanceof DownloadError) {
      return toErrorResult(err.code, actionable(err.code, err.message, [
        "检查网络后重试",
        "或手动将文件放入 $MC_SKILL_CACHE 对应目录（哈希须匹配）",
      ]), { version, mapping });
    }
    if ((err as { code?: string }).code === "MAPPINGS_EMPTY") {
      return toErrorResult("MAPPINGS_EMPTY", actionable("MAPPINGS_EMPTY", (err as Error).message, [
        "删除该映射文件后重试（force: true），让它重新下载并解析",
        "tiny-remapper 对空映射仍会退出码 0 并产出混淆 jar，因此这里直接失败而不是返回结果",
      ]), { version, mapping });
    }
    if ((err as { code?: string }).code === "DISK_INSUFFICIENT") {
      return toErrorResult("DISK_INSUFFICIENT", actionable("DISK_INSUFFICIENT", (err as Error).message, [
        "清理磁盘后重试",
        "或缩小 MC_SKILL_CACHE 所在卷的占用",
      ]), { version, mapping });
    }
    return toErrorResult("DECOMPILE_FAILED", actionable("DECOMPILE_FAILED", (err as Error).message, [
      "若为 Java 子进程失败，请将完整 stderr 贴给开发者",
      "可重试：get_minecraft_source { version, className, force: true }",
    ]), { version, mapping });
  } finally {
    release();
  }
}
