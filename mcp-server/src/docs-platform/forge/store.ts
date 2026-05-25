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

import { readFileSync, existsSync, readdirSync, type Dirent } from "fs";
import { join } from "path";

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
        ? version  // message = "请使用 platform: forge（当前唯一支持的平台）"
        : `Forge 文档未找到: ${id} (版本 ${version})`
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

// ── Store 实现 ──────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

/** 搜索去停用词 */
const STOP_WORDS = new Set([
  "the", "and", "of", "to", "a", "in", "is", "it", "for", "on",
  "with", "as", "by", "at", "from", "or", "an", "be", "this",
  "that", "are", "was", "were", "has", "have", "had", "not",
  "how", "what", "when", "where", "which", "who", "can", "will",
]);

export class ForgeDocStore {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 分钟

  /** 按 `${version}/${indexName}` 缓存 index JSON */
  private indexCache = new Map<string, CacheEntry<unknown>>();

  /** 按 `${version}/${processedFile}` 缓存文件内容 */
  private fileCache = new Map<string, CacheEntry<string>>();

  /** 搜索结果缓存（key = "query|version|tags"，TTL 5 分钟） */
  private searchCache = new Map<string, CacheEntry<unknown>>();

  /** 相关文档缓存（以 id|version|limit 为 key） */
  private relatedCache = new Map<string, SearchResult[]>();

  /** 搜索日志（最多 500 条） */
  private searchLog: SearchLogEntry[] = [];

  /** 懒加载校验标志（首次调用文档方法时触发） */
  private _validated = false;

  constructor(private readonly dataDir: string) {}

  // ── 懒加载校验 ────────────────────────────────────────────────────────────

  /**
   * 确保数据目录已验证（懒加载）。
   * 首次调用任何文档方法时触发，检查目录存在性和基本结构。
   */
  private ensureValidated(): void {
    if (this._validated) return;
    this._validated = true;

    if (!existsSync(this.dataDir)) {
      throw new Error(
        `数据目录不存在: ${this.dataDir}\n` +
        `请确保 MC_SKILL_DATA 环境变量指向 "data" 目录的父目录。\n` +
        `示例：MC_SKILL_DATA=/path/to/h-MC-skill/data`
      );
    }
    let hasVersion = false;
    try {
      for (const entry of readdirSync(this.dataDir, { withFileTypes: true })) {
        if (entry.isDirectory() && existsSync(join(this.dataDir, entry.name, "index-l0.json"))) {
          hasVersion = true;
          break;
        }
      }
    } catch { /* readdir 失败 */ }
    if (!hasVersion) {
      throw new Error(
        `数据目录结构不符合预期: ${this.dataDir}\n` +
        `预期结构: <dataDir>/<version>/index-l0.json\n` +
        `常见错误：将 "forge_1.20.1" 当作 dataDir，应传入 "forge_1.20.1/forge-docs"`
      );
    }
  }

  // ── 公开 API ──────────────────────────────────────────────────────────

  /**
   * 返回 data 目录下所有可用版本列表。
   * 用于告知用户当前有哪些版本可用。
   */
  getAvailableVersions(): string[] {
    this.ensureValidated();
    if (!existsSync(this.dataDir)) return [];
    try {
      return readdirSync(this.dataDir, { withFileTypes: true })
        .filter((d: Dirent) => d.isDirectory() && existsSync(join(this.dataDir, d.name, "index-l0.json")))
        .map((d: Dirent) => d.name)
        .sort();
    } catch {
      return [];
    }
  }

  /**
   * L0 索引搜索。
   *
   * 增强功能：
   * - 去停用词（the / and / of 等常见词不参与匹配）
   * - OR 分组：用 | 分割词组，每组内任意词匹配即满足该组
   * - 前缀路由：支持 class: / event: / method: 语义前缀
   * - 前缀时降级：检测到前缀指令时，普通词匹配要求降为"至少 1 个 OR 组"
   * - 无前缀时：多词 query 要求至少匹配 2 个 OR 组（精确优先）
   *
   * 按 priority 排序（⭐ > 🟡 > 🟢），最多返回 10 条。
   */
  searchIndex(
    query: string,
    version: string,
    tags?: string[],
  ): SearchResult[] {
    this.ensureValidated();
    // 缓存命中检查
    const cacheKey = `${query}|${version}|${(tags ?? []).join(",")}`;
    const cached = this.searchCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as SearchResult[];
    }

