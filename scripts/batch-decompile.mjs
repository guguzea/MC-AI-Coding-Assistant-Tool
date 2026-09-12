#!/usr/bin/env node
/**
 * batch-decompile.mjs — 全量反编译批处理编排脚本（Node 22 ESM，零外部依赖，仅内置模块）。
 *
 * 流程：读 mcp-server/data/lib-manifests/all.json → 应用 --filter（gameVersion 通配 /
 * loader / slug）→ 按 sha512 去重（同一 jar 多 loader 只在结果里记录 loader 集合）→
 * 并发下载（流式写 .part + 边写边算 sha512，校验后 rename）→ 复用 MCP dist 的
 * analyzeModJar / decompileModJar 反编译（VineFlower，缓存命中自动跳过）→
 * 提取包名 → 逐 (sha512, loader) 写 JSONL 一行 + 原子写进度文件。
 *
 * 退出码：0=成功（含部分失败） 1=致命错误（manifest/dist 加载失败） 2=用法错误。
 * 网络/反编译异常一律 catch 记失败继续，不中断批次。
 */
import { createHash } from "node:crypto";
import {
  appendFileSync, createWriteStream, existsSync, mkdirSync, readdirSync,
  readFileSync, renameSync, rmSync, writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { makeSemaphore, withSlot } from "./_lib/semaphore.mjs";

// ── 常量 ─────────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const MANIFEST_PATH = join(REPO_ROOT, "mcp-server", "data", "lib-manifests", "all.json");
const MOD_ANALYZER_URL = pathToFileURL(join(REPO_ROOT, "mcp-server", "dist", "decompile", "services", "mod-analyzer.js")).href;
const MOD_DECOMPILE_URL = pathToFileURL(join(REPO_ROOT, "mcp-server", "dist", "decompile", "services", "mod-decompile.js")).href;
const JAVA_PROCESS_URL = pathToFileURL(join(REPO_ROOT, "mcp-server", "dist", "decompile", "java", "java-process.js")).href;
/** JAVA_HOME 必须由环境提供；禁止本机路径兜底。 */
const FETCH_TIMEOUT_MS = 120_000; // 单个 jar 下载超时
const KNOWN_FLAGS = new Set([
  "filter", "limit", "resume", "concurrency-download", "concurrency-decompile",
  "java-xmx", "jar-dir", "output", "progress", "timeout-ms", "help",
  "shard", "cache-dir", "reset",
]);
const FILTER_KEYS = new Set(["gameVersion", "loader", "slug"]);
/** 非包目录（VineFlower 产物里可能出现的资源目录；licenses/coremods/asm/profiles = Forge jar 顶层资源目录，实测在 catalog 留下 30 行一段「包名」） */
const RESOURCE_DIRS = new Set(["META-INF", "assets", "data", "licenses", "coremods", "asm", "profiles"]);
/** 太通用的一层目录 → 取前 3 层（net.minecraft / com.google）；其余取前 2 层 */
const GENERIC_TLDS = new Set(["net", "com", "org", "io", "dev", "co", "uk", "de", "fr", "ru", "jp", "cn", "cc", "xyz", "one", "top", "app", "fi", "eu", "team", "me", "software", "fuzs", "icyllis"]);
const PKG_SEG = /^[A-Za-z_][A-Za-z0-9_]*$/;

class UsageError extends Error {}

// ── flags 解析（参考仓库 cli：--key value / --key=value / 裸 --key→true）──────
function parseFlags(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h") { flags.help = true; continue; }
    if (!a.startsWith("--")) { positional.push(a); continue; }
    const eq = a.indexOf("=");
    let key, val;
    if (eq > 0) { key = a.slice(2, eq); val = a.slice(eq + 1); }
    else {
      key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) { val = next; i++; }
      else val = true;
    }
    if (key === "filter") (flags.filter ??= []).push(String(val));
    else flags[key] = val;
  }
  return { flags, positional };
}

function intValue(flags, key, def) {
  const v = flags[key];
  if (v === undefined) return def;
  if (v === true) throw new UsageError(`--${key} 需要值（收到裸 flag）`);
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1) throw new UsageError(`--${key} 需要正整数（收到「${v}」）`);
  return n;
}

function strValue(flags, key, def) {
  const v = flags[key];
  if (v === undefined || v === true) return def;
  return String(v);
}

