/**
 * decompile_mod_jar 编排服务（T2）。
 *
 * 流程：参数校验 → Java 17 探测（FIRST）→ skip-download 门控 → 元数据分析
 *   →（可选 remap，需匹配 MC 版本）→ VineFlower 反编译到
 *   $CACHE/decompiled-mods/<modId>/<version>/ → 源码树摘要。
 *
 * 仅本地绝对路径 jar；缓存只写 $MC_SKILL_CACHE；不触碰项目目录。
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, join, relative, sep } from "path";
import { actionable, withAction, type ActionEnvelope } from "../../utils/actionable.js";
import { parseMinecraftVersion, type MappingChoice } from "../version-manager.js";
import { ensureCachePaths, openCacheDb, setArtifact, getArtifact } from "../cache.js";
import { probeJava, runJava, toolchainActionable, skipDownloadsEnabled, downloadDisabledActionable } from "../java/java-process.js";
import { ensureResourceJar, VINEFLOWER_DEF, TINY_REMAPPER_DEF, DownloadDisabledError } from "../downloaders/resources.js";
import { downloadFile, DownloadError } from "../downloaders/http.js";
import { resolveYarnMappings, mappingCacheViable } from "../downloaders/yarn.js";
import { resolveMojangVersion } from "../downloaders/mojang.js";
import { analyzeModJar } from "./mod-analyzer.js";

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
  remapped?: boolean;
  note?: string;
  error?: string;
  action?: ActionEnvelope;
}

function tail(s: string, n = 800): string {
  const t = s.trim();
  return t.length > n ? "…" + t.slice(-n) : t;
}

function walkJava(dir: string, limit = 5000): string[] {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length > 0 && out.length < limit) {
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
      else if (e.isFile() && e.name.endsWith(".java")) out.push(full);
    }
  }
  return out;
}

function summarizeTree(outDir: string): { fileCount: number; javaFileCount: number; topLevelDirs: string[]; sampleFiles: string[] } {
  const javaFiles = walkJava(outDir);
  const topLevelDirs = readdirSync(outDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  const sampleFiles = javaFiles.slice(0, 15).map((f) => relative(outDir, f).split(sep).join("/"));
  return { fileCount: javaFiles.length, javaFileCount: javaFiles.length, topLevelDirs, sampleFiles };
}

/** 为 search_mod_code 定位：jarPath → 已反编译目录（cache.db 索引） */
export function findDecompiledDirForJar(jarPath: string, cacheRoot = ensureCachePaths().root): string | null {
  const db = openCacheDb(cacheRoot);
  try {
    const rec = getArtifact(db, `decompiled-mod:${jarPath}`);
    if (!rec || !existsSync(rec.path)) return null;
    return rec.path;
  } finally {
    db.close();
  }
}

/** 记录 jar → 反编译目录映射 */
function recordDecompiledDir(jarPath: string, outDir: string, modId: string, cacheRoot: string): void {
  const db = openCacheDb(cacheRoot);
  try {
    setArtifact(db, `decompiled-mod:${jarPath}`, "decompiled-mod", outDir, { version: modId });
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
  const modId = (meta.modId ?? "unknown-mod").replace(/[^a-z0-9._-]/gi, "_");
  // Forge 的 mods.toml 版本可用 ${file.jarVersion} 占位符（加载时按 jar 文件名解析）。
  // 此处按 FML 语义回退：去 .jar 后缀、取最后一个 '-' 之后的片段。避免把占位符
  // 原样用作输出目录名（含 ".jar" 子串会让 VineFlower 走单文件保存路径而失败）。
  let rawModVersion = meta.modVersion ?? "unknown";
  if (rawModVersion.includes("${file.jarVersion}")) {
    const stem = basename(args.jarPath).replace(/\.jar$/i, "");
    const dash = stem.lastIndexOf("-");
    rawModVersion = dash >= 0 ? stem.slice(dash + 1) : stem;
  }
  const modVersion = rawModVersion.replace(/[^a-z0-9._-]/gi, "_");
  const cache = ensureCachePaths();
  const outDir = join(cache.decompiledMods, modId, modVersion);

  if (!args.force && existsSync(outDir) && readdirSync(outDir).length > 0) {
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
        const remappedJar =
          mapping === "yarn"
            ? join(cache.remapped, `mod-${modId}-${modVersion}-yarn-named.jar`)
            : join(cache.remapped, `mod-${modId}-${modVersion}-mojmap.jar`);
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
              const dl = await downloadFile(entry.clientMappingsUrl, mojmapPath, { label: `mojmap ${args.version}` });
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
            const step1 = join(cache.remapped, `mod-${modId}-${modVersion}-yarn-intermediary.jar`);
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
    return withAction(
      { found: false, error: "DECOMPILE_FAILED", modId },
      actionable("DECOMPILE_FAILED", (err as Error).message, ["重试或反馈开发者"]),
    );
  }

  recordDecompiledDir(args.jarPath, outDir, modId, cache.root);
  return {
    found: true,
    modId,
    modVersion,
    loaders: meta.loaders,
    version: args.version,
    outputDir: outDir,
    ...summarizeTree(outDir),
    remapped,
    note: remapped
      ? `已按 ${args.version} 重映射后反编译（yarn 两步 / mojmap 单步）。`
      : remapError
        ? `重映射失败已跳过（${remapError}），按原始字节码反编译（名称可能为混淆/中间名）。可用 search_mod_code 检索。`
        : "未重映射（26.1+ 免 remap，或未提供匹配版本）。可用 search_mod_code 检索。",
  };
}

/** 可选项：读取反编译目录信息（供 search_mod_code 使用） */
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
