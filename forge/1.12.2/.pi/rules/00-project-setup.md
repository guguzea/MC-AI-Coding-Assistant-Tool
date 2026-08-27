---
description: 00 — 项目结构与构建
---

# 00 — 项目结构与构建

> 适用版本：Forge 1.12.2

---

## 约束

### Java 版本

- **必须使用 Java 8**（Forge 1.12.2 要求；Java 8 是 1.12.2 的标准版本）
- `build.gradle` 中声明 `sourceCompatibility = 1.8` 和 `targetCompatibility = 1.8`
- Gradle Wrapper 版本不低于 **Gradle 4.9**
- IDE（IDEA / Eclipse）需配置相同的 JDK 版本

### Gradle 约束

#### 禁止的操作

- ❌ 不要修改 `build.gradle` 中的 `minecraft` 和 `forge` 版本号
- ❌ 不要删除或注释 `minecraft` 和 `forge` 配置块中的任何必需行
- ❌ 不要混用 Fabric 的 `fabric-loom` 插件和 Forge 的 `forge` 插件

#### 正确的构建命令

```bash
# 首次构建（下载所有依赖，耗时较长）
./gradlew build

# 跳过测试构建
./gradlew build --no-build-cache --rerun-tasks

# 仅重新编译资源文件
./gradlew processResources

# 生成 Eclipse 项目
./gradlew eclipse

# 生成 IntelliJ 项目
./gradlew idea
```

### 版本号管理

- 所有版本号集中在 `gradle.properties` 管理
- `gradle.properties` 必须包含：
  ```properties
  minecraft_version=1.12.2
  forge_version=14.23.5.2847
  ```

### MCP Mappings

- Forge 1.12.2 使用 **MCP SRG** 格式
- `mappings = "stable_39"` 在 `minecraft` 块中设置
- MCP 映射将混淆的 Minecraft 方法映射为可读名称，如 `func_12345_a` → `getHealth`

### 项目目录结构（强制规范）

```
src/main/java/
└── {groupId}/           # 例：com.example.mod
    ├── ExampleMod.java  # @Mod 入口类
    ├── CommonProxy.java # 通用代理
    ├── registry/        # 注册类
    ├── blocks/         # 方块类
    ├── items/          # 物品类
    ├── entities/        # 实体类
    ├── init/           # 事件订阅类
    └── client/         # 客户端专用代码
        └── ClientProxy.java

src/main/resources/
├── mcmod.info          # Forge 元数据（必需）
├── pack.mcmeta         # 资源包标识（必需）
└── assets/
    └── {modid}/       # 资源文件
        ├── lang/
        ├── models/
        ├── blockstates/
        └── textures/
```

---

## Decision Flow

### Decision: 选择项目初始化方式

```
IF 这是新项目（没有 build.gradle）
  → 使用 forge/1.12.2/scaffold/ 中的模板生成项目骨架
  → README_AI.md 包含每个文件的职责说明

IF 这是已有项目
  → 读取 gradle.properties 获取版本配置
  → 读取 build.gradle 确认 mappings 和插件配置
  → 读取 mcmod.info 确认 modId

IF 构建失败且报错涉及版本号
  → 检查 gradle.properties 中的版本是否匹配
  → 典型错误：「Incompatible Java version」通常是 Java 版本不对
```

### Decision: 遇到 Gradle 构建报错时的处理顺序

```
IF 报错包含 "Could not resolve net.minecraftforge"
  → 检查网络连接，或配置 Maven 镜像
  → 检查 gradle.properties 中 forge_version 是否有效

IF 报错包含 "Incompatible Java version"
  → 确认使用 Java 8，不是 Java 11 或更高版本

IF 报错包含 "Could not find net.minecraftforge:forge"
  → 确认 build.gradle 中 minecraft_version 和 forge_version 版本匹配
  → Forge 版本对应关系：1.12.2 → 14.23.5.xxxx

IF 以上都不匹配
  → 将完整报错信息提供给用户，并指出可能的解决方向
```

---

## 示例：正确的 build.gradle 结构（Forge 1.12.2）

```groovy
buildscript {
    repositories {
        maven { url = "https://maven.minecraftforge.net/" }
        mavenCentral()
    }
    dependencies {
        classpath 'net.minecraftforge.gradle:ForgeGradle:2.3-SNAPSHOT'
    }
}

apply plugin: 'net.minecraftforge.gradle.forge'

version = mod_version
group = mod_group_id
archivesBaseName = mod_id

sourceCompatibility = targetCompatibility = 1.8

minecraft {
    version = minecraft_version
    runDir = "run"
    mappings = "stable_39"
    makeObfSourceJar = false
}

repositories {
    mavenCentral()
}

dependencies {
    // FG2：不要写 FG3 的 minecraft "net.minecraftforge:forge:..."；由 apply plugin: 'forge' 拉 Forge
}

jar {
    manifest {
        attributes([
            "Specification-Title"     : mod_id,
            "Specification-Vendor"    : mod_authors,
            "Specification-Version"   : "1",
            "Implementation-Title"   : project.name,
            "Implementation-Version" : project.jar.archiveVersion,
            "Implementation-Vendor"  : mod_authors,
            "Implementation-Timestamp": new Date().format("yyyy-MM-dd'T'HH:mm:ssZ")
        ])
    }
}
```

---

## mcmod.info 字段说明

生成或修改 `mcmod.info` 时，关注以下字段：

```json
[
  {
    "modid": "examplemod",
    "name": "Example Mod",
    "description": "Example mod description.",
    "version": "${version}",
    "mcversion": "${mcversion}",
    "url": "",
    "updateUrl": "",
    "authorList": ["AuthorName"],
    "credits": "Created by mod author",
    "logoFile": "",
    "screenshots": [],
    "dependencies": []
  }
]
```

- `modId` 禁止包含 `-`，必须全小写
- `mcversion` 必须与 Minecraft 版本匹配
- `dependencies` 可以包含其他 mod 的 modId
