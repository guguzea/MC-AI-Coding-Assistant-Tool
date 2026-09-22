---
title: "TileEntityFurnace"
description: "public class TileEntityFurnace extends TileEntityLockable implements ITickable, ISidedInventory"
package: "net/minecraft/tileentity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/tileentity/TileEntityFurnace.html"
sourceType: javadoc
---

# TileEntityFurnace

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityFurnace

## Class signature

```java
public class TileEntityFurnace extends TileEntityLockable implements ITickable, ISidedInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getCookTime(ItemStack stack)`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `static int getItemBurnTime(ItemStack stack)`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `int[] getSlotsForFace(EnumFacing side)`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isBurning()`
- `static boolean isBurning(IInventory inventory)`
- `static boolean isItemFuel(ItemStack stack)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixesFurnace(DataFixer fixer)`
- `ItemStack removeStackFromSlot(int index)`
- `void setCustomInventoryName(java.lang.String p_145951_1_)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void smeltItem()`
- `void update()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityFurnace`
