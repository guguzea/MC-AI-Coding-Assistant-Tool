---
title: "InventoryBasic"
description: "public class InventoryBasic extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/InventoryBasic.html"
sourceType: javadoc
---

# InventoryBasic

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryBasic

## Class signature

```java
public class InventoryBasic extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryBasic(ITextComponent title, int slotCount)`
- `InventoryBasic(java.lang.String title, boolean customName, int slotCount)`

## Methods

- `void addInventoryChangeListener(IInventoryChangedListener listener)`
- `ItemStack addItem(ItemStack stack)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `void removeInventoryChangeListener(IInventoryChangedListener listener)`
- `ItemStack removeStackFromSlot(int index)`
- `void setCustomName(java.lang.String inventoryTitleIn)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
