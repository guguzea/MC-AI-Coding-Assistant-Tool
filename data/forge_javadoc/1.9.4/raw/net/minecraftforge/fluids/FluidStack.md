---
title: "FluidStack"
description: "public class FluidStack extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidStack.html"
sourceType: javadoc
---

# FluidStack

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidStack

## Class signature

```java
public class FluidStack extends java.lang.Object
```

## Constructors

- `FluidStack(Fluid fluid, int amount)`
- `FluidStack(Fluid fluid, int amount, NBTTagCompound nbt)`
- `FluidStack(FluidStack stack, int amount)`

## Methods

- `static boolean areFluidStackTagsEqual(FluidStack stack1, FluidStack stack2)` — Determines if the NBT Tags are equal.
- `boolean containsFluid(FluidStack other)` — Determines if the Fluids are equal and this stack is larger.
- `FluidStack copy()`
- `boolean equals(java.lang.Object o)` — Default equality comparison for a FluidStack.
- `Fluid getFluid()`
- `java.lang.String getLocalizedName()`
- `java.lang.String getUnlocalizedName()`
- `int hashCode()`
- `boolean isFluidEqual(FluidStack other)` — Determines if the FluidIDs and NBT Tags are equal.
- `boolean isFluidEqual(ItemStack other)` — Determines if the FluidIDs and NBT Tags are equal compared to a registered container ItemStack.
- `boolean isFluidStackIdentical(FluidStack other)` — Determines if the FluidIDs, Amounts, and NBT Tags are all equal.
- `static FluidStack loadFluidStackFromNBT(NBTTagCompound nbt)` — This provides a safe method for retrieving a FluidStack - if the Fluid is invalid, the stack will return as null.
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`

## Fields

- `int amount`
- `NBTTagCompound tag`
