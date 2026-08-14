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
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath, pathToFileURL } from "url";

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

function extractClasses(javaText, limit = 30) {
  const stripped = javaText.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
  const pkg = stripped.match(/^\s*package\s+([a-zA-Z0-9_.]+)\s*;/m)?.[1] ?? "";
  const classMatch = stripped.match(/\b(?:class|interface|enum|record)\s+([A-Za-z_][A-Za-z0-9_]*)/);
  if (!classMatch) return null;
  const methods = [];
  const re = /(?:public|protected)\s+(?:static\s+)?(?:default\s+)?(?:[\w.<>,?\[\]\s]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  let m;
  while ((m = re.exec(stripped)) && methods.length < limit) {
    if (m[1] !== classMatch[1]) methods.push(m[1]);
  }
  return {
    fqcn: pkg ? `${pkg}.${classMatch[1]}` : classMatch[1],
    apiStatusInternal: /@ApiStatus\.Internal/.test(javaText),
    environment: /@Environment\b|@OnlyIn\b/.test(javaText),
    methods: [...new Set(methods)].slice(0, 20),
  };
}

function walkJava(dir, acc = [], limit = 400) {
  if (!existsSync(dir) || acc.length >= limit) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (acc.length >= limit) break;
    const full = join(dir, e.name);
    if (e.isDirectory()) walkJava(full, acc, limit);
    else if (e.name.endsWith(".java")) acc.push(full);
  }
  return acc;
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

const summaries = [];
for (const name of readdirSync(JAR_DIR).filter((f) => f.endsWith(".jar"))) {
  const jarPath = join(JAR_DIR, name);
  const inferred = inferMappings(name);
  const meta = analyzeModJar(jarPath);
  const result = await decompileModJar({
    jarPath,
    version: inferred.version,
    mapping: inferred.mapping === "yarn" ? "yarn" : "mojmap",
  });
  const classes = [];
  if (result.outputDir && existsSync(result.outputDir)) {
    for (const jf of walkJava(result.outputDir)) {
      const rec = extractClasses(readFileSync(jf, "utf8"));
      if (rec) classes.push(rec);
    }
  }
  const summary = {
    file: name,
    mappingsVersion: inferred.mappingsVersion,
    mapping: inferred.mapping,
    version: inferred.version,
    loaders: meta.loaders,
    modId: meta.modId,
    decompile: {
      found: result.found,
      outputDir: result.outputDir,
      javaFileCount: result.javaFileCount,
      error: result.error,
    },
    classCount: classes.length,
    classes: classes.slice(0, 200),
  };
  if (!summary.mappingsVersion) {
    summary.invalid = true;
    summary.note = "缺少 mappingsVersion，视为无效，禁止写进规则";
  }
  summaries.push(summary);
  writeFileSync(join(OUT, basename(name, ".jar") + ".json"), JSON.stringify(summary, null, 2), "utf8");
}

writeFileSync(join(OUT, "index.json"), JSON.stringify({ cache: CACHE, jars: summaries }, null, 2), "utf8");
writeFileSync(
  join(OUT, "status.json"),
  JSON.stringify({ ok: true, decompiled: summaries.map((s) => s.file), cache: CACHE }, null, 2),
  "utf8",
);
console.log(`decompiled ${summaries.length} jars → ${OUT} (java stays in ${CACHE})`);
