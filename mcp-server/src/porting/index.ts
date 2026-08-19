import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, relative, basename } from "path";
import { fileURLToPath } from "url";
import { resolveDataDir } from "../utils/path.js";
import { resolveProjectPath, ProjectPathError, assertWritablePath, assertCreatableDir, getAllowRootReal } from "../utils/project-sandbox.js";
import { parseGradleProperties } from "../gradle/index.js";
import { detectLoader } from "../diagnostics/index.js";
import { analyzePortingPathSchema, portProjectSchema } from "./types.js";
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

function walkDir(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        results.push(...walkDir(full, extensions));
      } else if (extensions.some((ext) => entry.endsWith(ext))) {
        results.push(full);
      }
    }
  } catch {
    // ignore permission errors
  }
  return results;
}

function readContent(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
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
} {
  const kb = loadVersionsKB() as { versions: Record<string, { breakingChanges?: unknown[] }> };
  const versions = kb.versions ?? {};

  const breakingChanges: unknown[] = [];
  const knowledgeGaps: string[] = [];

  if (!versions[targetVer]) {
    knowledgeGaps.push(targetVer);
  }

  if (versions[currentVer] && versions[currentVer].breakingChanges) {
    (breakingChanges as unknown[]).push(...(versions[currentVer].breakingChanges ?? []));
  }
  if (versions[targetVer] && versions[targetVer].breakingChanges) {
    (breakingChanges as unknown[]).push(...(versions[targetVer].breakingChanges ?? []));
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

// ── routeSteps 动态生成 ────────────────────────────────────────────────────

function generateRouteSteps(
  isArchitectury: boolean,
  ambiguous: boolean,
  _currentPlatform: string,
  targetPlatform: string | undefined,
  needCrossPlatform: boolean,
  userSpecifiedTarget: boolean,
): string[] {
  if (ambiguous && !userSpecifiedTarget) {
    return ["显式指定目标平台（targetPlatform）后重新调用 analyze_porting_path 分析"];
  }

  const prefix =
    ambiguous && userSpecifiedTarget
      ? [`当前平台证据不足，已按 targetPlatform=${targetPlatform} 规划`]
      : [];

  if (isArchitectury && !needCrossPlatform) {
    return [...prefix, "执行 MC 版本升级（调用 port_project action=apply_version_migration）"];
  }

  if (!isArchitectury && needCrossPlatform) {
    return [
      ...prefix,
      "初始化 MultiLoader 项目结构（调用 port_project action=init_architectury）",
      "从当前源码提取 common 模块候选（调用 port_project action=extract_common：仅静态分析，不搬文件）",
      "通过 @ExpectPlatform 抽象 Registry 层（根据 extract_common 输出人工处理）",
      "拆分 Mixin 配置到 fabric/ 和 neoforge/ 子工程（Agent 手动处理）",
      "验证 fabric/ 模块编译通过",
      "验证 neoforge/ 模块编译通过",
      "执行 MC 版本升级（调用 port_project action=apply_version_migration）",
    ];
  }

  if (!isArchitectury && !needCrossPlatform) {
    return [...prefix, "执行 MC 版本升级（调用 port_project action=apply_version_migration）"];
  }

  return [...prefix, "分析完成，请根据上述报告人工决定下一步"];
}

// ── query_api 建议 ─────────────────────────────────────────────────────────

function buildQuerySuggestions(targetVersion: string, targetPlatform: string | undefined) {
  const suggestions: QueryApiSuggestion[] = [];

  if (targetPlatform === "neoforge") {
    suggestions.push({
      action: "search_neoforge_docs",
      query: "DeferredRegister Dist",
      version: targetVersion,
      reason: "NeoForge 特有 API 请用 search_neoforge_docs；query_api 无 NeoForge 类索引",
    });
    if (targetVersion === "26.1" || targetVersion.startsWith("26.")) {
      suggestions.push({
        action: "search_neoforge_docs",
        query: "ItemStack",
        version: targetVersion,
        reason: "26.1+ 无 Parchment api-index，ItemStack 等变更请查 NeoForge 文档",
      });
    }
    return suggestions;
  }

  if (targetVersion === "26.1") {
    suggestions.push({
      action: "query_api" as const,
      targetClass: "net.minecraft.world.item.ItemStack",
      targetVersion,
      reason: "26.1 中 ItemStack 构造方式有重大变更，请确认数据文件中的构造调用",
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
  // 仅目标版本 >= 26 时附带 26.1 链接
  const major = parseFloat(version);
  if (!Number.isNaN(major) && major >= 26) {
    links.push({ title: "Fabric 移植索引（线上当前多为 26.1→26.2）", url: "https://docs.fabricmc.net/develop/porting/index" });
    links.push({ title: "NeoForge Primer 26.1", url: "https://docs.neoforged.net/primer/docs/26.1/" });
    if (version === "26.2" || version.startsWith("26.2")) {
      links.push({ title: "NeoForge Primer 26.2", url: "https://docs.neoforged.net/primer/docs/26.2/" });
      links.push({ title: "Fabric API 26.2 概述", url: "https://fabricmc.net/2026/06/15/262.html" });
    }
  }
  if (platform === "fabric") {
    links.push({ title: "Fabric Wiki", url: "https://fabricmc.net/wiki/" });
    links.push({ title: "Yarn 映射浏览", url: "https://linkie.shedaniel.dev/mappings" });
    if (version.startsWith("1.20")) {
      links.push({ title: "Fabric Docs", url: "https://docs.fabricmc.net/" });
    }
  }
  return links;
}

const REFERENCE_LINKS = buildReferenceLinks("neoforge", "26.1"); // 兼容旧引用；实际输出用 buildReferenceLinks

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 1: analyze_porting_path
// ─────────────────────────────────────────────────────────────────────────────

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

  // 3. 扫描源码
  const srcJava = join(root, "src/main/java");
  const srcKotlin = join(root, "src/main/kotlin");

  const javaFiles = walkDir(srcJava, [".java"]);
  const kotlinFiles = walkDir(srcKotlin, [".kt"]);
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
  const targetPlatform = userTargetPlatform ?? (currentPlatform === "forge" ? "neoforge" : currentPlatform);

  if (UNSUPPORTED_PORT.has(currentPlatform) || UNSUPPORTED_PORT.has(targetPlatform)) {
    const portPlat = UNSUPPORTED_PORT.has(targetPlatform) ? targetPlatform : currentPlatform;
    const e: AnalyzePortingError = {
      ok: false,
      error: {
        code: "UNSUPPORTED_PORT",
        message: `不支持自动移植 ${currentPlatform} → ${targetPlatform}。基岩 / LiteLoader / Rift / ModLoader 交叉移植只提供笔记，不改工程。`,
        hint:
          currentPlatform === "rift" && targetPlatform === "fabric"
            ? "Rift→Fabric 可手写移植笔记；port_project 保持 dryRun，无现成模板则只输出路线。"
            : "请改用对应平台规则树；Quilt↔Fabric 才视为低风险自动路线。",
        next: [
          `读 ${portPlat} 档 AGENTS.md；activate_platform_pack action=session --platform=${portPlat}`,
          `search_docs({platform:"${portPlat}"})`,
          portPlat === "rift" || currentPlatform === "rift"
            ? "Rift→Fabric 只出笔记，port_project 保持 dryRun"
            : "不要对基岩 / LiteLoader / Rift / ModLoader 自动改工程",
        ],
      },
    };
    return JSON.stringify(e, null, 2);
  }
  const needCrossPlatform = currentPlatform !== targetPlatform;

  // 6. 知识库查询
  const targetVer = userTargetVersion ?? mcVersion ?? "1.20.4";
  const currentVer = mcVersion ?? "unknown";
  const { knowledgeGaps } = queryBreakingChanges(currentVer, targetVer);

  // 7. 风险评估
  const riskAssessment = assessRisk(stats, currentPlatform, targetPlatform);

  // 8. 动态生成 routeSteps
  const routeSteps = generateRouteSteps(
    isArchitectury,
    ambiguous,
    currentPlatform,
    targetPlatform,
    needCrossPlatform,
    Boolean(userTargetPlatform),
  );
  if (targetPlatform === "quilt" || currentPlatform === "quilt") {
    routeSteps.push("Quilt 工程优先 org.quiltmc / QSL；禁止把 net.fabricmc.fabric.api.event.registry 当 QSL 注册");
  }

  // 9. 建议目标信息
  const kb = loadVersionsKB() as { versions?: Record<string, { neoforge?: string; fabric?: string; mappings?: string[]; java?: number }> };
  const targetVersionInfo = kb.versions?.[targetVer];

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
        ? "yarn"
        : (targetVersionInfo?.mappings?.[0] ?? mappings ?? null),
    java: targetVersionInfo?.java ?? (targetVer === "26.1" ? 25 : 21),
  };

  const output: AnalyzePortingOutput = {
    ok: true,
    analysis: {
      current: currentInfo,
      target: targetInfo,
      knowledgeGaps,
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

function generateSettingsGradleContent(modId: string): string {
  const patterns = loadArchitecturyPatterns() as { settingsGradle?: unknown };
  const fallback = [
    "pluginManagement {",
    "    repositories {",
    "        maven { url 'https://maven.fabricmc.net/' }",
    "        maven { url 'https://maven.neoforged.net/releases' }",
    "        gradlePluginPortal()",
    "    }",
    "}",
    "",
    `rootProject.name = '${modId}-multiloader'`,
    "include 'common'",
    "include 'fabric'",
    "include 'neoforge'",
  ];
  const lines = Array.isArray(patterns.settingsGradle) ? patterns.settingsGradle.map(String) : fallback;
  return lines.join("\n");
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
    "        minecraft \"com.mojang:minecraft:\\${rootProject.minecraft_version}\"",
    "        mappings loom.layered {",
    "            officialMojangMappings()",
    "            parchment(\"org.parchmentmc.data:parchment-\\${rootProject.minecraft_version}:2024.01.20@zip\")",
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
    "    neoform \"20240404.143922\"",
    "}",
  ].join("\n");
}

function generateArchitecturyCommonJson(modId: string): string {
  return JSON.stringify({ common: [] }, null, 2);
}

function checkConflicts(root: string): string[] {
  const files = ["build.gradle", "settings.gradle", "gradle.properties"];
  return files.filter((f) => existsSync(join(root, f)));
}

function buildArchitecturySkeleton(root: string, modId: string, mcVersion: string) {
  const files: Record<string, string> = {};

  files["settings.gradle"] = generateSettingsGradleContent(modId);
  files["build.gradle"] = generateRootBuildGradleContent(mcVersion);
  files["gradle.properties"] = `minecraft_version=${mcVersion}\nloom.platform=fabric\n`;

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
    description: "Fabric platform for ${modId}",
    entrypoints: [{ adapter: "java", value: `${modId}.${modId}Client` }],
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
    { re: /net\/forge[s]?craft\//g, label: "net.minecraftforge import" },
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
      // find line range
      const firstLine = lines.findIndex((l) => re.test(l));
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
} {
  const srcDir = join(root, "src");
  const files = walkDir(srcDir, [".java", ".kt"]);
  const allowRoot = dryRun ? null : getAllowRootReal();

  const renames: { from: string; to: string; affectedFiles: number }[] = [];
  const unreviewed: { file: string; reason: string }[] = [];

  for (const [from, to] of PACKAGE_RENAMES) {
    let count = 0;
    for (const file of files) {
      const content = readContent(file);
      if (content.includes(from)) {
        count++;
        if (!dryRun && allowRoot) {
          assertWritablePath(file, allowRoot);
          writeFileSync(file, content.replaceAll(from, to), "utf-8");
        }
      }
    }
    if (count > 0) {
      renames.push({ from, to, affectedFiles: count });
    }
  }

  const unreviewedCandidates: { file: string; reason: string }[] = [
    { file: "需要人工 review", reason: "RegistryObject → DeferredHolder 变更（见 data/porting 知识库 / 平台 porting 文档）" },
    { file: "需要人工 review", reason: "NeoForge 1.20.2+ 事件总线订阅方式（mod bus / forge bus）" },
  ];

  return { renames, unreviewed: unreviewedCandidates };
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

  if (action === "init_architectury") {
    const derived =
      basename(root)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/^[^a-z]+/, "") || "mymod";
    const modId = (parsed.data.modId ?? derived).slice(0, 64);
    const mcVersion = parsed.data.targetVersion ?? "1.20.4";

    const conflicts = checkConflicts(root);
    if (conflicts.length > 0) {
      if (doWrite) {
        return JSON.stringify({
          ok: false,
          error: {
            code: "CONFLICTING_FILES",
            message: `拒绝覆盖已存在文件: ${conflicts.join(", ")}`,
            hint: "请换空目录，或先备份/移除冲突文件后再以 confirmed=true 写入",
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
      };
      return JSON.stringify(output, null, 2);
    }

    const files = buildArchitecturySkeleton(root, modId, mcVersion);

    if (doWrite) {
      const allowRoot = getAllowRootReal();
      for (const [filePath, content] of Object.entries(files)) {
        const full = join(root, filePath);
        const parent = join(full, "..");
        assertCreatableDir(parent, allowRoot);
        mkdirSync(parent, { recursive: true });
        assertWritablePath(full, allowRoot);
        writeFileSync(full, content, "utf-8");
      }
    }

    const output: InitArchitecturyOutput = {
      ok: true,
      dryRun,
      conflicts: null,
      filesToWrite: Object.keys(files),
      diffPreview: doWrite ? undefined : files,
    };
    return JSON.stringify(output, null, 2);
  }

  if (action === "extract_common") {
    const srcDir = join(root, "src");
    const javaFiles = walkDir(join(srcDir, "main/java"), [".java"]);
    const kotlinFiles = walkDir(join(srcDir, "main/kotlin"), [".kt"]);
    const allFiles = [...javaFiles, ...kotlinFiles];

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
    const targetVersion = parsed.data.targetVersion ?? "1.20.4";
    const { renames, unreviewed } = applyPackageRenames(root, !doWrite);

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
    };
    return JSON.stringify(output, null, 2);
  }

  return JSON.stringify({ ok: false, error: { code: "UNKNOWN_ACTION", message: `Unknown action: ${action}` } });
}
