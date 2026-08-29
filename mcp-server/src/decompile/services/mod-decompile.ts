/**
 * decompile_mod_jar 编排服务（T2）。
 *
 * 流程：参数校验 → Java 17 探测（FIRST）→ skip-download 门控 → 元数据分析
 *   →（可选 remap，需匹配 MC 版本）→ VineFlower 反编译到
 *   $CACHE/decompiled-mods/<modId>/<version>/ → 源码树摘要。
 *
 * 仅本地绝对路径 jar；缓存只写 $MC_SKILL_CACHE；不触碰项目目录。
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, join, relative, sep } from "path";
import { actionable, withAction, type ActionEnvelope } from "../../utils/actionable.js";
import { parseMinecraftVersion, type MappingChoice } from "../version-manager.js";
import {
  ensureCachePaths,
  openCacheDb,
  setArtifact,
  getArtifact,
  acquireCacheLock,
  CacheLockBusyError,
  normalizeArtifactPath,
  sanitizeCacheSegment,
  isPathInside,
} from "../cache.js";
import { probeJava, runJava, toolchainActionable, skipDownloadsEnabled, downloadDisabledActionable } from "../java/java-process.js";
import { ensureResourceJar, VINEFLOWER_DEF, TINY_REMAPPER_DEF, DownloadDisabledError } from "../downloaders/resources.js";
import { downloadFile, DownloadError } from "../downloaders/http.js";
import { resolveYarnMappings, mappingCacheViable } from "../downloaders/yarn.js";
import { resolveMojangVersion } from "../downloaders/mojang.js";
import { analyzeModJar } from "./mod-analyzer.js";
import { assertVineflowerDiskSpace } from "./java-pipeline.js";

export interface DecompileModJarArgs {
  jarPath: string;
  /** 匹配的 MC 版本（用于可选 remap；缺省则不 remap） */
  version?: string;
  /** remap 映射层（仅 1.14–1.21.11 有意义） */
  mapping?: "yarn" | "mojmap";
  force?: boolean;
}

export interface ModDecompileResult {
  found: boolean;
  modId?: string;
  modVersion?: string;
  loaders?: string[];
  version?: string;
  outputDir?: string;
  fileCount?: number;
  javaFileCount?: number;
  topLevelDirs?: string[];
  sampleFiles?: string[];
  truncated?: boolean;
  remapped?: boolean;
  /**
   * remap 抛错、已降级为「对原始 jar 反编译」。
   * 与 `remapped: false` 的区别：后者也可能是「26.1+ 免 remap」这种**正常**情况。
   */
  remapFailed?: boolean;
  /** 输出中的类/方法名为混淆名或中间名，不可当正式 API 使用。 */
  degraded?: boolean;
  warnings?: string[];
  note?: string;
  error?: string;
  action?: ActionEnvelope;
}

function tail(s: string, n = 800): string {
  const t = s.trim();
  return t.length > n ? "…" + t.slice(-n) : t;
}

function walkJava(dir: string, limit = 5000): { files: string[]; truncated: boolean } {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith(".java")) {
        if (out.length >= limit) return { files: out, truncated: true };
        out.push(full);
      }
    }
  }
  return { files: out, truncated: false };
}

