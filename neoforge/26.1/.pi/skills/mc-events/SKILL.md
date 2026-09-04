---
name: mc-events
description: NeoForge 26.1 mc-events。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap
---

# mc-events（NeoForge 26.1）

禁止从 Forge 或邻档复制。26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。26.2 不是「未发布」：maven 26.2 线已构建到 26.2.0.75（2026-09-02 实读 maven.neoforged.net），官方 Primer 也有 26.2 迁移页（/primer/docs/26.2/ 返回 200，本仓已入库 data/neoforge_primers/26.2.md）。但官方主文档站不按版本分线——/docs/26.2/ 与 /docs/26.1/ 同样 404，现行主文档是未版本化的 /docs/；本仓也没有 26.2 规则树与主文档语料，禁止把本档克隆成 26.2。

# 05 — 事件（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent.Client / GatherDataEvent.Server`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀，默认总线 `Bus.GAME`；注册/lifecycle 等 mod bus 事件必须显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。

