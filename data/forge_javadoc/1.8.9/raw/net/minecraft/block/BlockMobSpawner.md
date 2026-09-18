---
title: "BlockMobSpawner"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockMobSpawner.html"
sourceType: javadoc
---

# BlockMobSpawner

## Class signature

```java
public class BlockMobSpawner extends BlockContainer
```

## Constructors

- `protected BlockMobSpawner()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockAccess world, BlockPos pos, int fortune)`
- `public boolean isOpaqueCube()`
- `public int getRenderType()`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public Item getItem( World worldIn, BlockPos pos)`

## Description

Returns a new instance of a block's tile entity class.
