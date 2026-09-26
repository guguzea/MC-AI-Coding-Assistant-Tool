---
description: 02 — 方块（NeoForge 1.21.11）
---

# 02 — 方块（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/blocks/

世界里只有一份 `Block` 单例，坐标上是引用。用 `DeferredRegister.Blocks` + `registerBlock` / `registerSimpleBlock`。

```java
public static final DeferredBlock<Block> COPPERGOLEM_BLOCK = BLOCKS.registerBlock(
    "coppergolem_block",
    Block::new,
    BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
```

属性工厂签名随版本变（1.21.11 以文档/MDK 为准：1.20.4 MDK 传 `Properties` 对象；26.1 MDK `registerSimpleBlock` 用 `p -> p.mapColor(...)`）。

语料指针（本档 processed 目录 = `data/neoforge_1.21.11/neoforge-docs/1.21.11/processed/`；行号处该行逐字含括注的写法）：`blocks.md:60` 正文声明属性由 `BlockBehaviour.Properties#of` 创建 · `blocks.md:104` `registryName -> new Block(BlockBehaviour.Properties.of()`（起于 `blocks.md:100` 的 `BLOCKS.register("my_better_block", …)`）· `blocks.md:248` 同形（起于 `blocks.md:244`）· Supplier 态 `() -> BlockBehaviour.Properties.of()` 两处 = `blocks.md:268`（配 `blocks.md:262` 的 `registerBlock` + `Block::new`）与 `blocks.md:296`（配 `blocks.md:292` 的 `registerSimpleBlock`）· UnaryOperator 态 `props -> props` 两处 = `blocks.md:282`（`blocks.md:276` 的 `registerBlock`）与 `blocks.md:304`（`blocks.md:300` 的 `registerSimpleBlock`）· 裸形（`Properties.of()` 不带 `() ->` 或 `props ->` 直接当第二参）在本档语料同样有支撑，位点 = `advanced_featureflags.md:112` 的 `BLOCKS.registerSimpleBlock("experimental", BlockBehaviour.Properties.of()` ⇒ 上方示例**不改写法** · 物品侧 = `items.md:27`（声明 `Item.Properties` 由 `Item.Properties#of` 创建）、`items.md:81`（`ITEMS.registerItem`）、`items.md:99`（`ITEMS.registerSimpleItem`）、`items.md:115` 与 `items.md:119`（省略 Properties 实参的重载）· 方块实体构造收 `BlockBehaviour.Properties` 形参 = `blockentities.md:106`。`concepts_registries.md` 没有属性工厂位点（实测两扫合起来：`grep -n Properties` 与该页的 `.of()` 只命中 `:466` 一句 `List.of()`），故本页不进指针清单。

方块实体见 https://docs.neoforged.net/docs/1.21.11/blockentities/：注册 `BlockEntityType`，不是注册 BE 实例。同步优先 `getUpdateTag` / `ClientboundBlockEntityDataPacket`；自定义包走 Payload（见 06），不是 SimpleChannel。
