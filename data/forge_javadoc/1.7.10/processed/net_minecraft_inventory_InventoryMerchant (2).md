# InventoryMerchant

## Class signature

```java
public class InventoryMerchant extends java.lang.Object implements IInventory
```

## Constructors

- `public InventoryMerchant( EntityPlayer p_i1820_1_, IMerchant p_i1820_2_)`

## Methods

- `public int getSizeInventory()`
- `public ItemStack getStackInSlot(int p_70301_1_)`
- `public ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `public ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `public void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `public java.lang.String getInventoryName()`
- `public boolean hasCustomInventoryName()`
- `public int getInventoryStackLimit()`
- `public boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `public void openInventory()`
- `public void closeInventory()`
- `public boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `public void markDirty()`
- `public void resetRecipeAndSlots()`
- `public MerchantRecipe getCurrentRecipe()`
- `public void setCurrentRecipeIndex(int p_70471_1_)`