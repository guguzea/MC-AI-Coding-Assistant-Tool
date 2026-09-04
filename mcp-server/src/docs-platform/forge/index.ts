/**
 * Forge 文档 MCP 工具
 *
 * 提供五个递进式查询工具（Forge 专用）：
 *   list_forge_versions       — 版本列表
 *   search_forge_docs         — hybrid 搜索（L0 + 语义 RRF）
 *   get_forge_doc_summary    — L1 摘要
 *   get_forge_doc_full       — L2/L2+ 全文
 *   get_forge_doc_related    — 相关文档
 *
 * 数据来源：Forge 官方文档（docs.minecraftforge.net）1.20.1
 * 预处理产出：data/forge_1.20.1/forge-docs/
 */

import * as z from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ForgeDocStore, DocNotFoundError, VersionNotFoundError, IndexCorruptError } from "./store.js";
import {
  createDocStore,
  resolvePlatformDataDir,
  UnsupportedPlatformStore,
  type IDocStore,
  type Platform,
} from "../store.js";
import { searchFabricDocs } from "../fabric/index.js";
import { resolveDataDir } from "../../utils/path.js";
import {
  asPlatformDataMissingResult,
  platformDataMissingResult,
  hasPlatformDocData,
  type DocPlatform,
} from "../platform-data.js";
import { semanticSearch } from "../semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings, withDocsFallbackFields, thinLoaderWikiWarning, type SearchResultLike } from "../search-utils.js";
import { missingSemanticDbWarning, semanticStaleSearchWarning } from "../semantic/status.js";
import { SEARCH_DOC_PLATFORMS, PLATFORM_DOC_SUBDIR } from "../platforms.js";
import { ownGet } from "../../utils/own-record.js";
import { searchQuiltDocs, getQuiltDocSummary, getQuiltDocFull, getQuiltDocRelated } from "../quilt-search.js";
import {
  findPrimer,
  isPrimerDocId,
  primerFullPayload,
  primerSummaryPayload,
  searchNeoForgePrimers,
} from "../neoforge/primers.js";
import { actionable, ActionCodes } from "../../utils/actionable.js";

function forgeInternalError(e: unknown): CallToolResult {
  const message = e instanceof Error ? e.message : String(e);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          { ok: false, code: "INTERNAL_ERROR", error: { code: "INTERNAL_ERROR", message } },
          null,
          2,
        ),
      },
    ],
  };
}

const _forgeStoreByDir = new Map<string, ForgeDocStore>();

function getForgeStore(): ForgeDocStore {
  const dir = resolvePlatformDataDir("forge");
  let s = _forgeStoreByDir.get(dir);
  if (!s) {
    s = new ForgeDocStore(dir);
    _forgeStoreByDir.set(dir, s);
  }
  return s;
}

type VersionResolutionExtra = {
  warning?: string;
  versionFallback?: boolean;
  resolved?: string;
  sourcePlatform?: string;
  sourceVersion?: string;
};

/** 仅 store versionFallback（resolved≠requested）才盖信封；精确版本原样返回。 */
function withGetDocFallback(
  requested: string,
  extra: VersionResolutionExtra | undefined,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  if (!extra?.versionFallback) return payload;
  return withDocsFallbackFields({
    ...payload,
    requestedVersion: requested,
    resolvedVersion: extra.resolved,
    versionFallback: true,
  });
}

function platformRequiredResult(): CallToolResult {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        ok: false,
        action: actionable(ActionCodes.INVALID_INPUT, "请指定 platform，禁止默认 forge", [
          "传入 platform（forge/fabric/neoforge/quilt/liteloader/rift/modloader）",
          "先 list_doc_versions 查看该平台可用版本",
        ], ["list_doc_versions", "list_forge_versions", "list_fabric_versions", "list_neoforge_versions"]),
      }, null, 2),
    }],
  };
}

// ── 通用工具 store 缓存（key = platform:DATA_DIR，支持数据目录变化时正确失效）────────────

const _genericStoreCache = new Map<string, IDocStore>();

// ── 不支持平台的 store：A-33 起统一用 docs-platform/store.ts 的唯一实现 ───────
//
// 原来这里还有一份逐字相同的 UnsupportedPlatformStore 拷贝（5 个方法全是抛
// UNSUPPORTED_PLATFORM，只有形参可选性与 store.ts 那份不同）。两份拷贝各自
// 只被 new 一次：store.ts 的 createDocStore 未知平台兜底 + 这里的
// getGenericStore("bedrock")。现已合并为 docs-platform/store.ts 的导出类。

