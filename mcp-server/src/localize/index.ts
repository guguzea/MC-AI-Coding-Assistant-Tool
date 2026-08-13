/**
 * localize_mod — diff / draft / extract / pack_draft for own & third-party mods.
 * No machine translation; marks needsTranslation for the Agent.
 */

import { actionable, withAction, type ActionEnvelope } from "../utils/actionable.js";
import { draftZh, diffLang, parseLangInput, KEY_RENAME_HINT, type LangMap } from "./lang-diff.js";
import {
  loadJarBuffer,
  scanJarLangFiles,
  readJarEntryText,
  pickSourceLocale,
  findZhCn,
  namespacesWithSource,
  namespacesChineseOnly,
  normalizeLocaleToken,
  type LangFileRef,
} from "./jar.js";
import { resolvePackFormat } from "./pack-format.js";

export type LocalizeMode = "own" | "third_party";
export type LocalizeAction = "diff" | "draft_zh" | "extract" | "pack_draft";

export interface LocalizeModArgs {
  mode: LocalizeMode;
  action: LocalizeAction;
  modId?: string;
  /** Source lang JSON (alias of enUsJson). Prefer when provided. */
  sourceJson?: unknown;
  enUsJson?: unknown;
  zhCnJson?: unknown;
  jarPath?: string;
  namespace?: string;
  sourceLocale?: string;
  existingZhJson?: unknown;
  mcVersion?: string;
}

function fail(code: string, message: string, nextSteps: string[], extra: Record<string, unknown> = {}) {
  const action = actionable(code, message, nextSteps, ["localize_mod", "generate_lang"]);
  return withAction({ ok: false, code, ...extra }, action);
}

function parseSourceJson(args: LocalizeModArgs):
  | { ok: true; value: LangMap }
  | { ok: false; error: string } {
  const raw = args.sourceJson !== undefined ? args.sourceJson : args.enUsJson;
  return parseLangInput(raw);
}

function softParseZh(raw: unknown): { value: LangMap; warning?: string } {
  const parsed = parseLangInput(raw);
  if (!parsed.ok) {
    return { value: {}, warning: "ZH_PARSE_FAILED_TREATED_AS_EMPTY" };
  }
  return { value: parsed.value };
}

function resolveNamespace(
  availableWithSource: string[],
  chineseOnly: string[],
  requested?: string,
):
  | { ok: true; namespace: string; note?: string }
  | { ok: false; result: Record<string, unknown> } {
  const allKnown = [...new Set([...availableWithSource, ...chineseOnly])].sort();

  if (requested) {
    if (availableWithSource.includes(requested) || chineseOnly.includes(requested)) {
      return { ok: true, namespace: requested };
    }
    return {
      ok: false,
      result: fail("NAMESPACE_NOT_FOUND", `命名空间不存在: ${requested}`, [
        "从 availableNamespaces 中选择",
        "或检查 jar 内 assets/<ns>/lang/",
      ], {
        availableNamespaces: availableWithSource,
        chineseOnlyNamespaces: chineseOnly,
        allNamespaces: allKnown,
      }),
    };
  }

  if (availableWithSource.length === 1) {
    return {
      ok: true,
      namespace: availableWithSource[0],
      note: `已自动选用命名空间 ${availableWithSource[0]}`,
    };
  }
  if (availableWithSource.length === 0) {
    if (chineseOnly.length === 1) {
      return { ok: true, namespace: chineseOnly[0], note: `仅有中文语言文件的命名空间 ${chineseOnly[0]}` };
    }
    if (chineseOnly.length > 1) {
      return {
        ok: false,
        result: fail("NAMESPACE_AMBIGUOUS", "多个仅含中文的命名空间，请显式指定 namespace", [
          "传入 namespace",
        ], {
          availableNamespaces: [],
          chineseOnlyNamespaces: chineseOnly,
        }),
      };
    }
    return {
      ok: false,
      result: fail("LANG_NOT_IN_JAR", "jar 内无可作源的语言 JSON（assets/*/lang/*.json）", [
        "确认模组含 lang 资源",
        "纯库/结构包可能无 lang",
      ], {
        availableNamespaces: [],
        chineseOnlyNamespaces: [],
      }),
    };
  }
  return {
    ok: false,
    result: fail("NAMESPACE_AMBIGUOUS", "多个命名空间含可作源的语言文件，请显式指定 namespace", [
      "传入 namespace（见 availableNamespaces）",
    ], {
      availableNamespaces: availableWithSource,
      chineseOnlyNamespaces: chineseOnly,
    }),
  };
}

