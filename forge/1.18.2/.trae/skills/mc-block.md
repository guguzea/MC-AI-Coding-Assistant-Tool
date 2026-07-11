---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、方块实体、方块状态属性。触发词：方块、Block、BlockEntity、EntityBlock、Properties
platform: forge
version: "1.18.2"
---

# 方块开发（Forge 1.18.2）

## 快速开始

```java
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Properties.of(Material.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()));
```

## EntityBlock 方块

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}
```

## 世界高度注意

1.18.2 世界高度为 **-64 到 320**。

## 参考资料

参见 `02-block.mdc`
