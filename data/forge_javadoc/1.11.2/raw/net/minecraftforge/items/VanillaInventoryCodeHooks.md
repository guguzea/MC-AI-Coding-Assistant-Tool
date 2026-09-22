---
title: "VanillaInventoryCodeHooks"
description: "public class VanillaInventoryCodeHooks extends java.lang.Object"
package: "net/minecraftforge/items"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/VanillaInventoryCodeHooks.html"
sourceType: javadoc
---

# VanillaInventoryCodeHooks

**Inheritance:** java.lang.Object → net.minecraftforge.items.VanillaInventoryCodeHooks

## Class signature

```java
public class VanillaInventoryCodeHooks extends java.lang.Object
```

## Constructors

- `VanillaInventoryCodeHooks()`

## Methods

- `static boolean dropperInsertHook(World world, BlockPos pos, TileEntityDispenser dropper, int slot, ItemStack stack)` — Copied from BlockDropper#dispense and added capability support
- `static java.lang.Boolean extractHook(IHopper dest)` — Copied from TileEntityHopper#captureDroppedItems and added capability support
- `static org.apache.commons.lang3.tuple.Pair<IItemHandler, java.lang.Object> getItemHandler(World worldIn, double x, double y, double z, EnumFacing side)`
- `static boolean insertHook(TileEntityHopper hopper)` — Copied from TileEntityHopper#transferItemsOut and added capability support
