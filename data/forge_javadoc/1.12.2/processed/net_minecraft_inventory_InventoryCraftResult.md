# InventoryCraftResult

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryCraftResult

## Class signature

```java
public class InventoryCraftResult extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryCraftResult()`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `IRecipe getRecipeUsed()`
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isEmpty()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `void setRecipeUsed(IRecipe p_193056_1_)`