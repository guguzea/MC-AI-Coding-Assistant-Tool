#!/usr/bin/env node
/**
 * data consistency audit (read-only)
 * ───────────────────────────────────
 * Walks H:/MC_skill/data (or `--data-root=<path>`) and verifies structural
 * integrity of indexed documentation/metadata bundles for Forge, Fabric, and
 * NeoForge. Never writes to disk; never opens a network socket.
 *
 * Checks:
 *   A  version dir + meta header (forge/fabric/neoforge sources each have a
 *      meta.json or top-level manifest).
 *   B  raw header sanity (first lines contain a version marker).
 *   C  mapping artifact key sanity (yarn / parchment / parchment-params).
 *   D  index `id`/`version` consistency within each platform/version scope.
 *   E  raw ↔ processed filename set equality (with platform-aware ext
 *      normalization for fabric-wiki .txt → .md).
 *   F  `processedFile` references in l2 indexes resolve on disk.
 *   G  `_manifest.json` `file:` references resolve in raw/processed.
 *   H  empty-index detection (warn).
 *   I  cross-version pollution (raw filenames mentioning another MC version
 *      accidentally placed under a different version dir).
 *
 * CLI:
 *   --platform=forge|fabric|neoforge|all        (default: all)
 *   --version=<mcVersion>|<platform_mcver/subdir> (default: all)
 *       - "1.20.1" → MC version match
 *       - "forge_1.20.1/fabric-docs" → exact index record
 *   --data-root=<path>                          (default: ../data)
 *   --json                                      (force JSON output; default)
 *
 * Output: a single JSON report to stdout. Exit code is 1 if any ERROR-level
 * issue is reported, 0 otherwise (warnings are non-fatal).
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { DatabaseSync } from "node:sqlite";

const PLATFORMS = ["forge", "fabric", "neoforge"];
const RAW_VERSION_RX = />\s*版本：\s*(\S+)/;
const RAW_FRONTMATTER_VERSION_RX = /^version:\s*"([^"]+)"/m;
const NEO_VERSION_RX = /^version:\s*"([^"]+)"/m;

function parseArgs(argv) {
  const out = {
    platform: "all",
    version: null,
    dataRoot: null,
    form: "mc", // "mc" or "index"
  };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a.startsWith("--")) continue;
    const eq = a.indexOf("=");
    const key = (eq < 0 ? a : a.slice(0, eq)).slice(2);
    let val = eq < 0 ? undefined : a.slice(eq + 1);
    if (val === undefined && ["platform", "version", "data-root"].includes(key)) {
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        val = next;
        i++;
      }
    }
    if (key === "platform" && val) out.platform = String(val);
    else if (key === "version" && val) {
      out.version = String(val);
      out.form = out.version.includes("/") ? "index" : "mc";
    } else if (key === "data-root" && val) out.dataRoot = String(val);
    else if (key === "help" || key === "h") {
      printHelp();
      process.exit(0);
    } else if (["platform", "version", "data-root"].includes(key)) {
      throw new Error(`--${key} requires a non-empty value`);
    }
  }
  return out;
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node scripts/audit-data-consistency.mjs [options]",
      "",
      "Options:",
      "  --platform=forge|fabric|neoforge|all   (default: all)",
      "  --version=<mcVersion>|<platform>/<subdir>",
      "         e.g. --version=1.20.1",
      "              --version=forge_1.20.1/fabric-docs",
      "              --version=fabric_1.20.1",
      "  --data-root=<path>   (default: ../data relative to script)",
      "  --help               show this message",
      "",
      "Read-only. Exits 1 when at least one ERROR is reported.",
    ].join("\n"),
  );
}

function safeStat(p) {
  try { return fs.statSync(p); } catch { return null; }
}

function safeReadDir(p) {
  try { return fs.readdirSync(p, { withFileTypes: true }); } catch { return null; }
}

function safeReadFile(p, enc = "utf8") {
  try { return fs.readFileSync(p, enc); } catch { return null; }
}

function listDataRoot(dataRoot) {
  const entries = safeReadDir(dataRoot);
  if (!entries) return [];
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

/* index → platform + version parser */
const VERSION_TAIL = /^(\d+(?:\.\d+){0,3})$/;

