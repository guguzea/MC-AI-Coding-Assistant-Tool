# BlockSign

## Class signature

```java
public class BlockSign extends BlockContainer
```

## Constructors

- `protected BlockSign()`

## Methods

- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube()`
- `public boolean func_181623_g()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`

## Description

Returns a new instance of a block's tile entity class.