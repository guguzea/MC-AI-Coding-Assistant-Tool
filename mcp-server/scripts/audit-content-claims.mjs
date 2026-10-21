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
 *   node mcp-server/scripts/audit-content-claims.mjs --hygiene [--packs <档>]
 *   node mcp-server/scripts/audit-content-claims.mjs --selftest
 *
 * 输出：temp/content-audit/report.json + 终端摘要。
 * 依赖：Node 22+；本机 JDK（javap/javac）用于真构件取证与可选的逐块编译。
 * 只读：不写 fabric/、data/、mcp-server/data/。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
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
// 2026-10-21 修正（审查：已跟踪文件里带本机用户名/绝对路径）：原写死
// `<home>/.gradle/...` 这类写死路径 ⇒ 换一台机器全断，且把维护者用户名与目录结构写进公开仓。
// 现按 `GRADLE_USER_HOME`（Gradle 官方环境变量，缺省 `~/.gradle`）推导，零硬编码。
const GRADLE_HOME = process.env.GRADLE_USER_HOME || path.join(os.homedir(), ".gradle");
const CACHE_MODULES = path.join(GRADLE_HOME, "caches/modules-2/files-2.1").replace(/\\/g, "/");
const MODULES = CACHE_MODULES;
const LOOM = path.join(GRADLE_HOME, "caches/fabric-loom/minecraftMaven/net/minecraft").replace(/\\/g, "/");
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
  // java.lang.reflect 的常用名：MC 里也有叫 `Method` 的 mojmap 类，不排会撞（见 mojmapCandidateNames 注释）。
  "Method", "Field", "Constructor", "Modifier",
]);

// MC 的类型签名会引用 DFU / brigadier / netty 的接口（如 Registry implements Keyable、
// FriendlyByteBuf 继承 ByteBuf），javac 需要它们才能判定；否则会把真实错误埋进 "cannot access"。
function newestModuleJar(group, artifact) {
  const base = path.join(CACHE_MODULES, group, artifact);
  if (!fs.existsSync(base)) return null;
  const cands = [];
  walk(base, 3, cands, (n) => n.endsWith(".jar") && !n.includes("-sources"));
  return cands.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
}

// 【判据缺口，非内容缺陷】§ 支撑件：加载器的注解/事件总线/注入框架不在 MC 合并 jar 里，
// 少了它们，`@SubscribeEvent` / `@Mixin` / `Dist` / `IEventBus` 一律报 cannot find symbol，
// 被错误归成 "unverifiable（类路径缺口）" —— 那是工具侧缺口，不是内容不能判。
// 逐档按该版本真实的 userdev config.json / loom remapClasspath.txt 取件（见 supportJarsFor）。
function moduleVersionDirs(group, artifact) {
  const base = path.join(CACHE_MODULES, group, artifact);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter((d) => {
    try { return fs.statSync(path.join(base, d)).isDirectory(); } catch { return false; }
  });
}

// 版本串排序（1.20.1-47.4.10 > 1.20.1-47.4.0；6.2.33 > 6.0.5）。只用于在候选里挑最接近的。
function verCmp(a, b) {
  const pa = String(a).split(/[.+\-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : x));
  const pb = String(b).split(/[.+\-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : x));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i], y = pb[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (typeof x === "number" && typeof y === "number") { if (x !== y) return x - y; continue; }
    const s = String(x).localeCompare(String(y));
    if (s) return s;
  }
  return 0;
}

// 在模块缓存里按「版本前缀 + 版本序最近」拿一个 jar。前缀形如 `1.20.1-` / `6.`。
function pickModuleJar(group, artifact, { prefix, exact, preferHigher } = {}) {
  const base = path.join(CACHE_MODULES, group, artifact);
  if (!fs.existsSync(base)) return null;
  let vers = moduleVersionDirs(group, artifact);
  if (exact) vers = vers.filter((v) => v === exact);
  else if (prefix) vers = vers.filter((v) => v.startsWith(prefix));
  if (!vers.length) return null;
  vers.sort(verCmp);
  const ordered = preferHigher === false ? vers : [...vers].reverse();
  for (const v of ordered) {
    const jar = newestJarIn(path.join(base, v));
    if (jar) return jar;
  }
  return null;
}

// ---------------------------------------------------------------- 支撑件「近似」记账
// 【为什么要有这一块】支撑件是「编译面近似」：本档真件缺盘时用邻近版本顶替，能让 javac 编过，
// 但也可能让**本档其实没有的成员**编过 ⇒ 把真缺陷藏起来，使 unverifiable 降得比实际更多。
// 所以每次顶替都**记账**，并随该档结果一起写进报告（`support.approximations`），不再静默。
const SUPPORT_APPROX = new Map(); // "platform/version" -> [{artifact, want, got, kind}]
function resetSupportApprox(platform, version) { SUPPORT_APPROX.set(`${platform}/${version}`, []); }
function noteApprox(platform, version, artifact, want, got, kind) {
  const key = `${platform}/${version}`;
  if (!SUPPORT_APPROX.has(key)) SUPPORT_APPROX.set(key, []);
  SUPPORT_APPROX.get(key).push({ artifact, want, got, kind });
}
function approximationsFor(platform, version) { return SUPPORT_APPROX.get(`${platform}/${version}`) || []; }

// 精确版本优先；缺失时**只允许同一个 `major.minor.` 轴内**的最近版本；跨轴返回 null。
// 跨轴顶替（如用 2.2.1 顶 0.9.3）会换掉整个 API 面，风险远大于少判几条 —— 一律不给。
function pickModuleJarSameAxis(group, artifact, exact, platform, version, kind) {
  if (!exact) return null;
  const hit = pickModuleJar(group, artifact, { exact });
  if (hit) return hit;
  const parts = String(exact).split(".");
  if (parts.length < 2 || !/^\d+$/.test(parts[0]) || !/^\d+$/.test(parts[1])) return null;
  const axis = parts.slice(0, 2).join(".") + ".";
  const near = pickModuleJar(group, artifact, { prefix: axis });
  if (!near) {
    if (platform) noteApprox(platform, version, artifact, exact, "(缺)", kind || "exact-missing");
    return null;
  }
  if (platform) noteApprox(platform, version, artifact, exact, path.basename(near), kind || "same-axis");
  return near;
}

// sponge-mixin 的版本目录形如 `0.8.2+build.24` / `0.9.2+mixin.0.8.2` / `0.15.4+mixin.0.8.7`：
// **目录名里的第一段是 loader 侧的封装版本，不是 mixin 版本**。要按 `+mixin.X.Y.Z` 取，
// 没写 `+mixin.` 的（早期只有 `+build.NN`）才把首段当 mixin 版本。
// （首版按 `exact: "0.8.2"` 匹配，结果 `0.8.2+build.24` 永远命不中、全部 fallback 到它 —— 已修。）
function mixinVersionOf(dirName) {
  const m = String(dirName).match(/\+mixin\.(\d+\.\d+\.\d+)/);
  if (m) return m[1];
  const lead = String(dirName).match(/^(\d+\.\d+\.\d+)/);
  return lead ? lead[1] : null;
}
function pickMixinJar(group, wantMixinVer) {
  const base = path.join(CACHE_MODULES, group, "sponge-mixin");
  if (!fs.existsSync(base)) return null;
  let vers = moduleVersionDirs(group, "sponge-mixin").filter((v) => mixinVersionOf(v) === wantMixinVer);
  if (!vers.length) return null;
  // 同一个 mixin 版本可能有多个 loader 封装版本：取最高（本档 loader 越新，封装版本越高）。
  vers = vers.sort(verCmp).reverse();
  for (const v of vers) {
    const jar = newestJarIn(path.join(base, v));
    if (jar) return jar;
  }
  return null;
}

// Forge 档的支撑件：版本对应关系**逐档实读**各档 `forge-<ver>-userdev.jar` 里的 `config.json`
// `libraries`（复跑脚本 `temp/probe/probe-userdev-coords.mjs`）：
//   1.13.2 → eventbus 0.9.3 / forgespi 0.13.0 / 无 mixin
//   1.14.4 → eventbus 1.0.0 / forgespi 1.5.0  / 无 mixin
//   1.15.2 → 2.2.1 / 3.0.0 / mixin 0.8.2
//   1.16.5 → 4.0.0 / 3.2.0 / 0.8.4
//   1.17.1 → 5.0.3 / 4.0.10 / 0.8.4
//   1.18.2 → 5.0.3 / 4.0.15-4.x / 0.8.5
//   1.19.4 → 6.0.3 / 6.0.0 / 0.8.5
//   1.20.1 → 6.0.5 / 7.0.1 / 0.8.5
//   1.20.4 → 6.2.27 / 7.1.3 / 0.8.5
// 【判据】只允许「同 major.minor 轴」的最近版本顶替，跨轴一律不给（见 pickModuleJarSameAxis）。
// 表外版本（1.7.10–1.12.2）：那个年代没有独立 eventbus 件，宁缺勿错。
const FORGE_EVENTBUS_EXACT = {
  "1.13.2": "0.9.3",   // 缓存无 0.9.x ⇒ 不给（早先跨轴拿 2.2.1 顶，已撤）
  "1.14.4": "1.0.0",   // 缓存无 1.0.x ⇒ 不给（同上）
  "1.15.2": "2.2.1",
  "1.16.5": "4.0.0",
  "1.17.1": "5.0.3",   // 缓存无 5.0.3，同轴有 5.0.7 ⇒ 用 5.0.7（同 minor 线，记账）
  "1.18.2": "5.0.3",   // 同上
  "1.19.4": "6.0.3",
  "1.20.1": "6.0.5",
  "1.20.4": "6.2.27",
};
// forgespi 的真实坐标（同上逐档实读）。
const FORGE_SPI_EXACT = {
  "1.13.2": "0.13.0", "1.14.4": "1.5.0", "1.15.2": "3.0.0", "1.16.5": "3.2.0",
  "1.17.1": "4.0.10", "1.18.2": "4.0.15-4.x", "1.19.4": "6.0.0", "1.20.1": "7.0.1", "1.20.4": "7.1.3",
};
// forgespi 的 Dist（net.minecraftforge.api.distmarker）只在 ≤6.0.0 的件里；7.x 已迁到 fmlcore。
// 缓存实测：3.0.0 / 3.2.0 / 4.0.15-4.x / 6.0.0 带 Dist，7.0.1 / 7.1.3 不带。
const FORGE_SPI_WITH_DIST = {
  "1.13.2": "3.0.0",
  "1.14.4": "3.0.0",
  "1.15.2": "3.0.0",
  "1.16.5": "3.2.0",
  "1.17.1": "4.0.15-4.x",
  "1.18.2": "4.0.15-4.x",
  "1.19.4": "6.0.0",
};
// forge 档的 mixin 件（config.json 写 0.8.2 / 0.8.4 / 0.8.5）
const FORGE_MIXIN_AXIS = {
  "1.15.2": "0.8.2",
  "1.16.5": "0.8.4",
  "1.17.1": "0.8.4",
  "1.18.2": "0.8.5",
  "1.19.4": "0.8.5",
  "1.20.1": "0.8.5",
  "1.20.4": "0.8.5",
};
// fabric / quilt 档的 sponge-mixin：按 **mixin 版本**（不是 loader 封装版本）对应。
// 出处逐档实读：1.14.4 `remapClasspath.txt` 的 `0.8.2+build.24`；1.16.5 `0.9.2+mixin.0.8.2`；
// 1.17.1 `0.10.7+mixin.0.8.4`；1.18.2 / 1.19.4 `0.12.5+mixin.0.8.5`；
// 1.20.1 / 1.20.4 `0.15.4+mixin.0.8.7`；1.21.x / 26.1.2 按 loader 0.19.5 声明的 `0.17.4+mixin.0.8.7`。
const FABRIC_MIXIN_VER = {
  "1.14.4": "0.8.2",
  "1.16.5": "0.8.2",
  "1.17.1": "0.8.4",
  "1.18.2": "0.8.5",
  "1.19.4": "0.8.5",
  "1.20.1": "0.8.7",
  "1.20.4": "0.8.7",
  "1.21.1": "0.8.7",
  "1.21.3": "0.8.7",
  "1.21.4": "0.8.7",
  "1.21.8": "0.8.7",
  "1.21.10": "0.8.7",
  "1.21.11": "0.8.7",
  "26.1.2": "0.8.7",
};
// neoforge 档：bus / mergetool 的版本按 MC 线分。出处为各档 `*.module` 元数据实读
// （1.20.4 → bus 7.2.0 / mergetool 2.0.2；1.21.x → bus 8.0.5 / mergetool 2.0.0）。
const NEO_BUS_VER = {
  "1.20.1": "7.2.0",
  "1.20.4": "7.2.0",
  "1.20.6": "7.2.0",
  "1.21.1": "8.0.5",
  "1.21.3": "8.0.5",
  "1.21.5": "8.0.5",
  "1.21.8": "8.0.5",
  "1.21.10": "8.0.5",
  "1.21.11": "8.0.5",
  "26.1": "8.0.5",
  "26.2": "8.0.5",
};
const NEO_MERGETOOL_VER = {
  "1.20.4": "2.0.2",
  "1.20.6": "2.0.2",
  "1.21.1": "2.0.0",
  "1.21.3": "2.0.0",
  "1.21.5": "2.0.0",
  "1.21.8": "2.0.0",
  "1.21.10": "2.0.0",
  "1.21.11": "2.0.0",
  "26.1": "2.0.0",
  "26.2": "2.0.0",
};
// fancymodloader:loader 的**逐档真值**（实读各档构建产物的 classpath / nfrt manifest，
// 复跑脚本 `temp/probe/probe-perpack-versions.mjs`）：
//   1.20.4→2.0.17 / 1.20.6→3.0.45 / 1.21.1→4.0.43 / 1.21.3→5.0.8 / 1.21.5→7.0.13 /
//   1.21.8→9.0.18 / 1.21.10→10.0.32 / 1.21.11→10.0.36 / 26.1→11.0.15
// 早先是 `pickModuleJar(..., "loader", {})` ⇒ 所有档一律取到最新 12.0.8（跨 8 个大版本）。
const NEO_LOADER_VER = {
  "1.20.4": "2.0.17",
  "1.20.6": "3.0.45",
  "1.21.1": "4.0.43",
  "1.21.3": "5.0.8",
  "1.21.5": "7.0.13",
  "1.21.8": "9.0.18",
  "1.21.10": "10.0.32",
  "1.21.11": "10.0.36",
  "26.1": "11.0.15",
  "26.2": "11.0.15",
};

