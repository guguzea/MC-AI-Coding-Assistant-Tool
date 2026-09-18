---
title: "TileEntityLockableLoot"
description: "public abstract class TileEntityLockableLoot extends TileEntityLockable implements ILootContainer"
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityLockableLoot.html"
sourceType: javadoc
---

# TileEntityLockableLoot

## Class signature

```java
public abstract class TileEntityLockableLoot extends TileEntityLockable implements ILootContainer
```

## Constructors

- `public TileEntityLockableLoot()`

## Methods

- `protected boolean checkLootAndRead( NBTTagCompound compound)`
- `protected boolean checkLootAndWrite( NBTTagCompound compound)`
- `public void fillWithLoot(@Nullable EntityPlayer player)`
- `public ResourceLocation getLootTable()`
- `public void setLootTable( ResourceLocation p_189404_1_, long p_189404_2_)`
- `public boolean hasCustomName()`
- `public void setCustomName(java.lang.String p_190575_1_)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, @Nullable ItemStack stack)`
- `public boolean isUsableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `protected abstract NonNullList < ItemStack > getItems()`
