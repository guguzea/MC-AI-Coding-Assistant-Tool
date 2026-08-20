import { analyzeCrash } from "../crash/index.js";
import { actionable, ActionCodes, versionRequiredAction, missingMcVersion } from "../utils/actionable.js";
import { ownGet } from "../utils/own-record.js";
import { LIBRARY_CATALOG } from "./library-catalog.js";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { migrationGuideFromPrimers } from "../docs-platform/neoforge/primers.js";
import { loadModProject, preferExplicit, resolveProjectDir } from "../utils/project-files.js";

export interface AnalyzeLogInput {
  logText?: string;
  logPath?: string;
  version?: string;
}

export function analyzeLog(input: AnalyzeLogInput): Record<string, unknown> {
  if (missingMcVersion(input.version)) {
    const action = versionRequiredAction();
    return { ok: false, action, error: action.message };
  }
  const version = input.version!.trim();
  let text = input.logText;
  if (!text?.trim() && input.logPath) {
    const p = input.logPath;
    try {
      if (!existsSync(p) || !statSync(p).isFile()) {
        const action = actionable(ActionCodes.INVALID_INPUT, `无法读取 logPath：${p}`, [
          "传入 logText 全文，或有效的 logPath",
        ]);
        return { ok: false, action, error: action.message };
      }
      text = readFileSync(p, "utf8");
    } catch (err) {
      const action = actionable(ActionCodes.INVALID_INPUT, `读取 logPath 失败：${(err as Error).message}`, [
        "检查路径是否存在且可读",
      ]);
      return { ok: false, action, error: action.message };
    }
  }
  if (!text?.trim()) {
    const action = actionable(ActionCodes.INVALID_INPUT, "需要 logText 或 logPath", [
      "传入日志全文，或 CLI 使用 --logText @./logs/latest.log",
    ]);
    return { ok: false, action, error: action.message };
  }
  const lines = text.split(/\r?\n/);
  const errors = lines.filter((l) => /ERROR|Exception|Caused by:/i.test(l)).slice(0, 30);
  const warnings = lines.filter((l) => /WARN/i.test(l)).slice(0, 20);

  let crash = null;
  if (text.includes("---- Minecraft Crash Report ----")) {
    crash = analyzeCrash({ crashReport: text, version });
  }

  return {
    ok: true,
    version,
    errorLines: errors,
    warnLines: warnings,
    crashAnalysis: crash,
    relatedTools: relatedToolsForLog(text, version),
  };
}

function relatedToolsForLog(text: string, _version: string): string[] {
  const tools = ["crash_analyze", "search_community_docs"];
  if (/quilt\.mod|org\.quiltmc/i.test(text)) {
    tools.push("search_docs");
    return tools;
  }
  if (/net\.fabricmc|fabric-loader/i.test(text)) {
    tools.push("search_fabric_docs");
    return tools;
  }
  if (/net\.neoforged|neoforge/i.test(text)) {
    tools.push("search_neoforge_docs");
    return tools;
  }
  if (/net\.minecraftforge|minecraftforge|javafml/i.test(text)) {
    tools.push("validate_project");
  }
  return tools;
}

const MIGRATION_GUIDES: Record<string, { title: string; bullets: string[] }> = {
  "1.20.1->1.20.4": {
    title: "Forge 1.20.1 → 1.20.4",
    bullets: ["检查 ForgeGradle 与 Java 17", "FluidType API 变更", "考虑迁移 NeoForge 1.20.4"],
  },
  "1.20.4->1.21.1": {
    title: "NeoForge 1.21.x",
    bullets: ["Data Components 替代部分 NBT", "网络 StreamCodec", "CreativeTab 注册变更"],
  },
  "forge->neoforge": {
    title: "Forge → NeoForge",
    bullets: ["包名 net.minecraftforge → net.neoforged", "mods.toml → neoforge.mods.toml", "Capability → Data Attachments（部分）"],
  },
};

export function getMigrationGuide(
  route: string,
  opts?: { full?: boolean; platform?: string; section?: string },
): Record<string, unknown> {
  const key = route.trim().toLowerCase().replace(/\s+/g, "");
  const fromPrimers = migrationGuideFromPrimers({
    route: route.trim(),
    full: opts?.full === true,
    platform: opts?.platform,
    section: opts?.section,
  });
  if (fromPrimers.found) {
    return fromPrimers;
  }
  const guide = ownGet(MIGRATION_GUIDES, key);
  if (!guide) {
    return {
      found: false,
      availableRoutes: [
        ...Object.keys(MIGRATION_GUIDES),
        ...((fromPrimers.availableRoutes as string[]) ?? []),
      ],
      action: actionable(ActionCodes.NOT_FOUND, "未内置该迁移路线", [
        "使用 analyze_porting_path 扫描项目",
        "查阅 knowledge/version-changes",
        "get_migration_guide route 用 Primer 的 from->to（默认 toc；section 返回该章；full=true 才全文）",
      ], ["analyze_porting_path", "search_docs", "search_neoforge_docs"]),
    };
  }
  return {
    found: true,
    route: key,
    platform: opts?.platform,
    ...guide,
    relatedTools: ["analyze_porting_path", "port_project"],
  };
}

// ── check_dependencies：loader 判定 + 库模组 catalog 接线 + 冲突/陷阱检测 ──────

export type DetectedLoader =
  | "fabric"
  | "forge"
  | "neoforge"
  | "quilt"
  | "liteloader"
  | "liteloader_forge"
  | "rift"
  | "modloader"
  | "bedrock"
  | "unknown";

