---
name: mc-blockentity
description: Fabric 方块实体开发。BlockEntity、BlockEntityType、DefaultedList、NbtCompound。触发词：BlockEntity、BlockEntityType、NbtCompound
platform: fabric
version: "1.16.5"
dependencies: []
mappings: yarn
---

# 方块实体（Fabric 1.16.5）

Yarn 已核：[`BlockEntity(BlockEntityType)`](https://github.com/FabricMC/yarn/blob/1.16.5/mappings/net/minecraft/block/entity/BlockEntity.mapping)（**没有** pos/state 三参）、`writeNbt`、`fromTag(BlockState, NbtCompound)`；[`createBlockEntity(BlockView)`](https://github.com/FabricMC/yarn/blob/1.16.5/mappings/net/minecraft/block/BlockEntityProvider.mapping)；[`NbtCompound`](https://github.com/FabricMC/yarn/blob/1.16.5/mappings/net/minecraft/nbt/NbtCompound.mapping)；`Inventories.writeNbt` / `readNbt`；`Registry.BLOCK_ENTITY_TYPE`。

不要抄 1.17+ 的 `(BlockPos, BlockState)` 与 `createBlockEntity(pos, state)`，也不要抄 1.14 的 `toTag` / `CompoundTag` / `Registry.BLOCK_ENTITY`。

## 快速开始

```java
public class MyBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyBlockEntity() {
        super(ModBlockEntities.MY_BLOCK_ENTITY);
    }

    @Override
    public NbtCompound writeNbt(NbtCompound nbt) {
        super.writeNbt(nbt);
        Inventories.writeNbt(nbt, inventory);
        return nbt;
    }

    @Override
    public void fromTag(BlockState state, NbtCompound tag) {
        super.fromTag(state, tag);
        Inventories.readNbt(tag, inventory);
    }
}

public class MyBlock extends Block implements BlockEntityProvider {
    public MyBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockEntity createBlockEntity(BlockView world) {
        return new MyBlockEntity();
    }
}

private static final BlockEntityType<MyBlockEntity> MY_BLOCK_ENTITY =
    Registry.register(
        Registry.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_block_entity"),
        BlockEntityType.Builder.create(MyBlockEntity::new, MY_BLOCK)
            .build(null)
    );
```

## 常见错误

- ❌忘记 `writeNbt` / `fromTag` — 数据不持久化
- ❌BlockEntityType 引用未注册的 Block — 崩溃
- ❌三参构造 / `readNbt` 单参 / `createBlockEntity(BlockPos, BlockState)`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | BlockEntityType 通过 Registry.register(Registry.BLOCK_ENTITY_TYPE, ...) 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-block` | 方块实现 BlockEntityProvider |
