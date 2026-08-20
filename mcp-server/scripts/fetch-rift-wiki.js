#!/usr/bin/env node
/**
 * fetch-rift-wiki.js
 *
 * 抓取 DimensionalDevelopment/Rift GitHub wiki 全文到
 * data/rift_1.13.2/rift-docs/1.13.2/processed/wiki_*.md，合并 L0。
 *
 * 硬约束：
 *   - 不覆盖 listeners.md / making-mods-wiki.md / upstream-readme.md（核实表）
 *   - making-mods 官方全文另存 wiki_making_mods.md，不改核实摘录
 *
 *   node scripts/fetch-rift-wiki.js [--dry-run]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  fetchTextRetry,
  mergeThinL0,
  sha256,
  writeWikiProcessed,
} from "./_lib/thin-docs-wiki.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const VERSION = "1.13.2";
const DRY = process.argv.includes("--dry-run");

const WIKI_WARNING =
  "Rift GitHub wiki 是归档只读官方页，不是本地核实表。方法名以 listeners.md / 已核实源码为准。";

const PAGES = [
  {
    slug: "wiki_home",
    label: "Rift wiki Home",
    wikiPath: "Home",
    htmlUrl: "https://github.com/DimensionalDevelopment/Rift/wiki",
    tags: ["wiki"],
    priority: "🟡",
  },
  {
    slug: "wiki_making_mods",
    label: "Making mods with Rift",
    wikiPath: "Making-mods-with-Rift",
    htmlUrl: "https://github.com/DimensionalDevelopment/Rift/wiki/Making-mods-with-Rift",
    tags: ["wiki", "tutorial", "metadata"],
    priority: "⭐",
  },
  {
    slug: "wiki_installing_multimc",
    label: "Installing Rift in a MultiMC instance",
    wikiPath: "Installing-Rift-in-a-MultiMC-instance",
    htmlUrl: "https://github.com/DimensionalDevelopment/Rift/wiki/Installing-Rift-in-a-MultiMC-instance",
    tags: ["wiki", "install"],
    priority: "⭐",
  },
];

function rawUrl(wikiPath) {
  return `https://raw.githubusercontent.com/wiki/DimensionalDevelopment/Rift/${wikiPath}.md`;
}

function wrapMarkdown(page, body) {
  return [
    `# ${page.label}`,
    "",
    `> 来源：${page.htmlUrl}`,
    `> 版本：${VERSION}`,
    `> 抓取源：rift-wiki`,
    `> 警告：${WIKI_WARNING}`,
    "",
    body.trim(),
    "",
  ].join("\n");
}

async function main() {
  console.log(`[fetch-rift-wiki] dry-run=${DRY}`);
  const outDir = join(ROOT, "data", `rift_${VERSION}`, "rift-docs", VERSION);
  const processed = join(outDir, "processed");
  const rawDir = join(outDir, "raw");
  if (!DRY) {
    mkdirSync(processed, { recursive: true });
    mkdirSync(rawDir, { recursive: true });
  }

  const fetchedAt = new Date().toISOString();
  const wikiEntries = [];

  for (const page of PAGES) {
    const url = rawUrl(page.wikiPath);
    process.stdout.write(`  ${page.slug} ... `);
    if (DRY) {
      console.log(url);
      continue;
    }
    const res = await fetchTextRetry(url, { accept: "text/plain,text/markdown,*/*" });
    if (!res.ok || res.text.trim().length < 10) {
      console.log(`fail HTTP ${res.status} ${res.text.trim().length}b`);
      continue;
    }
    const md = wrapMarkdown(page, res.text);
    writeFileSync(join(rawDir, `${page.slug}.md`), res.text, "utf8");
    writeWikiProcessed(processed, `${page.slug}.md`, md);
    wikiEntries.push({
      id: `${VERSION}/${page.slug}`,
      version: VERSION,
      label: page.label,
      url: page.htmlUrl,
      tags: page.tags,
      priority: page.priority,
      sectionCount: 1,
      source: "rift-wiki",
      wikiIsCurrentSite: true,
      fetchedAt,
      sha256: sha256(md),
    });
    console.log(`ok ${res.text.length}b`);
  }

  if (DRY) return;
  if (wikiEntries.length === 0) {
    console.error("未抓到任何 Rift wiki 页，保持原 L0（核实表不动）。");
    process.exit(2);
  }
  const stats = mergeThinL0(join(outDir, "index-l0.json"), wikiEntries);
  console.log(`kept ${stats.kept} 核实表卡片 + wiki ${stats.wiki} → L0 ${stats.total}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
