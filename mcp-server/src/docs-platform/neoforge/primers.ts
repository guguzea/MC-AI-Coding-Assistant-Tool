/**
 * NeoForge Primer 旁路索引（data/neoforge_primers/*.md）。
 * 不拷进 neoforge-docs API 树。search_neoforge_docs 只合并 loader=neoforge 的条目。
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../../utils/path.js";
import { ownGet } from "../../utils/own-record.js";
import type { SearchResult } from "./store.js";

export type PrimerLoader = "neoforge" | "forge" | "fork";

export interface PrimerEntry {
  id: string;
  slug: string;
  title: string;
  from: string;
  to: string;
  url: string;
  license: string;
  loader: PrimerLoader;
  filePath: string;
  body: string;
  headings: string[];
}

/** 请求版 → 额外匹配 primer.to（避免 1.21.1 漏掉 slug to=1.21；禁止 1.21.11 误配 1.21） */
const VERSION_ALIASES: Record<string, string[]> = {
  "1.21.1": ["1.21"],
  "26.1.1": ["26.1"],
  "26.1.2": ["26.1"],
};

function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { fm, body: m[2] };
}

function compareMcVersion(a: string, b: string): number {
  const pa = a.split(".").map((x) => Number.parseInt(x, 10) || 0);
  const pb = b.split(".").map((x) => Number.parseInt(x, 10) || 0);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

/** 1.20.2+（含 1.20.5、26.x）→ neoforge；1.20 / 1.20.1 → fork；更早 → forge */
export function inferPrimerLoader(to: string): PrimerLoader {
  if (!to) return "neoforge";
  if (to.startsWith("26.")) return "neoforge";
  if (to === "1.20" || to === "1.20.1") return "fork";
  if (compareMcVersion(to, "1.20.2") >= 0) return "neoforge";
  return "forge";
}

function extractHeadings(body: string): string[] {
  const out: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const h = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (h) out.push(h[2].replace(/[\u200b\u200c]/g, "").trim());
  }
  return out.slice(0, 80);
}

function normalizeHeading(s: string): string {
  return s.replace(/[\u200b\u200c]/g, "").trim().toLowerCase();
}

/** 按 ## / ### 切章；section 用子串匹配标题（不含全文）。 */
export function extractPrimerSection(
  body: string,
  sectionQuery: string,
): { heading: string; content: string } | null {
  const q = normalizeHeading(sectionQuery);
  if (!q) return null;
  const lines = body.split(/\r?\n/);
  const parts: { heading: string; start: number; end: number }[] = [];
  let current: { heading: string; start: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (h) {
      if (current) parts.push({ heading: current.heading, start: current.start, end: i });
      current = { heading: h[2].replace(/[\u200b\u200c]/g, "").trim(), start: i };
    }
  }
  if (current) parts.push({ heading: current.heading, start: current.start, end: lines.length });
  const hit =
    parts.find((p) => normalizeHeading(p.heading) === q) ??
    parts.find((p) => normalizeHeading(p.heading).includes(q) || q.includes(normalizeHeading(p.heading)));
  if (!hit) return null;
  return {
    heading: hit.heading,
    content: lines.slice(hit.start, hit.end).join("\n").trim(),
  };
}

let cacheByRoot = new Map<string, { entries: PrimerEntry[]; loadedAt: number }>();
const INDEX_TTL_MS = 5 * 60 * 1000;

