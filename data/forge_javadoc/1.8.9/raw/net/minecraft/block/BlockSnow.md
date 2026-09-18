---
title: "BlockSnow"
description: "Get the Item that this Block should drop when harvested."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockSnow.html"
sourceType: javadoc
---

# BlockSnow

## Class signature

```java
public class BlockSnow extends Block
```

## Constructors

- `protected BlockSnow()`

## Methods

- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public void setBlockBoundsForItemRender()`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `protected void getBoundsForLayers(int p_150154_1_)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public IBlockState getStateFromMeta(int meta)`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public int quantityDropped( IBlockState state, int fortune, java.util.Random random)`

## Description

Get the Item that this Block should drop when harvested.
