# Fabric 1.16.5 — Agent 总纲

> 本规则集适用于 **Fabric 1.16.5**，推荐使用 `Registry.register()` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Fabric |
| Minecraft 版本 | 1.16.5 |
| 注册方式 | `Registry.register()` 在 `onInitialize()` 中执行 |
| Java 版本 | **Java 8**（Minecraft 1.16.5 要求；Java 16 从 1.17 起） |
| Gradle | Gradle 7.x + Loom **0.10.x** |
| Mappings | **Yarn**（`net.fabricmc:yarn:1.16.5+build.10:v2`）|
| Build 工具 | Loom（`fabric-loom` 插件） |
| Mod 元数据 | `fabric.mod.json` |
| Mixin 支持 | Loom 处理 Mixin；不要手写 Mixin Plugin / MixinBootstrap |
| Fabric API | 0.16.x（`net.fabricmc.fabric-api:fabric-api:0.42.0+1.16`）|

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/fabric.mod.json
    → IF fabric.mod.json 中 id 字段存在
        → 检查 build.gradle 中 Loom 配置
        → 继续加载本规则集（Fabric 1.16.5）
    → ELSE → fabric.mod.json schema 版本不匹配，跳转根目录 AGENTS.md
→ ELSE IF 项目中存在 src/main/resources/META-INF/mods.toml
    → 这是 Forge 项目，跳转到 ../forge/1.16.5/AGENTS.md
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
| 注册 API | `Registry.ITEM`（VanillaRegistry 静态字段） | `Registry.register(Registry.ITEM, id, item)` |
| Mod 入口 | `@Mod` 注解 + `FMLJavaModLoadingContext` | `ModInitializer` 接口 + `fabric.mod.json` entrypoints |
| Mixin | 需配置 `org.spongepowered.mixin` 插件 | Loom 处理 Mixin；不要手写 Mixin Plugin |
| Mappings | MCP（方法名如 `func_12345_a`） | **Yarn**（可读名如 `getHealth()`；`method_12345` 是 Intermediary）|
| API 生态 | Forge 内置 | **Fabric API 模块化**（按需引入）|
| 事件系统 | Forge 事件总线（`@SubscribeEvent`） | **Fabric 事件回调**（`net.fabricmc.fabric.api.event.Event`，如 `AttackBlockCallback`）|

---

## Registry API（1.16.5 vs 1.17+）

> **关键差异**：1.16.5 使用 `Registry` **静态字段**（如 `Registry.ITEM`）。`Registries.ITEM` / `BuiltInRegistries` 从 **1.19.3+** 才是 Fabric 主路径；1.17.1/1.18.2 仍是 `Registry.ITEM`。

```java
// ✅ 1.16.5 正确写法
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"), myItem);
Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"), myBlock);

// ❌ 1.16.5 错误写法（1.19.3+ / 现行文档）
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), myItem);
Registry.register(BuiltInRegistries.ITEM, new Identifier(MOD_ID, "my_item"), myItem);
```

---

## Yarn 映射约定

Yarn 使用清晰的命名风格：

| 类型 | 格式 | 示例 |
|------|------|------|
| 类名 | `ClassName` | `MinecraftClient`、`ItemStack` |
| 方法名 | `camelCase` | `getHealth()`、`setPosition()` |
| 字段名 | `camelCase` | `inventory`、`health` |
| Intermediary（不是 Yarn） | `class_NNNNN` / `method_NNNNN` | Yarn 未映射时才会看到；不要当 Yarn 名用 |

> **注意**：Forge 的 MCP 映射风格不同（如 `func_XXXXX`、`field_XXXXX`），混用会出错。

---

## Mixin 配置

1.16.5 与其它 schemaVersion 1 档一样：Loom 处理 Mixin，**不要**手写 MixinBootstrap / MixinLauncher / `fabric.loom.new_mixin_engine`。

`fabric.mod.json` 只用 `mixins` 键（**没有**顶层 `"client"` 键）：

```json
{
  "schemaVersion": 1,
  "id": "examplemod",
  "mixins": ["examplemod.mixins.json"]
}
```

`examplemod.mixins.json` 的 `package` 之后写**相对类名**（客户端条目放 JSON 的 `client` 数组，不是 fmj 顶层）：

```json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_8",
  "mixins": ["ExampleMixin"],
  "client": ["client.ExampleMixin"],
  "injectors": { "defaultRequire": 1 }
}
```

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
    │       ├── mixin/             # Mixin 类（mixins.json 相对 package 列出）
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
- ❌ 不要在 `onInitialize()` 之外注册任何内容（Mixin 初始化除外）

### 命名规范

- `id`：全小写；允许下划线与连字符（须与 fabric.mod.json 一致）
- 注册名称：`new Identifier(MOD_ID, "registry_name")`
- 资源路径：`assets/{modid}/...` 全小写

### Minecraft 版本兼容性

- Fabric 1.16.5 支持 Minecraft 1.16.5
- Fabric Loader 0.11.x（推荐 0.11.2）
- Fabric API 0.42.x（`fabric-api-0.42.0+1.16`）
- Java 8

### 1.16.5 特有注意事项

- ❌ **不要**使用 1.17+ 引入的 `Registries` 类（使用 `Registry`）
- ❌ **不要**使用 1.17+ 引入的 `Identifier` 简化 API
- Mixin 走 `mixins.json` + fmj 的 `mixins` 键；Loom 自动处理，不要手写 MixinBootstrap
- `fabric.mod.json` **可以**写 `environment`（schemaVersion 1 一直有该字段）

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

## 参考资料

- [Fabric Wiki](https://fabricmc.net/wiki/) — 官方教程（Fabric Wiki DokuWiki）
- [Fabric API](https://fabricmc.net/wiki/documentation:fabric_api) — 模块化 API 文档
- [Fabric Docs](https://github.com/FabricMC/fabric-docs) — GitHub 文档仓库
- [Mixin](https://github.com/SpongePowered/Mixin) — 字节码注入框架
- [Yarn](https://github.com/FabricMC/yarn) — 社区维护映射
- [Parchment](https://parchmentmc.org/) — 带参数的 Yarn（兼容 Fabric）
- [Fabric 1.16.5 Wiki](https://fabricmc.net/wiki/documentation:fabric_mod_json_spec) — fabric.mod.json 规范

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
