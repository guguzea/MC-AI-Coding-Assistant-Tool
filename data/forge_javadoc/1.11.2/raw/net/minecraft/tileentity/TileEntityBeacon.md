---
title: "TileEntityBeacon"
description: "public class TileEntityBeacon extends TileEntityLockable implements ITickable, ISidedInventory"
package: "net/minecraft/tileentity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityBeacon.html"
sourceType: javadoc
---

# TileEntityBeacon

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityBeacon

## Class signature

```java
public class TileEntityBeacon extends TileEntityLockable implements ITickable, ISidedInventory
```

## Constructors

- `TileEntityBeacon()`

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)`
- `java.util.List<TileEntityBeacon.BeamSegment> getBeamSegments()`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `double getMaxRenderDistanceSquared()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `int[] getSlotsForFace(EnumFacing side)`
- `ItemStack getStackInSlot(int index)`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `boolean hasCustomName()`
- `boolean isEmpty()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setName(java.lang.String name)`
- `float shouldBeamRender()`
- `void update()`
- `void updateBeacon()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `static Potion [][] EFFECTS_LIST`
