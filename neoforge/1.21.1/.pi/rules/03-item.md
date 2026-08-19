---
description: 03 — 物品（NeoForge 1.21.1）
---

# 03 — 物品（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/items/

`DeferredRegister.Items` + `registerItem` / `registerSimpleItem` / `registerSimpleBlockItem`。文档示例返回类型为 `Supplier<Item>`（尚未强制 `DeferredItem`）。`Item.Properties` 用 `new Item.Properties()` 或 `Item.Properties#of`，**没有** `setId` 必填。

官方列出的常用 Properties：`stacksTo`、`durability`（默认 0 = 无耐久，并会把堆叠锁为 1）、`craftRemainder`、`fireResistant`、`setNoRepair`、`rarity`、`food`。数据走 Data Components，不要把 1.12 NBT 当主存储。

食物：`FoodProperties.Builder` 的 `nutrition`、`saturationMod`、`alwaysEdible`（饱食也能吃）、`fast`、`effect(Supplier<MobEffectInstance>, float)`（直接传 instance 的重载已被 NeoForge 标过时）。

创造栏：加入原版页用 `BuildCreativeModeTabContentsEvent`（模组总线、逻辑客户端），`event.getTabKey() == CreativeModeTabs.INGREDIENTS` 后 `event.accept(...)`。自建页注册 `CreativeModeTab.builder()` 的 `displayItems`。

禁止：`RegistryObject<Item>` 当 NeoForge 1.21.1 持有类型；禁止 Fabric `Registry.register` 冒充。
