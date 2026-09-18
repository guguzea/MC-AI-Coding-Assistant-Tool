# TileEntityBeacon

## Class signature

```java
public class TileEntityBeacon extends TileEntity implements IInventory
```

## Constructors

- `public TileEntityBeacon()`

## Methods

- `public void updateEntity()`
- `public float func_146002_i()`
- `public int getPrimaryEffect()`
- `public int getSecondaryEffect()`
- `public int getLevels()`
- `public void func_146005_c(int p_146005_1_)`
- `public void setPrimaryEffect(int p_146001_1_)`
- `public void setSecondaryEffect(int p_146004_1_)`
- `public Packet getDescriptionPacket()`
- `public double getMaxRenderDistanceSquared()`
- `public void readFromNBT( NBTTagCompound p_145839_1_)`
- `public void writeToNBT( NBTTagCompound p_145841_1_)`
- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public java.lang.String getInventoryName()`
- `public boolean hasCustomInventoryName()`
- `public void func_145999_a(java.lang.String p_145999_1_)`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`