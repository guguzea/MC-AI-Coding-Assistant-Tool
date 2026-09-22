---
title: "InventoryPlayer"
description: "public class InventoryPlayer extends java.lang.Object implements IInventory"
package: "net/minecraft/entity/player"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/player/InventoryPlayer.html"
sourceType: javadoc
---

# InventoryPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.player.InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryPlayer(EntityPlayer playerIn)`

## Methods

- `boolean addItemStackToInventory(ItemStack itemStackIn)`
- `ItemStack armorItemInSlot(int slotIn)`
- `boolean canHarvestBlock(IBlockState state)`
- `void changeCurrentItem(int direction)`
- `void clear()`
- `int clearMatchingItems(Item itemIn, int metadataIn, int removeCount, NBTTagCompound itemNBT)`
- `void closeInventory(EntityPlayer player)`
- `void copyInventory(InventoryPlayer playerInventory)`
- `void damageArmor(float damage)`
- `void decrementAnimations()`
- `ItemStack decrStackSize(int index, int count)`
- `void deleteStack(ItemStack stack)`
- `void dropAllItems()`
- `int getBestHotbarSlot()`
- `ItemStack getCurrentItem()`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getFirstEmptyStack()`
- `static int getHotbarSize()`
- `int getInventoryStackLimit()`
- `ItemStack getItemStack()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `int getSlotFor(ItemStack stack)`
- `ItemStack getStackInSlot(int index)`
- `float getStrVsBlock(IBlockState state)`
- `boolean hasCustomName()`
- `boolean hasItemStack(ItemStack itemStackIn)`
- `static boolean isHotbar(int index)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `void pickItem(int index)`
- `void readFromNBT(NBTTagList nbtTagListIn)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setItemStack(ItemStack itemStackIn)`
- `void setPickedItemStack(ItemStack stack)`
- `NBTTagList writeToNBT(NBTTagList nbtTagListIn)`

## Fields

- `ItemStack [] armorInventory`
- `int currentItem`
- `boolean inventoryChanged`
- `ItemStack [] mainInventory`
- `ItemStack [] offHandInventory`
- `EntityPlayer player`
