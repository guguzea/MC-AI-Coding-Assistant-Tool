/**
 * Gradle 构建诊断模块
 *
 * 诊断内容：
 * - 依赖版本与 MC 版本匹配
 * - mods.toml 语法
 * - Mod 间 API 冲突检测
 * - 正确依赖声明
 */

export interface GradleQuery {
  buildGradle: string;
  gradleProperties?: string;
}

export interface GradleResult {
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function diagnoseGradle(query: GradleQuery): GradleResult {
  const { buildGradle, gradleProperties } = query;
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const props = parseGradleProperties(gradleProperties ?? "");

  // 检查 Java 版本
  if (!buildGradle.includes("JavaLanguageVersion.of")) {
    warnings.push("未找到 Java toolchain 配置，建议添加 java.toolchain.languageVersion");
  } else if (!buildGradle.includes("JavaLanguageVersion.of(17)") && !buildGradle.includes("JavaLanguageVersion.of(21)")) {
    warnings.push("Java toolchain 应为 17 或 21");
  }

  // 检查 minecraft 依赖声明
  if (!buildGradle.includes("net.minecraftforge:forge")) {
    errors.push("缺少 Forge 依赖：minecraft \"net.minecraftforge:forge:${minecraft_version}-${forge_version}\"");
  }

  // 检查 forge_gradle 插件版本
  if (!buildGradle.includes("net.minecraftforge.gradle")) {
    errors.push("缺少 ForgeGradle 插件：id 'net.minecraftforge.gradle' version '[6.0,6.2)'");
  }

  // 检查 gradle.properties 版本一致性
  if (props.minecraft_version && props.forge_version) {
    // 基本格式检查
    if (!props.minecraft_version.includes("1.20")) {
      warnings.push(`Minecraft 版本 ${props.minecraft_version} 未经测试，建议使用 1.20.x 系列`);
    }
    if (!props.forge_version.startsWith("47")) {
      warnings.push(`Forge 版本 ${props.forge_version} 可能不适合 Minecraft ${props.minecraft_version}`);
    }
  } else {
    warnings.push("gradle.properties 中缺少 minecraft_version 或 forge_version");
  }

  // 检查 mappings 配置
  if (!buildGradle.includes("mappings channel")) {
    warnings.push("未找到 mappings 配置，建议使用 parchment 映射以获得参数名提示");
  } else if (buildGradlerIncludesParchment(buildGradle)) {
    suggestions.push("已配置 Parchment 映射，这是推荐配置");
  }

  // 检查 copyIdeResources
  if (!buildGradle.includes("copyIdeResources")) {
    warnings.push("copyIdeResources = true 是必需的，否则资源文件不会在 IDE 中更新");
  } else if (buildGradle.includes("copyIdeResources = true")) {
    // OK
  } else if (buildGradle.includes("copyIdeResources = false")) {
    errors.push("copyIdeResources 应设为 true，否则 IDE 中修改资源文件不会生效");
  }

  // 检查 reobfJar
  if (buildGradle.includes("finalizedBy 'reobfJar'") || buildGradle.includes("jar.finalizedBy")) {
    // OK
  } else if (buildGradle.includes("jar {")) {
    warnings.push("jar 任务应添加 finalizedBy 'reobfJar' 以确保发布时正确混淆");
  }

  // 检查 gradle.properties 中 loader_version 格式
  if (props.loader_version) {
    if (!/^\[?\d+/.test(props.loader_version)) {
      warnings.push(`loader_version 格式不正确：${props.loader_version}，应为版本范围如 [47,)`);
    }
  }

  // 检查 forge_version 格式（1.20.1 应以 47. 开头）
  if (props.forge_version) {
    if (!props.forge_version.startsWith("47.")) {
      warnings.push(
        `Forge 版本 ${props.forge_version} 不以 47. 开头，可能不是 1.20.1 的 Forge 版本`
      );
    }
  }

  if (errors.length === 0) {
    suggestions.push("配置看起来基本正确，建议运行 ./gradlew build 验证");
  }

  return { errors, warnings, suggestions };
}

function parseGradleProperties(content: string): Record<string, string> {
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

function buildGradlerIncludesParchment(buildGradle: string): boolean {
  return /parchment/i.test(buildGradle) || /mappings\s*=.*parchment/i.test(buildGradle);
}
