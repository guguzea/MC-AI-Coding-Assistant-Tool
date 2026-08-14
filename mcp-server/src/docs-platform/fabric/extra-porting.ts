/**
 * Fabric 线上移植页旁路（如 26.1→26.2），不克隆 fabric_26.2 主文档树。
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { resolveDataDir } from "../../utils/path.js";

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

let cache: FabricPortingPage[] | null = null;

export function loadFabricPortingPages(dataRoot = resolveDataDir()): FabricPortingPage[] {
  if (cache) return cache;
  const dir = join(dataRoot, "fabric_porting");
  if (!existsSync(dir)) {
    cache = [];
    return cache;
  }
  const out: FabricPortingPage[] = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const filePath = join(dir, name);
    const raw = readFileSync(filePath, "utf8");
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
  cache = out;
  return cache;
}

export function resetFabricPortingCache(): void {
  cache = null;
}

export function isFabricPortingId(id: string): boolean {
  return id.startsWith("porting/");
}

export function findFabricPorting(id: string): FabricPortingPage | undefined {
  return loadFabricPortingPages().find((p) => p.id === id || `porting/${p.to}` === id);
}

export function searchFabricPortingPages(query: string, version: string) {
  const q = query.toLowerCase();
  const hits = [];
  for (const p of loadFabricPortingPages()) {
    const verHit = version === p.to || version.startsWith(p.to) || version === "26.2";
    const hay = `${p.title} ${p.from} ${p.to} ${p.body}`.toLowerCase();
    const qHit = /porting|26\.2|migrat|移植/.test(q) || hay.includes(q.split(/\s+/)[0] ?? "");
    if (!verHit && !qHit) continue;
    if (!/porting|26\.2|migrat|移植|vulkan|loom/.test(q) && !verHit) continue;
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
