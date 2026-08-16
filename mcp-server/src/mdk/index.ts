/**
 * 下载官方 MDK 到 $MC_SKILL_CACHE（默认 dryRun）。
 * GitHub 必须 pin commit SHA；不对 branch HEAD zip 做校验和。
 * dryRun=false：保留 zip、解压到 unpacked/、解析 entryClass 成功后才写回 sha256。
 */
import { createHash } from "crypto";
import { execFileSync, spawnSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  cpSync,
  rmSync,
} from "fs";
import { dirname, join, resolve, sep, isAbsolute } from "path";
import { fileURLToPath } from "url";
import { crc32 } from "zlib";
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
export type MdkSource = "github" | "official";

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
  source?: MdkSource;
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

export type UnzipKind = "unzip" | "7z" | "bsdtar";

export interface UnzipTool {
  kind: UnzipKind;
  executable: string;
}

const ALLOWED_HOST_PREFIXES = [
  "https://github.com/NeoForgeMDKs/",
  "https://codeload.github.com/NeoForgeMDKs/",
  "https://codeload.github.com/FabricMC/",
  "https://codeload.github.com/QuiltMC/",
  "https://codeload.github.com/neoforged/",
  "https://github.com/neoforged/MDK",
  "https://github.com/MinecraftForge/MinecraftForge",
  "https://github.com/FabricMC/fabric-example-mod",
  "https://github.com/QuiltMC/quilt-template-mod",
  "https://github.com/DimensionalDevelopment/Rift",
  "https://files.minecraftforge.net/",
  "https://maven.minecraftforge.net/",
];

export function checksumsPath(): string {
  if (process.env.MC_SKILL_MDK_CHECKSUMS) return process.env.MC_SKILL_MDK_CHECKSUMS;
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

function archiveUrlCandidates(url: string): string[] {
  const out = [url];
  const m = url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/archive\/([0-9a-fA-F]{7,40})\.zip$/);
  if (m) out.push(`https://codeload.github.com/${m[1]}/zip/${m[2]}`);
  return out;
}

async function fetchZipBuffer(
  url: string,
): Promise<{ ok: true; zip: Buffer } | { ok: false; status?: number; message: string }> {
  const candidates = archiveUrlCandidates(url).filter((u) => urlAllowed(u));
  let last = "无可用 URL";
  for (const u of candidates) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(u, {
          headers: { "User-Agent": "MC-AI-Coding-Assistant-Tool" },
          redirect: "follow",
        });
        if (!res.ok) {
          last = `HTTP ${res.status} ${u}`;
          if (res.status === 404) break;
          continue;
        }
        return { ok: true, zip: Buffer.from(await res.arrayBuffer()) };
      } catch (e) {
        last = `${String(e)} ${u} attempt=${attempt}`;
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
  }
  return { ok: false, message: last };
}

/** 整仓 Forge 引擎 zip（patches + 体积），禁止当 MDK */
export function isForbiddenEngineArchive(url: string): boolean {
  return /github\.com\/MinecraftForge\/MinecraftForge\/(archive|zipball|tarball)\b/i.test(url);
}

