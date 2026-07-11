#!/usr/bin/env node
/**
 * check-porting-updates.js
 * Check whether any Loader (NeoForge / Fabric / MC) has released a newer version
 * than what the knowledge-base captures.
 *
 * Reads data/porting/knowledge-base/versions.json. Compares each entry against a
 * hard-coded LATEST_VERSIONS table (manually curated since NeoForge/Forge do
 * not publish a stable machine-readable feed).
 *
 * Usage:
 *   node scripts/check-porting-updates.js [--version=<mcVer>] [--dry-run]
 *
 *   --version=<mcVer> only inspects that MC version's row (e.g. 1.20.1).
 *                     Without --version, all entries are inspected.
 *   --dry-run         identical to default behaviour; reserved for symmetry with
 *                     other scripts.
 *
 * Exit code: always 0; this script is informational. Validation belongs in
 * validate-forge-build.js.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parseCliArgs, compareVersions, isUpdateAvailable } from "./_lib/args.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "porting", "knowledge-base");

// Curated "newest known" map. Manual updates belong in git history, not data/.
const LATEST_VERSIONS = {
  neoforge: {
    "1.20.1": "20.2.88",
    "1.20.4": "20.4.237",
    "1.21.1": "21.1.113",
    "26.1":   "26.1.0",
  },
  fabric: {
    "1.20.1": "0.15.7",
    "1.21.1": "0.16.0",
    "26.1":   "26.1.2",
  },
  minecraft: {
    "1.20.1": "1.20.4",
    "1.21.1": "1.21.11",
    "26.1":   "26.1.2",
  },
};

const REFERENCE_URLS = {
  neoforge:    "https://neoforged.net/news/",
  fabric:      "https://fabricmc.net/",
  architectury:"https://docs.architectury.dev/changelog",
};

// ── Pure helpers (exported for tests) ──────────────────────────────────────

/**
 * Choose the LATEST_VERSIONS key for a given MC row. Returns null when the row
 * is something we have no curated mapping for (e.g. unusual snapshot).
 */
export function resolveLatestKey(loader, mcVersion) {
  if (loader === "neoforge") {
    // 1.20.1+ maps to the 20.2 line, 1.20.4+ maps to the 20.4 line.
    // Most-specific match first so 1.20.4+ falls through to 20.4.
    if (mcVersion.startsWith("1.20.4")) return "1.20.4";
    if (mcVersion.startsWith("1.20"))   return "1.20.1";
    if (mcVersion.startsWith("1.21"))   return "1.21.1";
    if (mcVersion === "26.1")            return "26.1";
    return null;
  }
  if (loader === "fabric") {
    if (mcVersion.startsWith("1.20"))   return "1.20.1";
    if (mcVersion.startsWith("1.21"))   return "1.21.1";
    if (mcVersion === "26.1")            return "26.1";
    return null;
  }
  if (loader === "minecraft") {
    if (mcVersion.startsWith("1.20")) return "1.20.1";
    if (mcVersion.startsWith("1.21")) return "1.21.1";
    if (mcVersion === "26.1")         return "26.1";
    return null;
  }
  return null;
}

/**
 * Inspect a single loader row of the versions KB and return [] (no update) or
 * [{ loader, mcVer, current, latest }] for any out-of-date match.
 */
export function findUpdatesForLoader(loader, mcVer, info, latestTable) {
  const out = [];
  if (!info || typeof info !== "object") return out;
  const current = info[loader];
  if (!current) return out;
  const key = resolveLatestKey(loader, mcVer);
  if (!key) return out;
  const latest = latestTable[loader]?.[key];
  if (!latest) return out;
  if (isUpdateAvailable(current, latest)) {
    out.push({ loader, mcVer, current, latest, key });
  }
  return out;
}

/**
 * Run the full check against a KB-shaped object. Returns a flat list of update
 * records and a list of "already current" MC versions for reporting.
 */
export function runCheck(kb, latestTable = LATEST_VERSIONS) {
  const versions = (kb && typeof kb === "object" && kb.versions) || {};
  const updates = [];
  const scanned = [];
  for (const [mcVer, info] of Object.entries(versions)) {
    scanned.push(mcVer);
    for (const loader of ["neoforge", "fabric", "minecraft"]) {
      updates.push(...findUpdatesForLoader(loader, mcVer, info, latestTable));
    }
  }
  updates.sort((a, b) => a.loader.localeCompare(b.loader) || a.mcVer.localeCompare(b.mcVer));
  return { updates, scanned };
}

// ── CLI side ────────────────────────────────────────────────────────────────

function loadVersionsKB() {
  try {
    return JSON.parse(readFileSync(join(DATA_DIR, "versions.json"), "utf-8"));
  } catch {
    return { versions: {} };
  }
}

function printReport({ updates, scanned }, filterMc) {
  const filtered = filterMc ? updates.filter((u) => u.mcVer === filterMc) : updates;

  console.log("=== Porting Knowledge Base Update Check ===\n");
  if (filterMc) console.log(`(filtered to mc=${filterMc})\n`);

  if (filtered.length === 0) {
    console.log("当前知识库版本均为最新。无需更新。");
  } else {
    for (const u of filtered) {
      console.log(`[${u.loader}] ${u.mcVer}: 当前 ${u.current} → 有更新 ${u.latest}`);
    }
  }

  if (!filterMc) {
    console.log(`\n(扫描了 ${scanned.length} 个 MC 版本条目；过滤使用 --version=<mc>)`);
  }
  console.log("\n如需更新知识库，请运行：");
  console.log("  node scripts/update-porting-updates.js --version=<MC版本>");
  console.log("\n参考文档：");
  console.log(`  NeoForge:    ${REFERENCE_URLS.neoforge}`);
  console.log(`  Fabric:      ${REFERENCE_URLS.fabric}`);
  console.log(`  Architectury:${REFERENCE_URLS.architectury}`);
}

function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.flags.versionError) {
    console.error(`error: --version requires a non-empty value (${args.flags.versionError})`);
    process.exit(2);
  }
  const kb = loadVersionsKB();
  const result = runCheck(kb);
  printReport(result, args.flags.version || null);
}

// Only auto-run when invoked directly (lets tests import this module safely).
const invokedDirectly =
  process.argv[1] &&
  import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`;
if (invokedDirectly) {
  main();
}
