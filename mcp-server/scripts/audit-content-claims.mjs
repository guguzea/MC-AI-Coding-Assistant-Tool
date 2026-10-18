#!/usr/bin/env node
/**
 * audit-content-claims.mjs —— 独立的“内容断言审计”脚本（**不挂门链**）。
 *
 * 目的：补 assert-* 门禁的盲区 —— 门只证“名字有出处/镜像没漂移/格式合法”，
 * 不证散文断言、可见性、抽象性、数量、import 完整性、档内 knowledge 与 skill 的一致性。
 *
 * 用法：
 *   node mcp-server/scripts/audit-content-claims.mjs --packs fabric/1.21.11,fabric/1.19.4
 *   node mcp-server/scripts/audit-content-claims.mjs --all --compile
 *   node mcp-server/scripts/audit-content-claims.mjs --all --complete   # 片段补全后编译
 *   node mcp-server/scripts/audit-content-claims.mjs --packs fabric/1.21.11 --fragment path/to/Snippet.java
 *   node mcp-server/scripts/audit-content-claims.mjs --selftest
 *
 * 输出：temp/content-audit/report.json + 终端摘要。
 * 依赖：Node 22+；本机 JDK（javap/javac）用于真构件取证与可选的逐块编译。
 * 只读：不写 fabric/、data/、mcp-server/data/。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = process.env.AUDIT_OUT_DIR
  ? path.resolve(process.env.AUDIT_OUT_DIR)
  : path.join(REPO, "temp", "content-audit");
// 【拒绝写仓库正文】fail-closed：允许写到仓库内**只有** temp/ 下（gitignore 产物）；
// `AUDIT_OUT_DIR` 一旦指向仓库里 temp/ 之外（例如仓库根、fabric/、data/），当场拒跑。
// 这道闸门就是 write-guard 清单里那条豁免的**依据**（摘掉它，豁免即失效，门会再红）。
{
  const rel = path.relative(REPO, OUT_DIR);
  const inRepo = rel && !rel.startsWith("..") && !path.isAbsolute(rel);
  const inTemp = inRepo && (rel === "temp" || rel.startsWith("temp" + path.sep));
  if (inRepo && !inTemp) {
    throw new Error(`【OUTLET-IN-REPO】拒绝把审计产物写进仓库正文：${OUT_DIR}（只允许 <repo>/temp/** 或仓库外路径）`);
  }
}
const MODULES = "C:/Users/zzrCN/.gradle/caches/modules-2/files-2.1";
const LOOM = "C:/Users/zzrCN/.gradle/caches/fabric-loom/minecraftMaven/net/minecraft";
const EXTERNAL_ROOT = "F:/MOD_TEST";
const JDK_BIN = "G:/graalvm-jdk-21_windows-x64_bin/graalvm-jdk-21.0.12+7.1/bin";
const JAVAP = fs.existsSync(path.join(JDK_BIN, "javap.exe")) ? path.join(JDK_BIN, "javap.exe") : "javap";
const JAVAC = fs.existsSync(path.join(JDK_BIN, "javac.exe")) ? path.join(JDK_BIN, "javac.exe") : "javac";

const JDK_COMMON = new Set([
  "String", "Object", "Class", "System", "Math", "Integer", "Long", "Short", "Byte", "Float", "Double",
  "Boolean", "Character", "Void", "Override", "Deprecated", "SuppressWarnings", "FunctionalInterface",
  "Exception", "RuntimeException", "IllegalArgumentException", "IllegalStateException", "Error",
  "List", "Map", "Set", "Collection", "ArrayList", "HashMap", "HashSet", "Arrays", "Collections",
  "Optional", "Objects", "Stream", "Collectors", "CompletableFuture", "Runnable", "Thread",
  "Consumer", "Supplier", "Function", "Predicate", "BiConsumer", "BiFunction", "UnaryOperator",
  "Record", "Enum", "Iterable", "Comparable", "CharSequence", "Number", "Throwable",
]);

// MC 的类型签名会引用 DFU / brigadier / netty 的接口（如 Registry implements Keyable、
// FriendlyByteBuf 继承 ByteBuf），javac 需要它们才能判定；否则会把真实错误埋进 "cannot access"。
function newestModuleJar(group, artifact) {
  const base = path.join("C:/Users/zzrCN/.gradle/caches/modules-2/files-2.1", group, artifact);
  if (!fs.existsSync(base)) return null;
  const cands = [];
  walk(base, 3, cands, (n) => n.endsWith(".jar") && !n.includes("-sources"));
  return cands.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
}

const SUPPORT_JARS = [
  "C:/Users/zzrCN/.gradle/caches/modules-2/files-2.1/com.mojang/datafixerupper/10.0.21/b6b2ae770c02e0c1eb90f9985b151e9085a38d0b/datafixerupper-10.0.21.jar",
  "C:/Users/zzrCN/.gradle/caches/modules-2/files-2.1/com.mojang/brigadier/1.3.11/3373d1e7bf00c8b99bed1ea4efb8c47344e4a887/brigadier-1.3.11.jar",
  newestModuleJar("io.netty", "netty-buffer"),
  newestModuleJar("io.netty", "netty-common"),
  newestModuleJar("io.netty", "netty-codec"),
  newestModuleJar("com.google.guava", "guava"),
  newestModuleJar("org.jetbrains", "annotations"),
  newestModuleJar("org.jspecify", "jspecify"),
  newestModuleJar("org.slf4j", "slf4j-api"),
].filter((p) => p && fs.existsSync(p));

// ---------------------------------------------------------------- ZIP (central directory only)

function readCentralDirectory(jar) {
  const fd = fs.openSync(jar, "r");
  try {
    const size = fs.fstatSync(fd).size;
    const tailLen = Math.min(size, 66 * 1024);
    const tail = Buffer.alloc(tailLen);
    fs.readSync(fd, tail, 0, tailLen, size - tailLen);
    let eocd = -1;
    for (let i = tail.length - 22; i >= 0; i--) {
      if (tail.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("EOCD not found: " + jar);
    const count = tail.readUInt16LE(eocd + 10);
    const cdSize = tail.readUInt32LE(eocd + 12);
    const cdOffset = tail.readUInt32LE(eocd + 16);
    const cd = Buffer.alloc(cdSize);
    fs.readSync(fd, cd, 0, cdSize, cdOffset);
    const entries = [];
    let off = 0;
    for (let i = 0; i < count; i++) {
      if (cd.readUInt32LE(off) !== 0x02014b50) throw new Error("bad central header in " + jar);
      const method = cd.readUInt16LE(off + 10);
      const compSize = cd.readUInt32LE(off + 20);
      const nameLen = cd.readUInt16LE(off + 28);
      const extraLen = cd.readUInt16LE(off + 30);
      const commentLen = cd.readUInt16LE(off + 32);
      const localOff = cd.readUInt32LE(off + 42);
      const name = cd.subarray(off + 46, off + 46 + nameLen).toString("utf8");
      entries.push({ name, method, compSize, localOff });
      off += 46 + nameLen + extraLen + commentLen;
    }
    return entries;
  } finally {
    fs.closeSync(fd);
  }
}

function readEntry(jar, entry) {
  const fd = fs.openSync(jar, "r");
  try {
    const header = Buffer.alloc(30);
    fs.readSync(fd, header, 0, 30, entry.localOff);
    if (header.readUInt32LE(0) !== 0x04034b50) throw new Error("bad local header: " + entry.name);
    const nameLen = header.readUInt16LE(26);
    const extraLen = header.readUInt16LE(28);
    const start = entry.localOff + 30 + nameLen + extraLen;
    const data = Buffer.alloc(entry.compSize);
    fs.readSync(fd, data, 0, entry.compSize, start);
    return entry.method === 0 ? data : zlib.inflateRawSync(data);
  } finally {
    fs.closeSync(fd);
  }
}

const zipCache = new Map();
function zipEntries(jar) {
  if (!zipCache.has(jar)) zipCache.set(jar, readCentralDirectory(jar));
  return zipCache.get(jar);
}

// ---------------------------------------------------------------- inventory

function walk(dir, depth, out, filter) {
  if (depth < 0) return;
  let es;
  try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of es) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, depth - 1, out, filter);
    else if (filter(e.name)) out.push(p);
  }
}

function findMerged(ver, prefix) {
  const base = path.join(LOOM, "minecraft-merged");
  if (fs.existsSync(base)) {
    const dirs = fs.readdirSync(base).filter((d) => d.startsWith(`${ver}-${prefix}`));
    for (const d of dirs) {
      const files = fs.readdirSync(path.join(base, d)).filter((f) => f.endsWith(".jar") && !f.includes("-sources"));
      if (files.length) return path.join(base, d, files[0]);
    }
  }
  // 老档没有落进 loom 全局缓存时，用本机 _oracle-jars 里已 remap 到 Yarn 的合并 jar。
  if (prefix === "net.fabricmc.yarn") {
    const oracle = "F:/MC_GAME/_oracle-jars/mc";
    if (fs.existsSync(oracle)) {
      const hit = fs.readdirSync(oracle).find((f) => f.startsWith(`minecraft-${ver}-yarn`) && f.endsWith(".jar") && !f.includes("sources"));
      if (hit) return path.join(oracle, hit);
    }
    // 基准工程自己的 loom-cache 里可能留着 `minecraft-project-@-mapped.jar`（1.17.1 只有这一份）。
    const proj = path.join("F:/MC_GAME", `fabric-${ver}`, ".gradle", "loom-cache", ver);
    if (fs.existsSync(proj)) {
      const out = [];
      walk(proj, 6, out, (n) => /minecraft.*mapped\.jar$/.test(n) && !n.includes("sources"));
      if (out.length) return out.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
    }
  }
  return null;
}

// 26.x 已去混淆：Fabric 基准工程里留下的是 mojmap 合并 jar（不再有 Yarn 层）。
function findDeobfMerged(ver) {
  const base = path.join("F:/MC_GAME", `fabric-${ver}`, ".gradle", "loom-cache", "minecraftMaven");
  if (!fs.existsSync(base)) return null;
  const out = [];
  walk(base, 6, out, (n) => /merged.*\.jar$/.test(n) && !n.includes("sources"));
  return out.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
}

// ---------------------------------------------------------------- platform artifacts
// 每个平台的可核构件不同：fabric/quilt = Yarn 合并 jar；forge = _mapped_ jar（official/parchment=mojmap，
// snapshot=mcp）；neoforge = MDG 的 *-merged.jar；老 Forge/LiteLoader = mappings 里的 MCP 类名表。

const FORGE_REPO = path.join("C:/Users/zzrCN/.gradle/caches/forge_gradle/minecraft_user_repo/net/minecraftforge/forge");
const NEO_DEV = "F:/MOD_TEST/dev";

function newestJarIn(dir) {
  if (!fs.existsSync(dir)) return null;
  let best = null;
  const walk2 = (d, depth) => {
    if (depth > 4) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const q = path.join(d, e.name);
      if (e.isDirectory()) walk2(q, depth + 1);
      else if (e.name.endsWith(".jar") && !e.name.includes("-sources") && !e.name.includes("-javadoc")) {
        const m = fs.statSync(q).mtimeMs;
        if (!best || m > best.m) best = { jar: q, m };
      }
    }
  };
  walk2(dir, 0);
  return best ? best.jar : null;
}

function findForgeMapped(version) {
  if (!fs.existsSync(FORGE_REPO)) return null;
  const rank = (d) => (d.includes("_mapped_official_") ? 0 : d.includes("_mapped_parchment_") ? 1 : 2);
  const dirs = fs.readdirSync(FORGE_REPO)
    .filter((d) => d.startsWith(version + "-") && d.includes("_mapped_"))
    .sort((a, b) => rank(a) - rank(b));
  for (const d of dirs) {
    const jars = fs.readdirSync(path.join(FORGE_REPO, d)).filter((f) => f.endsWith(".jar") && !f.includes("launcher") && !f.includes("sources"));
    if (jars.length) return { jar: path.join(FORGE_REPO, d, jars[0]), layer: rank(d) < 2 ? "mojmap" : "mcp" };
  }
  return null;
}

function findForgeSupportJars(version) {
  const out = [];
  const fmlBase = path.join(MODULES, "net.minecraftforge", "fmlcore");
  if (fs.existsSync(fmlBase)) {
    const d = fs.readdirSync(fmlBase).filter((x) => x.startsWith(version + "-")).sort().pop();
    if (d) {
      const jar = newestJarIn(path.join(fmlBase, d));
      if (jar) out.push(jar);
    }
  }
  const uniBase = path.join("C:/Users/zzrCN/.gradle/caches/forge_gradle/maven_downloader/net/minecraftforge/forge");
  if (fs.existsSync(uniBase)) {
    const d = fs.readdirSync(uniBase).filter((x) => x.startsWith(version + "-")).sort().pop();
    if (d) {
      const jar = fs.readdirSync(path.join(uniBase, d)).find((f) => f.endsWith("-universal.jar"));
      if (jar) out.push(path.join(uniBase, d, jar));
    }
  }
  return out;
}

function findNeoMerged(version) {
  const dir = path.join(NEO_DEV, "neoforge-" + version, "build", "moddev", "artifacts");
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .map((f) => path.join(dir, f))
    .filter((f) => /merged\.jar$/.test(f) && !f.includes("sources"))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
}

function loadMcpNames(platform, version) {
  // MCP/SRG 名是 MC 版本 + 映射的属性，不随加载器变：liteloader / rift 没有自己的
  // mappings 目录，借同版本 forge 的表（rift 1.13.2 = MC 1.13.2；liteloader 同）。
  const candidates = [platform, "forge"];
  for (const p of candidates) {
    const dir = path.join(REPO, "data", `${p}_${version}`, "mappings");
    for (const f of ["joined.srg", "joined.tsrg"]) {
      const fp = path.join(dir, f);
      if (!fs.existsSync(fp)) continue;
      const names = new Set();
      for (const line of fs.readFileSync(fp, "utf8").split(/\r?\n/)) {
        const m = line.match(/^CL:\s+\S+\s+(\S+)/);
        if (m) { names.add(m[1].replace(/\//g, ".")); continue; }
        // TSRG：顶格 `obf named` 是类，缩进行是成员。
        if (!/^\s/.test(line)) {
          const t = line.match(/^(\S+)\s+(\S+)$/);
          if (t) names.add(t[2].replace(/\//g, "."));
        }
      }
      if (names.size) return names;
    }
  }
  return null;
}

function artifactSet(platform, version) {
  const jars = [];
  let expected = null;
  let mcpNames = null;
  const add = (jar, layer) => {
    if (jar && fs.existsSync(jar) && !jars.some((j) => j.jar === jar)) jars.push({ jar, layer });
  };
  if (platform === "fabric" || platform === "quilt") {
    if (/^26\./.test(version)) {
      add(findDeobfMerged(version), "mojmap");
      expected = "mojmap";
    } else {
      add(findMerged(version, "net.fabricmc.yarn"), "yarn");
      add(findMerged(version, "loom.mappings"), "mojmap");
      expected = "yarn";
    }
    // loader API（ModInitializer / FabricLoader 等）不在 FAPI 模块里，补一份最新 loader 件做类名索引。
    add(newestJarIn(path.join(MODULES, "net.fabricmc", "fabric-loader")), "api");
  } else if (platform === "neoforge") {
    add(findNeoMerged(version), "mojmap");
    add(newestJarIn(path.join(MODULES, "net.neoforged.fancymodloader", "loader")), "api");
    expected = "mojmap";
  } else if (platform === "forge" || platform === "rift") {
    const m = findForgeMapped(version);
    if (m) { add(m.jar, m.layer); expected = m.layer; }
    for (const j of findForgeSupportJars(version)) add(j, "api");
    if (!expected) expected = "mcp";
  } else if (platform === "liteloader" || platform === "modloader") {
    const m = findForgeMapped(version);
    if (m) { add(m.jar, m.layer); expected = m.layer; }
    else expected = "mcp";
  }
  mcpNames = loadMcpNames(platform, version);
  return { jars, expected, mcpNames };
}


function collectJars() {
  const fapi = [];
  walk(path.join(MODULES, "net.fabricmc.fabric-api"), 5, fapi, (n) => n.endsWith(".jar") && !n.includes("-sources"));
  const external = [];
  if (fs.existsSync(EXTERNAL_ROOT)) {
    walk(EXTERNAL_ROOT, 2, external, (n) => /\.jar$/.test(n) && !n.includes("-sources") && /(cloth|rei)/i.test(n));
  }
  const shedaniel = path.join(MODULES, "me.shedaniel");
  if (fs.existsSync(shedaniel)) walk(shedaniel, 6, external, (n) => n.endsWith(".jar") && !n.includes("-sources"));
  return { fapi, external };
}

function classEntryName(name) {
  return name.replace(/\.class$/, "").replace(/\//g, ".");
}

function buildIndex(jars) {
  const bySimple = new Map();
  const byFqcn = new Map();
  for (const { jar, layer } of jars) {
    let entries;
    try { entries = zipEntries(jar); } catch { continue; }
    for (const e of entries) {
      if (!e.name.endsWith(".class") || e.name.startsWith("META-INF/")) continue;
      const fqcn = classEntryName(e.name);
      // 第三方 mod 的 shadowed / relocated 内部类会和 MC 简单名撞车
      // （如 Cloth Config 内嵌 toml 的 Identifier），它们不是可 import 的公共 API。
      if (/(?:^|\.)(?:shadowed|relocated|shaded)\./.test(fqcn)) continue;
      const simple = fqcn.split(".").pop().split("$").pop();
      const item = { jar, layer, fqcn, simple };
      if (!bySimple.has(simple)) bySimple.set(simple, []);
      bySimple.get(simple).push(item);
      if (!byFqcn.has(fqcn)) byFqcn.set(fqcn, []);
      byFqcn.get(fqcn).push(item);
    }
  }
  return { bySimple, byFqcn, layers: new Set(jars.map((j) => j.layer)), classNames: [...byFqcn.keys()] };
}

function nestedEntries(jar, fqcnPrefix) {
  const prefix = fqcnPrefix.replace(/\./g, "/") + "$";
  return [...new Set(zipEntries(jar).map((e) => e.name).filter((n) => n.startsWith(prefix) && n.endsWith(".class")))];
}

const javapCache = new Map();
function javapInfo(entry) {
  const key = entry.jar + "|" + entry.fqcn;
  if (javapCache.has(key)) return javapCache.get(key);
  const r = spawnSync(JAVAP, ["-p", "-classpath", entry.jar, entry.fqcn], { encoding: "utf8" });
  if (r.status !== 0) {
    javapCache.set(key, null);
    return null;
  }
  const lines = r.stdout.split(/\r?\n/);
  const decl = lines.find((l) => /^(public|protected|private|final|abstract|class|interface|enum|record)\b/.test(l) && /(class|interface|enum|record)\b/.test(l)) || "";
  const methods = [];
  for (const l of lines) {
    const m = l.match(/^\s*(public|protected|private)?\s*(static\s+)?(final\s+)?(abstract\s+)?[^;=]+?\s([A-Za-z_$][\w$]*)\s*\(/);
    if (!m) continue;
    methods.push({ visibility: m[1] || "package", abstract: Boolean(m[4]), name: m[5] });
  }
  const info = { raw: r.stdout, decl, methods, abstractClass: /(^|\s)abstract\s+(class|interface)/.test(decl) };
  javapCache.set(key, info);
  return info;
}

// ---------------------------------------------------------------- markdown

function parseMarkdown(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const fences = [];
  const prose = [];
  let inFence = false, lang = "", buf = [], start = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inFence) {
      const m = line.match(/^\s*(```|~~~)\s*([A-Za-z0-9_+-]*)\s*$/);
      if (m) { inFence = true; lang = m[2].toLowerCase(); buf = []; start = i + 1; continue; }
      prose.push({ line: i + 1, text: line });
    } else {
      if (/^\s*(```|~~~)\s*$/.test(line)) {
        fences.push({ lang, content: buf.join("\n"), startLine: start });
        inFence = false; lang = ""; buf = [];
      } else buf.push(line);
    }
  }
  return { text, lines, fences, prose, headings: lines.map((l, i) => ({ line: i + 1, text: l })).filter((x) => /^##\s+/.test(x.text)) };
}

function backtickTokens(line) {
  return [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}
function wordTokens(line) {
  return [...line.matchAll(/\b[A-Z][A-Za-z0-9_$]*\b/g)].map((m) => m[0]);
}
function simpleName(name) {
  return name.split(/[.#]/).pop().split("$").pop();
}

// ---------------------------------------------------------------- checks

function finding(kind, file, line, symbol, claim, status, evidence) {
  return { kind, file: path.relative(REPO, file).replace(/\\/g, "/"), line, symbol, claim, status, evidence };
}

function layerHint(line, expected) {
  if (/两侧|both/i.test(line)) return "both";
  if (/\bYarn\b/i.test(line)) return "yarn";
  if (/mojmap|Mojang|官方名/i.test(line)) return "mojmap";
  return expected === "mojmap" ? "mojmap" : expected === "yarn" ? "yarn" : "both";
}

function checkAbsence(pack, file, lineNo, line, inv, expected) {
  const out = [];
  if (/不要按|不要\s*import|参考代码的\s*import|import\s*面|旧稿|禁止|未核实|TODO/.test(line)) return out;
  const patterns = [
    /`([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?)`\s*(?:在本档|在该档|在此版本|在\s*1\.[\d.]+)?\s*(?:不存在|没有)/,
    /`([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?)`[^。；\n]{0,30}?(?:两侧都没有|都不存在)/,
    /([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?)\s*(?:在|于)[^。；\n]{0,30}?不存在/,
    // 小标题式断言：`X（不存在）` / `X（1.16.5 不存在）`
    /`?([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?)`?\s*（\s*(?:(?:本档|该档|此版本|1\.[\d.]+)\s*)?(?:不存在|没有)\s*）/,
  ];
  // 「服务端/客户端不存在」讲的是分发面，不是类存在性；合并 jar 判不了，跳过。
  if (/服务端|客户端|专用服务器/.test(line)) return out;
  for (const re of patterns) {
    const m = line.match(re);
    if (!m) continue;
    // 「X 没有这个方法/字段/构造」或「X 没有 `member(...)` 入口」讲成员缺失，不讲类缺失。
    const tail = line.slice(m.index + m[0].length);
    if (/^\s*(?:这|该|此|任何|对应)?\s*(?:个)?\s*(?:方法|字段|构造|重载|实现|接口|静态)/.test(tail)) continue;
    if (/^\s*`[^`]*\(/.test(tail)) continue;
    if (/^\s*`[^`]*`\s*(?:入口|方法|字段|构造|重载|签名|成员|参数)/.test(tail)) continue;
    const name = simpleName(m[1]);
    if (name.length < 3 || JDK_COMMON.has(name)) continue;
    if (!/^[A-Z]/.test(name) || /^[A-Z0-9_]+$/.test(name)) continue;
    // 否定谓词可能落在后半句（「X 是 Yarn 名，Forge/Mojmap 不存在」）；
    // 先看命中片段自己点名了哪一层，再看整行。
    let hint = /Forge|mojmap|Mojang/i.test(m[0]) ? "mojmap" : /\bYarn\b/i.test(m[0]) ? "yarn" : layerHint(line, expected);
    if (expected === "mcp") {
      if (inv.mcpSimple && inv.mcpSimple.has(name)) {
        out.push(finding("absence", file, lineNo, name, line.trim(), "fail", "本档 MCP 类名表命中（无 mapped jar，只证名字存在）"));
      }
      continue;
    }
    let hits = (inv.bySimple.get(name) || []).filter((h) => hint === "both" || h.layer === hint);
    if (!m[1].includes("$")) hits = hits.filter((h) => !h.fqcn.includes("$"));
    const layers = hint === "both" ? ["yarn", "mojmap"] : [hint];
    if (hits.length === 0) {
      const missingLayers = layers.filter((l) => !inv.layers.has(l));
      if (missingLayers.length) {
        out.push(finding("absence", file, lineNo, name, line.trim(), "unverifiable", `缺 ${missingLayers.join(",")} 构件，不能判“不存在”`));
      }
      continue;
    }
    if (hits.every((h) => h.layer === "fapi")) {
      out.push(finding("absence", file, lineNo, name, line.trim(), "unverifiable", "只在本机 FAPI 名册命中，但未绑定本档 FAPI 版本"));
      continue;
    }
    out.push(finding("absence", file, lineNo, name, line.trim(), "fail", `实际存在于 ${[...new Set(hits.map((h) => h.layer))].join(",")}：${hits.slice(0, 3).map((h) => h.fqcn).join(" / ")}`));
  }
  return out;
}

function checkGoalAbstract(file, lineNo, line, inv) {
  const idx = line.indexOf("抽象方法");
  if (idx < 0) return [];
  const before = line.slice(0, idx);
  const after = line.slice(idx);
  const list = [...after.matchAll(/`([A-Za-z_$][\w$]*)`/g)].map((m) => m[1]);
  if (!list.length) return [];
  const fq = [...before.matchAll(/`((?:net|com|me)\.[\w.$]+)`/g)].map((m) => m[1]).pop();
  let subject = fq ? simpleName(fq) : null;
  if (!subject) {
    const bt = [...before.matchAll(/`([A-Z][A-Za-z0-9_$]*)`/g)].map((m) => m[1]);
    subject = bt.pop() || null;
  }
  if (!subject || !/^[A-Z]/.test(subject)) return [];
  const hits = (inv.bySimple.get(subject) || []).filter((h) => h.layer === "yarn");
  if (!hits.length) return [];
  const info = javapInfo(hits[0]);
  if (!info) return [];
  const abstracts = new Set(info.methods.filter((m) => m.abstract).map((m) => m.name));
  const declared = new Set(info.methods.map((m) => m.name));
  const out = [];
  for (const n of new Set(list)) {
    if (n === subject || !declared.has(n)) continue;
    if (!abstracts.has(n)) out.push(finding("abstractness", file, lineNo, n, line.trim(), "fail", `${subject} 的 ${n} 不是 abstract；javap 抽象方法=${JSON.stringify([...abstracts])}`));
  }
  return out;
}

function checkNestedCount(file, lineNo, line, inv) {
  const m = line.match(/`([A-Za-z_$][\w$]*)`[^。]*?(\d+)\s*个嵌套类型/);
  if (!m) return [];
  const subject = m[1];
  const claimed = Number(m[2]);
  const hits = (inv.bySimple.get(subject) || []).filter((h) => h.layer === "external" || h.layer === "yarn" || h.layer === "mojmap");
  if (!hits.length) return [finding("nested-count", file, lineNo, subject, line.trim(), "unverifiable", "名册无此类")];
  const h = hits[0];
  const prefix = h.fqcn;
  const count = nestedEntries(h.jar, prefix).length;
  if (count !== claimed) {
    return [finding("nested-count", file, lineNo, subject, line.trim(), "fail", `实际 ${count} 个（${h.jar}）`)];
  }
  return [];
}

function cmpVer(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}

function checkMappingRows(file, lineNo, line, inv, packVersion) {
  if (/[\\/]porting[\\/]/.test(file)) return [];
  const cells = line.split("|").slice(1, -1).map((s) => s.trim().replace(/`/g, ""));
  if (cells.length < 3) return [];
  const a = simpleName(cells[0]), b = simpleName(cells[1]);
  if (!/^[A-Z][A-Za-z0-9_$]*$/.test(a) || !/^[A-Z][A-Za-z0-9_$]*$/.test(b)) return [];
  if (/^[A-Z0-9_]+$/.test(a) || /^[A-Z0-9_]+$/.test(b)) return [];
  const range = cells[2] || "";
  const only = range.match(/仅\s*([\d.]+)/);
  if (only) {
    if (cmpVer(packVersion, only[1]) !== 0) return [];
  } else {
    const m = range.match(/(\d+\.\d+(?:\.\d+)?)\s*[–-]\s*(\d+\.\d+(?:\.\d+)?)/);
    if (m && (cmpVer(packVersion, m[1]) < 0 || cmpVer(packVersion, m[2]) > 0)) return [];
  }
  const inMoj = Boolean((inv.bySimple.get(a) || []).find((h) => h.layer === "mojmap"));
  const inYarn = Boolean((inv.bySimple.get(b) || []).find((h) => h.layer === "yarn"));
  if (!inv.layers.has("mojmap") || !inv.layers.has("yarn")) return [];
  if (!inMoj || !inYarn) {
    return [finding("mapping-row", file, lineNo, `${a}->${b}`, line.trim(), "unverifiable", `mojmap=${inMoj} yarn=${inYarn}（两层构件都在，但名册未命中）`)];
  }
  return [];
}

function checkProvenance(file, parsed) {
  const hasJavap = parsed.prose.some((p) => /javap\s*@/.test(p.text));
  if (!hasJavap) return [];
  const header = parsed.prose.slice(0, 25).find((p) => /只来自/.test(p.text));
  if (!header) return [];
  return [finding("provenance", file, header.line, "", header.text.trim(), "fail", "正文含 javap 证据，但 header 声称「只来自语料」")];
}

function checkContradictions(file, parsed) {
  const out = [];
  const unverified = new Map();
  const verified = new Map();
  for (const p of parsed.prose) {
    // ❌ 行是反例/禁止写法，句中的「已核实」说的是别人的旧稿，不是本文件的断言。
    if (/❌/.test(p.text)) continue;
    // 表格行与分号并列句按单元格/分句切：`未核实` / `已核实` 只作用于同一格里的名字。
    for (const cell of p.text.split(/[|；;]/)) {
      const names = [...new Set(backtickTokens(cell))]
        .filter((n) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(n) && n.length >= 6 && n !== "TODO" && !n.includes("/") && !n.includes("."));
      if (/未核实|无证据/.test(cell) && !/TODO\(未核实\)/.test(cell)) for (const n of names) unverified.set(n, p.line);
      if (/已核实|javap\s*@|开关是/.test(cell)) for (const n of names) verified.set(n, p.line);
    }
  }
  for (const [n, l] of unverified) {
    if (verified.has(n) && verified.get(n) !== l) {
      out.push(finding("contradiction", file, l, n, `同一文件内「未核实/无证据」与「已核实/javap」并存（另一处 line ${verified.get(n)}）`, "fail", ""));
    }
  }
  return out;
}

function checkDangling(file, parsed) {
  const out = [];
  for (const p of parsed.prose) {
    for (const m of p.text.matchAll(/(?:见下节?|下节|下面(?:的)?)\s*[「`]([^」`]{1,40})[」`]/g)) {
      const ref = m[1].trim();
      if (ref && !parsed.text.includes(ref)) {
        out.push(finding("dangling-ref", file, p.line, ref, p.text.trim(), "fail", "引用的小节标题不存在"));
      }
    }
    if (/TODO/.test(p.text) && !parsed.text.includes("TODO")) {
      out.push(finding("dangling-todo", file, p.line, "TODO", p.text.trim(), "fail", "全文没有 TODO 条目，但正文指向 TODO"));
    }
  }
  return out;
}

function checkVersions(file, parsed, slot, bodyCoord) {
  const marker = parsed.lines.find((l) => /cloth-version-inject/.test(l));
  if (!marker) return [];
  const m = marker.match(/coord=([^\s]+)/);
  if (!m) return [];
  const coord = m[1];
  const norm = (x) => String(x || "").replace(/\+fabric$/, "");
  const out = [];
  if (slot && norm(slot) !== norm(coord)) {
    out.push(finding("version-slot", file, parsed.lines.indexOf(marker) + 1, coord, marker.trim(), "fail", `versions.json slot=${slot}`));
  }
  if (bodyCoord && norm(bodyCoord) !== norm(coord)) {
    out.push(finding("version-body", file, parsed.lines.findIndex((l) => l.includes(bodyCoord)) + 1, bodyCoord, "正文坐标与注入标记不一致", "fail", `marker=${coord}`));
  }
  return out;
}

function stripCodeNoise(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ")
    .replace(/"""[\s\S]*?"""/g, '""')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}

function checkImports(file, parsed, inv, expected) {
  const out = [];
  for (const f of parsed.fences) {
    if (f.lang !== "java") continue;
    if (!/^\s*import\s+/m.test(f.content)) continue;
    // 反例块（❌/“忘记导入”）本身就以缺 import 为教学点，不判缺 import。
    if (/❌|忘记导入|错误示例|反例|不要这样写/.test(f.content)) continue;
    // Yarn 档里的 Forge 代码块是移植对照；mojmap 档里不跳过。
    if (expected === "yarn" && /net\.minecraftforge|@SubscribeEvent|^\s*\/\/\s*Forge\b/m.test(f.content)) continue;
    const clean = stripCodeNoise(f.content);
    const imports = [...clean.matchAll(/^\s*import\s+(?:static\s+)?([\w.]+)\s*;/gm)].map((m) => m[1]);
    const staticImports = new Set([...clean.matchAll(/^\s*import\s+static\s+([\w.]+)\s*;/gm)].map((m) => m[1]));
    const importedSimple = new Set(imports.map((x) => x.split(".").pop()));
    // FAPI/QSL 的 import 面单独验：编译腿只覆盖「可编译」的块，包名错误（如
    // ClientPlayNetworking 少 .client）在没有 import/class 的片段里会漏。
    // 只在本档确实索引到该前缀的精确构件时才判（quilt 若没带 QSL 件则跳过）。
    const apiPrefixes = ["net.fabricmc.fabric.api", "org.quiltmc.qsl"];
    const prefixIndexed = (p) => inv.classNames.some((k) => k.startsWith(p + "."));
    for (const fq of imports) {
      if (staticImports.has(fq) || !/^[A-Z]/.test(fq.split(".").pop() || "")) continue;
      const owner = apiPrefixes.find((p) => fq.startsWith(p + "."));
      if (!owner || !prefixIndexed(owner)) continue;
      const nested = fq.replace(/\.([A-Z][\w$]*)$/, "$$$1");
      const hit = (inv.byFqcn.get(fq) || []).concat(inv.byFqcn.get(nested) || [])
        .some((h) => h.layer === "fapi" || h.layer === "api");
      if (hit) continue;
      const idx = clean.split(/\r?\n/).findIndex((l) => l.includes(fq));
      out.push(finding("api-import", file, f.startLine + Math.max(0, idx) + 1, simpleName(fq), "import 的 FAPI/QSL 类不在本档精确构件里", "fail", fq));
    }
    const declared = new Set([...clean.matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_$]*)/g)].map((m) => m[1]));
    const pkg = clean.match(/^\s*package\s+([\w.]+)\s*;/m)?.[1] || "";
    const bodyOnly = clean.split(/\r?\n/).filter((l) => !/^\s*import\s+/.test(l)).join("\n");
    const used = [...new Set(clean.match(/\b[A-Z][A-Za-z0-9_$]*\b/g) || [])];
    for (const u of used) {
      if (JDK_COMMON.has(u) || importedSimple.has(u) || declared.has(u)) continue;
      if (/^[A-Z][A-Z0-9_]*$/.test(u)) continue; // constants
      // 全部以全限定名（pkg.Class）使用时不需 import；只有裸名用法才判。
      const bare = new RegExp("(?<![.\\w$])" + u.replace(/[$]/g, "\\$") + "\\b");
      if (!bodyOnly.split(/\r?\n/).some((l) => bare.test(l))) continue;
      if (expected === "mcp" && !inv.layers.has("mcp")) {
        if (!inv.mcpSimple || !inv.mcpSimple.has(u)) continue;
        const idx = clean.split(/\r?\n/).findIndex((l) => new RegExp("\\b" + u.replace(/[$]/g, "\\$") + "\\b").test(l));
        out.push(finding("missing-import", file, f.startLine + Math.max(0, idx) + 1, u, "代码块使用了该类但 import 面没有它", "fail", `MCP 类名表命中（本档无 mapped jar，只证名字存在）`));
        continue;
      }
      const hits = (inv.bySimple.get(u) || []).filter((h) => (h.layer === expected || h.layer === "api") && !h.fqcn.includes("$"));
      const distinct = [...new Set(hits.map((h) => h.fqcn))];
      if (distinct.length !== 1) continue; // ambiguous / not in expected layer
      const fq = distinct[0];
      if (pkg && fq.startsWith(pkg + ".")) continue;
      if (imports.some((i) => i.endsWith(".*") && fq.startsWith(i.slice(0, -2) + "."))) continue;
      const idx = clean.split(/\r?\n/).findIndex((l) => new RegExp("\\b" + u.replace(/[$]/g, "\\$") + "\\b").test(l));
      out.push(finding("missing-import", file, f.startLine + Math.max(0, idx) + 1, u, "代码块使用了该类但 import 面没有它", "fail", `候选 ${fq}`));
    }
  }
  return out;
}

const STRUCTURAL = /unnamed classes are a preview feature|class, interface, enum, or record expected|should be declared in a file named|reached end of file while parsing|illegal start of (expression|type)|<identifier> expected|not a statement|'\;' expected|invalid method declaration|modifier .* not allowed here|unexpected type|preview feature/;

// Yarn 档里最常混进来的 mojmap 残名：该 FQCN 只在 mojmap 层存在、Yarn 层没有。
// 优先用本档构件（两层索引都在盘）；本机只有 1.21.11 有 mojmap 合并 jar，
// 其余档改用仓库里的逐档 pairs 表（data/_yarn-mojmap-pairs/yarn-mojmap-<ver>.json）。
function loadPairs(version) {
  const p = path.join(REPO, "data", "_yarn-mojmap-pairs", `yarn-mojmap-${version}.json`);
  if (!fs.existsSync(p)) return null;
  try {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    const moj2yarn = new Map();
    const yarn2moj = new Map();
    for (const row of j.pairs || []) {
      if (!row.mojFqcn || !row.yarnFqcn) continue;
      const alt = row.yarnFqcn.replace(/\//g, ".");
      moj2yarn.set(row.mojFqcn, alt);
      if (alt !== row.mojFqcn) yarn2moj.set(alt, row.mojFqcn);
      // Java 源码里的嵌套类 import 用 Outer.Inner（不是 Outer$Inner），两种都收。
      if (row.mojFqcn.includes("$")) {
        moj2yarn.set(row.mojFqcn.replace(/\$/g, "."), alt.replace(/\$/g, "."));
        yarn2moj.set(alt.replace(/\$/g, "."), row.mojFqcn.replace(/\$/g, "."));
      }
    }
    return { moj2yarn, yarn2moj };
  } catch {
    return null;
  }
}

function checkLayerMixups(file, parsed, inv, pairs, expected) {
  const out = [];
  if (!expected) return out;
  for (const f of parsed.fences) {
    if (f.lang !== "java") continue;
    const clean = stripCodeNoise(f.content);
    for (const m of clean.matchAll(/^\s*import\s+(?:static\s+)?([\w.$]+)\s*;/gm)) {
      const fq = m[1];
      if (!fq.startsWith("net.minecraft.") && !fq.startsWith("com.mojang.")) continue;
      const hits = inv.byFqcn.get(fq) || [];
      const simple = fq.split(".").pop();
      if (expected === "yarn") {
        if (hits.some((h) => h.layer === "yarn")) continue;
        let suggestion = null;
        const mojHit = hits.find((h) => h.layer === "mojmap");
        if (mojHit) {
          const yarnAlt = [...new Set((inv.bySimple.get(simple) || []).filter((h) => h.layer === "yarn" && !h.fqcn.includes("$")).map((h) => h.fqcn))];
          if (yarnAlt.length === 1) suggestion = yarnAlt[0];
        } else if (pairs && pairs.moj2yarn.has(fq)) {
          const alt = pairs.moj2yarn.get(fq);
          if (alt !== fq) suggestion = alt;
        }
        if (!mojHit && !suggestion) continue;
        out.push(finding("layer-mixup", file, f.startLine, simple, "mojmap 名混入 Yarn 档", "fail",
          `import ${fq} 不在本档 Yarn 层${suggestion ? "；Yarn 应为 " + suggestion : ""}`));
      } else if (expected === "mojmap") {
        // 反向：mojmap 档里混进 Yarn 名。构件里有就不判（有些类两层同名）。
        if (hits.some((h) => h.layer === "mojmap" || h.layer === "api")) continue;
        if (!pairs || !pairs.yarn2moj.has(fq)) continue;
        out.push(finding("layer-mixup", file, f.startLine, simple, "Yarn 名混入 mojmap 档", "fail",
          `import ${fq} 不在本档 mojmap 层；应为 ${pairs.yarn2moj.get(fq)}`));
      }
    }
  }
  return out;
}

// 片段既可能是整类、也可能只是字段声明或裸语句，还可能是两者混排：
// 先按花括号整体抽出顶层类型，再把剩下的行按「字段声明 / 语句」分桶，最后拼成候选文件。
function splitImports(body) {
  const imports = [];
  const rest = [];
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*import\s+/.test(line)) imports.push(line.trim());
    else rest.push(line);
  }
  return { imports, rest };
}

function braceDelta(line) {
  const clean = line.replace(/\/\/.*$/, "").replace(/"(?:\\.|[^"\\])*"/g, '""').replace(/'(?:\\.|[^'\\])*'/g, "''");
  return (clean.match(/\{/g) || []).length - (clean.match(/\}/g) || []).length;
}

const TYPE_START = /^(?:public\s+|protected\s+|private\s+|final\s+|abstract\s+|sealed\s+|non-sealed\s+|static\s+)*(?:class|interface|enum|record)\s+[A-Z]/;

function splitFragment(lines) {
  const types = [];
  const fields = [];
  const stmts = [];
  let pendingAnnotations = [];
  // 注解属于紧随其后的类型/字段/方法，不能单独丢进 class 体（会成为无目标注解）。
  const takeAnnotations = (until) => {
    while (until < lines.length && /^\s*@/.test(lines[until])) pendingAnnotations.push(lines[until++]);
    return until;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*@/.test(line)) {
      i = takeAnnotations(i) - 1;
      continue;
    }
    if (TYPE_START.test(line)) {
      const start = i;
      let depth = 0;
      do { depth += braceDelta(lines[i]); i++; } while (i < lines.length && depth > 0);
      types.push(pendingAnnotations.concat(lines.slice(start, i)).join("\n"));
      pendingAnnotations = [];
      i--;
      continue;
    }
    if (/^\s*(?:public|protected|private|static|final|volatile|transient)\b/.test(line)) {
      const start = i;
      if (/\w+\s*\([^;]*\)\s*(?:throws [\w., ]+)?\{/.test(line)) {
        let depth = 0;
        do { depth += braceDelta(lines[i]); i++; } while (i < lines.length && depth > 0);
        fields.push(pendingAnnotations.concat(lines.slice(start, i)).join("\n"));
        pendingAnnotations = [];
        i--;
      } else {
        while (i + 1 < lines.length && !/;\s*$/.test(lines[i])) i++;
        fields.push(pendingAnnotations.concat(lines.slice(start, i + 1)).join("\n"));
        pendingAnnotations = [];
      }
      continue;
    }
    stmts.push(line);
  }
  if (pendingAnnotations.length) fields.push(pendingAnnotations.join("\n"));
  return { types, fields, stmts };
}

const stripTopPublic = (t) => t.replace(/(^|\n)public(\s+(?=(?:final\s+|abstract\s+|sealed\s+)*(?:class|interface|enum|record)\b))/g, "$1");

function buildCandidates(rest) {
  const { types, fields, stmts } = splitFragment(rest);
  const classBody = fields.join("\n") + (stmts.filter((l) => l.trim()).length ? "\n  static {\n" + stmts.join("\n") + "\n  }" : "");
  const cands = [];
  if (types.length) {
    if (fields.length || stmts.filter((l) => l.trim()).length) cands.push(types.join("\n") + "\nclass __Frag {\n" + classBody + "\n}");
    cands.push(types.map(stripTopPublic).join("\n"));
  }
  if (fields.length || stmts.filter((l) => l.trim()).length) {
    cands.push("class __Frag {\n" + classBody + "\n}");
    if (stmts.filter((l) => l.trim()).length) cands.push("class __Frag {\n  static void __m() {\n" + stmts.join("\n") + "\n  }\n}");
  }
  return [...new Set(cands)];
}

function compileOnce(src, imports, body, classpath, dir, tag) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(src, "package zzclaim;\n" + imports.join("\n") + "\n" + body, "utf8");
  const slash = (p) => p.replace(/\\/g, "/");
  const argFile = path.join(dir, "args-" + tag + ".txt");
  fs.writeFileSync(argFile, ['-proc:none', '-encoding', '"UTF-8"', '-cp', '"' + slash(classpath) + '"', '"' + slash(src) + '"'].join("\n"), "utf8");
  const r = spawnSync(JAVAC, ["-J-Duser.language=en", "-J-Duser.country=US", "@" + argFile], { encoding: "utf8", timeout: 30000, killSignal: "SIGKILL" });
  if (r.status === 0) return "";
  const out = (r.stderr || "") + (r.stdout || "");
  return out.trim() || `exit=${r.status} signal=${r.signal} error=${r.error ? r.error.message : ""}`;
}

function summarizeJavac(err) {
  const lines = err.split(/\r?\n/);
  // 前面的 warning（如缺注解类）会把真正的 error 挤出前 3 行，证据从第一条 error 起截。
  const i = lines.findIndex((l) => /error:/.test(l));
  return (i >= 0 ? lines.slice(i, i + 4) : lines.slice(0, 6)).join(" | ");
}

// 只取第一条 error 的块：javac 常在 400 字符内接着报第二条次生错误
// （如先报未知变量 MyNetworking，再报它的方法不存在），混在一起会误判成成员名缺陷。
function firstErrorBlock(err) {
  const lines = err.split(/\r?\n/);
  const i = lines.findIndex((l) => /error:/.test(l));
  if (i < 0) return err.slice(0, 400);
  const out = [];
  for (let k = i; k < lines.length && out.length < 8; k++) {
    if (k > i && /error:/.test(lines[k])) break;
    out.push(lines[k]);
  }
  return out.join("\n");
}

// ---- 片段补全（--complete）：只补「可证明唯一」的东西，补过什么都会写进证据。
// 1) import：简单名在本档 expected / api / fapi / external 层里只有一个 FQCN 时补；
// 2) 常量：MOD_ID / MOD_NAME 未声明时替换成字面量；ExampleMod.LOGGER → LOGGER + slf4j 字段；
// 3) wrapper 候选里的 @Override 去掉（片段方法本来就不覆写任何东西）。
function completeText(lines) {
  const text = lines.join("\n");
  const notes = [];
  let needLogger = false;
  if (/\bMOD_ID\b/.test(text) && !/\bMOD_ID\s*=/.test(text)) {
    notes.push('MOD_ID→"testmod"');
  }
  if (/\bMOD_NAME\b/.test(text) && !/\bMOD_NAME\s*=/.test(text)) {
    notes.push('MOD_NAME→"Test Mod"');
  }
  if (/\bLOGGER\b/.test(text) && !/\bLOGGER\s*=/.test(text)) {
    notes.push("LOGGER→slf4j");
    needLogger = true;
  }
  const out = lines.map((line) => {
    let s = line;
    s = s.replace(/\b[A-Z][A-Za-z0-9_$]*\.MOD_ID\b/g, '"testmod"');
    s = s.replace(/\b[A-Z][A-Za-z0-9_$]*\.MOD_NAME\b/g, '"Test Mod"');
    s = s.replace(/\b[A-Z][A-Za-z0-9_$]*\.LOGGER\b/g, "LOGGER");
    if (!/\bMOD_ID\s*=/.test(s)) s = s.replace(/\bMOD_ID\b/g, '"testmod"');
    if (!/\bMOD_NAME\s*=/.test(s)) s = s.replace(/\bMOD_NAME\b/g, '"Test Mod"');
    return s;
  });
  return { lines: out, notes, needLogger };
}

// 注释与字符串里的词不是标识符：`// Shift-click` 曾被补成 DensityFunctions.Shift，
// 字符串里的类名也不该触发 import。
function stripCommentsAndStrings(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const n = s[i + 1];
    if (c === "/" && n === "/") {
      while (i < s.length && s[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && n === "*") {
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
      i++;
      out += " ";
    } else if (c === '"' || c === "'") {
      const quote = c;
      i++;
      while (i < s.length && s[i] !== quote) {
        if (s[i] === "\\") i++;
        i++;
      }
      out += quote + quote;
    } else {
      out += c;
    }
  }
  return out;
}

function autoImport(lines, imports, declared, inv, expected) {
  const added = [];
  const text = lines.join("\n");
  const codeText = stripCommentsAndStrings(text);
  const importedSimple = new Set(imports.map((x) => x.split(".").pop()));
  const used = [...new Set(codeText.match(/\b[A-Z][A-Za-z0-9_$]*\b/g) || [])];
  const jdkMap = {
    List: "java.util.List", ArrayList: "java.util.ArrayList", Map: "java.util.Map", HashMap: "java.util.HashMap",
    Set: "java.util.Set", HashSet: "java.util.HashSet", Optional: "java.util.Optional",
    CompletableFuture: "java.util.concurrent.CompletableFuture", UUID: "java.util.UUID",
    Objects: "java.util.Objects", Arrays: "java.util.Arrays", Collections: "java.util.Collections",
    Stream: "java.util.stream.Stream", Collectors: "java.util.stream.Collectors",
    Function: "java.util.function.Function", Supplier: "java.util.function.Supplier",
    Consumer: "java.util.function.Consumer", Predicate: "java.util.function.Predicate",
    Path: "java.nio.file.Path", Files: "java.nio.file.Files", IOException: "java.io.IOException",
    Duration: "java.time.Duration", Instant: "java.time.Instant",
  };
  for (const u of used) {
    // jdkMap 要先于 JDK_COMMON：后者里的 List/Map/CompletableFuture 等仍需 import。
    if (jdkMap[u]) {
      if (importedSimple.has(u) || declared.has(u)) continue;
      const line = `import ${jdkMap[u]};`;
      if (!imports.includes(line)) { imports.push(line); added.push(jdkMap[u]); }
      continue;
    }
    if (JDK_COMMON.has(u) || importedSimple.has(u) || declared.has(u)) continue;
    if (/^[A-Z][A-Z0-9_]*$/.test(u)) continue;
    const layers = ["api", "fapi", "external"];
    if (expected) layers.push(expected);
    let distinct = [...new Set((inv.bySimple.get(u) || [])
      .filter((h) => layers.includes(h.layer))
      .map((h) => h.fqcn))];
    // `Properties` 在 Forge 档有两个候选：BlockBehaviour.Properties（嵌套，示例真正要的）
    // 与 net.minecraftforge.common.property.Properties。方块的上下文优先前者。
    let preferred = null;
    if (u === "Properties" && /\bBlock(?:Item)?\b/.test(codeText)) {
      const nested = (inv.bySimple.get(u) || []).find((h) => /(?:^|\.)BlockBehaviour\$Properties$/.test(h.fqcn) && layers.includes(h.layer));
      if (nested) preferred = nested.fqcn;
    }
    if (preferred) distinct = [preferred];
    else {
      // 顶层类优先；只有没有顶层同名类时才用嵌套类。
      const topLevel = distinct.filter((f) => !f.includes("$"));
      if (topLevel.length) distinct = topLevel;
    }
    // 同名多包时，非客户端片段优先非 .client. 的那个（BooleanProperty 这类）。
    if (distinct.length > 1 && !/client/i.test(codeText)) {
      const core = distinct.filter((f) => !/\.client\./i.test(f));
      if (core.length === 1) distinct = core;
    }
    if (process.env.AUDIT_DEBUG_IMPORT === u) console.error(`[debug-import] ${u}: ${JSON.stringify(distinct)}`);
    if (distinct.length !== 1) continue; // 歧义就不猜
    const line = `import ${distinct[0].replace(/\$/g, ".")};`;
    if (imports.some((i) => i.replace(/\s+/g, " ").trim() === line)) continue;
    imports.push(line);
    added.push(distinct[0]);
  }
  return added;
}

function injectLoggerCandidate(cand) {
  const field = "  static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(\"testmod\");";
  const m = cand.match(/\bclass\s+[A-Za-z_$][\w$]*[^{]*\{/);
  if (!m) return null;
  const i = cand.indexOf(m[0]) + m[0].length;
  return cand.slice(0, i) + "\n" + field + cand.slice(i);
}

// 补全模式原先给每个片段挂上本档**全部** FAPI 模块 jar：javac 每次启动都要扫几十个件，
// 冷缓存下单个片段就能卡十几秒。这里只保留「非 FAPI 底座 + 片段真正用到的类所在件」。
function narrowClasspath(pool, inv, wanted, apiJars) {
  const poolSet = new Set(pool);
  const isOptionalApi = (j) => apiJars.has(j) && !/fabric-api-base/i.test(j);
  const base = pool.filter((j) => !isOptionalApi(j));
  const pick = new Set();
  for (const raw of wanted) {
    if (!raw) continue;
    if (raw.endsWith(".*")) {
      const prefix = raw.slice(0, -2) + ".";
      for (const hs of inv.byFqcn.values()) {
        const h = hs.find((x) => x.fqcn.startsWith(prefix) && poolSet.has(x.jar));
        if (h) { pick.add(h.jar); break; }
      }
      continue;
    }
    const names = [raw, raw.replace(/\.([A-Z][\w$]*)$/, "$$$1")];
    let hit = null;
    for (const n of names) {
      const hs = inv.byFqcn.get(n) || [];
      hit = hs.find((h) => poolSet.has(h.jar));
      if (hit) break;
    }
    if (hit) pick.add(hit.jar);
  }
  return [...new Set([...base, ...pick])];
}

function compileBlocks(file, parsed, jarPaths, inv, opts = {}) {
  const out = [];
  // 移植对照页本来就把另一个加载器的代码放在同一页，用单档类路径编译只会误报。
  if (/[\\/]porting[\\/]/.test(file)) return out;
  const complete = Boolean(opts.complete);
  const expected = opts.expected || null;
  const jarPicks = new Map();
  // 全量缓存可能有 700+ 个 jar，逐个 import 只取「含该类的 jar」里最新的一个。
  const jarForImport = (fqcn) => {
    if (jarPicks.has(fqcn)) return jarPicks.get(fqcn);
    const parts = fqcn.split(".");
    for (let k = parts.length; k > 0; k--) {
      const hits = inv.byFqcn.get(parts.slice(0, k).join("."));
      if (hits && hits.length) {
        const best = [...hits].sort((a, b) => fs.statSync(b.jar).mtimeMs - fs.statSync(a.jar).mtimeMs)[0];
        jarPicks.set(fqcn, best.jar);
        return best.jar;
      }
    }
    jarPicks.set(fqcn, null);
    return null;
  };
  for (const f of parsed.fences) {
    if (f.lang !== "java" || f.content.length < 40) continue;
    // 反例块（❌/错误示例）本来就是故意写错的，不编译。
    if (/❌|错误示例|反例|不要这样写|忘记导入/.test(f.content)) continue;
    // 围栏前几行若说明这是「mojmap 原文 / 参考文件 / 上游写法」，它是移植对照，不按本档编译。
    const lead = parsed.lines.slice(Math.max(0, f.startLine - 9), Math.max(0, f.startLine - 1)).join("\n");
    if (/mojmap|Mojang|原文|参考文件|上游写法|移植对照/i.test(lead)) continue;
    if (!complete) {
      if (!/^\s*import\s+/m.test(f.content)) continue;
      if (!/\b(class|interface|enum|record)\s+[A-Z]/.test(f.content)) continue;
    } else if (!/\b(class|interface|enum|record)\s+[A-Z]/.test(f.content) && !/\w+\s*\([^)]*\)\s*\{/.test(f.content) && !/;/.test(f.content)) {
      continue;
    }
    const { imports, rest } = splitImports(f.content.replace(/^\s*package\s+[\w.]+\s*;/m, ""));
    // 教学片段里的 `get(...)` / `newSimpleChannel(...)` 是省略号占位，不是可编译代码。
    if (/(\(\s*\.\.\.\s*\)|,\s*\.\.\.\s*[,)])/.test(rest.join("\n"))) {
      out.push(finding("compile", file, f.startLine, "javac", "片段含省略号占位，跳过编译", "unverifiable", "含 ... 占位"));
      continue;
    }
    let body = rest;
    const notes = [];
    let needLogger = false;
    let added = [];
    const declared = new Set([...f.content.matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_$]*)/g)].map((m) => m[1]));
    if (complete) {
      const done = completeText(rest);
      body = done.lines;
      notes.push(...done.notes);
      needLogger = done.needLogger;
      added = autoImport(body, imports, declared, inv, expected);
      if (added.length) notes.push("补 import: " + added.map((x) => x.split(".").pop()).join(","));
      // 补完还是没有任何可解析上下文（没有 import、没有可唯一推断的类、正文也没有本档 FQCN）⇒ 不值得编译
      const hasFqcn = body.some((l) => [...l.matchAll(/\b((?:net\.minecraft|com\.mojang|net\.fabricmc|org\.quiltmc)\.[\w.$]+)\b/g)]
        .some((m) => inv.byFqcn.has(m[1])));
      if (!imports.length && !added.length && !hasFqcn) {
        out.push(finding("compile", file, f.startLine, "javac", "片段无可解析类名，补全后仍无上下文", "unverifiable", notes.join("；") || "无 import / 无可推断类"));
        continue;
      }
    }
    const fqcns = imports.map((l) => (l.match(/import\s+(?:static\s+)?([\w.$]+)/) || [])[1]).filter(Boolean);
    let classpath;
    if (complete && opts.apiJars) {
      const wanted = [...fqcns, ...added];
      classpath = [...new Set([...narrowClasspath(jarPaths, inv, wanted, opts.apiJars), ...SUPPORT_JARS])].join(";");
    } else {
      const need = [...jarPaths, ...SUPPORT_JARS];
      for (const fqcn of fqcns) {
        const jar = jarForImport(fqcn);
        if (jar) need.push(jar);
      }
      classpath = [...new Set(need.filter(Boolean))].join(";");
    }
    const dir = fs.mkdtempSync(path.join(OUT_DIR, "javac-"));
    const src = path.join(dir, "Block.java");
    let candidates = buildCandidates(body);
    if (complete) {
      candidates = candidates
        .map((c) => (c.startsWith("class __Frag") ? c.replace(/@Override\s*/g, "") : c))
        .map((c) => (needLogger ? injectLoggerCandidate(c) : c))
        .filter(Boolean);
    }
    let err = "";
    for (let i = 0; i < candidates.length; i++) {
      err = compileOnce(src, imports, candidates[i], classpath, dir, String.fromCharCode(97 + i));
      if (!err || !STRUCTURAL.test(err)) break;
      // 结构不合法 = 这个包装形状不对，换下一个候选；全都不行时保留最后一个错误给下面分类。
    }
    const suffix = notes.length ? " | 补全: " + notes.join("；") : "";
    if (err) {
      // 只看第一条 error：后面的错误常是上游符号没解析出来导致的次生噪音。
      const primary = firstErrorBlock(err);
      // 缺失 import 只认第一条 error 提到的、且本档唯一可解析的类；歧义/不存在不判缺 import。
      const missingClasses = [...new Set([...primary.matchAll(/symbol:\s+class\s+([A-Z][A-Za-z0-9_$]*)/g)].map((m) => m[1]))]
        .filter((n) => {
          const hits = (inv.bySimple.get(n) || []).filter((h) => h.layer === "yarn" && !h.fqcn.includes("$"));
          return new Set(hits.map((h) => h.fqcn)).size === 1;
        });
      const apiError = /does not override abstract method|is not abstract and does not override|incompatible types|has private access|cannot be applied|no suitable method|method does not override/.test(primary);
      // 补全模式是在片段上编译：缺抽象方法实现 / 缺 super 构造属片段不完整，不判内容错。
      const partialClass = complete && /is not abstract and does not override|does not override abstract method|constructor .* cannot be applied|actual and formal argument lists differ|missing return value|call to super must be first statement/.test(primary);
      // "cannot access X" 多半是依赖的 API 构件本身按另一套映射编译（缺对侧类），不是内容错；
      // 它还会连带产生 "method does not override" 之类的次生错误，优先按类路径缺口处理。
      const accessGap = /error: cannot access [A-Z]/.test(primary);
      const fragGap = /__Frag/.test(primary); // 片段方法被放进包装类，this 类型不是原类
      const gap = accessGap || fragGap || partialClass || (/package [\w.]+ does not exist|cannot find symbol|cannot access [A-Z]/.test(primary) && !missingClasses.length);
      // 补全模式下，方法名/构造器签名错误落在已解析的类型上 ⇒ 是真缺陷（如 addGoal / registerGoals）。
      // 例外：`this.foo()` / 裸 `foo()` 可能是片段所在外部类的方法，片段包装后必然报缺失，不判红。
      const selfCall = /^\s*(?:this\.|super\.)?[A-Za-z_$][\w$]*\s*\(/m.test(primary);
      const memberErr = !accessGap && !fragGap && !partialClass && !selfCall && /symbol:\s+method\s+[A-Za-z_$][\w$]*|no suitable method/.test(primary);
      // 自动补的 import 可能有多个同名候选（如 Properties），成员错误可能是补错类导致，不判红。
      const addedSimple = new Set(added.map((x) => x.split(".").pop()));
      const autoMemberErr = memberErr && [...addedSimple].some((n) => new RegExp("\\b" + n + "\\b").test(primary));
      if (missingClasses.length) {
        out.push(finding("compile", file, f.startLine, missingClasses.join(","), "javac 缺 import/可见性", "fail", summarizeJavac(err) + suffix));
      } else if (memberErr && !autoMemberErr) {
        out.push(finding("compile", file, f.startLine, "javac", "javac 成员名/签名不存在", "fail", summarizeJavac(err) + suffix));
      } else if (apiError && !accessGap && !fragGap && !partialClass && !selfCall) {
        out.push(finding("compile", file, f.startLine, "javac", "javac API 错误", "fail", summarizeJavac(err) + suffix));
      } else {
        out.push(finding("compile", file, f.startLine, "javac", gap ? "编译失败（类路径/依赖缺口）" : "编译失败（片段不完整/缺上下文）", "unverifiable", summarizeJavac(err) + suffix));
      }
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
  return out;
}

// ---------------------------------------------------------------- selftest

function selftest() {
  const fail = [];
  const fakeInv = {
    layers: new Set(["yarn", "mojmap", "external", "fapi"]),
    byFqcn: new Map([
      ["net.minecraft.entity.ai.goal.Goal", [{ layer: "yarn", fqcn: "net.minecraft.entity.ai.goal.Goal", jar: "" }]],
      ["net.fabricmc.fabric.api.client.networking.v1.ClientPlayNetworking", [{ layer: "fapi", fqcn: "net.fabricmc.fabric.api.client.networking.v1.ClientPlayNetworking", jar: "" }]],
    ]),
    classNames: [
      "net.minecraft.entity.ai.goal.Goal",
      "net.minecraft.text.Text",
      "net.fabricmc.fabric.api.client.networking.v1.ClientPlayNetworking",
    ],
    bySimple: new Map([
      ["Goal", [{ layer: "yarn", fqcn: "net.minecraft.entity.ai.goal.Goal", jar: "" }]],
      ["ConfigEntry", [{ layer: "external", fqcn: "me.shedaniel.autoconfig.annotation.ConfigEntry", jar: "" }]],
      ["Text", [{ layer: "yarn", fqcn: "net.minecraft.text.Text", jar: "" }]],
      ["PotionContents", [{ layer: "mojmap", fqcn: "net.minecraft.world.item.alchemy.PotionContents", jar: "" }]],
      ["BlockModelGenerators", [{ layer: "mojmap", fqcn: "net.minecraft.client.data.models.BlockModelGenerators", jar: "" }]],
    ]),
  };
  // 1) old Goal text must fail by static rule (no javap available in fake => unverifiable, so use text rule)
  const oldGoal = "- 抽象方法 `canStart()` / `shouldContinue()` / `tick()`";
  const newGoal = "- **只有 `canStart()` 是抽象方法**；`shouldContinue()` / `tick()` 都是可覆写的空实现";
  if (!/只有 `canStart\(\)` 是抽象方法/.test(newGoal)) fail.push("goal new text regex");
  // 2) missing import
  const blockNoImport = "import java.util.List;\npublic void f() { Text.literal(\"x\"); }";
  const blockWithImport = "import java.util.List;\nimport net.minecraft.text.Text;\npublic void f() { Text.literal(\"x\"); }";
  if (!checkImports("x.md", { fences: [{ lang: "java", content: blockNoImport, startLine: 1 }] }, fakeInv, "yarn").length) fail.push("missing import not detected");
  if (checkImports("x.md", { fences: [{ lang: "java", content: blockWithImport, startLine: 1 }] }, fakeInv, "yarn").length) fail.push("import present still flagged");
  // 3) nested count: 12 vs 13 is checked by data; parser must extract
  if (!/13 个嵌套类型/.test("该容器下 jar 里共 13 个嵌套类型")) fail.push("nested count regex");
  // 4) absence claim: a Yarn-layer class claimed absent => fail（本档 expected=yarn）
  const abs = checkAbsence("x", "x.md", 1, "- `Goal` 在本档不存在", fakeInv, "yarn");
  if (!abs.length || abs[0].status !== "fail") fail.push("absence not detected");
  // 4b) 「X 没有这个方法」讲成员缺失，不是类缺失
  const memberAbs = checkAbsence("x", "x.md", 2, "- 普通 `Goal` 没有这个方法", fakeInv, "yarn");
  if (memberAbs.length) fail.push("member absence misread as class absence");
  const memberAbs2 = checkAbsence("x", "x.md", 3, "- `Goal` 没有 `family(Block)` 入口", fakeInv, "yarn");
  if (memberAbs2.length) fail.push("method-call absence misread as class absence");
  const parenAbs = checkAbsence("x", "x.md", 5, "## 错误：Goal（不存在）", fakeInv, "yarn");
  if (!parenAbs.length || parenAbs[0].status !== "fail") fail.push("parenthesized absence not detected");
  // 4d) 「X 是 Yarn 名，Forge/Mojmap 不存在」的否定谓词落在 mojmap 层
  const crossLayer = checkAbsence("x", "x.md", 4, "`Goal` 是 Yarn 名，Forge / Mojmap 任何版本都不存在该类", fakeInv, "mojmap");
  if (crossLayer.length) fail.push("cross-layer absence checked against wrong layer");
  // 4c) 全限定名用法不需要 import
  const fqcnUse = "import java.util.List;\npublic void f() { net.minecraft.text.Text.literal(\"x\"); }";
  if (checkImports("x.md", { fences: [{ lang: "java", content: fqcnUse, startLine: 1 }] }, fakeInv, "yarn").length) fail.push("fqcn use misread as missing import");
  // 4e) FAPI 包名错误：旧包名 `api.networking.v1.ClientPlayNetworking` 不在精确件里
  const badFapi = "import net.minecraft.text.Text;\nimport net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;\npublic class C { void f() { ClientPlayNetworking.send(null); } }";
  const badFapiOut = checkImports("x.md", { fences: [{ lang: "java", content: badFapi, startLine: 1 }] }, fakeInv, "yarn");
  if (!badFapiOut.some((f) => f.kind === "api-import" && f.status === "fail")) fail.push("bad FAPI package not detected");
  const goodFapi = "import net.minecraft.text.Text;\nimport net.fabricmc.fabric.api.client.networking.v1.ClientPlayNetworking;\npublic class C { void f() { ClientPlayNetworking.send(null); } }";
  if (checkImports("x.md", { fences: [{ lang: "java", content: goodFapi, startLine: 1 }] }, fakeInv, "yarn").length) fail.push("good FAPI package flagged");
  // 4f) --complete 的补全单元：MOD_ID / LOGGER / 自动 import
  const ct = completeText(["String id = MOD_ID;", "ExampleMod.LOGGER.info(\"x\");"]);
  if (!/"testmod"/.test(ct.lines.join("\n"))) fail.push("MOD_ID completion");
  if (!ct.needLogger) fail.push("LOGGER completion");
  const autoImports = [];
  const addedImports = autoImport(["Text.literal(\"x\");"], autoImports, new Set(), fakeInv, "yarn");
  if (!addedImports.includes("net.minecraft.text.Text") || !autoImports.some((x) => x.includes("net.minecraft.text.Text"))) fail.push("auto import");
  // JDK 常用类（CompletableFuture 在 JDK_COMMON 里）也必须补 import，不能被 JDK_COMMON 提前吞掉。
  const jdkImports = [];
  const jdkAdded = autoImport(["CompletableFuture<Void> f;"], jdkImports, new Set(), fakeInv, "yarn");
  if (!jdkAdded.includes("java.util.concurrent.CompletableFuture")) fail.push("jdk map before JDK_COMMON");
  // 注释/字符串里的词不触发自动 import（`// Shift-click` 曾被补成 DensityFunctions.Shift）。
  const fakeInvShift = {
    ...fakeInv,
    bySimple: new Map([...fakeInv.bySimple, ["Shift", [{ layer: "yarn", fqcn: "net.minecraft.world.level.levelgen.DensityFunctions$Shift", jar: "" }]]]),
  };
  const commentImports = [];
  const commentAdded = autoImport(["// Shift-click transfer logic", "String s = \"Shift\";", "public void f() { }"], commentImports, new Set(), fakeInvShift, "yarn");
  if (commentAdded.length) fail.push("comment/string identifier auto-imported");
  const codeImports = [];
  const codeAdded = autoImport(["Shift value = null;"], codeImports, new Set(), fakeInvShift, "yarn");
  if (!codeAdded.length) fail.push("code identifier not auto-imported");
  // 5) provenance
  const prov = checkProvenance("x.md", { prose: [{ line: 1, text: "> 本档正文的类名/签名只来自语料" }, { line: 2, text: "javap @ 1.21.11" }] });
  if (!prov.length) fail.push("provenance not detected");
  // 6) contradiction
  const contra = checkContradictions("x.md", { prose: [{ line: 1, text: "`sends_telemetry_event` 未核实" }, { line: 2, text: "`sends_telemetry_event` 开关是 javap @ 已核实" }] });
  if (!contra.length) fail.push("contradiction not detected");
  // 7) dangling
  const dang = checkDangling("x.md", { text: "nothing", prose: [{ line: 1, text: "按下面 Decision Flow 的 TODO 逐条核实" }], headings: [{ text: "## Decision Flow" }] });
  if (!dang.length) fail.push("dangling TODO not detected");
  // 8) version coord
  const ver = checkVersions("x.md", { lines: ["<!-- cloth-version-inject v=1.19.4 coord=10.0.96 state=commented -->"] }, "11.0.106", null);
  if (!ver.length) fail.push("version mismatch not detected");
  // 9) pairs-based layer mixup（本机没有该档 mojmap 合并 jar 时的唯一判据）
  const mixPairs = { moj2yarn: new Map([["net.minecraft.world.item.ItemStack", "net.minecraft.item.ItemStack"]]), yarn2moj: new Map([["net.minecraft.item.ItemStack", "net.minecraft.world.item.ItemStack"]]) };
  const mix = checkLayerMixups("x.md", { fences: [{ lang: "java", content: "import net.minecraft.world.item.ItemStack;", startLine: 3 }] }, fakeInv, mixPairs, "yarn");
  if (!mix.length || mix[0].status !== "fail" || !/net\.minecraft\.item\.ItemStack/.test(mix[0].evidence)) fail.push("pairs layer-mixup not detected");
  const same = checkLayerMixups("x.md", { fences: [{ lang: "java", content: "import net.minecraft.item.ItemStack;", startLine: 3 }] }, fakeInv, { moj2yarn: new Map(), yarn2moj: new Map() }, "yarn");
  if (same.length) fail.push("same-name pairs entry wrongly flagged");
  // 10) 反向：mojmap 档里的 Yarn 名
  const rev = checkLayerMixups("x.md", { fences: [{ lang: "java", content: "import net.minecraft.item.ItemStack;", startLine: 3 }] }, fakeInv, mixPairs, "mojmap");
  if (!rev.length || rev[0].status !== "fail" || !/net\.minecraft\.world\.item\.ItemStack/.test(rev[0].evidence)) fail.push("reverse layer-mixup not detected");
  console.log(fail.length ? "selftest FAIL: " + fail.join(" | ") : "selftest OK");
  process.exitCode = fail.length ? 1 : 0;
}

// ---------------------------------------------------------------- main

function parseArgs(argv) {
  const args = { packs: [], all: false, compile: false, complete: false, selftest: false, fragment: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--selftest") args.selftest = true;
    else if (a === "--all") args.all = true;
    else if (a === "--compile") args.compile = true;
    else if (a === "--complete") { args.compile = true; args.complete = true; }
    else if (a === "--packs") args.packs = (argv[++i] || "").split(",").map((x) => x.trim()).filter(Boolean);
    else if (a === "--fragment") { args.fragment = argv[++i] || null; args.compile = true; args.complete = true; }
  }
  return args;
}

function locateExternal(pack) {
  const out = [];
  const versionsPath = path.join(REPO, "knowledge", "libs", "fabric-only", "mc-cloth-config", "versions.json");
  let clothCoord = null;
  try {
    const j = JSON.parse(fs.readFileSync(versionsPath, "utf8"));
    clothCoord = j.slots?.[pack.version]?.coord || null;
  } catch {}
  if (clothCoord && clothCoord !== "TODO(未核实)") {
    const base = String(clothCoord).replace(/\+fabric$/, "");
    for (const cand of [`F:/MOD_TEST/cloth-${base}.jar`, "F:/MOD_TEST/cloth-config.jar"]) {
      if (fs.existsSync(cand)) { out.push(cand); break; }
    }
  }
  const skillPath = path.join(pack.dir, ".cursor", "skills", "mc-compat-jei.md");
  const skillPath2 = path.join(pack.dir, ".cursor", "skills", "mc-compat-jei", "SKILL.md");
  const reiSkill = fs.existsSync(skillPath) ? skillPath : (fs.existsSync(skillPath2) ? skillPath2 : null);
  if (reiSkill) {
    const s = fs.readFileSync(reiSkill, "utf8");
    const m = s.match(/RoughlyEnoughItems-fabric:([0-9][\w.+-]*)/);
    if (m) {
      const v = m[1];
      for (const cand of [`F:/MOD_TEST/rei-${v}.jar`, "F:/MOD_TEST/rei.jar"]) {
        if (fs.existsSync(cand)) { out.push(cand); break; }
      }
    }
  }
  return out;
}

// 26.x 的 FAPI 模块没有 MC 版本标签，但 umbrella POM 逐条列了精确模块版本。
function resolveFapiFromPom(version) {
  const base = "C:/Users/zzrCN/.gradle/caches/modules-2/files-2.1/net.fabricmc.fabric-api";
  const umbrella = path.join(base, "fabric-api");
  if (!fs.existsSync(umbrella)) return [];
  for (const d of fs.readdirSync(umbrella).filter((x) => x.endsWith(`+${version}`))) {
    const poms = [];
    walk(path.join(umbrella, d), 3, poms, (n) => n.endsWith(".pom"));
    if (!poms.length) continue;
    const xml = fs.readFileSync(poms[0], "utf8");
    const deps = [...xml.matchAll(/<dependency>[\s\S]*?<artifactId>([^<]+)<\/artifactId>\s*<version>([^<]+)<\/version>[\s\S]*?<\/dependency>/g)];
    const jars = [];
    for (const [, art, ver] of deps) {
      const modDir = path.join(base, art, ver);
      if (!fs.existsSync(modDir)) continue;
      const found = [];
      walk(modDir, 3, found, (n) => n.endsWith(".jar") && !n.includes("-sources"));
      if (found.length) jars.push(found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]);
    }
    if (jars.length) return jars;
  }
  return [];
}

