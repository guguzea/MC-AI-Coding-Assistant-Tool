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
import { filterFabricFallbackHits, isQslSpecificQuery } from "./quilt-fallback-filter.js";

export async function searchQuiltDocs(args: {
  query: string;
  version: string;
  tags?: string[];
}): Promise<CallToolResult> {
  const dataRoot = resolveDataDir();
  const qsl = isQslSpecificQuery(args.query);

  if (hasPlatformDocData("quilt", dataRoot)) {
    const store = new FabricDocStore(dataRoot, args.version, "quilt-docs", "quilt");
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
      versionFallback: detailedRes.versionFallback,
      platform: "quilt",
      fallback: null,
      warning: joinSearchWarnings(
        detailedRes.versionFallback
          ? `请求版本 ${args.version} 无独立 Quilt 文档，已降级到 ${detailedRes.resolvedVersion}`
          : undefined,
        missingSemanticDbWarning(semanticHits === null),
        semanticStaleSearchWarning(dataRoot, "quilt", detailedRes.resolvedVersion, "quilt-docs"),
      ),
      semantic: semanticHits !== null,
      total: results.length,
      results,
    });
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
    versionFallback: fabricDetailed.versionFallback,
    platform: "quilt",
    fallback: "fabric",
    warning: joinSearchWarnings(
      "无独立 Quilt 文档树，已回退 Fabric（已过滤 FAPI 专属 Registry/ItemGroup 等）。QSL 专用页可能缺失。",
      filtered.dropped > 0 ? `已丢弃 ${filtered.dropped} 条 Fabric 专属命中` : undefined,
      missingSemanticDbWarning(semanticHits === null),
      semanticStaleSearchWarning(resolveDataDir(), "fabric", fabricDetailed.resolvedVersion, "fabric-docs"),
    ),
    semantic: semanticHits !== null,
    total: filtered.hits.length,
    results: filtered.hits,
  });
}

function jsonOk(payload: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}
