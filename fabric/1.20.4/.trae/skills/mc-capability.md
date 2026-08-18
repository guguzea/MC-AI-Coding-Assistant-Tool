---
name: mc-capability
description: Fabric Attachment 与实体事件。AttachmentRegistry、ServerLivingEntityEvents。触发词：Attachment、AFTER_DEATH、getAttached
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
---

# Attachment 与实体事件（Fabric 1.20.4）

## Attachment（`fabric-attachment-api-v1`）

本档已有 Attachment。不要用 NeoForge `entity.getData` / `Registries.ATTACHMENT_TYPE`。

```java
import net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry;
import net.fabricmc.fabric.api.attachment.v1.AttachmentType;

public static final AttachmentType<Integer> CLICKS =
    AttachmentRegistry.create(new Identifier(MOD_ID, "clicks"));

entity.setAttached(CLICKS, 1);
Integer n = entity.getAttached(CLICKS);
```

## 实体生命周期事件

没有 `EntityEvent.TICK`，也没有 `net.fabric.sdk` 坐标。依赖走 `fabric-api`（模块 `fabric-entity-events-v1`）。

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

每 tick 逻辑用 `ServerTickEvents` 或实体自己的 `tick()`。
物品分组用 `ItemGroupEvents`，不是本 Skill 里的假 Capability API。
