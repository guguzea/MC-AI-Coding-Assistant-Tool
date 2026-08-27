/**
 * NeoForge 文档 MCP 工具
 *
 * 提供五个递进式查询工具（NeoForge 专用）：
 *   list_neoforge_versions       — 版本列表
 *   search_neoforge_docs         — hybrid 搜索（L0 + 语义 RRF）
 *   get_neoforge_doc_summary    — L1 摘要
 *   get_neoforge_doc_full       — L2/L2+ 全文
 *   get_neoforge_doc_related    — 相关文档
 *
 * 数据来源：docs.neoforged.net（多版本支持）
 * 1.20.1 特殊处理：使用 Forge 1.20.1 数据（100% API 兼容）
 */

import * as z from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  NeoForgeDocStore,
  DocNotFoundError,
  VersionNotFoundError,
} from "./store.js";
import { resolveDataDir } from "../../utils/path.js";
import {
  asPlatformDataMissingResult,
  platformDataMissingResult,
  hasPlatformDocData,
} from "../platform-data.js";
import { semanticSearch } from "../semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings, withDocsFallbackFields } from "../search-utils.js";
import { missingSemanticDbWarning } from "../semantic/status.js";
import {
  findPrimer,
  isPrimerDocId,
  primerFullPayload,
  primerSummaryPayload,
  searchNeoForgePrimers,
} from "./primers.js";
import { missingMcVersion, versionRequiredAction } from "../../utils/actionable.js";

function neoDataRoot(): string {
  return resolveDataDir();
}

const _storeByRoot = new Map<string, NeoForgeDocStore>();

function getNeoStore(): NeoForgeDocStore {
  const root = neoDataRoot();
  let s = _storeByRoot.get(root);
  if (!s) {
    s = new NeoForgeDocStore(root);
    _storeByRoot.set(root, s);
  }
  return s;
}

/** versionFallback 才盖信封；Neo 1.20.1 Forge 兼容层不得 fallback:true。 */
function annotateNeoGetResult(
  version: string,
  resolution: ReturnType<NeoForgeDocStore["describeVersionResolution"]>,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return withDocsFallbackFields({
    ...payload,
    version,
    resolvedVersion: resolution.resolved,
    versionFallback: resolution.versionFallback,
    warning: joinSearchWarnings(
      typeof payload.warning === "string" ? payload.warning : undefined,
      resolution.warning,
    ),
  });
}

function versionRequiredDocResult(): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify({ ok: false, action: versionRequiredAction() }, null, 2) }],
  };
}

function handleError(e: unknown): CallToolResult {
  const miss = asPlatformDataMissingResult(e);
  if (miss) return miss;
  if (e instanceof VersionNotFoundError) {
    if (e.availableVersions.length === 0) return platformDataMissingResult("neoforge");
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: {
            code: "VERSION_NOT_FOUND",
            message: e.message,
            hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
          },
        }, null, 2),
      }],
    };
  }
  if (e instanceof DocNotFoundError) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: {
            code: "DOC_NOT_FOUND",
            message: e.message,
            id: e.id,
            version: e.version,
          },
        }, null, 2),
      }],
    };
  }
  return {
    content: [{ type: "text", text: JSON.stringify({ ok: false, error: { code: "INTERNAL_ERROR", message: String(e) } }, null, 2) }],
  };
}

// ── 工具 0：list_neoforge_versions ───────────────────────────────────────────

export const listNeoForgeVersionsSchema = {
  name: "list_neoforge_versions",
  description:
    "返回 data 目录下所有已加载的 NeoForge 文档版本列表（如 [\"26.1\", \"1.21.11\", \"1.20.4\", ...]）。" +
    "注意：1.20.1 版本使用 Forge 1.20.1 数据（100% API 兼容）。" +
    "官方主文档当前最新多为 26.1；26.2 主站未发布时请用 26.1 + primer 26.2（勿把 26.1 克隆成 26.2）。",
  inputSchema: z.object({}),
} as const;

