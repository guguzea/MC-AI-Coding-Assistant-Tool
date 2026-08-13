/**
 * mc_skill_update orchestration: check + apply (tooling / data / all).
 */

import { actionable, withAction, type ActionEnvelope } from "../utils/actionable.js";
import { resolveDataDir, resolveRepoRoot } from "../utils/path.js";
import {
  dataNeedsUpdate,
  defaultUpdateRepo,
  getLastGithubFetchMeta,
  pickDataAssets,
  resolveRelease,
  toolingNeedsUpdate,
  type FetchFn,
  type UpdateChannel,
} from "./github.js";
import { applyDataUpdate } from "./data.js";
import { getUpdateHint, readUpdateState, writeUpdateState } from "./state.js";
import { applyToolingUpdate, gitDescribe, readLocalToolingVersion } from "./tooling.js";

export type UpdateScope = "tooling" | "data" | "all";
export type UpdateAction = "check" | "apply";

export interface McSkillUpdateQuery {
  action: UpdateAction;
  scope?: UpdateScope;
  dryRun?: boolean;
  confirmed?: boolean;
  allowDirty?: boolean;
  stashDirty?: boolean;
  channel?: UpdateChannel;
  tagName?: string;
  includePrerelease?: boolean;
  /** Test hooks */
  fetchImpl?: FetchFn;
  repoRoot?: string;
  dataDir?: string;
  skipBuild?: boolean;
  localZipPath?: string;
  localSumsPath?: string;
}

