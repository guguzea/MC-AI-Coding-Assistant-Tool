#!/usr/bin/env node
/**
 * provision-26x-docs.mjs
 *
 * Fetch real official docs only — do NOT clone/alias one version as another
 * (that misleads Agents into thinking 26.2 main docs exist).
 *
 * Current official reality (as of crawl):
 * - NeoForge main docs: unversioned /docs/ labeled 26.1 — the site is NOT version-split,
 *   i.e. /docs/26.2/ 404s exactly like /docs/26.1/ — 26.2 builds DO exist on maven
 * - NeoForge primer 26.2: available → neoforge_primers/26.2.md
 * - Fabric: versions/26.1.2 on GitHub; no versions/26.2 yet
 *
 * This script:
 * 1) Refresh NeoForge 26.1 main docs (+ process)
 * 2) Fetch NeoForge primer 26.2
 * 3) Fetch + process Fabric 26.1.2
 * 4) Remove any leftover misleading neoforge_26.2 / fabric_26.2 clone trees
 *
 * Usage:
 *   node scripts/provision-26x-docs.mjs                  # 抓取段照跑；删除段走干跑（打印清单）
 *   node scripts/provision-26x-docs.mjs --write          # 才真正执行删除（write-guard 语义）
 *   node scripts/provision-26x-docs.mjs --skip-fetch     # 只做删除段（同样受 --write 管）
 *   node scripts/provision-26x-docs.mjs --data-root=<dir> [--write]   # 沙盒/自定义数据根（默认仓库 data/）
 */

import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { wantWrite, emitRemove } from "../../scripts/_lib/write-guard.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
/** --data-root=<dir>：沙盒/自定义数据根（默认仍是仓库 data/；仅影响本脚本的读写定位） */
const dataRootArg = process.argv.find((a) => a.startsWith("--data-root="))?.slice("--data-root=".length);
const DATA = dataRootArg ? resolve(dataRootArg) : join(ROOT, "data");
const skipFetch = process.argv.includes("--skip-fetch");

function run(cmd, args) {
  console.log(`\n> node ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    cwd: join(ROOT, "mcp-server"),
    stdio: "inherit",
    shell: false,
    env: process.env,
  });
  if (r.status !== 0) {
    throw new Error(`Command failed (${r.status}): node ${args.join(" ")}`);
  }
}

function removeMisleadingClone(relPath, reason) {
  const p = join(DATA, relPath);
  if (!existsSync(p)) {
    console.log(`skip remove (missing): ${relPath}`);
    return;
  }
  // 2026-09-17 write-guard 收口（审计 H1）：默认干跑打印「将删除」清单，--write 才真删。
  if (!wantWrite()) console.log(`[dry-run] 将删除 ${relPath}（${reason}）`);
  emitRemove(p);
}

async function main() {
  console.log("=== provision-26x-docs (no version alias/clone) ===");
  console.log(`skipFetch=${skipFetch}`);
  if (!wantWrite()) {
    console.log("[provision-26x-docs] dry-run：删除段只打印清单（--write 才真删）；抓取段按各子脚本自身开关。");
  }

  if (!skipFetch) {
    run(process.execPath, ["scripts/probe-neoforge-versions.js", "--force"]);
    run(process.execPath, ["scripts/fetch-neoforge-docs.js", "--version=26.1", "--force"]);
    run(process.execPath, ["scripts/process-neoforge-docs.js", "--version=26.1"]);
    run(process.execPath, ["scripts/fetch-neoforge-primers.js", "--version=26.2", "--force"]);
    run(process.execPath, ["scripts/fetch-fabric-docs.js", "--version=26.1.2", "--force"]);
    run(process.execPath, ["scripts/process-fabric-docs.js", "--version=26.1.2"]);
  }

  removeMisleadingClone(
    "neoforge_26.2",
    "official main docs are not version-split (/docs/26.2/ 404s like /docs/26.1/); 26.2 builds exist on maven but this repo has no 26.2 corpus — do not present 26.1 as 26.2",
  );
  removeMisleadingClone(
    "fabric_26.2",
    "official versions/26.2 not published — use fabric_26.1.2",
  );

  console.log("\nDone.");
  console.log("Use NeoForge docs version=26.1 + primer 26.2; Fabric version=26.1.2.");
  console.log("Requesting version=26.2 should fall back via store VERSION_FALLBACK, not a clone tree.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
