---
title: "BlockFlowerPot"
description: "This returns a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockFlowerPot.html"
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
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `protected BlockStateContainer createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `public boolean removedByPlayer( IBlockState state, World world, BlockPos pos, EntityPlayer player, boolean willHarvest)`
- `public void harvestBlock( World world, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack tool)`

## Description

This returns a complete list of items dropped from this block.
