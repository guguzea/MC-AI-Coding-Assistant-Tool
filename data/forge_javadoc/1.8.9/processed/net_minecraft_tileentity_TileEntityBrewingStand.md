# TileEntityBrewingStand

## Class signature

```java
public class TileEntityBrewingStand extends TileEntityLockable implements ITickable , ISidedInventory
```

## Constructors

- `public TileEntityBrewingStand()`

## Methods

- `public java.lang.String getName()`
- `public boolean hasCustomName()`
- `public void setName(java.lang.String name)`
- `public int getSizeInventory()`
- `public void update()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public ItemStack getStackInSlot(int index)`
- `public ItemStack decrStackSize(int index, int count)`
- `public ItemStack removeStackFromSlot(int index)`
- `public void setInventorySlotContents(int index, ItemStack stack)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer player)`
- `public void openInventory( EntityPlayer player)`
- `public void closeInventory( EntityPlayer player)`
- `public boolean isItemValidForSlot(int index, ItemStack stack)`
- `public boolean[] func_174902_m()`
- `public int[] getSlotsForFace( EnumFacing side)`
- `public boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `public boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `public int getField(int id)`
- `public void setField(int id, int value)`
- `public int getFieldCount()`
- `public void clear()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Returns true if automation can extract the given item in the given slot from the given side.