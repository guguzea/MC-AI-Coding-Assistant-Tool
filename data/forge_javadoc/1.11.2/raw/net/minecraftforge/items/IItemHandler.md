---
title: "IItemHandler"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/IItemHandler.html"
sourceType: javadoc
---

# IItemHandler

## Class signature

```java
public interface IItemHandler
```

## Methods

- `int getSlots()`
- `@Nonnull ItemStack getStackInSlot(int slot)`
- `@Nonnull ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `@Nonnull ItemStack extractItem(int slot, int amount, boolean simulate)`
- `int getSlotLimit(int slot)`

## Description

Extracts an ItemStack from the given slot.
