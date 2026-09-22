---
title: "Container"
description: "public abstract class Container extends java.lang.Object"
package: "net/minecraft/inventory"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/Container.html"
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

- `void addListener(IContainerListener listener)`
- `protected Slot addSlotToContainer(Slot slotIn)`
- `static int calcRedstone(TileEntity te)`
- `static int calcRedstoneFromInventory(IInventory inv)`
- `static boolean canAddItemToSlot(Slot slotIn, ItemStack stack, boolean stackSizeMatters)`
- `boolean canDragIntoSlot(Slot slotIn)`
- `abstract boolean canInteractWith(EntityPlayer playerIn)`
- `boolean canMergeSlot(ItemStack stack, Slot slotIn)`
- `static void computeStackSize(java.util.Set<Slot> dragSlotsIn, int dragModeIn, ItemStack stack, int slotStackSize)`
- `void detectAndSendChanges()`
- `boolean enchantItem(EntityPlayer playerIn, int id)`
- `static int extractDragMode(int eventButton)`
- `boolean getCanCraft(EntityPlayer player)`
- `static int getDragEvent(int clickedButton)`
- `java.util.List<ItemStack> getInventory()`
- `short getNextTransactionID(InventoryPlayer invPlayer)`
- `static int getQuickcraftMask(int p_94534_0_, int p_94534_1_)`
- `Slot getSlot(int slotId)`
- `Slot getSlotFromInventory(IInventory inv, int slotIn)`
- `static boolean isValidDragMode(int dragModeIn, EntityPlayer player)`
- `protected boolean mergeItemStack(ItemStack stack, int startIndex, int endIndex, boolean reverseDirection)`
- `void onContainerClosed(EntityPlayer playerIn)`
- `void onCraftMatrixChanged(IInventory inventoryIn)`
- `void putStackInSlot(int slotID, ItemStack stack)`
- `void putStacksInSlots(ItemStack [] stack)`
- `void removeListener(IContainerListener listener)`
- `protected void resetDrag()`
- `protected void retrySlotClick(int slotId, int clickedButton, boolean mode, EntityPlayer playerIn)`
- `void setCanCraft(EntityPlayer player, boolean canCraft)`
- `ItemStack slotClick(int slotId, int dragType, ClickType clickTypeIn, EntityPlayer player)`
- `ItemStack transferStackInSlot(EntityPlayer playerIn, int index)`
- `void updateProgressBar(int id, int data)`

## Fields

- `java.util.List<ItemStack> inventoryItemStacks`
- `java.util.List<Slot> inventorySlots`
- `protected java.util.List<IContainerListener> listeners`
- `int windowId`
