---
title: "InventoryBasic"
description: "Removes up to a specified number of items from an inventory slot and returns them in a new stack."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/InventoryBasic.html"
sourceType: javadoc
---

# InventoryBasic

## Class signature

```java
public class InventoryBasic extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryBasic(java.lang.String title, boolean customName, int slotCount)`
- `public InventoryBasic( IChatComponent title, int slotCount)`

## Methods

- `public void func_110134_a( IInvBasic p_110134_1_)`
- `public void func_110132_b( IInvBasic p_110132_1_)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack func_174894_a( ItemStack stack)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int getSizeInventory()`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String inventoryTitleIn)`
- `public IChatComponent getDisplayName()`
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
