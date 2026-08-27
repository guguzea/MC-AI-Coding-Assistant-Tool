---
description: 01 — 注册（26.1.2）
---

# 01 — 注册（26.1.2）

物品注册流程见 `26.1.2/develop_items_first-item`（ModItems.register + `Item.Properties` + 静态 initialize）。
创造栏：该页写明 `CreativeModeTabEvents.modifyOutputEvent`。

## Decision Flow

```
→ 物品 → first-item 页的 register 工厂，不要编 DeferredRegister
→ 方块 → 26.1.2/develop_blocks_first-block
→ 实体 → 26.1.2/develop_entities_first-entity
→ 类名以该页 reference 与 search_fabric_docs version=26.1.2 为准（去混淆官方名）
→ query_api 无本版索引
```
