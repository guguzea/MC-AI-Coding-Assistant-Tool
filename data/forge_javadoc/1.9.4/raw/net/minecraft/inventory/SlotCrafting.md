---
title: "SlotCrafting"
description: "public class SlotCrafting extends Slot"
package: "net/minecraft/inventory"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/inventory/SlotCrafting.html"
sourceType: javadoc
---

# SlotCrafting

## Class signature

```java
public class SlotCrafting extends Slot
```

## Constructors

- `public SlotCrafting( EntityPlayer player, InventoryCrafting craftingInventory, IInventory inventoryIn, int slotIndex, int xPosition, int yPosition)`

## Methods

- `public boolean isItemValid(@Nullable ItemStack stack)`
- `public ItemStack decrStackSize(int amount)`
- `protected void onCrafting( ItemStack stack, int amount)`
- `protected void onCrafting( ItemStack stack)`
- `public void onPickupFromSlot( EntityPlayer playerIn, ItemStack stack)`
