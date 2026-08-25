[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.3，仅作结构/流程提示，不是 1.21.4 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.4) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-capability
description: Fabric Attachment API。AttachmentRegistry、AttachmentType、getAttached。触发词：Attachment、Capability、AttachmentRegistry
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# Attachment（Fabric 1.21.3）

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
