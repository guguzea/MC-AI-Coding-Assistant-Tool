#!/usr/bin/env node
/**
 * fetch-neoforge-docs.js
 * Fetch NeoForge Docusaurus docs, convert HTML to Markdown.
 *
 * Usage:
 *   node scripts/fetch-neoforge-docs.js                  # fetch all available versions
 *   node scripts/fetch-neoforge-docs.js --version=26.1  # fetch specific version
 *   node scripts/fetch-neoforge-docs.js --dry-run       # show URLs without fetching
 *   node scripts/fetch-neoforge-docs.js --force         # re-fetch even if file exists
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

const availableVersions = Object.entries(manifest.versions)
  .filter(([k, v]) => v.available && v.type === "main-docs")
  .map(([k]) => k);

const versions = targetVer
  ? (availableVersions.includes(targetVer) ? [targetVer] : [])
  : availableVersions;

if (versions.length === 0) {
  console.error(`ERROR: Version "${targetVer}" not found or not available. Available: ${availableVersions.join(", ") || "none"}`);
  process.exit(1);
}

console.log(`Target versions: ${versions.join(", ")}`);

// ── HTTP utilities ──────────────────────────────────────────────────────────

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Fetch a page using Node's built-in fetch (no shell, no execSync).
 * 重试策略：
 *   - 网络错误 / 状态码 5xx：退避重试（最多 retries 次）
 *   - 状态码 4xx：直接放弃（不重试）
 *   - 状态码 200 但响应体疑似截断（无 HTML 标记 / 极小）：最多重试 1 次
 *
 * @param {string} url
 * @param {number} retries
 * @returns {Promise<{ok: boolean, status: number, html: string|null, url: string, error?: string}>}
 */
async function fetchPage(url, retries = 3) {
  const delays = [500, 1000, 2000];
  let last = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetchPageHtml(url, { timeoutMs: 45_000, userAgent: USER_AGENT });
    last = res;

    // 4xx: 永久错误，立即返回
    if (res.status >= 400 && res.status < 500) {
      return { ok: false, status: res.status, html: null, url: res.url, error: res.error };
    }
    // 网络错误 / 5xx: 退避重试
    if (!res.ok) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt] ?? 2000));
        continue;
      }
      return { ok: false, status: res.status, html: null, url: res.url, error: res.error };
    }

    // 200 OK：检查响应是否像合法页面。仅当不合法时最多重试 1 次，
    // 避免对"小但合法"页面（导航占位等）做无谓重试。
    const valid = isLikelyValidHtmlPage(res.html, res.status, { minBytes: 200 });
    if (!valid && attempt < Math.min(retries, 1)) {
      await new Promise(r => setTimeout(r, delays[attempt] ?? 500));
      continue;
    }

    return { ok: true, status: res.status, html: res.html, url: res.url };
  }
  return last ?? { ok: false, status: 0, html: null, url, error: "exhausted retries" };
}

// ── Build URL ────────────────────────────────────────────────────────────────

function buildUrl(version, chapterHref) {
  const route = manifest.versions[version]?.route ?? "";
  const base = route ? `${DOCS_BASE}/docs/${route}/` : `${DOCS_BASE}/docs/`;
  return `${base}${chapterHref}/`;
}

// ── HTML → Markdown ─────────────────────────────────────────────────────────

