---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、TileEntity、方块状态属性、方块实体方块。触发词：方块、Block、TeleEntity、ITileEntityProvider、Block.Properties、方块实体
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.15.2）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.create(Material.STONE)
        .hardnessAndResistance(1.5f, 6.0f)
        .harvestTool(ToolType.PICKAXE)
        .harvestLevel(0)
    )
);
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储）
  → TileEntity：方块重写 hasTileEntity() + createTileEntity()（IForgeBlock）。不要再用已 @Deprecated 的 ITileEntityProvider

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体（Fluid）→ 参考 `02-block.mdc`
```

## Block.Properties 常用配置

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)              // 硬度和抗爆性
    .harvestTool(ToolType.PICKAXE)                    // 需要特定工具
    .harvestLevel(0)                                  // 挖掘等级
    .noDrops()                                       // 无掉落
    .notSolid()                                      // 非固体
    .sound(SoundType.WOOD)                           // 音效
```

## Decision: 物品形态（BlockItem）

```
IF 方块在创造模式标签中有对应物品
  → 注册同名 BlockItem（Forge 自动关联显示）

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 BlockItem
```

## 方块实体方块

```java
public class MyMachineBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return new MyMachineTileEntity();
    }
}
```

## TileEntity 基础结构

```java
public class MyMachineTileEntity extends TileEntity implements ITickableTileEntity {
    private int progress = 0;

    public MyMachineTileEntity() {
        super(MyMachineTileEntities.MY_MACHINE.get());
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
        // 定时逻辑...
    }

    @Override
    public CompoundNBT getUpdateTag() {
        return this.write(new CompoundNBT());
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

```json
{
  "multipart": [
    { "when": { "facing": "north" }, "apply": { "model": "modid:block/my_block" } },
    { "when": { "facing": "east" },  "apply": { "model": "modid:block/my_block", "y": 90 } }
  ]
}
```

## 常见错误

- ❌ `createTileEntity()` 返回 null（必须返回新实例）
- ❌ 在 TileEntity 构造函数中访问 world（world 可能为 null）
- ❌ 忘记 `harvestTool()` 和 `harvestLevel()` 导致任何物品都能挖掘
- ❌ `hasTileEntity()` 返回 false 但实际需要 TileEntity

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块注册后方块实体类型需要引用方块类型 |
| `mc-datagen` | 方块注册后可生成方块状态和模型 JSON |
| `mc-capability` | TileEntity 可附加 Capability 存储数据 |
