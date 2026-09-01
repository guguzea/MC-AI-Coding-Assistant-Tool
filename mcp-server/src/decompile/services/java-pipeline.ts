/**
 * MC 源码反编译的 Java 子进程管线（下载输入 → tiny-remapper 重映射 → VineFlower 反编译）。
 *
 * 纯 Node 侧驱动：下载 client jar / 映射 / 工具 jar（SHA 校验），然后
 * 用 Java 17+ 子进程执行重映射与反编译。调用方（decompile-service）负责
 * Java 探测、skip-download 门控、锁与缓存命中。
 */

import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync, openSync, readSync, closeSync, renameSync } from "fs";
import { join, dirname, delimiter } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createHash } from "crypto";
import {
  ensureCachePaths,
  openCacheDb,
  setArtifact,
  getArtifact,
} from "../cache.js";
import { runJava } from "../java/java-process.js";
import { resolveMojangVersion } from "../downloaders/mojang.js";
import { resolveYarnMappings, mappingCacheViable } from "../downloaders/yarn.js";
import {
  ensureResourceJar,
  ensureTinyRemapperJars,
  VINEFLOWER_DEF,
} from "../downloaders/resources.js";
import { downloadFile, DownloadError } from "../downloaders/http.js";
import { readZip } from "../zip-util.js";
import { parseMinecraftVersion, type MappingChoice } from "../version-manager.js";
import { checkDiskSpace } from "../../update/data.js";

export interface DownloadGate {
  cacheRoot: string;
  clientJar: string;
  /** Tiny v2 文本文件（yarn 从 -mergedv2.jar 里解出 / mojmap 由 ProGuard 转换）；26.1+ 免 remap = null */
  mappings: string | null;
  remapNeeded: boolean;
  yarn: boolean;
  unobfuscated: boolean;
  vineflower: string;
  /** tiny-remapper 主 jar（thin）；26.1+ 免 remap = null */
  tinyRemapper: string | null;
  /** `java -cp` 用的完整 jar 列表（主 jar 在前 + 依赖），26.1+ 免 remap = [] */
  tinyJars: string[];
}

export function tail(s: string, n = 800): string {
  const t = s.trim();
  return t.length > n ? "…" + t.slice(-n) : t;
}

/** 读取文件开头若干字节（循环读满，短读不算 EOF） */
function readHead(path: string, maxBytes: number): string {
  const buf = Buffer.alloc(maxBytes);
  const fd = openSync(path, "r");
  try {
    let got = 0;
    while (got < maxBytes) {
      const n = readSync(fd, buf, got, maxBytes - got, got);
      if (n <= 0) break;
      got += n;
    }
    return buf.subarray(0, got).toString("utf8");
  } finally {
    closeSync(fd);
  }
}

/**
 * 磁盘上的 Tiny 是否真的映射了东西。首行是 header，第一个类行紧跟其后，
 * 所以只看开头即可判定；header-only（例如上次解析失败留下的残缺文件）视为不可用。
 */
function tinyFileUsable(tinyPath: string): boolean {
  try {
    if (statSync(tinyPath).size === 0) return false;
    return /^c\t/m.test(readHead(tinyPath, 8192));
  } catch {
    return false;
  }
}

