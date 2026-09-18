---
title: "BlockTripWireHook"
description: "Check whether this Block can be placed on the given side"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockTripWireHook.html"
sourceType: javadoc
---

# BlockTripWireHook

## Class signature

```java
public class BlockTripWireHook extends Block
```

## Constructors

- `public BlockTripWireHook()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void func_176260_a( World worldIn, BlockPos pos, IBlockState hookState, boolean p_176260_4_, boolean p_176260_5_, int p_176260_6_, IBlockState p_176260_7_)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public boolean canProvidePower()`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Check whether this Block can be placed on the given side
