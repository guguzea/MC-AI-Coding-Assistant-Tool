# Slot

## Class signature

```java
public class Slot extends java.lang.Object
```

## Constructors

- `public Slot( IInventory inventoryIn, int index, int xPosition, int yPosition)`

## Methods

- `public void onSlotChange( ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `protected void onCrafting( ItemStack stack, int amount)`
- `protected void onCrafting( ItemStack stack)`
- `public void onPickupFromSlot( EntityPlayer playerIn, ItemStack stack)`
- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack getStack()`
- `public boolean getHasStack()`
- `public void putStack( ItemStack stack)`
- `public void onSlotChanged()`
- `public int getSlotStackLimit()`
- `public int getItemStackLimit( ItemStack stack)`
- `public java.lang.String getSlotTexture()`
- `public ItemStack decrStackSize(int amount)`
- `public boolean isHere( IInventory inv, int slotIn)`
- `public boolean canTakeStack( EntityPlayer playerIn)`
- `public boolean canBeHovered()`
- `public ResourceLocation getBackgroundLocation()`
- `public void setBackgroundLocation( ResourceLocation texture)`
- `public void setBackgroundName(java.lang.String name)`
- `public TextureAtlasSprite getBackgroundSprite()`
- `protected TextureMap getBackgroundMap()`
- `public int getSlotIndex()`

## Description

The inventory we want to extract a slot from.