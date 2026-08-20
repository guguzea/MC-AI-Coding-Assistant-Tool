# 方块代码模式（Forge 1.16.5）

```yaml
模式: 普通方块（无变体）
分类: block
---
```

## 基础方块

```java
// DeferredRegister 方式（官方推荐）
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> STONE_BLOCK = BLOCKS.register("stone_block",
    () -> new Block(Block.Properties.of(Material.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);

// BlockItem
public static final RegistryObject<Item> STONE_BLOCK_ITEM = ITEMS.register("stone_block",
    () -> new BlockItem(STONE_BLOCK.get(), new Item.Properties()
        .tab(ItemGroup.TAB_BUILDING_BLOCKS)
    )
);
```

## 带变体的方块（Faced / Horizontal / Axis）

```java
// BlockState 定义
@Override
protected void createBlockStateDefinition(StateDefinition.Builder<Block, BlockState> builder) {
    builder.add(FACING, POWERED);
}

// getStateForPlacement 返回初始状态
@Override
public BlockState getStateForPlacement(PlayerEntity player, Hand hand,
        BlockRayTraceResult result) {
    return this.getDefaultState()
        .with(FACING, player.getHorizontalFacing().getOpposite())
        .with(POWERED, false);
}

// 放置时更新临接方块
@Override
public void neighborChanged(BlockState state, World world, BlockPos pos,
        Block block, BlockPos fromPos, boolean isMoving) {
    super.neighborChanged(state, world, pos, block, fromPos, isMoving);
    if (!world.isRemote) {
        boolean powered = world.isBlockPowered(pos);
        if (powered != state.get(POWERED)) {
            world.setBlockState(pos, state.with(POWERED, powered), 2);
        }
    }
}
```

## 方块实体（带数据存储）

```java
// 方块
public class MachineBlock extends Block implements ITileEntityProvider {
    @Override
    public TileEntity createTileEntity(BlockState state, IBlockAccess world) {
        return new MachineTileEntity();
    }

    @Override
    public boolean hasTileEntity(BlockState state) {
        return true;
    }
}

// 方块实体
public class MachineTileEntity extends TileEntity {
    private int progress = 0;
    public static final TileEntityType<MachineTileEntity> TYPE = /* 注册 */;

    public MachineTileEntity() {
        super(TYPE);
    }

    public static void tick(Level world, BlockPos pos, BlockState state, MachineTileEntity tile) {
        if (world.isClientSide) return;
        // 定时逻辑
    }

    @Override
    public CompoundNBT save(CompoundNBT nbt) {
        super.save(nbt);
        nbt.putInt("progress", progress);
        return nbt;
    }

    @Override
    public void load(BlockState state, CompoundNBT nbt) {
        super.load(state, nbt);
        this.progress = nbt.getInt("progress");
    }
}
```

## 方块状态 JSON

```json
// blockstates/my_block.json
{
  "variants": {
    "facing=north,powered=false": { "model": "modid:block/my_block" },
    "facing=south,powered=false": { "model": "modid:block/my_block", "y": 180 },
    "facing=east,powered=false":  { "model": "modid:block/my_block", "y": 90 },
    "facing=west,powered=false":  { "model": "modid:block/my_block", "y": 270 },
    "facing=north,powered=true":  { "model": "modid:block/my_block_on" },
    "facing=south,powered=true":  { "model": "modid:block/my_block_on", "y": 180 },
    "facing=east,powered=true":   { "model": "modid:block/my_block_on", "y": 90 },
    "facing=west,powered=true":   { "model": "modid:block/my_block_on", "y": 270 }
  }
}
```

## 矿物方块（钻石级）

```java
public static final RegistryObject<Block> MY_ORE = BLOCKS.register("my_ore",
    () -> new Block(Block.Properties.of(Material.STONE)
        .strength(3.0f, 3.0f)
        .requiresCorrectToolForDrops()
    )
);
```