function parseLangText(text: string, hardFailCode: string):
  | { ok: true; value: LangMap }
  | { ok: false; result: Record<string, unknown> } {
  try {
    const parsed = parseLangInput(text);
    if (!parsed.ok) {
      return {
        ok: false,
        result: fail(hardFailCode, parsed.error, ["修复语言 JSON 后再试"]),
      };
    }
    return { ok: true, value: parsed.value };
  } catch (e) {
    return {
      ok: false,
      result: fail(hardFailCode, (e as Error).message, ["修复语言 JSON 后再试"]),
    };
  }
}

function loadNamespaceSource(
  buf: Buffer,
  files: LangFileRef[],
  sourceLocale?: string,
):
  | {
      ok: true;
      source: LangMap;
      sourceLocaleUsed: string;
      sourceLocaleFallback: boolean;
      availableLocales: string[];
      zhExisting: LangMap;
      zhWarning?: string;
      chineseReadyOnly: false;
    }
  | {
      ok: true;
      source: LangMap;
      sourceLocaleUsed: null;
      sourceLocaleFallback: false;
      availableLocales: string[];
      zhExisting: LangMap;
      zhWarning?: string;
      chineseReadyOnly: true;
      code: "Chinese_ready_in";
    }
  | { ok: false; result: Record<string, unknown> } {
  const availableLocales = files.map((f) => f.locale).sort();
  const picked = pickSourceLocale(files, sourceLocale);

  if (!picked) {
    if (sourceLocale) {
      return {
        ok: false,
        result: fail(
          "LANG_NOT_IN_JAR",
          `指定 sourceLocale=${normalizeLocaleToken(sourceLocale)} 不存在或不可用（不能用 zh_* 作源）`,
          ["从 availableLocales 选择非中文 locale", "或不传 sourceLocale 走回退链"],
          { availableLocales },
        ),
      };
    }
    // Chinese only
    const zhRef = findZhCn(files);
    let zhExisting: LangMap = {};
    let zhWarning: string | undefined;
    if (zhRef) {
      try {
        const text = readJarEntryText(buf, zhRef.entryPath);
        const soft = softParseZh(text);
        zhExisting = soft.value;
        zhWarning = soft.warning;
      } catch (e) {
        zhWarning = `ZH_READ_FAILED: ${(e as Error).message}`;
      }
    }
    return {
      ok: true,
      chineseReadyOnly: true,
      code: "Chinese_ready_in",
      source: {},
      sourceLocaleUsed: null,
      sourceLocaleFallback: false,
      availableLocales,
      zhExisting,
      zhWarning,
    };
  }

  let sourceText: string;
  try {
    sourceText = readJarEntryText(buf, picked.entryPath);
  } catch (e) {
    return {
      ok: false,
      result: fail("JAR_UNREADABLE", `读取源语言失败: ${(e as Error).message}`, ["确认 jar 完整"], {
        availableLocales,
      }),
    };
  }

  const sourceParsed = parseLangText(sourceText, "LANG_PARSE_ERROR");
  if (!sourceParsed.ok) {
    return {
      ok: false,
      result: {
        ...sourceParsed.result,
        availableLocales,
        sourceLocaleUsed: picked.locale,
      },
    };
  }

  let zhExisting: LangMap = {};
  let zhWarning: string | undefined;
  const zhRef = findZhCn(files);
  if (zhRef) {
    try {
      const zhText = readJarEntryText(buf, zhRef.entryPath);
      const soft = softParseZh(zhText);
      zhExisting = soft.value;
      zhWarning = soft.warning;
    } catch (e) {
      zhWarning = `ZH_READ_FAILED: ${(e as Error).message}`;
      zhExisting = {};
    }
  }

  return {
    ok: true,
    chineseReadyOnly: false,
    source: sourceParsed.value,
    sourceLocaleUsed: picked.locale,
    sourceLocaleFallback: picked.fallback,
    availableLocales,
    zhExisting,
    zhWarning,
  };
}

