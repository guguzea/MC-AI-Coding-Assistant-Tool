---
description: 03 — 物品（NeoForge 1.21.3）
---

# 03 — 物品（NeoForge 1.21.3）

来源：https://docs.neoforged.net/docs/1.21.3/items/

`DeferredRegister.Items` + `registerItem` / `registerSimpleItem` / `registerSimpleBlockItem`。文档示例返回 **`DeferredItem<Item>`**。`Item.Properties#setId` **必须设置**（`registerItem` 内部会 `ResourceKey.create(Registries.ITEM, registryName)`）。属性对象仍是 `new Item.Properties()`，不是 unary operator。食物/工具另有 `remainders` / `enchantable` / `equippable`。

创造页：`BuildCreativeModeTabContentsEvent#accept` 或自建 tab `displayItems`。



1.21+ 物品数据优先 Data Components，不要把 1.12 NBT 当主存储。

禁止：`RegistryObject<Item>` 当 NeoForge 1.21.3 持有类型；禁止 Fabric `Registry.register` 冒充。
