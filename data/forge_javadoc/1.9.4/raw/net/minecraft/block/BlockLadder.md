---
title: "BlockLadder"
description: "Checks if a player or entity can use this block to 'climb' like a ladder."
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockLadder.html"
sourceType: javadoc
---

# BlockLadder

## Class signature

```java
public class BlockLadder extends Block
```

## Constructors

- `protected BlockLadder()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `protected boolean canBlockStay( World worldIn, BlockPos pos, EnumFacing facing)`
- `public IBlockState getStateFromMeta(int meta)`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public boolean isLadder( IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)`

## Description

Checks if a player or entity can use this block to 'climb' like a ladder.
