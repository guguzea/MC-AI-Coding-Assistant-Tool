---
title: "TileEntityFurnace"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityFurnace.html"
sourceType: javadoc
---

# TileEntityFurnace

## Class signature

```java
public class TileEntityFurnace extends TileEntityLockable implements ITickable , ISidedInventory
```

## Constructors

- `public TileEntityFurnace()`

## Methods

- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setCustomInventoryName(java.lang.String p_145951_1_)`
- `public static void registerFixesFurnace( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public boolean isBurning()`
- `public static boolean isBurning( IInventory inventory)`
- `public void update()`
- `public int getCookTime( ItemStack stack)`
- `public void smeltItem()`
- `public static int getItemBurnTime( ItemStack stack)`
- `public static boolean isItemFuel( ItemStack stack)`
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
- `public int getFieldCount()`
- `public void clear()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
