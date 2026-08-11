/**
 * Mojang version manifest 解析 + client jar / client_mappings 定位。
 *
 * 数据源：https://piston-meta.mojang.com/mc/game/version_manifest_v2.json
 * 该 manifest 仅正式版（含 1.14–1.21.11 与 26.1+）。下载为显式用户动作（按需，零预热）。
 */

import { DownloadError } from "./http.js";

const VERSION_MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

let cachedManifest: { versions: Array<{ id: string; url: string }> } | null = null;

interface VersionJson {
  downloads: {
    client?: { url: string; sha1: string; size: number };
    client_mappings?: { url: string; size: number };
  };
}

export interface MojangVersionEntry {
  version: string;
  /** Mojang manifest 中的版本 key（可能与用户输入不同，如 26.1.0 vs 26.1） */
  manifestId: string;
  clientJarUrl: string;
  clientJarSha1: string;
  clientMappingsUrl?: string;
}

export async function fetchVersionManifest(force = false): Promise<{ versions: Array<{ id: string; url: string }> }> {
  if (cachedManifest && !force) return cachedManifest;
  const res = await fetch(VERSION_MANIFEST_URL, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    throw new DownloadError("DOWNLOAD_FAILED", `Mojang version manifest: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { versions: Array<{ id: string; url: string }> };
  cachedManifest = json;
  return json;
}

/** 解析版本 → client jar 下载信息（manifestId 归一化：manifest 中的精确 id 优先） */
export async function resolveMojangVersion(version: string): Promise<MojangVersionEntry> {
  const manifest = await fetchVersionManifest();
  const exact = manifest.versions.find((v) => v.id === version);
  const id = exact?.id ?? version;

  let versionJson: VersionJson;
  if (exact) {
    const res = await fetch(exact.url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) {
      throw new DownloadError("DOWNLOAD_FAILED", `Mojang version json ${id}: HTTP ${res.status}`);
    }
    versionJson = (await res.json()) as VersionJson;
  } else {
    throw new DownloadError(
      "VERSION_NOT_FOUND",
      `Mojang manifest 中未找到版本「${version}」（仅正式版；快照/远古版本不支持）`,
    );
  }

  const client = versionJson.downloads.client;
  if (!client?.url) {
    throw new DownloadError("VERSION_NOT_FOUND", `版本 ${id} 无 client jar 下载项`);
  }
  const entry: MojangVersionEntry = {
    version,
    manifestId: id,
    clientJarUrl: client.url,
    clientJarSha1: client.sha1,
  };
  if (versionJson.downloads.client_mappings?.url) {
    entry.clientMappingsUrl = versionJson.downloads.client_mappings.url;
  }
  return entry;
}