function htmlToMarkdown(html, pageHref, version) {
  // Strip <script>, <style>, <nav>, <footer> blocks first
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");

  // Strip fixed navbar
  text = text.replace(/<div[^>]*class="[^"]*navbar[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/nav>/gi, "");
  text = text.replace(/<div[^>]*class="[^"]*theme-layout-navbar[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "");

  // Strip sidebar
  text = text.replace(/<aside[^>]*class="[^"]*theme-doc-sidebar[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, "");

  // Strip breadcrumbs
  text = text.replace(/<nav[^>]*class="[^"]*breadcrumbs[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "");

  // Strip version badge
  text = text.replace(/<span[^>]*class="[^"]*theme-doc-version-badge[^"]*"[^>]*>[^<]*<\/span>/gi, "");

  // Strip TOC
  text = text.replace(/<div[^>]*class="[^"]*theme-doc-toc[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

  // Strip pagination nav
  text = text.replace(/<nav[^>]*class="[^"]*pagination-nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "");

  // Strip back-to-top button
  text = text.replace(/<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>[\s\S]*?<\/button>/gi, "");

  // Strip "Skip to content"
  text = text.replace(/<a[^>]*class="[^"]*skipToContent[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "");

  // Strip <header> tags around h1
  text = text.replace(/<header[^>]*>/gi, "");
  text = text.replace(/<\/header>/gi, "");

  // ── Extract article content (nesting-aware) ─────────────────────────────────
  // The theme-doc-markdown div contains nested divs (codeBlockContainer, admonition, etc.)
  // that use the same closing </div> pattern. Track nesting depth to find the matching close.
  // Must count BOTH <div> and <div ...> as opening tags.
  let article = text;
  const outerMatch = text.match(/(<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>)([\s\S]*)/i);
  if (outerMatch) {
    const inner = outerMatch[2];
    let depth = 1;
    let end = 0;
    // Track all div open/close tags
    let pos = 0;
    while (pos < inner.length) {
      const rest = inner.slice(pos);
      if (rest.startsWith("<div")) {
        // Opening div tag (with or without attributes)
        depth++;
        // Skip to end of tag
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
    if (end > 0) {
      article = inner.slice(0, end);
    }
  } else {
    // Fallback: try to extract from <article>
    const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) article = articleMatch[1];
  }

  // ── Convert code blocks FIRST (before admonitions, which also use </div> patterns) ─
  // Docusaurus 3: <pre class="prism-code language-java ...">...</pre>
  // The prism-code class can appear anywhere within the opening <pre ...> tag attributes.
  // Strategy: find <pre ...>...</pre> blocks and check if the opening tag contains "prism-code".
  // The <pre> and </pre> may span multiple lines.
  article = article.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (match, attrs, codeContent) => {
      if (!attrs.includes("prism-code")) return match; // Not a highlighted code block
      const langMatch = attrs.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : "";
      let code = codeContent
        .replace(/<code[^>]*>/gi, "")
        .replace(/<\/code>/gi, "")
        .replace(/<span[^>]*>/gi, "")
        .replace(/<\/span>/gi, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    }
  );

  // Fallback: plain <pre><code>...</code></pre>
  article = article.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    const c = code
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();
    return `\n\`\`\`\n${c}\n\`\`\`\n`;
  });

  // ── Convert admonitions ────────────────────────────────────────────────
  // <div class="theme-admonition theme-admonition-{type}"> → > **TYPE**
  // These use </div> which can also close code blocks - must run AFTER code conversion
  const admonitionRegex = /<div[^>]*class="[^"]*theme-admonition[^"]*theme-admonition-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  article = article.replace(admonitionRegex, (_, type, content) => {
    const titleMatch = content.match(/<p[^>]*class="[^"]*admonition-title[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
    let title = type.charAt(0).toUpperCase() + type.slice(1);
    if (titleMatch) {
      const rawTitle = titleMatch[1].replace(/<[^>]+>/g, "").trim();
      if (rawTitle) title = rawTitle;
    }
    const body = content.replace(/<p[^>]*class="[^"]*admonition-title[^"]*"[^>]*>[\s\S]*?<\/p>/i, "");
    const bodyMd = body
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();
    return `\n> **${title}**\n${bodyMd.split("\n").map(l => l.trim() ? `> ${l}` : ">").join("\n")}\n`;
  });

  // ── Convert tables ──────────────────────────────────────────────────────
  article = article.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableContent) => {
    const md = htmlTableToMarkdown(tableContent);
    return md ? `\n${md}\n` : "";
  });

  // ── Convert links ──────────────────────────────────────────────────────
  // Normalize all hrefs to Markdown links, fix double slashes
  article = article.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const normalizedHref = href.replace(/(?<!:)\/\/+/g, "/");
    const linkText = text.replace(/<[^>]+>/g, "").trim();
    return "[" + linkText + "](" + normalizedHref + ")";
  });

  // ── Convert images ─────────────────────────────────────────────────────
  article = article.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, (_, src, alt) => {
    const normalizedSrc = src.replace(/(?<!:)\/\/+/g, "/");
    return "![" + alt + "](" + normalizedSrc + ")";
  });
  article = article.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, (_, alt, src) => {
    const normalizedSrc = src.replace(/(?<!:)\/\/+/g, "/");
    return "![" + alt + "](" + normalizedSrc + ")";
  });
  article = article.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, (_, src) => {
    const normalizedSrc = src.replace(/(?<!:)\/\/+/g, "/");
    return "![](" + normalizedSrc + ")";
  });

  // ── Convert headers ────────────────────────────────────────────────────
  // Strip auto-generated anchor IDs that Docusaurus adds: [​](#name)
  article = article.replace(/\[​\]\(#[^)]*\)/g, "");
  article = article.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return `\n# ${text}\n`;
  });
  article = article.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return `\n## ${text}\n`;
  });
  article = article.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return `\n### ${text}\n`;
  });
  article = article.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return `\n#### ${text}\n`;
  });

  // ── Convert inline elements ───────────────────────────────────────────
  article = article.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").trim();
    return `**${text}**`;
  });
  article = article.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").trim();
    return `**${text}**`;
  });
  article = article.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").trim();
    return `*${text}*`;
  });
  article = article.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").trim();
    return `*${text}*`;
  });
  article = article.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => {
    const text = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return `\`${text}\``;
  });
  article = article.replace(/<br\s*\/?>/gi, "\n");
  // Also strip <br> inside code blocks (they appear as <span><br></span>)
  // Already handled by the code block extraction, but double-check
  article = article.replace(/<hr[^>]*\/?>/gi, "\n---\n");

  // ── Convert lists ─────────────────────────────────────────────────────
  article = convertLists(article);

  // ── Convert paragraphs ─────────────────────────────────────────────────
  article = article.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    const md = content.replace(/<[^>]+>/g, "").trim();
    return `\n${md}\n`;
  });

  // ── Convert divs/spans ────────────────────────────────────────────────
  article = article.replace(/<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>/gi, "");
  article = article.replace(/<div[^>]*>/gi, "\n");
  article = article.replace(/<\/div>/gi, "\n");
  article = article.replace(/<span[^>]*>/gi, "");

  // ── Decode HTML entities ───────────────────────────────────────────────
  article = article
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  // ── Clean up whitespace ─────────────────────────────────────────────────
  article = article
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");

  return article;
}

