---
name: mc-block
description: Fabric 方块开发。FabricBlockSettings、Block、BlockItem、BlockEntity。触发词：方块、Block、FabricBlockSettings、BlockEntity
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 方块开发（Fabric 1.14.4）

FAPI 用 `net.fabricmc.fabric.api.block.FabricBlockSettings`（`copy(Block)` / `of(Material)` / `hardness`）。原版 `Block.Settings.of` / `strength`。不要 Mojmap `Block.Properties`。

## 快速开始

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
```

## Decision: 选择方块类型

```
IF 静态方块（无特殊行为）
  → new Block(FabricBlockSettings.of(Material.STONE)) 或 Block.Settings.of(...)

IF 需要交互
  → 自定义 Block 子类（Yarn 1.14 右键是 activate）

IF 需要存储数据
  → Block + BlockEntity（Registry.BLOCK_ENTITY）

IF 需要自定义渲染
  → Block + 客户端 renderer
```

## FabricBlockSettings 常用配置

loader-api 已核 `net.fabricmc.fabric.api.block.FabricBlockSettings`：有 `hardness(float)`、`strength(float, float)`（无单参 strength）、`breakByTool`、`breakByHand`、`materialColor`、`dropsLike`、`noCollision`。没有 `requiresTool` / `solidBlock` / `suffocates` / `mapColor`。

```java
FabricBlockSettings.of(Material.STONE)
    .hardness(1.5f)
    .strength(1.5f, 6.0f)
    .breakByTool(FabricToolTags.PICKAXES, 1)
    .breakByHand(false)
    .dropsLike(Blocks.STONE)
    .materialColor(MaterialColor.STONE)
    .noCollision()
```

## BlockEntity（带数据存储）

Yarn：`BlockEntity(BlockEntityType)`；`toTag` / `fromTag` + `CompoundTag`；`createBlockEntity(BlockView)`；`Registry.BLOCK_ENTITY`；`Inventories.toTag` / `fromTag`。

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
}

private static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(
        Registry.BLOCK_ENTITY,
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
- ❌ 在服务端创建客户端渲染对象
- ❌ `writeNbt` / `NbtCompound` / `Registry.BLOCK_ENTITY_TYPE` / `createBlockEntity(BlockPos, BlockState)`（那是后期 API）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-datagen` | DataGen 生成方块模型和掉落表 |
| `mc-blockentity` | NBT 与类型注册细节 |
