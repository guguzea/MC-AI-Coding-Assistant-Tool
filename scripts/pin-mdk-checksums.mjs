#!/usr/bin/env node
/**
 * Probe 并 pin MDK checksums。默认 dryRun 只列将 GET 的 URL。
 * --apply 才下载、解压（走 mcp-server dist downloadOfficialMdk）、成功后写回 sha256。
 *
 * 用法：
 *   node scripts/pin-mdk-checksums.mjs
 *   node scripts/pin-mdk-checksums.mjs --apply
 *   node scripts/pin-mdk-checksums.mjs --apply --only=neoforge-1.21.1-moddevgradle
 *
 * 不要把 MDK 源码 commit 进本仓。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { redactAbs } from "./_lib/redact-abs.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKSUMS = join(ROOT, "mcp-server", "data", "mdk-checksums.json");
const apply = process.argv.includes("--apply");
const downloadOnly = process.argv.includes("--download-only");
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const UA = { "User-Agent": "MC-AI-Coding-Assistant-Tool" };

const NEO_NEED = ["1.21.1", "1.21.3", "1.21.8", "1.21.11"];
const FORGE_AGENTS = [
  "1.20.4",
  "1.20.1",
  "1.19.4",
  "1.18.2",
  "1.17.1",
  "1.16.5",
  "1.15.2",
  "1.14.4",
  "1.13.2",
  "1.12.2",
  "1.7.10",
];

async function ghJson(url) {
  const headers = { ...UA, Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN || process.env.MC_SKILL_GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN || process.env.MC_SKILL_GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers, redirect: "follow" });
  return { status: res.status, json: res.ok ? await res.json() : null, url };
}

async function probeNeoRepo(ver, pluginLabel) {
  const repo = `NeoForgeMDKs/MDK-${ver}-${pluginLabel}`;
  const info = await ghJson(`https://api.github.com/repos/${repo}`);
  if (info.status === 404) {
    return { ok: false, skipped: true, repo, status: 404, message: `MDK_NOT_PINNED：仓不存在 ${repo}` };
  }
  if (!info.ok && !info.json) {
    return { ok: false, repo, status: info.status, message: `GitHub API ${info.status} ${info.url}` };
  }
  const commits = await ghJson(`https://api.github.com/repos/${repo}/commits?per_page=1`);
  const sha = commits.json?.[0]?.sha;
  if (!sha) {
    return { ok: false, repo, status: commits.status, message: `无 default-branch commit：${repo}` };
  }
  const buildPlugin = pluginLabel === "ModDevGradle" ? "moddevgradle" : "neogradle";
  return {
    ok: true,
    entry: {
      id: `neoforge-${ver}-${buildPlugin}`,
      platform: "neoforge",
      minecraftVersion: ver,
      buildPlugin,
      source: "github",
      repo: `https://github.com/${repo}`,
      ref: sha,
      archiveUrl: `https://github.com/${repo}/archive/${sha}.zip`,
      sha256: null,
      license: "MIT (TEMPLATE_LICENSE.txt)",
      gitPolicy: "submodule_ok",
      mappings: "mojmap",
    },
  };
}

async function probeForgeOfficial(mcVer, promotions) {
  const rec = promotions?.promos?.[`${mcVer}-recommended`] ?? promotions?.promos?.[`${mcVer}-latest`];
  if (!rec) {
    return { ok: false, skipped: true, message: `promotions 无 ${mcVer}，MDK_NOT_PINNED` };
  }
  const ver = `${mcVer}-${rec}`;
  const url = `https://maven.minecraftforge.net/net/minecraftforge/forge/${ver}/forge-${ver}-mdk.zip`;
  const head = await fetch(url, { method: "HEAD", headers: UA, redirect: "follow" });
  if (head.status === 404) {
    const get = await fetch(url, { method: "GET", headers: UA, redirect: "follow" });
    if (get.status === 404) {
      return { ok: false, skipped: true, url, status: 404, message: `官方 MDK 404 ${url}，MDK_NOT_PINNED` };
    }
  } else if (!head.ok && head.status !== 405) {
    return { ok: false, skipped: true, url, status: head.status, message: `官方 MDK HTTP ${head.status} ${url}` };
  }
  return {
    ok: true,
    entry: {
      id: `forge-${mcVer}-forgegradle`,
      platform: "forge",
      minecraftVersion: mcVer,
      buildPlugin: "forgegradle",
      source: "official",
      repo: "https://files.minecraftforge.net/",
      ref: "",
      archiveUrl: url,
      sha256: null,
      license: "LGPL (Forge MDK template)",
      gitPolicy: "submodule_ok",
      mappings: "mcp",
      notes: `recommended/latest ${rec} from promotions_slim.json`,
    },
  };
}

function upsertEntry(raw, entry) {
  const i = raw.entries.findIndex((e) => e.id === entry.id);
  if (i >= 0) {
    const prev = raw.entries[i];
    raw.entries[i] = { ...prev, ...entry, sha256: prev.sha256 ?? entry.sha256 };
  } else {
    raw.entries.push(entry);
  }
}

async function main() {
  const dist = join(ROOT, "mcp-server", "dist", "mdk", "index.js");
  if (apply && !existsSync(dist)) {
    console.error("need mcp-server dist: cd mcp-server && npm run build");
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(CHECKSUMS, "utf8"));
  const planned = [];
  const skipped = [];

  if (!downloadOnly) {

  for (const ver of NEO_NEED) {
    for (const label of ["ModDevGradle", "NeoGradle"]) {
      const r = await probeNeoRepo(ver, label);
      if (r.skipped || !r.ok) skipped.push(r);
      else {
        planned.push(r.entry);
        upsertEntry(raw, r.entry);
      }
    }
  }

  let promotions = null;
  try {
    const res = await fetch("https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json", {
      headers: UA,
      redirect: "follow",
    });
    if (res.ok) promotions = await res.json();
    else skipped.push({ skipped: true, status: res.status, message: `promotions_slim.json HTTP ${res.status}` });
  } catch (e) {
    skipped.push({ skipped: true, message: `promotions_slim.json ${String(e)}` });
  }

  let officialProbeDone = false;
  for (const ver of FORGE_AGENTS) {
    const r = await probeForgeOfficial(ver, promotions);
    if (r.skipped || !r.ok) skipped.push({ minecraftVersion: ver, ...r });
    else {
      planned.push(r.entry);
      upsertEntry(raw, r.entry);
      if (!officialProbeDone) {
        officialProbeDone = true;
        r.entry.notes = `${r.entry.notes || ""}; pin 脚本将优先试解析此 official MDK`.trim();
      }
    }
  }

  writeFileSync(CHECKSUMS, JSON.stringify(raw, null, 2) + "\n", "utf8");
  }

  const existing = raw.entries.filter((e) => e.gitPolicy !== "forbidden_redistribute");
  const toDownload = existing.filter((e) => {
    if (only && e.id !== only) return false;
    if (downloadOnly && e.sha256) return false;
    return true;
  });

  console.log(JSON.stringify({ dryRun: !apply && !downloadOnly, plannedNew: planned.map((e) => e.id), skipped, toDownload: toDownload.map((e) => ({ id: e.id, url: e.archiveUrl, source: e.source })) }, null, 2));

  if (!apply && !downloadOnly) {
    console.log("dryRun：已把 probe 到的新条目写入 mdk-checksums.json（sha256 仍为 null）。确认后加 --apply 或 --download-only 下载解压。");
    return;
  }

  if (!existsSync(dist)) {
    console.error("need mcp-server dist: cd mcp-server && npm run build");
    process.exit(1);
  }

  const { downloadOfficialMdk } = await import(pathToFileURL(dist).href);
  const results = [];
  for (const e of toDownload) {
    const args = {
      platform: e.platform,
      minecraftVersion: e.minecraftVersion,
      dryRun: false,
    };
    if (e.buildPlugin && e.buildPlugin !== "unknown") args.buildPlugin = e.buildPlugin;
    const out = await downloadOfficialMdk(args);
    results.push({
      id: e.id,
      ok: out.ok,
      entryClass: out.entryClass,
      sha256: out.sha256,
      error: out.error,
      cacheHit: out.cacheHit,
      unpackedRoot: out.unpackedRoot,
    });
    console.log(`${out.ok ? "OK" : "FAIL"} ${e.id} entryClass=${out.entryClass || "-"} ${out.error?.code || ""}`);
  }
  const cache = process.env.MC_SKILL_CACHE || "D:\\mc-skill-temp";
  const lastDir = join(cache, "loader-api-summaries");
  mkdirSync(lastDir, { recursive: true });
  writeFileSync(
    join(lastDir, "pin-mdk-last.json"),
    JSON.stringify(redactAbs({ results, skipped }, { cache, repo: ROOT }), null, 2),
    "utf8",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
