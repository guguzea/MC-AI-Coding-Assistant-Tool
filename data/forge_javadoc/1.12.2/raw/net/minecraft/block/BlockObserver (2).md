---
title: "BlockObserver"
description: "Called on an Observer block whenever an update for an Observer is received."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockObserver.html"
sourceType: javadoc
---

# BlockObserver

## Class signature

```java
public class BlockObserver extends BlockDirectional
```

## Constructors

- `public BlockObserver()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void observedNeighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `protected void updateNeighborsInFront( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canProvidePower( IBlockState state)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public void observedNeighborChange( IBlockState observerState, World world, BlockPos observerPos, Block changedBlock, BlockPos changedBlockPos)`

## Description

Called on an Observer block whenever an update for an Observer is received.
