---
title: "FluidContainerRegistry"
description: "Deprecated."
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidContainerRegistry.html"
sourceType: javadoc
---

# FluidContainerRegistry

## Methods

- `public static boolean registerFluidContainer( FluidStack stack, ItemStack filledContainer, ItemStack emptyContainer)`
- `public static boolean registerFluidContainer( Fluid fluid, ItemStack filledContainer, ItemStack emptyContainer)`
- `public static boolean registerFluidContainer( FluidStack stack, ItemStack filledContainer)`
- `public static boolean registerFluidContainer( Fluid fluid, ItemStack filledContainer)`
- `public static boolean registerFluidContainer( FluidContainerRegistry.FluidContainerData data)`
- `public static FluidStack getFluidForFilledItem( ItemStack container)`
- `public static ItemStack fillFluidContainer( FluidStack fluid, ItemStack container)`
- `public static ItemStack drainFluidContainer( ItemStack container)`
- `public static int getContainerCapacity( ItemStack container)`
- `public static int getContainerCapacity( FluidStack fluid, ItemStack container)`
- `public static boolean containsFluid( ItemStack container, FluidStack fluid)`
- `public static boolean isBucket( ItemStack container)`
- `public static boolean isContainer( ItemStack container)`
- `public static boolean isEmptyContainer( ItemStack container)`
- `public static boolean isFilledContainer( ItemStack container)`
- `public static FluidContainerRegistry.FluidContainerData [] getRegisteredFluidContainerData()`

## Description

Deprecated.