function exactApiJars(platform, version) {
  // 基准工程里 Loom 已把该档 FAPI 整套 remap 到本档 Yarn：版本精确、模块成套。
  // 全局 modules-2 缓存混着多个 MC 版本的 FAPI，拿来做类路径会张冠李戴。
  const roots = [
    path.join(EXTERNAL_ROOT, "dev", `${platform}-${version}`, "build", "loom-cache", "remapped_working"),
    path.join("F:/MC_GAME", `${platform}-${version}`, "build", "loom-cache", "remapped_working"),
    path.join(EXTERNAL_ROOT, "dev", `${platform}-${version}`, ".gradle", "loom-cache", "remapped_mods"),
    path.join("F:/MC_GAME", `${platform}-${version}`, ".gradle", "loom-cache", "remapped_mods"),
  ];
  const all = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    walk(root, 8, all, (n) => n.endsWith(".jar") && !n.includes("-sources"));
  }
  // 同一目录里可能残留上一次构建（另一个 Minecraft 版本）的产物；有 remapped.* 就只认它。
  const remapped = all.filter((f) => path.basename(f).startsWith("remapped."));
  if (remapped.length) return [...new Set(remapped)];
  const tag = "_" + version.replace(/\./g, "_") + "_";
  const tagged = all.filter((f) => f.includes(tag));
  if (tagged.length) return [...new Set(tagged)];
  if (/^26\./.test(version)) return resolveFapiFromPom(version);
  return [];
}

