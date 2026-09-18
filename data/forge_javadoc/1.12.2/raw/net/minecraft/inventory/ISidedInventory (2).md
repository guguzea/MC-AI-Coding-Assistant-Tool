---
title: "ISidedInventory"
description: "public interface ISidedInventory extends IInventory"
package: "net/minecraft/inventory"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/inventory/ISidedInventory.html"
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
