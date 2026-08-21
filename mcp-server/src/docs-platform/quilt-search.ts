/**
 * Quilt search_docs：有独立树用 quilt-docs；否则分类回退 Fabric。
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createFabricDocStore, FabricDocStore } from "./fabric/store.js";
import { hasPlatformDocData, platformDataMissingPayload } from "./platform-data.js";
import { resolveDataDir } from "../utils/path.js";
import { semanticSearch } from "./semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings, withDocsFallbackFields, type SearchResultLike } from "./search-utils.js";
import { missingSemanticDbWarning, semanticStaleSearchWarning } from "./semantic/status.js";
import { filterFabricFallbackHits, isFabricExclusiveHit, isQslSpecificQuery } from "./quilt-fallback-filter.js";

export const QUILT_EXCLUSIVE_WARNING =
  "QSL 禁止使用该 Fabric Registry/ItemGroup 页。请查阅 QSL / QuiltRegistry，不要用 net.fabricmc.fabric.api.event.registry / FabricItemGroup。";

const QUILT_FABRIC_FALLBACK_WARNING =
  "Quilt 无此页，已回退 Fabric 全文。QSL 专用 API 不要用 Fabric Registry 页。";

const QUILT_VERSION_FABRIC_FALLBACK_WARNING =
  "Quilt 官方文档无此版本，已回退到同版本 Fabric 文档，但 QSL API 请务必以 Quilt 官方为准。";

const QUILT_CURRENT_SITE_WARNING =
  "Quilt wiki / quilt.mod.json RFC 是未版本化现行页，不是该 MC 版本的历史快照。QSL README 才按 QuiltMC/quilt-standard-libraries/<maj.min> 抓取。";

type DocHit = { id?: string; label?: string; url?: string; tags?: string[] };

/** 只认本档 quilt-docs L0，禁止用「任意 quilt_* 存在」代替。 */
export function hasQuiltDocsIndex(version: string, dataRoot = resolveDataDir()): boolean {
  const ver = String(version ?? "").trim();
  if (!ver || /[\\/]/.test(ver) || ver.includes("..")) return false;
  return existsSync(join(dataRoot, `quilt_${ver}`, "quilt-docs", ver, "index-l0.json"));
}

const QUILT_INDEX_FALLBACK: Record<string, string> = { "1.21.11": "1.21.1" };

function quiltIndexHasPages(version: string, dataRoot = resolveDataDir()): boolean {
  const ver = String(version ?? "").trim();
  if (!ver || /[\\/]/.test(ver) || ver.includes("..")) return false;
  const p = join(dataRoot, `quilt_${ver}`, "quilt-docs", ver, "index-l0.json");
  if (!existsSync(p)) return false;
  try {
    const arr = JSON.parse(readFileSync(p, "utf8"));
    return Array.isArray(arr) && arr.length > 0;
  } catch {
    return false;
  }
}

