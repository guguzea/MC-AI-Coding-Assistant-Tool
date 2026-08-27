---
description: 02 — 方块开发
---

# 02 — 方块开发

> 适用版本：Fabric 1.16.5
> FAPI 本档 loader-api 已核：`net.fabricmc.fabric.api.block.FabricBlockSettings`（`of` / `copy(Block)` / `copyOf(Settings)` / `hardness` / `strength(float,float)` / `breakByTool` / `breakByHand` / `materialColor` / `dropsLike` / `noCollision`）。
> `object.builder.v1.FabricBlockSettings` 同类解析失败，不要把后期 `create()` / `copyOf(Block)` / `requiresTool` / `mapColor` / `solid` / `suffocates` 当已核。
> Yarn 地图色类是 `MapColor`，石头灰字段是 `STONE_GRAY`（没有 `MaterialColor.STONE`）。FAPI 方法名仍是 `materialColor`。

---

## 约束

### 核心原则

- 方块必须在 `Registry.register(Registry.BLOCK, id, block)` 中注册
- 如需方块物品形态，在 `Registry.ITEM` 中注册同名 `BlockItem`
- 方块类继承 `Block` 或其子类
- 原版用 `Block.Settings`；需要 `breakByTool` 等时用 FAPI `FabricBlockSettings`
- **禁止**在服务端直接创建客户端专用对象

---

## Decision Flow

### Decision: 选择方块类型

```
IF 简单静态方块
  → new Block(FabricBlockSettings.copy(Blocks.STONE))
  → 或 FabricBlockSettings.of(Material.STONE) / Block.Settings.of(Material.STONE)

IF 可配置方块（如可交互、可放置）
  → 自定义 Block 子类

IF 方块需要存储数据（inventory 等）
  → 方块实现 BlockEntityProvider + 注册 BlockEntityType

IF 需要自定义渲染
  → 重写 getRenderType，或 BlockEntity + 客户端 renderer
```

---

## FabricBlockSettings

`api.block.FabricBlockSettings` **没有** 单参 `strength(float)`（用 `hardness(float)` 或 `strength(hardness, resistance)`）；**没有** `copyOf(Block)`（复制方块用 `copy(Block)`）；地图色是 `materialColor`，不是 `mapColor`。

```java
FabricBlockSettings.of(Material.STONE)
    .hardness(1.5f)
    .strength(1.5f, 6.0f)
    .breakByTool(FabricToolTags.PICKAXES, 1)
    .breakByHand(false)
    .dropsLike(Blocks.STONE)
    .materialColor(MapColor.STONE_GRAY)
    .noCollision()
    .slipperiness(0.98f)
```

## 常用方块创建

```java
private static final Block MY_STONE = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_stone"),
    new Block(FabricBlockSettings.copy(Blocks.STONE).hardness(1.5f))
);

private static final Item MY_STONE_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_stone"),
    new BlockItem(MY_STONE, new Item.Settings())
);

private static final Block MY_PLANT = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_plant"),
    new Block(FabricBlockSettings.copy(Blocks.DANDELION).noCollision().breakInstantly())
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

Yarn 1.16.5：**不要** `(BlockPos, BlockState)` 三参构造（那是 1.17+）。NBT 类是 `NbtCompound`；写出 `writeNbt`；读入是 **`fromTag(BlockState, NbtCompound)`**（不是 `readNbt`）。`Inventories.writeNbt` / `readNbt`。

```java
public class MyChestBlockEntity extends BlockEntity {
    private final DefaultedList<ItemStack> inventory =
        DefaultedList.ofSize(27, ItemStack.EMPTY);

    public MyChestBlockEntity() {
        super(ModBlockEntities.MY_CHEST);
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

public class MyChestBlock extends Block implements BlockEntityProvider {
    public MyChestBlock(Settings settings) {
        super(settings);
    }

    @Override
    public BlockEntity createBlockEntity(BlockView world) {
        return new MyChestBlockEntity();
    }
}

public static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(Registry.BLOCK_ENTITY_TYPE,
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
- ❌ `createBlockEntity(BlockPos, BlockState)` / `readNbt` / `FabricBlockSettings.create()` / `copyOf(Blocks.STONE)`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册，BlockItem 需要同名注册 |
| `mc-datagen` | 方块注册后可生成方块模型 JSON |
| `mc-gui` | BlockEntity 用于 GUI 交互（如箱子） |
| `mc-item` | BlockItem 关联方块和物品 |
| `mc-blockentity` | NBT 与类型注册 |
