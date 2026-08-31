#!/usr/bin/env node
/**
 * 反编译加载器/API jar → mcp-server/data/loader-api-summaries/
 * 缓存只写 $MC_SKILL_CACHE（未设时用 os.tmpdir()/mc-skill-cache）。.java 不入库。
 *
 * 用法：
 *   node scripts/decompile-loader-apis.mjs
 *   将 jar 放到 $MC_SKILL_CACHE/loader-jars/<key>.jar
 *   key 例：1.20.4-neoforge、1.21.1-neoforge、26.1-neoforge、1.20.4-fabric-api
 *
 * 摘要 JSON 必须含 mappingsVersion，否则视为无效、禁止写进规则。
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync, statSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createHash } from "crypto";
import os from "os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = process.env.MC_SKILL_CACHE || join(os.tmpdir(), "mc-skill-cache");
const JAR_DIR = join(CACHE, "loader-jars");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");
const INDEX_ONLY = process.argv.includes("--index-only");
const WRITE = process.argv.includes("--write");
if (!INDEX_ONLY && !WRITE) {
  console.log("[decompile-loader-apis] dry-run：不会覆盖摘要。确认后加 --write。");
}

mkdirSync(OUT, { recursive: true });
mkdirSync(JAR_DIR, { recursive: true });

const NOTE = `# loader-api-summaries

反编译缓存目录：**$MC_SKILL_CACHE**（禁止写仓库根）。
MCP 运行时（resolveCacheRoot）与本脚本都读 \`MC_SKILL_CACHE\`。不设则可能分家（MCP 默认 APPDATA，脚本默认 os.tmpdir()/mc-skill-cache请设成同一路径。

把加载器 jar 放到 \`$MC_SKILL_CACHE/loader-jars\` 后重新运行本脚本。

键形如 \`1.20.4-neoforge\`、\`26.1-neoforge\`、\`1.20.4-fabric-api\`。
**不要**把摘要合并进 Parchment query_api。摘要必须含 mappingsVersion。
`;
if (WRITE) {
  writeFileSync(join(OUT, "README.md"), NOTE, "utf8");
}

function inferMappings(fileBase) {
  const name = fileBase.replace(/\.jar$/i, "").toLowerCase();
  if (name.includes("26.1") || name.includes("26.2")) {
    return { mapping: "mojmap", mappingsVersion: "mojmap-unobfuscated-26.x", version: name.match(/26\.\d+(?:\.\d+)?/)?.[0] };
  }
  if (name.includes("fabric") || name.includes("yarn")) {
    const ver = name.match(/1\.\d+(?:\.\d+)?/)?.[0] ?? "1.20.4";
    return { mapping: "yarn", mappingsVersion: `yarn-${ver}`, version: ver };
  }
  if (name.includes("forge") && !name.includes("neoforge")) {
    const ver = name.match(/1\.\d+(?:\.\d+)?/)?.[0] ?? "1.20.4";
    return { mapping: "mcp", mappingsVersion: `mcp-${ver}`, version: ver };
  }
  const ver = name.match(/26\.\d+(?:\.\d+)?/)?.[0] ?? name.match(/1\.\d+(?:\.\d+)?/)?.[0] ?? "1.20.4";
  return { mapping: "mojmap", mappingsVersion: `mojmap-neoform-${ver}`, version: ver };
}

function mappingsFromGradleProps(txt) {
  const parchmentMc = txt.match(/parchment_minecraft_version\s*=\s*(\S+)/)?.[1];
  const parchmentMap = txt.match(/parchment_mappings_version\s*=\s*(\S+)/)?.[1];
  const neoForm = txt.match(/neo_form_version\s*=\s*(\S+)/)?.[1];
  const mappingsField = txt.match(/^mappings\s*=\s*(\S+)/m)?.[1];
  const channel = txt.match(/mapping_channel\s*=\s*(\S+)/)?.[1];
  const mapVer = txt.match(/mapping_version\s*=\s*(\S+)/)?.[1];
  if (parchmentMc && parchmentMap) return `parchment-${parchmentMc}-${parchmentMap}`;
  if (neoForm) return `mojmap-neoform-${neoForm}`;
  if (channel && mapVer) return `${channel}-${mapVer}`;
  if (mappingsField) return mappingsField;
  return null;
}

function mappingsFromManifest(mf) {
  if (!mf) return null;
  const channel = mf.match(/Mapping-Channel:\s*(\S+)/i)?.[1];
  const mapVer = mf.match(/Mapping-Version:\s*(\S+)/i)?.[1];
  if (channel && mapVer) return `${channel}-${mapVer}`;
  return null;
}

async function resolveMappings(name, jarPath) {
  const jsonSide = `${jarPath}.sidecar`;
  if (existsSync(jsonSide)) {
    try {
      const j = JSON.parse(readFileSync(jsonSide, "utf8"));
      if (j.mappingsVersion) {
        return {
          ...inferMappings(name),
          mappingsVersion: j.mappingsVersion,
          mappingsSource: j.mappingsSource || "json-sidecar",
        };
      }
    } catch {
      /* fall through */
    }
  }
  const side = `${jarPath}.mappings.json`;
  if (existsSync(side)) {
    try {
      const j = JSON.parse(readFileSync(side, "utf8"));
      if (j.mappingsVersion) {
        return { ...inferMappings(name), mappingsVersion: j.mappingsVersion, mappingsSource: "gradle.properties-sidecar" };
      }
    } catch {
      /* fall through */
    }
  }
  const gp = join(dirname(jarPath), "gradle.properties");
  if (existsSync(gp)) {
    const mv = mappingsFromGradleProps(readFileSync(gp, "utf8"));
    if (mv) return { ...inferMappings(name), mappingsVersion: mv, mappingsSource: "gradle.properties" };
  }
  const inferred = inferMappings(name);
  try {
    const { readZip } = await import(pathToFileURL(join(ROOT, "mcp-server", "dist", "decompile", "zip-util.js")).href);
    const entries = readZip(readFileSync(jarPath));
    const mfBuf = entries.get("META-INF/MANIFEST.MF") || entries.get("meta-inf/manifest.mf");
    if (mfBuf) {
      const mv = mappingsFromManifest(mfBuf.toString("utf8"));
      if (mv) return { ...inferred, mappingsVersion: mv, mappingsSource: "MANIFEST.MF" };
    }
  } catch {
    /* infer fallback */
  }
  if (inferred.mappingsVersion) return { ...inferred, mappingsSource: "inferMappings(filename)" };
  return { ...inferred, mappingsVersion: null, mappingsSource: "missing" };
}