function validateFlags({ flags, positional }) {
  for (const k of Object.keys(flags)) if (!KNOWN_FLAGS.has(k)) throw new UsageError(`未知参数 --${k}`);
  if (positional.length > 0) throw new UsageError(`不支持位置参数：${positional.join(" ")}`);
  const filters = [];
  for (const f of flags.filter ?? []) {
    const eq = f.indexOf("=");
    if (eq <= 0) throw new UsageError(`--filter 格式应为 key=value（收到「${f}」）`);
    const key = f.slice(0, eq);
    if (!FILTER_KEYS.has(key)) throw new UsageError(`--filter 只支持 ${[...FILTER_KEYS].join("|")}（收到 ${key}）`);
    const values = f.slice(eq + 1).split(",").map((s) => s.trim()).filter(Boolean);
    if (values.length === 0) throw new UsageError(`--filter ${key}= 不能为空`);
    filters.push({ key, values });
  }
  const xmx = flags["java-xmx"];
  if (xmx !== undefined && xmx !== true && !/^\d+\s*[kmgKMG]?$/i.test(String(xmx).trim())) {
    throw new UsageError(`--java-xmx 应为容量（如 1G / 512M，收到「${xmx}」）`);
  }
  let shard = null;
  if (flags.shard !== undefined) {
    const m = String(flags.shard).split("/").map(Number);
    if (m.length !== 2 || !m.every((x) => Number.isInteger(x) && x >= 1) || m[1] < m[0]) {
      throw new UsageError(`--shard 应为 i/N（如 1/3，收到「${flags.shard}」）`);
    }
    shard = { i: m[0], n: m[1] };
  }
  return {
    filters,
    limit: intValue(flags, "limit", Infinity),
    resume: flags.resume === true || flags.resume === "1" || flags.resume === "true",
    concurrencyDownload: intValue(flags, "concurrency-download", 4),
    // 反编译串行（decompileModJar 内部 cache.db / VineFlower 并发不安全）；
    // 真并行由多进程 --shard 实现。
    concurrencyDecompile: intValue(flags, "concurrency-decompile", 1),
    xmx: xmx === undefined || xmx === true ? null : String(xmx).trim(),
    jarDir: strValue(flags, "jar-dir", join(REPO_ROOT, "temp", "mod-jars")),
    output: strValue(flags, "output", join(REPO_ROOT, "temp", "verified-api-results.jsonl")),
    progress: strValue(flags, "progress", join(REPO_ROOT, "temp", "decompile-progress.json")),
    timeoutMs: intValue(flags, "timeout-ms", 1_800_000),
    shard,
    cacheDir: strValue(flags, "cache-dir", null),
    reset: flags.reset === true || flags.reset === "1" || flags.reset === "true",
  };
}

function printUsage() {
  console.log(`用法: node scripts/batch-decompile.mjs [flags]

全量反编译批处理：读取 mcp-server/data/lib-manifests/all.json，按筛选条件下载
（sha512 流式校验）并反编译每个唯一 jar（VineFlower + 缓存），结果写 JSONL。

flags:
  --filter <key=value>          筛选，可多次；key ∈ gameVersion|loader|slug
                                 gameVersion 支持通配（如 1.21.*、26.*）；
                                 loader / slug 用逗号分隔多值（如 fabric,forge）
  --limit <N>                   本批最多处理 N 个唯一 jar（默认全部）
  --resume                      读进度文件，跳过已成功/失败的 jar（失败不自动重试）
  --concurrency-download <N>    下载并发（默认 4）
  --concurrency-decompile <N>   反编译并发（默认 1；cache.db 并发不安全，真并行用 --shard）
  --java-xmx <size>             传给 JVM 的 -Xmx（如 1G / 512M）
  --jar-dir <dir>               下载目录，按 sha512 命名（默认 <repo>/temp/mod-jars）
  --output <file>               结果 JSONL 路径（默认 <repo>/temp/verified-api-results.jsonl）
  --progress <file>             进度 JSON 路径（默认 <repo>/temp/decompile-progress.json）
  --timeout-ms <ms>             单 jar 全流程超时（默认 1800000 = 30 分钟）
  --shard <i/N>                 分片：只处理索引 mod N === i-1 的 jar（如 1/3）
  --cache-dir <dir>             反编译缓存根（设置 MC_SKILL_CACHE；多分片请用不同目录）
  --reset                       无 --resume 时清空 output/progress（默认拒绝覆盖已有文件）
  --help / -h                   打印本帮助

示例:
  node scripts/batch-decompile.mjs --filter gameVersion=1.20.1 --limit 20
  node scripts/batch-decompile.mjs --resume --filter loader=forge --concurrency-decompile 2
  node scripts/batch-decompile.mjs --filter slug=jei,emi --filter gameVersion=26.*`);
}

