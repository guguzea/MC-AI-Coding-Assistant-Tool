---
title: "BlockCrops"
description: "Whether this IGrowable can grow"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockCrops.html"
sourceType: javadoc
---

# BlockCrops

## Class signature

```java
public class BlockCrops extends BlockBush implements IGrowable
```

## Constructors

- `protected BlockCrops()`

## Methods

- `protected boolean canPlaceBlockOn( Block ground)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void grow( World worldIn, BlockPos pos, IBlockState state)`
- `protected static float getGrowthChance( Block blockIn, World worldIn, BlockPos pos)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `protected Item getSeed()`
- `protected Item getCrop()`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

Whether this IGrowable can grow
