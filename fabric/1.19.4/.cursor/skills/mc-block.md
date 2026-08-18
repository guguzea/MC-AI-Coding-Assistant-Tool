---
name: mc-block
description: Fabric 方块开发。FabricBlockSettings、Block、BlockItem、BlockEntity。触发词：方块、Block、FabricBlockSettings、BlockEntity
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 方块开发（Fabric 1.19.4）

## 快速开始

```java
private static final Block MY_STONE = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_stone"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
);

// 同名 BlockItem
private static final Item MY_STONE_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_stone"),  // 同名！
    new BlockItem(MY_STONE, new Item.Settings())
);
```

## Decision: 选择方块类型

```
IF 静态方块（无特殊行为）
  → new Block(FabricBlockSettings)

IF 需要交互
  → 自定义 Block 子类

IF 需要存储数据
  → Block + BlockEntity

IF 需要自定义渲染
  → Block + custom renderer
```

## FabricBlockSettings 常用配置

```java
FabricBlockSettings.create()
    .strength(1.5f)                          // 硬度和抗爆性
    .strength(1.5f, 6.0f)                   // hardness, resistance
    .breakByTool(FabricToolTags.PICKAXES)    // 需要镐
    .requiresTool()                           // 需要工具
    .dropsLike(Blocks.STONE)                 // 掉落同另一方块
    .mapColor(MapColor.STONE)                // 地图颜色
    .noCollision()                           // 无碰撞
    .solidBlock(Blocks::isSolid)             // 是否固体
    .suffocates(Blocks::isSolid, bound)     // 是否窒息
```

## BlockEntity（带数据存储）

```java
// 1. BlockEntity 类
public class MyChestBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyChestBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.MY_CHEST, pos, state);
    }

    @Override
    public void writeNbt(NbtCompound nbt) {
        // 保存数据到 NBT
        Inventories.writeNbt(nbt, inventory);
    }

    @Override
    public void readNbt(NbtCompound nbt) {
        Inventories.readNbt(nbt, inventory);
    }
}

// 2. 方块实现 BlockEntityProvider
public class MyChestBlock extends Block implements BlockEntityProvider {
    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyChestBlockEntity(pos, state);
    }
}

// 3. 注册 BlockEntityType
private static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(
        Registries.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_chest"),
        BlockEntityType.Builder.create(
            MyChestBlockEntity::new,
            MY_CHEST_BLOCK
        ).build(null)
    );
```

## 常见错误

- ❌ BlockItem 与 Block 使用不同 registry name — 物品形态缺失
- ❌忘记注册 BlockItem — 方块无法放入物品栏
- ❌ 在服务端创建 BlockRenderType — 渲染是客户端的
- ❌忘记实现 `writeNbt` / `readNbt` — BlockEntity 数据不持久化

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-datagen` | DataGen 生成方块模型和掉落表 |
