/**
 * Persist update check / apply state under data/.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { resolveDataDir } from "../utils/path.js";

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

export function updateStatePath(dataDir?: string): string {
  return join(dataDir ?? resolveDataDir(), "mc-skill-update-state.json");
}

export function readUpdateState(dataDir?: string): UpdateState {
  const p = updateStatePath(dataDir);
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, "utf8")) as UpdateState;
  } catch {
    return {};
  }
}

export function writeUpdateState(patch: Partial<UpdateState>, dataDir?: string): UpdateState {
  try {
    const p = updateStatePath(dataDir);
    mkdirSync(dirname(p), { recursive: true });
    const cur = readUpdateState(dataDir);
    const next: UpdateState = { ...cur, ...patch };
    const payload = JSON.stringify(next, null, 2) + "\n";
    if (existsSync(p) && readFileSync(p, "utf8") === payload) return next;
    const tmp = `${p}.tmp-${process.pid}-${Date.now()}`;
    try {
      writeFileSync(tmp, payload, "utf8");
      renameSync(tmp, p);
    } catch (err) {
      rmSync(tmp, { force: true });
      throw err;
    }
    return next;
  } catch {
    return readUpdateState(dataDir);
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
