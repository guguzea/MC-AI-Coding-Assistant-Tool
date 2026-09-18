---
title: "BlockRailDetector"
description: "Can this block provide power."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRailDetector.html"
sourceType: javadoc
---

# BlockRailDetector

## Class signature

```java
public class BlockRailDetector extends BlockRailBase
```

## Constructors

- `public BlockRailDetector()`

## Methods

- `public int tickRate( World worldIn)`
- `public boolean canProvidePower()`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `protected <T extends EntityMinecart > java.util.List<T> findMinecarts( World worldIn, BlockPos pos, java.lang.Class<T> clazz, <any>... filter)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Can this block provide power.
