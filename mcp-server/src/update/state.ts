/**
 * Persist update check / apply state under $MC_SKILL_CACHE (not git-tracked data/).
 */

import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { resolveCacheRoot, resolveDataDir } from "../utils/path.js";

export interface LastCheckCache {
  at: string;
  updateAvailable: boolean;
  remoteTag: string;
  scopes: string[];
}

export interface UpdateState {
  dataReleaseTag?: string;
  dataAssetName?: string;
  updatedAt?: string;
  lastCheck?: LastCheckCache;
  pendingRestart?: boolean;
  pendingRestartSince?: string | null;
}

export interface WriteUpdateStateResult {
  state: UpdateState;
  writeFailed?: boolean;
  warning?: string;
}

const STATE_FILE = "mc-skill-update-state.json";

function isRepoDataDir(dataDir?: string): boolean {
  if (!dataDir) return true;
  try {
    return resolve(dataDir) === resolve(resolveDataDir());
  } catch {
    return true;
  }
}

/** Canonical path: cache root (production). Isolated dataDir in tests is not the repo data/. */
export function updateStatePath(dataDir?: string): string {
  if (dataDir && !isRepoDataDir(dataDir)) return join(dataDir, STATE_FILE);
  return join(resolveCacheRoot(), STATE_FILE);
}

export function updateStateLegacyPath(dataDir?: string): string {
  return join(dataDir ?? resolveDataDir(), STATE_FILE);
}

export function readUpdateState(dataDir?: string): UpdateState {
  const cachePath = join(resolveCacheRoot(), STATE_FILE);
  const primary = updateStatePath(dataDir);
  const legacyPath = updateStateLegacyPath(dataDir);
  const candidates = isRepoDataDir(dataDir)
    ? [cachePath, legacyPath]
    : [primary];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      return JSON.parse(readFileSync(p, "utf8")) as UpdateState;
    } catch {
      continue;
    }
  }
  return {};
}

export function writeUpdateState(patch: Partial<UpdateState>, dataDir?: string): WriteUpdateStateResult {
  const cur = readUpdateState(dataDir);
  const next: UpdateState = { ...cur, ...patch };
  try {
    const p = updateStatePath(dataDir);
    mkdirSync(dirname(p), { recursive: true });
    const payload = JSON.stringify(next, null, 2) + "\n";
    if (existsSync(p) && readFileSync(p, "utf8") === payload) return { state: next };
    const tmp = `${p}.tmp-${process.pid}-${Date.now()}`;
    try {
      writeFileSync(tmp, payload, "utf8");
      renameSync(tmp, p);
    } catch (err) {
      rmSync(tmp, { force: true });
      throw err;
    }
    return { state: next };
  } catch (err) {
    const warning = `无法写入更新状态：${err instanceof Error ? err.message : String(err)}`;
    return { state: next, writeFailed: true, warning };
  }
}

export function cacheTtlSec(): number {
  const n = Number(process.env.MC_SKILL_UPDATE_CACHE_TTL_SEC ?? "3600");
  return Number.isFinite(n) && n >= 0 ? n : 3600;
}

export interface UpdateHint {
  available: boolean;
  stale: boolean;
  remoteTag?: string;
  scopes?: string[];
  checkedAt?: string;
  pendingRestart: boolean;
  pendingRestartSince?: string | null;
  suggest?: string;
}

export function getUpdateHint(dataDir?: string): UpdateHint {
  const state = readUpdateState(dataDir);
  const pendingRestart = Boolean(state.pendingRestart);
  const lc = state.lastCheck;
  if (!lc?.at) {
    return {
      available: false,
      stale: true,
      pendingRestart,
      pendingRestartSince: state.pendingRestartSince ?? null,
      suggest: "调用 mc_skill_update action=check 检查更新",
    };
  }
  const ageMs = Date.now() - Date.parse(lc.at);
  const stale = !Number.isFinite(ageMs) || ageMs > cacheTtlSec() * 1000;
  return {
    available: Boolean(lc.updateAvailable),
    stale,
    remoteTag: lc.remoteTag,
    scopes: lc.scopes,
    checkedAt: lc.at,
    pendingRestart,
    pendingRestartSince: state.pendingRestartSince ?? null,
    suggest: stale
      ? "缓存已过期，建议 mc_skill_update action=check"
      : pendingRestart
        ? "已更新代码，请重启 Cursor / MCP 进程"
        : lc.updateAvailable
          ? "有可用更新：mc_skill_update action=apply（先 dryRun）"
          : undefined,
  };
}
