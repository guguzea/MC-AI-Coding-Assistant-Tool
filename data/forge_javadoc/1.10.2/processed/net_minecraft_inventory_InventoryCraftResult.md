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
- `int getSizeInventory()`
- `ItemStack getStackInSlot(int index)`
- `boolean hasCustomName()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUseableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`