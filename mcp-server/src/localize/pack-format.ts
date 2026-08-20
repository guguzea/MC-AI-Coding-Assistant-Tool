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
};

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
