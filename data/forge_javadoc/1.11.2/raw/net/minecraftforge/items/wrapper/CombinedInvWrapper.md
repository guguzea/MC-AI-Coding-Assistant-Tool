---
title: "CombinedInvWrapper"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items/wrapper"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/wrapper/CombinedInvWrapper.html"
sourceType: javadoc
---

# CombinedInvWrapper

## Class signature

```java
public class CombinedInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public CombinedInvWrapper( IItemHandlerModifiable ... itemHandler)`

## Methods

- `protected int getIndexForSlot(int slot)`
- `protected IItemHandlerModifiable getHandlerFromIndex(int index)`
- `protected int getSlotFromIndex(int slot, int index)`
- `public void setStackInSlot(int slot, @Nonnull ItemStack stack)`
- `public int getSlots()`
- `@Nonnull public ItemStack getStackInSlot(int slot)`
- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public int getSlotLimit(int slot)`

## Description

Extracts an ItemStack from the given slot.
