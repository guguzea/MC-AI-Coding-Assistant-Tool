---
title: "BlockWeb"
description: "Checks if the object is currently shearable Example: Sheep return false when they have no wool"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockWeb.html"
sourceType: javadoc
---

# BlockWeb

## Class signature

```java
public class BlockWeb extends Block implements IShearable
```

## Constructors

- `public BlockWeb()`

## Methods

- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `protected boolean canSilkHarvest()`
- `public BlockRenderLayer getBlockLayer()`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool
