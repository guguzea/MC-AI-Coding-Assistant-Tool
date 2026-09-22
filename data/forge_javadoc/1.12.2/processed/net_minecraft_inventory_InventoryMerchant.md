# InventoryMerchant

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryMerchant

## Class signature

```java
public class InventoryMerchant extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryMerchant(EntityPlayer thePlayerIn, IMerchant theMerchantIn)`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `MerchantRecipe getCurrentRecipe()`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isEmpty()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void resetRecipeAndSlots()`
- `void setCurrentRecipeIndex(int currentRecipeIndexIn)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`