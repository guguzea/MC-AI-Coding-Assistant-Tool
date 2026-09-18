---
title: "BlockPane"
description: "Determines if another block can connect to this block"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockPane.html"
sourceType: javadoc
---

# BlockPane

## Class signature

```java
public class BlockPane extends Block
```

## Constructors

- `protected BlockPane( Material materialIn, boolean canDrop)`

## Methods

- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public final boolean canPaneConnectToBlock( Block blockIn)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected boolean canSilkHarvest()`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public boolean canBeConnectedTo( IBlockAccess world, BlockPos pos, EnumFacing facing)`
- `public boolean canPaneConnectTo( IBlockAccess world, BlockPos pos, EnumFacing dir)`

## Description

Determines if another block can connect to this block
