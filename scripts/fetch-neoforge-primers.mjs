#!/usr/bin/env node
/**
 * Probe + 入库 NeoForge Primer（404 不写）。
 * loader: to < 1.20 → forge；1.20/1.20.1 → fork；≥1.20.2 → neoforge。
 * Forge 口径的 md 另拷进对应 forge_<ver>/forge-docs/<ver>/raw/primer-<slug>.md（不进 javadoc 档）。
 * 默认 dry-run：抓取照做，落盘经 write-guard 只打印 DRYRUN，加 --write 才写仓库 data/。
 */
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { emit, logDryRunBanner, wantWrite } from "./_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "neoforge_primers");
if (!wantWrite()) logDryRunBanner("fetch-neoforge-primers");

const PRIMER_CONFIG = [
  { version: "26.2", url: "https://docs.neoforged.net/primer/docs/26.2/", from: "26.1", to: "26.2" },
  { version: "26.1", url: "https://docs.neoforged.net/primer/docs/26.1/", from: "1.21.11", to: "26.1" },
  { version: "1.21", url: "https://docs.neoforged.net/primer/docs/1.21/", from: "1.20.6", to: "1.21" },
  { version: "1.21.1", url: "https://docs.neoforged.net/primer/docs/1.21.1/", from: "1.21", to: "1.21.1" },
  { version: "1.21.2", url: "https://docs.neoforged.net/primer/docs/1.21.2/", from: "1.21.1", to: "1.21.2" },
  { version: "1.21.4", url: "https://docs.neoforged.net/primer/docs/1.21.4/", from: "1.21.3", to: "1.21.4" },
  { version: "1.21.5", url: "https://docs.neoforged.net/primer/docs/1.21.5/", from: "1.21.4", to: "1.21.5" },
  { version: "1.21.6", url: "https://docs.neoforged.net/primer/docs/1.21.6/", from: "1.21.5", to: "1.21.6" },
  { version: "1.21.7", url: "https://docs.neoforged.net/primer/docs/1.21.7/", from: "1.21.6", to: "1.21.7" },
  { version: "1.21.8", url: "https://docs.neoforged.net/primer/docs/1.21.8/", from: "1.21.7", to: "1.21.8" },
  { version: "1.21.9", url: "https://docs.neoforged.net/primer/docs/1.21.9/", from: "1.21.8", to: "1.21.9" },
  { version: "1.21.10", url: "https://docs.neoforged.net/primer/docs/1.21.10/", from: "1.21.9", to: "1.21.10" },
  { version: "1.21.11", url: "https://docs.neoforged.net/primer/docs/1.21.11/", from: "1.21.10", to: "1.21.11" },
  { version: "1.20.6", url: "https://docs.neoforged.net/primer/docs/1.20.6/", from: "1.20.5", to: "1.20.6" },
  { version: "1.14", url: "https://docs.neoforged.net/primer/docs/1.14/", from: "1.12", to: "1.14" },
  { version: "1.15", url: "https://docs.neoforged.net/primer/docs/1.15/", from: "1.14", to: "1.15" },
  { version: "1.16.5", url: "https://docs.neoforged.net/primer/docs/1.16.5/", from: "1.15.2", to: "1.16.5" },
  { version: "1.17", url: "https://docs.neoforged.net/primer/docs/1.17/", from: "1.16.5", to: "1.17" },
  { version: "1.18", url: "https://docs.neoforged.net/primer/docs/1.18/", from: "1.17.1", to: "1.18" },
  { version: "1.19", url: "https://docs.neoforged.net/primer/docs/1.19/", from: "1.18.2", to: "1.19" },
  { version: "1.19.3", url: "https://docs.neoforged.net/primer/docs/1.19.3/", from: "1.19.2", to: "1.19.3" },
  { version: "1.19.4", url: "https://docs.neoforged.net/primer/docs/1.19.4/", from: "1.19.3", to: "1.19.4" },
  { version: "1.20", url: "https://docs.neoforged.net/primer/docs/1.20/", from: "1.19.4", to: "1.20" },
  { version: "1.20.2", url: "https://docs.neoforged.net/primer/docs/1.20.2/", from: "1.20.1", to: "1.20.2" },
  { version: "1.20.4", url: "https://docs.neoforged.net/primer/docs/1.20.4/", from: "1.20.2", to: "1.20.4" },
  { version: "1.20.5", url: "https://docs.neoforged.net/primer/docs/1.20.5/", from: "1.20.4", to: "1.20.5" },
];

