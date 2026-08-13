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
import { ForgeDocStore, DocNotFoundError, VersionNotFoundError } from "./store.js";
import { createDocStore, resolvePlatformDataDir, type IDocStore, type Platform } from "../store.js";
import { createFabricDocStore } from "../fabric/store.js";
import { resolveDataDir } from "../../utils/path.js";
import {
  asPlatformDataMissingResult,
  platformDataMissingResult,
  hasPlatformDocData,
} from "../platform-data.js";
import { semanticSearch } from "../semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings, type SearchResultLike } from "../search-utils.js";
import { missingSemanticDbWarning, semanticStaleSearchWarning } from "../semantic/status.js";
import { SEARCH_DOC_PLATFORMS, PLATFORM_DOC_SUBDIR } from "../platforms.js";
import { searchQuiltDocs } from "../quilt-search.js";

const store = new ForgeDocStore(resolvePlatformDataDir("forge"));

// ── 通用工具 store 缓存（key = platform:DATA_DIR，支持数据目录变化时正确失效）────────────

const _genericStoreCache = new Map<string, IDocStore>();

// ── 不支持平台的 store 实现 ─────────────────────────────────────────────────────

/**
 * 当平台不支持时返回此 store，所有方法都抛出 DocNotFoundError(code: UNSUPPORTED_PLATFORM)。
 * 这样行为统一，调用方收到一致的错误 envelope。
 */
class UnsupportedPlatformStore implements IDocStore {
  private static readonly MSG = "平台不支持；Java 文档用 forge/neoforge/fabric/quilt/liteloader/rift/modloader，基岩用 search_bedrock_docs";
  private static readonly HINT = "请使用 platform: forge、neoforge、fabric、quilt、liteloader、rift 或 modloader";

  getAvailableVersions(): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  searchIndex(_query: string, _version?: string): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  loadSummary(_pageId: string, _version?: string): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  loadFullDoc(_pageId: string, _version?: string): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  getRelatedDocs(_pageId: string, _version?: string): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
}

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
    const versions = store.getAvailableVersions();
    if (versions.length === 0) return platformDataMissingResult("forge");
    return {
      content: [{ type: "text", text: JSON.stringify({ ok: true, platform: "forge", versions }, null, 2) }],
    };
  } catch (e) {
    const miss = asPlatformDataMissingResult(e);
    if (miss) return miss;
    return {
      content: [{ type: "text", text: JSON.stringify({ ok: false, error: { code: "INTERNAL_ERROR", message: (e as Error).message } }, null, 2) }],
    };
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
  - version: Minecraft/Forge 版本。默认使用最高版本，版本不存在时自动降级（如 1.18→1.18.x→最高可用版本）。
  - tags: 可选标签过滤（小写无连字符，如 registry, event, capability, networking, datagen, sides, client, server）。

另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，
适合在已知类名后精确查询某个方法的签名。`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（类名、概念或功能描述，支持 class:/event:/method: 前缀和 | OR 分组）"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。版本不存在时自动降级。示例：1.18→1.18.x，1.17→1.17.1。"),
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
    const detailed = store.searchIndexDetailed(
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
        });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              query: args.query,
              version: args.version,
              resolvedVersion: detailed.resolvedVersion,
              versionFallback: detailed.versionFallback,
              warning: joinSearchWarnings(
                detailed.versionFallback
                  ? `请求版本 ${args.version} 无独立文档，已降级到 ${detailed.resolvedVersion}`
                  : undefined,
                missingSemanticDbWarning(semanticHits === null),
              ),
              tags: args.tags,
              semantic: semanticHits !== null,
              total: results.length,
              results,
            },
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
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
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
          text: JSON.stringify({ ok: false, error: (e as Error).message }, null, 2),
        },
      ],
    };
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
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。版本不存在时自动降级。示例：1.18→1.18.x，1.17→1.17.1。"),
  }),
} as const;

export async function getForgeDocSummary(
  args: z.infer<typeof getForgeDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = store.loadSummary(
      args.id,
      args.version,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
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
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
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
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
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
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。版本不存在时自动降级。示例：1.18→1.18.x，1.17→1.17.1。"),
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
    const result = await store.loadFullDoc(
      args.id,
      args.version,
      args.highlight_key ?? true,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
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
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
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
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
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
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Forge 版本（必填）。版本不存在时自动降级。示例：1.18→1.18.x，1.17→1.17.1。"),
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
    const result = store.getRelatedDocs(
      args.id,
      args.version,
      args.limit ?? 5,
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    if (e instanceof DocNotFoundError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
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
                error: e.message,
                hint: `请使用支持的版本：${e.availableVersions.join(", ") || "未知"}`,
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
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
        },
      ],
    };
  }
}

// ── 通用工具（平台无关）────────────────────────────────────────────────────

export { createDocStore } from "../store.js";
export type { IDocStore, Platform } from "../store.js";

/** 统一错误处理（各通用 handler 复用）
 *
 * 所有错误统一返回 { ok: false, error: { code, message, hint } } 格式。
 * 成功路径保持原样 JSON.stringify({ query, version, total, results })，不套 envelope。
 */
function handleError(e: unknown): CallToolResult {
  const miss = asPlatformDataMissingResult(e);
  if (miss) return miss;
  if (e instanceof VersionNotFoundError) {
    if (e.availableVersions.length === 0) {
      // 无法从 VersionNotFoundError 区分平台；通用工具默认按消息提示下载
      return platformDataMissingResult("forge");
    }
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
    const code = e.code === "UNSUPPORTED_PLATFORM" ? "UNSUPPORTED_PLATFORM" : "DOC_NOT_FOUND";
    const hint = e.code === "UNSUPPORTED_PLATFORM"
      ? "请使用 platform: forge、neoforge、fabric、quilt、liteloader、rift 或 modloader；基岩请用 search_bedrock_docs"
      : "请使用 search_docs 查询正确的页面 ID";
    const message = e.code === "UNSUPPORTED_PLATFORM"
      ? e.version  // 短提示
      : e.message;
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
  - platform: 平台（forge/neoforge/fabric），默认 forge。请先用此工具确认各平台的可用版本。`,
  inputSchema: z.object({
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
  }),
} as const;

