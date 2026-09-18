---
title: "ItemBlock"
description: "Called to actually place the block, after the location is determined and all permission checks have been made."
package: "net/minecraft/item"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/item/ItemBlock.html"
sourceType: javadoc
---

# ItemBlock

## Class signature

```java
public class ItemBlock extends Item
```

## Constructors

- `public ItemBlock( Block block)`

## Methods

- `public ItemBlock setUnlocalizedName(java.lang.String unlocalizedName)`
- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public static boolean setTileEntityNBT( World worldIn, @Nullable EntityPlayer player, BlockPos pos, ItemStack stackIn)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public java.lang.String getUnlocalizedName()`
- `public CreativeTabs getCreativeTab()`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public Block getBlock()`
- `public boolean placeBlockAt( ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`

## Description

Called to actually place the block, after the location is determined and all permission checks have been made.
