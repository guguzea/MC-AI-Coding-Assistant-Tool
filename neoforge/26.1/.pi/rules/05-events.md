---
description: 05 — 事件（NeoForge 26.1）
---

# 05 — 事件（NeoForge 26.1）

来源：本档 **无** 独立 `docs/.../concepts/events/` 页。事件以 `query_loader_api` / `search_neoforge_docs` 为准；1.20.6 事件页仅作 fallback 并必须标注 `fallback`，禁止当 26.1 签名。

两条总线：

- **mod bus**：注册、lifecycle（`FMLCommonSetupEvent`、`FMLClientSetupEvent`、`RegisterPayloadHandlersEvent`、`GatherDataEvent.Client / GatherDataEvent.Server`）
- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件（如 `ServerStartingEvent`）

`@SubscribeEvent`。类级 `@EventBusSubscriber(modid = "yourmodid")`（1.20.6+ 已去掉 `Mod.` 前缀；1.21.8 起注解上的 `bus` 属性与 `Bus` 类型已移除，不要再写 `bus = Bus.MOD`——写了编译报「找不到符号: 方法 bus()／变量 Bus」）。

入口里 `modEventBus.addListener(this::commonSetup)` 与 MDK 一致。

禁止：`MinecraftForge.EVENT_BUS`（Forge 名）；禁止把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。
