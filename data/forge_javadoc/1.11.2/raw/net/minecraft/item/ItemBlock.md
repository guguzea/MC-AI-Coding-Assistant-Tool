---
title: "ItemBlock"
description: "Called to actually place the block, after the location is determined and all permission checks have been made."
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemBlock.html"
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

- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public static boolean setTileEntityNBT( World worldIn, @Nullable EntityPlayer player, BlockPos pos, ItemStack stackIn)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public java.lang.String getUnlocalizedName()`
- `public CreativeTabs getCreativeTab()`
- `public void getSubItems( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > subItems)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public Block getBlock()`
- `public boolean placeBlockAt( ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)`

## Description

Called to actually place the block, after the location is determined and all permission checks have been made.
