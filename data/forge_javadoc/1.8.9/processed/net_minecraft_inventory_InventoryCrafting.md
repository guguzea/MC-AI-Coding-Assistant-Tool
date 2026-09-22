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
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `int getField(int id)`
- `int getFieldCount()`
- `int getHeight()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInRowAndColumn(int row, int column)` — Returns the itemstack in the slot specified (Top left is 0, 0).
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `int getWidth()`
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `void openInventory(EntityPlayer player)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).