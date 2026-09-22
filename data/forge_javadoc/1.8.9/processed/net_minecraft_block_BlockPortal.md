# BlockPortal

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockPortal

## Class signature

```java
public class BlockPortal extends BlockBreakable
```

## Constructors

- `BlockPortal()`

## Methods

- `protected BlockState createBlockState()`
- `boolean func_176548_d(World worldIn, BlockPos p_176548_2_)`
- `BlockPattern.PatternHelper func_181089_f(World p_181089_1_, BlockPos p_181089_2_)`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItem(World worldIn, BlockPos pos)`
- `static int getMetaForAxis(EnumFacing.Axis axis)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean isFullCube()`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyEnum<EnumFacing.Axis> AXIS`