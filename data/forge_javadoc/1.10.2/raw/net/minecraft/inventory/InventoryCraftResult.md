---
title: "InventoryCraftResult"
description: "public class InventoryCraftResult extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/InventoryCraftResult.html"
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
- `@Nullable public ItemStack getStackInSlot(int index)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public ITextComponent getDisplayName()`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
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
