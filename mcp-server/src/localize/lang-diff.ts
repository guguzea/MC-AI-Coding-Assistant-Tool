import { placeholdersMatch } from "./placeholders.js";

export const KEY_RENAME_HINT =
  "extraInZh 中的键可能是旧键，missingInZh 中的键可能是重命名后的新键；请人工对比是否名称相似，决定删除旧翻译或迁移到新键。工具不会自动迁移。";

export type LangMap = Record<string, string>;

export interface DiffResult {
  missingInZh: string[];
  extraInZh: string[];
  identicalToEn: string[];
  placeholderMismatches: Array<{ key: string; source: string; zh: string }>;
  keyRenameHint: string;
}

export interface DraftResult {
  zhCn: LangMap;
  needsTranslation: string[];
  preservedFromExisting: string[];
}

export function diffLang(source: LangMap, zh: LangMap): DiffResult {
  const sourceKeys = Object.keys(source);
  const zhKeys = Object.keys(zh);
  const sourceSet = new Set(sourceKeys);
  const zhSet = new Set(zhKeys);

  const missingInZh = sourceKeys.filter((k) => !zhSet.has(k)).sort();
  const extraInZh = zhKeys.filter((k) => !sourceSet.has(k)).sort();
  const identicalToEn: string[] = [];
  const placeholderMismatches: DiffResult["placeholderMismatches"] = [];

  for (const k of sourceKeys) {
    if (!zhSet.has(k)) continue;
    const s = source[k];
    const z = zh[k];
    if (s === z) identicalToEn.push(k);
    if (!placeholdersMatch(s, z)) {
      placeholderMismatches.push({ key: k, source: s, zh: z });
    }
  }

  identicalToEn.sort();
  placeholderMismatches.sort((a, b) => a.key.localeCompare(b.key));

  return {
    missingInZh,
    extraInZh,
    identicalToEn,
    placeholderMismatches,
    keyRenameHint: KEY_RENAME_HINT,
  };
}

/** Keep existing Chinese; fill missing keys with source text placeholders. */
export function draftZh(source: LangMap, existingZh: LangMap): DraftResult {
  const zhCn: LangMap = { ...existingZh };
  const needsTranslation: string[] = [];
  const preservedFromExisting: string[] = [];

  for (const [k, v] of Object.entries(existingZh)) {
    if (Object.prototype.hasOwnProperty.call(source, k) && String(v ?? "").length > 0) {
      preservedFromExisting.push(k);
    }
    // Keep extras too (do not delete); caller sees them via diff.extraInZh
    void v;
  }

  for (const [k, v] of Object.entries(source)) {
    if (
      Object.prototype.hasOwnProperty.call(existingZh, k) &&
      existingZh[k] != null &&
      String(existingZh[k]).length > 0
    ) {
      zhCn[k] = existingZh[k];
    } else {
      zhCn[k] = v;
      needsTranslation.push(k);
    }
  }

  needsTranslation.sort();
  preservedFromExisting.sort();
  return { zhCn, needsTranslation, preservedFromExisting };
}

export function parseLangInput(raw: unknown): { ok: true; value: LangMap; nonStringKeys?: string[] } | { ok: false; error: string } {
  if (raw == null) return { ok: true, value: {} };
  let obj: unknown = raw;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return { ok: true, value: {} };
    try {
      obj = JSON.parse(t);
    } catch (e) {
      return { ok: false, error: `JSON 解析失败: ${(e as Error).message}` };
    }
  }
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return { ok: false, error: "语言文件必须是 JSON 对象" };
  }
  const out: LangMap = {};
  const nonStringKeys: string[] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
    else nonStringKeys.push(k);
  }
  return { ok: true, value: out, nonStringKeys: nonStringKeys.length ? nonStringKeys : undefined };
}
