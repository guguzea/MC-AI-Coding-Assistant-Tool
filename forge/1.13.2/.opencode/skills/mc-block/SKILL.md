---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、TileEntity、ITileEntityProvider、Block.Properties、碰撞箱。触发词：方块、Block、TileEntity、ITileEntityProvider、Block.Properties、onBlockActivated
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 方块开发（Forge 1.13.2）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
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
IF 需要持久的 extra data（如机器存储）
  → TileEntity（使用 ITileEntityProvider 接口）

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体系统 → 参考 Forge 文档
```

## Block.Properties 常用配置

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)     // 硬度和抗爆性
    .lightValue(int)                      // 发光值 0-15
    .noDrops()                            // 无掉落
    .notSolid()                           // 非固体
    .variableOpacity()                     // 可变透明度
    .sound(SoundType)                     // 音效
```

## Decision: 物品形态（ItemBlock）

```
IF 方块在创造模式标签中有对应物品
  → 注册同名 ItemBlock（Forge 自动关联显示）

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 ItemBlock
```

## TileEntity 方块

```java
// 方块实现 ITileEntityProvider
public class MyMachineBlock extends Block implements ITileEntityProvider {
    @Override
    public TileEntity createNewTileEntity(World world, int meta) {
        return new MyTileEntity();
    }

    @Override
    public boolean onBlockActivated(World world, BlockPos pos, BlockState state,
                                    PlayerEntity player, Direction side,
                                    float hitX, float hitY, float hitZ) {
        // 右键交互逻辑
        return true;
    }
}
```

```java
// TileEntity
public class MyTileEntity extends TileEntity implements ITickable {
    private int progress = 0;

    public MyTileEntity() {
        super(TileEntityTypeRegistry.MY_TILE_ENTITY.get());
    }

    @Override
    public void update() {
        if (world.isRemote) return;
        progress++;
    }

    @Override
    public void writeToNBT(NBTTagCompound compound) {
        super.writeToNBT(compound);
        compound.setInteger("progress", progress);
    }

    @Override
    public void readFromNBT(NBTTagCompound compound) {
        super.readFromNBT(compound);
        progress = compound.getInteger("progress");
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

- ❌ `createNewTileEntity()` 返回 null（必须返回新实例）
- ❌ 在 TileEntity 构造函数中访问 world（world 可能为 null）
- ❌ 在 `readFromNBT`/`writeToNBT` 中访问世界数据

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 RegistryEvent.Register<Block> 注册 |
| `mc-gui` | 方块可实现 GUI 交互 |
| `mc-capability` | TileEntity 可附加 Capability 存储数据 |
