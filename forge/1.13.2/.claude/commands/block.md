---
name: block
description: Minecraft Forge 方块开发（Forge 1.13.2）。创建方块、TileEntity、ITileEntityProvider、Block.Properties。触发词：方块、Block、TileEntity、Block.Properties
---

# 方块开发（Forge 1.13.2）

## 快速开始

```java
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.STONE)
        .hardnessAndResistance(1.5f, 6.0f)
);

@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data
  → TileEntity（使用 ITileEntityProvider 接口）

IF 只是静态显示
  → 普通方块
```

## Block.Properties 常用配置

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)
    .lightValue(int)
    .noDrops()
    .sound(SoundType)
```

## TileEntity 方块

```java
public class MyBlock extends Block implements ITileEntityProvider {
    @Override
    public TileEntity createNewTileEntity(World world, int meta) {
        return new MyTileEntity();
    }
}
```

## 常见错误

- ❌ `createNewTileEntity()` 返回 null
- ❌ 在 TileEntity 构造函数中访问 world

## 参考资料

- 详细示例：参见 `02-block.mdc`
