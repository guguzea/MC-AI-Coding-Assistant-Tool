---
description: 00 — 项目结构与构建
---

# 00 — 项目结构与构建

> 适用版本：Fabric 1.19.4

---

## 约束

### Java 版本

- **必须使用 Java 17**（Fabric 1.19.x 要求；Java 21 仅在 Minecraft 1.21+ 才需要）
- `build.gradle` 中声明 `java.toolchain.languageVersion = JavaLanguageVersion.of(17)` 或 `sourceCompatibility = JavaVersion.VERSION_17`
- Gradle Wrapper 版本不低于 **Gradle 7.6**
- IDE（IDEA / VSCode）需配置相同的 JDK 版本

### Loom / Gradle 约束

#### 禁止的操作

- ❌ 不要混用 Fabric 的 `fabric-loom` 插件和 Forge 的 `forge` 插件
- ❌ 不要删除 `loom` 配置块中的必需行
- ❌ 不要在 `minecraft {}` 块中修改版本号（应通过 `dependencies` 或 `mappings` 配置）
- ❌ 不要在 `onInitialize()` 之外注册任何内容（Mixin 初始化除外）

#### 正确的构建命令

```bash
# 首次构建（下载所有依赖，耗时较长）
./gradlew build

# 跳过测试构建
./gradlew build --no-build-cache --rerun-tasks

# 仅重新编译资源文件
./gradlew processResources

# 刷新 Loom（修复 mappings 问题后必需执行）
./gradlew clean loom

# 在 IDEA 中同步项目后，使用 IDE 内置构建
```

### 版本号管理

- 所有版本号集中在 `gradle.properties` 管理，不硬编码在 `build.gradle`
- `gradle.properties` 必须包含：
  ```properties
  minecraft_version=1.19.4
  yarn_mappings=1.19.4+build.2
  loader_version=0.14.21
  fabric_api_version=0.87.2+1.19.4
  ```
- **禁止**在 `build.gradle` 中直接写版本号，必须引用 `${minecraft_version}` 等属性

### Mappings 约束

- Fabric 1.19.4 默认使用 **Yarn**
- `mappings` 配置：`net.fabricmc:yarn:${yarn_mappings}:v2`
- **禁止**切换到 MCP 或 Mojang（除非用户明确要求）
- Yarn 映射使用 `class_XXXXX` / `method_XXXXX` / `field_XXXXX` 表示未解析的成员

---

## Decision Flow

### Decision: 选择项目初始化方式

```
IF 这是新项目（没有 build.gradle）
  → 使用 fabric/1.19.4/scaffold/ 中的模板生成项目骨架
  → README_AI.md 包含每个文件的职责说明

IF 这是已有项目
  → 读取 gradle.properties 获取版本配置
  → 读取 build.gradle 确认 Loom 配置和 mappings
  → 读取 fabric.mod.json 确认 modId 和 entrypoints
```

### Decision: 遇到 Gradle/Loom 构建报错时的处理顺序

```
IF 报错包含 "Could not resolve net.fabricmc"
  → 检查 Maven 仓库配置（Fabric Maven 必须在 repositories 中）
  → 检查网络连接

IF 报错包含 "Incompatible Java version"
  → 确认使用 Java 17，不兼容 Java 8 或 Java 21

IF 报错包含 "Could not find net.fabricmc:yarn"
  → 确认 gradle.properties 中 yarn_mappings 版本格式正确（如 1.19.4+build.2）

IF 报错包含 "Mixin injection failed"
  → 确认 fabric.mixins.json 格式正确
  → 确认 mixin 包的包名与 fabric.mixins.json 中的 package 一致
  → 运行 ./gradlew clean loom

IF 报错包含 "No resource bundling found"
  → 这是正常的（非客户端打包时），可忽略
```

---

## 示例：正确的 build.gradle 结构（Fabric 1.19.4）

```groovy
plugins {
    id 'fabric-loom' version '0.14-SNAPSHOT'
    id 'maven-publish'
    id 'eclipse'
    id 'idea'
}

version = project.mod_version
group = project.maven_group

base {
    archivesName = project.mod_id
}

loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
}

repositories {
    mavenCentral()
    maven { url "https://maven.fabricmc.net/" }
}

dependencies {
    minecraft "com.mojang:minecraft:${project.minecraft_version}"
    mappings "net.fabricmc:yarn:${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:${project.loader_version}"

    // Fabric API（选择性引入，* 表示兼容版本）
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}

processResources {
    inputs.property "version", project.version
    inputs.property "minecraft_version", project.minecraft_version
    inputs.property "yarn_mappings", project.yarn_mappings
    inputs.property "loader_version", project.loader_version

    filesMatching(["fabric.mod.json", "pack.mcmeta"]) {
        expand "version": project.version,
            "minecraft_version": project.minecraft_version,
            "yarn_mappings": project.yarn_mappings,
            "loader_version": project.loader_version
    }
}

tasks.named('jar').configure {
    manifest {
        attributes([
            "Fabric-ModuleType": "Lib",
            "Implementation-Title": project.name,
            "Implementation-Version": project.jar.archiveVersion,
            "Implementation-Vendor": project.maven_group
        ])
    }
}
```

---

## fabric.mod.json 字段说明

生成或修改 `fabric.mod.json` 时，关注以下字段：

```json
{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "1.0.0",
  "name": "Example Mod",
  "description": "Example mod description",
  "authors": ["YourNameHere"],
  "contact": {
    "homepage": "https://fabricmc.net"
  },
  "license": "MIT",
  "icon": "assets/examplemod/icon.png",
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"]
  },
  "mixins": ["examplemod.mixins.json"],
  "depends": {
    "fabricloader": ">=0.14.0",
    "fabric-api": "*",
    "minecraft": ">=1.19.4",
    "java": ">=17"
  },
  "suggests": {}
}
```

> **注意**：Fabric 1.19.4 的 `fabric.mod.json` **没有** `environment` 字段，这是 1.20+ 才引入的。

- `id` 必须全小写；允许字母/数字/下划线/连字符（官方示例 `example-mod`）
- `version` 建议与 `gradle.properties` 中的 `mod_version` 保持一致
- `entrypoints` 中的类必须实现 `ModInitializer`（client 为 `ClientModInitializer`）
- `depends` 中的 `fabricloader`、`minecraft` 是必需依赖
