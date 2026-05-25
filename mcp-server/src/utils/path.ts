/**
 * 路径解析工具（ESM 模块）
 *
 * 本文件适用于 "type": "module" 项目。
 * __dirname 在 ESM 中不可直接使用，需通过 import.meta.url 获取。
 * 如果迁移到 CommonJS，需将 fileURLToPath(new URL(".", import.meta.url))
 * 替换为 require("path").dirname(require.resolve("./package.json"))
 */

import { join } from "path";
import { existsSync, readdirSync } from "fs";
import { fileURLToPath } from "url";

/**
 * 解析 MC_skill data 目录路径。
 * 三层兜底策略（优先级从高到低）：
 *   1. 环境变量 MC_SKILL_DATA（支持测试时换数据源）
 *   2. __dirname 向上追溯（原有逻辑，依赖 symlink）
 *   3. cwd 回退（相对项目根目录）
 *
 * @param subPath - 相对于 data/ 的路径部分，如 "forge_1.20.1", "extracted"
 */
const DEBUG = process.env.MC_SKILL_DEBUG_PATHS === "1";

export function resolveDataDir(...subPath: string[]): string {
  const envPath = process.env.MC_SKILL_DATA;
  if (envPath) {
    const result = join(envPath, ...subPath);
    if (DEBUG) console.error(`[path] env MC_SKILL_DATA → ${result}`);
    return result;
  }

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const byDirname = join(__dirname, "..", "..", "..", "data", ...subPath);
  if (existsSync(byDirname)) {
    if (DEBUG) console.error(`[path] __dirname fallback → ${byDirname}`);
    return byDirname;
  }

  const cwdFallback = join(process.cwd(), "data", ...subPath);
  if (DEBUG) console.error(`[path] cwd fallback → ${cwdFallback}`);
  return cwdFallback;
}

// ── 数据路径诊断 ─────────────────────────────────────────────────────────────

export interface DataPathResult {
  platform: string;
  dataDir: string;
  available: boolean;
  details: string;
}

export interface DataPathDiagnosis {
  resolvedDataRoot: string;
  results: DataPathResult[];
}

const PLATFORMS = ["forge", "neoforge", "fabric"] as const;

/**
 * 诊断所有平台的数据目录可用性。
 * 用于调试路径解析问题和 diagnose_data_paths 工具。
 */
export function diagnoseDataPaths(): DataPathDiagnosis {
  const results: DataPathResult[] = [];
  for (const platform of PLATFORMS) {
    const subPath = platform === "forge" ? "forge_1.20.1" : `${platform}_versions/${platform}`;
    const dataDir = resolveDataDir(subPath, "forge-docs");
    const indexPath = join(dataDir, "1.20.1", "index-l0.json");
    const exists = existsSync(indexPath);
    results.push({
      platform,
      dataDir,
      available: exists,
      details: exists
        ? `index-l0.json found`
        : `index-l0.json NOT found at ${indexPath}`,
    });
  }
  return { resolvedDataRoot: resolveDataDir(), results };
}
