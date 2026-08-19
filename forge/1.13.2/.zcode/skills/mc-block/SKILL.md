---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、TileEntity、IForgeBlock、Block.Properties。触发词：方块、Block、TileEntity、hasTileEntity、createTileEntity、Block.Properties、onBlockActivated
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.13.2）

## 快速开始

```java
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.ROCK)
        .hardnessAndResistance(1.5f, 6.0f)
);

@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

本档没有 `DeferredRegister`。材料字段是 `Material.ROCK`，不是 `Material.STONE`。

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储）
  → TileEntity → hasTileEntity(IBlockState) + createTileEntity(IBlockState, IBlockReader)

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体系统 → 参考 Forge 文档
```

## Block.Properties 常用配置

来源：ForgeJavaDocs-NG `1.13.2-25.0.220`。

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)
    .lightValue(0)
    .doesNotBlockMovement()
    .needsRandomTick()
    .variableOpacity()
    .sound(SoundType.WOOD)
```

本档 Properties **没有** `noDrops()` / `notSolid()` / `harvestLevel()` / `harvestTool()`。

## Decision: 物品形态（ItemBlock）

```
IF 方块在创造模式标签中有对应物品
  → 注册同名 ItemBlock

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 ItemBlock
```

## TileEntity 方块

`ITileEntityProvider` 已 `@Deprecated`。优先 `IForgeBlock`：

```java
public class MyMachineBlock extends Block {
    @Override
    public boolean hasTileEntity(IBlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(IBlockState state, IBlockReader world) {
        return new MyTileEntity();
    }
}
```

```java
public class MyTileEntity extends TileEntity implements ITickable {
    private int progress = 0;

    public MyTileEntity() {
        super(MY_TILE_ENTITY_TYPE);
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
        progress++;
    }

    @Override
    public NBTTagCompound write(NBTTagCompound compound) {
        compound = super.write(compound);
        compound.setInt("progress", progress);
        return compound;
    }

    @Override
    public void read(NBTTagCompound compound) {
        super.read(compound);
        progress = compound.getInt("progress");
    }
}
```

每 tick 用 `net.minecraft.util.ITickable#tick`，不是 1.12 的 `update()`，也不是 1.14 的 `ITickableTileEntity`。NBT 仍是 `NBTTagCompound` + `setInt`/`getInt`。

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

- ❌ `createTileEntity` / `createNewTileEntity` 返回 null（必须返回新实例）
- ❌ 在 TileEntity 构造函数中访问 world（world 可能为 null）
- ❌ `writeToNBT` / `readFromNBT` / `setInteger`（本档是 `write`/`read` + `setInt`）
- ❌ `createNewTileEntity(World, int meta)`（已弃用接口的签名是 `IBlockReader`）
- ❌ `Material.STONE` / `DeferredRegister` / `CompoundNBT`

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 RegistryEvent.Register<Block> 注册 |
| `mc-gui` | 方块可实现 GUI 交互 |
| `mc-capability` | TileEntity 可附加 Capability 存储数据 |
