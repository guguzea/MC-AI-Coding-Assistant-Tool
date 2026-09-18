---
title: "FluidHandlerFluidMap"
description: "FluidHandlerFluidMap is a template class for concatenating multiple handlers into one, where each handler is associated with a different fluid."
package: "net/minecraftforge/fluids/capability/templates"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/templates/FluidHandlerFluidMap.html"
sourceType: javadoc
---

# FluidHandlerFluidMap

## Class signature

```java
public class FluidHandlerFluidMap extends java.lang.Object implements IFluidHandler
```

## Constructors

- `public FluidHandlerFluidMap()`
- `public FluidHandlerFluidMap(java.util.Map< Fluid , IFluidHandler > handlers)`

## Methods

- `public FluidHandlerFluidMap addHandler( Fluid fluid, IFluidHandler handler)`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`

## Description

FluidHandlerFluidMap is a template class for concatenating multiple handlers into one, where each handler is associated with a different fluid.
