---
title: "BlockRedstoneDiode"
description: "Tells whether the repeater is powered or not"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneDiode.html"
sourceType: javadoc
---

# BlockRedstoneDiode

## Class signature

```java
public abstract class BlockRedstoneDiode extends BlockDirectional
```

## Constructors

- `protected BlockRedstoneDiode(boolean powered)`

## Methods

- `public boolean isFullCube()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean canBlockStay( World worldIn, BlockPos pos)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `protected boolean isPowered( IBlockState state)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected void updateState( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isLocked( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected boolean shouldBePowered( World worldIn, BlockPos pos, IBlockState state)`
- `protected int calculateInputStrength( World worldIn, BlockPos pos, IBlockState state)`
- `protected int getPowerOnSides( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected int getPowerOnSide( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canProvidePower()`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `protected void notifyNeighbors( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `protected boolean canPowerSide( Block blockIn)`
- `protected int getActiveSignal( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `public static boolean isRedstoneRepeaterBlockID( Block blockIn)`
- `public boolean isAssociated( Block other)`
- `public boolean isFacingTowardsRepeater( World worldIn, BlockPos pos, IBlockState state)`
- `protected int getTickDelay( IBlockState state)`
- `protected abstract int getDelay( IBlockState state)`
- `protected abstract IBlockState getPoweredState( IBlockState unpoweredState)`
- `protected abstract IBlockState getUnpoweredState( IBlockState poweredState)`
- `public boolean isAssociatedBlock( Block other)`
- `public EnumWorldBlockLayer getBlockLayer()`

## Description

Tells whether the repeater is powered or not
