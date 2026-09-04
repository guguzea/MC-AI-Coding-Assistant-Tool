---
description: 05 — 事件（NeoForge 1.20.4）
---

# 05 — 事件（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlerEvent`、`GatherDataEvent`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@Mod.EventBusSubscriber(modid = "yourmodid")`（≤1.20.4 带 `Mod.` 前缀，默认总线 `Bus.FORGE`；mod bus 事件显式 `bus = Bus.MOD`）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。
