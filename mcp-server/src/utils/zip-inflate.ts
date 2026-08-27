/**
 * 受控 ZIP 条目解压（A-1 解压炸弹防护）。
 *
 * 所有内存级 inflate 调用（decompile/zip-util、localize/jar）必须经此模块：
 * - 声明解压尺寸超过绝对上限时拒绝进入 zlib（zip 头 usize 是攻击者可控的自声明字段，
 *   不能单独作为上限，故与硬上限取 min）。
 * - inflate 带 maxOutputLength 双保险；输出长度必须等于声明尺寸。
 */

import { inflateRawSync, crc32 } from "zlib";

export const DEFAULT_MAX_ENTRY_UNCOMPRESSED = 256 * 1024 * 1024;

export function resolveMaxEntryUncompressed(): number {
  const raw = process.env.MC_SKILL_MAX_ENTRY_BYTES;
  if (!raw) return DEFAULT_MAX_ENTRY_UNCOMPRESSED;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return DEFAULT_MAX_ENTRY_UNCOMPRESSED;
}

export class ZipEntryLimitError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "ZipEntryLimitError";
    this.code = code;
  }
}

/**
 * 解压单个 deflate 条目。declaredSize 取自中央目录 usize；
 * 与实际输出不符、超上限或膨胀超限均抛 ZipEntryLimitError（fail-closed，不静默跳过）。
 */
export function inflateZipEntry(compressed: Buffer, opts: { name: string; declaredSize: number }): Buffer {
  const max = resolveMaxEntryUncompressed();
  if (opts.declaredSize > max) {
    throw new ZipEntryLimitError(
      "ZIP_ENTRY_TOO_LARGE",
      `条目 ${opts.name} 声明解压体积 ${(opts.declaredSize / 1048576).toFixed(1)}MB 超过上限 ` +
        `${(max / 1048576).toFixed(0)}MB（可用 MC_SKILL_MAX_ENTRY_BYTES 调整），拒绝解压`,
    );
  }
  let out: Buffer;
  try {
    out = inflateRawSync(compressed, { maxOutputLength: Math.min(opts.declaredSize, max) });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ERR_BUFFER_TOO_LARGE") {
      throw new ZipEntryLimitError(
        "ZIP_ENTRY_BOMB_SUSPECTED",
        `条目 ${opts.name} 实际解压超出声明/上限，疑似压缩炸弹，已中止`,
      );
    }
    throw err;
  }
  if (out.length !== opts.declaredSize) {
    throw new ZipEntryLimitError(
      "ZIP_ENTRY_SIZE_MISMATCH",
      `条目 ${opts.name} 实际解压 ${out.length} 字节 ≠ 声明 ${opts.declaredSize} 字节（文件损坏或被构造）`,
    );
  }
  return out;
}

export function zipCrc32(buf: Buffer): number {
  return crc32(buf) >>> 0;
}
