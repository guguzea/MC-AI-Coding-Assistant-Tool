---
name: mc-events
description: NeoForge 1.20.4 mc-events。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
---

# mc-events（NeoForge 1.20.4）

禁止从 Forge 或邻档复制。1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。

# 05 — 事件（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlerEvent`、`GatherDataEvent`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@Mod.EventBusSubscriber(modid = "yourmodid")`（≤1.20.4 带 `Mod.` 前缀，默认总线 `Bus.FORGE`；mod bus 事件显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。

