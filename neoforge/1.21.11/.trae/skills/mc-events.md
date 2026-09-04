---
name: mc-events
description: NeoForge 1.21.11 mc-events。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.11"
dependencies: []
mappings: mojmap
---

# mc-events（NeoForge 1.21.11）

禁止从 Forge 或邻档复制。1.21.11 文档把 ResourceLocation 换成 Identifier。Primer 26.1 才是下一跳。

# 05 — 事件（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent.Client / Server`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀，默认总线 `Bus.GAME`；注册/lifecycle 等 mod bus 事件必须显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。

