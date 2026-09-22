# TileEntityChest

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntity implements IInventory
```

## Constructors

- `TileEntityChest()`
- `TileEntityChest(int p_i2350_1_)`

## Methods

- `void checkForAdjacentChests()`
- `void closeInventory()`
- `ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `void func_145976_a(java.lang.String p_145976_1_)`
- `int func_145980_j()`
- `java.lang.String getInventoryName()`
- `int getInventoryStackLimit()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int p_70301_1_)`
- `ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `boolean hasCustomInventoryName()`
- `void invalidate()`
- `boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `boolean isUseableByPlayer(EntityPlayer p_70300_1_)`
- `void openInventory()`
- `void readFromNBT(NBTTagCompound p_145839_1_)`
- `boolean receiveClientEvent(int p_145842_1_, int p_145842_2_)`
- `void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `void updateContainingBlockInfo()`
- `void updateEntity()`
- `void writeToNBT(NBTTagCompound p_145841_1_)`

## Fields

- `boolean adjacentChestChecked`
- `TileEntityChest adjacentChestXNeg`
- `TileEntityChest adjacentChestXPos`
- `TileEntityChest adjacentChestZNeg`
- `TileEntityChest adjacentChestZPos`
- `float lidAngle`
- `int numPlayersUsing`
- `float prevLidAngle`