# Forge 1.15.2 — Agent 总纲

> 本规则集适用于 **Forge 1.15.2**，推荐使用 `DeferredRegister` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

> ⚠️ 使用 MCP Server 文档工具前，必须先用 `list_forge_versions` 查询当前有哪些版本。
> 不要依赖硬编码默认值，每次对话开始时主动探查。

---

> **⚠️ Forge 1.15.2 `scaffold/` 与官方 MDK 存在代差 —— 有意保留，不是缺陷；禁止为了「对齐」去改 scaffold 钉值。**
> 注意（不是「已跑通」）：本档 `pack.meta.json` → `buildVerified: **false**`，卡点就是钉值本身 —— FG `[4.1,4.2)` 硬拒 Gradle ≥7（2026-09-11 真机 `_g_fg4gw_1.15.2.log`："Found Gradle version Gradle 7.3.3. Versions Gradle 7.0 and newer are not supported yet"，BUILD FAILED in 12s）。按根裁定「代差不追平、不擅自改钉值」wrapper 保持不动；**是否把 wrapper 降到 Gradle 6.x 需用户裁定**，本档只登记。
> 需要新版工具链：自行调用 `download_official_mdk`（默认 dryRun，只落到 `$MC_SKILL_CACHE`，不写仓库），再把返回值填进**你自己的工程**。

> - Gradle Wrapper：本档 `scaffold/gradle/wrapper/gradle-wrapper.properties:3` → `gradle-7.3.3-bin` ↔ 官方 MDK `gradle-4.10.3-bin`
> - ForgeGradle：本档 `scaffold/build.gradle:5` → `[4.1,4.2)` ↔ 官方 MDK `build.gradle:7` → `ForgeGradle:3.+`
> - Forge：本档 `scaffold/gradle.properties:9` → `31.2.50` ↔ 官方 MDK `build.gradle:93` → `1.15.2-31.2.57`
> - mappings：本档 `scaffold/gradle.properties:14-15` → `official` / `1.15.2` ↔ 官方 MDK `build.gradle:30` → `snapshot` / `20200514-1.15.1`

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.15.2 |
| 注册模式 | `DeferredRegister`（推荐）/ `RegistryEvent.Register`（备选） |
| Java 版本 | **Java 8**（Forge 1.15.2 最低要求） |
| Gradle | **Gradle 7.3.3 + ForgeGradle `[4.1,4.2)`**（本包 `scaffold/build.gradle:5` + `scaffold/gradle/wrapper/gradle-wrapper.properties:3`）。⚠️ 官方 1.15.2-31.2.57 MDK 是 **Gradle 4.10.3 + FG `3.+`**（MDK `build.gradle:7`、`gradle-wrapper.properties:5`；sha256 见 `mcp-server/data/mdk-checksums.json`，`source=official`）。scaffold 与 MDK 组合不一致（未裁定分歧），不要互相背书。❌ 按声明钉值跑不起来：真机 `./gradlew build`（Gradle 7.3.3 + JDK 8）配置期失败 `Failed to apply plugin 'net.minecraftforge.gradle'. > Found Gradle version Gradle 7.3.3. Versions Gradle 7.0 and newer are not supported yet.`（`_g_fg4gw_1.15.2.log`）；钉值不追平（根 memory 裁定），但 `settings.gradle` 的 `foojay-resolver-convention 0.4.0`（Gradle-7-only，7.3.3 实测缺 `JavaToolchainResolverRegistry`）已于 2026-09-11 删除并改为「用 JDK 8 跑 Gradle」。此后**原样 scaffold** 在 Gradle 6.9.4 真机 `BUILD SUCCESSFUL`（`_g_fg4exp8_1.15.2.log`；前置：预建 FG4 漏 `mkdirs` 的 tsrg 缓存目录）⇒ `pack.meta.json` 的 `buildVerified` 仍 false，唯一卡点是 wrapper 钉值 |
| Mappings | 本包 scaffold = **official**（`scaffold/gradle.properties:14` `mapping_channel=official`，`scaffold/build.gradle:18` 用该变量；须 `project.` 显式引用，FG4 的 `MinecraftExtension` 自带同名空字段）。官方 1.15.2-31.2.57 MDK 用的是 **MCP `snapshot` 通道**（MDK `build.gradle:29` `mappings channel: 'snapshot', version: '20200514-1.15.1'`），但本档 **只有 official 可用可读名**：真机该 snapshot 组合的编译类路径是 SRG 名（javap `forge-1.15.2-31.2.50_mapped_snapshot_20200514-1.15.1.jar` → `func_200945_a` / `field_78030_b`）⇒ 禁止拿 MDK 的 snapshot 声明当本档命名依据。两侧不同源：按用户工程实际的那一套写方法名，禁止 MCP / official / Parchment 混用。⚠️ **本档是混合档（2026-09-25 javap 复核定案，`mcp-server/docs/knowledge-coverage-sweep-20260924.md` §6.10）**：scaffold `official` 通道 = **MCP 类名**（`net/minecraft/world/World`）+ **Mojang 成员名**（`Block$Properties.of`、`World.isClientSide`/`getLevel`——javap 直证；`snapshot` 通道成员名是 SRG 不可读）；而本包 35 件 skills 全声明 `mappings: mcp`，正文成员名**两套并存**（`isClientSide` 20 处 vs `isRemote` 1 处；`Properties.create(` 24 处）⇒ 逐件值只描述成员名族且并非每件都经核实，照抄前核对该件实际用名 |
| 构建工具 | ForgeGradle（`build.gradle`） |

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/META-INF/mods.toml
    → IF mods.toml 中 modLoader = "javafml"
        → IF build.gradle 中 minecraft = "1.15.2"
            → 继续加载本规则集（Forge 1.15.2）
        → ELSE → 跳转到对应版本的 forge/版本号/AGENTS.md
    → ELSE → 不是 Forge，跳转到 fabric/ 或 neoforge/ 对应版本
