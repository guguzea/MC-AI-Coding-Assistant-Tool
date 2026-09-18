---
title: "ItemHandlerHelper"
description: "This method uses the standard vanilla algorithm to calculate a comparator output for how \"full\" the inventory is."
package: "net/minecraftforge/items"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/items/ItemHandlerHelper.html"
sourceType: javadoc
---

# ItemHandlerHelper

## Class signature

```java
public class ItemHandlerHelper extends java.lang.Object
```

## Constructors

- `public ItemHandlerHelper()`

## Methods

- `public static ItemStack insertItem( IItemHandler dest, ItemStack stack, boolean simulate)`
- `public static boolean canItemStacksStack( ItemStack a, ItemStack b)`
- `public static boolean canItemStacksStackRelaxed( ItemStack a, ItemStack b)`
- `public static ItemStack copyStackWithSize( ItemStack itemStack, int size)`
- `public static ItemStack insertItemStacked( IItemHandler inventory, ItemStack stack, boolean simulate)`
- `public static void giveItemToPlayer( EntityPlayer player, ItemStack stack)`
- `public static void giveItemToPlayer( EntityPlayer player, ItemStack stack, int preferredSlot)`
- `public static int calcRedstoneFromInventory( IItemHandler inv)`

## Description

This method uses the standard vanilla algorithm to calculate a comparator output for how "full" the inventory is.