function extractClasses(javaText, fileHint) {
  return extractCompilationUnit(javaText, fileHint);
}

function sha256File(p) {
  return createHash("sha256").update(readFileSync(p)).digest("hex");
}

function walkJava(dir, acc = [], limit = 8000) {
  if (!existsSync(dir) || acc.length >= limit) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (acc.length >= limit) break;
    const full = join(dir, e.name);
    if (e.isDirectory()) walkJava(full, acc, limit);
    else if (e.name.endsWith(".java")) acc.push(full);
  }
  return acc;
}

function fqcnFromClassPath(name) {
  return name.replace(/\\/g, "/").replace(/\.class$/i, "").replace(/\//g, ".");
}

function isPriorityClass(name) {
  const n = name.replace(/\\/g, "/");
  if (!n.endsWith(".class")) return false;
  return /(?:^|\/)net\/neoforged\/(?:neoforge\/(?:network|registries|event|items?|entity|common)|fml|bus)\//.test(n)
    || /(?:^|\/)net\/minecraftforge\/(?:network|registries|event|items?|common)\//.test(n)
    || /(?:^|\/)org\/quiltmc\/qsl\/(?:registry|lifecycle_events|base)\//.test(n);
}

if (
  !INDEX_ONLY &&
  (!existsSync(JAR_DIR) || readdirSync(JAR_DIR).filter((f) => f.endsWith(".jar")).length === 0)
) {
  console.error(`no loader jars in ${JAR_DIR}; not overwriting status.json / index.json`);
  process.exit(1);
}

const distDecompile = join(ROOT, "mcp-server", "dist", "decompile", "services", "mod-decompile.js");
if (!existsSync(distDecompile)) {
  console.error("need mcp-server dist: cd mcp-server && npm run build");
  process.exit(1);
}

const { decompileModJar } = await import(pathToFileURL(distDecompile).href);
const { analyzeModJar } = await import(
  pathToFileURL(join(ROOT, "mcp-server", "dist", "decompile", "services", "mod-analyzer.js")).href
);
const { readZip, listZipEntries } = await import(
  pathToFileURL(join(ROOT, "mcp-server", "dist", "decompile", "zip-util.js")).href
);
const { createStoreZip } = await import(pathToFileURL(join(ROOT, "mcp-server", "dist", "mdk", "index.js")).href);
const { extractCompilationUnit, isThinLoaderSummary, repoSafeSourcePath, fqcnFromSourceHint } = await import(
  pathToFileURL(join(ROOT, "mcp-server", "dist", "loader-api", "extract.js")).href
);
const { dedupeLoaderClasses } = await import(
  pathToFileURL(join(ROOT, "mcp-server", "dist", "loader-api", "store.js")).href
);

function redactEmbeddedPaths(text) {
  if (!text) return text;
  return String(text)
    .replace(/[A-Za-z]:[\\/][^\s"']+/g, "[redacted-path]")
    .replace(/mc-skill-temp[^\s"']*/gi, "[redacted-path]");
}

function upgradeStringMethods(classes) {
  return (classes ?? []).map((c) => ({
    ...c,
    file: repoSafeSourcePath(c.file) ?? c.file,
    methods: Array.isArray(c.methods)
      ? c.methods.map((m) =>
          typeof m === "string"
            ? { name: m, returnType: "?", parameters: [], modifiers: [], signature: `${m}(...)` }
            : m,
        )
      : [],
    parseError: c.parseError ? redactEmbeddedPaths(c.parseError) : c.parseError,
  }));
}

function sanitizeSummary(summary, key) {
  const classes = upgradeStringMethods(summary.classes ?? []).map((c) => {
    const fq = String(c.fqcn || "");
    if (/mc-skill-temp|[A-Za-z]:[\\/]/.test(fq) || /\.java$/i.test(fq)) {
      const next = fqcnFromSourceHint(fq) || fqcnFromSourceHint(c.file) || fqcnFromSourceHint(c.sourcePath);
      if (next) {
        const simple = next.split(".").pop() || c.simpleName;
        return { ...c, fqcn: next, simpleName: c.simpleName && c.simpleName !== "unknown" ? c.simpleName : simple };
      }
    }
    return c;
  });
  const decompile = summary.decompile ? { ...summary.decompile } : undefined;
  if (decompile) {
    delete decompile.outputDir;
    if (key) decompile.outputDirHint = `$MC_SKILL_CACHE/loader-api-src/${key}`;
  }
  const out = { ...summary, classes, classCount: classes.length };
  if (decompile) out.decompile = decompile;
  delete out.cacheDir;
  if (typeof out.file === "string" && /[A-Za-z]:[\\/]/.test(out.file)) {
    out.file = `${key}.jar`;
  }
  return out;
}

const USER_INGEST_KEYS = new Set([
  "1.12.2-liteloader",
  "1.10.2-liteloader",
  "1.8.9-liteloader",
  "1.13.2-rift",
  "1.6.4-modloader",
  "1.5.2-modloader",
  "1.2.5-modloader",
]);

const summaries = [];
const slimDir = join(CACHE, "loader-jars-slim");
mkdirSync(slimDir, { recursive: true });

const indexPath = join(OUT, "index.json");

const WANTED_FABRIC_API = [
  "1.14.4-fabric-api",
  "1.16.5-fabric-api",
  "1.17.1-fabric-api",
  "1.18.2-fabric-api",
  "1.19.4-fabric-api",
  "1.20.1-fabric-api",
  "1.20.4-fabric-api",
  "1.21.1-fabric-api",
  "1.21.3-fabric-api",
  "1.21.11-fabric-api",
  "26.1.2-fabric-api",
];

function rebuildCatalogFromDisk() {
  const skip = new Set([
    "index.json",
    "status.json",
    "extracted-classes.json",
    "validate-rules-last.json",
    "clone-audit-last.json",
    "fetch-jars-last.json",
    "pin-mdk-last.json",
    "fetch-loader-api-sources-last.json",
    "skipped-ingest.json",
  ]);
  const jars = [];
  const mappingsVersion = {};
  const decompiled = [];
  const invalid = [];
  const present = new Set();
  for (const name of readdirSync(OUT).filter(
    (n) => n.endsWith(".json") && !skip.has(n) && !n.endsWith("-last.json"),
  )) {
    const jsonPath = join(OUT, name);
    let j;
    try {
      j = JSON.parse(readFileSync(jsonPath, "utf8"));
    } catch {
      continue;
    }
    const key = name.replace(/\.json$/i, "");
    if (Array.isArray(j.classes) && j.classes.length) {
      const rewritten = j.classes.map((c) => {
        let nextC = c;
        const fq = String(c.fqcn || "");
        if (/mc-skill-temp|[A-Za-z]:[\\/]/.test(fq) || /\.java$/i.test(fq)) {
          const next = fqcnFromSourceHint(fq) || fqcnFromSourceHint(c.file) || fqcnFromSourceHint(c.sourcePath);
          if (next) {
            const simple = next.split(".").pop() || c.simpleName;
            nextC = { ...c, fqcn: next, simpleName: c.simpleName && c.simpleName !== "unknown" ? c.simpleName : simple };
          }
        }
        if (nextC.parseError) {
          const redacted = redactEmbeddedPaths(nextC.parseError);
          if (redacted !== nextC.parseError) nextC = { ...nextC, parseError: redacted };
        }
        return nextC;
      });
      const next = dedupeLoaderClasses(rewritten);
      const classCount = next.length;
      const fqcnIndexCount = (j.fqcnIndex || []).length;
      const changed =
        next.length !== j.classes.length ||
        j.classCount !== classCount ||
        j.fqcnIndexCount !== fqcnIndexCount ||
        rewritten.some((c, i) => c.fqcn !== j.classes[i]?.fqcn || c.parseError !== j.classes[i]?.parseError);
      j.classes = next;
      j.classCount = classCount;
      j.fqcnIndexCount = fqcnIndexCount;
      if (changed) writeFileSync(jsonPath, JSON.stringify(j, null, 2), "utf8");
    }
    const file = j.file || key;
    present.add(String(file).replace(/\.jar$/i, ""));
    present.add(key);
    jars.push({
      file,
      mappingsVersion: j.mappingsVersion,
      mappingsSource: j.mappingsSource,
      classCount: j.classCount ?? j.classes?.length ?? 0,
      fqcnIndexCount: j.fqcnIndexCount ?? j.fqcnIndex?.length ?? 0,
      sourceJarSha256: j.sourceJarSha256,
      source: j.source || "official",
      fromSourcesJar: j.decompile?.fromSourcesJar,
      invalid: j.invalid || false,
    });
    decompiled.push(file);
    if (j.mappingsVersion) mappingsVersion[key] = j.mappingsVersion;
    if (j.invalid) invalid.push(file);
  }
  jars.sort((a, b) => String(a.file).localeCompare(String(b.file)));
  const notIndexed = WANTED_FABRIC_API.filter((k) => !present.has(k)).map((key) => ({
    key,
    reason: "LOADER_API_NOT_INDEXED：该档文档/MDK 坐标未能拉到 sources（常见 maven 404），禁止借邻版 jar",
  }));
  writeFileSync(
    indexPath,
    JSON.stringify({ cache: "$MC_SKILL_CACHE", jars, notIndexed }, null, 2),
    "utf8",
  );
  writeFileSync(
    join(OUT, "status.json"),
    JSON.stringify(
      {
        ok: true,
        decompiled,
        mappingsVersion,
        cache: "$MC_SKILL_CACHE",
        invalid,
        notIndexed,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`catalog ${jars.length} summaries → ${OUT} (java stays in $MC_SKILL_CACHE)`);
}

if (!INDEX_ONLY) {
for (const name of readdirSync(JAR_DIR).filter((f) => f.endsWith(".jar") && !f.startsWith("_") && !f.includes("-slim"))) {
  const jarPath = join(JAR_DIR, name);
  const key = basename(name, ".jar");
  if (USER_INGEST_KEYS.has(key)) {
    summaries.push({
      file: name,
      skipped: "user-ingest-only",
      invalid: true,
      note: "LiteLoader/Rift/ModLoader 禁止写入仓库 data/，请 ingest_loader_api 写 cache overlay",
    });
    continue;
  }
  const inferred = await resolveMappings(name, jarPath);
  if (!inferred.mappingsVersion) {
    const existingPath = join(OUT, `${key}.json`);
    const invalid = {
      file: name,
      mappingsVersion: null,
      invalid: true,
      note: "缺少 mappingsVersion，视为无效，禁止写进规则",
    };
    summaries.push(invalid);
    if (existsSync(existingPath)) {
      console.error("skip overwrite of existing summary (missing mappingsVersion):", existingPath);
      continue;
    }
    if (!WRITE) {
      console.log("dry-run skip invalid write:", key);
      continue;
    }
    writeFileSync(existingPath, JSON.stringify(invalid, null, 2), "utf8");
    continue;
  }
  const jarSha = sha256File(jarPath);
  const existingPath = join(OUT, `${key}.json`);
  if (existsSync(existingPath)) {
    try {
      const prev = JSON.parse(readFileSync(existingPath, "utf8"));
      if (prev.sourceJarSha256 && prev.sourceJarSha256 !== jarSha) {
        summaries.push({
          file: name,
          invalid: true,
          skipped: "CACHE_STALE",
          note: "jar sha256 与摘要不一致，拒绝静默重抽",
        });
        console.error("CACHE_STALE", name, prev.sourceJarSha256, jarSha);
        continue;
      }
      if (prev.sourceJarSha256 && prev.mappingsVersion && prev.mappingsVersion !== inferred.mappingsVersion) {
        summaries.push({
          file: name,
          invalid: true,
          skipped: "CACHE_STALE",
          note: `sidecar/摘要 mappings ${prev.mappingsVersion} ≠ ${inferred.mappingsVersion}`,
        });
        console.error("CACHE_STALE mappings", name);
        continue;
      }
      if (
        Array.isArray(prev.classes) &&
        prev.classes.length &&
        (prev.sourceJarSha256 === jarSha || !prev.sourceJarSha256) &&
        !isThinLoaderSummary(prev)
      ) {
        const kept = sanitizeSummary(
          {
            ...prev,
            sourceJarSha256: prev.sourceJarSha256 || jarSha,
            source: prev.source || "official",
          },
          key,
        );
        writeFileSync(existingPath, JSON.stringify(kept, null, 2), "utf8");
        summaries.push({ ...kept, file: name });
        console.log("idempotent keep", name, "classes", kept.classes.length);
        continue;
      }
      if (isThinLoaderSummary(prev)) {
        console.log("re-extract thin summary", name, "classes", prev.classes?.length, "index", prev.fqcnIndex?.length);
      }
    } catch {
      /* rewrite */
    }
  }
  const meta = analyzeModJar(jarPath);
  const buf = readFileSync(jarPath);
  let names = [];
  try {
    names = listZipEntries(buf);
  } catch {
    names = [];
  }
  const fqcnIndex = names
    .filter((n) => (n.endsWith(".class") || n.endsWith(".java")) && !/\$[0-9]/.test(n))
    .map((n) => fqcnFromClassPath(n.replace(/\.java$/i, ".class")))
    .filter((fq) => /^(net\.neoforged|net\.minecraftforge|net\.fabricmc|org\.quiltmc)/.test(fq));
  const entries = readZip(buf);
  const javaEntries = [...entries.entries()].filter(
    ([n]) =>
      n.endsWith(".java") &&
      /(?:^|\/)(?:net\/(?:neoforged|minecraftforge|fabricmc)|org\/quiltmc)\//.test(n.replace(/\\/g, "/")),
  );
  const classes = [];
  const srcOut = join(CACHE, "loader-api-src", basename(name, ".jar"));
  mkdirSync(srcOut, { recursive: true });
  let decompile = { found: false, slim: false, fromSourcesJar: false, priorityClassCount: 0 };

  if (javaEntries.length) {
    for (const [n, data] of javaEntries) {
      const dest = join(srcOut, n);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, data);
    }
    for (const jf of walkJava(srcOut)) {
      const recs = extractClasses(readFileSync(jf, "utf8"), jf.replace(/\\/g, "/"));
      for (const rec of recs) {
        const posix = jf.replace(/\\/g, "/");
        if (!/(?:^|\/)(?:net|org|com|cpw)\//i.test(posix) && !/(?:^|\/)(?:net|org|com|cpw)\//i.test(String(rec.file || ""))) {
          continue;
        }
        classes.push({ ...rec, file: repoSafeSourcePath(jf) ?? rec.file });
      }
    }
    decompile = {
      found: true,
      fromSourcesJar: true,
      javaFileCount: javaEntries.length,
      outputDirHint: `$MC_SKILL_CACHE/loader-api-src/${key}`,
      slim: false,
      priorityClassCount: javaEntries.filter(([n]) => isPriorityClass(n.replace(/\.java$/i, ".class"))).length,
    };
  } else {
    const priority = [...entries.entries()].filter(([n]) => isPriorityClass(n)).slice(0, 500);
    const slimPath = join(slimDir, name.replace(/\.jar$/i, "-slim.jar"));
    const decompileInput = priority.length
      ? (writeFileSync(slimPath, createStoreZip(priority.map(([n, data]) => ({ name: n, data })))), slimPath)
      : jarPath;
    const result = await decompileModJar({
      jarPath: decompileInput,
      force: true,
    });
    if (result.outputDir && existsSync(result.outputDir)) {
      try {
        cpSync(result.outputDir, srcOut, { recursive: true });
      } catch {
        /* ignore */
      }
      for (const jf of walkJava(srcOut)) {
        const recs = extractClasses(readFileSync(jf, "utf8"), jf.replace(/\\/g, "/"));
        for (const rec of recs) {
          const posix = jf.replace(/\\/g, "/");
          if (!/(?:^|\/)(?:net|org|com|cpw)\//i.test(posix) && !/(?:^|\/)(?:net|org|com|cpw)\//i.test(String(rec.file || ""))) {
            continue;
          }
          classes.push({ ...rec, file: repoSafeSourcePath(jf) ?? rec.file });
        }
      }
    }
    decompile = {
      found: result.found,
      outputDirHint: `$MC_SKILL_CACHE/loader-api-src/${key}`,
      javaFileCount: result.javaFileCount,
      error: result.error,
      slim: decompileInput === slimPath,
      priorityClassCount: priority.length,
    };
  }
  let sourceTreeMtime;
  try {
    sourceTreeMtime = statSync(jarPath).mtimeMs;
  } catch {
    sourceTreeMtime = undefined;
  }
  const summary = {
    file: name,
    mappingsVersion: inferred.mappingsVersion,
    mappingsSource: inferred.mappingsSource,
    mapping: inferred.mapping,
    version: inferred.version,
    sourceJarSha256: jarSha,
    sourceTreeMtime,
    source: "official",
    loaders: meta.loaders,
    modId: meta.modId,
    decompile,
    classCount: 0,
    fqcnIndexCount: fqcnIndex.length,
    fqcnIndex: fqcnIndex.filter((fq) => fq && !/\$[0-9]/.test(fq)),
    classes: [],
  };
  summary.classes = dedupeLoaderClasses(classes);
  summary.classCount = summary.classes.length;
  summaries.push(summary);
  if (!WRITE) {
    console.log("dry-run skip summary write:", key);
  } else {
    writeFileSync(join(OUT, basename(name, ".jar") + ".json"), JSON.stringify(summary, null, 2), "utf8");
    let prevSide = {};
    try {
      if (existsSync(`${jarPath}.sidecar`)) prevSide = JSON.parse(readFileSync(`${jarPath}.sidecar`, "utf8"));
    } catch {
      prevSide = {};
    }
    writeFileSync(
      `${jarPath}.sidecar`,
      JSON.stringify(
        {
          ...prevSide,
          mappingsVersion: inferred.mappingsVersion,
          mappingsSource: inferred.mappingsSource,
          sourceJarSha256: jarSha,
        },
        null,
        2,
      ),
      "utf8",
    );
  }
}

async function thickenFromClassUrls(jsonPath, key) {
  if (!existsSync(jsonPath)) return null;
  let prev;
  try {
    prev = JSON.parse(readFileSync(jsonPath, "utf8"));
  } catch {
    return null;
  }
  const classes = prev.classes ?? [];
  const withUrl = classes.filter((c) => typeof c.url === "string" && /^https:\/\//.test(c.url));
  if (!withUrl.length) {
    const cleaned = sanitizeSummary(prev, key);
    writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), "utf8");
    return cleaned;
  }
  const next = [];
  for (const c of classes) {
    if (typeof c.url !== "string" || !/^https:\/\//.test(c.url)) {
      next.push(...upgradeStringMethods([c]));
      continue;
    }
    try {
      const r = await fetch(c.url);
      if (!r.ok) {
        next.push(...upgradeStringMethods([c]));
        continue;
      }
      const text = await r.text();
      const recs = extractCompilationUnit(text, c.sourcePath || c.file);
      const hit = recs.find((x) => x.fqcn === c.fqcn) || recs[0];
      if (hit) {
        next.push({
          ...hit,
          url: c.url,
          sourcePath: c.sourcePath,
          file: repoSafeSourcePath(c.sourcePath || hit.file) ?? hit.file,
        });
        for (const extra of recs.filter((x) => x !== hit)) {
          next.push({ ...extra, url: c.url, sourcePath: c.sourcePath });
        }
      } else {
        next.push(...upgradeStringMethods([c]));
      }
    } catch {
      next.push(...upgradeStringMethods([c]));
    }
  }
  const out = sanitizeSummary({ ...prev, classes: next }, key);
  writeFileSync(jsonPath, JSON.stringify(out, null, 2), "utf8");
  console.log("url-thicken", key, "classes", out.classes.length);
  return out;
}

const SKIP_JSON = new Set([
  "index.json",
  "status.json",
  "extracted-classes.json",
  "validate-rules-last.json",
  "clone-audit-last.json",
  "fetch-jars-last.json",
  "pin-mdk-last.json",
  "fetch-loader-api-sources-last.json",
  "skipped-ingest.json",
]);
const processedKeys = new Set(
  summaries.map((s) => String(s.file || "").replace(/\.jar$/i, "")).filter(Boolean),
);
for (const name of readdirSync(OUT).filter((n) => n.endsWith(".json") && !SKIP_JSON.has(n) && !n.endsWith("-last.json"))) {
  const key = name.replace(/\.json$/i, "");
  const jsonPath = join(OUT, name);
  if (processedKeys.has(key)) continue;
  let prev;
  try {
    prev = JSON.parse(readFileSync(jsonPath, "utf8"));
  } catch {
    continue;
  }
  const srcDir = join(CACHE, "loader-api-src", key);
  if (prev.source === "qsl-github-java") {
    const cleaned = sanitizeSummary(prev, key);
    writeFileSync(jsonPath, JSON.stringify(cleaned, null, 2), "utf8");
    summaries.push({ ...cleaned, file: cleaned.file || key });
    processedKeys.add(key);
    continue;
  }
  if (isThinLoaderSummary(prev) && existsSync(srcDir) && !USER_INGEST_KEYS.has(key)) {
    const classes = [];
    for (const jf of walkJava(srcDir)) {
      const recs = extractClasses(readFileSync(jf, "utf8"), jf.replace(/\\/g, "/"));
      for (const rec of recs) classes.push({ ...rec, file: repoSafeSourcePath(jf) ?? rec.file });
    }
    if (classes.length) {
      const out = sanitizeSummary({ ...prev, classes, classCount: classes.length, source: prev.source || "official" }, key);
      writeFileSync(jsonPath, JSON.stringify(out, null, 2), "utf8");
      summaries.push({ ...out, file: prev.file || key });
      processedKeys.add(key);
      console.log("src-tree thicken", key, "classes", classes.length);
      continue;
    }
  }
  const thickened = await thickenFromClassUrls(jsonPath, key);
  if (thickened) {
    summaries.push({ ...thickened, file: thickened.file || key });
    processedKeys.add(key);
  }
}

} // !INDEX_ONLY

rebuildCatalogFromDisk();
