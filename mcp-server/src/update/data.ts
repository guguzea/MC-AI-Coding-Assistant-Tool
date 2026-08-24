/**
 * Data pack update: download, verify, layout, overwrite list, extract.
 */

import { createHash } from "crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readSync,
  closeSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statfsSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, join, relative, sep } from "path";
import { tmpdir } from "os";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";
import { resolveDataDir } from "../utils/path.js";
import {
  assertCreatableDir,
  assertWritablePath,
  getAllowRootReal,
  isInsideReal,
  nativeReal,
} from "../utils/project-sandbox.js";
import { cleanupPath, downloadToFile } from "./download.js";
import type { GhAsset } from "./github.js";
import { extractZip, listZipEntries, normalizeZipLayout, resolveStagingContentRoot } from "./zip.js";
import { verifyExtractedTree } from "../utils/extract-verify.js";
import { writeUpdateState } from "./state.js";
import { closeSemanticDbs } from "../docs-platform/semantic/search.js";

export interface DiskSpaceInfo {
  neededBytes: number;
  freeBytes: number | null;
  ok: boolean;
}

export function estimateNeededBytes(zipSize: number): number {
  return Math.ceil(zipSize * 2.5);
}

export function getFreeBytes(dirPath: string): number | null {
  try {
    const s = statfsSync(dirPath);
    return Number(s.bavail) * Number(s.bsize);
  } catch {
    return null;
  }
}

export function checkDiskSpace(dirPath: string, zipSize: number): DiskSpaceInfo {
  const neededBytes = estimateNeededBytes(zipSize);
  const freeBytes = getFreeBytes(existsSync(dirPath) ? dirPath : dirname(dirPath));
  return {
    neededBytes,
    freeBytes,
    ok: freeBytes === null || freeBytes >= neededBytes,
  };
}

function parseSha256Sums(text: string, assetName: string): string | null {
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Fa-f0-9]{64})\s+\*?(.+)$/);
    if (!m) continue;
    const name = m[2].trim().replace(/^\.\//, "");
    if (name === assetName || name.endsWith("/" + assetName) || name.endsWith("\\" + assetName)) {
      return m[1].toLowerCase();
    }
  }
  // single-hash file
  const only = text.trim().match(/^([A-Fa-f0-9]{64})\b/);
  return only ? only[1].toLowerCase() : null;
}

export function sha256File(path: string): string {
  const h = createHash("sha256");
  const fd = openSync(path, "r");
  try {
    const buf = Buffer.allocUnsafe(64 * 1024);
    let n: number;
    while ((n = readSync(fd, buf, 0, buf.length, null)) > 0) {
      h.update(buf.subarray(0, n));
    }
    return h.digest("hex");
  } finally {
    closeSync(fd);
  }
}

function walkFiles(root: string, base = root, depth = 0, seen?: Set<string>): string[] {
  const out: string[] = [];
  if (!existsSync(root) || depth > 32) return out;
  let real: string;
  try {
    real = nativeReal(root);
  } catch {
    return out;
  }
  const seenSet = seen ?? new Set();
  if (seenSet.has(real)) return out;
  seenSet.add(real);
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    const st = lstatSync(p);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) out.push(...walkFiles(p, base, depth + 1, seenSet));
    else out.push(relative(base, p).split(sep).join("/"));
  }
  return out;
}

/** 解压后重扫 staging：zip 成员不得以 symlink/junction 形式落盘（防把外部文件拷进 dataDir）。 */
function findSymlinkInTree(root: string): string | null {
  if (!existsSync(root)) return null;
  // 与 walkFiles 同款防护：深度上限 + realpath 已访问集，防 junction 环导致死循环
  const seen = new Set<string>();
  const walk = (dir: string, depth: number): string | null => {
    if (depth > 32) return null;
    let real: string;
    try {
      real = nativeReal(dir);
    } catch {
      return null;
    }
    if (seen.has(real)) return null;
    seen.add(real);
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = lstatSync(p);
      if (st.isSymbolicLink()) return relative(root, p).split(sep).join("/");
      if (st.isDirectory()) {
        const hit = walk(p, depth + 1);
        if (hit) return hit;
      }
    }
    return null;
  };
  return walk(root, 0);
}

