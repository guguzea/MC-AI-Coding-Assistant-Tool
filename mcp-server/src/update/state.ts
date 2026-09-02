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

function readStateFile(path: string): UpdateState | null {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8")) as UpdateState;
  } catch {
    return null;
  }
}

/**
 * 读与写必须走同一个解析函数：`updateStatePath()` 是唯一状态来源。
 * 例外只有一处——cache 里还没有状态时，从旧部署（`data/` 下）一次性采纳 durable 字段。
 * `lastCheck` / `pendingRestart` 属于「cache 可随意清理」的瞬态，绝不从 legacy 复活，
 * 否则清一次 cache 就会把冻结快照（含多年前的 updateAvailable）当成当前状态再写回唯一路径。
 */
export function readUpdateState(dataDir?: string): UpdateState {
  const current = readStateFile(updateStatePath(dataDir));
  if (current) return current;
  if (!isRepoDataDir(dataDir)) return {};
  const legacy = readStateFile(updateStateLegacyPath(dataDir));
  if (!legacy) return {};
  const adopted: UpdateState = {};
  if (legacy.dataReleaseTag !== undefined) adopted.dataReleaseTag = legacy.dataReleaseTag;
  if (legacy.dataAssetName !== undefined) adopted.dataAssetName = legacy.dataAssetName;
  if (legacy.updatedAt !== undefined) adopted.updatedAt = legacy.updatedAt;
  return adopted;
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
