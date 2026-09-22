# Slot

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot

## Class signature

```java
public class Slot extends java.lang.Object
```

## Constructors

- `Slot(IInventory inventoryIn, int index, int xPosition, int yPosition)`

## Methods

- `boolean canBeHovered()` — Actualy only call when we want to render the white square effect over the slots.
- `boolean canTakeStack(EntityPlayer playerIn)` — Return whether this slot's stack can be taken from this slot.
- `ItemStack decrStackSize(int amount)` — Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.
- `ResourceLocation getBackgroundLocation()` — Gets the path of the texture file to use for the background image of this slot when drawing the GUI.
- `protected TextureMap getBackgroundMap()`
- `TextureAtlasSprite getBackgroundSprite()`
- `boolean getHasStack()` — Returns if this slot contains a stack.
- `int getItemStackLimit(ItemStack stack)`
- `int getSlotIndex()` — Retrieves the index in the inventory for this slot, this value should typically not be used, but can be useful for some occasions.
- `int getSlotStackLimit()` — Returns the maximum stack size for a given slot (usually the same as getInventoryStackLimit(), but 1 in the case of armor slots)
- `java.lang.String getSlotTexture()`
- `ItemStack getStack()` — Helper fnct to get the stack in the slot.
- `boolean isHere(IInventory inv, int slotIn)` — returns true if the slot exists in the given inventory and location
- `boolean isItemValid(ItemStack stack)` — Check if the stack is a valid item for this slot.
- `protected void onCrafting(ItemStack stack)` — the itemStack passed in is the output - ie, iron ingots, and pickaxes, not ore and wood.
- `protected void onCrafting(ItemStack stack, int amount)` — the itemStack passed in is the output - ie, iron ingots, and pickaxes, not ore and wood.
- `void onPickupFromSlot(EntityPlayer playerIn, ItemStack stack)`
- `void onSlotChange(ItemStack p_75220_1_, ItemStack p_75220_2_)` — if par2 has more items than par1, onCrafting(item,countIncrease) is called
- `void onSlotChanged()` — Called when the stack in a Slot changes
- `void putStack(ItemStack stack)` — Helper method to put a stack in the slot.
- `void setBackgroundLocation(ResourceLocation texture)` — Sets the texture file to use for the background image of the slot when it's empty.
- `void setBackgroundName(java.lang.String name)` — Sets which icon index to use as the background image of the slot when it's empty.

## Fields

- `protected ResourceLocation backgroundLocation`
- `protected java.lang.Object backgroundMap`
- `protected java.lang.String backgroundName`
- `IInventory inventory` — The inventory we want to extract a slot from.
- `int slotNumber` — the id of the slot(also the index in the inventory arraylist)
- `int xDisplayPosition` — display position of the inventory slot on the screen x axis
- `int yDisplayPosition` — display position of the inventory slot on the screen y axis