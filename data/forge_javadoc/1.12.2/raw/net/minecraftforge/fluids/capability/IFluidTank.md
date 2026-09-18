---
title: "IFluidTank"
description: "A tank is the unit of interaction with Fluid inventories. A reference implementation can be found at FluidTank ."
package: "net/minecraftforge/fluids/capability"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/IFluidTank.html"
sourceType: javadoc
---

# IFluidTank

## Class signature

```java
public interface IFluidTank
```

## Methods

- `FluidStack getFluid()`
- `int getFluidAmount()`
- `int getCapacity()`
- `FluidTankInfo getInfo()`
- `int fill( FluidStack resource, boolean doFill)`
- `FluidStack drain(int maxDrain, boolean doDrain)`

## Description

A tank is the unit of interaction with Fluid inventories. A reference implementation can be found at FluidTank .
