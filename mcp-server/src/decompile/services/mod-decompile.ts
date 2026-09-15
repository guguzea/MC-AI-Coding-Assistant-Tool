/**
 * decompile_mod_jar 编排服务（T2）。
 *
 * 流程：参数校验 → Java 17 探测（FIRST）→ skip-download 门控 → 元数据分析
 *   →（可选 remap，需匹配 MC 版本）→ 写前清空目标子树 → VineFlower 反编译到
 *   $CACHE/decompiled-mods/<modId>/<version>-<jar sha512 前 12 位>/ → 源码树摘要。
 *
 * 仅本地绝对路径 jar；缓存只写 $MC_SKILL_CACHE；不触碰项目目录。
 */

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, openSync, readSync, closeSync } from "fs";
import { tmpdir } from "os";
import { basename, isAbsolute, join, relative, sep } from "path";
import { createHash } from "crypto";
import { actionable, withAction, type ActionEnvelope } from "../../utils/actionable.js";
import { parseMinecraftVersion, type MappingChoice } from "../version-manager.js";
import {
  ensureCachePaths,
  openCacheDb,
  setArtifact,
  getArtifact,
  acquireCacheLock,
  CacheLockBusyError,
  normalizeArtifactPath,
  sanitizeCacheSegment,
  isPathInside,
} from "../cache.js";
import { probeJava, runJava, toolchainActionable, skipDownloadsEnabled, downloadDisabledActionable } from "../java/java-process.js";
import { ensureResourceJar, ensureTinyRemapperJars, VINEFLOWER_DEF, DownloadDisabledError } from "../downloaders/resources.js";
import { downloadFile, DownloadError } from "../downloaders/http.js";
import { resolveYarnMappings, mappingCacheViable } from "../downloaders/yarn.js";
import { resolveMojangVersion } from "../downloaders/mojang.js";
import { listZipEntries, readZip, readJarBytes } from "../zip-util.js";
import { analyzeModJar } from "./mod-analyzer.js";
import {
  assertVineflowerDiskSpace,
  ensureMojmapTiny,
  ensureYarnTiny,
  remapperCli,
  vineflowerCli,
} from "./java-pipeline.js";

export interface DecompileModJarArgs {
  jarPath: string;
  /** 匹配的 MC 版本（用于可选 remap；缺省则不 remap） */
  version?: string;
  /** remap 映射层（仅 1.14–1.21.11 有意义） */
  mapping?: "yarn" | "mojmap";
  force?: boolean;
  /**
   * S5b：纯库 jar（实测 `kotlinforforge-*.jar` 4026 条目内既无 mods.toml 也无 mcmod.info）
   * 从自身元数据永远解不出身份。允许调用方（批处理器读 `lib-manifests/all.json` 的 `modId`）
   * 给一个外部证据 candidate —— 但它不直接生效：必须在这个 jar 自己的条目路径里出现同一段
   * 才被采信，否则照旧返回 MOD_ID_UNKNOWN 结构化失败。MCP 工具面不暴露该参数（只给内部调用），
   * 免得 agent 可以随意给 jar 命名。
   */
  externalModId?: string;
}

export interface ModDecompileResult {
  found: boolean;
  modId?: string;
  /** 身份来源：`jar` = 自身元数据；`jarjar-self`/`jarjar-labeled` = 它自己声明的内层 jar；`external` = 调用方标签（已被条目证实） */
  modIdEvidence?: "jar" | "external" | "jarjar-self" | "jarjar-labeled";
  /** 外壳声明的内层件（`META-INF/jars|jarjar/*.jar`）：归属标签的 bundled 证据源 */
  bundledJars?: string[];
  /** 身份来自哪个内层件（仅 `jarjar-*` 时有值）：调用方据此只反编译那一个，不再猜 */
  modIdSource?: string;
  modVersion?: string;
  loaders?: string[];
  /** 该产物实际所用的 MC 版本（缓存命中时回填盘上记录，不等于本次请求；见 requestedVersion） */
  version?: string;
  /** 该产物实际所用的 remap 映射层；null/缺省 = 未经 remap */
  mapping?: string | null;
  /** 本次调用请求的 MC 版本（与 version 不一致即说明结果来自缓存且判据已变） */
  requestedVersion?: string;
  outputDir?: string;
  fileCount?: number;
  javaFileCount?: number;
  topLevelDirs?: string[];
  sampleFiles?: string[];
  truncated?: boolean;
  remapped?: boolean;
  /**
   * 命中了盘上已有的反编译树，但其生成判据（version / mapping）与本次请求不一致。
   * true 时输出名称可能仍属于旧版本 / 旧映射层，需要 `force: true` 才能按本次请求重建。
   */
  cacheStale?: boolean;
  /**
   * remap 抛错、已降级为「对原始 jar 反编译」。
   * 与 `remapped: false` 的区别：后者也可能是「26.1+ 免 remap」这种**正常**情况。
   */
  remapFailed?: boolean;
  /** 输出中的类/方法名为混淆名或中间名，不可当正式 API 使用。 */
  degraded?: boolean;
  /**
   * D-19：产物已真实产出，但完成标记 `.mc-skill-decompiled.json` 写入失败。
   * `found: true` 仍然成立（源码树可用），只是后续缓存命中判据缺失；原因写在 `warnings` 里。
   * 字段缺席 = 本次标记写入正常。
   */
  partial?: boolean;
  /** 失败诊断用：jar 内容身份（sha512 前 12 位）。modId 解析失败时靠它指明是哪个 jar。 */
  jarIdentity?: string;
  warnings?: string[];
  note?: string;
  error?: string;
  action?: ActionEnvelope;
}

function tail(s: string, n = 800): string {
  const t = s.trim();
  return t.length > n ? "…" + t.slice(-n) : t;
}

function walkJava(dir: string, limit = 5000): { files: string[]; truncated: boolean } {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.endsWith(".java")) {
        if (out.length >= limit) return { files: out, truncated: true };
        out.push(full);
      }
    }
  }
  return { files: out, truncated: false };
}

