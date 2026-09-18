# BlockRailBase

## Class signature

```java
public abstract class BlockRailBase extends Block
```

## Constructors

- `protected BlockRailBase(boolean isPowered)`

## Methods

- `public static boolean isRailBlock( World worldIn, BlockPos pos)`
- `public static boolean isRailBlock( IBlockState state)`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `protected void updateState( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `protected IBlockState updateDir( World worldIn, BlockPos pos, IBlockState state, boolean initialPlacement)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public abstract IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public boolean isFlexibleRail( IBlockAccess world, BlockPos pos)`
- `public boolean canMakeSlopes( IBlockAccess world, BlockPos pos)`
- `public BlockRailBase.EnumRailDirection getRailDirection( IBlockAccess world, BlockPos pos, IBlockState state, EntityMinecart cart)`
- `public float getRailMaxSpeed( World world, EntityMinecart cart, BlockPos pos)`
- `public void onMinecartPass( World world, EntityMinecart cart, BlockPos pos)`
- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`

## Description

Returns true if the rail can make up and down slopes.