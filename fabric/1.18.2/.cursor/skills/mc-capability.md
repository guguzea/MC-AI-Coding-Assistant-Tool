---
name: mc-capability
description: Fabric 实体事件。ServerEntityCombatEvents、ServerEntityEvents。触发词：实体事件、AFTER_KILLED_OTHER_ENTITY
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 实体事件（Fabric 1.18.2）

Fabric **没有** Forge Capability。本档 **没有** `ServerLivingEntityEvents.AFTER_DEATH`（约 1.19.4 才有）。
不要编造 `EntityEvent.TICK` / `EntityEvents.ENTITY_DEATH`，也不要写 `net.fabric.sdk`。
依赖走 `fabric-api`（`fabric-entity-events-v1` + lifecycle）。

```java
import net.fabricmc.fabric.api.entity.event.v1.ServerEntityCombatEvents;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerEntityEvents;
import net.fabricmc.fabric.api.event.player.AttackEntityCallback;

AttackEntityCallback.EVENT.register((player, world, hand, entity, hitResult) -> {
    return ActionResult.PASS;
});

ServerEntityCombatEvents.AFTER_KILLED_OTHER_ENTITY.register((world, entity, killed) -> {
    // 击杀者 entity 杀死了 killed（服务端）
});

ServerEntityEvents.ENTITY_LOAD.register((entity, world) -> {
    // 实体加载到世界
});
```

受害者「即将死亡」若没有事件，用 Mixin 或实体 `onDeath`。
每 tick 用 `ServerTickEvents` 或实体 `tick()`。
