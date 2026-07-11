---
name: mc-block
description: Minecraft Forge 方块开发（Forge 1.13.2）。创建方块、TileEntity。
---

# 方块开发（Forge 1.13.2）

## 快速开始

```java
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.STONE)
        .hardnessAndResistance(1.5f, 6.0f)
);
```

## Block.Properties

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)
    .lightValue(int)
    .noDrops()
```

## 参考资料

- 详细示例：参见 `02-block.mdc`
