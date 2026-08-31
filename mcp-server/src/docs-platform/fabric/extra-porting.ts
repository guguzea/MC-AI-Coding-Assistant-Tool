/**
 * Fabric 线上移植页旁路（如 26.1→26.2），不克隆 fabric_26.2 主文档树。
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../../utils/path.js";
import { ownGet } from "../../utils/own-record.js";

export interface FabricPortingPage {
  id: string;
  to: string;
  from: string;
  title: string;
  url: string;
  body: string;
  filePath: string;
}

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

let cacheByRoot = new Map<string, { entries: FabricPortingPage[]; loadedAt: number }>();
const INDEX_TTL_MS = 5 * 60 * 1000;

export function loadFabricPortingPages(dataRoot = resolveDataDir()): FabricPortingPage[] {
  const hit = cacheByRoot.get(dataRoot);
  if (hit && Date.now() - hit.loadedAt < INDEX_TTL_MS) return hit.entries;
  const dir = join(dataRoot, "fabric_porting");
  if (!existsSync(dir)) {
    cacheByRoot.set(dataRoot, { entries: [], loadedAt: Date.now() });
    return [];
  }
  const out: FabricPortingPage[] = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const filePath = join(dir, name);
    let raw: string;
    try {
      raw = readFileSync(filePath, "utf8");
    } catch (err) {
      console.warn(`[extra-porting] skip unreadable ${filePath}: ${(err as Error).message}`);
      continue;
    }
    const { fm, body } = parseFrontmatter(raw);
    const to = fm.to || name.replace(/\.md$/, "");
    out.push({
      id: fm.id || `porting/${to}`,
      to,
      from: fm.from || "",
      title: fm.title || `Fabric porting ${to}`,
      url: fm.url || "https://docs.fabricmc.net/develop/porting/index",
      body,
      filePath,
    });
  }
  cacheByRoot.set(dataRoot, { entries: out, loadedAt: Date.now() });
  return out;
}

export function resetFabricPortingCache(): void {
  cacheByRoot = new Map();
}

export function isFabricPortingId(id: string): boolean {
  return id.startsWith("porting/");
}

export function findFabricPorting(id: string): FabricPortingPage | undefined {
  return loadFabricPortingPages().find((p) => p.id === id || `porting/${p.to}` === id);
}

const PORTING_VERSION_ALIASES: Record<string, string[]> = {
  "26.2": ["26.1"],
};

function versionMatchesPortingPage(version: string, p: FabricPortingPage): boolean {
  if (version === p.to || version === p.from) return true;
  const aliases = ownGet(PORTING_VERSION_ALIASES, version) ?? [];
  return aliases.includes(p.to);
}

export function searchFabricPortingPages(query: string, version: string) {
  const q = query.toLowerCase();
  const hits = [];
  for (const p of loadFabricPortingPages()) {
    const verHit = versionMatchesPortingPage(version, p);
    const title = p.title.toLowerCase();
    const meta = `${p.title} ${p.from} ${p.to}`.toLowerCase();
    const topicHit = /porting|migrat|移植/.test(q);
    const tokens = q.split(/\s+/).filter((t) => {
      if (!t) return false;
      if (/[\u4e00-\u9fff]/.test(t)) return t.length >= 2;
      return t.length >= 4;
    });
    const tokenHit = tokens.some((t) => title.includes(t) || meta.includes(t));
    const qHit = topicHit || tokenHit;
    if (!verHit && !qHit) continue;
    hits.push({
      id: p.id,
      version: p.to,
      label: p.title,
      url: p.url,
      tags: ["porting", "fabric", p.to],
      priority: "high",
      sectionCount: 1,
      source: "porting-extra",
      score: verHit ? 40 : 12,
    });
  }
  return hits.slice(0, 5);
}
