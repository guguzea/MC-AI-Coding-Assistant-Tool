---
description: 05 — 事件（NeoForge 1.21.11）
---

# 05 — 事件（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent.Client / Server`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀；1.21.8 起注解上的 `bus` 属性与 `Bus` 类型已移除，不要再写 `bus = Bus.MOD`——写了编译报「找不到符号: 方法 bus()／变量 Bus」）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。
