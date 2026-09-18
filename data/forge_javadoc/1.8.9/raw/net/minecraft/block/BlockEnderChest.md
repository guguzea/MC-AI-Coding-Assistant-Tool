---
title: "BlockEnderChest"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockEnderChest.html"
sourceType: javadoc
---

# BlockEnderChest

## Class signature

```java
public class BlockEnderChest extends BlockContainer
```

## Constructors

- `protected BlockEnderChest()`

## Methods

- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int getRenderType()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `protected boolean canSilkHarvest()`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState getStateFromMeta(int meta)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Returns a new instance of a block's tile entity class.
