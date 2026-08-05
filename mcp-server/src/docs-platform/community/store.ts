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
}

interface IndexFile {
  version: number;
  entries: CommunityIndexEntry[];
}

export class CommunityDocStore {
  private root: string;
  private entries: CommunityIndexEntry[] | null = null;

  constructor(root?: string) {
    this.root = root ?? resolveCommunityDir();
  }

  getRoot(): string {
    return this.root;
  }

  private loadIndex(): CommunityIndexEntry[] {
    if (this.entries) return this.entries;
    const indexPath = join(this.root, "indexes", "index-l0.json");
    if (!existsSync(indexPath)) {
      this.entries = [];
      return this.entries;
    }
    const raw = JSON.parse(readFileSync(indexPath, "utf8")) as IndexFile;
    this.entries = raw.entries ?? [];
    return this.entries;
  }

  listSources(): {
    root: string;
    total: number;
    byKind: Record<string, number>;
    tags: string[];
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
    };
  }

  search(
    query: string,
    opts?: { sourceKind?: CommunitySourceKind; tags?: string[]; limit?: number },
  ): CommunitySearchResult[] {
    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);
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
      const hay = `${e.id} ${e.label} ${e.summary} ${(e.tags ?? []).join(" ")} ${e.mcHint ?? ""}`.toLowerCase();
      let score = 0;
      if (!tokens.length) score = 1;
      else {
        for (const t of tokens) {
          if (hay.includes(t)) score += t.length >= 2 ? 2 : 1;
          if (e.id.toLowerCase().includes(t)) score += 2;
          if (e.label.toLowerCase().includes(t)) score += 3;
        }
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
      throw new Error(`Community doc not found: ${id}`);
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
      throw new Error(`Community doc not found: ${id}`);
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
    let content = readFileSync(filePath, "utf8");
    if (content.startsWith("---")) {
      const end = content.indexOf("\n---", 3);
      if (end >= 0) content = content.slice(end + 4).replace(/^\r?\n/, "");
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
    };
  }
}

let singleton: CommunityDocStore | null = null;

export function getCommunityDocStore(): CommunityDocStore {
  if (!singleton) singleton = new CommunityDocStore();
  return singleton;
}
