# BlockBasePressurePlate

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBasePressurePlate

## Class signature

```java
public abstract class BlockBasePressurePlate extends Block
```

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canProvidePower()` — Can this block provide power.
- `protected abstract int computeRedstoneStrength(World worldIn, BlockPos pos)`
- `boolean func_181623_g()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getMobilityFlag()`
- `protected abstract int getRedstoneStrength(IBlockState state)`
- `protected AxisAlignedBB getSensitiveAABB(BlockPos pos)` — Returns the cubic AABB inset by 1/8 on all sides
- `int getStrongPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `int getWeakPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)` — Called randomly when setTickRandomly is set to true (used by e.g. crops to grow, etc.)
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `protected void setBlockBoundsBasedOnState0(IBlockState state)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `protected abstract IBlockState setRedstoneStrength(IBlockState state, int strength)`
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `protected void updateNeighbors(World worldIn, BlockPos pos)` — Notify block and block below of changes
- `protected void updateState(World worldIn, BlockPos pos, IBlockState state, int oldRedstoneStrength)` — Updates the pressure plate when stepped on
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected BlockBasePressurePlate`
- `protected BlockBasePressurePlate`