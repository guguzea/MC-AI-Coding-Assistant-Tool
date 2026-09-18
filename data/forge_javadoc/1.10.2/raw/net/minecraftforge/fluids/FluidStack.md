---
title: "FluidStack"
description: "ItemStack substitute for Fluids. NOTE: Equality is based on the Fluid, not the amount. Use isFluidStackIdentical(FluidStack) to determine if FluidID, Amount and NBT Tag are all equal."
package: "net/minecraftforge/fluids"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/FluidStack.html"
sourceType: javadoc
---

# FluidStack

## Class signature

```java
public class FluidStack extends java.lang.Object
```

## Constructors

- `public FluidStack( Fluid fluid, int amount)`
- `public FluidStack( Fluid fluid, int amount, NBTTagCompound nbt)`
- `public FluidStack( FluidStack stack, int amount)`

## Methods

- `public static FluidStack loadFluidStackFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound nbt)`
- `public final Fluid getFluid()`
- `public java.lang.String getLocalizedName()`
- `public java.lang.String getUnlocalizedName()`
- `public FluidStack copy()`
- `public boolean isFluidEqual( FluidStack other)`
- `public static boolean areFluidStackTagsEqual( FluidStack stack1, FluidStack stack2)`
- `public boolean containsFluid( FluidStack other)`
- `public boolean isFluidStackIdentical( FluidStack other)`
- `public boolean isFluidEqual( ItemStack other)`
- `public final int hashCode()`
- `public final boolean equals(java.lang.Object o)`

## Description

ItemStack substitute for Fluids. NOTE: Equality is based on the Fluid, not the amount. Use isFluidStackIdentical(FluidStack) to determine if FluidID, Amount and NBT Tag are all equal.
