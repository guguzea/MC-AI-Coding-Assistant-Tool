/**
 * NeoForge 文档 MCP 工具
 *
 * 提供五个递进式查询工具（NeoForge 专用）：
 *   list_neoforge_versions       — 版本列表
 *   search_neoforge_docs         — L0 索引搜索
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
import type { IDocStore } from "../store.js";

const DATA_ROOT = resolveDataDir();

const store = new NeoForgeDocStore(DATA_ROOT);

// ── 通用工具 store 缓存 ─────────────────────────────────────────────────────

const _genericStoreCache = new Map<string, IDocStore>();

function getGenericStore(): IDocStore {
  const cacheKey = `neoforge:${DATA_ROOT}`;
  if (!_genericStoreCache.has(cacheKey)) {
    _genericStoreCache.set(cacheKey, new NeoForgeDocStore(DATA_ROOT));
  }
  return _genericStoreCache.get(cacheKey)!;
}

// ── 错误处理 ──────────────────────────────────────────────────────────────

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
    "26.2 暂未收录，使用 26.1 数据。",
  inputSchema: z.object({}),
} as const;

export async function listNeoForgeVersions(): Promise<CallToolResult> {
  try {
    const versions = store.getAvailableVersions();
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ ok: true, versions }, null, 2),
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
    "搜索 NeoForge 官方文档（L0 索引搜索）。" +
    "适用于：需要了解 NeoForge 特有功能（如 DeferredRegister、Data Components、Payload 网络）的官方说明时。" +
    "返回相关页面 ID 列表，每个结果包含标题、标签和相关性评分。" +
    "增强功能：支持标签过滤；自动去除 the/and/of 等停用词；按相关性排序。",
  inputSchema: z.object({
    query: z.string().describe("搜索查询关键词"),
    version: z.string().optional().default("26.1").describe("NeoForge 版本，默认 26.1"),
    tags: z.array(z.string()).optional().describe("标签过滤（如 [\"deferredregister\", \"networking\"]）"),
  }),
} as const;

export async function searchNeoForgeDocs(args: {
  query: string;
  version?: string;
  tags?: string[];
}): Promise<CallToolResult> {
  try {
    const s = getGenericStore() as NeoForgeDocStore;
    const version = args.version ?? "26.1";
    const detailed = s.searchIndexDetailed(args.query, version, args.tags);
    const forgeCompatible = version === "1.20.1" || detailed.resolvedVersion === "1.20.1";
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: true,
          query: args.query,
          version,
          resolvedVersion: detailed.resolvedVersion,
          versionFallback: detailed.versionFallback,
          warning: detailed.versionFallback
            ? `请求版本 ${version} 已映射到 ${detailed.resolvedVersion}`
            : undefined,
          forgeCompatible: forgeCompatible || undefined,
          sourceNote: forgeCompatible
            ? "NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）"
            : undefined,
          total: detailed.results.length,
          results: detailed.results,
        }, null, 2),
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
    version: z.string().optional().default("26.1").describe("NeoForge 版本，默认 26.1"),
  }),
} as const;

export async function getNeoForgeDocSummary(args: {
  id: string;
  version?: string;
}): Promise<CallToolResult> {
  try {
    const s = getGenericStore();
    const summary = s.loadSummary(args.id, args.version ?? "26.1");
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ ok: true, ...summary }, null, 2),
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
    version: z.string().optional().default("26.1").describe("NeoForge 版本，默认 26.1"),
    highlight_key: z.boolean().optional().default(true).describe("是否突出显示关键段落"),
  }),
} as const;

export async function getNeoForgeDocFull(args: {
  id: string;
  version?: string;
  highlight_key?: boolean;
}): Promise<CallToolResult> {
  try {
    const s = getGenericStore();
    const result = await s.loadFullDoc(args.id, args.version ?? "26.1", args.highlight_key ?? true);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ ok: true, ...result }, null, 2),
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
    version: z.string().optional().default("26.1").describe("NeoForge 版本，默认 26.1"),
    limit: z.number().optional().default(5).describe("返回数量，默认 5"),
  }),
} as const;

export async function getNeoForgeDocRelated(args: {
  id: string;
  version?: string;
  limit?: number;
}): Promise<CallToolResult> {
  try {
    const s = getGenericStore();
    const results = s.getRelatedDocs(args.id, args.version ?? "26.1", args.limit ?? 5);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ ok: true, id: args.id, version: args.version, results }, null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}
