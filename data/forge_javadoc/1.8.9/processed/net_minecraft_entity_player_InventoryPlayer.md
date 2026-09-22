# InventoryPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.player.InventoryPlayer

## Class signature

```java
public class InventoryPlayer extends java.lang.Object implements IInventory
```

## Constructors

- `InventoryPlayer(EntityPlayer playerIn)`

## Methods

- `boolean addItemStackToInventory(ItemStack itemStackIn)` — Adds the item stack to the inventory, returns false if it is impossible.
- `ItemStack armorItemInSlot(int p_70440_1_)` — returns a player armor item (as itemstack) contained in specified armor slot.
- `boolean canHeldItemHarvest(Block blockIn)`
- `void changeCurrentItem(int p_70453_1_)` — Switch the current item to the next one or the previous one
- `void clear()`
- `int clearMatchingItems(Item itemIn, int metadataIn, int removeCount, NBTTagCompound itemNBT)` — Removes matching items from the inventory.
- `void closeInventory(EntityPlayer player)`
- `boolean consumeInventoryItem(Item itemIn)` — removed one item of specified Item from inventory (if it is in a stack, the stack size will reduce with 1)
- `void copyInventory(InventoryPlayer playerInventory)` — Copy the ItemStack contents from another InventoryPlayer instance
- `void damageArmor(float damage)` — Damages armor in each slot by the specified amount.
- `void decrementAnimations()` — Decrement the number of animations remaining.
- `ItemStack decrStackSize(int index, int count)` — Removes up to a specified number of items from an inventory slot and returns them in a new stack.
- `void dropAllItems()` — Drop all armor and main inventory items.
- `ItemStack getCurrentItem()` — Returns the item stack currently held by the player.
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `int getField(int id)`
- `int getFieldCount()`
- `int getFirstEmptyStack()` — Returns the first item stack that is empty.
- `static int getHotbarSize()` — Get the size of the player hotbar inventory
- `int getInventoryStackLimit()` — Returns the maximum stack size for a inventory slot.
- `ItemStack getItemStack()` — Stack helds by mouse, used in GUI and Containers
- `java.lang.String getName()` — Get the name of this object.
- `int getSizeInventory()` — Returns the number of slots in the inventory.
- `ItemStack getStackInSlot(int index)` — Returns the stack in the given slot.
- `float getStrVsBlock(Block blockIn)`
- `int getTotalArmorValue()` — Based on the damage values and maximum damage values of each armor item, returns the current armor value.
- `boolean hasCustomName()` — Returns true if this thing is named
- `boolean hasItem(Item itemIn)` — Checks if a specified Item is inside the inventory
- `boolean hasItemStack(ItemStack itemStackIn)` — Returns true if the specified ItemStack exists in the inventory.
- `boolean isItemValidForSlot(int index, ItemStack stack)` — Returns true if automation is allowed to insert the given stack (ignoring stack size) into the given slot.
- `boolean isUseableByPlayer(EntityPlayer player)` — Do not make give this method the name canInteractWith because it clashes with Container
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `void openInventory(EntityPlayer player)`
- `void readFromNBT(NBTTagList p_70443_1_)` — Reads from the given tag list and fills the slots in the inventory with the correct items.
- `ItemStack removeStackFromSlot(int index)` — Removes a stack from the given slot and returns it.
- `void setCurrentItem(Item itemIn, int p_146030_2_, boolean p_146030_3_, boolean p_146030_4_)`
- `void setField(int id, int value)`
- `void setInventorySlotContents(int index, ItemStack stack)` — Sets the given item stack to the specified slot in the inventory (can be crafting or armor sections).
- `void setItemStack(ItemStack itemStackIn)` — Set the stack helds by mouse, used in GUI/Container
- `NBTTagList writeToNBT(NBTTagList p_70442_1_)` — Writes the inventory out as a list of compound tags.

## Fields

- `ItemStack [] armorInventory` — An array of 4 item stacks containing the currently worn armor pieces.
- `int currentItem` — The index of the currently held item (0-8).
- `boolean inventoryChanged` — Set true whenever the inventory changes.
- `ItemStack [] mainInventory` — An array of 36 item stacks indicating the main player inventory (including the visible bar).
- `EntityPlayer player` — The player whose inventory this is.