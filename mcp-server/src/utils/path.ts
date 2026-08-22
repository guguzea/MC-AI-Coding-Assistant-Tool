/**
 * 数据目录解析工具
 *
 * 本文件解决 MCP Server 运行时数据目录定位问题。
 * 策略（按可靠性从高到低）：
 * 1. MC_SKILL_DATA 环境变量
 * 2. import.meta.url 推导（运行时）
 * 3. process.cwd() 回退
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import {
  getSemanticIndexStatus,
  listSemanticDbPresence,
  buildSemanticWarnings,
  isIntentionalL0Only,
  inspectSemanticDb,
} from "../docs-platform/semantic/status.js";
import { semanticDbPath } from "../docs-platform/semantic/search.js";

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

let warnedMissingDataEnv = false;

function getDataDirFromEnv(): string | null {
  const envPath = process.env.MC_SKILL_DATA;
  if (!envPath) {
    if (!warnedMissingDataEnv) {
      warnedMissingDataEnv = true;
      console.error(
        "[mc-mcp-server] WARN: 未设置 MC_SKILL_DATA，将尝试从安装路径或 cwd 推导 data/。" +
          "推荐设置 MC_SKILL_DATA 为 data 目录的绝对路径。",
      );
    }
    return null;
  }
  const abs = resolve(envPath);
  if (existsSync(abs)) return abs;
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

/** 仓库根目录（含 forge/、data/、community_knowledge/） */
export function resolveRepoRoot(): string {
  return getRepoRootFromSelf();
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
  /** 各文档树旁 semantic/db.sqlite 存在性（轻量，不加载模型） */
  semantic: {
    modeHint: string;
    modelsReady: boolean;
    present: number;
    totalChecked: number;
    samples: ReturnType<typeof listSemanticDbPresence>;
    warnings: string[];
  };
  /** 缺语义库等必须出现的警告（规范：缺库必 warning） */
  warnings: string[];
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

  for (const platform of ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock"] as const) {
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

  const semanticPresence = listSemanticDbPresence(dataDir);
  const semanticStatus = getSemanticIndexStatus(dataDir);
  const present = semanticPresence.filter((s) => s.exists).length;
  const l0Only = semanticPresence.filter((s) => !s.exists && isIntentionalL0Only(s.platform, s.version, s.source));
  const missingReal = semanticPresence.filter((s) => !s.exists && !isIntentionalL0Only(s.platform, s.version, s.source));
  const semanticWarnings = buildSemanticWarnings({
    present,
    total: Math.max(semanticPresence.length - l0Only.length, present),
    modelsReady: semanticStatus.modelsReady,
    missingSamples: missingReal,
  });
  if (l0Only.length) {
    semanticWarnings.push(
      `下列 ${l0Only.length} 棵文档树为故意 L0-only（页少，不建空向量库）：${l0Only
        .map((s) => `${s.platform}_${s.version}/${s.source}`)
        .join(", ")}。`,
    );
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
    semantic: {
      modeHint: semanticStatus.modeHint,
      modelsReady: semanticStatus.modelsReady,
      present,
      totalChecked: semanticPresence.length,
      samples: semanticPresence.filter((s) => s.exists).slice(0, 40),
      warnings: semanticWarnings,
    },
    warnings: semanticWarnings,
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
          e.name.startsWith("neoforge_") ||
          e.name.startsWith("quilt_") ||
          e.name.startsWith("liteloader_") ||
          e.name.startsWith("rift_") ||
          e.name.startsWith("modloader_") ||
          e.name.startsWith("bedrock_")),
    );
  } catch {
    return false;
  }
}

function findIndexL0Shallow(dir: string, depth: number): string | null {
  if (depth > 4 || !existsSync(dir)) return null;
  const direct = join(dir, "index-l0.json");
  if (existsSync(direct)) return direct;
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return null;
  }
  for (const n of names) {
    const p = join(dir, n);
    try {
      if (statSync(p).isDirectory()) {
        const hit = findIndexL0Shallow(p, depth + 1);
        if (hit) return hit;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/** STRICT 启动：有平台目录 + 至少一份能 parse 的 index-l0 + 已存在的 semantic db 必须可用 */
export function assertDataUsable(dataDir = resolveDataDir()): { ok: boolean; reason?: string } {
  if (!hasAnyPlatformData(dataDir)) return { ok: false, reason: "未找到平台数据目录" };
  let l0: string | null = null;
  try {
    for (const name of readdirSync(dataDir)) {
      if (!/^(forge_|fabric_|neoforge_|quilt_|liteloader_|rift_|modloader_|bedrock_)/.test(name)) continue;
      l0 = findIndexL0Shallow(join(dataDir, name), 0);
      if (l0) break;
    }
  } catch {
    l0 = null;
  }
  if (!l0) return { ok: false, reason: "未找到可解析的 index-l0.json" };
  try {
    JSON.parse(readFileSync(l0, "utf8"));
  } catch {
    return { ok: false, reason: `index-l0.json 无法 JSON.parse: ${l0}` };
  }
  const samples = [
    semanticDbPath(dataDir, "forge", "1.20.1", "forge-docs"),
    semanticDbPath(dataDir, "fabric", "1.20.1", "fabric-docs"),
    semanticDbPath(dataDir, "neoforge", "1.21.1", "neoforge-docs"),
  ];
  for (const dbPath of samples) {
    if (!existsSync(dbPath)) continue;
    if (inspectSemanticDb(dbPath).mode === "missing") {
      return { ok: false, reason: `语义库文件存在但不可用: ${dbPath}` };
    }
  }
  return { ok: true };
}
