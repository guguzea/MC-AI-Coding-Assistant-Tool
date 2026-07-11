import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "neoforge-versions-manifest.json");
const DOCS_BASE = "https://docs.neoforged.net";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchPage(url, retries = 3) {
  const delays = [500, 1000, 2000];
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const cmd = "curl -s -L -A \"" + USER_AGENT + "\" -w \"\\n__HTTP_CODE__:%{http_code}__\" \"" + url + "\"";
      const raw = execSync(cmd, { timeout: 45000, maxBuffer: 10 * 1024 * 1024 });
      const full = raw.toString("utf8");
      const statusMatch = full.match(/__HTTP_CODE__:(\d+)__/);
      const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
      const html = full.replace(/__HTTP_CODE__:\d+__\n?$/, "");
      if (html.length < 5000 && attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: status >= 200 && status < 400, status, html, url };
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: false, status: 0, html: null, url, error: err.message };
    }
  }
}

function htmlToMarkdown(html, pageHref, version) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
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
    .replace(/<header[^>]*>/gi, "")
    .replace(/<\/header>/gi, "");

  // ── Extract article content (nesting-aware) ─────────────────────────────────
  let article = text;
  const outerMatch = text.match(/(<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>)([\s\S]*)/i);
  if (outerMatch) {
    const inner = outerMatch[2];
    let depth = 1;
    let end = 0;
    for (let i = 0; i < inner.length; i++) {
      if (inner.slice(i, i + 5) === "<div>") { depth++; i += 4; }
      else if (inner.slice(i, i + 6) === "</div>") {
        depth--;
        if (depth === 0) { end = i; break; }
        i += 5;
      }
    }
    if (end > 0) {
      article = inner.slice(0, end);
    }
  }

  console.log("  Article extracted:", article.length, "chars");

  // ── Convert code blocks ────────────────────────────────────────────────
  article = article.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (match, attrs, codeContent) => {
      if (!attrs.includes("prism-code")) return match;
      const langMatch = attrs.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : "";
      let code = codeContent
        .replace(/<code[^>]*>/gi, "").replace(/<\/code>/gi, "")
        .replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ")
        .trim();
      return "\n```" + lang + "\n" + code + "\n```\n";
    }
  );

  // ── Convert admonitions ────────────────────────────────────────────────
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

  // ── Convert headers ────────────────────────────────────────────────────
  article = article.replace(/\[​\]\(#[^)]*\)/g, "");
  article = article.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return "\n# " + text + "\n";
  });
  article = article.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return "\n## " + text + "\n";
  });
  article = article.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, content) => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\[​\]\(#.*?\)/g, "").trim();
    return "\n### " + text + "\n";
  });

  // ── Convert inline ────────────────────────────────────────────────────
  article = article.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, c) => "**" + c.replace(/<[^>]+>/g, "").trim() + "**");
  article = article.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, c) => "**" + c.replace(/<[^>]+>/g, "").trim() + "**");
  article = article.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, c) => "*" + c.replace(/<[^>]+>/g, "").trim() + "*");
  article = article.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, c) => "*" + c.replace(/<[^>]+>/g, "").trim() + "*");
  article = article.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => {
    const t = c.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return "`" + t + "`";
  });
  article = article.replace(/<br\s*\/?>/gi, "\n");
  article = article.replace(/<hr[^>]*\/?>/gi, "\n---\n");

  // ── Convert links ──────────────────────────────────────────────────────
  article = article.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const linkText = text.replace(/<[^>]+>/g, "").trim();
    return "[" + linkText + "](" + href + ")";
  });

  // ── Convert lists ─────────────────────────────────────────────────────
  article = article.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    const items = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let m;
    while ((m = liRegex.exec(content)) !== null) {
      const item = m[1].replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
      items.push("- " + item);
    }
    return "\n" + items.join("\n") + "\n";
  });

  // ── Convert paragraphs ─────────────────────────────────────────────────
  article = article.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    const md = content.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
    return "\n" + md + "\n";
  });

  // ── Convert tables ─────────────────────────────────────────────────────
  article = article.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, content) => {
    const headers = [];
    const rows = [];
    for (const m of content.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)) headers.push(m[1].replace(/<[^>]+>/g, "").trim());
    for (const m of content.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = [];
      for (const c of m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)) cells.push(c[1].replace(/<[^>]+>/g, "").trim());
      if (cells.length > 0) rows.push(cells);
    }
    if (headers.length === 0 && rows.length === 0) return "";
    const mdRows = [];
    if (headers.length > 0) { mdRows.push("| " + headers.join(" | ") + " |"); mdRows.push("| " + headers.map(() => "---").join(" | ") + " |"); }
    for (const row of rows) mdRows.push("| " + row.join(" | ") + " |");
    return "\n" + mdRows.join("\n") + "\n";
  });

  // ── Convert divs/spans ────────────────────────────────────────────────
  article = article.replace(/<div[^>]*>/gi, "\n").replace(/<\/div>/gi, "\n").replace(/<span[^>]*>/gi, "");

  // ── Decode entities ───────────────────────────────────────────────────
  article = article
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ");

  // ── Clean up ────────────────────────────────────────────────────────
  article = article.replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").replace(/\n+$/, "");

  return article;
}

async function main() {
  const version = "26.1";
  const chapterHref = "concepts/registries";
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const route = manifest.versions[version]?.route ?? "";
  const url = (route ? `${DOCS_BASE}/docs/${route}/` : `${DOCS_BASE}/docs/`) + chapterHref + "/";

  console.log("URL:", url);
  const res = await fetchPage(url);
  console.log("Fetch:", res.status, res.html ? res.html.length + " bytes" : "null");

  if (!res.ok || !res.html) { console.error("Failed"); return; }

  const md = htmlToMarkdown(res.html, chapterHref, version);
  console.log("Markdown:", md.length, "chars");

  const frontmatter = ["---", "version: \"" + version + "\"", "pageId: \"" + chapterHref + "\"", "url: \"" + res.url + "\"", "---", ""].join("\n");
  const outFile = join(OUT_DIR, "neoforge_" + version, "neoforge-docs", version, "raw", "concepts_registries.md");
  writeFileSync(outFile, frontmatter + md + "\n", "utf-8");
  console.log("Written:", outFile, "Size:", readFileSync(outFile, "utf8").length);
  // Show first 500 chars of body
  console.log("\nFirst 500 chars:\n", (frontmatter + md).substring(0, 500));
}

main().catch(console.error);
