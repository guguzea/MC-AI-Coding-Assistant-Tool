/**
 * GitHub host 白名单的**唯一权威**（A-8 BB-4，2026-09-18 用户裁定方向）。
 *
 * 为什么单独一个叶子模块：`download.ts` 需要 `http.ts` 的 `curlGetToFile` / `isTlsCertError`，
 * 若把白名单谓词留在 `http.ts` 再被 `download.ts` 引入，`http.ts ↔ download.ts` 就成环。
 * 本文件**不 import 任何 update/* 模块**，两边都单向依赖它。
 *
 * 裁定口径（**收掉通配**）：
 * - 原 `download.ts` 多一条 `hostname.endsWith(".githubusercontent.com")` **无限后缀通配**，
 *   而 `http.ts` 走精确集合。两处漂移的净效果是**放宽**：`raw` / `gist` / `media` / `avatars` /
 *   `camo` / 任意 `*.githubusercontent.com` 在 download 侧被接受，而 `assertAllowedGithubUrl`
 *   （守 Authorization 头注入 + 重定向终点复核）会拒它们。
 * - 场景矩阵与逐条后果见 `temp/audit/sweep81/BB4-HOST-ALLOWLIST-SCENARIOS.md`（12 行）。
 * - 收敛后 download 侧**不再有后缀通配**；若将来确证需要放行 `raw` / `media` 下载，
 *   请把**具体精确主机**加进本集合，而不要恢复后缀匹配。
 */

/** 精确白名单（http 侧与 download 侧共用同一份）。 */
export const ALLOWED_GITHUB_HOSTS: ReadonlySet<string> = new Set([
  "api.github.com",
  "github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
]);

/**
 * host 是否被信任。**只看 hostname，不查协议**（协议门在 `assertAllowedGithubUrl` 里）。
 * 额外接受 `MC_SKILL_GITHUB_API_BASE`（镜像）的 host —— 这是「可改镜像」这一既有能力的保留。
 */
export function isAllowedGithubHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (ALLOWED_GITHUB_HOSTS.has(h)) return true;
  const envBase = process.env.MC_SKILL_GITHUB_API_BASE;
  if (envBase) {
    try {
      return new URL(envBase).hostname.toLowerCase() === h;
    } catch {
      return false;
    }
  }
  return false;
}

/** https + 同一份精确集合（**无后缀通配**）。 */
export function isAllowedDownloadUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "https:") return false;
    return ALLOWED_GITHUB_HOSTS.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}
