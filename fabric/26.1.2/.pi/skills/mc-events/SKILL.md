---
name: mc-events
description: Fabric 26.1.2 事件。Mojmap Event.register，禁止 Yarn。触发词：事件、Event、Callback、SubscribeEvent
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
docsTool: search_fabric_docs
---

# 事件（Fabric 26.1.2）

文档：`26.1.2/develop_events`。`net.fabricmc.fabric.api.event.Event`，初始化里 `.register()`。

**Mojmap**：`Player`、`Level`、`InteractionResult`、`InteractionHand`。禁止 Yarn `PlayerEntity` / `ActionResult` / `world.isClient`。

禁止 Forge `@SubscribeEvent` / `IEventBus`。不要编造 `ItemEvents` / `BlockEvents` / `PlayerTickEvents`。

```java
AttackBlockCallback.EVENT.register((player, level, hand, pos, direction) -> InteractionResult.PASS);
UseBlockCallback.EVENT.register((player, level, hand, hitResult) -> InteractionResult.PASS);
UseItemCallback.EVENT.register((player, level, hand) -> InteractionResult.PASS);
PlayerBlockBreakEvents.BEFORE.register((level, player, pos, state, blockEntity) -> true);
ClientTickEvents.END_CLIENT_TICK.register(client -> {});
ServerTickEvents.END_SERVER_TICK.register(server -> {});
ServerLivingEntityEvents.AFTER_DEATH.register((entity, source) -> {});
ServerLifecycleEvents.SERVER_STARTED.register(server -> {});
```

核不到 → `search_fabric_docs` version=26.1.2。禁止把 26.2 博客或 1.21 wiki 当本版 API。
