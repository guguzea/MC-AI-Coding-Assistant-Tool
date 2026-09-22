# TileEntityDispenser

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityDispenser

## Class signature

```java
public class TileEntityDispenser extends TileEntityLockable implements IInventory
```

## Constructors

- `TileEntityDispenser()`

## Methods

- `int addItemStack(ItemStack stack)` — Add the given ItemStack to this Dispenser.
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `int getDispenseSlot()`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setCustomName(java.lang.String customName)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `protected java.lang.String customName`