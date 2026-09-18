---
title: "EmptyFluidHandler"
description: "Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler."
package: "net/minecraftforge/fluids/capability/templates"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/templates/EmptyFluidHandler.html"
sourceType: javadoc
---

# EmptyFluidHandler

## Class signature

```java
public class EmptyFluidHandler extends java.lang.Object implements IFluidHandler , IFluidTank
```

## Constructors

- `protected EmptyFluidHandler()`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `@Nullable public FluidStack getFluid()`
- `public int getFluidAmount()`
- `public int getCapacity()`
- `public FluidTankInfo getInfo()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
