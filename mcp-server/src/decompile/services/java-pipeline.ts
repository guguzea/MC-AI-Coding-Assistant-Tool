/**
 * MC 源码反编译的 Java 子进程管线（下载输入 → tiny-remapper 重映射 → VineFlower 反编译）。
 *
 * 纯 Node 侧驱动：下载 client jar / 映射 / 工具 jar（SHA 校验），然后
 * 用 Java 17+ 子进程执行重映射与反编译。调用方（decompile-service）负责
 * Java 探测、skip-download 门控、锁与缓存命中。
 */

import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
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
  VINEFLOWER_DEF,
  TINY_REMAPPER_DEF,
} from "../downloaders/resources.js";
import { downloadFile, DownloadError } from "../downloaders/http.js";
import { parseMinecraftVersion, type MappingChoice } from "../version-manager.js";
import { checkDiskSpace } from "../../update/data.js";

export interface DownloadGate {
  cacheRoot: string;
  clientJar: string;
  /** yarn v2 jar 或 mojmap client.txt；26.1+ 免 remap = null */
  mappings: string | null;
  remapNeeded: boolean;
  yarn: boolean;
  unobfuscated: boolean;
  vineflower: string;
  tinyRemapper: string | null;
}

export function tail(s: string, n = 800): string {
  const t = s.trim();
  return t.length > n ? "…" + t.slice(-n) : t;
}

/** ProGuard client.txt → Tiny v2（official/named），tiny-remapper 0.14 只读 Tiny。 */
export async function ensureMojmapTiny(proguardPath: string): Promise<string> {
  if (proguardPath.endsWith(".tiny")) return proguardPath;
  const tinyPath = proguardPath.replace(/\.txt$/i, ".tiny");
  if (existsSync(tinyPath) && existsSync(proguardPath)) {
    try {
      if (statSync(tinyPath).mtimeMs >= statSync(proguardPath).mtimeMs && statSync(tinyPath).size > 0) {
        return tinyPath;
      }
    } catch {
      /* rewrite */
    }
  }
  const parserUrl = pathToFileURL(
    join(dirname(fileURLToPath(import.meta.url)), "../../../scripts/_lib/parse-mojang-proguard.mjs"),
  ).href;
  const { parseMojangProguardFile, emitTinyV2 } = await import(parserUrl) as {
    parseMojangProguardFile: (p: string) => Promise<unknown>;
    emitTinyV2: (maps: unknown) => string;
  };
  const maps = await parseMojangProguardFile(proguardPath);
  writeFileSync(tinyPath, emitTinyV2(maps), "utf8");
  return tinyPath;
}

export function remapperCli(
  tinyJar: string,
  inputJar: string,
  outputJar: string,
  mappings: string,
  fromNs: string,
  toNs: string,
): string[] {
  return ["-jar", tinyJar, "--ignoreConflicts", inputJar, outputJar, mappings, fromNs, toNs];
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
    let mappings: string | null = null;

    if (remapNeeded) {
      tinyRemapper = await ensureResourceJar(TINY_REMAPPER_DEF, { cacheRoot: cache.root });
      if (yarn) {
        const yarnJarPath = join(cache.mappings, `yarn-${version}.jar`);
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
        mappings = yarnJarPath;
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

    return { cacheRoot: cache.root, clientJar, mappings, remapNeeded, yarn, unobfuscated, vineflower, tinyRemapper };
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
  if (!gate.tinyRemapper || !gate.mappings) {
    throw new Error("remap 前置条件缺失（tiny-remapper 或 mappings 未就绪）");
  }
  const cache = ensureCachePaths(gate.cacheRoot);
  const outJar = join(cache.remapped, `minecraft-${version}-${mapping}.jar`);

  if (gate.yarn) {
    const step1 = join(cache.remapped, `minecraft-${version}-yarn-step1.jar`);
    const r1 = await runJava(
      remapperCli(gate.tinyRemapper, gate.clientJar, step1, gate.mappings, "official", "intermediary"),
    );
    if (r1.code !== 0) {
      throw new Error(`tiny-remapper official→intermediary 失败(code=${r1.code}): ${tail(r1.stderr)}`);
    }
    const r2 = await runJava(
      remapperCli(gate.tinyRemapper, step1, outJar, gate.mappings, "intermediary", "named"),
    );
    if (r2.code !== 0) {
      throw new Error(`tiny-remapper intermediary→named 失败(code=${r2.code}): ${tail(r2.stderr)}`);
    }
    return { jar: outJar, how: "two-step-yarn" };
  }

  const tinyMappings = await ensureMojmapTiny(gate.mappings);
  const r = await runJava(
    remapperCli(gate.tinyRemapper, gate.clientJar, outJar, tinyMappings, "official", "named"),
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
 * 先 --only=前缀 定向反编译；未命中目标文件则全量反编译兜底。
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

  const r = await runJava([
    "-jar", gate.vineflower,
    "-dgs=1", "-asc=1",
    jar, outDir,
    `--only=${relPath}`,
  ]);
  if (r.code !== 0) {
    throw new Error(`VineFlower 反编译失败(code=${r.code}): ${tail(r.stderr)}`);
  }
  if (!existsSync(targetFile)) {
    const full = await runJava(["-jar", gate.vineflower, "-dgs=1", "-asc=1", jar, outDir]);
    if (full.code !== 0) {
      throw new Error(`VineFlower 全量反编译失败(code=${full.code}): ${tail(full.stderr)}`);
    }
  }
  return { outDir, file: targetFile };
}
