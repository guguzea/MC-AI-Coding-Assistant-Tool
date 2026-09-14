---
name: mc-kotlin
description: Fabric Kotlin 语言支持。fabric-language-kotlin、kotlin("jvm")、@PublishedApi。触发词：Kotlin、fabric-language-kotlin、build.gradle.kts
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# Kotlin 语言支持（Fabric 1.21.3）

## 概述

Fabric 官方支持 Kotlin，通过 `fabric-language-kotlin` 和 Gradle Kotlin DSL 实现。

## 添加 Kotlin 支持

### 1. build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    id("fabric-loom") version "1.8"          // 与本档 scaffold/build.gradle:2 同值；旧写法 1.3-SNAPSHOT 是 1.20.1 模板残留
    id("maven-publish")
}

val minecraft_version: String by project
val yarn_mappings: String by project
val loader_version: String by project
val fabric_api_version: String by project

loom {
    accessWidenerPath.set(file("src/main/resources/examplemod.accesswidener"))
    // 原示例此处还有 kotlin { minecraftVersion.set(...) / yarnMappings.set(...) }：Loom 没有这个 DSL 块，已删
    // （本档 scaffold/build.gradle:20-22 的 loom {} 里只有 accessWidenerPath 一项）
}

repositories {
    mavenCentral()
    maven(url = "https://maven.fabricmc.net/")
}

dependencies {
    minecraft("com.mojang:minecraft:${minecraft_version}")
    // 本档口径是字符串形式（scaffold/build.gradle:26）；v2(yarn_mappings) 不是 Loom 的 DSL
    mappings("net.fabricmc:yarn:${yarn_mappings}:v2")
    modImplementation("net.fabricmc:fabric-loader:${loader_version}")
    modImplementation("net.fabricmc:fabric-language-kotlin:1.11.0+kotlin.2.0.0")

    modApi("net.fabricmc.fabric-api:fabric-api:${fabric_api_version}")
}

tasks.processResources {
    inputs.property("version", project.version)
    filesMatching("fabric.mod.json") {
        expand("version" to project.version)
    }
}
```

> **fabric-language-kotlin 坐标口径（读值日期 2026-09-13）**：原写 `2.1.0+kotlin.2.0.0`，上游 `https://maven.fabricmc.net/net/fabricmc/fabric-language-kotlin/maven-metadata.xml`（111 个版本，lastUpdated 20260907124859）里没有这一号，HTTP 404。现改为该表中与上面 `kotlin("jvm") version "2.0.0"` 唯一配对的 `1.11.0+kotlin.2.0.0`；同表当前最新是 `1.14.1+kotlin.2.4.20`。
> **未核实**：`1.11.0+kotlin.2.0.0` 与本档 MC 1.21.3 的官方兼容矩阵——语料 `fabric-wiki/1.21.3/processed/tutorial_kotlin.md:72` 只说「按官方 README 取合适版本」，本次 GitHub 不可达未读取该 README。

### 2. fabric.mod.json 中的 Kotlin 依赖

```json
{
  "entrypoints": {
    "main": [
      {
        "adapter": "kotlin",
        "value": "com.example.examplemod.ExampleMod"
      }
    ]
  },
  "depends": {
    "fabric-language-kotlin": ">=1.11.0+kotlin.2.0.0"
  }
}
```

> 两处更正（F185，2026-09-13）：① 原片段的 `depends` 写 `">=2.1.0"`，缺 `+kotlin.x.y.z` 后缀；语料 `fabric-wiki/1.21.3/processed/tutorial_kotlin.md:92` 的写法是完整带后缀的。② 原片段没有 `entrypoints`，而 Kotlin 模组的入口点必须带 `"adapter": "kotlin"`（同一页 :86）。

## Kotlin 代码示例

```kotlin
// ExampleMod.kt
import net.fabricmc.api.ModInitializer
import org.slf4j.LoggerFactory

class ExampleMod : ModInitializer {
    companion object {
        const val MOD_ID = "examplemod"
        val LOGGER = LoggerFactory.getLogger(MOD_ID)
    }

    override fun onInitialize() {
        LOGGER.info("Hello Fabric with Kotlin!")
        // Registry.register 用法与 Java 相同
    }
}
```

> 更正（F185，2026-09-13）：原示例带 `@AutoStorageAware` 注解，并在 `ModInitializer` 实现类里 `override val modId / modName / version`。`ModInitializer` 没有可覆写的这些成员——本档 `scaffold/src/main/java/com/example/examplemod/ExampleMod.java:7-12` 的实现只覆写 `onInitialize()`；`@AutoStorageAware` 在本档语料与 yarn 全量映射里都查不到（yarn 只覆盖原版类，所以这是「未见依据」而非「证明上游不存在」）。日志器按 scaffold 用 `org.slf4j.LoggerFactory`。

## @PublishedApi 注解

用于暴露私有成员的公共 API：

```kotlin
// @PublishedApi：public inline 函数只能访问 public 成员或被 @PublishedApi 标注的 internal 成员
class MyItem(settings: Settings) : Item(settings) {
    companion object {
        const val MOD_ID = "examplemod"

        @PublishedApi
        internal val defaultSettings: Settings = Settings()

        val MY_ITEM: Item = Registry.register(
            Registries.ITEM,
            Identifier.of(MOD_ID, "my_item"),
            MyItem(defaultSettings)
        )
    }
}
```

> 更正（F185，2026-09-13）：原示例在同一个类里写了 `companion object { … }` 与 `private companion object { … }` 两段——一个类只能有一个伴生对象，这段代码编译不过；`Identifier(MOD_ID, "my_item")` 也改成本档统一的 `Identifier.of(...)` 写法（依据见 `knowledge/antipatterns/registry.md` §5）。`@PublishedApi` 的语义措辞以 Kotlin 官方文档为准，本次网络不可达，**未核实**。

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
