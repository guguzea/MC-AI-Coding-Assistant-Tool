---
description: 03 — 物品
---

# 03 — 物品

来源：https://github.com/FabricMC/fabric-docs `versions/26.1.2/develop/items/first-item.md`

逐步：`26.1.2/develop_items_first-item`。`Item.Properties.stacksTo`（可损坏物品堆叠恒为 1）。模型 `26.1.2/develop_items_item-models`。工具 `26.1.2/develop_items_custom-tools`。
创造栏：`CreativeModeTabEvents.modifyOutputEvent`（first-item 正文）。自定义页见 custom-creative-tabs。

必须提供 **client item** JSON：`assets/<modid>/items/<id>.json`（指向模型）。贴图 `textures/item/`，模型 `models/item/`（`item/generated` 或工具用 `item/handheld`）。翻译键 `item.<modid>.<id>`。

可选：`CompostableRegistry`、`FuelValueEvents.BUILD`。配方 JSON 放 `data/<modid>/recipe/`。自定义 tooltip 覆盖 `appendHoverText`（文档标明该方法已 deprecated，优先 Data Components）。

## Decision Flow

```
→ 普通物品 → first-item + Item.Properties
→ 模型 / client item → item-models + assets/.../items/
→ 工具 → custom-tools
→ 创造栏 → CreativeModeTabEvents.modifyOutputEvent
```
