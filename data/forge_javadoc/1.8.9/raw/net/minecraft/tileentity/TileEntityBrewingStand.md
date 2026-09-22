---
title: "TileEntityBrewingStand"
description: "public class TileEntityBrewingStand extends TileEntityLockable implements ITickable, ISidedInventory"
package: "net/minecraft/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityBrewingStand.html"
sourceType: javadoc
---

# TileEntityBrewingStand

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityBrewingStand

## Class signature

```java
public class TileEntityBrewingStand extends TileEntityLockable implements ITickable, ISidedInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)` — Returns true if automation can extract the given item in the given slot from the given side.
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)` — Returns true if automation can insert the given item in the given slot from the given side.
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `boolean[] func_174902_m()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `int[] getSlotsForFace(EnumFacing side)`
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void setName(java.lang.String name)`
- `void update()` — Like the old updateEntity(), except more generic.
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityBrewingStand`
