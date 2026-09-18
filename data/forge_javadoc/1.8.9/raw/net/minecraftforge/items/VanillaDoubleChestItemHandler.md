---
title: "VanillaDoubleChestItemHandler"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/items/VanillaDoubleChestItemHandler.html"
sourceType: javadoc
---

# VanillaDoubleChestItemHandler

## Class signature

```java
public class VanillaDoubleChestItemHandler extends java.lang.ref.WeakReference< TileEntityChest > implements IItemHandler
```

## Constructors

- `public VanillaDoubleChestItemHandler( TileEntityChest mainChest, TileEntityChest other, boolean mainChestIsUpper)`

## Methods

- `public static VanillaDoubleChestItemHandler get( TileEntityChest chest)`
- `public TileEntityChest getChest(boolean accessingUpper)`
- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public boolean equals(java.lang.Object o)`
- `public int hashCode()`
- `public boolean needsRefresh()`

## Description

Extracts an ItemStack from the given slot.
