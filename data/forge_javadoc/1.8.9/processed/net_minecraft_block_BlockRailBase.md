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
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public MovingObjectPosition collisionRayTrace( World worldIn, BlockPos pos, Vec3 start, Vec3 end)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected void onNeighborChangedInternal( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected IBlockState func_176564_a( World worldIn, BlockPos p_176564_2_, IBlockState p_176564_3_, boolean p_176564_4_)`
- `public int getMobilityFlag()`
- `public EnumWorldBlockLayer getBlockLayer()`
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