---
title: "IInventory"
description: "public interface IInventory extends IWorldNameable"
package: "net/minecraft/inventory"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/IInventory.html"
sourceType: javadoc
---

# IInventory

## Class signature

```java
public interface IInventory extends IWorldNameable
```

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
