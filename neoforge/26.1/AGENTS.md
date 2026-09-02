# NeoForge 26.1 — Agent 总纲

> 只适用于 **NeoForge 26.1**。禁止读取 `neoforge/1.20.4 / 1.21.1 / 1.21.3 / 1.21.8 / 1.21.11` 或扁平 `neoforge/.cursor/rules` 来填本档类名。
> 1.20.1 已有独立短规则树，**禁止**用本档 00–10 顶上。
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

26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。26.2 不是「未发布」：maven 26.2 线已构建到 26.2.0.75（2026-09-02 实读 maven.neoforged.net），官方 Primer 也有 26.2 迁移页（/primer/docs/26.2/ 返回 200，本仓已入库 data/neoforge_primers/26.2.md）。但官方主文档站不按版本分线——/docs/26.2/ 与 /docs/26.1/ 同样 404，现行主文档是未版本化的 /docs/；本仓也没有 26.2 规则树与主文档语料，禁止把本档克隆成 26.2。

**入库官方页原文可能残留旧版本号**（例如 `minecraft_version=1.20.6`、`neo_version=20.6.62`）。那是上游 gettingstarted 示例未改干净，**禁止照抄**进 26.1 工程；`neo_version` 以 maven 26.1 线最新为准。

工作流提醒（**不是硬门**）：只有从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 反编译研究才调 `get_workflow_template`。改已有类不要调。从零工程 step1 用 `download_official_mdk`（dryRun 先看 URL；26.1.x/26.2 必须传 buildPlugin）。

## 加载顺序

00-project-setup → 01-registry → 主题文件 02–10。类名必须能在 `knowledge/common/verified-api-26.1.md` 或 `search_neoforge_docs` 该版页面找到。反编译摘要缺少 `mappingsVersion` 不得写进规则。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

