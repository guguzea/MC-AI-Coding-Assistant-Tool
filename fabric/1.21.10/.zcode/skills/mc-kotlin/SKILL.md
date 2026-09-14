---
name: mc-kotlin
description: Fabric Kotlin 语言支持。fabric-language-kotlin、kotlin("jvm")、@PublishedApi。触发词：Kotlin、fabric-language-kotlin、build.gradle.kts
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.4，仅作结构/流程提示，不是 1.21.10 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.10) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

# Kotlin 语言支持（Fabric 1.21.10）

## 概述

Fabric 官方支持 Kotlin，通过 `fabric-language-kotlin` 和 Gradle Kotlin DSL 实现。

## 添加 Kotlin 支持

### 1. build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    // 本档 Loom 插件 id 以同档 scaffold / rules 00 为准：1.21.x 混淆线用 net.fabricmc.fabric-loom-remap
    // （见 scaffold/build.gradle:4 与 .cursor/rules/00-project-setup.mdc:10）；
    // 旧文本的 fabric-loom + 1.3-SNAPSHOT 属未核实组合；去混淆的 26.x 才用 net.fabricmc.fabric-loom。
    id("net.fabricmc.fabric-loom-remap")
    id("maven-publish")
}

val minecraft_version: String by project
val yarn_mappings: String by project
val loader_version: String by project
val fabric_api_version: String by project

loom {
    accessWidenerPath.set(file("src/main/resources/examplemod.accesswidener"))
    kotlin {
        minecraftVersion.set(minecraft_version)
        yarnMappings.set(v2(yarn_mappings))
    }
}

repositories {
    mavenCentral()
    maven(url = "https://maven.fabricmc.net/")
}

dependencies {
    minecraft("com.mojang:minecraft:${minecraft_version}")
    mappings(v2(yarn_mappings))
    modImplementation("net.fabricmc:fabric-loader:${loader_version}")
    modImplementation("net.fabricmc:fabric-language-kotlin:2.1.0+kotlin.2.0.0")

    modApi("net.fabricmc.fabric-api:fabric-api:${fabric_api_version}")
}

tasks.processResources {
    inputs.property("version", project.version)
    filesMatching("fabric.mod.json") {
        expand("version" to project.version)
    }
}
```

### 2. fabric.mod.json 中的 Kotlin 依赖

```json
{
  "depends": {
    "fabric-language-kotlin": ">=2.1.0"
  }
}
```

## Kotlin 代码示例

```kotlin
// ExampleMod.kt
// TODO(未核实)：以下注解与 override 成员在全仓「已入库摘要」里零命中，禁止照抄：
//   · @AutoStorageAware —— mcp-server/data/lib-api-summaries/fabric-language-kotlin.json 只收录
//     net.fabricmc.language.kotlin.KotlinAdapter / KotlinLanguageAdapter 两个类；
//     mcp-server/data/loader-api-summaries/*-fabric-api.json 与 data/fabric_*/ 语料对该注解零命中。
//   · override val modId / modName / version —— 已入库摘要内没有 net.fabricmc.fabric.api.ModInitializer
//     条目（只有 FabricGameTestModInitializer），本仓未收录它的成员表，这三行同样属未核实。
// 归因：这些属未入库的第三方库 API。要用先按根 AGENTS.md 口径自备 jar 跑 ingest_loader_api（默认 dryRun），
// 再 query_loader_api 逐签名核对；入库前只保留下面的结构壳。
class ExampleMod : ModInitializer {
    companion object {
        val LOG = Logger.getLogger("examplemod")
    }

    override fun onInitialize() {
        LOG.info("Hello Fabric with Kotlin!")
        // Registry.register 用法相同
    }
}
```

## @PublishedApi 注解

用于暴露私有成员的公共 API：

```kotlin
// @PublishedApi 用于在 lambda 中安全访问私有字段
class MyItem(settings: Settings) : Item(settings) {
    companion object {
        val MY_ITEM: Item = Registry.register(
            Registries.ITEM,
            Identifier(MOD_ID, "my_item"),
            MyItem(Settings())
        )
    }

    // @PublishedApi 用于在 lambda 中调用
    private companion object {
        private const val MOD_ID = "examplemod"
    }
}
```

## 常见错误

- ❌忘记 `fabric-language-kotlin` 依赖 — Kotlin 代码无法运行
- ❌ Kotlin 版本与 fabric-language-kotlin 不匹配 — 兼容版本参考官方文档
- ❌ 在 `onInitialize()` 中使用 Kotlin 协程 — Minecraft 服务端不是多线程，协程需谨慎
- ❌ 使用旧的 Kotlin 版本 — 1.21.x 推荐 Kotlin 2.0.0

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Kotlin 语法糖使注册更简洁 |
| `mc-item` | Kotlin data class 用于物品数据 |
| `mc-block` | Kotlin 扩展函数简化方块逻辑 |
