/**
 * Ensure Mojang client.txt mappings exist for a MC version.
 * Looks under forge_${version}/mappings/, downloads from launcher meta if missing.
 */
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { downloadFileAtomic, safeFileSize } from "./pipeline-helpers.mjs";

const MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

/**
 * @param {string} versionDir absolute path to data/forge_X.Y.Z/mappings
 * @param {string} mcVersion
 * @param {{ force?: boolean }} [opts]
 * @returns {Promise<{ path: string | null, downloaded: boolean, error?: string }>}
 */
export async function ensureMojangClientMappings(versionDir, mcVersion, opts = {}) {
  mkdirSync(versionDir, { recursive: true });
  const candidates = [
    join(versionDir, "client.txt"),
    join(versionDir, "mojang-client.txt"),
    join(versionDir, `client-mappings-${mcVersion}.txt`),
  ];
  for (const p of candidates) {
    if (existsSync(p) && safeFileSize(p) > 1024) {
      return { path: p, downloaded: false };
    }
  }

  const dest = join(versionDir, "client.txt");
  if (!opts.force && existsSync(dest) && safeFileSize(dest) > 1024) {
    return { path: dest, downloaded: false };
  }

  try {
    const manifestRes = await fetch(MANIFEST_URL, { signal: AbortSignal.timeout(30_000) });
    if (!manifestRes.ok) {
      return { path: null, downloaded: false, error: `manifest HTTP ${manifestRes.status}` };
    }
    const manifest = await manifestRes.json();
    const entry = (manifest.versions || []).find((v) => v.id === mcVersion);
    if (!entry?.url) {
      return { path: null, downloaded: false, error: `version ${mcVersion} not in manifest` };
    }
    const verRes = await fetch(entry.url, { signal: AbortSignal.timeout(30_000) });
    if (!verRes.ok) {
      return { path: null, downloaded: false, error: `version json HTTP ${verRes.status}` };
    }
    const verJson = await verRes.json();
    const url = verJson?.downloads?.client_mappings?.url;
    if (!url) {
      return { path: null, downloaded: false, error: "no client_mappings in version json" };
    }
    const dl = await downloadFileAtomic(url, dest, {
      timeoutMs: 120_000,
      maxRedirects: 5,
      minBytes: 1024,
    });
    if (!dl.ok) {
      return { path: null, downloaded: false, error: dl.error ?? `HTTP ${dl.status}` };
    }
    return { path: dest, downloaded: true };
  } catch (e) {
    return { path: null, downloaded: false, error: e instanceof Error ? e.message : String(e) };
  }
}
