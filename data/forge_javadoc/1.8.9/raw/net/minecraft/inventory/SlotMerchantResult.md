---
title: "SlotMerchantResult"
description: "public class SlotMerchantResult extends Slot"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/SlotMerchantResult.html"
sourceType: javadoc
---

# SlotMerchantResult

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot → net.minecraft.inventory.SlotMerchantResult

## Class signature

```java
public class SlotMerchantResult extends Slot
```

## Methods

- `ItemStack decrStackSize(int amount)` — Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.
- `boolean isItemValid(ItemStack stack)` — Check if the stack is a valid item for this slot.
- `protected void onCrafting(ItemStack stack)` — the itemStack passed in is the output - ie, iron ingots, and pickaxes, not ore and wood.
- `protected void onCrafting(ItemStack stack, int amount)` — the itemStack passed in is the output - ie, iron ingots, and pickaxes, not ore and wood.
- `void onPickupFromSlot(EntityPlayer playerIn, ItemStack stack)`

## Fields

- `SlotMerchantResult`