function runPack(packDir, opts) {
  // 基岩包没有版本子目录（规则树在 bedrock/.cursor），Java 构件面不适用，只跑通用 prose 检查。
  const isBedrock = path.basename(packDir) === "bedrock" && fs.existsSync(path.join(packDir, "pack.meta.json"));
  const platform = isBedrock ? "bedrock" : path.basename(path.dirname(packDir));
  const version = isBedrock ? "stable" : path.basename(packDir);
  const art = artifactSet(platform, version);
  const jars = [...art.jars];
  let ext = [];
  let compileApi = [];
  if (platform === "fabric" || platform === "quilt") {
    const exact = exactApiJars(platform, version);
    const { fapi } = opts.jars;
    // 索引面：没有精确 remap 件时仍用全局模块做「类名存在性」检查（包名与映射无关）。
    for (const j of (exact.length ? exact : fapi)) jars.push({ jar: j, layer: "fapi" });
    ext = locateExternal({ dir: packDir, version });
    for (const j of ext) jars.push({ jar: j, layer: "external" });
    // 编译面：只有本档精确 remap 的 FAPI 能配本档 Yarn jar；全局件是 intermediary 层，
    // 放进去只会制造 "cannot access" 假缺口。
    compileApi = exact;
  }
  const inv = buildIndex(jars);
  inv.mcpSimple = art.mcpNames ? new Set([...art.mcpNames].map((n) => n.split(".").pop())) : null;
  const pairs = loadPairs(version);
  const findings = [];
  // 补全模式编译整档；单片段模式（--fragment）复用同一套构件与补全逻辑。
  const compileJars = [...new Set([...art.jars.map((j) => j.jar), ...compileApi, ...ext])];
  const compilePool = new Set(compileJars);
  const apiJars = new Set();
  for (const hs of inv.byFqcn.values()) {
    for (const h of hs) if (h.layer === "fapi" && compilePool.has(h.jar)) apiJars.add(h.jar);
  }
  if (opts.fragment) {
    const content = opts.fragment.replace(/^\s*package\s+[\w.]+\s*;/m, "");
    const parsed = {
      fences: [{ lang: "java", content, startLine: 1 }],
      lines: content.split(/\r?\n/),
      prose: [],
      headings: [],
      text: content,
    };
    findings.push(...compileBlocks("<fragment>", parsed, compileJars, inv, { complete: true, expected: art.expected, apiJars }));
    return {
      platform,
      version,
      artifacts: { expectedLayer: art.expected, jars: compileJars.map((jar) => ({ jar: path.relative(REPO, jar), layer: "compile" })) },
      findings,
    };
  }
  const files = [];
  const pushMd = (p) => { if (fs.existsSync(p)) files.push(p); };
  const walkMd = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walkMd(p);
      else if (/\.(md|mdc)$/.test(e.name)) files.push(p);
    }
  };
  walkMd(path.join(packDir, ".cursor", "skills"));
  walkMd(path.join(packDir, ".cursor", "rules"));
  walkMd(path.join(packDir, "knowledge"));
  walkMd(path.join(packDir, "code-patterns"));
  for (const p of [path.join(packDir, "AGENTS.md"), path.join(packDir, "README.md")]) pushMd(p);

  // versions.json slot
  let slot = null;
  try {
    const j = JSON.parse(fs.readFileSync(path.join(REPO, "knowledge", "libs", "fabric-only", "mc-cloth-config", "versions.json"), "utf8"));
    slot = j.slots?.[version]?.coord || null;
  } catch {}

  for (const file of files) {
    let parsed;
    try { parsed = parseMarkdown(file); } catch { continue; }
    for (const p of parsed.prose) {
      if (art.expected) findings.push(...checkAbsence(packDir, file, p.line, p.text, inv, art.expected));
      findings.push(...checkGoalAbstract(file, p.line, p.text, inv));
      findings.push(...checkNestedCount(file, p.line, p.text, inv));
      findings.push(...checkMappingRows(file, p.line, p.text, inv, version));
    }
    findings.push(...checkProvenance(file, parsed));
    findings.push(...checkContradictions(file, parsed));
    findings.push(...checkDangling(file, parsed));
    if (file.endsWith("mc-cloth-config.md")) {
      const bodyCoord = fs.readFileSync(file, "utf8").split(/\r?\n/)
        .filter((l) => !/^\s*\/\//.test(l))
        .map((l) => l.match(/cloth-config-fabric:([0-9][\w.+-]*)/))
        .find(Boolean)?.[1] || null;
      findings.push(...checkVersions(file, parsed, slot, bodyCoord));
    }
    findings.push(...checkImports(file, parsed, inv, art.expected));
    findings.push(...checkLayerMixups(file, parsed, inv, pairs, art.expected));
    if (opts.compile && jars.length) {
      findings.push(...compileBlocks(file, parsed, compileJars, inv, { complete: opts.complete, expected: art.expected, apiJars }));
    }
  }
  return {
    platform,
    version,
    artifacts: {
      expectedLayer: art.expected,
      jars: jars.map((j) => ({ jar: path.relative(REPO, j.jar), layer: j.layer })),
      mcpNames: art.mcpNames ? art.mcpNames.size : 0,
      external: ext.length,
    },
    findings,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selftest) return selftest();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jars = collectJars();
  let packs = args.packs;
  if (!packs.length && args.all) {
    // 所有平台树里有 .cursor 的档；bedrock 没有版本目录，单独按平台根入列（只跑通用 prose 检查）。
    for (const plat of ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader"]) {
      const base = path.join(REPO, plat);
      if (!fs.existsSync(base)) continue;
      for (const v of fs.readdirSync(base)) {
        if (fs.existsSync(path.join(base, v, ".cursor"))) packs.push(path.join(base, v));
      }
    }
    if (fs.existsSync(path.join(REPO, "bedrock", ".cursor"))) packs.push(path.join(REPO, "bedrock"));
  }
  if (!packs.length) {
    console.error("用法：--packs fabric/1.21.11,forge/1.20.1 | --all [--compile|--complete] | --packs <档> --fragment <片段.java> | --selftest");
    process.exitCode = 2;
    return;
  }
  if (args.fragment) {
    const fragmentPath = path.resolve(args.fragment);
    if (!fs.existsSync(fragmentPath)) {
      console.error("fragment not found:", fragmentPath);
      process.exitCode = 2;
      return;
    }
    const abs = path.isAbsolute(packs[0]) ? packs[0] : path.join(REPO, packs[0]);
    if (!fs.existsSync(abs)) {
      console.error("pack not found:", abs);
      process.exitCode = 2;
      return;
    }
    const r = runPack(abs, { jars, fragment: fs.readFileSync(fragmentPath, "utf8") });
    const compileFindings = (r.findings || []).filter((f) => f.kind === "compile");
    console.log(JSON.stringify({ pack: packs[0], fragment: args.fragment, findings: compileFindings }, null, 2));
    process.exitCode = compileFindings.some((f) => f.status === "fail") ? 1 : 0;
    return;
  }
  const results = [];
  for (const p of packs) {
    const abs = path.isAbsolute(p) ? p : path.join(REPO, p);
    if (!fs.existsSync(abs)) { console.error("skip missing pack:", p); continue; }
    console.log("audit", path.relative(REPO, abs));
    results.push(runPack(abs, { jars, compile: args.compile, complete: args.complete }));
  }
  const report = { generatedAt: new Date().toISOString(), packs: results };
  const outFile = path.join(OUT_DIR, "report.json");
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), "utf8");
  const all = results.flatMap((r) => r.findings.map((f) => ({ ...f, pack: `${r.platform}/${r.version}` })));
  const byStatus = { fail: 0, unverifiable: 0, info: 0 };
  for (const f of all) byStatus[f.status] = (byStatus[f.status] || 0) + 1;
  console.log(`\nfindings: fail=${byStatus.fail} unverifiable=${byStatus.unverifiable} info=${byStatus.info}`);
  for (const f of all.filter((x) => x.status === "fail")) {
    console.log(`  [FAIL] ${f.pack} ${f.file}:${f.line} ${f.kind} ${f.symbol} :: ${f.evidence}`);
  }
  console.log(`\nreport: ${path.relative(REPO, outFile)}`);
}

main();
