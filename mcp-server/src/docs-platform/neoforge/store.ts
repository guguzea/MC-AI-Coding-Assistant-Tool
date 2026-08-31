/**
 * NeoForgeDocStore — NeoForge 官方文档数据访问层
 *
 * 职责：
 * - 按版本缓存 index JSON（懒加载 + TTL）
 * - 按版本缓存 processed/*.md 文件内容
 * - 提供 searchIndex / loadSummary / loadFullDoc 三个查询接口
 * - 提供 getAvailableVersions / getRelatedDocs / getSearchLog 辅助接口
 * - 特殊处理 1.20.1（Forge 100% 兼容模式）
 * - 版本降级策略（26.2 → 26.1, 1.21.9 → 1.21.10）
 *
 * 数据目录结构：
 *   data/neoforge_<version>/
 *   ├── neoforge-docs/<version>/
 *   │   ├── raw/  processed/  index-l0.json  index-l1.json  index-l2.json
 *   └── _forge_compatible/  (1.20.1 Forge 兼容数据)
 */

import { readFileSync, existsSync, readdirSync, statSync, type Dirent } from "fs";
import { join, basename } from "path";
import {
  buildSymbolIndex,
  enhancedSearch,
  ttlCacheGet,
  ttlCacheSet,
  type SymbolIndex,
  type TtlCacheEntry,
} from "../search-utils.js";
import { PlatformDataMissingError } from "../platform-data.js";
import { ownGet } from "../../utils/own-record.js";

// ── 类型定义 ─────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  priority: string;
  sectionCount: number;
  /** 相关性评分（searchIndexDetailed 保留；与工具描述一致） */
  score?: number;
  /** primer 旁路命中 */
  source?: "primer" | "docs";
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
    forgeCompatible?: boolean;
  };
}

/** Raw L2 index entry (flat, as written by process-neoforge-docs.js) */
interface L2IndexEntry {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  content?: string;
  sections?: Array<{ title: string; level: number; summary: string }>;
  hasCodeBlocks: boolean;
  codeBlockCount: number;
  keySections: number;
  processedFile: string;
}

export interface KeyBlock {
  type: string;
  role: string;
  text: string;
}

