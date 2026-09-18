---
title: "IFluidTank"
description: "A tank is the unit of interaction with Fluid inventories. A reference implementation can be found at FluidTank ."
package: "net/minecraftforge/fluids"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/IFluidTank.html"
sourceType: javadoc
---

# IFluidTank

## Class signature

```java
public interface IFluidTank
```

## Methods

- `@Nullable FluidStack getFluid()`
- `int getFluidAmount()`
- `int getCapacity()`
- `FluidTankInfo getInfo()`
- `int fill( FluidStack resource, boolean doFill)`
- `@Nullable FluidStack drain(int maxDrain, boolean doDrain)`

## Description

A tank is the unit of interaction with Fluid inventories. A reference implementation can be found at FluidTank .
