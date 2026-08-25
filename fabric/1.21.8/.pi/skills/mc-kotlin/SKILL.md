[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.3，仅作结构/流程提示，不是 1.21.8 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.8) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-kotlin
description: Fabric Kotlin 语言支持。fabric-language-kotlin、kotlin("jvm")、@PublishedApi。触发词：Kotlin、fabric-language-kotlin、build.gradle.kts
platform: fabric
version: "1.21.8"
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
    id("fabric-loom") version "1.3-SNAPSHOT"
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
@AutoStorageAware
class ExampleMod : ModInitializer {
    override val modId = "examplemod"
    override val modName = "Example Mod"
    override val version = "1.0.0"

    companion object {
        val LOG = Logger.getLogger(modId)
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
