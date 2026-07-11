#!/usr/bin/env node
/**
 * probe-neoforge-versions.js
 * Probe NeoForge doc version availability + extract chapter trees + generate neoforge-versions-manifest.json
 *
 * Usage:
 *   node scripts/probe-neoforge-versions.js
 *   node scripts/probe-neoforge-versions.js --dry-run
 *   node scripts/probe-neoforge-versions.js --version=26.1
 *   node scripts/probe-neoforge-versions.js --force
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchPageHtml, isLikelyValidHtmlPage } from "./_lib/pipeline-helpers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "..", "data");
const OUT_FILE = join(OUT_DIR, "neoforge-versions-manifest.json");

// ── HTTP utilities ──────────────────────────────────────────────────────────

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "MC-NeoForge-DocBot/1.0 (+https://github.com/MC-Skill/mc-skill)",
];
let uaIndex = 0;
function nextUA() { return USER_AGENTS[uaIndex++ % USER_AGENTS.length]; }

const TIMEOUT = 10000; // 10 seconds

/**
 * 通过 Node 内置 fetch 抓取页面。
 *
 * 重试策略：
 *   - 4xx：立即返回（无需重试）
 *   - 5xx / 网络错误：退避重试（最多 retries 次）
 *   - 200 但响应体疑似截断：最多重试 1 次（避免无谓重试合法小页面）
 */
async function fetchHtml(url, retries = 2) {
  const ua = nextUA();
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetchPageHtml(url, {
      timeoutMs: TIMEOUT,
      userAgent: ua,
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    if (res.status >= 400 && res.status < 500) {
      return { ok: false, status: res.status, html: null, error: res.error };
    }
    if (!res.ok) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      return { ok: false, status: res.status, html: null, error: res.error };
    }
    if (!isLikelyValidHtmlPage(res.html, res.status, { minBytes: 500 })) {
      if (attempt < Math.min(retries, 1)) {
        await new Promise(r => setTimeout(r, 500));
        continue;
      }
      // 200 但内容无效——按 "不可用" 处理，但保留 status 让调用方决策
      return { ok: true, status: res.status, html: res.html, suspicious: true };
    }
    return { ok: true, status: res.status, html: res.html };
  }
  return { ok: false, status: 0, html: null, error: "exhausted retries" };
}

// ── Version configs (HTTP status verified) ──────────────────────────────────