export function loadNeoForgePrimers(dataRoot = resolveDataDir()): PrimerEntry[] {
  const hit = cacheByRoot.get(dataRoot);
  if (hit && Date.now() - hit.loadedAt < INDEX_TTL_MS) return hit.entries;
  const dir = join(dataRoot, "neoforge_primers");
  if (!existsSync(dir)) {
    cacheByRoot.set(dataRoot, { entries: [], loadedAt: Date.now() });
    return [];
  }
  const entries: PrimerEntry[] = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const filePath = join(dir, name);
    let raw: string;
    try {
      raw = readFileSync(filePath, "utf8");
    } catch (err) {
      console.warn(`[primers] skip unreadable ${filePath}: ${(err as Error).message}`);
      continue;
    }
    const { fm, body } = parseFrontmatter(raw);
    const slug = (fm.primerKey || name.replace(/\.md$/, "")).trim();
    const to = (fm.to || slug).trim();
    const from = (fm.from || "").trim();
    const loaderFm = (fm.loader || "").toLowerCase();
    const loader: PrimerLoader =
      loaderFm === "neoforge" || loaderFm === "forge" || loaderFm === "fork"
        ? loaderFm
        : inferPrimerLoader(to);
    entries.push({
      id: `primer/${slug}`,
      slug,
      title: fm.title || `Primer ${from} → ${to}`,
      from,
      to,
      url: fm.url || `https://docs.neoforged.net/primer/docs/${slug}/`,
      license: fm.license || "",
      loader,
      filePath,
      body,
      headings: extractHeadings(body),
    });
  }
  cacheByRoot.set(dataRoot, { entries, loadedAt: Date.now() });
  return entries;
}

/** 测试用 */
export function resetPrimerCache(): void {
  cacheByRoot = new Map();
}

export function primerMatchesVersion(primer: PrimerEntry, version: string): boolean {
  if (!version) return false;
  if (primer.to === version || primer.from === version || primer.slug === version) return true;
  const aliases = ownGet(VERSION_ALIASES, version) ?? [];
  return aliases.includes(primer.to) || aliases.includes(primer.slug);
}

export function isPrimerDocId(id: string): boolean {
  return id.startsWith("primer/") || id.startsWith("primer:");
}

export function primerIdToSlug(id: string): string {
  return id.replace(/^primer[/:]/, "");
}

export function findPrimer(id: string, dataRoot = resolveDataDir()): PrimerEntry | undefined {
  const slug = primerIdToSlug(id);
  return loadNeoForgePrimers(dataRoot).find((p) => p.id === id || p.slug === slug || p.to === slug);
}

function scorePrimer(query: string, primer: PrimerEntry): number {
  const q = query.toLowerCase();
  if (!q.trim()) return primerMatchesVersion(primer, q) ? 1 : 0.2;
  const hay = `${primer.title} ${primer.from} ${primer.to} ${primer.headings.join(" ")}`.toLowerCase();
  let score = 0;
  for (const tok of q.split(/[^a-z0-9_.]+/).filter((t) => t.length >= 2)) {
    if (hay.includes(tok)) score += 8;
    if (primer.body.toLowerCase().includes(tok)) score += 1;
  }
  if (/primer|migrat|porting|port\b/.test(q)) score += 12;
  return score;
}

/** 仅 loader=neoforge 的 Primer 进入 search_neoforge_docs */
export function searchNeoForgePrimers(args: {
  query: string;
  version: string;
  dataRoot?: string;
}): SearchResult[] {
  const dataRoot = args.dataRoot ?? resolveDataDir();
  const primers = loadNeoForgePrimers(dataRoot).filter((p) => p.loader === "neoforge");
  const hits: Array<SearchResult & { _s: number }> = [];
  for (const p of primers) {
    const verHit = primerMatchesVersion(p, args.version);
    const s = scorePrimer(args.query, p) + (verHit ? 20 : 0);
    if (!verHit && s < 16) continue;
    hits.push({
      id: p.id,
      version: p.to,
      label: p.title,
      url: p.url,
      tags: ["primer", "migration", p.loader],
      priority: "high",
      sectionCount: p.headings.length,
      score: s,
      _s: s,
    });
  }
  hits.sort((a, b) => b._s - a._s);
  return hits.slice(0, 8).map(({ _s: _, ...rest }) => ({ ...rest, source: "primer" as const }));
}

