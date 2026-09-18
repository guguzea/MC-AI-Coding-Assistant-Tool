---
title: "BlockSapling"
description: "public class BlockSapling extends BlockBush implements IGrowable"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockSapling.html"
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

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
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
- `protected BlockStateContainer createBlockState()`
