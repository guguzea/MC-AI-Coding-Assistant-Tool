/**
 * processed/ + index-l0.json 内容指纹，用于判断 semantic sqlite 是否过期。
 */
import { createHash } from "crypto";
import { existsSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { walkDirBounded } from "../../utils/project-files.js";

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return walkDirBounded(dir, { maxDepth: 16, allFiles: true });
}

/** versionDir 无关的相对路径（正斜杠）：同一棵树不论以绝对/相对/大小写形式传入都得到同一个 key */
function relKey(versionDir: string, file: string): string {
  return relative(versionDir, file).replace(/\\/g, "/");
}

type FpCache = { fp: string | null; mtimeMax: number; fileCount: number; expiresAt: number };
const _fpCache = new Map<string, FpCache>();
const FP_TTL_MS = 5 * 60 * 1000;

/**
 * D-49：最近一次指纹计算为什么「不可判定」。
 * null = 正常；非 null = 有文件读不出来（H: 盘抖动 / EBUSY / 竞态删除），
 * 此时指纹返回 null，调用方必须按「无法判定」处理，绝不能当作「一致」或「过期」。
 */
let _lastUndecidable: { file: string; error: string } | null = null;

export function fingerprintUndecidableReason(): { file: string; error: string } | null {
  return _lastUndecidable;
}

function processedFileCount(versionDir: string): number {
  return walkFiles(join(versionDir, "processed")).length;
}

/** 对 versionDir（含 processed/ 与 index-l0.json）做稳定 sha256；读不动任何文件时返回 null */
export function computeSourceFingerprint(versionDir: string): string | null {
  _lastUndecidable = null;
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
    const x = relKey(versionDir, a);
    const y = relKey(versionDir, b);
    return x < y ? -1 : x > y ? 1 : 0;
  });
  if (files.length === 0) {
    _fpCache.set(versionDir, { fp: null, mtimeMax, fileCount, expiresAt: now + FP_TTL_MS });
    return null;
  }
  const h = createHash("sha256");
  for (const f of files) {
    const rel = relKey(versionDir, f);
    h.update(rel);
    h.update("\0");
    try {
      // D-49：单个文件读失败（volatile 盘抖动、被并发删掉、EBUSY）不得把整个
      // diagnose/search 路径炸掉 —— 判定为「不可判定」并放弃本轮指纹。
      h.update(readFileSync(f));
    } catch (err) {
      const e = err as { code?: string; message?: string } | undefined;
      _lastUndecidable = { file: rel, error: String(e?.code ?? e?.message ?? err) };
      // 不写 _fpCache：下次仍会重试（源文件本身可能已经恢复）
      return null;
    }
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
}): {
  stale: boolean;
  reason?: string;
  fingerprintMismatchOnly?: boolean;
  /** D-49：源文件读不出来 → 既不能判过期也不能判新鲜 */
  undecidable?: boolean;
} {
  const fp = computeSourceFingerprint(opts.versionDir);
  const undecidable = fp === null ? fingerprintUndecidableReason() : null;
  const builtMs = opts.builtAtIso ? Date.parse(opts.builtAtIso) : NaN;
  const srcMtime = maxProcessedMtimeMs(opts.versionDir);
  const srcNewer = Number.isFinite(builtMs) && srcMtime > builtMs + 1000;
  const mismatched = Boolean(fp && opts.storedFingerprint && fp !== opts.storedFingerprint);

  if (srcNewer) {
    return {
      stale: true,
      reason: undecidable
        ? "processed mtime newer than built_at (source_fingerprint undecidable)"
        : "processed mtime newer than built_at",
    };
  }
  if (undecidable) {
    // 读不动源文件（volatile 盘抖动 / 并发删除 / EBUSY）→ 明确「不可判定」，
    // 不冒充 fresh，也不冒充 stale；调用方照常不重建，但诊断里看得见原因。
    return {
      stale: false,
      undecidable: true,
      reason: `fingerprint undecidable (unreadable source file: ${undecidable.file}; ${undecidable.error})`,
    };
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