function handleOwn(args: LocalizeModArgs): Record<string, unknown> {
  if (args.action !== "diff" && args.action !== "draft_zh") {
    return fail("INVALID_INPUT", `mode=own 仅支持 action=diff|draft_zh，收到 ${args.action}`, [
      "改用 diff / draft_zh，或 mode=third_party",
    ]);
  }

  if (args.sourceJson === undefined && args.enUsJson === undefined) {
    return fail("INVALID_INPUT", "缺少 sourceJson 或 enUsJson", [
      "传入 sourceJson 或 enUsJson（空对象 {} 表示无词条）",
    ]);
  }

  const sourceParsed = parseSourceJson(args);
  if (!sourceParsed.ok) {
    return fail("LANG_PARSE_ERROR", `源语言 JSON: ${sourceParsed.error}`, ["修复 enUsJson/sourceJson"]);
  }

  const notes: string[] = [];
  if (args.modId) notes.push(`modId=${args.modId}（请确认键前缀与代码一致）`);

  if (args.action === "diff") {
    const zhParsed = parseLangInput(args.zhCnJson);
    if (!zhParsed.ok) {
      // zh bad → treat as empty with warning for draft; for diff also soft?
      // Plan: zh_cn JSON 损坏 → 视作无已有翻译 + warning
      const emptyDiff = diffLang(sourceParsed.value, {});
      return {
        ok: true,
        mode: "own",
        action: "diff",
        ...emptyDiff,
        warnings: ["ZH_PARSE_FAILED_TREATED_AS_EMPTY"],
        notes,
        sourceLocaleUsed: "en_us",
        sourceLocaleFallback: false,
      };
    }
    const d = diffLang(sourceParsed.value, zhParsed.value);
    return {
      ok: true,
      mode: "own",
      action: "diff",
      ...d,
      notes,
      sourceLocaleUsed: "en_us",
      sourceLocaleFallback: false,
    };
  }

  // draft_zh
  const soft = softParseZh(args.zhCnJson ?? args.existingZhJson);
  const drafted = draftZh(sourceParsed.value, soft.value);
  const warnings = soft.warning ? [soft.warning] : [];
  return {
    ok: true,
    mode: "own",
    action: "draft_zh",
    needsTranslation: drafted.needsTranslation,
    preservedFromExisting: drafted.preservedFromExisting,
    keyRenameHint: KEY_RENAME_HINT,
    files: {
      "zh_cn.json": JSON.stringify(drafted.zhCn, null, 2) + "\n",
    },
    zhCn: drafted.zhCn,
    warnings: warnings.length ? warnings : undefined,
    notes,
    sourceLocaleUsed: "en_us",
    sourceLocaleFallback: false,
  };
}

