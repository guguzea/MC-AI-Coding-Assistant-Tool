# Fabric 1.14.4 — Agent 总纲

> 本规则集适用于 **Fabric 1.14.4**，推荐使用 Registry.register() 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 AGENTS.md 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Fabric |
| Minecraft 版本 | 1.14.4 |
| 注册方式 | Registry.register() 在 onInitialize() 中执行 |
| Java 版本 | **Java 8**（1.14.x 最低要求） |
| Gradle | Gradle 6.9.x + Loom |
| Mappings | **Yarn**（net.fabricmc:yarn:1.14.4+build.18）|
| Build 工具 | Loom（fabric-loom 插件） |
| Mod 元数据 | fabric.mod.json |
| Mixin 支持 | **需要显式 Mixin 插件配置**（1.14.x 不如新版本完善）|

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

- IF 项目中存在 src/main/resources/fabric.mod.json
  - IF fabric.mod.json 中 id 字段存在
    - 检查 build.gradle 中 Loom 配置
    - 继续加载本规则集（Fabric 1.14.4）
  - ELSE -> fabric.mod.json schema 版本不匹配，跳转根目录 AGENTS.md
- ELSE IF 项目中存在 src/main/resources/META-INF/mods.toml
  - 这是 Forge 项目，跳转到 ../forge/1.14.4/AGENTS.md
- ELSE -> 无法判断，询问用户确认平台和版本

### 本规则集的 IDE 加载优先级

各 AI 助手会优先读取自己对应的配置目录（零修改复刻自 Cursor）：

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| Claude Desktop | `.claude/rules/*.mdc` + `.claude/commands/` |
| Continue.dev | `.continue/rules/*.mdc` + `.continue/skills/` |
| Trae AI | `.trae/rules/*.mdc` + `.trae/skills/` |
| OpenCode | `AGENTS.md` + `.opencode/skills/` |
| Codex | `AGENTS.md` + `.agents/skills/` |
| ZCode | `AGENTS.md` + `.zcode/skills/` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，会降级读取本文件（`AGENTS.md`）和 `.cursor/` 目录。


---

## 与 Forge 的核心差异

| 维度 | Forge | Fabric |
|------|-------|--------|
| 注册时机 | modEventBus + RegisterEvent | onInitialize() 中直接调用 |
| 注册 API | DeferredRegister.create(...) | Registry.register(Registry.ITEM, id, item) |
| Mod 入口 | @Mod 注解 + FMLJavaModLoadingContext | ModInitializer 接口 + Fabric.mod.json entrypoints |
| Mixin | 需配置 org.spongepowered.mixin 插件 | **需要显式 Mixin 插件配置** |
| Mappings | MCP（方法名如 func_12345_a） | **Yarn**（可读名如 `readNbt`；`method_12345` 是 Intermediary 混淆名，不是 Yarn）|
| API 生态 | Forge 内置 | **Fabric API 模块化**（按需引入）|
| 事件系统 | Forge 事件总线（@SubscribeEvent） | **Fabric 事件回调**（Event 回调接口）|

---

## Yarn 映射约定

Yarn 使用清晰的命名风格：

| 类型 | 格式 | 示例 |
|------|------|------|
| 类名 | ClassName | MinecraftClient、ItemStack |
| 方法名 | camelCase | getHealth()、setPosition() |
| 字段名 | camelCase | inventory、health |
| Intermediary（不是 Yarn） | class_NNNNN / method_NNNNN | Yarn 未映射时才会看到 |

> **注意**：Forge 的 MCP 映射风格不同（如 func_XXXXX、field_XXXXX），混用会出错。

---

## 项目目录结构

fabric-mod/
├── build.gradle              # Loom 配置，依赖声明
├── settings.gradle           # 项目名称
├── gradle.properties         # 版本号集中管理
├── .gitignore
│
└── src/main/
    ├── java/
    │   └── com/example/examplemod/
    │       ├── ExampleMod.java    # implements ModInitializer 入口类
    │       ├── ExampleModClient.java  # implements ClientModInitializer 客户端入口
    │       ├── registry/          # 注册类（可选）
    │       ├── mixins/            # Mixin 类（可选）
    │       └── mixin/             # Mixin JSON 配置（必需）
    │
    └── resources/
        ├── fabric.mod.json         # Fabric 元数据（必需）
        ├── pack.mcmeta            # 资源包标识
        └── assets/{modid}/
            ├── lang/
            ├── models/
            └── textures/