    const index = this.loadIndexL0(version);

    // 1. 提取前缀指令
    const classMatch = query.match(/^class:(\S+)/i);
    const eventMatch = query.match(/^event:(\S+)/i);
    const methodMatch = query.match(/^method:(\S+)/i);
    const hasPrefix = !!(classMatch || eventMatch || methodMatch);

    // 2. 去停用词 + OR 分组
    const segments = query.split(/\s*\|\s*/);
    const processedTerms: string[][] = [];
    for (const seg of segments) {
      const words = seg.trim().split(/\s+/).filter(w =>
        w.length > 0 && !STOP_WORDS.has(w.toLowerCase()),
      );
      if (words.length > 0) processedTerms.push(words);
    }

    const normalizedTags = (tags ?? []).map(t =>
      t.toLowerCase().replace(/-/g, ""),
    );

    const results = index
      .filter((e) => {
        // 前缀路由
        if (classMatch) {
          const cls = classMatch[1].toLowerCase();
          if (
            !e.label.toLowerCase().includes(cls) &&
            !e.tags.some((t) => t.toLowerCase().includes(cls))
          ) return false;
        }
        if (eventMatch) {
          const ev = eventMatch[1].toLowerCase();
          if (!e.tags.some((t) => t.toLowerCase().includes(ev))) return false;
        }
        if (methodMatch) {
          const m = methodMatch[1].toLowerCase();
          if (!e.tags.some((t) => t.toLowerCase().includes(m))) return false;
        }

        // 标签过滤
        const tagMatch =
          normalizedTags.length === 0 ||
          normalizedTags.every((wanted) =>
            e.tags.some((t) =>
              t.toLowerCase().replace(/-/g, "").includes(wanted),
            ),
          );
        if (!tagMatch) return false;

        // 词匹配
        if (processedTerms.length === 0) return true;

        let matched = 0;
        for (const group of processedTerms) {
          const groupHit = group.some((term) => {
            const t = term.toLowerCase();
            return (
              e.label.toLowerCase().includes(t) ||
              e.tags.some((tag) => tag.toLowerCase().includes(t)) ||
              (e.url && e.url.toLowerCase().includes(t))
            );
          });
          if (groupHit) matched++;
        }
        // 有前缀时降级为至少匹配 1 组
        // 有 OR 分组时（| 分隔），各组为"或"的关系，只需匹配 1 组
        // 无前缀且无 OR 时，多词 query 要求至少匹配 2 个词组（精确优先）
        const hasOr = query.includes("|");
        const minGroups = hasPrefix || hasOr ? 1 : Math.min(2, processedTerms.length);
        return matched >= minGroups;
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

    // 搜索日志
    this.searchLog.push({ query, version, results: results.length, timestamp: Date.now() });
    if (this.searchLog.length > 500) this.searchLog.splice(0, 100);

    return results;
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

    // 当前文档关键词集合：URL path 骨架 + section 标题/摘要
    const pathKws = this.extractPathKeywords(id);
    const sectionKws = current.sections
      .flatMap((s) => [s.title, s.summary])
      .join(" ")
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    const currentKeywords = new Set([...pathKws, ...sectionKws]);

    const results = (l2 as Array<import("./types.js").L2Entry & { overlap: number }>)
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
   * - 从 index-l1.json 中查找条目
   * - 找不到时抛出 DocNotFoundError
   */
  loadSummary(id: string, version: string): SummaryResult {
    this.ensureValidated();
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
    this.ensureValidated();
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
    const parts = id.replace(/^\d+\.\d+\.\d+\//, "").split("/");
    const keywords: string[] = [];
    for (const part of parts) {
      keywords.push(part.toLowerCase());
      // 词根提取（去除常见后缀）
      const root = part
        .replace(/(?:entity|es|s|ing|ed)$/i, "")
        .toLowerCase();
      if (root !== part.toLowerCase() && root.length > 2) {
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
