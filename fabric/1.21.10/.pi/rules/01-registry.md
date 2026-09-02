---
description: 01-registry Fabric 1.21.10
alwaysApply: true
---

# 01-registry — 注册（Fabric 1.21.10）

来源：search_fabric_docs version=1.21.10。核实表 knowledge/common/verified-api-1.21.10.md。

Registry.register。禁止 DeferredRegister / GameRegistry。

## 附加数据（Attachment）

本档有官方页 `1.21.10/develop_data-attachments`。只用核实表里那组简名：`AttachmentRegistry.create / createPersistent / createDefaulted`、`AttachmentSyncPredicate.all / targetOnly / allButTarget`、`hasAttached / getAttached / getAttachedOrThrow / getAttachedOrSet / getAttachedOrElse / setAttached / modifyAttached / removeAttached`，注入目标 `Entity / BlockEntity / ServerLevel / ChunkAccess`。

- 该页未写出 FQCN 与模块 id，本档 **未核实** 二者；依赖坐标须工程实测，禁止照抄 `fabric/1.21.11` 或邻版。
- 不要用 NeoForge `AttachmentType` / `getData` / `setData`，不要用 Forge Capability。
- 该 API 页自称 experimental：先问用户是否接受实验性 API。
