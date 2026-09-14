# Example Mod - AI 开发指南

> 本文件是 AI 助手在开发此模组时的参考指南。

> **⚠️ Forge 1.12.2 `scaffold/` 与官方 MDK 存在代差 —— 有意保留，不是缺陷；禁止为了「对齐」去改 scaffold 钉值。**
> 保留理由：本档 scaffold 钉值已在本仓真机 build 记过账（`pack.meta.json` → `buildVerified: true`，覆盖 `:compileJava` + `:reobfJar`；进游戏后的行为未验），改值会使既有构建账失效。
> 需要新版工具链：自行调用 `download_official_mdk`（默认 dryRun，只落到 `$MC_SKILL_CACHE`，不写仓库），再把返回值填进**你自己的工程**。

> | 字段 | 本档 `scaffold/` | 官方 MDK |
> | --- | --- | --- |
> | Gradle Wrapper | `scaffold/gradle/wrapper/gradle-wrapper.properties:1` → `gradle-4.9-bin` | `gradle-4.9-bin`（同） |
> | ForgeGradle | `scaffold/build.gradle:8` → `ForgeGradle:2.3-SNAPSHOT` | `build.gradle:7` → `ForgeGradle:3.+` |
> | Forge | `scaffold/build.gradle:22` + `gradle.properties:6` → `1.12.2-14.23.5.2847` | `build.gradle:62` → `1.12.2-14.23.5.2859` |
> | mappings | `scaffold/build.gradle:24` + `gradle.properties:7` → `stable_39` | `build.gradle:26` → `channel: 'snapshot', version: '20171003-1.12'` |

> **取证与局限（2026-09-14 实读）**
> - 官方侧来源：`%APPDATA%\mc-skill-cache\mdk\forge\1.12.2\forgegradle\unpacked\`{gradle.properties, build.gradle, gradle/wrapper/gradle-wrapper.properties}；
>   本仓侧来源：本目录 `gradle.properties` / `build.gradle` / `gradle/wrapper/gradle-wrapper.properties`。
>   两侧值均逐行实读，非训练记忆。
> - 环境局限：本机 `JAVA_HOME` **未设**，PATH 上的 `java` 是 **Java 8（1.8.0_431）**。
>   任何复现取证 / Gradle 调用必须**显式**把 `JAVA_HOME` 指到 JDK 17
>   （本机：`G:/JAVA17/jdk-17.0.12_windows-x64_bin/jdk-17.0.12`），否则 FG6 档（1.20.x）直接 fail。
> - **禁止**在本仓库 `scaffold/` 目录内跑 Gradle。要跑先复制到仓库外的临时目录。

## 快速开始

1. 运行 `gradlew setupDecompWorkspace` 设置开发环境
2. 运行 `gradlew idea` 或 `gradlew eclipse` 生成 IDE 项目
3. 打开 IDE 导入项目
4. 运行 `gradlew runClient` 启动游戏

## Forge 1.12.2 关键点

- **Java**: 必须使用 Java 8
- **Gradle**: 4.9 + ForgeGradle 2.3
- **注册**: 使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`
- **pack_format**: 3（与同档 `pack.mcmeta:4` 一致；语料 `conventions_locations.md:22`）
- **Mappings**: stable_39 (MCP SRG)

## 项目结构

```
src/main/java/com/example/examplemod/
├── ExampleMod.java      # 主类
├── CommonProxy.java     # 通用代理
└── client/
    └── ClientProxy.java # 客户端代理

src/main/resources/
├── mcmod.info          # Mod 元数据
├── pack.mcmeta        # 资源包标识
└── assets/
    └── examplemod/    # 资源文件
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `gradlew setupDecompWorkspace` | 设置反编译环境 |
| `gradlew runClient` | 运行客户端 |
| `gradlew runServer` | 运行服务端 |
| `gradlew build` | 构建发布版本 |
| `gradlew reobfJar` | 重新混淆 jar |
