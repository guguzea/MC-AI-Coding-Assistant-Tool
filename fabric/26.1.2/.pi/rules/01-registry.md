---
description: 01 — 注册（26.1.2）
---

# 01 — 注册（26.1.2）

物品注册流程见 `26.1.2/develop_items_first-item`（ModItems.register + `Item.Properties` + 静态 initialize）。
创造栏：该页写明 `CreativeModeTabEvents.modifyOutputEvent`。

## 附加数据（Data Attachments）

官方页 `26.1.2/develop_serialization_data-attachments`（本档 26.1.2 语料内 attachments 仅此 1 页）。名字与签名只用 `knowledge/common/verified-api-26.1.2.md` 表 A / 表 B 登记的 `net.fabricmc.fabric.api.attachment.v1.*`：`AttachmentRegistry.create / createPersistent / createDefaulted / builder`、`AttachmentRegistry.Builder.persistent / initializer / copyOnDeath / syncWith / buildAndRegister`、`AttachmentSyncPredicate.all / targetOnly / allButTarget`、`AttachmentTarget` 的 12 个 default 方法、`AttachmentType`、`GlobalAttachments` / `GlobalAttachmentsProvider`。

- 注入目标按该页写作 `Entity` / `BlockEntity` / `ServerLevel` / `ChunkAccess`；`Entity` / `BlockEntity` 简名见表 A，`ServerLevel` / `ChunkAccess` 本表 **未核实**，以该页为准。
- 该页 **未写模块 id**；依赖坐标仍是 `fabric-api`，不要编造 `fabric-attachment-api-v1` 之类。
- 创建方法的标识符首参是 26.1 Mojmap `Identifier`（不是 `ResourceLocation`）。
- 不要用 NeoForge `AttachmentType` / `getData` / `setData`，不要用 Forge Capability。

## Decision Flow

```
→ 物品 → first-item 页的 register 工厂，不要编 DeferredRegister
→ 方块 → 26.1.2/develop_blocks_first-block
→ 实体 → 26.1.2/develop_entities_first-entity
→ 附加数据 → AttachmentRegistry + AttachmentTarget 简名（本档核实表），不要套 Neo 的 getData/setData
→ 类名以该页 reference 与 search_fabric_docs version=26.1.2 为准（去混淆官方名）
→ query_api 无本版索引
```
