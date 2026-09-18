---
title: "SlotItemHandler"
description: "Return whether this slot's stack can be taken from this slot."
package: "net/minecraftforge/items"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/items/SlotItemHandler.html"
sourceType: javadoc
---

# SlotItemHandler

## Class signature

```java
public class SlotItemHandler extends Slot
```

## Constructors

- `public SlotItemHandler( IItemHandler itemHandler, int index, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack getStack()`
- `public void putStack( ItemStack stack)`
- `public void onSlotChange( ItemStack p_75220_1_, ItemStack p_75220_2_)`
- `public int getItemStackLimit( ItemStack stack)`
- `public boolean canTakeStack( EntityPlayer playerIn)`
- `public ItemStack decrStackSize(int amount)`

## Description

Return whether this slot's stack can be taken from this slot.
