---
title: "FluidHandlerFluidMap"
description: "public class FluidHandlerFluidMap extends java.lang.Object implements IFluidHandler"
package: "net/minecraftforge/fluids/capability/templates"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/capability/templates/FluidHandlerFluidMap.html"
sourceType: javadoc
---

# FluidHandlerFluidMap

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.templates.FluidHandlerFluidMap

## Class signature

```java
public class FluidHandlerFluidMap extends java.lang.Object implements IFluidHandler
```

## Constructors

- `FluidHandlerFluidMap()`
- `FluidHandlerFluidMap(java.util.Map<Fluid, IFluidHandler> handlers)`

## Methods

- `FluidHandlerFluidMap addHandler(Fluid fluid, IFluidHandler handler)`
- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.

## Fields

- `protected java.util.Map<Fluid, IFluidHandler> handlers`
