---
title: "CombinedInvWrapper"
description: "public class CombinedInvWrapper extends java.lang.Object implements IItemHandlerModifiable"
package: "net/minecraftforge/items/wrapper"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/items/wrapper/CombinedInvWrapper.html"
sourceType: javadoc
---

# CombinedInvWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.CombinedInvWrapper

## Class signature

```java
public class CombinedInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `CombinedInvWrapper(IItemHandlerModifiable ... itemHandler)`

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `protected IItemHandlerModifiable getHandlerFromIndex(int index)`
- `protected int getIndexForSlot(int slot)`
- `protected int getSlotFromIndex(int slot, int index)`
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.

## Fields

- `protected int[] baseIndex`
- `protected IItemHandlerModifiable [] itemHandler`
- `protected int slotCount`
