# Fabric 1.18.2 — Agent 总纲

> 本规则集适用于 **Fabric 1.18.2**，推荐使用 `Registry.register()` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Fabric |
| Minecraft 版本 | 1.18.2 |
| 注册方式 | `Registry.register()` 在 `onInitialize()` 中执行 |
| Java 版本 | **Java 17**（Fabric 1.18.2 最低要求） |
| Gradle | Gradle 7.6.1 + Loom 0.14.x |
| Mappings | **Yarn**（`net.fabricmc:yarn:1.18.2+build.4:v2`）|
| Build 工具 | Loom（`fabric-loom` 插件） |
| Mod 元数据 | `fabric.mod.json` |
| Mixin 支持 | **Loom 一流支持**（无需额外插件）|
| Pack 格式 | **8**（1.18.x 对应 pack 8）|

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/fabric.mod.json
    → IF fabric.mod.json 中 id 字段存在
        → 检查 build.gradle 中 Loom 配置
        → 继续加载本规则集（Fabric 1.18.2）
    → ELSE → fabric.mod.json schema 版本不匹配，跳转根目录 AGENTS.md
→ ELSE IF 项目中存在 src/main/resources/META-INF/mods.toml
    → 这是 Forge 项目，跳转到 ../forge/1.18.2/AGENTS.md
→ ELSE → 无法判断，询问用户确认平台和版本
```

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
| 注册时机 | modEventBus + `RegisterEvent` | `onInitialize()` 中直接调用 |
| 注册 API | `DeferredRegister.create(...)` | `Registry.register(Registry.ITEM, id, item)` |
| Mod 入口 | `@Mod` 注解 + `FMLJavaModLoadingContext` | `FabricMod` 接口 + `Fabric.mod.json` entrypoints |
| Mixin | 需配置 `org.spongepowered.mixin` 插件 | **Loom 原生支持**，无需额外插件 |
| Mappings | MCP（方法名如 `func_12345_a`） | **Yarn**（方法名如 `method_12345`）|
| API 生态 | Forge 内置 | **Fabric API 模块化**（按需引入）|
| 事件系统 | Forge 事件总线（`@SubscribeEvent`） | **Fabric 事件回调**（`EventDispatcher`）|

---

## 1.18.x 与 1.20.x 的关键差异

| 维度 | 1.18.x | 1.20.x |
|------|--------|--------|
| Registry | `Registry.BLOCK`（静态字段） | `Registries.BLOCK`（实例） |
| `fabric.mod.json` | **无** `environment` 字段 | 有 `environment` 字段 |
| Block class | `Block`（旧命名） | `AbstractBlock`（重命名） |
| BlockItem | `BlockItem`（相同） | `BlockItem`（相同） |
| Pack format | **8** | **22** |
| FoodComponent | `FoodComponent.Builder` | `FoodComponent.Builder`（相同） |
| EntityType | `EntityType.Builder.create()` | `EntityType.Builder.create()` |
| EntityCategory | `EntityCategory.CREATURE` | `EntityCategory.CREATURE` |

---

## Yarn 映射约定

Yarn 使用清晰的命名风格：

| 类型 | 格式 | 示例 |
|------|------|------|
| 类名 | `ClassName` | `MinecraftClient`、`ItemStack` |
| 方法名 | `camelCase` | `getHealth()`、`setPosition()` |
| 字段名 | `camelCase` | `inventory`、`health` |
| 混淆保留 | `class_NNNNN` / `method_NNNNN` | `class_12345` — 仅在 Yarn 未解析时出现 |

> **注意**：Forge 的 MCP 映射风格不同（如 `func_XXXXX`、`field_XXXXX`），混用会出错。

---

## 项目目录结构

```
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
    │       ├── ExampleModClient.java # 客户端入口（implements ClientModInitializer）
    │       └── ...
    │
    └── resources/
        ├── fabric.mod.json         # Fabric 元数据（必需）
        ├── pack.mcmeta            # 资源包标识（pack_format: 8）
        └── assets/{modid}/
            ├── lang/
            ├── models/
            └── textures/
```

---

## 常用 Loom / Gradle 命令

```bash
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
```

---

## 约束

### 禁止混用

- ❌ 不要在 Fabric 项目中使用 Forge 的 `DeferredRegister`
- ❌ 不要在 Fabric 项目中使用 `@Mod` 或 `mods.toml`
- ❌ 不要混用 Yarn 和 MCP 映射
- ❌ 不要在 `onInitialize()` 之外注册内容（Mixin 初始化除外）

### 命名规范

- `modId`：全小写，无 `-`，无空格
- 注册名称：`new Identifier(MOD_ID, "registry_name")`
- 资源路径：`assets/{modid}/...` 全小写

### Minecraft 版本兼容性

- Fabric 1.18.2 支持 Minecraft 1.18.2
- Fabric Loader 0.14.x（推荐 0.14.24）
- Fabric API 0.77.x for 1.18.2
- Java 17+
- Pack format **8**

---

## 规则文件索引

按编号顺序加载（建议）：

```
00-project-setup.mdc    → 项目结构与构建（Loom、Gradle）
01-registry.mdc         → 注册系统（最重要，优先读）
02-block.mdc            → 方块开发
03-item.mdc             → 物品开发
04-entity.mdc           → 实体开发
05-events.mdc           → 事件系统
06-networking.mdc       → 网络通信
07-datagen.mdc          → 数据生成器（Fabric Loom DataGen）
08-client-server.mdc    → 客户端/服务端分离
09-anti-patterns.mdc    → 反模式库
10-gui.mdc              → GUI / Screen 开发
```

---

## MCP Server 工具

当 `mcp-server/` 存在时，可使用以下工具：

| 工具 | 功能 |
|------|------|
| `search_fabric_docs` | 搜索 Fabric Docs + Wiki |
| `get_fabric_doc_summary` | 获取文档摘要 |
| `get_fabric_doc_full` | 获取文档全文 |
| `query_api` | 按类名查询 Yarn API 签名 |
| `get_method_params` | 查询方法参数名 |
| `convert_mapping` | Yarn ↔ Parchment ↔ Mojang 映射互转 |
| `diagnose_gradle` | 诊断 Gradle/Loom 构建问题 |

---

## 参考资料

- [Fabric Wiki](https://fabricmc.net/wiki/) — 官方教程（Fabric Wiki DokuWiki）
- [Fabric API](https://fabricmc.net/wiki/documentation:fabric_api) — 模块化 API 文档
- [Fabric Docs](https://github.com/FabricMC/fabric-docs) — GitHub 文档仓库
- [Mixin](https://github.com/SpongePowered/Mixin) — 字节码注入框架
- [Yarn](https://github.com/FabricMC/yarn) — 社区维护映射
- [Parchment](https://parchmentmc.org/) — 带参数的 Yarn（兼容 Fabric）
