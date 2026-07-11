---
version: "1.21.1"
platform: fabric
description: |
  Fabric 1.21.1 Kotlin 语言支持速查卡。

## Kotlin 支持

Fabric 支持使用 Kotlin 编写模组代码。

### Gradle 配置

```groovy
plugins {
    id 'fabric-loom' version '1.3-SNAPSHOT'
    id 'org.jetbrains.kotlin.jvm' version '1.9.22'
    id 'org.jetbrains.kotlin.plugin.serialization' version '1.9.22'
}

dependencies {
    modImplementation "net.fabricmc:fabric-loader:${project.loader_version}"
    implementation "org.jetbrains.kotlin:kotlin-stdlib:1.9.22"
}
```

### Kotlin DSL 构建脚本

```kotlin
plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
}

repositories {
    mavenCentral()
    maven("https://maven.fabricmc.net/")
}

dependencies {
    minecraft("com.mojang:minecraft:${project.minecraft_version}")
    mappings("net.fabricmc:yarn:${project.yarn_mappings}:v2")
    modImplementation("net.fabricmc:fabric-loader:${project.loader_version}")
    modImplementation("net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}")
}

kotlin {
    jvmToolchain(21)
}
```

## Kotlin 入口点

```kotlin
class ExampleMod : FabricMod {
    override fun onInitialize() {
        LOGGER.info("Hello Fabric using Kotlin!")
    }
}
```

## Kotlin 数据类

```kotlin
// 数据类示例
data class MyData(
    val id: String,
    val value: Int,
    val items: List<ItemStack> = emptyList()
)
```

## Coroutines 支持

```kotlin
// 使用 Kotlin Coroutines
suspend fun doAsyncWork() = withContext(Dispatchers.IO) {
    // 异步工作
}
```

## 注意事项

- ✅ Kotlin 1.9.22 与 Java 21 兼容
- ✅ Kotlin 序列化插件支持 Minecraft NBT
- ❌ 避免混用 Java 和 Kotlin 类型转换
- ✅ 使用 Kotlin DSL 编写 Mixin 配置
