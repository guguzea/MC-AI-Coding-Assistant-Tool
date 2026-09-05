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
import os from "os";
import { redactAbs } from "./_lib/redact-abs.mjs";
import { failureNote, fetchJsonWithUa, fetchWithUa, FETCH_FAILURE } from "./_lib/fetch-with-ua.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKSUMS = join(ROOT, "mcp-server", "data", "mdk-checksums.json");
const apply = process.argv.includes("--apply");
const downloadOnly = process.argv.includes("--download-only");
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

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
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN || process.env.MC_SKILL_GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN || process.env.MC_SKILL_GITHUB_TOKEN}`;
  }
  const res = await fetchWithUa(url, { headers, timeoutMs: 30_000, as: "json" });
  if (res.ok && !res.json) {
    return { ok: false, status: res.status, failureClass: FETCH_FAILURE.UNKNOWN, reason: "响应不是合法 JSON", url };
  }
  return { ok: res.ok, status: res.status, json: res.ok ? res.json : null, failureClass: res.failureClass, tls: res.tls, headers: res.headers, reason: res.reason, url };
}

/**
 * 探测失败 → 机器可读分类。
 * 只有真 404 才允许写 MDK_NOT_PINNED；403/429（含 x-ratelimit-remaining: 0）= RATE_LIMITED，
 * 证书/吊销问题 = TLS_*，超时 = TIMEOUT —— 这些都必须与「MDK 不存在」区分开。
 */
function probeFailure(res, label) {
  const cls = res?.failureClass || FETCH_FAILURE.UNKNOWN;
  const note = failureNote(res) || res?.reason || "";
  const row = {
    ok: false,
    skipped: true,
    status: res?.status || 0,
    failureClass: cls,
    url: res?.url,
    message: `${cls}：${label} ${note}`.trim(),
  };
  if (cls === FETCH_FAILURE.RATE_LIMITED) {
    row.message = `RATE_LIMITED：${label} 被 GitHub/Maven 限流（${note}），稍后重跑；禁止记成 MDK 不存在/未 pin`;
    row.retryAfter = res?.headers?.["retry-after"];
  }
  if (cls === FETCH_FAILURE.NOT_FOUND) {
    row.message = `NOT_FOUND：${label} HTTP 404，MDK_NOT_PINNED`;
  }
  return row;
}

async function probeNeoRepo(ver, pluginLabel) {
  const repo = `NeoForgeMDKs/MDK-${ver}-${pluginLabel}`;
  const info = await ghJson(`https://api.github.com/repos/${repo}`);
  if (info.status === 404) {
    return { ...probeFailure({ ...info, failureClass: FETCH_FAILURE.NOT_FOUND }, repo), repo };
  }
  if (!info.ok && !info.json) {
    return { ...probeFailure(info, repo), repo };
  }
  const commits = await ghJson(`https://api.github.com/repos/${repo}/commits?per_page=1`);
  if (!commits.ok) {
    return { ...probeFailure(commits, `${repo} commits`), repo };
  }
  const sha = commits.json?.[0]?.sha;
  if (!sha) {
    return { ...probeFailure({ ...commits, failureClass: FETCH_FAILURE.UNKNOWN, reason: "无 default-branch commit" }, repo), repo };
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
    return {
      ok: false,
      skipped: true,
      failureClass: FETCH_FAILURE.NOT_FOUND,
      message: `NOT_FOUND：promotions 无 ${mcVer}，MDK_NOT_PINNED`,
    };
  }
  const ver = `${mcVer}-${rec}`;
  const url = `https://maven.minecraftforge.net/net/minecraftforge/forge/${ver}/forge-${ver}-mdk.zip`;
  const head = await fetchWithUa(url, { method: "HEAD", timeoutMs: 30_000, as: "none" });
  if (head.status === 404) {
    const get = await fetchWithUa(url, { timeoutMs: 30_000, as: "none" });
    if (get.status === 404) {
      return { ...probeFailure({ ...get, failureClass: FETCH_FAILURE.NOT_FOUND, url }, url), url };
    }
  } else if (!head.ok && head.status !== 405) {
    return { ...probeFailure(head, url), url };
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
  let raw;
  try {
    raw = JSON.parse(readFileSync(CHECKSUMS, "utf8"));
  } catch (e) {
    console.error(`无法解析 ${CHECKSUMS}: ${e.message}`);
    process.exit(1);
  }
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
  const promo = await fetchJsonWithUa("https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json", {
    timeoutMs: 30_000,
  });
  if (promo.ok) promotions = promo.json;
  else skipped.push(probeFailure(promo, "promotions_slim.json"));

  let officialProbeDone = false;
  // promotions 拉不到时（TLS / 限流 / 超时）逐版报 MDK_NOT_PINNED 是假阴性，整轮跳过
  const promotionsBlocked = !promo.ok && promo.failureClass !== FETCH_FAILURE.NOT_FOUND;
  for (const ver of promotionsBlocked ? [] : FORGE_AGENTS) {
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

  if (apply) {
    writeFileSync(CHECKSUMS, JSON.stringify(raw, null, 2) + "\n", "utf8");
  }
  }

  const existing = raw.entries.filter((e) => e.gitPolicy !== "forbidden_redistribute");
  const toDownload = existing.filter((e) => {
    if (only && e.id !== only) return false;
    if (downloadOnly && e.sha256) return false;
    return true;
  });

  console.log(JSON.stringify({ dryRun: !apply && !downloadOnly, plannedNew: planned.map((e) => e.id), skipped, toDownload: toDownload.map((e) => ({ id: e.id, url: e.archiveUrl, source: e.source })) }, null, 2));

  if (!apply && !downloadOnly) {
    console.log("dryRun：未写盘。确认后加 --apply 或 --download-only 下载解压。");
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
  const cache = process.env.MC_SKILL_CACHE || join(os.tmpdir(), "mc-skill-cache");
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
