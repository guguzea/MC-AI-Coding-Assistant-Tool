#!/usr/bin/env node
/**
 * probe-forge-versions.js
 * Probe Forge documentation availability (Javadoc + MkDocs) and emit a manifest
 * describing the known versions.
 *
 * Usage:
 *   node scripts/probe-forge-versions.js [--version=<mc>] [--dry-run]
 *
 *   --version=<mc>   restrict probing to one MC version (e.g. 1.20.1, 1.12.2).
 *                    Also accepts "--version <mc>" (space form).
 *   --dry-run        do not write the manifest to disk.
 *
 * Network is required for live probing; tests use a mocked fetcher.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parseCliArgs, compareVersions } from "./_lib/args.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR  = join(__dirname, "..", "data");
const OUT_FILE = join(OUT_DIR, "forge-versions-manifest.json");

// ── Version configuration ───────────────────────────────────────────────────

const JAVADOC_VERSIONS = [
  { mcVersion: "1.7.10",  forgeVersion: "10.13.4.1614",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/" },
  { mcVersion: "1.8.9",   forgeVersion: "11.15.1.2318",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/" },
  { mcVersion: "1.9.4",   forgeVersion: "12.17.0.2051",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/" },
  { mcVersion: "1.10.2",  forgeVersion: "12.18.3.2185",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/" },
  { mcVersion: "1.11.2",  forgeVersion: "13.20.0.2228",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/" },
  { mcVersion: "1.12.2",  forgeVersion: "14.23.5.2859",  url: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/" },
];

const MKDOCS_VERSIONS = [
  { mkdocsRoute: "1.12.x", mcVersion: "1.12.2",  forgeVersion: "14.23.5.2858", javaVersion: 8,   mappings: "mcp" },
  { mkdocsRoute: "1.13.x", mcVersion: "1.13.2",  forgeVersion: "25.0.55",     javaVersion: 8,   mappings: "mcp" },
  { mkdocsRoute: "1.14.x", mcVersion: "1.14.4",  forgeVersion: "26.0.21",     javaVersion: 8,   mappings: "mcp" },
  { mkdocsRoute: "1.15.x", mcVersion: "1.15.2",  forgeVersion: "29.0.23",     javaVersion: 8,   mappings: "mcp" },
  { mkdocsRoute: "1.16.x", mcVersion: "1.16.5",  forgeVersion: "36.2.34",     javaVersion: 8,   mappings: "mcp+mojmaps" },
  { mkdocsRoute: "1.17.x", mcVersion: "1.17.1",  forgeVersion: "37.1.2",      javaVersion: 16,  mappings: "mojmaps" },
  { mkdocsRoute: "1.18.x", mcVersion: "1.18.2",  forgeVersion: "40.2.14",     javaVersion: 17,  mappings: "mojmaps+parchment" },
  { mkdocsRoute: "1.19.x", mcVersion: "1.19.4",  forgeVersion: "45.2.0",      javaVersion: 17,  mappings: "mojmaps+parchment" },
  { mkdocsRoute: "1.20.1", mcVersion: "1.20.1",  forgeVersion: "47.2.0",      javaVersion: 17,  mappings: "mojmaps+parchment" },
  { mkdocsRoute: "1.20.x", mcVersion: "1.20.4",  forgeVersion: "49.0.0",      javaVersion: 17,  mappings: "mojmaps+parchment" },
];

// ── Pure helpers (exported for tests) ───────────────────────────────────────

export function filterByVersion(items, version) {
  if (!version) return items.slice();
  return items.filter((it) => it.mcVersion === version);
}

/**
 * Pick a Java version for the manifest using a structured compare against
 * 1.10.2. Old behaviour was a string compare `v.mcVersion <= "1.10.2"` which
 * is correct for the sorted list we ship, but we make the intent explicit.
 */
export function javaVersionForJavadoc(mcVersion) {
  return compareVersions(mcVersion, "1.10.2") <= 0 ? 7 : 8;
}

/**
 * Build the manifest object for a single Javadoc probe result. Pure function.
 */
export function buildJavadocEntry(version, probe) {
  return {
    docSource: "javadoc",
    forgeVersion: version.forgeVersion,
    javaVersion: javaVersionForJavadoc(version.mcVersion),
    mappings: "mcp",
    javadoc: {
      url: version.url,
      available: !!probe.available,
      packageCount: probe.packageCount || 0,
    },
    mkdocs: null,
  };
}

/**
 * Build the manifest object for a single MkDocs probe result. Pure function.
 */
export function buildMkDocsEntry(version, probe, chapters, baseUrl) {
  const both = version.mcVersion === "1.12.2";
  return {
    docSource: both ? "both" : "mkdocs",
    forgeVersion: version.forgeVersion,
    javaVersion: version.javaVersion,
    mappings: version.mappings,
    mkdocs: {
      route: version.mkdocsRoute,
      baseUrl: probe.ok ? baseUrl.replace(/\/gettingstarted\/?$/, "") : baseUrl.replace("/gettingstarted/", "/"),
      available: !!probe.ok,
      chapterCount: chapters.length,
      chapters,
      finalUrl: probe.finalUrl,
    },
    javadoc: null,
    note: probe.ok ? undefined : "DNS/网络不可达，稍后重跑",
  };
}

// ── HTTP probe (overridable for tests) ──────────────────────────────────────

