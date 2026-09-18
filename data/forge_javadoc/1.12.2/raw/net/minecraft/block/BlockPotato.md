---
title: "BlockPotato"
description: "This gets a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockPotato.html"
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
- `public void getDrops( NonNullList < ItemStack > drops, IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

This gets a complete list of items dropped from this block.
