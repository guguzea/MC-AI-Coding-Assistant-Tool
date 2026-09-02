/**
 * T2 反编译工具族公开入口（4 个工具 handler）。
 *
 * 约束（全局红线）：
 * - 默认零下载：无预热/预取，仅用户显式调用时按需下载到 $MC_SKILL_CACHE
 * - Java 17+ 门控：Java 探测 FIRST，缺失/过旧 → actionable(TOOLCHAIN_MISSING)，不崩溃
 * - MC_SKILL_SKIP_DOWNLOAD=1：跳过下载，诚实失败（CI 语义）
 * - 诚实失败：found:false + actionable，禁假成功
 * - 缓存只写 $MC_SKILL_CACHE；不触碰 MC_SKILL_ALLOW_WRITE / 项目目录
 */

import { existsSync } from "fs";
import { actionable } from "../utils/actionable.js";
import { getMinecraftSource, type MinecraftSourceArgs } from "./services/decompile-service.js";
import { analyzeModJar } from "./services/mod-analyzer.js";
import { decompileModJar, findDecompiledDirForJar, type DecompileModJarArgs } from "./services/mod-decompile.js";
import { searchModSource } from "./services/search-mod-source.js";
import { ensureCachePaths } from "./cache.js";

export { getMinecraftSource, classToRelPath, type MinecraftSourceArgs, type MinecraftSourceResult } from "./services/decompile-service.js";
export { analyzeModJar, type ModMetadata } from "./services/mod-analyzer.js";
export { decompileModJar, findDecompiledDirForJar } from "./services/mod-decompile.js";
export { searchModSource } from "./services/search-mod-source.js";
export { parseMinecraftVersion, resolveMappingChoice, type VersionInfo } from "./version-manager.js";
export { probeJava, toolchainActionable } from "./java/java-process.js";

export interface AnalyzeModJarArgs {
  jarPath: string;
  version?: string;
}

export interface SearchModCodeArgs {
  jarPath?: string;
  decompiledDir?: string;
  query: string;
  pattern?: boolean;
  maxResults?: number;
}

/** analyze_mod_jar handler：version 与 jar 元数据声明的 MC 版本约束比对，回显 versionMatch */
export function analyzeModJarHandler(args: AnalyzeModJarArgs) {
  return analyzeModJar(args.jarPath, args.version);
}

/** search_mod_code handler：decompiledDir 或 jarPath（经 cache.db 索引定位） */
export function searchModCodeHandler(args: SearchModCodeArgs) {
  let root = args.decompiledDir?.trim();
  let viaJar: string | null = null;

  if (!root && args.jarPath) {
    if (!existsSync(args.jarPath)) {
      return {
        found: false,
        query: args.query,
        root: args.jarPath,
        hits: [],
        total: 0,
        truncated: false,
        action: actionable("NOT_FOUND", `jar 不存在: ${args.jarPath}`, ["核对路径后重试"]),
      };
    }
    const dir = findDecompiledDirForJar(args.jarPath, ensureCachePaths().root);
    if (dir) {
      root = dir;
      viaJar = args.jarPath;
    } else {
      return {
        found: false,
        query: args.query,
        root: args.jarPath,
        hits: [],
        total: 0,
        truncated: false,
        action: actionable(
          "NOT_DECOMPILED",
          `该 jar 尚未反编译（${args.jarPath}）`,
          ["先调用 decompile_mod_jar { jarPath } 生成源码", "或直接传 decompiledDir"],
          ["decompile_mod_jar"],
        ),
      };
    }
  }

  if (!root) {
    return {
      found: false,
      query: args.query,
      root: "",
      hits: [],
      total: 0,
      truncated: false,
      action: actionable("INVALID_INPUT", "需要 decompiledDir 或 jarPath（已反编译过）", [
        "传 decompiledDir（反编译目录绝对路径）",
        "或传 jarPath（须先 decompile_mod_jar）",
      ]),
    };
  }

  const result = searchModSource({
    root,
    query: args.query,
    pattern: args.pattern,
    maxResults: args.maxResults,
  });
  return { ...result, viaJar };
}

/** get_minecraft_source handler（薄包装） */
export function getMinecraftSourceHandler(args: MinecraftSourceArgs) {
  return getMinecraftSource(args);
}

/** decompile_mod_jar handler（薄包装） */
export function decompileModJarHandler(args: DecompileModJarArgs) {
  return decompileModJar(args);
}
