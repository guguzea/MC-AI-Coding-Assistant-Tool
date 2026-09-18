---
title: "IItemHandler"
description: "Extracts an ItemStack from the given slot."
package: "net/minecraftforge/items"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/items/IItemHandler.html"
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
