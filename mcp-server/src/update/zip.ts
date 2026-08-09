/**
 * Minimal ZIP helpers: list entries (central directory) + extract via system tar.
 */

import { execFileSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, openSync, readSync, closeSync } from "fs";
import { join } from "path";
import { actionable, type ActionEnvelope } from "../utils/actionable.js";

export interface ZipListResult {
  ok: boolean;
  entries?: string[];
  action?: ActionEnvelope;
}

/** Read file names from ZIP central directory (stored/deflated). */
export function listZipEntries(zipPath: string): ZipListResult {
  try {
    const fd = openSync(zipPath, "r");
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
      const entries: string[] = [];
      let pos = cdOffset;
      for (let i = 0; i < cdCount; i++) {
        if (st.readUInt32LE(pos) !== 0x02014b50) break;
        const nameLen = st.readUInt16LE(pos + 28);
        const extraLen = st.readUInt16LE(pos + 30);
        const commentLen = st.readUInt16LE(pos + 32);
        const name = st.subarray(pos + 46, pos + 46 + nameLen).toString("utf8");
        if (name && !name.endsWith("/")) entries.push(name.replace(/\\/g, "/"));
        pos += 46 + nameLen + extraLen + commentLen;
      }
      return { ok: true, entries };
    } finally {
      closeSync(fd);
    }
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
 * - Reject `..`, absolute, drive letters
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
    if (e.includes("..") || e.startsWith("/") || /^[A-Za-z]:/.test(e)) {
      return {
        ok: false,
        action: actionable(
          "DATA_ZIP_LAYOUT_INVALID",
          `不安全路径: ${e}`,
          ["Release zip 不得含 .. 或绝对路径"],
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
  mkdirSync(destDir, { recursive: true });
  try {
    // Windows 10+ and Unix tar can extract zip
    execFileSync("tar", ["-xf", zipPath, "-C", destDir], {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    return { ok: true };
  } catch (err) {
    const msg = (err as Error & { stderr?: Buffer }).stderr?.toString?.() || (err as Error).message;
    return {
      ok: false,
      action: actionable(
        "DATA_EXTRACT_FAILED",
        `解压失败: ${msg}`,
        ["确认系统 tar 可用", "检查 zip 完整性"],
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
    try {
      const { readdirSync, statSync } = require("fs") as typeof import("fs");
      const kids = readdirSync(stagingDir).filter((n) => n !== "." && n !== "..");
      if (kids.length === 1 && kids[0] === "data" && statSync(dataSub).isDirectory()) {
        return dataSub;
      }
    } catch {
      /* fallthrough */
    }
  }
  return stagingDir;
}
