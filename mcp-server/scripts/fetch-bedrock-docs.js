#!/usr/bin/env node
/**
 * fetch-bedrock-docs.js — Microsoft Learn Creator 页 → data/bedrock_stable/bedrock-docs/stable/
 * 同时写 data/bedrock-docs-status.json（滞后信号）。禁止把 Java 资源包文档当 RP。
 *
 *   node scripts/fetch-bedrock-docs.js [--dry-run]
 */
import { createHash } from "crypto";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DATA = join(ROOT, "data");

const PAGES = [
  {
    id: "pack-manifest",
    label: "Pack manifest",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable",
    tags: ["manifest", "pack"],
  },
  {
    id: "experimental-features-toggle",
    label: "Experimental Features Toggle",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle?view=minecraft-bedrock-stable",
    tags: ["experiments", "beta"],
  },
  {
    id: "script-server",
    label: "@minecraft/server",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable",
    tags: ["script", "server"],
  },
  {
    id: "script-api-intro",
    label: "Script API introduction",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/introduction?view=minecraft-bedrock-stable",
    tags: ["script"],
  },
  {
    id: "getting-started",
    label: "Getting Started with Minecraft Add-Ons",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/gettingstarted?view=minecraft-bedrock-stable",
    tags: ["pack", "intro"],
  },
  {
    id: "resource-pack",
    label: "Introduction to Resource Packs",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/resourcepack?view=minecraft-bedrock-stable",
    tags: ["resourcepack", "rp"],
  },
  {
    id: "behavior-pack",
    label: "Introduction to Behavior Packs",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorpack?view=minecraft-bedrock-stable",
    tags: ["behaviorpack", "bp"],
  },
  {
    id: "entity-behavior-intro",
    label: "Entity Behavior Introduction",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/entitybehaviorintroduction?view=minecraft-bedrock-stable",
    tags: ["entity", "bp"],
  },
  {
    id: "entity-components",
    label: "Entity Components",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/componentlist?view=minecraft-bedrock-stable",
    tags: ["entity", "components"],
  },
  {
    id: "custom-block",
    label: "Create a Custom Die Block",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/customblock?view=minecraft-bedrock-stable",
    tags: ["block", "bp", "rp"],
  },
  {
    id: "block-components",
    label: "Block Components",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/blockcomponentslist?view=minecraft-bedrock-stable",
    tags: ["block", "components"],
  },
  {
    id: "custom-items",
    label: "How to Add Custom Items",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/addcustomitems?view=minecraft-bedrock-stable",
    tags: ["item", "bp"],
  },
  {
    id: "item-components",
    label: "Item Components",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponentlist?view=minecraft-bedrock-stable",
    tags: ["item", "components"],
  },
  {
    id: "molang-intro",
    label: "An Introduction to Molang",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/introduction?view=minecraft-bedrock-stable",
    tags: ["molang"],
  },
  {
    id: "molang-syntax",
    label: "Molang Syntax Guide",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable",
    tags: ["molang"],
  },
  {
    id: "features-intro",
    label: "Introduction to Features",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/featuresreference/examples/featuresintroduction?view=minecraft-bedrock-stable",
    tags: ["worldgen", "features"],
  },
  {
    id: "biomes",
    label: "Biomes",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/reference/content/biomesreference/examples/componentlist?view=minecraft-bedrock-stable",
    tags: ["worldgen", "biome"],
  },
  {
    id: "world-after-events",
    label: "WorldAfterEvents",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldafterevents?view=minecraft-bedrock-stable",
    tags: ["script", "events"],
  },
  {
    id: "system-after-events",
    label: "SystemAfterEvents",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/systemafterevents?view=minecraft-bedrock-stable",
    tags: ["script", "events"],
  },
  {
    id: "script-server-ui",
    label: "@minecraft/server-ui",
    url: "https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-ui/minecraft-server-ui?view=minecraft-bedrock-stable",
    tags: ["script", "ui"],
  },
];