// ── 筛选 / 去重 ──────────────────────────────────────────────────────────────
function wildcardRegex(pattern) {
  const esc = pattern.split("*").map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${esc}$`);
}

function matchesAny(value, patterns) {
  return patterns.some((p) => wildcardRegex(p).test(String(value)));
}

function passesFilters(entry, slug, filters) {
  for (const f of filters) {
    const val = f.key === "slug" ? slug : entry[f.key];
    if (!matchesAny(val ?? "", f.values)) return false;
  }
  return true;
}

/** 条目级筛选 → 按 (sha512, loader) 去重 → 按 sha512 聚合（记录 loader 集合） */
function selectJars(libraries, filters) {
  const byPair = new Map();
  for (const lib of libraries) {
    for (const e of lib.entries ?? []) {
      if (!e || typeof e.sha512 !== "string" || !e.sha512.trim()) continue;
      if (!passesFilters(e, lib.slug, filters)) continue;
      const entry = { ...e, slug: lib.slug, sha512: e.sha512.trim().toLowerCase() };
      const key = `${entry.sha512}|${entry.loader}`;
      if (!byPair.has(key)) byPair.set(key, entry);
    }
  }
  const jars = new Map();
  for (const e of byPair.values()) {
    let j = jars.get(e.sha512);
    if (!j) {
      j = { sha512: e.sha512, entry: e, loaders: [] };
      jars.set(e.sha512, j);
    }
    j.loaders.push({ loader: e.loader, gameVersion: e.gameVersion, slug: e.slug, url: e.url, modId: e.modId, fileName: e.fileName });
  }
  return [...jars.values()];
}

function filterByProgress(jars, progress, resume) {
  let skipped = 0;
  const remaining = [];
  for (const j of jars) {
    const rec = progress[j.sha512];
    if (resume && rec && (rec.status === "success" || rec.status === "failed")) { skipped++; continue; }
    remaining.push(j);
  }
  return { remaining, skipped };
}

// ── 下载（流式 + sha512 校验）───────────────────────────────────────────────
function sha512OfFile(p) {
  return createHash("sha512").update(readFileSync(p)).digest("hex");
}

/** 下载到 <jar-dir>/<sha512>.jar（.part 边写边算，校验通过才 rename） */
async function ensureJar(jarDir, entry) {
  const jarPath = join(jarDir, `${entry.sha512}.jar`);
  const partPath = jarPath + ".part";
  if (existsSync(jarPath)) {
    if (sha512OfFile(jarPath) === entry.sha512) return { jarPath, cached: true };
    rmSync(jarPath, { force: true }); // 已存在但 hash 不一致 → 视为损坏，重下
  }
  rmSync(partPath, { force: true }); // 清理上次中断残留
  const res = await fetch(entry.url, {
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": "mc-skill-batch-decompile/1.0" },
  });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}${res.statusText ? " " + res.statusText : ""}`);
  const hash = createHash("sha512");
  await pipeline(
    Readable.fromWeb(res.body),
    new Transform({ transform(chunk, enc, cb) { hash.update(chunk); cb(null, chunk); } }),
    createWriteStream(partPath),
  );
  const got = hash.digest("hex");
  if (got !== entry.sha512) {
    rmSync(partPath, { force: true });
    throw new Error(`sha512 校验失败（期望 ${entry.sha512.slice(0, 12)}…，实际 ${got.slice(0, 12)}…）`);
  }
  renameSync(partPath, jarPath);
  return { jarPath, cached: false };
}

// ── 反编译（复用 MCP dist；Java 17 前置 + 全流程超时）────────────────────────
function ensureJavaHome() {
  if (!process.env.JAVA_HOME) {
    console.warn("JAVA_HOME 未设置；反编译需要 JDK 17+。请设置 JAVA_HOME 后重试。");
  }
}

