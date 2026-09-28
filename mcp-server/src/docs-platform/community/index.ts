/**
 * 社区知识库 MCP 工具
 *
 * 与官方 search_forge_docs 等分离：查 API 用官方文档；本工具偏发布/崩溃/软依赖/社区教程要点。
 */

import { z } from "zod";
import {
  getCommunityDocStore,
  COMMUNITY_SEARCH_DEFAULT_LIMIT,
  COMMUNITY_SEARCH_LIMIT_MAX,
} from "./store.js";

// 门（`scripts/assert-bedrock-genre-demote.mjs` ⑥）从 `dist/docs-platform/index.js` 取常量 ⇒ 这里必须转发。
export { COMMUNITY_SEARCH_DEFAULT_LIMIT, COMMUNITY_SEARCH_LIMIT_MAX };
import { limitClampWarning, limitWindowOf, poolFieldsOf } from "../search-utils.js";

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
  limit: z
    .number()
    .int()
    .positive()
    .max(COMMUNITY_SEARCH_LIMIT_MAX)
    .optional()
    .describe(`最多返回条数，默认 ${COMMUNITY_SEARCH_DEFAULT_LIMIT}；上界 ${COMMUNITY_SEARCH_LIMIT_MAX}（未传 limit 时载荷逐字不变）`),
});

export async function searchCommunityDocs(args: z.infer<typeof searchCommunityDocsSchema>) {
  const store = getCommunityDocStore();
  const filter = { sourceKind: args.sourceKind, tags: args.tags };
  // 窗口与 forge/fabric 那几面同源（`limitWindowOf`）：不传 limit ⇒ 载荷逐字不变；
  // 传了 ⇒ 带 `limitWindow{candidates,…}`，要的比池宽就按池截断并在 warning 里说破。
  // `L79` ②：池恒算（不只传了 limit 才算）—— 否则「不传 limit」这一路永远看不到池
  const poolSize = store.searchPool(args.query, filter).length;
  const limitWindow =
    args.limit === undefined
      ? undefined
      : limitWindowOf({
          requested: args.limit,
          candidates: poolSize,
          limitMax: COMMUNITY_SEARCH_LIMIT_MAX,
        });
  const results = store.search(args.query, { ...filter, limit: limitWindow?.resultLimit });
  const pool = poolFieldsOf(poolSize, results.length);
  const warns = [
    store.getIndexWarning(),
    limitClampWarning(limitWindow, "池 = 社区库条目按词打分的命中数，本面没有语义检索腿"),
  ].filter(Boolean);
  return {
    note:
      "社区库偏实务与中文教程要点；API/注册细节请用 search_forge_docs / search_fabric_docs / search_neoforge_docs。" +
      "注意：本面的 total 是本次返回条数，不是语料命中总数；截断态看无条件在载荷里的 totalPool（= 社区库按词打分的命中池）与 truncated（= total < totalPool）。limitWindow.candidates 在本面不随 limit 变，但仍受候选上限约束、不等于语料全量。",
    total: results.length,
    ...pool,
    results,
    ...(limitWindow ? { limitWindow } : {}),
    ...(warns.length ? { warning: warns.join(" ") } : {}),
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
