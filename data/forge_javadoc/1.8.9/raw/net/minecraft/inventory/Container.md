---
title: "Container"
description: "public abstract class Container extends java.lang.Object"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/Container.html"
sourceType: javadoc
---

# Container

**Inheritance:** java.lang.Object → net.minecraft.inventory.Container

## Class signature

```java
public abstract class Container extends java.lang.Object
```

## Constructors

- `Container()`

## Methods

- `protected Slot addSlotToContainer(Slot slotIn)` — Adds an item slot to this container
- `static int calcRedstone(TileEntity te)` — Like the version that takes an inventory.
- `static int calcRedstoneFromInventory(IInventory inv)`
- `static boolean canAddItemToSlot(Slot slotIn, ItemStack stack, boolean stackSizeMatters)` — Checks if it's possible to add the given itemstack to the given slot.
- `boolean canDragIntoSlot(Slot p_94531_1_)` — Returns true if the player can "drag-spilt" items into this slot,. returns true by default.
- `abstract boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot p_94530_2_)` — Called to determine if the current slot is valid for the stack merging (double-click) code.
- `static void computeStackSize(java.util.Set<Slot> p_94525_0_, int p_94525_1_, ItemStack p_94525_2_, int p_94525_3_)` — Compute the new stack size, Returns the stack with the new size.
- `void detectAndSendChanges()` — Looks for changes made in the container, sends them to every listener.
- `boolean enchantItem(EntityPlayer playerIn, int id)` — Handles the given Button-click on the server, currently only used by enchanting.
- `static int extractDragMode(int p_94529_0_)` — Extracts the drag mode.
- `static int func_94534_d(int p_94534_0_, int p_94534_1_)`
- `boolean getCanCraft(EntityPlayer p_75129_1_)` — gets whether or not the player can craft in this inventory or not
- `static int getDragEvent(int p_94532_0_)` — Args : clickedButton, Returns (0 : start drag, 1 : add slot, 2 : end drag)
- `java.util.List<ItemStack> getInventory()`
- `short getNextTransactionID(InventoryPlayer p_75136_1_)` — Gets a unique transaction ID.
- `Slot getSlot(int slotId)`
- `Slot getSlotFromInventory(IInventory inv, int slotIn)`
- `static boolean isValidDragMode(int dragModeIn, EntityPlayer player)`
- `protected boolean mergeItemStack(ItemStack stack, int startIndex, int endIndex, boolean reverseDirection)` — Merges provided ItemStack with the first avaliable one in the container/player inventor between minIndex (included) and maxIndex (excluded).
- `void onContainerClosed(EntityPlayer playerIn)` — Called when the container is closed.
- `void onCraftGuiOpened(ICrafting listener)`
- `void onCraftMatrixChanged(IInventory inventoryIn)` — Callback for when the crafting matrix is changed.
- `void putStackInSlot(int slotID, ItemStack stack)` — args: slotID, itemStack to put in slot
- `void putStacksInSlots(ItemStack [] p_75131_1_)` — places itemstacks in first x slots, x being aitemstack.lenght
- `void removeCraftingFromCrafters(ICrafting listeners)` — Remove the given Listener.
- `protected void resetDrag()` — Reset the drag fields
- `protected void retrySlotClick(int slotId, int clickedButton, boolean mode, EntityPlayer playerIn)` — Retries slotClick() in case of failure
- `void setCanCraft(EntityPlayer p_75128_1_, boolean p_75128_2_)` — sets whether the player can craft in this inventory or not
- `ItemStack slotClick(int slotId, int clickedButton, int mode, EntityPlayer playerIn)` — Handles slot click.
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)` — Take a stack from the specified inventory slot.
- `void updateProgressBar(int id, int data)`

## Fields

- `protected java.util.List<ICrafting> crafters`
- `java.util.List<ItemStack> inventoryItemStacks`
- `java.util.List<Slot> inventorySlots`
- `int windowId`
