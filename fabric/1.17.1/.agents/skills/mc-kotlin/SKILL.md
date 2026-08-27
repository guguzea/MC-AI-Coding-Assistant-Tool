---
name: mc-kotlin
description: Fabric Kotlin 语言支持。fabric-language-kotlin、kotlin("jvm")、@PublishedApi。触发词：Kotlin、fabric-language-kotlin、build.gradle.kts
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# Kotlin 语言支持（Fabric 1.17.1）

## 概述

Fabric 官方支持 Kotlin，通过 `fabric-language-kotlin` 和 Gradle Kotlin DSL 实现。

## 添加 Kotlin 支持

### 1. build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "1.9.20"
    id("fabric-loom") version "0.11-SNAPSHOT"  // ✅ 1.17.x 使用 0.11-SNAPSHOT
    id("maven-publish")
}

val minecraft_version: String by project
val yarn_mappings: String by project
val loader_version: String by project
val fabric_api_version: String by project

loom {
    accessWidenerPath.set(file("src/main/resources/examplemod.accesswidener"))
}

repositories {
    mavenCentral()
    maven(url = "https://maven.fabricmc.net/")
}

dependencies {
    minecraft("com.mojang:minecraft:${minecraft_version}")
    mappings(v2(yarn_mappings))
    modImplementation("net.fabricmc:fabric-loader:${loader_version}")
    modImplementation("net.fabricmc:fabric-language-kotlin:1.9.20+kotlin.1.9.20")

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
    "fabric-language-kotlin": ">=1.9.20+kotlin.1.9.20"
  }
}
```

## Kotlin 代码示例

```kotlin
// ExampleMod.kt
class ExampleMod : ModInitializer {
    companion object {
        val LOG = Logger.getLogger("examplemod")
    }

    override fun onInitialize() {
        LOG.info("Hello Fabric with Kotlin!")
        // Registry.register 用法相同，使用 Registry.ITEM（不是 Registries.ITEM）
    }
}
```

## 常见错误

- ❌忘记 `fabric-language-kotlin` 依赖 — Kotlin 代码无法运行
- ❌ Kotlin 版本与 fabric-language-kotlin 不匹配 — 兼容版本参考官方文档
- ❌ 在 `onInitialize()` 中使用 Kotlin 协程 — Minecraft 服务端不是多线程，协程需谨慎
- ❌ 使用 Loom 1.4-SNAPSHOT — 1.17.x 必须使用 0.11-SNAPSHOT

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Kotlin 语法糖使注册更简洁 |
| `mc-item` | Kotlin data class 用于物品数据 |
| `mc-block` | Kotlin 扩展函数简化方块逻辑 |
