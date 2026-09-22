# TileEntityBeacon

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityBeacon

## Class signature

```java
public class TileEntityBeacon extends TileEntityLockable implements ITickable, IInventory
```

## Constructors

- `TileEntityBeacon()`

## Methods

- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `java.util.List<TileEntityBeacon.BeamSegment> getBeamSegments()`
- `Packet getDescriptionPacket()` — Allows for a specialized description packet to be created.
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `double getMaxRenderDistanceSquared()`
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void setName(java.lang.String name)`
- `float shouldBeamRender()`
- `void update()` — Like the old updateEntity(), except more generic.
- `void updateBeacon()`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `static Potion [][] effectsList` — List of effects that Beacon can apply