---
name: mc-capability
description: Fabric 实体事件。ServerLivingEntityEvents、ServerEntityEvents。触发词：实体事件、AFTER_DEATH、ServerLivingEntityEvents
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 实体事件（Fabric 1.19.4）

Fabric **没有** Forge/NeoForge Capability 注册表。往实体挂数据：字段 + NBT，或等更高版本的 Attachment API（本档 用事件 + 自己的数据）。
没有 `EntityEvent.TICK`，也没有 `net.fabric.sdk` 坐标。依赖走 `fabric-api`（`fabric-entity-events-v1`）。

```java
import net.fabricmc.fabric.api.entity.event.v1.ServerLivingEntityEvents;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerEntityEvents;

ServerLivingEntityEvents.AFTER_DEATH.register((entity, damageSource) -> {
    // 服务端，实体已死亡
});

ServerLivingEntityEvents.ALLOW_DEATH.register((entity, source, amount) -> true);

ServerLivingEntityEvents.ALLOW_DAMAGE.register((entity, source, amount) -> true);

ServerEntityEvents.ENTITY_LOAD.register((entity, world) -> {
    // 实体加载到世界
});
```

每 tick 逻辑用 `ServerTickEvents` 或实体自己的 `tick()`，不要编造 `EntityEvent.TICK`。
