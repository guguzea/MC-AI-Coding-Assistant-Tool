/**
 * Yarn 映射下载（maven.fabricmc.net）。
 *
 * 解析 <version>/maven-metadata.xml 取最新 build，下载 yarn-<version>+build.<n>-v2.jar
 * （tiny v2 格式，命名空间 official/intermediary/named）。
 *
 * 注意：yarn jar 的 sha256 随每次 build 变化，无法内置常量 —— 首次下载记录实际哈希
 * 到 cache.db（TOFU），二次命中先校验再复用；maven 侧若有 .sha256 亦可严格校验。
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { getArtifact, openCacheDb } from "../cache.js";
import { DownloadError } from "./http.js";

const YARN_BASE = "https://maven.fabricmc.net/net/fabricmc/yarn";

/**
 * TOFU 二次命中先校验再复用：cache.db 里记录的 sha256 与磁盘文件不符（被篡改/下载中断）
 * 即视为不可用，调用方应重新下载。任何异常一律返回 false（fail-closed）。
 */
export function cacheHashMatches(filePath: string, expectedSha256: string | null): boolean {
  if (!expectedSha256 || !existsSync(filePath)) return false;
  return createHash("sha256").update(readFileSync(filePath)).digest("hex") === expectedSha256;
}

export function mappingCacheViable(cacheRoot: string, filePath: string, cacheKey: string): boolean {
  if (!existsSync(filePath)) return false;
  try {
    const db = openCacheDb(cacheRoot);
    try {
      return cacheHashMatches(filePath, getArtifact(db, cacheKey)?.sha256 ?? null);
    } finally {
      db.close();
    }
  } catch {
    return false;
  }
}

export interface YarnMappingsInfo {
  version: string;
  build: string;
  jarUrl: string;
}

function parseMetadataVersion(xml: string): string | null {
  const m = /<latest>([^<]+)<\/latest>/.exec(xml);
  if (!m) return null;
  // 兼容「未显式声明 latest，用最后一个 <version>」
  const candidates = [...xml.matchAll(/<version>([^<]+)<\/version>/g)].map((x) => x[1]);
  if (candidates.includes(m[1])) return m[1];
  return candidates[candidates.length - 1] ?? null;
}

export async function resolveYarnMappings(version: string): Promise<YarnMappingsInfo> {
  const metadataUrl = `${YARN_BASE}/${version}/maven-metadata.xml`;
  const res = await fetch(metadataUrl, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    throw new DownloadError(
      "MAPPINGS_NOT_FOUND",
      `yarn 映射元数据获取失败 ${metadataUrl}: HTTP ${res.status}（版本 ${version} 可能无 yarn）`,
    );
  }
  const xml = await res.text();
  const full = parseMetadataVersion(xml);
  if (!full) {
    throw new DownloadError("MAPPINGS_NOT_FOUND", `yarn 元数据无可用 build（${version}）`);
  }
  return {
    version,
    build: full,
    jarUrl: `${YARN_BASE}/${version}/yarn-${full}-v2.jar`,
  };
}
