/**
 * Stream download with host allowlist, timeout, exponential backoff retry.
 */

import { createWriteStream, existsSync, mkdirSync, unlinkSync, rmSync } from "fs";
import { dirname } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";
import { curlGetToFile, isTlsCertError } from "./http.js";

const ALLOWED_HOSTS = new Set([
  "api.github.com",
  "github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
]);

export function isAllowedDownloadUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "https:") return false;
    if (ALLOWED_HOSTS.has(u.hostname)) return true;
    // githubusercontent / CDN variants
    if (u.hostname.endsWith(".githubusercontent.com")) return true;
    return false;
  } catch {
    return false;
  }
}

function downloadTimeoutMs(): number {
  const n = Number(process.env.MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS ?? "600000");
  return Number.isFinite(n) && n > 0 ? n : 600_000;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface DownloadResult {
  ok: boolean;
  path?: string;
  bytes?: number;
  attempts?: number;
  action?: ActionEnvelope;
}

export async function downloadToFile(
  url: string,
  destPath: string,
  opts?: { fetchImpl?: typeof fetch; maxAttempts?: number },
): Promise<DownloadResult> {
  if (!isAllowedDownloadUrl(url)) {
    return {
      ok: false,
      action: actionable(
        "DOWNLOAD_HOST_DENIED",
        `下载主机不在白名单: ${url}`,
        ["仅允许 GitHub release 资源 URL"],
        ["mc_skill_update"],
      ),
    };
  }

  const maxAttempts = opts?.maxAttempts ?? 3;
  const fetchImpl = opts?.fetchImpl ?? fetch;
  mkdirSync(dirname(destPath), { recursive: true });

  let lastErr = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (existsSync(destPath)) {
        try {
          unlinkSync(destPath);
        } catch {
          /* ignore */
        }
      }
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), downloadTimeoutMs());
      try {
        const res = await fetchImpl(url, {
          signal: ac.signal,
          headers: { "User-Agent": "MC-AI-Coding-Assistant-Tool-updater" },
          redirect: "follow",
        });
        if (res.status === 404 || res.status === 403) {
          return {
            ok: false,
            attempts: attempt,
            action: actionable(
              "DOWNLOAD_FAILED",
              `下载失败 HTTP ${res.status}（不重试）`,
              ["确认 Release 资产 URL 可访问"],
              ["mc_skill_update"],
            ),
          };
        }
        if (res.status === 429) {
          lastErr = "HTTP 429";
          if (attempt < maxAttempts) {
            const retryAfter = Number(res.headers.get("retry-after") || "2");
            const waitMs = Number.isFinite(retryAfter)
              ? Math.min(Math.max(retryAfter, 0) * 1000, 60_000)
              : 1000 * 2 ** (attempt - 1);
            await sleep(waitMs);
            continue;
          }
          return {
            ok: false,
            attempts: attempt,
            action: actionable(
              "UPDATE_RATE_LIMITED",
              "下载限速 (429)",
              ["等待后重试", "可设置 MC_SKILL_GITHUB_TOKEN"],
              ["mc_skill_update"],
            ),
          };
        }
        if (!res.ok || !res.body) {
          lastErr = `HTTP ${res.status}`;
          throw new Error(lastErr);
        }
        const nodeStream = Readable.fromWeb(res.body as import("stream/web").ReadableStream);
        await pipeline(nodeStream, createWriteStream(destPath));
        const { size } = await import("fs").then((fs) => fs.statSync(destPath));
        return { ok: true, path: destPath, bytes: size, attempts: attempt };
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      lastErr = (err as Error).message;
      try {
        if (existsSync(destPath)) unlinkSync(destPath);
      } catch {
        /* ignore */
      }
      if (!opts?.fetchImpl && process.platform === "win32" && isTlsCertError(err)) {
        try {
          const viaCurl = await curlGetToFile(url, destPath, {
            headers: { "User-Agent": "MC-AI-Coding-Assistant-Tool-updater" },
          }, downloadTimeoutMs());
          if (viaCurl.status >= 200 && viaCurl.status < 300 && existsSync(destPath)) {
            const { size } = await import("fs").then((fs) => fs.statSync(destPath));
            return { ok: true, path: destPath, bytes: size, attempts: attempt };
          }
          lastErr = `curl HTTP ${viaCurl.status}`;
        } catch (curlErr) {
          lastErr = `Node TLS 失败且 curl 回退失败: ${(curlErr as Error).message}`;
        }
      }
      if (attempt < maxAttempts) {
        await sleep(1000 * 2 ** (attempt - 1));
      }
    }
  }

  return {
    ok: false,
    attempts: maxAttempts,
    action: actionable(
      "DOWNLOAD_FAILED",
      `下载失败（重试 ${maxAttempts} 次）: ${lastErr}`,
      ["检查网络后重试", "确认 Release 资产 URL 可访问"],
      ["mc_skill_update"],
    ),
  };
}

export function cleanupPath(p: string | undefined): void {
  if (!p || !existsSync(p)) return;
  try {
    rmSync(p, { recursive: true, force: true });
  } catch {
    try {
      unlinkSync(p);
    } catch {
      /* ignore */
    }
  }
}