function sha(s) {
  return createHash("sha256").update(s).digest("hex");
}

/** 对所有成功抓取页的 raw HTML 做短哈希，避免只哈希第一页导致漏更新。 */
export function hashRevision(parts) {
  const list = Array.isArray(parts) ? parts : [String(parts ?? "")];
  return sha(list.join("\n")).slice(0, 12);
}

/** 从 @minecraft/server Learn 页抽取稳定模块版本（如 1.14.0）。 */
export function extractScriptApiStable(html) {
  if (!html) return null;
  const near = String(html).match(/@minecraft\/server[\s\S]{0,400}?(\d+\.\d+\.\d+)/i);
  return near?.[1] ?? null;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    const a = resolve(fileURLToPath(import.meta.url)).replace(/\\/g, "/").toLowerCase();
    const b = resolve(entry).replace(/\\/g, "/").toLowerCase();
    return a === b;
  } catch {
    return false;
  }
}

async function fetchText(url) {
  let last;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "MC-skill-docs-fetch" } });
      if (res.ok) return await res.text();
      last = new Error(`${res.status} ${url}`);
    } catch (e) {
      last = e;
    }
    await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
  }
  throw last;
}

function toMd(html, url) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `> 来源：${url}\n> 抓取时间：${new Date().toISOString()}\n> 警告：此文档可能滞后于当前正式版\n\n${text.slice(0, 80_000)}\n`;
}

async function main() {
  const dry = process.argv.includes("--dry-run");
  const ver = "stable";
  const outDir = join(DATA, `bedrock_${ver}`, "bedrock-docs", ver);
  const processed = join(outDir, "processed");
  if (!dry) mkdirSync(processed, { recursive: true });
  const index = [];
  const rawParts = [];
  let scriptServerHtml = null;
  for (const page of PAGES) {
    try {
      const raw = await fetchText(page.url);
      rawParts.push(raw);
      if (page.id === "script-server") scriptServerHtml = raw;
      const md = toMd(raw, page.url);
      if (!dry) writeFileSync(join(processed, `${page.id}.md`), md, "utf8");
      index.push({
        id: `${ver}/${page.id}`,
        version: ver,
        label: page.label,
        url: page.url,
        tags: page.tags,
        priority: "⭐",
        sectionCount: 1,
        source: "bedrock-docs",
        fetchedAt: new Date().toISOString(),
        sha256: sha(md),
      });
      console.log(`ok ${page.id}`);
    } catch (e) {
      console.warn(`skip ${page.id}: ${e.message ?? e}`);
    }
  }
  const fetchedAt = new Date().toISOString();
  const remoteRevision = rawParts.length ? hashRevision(rawParts) : null;
  const extracted = scriptServerHtml ? extractScriptApiStable(scriptServerHtml) : null;
  const statusPath = join(DATA, "bedrock-docs-status.json");
  let prev = {};
  if (existsSync(statusPath)) {
    try {
      prev = JSON.parse(readFileSync(statusPath, "utf8"));
    } catch {
      prev = {};
    }
  }
  const status = {
    localRevision: remoteRevision ?? prev.localRevision ?? null,
    remoteRevision: remoteRevision ?? prev.remoteRevision ?? null,
    scriptApiStable: extracted ?? prev.scriptApiStable ?? "1.11.0",
    scriptApiBeta: prev.scriptApiBeta ?? "beta",
    fetchedAt,
    stale: false,
  };
  if (!dry) {
    writeFileSync(join(outDir, "index-l0.json"), JSON.stringify(index, null, 2), "utf8");
    writeFileSync(statusPath, JSON.stringify(status, null, 2), "utf8");
    console.log(`wrote ${outDir} (${index.length} pages) + ${statusPath}`);
  } else {
    console.log(JSON.stringify({ index: index.length, status }, null, 2));
  }
}

if (isDirectRun()) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
