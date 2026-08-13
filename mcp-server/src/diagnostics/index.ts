import { analyzeCrash } from "../crash/index.js";
import { actionable, ActionCodes } from "../utils/actionable.js";
import { LIBRARY_CATALOG } from "./library-catalog.js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface AnalyzeLogInput {
  logText: string;
  version?: string;
}

export function analyzeLog(input: AnalyzeLogInput): Record<string, unknown> {
  const version = input.version ?? "1.20.1";
  const text = input.logText;
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
    relatedTools: ["crash_analyze", "search_community_docs", "validate_project"],
  };
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

export function getMigrationGuide(route: string): Record<string, unknown> {
  const key = route.trim().toLowerCase().replace(/\s+/g, "");
  const guide = MIGRATION_GUIDES[key];
  if (!guide) {
    return {
      found: false,
      availableRoutes: Object.keys(MIGRATION_GUIDES),
      action: actionable(ActionCodes.NOT_FOUND, "未内置该迁移路线", [
        "使用 analyze_porting_path 扫描项目",
        "查阅 knowledge/version-changes",
      ], ["analyze_porting_path", "search_docs"]),
    };
  }
  return { found: true, route: key, ...guide, relatedTools: ["analyze_porting_path", "port_project"] };
}

// ── check_dependencies：loader 判定 + 库模组 catalog 接线 + 冲突/陷阱检测 ──────

export type DetectedLoader = "fabric" | "forge" | "neoforge" | "unknown";

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

/** §4.3 loader 判定算法（顺序固定：fabricModJson → neoModsToml → modsToml 特征 → gradle 探测） */
function detectLoader(
  buildGradle: string,
  modsToml?: string,
  fabricModJson?: string,
  neoModsToml?: string,
): DetectedLoader {
  if (fabricModJson && fabricModJson.trim().length > 0) return "fabric";
  if (neoModsToml && neoModsToml.trim().length > 0) return "neoforge";
  const toml = modsToml?.trim();
  if (toml && toml.length > 0) {
    // neoforge 特征：neoforge.mods.toml / 依赖 neoforge / loaderVersion [1,) 风格（NeoForge 个位数下限）
    if (/neoforge\.mods\.toml|modId\s*=\s*"neoforge"|loaderVersion\s*=\s*"\[\d,/.test(toml)) return "neoforge";
    // javafml：loaderVersion [44,) 风格（Forge 两位数下限）
    if (/modLoader\s*=\s*"javafml"|loaderVersion\s*=\s*"\[44,/.test(toml)) return "forge";
  }
  if (/fabric-loom|fabric-api/i.test(buildGradle)) return "fabric";
  if (/neogradle|neoforge/i.test(buildGradle)) return "neoforge";
  if (/forge|minecraftforge/i.test(buildGradle)) return "forge";
  return "unknown";
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
    const keywords = [...entry.modIds, ...(CATALOG_ALIASES[entry.id] ?? [])].filter((k) => k.length > 0);
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
  if (loader === "fabric" && hasKeyword(text, "trinkets")) {
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
): Record<string, unknown> {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const detectedLoader = detectLoader(buildGradle, modsToml, fabricModJson, neoModsToml);
  const text = [buildGradle, modsToml, fabricModJson, neoModsToml].filter((s) => s).join("\n");

  // ── 保留并增强原有启发式 ────────────────────────────────────────────────
  if (!/minecraft|forge|neoforge|fabric/i.test(buildGradle)) {
    issues.push("build.gradle 未检测到 minecraft/loader 依赖");
  }
  if ((detectedLoader === "forge" || /forge/i.test(buildGradle)) && modsToml && !/modLoader\s*=\s*"javafml"/i.test(modsToml)) {
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
  if (detectedLoader === "fabric" && hasKeyword(text, "curios") && !hasKeyword(text, "trinkets")) {
    suggestions.push("curios_on_fabric：Fabric 上检测到 Curios 依赖——Curios 无 Fabric 版，Fabric 饰品标准是 Trinkets");
  }
  // cloth_frozen：Cloth Config 已冷冻，新模组语境 → 建议 YACL/Fzzy
  if (hasKeyword(text, "cloth-config") || hasKeyword(text, "cloth_config")) {
    suggestions.push("cloth_frozen：Cloth Config 已冷冻（维护停滞），新模组可考虑 YACL / Fzzy Config");
  }

  return {
    ok: issues.length === 0,
    detectedLoader,
    issues,
    suggestions,
    detectedLibraries,
    loaderConflicts,
    traps,
    relatedTools: ["diagnose_gradle", "analyze_porting_path", "search_community_docs"],
  };
}
