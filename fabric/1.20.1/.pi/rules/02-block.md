---
description: 02 — 方块开发
---

# 02 — 方块开发

> 适用版本：Fabric 1.20.1
> FAPI：`net.fabricmc.fabric.api.object.builder.v1.block.FabricBlockSettings` 有 `copyOf(AbstractBlock)` / `of`。**没有** `create()`，1.18.2+ loader-api **没有** `breakByTool`。地图色：Yarn `MapColor.STONE_GRAY`，不要 `MapColor.STONE`。FAPI `mapColor(DyeColor)` 与原版 `mapColor(MapColor)` / `materialColor(MapColor)` 不要混签名。
> Yarn 1.18–1.20.4：`writeNbt`/`readNbt` 单参且 **void**（1.17 的 `writeNbt` 仍返回 NbtCompound）。

---

## 约束

### 核心原则

- 方块必须在 `Registry.register(Registries.BLOCK, id, block)` 中注册
- 如需方块物品形态，在 `Registries.ITEM` 中注册同名 `BlockItem`
- 方块类继承 `Block` 或其子类
- 使用 `FabricBlockSettings`（或原版 `AbstractBlock.Settings`）配置方块属性
- **禁止**在服务端直接创建客户端专用对象

---

## Decision Flow

### Decision: 选择方块类型

```
IF 简单静态方块
  → new Block(FabricBlockSettings.copyOf(Blocks.STONE))
  → 或 FabricBlockSettings.of()

IF 可配置方块（如可交互、可放置）
  → 自定义 Block 子类

IF 方块需要存储数据（inventory 等）
  → 方块实现 BlockEntityProvider + 注册 BlockEntityType

IF 需要自定义渲染
  → 重写 getRenderType，或 BlockEntity + 客户端 renderer
```

---

## FabricBlockSettings

不要写 `suffocates(Blocks::isSolid, bound)` 这种编造调用。

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

## 常用方块创建

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

private static final Block MY_PLANT = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_plant"),
    new Block(FabricBlockSettings.copyOf(Blocks.DANDELION).noCollision().breakInstantly())
);

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
// 正确：BlockItem 与 Block 使用完全相同的 Identifier
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK, new Item.Settings()));

// 错误：BlockItem 使用不同的 registry name
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block_item"),
    new BlockItem(MY_BLOCK, new Item.Settings()));
```

## BlockEntity（带数据存储的方块）

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
- ❌ 在服务端创建客户端渲染对象
- ❌ `FabricBlockSettings.create()`（本档 FAPI 没有这个静态方法）
- ❌ Yarn `DiggerItem`（镐斧铲父类是 `MiningToolItem`，1.21.11 起连 SwordItem 类也删了）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册，BlockItem 需要同名注册 |
| `mc-datagen` | 方块注册后可生成方块模型 JSON |
| `mc-gui` | BlockEntity 用于 GUI 交互（如箱子） |
| `mc-item` | BlockItem 关联方块和物品 |
| `mc-blockentity` | NBT 与类型注册 |
