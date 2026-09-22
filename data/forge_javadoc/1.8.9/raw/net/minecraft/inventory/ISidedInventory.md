---
title: "ISidedInventory"
description: "public interface ISidedInventory extends IInventory"
package: "net/minecraft/inventory"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/inventory/ISidedInventory.html"
sourceType: javadoc
---

# ISidedInventory

## Class signature

```java
public interface ISidedInventory extends IInventory
```

## Methods

- `boolean canExtractItem(int index, ItemStack stack, EnumFacing direction)` — Returns true if automation can extract the given item in the given slot from the given side.
- `boolean canInsertItem(int index, ItemStack itemStackIn, EnumFacing direction)` — Returns true if automation can insert the given item in the given slot from the given side.
- `int[] getSlotsForFace(EnumFacing side)`
