---
title: "BlockBanner"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockBanner.html"
sourceType: javadoc
---

# BlockBanner

## Class signature

```java
public class BlockBanner extends BlockContainer
```

## Constructors

- `protected BlockBanner()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube()`
- `public boolean func_181623_g()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

Returns a new instance of a block's tile entity class.
