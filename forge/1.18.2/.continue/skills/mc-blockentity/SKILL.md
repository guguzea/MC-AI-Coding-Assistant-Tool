---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。BlockEntity 注册、Ticker、ContainerData/Menu 联动、BlockEntityRenderer。触发词：BlockEntity、BlockEntityType、EntityBlock、getTicker、saveAdditional、load、getUpdateTag、getUpdatePacket
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# 方块实体开发（Forge 1.18.2）

## 快速开始

```java
// 注册 BlockEntityType（用 DeferredRegister）
public static final DeferredRegister<BlockEntityType<?>> BLOCKENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    BLOCKENTITIES.register("mybe",
        () -> BlockEntityType.Builder.of(MyBE::new, validBlocks).build(null)
    );

// 在 mod 构造函数中
BLOCKENTITIES.register(modEventBus);
```

`validBlocks` 是持有此 BlockEntity 的 Block 实例集合。

## BlockEntity 类结构

```java
public class MyBE extends BlockEntity {
    public MyBE(BlockPos pos, BlockState state) {
        super(MY_BE.get(), pos, state);
    }

    // 可选：ticker 逻辑
    public static <T extends BlockEntity> void tick(Level level, BlockPos pos, BlockState state, T blockEntity) {
        if (level.isClientSide) return;
        // 服务端每 tick 执行一次
    }
}
```

## 关联到 Block（EntityBlock 接口）

```java
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBE(pos, state);
    }

    // 可选：ticker（服务端每 tick 驱动 BE）
    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return type == MyBlockEntities.MY_BE.get() ? MyBE::tick : null;
    }
}
```

## 数据持久化（saveAdditional / load）

```java
public class MyBE extends BlockEntity {
    private int counter;

    @Override
    protected void saveAdditional(CompoundTag nbt) {
        super.saveAdditional(nbt);  // 必须调用 super！
        nbt.putInt("counter", counter);
    }

    @Override
    public void load(CompoundTag nbt) {
        super.load(nbt);  // 必须调用 super！
        counter = nbt.getInt("counter");
    }
}
```

当数据变化时必须调用 `setChanged()`，否则该 BE 所在的 Chunk 保存时可能被跳过。

## 三种数据同步方式

### 方式 1：Chunk 加载时同步（getUpdateTag）

适用于少量静态数据：

```java
// BE 端
@Override
public CompoundTag getUpdateTag() {
    CompoundTag nbt = super.getUpdateTag();
    nbt.putInt("counter", counter);
    return nbt;
}

@Override
public void handleUpdateTag(CompoundTag nbt) {
    super.handleUpdateTag(nbt);
    counter = nbt.getInt("counter");
}
```

### 方式 2：方块更新时同步（getUpdatePacket）

```java
// BE 端
@Override
public CompoundTag getUpdateTag() {
    return saveWithoutMetadata();
}

@Override
public Packet<?> getUpdatePacket() {
    return ClientboundBlockEntityDataPacket.create(this);
}

// 服务端通知更新
level.sendBlockUpdated(pos, state, state, Block.UPDATE_CLIENTS);
```

## BlockEntity 与 Container/Menu 联动

BlockEntity 持有 `SimpleContainerData`，通过 Menu 的 MenuProvider 注入：

```java
// BlockEntity
public class MyBE extends BlockEntity {
    private final SimpleContainerData data = new SimpleContainerData(3);
    public SimpleContainerData getData() { return data; }
}
```

## 常见错误

- ❌ `saveAdditional` / `load` 重写后忘记调用 `super`（保留字段被覆盖）
- ❌ 数据变化后忘记调用 `setChanged()`
- ❌ `getTicker` 中写复杂计算（每 tick 执行，会导致卡顿）

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.18.2/blockentities

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container/Menu 与 BlockEntity 通过 SimpleContainerData 联动 |
| `mc-networking` | 高频同步使用自定义网络包方案 |
| `mc-registry` | BlockEntityType 通过 DeferredRegister 注册 |
