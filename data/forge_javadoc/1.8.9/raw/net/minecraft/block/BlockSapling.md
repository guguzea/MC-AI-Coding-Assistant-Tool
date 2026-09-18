---
title: "BlockSapling"
description: "Whether this IGrowable can grow"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockSapling.html"
sourceType: javadoc
---

# BlockSapling

## Class signature

```java
public class BlockSapling extends BlockBush implements IGrowable
```

## Constructors

- `protected BlockSapling()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void grow( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void generateTree( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean isTypeAt( World worldIn, BlockPos pos, BlockPlanks.EnumType type)`
- `public int damageDropped( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Whether this IGrowable can grow
