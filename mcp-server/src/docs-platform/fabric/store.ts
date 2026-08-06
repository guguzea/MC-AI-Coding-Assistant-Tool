/**
 * FabricDocStore — Fabric 官方文档数据访问层
 *
 * 职责：
 * - 按版本缓存 index JSON（懒加载 + TTL）
 * - 按版本缓存 processed/*.md 文件内容
 * - 提供 searchIndex / loadSummary / loadFullDoc 三个查询接口
 * - 提供 getAvailableVersions / getRelatedDocs / getSearchLog 辅助接口
 *
 * 缓存策略：
 * - index JSON：首次访问时从磁盘读，后续全在内存过滤
 * - 文件内容：读取后缓存 5 分钟
 * - 相关文档：缓存于 relatedCache（以 id|version|limit 为 key）
 *
 * 数据目录结构：
 *   data/fabric_<version>/
 *   ├── fabric-docs/<version>/
 *   │   ├── raw/  processed/  index-l0/l1/l2.json
 *   └── fabric-wiki/<version>/
 *       ├── raw/  processed/  index-l0/l1/l2.json
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import {
  buildSymbolIndex,
  enhancedSearch,
  stripScores,
  type SymbolIndex,
} from "../search-utils.js";
import { PlatformDataMissingError } from "../platform-data.js";

// ── 类型定义 ─────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  priority: string;
  sectionCount: number;
}

export interface SummaryResult {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  firstParagraph: string;
  sections?: Array<{ title: string; level: number; summary: string }>;
}

export interface FullDocResult {
  keyBlocks?: KeyBlock[];
  content: string;
  meta: {
    id: string;
    version: string;
    label: string;
    url: string;
    tags: string[];
    sections?: Array<{ title: string; level: number; summary: string }>;
    hasCodeBlocks: boolean;
    codeBlockCount: number;
    keySections: number;
    processedFile: string;
  };
}

export interface KeyBlock {
  type: string;
  role: string;
  text: string;
}

export interface SearchLogEntry {
  query: string;
  version: string;
  results: number;
  timestamp: number;
}

export class DocNotFoundError extends Error {
  constructor(
    public id: string,
    public version: string,
    public code?: string
  ) {
    super(
      code === "UNSUPPORTED_PLATFORM"
        ? version  // message = "请使用 platform: fabric"
        : `Fabric 文档未找到: ${id} (版本 ${version})`
    );
  }
}

export class VersionNotFoundError extends Error {
  constructor(public version: string, public availableVersions: string[]) {
    super(
      availableVersions.length > 0
        ? `不支持的版本: ${version}。当前仅支持: ${availableVersions.join(", ")}`
        : `不支持的版本: ${version}。文档数据未加载。`,
    );
  }
}

// ── Store 工厂函数（支持 fabric-docs + fabric-wiki 子目录）────────────

const SUBDIR_MAP: Record<string, string> = {
  "fabric-docs": "fabric-docs",
  "fabric-wiki": "fabric-wiki",
};

/**
 * 创建 FabricDocStore，自动路由到正确的子目录。
 *
 * @param version  MC 版本，如 "1.20.1"
 * @param source  数据源，默认 "fabric-docs"
 * @param rootDir 可选，data 根目录（含 fabric_* 子目录）；不传则用 cwd/data
 *
 * 最终版本数据目录：
 *   <root>/fabric_<version>/<source>/<version>
 * 例如：data/fabric_1.20.1/fabric-docs/1.20.1
 */
export function createFabricDocStore(
  version: string,
  source = "fabric-docs",
  rootDir?: string,
): FabricDocStore {
  const root = rootDir ?? join(process.cwd(), "data");
  return new FabricDocStore(root, version, source);
}

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export interface SearchIndexDetailed {
  results: SearchResult[];
  requestedVersion: string;
  resolvedVersion: string;
  versionFallback: boolean;
}

export class FabricDocStore {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  /** 当前数据源（fabric-docs 或 fabric-wiki） */
  public readonly source: string;

  /** 按 `${source}/${version}/${indexName}` 缓存 index JSON */
  private indexCache = new Map<string, CacheEntry<unknown>>();

  /** 按 `${version}/${processedFile}` 缓存文件内容 */
  private fileCache = new Map<string, CacheEntry<string>>();

