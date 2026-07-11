# Forge 1.14.4 Scaffold Template

本目录包含 Forge 1.14.4 模组项目的基础模板。

## 文件说明

| 文件 | 用途 |
|------|------|
| `build.gradle` | Gradle 构建配置，定义 Forge 依赖和构建任务 |
| `settings.gradle` | 项目设置，配置插件仓库 |
| `gradle.properties` | 版本号集中管理（修改这里） |
| `gradle/wrapper/gradle-wrapper.properties` | Gradle Wrapper 配置 |
| `src/main/resources/META-INF/mods.toml` | Forge 元数据配置 |
| `src/main/resources/pack.mcmeta` | 资源包标识 |
| `src/main/java/.../ExampleMod.java` | 模组入口类 |
| `.gitignore` | Git 忽略文件 |

## 使用方法

1. 复制整个 `scaffold` 目录到新项目
2. 修改 `gradle.properties` 中的模组信息：
   - `mod_id` - 模组 ID（必须小写，无横杠）
   - `mod_name` - 显示名称
   - `mod_version` - 版本号
   - `mod_group_id` - Java 包名
3. 重命名 Java 包和类
4. 运行 `./gradlew setupDecompWorkspace` 初始化
5. 运行 `./gradlew idea` 或 `./gradlew eclipse` 生成 IDE 项目

## 版本信息

- Minecraft: 1.14.4
- Forge: 28.2.0
- Java: 11
- Gradle: 7.6
- Mappings: MCP snapshot

## 目录结构

```
src/main/java/
└── com/example/examplemod/
    └── ExampleMod.java

src/main/resources/
├── META-INF/
│   └── mods.toml
└── pack.mcmeta
```
