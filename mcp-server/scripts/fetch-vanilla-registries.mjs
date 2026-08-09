#!/usr/bin/env node
/**
 * Fetch / convert Vanilla registry ID dumps → data/vanilla_<ver>/registries/*.json
 * then build registry-index.sqlite.
 *
 * Paths (priority):
 *   A) --from-reports=<dir>  containing registries.json / blocks.json / items.json …
 *   B) PrismarineJS/minecraft-data (jsDelivr CDN) via dataPaths.json  【默认主路径】
 *
 * Usage:
 *   node scripts/fetch-vanilla-registries.mjs --version=1.20.1 [--force]
 *   node scripts/fetch-vanilla-registries.mjs --version=1.21.1 --force
 *   node scripts/fetch-vanilla-registries.mjs --version=1.20.1 --from-reports=H:/mc/reports
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataRoot = process.env.MC_SKILL_DATA ?? path.join(root, "..", "data");

const CDN = "https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-data@master/data";

/** registry key → minecraft-data dataset key */
const DATASETS = [
  { registry: "blocks", key: "blocks" },
  { registry: "items", key: "items" },
  { registry: "biomes", key: "biomes" },
  { registry: "particles", key: "particles" },
  { registry: "mob_effects", key: "effects" },
  { registry: "enchantments", key: "enchantments" },
  { registry: "sound_events", key: "sounds" },
];

function parseArgs(argv) {
  let version = "1.20.1";
  let force = false;
  let fromReports = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") force = true;
    else if (a.startsWith("--version=")) version = a.slice(10);
    else if (a === "--version" && argv[i + 1]) version = argv[++i];
    else if (a.startsWith("--from-reports=")) fromReports = a.slice(15);
    else if (a === "--from-reports" && argv[i + 1]) fromReports = argv[++i];
  }
  return { version, force, fromReports };
}

function camelToSnake(s) {
  return String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s.]+/g, "_")
    .toLowerCase();
}

