/**
 * CommunityDocStore — 社区知识库（community_knowledge/）
 *
 * sourceKind:
 * - permitted: 作者许可提炼正文
 * - authored: 本仓库自写短文
 * - links: 仅外链，getFull 不返回网页正文
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { resolveCommunityDir } from "../../utils/path.js";

export type CommunitySourceKind = "permitted" | "authored" | "links" | "unknown";

export interface CommunityIndexEntry {
  id: string;
  label: string;
  path: string;
  url: string;
  tags: string[];
  sourceKind: CommunitySourceKind;
  priority: string;
  summary: string;
  mcHint?: string;
}

export interface CommunitySearchResult extends CommunityIndexEntry {
  score: number;
}

export interface CommunitySummaryResult {
  id: string;
  label: string;
  sourceKind: CommunitySourceKind;
  summary: string;
  url: string;
  tags: string[];
  path: string;
  mcHint?: string;
}

export interface CommunityFullResult {
  id: string;
  label: string;
  sourceKind: CommunitySourceKind;
  content: string;
  url: string;
  tags: string[];
  path: string;
  linkOnly: boolean;
  disclaimer?: string;
  truncated?: boolean;
  warning?: string;
}

const FRONTMATTER_MAX_BYTES = 2048;
const FRONTMATTER_MAX_LINES = 40;
const GET_FULL_MAX_BYTES = 256 * 1024;

/** 只剥文件头第一对 YAML frontmatter，避免吃掉正文里的 `---`。 */
export function stripLeadingFrontmatter(content: string): string {
  if (!content.startsWith("---")) return content;
  const nl = content.includes("\r\n") ? "\r\n" : "\n";
  const lines = content.split(/\r?\n/);
  if (lines[0].trim() !== "---") return content;
  let consumed = lines[0].length + nl.length;
  for (let i = 1; i < lines.length && i <= FRONTMATTER_MAX_LINES && consumed <= FRONTMATTER_MAX_BYTES + 16; i++) {
    if (lines[i].trim() === "---") {
      return lines.slice(i + 1).join(nl).replace(/^[\r\n]+/, "");
    }
    consumed += lines[i].length + nl.length;
  }
  return content;
}

interface IndexFile {
  version: number;
  entries: CommunityIndexEntry[];
}

export class CommunityDocNotFoundError extends Error {
  code = "DOC_NOT_FOUND" as const;
  constructor(public id: string) {
    super(`Community doc not found: ${id}`);
  }
}

/** 英文按空白/符号切；连续汉字整段保留并加 2 字滑窗 */
export function tokenizeCommunityQuery(q: string): string[] {
  const out: string[] = [];
  const parts = q.split(/[\s,;|/]+/).filter(Boolean);
  for (const p of parts) {
    out.push(p);
    const cjk = p.match(/[\u4e00-\u9fff]+/g);
    if (cjk) {
      for (const run of cjk) {
        out.push(run);
        if (run.length >= 2) {
          for (let i = 0; i < run.length - 1; i++) out.push(run.slice(i, i + 2));
        }
      }
    }
  }
  return [...new Set(out.filter((t) => t.length > 0))];
}

export class CommunityDocStore {
  private static readonly INDEX_TTL_MS = 5 * 60 * 1000;
  private root: string;
  private entries: CommunityIndexEntry[] | null = null;
  private entriesLoadedAt = 0;
  private indexWarning: string | null = null;

  constructor(root?: string) {
    this.root = root ?? resolveCommunityDir();
  }

  getRoot(): string {
    return this.root;
  }

  getIndexWarning(): string | null {
    this.loadIndex();
    return this.indexWarning;
  }

  private emptyIndexWarning(): string {
    return `MC_SKILL_COMMUNITY（或默认根）指向空/缺索引目录：${this.root}`;
  }

  private loadIndex(): CommunityIndexEntry[] {
    if (this.entries && Date.now() - this.entriesLoadedAt < CommunityDocStore.INDEX_TTL_MS) {
      return this.entries;
    }
    const indexPath = join(this.root, "indexes", "index-l0.json");
    if (!existsSync(indexPath)) {
      this.entries = [];
      this.entriesLoadedAt = Date.now();
      this.indexWarning = this.emptyIndexWarning();
      return this.entries;
    }
    try {
      const raw = JSON.parse(readFileSync(indexPath, "utf8")) as IndexFile;
      this.entries = raw.entries ?? [];
      this.entriesLoadedAt = Date.now();
      if (this.entries.length === 0) this.indexWarning = this.emptyIndexWarning();
      else this.indexWarning = null;
      return this.entries;
    } catch {
      // eslint-disable-next-line no-console
      console.error(`[mc-mcp-server] WARN: 无法解析 community index-l0.json：${indexPath}`);
      this.entries = [];
      this.entriesLoadedAt = Date.now();
      this.indexWarning = this.emptyIndexWarning();
      return this.entries;
    }
  }

  listReadableEntries(): CommunityIndexEntry[] {
    return this.loadIndex().filter((e) => e.sourceKind === "authored" || e.sourceKind === "permitted");
  }

