---
title: "VanillaInventoryCodeHooks"
description: "public class VanillaInventoryCodeHooks extends java.lang.Object"
package: "net/minecraftforge/items"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/items/VanillaInventoryCodeHooks.html"
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
- `static<any> getItemHandler(World worldIn, double x, double y, double z, EnumFacing side)`
- `static boolean insertHook(TileEntityHopper hopper)` — Copied from TileEntityHopper#transferItemsOut and added capability support
