---
title: "FluidRegistry"
description: "Handles Fluid registrations. Fluids MUST be registered in order to function."
package: "net/minecraftforge/fluids"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/FluidRegistry.html"
sourceType: javadoc
---

# FluidRegistry

## Class signature

```java
public abstract class FluidRegistry extends java.lang.Object
```

## Methods

- `public static void initFluidIDs(com.google.common.collect.BiMap< Fluid ,java.lang.Integer> newfluidIDs, java.util.Set<java.lang.String> defaultNames)`
- `public static boolean registerFluid( Fluid fluid)`
- `public static boolean isFluidDefault( Fluid fluid)`
- `public static boolean isFluidRegistered( Fluid fluid)`
- `public static boolean isFluidRegistered(java.lang.String fluidName)`
- `public static Fluid getFluid(java.lang.String fluidName)`
- `public static java.lang.String getFluidName( Fluid fluid)`
- `public static java.lang.String getFluidName( FluidStack stack)`
- `@Nullable public static FluidStack getFluidStack(java.lang.String fluidName, int amount)`
- `public static java.util.Map<java.lang.String, Fluid > getRegisteredFluids()`
- `@Deprecated public static java.util.Map< Fluid ,java.lang.Integer> getRegisteredFluidIDs()`
- `public static void enableUniversalBucket()`
- `public static boolean isUniversalBucketEnabled()`
- `public static boolean addBucketForFluid( Fluid fluid)`
- `public static java.util.Set< Fluid > getBucketFluids()`
- `public static Fluid lookupFluidForBlock( Block block)`
- `public static int getMaxID()`
- `public static java.lang.String getDefaultFluidName( Fluid key)`
- `public static void loadFluidDefaults( NBTTagCompound tag)`
- `public static void writeDefaultFluidList( NBTTagCompound forgeData)`
- `public static void validateFluidRegistry()`

## Description

Handles Fluid registrations. Fluids MUST be registered in order to function.
