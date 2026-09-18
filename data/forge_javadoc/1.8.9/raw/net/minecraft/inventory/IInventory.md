---
title: "IInventory"
description: "Removes up to a specified number of items from an inventory slot and returns them in a new stack."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/IInventory.html"
sourceType: javadoc
---

# IInventory

## Class signature

```java
public interface IInventory extends IWorldNameable
```

## Methods

- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `ItemStack decrStackSize(int index, int count)`
- `ItemStack removeStackFromSlot(int index)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `int getInventoryStackLimit()`
- `void markDirty()`
- `boolean isUseableByPlayer( EntityPlayer player)`
- `void openInventory( EntityPlayer player)`
- `void closeInventory( EntityPlayer player)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `int getField(int id)`
- `void setField(int id, int value)`
- `int getFieldCount()`
- `void clear()`

## Description

Removes up to a specified number of items from an inventory slot and returns them in a new stack.
