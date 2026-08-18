---
description: 00 — 项目结构与构建
---

# 00 — 项目结构与构建

> 适用版本：Fabric 1.14.4

---

## 约束

### Java 版本

- **必须使用 Java 8**（Fabric 1.14.4 要求；1.15+ 才需要更高版本）
- `build.gradle` 中声明 `sourceCompatibility = JavaVersion.VERSION_1_8`
- Gradle Wrapper 版本不低于 **Gradle 6.9.x**
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
./gradlew clean
./gradlew loom

# 生成 IDE 项目文件
./gradlew idea   # IntelliJ IDEA
./gradlew eclipse # Eclipse
./gradlew vscode  # VS Code
```

### 版本号管理

- 所有版本号集中在 `gradle.properties` 管理，不硬编码在 `build.gradle`
- `gradle.properties` 必须包含：
  ```properties
  minecraft_version=1.14.4
  yarn_mappings=1.14.4+build.18
  loader_version=0.3.2
  fabric_api_version=0.28.5+1.14
  mod_version=1.0.0
  mod_id=examplemod
  maven_group=com.example
  ```

### Mappings 约束

- Fabric 1.14.4 使用 **Yarn**
- `mappings` 配置：`net.fabricmc:yarn:${yarn_mappings}:v2`
- **禁止**切换到 MCP 或 Mojang（除非用户明确要求）
- Yarn 映射使用 `method_XXXXX` / `field_XXXXX` 表示未解析的成员

---

## Decision Flow

### Decision: 选择项目初始化方式

```
IF 这是新项目（没有 build.gradle）
  → 使用 fabric/1.14.4/scaffold/ 中的模板生成项目骨架
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
  → 确认使用 Java 8，不兼容 Java 11+（1.14.x 要求 Java 8）

IF 报错包含 "Could not find net.fabricmc:yarn"
  → 确认 gradle.properties 中 yarn_mappings 版本格式正确（如 1.14.4+build.18）

IF 报错包含 "Mixin injection failed"
  → 确认 fabric.mixins.json 格式正确
  → 确认 mixin 包的包名与 fabric.mixins.json 中的 package 一致
  → 运行 ./gradlew clean loom

IF 报错包含 "No resource bundling found"
  → 这是正常的（非客户端打包时），可忽略
```

---

## 示例：正确的 build.gradle 结构（Fabric 1.14.4）

```groovy
plugins {
    id 'fabric-loom' version '0.4-SNAPSHOT'
    id 'maven-publish'
    id 'eclipse'
    id 'idea'
}

version = project.mod_version
group = project.maven_group

base {
    archivesName = project.mod_id
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

jar {
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
  "environment": "*",
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"]
  },
  "mixins": ["examplemod.mixins.json"],
  "depends": {
    "fabricloader": ">=0.3.2",
    "fabric-api": "*",
    "minecraft": ">=1.14.4",
    "java": ">=8"
  },
  "suggests": {}
}
```

- `id` 禁止包含 `-`（用 `_` 替代），必须全小写
- `version` 建议与 `gradle.properties` 中的 `mod_version` 保持一致
- `entrypoints` 中的类必须实现 `ModInitializer` 接口
- `depends` 中的 `fabricloader`、`minecraft` 是必需依赖
- `environment`：`"*"` 表示全平台，`"client"` 仅客户端，`"server"` 仅服务端