function getGenericStore(platform: Platform): IDocStore {
  if (platform === "bedrock") {
    return new UnsupportedPlatformStore();
  }
  const dataDir = resolvePlatformDataDir(platform);
  const cacheKey = `${platform}:${dataDir}`;
  let s = _genericStoreCache.get(cacheKey);
  if (!s) {
    s = createDocStore(platform, dataDir);
    _genericStoreCache.set(cacheKey, s);
  }
  return s;
}

// ── 工具 0：list_forge_versions（版本列表）──────────────────────────────────

export const listForgeVersionsSchema = {
  name: "list_forge_versions",
  description:
    "返回 data 目录下所有已加载的 Forge 文档版本列表（如 [\"1.20.1\", \"1.18.2\", \"1.17.1\", ...]）。" +
    "支持 ForgeJavaDocs 存档版本（1.7.10–1.12.2）和 MkDocs 官方文档版本（1.12.2–1.20.4）。" +
    "用于确认当前 MCP 服务支持哪些版本。",
  inputSchema: z.object({}),
} as const;

export async function listForgeVersions(): Promise<CallToolResult> {
  try {
    const versions = getForgeStore().getAvailableVersions();
    if (versions.length === 0) return platformDataMissingResult("forge");
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: true,
          platform: "forge",
          versions,
          notes: [
            "本列表是已入库的 Forge **文档**版本，不是规则树清单。",
            "forge/1.21.1 为 draft：无 00–10 规则树，也不在本清单；session 返回 PACK_NOT_FOUND。禁止用 NeoForge 1.21.1 或 Forge 1.20.4 顶上。",
          ],
        }, null, 2),
      }],
    };
  } catch (e) {
    const miss = asPlatformDataMissingResult(e);
    if (miss) return miss;
    return forgeInternalError(e);
  }
}

// ── 工具 1：search_forge_docs（L0 搜索）────────────────────────────────

export const searchForgeDocsSchema = {
  name: "search_forge_docs",
  description: `Forge 官方文档搜索（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。

使用方法：
  1. 先调用 search_forge_docs(query) 找出相关页面。
  2. 对于可能相关的页面，调用 get_forge_doc_summary 获取摘要。
  3. 仅当摘要显示该页肯定包含所需细节时，才调用 get_forge_doc_full。
  4. 对于注册/事件/能力/网络等核心课题，建议直接调用 get_forge_doc_full 并启用 highlight_key=true。
  5. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。
  6. ⚠️ 搜索失败时，使用精确术语（如类名、方法名、事件名）重新尝试，不要用长自然语言描述。

增强功能：
  - OR 分组：query 支持 | 分隔（如 blockentity | ticker），匹配任一词即返回
  - 前缀路由：class: 类名、event: 事件名、method: 方法名，可精确语义搜索
  - 去停用词：the / and / of 等常见词不参与匹配，减少噪音

参数说明：
  - query: 搜索关键词，可以是类名、概念或功能描述。
  - version: Minecraft/Forge 版本（必填）。仅同系列（任意 N.M.*）；跨主版本 VERSION_NOT_FOUND。请先 list_forge_versions。
  - tags: 可选标签过滤（小写无连字符，如 registry, event, capability, networking, datagen, sides, client, server）。

另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，
适合在已知类名后精确查询某个方法的签名。`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（类名、概念或功能描述，支持 class:/event:/method: 前缀和 | OR 分组）"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。仅同系列；跨主版本 VERSION_NOT_FOUND。示例：1.16.8→1.16.5。请先 list_forge_versions。"),
    tags: z
      .array(z.string())
      .optional()
      .describe("标签过滤（小写无连字符，如 registry, event, capability）"),
  }),
} as const;

