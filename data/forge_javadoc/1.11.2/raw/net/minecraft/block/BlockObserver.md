---
title: "BlockObserver"
description: "Called on an Observer block whenever an update for an Observer is received."
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockObserver.html"
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
- `public void observedNeighborChanged( IBlockState p_190962_1_, World p_190962_2_, BlockPos p_190962_3_, Block p_190962_4_, BlockPos p_190962_5_)`
- `protected void updateNeighborsInFront( World p_190961_1_, BlockPos p_190961_2_, IBlockState p_190961_3_)`
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
