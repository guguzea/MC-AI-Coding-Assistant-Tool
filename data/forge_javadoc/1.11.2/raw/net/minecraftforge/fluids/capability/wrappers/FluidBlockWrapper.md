---
title: "FluidBlockWrapper"
description: "Wrapper to handle IFluidBlock as an IFluidHandler"
package: "net/minecraftforge/fluids/capability/wrappers"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/wrappers/FluidBlockWrapper.html"
sourceType: javadoc
---

# FluidBlockWrapper

## Class signature

```java
public class FluidBlockWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `public FluidBlockWrapper( IFluidBlock fluidBlock, World world, BlockPos blockPos)`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `@Nullable public FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Wrapper to handle IFluidBlock as an IFluidHandler
