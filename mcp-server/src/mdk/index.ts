/**
 * 下载官方 MDK 到 $MC_SKILL_CACHE（默认 dryRun）。
 * GitHub 必须 pin commit SHA；不对 branch HEAD zip 做校验和。
 */
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { resolveCacheRoot } from "../decompile/cache.js";
import { assertWritablePath, ProjectPathError } from "../utils/project-sandbox.js";

export type MdkPlatform = "forge" | "neoforge" | "fabric" | "quilt" | "liteloader" | "rift";
export type BuildPlugin =
  | "moddevgradle"
  | "neogradle"
  | "forgegradle"
  | "loom"
  | "quilt-loom"
  | "unknown";

export interface MdkChecksumEntry {
  id: string;
  platform: MdkPlatform;
  minecraftVersion: string;
  buildPlugin: BuildPlugin;
  repo: string;
  ref: string;
  archiveUrl: string;
  sha256: string | null;
  license: string;
  gitPolicy: "submodule_ok" | "cache_only" | "forbidden_redistribute";
  mappings: string;
  mappingsVersion?: string;
  notes?: string;
}

export interface DownloadOfficialMdkArgs {
  platform: MdkPlatform;
  minecraftVersion: string;
  buildPlugin?: BuildPlugin;
  dryRun?: boolean;
  confirmed?: boolean;
  destPath?: string;
  allowCacheFallback?: boolean;
}

const ALLOWED_HOST_PREFIXES = [
  "https://github.com/NeoForgeMDKs/",
  "https://github.com/neoforged/MDK",
  "https://github.com/MinecraftForge/MinecraftForge",
  "https://github.com/FabricMC/fabric-example-mod",
  "https://github.com/QuiltMC/quilt-template-mod",
  "https://github.com/DimensionalDevelopment/Rift",
  "https://files.minecraftforge.net/",
];

function checksumsPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data", "mdk-checksums.json");
}

export function loadMdkChecksums(): MdkChecksumEntry[] {
  const p = checksumsPath();
  if (!existsSync(p)) return [];
  const raw = JSON.parse(readFileSync(p, "utf8")) as { entries?: MdkChecksumEntry[] };
  return raw.entries ?? [];
}

function urlAllowed(url: string): boolean {
  return ALLOWED_HOST_PREFIXES.some((p) => url.startsWith(p));
}

export function resolveMdkEntry(args: {
  platform: MdkPlatform;
  minecraftVersion: string;
  buildPlugin?: BuildPlugin;
}): { entry?: MdkChecksumEntry; candidates: MdkChecksumEntry[]; error?: string } {
  const all = loadMdkChecksums().filter(
    (e) => e.platform === args.platform && e.minecraftVersion === args.minecraftVersion,
  );
  if (all.length === 0) {
    return {
      candidates: [],
      error: `无 pin 表条目：${args.platform} ${args.minecraftVersion}。禁止用邻版 MDK 冒充。`,
    };
  }
  if (args.buildPlugin) {
    const hit = all.find((e) => e.buildPlugin === args.buildPlugin);
    if (!hit) {
      return {
        candidates: all,
        error: `该版本无 buildPlugin=${args.buildPlugin}。可选：${all.map((e) => e.buildPlugin).join(", ")}`,
      };
    }
    return { entry: hit, candidates: all };
  }
  if (all.length === 1) return { entry: all[0], candidates: all };
  return {
    candidates: all,
    error:
      `${args.platform} ${args.minecraftVersion} 同时提供多种 Gradle 插件（${all.map((e) => e.buildPlugin).join(", ")}）。` +
      "请传 buildPlugin。官方 MDK 生成器对 26.1.1 / 26.1.2 / 26.2 均同时提供 ModDevGradle 与 NeoGradle，禁止按版本硬绑。",
  };
}

