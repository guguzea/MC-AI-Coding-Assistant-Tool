---
title: "InventoryBasic"
description: "public class InventoryBasic extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/inventory/InventoryBasic.html"
sourceType: javadoc
---

# InventoryBasic

## Class signature

```java
public class InventoryBasic extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryBasic(java.lang.String title, boolean customName, int slotCount)`
- `public InventoryBasic( ITextComponent title, int slotCount)`

## Methods

- `public void addInventoryChangeListener( IInventoryChangedListener listener)`
- `public void removeInventoryChangeListener( IInventoryChangedListener listener)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack addItem( ItemStack stack)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String inventoryTitleIn)`
- `public ITextComponent getDisplayName()`
- `public int getInventoryStackLimit()`
- `public void markDirty()`
- `public boolean isUsableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
