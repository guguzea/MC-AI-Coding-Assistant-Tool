---
title: "RangedWrapper"
description: "public class RangedWrapper extends java.lang.Object implements IItemHandlerModifiable"
package: "net/minecraftforge/items/wrapper"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/items/wrapper/RangedWrapper.html"
sourceType: javadoc
---

# RangedWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.RangedWrapper

## Class signature

```java
public class RangedWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `RangedWrapper(IItemHandlerModifiable compose, int minSlot, int maxSlotExclusive)`

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.
