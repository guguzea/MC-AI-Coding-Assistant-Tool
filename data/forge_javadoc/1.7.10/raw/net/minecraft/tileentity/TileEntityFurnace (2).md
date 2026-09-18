---
title: "TileEntityFurnace"
description: "public class TileEntityFurnace extends TileEntity implements ISidedInventory"
package: "net/minecraft/tileentity"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/tileentity/TileEntityFurnace.html"
sourceType: javadoc
---

# TileEntityFurnace

## Class signature

```java
public class TileEntityFurnace extends TileEntity implements ISidedInventory
```

## Constructors

- `public TileEntityFurnace()`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public java.lang.String getInventoryName()`
- `public boolean hasCustomInventoryName()`
- `public void func_145951_a(java.lang.String p_145951_1_)`
- `public void readFromNBT( NBTTagCompound p_145839_1_)`
- `public void writeToNBT( NBTTagCompound p_145841_1_)`
- `public int getInventoryStackLimit()`
- `public int getCookProgressScaled(int p_145953_1_)`
- `public int getBurnTimeRemainingScaled(int p_145955_1_)`
- `public boolean isBurning()`
- `public void updateEntity()`
- `public void smeltItem()`
- `public static int getItemBurnTime( ItemStack p_145952_0_)`
- `public static boolean isItemFuel( ItemStack p_145954_0_)`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `public int[] getAccessibleSlotsFromSide(int p_94128_1_)`
- `public boolean canInsertItem(int p_102007_1_, ItemStack p_102007_2_, int p_102007_3_)`
- `public boolean canExtractItem(int p_102008_1_, ItemStack p_102008_2_, int p_102008_3_)`
