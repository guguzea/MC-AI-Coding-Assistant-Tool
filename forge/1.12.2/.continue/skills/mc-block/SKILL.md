---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、TileEntity、方块状态属性、实体方块接口。触发词：方块、Block、TierEntity、IBlockState、BlockState
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.12.2）

## 快速开始

```java
// 方块类
public class MyBlock extends Block {
    public MyBlock() {
        super(Material.ROCK);
        setHardness(1.5F);
        setResistance(6.0F);
        setHarvestLevel("pickaxe", 0);
        setSoundType(SoundType.STONE);
    }
}

// 注册（参见 mc-registry Skill）
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
  → 流体（Fluid）→ 参考 `02-block.mdc`
```

## 方块 setter 常用配置（没有 `Block.Properties`）

```java
new Block(Material.WOOD)
    .setHardness(1.5F)
    .setResistance(6.0F)
    .setHarvestLevel("pickaxe", 0)
    .setLightLevel(0.0F)
    .setSoundType(SoundType.WOOD);
```

## TileEntity 方块

```java
public class MyTileBlock extends Block {
    @Override
    public boolean hasTileEntity(IBlockState state) {
        return true;
    }

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
    public void update() {
        // 每 tick 执行
    }

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

- ❌ `createTileEntity()` 返回 null（必须返回新实例）
- ❌ 在 TileEntity 构造函数中访问 world
- ❌ 忘记注册 TileEntity

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 方块注册后方块实体类型需要引用方块类型 |
| `mc-capability` | TileEntity 可附加 Capability 存储数据 |
