---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。BlockEntity 注册、Ticker、ContainerData/Menu 联动、BlockEntityRenderer。触发词：BlockEntity、BlockEntityType、EntityBlock、getServerTicker、saveAdditional、load、getUpdateTag
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 方块实体开发（Forge 1.16.5）

## 快速开始

```java
// 注册 BlockEntityType（用 DeferredRegister）
public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCK_ENTITIES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    BLOCK_ENTITIES.register("mybe",
        () -> BlockEntityType.Builder.create(MyBE::new, validBlocks).build(null)
    );

// 在 mod 构造函数中
BLOCK_ENTITIES.register(modEventBus);
```

`validBlocks` 是持有此 BlockEntity 的 Block 实例集合：`ImmutableSet.of(MyBlock.INSTANCE)` 或 `Collections.singleton(...)`。

## BlockEntity 类结构

```java
public class MyBE extends BlockEntity {
    public MyBE(BlockPos pos, BlockState state) {
        super(MY_BE.get(), pos, state);
    }

    // 可选：ticker 逻辑
    public static <T extends BlockEntity> void tick(World world, BlockPos pos,
            BlockState state, T be) {
        if (world.isRemote) return;
        // 服务端每 tick 执行一次
    }
}
```

## 关联到 Block（EntityBlock 接口）

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyBE(pos, state);
    }

    // 可选：ticker（服务端每 tick 驱动 BE）
    @Nullable
    @Override
    public <T extends BlockEntity> ServerTicker<T> getServerTicker(World world, BlockState state, BlockEntityType<T> type) {
        return type == MyBlockEntities.MY_BE.get() ? MyBE::tick : null;
    }
}
```

## 数据持久化（saveAdditional / load）

```java
public class MyBE extends BlockEntity {
    private int counter;

    @Override
    protected void saveAdditional(CompoundNBT nbt) {
        super.saveAdditional(nbt);  // 必须调用 super！
        nbt.putInt("counter", counter);
    }

    @Override
    public void load(CompoundNBT nbt) {
        super.load(nbt);  // 必须调用 super！
        counter = nbt.getInt("counter");
    }
}
```

## 数据同步（服务端 ↔ 客户端）

```java
// BE 端
@Override
public CompoundNBT getUpdateTag() {
    CompoundNBT nbt = super.getUpdateTag();
    nbt.putInt("counter", counter);
    return nbt;
}

@Override
public void handleUpdateTag(CompoundNBT nbt) {
    super.handleUpdateTag(nbt);
    counter = nbt.getInt("counter");
}
```

## 常见错误

- ❌ `saveAdditional` / `load` 重写后忘记调用 `super`（保留字段被覆盖）
- ❌ 数据变化后忘记调用 `markDirty()`
- ❌ `getServerTicker` 中写复杂计算（每 tick 执行，会导致卡顿）
- ❌ `BlockEntityType.Builder.create(MyBE::new, blocks)` 时 `blocks` 传 null（至少传空集）

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.16.5/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container/Menu 与 BlockEntity 通过 IIntArray 联动 |
| `mc-networking` | 高频同步使用自定义网络包方案 |
| `mc-registry` | BlockEntityType 通过 DeferredRegister 注册 |
