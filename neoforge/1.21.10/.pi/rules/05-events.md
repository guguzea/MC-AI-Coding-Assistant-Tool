---
description: 05 — 事件（NeoForge 1.21.10）
---

# 05 — 事件（NeoForge 1.21.10）

来源：https://docs.neoforged.net/docs/1.21.10/concepts/events/

与 1.21.5 同类：游戏总线 `NeoForge.EVENT_BUS`；示例 **`LivingEvent.LivingJumpEvent`**。`@EventBusSubscriber` 会同时订游戏总线和 mod 总线。

客户端物理端检查官方写的是 **`FMLEnvironment#getDist()`**（不是本档更早的 `FMLEnvironment.dist` 字段）。`@EventBusSubscriber(value = Dist.CLIENT, modid = "...")` 仍可用。

生命周期、`ICancellableEvent`、不要听 abstract 事件、`RenderNameTagEvent.CanRender` 与 1.21.5 页一致。

禁止：`MinecraftForge.EVENT_BUS`；Payload 塞进 `FMLCommonSetupEvent`。
