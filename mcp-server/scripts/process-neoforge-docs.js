#!/usr/bin/env node
/**
 * process-neoforge-docs.js
 * Process fetched NeoForge docs into search indices (L0/L1/L2) and processed files.
 *
 * Usage:
 *   node scripts/process-neoforge-docs.js                  # process all versions
 *   node scripts/process-neoforge-docs.js --version=26.1    # specific version
 *   node scripts/process-neoforge-docs.js --skip-indices     # only copy processed files
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { countCodeFences } from "./_lib/pipeline-helpers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");
const MANIFEST_PATH = join(__dirname, "..", "..", "data", "neoforge-versions-manifest.json");

// ── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const force = args.includes("--force");
const skipIndices = args.includes("--skip-indices");
const targetVer = args.find(a => a.startsWith("--version="))?.split("=")[1];

// ── Manifest ─────────────────────────────────────────────────────────────────

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
} catch (e) {
  console.error("ERROR: Cannot load manifest.");
  process.exit(1);
}

const versions = targetVer
  ? [targetVer]
  : Object.keys(manifest.versions).filter(v => manifest.versions[v].available && manifest.versions[v].type === "main-docs");

console.log(`Processing versions: ${versions.join(", ")}`);

// ── Key tags ────────────────────────────────────────────────────────────────

const CHAPTER_TAGS = {
  gettingstarted: ["getting-started", "tutorial", "setup"],
  concepts: ["core", "concepts", "fundamentals"],
  blocks: ["block", "blockstate", "model"],
  items: ["item", "creative-tab", "tooltip"],
  entities: ["entity", "spawning", "ai"],
  blockentities: ["block-entity", "tile-entity", "tickable"],
  resources: ["resources", "assets", "datapack", "loot-table"],
  inventories: ["inventory", "item-handler", "transfer"],
  datastorage: ["nbt", "data-storage", "saved-data"],
  worldgen: ["worldgen", "biome", "feature"],
  networking: ["networking", "packet", "payload", "channel"],
  rendering: ["rendering", "model", "texture", "shader"],
  advanced: ["advanced", "mixin", "access-transformer"],
  misc: ["misc", "config", "logging"],
  datagen: ["datagen", "data-generation", "provider"],
  datamaps: ["datamaps", "data-components"],
  gui: ["gui", "screen", "menu", "widget"],
};

const NEOFORGE_CORE_KEYWORDS = [
  "deferredregister", "registerevent", "neoforge", "neoform",
  "datacomponent", "payload", "streamcodec", "configurationtask",
  "datapackregistrar", "iresourceprovider", "datamap",
];

// ── Tag inference ─────────────────────────────────────────────────────────

function inferTags(pageId, content) {
  const tags = new Set();
  const lower = pageId.toLowerCase() + " " + content.toLowerCase();

  // Chapter-level tag
  const firstSegment = pageId.split("/")[0];
  if (CHAPTER_TAGS[firstSegment]) {
    for (const t of CHAPTER_TAGS[firstSegment]) tags.add(t);
  }

  // Core keyword tag
  for (const kw of NEOFORGE_CORE_KEYWORDS) {
    if (lower.includes(kw)) tags.add("neoforge-core");
  }

  // Code block presence
  if (content.includes("```")) tags.add("has-code");

  // API presence
  if (lower.includes("deferredregister")) tags.add("deferredregister");
  if (lower.includes("registerevent")) tags.add("registerevent");
  if (lower.includes("datacomponent")) tags.add("data-components");
  // 词边界匹配：避免 DeferredRegister 子串误标 registry
  if (
    /registr/.test(pageId) ||
    /\bregistr(?:y|ies)\b/i.test(lower)
  ) {
    tags.add("registry");
  }

  return [...tags];
}

// ── Index helpers ──────────────────────────────────────────────────────────

function stripFrontmatter(text) {
  return text.replace(/^---[\s\S]*?---\n/, "");
}

function extractTitle(frontmatter, content) {
  // 优先正文 H1（Docusaurus 分类页 frontmatter title 常为侧栏分类名，如 Concepts）
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  const fm = frontmatter.match(/title:\s*"([^"]+)"/);
  if (fm) return fm[1];
  return "Untitled";
}

function extractFirstParagraph(content) {
  const paras = content.split(/\n\n+/);
  for (const p of paras) {
    const cleaned = p.replace(/^#+\s+/, "").replace(/```[\s\S]*?```/g, "").trim();
    if (cleaned.length > 50) return cleaned.substring(0, 300);
  }
  return "";
}

function extractSections(content) {
  const sections = [];
  const lines = content.split("\n");
  let current = null;
  let paraBuf = [];
  let inCode = false;

  const flushPara = () => {
    if (!current) return;
    const text = paraBuf.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1").trim();
    paraBuf = [];
    if (text.length > 20 && !current.summary) {
      current.summary = text.length > 200 ? text.slice(0, 197) + "..." : text;
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const h = line.match(/^(#{2,3})\s+(.+)$/);
    if (h) {
      flushPara();
      if (current) sections.push(current);
      current = {
        title: h[2].replace(/\[.*?\]\(.*?\)/g, "").trim(),
        level: h[1].length,
        summary: "",
      };
      continue;
    }

    if (!current) continue;
    if (line.trim() === "") {
      flushPara();
    } else if (!line.startsWith("#")) {
      paraBuf.push(line.trim());
    }
  }
  flushPara();
  if (current) sections.push(current);
  return sections;
}

function scoreRelevance(entry, query) {
  const lowerQuery = query.toLowerCase();
  const qWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
  const text = (entry.label + " " + entry.tags.join(" ")).toLowerCase();
  let score = 0;
  for (const w of qWords) {
    if (entry.label.toLowerCase().includes(w)) score += 3;
    if (text.includes(w)) score += 1;
    for (const tag of entry.tags) {
      if (tag.includes(w)) score += 2;
    }
  }
  return score;
}

// ── Process version ──────────────────────────────────────────────────────────

function processVersion(version) {
  console.log(`\nProcessing NeoForge ${version}...`);

  const rawDir = join(DATA_DIR, `neoforge_${version}`, "neoforge-docs", version, "raw");
  const outVersionDir = join(DATA_DIR, `neoforge_${version}`, "neoforge-docs", version);
  const processedDir = join(outVersionDir, "processed");

  mkdirSync(processedDir, { recursive: true });

  if (!existsSync(rawDir)) {
    console.error(`  ERROR: Raw dir not found: ${rawDir}`);
    return false;
  }

  const files = readdirSync(rawDir).filter(f => f.endsWith(".md"));
  console.log(`  Found ${files.length} raw files`);

  // Read all files
  const rawFiles = {};
  for (const file of files) {
    const pageId = file.replace(/\.md$/, "").replace(/_/g, "/");
    try {
      rawFiles[pageId] = readFileSync(join(rawDir, file), "utf-8");
    } catch (e) {
      console.error(`  ERROR reading ${file}: ${e.message}`);
    }
  }

  // ── Build L0 index ──────────────────────────────────────────────────
  const l0Entries = [];
  for (const [pageId, rawContent] of Object.entries(rawFiles)) {
    const content = stripFrontmatter(rawContent);
    const frontmatter = rawContent.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
    const title = extractTitle(frontmatter, content);
    const tags = inferTags(pageId, content);
    const sections = extractSections(content);
    const url = manifest.versions[version]?.docBase + pageId + "/";

    l0Entries.push({
      id: pageId,
      version,
      label: title,
      url,
      tags,
      priority: tags.includes("neoforge-core") ? "high" : "normal",
      sectionCount: sections.length,
    });
  }

  // ── Build L1 summary index ────────────────────────────────────────
  const l1Entries = l0Entries.map(entry => {
    const content = stripFrontmatter(rawFiles[entry.id] || "");
    return {
      id: entry.id,
      version: entry.version,
      label: entry.label,
      url: entry.url,
      tags: entry.tags,
      firstParagraph: extractFirstParagraph(content),
      sections: extractSections(content).map(s => ({ title: s.title, level: s.level, summary: s.summary || "" })),
    };
  });

  // ── Build L2 full-text index ────────────────────────────────────────
  const l2Entries = l0Entries.map(entry => {
    const content = stripFrontmatter(rawFiles[entry.id] || "");
    const sections = extractSections(content);
    // 委托给共享 helper：避免单反引号 inline code 误计入围栏块
    const codeBlockCount = countCodeFences(content);
    return {
      id: entry.id,
      version: entry.version,
      label: entry.label,
      url: entry.url,
      tags: entry.tags,
      content: content.substring(0, 100000), // cap at 100KB per page
      sections,
      hasCodeBlocks: codeBlockCount > 0,
      codeBlockCount,
      keySections: 0,
      processedFile: `processed/${entry.id.replace(/\//g, "_")}.md`,
    };
  });

  // Write indices
  writeFileSync(join(outVersionDir, "index-l0.json"), JSON.stringify(l0Entries, null, 2), "utf-8");
  writeFileSync(join(outVersionDir, "index-l1.json"), JSON.stringify(l1Entries, null, 2), "utf-8");
  writeFileSync(join(outVersionDir, "index-l2.json"), JSON.stringify(l2Entries, null, 2), "utf-8");

  console.log(`  Written: index-l0.json (${l0Entries.length} entries)`);
  console.log(`  Written: index-l1.json (${l1Entries.length} entries)`);
  console.log(`  Written: index-l2.json (${l2Entries.length} entries)`);

  // ── Copy processed files ─────────────────────────────────────────────
  for (const [pageId, rawContent] of Object.entries(rawFiles)) {
    const safeId = pageId.replace(/\//g, "_");
    const outFile = join(processedDir, `${safeId}.md`);
    const content = stripFrontmatter(rawContent);
    writeFileSync(outFile, content + "\n", "utf-8");
  }
  console.log(`  Written: ${Object.keys(rawFiles).length} processed files`);

  return true;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let success = 0, failed = 0;
  for (const version of versions) {
    if (processVersion(version)) success++;
    else failed++;
  }
  console.log(`\n=== Summary ===`);
  console.log(`Success: ${success} | Failed: ${failed}`);
}

main().catch(err => {
  console.error("Process failed:", err);
  process.exit(1);
});