// fabric-loader 的逐档真值：实读各档 scaffold 的 `gradle.properties` 的 `loader_version`；
// 26.1.2 的 gradle.properties 没有这一行，真值在 `scaffold/build.gradle` 的
// `implementation "net.fabricmc:fabric-loader:0.19.5"`。早先所有档都取 newestJarIn，
// 实际拿到 0.10.5（按文件 mtime 最新），与 1.21.x 的真值差 9 个 minor。
const FABRIC_LOADER_VER = {
  "1.14.4": "0.3.7.111",
  "1.16.5": "0.11.2",
  "1.17.1": "0.11.7",
  "1.18.2": "0.14.24",
  "1.19.4": "0.14.21",
  "1.20.1": "0.15.11",
  "1.20.4": "0.15.11",
  "1.21.1": "0.16.9",
  "1.21.3": "0.16.9",
  "1.21.4": "0.19.5",
  "1.21.8": "0.19.5",
  "1.21.10": "0.19.5",
  "1.21.11": "0.19.5",
  "26.1.2": "0.19.5",
};

// Quilt 各档 scaffold 的 `build.gradle` 都钉同一个 `org.quiltmc:quilt-loader:0.31.0-beta.4`；
// 它自带 `net.fabricmc.api.ModInitializer`（见各档 scaffold 注释），不能拿 fabric-loader 顶替。
const QUILT_LOADER_VER = {
  "1.18.2": "0.31.0-beta.4",
  "1.19.4": "0.31.0-beta.4",
  "1.20.1": "0.31.0-beta.4",
  "1.20.4": "0.31.0-beta.4",
  "1.21.1": "0.31.0-beta.4",
  "1.21.3": "0.31.0-beta.4",
  "1.21.4": "0.31.0-beta.4",
  "1.21.8": "0.31.0-beta.4",
  "1.21.10": "0.31.0-beta.4",
  "1.21.11": "0.31.0-beta.4",
};

// 这些「支撑件」不参与「本档有没有这个名字」的存在性判定（它们不是 MC/加载器 API 面），
// 只用于让 javac 能解析注解与基类接口，避免把 can-find 判成 cannot-find。
// 【Mixinextras 的版本判据】只有 4 档有**本档实测出处**（`build/tmp/javadoc/javadoc.options`
// 里解析出的真实坐标，脚本 `temp/probe/probe-perpack-versions.mjs`）：
//   fabric 1.20.1 → 0.4.1；1.20.4 → 0.4.1；1.21.3 → 0.5.5；1.21.4 → 0.5.5
// 其余档本机**没有出处**，不猜具体版本，统一用「注解完整性下限」0.4.1
// （`@Local` / `@Share` / `@Cancellable` 三件齐全；0.3.5 没有 `@Cancellable`，早先取最低版本因此漏注解，已修）。
// 记账口径：用下限时记 `kind=mixinextras-floor`，让报告能看出这不是本档真值。
const MIXINEXTRAS_EXACT = {
  "1.20.1": "0.4.1",
  "1.20.4": "0.4.1",
  "1.21.3": "0.5.5",
  "1.21.4": "0.5.5",
};
const MIXINEXTRAS_FLOOR = "0.4.1";
const MIXINEXTRAS_NEEDED = [
  "com/llamalad7/mixinextras/sugar/Local.class",
  "com/llamalad7/mixinextras/sugar/Share.class",
  "com/llamalad7/mixinextras/sugar/Cancellable.class",
];
function mixinextrasHasAll(jar) {
  let names;
  try { names = new Set(zipEntries(jar).map((e) => e.name)); } catch { return false; }
  return MIXINEXTRAS_NEEDED.every((n) => names.has(n));
}
function pickMixinextrasJar(platform, version) {
  const group = platform === "neoforge" ? "mixinextras-neoforge" : "mixinextras-fabric";
  const base = path.join(CACHE_MODULES, "io.github.llamalad7", group);
  if (!fs.existsSync(base)) return null;
  const jarOf = (v) => (v ? newestJarIn(path.join(base, v)) : null);
  const exact = MIXINEXTRAS_EXACT[version];
  if (exact) {
    const j = jarOf(exact);
    if (j && mixinextrasHasAll(j)) return j;
    noteApprox(platform, version, group, exact, j ? "(缺注解，改下限)" : "(缺件，改下限)", "mixinextras");
  } else {
    noteApprox(platform, version, group, "(无本档出处)", MIXINEXTRAS_FLOOR, "mixinextras-floor");
  }
  // 下限：取 ≥ MIXINEXTRAS_FLOOR 里最低的、且三件注解齐全的版本。
  const vers = moduleVersionDirs("io.github.llamalad7", group)
    .filter((v) => verCmp(v, MIXINEXTRAS_FLOOR) >= 0)
    .sort(verCmp);
  for (const v of vers) {
    const j = jarOf(v);
    if (j && mixinextrasHasAll(j)) return j;
  }
  return null;
}

function supportJarsFor(platform, version) {
  const out = [];
  const push = (j) => { if (j && fs.existsSync(j) && !out.includes(j)) out.push(j); };
  // `push(pick(...)) || push(fallback)` 是错的：push 返回 undefined ⇒ `||` 右边**永远执行**，
  // 结果两个都进（首版 fabric 1.14.4 同时拿到 0.8.2 与 0.8.7 两件）。改用显式 if 选一支。
  const pickFirst = (...jars) => { for (const j of jars) if (j && fs.existsSync(j)) return j; return null; };
  if (platform === "forge" || platform === "rift") {
    // 表外档（1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2 / 1.12.2）：那个年代没有独立 eventbus 件，
    // 宁缺勿错 —— 硬塞一个 6.x 会让 javac 用错 API 面（首版就回落到 6.2.33）。
    const ebExact = FORGE_EVENTBUS_EXACT[version];
    if (ebExact) push(pickModuleJarSameAxis("net.minecraftforge", "eventbus", ebExact, platform, version, "eventbus"));
    // forgespi：先放本档真件（0.13.0/1.5.0 缓存缺 ⇒ 不给，不跨轴顶）。
    const spiExact = FORGE_SPI_EXACT[version];
    if (spiExact) push(pickModuleJarSameAxis("net.minecraftforge", "forgespi", spiExact, platform, version, "forgespi"));
    // `net.minecraftforge.api.distmarker.Dist` 在 ≤6.0.0 的 forgespi 里（7.x 已迁 fmlcore）。
    // 只有**本档真件缺 Dist** 时才补一件带 Dist 的（记账，且这是 2 常量枚举，形状风险最小）：
    //   1.13.2 的 Dist 就在它自己的 MC 件里（实测 `forge-1.13.2-…mapped_snapshot…jar` 内含）⇒ 不需要；
    //   1.14.4 的真件 forgespi 1.5.0 不在盘，MC 件也不含 Dist ⇒ 只能借 3.0.0（唯一记账的跨轴项）。
    const needDist = new Set(["1.14.4", "1.17.1", "1.18.2", "1.20.1", "1.20.4"]);
    if (needDist.has(version)) {
      const distJar = pickModuleJar("net.minecraftforge", "forgespi", { prefix: "6." });
      if (distJar && !out.includes(distJar)) {
        push(distJar);
        if (FORGE_SPI_EXACT[version] !== "6.0.0") {
          noteApprox(platform, version, "forgespi(Dist)", FORGE_SPI_EXACT[version] || "(无)", path.basename(distJar), "dist-substitute");
        }
      }
    }
    const mixinExact = FORGE_MIXIN_AXIS[version];
    // 只给 config.json 里**真有 mixin** 的档：1.13.2 / 1.14.4 的 config 没有 mixin 件，
    // 硬塞 0.8.x 会让 javac 认下本档不存在的 `@Mixin`（早先就是无条件兜底 0.8.，已修）。
    if (mixinExact) {
      push(pickFirst(
        pickModuleJar("org.spongepowered", "mixin", { exact: mixinExact }),
        (() => {
          const near = pickModuleJar("org.spongepowered", "mixin", { prefix: mixinExact.split(".").slice(0, 2).join(".") + "." });
          if (near) noteApprox(platform, version, "mixin", mixinExact, path.basename(near), "same-axis");
          return near;
        })(),
      ));
    }
    push(pickModuleJar("net.minecraftforge", "fmlcore", { prefix: version + "-" }));
    push(pickModuleJar("net.minecraftforge", "fmlloader", { prefix: version + "-" }));
    // @Mod 注解在 1.13.2–1.16.5 的 universal 件里；1.17+ 在 javafmllanguage。
    push(pickModuleJar("net.minecraftforge", "javafmllanguage", { prefix: version + "-" }));
    const uni = path.join(
      path.join(GRADLE_HOME, "caches/forge_gradle/maven_downloader/net/minecraftforge/forge").replace(/\\/g, "/"),
    );
    if (fs.existsSync(uni)) {
      const d = fs.readdirSync(uni).filter((x) => x.startsWith(version + "-")).sort(verCmp).pop();
      if (d) {
        const j = fs.readdirSync(path.join(uni, d)).find((f) => f.endsWith("-universal.jar"));
        if (j) push(path.join(uni, d, j));
      }
    }
  } else if (platform === "neoforge") {
    push(pickFirst(pickModuleJar("net.neoforged", "bus", { exact: NEO_BUS_VER[version] }),
      pickModuleJar("net.neoforged", "bus", { prefix: "8." })));
    push(pickFirst(pickModuleJar("net.neoforged", "mergetool", { exact: NEO_MERGETOOL_VER[version] }),
      pickModuleJar("net.neoforged", "mergetool", { prefix: "2.0." })));
    // fancymodloader 的 loader 按档钉版本（早先 `{}` 让所有档都取最新 12.0.8，那是跨大版本错件）。
    // `core` 这个 artifact 在本机缓存里**不存在**（缓存只有 bootstraplauncher/earlydisplay/loader/
    // securejarhandler/spi），原来那行是无效调用；`@Mod` 实测在 `loader` 件里，删掉不补。
    push(pickModuleJarSameAxis("net.neoforged.fancymodloader", "loader", NEO_LOADER_VER[version], platform, version, "loader"));
    push(pickModuleJar("org.spongepowered", "mixin", { prefix: "0.8." }));
  } else if (platform === "fabric" || platform === "quilt") {
    push(pickFirst(pickMixinJar("net.fabricmc", FABRIC_MIXIN_VER[version]), pickMixinJar("net.fabricmc", "0.8.7")));
    // MixinExtras：`@Local` / `@Share` / `@Cancellable` 这些注解的本体。
    push(pickMixinextrasJar(platform, version));
  } else if (platform === "liteloader" || platform === "modloader") {
    push(pickFirst(pickModuleJar("org.spongepowered", "mixin", { prefix: "0.7." }),
      pickModuleJar("org.spongepowered", "mixin", { prefix: "0.8." })));
  }
  return out;
}

// 与本档无关的「通用支撑」：JDK 之外 MC 类型签名会引用的库。逐档取「能被本档 MC 件解析」的版本太贵，
// 这里只在**编译面**加，且**不进存在性索引**（buildIndex 只吃 pack jars + fapi + external）。
const GENERIC_SUPPORT_JARS = [
  // 2026-10-21：路径按 GRADLE_HOME 推导（原写死 C:/Users/<user>/.gradle/...）；
  // 版本号与 sha 目录名保持原样 —— 那是构件身份，不是本机信息。
  path.join(
    CACHE_MODULES,
    "com.mojang/datafixerupper/10.0.21/b6b2ae770c02e0c1eb90f9985b151e9085a38d0b/datafixerupper-10.0.21.jar",
  ),
  path.join(
    CACHE_MODULES,
    "com.mojang/brigadier/1.3.11/3373d1e7bf00c8b99bed1ea4efb8c47344e4a887/brigadier-1.3.11.jar",
  ),
  // @Nullable：1.13.2 起 MC 用 org.jetbrains.annotations；javac 缺它只报 warning，
  // 但补 import 候选里 `Nullable` 同时存在于 annotations 与 jspecify ⇒ 只放 annotations 才唯一。
  newestModuleJar("org.jetbrains", "annotations"),
  // Gson：JsonObject / JsonElement 在 forge/neoforge 的 patch 里逐字出现。
  newestModuleJar("com.google.code.gson", "gson"),
  newestModuleJar("io.netty", "netty-buffer"),
  newestModuleJar("io.netty", "netty-common"),
  newestModuleJar("io.netty", "netty-codec"),
  newestModuleJar("com.google.guava", "guava"),
  newestModuleJar("org.jspecify", "jspecify"),
  // JSR-305：`javax.annotation.Nullable` 是**旧档 MC 自己的主流注解**（实测 mapped 件里
  // forge/1.14.4 1000 处、1.16.5 1143 处、1.20.1 1406 处）。不把它放上编译类路径，
  // 「按本档真实引用择优」就只能退到包序 —— 那等于择优失效。只进编译面，不进存在性判定。
  newestModuleJar("com.google.code.findbugs", "jsr305"),
  newestModuleJar("org.slf4j", "slf4j-api"),
].filter((p) => p && fs.existsSync(p));

// 兼容旧名：默认（无逐档参数）时的回退集合 —— 单测/无 pack 上下文会用它。
const SUPPORT_JARS = GENERIC_SUPPORT_JARS;

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

