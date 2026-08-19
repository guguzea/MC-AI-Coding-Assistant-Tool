---
description: 02 — 方块开发
---

# 02 — 方块开发

> 适用版本：Forge 1.13.2

---

## 约束

### Block 子类规范

- 方块类必须继承 `Block`（`net.minecraft.block.Block`）
- 使用 `Block.Properties.create(Material)` 创建属性（不是 1.14+ 的 `BlockBehaviour.Properties.of()`）
- 右键交互用 `onBlockActivated`。不要抄 1.14+ 的 `use` / `PlayerEntity` 记忆

### Block.Properties 常用配置

来源：ForgeJavaDocs-NG `1.13.2-25.0.220` 的 `Block.Properties`。

```java
Block.Properties.create(Material material)
    .hardnessAndResistance(float hardness, float resistance)
    .hardnessAndResistance(float hardness)                   // 抗爆性默认 = 硬度 * 5
    .lightValue(int lightValue)                             // 发光值 0-15
    .doesNotBlockMovement()
    .slipperiness(float slipperiness)
    .sound(SoundType type)
    .needsRandomTick()                                      // 不是 1.14 的 tickRandomly
    .variableOpacity()
```

另有 `create(Material, EnumDyeColor)` / `create(Material, MaterialColor)` / `from(Block)`。

> 本档 `Block.Properties` **没有** `harvestLevel` / `harvestTool` / `noDrops` / `notSolid` / `lightOpacity`（那些是邻版或未出现在本版 javadoc 方法表里）。

### 注册约束

- **禁止**通过 `new Block(...)` 构造后不 `setRegistryName` 就注册
- 必须通过 `RegistryEvent.Register<Block>` 注册（参见 `01-registry.mdc`）。1.13.2 **没有** `DeferredRegister`
- 注册名称必须全小写
- `ItemBlock` 需要单独注册（与方块使用相同 registry name）

### 方块实体（TileEntity）约束

- 有状态或需要持久化的方块必须使用 TileEntity（本档命名，非 BlockEntity）
- 推荐重写 `IForgeBlock.hasTileEntity(IBlockState)` + `createTileEntity(IBlockState, IBlockReader)`
- `ITileEntityProvider` 在本档 javadoc 已 `@Deprecated`；若仍实现，签名是 `createNewTileEntity(IBlockReader)`，**不是** 1.12 的 `(World, int meta)`
- TileEntity：`write(NBTTagCompound)` **返回** `NBTTagCompound`；`read(NBTTagCompound)`。不要用 1.12 的 `writeToNBT` / `readFromNBT`，也不要抄 1.14 的 `CompoundNBT`
- NBT 读写用 `setInt` / `getInt`（不是 `setInteger` / `putInt`）
- 构造函数是 `TileEntity(TileEntityType<?>)`
- **禁止**在 `read` 中直接读取世界数据

### BlockState 配置

- 使用 `setDefaultState` 设置默认状态
- 碰撞箱不要抄 1.12 `AxisAlignedBB`；1.13 走 VoxelShape（缺方法名则查本档 javadoc）

---

## Decision Flow

### Decision: 需要什么类型的方块？

```
IF 需要可放置物品、不可交互的基础方块
  → 基础方块（extends Block）
  → 注册后注册 ItemBlock
  → 创建 blockstates JSON 和 models JSON

IF 需要存储数据（箱子、熔炉等）
  → 方块实体方块（Block + TileEntity）
  → 重写 hasTileEntity / createTileEntity
  → 实现 TileEntity 子类，构造传入 TileEntityType

IF 需要可交互（右键打开 GUI、触发事件）
  → 基础方块 + onBlockActivated
  → 不要抄 1.12 IGuiHandler 当已核 API（缺签名则查本档 javadoc / 10-gui）

IF 需要流体
  → 使用 Forge 专用流体系统
  → 参考 Forge 文档，不要抄后期 FluidType
```

### Decision: 方块属性（Material）选择

来源：本档 `Material` 静态字段（没有 `Material.STONE` / `EARTH` / `PLANT`）。

```
IF 自然方块（石头、木头、草）
  → Material.ROCK / Material.WOOD / Material.GRASS

IF 泥土类
  → Material.GROUND / Material.SAND / Material.SNOW

IF 玻璃/冰/透明
  → Material.GLASS / Material.ICE
  → 需要 variableOpacity() 或 doesNotBlockMovement() 时按碰撞/遮光需求选

IF 植物
  → Material.PLANTS / Material.VINE / Material.OCEAN_PLANT
  → 不能放置方块，需要特殊放置逻辑

IF 液体
  → 不在 Block 中实现，使用 Fluid 系统（Material.WATER / LAVA 是原版材料）
```

### Decision: Block vs TileEntity

```
IF 需要存储玩家数据（容器内容、熔炉燃料/物品）
  → 必须使用 TileEntity
  → 重写 hasTileEntity / createTileEntity
  → 先注册方块再注册 TileEntityType

IF 需要每 tick 逻辑（自动机、计时器）
  → TileEntity 实现 net.minecraft.util.ITickable，方法是 tick()（不是 1.12 的 update()）

IF 只需要静态方块（装饰、完整方块）
  → 普通 Block 即可，不需要 TileEntity
  → 减少内存占用和复杂度
```

---

## 示例：基础方块（带 ItemBlock）

```java
// blocks/MyBlock.java
public class MyBlock extends Block {
    public MyBlock() {
        super(Block.Properties.create(Material.ROCK)
            .hardnessAndResistance(1.5f, 6.0f)
            .sound(SoundType.STONE)
        );
    }
}
```

```java
// 注册（在 RegistryEvent.Register<Block> 中）
@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(
        MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
    );
}
```

```java
// ❌ 错误示例：没有 setRegistryName
event.getRegistry().register(new MyBlock()); // 没有注册名，无法引用
```

## 示例：带 TileEntity 的方块

```java
// blocks/MyTileEntityBlock.java
public class MyTileEntityBlock extends Block {
    public MyTileEntityBlock() {
        super(Block.Properties.create(Material.WOOD));
    }

    @Override
    public boolean hasTileEntity(IBlockState state) {
        return true;
    }

    @Override
    public TileEntity createTileEntity(IBlockState state, IBlockReader world) {
        return new MyTileEntity();
    }
}
```

```java
// tiles/MyTileEntity.java
public class MyTileEntity extends TileEntity implements ITickable {
    private int counter = 0;

    public MyTileEntity() {
        super(MY_TILE_ENTITY_TYPE);
    }

    @Override
    public void tick() {
        if (world == null || world.isRemote) return;
        counter++;
    }

    @Override
    public NBTTagCompound write(NBTTagCompound compound) {
        compound = super.write(compound);
        compound.setInt("counter", counter);
        return compound;
    }

    @Override
    public void read(NBTTagCompound compound) {
        super.read(compound);
        counter = compound.getInt("counter");
    }
}
```

> 注意：`write`/`read` 中读写 NBT 是安全的，但你**不能**在这些方法中读取世界数据。
