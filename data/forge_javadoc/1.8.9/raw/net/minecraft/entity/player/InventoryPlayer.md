---
title: "InventoryPlayer"
description: "An array of 4 item stacks containing the currently worn armor pieces."
package: "net/minecraft/entity/player"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/player/InventoryPlayer.html"
sourceType: javadoc
---

# InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryPlayer( EntityPlayer playerIn)`

## Methods

- `public ItemStack getCurrentItem()`
- `public static int getHotbarSize()`
- `public int getFirstEmptyStack()`
- `public void setCurrentItem( Item itemIn, int p_146030_2_, boolean p_146030_3_, boolean p_146030_4_)`
- `public int clearMatchingItems( Item itemIn, int metadataIn, int removeCount, NBTTagCompound itemNBT)`
- `public void changeCurrentItem(int p_70453_1_)`
- `public void decrementAnimations()`
- `public boolean consumeInventoryItem( Item itemIn)`
- `public boolean hasItem( Item itemIn)`
- `public boolean addItemStackToInventory( ItemStack itemStackIn)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public float getStrVsBlock( Block blockIn)`
- `public NBTTagList writeToNBT( NBTTagList p_70442_1_)`
- `public void readFromNBT( NBTTagList p_70443_1_)`
- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int index)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public IChatComponent getDisplayName()`
- `public int getInventoryStackLimit()`
- `public boolean canHeldItemHarvest( Block blockIn)`
- `public ItemStack armorItemInSlot(int p_70440_1_)`
- `public int getTotalArmorValue()`
- `public void damageArmor(float damage)`
- `public void dropAllItems()`
- `public void markDirty()`
- `public void setItemStack( ItemStack itemStackIn)`
- `public ItemStack getItemStack()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public boolean hasItemStack( ItemStack itemStackIn)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void copyInventory( InventoryPlayer playerInventory)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`

## Description

An array of 4 item stacks containing the currently worn armor pieces.