export class DocNotFoundError extends Error {
  constructor(
    public id: string,
    public version: string,
    public code?: string
  ) {
    super(
      code === "UNSUPPORTED_PLATFORM"
        ? version
        : `NeoForge 文档未找到: ${id} (版本 ${version})`
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

export class IndexCorruptError extends Error {
  override name = "IndexCorruptError";
  constructor(public version: string, public filepath: string) {
    super(`INDEX_CORRUPT: 文档索引无法解析（version=${version}）`);
    this.name = "IndexCorruptError";
  }
}

// ── 版本降级映射 ─────────────────────────────────────────────────────────

/**
 * 仅当请求版没有自己的 index-l0.json 时才使用。
 * 有独立树时必须从本表删除对应键（例如官方发布 /docs/26.2/ 后删掉 26.2）。
 */
export const VERSION_FALLBACK: Record<string, string | null> = {
  "26.2": "26.1",
  "1.21.9": "1.21.10",
  "1.21.7": "1.21.8",
  "1.21.4": "1.21.5",
  "1.21.2": "1.21.3",
};

  /** 特殊 Forge 兼容版本 */
  const FORGE_COMPATIBLE_VERSIONS = new Set(["1.20.1"]);

  /** neoforge 数据子目录名（位于 neoforge_<version>/ 内） */
  const NEOFORGE_DIR_NAME = "neoforge-docs";

// ── Store 实现 ──────────────────────────────────────────────────────────

interface CacheEntry<T> { data: T; expiry: number; }

export interface SearchIndexDetailed {
  results: SearchResult[];
  requestedVersion: string;
  resolvedVersion: string;
  versionFallback: boolean;
}

export class NeoForgeDocStore {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  private indexCache = new Map<string, CacheEntry<unknown>>();
  private fileCache = new Map<string, CacheEntry<string>>();
  private searchCache = new Map<string, TtlCacheEntry<SearchIndexDetailed>>();
  private symbolIndexCache = new Map<string, SymbolIndex>();
  private relatedCache = new Map<string, TtlCacheEntry<SearchResult[]>>();
  private searchLog: Array<{ query: string; version: string; resolvedVersion: string; results: number; timestamp: number }> = [];

  private _validated = false;
  private _lastSearchMeta: Omit<SearchIndexDetailed, "results"> | null = null;

  /**
   * @param dataDir 数据根目录（包含所有 neoforge_<version> 子目录的根）。
   *                通常是 `resolveDataDir()` 返回的 `data/` 路径。
   *                内部路径拼接：`<dataDir>/neoforge_<version>/${NEOFORGE_DIR_NAME}/<version>/`
   */
  constructor(private readonly dataDir: string) {}

  getLastSearchMeta(): Omit<SearchIndexDetailed, "results"> | null {
    return this._lastSearchMeta;
  }

  getSymbolIndexBuildGeneration(version: string): number {
    const effective = this.resolveEffectiveVersion(version);
    return this.symbolIndexCache.get(effective)?.buildGeneration ?? 0;
  }

  // ── 懒加载校验 ────────────────────────────────────────────────────────────

  private ensureValidated(): void {
    if (this._validated) return;
    this._validated = true;
    if (!existsSync(this.dataDir)) {
      throw new PlatformDataMissingError("neoforge");
    }
    // 无 neoforge_* 且无 forge_1.20.1 兼容数据时视为未下载
    if (this.getAvailableVersionsUnchecked().length === 0) {
      throw new PlatformDataMissingError("neoforge");
    }
  }

  /** 给定 version，返回 `<dataDir>/neoforge_<version>/${NEOFORGE_DIR_NAME}/<version>/` */
  private versionDataDir(version: string): string {
    return join(this.dataDir, `neoforge_${version}`, NEOFORGE_DIR_NAME, version);
  }

  // ── 工具方法 ────────────────────────────────────────────────────────────

  /** 解析版本目录路径（支持 Forge 兼容回退） */
  private resolveVersionDir(version: string): string {
    const effectiveVersion = this.resolveEffectiveVersion(version);
    const nested = this.versionDataDir(effectiveVersion);
    if (existsSync(join(nested, "index-l0.json"))) return nested;

    // NeoForge 1.20.1：回退到 Forge 1.20.1 文档（API 语义兼容）
    if (FORGE_COMPATIBLE_VERSIONS.has(version) || FORGE_COMPATIBLE_VERSIONS.has(effectiveVersion)) {
      const forgeCompat = join(this.dataDir, "forge_1.20.1", "forge-docs", "1.20.1");
      if (existsSync(join(forgeCompat, "index-l0.json"))) return forgeCompat;
    }

    // Fallback: dataDir 直接包含 index-l0.json（兼容单版本目录）
    if (existsSync(join(this.dataDir, "index-l0.json"))) return this.dataDir;

    // Version fallback
    const fallback = ownGet(VERSION_FALLBACK, version);
    if (fallback) {
      const fallbackNested = this.versionDataDir(fallback);
      if (existsSync(join(fallbackNested, "index-l0.json"))) return fallbackNested;
    }

    // 找不到时返回原始拼接路径（让后续 loadIndex 抛 VersionNotFoundError）
    return nested;
  }

  /** 扁平布局（data / *-docs）时不要把目录名当 MC 版本。 */
  private effectiveVersionLabel(resolvedVersionDir: string, version: string): string {
    const base = basename(resolvedVersionDir);
    const FLAT = new Set(["data", "neoforge-docs", "forge-docs", "fabric-docs", "docs"]);
    if (!base || FLAT.has(base) || /-docs$/i.test(base)) {
      return this.resolveEffectiveVersion(version);
    }
    return base;
  }

  /** 本版是否有独立主文档树（含 NeoForge 1.20.1 的 Forge 兼容数据） */
  hasOwnDocTree(version: string): boolean {
    if (existsSync(join(this.versionDataDir(version), "index-l0.json"))) return true;
    if (FORGE_COMPATIBLE_VERSIONS.has(version)) {
      return existsSync(join(this.dataDir, "forge_1.20.1", "forge-docs", "1.20.1", "index-l0.json"));
    }
    return false;
  }

  /**
   * 解析请求版本 → 实际数据版本。
   * 先看本版 index-l0，有则禁止 VERSION_FALLBACK 抢先跳到邻档。
   */
  resolveEffectiveVersion(version: string): string {
    if (this.hasOwnDocTree(version)) return version;
    const fallback = ownGet(VERSION_FALLBACK, version);
    if (fallback && this.hasOwnDocTree(fallback)) return fallback;
    return version;
  }

  describeVersionResolution(version: string): {
    requested: string;
    resolved: string;
    versionFallback: boolean;
    mainDocsMissing: boolean;
    /** resolved 数据实际来自哪个平台（Forge 兼容层时为 "forge"） */
    sourcePlatform: "neoforge" | "forge";
    /** sourcePlatform 为 forge 时的实际数据版本（如 "1.20.1"） */
    sourceVersion?: string;
    warning?: string;
  } {
    const resolved = this.resolveEffectiveVersion(version);
    const own = this.hasOwnDocTree(version);
    const versionFallback = !own && resolved !== version && this.hasOwnDocTree(resolved);
    const mainDocsMissing = !own && !this.hasOwnDocTree(resolved);
    // 1.20.1 的"本版树"是 forge_1.20.1 兼容数据：正文来自 Forge，必须对调用方可见（F-D104）
    const forgeCompatible = FORGE_COMPATIBLE_VERSIONS.has(version) || FORGE_COMPATIBLE_VERSIONS.has(resolved);
    const sourcePlatform: "neoforge" | "forge" =
      forgeCompatible && !existsSync(join(this.versionDataDir(version), "index-l0.json")) ? "forge" : "neoforge";
    const sourceVersion = sourcePlatform === "forge" ? "1.20.1" : resolved;
    let warning: string | undefined;
    if (versionFallback) {
      warning = `请求版本 ${version} 无独立主文档树，已降级到 ${resolved}。不要把 ${resolved} 规则/全文当成 ${version}。`;
    } else if (mainDocsMissing) {
      warning =
        version === "1.20.5"
          ? "NeoForge 无独立 1.20.5 主文档树（不要建空树，也不要读 1.20.4/1.20.6 的 00–10）。Primer 仍可按 to 命中；请用 get_migration_guide 或 search 的 source=primer。"
          : `NeoForge 无独立 ${version} 主文档树。未建档版本禁止读邻档 00–10，请改口 search_neoforge_docs / get_migration_guide。`;
    }
    return {
      requested: version,
      resolved,
      versionFallback,
      mainDocsMissing,
      sourcePlatform,
      ...(sourceVersion !== undefined ? { sourceVersion } : {}),
      warning,
    };
  }

  private isCacheValid<T>(entry: CacheEntry<T> | undefined): boolean {
    return entry !== undefined && Date.now() < entry.expiry;
  }

  private getCache<T>(map: Map<string, CacheEntry<T>>, key: string): T | undefined {
    const entry = map.get(key);
    if (this.isCacheValid(entry)) return entry!.data;
    map.delete(key);
    return undefined;
  }

  private setCache<T>(map: Map<string, CacheEntry<T>>, key: string, data: T): void {
    map.set(key, { data, expiry: Date.now() + NeoForgeDocStore.CACHE_TTL });
  }

  private loadIndex(version: string, name: string): unknown {
    this.ensureValidated();
    const versionDir = this.resolveVersionDir(version);
    const cacheKey = `${version}|${name}`;
    const cached = this.getCache(this.indexCache, cacheKey);
    if (cached !== undefined) return cached;

    const path = join(versionDir, `${name}.json`);
    if (!existsSync(path)) {
      throw new VersionNotFoundError(version, this.getAvailableVersions());
    }
    let data: unknown;
    try {
      data = JSON.parse(readFileSync(path, "utf-8"));
    } catch {
      throw new IndexCorruptError(version, path);
    }
    this.setCache(this.indexCache, cacheKey, data);
    return data;
  }

  private loadFile(versionDir: string, processedFile: string): string {
    this.ensureValidated();
    const cacheKey = `${versionDir}|${processedFile}`;
    const cached = this.getCache(this.fileCache, cacheKey);
    if (cached !== undefined) return cached;

    const path = join(versionDir, processedFile);
    if (!existsSync(path)) {
      throw new DocNotFoundError(processedFile, basename(versionDir));
    }
    const data = readFileSync(path, "utf-8");
    this.setCache(this.fileCache, cacheKey, data);
    return data;
  }

  // ── 公开 API ──────────────────────────────────────────────────────────

  getAvailableVersions(): string[] {
    this.ensureValidated();
    return this.getAvailableVersionsUnchecked();
  }

  private getAvailableVersionsUnchecked(): string[] {
    if (!existsSync(this.dataDir)) return [];
    try {
      const versions = readdirSync(this.dataDir, { withFileTypes: true })
        .filter((d: Dirent) => d.isDirectory() && d.name.startsWith("neoforge_") && d.name !== "neoforge_javadoc")
        .map((d: Dirent) => d.name.replace(/^neoforge_/, ""))
        .filter(v => existsSync(join(this.versionDataDir(v), "index-l0.json")));

      // 1.20.1：无独立 neoforge_1.20.1 时，若 Forge 文档可用则列入
      const forgeCompat = join(this.dataDir, "forge_1.20.1", "forge-docs", "1.20.1", "index-l0.json");
      if (existsSync(forgeCompat) && !versions.includes("1.20.1")) {
        versions.push("1.20.1");
      }

      return versions.sort((a, b) => {
        const pa = a.split(".").map(Number);
        const pb = b.split(".").map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
          const da = pa[i] ?? 0, db = pb[i] ?? 0;
          if (da !== db) return db - da;
        }
        return 0;
      });
    } catch { return []; }
  }

  searchIndex(query: string, version: string, tags?: string[]): SearchResult[] {
    return this.searchIndexDetailed(query, version, tags).results;
  }

  searchIndexDetailed(query: string, version: string, tags?: string[]): SearchIndexDetailed {
    const cacheKey = `${query}|${version}|${(tags ?? []).join(",")}`;
    const cached = ttlCacheGet(this.searchCache, cacheKey);
    if (cached) {
      this._lastSearchMeta = {
        requestedVersion: cached.requestedVersion,
        resolvedVersion: cached.resolvedVersion,
        versionFallback: cached.versionFallback,
      };
      return cached;
    }

    let l0: SearchResult[];
    try {
      l0 = this.loadIndex(version, "index-l0") as SearchResult[];
    } catch (e) {
      this._lastSearchMeta = {
        requestedVersion: version,
        resolvedVersion: version,
        versionFallback: false,
      };
      throw e;
    }
    if (!Array.isArray(l0) || l0.length === 0) {
      const empty: SearchIndexDetailed = {
        results: [],
        requestedVersion: version,
        resolvedVersion: version,
        versionFallback: false,
      };
      this._lastSearchMeta = empty;
      return empty;
    }

    const resolvedVersionDir = this.resolveVersionDir(version);
    const effectiveVersion = this.effectiveVersionLabel(resolvedVersionDir, version);
    const versionFallback = effectiveVersion !== version;

    const symbolIndex = this.getOrBuildSymbolIndex(version, effectiveVersion);
    const normalizedTags = tags?.map((t) => t.toLowerCase().replace(/-/g, ""));

    const scored = enhancedSearch({
      query,
      l0,
      symbolIndex,
      tags: normalizedTags,
      limit: 20,
      minTokenLength: 2,
    });
    // 保留 score，与 search_neoforge_docs 描述中的「相关性评分」一致
    const top = scored.map((e) => ({
      ...e,
      version: effectiveVersion,
    })) as SearchResult[];

    const detailed: SearchIndexDetailed = {
      results: top,
      requestedVersion: version,
      resolvedVersion: effectiveVersion,
      versionFallback,
    };
    this._lastSearchMeta = {
      requestedVersion: version,
      resolvedVersion: effectiveVersion,
      versionFallback,
    };
    ttlCacheSet(this.searchCache, cacheKey, detailed, 256, NeoForgeDocStore.CACHE_TTL);

    this.searchLog.push({
      query, version, resolvedVersion: effectiveVersion,
      results: top.length, timestamp: Date.now(),
    });
    if (this.searchLog.length > 500) this.searchLog.splice(0, 100);

    return detailed;
  }

  getSearchLog() {
    return [...this.searchLog];
  }

  private getOrBuildSymbolIndex(requested: string, effective: string): SymbolIndex | null {
    const cacheKey = effective;
    const cached = this.symbolIndexCache.get(cacheKey);
    if (cached) return cached;
    try {
      const versionDir = this.resolveVersionDir(requested);
      const l1Path = join(versionDir, "index-l1.json");
      if (!existsSync(l1Path)) return null;
      const byteSize = statSync(l1Path).size;
      const l1 = this.loadIndex(requested, "index-l1") as SummaryResult[];
      if (!Array.isArray(l1)) return null;
      const idx = buildSymbolIndex(l1, { byteSize, generation: 1 });
      this.symbolIndexCache.set(cacheKey, idx);
      return idx;
    } catch {
      return null;
    }
  }

  loadSummary(pageId: string, version: string): SummaryResult {
    const l1 = this.loadIndex(version, "index-l1") as SummaryResult[];
    if (!Array.isArray(l1)) throw new DocNotFoundError(pageId, version);
    const found = this.findByFlexibleId(l1, pageId, version);
    if (!found) throw new DocNotFoundError(pageId, version);
    return found;
  }

  /** Forge 式短 id（concepts/registries）与完整 id（1.20.1/concepts_registries）互认 */
  private findByFlexibleId<T extends { id: string }>(
    entries: T[],
    pageId: string,
    version: string,
  ): T | undefined {
    const direct = entries.find((e) => e.id === pageId);
    if (direct) return direct;

    const effective = this.resolveEffectiveVersion(version);
    const underscored = pageId.replace(/\//g, "_");
    const withVersion = pageId.match(/^\d+\.\d+(\.\d+)?\//)
      ? pageId
      : `${effective}/${underscored}`;
    const found = entries.find((e) => e.id === withVersion || e.id.endsWith("/" + underscored));
    if (found) return found;

    // 兼容：传入完整 id 但库内是短路径
    const short = pageId.includes("/")
      ? pageId.replace(/^\d+\.\d+(\.\d+)?\//, "").replace(/_/g, "/")
      : pageId.replace(/_/g, "/");
    return entries.find(
      (e) =>
        e.id === short ||
        e.id.endsWith("/" + short.replace(/\//g, "_")) ||
        e.id.replace(/_/g, "/").endsWith("/" + short),
    );
  }

  async loadFullDoc(pageId: string, version: string, highlightKey = true): Promise<FullDocResult> {
    const l2 = this.loadIndex(version, "index-l2") as L2IndexEntry[];
    if (!Array.isArray(l2)) throw new DocNotFoundError(pageId, version);
    const raw = this.findByFlexibleId(l2, pageId, version);
    if (!raw) throw new DocNotFoundError(pageId, version);

    const resolvedVersionDir = this.resolveVersionDir(version);
    const effectiveVersion = this.effectiveVersionLabel(resolvedVersionDir, version);
    const isForgeCompatible = FORGE_COMPATIBLE_VERSIONS.has(version);

    let content = raw.processedFile
      ? this.loadFile(resolvedVersionDir, raw.processedFile)
      : raw.content || "";

    // 对于 Forge 兼容模式，注入提示
    if (isForgeCompatible && content) {
      const banner = [
        "",
        "> **Forge 兼容文档**",
        "> NeoForge 1.20.1 与 Forge 1.20.1 API 100% 语义兼容。以下内容来自 Forge 1.20.1 文档。",
        "",
      ].join("\n");
      content = banner + content;
    }

    const keyBlocks = highlightKey ? this.extractKeyBlocks(content) : undefined;

    return {
      ...(keyBlocks ? { keyBlocks } : {}),
      content,
      meta: {
        id: raw.id,
        version: effectiveVersion,
        label: raw.label,
        url: raw.url,
        tags: raw.tags,
        sections: raw.sections,
        hasCodeBlocks: raw.hasCodeBlocks,
        codeBlockCount: raw.codeBlockCount,
        keySections: raw.keySections,
        processedFile: raw.processedFile,
        forgeCompatible: isForgeCompatible,
      },
    };
  }

  private extractKeyBlocks(content: string): KeyBlock[] {
    const blocks: KeyBlock[] = [];
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.startsWith("> **")) {
        blocks.push({ type: "admonition", role: "important", text: line });
      } else if (line.startsWith("```")) {
        const codeLines = [line];
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith("```")) {
          codeLines.push(lines[j]);
          j++;
        }
        codeLines.push("```");
        blocks.push({ type: "code", role: "example", text: codeLines.join("\n") });
      } else if (/^#{1,3}\s/.test(line) && (line.toLowerCase().includes("warning") || line.toLowerCase().includes("important"))) {
        blocks.push({ type: "heading", role: "warning", text: line });
      }
    }
    return blocks.slice(0, 5);
  }

  getRelatedDocs(pageId: string, version: string, limit = 5): SearchResult[] {
    const cacheKey = `${pageId}|${version}|${limit}`;
    const hit = ttlCacheGet(this.relatedCache, cacheKey);
    if (hit) return hit;

    const l0 = this.loadIndex(version, "index-l0") as SearchResult[];
    if (!Array.isArray(l0)) throw new DocNotFoundError(pageId, version);
    const target = this.findByFlexibleId(l0, pageId, version);
    if (!target) throw new DocNotFoundError(pageId, version);

    const targetTags = new Set(target.tags ?? []);
    const scored = l0
      .filter(e => e.id !== target.id)
      .map(e => ({ ...e, _score: (e.tags ?? []).filter(t => targetTags.has(t)).length }))
      .filter(e => e._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)
      .map(({ _score, ...rest }) => rest);

    ttlCacheSet(this.relatedCache, cacheKey, scored, 256, NeoForgeDocStore.CACHE_TTL);
    return scored;
  }
}
