---
title: "TileEntityDispenser"
description: "public class TileEntityDispenser extends TileEntityLockableLoot implements IInventory"
package: "net/minecraft/tileentity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/tileentity/TileEntityDispenser.html"
sourceType: javadoc
---

# TileEntityDispenser

## Class signature

```java
public class TileEntityDispenser extends TileEntityLockableLoot implements IInventory
```

## Constructors

- `public TileEntityDispenser()`

## Methods

- `public int getSizeInventory()`
- `@Nullable public ItemStack getStackInSlot(int index)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public int getDispenseSlot()`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public int addItemStack( ItemStack stack)`
- `public java.lang.String getName()`
- `public void setCustomName(java.lang.String customName)`
- `public boolean hasCustomName()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