export async function searchForgeDocs(
  args: z.infer<typeof searchForgeDocsSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    if (!hasPlatformDocData("forge")) {
      return platformDataMissingResult("forge");
    }
    const detailed = getForgeStore().searchIndexDetailed(
      args.query,
      args.version,
      args.tags,
    );
    // 语义检索（FTS5 全文 + 本地向量，RRF 融合）；无语义库/失败 → null，保持纯 L0
    const semanticHits = await semanticSearch(
      args.query,
      "forge",
      detailed.resolvedVersion,
      "forge-docs",
      resolveDataDir(),
    );
    const results = semanticHits === null
      ? detailed.results
      : mergeSemanticResults(detailed.results, semanticHits, {
          tags: args.tags,
          limit: 10,
          version: detailed.resolvedVersion,
          allowedIds: new Set(detailed.results.map((r) => r.id)),
        });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            withDocsFallbackFields({
              ok: true,
              platform: "forge",
              query: args.query,
              version: args.version,
              resolvedVersion: detailed.resolvedVersion,
              versionFallback: detailed.versionFallback,
              warning: joinSearchWarnings(
                detailed.versionFallback
                  ? `请求版本 ${args.version} 无独立文档，已降级到 ${detailed.resolvedVersion}`
                  : undefined,
                args.version === "1.20.4"
                  ? "Forge 1.20.4 无独立 /en/1.20.4/ 路由，正文来自 /en/1.20.x/。不要当成独立 1.20.4 全文。"
                  : undefined,
                missingSemanticDbWarning(semanticHits === null),
              ),
              tags: args.tags,
              semantic: semanticHits !== null,
              total: results.length,
              results,
            }),
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    const miss = asPlatformDataMissingResult(e);
    if (miss) return miss;
    if (e instanceof VersionNotFoundError) {
      if (e.availableVersions.length === 0) return platformDataMissingResult("forge");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                code: "VERSION_NOT_FOUND",
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}。先 list_forge_versions / list_doc_versions。`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return forgeInternalError(e);
  }
}

// ── 工具 2：get_forge_doc_summary（L1 摘要）──────────────────────────────

export const getForgeDocSummarySchema = {
  name: "get_forge_doc_summary",
  description: `获取 Forge 文档页面的章节骨架与摘要，用于判断是否需要深入。

适用场景：
  - 用户需要了解某个概念的大致内容
  - AI 需要判断该页与当前代码问题的相关性

返回内容：每个 <h2> 章节的标题 + 150-200 字摘要 + 首段概述。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_forge_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。仅同系列；跨主版本 VERSION_NOT_FOUND。示例：1.16.8→1.16.5。请先 list_forge_versions。"),
  }),
} as const;

export async function getForgeDocSummary(
  args: z.infer<typeof getForgeDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = getForgeStore().loadSummary(
      args.id,
      args.version,
    );
    const extra = getForgeStore().describeVersionResolution(args.version);
    const payload = extra.versionFallback
      ? withGetDocFallback(args.version, extra, { ...result, warning: extra.warning })
      : result;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(payload, null, 2),
        },
      ],
    };
  } catch (e) {
    if (e instanceof VersionNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}。先 list_forge_versions / list_doc_versions。`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    if (e instanceof DocNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                hint: `请使用 search_forge_docs 查询正确的页面 ID，格式为 "1.20.1/文件名"`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: false, code: "INTERNAL_ERROR", error: { code: "INTERNAL_ERROR", message: (e as Error).message } }, null, 2),
        },
      ],
    };
  }
}

// ── 工具 3：get_forge_doc_full（L2/L2+ 全文）───────────────────────────

export const getForgeDocFullSchema = {
  name: "get_forge_doc_full",
  description: `获取 Forge 文档页面全文。

适用场景：
  - 用户明确需要某个 API 的详细工作原理
  - 需要查看完整事件列表、注册完整步骤等

highlight_key=true 时，关键要点（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示在开头，
  若关键摘要已够用则不必细读全文。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_forge_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。仅同系列；跨主版本 VERSION_NOT_FOUND。示例：1.16.8→1.16.5。请先 list_forge_versions。"),
    highlight_key: z
      .boolean()
      .optional()
      .default(true)
      .describe("true 时提取并突出关键段落（🔴🟠🟢⭐），默认 true"),
  }),
} as const;

export async function getForgeDocFull(
  args: z.infer<typeof getForgeDocFullSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = await getForgeStore().loadFullDoc(
      args.id,
      args.version,
      args.highlight_key ?? true,
    );
    const extra = getForgeStore().describeVersionResolution(args.version);
    const payload = extra.versionFallback
      ? withGetDocFallback(args.version, extra, { ...result, warning: extra.warning })
      : result;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(payload, null, 2),
        },
      ],
    };
  } catch (e) {
    if (e instanceof VersionNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}。先 list_forge_versions / list_doc_versions。`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    if (e instanceof DocNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                hint: `请使用 search_forge_docs 查询正确的页面 ID，格式为 "1.20.1/文件名"`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: false, code: "INTERNAL_ERROR", error: { code: "INTERNAL_ERROR", message: (e as Error).message } }, null, 2),
        },
      ],
    };
  }
}

// ── 工具 4：get_forge_doc_related（相关文档）─────────────────────────────

export const getForgeDocRelatedSchema = {
  name: "get_forge_doc_related",
  description: `获取与指定 Forge 文档页面相关的其他页面列表。

适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。
返回与目标页面共享最多 section 关键词的其他页面，按相关性降序排列。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_forge_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。仅同系列；跨主版本 VERSION_NOT_FOUND。示例：1.16.8→1.16.5。请先 list_forge_versions。"),
    limit: z
      .number()
      .optional()
      .default(5)
      .describe("最多返回条数，默认 5"),
  }),
} as const;

