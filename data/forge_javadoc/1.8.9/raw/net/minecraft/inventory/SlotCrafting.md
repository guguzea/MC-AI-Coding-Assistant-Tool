---
title: "SlotCrafting"
description: "Decrease the size of the stack in slot (first int arg) by the amount of the second int arg."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/SlotCrafting.html"
sourceType: javadoc
---

# SlotCrafting

## Class signature

```java
public class SlotCrafting extends Slot
```

## Constructors

- `public SlotCrafting( EntityPlayer player, InventoryCrafting craftingInventory, IInventory p_i45790_3_, int slotIndex, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack decrStackSize(int amount)`
- `protected void onCrafting( ItemStack stack, int amount)`
- `protected void onCrafting( ItemStack stack)`
- `public void onPickupFromSlot( EntityPlayer playerIn, ItemStack stack)`

## Description

Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.