function parseIndexName(name) {
  for (const p of PLATFORMS) {
    const prefix = `${p}_`;
    if (!name.startsWith(prefix)) continue;
    const tail = name.slice(prefix.length);
    if (!VERSION_TAIL.test(tail)) return null;
    return { platform: p, version: tail, scope: "version", name };
  }
  return null;
}

function docSubDirs(platform) {
  if (platform === "forge") return ["forge-docs", "extracted", "mappings"];
  if (platform === "fabric") return ["fabric-docs", "fabric-wiki", "mappings"];
  if (platform === "neoforge") return ["neoforge-docs"];
  return [];
}

function selectPlatforms(arg, selected) {
  if (arg === "all") return selected.slice();
  if (!PLATFORMS.includes(arg)) {
    throw new Error(`unknown --platform=${arg}; expected one of ${PLATFORMS.join(",")},all`);
  }
  return [arg];
}

function selectIndexesForPlatform(allRoot, platform, versionArg) {
  const all = listDataRoot(allRoot)
    .map(parseIndexName)
    .filter(Boolean)
    .filter((x) => x.platform === platform);
  if (!versionArg) return all;
  if (versionArg.form === "index") {
    const [name, subdir] = versionArg.value.split("/");
    const hit = all.find((d) => d.name === name);
    return hit ? [{ ...hit, subdir }] : [];
  }
  const mc = versionArg.value;
  return all.filter((d) => d.version === mc);
}

function resolveTargets(dataRoot, platform, versionArg) {
  const platforms = selectPlatforms(platform, PLATFORMS);
  let targets = [];
  for (const p of platforms) {
    targets = targets.concat(selectIndexesForPlatform(dataRoot, p, versionArg));
  }
  return targets;
}

function listVersionedDocs(versionDir, subdir) {
  const root = path.join(versionDir, subdir);
  const entries = safeReadDir(root);
  if (!entries) return [];
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ version: e.name, abs: path.join(root, e.name) }));
}

function listDocsIndexes(versionDir, subdir, version) {
  const docRoot = path.join(versionDir, subdir, version);
  const entries = safeReadDir(docRoot);
  if (!entries) return { docRoot, rawFiles: [], processedFiles: [], indexFiles: [], missing: true };
  const rawRoot = path.join(docRoot, "raw");
  const processedRoot = path.join(docRoot, "processed");
  const rawFiles = safeReadDir(rawRoot)?.map((e) => e.name) ?? [];
  const processedFiles = safeReadDir(processedRoot)?.map((e) => e.name) ?? [];
  const indexFiles = entries
    .filter((e) => e.isFile() && /^index-l\d+\.json$/.test(e.name))
    .map((e) => e.name);
  return { docRoot, rawFiles, processedFiles, indexFiles, missing: false };
}

function basenameNoExt(p) {
  const base = path.basename(p);
  const dot = base.lastIndexOf(".");
  return dot < 0 ? base : base.slice(0, dot);
}

/* check record: { check, level, path, expected, actual, detail } */
function rec(check, level, p, expected, actual, detail = undefined) {
  return { check, level, path: p, expected, actual, ...(detail ? { detail } : {}) };
}

function checkVersionedDocScope(platform, name, version, versionDir, doc, docRoot, issues) {
  // A: version dir
  if (doc.missing) {
    issues.push(rec("A-version-dir", "ERROR", docRoot, "directory exists", "missing"));
    return;
  }
  // B: raw header
  if (doc.rawFiles.length > 0) {
    for (const f of doc.rawFiles) {
      const abs = path.join(docRoot, "raw", f);
      const sample = safeReadFile(abs);
      if (sample === null) {
        issues.push(rec("B-raw-header", "ERROR", abs, "file readable", "unreadable"));
        continue;
      }
      if (platform === "neoforge") {
        const m = sample.match(NEO_VERSION_RX);
        if (!m) {
          issues.push(rec("B-raw-header", "ERROR", abs, "frontmatter version marker", "missing"));
        } else if (m[1] !== version) {
          issues.push(rec("B-raw-header", "ERROR", abs, `version "${version}"`, `version "${m[1]}"`));
        }
      } else if (platform === "forge") {
        // forge raw may use either `---\nversion: "..."\n---` front-matter
        // (older style) or `> 版本：...` (newer style). Accept both.
        const m1 = sample.match(RAW_FRONTMATTER_VERSION_RX);
        if (m1) {
          if (m1[1] !== version) {
            issues.push(rec("B-raw-header", "ERROR", abs, `version "${version}"`, `version "${m1[1]}"`));
          }
        } else {
          const m2 = sample.match(RAW_VERSION_RX);
          if (!m2) {
            issues.push(rec("B-raw-header", "WARN", abs, "forge version marker (frontmatter `version:` or `> 版本：...`)", "missing"));
          } else if (m2[1] !== version) {
            issues.push(rec("B-raw-header", "ERROR", abs, `version "${version}"`, `version "${m2[1]}"`));
          }
        }
      } else {
        const m = sample.match(RAW_VERSION_RX);
        if (!m) {
          issues.push(rec("B-raw-header", "WARN", abs, "raw header `> 版本：...`", "missing"));
        } else if (m[1] !== version) {
          issues.push(rec("B-raw-header", "ERROR", abs, `version "${version}"`, `version "${m[1]}"`));
        }
      }
    }
  }

  // E: raw ↔ processed set
  if (doc.rawFiles.length > 0 || doc.processedFiles.length > 0) {
    let rawSet = new Set(doc.rawFiles);
    let processedSet = new Set(doc.processedFiles);
    if (subdirIsWiki(platform, docRoot)) {
      // wiki raw is .txt, processed is .md — compare stem-only
      rawSet = new Set(doc.rawFiles.map(basenameNoExt));
      processedSet = new Set(doc.processedFiles.map(basenameNoExt));
    }
    const onlyRaw = [...rawSet].filter((x) => !processedSet.has(x));
    const onlyProcessed = [...processedSet].filter((x) => !rawSet.has(x));
    for (const x of onlyRaw) {
      issues.push(rec("E-raw-processed-set", "ERROR", path.join(docRoot, "raw", x), "present in processed", "missing"));
    }
    for (const x of onlyProcessed) {
      issues.push(rec("E-raw-processed-set", "ERROR", path.join(docRoot, "processed", x), "present in raw", "missing"));
    }
  }

  // D + F + H: index files
  if (doc.indexFiles.length === 0) {
    issues.push(rec("H-empty-index", "WARN", docRoot, "≥1 index-l*.json", "0 found"));
  }
  for (const idxName of doc.indexFiles) {
    const abs = path.join(docRoot, idxName);
    const text = safeReadFile(abs);
    if (text === null) {
      issues.push(rec("D-index-parse", "ERROR", abs, "JSON readable", "unreadable"));
      continue;
    }
    let arr;
    try { arr = JSON.parse(text); }
    catch (e) {
      issues.push(rec("D-index-parse", "ERROR", abs, "JSON parse", `error: ${e.message}`));
      continue;
    }
    if (!Array.isArray(arr)) {
      issues.push(rec("D-index-parse", "ERROR", abs, "JSON array", typeof arr));
      continue;
    }
    const seenIds = new Set();
    for (const item of arr) {
      if (!item || typeof item !== "object") continue;
      const id = item.id;
      if (typeof id !== "string") {
        issues.push(rec("D-index-id-version", "ERROR", abs, "string id", String(typeof id)));
        continue;
      }
      if (seenIds.has(id)) {
        issues.push(rec("D-index-duplicate-id", "ERROR", abs, "unique id", `duplicate "${id}"`));
      }
      seenIds.add(id);
      if (typeof item.version === "string" && item.version !== version) {
        issues.push(rec("D-index-id-version", "ERROR", abs, `version "${version}"`, `version "${item.version}"`));
      }
      if (typeof item.processedFile === "string") {
        const target = path.join(docRoot, item.processedFile);
        if (!safeStat(target)) {
          issues.push(rec("F-index-processedFile", "ERROR", target, "exists", "missing"));
        }
      }
      // I: cross-version pollution — id contains a different MC version
      // (works for forge/fabric where ids are "<version>/<chapter>"; neoforge
      // uses bare chapter ids, so it surfaces only when an id is shaped like
      // a legacy prefix that doesn't match the current version).
      const idStr = item.id;
      if (typeof idStr === "string" && /^(\d+\.\d+(?:\.\d+)?)\//.test(idStr)) {
        const head = idStr.match(/^(\d+\.\d+(?:\.\d+)?)\//)[1];
        if (head !== version) {
          issues.push(rec("I-cross-version-id", "ERROR", abs, `id prefix "${version}"`, `id prefix "${head}" (full "${idStr}")`));
        }
      }
    }
  }

  // S: semantic index（有 processed/*.md 时建议有 db；fts5-only 记 WARN 非硬失败；javadoc 不在 docSubDirs）
  checkSemanticIndex(docRoot, doc.processedFiles, issues);
}

function checkSemanticIndex(docRoot, processedFiles, issues) {
  const processedMd = (processedFiles ?? []).filter((f) => f.endsWith(".md"));
  if (processedMd.length === 0) return;
  const dbPath = path.join(docRoot, "semantic", "db.sqlite");
  if (!safeStat(dbPath)) {
    issues.push(rec(
      "S-semantic-db",
      "WARN",
      dbPath,
      "semantic/db.sqlite present for docs with processed/*.md",
      "missing",
      "Run: npm run fetch:embedding-model && npm run build:semantic-index -- --platform=… --version=…",
    ));
    return;
  }
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    const meta = (key) => {
      const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key);
      return row?.value;
    };
    const chunks = Number(meta("chunks") ?? 0);
    const docs = Number(meta("docs") ?? 0);
    const embedded = Number(meta("embedded") ?? 0);
    if (!meta("chunks") && !meta("docs")) {
      issues.push(rec("S-semantic-meta", "WARN", dbPath, "readable meta", "empty/unreadable"));
    }
    if (docs > 0 && processedMd.length > 0 && docs / processedMd.length < 0.3) {
      issues.push(rec(
        "S-semantic-docs",
        "WARN",
        dbPath,
        `docs≈processed md (${processedMd.length})`,
        `docs=${docs}`,
      ));
    }
    if (chunks > 0 && embedded === 0) {
      issues.push(rec(
        "S-semantic-fts5-only",
        "WARN",
        dbPath,
        "hybrid embeddings preferred",
        "fts5-only (no embedding rows)",
        "Optional: npm run fetch:embedding-model && rebuild with embed",
      ));
    }
    db.close();
  } catch (e) {
    issues.push(rec("S-semantic-meta", "WARN", dbPath, "readable sqlite meta", `error: ${e.message}`));
  }
}

