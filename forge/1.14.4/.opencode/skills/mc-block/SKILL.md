---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、方块实体、方块状态属性、实体方块接口。触发词：方块、Block、TileEntity、hasTileEntity、Block.Properties、方块实体
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.14.4）

## 快速开始

```java
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.create(Material.ROCK)
        .hardnessAndResistance(1.5f, 6.0f)
    )
);
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储、村民记忆）
  → 方块实体（TileEntity）→ 重写 hasTileEntity() + createTileEntity(BlockState, IBlockReader)

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体（Fluid）→ 参考 `02-block.mdc`
```

## Block.Properties 常用配置

来源：ForgeJavaDocs-NG `1.14.4-28.2.23`。

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)
    .harvestTool(ToolType.AXE)
    .harvestLevel(0)
    .sound(SoundType.WOOD)
    .lightValue(0)
    .doesNotBlockMovement()
    .noDrops()
```

本档没有 `BlockBehaviour.Properties.of()` / `requiresCorrectToolForDrops()` / `notSolid()`（邻版 API）。

## Decision: 物品形态（BlockItem）

```
IF 方块在创造模式标签中有对应物品
  → 注册同名 BlockItem

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 BlockItem
```

## 带 TileEntity 的方块

本档没有 `EntityBlock` / `getTicker`。详见 `mc-blockentity`。

```java
public class MyMachineBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) { return true; }

    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return MyMachineTE.TYPE.get().create();
    }
}
```

## TileEntity 基础结构

```java
public class MyMachineTE extends TileEntity implements ITickableTileEntity {
    private int progress = 0;

    public MyMachineTE() {
        super(MyMachineTE.TYPE.get());
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
    }

    @Override
    public CompoundNBT write(CompoundNBT nbt) {
        nbt = super.write(nbt);
        nbt.putInt("progress", progress);
        return nbt;
    }

    @Override
    public void read(CompoundNBT nbt) {
        super.read(nbt);
        this.progress = nbt.getInt("progress");
    }

    @Override
    public CompoundNBT getUpdateTag() {
        return this.write(new CompoundNBT());
    }
}
```

数据变化后 `markDirty()`。同步细节见 `mc-blockentity`。不要抄 1.17+ 的 `saveAdditional` / `setChanged` / `getTicker`。

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

- ❌ 在 TileEntity 构造函数中访问 world（world 可能为 null）
- ❌ `write` 写成 void、或不 `return` CompoundNBT
- ❌ 用 1.12 的 `NBTTagCompound` / `setInteger`（本档是 `CompoundNBT` + `putInt`）
- ❌ `createTileEntity(World, BlockState)`（本档签名是 `(BlockState, IBlockReader)`）
- ❌ 抄 `getTicker()` / `EntityBlock` / `requiresCorrectToolForDrops()`

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | 方块注册后方块实体类型需要引用方块类型 |
| `mc-datagen` | 方块注册后可生成方块状态和模型 JSON |
| `mc-capability` | 方块实体可附加 Capability 存储数据 |
