---
title: "InventoryCrafting"
description: "public class InventoryCrafting extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/inventory/InventoryCrafting.html"
sourceType: javadoc
---

# InventoryCrafting

## Class signature

```java
public class InventoryCrafting extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryCrafting( Container eventHandlerIn, int width, int height)`

## Methods

- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack getStackInRowAndColumn(int row, int column)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public ITextComponent getDisplayName()`
- `public ItemStack removeStackFromSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
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
- `public int getHeight()`
- `public int getWidth()`
- `public void fillStackedContents( RecipeItemHelper helper)`
