---
name: mc-events
description: Fabric 事件回调。ServerTickEvents、UseItemCallback、AttackBlockCallback、PlayerBlockBreakEvents。触发词：事件、Event、Callback、SubscribeEvent
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# 事件系统（Fabric 1.21.3）

Yarn 档。回调是 `SomeCallback.EVENT.register(lambda)`（或 `PlayerBlockBreakEvents.BEFORE.register`），**不是** Forge `@SubscribeEvent` / `IEventBus`。

在 `onInitialize()` / `onInitializeClient()` 里注册。不要编造 `ItemEvents` / `BlockEvents` / `PlayerTickEvents`。

## 常用回调

```java
// 服务端 tick：没有 PlayerTickEvents，自己遍历玩家
ServerTickEvents.END_SERVER_TICK.register(server -> {
    for (ServerPlayerEntity player : server.getPlayerManager().getPlayerList()) {
    }
});

// 左键方块
AttackBlockCallback.EVENT.register((player, world, hand, pos, direction) -> ActionResult.PASS);

// 右键方块 / 使用物品
UseBlockCallback.EVENT.register((player, world, hand, hitResult) -> ActionResult.PASS);
UseItemCallback.EVENT.register((player, world, hand) -> TypedActionResult.pass(player.getStackInHand(hand)));

// 破坏：BEFORE 返回 boolean（false 取消）
PlayerBlockBreakEvents.BEFORE.register((world, player, pos, state, blockEntity) -> true);

ServerLivingEntityEvents.ALLOW_DAMAGE.register((entity, source, amount) -> true);
ServerLivingEntityEvents.AFTER_DEATH.register((entity, source) -> {});
ServerLifecycleEvents.SERVER_STARTED.register(server -> {});
```

客户端 tick：`ClientTickEvents.END_CLIENT_TICK`（`@Environment(EnvType.CLIENT)`）。

核不到 → `search_fabric_docs` version=1.21.3。禁止抄 26.1 Mojmap（`Player` / `InteractionResult`）进本档。
