---
title: "VanillaDoubleChestItemHandler"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/VanillaDoubleChestItemHandler.html"
sourceType: javadoc
---

# VanillaDoubleChestItemHandler

## Class signature

```java
public class VanillaDoubleChestItemHandler extends java.lang.ref.WeakReference< TileEntityChest > implements IItemHandlerModifiable
```

## Constructors

- `public VanillaDoubleChestItemHandler(@Nullable TileEntityChest mainChest, @Nullable TileEntityChest other, boolean mainChestIsUpper)`

## Methods

- `@Nullable public static VanillaDoubleChestItemHandler get( TileEntityChest chest)`
- `@Nullable public TileEntityChest getChest(boolean accessingUpper)`
- `public int getSlots()`
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public int getSlotLimit(int slot)`
- `public boolean equals(java.lang.Object o)`
- `public int hashCode()`
- `public boolean needsRefresh()`

## Description

Extracts an ItemStack from the given slot.
