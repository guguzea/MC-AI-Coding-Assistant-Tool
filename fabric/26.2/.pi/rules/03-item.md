---
description: 03 — 物品（26.2）
---

# 03 — 物品（26.2）

逐步：`26.2/develop_items_first-item`、模型 `26.2/develop_items_item-models`、工具 `26.2/develop_items_custom-tools`、食物 `26.2/develop_items_food`、药水 `26.2/develop_items_potions`、刷怪蛋 `26.2/develop_items_spawn-egg`、盔甲 `26.2/develop_items_custom-armor`、数据组件 `26.2/develop_items_custom-data-components`。

**26.2 新增页**（26.1.2 没有）：`26.2/develop_items_custom-compostable`、`26.2/develop_items_custom-fuel`、`26.2/develop_items_custom-shields`。

**id 类**：`ModItemIds` 用 `ResourceKey` 存物品 id（`26.2/develop_items_first-item:25,33`）；`Item.Properties.stacksTo` 控制堆叠（可损坏物品恒为 1）。
创造栏：`CreativeModeTabEvents.modifyOutputEvent`（first-item 正文）；自定义页见 `custom-creative-tabs`。

必须提供 **client item** JSON：`assets/<modid>/items/<id>.json`（指向模型）。贴图 `textures/item/`，模型 `models/item/`（`item/generated`，工具用 `item/handheld`）。翻译键 `item.<modid>.<id>`。

可选：`CompostableRegistry`（`custom-compostable`）、`FuelValueEvents.BUILD`（`custom-fuel`）。配方 JSON 放 `data/<modid>/recipe/`。自定义 tooltip 覆盖 `appendHoverText`（文档标明已 deprecated，优先 Data Components）。

## Decision Flow

```
→ 普通物品 → first-item（ModItemIds + Item.Properties）
→ 模型 / client item → item-models + assets/.../items/
→ 工具 / 盔甲 / 盾牌 → custom-tools / custom-armor / custom-shields
→ 可堆肥 / 燃料 → custom-compostable / custom-fuel（26.2 新页）
→ 创造栏 → CreativeModeTabEvents.modifyOutputEvent
```
