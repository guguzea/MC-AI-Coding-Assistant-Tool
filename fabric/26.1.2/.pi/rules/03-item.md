---
description: 03 — 物品
---

# 03 — 物品

逐步：`26.1.2/develop_items_first-item`。`Item.Properties.stacksTo`。模型 `26.1.2/develop_items_item-models`。工具 `26.1.2/develop_items_custom-tools`。
创造栏事件：`CreativeModeTabEvents.modifyOutputEvent`（first-item 正文）。

## Decision Flow

```
→ 普通物品 → first-item + Item.Properties
→ 模型 → item-models
→ 工具 → custom-tools
→ 创造栏 → CreativeModeTabEvents.modifyOutputEvent
```
