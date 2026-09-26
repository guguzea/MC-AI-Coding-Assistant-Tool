/**
 * S4′：`query_upstream_releases` 的磁盘缓存（吸收 mcmap 的「分层 TTL」，不吸收它的库）。
 *
 * 三条硬规矩，都是这轮定下来的判据：
 * 1. **只缓存 `ok:true`**。`ok:false` 是「没查到」（TLS / 代理 / HTML 壳 / 非 2xx），
 *    把它固化下去会让一次瞬时抖动冒充成 6 小时的事实。
 * 2. **「有」和「没有」分档**：`available:true` 长档（发布列表变动慢），
 *    `available:false` 短档（上游今天没有，明天可能就出了 —— 禁止按长档冻结）。
 * 3. **缓存根只许在 `$MC_SKILL_CACHE`**；解析结果若落在仓库内一律拒写（`data/**` 是上游逐字语料面）。
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { isResolvedInside, resolveCacheRoot, resolveRepoRoot } from "../utils/path.js";

export type UpstreamCacheTier = "available" | "absent";

/** 导出来是给门钉用；不要在别处再抄一遍数字。 */
export const UPSTREAM_TTL_MS: Record<UpstreamCacheTier, number> = {
  available: 6 * 60 * 60 * 1000, // 6 小时
  absent: 2 * 60 * 60 * 1000,    // 2 小时：「上游没有」会被新版本推翻，短档
};

export const UPSTREAM_CACHE_SUBDIR = "upstream-cache";

export interface UpstreamCacheDisclosure {
  hit: boolean;
  tier: UpstreamCacheTier | null;
  ttlMs: number | null;
  ageMs?: number;
  wrote?: boolean;
  /** 没写/没读成原因（拒写仓库内、关掉缓存、解析失败…）。 */
  note?: string;
  file?: string;
}

/** 缓存目录每次现算：门可以按进程环境变量指到临时目录。 */
export function upstreamCacheDir(): { dir: string; rejected: string | null } {
  const root = resolveCacheRoot();
  const dir = join(root, UPSTREAM_CACHE_SUBDIR);
  const repo = resolveRepoRoot();
  if (isResolvedInside(repo, dir)) {
    return { dir, rejected: `缓存根落在仓库内（${repo}）⇒ 拒写 data/ 面` };
  }
  return { dir, rejected: null };
}

/**
 * 键必须覆盖**所有会改变载荷的入参**：limit 不在键里的话，
 * 一次 `limit=3` 的缓存会把后来 `limit=50` 的请求截断到 3 条。
 */
export function upstreamCacheKey(args: {
  source: string;
  minecraftVersion?: string;
  slug?: string;
  limit?: number;
}): string {
  const canonical = JSON.stringify({
    source: args.source,
    minecraftVersion: args.minecraftVersion ?? null,
    slug: args.slug ?? null,
    limit: args.limit ?? null,
  });
  return createHash("sha256").update(canonical).digest("hex").slice(0, 24);
}

export function tierForResult(result: { ok?: boolean; available?: boolean }): UpstreamCacheTier | null {
  if (result.ok !== true) return null;
  return result.available === true ? "available" : "absent";
}

export function cacheEnabled(): boolean {
  return process.env.MC_SKILL_UPSTREAM_CACHE !== "0";
}

interface CacheEnvelope {
  key: string;
  tier: UpstreamCacheTier;
  cachedAt: string;
  ttlMs: number;
  result: unknown;
}

export function readUpstreamCache(key: string): { result: Record<string, unknown>; tier: UpstreamCacheTier; ageMs: number; ttlMs: number } | { miss: null; note?: string; tier?: UpstreamCacheTier } {
  if (!cacheEnabled()) return { miss: null, note: "MC_SKILL_UPSTREAM_CACHE=0 ⇒ 缓存关闭" };
  const { dir, rejected } = upstreamCacheDir();
  if (rejected) return { miss: null, note: rejected };
  const file = join(dir, `${key}.json`);
  if (!existsSync(file)) return { miss: null };
  let env: CacheEnvelope;
  try {
    env = JSON.parse(readFileSync(file, "utf8")) as CacheEnvelope;
  } catch (e) {
    return { miss: null, note: `缓存文件读不成（${(e as Error).message}），按未命中处理` };
  }
  const ageMs = Date.now() - Date.parse(env.cachedAt ?? "");
  const ttlMs = UPSTREAM_TTL_MS[env.tier] ?? Number.NaN;
  if (!Number.isFinite(ttlMs) || !Number.isFinite(ageMs) || ageMs < 0 || ageMs > ttlMs) {
    return { miss: null, tier: env.tier, note: `超过 ${env.tier} 档 TTL（${Number.isFinite(ttlMs) ? ttlMs : "?"} ms）⇒ 去上游重查` };
  }
  if (!env.result || typeof env.result !== "object") return { miss: null, note: "缓存里没有载荷" };
  return { result: env.result as Record<string, unknown>, tier: env.tier, ageMs, ttlMs };
}

export function writeUpstreamCache(
  key: string,
  result: { ok?: boolean; available?: boolean },
): { wrote: boolean; tier: UpstreamCacheTier | null; ttlMs: number | null; note?: string; file?: string } {
  const tier = tierForResult(result);
  if (!tier) {
    return { wrote: false, tier: null, ttlMs: null, note: "ok:false（没查到）不缓存：瞬时网络/代理/形状漂移不得固化成几小时的事实" };
  }
  if (!cacheEnabled()) return { wrote: false, tier, ttlMs: UPSTREAM_TTL_MS[tier], note: "MC_SKILL_UPSTREAM_CACHE=0 ⇒ 不写" };
  const { dir, rejected } = upstreamCacheDir();
  if (rejected) return { wrote: false, tier, ttlMs: UPSTREAM_TTL_MS[tier], note: rejected };
  const file = join(dir, `${key}.json`);
  const env: CacheEnvelope = {
    key,
    tier,
    cachedAt: new Date().toISOString(),
    ttlMs: UPSTREAM_TTL_MS[tier],
    result,
  };
  // 原子写：并发会话同打一个上游、或 OneDrive 抖动打断写入时，直写会留下半截 JSON。
  // 读侧的 catch 只保证「不拿坏数据当事实」，不保证缓存还在 —— 所以写必须 tmp + rename。
  const tmp = `${file}.tmp-${process.pid}`;
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(tmp, JSON.stringify(env), "utf8");
    renameSync(tmp, file);
  } catch (e) {
    try {
      if (existsSync(tmp)) rmSync(tmp, { force: true });
    } catch {
      /* 清理失败不掩盖原始错误 */
    }
    return { wrote: false, tier, ttlMs: UPSTREAM_TTL_MS[tier], note: `写盘失败（${(e as Error).message}）` };
  }
  return { wrote: true, tier, ttlMs: UPSTREAM_TTL_MS[tier], file };
}

/** 门用：把缓存文件改成「很久以前写的」，验 TTL 到期必未命中。 */
export function ageUpstreamCacheEntry(key: string, ageMs: number): boolean {
  const { dir, rejected } = upstreamCacheDir();
  if (rejected) return false;
  const file = join(dir, `${key}.json`);
  if (!existsSync(file)) return false;
  try {
    const env = JSON.parse(readFileSync(file, "utf8")) as CacheEnvelope;
    env.cachedAt = new Date(Date.now() - ageMs).toISOString();
    writeFileSync(file, JSON.stringify(env), "utf8");
    return true;
  } catch {
    return false;
  }
}
