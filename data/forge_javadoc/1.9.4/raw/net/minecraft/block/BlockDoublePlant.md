---
title: "BlockDoublePlant"
description: "Checks if the object is currently shearable Example: Sheep return false when they have no wool"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockDoublePlant.html"
sourceType: javadoc
---

# BlockDoublePlant

## Class signature

```java
public class BlockDoublePlant extends BlockBush implements IGrowable , IShearable
```

## Constructors

- `public BlockDoublePlant()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `protected void checkAndDropBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int damageDropped( IBlockState state)`
- `public void placeAt( World worldIn, BlockPos lowerPos, BlockDoublePlant.EnumPlantType variant, int flags)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `public boolean removedByPlayer( IBlockState state, World world, BlockPos pos, EntityPlayer player, boolean willHarvest)`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool
