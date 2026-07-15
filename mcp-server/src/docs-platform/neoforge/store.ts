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

import { readFileSync, existsSync, readdirSync, type Dirent } from "fs";
import { join, dirname, basename } from "path";

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

// ── 版本降级映射 ─────────────────────────────────────────────────────────

/** 版本 → 回退版本映射 */
const VERSION_FALLBACK: Record<string, string | null> = {
  "26.2": "26.1",
  "1.21.9": "1.21.10",
  "1.21.7": "1.21.8",
  "1.21.4": "1.21.5",
  "1.21.2": "1.21.3",
};

  /** 特殊 Forge 兼容版本 */
  const FORGE_COMPATIBLE_VERSIONS = new Set(["1.20.1"]);

  /** neoforge 数据子目录名（位于 neoforge_<version>/ 内） */
  const NEOPORGE_DIR_NAME = "neoforge-docs";

// ── Store 实现 ──────────────────────────────────────────────────────────

interface CacheEntry<T> { data: T; expiry: number; }

const STOP_WORDS = new Set([
  "the", "and", "of", "to", "a", "in", "is", "it", "for", "on",
  "with", "as", "by", "at", "from", "or", "an", "be", "this",
  "that", "are", "was", "were", "has", "have", "had", "not",
  "how", "what", "when", "where", "which", "who", "can", "will",
]);

export class NeoForgeDocStore {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  private indexCache = new Map<string, CacheEntry<unknown>>();
  private fileCache = new Map<string, CacheEntry<string>>();
  private searchCache = new Map<string, CacheEntry<unknown>>();
  private relatedCache = new Map<string, SearchResult[]>();
  private searchLog: Array<{ query: string; version: string; resolvedVersion: string; results: number; timestamp: number }> = [];

  private _validated = false;

  /**
   * @param dataDir 数据根目录（包含所有 neoforge_<version> 子目录的根）。
   *                通常是 `resolveDataDir()` 返回的 `data/` 路径。
   *                内部路径拼接：`<dataDir>/neoforge_<version>/${NEOPORGE_DIR_NAME}/<version>/`
   */
  constructor(private readonly dataDir: string) {}

  // ── 懒加载校验 ────────────────────────────────────────────────────────────

  private ensureValidated(): void {
    if (this._validated) return;
    this._validated = true;
    if (!existsSync(this.dataDir)) {
      throw new Error(
        `数据目录不存在: ${this.dataDir}\n` +
        `请确保数据已抓取：node scripts/fetch-neoforge-docs.js`
      );
    }
  }

  /** 给定 version，返回 `<dataDir>/neoforge_<version>/${NEOPORGE_DIR_NAME}/<version>/` */
  private versionDataDir(version: string): string {
    return join(this.dataDir, `neoforge_${version}`, NEOPORGE_DIR_NAME, version);
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
    const fallback = VERSION_FALLBACK[version];
    if (fallback) {
      const fallbackNested = this.versionDataDir(fallback);
      if (existsSync(join(fallbackNested, "index-l0.json"))) return fallbackNested;
    }

    // 找不到时返回原始拼接路径（让后续 loadIndex 抛 VersionNotFoundError）
    return nested;
  }

  /** 解析请求版本 → 实际数据版本（用于 Forge 兼容模式判断） */
  private resolveEffectiveVersion(version: string): string {
    if (FORGE_COMPATIBLE_VERSIONS.has(version)) return version;
    const fallback = VERSION_FALLBACK[version];
    if (fallback && !FORGE_COMPATIBLE_VERSIONS.has(fallback)) {
      const nested = this.versionDataDir(fallback);
      if (existsSync(join(nested, "index-l0.json"))) return fallback;
    }
    return version;
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
    const data = JSON.parse(readFileSync(path, "utf-8"));
    this.setCache(this.indexCache, cacheKey, data);
    return data;
  }

  private loadFile(versionDir: string, processedFile: string): string {
    this.ensureValidated();
    const cacheKey = `${versionDir}|${processedFile}`;
    const cached = this.getCache(this.fileCache, cacheKey);
    if (cached !== undefined) return cached;

    const path = join(versionDir, processedFile);
    if (!existsSync(path)) return "";
    const data = readFileSync(path, "utf-8");
    this.setCache(this.fileCache, cacheKey, data);
    return data;
  }

  // ── 公开 API ──────────────────────────────────────────────────────────

  getAvailableVersions(): string[] {
    this.ensureValidated();
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
    const l0 = this.loadIndex(version, "index-l0") as SearchResult[];
    if (!Array.isArray(l0) || l0.length === 0) return [];

    const resolvedVersion = this.resolveVersionDir(version);
    const effectiveVersion = basename(resolvedVersion) || version;

    // 解析查询
    const cleanQuery = query.toLowerCase().replace(/[|]/g, " ").trim();
    const qWords = cleanQuery.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

    if (qWords.length === 0) return [];

    let results: Array<SearchResult & { _score: number }> = [];
    for (const entry of l0) {
      // Tag 过滤
      if (tags && tags.length > 0) {
        const hasTag = tags.some(t => entry.tags.includes(t));
        if (!hasTag) continue;
      }

      const labelLower = entry.label.toLowerCase();
      const idLower = entry.id.toLowerCase();
      const tagsStr = entry.tags.join(" ");

      let score = 0;
      for (const w of qWords) {
        if (labelLower.includes(w)) score += 5;
        if (idLower.includes(w)) score += 3;
        if (tagsStr.includes(w)) score += 2;
        if (entry.priority === "high") score += 1;
      }

      if (score > 0) {
        results.push({ ...entry, version: effectiveVersion, _score: score });
      }
    }

    results.sort((a, b) => b._score - a._score);
    const top = results.slice(0, 20).map(({ _score, ...rest }) => rest);

    this.searchLog.push({
      query, version, resolvedVersion: effectiveVersion,
      results: top.length, timestamp: Date.now(),
    });
    if (this.searchLog.length > 500) this.searchLog.shift();

    return top;
  }

  loadSummary(pageId: string, version: string): SummaryResult {
    const l1 = this.loadIndex(version, "index-l1") as SummaryResult[];
    if (!Array.isArray(l1)) throw new DocNotFoundError(pageId, version);
    const found = l1.find(e => e.id === pageId);
    if (!found) throw new DocNotFoundError(pageId, version);
    return found;
  }

  async loadFullDoc(pageId: string, version: string, highlightKey = true): Promise<FullDocResult> {
    const l2 = this.loadIndex(version, "index-l2") as L2IndexEntry[];
    if (!Array.isArray(l2)) throw new DocNotFoundError(pageId, version);
    const raw = l2.find(e => e.id === pageId);
    if (!raw) throw new DocNotFoundError(pageId, version);

    const resolvedVersionDir = this.resolveVersionDir(version);
    const effectiveVersion = basename(resolvedVersionDir) || version;
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

    const keyBlocks = highlightKey ? this.extractKeyBlocks(content) : [];

    return {
      keyBlocks,
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
    if (this.relatedCache.has(cacheKey)) return this.relatedCache.get(cacheKey)!;

    const l0 = this.loadIndex(version, "index-l0") as SearchResult[];
    if (!Array.isArray(l0)) return [];
    const target = l0.find(e => e.id === pageId);
    if (!target) return [];

    const targetTags = new Set(target.tags);
    const scored = l0
      .filter(e => e.id !== pageId)
      .map(e => ({ ...e, _score: e.tags.filter(t => targetTags.has(t)).length }))
      .filter(e => e._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)
      .map(({ _score, ...rest }) => rest);

    this.relatedCache.set(cacheKey, scored);
    return scored;
  }
}
