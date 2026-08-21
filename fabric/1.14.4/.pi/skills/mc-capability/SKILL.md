---
name: mc-capability
description: Fabric 1.14.4 实体事件。AttackEntityCallback、ServerEntityEvents。触发词：实体事件、AttackEntityCallback
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 实体事件（Fabric 1.14.4）

Fabric **没有** Forge Capability，也 **没有** `ServerLivingEntityEvents`（该类不在本档索引中）。
不要编造 `EntityEvent.TICK` / `EntityEvents`，不要写 `net.fabric.sdk`。
不要用 1.20 的 `ItemGroupEvents` 当本档 API。依赖走 `fabric-api`。

```java
import net.fabricmc.fabric.api.event.player.AttackEntityCallback;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerEntityEvents;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;

AttackEntityCallback.EVENT.register((player, world, hand, entity, hitResult) -> {
    return ActionResult.PASS;
});

ServerEntityEvents.ENTITY_LOAD.register((entity, world) -> {
    // 实体加载到世界
});

ServerTickEvents.END_SERVER_TICK.register(server -> {
    // 没有 EntityEvent.TICK；按需遍历实体
});
```

死亡/受伤改数值：实体方法或 Mixin。物品分组用 `Item.Settings().group(ItemGroup.MISC)`。
