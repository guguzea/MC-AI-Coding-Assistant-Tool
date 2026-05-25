/**
 * 多平台文档 MCP 工具统一入口
 *
 * 导出内容：
 * - Forge 专用工具别名（向后兼容）
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
} from "./forge/index.js";

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
