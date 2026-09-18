---
title: "BlockWeb"
description: "Get the Item that this Block should drop when harvested."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockWeb.html"
sourceType: javadoc
---

# BlockWeb

## Class signature

```java
public class BlockWeb extends Block
```

## Constructors

- `public BlockWeb()`

## Methods

- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean isOpaqueCube()`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isFullCube()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `protected boolean canSilkHarvest()`
- `public EnumWorldBlockLayer getBlockLayer()`

## Description

Get the Item that this Block should drop when harvested.
