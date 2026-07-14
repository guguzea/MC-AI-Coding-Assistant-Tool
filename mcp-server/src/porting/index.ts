import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, relative, basename } from "path";
import { fileURLToPath } from "url";
import { resolveDataDir } from "../utils/path.js";
import { resolveProjectPath, ProjectPathError } from "../utils/project-sandbox.js";
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
  const crossPlatform = currentPlatform !== targetPlatform;

  const registryLevel = crossPlatform ? "medium" : "low";
  const eventsLevel = crossPlatform ? "medium" : "low";
  const networkLevel = stats.networkUsages > 5 ? "high" : stats.networkUsages > 0 ? "medium" : "low";
  const mixinLevel = stats.mixinConfigs > 0 ? "medium" : "low";
  const configLevel = crossPlatform ? "medium" : "low";

  return {
    registry: { level: registryLevel, affectedFiles: stats.registryCalls, reason: "跨平台注册方式存在差异" },
    events: { level: eventsLevel, affectedFiles: stats.eventSubscriptions, reason: "事件订阅模式可能需要调整" },
    network: { level: networkLevel, affectedFiles: stats.networkUsages, reason: "网络层 API 各平台差异最大" },
    mixin: { level: mixinLevel, affectedFiles: stats.mixinConfigs, reason: "Mixin 配置必须在各 loader 子工程分别维护" },
    config: { level: configLevel, affectedFiles: 1, reason: "建议使用 Forge Config API Port 实现跨平台统一配置" },
  };
}

// ── routeSteps 动态生成 ────────────────────────────────────────────────────

function generateRouteSteps(
  isArchitectury: boolean,
  ambiguous: boolean,
  currentPlatform: string,
  targetPlatform: string | undefined,
  needCrossPlatform: boolean,
): string[] {
  if (ambiguous) {
    return ["显式指定目标平台（targetPlatform）后重新调用 analyze_porting_path 分析"];
  }

  if (isArchitectury && !needCrossPlatform) {
    return ["执行 MC 版本升级（调用 port_project action=apply_version_migration）"];
  }

  if (!isArchitectury && needCrossPlatform) {
    return [
      "初始化 MultiLoader 项目结构（调用 port_project action=init_architectury）",
      "从当前源码提取 common 模块候选（调用 port_project action=extract_common，人工确认后执行）",
      "通过 @ExpectPlatform 抽象 Registry 层（Agent 根据 extract_common 输出人工处理）",
      "拆分 Mixin 配置到 fabric/ 和 neoforge/ 子工程（Agent 手动处理）",
      "验证 fabric/ 模块编译通过",
      "验证 neoforge/ 模块编译通过",
      "执行 MC 版本升级（调用 port_project action=apply_version_migration）",
    ];
  }

  if (!isArchitectury && !needCrossPlatform) {
    return ["执行 MC 版本升级（调用 port_project action=apply_version_migration）"];
  }

  // fallback
  return ["分析完成，请根据上述报告人工决定下一步"];
}

// ── query_api 建议 ─────────────────────────────────────────────────────────

function buildQuerySuggestions(targetVersion: string, targetPlatform: string | undefined) {
  const suggestions: { action: "query_api"; targetClass: string; targetVersion: string; reason: string }[] = [];

  if (targetPlatform === "neoforge" || !targetPlatform) {
    suggestions.push(
      {
        action: "query_api" as const,
        targetClass: "net.neoforged.api.dist.Dist",
        targetVersion,
        reason: "Dist 类从 net.minecraftforge 迁移到 net.neoforged.api.dist，请确认 @OnlyIn 使用方式",
      },
      {
        action: "query_api" as const,
        targetClass: "net.neoforged.neoforge.registries.DeferredHolder",
        targetVersion,
        reason: "NeoForge 1.20.2+ 中 RegistryObject 已迁移到 DeferredHolder",
      },
    );
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

const REFERENCE_LINKS = [
  { title: "NeoForge 1.20.2 发布说明", url: "https://neoforged.net/news/20.2release/" },
  { title: "Architectury NeoForge 迁移教程", url: "https://docs.architectury.dev/api/migration/neoforge" },
  { title: "MultiLoader 模板", url: "https://github.com/jaredlll08/MultiLoader-Template" },
  { title: "Architectury @ExpectPlatform", url: "https://docs.architectury.dev/plugin/expect_platform" },
  { title: "Fabric 26.1 迁移文档", url: "https://docs.fabricmc.net/develop/porting/" },
  { title: "NeoForge 26.1 迁移指南", url: "https://docs.neoforged.net/primer/docs/26.1/" },
];

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

  const forgeMatch =
    buildGradle.match(/['"]net\.minecraftforge:forge:[^'"]+-(\d+\.\d+\.\d+)['"]/) ??
    buildGradle.match(/forge\s*['":=]+(\d+\.\d+\.\d+)/) ??
    buildGradle.match(/neoforge\s*['":=]+(\d+\.\d+(?:\.\d+)?)/);
  if (forgeMatch) platformVersion = forgeMatch[1];

  const mappingsMatch =
    buildGradle.match(/mappings\s+["']([^"']+)["']/) ??
    buildGradleKts.match(/mappings\s+["']([^"']+)["']/) ??
    gradleProps.match(/mappings\s*=\s*(.+)/);
  if (mappingsMatch) mappings = mappingsMatch[1].trim();

  // 检查是否已有 Architectury
  const isArchitectury = settingsGradle.includes("architectury") || buildGradle.includes("architectury-plugin");

  // 2. 解析元数据
  let modId: string | null = null;
  const modsToml = readContent(join(root, "src/main/resources/META-INF/mods.toml"));
  const neoforgeModsToml = readContent(join(root, "src/main/resources/META-INF/neoforge.mods.toml"));
  const fabricJson = readContent(join(root, "src/main/resources/fabric.mod.json"));

  if (fabricJson) {
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
      (modsToml + neoforgeModsToml).match(/\bid\s*=\s*["']([^"']+)["']/);
    if (idMatch) modId = idMatch[1];
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

  const evidence: PlatformEvidence = { forge: 0, fabric: 0, neoforge: 0 };

  for (const file of allSourceFiles) {
    const content = readContent(file);
    if (!content) continue;

    // 平台证据（import / 注解）
    evidence.forge += (content.match(/import net\.minecraftforge\./g) ?? []).length;
    evidence.forge += (content.match(/@Mod\s*\(/g) ?? []).length;
    evidence.fabric += (content.match(/import net\.fabricmc\./g) ?? []).length;
    evidence.neoforge += (content.match(/import net\.neoforged\./g) ?? []).length;

    // 统计
    if (/DeferredRegister|RegistryObject|FabricRegistry\.INSTANCE/g.test(content)) registryCalls++;
    if (/@SubscribeEvent|@Environment\(/g.test(content)) eventSubscriptions++;
    if (/SimpleChannel|ClientPlayNetworking|ServerPlayNetworking/g.test(content)) networkUsages++;
    if (/@Mixin\(/g.test(content)) mixinConfigs++;
    if (/@OnlyIn\(Dist\.CLIENT\)/g.test(content)) clientOnlyAnnotations++;
  }

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

  // 4. 平台推断
  const { platform: inferredPlatform, ambiguous } = inferPlatform(evidence);
  const currentPlatform = inferredPlatform;

  // 5. 推断目标平台
  const targetPlatform = userTargetPlatform ?? (currentPlatform === "forge" ? "neoforge" : currentPlatform);
  const needCrossPlatform = currentPlatform !== targetPlatform;

  // 6. 知识库查询
  const targetVer = userTargetVersion ?? mcVersion ?? "1.20.4";
  const currentVer = mcVersion ?? "unknown";
  const { knowledgeGaps } = queryBreakingChanges(currentVer, targetVer);

  // 7. 风险评估
  const riskAssessment = assessRisk(stats, currentPlatform, targetPlatform);

  // 8. 动态生成 routeSteps
  const routeSteps = generateRouteSteps(isArchitectury, ambiguous, currentPlatform, targetPlatform, needCrossPlatform);

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
    mappings: targetVersionInfo?.mappings?.[0] ?? mappings ?? null,
    java: targetVersionInfo?.java ?? (targetVer === "26.1" ? 25 : 21),
  };

  const output: AnalyzePortingOutput = {
    ok: true,
    analysis: {
      current: currentInfo,
      target: targetInfo,
      knowledgeGaps,
      riskAssessment,
      recommendedRoute: isArchitectury ? "version_migration" : needCrossPlatform ? "architectury_common_refactor" : "version_migration",
      routeSteps,
      referenceLinks: REFERENCE_LINKS,
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

  const renames: { from: string; to: string; affectedFiles: number }[] = [];
  const unreviewed: { file: string; reason: string }[] = [];

  for (const [from, to] of PACKAGE_RENAMES) {
    let count = 0;
    for (const file of files) {
      const content = readContent(file);
      if (content.includes(from)) {
        count++;
        if (!dryRun) {
          writeFileSync(file, content.replaceAll(from, to), "utf-8");
        }
      }
    }
    if (count > 0) {
      renames.push({ from, to, affectedFiles: count });
    }
  }

  // TODO blocks for API changes
  const unreviewedCandidates: { file: string; reason: string }[] = [
    { file: "需要人工 review", reason: "RegistryObject → DeferredHolder 变更（见 forge/1.20.1/knowledge/porting/02-version-migration.md）" },
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

  const { dryRun = true, confirmed, action } = parsed.data;
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
      for (const [filePath, content] of Object.entries(files)) {
        const full = join(root, filePath);
        mkdirSync(join(full, ".."), { recursive: true });
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

    // Build Gradle updates
    const buildUpdates: string[] = [];
    const gradleUpdates: string[] = [];

    if (renames.length > 0) {
      buildUpdates.push(`包名替换: ${renames.map((r) => `${r.from} → ${r.to}`).join(", ")}`);
      gradleUpdates.push(`NeoForge 版本迁移至 ${targetVersion}（需手动确认版本号）`);
    }

    // TODO blocks
    const todoBlocks: { file: string; lines: number }[] = [];

    const output: ApplyMigrationOutput = {
      ok: true,
      dryRun,
      changes: {
        buildGradleUpdates: buildUpdates,
        gradlePropertiesUpdates: gradleUpdates,
        packageRenames: renames,
        todoBlocksAdded: todoBlocks,
        unreviewedCandidates: unreviewed,
      },
    };
    return JSON.stringify(output, null, 2);
  }

  return JSON.stringify({ ok: false, error: { code: "UNKNOWN_ACTION", message: `Unknown action: ${action}` } });
}
