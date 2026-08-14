#!/usr/bin/env node
/**
 * 从 $MC_SKILL_CACHE 反编译结果抽取 FQCN / 方法 / @Environment / @ApiStatus.Internal，
 * 回填核实表 JSON，并扫描规则里出现的类名是否在表内、包是否写错。
 *
 * 不覆盖 00–10 教程正文。cache 为空时跳过（exit 0）。
 *
 * 用法：
 *   node scripts/validate-rules-against-cache.mjs
 *   node scripts/validate-rules-against-cache.mjs --platform=neoforge --version=1.20.4
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = process.env.MC_SKILL_CACHE || "D:\\mc-skill-temp";
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");

const platformArg = process.argv.find((a) => a.startsWith("--platform="))?.split("=")[1];
const versionArg = process.argv.find((a) => a.startsWith("--version="))?.split("=")[1];

function walkJava(dir, acc = [], limit = 8000) {
  if (!existsSync(dir) || acc.length >= limit) return acc;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (acc.length >= limit) break;
    const full = join(dir, e.name);
    if (e.isDirectory()) walkJava(full, acc, limit);
    else if (e.isFile() && e.name.endsWith(".java")) acc.push(full);
  }
  return acc;
}

function extractFromJava(src, filePath) {
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
  const pkg = stripped.match(/^\s*package\s+([a-zA-Z0-9_.]+)\s*;/m)?.[1] ?? "";
  const classMatch = stripped.match(
    /\b(?:public|protected|private)?\s*(?:static\s+)?(?:final\s+)?(?:abstract\s+)?(?:sealed\s+)?(?:class|interface|enum|record)\s+([A-Za-z0-9_]+)/,
  );
  const simpleName = classMatch?.[1];
  if (!simpleName) return null;
  const fqcn = pkg ? `${pkg}.${simpleName}` : simpleName;
  const methods = [];
  const methodRe =
    /^\s*(?:(?:public|protected|private)\s+)?(?:static\s+)?(?:default\s+)?(?:final\s+)?(?:[\w.<>,?\[\]]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/gm;
  let m;
  while ((m = methodRe.exec(stripped))) {
    const name = m[1];
    if (name === simpleName || name === "if" || name === "for" || name === "while" || name === "switch") continue;
    if (/^[A-Z]/.test(name)) continue;
    if (!methods.includes(name)) methods.push(name);
    if (methods.length >= 40) break;
  }
  return {
    fqcn,
    simpleName,
    pkg,
    methods,
    environment: /@Environment\b|@OnlyIn\b/.test(src),
    apiStatusInternal: /@ApiStatus\.Internal\b/.test(src),
    file: filePath.replace(/\\/g, "/"),
  };
}

const scanRoots = [
  join(CACHE, "decompiled-mods"),
  join(CACHE, "decompiled"),
  join(CACHE, "loader-api-src"),
];
const javaFiles = [];
for (const r of scanRoots) walkJava(r, javaFiles);

if (javaFiles.length === 0) {
  mkdirSync(OUT, { recursive: true });
  const skipped = {
    ok: true,
    skipped: true,
    cache: CACHE,
    note: "无反编译 .java。把官方 API jar 放到 loader-jars 后跑 decompile-loader-apis.mjs / decompile_mod_jar。",
  };
  writeFileSync(join(OUT, "validate-rules-last.json"), JSON.stringify(skipped, null, 2), "utf8");
  console.log("validate-rules-against-cache: no decompiled java; skipped");
  process.exit(0);
}

const classes = [];
for (const f of javaFiles) {
  let src;
  try {
    src = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  const rec = extractFromJava(src, relative(CACHE, f));
  if (rec) classes.push(rec);
}

const byFqcn = new Map(classes.map((c) => [c.fqcn, c]));
const bySimple = new Map();
for (const c of classes) {
  const arr = bySimple.get(c.simpleName) ?? [];
  arr.push(c);
  bySimple.set(c.simpleName, arr);
}

function scanRulesDir(rel) {
  const dir = join(ROOT, rel);
  if (!existsSync(dir)) return [];
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (/\.(mdc|md)$/i.test(e.name)) files.push(full);
    }
  }
  const issues = [];
  const fqcnRe = /\b((?:net\.(?:neoforged|minecraftforge|fabricmc|minecraft)|org\.quiltmc)[a-zA-Z0-9_.]+)\b/g;
  const suspectNames = [
    "NeoForgeAddonPlugin",
    "SimpleChannel",
    "IMessage",
    "NetworkRegistry",
    "RegisterPayloadHandlerEvent",
    "RegisterPayloadHandlersEvent",
    "IPayloadRegistrar",
    "PayloadRegistrar",
    "RegistryObject",
    "DeferredHolder",
  ];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const relFile = relative(ROOT, file).replace(/\\/g, "/");
    let m;
    const seen = new Set();
    while ((m = fqcnRe.exec(text))) {
      const fqcn = m[1].replace(/\.$/, "");
      if (seen.has(fqcn)) continue;
      seen.add(fqcn);
      const hit = byFqcn.get(fqcn);
      if (!hit) {
        issues.push({
          file: relFile,
          symbol: fqcn,
          kind: "fqcn_not_in_cache",
          hint: "cache 中无此 FQCN；可能包名写错或尚未反编译该 jar",
        });
      } else if (hit.apiStatusInternal) {
        issues.push({
          file: relFile,
          symbol: fqcn,
          kind: "api_status_internal",
          hint: "源码标 @ApiStatus.Internal，规则不要当公开 API 教",
        });
      }
    }
    for (const name of suspectNames) {
      if (!text.includes(name)) continue;
      const hits = bySimple.get(name) ?? [];
      if (name === "NeoForgeAddonPlugin" && hits.length === 0) {
        issues.push({
          file: relFile,
          symbol: name,
          kind: "invented_class",
          hint: "cache 中无此类，视为臆造，应从规则删除",
        });
      }
      if (name === "NetworkRegistry" && hits.length) {
        for (const h of hits) {
          if (h.pkg.endsWith(".network") && !h.pkg.endsWith(".network.registration")) {
            issues.push({
              file: relFile,
              symbol: h.fqcn,
              kind: "wrong_package",
              hint: "NetworkRegistry 不在顶层 network 包",
            });
          }
        }
      }
    }
  }
  return issues;
}

const ruleRoots = [];
if (platformArg && versionArg) {
  ruleRoots.push(join(platformArg, versionArg, ".cursor", "rules"));
} else {
  ruleRoots.push("neoforge/.cursor/rules");
  for (const ver of ["1.20.4", "1.21.1", "1.21.3", "1.21.8", "1.21.11", "26.1"]) {
    ruleRoots.push(`neoforge/${ver}/.cursor/rules`);
  }
}

const issues = ruleRoots.flatMap((r) => scanRulesDir(r));
const mappingsVersion = process.env.MC_SKILL_MAPPINGS_VERSION ?? null;
const summary = {
  ok: true,
  cache: CACHE,
  mappingsVersion,
  classCount: classes.length,
  javaFileCount: javaFiles.length,
  issues,
  extractedSample: classes.slice(0, 30).map((c) => ({
    fqcn: c.fqcn,
    methods: c.methods.slice(0, 8),
    apiStatusInternal: c.apiStatusInternal,
    environment: c.environment,
  })),
  note: mappingsVersion
    ? undefined
    : "摘要若写入核实表，必须另有 mappingsVersion（本脚本不臆造）。设置 MC_SKILL_MAPPINGS_VERSION 或由 decompile-loader-apis 写入。",
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "extracted-classes.json"), JSON.stringify({ mappingsVersion, classes }, null, 2), "utf8");
writeFileSync(join(OUT, "validate-rules-last.json"), JSON.stringify(summary, null, 2), "utf8");
console.log(
  `validate-rules-against-cache: ${classes.length} classes, ${issues.length} issues, cache=${CACHE}`,
);
process.exit(0);
