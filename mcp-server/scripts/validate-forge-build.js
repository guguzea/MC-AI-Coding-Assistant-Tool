#!/usr/bin/env node
/**
 * validate-forge-build.js
 * Validate the integrity of the Forge multi-version documentation build.
 *
 * Checks:
 *   1. Manifest: forge-versions-manifest.json exists, parses, includes each
 *      expected MC version and points at the right doc source.
 *   2. MkDocs: each EXPECTED.mkdocs version has raw/ + processed/ + at least
 *      one of the index-l*.json files, and raw/ count is roughly proportional
 *      to manifest.chapters.
 *   3. Javadoc: each EXPECTED.javadoc version has at least one .md file under
 *      its raw/ tree (recursive) and matches manifest.packageCount ~half.
 *   4. Mappings: the canonical 1.12.2 MCP and 1.20.1 parchment mappings dirs
 *      exist and contain at least one CSV.
 *   5. MCP server TypeScript: `npx tsc --noEmit` reports zero errors.
 *
 * Usage:
 *   node scripts/validate-forge-build.js [--no-tsc] [--version=<mc>]
 *
 *   --no-tsc       skip the npx tsc invocation (faster local runs).
 *   --version=<mc> focus the per-version checks on one MC version.
 *                   Also accepts the bare "--version <mc>" form.
 *
 * Exit code:
 *   0 all checks pass
 *   1 one or more checks failed (see diagnostic lines printed above)
 *   2 invalid CLI input
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parseCliArgs } from "./_lib/args.js";
import { DiagnosticBag, reportSection, exitCodeFor } from "./_lib/diag.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");

const EXPECTED = {
  javadoc: ["1.7.10", "1.8.9", "1.9.4", "1.10.2", "1.11.2", "1.12.2"],
  mkdocs:  ["1.14.4", "1.15.2", "1.16.5", "1.17.1", "1.18.2", "1.19.4", "1.20.1", "1.20.4"],
};

// ── Pure helpers (exported for tests) ───────────────────────────────────────

export function countFiles(path, predicate = (f) => f.endsWith(".md")) {
  if (!existsSync(path)) return 0;
  try {
    return readdirSync(path).filter(predicate).length;
  } catch {
    return 0;
  }
}

export function countFilesRecursive(path) {
  if (!existsSync(path)) return 0;
  let n = 0;
  try {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isDirectory()) n += countFilesRecursive(join(path, entry.name));
      else if (entry.name.endsWith(".md")) n++;
    }
  } catch {
    return 0;
  }
  return n;
}

export function loadJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Decide whether one MC version's raw dir has "enough" content given the
 * chapter count from the manifest. Exports a structured decision so the caller
 * can render an emoji.
 */
export function rawStatusFor(rawCount, chapterCount) {
  if (rawCount === 0) return { ok: false, level: "fail", emoji: "❌" };
  if (rawCount < chapterCount * 0.8) return { ok: true, level: "warn", emoji: "⚠️ " };
  return { ok: true, level: "ok", emoji: "✅" };
}

// ── Checks (exported for tests) ──────────────────────────────────────────────

export function checkManifest({ dataDir = DATA_DIR } = {}) {
  const bag = new DiagnosticBag();
  const manifestPath = join(dataDir, "forge-versions-manifest.json");

  if (!existsSync(manifestPath)) {
    bag.error("MISSING: forge-versions-manifest.json");
    return { ok: false, bag, manifest: null };
  }
  const manifest = loadJson(manifestPath);
  if (!manifest) {
    bag.error("INVALID: cannot parse forge-versions-manifest.json as JSON");
    return { ok: false, bag, manifest: null };
  }
  bag.info(`exists: ${manifestPath}`);

  const versions = manifest.versions || {};
  const javadocVersions = Object.entries(versions).filter(([, v]) => v?.javadoc?.available);
  const mkdocsVersions  = Object.entries(versions).filter(([, v]) => v?.mkdocs?.available);

  bag.info(`versions: ${Object.keys(versions).length} (javadoc=${javadocVersions.length}, mkdocs=${mkdocsVersions.length})`);

  // Verify each EXPECTED entry has a manifest row that points at *something*.
  for (const v of EXPECTED.mkdocs) {
    const row = versions[v];
    const hasMkDocs = row?.mkdocs?.available;
    const hasJavadoc = row?.javadoc?.available;
    if (!row) {
      bag.warn(`manifest missing entry for mkdocs ${v}`);
      continue;
    }
    if (!hasMkDocs && !hasJavadoc) {
      bag.warn(`mkdocs ${v}: neither mkdocs nor javadoc marked available`);
    }
  }
  for (const v of EXPECTED.javadoc) {
    if (!versions[v]?.javadoc?.available) {
      bag.warn(`javadoc ${v}: not marked available in manifest`);
    }
  }
  return { ok: bag.hasErrors() === false, bag, manifest };
}

