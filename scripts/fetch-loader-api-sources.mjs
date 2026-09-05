#!/usr/bin/env node
/**
 * 把官方源码（GitHub raw / GitLab raw）拉到 $MC_SKILL_CACHE/loader-api-src/，
 * 再抽出带 mappingsVersion 的摘要 JSON（.java 不入库）。
 * 许可证：LiteLoader 禁止再分发源码进仓库；只写 cache。
 *
 * dry-run（默认）  仓库 data/ 只打 DRYRUN <rel>，不落盘。
 * --write        确认后才写 mcp-server/data/loader-api-summaries/。
 * --from-cache   已有 .java 不重下，只按剥注释后的规则重抽摘要。
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import os from "os";
import { redactAbs } from "./_lib/redact-abs.mjs";
import { failureNote, fetchTextWithUa, FETCH_FAILURE } from "./_lib/fetch-with-ua.mjs";
import { wantWrite, logDryRunBanner, emit, scratchMkdirAll, scratchWriteText } from "./_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WRITE = wantWrite();
if (!WRITE) logDryRunBanner("fetch-loader-api-sources");
const CACHE = process.env.MC_SKILL_CACHE || join(os.tmpdir(), "mc-skill-cache");
const SRC = join(CACHE, "loader-api-src");
const OUT = join(ROOT, "mcp-server", "data", "loader-api-summaries");
const FROM_CACHE = process.argv.includes("--from-cache");

const NOT_A_TYPE = new Set([
  "if", "for", "while", "switch", "to", "which", "new", "return", "throw", "catch",
  "class", "interface", "enum", "record", "void", "this", "super",
]);

/**
 * 只接受「注解/修饰符 + 返回类型 + 名字 + (」的声明行。
 * 开头的否定预查看 = Java 语句关键字永远不可能是返回类型，因此
 * `return foo(` / `else bar(x)` / `assert matches(x)` / `throw illegalState(x)` 这类
 * **调用点**（旧正则把关键字吃成 type 位、小写方法名吃成 name 位）一律不进 methods。
 * 前缀是一个 * 号包住的「注解 | 修饰符 + 空白」交替，可任意混排且可 0 次
 * （`@Override public static void tick()`、`public @Deprecated List<String> names(` 都要能吃下）；
 * 返回类型允许一层嵌套泛型与数组后缀。group1 = 方法名。
 */
