/**
 * 零依赖 ZIP 读取（T2：mod jar 元数据解析）。
 *
 * 基于中央目录（central directory）实现，支持：
 * - method 0（store）与 method 8（deflate，inflateRawSync）
 * - UTF-8 文件名（flags bit 11）
 * - 目录项跳过、ZIP64 明确拒绝（jar 极少超过 4GB）
 *
 * 不做路径穿越/解压到盘，仅内存读取。
 */

import { inflateRawSync } from "zlib";

export class ZipParseError extends Error {
  constructor(message: string) {
    super(`ZIP 解析失败: ${message}`);
  }
}

interface CentralEntry {
  name: string;
  method: number;
  csize: number;
  usize: number;
  localOffset: number;
  flags: number;
}

const EOCD_SIG = 0x06054b50;
const CENTRAL_SIG = 0x02014b50;
const LOCAL_SIG = 0x04034b50;

function findEocd(buf: Buffer): number {
  const minSearch = Math.max(0, buf.length - 22 - 65535);
  for (let i = buf.length - 22; i >= minSearch; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) return i;
  }
  throw new ZipParseError("未找到 End of Central Directory 记录（不是有效的 zip/jar）");
}

function parseCentralEntries(buf: Buffer, cdOffset: number, cdSize: number, count: number): CentralEntry[] {
  if (cdOffset + cdSize > buf.length) {
    throw new ZipParseError("中央目录越界（文件被截断）");
  }
  const entries: CentralEntry[] = [];
  let pos = cdOffset;
  for (let i = 0; i < count; i++) {
    if (pos + 46 > buf.length) throw new ZipParseError("中央目录条目越界");
    if (buf.readUInt32LE(pos) !== CENTRAL_SIG) throw new ZipParseError("中央目录条目签名错误");
    const flags = buf.readUInt16LE(pos + 8);
    const method = buf.readUInt16LE(pos + 10);
    const csize = buf.readUInt32LE(pos + 20);
    const usize = buf.readUInt32LE(pos + 24);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localOffset = buf.readUInt32LE(pos + 42);
    if (pos + 46 + nameLen + extraLen + commentLen > buf.length) {
      throw new ZipParseError("中央目录条目名称区越界");
    }
    const nameBuf = buf.subarray(pos + 46, pos + 46 + nameLen);
    const name = flags & 0x800 ? nameBuf.toString("utf8") : nameBuf.toString("latin1");
    entries.push({ name, method, csize, usize, localOffset, flags });
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function readEntryData(buf: Buffer, entry: CentralEntry): Buffer {
  if (entry.localOffset + 30 > buf.length) throw new ZipParseError("local header 越界");
  if (buf.readUInt32LE(entry.localOffset) !== LOCAL_SIG) {
    throw new ZipParseError(`条目 ${entry.name} local header 签名错误`);
  }
  const nameLen = buf.readUInt16LE(entry.localOffset + 26);
  const extraLen = buf.readUInt16LE(entry.localOffset + 28);
  const dataStart = entry.localOffset + 30 + nameLen + extraLen;
  if (dataStart + entry.csize > buf.length) throw new ZipParseError(`条目 ${entry.name} 数据越界`);
  const compressed = buf.subarray(dataStart, dataStart + entry.csize);
  if (entry.method === 0) {
    if (entry.csize !== entry.usize) throw new ZipParseError(`条目 ${entry.name} store 尺寸不一致`);
    return Buffer.from(compressed);
  }
  if (entry.method === 8) {
    return inflateRawSync(compressed);
  }
  throw new ZipParseError(`条目 ${entry.name} 使用不支持的压缩方法 ${entry.method}（仅 store/deflate）`);
}

/** 读取 zip/jar 二进制 → 条目名 → 内容（不含目录项）。 */
export function readZip(buffer: Buffer): Map<string, Buffer> {
  const eocd = findEocd(buffer);
  const count = buffer.readUInt16LE(eocd + 10);
  if (count === 0xffff) {
    throw new ZipParseError("ZIP64 不支持（jar 不应超过 4GB）");
  }
  const cdSize = buffer.readUInt32LE(eocd + 12);
  const cdOffset = buffer.readUInt32LE(eocd + 16);

  const entries = parseCentralEntries(buffer, cdOffset, cdSize, count);
  const out = new Map<string, Buffer>();
  for (const entry of entries) {
    if (entry.name.endsWith("/")) continue; // 目录项
    if (out.has(entry.name)) continue;
    out.set(entry.name, readEntryData(buffer, entry));
  }
  return out;
}

/** 仅取条目名列表（不展开数据，快速扫描用）。 */
export function listZipEntries(buffer: Buffer): string[] {
  const eocd = findEocd(buffer);
  const count = buffer.readUInt16LE(eocd + 10);
  if (count === 0xffff) throw new ZipParseError("ZIP64 不支持");
  const cdSize = buffer.readUInt32LE(eocd + 12);
  const cdOffset = buffer.readUInt32LE(eocd + 16);
  return parseCentralEntries(buffer, cdOffset, cdSize, count).map((e) => e.name);
}
