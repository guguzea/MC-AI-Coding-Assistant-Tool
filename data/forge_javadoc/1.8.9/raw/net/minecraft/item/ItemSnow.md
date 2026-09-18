---
title: "ItemSnow"
description: "Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks)."
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemSnow.html"
sourceType: javadoc
---

# ItemSnow

## Class signature

```java
public class ItemSnow extends ItemBlock
```

## Constructors

- `public ItemSnow( Block block)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public int getMetadata(int damage)`
- `public boolean canPlaceBlockOnSide( World world, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
