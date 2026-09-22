# TileEntityFurnace

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable → net.minecraft.tileentity.TileEntityFurnace

## Class signature

```java
public class TileEntityFurnace extends TileEntityLockable implements ITickable, ISidedInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)` — Returns true if automation can extract the given item in the given slot from the given side.
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)` — Returns true if automation can insert the given item in the given slot from the given side.
- `void clear()`
- `void closeInventory(EntityPlayer player)`
- `Container createContainer(InventoryPlayer playerInventory, EntityPlayer playerIn)`
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `int getCookTime(ItemStack stack)`
- `int getField(int id)`
- `int getFieldCount()`
- `java.lang.String getGuiID()`
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `static int getItemBurnTime(ItemStack p_145952_0_)` — Returns the number of ticks that the supplied fuel item will keep the furnace burning, or 0 if the item isn't fuel
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `int[] getSlotsForFace(EnumFacing side)`
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean isBurning()` — Furnace isBurning
- `static boolean isBurning(IInventory p_174903_0_)`
- `static boolean isItemFuel(ItemStack p_145954_0_)`
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagCompound compound)`
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setCustomInventoryName(java.lang.String p_145951_1_)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void smeltItem()` — Turn one item from the furnace source stack into the appropriate smelted item in the furnace result stack
- `void update()` — Like the old updateEntity(), except more generic.
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityFurnace`