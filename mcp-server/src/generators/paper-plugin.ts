/**
 * `generate_paper_plugin` —— **服务端面**（Paper 插件）工程骨架生成器。
 *
 * ## 为什么是「生成器」而不是知识树里的静态 scaffold
 * 模组面（forge/fabric/…）的 scaffold 是签入仓库 `<platform>/<ver>/scaffold/` 的**静态目录**，
 * 由五项 mod 专属门审计（`assert-scaffold-wrappers` / `-selfcheck` / `-mixin-shape` / `-rules-conflict`
 * / `assert-pack-meta-coverage`）。**服务端面不能走那条路**：那些门里 `-mixin-shape` 管的是 Mixin 注入形状、
 * `-rules-conflict` 管的是「scaffold 不得抄同档规则树」——**对 Bukkit 插件零相关**。硬塞进去 = 造一棵假档。
 *
 * ⇒ 本模块是**工具侧生成器**：只**返回文本**（`{ files }`），不写盘、不签入仓库；落盘由统一的
 * `maybeWriteGeneratorResult(...)`（默认 dry-run）负责。见根 `AGENTS.md`「服务端面」一节。
 *
 * ## 与模组面的四处结构性不对齐（照抄模组骨架必错）
 * | 维度 | 模组面 | 本面 |
 * |---|---|---|
 * | 载体 | `gradlew runClient` | **`gradlew runServer`**（没有客户端 ⇒ 客户端侧真按键/截图/GUI 原语全不适用） |
 * | API 层 | 直接打 `net.minecraft.*` | Bukkit/Paper **抽象层**（插件代码不碰 `net.minecraft.*`） |
 * | 生命周期 | `@Mod` + 事件总线 | **`plugin.yml` + `onEnable`** |
 * | 逐档 javap 改写表 | 核心资产 | **零适用**（插件开发者不需要 mappings） |
 *
 * ## 已核实 / 未核实的边界（**不凭记忆补**，本仓红线）
 * - ✅ **已核实（2026-10-15 探针）**：依赖坐标 `io.papermc.paper:paper-api` 在
 *   `https://repo.papermc.io/repository/maven-public/` **真实存在**（`maven-metadata.xml` HTTP 200），
 *   版本轴形如 `1.21.9-R0.1-SNAPSHOT`。
 * - ❌ **未核实**：该钉哪个版本串。maven 元数据 `<latest>` = `26.3-pre-2.build.0-alpha`（预发布 alpha），
 *   而 Paper Javadoc 站 `asOfVersion` = `26.3.build.178-stable` —— **两者形状不同**，不可想当然互换。
 *   ⇒ `paperApiVersion` 由调用方给；不给则生成一个**会在依赖解析时显式报错**的占位符，
 *   而不是静默落到 `latest`/`+` 上。
 * - ❌ **未核实**：JDK 主版本（`javaToolchain` 默认 `21` 只是占位）；`plugin.yml` 的 `api-version`。
 * - ❌ **未核实**：上游 `papermc/paper-plugin-template`（2026-10-15 探针 HTTP 000，与 `git clone` 被 RST
 *   同源）⇒ **不声称**本骨架由官方模板生成，`provenance` 标 `house`。
 */

import type { GeneratorResult } from "./common.js";

export interface PaperPluginOptions {
  /** 插件名（同时作为 `plugin.yml` 的 `name` 与主类名后缀）。须是合法 Java 标识符。 */
  pluginName: string;
  /** Java 包名，如 `com.example.myplugin`。 */
  packageName: string;
  /** `paper-api` 的**已核实版本串**。不给则生成会在解析期报错的占位符（不静默取 latest）。 */
  paperApiVersion?: string;
  /** JDK 主版本。默认 `21`（**占位，未核实**），可通过此处覆盖。 */
  javaToolchain?: string;
  /** `plugin.yml` 的 `api-version`。不给则留 `TODO-未核实`（写错会导致加载期拒绝）。 */
  apiVersion?: string;
}

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const PKG_RE = /^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/;

const UNPINNED = "UNPINNED-TODO-not-verified";

export function generatePaperPlugin(opts: PaperPluginOptions): GeneratorResult {
  const pluginName = String(opts.pluginName ?? "").trim();
  const packageName = String(opts.packageName ?? "").trim();
  if (!IDENT_RE.test(pluginName)) {
    throw new Error(`pluginName 不是合法 Java 标识符：${JSON.stringify(opts.pluginName)}`);
  }
  if (!PKG_RE.test(packageName)) {
    throw new Error(`packageName 不是合法 Java 包名：${JSON.stringify(opts.packageName)}`);
  }
  const toolchain = String(opts.javaToolchain ?? "21").trim();
  const apiVersion = opts.apiVersion ? String(opts.apiVersion).trim() : "TODO-未核实";
  const apiVer = opts.paperApiVersion ? String(opts.paperApiVersion).trim() : UNPINNED;

  const notes: string[] = [
    "本骨架由 generate_paper_plugin 生成：**服务端面**（独立于模组面），载体是 gradlew runServer 而不是 runClient。",
    `依赖坐标 io.papermc.paper:paper-api **已核实存在**（repo.papermc.io maven-metadata.xml HTTP 200）；` +
      (opts.paperApiVersion
        ? `本次使用调用方给的版本串 ${apiVer}（**该串本身是否与目标 Paper 线匹配未核实**）。`
        : `本次**未给版本串** ⇒ 生成占位符 ${UNPINNED}，依赖解析会**显式报错**（不静默取 latest）。`),
    `JDK 主版本 ${toolchain} 是**占位/调用方指定，未核实**（Paper 目标线要求的 JDK 未取证）。`,
    apiVersion === "TODO-未核实"
      ? "plugin.yml 的 api-version 留 `TODO-未核实`：该字段写错会导致加载期拒绝或行为漂移，按本仓红线不凭记忆填。"
      : `plugin.yml 的 api-version = ${apiVersion}（调用方指定）。`,
    "**未生成 gradle wrapper 四件**（gradlew / gradlew.bat / gradle/wrapper/gradle-wrapper.jar / .properties）：" +
      "其中 jar 是二进制，须由使用者自行 `gradle wrapper` 生成或从既有工程复制；本生成器**不产出二进制**。",
    "**未构建、未运行**：证据等级 = 结构壳。要抬到「真构件编译验证」需一次真 gradle build。",
  ];

  const files: Record<string, string> = {};

  files["settings.gradle"] = `// Paper 服务端插件工程 —— 由 generate_paper_plugin 生成（服务端面，独立于模组面）
// 注意：本面不用 mods.toml / fabric.mod.json；生命周期是 plugin.yml + onEnable。
rootProject.name = '${pluginName}'
`;

  files["build.gradle"] = `plugins {
    id 'java'
}

group = '${packageName}'
version = '1.0.0'

// 依赖坐标已核实存在；**版本串未核实** ⇒ 不写死，由 -PpaperApiVersion 传入。
def paperApiVersion = providers.gradleProperty('paperApiVersion').getOrElse('${apiVer}')
def javaToolchain = providers.gradleProperty('javaToolchain').getOrElse('${toolchain}').toInteger()

repositories {
    mavenCentral()
    maven { url = 'https://repo.papermc.io/repository/maven-public/' }
}

dependencies {
    compileOnly "io.papermc.paper:paper-api:\${paperApiVersion}"
}

java {
    toolchain { languageVersion = JavaLanguageVersion.of(javaToolchain) }
}

// 载体是**服务端**：runServer（不是 runClient）。
// 本任务**不代下 Paper 发行件** —— 使用者自备服务端目录（含发行 jar 与 eula.txt）。
tasks.register('runServer', JavaExec) {
    group = 'verification'
    description = '起一个 Paper 服务端（自备发行 jar 与 eula.txt；本任务不代下）'
    def serverDir = providers.gradleProperty('serverDir').getOrElse("\${layout.buildDirectory.get().asFile}/server")
    workingDir = file(serverDir)
    doFirst {
        if (!file(serverDir).exists()) {
            throw new GradleException("服务端目录不存在：\${serverDir}（先放入 Paper 发行 jar 与 eula.txt）")
        }
    }
}
`;

  files["plugin.yml"] = `# Paper 插件描述符 —— 服务端面的**载体判据**（不是 mods.toml / fabric.mod.json）
name: ${pluginName}
version: '1.0.0'
main: ${packageName}.${pluginName}
api-version: '${apiVersion}'
description: Paper 服务端插件（由 generate_paper_plugin 生成）
`;

  files[`src/main/java/${packageName.split(".").join("/")}/${pluginName}.java`] = `package ${packageName};

import org.bukkit.plugin.java.JavaPlugin;

/**
 * Paper 插件入口（服务端面）。
 *
 * <p>与模组面的四处不对齐见生成器文档；本类只做最小可用骨架：
 * 日志 + 一个可选的调度器示例，以及**服务端 driver 的注入位**。
 */
public final class ${pluginName} extends JavaPlugin {

    @Override
    public void onEnable() {
        getLogger().info("${pluginName} enabled");

        // ── 服务端 driver 注入位（生成器就位后在此加一行）──────────────────────
        // PlaytestQaServerDriver.register(this);
        //
        // 证据契约与客户端 driver **同名同目录**（判读器零改动）：
        //   state.json / exit-code.txt(仅 "0"/"1") / qa.log / rounds.jsonl / plan.txt
        // ⚠ qa.log 必须用 .log 后缀：判读器只收 /\\.log$/i，且统计 [QA] DONE 与 [QA] ERROR 两个标记；
        //   不打标记或换后缀都会被读成 absent。
        //
        // 服务端与客户端 driver 的差别在**注入点**：客户端靠 PlaytestQaDriver.register() 挂
        // ClientTickEvents；服务端要靠 JavaPlugin 的 onEnable + Bukkit.getScheduler().runTaskTimer。
    }

    @Override
    public void onDisable() {
        getLogger().info("${pluginName} disabled");
    }
}
`;

  files["README.md"] = `# ${pluginName}（Paper 插件骨架）

由 \`generate_paper_plugin\` 生成。**这是服务端面**，与模组面（Forge/Fabric/…）不同构。

## 三步起手

1. 补 gradle wrapper（本生成器**不产出二进制**）：
   \`gradle wrapper --gradle-version <你已核实的版本>\`
2. 填两处**必须由你决定**的值（我们故意不凭记忆写死）：
   - 依赖版本串：\`gradlew build -PpaperApiVersion=<已核实的 paper-api 版本串>\`
   - \`plugin.yml\` 的 \`api-version\`
3. \`gradlew build\` 出插件 jar；起服自备 Paper 发行 jar 与 \`eula.txt\`。

## 与模组面的四处不对齐

| 维度 | 模组面 | 本面 |
|---|---|---|
| 载体 | \`gradlew runClient\` | **\`gradlew runServer\`** |
| API 层 | \`net.minecraft.*\` | Bukkit/Paper **抽象层** |
| 生命周期 | \`@Mod\` + 事件总线 | **\`plugin.yml\` + \`onEnable\`** |
| 逐档 javap 改写表 | 核心资产 | **零适用** |

## 生成器的未核实清单（随生成结果一并返回）

${notes.map((n) => `- ${n}`).join("\n")}
`;

  // `code: null` = 生成成功（本模块无专属机读码；拒绝出口由 write-helper 的
  // `generatorRejectionAction(errors)` 单点分类）。未核实项走 `warnings`，随结果一并返回，
  // 让调用方**拿得到**「哪些是占位、哪些没验」，而不是只在注释里。
  return { code: null, files, warnings: notes };
}
