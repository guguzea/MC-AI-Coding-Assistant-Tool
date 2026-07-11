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
      console.log("  [attempt " + (attempt+1) + "] execSync curl...");
      const raw = execSync(cmd, { timeout: 45000, maxBuffer: 10 * 1024 * 1024 });
      const full = raw.toString("utf8");
      const statusMatch = full.match(/__HTTP_CODE__:(\d+)__/);
      const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
      const html = full.replace(/__HTTP_CODE__:\d+__\n?$/, "");
      console.log("  Got length:", html.length);
      if (html.length < 5000 && attempt < retries) {
        console.log("  Too short, retrying...");
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: status >= 200 && status < 400, status, html, url };
    } catch (err) {
      console.error("  Error:", err.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }
      return { ok: false, status: 0, html: null, url, error: err.message };
    }
  }
}

function htmlToMarkdown(html, pageHref, version) {
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<div[^>]*class="[^"]*navbar[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<div[^>]*class="[^"]*theme-layout-navbar[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<aside[^>]*class="[^"]*theme-doc-sidebar[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(/<nav[^>]*class="[^"]*breadcrumbs[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<span[^>]*class="[^"]*theme-doc-version-badge[^"]*"[^>]*>[^<]*<\/span>/gi, "")
    .replace(/<div[^>]*class="[^"]*theme-doc-toc[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<nav[^>]*class="[^"]*pagination-nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<a[^>]*class="[^"]*skipToContent[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<header[^>]*>/gi, "")
    .replace(/<\/header>/gi, "");

  let articleMatch = text.match(/<article[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
  if (!articleMatch) {
    articleMatch = text.match(/<div[^>]*class="[^"]*theme-doc-markdown[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  }
  let article = articleMatch ? articleMatch[1] : text;

  // Check if we have the full article
  console.log("  Article length:", article.length);
  console.log("  Has </pre>:", article.includes("</pre>"));

  return "MARKDOWN CONTENT";
}

function buildUrl(version, chapterHref) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const route = manifest.versions[version]?.route ?? "";
  const base = route ? `${DOCS_BASE}/docs/${route}/` : `${DOCS_BASE}/docs/`;
  return `${base}${chapterHref}/`;
}

async function main() {
  const version = "26.1";
  const chapterHref = "concepts/registries";
  const url = buildUrl(version, chapterHref);

  console.log("URL:", url);
  const res = await fetchPage(url);
  console.log("Fetch result:", res.status, res.html ? res.html.length : "null");

  if (!res.ok || !res.html) {
    console.error("Fetch failed!");
    return;
  }

  const md = htmlToMarkdown(res.html, chapterHref, version);

  const outFile = join(OUT_DIR, `neoforge_${version}`, "neoforge-docs", version, "raw", "concepts_registries.md");
  const frontmatter = ["---", `version: "${version}"`, `pageId: "${chapterHref}"`, "---", ""].join("\n");
  writeFileSync(outFile, frontmatter + md + "\n", "utf-8");
  console.log("Written:", outFile);
  console.log("Done. File size:", readFileSync(outFile, "utf8").length);
}

main().catch(console.error);
