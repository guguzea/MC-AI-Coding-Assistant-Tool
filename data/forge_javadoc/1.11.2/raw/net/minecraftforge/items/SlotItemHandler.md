---
title: "SlotItemHandler"
description: "Checks if the other slot is in the same inventory, by comparing the inventory reference."
package: "net/minecraftforge/items"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/SlotItemHandler.html"
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

- `public boolean isItemValid(@Nonnull ItemStack stack)`
- `@Nonnull public ItemStack getStack()`
- `public void putStack(@Nonnull ItemStack stack)`
- `public void onSlotChange(@Nonnull ItemStack p_75220_1_, @Nonnull ItemStack p_75220_2_)`
- `public int getSlotStackLimit()`
- `public int getItemStackLimit(@Nonnull ItemStack stack)`
- `public boolean canTakeStack( EntityPlayer playerIn)`
- `@Nonnull public ItemStack decrStackSize(int amount)`
- `public IItemHandler getItemHandler()`
- `public boolean isSameInventory( Slot other)`

## Description

Checks if the other slot is in the same inventory, by comparing the inventory reference.
