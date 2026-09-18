---
title: "ItemHandlerHelper"
description: "A relaxed version of canItemStacksStack that stacks itemstacks with different metadata if they don't have subtypes."
package: "net/minecraftforge/items"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/items/ItemHandlerHelper.html"
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

## Description

A relaxed version of canItemStacksStack that stacks itemstacks with different metadata if they don't have subtypes.