function subdirIsWiki(platform, docRoot) {
  // heuristic: a `raw` dir containing .txt files in fabric-wiki
  // (forge-docs and neoforge-docs raw are .md / .html, fabric-wiki raw is .txt)
  if (!docRoot.replace(/\\/g, "/").includes("/fabric-wiki/")) return false;
  return true;
}

function checkMappingsArtifacts(platform, versionDir, version, issues) {
  const mdir = path.join(versionDir, "mappings");
  if (!safeStat(mdir)) return;
  const entries = safeReadDir(mdir);
  if (!entries) return;
  for (const e of entries) {
    if (!e.isFile()) continue;
    const abs = path.join(mdir, e.name);
    if (e.name === "yarn-mappings.json") {
      // Peek header only — never JSON.parse the full ~200MB file in audit.
      let head = "";
      try {
        const fd = fs.openSync(abs, "r");
        try {
          const buf = Buffer.alloc(2048);
          const n = fs.readSync(fd, buf, 0, 2048, 0);
          head = buf.slice(0, n).toString("utf8");
        } finally {
          fs.closeSync(fd);
        }
      } catch {
        issues.push(rec("C-mapping", "ERROR", abs, "readable", "unreadable"));
        continue;
      }
      const v = /"version"\s*:\s*"([^"]+)"/.exec(head)?.[1] ?? "";
      const m = v.match(/^(\d+\.\d+(?:\.\d+)?)/);
      if (!m || m[1] !== version) {
        issues.push(rec("C-mapping", "ERROR", abs, `yarn version starts with "${version}"`, `yarn version "${v}"`));
      }
      const format = /"format"\s*:\s*"([^"]+)"/.exec(head)?.[1];
      if (!format || !format.startsWith("yarn")) {
        issues.push(rec("C-mapping", "ERROR", abs, "yarn-* format", JSON.stringify(format)));
      }
      const source = /"source"\s*:\s*"([^"]+)"/.exec(head)?.[1];
      if (!source || !source.startsWith("https://")) {
        issues.push(rec("C-mapping", "WARN", abs, "https source URL", JSON.stringify(source)));
      }
      if (!/"classMap"\s*:/.test(head)) {
        issues.push(rec("C-mapping", "ERROR", abs, "classMap object", "missing in header peek"));
      }
      const sqlitePath = path.join(mdir, "yarn-mappings.sqlite");
      if (!safeStat(sqlitePath)) {
        issues.push(rec(
          "C-mapping",
          "ERROR",
          sqlitePath,
          "yarn-mappings.sqlite present when yarn-mappings.json exists",
          "missing — run: npm run build:yarn-sqlite",
        ));
      }
    } else if (e.name === "parchment-params.json") {
      const text = safeReadFile(abs);
      if (text === null) { issues.push(rec("C-mapping", "ERROR", abs, "readable", "unreadable")); continue; }
      let obj;
      try { obj = JSON.parse(text); } catch (err) { issues.push(rec("C-mapping", "ERROR", abs, "JSON parse", `error: ${err.message}`)); continue; }
      if (typeof obj.source !== "string" || !obj.source.startsWith("https://")) {
        issues.push(rec("C-mapping", "WARN", abs, "https source URL", JSON.stringify(obj.source)));
      }
      if (!Array.isArray(obj.packages) || !Array.isArray(obj.classes)) {
        issues.push(rec("C-mapping", "ERROR", abs, "packages/classes arrays", "missing"));
      }
    } else if (e.name === "parchment.json") {
      const text = safeReadFile(abs);
      if (text === null) { issues.push(rec("C-mapping", "ERROR", abs, "readable", "unreadable")); continue; }
      let obj;
      try { obj = JSON.parse(text); } catch (err) { issues.push(rec("C-mapping", "ERROR", abs, "JSON parse", `error: ${err.message}`)); continue; }
      if (typeof obj.version !== "string") {
        issues.push(rec("C-mapping", "ERROR", abs, "version key", "missing"));
      }
    }
  }
}