const METHOD_SIG_RE =
  /^[ \t]*(?!(?:return|throw|else|if|for|while|do|switch|case|new|instanceof|assert|yield|try|catch|finally|break|continue|extends|implements|import|package|var|class|interface|enum|record|this|super)[ \t])(?:(?:@[\w.]+(?:\([^()]*\))?|(?:public|protected|private|static|final|abstract|default|synchronized|native|strictfp))[ \t]+)*(?:<[^<>]*(?:<[^<>]*>[^<>]*)*>[ \t]+)?[\w.$]+(?:(?:<[^<>]*(?:<[^<>]*>[^<>]*)*>|\[\s*\])*)[ \t]+([a-z_$][\w$]*)[ \t]*\(/gm;

const FILES = [
  {
    key: "1.20.4-neoforge",
    mappingsVersion: "mojmap-neoform-1.20.4",
    urls: [
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/network/event/RegisterPayloadHandlerEvent.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/network/registration/IPayloadRegistrar.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/network/registration/NetworkRegistry.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/network/handling/PlayPayloadContext.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/network/PacketDistributor.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/registries/DeferredRegister.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.20.4/src/main/java/net/neoforged/neoforge/registries/DeferredHolder.java",
    ],
  },
  {
    key: "1.21.1-neoforge",
    mappingsVersion: "mojmap-neoform-1.21.1",
    urls: [
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.21.1/src/main/java/net/neoforged/neoforge/network/event/RegisterPayloadHandlersEvent.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.21.1/src/main/java/net/neoforged/neoforge/network/registration/PayloadRegistrar.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.21.1/src/main/java/net/neoforged/neoforge/network/registration/NetworkRegistry.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.21.1/src/main/java/net/neoforged/neoforge/network/handling/IPayloadContext.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/1.21.1/src/main/java/net/neoforged/neoforge/network/PacketDistributor.java",
    ],
  },
  {
    key: "26.1-neoforge",
    mappingsVersion: "mojmap-unobfuscated-26.1",
    urls: [
      "https://raw.githubusercontent.com/neoforged/NeoForge/26.1.x/src/main/java/net/neoforged/neoforge/network/event/RegisterPayloadHandlersEvent.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/26.1.x/src/main/java/net/neoforged/neoforge/network/registration/PayloadRegistrar.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/26.1.x/src/main/java/net/neoforged/neoforge/network/handling/IPayloadContext.java",
      "https://raw.githubusercontent.com/neoforged/NeoForge/26.1.x/src/main/java/net/neoforged/neoforge/network/PacketDistributor.java",
    ],
  },
  {
    key: "1.13.2-rift",
    mappingsVersion: "mcp-1.13.2",
    urls: [
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/MessageAdder.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/PacketAdder.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/CustomPayloadHandler.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/BlockAdder.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/ItemAdder.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/TileEntityTypeAdder.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/client/GameGuiAdder.java",
      "https://raw.githubusercontent.com/DimensionalDevelopment/Rift/master/src/main/java/org/dimdev/rift/listener/client/OverlayRenderer.java",
    ],
  },
  {
    key: "1.12.2-liteloader",
    mappingsVersion: "mcp-1.12.2",
    urls: [
      "https://develop.liteloader.com/liteloader/LiteLoader/-/raw/1.12.2/src/client/java/com/mumfrey/liteloader/HUDRenderListener.java",
      "https://develop.liteloader.com/liteloader/LiteLoader/-/raw/1.12.2/src/client/java/com/mumfrey/liteloader/RenderListener.java",
      "https://develop.liteloader.com/liteloader/LiteLoader/-/raw/1.12.2/src/client/java/com/mumfrey/liteloader/ViewportListener.java",
      "https://develop.liteloader.com/liteloader/LiteLoader/-/raw/1.12.2/src/main/java/com/mumfrey/liteloader/PluginChannelListener.java",
    ],
  },
];

function looksLikeJava(text) {
  return /\b(?:class|interface|enum|record)\s+[A-Za-z_]/.test(text);
}

async function fetchText(url) {
  for (let i = 0; i < 3; i++) {
    const res = await fetchTextWithUa(url, { timeoutMs: 30_000 });
    if (res.ok) {
      if (!looksLikeJava(res.text)) {
        return { ok: false, status: res.status, text: "", note: "not java" };
      }
      return { ok: true, status: res.status, text: res.text };
    }
    if (res.failureClass === FETCH_FAILURE.NOT_FOUND) {
      return { ok: false, status: 404, text: "", failureClass: FETCH_FAILURE.NOT_FOUND, note: "NOT_FOUND(404)" };
    }
    // TLS/证书问题不重试、也绝不降级成「文件不存在」
    if (res.tls) {
      return { ok: false, status: 0, text: "", failureClass: res.failureClass, note: failureNote(res) };
    }
    if (i === 2) {
      return { ok: false, status: res.status || 0, text: "", failureClass: res.failureClass, note: `${res.failureClass || "UNKNOWN"}: ${res.reason || ""}`.slice(0, 300) };
    }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  return { ok: false, status: 0, text: "", failureClass: FETCH_FAILURE.UNKNOWN };
}

function stripJavaComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
}

function extractClass(javaText, filePath) {
  const stripped = stripJavaComments(javaText);
  const pkg = stripped.match(/^\s*package\s+([a-zA-Z0-9_.]+)\s*;/m)?.[1] ?? "";
  const matches = [
    ...stripped.matchAll(
      /\b(?:public|protected|private)?\s*(?:static\s+)?(?:final\s+)?(?:abstract\s+)?(?:sealed\s+)?(?:class|interface|enum|record)\s+([A-Za-z_][A-Za-z0-9_]*)/g,
    ),
  ];
  const stem = String(filePath).replace(/\\/g, "/").split("/").pop()?.replace(/\.java$/i, "") ?? "";
  const classMatch =
    matches.find((m) => m[1] === stem || stem.endsWith(m[1])) ??
    matches.find((m) => m[1] && !NOT_A_TYPE.has(m[1]));
  const simpleName = classMatch?.[1];
  if (!simpleName || NOT_A_TYPE.has(simpleName)) return null;
  const methods = [];
  METHOD_SIG_RE.lastIndex = 0; // 模块级 /g 正则：必须每次从头开始，且下面 break 会留下 lastIndex
  let m;
  while ((m = METHOD_SIG_RE.exec(stripped))) {
    const name = m[1];
    if (name !== simpleName && !NOT_A_TYPE.has(name) && !/^[A-Z]/.test(name)) {
      if (!methods.includes(name)) methods.push(name);
    }
    if (methods.length >= 40) break;
  }
  return {
    fqcn: pkg ? `${pkg}.${simpleName}` : simpleName,
    simpleName,
    pkg,
    methods,
    apiStatusInternal: /@ApiStatus\.Internal/.test(javaText),
    environment: /@Environment\b|@OnlyIn\b/.test(javaText),
    file: filePath.replace(/\\/g, "/"),
  };
}

function extractDir(dir) {
  if (!existsSync(dir)) return [];
  const byFqcn = new Map();
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".java"))) {
    const full = join(dir, f);
    const rec = extractClass(readFileSync(full, "utf8"), full);
    if (!rec) continue;
    const prev = byFqcn.get(rec.fqcn);
    const stem = f.replace(/\.java$/i, "");
    const better = rec.simpleName === stem || stem.endsWith(rec.simpleName);
    if (!prev || better) byFqcn.set(rec.fqcn, rec);
  }
  return [...byFqcn.values()];
}

