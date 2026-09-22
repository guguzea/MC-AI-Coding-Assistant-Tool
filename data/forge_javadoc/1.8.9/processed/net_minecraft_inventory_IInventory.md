# IInventory

## Class signature

```java
public interface IInventory extends IWorldNameable
```

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).