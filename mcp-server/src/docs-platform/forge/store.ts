/**
 * ForgeDocStore — Forge 官方文档数据访问层
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
 */

import { readFileSync, existsSync, readdirSync, statSync, type Dirent } from "fs";
import { join } from "path";
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
  resolvedVersion: string;
  results: number;
  timestamp: number;
}

export class DocNotFoundError extends Error {
  override name = "DocNotFoundError";
  constructor(
    public id: string,
    public version: string,
    public code?: string
  ) {
    super(
      code === "UNSUPPORTED_PLATFORM"
        ? version  // message = "请使用 platform: forge（当前唯一支持的平台）"
        : `Forge 文档未找到: ${id} (版本 ${version})`
    );
    this.name = "DocNotFoundError";
  }
}

export class VersionNotFoundError extends Error {
  override name = "VersionNotFoundError";
  constructor(public version: string, public availableVersions: string[]) {
    super(
      availableVersions.length > 0
        ? `不支持的版本: ${version}。当前仅支持: ${availableVersions.join(", ")}`
        : `不支持的版本: ${version}。文档数据未加载。`,
    );
    this.name = "VersionNotFoundError";
  }
}

/** 系列键：去掉尾部 .x 后的前两段数字。1.16.8 / 1.16.x / 1.16 → 1.16；26.1.2 → 26.1 */
export function seriesKey(version: string): string | null {
  const n = version.trim().replace(/\.x$/i, "");
  return n.match(/^(\d+\.\d+)/)?.[1] ?? null;
}

function versionRankParts(version: string): number[] {
  return version.split(".").map((p) => {
    if (p === "x" || p === "X") return -1;
    const n = Number(p);
    return Number.isFinite(n) ? n : -1;
  });
}

/** 数字补丁 > .x > 缺段。1.16.5 > 1.16.x > 1.16 */
export function compareMcVersions(a: string, b: string): number {
  const pa = versionRankParts(a);
  const pb = versionRankParts(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? -2;
    const db = pb[i] ?? -2;
    if (da !== db) return da - db;
  }
  return 0;
}

/** 精确命中，否则同系列最高档；无亲缘则 null。 */
export function resolveFromAvailable(requested: string, available: string[]): string | null {
  if (available.includes(requested)) return requested;
  const key = seriesKey(requested);
  if (!key) return null;
  const same = available.filter((v) => seriesKey(v) === key);
  if (same.length === 0) return null;
  same.sort(compareMcVersions);
  return same[same.length - 1] ?? null;
}

// ── Store 实现 ──────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

/** Forge 1.7.10–1.12.2 使用 forge_javadoc 而非 forge-docs（需与 store.ts 保持一致） */
const JAVADOC_VERSIONS = new Set(["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2"]);

export interface SearchIndexDetailed {
  results: SearchResult[];
  requestedVersion: string;
  resolvedVersion: string;
  versionFallback: boolean;
}

export class ForgeDocStore {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  /** 按 `${version}/${indexName}` 缓存 index JSON */
  private indexCache = new Map<string, CacheEntry<unknown>>();

  /** 按 `${version}/${processedFile}` 缓存文件内容 */
  private fileCache = new Map<string, CacheEntry<string>>();

  /** 搜索结果缓存（key = "query|version|tags"，TTL 5 分钟） */
  private searchCache = new Map<string, CacheEntry<unknown>>();

  /** L1 符号倒排（按 resolved version） */
  private symbolIndexCache = new Map<string, SymbolIndex>();

  /** 相关文档缓存（以 id|version|limit 为 key） */
  private relatedCache = new Map<string, SearchResult[]>();

  /** 搜索日志（最多 500 条） */
  private searchLog: SearchLogEntry[] = [];

  private _validated = false;
  private _lastSearchMeta: Omit<SearchIndexDetailed, "results"> | null = null;

  constructor(private readonly dataDir: string) {}

  /** 供测试：符号索引构建代数 */
  getSymbolIndexBuildGeneration(version: string): number {
    return this.symbolIndexCache.get(version)?.buildGeneration ?? 0;
  }

  getLastSearchMeta(): Omit<SearchIndexDetailed, "results"> | null {
    return this._lastSearchMeta;
  }

