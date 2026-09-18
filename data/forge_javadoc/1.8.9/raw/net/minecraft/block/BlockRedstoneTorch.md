---
title: "BlockRedstoneTorch"
description: "Can this block provide power."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneTorch.html"
sourceType: javadoc
---

# BlockRedstoneTorch

## Class signature

```java
public class BlockRedstoneTorch extends BlockTorch
```

## Constructors

- `protected BlockRedstoneTorch(boolean isOn)`

## Methods

- `public int tickRate( World worldIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canProvidePower()`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean isAssociatedBlock( Block other)`

## Description

Can this block provide power.
