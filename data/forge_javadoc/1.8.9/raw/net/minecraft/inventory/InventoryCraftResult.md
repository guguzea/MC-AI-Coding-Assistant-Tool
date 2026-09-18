---
title: "InventoryCraftResult"
description: "Removes up to a specified number of items from an inventory slot and returns them in a new stack."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/InventoryCraftResult.html"
sourceType: javadoc
---

# InventoryCraftResult

## Class signature

```java
public class InventoryCraftResult extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryCraftResult()`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int index)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public IChatComponent getDisplayName()`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int getInventoryStackLimit()`
- `public void markDirty()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`

## Description

Removes up to a specified number of items from an inventory slot and returns them in a new stack.
