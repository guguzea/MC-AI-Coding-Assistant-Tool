#!/usr/bin/env node
/**
 * data consistency audit (read-only)
 * ───────────────────────────────────
 * Walks <data-root> (default: repo `data/`, or `--data-root=<path>`) and verifies structural
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
 *   G  `_manifest.json` `file:` references resolve in raw/processed, **and** its
 *      top-level keys are duplicate-free (S17-T1; collector is indentation-agnostic
 *      since round 33 — depth/string-state scan of the raw text cross-checked
 *      against JSON.parse's top-level key set; collecting 0 keys is itself an ERROR).
 *   Z  the run actually scanned ≥1 `<platform>_<version>` index dir (S17-T2:
 *      a nonexistent `--data-root` or a filter that matches nothing used to print
 *      an empty report and **exit 0** — that vacuous pass is now an ERROR).
 *   H  empty-index detection (warn).
 *   I  cross-version pollution (raw filenames mentioning another MC version
 *      accidentally placed under a different version dir).
 *   J  processed/*.md stem must appear in index-l0 (search_docs / thin-tree
 *      get_doc_full 只认 L0；正文在盘但缺 L0 条目则不可检索).
 *
 * CLI:
 *   --platform=forge|fabric|neoforge|quilt|liteloader|rift|all        (default: all)
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
import { fileURLToPath } from "node:url";

const PLATFORMS = ["forge", "fabric", "neoforge", "quilt", "liteloader", "rift"];
const RAW_VERSION_RX = />\s*版本：\s*(\S+)/;
const RAW_FRONTMATTER_VERSION_RX = /^version:\s*"([^"]+)"/m;
const NEO_VERSION_RX = /^version:\s*"([^"]+)"/m;

// 仅跳过 E-raw-processed-set。禁止把 forge_ / fabric_ / neoforge_ / liteloader_ 写进此表。
// liteloader 有 raw .txt ↔ processed .md，走 stem 等值检查（见 subdirIsWiki），禁止整树跳过。
export const RAW_PROCESSED_SET_EXCEPTIONS = [
  { platformPrefix: "modloader_", docSubdir: "modloader-docs", reason: "故意 L0-only，页少不建 raw 对" },
  { platformPrefix: "quilt_", docSubdir: "quilt-docs", reason: "wiki/RFC 页 processed-only" },
];

export function skipsRawProcessedSet(indexName, docSubdir) {
  const name = String(indexName ?? "");
  const sub = String(docSubdir ?? "");
  return RAW_PROCESSED_SET_EXCEPTIONS.some(
    (e) => e.reason && name.startsWith(e.platformPrefix) && e.docSubdir === sub,
  );
}

/** 与 FabricDocStore.processedFileFor 一致：L0 id → processed/<stem>.md */
export function l0ProcessedStem(id) {
  const bare = String(id ?? "").replace(/^(?:\d+\.\d+(?:\.\d+)?|stable)\//, "");
  return bare.replace(/\//g, "_");
}

function checkProcessedL0Stem(docRoot, doc, issues) {
  const l0Path = path.join(docRoot, "index-l0.json");
  if (!safeStat(l0Path)) return;
  const text = safeReadFile(l0Path);
  if (text === null) return;
  let l0;
  try {
    l0 = JSON.parse(text);
  } catch {
    return;
  }
  if (!Array.isArray(l0)) return;

  const stems = new Set(
    l0.filter((item) => item && typeof item.id === "string").map((item) => l0ProcessedStem(item.id)),
  );

  for (const f of doc.processedFiles ?? []) {
    if (!String(f).endsWith(".md")) continue;
    const stem = basenameNoExt(f);
    if (!stems.has(stem)) {
      issues.push(rec(
        "J-processed-l0-stem",
        "ERROR",
        path.join(docRoot, "processed", f),
        "stem listed in index-l0",
        "missing from L0 (search_docs / get_doc_full will miss)",
      ));
    }
  }

  for (const stem of stems) {
    const target = path.join(docRoot, "processed", `${stem}.md`);
    if (!safeStat(target)) {
      issues.push(rec(
        "J-processed-l0-stem",
        "ERROR",
        target,
        "processed file on disk",
        "missing (L0 entry orphaned)",
      ));
    }
  }
}

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
      "  --platform=forge|fabric|neoforge|quilt|liteloader|rift|all   (default: all)",
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

/**
 * W1-4（2026-09-20）：本表只认 `<platform>_<ver>` 形，**覆盖不到 `forge_javadoc/<ver>`**（无版本前缀，
 * parseIndexName 不解析）⇒ §J（processed ↔ index-l0）与 §S（语义层）对那一族从不执行。
 * 该族的盘上↔索引双向差改由独立门 `assert-javadoc-index-parity.mjs` 承担（含 ORPHAN_DEBT 棘轮与 --selftest）。
 */
function docSubDirs(platform) {
  if (platform === "forge") return ["forge-docs", "extracted", "mappings"];
  if (platform === "fabric") return ["fabric-docs", "fabric-wiki", "mappings"];
  if (platform === "neoforge") return ["neoforge-docs"];
  if (platform === "quilt") return ["quilt-docs"];
  if (platform === "liteloader") return ["liteloader-docs"];
  if (platform === "rift") return ["rift-docs"];
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
  const docSubdir = path.basename(path.dirname(docRoot));
  if (!skipsRawProcessedSet(name, docSubdir) && (doc.rawFiles.length > 0 || doc.processedFiles.length > 0)) {
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

  // J: processed stem ↔ index-l0（Quilt 1.21.11 quilt-mod-json 类问题）
  checkProcessedL0Stem(docRoot, doc, issues);

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
  // heuristic: a `raw` dir containing .txt files in fabric-wiki / liteloader-docs
  // (forge-docs and neoforge-docs raw are .md / .html, wiki raw is .txt)
  const n = String(docRoot ?? "").replace(/\\/g, "/");
  if (n.includes("/fabric-wiki/")) return true;
  if (platform === "liteloader" || n.includes("/liteloader-docs/")) return true;
  return false;
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

const ESCAPE_DECODE = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };

/**
 * S17-T1 采集面（第 33 轮放宽，2026-09-25）：顶层键 occurrence 清单，**与缩进无关**。
 *
 * 旧实现是 `/^ {2}"…":/gm` —— 按「行首恰好 2 个空格」抓条目。第 32 轮 P2 投毒
 * （把 `{2}` 改成 `{9}`）证出该腿对**非 2 空格缩进**的 `_manifest.json` 采集 0 条即
 * 静默放行 = 「恒真于空」伪守卫（本仓点名的形状：检测器认排版形状，而格式并不保证那个形状；
 * 同 mixin config 改名成 `mixins.ghost.json` 那一例）。今日 6 份生产 manifest 全为 2 空格
 * ⇒ 潜伏、非现症，但判据本身站不住。
 *
 * 现在按「字符串态 + 括号深度」扫一遍原文，只收**深度 1**（顶层对象成员）的键 ⇒
 * 缩进几个空格、用 tab、还是整个文件压成一行，都不影响采集。第二机制 = `JSON.parse`
 * 的顶层唯一键集（见 `manifestKeyCensus`），两机制交叉核；缩进不再参与任何判据。
 * 纯函数、可投毒（`test-audit-data.mjs :: testManifestDupKeyLeg` 六组形状夹具）。
 */
export function collectTopLevelJsonKeys(text) {
  const keys = [];
  const s = String(text ?? "");
  let depth = 0;
  let inStr = false;
  let esc = false;
  let strDepth = 0;
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) {
        esc = false;
        // 解码转义：JSON 认为 `"a\"b"` 与 `"a\u0022b"` 是**同一个键**，
        // 保留原文（旧正则的做法）会漏判这种等价重复，也会让第二机制
        // （`JSON.parse` 的顶层键集，已是解码后的形态）与本采集器对不上号。
        if (ch === "u") {
          const hex = s.slice(i + 1, i + 5);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) { cur += String.fromCharCode(parseInt(hex, 16)); i += 4; continue; }
          cur += ch;
          continue;
        }
        cur += ESCAPE_DECODE[ch] ?? ch;
        continue;
      }
      if (ch === "\\") { esc = true; continue; }
      if (ch === '"') {
        inStr = false;
        let j = i + 1;
        while (j < s.length && (s[j] === " " || s[j] === "\t" || s[j] === "\n" || s[j] === "\r")) j++;
        if (strDepth === 1 && s[j] === ":") keys.push(cur);
        continue;
      }
      cur += ch;
      continue;
    }
    if (ch === '"') { inStr = true; strDepth = depth; cur = ""; continue; }
    if (ch === "{" || ch === "[") { depth += 1; continue; }
    if (ch === "}" || ch === "]") { depth -= 1; continue; }
  }
  return keys;
}