/**
 * Convert HTML lists to Markdown lists
 */
function convertLists(text) {
  // Match <ul> blocks
  return text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    const lines = content
      .split(/<li[^>]*>([\s\S]*?)<\/li>/gi)
      .filter((_, i) => i % 2 === 1);
    const items = lines.map(li => {
      let item = li.trim();
      // Strip remaining HTML tags
      item = item.replace(/<[^>]+>/g, "");
      item = item.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
      return `- ${item}`;
    });
    return `\n${items.join("\n")}\n`;
  });
}

// ── Collect all pages to fetch ───────────────────────────────────────────────

function collectPages(version) {
  const cfg = manifest.versions[version];
  if (!cfg) return [];

  const seen = new Map(); // href -> { href, text, level }
  const pages = [];

  const upsert = (href, text, level) => {
    if (!href) return;
    const prev = seen.get(href);
    // 同 href 时优先保留更具体的叶子标题（level 更大），避免分类名覆盖 Registries
    if (!prev) {
      const entry = { href, text, level };
      seen.set(href, entry);
      pages.push(entry);
    } else if (level > prev.level) {
      prev.text = text;
      prev.level = level;
    }
  };

  for (const chapter of cfg.chapters) {
    upsert(chapter.href, chapter.text, chapter.level ?? 1);
    if (chapter.subPages) {
      for (const sub of chapter.subPages) {
        upsert(sub.href, sub.text, sub.level ?? 2);
      }
    }
  }

  return pages;
}

// ── Main fetch loop ──────────────────────────────────────────────────────────

async function main() {
  let totalPages = 0;
  let fetchedPages = 0;
  let skippedPages = 0;
  let errorPages = 0;

  for (const version of versions) {
    console.log(`\n=== Fetching NeoForge ${version} ===`);
    const pages = collectPages(version);
    console.log(`  Pages to fetch: ${pages.length}`);

    const outVersionDir = join(OUT_DIR, `neoforge_${version}`, "neoforge-docs", version);
    const rawDir = join(outVersionDir, "raw");
    mkdirSync(rawDir, { recursive: true });

    for (const page of pages) {
      const url = buildUrl(version, page.href);
      const safeId = page.href.replace(/\//g, "_").replace(/-/g, "_");
      const outFile = join(rawDir, `${safeId}.md`);

      if (!force && existsSync(outFile)) {
        console.log(`  SKIP  ${page.href} (exists)`);
        skippedPages++;
        totalPages++;
        continue;
      }

      if (dryRun) {
        console.log(`  DRY   ${url}`);
        totalPages++;
        continue;
      }

      console.log(`  FETCH ${page.href}`);
      const res = await fetchPage(url);

      if (!res.ok) {
        console.log(`  ERROR ${page.href}: HTTP ${res.status}`);
        errorPages++;
        totalPages++;
        continue;
      }

      const markdown = htmlToMarkdown(res.html, page.href, version);

      const frontmatter = [
        "---",
        `title: "${page.text}"`,
        `version: "${version}"`,
        `pageId: "${page.href}"`,
        `url: "${res.url}"`,
        `platform: "neoforge"`,
        `fetchedAt: "${new Date().toISOString()}"`,
        "---",
        "",
      ].join("\n");

      writeFileSync(outFile, frontmatter + markdown + "\n", "utf-8");
      fetchedPages++;
      totalPages++;

      // Rate limiting: 300ms between requests
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total pages: ${totalPages}`);
  console.log(`Fetched: ${fetchedPages}`);
  console.log(`Skipped: ${skippedPages}`);
  console.log(`Errors: ${errorPages}`);
}

main().catch(err => {
  console.error("Fetch failed:", err);
  process.exit(1);
});
