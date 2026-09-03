/**
 * Yarn 映射下载（maven.fabricmc.net）。
 *
 * yarn 只有顶层 <...>/yarn/maven-metadata.xml 一个索引，里面把每个 build 平铺成
 * `<mcver>+build.<n>`；映射取该目录下的 `-mergedv2.jar`（Tiny v2，列 official/intermediary/named，
 * 两步 remap 三列都要）。⚠️ 同目录的 `-v2.jar` 只有 intermediary/named 两列，不能用。
 * maven 不提供 per-MC-version 的 maven-metadata.xml，所以不能按 `1.20.1/` 去要元数据。
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
  sha256?: string | null;
  sha1?: string | null;
}

async function fetchMavenChecksum(jarUrl: string): Promise<{ sha256?: string; sha1?: string }> {
  for (const [ext, hexLen] of [
    ["sha256", 64],
    ["sha1", 40],
  ] as const) {
    try {
      const res = await fetch(`${jarUrl}.${ext}`, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) continue;
      const hex = (await res.text()).trim().split(/\s+/)[0];
      if (new RegExp(`^[a-fA-F0-9]{${hexLen}}$`).test(hex)) {
        return ext === "sha256" ? { sha256: hex.toLowerCase() } : { sha1: hex.toLowerCase() };
      }
    } catch {
      /* try next */
    }
  }
  return {};
}

export function pickYarnBuild(xml: string, version: string): string | null {
  const candidates = [...xml.matchAll(/<version>([^<]+)<\/version>/g)].map((x) => x[1]);
  if (candidates.includes(version)) return version; // 允许直接指定完整 build
  // <latest> 是整个仓库的全局最新，不是本 MC 版本的最新，必须按 +build.<n> 数值取最大
  // （字符串序会把 build.9 排在 build.10 之后）。
  const prefix = `${version}+build.`;
  let best: { full: string; n: number } | null = null;
  for (const c of candidates) {
    if (!c.startsWith(prefix)) continue;
    const n = Number(c.slice(prefix.length));
    if (!Number.isInteger(n) || n < 0) continue;
    if (!best || n > best.n) best = { full: c, n };
  }
  return best?.full ?? null;
}

/**
 * maven 路径段形态门：首字符必须 alnum，其后只许 alnum 与 . _ + -。
 * `/` `\` `%` `?` `#` 与首字符 `.` 全被排除 → 越界、换 authority、改 query 的形态都无法通过，
 * 合法 build 串（`1.20.1+build.10`）原样保留。
 */
const YARN_SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9._+-]*$/;
export function yarnUrlSegment(build: string): string {
  if (!YARN_SEGMENT_RE.test(build)) {
    throw new DownloadError(
      "MAPPINGS_NOT_FOUND",
      `yarn build 串形态非法，拒绝拼进 maven URL：${JSON.stringify(build)}`,
    );
  }
  return build;
}

export async function resolveYarnMappings(version: string): Promise<YarnMappingsInfo> {
  const metadataUrl = `${YARN_BASE}/maven-metadata.xml`;
  const res = await fetch(metadataUrl, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    throw new DownloadError(
      "MAPPINGS_NOT_FOUND",
      `yarn 映射元数据获取失败 ${metadataUrl}: HTTP ${res.status}`,
    );
  }
  const full = pickYarnBuild(await res.text(), version);
  if (!full) {
    throw new DownloadError("MAPPINGS_NOT_FOUND", `yarn 元数据无可用 build（${version}）`);
  }
  // mergedv2 = official+intermediary+named 三列合一；纯 -v2.jar 只有 intermediary→named，
  // 两步 remap 的第一条腿 official→intermediary 会没有列可读。
  // full 取自上游 maven-metadata 文本 = 不可信输入。百分号编码在这台宿主上不是防护：
  // 实测 GET .../yarn/zzz%2F..%2Fmaven-metadata.xml 返回的就是顶层元数据正文（%2F 会被解码并归一化），
  // 而 encodeURIComponent("..") === ".." 且会把合法 build 串里的 + 编成 %2B（与上游目录名不一致）。
  // 因此改为拼 URL 前过形态白名单，非法直接拒。
  const seg = yarnUrlSegment(full);
  const jarUrl = `${YARN_BASE}/${seg}/yarn-${seg}-mergedv2.jar`;
  const sum = await fetchMavenChecksum(jarUrl);
  if (!sum.sha256 && !sum.sha1) {
    throw new DownloadError(
      "MAPPINGS_CHECKSUM_MISSING",
      `yarn 映射 ${full} 无 maven .sha256/.sha1 sidecar，拒绝无校验下载`,
    );
  }
  return {
    version,
    build: full,
    jarUrl,
    sha256: sum.sha256 ?? null,
    sha1: sum.sha1 ?? null,
  };
}
