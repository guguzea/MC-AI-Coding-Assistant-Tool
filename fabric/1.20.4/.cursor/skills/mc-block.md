---
name: mc-block
description: Fabric 方块开发。FabricBlockSettings、Block、BlockItem、BlockEntity。触发词：方块、Block、FabricBlockSettings、BlockEntity
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
---

# 方块开发（Fabric 1.20.4）

FAPI 用 `copyOf(Blocks.STONE)` / `FabricBlockSettings.of()`。**没有** `create()`。地图色用 `MapColor.STONE_GRAY`。

## 快速开始

```java
private static final Block MY_STONE = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_stone"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
);

private static final Item MY_STONE_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_stone"),
    new BlockItem(MY_STONE, new Item.Settings())
);
```

## Decision: 选择方块类型

```
IF 静态方块（无特殊行为）
  → new Block(FabricBlockSettings.copyOf(Blocks.STONE))

IF 需要交互
  → 自定义 Block 子类

IF 需要存储数据
  → Block + BlockEntity（Registries.BLOCK_ENTITY_TYPE）

IF 需要自定义渲染
  → Block + 客户端 renderer
```

## FabricBlockSettings 常用配置

```java
FabricBlockSettings.of()
    .strength(1.5f)
    .strength(1.5f, 6.0f)
    .requiresTool()
    .dropsLike(Blocks.STONE)
    .mapColor(MapColor.STONE_GRAY)
    .noCollision()
    .slipperiness(0.98f)
```

## BlockEntity（带数据存储）

Yarn 1.18–1.20.4：`writeNbt`/`readNbt` 单参且 **void**（1.17 的 `writeNbt` 仍返回 NbtCompound）。

```java
public class MyChestBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyChestBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.MY_CHEST, pos, state);
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

public class MyChestBlock extends Block implements BlockEntityProvider {
    public MyChestBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyChestBlockEntity(pos, state);
    }
}

private static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(
        Registries.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_chest"),
        BlockEntityType.Builder.create(MyChestBlockEntity::new, MY_CHEST_BLOCK).build(null)
    );
```

## 常见错误

- ❌ BlockItem 与 Block 使用不同 registry name — 物品形态缺失
- ❌忘记注册 BlockItem — 方块无法放入物品栏
- ❌ 在服务端创建客户端渲染对象
- ❌ `FabricBlockSettings.create()`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-datagen` | DataGen 生成方块模型和掉落表 |
| `mc-blockentity` | NBT 细节 |
