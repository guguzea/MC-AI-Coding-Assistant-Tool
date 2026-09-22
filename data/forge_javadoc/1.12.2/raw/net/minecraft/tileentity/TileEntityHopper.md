---
title: "TileEntityHopper"
description: "public class TileEntityHopper extends TileEntityLockableLoot implements IHopper, ITickable"
package: "net/minecraft/tileentity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityHopper.html"
sourceType: javadoc
---

# TileEntityHopper

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityHopper

## Class signature

```java
public class TileEntityHopper extends TileEntityLockableLoot implements IHopper, ITickable
```

## Methods

- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected IItemHandler createUnSidedHandler()`
- `ItemStack decrStackSize(int index, int count)`
- `static java.util.List<EntityItem> getCaptureItems(World worldIn, double p_184292_1_, double p_184292_3_, double p_184292_5_)`
- `java.lang.String getGuiID()`
- `static IInventory getInventoryAtPosition(World worldIn, double x, double y, double z)`
- `int getInventoryStackLimit()`
- `protected NonNullList<ItemStack> getItems()`
- `long getLastUpdateTime()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `static IInventory getSourceInventory(IHopper hopper)`
- `double getXPos()`
- `double getYPos()`
- `double getZPos()`
- `boolean isEmpty()`
- `boolean mayTransfer()`
- `static boolean pullItems(IHopper hopper)`
- `static boolean putDropInInventoryAllSlots(IInventory source, IInventory destination, EntityItem entity)`
- `static ItemStack putStackInInventoryAllSlots(IInventory source, IInventory destination, ItemStack stack, EnumFacing direction)`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixesHopper(DataFixer fixer)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setTransferCooldown(int ticks)`
- `void update()`
- `protected boolean updateHopper()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityHopper`