/**
 * --java-xmx：JVM 启动时读取 JAVA_TOOL_OPTIONS。但 java 会把 "Picked up
 * JAVA_TOOL_OPTIONS: ..." 打到 stderr 首行，而 dist 的 probeJava() 解析首行
 * 版本号 → 会误判 TOOLCHAIN_MISSING。因此先触发 dist 的探测（模块级缓存，与
 * decompileModJar 共享同一实例），再注入 JAVA_TOOL_OPTIONS。
 */
async function applyXmx(javaProcess, xmx) {
  if (!xmx) return;
  await javaProcess.probeJava();
  const opt = `-Xmx${xmx}`;
  process.env.JAVA_TOOL_OPTIONS = process.env.JAVA_TOOL_OPTIONS?.trim()
    ? `${process.env.JAVA_TOOL_OPTIONS} ${opt}`
    : opt;
  console.log(`已设置 JAVA_TOOL_OPTIONS=${opt}`);
}

/** 超时包装：超时后 reject，原 promise 继续在后台跑（结果丢弃，无未处理拒绝） */
function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label}：超过 ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

/** 单 jar 全流程：下载（下载槽）→ 元数据分析 → 反编译（反编译槽） */
async function workJar(jar, opts, state) {
  const { jarPath } = await withSlot(state.dl, () => ensureJar(opts.jarDir, jar.entry));
  const meta = state.analyzer.analyzeModJar(jarPath);
  if (!meta.found) throw new Error(`元数据分析失败（${meta.action?.code ?? "UNKNOWN"}）`);
  const result = await withSlot(state.dc, () => state.decompiler.decompileModJar({
        jarPath,
        version: jar.entry.gameVersion,
        externalModId: jar.entry.modId,
      }));
  if (!result.found) throw new Error(`反编译失败（${result.error ?? "UNKNOWN"}${result.action?.message ? `：${result.action.message}` : ""}）`);
  if (!result.outputDir || !existsSync(result.outputDir)) throw new Error("反编译结果缺少 outputDir");
  return { meta, result, jarPath };
}

/**
 * 成功行的 modId 必须真解析得出（G2）。
 *
 * 以前的 `result.modId ?? meta.modId ?? "unknown"` 产出的是一行 `status:"success"`，
 * `merge-verified-api` 照单收下 ⇒ 所有解不出身份的 jar 挤进同一个目录段并互相冒领
 * 源码树（F92/F113：`unknown-mod` 塌缩目录是他方包根泄漏的唯一来源）。
 * 改判 failed 只是「不再污染下游」——`--resume` 对 success/failed 两种行都跳过，
 * 不会自动重跑，所以 error 文本必须把是哪个 jar 说清。
 *
 * S5b 增加「外部证据」一层，但有硬闸：纯库 jar（如 `kotlinforforge-*.jar`，实测 4026 条目内
 * 既无 `mods.toml` 也无 `mcmod.info`）从 jar 内部永远解不出身份 ⇒ 允许用 `lib-manifests/all.json`
 * 实读的 modId 当 candidate；但该 candidate **必须出现在 jar 自身包路径的某一段里**才生效，
 * 否则照旧抛错。外部证据只是换个来源，裁决仍归归属校验，不会退化成第三个兜底常量。
 * 用的哪一路由 `modIdEvidence` 记在结果行里（`jar` / `manifest`）。
 */
function requireModId(state, candidate, jarPath, ctx = {}) {
  const identity = state.decompiler.resolveModIdSegment(candidate);
  if (!identity.ok) {
    const ext = state.decompiler.resolveModIdSegment(ctx.externalModId);
    const pkgs = ctx.packages ?? [];
    if (ext.ok && state.decompiler.packagesOwnModId(pkgs, ext.modId)) {
      return { modId: ext.modId, evidence: "manifest" };
    }
    throw new Error(
      `modId 解析失败（${identity.code}：${identity.message}），拒绝写 unknown 兜底成功行：${jarPath}` +
        (ctx.externalModId
          ? `｜外部证据「${ctx.externalModId}」也不成立（它本身非法，或 jar 自身包路径里没有这一段：${pkgs.slice(0, 3).join(", ") || "无包"}）`
          : ""),
    );
  }
  return { modId: identity.modId, evidence: "jar" };
}