→ ELSE IF 项目中存在 src/main/resources/fabric.mod.json
    → 跳转到 fabric/对应版本/AGENTS.md
→ ELSE → 询问用户确认平台和版本
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

## 规则文件索引

按以下顺序加载，编号越大越专精：

| 编号 | 文件 | 何时阅读 |
|------|------|----------|
| 00 | `00-project-setup.mdc` | 首次接触项目时必读 |
| 01 | `01-registry.mdc` | 任何涉及注册的操作必读（**最重要**） |
| 02 | `02-block.mdc` | 创建或修改方块时 |
| 03 | `03-item.mdc` | 创建或修改物品时 |
| 04 | `04-entity.mdc` | 创建或修改实体时 |
| 05 | `05-events.mdc` | 监听游戏事件时 |
| 06 | `06-networking.mdc` | 实现客户端/服务端通信时 |
| 07 | `07-datagen.mdc` | 生成数据包时 |
| 08 | `08-client-server.mdc` | 涉及客户端渲染或服务端逻辑分离时 |
| 09 | `09-anti-patterns.mdc` | 遇到错误或不确定最佳实践时 |
| 10 | `10-gui.mdc` | GUI、Menu、Screen 开发时 |

---

## Mod ID 规范

本规则集强制约束：

- **必须**与 `mods.toml` 中的 `modId` 完全一致
- 全部**小写**
- 仅使用字母和下划线（`[a-z0-9_]`）
- 禁止使用 `-`，否则 Forge 会拒绝加载
- 推荐格式：`yourmodid` 或 `your_mod_id`

---

## 目录结构约定

Forge 1.15.2 标准项目的包结构：

```
src/main/java/
└── com/example/mod/
    ├── ExampleMod.java        # @Mod 入口类
    ├── registry/              # 注册相关
    │   ├── ModBlocks.java
    │   ├── ModItems.java
    │   ├── ModEntities.java
    │   └── ModMessages.java   # 网络包
    ├── blocks/                 # 方块
    │   └── MyBlock.java
    ├── items/                  # 物品
    │   └── MyItem.java
    ├── entities/               # 实体
    │   └── MyEntity.java
    ├── init/                   # 事件订阅
    │   └── ModEvents.java
    └── client/                  # 客户端专用
        ├── ClientSetup.java
        └── rendering/
            └── MyBlockRenderer.java
```

---

## 常见陷阱（必读）

1. **推荐使用 DeferredRegister**：`DeferredRegister` 是 Forge 官方推荐的注册方式，自 Forge 1.14 引入（1.14.4 起可用），1.15.2 完全支持
2. **不要用 Mixin 的 `@Inject` 在构造函数里修改 final 字段**：会导致游戏崩溃
3. **不要在 `server` 包里放 `@OnlyIn(Dist.CLIENT)` 的代码**：客户端类会被服务端打包进 jar，导致混淆问题
4. **不要忘记 `mods.toml` 中的 `dependencies`**：任何对 Forge API 的依赖必须声明
5. **不要在 `FMLClientSetupEvent` 里直接执行游戏逻辑**：只用于注册 KeyBinding 和渲染器

---

## 扩展新内容时的流程

1. 先读 `01-registry.mdc` 确认注册方式
2. 再读对应主题的规则文件（如 `02-block.mdc`）
3. 检查 `09-anti-patterns.mdc` 确认没有踩坑
4. 最后运行 `validate_project` 自查（Phase 1.5 CLI 工具）

---

## 关于 1.15.2 与其他版本的差异

| 功能 | 1.15.2 Forge | 1.18+ Forge | 备注 |
|------|---------------|--------------|------|
| 注册方式 | `DeferredRegister` | `DeferredRegister` | 一致（均推荐） |
| Java 版本 | Java 8 | Java 17+ | 1.15.2 使用 Java 8 |
| Gradle | Gradle 7.3.3 + FG `[4.1,4.2)` | Gradle 8.x + FG `[6.0,6.2)` | 本包 `scaffold/build.gradle:5` + `gradle-wrapper.properties:3`。⚠️ 官方 1.15.2-31.2.57 MDK 是 **Gradle 4.10.3 + FG `3.+`**（MDK `build.gradle:7`、`gradle-wrapper.properties:5`；sha256 见 `mcp-server/data/mdk-checksums.json`）：scaffold 与 MDK 组合不一致（未裁定分歧），不要互相背书 |
| pack_format | 5 | 15 (1.20.1) | 官方 1.15.2-31.2.57 MDK `pack.mcmeta` = `"pack_format": 5`（本包 scaffold 同为 5）；1.18 前数据包与资源包共用此号，1.18 起分家（资源 8 / 数据 9）。原写 6 是 1.16.2+ 的号 |

如果你发现用户的代码与本规则集描述不符，先询问 Minecraft 版本。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
