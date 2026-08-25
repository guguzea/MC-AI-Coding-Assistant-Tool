/**
 * Conservative pack_format defaults for resource packs.
 * Always surface packFormatNeedsReview — Agent must confirm with the user.
 */

import { ownGet } from "../utils/own-record.js";

const PACK_FORMAT_BY_MC: Record<string, number> = {
  "1.20.1": 15,
  "1.20.2": 18,
  "1.20.3": 22,
  "1.20.4": 22,
  "1.20.5": 32,
  "1.20.6": 32,
  "1.21": 34,
  "1.21.0": 34,
  "1.21.1": 34,
  "1.21.2": 42,
  "1.21.3": 42,
  "1.21.4": 46,
  "1.21.5": 55,
  "1.21.6": 63,
  "1.21.7": 64,
  "1.21.8": 64,
  "1.21.9": 69,
  "1.21.10": 69,
  "1.21.11": 75,
  "26.1": 84,
  "26.1.1": 84,
  "26.1.2": 84,
};

// C57 核实记录（2026-08-25 网络核对）：1.21.9/1.21.10=69、1.21.11=75、26.1–26.1.2=84
// 均与 Minecraft Wiki Pack format 表一致（另见 PrismLauncher issue #4237 与 CurseForge VRF 交叉佐证）。
// 1.21.9+ 官方 pack_format 是「主版本+次版本」对（如 [69, 0]）——本表用整数主版本，整数写法仍合法；
// 注意写成浮点 69.0 会被判 "Broken or incompatible"，数组写法 `[69, 0]` 亦可。

const DEFAULT_PACK_FORMAT = 15;

export function resolvePackFormat(mcVersion?: string): {
  packFormat: number;
  mcVersionUsed: string | null;
  packFormatNeedsReview: true;
  notes: string[];
} {
  const notes: string[] = ["请按目标游戏版本核对 pack_format（packFormatNeedsReview=true）。"];
  if (!mcVersion?.trim()) {
    notes.push(`未提供 mcVersion，使用保守默认 pack_format=${DEFAULT_PACK_FORMAT}。`);
    return {
      packFormat: DEFAULT_PACK_FORMAT,
      mcVersionUsed: null,
      packFormatNeedsReview: true,
      notes,
    };
  }
  const v = mcVersion.trim();
  const mapped = ownGet(PACK_FORMAT_BY_MC, v);
  if (mapped != null) {
    if (/^(1\.21\.(9|10|11)|26\.1(\.\d+)?)$/.test(v)) {
      notes.push("1.21.9+ 官方还有 min_format/max_format；本次仍只填 pack_format。");
    }
    return {
      packFormat: mapped,
      mcVersionUsed: v,
      packFormatNeedsReview: true,
      notes,
    };
  }
  notes.push(`未知 mcVersion=${v}，使用保守默认 pack_format=${DEFAULT_PACK_FORMAT}。`);
  return {
    packFormat: DEFAULT_PACK_FORMAT,
    mcVersionUsed: v,
    packFormatNeedsReview: true,
    notes,
  };
}
