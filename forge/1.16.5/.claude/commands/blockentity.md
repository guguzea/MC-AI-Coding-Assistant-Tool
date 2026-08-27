---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。BlockEntity 注册、ITickableTileEntity、Container 联动。触发词：BlockEntity、BlockEntityType、hasTileEntity、createTileEntity、setChanged、getUpdateTag
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 方块实体开发（Forge 1.16.5）

## 快速开始

Parchment 类名是 `BlockEntity` / `BlockEntityType`。Forge 字段仍是 **`ForgeRegistries.TILE_ENTITIES`**，不是 `BLOCK_ENTITY_TYPES` / `BLOCK_ENTITIES`。

```java
public static final DeferredRegister<BlockEntityType<?>> TILE_ENTITIES =
    DeferredRegister.create(ForgeRegistries.TILE_ENTITIES, MOD_ID);

public static final RegistryObject<BlockEntityType<MyBE>> MY_BE =
    TILE_ENTITIES.register("mybe",
        () -> BlockEntityType.Builder.of(MyBE::new, validBlocks).build(null)
    );

TILE_ENTITIES.register(modEventBus);
```

1.16.5 文档用 `Builder.of`。不要 `ServerTicker` / `getServerTicker`（编造）。

## BlockEntity 类结构

构造函数只有 `BlockEntityType`，**没有** `BlockPos` / `BlockState`（1.17+）。

```java
public class MyBE extends BlockEntity implements ITickableTileEntity {
    public MyBE() {
        super(MY_BE.get());
    }

    @Override
    public void tick() {
        if (level == null || level.isClientSide) return;
    }
}
```

## 关联到 Block

本档**没有** `EntityBlock` / `getTicker` / `BlockEntityTicker`。

```java
public class MyBlock extends Block {
    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }

    @Override
    public BlockEntity createTileEntity(BlockState state, BlockGetter world) {
        return MY_BE.get().create();
    }
}
```

## 数据持久化（save / load）

1.16.5 Parchment：`save(CompoundTag)` 与 `load(BlockState, CompoundTag)`。不要 `saveAdditional`。

```java
@Override
public CompoundTag save(CompoundTag tag) {
    tag = super.save(tag);
    tag.putInt("counter", counter);
    return tag;
}

@Override
public void load(BlockState state, CompoundTag tag) {
    super.load(state, tag);
    counter = tag.getInt("counter");
}
```

数据变化后调用 `setChanged()`。

## 数据同步（getUpdateTag）

```java
@Override
public CompoundTag getUpdateTag() {
    return this.save(new CompoundTag());
}

@Override
public void handleUpdateTag(BlockState state, CompoundTag tag) {
    this.load(state, tag);
}
```

需要即时同步时再重写 `getUpdatePacket()` / `onDataPacket`。高频数据走 `mc-networking`。

## Decision: 选择同步方式

```
IF 数据量小、静态
  → getUpdateTag / handleUpdateTag

IF 需要方块更新时同步
  → getUpdatePacket

IF 高频或大数据量
  → 自定义网络包（mc-networking）

IF 数据属于容器展示
  → ContainerData / IIntArray 与 Menu 共享
```

## 常见错误

- ❌ `save` / `load` 忘记 `super`
- ❌ 数据变化后忘记 `setChanged()`
- ❌ `EntityBlock` / `newBlockEntity(BlockPos, BlockState)` / `getTicker`
- ❌ `ServerTicker` / `getServerTicker`（编造）
- ❌ `ForgeRegistries.BLOCK_ENTITY_TYPES`（1.19+ 字段名）
- ❌ 构造函数写成 `super(type, pos, state)`（1.17+）

## 参考资料

- Forge 1.16.5 TileEntities 文档（`search_forge_docs`）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | Container/Menu 与 BlockEntity 通过 ContainerData 联动 |
| `mc-networking` | 高频同步使用自定义网络包 |
| `mc-registry` | `BlockEntityType` 注册到 `ForgeRegistries.TILE_ENTITIES` |
