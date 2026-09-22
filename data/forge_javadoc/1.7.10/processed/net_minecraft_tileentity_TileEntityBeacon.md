# TileEntityBeacon

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityBeacon

## Class signature

```java
public class TileEntityBeacon extends TileEntity implements IInventory
```

## Constructors

- `TileEntityBeacon()`

## Methods

- `void closeInventory()`
- `ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `void func_145999_a(java.lang.String p_145999_1_)`
- `float func_146002_i()`
- `void func_146005_c(int p_146005_1_)`
- `Packet getDescriptionPacket()`
- `java.lang.String getInventoryName()`
- `int getInventoryStackLimit()`
- `int getLevels()`
- `double getMaxRenderDistanceSquared()`
- `int getPrimaryEffect()`
- `int getSecondaryEffect()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int p_70301_1_)`
- `ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `boolean hasCustomInventoryName()`
- `boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `boolean isUseableByPlayer(EntityPlayer p_70300_1_)`
- `void openInventory()`
- `void readFromNBT(NBTTagCompound p_145839_1_)`
- `void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `void setPrimaryEffect(int p_146001_1_)`
- `void setSecondaryEffect(int p_146004_1_)`
- `void updateEntity()`
- `void writeToNBT(NBTTagCompound p_145841_1_)`

## Fields

- `static Potion [][] effectsList`