/**
 * Fabric 文档 MCP 工具
 *
 * 提供四个递进式查询工具（Fabric 专用）：
 *   list_fabric_versions       — 版本列表
 *   search_fabric_docs         — hybrid 搜索（L0 + 语义 RRF）
 *   get_fabric_doc_summary    — L1 摘要
 *   get_fabric_doc_full       — L2/L2+ 全文
 *   get_fabric_doc_related    — 相关文档
 *
 * 支持两个数据源：
 *   fabric-docs  — FabricMC/fabric-docs GitHub（版本无关，main 分支）
 *   fabric-wiki — fabricmc.net/wiki（DokuWiki 教程页）
 */

import * as z from "zod";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createFabricDocStore, DocNotFoundError, VersionNotFoundError } from "./store.js";
import { resolveDataDir } from "../../utils/path.js";
import {
  asPlatformDataMissingResult,
  platformDataMissingResult,
  hasPlatformDocData,
} from "../platform-data.js";
import { semanticSearch } from "../semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings } from "../search-utils.js";
import { missingSemanticDbWarning } from "../semantic/status.js";

function getDataRoot(): string {
  return resolveDataDir();
}

// 按 source 缓存 store 实例（避免重复创建；key 含 dataRoot）
const _stores = new Map<string, ReturnType<typeof createFabricDocStore>>();

function getStore(version: string, source: string) {
  const root = getDataRoot();
  const key = `${root}:${version}:${source}`;
  if (!_stores.has(key)) {
    _stores.set(key, createFabricDocStore(version, source, root));
  }
  return _stores.get(key)!;
}

// ── 统一错误处理 ──────────────────────────────────────────────────────────────────

