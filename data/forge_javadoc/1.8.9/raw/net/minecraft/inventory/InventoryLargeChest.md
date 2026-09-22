---
title: "InventoryLargeChest"
description: "public class InventoryLargeChest extends java.lang.Object implements ILockableContainer"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/InventoryLargeChest.html"
sourceType: javadoc
---

# InventoryLargeChest

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryLargeChest

## Class signature

```java
public class InventoryLargeChest extends java.lang.Object implements ILockableContainer
```

## Constructors

- `InventoryLargeChest(java.lang.String nameIn, ILockableContainer upperChestIn, ILockableContainer lowerChestIn)`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `LockCode getLockCode()`
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isLocked()`
- `boolean isPartOfLargeChest(IInventory inventoryIn)` — Return whether the given inventory is part of this large chest.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void setLockCode(LockCode code)`
