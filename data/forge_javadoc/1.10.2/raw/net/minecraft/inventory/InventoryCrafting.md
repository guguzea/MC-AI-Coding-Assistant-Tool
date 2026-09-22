---
title: "InventoryCrafting"
description: "public class InventoryCrafting extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/InventoryCrafting.html"
sourceType: javadoc
---

# InventoryCrafting

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryCrafting

## Class signature

```java
public class InventoryCrafting extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryCrafting(Container eventHandlerIn, int width, int height)`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getHeight()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInRowAndColumn(int row, int column)`
- `ItemStack getStackInSlot(int index)`
- `int getWidth()`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