export function primerSummaryPayload(primer: PrimerEntry): Record<string, unknown> {
  return {
    ok: true,
    id: primer.id,
    version: primer.to,
    label: primer.title,
    url: primer.url,
    tags: ["primer", "migration", primer.loader],
    firstParagraph: primer.body.split(/\r?\n/).find((l) => l.trim() && !l.startsWith("#")) ?? "",
    sections: primer.headings.slice(0, 40).map((title) => ({
      title,
      level: 2,
      summary: "",
    })),
    source: "primer",
    loader: primer.loader,
    from: primer.from,
    to: primer.to,
    warning:
      primer.loader === "fork"
        ? "1.20 / 1.20.1 Primer 是分叉过渡，loader 以工程为准，不要标成纯 Forge。"
        : undefined,
  };
}

export function primerFullPayload(primer: PrimerEntry, full: boolean): Record<string, unknown> {
  const toc = primer.headings.map((h) => `- ${h}`).join("\n");
  const content = full
    ? primer.body
    : `# ${primer.title}\n\nfrom: ${primer.from} → to: ${primer.to}\n\n${toc}\n\n> 默认只返回目录。全文请 get_migration_guide full=true，或 get_neoforge_doc_full highlight 后自行取用。\n`;
  return {
    ok: true,
    source: "primer",
    loader: primer.loader,
    from: primer.from,
    to: primer.to,
    content,
    meta: {
      id: primer.id,
      version: primer.to,
      label: primer.title,
      url: primer.url,
      tags: ["primer", "migration"],
      sections: primer.headings.slice(0, 40).map((title) => ({ title, level: 2, summary: "" })),
      hasCodeBlocks: /```/.test(primer.body),
      codeBlockCount: Math.floor((primer.body.match(/```/g) ?? []).length / 2),
      keySections: 0,
      processedFile: primer.filePath,
    },
  };
}

export function migrationGuideFromPrimers(args: {
  route: string;
  full?: boolean;
  platform?: string;
  section?: string;
}): Record<string, unknown> {
  const route = args.route.trim();
  const full = args.full === true;
  const sectionQ = args.section?.trim() || "";
  const primers = loadNeoForgePrimers();
  const arrow = route.split(/->|→/).map((s) => s.trim()).filter(Boolean);
  let hit: PrimerEntry | undefined;
  if (arrow.length === 2) {
    hit = primers.find((p) => p.from === arrow[0] && p.to === arrow[1]);
    hit ??= primers.find((p) => p.to === arrow[1] || p.slug === arrow[1]);
  } else {
    hit = primers.find((p) => p.to === route || p.slug === route || p.id === route || p.from === route);
  }
  if (!hit) {
    return {
      found: false,
      route,
      platform: args.platform,
      availableRoutes: primers.map((p) => `${p.from}->${p.to}`),
      hint: "无匹配 Primer。forge->neoforge 等短 bullets 仍可用内置路线。",
    };
  }
  const base = {
    found: true,
    route: `${hit.from}->${hit.to}`,
    platform: args.platform ?? (hit.loader === "forge" ? "forge" : "neoforge"),
    loader: hit.loader,
    source: "primer",
    url: hit.url,
    license: hit.license || undefined,
    title: hit.title,
    toc: hit.headings,
    relatedTools: ["search_neoforge_docs", "analyze_porting_path"],
  };
  const forkWarn =
    hit.loader === "fork"
      ? "1.20 / 1.20.1 分叉过渡：包名以工程为准，不要标成纯 forge。"
      : undefined;
  if (sectionQ) {
    const chap = extractPrimerSection(hit.body, sectionQ);
    if (!chap) {
      return {
        ...base,
        section: sectionQ,
        sectionFound: false,
        content: undefined,
        warning: [forkWarn, `未找到章节 "${sectionQ}"。用返回的 toc 选一个标题再查。`].filter(Boolean).join(" "),
      };
    }
    return {
      ...base,
      section: chap.heading,
      sectionFound: true,
      content: chap.content,
      warning: forkWarn,
    };
  }
  return {
    ...base,
    content: full ? hit.body : undefined,
    warning:
      forkWarn ??
      (full ? undefined : "默认返回目录（toc）。需要某一章传 section；全文传 full=true。"),
  };
}