function summarizeTree(outDir: string): { fileCount: number; javaFileCount: number; topLevelDirs: string[]; sampleFiles: string[]; truncated?: boolean } {
  const walked = walkJava(outDir);
  const javaFiles = walked.files;
  const topLevelDirs = readdirSync(outDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  const sampleFiles = javaFiles.slice(0, 15).map((f) => relative(outDir, f).split(sep).join("/"));
  return {
    fileCount: javaFiles.length,
    javaFileCount: javaFiles.length,
    topLevelDirs,
    sampleFiles,
    ...(walked.truncated ? { truncated: true } : {}),
  };
}

/**
 * remap 降级标记（纯函数，便于无 Java / 无网络的 CI 测试）。
 *
 * 区分三种情形，调用方据此判断输出是否可信：
 * - `remapped: true`         → 正常重映射，名称可信
 * - `remapped: false` 且无错 → **正常**免 remap（如 26.1+），不算降级
 * - `remapped: false` 且有错 → **降级**：输出为混淆/中间名，不可当正式 API 使用
 *
 * 背景：原实现把降级只写进 `note` 字符串，却仍返回 `found: true`，
 * 调用方无法可靠判定结果是否可用（输出混淆 jar 却报成功）。
 */
export function decompileDegradation(
  remapped: boolean,
  remapError: string | null,
): { remapFailed: boolean; degraded: boolean; warnings: string[] } {
  const failed = !remapped && remapError !== null;
  return {
    remapFailed: failed,
    degraded: failed,
    warnings: failed
      ? [
          `输出为混淆/中间名：remap 已失败降级（${remapError}），源码中的类/方法名不可当正式 API 使用。`,
        ]
      : [],
  };
}

/** 为 search_mod_code 定位：jarPath → 已反编译目录（cache.db 索引） */
export function findDecompiledDirForJar(jarPath: string, cacheRoot = ensureCachePaths().root): string | null {
  try {
    const db = openCacheDb(cacheRoot);
    try {
      const rec = getArtifact(db, `decompiled-mod:${normalizeArtifactPath(jarPath)}`);
      if (!rec || !existsSync(rec.path)) return null;
      return rec.path;
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

/** 记录 jar → 反编译目录映射 */
function recordDecompiledDir(jarPath: string, outDir: string, modId: string, cacheRoot: string): void {
  const db = openCacheDb(cacheRoot);
  try {
    setArtifact(db, `decompiled-mod:${normalizeArtifactPath(jarPath)}`, "decompiled-mod", outDir, { version: modId });
  } finally {
    db.close();
  }
}

export async function decompileModJar(args: DecompileModJarArgs): Promise<ModDecompileResult> {
  // 0. 参数校验
  if (!args.jarPath) {
    return withAction(
      { found: false, error: "INVALID_INPUT" },
      actionable("INVALID_INPUT", "jarPath 不能为空", ["传入本地 jar 的绝对路径"]),
    );
  }
  if (!existsSync(args.jarPath) || !statSync(args.jarPath).isFile()) {
    return withAction(
      { found: false, error: "NOT_FOUND", jarPath: args.jarPath },
      actionable("NOT_FOUND", `jar 不存在: ${args.jarPath}`, ["核对路径后重试"]),
    );
  }

  // 1. skip-download 门控（CI：先于 Java，保证 DOWNLOAD_DISABLED 可测）
  if (skipDownloadsEnabled()) {
    return withAction(
      { found: false, error: "DOWNLOAD_DISABLED", jarPath: args.jarPath },
      downloadDisabledActionable("decompile_mod_jar 需要下载 VineFlower 工具 jar"),
    );
  }

  // 2. Java 17+ 探测（绝不崩溃）
  const probe = await probeJava();
  if (!probe.ready) {
    return withAction(
      { found: false, error: "TOOLCHAIN_MISSING", jarPath: args.jarPath },
      toolchainActionable(
        `反编译模组需要 Java 17+（当前: ${probe.versionText ?? "未检测到 java"}）。`,
      ),
    );
  }

  // 3. 元数据分析
  const meta = analyzeModJar(args.jarPath);
  if (!meta.found) {
    return withAction({ found: false, error: meta.action?.code ?? "NOT_FOUND", jarPath: args.jarPath }, meta.action);
  }
  const modId = sanitizeCacheSegment(meta.modId ?? "unknown-mod");
  if (!modId) {
    return withAction(
      { found: false, error: "INVALID_INPUT", jarPath: args.jarPath },
      actionable("INVALID_INPUT", `modId 非法（含路径穿越或空段）：${meta.modId ?? ""}`, [
        "modId 只允许 [a-z0-9._-]，且不得为 `.` / `..` 或包含 `..`",
      ]),
    );
  }
  // Forge 的 mods.toml 版本可用 ${file.jarVersion} 占位符（加载时按 jar 文件名解析）。
  // 此处按 FML 语义回退：去 .jar 后缀、取最后一个 '-' 之后的片段。避免把占位符
  // 原样用作输出目录名（含 ".jar" 子串会让 VineFlower 走单文件保存路径而失败）。
  let rawModVersion = meta.modVersion ?? "unknown";
  if (rawModVersion.includes("${file.jarVersion}")) {
    const stem = basename(args.jarPath).replace(/\.jar$/i, "");
    const dash = stem.lastIndexOf("-");
    rawModVersion = dash >= 0 ? stem.slice(dash + 1) : stem;
  }
  const modVersion = sanitizeCacheSegment(rawModVersion);
  if (!modVersion) {
    return withAction(
      { found: false, error: "INVALID_INPUT", jarPath: args.jarPath },
      actionable("INVALID_INPUT", `modVersion 非法（含路径穿越或空段）：${rawModVersion}`, [
        "version 只允许 [a-z0-9._-]，且不得为 `.` / `..` 或包含 `..`",
      ]),
    );
  }
  const cache = ensureCachePaths();
  const outDir = join(cache.decompiledMods, modId, modVersion);
  if (!isPathInside(cache.decompiledMods, outDir)) {
    return withAction(
      { found: false, error: "INVALID_INPUT", jarPath: args.jarPath },
      actionable("INVALID_INPUT", "反编译输出目录逃出 decompiled-mods", [
        "modId/modVersion 不得把产物写到 $MC_SKILL_CACHE/decompiled-mods 之外",
      ]),
    );
  }

  // 并发防护：同一 jar 的反编译/重映射只允许一个任务持有缓存锁（B13）
  let release: (() => void) | undefined;
  try {
    release = await acquireCacheLock(
      cache.root,
      `mod-decompile:${normalizeArtifactPath(outDir)}`,
      10 * 60_000,
    );
  } catch (err) {
    if (err instanceof CacheLockBusyError) {
      return withAction(
        { found: false, error: "LOCK_BUSY", jarPath: args.jarPath },
        actionable("LOCK_BUSY", "另一并发反编译任务持有该模组的缓存锁。", ["稍后重试（或确认无并发后清除过期锁）"]),
      );
    }
    throw err;
  }
  try {
  if (!args.force && existsSync(outDir) && readdirSync(outDir).length > 0 && readDecompiledMeta(outDir).found) {
    const metaHit = readDecompiledMeta(outDir);
    const cachedJar = normalizeArtifactPath(metaHit.jarPath ?? "");
    const wantJar = normalizeArtifactPath(args.jarPath);
    if (!metaHit.jarPath || cachedJar === wantJar) {
      return {
        found: true,
        modId,
        modVersion,
        loaders: meta.loaders,
        version: args.version,
        outputDir: outDir,
        ...summarizeTree(outDir),
        remapped: false,
        note: "缓存命中（decompiled-mods）。",
      };
    }
  }

  // 4. 可选 remap（仅 1.14–1.21.11 + yarn/mojmap 有意义；26.1+ 免 remap）
  let inputJar = args.jarPath;
  let remapped = false;
  let remapError: string | null = null;
  if (args.version) {
    const vi = parseMinecraftVersion(args.version);
    if (vi.valid && vi.supported && !vi.unobfuscated) {
      const mapping: MappingChoice = args.mapping === "mojmap" ? "mojmap" : "yarn";
      try {
        const tiny = await ensureResourceJar(TINY_REMAPPER_DEF, { cacheRoot: cache.root });
        // 缓存键：yarn 用 yarn-named（两步最终产物），避免命中旧单步 official→intermediary 的
        // `mod-*-yarn.jar`（仅 intermediary 名）。中间步独立键 yarn-intermediary。
        const remapStem =
          mapping === "yarn"
            ? sanitizeCacheSegment(`mod-${modId}-${modVersion}-yarn-named`)
            : sanitizeCacheSegment(`mod-${modId}-${modVersion}-mojmap`);
        if (!remapStem) {
          throw new Error("remap 输出文件名非法（含路径穿越）");
        }
        const remappedJar = join(cache.remapped, `${remapStem}.jar`);
        if (!isPathInside(cache.remapped, remappedJar)) {
          throw new Error("remap 输出路径逃出 remapped 缓存目录");
        }
        if (!existsSync(remappedJar) || args.force) {
          let mappings: string;
          if (mapping === "yarn") {
            const info = await resolveYarnMappings(args.version);
            const yarnPath = join(cache.mappings, `yarn-${args.version}.jar`);
            if (!mappingCacheViable(cache.root, yarnPath, `mc-mappings:${args.version}:yarn`)) {
              const dl = await downloadFile(info.jarUrl, yarnPath, { label: `yarn mappings ${info.build}` });
              const db = openCacheDb(cache.root);
              try {
                setArtifact(db, `mc-mappings:${args.version}:yarn`, "mappings", yarnPath, {
                  version: info.build,
                  sha256: dl.sha256,
                });
              } finally {
                db.close();
              }
            }
            mappings = yarnPath;
          } else {
            const entry = await resolveMojangVersion(args.version);
            if (!entry.clientMappingsUrl) {
              throw new DownloadError("MAPPINGS_NOT_FOUND", `版本 ${args.version} 无 client_mappings`);
            }
            const mojmapPath = join(cache.mappings, `mojmap-${args.version}.txt`);
            if (!mappingCacheViable(cache.root, mojmapPath, `mc-mappings:${args.version}:mojmap`)) {
              const dl = await downloadFile(entry.clientMappingsUrl, mojmapPath, {
                label: `mojmap ${args.version}`,
                expectedSha1: entry.clientMappingsSha1 ?? null,
              });
              const db = openCacheDb(cache.root);
              try {
                setArtifact(db, `mc-mappings:${args.version}:mojmap`, "mappings", mojmapPath, {
                  version: args.version,
                  sha256: dl.sha256,
                });
              } finally {
                db.close();
              }
            }
            mappings = mojmapPath;
          }
          if (mapping === "yarn") {
            const step1Stem = sanitizeCacheSegment(`mod-${modId}-${modVersion}-yarn-intermediary`);
            if (!step1Stem) {
              throw new Error("remap 中间文件名非法（含路径穿越）");
            }
            const step1 = join(cache.remapped, `${step1Stem}.jar`);
            if (!isPathInside(cache.remapped, step1)) {
              throw new Error("remap 中间路径逃出 remapped 缓存目录");
            }
            const r1 = await runJava([
              "-jar", tiny,
              "--forceLocal", "--ignoreConflicts",
              args.jarPath, step1, mappings, "official", "intermediary",
            ]);
            if (r1.code !== 0) {
              throw new Error(`模组 remap 失败 step1 official→intermediary(code=${r1.code}): ${tail(r1.stderr)}`);
            }
            const r2 = await runJava([
              "-jar", tiny,
              "--forceLocal", "--ignoreConflicts",
              step1, remappedJar, mappings, "intermediary", "named",
            ]);
            if (r2.code !== 0) {
              throw new Error(`模组 remap 失败 step2 intermediary→named(code=${r2.code}): ${tail(r2.stderr)}`);
            }
          } else {
            const r = await runJava([
              "-jar", tiny,
              "--forceLocal", "--ignoreConflicts",
              args.jarPath, remappedJar, mappings, "official", "mojmap",
            ]);
            if (r.code !== 0) {
              throw new Error(`模组 remap 失败(code=${r.code}): ${tail(r.stderr)}`);
            }
          }
        }
        inputJar = remappedJar;
        remapped = true;
      } catch (err) {
        // remap 失败 → 诚实降级：保留错误信息到 note，用原始 jar 反编译
        remapped = false;
        remapError = (err as Error).message;
        inputJar = args.jarPath;
      }
    }
  }

  // 5. VineFlower 反编译
  try {
    const vineflower = await ensureResourceJar(VINEFLOWER_DEF, { cacheRoot: cache.root });
    mkdirSync(outDir, { recursive: true });
    assertVineflowerDiskSpace(outDir, inputJar);
    const r = await runJava(["-jar", vineflower, "-dgs=1", "-asc=1", inputJar, outDir]);
    if (r.code !== 0) {
      return withAction(
        { found: false, error: "DECOMPILE_FAILED", modId, outputDir: outDir },
        actionable("DECOMPILE_FAILED", `VineFlower 失败(code=${r.code}): ${tail(r.stderr)}`, [
          "请将完整 stderr 贴给开发者",
          "可重试：decompile_mod_jar { jarPath, force: true }",
        ]),
      );
    }
  } catch (err) {
    if (err instanceof DownloadDisabledError) {
      return withAction(
        { found: false, error: "DOWNLOAD_DISABLED", modId },
        downloadDisabledActionable(err.message),
      );
    }
    if (err instanceof DownloadError) {
      return withAction(
        { found: false, error: err.code, modId },
        actionable(err.code, err.message, ["检查网络后重试", "或手动预置 jar 到 $MC_SKILL_CACHE/resources/"]),
      );
    }
    if ((err as { code?: string }).code === "DISK_INSUFFICIENT") {
      return withAction(
        { found: false, error: "DISK_INSUFFICIENT", modId },
        actionable("DISK_INSUFFICIENT", (err as Error).message, ["清理磁盘后重试"]),
      );
    }
    return withAction(
      { found: false, error: "DECOMPILE_FAILED", modId },
      actionable("DECOMPILE_FAILED", (err as Error).message, ["重试或反馈开发者"]),
    );
  }

  recordDecompiledDir(args.jarPath, outDir, modId, cache.root);
  writeDecompiledMeta(outDir, args.jarPath);
  // remap 失败降级后输出的是混淆/中间名，必须在**结构字段**上诚实暴露，
  // 不能只写进 note——调用方无法从字符串里可靠判定结果是否可用。
  return {
    found: true,
    modId,
    modVersion,
    loaders: meta.loaders,
    version: args.version,
    outputDir: outDir,
    ...summarizeTree(outDir),
    remapped,
    ...decompileDegradation(remapped, remapError),
    note: remapped
      ? `已按 ${args.version} 重映射后反编译（yarn 两步 / mojmap 单步）。`
      : remapError
        ? `重映射失败已跳过（${remapError}），按原始字节码反编译（名称可能为混淆/中间名）。可用 search_mod_code 检索。`
        : "未重映射（26.1+ 免 remap，或未提供匹配版本）。可用 search_mod_code 检索。",
  };
  } finally {
    release?.();
  }
}

/** 记录本次反编译完成标记（search_mod_code / readDecompiledMeta 以此为缓存完成判据） */
export function writeDecompiledMeta(dir: string, jarPath: string): void {
  const metaFile = join(dir, ".mc-skill-decompiled.json");
  writeFileSync(
    metaFile,
    JSON.stringify({ jarPath, completedAt: new Date().toISOString() }, null, 2) + "\n",
    "utf8",
  );
}

/** 读取反编译目录信息（search_mod_code / 缓存命中判据） */
export function readDecompiledMeta(dir: string): { found: boolean; jarPath?: string; note?: string } {
  const metaFile = join(dir, ".mc-skill-decompiled.json");
  if (!existsSync(metaFile)) return { found: false };
  try {
    const json = JSON.parse(readFileSync(metaFile, "utf8")) as { jarPath?: string };
    return { found: true, jarPath: json.jarPath };
  } catch {
    return { found: false };
  }
}
