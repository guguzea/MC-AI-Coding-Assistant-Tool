# 方块代码模式

适用版本：Fabric 1.21.1

## 基本方块

```java
// 注册方块
private static final RegistrySupplier<Block> MY_BLOCK = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_block"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
);

// 注册同名 BlockItem
private static final RegistrySupplier<Item> MY_BLOCK_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK.get(), new Item.Settings())
);
```

## FabricBlockSettings 配置

```java
// 石头属性
FabricBlockSettings.copyOf(Blocks.STONE)

// 原木属性
FabricBlockSettings.copyOf(Blocks.OAK_LOG)

// 泥土属性
FabricBlockSettings.copyOf(Blocks.DIRT)

// 自定义属性
FabricBlockSettings.create()
    .strength(1.5f, 6.0f)                        // 硬度, 抗爆性
    .breakByTool(FabricToolTags.PICKAXES)          // 需要镐
    .requiresTool()                                // 需要工具
    .dropsLike(Blocks.STONE)                       // 掉落物同另一个方块
    .mapColor(MapColor.DIRT_BROWN)                 // 地图颜色
    .solid()                                       // 固体
    .suffocates((state, view, pos) -> true)       // 窒息
    .blockVision((state, view, pos) -> true)        // 阻挡视线
    .noCollision()                                 // 无碰撞箱
    .slipperiness(0.98f)                          // 摩擦力
    .velocityMultiplier(1.0f)                      // 速度倍率
    .jumpVelocityMultiplier(1.0f)                  // 跳跃倍率
    .luminance(0)                                  // 亮度
    .hardness(1.5f)                               // 硬度
    .resistance(6.0f)                             // 抗爆性
```

## 可交互方块

```java
public class MyBlock extends Block {
    public MyBlock(Settings settings) {
        super(settings);
    }

    @Override
    protected ActionResult onUse(BlockState state, World world,
                                 BlockPos pos, PlayerEntity player,
                                 Hand hand, BlockHitResult hit) {
        if (!world.isClient) {
            // 服务端逻辑
            player.sendMessage(Text.literal("Clicked!"));
        }
        return ActionResult.SUCCESS;
    }

    @Override
    public void onBreak(World world, BlockPos pos, BlockState state, PlayerEntity player) {
        // 方块破坏逻辑
        super.onBreak(world, pos, state, player);
    }

    @Override
    public void scheduledTick(BlockState state, ServerWorld world, BlockPos pos, Random random) {
        // 计划刻逻辑
    }

    @Override
    public BlockRenderType getRenderType(BlockState state) {
        return BlockRenderType.MODEL;
    }
}
```

## 无碰撞方块（如植物）

```java
// 无碰撞箱方块
new Block(FabricBlockSettings.copyOf(Blocks.DANDELION).noCollision().breakInstantly())

// 透明方块（需要设置渲染层）
BlockRenderLayerMap.INSTANCE.putBlock(MY_BLOCK.get(), RenderLayer.getTranslucent());
```

## BlockEntity

```java
// BlockEntity 类
public class MyBlockEntity extends BlockEntity {
    private int counter = 0;

    public MyBlockEntity(BlockPos pos, BlockState state) {
        super(MY_BLOCK_ENTITY.get(), pos, state);
    }

    @Override
    protected void writeNbt(NbtCompound nbt) {
        super.writeNbt(nbt);
        nbt.putInt("counter", counter);
    }

    @Override
    public void readNbt(NbtCompound nbt) {
        counter = nbt.getInt("counter");
        super.readNbt(nbt);
    }

    public void increment() {
        counter++;
        markDirty();
    }
}

// 注册 BlockEntityType
public static final RegistrySupplier<BlockEntityType<MyBlockEntity>> MY_BLOCK_ENTITY =
    Registry.register(
        Registries.BLOCK_ENTITY_TYPE,
        new Identifier(MOD_ID, "my_block_entity"),
        BlockEntityType.Builder.create(MyBlockEntity::new, MY_BLOCK.get()).build(null)
    );

// 方块实现 BlockEntityProvider
public class MyBlock extends Block implements BlockEntityProvider {
    @Override
    public BlockEntity createBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}
```

## 常见模式

### 门（Door）

```java
// 门需要两个状态：OPEN 和 HINGE
// 通常使用多个方块状态
```

### 台阶（Slab）

```java
// Slab 需要 TYPE (top, bottom, double) 状态
```

### 楼梯（Stairs）

```java
// 楼梯需要 SHAPE, FACING, HALF 状态
```
