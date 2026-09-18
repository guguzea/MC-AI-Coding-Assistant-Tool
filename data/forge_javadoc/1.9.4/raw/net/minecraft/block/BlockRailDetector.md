---
title: "BlockRailDetector"
description: "public class BlockRailDetector extends BlockRailBase"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockRailDetector.html"
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
- `public boolean canProvidePower( IBlockState state)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected void updateConnectedRails( World worldIn, BlockPos pos, IBlockState state, boolean p_185592_4_)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `protected <T extends EntityMinecart > java.util.List<T> findMinecarts( World worldIn, BlockPos pos, java.lang.Class<T> clazz, com.google.common.base.Predicate< Entity >... filter)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