export function checkMkDocsVersions(manifest, { dataDir = DATA_DIR, filterMc = null } = {}) {
  const bag = new DiagnosticBag();
  if (!manifest) {
    bag.warn("skipped (no manifest)");
    return { ok: true, bag, pass: 0, fail: 0 };
  }
  let pass = 0;
  let fail = 0;
  const versions = filterMc ? [filterMc] : EXPECTED.mkdocs;
  for (const ver of versions) {
    const verInfo = manifest.versions?.[ver];
    if (!verInfo?.mkdocs?.available) {
      bag.warn(`${ver}: SKIP (no manifest entry / unavailable)`);
      continue;
    }
    const base      = join(dataDir, `forge_${ver}`, "forge-docs", ver);
    const raw       = join(base, "raw");
    const processed = join(base, "processed");
    const idx0      = join(base, "index-l0.json");

    const rawCount       = countFiles(raw);
    const processedCount = countFiles(processed);
    const l0             = loadJson(idx0);
    const chapterCount   = verInfo.mkdocs.chapters?.length ?? 0;
    const status         = rawStatusFor(rawCount, chapterCount);

    bag.info(
      `${ver}: raw=${rawCount} processed=${processedCount} index=${l0 ? "ok" : "missing"} chapters=${chapterCount}`
    );
    if (!status.ok) {
      bag.error(`${ver}: no raw content under ${raw}`);
      fail++;
    } else if (status.level === "warn") {
      bag.warn(`${ver}: raw count ${rawCount} < 80% of chapters (${chapterCount})`);
      pass++;
    } else {
      pass++;
    }
    if (processedCount === 0) bag.warn(`${ver}: processed/ is empty`);
    if (!l0) bag.warn(`${ver}: index-l0.json missing`);
  }
  bag.info(`mkdocs pass=${pass} fail=${fail}`);
  return { ok: fail === 0, bag, pass, fail };
}

export function checkJavadocVersions(manifest, { dataDir = DATA_DIR, filterMc = null } = {}) {
  const bag = new DiagnosticBag();
  if (!manifest) {
    bag.warn("skipped (no manifest)");
    return { ok: true, bag, pass: 0, fail: 0 };
  }
  let pass = 0;
  let fail = 0;
  const versions = filterMc ? [filterMc] : EXPECTED.javadoc;
  for (const ver of versions) {
    const verInfo = manifest.versions?.[ver];
    if (!verInfo?.javadoc?.available) {
      bag.warn(`${ver}: SKIP (no manifest entry / unavailable)`);
      continue;
    }
    const raw = join(dataDir, "forge_javadoc", ver, "raw");
    const files = countFilesRecursive(raw);
    const pkgCount = verInfo.javadoc.packageCount || 0;
    bag.info(`${ver}: raw .md files=${files} packages=${pkgCount}`);
    if (files === 0) {
      bag.error(`${ver}: no .md files under ${raw}`);
      fail++;
    } else if (files < pkgCount * 0.5) {
      bag.warn(`${ver}: file count ${files} < 50% of packages (${pkgCount})`);
      pass++;
    } else {
      pass++;
    }
  }
  bag.info(`javadoc pass=${pass} fail=${fail}`);
  return { ok: fail === 0, bag, pass, fail };
}

