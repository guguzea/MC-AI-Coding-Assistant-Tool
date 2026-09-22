---
title: "SlotItemHandler"
description: "public class SlotItemHandler extends Slot"
package: "net/minecraftforge/items"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/items/SlotItemHandler.html"
sourceType: javadoc
---

# SlotItemHandler

**Inheritance:** java.lang.Object → net.minecraft.inventory.Slot → net.minecraftforge.items.SlotItemHandler

## Class signature

```java
public class SlotItemHandler extends Slot
```

## Constructors

- `SlotItemHandler(IItemHandler itemHandler, int index, int xPosition, int yPosition)`

## Methods

- `boolean canTakeStack(EntityPlayer playerIn)` — Return whether this slot's stack can be taken from this slot.
- `ItemStack decrStackSize(int amount)` — Decrease the size of the stack in slot (first int arg) by the amount of the second int arg.
- `int getItemStackLimit(ItemStack stack)`
- `ItemStack getStack()` — Helper fnct to get the stack in the slot.
- `boolean isItemValid(ItemStack stack)` — Check if the stack is a valid item for this slot.
- `void onSlotChange(ItemStack p_75220_1_, ItemStack p_75220_2_)` — if par2 has more items than par1, onCrafting(item,countIncrease) is called
- `void putStack(ItemStack stack)` — Helper method to put a stack in the slot.

## Fields

- `IItemHandler itemHandler`
