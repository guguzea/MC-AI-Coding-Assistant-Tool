---
title: "InventoryLargeChest"
description: "Removes up to a specified number of items from an inventory slot and returns them in a new stack."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/InventoryLargeChest.html"
sourceType: javadoc
---

# InventoryLargeChest

## Class signature

```java
public class InventoryLargeChest extends java.lang.Object implements ILockableContainer
```

## Constructors

- `public InventoryLargeChest(java.lang.String nameIn, ILockableContainer upperChestIn, ILockableContainer lowerChestIn)`

## Methods

- `public int getSizeInventory()`
- `public boolean isPartOfLargeChest( IInventory inventoryIn)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public IChatComponent getDisplayName()`
- `public ItemStack getStackInSlot(int index)`
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
- `public boolean isLocked()`
- `public void setLockCode( LockCode code)`
- `public LockCode getLockCode()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public void clear()`

## Description

Removes up to a specified number of items from an inventory slot and returns them in a new stack.
