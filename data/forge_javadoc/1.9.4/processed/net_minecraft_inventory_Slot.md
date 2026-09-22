# Slot

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot

## Class signature

```java
public class Slot extends java.lang.Object
```

## Constructors

- `Slot(IInventory inventoryIn, int index, int xPosition, int yPosition)`

## Methods

- `boolean canBeHovered()`
- `boolean canTakeStack(EntityPlayer playerIn)`
- `ItemStack decrStackSize(int amount)`
- `ResourceLocation getBackgroundLocation()` — Gets the path of the texture file to use for the background image of this slot when drawing the GUI.
- `protected TextureMap getBackgroundMap()`
- `TextureAtlasSprite getBackgroundSprite()`
- `boolean getHasStack()`
- `int getItemStackLimit(ItemStack stack)`
- `int getSlotIndex()` — Retrieves the index in the inventory for this slot, this value should typically not be used, but can be useful for some occasions.
- `int getSlotStackLimit()`
- `java.lang.String getSlotTexture()`
- `ItemStack getStack()`
- `boolean isHere(IInventory inv, int slotIn)`
- `boolean isItemValid(ItemStack stack)`
- `protected void onCrafting(ItemStack stack)`
- `protected void onCrafting(ItemStack stack, int amount)`
- `void onPickupFromSlot(EntityPlayer playerIn, ItemStack stack)`
- `void onSlotChange(ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `void onSlotChanged()`
- `void putStack(ItemStack stack)`
- `void setBackgroundLocation(ResourceLocation texture)` — Sets the texture file to use for the background image of the slot when it's empty.
- `void setBackgroundName(java.lang.String name)` — Sets which icon index to use as the background image of the slot when it's empty.

## Fields

- `protected ResourceLocation backgroundLocation`
- `protected java.lang.Object backgroundMap`
- `protected java.lang.String backgroundName`
- `IInventory inventory`
- `int slotNumber`
- `int xDisplayPosition`
- `int yDisplayPosition`