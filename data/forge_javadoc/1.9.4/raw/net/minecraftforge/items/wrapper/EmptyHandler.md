---
title: "EmptyHandler"
description: "public class EmptyHandler extends java.lang.Object implements IItemHandlerModifiable"
package: "net/minecraftforge/items/wrapper"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/wrapper/EmptyHandler.html"
sourceType: javadoc
---

# EmptyHandler

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.EmptyHandler

## Class signature

```java
public class EmptyHandler extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `EmptyHandler()`

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.

## Fields

- `static IItemHandler INSTANCE`