const FORGE_REPO = path.join(GRADLE_HOME, "caches/forge_gradle/minecraft_user_repo/net/minecraftforge/forge");
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
  const uniBase = path.join(GRADLE_HOME, "caches/forge_gradle/maven_downloader/net/minecraftforge/forge");
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
    // loader API（ModInitializer / FabricLoader 等）不在 FAPI 模块里，必须按档补：
    //   · fabric 用该档 scaffold 钉的 fabric-loader；
    //   · quilt 用 quilt-loader（0.31 起自带 net.fabricmc.api.ModInitializer），不能拿 fabric-loader 顶替。
    // 都没有时只记账、不拿最新件顶替（newestJarIn 会按 mtime 拿到 0.10.5）。
    if (platform === "quilt") {
      const exact = QUILT_LOADER_VER[version];
      const jar = pickModuleJarSameAxis("org.quiltmc", "quilt-loader", exact, platform, version, "loader");
      if (!jar && !exact) noteApprox(platform, version, "quilt-loader", "(无本档表)", "(缺)", "loader-floor");
      add(jar, "api");
    } else {
      const exact = FABRIC_LOADER_VER[version];
      const jar = pickModuleJarSameAxis("net.fabricmc", "fabric-loader", exact, platform, version, "loader");
      if (!jar && !exact) noteApprox(platform, version, "fabric-loader", "(无本档表)", "(缺)", "loader-floor");
      add(jar, "api");
    }
  } else if (platform === "neoforge") {
    const neoMerged = findNeoMerged(version);
    if (neoMerged) {
      add(neoMerged, "mojmap");
      expected = "mojmap";
    } else if (version === "1.20.1") {
      // NeoForge 1.20.1 是 Forge 兼容层，本机没有它的 merged 构件；
      // 退回同版 Forge mapped 件跑 MC/Forge 面，并记账。Neo 专属类若真缺仍会报出来。
      const fm = findForgeMapped(version);
      if (fm) { add(fm.jar, fm.layer); expected = fm.layer; }
      for (const j of findForgeSupportJars(version)) add(j, "api");
      noteApprox(platform, version, "neoforge-merged", "(无本档 merged)", fm ? "forge/" + version : "(缺)", "forge-compat");
    } else {
      noteApprox(platform, version, "neoforge-merged", "(无本档 merged)", "(缺)", "missing-merged");
    }
    // loader 也必须逐档钉版本。原先这里无条件取 newestJarIn，连 1.21.1 都拿到
    // 1.21.10 的 10.0.32（差 8 个 major）；support 层虽然已经逐档，但 api 层优先级更高，
    // 会把正确件顶掉。表里没有 1.20.1：该档走 Forge 兼容层、本机没有独立 loader 件，
    // 这一档只记账、不拿跨轴件顶替（缺件好过错件）。
    const loaderExact = NEO_LOADER_VER[version];
    const loaderJar = pickModuleJarSameAxis(
      "net.neoforged.fancymodloader", "loader", loaderExact, platform, version, "loader",
    );
    if (!loaderJar && !loaderExact) {
      noteApprox(platform, version, "fancymodloader:loader", "(本档无独立 loader 件)", "(缺)", "loader-floor");
    }
    add(loaderJar, "api");
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

// 判断一个 class 条目是不是 `@interface`（注解）：读 class 文件的 access_flags 看
// ACC_ANNOTATION(0x2000) / ACC_INTERFACE(0x0200)。用 zipEntries 已拿到的 compSize 定位太绕，
// 这里走 readEntry（复用 audit 自己的 zip 读取器）。失败一律返回 false（宁可不用，不可错用）。
function isAnnotationEntry(jar, entry) {
  try {
    const buf = readEntry(jar, entry);
    // class 文件：magic(4) minor(2) major(2) cp_count(2) then constant pool; access_flags 在
    // 「constant pool 之后」。这里走最省事的路径：用 javap 太贵，改为解析常量池跳过。
    if (buf.readUInt32BE(0) !== 0xCAFEBABE) return false;
    let p = 8;
    const cpCount = buf.readUInt16BE(p); p += 2;
    for (let k = 1; k < cpCount; k++) {
      const tag = buf[p]; p += 1;
      switch (tag) {
        case 7: case 8: case 16: case 19: case 20: p += 2; break;      // Class/String/Module/Package
        case 15: p += 3; break;                                        // MethodHandle
        case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: p += 4; break;
        case 5: case 6: p += 8; k++; break;                            // Long/Double 占两槽
        default: {                                                     // Utf8(1) 与未知
          const len = buf.readUInt16BE(p); p += 2 + len; break;
        }
      }
    }
    const access = buf.readUInt16BE(p);
    return (access & 0x2000) !== 0 && (access & 0x0200) !== 0;
  } catch {
    return false;
  }
}

// 按 FQCN 惰性判断「这个类是不是注解」。只对真正用在注解位（`@Name`）的少数候选调用，
// 不遍历全索引（一个 pack 上万类，全量判太贵）。zip 条目表与判定结果都按 jar 缓存。
const _zipEntryIndexCache = new Map();
const _annotationFqcnCache = new Map();
function zipEntryIndexOf(jar) {
  if (!_zipEntryIndexCache.has(jar)) {
    const m = new Map();
    try { for (const e of zipEntries(jar)) m.set(e.name, e); } catch { /* 读不动就当空表 */ }
    _zipEntryIndexCache.set(jar, m);
  }
  return _zipEntryIndexCache.get(jar);
}
function isAnnotationFqcn(jar, fqcn) {
  const key = jar + "\u0000" + fqcn;
  if (_annotationFqcnCache.has(key)) return _annotationFqcnCache.get(key);
  const entry = zipEntryIndexOf(jar).get(fqcn.split(".").join("/") + ".class");
  const ans = entry ? isAnnotationEntry(jar, entry) : false;
  _annotationFqcnCache.set(key, ans);
  return ans;
}

function buildIndex(jars) {
  const bySimple = new Map();
  const byFqcn = new Map();
  const annotationFqcns = new Set();
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
      // 只对「嵌套类」查注解位（顶层类不需要这条判据，也省掉大量 readEntry）。
      if (fqcn.includes("$") && isAnnotationEntry(jar, e)) annotationFqcns.add(fqcn);
    }
  }
  return { bySimple, byFqcn, layers: new Set(jars.map((j) => j.layer)), classNames: [...byFqcn.keys()], annotationFqcns };
}

