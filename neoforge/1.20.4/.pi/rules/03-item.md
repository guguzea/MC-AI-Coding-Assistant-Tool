---
description: 03 — 物品（NeoForge 1.20.4）
---

# 03 — 物品（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/items/

`DeferredRegister.Items` + `registerItem` / `registerSimpleItem` / `registerSimpleBlockItem`。

创造页：MDK 用自建 `CreativeModeTab` 的 `displayItems`，或 `BuildCreativeModeTabContentsEvent`。

1.20.4 MDK 食物：`FoodProperties.Builder().alwaysEat().nutrition().saturationMod()`。不要用已删除的 `Item.Properties.tab()`。



禁止：`RegistryObject<Item>` 当 NeoForge 1.20.4 持有类型；禁止 Fabric `Registry.register` 冒充。
