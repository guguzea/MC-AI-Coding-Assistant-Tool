---
name: mc-events
description: NeoForge 1.21.8 mc-events。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.8"
dependencies: []
mappings: mojmap
---

# mc-events（NeoForge 1.21.8）

禁止从 Forge 或邻档复制。DataGen 拆成 GatherDataEvent.Client 与 Server（含 createDatapackRegistryObjects / createProvider）的分界**不晚于 1.21.5**、不是本档引入：本仓 raw 计数 `GatherDataEvent.Client` 在 1.21.3 = 0、1.21.5 = 33（`data/neoforge_1.21.5/neoforge-docs/1.21.5/processed/resources.md:92` 已拆；反例 `data/neoforge_1.21.3/neoforge-docs/1.21.3/processed/resources.md:113` 仍是裸 `GatherDataEvent`），与 `neoforge/1.21.5/knowledge/porting/02-version-migration.md` 同值。本档只沿用该已拆形态。

# 05 — 事件（NeoForge 1.21.8）

来源：https://docs.neoforged.net/docs/1.21.8/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent.Client / GatherDataEvent.Server（已拆分）`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀，默认总线 `Bus.GAME`；注册/lifecycle 等 mod bus 事件必须显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。

