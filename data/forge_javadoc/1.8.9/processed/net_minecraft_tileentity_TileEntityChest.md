# TileEntityChest

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityChest

## Class signature

```java
public class TileEntityChest extends TileEntityLockable implements ITickable, IInventory
```

## Constructors

- `TileEntityChest()`
- `TileEntityChest(int chestType)`

## Methods

- `void checkForAdjacentChests()` — Performs the check for adjacent chests to determine if this chest is double or not.
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `protected TileEntityChest getAdjacentChest(EnumFacing side)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getChestType()`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `java.lang.String getName()` — Get the name of this object.
- `IItemHandler getSingleChestHandler()`
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCustomName()` — Returns true if this thing is named
- `void invalidate()` — invalidates a tile entity
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setCustomName(java.lang.String name)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void update()` — Like the old updateEntity(), except more generic.
- `void updateContainingBlockInfo()`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `boolean adjacentChestChecked` — Determines if the check for adjacent chests has taken place.
- `TileEntityChest adjacentChestXNeg` — Contains the chest tile located adjacent to this one (if any)
- `TileEntityChest adjacentChestXPos` — Contains the chest tile located adjacent to this one (if any)
- `TileEntityChest adjacentChestZNeg` — Contains the chest tile located adjacent to this one (if any)
- `TileEntityChest adjacentChestZPos` — Contains the chest tile located adjacent to this one (if any)
- `VanillaDoubleChestItemHandler doubleChestHandler`
- `float lidAngle` — The current angle of the lid (between 0 and 1)
- `int numPlayersUsing` — The number of players currently using this chest
- `float prevLidAngle` — The angle of the lid last tick