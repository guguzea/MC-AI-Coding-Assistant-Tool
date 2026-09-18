---
title: "IInventory"
description: "public interface IInventory extends IWorldNameable"
package: "net/minecraft/inventory"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/IInventory.html"
sourceType: javadoc
---

# IInventory

## Class signature

```java
public interface IInventory extends IWorldNameable
```

## Methods

- `int getSizeInventory()`
- `@Nullable ItemStack getStackInSlot(int index)`
- `@Nullable ItemStack decrStackSize(int index, int count)`
- `@Nullable ItemStack removeStackFromSlot(int index)`
- `void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `int getInventoryStackLimit()`
- `void markDirty()`
- `boolean isUseableByPlayer( EntityPlayer player)`
- `void openInventory( EntityPlayer player)`
- `void closeInventory( EntityPlayer player)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `int getField(int id)`
- `void setField(int id, int value)`
- `int getFieldCount()`
- `void clear()`
