---
description: 02 — 方块开发
---

# 02 — 方块开发

> 适用版本：Fabric 1.21.3
> 方块属性用 Yarn `AbstractBlock.Settings`（本档映射表该 owner 的静态工厂只有 `create()` / `copy(AbstractBlock)` / `copyShallow(AbstractBlock)`；**Yarn 口径无具名 `of` / `copyOf`**，有 `offset(OffsetType)`，勿混）。**不要**写 `FabricBlockSettings`——该类 1.21.3 起已不在 Fabric API 里。Mojmap 工程对应类型是 `BlockBehaviour.Properties`。`mapColor` 在本档就是 `AbstractBlock.Settings` 自己的 3 个重载（`DyeColor` / `MapColor` / `Function<BlockState, MapColor>`），**没有** `materialColor`，也没有 `breakByTool`。地图色：Yarn `MapColor.STONE_GRAY`，不要 `MapColor.STONE`。1.21.2+ 起 Settings 上多了 `registryKey(RegistryKey)`，`Blocks.register(...)` 会替你写进去。
> Yarn 1.21.1 / 1.21.3：`writeNbt`/`readNbt` 第二参是 `RegistryWrapper.WrapperLookup`；`Inventories.writeNbt/readNbt` 同样要带 lookup。

---

## 约束

### 核心原则

- 方块必须在 `Registry.register(Registries.BLOCK, id, block)` 中注册
- 如需方块物品形态，在 `Registries.ITEM` 中注册同名 `BlockItem`
- 方块类继承 `Block` 或其子类
- 使用 Yarn `AbstractBlock.Settings`（Mojmap：`BlockBehaviour.Properties`）配置方块属性
- **禁止**在服务端直接创建客户端专用对象

---

## Decision Flow

### Decision: 选择方块类型

```
IF 简单静态方块
  → new Block(AbstractBlock.Settings.copy(Blocks.STONE))
  → 或 AbstractBlock.Settings.create()（Yarn 轴无具名 of()；Mojmap 轴才是 BlockBehaviour.Properties.of()）

IF 可配置方块（如可交互、可放置）
  → 自定义 Block 子类

IF 方块需要存储数据（inventory 等）
  → 方块实现 BlockEntityProvider + 注册 BlockEntityType

IF 需要自定义渲染
  → 重写 getRenderType，或 BlockEntity + 客户端 renderer
```

---

## AbstractBlock.Settings

不要写 `suffocates(Blocks::isSolid, bound)` 这种编造调用。Mojmap 工程把类型换成 `BlockBehaviour.Properties`。

```java
AbstractBlock.Settings.create()
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
    Identifier.of(MOD_ID, "my_stone"),
    new Block(AbstractBlock.Settings.copy(Blocks.STONE).strength(1.5f))
);

private static final Item MY_STONE_ITEM = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_stone"),
    new BlockItem(MY_STONE, new Item.Settings())
);

private static final Block MY_PLANT = Registry.register(
    Registries.BLOCK,
    Identifier.of(MOD_ID, "my_plant"),
    new Block(AbstractBlock.Settings.copy(Blocks.DANDELION).noCollision().breakInstantly())
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
Registry.register(Registries.ITEM, Identifier.of(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK, new Item.Settings()));

// 错误：BlockItem 使用不同的 registry name
Registry.register(Registries.ITEM, Identifier.of(MOD_ID, "my_block_item"),
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
    protected void writeNbt(NbtCompound nbt, RegistryWrapper.WrapperLookup registries) {
        super.writeNbt(nbt, registries);
        Inventories.writeNbt(nbt, inventory, registries);
    }

    @Override
    protected void readNbt(NbtCompound nbt, RegistryWrapper.WrapperLookup registries) {
        super.readNbt(nbt, registries);
        Inventories.readNbt(nbt, inventory, registries);
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
        Identifier.of(MOD_ID, "my_chest"),
        BlockEntityType.Builder.create(MyChestBlockEntity::new, MY_CHEST_BLOCK)
            .build(null));
```

## 常见错误

- ❌ `BlockItem` 与 `Block` 使用不同的 registry name — 物品会显示为缺失
- ❌忘记注册 `BlockItem` — 方块在世界中存在但无法放入物品栏
- ❌ 在 `onInitialize()` 外注册 — 注册不会生效
- ❌ 把未注册的 Block 传给 BlockItem
- ❌ 在服务端创建客户端渲染对象
- ❌ `FabricBlockSettings`（本档已删除；用 `AbstractBlock.Settings.create()` / `copy()`，Mojmap 侧是 `BlockBehaviour.Properties`）
- ❌ Yarn `DiggerItem`（镐斧铲父类是 `MiningToolItem`，1.21.11 起连 SwordItem 类也删了）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册，BlockItem 需要同名注册 |
| `mc-datagen` | 方块注册后可生成方块模型 JSON |
| `mc-gui` | BlockEntity 用于 GUI 交互（如箱子） |
| `mc-item` | BlockItem 关联方块和物品 |
| `mc-blockentity` | NBT 与类型注册 |
