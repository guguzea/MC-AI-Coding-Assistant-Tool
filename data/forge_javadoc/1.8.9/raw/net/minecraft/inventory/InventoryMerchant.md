---
title: "InventoryMerchant"
description: "Removes up to a specified number of items from an inventory slot and returns them in a new stack."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/InventoryMerchant.html"
sourceType: javadoc
---

# InventoryMerchant

## Class signature

```java
public class InventoryMerchant extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryMerchant( EntityPlayer thePlayerIn, IMerchant theMerchantIn)`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public IChatComponent getDisplayName()`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void markDirty()`
- `public void resetRecipeAndSlots()`
- `public MerchantRecipe getCurrentRecipe()`
- `public void setCurrentRecipeIndex(int currentRecipeIndexIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`

## Description

Removes up to a specified number of items from an inventory slot and returns them in a new stack.
