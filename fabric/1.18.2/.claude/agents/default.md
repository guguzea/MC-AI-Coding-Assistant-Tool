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

1. 先读 `AGENTS.md`（本文件）
2. 再按编号读 `.claude/rules/00-10.mdc`
3. 如需深入了解特定领域，读 `.claude/commands/` 下的命令参考
4. 遇到问题查 `.claude/rules/09-anti-patterns.mdc`

---

## 与 Forge 的核心差异

| 维度 | Forge | Fabric |
|------|-------|--------|
| 注册时机 | modEventBus + `RegisterEvent` | `onInitialize()` 中直接调用 |
| 注册 API | `DeferredRegister.create(...)` | `Registry.register(Registries.ITEM, id, item)` |
| Mod 入口 | `@Mod` 注解 + `FMLJavaModLoadingContext` | `FabricMod` 接口 + `Fabric.mod.json` entrypoints |
| Mixin | 需配置 `org.spongepowered.mixin` 插件 | **Loom 原生支持**，无需额外插件 |
| Mappings | MCP（方法名如 `func_12345_a`） | **Yarn**（方法名如 `method_12345`）|
| API 生态 | Forge 内置 | **Fabric API 模块化**（按需引入）|
| 事件系统 | Forge 事件总线（`@SubscribeEvent`） | **Fabric 事件回调**（`EventDispatcher`）|

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
    │       ├── ExampleMod.java    # implements FabricMod 入口类
    │       ├── registry/          # 注册类（可选）
    │       ├── mixins/            # Mixin 类（可选）
    │       └── ...
    │
    └── resources/
        ├── fabric.mod.json         # Fabric 元数据（必需）
        ├── pack.mcmeta            # 资源包标识
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
- 注册名称：`Identifier(MOD_ID, "registry_name")`
- 资源路径：`assets/{modid}/...` 全小写

### Minecraft 版本兼容性

- Fabric 1.18.2 支持 Minecraft 1.18.2
- Fabric Loader 0.14.x（推荐 0.14.24）
- Fabric API 0.44.x for 1.18.2
- Java 17+

---

## 规则文件索引

按编号顺序加载（建议）：

```
.claude/rules/00-project-setup.mdc    → 项目结构与构建（Loom、Gradle）
.claude/rules/01-registry.mdc         → 注册系统（最重要，优先读）
.claude/rules/02-block.mdc            → 方块开发
.claude/rules/03-item.mdc             → 物品开发
.claude/rules/04-entity.mdc          → 实体开发
.claude/rules/05-events.mdc          → 事件系统
.claude/rules/06-networking.mdc      → 网络通信
.claude/rules/07-datagen.mdc          → 数据生成器（Fabric Loom DataGen）
.claude/rules/08-client-server.mdc    → 客户端/服务端分离
.claude/rules/09-anti-patterns.mdc   → 反模式库
.claude/rules/10-gui.mdc              → GUI / Screen 开发
```

---

## 参考资料

- [Fabric Wiki](https://fabricmc.net/wiki/) — 官方教程（Fabric Wiki DokuWiki）
- [Fabric API](https://fabricmc.net/wiki/documentation:fabric_api) — 模块化 API 文档
- [Fabric Docs](https://github.com/FabricMC/fabric-docs) — GitHub 文档仓库
- [Mixin](https://github.com/SpongePowered/Mixin) — 字节码注入框架
- [Yarn](https://github.com/FabricMC/yarn) — 社区维护映射
- [Parchment](https://parchmentmc.org/) — 带参数的 Yarn（兼容 Fabric）
