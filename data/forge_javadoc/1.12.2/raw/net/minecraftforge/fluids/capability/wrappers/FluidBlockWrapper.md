---
title: "FluidBlockWrapper"
description: "public class FluidBlockWrapper extends java.lang.Object implements IFluidHandler"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/wrappers/FluidBlockWrapper.html"
sourceType: javadoc
---

# FluidBlockWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.wrappers.FluidBlockWrapper

## Class signature

```java
public class FluidBlockWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `FluidBlockWrapper(IFluidBlock fluidBlock, World world, BlockPos blockPos)`

## Methods

- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.

## Fields

- `protected BlockPos blockPos`
- `protected IFluidBlock fluidBlock`
- `protected World world`
