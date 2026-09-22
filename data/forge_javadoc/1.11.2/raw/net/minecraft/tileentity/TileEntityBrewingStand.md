---
title: "TileEntityBrewingStand"
description: "public class TileEntityBrewingStand extends TileEntityLockable implements ITickable, ISidedInventory"
package: "net/minecraft/tileentity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityBrewingStand.html"
sourceType: javadoc
---

# TileEntityBrewingStand

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityBrewingStand

## Class signature

```java
public class TileEntityBrewingStand extends TileEntityLockable implements ITickable, ISidedInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `boolean[] createFilledSlotsArray()`
- `ItemStack decrStackSize(int index, int count)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `int[] getSlotsForFace(EnumFacing side)`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isEmpty()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixesBrewingStand(DataFixer fixer)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setName(java.lang.String name)`
- `void update()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityBrewingStand`
