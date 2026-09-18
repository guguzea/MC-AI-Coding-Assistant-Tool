---
title: "FluidHandlerConcatenate"
description: "FluidHandlerConcatenate is a template class for concatenating multiple handlers into one. If each tank is restricted to exactly one type of fluid, then use FluidHandlerFluidMap as it is more efficient"
package: "net/minecraftforge/fluids/capability/templates"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/templates/FluidHandlerConcatenate.html"
sourceType: javadoc
---

# FluidHandlerConcatenate

## Class signature

```java
public class FluidHandlerConcatenate extends java.lang.Object implements IFluidHandler
```

## Constructors

- `public FluidHandlerConcatenate( IFluidHandler ... subHandlers)`
- `public FluidHandlerConcatenate(java.util.Collection< IFluidHandler > subHandlers)`

## Methods

- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

FluidHandlerConcatenate is a template class for concatenating multiple handlers into one. If each tank is restricted to exactly one type of fluid, then use FluidHandlerFluidMap as it is more efficient
