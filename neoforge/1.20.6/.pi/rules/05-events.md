---
description: 05 — 事件（NeoForge 1.20.6）
---

# 05 — 事件（NeoForge 1.20.6）

来源：https://docs.neoforged.net/docs/1.20.6/concepts/events/

两条总线：

- **游戏总线** `NeoForge.EVENT_BUS`：游玩中事件。官方示例 `LivingJumpEvent`（**不是**更晚档嵌套的 `LivingEvent.LivingJumpEvent`）。逻辑端用 `entity.level().isClientSide()`。
- **mod bus**：生命周期。顺序含 `FMLConstructModEvent` → `RegisterEvent` / `NewRegistryEvent` / `DataPackRegistryEvent.NewRegistry` → `FMLCommonSetupEvent` → `FMLClientSetupEvent` 或 `FMLDedicatedServerSetupEvent` → IMC → `FMLLoadCompleteEvent`。并行生命周期用 `#enqueueWork`。

注册：`IEventBus#addListener`、`@SubscribeEvent`、`@EventBusSubscriber(modid = "...")`。默认总线是 **`Bus.GAME`**；mod 总线事件必须 `bus = Bus.MOD`。mod 总线事件超接口 `IModBusEvent`。

取消：`ICancellableEvent` 的 `setCanceled` / `isCanceled`。不要监听 abstract 的 `BlockEvent` / `LivingEvent` 等（会崩）。客户端事件：`FMLEnvironment.dist` 或 `@EventBusSubscriber(value = Dist.CLIENT, modid = "...")`。

禁止：`MinecraftForge.EVENT_BUS`；把 Payload 注册写进 `FMLCommonSetupEvent` 当 SimpleChannel。
