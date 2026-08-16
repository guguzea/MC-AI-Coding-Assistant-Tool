---
description: 03 — 物品（NeoForge 1.21.11）
---

# 03 — 物品（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/items/

`DeferredRegister.Items` + `registerItem` / `registerSimpleItem` / `registerSimpleBlockItem`。文档示例返回 **`DeferredItem<Item>`**。`setId` 必填。第三参是 **unary operator** `props -> props`，不是 `new Item.Properties()`。修理禁用：`setNoCombineRepair`。

创造页：`BuildCreativeModeTabContentsEvent#accept` 或自建 tab `displayItems`。



1.21+ 物品数据优先 Data Components，不要把 1.12 NBT 当主存储。

禁止：`RegistryObject<Item>` 当 NeoForge 1.21.11 持有类型；禁止 Fabric `Registry.register` 冒充。