/** ProGuard client.txt → Tiny v2（official/named），tiny-remapper 0.14 只读 Tiny v2。 */
export async function ensureMojmapTiny(proguardPath: string): Promise<string> {
  const refuse = (detail: string): never => {
    const err = new Error(`MAPPINGS_EMPTY: ${detail}`) as Error & { code: string };
    err.code = "MAPPINGS_EMPTY";
    throw err;
  };

  if (proguardPath.endsWith(".tiny")) {
    if (!tinyFileUsable(proguardPath)) refuse(`${proguardPath} 不含任何 c\\t 类映射行`);
    return proguardPath;
  }
  const tinyPath = proguardPath.replace(/\.txt$/i, ".tiny");
  if (existsSync(tinyPath) && existsSync(proguardPath)) {
    try {
      if (statSync(tinyPath).mtimeMs >= statSync(proguardPath).mtimeMs && tinyFileUsable(tinyPath)) {
        return tinyPath;
      }
    } catch {
      /* rewrite */
    }
  }
  const parserUrl = pathToFileURL(
    join(dirname(fileURLToPath(import.meta.url)), "../../../scripts/_lib/parse-mojang-proguard.mjs"),
  ).href;
  const { parseMojangProguardFile, emitTinyV2, tinyV2HasClasses } = await import(parserUrl) as {
    parseMojangProguardFile: (p: string) => Promise<{ obfToNamed: Map<string, string> }>;
    emitTinyV2: (maps: unknown) => string;
    tinyV2HasClasses: (text: string) => boolean;
  };
  const maps = await parseMojangProguardFile(proguardPath);
  if (!(maps?.obfToNamed instanceof Map) || maps.obfToNamed.size === 0) {
    refuse(`${proguardPath} 未解析出任何类映射（ProGuard 映射为空、被截断或格式不符）`);
  }
  const tiny = emitTinyV2(maps);
  if (!tinyV2HasClasses(tiny)) refuse(`${proguardPath} 生成的 Tiny 不含类映射`);
  // 原子写：半截文件若被下次调用当成命中，remap 会「成功」地产出混淆 jar
  const tmp = `${tinyPath}.${process.pid}.tmp`;
  try {
    writeFileSync(tmp, tiny, "utf8");
    renameSync(tmp, tinyPath);
  } catch (err) {
    try {
      if (existsSync(tmp)) renameSync(tmp, `${tinyPath}.rejected`);
    } catch {
      /* best effort */
    }
    throw err;
  }
  return tinyPath;
}

/**
 * yarn `-mergedv2.jar` 只是容器：tiny-remapper 的 `<mappings>` 参数要的是 Tiny v2 **文本文件**，
 * 直接把 jar 路径喂进去会被 mapping-io 判成 "invalid/unsupported mapping format"。
 * 这里把 `mappings/mappings.tiny` 落成可复用的 `.tiny`，新鲜度与原子写口径同 ensureMojmapTiny。
 */
export function ensureYarnTiny(yarnJarPath: string): string {
  const refuse = (detail: string): never => {
    const err = new Error(`MAPPINGS_EMPTY: ${detail}`) as Error & { code: string };
    err.code = "MAPPINGS_EMPTY";
    throw err;
  };
  const tinyPath = yarnJarPath.replace(/\.jar$/i, ".tiny");
  if (existsSync(tinyPath) && existsSync(yarnJarPath)) {
    try {
      if (statSync(tinyPath).mtimeMs >= statSync(yarnJarPath).mtimeMs && tinyFileUsable(tinyPath)) {
        return tinyPath;
      }
    } catch {
      /* rewrite */
    }
  }
  let entries: Map<string, Buffer>;
  try {
    entries = readZip(readFileSync(yarnJarPath));
  } catch (err) {
    return refuse(`${yarnJarPath} 读不出 zip 条目：${(err as Error).message}`);
  }
  const tinyNames = [...entries.keys()].filter((n) => /^mappings\/[^/]+\.tiny$/i.test(n));
  const data = entries.get("mappings/mappings.tiny") ?? (tinyNames.length === 1 ? entries.get(tinyNames[0]) : undefined);
  if (!data) {
    return refuse(`${yarnJarPath} 内没有唯一 mappings/*.tiny（候选：${tinyNames.join(", ") || "无"}）`);
  }
  const text = data.toString("utf8");
  const header = text.split(/\r?\n/, 1)[0] ?? "";
  if (!/^tiny\t2\t/.test(header)) refuse(`${yarnJarPath}:mappings.tiny 不是 Tiny v2（首行 ${JSON.stringify(header)}）`);
  // 两步 remap 需要 official→intermediary 与 intermediary→named，三列缺一不可
  // （-v2.jar 只有 intermediary/named，喂进来会在第一条腿炸）。
  const nsMissing = ["official", "intermediary", "named"].filter((ns) => !header.split("\t").includes(ns));
  if (nsMissing.length) {
    refuse(`${yarnJarPath}:mappings.tiny 缺命名空间 ${nsMissing.join("/")}（首行 ${JSON.stringify(header)}）`);
  }
  if (!/^c\t/m.test(text)) refuse(`${yarnJarPath}:mappings.tiny 不含任何 c\\t 类映射行`);
  const tmp = `${tinyPath}.${process.pid}.tmp`;
  try {
    writeFileSync(tmp, text, "utf8");
    renameSync(tmp, tinyPath);
  } catch (err) {
    try {
      if (existsSync(tmp)) renameSync(tmp, `${tinyPath}.rejected`);
    } catch {
      /* best effort */
    }
    throw err;
  }
  return tinyPath;
}