function toResourceId(rawName, { camel = false } = {}) {
  if (!rawName || typeof rawName !== "string") return null;
  if (rawName.includes(":")) return rawName.toLowerCase();
  const name = camel ? camelToSnake(rawName) : rawName.toLowerCase().replace(/\s+/g, "_");
  if (!name) return null;
  return `minecraft:${name}`;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function normalizeEntries(raw, opts = {}) {
  const out = [];
  const seen = new Set();
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray(raw.entries)
      ? raw.entries
      : raw && typeof raw === "object"
        ? Object.keys(raw).map((k) => ({ name: k, ...(typeof raw[k] === "object" ? raw[k] : {}) }))
        : [];

  for (const e of list) {
    if (!e || typeof e !== "object") continue;
    let id = null;
    if (typeof e.id === "string" && e.id.includes(":")) id = e.id;
    else if (typeof e.name === "string") id = toResourceId(e.name, opts);
    else if (typeof e.id === "string") id = toResourceId(e.id, opts);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const translationKey =
      typeof e.translationKey === "string"
        ? e.translationKey
        : typeof e.displayName === "string"
          ? undefined
          : undefined;
    out.push(translationKey ? { id, translationKey } : { id });
  }
  out.sort((a, b) => a.id.localeCompare(b.id));
  return out;
}

/** Path A: official data generator reports */
function importFromReports(reportsDir, outDir) {
  const written = [];
  const registriesPath = path.join(reportsDir, "registries.json");
  if (fs.existsSync(registriesPath)) {
    const registries = JSON.parse(fs.readFileSync(registriesPath, "utf8"));
    // Shape varies: either map of registry → {entries:{id:…}} or similar
    for (const [regKey, body] of Object.entries(registries)) {
      const simple = regKey.replace(/^minecraft:/, "").replace(/\//g, "_");
      let entries = [];
      if (body && typeof body === "object") {
        if (Array.isArray(body)) entries = normalizeEntries(body);
        else if (body.entries) {
          if (Array.isArray(body.entries)) entries = normalizeEntries(body.entries);
          else entries = normalizeEntries(Object.keys(body.entries).map((id) => ({ id })));
        } else {
          entries = normalizeEntries(Object.keys(body).map((id) => ({ id })));
        }
      }
      if (entries.length === 0) continue;
      const file = `${simple}.json`;
      fs.writeFileSync(path.join(outDir, file), JSON.stringify(entries, null, 2));
      written.push({ registry: simple, count: entries.length, file });
    }
  }

  for (const name of ["blocks.json", "items.json", "biomes.json"]) {
    const p = path.join(reportsDir, name);
    if (!fs.existsSync(p)) continue;
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    // blocks.json from reports is often map of id → state info
    let entries;
    if (Array.isArray(raw)) entries = normalizeEntries(raw);
    else entries = normalizeEntries(Object.keys(raw).map((id) => ({ id })));
    const registry = name.replace(/\.json$/, "");
    fs.writeFileSync(path.join(outDir, name), JSON.stringify(entries, null, 2));
    written.push({ registry, count: entries.length, file: name });
  }
  return written;
}

/** Path B: PrismarineJS minecraft-data */
async function importFromMinecraftData(version, outDir) {
  const paths = await fetchJson(`${CDN}/dataPaths.json`);
  const pc = paths.pc?.[version];
  if (!pc) {
    throw new Error(`minecraft-data has no pc/${version} entry in dataPaths.json`);
  }

  const written = [];
  for (const { registry, key } of DATASETS) {
    const rel = pc[key];
    if (!rel) {
      console.error(`skip ${registry}: no path for ${key} in ${version}`);
      continue;
    }
    const url = `${CDN}/${rel}/${key === "sounds" ? "sounds" : key}.json`;
    // sounds path: rel is pc/1.20.1, file sounds.json
    const fileUrl = `${CDN}/${rel}/${key === "effects" ? "effects" : key}.json`;
    try {
      const raw = await fetchJson(fileUrl);
      const camel = key === "effects";
      const entries = normalizeEntries(raw, { camel });
      if (entries.length === 0) {
        console.error(`skip ${registry}: 0 entries from ${fileUrl}`);
        continue;
      }
      const file = `${registry}.json`;
      fs.writeFileSync(path.join(outDir, file), JSON.stringify(entries, null, 2));
      written.push({ registry, count: entries.length, file, source: fileUrl });
      console.error(`wrote ${file}: ${entries.length} from ${rel}`);
    } catch (err) {
      console.error(`fail ${registry}: ${err instanceof Error ? err.message : err}`);
    }
  }
  return written;
}

function writeManifest(outDir, version, source, written) {
  const manifest = {
    version,
    source,
    attribution:
      source.startsWith("minecraft-data")
        ? "PrismarineJS/minecraft-data (MIT). IDs are Mojang registry names."
        : "Official Minecraft data generator reports. IDs are Mojang registry names.",
    registries: written.map((w) => w.registry),
    counts: Object.fromEntries(written.map((w) => [w.registry, w.count])),
    fetchedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

function updateAttribution(version, source) {
  const noticePath = path.join(dataRoot, "vanilla_ATTRIBUTION.md");
  const line = `- ${version}: ${source} (${new Date().toISOString().slice(0, 10)})\n`;
  let body = "";
  if (fs.existsSync(noticePath)) body = fs.readFileSync(noticePath, "utf8");
  else {
    body =
      "# Vanilla registry dumps\n\n" +
      "Registry ID lists under `data/vanilla_*/registries/` may be built from:\n\n" +
      "- PrismarineJS/minecraft-data (MIT): https://github.com/PrismarineJS/minecraft-data\n" +
      "- Official Minecraft `reports/` from the data generator\n\n" +
      "Mojang registry IDs themselves are game content names.\n\n## Builds\n\n";
  }
  if (!body.includes(`- ${version}:`)) {
    body += line;
    fs.writeFileSync(noticePath, body);
  }
}

async function main() {
  const { version, force, fromReports } = parseArgs(process.argv.slice(2));
  const outDir = path.join(dataRoot, `vanilla_${version}`, "registries");
  ensureDir(outDir);

  const existingManifest = path.join(outDir, "manifest.json");
  if (!force && fs.existsSync(existingManifest)) {
    try {
      const m = JSON.parse(fs.readFileSync(existingManifest, "utf8"));
      if (m.source && !String(m.source).includes("curated-minimal") && (m.counts?.blocks ?? 0) > 100) {
        console.error(`existing full dump for ${version}; pass --force to rebuild`);
      }
    } catch {
      /* continue */
    }
  }

  // Remove old curated fixture files when forcing full rebuild
  if (force) {
    for (const f of fs.readdirSync(outDir)) {
      if (f.endsWith(".json") || f.endsWith(".sqlite")) {
        try {
          fs.unlinkSync(path.join(outDir, f));
        } catch {
          /* ignore */
        }
      }
    }
  }

  let written;
  let sourceLabel;
  if (fromReports) {
    if (!fs.existsSync(fromReports)) throw new Error(`reports dir missing: ${fromReports}`);
    written = importFromReports(fromReports, outDir);
    sourceLabel = `reports:${fromReports}`;
  } else {
    written = await importFromMinecraftData(version, outDir);
    sourceLabel = "minecraft-data@master";
  }

  if (!written.length) throw new Error("No registries written");
  const manifest = writeManifest(outDir, version, sourceLabel, written);
  updateAttribution(version, sourceLabel);

  // Build sqlite via compiled builder
  process.env.MC_SKILL_DATA = dataRoot;
  const builderUrl = pathToFileURL(path.join(root, "dist", "registry", "builder.js")).href;
  const { buildRegistryIndex } = await import(builderUrl);
  const report = buildRegistryIndex(version, { force: true });

  console.log(
    JSON.stringify(
      {
        ok: true,
        version,
        source: sourceLabel,
        manifest,
        sqlite: report,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