/**
 * Jar-in-Jar / jarjar 壳处理：主 jar 自身没有 class，实现藏在 `META-INF/jars/*.jar`
 * （FML Jar-in-Jar）或 `META-INF/jarjar/*.jar`（KfF 5.x+ 的 shaded 壳）里。
 *
 * 两件事分开做，因为坑不一样：
 *  - **身份**：取「内层里真正是该库的那个 jar」自己解出的 modId。外层壳贴什么标签都不算，
 *    内层 mods.toml 才是 jar 内部证据（实测 KfF 1.20.6 外壳只有 15 条目、永远解不出 modId，
 *    真身在 `META-INF/jarjar/thedarkcolour.kffmod-5.12.0.jar`）。
 *  - **包名**：仍取所有内层 jar 的并集 —— CCA 那类多个平级子模组就是这么合出来的，收窄会倒退。
 *    并集里谁是谁的捆绑不在这里偷偷裁决，交给 `bundledJars` + 后续 ownership 标签。
 *
 * 返回 {packages, self, bundledJars} 或 null（非壳 / 内层也无产物）。
 */
const EMBEDDED_DIRS = ["jars", "jarjar"];

async function decompileEmbedded(jarPath, jar, opts, state) {
  const tmpRoot = join(opts.jarDir, "embedded", jar.sha512.slice(0, 12));
  mkdirSync(tmpRoot, { recursive: true });
  const innerJars = [];
  for (const dirName of EMBEDDED_DIRS) {
    const member = `META-INF/${dirName}`;
    try {
      execFileSync("tar", ["-xf", jarPath, "-C", tmpRoot, member], { stdio: "ignore", timeout: 60_000 });
    } catch {
      continue; // 该壳没有这一层（tar 对不存在路径非零退出）
    }
    const jij = join(tmpRoot, "META-INF", dirName);
    if (!existsSync(jij)) continue;
    for (const f of readdirSync(jij)) {
      if (f.endsWith(".jar")) innerJars.push({ path: join(jij, f), from: `${member}/${f}` });
    }
  }
  if (innerJars.length === 0) return null;
  const pkgs = [];
  const bundledJars = [];
  let self = null;
  let anyJava = false;
  const want = String(jar.entry?.modId || "").toLowerCase().replace(/[-_]/g, "");
  for (const inner of innerJars) {
    let r = null;
    try {
      r = await withSlot(state.dc, () =>
        state.decompiler.decompileModJar({ jarPath: inner.path, version: jar.entry.gameVersion }));
    } catch {
      continue; // 单个内层失败不影响其他
    }
    if (!r?.found || !r.outputDir || countJavaFiles(r.outputDir) === 0) continue;
    anyJava = true;
    pkgs.push(...extractPackages(r.outputDir));
    const got = String(r.modId || "").toLowerCase().replace(/[-_]/g, "");
    if (self === null && want && got === want) {
      self = { modId: r.modId, modVersion: r.modVersion, evidence: "jarjar-self", from: inner.from };
    } else {
      bundledJars.push(inner.from); // 外壳自己声明的捆绑/兄弟件：ownership 的下一手证据
    }
  }
  if (!anyJava) return null;
  return { packages: [...new Set(pkgs)].sort().slice(0, 8), self, bundledJars: bundledJars.sort() };
}

// ── 包名提取（outputDir 顶层目录 → 前 2-3 层包名）────────────────────────────
function collectPackage(outputDir, tld, depth) {
  const segs = [tld];
  let cur = join(outputDir, tld);
  for (let i = 1; i < depth; i++) {
    let sub = null;
    try {
      sub = readdirSync(cur, { withFileTypes: true })
        .filter((d) => d.isDirectory() && PKG_SEG.test(d.name))
        .sort((a, b) => a.name.localeCompare(b.name))[0] ?? null;
    } catch { break; }
    if (!sub) break;
    segs.push(sub.name);
    cur = join(cur, sub.name);
  }
  return segs.join(".");
}

/** 递归统计反编译产物中的 .java 文件数（空产物判定） */
function countJavaFiles(dir) {
  let n = 0;
  try {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) n += countJavaFiles(join(dir, e.name));
      else if (e.name.endsWith(".java")) n++;
    }
  } catch {
    /* 目录不可读按 0 计 */
  }
  return n;
}