---

## 常用 Loom / Gradle 命令

# 首次构建
./gradlew build

# 运行客户端
./gradlew runClient

# 运行服务端
./gradlew runServer

# 刷新 Loom（修复混淆映射问题）
./gradlew clean
./gradlew loom

# 生成 IDE 项目文件
./gradlew idea   # IntelliJ IDEA
./gradlew eclipse # Eclipse
./gradlew vscode  # VS Code

---

## 约束

### 禁止混用

- 不要在 Fabric 项目中使用 Forge 的 DeferredRegister
- 不要在 Fabric 项目中使用 @Mod 或 mods.toml
- 不要混用 Yarn 和 MCP 映射
- 不要在 onInitialize() 之外注册内容（Mixin 初始化除外）

### 命名规范

- modId：全小写，无 -，无空格
- 注册名称：new Identifier(MOD_ID, "registry_name")
- 资源路径：assets/{modid}/... 全小写

### Minecraft 版本兼容性

- Fabric 1.14.4 支持 Minecraft 1.14.4
- Fabric Loader 0.3.x（推荐 0.3.2）
- Fabric API 0.28.5+1.14
- **Java 8**（重要：1.14.x 最低要求是 Java 8）

### Mixin 支持

1.14.4 版本的 Mixin 配置需要注意：
- 需要在 fabric.mod.json 中声明 "mixins" 字段
- Mixin JSON 需要指定 "minVersion": "0.8"
- 不如新版本 Loom 那样自动化，需要手动配置
- Mixin 版本兼容性：使用 Mixin 0.8.x

---

## 规则文件索引

按编号顺序加载（建议）：

00-project-setup.mdc    -> 项目结构与构建（Loom、Gradle）
01-registry.mdc         -> 注册系统（最重要，优先读）
02-block.mdc            -> 方块开发
03-item.mdc             -> 物品开发
04-entity.mdc           -> 实体开发
05-events.mdc           -> 事件系统
06-networking.mdc       -> 网络通信
07-datagen.mdc          -> 数据生成器（Fabric Loom DataGen）
08-client-server.mdc    -> 客户端/服务端分离
09-anti-patterns.mdc    -> 反模式库
10-gui.mdc              -> GUI / Screen 开发

---

## MCP Server 工具

当 mcp-server/ 存在时，可使用以下工具：

> **查 API 分工**：本档 **1.14.4 无 Parchment extracted 索引**（`query_api` → `DATA_UNAVAILABLE`）。**不是 Yarn 索引**。Vanilla 签名 → IDE `genSources` + [Yarn Javadoc](https://maven.fabricmc.net/docs/yarn-1.14.4+build.7/)；Fabric API → `query_loader_api`；教程 → `search_fabric_docs`。

| 工具 | 功能 |
|------|------|
| search_fabric_docs | 搜索 Fabric Docs + Wiki |
| get_fabric_doc_summary | 获取文档摘要 |
| get_fabric_doc_full | 获取文档全文 |
| query_api | Vanilla Parchment 索引工具；**本档 1.14.4 无数据**，勿当 Yarn 签名用 |
| get_method_params | 同上；本档不可用 |
| query_loader_api | Fabric API 类摘要（platform=fabric + minecraftVersion=1.14.4） |
| convert_mapping | Yarn <-> Parchment <-> Mojang 映射互转 |
| diagnose_gradle | 诊断 Gradle/Loom 构建问题 |

---

## 参考资料

- Fabric Wiki — 官方教程（Fabric Wiki DokuWiki）
- Fabric API — 模块化 API 文档
- Fabric Docs — GitHub 文档仓库
- Mixin — 字节码注入框架
- Yarn — 社区维护映射

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

