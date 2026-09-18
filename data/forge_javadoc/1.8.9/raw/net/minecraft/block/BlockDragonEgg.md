---
title: "BlockDragonEgg"
description: "Used to determine ambient occlusion and culling when rebuilding chunks for render"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDragonEgg.html"
sourceType: javadoc
---

# BlockDragonEgg

## Class signature

```java
public class BlockDragonEgg extends Block
```

## Constructors

- `public BlockDragonEgg()`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public int tickRate( World worldIn)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public Item getItem( World worldIn, BlockPos pos)`

## Description

Used to determine ambient occlusion and culling when rebuilding chunks for render