const FORGE_TREE = {
  "1.14": { dir: "forge_1.14.4", ver: "1.14.4" },
  "1.15": { dir: "forge_1.15.2", ver: "1.15.2" },
  "1.16.5": { dir: "forge_1.16.5", ver: "1.16.5" },
  "1.17": { dir: "forge_1.17.1", ver: "1.17.1" },
  "1.18": { dir: "forge_1.18.2", ver: "1.18.2" },
  "1.19": { dir: "forge_1.19.2", ver: "1.19.2" },
  "1.19.3": { dir: "forge_1.19.3", ver: "1.19.3" },
  "1.19.4": { dir: "forge_1.19.4", ver: "1.19.4" },
  "1.20": { dir: "forge_1.20.1", ver: "1.20.1" },
  "1.20.1": { dir: "forge_1.20.1", ver: "1.20.1" },
};

function inferLoader(to) {
  if (to.startsWith("26.")) return "neoforge";
  if (to === "1.20" || to === "1.20.1") return "fork";
  const pa = to.split(".").map((x) => Number.parseInt(x, 10) || 0);
  const pb = [1, 20, 2];
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] ?? 0) - pb[i];
    if (d !== 0) return d >= 0 ? "neoforge" : "forge";
  }
  return "neoforge";
}

function licenseFor(to) {
  if (/^1\.(12|13|14|15)/.test(to) || to === "1.14") return "MIT (williewillus)";
  if (/^1\.16/.test(to) || to === "1.17") return "CC-BY-4.0 (50ap5ud5)";
  return "CC-BY-4.0 (ChampionAsh5357)";
}

function htmlToMd(html) {
  const main =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] ??
    html.match(/<div class="theme-doc-markdown markdown"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ??
    html;
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchUrl(url) {
  const UA = { "User-Agent": "MC-AI-Coding-Assistant-Tool" };
  let lastErr;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url, { redirect: "follow", headers: UA, signal: AbortSignal.timeout(30_000) });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
        continue;
      }
      const text = await res.text();
      return { ok: res.ok, status: res.status, text };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  return { ok: false, status: 0, text: "", error: String(lastErr) };
}

const report = [];

for (const cfg of PRIMER_CONFIG) {
  const dest = join(OUT, `${cfg.version}.md`);
  if (wantWrite() && existsSync(dest) && !process.argv.includes("--force")) {
    report.push({ slug: cfg.version, skipped: "exists" });
    continue;
  }
  const ghCandidates = [
    `https://raw.githubusercontent.com/neoforged/.github/main/primers/${cfg.version}/index.md`,
    `https://raw.githubusercontent.com/neoforged/.github/main/primers/${cfg.version}.md`,
  ];
  let body = "";
  let src = "";
  let status = 0;
  for (const u of ghCandidates) {
    const r = await fetchUrl(u);
    status = r.status;
    if (r.ok && r.text.length > 200 && !r.text.includes("404: Not Found")) {
      body = r.text;
      src = u;
      break;
    }
  }
  if (!body) {
    const r = await fetchUrl(cfg.url);
    status = r.status;
    if (!r.ok) {
      report.push({ slug: cfg.version, status, skipped: "http" });
      console.log(`skip ${cfg.version} HTTP ${status}`);
      continue;
    }
    body = htmlToMd(r.text);
    src = cfg.url;
  }
  const loader = inferLoader(cfg.to);
  const fm = `---
title: "Primer ${cfg.from} -> ${cfg.to}"
primerKey: "${cfg.version}"
from: "${cfg.from}"
to: "${cfg.to}"
url: "${cfg.url}"
license: "${licenseFor(cfg.to)}"
loader: "${loader}"
platform: "${loader === "neoforge" ? "neoforge" : "forge"}"
type: primer
fetchedAt: "${new Date().toISOString()}"
source: "${src}"
---
`;
  const wrote = emit(dest, fm + "\n" + body.replace(/^---[\s\S]*?---\s*/, ""));
  report.push({ slug: cfg.version, status: 200, loader, bytes: body.length });
  console.log(`${wrote ? "wrote" : "preview"} ${cfg.version} loader=${loader} from ${src}`);

  if (loader === "forge" || loader === "fork") {
    const tree = FORGE_TREE[cfg.version] || FORGE_TREE[cfg.to];
    if (tree) {
      const rawDir = join(ROOT, "data", tree.dir, "forge-docs", tree.ver, "raw");
      if (existsSync(rawDir)) {
        const primerRaw = `---
version: "${tree.ver}"
chapter: "primer_${cfg.version}"
source: "${cfg.url}"
license: "${licenseFor(cfg.to)}"
loader: "${loader}"
from: "${cfg.from}"
to: "${cfg.to}"
sourceType: primer
---
${body.replace(/^---[\s\S]*?---\s*/, "")}
`;
        const copiedRaw = emit(join(rawDir, `primer_${cfg.version.replace(/\./g, "_")}.md`), primerRaw);
        console.log(`  ${copiedRaw ? "copied" : "preview"} → ${tree.dir}/raw`);
      }
    }
  }
  await new Promise((r) => setTimeout(r, 250));
}

emit(join(OUT, "_fetch-report.json"), JSON.stringify({ at: new Date().toISOString(), report }, null, 2));
console.log("done", report.filter((r) => r.bytes).length, "new/updated");