function sha256Buf(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function parseExampleEntry(root: string): { entryClass?: string; loaderVersion?: string; mappings?: string } {
  let entryClass: string | undefined;
  const scan = (dir: string, depth = 0) => {
    if (depth > 5 || entryClass) return;
    let names: string[] = [];
    try {
      names = readdirSync(dir);
    } catch {
      return;
    }
    for (const n of names) {
      const full = join(dir, n);
      if (n.endsWith(".java")) {
        const src = readFileSync(full, "utf8");
        if (/@Mod\b|ModInitializer|QuiltMod|LiteMod/.test(src)) {
          const pkg = src.match(/package\s+([a-zA-Z0-9_.]+)\s*;/)?.[1];
          const cls = src.match(/\bclass\s+([A-Za-z0-9_]+)/)?.[1];
          if (pkg && cls) entryClass = `${pkg}.${cls}`;
          return;
        }
      } else if (!n.includes(".")) {
        scan(full, depth + 1);
      }
    }
  };
  scan(root);
  let loaderVersion: string | undefined;
  const gp = join(root, "gradle.properties");
  if (existsSync(gp)) {
    const txt = readFileSync(gp, "utf8");
    loaderVersion =
      txt.match(/neo_version\s*=\s*(\S+)/)?.[1] ??
      txt.match(/neoforge_version\s*=\s*(\S+)/)?.[1] ??
      txt.match(/forge_version\s*=\s*(\S+)/)?.[1] ??
      txt.match(/minecraft_version\s*=\s*(\S+)/)?.[1];
  }
  return { entryClass, loaderVersion };
}

export async function downloadOfficialMdk(args: DownloadOfficialMdkArgs): Promise<Record<string, unknown>> {
  const dryRun = args.dryRun !== false;
  const resolved = resolveMdkEntry(args);
  if (!resolved.entry) {
    return {
      ok: false,
      error: { code: "MDK_NOT_PINNED", message: resolved.error },
      candidates: resolved.candidates.map((c) => ({
        id: c.id,
        buildPlugin: c.buildPlugin,
        repo: c.repo,
        ref: c.ref,
      })),
    };
  }
  const entry = resolved.entry;
  if (!urlAllowed(entry.archiveUrl) || !urlAllowed(entry.repo)) {
    return {
      ok: false,
      error: {
        code: "URL_NOT_ALLOWLISTED",
        message: `拒绝非白名单 URL: ${entry.archiveUrl}`,
      },
    };
  }

  const cacheRoot = resolveCacheRoot();
  const destCache = join(
    cacheRoot,
    "mdk",
    entry.platform,
    entry.minecraftVersion,
    entry.buildPlugin,
  );
  const base = {
    ok: true,
    id: entry.id,
    platform: entry.platform,
    minecraftVersion: entry.minecraftVersion,
    buildPlugin: entry.buildPlugin,
    url: entry.archiveUrl,
    repo: entry.repo,
    ref: entry.ref,
    sha256: entry.sha256,
    license: entry.license,
    gitPolicy: entry.gitPolicy,
    mappings: entry.mappings,
    mappingsVersion: entry.mappingsVersion ?? entry.mappings,
    gitPolicyNote:
      entry.gitPolicy === "forbidden_redistribute"
        ? "不可再分发源码或修改版 loader；仅允许本机 cache。"
        : entry.gitPolicy === "cache_only"
          ? "不要 vendor 进本仓库；只写入 cache。"
          : "模板许可允许 submodule，引擎本体不要整仓塞进 MC_skill。",
    cacheDest: destCache,
    dryRun,
  };

  if (dryRun) {
    return {
      ...base,
      downloaded: false,
      note: "dryRun：未下载。确认后 dryRun=false 解压到 $MC_SKILL_CACHE/mdk/…。写入用户工程还需 confirmed + MC_SKILL_ALLOW_WRITE + MC_SKILL_PROJECT_ROOT。git clone 用 pin 的 commit SHA，不对 branch HEAD zip 做校验和。",
    };
  }

  if (entry.gitPolicy === "forbidden_redistribute") {
    return {
      ...base,
      ok: false,
      downloaded: false,
      error: {
        code: "FORBIDDEN_REDISTRIBUTE",
        message: `${entry.platform} MDK 禁止再分发。工具不会下载进仓库；若本机 cache 已有同一 platform+version 且 allowCacheFallback=true 才可复用。`,
      },
    };
  }

  if (args.destPath) {
    try {
      if (args.confirmed !== true) {
        return { ...base, ok: false, error: { code: "NOT_CONFIRMED", message: "写入用户工程需要 confirmed=true" } };
      }
      assertWritablePath(args.destPath);
    } catch (e) {
      const err = e as ProjectPathError;
      return {
        ...base,
        ok: false,
        error: { code: err.code ?? "WRITE_DISABLED", message: err.message },
      };
    }
  }

  const marker = join(destCache, ".mdk-ref");
  if (existsSync(marker) && readFileSync(marker, "utf8").trim() === entry.ref) {
    const parsed = parseExampleEntry(destCache);
    return { ...base, downloaded: true, cacheHit: true, dest: destCache, ...parsed };
  }

  mkdirSync(destCache, { recursive: true });
  let zip: Buffer;
  try {
    const res = await fetch(entry.archiveUrl, {
      headers: { "User-Agent": "MC-AI-Coding-Assistant-Tool" },
      redirect: "follow",
    });
    if (!res.ok) {
      if (args.allowCacheFallback && existsSync(marker)) {
        return {
          ...base,
          downloaded: false,
          cacheFallback: true,
          dest: destCache,
          warning: `官方 URL HTTP ${res.status}，已用同一 platform+version 的 cache（禁止邻版）。`,
        };
      }
      return {
        ...base,
        ok: false,
        error: {
          code: "DOWNLOAD_FAILED",
          message: `HTTP ${res.status} ${entry.archiveUrl}。无 cache 则 Step 1 停止，不要编造 MDK。`,
        },
      };
    }
    zip = Buffer.from(await res.arrayBuffer());
  } catch (e) {
    return {
      ...base,
      ok: false,
      error: { code: "DOWNLOAD_FAILED", message: String(e) },
    };
  }

  const hash = sha256Buf(zip);
  if (entry.sha256 && entry.sha256 !== hash) {
    return {
      ...base,
      ok: false,
      error: {
        code: "SHA256_MISMATCH",
        message: `期望 ${entry.sha256}，实际 ${hash}。拒绝解压。`,
      },
    };
  }

  writeFileSync(join(destCache, `_archive-${entry.ref.slice(0, 12)}.sha256`), hash, "utf8");
  writeFileSync(marker, entry.ref, "utf8");
  writeFileSync(
    join(destCache, "DOWNLOAD.txt"),
    `ref=${entry.ref}\nurl=${entry.archiveUrl}\nsha256=${hash}\nlicense=${entry.license}\n`,
    "utf8",
  );

  return {
    ...base,
    downloaded: true,
    dest: destCache,
    sha256: hash,
    sha256Pinned: Boolean(entry.sha256),
    note: entry.sha256
      ? undefined
      : "pin 表尚无 zip sha256；已计算本次 hash。请把该值写回 mdk-checksums.json。zip 已落 cache，未自动 git clone。请用 git clone <repo> 后 checkout 该 SHA。",
    unpackHint:
      "本工具写入 cache 标记与校验和。完整模板请 git clone 并用 pin 的 commit SHA checkout（不要跟 branch HEAD）。",
  };
}