  /** 搜索结果缓存（key = "query|version|tags"，TTL 5 分钟） */
  private searchCache = new Map<string, CacheEntry<unknown>>();

  private symbolIndexCache = new Map<string, SymbolIndex>();

  /** 相关文档缓存（以 id|version|limit 为 key） */
  private relatedCache = new Map<string, SearchResult[]>();

  /** 搜索日志（最多 500 条） */
  private searchLog: SearchLogEntry[] = [];

  /** 懒加载校验标志（首次调用文档方法时触发） */
  private _validated = false;
  private _lastSearchMeta: Omit<SearchIndexDetailed, "results"> | null = null;

  /**
   * Create FabricDocStore.
   * @param dataDir data root (contains fabric_VERSION dirs) or legacy fabric-docs dir
   * @param version default MC version fallback; query version wins at call sites
   * @param source data source name, default fabric-docs
   */
  constructor(
    private readonly dataDir: string,
    version = "1.20.1",
    source = "fabric-docs",
  ) {
    this.source = SUBDIR_MAP[source] ?? source ?? "fabric-docs";
    Object.defineProperty(this, "_version", { value: version, writable: false, enumerable: false });
  }

  private get defaultVersion(): string {
    return (this as unknown as { _version: string })._version;
  }

  /** Resolve on-disk directory for a MC version under this store. */
  private versionDataDir(version: string): string {
    const canonical = join(this.dataDir, `fabric_${version}`, this.source, version);
    if (existsSync(join(canonical, "index-l0.json"))) return canonical;

    // Legacy: dataDir already points at .../fabric-docs (or .../fabric-wiki)
    const legacy = join(this.dataDir, version);
    if (existsSync(join(legacy, "index-l0.json"))) return legacy;

    // Legacy: dataDir is .../fabric_<ver>/<source> without nesting version wrongly
    const nested = join(this.dataDir, this.source, version);
    if (existsSync(join(nested, "index-l0.json"))) return nested;

    return canonical;
  }

  // ── 懒加载校验 ────────────────────────────────────────────────────────────

  /**
   * 确保数据目录已验证（懒加载）。
   * 首次调用任何文档方法时触发，检查目录存在性和基本结构。
   */
  private ensureValidated(): void {
    if (this._validated) return;
    this._validated = true;

    if (!existsSync(this.dataDir)) {
      throw new PlatformDataMissingError("fabric");
    }
    if (this.getAvailableVersionsUnchecked().length === 0) {
      throw new PlatformDataMissingError("fabric");
    }
  }

  // ── 公开 API ──────────────────────────────────────────────────────────

  /**
   * 返回 data 目录下所有可用版本列表。
   * 用于告知用户当前有哪些版本可用。
   */
  getAvailableVersions(): string[] {
    this.ensureValidated();
    return this.getAvailableVersionsUnchecked();
  }

  private getAvailableVersionsUnchecked(): string[] {
    if (!existsSync(this.dataDir)) return [];
    const versions = new Set<string>();
    try {
      for (const entry of readdirSync(this.dataDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith("fabric_")) {
          const ver = entry.name.slice("fabric_".length);
          if (existsSync(join(this.dataDir, entry.name, this.source, ver, "index-l0.json"))) {
            versions.add(ver);
          }
          continue;
        }
        // Legacy: dataDir is .../fabric-docs with version subdirs
        if (existsSync(join(this.dataDir, entry.name, "index-l0.json"))) {
          versions.add(entry.name);
        }
      }
    } catch {
      return [];
    }
    return [...versions].sort();
  }

  getLastSearchMeta(): Omit<SearchIndexDetailed, "results"> | null {
    return this._lastSearchMeta;
  }

  getSymbolIndexBuildGeneration(version: string): number {
    return this.symbolIndexCache.get(`${this.source}|${version}`)?.buildGeneration ?? 0;
  }

  /**
   * L0 + L1 符号增强搜索。Fabric 不做静默版本降级（version 必须存在）。
   */
  searchIndex(
    query: string,
    version: string,
    tags?: string[],
  ): SearchResult[] {
    return this.searchIndexDetailed(query, version, tags).results;
  }

