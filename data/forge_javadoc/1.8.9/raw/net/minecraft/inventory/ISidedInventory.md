---
title: "ISidedInventory"
description: "Returns true if automation can extract the given item in the given slot from the given side."
package: "net/minecraft/inventory"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ISidedInventory.html"
sourceType: javadoc
---

# ISidedInventory

## Class signature

```java
public interface ISidedInventory extends IInventory
```

## Methods

- `int[] getSlotsForFace( EnumFacing side)`
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)`
- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)`

## Description

Returns true if automation can extract the given item in the given slot from the given side.