export const TINY_REMAPPER_MAIN = "net.fabricmc.tinyremapper.Main";

/** `java -cp` 的 classpath 值（分隔符必须按平台取，写死 `:` 在 Windows 上直接失效） */
export function classpathOf(jars: readonly string[]): string {
  return jars.join(delimiter);
}

/**
 * tiny-remapper 命令行。主 jar 是 thin jar，**不能** `java -jar`；
 * 参数顺序按工具自己的 usage 行：`<input> <output> <mappings> <from> <to> [cp...] [flags]`。
 */
export function remapperCli(
  jars: readonly string[],
  inputJar: string,
  outputJar: string,
  mappings: string,
  fromNs: string,
  toNs: string,
): string[] {
  if (jars.length === 0) {
    throw new Error("remapperCli 需要 tiny-remapper 主 jar 及其依赖 jar（thin jar 单独无法运行）");
  }
  // 只接受 Tiny 文本：把 yarn jar / mojmap ProGuard .txt 直接喂进去，mapping-io 只会回一句
  // "invalid/unsupported mapping format"（而 mod remap 失败还会静默降级成反编译混淆 jar）。
  if (!mappings.endsWith(".tiny")) {
    throw new Error(`remapperCli 的 <mappings> 必须是 .tiny 文本（收到 ${mappings}）`);
  }
  return [
    "-cp",
    classpathOf(jars),
    TINY_REMAPPER_MAIN,
    inputJar,
    outputJar,
    mappings,
    fromNs,
    toNs,
    "--ignoreConflicts",
  ];
}

/** VineFlower 1.10.1 命令行：选项必须在 source/destination **之前**（实测放后面 → 零输出）。 */
export function vineflowerCli(
  vineflowerJar: string,
  jar: string,
  outDir: string,
  onlyClass?: string,
): string[] {
  const args = ["-jar", vineflowerJar, "-dgs=1", "-asc=1"];
  if (onlyClass) args.push(`--only=${onlyClass}`);
  args.push(jar, outDir);
  return args;
}

