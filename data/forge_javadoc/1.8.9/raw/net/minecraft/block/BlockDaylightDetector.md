---
title: "BlockDaylightDetector"
description: "Can this block provide power."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDaylightDetector.html"
sourceType: javadoc
---

# BlockDaylightDetector

## Class signature

```java
public class BlockDaylightDetector extends BlockContainer
```

## Constructors

- `public BlockDaylightDetector(boolean inverted)`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public void updatePower( World worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean isOpaqueCube()`
- `public int getRenderType()`
- `public boolean canProvidePower()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`

## Description

Can this block provide power.
