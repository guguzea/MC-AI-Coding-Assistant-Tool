---
description: 00 — 项目结构与构建
---

# 00 — 项目结构与构建

> 适用版本：Forge 1.17.1

---

## 约束

### Java 版本

- **必须使用 Java 16**（Forge 1.17.1 要求；Java 17 仅在 Minecraft 1.18+ 才需要）
- `build.gradle` 中声明 `sourceCompatibility = JavaVersion.VERSION_16` 或通过 toolchain `java.toolchain.languageVersion = JavaLanguageVersion.of(16)`
- Gradle Wrapper 必须是官方 MDK 的 **Gradle 7.2** + `buildscript` `ForgeGradle:5.1.+`（不要用 plugins DSL `[4.1.5,4.2)`）
- IDE（IDEA / VSCode）需配置相同的 JDK 版本

### Gradle 约束

#### 禁止的操作

- ❌ 不要手动运行 `build` 任务以外的 Gradle 命令（`compileJava`、`processResources` 等应通过 `build` 间接触发）
- ❌ 不要修改 `build.gradle` 中的 `minecraft` 和 `forge` 版本号（这两个版本号必须与项目目标版本匹配）
- ❌ 不要删除或注释 `minecraft` 和 `forge` 配置块中的任何必需行
- ❌ 不要混用 Fabric 的 `loom` 插件和 Forge 的 `forge` 插件

#### 正确的构建命令

```bash
# 首次构建（下载所有依赖，耗时较长）
./gradlew build

# 跳过测试构建
./gradlew build --no-build-cache --rerun-tasks

# 仅重新编译资源文件
./gradlew processResources

# 在 IDEA 中同步项目后，使用 IDE 内置构建
```

### 版本号管理

- 所有版本号集中在 `gradle.properties` 管理，不硬编码在 `build.gradle`
- `gradle.properties` 必须包含：
  ```properties
  minecraft_version=1.17.1
  forge_version=37.1.1
  mapping_channel=official
  mapping_version=1.17.1
  loader_version_range=[37,)
  ```
  > 注意：
  > - `build.gradle` 中引用时用 `mapping_version`（不带 s），属性名必须与 `build.gradle` 中的 `${property名}` 完全一致
  > - `loader_version` 填 Forge 版本号，与 mods.toml 中的 `loaderVersion` 字段对应
- **禁止在 `build.gradle` 中直接写版本号**，必须引用 `${minecraft_version}` 等属性

### Mappings 约束

- Forge 1.17.1 官方 MDK 使用 **official** 映射（`version: '1.17.1'`，不是日期戳 `20210624.103621`）
- `gradle.properties` 中的 `mapping_version` 必须是 `1.17.1`；不要使用不存在的 Parchment `2021.09.06`
- **禁止**在 `build.gradle` 中切换到 `yarn`（Fabric 专属）
- official 映射将混淆的 Minecraft 方法映射为 Mojang 可读名称

### 项目目录结构（强制规范）

```
src/main/java/
└── {groupId}/           # 例：com.example.mod
    ├── ExampleMod.java  # @Mod 入口类
    ├── registry/        # 注册类
    ├── blocks/         # 方块类
    ├── items/          # 物品类
    ├── entities/       # 实体类
    ├── init/           # 事件订阅类
    └── client/         # 客户端专用代码（可选）

src/main/resources/
├── META-INF/
│   └── mods.toml       # Forge 元数据（必需）
├── pack.mcmeta         # 资源包标识（必需）
└── assets/
    └── {modid}/        # 资源文件
        ├── lang/
        ├── models/
        ├── blockstates/
        └── textures/
```

- **禁止**将 Java 源码放在 `client` 包以外的任何地方
- **禁止**在 `resources/assets/{modid}` 目录使用大写文件名（资源路径全小写）

---

## Decision Flow

### Decision: 选择项目初始化方式

```
IF 这是新项目（没有 build.gradle）
  → 使用 forge/1.17.1/scaffold/ 中的模板生成项目骨架
  → README_AI.md 包含每个文件的职责说明

IF 这是已有项目
  → 读取 gradle.properties 获取版本配置
  → 读取 build.gradle 确认 mappings 和插件配置
  → 读取 mods.toml 确认 modId

IF 构建失败且报错涉及版本号
  → 检查 gradle.properties 中的版本是否匹配
  → 典型错误：「net.minecraftforge.fml.loading.FMLError」通常是 forge_version 不兼容
```

### Decision: 遇到 Gradle 构建报错时的处理顺序

```
IF 报错包含 "Could not resolve net.minecraftforge"
  → 检查网络连接，或配置 Maven 镜像
  → 检查 gradle.properties 中 forge_version 是否有效

IF 报错包含 "Incompatible Java version"
  → 确认使用 Java 16，不兼容 Java 8 或 Java 17（仅 1.18+ 才需要 17）

IF 报错包含 "Could not find net.minecraftforge:forge"
  → 确认 build.gradle 中 minecraft_version 和 forge_version 版本匹配
  → Forge 版本对应关系：1.17.1 → 37.x.x

IF 报错包含 "No resource bundling found"
  → 这是正常的（非客户端打包时），可忽略

IF 以上都不匹配
  → 将完整报错信息提供给用户，并指出可能的解决方向
```

