/**
 * Read lang JSON entries from a mod jar (ZIP) without extracting to disk.
 * Supports stored (0) and deflated (8) entries; rejects zip-slip paths.
 */

import { existsSync, readFileSync, statSync } from "fs";
import { inflateRawSync } from "zlib";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";

const LANG_ENTRY_RE = /^assets\/([^/]+)\/lang\/([^/]+)\.json$/i;

export interface LangFileRef {
  namespace: string;
  locale: string;
  entryPath: string;
}

export interface JarScan {
  ok: true;
  byNamespace: Record<string, LangFileRef[]>;
  availableNamespaces: string[];
}

export type JarScanResult =
  | JarScan
  | { ok: false; code: string; action: ActionEnvelope; availableNamespaces: string[] };

function isUnsafePath(name: string): boolean {
  const n = name.replace(/\\/g, "/");
  return n.includes("..") || n.startsWith("/") || /^[A-Za-z]:/.test(n);
}

function findEocd(buf: Buffer): number {
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf[i] === 0x50 && buf[i + 1] === 0x4b && buf[i + 2] === 0x05 && buf[i + 3] === 0x06) {
      return i;
    }
  }
  return -1;
}

interface CdEntry {
  name: string;
  compression: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
}

function readCentralDirectory(buf: Buffer): CdEntry[] | null {
  const eocd = findEocd(buf);
  if (eocd < 0) return null;
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const cdCount = buf.readUInt16LE(eocd + 10);
  const entries: CdEntry[] = [];
  let pos = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const compression = buf.readUInt16LE(pos + 10);
    const compressedSize = buf.readUInt32LE(pos + 20);
    const uncompressedSize = buf.readUInt32LE(pos + 24);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localHeaderOffset = buf.readUInt32LE(pos + 42);
    const name = buf.subarray(pos + 46, pos + 46 + nameLen).toString("utf8");
    if (name && !name.endsWith("/")) {
      entries.push({
        name: name.replace(/\\/g, "/"),
        compression,
        compressedSize,
        uncompressedSize,
        localHeaderOffset,
      });
    }
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extractEntry(buf: Buffer, entry: CdEntry): Buffer {
  const off = entry.localHeaderOffset;
  if (buf.readUInt32LE(off) !== 0x04034b50) {
    throw new Error(`无效 local header: ${entry.name}`);
  }
  const nameLen = buf.readUInt16LE(off + 26);
  const extraLen = buf.readUInt16LE(off + 28);
  const dataStart = off + 30 + nameLen + extraLen;
  const compressed = buf.subarray(dataStart, dataStart + entry.compressedSize);
  if (entry.compression === 0) {
    return Buffer.from(compressed);
  }
  if (entry.compression === 8) {
    return inflateRawSync(compressed);
  }
  throw new Error(`不支持的压缩方式 ${entry.compression}: ${entry.name}`);
}

export function loadJarBuffer(jarPath: string):
  | { ok: true; buf: Buffer }
  | { ok: false; code: string; action: ActionEnvelope } {
  if (!jarPath || typeof jarPath !== "string") {
    return {
      ok: false,
      code: "JAR_NOT_FOUND",
      action: actionable("JAR_NOT_FOUND", "jarPath 为空", ["提供本地 jar 绝对路径"], ["localize_mod"]),
    };
  }
  if (!existsSync(jarPath)) {
    return {
      ok: false,
      code: "JAR_NOT_FOUND",
      action: actionable("JAR_NOT_FOUND", `jar 不存在: ${jarPath}`, ["检查路径", "确认文件已下载完整"], [
        "localize_mod",
      ]),
    };
  }
  try {
    const st = statSync(jarPath);
    if (!st.isFile() || st.size < 22) {
      return {
        ok: false,
        code: "JAR_UNREADABLE",
        action: actionable("JAR_UNREADABLE", `不是有效 jar/zip: ${jarPath}`, ["重新下载模组 jar"], [
          "localize_mod",
        ]),
      };
    }
    const buf = readFileSync(jarPath);
    if (findEocd(buf) < 0) {
      return {
        ok: false,
        code: "JAR_UNREADABLE",
        action: actionable("JAR_UNREADABLE", `无法解析 ZIP EOCD: ${jarPath}`, ["文件可能损坏或不完整"], [
          "localize_mod",
        ]),
      };
    }
    return { ok: true, buf };
  } catch (err) {
    return {
      ok: false,
      code: "JAR_UNREADABLE",
      action: actionable("JAR_UNREADABLE", `读取失败: ${(err as Error).message}`, ["检查权限与文件完整性"], [
        "localize_mod",
      ]),
    };
  }
}

export function scanJarLangFiles(buf: Buffer): JarScanResult {
  const cd = readCentralDirectory(buf);
  if (!cd) {
    return {
      ok: false,
      code: "JAR_UNREADABLE",
      availableNamespaces: [],
      action: actionable("JAR_UNREADABLE", "无法读取 ZIP 中央目录", ["确认 jar 完整"], ["localize_mod"]),
    };
  }

  const byNamespace: Record<string, LangFileRef[]> = {};
  for (const e of cd) {
    if (isUnsafePath(e.name)) {
      return {
        ok: false,
        code: "JAR_UNREADABLE",
        availableNamespaces: [],
        action: actionable("JAR_UNREADABLE", `拒绝不安全路径: ${e.name}`, ["使用官方/可信模组 jar"], [
          "localize_mod",
        ]),
      };
    }
    const m = e.name.match(LANG_ENTRY_RE);
    if (!m) continue;
    const namespace = m[1];
    const locale = m[2].toLowerCase();
    if (namespace === "minecraft") continue;
    const ref: LangFileRef = { namespace, locale, entryPath: e.name };
    (byNamespace[namespace] ??= []).push(ref);
  }

  for (const ns of Object.keys(byNamespace)) {
    byNamespace[ns].sort((a, b) => a.locale.localeCompare(b.locale));
  }

  const availableNamespaces = Object.keys(byNamespace).sort();
  return { ok: true, byNamespace, availableNamespaces };
}

export function readJarEntryText(buf: Buffer, entryPath: string): string {
  const cd = readCentralDirectory(buf);
  if (!cd) throw new Error("无法读取中央目录");
  const entry = cd.find((e) => e.name === entryPath || e.name.replace(/\\/g, "/") === entryPath);
  if (!entry) throw new Error(`条目不存在: ${entryPath}`);
  return extractEntry(buf, entry).toString("utf8");
}

export function isChineseLocale(locale: string): boolean {
  const l = locale.toLowerCase().replace(/\.json$/, "");
  return l === "zh_cn" || l === "zh_tw";
}

export function canBeSourceLocale(locale: string): boolean {
  return !isChineseLocale(locale);
}

/** Namespaces that have at least one non-Chinese lang JSON. */
export function namespacesWithSource(byNamespace: Record<string, LangFileRef[]>): string[] {
  return Object.keys(byNamespace)
    .filter((ns) => byNamespace[ns].some((f) => canBeSourceLocale(f.locale)))
    .sort();
}

/** Namespaces that only have Chinese lang files. */
export function namespacesChineseOnly(byNamespace: Record<string, LangFileRef[]>): string[] {
  return Object.keys(byNamespace)
    .filter((ns) => {
      const files = byNamespace[ns];
      return files.length > 0 && files.every((f) => isChineseLocale(f.locale));
    })
    .sort();
}

export function normalizeLocaleToken(raw: string): string {
  return raw.trim().toLowerCase().replace(/\.json$/i, "");
}

/**
 * Pick source locale for a namespace.
 * Order: explicit → en_us → other en_* → other non-zh (sorted).
 */
export function pickSourceLocale(
  files: LangFileRef[],
  explicit?: string,
): { locale: string; entryPath: string; fallback: boolean } | null {
  const usable = files.filter((f) => canBeSourceLocale(f.locale));
  if (usable.length === 0) return null;

  if (explicit) {
    const want = normalizeLocaleToken(explicit);
    const hit = usable.find((f) => f.locale === want);
    if (!hit) return null;
    return { locale: hit.locale, entryPath: hit.entryPath, fallback: hit.locale !== "en_us" };
  }

  const enUs = usable.find((f) => f.locale === "en_us");
  if (enUs) return { locale: enUs.locale, entryPath: enUs.entryPath, fallback: false };

  const enOthers = usable.filter((f) => f.locale.startsWith("en_")).sort((a, b) => a.locale.localeCompare(b.locale));
  if (enOthers.length) {
    return { locale: enOthers[0].locale, entryPath: enOthers[0].entryPath, fallback: true };
  }

  const rest = usable.slice().sort((a, b) => a.locale.localeCompare(b.locale));
  return { locale: rest[0].locale, entryPath: rest[0].entryPath, fallback: true };
}

export function findZhCn(files: LangFileRef[]): LangFileRef | undefined {
  return files.find((f) => f.locale === "zh_cn");
}
