---
title: "IFluidHandler"
description: "Implement this interface as a capability which should handle fluids, generally storing them in one or more internal IFluidTank objects. A reference implementation is provided TileFluidHandler ."
package: "net/minecraftforge/fluids/capability"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/IFluidHandler.html"
sourceType: javadoc
---

# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `IFluidTankProperties [] getTankProperties()`
- `int fill( FluidStack resource, boolean doFill)`
- `@Nullable FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable FluidStack drain(int maxDrain, boolean doDrain)`

## Description

Implement this interface as a capability which should handle fluids, generally storing them in one or more internal IFluidTank objects. A reference implementation is provided TileFluidHandler .
