#!/usr/bin/env node
/**
 * provision-26x-docs.mjs
 *
 * Fetch real official docs only — do NOT clone/alias one version as another
 * (that misleads Agents into thinking 26.2 main docs exist).
 *
 * Current official reality (as of 2026-10-31 复测):
 * - NeoForge main docs: unversioned /docs/ labeled 26.1 — the site is NOT version-split,
 *   i.e. /docs/26.2/ 404s exactly like /docs/26.1/ — 26.2 builds DO exist on maven
 * - NeoForge primer 26.2: available → neoforge_primers/26.2.md
 * - Fabric: **最新版正文在仓库根 `develop/`（URL 无版本前缀，站点 `/develop/...`）**；
 *   版本目录 `versions/<v>/` 只收「已不再是 latest」的快照 —— 26.1.2 在列，26.2 至今 404，
 *   而 `/develop/items/first-item` 的页面标题已是「… 26.2」。
 *   ⇒ 26.2 正文由 `provision-fabric-latest.mjs` 按 **commit pin** 从 `develop/` 抓进
 *   `data/fabric_26.2`（105 页 + reference/latest），**不是克隆树，禁止删除**。
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
import { resolveDataRoot } from "./_lib/data-root.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
/**
 * 数据根（NP-6，2026-09-17）：`--data-root=<dir>` > `MC_SKILL_DATA` > 仓库 `data/`，
 * 与 6 个抓取/处理子脚本用**同一个解析器**（scripts/_lib/data-root.js）。
 * 此前只有删除段享受 --data-root，抓取段不透传 ⇒ `--write` 下抓取仍写默认 data/（半截沙盒）。
 */
const DATA = resolveDataRoot();
const skipFetch = process.argv.includes("--skip-fetch");

function run(cmd, args) {
  // NP-6：抓取段与删除段共用同一数据根；两条通道（argv + env）都给，子脚本任一命中即可。
  const full = [...args, `--data-root=${DATA}`];
  console.log(`\n> node ${full.join(" ")}`);
  const r = spawnSync(cmd, full, {
    cwd: join(ROOT, "mcp-server"),
    stdio: "inherit",
    shell: false,
    env: { ...process.env, MC_SKILL_DATA: DATA },
  });
  if (r.status !== 0) {
    throw new Error(`Command failed (${r.status}): node ${full.join(" ")}`);
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
    console.log("[provision-26x-docs] dry-run：删除段只打印清单（--write 才真删）；抓取段也须 --write 才真跑。");
  }

  if (!skipFetch) {
    if (!wantWrite()) {
      console.log("[provision-26x-docs] dry-run：抓取段将 spawn 以下命令（加 --write 才真跑）：");
      console.log("  node scripts/probe-neoforge-versions.js --force");
      console.log("  node scripts/fetch-neoforge-docs.js --version=26.1 --force");
      console.log("  node scripts/process-neoforge-docs.js --version=26.1");
      console.log("  node scripts/fetch-neoforge-primers.js --version=26.2 --force");
      console.log("  node scripts/fetch-fabric-docs.js --version=26.1.2 --force");
      console.log("  node scripts/process-fabric-docs.js --version=26.1.2");
      // latest 面必须人工 pin sha（禁止自动跟 main HEAD，否则 latest 漂到下一代会静默改写 26.2）
      console.log("  # Fabric latest 面（人工确认新 sha 后再跑）：");
      console.log("  #   git ls-remote https://github.com/FabricMC/fabric-docs refs/heads/main");
      console.log("  #   node scripts/provision-fabric-latest.mjs --version=26.2 --sha=<sha> --from-clone=<dir> --write");
      console.log("  #   node scripts/process-fabric-docs.js --version=26.2 && node scripts/_lib/build-semantic-index.mjs --platform=fabric --version=26.2");
    } else {
      run(process.execPath, ["scripts/probe-neoforge-versions.js", "--force"]);
      run(process.execPath, ["scripts/fetch-neoforge-docs.js", "--version=26.1", "--force"]);
      run(process.execPath, ["scripts/process-neoforge-docs.js", "--version=26.1"]);
      run(process.execPath, ["scripts/fetch-neoforge-primers.js", "--version=26.2", "--force"]);
      run(process.execPath, ["scripts/fetch-fabric-docs.js", "--version=26.1.2", "--force"]);
      run(process.execPath, ["scripts/process-fabric-docs.js", "--version=26.1.2"]);
      if (process.env.MC_SKILL_FABRIC_LATEST_SHA) {
        // 只有显式给出 pin sha 才刷新 latest 面；没给 = 保持现状，不静默跟 HEAD
        run(process.execPath, [
          "scripts/provision-fabric-latest.mjs",
          "--version=26.2",
          `--sha=${process.env.MC_SKILL_FABRIC_LATEST_SHA}`,
          ...(process.env.MC_SKILL_FABRIC_LATEST_CLONE ? [`--from-clone=${process.env.MC_SKILL_FABRIC_LATEST_CLONE}`] : []),
          "--write",
        ]);
        run(process.execPath, ["scripts/process-fabric-docs.js", "--version=26.2"]);
      } else {
        console.log("[provision-26x-docs] 未设 MC_SKILL_FABRIC_LATEST_SHA ⇒ 跳过 latest 面刷新（不跟 main HEAD）");
      }
    }
  }

  removeMisleadingClone(
    "neoforge_26.2",
    "official main docs are not version-split (/docs/26.2/ 404s like /docs/26.1/); 26.2 builds exist on maven but this repo has no 26.2 corpus — do not present 26.1 as 26.2",
  );
  // 2026-10-31：fabric_26.2 **不再是克隆树** —— 它是 `provision-fabric-latest.mjs` 按 commit pin
  // 从上游 `develop/`（latest 面）抓来的真语料（105 页 + reference/latest），有
  // upstream-tree.json（source=github_trees）与 reference.provenance.json（commitSha）自证。
  // 因此本段禁止再删它；误删会让 search_fabric_docs(26.2) 退回 porting 旁的 26.1.2 正文。

  console.log("\nDone.");
  console.log("Use NeoForge docs version=26.1 + primer 26.2; Fabric version=26.2（latest 面，pin sha）/ 26.1.2（版本快照）。");
  console.log("Requesting an un-ingested Fabric version still falls back via store VERSION_FALLBACK; 26.2 不再走 fallback。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
