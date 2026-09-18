---
title: "IItemHandler"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/items/IItemHandler.html"
sourceType: javadoc
---

# IItemHandler

## Class signature

```java
public interface IItemHandler
```

## Methods

- `int getSlots()`
- `ItemStack getStackInSlot(int slot)`
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Extracts an ItemStack from the given slot.
