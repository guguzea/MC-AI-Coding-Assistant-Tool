# TileEntityFurnace

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityFurnace

## Class signature

```java
public class TileEntityFurnace extends TileEntity implements ISidedInventory
```

## Constructors

- `TileEntityFurnace()`

## Methods

- `boolean canExtractItem(int p_102008_1_, ItemStack p_102008_2_, int p_102008_3_)`
- `boolean canInsertItem(int p_102007_1_, ItemStack p_102007_2_, int p_102007_3_)`
- `void closeInventory()`
- `ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `void func_145951_a(java.lang.String p_145951_1_)`
- `int[] getAccessibleSlotsFromSide(int p_94128_1_)`
- `int getBurnTimeRemainingScaled(int p_145955_1_)`
- `int getCookProgressScaled(int p_145953_1_)`
- `java.lang.String getInventoryName()`
- `int getInventoryStackLimit()`
- `static int getItemBurnTime(ItemStack p_145952_0_)`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int p_70301_1_)`
- `ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `boolean hasCustomInventoryName()`
- `boolean isBurning()`
- `static boolean isItemFuel(ItemStack p_145954_0_)`
- `boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `boolean isUseableByPlayer(EntityPlayer p_70300_1_)`
- `void openInventory()`
- `void readFromNBT(NBTTagCompound p_145839_1_)`
- `void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `void smeltItem()`
- `void updateEntity()`
- `void writeToNBT(NBTTagCompound p_145841_1_)`

## Fields

- `int currentItemBurnTime`
- `int furnaceBurnTime`
- `int furnaceCookTime`