---
description: 03 — 物品（NeoForge 1.21.8）
---

# 03 — 物品（NeoForge 1.21.8）

来源：https://docs.neoforged.net/docs/1.21.8/items/

`DeferredRegister.Items` + `registerItem` / `registerSimpleItem` / `registerSimpleBlockItem`。文档示例返回 **`DeferredItem<Item>`**。`setId` 必填（由 `registerItem` 写入）。属性仍传 `new Item.Properties()`。修理禁用方法是 **`setNoCombineRepair`**（不是更早档的 `setNoRepair`）。

创造页：`BuildCreativeModeTabContentsEvent#accept` 或自建 tab `displayItems`。



1.21+ 物品数据优先 Data Components，不要把 1.12 NBT 当主存储。

禁止：`RegistryObject<Item>` 当 NeoForge 1.21.8 持有类型；禁止 Fabric `Registry.register` 冒充。
