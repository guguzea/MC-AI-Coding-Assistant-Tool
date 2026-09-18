# IInventory

## Class signature

```java
public interface IInventory extends IWorldNameable
```

## Methods

- `int getSizeInventory()`
- `boolean isEmpty()`
- `ItemStack getStackInSlot(int index)`
- `ItemStack decrStackSize(int index, int count)`
- `ItemStack removeStackFromSlot(int index)`
- `void setInventorySlotContents(int index, ItemStack stack)`
- `int getInventoryStackLimit()`
- `void markDirty()`
- `boolean isUsableByPlayer( EntityPlayer player)`
- `void openInventory( EntityPlayer player)`
- `void closeInventory( EntityPlayer player)`
- `boolean isItemValidForSlot(int index, ItemStack stack)`
- `int getField(int id)`
- `void setField(int id, int value)`
- `int getFieldCount()`
- `void clear()`