export function inferMdkSource(entry: Pick<MdkChecksumEntry, "source" | "archiveUrl">): MdkSource {
  if (entry.source === "official" || entry.source === "github") return entry.source;
  if (/files\.minecraftforge\.net|maven\.minecraftforge\.net/i.test(entry.archiveUrl)) return "official";
  return "github";
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
      error: `无 pin 表条目：${args.platform} ${args.minecraftVersion}。禁止用邻版 MDK 冒充。返回 MDK_NOT_PINNED。`,
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

export function sha256Buf(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function whichCmd(cmd: string): string | null {
  const bin = process.platform === "win32" ? "where" : "which";
  const r = spawnSync(bin, [cmd], { encoding: "utf8", windowsHide: true });
  if (r.status !== 0) return null;
  const line = (r.stdout || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) => s.length > 0);
  return line || null;
}

/** 先探测 unzip / 7z / 能解 zip 的 bsdtar。不要假定 GNU tar 能解 zip。 */
export function probeUnzipTool(): UnzipTool | null {
  const unzip = whichCmd("unzip");
  if (unzip) return { kind: "unzip", executable: unzip };

  const sevenCandidates = [
    whichCmd("7z"),
    whichCmd("7za"),
    process.platform === "win32" ? "C:\\Program Files\\7-Zip\\7z.exe" : null,
  ];
  for (const p of sevenCandidates) {
    if (p && existsSync(p)) return { kind: "7z", executable: p };
  }

  const tar = whichCmd("tar") || (process.platform === "win32" && existsSync("C:\\Windows\\System32\\tar.exe")
    ? "C:\\Windows\\System32\\tar.exe"
    : null);
  if (tar) {
    const help = spawnSync(tar, ["--help"], { encoding: "utf8", windowsHide: true });
    const text = `${help.stdout || ""}\n${help.stderr || ""}`;
    if (/bsdtar|libarchive/i.test(text) || process.platform === "win32") {
      return { kind: "bsdtar", executable: tar };
    }
  }
  return null;
}

export function isUnsafeZipEntry(name: string): boolean {
  const n = name.replace(/\\/g, "/");
  if (!n || n === ".") return true;
  if (n.startsWith("/") || n.startsWith("\\")) return true;
  if (/^[a-zA-Z]:/.test(n)) return true;
  if (n.split("/").some((p) => p === "..")) return true;
  return false;
}

export function assertNoZipSlip(names: string[], destRoot: string): { ok: true } | { ok: false; message: string } {
  const root = resolve(destRoot) + sep;
  for (const name of names) {
    if (isUnsafeZipEntry(name)) {
      return { ok: false, message: `zip-slip：拒绝条目 ${name}` };
    }
    const resolved = resolve(destRoot, name);
    if (resolved !== resolve(destRoot) && !resolved.startsWith(root) && resolved + sep !== root) {
      return { ok: false, message: `zip-slip：条目越出 unpacked/：${name}` };
    }
    if (isAbsolute(name)) {
      return { ok: false, message: `zip-slip：绝对路径 ${name}` };
    }
  }
  return { ok: true };
}

export function listZipEntries(zipPath: string, tool: UnzipTool): string[] {
  if (tool.kind === "unzip") {
    const r = spawnSync(tool.executable, ["-Z", "-1", zipPath], { encoding: "utf8", windowsHide: true });
    if (r.status === 0 && r.stdout) {
      return r.stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    }
    const l = spawnSync(tool.executable, ["-l", zipPath], { encoding: "utf8", windowsHide: true });
    const lines = (l.stdout || "").split(/\r?\n/);
    const names: string[] = [];
    let started = false;
    for (const line of lines) {
      if (/^-{4,}/.test(line)) {
        started = !started;
        continue;
      }
      if (!started) continue;
      const m = line.match(/\s+\S+\s+\S+\s+\S+\s+(.+)$/);
      if (m) names.push(m[1].trim());
    }
    return names;
  }
  if (tool.kind === "7z") {
    const r = spawnSync(tool.executable, ["l", "-slt", zipPath], { encoding: "utf8", windowsHide: true });
    const names: string[] = [];
    for (const line of (r.stdout || "").split(/\r?\n/)) {
      const m = line.match(/^Path = (.+)$/);
      if (m && m[1] && !m[1].endsWith(".zip") && m[1] !== zipPath) names.push(m[1].trim());
    }
    return names.filter((n) => n !== zipPath);
  }
  const r = spawnSync(tool.executable, ["-tf", zipPath], { encoding: "utf8", windowsHide: true });
  if (r.status !== 0) {
    throw new Error(`tar -tf 失败：${r.stderr || r.stdout || r.status}`);
  }
  return (r.stdout || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function extractZip(zipPath: string, destDir: string, tool: UnzipTool): void {
  mkdirSync(destDir, { recursive: true });
  if (tool.kind === "unzip") {
    execFileSync(tool.executable, ["-q", "-o", zipPath, "-d", destDir], { windowsHide: true });
    return;
  }
  if (tool.kind === "7z") {
    execFileSync(tool.executable, ["x", zipPath, `-o${destDir}`, "-y"], { windowsHide: true });
    return;
  }
  execFileSync(tool.executable, ["-xf", zipPath, "-C", destDir], { windowsHide: true });
}

/** 解压后若根下只有一个目录则进入该目录，否则解压根本身即为 unpackedRoot */
export function resolveUnpackedRoot(extractDir: string): string {
  if (!existsSync(extractDir)) return extractDir;
  const names = readdirSync(extractDir).filter((n) => n !== "." && n !== "..");
  if (names.length === 1) {
    const only = join(extractDir, names[0]);
    try {
      if (statSync(only).isDirectory()) return only;
    } catch {
      /* fall through */
    }
  }
  return extractDir;
}

function skipDirName(n: string): boolean {
  return n === ".git" || n === "build" || n === ".gradle" || n === "run" || n === "node_modules";
}

function parseModIdFromToml(root: string): string | undefined {
  const candidates = [
    join(root, "src", "main", "resources", "META-INF", "mods.toml"),
    join(root, "src", "main", "resources", "META-INF", "neoforge.mods.toml"),
    join(root, "META-INF", "mods.toml"),
    join(root, "META-INF", "neoforge.mods.toml"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const txt = readFileSync(p, "utf8");
    const id = txt.match(/modId\s*=\s*"([^"]+)"/)?.[1];
    if (id) return id;
  }
  return undefined;
}

function parseGradleProps(root: string): {
  loaderVersion?: string;
  mappings?: string;
  mappingsVersion?: string;
} {
  const gp = join(root, "gradle.properties");
  if (!existsSync(gp)) return {};
  const txt = readFileSync(gp, "utf8");
  const loaderVersion =
    txt.match(/neo_version\s*=\s*(\S+)/)?.[1] ??
    txt.match(/neoforge_version\s*=\s*(\S+)/)?.[1] ??
    txt.match(/forge_version\s*=\s*(\S+)/)?.[1] ??
    txt.match(/minecraft_version\s*=\s*(\S+)/)?.[1];
  const parchmentMc = txt.match(/parchment_minecraft_version\s*=\s*(\S+)/)?.[1];
  const parchmentMap = txt.match(/parchment_mappings_version\s*=\s*(\S+)/)?.[1];
  const neoForm = txt.match(/neo_form_version\s*=\s*(\S+)/)?.[1];
  const mappingsField = txt.match(/^mappings\s*=\s*(\S+)/m)?.[1];
  const channel = txt.match(/mapping_channel\s*=\s*(\S+)/)?.[1];
  const mapVer = txt.match(/mapping_version\s*=\s*(\S+)/)?.[1];
  let mappings: string | undefined;
  let mappingsVersion: string | undefined;
  if (parchmentMc && parchmentMap) {
    mappings = "parchment";
    mappingsVersion = `parchment-${parchmentMc}-${parchmentMap}`;
  } else if (neoForm) {
    mappings = "mojmap";
    mappingsVersion = `mojmap-neoform-${neoForm}`;
  } else if (channel && mapVer) {
    mappings = channel;
    mappingsVersion = `${channel}-${mapVer}`;
  } else if (mappingsField) {
    mappings = mappingsField;
    mappingsVersion = mappingsField;
  }
  return { loaderVersion, mappings, mappingsVersion };
}

export function parseExampleEntry(root: string): {
  entryClass?: string;
  loaderVersion?: string;
  mappings?: string;
  mappingsVersion?: string;
} {
  let entryClass: string | undefined;
  const scan = (dir: string, depth = 0) => {
    if (depth > 8 || entryClass) return;
    let names: string[] = [];
    try {
      names = readdirSync(dir);
    } catch {
      return;
    }
    for (const n of names) {
      if (skipDirName(n)) continue;
      const full = join(dir, n);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isFile() && n.endsWith(".java")) {
        const src = readFileSync(full, "utf8");
        if (/@Mod\s*\(|\bimplements\s+ModInitializer\b|\bQuiltMod\b|\bLiteMod\b/.test(src)) {
          const pkg = src.match(/package\s+([a-zA-Z0-9_.]+)\s*;/)?.[1];
          const cls = src.match(/\bclass\s+([A-Za-z0-9_]+)/)?.[1];
          if (pkg && cls) {
            entryClass = `${pkg}.${cls}`;
            return;
          }
        }
      } else if (st.isDirectory()) {
        scan(full, depth + 1);
      }
    }
  };
  scan(root);
  if (!entryClass) {
    const modId = parseModIdFromToml(root);
    if (modId) {
      const scanToml = (dir: string, depth = 0) => {
        if (depth > 8 || entryClass) return;
        let names: string[] = [];
        try {
          names = readdirSync(dir);
        } catch {
          return;
        }
        for (const n of names) {
          if (skipDirName(n)) continue;
          const full = join(dir, n);
          let st;
          try {
            st = statSync(full);
          } catch {
            continue;
          }
          if (st.isFile() && n.endsWith(".java")) {
            const src = readFileSync(full, "utf8");
            if (new RegExp(`@Mod\\s*\\(\\s*"${modId}"`).test(src) || new RegExp(`@Mod\\([^)]*${modId}`).test(src)) {
              const pkg = src.match(/package\s+([a-zA-Z0-9_.]+)\s*;/)?.[1];
              const cls = src.match(/\bclass\s+([A-Za-z0-9_]+)/)?.[1];
              if (pkg && cls) {
                entryClass = `${pkg}.${cls}`;
                return;
              }
            }
          } else if (st.isDirectory()) {
            scanToml(full, depth + 1);
          }
        }
      };
      scanToml(root);
    }
  }
  const props = parseGradleProps(root);
  return { entryClass, ...props };
}

/** 测试夹具：STORE 方法最小 zip（不入库二进制） */
export function createStoreZip(files: Array<{ name: string; data: Buffer | string }>): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  for (const f of files) {
    const data = typeof f.data === "string" ? Buffer.from(f.data, "utf8") : f.data;
    const name = Buffer.from(f.name.replace(/\\/g, "/"), "utf8");
    const crc = crc32(data) >>> 0;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    const localFull = Buffer.concat([local, name, data]);
    localParts.push(localFull);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(Buffer.concat([central, name]));
    offset += localFull.length;
  }
  const locals = Buffer.concat(localParts);
  const centrals = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centrals.length, 12);
  eocd.writeUInt32LE(locals.length, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([locals, centrals, eocd]);
}

export interface UnpackMdkResult {
  ok: boolean;
  sha256: string;
  unpackedDir?: string;
  unpackedRoot?: string;
  archivePath?: string;
  entryClass?: string;
  loaderVersion?: string;
  mappings?: string;
  mappingsVersion?: string;
  error?: { code: string; message: string };
}

export function unpackMdkArchive(opts: {
  zip: Buffer;
  destCache: string;
  expectedSha256?: string | null;
  refHint?: string;
}): UnpackMdkResult {
  const hash = sha256Buf(opts.zip);
  const sha12 = hash.slice(0, 12);
  mkdirSync(opts.destCache, { recursive: true });
  const archivePath = join(opts.destCache, `_archive-${sha12}.zip`);
  writeFileSync(archivePath, opts.zip);

  if (opts.expectedSha256 && opts.expectedSha256 !== hash) {
    return {
      ok: false,
      sha256: hash,
      archivePath,
      error: {
        code: "SHA256_MISMATCH",
        message: `期望 ${opts.expectedSha256}，实际 ${hash}。拒绝解压。zip=${archivePath}`,
      },
    };
  }

  const tool = probeUnzipTool();
  if (!tool) {
    return {
      ok: false,
      sha256: hash,
      archivePath,
      error: {
        code: "UNZIP_TOOL_MISSING",
        message:
          "未找到 unzip / 7z / bsdtar。Linux CI 请安装 unzip（不要假定 GNU tar 能解 zip）。Windows 可用系统 tar（bsdtar）或 7-Zip。zip 已保留：" +
          archivePath,
      },
    };
  }

  let names: string[];
  try {
    names = listZipEntries(archivePath, tool);
  } catch (e) {
    return {
      ok: false,
      sha256: hash,
      archivePath,
      error: { code: "UNPACK_FAILED", message: `列出 zip 条目失败（${tool.kind}）：${String(e)} zip=${archivePath}` },
    };
  }

  const slip = assertNoZipSlip(names, join(opts.destCache, "unpacked"));
  if (!slip.ok) {
    return {
      ok: false,
      sha256: hash,
      archivePath,
      error: { code: "ZIP_SLIP", message: `${slip.message} zip=${archivePath}` },
    };
  }

  const unpackedDir = join(opts.destCache, "unpacked");
  try {
    if (existsSync(unpackedDir)) rmSync(unpackedDir, { recursive: true, force: true });
    mkdirSync(unpackedDir, { recursive: true });
    extractZip(archivePath, unpackedDir, tool);
  } catch (e) {
    return {
      ok: false,
      sha256: hash,
      archivePath,
      unpackedDir,
      error: { code: "UNPACK_FAILED", message: `解压失败：${String(e)} zip=${archivePath}` },
    };
  }

  const unpackedRoot = resolveUnpackedRoot(unpackedDir);
  const parsed = parseExampleEntry(unpackedRoot);
  if (!parsed.entryClass) {
    return {
      ok: false,
      sha256: hash,
      archivePath,
      unpackedDir,
      unpackedRoot,
      ...parsed,
      error: {
        code: "ENTRY_CLASS_MISSING",
        message: `解压成功但未解析到 entryClass（@Mod / ModInitializer 或 mods.toml+@Mod）。zip=${archivePath} root=${unpackedRoot}`,
      },
    };
  }

  return {
    ok: true,
    sha256: hash,
    archivePath,
    unpackedDir,
    unpackedRoot,
    ...parsed,
  };
}

export function writebackSha256IfNull(id: string, hash: string): boolean {
  const p = checksumsPath();
  if (!existsSync(p)) return false;
  const raw = JSON.parse(readFileSync(p, "utf8")) as { note?: string; entries: MdkChecksumEntry[] };
  const e = raw.entries?.find((x) => x.id === id);
  if (!e || e.sha256) return false;
  e.sha256 = hash;
  writeFileSync(p, JSON.stringify(raw, null, 2) + "\n", "utf8");
  return true;
}

function cacheLooksReady(destCache: string, entry: MdkChecksumEntry): { ready: boolean; unpackedRoot?: string } {
  const unpacked = join(destCache, "unpacked");
  if (!existsSync(unpacked)) return { ready: false };
  const root = resolveUnpackedRoot(unpacked);
  const parsed = parseExampleEntry(root);
  if (!parsed.entryClass) return { ready: false };
  const marker = join(destCache, ".mdk-ref");
  if (entry.ref && entry.ref !== "forbidden" && existsSync(marker)) {
    if (readFileSync(marker, "utf8").trim() !== entry.ref) return { ready: false };
  }
  if (entry.sha256) {
    const sha12 = entry.sha256.slice(0, 12);
    const zipPath = join(destCache, `_archive-${sha12}.zip`);
    if (existsSync(zipPath) && sha256Buf(readFileSync(zipPath)) !== entry.sha256) return { ready: false };
  }
  return { ready: true, unpackedRoot: root };
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
  const source = inferMdkSource(entry);

  if (isForbiddenEngineArchive(entry.archiveUrl)) {
    return {
      ok: false,
      error: {
        code: "FORBIDDEN_ENGINE_ZIP",
        message: `拒绝整仓 Forge 引擎 zip：${entry.archiveUrl}。请用 files.minecraftforge.net / maven.minecraftforge.net 的 MDK zip。`,
      },
    };
  }

  if (!urlAllowed(entry.archiveUrl) || !urlAllowed(entry.repo)) {
    return {
      ok: false,
      error: {
        code: "URL_NOT_ALLOWLISTED",
        message: `拒绝非白名单 URL: ${entry.archiveUrl}`,
      },
    };
  }

  if (source === "github" && entry.ref && entry.ref !== "forbidden") {
    if (!entry.archiveUrl.includes(entry.ref)) {
      return {
        ok: false,
        error: {
          code: "SHA_NOT_IN_URL",
          message: `github 源 archiveUrl 必须包含 pin 的 commit SHA（${entry.ref}），禁止 branch HEAD：${entry.archiveUrl}`,
        },
      };
    }
  }

  const cacheRoot = resolveCacheRoot();
  const destCache = join(cacheRoot, "mdk", entry.platform, entry.minecraftVersion, entry.buildPlugin);
  const base = {
    ok: true,
    id: entry.id,
    platform: entry.platform,
    minecraftVersion: entry.minecraftVersion,
    buildPlugin: entry.buildPlugin,
    source,
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
    const cached = cacheLooksReady(destCache, entry);
    if (args.allowCacheFallback && cached.ready) {
      const parsed = parseExampleEntry(cached.unpackedRoot!);
      return {
        ...base,
        downloaded: false,
        cacheFallback: true,
        dest: destCache,
        unpackedRoot: cached.unpackedRoot,
        ...parsed,
      };
    }
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

  const cached = cacheLooksReady(destCache, entry);
  if (cached.ready) {
    const parsed = parseExampleEntry(cached.unpackedRoot!);
    if (args.destPath) {
      mkdirSync(args.destPath, { recursive: true });
      cpSync(cached.unpackedRoot!, args.destPath, { recursive: true });
    }
    return {
      ...base,
      downloaded: true,
      cacheHit: true,
      dest: destCache,
      unpackedRoot: cached.unpackedRoot,
      sha256: entry.sha256,
      ...parsed,
    };
  }

  mkdirSync(destCache, { recursive: true });
  let zip: Buffer;
  const fetched = await fetchZipBuffer(entry.archiveUrl);
  if (!fetched.ok) {
    if (args.allowCacheFallback && cached.ready) {
      return {
        ...base,
        downloaded: false,
        cacheFallback: true,
        dest: destCache,
        unpackedRoot: cached.unpackedRoot,
        warning: `官方 URL 失败 ${fetched.message}，已用同一 platform+version 的 cache（禁止邻版）。`,
      };
    }
    return {
      ...base,
      ok: false,
      error: {
        code: "DOWNLOAD_FAILED",
        message: `${fetched.message}。cache=${destCache}。无 cache 则 Step 1 停止，不要编造 MDK。`,
      },
    };
  }
  zip = fetched.zip;

  const unpacked = unpackMdkArchive({
    zip,
    destCache,
    expectedSha256: entry.sha256,
    refHint: entry.ref,
  });
  if (!unpacked.ok) {
    return {
      ...base,
      ok: false,
      downloaded: false,
      dest: destCache,
      archivePath: unpacked.archivePath,
      sha256: unpacked.sha256,
      error: unpacked.error,
    };
  }

  const marker = join(destCache, ".mdk-ref");
  writeFileSync(marker, entry.ref || unpacked.sha256, "utf8");
  writeFileSync(
    join(destCache, "DOWNLOAD.txt"),
    `ref=${entry.ref}\nurl=${entry.archiveUrl}\nsha256=${unpacked.sha256}\nlicense=${entry.license}\nsource=${source}\n`,
    "utf8",
  );

  let wroteSha = false;
  if (!entry.sha256) {
    wroteSha = writebackSha256IfNull(entry.id, unpacked.sha256);
  }

  if (args.destPath) {
    mkdirSync(args.destPath, { recursive: true });
    cpSync(unpacked.unpackedRoot!, args.destPath, { recursive: true });
  }

  return {
    ...base,
    downloaded: true,
    dest: destCache,
    unpackedRoot: unpacked.unpackedRoot,
    archivePath: unpacked.archivePath,
    sha256: unpacked.sha256,
    sha256Pinned: Boolean(entry.sha256) || wroteSha,
    sha256WroteBack: wroteSha,
    entryClass: unpacked.entryClass,
    loaderVersion: unpacked.loaderVersion,
    mappings: unpacked.mappings ?? entry.mappings,
    mappingsVersion: unpacked.mappingsVersion ?? entry.mappingsVersion ?? entry.mappings,
  };
}
