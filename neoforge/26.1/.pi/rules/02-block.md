---
description: 02 — 方块（NeoForge 26.1）
---

# 02 — 方块（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/blocks/

世界里只有一份 `Block` 单例，坐标上是引用。用 `DeferredRegister.Blocks` + `registerBlock` / `registerSimpleBlock`。

```java
public static final DeferredBlock<Block> DRIEDGHAST_BLOCK = BLOCKS.registerBlock(
    "driedghast_block",
    Block::new,
    BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
```

属性工厂签名随版本变（26.1 以文档/MDK 为准：1.20.4 MDK 传 `Properties` 对象；26.1 MDK `registerSimpleBlock` 用 `p -> p.mapColor(...)`）。

方块实体见 https://docs.neoforged.net/docs/blockentities/：注册 `BlockEntityType`，不是注册 BE 实例。同步优先 `getUpdateTag` / `ClientboundBlockEntityDataPacket`；自定义包走 Payload（见 06），不是 SimpleChannel。
