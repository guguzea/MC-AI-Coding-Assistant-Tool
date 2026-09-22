---
title: "InventoryLargeChest"
description: "public class InventoryLargeChest extends java.lang.Object implements ILockableContainer"
package: "net/minecraft/inventory"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/InventoryLargeChest.html"
sourceType: javadoc
---

# InventoryLargeChest

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryLargeChest

## Class signature

```java
public class InventoryLargeChest extends java.lang.Object implements ILockableContainer
```

## Constructors

- `InventoryLargeChest(java.lang.String nameIn, ILockableContainer upperChestIn, ILockableContainer lowerChestIn)`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `LockCode getLockCode()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isLocked()`
- `boolean isPartOfLargeChest(IInventory inventoryIn)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setLockCode(LockCode code)`
