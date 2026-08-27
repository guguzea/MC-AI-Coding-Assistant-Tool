---
description: 02 — 方块（NeoForge 1.20.6）
---

# 02 — 方块（NeoForge 1.20.6）

来源：https://docs.neoforged.net/docs/1.20.6/blocks/

世界里只有一份 `Block` 单例，坐标上是引用。用 `DeferredRegister.createBlocks(modid)`，`#register` 返回 `DeferredBlock`。助手：`registerBlock` / `registerSimpleBlock`。本档示例是 `() -> new Block(...)`，**没有** `setId` 必填（那是更晚档）。

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks("yourmodid");
public static final DeferredBlock<Block> MY_BETTER_BLOCK = BLOCKS.register(
    "my_better_block",
    () -> new Block(BlockBehaviour.Properties.of()
        .destroyTime(2.0f)
        .explosionResistance(10.0f)
        .sound(SoundType.GRAVEL)
        .lightLevel(state -> 7)
    ));
```

官方强调的 Properties：`destroyTime`、`explosionResistance`、`sound`、`lightLevel`、`friction`。随机刻用 `randomTicks()`。**禁止**在注册窗口外 `new Block()`。

`BlockItem` 必须另注册。方块实体见 https://docs.neoforged.net/docs/1.20.6/blockentities/：注册 `BlockEntityType`，不是注册 BE 实例。同步优先 `getUpdateTag` / `ClientboundBlockEntityDataPacket`；自定义包走 Payload（见 06），不是 SimpleChannel。
