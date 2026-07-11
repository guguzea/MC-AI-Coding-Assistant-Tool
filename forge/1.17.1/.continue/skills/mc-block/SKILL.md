---
name: mc-block
description: Minecraft Forge 方块开发。创建方块、方块实体、方块状态属性、实体方块接口。触发词：方块、Block、BlockEntity、EntityBlock、Block.Properties
platform: forge
version: "1.17.1"
dependencies: []
mappings: parchment
---

# 方块开发（Forge 1.17.1）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.of(Material.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);
```

## Decision: 选择方块类型

```
IF 需要持久的 extra data（如机器存储）
  → 方块实体（BlockEntity）→ 实现 EntityBlock 接口

IF 只是静态显示（无状态）
  → 普通方块
```

## Block.Properties 常用配置

```java
Block.Properties.of(Material.WOOD)
    .strength(1.5f, 6.0f)
    .requiresCorrectToolForDrops()
    .noOcclusion()
    .isRedstoneConductor(...)
```

## EntityBlock 方块

```java
public class MyMachineBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyMachineBlockEntity(pos, state);
    }

    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return level.isClientSide ? null :
            (type == MyMachineBlockEntity.TYPE.get() ? MyMachineBlockEntity::tick : null);
    }
}
```

## BlockEntity 基础结构

```java
public class MyMachineBlockEntity extends BlockEntity {
    private int progress = 0;

    public MyMachineBlockEntity(BlockPos pos, BlockState state) {
        super(MyMachineBlockEntity.TYPE.get(), pos, state);
    }

    // NBT 持久化
    @Override
    protected void saveAdditional(CompoundTag nbt) {
        super.saveAdditional(nbt);
        nbt.putInt("progress", progress);
    }

    @Override
    public void load(CompoundTag nbt) {
        super.load(nbt);
        this.progress = nbt.getInt("progress");
    }
}
```

## 常见错误

- ❌ `BlockEntity.newBlockEntity()` 返回 null
- ❌ 在 BlockEntity 构造函数中访问 world
- ❌ `getTicker()` 在客户端返回非 null
- ❌ 忘记 `requiresCorrectToolForDrops()`

## 参考资料

- 详细决策流和示例：参见 `02-block.mdc`
