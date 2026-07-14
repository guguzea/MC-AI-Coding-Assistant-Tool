#!/usr/bin/env node
/**
 * Repair Fabric raw-file collection metadata only.
 *
 * Fabric Docs main and Fabric Wiki are shared, cross-version sources. The
 * `> 版本：` line denotes the target collection scope, not the upstream
 * document's authored Minecraft version. Older fetch runs accidentally wrote
 * a hard-coded source version into other target directories.
 *
 * This script changes only mismatched `> 版本：` lines under
 * data/fabric_<version>/{fabric-docs,fabric-wiki}/<version>/raw/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataRoot = path.resolve(scriptDir, "..", "..", "data");
const dryRun = process.argv.includes("--dry-run");
const versionArg = process.argv.find((arg) => arg.startsWith("--version="));
const onlyVersion = versionArg ? versionArg.slice("--version=".length) : null;
const markerRx = /(>\s*版本：\s*)(\S+)/;

function listFabricDirs() {
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^fabric_\d/.test(entry.name))
    .map((entry) => ({ name: entry.name, version: entry.name.slice("fabric_".length) }))
    .filter((entry) => !onlyVersion || entry.version === onlyVersion)
    .sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }));
}

let scanned = 0;
let changed = 0;
let missing = 0;
const changes = [];

for (const { name, version } of listFabricDirs()) {
  for (const source of ["fabric-docs", "fabric-wiki"]) {
    const rawDir = path.join(dataRoot, name, source, version, "raw");
    if (!fs.existsSync(rawDir)) continue;
    for (const dirent of fs.readdirSync(rawDir, { withFileTypes: true })) {
      if (!dirent.isFile()) continue;
      const file = path.join(rawDir, dirent.name);
      const text = fs.readFileSync(file, "utf8");
      scanned++;
      const match = text.match(markerRx);
      if (!match) {
        missing++;
        continue;
      }
      if (match[2] === version) continue;
      const updated = text.replace(markerRx, `$1${version}`);
      if (!dryRun) fs.writeFileSync(file, updated, "utf8");
      changed++;
      changes.push({ file: path.relative(dataRoot, file), from: match[2], to: version });
    }
  }
}

console.log(JSON.stringify({ dryRun, dataRoot, scanned, changed, missing, changes }, null, 2));