  searchIndexDetailed(
    query: string,
    version: string,
    tags?: string[],
  ): SearchIndexDetailed {
    this.ensureValidated();
    const cacheKey = `${query}|${version}|${(tags ?? []).join(",")}`;
    const cached = this.searchCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      const packed = cached.data as SearchIndexDetailed;
      this._lastSearchMeta = {
        requestedVersion: packed.requestedVersion,
        resolvedVersion: packed.resolvedVersion,
        versionFallback: packed.versionFallback,
      };
      return packed;
    }

    // Fabric：严格版本，不存在则抛错（loadIndexL0 内部）
    const index = this.loadIndexL0(version);
    const symbolIndex = this.getOrBuildSymbolIndex(version);

    const scored = enhancedSearch({
      query,
      l0: index,
      symbolIndex,
      tags,
      limit: 10,
      minTokenLength: 1,
    });
    const results = stripScores(scored) as SearchResult[];

    const detailed: SearchIndexDetailed = {
      results,
      requestedVersion: version,
      resolvedVersion: version,
      versionFallback: false,
    };
    this._lastSearchMeta = {
      requestedVersion: version,
      resolvedVersion: version,
      versionFallback: false,
    };

    this.searchCache.set(cacheKey, {
      data: detailed,
      expiry: Date.now() + FabricDocStore.CACHE_TTL,
    });

    this.searchLog.push({ query, version, results: results.length, timestamp: Date.now() });
    if (this.searchLog.length > 500) this.searchLog.splice(0, 100);

