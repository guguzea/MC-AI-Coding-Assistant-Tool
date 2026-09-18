---
title: "BlockPane"
description: "Add all collision boxes of this Block to the list that intersect with the given mask."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockPane.html"
sourceType: javadoc
---

# BlockPane

## Class signature

```java
public class BlockPane extends Block
```

## Constructors

- `protected BlockPane( Material materialIn, boolean canDrop)`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public void setBlockBoundsForItemRender()`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public final boolean canPaneConnectToBlock( Block blockIn)`
- `protected boolean canSilkHarvest()`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public boolean canPaneConnectTo( IBlockAccess world, BlockPos pos, EnumFacing dir)`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.
