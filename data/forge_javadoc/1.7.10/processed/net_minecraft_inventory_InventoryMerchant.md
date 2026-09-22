# InventoryMerchant

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryMerchant

## Class signature

```java
public class InventoryMerchant extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryMerchant(EntityPlayer p_i1820_1_, IMerchant p_i1820_2_)`

## Methods

- `void closeInventory()`
- `ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `MerchantRecipe getCurrentRecipe()`
- `java.lang.String getInventoryName()`
- `int getInventoryStackLimit()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int p_70301_1_)`
- `ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `boolean hasCustomInventoryName()`
- `boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`
- `boolean isUseableByPlayer(EntityPlayer p_70300_1_)`
- `void markDirty()`
- `void openInventory()`
- `void resetRecipeAndSlots()`
- `void setCurrentRecipeIndex(int p_70471_1_)`
- `void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`