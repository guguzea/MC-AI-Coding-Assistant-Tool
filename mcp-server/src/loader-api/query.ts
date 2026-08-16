import { actionable } from "../utils/actionable.js";
import {
  isNoJavaIngest,
  notIndexedAction,
  platformSkippedAction,
  skippedIngestMeta,
  docsToolForPlatform,
  readSkippedCatalog,
} from "./keys.js";
import {
  classSimpleName,
  findSummary,
  listIndexed,
  normalizeClass,
  overlaySummariesDir,
} from "./store.js";
import type { LoaderClassRecord } from "./types.js";

export type QueryLoaderApiArgs = {
  platform: string;
  minecraftVersion: string;
  className: string;
};

export type SearchLoaderApiArgs = {
  platform?: string;
  minecraftVersion?: string;
  query?: string;
  mode?: "search" | "list";
  limit?: number;
  offset?: number;
};

function missingPlatformVersion() {
  return {
    found: false,
    action: actionable("INVALID_INPUT", "platform 与 minecraftVersion 必填，无默认 Forge 1.20.1。", [
      "同时传入 platform 与 minecraftVersion",
    ]),
  };
}

function missingIndexPayload(platform: string, minecraftVersion: string) {
  const ingest = skippedIngestMeta(platform, minecraftVersion);
  if (ingest) {
    return {
      found: false,
      code: "PLATFORM_SKIPPED" as const,
      platform,
      minecraftVersion,
      key: ingest.key,
      howToIngest: platformSkippedAction(platform, minecraftVersion, ingest.reason, true),
      action: platformSkippedAction(platform, minecraftVersion, ingest.reason, true),
    };
  }
  if (isNoJavaIngest(platform, minecraftVersion)) {
    const reason =
      platform.toLowerCase() === "bedrock"
        ? "Bedrock 不是 Java loader jar，请用 search_bedrock_docs"
        : "Forge 1.7.10–1.11.2 只提供 javadoc / search_docs，不走 sources ingest";
    return {
      found: false,
      code: "PLATFORM_SKIPPED" as const,
      platform,
      minecraftVersion,
      action: platformSkippedAction(platform, minecraftVersion, reason, false),
    };
  }
  return {
    found: false,
    code: "LOADER_API_NOT_INDEXED" as const,
    platform,
    minecraftVersion,
    notes: [
      "found:false 表示本 loader-api 摘要没有该档/该类，不代表游戏里不存在。",
      `改用 ${docsToolForPlatform(platform)}，禁止用邻版摘要冒充。`,
    ],
    action: notIndexedAction(platform, minecraftVersion),
  };
}

function matchClasses(classes: LoaderClassRecord[], className: string): LoaderClassRecord[] {
  const q = className.trim();
  const exact = classes.filter((c) => c.fqcn === q);
  if (exact.length) return exact;
  if (q.includes(".") || q.includes("$")) {
    return classes.filter((c) => c.fqcn === q || c.fqcn.endsWith(`.${q}`) || c.fqcn.endsWith(`$${q.split("$").pop()}`));
  }
  return classes.filter((c) => c.simpleName === q || classSimpleName(c.fqcn) === q);
}

