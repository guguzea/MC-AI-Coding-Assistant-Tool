---
title: "BlockStem"
description: "This returns a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockStem.html"
sourceType: javadoc
---

# BlockStem

## Class signature

```java
public class BlockStem extends BlockBush implements IGrowable
```

## Constructors

- `protected BlockStem( Block crop)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `protected boolean canSustainBush( IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void growStem( World worldIn, BlockPos pos, IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `@Nullable protected Item getSeedItem()`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `@Nullable public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`

## Description

This returns a complete list of items dropped from this block.
