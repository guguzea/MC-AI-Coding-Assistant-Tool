---
title: "VoidFluidHandler"
description: "VoidFluidHandler is a template fluid handler that can be filled indefinitely without ever getting full. It does not store fluid that gets filled into it, but \"destroys\" it upon receiving it."
package: "net/minecraftforge/fluids/capability/templates"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/templates/VoidFluidHandler.html"
sourceType: javadoc
---

# VoidFluidHandler

## Class signature

```java
public class VoidFluidHandler extends java.lang.Object implements IFluidHandler , IFluidTank
```

## Constructors

- `public VoidFluidHandler()`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public FluidStack getFluid()`
- `public int getFluidAmount()`
- `public int getCapacity()`
- `public FluidTankInfo getInfo()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

VoidFluidHandler is a template fluid handler that can be filled indefinitely without ever getting full. It does not store fluid that gets filled into it, but "destroys" it upon receiving it.
