#!/usr/bin/env node
/**
 * Build data/vanilla_<ver>/registries/registry-index.sqlite from *.json dumps.
 *
 * Usage: node scripts/build-vanilla-registries.mjs --version 1.20.1 [--force]
 */
import { pathToFileURL } from "url";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

process.chdir(root);
process.env.MC_SKILL_DATA = process.env.MC_SKILL_DATA ?? join(root, "..", "data");

const { buildRegistryIndex } = await import(
  pathToFileURL(join(root, "dist", "registry", "builder.js")).href
);

function parseArgs(argv) {
  let version = "1.20.1";
  let force = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") force = true;
    else if (a.startsWith("--version=")) version = a.slice("--version=".length);
    else if (a === "--version" && argv[i + 1]) version = argv[++i];
  }
  return { version, force };
}

const { version, force } = parseArgs(process.argv.slice(2));
const report = buildRegistryIndex(version, { force });
console.log(JSON.stringify(report, null, 2));
