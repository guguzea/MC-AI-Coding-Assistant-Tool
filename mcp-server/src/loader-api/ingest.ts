import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { resolveCacheRoot } from "../decompile/cache.js";
import { listZipEntries, readZip } from "../decompile/zip-util.js";
import { actionable } from "../utils/actionable.js";
import { extractCompilationUnit } from "./extract.js";
import { candidateKeysSafe, howToIngestCli, mcpServerRoot } from "./keys.js";
import { assertCacheFresh, readSidecar, sha256File, sidecarSchemaCompatible } from "./sidecar.js";
import { overlaySummariesDir, dedupeLoaderClasses, invalidateMergedSummariesCache } from "./store.js";
import type { LoaderApiSummary, LoaderClassRecord } from "./types.js";

export type IngestLoaderApiArgs = {
  platform: string;
  minecraftVersion: string;
  jarPath: string;
  mappingsVersion: string;
  mappingsSource?: string;
  dryRun?: boolean;
  confirmed?: boolean;
  force?: boolean;
};

export function ingestLoaderApi(args: IngestLoaderApiArgs) {
  const platform = String(args.platform ?? "").trim().toLowerCase();
  const minecraftVersion = String(args.minecraftVersion ?? "").trim();
  const jarPath = String(args.jarPath ?? "").trim();
  const mappingsVersion = String(args.mappingsVersion ?? "").trim();
  const dryRun = args.dryRun !== false;
  const confirmed = args.confirmed === true;
  const force = args.force === true;

  if (!platform || !minecraftVersion) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", "platform 与 minecraftVersion 必填。", ["同时传入两者"]),
    };
  }
  if (!jarPath || !isAbsolute(jarPath)) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", "jarPath 必须是绝对路径（不要用 --file 把 jar 当文本读入）。", [
        "传入 --jarPath=<abs>",
      ]),
    };
  }
  if (!mappingsVersion) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", "mappingsVersion 必填，禁止猜 Yarn/MCP。", ["传入 mappingsVersion"]),
    };
  }
  const keys = candidateKeysSafe(platform, minecraftVersion);
  if (!keys.ok) {
    return { ok: false, code: "INVALID_INPUT" as const, action: keys.action };
  }
  if (!existsSync(jarPath)) {
    return {
      ok: false,
      action: actionable("NOT_FOUND", `jar 不存在：${jarPath}`, ["确认已合法取得的 sources/class jar 路径"]),
    };
  }

  const key = keys.keys[0];
  const overlayDir = overlaySummariesDir();
  const destJson = join(overlayDir, `${key}.json`);
  const cacheJar = join(resolveCacheRoot(), "loader-jars", `${key}.jar`);
  const officialJson = join(mcpServerRoot(), "data", "loader-api-summaries", `${key}.json`);

  let entryNames: string[] = [];
  try {
    entryNames = listZipEntries(readFileSync(jarPath));
  } catch (err) {
    return {
      ok: false,
      action: actionable("INVALID_INPUT", `无法读取 jar：${err instanceof Error ? err.message : String(err)}`, [
        "确认文件是 zip/jar",
      ]),
    };
  }

  const javaNames = entryNames.filter((n) => n.replace(/\\/g, "/").endsWith(".java"));
  const classNames = entryNames.filter((n) => n.replace(/\\/g, "/").endsWith(".class"));
  const jarSha = sha256File(jarPath);
  const sidecar = readSidecar(jarPath);
  const schema = sidecarSchemaCompatible(sidecar.schemaVersion);
  if (!schema.ok) {
    return { ok: false, code: "INVALID_INPUT" as const, action: schema.action };
  }

  let existingSha: string | undefined;
  if (existsSync(destJson)) {
    try {
      const prev = JSON.parse(readFileSync(destJson, "utf8")) as LoaderApiSummary;
      existingSha = prev.sourceJarSha256;
    } catch {
      existingSha = undefined;
    }
  }
  const fresh = assertCacheFresh({
    jarSha256: jarSha,
    summarySha: existingSha,
    sidecarMappings: sidecar.mappingsVersion,
    targetMappings: mappingsVersion,
  });
  if (!fresh.ok && !force) {
    return { ok: false, code: "CACHE_STALE" as const, action: fresh.action };
  }

  const planned = {
    key,
    overlayJson: destJson,
    cacheJar,
    officialJsonRefused: officialJson,
    javaFileCount: javaNames.length,
    classFileCount: classNames.length,
    sourceJarSha256: jarSha,
    mappingsVersion,
    note: "摘要只写 $MC_SKILL_CACHE/loader-api-summaries overlay，禁止写入仓库 data/",
    cli: howToIngestCli(platform, minecraftVersion),
  };

  if (javaNames.length === 0) {
    return {
      ok: false,
      dryRun,
      ...planned,
      action: actionable("NEED_SOURCES", "jar 内没有 .java。纯 class 请先 decompile_mod_jar 再 ingest 含源码的树/jar。", [
        "decompile_mod_jar --jarPath=<abs>",
        "或提供 -sources.jar",
      ]),
    };
  }

  // overlay 只写 $MC_SKILL_CACHE，与 decompile_mod_jar 同口径，不走工程沙箱 / MC_SKILL_ALLOW_WRITE。
  if (dryRun || !confirmed) {
    return {
      ok: true,
      dryRun: true,
      ...planned,
      howToWrite:
        "设置后重跑：--dry-run=false --confirm。只写 $MC_SKILL_CACHE overlay（与 decompile 同口径，不需要 MC_SKILL_ALLOW_WRITE）。仍不会写仓库 data/",
    };
  }

  const entries = readZip(readFileSync(jarPath));
  const rawClasses: LoaderClassRecord[] = [];
  for (const [name, data] of entries) {
    const posix = name.replace(/\\/g, "/");
    if (!posix.endsWith(".java")) continue;
    rawClasses.push(...extractCompilationUnit(data.toString("utf8"), posix));
  }
  const classes = dedupeLoaderClasses(rawClasses);
  const parseErrorCount = classes.filter((c) => Boolean(c.parseError)).length;

  const fqcnIndex = [...new Set(classes.map((c) => c.fqcn).filter((fq) => fq && !fq.startsWith("__parse_error__") && !/\$[0-9]/.test(fq)))];

  const summary: LoaderApiSummary = {
    file: `${key}.jar`,
    key,
    platform,
    minecraftVersion,
    mappingsVersion,
    mappingsSource: args.mappingsSource ?? sidecar.mappingsSource ?? "user_ingest",
    sourceJarSha256: jarSha,
    source: "user_jar",
    classCount: classes.length,
    parseErrorCount,
    fqcnIndex,
    classes,
    note: "user ingest overlay；禁止提交进仓库",
  };

  mkdirSync(overlayDir, { recursive: true });
  mkdirSync(join(resolveCacheRoot(), "loader-jars"), { recursive: true });
  writeFileSync(destJson, JSON.stringify(summary, null, 2), "utf8");
  if (!sameJarPath(jarPath, cacheJar)) {
    copyFileSync(jarPath, cacheJar);
  }
  writeFileSync(
    `${cacheJar}.sidecar`,
    JSON.stringify(
      {
        schemaVersion: "1",
        mappingsVersion,
        mappingsSource: summary.mappingsSource,
        sourceJarSha256: jarSha,
      },
      null,
      2,
    ),
    "utf8",
  );

  invalidateMergedSummariesCache();

  return {
    ok: true,
    dryRun: false,
    key,
    overlayJson: destJson,
    cacheJar,
    classCount: classes.length,
    javaFileCount: javaNames.length,
    sourceJarSha256: jarSha,
    mappingsVersion,
    wroteOfficialData: false,
    parseErrorCount,
  };
}

function canonicalPath(p: string): string {
  try {
    return realpathSync(p);
  } catch {
    return resolve(p);
  }
}

function sameJarPath(a: string, b: string): boolean {
  const x = canonicalPath(a);
  const y = canonicalPath(b);
  return process.platform === "win32" ? x.toLowerCase() === y.toLowerCase() : x === y;
}
