---
title: "InventoryMerchant"
description: "public class InventoryMerchant extends java.lang.Object implements IInventory"
package: "net/minecraft/inventory"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/InventoryMerchant.html"
sourceType: javadoc
---

# InventoryMerchant

## Class signature

```java
public class InventoryMerchant extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryMerchant( EntityPlayer thePlayerIn, IMerchant theMerchantIn)`

## Methods

- `public int getSizeInventory()`
- `@Nullable public ItemStack getStackInSlot(int index)`
- `@Nullable public ItemStack decrStackSize(int index, int count)`
- `@Nullable public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public ITextComponent getDisplayName()`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public void markDirty()`
- `public void resetRecipeAndSlots()`
- `public MerchantRecipe getCurrentRecipe()`
- `public void setCurrentRecipeIndex(int currentRecipeIndexIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