export function checkMappings({ dataDir = DATA_DIR } = {}) {
  const bag = new DiagnosticBag();
  const targets = [
    { dir: join(dataDir, "forge_1.20.1", "mappings"), label: "1.20.1 parchment" },
    { dir: join(dataDir, "forge_1.12.2", "mappings"), label: "1.12.2 MCP" },
  ];
  for (const t of targets) {
    const files = existsSync(t.dir) ? readdirSync(t.dir) : [];
    if (files.length === 0) {
      bag.warn(`${t.label}: empty or missing (${t.dir})`);
      continue;
    }
    const hasCsv = files.some((f) => f.endsWith(".csv"));
    if (!hasCsv) bag.warn(`${t.label}: no .csv files in ${t.dir}`);
    bag.info(`${t.label}: ${files.length} files (${files.slice(0, 5).join(", ")})`);
  }
  return { ok: !bag.hasErrors(), bag };
}

export async function checkMcpServer({ cwd = join(__dirname, ".."), skip = false } = {}) {
  const bag = new DiagnosticBag();
  if (skip) {
    bag.info("skipped (--no-tsc)");
    return { ok: true, bag };
  }
  try {
    execFileSync("npx", ["tsc", "--noEmit"], { cwd, stdio: "pipe", timeout: 60000 });
    bag.info("tsc --noEmit: 0 errors");
    return { ok: true, bag };
  } catch (e) {
    const output = (e.stdout?.toString?.() || "") + (e.stderr?.toString?.() || "");
    const errors = (output.match(/error TS/g) || []).length;
    bag.error(`tsc reported ${errors} errors`);
    bag.info(
      output.split("\n").filter((l) => l.includes("error TS")).slice(0, 5).join("\n    ")
    );
    return { ok: false, bag };
  }
}

// ── Orchestrator ────────────────────────────────────────────────────────────

export async function runValidation({
  dataDir = DATA_DIR,
  filterMc = null,
  runTsc = true,
  manifestOverride = null,
} = {}) {
  const sections = [];
  const manifestCheck = checkManifest({ dataDir });
  sections.push({ title: "1. forge-versions-manifest.json", bag: manifestCheck.bag });

  const mkdocs = checkMkDocsVersions(manifestOverride ?? manifestCheck.manifest, { dataDir, filterMc });
  sections.push({ title: "2. MkDocs version data", bag: mkdocs.bag });

  const javadoc = checkJavadocVersions(manifestOverride ?? manifestCheck.manifest, { dataDir, filterMc });
  sections.push({ title: "3. Javadoc version data", bag: javadoc.bag });

  const mappings = checkMappings({ dataDir });
  sections.push({ title: "4. Mappings directories", bag: mappings.bag });

  const tsc = await checkMcpServer({ cwd: join(__dirname, ".."), skip: !runTsc });
  sections.push({ title: "5. MCP server TypeScript compile", bag: tsc.bag });

  return {
    sections,
    ok:
      manifestCheck.ok && mkdocs.ok && javadoc.ok && mappings.ok && tsc.ok,
  };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.flags.versionError) {
    console.error(`error: --version requires a non-empty value (${args.flags.versionError})`);
    process.exit(2);
  }
  const runTsc   = !args.flags["no-tsc"];
  const filterMc = args.flags.version || null;

  console.log("Forge Multi-Version Documentation Build Validator");
  console.log(`Data directory: ${DATA_DIR}`);
  if (filterMc) console.log(`Filter: --version=${filterMc}`);

  const { sections, ok } = await runValidation({ runTsc, filterMc });
  for (const s of sections) reportSection(s.bag, s.title);

  console.log("\n=== Summary ===");
  if (ok) {
    console.log("✅ all checks passed");
  } else {
    const failCount = sections.reduce((n, s) => n + s.bag.errors.length, 0);
    const warnCount = sections.reduce((n, s) => n + s.bag.warnings.length, 0);
    console.log(`❌ ${failCount} failures, ${warnCount} warnings`);
    console.log("Next steps:");
    console.log("  1. Re-run: node scripts/fetch-forge-docs.js --all");
    console.log("  2. Re-run: node scripts/process-forge-docs.js --all");
    console.log("  3. Re-run: node scripts/fetch-forge-javadoc.js --all");
  }
  process.exitCode = ok ? 0 : 1;
}

// Only auto-run when invoked directly (lets tests import this module safely).
const invokedDirectly =
  process.argv[1] &&
  import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`;
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
