---
title: "InventoryPlayer"
description: "public class InventoryPlayer extends java.lang.Object implements IInventory"
package: "net/minecraft/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/player/InventoryPlayer.html"
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
- `public void setPickedItemStack( ItemStack stack)`
- `public void pickItem(int index)`
- `public static boolean isHotbar(int index)`
- `public int getSlotFor( ItemStack stack)`
- `public int getBestHotbarSlot()`
- `public void changeCurrentItem(int direction)`
- `public int clearMatchingItems(@Nullable Item itemIn, int metadataIn, int removeCount, @Nullable NBTTagCompound itemNBT)`
- `public void decrementAnimations()`
- `public boolean addItemStackToInventory( ItemStack itemStackIn)`
- `public ItemStack decrStackSize(int index, int count)`
- `public void deleteStack( ItemStack stack)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public float getStrVsBlock( IBlockState state)`
- `public NBTTagList writeToNBT( NBTTagList nbtTagListIn)`
- `public void readFromNBT( NBTTagList nbtTagListIn)`
- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public ItemStack getStackInSlot(int index)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public ITextComponent getDisplayName()`
- `public int getInventoryStackLimit()`
- `public boolean canHarvestBlock( IBlockState state)`
- `public ItemStack armorItemInSlot(int slotIn)`
- `public void damageArmor(float damage)`
- `public void dropAllItems()`
- `public void markDirty()`
- `public void setItemStack( ItemStack itemStackIn)`
- `public ItemStack getItemStack()`
- `public boolean isUsableByPlayer( EntityPlayer player)`
- `public boolean hasItemStack( ItemStack itemStackIn)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void copyInventory( InventoryPlayer playerInventory)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
