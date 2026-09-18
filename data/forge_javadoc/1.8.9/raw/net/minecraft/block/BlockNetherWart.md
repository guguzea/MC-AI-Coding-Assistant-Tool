---
title: "BlockNetherWart"
description: "is the block grass, dirt or farmland"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockNetherWart.html"
sourceType: javadoc
---

# BlockNetherWart

## Class signature

```java
public class BlockNetherWart extends BlockBush
```

## Constructors

- `protected BlockNetherWart()`

## Methods

- `protected boolean canPlaceBlockOn( Block ground)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public IBlockState getStateFromMeta(int meta)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

is the block grass, dirt or farmland
