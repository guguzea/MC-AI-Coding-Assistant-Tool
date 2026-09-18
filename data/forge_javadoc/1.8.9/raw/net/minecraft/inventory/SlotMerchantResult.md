---
title: "SlotMerchantResult"
description: "Decrease the size of the stack in slot (first int arg) by the amount of the second int arg."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/SlotMerchantResult.html"
sourceType: javadoc
---

# SlotMerchantResult

## Class signature

```java
public class SlotMerchantResult extends Slot
```

## Constructors

- `public SlotMerchantResult( EntityPlayer player, IMerchant merchant, InventoryMerchant merchantInventory, int slotIndex, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid( ItemStack stack)`
- `public ItemStack decrStackSize(int amount)`
- `protected void onCrafting( ItemStack stack, int amount)`
- `protected void onCrafting( ItemStack stack)`
- `public void onPickupFromSlot( EntityPlayer playerIn, ItemStack stack)`

## Description

Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.