---

## 示例：正确的 build.gradle 结构（Forge 1.17.1）

```groovy
// 官方 1.17.1-37.1.1 MDK：FG5，不是 plugins [4.1.5,4.2)
buildscript {
    repositories {
        maven { url = 'https://maven.minecraftforge.net' }
        mavenCentral()
    }
    dependencies {
        classpath group: 'net.minecraftforge.gradle', name: 'ForgeGradle', version: '5.1.+', changing: true
    }
}
apply plugin: 'net.minecraftforge.gradle'
apply plugin: 'eclipse'
apply plugin: 'maven-publish'

version = mod_version
group = mod_group_id
archivesBaseName = mod_id

java.toolchain.languageVersion = JavaLanguageVersion.of(16)

minecraft {
    mappings channel: 'official', version: '1.17.1'
    copyIdeResources = true

    runs {
        configureEach {
            workingDirectory project.file('run')
            property 'forge.logging.markers', 'REGISTRIES'
            property 'forge.logging.console.level', 'debug'
            property 'forge.enabledGameTestNamespaces', mod_id
            mods {
                "${mod_id}" {
                    source sourceSets.main
                }
            }
        }
        client {
            property 'forge.enabledGameTestNamespaces', mod_id
        }
        server {
            property 'forge.enabledGameTestNamespaces', mod_id
            args '--nogui'
        }
        data {
            workingDirectory project.file('run-data')
            args '--mod', mod_id, '--all',
                '--output', file('src/generated/resources/'),
                '--existing', file('src/main/resources/')
        }
    }
}

sourceSets.main.resources { srcDir 'src/generated/resources' }

repositories {
    mavenCentral()
    maven { url = 'https://maven.parchmentmc.org' }
}

dependencies {
    minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
}

tasks.named('processResources', ProcessResources).configure {
    def replaceProperties = [
        minecraft_version      : minecraft_version,
        minecraft_version_range: "[${minecraft_version},)",
        forge_version          : forge_version,
        forge_version_range    : "[${forge_version},)",
        loader_version_range   : "[${loader_version},)",
        mod_id              : mod_id,
        mod_name            : mod_name,
        mod_license         : mod_license,
        mod_version         : mod_version,
        mod_authors         : mod_authors,
        mod_description     : mod_description,
    ]
    inputs.properties replaceProperties

    filesMatching(['META-INF/mods.toml', 'pack.mcmeta']) {
        expand replaceProperties + [project: project]
    }
}

tasks.named('jar', Jar).configure {
    manifest {
        attributes(
            'Specification-Title'     : mod_id,
            'Specification-Vendor'     : mod_authors,
            'Specification-Version' : '1',
            'Implementation-Title'   : project.name,
            'Implementation-Version'  : project.jar.archiveVersion,
            'Implementation-Vendor'  : mod_authors,
            'Implementation-Timestamp': new Date().format("yyyy-MM-dd'T'HH:mm:ssZ")
        )
    }
    finalizedBy 'reobfJar'
}

publishing {
    publications {
        register('mavenJava', MavenPublication) {
            artifact jar
        }
    }
    repositories {
        maven {
            url "file://${project.projectDir}/mcmodsrepo"
        }
    }
}

tasks.withType(JavaCompile).configureEach {
    options.encoding = 'UTF-8'
}
```

---

## mods.toml 字段说明

生成或修改 `mods.toml` 时，关注以下字段：

```toml
[[mods]]
modId = "examplemod"          # 必需：必须小写，无横杠
version = "${mod_version}"    # 必需：建议使用 gradle 占位符
displayName = "Example Mod"   # 必需
description = '''多行描述'''  # 必需

# 可选字段
authors = "YourNameHere"      # 可选，作者列表
license = "MIT"               # 可选，许可证

# dependencies 块（可选但推荐）
[[dependencies.examplemod]]
modId = "forge"               # 必需
mandatory = true              # 必需
versionRange = "[37,)"        # 必需：Forge 版本范围
ordering = "NONE"             # 可选：NONE / BEFORE / AFTER
side = "BOTH"                 # 可选：BOTH / CLIENT / SERVER

[[dependencies.examplemod]]
modId = "minecraft"
mandatory = true
versionRange = "[1.17.1,1.18)"
ordering = "NONE"
side = "BOTH"
```

- `modId` 禁止包含 `-`，必须全小写
- `version` 建议与 `gradle.properties` 中的 `mod_version` 保持一致
- `[[dependencies.xxx]]` 的 `modId` 必须与外层 `modId` 一致
- `loaderVersion` 的格式：`"[37,)"` 表示 Forge 37 及以上
