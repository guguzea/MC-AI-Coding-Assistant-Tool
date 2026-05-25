/**
 * ForgeDocStore — Forge 官方文档数据访问层
 *
 * 职责：
 * - 按版本缓存 index JSON（懒加载 + TTL）
 * - 按版本缓存 processed/*.md 文件内容
 * - 提供 searchIndex / loadSummary / loadFullDoc 三个查询接口
 *
 * 缓存策略：
 * - index JSON：首次访问时从磁盘读，后续全在内存过滤
 * - 文件内容：读取后缓存 5 分钟
 */

import { readFileSync, existsSync, readdirSync, type Dirent } from "fs";
import { join } from "path";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

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

export class DocNotFoundError extends Error {
  constructor(public id: string, public version: string) {
    super(`Forge 文档未找到: ${id} (版本 ${version})`);
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

// ── Store 实现 ──────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class ForgeDocStore {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  /** 按 `${version}/${indexName}` 缓存 index JSON */
  private indexCache = new Map<string, CacheEntry<unknown>>();

  /** 按 `${version}/${processedFile}` 缓存文件内容 */
  private fileCache = new Map<string, CacheEntry<string>>();

  /** 搜索结果缓存（key = "query|version|tags"，TTL 5 分钟） */
  private searchCache = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly dataDir: string) {}

  // ── 公开 API ──────────────────────────────────────────────────────────

  /**
   * L0 索引搜索。
   * - 首次调用时从磁盘加载 index-l0.json 并缓存
   * - 之后全在内存中过滤（query 模糊匹配 + tags 精确过滤）
   * - 搜索结果缓存（key = "query|version|tags"，TTL 5 分钟）
   * - 按 priority 排序（⭐ > 🟡 > 🟢），最多返回 10 条
   */
  searchIndex(
    query: string,
    version: string,
    tags?: string[],
  ): SearchResult[] {
    // 缓存命中检查
    const cacheKey = `${query}|${version}|${(tags ?? []).join(",")}`;
    const cached = this.searchCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as SearchResult[];
    }

    const index = this.loadIndexL0(version);
    const q = query.toLowerCase().trim();

    // 标签归一化：小写 + 去连字符
    const normalizedTags = (tags ?? []).map((t) =>
      t.toLowerCase().replace(/-/g, ""),
    );

    const results = index
      .filter((e) => {
        const labelMatch =
          q === "" ||
          e.label.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.url && e.url.toLowerCase().includes(q));

        const tagMatch =
          normalizedTags.length === 0 ||
          normalizedTags.every((wanted) =>
            e.tags.some((t) =>
              t.toLowerCase().replace(/-/g, "").includes(wanted),
            ),
          );

        return labelMatch && tagMatch;
      })
      .sort((a, b) => {
        const order: Record<string, number> = { "⭐": 0, "🟡": 1, "🟢": 2 };
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
      })
      .slice(0, 10);

    // 写入缓存
    this.searchCache.set(cacheKey, {
      data: results,
      expiry: Date.now() + ForgeDocStore.CACHE_TTL,
    });

    return results;
  }

  /**
   * L1 摘要加载。
   * - 从 index-l1.json 中查找条目
   * - 找不到时抛出 DocNotFoundError
   */
  loadSummary(id: string, version: string): SummaryResult {
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
  loadFullDoc(
    id: string,
    version: string,
    highlightKey?: boolean,
  ): FullDocResult {
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
      const filepath = join(this.dataDir, version, meta.processedFile);
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
      join(this.dataDir, version, "index-l0.json"),
      version,
    );
  }

  private loadIndexL1(version: string): SummaryResult[] {
    return this.loadCachedIndex<SummaryResult[]>(
      `l1-${version}`,
      join(this.dataDir, version, "index-l1.json"),
      version,
    );
  }

  private loadIndexL2(version: string): import("./types.js").L2Entry[] {
    return this.loadCachedIndex<import("./types.js").L2Entry[]>(
      `l2-${version}`,
      join(this.dataDir, version, "index-l2.json"),
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

  private getAvailableVersions(): string[] {
    if (!existsSync(this.dataDir)) return [];
    try {
      return readdirSync(this.dataDir, { withFileTypes: true })
        .filter((d: Dirent) => d.isDirectory() && existsSync(join(this.dataDir, d.name, "index-l0.json")))
        .map((d: Dirent) => d.name);
    } catch {
      return [];
    }
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
