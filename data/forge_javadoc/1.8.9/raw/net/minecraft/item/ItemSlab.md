---
title: "ItemSlab"
description: "Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks)."
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemSlab.html"
sourceType: javadoc
---

# ItemSlab

## Class signature

```java
public class ItemSlab extends ItemBlock
```

## Constructors

- `public ItemSlab( Block block, BlockSlab singleSlab, BlockSlab doubleSlab)`

## Methods

- `public int getMetadata(int damage)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
