---
title: "Container"
description: "public abstract class Container extends java.lang.Object"
package: "net/minecraft/inventory"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/Container.html"
sourceType: javadoc
---

# Container

## Class signature

```java
public abstract class Container extends java.lang.Object
```

## Constructors

- `public Container()`

## Methods

- `protected Slot addSlotToContainer( Slot slotIn)`
- `public void addListener( IContainerListener listener)`
- `public java.util.List< ItemStack > getInventory()`
- `public void removeListener( IContainerListener listener)`
- `public void detectAndSendChanges()`
- `public boolean enchantItem( EntityPlayer playerIn, int id)`
- `@Nullable public Slot getSlotFromInventory( IInventory inv, int slotIn)`
- `public Slot getSlot(int slotId)`
- `@Nullable public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `@Nullable public ItemStack slotClick(int slotId, int dragType, ClickType clickTypeIn, EntityPlayer player)`
- `public boolean canMergeSlot( ItemStack stack, Slot slotIn)`
- `protected void retrySlotClick(int slotId, int clickedButton, boolean mode, EntityPlayer playerIn)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public void putStackInSlot(int slotID, ItemStack stack)`
- `public void putStacksInSlots( ItemStack [] stack)`
- `public void updateProgressBar(int id, int data)`
- `public short getNextTransactionID( InventoryPlayer invPlayer)`
- `public boolean getCanCraft( EntityPlayer player)`
- `public void setCanCraft( EntityPlayer player, boolean canCraft)`
- `public abstract boolean canInteractWith( EntityPlayer playerIn)`
- `protected boolean mergeItemStack( ItemStack stack, int startIndex, int endIndex, boolean reverseDirection)`
- `public static int extractDragMode(int eventButton)`
- `public static int getDragEvent(int clickedButton)`
- `public static int getQuickcraftMask(int p_94534_0_, int p_94534_1_)`
- `public static boolean isValidDragMode(int dragModeIn, EntityPlayer player)`
- `protected void resetDrag()`
- `public static boolean canAddItemToSlot( Slot slotIn, ItemStack stack, boolean stackSizeMatters)`
- `public static void computeStackSize(java.util.Set< Slot > dragSlotsIn, int dragModeIn, ItemStack stack, int slotStackSize)`
- `public boolean canDragIntoSlot( Slot slotIn)`
- `public static int calcRedstone(@Nullable TileEntity te)`
- `public static int calcRedstoneFromInventory(@Nullable IInventory inv)`
