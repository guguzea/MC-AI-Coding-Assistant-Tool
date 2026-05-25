/**
 * Forge 文档 MCP 工具
 *
 * 提供五个递进式查询工具（Forge 专用）：
 *   list_forge_versions       — 版本列表
 *   search_forge_docs         — L0 索引搜索
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
import { createDocStore, type IDocStore, type Platform } from "../store.js";
import { resolveDataDir } from "../../utils/path.js";

const DATA_DIR = resolveDataDir("forge_1.20.1", "forge-docs");

const store = new ForgeDocStore(DATA_DIR);

// ── 通用工具 store 缓存（key = platform:DATA_DIR，支持数据目录变化时正确失效）────────────

const _genericStoreCache = new Map<string, IDocStore>();

// ── 不支持平台的 store 实现 ─────────────────────────────────────────────────────

/**
 * 当平台不支持时返回此 store，所有方法都抛出 DocNotFoundError(code: UNSUPPORTED_PLATFORM)。
 * 这样行为统一，调用方收到一致的错误 envelope。
 */
class UnsupportedPlatformStore implements IDocStore {
  private static readonly MSG = "平台不支持，当前仅支持 forge";
  private static readonly HINT = "请使用 platform: forge（当前唯一支持的平台）";

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
  if (platform !== "forge") {
    return new UnsupportedPlatformStore();
  }
  const cacheKey = `${platform}:${DATA_DIR}`;
  let s = _genericStoreCache.get(cacheKey);
  if (!s) {
    s = createDocStore(platform, DATA_DIR);
    _genericStoreCache.set(cacheKey, s);
  }
  return s;
}

// ── 工具 0：list_forge_versions（版本列表）──────────────────────────────────

export const listForgeVersionsSchema = {
  name: "list_forge_versions",
  description:
    "返回 data 目录下所有已加载的 Forge 文档版本列表（如 [\"1.20.1\"]）。" +
    "用于确认当前 MCP 服务支持哪些版本，无需通过报错来发现。",
  inputSchema: z.object({}),
} as const;

export async function listForgeVersions(): Promise<CallToolResult> {
  const versions = store.getAvailableVersions();
  return {
    content: [{ type: "text", text: JSON.stringify({ versions }, null, 2) }],
  };
}

// ── 工具 1：search_forge_docs（L0 搜索）────────────────────────────────

export const searchForgeDocsSchema = {
  name: "search_forge_docs",
  description: `Forge 官方文档搜索（L0 索引）。

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
  - version: Minecraft/Forge 版本，默认 1.20.1。
  - tags: 可选标签过滤（小写无连字符，如 registry, event, capability, networking, datagen, sides, client, server）。

另外另有 query_api 工具，可直接查询 Vanilla/Parchment 类的参数名和 javadoc，
适合在已知类名后精确查询某个方法的签名。`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（类名、概念或功能描述，支持 class:/event:/method: 前缀和 | OR 分组）"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
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
    const result = store.searchIndex(
      args.query,
      args.version ?? "1.20.1",
      args.tags,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              query: args.query,
              version: args.version ?? "1.20.1",
              tags: args.tags,
              total: result.length,
              results: result,
            },
            null,
            2,
          ),
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
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
  }),
} as const;

export async function getForgeDocSummary(
  args: z.infer<typeof getForgeDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const result = store.loadSummary(
      args.id,
      args.version ?? "1.20.1",
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
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
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
    const result = store.loadFullDoc(
      args.id,
      args.version ?? "1.20.1",
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
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
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
      args.version ?? "1.20.1",
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
  if (e instanceof VersionNotFoundError) {
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
      ? "请使用 platform: forge（当前唯一支持的平台）"
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
  description:
    "返回指定平台的可用文档版本列表。" +
    "platform 参数指定平台（forge/neoforge/fabric），默认 forge。",
  inputSchema: z.object({
    platform: z
      .enum(["forge", "neoforge", "fabric"])
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
  }),
} as const;

export async function listVersions(
  args: z.infer<typeof listVersionsSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const store = getGenericStore(args.platform ?? "forge");
    const versions = store.getAvailableVersions();
    return {
      content: [{ type: "text", text: JSON.stringify({ platform: args.platform ?? "forge", versions }, null, 2) }],
    };
  } catch (e) {
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
  4. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。
  5. ⚠️ 搜索失败时，使用精确术语（如类名、方法名、事件名）重新尝试。

增强功能：
  - OR 分组：query 支持 | 分隔（如 blockentity | ticker）
  - 前缀路由：class: 类名、event: 事件名、method: 方法名
  - 去停用词：the / and / of 等常见词不参与匹配

参数说明：
  - query: 搜索关键词
  - version: 版本，默认 1.20.1
  - platform: 平台，默认 forge
  - tags: 可选标签过滤`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（支持 | OR 分组、class:/event:/method: 前缀）"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
    platform: z
      .enum(["forge", "neoforge", "fabric"])
      .optional()
      .default("forge")
      .describe("平台，默认 forge"),
    tags: z.array(z.string()).optional().describe("标签过滤"),
  }),
} as const;

export async function searchDocs(
  args: z.infer<typeof searchDocsSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const store = getGenericStore(args.platform ?? "forge");
    const result = store.searchIndex(
      args.query,
      args.version ?? "1.20.1",
      args.tags,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              query: args.query,
              version: args.version ?? "1.20.1",
              platform: args.platform ?? "forge",
              tags: args.tags,
              total: result.length,
              results: result,
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
支持多平台（platform 参数）。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
    platform: z
      .enum(["forge", "neoforge", "fabric"])
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
    const result = store.loadSummary(args.id, args.version ?? "1.20.1");
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return handleError(e);
  }
}

// ── 通用工具 3：get_doc_full ─────────────────────────────────────────────

export const getDocFullSchema = {
  name: "get_doc_full",
  description: `获取文档页面全文，支持多平台（platform 参数）。
highlight_key=true（默认）时，关键段落（🔴🟠🟢⭐）突出显示。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
    platform: z
      .enum(["forge", "neoforge", "fabric"])
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
    const result = store.loadFullDoc(
      args.id,
      args.version ?? "1.20.1",
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
返回共享最多关键词的其他页面，按相关性降序排列。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_docs 返回的 results[].id"),
    version: z.string().optional().default("1.20.1").describe("版本，默认 1.20.1"),
    platform: z
      .enum(["forge", "neoforge", "fabric"])
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
      args.version ?? "1.20.1",
      args.limit ?? 5,
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return handleError(e);
  }
}
