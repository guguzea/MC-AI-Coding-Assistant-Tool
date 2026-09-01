# NeoForge 1.20.4 — Agent 总纲

> 只适用于 **NeoForge 1.20.4**。禁止读取 `neoforge/1.21.1 / 1.21.3 / 1.21.8 / 1.21.11 / 26.1` 或扁平 `neoforge/.cursor/rules` 来填本档类名。
> 1.20.1 已有独立短规则树，**禁止**用本档 00–10 顶上。
> 文档工具用 `list_neoforge_versions`，**不要**用 `list_forge_versions`。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge 1.20.4 |
| Java | **17** |
| Mappings | mojmap / NeoForm 官方名（不是 Forge MCP） |
| 入口 | `@Mod` + `public ExampleMod(IEventBus modEventBus)` |
| 元数据 | META-INF/mods.toml（官方 MDK 1.20.4 ExampleMod 注释仍写 mods.toml） |
| 网络 | `RegisterPayloadHandlerEvent` + `IPayloadRegistrar` |
| 文档 | https://docs.neoforged.net/docs/1.20.4/ |
| MDK | NeoForgeMDKs/MDK-1.20.4-NeoGradle @ 8cd443623d2fd12ef8a6912d2af1296d8522faac 与 MDK-1.20.4-ModDevGradle @ ddfff1d83adca54ac44fe70a6f3b85d3033f0e3a |

1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。

工作流提醒（**不是硬门**）：只有从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 反编译研究才调 `get_workflow_template`。改已有类不要调。从零工程 step1 用 `download_official_mdk`（dryRun 先看 URL；26.1.x/26.2 必须传 buildPlugin）。

## 加载顺序

00-project-setup → 01-registry → 主题文件 02–10。类名必须能在 `knowledge/common/verified-api-1.20.4.md` 或 `search_neoforge_docs` 该版页面找到。反编译摘要缺少 `mappingsVersion` 不得写进规则。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

