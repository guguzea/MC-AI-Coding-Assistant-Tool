---
title: "ISidedInventory"
description: "public interface ISidedInventory extends IInventory"
package: "net/minecraft/inventory"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/inventory/ISidedInventory.html"
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
