---
name: mc-block
description: Fabric 方块开发。FabricBlockSettings、Block、BlockItem、BlockEntity。触发词：方块、Block、FabricBlockSettings、BlockEntity
platform: fabric
version: "1.16.5"
dependencies: []
mappings: yarn
---

# 方块开发（Fabric 1.16.5）

FAPI 用 `net.fabricmc.fabric.api.block.FabricBlockSettings`：`copy(Block)` / `of(Material)` / `hardness`。不要 `create()`、`copyOf(Blocks.STONE)`、`mapColor`、`requiresTool`（本档 loader-api 未列出）。

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
  → new Block(FabricBlockSettings.copy(Blocks.STONE)) 或 of(Material.STONE)

IF 需要交互
  → 自定义 Block 子类

IF 需要存储数据
  → Block + BlockEntity（Registry.BLOCK_ENTITY_TYPE）

IF 需要自定义渲染
  → Block + 客户端 renderer
```

## FabricBlockSettings 常用配置

```java
FabricBlockSettings.of(Material.STONE)
    .hardness(1.5f)
    .strength(1.5f, 6.0f)
    .breakByTool(FabricToolTags.PICKAXES, 1)
    .breakByHand(false)
    .dropsLike(Blocks.STONE)
    .materialColor(MapColor.STONE_GRAY)
    .noCollision()
```

## BlockEntity（带数据存储）

Yarn：无参/`BlockEntityType` 构造；`writeNbt`；`fromTag(BlockState, NbtCompound)`；`createBlockEntity(BlockView)`。

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

private static final BlockEntityType<MyChestBlockEntity> MY_CHEST =
    Registry.register(
        Registry.BLOCK_ENTITY_TYPE,
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
- ❌ 三参构造 / `readNbt` / `createBlockEntity(BlockPos, BlockState)`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 方块通过 Registry.register() 注册 |
| `mc-gui` | BlockEntity 用于 GUI 交互 |
| `mc-datagen` | DataGen 生成方块模型和掉落表 |
| `mc-blockentity` | NBT 细节 |
