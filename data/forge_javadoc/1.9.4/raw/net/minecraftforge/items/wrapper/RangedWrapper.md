---
title: "RangedWrapper"
description: "A wrapper that composes another IItemHandlerModifiable, exposing only a range of the composed slots. Shifting of slot indices is handled automatically for you."
package: "net/minecraftforge/items/wrapper"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/wrapper/RangedWrapper.html"
sourceType: javadoc
---

# RangedWrapper

## Class signature

```java
public class RangedWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public RangedWrapper( IItemHandlerModifiable compose, int minSlot, int maxSlotExclusive)`

## Methods

- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public void setStackInSlot(int slot, ItemStack stack)`

## Description

A wrapper that composes another IItemHandlerModifiable, exposing only a range of the composed slots. Shifting of slot indices is handled automatically for you.
