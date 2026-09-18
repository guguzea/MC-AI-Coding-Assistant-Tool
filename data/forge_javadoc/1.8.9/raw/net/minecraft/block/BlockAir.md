---
title: "BlockAir"
description: "Spawns this Block's drops into the World as EntityItems."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockAir.html"
sourceType: javadoc
---

# BlockAir

## Class signature

```java
public class BlockAir extends Block
```

## Constructors

- `protected BlockAir()`

## Methods

- `public int getRenderType()`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`

## Description

Spawns this Block's drops into the World as EntityItems.
