---
description: 02 — 方块开发
---

# 02 — 方块开发

> 适用版本：Fabric 1.14.4
> Yarn：[`Block.Settings`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/block/Block.mapping)（`of` / `strength` / `noCollision` / `dropsLike`）
> FAPI 1.14 包名是 **`net.fabricmc.fabric.api.block.FabricBlockSettings`**（loader-api）。不要把后期 `object.builder.v1` 或 Mojmap `Block.Properties` 当本档默认。

---

## 约束

### 核心原则

- 方块必须在 `Registry.register(Registry.BLOCK, id, block)` 中注册
- 如需方块物品形态，在 `Registry.ITEM` 中注册同名 `BlockItem`
- 方块类继承 `Block` 或其子类
- 原版用 `Block.Settings`；需要 `breakByTool` / `breakByHand` / `hardness`（单参数）时用 FAPI `FabricBlockSettings`
- **禁止**在服务端直接创建客户端专用对象

---

## Decision Flow

### Decision: 选择方块类型

```
IF 简单静态方块
  → new Block(Block.Settings.of(Material.STONE))
  → 或 FabricBlockSettings.of(Material.STONE) / FabricBlockSettings.copy(Blocks.STONE)

IF 可配置方块（如可交互、可放置）
  → 自定义 Block 子类（右键 Yarn 是 activate，不是 onUse）

IF 方块需要存储数据（inventory 等）
  → 方块实现 BlockEntityProvider + 注册 BlockEntityType（Registry.BLOCK_ENTITY）

IF 需要自定义渲染
  → 重写 getRenderType，或 BlockEntity + 客户端 TESR/BER
```

---

## Block.Settings / FabricBlockSettings

Yarn 原版 `Block.Settings`：`of(Material)`、`strength(float)`、`strength(float, float)`、`noCollision()`、`dropsLike(Block)`、`slipperiness`、`lightLevel`、`sounds`、`copy`。没有 `hardnessAndResistance`、`noCollission`、`doesNotBlockMovement`、`velocityMultiplier`、`jumpVelocityMultiplier`、`mapColor` 方法。

FAPI `net.fabricmc.fabric.api.block.FabricBlockSettings`（loader-api 已核）：`of`、`copy(Block)`、`hardness(float)`、`resistance(float)`、`strength(float, float)`（**无**单参 `strength`）、`breakByTool(Tag)` / `breakByTool(Tag, miningLevel)`、`breakByHand(boolean)`、`materialColor`、`dropsLike`、`noCollision`、`friction` / `slipperiness`。本类 **没有** `requiresTool`、`solidBlock`、`suffocates`、`mapColor`（用地图色请用 `materialColor`）。

```java
FabricBlockSettings.of(Material.STONE)
    .hardness(1.5f)
    .strength(1.5f, 6.0f)
    .breakByTool(FabricToolTags.PICKAXES, 1)  // wiki mining_levels 1.1x–1.17
    .breakByHand(false)
    .dropsLike(Blocks.STONE)
    .materialColor(MaterialColor.STONE)
    .noCollision()
    .slipperiness(0.98f)
```

## 常用方块创建

```java
private static final Block MY_STONE = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_stone"),
    new Block(Block.Settings.of(Material.STONE).strength(1.5f, 6.0f))
);

private static final Item MY_STONE_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_stone"),
    new BlockItem(MY_STONE, new Item.Settings())
);

private static final Block MY_PLANT = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_plant"),
    new Block(Block.Settings.of(Material.PLANT).noCollision())
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
// ✅ 正确：BlockItem 与 Block 使用完全相同的 Identifier
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK, new Item.Settings()));

// ❌ 错误：BlockItem 使用不同的 registry name
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block_item"),
    new BlockItem(MY_BLOCK, new Item.Settings()));
```

## BlockEntity（带数据存储的方块）

Yarn 1.14.4：`BlockEntity(BlockEntityType)`（**没有** `BlockPos, BlockState` 三参构造）；NBT 是 `toTag` / `fromTag` + `CompoundTag`；`createBlockEntity(BlockView)`；注册表字段是 **`Registry.BLOCK_ENTITY`**（不是 `BLOCK_ENTITY_TYPE`）；`BlockEntityType.Builder.create(Supplier, Block...)`；列表用 `DefaultedList.ofSize`。不要 Forge `RegistryObject` / `TileEntityType` / `NonNullList`。

```java
public class MyChestBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyChestBlockEntity() {
        super(ModBlockEntities.MY_CHEST);
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

public class MyChestBlock extends Block implements BlockEntityProvider {
    public MyChestBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockEntity createBlockEntity(BlockView view) {
        return new MyChestBlockEntity();
    }

    @Override
    public BlockState getPlacementState(ItemPlacementContext ctx) {
        return this.getDefaultState();
    }
}

public static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(Registry.BLOCK_ENTITY,
        new Identifier(MOD_ID, "my_chest"),
        BlockEntityType.Builder.create(MyChestBlockEntity::new, MY_CHEST_BLOCK)
            .build(null));
```

## 常见错误

- ❌ `BlockItem` 与 `Block` 使用不同的 registry name — 物品会显示为缺失
- ❌忘记注册 `BlockItem` — 方块在世界中存在但无法放入物品栏
- ❌ 在 `onInitialize()` 外注册 — 注册不会生效
- ❌ 在服务端创建客户端渲染对象
- ❌ `Block.Properties` / `Registry.BLOCK_ENTITY_TYPE` / `writeNbt` / `NbtCompound` / `RegistryObject`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册，BlockItem 需要同名注册 |
| `mc-datagen` | 方块注册后可生成方块模型 JSON |
| `mc-gui` | BlockEntity 用于 GUI 交互（如箱子） |
| `mc-item` | BlockItem 关联方块和物品 |
| `mc-blockentity` | 方块实体构造与 NBT |
