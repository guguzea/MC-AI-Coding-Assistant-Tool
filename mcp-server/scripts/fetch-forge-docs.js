#!/usr/bin/env node
/**
 * fetch-forge-docs.js
 * 爬取 Forge MkDocs 官方文档（多版本支持）
 *
 * 使用：
 *   node scripts/fetch-forge-docs.js                  # 抓取所有版本
 *   node scripts/fetch-forge-docs.js --version 1.20.1 # 抓取指定版本
 *   node scripts/fetch-forge-docs.js --section registries
 *   node scripts/fetch-forge-docs.js --dry-run
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parseCliArgs } from "./_lib/args.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "forge-versions-manifest.json");

// ── CLI ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const parsedArgs = parseCliArgs(args, {
  allowBoolFlags: new Set(["--dry-run", "--force"]),
});
const dryRun = parsedArgs.flags["dry-run"] === true;
const force = parsedArgs.flags.force === true;
const targetVer = parsedArgs.flags.version;
let targetSection = parsedArgs.flags.section;
const sectionIndex = args.indexOf("--section");
if (targetSection === true && sectionIndex >= 0) {
  const value = args[sectionIndex + 1];
  targetSection = value && !value.startsWith("--") ? value : undefined;
}
if (parsedArgs.flags.versionError) {
  console.error("ERROR: --version requires a non-empty value");
  process.exit(2);
}
if (args.includes("--section") && !targetSection) {
  console.error("ERROR: --section requires a non-empty value");
  process.exit(2);
}

// ── Manifest ─────────────────────────────────────────────────────────

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
} catch (e) {
  console.error("ERROR: Cannot load manifest. Run: node scripts/probe-forge-versions.js");
  process.exit(1);
}

const KNOWN_VERSIONS = Object.keys(manifest.versions).filter(
  v => manifest.versions[v]?.mkdocs?.available
);

const versions = targetVer
  ? (KNOWN_VERSIONS.includes(targetVer) ? [targetVer] : [])
  : KNOWN_VERSIONS;

if (versions.length === 0) {
  console.error(`ERROR: Version "${targetVer}" not found. Available: ${KNOWN_VERSIONS.join(", ") || "none"}`);
  process.exit(1);
}

console.log(`Fetching versions: ${versions.join(", ")}\n`);

// ── HTTP ───────────────────────────────────────────────────────────────

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "MC-Forge-Docs-Fetcher/1.0 (+https://github.com/)",
];
let uaIndex = 0;
function nextUA() { return USER_AGENTS[uaIndex++ % USER_AGENTS.length]; }

async function fetchUrlViaCurl(url) {
  try {
    const { stdout } = await execFileAsync(
      "curl.exe",
      [
        "-sS",
        "-L",
        "--ssl-no-revoke",
        "--max-time",
        "30",
        "-A",
        nextUA(),
        "-w",
        "\n__MC_SKILL_HTTP_STATUS__:%{http_code}",
        url,
      ],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024, windowsHide: true },
    );
    const m = stdout.match(/\n__MC_SKILL_HTTP_STATUS__:(\d+)\s*$/);
    const status = m ? Number(m[1]) : 0;
    const body = m ? stdout.slice(0, m.index) : stdout;
    return { ok: status === 200, status, content: body, finalUrl: url };
  } catch (e) {
    return { ok: false, status: -1, content: "", error: e.message };
  }
}

async function fetchUrl(url, retries = 3) {
  if (process.platform === "win32") {
    const viaCurl = await fetchUrlViaCurl(url);
    if (viaCurl.ok) return viaCurl;
  }
  const https = await import("node:https");
  const http = await import("node:http");
  let currentUrl = url;

  for (let attempt = 0; attempt < retries; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
    const mod = currentUrl.startsWith("https") ? https : http;
    const headers = { "User-Agent": nextUA() };

    let r;
    try {
      r = await new Promise((resolve, reject) => {
        mod.get(currentUrl, { headers }, (httpRes) => {
          const chunks = [];
          httpRes.on("data", c => chunks.push(c));
          httpRes.on("end", () => resolve({
            status: httpRes.statusCode,
            location: httpRes.headers.location || "",
            body: Buffer.concat(chunks).toString("utf8")
          }));
        }).on("error", reject);
      });
    } catch (e) { continue; }

    if (r.status >= 300 && r.status < 400 && r.location) {
      currentUrl = new URL(r.location, currentUrl).href;
      continue;
    }
    return { ok: r.status === 200, status: r.status, content: r.body, finalUrl: currentUrl };
  }
  return { ok: false, status: -1, content: "", error: "All retries failed" };
}

// ── HTML → Markdown ──────────────────────────────────────────────────

function extractMarkdown(html, baseUrl) {
  let text = html;

  // Remove nav/header/footer/aside
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  text = text.replace(/<aside[\s\S]*?<\/aside>/gi, "");
  text = text.replace(/<div class="md-sidebar[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<div class="md-header[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<div class="md-nav[\s\S]*?<\/div>/gi, "");
  text = text.replace(/<nav class="md-breadcrumb[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<a class="md-content__[\s\S]*?<\/a>/gi, "");
  text = text.replace(/<a[^>]*class="headerlink"[^>]*>.*?<\/a>/gi, "");

  // Admonitions: <div class="admonition note"> → > **Note**: content
  text = convertAdmonitions(text);

  // Extract article or main content
  const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) text = articleMatch[1];
  else {
    const mainMatch = text.match(/<main[^>]*>([\s\S]*)<\/main>/i);
    if (mainMatch) text = mainMatch[1];
  }

  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  text = htmlToMd(text);
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}

function convertAdmonitions(html) {
  const types = ["note", "warning", "important", "tip", "caution", "danger", "attention"];
  for (const type of types) {
    const re = new RegExp(`<div[^>]*class="[^"]*admonition[^"]*${type}[^"]*"[^>]*>([\\s\\S]*?)</div>`, "gi");
    html = html.replace(re, (_, inner) => {
      const titleMatch = inner.match(/<(?:p|strong)[^>]*class="title"[^>]*>([\s\S]*?)<\/(?:p|strong)>/i) ||
                         inner.match(/<p[^>]*><strong>([\s\S]*?)<\/strong><\/p>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").trim()
        : type.charAt(0).toUpperCase() + type.slice(1);
      let body = inner
        .replace(/<(?:p|strong)[^>]*class="title"[^>]*>[\s\S]*?<\/(?:p|strong)>/gi, "")
        .replace(/<p[^>]*><strong>[\s\S]*?<\/strong><\/p>/gi, "");
      body = body
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
        .split("\n").map(l => l.trim()).filter(l => l).join(" ");
      return "\n> **" + title + "**: " + body + "\n";
    });
  }
  return html;
}

function detectLang(code) {
  const t = code.trim();
  if (!t) return "";
  if (/^(package|import)\s+/.test(t) || /@(Mod|SubscribeEvent|OnlyIn)\b/.test(t) ||
      /^public\s+(class|interface|enum|abstract)\s+/.test(t)) return "java";
  if (/^(plugins|repositories|dependencies|sourceSets)\s*\{/.test(t) ||
      /^(apply|include)\s+plugin/.test(t) || /^(minecraft|forge|mixins)\s*\{/.test(t) ||
      /^version\s*=/.test(t) || /forgegradle/i.test(t)) return "gradle";
  if (/^\s*\{[\s\S]*\}\s*$/.test(t) && /"(pack|forge|minecraft|version|id|author)"/.test(t)) return "json";
  if (/^\[.+\]/.test(t) || /^[a-zA-Z_]+\s*=/.test(t)) return "toml";
  if (/<(!|)\??xml/.test(t) || /<(mods|mod|dependencies)/.test(t)) return "xml";
  return "";
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, m => m.startsWith("</") ? "" : m)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
}

function htmlToMd(html) {
  let text = html;

  // h1-h6
  for (let i = 1; i <= 6; i++) {
    const re = new RegExp(`<h${i}(?:[^>]*)>([\\s\\S]*?)</h${i}>`, "gi");
    text = text.replace(re, (_, inner) => {
      const cleaned = stripTags(inner).replace(/\s+/g, " ").trim();
      return "\n" + "#".repeat(i) + " " + cleaned + "\n";
    });
  }

  // pre/code blocks
  text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
    const code = inner.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "$1");
    const stripped = stripTags(code);
    const lang = detectLang(stripped);
    return "\n```" + lang + "\n" + stripped.trim() + "\n```\n";
  });

  // inline code
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // links
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // bold/italic
  text = text.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
  text = text.replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*");
  text = text.replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*");

  // unordered lists
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, item => "- " + stripTags(item).replace(/\s+/g, " ").trim()).trim()
  );

  // ordered lists
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 0;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, item =>
      (++idx) + ". " + stripTags(item).replace(/\s+/g, " ").trim()
    ).trim();
  });

  // tables
  text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, inner) => {
    const rows = [];
    inner.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, rowInner) => {
      const cells = [];
      rowInner.replace(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi, (_, cell) =>
        cells.push(stripTags(cell).replace(/\n/g, " ").trim())
      );
      if (cells.length) rows.push(cells);
    });
    if (rows.length < 2) return rows.map(r => r.join(" | ")).join("\n");
    const [header, ...body] = rows;
    return [header.join(" | "), header.map(() => "---").join(" | "), ...body.map(r => r.join(" | "))].join("\n");
  });

  // blockquote
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
    stripTags(inner).split("\n").map(l => "> " + l).join("\n")
  );

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) =>
    "\n" + stripTags(inner).replace(/\s+/g, " ").trim() + "\n"
  );

  return stripTags(text);
}

// ── Fetch ────────────────────────────────────────────────────────────

async function fetchChapter(mcVersion, chapter) {
  const route = manifest.versions[mcVersion].mkdocs.route;
  const primaryUrl = `https://docs.minecraftforge.net/en/${route}/${chapter}/`;

  let { ok, status, content, error, finalUrl } = await fetchUrl(primaryUrl);
  if (!ok) {
    const altUrl = `https://mcforge.readthedocs.io/en/${route}/${chapter}/`;
    const alt = await fetchUrl(altUrl);
    if (alt.ok) { ok = true; content = alt.content; finalUrl = alt.finalUrl; }
    else return { ok: false, status, error: error || alt.error };
  }

  const markdown = extractMarkdown(content, finalUrl || primaryUrl);
  return { ok: true, markdown, finalUrl };
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  for (const mcVer of versions) {
    const verInfo = manifest.versions[mcVer];
    if (!verInfo?.mkdocs?.available) {
      console.log(`SKIP ${mcVer}: MkDocs not available`);
      continue;
    }

    const chapters = verInfo.mkdocs.chapters;
    const filtered = targetSection
      ? (chapters.filter(c => c.includes(targetSection)).length > 0
          ? chapters.filter(c => c.includes(targetSection))
          : [targetSection])
      : chapters;

    if (filtered.length === 0) {
      console.log(`EMPTY ${mcVer}: No chapters matching "${targetSection}"`);
      continue;
    }

    const versionDir = join(OUT_DIR, `forge_${mcVer}`, "forge-docs", mcVer, "raw");
    if (!existsSync(versionDir)) mkdirSync(versionDir, { recursive: true });

    console.log(`[${mcVer}] Fetching ${filtered.length} chapters...`);

    let success = 0, failed = 0;
    for (const chapter of filtered) {
      const sourceUrl = `${manifest.mkdocsBaseUrl}${verInfo.mkdocs.route}/${chapter}/`;

      if (dryRun) {
        console.log(`  DRY ${chapter}`);
        continue;
      }

      const fileName = chapter.replace(/\//g, "_") + ".md";
      const filePath = join(versionDir, fileName);

      if (existsSync(filePath) && !force) {
        process.stdout.write(`  SKIP ${chapter}\n`);
        success++;
        continue;
      }

      process.stdout.write(`  FETCH ${chapter}... `);
      const { ok, markdown, status, error } = await fetchChapter(mcVer, chapter);

      if (ok && markdown && markdown.length > 200) {
        const fm = ["---", `version: "${mcVer}"`, `forgeVersion: "${verInfo.forgeVersion}"`,
          `chapter: "${chapter}"`, `source: "${sourceUrl}"`, `sourceType: mkdocs`, "---", ""].join("\n");
        writeFileSync(filePath, fm + markdown, "utf-8");
        console.log(`OK ${(markdown.length / 1024).toFixed(1)}KB`);
        success++;
      } else {
        console.log(`FAIL HTTP ${status} ${error || ""}`);
        failed++;
      }

      await new Promise(r => setTimeout(r, 300));
    }

    console.log(`  RESULT: ${success} OK, ${failed} failed\n`);
  }

  if (dryRun) console.log("(dry-run, no files written)");
  else console.log("DONE!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
