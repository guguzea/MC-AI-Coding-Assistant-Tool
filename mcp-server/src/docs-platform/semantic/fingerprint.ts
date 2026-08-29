/**
 * processed/ + index-l0.json 内容指纹，用于判断 semantic sqlite 是否过期。
 */
import { createHash } from "crypto";
import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { walkDirBounded } from "../../utils/project-files.js";

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return walkDirBounded(dir, { maxDepth: 16, allFiles: true });
}

type FpCache = { fp: string | null; mtimeMax: number; fileCount: number; expiresAt: number };
const _fpCache = new Map<string, FpCache>();
const FP_TTL_MS = 5 * 60 * 1000;

function processedFileCount(versionDir: string): number {
  return walkFiles(join(versionDir, "processed")).length;
}

/** 对 versionDir（含 processed/ 与 index-l0.json）做稳定 sha256 */
export function computeSourceFingerprint(versionDir: string): string | null {
  if (!existsSync(versionDir)) return null;
  const mtimeMax = maxProcessedMtimeMs(versionDir);
  const fileCount = processedFileCount(versionDir);
  const now = Date.now();
  const cached = _fpCache.get(versionDir);
  if (cached && cached.expiresAt > now && cached.mtimeMax === mtimeMax && cached.fileCount === fileCount) {
    return cached.fp;
  }
  const files: string[] = [];
  const l0 = join(versionDir, "index-l0.json");
  if (existsSync(l0)) files.push(l0);
  const processed = join(versionDir, "processed");
  for (const f of walkFiles(processed)) {
    if (/\.(md|markdown|txt)$/i.test(f)) files.push(f);
  }
  files.sort((a, b) => {
    const x = a.replace(/\\/g, "/");
    const y = b.replace(/\\/g, "/");
    return x < y ? -1 : x > y ? 1 : 0;
  });
  if (files.length === 0) {
    _fpCache.set(versionDir, { fp: null, mtimeMax, fileCount, expiresAt: now + FP_TTL_MS });
    return null;
  }
  const h = createHash("sha256");
  for (const f of files) {
    const rel = f.slice(versionDir.length).replace(/\\/g, "/");
    h.update(rel);
    h.update("\0");
    h.update(readFileSync(f));
    h.update("\0");
  }
  const fp = h.digest("hex");
  _fpCache.set(versionDir, { fp, mtimeMax, fileCount, expiresAt: now + FP_TTL_MS });
  return fp;
}

export function maxProcessedMtimeMs(versionDir: string): number {
  let max = 0;
  const l0 = join(versionDir, "index-l0.json");
  try {
    if (existsSync(l0)) max = Math.max(max, statSync(l0).mtimeMs);
  } catch {
    /* skip */
  }
  for (const f of walkFiles(join(versionDir, "processed"))) {
    try {
      max = Math.max(max, statSync(f).mtimeMs);
    } catch {
      /* skip */
    }
  }
  return max;
}

export function isSemanticIndexStale(opts: {
  builtAtIso?: string | null;
  storedFingerprint?: string | null;
  versionDir: string;
}): { stale: boolean; reason?: string; fingerprintMismatchOnly?: boolean } {
  const fp = computeSourceFingerprint(opts.versionDir);
  const builtMs = opts.builtAtIso ? Date.parse(opts.builtAtIso) : NaN;
  const srcMtime = maxProcessedMtimeMs(opts.versionDir);
  const srcNewer = Number.isFinite(builtMs) && srcMtime > builtMs + 1000;
  const mismatched = Boolean(fp && opts.storedFingerprint && fp !== opts.storedFingerprint);

  if (mismatched && srcNewer) {
    return { stale: true, reason: "source_fingerprint mismatch (source newer than built_at)" };
  }
  if (srcNewer) {
    return { stale: true, reason: "processed mtime newer than built_at" };
  }
  if (mismatched) {
    // 指纹不一致，但源并不比索引新 → 判为**假性过期**。
    // 成因：指纹对 rel 路径敏感（versionDir 传入形式的差异就会改变 rel），
    // 重建索引后往往依旧 mismatch，误报会污染每次 search 的输出。
    // 保守处理：不判 stale，但把信息回传以便诊断。
    return {
      stale: false,
      reason: "fingerprint mismatch (source unchanged)",
      fingerprintMismatchOnly: true,
    };
  }
  return { stale: false };
}