/** 下载输入产物（client jar + 映射 + 工具 jar），全部带哈希校验 */
export async function prepareInputs(
  version: string,
  mapping: MappingChoice,
  cacheRoot: string,
  opts?: { force?: boolean },
): Promise<DownloadGate> {
  const cache = ensureCachePaths(cacheRoot);
  const db = openCacheDb(cache.root);
  const vi = parseMinecraftVersion(version);
  const unobfuscated = vi.unobfuscated;
  const yarn = mapping === "yarn";
  const remapNeeded = !unobfuscated;
  const forceManifest = opts?.force === true;

  try {
    // 1. client jar（Mojang manifest，SHA1 校验）
    const clientJar = join(cache.jars, `minecraft-${version}-client.jar`);
    const entry = await resolveMojangVersion(version, forceManifest);
    const sha1Ok = () => {
      try {
        const got = createHash("sha1").update(readFileSync(clientJar)).digest("hex");
        return got.toLowerCase() === String(entry.clientJarSha1).toLowerCase();
      } catch {
        return false;
      }
    };
    if (!existsSync(clientJar) || !sha1Ok()) {
      const disk = checkDiskSpace(cache.jars, entry.clientJarSize || 25 * 1024 * 1024);
      if (!disk.ok) {
        const err = new Error(
          `DISK_INSUFFICIENT: 下载 client.jar 前空间不足（需要约 ${disk.neededBytes} 字节）`,
        ) as Error & { code: string };
        err.code = "DISK_INSUFFICIENT";
        throw err;
      }
      const result = await downloadFile(entry.clientJarUrl, clientJar, {
        expectedSha1: entry.clientJarSha1,
        label: `client jar ${version}`,
      });
      setArtifact(db, `mc-client:${version}`, "client-jar", clientJar, {
        version,
        sha256: result.sha256,
      });
    } else {
      const prev = getArtifact(db, `mc-client:${version}`);
      setArtifact(db, `mc-client:${version}`, "client-jar", clientJar, {
        version,
        sha256: prev?.sha256 ?? null,
      });
    }

    // 2. 工具 jar + 映射（VineFlower 全场景需要；tiny-remapper/映射仅 remap 场景）
    const vineflower = await ensureResourceJar(VINEFLOWER_DEF, { cacheRoot: cache.root });
    let tinyRemapper: string | null = null;
    let tinyJars: string[] = [];
    let mappings: string | null = null;

    if (remapNeeded) {
      tinyJars = await ensureTinyRemapperJars({ cacheRoot: cache.root });
      tinyRemapper = tinyJars[0] ?? null;
      if (yarn) {
        const yarnJarPath = join(cache.mappings, `yarn-${version}-mergedv2.jar`);
        if (!mappingCacheViable(cache.root, yarnJarPath, `mc-mappings:${version}:yarn`)) {
          const info = await resolveYarnMappings(version);
          const result = await downloadFile(info.jarUrl, yarnJarPath, {
            label: `yarn mappings ${info.build}`,
            expectedSha256: info.sha256 ?? null,
            expectedSha1: info.sha1 ?? null,
          });
          setArtifact(db, `mc-mappings:${version}:yarn`, "mappings", yarnJarPath, {
            version: info.build,
            sha256: result.sha256,
          });
        }
        mappings = ensureYarnTiny(yarnJarPath);
      } else {
        const mojmapPath = join(cache.mappings, `mojmap-${version}.txt`);
        if (!mappingCacheViable(cache.root, mojmapPath, `mc-mappings:${version}:mojmap`)) {
          const entry = await resolveMojangVersion(version, forceManifest);
          if (!entry.clientMappingsUrl) {
            throw new DownloadError("MAPPINGS_NOT_FOUND", `版本 ${version} 的 manifest 无 client_mappings 下载项`);
          }
          const result = await downloadFile(entry.clientMappingsUrl, mojmapPath, {
            label: `mojmap mappings ${version}`,
            expectedSha1: entry.clientMappingsSha1 ?? null,
          });
          setArtifact(db, `mc-mappings:${version}:mojmap`, "mappings", mojmapPath, {
            version,
            sha256: result.sha256,
          });
        }
        mappings = mojmapPath;
      }
    }

    return {
      cacheRoot: cache.root,
      clientJar,
      mappings,
      remapNeeded,
      yarn,
      unobfuscated,
      vineflower,
      tinyRemapper,
      tinyJars,
    };
  } finally {
    db.close();
  }
}

export interface RemapOutcome {
  jar: string;
  how: "two-step-yarn" | "single-step-mojmap" | "none";
}

/**
 * tiny-remapper 重映射：
 * - yarn：两步 official→intermediary→named（与 README 支持矩阵一致）
 * - mojmap（1.14–1.21.11）：client_mappings.txt → Tiny v2 后单步 official→named
 * - 26.1+：免 remap，直接用 client jar
 */