function jsonOk(payload: unknown): CallToolResult {
  const rec = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : { value: payload };
  return { content: [{ type: "text", text: JSON.stringify(withDocsFallbackFields(rec), null, 2) }] };
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
    sourcePlatform: "fabric",
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

  if (!quiltIndexHasPages(args.version, dataRoot)) {
    const fb = QUILT_INDEX_FALLBACK[args.version];
    if (fb && fb !== args.version && quiltIndexHasPages(fb, dataRoot)) {
      const inner = await searchQuiltDocs({ ...args, version: fb });
      const text = inner.content?.[0] && inner.content[0].type === "text" ? inner.content[0].text : "{}";
      const rec = JSON.parse(text) as Record<string, unknown>;
      rec.version = args.version;
      rec.requestedVersion = args.version;
      rec.resolvedVersion = fb;
      rec.fallback = "quilt";
      rec.source_version = fb;
      rec.warning = joinSearchWarnings(
        typeof rec.warning === "string" ? rec.warning : undefined,
        `Quilt ${args.version} 无可用 quilt-docs 页，已改口 ${fb}（fallback=quilt, source_version=${fb}）。禁止把 Fabric Registry 当 QSL。`,
      );
      return jsonOk(rec);
    }
    if (!quiltIndexHasPages(args.version, dataRoot) && !hasQuiltDocsIndex(args.version, dataRoot) && fb) {
      return jsonOk({
        ok: false,
        query: args.query,
        version: args.version,
        platform: "quilt",
        fallback: "quilt",
        source_version: fb,
        error: {
          code: "VERSION_NOT_FOUND",
          message: `Quilt 无 ${args.version} 文档树。请改用 version=${fb}（勿把 Fabric Registry 当 QSL）。`,
          hint: `activate_platform_pack / search_docs platform=quilt version=${fb}`,
        },
      });
    }
  }

  if (hasQuiltDocsIndex(args.version, dataRoot)) {
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
          QUILT_CURRENT_SITE_WARNING,
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
    const versionMissingQuilt = hasPlatformDocData("quilt", dataRoot);
    return jsonOk({
      ok: true,
      query: args.query,
      version: args.version,
      resolvedVersion: fabricDetailed.resolvedVersion,
      versionFallback: false,
      platform: "quilt",
      fallback: "fabric",
      sourcePlatform: "fabric",
      warning: joinSearchWarnings(
        versionMissingQuilt
          ? QUILT_VERSION_FABRIC_FALLBACK_WARNING
          : "无独立 Quilt 文档树，已回退 Fabric（已过滤 FAPI 专属 Registry/ItemGroup 等）。QSL 专用页可能缺失。取全文可继续 platform=quilt（会自动回退 Fabric）或改 platform=fabric。",
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
  if (hasQuiltDocsIndex(args.version, dataRoot)) {
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
  try {
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
      sourcePlatform: "fabric",
      warning: QUILT_FABRIC_FALLBACK_WARNING,
    });
  } catch (e) {
    if (isVersionNotFoundLike(e) || isDocNotFoundLike(e)) {
      return jsonOk({
        ok: false,
        error: {
          code: "DOC_NOT_FOUND",
          message: `Quilt 无此页，且 fabric-docs@${args.version} 无对应摘要（旧档污染树已清空）。禁止用邻版 Fabric 正文顶上。`,
        },
        fallback: "fabric",
        warning: QUILT_FABRIC_FALLBACK_WARNING,
      });
    }
    throw e;
  }
}

export async function getQuiltDocFull(args: {
  id: string;
  version: string;
  highlight_key?: boolean;
}): Promise<CallToolResult> {
  const dataRoot = resolveDataDir();
  const highlight = args.highlight_key ?? true;
  if (hasQuiltDocsIndex(args.version, dataRoot)) {
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
  try {
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
      sourcePlatform: "fabric",
      warning: QUILT_FABRIC_FALLBACK_WARNING,
    });
  } catch (e) {
    if (isVersionNotFoundLike(e) || isDocNotFoundLike(e)) {
      return jsonOk({
        ok: false,
        error: {
          code: "DOC_NOT_FOUND",
          message: `Quilt 无此页，且 fabric-docs@${args.version} 无对应全文（旧档污染树已清空）。禁止用邻版 Fabric 正文顶上。`,
        },
        fallback: "fabric",
        warning: QUILT_FABRIC_FALLBACK_WARNING,
      });
    }
    throw e;
  }
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
  if (hasQuiltDocsIndex(args.version, dataRoot)) {
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
  try {
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
  } catch (e) {
    if (isVersionNotFoundLike(e) || isDocNotFoundLike(e)) {
      const code = isVersionNotFoundLike(e) ? "VERSION_NOT_FOUND" : "DOC_NOT_FOUND";
      const rec = e as { message?: string };
      return jsonOk({
        ok: false,
        platform: "quilt",
        id: args.id,
        version: args.version,
        error: {
          code,
          message: rec.message ?? `${code}: ${args.id}`,
        },
      });
    }
    throw e;
  }
}
