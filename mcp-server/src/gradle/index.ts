/**
 * Gradle 构建诊断模块
 *
 * 诊断内容：
 * - 依赖版本与 MC 版本匹配
 * - mods.toml 语法
 * - Mod 间 API 冲突检测
 * - 正确依赖声明
 */

import { detectProjectLoaders, javaBlobFromFiles } from "../diagnostics/index.js";
import { actionable, ActionCodes, type ActionEnvelope } from "../utils/actionable.js";
import { loadModProject, preferExplicit, resolveProjectDir } from "../utils/project-files.js";
import {
  classifyMinecraftVersion,
  detectMinecraftVersion,
} from "../utils/minecraft-version.js";

export { detectMinecraftVersion } from "../utils/minecraft-version.js";

function hasJavaLanguageVersionDecl(src: string): boolean {
  return /JavaLanguageVersion\.of\s*\(|JavaVersion\.VERSION_\d+\b/.test(src);
}

function hasJavaLanguageVersionOf(src: string, n: number): boolean {
  return new RegExp(`(?:JavaLanguageVersion\\.of\\(\\s*${n}\\s*\\)|JavaVersion\\.VERSION_${n}\\b)`).test(src);
}

export interface GradleQuery {
  buildGradle?: string;
  gradleProperties?: string;
  litemodJson?: string;
  riftmodJson?: string;
  addonManifest?: string;
  quiltModJson?: string;
  modsToml?: string;
  fabricModJson?: string;
  neoModsToml?: string;
  projectPath?: string;
}

export interface GradleResult {
  status?: "passed" | "failed" | "skipped";
  skipped?: boolean;
  passed?: boolean | null;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  ok?: boolean;
  action?: ActionEnvelope;
}

const SKIP_ACTION_MESSAGE =
  "破坏性变更：请先看 status/skipped，不要只看 passed；这不是项目损坏，而是本工具未跑检查。不得把 suggestions 当错误，也不得把 action 当「校验通过」。";

function skippedGradle(
  warnings: string[],
  suggestions: string[],
  relatedTools?: string[],
): GradleResult {
  return {
    status: "skipped",
    skipped: true,
    passed: null,
    ok: true,
    errors: [],
    warnings,
    suggestions,
    action: actionable(ActionCodes.WRONG_TOOL, SKIP_ACTION_MESSAGE, suggestions.slice(0, 3), relatedTools),
  };
}

export function diagnoseGradle(query: GradleQuery): GradleResult {
  let javaBlob = "";
  if (query.projectPath) {
    const resolved = resolveProjectDir(query.projectPath);
    if (!resolved.ok) {
      return {
        status: "failed",
        passed: false,
        ok: false,
        errors: [resolved.action.message],
        warnings: [],
        suggestions: [],
        action: resolved.action,
      };
    }
    const loaded = loadModProject(resolved.root);
    query = {
      ...query,
      buildGradle: preferExplicit(query.buildGradle, loaded.buildGradle),
      gradleProperties: preferExplicit(query.gradleProperties, loaded.gradleProperties),
      litemodJson: preferExplicit(query.litemodJson, loaded.litemodJson),
      riftmodJson: preferExplicit(query.riftmodJson, loaded.riftmodJson),
      addonManifest: preferExplicit(query.addonManifest, loaded.addonManifest),
      quiltModJson: preferExplicit(query.quiltModJson, loaded.quiltModJson),
      modsToml: preferExplicit(query.modsToml, loaded.modsToml),
      fabricModJson: preferExplicit(query.fabricModJson, loaded.fabricModJson),
      neoModsToml: preferExplicit(query.neoModsToml, loaded.neoModsToml),
    };
    javaBlob = javaBlobFromFiles(loaded.javaFiles);
  }
  const buildGradle = query.buildGradle;
  if (!buildGradle?.trim()) {
    const action = actionable("INVALID_INPUT", "缺少 build.gradle 正文（可传 buildGradle 或 projectPath）", [
      "传入 build.gradle 全文，或使用 projectPath / CLI --project 指向工程根目录",
    ]);
    return { status: "failed", passed: false, ok: false, errors: [action.message], warnings: [], suggestions: [], action };
  }
  const { gradleProperties, litemodJson, riftmodJson, addonManifest, quiltModJson, modsToml, fabricModJson, neoModsToml } = query;
  const extras = { litemodJson, riftmodJson, addonManifest, quiltModJson };
  const detection = detectProjectLoaders({
    buildGradle,
    modsToml,
    fabricModJson,
    neoModsToml,
    extras,
    javaBlob,
  });
  const loader = detection.primary;

  const quiltish =
    loader === "quilt" || Boolean(quiltModJson?.trim()) || /org\.quiltmc\.loom|quilt-loom/i.test(buildGradle);
  const fabricLoom =
    loader === "fabric" ||
    (/fabric-loom/i.test(buildGradle) &&
      loader !== "neoforge" &&
      loader !== "forge" &&
      loader !== "liteloader" &&
      loader !== "liteloader_forge");
  if (quiltish || fabricLoom) {
    return diagnoseLoomGradle(buildGradle, gradleProperties, quiltish);
  }

  if (loader === "bedrock" || addonManifest?.trim() || (/"format_version"/.test(buildGradle) && /"modules"/.test(buildGradle))) {
    return skippedGradle(
      ["diagnose_gradle 仅覆盖 Forge（ForgeGradle）。当前内容像基岩 Add-On manifest，不是 Gradle 工程。"],
      ["请改用 search_bedrock_docs / validate_addon_manifest；不要用本工具当基岩诊断"],
      ["search_bedrock_docs", "validate_addon_manifest"],
    );
  }

  const hasLiteLoaderPlugin = /net\.minecraftforge\.gradle\.liteloader/.test(buildGradle);
  if (hasLiteLoaderPlugin || loader === "liteloader_forge") {
    return diagnoseLiteLoaderGradle(buildGradle);
  }

  const looksLiteMeta =
    Boolean(litemodJson?.trim()) ||
    /litemod\.json|\bLiteMod\b|com\.mumfrey\.liteloader/i.test(buildGradle);
  const looksForgeShape =
    /net\.minecraftforge:forge:\d+\.\d+-\d+/.test(buildGradle) ||
    /modLoader\s*=\s*"javafml"/i.test(buildGradle) ||
    /apply\s+plugin:\s*['"]net\.minecraftforge\.gradle\.forge['"]/.test(buildGradle) ||
    /id\s+['"]net\.minecraftforge\.gradle['"]/.test(buildGradle);
  if (looksLiteMeta || loader === "liteloader" || (loader === "unknown" && Boolean(litemodJson?.trim()))) {
    if (looksForgeShape) {
      return {
        status: "failed",
        passed: false,
        ok: false,
        errors: [
          "同时存在 LiteLoader 与 Forge 迹象，但未 apply plugin: 'net.minecraftforge.gradle.liteloader'。禁止当 Forge 1.20 / FG6 诊断。",
        ],
        warnings: [],
        suggestions: [
          "混合工程只保留：apply plugin: 'net.minecraftforge.gradle.liteloader'，并钉死双方兼容的 MCP 映射",
        ],
      };
    }
    return skippedGradle(
      ["纯 LiteLoader / 未使用 net.minecraftforge.gradle.liteloader：不要当 Forge 1.20 诊断。"],
      ['请改用 search_docs({platform:"liteloader"}) 与 LiteLoader 规则'],
      ["search_docs"],
    );
  }

  if (loader === "rift" || riftmodJson?.trim() || /tweaker-client|RiftLoaderClientTweaker|riftmod\.json/i.test(buildGradle)) {
    return skippedGradle(
      ["diagnose_gradle 不覆盖 Rift。"],
      ['请改用 search_docs({platform:"rift"})；方法名只许来自已核实 wiki/源码'],
      ["search_docs"],
    );
  }

  if (loader === "modloader" || /extends\s+BaseMod\b|class\s+mod_[A-Za-z0-9_]+/.test(buildGradle)) {
    return skippedGradle(
      [
        "diagnose_gradle 仅覆盖 Forge（ForgeGradle）。当前内容像 Risugami's ModLoader（BaseMod），通常无 Gradle。",
      ],
      [
        '请改用 search_docs({platform:"modloader"}) 与 modloader/1.6.4/knowledge/common/safe-api.md；禁止用 Forge Javadoc / func_*',
      ],
      ["search_docs"],
    );
  }

  if (/neogradle|net\.neoforged\.gradle|id\s+['"]net\.neoforged/i.test(buildGradle)) {
    return diagnoseNeoGradle(buildGradle, gradleProperties);
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const props = parseGradleProperties(gradleProperties ?? "");
  const mcVersion = detectMinecraftVersion({
    gradleProperties: gradleProperties ?? "",
    buildGradle,
  });
  const band = classifyMinecraftVersion(mcVersion);

  const forgeCoord = buildGradle.match(
    /net\.minecraftforge:forge:([0-9.]+)-([0-9.]+)/,
  );
  if (forgeCoord) {
    const [, mcFromCoord, forgeFromCoord] = forgeCoord;
    if (props.minecraft_version && props.minecraft_version !== mcFromCoord) {
      errors.push(
        `build.gradle 中 Forge 坐标 MC 版本 ${mcFromCoord} 与 gradle.properties 的 minecraft_version=${props.minecraft_version} 不一致`,
      );
    }
    if (props.forge_version && props.forge_version !== forgeFromCoord) {
      errors.push(
        `build.gradle 中 Forge 版本 ${forgeFromCoord} 与 gradle.properties 的 forge_version=${props.forge_version} 不一致`,
      );
    }
  } else if (/net\.minecraftforge:forge:\$\{/.test(buildGradle)) {
    suggestions.push("Forge 依赖使用 ${...} 占位，已跳过与 properties 的字面交叉比对");
  }

  if (band === "unknown") {
    warnings.push("无法判定 MC 版本，跳过版本专用检查");
  } else if (band === "1.20.1") {
    if (!hasJavaLanguageVersionDecl(buildGradle)) {
      warnings.push("未找到 Java toolchain 配置，建议添加 java.toolchain.languageVersion");
    } else if (!hasJavaLanguageVersionOf(buildGradle, 17) && !hasJavaLanguageVersionOf(buildGradle, 21)) {
      warnings.push("Java toolchain 应为 17 或 21");
    }
    if (!buildGradle.includes("net.minecraftforge:forge")) {
      errors.push("缺少 Forge 依赖：minecraft \"net.minecraftforge:forge:${minecraft_version}-${forge_version}\"");
    }
    if (!buildGradle.includes("net.minecraftforge.gradle")) {
      errors.push("缺少 ForgeGradle 插件：id 'net.minecraftforge.gradle' version '[6.0,6.2)'");
    }
    if (props.minecraft_version && props.forge_version) {
      if (!props.minecraft_version.includes("1.20")) {
        warnings.push(`Minecraft 版本 ${props.minecraft_version} 未经测试，建议使用 1.20.x 系列`);
      }
      if (!props.forge_version.startsWith("47")) {
        warnings.push(`Forge 版本 ${props.forge_version} 可能不适合 Minecraft ${props.minecraft_version}`);
      }
    } else {
      warnings.push("gradle.properties 中缺少 minecraft_version 或 forge_version");
    }
    if (!buildGradle.includes("mappings channel")) {
      warnings.push("未找到 mappings 配置，建议使用 parchment 映射以获得参数名提示");
    } else if (buildGradlerIncludesParchment(buildGradle)) {
      suggestions.push("已配置 Parchment 映射，这是推荐配置");
    }
    if (!buildGradle.includes("copyIdeResources")) {
      warnings.push("copyIdeResources = true 是必需的，否则资源文件不会在 IDE 中更新");
    } else if (buildGradle.includes("copyIdeResources = false")) {
      errors.push("copyIdeResources 应设为 true，否则 IDE 中修改资源文件不会生效");
    }
    if (buildGradle.includes("finalizedBy 'reobfJar'") || buildGradle.includes("jar.finalizedBy")) {
      // OK
    } else if (buildGradle.includes("jar {")) {
      warnings.push("jar 任务应添加 finalizedBy 'reobfJar' 以确保发布时正确混淆");
    }
    if (props.loader_version && !/^\[?\d+/.test(props.loader_version)) {
      warnings.push(`loader_version 格式不正确：${props.loader_version}，应为版本范围如 [47,)`);
    }
    if (props.forge_version && !props.forge_version.startsWith("47.")) {
      warnings.push(
        `Forge 版本 ${props.forge_version} 不以 47. 开头，可能不是 1.20.1 的 Forge 版本`,
      );
    }
  } else if (band === "1.20.4") {
    if (!buildGradle.includes("net.minecraftforge.gradle") && !/apply\s+plugin:\s*['"]net\.minecraftforge\.gradle/.test(buildGradle)) {
      warnings.push("未找到 ForgeGradle 插件声明");
    }
    if (props.forge_version?.startsWith("47.")) {
      warnings.push(`Forge 版本 ${props.forge_version} 像 1.20.1 的 47.x，不要按 1.20.1 FG6 矩阵套用到 1.20.4`);
    }
    if (!hasJavaLanguageVersionDecl(buildGradle)) {
      warnings.push("未找到 Java toolchain 配置");
    }
  } else if (band === "1.20.x") {
    warnings.push(`Minecraft ${mcVersion} 不走 1.20.1 的 Forge 47. 专用检查；仅做通用 ForgeGradle 提示`);
    if (!buildGradle.includes("net.minecraftforge.gradle") && !/apply\s+plugin:\s*['"]net\.minecraftforge\.gradle/.test(buildGradle)) {
      warnings.push("未找到 ForgeGradle 插件声明");
    }
  } else if (band === "1.18-1.19") {
    if (hasJavaLanguageVersionDecl(buildGradle) && !hasJavaLanguageVersionOf(buildGradle, 17)) {
      warnings.push("1.18–1.19 建议 Java 17，不要强制 Forge 47.");
    }
  } else if (band === "1.16.5") {
    if (hasJavaLanguageVersionOf(buildGradle, 17) || hasJavaLanguageVersionOf(buildGradle, 21)) {
      warnings.push("1.16.5 通常使用 Java 8/11 与 FG5，不要按 FG6/Java 17 打分");
    }
  } else if (band === "1.12.2") {
    if (!/apply\s+plugin:\s*['"]net\.minecraftforge\.gradle\.forge['"]/.test(buildGradle) &&
        !/id\s+['"]net\.minecraftforge\.gradle['"]/.test(buildGradle)) {
      warnings.push("1.12.2 常见写法是 apply plugin: 'net.minecraftforge.gradle.forge'");
    }
  }

  if (errors.length === 0 && band !== "unknown") {
    suggestions.push("配置看起来基本正确，建议运行 ./gradlew build 验证");
  }

  const passed = errors.length === 0;
  return {
    status: passed ? "passed" : "failed",
    passed,
    ok: passed,
    errors,
    warnings,
    suggestions,
  };
}

/** 导出供 porting 等复用 */
export function parseGradleProperties(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...rest] = trimmed.split("=");
      result[k.trim()] = rest.join("=").trim();
    }
  }
  return result;
}

function gradleResult(errors: string[], warnings: string[], suggestions: string[]): GradleResult {
  const passed = errors.length === 0;
  return { status: passed ? "passed" : "failed", passed, ok: passed, errors, warnings, suggestions };
}

function diagnoseLoomGradle(buildGradle: string, gradleProperties: string | undefined, quilt: boolean): GradleResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const mcVersion = detectMinecraftVersion({ buildGradle, gradleProperties });
  const is261 = /^26\.1/.test(mcVersion);
  const hasNewFabricPlugin = /id\s+['"]net\.fabricmc\.fabric-loom['"]/.test(buildGradle);
  const hasOldFabricPlugin = /id\s+['"]fabric-loom['"]/.test(buildGradle);
  const hasQuiltPlugin = /id\s+['"]org\.quiltmc\.loom['"]|quilt-loom/i.test(buildGradle);

  if (quilt) {
    warnings.push("Quilt Loom：对照 quilt.mod.json 与 mappings；不要把 Fabric Registry 当 QSL。");
    if (!hasQuiltPlugin) {
      errors.push("Quilt 工程缺少 org.quiltmc.loom 插件 id");
    }
    suggestions.push('可配合 search_docs({platform:"quilt"}) 核 QSL');
  } else {
    if (!hasNewFabricPlugin && !hasOldFabricPlugin) {
      errors.push("缺少 Loom 插件 id（1.21 常用 fabric-loom；26.1 必须 net.fabricmc.fabric-loom）");
    }
    suggestions.push("可配合 search_fabric_docs 核 Loom / 映射");
  }

  if (is261) {
    if (!quilt && !hasNewFabricPlugin) {
      errors.push('26.1 必须使用 id "net.fabricmc.fabric-loom"，不要旧的 id "fabric-loom"');
    }
    if (/modImplementation/.test(buildGradle)) {
      errors.push("26.1 禁止 modImplementation，改用 implementation / compileOnly / api");
    }
    if (!/JavaLanguageVersion\.of\(\s*25\s*\)/.test(buildGradle)) {
      errors.push("26.1 需要 Java toolchain 25（JavaLanguageVersion.of(25)）");
    }
    if (/yarn/i.test(buildGradle) && /mappings/.test(buildGradle)) {
      warnings.push("26.1 游戏已去混淆，不要再声明 Yarn mappings");
    }
  } else {
    if (!/JavaLanguageVersion\.of\s*\(/.test(buildGradle)) {
      errors.push("未找到 Java toolchain 配置（1.21 建议 JavaLanguageVersion.of(21)）");
    } else if (/^1\.21/.test(mcVersion) && !/JavaLanguageVersion\.of\(\s*21\s*\)/.test(buildGradle) && !/JavaLanguageVersion\.of\(\s*25\s*\)/.test(buildGradle)) {
      warnings.push("1.21.x 建议 Java toolchain 21");
    }
  }

  return gradleResult(errors, warnings, suggestions);
}

function diagnoseNeoGradle(buildGradle: string, gradleProperties: string | undefined): GradleResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = ["可配合 search_neoforge_docs 核 NeoGradle / ModDevGradle"];
  const props = parseGradleProperties(gradleProperties ?? "");
  const mcVersion = detectMinecraftVersion({ buildGradle, gradleProperties });
  const is261 = /^26\.1/.test(mcVersion);
  const hasUserdev = /net\.neoforged\.gradle\.userdev/.test(buildGradle);
  const hasModdev = /net\.neoforged\.moddev|moddevgradle|net\.neoforged\.gradle\.common/i.test(buildGradle);

  if (!hasUserdev && !hasModdev) {
    errors.push("缺少 NeoGradle userdev 或 ModDevGradle 插件 id");
  }
  if (!props.minecraft_version && !/minecraft_version/.test(buildGradle)) {
    warnings.push("未找到 minecraft_version");
  }
  if (!props.neo_version && !props.neoforge_version && !/neo_version|neoforge_version/.test(buildGradle)) {
    warnings.push("未找到 neo_version / neoforge_version");
  }
  if (is261) {
    if (!hasUserdev && !hasModdev) {
      errors.push("26.1 必须能看出 buildPlugin（ModDevGradle 或 NeoGradle）");
    }
    if (!/JavaLanguageVersion\.of\(\s*25\s*\)/.test(buildGradle)) {
      errors.push("26.1 需要 Java toolchain 25");
    }
  } else if (/^1\.21/.test(mcVersion) || mcVersion.startsWith("1.20")) {
    if (!/JavaLanguageVersion\.of\s*\(/.test(buildGradle)) {
      errors.push("未找到 Java toolchain 配置（1.20.4/1.21 建议 21）");
    }
  } else if (mcVersion === "unknown") {
    if (!/JavaLanguageVersion\.of\s*\(/.test(buildGradle)) {
      errors.push("未找到 Java toolchain 配置");
    }
  }

  return gradleResult(errors, warnings, suggestions);
}

function diagnoseLiteLoaderGradle(buildGradle: string): GradleResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const hasStdForgePlugin =
    /apply\s+plugin:\s*['"]net\.minecraftforge\.gradle\.forge['"]/.test(buildGradle) ||
    /id\s+['"]net\.minecraftforge\.gradle['"]/.test(buildGradle);
  if (hasStdForgePlugin) {
    errors.push(
      "混合工程禁止同时 apply 标准 Forge 插件与 LiteLoader 插件。只保留：apply plugin: 'net.minecraftforge.gradle.liteloader'",
    );
  }

  const hasMappings =
    /mappings\s*=\s*['"](?:stable|snapshot)_\d+['"]/.test(buildGradle) ||
    /mappings\s+channel/.test(buildGradle);
  if (!hasMappings) {
    errors.push(
      "必须在 build.gradle 显式钉死 LiteLoader 与 Forge 双方兼容的 MCP 映射（例如 mappings = 'stable_39'）。缺映射会导致运行时 NoSuchMethodError / AbstractMethodError",
    );
  }

  const hasRun =
    /\brunClient\b/.test(buildGradle) ||
    /run\s*\{[^}]*client/is.test(buildGradle) ||
    /task\s+runClient/.test(buildGradle);
  if (!hasRun) {
    warnings.push("未检测到 runClient / run { client } 任务，请确认 LiteLoader FG 工作区可启动客户端");
  }

  warnings.push("本工具看不到 LiteMod 客户端回调；聊天/Tick/渲染请走 LiteLoader 规则（Tickable / OutboundChatListener 等）");
  suggestions.push("混合工程：注册走 Forge RegistryEvent；客户端钩子走 com.mumfrey.liteloader.* 接口");

  const passed = errors.length === 0;
  return { status: passed ? "passed" : "failed", passed, ok: passed, errors, warnings, suggestions };
}

function buildGradlerIncludesParchment(buildGradle: string): boolean {
  return /parchment/i.test(buildGradle) || /mappings\s*=.*parchment/i.test(buildGradle);
}
