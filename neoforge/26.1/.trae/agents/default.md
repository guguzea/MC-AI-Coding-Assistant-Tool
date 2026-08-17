# NeoForge 26.1 — Agent 总纲

> 只适用于 **NeoForge 26.1**。禁止读取 `neoforge/1.20.4 / 1.21.1 / 1.21.3 / 1.21.8 / 1.21.11` 或扁平 `neoforge/.cursor/rules` 来填本档类名。
> 未建档版本（1.20.1）**禁止读邻档 00–10**，改口 `search_neoforge_docs`。
> 文档工具用 `list_neoforge_versions`，**不要**用 `list_forge_versions`。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge 26.1 |
| Java | **25** |
| Mappings | mojmap-unobfuscated（游戏 jar 已是 Mojang 名） |
| 入口 | `@Mod` + `public ExampleMod(IEventBus modEventBus, ModContainer modContainer)` |
| 元数据 | neoforge.mods.toml |
| 网络 | `RegisterPayloadHandlersEvent` + `PayloadRegistrar` |
| 文档 | https://docs.neoforged.net/docs/ |
| MDK | 26.1.1/26.1.2 均同时提供 ModDevGradle 与 NeoGradle，必须传 buildPlugin。不为 26.1.1 单造规则树。 |

26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。官方 /docs/26.2/ 仍 404，禁止克隆本档冒充 26.2。

工作流提醒（**不是硬门**）：只有从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 反编译研究才调 `get_workflow_template`。改已有类不要调。从零工程 step1 用 `download_official_mdk`（dryRun 先看 URL；26.1.x/26.2 必须传 buildPlugin）。

## 加载顺序

00-project-setup → 01-registry → 主题文件 02–10。类名必须能在 `knowledge/common/verified-api-26.1.md` 或 `search_neoforge_docs` 该版页面找到。反编译摘要缺少 `mappingsVersion` 不得写进规则。
