---
title: "ItemHandlerHelper"
description: "public class ItemHandlerHelper extends java.lang.Object"
package: "net/minecraftforge/items"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/ItemHandlerHelper.html"
sourceType: javadoc
---

# ItemHandlerHelper

**Inheritance:** java.lang.Object → net.minecraftforge.items.ItemHandlerHelper

## Class signature

```java
public class ItemHandlerHelper extends java.lang.Object
```

## Constructors

- `ItemHandlerHelper()`

## Methods

- `static int calcRedstoneFromInventory(IItemHandler inv)` — This method uses the standard vanilla algorithm to calculate a comparator output for how "full" the inventory is.
- `static boolean canItemStacksStack(ItemStack a, ItemStack b)`
- `static boolean canItemStacksStackRelaxed(ItemStack a, ItemStack b)` — A relaxed version of canItemStacksStack that stacks itemstacks with different metadata if they don't have subtypes.
- `static ItemStack copyStackWithSize(ItemStack itemStack, int size)`
- `static void giveItemToPlayer(EntityPlayer player, ItemStack stack)` — giveItemToPlayer without preferred slot
- `static void giveItemToPlayer(EntityPlayer player, ItemStack stack, int preferredSlot)` — Inserts the given itemstack into the players inventory.
- `static ItemStack insertItem(IItemHandler dest, ItemStack stack, boolean simulate)`
- `static ItemStack insertItemStacked(IItemHandler inventory, ItemStack stack, boolean simulate)` — Inserts the ItemStack into the inventory, filling up already present stacks first.