export async function mcSkillUpdate(query: McSkillUpdateQuery): Promise<Record<string, unknown>> {
  const scope: UpdateScope = query.scope ?? "all";
  let channel: UpdateChannel = query.channel ?? "stable";
  if (query.includePrerelease === true && !query.channel) channel = "latest";

  const repoRoot = query.repoRoot ?? resolveRepoRoot();
  const dataDir = query.dataDir ?? resolveDataDir();
  const localVersion = readLocalToolingVersion(repoRoot);
  const describe = gitDescribe(repoRoot);
  const state = readUpdateState(dataDir);
  const repo = defaultUpdateRepo();

  const resolved = await resolveRelease({
    channel,
    tagName: query.tagName,
    repo,
    fetchImpl: query.fetchImpl,
  });

  if (!query.action || (query.action !== "check" && query.action !== "apply")) {
    return withAction(
      { ok: false },
      actionable("INVALID_INPUT", "action 必须是 check 或 apply", ["传入 action=check 或 apply"], [
        "mc_skill_update",
      ]),
    );
  }

  if (!resolved.ok || !resolved.release) {
    return withAction(
      {
        ok: false,
        local: { toolingVersion: localVersion, gitDescribe: describe, data: state },
        pendingRestart: Boolean(state.pendingRestart),
      },
      resolved.action,
    );
  }

  const release = resolved.release;
  const assets = pickDataAssets(release);
  const toolingUpdate = toolingNeedsUpdate(localVersion, release.tag_name);
  const dataUpdate =
    Boolean(assets.zip) &&
    !assets.action?.code?.includes("MISSING") &&
    dataNeedsUpdate(state.dataReleaseTag, release.tag_name, state.dataAssetName, assets.zip!.name);

  // If checksum missing, data cannot update
  const dataBlocked = Boolean(assets.action && (assets.action.code === "DATA_CHECKSUM_MISSING" || assets.action.code === "DATA_ASSET_MISSING"));

  const scopeFlags = {
    tooling: scope === "tooling" || scope === "all" ? toolingUpdate : false,
    data: scope === "data" || scope === "all" ? dataUpdate && !dataBlocked : false,
  };

  const updateAvailable =
    (scope === "tooling" && toolingUpdate) ||
    (scope === "data" && dataUpdate && !dataBlocked) ||
    (scope === "all" && (toolingUpdate || (dataUpdate && !dataBlocked)));

  const scopesHit: string[] = [];
  if (scopeFlags.tooling) scopesHit.push("tooling");
  if (scopeFlags.data) scopesHit.push("data");

  // Persist lastCheck on every successful resolve (check and apply)
  writeUpdateState(
    {
      lastCheck: {
        at: new Date().toISOString(),
        updateAvailable,
        remoteTag: release.tag_name,
        scopes: scopesHit,
      },
    },
    dataDir,
  );

  const base = {
    ok: true,
    local: {
      toolingVersion: localVersion,
      gitDescribe: describe,
      dataReleaseTag: state.dataReleaseTag ?? null,
      dataAssetName: state.dataAssetName ?? null,
    },
    remote: {
      repo,
      tag: release.tag_name,
      name: release.name,
      htmlUrl: release.html_url,
      prerelease: release.prerelease,
      notes: resolved.notes,
      dataZip: assets.zip
        ? { name: assets.zip.name, size: assets.zip.size, url: assets.zip.browser_download_url }
        : null,
      checksumAsset: assets.sums?.name ?? (assets.checksumHex ? "github-asset-digest" : null),
      fetchBackend: getLastGithubFetchMeta().backend,
    },
    channel,
    scope,
    updateAvailable,
    scopes: scopesHit,
    pendingRestart: Boolean(state.pendingRestart),
    restartRequired: Boolean(state.pendingRestart),
  };

  if (query.action === "check") {
    let action: ActionEnvelope | undefined;
    if (state.pendingRestart) {
      action = actionable(
        "PENDING_RESTART",
        "先前 tooling 更新后尚未重启 MCP",
        ["完全退出并重启 Cursor / 重载 MCP", "然后再 check"],
        ["get_server_status", "mc_skill_update"],
      );
    } else if (updateAvailable) {
      action = actionable(
        "UPDATE_AVAILABLE",
        `发现更新 ${release.tag_name}（${scopesHit.join(", ") || "none"}）`,
        [
          "先 mc_skill_update action=apply dryRun=true 预览",
          "确认后 dryRun=false confirmed=true，并设置 ALLOW_WRITE + PROJECT_ROOT=仓库根",
        ],
        ["mc_skill_update"],
      );
    } else if (dataBlocked && (scope === "data" || scope === "all")) {
      action = assets.action;
    }

    return withAction(
      {
        ...base,
        steps: updateAvailable
          ? [
              `可选：apply scope=${scope} dryRun=true`,
              `真更新：dryRun=false confirmed=true + MC_SKILL_ALLOW_WRITE=1 + MC_SKILL_PROJECT_ROOT=<repo>`,
            ]
          : ["已是最新（当前 channel）"],
      },
      action,
    );
  }

  // apply
  const dryRun = query.dryRun !== false;
  if (!dryRun && query.confirmed !== true) {
    return withAction(
      { ...base, dryRun: true, applied: false },
      actionable(
        "CONFIRMATION_REQUIRED",
        "真写需要 confirmed=true",
        ["先 dryRun=true 预览", "再 dryRun=false confirmed=true"],
        ["mc_skill_update"],
      ),
    );
  }

  const steps: string[] = [];
  let filesToOverwrite: string[] = [];
  let diskSpace: unknown;
  let appliedTooling = false;
  let appliedData = false;
  let restartRequired = Boolean(state.pendingRestart);

  if (scope === "tooling" || scope === "all") {
    if (!toolingUpdate && !dryRun) {
      steps.push("tooling: already up to date, skip");
    } else {
      const tagRef = release.tag_name;
      const tr = applyToolingUpdate({
        tag: tagRef,
        dryRun,
        allowDirty: query.allowDirty,
        stashDirty: query.stashDirty,
        repoRoot,
        skipBuild: query.skipBuild,
      });
      steps.push(...tr.steps.map((s) => `tooling: ${s}`));
      if (!tr.ok) {
        return withAction({ ...base, dryRun, steps, applied: false }, tr.action);
      }
      appliedTooling = !dryRun;
      if (tr.restartRequired) restartRequired = true;
    }
  }

  if (scope === "data" || scope === "all") {
    if (dataBlocked) {
      return withAction({ ...base, dryRun, steps, applied: false }, assets.action);
    }
    if (!assets.zip) {
      return withAction(
        { ...base, dryRun, steps, applied: false },
        actionable("DATA_ASSET_MISSING", "缺少 data 资产", ["检查 Release"], ["mc_skill_update"]),
      );
    }
    if (!assets.sums && !assets.checksumHex && !query.localSumsPath) {
      return withAction(
        { ...base, dryRun, steps, applied: false },
        assets.action ??
          actionable("DATA_CHECKSUM_MISSING", "缺少 checksum", ["检查 Release"], ["mc_skill_update"]),
      );
    }
    if (!dataUpdate && !dryRun) {
      steps.push("data: already up to date, skip");
    } else {
      const dr = await applyDataUpdate({
        zip: assets.zip,
        sums: assets.sums,
        checksumHex: assets.checksumHex,
        releaseTag: release.tag_name,
        dryRun,
        dataDir,
        fetchImpl: query.fetchImpl as typeof fetch | undefined,
        localZipPath: query.localZipPath,
        localSumsPath: query.localSumsPath,
      });
      steps.push(...dr.steps.map((s) => `data: ${s}`));
      filesToOverwrite = dr.filesToOverwrite;
      diskSpace = dr.diskSpace;
      if (!dr.ok) {
        return withAction(
          { ...base, dryRun, steps, filesToOverwrite, diskSpace, applied: false },
          dr.action,
        );
      }
      appliedData = !dryRun;
    }
  }

  if (appliedTooling) {
    writeUpdateState(
      {
        pendingRestart: true,
        pendingRestartSince: new Date().toISOString(),
      },
      dataDir,
    );
  }

  return {
    ...base,
    dryRun,
    steps,
    filesToOverwrite: filesToOverwrite.length ? filesToOverwrite : undefined,
    diskSpace,
    applied: !dryRun && (appliedTooling || appliedData),
    appliedTooling,
    appliedData,
    restartRequired,
    pendingRestart: appliedTooling || Boolean(readUpdateState(dataDir).pendingRestart),
  };
}

export { getUpdateHint, readUpdateState, writeUpdateState };

/** Clear pendingRestart after user acknowledges (optional helper for status). */
export function clearPendingRestart(dataDir?: string): void {
  writeUpdateState({ pendingRestart: false, pendingRestartSince: null }, dataDir);
}