export async function getForgeDocRelated(
  args: z.infer<typeof getForgeDocRelatedSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = getForgeStore().getRelatedDocs(
      args.id,
      args.version,
      args.limit ?? 5,
    );
    const extra = getForgeStore().describeVersionResolution(args.version);
    if (!extra.versionFallback) {
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
    return {
      content: [{
        type: "text",
        text: JSON.stringify(withGetDocFallback(args.version, extra, {
          ok: true,
          id: args.id,
          version: args.version,
          warning: extra.warning,
          results: result,
        }), null, 2),
      }],
    };
  } catch (e) {
    if (e instanceof DocNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                hint: "请使用 search_forge_docs 查询正确的页面 ID",
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    if (e instanceof VersionNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: false,
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}。先 list_forge_versions / list_doc_versions。`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok: false, code: "INTERNAL_ERROR", error: { code: "INTERNAL_ERROR", message: (e as Error).message } }, null, 2),
        },
      ],
    };
  }
}

// ── 通用工具（平台无关）────────────────────────────────────────────────────

export { createDocStore } from "../store.js";
export type { IDocStore, Platform } from "../store.js";

function isVersionNotFoundLike(e: unknown): e is { message: string; availableVersions: string[] } {
  if (!e || typeof e !== "object") return false;
  const rec = e as { name?: string; availableVersions?: unknown };
  return rec.name === "VersionNotFoundError" || Array.isArray(rec.availableVersions);
}

function isDocNotFoundLike(e: unknown): e is { message: string; code?: string; version?: string } {
  if (!e || typeof e !== "object") return false;
  const rec = e as { name?: string; id?: unknown; version?: unknown; availableVersions?: unknown };
  if (Array.isArray(rec.availableVersions)) return false;
  return rec.name === "DocNotFoundError" || (typeof rec.id === "string" && typeof rec.version === "string");
}

function asHandlePlatform(platform?: string): DocPlatform {
  const p = platform ?? "forge";
  const allowed: DocPlatform[] = [
    "forge",
    "neoforge",
    "fabric",
    "quilt",
    "liteloader",
    "rift",
    "modloader",
    "bedrock",
  ];
  return (allowed as string[]).includes(p) ? (p as DocPlatform) : "forge";
}

/** 统一错误处理（各通用 handler 复用）
 *
 * 所有错误统一返回 { ok: false, error: { code, message, hint } } 格式。
 * 成功路径保持原样 JSON.stringify({ query, version, total, results })，不套 envelope。
 * Quilt/LiteLoader 走 FabricDocStore，错误类与 Forge store 不是同一份，必须 duck-type。
 */
function handleError(e: unknown, platform: string = "forge"): CallToolResult {
  const miss = asPlatformDataMissingResult(e);
  if (miss) return miss;
  if (e instanceof VersionNotFoundError || isVersionNotFoundLike(e)) {
    const rec = e as { message?: string; availableVersions?: string[] };
    const versions = rec.availableVersions ?? [];
    if (versions.length === 0) {
      return platformDataMissingResult(asHandlePlatform(platform));
    }
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: {
            code: "VERSION_NOT_FOUND",
            message: rec.message ?? String(e),
            hint: `请使用支持的版本：${versions.join(", ") || "未知"}。先 list_forge_versions / list_doc_versions。`,
          },
        }, null, 2),
      }],
    };
  }
  if (e instanceof IndexCorruptError || (typeof e === "object" && e !== null && (e as { name?: string }).name === "IndexCorruptError")) {
    const rec = e as { message?: string };
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: {
            code: "INDEX_CORRUPT",
            message: rec.message ?? String(e),
            hint: "索引 JSON 损坏或截断，请勿当成 VERSION_NOT_FOUND。",
          },
        }, null, 2),
      }],
    };
  }
  if (e instanceof DocNotFoundError || isDocNotFoundLike(e)) {
    const rec = e as { code?: string; version?: string; message: string };
    const code = rec.code === "UNSUPPORTED_PLATFORM" ? "UNSUPPORTED_PLATFORM" : "DOC_NOT_FOUND";
    const hint = rec.code === "UNSUPPORTED_PLATFORM"
      ? "请使用 platform: forge、neoforge、fabric、quilt、liteloader、rift 或 modloader；基岩请用 search_bedrock_docs"
      : "请使用 search_docs 查询正确的页面 ID";
    const message = rec.code === "UNSUPPORTED_PLATFORM"
      ? rec.version ?? rec.message
      : rec.message;
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: { code, message, hint },
        }, null, 2),
      }],
    };
  }
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        ok: false,
        error: { code: "INTERNAL_ERROR", message: (e as Error).message },
      }, null, 2),
    }],
  };
}

// ── 通用工具 0：list_versions ─────────────────────────────────────────────

export const listVersionsSchema = {
  name: "list_doc_versions",
  description: `返回指定平台的可用文档版本列表。

返回示例：{ "platform": "forge", "versions": ["1.20.1"] }
⚠️ 此工具只返回指定 platform 的版本，不会返回其他平台的版本。
如需同时查询多个平台，请分别调用 list_doc_versions({ platform: "forge" }) 和 list_doc_versions({ platform: "fabric" })。

参数说明：
  - platform: 平台（forge/neoforge/fabric/quilt/liteloader/rift/modloader），必填。基岩请用 search_bedrock_docs。`,
  inputSchema: z.object({
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .describe("平台（必填）。请先 list_doc_versions"),
  }),
} as const;

export async function listVersions(
  args: z.infer<typeof listVersionsSchema.inputSchema>,
): Promise<CallToolResult> {
  const platform = args.platform;
  if (!platform) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          action: actionable(ActionCodes.INVALID_INPUT, "请指定 platform，禁止默认 forge", [
            "传入 platform（forge/fabric/neoforge/quilt/liteloader/rift/modloader）",
            "分别调用 list_doc_versions 查询各平台",
          ], ["list_doc_versions", "list_forge_versions", "list_fabric_versions", "list_neoforge_versions"]),
        }, null, 2),
      }],
    };
  }
  try {
    if (!hasPlatformDocData(platform)) {
      return platformDataMissingResult(platform);
    }
    const store = getGenericStore(platform);
    const versions = store.getAvailableVersions();
    if (versions.length === 0) return platformDataMissingResult(platform);
    return {
      content: [{ type: "text", text: JSON.stringify({ ok: true, platform, versions }, null, 2) }],
    };
  } catch (e) {
    const miss = asPlatformDataMissingResult(e);
    if (miss) return miss;
    // PlatformDataMissingError 可能未从 neoforge/fabric store 传到 instanceof（多副本）时用平台回退
    if (e instanceof Error && /未下载|结构不符合预期|数据目录不存在/.test(e.message)) {
      return platformDataMissingResult(platform);
    }
    return handleError(e, platform);
  }
}

// ── 通用工具 1：search_docs ───────────────────────────────────────────────

export const searchDocsSchema = {
  name: "search_docs",
  description: `通用文档搜索，支持多平台（Forge/NeoForge/Fabric/Quilt/LiteLoader/Rift/ModLoader）。基岩请用 search_bedrock_docs。

使用方法：
  1. 先调用 search_docs(query) 找出相关页面。
  2. 对于可能相关的页面，调用 get_doc_summary 获取摘要。
  3. 仅当摘要显示该页肯定包含所需细节时，才调用 get_doc_full。
  4. ⚡ 核心课题（注册/事件/网络/数据生成/mixin）默认用 get_doc_full 一步到位获取全文 + highlight。
  5. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。
  6. ⚠️ 搜索失败时，使用精确术语（如类名、方法名、事件名）重新尝试。

⚠️ platform 和 version 必须对应：
  - platform=forge / neoforge / fabric / quilt / liteloader / rift / modloader 时，version 必须是该平台已索引的版本
  - 基岩请用 search_bedrock_docs，不要用本工具的 platform=bedrock
  混合使用会导致文档查找失败。请先用 list_doc_versions 确认各平台的可用版本。

增强功能：
  - OR 分组：query 支持 | 分隔（如 blockentity | ticker）
  - 前缀路由：class: 类名、event: 事件名、method: 方法名
  - 去停用词：the / and / of 等常见词不参与匹配

参数说明：
  - query: 搜索关键词
  - version: Minecraft 版本（必填）
  - platform: 平台（必填，禁止默认 forge）
  - tags: 可选标签过滤
  - source: 仅 platform=fabric 时有效：fabric-docs（默认）/ fabric-wiki / all`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（支持 | OR 分组、class:/event:/method: 前缀）"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .describe("平台（必填）。请先 list_doc_versions"),
    tags: z.array(z.string()).optional().describe("标签过滤"),
    source: z
      .enum(["fabric-docs", "fabric-wiki", "all"])
      .optional()
      .describe("仅 platform=fabric：数据源，默认 fabric-docs"),
  }),
} as const;

export async function searchDocs(
  args: z.infer<typeof searchDocsSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    if (!args.platform) return platformRequiredResult();
    const platform = args.platform;
    const fabricSource = args.source ?? "fabric-docs";

    if (platform === "quilt") {
      return searchQuiltDocs({ query: args.query, version: args.version, tags: args.tags });
    }

    if (!hasPlatformDocData(platform)) {
      return platformDataMissingResult(platform);
    }

    if (platform === "fabric") {
      return searchFabricDocs({
        query: args.query,
        version: args.version,
        tags: args.tags,
        source: fabricSource,
      });
    }

    const store = getGenericStore(platform);
    let result: ReturnType<IDocStore["searchIndex"]> = [];
    let threwMissing = false;
    try {
      result = store.searchIndex(
        args.query,
        args.version,
        args.tags,
      );
    } catch (e) {
      const rec = e as { name?: string; availableVersions?: unknown };
      if (platform === "neoforge" && (rec.name === "VersionNotFoundError" || Array.isArray(rec.availableVersions))) {
        const describeVersionResolution = (
          store as { describeVersionResolution?: (v: string) => { mainDocsMissing?: boolean } }
        ).describeVersionResolution;
        const neoResolution =
          typeof describeVersionResolution === "function"
            ? describeVersionResolution(args.version)
            : undefined;
        if (neoResolution?.mainDocsMissing) {
          threwMissing = true;
          result = [];
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }
    const meta =
      threwMissing
        ? null
        : typeof (store as unknown as { getLastSearchMeta?: () => {
        resolvedVersion: string;
        versionFallback: boolean;
        requestedVersion: string;
      } | null }).getLastSearchMeta === "function"
        ? (store as unknown as { getLastSearchMeta: () => {
            resolvedVersion: string;
            versionFallback: boolean;
            requestedVersion: string;
          } | null }).getLastSearchMeta()
        : null;
    const resolvedVersion = meta?.resolvedVersion ?? args.version;
    const versionFallback = meta?.versionFallback ?? false;
    const neoResolution =
      platform === "neoforge" &&
      typeof (store as { describeVersionResolution?: (v: string) => {
        sourcePlatform?: string;
        sourceVersion?: string;
        mainDocsMissing?: boolean;
      } }).describeVersionResolution === "function"
        ? (store as unknown as { describeVersionResolution: (v: string) => {
            sourcePlatform?: string;
            sourceVersion?: string;
            mainDocsMissing?: boolean;
          } }).describeVersionResolution(args.version)
        : undefined;
    const docSource =
      neoResolution?.sourcePlatform === "forge"
        ? "forge-docs"
        : platform === "neoforge"
          ? "neoforge-docs"
          : ownGet(PLATFORM_DOC_SUBDIR, platform) ?? "forge-docs";
    const semPlatform = neoResolution?.sourcePlatform === "forge" ? "forge" : platform;
    const semVersion =
      neoResolution?.sourcePlatform === "forge"
        ? (neoResolution.sourceVersion ?? "1.20.1")
        : resolvedVersion;
    const semanticHits =
      threwMissing || (neoResolution?.mainDocsMissing && neoResolution.sourcePlatform !== "forge")
        ? null
        : await semanticSearch(
            args.query,
            semPlatform,
            semVersion,
            docSource,
            resolveDataDir(),
          );
    const finalResultsBase = semanticHits === null
      ? result
      : mergeSemanticResults(result, semanticHits, {
          tags: args.tags,
          limit: 20,
          version: resolvedVersion,
          allowedIds: new Set(result.map((r) => r.id)),
        });
    let finalResults = finalResultsBase;
    let primerNote: string | undefined;
    if (platform === "neoforge") {
      const primerHits = searchNeoForgePrimers({
        query: args.query,
        version: args.version,
        dataRoot: resolveDataDir(),
      });
      if (primerHits.length) {
        const seen = new Set(finalResults.map((r) => r.id));
        finalResults = [...primerHits.filter((p) => !seen.has(p.id)), ...finalResults].slice(0, 20);
        primerNote = "结果含 source=primer（迁移 Primer，不是 loader API 全文）";
      }
    }
    const loaderWikiWarn = thinLoaderWikiWarning(platform, finalResults);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            withDocsFallbackFields({
              ok: true,
              query: args.query,
              version: args.version,
              resolvedVersion,
              versionFallback,
              ...(loaderWikiWarn ? { wikiIsCurrentSite: true } : {}),
              warning: joinSearchWarnings(
                threwMissing
                  ? `NeoForge 无独立 ${args.version} 主文档树。未建档版本禁止读邻档 00–10。`
                  : undefined,
                versionFallback
                  ? `请求版本 ${args.version} 无独立文档，已降级到 ${resolvedVersion}`
                  : undefined,
                platform === "forge" && args.version === "1.20.4"
                  ? "Forge 1.20.4 无独立 /en/1.20.4/ 路由，正文来自 /en/1.20.x/。不要当成独立 1.20.4 全文。"
                  : undefined,
                primerNote,
                missingSemanticDbWarning(semanticHits === null),
                semanticStaleSearchWarning(resolveDataDir(), platform, resolvedVersion, docSource),
                loaderWikiWarn,
                finalResults.length === 0 && /[\u4e00-\u9fff]/.test(String(args.query ?? ""))
                  ? "中文查询命中为空：可改英文关键词（如 register block）或先 list_doc_versions 确认档位。"
                  : undefined,
              ),
              platform,
              tags: args.tags,
              semantic: semanticHits !== null,
              total: finalResults.length,
              results: finalResults,
              ...(platform === "neoforge" && neoResolution?.sourcePlatform === "forge"
                ? {
                  forgeCompatible: true,
                  source_version: neoResolution.sourceVersion ?? "1.20.1",
                  sourceNote: "NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）",
                }
                : {}),
            }),
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    return handleError(e, args.platform);
  }
}

// ── 通用工具 2：get_doc_summary ──────────────────────────────────────────

export const getDocSummarySchema = {
  name: "get_doc_summary",
  description: `获取文档页面的章节骨架与摘要，支持多平台（forge/neoforge/fabric/quilt/liteloader/rift/modloader）。基岩请用 get_bedrock_doc_summary。
适用于：判断某篇文档是否包含所需内容时。返回每个章节的标题、摘要和首段概述，用于判断是否需要深入。

⚠️ platform 和 version 必须对应；Quilt 无此页时会回退 Fabric（fallback=fabric）。FAPI 专属 Registry/ItemGroup 页会拒绝（ok=false，不返回正文）。QSL 不要用 Fabric Registry 页。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .describe("平台（必填）。请先 list_doc_versions"),
  }),
} as const;

