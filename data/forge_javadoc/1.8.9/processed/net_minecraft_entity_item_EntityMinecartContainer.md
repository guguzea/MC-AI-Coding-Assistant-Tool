# EntityMinecartContainer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.item.EntityMinecartContainer

## Class signature

```java
public abstract class EntityMinecartContainer extends EntityMinecart implements ILockableContainer
```

## Constructors

- `EntityMinecartContainer(World worldIn)`
- `EntityMinecartContainer(World worldIn, double p_i1717_2_, double p_i1717_4_, double p_i1717_6_)`

## Methods

- `protected void applyDrag()`
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getField(int id)`
- `int getFieldCount()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `LockCode getLockCode()`
- `java.lang.String getName()` — Get the name of this object.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isLocked()`
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void killMinecart(DamageSource p_94095_1_)`
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `void openInventory(EntityPlayer player)`
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setDead()` — Will get destroyed next tick.
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void setLockCode(LockCode code)`
- `void travelToDimension(int dimensionId)` — Teleports the entity to another dimension.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `boolean dropContentsWhenDead` — When set to true, the minecart will drop all items when setDead() is called.
- `IItemHandler itemHandler`