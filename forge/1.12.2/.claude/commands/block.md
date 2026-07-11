# 方块开发（Forge 1.12.2）

## 快速开始

```java
// 方块类
public class MyBlock extends Block {
    public MyBlock() {
        super(Block.Properties.create(Material.ROCK)
            .hardnessAndResistance(1.5f, 6.0f)
            .harvestLevel("pickaxe", 0)
        );
    }
}

// 注册
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModBlocks {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new MyBlock().setRegistryName(MOD_ID, "my_block")
        );
    }
}
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储）
  → 方块实体（Block + TileEntity）

IF 只是静态显示（无状态）
  → 普通方块
```

## Block.Properties 常用配置

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)
    .harvestLevel("pickaxe", 0)
    .harvestTool("pickaxe")
    .lightValue(0)
    .sound(SoundType.WOOD)
```

## TileEntity 方块

```java
public class MyTileBlock extends Block {
    @Override
    public boolean hasTileEntity(IBlockState state) { return true; }

    @Override
    public TileEntity createTileEntity(World world, IBlockState state) {
        return new MyTileEntity();
    }
}
```

```java
public class MyTileEntity extends TileEntity implements ITickable {
    @Override
    public void update() { /* 每 tick 执行 */ }

    @Override
    public NBTTagCompound writeToNBT(NBTTagCompound compound) {
        super.writeToNBT(compound);
        return compound;
    }

    @Override
    public void readFromNBT(NBTTagCompound compound) {
        super.readFromNBT(compound);
    }
}
```

## 常见错误

- ❌ `createTileEntity()` 返回 null
- ❌ 在 TileEntity 构造函数中访问 world
- ❌ 忘记注册 TileEntity

## 参考资料

- 详细示例：参见 `02-block.mdc`
