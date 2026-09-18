---
title: "BlockLog"
description: "Determines if this block can prevent leaves connected to it from decaying."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockLog.html"
sourceType: javadoc
---

# BlockLog

## Class signature

```java
public abstract class BlockLog extends BlockRotatedPillar
```

## Constructors

- `public BlockLog()`

## Methods

- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public boolean canSustainLeaves( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public boolean isWood( IBlockAccess world, BlockPos pos)`

## Description

Determines if this block can prevent leaves connected to it from decaying.
