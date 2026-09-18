---
title: "BlockFlowerPot"
description: "This gets a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockFlowerPot.html"
sourceType: javadoc
---

# BlockFlowerPot

## Class signature

```java
public class BlockFlowerPot extends BlockContainer
```

## Constructors

- `public BlockFlowerPot()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `protected BlockStateContainer createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public void getDrops( NonNullList < ItemStack > drops, IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `public boolean removedByPlayer( IBlockState state, World world, BlockPos pos, EntityPlayer player, boolean willHarvest)`
- `public void harvestBlock( World world, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack tool)`

## Description

This gets a complete list of items dropped from this block.
