---
title: "BlockTallGrass"
description: "This returns a complete list of items dropped from this block."
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockTallGrass.html"
sourceType: javadoc
---

# BlockTallGrass

## Class signature

```java
public class BlockTallGrass extends BlockBush implements IGrowable , IShearable
```

## Constructors

- `protected BlockTallGrass()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

This returns a complete list of items dropped from this block.
