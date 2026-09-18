---
title: "BlockBrewingStand"
description: "Add all collision boxes of this Block to the list that intersect with the given mask."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockBrewingStand.html"
sourceType: javadoc
---

# BlockBrewingStand

## Class signature

```java
public class BlockBrewingStand extends BlockContainer
```

## Constructors

- `public BlockBrewingStand()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public boolean isOpaqueCube()`
- `public int getRenderType()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean isFullCube()`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public void setBlockBoundsForItemRender()`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.
