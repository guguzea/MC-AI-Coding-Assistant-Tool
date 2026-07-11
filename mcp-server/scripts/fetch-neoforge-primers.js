#!/usr/bin/env node
/**
 * fetch-neoforge-primers.js
 * Fetch NeoForge Primers (migration guides) from docs.neoforged.net/primer/docs/
 *
 * Usage:
 *   node scripts/fetch-neoforge-primers.js                  # fetch all primers
 *   node scripts/fetch-neoforge-primers.js --version=1.21 # fetch specific primer
 *   node scripts/fetch-neoforge-primers.js --dry-run       # show URLs
 *   node scripts/fetch-neoforge-primers.js --force        # re-fetch even if exists
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchPageHtml, isLikelyValidHtmlPage, htmlTableToMarkdown } from "./_lib/pipeline-helpers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "neoforge-versions-manifest.json");
const DOCS_BASE = "https://docs.neoforged.net";

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const targetVer = args.find(a => a.startsWith("--version="))?.split("=")[1];

// ── Manifest ─────────────────────────────────────────────────────────────────

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
} catch (e) {
  console.error("ERROR: Cannot load manifest. Run: node scripts/probe-neoforge-versions.js");
  process.exit(1);
}

const primers = targetVer
  ? Object.entries(manifest.primers).filter(([k]) => k === targetVer)
  : Object.entries(manifest.primers);

if (primers.length === 0) {
  console.error(`ERROR: Primer "${targetVer}" not found. Available: ${Object.keys(manifest.primers).join(", ")}`);
  process.exit(1);
}

console.log(`Target primers: ${primers.map(([k]) => k).join(", ")}`);

// ── HTTP ────────────────────────────────────────────────────────────────────

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * 用 Node 内置 fetch 抓取（替换 execSync curl，避免 shell 注入）。
 * 重试策略：
 *   - 网络错误 / 5xx：退避重试
 *   - 4xx：直接放弃
 *   - 200 但响应体疑似截断：最多重试 1 次
 */
async function fetchPage(url, retries = 3) {
  const delays = [500, 1000, 2000];
  let last = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetchPageHtml(url, { timeoutMs: 45_000, userAgent: USER_AGENT });
    last = res;
    if (res.status >= 400 && res.status < 500) {
      return { ok: false, status: res.status, html: null, url: res.url, error: res.error };
    }
    if (!res.ok) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt] ?? 2000));
        continue;
      }
      return { ok: false, status: res.status, html: null, url: res.url, error: res.error };
    }
    const valid = isLikelyValidHtmlPage(res.html, res.status, { minBytes: 200 });
    if (!valid && attempt < Math.min(retries, 1)) {
      await new Promise(r => setTimeout(r, delays[attempt] ?? 500));
      continue;
    }
    return { ok: true, status: res.status, html: res.html, url: res.url };
  }
  return last ?? { ok: false, status: 0, html: null, url, error: "exhausted retries" };
}

// ── HTML → Markdown ─────────────────────────────────────────────────────────

function htmlToMarkdown(html, primerKey) {
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<div[^>]*class="[^"]*navbar[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<aside[^>]*class="[^"]*theme-doc-sidebar[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(/<nav[^>]*class="[^"]*breadcrumbs[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<span[^>]*class="[^"]*theme-doc-version-badge[^"]*"[^>]*>[^<]*<\/span>/gi, "")
    .replace(/<div[^>]*class="[^"]*theme-doc-toc[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<nav[^>]*class="[^"]*pagination-nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<a[^>]*class="[^"]*skipToContent[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<header[^>]*>/gi, "").replace(/<\/header>/gi, "");

  // Extract article content (nesting-aware)
  let article = text;
  const outerMatch = text.match(/(<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>)([\s\S]*)/i);
  if (outerMatch) {
    const inner = outerMatch[2];
    let depth = 1;
    let end = 0;
    let pos = 0;
    while (pos < inner.length) {
      const rest = inner.slice(pos);
      if (rest.startsWith("<div")) {
        depth++;
        const closeBracket = inner.indexOf(">", pos);
        pos = closeBracket + 1;
      } else if (rest.startsWith("</div>")) {
        depth--;
        if (depth === 0) { end = pos; break; }
        pos += 6;
      } else {
        pos++;
      }
    }
    if (end > 0) article = inner.slice(0, end);
  } else {
    const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) article = articleMatch[1];
  }

  // Code blocks
  article = article.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (match, attrs, codeContent) => {
      if (!attrs.includes("prism-code")) return match;
      const langMatch = attrs.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : "";
      let code = codeContent
        .replace(/<code[^>]*>/gi, "").replace(/<\/code>/gi, "")
        .replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "")
        .replace(/<br\s*\/?>/gi, "")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ")
        .trim();
      return "\n```" + lang + "\n" + code + "\n```\n";
    }
  );

  // Admonitions
  article = article.replace(
    /<div[^>]*class="[^"]*theme-admonition[^"]*theme-admonition-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    (_, type, content) => {
      const titleMatch = content.match(/<p[^>]*class="[^"]*admonition-title[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
      let title = type.charAt(0).toUpperCase() + type.slice(1);
      if (titleMatch) {
        const rawTitle = titleMatch[1].replace(/<[^>]+>/g, "").trim();
        if (rawTitle) title = rawTitle;
      }
      const body = content.replace(/<p[^>]*class="[^"]*admonition-title[^"]*"[^>]*>[\s\S]*?<\/p>/i, "");
      const bodyMd = body.replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .trim();
      return "\n> **" + title + "**\n" + bodyMd.split("\n").map(l => l.trim() ? "> " + l : ">").join("\n") + "\n";
    }
  );

  // Headers
  article = article.replace(/\[​\]\(#[^)]*\)/g, "");
  article = article.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => "\n# " + c.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim() + "\n");
  article = article.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => "\n## " + c.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim() + "\n");
  article = article.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => "\n### " + c.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim() + "\n");

  // Inline
  article = article.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, c) => "**" + c.replace(/<[^>]+>/g, "").trim() + "**");
  article = article.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, c) => "**" + c.replace(/<[^>]+>/g, "").trim() + "**");
  article = article.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, c) => "*" + c.replace(/<[^>]+>/g, "").trim() + "*");
  article = article.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => "`" + c.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") + "`");
  article = article.replace(/<br\s*\/?>/gi, "\n");
  article = article.replace(/<hr[^>]*\/?>/gi, "\n---\n");

  // Links
  article = article.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const normHref = href.replace(/(?<!:)\/\/+/g, "/");
    const linkText = text.replace(/<[^>]+>/g, "").trim();
    return "[" + linkText + "](" + normHref + ")";
  });

  // Lists
  article = article.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    const items = [];
    for (const m of content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
      items.push("- " + m[1].replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim());
    }
    return "\n" + items.join("\n") + "\n";
  });

  // Paragraphs
  article = article.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => "\n" + c.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim() + "\n");

  // Tables
  article = article.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, content) => {
    const md = htmlTableToMarkdown(content);
    return md ? "\n" + md + "\n" : "";
  });

  // Divs/spans
  article = article.replace(/<div[^>]*>/gi, "\n").replace(/<\/div>/gi, "\n").replace(/<span[^>]*>/gi, "");

  // Entities
  article = article.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ");

  // Clean
  article = article.replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").replace(/\n+$/, "");

  return article;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let total = 0, fetched = 0, skipped = 0, errors = 0;

  const outPrimersDir = join(OUT_DIR, "neoforge_primers");
  mkdirSync(outPrimersDir, { recursive: true });

  for (const [primerKey, primerData] of primers) {
    const url = primerData.url;
    const outFile = join(outPrimersDir, `${primerKey}.md`);

    if (!force && existsSync(outFile)) {
      console.log(`  SKIP  primer ${primerKey} (exists)`);
      skipped++;
      total++;
      continue;
    }

    if (dryRun) {
      console.log(`  DRY   ${url}`);
      total++;
      continue;
    }

    console.log(`  FETCH primer ${primerKey}: ${url}`);
    const res = await fetchPage(url);

    if (!res.ok || !res.html) {
      console.log(`  ERROR primer ${primerKey}: HTTP ${res.status}`);
      errors++;
      total++;
      continue;
    }

    const markdown = htmlToMarkdown(res.html, primerKey);
    const frontmatter = [
      "---",
      "title: \"NeoForge Primer " + primerData.from + " -> " + primerData.to + "\"",
      "primerKey: \"" + primerKey + "\"",
      "from: \"" + primerData.from + "\"",
      "to: \"" + primerData.to + "\"",
      "url: \"" + res.url + "\"",
      "platform: \"neoforge\"",
      "type: \"primer\"",
      "fetchedAt: \"" + new Date().toISOString() + "\"",
      "---",
      "",
    ].join("\n");

    writeFileSync(outFile, frontmatter + markdown + "\n", "utf-8");
    fetched++;
    total++;
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total: ${total} | Fetched: ${fetched} | Skipped: ${skipped} | Errors: ${errors}`);
}

main().catch(err => {
  console.error("Primers fetch failed:", err);
  process.exit(1);
});
