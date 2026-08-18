---
name: mc-blockentity
description: Fabric 方块实体开发。BlockEntity、BlockEntityType、DefaultedList。触发词：BlockEntity、BlockEntityType、NbtCompound
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# 方块实体（Fabric 1.21.1）

## 快速开始

```java
// 1. 创建 BlockEntity
public class MyBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.MY_BLOCK_ENTITY, pos, state);
    }

    @Override
    public void writeNbt(NbtCompound nbt) {
        super.writeNbt(nbt);
        Inventories.writeNbt(nbt, inventory);
    }

    @Override
    public void readNbt(NbtCompound nbt) {
        super.readNbt(nbt);
        Inventories.readNbt(nbt, inventory);
    }
}

// 2. 方块实现 BlockEntityProvider
public class MyBlock extends Block implements BlockEntityProvider {
    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}

// 3. 注册 BlockEntityType
private static final BlockEntityType<MyBlockEntity> MY_BLOCK_ENTITY =
    Registry.register(
        Registries.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_block_entity"),
        BlockEntityType.Builder.create(MyBlockEntity::new, MY_BLOCK)
            .build(null)
    );
```

## 常见错误

- ❌忘记实现 `writeNbt` / `readNbt` — 数据不持久化
- ❌BlockEntityType 引用未注册的 Block — 崩溃

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | BlockEntityType 通过 Registry.register() 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
