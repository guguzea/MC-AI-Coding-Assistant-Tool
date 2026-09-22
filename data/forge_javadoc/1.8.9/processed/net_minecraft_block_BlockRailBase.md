# BlockRailBase

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRailBase

## Class signature

```java
public abstract class BlockRailBase extends Block
```

## Constructors

- `BlockRailBase(boolean isPowered)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canMakeSlopes(IBlockAccess world, BlockPos pos)` — Returns true if the rail can make up and down slopes.
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `MovingObjectPosition collisionRayTrace(World worldIn, BlockPos pos, Vec3 start, Vec3 end)` — Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.
- `protected IBlockState func_176564_a(World worldIn, BlockPos p_176564_2_, IBlockState p_176564_3_, boolean p_176564_4_)`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getMobilityFlag()`
- `BlockRailBase.EnumRailDirection getRailDirection(IBlockAccess world, BlockPos pos, IBlockState state, EntityMinecart cart)` — Return the rail's direction.
- `float getRailMaxSpeed(World world, EntityMinecart cart, BlockPos pos)` — Returns the max speed of the rail at the specified position.
- `abstract IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `boolean isFlexibleRail(IBlockAccess world, BlockPos pos)` — Return true if the rail can make corners.
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `static boolean isRailBlock(IBlockState state)`
- `static boolean isRailBlock(World worldIn, BlockPos pos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onMinecartPass(World world, EntityMinecart cart, BlockPos pos)` — This function is called by any minecart that passes over this rail.
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `protected void onNeighborChangedInternal(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`

## Fields

- `protected boolean isPowered`