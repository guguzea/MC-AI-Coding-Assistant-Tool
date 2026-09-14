---
name: mc-events
description: NeoForge 1.21.1 mc-events。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-events（NeoForge 1.21.1）

禁止从 Forge 或邻档复制。复数 Handlers 事件名的分界在 **1.20.5 / 1.20.6**，不是本档：本仓语料实测 1.20.4 仍是单数 `RegisterPayloadHandlerEvent`（`data/neoforge_1.20.4/neoforge-docs/1.20.4/processed/networking_payload.md:9`），1.20.6 已改复数 `RegisterPayloadHandlersEvent`（`data/neoforge_1.20.6/neoforge-docs/1.20.6/processed/networking_payload.md:9`，同页 :85 `registrar.playBidirectional(`）；本仓无 `data/neoforge_1.20.5` 主文档语料，故分界只钉到这一档距。本档 1.21.1 沿用复数形态。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。

# 05 — 事件（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent（尚未拆成 Client/Server 子类）`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀，默认总线 `Bus.GAME`；注册/lifecycle 等 mod bus 事件必须显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。

