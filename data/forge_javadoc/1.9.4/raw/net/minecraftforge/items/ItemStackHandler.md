---
title: "ItemStackHandler"
description: "public class ItemStackHandler extends java.lang.Object implements IItemHandler, IItemHandlerModifiable, INBTSerializable<NBTTagCompound>"
package: "net/minecraftforge/items"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/ItemStackHandler.html"
sourceType: javadoc
---

# ItemStackHandler

**Inheritance:** java.lang.Object → net.minecraftforge.items.ItemStackHandler

## Class signature

```java
public class ItemStackHandler extends java.lang.Object implements IItemHandler, IItemHandlerModifiable, INBTSerializable<NBTTagCompound>
```

## Constructors

- `ItemStackHandler()`
- `ItemStackHandler(int size)`
- `ItemStackHandler(ItemStack [] stacks)`

## Methods

- `void deserializeNBT(NBTTagCompound nbt)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `protected int getStackLimit(int slot, ItemStack stack)`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `protected void onContentsChanged(int slot)`
- `protected void onLoad()`
- `NBTTagCompound serializeNBT()`
- `void setSize(int size)`
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.
- `protected void validateSlotIndex(int slot)`

## Fields

- `protected ItemStack [] stacks`
