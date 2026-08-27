---
description: 04 — 实体
---

# 04 — 实体

逐步：`26.1.2/develop_entities_first-entity`。渲染概念 `26.1.2/develop_rendering_basic-concepts`。缺签名则停。Mojmap。

文档示例：`PathfinderMob` + `registerGoals()`；属性 `FabricDefaultAttributeRegistry.register`（loader-api：`EntityType` + `AttributeSupplier.Builder`）；客户端 `EntityRendererRegistry.register`；存档 `addAdditionalSaveData` / `readAdditionalSaveData`；同步 `EntityDataAccessor`。完整步骤见 `mc-entity`。

## Decision Flow

```
→ 实体类型 → first-entity（Registry.register EntityType）
→ 属性 → FabricDefaultAttributeRegistry.register
→ 渲染 → EntityRendererRegistry（客户端入口）+ rendering_basic-concepts
→ 存档 → addAdditionalSaveData / readAdditionalSaveData
→ 核不到的方法名 → search_fabric_docs version=26.1.2，禁止编造
```
