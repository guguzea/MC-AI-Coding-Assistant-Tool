# BlockBanner

## Class signature

```java
public class BlockBanner extends BlockContainer
```

## Constructors

- `protected BlockBanner()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canSpawnInBlock()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public void getDrops( NonNullList < ItemStack > drops, IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

This gets a complete list of items dropped from this block.