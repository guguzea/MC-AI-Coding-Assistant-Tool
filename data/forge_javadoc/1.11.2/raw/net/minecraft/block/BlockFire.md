---
title: "BlockFire"
description: "Deprecated."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockFire.html"
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
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
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
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public MapColor getMapColor( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public boolean canCatchFire( IBlockAccess world, BlockPos pos, EnumFacing face)`

## Description

Deprecated.
