---
title: "VanillaDoubleChestItemHandler"
description: "public class VanillaDoubleChestItemHandler extends java.lang.ref.WeakReference<TileEntityChest> implements IItemHandlerModifiable"
package: "net/minecraftforge/items"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/VanillaDoubleChestItemHandler.html"
sourceType: javadoc
---

# VanillaDoubleChestItemHandler

**Inheritance:** java.lang.Object → java.lang.ref.Reference<T> → java.lang.ref.WeakReference<TileEntityChest> → net.minecraftforge.items.VanillaDoubleChestItemHandler

## Class signature

```java
public class VanillaDoubleChestItemHandler extends java.lang.ref.WeakReference<TileEntityChest> implements IItemHandlerModifiable
```

## Constructors

- `VanillaDoubleChestItemHandler(TileEntityChest mainChest, TileEntityChest other, boolean mainChestIsUpper)`

## Methods

- `boolean equals(java.lang.Object o)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `static VanillaDoubleChestItemHandler get(TileEntityChest chest)`
- `TileEntityChest getChest(boolean accessingUpper)`
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `int hashCode()`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `boolean needsRefresh()`
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.

## Fields

- `static VanillaDoubleChestItemHandler NO_ADJACENT_CHESTS_INSTANCE`
