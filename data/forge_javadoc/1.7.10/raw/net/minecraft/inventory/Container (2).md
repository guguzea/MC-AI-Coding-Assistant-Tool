---
title: "Container"
description: "public abstract class Container extends java.lang.Object"
package: "net/minecraft/inventory"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/inventory/Container.html"
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

- `protected Slot addSlotToContainer( Slot p_75146_1_)`
- `public void addCraftingToCrafters( ICrafting p_75132_1_)`
- `public java.util.List getInventory()`
- `public void removeCraftingFromCrafters( ICrafting p_82847_1_)`
- `public void detectAndSendChanges()`
- `public boolean enchantItem( EntityPlayer p_75140_1_, int p_75140_2_)`
- `public Slot getSlotFromInventory( IInventory p_75147_1_, int p_75147_2_)`
- `public Slot getSlot(int p_75139_1_)`
- `public ItemStack transferStackInSlot( EntityPlayer p_82846_1_, int p_82846_2_)`
- `public ItemStack slotClick(int p_75144_1_, int p_75144_2_, int p_75144_3_, EntityPlayer p_75144_4_)`
- `public boolean func_94530_a( ItemStack p_94530_1_, Slot p_94530_2_)`
- `protected void retrySlotClick(int p_75133_1_, int p_75133_2_, boolean p_75133_3_, EntityPlayer p_75133_4_)`
- `public void onContainerClosed( EntityPlayer p_75134_1_)`
- `public void onCraftMatrixChanged( IInventory p_75130_1_)`
- `public void putStackInSlot(int p_75141_1_, ItemStack p_75141_2_)`
- `public void putStacksInSlots( ItemStack [] p_75131_1_)`
- `public void updateProgressBar(int p_75137_1_, int p_75137_2_)`
- `public short getNextTransactionID( InventoryPlayer p_75136_1_)`
- `public boolean isPlayerNotUsingContainer( EntityPlayer p_75129_1_)`
- `public void setPlayerIsPresent( EntityPlayer p_75128_1_, boolean p_75128_2_)`
- `public abstract boolean canInteractWith( EntityPlayer p_75145_1_)`
- `protected boolean mergeItemStack( ItemStack p_75135_1_, int p_75135_2_, int p_75135_3_, boolean p_75135_4_)`
- `public static int func_94529_b(int p_94529_0_)`
- `public static int func_94532_c(int p_94532_0_)`
- `public static int func_94534_d(int p_94534_0_, int p_94534_1_)`
- `public static boolean func_94528_d(int p_94528_0_)`
- `protected void func_94533_d()`
- `public static boolean func_94527_a( Slot p_94527_0_, ItemStack p_94527_1_, boolean p_94527_2_)`
- `public static void func_94525_a(java.util.Set p_94525_0_, int p_94525_1_, ItemStack p_94525_2_, int p_94525_3_)`
- `public boolean canDragIntoSlot( Slot p_94531_1_)`
- `public static int calcRedstoneFromInventory( IInventory p_94526_0_)`
