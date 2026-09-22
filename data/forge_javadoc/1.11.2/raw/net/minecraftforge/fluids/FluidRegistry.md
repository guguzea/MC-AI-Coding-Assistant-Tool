---
title: "FluidRegistry"
description: "public abstract class FluidRegistry extends java.lang.Object"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/FluidRegistry.html"
sourceType: javadoc
---

# FluidRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidRegistry

## Class signature

```java
public abstract class FluidRegistry extends java.lang.Object
```

## Methods

- `static boolean addBucketForFluid(Fluid fluid)` — Registers a fluid with the universal bucket.
- `static void enableUniversalBucket()` — Enables the universal bucket in forge.
- `static java.util.Set<Fluid> getBucketFluids()` — All fluids registered with the universal bucket
- `static java.lang.String getDefaultFluidName(Fluid key)`
- `static Fluid getFluid(java.lang.String fluidName)`
- `static java.lang.String getFluidName(Fluid fluid)`
- `static java.lang.String getFluidName(FluidStack stack)`
- `static FluidStack getFluidStack(java.lang.String fluidName, int amount)`
- `static int getMaxID()`
- `@Deprecated static java.util.Map<Fluid, java.lang.Integer> getRegisteredFluidIDs()`
- `static java.util.Map<java.lang.String, Fluid> getRegisteredFluids()` — Returns a read-only map containing Fluid Names and their associated Fluids.
- `static void initFluidIDs(com.google.common.collect.BiMap<Fluid, java.lang.Integer> newfluidIDs, java.util.Set<java.lang.String> defaultNames)` — Called by Forge to prepare the ID map for server -> client sync.
- `static boolean isFluidDefault(Fluid fluid)` — Is the supplied fluid the current default fluid for it's name
- `static boolean isFluidRegistered(Fluid fluid)` — Does the supplied fluid have an entry for it's name (whether or not the fluid itself is default)
- `static boolean isFluidRegistered(java.lang.String fluidName)`
- `static boolean isUniversalBucketEnabled()`
- `static void loadFluidDefaults(NBTTagCompound tag)`
- `static Fluid lookupFluidForBlock(Block block)`
- `static boolean registerFluid(Fluid fluid)` — Register a new Fluid.
- `static void validateFluidRegistry()`
- `static void writeDefaultFluidList(NBTTagCompound forgeData)`

## Fields

- `static Fluid LAVA`
- `static Fluid WATER`
