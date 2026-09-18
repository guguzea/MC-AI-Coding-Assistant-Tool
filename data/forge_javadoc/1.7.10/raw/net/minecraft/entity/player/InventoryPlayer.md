---
title: "InventoryPlayer"
description: "public class InventoryPlayer extends java.lang.Object implements IInventory"
package: "net/minecraft/entity/player"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/player/InventoryPlayer.html"
sourceType: javadoc
---

# InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryPlayer( EntityPlayer p_i1750_1_)`

## Methods

- `public ItemStack getCurrentItem()`
- `public static int getHotbarSize()`
- `public int getFirstEmptyStack()`
- `public void func_146030_a( Item p_146030_1_, int p_146030_2_, boolean p_146030_3_, boolean p_146030_4_)`
- `public int clearInventory( Item p_146027_1_, int p_146027_2_)`
- `public void changeCurrentItem(int p_70453_1_)`
- `public void func_70439_a( Item p_70439_1_, int p_70439_2_)`
- `public void decrementAnimations()`
- `public boolean consumeInventoryItem( Item p_146026_1_)`
- `public boolean hasItem( Item p_146028_1_)`
- `public boolean addItemStackToInventory( ItemStack p_70441_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public float func_146023_a( Block p_146023_1_)`
- `public NBTTagList writeToNBT( NBTTagList p_70442_1_)`
- `public void readFromNBT( NBTTagList p_70443_1_)`
- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public java.lang.String getInventoryName()`
- `public boolean hasCustomInventoryName()`
- `public int getInventoryStackLimit()`
- `public boolean func_146025_b( Block p_146025_1_)`
- `public ItemStack armorItemInSlot(int p_70440_1_)`
- `public int getTotalArmorValue()`
- `public void damageArmor(float p_70449_1_)`
- `public void dropAllItems()`
- `public void markDirty()`
- `public void setItemStack( ItemStack p_70437_1_)`
- `public ItemStack getItemStack()`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public boolean hasItemStack( ItemStack p_70431_1_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `public void copyInventory( InventoryPlayer p_70455_1_)`
