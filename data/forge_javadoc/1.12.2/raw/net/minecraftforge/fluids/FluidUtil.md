---
title: "FluidUtil"
description: "Destroys a block when a fluid is placed in the same position."
package: "net/minecraftforge/fluids"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/FluidUtil.html"
sourceType: javadoc
---

# FluidUtil

## Class signature

```java
public class FluidUtil extends java.lang.Object
```

## Methods

- `public static boolean interactWithFluidHandler( EntityPlayer player, EnumHand hand, World world, BlockPos pos, EnumFacing side)`
- `public static boolean interactWithFluidHandler( EntityPlayer player, EnumHand hand, IFluidHandler handler)`
- `public static FluidActionResult tryFillContainer( ItemStack container, IFluidHandler fluidSource, int maxAmount, EntityPlayer player, boolean doFill)`
- `public static FluidActionResult tryEmptyContainer( ItemStack container, IFluidHandler fluidDestination, int maxAmount, EntityPlayer player, boolean doDrain)`
- `@Deprecated public static FluidActionResult tryFillContainerAndStow( ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, EntityPlayer player)`
- `public static FluidActionResult tryFillContainerAndStow( ItemStack container, IFluidHandler fluidSource, IItemHandler inventory, int maxAmount, EntityPlayer player, boolean doFill)`
- `@Deprecated public static FluidActionResult tryEmptyContainerAndStow( ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, EntityPlayer player)`
- `public static FluidActionResult tryEmptyContainerAndStow( ItemStack container, IFluidHandler fluidDestination, IItemHandler inventory, int maxAmount, EntityPlayer player, boolean doDrain)`
- `public static FluidStack tryFluidTransfer( IFluidHandler fluidDestination, IFluidHandler fluidSource, int maxAmount, boolean doTransfer)`
- `public static FluidStack tryFluidTransfer( IFluidHandler fluidDestination, IFluidHandler fluidSource, FluidStack resource, boolean doTransfer)`
- `public static IFluidHandlerItem getFluidHandler( ItemStack itemStack)`
- `public static FluidStack getFluidContained( ItemStack container)`
- `public static IFluidHandler getFluidHandler( World world, BlockPos blockPos, EnumFacing side)`
- `public static FluidActionResult tryPickUpFluid( ItemStack emptyContainer, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side)`
- `public static FluidActionResult tryPlaceFluid( EntityPlayer player, World world, BlockPos pos, ItemStack container, FluidStack resource)`
- `public static boolean tryPlaceFluid( EntityPlayer player, World world, BlockPos pos, IFluidHandler fluidSource, FluidStack resource)`
- `public static void destroyBlockOnFluidPlacement( World world, BlockPos pos)`
- `public static ItemStack getFilledBucket( FluidStack fluidStack)`

## Description

Destroys a block when a fluid is placed in the same position.
