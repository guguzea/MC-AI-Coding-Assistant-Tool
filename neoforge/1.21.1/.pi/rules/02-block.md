---
description: 02 — 方块（NeoForge 1.21.1）
---

# 02 — 方块（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/blocks/

世界里只有一份 `Block` 单例，坐标上是引用。用 `DeferredRegister.createBlocks(modid)`，`#register` 返回 `DeferredBlock`。助手：`registerBlock` / `registerSimpleBlock`。

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks("yourmodid");
public static final DeferredBlock<Block> EXAMPLE_BLOCK = BLOCKS.registerBlock(
    "example_block",
    Block::new,
    BlockBehaviour.Properties.of()
        .destroyTime(2.0f)
        .explosionResistance(10.0f)
        .sound(SoundType.GRAVEL)
        .lightLevel(state -> 7));
```

官方强调的 Properties：`destroyTime`、`explosionResistance`、`sound`、`lightLevel`、`friction`。也可用 `mapColor`。**禁止**在注册窗口外 `new Block()`。

`BlockItem` 必须另注册（方块不等于物品栏里的方块）。方块实体见 https://docs.neoforged.net/docs/1.21.1/blockentities/：注册 `BlockEntityType`，不是注册 BE 实例。同步优先 `getUpdateTag` / `ClientboundBlockEntityDataPacket`；自定义包走 Payload（见 06），不是 SimpleChannel。
