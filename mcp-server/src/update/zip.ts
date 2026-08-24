/**
 * Minimal ZIP helpers: list entries (central directory) + extract via system tar.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { extractZip as mdkExtractZip, probeUnzipTool } from "../mdk/index.js";
import { isUnsafeZipEntry, isWindowsReservedName } from "../utils/zip-path-guard.js";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";

export interface ZipListResult {
  ok: boolean;
  entries?: string[];
  action?: ActionEnvelope;
}

/** Read file names from ZIP central directory (stored/deflated). */
export function listZipEntries(zipPath: string): ZipListResult {
  try {
    const st = readFileSync(zipPath);
    // Find EOCD
    let eocd = -1;
    for (let i = st.length - 22; i >= Math.max(0, st.length - 65557); i--) {
      if (st[i] === 0x50 && st[i + 1] === 0x4b && st[i + 2] === 0x05 && st[i + 3] === 0x06) {
        eocd = i;
        break;
      }
    }
    if (eocd < 0) {
      return {
        ok: false,
        action: actionable("DATA_ZIP_LAYOUT_INVALID", "无法解析 ZIP EOCD", ["确认文件为有效 zip"], [
          "mc_skill_update",
        ]),
      };
    }
    const cdOffset = st.readUInt32LE(eocd + 16);
    const cdCount = st.readUInt16LE(eocd + 10);
    // zip64（EOCD 计数/偏移为 0xFFFF/0xFFFFFFFF）不支持：显式失败，禁止静默截断校验视图
    if (cdCount === 0xffff || cdOffset === 0xffffffff) {
      return {
        ok: false,
        action: actionable("DATA_ZIP_LAYOUT_INVALID", "zip64 布局不受支持", [
          "Release 资产应为普通 zip（<65535 条目）",
          "校验 Release 资产来源",
        ], ["mc_skill_update"]),
      };
    }
    const entries: string[] = [];
    let pos = cdOffset;
    for (let i = 0; i < cdCount; i++) {
      // 中央目录必须在声明条目数内完整可读；签名不符 = 截断/伪造，fail-closed 而非静默少读
      if (pos + 46 > st.length || st.readUInt32LE(pos) !== 0x02014b50) {
        return {
          ok: false,
          action: actionable(
            "DATA_ZIP_LAYOUT_INVALID",
            `中央目录在第 ${i}/${cdCount} 条中断（截断或伪造）`,
            ["重新下载 Release 资产", "校验 SHA256SUMS"],
            ["mc_skill_update"],
          ),
        };
      }
      const nameLen = st.readUInt16LE(pos + 28);
      const extraLen = st.readUInt16LE(pos + 30);
      const commentLen = st.readUInt16LE(pos + 32);
      const name = st.subarray(pos + 46, pos + 46 + nameLen).toString("utf8");
      if (name && !name.endsWith("/")) entries.push(name.replace(/\\/g, "/"));
      pos += 46 + nameLen + extraLen + commentLen;
    }
    return { ok: true, entries };
  } catch (err) {
    return {
      ok: false,
      action: actionable(
        "DATA_ZIP_LAYOUT_INVALID",
        `读取 ZIP 失败: ${(err as Error).message}`,
        ["确认 zip 完整"],
        ["mc_skill_update"],
      ),
    };
  }
}

/**
 * Normalize zip entry paths to data-root-relative paths.
 * - Strip unique top-level `data/` prefix
 * - Reject `..`（segment 级）、绝对路径、盘符、Windows 保留名
 */
export function normalizeZipLayout(entries: string[]): {
  ok: boolean;
  mapped?: string[];
  strippedDataPrefix?: boolean;
  action?: ActionEnvelope;
} {
  const cleaned = entries
    .map((e) => e.replace(/\\/g, "/").replace(/^\.\//, ""))
    .filter((e) => e && !e.endsWith("/"));

  for (const e of cleaned) {
    if (isUnsafeZipEntry(e)) {
      return {
        ok: false,
        action: actionable(
          "DATA_ZIP_LAYOUT_INVALID",
          `不安全路径${isWindowsReservedName(e) ? "（Windows 保留设备名）" : ""}: ${e}`,
          ["Release zip 不得含 .. / 绝对路径 / Windows 保留名"],
          ["mc_skill_update"],
        ),
      };
    }
  }

  const tops = new Set(cleaned.map((e) => e.split("/")[0]));
  let mapped = cleaned;
  let strippedDataPrefix = false;
  if (tops.size === 1 && tops.has("data")) {
    strippedDataPrefix = true;
    mapped = cleaned.map((e) => e.replace(/^data\//, ""));
  } else if (tops.has("data") && tops.size > 1) {
    return {
      ok: false,
      action: actionable(
        "DATA_ZIP_LAYOUT_INVALID",
        "歧义布局：同时存在顶层 data/ 与其它目录",
        [
          "zip 根应为 forge_*/fabric_*/vanilla_* 等",
          "或仅含唯一顶层 data/（将自动剥离）",
        ],
        ["mc_skill_update"],
      ),
    };
  }

  return { ok: true, mapped, strippedDataPrefix };
}

export function extractZip(zipPath: string, destDir: string): { ok: boolean; action?: ActionEnvelope } {
  // GNU tar 不能解 zip；必须探测 unzip / 7z / bsdtar（与 mdk 同一套探测）
  const tool = probeUnzipTool();
  if (!tool) {
    return {
      ok: false,
      action: actionable(
        "UNZIP_TOOL_MISSING",
        "未找到可解 zip 的工具（unzip / 7z / bsdtar）",
        ["安装 unzip 或 7-Zip", "Windows 10+ 自带 System32 bsdtar", "不要假定 GNU tar 能解 zip"],
        ["mc_skill_update"],
      ),
    };
  }
  mkdirSync(destDir, { recursive: true });
  try {
    mdkExtractZip(zipPath, destDir, tool);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      action: actionable(
        "DATA_EXTRACT_FAILED",
        `解压失败（${tool.kind}）: ${(err as Error).message}`,
        [`解压工具：${tool.executable}`, "检查 zip 完整性"],
        ["mc_skill_update"],
      ),
    };
  }
}

/** After extract, resolve staging root (strip data/ if present as sole top dir). */
export function resolveStagingContentRoot(stagingDir: string): string {
  const dataSub = join(stagingDir, "data");
  if (existsSync(dataSub)) {
    // If staging only has data/, use it
    const kids = readdirSync(stagingDir).filter((n) => n !== "." && n !== "..");
    if (kids.length === 1 && kids[0] === "data" && statSync(dataSub).isDirectory()) {
      return dataSub;
    }
  }
  return stagingDir;
}