export interface DetectedLibrary {
  id: string;
  modIds: string[];
  loaders: string[];
  communityDocId?: string;
  skillId?: string;
  matchReason: string;
  /** 反编译验证过的 MC 版本窗口（catalog verifiedApi 键推导） */
  supportedVersions?: string[];
  /** manifest 版本摘要（lib-manifests/all.json） */
  manifestSummary?: { versions: number; samples: string[]; loaders: string[] };
}
export interface LoaderConflict {
  libraryId: string;
  reason: string;
}
export interface DependencyTrap {
  code: string;
  message: string;
  communityDocId?: string;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 词边界匹配（case-insensitive），避免 "owo" 误中 "power" 之类子串 */
function wordBoundaryRegex(token: string): RegExp {
  return new RegExp(`(^|[^A-Za-z0-9_])${escapeRegExp(token)}($|[^A-Za-z0-9_])`, "i");
}

function hasKeyword(text: string, token: string): boolean {
  const t = token.trim();
  if (!t) return false;
  if (t.length <= 3) {
    return new RegExp(`(^|[^A-Za-z0-9_.])${escapeRegExp(t)}($|[^A-Za-z0-9_.])`, "i").test(text);
  }
  return wordBoundaryRegex(t).test(text);
}

export interface CheckDependenciesExtras {
  quiltModJson?: string;
  litemodJson?: string;
  riftmodJson?: string;
  addonManifest?: string;
  projectPath?: string;
}

/**
 * javafml mods.toml：Neo 信号优先；loaderVersion 匹配多位如 [21,) / [47,)。
 * 无法区分时返回 unknown（调用方应 PICK_PLATFORM），禁止默默 Forge。
 * skip = 正文不像 javafml 元数据，让后续 Gradle 启发式继续。
 */
export function classifyJavaFmlToml(toml: string): "forge" | "neoforge" | "unknown" | "skip" {
  const hasJavaFml = /modLoader\s*=\s*"javafml"/i.test(toml);
  const hasLoaderVer = /loaderVersion\s*=\s*"\[\d+/i.test(toml);
  if (!hasJavaFml && !hasLoaderVer) return "skip";

  const neoNamed =
    /neoforge\.mods\.toml/i.test(toml) ||
    /\[\[dependencies\.neoforge\]\]/i.test(toml) ||
    /modId\s*=\s*"neoforge"/i.test(toml);
  const forgeNamed = /\[\[dependencies\.forge\]\]/i.test(toml) || /modId\s*=\s*"forge"/i.test(toml);

  if (neoNamed && !forgeNamed) return "neoforge";
  if (forgeNamed && !neoNamed) return "forge";
  if (neoNamed && forgeNamed) return "unknown";

  const m = toml.match(/loaderVersion\s*=\s*"\[(\d+),/i);
  if (m) {
    const n = Number(m[1]);
    if (n === 21 || (n >= 1 && n <= 9)) return "neoforge";
    if (n >= 13 && n !== 21) return "forge";
    return "unknown";
  }

  if (hasJavaFml) return "unknown";
  return "skip";
}

/** loader 判定：Quilt → Fabric → NeoForge → LiteLoader → Rift（tweaker-client 先于 forge 子串）→ Forge → ModLoader → 基岩 */
export function detectLoader(
  buildGradle: string,
  modsToml?: string,
  fabricModJson?: string,
  neoModsToml?: string,
  extras?: CheckDependenciesExtras,
): DetectedLoader {
  const quiltJson = extras?.quiltModJson?.trim();
  if (quiltJson || /org\.quiltmc\.loom|quilt-loom|quilt\.mod\.json/i.test(buildGradle)) {
    return "quilt";
  }

  if (fabricModJson && fabricModJson.trim().length > 0) return "fabric";
  if (/fabric-loom|fabric-api/i.test(buildGradle) && !/quilt-loom|org\.quiltmc\.loom/i.test(buildGradle)) {
    return "fabric";
  }

  if (neoModsToml && neoModsToml.trim().length > 0) return "neoforge";
  if (/neogradle|net\.neoforged|neoforge/i.test(buildGradle)) return "neoforge";

  const litemod = extras?.litemodJson?.trim();
  const hasLlPlugin = /net\.minecraftforge\.gradle\.liteloader/.test(buildGradle);
  const hasForgeMeta =
    /modLoader\s*=\s*"javafml"/i.test(modsToml ?? "") ||
    /@Mod\b/.test(buildGradle);
  const hasLiteMeta = Boolean(litemod) || /LiteMod|litemod\.json/i.test(buildGradle);

  if (hasLlPlugin) {
    return "liteloader_forge";
  }
  if (hasLiteMeta && !hasForgeMeta) {
    return "liteloader";
  }
  if (hasLiteMeta && hasForgeMeta && !hasLlPlugin) {
    return "unknown";
  }

  const riftJson = extras?.riftmodJson?.trim();
  if (
    riftJson ||
    /riftmod\.json|rift\.mod\.json/i.test(buildGradle) ||
    /RiftLoaderClientTweaker|net\.minecraftforge\.gradle\.tweaker-client/i.test(buildGradle)
  ) {
    return "rift";
  }

  const toml = modsToml?.trim();
  if (toml && toml.length > 0) {
    const javaFml = classifyJavaFmlToml(toml);
    if (javaFml !== "skip") return javaFml;
  }
  if (/forge|minecraftforge/i.test(buildGradle) && !hasLiteMeta) return "forge";

  if (
    /extends\s+BaseMod\b|class\s+mod_[A-Za-z0-9_]+/.test(buildGradle) &&
    !/cpw\.mods\.fml|net\.minecraftforge/.test(buildGradle)
  ) {
    return "modloader";
  }

  const manifest = extras?.addonManifest?.trim();
  if (manifest && /"format_version"/.test(manifest) && /"modules"/.test(manifest)) {
    return "bedrock";
  }

  return "unknown";
}

export function javaBlobFromFiles(files?: Array<{ path: string; content: string }>): string {
  return (files ?? []).map((f) => `${f.path}\n${f.content}`).join("\n");
}

/** Java 补强：Neo（有 neoforged 无 forge 包名）与 BaseMod。detect / validate 共用。 */
export function reinforceLoaderWithJava(fromDetect: DetectedLoader, javaBlob: string): DetectedLoader {
  if (fromDetect !== "unknown" && fromDetect !== "forge") {
    return fromDetect;
  }
  if (fromDetect === "forge") {
    if (/net\.neoforged/.test(javaBlob) && !/net\.minecraftforge/.test(javaBlob)) {
      return "neoforge";
    }
    return "forge";
  }
  if (/org\.quiltmc|quilt\.mod\.json|quilt_loader/i.test(javaBlob)) return "quilt";
  if (/net\.neoforged|neoforge\.mods\.toml/i.test(javaBlob)) return "neoforge";
  if (/net\.fabricmc|implements\s+ModInitializer|fabric\.mod\.json/i.test(javaBlob)) {
    return "fabric";
  }
  if (/\bLiteMod\b|litemod\.json/i.test(javaBlob)) return "liteloader";
  if (/RiftLoader|riftmod\.json|rift\.mod\.json/i.test(javaBlob)) return "rift";
  if (/extends\s+BaseMod\b/.test(javaBlob) && !/cpw\.mods\.fml|net\.minecraftforge/.test(javaBlob)) {
    return "modloader";
  }
  if (/"format_version"/.test(javaBlob) && /"modules"/.test(javaBlob)) return "bedrock";
  return fromDetect;
}

export interface ProjectLoaderDetection {
  primary: DetectedLoader;
  loaders: DetectedLoader[];
  multiLoader: boolean;
  architectury: boolean;
}

export function detectProjectLoaders(input: {
  buildGradle?: string;
  modsToml?: string;
  fabricModJson?: string;
  neoModsToml?: string;
  extras?: CheckDependenciesExtras;
  javaBlob?: string;
  fabricModJsons?: string[];
  quiltModJsons?: string[];
  modsTomls?: string[];
  neoModsTomls?: string[];
}): ProjectLoaderDetection {
  const gradle = input.buildGradle ?? "";
  const architectury = /architectury/i.test(gradle);
  const javaBlob = input.javaBlob ?? "";
  const extras: CheckDependenciesExtras = { ...(input.extras ?? {}) };
  if (!extras.quiltModJson?.trim() && input.quiltModJsons?.some((s) => s.trim())) {
    extras.quiltModJson = input.quiltModJsons.find((s) => s.trim());
  }

  const fromDetect = detectLoader(
    gradle,
    input.modsToml,
    input.fabricModJson,
    input.neoModsToml,
    extras,
  );
  const primary = reinforceLoaderWithJava(fromDetect, javaBlob);

  const anyQuilt =
    Boolean(extras.quiltModJson?.trim()) ||
    (input.quiltModJsons ?? []).some((s) => s.trim()) ||
    /org\.quiltmc\.loom|quilt-loom|quilt\.mod\.json/i.test(gradle);
  const anyFabric =
    Boolean(input.fabricModJson?.trim()) ||
    (input.fabricModJsons ?? []).some((s) => s.trim()) ||
    (/fabric-loom|fabric-api/i.test(gradle) && !/quilt-loom|org\.quiltmc\.loom/i.test(gradle));
  const anyNeo =
    Boolean(input.neoModsToml?.trim()) ||
    (input.neoModsTomls ?? []).some((s) => s.trim()) ||
    /neogradle|net\.neoforged/i.test(gradle) ||
    (/net\.neoforged/.test(javaBlob) && !/net\.minecraftforge/.test(javaBlob));
  const anyForgeMeta = [input.modsToml, ...(input.modsTomls ?? [])].some(
    (t) => t && /modLoader\s*=\s*"javafml"/i.test(t) && !/neoforge/i.test(t),
  );
  const anyForgeGradle = /net\.minecraftforge\.gradle(?!\.liteloader)|id\s+['"]net\.minecraftforge\.gradle['"]/i.test(
    gradle,
  );

  const found = new Set<DetectedLoader>();
  if (anyQuilt) found.add("quilt");
  if (anyFabric) found.add("fabric");
  if (anyNeo) found.add("neoforge");
  if ((anyForgeMeta || anyForgeGradle || /net\.minecraftforge/.test(javaBlob)) && !anyNeo) {
    found.add("forge");
  }
  const anyLite =
    Boolean(extras.litemodJson?.trim()) ||
    /net\.minecraftforge\.gradle\.liteloader/.test(gradle) ||
    /\bLiteMod\b|litemod\.json|com\.mumfrey\.liteloader/i.test(`${gradle}\n${javaBlob}`);
  if (anyLite) found.add("liteloader");
  if (primary !== "unknown") found.add(primary);

  const loaders = [...found];
  const multiLoader = architectury || loaders.length > 1;
  return {
    primary,
    loaders: loaders.length ? loaders : [primary],
    multiLoader,
    architectury,
  };
}

// 生成 catalog 之外的别名/关键字补充（JEI/EMI/REI 归 library-integration-jei-emi；owo 的 fabric.mod.json id 是 "owo"）
const CATALOG_ALIASES: Record<string, string[]> = {
  "authored/library-integration-jei-emi": ["jei", "emi", "rei"],
  "authored/lib-owo": ["owo"],
};

/** §4.4 detectedLibraries：按依赖坐标/modId 关键字匹配 catalog */
function detectLibraryMatches(text: string): DetectedLibrary[] {
  const out: DetectedLibrary[] = [];
  const seen = new Set<string>();
  for (const entry of LIBRARY_CATALOG) {
    const keywords = [...entry.modIds, ...(ownGet(CATALOG_ALIASES, entry.id) ?? [])].filter((k) => k.length > 0);
    if (keywords.length === 0) continue;
    const hit = keywords.find((k) => hasKeyword(text, k));
    if (!hit || seen.has(entry.id)) continue;
    seen.add(entry.id);
    out.push({
      id: entry.id,
      modIds: entry.modIds,
      loaders: entry.loaders,
      communityDocId: entry.communityDocId,
      ...(entry.skillId ? { skillId: entry.skillId } : {}),
      ...(entry.supportedVersions && entry.supportedVersions.length > 0
        ? { supportedVersions: entry.supportedVersions }
        : {}),
      matchReason: `依赖坐标/modId 关键字「${hit}」匹配`,
    });
  }
  return out;
}

/**
 * ③ manifest 接线：从 lib-manifests/all.json 给 detectedLibraries 附版本摘要。
 * 懒加载 + 容错（文件缺失/解析失败 → 静默跳过，不影响主流程）。
 */
let manifestCache: Array<{ slug: string; entries: Array<{ gameVersion: string; loader: string; versionNumber: string; versionType: string }> }> | null | undefined;
function loadManifest(): typeof manifestCache {
  if (manifestCache !== undefined) return manifestCache;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const p = join(here, "..", "..", "data", "lib-manifests", "all.json");
    if (!existsSync(p)) { manifestCache = null; return manifestCache; }
    manifestCache = JSON.parse(readFileSync(p, "utf8")) as typeof manifestCache;
  } catch {
    manifestCache = null;
  }
  return manifestCache;
}

function attachManifestSummaries(libs: DetectedLibrary[]): void {
  const manifest = loadManifest();
  if (!manifest || libs.length === 0) return;
  for (const lib of libs) {
    const entry = LIBRARY_CATALOG.find((e) => e.id === lib.id);
    if (!entry) continue;
    const slugs = String(entry.modrinthSlug ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const rows = manifest.flatMap((m) => (slugs.includes(m.slug) ? m.entries : []));
    if (rows.length === 0) continue;
    const loaders = [...new Set(rows.map((r) => r.loader))].sort();
    const samples = [...new Set(rows.map((r) => r.versionNumber))].filter((v) => /^\d/.test(v)).slice(0, 6);
    lib.manifestSummary = { versions: rows.length, samples, loaders };
  }
}
const FABRIC_ONLY_LIBS: Array<{ id: string; keywords: string[]; reason: string }> = [
  {
    id: "owo",
    keywords: ["owo-lib", "owo"],
    reason: "owo_on_forge：owo-lib 无纯 Forge 版（仅 fabric/neoforge/quilt），Forge 建议 Cloth Config / YACL / ForgeConfigSpec",
  },
  {
    id: "cca",
    keywords: ["cardinal-components", "cca"],
    reason: "cca_on_forge：Cardinal Components API 无 Forge 版（Fabric/Quilt 专属）",
  },
  {
    id: "polymer",
    keywords: ["polymer"],
    reason: "polymer_on_forge：Polymer 仅 Fabric/Quilt（纯服务端内容）",
  },
  {
    id: "trinkets",
    keywords: ["trinkets"],
    reason: "trinkets_on_forge：Trinkets 仅 Fabric/Quilt，Forge/NeoForge 饰品标准应改 Curios",
  },
];

/** §4.5 loaderConflicts：仅 forge 判定（fabric-only 库在 neoforge/fabric 上合法；unknown 降级为空） */
function detectLoaderConflicts(loader: DetectedLoader, text: string): LoaderConflict[] {
  if (loader !== "forge") return [];
  const out: LoaderConflict[] = [];
  for (const lib of FABRIC_ONLY_LIBS) {
    if (lib.keywords.some((k) => hasKeyword(text, k))) {
      out.push({ libraryId: lib.id, reason: lib.reason });
    }
  }
  return out;
}

/** 提取文本中的 MC 版本提示（1.x.y / 1.x / 26.x），判断是否 ≥ minVer */
function hintAtLeastMinecraft(text: string, minVer: [number, number, number]): boolean {
  const matches = text.match(/\b1\.\d{1,2}(?:\.\d{1,2})?\b|\b26\.\d+\b/g) ?? [];
  for (const m of matches) {
    const parts = m.split(".").map(Number);
    const ver: [number, number, number] =
      parts.length === 2 ? [parts[0], parts[1], 0] : [parts[0], parts[1], parts[2]];
    if (
      ver[0] > minVer[0] ||
      (ver[0] === minVer[0] && ver[1] > minVer[1]) ||
      (ver[0] === minVer[0] && ver[1] === minVer[1] && ver[2] >= minVer[2])
    ) {
      return true;
    }
  }
  return false;
}

/** 提取文本中是否出现任何 MC 版本号 */
function hasMinecraftVersionHint(text: string): boolean {
  return /\b1\.\d{1,2}(?:\.\d{1,2})?\b|\b26\.\d+\b/.test(text);
}

/** §4.5 traps（bookshelf 重名与 loader 无关；trinkets 停更需 fabric） */
function detectTraps(loader: DetectedLoader, text: string): DependencyTrap[] {
  const traps: DependencyTrap[] = [];
  if ((loader === "fabric" || loader === "quilt") && hasKeyword(text, "trinkets")) {
    if (hintAtLeastMinecraft(text, [1, 21, 4])) {
      traps.push({
        code: "trinkets_stale",
        message: "Trinkets 已停在 ~1.21.1；1.21.4+ 多自研/原版机制（如 Data Component），建议核对支持窗口或改原版机制",
        communityDocId: "authored/lib-trinkets",
      });
    } else if (!hasMinecraftVersionHint(text)) {
      traps.push({
        code: "trinkets_version_window",
        message:
          "检测到 Trinkets，但未看到目标 MC 版本。Trinkets 约维护到 1.21.1；若目标为 1.21.4+ 请核对支持窗口或改原版/自研饰品机制",
        communityDocId: "authored/lib-trinkets",
      });
    }
  }
  if (hasKeyword(text, "bookshelf") && !/bookshelf-lib|bookshelfapi|darkhax\.bookshelf|bookshelflib/i.test(text)) {
    traps.push({
      code: "bookshelf_spigot",
      message: "坐标/名称像 bookshelf：Modrinth 上 `bookshelf` 是 Spigot 插件，Darkhax 模组版坐标应为 bookshelf-lib（bookshelfapi）",
      communityDocId: "authored/lib-bookshelf",
    });
  }
  return traps;
}

export function checkDependencies(
  buildGradle: string,
  modsToml?: string,
  fabricModJson?: string,
  neoModsToml?: string,
  extras?: CheckDependenciesExtras,
): Record<string, unknown> {
  if (extras?.projectPath) {
    const resolved = resolveProjectDir(extras.projectPath);
    if (!resolved.ok) {
      return { ok: false, action: resolved.action, issues: [resolved.action.message], suggestions: [] };
    }
    const loaded = loadModProject(resolved.root);
    buildGradle = preferExplicit(buildGradle, loaded.buildGradle) ?? "";
    modsToml = preferExplicit(modsToml, loaded.modsToml);
    fabricModJson = preferExplicit(fabricModJson, loaded.fabricModJson);
    neoModsToml = preferExplicit(neoModsToml, loaded.neoModsToml);
    extras = {
      ...extras,
      quiltModJson: preferExplicit(extras.quiltModJson, loaded.quiltModJson),
      litemodJson: preferExplicit(extras.litemodJson, loaded.litemodJson),
      riftmodJson: preferExplicit(extras.riftmodJson, loaded.riftmodJson),
      addonManifest: preferExplicit(extras.addonManifest, loaded.addonManifest),
    };
  }
  const issues: string[] = [];
  const suggestions: string[] = [];
  const detectedLoader = detectLoader(buildGradle, modsToml, fabricModJson, neoModsToml, extras);
  const text = [buildGradle, modsToml, fabricModJson, neoModsToml, extras?.quiltModJson, extras?.litemodJson, extras?.riftmodJson, extras?.addonManifest]
    .filter((s) => s)
    .join("\n");

  if (detectedLoader === "unknown" && /modLoader\s*=\s*"javafml"/i.test(modsToml ?? "") && !extras?.litemodJson) {
    issues.push("仅有 javafml mods.toml，无法区分 Forge / NeoForge。请询问用户（PICK_PLATFORM），禁止默默当 Forge。");
  }
  if (detectedLoader === "unknown" && (extras?.litemodJson || /litemod\.json|LiteMod/i.test(text)) && /modLoader\s*=\s*"javafml"|@Mod/.test(text)) {
    issues.push(
      "同时存在 LiteLoader 与 Forge 元数据，但未检测到 apply plugin: 'net.minecraftforge.gradle.liteloader'。请确认是混合工程还是残留 litemod；禁止默默当纯 Forge。",
    );
  }
  if (
    /net\.minecraftforge\.gradle\.forge/.test(buildGradle) &&
    /liteloader/i.test(buildGradle) &&
    !/net\.minecraftforge\.gradle\.liteloader/.test(buildGradle)
  ) {
    issues.push("错误组合：不要分别 apply 标准 Forge 插件和另一个 LiteLoader 插件，只使用 net.minecraftforge.gradle.liteloader");
  }

  // ── 保留并增强原有启发式 ────────────────────────────────────────────────
  if (detectedLoader !== "bedrock" && detectedLoader !== "modloader" && !/minecraft|forge|neoforge|fabric|quilt|liteloader|rift/i.test(buildGradle)) {
    issues.push("build.gradle 未检测到 minecraft/loader 依赖");
  }
  if (detectedLoader === "forge" && modsToml && !/modLoader\s*=\s*"javafml"/i.test(modsToml)) {
    issues.push("Forge 项目但 mods.toml modLoader 不是 javafml");
  }
  if (detectedLoader === "forge" && !modsToml) {
    suggestions.push("检测到 Forge 但未提供 mods.toml；传入以启用 modLoader 一致性校验");
  }
  if (/dependencies\s*\{[^}]*\}/s.test(buildGradle) && !/implementation|modImplementation/i.test(buildGradle)) {
    suggestions.push("确认使用 implementation / modImplementation 声明依赖");
  }

  // ── §4.4 catalog 接线 + §4.5 冲突/陷阱 ─────────────────────────────────
  const detectedLibraries = detectLibraryMatches(text);
  attachManifestSummaries(detectedLibraries);
  const loaderConflicts = detectLoaderConflicts(detectedLoader, text);
  const traps = detectTraps(detectedLoader, text);

  // curios_on_fabric：Fabric 上仅 curios（无 trinkets 说明）→ 建议 Trinkets
  if ((detectedLoader === "fabric" || detectedLoader === "quilt") && hasKeyword(text, "curios") && !hasKeyword(text, "trinkets")) {
    suggestions.push("curios_on_fabric：Fabric/Quilt 上检测到 Curios 依赖——Curios 无 Fabric 版，饰品标准是 Trinkets");
  }
  // cloth_frozen：Cloth Config 已冷冻，新模组语境 → 建议 YACL/Fzzy
  if (hasKeyword(text, "cloth-config") || hasKeyword(text, "cloth_config")) {
    suggestions.push("cloth_frozen：Cloth Config 已冷冻（维护停滞），新模组可考虑 YACL / Fzzy Config");
  }

  const result: Record<string, unknown> = {
    ok: issues.length === 0,
    detectedLoader,
    issues,
    suggestions,
    detectedLibraries,
    loaderConflicts,
    traps,
    relatedTools: ["diagnose_gradle", "analyze_porting_path", "search_community_docs"],
  };
  if (detectedLoader === "unknown" && /modLoader\s*=\s*"javafml"/i.test(modsToml ?? "") && !extras?.litemodJson) {
    result.action = actionable(
      ActionCodes.PICK_PLATFORM,
      "仅有 javafml mods.toml，无法区分 Forge / NeoForge。请询问用户指定 platform，禁止默默当 Forge。",
      ["向用户询问 platform=forge 或 neoforge", "或提供 neoforge.mods.toml / [[dependencies.neoforge]]"],
    );
  }
  return result;
}