scratchMkdirAll(SRC);

const report = [];
for (const group of FILES) {
  const dir = join(SRC, group.key);
  scratchMkdirAll(dir);
  const fetched = [];
  for (const url of group.urls) {
    const name = url.split("/").pop();
    const dest = join(dir, name);
    if ((FROM_CACHE || existsSync(dest)) && existsSync(dest) && looksLikeJava(readFileSync(dest, "utf8"))) {
      fetched.push({ url, status: 304, ok: true, note: "cache" });
      continue;
    }
    if (FROM_CACHE) {
      fetched.push({ url, status: 0, ok: false, note: "cache-miss" });
      continue;
    }
    const got = await fetchText(url);
    fetched.push({ url, status: got.status, ok: got.ok, failureClass: got.failureClass, note: got.note });
    if (!got.ok) continue;
    scratchWriteText(dest, got.text);
  }
  const classes = extractDir(dir);
  if (classes.length === 0) {
    console.log(`${group.key}: skip overwrite (empty classes); keep existing summary`);
    report.push({ key: group.key, classes: 0, okUrls: fetched.filter((f) => f.ok).length, skippedWrite: true });
    continue;
  }
  const summary = {
    file: group.key,
    mappingsVersion: group.mappingsVersion,
    mapping: group.mappingsVersion.startsWith("mcp") ? "mcp" : "mojmap",
    source: "official-raw",
    classCount: classes.length,
    classes,
    fetched,
    note: "源码只在 $MC_SKILL_CACHE，不入库。缺 mappingsVersion 视为无效。",
  };
  const outPath = join(OUT, `${group.key}.json`);
  const wrote = emit(outPath, JSON.stringify(summary, null, 2));
  if (!wrote) {
    report.push({ key: group.key, classes: classes.length, okUrls: fetched.filter((f) => f.ok).length, dryRun: true });
    console.log(`${group.key}: ${classes.length} classes (dry-run)`);
    continue;
  }
  report.push({ key: group.key, classes: classes.length, okUrls: fetched.filter((f) => f.ok).length });
  console.log(`${group.key}: ${classes.length} classes, ${fetched.filter((f) => f.ok).length}/${fetched.length} files`);
}

if (WRITE) {
  const lastDir = join(CACHE, "loader-api-summaries");
  scratchWriteText(
    join(lastDir, "fetch-loader-api-sources-last.json"),
    JSON.stringify({ cache: "$MC_SKILL_CACHE", report: redactAbs(report, { cache: CACHE, repo: ROOT }) }, null, 2),
  );
}
console.log("done", SRC);
