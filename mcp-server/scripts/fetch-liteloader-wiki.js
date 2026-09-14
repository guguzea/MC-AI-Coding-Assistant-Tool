#!/usr/bin/env node
/**
 * fetch-liteloader-wiki.js
 *
 * 抓取 LiteLoader 官方 DokuWiki（https://www.liteloader.com/explore/docs/）
 * 写入 data/liteloader_<ver>/liteloader-docs/<ver>/processed/wiki_*.md
 * 并合并进 index-l0.json。
 *
 * 硬约束：
 *   - 不覆盖 verified-api.md / hybrid.md（核实表）
 *   - 不写 liteloader/<ver>/knowledge/
 *   - 官方站未按 MC 版本切分；三档各挂一份，L0 带 wikiIsCurrentSite
 *
 *   默认 dry-run（只打印 DRYRUN，不联网不写盘）：node scripts/fetch-liteloader-wiki.js
 *   实抓实写：node scripts/fetch-liteloader-wiki.js --write
 */
import { existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { emit, logDryRunBanner, wantWrite } from "../../scripts/_lib/write-guard.mjs";
import {
  dokuwikiToMarkdown,
  extractDokuTitle,
  fetchTextRetry,
  mergeThinL0,
  sha256,
  wikiSlug,
  writeWikiProcessed,
} from "./_lib/thin-docs-wiki.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const VERSIONS = ["1.12.2", "1.10.2", "1.8.9"];
const WRITE = wantWrite();

function repoRel(p) {
  return relative(ROOT, p).split("\\").join("/");
}

const RAW_BASE = "https://www.liteloader.com/explore/docs/_export/raw/";
const HTML_BASE = "https://www.liteloader.com/explore/docs/";

const SEEDS = [
  "dev",
  "dev:quickstart",
  "dev:tutorial",
  "dev:tutorial:eclipse",
  "dev:tutorial:environment",
  "dev:tutorial:mcp",
  "dev:tutorial:source",
  "dev:tutorial:subversion",
  "dev:interfaces",
  "dev:litemod.json",
  "dev:revisions",
  "info:tweak",
  "info:fml",
  "info:modloader",
  "info:modsystem",
  "info:versionedmods",
  "user:install",
  "user:install:installer",
  "user:install:forge",
  "user:install:multimc",
  "user:install:manual",
];

const ALLOWED = /^(dev|info|user)(:|$)/i;

const WIKI_WARNING =
  "LiteLoader 官方 DokuWiki 是未按 MC 版本切分的现行站（开发停在 1.12.2）。本页挂在该 version 索引下仅供 search_docs 检索，禁止当成该版本专属官方树。API 以本档 verified-api 核实表为准。";

function allowedId(id) {
  const n = String(id ?? "").trim().replace(/\/+/g, ":").replace(/^:+/, "");
  if (!n || n.startsWith("#")) return null;
  if (/^(https?:|mailto:|wiki:|playground:|syntax)/i.test(n)) return null;
  if (/\.$/.test(n) || /:\s*$/.test(n) || n === "." || n.includes(":.")) return null;
  if (!ALLOWED.test(n)) return null;
  return n.toLowerCase();
}

function looksMissing(text, status, contentType) {
  if (status !== 200) return true;
  if (/html/i.test(contentType)) return true;
  if (/this topic does not exist|doesn't exist yet/i.test(text)) return true;
  return text.trim().length < 40;
}

function cleanupOrphanWikiFiles(dir, keepNames) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (!/^wiki[_-]/.test(name)) continue;
    if (keepNames.has(name) || keepNames.has(name.replace(/\.txt$/, ".md"))) continue;
    if (name.endsWith(".md") || name.endsWith(".txt")) unlinkSync(join(dir, name));
  }
}

function resolveLink(link, currentId) {
  let raw = String(link).split("|")[0].split("#")[0].trim();
  if (!raw) return null;
  if (/^(https?:|mailto:)/i.test(raw)) return null;
  if (!raw.includes(":")) {
    const ns = currentId.includes(":") ? currentId.slice(0, currentId.lastIndexOf(":")) : "";
    raw = ns ? `${ns}:${raw}` : raw;
  }
  return allowedId(raw);
}

function extractLinks(raw, currentId) {
  const out = [];
  for (const m of raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    const id = resolveLink(m[1], currentId);
    if (id) out.push(id);
  }
  return out;
}

function tagsFor(id) {
  const t = new Set(["wiki"]);
  const s = id.toLowerCase();
  if (/litemod|json/.test(s)) t.add("metadata");
  if (/tutorial|quickstart|eclipse|mcp|source|environment|subversion/.test(s)) t.add("tutorial");
  if (/interface/.test(s)) t.add("api");
  if (/tweak|fml|modloader|modsystem|versioned/.test(s)) t.add("loader");
  if (/install/.test(s)) t.add("install");
  return [...t];
}

