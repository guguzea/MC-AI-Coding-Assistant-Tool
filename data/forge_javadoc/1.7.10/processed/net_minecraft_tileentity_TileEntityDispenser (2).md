# TileEntityDispenser

## Class signature

```java
public class TileEntityDispenser extends TileEntity implements IInventory
```

## Constructors

- `public TileEntityDispenser()`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public int func_146017_i()`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public int func_146019_a( ItemStack p_146019_1_)`
- `public java.lang.String getInventoryName()`
- `public void func_146018_a(java.lang.String p_146018_1_)`
- `public boolean hasCustomInventoryName()`
- `public void readFromNBT( NBTTagCompound p_145839_1_)`
- `public void writeToNBT( NBTTagCompound p_145841_1_)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`