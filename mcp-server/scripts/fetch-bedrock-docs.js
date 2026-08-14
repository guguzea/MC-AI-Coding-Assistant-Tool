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
