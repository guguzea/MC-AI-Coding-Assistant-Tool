---
name: mc-blockentity
description: Fabric 方块实体开发。BlockEntity、BlockEntityType、DefaultedList。触发词：BlockEntity、BlockEntityType、NbtCompound
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 方块实体（Fabric 1.19.4）

Yarn 1.18–1.20.4：`writeNbt`/`readNbt` 单参且 **void**（1.17 的 `writeNbt` 仍返回 NbtCompound）。
构造 `(BlockEntityType, BlockPos, BlockState)`；`createBlockEntity(BlockPos, BlockState)`；注册 `Registries.BLOCK_ENTITY_TYPE`。

## 快速开始

```java
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

public class MyBlock extends Block implements BlockEntityProvider {
    public MyBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}

private static final BlockEntityType<MyBlockEntity> MY_BLOCK_ENTITY =
    Registry.register(
        Registries.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_block_entity"),
        BlockEntityType.Builder.create(MyBlockEntity::new, MY_BLOCK)
            .build(null)
    );
```

## 常见错误

- ❌忘记持久化方法 — 数据不持久化
- ❌BlockEntityType 引用未注册的 Block — 崩溃
- ❌抄错版本的 NBT 签名（1.17 返回值 / 1.16 fromTag / 1.21 WrapperLookup / 1.21.11 WriteView）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | BlockEntityType 通过 Registry.register() 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-block` | 方块实现 BlockEntityProvider |
