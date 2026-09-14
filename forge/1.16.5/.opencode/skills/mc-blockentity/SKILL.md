---
name: mc-blockentity
description: Minecraft Forge 方块实体开发。TileEntity 注册、ITickableTileEntity、Container 联动。触发词：TileEntity、TileEntityType、hasTileEntity、createTileEntity、setChanged、getUpdateTag
platform: forge
version: "1.16.5"
dependencies: []
mappings: official
---

# 方块实体开发（Forge 1.16.5）

## 快速开始

本档 mappings = **official（mojmap）**（出处：`scaffold/build.gradle:24` mappings 行 + `scaffold/gradle.properties:15-16` mapping_channel=official；FG4 无 Parchment provider，见 `AGENTS.md:17`）。1.16.5 的类名是 `TileEntity` / `TileEntityType`（语料 tileentities_tileentity.md:17/26）；`BlockEntity` / `BlockEntityType` 是 1.17+ 才改的名（`knowledge/version-changes/1.16.x.md:157`「类名仍是 MCP 名，1.17 才全换」），禁止当本档 API 照抄。Forge 字段仍是 **`ForgeRegistries.TILE_ENTITIES`**，不是 `BLOCK_ENTITY_TYPES` / `BLOCK_ENTITIES`。

```java
public static final DeferredRegister<TileEntityType<?>> TILE_ENTITIES =
    DeferredRegister.create(ForgeRegistries.TILE_ENTITIES, MOD_ID);

public static final RegistryObject<TileEntityType<MyBE>> MY_BE =
    TILE_ENTITIES.register("mybe",
        () -> TileEntityType.Builder.of(MyBE::new, validBlocks).build(null)
    );

TILE_ENTITIES.register(modEventBus);
```

1.16.5 文档用 `Builder.of`。不要 `ServerTicker` / `getServerTicker`（编造）。

## TileEntity 类结构

构造函数只有 `TileEntityType`，**没有** `BlockPos` / `BlockState`（1.17+）。

```java
public class MyBE extends TileEntity implements ITickableTileEntity {
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
    public TileEntity createTileEntity(BlockState state, IBlockReader world) {
        return MY_BE.get().create();
    }
}
```

## 数据持久化（save / load）

本档 official（mojmap）：`save(CompoundNBT)` 与 `load(BlockState, CompoundNBT)`（语料 tileentities_tileentity.md:38）。不要 `saveAdditional`（本档语料 0 命中，属别的版本线）。

```java
@Override
public CompoundNBT save(CompoundNBT tag) {
    tag = super.save(tag);
    tag.putInt("counter", counter);
    return tag;
}

@Override
public void load(BlockState state, CompoundNBT tag) {
    super.load(state, tag);
    counter = tag.getInt("counter");
}
```

数据变化后调用 `setChanged()`。

## 数据同步（getUpdateTag）

```java
@Override
public CompoundNBT getUpdateTag() {
    return this.save(new CompoundNBT());
}

@Override
public void handleUpdateTag(BlockState state, CompoundNBT tag) {
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
  → ContainerData / IIntArray 与 Container 共享
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
| `mc-gui` | Container 与 TileEntity 通过 ContainerData 联动 |
| `mc-networking` | 高频同步使用自定义网络包 |
| `mc-registry` | `TileEntityType` 注册到 `ForgeRegistries.TILE_ENTITIES` |
