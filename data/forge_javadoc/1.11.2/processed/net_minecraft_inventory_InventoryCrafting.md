# InventoryCrafting

**Inheritance:** java.lang.Object → net.minecraft.inventory.InventoryCrafting

## Class signature

```java
public class InventoryCrafting extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryCrafting(Container eventHandlerIn, int width, int height)`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)`
- `ITextComponent getDisplayName()`
- `int getField(int id)`
- `int getFieldCount()`
- `int getHeight()`
- `int getInventoryStackLimit()`
- `java.lang.String getName()`
- `int getSizeInventory()`
- `ItemStack getStackInRowAndColumn(int row, int column)`
- `ItemStack getStackInSlot(int index)`
- `int getWidth()`
- `boolean hasCustomName()`
- `boolean isEmpty()`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `boolean isUsableByPlayer(EntityPlayer player)`
- `void markDirty()`
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)`