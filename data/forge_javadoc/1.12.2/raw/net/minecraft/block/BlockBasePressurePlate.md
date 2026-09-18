---
title: "BlockBasePressurePlate"
description: "public abstract class BlockBasePressurePlate extends Block"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockBasePressurePlate.html"
sourceType: javadoc
---

# BlockBasePressurePlate

## Class signature

```java
public abstract class BlockBasePressurePlate extends Block
```

## Constructors

- `protected BlockBasePressurePlate( Material materialIn)`
- `protected BlockBasePressurePlate( Material materialIn, MapColor mapColorIn)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public int tickRate( World worldIn)`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canSpawnInBlock()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `protected void updateState( World worldIn, BlockPos pos, IBlockState state, int oldRedstoneStrength)`
- `protected abstract void playClickOnSound( World worldIn, BlockPos color)`
- `protected abstract void playClickOffSound( World worldIn, BlockPos pos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `protected void updateNeighbors( World worldIn, BlockPos pos)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public boolean canProvidePower( IBlockState state)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `protected abstract int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `protected abstract int getRedstoneStrength( IBlockState state)`
- `protected abstract IBlockState setRedstoneStrength( IBlockState state, int strength)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
