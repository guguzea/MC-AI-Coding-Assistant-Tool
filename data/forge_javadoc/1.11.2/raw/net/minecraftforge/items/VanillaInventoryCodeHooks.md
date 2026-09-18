---
title: "VanillaInventoryCodeHooks"
description: "Copied from BlockDropper#dispense and added capability support"
package: "net/minecraftforge/items"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/VanillaInventoryCodeHooks.html"
sourceType: javadoc
---

# VanillaInventoryCodeHooks

## Class signature

```java
public class VanillaInventoryCodeHooks extends java.lang.Object
```

## Constructors

- `public VanillaInventoryCodeHooks()`

## Methods

- `@Nullable public static java.lang.Boolean extractHook( IHopper dest)`
- `public static boolean dropperInsertHook( World world, BlockPos pos, TileEntityDispenser dropper, int slot, @Nonnull ItemStack stack)`
- `public static boolean insertHook( TileEntityHopper hopper)`
- `@Nullable public static org.apache.commons.lang3.tuple.Pair< IItemHandler ,java.lang.Object> getItemHandler( World worldIn, double x, double y, double z, EnumFacing side)`

## Description

Copied from BlockDropper#dispense and added capability support
