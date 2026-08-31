/**
 * Conservative pack_format defaults for resource packs.
 * Always surface packFormatNeedsReview — Agent must confirm with the user.
 */

import { ownGet } from "../utils/own-record.js";

const PACK_FORMAT_BY_MC: Record<string, number> = {
  // ── <1.19.4：Minecraft Wiki「Pack format」表（资源包 pack_format）───────────
  "1.6.4": 1, // 1.6.1–1.8.9 = 1
  "1.7.2": 1,
  "1.7.10": 1,
  "1.8": 1,
  "1.8.9": 1,
  "1.9": 2, // 1.9–1.10.2 = 2
  "1.9.4": 2,
  "1.10": 2,
  "1.10.2": 2,
  "1.11": 3, // 1.11–1.12.2 = 3
  "1.11.2": 3,
  "1.12": 3,
  "1.12.2": 3,
  "1.13": 4, // 1.13–1.14.4 = 4
  "1.13.2": 4,
  "1.14": 4,
  "1.14.4": 4,
  "1.15": 5, // 1.15–1.16.1 = 5
  "1.15.2": 5,
  "1.16": 5,
  "1.16.1": 5,
  "1.16.2": 6, // 1.16.2–1.16.5 = 6
  "1.16.3": 6,
  "1.16.4": 6,
  "1.16.5": 6,
  "1.17": 7, // 1.17–1.17.1 = 7
  "1.17.1": 7,
  "1.18": 8, // 1.18–1.18.2 = 8
  "1.18.1": 8,
  "1.18.2": 8,
  "1.19": 9, // 1.19–1.19.2 = 9
  "1.19.1": 9,
  "1.19.2": 9,
  "1.19.3": 12, // 10/11 仅存在于快照，正式版从 9 跳到 12
  "1.19.4": 13,
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
// 2026-08-29 补齐 <1.19.4 全段（原表从 1.19.4 起，导致 1.12.2 等老版本误回退到 15）。
// 注意：pack_format 10/11/14/16/17 仅存在于快照，正式版不存在这些值，勿补。
// 1.21.9+ 官方 pack_format 是「主版本+次版本」对（如 [69, 0]）——本表用整数主版本，整数写法仍合法；
// 注意写成浮点 69.0 会被判 "Broken or incompatible"，数组写法 `[69, 0]` 亦可。

export function resolvePackFormat(mcVersion?: string): {
  packFormat: number | null;
  mcVersionUsed: string | null;
  packFormatNeedsReview: true;
  unknownVersion?: boolean;
  notes: string[];
} {
  const notes: string[] = ["请按目标游戏版本核对 pack_format（packFormatNeedsReview=true）。"];
  if (!mcVersion?.trim()) {
    notes.push("未提供 mcVersion，不猜测 pack_format。请传入 mcVersion 或自行填写 pack_format。");
    return {
      packFormat: null,
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
  notes.push(`未知 mcVersion=${v}，不猜测 pack_format（禁止一律回退 15）`);
  return {
    packFormat: null,
    mcVersionUsed: v,
    packFormatNeedsReview: true,
    unknownVersion: true,
    notes,
  };
}
