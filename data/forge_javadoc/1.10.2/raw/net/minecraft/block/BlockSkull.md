---
title: "BlockSkull"
description: "This returns a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockSkull.html"
sourceType: javadoc
---

# BlockSkull

## Class signature

```java
public class BlockSkull extends BlockContainer
```

## Constructors

- `protected BlockSkull()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess worldIn, BlockPos pos, IBlockState state, int fortune)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canDispenserPlace( World worldIn, BlockPos pos, ItemStack stack)`
- `public void checkWitherSpawn( World worldIn, BlockPos pos, TileEntitySkull te)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `protected BlockPattern getWitherBasePattern()`
- `protected BlockPattern getWitherPattern()`

## Description

This returns a complete list of items dropped from this block.
