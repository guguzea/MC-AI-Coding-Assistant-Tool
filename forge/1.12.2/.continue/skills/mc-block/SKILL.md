---
name: mc-block
description: Forge 1.12.2 Block skill (Block.Properties, TileEntity, IBlockState, no BlockBehaviour.Properties)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.12.2）

## 快速开始

```java
public class MyBlock extends Block {
    public MyBlock() {
        super(Block.Properties.create(Material.ROCK)
            .hardnessAndResistance(1.5f, 6.0f)
            .harvestLevel("pickaxe", 0)
        );
    }
}

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
  → 方块实体（Block + TileEntity）→ 实现 createTileEntity()

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体（Fluid）→ 参考 Fluid 系统
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
    public MyTileEntity() { super(); }

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

## BlockState JSON 格式

文件位置：`assets/{modid}/blockstates/my_block.json`

```json
{
  "variants": {
    "": { "model": "modid:block/my_block" }
  }
}
```

## 常见错误

- ❌ `createTileEntity()` 返回 null
- ❌ 在 TileEntity 构造函数中访问 world
- ❌ 忘记注册 TileEntity

## Key Forge 1.12.2 Specs

- IBlockState (not BlockState)
- TileEntity (not BlockEntity)
- NBTTagCompound (not CompoundTag)
- @SideOnly(Side.CLIENT)
- world.isRemote
- pack_format = 4