function summarizeTree(outDir: string): { fileCount: number; javaFileCount: number; topLevelDirs: string[]; sampleFiles: string[]; truncated?: boolean } {
  const walked = walkJava(outDir);
  const javaFiles = walked.files;
  const topLevelDirs = readdirSync(outDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  const sampleFiles = javaFiles.slice(0, 15).map((f) => relative(outDir, f).split(sep).join("/"));
  return {
    fileCount: javaFiles.length,
    javaFileCount: javaFiles.length,
    topLevelDirs,
    sampleFiles,
    ...(walked.truncated ? { truncated: true } : {}),
  };
}

/** 递归统计目录内文件数（写前/写后清理实证用） */
function countTreeFiles(dir: string): number {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  let n = 0;
  for (const e of entries) {
    if (e.isDirectory()) n += countTreeFiles(join(dir, e.name));
    else n++;
  }
  return n;
}

/**
 * jar 内容身份段 = sha512 前 12 位十六进制（F92）。
 *
 * 必须来自字节内容而不是 mod 元数据：同 modId + 同 version 的两个不同构建
 * （重新上传 / 不同 loader 打包 / 占位符版本回退出同一个名字）若共用一棵源码树，
 * 后写的那次只会覆盖同名文件，残留会让 `javaFileCount` 与包名归属一起失真。
 * 分块读，避免把整个 jar 读进内存。
 */
export function jarContentIdentity(jarPath: string): string {
  const hash = createHash("sha512");
  const fd = openSync(jarPath, "r");
  try {
    const buf = Buffer.alloc(1 << 20);
    for (;;) {
      const n = readSync(fd, buf, 0, buf.length, null);
      if (n <= 0) break;
      hash.update(buf.subarray(0, n));
    }
  } finally {
    closeSync(fd);
  }
  return hash.digest("hex").slice(0, 12);
}

/**
 * modId → 缓存目录段（纯函数，CI 可测）。
 *
 * 解析不出 modId 一律判失败：旧实现回落 `unknown-mod`，于是所有解析不出的 jar
 * 挤进同一目录，后来者会把前者的源码树当自己的缓存命中冒领（F92）。
 */
export function resolveModIdSegment(
  metaModId: string | null | undefined,
): { ok: true; modId: string } | { ok: false; code: "MOD_ID_UNKNOWN" | "INVALID_INPUT"; message: string } {
  const raw = typeof metaModId === "string" ? metaModId.trim() : "";
  if (!raw) {
    return { ok: false, code: "MOD_ID_UNKNOWN", message: "jar 内元数据未给出 modId" };
  }
  const cleaned = sanitizeCacheSegment(raw);
  if (!cleaned) {
    return { ok: false, code: "INVALID_INPUT", message: `modId 非法（含路径穿越或空段）：${raw}` };
  }
  return { ok: true, modId: cleaned };
}

/**
 * 包路径里是否真有这一段（S5b 的外部证据硬闸）。
 *
 * 与 catalog / merge-verified-api 同一条自有判据：modId 当作「路径的一段」看，`-` 与 `_` 不敏感；
 * 分隔符同时吃 `.`（Java 包名）与 `/`（jar 条目路径），所以包清单和 zip 条目都能直接喂进来
 * （`kotlin-for-forge` ↔ `kotlinforforge` 视为同段）。空 modId 一律判否，免得空串退化成通配。
 */
export function packagesOwnModId(
  packages: (string | null | undefined)[] | undefined,
  modId: string | null | undefined,
): boolean {
  const seg = String(modId ?? "").toLowerCase().replace(/[-_]/g, "");
  if (!seg) return false;
  return (packages ?? []).some((p) =>
    String(p ?? "")
      .split(/[./]+/)
      .some((raw) => raw.toLowerCase().replace(/[-_]/g, "") === seg),
  );
}

/** 壳 jar 自己声明的内层件（FML Jar-in-Jar 与 jarjar shaded 两类都在外壳条目里）。 */
export function bundledJarEntries(names: string[]): string[] {
  return names.filter((n) => /^META-INF\/(jars|jarjar)\/[^/]+\.jar$/.test(n)).sort();
}

/**
 * 外壳解不出身份时，从**它自己声明的**内层 jar 里读身份（S5b）。
 *
 * 顺序不是随便定的：`META-INF/jars|jarjar/*.jar` 是构建时写进外壳的声明，属 jar 内部证据，
 * 强于调用方给的标签；而包名启发式会误判改名遗留（Moonlight 早期就是 selene），所以不猜包名。
 * 只在无歧义时采信：内层恰好一个解得出 modId，或恰好一个与调用方标签相符。
 * 多义（CCA 那类平级子模组）返回候选交人/agent 决定，绝不挑第一个。
 *
 * S5c：导出只为让 `test-decompile.mjs` 能离线合成胖壳 fixture 直接对拍这条无歧义判据
 * （不联网、不需要 JDK）；判据本身未改。
 */
export function resolveEmbeddedIdentity(
  jarBuffer: Buffer,
  innerEntries: string[],
  hint: string | undefined,
):
  | { ok: true; modId: string; modVersion?: string; evidence: "jarjar-self" | "jarjar-labeled"; from: string }
  | { ok: false; candidates: string[]; reason: string } {
  let zip: Map<string, Buffer>;
  try {
    zip = readZip(jarBuffer);
  } catch (err) {
    return { ok: false, candidates: [], reason: `内层 jar 读取失败：${(err as Error).message}` };
  }
  const norm = (v: string) => v.trim().toLowerCase().replace(/[-_]/g, "");
  const want = typeof hint === "string" ? norm(hint) : "";
  const hits: { entry: string; modId: string; modVersion?: string }[] = [];
  const scratch = mkdtempSync(join(tmpdir(), "mc-skill-jij-"));
  try {
    for (const entry of innerEntries) {
      const buf = zip.get(entry);
      if (!buf) continue;
      const tmpJar = join(scratch, entry.replace(/[/\\]/g, "_"));
      try {
        writeFileSync(tmpJar, buf);
        const inner = analyzeModJar(tmpJar);
        const seg = resolveModIdSegment(inner.modId);
        if (seg.ok) hits.push({ entry, modId: seg.modId, modVersion: inner.modVersion });
      } catch {
        /* 单个内层读不动：跳过，不影响其余判定 */
      }
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
  const uniq = [...new Set(hits.map((h) => h.modId))];
  if (want) {
    const match = hits.filter((h) => norm(h.modId) === want);
    if (match.length === 1) {
      return { ok: true, modId: match[0].modId, modVersion: match[0].modVersion, evidence: "jarjar-labeled", from: match[0].entry };
    }
  }
  if (hits.length > 0 && uniq.length === 1) {
    return { ok: true, modId: hits[0].modId, modVersion: hits[0].modVersion, evidence: "jarjar-self", from: hits[0].entry };
  }
  return {
    ok: false,
    candidates: hits.map((h) => `${h.entry}#${h.modId}`),
    reason: hits.length === 0 ? "内层 jar 也没有 mods.toml / fabric.mod.json 等元数据" : `内层解出 ${uniq.length} 个不同 modId（平级子模组），不猜`,
  };
}

/** `pickDecompileInput` 允许换成内层件的身份来源（= `resolveEmbeddedIdentity` 的两种 ok evidence）。 */
const EMBEDDED_EVIDENCES: readonly string[] = ["jarjar-self", "jarjar-labeled"];

export interface PickDecompileInputArgs {
  /** 用户传进来的 jar（胖壳时它是外壳）；任何分支的默认输入都是它 */
  jarPath: string;
  /** 身份来源。只有 `jarjar-self` / `jarjar-labeled` 才允许换输入；`jar` / `external` 原样用外壳 */
  evidence: ModDecompileResult["modIdEvidence"];
  /** 身份出自哪个内层件（`resolveEmbeddedIdentity().from`）；缺省即不换 */
  modIdSource?: string;
  /** 外壳字节内容身份（sha512 前 12 位），参与内层落盘文件名 */
  jarIdentity: string;
  /** 内层件落盘目录（`cache.remapped`）；产物必须落在它之内 */
  extractDir: string;
  /** 从外壳取一个条目的字节。生产实现 = `readZip(readFileSync(jarPath)).get(name)` */
  readEntry: (name: string) => Buffer | undefined | null;
  /** 落盘（建目录 + 已存在则跳过）。缺省 = 不落盘（纯决策，测试用）；生产必须注入 */
  extract?: (destPath: string, data: Buffer) => void;
}

export interface PickDecompileInputResult {
  /** 真正送去 remap / VineFlower 的 jar */
  inputJar: string;
  /** true = 用的是内层件（等价于旧代码 `bytecodeJar !== args.jarPath`） */
  usingEmbedded: boolean;
  /** 采用内层件时的条目名（诊断用） */
  embeddedSource?: string;
  /** 未采用内层件的原因。**只回给测试**：旧代码这条路径静默 catch，不并进 warnings，行为保持不变 */
  reason?: string;
}

/**
 * S5c（F57）：胖壳的**输入选择**（纯函数，CI 可测）。
 *
 * 原缺陷：`decompile_mod_jar` 只回传 `modIdSource` 不消费它，remap + VineFlower 全跑在外壳上，
 * 于是 Modrinth 的 `kotlinforforge-*-all.jar`（4527 条目里真身只占 13 条）解出来的是被 shade
 * 进来的 Kotlin stdlib。S35 已把消费逻辑落进 `decompileModJar`；这里把同一套判据搬出来，
 * 让它能离线对拍——不联网、不需要 JDK/VineFlower、不读 dist 之外的运行时。
 *
 * 判据与搬之前逐位一致：
 *  1. 身份来自内层件（`evidence` 是 `jarjar-*` 且有 `modIdSource`）才换输入；`jar` / `external`
 *     ⇒ 原样外壳（普通模组的输入绝不能被换掉）。等价于旧代码的 `if (embeddedOk)`。
 *  2. 落盘名 = `extractDir/embedded-<jarIdentity>-<sanitizeCacheSegment(条目名展平)>`，
 *     再过 `isPathInside(extractDir, …)`；取不到字节 / 任一环节抛错 ⇒ 维持外壳（旧的静默 catch）。
 *     `inner == null` 而不是 `!inner`：`Buffer.alloc(0)` 是 truthy，旧代码会采用 0 字节条目。
 *  3. 额外的 zip-path 守卫（条目名含 `..` 段 / 是绝对路径 ⇒ 直接拒绝、不调 `readEntry`）：
 *     生产上 `modIdSource` 只能来自 `bundledJarEntries` 的 `^META-INF/(jars|jarjar)/[^/]+\.jar$`，
 *     这类名字进不来 ⇒ 该守卫不改变任何生产可达输入的决策，只给纯函数面兜底。
 */
export function pickDecompileInput(a: PickDecompileInputArgs): PickDecompileInputResult {
  const shell: PickDecompileInputResult = { inputJar: a.jarPath, usingEmbedded: false };
  const src = typeof a.modIdSource === "string" ? a.modIdSource : "";
  if (!EMBEDDED_EVIDENCES.includes(String(a.evidence)) || !src) return shell;
  if (src.split(/[/\\]/).some((seg) => seg === "..")) {
    return { ...shell, reason: `内层条目名含 ".." 段，zip-path 守卫拒绝：${src}` };
  }
  if (isAbsolute(src) || /^[a-zA-Z]:[/\\]/.test(src) || src.startsWith("\\\\")) {
    return { ...shell, reason: `内层条目名是绝对路径，zip-path 守卫拒绝：${src}` };
  }
  try {
    const embeddedName = sanitizeCacheSegment(src.replace(/[/\\]/g, "_"));
    const extracted = embeddedName ? join(a.extractDir, `embedded-${a.jarIdentity}-${embeddedName}`) : "";
    if (!extracted) return { ...shell, reason: `内层落盘文件名非法（含路径穿越或空段）：${src}` };
    if (!isPathInside(a.extractDir, extracted)) {
      return { ...shell, reason: `内层落盘路径逃出 remapped 缓存目录：${extracted}` };
    }
    const inner = a.readEntry(src);
    if (inner == null) return { ...shell, reason: `外壳条目里没有该内层件：${src}` };
    a.extract?.(extracted, inner);
    return { inputJar: extracted, usingEmbedded: true, embeddedSource: src };
  } catch (err) {
    return { ...shell, reason: `内层件取不出（维持解外壳）：${(err as Error).message}` };
  }
}

/**
 * 写前清空目标子树（F92）：VineFlower 只覆盖同名文件，旧树残留会混进本次产物。
 *
 * 两道护栏：`outDir` 必须严格落在 decompiled-mods 之下，且不等于该目录本身
 * （`relative` 为空即两者相同）。win32 上 `rmSync(force)` 可能「成功返回却什么都没删」，
 * 所以删除后必须再实证一次目录确实消失，否则调用方要判失败而不是带着旧树继续写。
 */
export function clearDecompileTarget(
  decompiledModsRoot: string,
  outDir: string,
): { removedFiles: number; error: string | null } {
  const rel = relative(decompiledModsRoot, outDir);
  if (!rel || rel.startsWith("..") || !isPathInside(decompiledModsRoot, outDir)) {
    return { removedFiles: 0, error: `拒绝清空：目标不在 decompiled-mods 子树内（${outDir}）` };
  }
  if (!existsSync(outDir)) return { removedFiles: 0, error: null };
  const before = countTreeFiles(outDir);
  try {
    rmSync(outDir, { recursive: true, force: true });
  } catch (err) {
    return { removedFiles: 0, error: `清空 ${outDir} 抛出：${(err as Error).message}` };
  }
  if (existsSync(outDir)) {
    return { removedFiles: 0, error: `清空 ${outDir} 未生效（仍有 ${countTreeFiles(outDir)} 个文件残留）` };
  }
  return { removedFiles: before, error: null };
}

/** 该目录（含子目录）里是否真的有 .java 源码 */
function containsJava(dir: string): boolean {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const e of entries) {
    if (e.isFile()) {
      if (e.name.endsWith(".java")) return true;
    } else if (e.isDirectory() && containsJava(join(dir, e.name))) {
      return true;
    }
  }
  return false;
}

/** 源码树里的顶层包根（只取含 .java 的一级目录；文件与资源目录不参与归属判定） */
function javaPackageRoots(dir: string): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const e of entries) {
    if (e.isDirectory() && containsJava(join(dir, e.name))) out.push(e.name);
  }
  return out;
}