    return detailed;
  }

  private getOrBuildSymbolIndex(version: string): SymbolIndex | null {
    const key = `${this.source}|${version}`;
    const cached = this.symbolIndexCache.get(key);
    if (cached) return cached;
    try {
      const l1Path = join(this.versionDataDir(version), "index-l1.json");
      if (!existsSync(l1Path)) return null;
      const byteSize = statSync(l1Path).size;
      const l1 = this.loadIndexL1(version);
      const idx = buildSymbolIndex(l1, { byteSize, generation: 1 });
      this.symbolIndexCache.set(key, idx);
      return idx;
    } catch {
      return null;
    }
  }

  /**
   * 导出搜索日志供外部分析。
   */
  getSearchLog(): SearchLogEntry[] {
    return [...this.searchLog];
  }

  /**
   * 返回与指定文档最相关的其他页面列表。
   */
  getRelatedDocs(id: string, version: string, limit = 5): SearchResult[] {
    this.ensureValidated();
    const cacheKey = `${id}|${version}|${limit}`;
    const cached = this.relatedCache.get(cacheKey);
    if (cached) return cached;

    let l2: L2Entry[];
    try {
      l2 = this.loadIndexL2(version);
    } catch {
      throw new VersionNotFoundError(version, this.getAvailableVersions());
    }

    const current = l2.find((e) => e.id === id);
    if (!current) throw new DocNotFoundError(id, version);

    const pathKws = this.extractPathKeywords(id);
    const sectionKws = current.sections
      .flatMap((s) => [s.title, s.summary])
      .join(" ")
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    const currentKeywords = new Set([...pathKws, ...sectionKws]);

    const results = (l2 as Array<L2Entry & { overlap: number }>)
      .filter((e) => e.id !== id)
      .map((e) => {
        const otherPathKws = this.extractPathKeywords(e.id);
        const otherSectionKws = e.sections
          .flatMap((s) => [s.title, s.summary])
          .join(" ")
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 3);
        const otherKeywords = new Set([...otherPathKws, ...otherSectionKws]);

        let overlap = 0;
        for (const w of currentKeywords) {
          if (otherKeywords.has(w)) overlap++;
        }
        return { ...e, overlap };
      })
      .filter((e) => e.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, limit)
      .map(({ overlap: _o, ...rest }) => rest as unknown as SearchResult);

    this.relatedCache.set(cacheKey, results);
    return results;
  }

  /**
   * L1 摘要加载。
   */
  loadSummary(id: string, version: string): SummaryResult {
    this.ensureValidated();
    const index = this.loadIndexL1(version);
    const normalized = id.match(/^\d+\.\d+\.\d+\//)
      ? id
      : `${version}/${id.replace(/\//g, "_")}`;
    const entry = index.find((e) => e.id === normalized);
    if (!entry) {
      throw new DocNotFoundError(id, version);
    }
    return entry;
  }

  /**
   * L2/L2+ 全文加载。
   */
  async loadFullDoc(
    id: string,
    version: string,
    highlightKey?: boolean,
  ): Promise<FullDocResult> {
    this.ensureValidated();
    const l2 = this.loadIndexL2(version);
    const normalized = id.match(/^\d+\.\d+\.\d+\//)
      ? id
      : `${version}/${id.replace(/\//g, "_")}`;
    const meta = l2.find((e) => e.id === normalized);
    if (!meta) {
      throw new DocNotFoundError(id, version);
    }

    const cacheKey = `${version}/${meta.processedFile}`;
    const cached = this.fileCache.get(cacheKey);

    let content: string;
    if (cached && cached.expiry > Date.now()) {
      content = cached.data;
    } else {
      const versionRoot = resolve(this.versionDataDir(version));
      const resolved = resolve(versionRoot, meta.processedFile);
      if (!resolved.startsWith(versionRoot) || !existsSync(resolved)) {
        throw new DocNotFoundError(id, version);
      }
      content = readFileSync(resolved, "utf-8");
      this.fileCache.set(cacheKey, {
        data: content,
        expiry: Date.now() + FabricDocStore.CACHE_TTL,
      });
    }

    return this.buildResult(content, meta, highlightKey);
  }

  // ── 内部 ──────────────────────────────────────────────────────────────

  private loadIndexL0(version: string): SearchResult[] {
    return this.loadCachedIndex<SearchResult[]>(
      `l0-${this.source}-${version}`,
      join(this.versionDataDir(version), "index-l0.json"),
      version,
    );
  }

  private loadIndexL1(version: string): SummaryResult[] {
    return this.loadCachedIndex<SummaryResult[]>(
      `l1-${this.source}-${version}`,
      join(this.versionDataDir(version), "index-l1.json"),
      version,
    );
  }

  private loadIndexL2(version: string): L2Entry[] {
    return this.loadCachedIndex<L2Entry[]>(
      `l2-${this.source}-${version}`,
      join(this.versionDataDir(version), "index-l2.json"),
      version,
    );
  }

  private loadCachedIndex<T>(cacheKey: string, filepath: string, version: string): T {
    const cached = this.indexCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    if (!existsSync(filepath)) {
      throw new VersionNotFoundError(version, this.getAvailableVersions());
    }
    const data = JSON.parse(readFileSync(filepath, "utf-8")) as T;
    this.indexCache.set(cacheKey, {
      data,
      expiry: Date.now() + FabricDocStore.CACHE_TTL,
    });
    return data;
  }

  private buildResult(
    content: string,
    meta: L2Entry,
    highlightKey?: boolean,
  ): FullDocResult {
    if (!highlightKey) {
      return { content, meta };
    }
    const keyBlocks = this.extractKeyBlocks(content);
    return { keyBlocks, content, meta };
  }

  private extractPathKeywords(id: string): string[] {
    const parts = id.replace(/^\d+\.\d+\.\d+\//, "").split("/");
    const keywords: string[] = [];
    for (const part of parts) {
      keywords.push(part.toLowerCase());
      const root = part
        .replace(/(?:entity|es|s|ing|ed)$/i, "")
        .toLowerCase();
      if (root !== part.toLowerCase() && root.length > 2) {
        keywords.push(root);
      }
    }
    return keywords;
  }

  private extractKeyBlocks(content: string): KeyBlock[] {
    const blocks: KeyBlock[] = [];
    const keyRegex = /<!--\s*key:(\S+)(?:\s+role:([^>]*?))?\s*-->/g;
    let match: RegExpExecArray | null;

    while ((match = keyRegex.exec(content)) !== null) {
      const start = match.index + match[0].length;
      const nextKey = content.indexOf("<!-- key:", start);
      const end = nextKey === -1 ? content.length : nextKey;
      const text = content.slice(start, end).trim();

      if (text) {
        blocks.push({
          type: match[1],
          role: (match[2] ?? "关键段落").trim(),
          text: text.length > 500 ? text.slice(0, 500) + "..." : text,
        });
      }
    }

    return blocks;
  }
}

// ── 内部类型 ──────────────────────────────────────────────────────────────

interface L2Entry {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  sections: Array<{ title: string; level: number; summary: string }>;
  hasCodeBlocks: boolean;
  codeBlockCount: number;
  keySections: number;
  file: string;
  processedFile: string;
}
