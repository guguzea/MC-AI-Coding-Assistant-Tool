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

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parseCliArgs, compareVersions } from "./_lib/args.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// 与 probe-neoforge-versions.js 一致：产物落在**仓库根 data/**。
// 旧值 `join(__dirname, "..", "data")` 指向 `mcp-server/data/`，而 fetch-forge-docs.js /
// fetch-forge-javadoc.js / validate-forge-build.js 读的都是 `<repo>/data/forge-versions-manifest.json`
// —— 探测结果从来没被抓取器看见过，这正是 manifest chapters 停在 43 条（F122）的第二道根因。
const OUT_DIR = join(__dirname, "..", "..", "data");
const OUT_FILE = join(OUT_DIR, "forge-versions-manifest.json");

// ── Version configuration ───────────────────────────────────────────────────
// 下表 `forgeVersion` = 该 docs 路由上「确实存在的一个构建样本」，用于探测路由可用性；
// 它**不是**「当前推荐版 / 最新版」，别和 AGENTS.md 的 MDK 钉值、mdk-checksums.json 互相对账。
// 当前版号口径两条腿（2026-09-07 实测一致）：promotions_slim.json 的 `1.20.1-latest` = 47.4.23、
// `1.20.1-recommended` = 47.4.10；maven-metadata.xml 的 1.20.1 线最大值同为 47.4.23。
// 该 XML 的 <latest>/<release> = `1.19.4-45.4.5`（跨线最后上传项，5046 个版本）⇒ 禁止当「Forge 最新版」。

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
    // 只跳过裸锚点。`..` / `.` **不能**提前丢：它们解析后正是版本根页
    // （= MkDocs 站点首页），下面会归一成 chapter `index`（F122：1.12.2 缺 index 页）。
    if (href === "#") continue;
    if (href.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|json|md|woff2?|ttf|eot)(\?|$)/)) continue;

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

    // 上游 MkDocs 的导航会把站点首页写成 `…/en/<route>/`（去掉版本前缀后为空段），
    // 个别档还会直连 `…/en/<route>/index/`。两种形态都归一到 chapter `index`，
    // 而不是 `if (!clean) continue` 把它丢掉（F122：1.12.2 站点首页因此常年缺失）。
    if (clean === "" || clean === "index" || clean === versionPrefix?.replace(/^\//, "").replace(/\/$/, "")) {
      chapters.add("index");
      continue;
    }

    // 只过滤真正的非内容前缀（资源 / CDN / 语言根）。
    // 旧表里还列着 `contributing` / `styleguide` / `forgedev`——这三条是真实文档页
    // （docs.minecraftforge.net 实测 200，且各自出现在上游 sitemap.xml 里），
    // 把它们当噪声跳过就是 1.12.2 少 14 页的直接根因（F122）。
    if (/^(en|images|css|fonts|cdn-cgi|assets|javascripts|stylesheets)\b/.test(clean)) continue;
    // 上游导航里偶见 `%2B`（`imodelstate+part`），还原成真实页名再入库。
    let decoded = clean;
    try {
      decoded = decodeURIComponent(clean);
    } catch {
      /* 非法百分号序列：保持原样 */
    }
    chapters.add(decoded);
  }
  return [...chapters].sort();
}

// ── 与既有 manifest 合并（单版本重跑不得清盘）───────────────────────────

export function readPreviousManifest(file) {
  if (!existsSync(file)) return null;
  try {
    const prev = JSON.parse(readFileSync(file, "utf-8"));
    return prev && prev.versions && typeof prev.versions === "object" ? prev : null;
  } catch {
    console.warn(`  现有 manifest 无法解析，本次不继承任何条目：${file}`);
    return null;
  }
}

/**
 * `--version=<mc>` 只重探一个档：
 *  - 未探测的版本必须原样带过去（否则一份 manifest 被写成只剩一档）；
 *  - 被探测的那一档按字段合并 —— `buildMkDocsEntry` 会写 `javadoc: null`，
 *    而 1.12.2 的 javadoc 摘要、1.20.4 的 `routeNote*` 都是抓取链之外攒下来的字段，
 *    逐字段覆盖会把它们抹掉。
 * 全量重跑（filterMc = null）不继承，避免 stale 条目永生。
 */
export function mergeManifest(prev, fresh, { filterMc } = {}) {
  if (!prev || !filterMc) return fresh;
  const out = { ...fresh, versions: { ...prev.versions } };
  for (const key of Object.keys(fresh.versions)) {
    const freshEntry = fresh.versions[key];
    const prevEntry = prev.versions[key];
    if (!prevEntry) { out.versions[key] = freshEntry; continue; }
    const merged = { ...prevEntry, ...freshEntry };
    for (const sub of ["mkdocs", "javadoc"]) {
      if (freshEntry[sub] && prevEntry[sub]) merged[sub] = { ...prevEntry[sub], ...freshEntry[sub] };
      else if (prevEntry[sub] && !freshEntry[sub]) merged[sub] = prevEntry[sub];
    }
    out.versions[key] = merged;
  }
  return out;
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

  const fresh = await buildManifest({ filterMc });
  const manifest = mergeManifest(readPreviousManifest(OUT_FILE), fresh, { filterMc });

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