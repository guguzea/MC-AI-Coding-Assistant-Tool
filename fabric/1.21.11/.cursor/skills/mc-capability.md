---
name: mc-capability
description: Fabric Attachment API。AttachmentRegistry、AttachmentType、getAttached。触发词：Attachment、Capability、AttachmentRegistry
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# Attachment（Fabric 1.21.11）

Fabric 没有 NeoForge `AttachmentType` 注册表或 `entity.getData`。用 `fabric-attachment-api-v1`（含在 `fabric-api`）：

```java
import net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry;
import net.fabricmc.fabric.api.attachment.v1.AttachmentType;
import net.minecraft.util.Identifier;

public static final AttachmentType<Integer> CLICKS =
    AttachmentRegistry.create(Identifier.of("examplemod", "clicks"));

entity.setAttached(CLICKS, 1);
Integer n = entity.getAttached(CLICKS);
```

不要写 `Key.create(Registries.ATTACHMENT_TYPE)` 或 `net.fabric.sdk:...`。

实体生命周期仍用 `ServerLivingEntityEvents.AFTER_DEATH` / `ALLOW_DEATH` / `ALLOW_DAMAGE` 和 `ServerEntityEvents.ENTITY_LOAD`，不要编造 `EntityEvent.TICK`。
每 tick 用 `ServerTickEvents` 或实体 `tick()`。
