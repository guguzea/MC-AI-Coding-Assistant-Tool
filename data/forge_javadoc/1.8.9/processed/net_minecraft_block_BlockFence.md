# BlockFence

## Class signature

```java
public class BlockFence extends Block
```

## Constructors

- `public BlockFence( Material materialIn)`
- `public BlockFence( Material p_i46395_1_, MapColor p_i46395_2_)`

## Methods

- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canConnectTo( IBlockAccess worldIn, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`

## Description

Whether this fence connects in the eastern direction