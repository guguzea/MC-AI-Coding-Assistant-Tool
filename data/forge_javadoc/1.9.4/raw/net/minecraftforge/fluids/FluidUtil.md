---
title: "FluidUtil"
description: "Returns true if interaction was successful."
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidUtil.html"
sourceType: javadoc
---

# FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `public static boolean interactWithTank( ItemStack stack, EntityPlayer player, IFluidHandler tank, EnumFacing side)`
- `@Deprecated public static ItemStack tryFillBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `public static ItemStack tryFillBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `@Deprecated public static ItemStack tryEmptyBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side)`
- `public static ItemStack tryEmptyBucket( ItemStack bucket, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `public static boolean tryFillFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `public static boolean tryEmptyFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, EntityPlayer player)`
- `public static boolean tryFillFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)`
- `public static boolean tryEmptyFluidContainerItem( ItemStack container, IFluidHandler tank, EnumFacing side, IItemHandler inventory, int max, EntityPlayer player)`

## Description

Returns true if interaction was successful.
