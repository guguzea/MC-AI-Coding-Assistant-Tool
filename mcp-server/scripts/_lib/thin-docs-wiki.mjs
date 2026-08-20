/**
 * 薄档（LiteLoader / Rift）wiki 落盘辅助：合并 L0、保护核实表 processed 文件。
 * 禁止覆盖 verified-api / hybrid / listeners / making-mods-wiki / upstream-readme / safe-api。
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export const PROTECTED_PROCESSED = new Set([
  "verified-api.md",
  "hybrid.md",
  "listeners.md",
  "making-mods-wiki.md",
  "upstream-readme.md",
  "safe-api.md",
]);

export function sha256(s) {
  return createHash("sha256").update(s).digest("hex");
}

export function isWikiIndexEntry(e) {
  if (!e || typeof e !== "object") return false;
  const id = String(e.id ?? "");
  const src = String(e.source ?? "");
  return (
    src === "liteloader-wiki" ||
    src === "rift-wiki" ||
    /\/wiki_/.test(id) ||
    id.endsWith("/wiki-home")
  );
}

export function assertNotProtectedProcessed(filename) {
  const base = String(filename).replace(/^.*[/\\]/, "");
  if (PROTECTED_PROCESSED.has(base)) {
    throw new Error(`拒绝写入核实表 processed 文件: ${base}`);
  }
  if (!/^wiki[_-]/.test(base)) {
    throw new Error(`wiki 落盘文件名必须以 wiki_ 开头: ${base}`);
  }
}

export function mergeThinL0(indexPath, wikiEntries) {
  let existing = [];
  if (existsSync(indexPath)) {
    existing = JSON.parse(readFileSync(indexPath, "utf8"));
    if (!Array.isArray(existing)) existing = [];
  }
  const keep = existing.filter((e) => !isWikiIndexEntry(e));
  const out = [...keep, ...wikiEntries];
  mkdirSync(dirname(indexPath), { recursive: true });
  writeFileSync(indexPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  return { kept: keep.length, wiki: wikiEntries.length, total: out.length };
}

export function writeWikiProcessed(processedDir, filename, markdown) {
  assertNotProtectedProcessed(filename);
  mkdirSync(processedDir, { recursive: true });
  const dest = join(processedDir, filename);
  writeFileSync(dest, markdown, "utf8");
  return dest;
}

export async function fetchTextRetry(url, { attempts = 4, timeoutMs = 25000, accept = "text/plain,text/markdown,*/*" } = {}) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent": "MC_skill-thin-wiki/1.0",
          Accept: accept,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const text = await res.text();
      return { ok: res.ok, status: res.status, text, contentType: res.headers.get("content-type") ?? "" };
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw last ?? new Error(`fetch failed: ${url}`);
}

/** 精简 DokuWiki → Markdown（LiteLoader 官方站）。 */
export function dokuwikiToMarkdown(raw) {
  let md = String(raw ?? "");
  md = md.replace(/^~~META:[^~]*~~\s*/gm, "");
  md = md.replace(/^~~NOTOC~~\s*/gm, "");
  md = md.replace(/^~~[^~\n]+~~\s*\n?/gm, "");
  md = md.replace(/^([^\n=][^\n]*)\n={4,}\s*$/gm, "# $1");
  md = md.replace(/^([^\n=][^\n]*)\n-{4,}\s*$/gm, "## $1");
  md = md.replace(/^(={2,6})\s*([^=\n].*?)\s*\1\s*$/gm, (_, eq, title) => {
    const level = Math.min(6, Math.max(1, 7 - eq.length));
    return `${"#".repeat(level)} ${title}`;
  });
  md = md.replace(/<code\s+([A-Za-z0-9_+-]+)[^>]*>/gi, "```$1\n");
  md = md.replace(/<code\s*>/gi, "```\n");
  md = md.replace(/<\/code>/gi, "\n```");
  md = md.replace(/<file\s+([A-Za-z0-9_+.-]+)[^>]*>/gi, "```$1\n");
  md = md.replace(/<\/file>/gi, "\n```");
  md = md.replace(/\[\[https?:\/\/([^\]|]+)\|([^\]]+)\]\]/g, "[$2](https://$1)");
  md = md.replace(/\[\[https?:\/\/([^\]]+)\]\]/g, "https://$1");
  md = md.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "[$2]($1)");
  md = md.replace(/\[\[([^\]]+)\]\]/g, "[$1]($1)");
  md = md.replace(/''([^'\n]+)''/g, "`$1`");
  md = md.replace(/\n{3,}/g, "\n\n");
  return md.trim();
}

export function extractDokuTitle(raw, fallback) {
  const meta = raw.match(/~~META:title=([^~]+)~~/);
  if (meta?.[1]) return meta[1].trim();
  const setext = raw.match(/^([^\n=][^\n]*)\n={4,}\s*$/m);
  if (setext?.[1]) return setext[1].trim();
  const h = raw.match(/^(={2,6})\s*([^=\n].*?)\s*\1\s*$/m);
  if (h?.[2]) return h[2].trim();
  return fallback;
}

export function wikiSlug(pageId) {
  const slug = String(pageId)
    .replace(/:/g, "_")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return `wiki_${slug || "page"}`;
}
