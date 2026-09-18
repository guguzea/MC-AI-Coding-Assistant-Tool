---
title: "BlockCake"
description: "Get the Item that this Block should drop when harvested."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockCake.html"
sourceType: javadoc
---

# BlockCake

## Class signature

```java
public class BlockCake extends Block
```

## Constructors

- `protected BlockCake()`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void setBlockBoundsForItemRender()`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean isOpaqueCube()`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public int quantityDropped(java.util.Random random)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public IBlockState getStateFromMeta(int meta)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `protected BlockState createBlockState()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public boolean hasComparatorInputOverride()`

## Description

Get the Item that this Block should drop when harvested.
