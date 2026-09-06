---
description: 05 — 事件（NeoForge 1.21.11）
---

# 05 — 事件（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/concepts/events/
> ⚠️ 离线数据缺口：本档 data/neoforge_1.21.11/ 未入库 concepts/events 页，search_neoforge_docs 查不到；上述来源以线上版为准（禁止从邻版复制补索引）。

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent.Client / Server`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀，默认总线 `Bus.GAME`；注册/lifecycle 等 mod bus 事件必须显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。
