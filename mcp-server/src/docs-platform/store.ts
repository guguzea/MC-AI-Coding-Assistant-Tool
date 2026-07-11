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
import { existsSync, readdirSync, readFileSync } from "fs";

import { resolveDataDir } from "../utils/path.js";

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
  loadFullDoc(pageId: string, version: string, highlightKey?: boolean): Promise<FullDocResult>;
  /** 获取相关文档 */
  getRelatedDocs(pageId: string, version: string, limit?: number): SearchResult[];
}

// ── 数据路径解析（兼容 import.meta.url = CWD 的环境）─────────────────────
// import.meta.url 在 Node ESM 中有时指向 CWD 而非脚本文件本身，
// 导致 fileURLToPath(import.meta.url) 不准确。
// 因此接受外部传入 dataRoot 参数，由调用方（forge/index.js）从 __dirname 推导。

// ── 平台类型 ────────────────────────────────────────────────────────────────

export type Platform = "forge" | "neoforge" | "fabric";

/** 各平台已知版本（按优先级排序，新增版本时维护此数组） */
const KNOWN_VERSIONS: Record<Platform, string[]> = {
  forge:    [
    // 优先使用标准 MkDocs 数据；仅在没有标准数据时回退到 Javadoc 存档。
    "1.20.4", "1.20.1", "1.19.4", "1.18.2", "1.17.1", "1.16.5", "1.15.2", "1.14.4",
    "1.12.2", "1.11.2", "1.10.2", "1.9.4", "1.8.9", "1.7.10",
  ],
  neoforge: [
    // 主文档版本（按优先级排序）
    "26.1", "1.21.11", "1.21.10", "1.21.8", "1.21.5", "1.21.3", "1.21.1", "1.20.6", "1.20.4",
    // Forge 兼容版本（复用 Forge 1.20.1 数据）
    "1.20.1",
  ],
  fabric:   ["1.20.1", "1.21.1"],
};

/** 各平台文档子目录名（version 前的固定前缀） */
const PLATFORM_DOC_SUBDIR: Record<Platform, string> = {
  forge:    "forge-docs",
  neoforge: "neoforge-docs",
  fabric:   "fabric-docs",
};

/** Forge 1.7.10–1.12.2 使用 forge_javadoc 而非 forge-docs */
const JAVADOC_VERSIONS = new Set(["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2"]);

/** 动态解析指定平台的文档数据目录。
 *
 *  1. 按已知版本顺序扫描 `${platform}_${version}/${PLATFORM_DOC_SUBDIR[platform]}/${version}/index-l0.json`
 *  2. 均未命中时扫描所有匹配目录，按 index-l0.json 条目数降序选最完整的那个
 *  3. 无任何数据则抛出错误
 */
function resolvePlatformDataDir(platform: Platform): string {
  const dataRoot = resolveDataDir();

  // 1. 按已知版本顺序扫描
  for (const v of KNOWN_VERSIONS[platform]) {
    const subDir = `${platform}_${v}`;
    // Forge 1.7.10–1.12.2 使用 forge_javadoc 而非 forge-docs
    if (platform === "forge" && JAVADOC_VERSIONS.has(v)) {
      const docsDir = join(dataRoot, "forge_javadoc");
      if (existsSync(join(docsDir, v, "index-l0.json"))) {
        return dataRoot;
      }
    } else {
      const docsDir = join(dataRoot, subDir, PLATFORM_DOC_SUBDIR[platform]);
      if (existsSync(join(docsDir, v, "index-l0.json"))) {
        return platform === "fabric" ? docsDir : dataRoot;
      }
    }
  }

  // 2. Fallback：扫描所有匹配目录
  //    优先级：A. 命名规范目录（forge_X.Y.Z/PLATFORM_SUBDIR/） > B. forge_javadoc/
  //    在同类中选 index-l0.json 条目数最多的
  let bestDirByPattern: Record<string, { dir: string; count: number }> = {};
  try {
    for (const entry of readdirSync(dataRoot, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith(`${platform}_`)) continue;
      const versionFromDir = entry.name.replace(`${platform}_`, "");
      const indexPath = join(dataRoot, entry.name, PLATFORM_DOC_SUBDIR[platform], versionFromDir, "index-l0.json");
      if (!existsSync(indexPath)) continue;
      let count = 0;
      try {
        const content = readFileSync(indexPath, "utf-8");
        count = (JSON.parse(content) as unknown[]).length;
      } catch { /* ignore */ }

      const isJavadoc = entry.name === `${platform}_javadoc`;
      if (!bestDirByPattern[isJavadoc ? "javadoc" : "standard"] || count > bestDirByPattern[isJavadoc ? "javadoc" : "standard"].count) {
        bestDirByPattern[isJavadoc ? "javadoc" : "standard"] = {
          dir: join(dataRoot, entry.name, PLATFORM_DOC_SUBDIR[platform]),
          count,
        };
      }
    }
  } catch { /* ignore */ }

  // Prefer standard naming; fallback to javadoc only if no standard dirs found
  const bestDir = bestDirByPattern["standard"]?.dir ?? bestDirByPattern["javadoc"]?.dir ?? "";
  if (bestDir) return platform === "fabric" ? bestDir : dataRoot;
  throw new Error(`No data found for platform: ${platform}`);
}

/** 导出供外部使用（如 forge/index.ts 的 getGenericStore） */
export { resolvePlatformDataDir };

// ── 工厂 ────────────────────────────────────────────────────────────────────

import { ForgeDocStore } from "./forge/store.js";
import { FabricDocStore } from "./fabric/store.js";
import { NeoForgeDocStore } from "./neoforge/store.js";

class UnsupportedPlatformStore implements IDocStore {
  private static readonly MSG = "平台不支持，当前支持 forge、neoforge 和 fabric";
  private static readonly HINT = "请使用 platform: forge、neoforge 或 fabric";

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
  if (platform === "fabric") {
    return new FabricDocStore(dataDir);
  }
  if (platform === "neoforge") {
    return new NeoForgeDocStore(dataDir);
  }
  return new UnsupportedPlatformStore();
}
