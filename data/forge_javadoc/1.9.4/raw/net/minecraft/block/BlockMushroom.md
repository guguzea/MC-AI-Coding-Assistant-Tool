---
title: "BlockMushroom"
description: "public class BlockMushroom extends BlockBush implements IGrowable"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockMushroom.html"
sourceType: javadoc
---

# BlockMushroom

## Class signature

```java
public class BlockMushroom extends BlockBush implements IGrowable
```

## Constructors

- `protected BlockMushroom()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `protected boolean canSustainBush( IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean generateBigMushroom( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
