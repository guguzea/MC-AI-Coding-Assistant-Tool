---
title: "InvWrapper"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items/wrapper"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/wrapper/InvWrapper.html"
sourceType: javadoc
---

# InvWrapper

## Class signature

```java
public class InvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public InvWrapper( IInventory inv)`

## Methods

- `public boolean equals(java.lang.Object o)`
- `public int hashCode()`
- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public IInventory getInv()`

## Description

Extracts an ItemStack from the given slot.
