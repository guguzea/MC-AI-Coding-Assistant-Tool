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
 *   fabric-docs  — 仅 github_raw_versioned / archive；无 versions/ 的旧档为空树
 *   fabric-wiki — fabricmc.net/wiki（现行站，不是历史快照）
 */

import * as z from "zod";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createFabricDocStore, DocNotFoundError, VersionNotFoundError, type SearchResult } from "./store.js";
import { resolveDataDir } from "../../utils/path.js";
import {
  asPlatformDataMissingResult,
  platformDataMissingResult,
  hasPlatformDocData,
} from "../platform-data.js";
import { semanticSearch } from "../semantic/search.js";
import { mergeSemanticResults, joinSearchWarnings, withDocsFallbackFields } from "../search-utils.js";
import { missingSemanticDbWarning } from "../semantic/status.js";
import { knowledgeVersion } from "../../platform-pack/catalog.js";
import {
  findFabricPorting,
  isFabricPortingId,
  searchFabricPortingPages,
} from "./extra-porting.js";

function getDataRoot(): string {
  return resolveDataDir();
}

function fabricDocsVersion(requested: string): { requested: string; resolved: string } {
  return { requested, resolved: knowledgeVersion("fabric", requested) };
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

export const FABRIC_WIKI_CURRENT_SITE_WARNING =
  "fabric-wiki 是现行 Wiki，不是该 Minecraft 版本的历史快照。禁止把 wiki 正文里的 Registries / BuiltInRegistries 当成 1.16.5/1.18.2 等旧档 API。";

export const FABRIC_WIKI_NETWORKING_PAYLOAD_WARNING =
  "现行 Wiki tutorial:networking 含 1.20.5 Payload 段，不是 1.20.4 API。PacketByteBufs / ServerPlayNetworking.send(Identifier, buf) 才是旧形态。禁止把 Payload 段当 1.20.4 官方页抄写。";

function isFabric26_2Line(v: string): boolean {
  return v === "26.2" || v.startsWith("26.2.");
}

function detectFabricDocsTopic(query: string): "networking" | "mixin" | "datagen" | null {
  const q = query.toLowerCase();
  if (/network/.test(q)) return "networking";
  if (/\bmixin/.test(q)) return "mixin";
  if (/datagen|data[- ]?gen|data generation/.test(q)) return "datagen";
  return null;
}

function hitMatchesFabricTopic(
  hit: { id?: string; label?: string; url?: string },
  topic: string,
): boolean {
  const blob = `${hit.id ?? ""} ${hit.label ?? ""} ${hit.url ?? ""}`.toLowerCase();
  if (topic === "networking") return /network/.test(blob);
  if (topic === "mixin") return /mixin/.test(blob);
  if (topic === "datagen") return /data-generation|datagen|data generation/.test(blob);
  return true;
}

function fabricPageIdVersion(id: string): string | undefined {
  return id.match(/^(\d+(?:\.\d+)*)\//)?.[1];
}

function annotateFabricGetResult(
  requested: string,
  id: string,
  source: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const wiki = source === "fabric-wiki";
  const idVer = fabricPageIdVersion(id);
  const neighbor = Boolean(idVer && idVer !== requested);
  if (!wiki && !neighbor) return payload;
  return withDocsFallbackFields({
    ...payload,
    version: requested,
    requestedVersion: requested,
    resolvedVersion: wiki ? "fabric-wiki" : idVer,
    versionFallback: neighbor,
    wikiFallback: wiki,
    sourceUsed: wiki ? "fabric-wiki" : source,
    warning: joinSearchWarnings(
      typeof payload.warning === "string" ? payload.warning : undefined,
      wiki ? FABRIC_WIKI_CURRENT_SITE_WARNING : undefined,
    ),
  });
}

function fabricDocsIndexEmpty(version: string): boolean {
  const p = join(getDataRoot(), `fabric_${version}`, "fabric-docs", version, "index-l0.json");
  if (!existsSync(p)) return true;
  try {
    const data = JSON.parse(readFileSync(p, "utf8")) as unknown;
    return !Array.isArray(data) || data.length === 0;
  } catch {
    return true;
  }
}

function searchSourceOrEmpty(
  version: string,
  source: "fabric-docs" | "fabric-wiki",
  query: string,
  tags?: string[],
): { results: SearchResult[]; requestedVersion: string; resolvedVersion: string; versionFallback: boolean } {
  try {
    return getStore(version, source).searchIndexDetailed(query, version, tags);
  } catch (e) {
    if (e instanceof VersionNotFoundError) {
      return {
        results: [],
        requestedVersion: version,
        resolvedVersion: version,
        versionFallback: false,
      };
    }
    throw e;
  }
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
    const { query, tags, source } = args;
    const { requested, resolved: version } = fabricDocsVersion(args.version);

    const available = getStore(version, "fabric-docs").getAvailableVersions();
    if (!available.includes(version)) {
      if (isFabric26_2Line(requested)) {
        const portingHits = searchFabricPortingPages(query, version);
        const extraWarn =
          "无 fabric_26.2 主文档树；26.2 移植页是独立旁路（source=porting-extra），26.1.2 develop_porting_index 是到 26.1。";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                withDocsFallbackFields({
                  ok: true,
                  query,
                  version: requested,
                  requestedVersion: requested,
                  resolvedVersion: version,
                  versionFallback: false,
                  fallback: true,
                  platform: "fabric",
                  source: "porting-extra",
                  sourceUsed: "porting-extra",
                  warning: extraWarn,
                  total: portingHits.length,
                  results: portingHits,
                }),
                null,
                2,
              ),
            },
          ],
        };
      }
      throw new VersionNotFoundError(version, available);
    }

    let results: ReturnType<typeof getStore.prototype.searchIndex>;
    const resolvedSource = source ?? "fabric-docs";
    const docsEmpty = fabricDocsIndexEmpty(version);
    let usedWikiFallback = false;

    if (resolvedSource === "all") {
      const docs = searchSourceOrEmpty(version, "fabric-docs", query, tags);
      const wiki = searchSourceOrEmpty(version, "fabric-wiki", query, tags);
      const merged = [
        ...docs.results.map((r) => ({ ...r, _source: "fabric-docs" as const })),
        ...wiki.results.map((r) => ({ ...r, _source: "fabric-wiki" as const })),
      ];
      const order: Record<string, number> = { "⭐": 0, "🟡": 1, "🟢": 2 };
      merged.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
      results = merged.slice(0, 10) as typeof docs.results;
    } else if (resolvedSource === "fabric-docs" && docsEmpty) {
      const wiki = searchSourceOrEmpty(version, "fabric-wiki", query, tags);
      results = wiki.results.map((r) => ({ ...r, _source: "fabric-wiki" as const })) as typeof wiki.results;
      usedWikiFallback = true;
    } else {
      const detailed = searchSourceOrEmpty(version, resolvedSource, query, tags);
      results = detailed.results;
    }

    const sources = resolvedSource === "all"
      ? (docsEmpty ? ["fabric-wiki"] : ["fabric-docs", "fabric-wiki"])
      : usedWikiFallback
        ? ["fabric-wiki"]
        : [resolvedSource];
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

    const topic = detectFabricDocsTopic(String(args.query ?? ""));
    let wikiTopicFallback = false;
    if (topic && resolvedSource === "fabric-docs" && !docsEmpty) {
      const asHits = results as Array<{ id: string; label?: string; url?: string }>;
      const onTopic = asHits.filter((h) => hitMatchesFabricTopic(h, topic));
      if (onTopic.length === 0) {
        const wiki = searchSourceOrEmpty(version, "fabric-wiki", query, tags);
        const wikiOnTopic = wiki.results.filter((h) => hitMatchesFabricTopic(h, topic));
        if (wikiOnTopic.length) {
          usedWikiFallback = true;
          wikiTopicFallback = true;
          results = wikiOnTopic.map((r) => ({ ...r, _source: "fabric-wiki" as const })) as typeof results;
        }
        // wiki 为空时保留原 fabric-docs 命中
      }
    }

    const portingHits = searchFabricPortingPages(query, version);
    if (portingHits.length) {
      const seen = new Set((results as Array<{ id: string }>).map((r) => r.id));
      results = [...portingHits.filter((p) => !seen.has(p.id)), ...(results as object[])].slice(
        0,
        12,
      ) as typeof results;
    }

    const extraWarn =
      requested === "26.2" || requested.startsWith("26.2")
        ? "无 fabric_26.2 主文档树；26.2 移植页是独立旁路（source=porting-extra），26.1.2 develop_porting_index 是到 26.1。"
        : undefined;
    const wikiInvolved = resolvedSource === "fabric-wiki" || resolvedSource === "all" || usedWikiFallback;
    const emptyDocsNote = docsEmpty
      ? "本档 fabric-docs 无版本化页（已清除现行站污染）。index 文件存在但 [] ≠ 可搜官方树；search_fabric_docs 默认改走 wiki。不要把 BuiltInRegistries 当旧档 API。"
      : undefined;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            withDocsFallbackFields({
              ok: true,
              query,
              version: requested,
              requestedVersion: requested,
              resolvedVersion: usedWikiFallback ? "fabric-wiki" : version,
              versionFallback: requested !== version,
              wikiFallback: usedWikiFallback,
              platform: "fabric",
              source: resolvedSource,
              sourceUsed: usedWikiFallback ? "fabric-wiki" : resolvedSource,
              fabricDocsEmpty: docsEmpty || undefined,
              wikiIsCurrentSite: wikiInvolved || undefined,
              tags,
              semantic: semanticRanked,
              warning: joinSearchWarnings(
                missingSemanticDbWarning(semanticMissing),
                extraWarn,
                emptyDocsNote,
                wikiInvolved ? FABRIC_WIKI_CURRENT_SITE_WARNING : undefined,
                wikiTopicFallback && topic === "networking"
                  ? FABRIC_WIKI_NETWORKING_PAYLOAD_WARNING
                  : undefined,
                (results as unknown as Array<unknown>).length === 0 && /[\u4e00-\u9fff]/.test(String(args.query ?? ""))
                  ? "中文查询命中为空：文档正文为英文，改用英文关键词（如 register item）或按 id 直接取 get_fabric_doc_full。"
                  : undefined,
              ),
              total: (results as unknown as Array<unknown>).length,
              results,
            }),
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
    if (isFabricPortingId(args.id)) {
      const page = findFabricPorting(args.id);
      if (!page) {
        return handleError(new DocNotFoundError(args.id, args.version));
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              ok: true,
              id: page.id,
              version: page.to,
              label: page.title,
              url: page.url,
              firstParagraph: page.body.split(/\n/).find((l) => l.trim() && !l.startsWith("#")) ?? "",
              source: "porting-extra",
              _source: "porting-extra",
            }),
          },
        ],
      };
    }
    const resolvedSource = args.source ?? "fabric-docs";
    const version = fabricDocsVersion(args.version).resolved;
    const result = getStore(version, resolvedSource).loadSummary(
      args.id,
      version,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            annotateFabricGetResult(args.version, args.id, resolvedSource, {
              ...result,
              _source: resolvedSource,
              ...(resolvedSource === "fabric-wiki"
                ? { wikiIsCurrentSite: true, warning: FABRIC_WIKI_CURRENT_SITE_WARNING }
                : {}),
            }),
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
    if (isFabricPortingId(args.id)) {
      const page = findFabricPorting(args.id);
      if (!page) {
        return handleError(new DocNotFoundError(args.id, args.version));
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              ok: true,
              content: page.body,
              meta: { id: page.id, version: page.to, label: page.title, url: page.url },
              source: "porting-extra",
              _source: "porting-extra",
            }),
          },
        ],
      };
    }
    const resolvedSource = args.source ?? "fabric-docs";
    const version = fabricDocsVersion(args.version).resolved;
    const result = await getStore(version, resolvedSource).loadFullDoc(
      args.id,
      version,
      args.highlight_key ?? true,
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            annotateFabricGetResult(args.version, args.id, resolvedSource, {
              ...result,
              _source: resolvedSource,
              ...(resolvedSource === "fabric-wiki"
                ? { wikiIsCurrentSite: true, warning: FABRIC_WIKI_CURRENT_SITE_WARNING }
                : {}),
            }),
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
    const version = fabricDocsVersion(args.version).resolved;
    const result = getStore(version, resolvedSource).getRelatedDocs(
      args.id,
      version,
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

