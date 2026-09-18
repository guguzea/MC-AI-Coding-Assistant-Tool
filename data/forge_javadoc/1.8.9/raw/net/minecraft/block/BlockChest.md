---
title: "BlockChest"
description: "0 : Normal chest, 1 : Trapped chest"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockChest.html"
sourceType: javadoc
---

# BlockChest

## Class signature

```java
public class BlockChest extends BlockContainer
```

## Constructors

- `protected BlockChest(int type)`

## Methods

- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int getRenderType()`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public IBlockState checkForSurroundingChests( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState correctFacing( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public ILockableContainer getLockableContainer( World worldIn, BlockPos pos)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean canProvidePower()`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

0 : Normal chest, 1 : Trapped chest
