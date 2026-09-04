import { readFileSync, existsSync, writeFileSync, mkdirSync, unlinkSync, renameSync, rmdirSync } from "fs";
import { join, relative, basename, dirname, resolve as pathResolve, sep } from "path";
import { fileURLToPath } from "url";
import { resolveDataDir } from "../utils/path.js";
import { resolveProjectPath, ProjectPathError, assertWritablePath, assertCreatableDir, getAllowRootReal } from "../utils/project-sandbox.js";
import { parseGradleProperties } from "../gradle/index.js";
import { detectLoader } from "../diagnostics/index.js";
import { isKnowledgeRepo } from "../platform-pack/write.js";
import { walkDirBounded, javaSourceRoots } from "../utils/project-files.js";
import { analyzePortingPathSchema, portProjectSchema } from "./types.js";
import { parseMinecraftVersion } from "../decompile/version-manager.js";
import { classifyMinecraftVersion, isExactMcVersionToken, isMcVersionFamily } from "../utils/minecraft-version.js";
import { versionRequiredAction } from "../utils/actionable.js";
import type {
  AnalyzePortingOutput,
  AnalyzePortingError,
  PlatformEvidence,
  PortingStats,
  RiskAssessment,
  CurrentInfo,
  TargetInfo,
  FileCandidate,
  ExtractCommonOutput,
  InitArchitecturyOutput,
  ApplyMigrationOutput,
  QueryApiSuggestion,
  NextStep,
} from "./types.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// ── 知识库加载 ──────────────────────────────────────────────────────────────

function loadVersionsKB(): Record<string, unknown> {
  const kbPath = resolveDataDir("porting/knowledge-base/versions.json");
  try {
    return JSON.parse(readFileSync(kbPath, "utf-8"));
  } catch (err) {
    console.error(`[porting] FAILED to load versions KB at ${kbPath}:`, (err as Error).message);
    return { versions: {}, _loadError: String((err as Error).message), _path: kbPath };
  }
}

function loadArchitecturyPatterns(): Record<string, unknown> {
  const kbPath = resolveDataDir("porting/architectury-patterns.json");
  try {
    return JSON.parse(readFileSync(kbPath, "utf-8"));
  } catch (err) {
    console.error(`[porting] FAILED to load architectury patterns at ${kbPath}:`, (err as Error).message);
    return { _loadError: String((err as Error).message), _path: kbPath };
  }
}

// ── 文件系统工具 ────────────────────────────────────────────────────────────

function walkDir(dir: string, patterns: string[]): string[] {
  const all = walkDirBounded(dir, { maxDepth: 16, allFiles: true });
  return all.filter((full) => {
    const name = basename(full);
    return patterns.some((pat) => globNameMatch(name, pat));
  });
}

function globNameMatch(name: string, pat: string): boolean {
  if (!pat.includes("*") && !pat.includes("?")) return name.endsWith(pat) || name === pat;
  const re = new RegExp(
    "^" +
      pat
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".") +
      "$",
    "i",
  );
  return re.test(name);
}