function copyTree(srcRoot: string, destRoot: string, allowRoot: string): string[] {
  const written: string[] = [];
  for (const rel of walkFiles(srcRoot)) {
    const from = join(srcRoot, rel);
    const to = join(destRoot, rel);
    assertCreatableDir(dirname(to), allowRoot);
    mkdirSync(dirname(to), { recursive: true });
    assertWritablePath(to, allowRoot);
    copyFileSync(from, to);
    written.push(rel);
  }
  return written;
}

function siblingName(dataDir: string, suffix: string): string {
  return `${dataDir}${suffix}`;
}

function recoverPartialSwap(dataDir: string): void {
  const prevDir = siblingName(dataDir, ".prev");
  const nextDir = siblingName(dataDir, ".next");
  if (!existsSync(dataDir) && existsSync(prevDir)) {
    renameSync(prevDir, dataDir);
  }
  if (existsSync(dataDir) && existsSync(prevDir)) {
    rmSync(prevDir, { recursive: true, force: true });
  }
  if (existsSync(nextDir)) {
    rmSync(nextDir, { recursive: true, force: true });
  }
}

/** 把 nextDir rename 成活 dataDir；失败则尽量把 prev 换回。 */
function swapInDataDir(nextDir: string, dataDir: string): void {
  const prevDir = siblingName(dataDir, ".prev");
  try {
    closeSemanticDbs();
  } catch {
    /* 无打开句柄时忽略 */
  }
  if (existsSync(prevDir)) {
    rmSync(prevDir, { recursive: true, force: true });
  }
  try {
    if (existsSync(dataDir)) {
      renameSync(dataDir, prevDir);
    }
    renameSync(nextDir, dataDir);
  } catch (err) {
    if (existsSync(prevDir) && !existsSync(dataDir)) {
      try {
        renameSync(prevDir, dataDir);
      } catch {
        /* 换回失败时活树可能在 prev */
      }
    }
    const wrapped = new Error((err as Error).message) as Error & { code?: string };
    wrapped.code = "DATA_SWAP_FAILED";
    throw wrapped;
  }
  if (existsSync(prevDir)) {
    rmSync(prevDir, { recursive: true, force: true });
  }
}

export interface DataApplyOpts {
  zip: GhAsset;
  sums?: GhAsset;
  /** 来自 GitHub Release asset digest（无 SHA256SUMS 时使用） */
  checksumHex?: string;
  releaseTag: string;
  dryRun: boolean;
  dataDir?: string;
  /** For tests: local zip/sums paths instead of download. */
  localZipPath?: string;
  localSumsPath?: string;
  fetchImpl?: typeof fetch;
}

export interface DataApplyResult {
  ok: boolean;
  steps: string[];
  filesToOverwrite: string[];
  diskSpace?: DiskSpaceInfo;
  strippedDataPrefix?: boolean;
  writtenCount?: number;
  action?: ActionEnvelope;
}