function checkForgeManifest(versionDir, platform, issues) {
  // Forge-specific `_manifest.json` lives in `<version>/<subdir>/_manifest.json`
  if (platform !== "forge") return;
  const docsRoot = path.join(versionDir, "forge-docs");
  const manifestPath = path.join(docsRoot, "_manifest.json");
  if (!safeStat(manifestPath)) return;
  const text = safeReadFile(manifestPath);
  if (text === null) return;
  let obj;
  try { obj = JSON.parse(text); } catch (e) {
    issues.push(rec("G-manifest", "ERROR", manifestPath, "JSON parse", `error: ${e.message}`));
    return;
  }
  for (const [key, entry] of Object.entries(obj)) {
    if (!entry || typeof entry !== "object") continue;
    const file = entry.file;
    if (typeof file !== "string") continue;
    // determine relative target version subdir from key
    const parts = key.split("/");
    // last segment is the chapter, second-to-last is mc version
    if (parts.length < 2) continue;
    const verInKey = parts[0];
    const candidateDirs = [
      path.join(docsRoot, verInKey, "raw", file),
      path.join(docsRoot, verInKey, "processed", file),
    ];
    if (!candidateDirs.some((p) => safeStat(p))) {
      // try the version-dir level (single-version legacy)
      const legacy = path.join(docsRoot, "raw", file);
      if (!safeStat(legacy)) {
        issues.push(rec("G-manifest-orphan", "ERROR", manifestPath, `file "${file}" present (${verInKey})`, "missing"));
      }
    }
    // I: cross-version pollution — manifest entries keyed under versions
    //     whose platform differs from this data root are flagged elsewhere;
    //     a manifest key prefix mismatch means a stale entry.
    if (verInKey !== basenameNoExt(path.basename(versionDir))) {
      // Manifest entries for other versions are valid in `_manifest.json`
      // because the file aggregates all versions. Skip silently.
    }
  }
}

