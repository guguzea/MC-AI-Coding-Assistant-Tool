---
title: "IItemHandler"
description: "public interface IItemHandler"
package: "net/minecraftforge/items"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/items/IItemHandler.html"
sourceType: javadoc
---

# IItemHandler

## Class signature

```java
public interface IItemHandler
```

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlotLimit(int slot)` — Retrieves the maximum stack size allowed to exist in the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `default boolean isItemValid(int slot, ItemStack stack)` — This function re-implements the vanilla function IInventory.isItemValidForSlot(int, ItemStack) .