function handleError(e: unknown): CallToolResult {
  const miss = asPlatformDataMissingResult(e);
  if (miss) return miss;
  if (e instanceof VersionNotFoundError) {
    if (e.availableVersions.length === 0) return platformDataMissingResult("fabric");
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
      ? "请使用 platform: fabric"
      : "请使用 search_fabric_docs 查询正确的页面 ID";
    const message = e.code === "UNSUPPORTED_PLATFORM"
      ? e.version
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

// ── 工具 0：list_fabric_versions ──────────────────────────────────────────────────

export const listFabricVersionsSchema = {
  name: "list_fabric_versions",
  description:
    "返回 data 目录下所有已加载的 Fabric 文档版本列表（如 [\"1.20.1\"]）。" +
    "用于确认当前 MCP 服务支持哪些版本，无需通过报错来发现。",
  inputSchema: z.object({}),
} as const;

export async function listFabricVersions(): Promise<CallToolResult> {
  const ROOT_DIR = getDataRoot();
  if (!hasPlatformDocData("fabric", ROOT_DIR)) {
    return platformDataMissingResult("fabric");
  }
  // 动态扫描 data 目录下所有 fabric_<version> 子目录，且须有 index-l0.json
  const versionSet = new Set<string>();
  if (existsSync(ROOT_DIR)) {
    try {
      for (const entry of readdirSync(ROOT_DIR, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name.startsWith("fabric_")) {
          const ver = entry.name.replace(/^fabric_/, "");
          const docsL0 = join(ROOT_DIR, entry.name, "fabric-docs", ver, "index-l0.json");
          const wikiL0 = join(ROOT_DIR, entry.name, "fabric-wiki", ver, "index-l0.json");
          if (existsSync(docsL0) || existsSync(wikiL0)) versionSet.add(ver);
        }
      }
    } catch { /* ignore */ }
  }
  const allVersions = [...versionSet].sort();
  if (allVersions.length === 0) return platformDataMissingResult("fabric");
  return {
    content: [{ type: "text", text: JSON.stringify({ ok: true, platform: "fabric", versions: allVersions }, null, 2) }],
  };
}

export const searchFabricDocsSchema = {
  name: "search_fabric_docs",
  description: `Fabric 官方文档搜索（hybrid：L0 关键词 + 语义检索，RRF 融合；无语义库时回退纯 L0）。

使用方法：
  1. 先调用 search_fabric_docs(query) 找出相关页面。
  2. 对于可能相关的页面，调用 get_fabric_doc_summary 获取摘要。
  3. 仅当摘要显示该页肯定包含所需细节时，才调用 get_fabric_doc_full。
  4. ⚡ 对于注册(Registry.register)、事件(Callback)、Mixin、Networking 等核心课题，
     建议直接调用 get_fabric_doc_full 并启用 highlight_key=true，跳过 summary。
  5. 永远不要一次性加载超过 2 个 full page，避免上下文溢出。
  6. ⚠️ 搜索失败时，使用精确术语（如类名、方法名、事件名）重新尝试，不要用长自然语言描述。

增强功能：
  - OR 分组：query 支持 | 分隔（如 registry | identifier），匹配任一词即返回
  - 前缀路由：class: 类名、event: 事件名、method: 方法名，可精确语义搜索
  - 去停用词：the / and / of 等常见词不参与匹配，减少噪音

参数说明：
  - query: 搜索关键词，可以是类名、概念或功能描述。
  - version: Minecraft/Fabric 版本（必填）。请先用 list_fabric_versions 查询可用版本。
  - tags: 可选标签过滤（小写无连字符，如 registry, event, networking, datagen, mixin, command）。
  - source: 数据源，fabric-docs（默认）、fabric-wiki 或 all（合并两个源）。
    fabric-wiki 包含入门级教程（tutorial_blocks / tutorial_items 等），适合新手。

Fabric 使用 Identifier 作为资源定位符，Registry.register() 注册物品/方块等，
与 Forge 的 DeferredRegister 完全不同。`,
  inputSchema: z.object({
    query: z.string().describe("搜索关键词（类名、概念或功能描述，支持 class:/event:/method: 前缀和 | OR 分组）"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Fabric 版本（必填）。请先用 list_fabric_versions 查询可用版本。"),
    tags: z
      .array(z.string())
      .optional()
      .describe("标签过滤（小写无连字符，如 registry, event, networking, datagen, mixin）"),
    source: z
      .enum(["fabric-docs", "fabric-wiki", "all"])
      .optional()
      .default("fabric-docs")
      .describe("数据源，默认为 fabric-docs；all 合并两个源的结果"),
  }),
} as const;

export async function searchFabricDocs(
  args: z.infer<typeof searchFabricDocsSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    if (!hasPlatformDocData("fabric", getDataRoot())) {
      return platformDataMissingResult("fabric");
    }
    const { query, version, tags, source } = args;

    let results: ReturnType<typeof getStore.prototype.searchIndex>;

    if (source === "all") {
      // 合并两个数据源
      const docsStore = getStore(version, "fabric-docs");
      const wikiStore = getStore(version, "fabric-wiki");
      const docs = docsStore.searchIndexDetailed(query, version, tags);
      const wiki = wikiStore.searchIndexDetailed(query, version, tags);
      const merged = [
        ...docs.results.map((r) => ({ ...r, _source: "fabric-docs" as const })),
        ...wiki.results.map((r) => ({ ...r, _source: "fabric-wiki" as const })),
      ];
      const order: Record<string, number> = { "⭐": 0, "🟡": 1, "🟢": 2 };
      merged.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
      results = merged.slice(0, 10) as typeof docs.results;
    } else {
      const detailed = getStore(version, source).searchIndexDetailed(query, version, tags);
      results = detailed.results;
    }

    // 语义检索（按 source 查询对应语义库；all 时两源各自查询）；无语义库 → null，保持纯 L0
    // 注意：source 未显式传入时为 undefined（直接函数调用绕过 zod default），需回退 "fabric-docs"
    const resolvedSource = source ?? "fabric-docs";
    const sources = resolvedSource === "all" ? ["fabric-docs", "fabric-wiki"] : [resolvedSource];
    let semanticRanked = false;
    let semanticMissing = false;
    const semanticList: NonNullable<Awaited<ReturnType<typeof semanticSearch>>> = [];
    for (const src of sources) {
      const hits = await semanticSearch(query, "fabric", version, src, getDataRoot());
      if (hits === null) semanticMissing = true;
      else semanticRanked = true;
      if (hits) semanticList.push(...hits);
    }
    if (semanticRanked) {
      results = mergeSemanticResults(results, semanticList, {
        tags,
        limit: 10,
        version,
      }) as typeof results;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              query,
              version,
              resolvedVersion: version,
              versionFallback: false,
              source,
              tags,
              semantic: semanticRanked,
              warning: joinSearchWarnings(missingSemanticDbWarning(semanticMissing)),
              total: (results as unknown as Array<unknown>).length,
              results,
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

// ── 工具 2：get_fabric_doc_summary（L1 摘要）────────────────────────────────────

export const getFabricDocSummarySchema = {
  name: "get_fabric_doc_summary",
  description: `获取 Fabric 文档页面的章节骨架与摘要，用于判断是否需要深入。

适用场景：
  - 用户需要了解某个概念的大致内容
  - AI 需要判断该页与当前代码问题的相关性

返回内容：每个 h2 章节的标题 + 150-200 字摘要 + 首段概述。

参数说明：
  - id: 页面 ID，来自 search_fabric_docs 返回的 results[].id
  - version: Minecraft/Fabric 版本（必填）
  - source: 数据源，fabric-docs 或 fabric-wiki。
    fabric-wiki 包含入门级教程（tutorial_blocks / tutorial_items 等），适合新手；
    fabric-docs 是官方参考文档。`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_fabric_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Fabric 版本（必填）。请先用 list_fabric_versions 查询可用版本。"),
    source: z
      .enum(["fabric-docs", "fabric-wiki"])
      .optional()
      .default("fabric-docs")
      .describe("数据源，默认 fabric-docs"),
  }),
} as const;

export async function getFabricDocSummary(
  args: z.infer<typeof getFabricDocSummarySchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const resolvedSource = args.source ?? "fabric-docs";
    const result = getStore(args.version, resolvedSource).loadSummary(
      args.id,
      args.version,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ...result, _source: resolvedSource }, null, 2),
        },
      ],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 工具 3：get_fabric_doc_full（L2/L2+ 全文）──────────────────────────────────

export const getFabricDocFullSchema = {
  name: "get_fabric_doc_full",
  description: `获取 Fabric 文档页面全文。

适用场景：
  - 用户明确需要某个 API 的详细工作原理
  - 需要查看完整事件列表、注册完整步骤等

⚡ 重要：对于注册(Registry.register)、事件(Callback)、网络(Networking)、数据生成(Datagen)、
Mixin 等核心课题，建议直接调用 get_fabric_doc_full 并启用 highlight_key=true。

highlight_key=true 时，关键要点（🔴新手必读、🟠常见错误、🟢示例代码）会突出显示在开头，
  若关键摘要已够用则不必细读全文。

参数说明：
  - id: 页面 ID，来自 search_fabric_docs 返回的 results[].id
  - version: Minecraft/Fabric 版本（必填）
  - highlight_key: 是否提取关键段落，默认 true
  - source: 数据源，fabric-docs（默认）或 fabric-wiki`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_fabric_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Fabric 版本（必填）。请先用 list_fabric_versions 查询可用版本。"),
    highlight_key: z
      .boolean()
      .optional()
      .default(true)
      .describe("true 时提取并突出关键段落（🔴🟠🟢⭐），默认 true"),
    source: z
      .enum(["fabric-docs", "fabric-wiki"])
      .optional()
      .default("fabric-docs")
      .describe("数据源，默认 fabric-docs"),
  }),
} as const;