function extractPackages(outputDir) {
  if (!existsSync(outputDir)) return [];
  let dirs;
  // 不可读必须 throw，不能折叠成 []：processJar 只把 throw 记成 failed，返回 [] 会被写成
  // status:"success" + packages:[] 的行，而 --resume 对 success/failed 一律跳过（:208）⇒ 脏行永不愈合。
  try { dirs = readdirSync(outputDir, { withFileTypes: true }); } catch (err) {
    throw new Error(`读取反编译产物目录失败（${outputDir}）：${err.message}`);
  }
  const pkgs = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const name = d.name;
    if (name.startsWith(".") || RESOURCE_DIRS.has(name) || !PKG_SEG.test(name)) continue;
    // Architectury 等库的 mixin/注入占位符目录（architectury_inject_*）不是真实 API 包
    if (name.includes("_inject_") || name.endsWith("_inject")) continue;
    const depth = GENERIC_TLDS.has(name.toLowerCase()) ? 3 : 2;
    pkgs.push(collectPackage(outputDir, name, depth));
  }
  return [...new Set(pkgs)].sort().slice(0, 8);
}

function flattenEntrypoints(ep) {
  if (!ep || typeof ep !== "object") return [];
  const out = [];
  for (const list of Object.values(ep)) {
    if (Array.isArray(list)) for (const x of list) if (typeof x === "string") out.push(x);
  }
  return [...new Set(out)].sort();
}

// ── 输出 / 进度（串行队列防交错；进度 temp+rename 原子写）────────────────────
let ioQueue = Promise.resolve();
function queued(fn) {
  const p = ioQueue.then(fn);
  ioQueue = p.catch(() => {});
  return p;
}

function writeProgressAtomically(path, progress) {
  const tmp = path + ".tmp";
  writeFileSync(tmp, JSON.stringify(progress));
  renameSync(tmp, path);
}

function loadProgress(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return {}; }
}

// ── 单个 jar 的完整处理（永不 throw；任何异常折叠为 failed）──────────────────
async function processJar(jar, opts, state) {
  const t0 = Date.now();
  let outcome;
  try {
    const { meta, result } = await withTimeout(
      workJar(jar, opts, state),
      opts.timeoutMs,
      `反编译 ${jar.sha512.slice(0, 8)}`,
    );
    const jarPath = join(opts.jarDir, `${jar.sha512}.jar`);
    // 归属校验（F92）：源码树的 .java 包根必须出自本 jar 自身的 .class 条目。
    // 撞名 / 复用目录时的残留会把别人的包算进本条目，一旦写进 JSONL，下游库摘要全链路失真。
    const owned = state.decompiler.verifyOutputOwnership(result.outputDir, jarPath);
    // 空产物防护：VineFlower 可能返回 found=true 但无 .java（资源-only jar / JiJ 壳 / 反编译失败）
    const javaFiles = countJavaFiles(result.outputDir);
    if (!owned.ok) {
      outcome = {
        status: "failed",
        error: `源码树归属校验失败：${owned.reason}（外来包根 ${owned.foreignPackages.join(", ") || "?"}）`,
      };
    } else if (javaFiles === 0) {
      // JiJ / jarjar 壳（CCA 走 jars、KfF 5.x+ 走 jarjar）：主 jar 无 class，实现在内层 jar 里
      const embedded = await decompileEmbedded(jarPath, jar, opts, state);
      if (embedded) {
        const idJ = embedded.self
          ? { modId: embedded.self.modId, evidence: embedded.self.evidence }
          : requireModId(state, result.modId ?? meta.modId, jarPath, {
              externalModId: jar.entry?.modId,
              packages: embedded.packages,
            });
        outcome = {
          status: "success",
          modId: idJ.modId,
          modIdEvidence: idJ.evidence,
          modVersion: embedded.self?.modVersion ?? result.modVersion ?? meta.modVersion ?? "unknown",
          packages: embedded.packages,
          bundledJars: embedded.bundledJars,
          entrypoints: flattenEntrypoints(meta.entrypoints),
          outputDir: result.outputDir,
          note: "JiJ / jarjar 壳（包名取自内嵌 jar；捆绑件见 bundledJars）",
        };
      } else {
        outcome = { status: "failed", error: `反编译空产物（${result.outputDir} 无 .java）` };
      }
    } else {
      const pkgs = extractPackages(result.outputDir);
      const idN = requireModId(state, result.modId ?? meta.modId, jarPath, {
        externalModId: jar.entry?.modId,
        packages: pkgs,
      });
      outcome = {
        status: "success",
        modId: idN.modId,
        modIdEvidence: result.modIdEvidence ?? idN.evidence,
        modVersion: result.modVersion ?? meta.modVersion ?? "unknown",
        packages: pkgs,
        entrypoints: flattenEntrypoints(meta.entrypoints),
        outputDir: result.outputDir,
      };
    }
  } catch (err) {
    outcome = { status: "failed", error: err.message };
  }
  const elapsedMs = Date.now() - t0;
  // 逐 (sha512, loader) 输出一行：同一 jar 多 loader 时每个 loader 各写一行
  // （await 全部排队写入，避免 process.exit 截断最后的进度写）
  const verifiedAt = new Date().toISOString().slice(0, 7);
  const writes = [];
  for (const l of jar.loaders) {
    const line = {
      sha512: jar.sha512, url: l.url, slug: l.slug, gameVersion: l.gameVersion,
      loader: l.loader, verifiedAt, status: outcome.status,
    };
    if (outcome.status === "success") {
      Object.assign(line, {
        modId: outcome.modId, modVersion: outcome.modVersion,
        packages: outcome.packages, entrypoints: outcome.entrypoints, outputDir: outcome.outputDir,
      });
    } else {
      line.error = outcome.error;
    }
    writes.push(state.appendLine(line).catch((err) => console.error(`⚠️ JSONL 写入失败：${err.message}`)));
  }
  writes.push(
    state
      .recordProgress(jar.sha512, outcome.status, outcome.status === "failed" ? outcome.error : undefined)
      .catch((err) => console.error(`⚠️ 进度写入失败：${err.message}`)),
  );
  await Promise.all(writes);
  state.logJar(jar, outcome.status, elapsedMs);
  return outcome;
}

