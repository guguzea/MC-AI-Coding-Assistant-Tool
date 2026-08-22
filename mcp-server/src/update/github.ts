/**
 * GitHub Releases client for MC Skill updates.
 */

import { actionable, type ActionEnvelope } from "../utils/actionable.js";
import {
  collectErrorText,
  getLastGithubFetchMeta,
  githubFetch,
  networkFailureNextSteps,
  type FetchFn,
} from "./http.js";
import { gitDescribeVsRemote, isNewer, looksLikePrereleaseTag } from "./semver.js";

export type { FetchFn } from "./http.js";

export type UpdateChannel = "stable" | "latest" | "tag";

export interface GhAsset {
  name: string;
  size: number;
  browser_download_url: string;
  content_type?: string;
  /** GitHub Release API 的 `digest`，如 `sha256:abc...` */
  digest?: string;
}

export interface GhRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  assets: GhAsset[];
  published_at?: string;
}

export interface FetchReleaseResult {
  ok: boolean;
  release?: GhRelease;
  action?: ActionEnvelope;
  rateLimitRetryAfter?: number;
}

export function defaultUpdateRepo(): string {
  return process.env.MC_SKILL_UPDATE_REPO?.trim() || "guguzea/MC-AI-Coding-Assistant-Tool";
}

function apiHeaders(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "MC-AI-Coding-Assistant-Tool-updater",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.MC_SKILL_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function truncateBody(body: string | null, max = 1200): string | undefined {
  if (!body) return undefined;
  const t = body.trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + "\n…";
}

export function isPrereleaseRelease(r: GhRelease): boolean {
  if (r.prerelease) return true;
  return looksLikePrereleaseTag(r.tag_name);
}

function httpStatusAction(status: number): ActionEnvelope {
  if (status === 404) {
    return actionable(
      "UPDATE_CHECK_FAILED",
      `GitHub API 失败: HTTP 404（仓库或 Release 不存在）`,
      [
        `确认 MC_SKILL_UPDATE_REPO（当前默认 ${defaultUpdateRepo()}）`,
        "确认该仓库已发布 GitHub Release",
        "可选配置 GitHub token",
      ],
      ["mc_skill_update", "get_server_status"],
    );
  }
  if (status === 401 || status === 403) {
    return actionable(
      "UPDATE_CHECK_FAILED",
      `GitHub API 失败: HTTP ${status}（鉴权/权限）`,
      ["检查 MC_SKILL_GITHUB_TOKEN / GITHUB_TOKEN", "确认 token 对目标仓库有权读取 Release"],
      ["mc_skill_update"],
    );
  }
  return actionable(
    "UPDATE_CHECK_FAILED",
    `GitHub API 失败: HTTP ${status}`,
    ["检查网络与 MC_SKILL_UPDATE_REPO", "稍后重试", "可选配置 GitHub token"],
    ["mc_skill_update", "get_server_status"],
  );
}

function networkFailureAction(err: unknown, url: string): ActionEnvelope {
  return actionable(
    "UPDATE_CHECK_FAILED",
    `无法连接 GitHub: ${collectErrorText(err)} @ ${url}`,
    networkFailureNextSteps(),
    ["mc_skill_update"],
  );
}

async function parseGithubResponse(res: Response): Promise<FetchReleaseResult> {
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after") || "60");
    return {
      ok: false,
      rateLimitRetryAfter: retryAfter,
      action: actionable(
        "UPDATE_RATE_LIMITED",
        "GitHub API 限速 (429)",
        [`等待约 ${retryAfter}s 后重试`, "可设置 MC_SKILL_GITHUB_TOKEN / GITHUB_TOKEN 提高限额"],
        ["mc_skill_update"],
      ),
    };
  }
  if (!res.ok) {
    return {
      ok: false,
      action: httpStatusAction(res.status),
    };
  }
  const json = (await res.json()) as GhRelease | GhRelease[];
  if (Array.isArray(json) || !json || typeof json !== "object" || typeof (json as GhRelease).tag_name !== "string") {
    return {
      ok: false,
      action: actionable(
        "UPDATE_CHECK_FAILED",
        "GitHub 响应无法解析为单个 release（数组或缺少 tag_name）",
        ["改用 releases 列表接口", "检查代理/镜像是否改写了 JSON"],
        ["mc_skill_update"],
      ),
    };
  }
  return { ok: true, release: json as GhRelease };
}

