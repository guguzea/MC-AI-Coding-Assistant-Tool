---
title: "BlockTripWire"
description: "Get the actual Block state of this Block at the given position."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockTripWire.html"
sourceType: javadoc
---

# BlockTripWire

## Class signature

```java
public class BlockTripWire extends Block
```

## Constructors

- `public BlockTripWire()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public static boolean isConnectedTo( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing direction)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Get the actual Block state of this Block at the given position.
