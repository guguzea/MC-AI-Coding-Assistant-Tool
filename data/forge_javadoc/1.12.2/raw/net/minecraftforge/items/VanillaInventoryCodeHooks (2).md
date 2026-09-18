---
title: "VanillaInventoryCodeHooks"
description: "Copied from BlockDropper#dispense and added capability support"
package: "net/minecraftforge/items"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/items/VanillaInventoryCodeHooks.html"
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

- `public static java.lang.Boolean extractHook( IHopper dest)`
- `public static boolean dropperInsertHook( World world, BlockPos pos, TileEntityDispenser dropper, int slot, ItemStack stack)`
- `public static boolean insertHook( TileEntityHopper hopper)`
- `public static <any> getItemHandler( World worldIn, double x, double y, double z, EnumFacing side)`

## Description

Copied from BlockDropper#dispense and added capability support
