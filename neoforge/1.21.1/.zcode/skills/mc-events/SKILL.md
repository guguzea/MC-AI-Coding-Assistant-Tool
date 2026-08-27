---
name: mc-events
description: NeoForge 1.21.1 mc-events。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-events（NeoForge 1.21.1）

禁止从 Forge 或邻档复制。1.21.1 起事件名变成复数 Handlers。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。

# 05 — 事件（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent（尚未拆成 Client/Server 子类）`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@Mod.EventBusSubscriber` / `@EventBusSubscriber`。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。