export async function listVersions(
  args: z.infer<typeof listVersionsSchema.inputSchema>,
): Promise<CallToolResult> {
  const platform = args.platform ?? "forge";
  try {
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
    return handleError(e);
  }
}

// ── 通用工具 1：search_docs ───────────────────────────────────────────────

export const searchDocsSchema = {
  name: "search_docs",
  description: `通用文档搜索，支持多平台（Forge/NeoForge/Fabric）。

使用方法：
  1. 先调用 search_docs(query) 找出相关页面。
  2. 对于可能相关的页面，调用 get_doc_summary 获取摘要。
  3. 仅当摘要显示该页肯定包含所需细节时，才调用 get_doc_full。
  4. ⚡ 核心课题（注册/事件/网络/数据生成/mixin）默认用 get_doc_full 一步到位获取全文 + highlight。
  5. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。
  6. ⚠️ 搜索失败时，使用精确术语（如类名、方法名、事件名）重新尝试。

⚠️ platform 和 version 必须对应：
  - platform=forge 时，version 必须是 Forge 版本（如 1.20.1）
  - platform=fabric 时，version 必须是 Fabric 版本（如 1.20.1）
  混合使用会导致文档查找失败。请先用 list_doc_versions 确认各平台的可用版本。

增强功能：
  - OR 分组：query 支持 | 分隔（如 blockentity | ticker）
  - 前缀路由：class: 类名、event: 事件名、method: 方法名
  - 去停用词：the / and / of 等常见词不参与匹配

参数说明：
  - query: 搜索关键词
  - version: Minecraft 版本（必填）
  - platform: 平台，默认 forge
  - tags: 可选标签过滤
  - source: 仅 platform=fabric 时有效：fabric-docs（默认）/ fabric-wiki / all`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（支持 | OR 分组、class:/event:/method: 前缀）"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
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
    const platform = args.platform ?? "forge";
    const fabricSource = args.source ?? "fabric-docs";

    if (platform === "quilt") {
      return searchQuiltDocs({ query: args.query, version: args.version, tags: args.tags });
    }

    if (!hasPlatformDocData(platform)) {
      return platformDataMissingResult(platform);
    }

    if (platform === "fabric") {
      const dataRoot = resolveDataDir();
      let results: SearchResultLike[];
      let resolvedVersion = args.version;
      let versionFallback = false;

      if (fabricSource === "all") {
        const docs = createFabricDocStore(args.version, "fabric-docs", dataRoot)
          .searchIndexDetailed(args.query, args.version, args.tags);
        const wiki = createFabricDocStore(args.version, "fabric-wiki", dataRoot)
          .searchIndexDetailed(args.query, args.version, args.tags);
        const merged = [
          ...docs.results.map((r) => ({ ...r, _source: "fabric-docs" as const })),
          ...wiki.results.map((r) => ({ ...r, _source: "fabric-wiki" as const })),
        ];
        merged.sort((a, b) => ((b as { score?: number }).score ?? 0) - ((a as { score?: number }).score ?? 0));
        results = merged.slice(0, 20);
        resolvedVersion = docs.resolvedVersion;
        versionFallback = docs.versionFallback || wiki.versionFallback;
      } else {
        const detailed = createFabricDocStore(args.version, fabricSource, dataRoot)
          .searchIndexDetailed(args.query, args.version, args.tags);
        results = detailed.results;
        resolvedVersion = detailed.resolvedVersion;
        versionFallback = detailed.versionFallback;
      }

      // 语义检索（两源各自查询）；无语义库 → null，保持纯 L0
      const sources = fabricSource === "all" ? ["fabric-docs", "fabric-wiki"] : [fabricSource];
      let semanticRanked = false;
      let semanticMissing = false;
      const semanticList: Array<{
        docId: string;
        score?: number;
        label: string;
        url?: string;
        tags?: string[];
        priority?: string;
        sectionCount?: number;
      }> = [];
      for (const src of sources) {
        const hits = await semanticSearch(args.query, "fabric", args.version, src, dataRoot);
        if (hits === null) semanticMissing = true;
        else semanticRanked = true;
        if (hits) semanticList.push(...hits);
      }
      if (semanticRanked) {
        results = mergeSemanticResults(results, semanticList, {
          tags: args.tags,
          limit: 20,
          version: resolvedVersion,
        });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: true,
                query: args.query,
                version: args.version,
                resolvedVersion,
                versionFallback,
                warning: joinSearchWarnings(
                  versionFallback
                    ? `请求版本 ${args.version} 无独立文档，已降级到 ${resolvedVersion}`
                    : undefined,
                  missingSemanticDbWarning(semanticMissing),
                  semanticStaleSearchWarning(dataRoot, "fabric", resolvedVersion, fabricSource === "all" ? "fabric-docs" : fabricSource),
                ),
                platform,
                source: fabricSource,
                tags: args.tags,
                semantic: semanticRanked,
                total: results.length,
                results,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    const store = getGenericStore(platform);
    const result = store.searchIndex(
      args.query,
      args.version,
      args.tags,
    );
    const meta =
      typeof (store as unknown as { getLastSearchMeta?: () => {
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
    // 语义检索（forge/neoforge 各自语义库）；无语义库 → null，保持纯 L0
    const docSource =
      platform === "neoforge"
        ? "neoforge-docs"
        : PLATFORM_DOC_SUBDIR[platform] ?? "forge-docs";
    const semanticHits = await semanticSearch(
      args.query,
      platform,
      resolvedVersion,
      docSource,
      resolveDataDir(),
    );
    const finalResults = semanticHits === null
      ? result
      : mergeSemanticResults(result, semanticHits, {
          tags: args.tags,
          limit: 20,
          version: resolvedVersion,
        });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              query: args.query,
              version: args.version,
              resolvedVersion,
              versionFallback,
              warning: joinSearchWarnings(
                versionFallback
                  ? `请求版本 ${args.version} 无独立文档，已降级到 ${resolvedVersion}`
                  : undefined,
                missingSemanticDbWarning(semanticHits === null),
                semanticStaleSearchWarning(resolveDataDir(), platform, resolvedVersion, docSource),
              ),
              platform,
              tags: args.tags,
              semantic: semanticHits !== null,
              total: finalResults.length,
              results: finalResults,
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 通用工具 2：get_doc_summary ──────────────────────────────────────────

export const getDocSummarySchema = {
  name: "get_doc_summary",
  description: `获取文档页面的章节骨架与摘要，用于判断是否需要深入。
支持多平台（platform 参数）。

⚠️ platform 和 version 必须对应：
  - platform=forge 时，version 必须是 Forge 版本（如 1.20.1）
  - platform=fabric 时，version 必须是 Fabric 版本（如 1.20.1）`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
  }),
} as const;

export async function getDocSummary(
  args: z.infer<typeof getDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const store = getGenericStore(args.platform ?? "forge");
    const result = store.loadSummary(args.id, args.version);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return handleError(e);
  }
}

// ── 通用工具 3：get_doc_full ─────────────────────────────────────────────

export const getDocFullSchema = {
  name: "get_doc_full",
  description: `获取文档页面全文，支持多平台（platform 参数）。
highlight_key=true（默认）时，关键段落（🔴🟠🟢⭐）突出显示。

⚠️ platform 和 version 必须对应：
  - platform=forge 时，version 必须是 Forge 版本（如 1.20.1）
  - platform=fabric 时，version 必须是 Fabric 版本（如 1.20.1）`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
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
  try {
    const store = getGenericStore(args.platform ?? "forge");
    const result = await store.loadFullDoc(
      args.id,
      args.version,
      args.highlight_key ?? true,
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return handleError(e);
  }
}

// ── 通用工具 4：get_doc_related ─────────────────────────────────────────

export const getDocRelatedSchema = {
  name: "get_doc_related",
  description: `获取与指定文档页面相关的其他页面列表，支持多平台。
返回共享最多关键词的其他页面，按相关性降序排列。

⚠️ platform 和 version 必须对应：
  - platform=forge 时，version 必须是 Forge 版本（如 1.20.1）
  - platform=fabric 时，version 必须是 Fabric 版本（如 1.20.1）`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft 版本（必填）。请先用 list_doc_versions 查询可用版本。"),
    platform: z
      .enum(SEARCH_DOC_PLATFORMS)
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
    limit: z.number().optional().default(5).describe("最多返回条数，默认 5"),
  }),
} as const;

export async function getDocRelated(
  args: z.infer<typeof getDocRelatedSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const store = getGenericStore(args.platform ?? "forge");
    const result = store.getRelatedDocs(
      args.id,
      args.version,
      args.limit ?? 5,
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return handleError(e);
  }
}
