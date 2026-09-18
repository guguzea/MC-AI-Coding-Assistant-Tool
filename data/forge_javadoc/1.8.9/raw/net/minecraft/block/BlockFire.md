---
title: "BlockFire"
description: "Deprecated."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFire.html"
sourceType: javadoc
---

# BlockFire

## Class signature

```java
public class BlockFire extends Block
```

## Constructors

- `protected BlockFire()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public static void init()`
- `public void setFireInfo( Block blockIn, int encouragement, int flammability)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int quantityDropped(java.util.Random random)`
- `public int tickRate( World worldIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected boolean canDie( World worldIn, BlockPos pos)`
- `public boolean requiresUpdates()`
- `@Deprecated public int getFlammability( Block blockIn)`
- `@Deprecated public int getEncouragement( Block blockIn)`
- `public boolean isCollidable()`
- `@Deprecated public boolean canCatchFire( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public MapColor getMapColor( IBlockState state)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public boolean canCatchFire( IBlockAccess world, BlockPos pos, EnumFacing face)`

## Description

Deprecated.
