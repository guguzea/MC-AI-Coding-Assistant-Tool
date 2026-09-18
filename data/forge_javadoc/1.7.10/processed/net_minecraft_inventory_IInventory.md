# IInventory

## Class signature

```java
public interface IInventory
```

## Methods

- `int getSizeInventory()`
- `ItemStack getStackInSlot(int p_70301_1_)`
- `ItemStack decrStackSize(int p_70298_1_, int p_70298_2_)`
- `ItemStack getStackInSlotOnClosing(int p_70304_1_)`
- `void setInventorySlotContents(int p_70299_1_, ItemStack p_70299_2_)`
- `java.lang.String getInventoryName()`
- `boolean hasCustomInventoryName()`
- `int getInventoryStackLimit()`
- `void markDirty()`
- `boolean isUseableByPlayer( EntityPlayer p_70300_1_)`
- `void openInventory()`
- `void closeInventory()`
- `boolean isItemValidForSlot(int p_94041_1_, ItemStack p_94041_2_)`