export async function getFabricDocFull(
  args: z.infer<typeof getFabricDocFullSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const resolvedSource = args.source ?? "fabric-docs";
    const result = await getStore(args.version, resolvedSource).loadFullDoc(
      args.id,
      args.version,
      args.highlight_key ?? true,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ...result, _source: resolvedSource }, null, 2),
        },
      ],
    };
  } catch (e) {
    return handleError(e);
  }
}

// ── 工具 4：get_fabric_doc_related（相关文档）────────────────────────────────────

export const getFabricDocRelatedSchema = {
  name: "get_fabric_doc_related",
  description: `获取与指定 Fabric 文档页面相关的其他页面列表。

适用于：想了解某个主题，但不知道还需要查阅哪些关联文档时。
返回与目标页面共享最多 section 关键词的其他页面，按相关性降序排列。

参数说明：
  - id: 页面 ID，来自 search_fabric_docs 返回的 results[].id
  - version: Minecraft/Fabric 版本（必填）
  - source: 数据源。fabric-wiki 的 tutorial_* 页面形成线性学习路径，适合用 related 找到相邻步骤。
  - limit: 最多返回条数，默认 5`,
  inputSchema: z.object({
    id: z.string().describe("页面 ID，来自 search_fabric_docs 返回的 results[].id"),
    version: z.string().min(1, "版本号不能为空").describe("Minecraft/Fabric 版本（必填）。请先用 list_fabric_versions 查询可用版本。"),
    source: z
      .enum(["fabric-docs", "fabric-wiki"])
      .optional()
      .default("fabric-docs")
      .describe("数据源，默认 fabric-docs"),
    limit: z
      .number()
      .optional()
      .default(5)
      .describe("最多返回条数，默认 5"),
  }),
} as const;

export async function getFabricDocRelated(
  args: z.infer<typeof getFabricDocRelatedSchema.inputSchema>,
): Promise<CallToolResult> {
  try {
    const resolvedSource = args.source ?? "fabric-docs";
    const result = getStore(args.version, resolvedSource).getRelatedDocs(
      args.id,
      args.version,
      args.limit ?? 5,
    );
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ results: result, _source: resolvedSource }, null, 2),
      }],
    };
  } catch (e) {
    return handleError(e);
  }
}

