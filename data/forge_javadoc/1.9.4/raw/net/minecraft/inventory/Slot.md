---
title: "Slot"
description: "Gets the path of the texture file to use for the background image of this slot when drawing the GUI."
package: "net/minecraft/inventory"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/Slot.html"
sourceType: javadoc
---

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
- `public boolean isItemValid(@Nullable ItemStack stack)`
- `@Nullable public ItemStack getStack()`
- `public boolean getHasStack()`
- `public void putStack(@Nullable ItemStack stack)`
- `public void onSlotChanged()`
- `public int getSlotStackLimit()`
- `public int getItemStackLimit( ItemStack stack)`
- `@Nullable public java.lang.String getSlotTexture()`
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

Gets the path of the texture file to use for the background image of this slot when drawing the GUI.
