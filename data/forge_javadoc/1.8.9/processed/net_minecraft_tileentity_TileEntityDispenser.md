# TileEntityDispenser

## Class signature

```java
public class TileEntityDispenser extends TileEntityLockable implements IInventory
```

## Constructors

- `public TileEntityDispenser()`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public int getDispenseSlot()`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int addItemStack( ItemStack stack)`
- `public java.lang.String getName()`
- `public void setCustomName(java.lang.String customName)`
- `public boolean hasCustomName()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`

## Description

Add the given ItemStack to this Dispenser.