export async function getDocSummary(
  args: z.infer<typeof getDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  if (!args.platform) return platformRequiredResult();
  const platform = args.platform;
  try {
    if (platform === "quilt") {
      return await getQuiltDocSummary({ id: args.id, version: args.version });
    }
    if (platform === "neoforge" && isPrimerDocId(args.id)) {
      const primer = findPrimer(args.id);
      if (!primer) throw new DocNotFoundError(args.id, args.version);
      return { content: [{ type: "text", text: JSON.stringify(primerSummaryPayload(primer), null, 2) }] };
    }
    const store = getGenericStore(platform);
    const result = store.loadSummary(args.id, args.version);
    const extra =
      platform === "forge" || platform === "neoforge"
        ? (store as { describeVersionResolution?: (v: string) => VersionResolutionExtra }).describeVersionResolution?.(args.version)
        : undefined;
    const wikiWarn = thinLoaderWikiWarning(platform, [result]);
    const payload = withGetDocFallback(args.version, extra, {
      ...result,
      warning: joinSearchWarnings(extra?.warning, wikiWarn),
      ...(wikiWarn ? { wikiIsCurrentSite: true } : {}),
      ...(platform === "neoforge" && extra?.sourcePlatform === "forge"
        ? {
          forgeCompatible: true,
          source_version: extra.sourceVersion ?? "1.20.1",
          sourceNote: "NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）",
        }
        : {}),
    });
    return {
      content: [{
        type: "text",
        text: JSON.stringify(payload, null, 2),
      }],
    };
  } catch (e) {
    return handleError(e, platform);
  }
}