/**
 * 源码树归属校验（F92/F93）：`.java` 的包根必须出自该 jar 自身的 `.class` 条目。
 *
 * 撞名 / 冒领来的树会带进别人的顶层包（如 `com/` 混进只有 `dev/` 的树）。只比顶层段：
 * remap 会改类名与深层包，但不会改 `com` / `net` / `org` / `dev` 这类根段，误报面小。
 * jar 内没有带包的 class（资源-only / 根目录 class）时无判据，返回 ok 让空产物分支处理。
 */
export function verifyOutputOwnership(
  outputDir: string,
  jarPath: string,
): { ok: boolean; foreignPackages: string[]; reason?: string } {
  let names: string[];
  try {
    names = listZipEntries(readJarBytes(jarPath));
  } catch (err) {
    return { ok: false, foreignPackages: [], reason: `无法读取 jar 条目：${(err as Error).message}` };
  }
  const jarRoots = new Set<string>();
  for (const name of names) {
    if (!name.endsWith(".class") || name.includes("\\")) continue;
    const slash = name.indexOf("/");
    if (slash > 0) jarRoots.add(name.slice(0, slash).toLowerCase());
  }
  if (jarRoots.size === 0) return { ok: true, foreignPackages: [] };
  const foreign = javaPackageRoots(outputDir).filter((root) => !jarRoots.has(root.toLowerCase()));
  return foreign.length === 0
    ? { ok: true, foreignPackages: [] }
    : {
        ok: false,
        foreignPackages: foreign,
        reason: `源码树包根 ${foreign.join(", ")} 不出现在该 jar 的 .class 条目中`,
      };
}