function handleThirdParty(args: LocalizeModArgs): Record<string, unknown> {
  if (args.action !== "extract" && args.action !== "pack_draft") {
    return fail("INVALID_INPUT", `mode=third_party 仅支持 extract|pack_draft，收到 ${args.action}`, [
      "改用 extract / pack_draft，或 mode=own",
    ]);
  }

  const loaded = loadJarBuffer(args.jarPath ?? "");
  if (!loaded.ok) {
    return withAction({ ok: false, code: loaded.code, availableNamespaces: [] }, loaded.action);
  }

  const scanned = scanJarLangFiles(loaded.buf);
  if (!scanned.ok) {
    return withAction(
      { ok: false, code: scanned.code, availableNamespaces: scanned.availableNamespaces },
      scanned.action,
    );
  }

  const withSource = namespacesWithSource(scanned.byNamespace);
  const chineseOnly = namespacesChineseOnly(scanned.byNamespace);

  if (Object.keys(scanned.byNamespace).length === 0) {
    return fail("LANG_NOT_IN_JAR", "jar 内无 assets/*/lang/*.json", [
      "确认模组含语言文件",
      "纯库模组可能无可译文案",
    ], { availableNamespaces: [] });
  }

  const nsRes = resolveNamespace(withSource, chineseOnly, args.namespace);
  if (!nsRes.ok) return nsRes.result;

  const files = scanned.byNamespace[nsRes.namespace] ?? [];
  const loadedNs = loadNamespaceSource(loaded.buf, files, args.sourceLocale);
  if (!loadedNs.ok) {
    return {
      ...loadedNs.result,
      availableNamespaces: withSource,
      namespace: nsRes.namespace,
    };
  }

  const notes: string[] = [];
  if (nsRes.note) notes.push(nsRes.note);
  if (loadedNs.zhWarning) notes.push(loadedNs.zhWarning);
  const warnings: string[] = [];
  if (loadedNs.zhWarning === "ZH_PARSE_FAILED_TREATED_AS_EMPTY") {
    warnings.push(loadedNs.zhWarning);
  }

  // Merge external existingZhJson if provided
  let existingZh = loadedNs.zhExisting;
  if (args.existingZhJson !== undefined) {
    const soft = softParseZh(args.existingZhJson);
    existingZh = { ...existingZh, ...soft.value };
    if (soft.warning) warnings.push(soft.warning);
  }

  if (loadedNs.chineseReadyOnly) {
    notes.push(
      "Chinese_ready_in：jar 内该命名空间仅有中文语言文件，无法对照源语言检测缺键；是否完整由用户决定。",
    );
    const base = {
      ok: true,
      code: "Chinese_ready_in" as const,
      mode: "third_party" as const,
      namespace: nsRes.namespace,
      availableNamespaces: withSource,
      chineseOnlyNamespaces: chineseOnly,
      availableLocales: loadedNs.availableLocales,
      sourceLocaleUsed: null as null,
      sourceLocaleFallback: false,
      zhCn: existingZh,
      notes,
      warnings: warnings.length ? warnings : undefined,
    };

    if (args.action === "extract") {
      return {
        ...base,
        action: "extract",
        files: {
          "zh_cn.json": JSON.stringify(existingZh, null, 2) + "\n",
        },
      };
    }

    // pack_draft: copy existing zh only
    const pf = resolvePackFormat(args.mcVersion);
    notes.push(...pf.notes);
    notes.push("无法检测缺失键，请手动维护 zh_cn.json。");
    return {
      ...base,
      action: "pack_draft",
      packFormat: pf.packFormat,
      mcVersionUsed: pf.mcVersionUsed,
      packFormatNeedsReview: true as const,
      files: {
        "pack.mcmeta": JSON.stringify(
          {
            pack: {
              pack_format: pf.packFormat,
              description: `Chinese lang pack for ${nsRes.namespace} (existing zh only)`,
            },
          },
          null,
          2,
        ) + "\n",
        [`assets/${nsRes.namespace}/lang/zh_cn.json`]:
          JSON.stringify(existingZh, null, 2) + "\n",
      },
    };
  }

  if (loadedNs.sourceLocaleFallback) {
    notes.push(
      `源语言回退：使用 ${loadedNs.sourceLocaleUsed}（非 en_us），译文请对照语境；条目已列入 needsTranslation。`,
    );
  }

  if (args.action === "extract") {
    const d = diffLang(loadedNs.source, existingZh);
    return {
      ok: true,
      mode: "third_party",
      action: "extract",
      namespace: nsRes.namespace,
      availableNamespaces: withSource,
      chineseOnlyNamespaces: chineseOnly,
      availableLocales: loadedNs.availableLocales,
      sourceLocaleUsed: loadedNs.sourceLocaleUsed,
      sourceLocaleFallback: loadedNs.sourceLocaleFallback,
      source: loadedNs.source,
      zhCn: existingZh,
      ...d,
      files: {
        [`${loadedNs.sourceLocaleUsed}.json`]: JSON.stringify(loadedNs.source, null, 2) + "\n",
        ...(Object.keys(existingZh).length
          ? { "zh_cn.json": JSON.stringify(existingZh, null, 2) + "\n" }
          : {}),
      },
      notes,
      warnings: warnings.length ? warnings : undefined,
    };
  }

  // pack_draft
  const drafted = draftZh(loadedNs.source, existingZh);
  const pf = resolvePackFormat(args.mcVersion);
  notes.push(...pf.notes);

  return {
    ok: true,
    mode: "third_party",
    action: "pack_draft",
    namespace: nsRes.namespace,
    availableNamespaces: withSource,
    chineseOnlyNamespaces: chineseOnly,
    availableLocales: loadedNs.availableLocales,
    sourceLocaleUsed: loadedNs.sourceLocaleUsed,
    sourceLocaleFallback: loadedNs.sourceLocaleFallback,
    packFormat: pf.packFormat,
    mcVersionUsed: pf.mcVersionUsed,
    packFormatNeedsReview: true as const,
    needsTranslation: drafted.needsTranslation,
    preservedFromExisting: drafted.preservedFromExisting,
    keyRenameHint: KEY_RENAME_HINT,
    zhCn: drafted.zhCn,
    files: {
      "pack.mcmeta":
        JSON.stringify(
          {
            pack: {
              pack_format: pf.packFormat,
              description: `Chinese lang draft for ${nsRes.namespace}`,
            },
          },
          null,
          2,
        ) + "\n",
      [`assets/${nsRes.namespace}/lang/zh_cn.json`]:
        JSON.stringify(drafted.zhCn, null, 2) + "\n",
    },
    notes,
    warnings: warnings.length ? warnings : undefined,
  };
}

export function localizeMod(args: LocalizeModArgs): Record<string, unknown> {
  if (!args?.mode || !args?.action) {
    return fail("INVALID_INPUT", "需要 mode 与 action", [
      "mode=own|third_party",
      "action=diff|draft_zh|extract|pack_draft",
    ]);
  }
  if (args.mode === "own") return handleOwn(args);
  if (args.mode === "third_party") return handleThirdParty(args);
  return fail("INVALID_INPUT", `未知 mode: ${String((args as LocalizeModArgs).mode)}`, [
    "使用 own 或 third_party",
  ]);
}

export { KEY_RENAME_HINT, diffLang, draftZh, resolvePackFormat };
export type { ActionEnvelope };