// support 索引合进主索引：**只**往 bySimple / byFqcn 追加，并把 "support" 记进 inv.layers。
// 单独抽成函数是为了让 selftest 能对「合没合、合到哪一层」投毒（内联时毒不动）。
// 语义边界：support 层**不参与** checkAbsence 的存在性判定，也不抢 API 面同名候选；
//           它只为 autoImport 提供 FQCN（见 autoImport 的 layers 顺序）。
function mergeSupportIndex(inv, supportIdx) {
  for (const [k, v] of supportIdx.bySimple) {
    if (!inv.bySimple.has(k)) inv.bySimple.set(k, []);
    inv.bySimple.get(k).push(...v);
  }
  for (const [k, v] of supportIdx.byFqcn) {
    if (!inv.byFqcn.has(k)) inv.byFqcn.set(k, []);
    inv.byFqcn.get(k).push(...v);
  }
  for (const n of supportIdx.byFqcn.keys()) if (!inv.classNames.includes(n)) inv.classNames.push(n);
  inv.layers.add("support");
  return inv;
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

// 【判据缺口修复】`-sourcepath` 缺省 = `-classpath`。NeoForge 的 `*-merged.jar` 同时打包
// `.class` 与 `.java`（21.10.64 = 20815 条目里 7492 个 .java），javac 会顺着 classpath 把
// 同名 `.java` 当**输入源码**重新编译，于是报出
//   `neoforge-…-merged.jar(/net/neoforged/neoforge/registries/DeferredRegister.java):35:
//    error: package net.neoforged.bus.api does not exist`
// —— 它抱怨的是「jar 里那份源码缺依赖」，不是「你这段代码错」。这类错误此前被归成
// `cannot access` / 类路径缺口，全部落到 unverifiable，把真实内容缺陷一起埋了。
// 三组对照实测（同一 jar、同一源）：只补依赖仍 1640 条同形态错误；**只加空 -sourcepath 就 exit 0**。
const EMPTY_SOURCEPATH = path.join(OUT_DIR, "_empty-sourcepath");
function compileOnce(src, imports, body, classpath, dir, tag) {
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(EMPTY_SOURCEPATH, { recursive: true });
  fs.writeFileSync(src, "package zzclaim;\n" + imports.join("\n") + "\n" + body, "utf8");
  const slash = (p) => p.replace(/\\/g, "/");
  const argFile = path.join(dir, "args-" + tag + ".txt");
  fs.writeFileSync(argFile, [
    '-proc:none',
    '-encoding', '"UTF-8"',
    '-sourcepath', '"' + slash(EMPTY_SOURCEPATH) + '"',
    '-cp', '"' + slash(classpath) + '"',
    '"' + slash(src) + '"',
  ].join("\n"), "utf8");
  const javacArgs = ["-J-Duser.language=en", "-J-Duser.country=US", "@" + argFile];
  // 30s 对 NeoForge merged 这类大 classpath 偶尔不够（全量跑出现过 ETIMEDOUT，
  // 随后定向重跑同一片段又 exit 0）。超时只重试一次，且给更长上限；真挂死仍会判红。
  let r = spawnSync(JAVAC, javacArgs, { encoding: "utf8", timeout: 30000, killSignal: "SIGKILL" });
  if (r.error && r.error.code === "ETIMEDOUT") {
    r = spawnSync(JAVAC, javacArgs, { encoding: "utf8", timeout: 120000, killSignal: "SIGKILL" });
  }
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

// 从同名候选里挑「本档 API 面」的 FQCN 集合。support 层是**后备**：
// 只有当 API 面（expected / api / fapi / external）一个候选都没有时才启用。
// 抽成函数是为了 selftest 能对「support 混进存在性层」投毒（内联时毒不动）。
function pickImportCandidate(hits, expected) {
  const apiLayers = ["api", "fapi", "external"];
  if (expected) apiLayers.push(expected);
  const fromApi = [...new Set(hits.filter((h) => apiLayers.includes(h.layer)).map((h) => h.fqcn))];
  if (fromApi.length) return fromApi;
  return [...new Set(hits.filter((h) => h.layer === "support").map((h) => h.fqcn))];
}

// 【注解位择优】`@Nullable` 这类名字在支撑件里有多个同名注解（jetbrains / jspecify / javax），
// 「歧义就不猜」会把 `@Nullable` 永远留成 cannot find symbol（实测 17 条），javac 走不下去，
// 就看不到片段里更深层的真错误。这里在**注解位**（`@Name`）放弃一刀切的「不猜」：
//   ① 先剔掉「同名但不是注解」的候选（用 isAnnotationFqcn 在 class 文件层读 ACC_ANNOTATION）；
//   ② 仍多于 1 时，**按本档 MC 件里的真实引用计数择优**（见 annotationRefCountsInJar）；
//   ③ 本档一个都没引用（或引用数并列最高）时，才退到包序 ANNOTATION_PKG_ORDER；
//   ④ 还定不下来 ⇒ 返回 null，仍按老规矩「不猜」。
// 注意：这是**编译面**择优（让 javac 能继续），**不是**对某个注解归属的断言。
// 为什么改成「按本档真实引用」：同一份 MC 不同档的注解习惯不同 ——
// forge/1.20.1 的 mapped jar 里 `javax/annotation/Nullable` 落 1406 个 class、
// `org/jetbrains/annotations/Nullable` 253 个，硬编码包序等于拿外部约定盖过本档实况。
const ANNOTATION_PKG_ORDER = [
  "org.jetbrains.annotations.",
  "javax.annotation.",
  "jakarta.annotation.",
  "org.jspecify.annotations.",
  "edu.umd.cs.findbugs.annotations.",
];
// 纯函数，selftest 可脱开真 jar 投毒。
// refCount: (fqcn) => number，本档 MC 件里该注解被引用的次数（缺省 0）。
function pickAnnotationCandidate(fqcns, isAnn, refCount) {
  const uniqAll = [...new Set(fqcns)];
  if (uniqAll.length <= 1) return null;
  let uniq = uniqAll.filter((f) => isAnn(f));
  if (!uniq.length) return null;           // 一个真注解都没有 ⇒ 不猜
  if (uniq.length === 1) return uniq[0];
  const rc = (f) => (refCount ? Number(refCount(f)) || 0 : 0);
  // ② 按本档真实引用计数择优：唯一最高且 > 0 ⇒ 就它。
  const max = Math.max(...uniq.map(rc));
  if (max > 0) {
    const top = uniq.filter((f) => rc(f) === max);
    if (top.length === 1) return top[0];
    uniq = top;                            // 并列最高 ⇒ 在并列这一档里再用包序，别越档瞎挑
  }
  // ③ 本档没引用 / 并列 ⇒ 包序
  for (const pkg of ANNOTATION_PKG_ORDER) {
    const p = uniq.filter((f) => f.startsWith(pkg));
    if (p.length === 1) return p[0];
  }
  return null;                             // ④ 还歧义 ⇒ 不猜
}

// 【本档真实引用计数】在 pack 自己的 MC 件里数某个注解的引用次数：
// class 文件常量池里注解以 `L<fqcn with />;` 形式出现，直接数字节串即可（不必解析 class）。
// 只统计被问到的 FQCN；结果按 jar 缓存，且只在「注解位确实歧义」时才触发（罕见）。
const _annRefCountCache = new Map(); // jar -> Map<fqcn, count>
function annotationRefCountsInJar(jar, fqcns) {
  let m = _annRefCountCache.get(jar);
  if (!m) { m = new Map(); _annRefCountCache.set(jar, m); }
  const missing = [...fqcns].filter((f) => !m.has(f));
  if (!missing.length) return m;
  const needles = missing.map((f) => ({ fqcn: f, needle: "L" + f.split(".").join("/") + ";" }));
  for (const n of needles) m.set(n.fqcn, 0);
  let entries;
  try { entries = zipEntries(jar); } catch { return m; }
  for (const e of entries) {
    if (!e.name.endsWith(".class")) continue;
    let buf;
    try { buf = readEntry(jar, e); } catch { continue; }
    const s = buf.toString("latin1");
    for (const n of needles) {
      let idx = 0, c = 0;
      while ((idx = s.indexOf(n.needle, idx)) >= 0) { c++; idx += n.needle.length; }
      if (c) m.set(n.fqcn, m.get(n.fqcn) + c);
    }
  }
  return m;
}
// 把「本档 MC 件集合」包成一个 (fqcn) => 总引用次数 的函数。
function makeAnnotationRefCounter(refJars) {
  const jars = (refJars || []).filter((j) => j && fs.existsSync(j));
  if (!jars.length) return null;
  return (fqcn) => {
    let total = 0;
    for (const jar of jars) total += annotationRefCountsInJar(jar, [fqcn]).get(fqcn) || 0;
    return total;
  };
}

function autoImport(lines, imports, declared, inv, expected, opts = {}) {
  // opts.annRef: (fqcn) => 本档 MC 件里的引用次数；opts.isOnCp: (jar) => 该 jar 是否在本轮编译类路径上。
  // 【为什么必须要 isOnCp】引用计数挑出来的注解可能来自**不在编译类路径上的 jar**（例如 fabric 的
  // api 层 loader 件不进 compileJars）—— 那样的 import 补进去只会换来 `package does not exist`。
  const annRef = opts.annRef || null;
  const isOnCp = opts.isOnCp || null;
  const added = [];
  const text = lines.join("\n");
  const codeText = stripCommentsAndStrings(text);
  const importedSimple = new Set(imports.map((x) => x.split(".").pop()));
  const used = [...new Set(codeText.match(/\b[A-Z][A-Za-z0-9_$]*\b/g) || [])];
  // 只对「出现在注解位」的名字开注解择优（`@Foo` / `@Foo(...)`）。
  const annUsed = new Set([...codeText.matchAll(/@\s*([A-Z][A-Za-z0-9_$]*)/g)].map((m) => m[1]));
  const jdkMap = {
    List: "java.util.List", ArrayList: "java.util.ArrayList", Map: "java.util.Map", HashMap: "java.util.HashMap",
    Set: "java.util.Set", HashSet: "java.util.HashSet", Optional: "java.util.Optional",
    CompletableFuture: "java.util.concurrent.CompletableFuture", UUID: "java.util.UUID",
    Objects: "java.util.Objects", Arrays: "java.util.Arrays", Collections: "java.util.Collections",
    // 【补漏】`Collection` 与 `Collections` 是两个类：早先只收了复数，单数漏了，
    // 于是 `Collection<TestFunction>` 报 cannot find symbol（实测 4 条，全在 mc-gametest）。
    Collection: "java.util.Collection",
    // 【补漏】同理：`BiConsumer` 与 `Consumer` 是不同接口，早先只收了 Consumer（实测 6 条）。
    BiConsumer: "java.util.function.BiConsumer",
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
    // support 层排在最后：只有当本档 API 面（expected / api / fapi / external）里没有同名候选时，
    // 才让加载器支撑件（@SubscribeEvent / @Mixin / Dist / Nullable / JsonObject…）补位。
    // 层的挑选抽成 pickImportCandidate()，selftest 才能对「support 混进存在性层」投毒。
    let distinct = pickImportCandidate(inv.bySimple.get(u) || [], expected);
    // `Properties` 在 Forge 档有两个候选：BlockBehaviour.Properties（嵌套，示例真正要的）
    // 与 net.minecraftforge.common.property.Properties。方块的上下文优先前者。
    let preferred = null;
    if (u === "Properties" && /\bBlock(?:Item)?\b/.test(codeText)) {
      // 只用 pickImportCandidate 挑出来的那批（已按 API 面优先 / support 后备过滤过）。
      const nested = (inv.bySimple.get(u) || []).find((h) => /(?:^|\.)BlockBehaviour\$Properties$/.test(h.fqcn) && distinct.includes(h.fqcn));
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
    // 反例：Mixin 本体里那个同名枚举 `LocalVariableDiscriminator$Context$Local` 不是注解，
    // 补进去会让 `@Local(...)` 报 `Context.Local cannot be converted to Annotation` —— 必须先剔掉
    // 「同名但不是注解」的嵌套类候选（本仓踩过：fabric/1.21.1 的 04-mixin-patterns.md）。
    if (distinct.length > 1) {
      const topOrAnnotation = distinct.filter((f) => !f.includes("$") || inv.annotationFqcns.has(f));
      if (topOrAnnotation.length) distinct = topOrAnnotation;
    }
    // 注解位择优（判据见 pickAnnotationCandidate 注释）：`@Nullable` 的多注解候选不再一律放弃；
    // 优先按**本档 MC 件的真实引用计数**挑（annRef 由 compileBlocks 从 opts.refJars 造出来）。
    if (distinct.length > 1 && annUsed.has(u)) {
      let hits = (inv.bySimple.get(u) || []).filter((h) => distinct.includes(h.fqcn));
      // 只留「本轮真在编译类路径上」的候选：不在 CP 上的 import 进来只会 `package does not exist`。
      // 全都不在 CP 上 ⇒ 空集 ⇒ 下面一个都不挑，保持歧义（让 javac 报真错，不拿假 import 掩盖）。
      if (isOnCp) hits = hits.filter((h) => isOnCp(h.jar));
      if (hits.length === 1) {
        // 收窄到一个：必须是**真注解**（class 文件层读 ACC_ANNOTATION）才用。
        if (isAnnotationFqcn(hits[0].jar, hits[0].fqcn)) distinct = [hits[0].fqcn];
      } else if (hits.length > 1) {
        const chosen = pickAnnotationCandidate(hits.map((h) => h.fqcn), (f) => {
          const h = hits.find((x) => x.fqcn === f);
          return h ? isAnnotationFqcn(h.jar, h.fqcn) : false;
        }, annRef);
        if (chosen) distinct = [chosen];
      }
    }
    // 注解位只接受**真注解**：即使只剩一个候选，也不能把普通类补进 `@Environment` 这种位置。
    // fabric/1.14.4 的 0.3.7.111 缺盘时，`@Environment` 只剩 MC 的 RealmsClient$Environment，
    // 旧逻辑会补它 ⇒ javac 报 “Environment cannot be converted to Annotation”，把工具缺口判成 fail。
    if (distinct.length === 1 && annUsed.has(u)) {
      const h = (inv.bySimple.get(u) || []).find((x) => x.fqcn === distinct[0]);
      const isAnn = h && ((inv.annotationFqcns && inv.annotationFqcns.has(h.fqcn)) || isAnnotationFqcn(h.jar, h.fqcn));
      if (h && !isAnn) continue;
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

// 「映射口径：本档语料是 mojmap」披露段：标题 + 至少一条逐名对照行才算（防只提一句就放行）。
// ⚠️ = U+26A0 + U+FE0F 两个码点，`?` 只作用于后一个 ⇒ 要写成 `(?:⚠️?\s*)?` 才能带/不带都匹配。
function hasMojmapDisclosure(parsed) {
  const text = parsed.text || "";
  if (!/###\s*(?:⚠️?\s*)?映射口径[^\n]*mojmap/i.test(text)) return false;
  // 披露段里必须有真实的 mojmap→yarn 对照行（表格行：`| mojmap 名 | Yarn 名 |`）。
  return /\|\s*mojmap\s*名\s*\|\s*Yarn\s*名\s*\|/i.test(text);
}

// 围栏里出现的全部「像类名」的标识符（大写开头、非 JDK 常用名）。
// 【为什么要抽全部大写标识符】早先只抽 `Name<` / `Name.` / `extends|new Name` 三种形态，
// **漏掉纯类型声明位**：`AdvancementHolder getDirt = ...` 里的 `AdvancementHolder` 后面跟的是空格，
// 一个都抽不到 ⇒ mojmap 参考围栏判不出来（实测残留 `fabric/1.21.10 mc-advancement:61` 就是这个）。
// 抽全量后由调用方按各自的出处判「是不是只属于 mojmap 侧」，成本只是几百个字符串。
function mojmapCandidateNames(content) {
  const code = stripCodeNoise(content);
  // 【防撞名】显式从 JDK 包 import 进来的简单名，不可能是本档 mojmap 类。
  // 反例（实测误判）：`import java.lang.reflect.Method;` 的 `Method` 与 MC 里某个叫 `Method`
  // 的 mojmap 类同名 ⇒ 会把一段纯 Yarn 代码判成「mojmap 参考围栏」而不编译，
  // 那是**掩盖**真错误（`fabric/1.21.10 mc-gametest:71` 就是这么被错判的）。
  const jdkImported = new Set();
  for (const m of code.matchAll(/^\s*import\s+(?:static\s+)?((?:java|javax|jakarta|jdk|sun)\.[\w.$]+)\s*;/gm)) {
    jdkImported.add(m[1].split(".").pop().split("$").pop());
  }
  const names = new Set();
  for (const m of code.matchAll(/\b[A-Z][A-Za-z0-9_$]*\b/g)) names.add(m[0]);
  return [...names].filter((n) => !JDK_COMMON.has(n) && !jdkImported.has(n));
}

// 围栏里是否出现了「只存在于 mojmap 层、本档 expected 层查无」的类名。
// 只认能证的：该简单名在 mojmap 层有、在 yarn 层一个都没有；歧义/两边都有 ⇒ 不算。
function fenceUsesMojmapOnlyNames(content, inv) {
  for (const n of mojmapCandidateNames(content)) {
    const hits = inv.bySimple.get(n) || [];
    const inMoj = hits.some((h) => h.layer === "mojmap");
    const inYarn = hits.some((h) => h.layer === "yarn");
    if (inMoj && !inYarn) return true;
  }
  return false;
}

// 【第二判据】上面那条靠「本档 artifacts 里真的有一个 mojmap 层」。但并非每档都有：
// 实测 fabric/1.21.11 有 loom layered 件（mojmap 层 1 个 jar）⇒ 判得出来；
// fabric/1.21.10 的 artifacts 只有 yarn/api/fapi/external ⇒ 判据结构上永不成立，
// 于是 1.21.10 的 mojmap 参考围栏会被当本档 Yarn 面编译（实测残留 1 条：mc-advancement:61）。
// 兜底出处用仓库自带的 `data/_yarn-mojmap-pairs/yarn-mojmap-<ver>.json`（Mojang client.txt ⋈
// yarn-mappings.sqlite 的派生对照，逐件 sha 钉在 provenance 里；只读）。
// 判据与上面一致：该简单名在 mojmap 侧有、在 yarn 侧一个都没有。
const _pairsSimpleCache = new WeakMap();
function pairsSimpleIndex(pairs) {
  if (_pairsSimpleCache.has(pairs)) return _pairsSimpleCache.get(pairs);
  const moj = new Set();
  const yarn = new Set();
  for (const k of pairs.moj2yarn.keys()) moj.add(k.split(".").pop().split("$").pop());
  for (const k of pairs.yarn2moj.keys()) yarn.add(k.split(".").pop().split("$").pop());
  const idx = { moj, yarn };
  _pairsSimpleCache.set(pairs, idx);
  return idx;
}
function fenceUsesMojmapOnlyNamesViaPairs(content, pairs) {
  if (!pairs || !pairs.moj2yarn || !pairs.yarn2moj) return false;
  const idx = pairsSimpleIndex(pairs);
  for (const n of mojmapCandidateNames(content)) {
    if (idx.moj.has(n) && !idx.yarn.has(n)) return true;
  }
  return false;
}

function compileBlocks(file, parsed, jarPaths, inv, opts = {}) {
  const out = [];
  // 移植对照页本来就把另一个加载器的代码放在同一页，用单档类路径编译只会误报。
  if (/[\\/]porting[\\/]/.test(file)) return out;
  const complete = Boolean(opts.complete);
  const expected = opts.expected || null;
  // 注解位择优用的「本档真实引用计数」：**惰性**建（只有真出现注解歧义时才去扫件），
  // 扫的是 opts.refJars（= 本档 artifacts 里的 MC/api 件，不含支撑件）。
  let _annRef;
  const annRef = (fqcn) => {
    if (_annRef === undefined) _annRef = makeAnnotationRefCounter(opts.refJars);
    return _annRef ? _annRef(fqcn) : 0;
  };
  // 「这个 jar 在本轮编译类路径上吗」—— 注解择优只能从 CP 上有的候选里挑。
  // ⚠️ 口径必须与 compileOnce 一致：classpath = jarPaths（或 narrow 后的子集）**+ auxJars**。
  // 漏掉 auxJars 会把**支撑件**（注解就在里面）全判成「不在 CP 上」，等于把注解择优关掉 ——
  // 我第一次就是这么把 `@Nullable` 又修回 cannot find symbol 的（靠 AUDIT_DEBUG_IMPORT 才发现）。
  const cpSet = new Set([...jarPaths, ...(opts.auxJars || SUPPORT_JARS)]);
  const isOnCp = (jar) => cpSet.has(jar);
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
    // 【分类缺口】文件级 mojmap 披露：Fabric 的 skills 明文写「本档语料是 mojmap」并附逐名对照表，
    // 但它们同时给同一段代码的 Yarn 等价块。前者里 `MobEffect` / `ResourceKey` /
    // `AdvancementHolder` / `BlockModelGenerators` 这些名字**本档 Yarn 层根本没有**，
    // 拿 Yarn 类路径编译必然 cannot find symbol —— 那不是内容缺陷，是把参考面当本档面编译。
    // 判据（只认能证的那一种）：文件含「映射口径…mojmap」披露段 **且** 该围栏出现
    // 「只在 mojmap 侧、本档 Yarn 侧查无」的类名 ⇒ 判为参考围栏，不编译、留 unverifiable。
    // 两个出处：① 本档 artifacts 真有 mojmap 层（按层判）；② 没有 mojmap 层时退到
    //           `data/_yarn-mojmap-pairs` 的名字对照表（见 fenceUsesMojmapOnlyNamesViaPairs）。
    const mojmapOnly = expected === "yarn" && hasMojmapDisclosure(parsed) &&
      (fenceUsesMojmapOnlyNames(f.content, inv) || fenceUsesMojmapOnlyNamesViaPairs(f.content, opts.pairs));
    if (mojmapOnly) {
      out.push(finding("compile", file, f.startLine, "javac", "mojmap 参考围栏（本档 Yarn 层无该类名），不按本档编译", "unverifiable",
        "文件含「映射口径：本档语料是 mojmap」披露段；围栏内的类名只存在于 mojmap 侧"));
      continue;
    }
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
    // 【P1 修复】`declared` 必须走「去注释去字符串」后的代码文本，不能拿原始围栏文本。
    // 反例（实测）：围栏顶部写了元件核实注释
    //   `//   IRecipe 是**非泛型**接口：public interface IRecipe extends IForgeRecipe`
    //   `//     public class DataParameter<T> { ... }`
    // 原实现把注释里的 `public interface IRecipe` / `public class DataParameter` 当成
    // 「围栏内已声明」⇒ autoImport 跳过补 import ⇒ javac 报 `cannot find symbol IRecipe`
    // （forge/1.13.2 mc-recipe:32）与 `cannot find symbol DataParameter`
    // （forge/1.14.4 08-client-server.mdc:182）—— 这是**审计读数错**，不是内容缺陷。
    const declared = new Set(
      [...stripCommentsAndStrings(f.content).matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_$]*)/g)].map((m) => m[1]),
    );
    if (complete) {
      const done = completeText(rest);
      body = done.lines;
      notes.push(...done.notes);
      needLogger = done.needLogger;
      added = autoImport(body, imports, declared, inv, expected, { annRef, isOnCp });
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
    // opts.auxJars = 本档的加载器支撑件（eventbus/mixin/distmarker/gson…）。默认回退到通用集合，
    // 保持 selftest / 无 pack 上下文的调用方行为不变。
    const auxJars = opts.auxJars || SUPPORT_JARS;
    let classpath;
    if (complete && opts.apiJars) {
      const wanted = [...fqcns, ...added];
      classpath = [...new Set([...narrowClasspath(jarPaths, inv, wanted, opts.apiJars), ...auxJars])].join(";");
    } else {
      const need = [...jarPaths, ...auxJars];
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
  // 注解位只剩一个**普通类**候选时也不许补：fabric/1.14.4 缺 loader 时 `@Environment`
  // 曾把 MC 的 RealmsClient$Environment 补进来，javac 报 cannot be converted to Annotation。
  const fakeInvNonAnn = {
    ...fakeInv,
    bySimple: new Map([...fakeInv.bySimple, ["Environment", [{
      layer: "yarn", fqcn: "net.minecraft.client.realms.dto.RealmsClient$Environment", jar: "",
    }]]]),
  };
  const envImports = [];
  const envAdded = autoImport(["@Environment(EnvType.CLIENT) public void f() { }"], envImports, new Set(), fakeInvNonAnn, "yarn");
  if (envAdded.some((x) => /Environment/.test(x))) fail.push("non-annotation must not be imported into annotation position");
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
  // 11) 支撑件（support 层）——本轮新增判据的三条臂。
  // 11a) autoImport 只在「本档 API 面没有同名候选」时才用 support 层补；
  //      这一臂钉住 @SubscribeEvent 这类「本档确实有、但不在 MC 合并 jar 里」的名字能补出来。
  const fakeInvSupport = {
    ...fakeInv,
    bySimple: new Map([
      ...fakeInv.bySimple,
      ["SubscribeEvent", [{ layer: "support", fqcn: "net.minecraftforge.eventbus.api.SubscribeEvent", jar: "" }]],
    ]),
    annotationFqcns: new Set(["net.minecraftforge.eventbus.api.SubscribeEvent"]),
  };
  const supImports = [];
  const supAdded = autoImport(["@SubscribeEvent public void f() { }"], supImports, new Set(), fakeInvSupport, "mojmap");
  if (!supAdded.includes("net.minecraftforge.eventbus.api.SubscribeEvent")) fail.push("support-layer auto import");
  // 11b) 若本档 API 面已有同名候选，support 层不得抢位（否则 MC 自己的类会被加载器注解顶掉）。
  const fakeInvSupportConflict = {
    ...fakeInv,
    bySimple: new Map([
      [...fakeInv.bySimple],
      ["Text", [
        { layer: "yarn", fqcn: "net.minecraft.text.Text", jar: "" },
        { layer: "support", fqcn: "com.example.support.Text", jar: "" },
      ]],
    ]),
  };
  const conImports = [];
  const conAdded = autoImport(["Text.literal(\"x\");"], conImports, new Set(), fakeInvSupportConflict, "yarn");
  if (conAdded.some((x) => x.startsWith("com.example.support."))) fail.push("support layer overrode API layer");
  // 11c) support 层必须**不进**存在性判定：某个名字只在 support 里时，
  //      `checkAbsence` 不能据此判 fail（它只回答「本档 MC/加载器构件里有没有」，不回答「这个库装没装」）。
  //      这里用「support 层有 SubscribeEvent 但 expected=yarn 的 bySimple 里同层没有 yarn 命中」构造。
  const absSupport = checkAbsence("x", "x.md", 1, "- `SubscribeEvent` 在本档不存在", fakeInvSupport, "yarn");
  if (absSupport.some((f) => f.status === "fail")) fail.push("support layer must not satisfy existence check");
  // 11c-2) support 索引必须真的建得起来：拿真实支撑件跑一遍 buildIndex，
  //         `org.spongepowered.asm.mixin.Mixin` 必须在 support 层可查（补全器靠它补 @Mixin）。
  //         （投毒：把 supportJarsFor 改成返回 [] 或把 buildIndex 的 support 索引删掉 -> 本臂红）
  const supportProbeJars = supportJarsFor("fabric", "1.21.11");
  if (!supportProbeJars.length) fail.push("supportJarsFor(fabric,1.21.11) must resolve jars");
  else {
    const sIdx = buildIndex(supportProbeJars.map((jar) => ({ jar, layer: "support" })));
    const mixinHits = (sIdx.byFqcn.get("org.spongepowered.asm.mixin.Mixin") || []).filter((h) => h.layer === "support");
    if (!mixinHits.length) fail.push("support index must expose Mixin annotation");
    // 11c-3) mergeSupportIndex 必须把 support 记进 layers、并让 bySimple/byFqcn 查得到；
    //        投毒（把函数体掏空 / 不 add layer）本臂红。
    const mergedInv = mergeSupportIndex(
      { bySimple: new Map(), byFqcn: new Map(), layers: new Set(), classNames: [] },
      sIdx,
    );
    if (!mergedInv.layers.has("support")) fail.push("mergeSupportIndex must record support layer");
    if (!(mergedInv.byFqcn.get("org.spongepowered.asm.mixin.Mixin") || []).length) fail.push("mergeSupportIndex must merge byFqcn");
    if (!(mergedInv.bySimple.get("Mixin") || []).length) fail.push("mergeSupportIndex must merge bySimple");
    if (!mergedInv.classNames.includes("org.spongepowered.asm.mixin.Mixin")) fail.push("mergeSupportIndex must merge classNames");
  }
  // 11d) `-sourcepath` 必须被钉成**空目录**（否则 javac 会去编译 classpath 里 jar 的内嵌 .java）。
  //      只 grep 那一行不够 —— 还得钉住它解析出来的落点：必须在本轮 OUT_DIR 下、
  //      且目录名带 `_empty-sourcepath`（投毒：指到仓库里任何有 .java 的目录即红）。
  const compileSrc = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
  if (!/'-sourcepath', '"' \+ slash\(EMPTY_SOURCEPATH\) \+ '"'/.test(compileSrc)) fail.push("javac -sourcepath not pinned to empty dir");
  {
    const rel = path.relative(OUT_DIR, EMPTY_SOURCEPATH);
    if (rel.startsWith("..") || path.isAbsolute(rel)) fail.push("EMPTY_SOURCEPATH must live under OUT_DIR");
    if (!/_empty-sourcepath/.test(path.basename(EMPTY_SOURCEPATH))) fail.push("EMPTY_SOURCEPATH must be a dedicated empty dir");
    if (!/mkdirSync\(EMPTY_SOURCEPATH/.test(compileSrc)) fail.push("EMPTY_SOURCEPATH must be created before javac runs");
  }
  // 11d-2) pickImportCandidate 的优先级必须钉死：support 只在 API 面**全空**时补位。
  //        投毒（把 support 塞进 apiLayers / 去掉 API 优先）本臂红。
  const fakeHitsBoth = [
    { layer: "yarn", fqcn: "net.minecraft.text.Text", jar: "" },
    { layer: "support", fqcn: "com.example.SupportText", jar: "" },
  ];
  const pickedBoth = pickImportCandidate(fakeHitsBoth, "yarn");
  if (!pickedBoth.includes("net.minecraft.text.Text")) fail.push("pickImportCandidate must prefer API layer");
  if (pickedBoth.includes("com.example.SupportText")) fail.push("pickImportCandidate must not co-mingle support layer");
  const pickedSupportOnly = pickImportCandidate([{ layer: "support", fqcn: "com.example.SupportText", jar: "" }], "yarn");
  if (!pickedSupportOnly.includes("com.example.SupportText")) fail.push("pickImportCandidate must fall back to support layer");
  // 11d-3) runPack 必须**真的**把 support 索引合进 inv（不是建了索引就丢掉）。
  //        投毒（把 mergeSupportIndex 调用删掉 / 换成 buildIndex）本臂红。
  if (!/mergeSupportIndex\(inv, buildIndex\(auxJars\.map/.test(compileSrc)) {
    fail.push("runPack must merge support index into inv");
  }
  // 11e) mojmap 参考围栏识别：**三臂**。
  //   (a) 有披露段 + 围栏含 mojmap-only 名 ⇒ 认；
  //   (b) 有 mojmap-only 名但**没有**披露段 ⇒ 不认（否则会真放松判据）；
  //   (c) 有披露段但围栏里全是两层都有的名字 ⇒ 不认（披露段不该替真缺陷背锅）。
  {
    const invMix = {
      ...fakeInv,
      bySimple: new Map([
        ...fakeInv.bySimple,
        ["MobEffect", [{ layer: "mojmap", fqcn: "net.minecraft.world.effect.MobEffect", jar: "" }]],
        ["StatusEffect", [{ layer: "yarn", fqcn: "net.minecraft.entity.effect.StatusEffect", jar: "" }]],
      ]),
    };
    const disclosureText = "### ⚠️ 映射口径：本档语料是 mojmap\n\n| mojmap 名 | Yarn 名 | 适用版本 |\n| --- | --- | --- |\n| MobEffect | StatusEffect | 1.21.11 |";
    const parsedWithDisclosure = { text: disclosureText, lines: disclosureText.split("\n"), fences: [], prose: [], headings: [] };
    const parsedNoDisclosure = { text: "普通页", lines: ["普通页"], fences: [], prose: [], headings: [] };
    if (!hasMojmapDisclosure(parsedWithDisclosure)) fail.push("mojmap disclosure not detected");
    if (hasMojmapDisclosure(parsedNoDisclosure)) fail.push("mojmap disclosure false positive");
    // 只有标题、没有逐名对照表 ⇒ 必须**不**认（防「提一句就放行」）。
    if (hasMojmapDisclosure({ text: "### 映射口径：本档语料是 mojmap" })) fail.push("mojmap disclosure must require per-name table");
    if (!fenceUsesMojmapOnlyNames("public class T extends MobEffect { }", invMix)) fail.push("mojmap-only name not detected");
    if (fenceUsesMojmapOnlyNames("public class T extends StatusEffect { }", invMix)) fail.push("yarn name misread as mojmap-only");
    // 两层都有的名字不算 mojmap-only
    const invBoth = {
      ...fakeInv,
      bySimple: new Map([
        ...fakeInv.bySimple,
        ["Text2", [
          { layer: "mojmap", fqcn: "net.minecraft.network.chat.Component", jar: "" },
          { layer: "yarn", fqcn: "net.minecraft.text.Text", jar: "" },
        ]],
      ]),
    };
    if (fenceUsesMojmapOnlyNames("public class T extends Text2 { }", invBoth)) fail.push("both-layer name misread as mojmap-only");
  }
  // 11e) 逐档支撑件解析：至少三种平台能解析出非空集合，且不存在的版本不崩。
  const supForge = supportJarsFor("forge", "1.20.1");
  const supFabric = supportJarsFor("fabric", "1.21.11");
  if (!Array.isArray(supForge) || !Array.isArray(supFabric)) fail.push("supportJarsFor must return arrays");
  if (!supFabric.length) fail.push("supportJarsFor(fabric, 1.21.11) resolved nothing");
  const supBogus = supportJarsFor("forge", "0.0.0");
  if (!Array.isArray(supBogus)) fail.push("supportJarsFor must survive unknown version");
  // 11f) MixinExtras：`@Local` / `@Share` / `@Cancellable` 不在 Mixin 本体里。
  //      三臂：① 能解析到 mixinextras 件；② 该件里 `com.llamalad7.mixinextras.sugar.Local`
  //      被认成注解（`isAnnotationEntry` 的 class 文件解析器要真的读得出 ACC_ANNOTATION）；
  //      ③ 同名嵌套类不是注解时必须被剔掉（否则 `@Local(...)` 会被补成
  //      `LocalVariableDiscriminator$Context$Local`，报 Context.Local cannot be converted to Annotation）。
  {
    const mx = pickMixinextrasJar("fabric", "1.21.1");
    if (!mx) fail.push("mixinextras jar not resolved for fabric/1.21.1");
    else {
      const mxIdx = buildIndex([{ jar: mx, layer: "support" }]);
      if (!mxIdx.byFqcn.has("com.llamalad7.mixinextras.sugar.Local")) fail.push("mixinextras Local missing from index");
      const hit = (mxIdx.byFqcn.get("com.llamalad7.mixinextras.sugar.Local") || [])[0];
      if (!hit || !isAnnotationEntry(hit.jar, { name: "com/llamalad7/mixinextras/sugar/Local.class", method: 0, compSize: 0, localOff: 0 })) {
        // 用 buildIndex 拿不到 zipEntries 的 entry 形状；换 zipEntries 直接取。
        const fp = zipEntries(mx).find((z) => z.name === "com/llamalad7/mixinextras/sugar/Local.class");
        if (!fp || !isAnnotationEntry(mx, fp)) fail.push("mixinextras @Local not recognised as annotation");
      }
      // 反向：Mixin 本体那个同名枚举必须被判成「不是注解」。
      const mxMixin = pickMixinJar("net.fabricmc", "0.8.7");
      if (mxMixin) {
        const enumEntry = zipEntries(mxMixin).find((z) => z.name === "org/spongepowered/asm/mixin/injection/modify/LocalVariableDiscriminator$Context$Local.class");
        if (enumEntry && isAnnotationEntry(mxMixin, enumEntry)) fail.push("Context$Local must not be flagged as annotation");
      }
    }
  }
  // 11g) jdkMap 补漏：`Collection` 与 `Collections` 是两个类，`BiConsumer` 与 `Consumer` 是两个接口。
  //      早先只收了复数/单数各一个，导致 `Collection<TestFunction>` / `BiConsumer<A,B>` 报
  //      cannot find symbol（实测 4 + 6 条）。这条臂把「同族成对必须都在」钉住。
  {
    const src = fs.readFileSync(new URL(import.meta.url), "utf8");
    const i = src.indexOf("const jdkMap = {");
    const blk = i >= 0 ? src.slice(i, src.indexOf("\n  };", i)) : "";
    for (const must of ["Collection:", "Collections:", "BiConsumer:", "Consumer:"]) {
      if (!blk.includes(must)) fail.push("jdkMap missing " + must);
    }
    // 逻辑面再用一次：直接验两个键映射到不同 FQCN（防止被写成同一个）。
    if (/Collection:\s*"java\.util\.Collections"/.test(blk)) fail.push("jdkMap Collection must not alias Collections");
  }
  // 11h) 注解位择优选支（纯函数，脱开真 jar 可投毒）。六臂：
  //      ① **本档真实引用计数优先**：jspecify 被引 9 次、jetbrains 1 次 ⇒ 选 jspecify（压过包序）；
  //      ② 本档零引用 ⇒ 退包序，命中 jetbrains；
  //      ③ 引用数并列最高 ⇒ 在并列档里用包序（不许越档挑零引用的那个）；
  //      ④ 一个真注解 + 一个非注解 ⇒ 选那个真注解；
  //      ⑤ 全不是注解 ⇒ null（不许乱补）；
  //      ⑥ 两个真注解、零引用、且都不在包序里 ⇒ null（仍按「不猜」）。
  {
    const JET = "org.jetbrains.annotations.Nullable";
    const JSP = "org.jspecify.annotations.Nullable";
    const JAV = "javax.annotation.Nullable";
    const isAnnAll = () => true;
    // ① 引用计数优先（方向与包序相反，能证明「不是靠包序」）
    const p1 = pickAnnotationCandidate([JET, JSP], isAnnAll, (f) => (f === JSP ? 9 : 1));
    if (p1 !== JSP) fail.push("annotation tiebreak must follow pack ref count: " + p1);
    // ② 零引用 ⇒ 包序
    const p2 = pickAnnotationCandidate([JET, JSP], isAnnAll, () => 0);
    if (p2 !== JET) fail.push("annotation tiebreak must fall back to pkg order: " + p2);
    // ③ 引用数并列最高 ⇒ 只在并列档里用包序，**不许越档**挑零引用的那个。
    //    构造：最高并列的是 jspecify 与 javax（各 5），jetbrains 为 0 但包序最靠前。
    //    正确 = javax（并列档里按包序）；错解 = jetbrains（越档用了零引用的）。
    const p3 = pickAnnotationCandidate([JET, JSP, JAV], isAnnAll, (f) => (f === JET ? 0 : 5));
    if (p3 !== JAV) fail.push("annotation tiebreak must stay within the tie group: " + p3);
    // ④ 剔非注解
    const p4 = pickAnnotationCandidate(
      ["org.spongepowered.asm.mixin.injection.modify.LocalVariableDiscriminator$Context$Local", "com.llamalad7.mixinextras.sugar.Local"],
      (f) => f === "com.llamalad7.mixinextras.sugar.Local",
    );
    if (p4 !== "com.llamalad7.mixinextras.sugar.Local") fail.push("annotation tiebreak must drop non-annotation: " + p4);
    // ⑤ 全非注解
    if (pickAnnotationCandidate(["a.Foo", "b.Foo"], () => false) !== null) fail.push("annotation tiebreak must not guess when none is annotation");
    // ⑥ 零引用 + 包序都没命中
    if (pickAnnotationCandidate(["com.x.Foo", "com.y.Foo"], isAnnAll, () => 0) !== null) fail.push("annotation tiebreak must not guess when pkg order misses");
    // ⑦ 编译类路径过滤：引用计数偏向 jspecify，但 jspecify 不在 CP 上 ⇒ 必须退回 jetbrains。
    //    （否则补进来的 import 只会换来 `package does not exist`。）
    {
      const jetJar = newestModuleJar("org.jetbrains", "annotations");
      const jspJar = newestModuleJar("org.jspecify", "jspecify");
      if (!jetJar || !jspJar) fail.push("annotation CP arm: support jars missing");
      else {
        const cpInv = {
          ...fakeInv,
          bySimple: new Map([
            ...fakeInv.bySimple,
            ["Nullable", [
              { jar: jetJar, layer: "support", fqcn: "org.jetbrains.annotations.Nullable", simple: "Nullable" },
              { jar: jspJar, layer: "support", fqcn: "org.jspecify.annotations.Nullable", simple: "Nullable" },
            ]],
          ]),
        };
        const cpImports = [];
        autoImport(["@Nullable String s;"], cpImports, new Set(), cpInv, "yarn", {
          annRef: (f) => (f === "org.jspecify.annotations.Nullable" ? 9 : 1),
          isOnCp: (jar) => jar === jetJar, // 只把 jetbrains 放进「类路径」
        });
        const got = cpImports[0] || "";
        if (!got.includes("org.jetbrains.annotations.Nullable")) {
          fail.push("annotation CP filter must drop off-classpath candidate, got: " + got);
        }
      }
    }
  }
  // 11k) 【P1】注释里的 `public class X` / `public interface X` **不得**抑制 X 的 import。
  //      反例（实测两处）：forge/1.13.2 mc-recipe:32 的围栏注释写着
  //        `//   IRecipe 是**非泛型**接口：public interface IRecipe extends IForgeRecipe`
  //      forge/1.14.4 08-client-server.mdc:182 的注释写着
  //        `//     public class DataParameter<T> { public DataParameter(int, IDataSerializer<T>); }`
  //      ⇒ 老实现把注释里的声明当成「围栏内已声明」⇒ 跳过补 import ⇒ 报 cannot find symbol。
  //      这条臂钉住：declared 必须取「去注释去字符串」后的文本。
  {
    const fenceWithComment = [
      "// 本档构件核实（javap @ forge-1.13.2）：",
      "//   IRecipe 是**非泛型**接口：public interface IRecipe extends IForgeRecipe",
      "public class MyRecipe implements IRecipe {",
      "  @Override public boolean matches(IInventory inv, World world) { return false; }",
      "}",
    ].join("\n");
    const declOf = (text) => new Set([...stripCommentsAndStrings(text).matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_$]*)/g)].map((m) => m[1]));
    const d = declOf(fenceWithComment);
    if (d.has("IRecipe")) fail.push("commented-out 'public interface IRecipe' must not count as declared");
    if (!d.has("MyRecipe")) fail.push("real 'public class MyRecipe' must count as declared");
    // 反向：真实声明（非注释）仍要被认出来，别把这条臂修成永远「没声明」。
    const realDecl = declOf("public class DataParameter<T> {\n  public DataParameter(int i) {}\n}");
    if (!realDecl.has("DataParameter")) fail.push("real code declaration must still be declared");
    // 字符串里的 class 名同样不算（`String s = "public class Fake {}"`）。
    if (declOf('String s = "public class Fake {}";').has("Fake")) fail.push("class name inside string literal must not count as declared");
  }
  // 11l) 支撑件「同轴顶替」判据：跨 major.minor 轴一律不给（早先跨轴顶替把 0.9.3 顶成 2.2.1）。
  {
    // 5.0.3 在缓存里没有，但同轴有 5.0.7 ⇒ 应当拿到 5.0.7（并记账，不静默）。
    resetSupportApprox("forge", "1.17.1");
    const got = pickModuleJarSameAxis("net.minecraftforge", "eventbus", "5.0.3", "forge", "1.17.1", "eventbus");
    const ap = approximationsFor("forge", "1.17.1");
    if (got && !/5\.0\./.test(path.basename(path.dirname(path.dirname(got))))) fail.push("same-axis eventbus should resolve on the 5.0.x line, got " + got);
    if (got && !ap.length) fail.push("same-axis substitution must be recorded as an approximation");
    // 0.9.3 没有 0.9.x 同轴件 ⇒ 必须返回 null（不许跨轴拿 2.2.1）。
    resetSupportApprox("forge", "1.13.2");
    const none = pickModuleJarSameAxis("net.minecraftforge", "eventbus", "0.9.3", "forge", "1.13.2", "eventbus");
    if (none !== null) fail.push("cross-axis eventbus must NOT be substituted, got " + none);
    // 而且这种「本档真件缺」也要记账（缺口是事实，得让人看见）。
    if (!approximationsFor("forge", "1.13.2").length) fail.push("missing exact eventbus must be recorded");
    // neoforge loader 逐档真值必须真的存在（缓存里 2.0.17 … 12.0.8 全在）。
    for (const [ver, want] of Object.entries(NEO_LOADER_VER)) {
      const p = pickModuleJar("net.neoforged.fancymodloader", "loader", { exact: want });
      if (!p) fail.push(`fancymodloader loader ${want} for neoforge/${ver} not resolvable`);
    }
    // artifactSet 的 api loader 也必须跟本档走。support 层虽然已经逐档，但 api 层优先；
    // 原来 api 层无条件 newestJarIn，1.21.1 会拿到 1.21.10 的 10.0.32，把正确件顶掉。
    {
      const loaderOf = (ver) => artifactSet("neoforge", ver).jars
        .filter((j) => /fancymodloader[\\/]loader/.test(j.jar))
        .map((j) => j.jar);
      const got211 = loaderOf("1.21.1");
      if (!got211.some((p) => p.includes(NEO_LOADER_VER["1.21.1"]))) {
        fail.push("neoforge artifactSet loader must use per-pack version: " + JSON.stringify(got211));
      }
      // 1.20.1 没有本档 fancymodloader 件：不许回落到新版，且必须记账。
      resetSupportApprox("neoforge", "1.20.1");
      const got201 = loaderOf("1.20.1");
      if (got201.length) fail.push("neoforge 1.20.1 must not substitute a newer loader: " + JSON.stringify(got201));
      if (!approximationsFor("neoforge", "1.20.1").some((a) => a.kind === "loader-floor")) {
        fail.push("neoforge 1.20.1 missing loader must be recorded as an approximation");
      }
    }
    // fabric / quilt loader 也必须逐档：
    //   fabric 1.21.11 → 0.19.5；1.14.4 → 0.3.7.111；1.17.1 精确 0.11.7 缺盘，同轴 0.11.2 并记账。
    //   quilt 全部 → org.quiltmc:quilt-loader:0.31.0-beta.4（不能拿 fabric-loader 顶）。
    {
      const jarOf = (plat, ver) => artifactSet(plat, ver).jars
        .map((j) => j.jar)
        .filter((p) => /(?:fabric-loader|quilt-loader)-/.test(path.basename(p)));
      const f211 = jarOf("fabric", "1.21.11");
      if (!f211.some((p) => p.includes("fabric-loader-" + FABRIC_LOADER_VER["1.21.11"]))) {
        fail.push("fabric artifactSet loader must use per-pack version: " + JSON.stringify(f211));
      }
      // 1.14.4 的 0.3.7.111 可能只有 .pom（本机初始缓存即如此）；有 jar 就用本档，
      // 没有就只记账、不许跨轴拿 0.10.5。这条臂在「补到 jar」与「没补到」两种机器上都成立。
      resetSupportApprox("fabric", "1.14.4");
      const f144 = jarOf("fabric", "1.14.4");
      if (f144.some((p) => !p.includes("fabric-loader-" + FABRIC_LOADER_VER["1.14.4"]))) {
        fail.push("fabric 1.14.4 must not use a cross-axis loader: " + JSON.stringify(f144));
      }
      if (!f144.length && !approximationsFor("fabric", "1.14.4").some((a) => a.artifact === "fabric-loader")) {
        fail.push("fabric 1.14.4 missing loader must be recorded");
      }
      // 1.17.1 的 0.11.7 本机可能缺盘；有同轴 0.11.2 就顶上并记账，没有就保持缺件。
      resetSupportApprox("fabric", "1.17.1");
      const f171 = jarOf("fabric", "1.17.1");
      const exact171 = f171.some((p) => p.includes("fabric-loader-" + FABRIC_LOADER_VER["1.17.1"]));
      const near171 = f171.some((p) => p.includes("fabric-loader-0.11.2"));
      if (!exact171 && !near171) fail.push("fabric 1.17.1 loader neither exact nor 0.11.x: " + JSON.stringify(f171));
      if (!exact171 && !approximationsFor("fabric", "1.17.1").some((a) => a.artifact === "fabric-loader" && String(a.got).includes("0.11.2"))) {
        fail.push("fabric 1.17.1 same-axis loader fallback must be recorded");
      }
      for (const ver of Object.keys(QUILT_LOADER_VER)) {
        const q = jarOf("quilt", ver);
        if (!q.some((p) => p.includes("quilt-loader-" + QUILT_LOADER_VER[ver]))) {
          fail.push(`quilt/${ver} artifactSet must use quilt-loader ${QUILT_LOADER_VER[ver]}: ` + JSON.stringify(q));
        }
      }
      // fapi 精确件里混进的 loader 必须被剔掉，否则旧档会拿 loom-cache 里的 0.10.5 顶。
      if (exactApiJars("fabric", "1.14.4").some(isLoaderJarPath)) {
        fail.push("exactApiJars must exclude fabric-loader jars");
      }
      // 1.18.2/1.19.4 的 loom 产物名形如
      // `net_fabricmc_yarn_…-fabric-loader-0.14.24.jar`，分隔符是 `-` 不是 `.`/`/`。
      for (const ver of ["1.18.2", "1.19.4"]) {
        if (exactApiJars("fabric", ver).some(isLoaderJarPath)) {
          fail.push(`exactApiJars ${ver} must exclude tagged fabric-loader jars`);
        }
      }
      for (const n of [
        "fabric-loader-0.10.5.jar",
        "x.net.fabricmc-fabric-loader-0.14.24.jar",
        "remapped.net.fabricmc.fabric-loader-0.10.5.jar",
      ]) {
        if (!isLoaderJarPath(n)) fail.push("isLoaderJarPath missed " + n);
      }
      if (isLoaderJarPath("fabric-resource-loader-v0-0.5.3.jar")) fail.push("isLoaderJarPath must not match fabric-resource-loader");
      if (exactApiJars("quilt", "1.21.11").some(isLoaderJarPath)) {
        fail.push("exactApiJars must exclude quilt-loader jars");
      }
    }
    // mixinextras 的注解完整性下限：拿到的件必须三件注解齐全（0.3.5 缺 @Cancellable）。
    for (const [plas, ver] of [["fabric", "1.21.1"], ["fabric", "1.21.11"], ["fabric", "1.20.1"]]) {
      resetSupportApprox(plas, ver);
      const mx = pickMixinextrasJar(plas, ver);
      if (!mx) fail.push(`mixinextras not resolved for ${plas}/${ver}`);
      else if (!mixinextrasHasAll(mx)) fail.push(`mixinextras for ${plas}/${ver} missing @Local/@Share/@Cancellable: ${path.basename(mx)}`);
    }
    // 记账必须从**整档**分支真的流出去（第一次只加在 fragment 分支 ⇒ 全量报告里是空数组）。
    const src3 = fs.readFileSync(new URL(import.meta.url), "utf8");
    const approxSites = (src3.match(/supportApproximations: approximationsFor\(platform, version\)/g) || []).length;
    if (approxSites < 2) fail.push("supportApproximations must be returned from BOTH runPack branches (found " + approxSites + ")");
    // 【接线臂·必测源码实文】上面那些臂只测「函数对不对」，测不到「compileBlocks 里到底调的是谁」。
    // 投毒验证时发现：把 declared 改回 f.content、把 near 改成跨轴前缀、把 mixinextrasHasAll 改恒 true，
    // 这些臂**全都不红** —— 因为臂自己又算了一遍正确逻辑。所以这里直接钉源码里那几处**必须是哪一行**。
    // ⚠️ 比对串必须拆成两段拼出来，**不能整串写在臂的源码里**：如果整串出现，臂的源码自己也含有它，
    //    投毒把实现行改掉后 `src3.includes(needle)` 仍从臂这一行找到 ⇒ 臂永远绿（假臂）。
    //    这是 11k 连续三次假绿的真正原因 —— 前两次我在改「比对串取多长」，改错了方向。
    const ND = (a, b) => a.concat(b);
    const mustContain = [
      ["declared 必须走 stripCommentsAndStrings", ND("stripCommentsAndStrings(f.content)", ".matchAll(")],
      ["同轴顶替必须用 axis 前缀", ND("{ prefix: ", "axis }")],
      ["mixinextras 必须做注解完整性校验", ND("MIXINEXTRAS_NEEDED", ".every(")],
      ["同轴顶替必须记账", ND("kind || ", "\"same-axis\"")],
      ["fancymodloader loader 必须按档钉版本", ND("NEO_LOADER_VER", "[version]")],
      ["fabric loader 必须按档钉版本", ND("FABRIC_LOADER_VER", "[version]")],
      ["quilt loader 必须走 quilt-loader", ND("pickModuleJarSameAxis(\"org.quiltmc\"", ", \"quilt-loader\"")],
    ];
    for (const [what, needle] of mustContain) {
      if (!src3.includes(needle)) fail.push("wiring: " + what);
    }
    // 顺序臂：resetSupportApprox 必须在 artifactSet 之前，否则 artifactSet 里记的
    // 「1.20.1 无独立 loader」会被随后那次清零抹掉（只改顺序也能让记账失声）。
    {
      const resetNeedle = ND("resetSupportApprox(platform, version", ");");
      const artNeedle = ND("const art = artifactSet(platform, version", ");");
      const resetIdx = src3.indexOf(resetNeedle);
      const artIdx = src3.indexOf(artNeedle);
      if (resetIdx < 0 || artIdx < 0 || resetIdx > artIdx) {
        fail.push("wiring: resetSupportApprox must run before artifactSet");
      }
    }
    // 反查：老写法必须已经不在（它是「所有档取最新 12.0.8」的病根）。
    if (/fancymodloader",\s*"loader",\s*\{\}\s*\)/.test(src3)) {
      fail.push("wiring: 不许再有无版本前缀的 fancymodloader loader 调用");
    }
    // 反查：fabric 也不许再无条件取最新（mtime 最新是 0.10.5）。
    {
      const oldFabric = ND("newestJarIn(path.join(MODULES, \"net.fabricmc\", \"fabric-loader\"", "))");
      if (src3.includes(oldFabric)) fail.push("wiring: fabric loader 不许再用 newestJarIn");
    }
  }
  //      ① 1.21.10 表里 `AdvancementHolder` 是 mojmap-only（该档实测就是靠这条兜底）；
  //      ② `Advancement` 两侧同名 ⇒ 不算；
  //      ③ 表为 null ⇒ false（不崩）；
  //      ④ `MobEffect` 是 mojmap-only、`StatusEffect` 不是。
  {
    const pr = loadPairs("1.21.10");
    if (!pr) fail.push("yarn-mojmap-pairs for 1.21.10 not loadable");
    else {
      const wrap = (decl) => `public class T { ${decl} }`;
      if (!fenceUsesMojmapOnlyNamesViaPairs(wrap("AdvancementHolder h;"), pr)) fail.push("pairs: AdvancementHolder must be mojmap-only");
      if (fenceUsesMojmapOnlyNamesViaPairs(wrap("Advancement a;"), pr)) fail.push("pairs: Advancement must not be mojmap-only");
      if (!fenceUsesMojmapOnlyNamesViaPairs(wrap("MobEffect m;"), pr)) fail.push("pairs: MobEffect must be mojmap-only");
      if (fenceUsesMojmapOnlyNamesViaPairs(wrap("StatusEffect s;"), pr)) fail.push("pairs: StatusEffect must not be mojmap-only");
    }
    if (fenceUsesMojmapOnlyNamesViaPairs("public class T { AdvancementHolder h; }", null)) fail.push("pairs: null table must be false");
    // 撞名臂：① 显式从 java.* import 的名字不许进候选（机制臂：拿一个 mojmap-only 名当被 import 目标）；
    //         ② `Method` 这类常用 java.lang.reflect 名必须被 JDK_COMMON 兜住。
    {
      const synthetic = "import java.lang.AdvancementHolder;\npublic class T { AdvancementHolder h; }";
      if (mojmapCandidateNames(synthetic).includes("AdvancementHolder")) {
        fail.push("candidate names must exclude java.* imported names");
      }
      const reflectLike = "public class T { Method m; }";
      if (mojmapCandidateNames(reflectLike).includes("Method")) fail.push("JDK_COMMON must cover Method");
      const gametestLike = "package com.example.docs;\nimport java.lang.reflect.Method;\nimport net.minecraft.test.TestContext;\npublic class T { TestContext c; Method m; }";
      if (pr && fenceUsesMojmapOnlyNamesViaPairs(gametestLike, pr)) fail.push("pairs: java.lang.reflect.Method must not trigger mojmap-only");
    }
    // 接线臂：光有函数不够，两处 compileBlocks 调用必须真的把 pairs 与 refJars 都传进去
    //         （pairs 缺 ⇒ mojmap 兜底永不生效；refJars 缺 ⇒ 注解择优退化成包序）。
    const src2 = fs.readFileSync(new URL(import.meta.url), "utf8");
    const wiredPairs = (src2.match(/auxJars, pairs, refJars: art\.jars\.map/g) || []).length;
    if (wiredPairs < 2) fail.push("compileBlocks must receive pairs+refJars (found " + wiredPairs + " call sites)");
    // cpSet 必须把 auxJars 算进编译类路径 —— 漏了会把支撑件（注解就在里面）全判成「不在 CP 上」，
    // 等于把注解择优静默关掉（我第一次就踩了，靠 AUDIT_DEBUG_IMPORT 才看出来）。
    if (!/const cpSet = new Set\(\[\.\.\.jarPaths, \.\.\.\(opts\.auxJars \|\| SUPPORT_JARS\)\]\)/.test(src2)) {
      fail.push("cpSet must include auxJars");
    }
  }
  // 11j) 本档引用计数真的能读出来：拿 forge/1.20.1 的 mapped 件实测
  //      `javax.annotation.Nullable` 与 `org.jetbrains.annotations.Nullable` 都被引用过（都 > 0），
  //      且 javax 的计数**高于** jetbrains（实测 1406 class vs 253 class ⇒ 计数只会更大）。
  //      这条臂同时钉住「annotationRefCountsInJar 真的在扫件、不是永远返回 0」。
  {
    const refJars = artifactSet("forge", "1.20.1").jars.map((j) => j.jar).filter((p) => fs.existsSync(p));
    if (!refJars.length) fail.push("forge/1.20.1 artifacts not found for ref-count arm");
    else {
      const counter = makeAnnotationRefCounter(refJars);
      const jet = counter("org.jetbrains.annotations.Nullable");
      const javax = counter("javax.annotation.Nullable");
      if (!(jet > 0)) fail.push("ref count: jetbrains Nullable should be > 0, got " + jet);
      if (!(javax > 0)) fail.push("ref count: javax Nullable should be > 0, got " + javax);
      if (!(javax > jet)) fail.push("ref count: javax (" + javax + ") should exceed jetbrains (" + jet + ")");
      // 择优方向必须跟着本档实况走：本档 javax 多 ⇒ 选 javax
      const picked = pickAnnotationCandidate(
        ["org.jetbrains.annotations.Nullable", "javax.annotation.Nullable"],
        () => true,
        counter,
      );
      if (picked !== "javax.annotation.Nullable") fail.push("annotation tiebreak must follow real ref counts, got " + picked);
      if (!makeAnnotationRefCounter([])) { /* 空集合返回 null 是设计 */ } else fail.push("ref counter with no jars must be null");
    }
  }
  selftestHygiene(fail);
  console.log(fail.length ? "selftest FAIL: " + fail.join(" | ") : "selftest OK");
  process.exitCode = fail.length ? 1 : 0;
}

// ---------------------------------------------------------------- hygiene（不挂门链）

// 这些目录是生成物/镜像/外置数据，扫它们只会把同一个缺陷数成 8 份。
const HYGIENE_SKIP_DIRS = new Set([
  ".git", "node_modules", "build", ".gradle", "run", "data", "temp",
  ".claude", ".continue", ".trae", ".opencode", ".agents", ".zcode", ".pi",
]);

function listHygieneFiles(root, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (HYGIENE_SKIP_DIRS.has(e.name)) continue;
      listHygieneFiles(path.join(root, e.name), out);
    } else {
      out.push(path.join(root, e.name));
    }
  }
  return out;
}

// 用户脚手架里出现维护机绝对路径 = 会被 `Copy-Item -Recurse` / `cp -r` 带进用户工程。
// 只扫 `scaffold/**` 与 `README_AI.md`：knowledge/ 里的 `F:\MC_GAME\_oracle-jars` 是证据留档，不在此列。
const HYGIENE_ABS_PATH_RE = /(?:[A-Za-z]:[\\/]+(?:Users|Documents and Settings)[\\/]+|(?:[D-Gd-g]):[\\/]+(?:mc-skill-temp|MC_GAME)[\\/]+)[^\s"'`<>)]*/;

function hygieneAbsolutePath(file, lineNo, line, rel) {
  if (!/(^|\/)scaffold\//.test(rel) && !/(^|\/)README_AI\.md$/.test(rel)) return [];
  const m = line.match(HYGIENE_ABS_PATH_RE);
  if (!m) return [];
  const legacy = /^(?:rift|liteloader|modloader)\//.test(rel);
  return [finding("hygiene-abs-path", file, lineNo, m[0].slice(0, 80), line.trim(),
    legacy ? "info" : "fail",
    legacy ? "本机路径（该档历史上要求本地自备 jar；仍不应写进 scaffold）" : "scaffold/README 里写死了维护机绝对路径")];
}

function hygieneNeoForgeMetadata(file, lineNo, line, rel) {
  if (!/^neoforge\//.test(rel) || !/\.(?:toml|md)$/.test(rel)) return [];
  if (/^\s*#/.test(line) || /不得|禁止|旧写法|已废弃|deprecated/i.test(line)) return [];
  if (!/(?:^|\s)mandatory\s*=\s*true\b/.test(line)) return [];
  const archived = /^neoforge\/scaffold\//.test(rel);
  return [finding("hygiene-metadata", file, lineNo, "mandatory", line.trim(),
    archived ? "info" : "fail",
    "NeoForge 依赖字段是 type=\"required\"；mandatory 是已废弃键" + (archived ? "（根 scaffold 为归档件，见 LEGACY-NOTICE）" : ""))];
}

function hygieneStaleTotal(file, lineNo, line, rel) {
  const normative = /\.cursor\/rules\/[^/]+\.mdc$/.test(rel) || /\/knowledge\/[^/]+\.md$/.test(rel);
  if (!normative) return [];
  if (!/实测[^\n]{0,120}total:[1-9]\d*/.test(line)) return [];
  return [finding("hygiene-total", file, lineNo, "total", line.trim(), "info",
    "实测 total 会随语料扩容漂移；删数字或标注「非契约」")];
}

// 「未核实」段里出现「已验成 / 已核 / 取代」= 该条是撤回声明，不是待验项。
function hygieneUnverifiedRetractions(file, text) {
  const out = [];
  let inSection = false;
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,6}\s+/.test(line)) {
      inSection = /^#{1,6}\s*(?:未核实|未验|尚未核实)/.test(line);
      continue;
    }
    if (!inSection) continue;
    if (!/^\s*[-*]\s+/.test(line)) continue;
    // 只认「这一项本身被验掉」；「已核例子 / 已核掉 / 已核实引用」是旁证或撤回段标题，不是撤回声明。
    if (!/已验成|已真机核|已不再是未核实|取代|已核(?![例子范式掉实对过])/.test(line)) continue;
    if (/没有未核实项|无未核实项/.test(line)) continue;
    out.push(finding("hygiene-unverified", file, i + 1, "未核实", line.trim(), "fail",
      "「未核实」段里的条目其实是撤回声明；应移到「已核掉的旧项」"));
  }
  return out;
}

function hygieneNeoForgeField(file, lineNo, line, fields) {
  if (!fields || (!fields.outer.size && !fields.keys.size)) return [];
  const placeholder = new Set(["XXX", "XX", "X", "YOUR_FIELD", "FIELD", "FOO", "BAR"]);
  const out = [];
  for (const m of line.matchAll(/NeoForgeRegistries(\.Keys)?\.([A-Z][A-Z0-9_]*)(?![A-Za-z0-9_])/g)) {
    if (placeholder.has(m[2])) continue;
    const set = m[1] ? fields.keys : fields.outer;
    if (set.has(m[2])) continue;
    out.push(finding("hygiene-registry", file, lineNo, m[2], line.trim(), "fail",
      `NeoForgeRegistries${m[1] || ""} 没有字段 ${m[2]}；真名见 vanilla Registries`));
  }
  return out;
}

function javapStaticFields(jar, fqcn) {
  const r = spawnSync(JAVAP, ["-p", "-cp", jar, fqcn], { encoding: "utf8", timeout: 60000 });
  if (r.status !== 0 || !r.stdout) return null;
  const fields = new Set();
  for (const line of r.stdout.split(/\r?\n/)) {
    const m = line.match(/^\s*public\s+static\s+final\s+.*?\b([A-Z][A-Z0-9_]*);\s*$/);
    if (m) fields.add(m[1]);
  }
  return fields;
}

// 取本机真实 NeoForge universal/merged jar 的字段表；找不到 jar 就返回空集（不猜、不判红）。
// universal 件在 Gradle modules 缓存里，merged 件在 dev 实例的 build/moddev 下；两者都含
// `net.neoforged.neoforge.registries.NeoForgeRegistries`（universal 不含 net.minecraft，足够）。
function neoForgeFieldJarCandidates() {
  const out = [];
  const roots = [
    path.join(CACHE_MODULES, "net.neoforged", "neoforge"),
    "F:/MOD_TEST/dev",
    path.join(REPO, "temp"),
  ];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    walk(root, 6, out, (n) => /^neoforge-.*(?:universal|merged)\.jar$/.test(n) && !n.includes("-sources"));
  }
  return [...new Set(out)];
}

function neoForgeRegistryFields() {
  const all = { outer: new Set(), keys: new Set() };
  for (const jar of neoForgeFieldJarCandidates()) {
    const outer = javapStaticFields(jar, "net.neoforged.neoforge.registries.NeoForgeRegistries");
    if (outer) for (const f of outer) all.outer.add(f);
    const keys = javapStaticFields(jar, "net.neoforged.neoforge.registries.NeoForgeRegistries$Keys");
    if (keys) for (const f of keys) all.keys.add(f);
  }
  return all;
}

function runHygiene(args) {
  const roots = args.packs && args.packs.length
    ? args.packs.map((p) => path.join(REPO, p))
    : ["fabric", "forge", "neoforge", "quilt", "liteloader", "rift", "modloader", "bedrock", "paper"]
      .map((p) => path.join(REPO, p));
  const files = roots.flatMap((r) => listHygieneFiles(r));
  const findings = [];
  const fieldUses = [];
  for (const file of files) {
    if (!/\.(?:md|mdc|json|toml|properties|gradle|java|txt|ya?ml)$/.test(file)) continue;
    const rel = path.relative(REPO, file).replace(/\\/g, "/");
    let text;
    try { text = fs.readFileSync(file, "utf8"); } catch { continue; }
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      findings.push(...hygieneAbsolutePath(file, i + 1, line, rel));
      findings.push(...hygieneNeoForgeMetadata(file, i + 1, line, rel));
      findings.push(...hygieneStaleTotal(file, i + 1, line, rel));
      if (/^neoforge\//.test(rel) && /NeoForgeRegistries\.[A-Z]/.test(line)) {
        for (const m of line.matchAll(/NeoForgeRegistries\.([A-Z][A-Z0-9_]*)/g)) {
          fieldUses.push({ file, line: i + 1, token: m[1], text: line.trim() });
        }
      }
    }
    if (/\.(?:md|mdc)$/.test(file)) findings.push(...hygieneUnverifiedRetractions(file, text));
  }
  const fields = neoForgeRegistryFields();
  for (const u of fieldUses) findings.push(...hygieneNeoForgeField(u.file, u.line, u.text, fields));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, "hygiene.json");
  fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), roots: roots.map((r) => path.relative(REPO, r)), findings }, null, 2), "utf8");
  const byStatus = { fail: 0, unverifiable: 0, info: 0 };
  for (const f of findings) byStatus[f.status] = (byStatus[f.status] || 0) + 1;
  console.log(`hygiene: fail=${byStatus.fail} unverifiable=${byStatus.unverifiable} info=${byStatus.info} (files=${files.length})`);
  for (const f of findings.filter((x) => x.status === "fail")) {
    console.log(`  [FAIL] ${f.file}:${f.line} ${f.kind} ${f.symbol} :: ${f.evidence}`);
  }
  console.log(`report: ${path.relative(REPO, outFile)}`);
  process.exitCode = byStatus.fail ? 1 : 0;
}