export function queryLoaderApi(args: QueryLoaderApiArgs) {
  const platform = String(args.platform ?? "").trim();
  const minecraftVersion = String(args.minecraftVersion ?? "").trim();
  const className = String(args.className ?? "").trim();
  if (!platform || !minecraftVersion) return missingPlatformVersion();
  if (!className) {
    return {
      found: false,
      action: actionable("INVALID_INPUT", "className 必填（FQCN 或 simpleName）。", ["传入类名"]),
    };
  }
  const hit = findSummary(platform, minecraftVersion);
  if (!hit) return missingIndexPayload(platform, minecraftVersion);

  const classes = (hit.summary.classes ?? []).map(normalizeClass);
  const matches = matchClasses(classes, className);
  if (matches.length > 1 && !className.includes(".") && !className.includes("$")) {
    return {
      found: false,
      code: "AMBIGUOUS" as const,
      platform,
      minecraftVersion,
      key: hit.key,
      candidates: matches.map((c) => c.fqcn),
      notes: ["simpleName 命中多条，请改用含 $ 的 FQCN。"],
      action: actionable("AMBIGUOUS", `simpleName ${className} 命中 ${matches.length} 个类型。`, [
        `改用 FQCN（嵌套类用 $，例如 ${matches[0]?.fqcn}）`,
      ]),
    };
  }
  if (matches.length === 0) {
    return {
      found: false,
      platform,
      minecraftVersion,
      key: hit.key,
      mappingsVersion: hit.summary.mappingsVersion,
      source: hit.overlay ? "user_jar" : hit.summary.source ?? "official",
      notes: [
        "found:false 表示本 loader-api 摘要没有该类，不代表游戏里不存在。",
        `可 search_loader_api 或改用 ${docsToolForPlatform(platform)}。`,
      ],
    };
  }
  const rec = matches[0];
  return {
    found: true,
    platform,
    minecraftVersion,
    key: hit.key,
    mappingsVersion: hit.summary.mappingsVersion,
    mappingsSource: hit.summary.mappingsSource,
    source: hit.overlay ? "user_jar" : hit.summary.source ?? "official",
    overlay: hit.overlay,
    skippedExpansion: hit.summary.skippedExpansion === true,
    apiStatusInternal: rec.apiStatusInternal,
    environment: rec.environment,
    fqcn: rec.fqcn,
    simpleName: rec.simpleName,
    modifiers: rec.modifiers ?? [],
    methods: rec.methods,
    parseError: rec.parseError,
    file: rec.file,
  };
}

export function searchLoaderApi(args: SearchLoaderApiArgs) {
  const mode = args.mode === "list" ? "list" : "search";
  if (mode === "list") {
    const platform = String(args.platform ?? "").trim();
    const minecraftVersion = String(args.minecraftVersion ?? "").trim();
    let indexed = listIndexed();
    if (platform && minecraftVersion) {
      const hit = findSummary(platform, minecraftVersion);
      indexed = hit
        ? indexed.filter((x) => x.key === hit.key)
        : [];
    }
    const catalog = readSkippedCatalog();
    const overlayKeys = indexed.filter((x) => x.overlay).map((x) => x.key);
    return {
      mode: "list" as const,
      overlayDir: overlaySummariesDir(),
      overlayKeys,
      indexed,
      skipped: catalog.keys,
      noIngest: catalog.noIngest,
    };
  }

  const platform = String(args.platform ?? "").trim();
  const minecraftVersion = String(args.minecraftVersion ?? "").trim();
  if (!platform || !minecraftVersion) return missingPlatformVersion();
  const q = String(args.query ?? "").trim().toLowerCase();
  if (!q) {
    return {
      found: false,
      action: actionable("INVALID_INPUT", "search 模式需要 query 子串。", ["传入 query，或改用 mode=list"]),
    };
  }
  const hit = findSummary(platform, minecraftVersion);
  if (!hit) return missingIndexPayload(platform, minecraftVersion);

  const limit = Math.min(Math.max(Number(args.limit ?? 20) || 20, 1), 50);
  const offset = Math.max(Number(args.offset ?? 0) || 0, 0);
  const index = [
    ...(hit.summary.fqcnIndex ?? []),
    ...(hit.summary.classes ?? []).map((c) => c.fqcn),
  ];
  const uniq = [...new Set(index.filter(Boolean))];
  const matched = uniq.filter((fq) => fq.toLowerCase().includes(q));
  const slice = matched.slice(offset, offset + limit);
  return {
    found: matched.length > 0,
    platform,
    minecraftVersion,
    key: hit.key,
    mappingsVersion: hit.summary.mappingsVersion,
    source: hit.overlay ? "user_jar" : hit.summary.source ?? "official",
    overlay: hit.overlay,
    query: args.query,
    total: matched.length,
    limit,
    offset,
    hits: slice,
    notes: matched.length === 0 ? ["未命中 fqcnIndex；found:false 不代表游戏里没有该类。"] : undefined,
  };
}
