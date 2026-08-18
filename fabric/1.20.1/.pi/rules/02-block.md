---
description: 02 — 方块开发
---

# 02 — 方块开发

> 适用版本：Fabric 1.20.1

---

## 约束

### 核心原则

- 方块必须在 `Registry.register(Registries.BLOCK, id, block)` 中注册
- 如需方块物品形态，在 `Registries.ITEM` 中注册同名 `BlockItem`
- 方块类继承 `Block` 或其子类
- 使用 `FabricBlockSettings` 配置方块属性
- **禁止**在服务端直接创建客户端专用对象

---

## Decision Flow

### Decision: 选择方块类型

```
IF 简单静态方块
  → new Block(FabricBlockSettings.copyOf(Blocks.STONE))

IF 可配置方块（如可交互、可放置）
  → 自定义 Block 子类

IF 方块需要存储数据（inventory、energy 等）
  → 方块实现 BlockEntityProvider + 注册 BlockEntityType

IF 需要自定义渲染
  → 注册自定义 BlockRenderType 或使用 BlockEntity + custom renderer
```

---

## FabricBlockSettings

```java
// 基础配置
FabricBlockSettings.create()
    .strength(1.5f)                              // 硬度和抗爆性
    .strength(1.5f, 6.0f)                        // hardness, resistance
    .breakByTool(FabricToolTags.PICKAXES)         // 需要镐挖掘
    .requiresTool()                               // 需要工具
    .breakByHand(false)                           // 不能空手破坏
    .dropsLike(Blocks.STONE)                      // 掉落物同另一个方块
    .mapColor(MapColor.STONE)                     // 地图颜色
    .solidBlock(Blocks::isSolid)                  // 是否为固体
    .suffocates(Blocks::isSolid, bound)           // 是否窒息
    .blockVision(Blocks::isSolid)                 // 是否阻挡视线
    .noCollision()                               // 无碰撞箱
    .slipperiness(0.98f)                         // 摩擦力
    .velocityMultiplier(0.98f)                    // 速度倍率
    .jumpVelocityMultiplier(0.95f)               // 跳跃倍率
```

## 常用方块创建

```java
// 普通方块
private static final Block MY_STONE = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_stone"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
);

// 注册同名 BlockItem
private static final Item MY_STONE_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_stone"),
    new BlockItem(MY_STONE, new Item.Settings())
);

// 无碰撞方块（如草、花）
private static final Block MY_PLANT = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_plant"),
    new Block(FabricBlockSettings.copyOf(Blocks.DANDELION).noCollision().breakInstantly())
);

// 可配置方块
public class MySlabBlock extends Block {
    public MySlabBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockRenderType getRenderType(BlockState state) {
        return BlockRenderType.MODEL;
    }
}
```

## BlockItem 注册

```java
// ✅ 正确：BlockItem 与 Block 使用完全相同的 Identifier
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK, new Item.Settings()));

// ❌ 错误：BlockItem 使用不同的 registry name
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block_item"),  // 错误！
    new BlockItem(MY_BLOCK, new Item.Settings()));
```

## BlockEntity（带数据存储的方块）

```java
// 1. 创建 BlockEntity 类
public class MyChestBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory = DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyChestBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.MY_CHEST, pos, state);
    }

    // ... read/writeNbt, tick 等方法
}

// 2. 方块实现 BlockEntityProvider
public class MyChestBlock extends Block implements BlockEntityProvider {
    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyChestBlockEntity(pos, state);
    }
}

// 3. 注册 BlockEntityType
public static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(Registries.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_chest"),
        BlockEntityType.Builder.create(MyChestBlockEntity::new, MY_CHEST_BLOCK)
            .build(null));
```

## 常见错误

- ❌ `BlockItem` 与 `Block` 使用不同的 registry name — 物品会显示为缺失
- ❌忘记注册 `BlockItem` — 方块在世界中存在但无法放入物品栏
- ❌ 在 `onInitialize()` 外注册 — 注册不会生效
- ❌ 把未注册的 Block 传给 BlockItem
- ❌ 在服务端创建 `BlockRenderType` — 渲染相关只能在客户端

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册，BlockItem 需要同名注册 |
| `mc-datagen` | 方块注册后可生成方块模型 JSON |
| `mc-gui` | BlockEntity 用于 GUI 交互（如箱子） |
| `mc-item` | BlockItem 关联方块和物品 |
