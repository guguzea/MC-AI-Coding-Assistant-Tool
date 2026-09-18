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
  return readStateFileDetailed(path).state;
}

/**
 * A-8 CC-3（成立）：必须区分「没有状态文件」与「有但坏了」—— 后者此前被同一个 catch 静默当成 `{}`，
 * 随后 `writeUpdateState` 拿它当基线合并并写回去，**把损坏现场连同信息一起抹掉且不告警**。
 */
function readStateFileDetailed(path: string): { state: UpdateState | null; corrupt: boolean } {
  if (!existsSync(path)) return { state: null, corrupt: false };
  try {
    return { state: JSON.parse(readFileSync(path, "utf8")) as UpdateState, corrupt: false };
  } catch {
    return { state: null, corrupt: true };
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
  const p = updateStatePath(dataDir);
  const prior = readStateFileDetailed(p);
  const warnings: string[] = [];
  // A-8 CC-3：损坏的状态文件不得被「当成 {} 合并后覆盖」——先挪成 `.corrupt-<ts>` 再重建，
  // 并把这件事回成 warning（此前损坏现场被静默抹掉，无备份、无告警）。
  if (prior.corrupt) {
    const bak = `${p}.corrupt-${Date.now()}`;
    try {
      renameSync(p, bak);
      warnings.push(`既有更新状态文件不可解析，已备份为 ${bak} 后重建`);
    } catch (err) {
      warnings.push(
        `既有更新状态文件不可解析，且备份失败（${err instanceof Error ? err.message : String(err)}）：本次写入会覆盖它`,
      );
    }
  }
  const cur = prior.state ?? readUpdateState(dataDir);
  const next: UpdateState = { ...cur, ...patch };
  try {
    mkdirSync(dirname(p), { recursive: true });
    const payload = JSON.stringify(next, null, 2) + "\n";
    if (!prior.corrupt && existsSync(p) && readFileSync(p, "utf8") === payload) {
      return warnings.length > 0 ? { state: next, warning: warnings.join("；") } : { state: next };
    }
    const tmp = `${p}.tmp-${process.pid}-${Date.now()}`;
    try {
      writeFileSync(tmp, payload, "utf8");
      renameSync(tmp, p);
    } catch (err) {
      rmSync(tmp, { force: true });
      throw err;
    }
    return warnings.length > 0 ? { state: next, warning: warnings.join("；") } : { state: next };
  } catch (err) {
    const warning = `无法写入更新状态：${err instanceof Error ? err.message : String(err)}`;
    return { state: next, writeFailed: true, warning: warnings.length > 0 ? `${warnings.join("；")}；${warning}` : warning };
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
