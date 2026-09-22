---
title: "IFluidTank"
description: "public interface IFluidTank"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/IFluidTank.html"
sourceType: javadoc
---

# IFluidTank

## Class signature

```java
public interface IFluidTank
```

## Methods

- `FluidStack drain(int maxDrain, boolean doDrain)`
- `int fill(FluidStack resource, boolean doFill)`
- `int getCapacity()`
- `FluidStack getFluid()`
- `int getFluidAmount()`
- `FluidTankInfo getInfo()` — Returns a wrapper object FluidTankInfo containing the capacity of the tank and the FluidStack it holds.
