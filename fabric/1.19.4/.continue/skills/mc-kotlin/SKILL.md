---
name: mc-kotlin
description: Fabric Kotlin 语言支持。fabric-language-kotlin、kotlin("jvm")、@PublishedApi。触发词：Kotlin、fabric-language-kotlin、build.gradle.kts
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# Kotlin 语言支持（Fabric 1.19.4）

## 概述

Fabric 官方支持 Kotlin，通过 `fabric-language-kotlin` 和 Gradle Kotlin DSL 实现。

## 添加 Kotlin 支持

### 1. build.gradle.kts

```kotlin
plugins {
    kotlin("jvm") version "1.9.20"
    id("fabric-loom") version "1.0.18"
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
    modImplementation("net.fabricmc:fabric-language-kotlin:1.10.8+kotlin.1.9.0")

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
    "fabric-language-kotlin": ">=1.10.8+kotlin.1.9.0"
  }
}
```

## Kotlin 代码示例

```kotlin
// ExampleMod.kt
// TODO(未核实)：旧示例的 `@AutoStorageAware` 注解与 `override val modId / modName / version`
//   均为编造成员 —— Fabric Loader 的 net.fabricmc.api.ModInitializer 只声明
//   onInitialize()，没有任何 modId / modName / version 可供 override；
//   @AutoStorageAware 在本包语料（data/fabric_1.19.4/**）里零出处，也未走
//   ingest_loader_api 入库。待入库核实后再恢复，禁止凭记忆补注解与方法名。
class ExampleMod : ModInitializer {
    companion object {
        // TODO(未核实)：日志器取法未在本档核实（旧示例写成 Logger.getLogger(modId)，
        //   依赖上面已被删的 modId）。请照同档 scaffold 的 Java 写法自取常量后再填。
        // val LOG = ...
    }

    override fun onInitialize() {
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

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | Kotlin 语法糖使注册更简洁 |
| `mc-item` | Kotlin data class 用于物品数据 |
| `mc-block` | Kotlin 扩展函数简化方块逻辑 |
