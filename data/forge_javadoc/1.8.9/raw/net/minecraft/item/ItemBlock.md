---
title: "ItemBlock"
description: "gets the CreativeTab this item is displayed on"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemBlock.html"
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
- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public static boolean setTileEntityNBT( World worldIn, EntityPlayer pos, BlockPos stack, ItemStack p_179224_3_)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public java.lang.String getUnlocalizedName()`
- `public CreativeTabs getCreativeTab()`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public Block getBlock()`
- `public boolean placeBlockAt( ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)`

## Description

gets the CreativeTab this item is displayed on
