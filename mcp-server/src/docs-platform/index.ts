/**
 * 多平台文档 MCP 工具统一入口
 *
 * 导出内容：
 * - Forge 专用工具别名（向后兼容）
 * - Fabric 专用工具
 * - 通用平台无关工具
 * - Store 抽象层类型和工厂
 */

export {
  // Forge 专用别名（向后兼容）
  listForgeVersions, listForgeVersionsSchema,
  searchForgeDocs, searchForgeDocsSchema,
  getForgeDocSummary, getForgeDocSummarySchema,
  getForgeDocFull, getForgeDocFullSchema,
  getForgeDocRelated, getForgeDocRelatedSchema,
  // A2（2026-09-24）：按调用窗口常量（门与宿主都从这里取，杜绝第二份期望）
  FORGE_SEARCH_DEFAULT_LIMIT, FORGE_SEARCH_LIMIT_MAX,
  SEARCH_DOCS_DEFAULT_LIMIT, SEARCH_DOCS_LIMIT_MAX,
} from "./forge/index.js";

export {
  // Fabric 专用工具
  listFabricVersions, listFabricVersionsSchema,
  searchFabricDocs, searchFabricDocsSchema,
  getFabricDocSummary, getFabricDocSummarySchema,
  getFabricDocFull, getFabricDocFullSchema,
  getFabricDocRelated, getFabricDocRelatedSchema,
  FABRIC_SEARCH_DEFAULT_LIMIT, FABRIC_SEARCH_PORTING_CAP, FABRIC_SEARCH_LIMIT_MAX,
} from "./fabric/index.js";

export {
  // NeoForge 专用工具
  listNeoForgeVersions, listNeoForgeVersionsSchema,
  searchNeoForgeDocs, searchNeoForgeDocsSchema,
  getNeoForgeDocSummary, getNeoForgeDocSummarySchema,
  getNeoForgeDocFull, getNeoForgeDocFullSchema,
  getNeoForgeDocRelated, getNeoForgeDocRelatedSchema,
  NEOFORGE_SEARCH_DEFAULT_LIMIT, NEOFORGE_SEARCH_LIMIT_MAX,
} from "./neoforge/index.js";

export {
  // 通用工具
  listVersions, listVersionsSchema,
  searchDocs, searchDocsSchema,
  getDocSummary, getDocSummarySchema,
  getDocFull, getDocFullSchema,
  getDocRelated, getDocRelatedSchema,
} from "./forge/index.js";

export {
  // Store 抽象层
  createDocStore,
  type IDocStore,
  type Platform,
  type SearchResult,
  type SummaryResult,
  type FullDocResult,
  DocNotFoundError,
  VersionNotFoundError,
} from "./store.js";

export {
  listCommunitySources,
  listCommunitySourcesSchema,
  searchCommunityDocs,
  searchCommunityDocsSchema,
  getCommunityDocSummary,
  getCommunityDocSummarySchema,
  getCommunityDocFull,
  getCommunityDocFullSchema,
} from "./community/index.js";

export { CommunityDocNotFoundError } from "./community/store.js";