const VERSION_CONFIG = [
  {
    version: "26.1",
    mcVersion: "26.1",
    neoforgeVersion: "26.1.x",
    javaVersion: 25,
    mappings: "mojmaps+parchment",
    route: "",
    docBase: "https://docs.neoforged.net/docs/",
    testUrl: "https://docs.neoforged.net/docs/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "high",
  },
  {
    version: "1.21.11",
    mcVersion: "1.21.11",
    neoforgeVersion: "21.1.113+",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.21.11",
    docBase: "https://docs.neoforged.net/docs/1.21.11/",
    testUrl: "https://docs.neoforged.net/docs/1.21.11/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
  },
  {
    version: "1.21.10",
    mcVersion: "1.21.10",
    neoforgeVersion: "21.1.90+",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.21.10",
    docBase: "https://docs.neoforged.net/docs/1.21.10/",
    testUrl: "https://docs.neoforged.net/docs/1.21.10/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
    fallbackVersion: "1.21.10",
  },
  {
    version: "1.21.8",
    mcVersion: "1.21.8",
    neoforgeVersion: "21.1.70+",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.21.8",
    docBase: "https://docs.neoforged.net/docs/1.21.8/",
    testUrl: "https://docs.neoforged.net/docs/1.21.8/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
  },
  {
    version: "1.21.5",
    mcVersion: "1.21.5",
    neoforgeVersion: "21.1.50+",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.21.5",
    docBase: "https://docs.neoforged.net/docs/1.21.5/",
    testUrl: "https://docs.neoforged.net/docs/1.21.5/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
  },
  {
    version: "1.21.3",
    mcVersion: "1.21.3",
    neoforgeVersion: "21.1.30+",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.21.3",
    docBase: "https://docs.neoforged.net/docs/1.21.3/",
    testUrl: "https://docs.neoforged.net/docs/1.21.3/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
  },
  {
    version: "1.21.1",
    mcVersion: "1.21.1",
    neoforgeVersion: "21.1.113",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.21.1",
    docBase: "https://docs.neoforged.net/docs/1.21.1/",
    testUrl: "https://docs.neoforged.net/docs/1.21.1/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
  },
  {
    version: "1.20.6",
    mcVersion: "1.20.6",
    neoforgeVersion: "20.4.100+",
    javaVersion: 21,
    mappings: "mojmaps+parchment",
    route: "1.20.6",
    docBase: "https://docs.neoforged.net/docs/1.20.6/",
    testUrl: "https://docs.neoforged.net/docs/1.20.6/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "medium",
  },
  {
    version: "1.20.4",
    mcVersion: "1.20.4",
    neoforgeVersion: "20.4.237",
    javaVersion: 17,
    mappings: "mojmaps+parchment",
    route: "1.20.4",
    docBase: "https://docs.neoforged.net/docs/1.20.4/",
    testUrl: "https://docs.neoforged.net/docs/1.20.4/gettingstarted/",
    available: null,
    httpStatus: null,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "high",
    fallbackVersion: "1.20.4",
  },
  {
    version: "26.2",
    mcVersion: "26.2",
    neoforgeVersion: "26.2.x",
    javaVersion: 25,
    mappings: "mojmaps+parchment",
    route: "26.2",
    docBase: "https://docs.neoforged.net/docs/26.2/",
    testUrl: "https://docs.neoforged.net/docs/26.2/gettingstarted/",
    available: false,
    httpStatus: 404,
    versionLabel: null,
    chapters: [],
    type: "main-docs",
    priority: "low",
    fallbackVersion: "26.1",
    note: "No 26.2 docs yet, content falls back to 26.1",
  },
  {
    version: "1.20.1",
    mcVersion: "1.20.1",
    neoforgeVersion: "20.1.x",
    javaVersion: 17,
    mappings: "mojmaps+parchment",
    route: "1.20.1",
    docBase: "https://docs.neoforged.net/docs/1.20.1/",
    testUrl: "https://docs.neoforged.net/docs/1.20.1/gettingstarted/",
    available: false,
    httpStatus: 404,
    versionLabel: null,
    chapters: [],
    type: "forge-compatible",
    priority: "high",
    fallbackVersion: "1.20.4",
    forgeVersion: "1.20.1",
    note: "NeoForge 1.20.1 is 100% API-compatible with Forge 1.20.1",
  },
];

const PRIMER_CONFIG = [
  { version: "26.1",    url: "https://docs.neoforged.net/primer/docs/26.1/",     from: "1.21.11", to: "26.1"    },
  { version: "1.21",    url: "https://docs.neoforged.net/primer/docs/1.21/",       from: "1.20.6",  to: "1.21"     },
  { version: "1.21.2", url: "https://docs.neoforged.net/primer/docs/1.21.2/",   from: "1.21.1",  to: "1.21.2"  },
  { version: "1.21.4", url: "https://docs.neoforged.net/primer/docs/1.21.4/",   from: "1.21.3",  to: "1.21.4"  },
  { version: "1.21.6", url: "https://docs.neoforged.net/primer/docs/1.21.6/",   from: "1.21.5",  to: "1.21.6"  },
  { version: "1.21.7", url: "https://docs.neoforged.net/primer/docs/1.21.7/",   from: "1.21.6",  to: "1.21.7"  },
  { version: "1.21.9", url: "https://docs.neoforged.net/primer/docs/1.21.9/",   from: "1.21.8",  to: "1.21.9"  },
  { version: "1.21.10",url: "https://docs.neoforged.net/primer/docs/1.21.10/",  from: "1.21.9",  to: "1.21.10" },
  { version: "1.20.6", url: "https://docs.neoforged.net/primer/docs/1.20.6/",   from: "1.20.5",  to: "1.20.6"  },
];

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const targetVer = args.find(a => a.startsWith("--version="))?.split("=")[1];