// ── 通用工具 3：get_doc_full ─────────────────────────────────────────────

export const getDocFullSchema = {
  name: "get_doc_full",
  description: `获取文档页面全文，支持多平台（forge/neoforge/fabric/quilt/liteloader/rift/modloader）。基岩请用 get_bedrock_doc_full。
适用于：需要查看 API 完整步骤、事件列表、配置项清单时。
highlight_key=true（默认）时，关键段落（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示。

⚠️ Quilt 无此页时会回退 Fabric（fallback=fabric）。FAPI 专属 Registry/ItemGroup 页会拒绝（ok=false，不返回正文）。QSL 不要用 Fabric Registry 页。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .describe("平台（必填）。请先 list_doc_versions"),
    highlight_key: z
      .boolean()
      .optional()
      .default(true)
      .describe("true 时提取并突出关键段落，默认 true"),
  }),
} as const;

export async function getDocFull(
  args: z.infer<typeof getDocFullSchema.inputSchema>,
): Promise<CallToolResult> {
  if (!args.platform) return platformRequiredResult();
  const platform = args.platform;
  try {
    if (platform === "quilt") {
      return await getQuiltDocFull({
        id: args.id,
        version: args.version,
        highlight_key: args.highlight_key,
      });
    }
    if (platform === "neoforge" && isPrimerDocId(args.id)) {
      const primer = findPrimer(args.id);
      if (!primer) throw new DocNotFoundError(args.id, args.version);
      return { content: [{ type: "text", text: JSON.stringify(primerFullPayload(primer, true), null, 2) }] };
    }
    const store = getGenericStore(platform);
    const result = await store.loadFullDoc(
      args.id,
      args.version,
      args.highlight_key ?? true,
    );
    const extra =
      platform === "forge" || platform === "neoforge"
        ? (store as { describeVersionResolution?: (v: string) => VersionResolutionExtra }).describeVersionResolution?.(args.version)
        : undefined;
    const wikiWarn = thinLoaderWikiWarning(platform, [
      { id: args.id, url: result.meta?.url },
    ]);
    const payload = withGetDocFallback(args.version, extra, {
      ...result,
      warning: joinSearchWarnings(extra?.warning, wikiWarn),
      ...(wikiWarn ? { wikiIsCurrentSite: true } : {}),
      ...(platform === "neoforge" && extra?.sourcePlatform === "forge"
        ? {
          forgeCompatible: true,
          source_version: extra.sourceVersion ?? "1.20.1",
          sourceNote: "NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）",
        }
        : {}),
    });
    return {
      content: [{
        type: "text",
        text: JSON.stringify(payload, null, 2),
      }],
    };
  } catch (e) {
    return handleError(e, platform);
  }
}

// ── 通用工具 4：get_doc_related ─────────────────────────────────────────

export const getDocRelatedSchema = {
  name: "get_doc_related",
  description: `获取与指定文档页面相关的其他页面列表，支持多平台（forge/neoforge/fabric/quilt/liteloader/rift/modloader）。
适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。返回共享最多关键词的其他页面，按相关性降序排列。基岩请用 get_bedrock_doc_related。
成功时 JSON 根是数组（与其它 platform 相同）。

⚠️ Quilt 无此页时会回退 Fabric（条目带 sourcePlatform=fabric 与 warning），并丢掉 FAPI 专属 Registry/ItemGroup 页。FAPI 专属 id 拒绝（ok=false 对象，不是数组）。QSL 不要用 Fabric Registry 页。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .describe("平台（必填）。请先 list_doc_versions"),
    limit: z.number().optional().default(5).describe("最多返回条数，默认 5"),
  }),
} as const;

export async function getDocRelated(
  args: z.infer<typeof getDocRelatedSchema.inputSchema>,
): Promise<CallToolResult> {
  if (!args.platform) return platformRequiredResult();
  const platform = args.platform;
  try {
    if (platform === "quilt") {
      return getQuiltDocRelated({ id: args.id, version: args.version, limit: args.limit });
    }
    const store = getGenericStore(platform);
    const result = store.getRelatedDocs(
      args.id,
      args.version,
      args.limit ?? 5,
    );
    const extra =
      platform === "forge" || platform === "neoforge"
        ? (store as { describeVersionResolution?: (v: string) => { warning?: string } }).describeVersionResolution?.(args.version)
        : undefined;
    const payload = extra?.warning
      ? (Array.isArray(result) ? result.map((h) => ({ ...h, warning: extra.warning })) : result)
      : result;
    return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
  } catch (e) {
    return handleError(e, platform);
  }
}