/** 回滚时删掉本次 mkdir 留下的空目录，停在工程根（B-18）。 */
function pruneEmptyParents(fileAbs: string, projectRoot: string): void {
  const pathsEqual = (a: string, b: string) => {
    const ra = pathResolve(a);
    const rb = pathResolve(b);
    return process.platform === "win32" ? ra.toLowerCase() === rb.toLowerCase() : ra === rb;
  };
  const isUnderRoot = (dir: string, root: string) => {
    const d = pathResolve(dir);
    const r = pathResolve(root);
    if (pathsEqual(d, r)) return true;
    const prefix = (process.platform === "win32" ? r.toLowerCase() : r) + sep;
    const probe = process.platform === "win32" ? d.toLowerCase() : d;
    return probe.startsWith(prefix);
  };
  let dir = dirname(fileAbs);
  const stop = pathResolve(projectRoot);
  while (dir && isUnderRoot(dir, stop) && !pathsEqual(dir, stop)) {
    try {
      rmdirSync(dir);
    } catch {
      break;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
}

export function javaForMcVersion(ver: string): number | undefined {
  const vi = parseMinecraftVersion(ver);
  const major = vi.major;
  const minor = vi.minor;
  const patch = vi.patch ?? 0;
  if (!vi.valid && major === 0 && minor === 0) return undefined;
  // 26.x / 27.x / 1.21.11+
  if (major >= 26) return 25;
  if (major === 1) {
    if (minor > 21 || (minor === 21 && patch >= 11)) return 25;
    if (minor === 21) return 21;
    if (minor === 20 && patch >= 5) return 21;
    if (minor >= 18 && minor <= 20) return 17;
    if (minor === 17) return 16;
    if (minor <= 16) return 8;
  }
  return undefined;
}

function collectJavaKtSources(root: string): string[] {
  const files: string[] = [];
  for (const srcRoot of javaSourceRoots(root)) {
    files.push(...walkDir(srcRoot, [".java", ".kt"]));
  }
  return [...new Set(files)];
}

function inferCurrentPlatform(root: string): string {
  const gradle =
    readContent(join(root, "build.gradle")) + "\n" + readContent(join(root, "build.gradle.kts"));
  const modsToml =
    readContent(join(root, "src/main/resources/META-INF/mods.toml")) ||
    readContent(join(root, "common/src/main/resources/META-INF/mods.toml"));
  const neoToml =
    readContent(join(root, "src/main/resources/META-INF/neoforge.mods.toml")) ||
    readContent(join(root, "neoforge/src/main/resources/META-INF/neoforge.mods.toml"));
  const fabricJson =
    readContent(join(root, "src/main/resources/fabric.mod.json")) ||
    readContent(join(root, "fabric/src/main/resources/fabric.mod.json"));
  const detected = detectLoader(gradle, modsToml, fabricJson, neoToml);
  if (detected === "liteloader_forge") return "liteloader";
  return detected;
}

function readContent(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function atomicWriteUtf8(file: string, content: string): void {
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, content, "utf-8");
  try {
    renameSync(tmp, file);
  } catch (err) {
    try {
      if (existsSync(tmp)) unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    throw err;
  }
}

function pathRel(projectRoot: string, filePath: string): string {
  return relative(projectRoot, filePath).replace(/\\/g, "/");
}

function readAddonManifestIfValid(filePath: string): string {
  const text = readContent(filePath);
  if (text && /"format_version"/.test(text) && /"modules"/.test(text)) return text;
  return "";
}

// ── 平台推断 ────────────────────────────────────────────────────────────────

function inferPlatform(evidence: PlatformEvidence): { platform: string; ambiguous: boolean } {
  const entries = (Object.entries(evidence) as [string, number][])
    .sort((a, b) => b[1] - a[1]);
  const [top, second] = entries;

  if (!top || top[1] === 0) {
    return { platform: "unknown", ambiguous: true };
  }

  const ambiguous = second !== undefined && second[1] > 0 && top[1] < second[1] * 2;
  return { platform: top[0], ambiguous };
}

/** 从 build.gradle / 元数据累加平台证据（无 Java 源码时仍可识别）。 */
function addBuildMetadataEvidence(
  evidence: PlatformEvidence,
  files: {
    buildGradle: string;
    buildGradleKts: string;
    settingsGradle: string;
    gradleProps: string;
    modsToml: string;
    neoforgeModsToml: string;
    fabricJson: string;
    quiltJson?: string;
  },
): void {
  const build = [
    files.buildGradle,
    files.buildGradleKts,
    files.settingsGradle,
    files.gradleProps,
  ].join("\n");

  // NeoForge（先于 Forge，避免 net.minecraftforge 子串误伤已迁移项目）
  if (
    /net\.neoforged/.test(build) ||
    /neoforged\.gradle/.test(build) ||
    /['"]net\.neoforged:/.test(build) ||
    /\bneoforge\s*['":=]/.test(build) ||
    files.neoforgeModsToml
  ) {
    evidence.neoforge += 4;
  }

  const riftOrLitePlugin =
    /net\.minecraftforge\.gradle\.tweaker-client|RiftLoaderClientTweaker|net\.minecraftforge\.gradle\.liteloader/i.test(
      build,
    );

  // Forge（tweaker-client / liteloader 插件都含 minecraftforge 子串，不可算成纯 Forge）
  if (
    !riftOrLitePlugin &&
    (/net\.minecraftforge/.test(build) ||
      /minecraftforge\.gradle/.test(build) ||
      /['"]net\.minecraftforge:forge:/.test(build))
  ) {
    evidence.forge += 4;
  }
  if (files.modsToml && !files.neoforgeModsToml) {
    evidence.forge += 2;
    if (/modLoader\s*=\s*["']javafml["']/.test(files.modsToml)) {
      evidence.forge += 1;
    }
  }

  // Quilt（须压过 fabric-loom + fabric.mod.json 的 7 分；无 json 仅 loom 时也能赢）
  if (
    /org\.quiltmc\.loom|quilt-loom|quilt\.mod\.json/.test(build) ||
    files.quiltJson
  ) {
    evidence.quilt += 8;
  }

  // Fabric
  if (
    /fabric-loom/.test(build) ||
    /net\.fabricmc/.test(build) ||
    /id\s*\(?\s*['"]fabric-loom['"]/.test(build)
  ) {
    evidence.fabric += 4;
  }
  if (files.fabricJson) {
    evidence.fabric += 3;
  }
}

// ── 知识库查询 ──────────────────────────────────────────────────────────────

function queryBreakingChanges(currentVer: string, targetVer: string): {
  breakingChanges: unknown[];
  knowledgeGaps: string[];
  kbLoadError?: string;
} {
  const kb = loadVersionsKB() as {
    versions: Record<string, { breakingChanges?: unknown[] }>;
    _loadError?: string;
  };
  const versions = kb.versions ?? {};

  const breakingChanges: unknown[] = [];
  const knowledgeGaps: string[] = [];
  if (kb._loadError) {
    return { breakingChanges, knowledgeGaps, kbLoadError: kb._loadError };
  }

  const keys = Object.keys(versions);
  const lo = parseMinecraftVersion(currentVer);
  const hi = parseMinecraftVersion(targetVer);
  const inRange = (key: string): boolean => {
    if (key === currentVer || key === targetVer) return true;
    if (currentVer === "unknown" || !lo.valid || !hi.valid) return false;
    const k = parseMinecraftVersion(key);
    if (!k.valid) return false;
    const a = lo.major * 1e6 + lo.minor * 1e3 + (lo.patch ?? 0);
    const b = hi.major * 1e6 + hi.minor * 1e3 + (hi.patch ?? 0);
    const c = k.major * 1e6 + k.minor * 1e3 + (k.patch ?? 0);
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return c >= min && c <= max;
  };

  if (currentVer !== "unknown" && !versions[currentVer]) {
    knowledgeGaps.push(currentVer);
  }
  if (!versions[targetVer]) {
    knowledgeGaps.push(targetVer);
  }

  const seen = new Set<string>();
  for (const key of keys) {
    if (!inRange(key)) continue;
    for (const item of versions[key]?.breakingChanges ?? []) {
      const sig = JSON.stringify(item);
      if (seen.has(sig)) continue;
      seen.add(sig);
      breakingChanges.push(item);
    }
  }

  return { breakingChanges, knowledgeGaps };
}

// ── 风险评估 ────────────────────────────────────────────────────────────────

function assessRisk(stats: PortingStats, currentPlatform: string, targetPlatform: string): RiskAssessment {
  const quiltFabricPair =
    (currentPlatform === "quilt" && targetPlatform === "fabric") ||
    (currentPlatform === "fabric" && targetPlatform === "quilt");
  const crossPlatform = currentPlatform !== targetPlatform && !quiltFabricPair;

  const registryLevel = crossPlatform ? "medium" : "low";
  const eventsLevel = crossPlatform ? "medium" : "low";
  const networkLevel = stats.networkUsages > 5 ? "high" : stats.networkUsages > 0 ? "medium" : "low";
  const mixinLevel = stats.mixinConfigs > 0 ? "medium" : "low";
  const configLevel = crossPlatform ? "medium" : "low";

  return {
    registry: { level: registryLevel, affectedFiles: stats.registryCalls, reason: "跨平台注册方式存在差异" },
    events: { level: eventsLevel, affectedFiles: stats.eventSubscriptions, reason: "事件订阅模式可能需要调整" },
    network: {
      level: networkLevel,
      affectedFiles: stats.networkUsages,
      reason:
        networkLevel === "low"
          ? "当前工程未检测到或仅有少量网络层用法"
          : "网络层 API 各平台差异较大，跨平台时需重写发包",
    },
    mixin: { level: mixinLevel, affectedFiles: stats.mixinConfigs, reason: "Mixin 配置必须在各 loader 子工程分别维护" },
    config: { level: configLevel, affectedFiles: 1, reason: "建议使用 Forge Config API Port 实现跨平台统一配置" },
  };
}

// ── routeSteps / nextSteps 生成 ────────────────────────────────────────────
// routeSteps 是对外契约里的自然语言清单（string[]，见 README「analyze_porting_path」）；
// nextSteps 才承载机器可读交接，且 args 必须**可直接调用**：
//   · search_docs 必填 platform + version + query（search_forge_docs 根本没有 platform 参数）
//   · port_project 必填 projectPath + action；init_architectury 还需 neoforgeVersion，缺省会被拒
//   · get_migration_guide 的 route 必须是 "1.20.1->1.21.1" / "forge->neoforge" 形态
// 必填参数拿不到时退化为纯文本步骤，不挂一个必然失败的 tool。

interface RouteCtx {
  isArchitectury: boolean;
  ambiguous: boolean;
  currentPlatform: string;
  targetPlatform: string;
  needCrossPlatform: boolean;
  /** 已解析的项目根，port_project 直接可用 */
  root: string;
  mcVersion: string | null;
  targetVer: string;
  /** 版本 KB 里的 NeoForge 版本；缺省则 init_architectury 只给文本步骤 */
  neoforgeVersion?: string;
}

function buildRoutePlan(ctx: RouteCtx): { routeSteps: string[]; nextSteps: NextStep[] } {
  const routeSteps: string[] = [];
  const nextSteps: NextStep[] = [];
  const add = (text: string, tool?: string, args?: Record<string, unknown>): void => {
    routeSteps.push(text);
    nextSteps.push(tool && args ? { text, tool, args } : { text });
  };

  if (ctx.ambiguous) {
    add(`当前平台证据不足，已按 targetPlatform=${ctx.targetPlatform} 规划`);
  }

  const forgeToNeo = ctx.currentPlatform === "forge" && ctx.targetPlatform === "neoforge";
  if (forgeToNeo) {
    add(
      "执行 forge→neoforge 包名迁移（port_project action=apply_version_migration，先 dryRun）",
      "port_project",
      {
        projectPath: ctx.root,
        action: "apply_version_migration",
        targetPlatform: "neoforge",
        dryRun: true,
      },
    );
  } else {
    add(
      "按本档 search_*_docs 做 MC 版本 API 迁移（apply_version_migration 仅用于 forge→neoforge 包名，同平台升级不要调用）",
      "search_docs",
      {
        platform: ctx.targetPlatform,
        version: ctx.targetVer,
        query: "migration breaking changes",
      },
    );
    // route 需要两端版本号；缺当前版本就只留文本，别发一个 schema 通不过的调用
    const route = ctx.mcVersion ? `${ctx.mcVersion}->${ctx.targetVer}` : null;
    add(
      "同平台升级可配合 get_migration_guide（不要对同平台升级调用 apply_version_migration）",
      route ? "get_migration_guide" : undefined,
      route ? { route, platform: ctx.targetPlatform } : undefined,
    );
  }

  if (ctx.isArchitectury && !ctx.needCrossPlatform) return { routeSteps, nextSteps };

  if (!ctx.isArchitectury && ctx.needCrossPlatform) {
    add(
      "初始化 MultiLoader 项目结构（调用 port_project action=init_architectury）",
      ctx.neoforgeVersion ? "port_project" : undefined,
      ctx.neoforgeVersion
        ? {
            projectPath: ctx.root,
            action: "init_architectury",
            targetPlatform: ctx.targetPlatform,
            neoforgeVersion: ctx.neoforgeVersion,
            dryRun: true,
          }
        : undefined,
    );
    add(
      "从当前源码提取 common 模块候选（调用 port_project action=extract_common：仅静态分析，不搬文件）",
      "port_project",
      { projectPath: ctx.root, action: "extract_common", dryRun: true },
    );
    add("通过 @ExpectPlatform 抽象 Registry 层（根据 extract_common 输出人工处理）");
    add("拆分 Mixin 配置到 fabric/ 和 neoforge/ 子工程（Agent 手动处理）");
    // 骨架固定生成 common/ + fabric/ + neoforge/，但本次移植真正要编译的是 targetPlatform
    // 那一块；把两端都列出来等于让 fabric 目标去验一个他没要的 neoforge 模块。
    // quilt 归 fabric/：骨架没有 quilt/ 子工程，QSL 跑在 Loom 的 fabric 模块上。
    const verifyModule =
      ctx.targetPlatform === "neoforge"
        ? "neoforge"
        : ctx.targetPlatform === "fabric" || ctx.targetPlatform === "quilt"
          ? "fabric"
          : null;
    if (verifyModule) add(`验证 ${verifyModule}/ 模块编译通过`);
    else add(`验证目标端（${ctx.targetPlatform}）子工程编译通过`);
    return { routeSteps, nextSteps };
  }

  if (!ctx.isArchitectury && !ctx.needCrossPlatform) return { routeSteps, nextSteps };

  add("分析完成，请根据上述报告人工决定下一步");
  return { routeSteps, nextSteps };
}

// ── query_api 建议 ─────────────────────────────────────────────────────────

/**
 * 「MC 26 及以上」单一判定（V-8/9/11 收口：原先在本文件被逐字写三遍）。
 * 为什么不塌进 classifyMinecraftVersion / isMcVersionFamily：五档实测
 * 1.20.4 / 1.21.11 / 26.1 / 26.1.1 / 27.1.1 上，`cls(v)==="26.x"` 与 `fam(v,"26.1")`
 * 在 **27.1.1 上为 false，而旧式为 true**（classifyMinecraftVersion 无 27.x band，
 * 27.x → "other"）。为不改行为，这里保留「token 门 + 主版本数值比较」，
 * token 门交给既有 isExactMcVersionToken。
 * 可证冗余：`fam(v,"26.1")` 成立 ⇒ `isExactMcVersionToken(v)` 成立且主版本 26，
 * 已被 `major >= 26` 覆盖，故删掉该前置段对任何输入结果不变。
 */
function isMcVersion26OrAbove(version: string): boolean {
  if (!isExactMcVersionToken(version)) return false;
  return Number(version.trim().split(".")[0]) >= 26;
}

function buildQuerySuggestions(targetVersion: string, targetPlatform: string | undefined) {
  const suggestions: QueryApiSuggestion[] = [];

  if (targetPlatform === "neoforge") {
    suggestions.push({
      action: "search_neoforge_docs",
      query: "DeferredRegister Dist",
      version: targetVersion,
      reason: "NeoForge 特有 API 请用 search_neoforge_docs；query_api 无 NeoForge 类索引",
    });
    if (isMcVersion26OrAbove(targetVersion)) {
      suggestions.push({
        action: "search_neoforge_docs",
        query: "ItemStack",
        version: targetVersion,
        reason: "26.1+ 无 Parchment api-index，ItemStack 等变更请查 NeoForge 文档",
      });
    }
    return suggestions;
  }

  if (isMcVersion26OrAbove(targetVersion)) {
    suggestions.push({
      action: "search_neoforge_docs",
      query: "ItemStack",
      version: targetVersion,
      reason: "26.1+ 无 Parchment api-index，请用 search_neoforge_docs，不要 query_api",
    });
    suggestions.push({
      action: "search_fabric_docs",
      query: "ItemStack",
      version: targetVersion === "26.1" ? "26.1.2" : targetVersion,
      reason: "26.1+ Vanilla 签名请 search_fabric_docs（先 list_fabric_versions），不要 query_api",
    });
  }

  return suggestions;
}

// ── 参考链接 ───────────────────────────────────────────────────────────────

function buildReferenceLinks(platform: string, version: string): Array<{ title: string; url: string }> {
  const links: Array<{ title: string; url: string }> = [
    { title: "Architectury NeoForge 迁移教程", url: "https://docs.architectury.dev/api/migration/neoforge" },
    { title: "MultiLoader 模板", url: "https://github.com/jaredlll08/MultiLoader-Template" },
    { title: "Architectury @ExpectPlatform", url: "https://docs.architectury.dev/plugin/expect_platform" },
  ];
  if (platform === "neoforge" || platform === "forge") {
    links.unshift({ title: "NeoForge 1.20.2 发布说明", url: "https://neoforged.net/news/20.2release/" });
  }
  // 目标版本 26 及以上（含 27.x，实测旧式即如此）附带 26.1 链接
  const v = version.trim();
  if (isMcVersion26OrAbove(v)) {
    links.push({ title: "Fabric 移植索引（线上当前多为 26.1→26.2）", url: "https://docs.fabricmc.net/develop/porting/index" });
    links.push({ title: "NeoForge Primer 26.1", url: "https://docs.neoforged.net/primer/docs/26.1/" });
    if (isMcVersionFamily(v, "26.2")) {
      links.push({ title: "NeoForge Primer 26.2", url: "https://docs.neoforged.net/primer/docs/26.2/" });
      links.push({ title: "Fabric API 26.2 概述", url: "https://fabricmc.net/2026/06/15/262.html" });
    }
  }
  if (platform === "fabric") {
    links.push({ title: "Fabric Wiki", url: "https://fabricmc.net/wiki/" });
    links.push({ title: "Yarn 映射浏览", url: "https://linkie.shedaniel.dev/mappings" });
    if (isMcVersionFamily(v, "1.20")) {
      links.push({ title: "Fabric Docs", url: "https://docs.fabricmc.net/" });
    }
  }
  return links;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 1: analyze_porting_path
// ─────────────────────────────────────────────────────────────────────────────

/** D-4：LL/Rift/ModLoader/Bedrock 无脚手架，但给出人工升级路径分析笔记。 */
function buildUpgradeNotes(currentPlatform: string, targetPlatform: string) {
  const notes: Record<string, string[]> = {
    liteloader: [
      "LiteLoader 1.12.2 → Forge 1.12.2：LiteMod/BaseMod 事件改为 Forge @SubscribeEvent；litemod.json 元数据改写为 mods.toml（modLoader=\"javafml\"）。",
      "混合工程（liteloader_forge）先拆分：Forge 侧保留 mods.toml，LiteLoader 功能逐个迁到 Forge 事件后移除 litemod.json。",
    ],
    rift: [
      "Rift 1.13.2 → Forge 1.13.2：riftmod.json 的 listeners 入口改写为 Forge @Mod + @EventHandler 生命周期；Rift 生命周期钩子无 1:1 对应，逐个对照 forge/1.13.2 档核实。",
      "Rift 已停更且仅支持 1.13.2；如需新版本特性，直接评估重写为 Fabric/NeoForge 而非原地移植。",
    ],
    modloader: [
      "Risugami's ModLoader 1.6.4 → Forge 1.7.10：BaseMod 钩子改为 @Mod 类 + @EventHandler；ModLoader.addRecipe 改为 GameRegistry.addRecipe；无自动路线，逐 API 对照 modloader/1.6.4 safe-api.md 与 forge/1.7.10 档。",
    ],
    bedrock: [
      "基岩 Add-On 升级路径：manifest.json format_version 1→2（module 结构不变）；script 模块从 legacy ClientServerModule 迁到 Script API（@minecraft/server）；实验性 API 用 validate_addon_manifest 校验后再上商店。",
    ],
  };
  const out: { platform: string; notes: string[]; scope: string }[] = [];
  for (const p of [currentPlatform, targetPlatform]) {
    if (notes[p]) out.push({ platform: p, notes: notes[p], scope: "仅分析笔记；port_project 不提供这两个平台的脚手架" });
  }
  return out;
}

export async function analyzePortingPath(args: unknown) {
  const parsed = analyzePortingPathSchema.safeParse(args);
  if (!parsed.success) {
    const err: AnalyzePortingError = {
      ok: false,
      error: { code: "INVALID_INPUT", message: parsed.error.message },
    };
    return JSON.stringify(err);
  }

  const { targetPlatform: userTargetPlatform, targetVersion: userTargetVersion } = parsed.data;
  if (userTargetVersion && !isExactMcVersionToken(userTargetVersion)) {
    const e: AnalyzePortingError = {
      ok: false,
      error: { code: "INVALID_INPUT", message: `targetVersion 必须是精确 MC 版本 token，收到 ${userTargetVersion}` },
    };
    return JSON.stringify(e);
  }
  let root: string;
  try {
    root = resolveProjectPath(parsed.data.projectPath, false);
  } catch (err) {
    if (err instanceof ProjectPathError) {
      const e: AnalyzePortingError = {
        ok: false,
        error: { code: err.code, message: err.message },
      };
      return JSON.stringify(e);
    }
    throw err;
  }
  if (!existsSync(root)) {
    const e: AnalyzePortingError = {
      ok: false,
      error: { code: "PATH_NOT_FOUND", message: `项目路径不存在：${root}` },
    };
    return JSON.stringify(e);
  }

  // 1. 解析构建配置
  const buildGradle = readContent(join(root, "build.gradle"));
  const buildGradleKts = readContent(join(root, "build.gradle.kts"));
  const settingsGradle = readContent(join(root, "settings.gradle"));
  const gradleProps = readContent(join(root, "gradle.properties"));
  const props = parseGradleProperties(gradleProps);

  // 提取 MC 版本
  let mcVersion: string | null = null;
  let platformVersion: string | null = null;
  let mappings: string | null = null;

  const mcMatch =
    buildGradle.match(/minecraft\s*\(\s*["']([^"']+)["']\s*\)/) ??
    buildGradle.match(/minecraft\s+["']([^"']+)["']/) ??
    buildGradleKts.match(/minecraft\s*\(\s*["']([^"']+)["']\s*\)/) ??
    buildGradleKts.match(/minecraft\s+["']([^"']+)["']/);
  if (mcMatch) {
    const raw = mcMatch[1];
    // FG style: net.minecraftforge:forge:1.20.1-47.2.0 → 1.20.1
    const verFromCoord = raw.match(/:(\d+\.\d+(?:\.\d+)?)(?:-|:|$)/);
    mcVersion = verFromCoord?.[1] ?? (/^\d+\.\d+/.test(raw) ? raw : null);
  }
  if (!mcVersion && props.minecraft_version) mcVersion = props.minecraft_version;

  const forgeMatch =
    buildGradle.match(/['"]net\.minecraftforge:forge:[^'"]+-(\d+\.\d+\.\d+)['"]/) ??
    buildGradle.match(/forge\s*['":=]+(\d+\.\d+\.\d+)/) ??
    buildGradle.match(/neoforge\s*['":=]+(\d+\.\d+(?:\.\d+)?)/);
  if (forgeMatch) platformVersion = forgeMatch[1];
  if (!platformVersion && props.forge_version) platformVersion = props.forge_version;
  if (!platformVersion && props.neoforge_version) platformVersion = props.neoforge_version;

  const mappingsMatch =
    buildGradle.match(/mappings\s+["']([^"']+)["']/) ??
    buildGradleKts.match(/mappings\s+["']([^"']+)["']/) ??
    buildGradle.match(/mappings\s+channel\s*:\s*['"]([^'"]+)['"]/) ??
    buildGradleKts.match(/mappings\s*\{\s*channel\s*=\s*['"]([^'"]+)['"]/) ??
    buildGradle.match(/mappings\s*\{[^}]*channel\s*:\s*['"]([^'"]+)['"]/) ??
    gradleProps.match(/mappings\s*=\s*(.+)/);
  if (mappingsMatch) mappings = mappingsMatch[1].trim();
  if (!mappings && props.mapping_channel) mappings = props.mapping_channel;

  // 检查是否已有 Architectury
  const isArchitectury =
    settingsGradle.includes("architectury") ||
    buildGradle.includes("architectury-plugin") ||
    buildGradleKts.includes("architectury");

  // 2. 解析元数据
  let modId: string | null = null;
  const modsToml = readContent(join(root, "src/main/resources/META-INF/mods.toml"));
  const neoforgeModsToml = readContent(join(root, "src/main/resources/META-INF/neoforge.mods.toml"));
  const fabricJson = readContent(join(root, "src/main/resources/fabric.mod.json"));
  const quiltJson = readContent(join(root, "src/main/resources/quilt.mod.json"));
  const litemodJson = readContent(join(root, "src/main/resources/litemod.json"));
  const riftmodJson =
    readContent(join(root, "src/main/resources/riftmod.json")) ||
    readContent(join(root, "src/main/resources/rift.mod.json"));

  if (quiltJson) {
    try {
      const parsed = JSON.parse(quiltJson);
      modId = parsed.quilt_loader?.id ?? parsed.id ?? modId;
    } catch {
      // ignore
    }
  }
  if (!modId && fabricJson) {
    try {
      const parsed = JSON.parse(fabricJson);
      modId = parsed.id ?? null;
    } catch {
      // ignore
    }
  }
  if (!modId && (modsToml || neoforgeModsToml)) {
    const idMatch =
      (modsToml + neoforgeModsToml).match(/modId\s*=\s*["']([^"']+)["']/) ??
      (modsToml + neoforgeModsToml).match(/\bid\s*=\s*["']([^'"]+)["']/);
    if (idMatch) modId = idMatch[1];
  }
  if (modId === "${mod_id}" || modId === "${modId}") {
    modId = props.mod_id ?? props.modId ?? null;
  }
  if (!modId && (props.mod_id || props.modId)) {
    modId = props.mod_id ?? props.modId ?? null;
  }

  const bedrockManifest =
    readAddonManifestIfValid(join(root, "manifest.json")) ||
    readAddonManifestIfValid(join(root, "BP", "manifest.json")) ||
    readAddonManifestIfValid(join(root, "RP", "manifest.json")) ||
    readAddonManifestIfValid(join(root, "behavior_pack", "manifest.json")) ||
    readAddonManifestIfValid(join(root, "resource_pack", "manifest.json"));

  const hasBuild = Boolean(buildGradle.trim() || buildGradleKts.trim() || settingsGradle.trim());
  const hasMeta = Boolean(
    modsToml.trim() ||
      neoforgeModsToml.trim() ||
      fabricJson.trim() ||
      quiltJson.trim() ||
      litemodJson.trim() ||
      riftmodJson.trim() ||
      bedrockManifest,
  );
  if (!hasBuild && !hasMeta) {
    const e: AnalyzePortingError = {
      ok: false,
      error: {
        code: "NOT_A_MOD_PROJECT",
        message:
          "未识别为模组工程（无 build.gradle / mods.toml / fabric.mod.json / quilt.mod.json / litemod.json / riftmod.json / 基岩 manifest）",
      },
    };
    return JSON.stringify(e);
  }

  // 3. 扫描源码（与 extract_common 同一套 Architectury 多根）
  const javaFiles: string[] = [];
  const kotlinFiles: string[] = [];
  for (const srcRoot of javaSourceRoots(root)) {
    javaFiles.push(...walkDir(join(srcRoot, "main/java"), [".java"]));
    kotlinFiles.push(...walkDir(join(srcRoot, "main/kotlin"), [".kt"]));
  }
  const allSourceFiles = [...javaFiles, ...kotlinFiles];

  let registryCalls = 0;
  let eventSubscriptions = 0;
  let networkUsages = 0;
  let mixinConfigs = 0;
  let clientOnlyAnnotations = 0;
  let hasBaseMod = false;

  const evidence: PlatformEvidence = { forge: 0, fabric: 0, neoforge: 0, quilt: 0 };

  for (const file of allSourceFiles) {
    const content = readContent(file);
    if (!content) continue;

    // 平台证据（import / 注解）
    evidence.forge += (content.match(/import net\.minecraftforge\./g) ?? []).length;
    evidence.forge += (content.match(/@Mod\s*\(/g) ?? []).length;
    evidence.fabric += (content.match(/import net\.fabricmc\./g) ?? []).length;
    evidence.neoforge += (content.match(/import net\.neoforged\./g) ?? []).length;
    evidence.quilt += (content.match(/import org\.quiltmc\./g) ?? []).length;
    if (/extends\s+BaseMod\b/.test(content) && !/net\.minecraftforge|cpw\.mods\.fml/.test(content)) {
      hasBaseMod = true;
    }

    // 统计
    if (/DeferredRegister|RegistryObject|FabricRegistry\.INSTANCE/g.test(content)) registryCalls++;
    if (/@SubscribeEvent|@Environment\(/g.test(content)) eventSubscriptions++;
    if (/SimpleChannel|ClientPlayNetworking|ServerPlayNetworking/g.test(content)) networkUsages++;
    if (/@Mixin\(/g.test(content)) mixinConfigs++;
    if (/@OnlyIn\(Dist\.CLIENT\)/g.test(content)) clientOnlyAnnotations++;
  }

  // 构建/元数据证据：无源码时也能识别平台（gradle / mods.toml / fabric.mod.json）
  addBuildMetadataEvidence(evidence, {
    buildGradle,
    buildGradleKts,
    settingsGradle,
    gradleProps,
    modsToml,
    neoforgeModsToml,
    fabricJson,
    quiltJson,
  });

  // mixin.json 文件
  const mixinFiles = walkDir(root, ["mixin*.json"]);
  mixinConfigs = Math.max(mixinConfigs, mixinFiles.length);

  const stats: PortingStats = {
    javaFiles: javaFiles.length,
    kotlinFiles: kotlinFiles.length,
    registryCalls,
    eventSubscriptions,
    networkUsages,
    mixinConfigs,
    clientOnlyAnnotations,
  };

  // 4. 平台推断（与 check_dependencies 同一套 detectLoader，避免 tweaker-client 被收成 Forge）
  const { platform: inferredPlatform, ambiguous } = inferPlatform(evidence);
  const gradleBlob = [buildGradle, buildGradleKts, settingsGradle].join("\n") +
    (hasBaseMod ? "\npublic class mod_PortingDetect extends BaseMod {}\n" : "");
  const detected = detectLoader(gradleBlob, modsToml, fabricJson, neoforgeModsToml, {
    quiltModJson: quiltJson,
    litemodJson,
    riftmodJson,
    addonManifest: bedrockManifest,
  });
  let currentPlatform: string = detected === "liteloader_forge" ? "liteloader" : detected;
  if (currentPlatform === "unknown") {
    if (litemodJson.trim() || /LiteMod|litemod\.json/i.test(gradleBlob)) currentPlatform = "liteloader";
    else currentPlatform = inferredPlatform;
  }

  const UNSUPPORTED_PORT = new Set(["liteloader", "rift", "modloader", "bedrock"]);
  const targetPlatform = userTargetPlatform;

  if (UNSUPPORTED_PORT.has(currentPlatform) || UNSUPPORTED_PORT.has(targetPlatform)) {
    const portPlat = UNSUPPORTED_PORT.has(targetPlatform) ? targetPlatform : currentPlatform;
    const e: AnalyzePortingError = {
      ok: false,
      error: {
        code: "UNSUPPORTED_PORT",
        message: `不支持自动移植 ${currentPlatform} → ${targetPlatform}。基岩 / LiteLoader / Rift / ModLoader 只提供升级路径分析笔记，不改工程（port_project 无脚手架）。`,
        hint:
          currentPlatform === "rift" && targetPlatform === "fabric"
            ? "Rift→Fabric 可手写移植笔记；port_project 保持 dryRun，无现成模板则只输出路线。"
            : UNSUPPORTED_PORT.has(currentPlatform) && UNSUPPORTED_PORT.has(targetPlatform)
              ? `不支持自动移植 ${currentPlatform} → ${targetPlatform}。请同时查阅当前端 ${currentPlatform} 与目标端 ${targetPlatform} 规则树；Quilt↔Fabric 才视为低风险自动路线。`
              : "请改用对应平台规则树；Quilt↔Fabric 才视为低风险自动路线。",
        next: [
          UNSUPPORTED_PORT.has(currentPlatform) &&
          UNSUPPORTED_PORT.has(targetPlatform) &&
          currentPlatform !== targetPlatform
            ? `读 ${currentPlatform} 与 ${targetPlatform} 档 AGENTS.md；activate_platform_pack action=session --platform=${currentPlatform} 以及 --platform=${targetPlatform}`
            : `读 ${portPlat} 档 AGENTS.md；activate_platform_pack action=session --platform=${portPlat}`,
          UNSUPPORTED_PORT.has(currentPlatform) &&
          UNSUPPORTED_PORT.has(targetPlatform) &&
          currentPlatform !== targetPlatform
            ? `search_docs({platform:"${currentPlatform}"}) 与 search_docs({platform:"${targetPlatform}"})`
            : `search_docs({platform:"${portPlat}"})`,
          portPlat === "rift" || currentPlatform === "rift"
            ? "Rift→Fabric 只出笔记，port_project 保持 dryRun"
            : "不要对基岩 / LiteLoader / Rift / ModLoader 自动改工程",
        ],
      },
    };
    (e as AnalyzePortingError & { upgradePath?: unknown }).upgradePath = buildUpgradeNotes(
      currentPlatform,
      targetPlatform,
    );
    return JSON.stringify(e, null, 2);
  }
  const needCrossPlatform =
    currentPlatform !== targetPlatform &&
    !(
      (currentPlatform === "quilt" && targetPlatform === "fabric") ||
      (currentPlatform === "fabric" && targetPlatform === "quilt")
    );

  // 6. 知识库查询
  const targetVer = userTargetVersion ?? mcVersion;
  if (!targetVer) {
    const e: AnalyzePortingError = {
      ok: false,
      error: {
        code: "TARGET_VERSION_REQUIRED",
        message: "未指定 targetVersion，且未能从工程探测到 mcVersion，禁止静默默认 1.20.4。",
        hint: "请传入 targetVersion（如 1.20.4 / 1.21.1）。",
      },
    };
    return JSON.stringify(e, null, 2);
  }
  const currentVer = mcVersion ?? "unknown";
  const { knowledgeGaps, breakingChanges, kbLoadError } = queryBreakingChanges(currentVer, targetVer);
  if (kbLoadError) {
    const e: AnalyzePortingError = {
      ok: false,
      error: {
        code: "KNOWLEDGE_BASE_UNAVAILABLE",
        message: `porting 知识库加载失败: ${kbLoadError}`,
        hint: "检查 data/porting/knowledge-base/versions.json；不要把空 breakingChanges 当成「无风险」。",
      },
    };
    return JSON.stringify(e, null, 2);
  }

  // 7. 风险评估
  const riskAssessment = assessRisk(stats, currentPlatform, targetPlatform);

  // 8. 动态生成 routeSteps（+ 可执行的 nextSteps 交接）
  const kb = loadVersionsKB() as { versions?: Record<string, { neoforge?: string; fabric?: string; mappings?: string[]; java?: number }> };
  const targetVersionInfo = kb.versions?.[targetVer];
  const { routeSteps, nextSteps } = buildRoutePlan({
    isArchitectury,
    ambiguous,
    currentPlatform,
    targetPlatform,
    needCrossPlatform,
    root,
    mcVersion,
    targetVer,
    neoforgeVersion: targetVersionInfo?.neoforge,
  });
  if (targetPlatform === "quilt" || currentPlatform === "quilt") {
    const quiltText =
      "Quilt 工程优先 org.quiltmc / QSL；禁止把 net.fabricmc.fabric.api.event.registry 当 QSL 注册";
    routeSteps.push(quiltText);
    nextSteps.push({
      text: quiltText,
      tool: "search_docs",
      args: { platform: "quilt", version: targetVer, query: "QSL registry" },
    });
  }

  // 9. 建议目标信息

  const currentInfo: CurrentInfo = {
    platform: currentPlatform,
    platformEvidence: evidence,
    ambiguous,
    platformVersion,
    mcVersion,
    mappings,
    modId,
    isArchitectury,
    stats,
  };

  const targetInfo: TargetInfo = {
    platform: targetPlatform,
    mcVersion: targetVer,
    mappings:
      targetPlatform === "fabric" || targetPlatform === "quilt"
        ? // V-14：原裸 `/^26\./` → 塌进既有 classifyMinecraftVersion 的 26.x band。
          // 五档实测同值：1.20.4/1.21.11/27.1.1 → false，26.1/26.1.1 → true。
          // 定义域内可证恒等：targetVer 已过上游 isExactMcVersionToken 门，合法 token
          // 只有 1.x[.y] / 26.x[.y] / 27.x[.y]，`^26\.` 命中集 == classify 落到 "26.x" 集。
          // 反例记录：本波一度写成 isMcVersionFamily(targetVer, "26")，**错**——该 helper
          // 要求 family 参数自身也是合法 token，裸 "26" 过不了，结果对任何输入都 false，
          // 由 test-wave-bcd.mjs 的 V-14 五档锁定当场抓到。
          // L-1（本轮改行为）：只认 "26.x" 时 27.x 掉进 else 拿到 "yarn"，而同一 CLI 的
          // convert_mapping --version=27.1.1 实测已返回 UNOBFUSCATED_NO_YARN（判据是
          // mappings/unobfuscated.ts 的 major > 26 ⇒ 27.x 为 true）—— 一处说别用 Yarn、
          // 一处推荐 Yarn，属自相矛盾。取「既有 classify==="26.x" ∪ isMcVersion26OrAbove」
          // 只扩大 mojmap 覆盖面（27.x/28.x 转 mojmap），1.x 与 26.x 结论逐档不变。
          (isMcVersion26OrAbove(targetVer) || classifyMinecraftVersion(targetVer) === "26.x"
            ? "mojmap"
            : "yarn")
        : (targetVersionInfo?.mappings?.[0] ?? mappings ?? null),
    java: targetVersionInfo?.java ?? javaForMcVersion(targetVer) ?? null,
  };

  const output: AnalyzePortingOutput = {
    ok: true,
    analysis: {
      current: currentInfo,
      target: targetInfo,
      knowledgeGaps,
      breakingChanges,
      riskAssessment,
      recommendedRoute:
        currentPlatform === "unknown"
          ? "unrecognized"
          : isArchitectury
            ? "version_migration"
            : needCrossPlatform
              ? "architectury_common_refactor"
              : "version_migration",
      routeSteps,
      nextSteps,
      referenceLinks: buildReferenceLinks(targetPlatform, targetVer),
      queryApiSuggestions: buildQuerySuggestions(targetVer, targetPlatform),
    },
  };

  return JSON.stringify(output, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 2: port_project
// ─────────────────────────────────────────────────────────────────────────────

function safeConfirmed(confirmed: unknown): boolean {
  return confirmed === true;
}

// ── 2a. init_architectury ───────────────────────────────────────────────────

/** KB 模板里唯一的占位符：rootProject.name 必须跟着工程名走。 */
const SETTINGS_GRADLE_TOKEN = "${modId}";

function renderSettingsGradle(lines: unknown[], modId: string): string {
  return lines.map((l) => String(l).split(SETTINGS_GRADLE_TOKEN).join(modId)).join("\n");
}

/**
 * settings.gradle 的单一来源 = KB data/porting/architectury-patterns.json 的 settingsGradle（行数组）。
 * S5 修的形状不匹配：KB 当年写成 `{ content: [...] }`，读取端只认数组，
 * `Array.isArray` 恒 false → KB 从未生效，代码里的 fallback 才是真正的输出。
 * 定口径「数据形状向读取端收敛」：KB 直接是数组，行内唯一占位符 `${modId}` 在这里替换。
 * fallback 只用于 KB 缺失 / MC_SKILL_DATA 指错，且刻意不含 KB 的标记行——
 * test-core 靠那行标记判断文件来自哪一边（清空 KB 必须退回 fallback）。
 */
function generateSettingsGradleContent(modId: string): string {
  const patterns = loadArchitecturyPatterns() as { settingsGradle?: unknown };
  if (Array.isArray(patterns.settingsGradle)) {
    return renderSettingsGradle(patterns.settingsGradle, modId);
  }
  return renderSettingsGradle(
    [
      "pluginManagement {",
      "    repositories {",
      "        maven { url 'https://maven.fabricmc.net/' }",
      "        maven { url 'https://maven.neoforged.net/releases' }",
      "        gradlePluginPortal()",
      "    }",
      "}",
      "",
      "rootProject.name = '${modId}-multiloader'",
      "include 'common'",
      "include 'fabric'",
      "include 'neoforge'",
    ],
    modId,
  );
}

function generateRootBuildGradleContent(mcVersion: string): string {
  return [
    "plugins {",
    "    id 'architectury-plugin' version '3.4'",
    "    id 'dev.architectury.loom' version '3.4'",
    "    id 'com.github.johnrengelman.shadow' version '8.1.1' apply false",
    "}",
    "",
    `ext { minecraft_version = '${mcVersion}' }`,
    "",
    "subprojects {",
    "    apply plugin: 'dev.architectury.loom'",
    "    loom {",
    "        silentMojangMappingsLicense()",
    "    }",
    "    dependencies {",
    "        minecraft \"com.mojang:minecraft:${rootProject.minecraft_version}\"",
    "        mappings loom.layered {",
    "            officialMojangMappings()",
    "            parchment(\"org.parchmentmc.data:parchment-${rootProject.minecraft_version}:2024.01.20@zip\")",
    "        }",
    "    }",
    "}",
  ].join("\n");
}

function generateCommonBuildGradle(modId: string): string {
  return [
    `architectury {`,
    `    common("fabric", "forge", "neoforge") {`,
    `        it.platformPackage "neoforge", "forge"`,
    `    }`,
    `}`,
    "",
    "dependencies {",
    "    modApi 'dev.architectury:architectury:9.2.14'",
    "}",
  ].join("\n");
}

function generateFabricBuildGradle(): string {
  return [
    "architectury { platformSetupLoomIde() fabric() }",
    "",
    "dependencies {",
    "    modApi project(':common')",
    "    modImplementation 'net.fabricmc:fabric-loader:0.15.0'",
    "    modImplementation 'dev.architectury:architectury-fabric:9.2.14'",
    "}",
  ].join("\n");
}

function generateNeoForgeBuildGradle(): string {
  return [
    "architectury { platformSetupLoomIde() neoForge() }",
    "",
    "dependencies {",
    "    modApi project(':common')",
    "    neoForge \"net.neoforged:neoforge:${rootProject.neoforge_version}\"",
    "}",
  ].join("\n");
}

function generateArchitecturyCommonJson(modId: string): string {
  return JSON.stringify({ common: [] }, null, 2);
}

/** 与 buildArchitecturySkeleton 的全部键保持一致（顶层三件 + 子模块五件），缺一即冲突。 */
const ARCHITECTURY_SKELETON_FILES = [
  "build.gradle",
  "settings.gradle",
  "gradle.properties",
  "common/build.gradle",
  "fabric/build.gradle",
  "neoforge/build.gradle",
  join("common/src/main/resources", "architectury.common.json"),
  join("fabric/src/main/resources", "fabric.mod.json"),
];

function checkConflicts(root: string): string[] {
  return ARCHITECTURY_SKELETON_FILES.filter((f) => existsSync(join(root, f)));
}

function buildArchitecturySkeleton(root: string, modId: string, mcVersion: string, neoforgeVersion: string) {
  const files: Record<string, string> = {};

  files["settings.gradle"] = generateSettingsGradleContent(modId);
  files["build.gradle"] = generateRootBuildGradleContent(mcVersion);
  files["gradle.properties"] = `minecraft_version=${mcVersion}\nneoforge_version=${neoforgeVersion}\nloom.platform=fabric\n`;

  files["common/build.gradle"] = generateCommonBuildGradle(modId);
  files["fabric/build.gradle"] = generateFabricBuildGradle();
  files["neoforge/build.gradle"] = generateNeoForgeBuildGradle();
  files[join("common/src/main/resources", "architectury.common.json")] = generateArchitecturyCommonJson(modId);

  // Fabric mod json
  const fabricModJson = {
    schemaVersion: 1,
    id: modId,
    version: "1.0.0",
    name: `${modId} (Fabric)`,
    description: `Fabric platform for ${modId}`,
    entrypoints: {
      main: [`com.example.${modId}.${modId}`],
    },
    depends: { minecraft: `*` },
  };
  files[join("fabric/src/main/resources", "fabric.mod.json")] = JSON.stringify(fabricModJson, null, 2);

  return files;
}

// ── 2b. extract_common ───────────────────────────────────────────────────────

function scanForLoaderCalls(file: string): { calls: string[]; patterns: { pattern: string; lineRange: [number, number] }[] } {
  const content = readContent(file);
  if (!content) return { calls: [], patterns: [] };

  const loaderPatterns = [
    { re: /FabricLoader\.getInstance\(\)/g, label: "FabricLoader.getInstance()" },
    { re: /FabricLoader\.INSTANCE/g, label: "FabricLoader.INSTANCE" },
    { re: /FMLPaths\.GAMEDIR/g, label: "FMLPaths.GAMEDIR" },
    { re: /FMLPaths\.CONFIG/g, label: "FMLPaths.CONFIG" },
    { re: /DistExecutor\.runWhenOn/g, label: "DistExecutor.runWhenOn" },
    { re: /MinecraftForge\.EVENT_BUS/g, label: "MinecraftForge.EVENT_BUS" },
    { re: /net\/neoforged\//g, label: "net.neoforged import" },
    { re: /net[./]minecraftforge[./]/g, label: "net.minecraftforge import" },
    { re: /net\/fabricmc\//g, label: "net.fabricmc import" },
    { re: /EnvType\.CLIENT/g, label: "EnvType.CLIENT" },
    { re: /EnvType\.SERVER/g, label: "EnvType.SERVER" },
  ];

  const calls: string[] = [];
  const patterns: { pattern: string; lineRange: [number, number] }[] = [];
  const lines = content.split("\n");

  for (const { re, label } of loaderPatterns) {
    let match;
    re.lastIndex = 0;
    if (re.test(content)) {
      calls.push(label);
      re.lastIndex = 0;
      const firstLine = lines.findIndex((l) => {
        re.lastIndex = 0;
        return re.test(l);
      });
      if (firstLine >= 0) {
        patterns.push({ pattern: label, lineRange: [firstLine + 1, firstLine + 1] });
      }
    }
    re.lastIndex = 0;
  }

  return { calls, patterns };
}

function determineCandidateStatus(calls: string[]): FileCandidate["status"] {
  if (calls.length === 0) return "safe_to_move";
  const hasCalls = calls.some((c) => !c.includes(" import"));
  if (hasCalls) return "review_required";
  return "has_loader_calls";
}

// ── 2c. apply_version_migration ────────────────────────────────────────────

const PACKAGE_RENAMES: [string, string][] = [
  ["net.minecraftforge", "net.neoforged"],
];

function applyPackageRenames(root: string, dryRun: boolean): {
  renames: { from: string; to: string; affectedFiles: number }[];
  unreviewed: { file: string; reason: string }[];
  modified?: string[];
  rollbackError?: string;
  srcNotFound?: boolean;
} {
  const files = collectJavaKtSources(root).filter((file) => {
    const rel = pathRel(root, file);
    return !rel.startsWith("fabric/") && !rel.startsWith("quilt/");
  });
  if (files.length === 0) {
    return { renames: [], unreviewed: [], modified: [], srcNotFound: true };
  }
  const allowRoot = dryRun ? null : getAllowRootReal();

  const renames: { from: string; to: string; affectedFiles: number }[] = [];
  const unreviewed: { file: string; reason: string }[] = [];

  // 两阶段提交：先在内存中暂存全部替换结果，再统一写盘；
  // 写盘中途失败逆序还原已写文件（镜像 platform-pack/write.ts 的 backups+rollback 模式，F-B04）
  const staged: { file: string; prev: string; next: string }[] = [];
  for (const [from, to] of PACKAGE_RENAMES) {
    let count = 0;
    for (const file of files) {
      const content = readContent(file);
      if (content && content.includes(from)) {
        count++;
        staged.push({ file, prev: content, next: content.replaceAll(from, to) });
      }
    }
    if (count > 0) {
      renames.push({ from, to, affectedFiles: count });
    }
  }

  if (dryRun || !allowRoot) {
    return { renames, unreviewed: unreviewedCandidates(), modified: [] };
  }

  const written: typeof staged = [];
  for (const item of staged) {
    try {
      assertWritablePath(item.file, allowRoot);
      atomicWriteUtf8(item.file, item.next);
      written.push(item);
    } catch (err) {
      let rollbackError: string | undefined;
      const rollbackFailures: string[] = [];
      for (const w of [...written].reverse()) {
        try {
          writeFileSync(w.file, w.prev, "utf-8");
          // 逐文件复验回写结果；失败不中断其余文件的还原，最后聚合报告
          if (readFileSync(w.file, "utf-8") !== w.prev) {
            rollbackFailures.push(`回滚后内容不符: ${w.file}`);
          }
        } catch (rbErr) {
          rollbackFailures.push(`回滚 ${w.file} 失败: ${(rbErr as Error).message}`);
        }
      }
      if (rollbackFailures.length > 0) rollbackError = rollbackFailures.join("; ");
      return {
        renames,
        unreviewed: unreviewedCandidates(),
        modified: [],
        rollbackError:
          `包名替换在第 ${written.length + 1}/${staged.length} 个文件失败（${(err as Error).message}），` +
          `已回滚全部 ${written.length} 个已写文件。` +
          (rollbackError ? `注意：${rollbackError}，请人工 git diff 核对。` : ""),
      };
    }
  }

  return { renames, unreviewed: unreviewedCandidates(), modified: written.map((w) => pathRel(root, w.file)) };
}

function unreviewedCandidates(): { file: string; reason: string }[] {
  return [
    { file: "src/main/java/**/*Registry*.java", reason: "RegistryObject → DeferredHolder 变更（见 data/porting 知识库 / 平台 porting 文档）" },
    { file: "src/main/java/**/*Event*.java", reason: "NeoForge 1.20.2+ 事件总线订阅方式（mod bus / forge bus）" },
  ];
}

// ── 主入口 ─────────────────────────────────────────────────────────────────

export async function portProject(args: unknown) {
  const parsed = portProjectSchema.safeParse(args);
  if (!parsed.success) {
    return JSON.stringify({
      ok: false,
      error: { code: "INVALID_INPUT", message: parsed.error.message },
    });
  }

  const { dryRun = true, confirmed, action, targetPlatform } = parsed.data;
  // 版本串会写进用户工程的 gradle.properties / build.gradle，必须先过 token 门再看 action
  const badVersionToken = (() => {
    const tv = parsed.data.targetVersion?.trim();
    if (tv && !isExactMcVersionToken(tv)) return `targetVersion="${tv}"`;
    const nv = parsed.data.neoforgeVersion?.trim();
    if (nv && !/^\d+\.\d+(\.\d+)?$/.test(nv)) return `neoforgeVersion="${nv}"`;
    return null;
  })();
  if (badVersionToken) {
    return JSON.stringify({
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: `${badVersionToken} 不是合法版本 token：targetVersion 必须是精确 MC 版本（如 1.20.4 / 1.21.1 / 26.1），neoforgeVersion 必须是点分数字版本（如 21.1.113）。`,
        next: versionRequiredAction().nextSteps,
      },
    });
  }

  if (
    targetPlatform === "liteloader" ||
    targetPlatform === "rift" ||
    targetPlatform === "modloader" ||
    targetPlatform === "bedrock"
  ) {
    return JSON.stringify({
      ok: false,
      error: {
        code: "UNSUPPORTED_PORT",
        message: `port_project 不支持目标平台 ${targetPlatform}（仅笔记，不改工程）`,
        next: [
          `读 ${targetPlatform} 档 AGENTS.md；activate_platform_pack action=session --platform=${targetPlatform}`,
          `search_docs({platform:"${targetPlatform}"})`,
          targetPlatform === "rift"
            ? "Rift→Fabric 只出笔记，port_project 保持 dryRun"
            : "不要对基岩 / LiteLoader / Rift / ModLoader 自动改工程",
        ],
      },
    });
  }
  const doWrite = !dryRun && safeConfirmed(confirmed);

  let root: string;
  try {
    root = resolveProjectPath(parsed.data.projectPath, doWrite);
  } catch (err) {
    if (err instanceof ProjectPathError) {
      return JSON.stringify({
        ok: false,
        error: { code: err.code, message: err.message },
      });
    }
    throw err;
  }

  if (isKnowledgeRepo(root)) {
    return JSON.stringify({
      ok: false,
      error: {
        code: "REFUSE_KNOWLEDGE_REPO",
        message: "拒绝写入 MC Skill 知识库根。目标必须是用户模组工程。",
        next: ["port_project 仅用于用户模组工程；知识库规则改动按知识库编辑流程进行"],
      },
    });
  }

  if (action === "init_architectury") {
    const neoVer = parsed.data.neoforgeVersion?.trim();
    if (!neoVer) {
      return JSON.stringify({
        ok: false,
        error: {
          code: "NEOFORGE_VERSION_REQUIRED",
          message: "init_architectury 必须传入 neoforgeVersion（写入 gradle.properties 的 neoforge_version）。禁止留下空值。",
        },
      });
    }
    const derived =
      basename(root)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/^[^a-z]+/, "") || "mymod";
    const modId = (parsed.data.modId ?? derived).slice(0, 64);
    const usedDefaultTarget = !parsed.data.targetVersion;
    const mcVersion = parsed.data.targetVersion ?? "1.20.4";
    const defaultVersionWarning = usedDefaultTarget
      ? ["未传 targetVersion，Architectury 模板默认 1.20.4"]
      : undefined;

    const conflicts = checkConflicts(root);
    if (conflicts.length > 0) {
      if (doWrite) {
        return JSON.stringify({
          ok: false,
          error: {
            code: "CONFLICTING_FILES",
            message: `拒绝覆盖已存在文件: ${conflicts.join(", ")}`,
            hint: "已有工程请改用 extract_common / apply_version_migration；init_architectury 仅适用于空目录。请换空目录，或先备份/移除冲突文件后再以 confirmed=true 写入",
          },
        });
      }
      const output: InitArchitecturyOutput = {
        ok: true,
        dryRun: true,
        conflicts: {
          existingFiles: conflicts,
          mode: "skip",
        },
        filesToWrite: [
          "settings.gradle", "build.gradle", "gradle.properties",
          "common/build.gradle", "fabric/build.gradle", "neoforge/build.gradle",
          "common/src/main/resources/architectury.common.json",
          "fabric/src/main/resources/fabric.mod.json",
        ],
        warnings: defaultVersionWarning,
      };
      return JSON.stringify(output, null, 2);
    }

    const files = buildArchitecturySkeleton(root, modId, mcVersion, neoVer);

    if (doWrite) {
      const allowRoot = getAllowRootReal();
      const written: string[] = [];
      try {
        for (const [filePath, content] of Object.entries(files)) {
          const full = join(root, filePath);
          const parent = dirname(full);
          assertCreatableDir(parent, allowRoot);
          mkdirSync(parent, { recursive: true });
          assertWritablePath(full, allowRoot);
          atomicWriteUtf8(full, content);
          written.push(full);
        }
      } catch (err) {
        for (const p of [...written].reverse()) {
          try {
            if (existsSync(p)) unlinkSync(p);
            pruneEmptyParents(p, root);
          } catch {
            /* ignore */
          }
        }
        return JSON.stringify({
          ok: false,
          error: {
            code: "WRITE_FAILED",
            message: `init_architectury 写入失败，已回滚已写文件：${(err as Error).message}`,
            hint: "半套已删除；冲突预检通过后的失败请重试，或把半套列入 conflicts 后再 overlay",
          },
        });
      }
    }

    const output: InitArchitecturyOutput = {
      ok: true,
      dryRun,
      conflicts: null,
      filesToWrite: Object.keys(files),
      diffPreview: doWrite ? undefined : files,
      warnings: defaultVersionWarning,
    };
    return JSON.stringify(output, null, 2);
  }

  if (action === "extract_common") {
    const roots = javaSourceRoots(root);
    const allFiles: string[] = [];
    for (const srcRoot of roots) {
      allFiles.push(...walkDir(join(srcRoot, "main/java"), [".java"]));
      allFiles.push(...walkDir(join(srcRoot, "main/kotlin"), [".kt"]));
    }
    if (allFiles.length === 0) {
      return JSON.stringify({
        ok: false,
        error: {
          code: "SRC_NOT_FOUND",
          message: "未找到 Java/Kotlin 源码（已扫 src、common/src、fabric/src、forge/src、neoforge/src、quilt/src）",
        },
      });
    }

    const candidates: FileCandidate[] = allFiles.map((file) => {
      const relPath = pathRel(root, file);
      const { calls, patterns } = scanForLoaderCalls(file);
      const status = determineCandidateStatus(calls);
      return { relPath, status, loaderCalls: calls, searchPatterns: patterns.length > 0 ? patterns : undefined };
    });

    const recommendedActions: { action: string; files: string[]; reason: string; searchPattern?: string }[] = [];
    const safe = candidates.filter((c) => c.status === "safe_to_move");
    const review = candidates.filter((c) => c.status === "review_required");

    if (safe.length > 0) {
      recommendedActions.push({
        action: "move_to_common",
        files: safe.map((c) => c.relPath),
        reason: "无 Loader API 引用，可直接移动到 common 模块",
      });
    }
    if (review.length > 0) {
      recommendedActions.push({
        action: "generate_expectplatform",
        files: review.map((c) => c.relPath),
        reason: "包含 Loader API 调用，需先通过 @ExpectPlatform 抽象后再移动到 common 模块",
        searchPattern: "FabricLoader.getInstance() | FMLPaths | DistExecutor",
      });
    }

    const output: ExtractCommonOutput = {
      ok: true,
      precision: {
        note: "extract_common 仅基于 import 静态分析，可能存在遗漏（完全限定名、反射调用、字符串中的包名均可能漏检）。",
        limitations: [
          "import 语句是主要检测依据，可能遗漏完全限定名引用",
          "反射调用无法静态检测",
          "字符串字面量中的包名可能漏检",
          "建议用户结合 IDE 'Find Usages' 复核",
        ],
      },
      candidates,
      recommendedActions,
    };
    return JSON.stringify(output, null, 2);
  }

  if (action === "apply_version_migration") {
    if (!parsed.data.targetVersion) {
      return JSON.stringify({
        ok: false,
        error: {
          code: "TARGET_VERSION_REQUIRED",
          message: "apply_version_migration 必须传入 targetVersion，禁止静默默认 1.20.4。",
        },
      });
    }
    const targetVersion = parsed.data.targetVersion;
    const currentPlatform = inferCurrentPlatform(root);
    const destPlatform = parsed.data.targetPlatform ?? currentPlatform;
    const forgeToNeo = currentPlatform === "forge" && destPlatform === "neoforge";
    if (!forgeToNeo) {
      return JSON.stringify({
        ok: true,
        dryRun,
        skippedReason:
          `apply_version_migration 的包名改写仅用于 forge→neoforge（当前 ${currentPlatform} → ${destPlatform}）。同平台 MC 升级请查本档 search_*_docs，不要改 net.minecraftforge import。`,
        changes: {
          buildGradleUpdates: [],
          gradlePropertiesUpdates: [],
          packageRenames: [],
          todoBlocksAdded: [],
          unreviewedCandidates: [],
          manualFollowUps: [],
        },
      });
    }
    const renameResult = applyPackageRenames(root, !doWrite);
    if (renameResult.srcNotFound) {
      return JSON.stringify({
        ok: false,
        error: {
          code: "SRC_NOT_FOUND",
          message: "未找到 Java/Kotlin 源码目录，无法执行包名迁移",
        },
      });
    }
    const { renames, unreviewed } = renameResult;

    if (renameResult.rollbackError) {
      return JSON.stringify({
        ok: false,
        dryRun: false,
        error: {
          code: "MIGRATION_WRITE_FAILED",
          message: renameResult.rollbackError,
        },
      });
    }

    // Notes only — this action does NOT rewrite build.gradle / gradle.properties
    const manualNotes: string[] = [];
    if (renames.length > 0) {
      manualNotes.push(`已（或将）替换 Java 包名: ${renames.map((r) => `${r.from} → ${r.to}`).join(", ")}`);
      manualNotes.push(`请手动将 NeoForge/依赖版本对齐到 ${targetVersion}（本工具不修改 build.gradle）`);
    }

    const todoBlocks: { file: string; lines: number }[] = [];

    const output: ApplyMigrationOutput = {
      ok: true,
      dryRun,
      changes: {
        buildGradleUpdates: [],
        gradlePropertiesUpdates: [],
        packageRenames: renames,
        todoBlocksAdded: todoBlocks,
        unreviewedCandidates: unreviewed,
        manualFollowUps: manualNotes,
      },
      ...(renameResult.modified?.length ? { modifiedFiles: renameResult.modified } : {}),
    };
    return JSON.stringify(output, null, 2);
  }

  return JSON.stringify({ ok: false, error: { code: "UNKNOWN_ACTION", message: `Unknown action: ${action}` } });
}
