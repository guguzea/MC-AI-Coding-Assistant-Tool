# TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntity implements IInventory
```

## Constructors

- `public TileEntityChest()`
- `public TileEntityChest(int p_i2350_1_)`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public java.lang.String getInventoryName()`
- `public boolean hasCustomInventoryName()`
- `public void func_145976_a(java.lang.String p_145976_1_)`
- `public void readFromNBT( NBTTagCompound p_145839_1_)`
- `public void writeToNBT( NBTTagCompound p_145841_1_)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public void updateContainingBlockInfo()`
- `public void checkForAdjacentChests()`
- `public void updateEntity()`
- `public boolean receiveClientEvent(int p_145842_1_, int p_145842_2_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `public void invalidate()`
- `public int func_145980_j()`