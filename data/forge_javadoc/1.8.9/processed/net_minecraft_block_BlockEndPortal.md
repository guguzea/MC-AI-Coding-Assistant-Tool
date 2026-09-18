# BlockEndPortal

## Class signature

```java
public class BlockEndPortal extends BlockContainer
```

## Constructors

- `protected BlockEndPortal( Material materialIn)`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int quantityDropped(java.util.Random random)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public MapColor getMapColor( IBlockState state)`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.