if (dryRun) {
  console.log("=== NeoForge Version Probe Dry Run ===");
  console.log(`Total versions: ${VERSION_CONFIG.length}`);
  console.log(`Primers: ${PRIMER_CONFIG.length}`);
  console.log("\nMain docs:");
  for (const cfg of VERSION_CONFIG) {
    console.log(`  ${cfg.version}: ${cfg.testUrl}`);
  }
  console.log("\nPrimers:");
  for (const p of PRIMER_CONFIG) {
    console.log(`  ${p.version}: ${p.url}`);
  }
  process.exit(0);
}

// ── Chapter tree extraction ─────────────────────────────────────────────────

/**
 * Extract sidebar chapter list from Docusaurus HTML.
 *
 * Docusaurus 3 sidebar HTML structure:
 * <ul class="menu__list">
 *   <li class="...menu__list-item...">
 *     <div class="menu__list-item-collapsible">
 *       <a class="menu__link menu__link--sublist" href="/docs/concepts/registries">
 *         <span class="categoryLinkLabel">Concepts</span>
 *       </a>
 *       <button class="clean-btn menu__caret">...</button>
 *     </div>
 *   </li>
 *   <li class="...menu__list-item...">
 *     <a class="menu__link" href="/docs/gettingstarted/modfiles">
 *       <span class="linkLabel">Mod Files</span>
 *     </a>
 *   </li>
 * </ul>
 *
 * @param {string} html - Raw HTML
 * @param {string} versionRoute - Version route ("" = 26.1, e.g. "1.20.4")
 * @returns {Array}
 */
function extractChapterPaths(html, versionRoute) {
  // NOTE: Docusaurus SSR does NOT render collapsed sidebar categories in HTML.
  // Only the currently-active category's pages appear in the sidebar HTML.
  // Full chapter trees are loaded client-side via JS.
  // Chapter lists must come from pre-verified manifest data (neoforge-versions-manifest.json).
  // This function only extracts what is immediately visible in HTML.
  const routePrefix = versionRoute ? `/docs/${versionRoute}/` : "/docs/";
  const chapters = new Map();
  const sidebarMatch = html.match(/<ul[^>]*class="[^"]*menu__list[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  if (!sidebarMatch) return [];
  const sidebarContent = sidebarMatch[1];
  const liRegex = /<li[^>]*class="[^"]*menu__list-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch;
  while ((liMatch = liRegex.exec(sidebarContent)) !== null) {
    const liContent = liMatch[1];
    const hrefMatch = liContent.match(/href="([^"]*)"/);
    const aContentMatch = liContent.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
    if (!hrefMatch || !aContentMatch) continue;
    const href = hrefMatch[1];
    const aContent = aContentMatch[1];
    if (!href.startsWith("/docs/")) continue;
    if (href.includes("#")) continue;
    const text = aContent.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&amp;/g, "&").trim();
    if (!text) continue;
    const isCategory = aContent.includes("menu__link--sublist") || liContent.includes("menu__list-item-collapsible");
    let relPath = href.replace(routePrefix, "").replace(/\/$/, "");
    if (!relPath) continue;
    if (!chapters.has(relPath)) {
      chapters.set(relPath, { text, isCategory });
    }
  }
  if (chapters.size === 0) {
    const hrefRegex = /href="(\/docs\/[^"#\s]+)"/g;
    const seen = new Set();
    let m;
    while ((m = hrefRegex.exec(html)) !== null) {
      const href = m[1];
      if (!href.startsWith("/docs/")) continue;
      let relPath = href.replace(routePrefix, "").replace(/\/$/, "");
      if (!relPath || seen.has(relPath)) continue;
      seen.add(relPath);
      chapters.set(relPath, { text: relPath.split("/").pop().replace(/-/g, " "), isCategory: false });
    }
  }
  const result = [];
  for (const [relPath, info] of chapters) {
    const parts = relPath.split("/");
    const parentPath = parts.length > 1 ? parts[0] : null;
    const parent = parentPath ? chapters.get(parentPath) : null;
    const level = parent && parent.isCategory ? 2 : 1;
    result.push({ text: info.text, href: relPath, level, isCategory: info.isCategory });
  }
  return result;
}

