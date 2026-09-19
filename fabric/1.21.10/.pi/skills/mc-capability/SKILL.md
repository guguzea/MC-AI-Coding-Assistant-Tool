---
name: mc-capability
description: Fabric Attachment API。AttachmentRegistry、AttachmentType、getAttached。触发词：Attachment、Capability、AttachmentRegistry
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.4，仅作结构/流程提示，不是 1.21.10 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.10) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

# Attachment（Fabric 1.21.10）

Fabric 没有 NeoForge `AttachmentType` 注册表或 `entity.getData`。用 `fabric-attachment-api-v1`（含在 `fabric-api`）：

> ⚠️ **FQCN / 模块 id 未核实（A-43 复议 2026-09-19）**：本档 `knowledge/common/verified-api-1.21.10.md:25` 明文——该页只写简名、示例走 `@[code](@/reference/…)` include（仓内无 `reference/`），`net.fabricmc.fabric.api.attachment.v1.*` FQCN 与 `fabric-attachment-api-v1` 模块 id **在本档未核实、禁止当已核实依赖坐标输出**。下列 import 仅为**形态示意**（包名为真实 Fabric 包名，但未在本档核实）：先 `search_fabric_docs(version=1.21.10)` 或官方文档核对再落地。

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
