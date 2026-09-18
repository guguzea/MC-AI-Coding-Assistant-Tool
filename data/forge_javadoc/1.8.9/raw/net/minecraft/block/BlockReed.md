---
title: "BlockReed"
description: "Get the Item that this Block should drop when harvested."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockReed.html"
sourceType: javadoc
---

# BlockReed

## Class signature

```java
public class BlockReed extends Block implements IPlantable
```

## Constructors

- `protected BlockReed()`

## Methods

- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected final boolean checkForDrop( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`

## Description

Get the Item that this Block should drop when harvested.
