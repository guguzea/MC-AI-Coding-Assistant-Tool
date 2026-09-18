---
title: "TileEntityBrewingStand"
description: "Returns true if automation can extract the given item in the given slot from the given side."
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityBrewingStand.html"
sourceType: javadoc
---

# TileEntityBrewingStand

## Class signature

```java
public class TileEntityBrewingStand extends TileEntityLockable implements ITickable , ISidedInventory
```

## Constructors

- `public TileEntityBrewingStand()`

## Methods

- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setName(java.lang.String name)`
- `public int getSizeInventory()`
- `public void update()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public boolean[] func_174902_m()`
- `public int[] getSlotsForFace( EnumFacing side)`
- `public boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `public boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Returns true if automation can extract the given item in the given slot from the given side.
