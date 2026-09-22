---
title: "TileEntityChest"
description: "public class TileEntityChest extends TileEntityLockableLoot implements ITickable"
package: "net/minecraft/tileentity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityChest.html"
sourceType: javadoc
---

# TileEntityChest

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityLockableLoot → net.minecraft.tileentity.TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntityLockableLoot implements ITickable
```

## Constructors

- `TileEntityChest()`
- `TileEntityChest(BlockChest.Type typeIn)`

## Methods

- `void checkForAdjacentChests()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected TileEntityChest getAdjacentChest(EnumFacing side)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `BlockChest.Type getChestType()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()`
- `protected NonNullList<ItemStack> getItems()`
- `java.lang.String getName()`
- `IItemHandler getSingleChestHandler()`
- `int getSizeInventory()`
- `void invalidate()`
- `boolean isEmpty()`
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `static void registerFixesChest(DataFixer fixer)`
- `void update()`
- `void updateContainingBlockInfo()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `boolean adjacentChestChecked`
- `TileEntityChest adjacentChestXNeg`
- `TileEntityChest adjacentChestXPos`
- `TileEntityChest adjacentChestZNeg`
- `TileEntityChest adjacentChestZPos`
- `VanillaDoubleChestItemHandler doubleChestHandler`
- `float lidAngle`
- `int numPlayersUsing`
- `float prevLidAngle`