/**
 * 键 census（纯函数，可投毒）。两机制：
 *   ① 原始扫描 `collectTopLevelJsonKeys` ⇒ occurrence 序列（含重复）；
 *   ② `JSON.parse` 顶层键 ⇒ 唯一集（last-wins 之后的实况，正是它把重复吞掉的那一步）。
 * `collectorZero` = ① 采到 0 条 ⇒ 判据无对象，必须由调用方判红（禁止静默绿）。
 * `parserMismatch` = ① 的唯一集 ≠ ② 的键集 ⇒ 采集器与解析器对「顶层有哪些键」不一致。
 */
export function manifestKeyCensus(text) {
  const occurrences = collectTopLevelJsonKeys(text);
  const seen = new Set();
  const dupKeys = [];
  for (const k of occurrences) {
    if (seen.has(k)) { if (!dupKeys.includes(k)) dupKeys.push(k); }
    else seen.add(k);
  }
  let parserKeys = null;
  let parseError = null;
  try {
    const obj = JSON.parse(text);
    parserKeys = obj && typeof obj === "object" ? Object.keys(obj) : null;
  } catch (e) {
    parseError = e.message;
  }
  const parserKeyCount = Array.isArray(parserKeys) ? parserKeys.length : null;
  return {
    occurrences,
    uniqueKeys: [...seen],
    dupKeys,
    parserKeyCount,
    collectorZero: occurrences.length === 0,
    parserMismatch:
      parserKeyCount !== null && parserKeyCount !== seen.size
      || (Array.isArray(parserKeys) && parserKeys.some((k) => !seen.has(k))),
    parseError,
  };
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
  // S17-T1（第 11 轮立腿，第 33 轮 2026-09-25 放宽采集面）：JSON.parse 对重复键**静默后吃前**
  // （last-wins），所以 forge_1.20.1 曾以 raw 73 键 / 唯一 71 的状态把两条 recipes 重复条目
  // 一路带进审计还全绿 —— 写方（历史一次性 fetch 脚本）已不在盘上，无法在写侧去重，
  // 就在读侧永久判红。仍按**原始文本**数键、不靠 parse 结果当计数；但采集器从「行首 2 空格」
  // 换成深度/字符串态扫描（`collectTopLevelJsonKeys`），并与 JSON.parse 的顶层唯一键集交叉核。
  const census = manifestKeyCensus(text);
  if (census.collectorZero) {
    issues.push(rec(
      "G-manifest-collector-zero",
      "ERROR",
      manifestPath,
      "原始扫描至少采到 1 个顶层键",
      `COLLECTOR_RETURNED_ZERO：缩进无关的顶层键扫描采到 0 条（JSON.parse 侧顶层键 ${census.parserKeyCount ?? "n/a"} 个）⇒ 重复键判据此刻没有任何对象可判，禁止静默绿（第 32 轮 P2 证出的「恒真于空」形状）`,
    ));
  }
  if (census.parserMismatch && !census.collectorZero) {
    issues.push(rec(
      "G-manifest-collector-zero",
      "ERROR",
      manifestPath,
      `两机制对顶层键集一致（扫描唯一集 ${census.uniqueKeys.length}）`,
      `MECHANISM_DISAGREE：原始扫描唯一键 ${census.uniqueKeys.length} 个 vs JSON.parse 顶层键 ${census.parserKeyCount} 个 ⇒ 采集器与本档形状（顶层非 plain object？字符串态漏判？）已失配，判据覆盖面在退化`
      + (census.parseError ? `（parse error: ${census.parseError}）` : ""),
    ));
  }
  if (census.dupKeys.length > 0) {
    issues.push(rec(
      "G-manifest-dup-key",
      "ERROR",
      manifestPath,
      `unique top-level keys (${census.uniqueKeys.length})`,
      `raw key occurrences ${census.occurrences.length}; duplicated: ${census.dupKeys.join(", ")} —— 写方必须在写出前按键去重（重复键会被 JSON.parse last-wins 静默吞并）`,
    ));
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

function gitPathToFilename(gitPath) {
  return String(gitPath || "").replace(/\//g, "_");
}

function checkHollowMetaPages(platform, versionDir, version, obj, metaPath, issues) {
  const pages = obj?.meta?.docs?.pages ?? obj?.docs?.pages;
  if (!Array.isArray(pages)) return;
  const subdirs = docSubDirs(platform).filter((s) => s.endsWith("-docs"));
  const subdir = subdirs[0];
  if (!subdir) return;
  const doc = listDocsIndexes(versionDir, subdir, version);
  const rawCount = (doc.rawFiles ?? []).filter((f) => f && !f.startsWith(".")).length;
  if (pages.length > 0 && rawCount === 0) {
    issues.push(rec(
      "A-hollow-meta-pages",
      "ERROR",
      metaPath,
      "meta.pages empty or equal to raw count",
      `pages=${pages.length} raw=0`,
    ));
  }
  const l0Path = path.join(doc.docRoot, "index-l0.json");
  const l0text = safeReadFile(l0Path);
  if (l0text !== null) {
    try {
      const arr = JSON.parse(l0text);
      if (Array.isArray(arr) && arr.length === 0 && pages.length > 0) {
        issues.push(rec(
          "A-hollow-index-l0",
          "ERROR",
          l0Path,
          "index-l0 matches meta.pages (empty iff no docs)",
          `index-l0=[] meta.pages=${pages.length}`,
        ));
      }
    } catch {
      /* parse errors handled in D-index-parse */
    }
  }
  const failPath = path.join(doc.docRoot, "failures.json");
  const failText = safeReadFile(failPath);
  if (failText === null) return;
  let failObj;
  try { failObj = JSON.parse(failText); } catch { return; }
  const fails = Array.isArray(failObj) ? failObj : failObj.failures;
  if (!Array.isArray(fails)) return;
  const processed = new Set(doc.processedFiles ?? []);
  for (const f of fails) {
    if (!f || typeof f !== "object") continue;
    const id = String(f.id ?? "");
    const filename = f.filename || gitPathToFilename(f.gitPath);
    const hit = [...processed].some((name) => {
      if (filename && name === filename) return true;
      if (id && name.replace(/_/g, "-").includes(id)) return true;
      if (filename && name.includes(filename.replace(/\.md$/, ""))) return true;
      return false;
    });
    if (hit) {
      issues.push(rec(
        "A-false-failure",
        "ERROR",
        failPath,
        "failures.json id absent from processed",
        `id=${id || filename} already in processed`,
      ));
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
    checkHollowMetaPages(platform, versionDir, version, obj, metaPath, issues);
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
  // pathname 在非 ASCII 路径下是百分号编码（桌面 → %E6%A1%8C%E9%9D%A2），
  // 手搓 replace 会得到不存在的编码路径 → 默认 data-root 失效。必须 fileURLToPath。
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
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
  // S17-T2（第 33 轮，2026-09-25）：`scanned=0` 必须是红，不是「没什么可查 ⇒ 过」。
  // 旧行为 = 数据根不存在 / `--platform`+`--version` 拼错 / `MC_SKILL_DATA` 没指对 时，
  // 本审计什么也不看、`counts.ERROR=0` ⇒ **exit 0**（实测 `--data-root=<不存在>` 与
  // `--platform=forge --version=9.9.9` 均 rc=0，payload `scanned:[]`）。ERROR→exit(1)
  // 那条腿本身是真门（投毒夹具 rc=1，见 mcp-server/test-audit-data.mjs），假绿的是这一条空跑腿。
  if (targets.length === 0) {
    all.push(rec(
      "Z-scanned-zero",
      "ERROR",
      dataRoot,
      "至少扫到 1 个 `<platform>_<version>` 索引目录",
      `COLLECTOR_RETURNED_ZERO：scanned=0（platform=${opts.platform}${opts.version ? ` version=${opts.version}` : ""}）⇒ 数据根缺失或过滤器无命中，本审计对本档 0 覆盖，禁止把它当「查过且干净」`,
    ));
  }
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
    const here = fileURLToPath(import.meta.url);
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
