/**
 * 数据目录解析工具
 *
 * 本文件解决 MCP Server 运行时数据目录定位问题。
 * 策略（按可靠性从高到低）：
 * 1. MC_SKILL_DATA 环境变量
 * 2. import.meta.url 推导（运行时）
 * 3. process.cwd() 回退
 */

import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

function getSelfDir(): string {
  try {
    return dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

function getDataDirFromSelf(): string {
  // 推导 data 目录：
  // - dist/utils/path.js → dist/utils/ → dist/ → mcp-server/ → MC_skill/ → data/
  const selfDir = getSelfDir();
  return join(selfDir, "..", "..", "..", "data");
}

function getDataDirFromEnv(): string | null {
  const envPath = process.env.MC_SKILL_DATA;
  if (!envPath) {
    console.error(
      "[mc-mcp-server] WARN: 未设置 MC_SKILL_DATA，将尝试从安装路径或 cwd 推导 data/。" +
        "推荐设置 MC_SKILL_DATA 为 data 目录的绝对路径。",
    );
    return null;
  }
  if (existsSync(envPath)) return envPath;
  console.error(
    `[mc-mcp-server] WARN: MC_SKILL_DATA=${envPath} 不存在，已回退到推导/cwd 路径。` +
      `请检查路径是否为 data 目录的绝对路径（例如 H:/MC_skill/data）。`,
  );
  return null;
}

function getDataDirFromCwd(): string {
  return join(process.cwd(), "data");
}

function getRepoRootFromSelf(): string {
  // dist/utils → dist → mcp-server → repo root
  return join(getSelfDir(), "..", "..", "..");
}

/**
 * 解析数据目录路径（外部调用接口）
 * 按以下优先级：
 * 1. MC_SKILL_DATA 环境变量
 * 2. 从 import.meta.url 推导
 * 3. process.cwd()/data
 *
 * @param subpaths  可选子路径，join 到数据根目录之后
 *                  示例：resolveDataDir("forge_1.20.1", "extracted") → data/forge_1.20.1/extracted
 */
export function resolveDataDir(...subpaths: string[]): string {
  // 策略 1：环境变量
  const fromEnv = getDataDirFromEnv();
  const base = fromEnv ? fromEnv : (existsSync(getDataDirFromSelf()) ? getDataDirFromSelf() : getDataDirFromCwd());

  if (subpaths.length === 0) return base;
  return join(base, ...subpaths);
}

/**
 * 社区知识库目录（community_knowledge/）
 * 优先级：
 * 1. MC_SKILL_COMMUNITY
 * 2. dirname(MC_SKILL_DATA)/community_knowledge
 * 3. 仓库根 / community_knowledge
 * 4. cwd/community_knowledge
 */
export function resolveCommunityDir(...subpaths: string[]): string {
  const env = process.env.MC_SKILL_COMMUNITY;
  let base: string | null = null;
  if (env && existsSync(env)) {
    base = env;
  } else {
    const dataDir = resolveDataDir();
    const sibling = join(dirname(dataDir), "community_knowledge");
    if (existsSync(sibling)) base = sibling;
    else {
      const fromSelf = join(getRepoRootFromSelf(), "community_knowledge");
      if (existsSync(fromSelf)) base = fromSelf;
      else base = join(process.cwd(), "community_knowledge");
    }
  }
  if (subpaths.length === 0) return base;
  return join(base, ...subpaths);
}

/**
 * 诊断数据目录配置（供 MCP 工具 diagnose_data_paths 使用）
 * 返回各平台数据目录的可用性状态。
 */
export function diagnoseDataPaths(): {
  resolvedDataDir: string;
  sources: string[];
  platforms: Record<string, { status: string; path: string; details: string }>;
  community: { status: string; path: string; details: string; env: string | null };
} {
  const sources: string[] = [];
  const envPath = process.env.MC_SKILL_DATA;
  if (envPath) sources.push(`MC_SKILL_DATA=${envPath}`);
  const communityEnv = process.env.MC_SKILL_COMMUNITY;
  if (communityEnv) sources.push(`MC_SKILL_COMMUNITY=${communityEnv}`);
  sources.push(`cwd=${process.cwd()}`);
  sources.push(`self=${getSelfDir()}`);

  const dataDir = resolveDataDir();
  const platforms: Record<string, { status: string; path: string; details: string }> = {};

  for (const platform of ["forge", "fabric", "neoforge"] as const) {
    const prefix = `${platform}_`;
    let status = "not_found";
    let details = "";
    let path = "";
    try {
      if (existsSync(dataDir)) {
        const entries = readdirSync(dataDir, { withFileTypes: true });
        const matching = entries.filter(e => e.isDirectory() && e.name.startsWith(prefix));
        if (matching.length > 0) {
          status = "found";
          path = join(dataDir, matching[0].name);
          details = `Found ${matching.length} version(s): ${matching.map(e => e.name).join(", ")}`;
        } else {
          status = "empty";
          details =
            `Directory ${dataDir} exists but no ${prefix}* documentation indexes found. ` +
            `Document tools for ${platform} will return PLATFORM_DATA_MISSING until you download that platform's data pack.`;
        }
      } else {
        status = "not_found";
        details = `Data directory not found at ${dataDir}`;
      }
    } catch (err) {
      status = "error";
      details = String(err);
    }
    platforms[platform] = { status, path, details };
  }

  const communityPath = resolveCommunityDir();
  const communityIndex = join(communityPath, "indexes", "index-l0.json");
  let communityStatus = "not_found";
  let communityDetails = "";
  try {
    if (!existsSync(communityPath)) {
      communityStatus = "not_found";
      communityDetails = `Community directory not found at ${communityPath}`;
    } else if (!existsSync(communityIndex)) {
      communityStatus = "empty";
      communityDetails = `Directory exists but indexes/index-l0.json missing`;
    } else {
      communityStatus = "found";
      communityDetails = `index-l0.json present`;
    }
  } catch (err) {
    communityStatus = "error";
    communityDetails = String(err);
  }

  return {
    resolvedDataDir: dataDir,
    sources,
    platforms,
    community: {
      status: communityStatus,
      path: communityPath,
      details: communityDetails,
      env: communityEnv ?? null,
    },
  };
}

/** True if data root contains at least one platform version directory. */
export function hasAnyPlatformData(dataDir = resolveDataDir()): boolean {
  if (!existsSync(dataDir)) return false;
  try {
    return readdirSync(dataDir, { withFileTypes: true }).some(
      (e) =>
        e.isDirectory() &&
        (e.name.startsWith("forge_") ||
          e.name.startsWith("fabric_") ||
          e.name.startsWith("neoforge_")),
    );
  } catch {
    return false;
  }
}