export async function fetchReleasesList(
  repo: string,
  fetchImpl: FetchFn = githubFetch,
  perPage = 30,
): Promise<{ ok: boolean; releases?: GhRelease[]; action?: ActionEnvelope }> {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=${perPage}`;
  try {
    const res = await fetchImpl(url, { headers: apiHeaders() });
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") || "60");
      return {
        ok: false,
        action: actionable(
          "UPDATE_RATE_LIMITED",
          "GitHub API 限速 (429)",
          [`等待约 ${retryAfter}s 后重试`, "可设置 MC_SKILL_GITHUB_TOKEN"],
          ["mc_skill_update"],
        ),
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        action: httpStatusAction(res.status),
      };
    }
    const releases = (await res.json()) as GhRelease[];
    return { ok: true, releases: releases.filter((r) => !r.draft) };
  } catch (err) {
    return {
      ok: false,
      action: networkFailureAction(err, url),
    };
  }
}

export async function resolveRelease(opts: {
  channel: UpdateChannel;
  tagName?: string;
  repo?: string;
  fetchImpl?: FetchFn;
}): Promise<FetchReleaseResult & { notes?: string }> {
  const repo = opts.repo ?? defaultUpdateRepo();
  const fetchImpl = opts.fetchImpl ?? githubFetch;
  const channel = opts.channel;

  try {
    if (channel === "tag") {
      if (!opts.tagName?.trim()) {
        return {
          ok: false,
          action: actionable(
            "INVALID_INPUT",
            "channel=tag 需要 tagName",
            ["传入 tagName，例如 v0.2.0"],
            ["mc_skill_update"],
          ),
        };
      }
      const url = `https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(opts.tagName.trim())}`;
      const res = await fetchImpl(url, { headers: apiHeaders() });
      const parsed = await parseGithubResponse(res);
      if (!parsed.ok || !parsed.release) return parsed;
      return { ...parsed, notes: truncateBody(parsed.release.body) };
    }

    if (channel === "latest") {
      // Include prereleases: list first non-draft (GitHub /releases/latest excludes prereleases)
      const list = await fetchReleasesList(repo, fetchImpl);
      if (!list.ok) return { ok: false, action: list.action };
      const first = list.releases?.[0];
      if (!first) {
        return {
          ok: false,
          action: actionable("UPDATE_CHECK_FAILED", "仓库无 Release", ["确认已发布 GitHub Release"], [
            "mc_skill_update",
          ]),
        };
      }
      return { ok: true, release: first, notes: truncateBody(first.body) };
    }

    // stable: newest non-prerelease
    const list = await fetchReleasesList(repo, fetchImpl);
    if (!list.ok) return { ok: false, action: list.action };
    const stable = (list.releases ?? []).find((r) => !isPrereleaseRelease(r));
    if (!stable) {
      return {
        ok: false,
        action: actionable(
          "UPDATE_CHECK_FAILED",
          "未找到稳定版 Release（可改 channel=latest）",
          ["使用 channel=latest 含预发布", "或 channel=tag + tagName"],
          ["mc_skill_update"],
        ),
      };
    }
    return { ok: true, release: stable, notes: truncateBody(stable.body) };
  } catch (err) {
    const url = `https://api.github.com/repos/${repo}/releases`;
    return {
      ok: false,
      action: networkFailureAction(err, url),
    };
  }
}

export function githubAssetSha256(asset: GhAsset): string | undefined {
  const d = asset.digest?.trim();
  const m = d?.match(/^sha256:([a-fA-F0-9]{64})$/i);
  return m?.[1]?.toLowerCase();
}

export function pickDataAssets(release: GhRelease): {
  zip?: GhAsset;
  sums?: GhAsset;
  checksumHex?: string;
  action?: ActionEnvelope;
} {
  const zip =
    release.assets.find((a) => /^mc-skill-data-full-.*\.zip$/i.test(a.name)) ??
    release.assets.find((a) => /^data\.zip$/i.test(a.name));
  const sums = release.assets.find((a) => /^SHA256SUMS/i.test(a.name));
  if (!zip) {
    return {
      action: actionable(
        "DATA_ASSET_MISSING",
        "Release 中未找到 mc-skill-data-full-*.zip 或 data.zip",
        ["确认 Release 已上传数据包", "或 scope=tooling 只更新代码"],
        ["mc_skill_update"],
      ),
    };
  }
  const checksumHex = githubAssetSha256(zip);
  if (!sums && !checksumHex) {
    return {
      zip,
      action: actionable(
        "DATA_CHECKSUM_MISSING",
        "Release 中未找到 SHA256SUMS*.txt，且 data zip 无 GitHub digest",
        ["等待补齐 checksum 资产后再更新 data", "或 scope=tooling"],
        ["mc_skill_update"],
      ),
    };
  }
  return { zip, sums, checksumHex };
}

export { getLastGithubFetchMeta };

export function toolingNeedsUpdate(
  localVersion: string,
  remoteTag: string,
  gitDescribe?: string,
): boolean {
  const vs = gitDescribeVsRemote(gitDescribe, remoteTag);
  if (vs === "ahead" || vs === "equal") return false;
  return isNewer(remoteTag, localVersion);
}

export function dataNeedsUpdate(
  localTag: string | undefined,
  remoteTag: string,
  localAsset: string | undefined,
  remoteAsset: string,
  gitDescribe?: string,
): boolean {
  const vs = gitDescribeVsRemote(gitDescribe, remoteTag);
  if (vs === "ahead" || vs === "equal") return false;
  if (!localTag) return true;
  if (localTag !== remoteTag) return isNewer(remoteTag, localTag) || stripSimple(localTag) !== stripSimple(remoteTag);
  if (localAsset && localAsset !== remoteAsset) return true;
  return false;
}

function stripSimple(t: string): string {
  return t.trim().replace(/^v/i, "");
}
