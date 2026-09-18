---
title: "BlockFarmland"
description: "Get the Item that this Block should drop when harvested."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFarmland.html"
sourceType: javadoc
---

# BlockFarmland

## Class signature

```java
public class BlockFarmland extends Block
```

## Constructors

- `protected BlockFarmland()`

## Methods

- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onFallenUpon( World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public IBlockState getStateFromMeta(int meta)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Get the Item that this Block should drop when harvested.