function priorityFor(id) {
  if (/quickstart|interfaces|litemod|tutorial$/.test(id)) return "⭐";
  if (/install|tweak/.test(id)) return "🟡";
  return "🟢";
}

async function crawl() {
  const queue = [...SEEDS];
  const seen = new Set();
  const pages = [];

  while (queue.length) {
    const id = allowedId(queue.shift());
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const url = RAW_BASE + id;
    process.stdout.write(`  ${id} ... `);
    try {
      const res = await fetchTextRetry(url, { timeoutMs: 28000 });
      if (looksMissing(res.text, res.status, res.contentType)) {
        console.log(`skip (${res.status}, ${res.text.trim().length}b)`);
        continue;
      }
      const title = extractDokuTitle(res.text, id);
      const mdBody = dokuwikiToMarkdown(res.text);
      pages.push({ id, title, raw: res.text, mdBody, htmlUrl: HTML_BASE + id });
      console.log(`ok ${res.text.length}b «${title}»`);
      for (const next of extractLinks(res.text, id)) {
        if (!seen.has(next)) queue.push(next);
      }
    } catch (e) {
      console.log(`fail ${e.message ?? e}`);
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  return pages;
}

function wrapMarkdown(page, version) {
  return [
    `# ${page.title}`,
    "",
    `> 来源：${page.htmlUrl}`,
    `> 版本：${version}`,
    `> 页面 ID：${page.id}`,
    `> 抓取源：liteloader-wiki`,
    `> 警告：${WIKI_WARNING}`,
    "",
    page.mdBody,
    "",
  ].join("\n");
}

async function main() {
  console.log(`[fetch-liteloader-wiki] write=${WRITE}`);
  console.log("抓取官方 DokuWiki raw export …");
  const pages = WRITE
    ? await crawl()
    : SEEDS.map((id) => ({ id, title: id, raw: "", mdBody: "", htmlUrl: HTML_BASE + id }));
  if (WRITE && pages.length === 0) {
    console.error("未抓到任何 wiki 页，保持原 L0（核实表不动）。");
    process.exit(2);
  }
  console.log(`页面 ${pages.length} 张，写入 ${VERSIONS.join(", ")}`);

  const fetchedAt = new Date().toISOString();
  for (const ver of VERSIONS) {
    const outDir = join(ROOT, "data", `liteloader_${ver}`, "liteloader-docs", ver);
    const processed = join(outDir, "processed");
    const rawDir = join(outDir, "raw");
    const wikiEntries = [];
    for (const page of pages) {
      const slug = wikiSlug(page.id);
      const filename = `${slug}.md`;
      const md = wrapMarkdown(page, ver);
      if (WRITE) {
        emit(join(rawDir, `${slug}.txt`), page.raw);
        writeWikiProcessed(processed, filename, md);
      }
      wikiEntries.push({
        id: `${ver}/${slug}`,
        version: ver,
        label: page.title,
        url: page.htmlUrl,
        tags: tagsFor(page.id),
        priority: priorityFor(page.id),
        sectionCount: 1,
        source: "liteloader-wiki",
        wikiIsCurrentSite: true,
        fetchedAt,
        sha256: sha256(md),
      });
    }
    if (WRITE) {
      const keep = new Set(wikiEntries.flatMap((e) => {
        const slug = e.id.replace(/^[^/]+\//, "");
        return [`${slug}.md`, `${slug}.txt`];
      }));
      cleanupOrphanWikiFiles(processed, keep);
      cleanupOrphanWikiFiles(rawDir, keep);
      const stats = mergeThinL0(join(outDir, "index-l0.json"), wikiEntries);
      console.log(`  ${ver}: kept ${stats.kept} 核实表卡片 + wiki ${stats.wiki} → L0 ${stats.total}`);
    } else {
      console.log(
        `  ${ver}: DRYRUN ${repoRel(processed)}/wiki_*.md × ${wikiEntries.length}` +
          ` + ${repoRel(rawDir)}/wiki_*.txt × ${wikiEntries.length}` +
          ` + ${repoRel(join(outDir, "index-l0.json"))}（mergeThinL0）`,
      );
    }
  }
  if (!WRITE) logDryRunBanner("fetch-liteloader-wiki");
}

// 只在直接执行时抓取；被 import 时不得联网爬取/写 data/（WRITE 来自 argv，
// 默认 dry：不传 --write 时 emit 只打 DRYRUN，测试进程 import 更不落笔）。
const invokedDirectly =
  !!process.argv[1] &&
  import.meta.url.toLowerCase() ===
    pathToFileURL(process.argv[1]).href.toLowerCase();
if (invokedDirectly) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
