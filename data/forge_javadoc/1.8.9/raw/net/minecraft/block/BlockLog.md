---
title: "BlockLog"
description: "Determines if this block can prevent leaves connected to it from decaying."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockLog.html"
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
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public boolean canSustainLeaves( IBlockAccess world, BlockPos pos)`
- `public boolean isWood( IBlockAccess world, BlockPos pos)`

## Description

Determines if this block can prevent leaves connected to it from decaying.