  listSources(): {
    root: string;
    total: number;
    byKind: Record<string, number>;
    tags: string[];
    warning?: string;
  } {
    const entries = this.loadIndex();
    const byKind: Record<string, number> = {};
    const tagSet = new Set<string>();
    for (const e of entries) {
      byKind[e.sourceKind] = (byKind[e.sourceKind] ?? 0) + 1;
      for (const t of e.tags ?? []) tagSet.add(t);
    }
    return {
      root: this.root,
      total: entries.length,
      byKind,
      tags: [...tagSet].sort(),
      ...(this.indexWarning ? { warning: this.indexWarning } : {}),
    };
  }

  /** 读正文进检索（links 跳过；体积封顶，避免偶发超大文件拖慢） */
  private bodyHaystack(e: CommunityIndexEntry): string {
    if (e.sourceKind === "links") return "";
    const filePath = join(this.root, e.path);
    if (!existsSync(filePath)) return "";
    try {
      let content = readFileSync(filePath, "utf8");
      content = stripLeadingFrontmatter(content);
      return content.slice(0, 12_000).toLowerCase();
    } catch {
      return "";
    }
  }

  search(
    query: string,
    opts?: { sourceKind?: CommunitySourceKind; tags?: string[]; limit?: number },
  ): CommunitySearchResult[] {
    const q = query.toLowerCase().trim();
    const tokens = tokenizeCommunityQuery(q);
    // 空查询不应「列出前 N 条」——容易被当成命中；请用 list_community_sources
    if (!tokens.length) return [];

    let entries = this.loadIndex();
    if (opts?.sourceKind) {
      entries = entries.filter((e) => e.sourceKind === opts.sourceKind);
    }
    if (opts?.tags?.length) {
      entries = entries.filter((e) =>
        opts.tags!.every((t) => e.tags.map((x) => x.toLowerCase()).includes(t.toLowerCase())),
      );
    }
    const scored: CommunitySearchResult[] = [];
    for (const e of entries) {
      const meta = `${e.id} ${e.label} ${e.summary} ${(e.tags ?? []).join(" ")} ${e.mcHint ?? ""} ${e.url ?? ""}`.toLowerCase();
      const body = this.bodyHaystack(e);
      const hay = `${meta}\n${body}`;
      let score = 0;
      for (const t of tokens) {
        if (meta.includes(t)) score += t.length >= 2 ? 2 : 1;
        if (e.id.toLowerCase().includes(t)) score += 2;
        if (e.label.toLowerCase().includes(t)) score += 3;
        // 正文命中权重略低，避免长文淹没标题匹配
        if (body && body.includes(t)) score += t.length >= 2 ? 1 : 0;
      }
      if (score > 0) scored.push({ ...e, score });
    }
    scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    return scored.slice(0, opts?.limit ?? 20);
  }

  getById(id: string): CommunityIndexEntry | undefined {
    return this.loadIndex().find((e) => e.id === id);
  }

  getSummary(id: string): CommunitySummaryResult {
    const e = this.getById(id);
    if (!e) {
      throw new CommunityDocNotFoundError(id);
    }
    return {
      id: e.id,
      label: e.label,
      sourceKind: e.sourceKind,
      summary: e.summary,
      url: e.url,
      tags: e.tags,
      path: e.path,
      mcHint: e.mcHint,
    };
  }

  getFull(id: string): CommunityFullResult {
    const e = this.getById(id);
    if (!e) {
      throw new CommunityDocNotFoundError(id);
    }
    if (e.sourceKind === "links") {
      return {
        id: e.id,
        label: e.label,
        sourceKind: e.sourceKind,
        content: "",
        url: e.url,
        tags: e.tags,
        path: e.path,
        linkOnly: true,
        disclaimer:
          "此条目为外链 stub（无全文入库许可）。请打开 url 阅读原文；请勿假定 MCP 已抓取网页正文。",
      };
    }
    const filePath = join(this.root, e.path);
    if (!existsSync(filePath)) {
      throw new Error(`Community doc file missing: ${e.path}`);
    }
    let content = stripLeadingFrontmatter(readFileSync(filePath, "utf8"));
    let truncated = false;
    if (Buffer.byteLength(content, "utf8") > GET_FULL_MAX_BYTES) {
      truncated = true;
      let end = GET_FULL_MAX_BYTES;
      const buf = Buffer.from(content, "utf8");
      while (end > 0 && (buf[end] & 0xc0) === 0x80) end--;
      content = buf.subarray(0, end).toString("utf8");
    }
    return {
      id: e.id,
      label: e.label,
      sourceKind: e.sourceKind,
      content,
      url: e.url,
      tags: e.tags,
      path: e.path,
      linkOnly: false,
      ...(truncated
        ? { truncated: true, warning: `正文超过 ${GET_FULL_MAX_BYTES} 字节，已截断` }
        : {}),
    };
  }
}

let singleton: CommunityDocStore | null = null;

export function getCommunityDocStore(): CommunityDocStore {
  if (!singleton) singleton = new CommunityDocStore();
  return singleton;
}
