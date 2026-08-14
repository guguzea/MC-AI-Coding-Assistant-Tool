/**
 * Quilt search_docs：有独立树用 quilt-docs；否则分类回退 Fabric。
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createFabricDocStore, FabricDocStore } from "./fabric/store.js";
import { hasPlatformDocData, platformDataMissingPayload } from "./platform-data.js";
import { resolveDataDir } from "../utils/path.js";
import { semanticSearch } from "./semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings, type SearchResultLike } from "./search-utils.js";
import { missingSemanticDbWarning, semanticStaleSearchWarning } from "./semantic/status.js";
import { filterFabricFallbackHits, isFabricExclusiveHit, isQslSpecificQuery } from "./quilt-fallback-filter.js";

export const QUILT_EXCLUSIVE_WARNING =
  "QSL 禁止使用该 Fabric Registry/ItemGroup 页。请查阅 QSL / QuiltRegistry，不要用 net.fabricmc.fabric.api.event.registry / FabricItemGroup。";

const QUILT_FABRIC_FALLBACK_WARNING =
  "Quilt 无此页，已回退 Fabric 全文。QSL 专用 API 不要用 Fabric Registry 页。";

type DocHit = { id?: string; label?: string; url?: string; tags?: string[] };

function jsonOk(payload: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

function isDocNotFoundLike(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const rec = e as { name?: string; id?: unknown; availableVersions?: unknown; code?: unknown };
  if (Array.isArray(rec.availableVersions)) return false;
  if (rec.code === "UNSUPPORTED_PLATFORM") return false;
  return rec.name === "DocNotFoundError" || typeof rec.id === "string";
}

function isVersionNotFoundLike(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const rec = e as { name?: string; availableVersions?: unknown };
  return rec.name === "VersionNotFoundError" || Array.isArray(rec.availableVersions);
}

function versionNotFoundPayload(
  e: unknown,
  args: { query: string; version: string },
): Record<string, unknown> {
  const rec = e as { message?: string; availableVersions?: string[] };
  const versions = rec.availableVersions ?? [];
  return {
    ok: false,
    query: args.query,
    version: args.version,
    platform: "quilt",
    fallback: null,
    availableVersions: versions,
    error: {
      code: "VERSION_NOT_FOUND",
      message: rec.message ?? `不支持的版本: ${args.version}`,
      hint:
        versions.length > 0
          ? `请使用支持的版本：${versions.join(", ")}`
          : "文档数据未加载。请先用 list_doc_versions 查询可用版本。",
    },
  };
}

export function exclusiveFabricFallbackRefusal(hit: DocHit): Record<string, unknown> | null {
  if (!isFabricExclusiveHit(hit)) return null;
  return {
    ok: false,
    platform: "quilt",
    fallback: "fabric",
    warning: QUILT_EXCLUSIVE_WARNING,
    error: {
      code: "FABRIC_EXCLUSIVE",
      message: QUILT_EXCLUSIVE_WARNING,
    },
  };
}

function exclusiveRefusalResult(hit: DocHit): CallToolResult | null {
  const payload = exclusiveFabricFallbackRefusal(hit);
  return payload ? jsonOk(payload) : null;
}

export async function searchQuiltDocs(args: {
  query: string;
  version: string;
  tags?: string[];
}): Promise<CallToolResult> {
  const dataRoot = resolveDataDir();
  const qsl = isQslSpecificQuery(args.query);

  if (hasPlatformDocData("quilt", dataRoot)) {
    const store = new FabricDocStore(dataRoot, args.version, "quilt-docs", "quilt");
    try {
      const detailedRes = store.searchIndexDetailed(args.query, args.version, args.tags);
      let results: SearchResultLike[] = detailedRes.results;
      const semanticHits = await semanticSearch(
        args.query,
        "quilt",
        detailedRes.resolvedVersion,
        "quilt-docs",
        dataRoot,
      );
      if (semanticHits) {
        results = mergeSemanticResults(results, semanticHits, {
          tags: args.tags,
          limit: 20,
          version: detailedRes.resolvedVersion,
        });
      }
      return jsonOk({
        ok: true,
        query: args.query,
        version: args.version,
        resolvedVersion: detailedRes.resolvedVersion,
        versionFallback: false,
        platform: "quilt",
        fallback: null,
        warning: joinSearchWarnings(
          missingSemanticDbWarning(semanticHits === null),
          semanticStaleSearchWarning(dataRoot, "quilt", detailedRes.resolvedVersion, "quilt-docs"),
        ),
        semantic: semanticHits !== null,
        total: results.length,
        results,
      });
    } catch (e) {
      if (isVersionNotFoundLike(e)) {
        return jsonOk(versionNotFoundPayload(e, args));
      }
      throw e;
    }
  }

  if (qsl) {
    return jsonOk({
      ...platformDataMissingPayload("quilt"),
      warning:
        "QSL 专用查询禁止回退 Fabric 文档（QuiltRegistry ≠ Fabric Registry）。请查阅 https://wiki.quiltmc.org/en/concepts/qsl-qfapi 与 QSL 源码/loader-api-summaries，不要使用 net.fabricmc.fabric.api.event.registry。",
    });
  }

  if (!hasPlatformDocData("fabric", dataRoot)) {
    return jsonOk({
      ...platformDataMissingPayload("quilt"),
      warning: "无 Quilt 文档树，且 Fabric 文档也不可用，无法回退。",
    });
  }

  try {
    const fabricDetailed = createFabricDocStore(args.version, "fabric-docs", dataRoot)
      .searchIndexDetailed(args.query, args.version, args.tags);
    let results: SearchResultLike[] = fabricDetailed.results;
    const semanticHits = await semanticSearch(
      args.query,
      "fabric",
      fabricDetailed.resolvedVersion,
      "fabric-docs",
      dataRoot,
    );
    if (semanticHits) {
      results = mergeSemanticResults(results, semanticHits, {
        tags: args.tags,
        limit: 20,
        version: fabricDetailed.resolvedVersion,
      });
    }
    const filtered = filterFabricFallbackHits(results);
    return jsonOk({
      ok: true,
      query: args.query,
      version: args.version,
      resolvedVersion: fabricDetailed.resolvedVersion,
      versionFallback: false,
      platform: "quilt",
      fallback: "fabric",
      warning: joinSearchWarnings(
        "无独立 Quilt 文档树，已回退 Fabric（已过滤 FAPI 专属 Registry/ItemGroup 等）。QSL 专用页可能缺失。取全文可继续 platform=quilt（会自动回退 Fabric）或改 platform=fabric。",
        filtered.dropped > 0 ? `已丢弃 ${filtered.dropped} 条 Fabric 专属命中` : undefined,
        missingSemanticDbWarning(semanticHits === null),
        semanticStaleSearchWarning(resolveDataDir(), "fabric", fabricDetailed.resolvedVersion, "fabric-docs"),
      ),
      semantic: semanticHits !== null,
      total: filtered.hits.length,
      results: filtered.hits.map((h) => ({ ...h, sourcePlatform: "fabric" as const })),
    });
  } catch (e) {
    if (isVersionNotFoundLike(e)) {
      return jsonOk(versionNotFoundPayload(e, args));
    }
    throw e;
  }
}

export async function getQuiltDocSummary(args: { id: string; version: string }): Promise<CallToolResult> {
  const dataRoot = resolveDataDir();
  if (hasPlatformDocData("quilt", dataRoot)) {
    try {
      const store = new FabricDocStore(dataRoot, args.version, "quilt-docs", "quilt");
      const result = store.loadSummary(args.id, args.version);
      return jsonOk({ ...result, platform: "quilt", fallback: null });
    } catch (e) {
      if (!isDocNotFoundLike(e)) throw e;
    }
  }
  const exclusiveId = exclusiveRefusalResult({ id: args.id, label: args.id });
  if (exclusiveId) return exclusiveId;
  if (!hasPlatformDocData("fabric", dataRoot)) {
    return jsonOk({
      ...platformDataMissingPayload("quilt"),
      warning: "无 Quilt 此页，且 Fabric 文档也不可用，无法回退。",
    });
  }
  const result = createFabricDocStore(args.version, "fabric-docs", dataRoot).loadSummary(args.id, args.version);
  const refused = exclusiveRefusalResult({
    id: result.id,
    label: result.label,
    url: result.url,
    tags: result.tags,
  });
  if (refused) return refused;
  return jsonOk({
    ...result,
    platform: "quilt",
    fallback: "fabric",
    warning: QUILT_FABRIC_FALLBACK_WARNING,
  });
}

export async function getQuiltDocFull(args: {
  id: string;
  version: string;
  highlight_key?: boolean;
}): Promise<CallToolResult> {
  const dataRoot = resolveDataDir();
  const highlight = args.highlight_key ?? true;
  if (hasPlatformDocData("quilt", dataRoot)) {
    try {
      const store = new FabricDocStore(dataRoot, args.version, "quilt-docs", "quilt");
      const result = await store.loadFullDoc(args.id, args.version, highlight);
      return jsonOk({ ...result, platform: "quilt", fallback: null });
    } catch (e) {
      if (!isDocNotFoundLike(e)) throw e;
    }
  }
  const exclusiveId = exclusiveRefusalResult({ id: args.id, label: args.id });
  if (exclusiveId) return exclusiveId;
  if (!hasPlatformDocData("fabric", dataRoot)) {
    return jsonOk({
      ...platformDataMissingPayload("quilt"),
      warning: "无 Quilt 此页，且 Fabric 文档也不可用，无法回退。",
    });
  }
  const result = await createFabricDocStore(args.version, "fabric-docs", dataRoot).loadFullDoc(
    args.id,
    args.version,
    highlight,
  );
  const refused = exclusiveRefusalResult({
    id: result.meta.id,
    label: result.meta.label,
    url: result.meta.url,
    tags: result.meta.tags,
  });
  if (refused) return refused;
  return jsonOk({
    ...result,
    platform: "quilt",
    fallback: "fabric",
    warning: QUILT_FABRIC_FALLBACK_WARNING,
  });
}

/** 与其它 platform 的 get_doc_related 一样：成功时 JSON 根是相关页数组。回退 Fabric 时条目带 sourcePlatform / warning。 */
function jsonRelatedList(
  hits: SearchResultLike[],
  extra?: { fallback: "fabric"; warning?: string },
): CallToolResult {
  if (!extra) return jsonOk(hits);
  return jsonOk(
    hits.map((h) => ({
      ...h,
      sourcePlatform: "fabric" as const,
      ...(extra.warning ? { warning: extra.warning } : {}),
    })),
  );
}