/**
 * remap 降级标记（纯函数，便于无 Java / 无网络的 CI 测试）。
 *
 * 区分三种情形，调用方据此判断输出是否可信：
 * - `remapped: true`         → 正常重映射，名称可信
 * - `remapped: false` 且无错 → **正常**免 remap（如 26.1+），不算降级
 * - `remapped: false` 且有错 → **降级**：输出为混淆/中间名，不可当正式 API 使用
 *
 * 背景：原实现把降级只写进 `note` 字符串，却仍返回 `found: true`，
 * 调用方无法可靠判定结果是否可用（输出混淆 jar 却报成功）。
 */
export function decompileDegradation(
  remapped: boolean,
  remapError: string | null,
): { remapFailed: boolean; degraded: boolean; warnings: string[] } {
  const failed = !remapped && remapError !== null;
  return {
    remapFailed: failed,
    degraded: failed,
    warnings: failed
      ? [
          `输出为混淆/中间名：remap 已失败降级（${remapError}），源码中的类/方法名不可当正式 API 使用。`,
        ]
      : [],
  };
}

/** 为 search_mod_code 定位：jarPath → 已反编译目录（cache.db 索引） */
export function findDecompiledDirForJar(jarPath: string, cacheRoot = ensureCachePaths().root): string | null {
  try {
    const db = openCacheDb(cacheRoot);
    try {
      const rec = getArtifact(db, `decompiled-mod:${normalizeArtifactPath(jarPath)}`);
      if (!rec || !existsSync(rec.path)) return null;
      return rec.path;
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

/** 记录 jar → 反编译目录映射 */
function recordDecompiledDir(jarPath: string, outDir: string, modId: string, cacheRoot: string): void {
  const db = openCacheDb(cacheRoot);
  try {
    setArtifact(db, `decompiled-mod:${normalizeArtifactPath(jarPath)}`, "decompiled-mod", outDir, { version: modId });
  } finally {
    db.close();
  }
}

export async function decompileModJar(args: DecompileModJarArgs): Promise<ModDecompileResult> {
  // 0. 参数校验（`args` 整个缺失也要走结构化诊断，不许裸抛 TypeError）
  if (!args?.jarPath) {
    return withAction(
      { found: false, error: "INVALID_INPUT" },
      actionable("INVALID_INPUT", "jarPath 不能为空", ["传入本地 jar 的绝对路径"]),
    );
  }
  if (!existsSync(args.jarPath) || !statSync(args.jarPath).isFile()) {
    return withAction(
      { found: false, error: "NOT_FOUND", jarPath: args.jarPath },
      actionable("NOT_FOUND", `jar 不存在: ${args.jarPath}`, ["核对路径后重试"]),
    );
  }

  // 1. skip-download 门控（CI：先于 Java，保证 DOWNLOAD_DISABLED 可测）
  if (skipDownloadsEnabled()) {
    return withAction(
      { found: false, error: "DOWNLOAD_DISABLED", jarPath: args.jarPath },
      downloadDisabledActionable("decompile_mod_jar 需要下载 VineFlower 工具 jar"),
    );
  }

  // 2. Java 17+ 探测（绝不崩溃）
  const probe = await probeJava();
  if (!probe.ready) {
    return withAction(
      { found: false, error: "TOOLCHAIN_MISSING", jarPath: args.jarPath },
      toolchainActionable(
        `反编译模组需要 Java 17+（当前: ${probe.versionText ?? "未检测到 java"}）。`,
      ),
    );
  }

  // 3. 元数据分析
  const meta = analyzeModJar(args.jarPath);
  if (!meta.found) {
    return withAction({ found: false, error: meta.action?.code ?? "NOT_FOUND", jarPath: args.jarPath }, meta.action);
  }
  // F92：产物目录身份段取自 jar 字节内容（sha512 前 12 位）。先算出来，失败诊断与 outDir 共用一份真值。
  const jarIdentity = jarContentIdentity(args.jarPath);
  const identity = resolveModIdSegment(meta.modId);
  // 外壳（JiJ / jarjar）与条目只在需要时才读一次，成功路径不为它们付双倍解压成本
  let shellNames: string[] | null = null;
  const namesOf = (): string[] => {
    if (shellNames === null) {
      try {
        shellNames = listZipEntries(readFileSync(args.jarPath));
      } catch {
        shellNames = [];
      }
    }
    return shellNames;
  };
  const bundledJars = identity.ok ? [] : bundledJarEntries(namesOf());
  // 身份优先级：① jar 自己的元数据 → ② 它自己声明的内层 jar（外壳的实证）→ ③ 调用方标签（须被条目证实）
  let embeddedId: ReturnType<typeof resolveEmbeddedIdentity> | null = null;
  if (!identity.ok && bundledJars.length > 0) {
    embeddedId = resolveEmbeddedIdentity(readFileSync(args.jarPath), bundledJars, args.externalModId);
  }
  const embeddedOk = embeddedId && embeddedId.ok ? embeddedId : null;
  // S5b 外部证据：只在 jar 自身条目里真有那一段时成立（判据与摘要/catalog 同一条，不另写一份）
  let externalId: { modId: string; evidence: "external" } | null = null;
  if (!identity.ok && !embeddedOk && args.externalModId) {
    const ext = resolveModIdSegment(args.externalModId);
    if (ext.ok && packagesOwnModId(namesOf(), ext.modId)) externalId = { modId: ext.modId, evidence: "external" };
  }
  if (!identity.ok && !embeddedOk && !externalId) {
    const why =
      embeddedId && !embeddedId.ok
        ? `｜内层声明件也定不下身份：${embeddedId.reason}${embeddedId.candidates.length ? `（候选 ${embeddedId.candidates.join(" , ")}）` : ""}`
        : args.externalModId
          ? `｜调用方给的外部证据「${args.externalModId}」未通过：它本身非法，或该 jar 自己的条目路径里没有这一段（外部证据不绕过归属）`
          : "";
    return withAction(
      { found: false, error: identity.code, jarPath: args.jarPath, jarIdentity, bundledJars },
      actionable(
        identity.code,
        `${identity.message}；已拒绝回落 unknown-mod 目录（jar 内容身份 = sha512 前 12 位 ${jarIdentity}）。${why}`,
        [
          "先 analyze_mod_jar 看该 jar 究竟有没有 modId（mods.toml / fabric.mod.json / quilt.mod.json）",
          ...(embeddedId && !embeddedId.ok && embeddedId.candidates.length > 1
            ? ["外壳含多个平级子模组 ⇒ 由调用方用 externalModId 指定其中之一（批处理器按 manifest 的 modId 传），工具不替你猜"]
            : []),
          "纯库 jar / 资源包本就没有 modId：直接解压读源码，不要指望反编译缓存目录",
          "若怀疑工具漏解析，把上面的 sha512 片段与该 jar 一并反馈开发者",
        ],
      ),
    );
  }
  const modId = embeddedOk
    ? embeddedOk.modId
    : externalId
      ? externalId.modId
      : identity.ok
        ? identity.modId
        : "";
  const modIdEvidence: ModDecompileResult["modIdEvidence"] = embeddedOk
    ? embeddedOk.evidence
    : externalId
      ? "external"
      : "jar";
  // Forge 的 mods.toml 版本可用 ${file.jarVersion} 占位符（加载时按 jar 文件名解析）。
  // 此处按 FML 语义回退：去 .jar 后缀、取最后一个 '-' 之后的片段。避免把占位符
  // 原样用作输出目录名（含 ".jar" 子串会让 VineFlower 走单文件保存路径而失败）。
  let rawModVersion = embeddedOk?.modVersion ?? meta.modVersion ?? "unknown";
  if (rawModVersion.includes("${file.jarVersion}")) {
    const stem = basename(args.jarPath).replace(/\.jar$/i, "");
    const dash = stem.lastIndexOf("-");
    rawModVersion = dash >= 0 ? stem.slice(dash + 1) : stem;
  }
  const modVersion = sanitizeCacheSegment(rawModVersion);
  if (!modVersion) {
    return withAction(
      { found: false, error: "INVALID_INPUT", jarPath: args.jarPath },
      actionable("INVALID_INPUT", `modVersion 非法（含路径穿越或空段）：${rawModVersion}`, [
        "version 只允许 [a-z0-9._-]，且不得为 `.` / `..` 或包含 `..`",
      ]),
    );
  }
  const cache = ensureCachePaths();
  const outDir = join(cache.decompiledMods, modId, `${modVersion}-${jarIdentity}`);
  if (!isPathInside(cache.decompiledMods, outDir)) {
    return withAction(
      { found: false, error: "INVALID_INPUT", jarPath: args.jarPath },
      actionable("INVALID_INPUT", "反编译输出目录逃出 decompiled-mods", [
        "modId/modVersion 不得把产物写到 $MC_SKILL_CACHE/decompiled-mods 之外",
      ]),
    );
  }

  // 并发防护：同一 jar 的反编译/重映射只允许一个任务持有缓存锁（B13）
  let release: (() => void) | undefined;
  try {
    release = await acquireCacheLock(
      cache.root,
      `mod-decompile:${normalizeArtifactPath(outDir)}`,
      10 * 60_000,
    );
  } catch (err) {
    if (err instanceof CacheLockBusyError) {
      return withAction(
        { found: false, error: "LOCK_BUSY", jarPath: args.jarPath },
        actionable("LOCK_BUSY", "另一并发反编译任务持有该模组的缓存锁。", ["稍后重试（或确认无并发后清除过期锁）"]),
      );
    }
    throw err;
  }
  try {
  // S8：本次请求的 remap 判据。命中判定、remap 步骤、meta 落盘共用这一份真值。
  const requestedKey = requestedRemapKey(args.version, args.mapping);

  if (!args.force && existsSync(outDir) && readdirSync(outDir).length > 0) {
    const metaHit = readDecompiledMeta(outDir);
    const verdict = metaHit.found ? judgeDecompiledCacheHit(metaHit, args.jarPath, requestedKey) : null;
    // S35：胖壳（JiJ / jarjar）自身 0 个 .class，旧缓存会命中「只有 META-INF 的空树」并永久返回
    // javaFileCount:0。身份来自内层件时，空树不算可用命中，落到下面改解真身内层 jar。
    if (verdict?.usable && !(embeddedOk && !containsJava(outDir))) {
      const storedRemapped = metaHit.remapped === true;
      const storedRemapError = metaHit.remapError ?? null;
      const degradation = decompileDegradation(storedRemapped, storedRemapError);
      const diskDesc = `version=${metaHit.version === undefined ? "未记录" : (metaHit.version ?? "未 remap")} / mapping=${metaHit.mapping === undefined ? "未记录" : (metaHit.mapping ?? "未 remap")}`;
      const reqDesc = `version=${requestedKey.version ?? "未 remap"} / mapping=${requestedKey.mapping ?? "未 remap"}`;
      return {
        found: true,
        modId,
        modIdEvidence,
        modIdSource: embeddedOk?.from,
        bundledJars,
        modVersion,
        loaders: meta.loaders,
        // 回填盘上真实判据；老缓存未记录时保持 undefined（字段缺席），不冒领。
        version: metaHit.version ?? undefined,
        mapping: metaHit.mapping,
        requestedVersion: args.version,
        outputDir: outDir,
        ...summarizeTree(outDir),
        ...degradation,
        remapped: storedRemapped,
        cacheStale: verdict.cacheStale,
        warnings: verdict.cacheStale
          ? [
              ...degradation.warnings,
              `缓存判据与本次请求不一致（cacheStale）：盘上 ${diskDesc}，本次 ${reqDesc}。源码中的名称可能属于旧版本 / 旧映射层；要按本次请求重建请加 force: true。`,
            ]
          : degradation.warnings,
        note: verdict.cacheStale
          ? `缓存命中（decompiled-mods），但生成判据与本次请求不一致：上面回填的是盘上真实状态（${diskDesc}），本次请求为 ${reqDesc}。按本次请求重建请加 force: true。可用 search_mod_code 检索。`
          : `缓存命中（decompiled-mods），判据与本次请求一致（${diskDesc}，remapped=${storedRemapped}）。可用 search_mod_code 检索。`,
      };
    }
  }

  // 4. 可选 remap（仅 1.14–1.21.11 + yarn/mojmap 有意义；26.1+ 免 remap）
  // S35：`modIdSource` 必须被消费——胖壳自身 0 个 .class，只解外壳会得到 0 .java 的 META-INF 空树。
  // 身份来自内层件时，解出的内层 jar 才是字节码输入（输出目录仍按外壳内容寻址，不改缓存键）。
  // 决策本体在 `pickDecompileInput`（S5c 抽成纯函数，可离线对拍）；这里只注入两个副作用。
  const pickedInput = pickDecompileInput({
    jarPath: args.jarPath,
    evidence: modIdEvidence,
    modIdSource: embeddedOk?.from,
    jarIdentity,
    extractDir: cache.remapped,
    readEntry: (name) => readZip(readFileSync(args.jarPath)).get(name),
    extract: (dest, data) => {
      mkdirSync(cache.remapped, { recursive: true });
      if (!existsSync(dest)) writeFileSync(dest, data);
    },
  });
  const bytecodeJar = pickedInput.inputJar;
  let inputJar = bytecodeJar;
  let remapped = false;
  let remapError: string | null = null;
  const remapVersion = requestedKey.version;
  const remapMapping = requestedKey.mapping;
  if (remapVersion !== null && remapMapping !== null) {
      const version = remapVersion;
      const mapping: MappingChoice = remapMapping;
      try {
        const tinyJars = await ensureTinyRemapperJars({ cacheRoot: cache.root });
        // 缓存键：yarn 用 yarn-named（两步最终产物），避免命中旧单步 official→intermediary 的
        // `mod-*-yarn.jar`（仅 intermediary 名）。中间步独立键 yarn-intermediary。
        const remapStem =
          mapping === "yarn"
            ? sanitizeCacheSegment(`mod-${modId}-${modVersion}-yarn-named`)
            : sanitizeCacheSegment(`mod-${modId}-${modVersion}-mojmap`);
        if (!remapStem) {
          throw new Error("remap 输出文件名非法（含路径穿越）");
        }
        const remappedJar = join(cache.remapped, `${remapStem}.jar`);
        if (!isPathInside(cache.remapped, remappedJar)) {
          throw new Error("remap 输出路径逃出 remapped 缓存目录");
        }
        if (!existsSync(remappedJar) || args.force) {
          let mappings: string;
          if (mapping === "yarn") {
            const info = await resolveYarnMappings(version);
            const yarnPath = join(cache.mappings, `yarn-${version}-mergedv2.jar`);
            if (!mappingCacheViable(cache.root, yarnPath, `mc-mappings:${version}:yarn`)) {
              const dl = await downloadFile(info.jarUrl, yarnPath, {
                label: `yarn mappings ${info.build}`,
                expectedSha256: info.sha256 ?? null,
                expectedSha1: info.sha1 ?? null,
              });
              const db = openCacheDb(cache.root);
              try {
                setArtifact(db, `mc-mappings:${version}:yarn`, "mappings", yarnPath, {
                  version: info.build,
                  sha256: dl.sha256,
                });
              } finally {
                db.close();
              }
            }
            mappings = ensureYarnTiny(yarnPath);
          } else {
            const entry = await resolveMojangVersion(version);
            if (!entry.clientMappingsUrl) {
              throw new DownloadError("MAPPINGS_NOT_FOUND", `版本 ${version} 无 client_mappings`);
            }
            const mojmapPath = join(cache.mappings, `mojmap-${version}.txt`);
            if (!mappingCacheViable(cache.root, mojmapPath, `mc-mappings:${version}:mojmap`)) {
              const dl = await downloadFile(entry.clientMappingsUrl, mojmapPath, {
                label: `mojmap ${version}`,
                expectedSha1: entry.clientMappingsSha1 ?? null,
              });
              const db = openCacheDb(cache.root);
              try {
                setArtifact(db, `mc-mappings:${version}:mojmap`, "mappings", mojmapPath, {
                  version,
                  sha256: dl.sha256,
                });
              } finally {
                db.close();
              }
            }
            mappings = mojmapPath;
          }
          if (mapping === "yarn") {
            const step1Stem = sanitizeCacheSegment(`mod-${modId}-${modVersion}-yarn-intermediary`);
            if (!step1Stem) {
              throw new Error("remap 中间文件名非法（含路径穿越）");
            }
            const step1 = join(cache.remapped, `${step1Stem}.jar`);
            if (!isPathInside(cache.remapped, step1)) {
              throw new Error("remap 中间路径逃出 remapped 缓存目录");
            }
            const r1 = await runJava(
              remapperCli(tinyJars, bytecodeJar, step1, mappings, "official", "intermediary"),
              { cwd: cache.root },
            );
            if (r1.code !== 0) {
              throw new Error(`模组 remap 失败 step1 official→intermediary(code=${r1.code}): ${tail(r1.stderr)}`);
            }
            const r2 = await runJava(
              remapperCli(tinyJars, step1, remappedJar, mappings, "intermediary", "named"),
              { cwd: cache.root },
            );
            if (r2.code !== 0) {
              throw new Error(`模组 remap 失败 step2 intermediary→named(code=${r2.code}): ${tail(r2.stderr)}`);
            }
          } else {
            const tinyMappings = await ensureMojmapTiny(mappings);
            const r = await runJava(
              remapperCli(tinyJars, bytecodeJar, remappedJar, tinyMappings, "official", "named"),
              { cwd: cache.root },
            );
            if (r.code !== 0) {
              throw new Error(`模组 remap 失败(code=${r.code}): ${tail(r.stderr)}`);
            }
          }
        }
        inputJar = remappedJar;
        remapped = true;
      } catch (err) {
        // remap 失败 → 诚实降级：保留错误信息到 note，用原始 jar 反编译
        remapped = false;
        remapError = (err as Error).message;
        inputJar = bytecodeJar;
      }
  }

  // 5. VineFlower 反编译
  try {
    const vineflower = await ensureResourceJar(VINEFLOWER_DEF, { cacheRoot: cache.root });
    // F92：先清空目标子树再写。VineFlower 只覆盖同名文件，旧树残留会让本次
    // javaFileCount / 包名归属把别人的源码算进来；清空不生效时宁可判失败。
    const cleared = clearDecompileTarget(cache.decompiledMods, outDir);
    if (cleared.error !== null) {
      return withAction(
        {
          found: false,
          error: "CACHE_CLEAN_FAILED",
          modId,
          modVersion,
          jarPath: args.jarPath,
          jarIdentity,
          outputDir: outDir,
        },
        actionable("CACHE_CLEAN_FAILED", `写前清空反编译目标目录失败：${cleared.error}`, [
          "排查占用：关闭 IDE / 杀毒对该目录的句柄后重试 decompile_mod_jar { jarPath, force: true }",
          "仍失败则手动删除 decompiled-mods 下的这一个目录；不要复用可能混了树的旧产物",
        ]),
      );
    }
    mkdirSync(outDir, { recursive: true });
    assertVineflowerDiskSpace(outDir, inputJar);
    const r = await runJava(vineflowerCli(vineflower, inputJar, outDir), { cwd: cache.root });
    if (r.code !== 0) {
      return withAction(
        { found: false, error: "DECOMPILE_FAILED", modId, outputDir: outDir },
        actionable("DECOMPILE_FAILED", `VineFlower 失败(code=${r.code}): ${tail(r.stderr)}`, [
          "请将完整 stderr 贴给开发者",
          "可重试：decompile_mod_jar { jarPath, force: true }",
        ]),
      );
    }
  } catch (err) {
    if (err instanceof DownloadDisabledError) {
      return withAction(
        { found: false, error: "DOWNLOAD_DISABLED", modId },
        downloadDisabledActionable(err.message),
      );
    }
    if (err instanceof DownloadError) {
      return withAction(
        { found: false, error: err.code, modId },
        actionable(err.code, err.message, ["检查网络后重试", "或手动预置 jar 到 $MC_SKILL_CACHE/resources/"]),
      );
    }
    if ((err as { code?: string }).code === "DISK_INSUFFICIENT") {
      return withAction(
        { found: false, error: "DISK_INSUFFICIENT", modId },
        actionable("DISK_INSUFFICIENT", (err as Error).message, ["清理磁盘后重试"]),
      );
    }
    return withAction(
      { found: false, error: "DECOMPILE_FAILED", modId },
      actionable("DECOMPILE_FAILED", (err as Error).message, ["重试或反馈开发者"]),
    );
  }

  recordDecompiledDir(args.jarPath, outDir, modId, cache.root);
  // D-19：标记写失败**不再是本次调用的失败**。源码树已经真实产出并已记进 cache 索引，
  // 丢的只是后续命中判据；这里降级成 partial success + warnings，绝不把异常抛穿
  // `wave/register.ts` 的 handler（旧行为：前五步全白做且返回非 actionable）。
  const metaWriteError = writeDecompiledMeta(outDir, args.jarPath, {
    version: requestedKey.version,
    mapping: requestedKey.mapping,
    remapped,
    remapError,
  });
  const degradation = decompileDegradation(remapped, remapError);
  if (metaWriteError !== null) {
    degradation.warnings.push(
      `反编译产物已生成（partial success），但完成标记写入失败：${metaWriteError}。` +
        `本次源码树可直接使用；search_mod_code 对该目录的缓存命中判据（version/mapping）会缺失，` +
        `可重试 decompile_mod_jar { jarPath, force: true } 或在可写盘上重建缓存。`,
    );
  }
  if (bytecodeJar !== args.jarPath) {
    degradation.warnings.push(
      `外壳自身不含 .class（JiJ / jarjar 胖壳）：本次实际反编译的是内层件 ${embeddedOk?.from ?? "?"}；` +
        "同壳其余内层件（纯库，如 kotlin / kfflib 之类）没有 modId，不进本目录，需解压另行阅读。",
    );
  }
  // remap 失败降级后输出的是混淆/中间名，必须在**结构字段**上诚实暴露，
  // 不能只写进 note——调用方无法从字符串里可靠判定结果是否可用。
  return {
    found: true,
    modId,
    modIdEvidence,
    modIdSource: embeddedOk?.from,
    bundledJars,
    modVersion,
    loaders: meta.loaders,
    version: requestedKey.version ?? undefined,
    mapping: requestedKey.mapping,
    requestedVersion: args.version,
    outputDir: outDir,
    ...summarizeTree(outDir),
    ...degradation,
    ...(metaWriteError !== null ? { partial: true } : {}),
    remapped,
    cacheStale: false,
    note: remapped
      ? `已按 ${requestedKey.version}（${requestedKey.mapping}）重映射后反编译（yarn 两步 / mojmap 单步）。`
      : remapError
        ? `重映射失败已跳过（${remapError}），按原始字节码反编译（名称可能为混淆/中间名）。可用 search_mod_code 检索。`
        : "未重映射（26.1+ 免 remap，或未提供匹配版本）。可用 search_mod_code 检索。",
  };
  } finally {
    release?.();
  }
}

/** 反编译产物随附的判据（缓存命中与如实回显都依赖它） */
export interface DecompiledMeta {
  found: boolean;
  jarPath?: string;
  /** 生成时请求的 MC 版本。null = 未经 remap；undefined = 老缓存未记录（判据未知，不得冒领一致） */
  version?: string | null;
  /** 生成时的 remap 映射层。null = 未经 remap；undefined = 老缓存未记录 */
  mapping?: string | null;
  /** 盘上这棵树到底有没有被 remap 过 */
  remapped?: boolean;
  /** 生成时 remap 失败的原始原因（命中时据此重现 degraded 标记） */
  remapError?: string | null;
  note?: string;
}

/**
 * 记录本次反编译完成标记（search_mod_code / 缓存命中判据以此为完成判据）。
 * `cache` 必填：判据字段缺失会让后续命中把「未知」当成「一致」而冒领产物。
 *
 * D-19：**不再抛出**。产物已经真实存在于 `dir`，标记写失败（只读缓存盘 / 磁盘满 /
 * 并发清理）只是丢了后续命中判据，不是本次调用失败。返回 `null` = 已写入，
 * 返回字符串 = 失败原因，由调用方降级成 partial success + `warnings`。
 * 旧实现在 try 之外裸抛，会一路穿出 `wave/register.ts` 的 handler，前五步全部白做。
 */
export function writeDecompiledMeta(
  dir: string,
  jarPath: string,
  cache: { version: string | null; mapping: string | null; remapped: boolean; remapError: string | null },
): string | null {
  const metaFile = join(dir, ".mc-skill-decompiled.json");
  try {
    writeFileSync(
      metaFile,
      JSON.stringify({ jarPath, ...cache, completedAt: new Date().toISOString() }, null, 2) + "\n",
      "utf8",
    );
    return null;
  } catch (err) {
    return `${(err as Error).message}（${metaFile}）`;
  }
}

/** 读取反编译目录信息（search_mod_code / 缓存命中判据） */
export function readDecompiledMeta(dir: string): DecompiledMeta {
  const metaFile = join(dir, ".mc-skill-decompiled.json");
  if (!existsSync(metaFile)) return { found: false };
  try {
    const json = JSON.parse(readFileSync(metaFile, "utf8")) as {
      jarPath?: string;
      version?: string | null;
      mapping?: string | null;
      remapped?: boolean;
      remapError?: string | null;
    };
    return {
      found: true,
      jarPath: json.jarPath,
      // 原样透传：undefined = 老缓存未记录（判据未知）；null = 新缓存记录了「未经 remap」。
      // 这里不能 `?? null` 归一，否则免 remap 的正常产物会被永久判成 cacheStale。
      version: json.version,
      mapping: json.mapping,
      remapped: json.remapped === true,
      remapError: json.remapError ?? null,
    };
  } catch {
    return { found: false };
  }
}

/**
 * 请求侧的 remap 判据（纯函数）。
 *
 * 只有真正会触发 remap 的「版本 + 映射层」组合才非空：无效 / 不支持 / 已去混淆
 * （26.1+ 免 remap）都归一为「不 remap」。否则 `version=26.1` 与不传 version 两次
 * 调用会产出一模一样的树，却被判成判据不一致。
 */
export function requestedRemapKey(
  version: string | undefined,
  mapping: MappingChoice | undefined,
): { version: string | null; mapping: MappingChoice | null } {
  if (!version) return { version: null, mapping: null };
  const vi = parseMinecraftVersion(version);
  if (!vi.valid || !vi.supported || vi.unobfuscated) return { version: null, mapping: null };
  return { version: vi.version, mapping: mapping === "mojmap" ? "mojmap" : "yarn" };
}

/**
 * 缓存命中判定（纯函数，CI 无需 Java / 网络）。
 *
 * S8：旧实现只比 `jarPath`，命中后**硬编码** `remapped: false` 并回显本次 `args.version`。
 * 于是「1.20.1 + yarn 生成的树」会被「1.21.1 + mojmap 请求」当新鲜结果复用，
 * 既谎称未 remap，又把本次请求的版本当成产物所用版本。现在分三态：
 * - `usable: false` —— 树属于别的 jar，不可复用
 * - `usable: true, cacheStale: true` —— 可复用，但生成判据与本次请求不一致（含老缓存未知）
 * - `usable: true, cacheStale: false` —— 判据一致，盘上树就是本次要的东西
 */
export function judgeDecompiledCacheHit(
  meta: DecompiledMeta,
  jarPath: string,
  requested: { version: string | null; mapping: string | null },
): { usable: boolean; cacheStale: boolean } {
  if (meta.jarPath && normalizeArtifactPath(meta.jarPath) !== normalizeArtifactPath(jarPath)) {
    return { usable: false, cacheStale: false };
  }
  // 老缓存（本改动之前写的 meta）未记录 version：无从证明一致 → 保守标 stale。
  if (meta.version === undefined) return { usable: true, cacheStale: true };
  return {
    usable: true,
    cacheStale: meta.version !== requested.version || (meta.mapping ?? null) !== requested.mapping,
  };
}