function selftestHygiene(fail) {
  const t = (name, ok) => { if (!ok) fail.push("hygiene: " + name); };
  t("absolute path detected", hygieneAbsolutePath("x/scaffold/a.json", 1, "\"C:\\\\Users\\\\bob\\\\x\"", "neoforge/1.21.1/scaffold/a.json").length === 1);
  t("absolute path outside scaffold ignored", hygieneAbsolutePath("x/knowledge/a.md", 1, "F:\\MC_GAME\\_oracle-jars\\x.jar", "forge/1.20.1/knowledge/a.md").length === 0);
  t("legacy absolute path is info", hygieneAbsolutePath("x/scaffold/a.md", 1, "E:\\MC_GAME\\liteloader", "liteloader/1.12.2/scaffold/a.md")[0]?.status === "info");
  t("neoforge mandatory detected", hygieneNeoForgeMetadata("x", 1, "mandatory=true", "neoforge/1.21.1/scaffold/src/main/resources/META-INF/neoforge.mods.toml").some((f) => f.status === "fail"));
  t("archived mandatory is info", hygieneNeoForgeMetadata("x", 1, "mandatory=true", "neoforge/scaffold/README_AI.md")[0]?.status === "info");
  t("commented mandatory ignored", hygieneNeoForgeMetadata("x", 1, "# mandatory=true", "neoforge/1.21.1/scaffold/a.md").length === 0);
  t("stale total detected", hygieneStaleTotal("x", 1, "实测本版 total:11", "quilt/1.21.1/.cursor/rules/05-events.mdc").length === 1);
  t("total:0 ignored", hygieneStaleTotal("x", 1, "实测本版 total:0", "quilt/1.21.1/.cursor/rules/05-events.mdc").length === 0);
  t("retraction in unverified section detected", hygieneUnverifiedRetractions("x.md", "## 未核实\n\n- （X 已验成，见下节）").length === 1);
  t("real unverified item not flagged", hygieneUnverifiedRetractions("x.md", "## 未核实\n\n- X 仍未验").length === 0);
  t("verified example reference not flagged", hygieneUnverifiedRetractions("x.md", "## 未核实\n\n- 未逐个覆盖，已核例子见 01-events").length === 0);
  t("no-unverified statement not flagged", hygieneUnverifiedRetractions("x.md", "## 未核实\n\n- 本文件当前没有未核实项；旧项均已核掉").length === 0);
  const fields = { outer: new Set(["ATTACHMENT_TYPES"]), keys: new Set(["ATTACHMENT_TYPES"]) };
  t("missing registry field detected", hygieneNeoForgeField("x.md", 1, "NeoForgeRegistries.ENTITY_TYPES", fields).length === 1);
  t("present registry field accepted", hygieneNeoForgeField("x.md", 1, "NeoForgeRegistries.ATTACHMENT_TYPES", fields).length === 0);
  t("nested Keys field accepted", hygieneNeoForgeField("x.md", 1, "NeoForgeRegistries.Keys.ATTACHMENT_TYPES", fields).length === 0);
  t("placeholder field ignored", hygieneNeoForgeField("x.md", 1, "NeoForgeRegistries.Keys.XXX", fields).length === 0);
  t("no jar means no field judgement", hygieneNeoForgeField("x.md", 1, "NeoForgeRegistries.ENTITY_TYPES", { outer: new Set(), keys: new Set() }).length === 0);
}