export async function applyDataUpdate(opts: DataApplyOpts): Promise<DataApplyResult> {
  const steps: string[] = [];
  const dataDir = opts.dataDir ?? resolveDataDir();
  const diskSpace = checkDiskSpace(dataDir, opts.zip.size);
  steps.push(`download ${opts.zip.name} (${opts.zip.size} bytes)`);
  steps.push(
    opts.checksumHex && !opts.sums && !opts.localSumsPath
      ? `verify SHA256 via GitHub asset digest`
      : `verify SHA256 via ${opts.sums?.name ?? opts.localSumsPath ?? "checksum"}`,
  );
  steps.push(`extract into ${dataDir} (layout: zip root = data contents)`);

  if (!diskSpace.ok) {
    return {
      ok: false,
      steps,
      filesToOverwrite: [],
      diskSpace,
      action: actionable(
        "DISK_SPACE_INSUFFICIENT",
        `磁盘空间不足：需要约 ${diskSpace.neededBytes} 字节，可用 ${diskSpace.freeBytes}`,
        ["清理磁盘后重试"],
        ["mc_skill_update"],
      ),
    };
  }

  // Allowlist: data must live under PROJECT_ROOT for real writes
  let allowRoot: string | undefined;
  if (!opts.dryRun) {
    try {
      allowRoot = getAllowRootReal();
      const realData = existsSync(dataDir) ? nativeReal(dataDir) : nativeReal(dirname(dataDir));
      if (!isInsideReal(realData, allowRoot) && realData !== allowRoot) {
        return {
          ok: false,
          steps,
          filesToOverwrite: [],
          diskSpace,
          action: actionable(
            "DATA_OUTSIDE_ALLOWLIST",
            "MC_SKILL_DATA 不在 MC_SKILL_PROJECT_ROOT 内",
            ["将 data 放在仓库根下，或扩大 PROJECT_ROOT"],
            ["mc_skill_update"],
          ),
        };
      }
    } catch (err) {
      return {
        ok: false,
        steps,
        filesToOverwrite: [],
        diskSpace,
        action: actionable(
          (err as { code?: string }).code ?? "WRITE_DISABLED",
          (err as Error).message,
          ["设置 MC_SKILL_ALLOW_WRITE=1 与仓库根 PROJECT_ROOT"],
          ["mc_skill_update"],
        ),
      };
    }
  }

  const tmpBase = join(tmpdir(), `mc-skill-update-${process.pid}-${Date.now()}`);
  mkdirSync(tmpBase, { recursive: true });
  // 落盘名固定常量：远端 asset name 只用于 URL/校验条目匹配，不进本地路径（防 ../ 注入）
  const zipPath = opts.localZipPath ?? join(tmpBase, "mc-skill-data.zip");
  const sumsPath = opts.localSumsPath ?? (opts.sums ? join(tmpBase, "SHA256SUMS.txt") : undefined);
  const staging = join(tmpBase, "staging");

  try {
    if (!opts.localZipPath) {
      const dl = await downloadToFile(opts.zip.browser_download_url, zipPath, {
        fetchImpl: opts.fetchImpl,
      });
      if (!dl.ok) return { ok: false, steps, filesToOverwrite: [], diskSpace, action: dl.action };
    }
    let expected = opts.checksumHex?.toLowerCase() ?? null;
    if (!expected) {
      if (!sumsPath || (!opts.localSumsPath && !opts.sums)) {
        return {
          ok: false,
          steps,
          filesToOverwrite: [],
          diskSpace,
          action: actionable(
            "DATA_CHECKSUM_MISSING",
            "无 SHA256SUMS 且无 GitHub digest",
            ["检查 Release checksum"],
            ["mc_skill_update"],
          ),
        };
      }
      if (!opts.localSumsPath && opts.sums) {
        const dl2 = await downloadToFile(opts.sums.browser_download_url, sumsPath, {
          fetchImpl: opts.fetchImpl,
        });
        if (!dl2.ok) return { ok: false, steps, filesToOverwrite: [], diskSpace, action: dl2.action };
      }
      expected = parseSha256Sums(readFileSync(sumsPath, "utf8"), opts.zip.name);
    }
    if (!expected) {
      return {
        ok: false,
        steps,
        filesToOverwrite: [],
        diskSpace,
        action: actionable(
          "DATA_CHECKSUM_MISSING",
          `SHA256SUMS 中未找到 ${opts.zip.name}`,
          ["检查 Release checksum 文件格式"],
          ["mc_skill_update"],
        ),
      };
    }
    const actual = sha256File(zipPath);
    if (actual !== expected) {
      return {
        ok: false,
        steps,
        filesToOverwrite: [],
        diskSpace,
        action: actionable(
          "DATA_CHECKSUM_MISMATCH",
          `SHA256 不匹配: expected ${expected}, got ${actual}`,
          ["重新下载", "确认 Release 资产完整"],
          ["mc_skill_update"],
        ),
      };
    }

    const listed = listZipEntries(zipPath);
    if (!listed.ok || !listed.entries) {
      return { ok: false, steps, filesToOverwrite: [], diskSpace, action: listed.action };
    }
    const layout = normalizeZipLayout(listed.entries);
    if (!layout.ok || !layout.mapped) {
      return { ok: false, steps, filesToOverwrite: [], diskSpace, action: layout.action };
    }

    const filesToOverwrite = layout.mapped.filter((rel) => existsSync(join(dataDir, rel)));
    steps.push(`filesToOverwrite: ${filesToOverwrite.length}`);

    if (opts.dryRun) {
      return {
        ok: true,
        steps,
        filesToOverwrite,
        diskSpace,
        strippedDataPrefix: layout.strippedDataPrefix,
      };
    }

    const ex = extractZip(zipPath, staging);
    if (!ex.ok) return { ok: false, steps, filesToOverwrite, diskSpace, action: ex.action };
    const symlink = findSymlinkInTree(staging);
    if (symlink) {
      return {
        ok: false,
        steps,
        filesToOverwrite,
        diskSpace,
        action: actionable(
          "DATA_ZIP_LAYOUT_INVALID",
          `解压产物含符号链接: ${symlink}`,
          ["Release zip 不得含 symlink/hardlink 成员", "校验 Release 资产来源与 SHA256SUMS"],
          ["mc_skill_update"],
        ),
      };
    }
    const contentRoot = resolveStagingContentRoot(staging);
    // A-2 双视图复核：解压器按 LFH 落盘，可能与 CD 清单不一致；集合不符或 realpath 逃逸即拒绝
    const verify = verifyExtractedTree(contentRoot, layout.mapped);
    if (!verify.ok) {
      return {
        ok: false,
        steps,
        filesToOverwrite,
        diskSpace,
        action: actionable(
          "DATA_ZIP_LAYOUT_INVALID",
          `解压产物与中央目录清单不一致: ${verify.problem}`,
          ["Release zip 可能被构造（CD 与 LFH 视图分裂）", "校验 Release 资产来源与 SHA256SUMS"],
          ["mc_skill_update"],
        ),
      };
    }
    recoverPartialSwap(dataDir);
    const nextDir = siblingName(dataDir, ".next");
    mkdirSync(nextDir, { recursive: true });
    try {
      if (existsSync(dataDir)) {
        copyTree(dataDir, nextDir, allowRoot!);
      }
      const written = copyTree(contentRoot, nextDir, allowRoot!);
      swapInDataDir(nextDir, dataDir);
      writeUpdateState(
        {
          dataReleaseTag: opts.releaseTag,
          dataAssetName: opts.zip.name,
          updatedAt: new Date().toISOString(),
        },
        dataDir,
      );

      return {
        ok: true,
        steps,
        filesToOverwrite,
        diskSpace,
        strippedDataPrefix: layout.strippedDataPrefix,
        writtenCount: written.length,
      };
    } catch (err) {
      if (existsSync(nextDir)) {
        try {
          rmSync(nextDir, { recursive: true, force: true });
        } catch {
          /* ignore */
        }
      }
      const code = (err as { code?: string }).code === "DATA_SWAP_FAILED" ? "DATA_SWAP_FAILED" : "DATA_APPLY_FAILED";
      return {
        ok: false,
        steps,
        filesToOverwrite,
        diskSpace,
        action: actionable(
          code,
          `数据换入失败: ${(err as Error).message}`,
          ["活动 dataDir 应保持旧内容", "关闭占用 dataDir 的进程后重试"],
          ["mc_skill_update"],
        ),
      };
    }
  } finally {
    cleanupPath(tmpBase);
  }
}

/** Exported for tests that need a tiny store-only zip without tar quirks. */
export function writeStoreZip(zipPath: string, files: Record<string, string | Buffer>): void {
  // Minimal ZIP writer (store only)
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  const entries = Object.entries(files);
  for (const [name, content] of entries) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const nameBuf = Buffer.from(name, "utf8");
    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8); // store
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(0, 14); // crc optional 0 for tests list; set properly
    const crc = crc32(data);
    local.writeUInt32LE(crc >>> 0, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    nameBuf.copy(local, 30);
    parts.push(local, data);

    const cd = Buffer.alloc(46 + nameBuf.length);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc >>> 0, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    nameBuf.copy(cd, 46);
    central.push(cd);
    offset += local.length + data.length;
  }
  const cdBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  mkdirSync(dirname(zipPath), { recursive: true });
  writeFileSync(zipPath, Buffer.concat([...parts, cdBuf, eocd]));
}

function crc32(buf: Buffer): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c;
}