/**
 * Extract version label from HTML
 */
function extractVersionLabel(html) {
  // Priority 1: Version badge <span class="theme-doc-version-badge ...">Version: 1.20.3 - 1.20.4</span>
  const badgeMatch = html.match(/<span[^>]*class="[^"]*theme-doc-version-badge[^"]*"[^>]*>([^<]+)<\/span>/i);
  if (badgeMatch) return badgeMatch[1].trim();

  // Priority 2: Page content "Version: X.Y"
  const contentMatch = html.match(/Version:\s*([^\n<]+)/);
  if (contentMatch) return contentMatch[1].trim();

  return null;
}

// ── Probe logic ──────────────────────────────────────────────────────────────

async function probeVersion(cfg) {
  if (cfg.available === false) {
    // Known unavailable versions (26.2, 1.20.1)
    return { ...cfg };
  }

  const res = await fetchHtml(cfg.testUrl);
  if (!res.ok) {
    console.log(`  ${cfg.version}: HTTP ${res.status}`);
    return { ...cfg, available: false, httpStatus: res.status, chapters: [] };
  }

  const versionLabel = extractVersionLabel(res.html);
  const chapters = extractChapterPaths(res.html, cfg.route);

  console.log(`  ${cfg.version}: HTTP ${res.status} | ${chapters.length} chapters | "${versionLabel}"`);

  return { ...cfg, available: true, httpStatus: res.status, versionLabel, chapters };
}

async function probePrimers() {
  const results = {};
  for (const cfg of PRIMER_CONFIG) {
    const res = await fetchHtml(cfg.url);
    results[cfg.version] = {
      url: cfg.url,
      from: cfg.from,
      to: cfg.to,
      available: res.ok,
      httpStatus: res.status,
    };
    console.log(`  Primer ${cfg.version}: HTTP ${res.status}`);
    await new Promise(r => setTimeout(r, 300));
  }
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== NeoForge Version Probe ===");
  console.log(`Time: ${new Date().toISOString()}`);

  mkdirSync(OUT_DIR, { recursive: true });

  // Probe main docs versions
  console.log("\nProbing main docs versions...");
  const probeConfigs = targetVer
    ? VERSION_CONFIG.filter(c => c.version === targetVer)
    : VERSION_CONFIG;

  const probedVersions = {};
  for (const cfg of probeConfigs) {
    const result = await probeVersion(cfg);
    probedVersions[cfg.version] = result;

    if (result.available !== false) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Probe primers
  console.log("\nProbing primers...");
  const primerResults = await probePrimers();

  // Build manifest
  const manifest = {
    lastChecked: new Date().toISOString(),
    probeScript: "probe-neoforge-versions.js",
    docBaseUrl: "https://docs.neoforged.net/docs/",
    primerBaseUrl: "https://docs.neoforged.net/primer/docs/",
    versions: probedVersions,
    primers: primerResults,
  };

  // Stats
  const availableVersions = Object.entries(probedVersions).filter(([k, v]) => v.available);
  const unavailableVersions = Object.entries(probedVersions).filter(([k, v]) => !v.available);
  const availablePrimers = Object.entries(primerResults).filter(([k, v]) => v.available);

  console.log(`\n=== Results ===`);
  console.log(`Available main docs: ${availableVersions.length}/${VERSION_CONFIG.length}`);
  if (unavailableVersions.length > 0) {
    console.log(`Unavailable: ${unavailableVersions.map(([k]) => k).join(", ")}`);
  }
  console.log(`Available primers: ${availablePrimers.length}/${PRIMER_CONFIG.length}`);

  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\nWritten: ${OUT_FILE}`);
}

main().catch(err => {
  console.error("Probe failed:", err);
  process.exit(1);
});
