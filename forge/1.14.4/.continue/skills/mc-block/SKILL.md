---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、TileEntity、方块状态属性、实体方块接口。触发词：方块、Block、TileEntity、EntityBlock、Block.Properties、方块实体
platform: forge
version: "1.14.4"
---

# 方块开发（Forge 1.14.4）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
// 注意：1.14.4 使用 Block.Properties，不是 BlockBehaviour.Properties
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.STONE)
        .hardnessAndResistance(1.5f, 6.0f)
        .harvestTool(ToolType.PICKAXE)
);

// 注册方式（RegistryEvent）
@SubscribeEvent
public static void onBlocksRegistry(final RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储）
  → TileEntity → 方块实现 hasTileEntity() + createTileEntity()

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体 → 参考 `02-block.mdc`（注意：1.14.4 无 FluidType）
```

## Block.Properties 常用配置

```java
Block.Properties.create(Material.WOOD)
    .hardnessAndResistance(1.5f, 6.0f)         // 硬度和抗爆性
    .harvestTool(ToolType.PICKAXE)              // 需要正确工具
    .harvestLevel(2)                           // 挖掘等级
    .sound(SoundType.WOOD)                     // 音效
    .notSolid()                                // 非固体
    .noDrops()                                 // 无掉落物
```

## Decision: 物品形态（ItemBlock）

```
IF 方块在创造模式标签中有对应物品
  → 注册同名 ItemBlock（需要手动 setRegistryName 匹配方块）

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 ItemBlock
```

## TileEntity 方块

```java
public class MyMachineBlock extends Block {
    public MyMachineBlock() {
        super(Block.Properties.create(Material.WOOD));
    }

    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(World world, BlockState state) {
        return new MyMachineTileEntity();
    }
}
```

## TileEntity 基础结构

```java
public class MyMachineTileEntity extends TileEntity {
    private int progress = 0;

    public MyMachineTileEntity() {
        super(TileEntityType.byId(0)); // 实际使用注册的 TileEntityType
    }

    // tick 逻辑（服务端）
    @Override
    public void tick() {
        if (world.isRemote) return;
        // 定时逻辑...
    }

    // NBT 同步（服务端 → 客户端）
    @Override
    public NBTTagCompound getUpdatePacket() {
        NBTTagCompound nbt = new NBTTagCompound();
        nbt.putInt("progress", progress);
        return nbt;
    }

    @Override
    public void onDataPacket(NetworkManager net, SPacketCustomPayload pkt) {
        readFromNBT(pkt.getNbtCompound());
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

- ❌ `Block.Properties.create()` vs `BlockBehaviour.Properties.of()`：1.14.4 用前者
- ❌ TileEntity.newBlockEntity() 返回 null（必须返回新实例）
- ❌ 在 TileEntity 构造函数中访问 world（world 可能为 null）
- ❌ `markDirty()` 忘记调用导致数据不保存
- ❌ 忘记 `harvestTool()` 导致任何物品都能掉落

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块注册后方块实体类型需要引用方块类型 |
| `mc-datagen` | 方块注册后可生成方块状态和模型 JSON（手动） |
| `mc-capability` | TileEntity 可附加 Capability 存储数据 |
