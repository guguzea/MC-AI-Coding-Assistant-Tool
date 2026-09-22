---
title: "TileEntityHopper"
description: "public class TileEntityHopper extends TileEntityLockableLoot implements IHopper, ITickable"
package: "net/minecraft/tileentity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityHopper.html"
sourceType: javadoc
---

# TileEntityHopper

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityHopper

## Class signature

```java
public class TileEntityHopper extends TileEntityLockableLoot implements IHopper, ITickable
```

## Methods

- `static boolean captureDroppedItems(IHopper hopper)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected IItemHandler createUnSidedHandler()`
- `ItemStack decrStackSize(int index, int count)`
- `static java.util.List<EntityItem> getCaptureItems(World worldIn, double p_184292_1_, double p_184292_3_, double p_184292_5_)`
- `java.lang.String getGuiID()`
- `static IInventory getHopperInventory(IHopper hopper)`
- `static IInventory getInventoryAtPosition(World worldIn, double x, double y, double z)`
- `int getInventoryStackLimit()`
- `protected NonNullList<ItemStack> getItems()`
- `long getLastUpdateTime()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `double getXPos()`
- `double getYPos()`
- `double getZPos()`
- `boolean isEmpty()`
- `boolean mayTransfer()`
- `static boolean putDropInInventoryAllSlots(IInventory p_145898_0_, IInventory itemIn, EntityItem p_145898_2_)`
- `static ItemStack putStackInInventoryAllSlots(IInventory inventoryIn, IInventory stack, ItemStack side, EnumFacing p_174918_3_)`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixesHopper(DataFixer fixer)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setTransferCooldown(int ticks)`
- `void update()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityHopper`
