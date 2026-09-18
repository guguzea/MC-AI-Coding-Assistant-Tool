---
title: "BlockRailBase"
description: "Returns true if the rail can make up and down slopes."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockRailBase.html"
sourceType: javadoc
---

# BlockRailBase

## Class signature

```java
public abstract class BlockRailBase extends Block
```

## Constructors

- `protected BlockRailBase(boolean isPowered)`

## Methods

- `public static boolean isRailBlock( World worldIn, BlockPos pos)`
- `public static boolean isRailBlock( IBlockState state)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `protected void updateState( IBlockState p_189541_1_, World p_189541_2_, BlockPos p_189541_3_, Block p_189541_4_)`
- `protected IBlockState updateDir( World worldIn, BlockPos pos, IBlockState state, boolean p_176564_4_)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public abstract IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public boolean isFlexibleRail( IBlockAccess world, BlockPos pos)`
- `public boolean canMakeSlopes( IBlockAccess world, BlockPos pos)`
- `public BlockRailBase.EnumRailDirection getRailDirection( IBlockAccess world, BlockPos pos, IBlockState state, @Nullable EntityMinecart cart)`
- `public float getRailMaxSpeed( World world, EntityMinecart cart, BlockPos pos)`
- `public void onMinecartPass( World world, EntityMinecart cart, BlockPos pos)`
- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`

## Description

Returns true if the rail can make up and down slopes.
