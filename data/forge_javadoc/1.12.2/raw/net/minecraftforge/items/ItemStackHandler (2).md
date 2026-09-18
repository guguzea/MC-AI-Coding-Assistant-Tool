---
title: "ItemStackHandler"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/items/ItemStackHandler.html"
sourceType: javadoc
---

# ItemStackHandler

## Class signature

```java
public class ItemStackHandler extends java.lang.Object implements IItemHandler , IItemHandlerModifiable , INBTSerializable < NBTTagCompound >
```

## Constructors

- `public ItemStackHandler()`
- `public ItemStackHandler(int size)`
- `public ItemStackHandler( NonNullList < ItemStack > stacks)`

## Methods

- `public void setSize(int size)`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public int getSlotLimit(int slot)`
- `protected int getStackLimit(int slot, ItemStack stack)`
- `public boolean isItemValid(int slot, ItemStack stack)`
- `public NBTTagCompound serializeNBT()`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `protected void validateSlotIndex(int slot)`
- `protected void onLoad()`
- `protected void onContentsChanged(int slot)`

## Description

Extracts an ItemStack from the given slot.
