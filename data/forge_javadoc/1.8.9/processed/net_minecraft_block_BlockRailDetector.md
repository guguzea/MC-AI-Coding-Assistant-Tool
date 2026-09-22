# BlockRailDetector

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRailDetector

## Class signature

```java
public class BlockRailDetector extends BlockRailBase
```

## Constructors

- `BlockRailDetector()`

## Methods

- `boolean canProvidePower()` — Can this block provide power.
- `protected BlockState createBlockState()`
- `protected<T extends EntityMinecart> java.util.List<T> findMinecarts(World worldIn, BlockPos pos, java.lang.Class<T> clazz, <any>... filter)`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `int getStrongPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `int getWeakPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `boolean hasComparatorInputOverride()`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)` — Called randomly when setTickRandomly is set to true (used by e.g. crops to grow, etc.)
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool POWERED`
- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`