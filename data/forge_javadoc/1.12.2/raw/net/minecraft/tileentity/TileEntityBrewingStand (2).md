---
title: "TileEntityBrewingStand"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityBrewingStand.html"
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
- `public boolean isEmpty()`
- `public void update()`
- `public boolean[] createFilledSlotsArray()`
- `public static void registerFixesBrewingStand( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int getInventoryStackLimit()`
- `public boolean isUsableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public int[] getSlotsForFace( EnumFacing side)`
- `public boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `public boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public int getFieldCount()`
- `public void clear()`

## Description

Retrieves the handler for the capability requested on the specific side.
