/**
 * 社区知识库 MCP 工具
 *
 * 与官方 search_forge_docs 等分离：查 API 用官方文档；本工具偏发布/崩溃/软依赖/社区教程要点。
 */

import { z } from "zod";
import { getCommunityDocStore } from "./store.js";

export const listCommunitySourcesSchema = z.object({});

export async function listCommunitySources() {
  return getCommunityDocStore().listSources();
}

export const searchCommunityDocsSchema = z.object({
  query: z.string().describe("搜索关键词，如 发布、软依赖、崩溃、DeferredRegister（空字符串不返回结果，请用 list_community_sources 浏览）"),
  sourceKind: z
    .enum(["permitted", "authored", "links"])
    .optional()
    .describe("限定来源：permitted=许可帖提炼，authored=自写，links=仅外链"),
  tags: z.array(z.string()).optional().describe("标签过滤，需全部匹配"),
  limit: z.number().int().positive().max(50).optional().describe("最多返回条数，默认 20"),
});

export async function searchCommunityDocs(args: z.infer<typeof searchCommunityDocsSchema>) {
  const results = getCommunityDocStore().search(args.query, {
    sourceKind: args.sourceKind,
    tags: args.tags,
    limit: args.limit,
  });
  return {
    note: "社区库偏实务与中文教程要点；API/注册细节请用 search_forge_docs / search_fabric_docs / search_neoforge_docs。",
    total: results.length,
    results,
  };
}

export const getCommunityDocSummarySchema = z.object({
  id: z.string().describe("来自 search_community_docs 的 id"),
});

export async function getCommunityDocSummary(args: z.infer<typeof getCommunityDocSummarySchema>) {
  return getCommunityDocStore().getSummary(args.id);
}

export const getCommunityDocFullSchema = z.object({
  id: z.string().describe("来自 search_community_docs 的 id"),
});

export async function getCommunityDocFull(args: z.infer<typeof getCommunityDocFullSchema>) {
  return getCommunityDocStore().getFull(args.id);
}
