# 方块模式（Fabric 1.16.5）

## 模式 1：基础静态方块

```yaml
模式: Basic Stone Block
平台: Fabric
分类: block
依赖: []
扩展点: [BlockItem, 方块实体]
---
private static final Block MY_STONE = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_stone"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
);

private static final Item MY_STONE_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_stone"),  // 同名
    new BlockItem(MY_STONE, new Item.Settings())
);
```

## 模式 2：可交互方块

```yaml
模式: Interactive Block
平台: Fabric
分类: block
依赖: []
扩展点: [ScreenHandler, BlockEntity]
---
public class MyButtonBlock extends Block {
    public MyButtonBlock(Settings settings) {
        super(settings);
        // 设置方块状态属性
    }

    @Override
    public ActionResult onUse(BlockState state, World world,
                               BlockPos pos, PlayerEntity player,
                               Hand hand, BlockHitResult hit) {
        if (!world.isClient) {
            // 服务端逻辑
            return ActionResult.SUCCESS;
        }
        return ActionResult.PASS;
    }
}
```

## 模式 3：带 BlockEntity 的容器方块

```yaml
模式: Storage Block
平台: Fabric
分类: block
依赖: [mc-blockentity, mc-gui]
扩展点: [ScreenHandler, 物品栏]
---
// BlockEntity
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

// 方块
public class MyChestBlock extends Block implements BlockEntityProvider {
    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyChestBlockEntity(pos, state);
    }
}
```

## 模式 4：无碰撞方块（如植物）

```yaml
模式: No-Collision Block
平台: Fabric
分类: block
依赖: []
扩展点: [BlockItem]
---
private static final Block MY_PLANT = Registry.register(
    Registry.BLOCK,
    new Identifier(MOD_ID, "my_plant"),
    new Block(FabricBlockSettings.copyOf(Blocks.DANDELION)
        .noCollision()
        .breakInstantly()
        .sounds(BlockSoundGroups.GRASS))
);
```
