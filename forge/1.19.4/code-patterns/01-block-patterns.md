# 方块代码模式（Forge 1.19.4）

```yaml
模式: 普通方块（无变体）
分类: block
```

## 基础方块

```java
// DeferredRegister 方式（官方推荐）
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

// 1.19.4 用 MaterialColor + .color()；.mapColor(MapColor...) 是 1.20.x 才有的名字
public static final RegistryObject<Block> STONE_BLOCK = BLOCKS.register("stone_block",
    () -> new Block(BlockBehaviour.Properties.of()
        .color(MaterialColor.STONE)
        .strength(1.5f, 6.0f)
        .requiresCorrectToolForDrops()
    )
);

// BlockItem：1.19.4 的 Item.Properties 没有 tab()（见 02-item-patterns.md）
public static final RegistryObject<Item> STONE_BLOCK_ITEM = ITEMS.register("stone_block",
    () -> new BlockItem(STONE_BLOCK.get(), new Item.Properties())
);

// 在 mod 构造函数中挂到 modEventBus
public ExampleMod(FMLJavaModLoadingContext context) {
    IEventBus modEventBus = context.getModEventBus();
    BLOCKS.register(modEventBus);
    ITEMS.register(modEventBus);
}
```

`BlockBehaviour.Properties` 在 1.19.4 已核实可用的链式方法：
`color(MaterialColor)`、`strength(float)`、`strength(float, float)`、`destroyTime(float)`、
`requiresCorrectToolForDrops()`、`noOcclusion()`、`sound(SoundType)`。

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

// 放置时更新临接方块（1.19.4 签名：末位 boolean 参数名 movedByPiston）
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
    public MachineBlock() {
        // of() 无形与 of(Material) 均有本档规则用例（01-registry.mdc:175、02-block.mdc:168）
        super(BlockBehaviour.Properties.of()
            .color(MaterialColor.STONE)
            .strength(1.5f, 6.0f));
    }

    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        // 也可以直接 new MachineBlockEntity(pos, state)
        return ModBlockEntities.MACHINE.get().create(pos, state);
    }

    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return level.isClientSide ? null :
            (type == ModBlockEntities.MACHINE.get() ? MachineBlockEntity::tick : null);
    }
}

// BlockEntityType 注册（官方文档形：BlockEntityType.Builder.of(...).build(null)）
public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, MOD_ID);

public static final RegistryObject<BlockEntityType<MachineBlockEntity>> MACHINE =
    BLOCK_ENTITIES.register("machine",
        () -> BlockEntityType.Builder.of(MachineBlockEntity::new, MACHINE_BLOCK.get()).build(null));

// 方块实体
public class MachineBlockEntity extends BlockEntity {
    private int progress = 0;

    public MachineBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.MACHINE.get(), pos, state);
    }

    public static <T extends BlockEntity> void tick(Level level, BlockPos pos,
            BlockState state, T blockEntity) {
        if (level.isClientSide) return;
        // 定时逻辑
    }

    // 1.19.4：saveAdditional(CompoundTag) / load(CompoundTag) 均仍在 BlockEntity 上
    @Override
    protected void saveAdditional(CompoundTag nbt) {
        super.saveAdditional(nbt);
        nbt.putInt("progress", progress);
    }

    @Override
    public void load(CompoundTag nbt) {
        super.load(nbt);
        this.progress = nbt.getInt("progress");
    }
}
```

> `load()` 里只能读 NBT，**不要**读世界数据（`level.getBlockState(pos)`）；基于世界的逻辑放 `onLoad()`。
> 依据：`../.cursor/rules/02-block.mdc:213`。

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
        // TODO(未核实)：.insertXp(1, 3, 7) —— forge/1.20.1/code-patterns/01-block-patterns.md:137 在用，
        //   但 query_api（--version=1.19.4 与 --version=1.20.1 的 BlockBehaviour$Properties）与
        //   get_method_params net.minecraft.world.level.block.state.BlockBehaviour$Properties#insertXp 都查不到该方法。
        //   掉落经验请改由战利品表（LootTableProvider 的 SetCountFunction/爆炸衰减）实现，见 05-datagen-patterns.md。
    )
);
```

## 世界高度（Caves & Cliffs 起，1.19.4 未变）

1.19.4 世界高度为 **-64 到 320**（总高 384）。

```java
// Level 继承 LevelHeightAccessor，以下方法在 1.19.4 已核实
int minY   = level.getMinBuildHeight();  // -64
int maxY   = level.getMaxBuildHeight();  // 320
int height = level.getHeight();          // 384
boolean out = level.isOutsideBuildHeight(pos);
```
