---
title: "InventoryBasic"
description: "public class InventoryBasic extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/InventoryBasic.html"
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
- `@Nullable public ItemStack getStackInSlot(int index)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack addItem( ItemStack stack)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public int getSizeInventory()`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String inventoryTitleIn)`
- `public ITextComponent getDisplayName()`
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
