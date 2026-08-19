---
name: mc-blockentity
description: Fabric 方块实体开发。BlockEntity、BlockEntityType、DefaultedList、CompoundTag。触发词：BlockEntity、BlockEntityType、CompoundTag
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 方块实体（Fabric 1.14.4）

Yarn 已核：[`BlockEntity(BlockEntityType)`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/block/entity/BlockEntity.mapping)、`toTag`/`fromTag`、[`BlockEntityProvider#createBlockEntity(BlockView)`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/block/BlockEntityProvider.mapping)、[`Registry.BLOCK_ENTITY`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/util/registry/Registry.mapping)、`BlockEntityType.Builder.create(Supplier, Block...)`。

不要抄 1.17+ 的 `(BlockPos, BlockState)` 构造、`writeNbt`/`NbtCompound`、`Registry.BLOCK_ENTITY_TYPE`。

## 快速开始

```java
public class MyBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyBlockEntity() {
        super(ModBlockEntities.MY_BLOCK_ENTITY);
    }

    @Override
    public CompoundTag toTag(CompoundTag tag) {
        super.toTag(tag);
        Inventories.toTag(tag, inventory);
        return tag;
    }

    @Override
    public void fromTag(CompoundTag tag) {
        super.fromTag(tag);
        Inventories.fromTag(tag, inventory);
    }
}

public class MyBlock extends Block implements BlockEntityProvider {
    public MyBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockEntity createBlockEntity(BlockView view) {
        return new MyBlockEntity();
    }
}

private static final BlockEntityType<MyBlockEntity> MY_BLOCK_ENTITY =
    Registry.register(
        Registry.BLOCK_ENTITY,
        new Identifier(MOD_ID, "my_block_entity"),
        BlockEntityType.Builder.create(MyBlockEntity::new, MY_BLOCK)
            .build(null)
    );
```

`Builder.create` 的 supplier 是 **无参** `Supplier<BlockEntity>`。类型静态字段会在世界加载创建实体前完成赋值。

## 常见错误

- ❌忘记实现 `toTag` / `fromTag` — 数据不持久化
- ❌BlockEntityType 引用未注册的 Block — 崩溃
- ❌三参构造 / `writeNbt` / `Registry.BLOCK_ENTITY_TYPE`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | BlockEntityType 通过 Registry.register(Registry.BLOCK_ENTITY, ...) 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-block` | 方块实现 BlockEntityProvider |
