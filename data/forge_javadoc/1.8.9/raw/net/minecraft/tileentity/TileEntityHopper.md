---
title: "TileEntityHopper"
description: "Removes up to a specified number of items from an inventory slot and returns them in a new stack."
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityHopper.html"
sourceType: javadoc
---

# TileEntityHopper

## Class signature

```java
public class TileEntityHopper extends TileEntityLockable implements IHopper , ITickable
```

## Constructors

- `public TileEntityHopper()`

## Methods

- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public void markDirty()`
- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String customNameIn)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void update()`
- `public boolean updateHopper()`
- `public static boolean captureDroppedItems( IHopper p_145891_0_)`
- `public static boolean putDropInInventoryAllSlots( IInventory p_145898_0_, EntityItem itemIn)`
- `public static ItemStack putStackInInventoryAllSlots( IInventory inventoryIn, ItemStack stack, EnumFacing side)`
- `public static IInventory getHopperInventory( IHopper hopper)`
- `public static java.util.List< EntityItem > func_181556_a( World p_181556_0_, double p_181556_1_, double p_181556_3_, double p_181556_5_)`
- `public static IInventory getInventoryAtPosition( World worldIn, double x, double y, double z)`
- `public double getXPos()`
- `public double getYPos()`
- `public double getZPos()`
- `public void setTransferCooldown(int ticks)`
- `public boolean isOnTransferCooldown()`
- `public boolean mayTransfer()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `protected IItemHandler createUnSidedHandler()`

## Description

Removes up to a specified number of items from an inventory slot and returns them in a new stack.
