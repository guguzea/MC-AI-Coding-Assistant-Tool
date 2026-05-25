/**
 * 跨平台 DocStore 工厂
 *
 * 扩展到新平台（如 neoforge/fabric）时的约定：
 * 1. 在 data/ 目录下创建对应数据目录，结构同 forge_1.20.1/
 * 2. 在 src/docs-platform/ 下创建 <platform>/ 子模块
 * 3. 实现 IDocStore 接口，创建对应的 <Platform>DocStore 类
 * 4. 在 createDocStore() 中添加新平台的 case 分支
 * 5. 对外工具名统一使用通用命名（search_docs / get_doc_summary 等），
 *    而非平台专用命名（search_forge_docs），避免认知分裂
 *
 * 本文件适用于 "type": "module" 项目。IDocStore 接口定义如下：
 *
 * interface IDocStore {
 *   getAvailableVersions(): string[];
 *   searchIndex(query: string, version: string, tags?: string[]): SearchResult[];
 *   loadSummary(pageId: string, version: string): SummaryResult;
 *   loadFullDoc(pageId: string, version: string, highlightKey?: boolean): FullDocResult;
 *   getRelatedDocs(pageId: string, version: string, limit?: number): SearchResult[];
 * }
 */

import { join } from "path";

// ── 类型 re-export ──────────────────────────────────────────────────────────
export type {
  SearchResult,
  SummaryResult,
  FullDocResult,
  KeyBlock,
  SearchLogEntry,
} from "./forge/store.js";
export { DocNotFoundError, VersionNotFoundError } from "./forge/store.js";
import { DocNotFoundError } from "./forge/store.js";

// ── 接口定义 ────────────────────────────────────────────────────────────────

import type {
  SearchResult,
  SummaryResult,
  FullDocResult,
} from "./forge/store.js";

/** 文档存储接口（平台无关） */
export interface IDocStore {
  /** 返回该平台所有可用版本列表 */
  getAvailableVersions(): string[];
  /** 搜索文档索引（L0） */
  searchIndex(query: string, version: string, tags?: string[]): SearchResult[];
  /** 加载文档摘要（L1） */
  loadSummary(pageId: string, version: string): SummaryResult;
  /** 加载文档全文（L2/L2+） */
  loadFullDoc(pageId: string, version: string, highlightKey?: boolean): FullDocResult;
  /** 获取相关文档 */
  getRelatedDocs(pageId: string, version: string, limit?: number): SearchResult[];
}

// ── 数据路径解析（兼容 import.meta.url = CWD 的环境）─────────────────────
// import.meta.url 在 Node ESM 中有时指向 CWD 而非脚本文件本身，
// 导致 fileURLToPath(import.meta.url) 不准确。
// 因此接受外部传入 dataRoot 参数，由调用方（forge/index.js）从 __dirname 推导。

// ── 平台类型 ────────────────────────────────────────────────────────────────

export type Platform = "forge" | "neoforge" | "fabric";

/** 各平台在 data/ 下的子目录（不含版本号，版本号由 store 内部按 version 参数拼接） */
const PLATFORM_SUBDIR: Record<Platform, string> = {
  forge:    "forge_1.20.1",
  neoforge: "neoforge_1.20.4",
  fabric:   "fabric_1.20.1",
};

// ── 工厂 ────────────────────────────────────────────────────────────────────

import { ForgeDocStore } from "./forge/store.js";

class UnsupportedPlatformStore implements IDocStore {
  private static readonly MSG = "平台不支持，当前仅支持 forge";
  private static readonly HINT = "请使用 platform: forge（当前唯一支持的平台）";

  getAvailableVersions(): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  searchIndex(_query: string, _version: string, _tags?: string[]): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  loadSummary(_pageId: string, _version: string): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  loadFullDoc(_pageId: string, _version: string, _highlightKey?: boolean): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
  getRelatedDocs(_pageId: string, _version: string, _limit?: number): never {
    throw new DocNotFoundError(UnsupportedPlatformStore.HINT, UnsupportedPlatformStore.MSG, "UNSUPPORTED_PLATFORM");
  }
}

/**
 * 创建指定平台的文档存储实例。
 * @param platform 目标平台
 * @param dataDir 完整的文档数据目录路径（不含版本子目录，store 内部会拼接）
 *                 示例（forge/index.ts）：join(__dirname, "..", "..", "..", "..", "data", "forge_1.20.1", "forge-docs")
 */
export function createDocStore(platform: Platform, dataDir: string): IDocStore {
  if (platform === "forge") {
    return new ForgeDocStore(dataDir);
  }
  return new UnsupportedPlatformStore();
}
