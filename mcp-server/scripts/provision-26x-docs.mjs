#!/usr/bin/env node
/**
 * provision-26x-docs.mjs
 *
 * Official game is on 26.x, but docs lag:
 * - NeoForge main docs: unversioned /docs/ still labeled 26.1; /docs/26.2/ often 404
 * - NeoForge primer 26.2: available
 * - Fabric docs site/GitHub: latest versioned tree often 26.1.2 (not 26.2 yet)
 *
 * This script:
 * 1) Refresh NeoForge 26.1 main docs (+ process)
 * 2) Fetch NeoForge primer 26.2
 * 3) Provision data/neoforge_26.2 from 26.1 docs tree (provisional) + note
 * 4) Fetch Fabric 26.1.2, process, then provision fabric_26.2 alias tree
 *
 * Usage:
 *   node scripts/provision-26x-docs.mjs
 *   node scripts/provision-26x-docs.mjs --skip-fetch   # only copy/alias from existing
 */

import { spawnSync } from "child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const DATA = join(ROOT, "data");
const SCRIPTS = __dirname;
const skipFetch = process.argv.includes("--skip-fetch");

function run(cmd, args, opts = {}) {
  console.log(`\n> node ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd ?? join(ROOT, "mcp-server"),
    stdio: "inherit",
    shell: false,
    env: process.env,
  });
  if (r.status !== 0) {
    throw new Error(`Command failed (${r.status}): node ${args.join(" ")}`);
  }
}

function rewriteVersionInIndexes(dir, fromVer, toVer) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      rewriteVersionInIndexes(p, fromVer, toVer);
      continue;
    }
    if (!name.endsWith(".json") && !name.endsWith(".md")) continue;
    let text = readFileSync(p, "utf8");
    const next = text.split(fromVer).join(toVer);
    if (next !== text) writeFileSync(p, next, "utf8");
  }
}

function provisionAliasTree({
  srcRoot,
  destRoot,
  fromVer,
  toVer,
  platform,
  sourceNote,
}) {
  if (!existsSync(srcRoot)) {
    throw new Error(`Missing source tree: ${srcRoot}`);
  }
  if (existsSync(destRoot)) {
    rmSync(destRoot, { recursive: true, force: true });
  }
  mkdirSync(dirname(destRoot), { recursive: true });
  cpSync(srcRoot, destRoot, { recursive: true });
  rewriteVersionInIndexes(destRoot, fromVer, toVer);
  writeFileSync(
    join(dirname(destRoot), "meta-provision.json"),
    JSON.stringify(
      {
        platform,
        requestedVersion: toVer,
        provisionedFrom: fromVer,
        sourceNote,
        provisionedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`Provisioned ${destRoot} from ${srcRoot} (${fromVer} → ${toVer})`);
}

async function main() {
  console.log("=== provision-26x-docs ===");
  console.log(`skipFetch=${skipFetch}`);

  if (!skipFetch) {
    run(process.execPath, ["scripts/probe-neoforge-versions.js", "--force"]);
    run(process.execPath, ["scripts/fetch-neoforge-docs.js", "--version=26.1", "--force"]);
    run(process.execPath, ["scripts/process-neoforge-docs.js", "--version=26.1"]);
    run(process.execPath, ["scripts/fetch-neoforge-primers.js", "--version=26.2", "--force"]);
    // Fabric latest published versioned docs
    run(process.execPath, ["scripts/fetch-fabric-docs.js", "--version=26.1.2", "--force"]);
    run(process.execPath, ["scripts/process-fabric-docs.js", "--version=26.1.2"]);
  }

  // NeoForge 26.2 provisional main docs = copy of 26.1
  const neoSrc = join(DATA, "neoforge_26.1", "neoforge-docs", "26.1");
  const neoDst = join(DATA, "neoforge_26.2", "neoforge-docs", "26.2");
  provisionAliasTree({
    srcRoot: neoSrc,
    destRoot: neoDst,
    fromVer: "26.1",
    toVer: "26.2",
    platform: "neoforge",
    sourceNote:
      "Official /docs/26.2/ not published yet; cloned from 26.1 main docs. Prefer primer 26.2 for migration deltas.",
  });

  // Fabric 26.2 provisional = copy of 26.1.2
  const fabSrc = join(DATA, "fabric_26.1.2", "fabric-docs", "26.1.2");
  const fabDst = join(DATA, "fabric_26.2", "fabric-docs", "26.2");
  if (!existsSync(fabSrc)) {
    throw new Error(`Fabric 26.1.2 docs missing at ${fabSrc}; fetch/process failed`);
  }
  provisionAliasTree({
    srcRoot: fabSrc,
    destRoot: fabDst,
    fromVer: "26.1.2",
    toVer: "26.2",
    platform: "fabric",
    sourceNote:
      "Official fabric-docs has versions/26.1.2 but not 26.2 yet; cloned for version=26.2 queries.",
  });

  // Also expose 26.1.2 in list_* naturally via fabric_26.1.2 dir
  console.log("\nDone. Primers:", existsSync(join(DATA, "neoforge_primers", "26.2.md")));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