function checkMetaHeader(platform, versionDir, version, issues) {
  const metaPath = path.join(versionDir, "meta.json");
  if (platform === "fabric") {
    if (!safeStat(metaPath)) {
      issues.push(rec("A-meta", "ERROR", metaPath, "exists", "missing"));
      return;
    }
    const text = safeReadFile(metaPath);
    if (text === null) return;
    let obj;
    try { obj = JSON.parse(text); } catch (e) {
      issues.push(rec("A-meta", "ERROR", metaPath, "JSON parse", `error: ${e.message}`));
      return;
    }
    const declaredVersion = obj.version ?? obj.meta?.mcVersion ?? obj.game?.version;
    if (!declaredVersion) {
      issues.push(rec("A-meta", "ERROR", metaPath, `version "${version}"`, "version missing"));
    } else if (declaredVersion !== version) {
      issues.push(rec("A-meta", "ERROR", metaPath, `version "${version}"`, `version "${declaredVersion}"`));
    }
  }
  // Forge + NeoForge: rely on _manifest.json / chapter-key version segment
}

function auditIndex(dataRoot, idx) {
  const issues = [];
  const versionDir = path.join(dataRoot, idx.name);
  checkMetaHeader(idx.platform, versionDir, idx.version, issues);
  checkMappingsArtifacts(idx.platform, versionDir, idx.version, issues);
  checkForgeManifest(versionDir, idx.platform, issues);

  const subdirs = docSubDirs(idx.platform);
  for (const subdir of subdirs) {
    const subAbs = path.join(versionDir, subdir);
    if (!safeStat(subAbs)) continue;
    if (subdir === "extracted" || subdir === "mappings") continue;
    const versions = listVersionedDocs(versionDir, subdir);
    const scope = idx.subdir ? versions.filter((v) => v.version === idx.subdir) : versions;
    if (idx.subdir && scope.length === 0) {
      issues.push(rec("A-version-scope", "ERROR", subAbs + "/" + idx.subdir, "exists", "missing"));
    }
    for (const v of scope) {
      const doc = listDocsIndexes(versionDir, subdir, v.version);
      checkVersionedDocScope(idx.platform, idx.name, v.version, versionDir, doc, doc.docRoot, issues);
    }
  }
  return issues;
}

function summarize(issues) {
  const counts = { ERROR: 0, WARN: 0 };
  for (const i of issues) counts[i.level] = (counts[i.level] ?? 0) + 1;
  return counts;
}

function main() {
  const opts = parseArgs(process.argv);
  const scriptDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
  const repoRoot = path.resolve(scriptDir, "..", "..");
  const dataRoot = path.resolve(opts.dataRoot ?? path.join(repoRoot, "data"));
  const versionArg = opts.version ? { value: opts.version, form: opts.form } : null;
  const targets = resolveTargets(dataRoot, opts.platform, versionArg);
  if (versionArg && versionArg.form === "index") {
    const [idxName, subdir] = versionArg.value.split("/");
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].name === idxName) targets[i] = { ...targets[i], subdir };
    }
  }

  const all = [];
  const reports = targets.map((t) => ({ index: t, issues: auditIndex(dataRoot, t) }));
  for (const r of reports) all.push(...r.issues);

  const counts = summarize(all);
  const code = counts.ERROR > 0 ? 1 : 0;
  const payload = {
    tool: "audit-data-consistency",
    readOnly: true,
    dataRoot,
    filter: { platform: opts.platform, version: opts.version ?? "all", form: versionArg?.form ?? "all" },
    scanned: targets.map((t) => ({ name: t.name, platform: t.platform, version: t.version, subdir: t.subdir ?? null })),
    summary: { ...counts, total: all.length },
    issues: all,
  };
  process.stdout.write(JSON.stringify(payload, null, 2).replace(/^\uFEFF/, "") + "\n");
  process.exit(code);
}

// allow being required for test code
export { auditIndex, parseIndexName, parseArgs };

function isMainModule() {
  // Node ≥20.11 exposes `require.main` for CJS and `import.meta.main` is
  // available in newer runtimes. Fall back to `process.argv[1]`/URL match.
  if (typeof import.meta.main === "boolean") return import.meta.main;
  try {
    const entry = require.main?.filename ?? null;
    if (!entry) return false;
    const here = new URL(import.meta.url).pathname.replace(/^\//, "");
    return entry.replace(/\\/g, "/").endsWith(here.replace(/\\/g, "/"));
  } catch {
    return false;
  }
}

if (isMainModule()) {
  try { main(); } catch (e) {
    process.stdout.write(JSON.stringify({ tool: "audit-data-consistency", fatal: true, message: e.message, stack: e.stack }) + "\n");
    process.exit(2);
  }
}
