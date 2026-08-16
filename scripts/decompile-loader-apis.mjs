#!/usr/bin/env node
/**
 * 反编译加载器/API jar → mcp-server/data/loader-api-summaries/
 * 缓存只写 $MC_SKILL_CACHE（未设时脚本默认 D:\mc-skill-temp）。.java 不入库。
 *
 * 用法：
 *   node scripts/decompile-loader-apis.mjs
 *   将 jar 放到 $MC_SKILL_CACHE/loader-jars/<key>.jar
 *   key 例：1.20.4-neoforge、1.21.1-neoforge、26.1-neoforge、1.20.4-fabric-api
 *
 * 摘要 JSON 必须含 mappingsVersion，否则视为无效、禁止写进规则。
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createHash } from "crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = process.env.MC_SKILL_CACHE || "D:\\mc-skill-temp";
const JAR_DIR = join(CACHE, "loader-jars");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");

mkdirSync(OUT, { recursive: true });
mkdirSync(JAR_DIR, { recursive: true });

const NOTE = `# loader-api-summaries

反编译缓存目录：**${CACHE}**（禁止写仓库根）。
MCP 运行时（resolveCacheRoot）与本脚本都读 \`MC_SKILL_CACHE\`。不设则可能分家（MCP 默认 APPDATA，脚本默认 D:\\mc-skill-temp）。请设成同一路径。

把加载器 jar 放到 \`${JAR_DIR}\` 后重新运行本脚本。

键形如 \`1.20.4-neoforge\`、\`26.1-neoforge\`、\`1.20.4-fabric-api\`。
**不要**把摘要合并进 Parchment query_api。摘要必须含 mappingsVersion。
`;
writeFileSync(join(OUT, "README.md"), NOTE, "utf8");

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

if (!existsSync(JAR_DIR) || readdirSync(JAR_DIR).filter((f) => f.endsWith(".jar")).length === 0) {
  writeFileSync(
    join(OUT, "status.json"),
    JSON.stringify(
      {
        ok: true,
        decompiled: [],
        skipped: "no jars in " + JAR_DIR,
        cache: CACHE,
        note: "Place loader API jars then re-run. VineFlower via decompile_mod_jar.",
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log("no loader jars; wrote README + status.json");
  process.exit(0);
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
const { extractCompilationUnit } = await import(
  pathToFileURL(join(ROOT, "mcp-server", "dist", "loader-api", "extract.js")).href
);

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
const priorIndex = existsSync(indexPath)
  ? (() => {
      try {
        return JSON.parse(readFileSync(indexPath, "utf8"));
      } catch {
        return { cache: CACHE, jars: [] };
      }
    })()
  : { cache: CACHE, jars: [] };

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
    const invalid = {
      file: name,
      mappingsVersion: null,
      invalid: true,
      note: "缺少 mappingsVersion，视为无效，禁止写进规则",
    };
    summaries.push(invalid);
    writeFileSync(join(OUT, basename(name, ".jar") + ".json"), JSON.stringify(invalid, null, 2), "utf8");
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
      if (Array.isArray(prev.classes) && prev.classes.length && (prev.sourceJarSha256 === jarSha || !prev.sourceJarSha256)) {
        if (!prev.sourceJarSha256) {
          prev.sourceJarSha256 = jarSha;
          prev.source = prev.source || "official";
          writeFileSync(existingPath, JSON.stringify(prev, null, 2), "utf8");
        }
        summaries.push({ ...prev, file: name, source: prev.source || "official" });
        console.log("idempotent keep", name, "classes", prev.classes.length);
        continue;
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
      for (const rec of recs) classes.push({ ...rec, file: jf.replace(/\\/g, "/") });
    }
    decompile = {
      found: true,
      fromSourcesJar: true,
      javaFileCount: javaEntries.length,
      outputDir: srcOut,
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
        for (const rec of recs) classes.push({ ...rec, file: jf.replace(/\\/g, "/") });
      }
    }
    decompile = {
      found: result.found,
      outputDir: result.outputDir,
      javaFileCount: result.javaFileCount,
      error: result.error,
      slim: decompileInput === slimPath,
      priorityClassCount: priority.length,
    };
  }
  const summary = {
    file: name,
    mappingsVersion: inferred.mappingsVersion,
    mappingsSource: inferred.mappingsSource,
    mapping: inferred.mapping,
    version: inferred.version,
    sourceJarSha256: jarSha,
    source: "official",
    loaders: meta.loaders,
    modId: meta.modId,
    decompile,
    classCount: classes.length,
    fqcnIndexCount: fqcnIndex.length,
    fqcnIndex: fqcnIndex.filter((fq) => fq && !/\$[0-9]/.test(fq)),
    classes,
  };
  summaries.push(summary);
  writeFileSync(join(OUT, basename(name, ".jar") + ".json"), JSON.stringify(summary, null, 2), "utf8");
  writeFileSync(
    `${jarPath}.sidecar`,
    JSON.stringify(
      {
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

const byFile = new Map(
  (priorIndex.jars || []).filter((j) => j?.file).map((j) => [j.file, j]),
);
for (const s of summaries) {
  if (!s.file || s.skipped === "user-ingest-only") continue;
  byFile.set(s.file, {
    file: s.file,
    mappingsVersion: s.mappingsVersion,
    mappingsSource: s.mappingsSource,
    classCount: s.classCount,
    fqcnIndexCount: s.fqcnIndexCount,
    sourceJarSha256: s.sourceJarSha256,
    source: s.source || "official",
    fromSourcesJar: s.decompile?.fromSourcesJar,
    invalid: s.invalid || false,
  });
}
writeFileSync(
  join(OUT, "index.json"),
  JSON.stringify(
    { cache: CACHE, jars: [...byFile.values()].sort((a, b) => String(a.file).localeCompare(String(b.file))) },
    null,
    2,
  ),
  "utf8",
);
const mappingsVersion = Object.fromEntries(
  summaries.filter((s) => s.mappingsVersion && !s.invalid).map((s) => [s.file.replace(/\.jar$/i, ""), s.mappingsVersion]),
);
writeFileSync(
  join(OUT, "status.json"),
  JSON.stringify(
    {
      ok: true,
      decompiled: summaries.map((s) => s.file),
      mappingsVersion,
      cache: CACHE,
      invalid: summaries.filter((s) => s.invalid).map((s) => s.file),
    },
    null,
    2,
  ),
  "utf8",
);
console.log(`decompiled ${summaries.length} jars → ${OUT} (java stays in ${CACHE})`);