export async function listNeoForgeVersions(): Promise<CallToolResult> {
  try {
    if (!hasPlatformDocData("neoforge", neoDataRoot())) {
      return platformDataMissingResult("neoforge");
    }
    const versions = getNeoStore().getAvailableVersions();
    if (versions.length === 0) return platformDataMissingResult("neoforge");
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ ok: true, platform: "neoforge", versions }, null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 工具 1：search_neoforge_docs ────────────────────────────────────────────

export const searchNeoForgeDocsSchema = {
  name: "search_neoforge_docs",
  description:
    "搜索 NeoForge 官方文档（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。" +
    "适用于：需要了解 NeoForge 特有功能（如 DeferredRegister、Data Components、Payload 网络）的官方说明时。" +
    "返回相关页面 ID 列表，每个结果包含标题、标签和相关性评分。" +
    "另合并 data/neoforge_primers（仅 loader=neoforge，命中带 source:primer）。" +
    "无独立主文档树的版本（如 1.20.5、未发布的 26.2）会 warning，禁止把邻档 API 当本版。" +
    "增强功能：支持标签过滤；自动去除 the/and/of 等停用词；按相关性排序。",
  inputSchema: z.object({
    query: z.string().describe("搜索查询关键词"),
    version: z.string().describe("NeoForge 版本（必填）。请先 list_neoforge_versions"),
    tags: z.array(z.string()).optional().describe("标签过滤（如 [\"deferredregister\", \"networking\"]）"),
  }),
} as const;

export async function searchNeoForgeDocs(args: {
  query: string;
  version?: string;
  tags?: string[];
}): Promise<CallToolResult> {
  try {
    if (!hasPlatformDocData("neoforge", neoDataRoot())) {
      return platformDataMissingResult("neoforge");
    }
    const s = getNeoStore();
    if (missingMcVersion(args.version)) return versionRequiredDocResult();
    const version = args.version!.trim();
    const resolution = s.describeVersionResolution(version);
    let detailed: ReturnType<NeoForgeDocStore["searchIndexDetailed"]>;
    try {
      detailed = s.searchIndexDetailed(args.query, version, args.tags);
    } catch (e) {
      if (!(e instanceof VersionNotFoundError) || !resolution.mainDocsMissing) throw e;
      detailed = {
        results: [],
        requestedVersion: version,
        resolvedVersion: version,
        versionFallback: false,
      };
    }
    const forgeCompatible = resolution.sourcePlatform === "forge";
    const resolutionSource = resolution.sourcePlatform === "forge" ? resolution.sourceVersion : undefined;
    const semanticHits = resolution.sourcePlatform === "forge"
      ? await semanticSearch(
          args.query,
          "forge",
          resolution.sourceVersion ?? "1.20.1",
          "forge-docs",
          neoDataRoot(),
        )
      : resolution.mainDocsMissing
        ? null
        : await semanticSearch(
            args.query,
            "neoforge",
            detailed.resolvedVersion,
            "neoforge-docs",
            neoDataRoot(),
          );
    let results = semanticHits === null
      ? detailed.results
      : mergeSemanticResults(detailed.results, semanticHits, {
          tags: args.tags,
          limit: 20,
          version: detailed.resolvedVersion,
        });
    const primerHits = searchNeoForgePrimers({ query: args.query, version, dataRoot: neoDataRoot() });
    if (primerHits.length) {
      const seen = new Set(results.map((r) => r.id));
      results = [...primerHits.filter((p) => !seen.has(p.id)), ...results].slice(0, 20);
    }
    return {
      content: [{
        type: "text",
        text: JSON.stringify(withDocsFallbackFields({
          ok: true,
          query: args.query,
          version,
          resolvedVersion: detailed.resolvedVersion,
          versionFallback: detailed.versionFallback || resolution.versionFallback,
          warning: joinSearchWarnings(
            resolution.warning,
            detailed.versionFallback && !resolution.warning
              ? `请求版本 ${version} 已映射到 ${detailed.resolvedVersion}`
              : undefined,
            primerHits.length ? "结果含 source=primer（迁移 Primer，不是 loader API 全文）" : undefined,
            version === "26.1" ? "NeoForge 26.1 官方无 /docs/26.1/，抓的是未版本化现行 /docs/（unversionedCurrent）。26.2 成为现行后禁止 --force 覆盖本树，也不要克隆成 26.2。" : undefined,
            missingSemanticDbWarning(semanticHits === null && !resolution.mainDocsMissing),
          ),
          forgeCompatible: forgeCompatible || undefined,
          source_version: resolutionSource,
          unversionedCurrent: version === "26.1" || undefined,
          sourceNote: forgeCompatible
            ? "NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）"
            : undefined,
          semantic: semanticHits !== null,
          total: results.length,
          results,
        }), null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 工具 2：get_neoforge_doc_summary ─────────────────────────────────────────

export const getNeoForgeDocSummarySchema = {
  name: "get_neoforge_doc_summary",
  description:
    "获取 NeoForge 文档页面的章节骨架与摘要（L1）。" +
    "适用于：判断某篇文档是否包含所需内容时。" +
    "返回每个 <h2> 章节的标题和 150-200 字摘要。",
  inputSchema: z.object({
    id: z.string().describe("文档页面 ID（如 \"concepts/registries\"）"),
    version: z.string().describe("NeoForge 版本（必填）。请先 list_neoforge_versions"),
  }),
} as const;

export async function getNeoForgeDocSummary(args: {
  id: string;
  version?: string;
}): Promise<CallToolResult> {
  try {
    if (missingMcVersion(args.version)) return versionRequiredDocResult();
    const version = args.version!.trim();
    if (isPrimerDocId(args.id)) {
      const primer = findPrimer(args.id);
      if (!primer) {
        throw new DocNotFoundError(args.id, version);
      }
      return {
        content: [{ type: "text", text: JSON.stringify(primerSummaryPayload(primer), null, 2) }],
      };
    }
    const s = getNeoStore();
    const resolution = s.describeVersionResolution(version);
    const summary = s.loadSummary(args.id, version);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(annotateNeoGetResult(version, resolution, {
          ok: true,
          ...summary,
          ...(resolution.sourcePlatform === "forge"
            ? {
                forgeCompatible: true,
                source_version: resolution.sourceVersion,
                sourceNote: "NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）",
              }
            : {}),
        }), null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 工具 3：get_neoforge_doc_full ───────────────────────────────────────────

export const getNeoForgeDocFullSchema = {
  name: "get_neoforge_doc_full",
  description:
    "获取 NeoForge 文档页面全文（L2/L2+）。" +
    "适用于：需要查看 API 完整步骤、事件列表、配置项清单时。" +
    "highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）突出显示在开头。" +
    "**永远不要一次性加载超过 2 个 full page**，避免上下文溢出。",
  inputSchema: z.object({
    id: z.string().describe("文档页面 ID"),
    version: z.string().describe("NeoForge 版本（必填）。请先 list_neoforge_versions"),
    highlight_key: z.boolean().optional().default(true).describe("是否突出显示关键段落"),
  }),
} as const;

export async function getNeoForgeDocFull(args: {
  id: string;
  version?: string;
  highlight_key?: boolean;
}): Promise<CallToolResult> {
  try {
    if (missingMcVersion(args.version)) return versionRequiredDocResult();
    const version = args.version!.trim();
    if (isPrimerDocId(args.id)) {
      const primer = findPrimer(args.id);
      if (!primer) {
        throw new DocNotFoundError(args.id, version);
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(primerFullPayload(primer, true), null, 2),
        }],
      };
    }
    const s = getNeoStore();
    const resolution = s.describeVersionResolution(version);
    const result = await s.loadFullDoc(args.id, version, args.highlight_key ?? true);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(annotateNeoGetResult(version, resolution, {
          ok: true,
          ...result,
          ...(resolution.sourcePlatform === "forge"
            ? {
                forgeCompatible: true,
                source_version: resolution.sourceVersion,
              }
            : {}),
        }), null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 工具 4：get_neoforge_doc_related ────────────────────────────────────────

export const getNeoForgeDocRelatedSchema = {
  name: "get_neoforge_doc_related",
  description:
    "获取与指定 NeoForge 文档页面相关的其他页面列表。" +
    "适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。" +
    "返回与目标页面共享最多标签关键词的其他页面，按相关性降序排列。",
  inputSchema: z.object({
    id: z.string().describe("文档页面 ID"),
    version: z.string().describe("NeoForge 版本（必填）。请先 list_neoforge_versions"),
    limit: z.number().optional().default(5).describe("返回数量，默认 5"),
  }),
} as const;

export async function getNeoForgeDocRelated(args: {
  id: string;
  version?: string;
  limit?: number;
}): Promise<CallToolResult> {
  try {
    if (missingMcVersion(args.version)) return versionRequiredDocResult();
    const version = args.version!.trim();
    if (isPrimerDocId(args.id)) {
      const primer = findPrimer(args.id);
      if (!primer) {
        throw new DocNotFoundError(args.id, version);
      }
      const related = searchNeoForgePrimers({
        query: `${primer.from} ${primer.to} migration`,
        version: primer.to,
      }).filter((r) => r.id !== primer.id).slice(0, args.limit ?? 5);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            ok: true,
            id: args.id,
            version,
            results: related,
            warning: "Primer 相关页来自 neoforge_primers，不是 API 树。",
          }, null, 2),
        }],
      };
    }
    const s = getNeoStore();
    const resolution = s.describeVersionResolution(version);
    const results = s.getRelatedDocs(args.id, version, args.limit ?? 5);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(annotateNeoGetResult(version, resolution, {
          ok: true,
          id: args.id,
          ...(resolution.sourcePlatform === "forge"
            ? {
                forgeCompatible: true,
                source_version: resolution.sourceVersion,
              }
            : {}),
          results,
        }), null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}
