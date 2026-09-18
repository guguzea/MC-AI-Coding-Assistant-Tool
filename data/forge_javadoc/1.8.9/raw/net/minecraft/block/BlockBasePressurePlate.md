---
title: "BlockBasePressurePlate"
description: "Can this block provide power."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockBasePressurePlate.html"
sourceType: javadoc
---

# BlockBasePressurePlate

## Class signature

```java
public abstract class BlockBasePressurePlate extends Block
```

## Constructors

- `protected BlockBasePressurePlate( Material materialIn)`
- `protected BlockBasePressurePlate( Material p_i46401_1_, MapColor p_i46401_2_)`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `protected void setBlockBoundsBasedOnState0( IBlockState state)`
- `public int tickRate( World worldIn)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean func_181623_g()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `protected void updateState( World worldIn, BlockPos pos, IBlockState state, int oldRedstoneStrength)`
- `protected AxisAlignedBB getSensitiveAABB( BlockPos pos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `protected void updateNeighbors( World worldIn, BlockPos pos)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public boolean canProvidePower()`
- `public void setBlockBoundsForItemRender()`
- `public int getMobilityFlag()`
- `protected abstract int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `protected abstract int getRedstoneStrength( IBlockState state)`
- `protected abstract IBlockState setRedstoneStrength( IBlockState state, int strength)`

## Description

Can this block provide power.