export function getQuiltDocRelated(args: {
  id: string;
  version: string;
  limit?: number;
}): CallToolResult {
  const dataRoot = resolveDataDir();
  const limit = args.limit ?? 5;
  if (hasPlatformDocData("quilt", dataRoot)) {
    try {
      const store = new FabricDocStore(dataRoot, args.version, "quilt-docs", "quilt");
      return jsonRelatedList(store.getRelatedDocs(args.id, args.version, limit));
    } catch (e) {
      if (!isDocNotFoundLike(e)) throw e;
    }
  }
  const exclusiveId = exclusiveRefusalResult({ id: args.id, label: args.id });
  if (exclusiveId) return exclusiveId;
  if (!hasPlatformDocData("fabric", dataRoot)) {
    return jsonOk({
      ...platformDataMissingPayload("quilt"),
      warning: "无 Quilt 此页，且 Fabric 文档也不可用，无法回退。",
    });
  }
  const related = createFabricDocStore(args.version, "fabric-docs", dataRoot).getRelatedDocs(
    args.id,
    args.version,
    limit,
  );
  const filtered = filterFabricFallbackHits(related);
  return jsonRelatedList(filtered.hits, {
    fallback: "fabric",
    warning: joinSearchWarnings(
      QUILT_FABRIC_FALLBACK_WARNING,
      filtered.dropped > 0 ? `已丢弃 ${filtered.dropped} 条 Fabric 专属相关页` : undefined,
    ),
  });
}