  private versionDataDir(version: string): string {
    const standard = join(this.dataDir, `forge_${version}`, "forge-docs", version);
    if (existsSync(join(standard, "index-l0.json"))) return standard;
    if (JAVADOC_VERSIONS.has(version)) {
      return join(this.dataDir, "forge_javadoc", version);
    }
    return standard;
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
      throw new PlatformDataMissingError("forge");
    }
    if (this.getAvailableVersionsUnchecked().length === 0) {
      throw new PlatformDataMissingError("forge");
    }
  }

  // ── 公开 API ──────────────────────────────────────────────────────────

  /**
   * 返回 data 目录下所有可用版本列表。
   * 扫描两个来源：
   *   1. dataRoot/forge_<version>/<subDirName>/<version>/index-l0.json（forge-docs）
   *   2. dataRoot/forge_javadoc/<version>/index-l0.json（javadoc 版本）
   */
  getAvailableVersions(): string[] {
    this.ensureValidated();
    return this.getAvailableVersionsUnchecked();
  }

  private getAvailableVersionsUnchecked(): string[] {
    const results = new Set<string>();
    try {
      for (const entry of readdirSync(this.dataDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || !entry.name.startsWith("forge_") || entry.name === "forge_javadoc") continue;
        const version = entry.name.replace(/^forge_/, "");
        if (existsSync(join(this.dataDir, entry.name, "forge-docs", version, "index-l0.json"))) {
          results.add(version);
        }
      }
      const javadocDir = join(this.dataDir, "forge_javadoc");
      if (existsSync(javadocDir)) {
        for (const entry of readdirSync(javadocDir, { withFileTypes: true })) {
          if (entry.isDirectory() && existsSync(join(javadocDir, entry.name, "index-l0.json"))) {
            results.add(entry.name);
          }
        }
      }
    } catch { /* ignore */ }

    return [...results].sort((a, b) => {
      const pa = a.split(".").map(Number);
      const pb = b.split(".").map(Number);
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const da = pa[i] ?? 0, db = pb[i] ?? 0;
        if (da !== db) return db - da;
      }
      return 0;
    });
  }

  /** 版本解析：精确命中，否则同系列（major.minor）最高有数据档。禁止跨主版本。 */
  resolveVersion(requested: string): string {
    const available = this.getAvailableVersions();
    const resolved = resolveFromAvailable(requested, available);
    if (resolved) return resolved;
    throw new VersionNotFoundError(requested, available);
  }

  describeVersionResolution(version: string): {
    requested: string;
    resolved: string;
    versionFallback: boolean;
    warning?: string;
  } {
    const resolved = this.resolveVersion(version);
    const versionFallback = resolved !== version;
    return {
      requested: version,
      resolved,
      versionFallback,
      warning: versionFallback
        ? `请求版本 ${version} 无独立文档，已降级到 ${resolved}`
        : undefined,
    };
  }

  /**
   * L0 + L1 符号增强搜索。
   * 无同系列档时 VERSION_NOT_FOUND；调用方可经 getLastSearchMeta / searchIndexDetailed 获取 versionFallback。
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

    const resolvedVersion = this.resolveVersion(version);
    const versionFallback = resolvedVersion !== version;
    const index = this.loadIndexL0(resolvedVersion);
    const symbolIndex = this.getOrBuildSymbolIndex(resolvedVersion);

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
      resolvedVersion,
      versionFallback,
    };
    this._lastSearchMeta = {
      requestedVersion: version,
      resolvedVersion,
      versionFallback,
    };

    this.searchCache.set(cacheKey, {
      data: detailed,
      expiry: Date.now() + ForgeDocStore.CACHE_TTL,
    });

    const logEntry: SearchLogEntry = {
      query,
      version,
      resolvedVersion,
      results: results.length,
      timestamp: Date.now(),
    };
    this.searchLog.push(logEntry);
    if (this.searchLog.length > 500) this.searchLog.splice(0, 100);

    return detailed;
  }

  private getOrBuildSymbolIndex(version: string): SymbolIndex | null {
    const cached = this.symbolIndexCache.get(version);
    if (cached) return cached;
    try {
      const l1Path = join(this.versionDataDir(version), "index-l1.json");
      if (!existsSync(l1Path)) return null;
      const byteSize = statSync(l1Path).size;
      const l1 = this.loadIndexL1(version);
      const idx = buildSymbolIndex(l1, { byteSize, generation: 1 });
      this.symbolIndexCache.set(version, idx);
      return idx;
    } catch {
      return null;
    }
  }

  /**
   * 导出搜索日志供外部分析。
   * 每次 searchIndex 调用都会追加一条记录。
   */
  getSearchLog(): SearchLogEntry[] {
    return [...this.searchLog];
  }

  /**
   * 返回与指定文档最相关的其他页面列表。
   * 相关性基于 URL path 骨架关键词 + section title/summary 关键词的重叠度。
   * 结果会被缓存（key = id|version|limit）。
   */
  getRelatedDocs(id: string, version: string, limit = 5): SearchResult[] {
    this.ensureValidated();
    const cacheKey = `${id}|${version}|${limit}`;
    const cached = this.relatedCache.get(cacheKey);
    if (cached) return cached;

    let l2: import("./types.js").L2Entry[];
    try {
      l2 = this.loadIndexL2(version);
    } catch {
      throw new VersionNotFoundError(version, this.getAvailableVersions());
    }

    const current = l2.find((e) => e.id === id);
    if (!current) throw new DocNotFoundError(id, version);

    // 当前文档关键词：path 骨架（按 / 与 _ 切分）+ section 标题/摘要 + tags
    const RELATED_STOP = new Set([
      "there", "their", "these", "those", "this", "that", "with", "from", "into",
      "over", "under", "after", "before", "using", "used", "also", "only", "such",
      "than", "then", "else", "when", "where", "which", "what", "will", "would",
      "could", "should", "have", "been", "were", "they", "them", "some", "any",
      "each", "other", "more", "most", "very", "just", "like", "make", "made",
      "class", "public", "private", "static", "return", "import", "package",
      "minecraft", "forge", "mod", "code", "example", "page", "section", "docs",
      "objects", "object", "methods", "method", "ways", "way", "needs", "need",
      "done", "does", "doing", "appear", "appears", "typically", "simply",
    ]);
    const meaningful = (w: string) =>
      w.length > 3 && !RELATED_STOP.has(w);

    const pathKws = this.extractPathKeywords(id);
    const sectionKws = current.sections
      .flatMap((s) => [s.title, s.summary])
      .join(" ")
      .toLowerCase()
      .split(/\W+/)
      .filter(meaningful);
    const tagKws = (current.tags ?? []).map((t) => t.toLowerCase().replace(/-/g, ""));
    const pathSet = new Set(pathKws);
    const sectionSet = new Set(sectionKws);
    const tagSet = new Set(tagKws);

    // 顶层章节前缀（concepts / datagen / networking …）用于同章加权
    const topSeg = id.replace(/^\d+\.\d+(\.\d+)?\//, "").split(/[/_]/)[0]?.toLowerCase() ?? "";

    const results = (l2 as Array<import("./types.js").L2Entry & { overlap: number }>)
      .filter((e) => e.id !== id)
      .map((e) => {
        const otherPathKws = this.extractPathKeywords(e.id);
        const otherSectionKws = e.sections
          .flatMap((s) => [s.title, s.summary])
          .join(" ")
          .toLowerCase()
          .split(/\W+/)
          .filter(meaningful);
        const otherTagKws = (e.tags ?? []).map((t) => t.toLowerCase().replace(/-/g, ""));
        const otherPath = new Set(otherPathKws);
        const otherSection = new Set(otherSectionKws);
        const otherTag = new Set(otherTagKws);

        let overlap = 0;
        // path 骨架命中权重大于散文词
        for (const w of pathSet) {
          if (otherPath.has(w) || otherSection.has(w) || otherTag.has(w)) overlap += 5;
        }
        for (const w of sectionSet) {
          if (otherPath.has(w) || otherSection.has(w)) overlap += 1;
        }
        for (const t of tagSet) {
          if (otherTag.has(t) || otherPath.has(t) || otherSection.has(t)) overlap += 6;
        }
        const otherTop = e.id.replace(/^\d+\.\d+(\.\d+)?\//, "").split(/[/_]/)[0]?.toLowerCase() ?? "";
        if (topSeg && topSeg === otherTop) overlap += 10;
        else if (topSeg && otherTop && topSeg !== otherTop && overlap < 8) {
          // 弱相关且跨章：压制 GUI/杂项误入
          overlap = Math.max(0, overlap - 3);
        }

        return { ...e, overlap };
      })
      .filter((e) => e.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, limit)
      .map(({ overlap: _o, ...rest }) => rest as unknown as SearchResult);

    this.relatedCache.set(cacheKey, results);
    if (this.relatedCache.size > 64) {
      const first = this.relatedCache.keys().next().value;
      if (first !== undefined) this.relatedCache.delete(first);
    }
    return results;
  }

  /**
   * L1 摘要加载。
   * - 从 index-l1.json 中查找条目
   * - 找不到时抛出 DocNotFoundError
   */
  loadSummary(id: string, version: string): SummaryResult {
    this.ensureValidated();
    // 与 searchIndexDetailed 同口径：同系列回退（1.16.8 → 1.16.5），fetch 端不咬死精确版本（F-D103）
    version = this.resolveVersion(version);
    const index = this.loadIndexL1(version);
    // id 可能是 "resources/server/recipes/ingredients" 或 "1.20.1/resources_server_recipes_ingredients"
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
   * - 从 index-l2.json 找到文件路径
   * - 读取 processed/*.md 内容并缓存
   * - highlightKey=true 时提取关键段落（<!-- key:* -->）
   */
  async loadFullDoc(
    id: string,
    version: string,
    highlightKey?: boolean,
  ): Promise<FullDocResult> {
    this.ensureValidated();
    // 与 searchIndexDetailed 同口径：同系列回退（1.16.8 → 1.16.5），fetch 端不咬死精确版本（F-D103）
    version = this.resolveVersion(version);
    const l2 = this.loadIndexL2(version);
    // id 可能是 "resources/server/recipes/ingredients" 或 "1.20.1/resources_server_recipes_ingredients"
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
      const filepath = join(this.versionDataDir(version), meta.processedFile);
      if (!existsSync(filepath)) {
        throw new DocNotFoundError(id, version);
      }
      content = readFileSync(filepath, "utf-8");
      this.fileCache.set(cacheKey, {
        data: content,
        expiry: Date.now() + ForgeDocStore.CACHE_TTL,
      });
    }

    return this.buildResult(content, meta, highlightKey);
  }

  // ── 内部 ──────────────────────────────────────────────────────────────

  private loadIndexL0(version: string): SearchResult[] {
    return this.loadCachedIndex<SearchResult[]>(
      `l0-${version}`,
      join(this.versionDataDir(version), "index-l0.json"),
      version,
    );
  }

  private loadIndexL1(version: string): SummaryResult[] {
    return this.loadCachedIndex<SummaryResult[]>(
      `l1-${version}`,
      join(this.versionDataDir(version), "index-l1.json"),
      version,
    );
  }

  private loadIndexL2(version: string): import("./types.js").L2Entry[] {
    return this.loadCachedIndex<import("./types.js").L2Entry[]>(
      `l2-${version}`,
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
      expiry: Date.now() + ForgeDocStore.CACHE_TTL,
    });
    return data;
  }

  private buildResult(
    content: string,
    meta: import("./types.js").L2Entry,
    highlightKey?: boolean,
  ): FullDocResult {
    if (!highlightKey) {
      return { content, meta };
    }

    const keyBlocks = this.extractKeyBlocks(content);
    return { keyBlocks, content, meta };
  }

  /**
   * 从 id 中提取骨架关键词。
   * "1.20.1/blockentities/ber" → ["blockentities","ber","block","entity"]
   */
  private extractPathKeywords(id: string): string[] {
    // Forge id 多为 1.20.1/concepts_registries（下划线）；同时兼容 concepts/registries
    const stem = id.replace(/^\d+\.\d+(?:\.\d+)?\//, "");
    const parts = stem.split(/[/_]+/).filter(Boolean);
    const keywords: string[] = [];
    for (const part of parts) {
      const lower = part.toLowerCase();
      keywords.push(lower);
      const root = part
        .replace(/(?:entity|ies|es|s|ing|ed)$/i, "")
        .toLowerCase();
      if (root !== lower && root.length > 2) {
        keywords.push(root);
      }
    }
    return keywords;
  }

  /**
   * 从 Markdown 中提取 <!-- key:🔴 role:xxx --> 包裹的关键段落。
   * 返回 keyBlocks 数组，每个块包含 type、role 和文本内容。
   */
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
