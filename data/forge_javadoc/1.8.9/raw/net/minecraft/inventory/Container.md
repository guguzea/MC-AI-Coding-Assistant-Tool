---
title: "Container"
description: "Adds an item slot to this container"
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/Container.html"
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
- `public void onCraftGuiOpened( ICrafting listener)`
- `public java.util.List< ItemStack > getInventory()`
- `public void removeCraftingFromCrafters( ICrafting listeners)`
- `public void detectAndSendChanges()`
- `public boolean enchantItem( EntityPlayer playerIn, int id)`
- `public Slot getSlotFromInventory( IInventory inv, int slotIn)`
- `public Slot getSlot(int slotId)`
- `public ItemStack transferStackInSlot( EntityPlayer playerIn, int index)`
- `public ItemStack slotClick(int slotId, int clickedButton, int mode, EntityPlayer playerIn)`
- `public boolean canMergeSlot( ItemStack stack, Slot p_94530_2_)`
- `protected void retrySlotClick(int slotId, int clickedButton, boolean mode, EntityPlayer playerIn)`
- `public void onContainerClosed( EntityPlayer playerIn)`
- `public void onCraftMatrixChanged( IInventory inventoryIn)`
- `public void putStackInSlot(int slotID, ItemStack stack)`
- `public void putStacksInSlots( ItemStack [] p_75131_1_)`
- `public void updateProgressBar(int id, int data)`
- `public short getNextTransactionID( InventoryPlayer p_75136_1_)`
- `public boolean getCanCraft( EntityPlayer p_75129_1_)`
- `public void setCanCraft( EntityPlayer p_75128_1_, boolean p_75128_2_)`
- `public abstract boolean canInteractWith( EntityPlayer playerIn)`
- `protected boolean mergeItemStack( ItemStack stack, int startIndex, int endIndex, boolean reverseDirection)`
- `public static int extractDragMode(int p_94529_0_)`
- `public static int getDragEvent(int p_94532_0_)`
- `public static int func_94534_d(int p_94534_0_, int p_94534_1_)`
- `public static boolean isValidDragMode(int dragModeIn, EntityPlayer player)`
- `protected void resetDrag()`
- `public static boolean canAddItemToSlot( Slot slotIn, ItemStack stack, boolean stackSizeMatters)`
- `public static void computeStackSize(java.util.Set< Slot > p_94525_0_, int p_94525_1_, ItemStack p_94525_2_, int p_94525_3_)`
- `public boolean canDragIntoSlot( Slot p_94531_1_)`
- `public static int calcRedstone( TileEntity te)`
- `public static int calcRedstoneFromInventory( IInventory inv)`

## Description

Adds an item slot to this container