// ---------------------------------------------------------------- main

function parseArgs(argv) {
  const args = { packs: [], all: false, compile: false, complete: false, selftest: false, hygiene: false, fragment: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--selftest") args.selftest = true;
    else if (a === "--hygiene") args.hygiene = true;
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
  const base = path.join(CACHE_MODULES, "net.fabricmc.fabric-api");
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

function isLoaderJarPath(f) {
  // 同时覆盖 `fabric-loader-…jar` 与 `remapped.net.fabricmc.fabric-loader-…jar`；
  // 后者是 Loom 产物，同样不该留在 fapi 层。
  return /(?:^|[.\\/_-])(?:fabric-loader|quilt-loader)-[^\\/]+\.jar$/.test(f);
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
  // loader 不是 FAPI 模块：它在 artifactSet 里按档单独取。若把它留在 fapi 层，
  // 旧档会从 loom-cache 里拿到错误版本（1.14.4 实测有 0.10.5 的 fabric-loader），
  // 既污染存在性索引，也可能被当成可导入候选。
  const fapiOnly = all.filter((f) => !isLoaderJarPath(f));
  // 同一目录里可能残留上一次构建（另一个 Minecraft 版本）的产物；有 remapped.* 就只认它。
  const remapped = fapiOnly.filter((f) => path.basename(f).startsWith("remapped."));
  if (remapped.length) return [...new Set(remapped)];
  const tag = "_" + version.replace(/\./g, "_") + "_";
  const tagged = fapiOnly.filter((f) => f.includes(tag));
  if (tagged.length) return [...new Set(tagged)];
  if (/^26\./.test(version)) return resolveFapiFromPom(version);
  return [];
}

function runPack(packDir, opts) {
  // 基岩包没有版本子目录（规则树在 bedrock/.cursor），Java 构件面不适用，只跑通用 prose 检查。
  const isBedrock = path.basename(packDir) === "bedrock" && fs.existsSync(path.join(packDir, "pack.meta.json"));
  const platform = isBedrock ? "bedrock" : path.basename(path.dirname(packDir));
  const version = isBedrock ? "stable" : path.basename(packDir);
  // artifactSet 也可能产生近似记账（neoforge 1.20.1 没有独立 loader 件），
  // 清零必须放在它之前，否则 artifactSet 里记的账会被 supportJarsFor 前这一步抹掉。
  resetSupportApprox(platform, version);
  const art = artifactSet(platform, version);
  const jars = [...art.jars];
  let ext = [];
  let compileApi = [];
  if (platform === "fabric" || platform === "quilt") {
    const exact = exactApiJars(platform, version);
    const { fapi } = opts.jars;
    // 索引面：没有精确 remap 件时仍用全局模块做「类名存在性」检查（包名与映射无关）。
    for (const j of (exact.length ? exact : fapi).filter((f) => !isLoaderJarPath(f))) jars.push({ jar: j, layer: "fapi" });
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
  // 【工具侧缺口修复】加载器注解/事件总线/注入框架/通用库只进**编译类路径**，不进存在性索引：
  //   · 进存在性索引会把「本档 MC 构件里没有这个类」和「本档根本没装这个库」混为一谈；
  //   · 但补全器必须知道这些名字的唯一 FQCN，否则 @SubscribeEvent / @Mixin / Dist / Nullable
  //     这些「本档确实有、只是不在 MC 合并 jar 里」的名字永远补不出来 —— 单开一个 support 层。
  // 这两步抽成 mergeSupportIndex()，selftest 才投得动毒。
  // 支撑件的「近似顶替」从 artifactSet 就开始记账，随该档结果写进报告（见 supportApproximations）。
  const supportJars = supportJarsFor(platform, version);
  const auxJars = [...new Set([...supportJars, ...GENERIC_SUPPORT_JARS])];
  mergeSupportIndex(inv, buildIndex(auxJars.map((jar) => ({ jar, layer: "support" }))));
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
    findings.push(...compileBlocks("<fragment>", parsed, compileJars, inv, { complete: true, expected: art.expected, apiJars, auxJars, pairs, refJars: art.jars.map((j) => j.jar) }));
    return {
      platform,
      version,
      artifacts: { expectedLayer: art.expected, jars: compileJars.map((jar) => ({ jar: path.relative(REPO, jar), layer: "compile" })) },
      supportApproximations: approximationsFor(platform, version),
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

  // 没有构件却按「编译通过」沉默收工，是假绿。--complete 下必须留一条工具侧缺口。
  if (opts.compile && !jars.length) {
    findings.push({
      kind: "compile",
      file: path.relative(REPO, packDir),
      line: 0,
      symbol: "artifacts",
      claim: "本档没有可解析的构件，--complete 编译被跳过",
      status: "unverifiable",
      evidence: "artifactSet 返回空",
    });
  }
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
      findings.push(...compileBlocks(file, parsed, compileJars, inv, { complete: opts.complete, expected: art.expected, apiJars, auxJars, pairs, refJars: art.jars.map((j) => j.jar) }));
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
    // 支撑件近似顶替必须随「整档」结果一起出去 —— 只写在 fragment 分支里等于没记
    // （第一次就是只加在 fragment 分支，全量跑出来 supportApproximations 是空数组）。
    supportApproximations: approximationsFor(platform, version),
    findings,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selftest) return selftest();
  if (args.hygiene) return runHygiene(args);
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
    console.error("用法：--packs fabric/1.21.11,forge/1.20.1 | --all [--compile|--complete] | --hygiene [--packs <档>] | --packs <档> --fragment <片段.java> | --selftest");
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
  // 支撑件近似记账的**汇总**（审计器可回归比较；不只在单档里可见）。
  const approxAll = results.flatMap((r) => (r.supportApproximations || []).map((a) => ({ ...a, pack: `${r.platform}/${r.version}` })));
  if (approxAll.length) {
    report.supportApproximations = approxAll;
    console.log(`\n支撑件近似顶替 ${approxAll.length} 处（会让 unverifiable 可能被低估，逐条见 report.supportApproximations）：`);
    for (const a of approxAll) {
      console.log(`  [APPROX] ${a.pack} ${a.artifact}: 本档 ${a.want} → 实取 ${a.got} (${a.kind})`);
    }
  } else {
    report.supportApproximations = [];
  }
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
