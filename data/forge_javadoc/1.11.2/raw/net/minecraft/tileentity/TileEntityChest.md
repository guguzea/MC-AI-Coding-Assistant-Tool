---
title: "TileEntityChest"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityChest.html"
sourceType: javadoc
---

# TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntityLockableLoot implements ITickable
```

## Constructors

- `public TileEntityChest()`
- `public TileEntityChest( BlockChest.Type typeIn)`

## Methods

- `public int getSizeInventory()`
- `public boolean isEmpty()`
- `public java.lang.String getName()`
- `public static void registerFixesChest( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public void updateContainingBlockInfo()`
- `public void checkForAdjacentChests()`
- `@Nullable protected TileEntityChest getAdjacentChest( EnumFacing side)`
- `public void update()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public <T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`
- `public IItemHandler getSingleChestHandler()`
- `public void invalidate()`
- `public BlockChest.Type getChestType()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `protected NonNullList < ItemStack > getItems()`

## Description

Retrieves the handler for the capability requested on the specific side.