// ── 批处理主流程 ─────────────────────────────────────────────────────────────
function loadManifest(path) {
  const raw = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(raw)) throw new Error(`结构异常：期望数组，得到 ${typeof raw}`);
  return raw;
}

function fmtDuration(s) {
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${s % 60}s`;
}

async function main() {
  const parsed = parseFlags(process.argv.slice(2));
  if (parsed.flags.help) { printUsage(); return 0; }
  const opts = validateFlags(parsed);
  ensureJavaHome();
  if (opts.cacheDir) {
    process.env.MC_SKILL_CACHE = opts.cacheDir; // 必须在 import dist 模块前设置
    console.log(`已设置 MC_SKILL_CACHE=${opts.cacheDir}`);
  }

  mkdirSync(opts.jarDir, { recursive: true });
  mkdirSync(dirname(opts.output), { recursive: true });
  mkdirSync(dirname(opts.progress), { recursive: true });

  let analyzerMod, decompilerMod;
  try {
    [analyzerMod, decompilerMod] = await Promise.all([
      import(MOD_ANALYZER_URL),
      import(MOD_DECOMPILE_URL),
    ]);
  } catch (err) {
    console.error(`致命错误：MCP dist 模块加载失败：${err.message}`);
    return 1;
  }

  if (opts.xmx) {
    try {
      const javaProcess = await import(JAVA_PROCESS_URL);
      await applyXmx(javaProcess, opts.xmx);
    } catch (err) {
      console.error(`致命错误：java-process 模块加载失败：${err.message}`);
      return 1;
    }
  }

  let libraries;
  try {
    libraries = loadManifest(MANIFEST_PATH);
  } catch (err) {
    console.error(`致命错误：manifest 读取失败（${MANIFEST_PATH}）：${err.message}`);
    return 1;
  }

  const progress = opts.resume ? loadProgress(opts.progress) : {};
  if (opts.resume && !existsSync(opts.progress)) {
    console.error("⚠️ --resume 指定但进度文件不存在，按全新批次处理");
  }
  if (!opts.resume) {
    if ((existsSync(opts.output) && readFileSync(opts.output, "utf8").trim()) || existsSync(opts.progress)) {
      if (!opts.reset) {
        console.error("输出或进度文件已存在。加 --resume 继续，或 --reset 清空后重跑。");
        return 1;
      }
    }
    writeFileSync(opts.output, "");
    writeFileSync(opts.progress, "{}");
  }

  const selected = selectJars(libraries, opts.filters);
  // --shard 分片：按 sha512 索引均匀切分（配合多进程 --cache-dir 实现真并行）
  let selectedShard = selected;
  if (opts.shard) {
    const { i, n } = opts.shard;
    selectedShard = selected.filter((_, idx) => idx % n === i - 1);
    console.log(`--shard ${i}/${n}：分片后 ${selectedShard.length} 个唯一 jar`);
  }
  const { remaining, skipped } = filterByProgress(selectedShard, progress, opts.resume);
  const batch = opts.limit < remaining.length ? remaining.slice(0, opts.limit) : remaining;

  console.log(`manifest: ${MANIFEST_PATH}`);
  console.log(`筛选后 ${selected.length} 个唯一 jar${opts.limit < Infinity ? `，--limit ${opts.limit}` : ""}，本批 ${batch.length} 个${skipped > 0 ? `（--resume 跳过 ${skipped} 个）` : ""}`);
  if (batch.length === 0) {
    console.log("本批没有待处理的 jar。");
    return 0;
  }

  let done = 0, successCount = 0, failCount = 0, linesWritten = 0;
  const startedAt = Date.now();
  const state = {
    analyzer: analyzerMod, decompiler: decompilerMod, opts, progress,
    dl: makeSemaphore(opts.concurrencyDownload),
    dc: makeSemaphore(opts.concurrencyDecompile),
    appendLine: (line) => {
      linesWritten++;
      return queued(() => appendFileSync(opts.output, JSON.stringify(line) + "\n"));
    },
    recordProgress: (sha, status, error) => {
      progress[sha] = { status, ...(error ? { error } : {}), ts: new Date().toISOString() };
      return queued(() => writeProgressAtomically(opts.progress, progress));
    },
    logJar: (jar, status, elapsedMs) => {
      done++;
      if (status === "success") successCount++; else failCount++;
      const loaders = [...new Set(jar.loaders.map((l) => l.loader))].join("+");
      const gv = [...new Set(jar.loaders.map((l) => l.gameVersion))].join("+");
      console.log(`[${done}/${batch.length}] ${jar.entry.slug} ${loaders} ${gv} → ${status} (${(elapsedMs / 1000).toFixed(1)}s)`);
    },
  };

  // 流式滑动窗口：避免海量任务同时排队（等槽时间计入超时 → 全量超时）。
  // 窗口 = 反编译并发；每个任务内下载（下载槽）与反编译（反编译槽）串行。
  let cursor = 0;
  const workers = [];
  const windowSize = Math.min(Math.max(opts.concurrencyDecompile, 1), batch.length);
  for (let w = 0; w < windowSize; w++) {
    workers.push(
      (async () => {
        while (cursor < batch.length) {
          const jar = batch[cursor++];
          await processJar(jar, opts, state);
        }
      })(),
    );
  }
  await Promise.all(workers);
  await ioQueue; // 兜底：确保队列中无残留写入（正常已被 processJar await）

  const elapsedSec = Math.round((Date.now() - startedAt) / 1000);
  const etaSec = done > 0 && done < batch.length ? Math.round((elapsedSec / done) * (batch.length - done)) : 0;
  console.log(`\n批处理完成：筛选 ${selected.length} | 本批 ${batch.length} | 处理 ${done} | 成功 ${successCount} | 失败 ${failCount} | 跳过 ${skipped}`);
  console.log(`耗时 ${fmtDuration(elapsedSec)}${etaSec > 0 ? `，剩余估算 ~${fmtDuration(etaSec)}` : ""}`);
  console.log(`输出: ${opts.output}（${linesWritten} 行）`);
  console.log(`进度: ${opts.progress}`);
  return 0;
}

main().then((code) => process.exit(code)).catch((err) => {
  if (err instanceof UsageError) {
    console.error(`用法错误：${err.message}`);
    console.error("用 --help 查看用法");
    process.exit(2);
  }
  console.error(`致命错误：${err.stack ?? err.message}`);
  process.exit(1);
});
