---
title: "TileEntityHopper"
description: "public class TileEntityHopper extends TileEntityLockable implements IHopper, ITickable"
package: "net/minecraft/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityHopper.html"
sourceType: javadoc
---

# TileEntityHopper

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityHopper

## Class signature

```java
public class TileEntityHopper extends TileEntityLockable implements IHopper, ITickable
```

## Methods

- `static boolean captureDroppedItems(IHopper p_145891_0_)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected IItemHandler createUnSidedHandler()`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `static java.util.List<EntityItem> func_181556_a(World p_181556_0_, double p_181556_1_, double p_181556_3_, double p_181556_5_)`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `static IInventory getHopperInventory(IHopper hopper)` — Returns the IInventory for the specified hopper
- `static IInventory getInventoryAtPosition(World worldIn, double x, double y, double z)` — Returns the IInventory (if applicable) of the TileEntity at the specified position
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `double getXPos()` — Gets the world X position for this hopper entity.
- `double getYPos()` — Gets the world Y position for this hopper entity.
- `double getZPos()` — Gets the world Z position for this hopper entity.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isOnTransferCooldown()`
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `boolean mayTransfer()`
- `void openInventory(EntityPlayer player)`
- `static boolean putDropInInventoryAllSlots(IInventory p_145898_0_, EntityItem itemIn)` — Attempts to place the passed EntityItem's stack into the inventory using as many slots as possible.
- `static ItemStack putStackInInventoryAllSlots(IInventory inventoryIn, ItemStack stack, EnumFacing side)` — Attempts to place the passed stack in the inventory, using as many slots as required.
- `void readFromNBT(NBTTagCompound compound)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setCustomName(java.lang.String customNameIn)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void setTransferCooldown(int ticks)`
- `void update()` — Like the old updateEntity(), except more generic.
- `boolean updateHopper()`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityHopper`