export async function remapClientJar(
  gate: DownloadGate,
  version: string,
  mapping: MappingChoice,
): Promise<RemapOutcome> {
  if (!gate.remapNeeded) {
    return { jar: gate.clientJar, how: "none" };
  }
  if (!gate.tinyJars.length || !gate.mappings) {
    throw new Error("remap 前置条件缺失（tiny-remapper classpath 或 mappings 未就绪）");
  }
  const cache = ensureCachePaths(gate.cacheRoot);
  const outJar = join(cache.remapped, `minecraft-${version}-${mapping}.jar`);

  if (gate.yarn) {
    const step1 = join(cache.remapped, `minecraft-${version}-yarn-step1.jar`);
    const r1 = await runJava(
      remapperCli(gate.tinyJars, gate.clientJar, step1, gate.mappings, "official", "intermediary"),
      { cwd: cache.root },
    );
    if (r1.code !== 0) {
      throw new Error(`tiny-remapper official→intermediary 失败(code=${r1.code}): ${tail(r1.stderr)}`);
    }
    const r2 = await runJava(
      remapperCli(gate.tinyJars, step1, outJar, gate.mappings, "intermediary", "named"),
      { cwd: cache.root },
    );
    if (r2.code !== 0) {
      throw new Error(`tiny-remapper intermediary→named 失败(code=${r2.code}): ${tail(r2.stderr)}`);
    }
    return { jar: outJar, how: "two-step-yarn" };
  }

  const tinyMappings = await ensureMojmapTiny(gate.mappings);
  const r = await runJava(
    remapperCli(gate.tinyJars, gate.clientJar, outJar, tinyMappings, "official", "named"),
    { cwd: cache.root },
  );
  if (r.code !== 0) {
    throw new Error(`tiny-remapper official→named 失败(code=${r.code}): ${tail(r.stderr)}`);
  }
  return { jar: outJar, how: "single-step-mojmap" };
}

export interface DecompileOutcome {
  outDir: string;
  file: string;
}

export function assertVineflowerDiskSpace(outDir: string, jarPath: string): void {
  const jarSize = existsSync(jarPath) ? statSync(jarPath).size : 0;
  const disk = checkDiskSpace(outDir, jarSize);
  if (!disk.ok) {
    const err = new Error(
      `DISK_INSUFFICIENT: 需要约 ${disk.neededBytes} 字节（jar×2.5），${disk.insufficientVolume ?? "磁盘"} 空间不足`,
    ) as Error & { code: string };
    err.code = "DISK_INSUFFICIENT";
    throw err;
  }
}

/**
 * VineFlower 反编译到 $CACHE/decompiled/<version>/<mapping>/。
 * 先 `--only=<class>` 定向反编译（选项必须在 source/destination 之前，实测放到
 * destination 之后 VineFlower 输出 0 个文件）；未命中目标文件再全量反编译兜底。
 * 子进程 cwd 固定在缓存根：工具若把参数误读成相对路径，也只会在缓存目录里建垃圾，
 * 不会落在 MCP 进程的工作目录（= 用户仓库）里。
 */
export async function decompileJar(
  gate: DownloadGate,
  jar: string,
  version: string,
  mapping: MappingChoice,
  relPath: string,
): Promise<DecompileOutcome> {
  const cache = ensureCachePaths(gate.cacheRoot);
  const outDir = join(cache.decompiled, version, mapping);
  mkdirSync(outDir, { recursive: true });
  const targetFile = join(outDir, `${relPath}.java`);

  if (existsSync(targetFile) && statSync(targetFile).size > 0) {
    return { outDir, file: targetFile };
  }

  assertVineflowerDiskSpace(outDir, jar);

  const r = await runJava(vineflowerCli(gate.vineflower, jar, outDir, relPath), { cwd: cache.root });
  if (r.code !== 0) {
    throw new Error(`VineFlower 反编译失败(code=${r.code}): ${tail(r.stderr)}`);
  }
  if (!existsSync(targetFile)) {
    const full = await runJava(vineflowerCli(gate.vineflower, jar, outDir), { cwd: cache.root });
    if (full.code !== 0) {
      throw new Error(`VineFlower 全量反编译失败(code=${full.code}): ${tail(full.stderr)}`);
    }
  }
  return { outDir, file: targetFile };
}
