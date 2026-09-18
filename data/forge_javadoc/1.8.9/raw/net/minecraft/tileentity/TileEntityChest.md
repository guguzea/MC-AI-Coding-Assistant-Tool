---
title: "TileEntityChest"
description: "Determines if the check for adjacent chests has taken place."
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityChest.html"
sourceType: javadoc
---

# TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntityLockable implements ITickable , IInventory
```

## Constructors

- `public TileEntityChest()`
- `public TileEntityChest(int chestType)`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String name)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void updateContainingBlockInfo()`
- `public void checkForAdjacentChests()`
- `protected TileEntityChest getAdjacentChest( EnumFacing side)`
- `public void update()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void invalidate()`
- `public int getChestType()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public IItemHandler getSingleChestHandler()`

## Description

Determines if the check for adjacent chests has taken place.
