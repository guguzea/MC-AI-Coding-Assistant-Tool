---
title: "EmptyFluidHandler"
description: "public class EmptyFluidHandler extends java.lang.Object implements IFluidHandler, IFluidTank"
package: "net/minecraftforge/fluids/capability/templates"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/templates/EmptyFluidHandler.html"
sourceType: javadoc
---

# EmptyFluidHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.templates.EmptyFluidHandler

## Class signature

```java
public class EmptyFluidHandler extends java.lang.Object implements IFluidHandler, IFluidTank
```

## Constructors

- `EmptyFluidHandler()`

## Methods

- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `int getCapacity()`
- `FluidStack getFluid()`
- `int getFluidAmount()`
- `FluidTankInfo getInfo()` — Returns a wrapper object FluidTankInfo containing the capacity of the tank and the FluidStack it holds.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.

## Fields

- `static FluidTankInfo EMPTY_TANK_INFO`
- `static IFluidTankProperties EMPTY_TANK_PROPERTIES`
- `static IFluidTankProperties [] EMPTY_TANK_PROPERTIES_ARRAY`
- `static EmptyFluidHandler INSTANCE`
