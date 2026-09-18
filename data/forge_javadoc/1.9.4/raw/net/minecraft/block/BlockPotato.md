---
title: "BlockPotato"
description: "This returns a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockPotato.html"
sourceType: javadoc
---

# BlockPotato

## Class signature

```java
public class BlockPotato extends BlockCrops
```

## Constructors

- `public BlockPotato()`

## Methods

- `protected Item getSeed()`
- `protected Item getCrop()`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

This returns a complete list of items dropped from this block.