/** 默认网络超时（ms）。无超时的请求会永久挂起，卡死整个 probe/fetch 流程。 */
export const DEFAULT_TIMEOUT_MS = 30_000;

// 注意：第二参是 opts（可注入 timeoutMs），不是 retries——
// 旧签名里的 `/* , retries */` 只是注释残留，且无任何调用方按 retries 传参。
export async function defaultFetch(url, opts = {}) {
  const https = await import("node:https");
  const http = await import("node:http");
  const mod = url.startsWith("https") ? https : http;
  // timeoutMs 可注入：既便于测试（否则要等满 30s），也便于抓取慢站时调大
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    let settled = false;
    let req;
    const timer = setTimeout(() => {
      if (!settled) req?.destroy(new Error(`请求超时（${timeoutMs}ms）: ${url}`));
    }, timeoutMs);
    const done = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    req = mod.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () =>
        done(resolve, {
          ok: res.statusCode === 200,
          status: res.statusCode,
          content: Buffer.concat(chunks).toString("utf8"),
          finalUrl: url,
        })
      );
    });
    req.on("error", (e) => done(reject, e));
  });
}

export async function defaultProbeJavadoc(version, fetchFn = defaultFetch) {
  const r = await fetchFn(version.url + "overview-summary.html");
  if (!r.ok || !r.content) return { available: false, packageCount: 0 };
  const pkgLinks = r.content.match(/href="(net\/[^"?#]+)"/g) || [];
  const uniquePkgs = new Set(
    pkgLinks
      .map((l) => l.match(/href="(net\/[^"?#]+)"/)?.[1])
      .filter(Boolean)
      .map((p) => p.split("/").filter(Boolean).slice(0, 3).join("/"))
  );
  return { available: true, packageCount: uniquePkgs.size };
}

export async function defaultProbeMkDocs(version, fetchFn = defaultFetch) {
  const baseUrl = `https://docs.minecraftforge.net/en/${version.mkdocsRoute}/gettingstarted/`;
  const r = await fetchFn(baseUrl);
  return { ...r, baseUrl };
}

// ── Chapter extraction (pure) ───────────────────────────────────────────────

export function extractChapterPaths(navHtml, baseUrl) {
  const chapters = new Set();
  const versionMatch = baseUrl.match(/\/en\/([^/]+)\/gettingstarted\/?$/);
  const versionPrefix = versionMatch ? `/en/${versionMatch[1]}/` : null;

  const hrefs = navHtml.match(/href="([^"]+)"/g) || [];
  for (const raw of hrefs) {
    const href = raw.match(/href="([^"]+)"/)?.[1];
    if (!href) continue;
    if (href === ".." || href === "." || href === "#") continue;
    if (href.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|json|woff2?|ttf|eot)(\?|$)/)) continue;

    let pathname;
    try {
      const abs = new URL(href, baseUrl);
      pathname = abs.pathname.replace(/^\//, "").replace(/\/$/, "");
    } catch {
      continue;
    }
    if (!pathname) continue;

    if (versionPrefix && pathname.startsWith(versionPrefix.replace(/^\//, ""))) {
      pathname = pathname.slice(versionPrefix.length - 1);
      pathname = pathname.replace(/^\//, "");
    }

    const clean = pathname.split("#")[0].split("?")[0];
    if (!clean) continue;
    if (/^(en|images|css|fonts|contributing|styleguide|forgedev|cdn-cgi)\b/.test(clean)) continue;
    chapters.add(clean);
  }
  return [...chapters].sort();
}

// ── Main orchestration ─────────────────────────────────────────────────────

export async function buildManifest({
  javadocVersions = JAVADOC_VERSIONS,
  mkdocsVersions = MKDOCS_VERSIONS,
  filterMc = null,
  probeJavadoc = defaultProbeJavadoc,
  probeMkDocs = defaultProbeMkDocs,
} = {}) {
  const manifest = {
    lastChecked: new Date().toISOString().slice(0, 10),
    javadocBaseUrl: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/",
    mkdocsBaseUrl: "https://docs.minecraftforge.net/en/",
    versions: {},
  };

  const jvs = filterByVersion(javadocVersions, filterMc);
  for (const v of jvs) {
    const probe = await probeJavadoc(v);
    manifest.versions[v.mcVersion] = buildJavadocEntry(v, probe);
  }

  const mvs = filterByVersion(mkdocsVersions, filterMc);
  for (const v of mvs) {
    const probe = await probeMkDocs(v);
    const baseUrl = probe.baseUrl;
    const chapters = probe.ok ? extractChapterPaths(probe.content || "", probe.finalUrl || baseUrl) : [];
    manifest.versions[v.mcVersion] = buildMkDocsEntry(v, probe, chapters, baseUrl);
  }
  return manifest;
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.flags.versionError) {
    console.error(`error: --version requires a non-empty value (${args.flags.versionError})`);
    process.exit(2);
  }
  const dryRun = !!args.flags["dry-run"];
  const filterMc = args.flags.version || null;

  mkdirSync(OUT_DIR, { recursive: true });

  const manifest = await buildManifest({ filterMc });

  if (dryRun) {
    console.log(JSON.stringify(manifest, null, 2));
    return;
  }

  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`✅ manifest 已写入 ${OUT_FILE}`);
}

// Only auto-run when invoked directly (lets tests import this module safely).
const invokedDirectly =
  process.argv[1] &&
  import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}