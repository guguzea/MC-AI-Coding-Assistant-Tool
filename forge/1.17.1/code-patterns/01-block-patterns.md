# 方块代码模式（Forge 1.17.1）

```yaml
模式: 普通方块（无变体）
分类: block
---
```

## 基础方块

```java
// DeferredRegister 方式（官方推荐，1.18+）
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> STONE_BLOCK = BLOCKS.register("stone_block",
    () -> new Block(BlockBehaviour.Properties.of()
        .color(MaterialColor.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);

// BlockItem
public static final RegistryObject<Item> STONE_BLOCK_ITEM = ITEMS.register("stone_block",
    () -> new BlockItem(STONE_BLOCK.get(), new Item.Properties()
        .tab(CreativeModeTab.TAB_BUILDING_BLOCKS)
    )
);
```

**注意：** 1.17.1 同样**推荐 `DeferredRegister`**（见同档 `01-registry.mdc:15-16`、`AGENTS.md:122`）。下面这段 `RegistryEvent.Register` + `setRegistryName` 是**已过时的旧写法**（同档 `02-block.mdc:155-159` 标为 ❌），仅在维护旧代码时参考：

```java
// ❌ 旧写法（过时）：新代码请用 DeferredRegister（见 01-registry.mdc:15-16）
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class RegistryHandlers {
    @SubscribeEvent
    public static void onBlocksRegistry(final RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new Block(BlockBehaviour.Properties.of(Material.STONE)
                .color(MaterialColor.STONE)
                .strength(1.5f, 6.0f)
                .requiresCorrectToolForDrops()
            ).setRegistryName(new ResourceLocation(MOD_ID, "stone_block"))
        );
    }

    @SubscribeEvent
    public static void onItemsRegistry(final RegistryEvent.Register<Item> event) {
        event.getRegistry().register(
            new BlockItem(STONE_BLOCK,
                new Item.Properties().tab(CreativeModeTab.TAB_BUILDING_BLOCKS)
            ).setRegistryName(new ResourceLocation(MOD_ID, "stone_block"))
        );
    }
}
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
public BlockState getStateForPlacement(BlockPlaceContext context) {
    return this.defaultBlockState()
        .setValue(FACING, context.getNearestLookingDirection().getOpposite())
        .setValue(POWERED, false);
}

// 放置时更新临接方块
@Override
public void neighborChanged(BlockState state, Level level, BlockPos pos,
        Block block, BlockPos fromPos, boolean isMoving) {
    super.neighborChanged(state, level, pos, block, fromPos, isMoving);
    if (!level.isClientSide) {
        boolean powered = level.hasSignal(pos, Direction.DOWN);
        if (powered != state.getValue(POWERED)) {
            level.setBlock(pos, state.setValue(POWERED, powered), 2);
        }
    }
}
```

## 方块实体（带数据存储）

```java
// 方块
public class MachineBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MachineBlockEntity(pos, state);
    }

    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return level.isClientSide ? null :
            (type == MachineBlockEntity.TYPE.get() ? MachineBlockEntity::tick : null);
    }
}

// 方块实体
public class MachineBlockEntity extends BlockEntity {
    private int progress = 0;
    public static final BlockEntityType<MachineBlockEntity> TYPE = /* 注册 */;

    public MachineBlockEntity(BlockPos pos, BlockState state) {
        super(TYPE, pos, state);
    }

    public static <T extends BlockEntity> void tick(Level level, BlockPos pos,
            BlockState state, T blockEntity) {
        if (level.isClientSide) return;
        // 定时逻辑
    }

    @Override
    public CompoundTag save(CompoundTag nbt) {
        super.save(nbt);
        nbt.putInt("progress", progress);
        return nbt;
    }

    @Override
    public void load(CompoundTag nbt) {
        super.load(nbt);
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
    () -> new Block(BlockBehaviour.Properties.of()
        .color(MaterialColor.STONE)
        .strength(3.0f, 3.0f)
        .requiresCorrectToolForDrops()
        // TODO(未核实)：经验掉落不在 Properties 上（本档 api-index 无 xp/insertXp），待核实后补
    )
);
```

> **注意：** 经验掉落**不在** `BlockBehaviour.Properties` 上 —— `xp()` 与 `insertXp()` 在本档与 1.20.x 的 api-index 中均不存在（原示例的 `.xp(1, 3, 7)` 已移除）。正解需 `ingest_loader_api` 入库原版/Forge jar 后核实。
