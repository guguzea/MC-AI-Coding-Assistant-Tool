# BlockFire

## Class signature

```java
public class BlockFire extends Block
```

## Constructors

- `protected BlockFire()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public static void init()`
- `public void setFireInfo( Block blockIn, int encouragement, int flammability)`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public int tickRate( World worldIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected boolean canDie( World worldIn, BlockPos pos)`
- `public boolean requiresUpdates()`
- `@Deprecated public int getFlammability( Block blockIn)`
- `@Deprecated public int getEncouragement( Block blockIn)`
- `public boolean isCollidable()`
- `@Deprecated public boolean canCatchFire( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public MapColor getMapColor( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public IBlockState getStateFromMeta(int meta)`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public boolean canCatchFire( IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`

## Description

Deprecated.