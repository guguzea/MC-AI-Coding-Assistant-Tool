# BlockRailBase

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRailBase

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
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `EnumPushReaction getMobilityFlag(IBlockState state)`
- `BlockRailBase.EnumRailDirection getRailDirection(IBlockAccess world, BlockPos pos, IBlockState state, EntityMinecart cart)` — Return the rail's direction.
- `float getRailMaxSpeed(World world, EntityMinecart cart, BlockPos pos)` — Returns the max speed of the rail at the specified position.
- `abstract IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `boolean isFlexibleRail(IBlockAccess world, BlockPos pos)` — Return true if the rail can make corners.
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `static boolean isRailBlock(IBlockState state)`
- `static boolean isRailBlock(World worldIn, BlockPos pos)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onMinecartPass(World world, EntityMinecart cart, BlockPos pos)` — This function is called by any minecart that passes over this rail.
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `protected IBlockState updateDir(World worldIn, BlockPos pos, IBlockState state, boolean initialPlacement)`
- `protected void updateState(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`

## Fields

- `protected static AxisAlignedBB ASCENDING_AABB`
- `protected static AxisAlignedBB FLAT_AABB`
- `protected boolean isPowered`