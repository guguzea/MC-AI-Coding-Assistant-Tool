---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、方块实体、方块状态属性、实体方块接口。触发词：方块、Block、TileEntity、hasTileEntity、Block.Properties
platform: forge
version: "1.16.5"
dependencies: []
mappings: official
---

# 方块开发（Forge 1.16.5）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.of(Material.WOOD)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储、村民记忆）
  → 方块实体（TileEntity）→ 重写 hasTileEntity() + createTileEntity()

IF 只是静态显示（无状态）
  → 普通方块

IF 需要流体
  → 流体（Fluid）→ 参考 `02-block.mdc`
```

## Block.Properties 常用配置

```java
Block.Properties.of(Material.WOOD)
    .strength(1.5f, 6.0f)     // 硬度和抗爆性
    .requiresCorrectToolForDrops()                         // 需要正确工具才能掉落
    .noOcclusion()                         // 不阻挡光影
    .isRedstoneConductor(...)             // 红石导体
    .isSuffocating(...)                  // 窒息方块
    .isViewBlocking(...)                  // 阻挡视角
    .sound(SoundType type)               // 音效
```

## Decision: 物品形态（BlockItem）

```
IF 方块在创意模式标签中有对应物品
  → 注册同名 BlockItem（Forge 自动关联显示）

IF 方块不应出现在物品栏（如空气、光源方块）
  → 不注册 BlockItem
```

## 带 TileEntity 的方块

本档没有 `EntityBlock` / `ServerTicker`。详见 `mc-blockentity`。

```java
public class MyMachineBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) { return true; }

    @Override
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return MyMachineBE.TYPE.get().create();
    }
}
```

## TileEntity 基础结构

```java
public class MyMachineBlockEntity extends TileEntity implements ITickableTileEntity {
    private int progress = 0;

    public MyMachineBlockEntity() {
        super(MyMachineBlockEntity.TYPE.get());
    }

    @Override
    public void tick() {
        if (level == null || level.isClientSide) return;
    }

    // 同步（服务端 → 客户端）
    @Override
    public CompoundNBT getUpdateTag() {
        CompoundNBT nbt = super.getUpdateTag();
        nbt.putInt("progress", progress);
        return nbt;
    }

    @Override
    public void handleUpdateTag(BlockState state, CompoundNBT nbt) { // 语料 tileentities_tileentity.md:71
        super.handleUpdateTag(state, nbt);
        this.progress = nbt.getInt("progress");
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

- ❌ `createTileEntity()` 返回 null（必须返回新实例；语料 tileentities_tileentity.md:31；原写 `createBlockEntity()` 属别的版本线，未核实禁止照抄）
- ❌ 在 TileEntity 构造函数中访问 world（world 可能为 null）
- ❌ `getServerTicker()` 在客户端返回非 null（tick 只应在服务端执行）
- ❌忘记 `requiresCorrectToolForDrops()` 导致任何物品都能掉落（TODO(未核实)：该名本档语料 0 命中、属别的版本线；本包 01-registry.mdc:174 示例用 `.requiresTool()`，成员名以 IDE 为准）

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块注册后方块实体类型需要引用方块类型 |
| `mc-datagen` | 方块注册后可生成方块状态和模型 JSON |
| `mc-capability` | 方块实体可附加 Capability 存储数据 |
